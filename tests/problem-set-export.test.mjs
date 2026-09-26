import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const exporter = require("../problem-set-export.js");

test("creates a versioned problem-set manifest without local progress", () => {
  const manifest = exporter.createProblemSetManifest({
    topic: { id: "dp", name: "动态规划", description: "状态与转移" },
    topicPath: [{ id: "dp", name: "动态规划" }],
    topics: [{ id: "dp", name: "动态规划", color: "#3865a8" }],
    problems: [{
      id: "p1",
      title: "示例题",
      url: "https://example.com/problem/1",
      oj: "其他",
      problemId: "1",
      difficulty: "中等",
      kind: "training",
      knowledge: ["dp", "dp"],
      techniques: ["状态设计", ""],
      note: "检查边界",
      done: true,
      rating: 1800,
      ratingSource: "Codeforces",
      solutions: [{ title: "官方题解", url: "https://example.com/solution", summary: "思路" }]
    }],
    exportedAt: "2026-09-26T10:20:30.000Z",
    sourceUrl: "https://tijing.wannafly.cn/"
  });

  assert.equal(manifest.schema, "cn.wannafly.tijing.problem-set");
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.problems[0].position, 0);
  assert.equal(manifest.problems[0].kind, "training");
  assert.deepEqual(manifest.problems[0].knowledge, ["dp"]);
  assert.equal(manifest.problems[0].rating, 1800);
  assert.equal("done" in manifest.problems[0], false);
  assert.equal(exporter.serializeProblemSet(manifest).endsWith("\n"), true);
});

test("builds a filesystem-safe dated filename", () => {
  assert.equal(
    exporter.problemSetFilename("动态规划 / 背包:*?", "2026-09-26T10:20:30.000Z"),
    "题径-题单-动态规划-背包-2026-09-26.json"
  );
  assert.equal(
    exporter.problemSetFilename("动态规划", "2026-09-26T10:20:30.000Z", "pdf"),
    "题径-题单-动态规划-2026-09-26.pdf"
  );
});

test("renders a printable A4 problem set with escaped content", () => {
  const html = exporter.renderProblemSetPrintHtml({
    exportedAt: "2026-09-26T10:20:30.000Z",
    title: "图论 <进阶>",
    description: "最短路 & 网络流",
    sourceUrl: "https://example.com/?a=1&b=2",
    topic: { id: "graph", path: [{ id: "graph", name: "图论" }] },
    topics: [{ id: "graph", name: "图论" }],
    problems: [{
      position: 0,
      title: "A < B",
      url: "https://example.com/problem?a=1&b=2",
      oj: "Codeforces",
      problemId: "1A",
      difficulty: "简单",
      kind: "classic",
      knowledge: ["graph"],
      techniques: ["最短路"],
      note: "注意 a & b",
      solutions: []
    }]
  });

  assert.match(html, /@page/);
  assert.match(html, /经典例题/);
  assert.match(html, /图论 &lt;进阶&gt;/);
  assert.match(html, /最短路 &amp; 网络流/);
  assert.match(html, /href="https:\/\/example\.com\/problem\?a=1&amp;b=2"/);
  assert.doesNotMatch(html, /<h1>图论 <进阶><\/h1>/);
});

test("drops unsafe link protocols from the printable view", () => {
  const html = exporter.renderProblemSetPrintHtml({
    title: "安全检查",
    topic: { id: "security", path: [] },
    topics: [],
    problems: [{
      position: 0,
      title: "异常链接",
      url: "javascript:alert(1)",
      oj: "其他",
      problemId: "",
      difficulty: "未定",
      kind: "classic",
      knowledge: [],
      techniques: [],
      note: "",
      solutions: [{ title: "异常题解", url: "data:text/html,unsafe" }]
    }]
  });

  assert.doesNotMatch(html, /javascript:|data:text/);
  assert.equal((html.match(/href="#"/g) || []).length, 2);
});

test("rejects an empty problem set", () => {
  assert.throws(
    () => exporter.createProblemSetManifest({ topic: { id: "empty", name: "空题单" }, problems: [] }),
    /没有可导出的题目/
  );
});
