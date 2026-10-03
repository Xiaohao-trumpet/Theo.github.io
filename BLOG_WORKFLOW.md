# Blog 维护说明

这个站点沿用 `w-r-s/academic-homepage-template` 的静态 HTML/CSS/JavaScript 技术栈，不需要 Node、Astro 或构建步骤。GitHub Pages 直接发布仓库根目录。

## 发布一篇公开文章

1. 在本地先把想法记录到私人 notes；整理完成并确认可以公开后，再继续下面的步骤。
2. 在 `content/blog/` 新建一个 Markdown 文件，例如 `agent-eval.md`。
3. 在 `blog/posts.json` 增加一条索引：

```json
[
  {
    "slug": "agent-eval",
    "title": "文章标题",
    "date": "2026-10-03",
    "category": "Research",
    "summary": "一两句摘要。",
    "tags": ["Agent", "Evaluation"],
    "file": "agent-eval.md",
    "nextSteps": ["下一步问题"]
  }
]
```

4. 访问 `blog/article.html?slug=agent-eval` 检查文章。
5. 提交并推送 `blog/posts.json` 与 `content/blog/agent-eval.md`。

## Markdown 能力

文章正文使用 GitHub Flavored Markdown，由浏览器加载的 Marked 渲染，支持标题、列表、表格、代码块、引用、链接、图片和原始 HTML/SVG。数学公式由 KaTeX 渲染：

```markdown
行内公式：$E=mc^2$

$$
\mathcal{L}(\theta) = \mathbb{E}_{x \sim D}[\log p_\theta(x)]
$$
```

图片可以引用仓库里的相对路径，例如从 `content/blog/` 中写 `../../images/template/avatar.jpg`，也可以在发布前把文章专用图片放在 `images/blog/`。

## 本地预览

在仓库根目录运行：

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

然后打开 `http://127.0.0.1:8080/`。因为文章和索引通过 `fetch` 读取，不能直接双击 HTML 文件预览。

目前 `blog/posts.json` 为空，所以公开 Blog 只显示框架提示，不包含尚未确认的论文、项目或研究结果。
