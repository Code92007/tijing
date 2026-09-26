(function exposeProblemSetExport(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.TIJING_EXPORT = api;
})(typeof window !== "undefined" ? window : globalThis, function createProblemSetExportApi() {
  const SCHEMA = "cn.wannafly.tijing.problem-set";
  const SCHEMA_VERSION = 1;

  function createProblemSetManifest({ topic, topicPath = [], topics = [], problems = [], exportedAt, sourceUrl = "" }) {
    if (!topic?.id || !topic?.name) throw new Error("缺少要导出的知识点");
    if (!Array.isArray(problems) || problems.length === 0) throw new Error("当前知识点还没有可导出的题目");

    const exportedTime = exportedAt || new Date().toISOString();
    return {
      schema: SCHEMA,
      schemaVersion: SCHEMA_VERSION,
      exportedAt: exportedTime,
      title: topic.name,
      description: String(topic.description || ""),
      sourceUrl: String(sourceUrl || ""),
      topic: {
        id: topic.id,
        name: topic.name,
        path: topicPath.map((item) => ({ id: item.id, name: item.name }))
      },
      topics: topics.map(exportTopic),
      problems: problems.map(exportProblem)
    };
  }

  function exportTopic(topic) {
    return {
      id: String(topic.id || ""),
      name: String(topic.name || ""),
      parentId: topic.parentId || null,
      group: String(topic.group || (topic.parentId ? "standard" : "root")),
      description: String(topic.description || ""),
      color: String(topic.color || "")
    };
  }

  function exportProblem(problem, position) {
    const exported = {
      position,
      id: String(problem.id || ""),
      title: String(problem.title || ""),
      url: String(problem.url || ""),
      oj: String(problem.oj || ""),
      problemId: String(problem.problemId || ""),
      difficulty: String(problem.difficulty || ""),
      kind: problem.kind === "training" ? "training" : "classic",
      knowledge: cleanStringArray(problem.knowledge),
      techniques: cleanStringArray(problem.techniques),
      note: String(problem.note || ""),
      solutions: Array.isArray(problem.solutions)
        ? problem.solutions.map((solution) => ({
          title: String(solution.title || "题解"),
          url: String(solution.url || ""),
          summary: String(solution.summary || "")
        }))
        : []
    };

    if (Number.isFinite(problem.rating)) exported.rating = problem.rating;
    if (problem.ratingSource) exported.ratingSource = String(problem.ratingSource);
    if (problem.ratingLabel) exported.ratingLabel = String(problem.ratingLabel);
    return exported;
  }

  function cleanStringArray(value) {
    return Array.isArray(value)
      ? [...new Set(value.map((item) => String(item).trim()).filter(Boolean))]
      : [];
  }

  function serializeProblemSet(manifest) {
    return `${JSON.stringify(manifest, null, 2)}\n`;
  }

  function safeFilenameTitle(title) {
    return String(title || "未命名题单")
      .trim()
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "未命名题单";
  }

  function problemSetFilename(title, exportedAt = new Date().toISOString(), extension = "json") {
    const date = String(exportedAt).slice(0, 10) || "export";
    const safeExtension = extension === "pdf" ? "pdf" : "json";
    return `题径-题单-${safeFilenameTitle(title)}-${date}.${safeExtension}`;
  }

  function renderProblemSetPrintHtml(manifest) {
    if (!manifest?.topic || !Array.isArray(manifest.problems)) throw new Error("题单数据无效");
    const topicNames = new Map((manifest.topics || []).map((topic) => [topic.id, topic.name]));
    const classic = manifest.problems.filter((problem) => problem.kind === "classic");
    const training = manifest.problems.filter((problem) => problem.kind === "training");
    const path = (manifest.topic.path || []).map((item) => item.name).filter(Boolean).join(" / ");
    const exportedDate = String(manifest.exportedAt || "").slice(0, 10);
    const filename = problemSetFilename(manifest.title, manifest.exportedAt, "pdf");

    return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(filename.replace(/\.pdf$/, ""))}</title>
  <style>
    @page {
      size: A4;
      margin: 14mm 14mm 17mm;
      @bottom-left { content: "题径 · 算法竞赛题单"; color: #667069; font-size: 8pt; }
      @bottom-right { content: "第 " counter(page) " 页"; color: #667069; font-size: 8pt; }
    }
    * { box-sizing: border-box; }
    html { color: #1d2320; background: #fff; font-family: "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif; }
    body { margin: 0; font-size: 10pt; line-height: 1.55; }
    a { color: inherit; text-decoration: none; }
    .cover { padding: 2mm 0 7mm; border-bottom: 1.2pt solid #256d4b; }
    .brand { display: flex; align-items: center; justify-content: space-between; gap: 8mm; color: #256d4b; font-size: 8.5pt; font-weight: 700; }
    .brand span:last-child { color: #667069; font-family: ui-monospace, monospace; font-weight: 500; }
    h1 { margin: 5mm 0 2mm; font-family: "Songti SC", "Noto Serif CJK SC", serif; font-size: 25pt; line-height: 1.2; }
    .description { max-width: 160mm; margin: 0; color: #4f5952; font-size: 10.5pt; }
    .summary { display: flex; flex-wrap: wrap; gap: 5mm; margin-top: 5mm; color: #39423c; font-size: 9pt; }
    .summary strong { margin-right: 1.2mm; color: #174b35; font-size: 13pt; }
    .group { margin-top: 8mm; }
    .group-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 5mm; margin: 0 0 2mm; padding-bottom: 2mm; border-bottom: 0.6pt solid #bfc5bf; break-after: avoid; page-break-after: avoid; }
    .group-heading h2 { margin: 0; font-family: "Songti SC", "Noto Serif CJK SC", serif; font-size: 15pt; }
    .group-heading span { color: #667069; font-size: 8.5pt; }
    .problem { display: grid; grid-template-columns: 8mm minmax(0, 1fr) auto; gap: 3mm; padding: 3.2mm 0; border-bottom: 0.45pt solid #e0e3df; break-inside: avoid; page-break-inside: avoid; }
    .number { color: #727b74; font-family: ui-monospace, monospace; font-size: 8.5pt; padding-top: 0.8mm; }
    .problem h3 { margin: 0; overflow-wrap: anywhere; font-size: 10.5pt; line-height: 1.4; }
    .problem h3 a { text-decoration: underline; text-decoration-color: #9fb6a8; text-underline-offset: 1.5pt; }
    .meta { margin-top: 0.7mm; color: #667069; font-size: 8pt; }
    .details { margin-top: 1.2mm; color: #49534c; font-size: 8.5pt; }
    .details div + div { margin-top: 0.5mm; }
    .note { color: #374039; }
    .solutions a { color: #275b92; text-decoration: underline; text-underline-offset: 1.2pt; }
    .difficulty { min-width: 15mm; padding-top: 0.6mm; color: #7a5a13; font-size: 8.5pt; font-weight: 700; text-align: right; }
    .difficulty.easy { color: #256d4b; }
    .difficulty.hard { color: #b24735; }
    .source { margin-top: 8mm; padding-top: 3mm; border-top: 0.6pt solid #cfd3cf; color: #737b75; font-size: 7.5pt; word-break: break-all; }
    @media screen {
      body { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 14mm; box-shadow: 0 4px 28px rgb(29 35 32 / 12%); }
    }
  </style>
</head>
<body>
  <header class="cover">
    <div class="brand"><span>题径 · PROBLEM SET</span><span>${escapeHtml(path || manifest.title)}</span></div>
    <h1>${escapeHtml(manifest.title)}</h1>
    ${manifest.description ? `<p class="description">${escapeHtml(manifest.description)}</p>` : ""}
    <div class="summary">
      <span><strong>${manifest.problems.length}</strong>道题</span>
      <span><strong>${classic.length}</strong>经典例题</span>
      <span><strong>${training.length}</strong>实战训练</span>
      ${exportedDate ? `<span>导出于 ${escapeHtml(exportedDate)}</span>` : ""}
    </div>
  </header>
  ${renderProblemGroup("经典例题", classic, topicNames)}
  ${renderProblemGroup("实战训练", training, topicNames)}
  <footer class="source">来源：${escapeHtml(manifest.sourceUrl || "题径")}</footer>
</body>
</html>`;
  }

  function renderProblemGroup(title, problems, topicNames) {
    if (!problems.length) return "";
    return `<section class="group">
      <div class="group-heading"><h2>${title}</h2><span>${problems.length} problems</span></div>
      ${problems.map((problem) => renderPrintProblem(problem, topicNames)).join("")}
    </section>`;
  }

  function renderPrintProblem(problem, topicNames) {
    const knowledge = (problem.knowledge || []).map((id) => topicNames.get(id) || id).join("、");
    const techniques = (problem.techniques || []).join("、");
    const solutions = (problem.solutions || []).filter((solution) => solution.url);
    const details = [
      knowledge ? `<div>知识点：${escapeHtml(knowledge)}</div>` : "",
      techniques ? `<div>技巧：${escapeHtml(techniques)}</div>` : "",
      problem.note ? `<div class="note">备注：${escapeHtml(problem.note)}</div>` : "",
      solutions.length ? `<div class="solutions">题解：${solutions.map((solution) => `<a href="${safeHttpUrl(solution.url)}">${escapeHtml(solution.title || "题解")}</a>`).join(" · ")}</div>` : ""
    ].filter(Boolean).join("");
    const difficultyClass = problem.difficulty === "简单" ? "easy" : problem.difficulty === "困难" ? "hard" : "";
    return `<article class="problem">
      <div class="number">${String(problem.position + 1).padStart(2, "0")}</div>
      <div>
        <h3><a href="${safeHttpUrl(problem.url)}">${escapeHtml(problem.title)}</a></h3>
        <div class="meta">${escapeHtml(problem.oj)}${problem.problemId ? ` · ${escapeHtml(problem.problemId)}` : ""}</div>
        ${details ? `<div class="details">${details}</div>` : ""}
      </div>
      <div class="difficulty ${difficultyClass}">${escapeHtml(problem.difficulty || "未定")}</div>
    </article>`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function safeHttpUrl(value) {
    try {
      const url = new URL(String(value || ""));
      return url.protocol === "http:" || url.protocol === "https:" ? escapeHtml(url.href) : "#";
    } catch {
      return "#";
    }
  }

  return {
    SCHEMA,
    SCHEMA_VERSION,
    createProblemSetManifest,
    serializeProblemSet,
    problemSetFilename,
    renderProblemSetPrintHtml
  };
});
