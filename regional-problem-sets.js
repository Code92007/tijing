(function (root) {
  "use strict";

  const escape = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = (value = "") => /^https?:\/\//i.test(value) ? escape(value) : "#";
  const availableYears = (entries) => [...new Set(entries.map((entry) => entry.year))].sort((a, b) => b - a);
  const matchesProblem = (problem, query) => [problem.contest, problem.site, problem.series, problem.index, problem.title, `${problem.site}${problem.index}`, `${problem.site} ${problem.index}`].join(" ").toLowerCase().includes(query.trim().toLowerCase());

  function renderProblem(problem, isOpen = () => false) {
    const statement = problem.statement;
    const editorial = problem.editorial;
    const link = (url, label) => `<a class="external-link" href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${escape(label)} ↗</a>`;
    const samples = statement.samples.map((sample, index) => `<section class="regional-sample"><h4>样例 ${index + 1}</h4><div class="regional-sample-grid"><div><h5>输入</h5><pre>${escape(sample.input)}</pre></div><div><h5>输出</h5><pre>${escape(sample.output)}</pre></div></div></section>`).join("");
    const source = problem.statementSource;
    return `<article class="regional-problem" id="regional-${escape(problem.id)}">
      <header class="regional-problem-header">
        <div class="regional-problem-index" aria-hidden="true">${escape(problem.index)}</div>
        <div class="regional-problem-title"><p>${escape(problem.contest)}</p><h3>${escape(problem.index)} · ${escape(problem.title)}</h3></div>
        ${link(problem.url, "原题 / 提交")}
      </header>
      <details class="regional-panel" data-regional-panel="${escape(problem.id)}:statement" ${isOpen(`${problem.id}:statement`) ? "open" : ""}>
        <summary>查看题面</summary>
        <div class="regional-prose">${statement.description}${statement.input ? `<h3>输入格式</h3>${statement.input}` : ""}${statement.output ? `<h3>输出格式</h3>${statement.output}` : ""}${samples}${statement.hint ? `<h3>样例说明</h3>${statement.hint}` : ""}
          <footer class="regional-source">${source?.attribution ? `<p>${escape(source.attribution)}</p>` : ""}${link(statement.sourceUrl, "题面来源")}${source?.license_url ? ` · ${link(source.license_url, source.license)}` : ""}</footer>
        </div>
      </details>
      <details class="regional-panel" data-regional-panel="${escape(problem.id)}:editorial" ${isOpen(`${problem.id}:editorial`) ? "open" : ""}>
        <summary>查看做法与参考实现</summary>
        <div class="regional-prose"><div class="regional-source"><p>来源：${link(editorial.source.url, editorial.source.title)} · ${escape(editorial.source.author)}</p><p>${escape(editorial.validation)}</p></div>${editorial.html}</div>
      </details>
    </article>`;
  }

  const api = { availableYears, matchesProblem, renderProblem };
  if (typeof module === "object" && module.exports) module.exports = api;
  if (!root.document) return;

  let entries = [], selectedYear, error = "", onChange = () => {}, loading = false;
  const cache = new Map(), openPanels = new Set();
  let mathPromise;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }

  async function renderMath(panel) {
    const content = panel.querySelector(".regional-prose");
    if (!content || content.dataset.mathRendered) return;
    if (!mathPromise) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "vendor/katex/katex.min.css";
      document.head.append(css);
      mathPromise = loadScript("vendor/katex/katex.min.js").then(() => loadScript("vendor/katex/auto-render.min.js")).catch((error) => { mathPromise = null; throw error; });
    }
    try {
      await mathPromise;
      root.renderMathInElement(content, {
        delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }, { left: "\\[", right: "\\]", display: true }, { left: "\\(", right: "\\)", display: false }],
        throwOnError: false, trust: false
      });
      content.dataset.mathRendered = "true";
    } catch { /* Leave the original readable TeX available if the renderer cannot load. */ }
  }

  async function load() {
    loading = true;
    error = "";
    try {
      if (!entries.length) {
        const response = await fetch("regionals/index.json?v=20261119");
        if (!response.ok) throw new Error("无法读取年份目录");
        entries = (await response.json()).years;
        selectedYear = availableYears(entries)[0];
      }
      if (selectedYear && !cache.has(selectedYear)) {
        const entry = entries.find((item) => item.year === selectedYear);
        const response = await fetch(`${entry.file}?v=20261119`);
        if (!response.ok) throw new Error("无法读取题单");
        const data = await response.json();
        if (data.year !== selectedYear || !Array.isArray(data.problems)) throw new Error("题单格式有误");
        cache.set(selectedYear, data);
      }
    } catch {
      error = "题单暂时未能载入，请重试。";
    } finally {
      loading = false;
      onChange();
    }
  }

  api.init = (callback) => { onChange = callback; return load(); };
  api.count = () => entries.reduce((sum, entry) => sum + entry.count, 0);
  api.render = (query = "") => {
    const data = cache.get(selectedYear);
    const problems = data?.problems.filter((problem) => matchesProblem(problem, query)) || [];
    return `<section class="section regional-collection" aria-labelledby="regionalCollectionTitle">
      <div class="section-heading regional-heading"><div><div class="topic-kicker">REGIONAL SELECTION</div><h2 id="regionalCollectionTitle">区域赛题单</h2><p>把赛场上值得再想一遍的题，留给下一次训练。</p></div>
        <label class="regional-year">年份<select id="regionalYear" ${loading ? "disabled" : ""} aria-label="选择区域赛题单年份">${availableYears(entries).map((year) => `<option value="${year}" ${year === selectedYear ? "selected" : ""}>${year} 年</option>`).join("")}</select></label>
      </div>
      ${data ? `<div class="regional-recommendation"><span>推荐理由</span><p>${escape(data.recommendation)}</p></div><p class="regional-count">${selectedYear} 年 · ${query.trim() ? `找到 ${problems.length} / ` : ""}${data.problems.length} 道题</p>` : ""}
      <div class="regional-list">${loading ? '<p class="regional-message" role="status">正在载入题单…</p>' : error ? `<p class="regional-message" role="status">${error} <button class="text-button" type="button" data-retry-regionals>重新载入</button></p>` : data ? problems.length ? problems.map((problem) => renderProblem(problem, (key) => openPanels.has(key))).join("") : '<p class="regional-message" role="status">当前年份没有匹配的题目，试试题名、赛站或题号。</p>' : '<p class="regional-message">这个年份还没有收录题目。</p>'}</div>
    </section>`;
  };

  document.addEventListener("change", (event) => {
    if (event.target.id !== "regionalYear") return;
    const year = Number(event.target.value);
    if (!availableYears(entries).includes(year)) return;
    selectedYear = year;
    if (cache.has(year)) onChange();
    else { load(); onChange(); }
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-retry-regionals]")) { load(); onChange(); }
  });
  document.addEventListener("toggle", (event) => {
    const panel = event.target;
    if (!panel.matches?.("[data-regional-panel]") || !panel.isConnected) return;
    if (panel.open) { openPanels.add(panel.dataset.regionalPanel); renderMath(panel); }
    else openPanels.delete(panel.dataset.regionalPanel);
  }, true);

  root.TijingRegionals = api;
})(typeof window === "object" ? window : globalThis);
