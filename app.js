const STORAGE_KEY = "tijing-data-v2";

const seedData = {
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
    }
  ],
  problems: [
    {
      id: "p1",
      title: "【模板】单源最短路径（标准版）",
      problemId: "P4779",
      oj: "洛谷",
      url: "https://www.luogu.com.cn/problem/P4779",
      difficulty: "中等",
      knowledge: ["graph", "data-structure"],
      kind: "classic",
      note: "Dijkstra 的标准实现，适合配合优先队列理解松弛操作。",
      done: true
    },
    {
      id: "p2",
      title: "Dijkstra?",
      problemId: "20C",
      oj: "Codeforces",
      url: "https://codeforces.com/problemset/problem/20/C",
      difficulty: "中等",
      knowledge: ["graph", "data-structure"],
      kind: "classic",
      note: "除了最短距离，还要记录并还原一条具体路径。",
      done: true
    },
    {
      id: "p3",
      title: "Network Delay Time",
      problemId: "743",
      oj: "LeetCode",
      url: "https://leetcode.cn/problems/network-delay-time/",
      difficulty: "中等",
      knowledge: ["graph"],
      kind: "classic",
      note: "用传播时间理解单源最短路结果的含义。",
      done: false
    },
    {
      id: "p4",
      title: "灾后重建",
      problemId: "P1119",
      oj: "洛谷",
      url: "https://www.luogu.com.cn/problem/P1119",
      difficulty: "困难",
      knowledge: ["graph", "dp"],
      kind: "training",
      note: "离线询问与 Floyd 增量更新。",
      done: false
    },
    {
      id: "p5",
      title: "Greg and Graph",
      problemId: "295B",
      oj: "Codeforces",
      url: "https://codeforces.com/problemset/problem/295/B",
      difficulty: "困难",
      knowledge: ["graph", "dp"],
      kind: "training",
      note: "反向加点视角下的 Floyd。",
      done: true
    },
    {
      id: "p6",
      title: "Road Reduction",
      problemId: "ABC252 E",
      oj: "AtCoder",
      url: "https://atcoder.jp/contests/abc252/tasks/abc252_e",
      difficulty: "中等",
      knowledge: ["graph"],
      kind: "training",
      note: "从最短路树中恢复边的编号。",
      done: false
    },
    {
      id: "p7",
      title: "最大子段和",
      problemId: "P1115",
      oj: "洛谷",
      url: "https://www.luogu.com.cn/problem/P1115",
      difficulty: "简单",
      knowledge: ["dp", "greedy"],
      kind: "classic",
      note: "用最精简的状态理解线性 DP。",
      done: true
    },
    {
      id: "p8",
      title: "加分二叉树",
      problemId: "P1040",
      oj: "洛谷",
      url: "https://www.luogu.com.cn/problem/P1040",
      difficulty: "中等",
      knowledge: ["dp"],
      kind: "training",
      note: "区间 DP 与方案恢复。",
      done: false
    },
    {
      id: "p9",
      title: "食物链",
      problemId: "P2024",
      oj: "洛谷",
      url: "https://www.luogu.com.cn/problem/P2024",
      difficulty: "中等",
      knowledge: ["data-structure"],
      kind: "classic",
      note: "扩展域并查集的典型建模。",
      done: false
    },
    {
      id: "p10",
      title: "Radio Transmission",
      problemId: "P4391",
      oj: "洛谷",
      url: "https://www.luogu.com.cn/problem/P4391",
      difficulty: "中等",
      knowledge: ["strings"],
      kind: "classic",
      note: "用前缀函数寻找最短循环节。",
      done: false
    }
  ],
  contests: [
    {
      id: "c1",
      title: "Educational Codeforces Round 166",
      oj: "Codeforces",
      url: "https://codeforces.com/contest/1971",
      date: "2024-05-30",
      note: "题目梯度自然，A–D 很适合作为整场限时训练。",
      tags: ["综合", "Div. 2"],
      featured: true
    },
    {
      id: "c2",
      title: "AtCoder Beginner Contest 357",
      oj: "AtCoder",
      url: "https://atcoder.jp/contests/abc357",
      date: "2024-06-08",
      note: "覆盖模拟、字符串与矩阵快速幂，后半场区分度很好。",
      tags: ["综合", "ABC"]
    },
    {
      id: "c3",
      title: "LeetCode 第 400 场周赛",
      oj: "LeetCode",
      url: "https://leetcode.cn/contest/weekly-contest-400/",
      date: "2024-06-02",
      note: "前两题适合练手，后两题可以集中训练状态设计。",
      tags: ["周赛", "动态规划"]
    },
    {
      id: "c4",
      title: "Codeforces Round 954 (Div. 3)",
      oj: "Codeforces",
      url: "https://codeforces.com/contest/1986",
      date: "2024-06-23",
      note: "题量充足，适合按两小时完整复盘。",
      tags: ["Div. 3", "限时训练"]
    }
  ]
};

