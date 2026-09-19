import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const supabaseUrl = requireEnv("SUPABASE_URL");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const outputDir = path.resolve(process.argv[2] || "backups");

const endpoint = new URL("/rest/v1/catalog", supabaseUrl);
endpoint.searchParams.set("id", "eq.main");
endpoint.searchParams.set("select", "data,version,updated_at");

const response = await fetch(endpoint, {
  headers: {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    Accept: "application/json"
  }
});

if (!response.ok) {
  throw new Error(`Backup request failed: ${response.status} ${await response.text()}`);
}

const rows = await response.json();
if (!rows.length) throw new Error("Catalog row 'main' does not exist yet.");

const row = rows[0];
validateCatalog(row.data);

const snapshot = {
  format: "tijing-catalog-backup",
  formatVersion: 1,
  databaseVersion: row.version,
  databaseUpdatedAt: row.updated_at,
  catalog: row.data
};

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "catalog.json"), `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
await writeFile(path.join(outputDir, "catalog.md"), renderMarkdown(snapshot), "utf8");
console.log(`Backed up catalog version ${row.version} to ${outputDir}`);

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function validateCatalog(catalog) {
  if (!catalog || !Array.isArray(catalog.topics) || !Array.isArray(catalog.problems) || !Array.isArray(catalog.contests)) {
    throw new Error("Remote catalog has an invalid shape.");
  }
}

function escapeMarkdown(value = "") {
  return String(value).replaceAll("\\", "\\\\").replaceAll("[", "\\[").replaceAll("]", "\\]");
}

function renderMarkdown(backup) {
  const { catalog } = backup;
  const rootTopics = catalog.topics.filter((topic) => !topic.parentId);
  const subtopicCount = catalog.topics.length - rootTopics.length;
  const lines = [
    "---",
    `format: ${backup.format}`,
    `format_version: ${backup.formatVersion}`,
    `database_version: ${backup.databaseVersion}`,
    `database_updated_at: ${backup.databaseUpdatedAt}`,
    "---",
    "",
    "# 题径数据备份",
    "",
    `一级知识点 ${rootTopics.length} 个，子专题 ${subtopicCount} 个，题目 ${catalog.problems.length} 道，比赛 ${catalog.contests.length} 场。`,
    ""
  ];

  for (const topic of rootTopics) {
    renderTopic(lines, catalog, topic, 2);
    for (const child of catalog.topics.filter((item) => item.parentId === topic.id)) renderTopic(lines, catalog, child, 3);
  }

  if (catalog.contests.length) {
    lines.push("## 比赛收藏", "");
    for (const contest of catalog.contests) {
      lines.push(`- [${escapeMarkdown(contest.title)}](${contest.url}) · ${contest.oj} · ${contest.date || "日期未定"}`);
    }
    lines.push("");
  }

  lines.push(
    "## 可恢复快照",
    "",
    "以下 JSON 与 `catalog.json` 等价，恢复脚本可直接读取本文件。",
    "",
    "`````json",
    JSON.stringify(backup, null, 2),
    "`````",
    ""
  );
  return lines.join("\n");
}

function renderTopic(lines, catalog, topic, level) {
  const marker = "#".repeat(level);
  const type = topic.parentId ? (topic.group === "custom" ? " · 我的专题" : " · 标准专题") : "";
  lines.push(`${marker} ${escapeMarkdown(topic.name)}${type}`, "", topic.description || "", "");
  if (topic.article?.title) {
    lines.push(`${marker}# ${escapeMarkdown(topic.article.title)}`, "");
    for (const paragraph of topic.article.body || []) lines.push(paragraph, "");
  }
  const problems = catalog.problems.filter((problem) => problem.knowledge?.includes(topic.id));
  if (!problems.length) return;
  lines.push(`${marker}# 题目`, "");
  for (const problem of problems) {
    const area = problem.kind === "classic" ? "经典例题" : "实战训练";
    const techniques = problem.techniques?.length ? ` · 技巧：${problem.techniques.map(escapeMarkdown).join("、")}` : "";
    lines.push(`- [${escapeMarkdown(problem.title)}](${problem.url}) · ${problem.oj} · ${problem.difficulty} · ${area}${techniques}`);
  }
  lines.push("");
}
