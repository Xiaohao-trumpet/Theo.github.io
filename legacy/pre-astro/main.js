const posts = [
  {
    slug: "research-log-starts-here",
    title: "研究记录从哪里开始",
    date: "2026-09-28",
    category: "Notes",
    kind: "草稿",
    summary: "把未成熟的问题、实验观察和下一步假设放进一个可以持续维护的研究日志。",
    tags: ["research process", "notes"],
    source: "content/notes/research-log-starts-here.md",
    body: `
      <p>这是一篇用于搭建研究日志结构的草稿。它不试图给出一个已经完成的答案，只记录我希望长期追踪的问题：一个 agent 的能力如何被拆解、如何被观察，以及哪些结论值得被公开写下来。</p>
      <p>公开 blog 会保留已经整理过、可以公开的内容；私人 notes 则可以容纳论文阅读、实验失败、讨论和草稿。两层内容共享相同的字段，让后续从 note 整理成文章时不需要重新设计结构。</p>
      <h2>接下来要记录什么</h2>
      <ul><li>清楚写下问题和假设，而不是只写最后的结论。</li><li>记录 evaluator、trajectory 和 harness 的边界。</li><li>区分已验证的观察、待验证的猜测和暂时无法公开的细节。</li></ul>
    `,
    nextSteps: ["为每篇 note 增加假设、证据和反例字段。", "把可公开的实验观察整理成独立 blog。"]
  },
  {
    slug: "terminal-agent-evaluation-questions",
    title: "关于 Terminal Agent 评测的几个问题",
    date: "2026-09-18",
    category: "Research",
    kind: "研究问题",
    summary: "从任务完成率之外，继续追问轨迹质量、失败恢复和 harness 设计应该如何被观察。",
    tags: ["Terminal Agent", "evaluation", "harness"],
    source: "content/research/terminal-agent-evaluation-questions.md",
    body: `
      <p>Terminal Agent 需要在命令、文件、状态和反馈之间持续行动。单一的最终分数很难解释它为什么成功或失败，因此评测设计需要保留足够的过程信息。</p>
      <h2>我想继续追踪的维度</h2>
      <ul><li><strong>任务结果：</strong>目标是否完成，输出是否满足约束。</li><li><strong>轨迹质量：</strong>行动是否可复现，是否出现无效循环或不可解释的跳转。</li><li><strong>失败恢复：</strong>环境变化或工具报错后，agent 能否识别并修正策略。</li><li><strong>评测成本：</strong>数据构造、运行时间和人工检查之间如何平衡。</li></ul>
      <p>这篇内容目前是问题清单，不代表已经完成的实验结论。后续会把具体 benchmark、evaluator 和 harness 设计拆成更小的记录。</p>
    `,
    nextSteps: ["整理 terminal interaction 的最小事件格式。", "比较结果指标与轨迹指标在诊断上的差异。"]
  },
  {
    slug: "reading-rl-and-rlvr-for-agents",
    title: "阅读线索：RL / RLVR 与 Agent Systems",
    date: "2026-08-30",
    category: "Reading",
    kind: "阅读笔记",
    summary: "一个持续更新的阅读入口：把奖励、验证器、数据构造和 agent 系统的接口放在一起看。",
    tags: ["RL", "RLVR", "agent systems"],
    source: "content/notes/reading-rl-and-rlvr-for-agents.md",
    body: `
      <p>我目前关注 RL 和 RLVR 如何进入 agent systems：奖励从哪里来，验证器在什么层级工作，以及训练后的策略是否能在不同环境中保持稳定。</p>
      <p>阅读时会特别记录数据构造、trajectory 表示和 evaluator 的关系。相同的模型，如果任务定义、反馈回路或验证器不同，最终呈现的能力可能并不容易直接比较。</p>
      <h2>阅读模板</h2>
      <ul><li>论文试图解决的任务边界是什么？</li><li>奖励或验证信号依赖哪些假设？</li><li>数据、训练、评测之间是否存在泄漏或错位？</li><li>哪些结果可以迁移到 Terminal Agent 或 Code Agent？</li></ul>
    `,
    nextSteps: ["补充论文出处和可复现实验入口。", "为 RLVR 相关概念维护一份术语表。"]
  }
];