const ojStyles = {
  洛谷: { short: "LG", color: "#b54234", bg: "#fae9e3" },
  Codeforces: { short: "CF", color: "#3865a8", bg: "#e8edf6" },
  AtCoder: { short: "AT", color: "#4e5651", bg: "#eceeeb" },
  LeetCode: { short: "LC", color: "#9a670e", bg: "#f8efd7" },
  AcWing: { short: "AW", color: "#7255a6", bg: "#efeaf7" },
  牛客: { short: "NC", color: "#1f7783", bg: "#e1f0f1" },
  其他: { short: "OJ", color: "#5d665f", bg: "#eceeeb" }
};

const state = {
  data: loadData(),
  route: "knowledge",
  topicId: "graph",
  query: "",
  difficulty: "全部",
  modalType: null,
  lessonExpanded: false
};

const els = {
  sidebar: document.querySelector("#sidebar"),
  sidebarScrim: document.querySelector("#sidebarScrim"),
  menuButton: document.querySelector("#menuButton"),
  sidebarClose: document.querySelector("#sidebarClose"),
  topicNav: document.querySelector("#topicNav"),
  breadcrumb: document.querySelector("#breadcrumb"),
  globalSearch: document.querySelector("#globalSearch"),
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
    return saved ? JSON.parse(saved) : structuredClone(seedData);
  } catch {
    return structuredClone(seedData);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
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
  return getTopic(id)?.name || id;
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

function render() {
  renderSidebar();
  renderTopbar();
  if (state.route === "knowledge") renderKnowledge();
  else renderContests();
  renderIcons();
}

function renderSidebar() {
  els.topicNav.innerHTML = state.data.topics
    .map((topic) => {
      const count = state.data.problems.filter((problem) => problem.knowledge.includes(topic.id)).length;
      return `
        <button class="topic-nav-item ${state.topicId === topic.id && state.route === "knowledge" ? "is-active" : ""}" data-topic="${topic.id}">
          <span class="topic-dot" style="--topic-color:${topic.color}"></span>
          <span>${escapeHtml(topic.name)}</span>
          <span class="topic-count">${count}</span>
        </button>`;
    })
    .join("");

  els.contestNavCount.textContent = state.data.contests.length;
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.route === state.route && button.classList.contains("nav-item"));
  });

  const training = state.data.problems.filter((problem) => problem.kind === "training");
  const done = training.filter((problem) => problem.done).length;
  els.weeklyProgressText.textContent = `${done} / ${training.length}`;
  els.weeklyProgressBar.style.width = `${training.length ? (done / training.length) * 100 : 0}%`;
}

function renderTopbar() {
  const topic = getTopic(state.topicId);
  els.breadcrumb.innerHTML = state.route === "knowledge"
    ? `<span>知识点题单</span><i data-lucide="chevron-right"></i><strong>${escapeHtml(topic.name)}</strong>`
    : `<span>题径</span><i data-lucide="chevron-right"></i><strong>比赛收藏</strong>`;
  els.globalSearch.placeholder = state.route === "knowledge" ? "搜索题目、OJ 或标签" : "搜索比赛、OJ 或标签";
  els.knowledgeView.hidden = state.route !== "knowledge";
  els.contestView.hidden = state.route !== "contests";
}

