const STORAGE_KEY = "tijing-data-v5";
const PENDING_KEY = "tijing-pending-sync-v1";
const PROGRESS_KEY = "tijing-progress-v1";
const PRESET_PROBLEM_IDS = new Set(["p4", "p5", "p6", "p8"]);
const PRESET_CONTEST_IDS = new Set(["c1", "c2", "c3", "c4"]);
const CATALOG_SCHEMA_VERSION = 2;

const defaultDpSubtopics = [
  { id: "dp-linear", name: "线性 DP", description: "沿序列或阶段推进状态，处理前缀、子序列与多状态转移。" },
  { id: "dp-knapsack", name: "背包 DP", description: "围绕容量、选择次数与物品组合建立状态。" },
  { id: "dp-interval", name: "区间 DP", description: "按区间长度组织转移，处理合并、分割与括号结构。" },
  { id: "dp-tree", name: "树形 DP", description: "在树上汇总子树信息，设计父子状态与合并方式。" },
  { id: "dp-bitmask", name: "状态压缩 DP", description: "用位集合表示选择状态，解决小规模组合决策问题。" }
].map((topic, index) => ({
  ...topic,
  parentId: "dp",
  group: "standard",
  color: ["#4f78b5", "#8a6a3f", "#b75c49", "#4b8063", "#735d9f"][index],
  article: {
    title: `${topic.name}学习笔记`,
    body: ["这里还没有教学内容，可以从核心状态、常见转移和典型边界开始整理。"],
    outline: ["定义状态", "推导转移", "检查边界"]
  }
}));

const seedData = {
  schemaVersion: CATALOG_SCHEMA_VERSION,
  topics: [
    {
      id: "graph",
      name: "图论",
      color: "#256d4b",
      description: "从图的表示与遍历出发，逐步掌握最短路、生成树、连通性与网络流。",
      article: {
        title: "从遍历到最短路：建立图论题的统一视角",
        body: [
          "图论题的第一步通常不是选择算法，而是把题意翻译成节点、边与状态。先问清楚一条边代表什么、方向是否重要、边权能否为负，很多看似陌生的问题就会落到熟悉的模型上。",
          "遍历是这套方法的骨架。BFS 按层扩展，天然对应无权图的最短步数；DFS 更适合刻画连通性、搜索树和递归结构。写代码前先明确每个状态何时入队、何时标记，可以避开大多数重复访问问题。",
          "到了带权图，再根据边权性质选择最短路算法：非负边权优先考虑 Dijkstra；存在负边时需要 Bellman-Ford 或 SPFA 的判负环能力；多源、多次查询则可以考虑 Floyd 或预处理。算法名称不是答案，边权约束才是选择依据。"
        ],
        outline: ["把题意翻译成图模型", "用遍历理解可达与层次", "按边权性质选择最短路"]
      }
    },
    {
      id: "dp",
      name: "动态规划",
      color: "#3865a8",
      description: "识别状态与转移，从线性 DP 走向区间、树形和状态压缩。",
      article: {
        title: "先定义状态，再谈转移方程",
        body: [
          "动态规划的难点常常不在计算，而在于决定一个状态要保留哪些信息。一个好的状态应当足以描述后续决策，同时尽量丢掉已经不会再产生影响的历史。",
          "先用一句完整的话写出 dp 数组的含义，再枚举最后一步发生了什么。这样得到的转移通常比从样例倒推公式更稳定，也更容易检查初始化和答案位置。"
        ],
        outline: ["写清状态的完整语义", "从最后一步寻找转移", "核对边界与遍历顺序"]
      }
    },
    {
      id: "data-structure",
      name: "数据结构",
      color: "#d96345",
      description: "用合适的数据结构维护信息，让查询与修改都保持高效。",
      article: {
        title: "数据结构题，本质上是在设计信息的存取方式",
        body: ["先列出题目要求的修改与查询，再看哪些信息能够合并、哪些操作需要支持撤销。线段树、树状数组和并查集只是不同约束下的实现工具。"],
        outline: ["拆解修改与查询", "寻找可合并的信息", "估算复杂度上界"]
      }
    },
    {
      id: "strings",
      name: "字符串",
      color: "#7255a6",
      description: "覆盖匹配、哈希、Trie、前缀函数与自动机等常见模型。",
      article: {
        title: "把字符比较变成可复用的信息",
        body: ["字符串算法的核心常常是避免重复比较。前缀函数、Z 函数与哈希都在缓存不同形式的匹配信息，理解信息的含义比记住模板更重要。"],
        outline: ["明确比较的区间", "复用已知匹配信息", "注意哈希碰撞与边界"]
      }
    },
    {
      id: "math",
      name: "数学",
      color: "#a36d10",
      description: "数论、组合计数、概率与线性代数中的竞赛常用方法。",
      article: {
        title: "从约束与不变量里找到数学结构",
        body: ["遇到数学题时，先小范围打表观察，再尝试用整除性、奇偶性和单调性解释规律。猜想只是起点，最终需要让证明覆盖所有边界。"],
        outline: ["从小数据建立猜想", "寻找不变量", "补齐证明与边界"]
      }
    },
    {
      id: "greedy",
      name: "贪心",
      color: "#aa5f73",
      description: "用交换论证与单调结构验证局部选择何时能导向全局最优。",
      article: {
        title: "贪心不是直觉，而是可证明的选择",
        body: ["一个贪心策略至少需要回答两件事：为什么当前选择不会让答案变差，以及做出选择后剩余问题为什么仍与原问题同构。交换论证是最常见的证明方式。"],
        outline: ["明确局部选择", "尝试交换论证", "确认子问题结构"]
      }
    },
    ...defaultDpSubtopics
  ],
  problems: [],
  contests: []
};

const ojStyles = {
  洛谷: { short: "LG", color: "#b54234", bg: "#fae9e3" },
  Codeforces: { short: "CF", color: "#3865a8", bg: "#e8edf6" },
  AtCoder: { short: "AT", color: "#4e5651", bg: "#eceeeb" },
  LeetCode: { short: "LC", color: "#9a670e", bg: "#f8efd7" },
  HDU: { short: "HD", color: "#3973a8", bg: "#e8f0f7" },
  POJ: { short: "PO", color: "#4b8063", bg: "#e7f0eb" },
  QOJ: { short: "QO", color: "#9b4b5b", bg: "#f7e9ec" },
  GYM: { short: "GYM", color: "#b55a3f", bg: "#faebe5" },
  牛客: { short: "NC", color: "#1f7783", bg: "#e1f0f1" },
  其他: { short: "OJ", color: "#5d665f", bg: "#eceeeb" }
};

const initialData = loadData();

const state = {
  data: initialData,
  progress: loadProgress(initialData),
  route: "knowledge",
  topicId: "graph",
  query: "",
  difficulty: "全部",
  modalType: null,
  editingId: null,
  modalContext: {},
  expandedTopics: new Set(["dp"]),
  lessonExpanded: false
};

const cloud = {
  enabled: false,
  client: null,
  user: null,
  version: 0,
  updatedAt: null,
  status: "local",
  error: "",
  channel: null
};

