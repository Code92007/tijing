import { readFile } from "node:fs/promises";
import path from "node:path";

if (process.env.RESTORE_CONFIRM !== "RESTORE_MAIN_CATALOG") {
  throw new Error("Set RESTORE_CONFIRM=RESTORE_MAIN_CATALOG to confirm the restore.");
}

const supabaseUrl = requireEnv("SUPABASE_URL");
const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
const inputPath = path.resolve(process.argv[2] || "backups/catalog.json");
const raw = await readFile(inputPath, "utf8");
const snapshot = parseSnapshot(raw, inputPath);
const catalog = snapshot.catalog || snapshot.data || snapshot;
validateCatalog(catalog);

const currentEndpoint = new URL("/rest/v1/catalog", supabaseUrl);
currentEndpoint.searchParams.set("id", "eq.main");
currentEndpoint.searchParams.set("select", "version");
const currentResponse = await fetch(currentEndpoint, { headers: apiHeaders() });
if (!currentResponse.ok) throw new Error(`Could not read current version: ${currentResponse.status}`);
const currentRows = await currentResponse.json();
const nextVersion = (currentRows[0]?.version || 0) + 1;

const restoreEndpoint = new URL("/rest/v1/catalog", supabaseUrl);
restoreEndpoint.searchParams.set("on_conflict", "id");
const restoreResponse = await fetch(restoreEndpoint, {
  method: "POST",
  headers: {
    ...apiHeaders(),
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=representation"
  },
  body: JSON.stringify({
    id: "main",
    data: catalog,
    version: nextVersion,
    updated_at: new Date().toISOString(),
    updated_by: null
  })
});

if (!restoreResponse.ok) {
  throw new Error(`Restore failed: ${restoreResponse.status} ${await restoreResponse.text()}`);
}

console.log(`Restored ${inputPath} as catalog version ${nextVersion}`);

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function apiHeaders() {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    Accept: "application/json"
  };
}

function parseSnapshot(content, filename) {
  if (filename.endsWith(".md")) {
    const match = content.match(/`````json\s*([\s\S]*?)\s*`````/);
    if (!match) throw new Error("Markdown backup does not contain a recoverable JSON snapshot.");
    return JSON.parse(match[1]);
  }
  return JSON.parse(content);
}

function validateCatalog(catalog) {
  if (!catalog || !Array.isArray(catalog.topics) || !catalog.topics.length || !Array.isArray(catalog.problems) || !Array.isArray(catalog.contests)) {
    throw new Error("Backup catalog has an invalid shape.");
  }
}