function matchesQuery(problem) {
  const q = state.query.trim().toLowerCase();
  if (!q) return true;
  const text = [problem.title, problem.problemId, problem.oj, problem.note, ...problem.knowledge.map(getTopicName)].join(" ").toLowerCase();
  return text.includes(q);
}

function renderTags(ids, max = ids.length) {
  return ids.slice(0, max).map((id) => `<span class="tag">${escapeHtml(getTopicName(id))}</span>`).join("");
}

function renderProblemCard(problem) {
  return `
    <article class="problem-card">
      <div class="problem-card-head">
        ${ojMark(problem.oj)}
        <span class="difficulty ${difficultyClass(problem.difficulty)}">${escapeHtml(problem.difficulty)}</span>
      </div>
      <h3>${escapeHtml(problem.title)}</h3>
      <span class="problem-id">${escapeHtml(problem.oj)} · ${escapeHtml(problem.problemId || "外部题目")}</span>
      <p class="problem-note">${escapeHtml(problem.note || "暂无补充说明")}</p>
      <div class="tag-row">${renderTags(problem.knowledge)}</div>
      <a class="problem-card-link" href="${escapeHtml(problem.url)}" target="_blank" rel="noreferrer">
        去做题 <i data-lucide="arrow-up-right"></i>
      </a>
    </article>`;
}

function renderKnowledge() {
  const topic = getTopic(state.topicId);
  const topicProblems = state.data.problems.filter((problem) => problem.knowledge.includes(topic.id) && matchesQuery(problem));
  const classics = topicProblems.filter((problem) => problem.kind === "classic");
  const training = topicProblems.filter((problem) => problem.kind === "training");
  const filteredTraining = training.filter((problem) => state.difficulty === "全部" || problem.difficulty === state.difficulty);
  const doneCount = topicProblems.filter((problem) => problem.done).length;
  const article = topic.article || { title: `${topic.name}学习笔记`, body: ["这里还没有教学内容。"], outline: ["补充知识梳理", "添加经典例题", "安排实战训练"] };

  els.knowledgeContent.innerHTML = `
    <div class="content-wrap">
      <header class="topic-hero">
        <div class="topic-hero-main">
          <div class="topic-kicker"><span class="topic-dot" style="--topic-color:${topic.color}"></span> KNOWLEDGE PATH</div>
          <h1>${escapeHtml(topic.name)}</h1>
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
          <button class="text-button" data-add="problem"><i data-lucide="plus"></i>添加例题</button>
        </div>
        ${classics.length ? `<div class="example-grid">${classics.map(renderProblemCard).join("")}</div>` : renderEmpty("暂无匹配的经典例题", "可以调整搜索词，或收录一道新题。")}
      </section>

      <section class="section">
        <div class="section-heading">
          <div><h2>实战训练</h2><p>完成后点亮状态，保留自己的练习节奏。</p></div>
          <button class="text-button" data-add="problem"><i data-lucide="plus"></i>添加训练</button>
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
              <thead><tr><th>状态</th><th>题目</th><th>难度</th><th>知识点</th><th>备注</th></tr></thead>
              <tbody>
                ${filteredTraining.map((problem) => `
                  <tr>
                    <td><button class="status-check ${problem.done ? "is-done" : ""}" data-toggle-done="${problem.id}" aria-label="${problem.done ? "标记为未完成" : "标记为已完成"}" title="${problem.done ? "已完成" : "未完成"}"><i data-lucide="check"></i></button></td>
                    <td><div class="table-title">${ojMark(problem.oj)}<div><a href="${escapeHtml(problem.url)}" target="_blank" rel="noreferrer">${escapeHtml(problem.title)}</a><div class="problem-id">${escapeHtml(problem.problemId || problem.oj)}</div></div></div></td>
                    <td><span class="difficulty ${difficultyClass(problem.difficulty)}">${escapeHtml(problem.difficulty)}</span></td>
                    <td><div class="table-tags">${renderTags(problem.knowledge, 2)}</div></td>
                    <td class="problem-note">${escapeHtml(problem.note || "—")}</td>
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
        <div class="contest-card-meta"><span>${escapeHtml(contest.oj)}</span><span>${escapeHtml(date.full)}</span></div>
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
        <div class="contest-summary"><strong>${contests.length}</strong><span>场比赛</span></div>
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
            <a class="primary-button" href="${escapeHtml(featured.url)}" target="_blank" rel="noreferrer">打开比赛 <i data-lucide="arrow-up-right"></i></a>
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
  return state.data.topics.map((topic) => `<option value="${topic.id}" ${topic.id === selected ? "selected" : ""}>${escapeHtml(topic.name)}</option>`).join("");
}