const els = {
  sidebar: document.querySelector("#sidebar"),
  sidebarScrim: document.querySelector("#sidebarScrim"),
  menuButton: document.querySelector("#menuButton"),
  sidebarClose: document.querySelector("#sidebarClose"),
  topicNav: document.querySelector("#topicNav"),
  breadcrumb: document.querySelector("#breadcrumb"),
  globalSearch: document.querySelector("#globalSearch"),
  syncStatusButton: document.querySelector("#syncStatusButton"),
  knowledgeView: document.querySelector("#knowledgeView"),
  contestView: document.querySelector("#contestView"),
  knowledgeContent: document.querySelector("#knowledgeContent"),
  contestContent: document.querySelector("#contestContent"),
  addButton: document.querySelector("#addButton"),
  addMenu: document.querySelector("#addMenu"),
  modalLayer: document.querySelector("#modalLayer"),
  modalTitle: document.querySelector("#modalTitle"),
  modalEyebrow: document.querySelector("#modalEyebrow"),
  formFields: document.querySelector("#formFields"),
  entryForm: document.querySelector("#entryForm"),
  submitButton: document.querySelector("#submitButton"),
  toast: document.querySelector("#toast"),
  toastText: document.querySelector("#toastText"),
  contestNavCount: document.querySelector("#contestNavCount"),
  weeklyProgressText: document.querySelector("#weeklyProgressText"),
  weeklyProgressBar: document.querySelector("#weeklyProgressBar")
};

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const data = saved ? JSON.parse(saved) : structuredClone(seedData);
    const migrated = migrateCatalog(data);
    if (saved) localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    return structuredClone(seedData);
  }
}

function loadProgress(catalog) {
  let progress = { completed: {} };
  let hasSavedProgress = false;
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY));
    if (saved && typeof saved.completed === "object") {
      progress = { completed: saved.completed };
      hasSavedProgress = true;
    }
  } catch {
    // Fall back to an empty local profile.
  }
  if (!hasSavedProgress) {
    for (const problem of catalog.problems || []) {
      if (problem.done === true) progress.completed[problem.id] = "legacy";
    }
  }
  const catalogChanged = stripSharedProgress(catalog);
  if (!hasSavedProgress) localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  if (catalogChanged) localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
  return progress;
}

function stripSharedProgress(catalog) {
  let changed = false;
  for (const problem of catalog.problems || []) {
    if (!Object.hasOwn(problem, "done")) continue;
    delete problem.done;
    changed = true;
  }
  return changed;
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress));
}

function isProblemDone(problem) {
  return Object.hasOwn(state.progress.completed, problem.id);
}

function wasCompletedThisWeek(problem, now = new Date()) {
  const completedAt = state.progress.completed[problem.id];
  if (!completedAt || completedAt === "legacy") return false;
  const completed = new Date(completedAt);
  if (Number.isNaN(completed.getTime())) return false;
  const weekStart = new Date(now);
  const daysSinceMonday = (weekStart.getDay() + 6) % 7;
  weekStart.setDate(weekStart.getDate() - daysSinceMonday);
  weekStart.setHours(0, 0, 0, 0);
  return completed >= weekStart && completed <= now;
}

function migrateCatalog(data) {
  const migrated = structuredClone(data);
  migrated.problems = Array.isArray(migrated.problems)
    ? migrated.problems.filter((problem) => !PRESET_PROBLEM_IDS.has(problem.id))
    : [];
  migrated.contests = Array.isArray(migrated.contests)
    ? migrated.contests.filter((contest) => !PRESET_CONTEST_IDS.has(contest.id))
    : [];
  migrated.topics = Array.isArray(migrated.topics) ? migrated.topics : [];
  migrated.topics = migrated.topics.map((topic) => ({
    ...topic,
    parentId: topic.parentId || null,
    group: topic.parentId ? (topic.group || "standard") : "root"
  }));
  if ((Number(migrated.schemaVersion) || 1) < CATALOG_SCHEMA_VERSION) {
    for (const subtopic of defaultDpSubtopics) {
      if (!migrated.topics.some((topic) => topic.id === subtopic.id)) migrated.topics.push(structuredClone(subtopic));
    }
  }
  migrated.problems = migrated.problems.map((problem) => ({
    ...problem,
    techniques: Array.isArray(problem.techniques) ? problem.techniques : []
  }));
  migrated.schemaVersion = CATALOG_SCHEMA_VERSION;
  return migrated;
}

function cacheData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function validateCatalog(data) {
  return Boolean(data && Array.isArray(data.topics) && data.topics.length && Array.isArray(data.problems) && Array.isArray(data.contests));
}

function getPendingSync() {
  try {
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY));
    return pending && validateCatalog(pending.data) ? pending : null;
  } catch {
    return null;
  }
}

function setPendingSync(data, expectedVersion) {
  localStorage.setItem(PENDING_KEY, JSON.stringify({
    data,
    expectedVersion,
    savedAt: new Date().toISOString()
  }));
}

function clearPendingSync() {
  localStorage.removeItem(PENDING_KEY);
}

async function writeRemoteCatalog(data, expectedVersion) {
  if (expectedVersion === 0) {
    const result = await cloud.client
      .from("catalog")
      .insert({ id: "main", data, version: 1, updated_by: cloud.user.id })
      .select("data, version, updated_at")
      .single();
    if (result.error) throw result.error;
    return result.data;
  }

  const result = await cloud.client
    .rpc("save_catalog", { payload: data, expected_version: expectedVersion })
    .single();
  if (result.error) throw result.error;
  return result.data;
}

async function saveData() {
  cacheData();
  if (!cloud.enabled) return;
  if (!cloud.user) throw new Error("请先登录管理员账号");

  const snapshot = structuredClone(state.data);
  setPendingSync(snapshot, cloud.version);
  cloud.status = "saving";
  renderSyncStatus();

  try {
    const saved = await writeRemoteCatalog(snapshot, cloud.version);
    cloud.version = saved.version;
    cloud.updatedAt = saved.updated_at;
    cloud.status = "synced";
    cloud.error = "";
    clearPendingSync();
    renderSyncStatus();
  } catch (error) {
    cloud.status = String(error.message || "").includes("catalog_conflict") ? "conflict" : "offline";
    cloud.error = error.message || "云端保存失败";
    renderSyncStatus();
    throw new Error(cloud.status === "conflict" ? "云端已有更新，本机修改已保留待处理" : "云端保存失败，修改已保存在本机待同步");
  }
}

async function loadRemoteData({ silent = false } = {}) {
  if (!cloud.enabled) return;
  cloud.status = "loading";
  renderSyncStatus();

  const result = await cloud.client
    .from("catalog")
    .select("data, version, updated_at")
    .eq("id", "main")
    .maybeSingle();

  if (result.error) {
    cloud.status = "offline";
    cloud.error = result.error.message;
    renderSyncStatus();
    if (!silent) showToast("云端连接失败，正在使用本地副本");
    return;
  }

  const pending = getPendingSync();
  const remote = result.data;
  if (pending) {
    state.data = migrateCatalog(pending.data);
    stripSharedProgress(state.data);
    cacheData();
    cloud.version = remote?.version || 0;
    cloud.updatedAt = remote?.updated_at || null;

    if (cloud.user && pending.expectedVersion === cloud.version) {
      try {
        const saved = await writeRemoteCatalog(state.data, pending.expectedVersion);
        cloud.version = saved.version;
        cloud.updatedAt = saved.updated_at;
        cloud.status = "synced";
        cloud.error = "";
        clearPendingSync();
        if (!silent) showToast("本机待同步修改已上传");
      } catch (error) {
        cloud.status = String(error.message || "").includes("catalog_conflict") ? "conflict" : "offline";
        cloud.error = error.message || "待同步修改上传失败";
      }
    } else {
      cloud.status = pending.expectedVersion === cloud.version ? (cloud.user ? "offline" : "readonly") : "conflict";
    }
  } else if (remote && validateCatalog(remote.data)) {
    state.data = migrateCatalog(remote.data);
    stripSharedProgress(state.data);
    cloud.version = remote.version;
    cloud.updatedAt = remote.updated_at;
    cloud.status = cloud.user ? "synced" : "readonly";
    cloud.error = "";
    cacheData();
  } else {
    cloud.version = 0;
    cloud.updatedAt = null;
    cloud.status = cloud.user ? "synced" : "readonly";
  }

  if (!state.data.topics.some((topic) => topic.id === state.topicId)) state.topicId = state.data.topics[0].id;
  render();
}