const researchAreas = [
  { number: "01", title: "Agent & 基础模型", text: "关注 agent 如何理解任务、调用工具、维护状态，并与基础模型的训练和推理能力衔接。", tags: ["agent systems", "foundation models"] },
  { number: "02", title: "Terminal / Code Agent", text: "围绕终端和代码环境中的规划、行动、反馈与失败恢复，记录可复用的系统设计问题。", tags: ["Terminal Agent", "Code Agent"] },
  { number: "03", title: "RL / RLVR", text: "追踪强化学习、可验证奖励、数据构造和训练信号如何影响 agent 的行为。", tags: ["RL", "RLVR", "training"] },
  { number: "04", title: "ALE / Benchmark / Evaluator", text: "把 benchmark、evaluator、trajectory 和 harness 当成研究对象，尝试让结果更可解释、更容易复现。", tags: ["ALE", "benchmark", "evaluator", "harness"] }
];

const routeLabels = { home: "Home", blog: "Blog", research: "Research", projects: "Projects", now: "Now", about: "About" };
const app = document.querySelector("#app");
const year = document.querySelector("#year");
year.textContent = new Date().getFullYear();

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (char) => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;"}[char]));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function metaLine(post) {
  return `<div class="post-meta"><span>${formatDate(post.date)}</span><span class="meta-dot">·</span><span>${escapeHtml(post.category)}</span><span class="status-pill">${escapeHtml(post.kind)}</span></div>`;
}

function tagList(tags) {
  return `<div class="tag-list">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>`;
}

function postCard(post, compact = false) {
  return `<article class="post-card${compact ? " post-card--compact" : ""}">
    <div class="post-card-main"><a class="post-title" href="#post/${post.slug}">${escapeHtml(post.title)}</a>${metaLine(post)}<p>${escapeHtml(post.summary)}</p>${tagList(post.tags)}</div>
    <a class="read-link" href="#post/${post.slug}" aria-label="阅读：${escapeHtml(post.title)}">Read <span aria-hidden="true">↗</span></a>
  </article>`;
}

function pageHeader(kicker, title, intro) {
  return `<div class="page-header"><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="page-intro">${intro}</p></div>`;
}

function homePage() {
  const featured = posts.slice(0, 2).map((post) => postCard(post, true)).join("");
  return `<div class="page page-home">
    <section class="hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">RESEARCH LOG · 2026</p>
        <h1>把问题写下来，<em>再继续验证。</em></h1>
        <p class="hero-lede">我是重庆大学人工智能专业本科生，已申请上岸复旦大学计算机直博。这里是我的研究博客，记录 Agent 与基础模型方向的技术思考、论文阅读、实验日志和仍在形成中的问题。</p>
        <div class="hero-actions"><a class="button button--primary" href="#blog">进入 Blog <span aria-hidden="true">↗</span></a><a class="text-link" href="#about">了解我 <span aria-hidden="true">→</span></a></div>
      </div>
      <aside class="hero-note" aria-label="当前研究范围"><div class="note-pin">CURRENT FOCUS</div><p>Terminal Agent<br />Code Agent<br />RL / RLVR<br />ALE · evaluator · harness</p><span class="note-foot">持续整理中 / work in progress</span></aside>
    </section>
    <section class="signal-row" aria-label="研究博客信息"><div><span class="signal-label">01</span><strong>公开 blog</strong><span>整理后再发布的内容</span></div><div><span class="signal-label">02</span><strong>私人 notes</strong><span>草稿、失败与讨论</span></div><div><span class="signal-label">03</span><strong>长期方向</strong><span>可靠、可解释的 agent systems</span></div></section>
    <section class="home-section"><div class="section-heading"><div><p class="eyebrow">LATEST WRITING</p><h2>最近记录</h2></div><a class="text-link" href="#blog">查看全部 <span aria-hidden="true">→</span></a></div><div class="post-list">${featured}</div></section>
    <section class="home-section home-research"><div class="section-heading"><div><p class="eyebrow">RESEARCH MAP</p><h2>我正在追踪的线索</h2></div><a class="text-link" href="#research">研究方向 <span aria-hidden="true">→</span></a></div><div class="research-strip">${researchAreas.slice(0, 3).map((area) => `<a class="research-mini" href="#research"><span>${area.number}</span><strong>${area.title}</strong><p>${area.text}</p></a>`).join("")}</div></section>
  </div>`;
}