function topicCheckboxes() {
  return state.data.topics.map((topic) => `
    <label class="checkbox-option">
      <input type="checkbox" name="knowledge" value="${topic.id}" ${topic.id === state.topicId ? "checked" : ""} />
      <span class="topic-dot" style="--topic-color:${topic.color}"></span>${escapeHtml(topic.name)}
    </label>`).join("");
}

function openModal(type) {
  state.modalType = type;
  els.addMenu.classList.remove("is-open");
  const configs = {
    problem: { eyebrow: "PROBLEM", title: "收录题目", button: "保存题目" },
    contest: { eyebrow: "CONTEST", title: "收藏比赛", button: "保存比赛" },
    topic: { eyebrow: "KNOWLEDGE", title: "新增知识点", button: "创建知识点" },
    article: { eyebrow: "LESSON", title: "编辑教学内容", button: "保存内容" }
  };
  const config = configs[type];
  els.modalEyebrow.textContent = config.eyebrow;
  els.modalTitle.textContent = config.title;
  els.submitButton.textContent = config.button;
  els.formFields.innerHTML = getFormFields(type);
  els.modalLayer.hidden = false;
  document.body.style.overflow = "hidden";
  renderIcons();
  setTimeout(() => els.formFields.querySelector("input, textarea, select")?.focus(), 40);
}