function subscribeToRemoteCatalog() {
  if (!cloud.enabled || cloud.channel) return;
  cloud.channel = cloud.client
    .channel("catalog-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "catalog", filter: "id=eq.main" },
      (payload) => {
        const next = payload.new;
        if (!next || !validateCatalog(next.data) || next.version <= cloud.version) return;
        if (getPendingSync()) {
          cloud.status = "conflict";
          cloud.version = next.version;
          cloud.updatedAt = next.updated_at;
          renderSyncStatus();
          showToast("云端有新版本，本机待同步修改仍已保留");
          return;
        }
        state.data = migrateCatalog(next.data);
        stripSharedProgress(state.data);
        cloud.version = next.version;
        cloud.updatedAt = next.updated_at;
        cloud.status = cloud.user ? "synced" : "readonly";
        cacheData();
        render();
        showToast("已同步另一端的更新");
      }
    )
    .subscribe();
}

async function initializeCloud() {
  const config = window.TIJING_CONFIG || {};
  const url = String(config.supabaseUrl || "").trim();
  const key = String(config.supabasePublishableKey || config.supabaseAnonKey || "").trim();
  if (!url || !key) {
    cloud.status = "local";
    renderSyncStatus();
    return;
  }
  if (!window.supabase?.createClient) {
    cloud.status = "offline";
    cloud.error = "Supabase 客户端未加载";
    renderSyncStatus();
    return;
  }

  cloud.enabled = true;
  cloud.status = "loading";
  cloud.client = window.supabase.createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  renderSyncStatus();

  const sessionResult = await cloud.client.auth.getSession();
  cloud.user = sessionResult.data.session?.user || null;
  cloud.client.auth.onAuthStateChange((_event, session) => {
    const previousUser = cloud.user?.id;
    cloud.user = session?.user || null;
    if (cloud.user?.id !== previousUser) loadRemoteData({ silent: true });
    else renderSyncStatus();
  });

  await loadRemoteData({ silent: true });
  subscribeToRemoteCatalog();
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getTopic(id) {
  return state.data.topics.find((topic) => topic.id === id) || state.data.topics[0];
}

function getTopicName(id) {
  return state.data.topics.find((topic) => topic.id === id)?.name || id;
}

function getRootTopics() {
  return state.data.topics.filter((topic) => !topic.parentId);
}

function getChildTopics(parentId) {
  return state.data.topics.filter((topic) => topic.parentId === parentId);
}

function getParentTopic(topic) {
  return topic?.parentId ? state.data.topics.find((item) => item.id === topic.parentId) : null;
}

function getTopicScopeIds(topicId) {
  return [topicId, ...getChildTopics(topicId).map((topic) => topic.id)];
}

function problemBelongsToTopic(problem, topicId) {
  const scope = new Set(getTopicScopeIds(topicId));
  return problem.knowledge.some((id) => scope.has(id));
}

function getTopicProblemCount(topicId) {
  return state.data.problems.filter((problem) => problemBelongsToTopic(problem, topicId)).length;
}

function getOjStyle(oj) {
  return ojStyles[oj] || { ...ojStyles.其他, short: oj.slice(0, 2).toUpperCase() };
}

function ojMark(oj) {
  const style = getOjStyle(oj);
  return `<span class="oj-mark" style="--oj-color:${style.color};--oj-bg:${style.bg}" title="${escapeHtml(oj)}">${escapeHtml(style.short)}</span>`;
}

function difficultyClass(value) {
  return value === "简单" ? "easy" : value === "困难" ? "hard" : "medium";
}

function renderIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function renderSyncStatus() {
  const statuses = {
    local: { label: "本地模式", icon: "hard-drive", title: "尚未配置云端数据库" },
    loading: { label: "正在同步", icon: "loader-circle", title: "正在读取云端数据" },
    readonly: { label: "云端只读", icon: "cloud", title: "已连接数据库，登录后可以修改" },
    synced: { label: "已同步", icon: "cloud-check", title: `云端版本 ${cloud.version}` },
    saving: { label: "正在保存", icon: "cloud-upload", title: "正在写入云端数据库" },
    offline: { label: "离线副本", icon: "cloud-off", title: cloud.error || "云端暂时不可用，本机修改会保留" },
    conflict: { label: "同步冲突", icon: "triangle-alert", title: "云端和本机都有新修改，本机副本已保留" }
  };
  const status = statuses[cloud.status] || statuses.local;
  els.syncStatusButton.className = `sync-status-button is-${cloud.status}`;
  els.syncStatusButton.title = status.title;
  els.syncStatusButton.innerHTML = `<i data-lucide="${status.icon}"></i><span>${status.label}</span>`;
  renderIcons();
}

function render() {
  renderSidebar();
  renderTopbar();
  if (state.route === "knowledge") renderKnowledge();
  else renderContests();
  renderIcons();
}

function renderSidebar() {
  els.topicNav.innerHTML = getRootTopics()
    .map((topic) => {
      const children = getChildTopics(topic.id);
      const expanded = children.length && state.expandedTopics.has(topic.id);
      const standardChildren = children.filter((child) => child.group !== "custom");
      const customChildren = children.filter((child) => child.group === "custom");
      return `
        <div class="topic-tree-node">
          <div class="topic-nav-row">
            <button class="topic-nav-item ${state.topicId === topic.id && state.route === "knowledge" ? "is-active" : ""}" data-topic="${topic.id}">
              <span class="topic-dot" style="--topic-color:${topic.color}"></span>
              <span>${escapeHtml(topic.name)}</span>
              <span class="topic-count">${getTopicProblemCount(topic.id)}</span>
            </button>
            ${children.length ? `<button class="topic-expand ${expanded ? "is-expanded" : ""}" data-toggle-topic="${topic.id}" aria-label="${expanded ? "收起" : "展开"}${escapeHtml(topic.name)}子专题" title="${expanded ? "收起子专题" : "展开子专题"}"><i data-lucide="chevron-right"></i></button>` : ""}
          </div>
          ${children.length ? `
            <div class="topic-children ${expanded ? "is-expanded" : ""}">
              ${standardChildren.map(renderSidebarChild).join("")}
              ${customChildren.length ? `<span class="topic-child-label">我的专题</span>${customChildren.map(renderSidebarChild).join("")}` : ""}
            </div>` : ""}
        </div>`;
    })
    .join("");

  els.contestNavCount.textContent = state.data.contests.length;
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.route === state.route && button.classList.contains("nav-item"));
  });

  const training = state.data.problems.filter((problem) => problem.kind === "training");
  const done = training.filter((problem) => wasCompletedThisWeek(problem)).length;
  els.weeklyProgressText.textContent = `${done} / ${training.length}`;
  els.weeklyProgressBar.style.width = `${training.length ? (done / training.length) * 100 : 0}%`;
}

