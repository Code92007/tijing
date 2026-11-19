import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

const require = createRequire(import.meta.url);
const { availableYears, matchesProblem, renderProblem } = require("../regional-problem-sets.js");
const catalog = JSON.parse(await readFile(new URL("../regionals/2026.json", import.meta.url)));

test("publishes exactly the six requested problems with full statements and editorials", () => {
  assert.deepEqual(catalog.problems.map((p) => `${p.site}${p.index}`), ["武汉J", "荆州L", "长春E", "长春I", "乐山C", "沈阳F"]);
  for (const p of catalog.problems) {
    assert.ok(p.statement.description.length > 100, p.id);
    assert.ok(p.statement.samples.length > 0, p.id);
    assert.ok(p.editorial.html.includes("<pre>"), p.id);
    assert.ok(p.editorial.source.url.startsWith("https://"), p.id);
    assert.ok(p.editorial.validation.length > 10, p.id);
    assert.doesNotMatch(p.statement.description + p.editorial.html, /<script\b|<[^>]+\son\w+=|javascript:/i);
    assert.doesNotMatch(renderProblem(p), /<details[^>]*\sopen(?:\s|>)/);
  }
});

test("supports later years in descending order and search by site with problem index", () => {
  assert.deepEqual(availableYears([{ year: 2024 }, { year: 2026 }, { year: 2025 }]), [2026, 2025, 2024]);
  assert.equal(matchesProblem(catalog.problems[2], "长春E"), true);
  assert.equal(matchesProblem(catalog.problems[2], "遍历"), true);
  assert.equal(matchesProblem(catalog.problems[2], "武汉"), false);
});

test("escapes sample code and metadata while preserving prepared math HTML", () => {
  const p = structuredClone(catalog.problems[0]);
  p.title = '<img src=x onerror="alert(1)">';
  p.url = "javascript:alert(1)";
  p.statement.samples = [{ input: "a < b && c", output: "x > y" }];
  const html = renderProblem(p);
  assert.match(html, /&lt;img src=x/);
  assert.match(html, /a &lt; b &amp;&amp; c/);
  assert.doesNotMatch(html, /href="javascript:/);
  assert.ok(html.includes(p.editorial.html));
});

test("loads a selected historical year and retains it when rendering search results", async () => {
  const handlers = new Map();
  const document = { addEventListener: (type, fn) => handlers.set(type, fn) };
  const fixtures = {
    "regionals/index.json": { years: [{ year: 2025, file: "regionals/2025.json", count: 1 }, { year: 2026, file: "regionals/2026.json", count: 6 }] },
    "regionals/2026.json": catalog,
    "regionals/2025.json": { ...catalog, year: 2025, problems: [{ ...catalog.problems[0], title: "历史题目" }] }
  };
  const window = { document };
  const context = { window, document, fetch: async (url) => ({ ok: true, json: async () => fixtures[url.split("?")[0]] }) };
  vm.runInNewContext(await readFile(new URL("../regional-problem-sets.js", import.meta.url), "utf8"), context);
  const regional = window.TijingRegionals;
  let resolveHistorical;
  await regional.init(() => {
    if (regional.render().includes("历史题目")) resolveHistorical?.();
  });
  assert.match(regional.render(), /2026 年 · 6 道题/);
  const historicalLoaded = new Promise((resolve) => { resolveHistorical = resolve; });
  handlers.get("change")({ target: { id: "regionalYear", value: "2025" } });
  await historicalLoaded;
  assert.match(regional.render("历史"), /2025 年 · 找到 1 \/ 1 道题/);
  assert.doesNotMatch(regional.render("历史"), /长春/);
  assert.match(regional.render("没有这道题"), /当前年份没有匹配的题目/);
});