function getFormFields(type) {
  if (type === "problem") {
    return `
      <label class="field"><span>题目名称</span><input name="title" required placeholder="例如：单源最短路径（标准版）" /></label>
      <label class="field"><span>题目链接</span><input name="url" type="url" required placeholder="https://..." /><small>支持任意在线评测网站的完整链接</small></label>
      <div class="form-row">
        <label class="field"><span>来源 OJ</span><input name="oj" required list="ojList" placeholder="洛谷 / Codeforces / 其他" /><datalist id="ojList">${Object.keys(ojStyles).map((oj) => `<option value="${oj}"></option>`).join("")}</datalist></label>
        <label class="field"><span>题号</span><input name="problemId" placeholder="P4779" /></label>
      </div>
      <div class="form-row">
        <label class="field"><span>难度</span><select name="difficulty"><option>简单</option><option selected>中等</option><option>困难</option></select></label>
        <fieldset class="field"><legend>所在区域</legend><div class="radio-row"><label class="radio-option"><input type="radio" name="kind" value="classic" checked />经典例题</label><label class="radio-option"><input type="radio" name="kind" value="training" />实战训练</label></div></fieldset>
      </div>
      <fieldset class="field"><legend>知识点（可多选）</legend><div class="checkbox-grid">${topicCheckboxes()}</div></fieldset>
      <label class="field"><span>备注</span><textarea name="note" placeholder="这道题值得收录的原因、关键思路或易错点"></textarea></label>`;
  }
  if (type === "contest") {
    return `
      <label class="field"><span>比赛名称</span><input name="title" required placeholder="例如：AtCoder Beginner Contest 357" /></label>
      <label class="field"><span>比赛链接</span><input name="url" type="url" required placeholder="https://..." /></label>
      <div class="form-row">
        <label class="field"><span>来源 OJ</span><input name="oj" required list="ojList" placeholder="AtCoder" /><datalist id="ojList">${Object.keys(ojStyles).map((oj) => `<option value="${oj}"></option>`).join("")}</datalist></label>
        <label class="field"><span>比赛日期</span><input name="date" type="date" value="${new Date().toISOString().slice(0, 10)}" /></label>
      </div>
      <label class="field"><span>标签</span><input name="tags" placeholder="综合, Div. 2, 动态规划" /><small>使用逗号分隔多个标签</small></label>
      <label class="field"><span>推荐理由 / 复盘备注</span><textarea name="note" placeholder="题目梯度、适合训练的知识点或建议用时"></textarea></label>`;
  }
  if (type === "topic") {
    return `
      <label class="field"><span>知识点名称</span><input name="name" required placeholder="例如：计算几何" /></label>
      <label class="field"><span>一句话说明</span><textarea name="description" required placeholder="这个知识点会收录哪些内容"></textarea></label>
      <label class="field"><span>识别色</span><input name="color" type="color" value="#256d4b" /></label>`;
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
  els.entryForm.reset();
}

function slugify(input) {
  const latin = input.toLowerCase().trim().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-").replace(/^-|-$/g, "");
  return `${latin || "topic"}-${Date.now().toString(36).slice(-4)}`;
}

function handleSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const type = state.modalType;
  if (type === "problem") {
    const knowledge = form.getAll("knowledge");
    if (!knowledge.length) {
      showToast("请至少选择一个知识点");
      return;
    }
    state.data.problems.unshift({
      id: `p-${Date.now()}`,
      title: form.get("title").trim(),
      url: form.get("url").trim(),
      oj: form.get("oj").trim(),
      problemId: form.get("problemId").trim(),
      difficulty: form.get("difficulty"),
      knowledge,
      kind: form.get("kind"),
      note: form.get("note").trim(),
      done: false
    });
    state.topicId = knowledge[0];
    state.route = "knowledge";
    showToast("题目已加入题单");
  } else if (type === "contest") {
    state.data.contests.unshift({
      id: `c-${Date.now()}`,
      title: form.get("title").trim(),
      url: form.get("url").trim(),
      oj: form.get("oj").trim(),
      date: form.get("date"),
      note: form.get("note").trim(),
      tags: form.get("tags").split(/[，,]/).map((tag) => tag.trim()).filter(Boolean),
      featured: state.data.contests.length === 0
    });
    state.route = "contests";
    showToast("比赛已收藏");
  } else if (type === "topic") {
    const name = form.get("name").trim();
    const id = slugify(name);
    state.data.topics.push({
      id,
      name,
      color: form.get("color"),
      description: form.get("description").trim(),
      article: { title: `${name}学习笔记`, body: ["这里还没有教学内容。"], outline: ["建立知识框架", "补充经典例题", "安排实战训练"] }
    });
    state.topicId = id;
    state.route = "knowledge";
    showToast("知识点已创建");
  } else if (type === "article") {
    const topic = getTopic(form.get("topicId"));
    topic.article = {
      title: form.get("title").trim(),
      body: form.get("body").split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean),
      outline: form.get("outline").split(/[，,]/).map((item) => item.trim()).filter(Boolean)
    };
    state.topicId = topic.id;
    state.route = "knowledge";
    showToast("教学内容已更新");
  }
  saveData();
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

document.addEventListener("click", (event) => {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) navigate(routeButton.dataset.route);

  const topicButton = event.target.closest("[data-topic]");
  if (topicButton) {
    state.topicId = topicButton.dataset.topic;
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
  if (addTarget) openModal(addTarget.dataset.add);

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
      problem.done = !problem.done;
      saveData();
      render();
      showToast(problem.done ? "已标记为完成" : "已移回待完成");
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