function renderSidebarChild(topic) {
  return `
    <button class="topic-nav-item topic-nav-child ${state.topicId === topic.id && state.route === "knowledge" ? "is-active" : ""}" data-topic="${topic.id}">
      <span class="topic-branch" aria-hidden="true"></span>
      <span>${escapeHtml(topic.name)}</span>
      ${topic.group === "custom" ? `<i class="custom-topic-icon" data-lucide="sparkles" aria-label="我的专题"></i>` : ""}
      <span class="topic-count">${getTopicProblemCount(topic.id)}</span>
    </button>`;
}

function renderTopbar() {
  const topic = getTopic(state.topicId);
  const parent = getParentTopic(topic);
  els.breadcrumb.innerHTML = state.route === "knowledge"
    ? `<span>知识点题单</span><i data-lucide="chevron-right"></i>${parent ? `<span>${escapeHtml(parent.name)}</span><i data-lucide="chevron-right"></i>` : ""}<strong>${escapeHtml(topic.name)}</strong>`
    : `<span>题径</span><i data-lucide="chevron-right"></i><strong>比赛收藏</strong>`;
  els.globalSearch.placeholder = state.route === "knowledge" ? "搜索题目、OJ 或标签" : "搜索比赛、OJ 或标签";
  els.knowledgeView.hidden = state.route !== "knowledge";
  els.contestView.hidden = state.route !== "contests";
  renderSyncStatus();
}

function matchesQuery(problem) {
  const q = state.query.trim().toLowerCase();
  if (!q) return true;
  const text = [problem.title, problem.problemId, problem.oj, problem.note, ...(problem.techniques || []), ...problem.knowledge.map(getTopicName)].join(" ").toLowerCase();
  return text.includes(q);
}

function renderTags(ids, max = ids.length) {
  return ids.slice(0, max).map((id) => `<span class="tag">${escapeHtml(getTopicName(id))}</span>`).join("");
}

function renderTechniqueTags(tags = [], max = tags.length) {
  return tags.slice(0, max).map((tag) => `<button class="technique-tag" data-technique="${escapeHtml(tag)}" title="按技巧检索"># ${escapeHtml(tag)}</button>`).join("");
}

function renderEntryActions(type, id, label) {
  return `
    <div class="entry-actions">
      <button class="entry-action" data-edit="${type}" data-entry-id="${escapeHtml(id)}" aria-label="编辑${escapeHtml(label)}" title="编辑">
        <i data-lucide="pencil"></i>
      </button>
      <button class="entry-action is-danger" data-delete="${type}" data-entry-id="${escapeHtml(id)}" data-entry-label="${escapeHtml(label)}" aria-label="删除${escapeHtml(label)}" title="删除">
        <i data-lucide="trash-2"></i>
      </button>
    </div>`;
}

function renderProblemCard(problem) {
  return `
    <article class="problem-card">
      <div class="problem-card-head">
        ${ojMark(problem.oj)}
        <div class="card-head-actions">
          <span class="difficulty ${difficultyClass(problem.difficulty)}">${escapeHtml(problem.difficulty)}</span>
          ${renderEntryActions("problem", problem.id, problem.title)}
        </div>
      </div>
      <h3>${escapeHtml(problem.title)}</h3>
      <span class="problem-id">${escapeHtml(problem.oj)} · ${escapeHtml(problem.problemId || "外部题目")}</span>
      <p class="problem-note">${escapeHtml(problem.note || "暂无补充说明")}</p>
      <div class="tag-row">${renderTags(problem.knowledge)}${renderTechniqueTags(problem.techniques)}</div>
      <a class="problem-card-link" href="${escapeHtml(problem.url)}" target="_blank" rel="noreferrer">
        去做题 <i data-lucide="arrow-up-right"></i>
      </a>
    </article>`;
}

function renderSubtopicOverview(topic) {
  const children = getChildTopics(topic.id);
  if (!children.length) return "";
  const standard = children.filter((child) => child.group !== "custom");
  const custom = children.filter((child) => child.group === "custom");
  const renderGroup = (title, description, items, group) => `
    <div class="subtopic-group">
      <div class="subtopic-group-heading">
        <div><h3>${title}</h3><p>${description}</p></div>
        ${group === "custom" ? `<button class="text-button" data-add="topic" data-parent-id="${topic.id}" data-topic-group="custom"><i data-lucide="plus"></i>添加我的专题</button>` : ""}
      </div>
      ${items.length ? `<div class="subtopic-grid">${items.map((child) => `
        <button class="subtopic-card" data-topic="${child.id}">
          <span class="subtopic-card-top"><span class="topic-dot" style="--topic-color:${child.color}"></span>${child.group === "custom" ? `<span class="custom-badge"><i data-lucide="sparkles"></i>我的专题</span>` : `<span>标准专题</span>`}</span>
          <strong>${escapeHtml(child.name)}</strong>
          <span class="subtopic-description">${escapeHtml(child.description)}</span>
          <span class="subtopic-count">${getTopicProblemCount(child.id)} 道题 <i data-lucide="arrow-right"></i></span>
        </button>`).join("")}</div>` : `<div class="subtopic-empty">还没有自定义专题，可以从一个常用技巧开始整理。</div>`}
    </div>`;

  return `
    <section class="section subtopic-section">
      <div class="section-heading">
        <div><h2>子专题</h2><p>按体系学习，也保留自己的建模经验。</p></div>
      </div>
      ${renderGroup("标准专题", "稳定的知识结构，用于系统训练。", standard, "standard")}
      ${renderGroup("我的专题", "把反复出现的技巧、错解与思考方式沉淀下来。", custom, "custom")}
    </section>`;
}

