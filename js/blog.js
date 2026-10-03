(function () {
  'use strict';

  var article = document.getElementById('article');
  if (!article) return;

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character];
    });
  }

  function removeFrontmatter(markdown) {
    return markdown.replace(/^---[\s\S]*?---\s*/, '');
  }

  function protectMath(markdown) {
    var formulas = [];
    var protectedMarkdown = markdown.replace(/\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$(?!\$)[^\n$]+?\$(?!\$)/g, function (formula) {
      var token = 'MATHPLACEHOLDER' + formulas.length;
      formulas.push(formula);
      return token;
    });
    return { markdown: protectedMarkdown, formulas: formulas };
  }

  function restoreMath(html, formulas) {
    return html.replace(/MATHPLACEHOLDER(\d+)/g, function (match, index) {
      return '<span class="math-source">' + escapeHtml(formulas[Number(index)]) + '</span>';
    });
  }

  function renderMath() {
    if (window.renderMathInElement) {
      window.renderMathInElement(article, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }

  var slug = new URLSearchParams(window.location.search).get('slug');
  if (!slug) {
    article.innerHTML = '<h1>找不到这篇文章</h1><p>请从 Blog 列表进入文章。</p>';
    return;
  }

  fetch('posts.json').then(function (response) {
    if (!response.ok) throw new Error('posts.json unavailable');
    return response.json();
  }).then(function (posts) {
    var post = posts.find(function (item) { return item.slug === slug; });
    if (!post) throw new Error('post not found');
    document.title = post.title + ' | 周晓昊';
    return fetch('../content/blog/' + encodeURIComponent(post.file)).then(function (response) {
      if (!response.ok) throw new Error('markdown unavailable');
      return response.text();
    }).then(function (markdown) {
      if (!window.marked) throw new Error('marked unavailable');
      var tags = (post.tags || []).map(function (tag) { return '<span class="blog-tag">' + escapeHtml(tag) + '</span>'; }).join('');
      var protectedMarkdown = protectMath(removeFrontmatter(markdown));
      var renderedMarkdown = restoreMath(window.marked.parse(protectedMarkdown.markdown, { breaks: true, gfm: true }), protectedMarkdown.formulas);
      article.innerHTML = '<header class="article-header"><p class="blog-kicker">' + escapeHtml(post.category || 'Research') + ' · ' + escapeHtml(post.date) + '</p><h1>' + escapeHtml(post.title) + '</h1><p class="article-summary">' + escapeHtml(post.summary) + '</p><div class="blog-tags">' + tags + '</div></header><div class="markdown-body">' + renderedMarkdown + '</div>' + (post.nextSteps && post.nextSteps.length ? '<aside class="next-steps"><strong>Next steps</strong><ul>' + post.nextSteps.map(function (step) { return '<li>' + escapeHtml(step) + '</li>'; }).join('') + '</ul></aside>' : '');
      renderMath();
    });
  }).catch(function () {
    article.innerHTML = '<h1>文章暂不可用</h1><p>请确认 blog/posts.json 和 content/blog/ 中的文件名一致。</p>';
  });
}());
