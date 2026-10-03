# Blog maintenance

这个主页使用 Astro 静态生成。Blog 文章和本地 notes 都是 Markdown，内容进入 Git 后由 GitHub Actions 构建成静态页面。

## 目录

- `src/content/notes/`：本地优先的未成熟记录、论文阅读、实验失败和草稿。
- `src/content/blog/`：整理完成、可以公开的文章。
- `src/content/research/`：研究方向和长期问题的记录。
- `src/content/projects/`：项目页面的预留目录。
- `public/assets/`：图片、图标和其他静态资源。

当前这些内容目录为空，Blog 页面会显示空状态。添加第一篇文章时，创建例如 `src/content/blog/first-note.md`：

```md
---
title: "文章标题"
date: 2026-10-03
category: "Research"
summary: "一段用于列表页的摘要。"
tags: ["Agent", "evaluation"]
draft: false
nextSteps:
  - "下一步问题"
---

正文使用普通 Markdown。

行内公式：$E = mc^2$

块级公式：

$$
\\nabla_\\theta J(\\theta)
$$

图片可以放到 `public/assets/`，然后在 Markdown 中引用：

![图片说明](/Theo.github.io/assets/img/example.png)
```

`draft: true` 的内容会保留在本地内容集合里，但不会进入公开 Blog。把 note 整理成公开文章时，复制到 `src/content/blog/`，补齐 frontmatter，把 `draft` 改为 `false`，然后提交并推送。

## 本地命令

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

Astro 使用 `remark-math` 和 `rehype-katex` 渲染 LaTeX，Markdown 原生支持标题、列表、链接、图片、代码块、引用和 HTML/SVG 图标。GitHub Pages 使用 `.github/workflows/pages.yml`，推送 `main` 后自动运行 `npm ci`、`npm run build` 并部署 `dist/`。