function renderKnowledge() {
  const topic = getTopic(state.topicId);
  const parent = getParentTopic(topic);
  const topicProblems = state.data.problems.filter((problem) => problemBelongsToTopic(problem, topic.id) && matchesQuery(problem));
  const classics = topicProblems.filter((problem) => problem.kind === "classic");
  const training = topicProblems.filter((problem) => problem.kind === "training");
  const filteredTraining = training.filter((problem) => state.difficulty === "全部" || problem.difficulty === state.difficulty);
  const doneCount = topicProblems.filter(isProblemDone).length;
  const article = topic.article || { title: `${topic.name}学习笔记`, body: ["这里还没有教学内容。"], outline: ["补充知识梳理", "添加经典例题", "安排实战训练"] };

  els.knowledgeContent.innerHTML = `
    <div class="content-wrap">
      <header class="topic-hero">
        <div class="topic-hero-main">
          <div class="topic-kicker-row">
            <div class="topic-kicker"><span class="topic-dot" style="--topic-color:${topic.color}"></span>${topic.group === "custom" ? "MY TOPIC" : parent ? "SUBTOPIC" : "KNOWLEDGE PATH"}</div>
            <div class="topic-heading-actions">
              ${!parent ? `<button class="entry-action" data-add="topic" data-parent-id="${topic.id}" data-topic-group="custom" aria-label="在${escapeHtml(topic.name)}下新增子专题" title="新增子专题"><i data-lucide="folder-plus"></i></button>` : ""}
              ${renderEntryActions("topic", topic.id, topic.name)}
            </div>
          </div>
          <h1>${escapeHtml(topic.name)}</h1>
          ${parent ? `<button class="parent-topic-link" data-topic="${parent.id}"><i data-lucide="corner-up-left"></i>${escapeHtml(parent.name)}</button>` : ""}
          <p>${escapeHtml(topic.description)}</p>
          <div class="topic-meta">
            <span><i data-lucide="book-open"></i>${classics.length} 道经典例题</span>
            <span><i data-lucide="swords"></i>${training.length} 道实战训练</span>
          </div>
        </div>
        <div class="hero-stat" aria-label="学习进度">
          <div><strong>${topicProblems.length}</strong><span>收录题目</span></div>
          <div><strong>${doneCount}</strong><span>已经完成</span></div>
        </div>
      </header>

      ${renderSubtopicOverview(topic)}

      <section class="section">
        <div class="section-heading">
          <div><h2>知识导读</h2><p>先建立框架，再进入题目。</p></div>
          <button class="text-button" data-add="article"><i data-lucide="pencil-line"></i>编辑内容</button>
        </div>
        <div class="lesson-layout">
          <article class="lesson-article">
            <span class="article-label"><i data-lucide="bookmark"></i> 学习笔记</span>
            <h3>${escapeHtml(article.title)}</h3>
            <div class="lesson-body ${state.lessonExpanded ? "is-expanded" : ""}">
              ${article.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
            </div>
            <button class="text-button lesson-expand" id="lessonExpand">
              ${state.lessonExpanded ? "收起" : "继续阅读"}<i data-lucide="${state.lessonExpanded ? "chevron-up" : "chevron-down"}"></i>
            </button>
          </article>
          <aside class="lesson-aside">
            <h4>本节脉络</h4>
            <ol>${article.outline.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
          </aside>
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <div><h2>经典例题</h2><p>用少量代表题掌握核心模型。</p></div>
          <button class="text-button" data-add="problem" data-kind="classic"><i data-lucide="plus"></i>添加例题</button>
        </div>
        ${classics.length ? `<div class="example-grid">${classics.map(renderProblemCard).join("")}</div>` : renderEmpty("暂无匹配的经典例题", "可以调整搜索词，或收录一道新题。")}
      </section>

      <section class="section">
        <div class="section-heading">
          <div><h2>实战训练</h2><p>完成后点亮状态，保留自己的练习节奏。</p></div>
          <button class="text-button" data-add="problem" data-kind="training"><i data-lucide="plus"></i>添加训练</button>
        </div>
        <div class="training-panel">
          <div class="training-toolbar">
            <div class="filter-group">
              ${["全部", "简单", "中等", "困难"].map((item) => `<button class="filter-button ${state.difficulty === item ? "is-active" : ""}" data-difficulty="${item}">${item}</button>`).join("")}
            </div>
            <span class="training-count">${filteredTraining.length} problems</span>
          </div>
          ${filteredTraining.length ? `
            <table class="problem-table">
              <thead><tr><th>状态</th><th>题目</th><th>难度</th><th>知识点</th><th>备注</th><th><span class="sr-only">操作</span></th></tr></thead>
              <tbody>
                ${filteredTraining.map((problem) => `
                  <tr>
                    <td><button class="status-check ${isProblemDone(problem) ? "is-done" : ""}" data-toggle-done="${problem.id}" aria-label="${isProblemDone(problem) ? "标记为未完成" : "标记为已完成"}" title="${isProblemDone(problem) ? "已完成" : "未完成"}"><i data-lucide="check"></i></button></td>
                    <td><div class="table-title">${ojMark(problem.oj)}<div><a href="${escapeHtml(problem.url)}" target="_blank" rel="noreferrer">${escapeHtml(problem.title)}</a><div class="problem-id">${escapeHtml(problem.problemId || problem.oj)}</div></div></div></td>
                    <td><span class="difficulty ${difficultyClass(problem.difficulty)}">${escapeHtml(problem.difficulty)}</span></td>
                    <td><div class="table-tags">${renderTags(problem.knowledge, 2)}</div></td>
                    <td class="problem-note">${problem.note ? `<span>${escapeHtml(problem.note)}</span>` : ""}${problem.techniques?.length ? `<div class="table-techniques">${renderTechniqueTags(problem.techniques, 2)}</div>` : ""}</td>
                    <td class="table-actions">${renderEntryActions("problem", problem.id, problem.title)}</td>
                  </tr>`).join("")}
              </tbody>
            </table>` : renderEmpty("暂无匹配的训练题", "试试切换难度或更换搜索词。")}
        </div>
      </section>
    </div>`;
}

function matchesContest(contest) {
  const q = state.query.trim().toLowerCase();
  if (!q) return true;
  return [contest.title, contest.oj, contest.note, ...contest.tags].join(" ").toLowerCase().includes(q);
}

function formatDateParts(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return { day: "--", month: "DATE", full: dateString || "日期未定" };
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: `${date.getMonth() + 1}月`,
    full: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  };
}

function renderContestCard(contest) {
  const date = formatDateParts(contest.date);
  return `
    <article class="contest-card">
      ${ojMark(contest.oj)}
      <div class="contest-card-body">
        <div class="contest-card-meta">
          <span>${escapeHtml(contest.oj)}</span><span>${escapeHtml(date.full)}</span>
          ${renderEntryActions("contest", contest.id, contest.title)}
        </div>
        <h3>${escapeHtml(contest.title)}</h3>
        <p>${escapeHtml(contest.note || "暂无复盘备注")}</p>
        <div class="contest-card-footer">
          <div class="tag-row">${contest.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
          <a class="external-link" href="${escapeHtml(contest.url)}" target="_blank" rel="noreferrer">比赛页面 <i data-lucide="arrow-up-right"></i></a>
        </div>
      </div>
    </article>`;
}

