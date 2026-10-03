(function () {
  'use strict';

  var themeToggle = document.getElementById('theme-toggle');
  var paletteToggle = document.getElementById('palette-toggle');
  var root = document.documentElement;
  var savedTheme = localStorage.getItem('clean-tem-theme');
  var savedPalette = localStorage.getItem('clean-tem-palette');
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  function setTheme(theme) {
    var isDark = theme === 'dark';
    root.dataset.theme = isDark ? 'dark' : 'light';
    if (themeToggle) {
      themeToggle.textContent = isDark ? '☀' : '☾';
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('aria-label', isDark ? '切换浅色模式' : '切换夜间模式');
      themeToggle.title = isDark ? '切换浅色模式' : '切换夜间模式';
    }
    localStorage.setItem('clean-tem-theme', isDark ? 'dark' : 'light');
  }

  function setPalette(palette) {
    var isBlue = palette === 'blue';
    root.dataset.palette = isBlue ? 'blue' : 'paper';
    if (paletteToggle) {
      paletteToggle.textContent = isBlue ? '●' : '◈';
      paletteToggle.setAttribute('aria-pressed', String(isBlue));
      paletteToggle.setAttribute('aria-label', isBlue ? '切换白色默认色系' : '切换蓝色色系');
      paletteToggle.title = isBlue ? '切换白色默认色系' : '切换蓝色色系';
    }
    localStorage.setItem('clean-tem-palette', isBlue ? 'blue' : 'paper');
  }

  setPalette(savedPalette || 'paper');
  setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
  if (paletteToggle) {
    paletteToggle.addEventListener('click', function () {
      setPalette(root.dataset.palette === 'blue' ? 'paper' : 'blue');
    });
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character];
    });
  }

  function formatDate(value) {
    var date = new Date(value + 'T00:00:00');
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  }

  function postsUrl() {
    return document.body.classList.contains('blog-page') ? 'posts.json' : 'blog/posts.json';
  }

  function renderPosts(posts) {
    var list = document.getElementById('blog-list');
    if (!list) return;
    if (!posts.length) {
      list.innerHTML = '<p class="blog-empty">Blog 框架已搭好，暂时没有公开文章。第一篇文章 TBD。</p>';
      return;
    }
    list.innerHTML = posts.slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); }).map(function (post) {
      var tags = (post.tags || []).map(function (tag) { return '<span class="blog-tag">' + escapeHtml(tag) + '</span>'; }).join('');
      var href = document.body.classList.contains('blog-page') ? 'article.html?slug=' + encodeURIComponent(post.slug) : 'blog/article.html?slug=' + encodeURIComponent(post.slug);
      return '<article class="blog-row"><time datetime="' + escapeHtml(post.date) + '">' + escapeHtml(formatDate(post.date)) + '</time><div class="blog-row-main"><h2><a href="' + href + '">' + escapeHtml(post.title) + '</a></h2><p>' + escapeHtml(post.summary) + '</p><div class="blog-tags">' + tags + '</div></div><a class="blog-arrow" href="' + href + '" aria-label="阅读 ' + escapeHtml(post.title) + '">↗</a></article>';
    }).join('');
  }

  var list = document.getElementById('blog-list');
  if (list) {
    fetch(postsUrl()).then(function (response) {
      if (!response.ok) throw new Error('posts.json unavailable');
      return response.json();
    }).then(renderPosts).catch(function () {
      list.innerHTML = '<p class="blog-empty">暂时无法读取 Blog 索引，请检查 blog/posts.json。</p>';
    });
  }
}());