function blogPage() {
  return `<div class="page">${pageHeader("WRITING INDEX", "Blog", "把已经整理过的想法、阅读和实验观察放在这里。每篇文章都保留问题、证据与下一步，方便持续修订。")}
    <div class="blog-toolbar"><span class="toolbar-label">${posts.length} entries</span><span class="toolbar-note">按最近更新排序 · 草稿会明确标注</span></div>
    <div class="post-list post-list--full">${posts.map((post) => postCard(post)).join("")}</div>
    <div class="private-note"><span class="private-icon" aria-hidden="true">✳</span><div><strong>私人 notes 也有位置</strong><p>未成熟想法、论文阅读和实验失败会先留在 <code>content/notes/</code>，整理完成后再进入公开 blog。</p></div></div>
  </div>`;
}

function researchPage() {
  return `<div class="page">${pageHeader("RESEARCH MAP", "研究方向", "目前的研究兴趣围绕 Agent 和基础模型展开，重点观察系统、训练信号与评测方法之间的关系。")}
    <div class="area-grid">${researchAreas.map((area) => `<article class="area-card"><div class="area-number">${area.number}</div><h2>${area.title}</h2><p>${area.text}</p>${tagList(area.tags)}</article>`).join("")}</div>
    <div class="principles"><p class="eyebrow">WORKING PRINCIPLES</p><div class="principle-grid"><div><strong>先定义边界</strong><p>明确任务、环境和可公开的证据，再讨论能力提升。</p></div><div><strong>保留过程信息</strong><p>不仅看最终分数，也记录 trajectory、失败恢复和 evaluator 的行为。</p></div><div><strong>让结论可追问</strong><p>把假设、反例和 next steps 放进同一篇记录，方便之后回看。</p></div></div></div>
  </div>`;
}

function projectsPage() {
  return `<div class="page">${pageHeader("PROJECT INDEX", "Projects", "项目、代码、实验和数据会在确认可以公开后逐步整理。这里先保留一个可扩展的索引。")}
    <div class="project-list"><article class="project-row"><div class="project-index">01</div><div><h2>个人主页 / Research Log</h2><p>当前网站的静态源码与内容结构，用于持续记录公开研究写作。</p><div class="project-meta"><span>HTML · CSS · JavaScript</span><a href="https://github.com/Xiaohao-trumpet/Theo.github.io" target="_blank" rel="noreferrer">GitHub ↗</a></div></div><span class="project-status">active</span></article><article class="project-row project-row--muted"><div class="project-index">02</div><div><h2>实验与数据索引</h2><p>待后续整理。只收录可以公开的实验设置、数据说明和复现实验入口。</p><div class="project-meta"><span>coming later</span></div></div><span class="project-status">planned</span></article></div>
  </div>`;
}

function nowPage() {
  return `<div class="page">${pageHeader("NOW · OCT 2026", "现在在想什么", "这里放当前正在形成的研究问题。它们会变化，也会在获得证据后被改写。")}
    <div class="now-layout"><div class="now-main"><div class="now-item"><span>01</span><div><h2>Agent 的能力应该如何被观察？</h2><p>除了任务是否完成，还要看行动轨迹、状态变化、失败恢复和工具使用是否符合预期。</p></div></div><div class="now-item"><span>02</span><div><h2>训练信号如何连接到真实环境？</h2><p>关注 RL / RLVR、数据构造和 evaluator 之间的接口，理解验证器能告诉我们什么。</p></div></div><div class="now-item"><span>03</span><div><h2>什么样的 harness 才值得长期维护？</h2><p>让 benchmark 能够解释问题，让实验结果可以复查，也让新的假设可以低成本加入。</p></div></div></div><aside class="now-aside"><p class="eyebrow">KEEPING IN VIEW</p><ul><li>Terminal Agent</li><li>Code Agent</li><li>ALE / ALE-Bench</li><li>trajectory</li><li>data construction</li><li>model training</li></ul></aside></div>
  </div>`;
}