function renderContests() {
  const contests = state.data.contests.filter(matchesContest);
  const featured = contests.find((contest) => contest.featured) || contests[0];
  const rest = featured ? contests.filter((contest) => contest.id !== featured.id) : [];
  const featuredDate = featured ? formatDateParts(featured.date) : null;

  els.contestContent.innerHTML = `
    <div class="content-wrap">
      <header class="contest-header">
        <div>
          <div class="topic-kicker"><i data-lucide="trophy"></i> CONTEST ARCHIVE</div>
          <h1>比赛收藏</h1>
          <p>留下值得完整训练或赛后复盘的比赛，跨 OJ 建立自己的比赛档案。</p>
        </div>
        <div class="contest-header-side">
          <div class="contest-summary"><strong>${contests.length}</strong><span>场比赛</span></div>
          <button class="text-button" data-add="contest"><i data-lucide="plus"></i>添加比赛</button>
        </div>
      </header>

      ${featured ? `
        <section class="section">
          <div class="section-heading"><div><h2>近期推荐</h2><p>下一场完整训练，从这里开始。</p></div></div>
          <article class="featured-contest">
            <div class="contest-date"><strong>${featuredDate.day}</strong><span>${featuredDate.month}</span></div>
            <div class="featured-copy">
              <div class="contest-eyebrow">${ojMark(featured.oj)} ${escapeHtml(featured.oj)}</div>
              <h3>${escapeHtml(featured.title)}</h3>
              <p>${escapeHtml(featured.note || "暂无复盘备注")}</p>
              <div class="tag-row">${featured.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
            </div>
            <div class="featured-controls">
              ${renderEntryActions("contest", featured.id, featured.title)}
              <a class="primary-button" href="${escapeHtml(featured.url)}" target="_blank" rel="noreferrer">打开比赛 <i data-lucide="arrow-up-right"></i></a>
            </div>
          </article>
        </section>` : renderEmpty("还没有收藏比赛", "添加一场值得训练或复盘的比赛。")}

      ${rest.length ? `
        <section class="section">
          <div class="section-heading">
            <div><h2>全部比赛</h2><p>按自己的节奏回看与训练。</p></div>
            <button class="text-button" data-add="contest"><i data-lucide="plus"></i>添加比赛</button>
          </div>
          <div class="contest-grid">${rest.map(renderContestCard).join("")}</div>
        </section>` : ""}
    </div>`;
}

function renderEmpty(title, body) {
  return `<div class="empty-state"><div><i data-lucide="search-x"></i><strong>${escapeHtml(title)}</strong><p>${escapeHtml(body)}</p></div></div>`;
}

function navigate(route) {
  state.route = route;
  state.query = "";
  els.globalSearch.value = "";
  closeSidebar();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openSidebar() {
  els.sidebar.classList.add("is-open");
  els.sidebarScrim.classList.add("is-open");
}

function closeSidebar() {
  els.sidebar.classList.remove("is-open");
  els.sidebarScrim.classList.remove("is-open");
}

function topicOptions(selected = state.topicId) {
  return state.data.topics.map((topic) => {
    const parent = getParentTopic(topic);
    const label = parent ? `${parent.name} / ${topic.name}` : topic.name;
    return `<option value="${topic.id}" ${topic.id === selected ? "selected" : ""}>${escapeHtml(label)}</option>`;
  }).join("");
}

function topicCheckboxes(selectedIds = [state.topicId]) {
  const selected = new Set(selectedIds);
  return state.data.topics.map((topic) => {
    const parent = getParentTopic(topic);
    const label = parent ? `${parent.name} / ${topic.name}` : topic.name;
    return `
      <label class="checkbox-option ${parent ? "is-subtopic" : ""}">
        <input type="checkbox" name="knowledge" value="${topic.id}" ${selected.has(topic.id) ? "checked" : ""} />
        <span class="topic-dot" style="--topic-color:${topic.color}"></span><span>${escapeHtml(label)}</span>
      </label>`;
  }).join("");
}

function openModal(type, itemId = null, context = {}) {
  state.modalType = type;
  state.editingId = itemId;
  state.modalContext = context;
  els.addMenu.classList.remove("is-open");
  const editing = Boolean(itemId) && type !== "delete";
  const configs = {
    problem: { eyebrow: "PROBLEM", title: editing ? "编辑题目" : "收录题目", button: editing ? "保存修改" : "保存题目" },
    contest: { eyebrow: "CONTEST", title: editing ? "编辑比赛" : "收藏比赛", button: editing ? "保存修改" : "保存比赛" },
    topic: { eyebrow: "KNOWLEDGE", title: editing ? "编辑知识点" : context.parentId ? "新增子专题" : "新增知识点", button: editing ? "保存修改" : "创建知识点" },
    article: { eyebrow: "LESSON", title: "编辑教学内容", button: "保存内容" },
    delete: { eyebrow: "DELETE", title: "确认删除", button: "确认删除" },
    login: { eyebrow: "CLOUD", title: "管理员登录", button: "发送登录链接" },
    account: { eyebrow: "SYNC", title: "云端同步", button: "退出登录" }
  };
  const config = configs[type];
  els.modalEyebrow.textContent = config.eyebrow;
  els.modalTitle.textContent = config.title;
  els.submitButton.textContent = config.button;
  els.submitButton.classList.toggle("danger-button", type === "delete");
  els.formFields.innerHTML = getFormFields(type);
  els.modalLayer.hidden = false;
  document.body.style.overflow = "hidden";
  renderIcons();
  setTimeout(() => els.formFields.querySelector("input, textarea, select")?.focus(), 40);
}

function getFormFields(type) {
  if (type === "delete") {
    return `
      <div class="delete-confirmation">
        <span class="delete-confirmation-icon"><i data-lucide="triangle-alert"></i></span>
        <div><strong>删除“${escapeHtml(state.modalContext.label || "这个条目")}”？</strong><p>删除后会立即保存；启用云端同步时，也会同步到其他设备。</p></div>
      </div>`;
  }
  if (type === "login") {
    return `
      <label class="field"><span>管理员邮箱</span><input name="email" type="email" required autocomplete="email" placeholder="name@example.com" /></label>
      <div class="account-summary"><strong>邮箱魔法链接</strong><span>登录链接会发送到管理员邮箱，有效会话仅保存在当前浏览器。</span></div>`;
  }
  if (type === "account") {
    const pending = getPendingSync();
    return `
      <div class="account-summary"><strong>${escapeHtml(cloud.user?.email || "已登录")}</strong><span>云端版本 ${cloud.version}${cloud.updatedAt ? ` · ${new Date(cloud.updatedAt).toLocaleString("zh-CN")}` : ""}</span></div>
      ${pending ? `<div class="account-summary"><strong>本机有待同步修改</strong><span>${escapeHtml(pending.savedAt || "")}</span></div>` : ""}`;
  }
  if (type === "problem") {
    const problem = state.data.problems.find((item) => item.id === state.editingId);
    const difficulty = problem?.difficulty || "中等";
    const kind = problem?.kind || state.modalContext.kind || "classic";
    return `
      <label class="field"><span>题目名称</span><input name="title" required value="${escapeHtml(problem?.title || "")}" placeholder="例如：单源最短路径（标准版）" /></label>
      <label class="field"><span>题目链接</span><input name="url" type="url" required value="${escapeHtml(problem?.url || "")}" placeholder="https://..." /><small>支持任意在线评测网站的完整链接</small></label>
      <div class="form-row">
        <label class="field"><span>来源 OJ</span><input name="oj" required list="ojList" value="${escapeHtml(problem?.oj || "")}" placeholder="洛谷 / Codeforces / HDU" /><datalist id="ojList">${Object.keys(ojStyles).map((oj) => `<option value="${oj}"></option>`).join("")}</datalist></label>
        <label class="field"><span>题号</span><input name="problemId" value="${escapeHtml(problem?.problemId || "")}" placeholder="P4779" /></label>
      </div>
      <div class="form-row">
        <label class="field"><span>难度</span><select name="difficulty">${["简单", "中等", "困难"].map((item) => `<option ${item === difficulty ? "selected" : ""}>${item}</option>`).join("")}</select></label>
        <fieldset class="field"><legend>所在区域</legend><div class="radio-row"><label class="radio-option"><input type="radio" name="kind" value="classic" ${kind === "classic" ? "checked" : ""} />经典例题</label><label class="radio-option"><input type="radio" name="kind" value="training" ${kind === "training" ? "checked" : ""} />实战训练</label></div></fieldset>
      </div>
      <fieldset class="field"><legend>知识点（可多选）</legend><div class="checkbox-grid">${topicCheckboxes(problem?.knowledge || [state.topicId])}</div></fieldset>
      <label class="field"><span>技巧标签</span><input name="techniques" value="${escapeHtml(problem?.techniques?.join("，") || "")}" placeholder="Top-k 转恰选 k 个，等价转化，状态降维" /><small>描述这道题具体值得复用的技巧，使用逗号分隔</small></label>
      <label class="field"><span>备注</span><textarea name="note" placeholder="这道题值得收录的原因、关键思路或易错点">${escapeHtml(problem?.note || "")}</textarea></label>`;
  }
  if (type === "contest") {
    const contest = state.data.contests.find((item) => item.id === state.editingId);
    return `
      <label class="field"><span>比赛名称</span><input name="title" required value="${escapeHtml(contest?.title || "")}" placeholder="例如：AtCoder Beginner Contest 357" /></label>
      <label class="field"><span>比赛链接</span><input name="url" type="url" required value="${escapeHtml(contest?.url || "")}" placeholder="https://..." /></label>
      <div class="form-row">
        <label class="field"><span>来源 OJ</span><input name="oj" required list="ojList" value="${escapeHtml(contest?.oj || "")}" placeholder="AtCoder" /><datalist id="ojList">${Object.keys(ojStyles).map((oj) => `<option value="${oj}"></option>`).join("")}</datalist></label>
        <label class="field"><span>比赛日期</span><input name="date" type="date" value="${escapeHtml(contest?.date || new Date().toISOString().slice(0, 10))}" /></label>
      </div>
      <label class="field"><span>标签</span><input name="tags" value="${escapeHtml(contest?.tags?.join("，") || "")}" placeholder="综合, Div. 2, 动态规划" /><small>使用逗号分隔多个标签</small></label>
      <label class="field"><span>推荐理由 / 复盘备注</span><textarea name="note" placeholder="题目梯度、适合训练的知识点或建议用时">${escapeHtml(contest?.note || "")}</textarea></label>`;
  }
  if (type === "topic") {
    const topic = state.data.topics.find((item) => item.id === state.editingId);
    const parentId = topic?.parentId || state.modalContext.parentId || "";
    const topicGroup = topic?.group || state.modalContext.topicGroup || "custom";
    const parent = parentId ? getTopic(parentId) : null;
    return `
      <label class="field"><span>知识点名称</span><input name="name" required value="${escapeHtml(topic?.name || "")}" placeholder="例如：计算几何" /></label>
      <label class="field"><span>一句话说明</span><textarea name="description" required placeholder="这个知识点会收录哪些内容">${escapeHtml(topic?.description || "")}</textarea></label>
      ${topic ? `
        <input type="hidden" name="parentId" value="${escapeHtml(parentId)}" />
        <div class="account-summary"><strong>${parent ? `子专题 · ${escapeHtml(parent.name)}` : "一级知识点"}</strong><span>已有知识点的层级固定，避免题目导航关系意外变化。</span></div>` : `
        <label class="field"><span>所属一级知识点</span><select name="parentId"><option value="">作为一级知识点</option>${getRootTopics().map((root) => `<option value="${root.id}" ${root.id === parentId ? "selected" : ""}>${escapeHtml(root.name)}</option>`).join("")}</select><small>选择一级知识点后，它会作为子专题显示。</small></label>`}
      <fieldset class="field"><legend>专题类型</legend><div class="radio-row"><label class="radio-option"><input type="radio" name="topicGroup" value="standard" ${topicGroup === "standard" ? "checked" : ""} />标准专题</label><label class="radio-option"><input type="radio" name="topicGroup" value="custom" ${topicGroup === "custom" ? "checked" : ""} />我的专题</label></div><small>一级知识点会自动忽略这个选项。</small></fieldset>
      <label class="field"><span>识别色</span><input name="color" type="color" value="${escapeHtml(topic?.color || parent?.color || "#256d4b")}" /></label>`;
  }
  const topic = getTopic(state.topicId);
  const article = topic.article || { title: "", body: [], outline: [] };
  return `
    <label class="field"><span>所属知识点</span><select name="topicId">${topicOptions(topic.id)}</select></label>
    <label class="field"><span>文章标题</span><input name="title" required value="${escapeHtml(article.title)}" /></label>
    <label class="field"><span>正文</span><textarea class="article-input" name="body" required placeholder="每个段落之间空一行">${escapeHtml(article.body.join("\n\n"))}</textarea><small>使用空行分隔段落</small></label>
    <label class="field"><span>内容脉络</span><input name="outline" value="${escapeHtml(article.outline.join("，"))}" placeholder="要点一，要点二，要点三" /><small>使用逗号分隔</small></label>`;
}

function closeModal() {
  els.modalLayer.hidden = true;
  document.body.style.overflow = "";
  state.modalType = null;
  state.editingId = null;
  state.modalContext = {};
  els.submitButton.classList.remove("danger-button");
  els.entryForm.reset();
}

function slugify(input) {
  const latin = input.toLowerCase().trim().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-").replace(/^-|-$/g, "");
  return `${latin || "topic"}-${Date.now().toString(36).slice(-4)}`;
}

function ensureFeaturedContest() {
  if (state.data.contests.length && !state.data.contests.some((contest) => contest.featured)) {
    state.data.contests[0].featured = true;
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const type = state.modalType;
  els.submitButton.disabled = true;

  if (type === "login") {
    const redirectUrl = `${location.origin}${location.pathname}`;
    const result = await cloud.client.auth.signInWithOtp({
      email: form.get("email").trim(),
      options: { emailRedirectTo: redirectUrl }
    });
    els.submitButton.disabled = false;
    if (result.error) {
      showToast(result.error.message || "登录链接发送失败");
      return;
    }
    closeModal();
    showToast("登录链接已发送，请检查邮箱");
    return;
  }

  if (type === "account") {
    const result = await cloud.client.auth.signOut();
    els.submitButton.disabled = false;
    if (result.error) {
      showToast("退出登录失败");
      return;
    }
    closeModal();
    showToast("已退出管理员账号");
    return;
  }

  let successMessage = "已保存";
  if (type === "delete") {
    const { entityType } = state.modalContext;
    if (entityType === "problem") {
      state.data.problems = state.data.problems.filter((problem) => problem.id !== state.editingId);
      successMessage = "题目已删除";
    } else if (entityType === "contest") {
      state.data.contests = state.data.contests.filter((contest) => contest.id !== state.editingId);
      ensureFeaturedContest();
      successMessage = "比赛已删除";
    } else if (entityType === "topic") {
      const linkedCount = state.data.problems.filter((problem) => problem.knowledge.includes(state.editingId)).length;
      const childCount = getChildTopics(state.editingId).length;
      if (linkedCount) {
        els.submitButton.disabled = false;
        showToast(`请先修改关联的 ${linkedCount} 道题，再删除知识点`);
        return;
      }
      if (childCount) {
        els.submitButton.disabled = false;
        showToast(`请先处理下面的 ${childCount} 个子专题`);
        return;
      }
      const deletingTopic = getTopic(state.editingId);
      if (!deletingTopic.parentId && getRootTopics().length === 1) {
        els.submitButton.disabled = false;
        showToast("至少需要保留一个一级知识点");
        return;
      }
      state.data.topics = state.data.topics.filter((topic) => topic.id !== state.editingId);
      state.topicId = deletingTopic.parentId || getRootTopics()[0].id;
      successMessage = deletingTopic.parentId ? "子专题已删除" : "知识点已删除";
    }
  } else if (type === "problem") {
    const knowledge = form.getAll("knowledge");
    if (!knowledge.length) {
      els.submitButton.disabled = false;
      showToast("请至少选择一个知识点");
      return;
    }
    const existing = state.data.problems.find((problem) => problem.id === state.editingId);
    const problem = {
      id: existing?.id || `p-${Date.now()}`,
      title: form.get("title").trim(),
      url: form.get("url").trim(),
      oj: form.get("oj").trim(),
      problemId: form.get("problemId").trim(),
      difficulty: form.get("difficulty"),
      knowledge,
      techniques: form.get("techniques").split(/[，,]/).map((tag) => tag.trim()).filter(Boolean),
      kind: form.get("kind"),
      note: form.get("note").trim()
    };
    if (existing) Object.assign(existing, problem);
    else state.data.problems.unshift(problem);
    state.topicId = knowledge[0];
    state.route = "knowledge";
    successMessage = existing ? "题目已更新" : "题目已加入题单";
  } else if (type === "contest") {
    const existing = state.data.contests.find((contest) => contest.id === state.editingId);
    const contest = {
      id: existing?.id || `c-${Date.now()}`,
      title: form.get("title").trim(),
      url: form.get("url").trim(),
      oj: form.get("oj").trim(),
      date: form.get("date"),
      note: form.get("note").trim(),
      tags: form.get("tags").split(/[，,]/).map((tag) => tag.trim()).filter(Boolean),
      featured: existing?.featured || state.data.contests.length === 0
    };
    if (existing) Object.assign(existing, contest);
    else state.data.contests.unshift(contest);
    state.route = "contests";
    successMessage = existing ? "比赛已更新" : "比赛已收藏";
  } else if (type === "topic") {
    const name = form.get("name").trim();
    const existing = state.data.topics.find((topic) => topic.id === state.editingId);
    const parentId = form.get("parentId") || null;
    const group = parentId ? form.get("topicGroup") : "root";
    if (existing) {
      existing.name = name;
      existing.color = form.get("color");
      existing.description = form.get("description").trim();
      existing.group = existing.parentId ? form.get("topicGroup") : "root";
      state.topicId = existing.id;
    } else {
      const id = slugify(name);
      state.data.topics.push({
        id,
        name,
        parentId,
        group,
        color: form.get("color"),
        description: form.get("description").trim(),
        article: { title: `${name}学习笔记`, body: ["这里还没有教学内容。"], outline: ["建立知识框架", "补充经典例题", "安排实战训练"] }
      });
      state.topicId = id;
      if (parentId) state.expandedTopics.add(parentId);
    }
    state.route = "knowledge";
    successMessage = existing ? "知识点已更新" : parentId ? "子专题已创建" : "知识点已创建";
  } else if (type === "article") {
    const topic = getTopic(form.get("topicId"));
    topic.article = {
      title: form.get("title").trim(),
      body: form.get("body").split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean),
      outline: form.get("outline").split(/[，,]/).map((item) => item.trim()).filter(Boolean)
    };
    state.topicId = topic.id;
    state.route = "knowledge";
    successMessage = "教学内容已更新";
  }

  try {
    await saveData();
    showToast(successMessage);
  } catch (error) {
    showToast(error.message || "保存失败，本机修改已保留");
  } finally {
    els.submitButton.disabled = false;
  }
  closeModal();
  render();
}

let toastTimer;
function showToast(message) {
  els.toastText.textContent = message;
  els.toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("is-visible"), 2200);
}

function canModify(message = "登录管理员账号后即可修改云端题单") {
  if (!cloud.enabled || cloud.user) return true;
  openModal("login");
  showToast(message);
  return false;
}

document.addEventListener("click", async (event) => {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) navigate(routeButton.dataset.route);

  const topicToggle = event.target.closest("[data-toggle-topic]");
  if (topicToggle) {
    const id = topicToggle.dataset.toggleTopic;
    if (state.expandedTopics.has(id)) state.expandedTopics.delete(id);
    else state.expandedTopics.add(id);
    renderSidebar();
    renderIcons();
  }

  const topicButton = event.target.closest("[data-topic]");
  if (topicButton) {
    state.topicId = topicButton.dataset.topic;
    const parent = getParentTopic(getTopic(state.topicId));
    if (parent) state.expandedTopics.add(parent.id);
    else if (getChildTopics(state.topicId).length) state.expandedTopics.add(state.topicId);
    state.route = "knowledge";
    state.query = "";
    state.difficulty = "全部";
    state.lessonExpanded = false;
    els.globalSearch.value = "";
    closeSidebar();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const addTarget = event.target.closest("[data-add]");
  if (addTarget) {
    if (canModify()) {
      openModal(addTarget.dataset.add, null, {
        kind: addTarget.dataset.kind,
        parentId: addTarget.dataset.parentId,
        topicGroup: addTarget.dataset.topicGroup
      });
    }
  }

  const editTarget = event.target.closest("[data-edit]");
  if (editTarget && canModify()) {
    openModal(editTarget.dataset.edit, editTarget.dataset.entryId);
  }

  const deleteTarget = event.target.closest("[data-delete]");
  if (deleteTarget && canModify()) {
    openModal("delete", deleteTarget.dataset.entryId, {
      entityType: deleteTarget.dataset.delete,
      label: deleteTarget.dataset.entryLabel
    });
  }

  const techniqueTarget = event.target.closest("[data-technique]");
  if (techniqueTarget) {
    state.query = techniqueTarget.dataset.technique;
    els.globalSearch.value = state.query;
    renderKnowledge();
    renderIcons();
  }

  if (event.target.closest("[data-close-modal]")) closeModal();

  const difficultyButton = event.target.closest("[data-difficulty]");
  if (difficultyButton) {
    state.difficulty = difficultyButton.dataset.difficulty;
    renderKnowledge();
    renderIcons();
  }

  const doneButton = event.target.closest("[data-toggle-done]");
  if (doneButton) {
    const problem = state.data.problems.find((item) => item.id === doneButton.dataset.toggleDone);
    if (problem) {
      const wasDone = isProblemDone(problem);
      if (wasDone) delete state.progress.completed[problem.id];
      else state.progress.completed[problem.id] = new Date().toISOString();
      saveProgress();
      render();
      showToast(wasDone ? "已移回待完成" : "已标记为完成");
    }
  }

  if (event.target.closest("#lessonExpand")) {
    state.lessonExpanded = !state.lessonExpanded;
    renderKnowledge();
    renderIcons();
  }

  if (!event.target.closest(".add-wrap")) els.addMenu.classList.remove("is-open");
});

els.addButton.addEventListener("click", (event) => {
  event.stopPropagation();
  els.addMenu.classList.toggle("is-open");
});

els.syncStatusButton.addEventListener("click", async () => {
  if (!cloud.enabled) {
    showToast("配置 Supabase 后会启用云端同步");
    return;
  }
  if (!cloud.user) {
    openModal("login");
    return;
  }
  if (getPendingSync() && cloud.status !== "conflict") {
    await loadRemoteData();
    return;
  }
  openModal("account");
});

els.globalSearch.addEventListener("input", (event) => {
  state.query = event.target.value;
  if (state.route === "knowledge") renderKnowledge();
  else renderContests();
  renderIcons();
});

els.entryForm.addEventListener("submit", handleSubmit);
els.menuButton.addEventListener("click", openSidebar);
els.sidebarClose.addEventListener("click", closeSidebar);
els.sidebarScrim.addEventListener("click", closeSidebar);

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    els.globalSearch.focus();
  }
  if (event.key === "Escape") {
    if (!els.modalLayer.hidden) closeModal();
    els.addMenu.classList.remove("is-open");
    closeSidebar();
  }
});

render();
initializeCloud().catch((error) => {
  cloud.status = "offline";
  cloud.error = error.message || "云端初始化失败";
  renderSyncStatus();
});