function aboutPage() {
  return `<div class="page">${pageHeader("ABOUT", "关于我", "一个以研究写作为核心的个人主页。内容会随着学习和研究继续更新。")}
    <div class="about-layout"><div class="about-copy"><p class="about-lede">我是重庆大学人工智能专业本科生，已经申请上岸复旦大学计算机直博。我的研究大方向是 Agent 和基础模型。</p><p>目前重点关注 Terminal Agent、Code Agent、RL/RLVR、ALE/ALE-Bench，以及数据构造、模型训练、benchmark、evaluator、trajectory、harness 和 agent systems。</p><p>我把私人研究记录和公开博客分成两层：notes 用来保留所有未成熟想法，blog 只发布已经整理、可以公开的内容。</p></div><div class="about-facts"><div><span>EDUCATION</span><strong>重庆大学</strong><p>人工智能专业本科</p></div><div><span>NEXT STEP</span><strong>复旦大学</strong><p>计算机直博（已申请上岸）</p></div><div><span>RESEARCH</span><strong>Agent × Foundation Models</strong><p>系统、训练与评测</p></div></div></div>
    <div class="contact-block"><p class="eyebrow">OPEN SOURCE</p><h2>主页源码公开在 GitHub</h2><p>如果你想查看网站结构或后续更新，可以访问仓库。</p><a class="button button--secondary" href="https://github.com/Xiaohao-trumpet/Theo.github.io" target="_blank" rel="noreferrer">打开仓库 <span aria-hidden="true">↗</span></a></div>
  </div>`;
}

function postPage(slug) {
  const post = posts.find((item) => item.slug === slug);
  if (!post) return `<div class="page"><div class="empty-state"><p class="eyebrow">404</p><h1>找不到这篇记录</h1><p>它可能还没有发布，或者链接已经改变。</p><a class="button button--primary" href="#blog">返回 Blog</a></div></div>`;
  return `<div class="page page-post"><a class="back-link" href="#blog">← 返回 Blog</a><article class="post-detail"><header><p class="eyebrow">${escapeHtml(post.category)} · ${escapeHtml(post.kind)}</p><h1>${escapeHtml(post.title)}</h1>${metaLine(post)}<p class="post-summary">${escapeHtml(post.summary)}</p>${tagList(post.tags)}</header><div class="post-body">${post.body}</div><aside class="next-steps"><p class="eyebrow">NEXT STEPS</p><ul>${post.nextSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ul></aside><p class="source-note">内容源文件：<code>${escapeHtml(post.source)}</code></p></article></div>`;
}

function getRoute() {
  const raw = window.location.hash.replace(/^#/, "") || "home";
  const [name, param] = raw.split("/");
  return { name: routeLabels[name] ? name : name === "post" ? "post" : "home", param };
}

function render() {
  const route = getRoute();
  app.innerHTML = route.name === "home" ? homePage() : route.name === "blog" ? blogPage() : route.name === "research" ? researchPage() : route.name === "projects" ? projectsPage() : route.name === "now" ? nowPage() : route.name === "about" ? aboutPage() : postPage(route.param);
  document.querySelectorAll("[data-route]").forEach((link) => link.classList.toggle("is-active", link.dataset.route === route.name));
  document.title = route.name === "home" ? "Xiaohao Zhou · Research Log" : route.name === "post" ? `${posts.find((post) => post.slug === route.param)?.title || "Post"} · Xiaohao Zhou` : `${routeLabels[route.name]} · Xiaohao Zhou`;
  window.scrollTo({ top: 0, behavior: "instant" });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("xh-theme", theme);
  document.querySelectorAll("[data-theme-choice]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.themeChoice === theme)));
}

function applyMode(mode) {
  document.documentElement.dataset.mode = mode;
  localStorage.setItem("xh-mode", mode);
  const dark = mode === "dark";
  const toggle = document.querySelector(".mode-toggle");
  toggle.setAttribute("aria-pressed", String(dark));
  toggle.setAttribute("aria-label", dark ? "切换浅色模式" : "切换深色模式");
  toggle.querySelector(".mode-icon").textContent = dark ? "☀" : "☾";
  toggle.querySelector(".mode-label").textContent = dark ? "Light" : "Dark";
}

const savedTheme = localStorage.getItem("xh-theme") || "blue";
const savedMode = localStorage.getItem("xh-mode") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(savedTheme);
applyMode(savedMode);
document.querySelectorAll("[data-theme-choice]").forEach((button) => button.addEventListener("click", () => applyTheme(button.dataset.themeChoice)));
document.querySelector(".mode-toggle").addEventListener("click", () => applyMode(document.documentElement.dataset.mode === "dark" ? "light" : "dark"));
window.addEventListener("hashchange", render);
render();
