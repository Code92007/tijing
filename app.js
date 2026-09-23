const STORAGE_KEY = "tijing-data-v5";
const PENDING_KEY = "tijing-pending-sync-v1";
const PROGRESS_KEY = "tijing-progress-v1";
const PRESET_PROBLEM_IDS = new Set(["p4", "p5", "p6", "p8"]);
const PRESET_CONTEST_IDS = new Set(["c1", "c2", "c3", "c4"]);
const REMOVED_PROBLEM_IDS = new Set([
  "dp-digit-hdu3652",
  "dp-digit-cf55-d",
  "dp-digit-probability-cf54-c",
  "dp-digit-hdu4352",
  "dp-probability-cf167-b",
  "dp-probability-cf280-c",
  "dp-probability-cf1540-b"
]);
const REMOVED_PROBLEM_SOURCES = new Set([
  "hdu:3652",
  "codeforces:55d",
  "codeforces:54c",
  "hdu:4352",
  "codeforces:167b",
  "codeforces:280c",
  "codeforces:1540b"
]);
const CATALOG_SCHEMA_VERSION = 8;

const defaultDpSubtopics = [
  { id: "dp-linear", name: "线性 DP", color: "#4f78b5", description: "沿序列或阶段推进状态，处理前缀、子序列与多状态转移。" },
  { id: "dp-counting", name: "计数 DP", color: "#3f7d68", description: "围绕方案数设计状态，处理组合结构、贡献统计与去重。" },
  { id: "dp-insertion", name: "插入 DP", color: "#5f8f75", description: "按值或位置逐个插入元素，维护排列结构与新增贡献。" },
  { id: "dp-out-of-order", name: "乱序 DP", color: "#49776f", description: "依据偏序或依赖关系安排非自然顺序的状态遍历。" },
  { id: "dp-knapsack", name: "背包 DP", color: "#8a6a3f", description: "围绕容量、选择次数与物品组合建立状态。" },
  { id: "dp-tree-knapsack", name: "树形背包", color: "#5d7f56", description: "在树上合并子树的容量或选择状态，处理分组选择与结构约束。" },
  { id: "dp-digit-knapsack", name: "数位背包", color: "#7e7843", description: "把数位限制与背包维度结合，维护数量、余数或选取状态。" },
  { id: "dp-interval", name: "区间 DP", color: "#b75c49", description: "按区间长度组织转移，处理合并、分割与括号结构。" },
  { id: "dp-interval-elimination", name: "消除类 DP", color: "#a95053", description: "围绕相邻合并、同类消除和区间缩减设计状态。" },
  { id: "dp-fill-holes", name: "填坑 DP", color: "#b06b3f", description: "围绕空位、缺口或待补结构安排转移，处理非标准区间状态。" },
  { id: "dp-tree", name: "树形 DP", color: "#4b8063", description: "在树上汇总子树信息，设计父子状态与合并方式。" },
  { id: "dp-bitmask", name: "状态压缩 DP", color: "#735d9f", description: "用位集合表示选择状态，解决小规模组合决策问题。" },
  { id: "dp-subset", name: "子集 DP", color: "#2f7d83", description: "围绕子集枚举、子集划分与补集关系组织转移。" },
  { id: "dp-sos", name: "SOS DP", color: "#a05d75", description: "沿子集包含关系做高维前缀和与信息聚合。" },
  { id: "dp-digit", name: "数位 DP", color: "#5f6f3d", description: "按数位处理上界、前导零与自动机状态，统计区间内的数字。" },
  { id: "dp-carry-digit", name: "进位数位 DP", color: "#778944", description: "在逐位转移中显式维护进位或借位，处理跨位影响。" },
  { id: "dp-probability", name: "概率 / 期望 DP", color: "#a46532", description: "用概率转移、期望线性性与贡献拆分刻画随机过程。" }
].map((topic, index) => ({
  ...topic,
  parentId: topic.parentId || "dp",
  group: "standard",
  color: topic.color || ["#4f78b5", "#8a6a3f", "#b75c49", "#4b8063", "#735d9f", "#2f7d83", "#a05d75", "#5f6f3d", "#a46532"][index % 9],
  article: {
    title: `${topic.name}学习笔记`,
    body: ["这里还没有教学内容，可以从核心状态、常见转移和典型边界开始整理。"],
    outline: ["定义状态", "推导转移", "检查边界"]
  }
}));

const defaultDpCustomTopics = [
  {
    id: "dp-optimization",
    name: "DP 优化",
    description: "整理转移松弛、数据结构维护与复杂度优化等让 DP 真正可过的技巧。",
    parentId: "dp",
    group: "custom",
    color: "#536f94",
    article: {
      title: "从朴素转移到可通过的 DP",
      body: ["从原始状态和转移出发，识别重复计算、无效枚举与可维护的最优信息，再选择前缀和、单调结构或数据结构完成优化。"],
      outline: ["写出朴素转移", "定位复杂度瓶颈", "选择可证明的优化结构"]
    }
  },
  {
    id: "dp-cht",
    name: "斜率优化（Convex Hull Trick）",
    description: "把形如直线最值查询的转移改写为斜率优化，用凸包维护候选决策。",
    parentId: "dp",
    group: "custom",
    color: "#2f7d83",
    article: {
      title: "Convex Hull Trick：把转移写成直线查询",
      body: ["先将决策变量与当前状态变量分离，把转移整理成斜率和截距明确的直线最值查询，再根据插入、查询顺序选择单调队列凸包或动态凸包。"],
      outline: ["拆分决策项与查询项", "判断斜率和查询是否单调", "处理相等斜率与精度边界"]
    }
  },
  {
    id: "dp-monotonic-optimization",
    name: "单调队列/单调栈优化",
    description: "用单调队列或单调栈维护仍可能成为最优决策的候选状态。",
    parentId: "dp",
    group: "custom",
    color: "#3f7280",
    article: {
      title: "单调结构优化：只保留有用的候选状态",
      body: ["先写出需要查询的极值范围，再判断过期顺序和支配关系是否单调，据此选择单调队列或单调栈维护候选。"],
      outline: ["识别极值查询", "确定候选淘汰条件", "检查相等元素与边界"]
    }
  },
  {
    id: "dp-slope-trick",
    name: "Slope Trick优化",
    description: "维护分段线性凸函数的斜率变化，用堆或闵可夫斯基和合并代价函数。",
    parentId: "dp",
    group: "custom",
    color: "#826842",
    article: {
      title: "Slope Trick：维护凸代价函数",
      body: ["把状态看作分段线性凸函数，记录斜率发生变化的位置，并利用平移、加绝对值或闵可夫斯基和完成转移。"],
      outline: ["识别凸代价函数", "记录斜率断点", "实现函数合并与平移"]
    }
  },
  {
    id: "dp-decision-monotonicity",
    name: "决策单调性",
    description: "证明最优决策点随状态单调移动，再用分治或单调队列缩小转移范围。",
    parentId: "dp",
    group: "custom",
    color: "#8a6a3f",
    article: {
      title: "决策单调性：从结构证明到分治优化",
      body: ["先明确每个状态的最优决策点，验证代价函数是否满足四边形不等式、Monge 性质或题目特有的交换性质，再据此限制每段搜索区间。"],
      outline: ["写出最优决策点", "证明决策边界单调", "实现分治并核对搜索区间"]
    }
  },
  {
    id: "dp-wrong-solutions",
    name: "错解不优",
    description: "记录错误思路、复杂度分析失误，以及看似可行但不能稳定通过的解法。",
    parentId: "dp",
    group: "custom",
    color: "#8b4f4f",
    article: {
      title: "复盘错解：找到推导中的断点",
      body: ["保留错误思路出现的原因、能通过哪些数据，以及反例或复杂度分析从哪里推翻了原方案。"],
      outline: ["复现原始思路", "定位正确性或复杂度问题", "总结可迁移的检查方法"]
    }
  }
];

function createDpProblem(id, kind, title, url, oj, problemId, difficulty, knowledge, techniques, note) {
  return { id: `dp-${id}`, title, url, oj, problemId, difficulty, knowledge, techniques, kind, note };
}

const reviewedDpProblems = [
  createDpProblem("n01", "training", "ARC170 C - Prefix Mex Sequence", "https://atcoder.jp/contests/arc170/tasks/arc170_c", "AtCoder", "ARC170 C", "困难", ["dp-linear"], ["计数 DP", "MEX", "状态压缩"], "围绕前缀 MEX 压缩必要信息，统计满足条件的序列方案。"),
  createDpProblem("n02", "classic", "ABC221 H - Count Multiset", "https://atcoder.jp/contests/abc221/tasks/abc221_h", "AtCoder", "ABC221 H", "困难", ["dp-linear"], ["整数拆分", "容斥", "差分优化"], "把多重集计数转成拆分数递推，再用容斥和差分整理转移。"),
  createDpProblem("n03", "training", "CF1913D - Array Collapse", "https://codeforces.com/contest/1913/problem/D", "Codeforces", "1913D", "困难", ["dp-linear"], ["单调栈", "计数 DP", "转移优化"], "用单调栈维护仍会影响答案的前驱，压缩计数 DP 的转移范围。"),
  createDpProblem("n04", "classic", "CF1860D - Balanced String", "https://codeforces.com/contest/1860/problem/D", "Codeforces", "1860D", "困难", ["dp-linear"], ["二维状态", "逆序对计数", "状态设计"], "按已放置字符数和逆序对贡献推进，是基础多维 DP 的完整范例。"),
  createDpProblem("n05", "training", "ABC299 F - Square Subsequence", "https://atcoder.jp/contests/abc299/tasks/abc299_f", "AtCoder", "ABC299 F", "困难", ["dp-linear"], ["子序列 DP", "序列自动机", "next 数组"], "借助 next 数组快速定位下一字符，统计两个相同子序列的构造方案。"),
  createDpProblem("n06", "training", "ECNA 2023 B - B Road Band", "https://codeforces.com/gym/104757/problem/B", "GYM", "104757B", "困难", ["dp-decision-monotonicity"], ["分段 DP", "决策单调性", "分治优化"], "将选点对应到连续分段，再用决策单调性优化分段转移。"),
  createDpProblem("n07", "training", "2022 ICPC 济南站 J - Skills", "https://codeforces.com/gym/104076/problem/J", "GYM", "104076J", "困难", ["dp-linear"], ["根号分治", "松弛", "复杂度优化"], "按状态规模分层处理松弛，优化技巧保留为标签而非独立分组。"),
  createDpProblem("n08", "training", "ARC164 D - 1D Coulomb", "https://atcoder.jp/contests/arc164/tasks/arc164_d", "AtCoder", "ARC164 D", "困难", ["dp-linear"], ["组合计数", "前缀状态", "括号结构"], "把全局约束改写为前缀状态，在逐位递推中完成组合计数。"),
  createDpProblem("n09", "training", "ABC279 G - At Most 2 Colors", "https://atcoder.jp/contests/abc279/tasks/abc279_g", "AtCoder", "ABC279 G", "困难", ["dp-linear"], ["计数 DP", "滑动窗口", "前缀和优化"], "维护最近颜色约束，用滑动窗口和前缀和加速计数转移。"),
  createDpProblem("n10", "training", "CF1739E - Cleaning Robot", "https://codeforces.com/contest/1739/problem/E", "Codeforces", "1739E", "困难", ["dp-linear"], ["局部状态", "分类讨论", "滚动 DP"], "用小规模局部状态覆盖所有清扫关系，重点检查转移是否完整。"),
  createDpProblem("n11", "classic", "CF1582F2 - Korney Korneevich and XOR", "https://codeforces.com/contest/1582/problem/F2", "Codeforces", "1582F2", "困难", ["dp-linear"], ["值域状态", "XOR", "可达性 DP"], "用值域上的最小末尾值表示可达 XOR，消除对子序列位置的显式记录。"),
  createDpProblem("n12", "training", "CF1542E2 - Abnormal Permutation Pairs", "https://codeforces.com/contest/1542/problem/E2", "Codeforces", "1542E2", "困难", ["dp-linear"], ["排列计数", "组合数学", "贡献 DP"], "围绕排列对的贡献设计计数状态，组合推导和递推结合紧密。"),
  createDpProblem("n13", "classic", "ABC134 F - Permutation Oddness", "https://atcoder.jp/contests/abc134/tasks/abc134_f", "AtCoder", "ABC134 F", "困难", ["dp-insertion"], ["排列 DP", "插入法", "贡献维护"], "逐个插入排列元素并维护距离贡献，是排列插入 DP 的标准范例。"),
  createDpProblem("n15", "training", "BAPC 2018 E - Entirely Unsorted Sequences", "https://codeforces.com/gym/102007/problem/E", "GYM", "102007E", "困难", ["dp-linear"], ["计数 DP", "首个非法位置", "多重集排列"], "枚举第一个破坏位置，用补集计数处理含重复元素的排列。"),
  createDpProblem("n16", "classic", "HDU4055 - Number String", "https://vjudge.net/problem/HDU-4055", "HDU", "4055", "中等", ["dp-insertion"], ["排列 DP", "插入法", "前缀和优化", "波浪排列"], "插入新最大值并按相对位置转移；与“置置置换”同构，只保留这一条主记录。"),
  createDpProblem("n18", "classic", "FZU2129 - 子序列个数", "https://vjudge.net/problem/FZU-2129", "其他", "FZU2129", "中等", ["dp-linear"], ["本质不同子序列", "last 数组", "去重计数"], "记录每个值上次出现位置，扣除重复贡献，是不同子序列计数的标准模型。"),
  createDpProblem("n19", "training", "CF1149B - Three Religions", "https://codeforces.com/contest/1149/problem/B", "Codeforces", "1149B", "困难", ["dp-linear"], ["多序列 DP", "在线子序列", "next 数组"], "动态维护三个串的组合状态，用 next 数组快速判断共同子序列。"),
  createDpProblem("n20", "classic", "CF1110D - Jongmah", "https://codeforces.com/contest/1110/problem/D", "Codeforces", "1110D", "困难", ["dp-linear"], ["局部计数", "滚动状态", "三元组选择"], "把跨值三元组限制在相邻值域内，用小状态滚动完成最优选择。"),
  createDpProblem("n21", "classic", "HDU4003 - Find Metal Mineral", "https://vjudge.net/problem/HDU-4003", "HDU", "4003", "困难", ["dp-tree", "dp-knapsack"], ["树形背包", "分组背包", "返回状态"], "区分是否返回父节点，在子树间做分组背包合并。"),
  createDpProblem("n22", "training", "CF1982E - Number of k-good subarrays", "https://codeforces.com/contest/1982/problem/E", "Codeforces", "1982E", "困难", ["dp-digit"], ["二进制数位 DP", "区间合并", "记忆化搜索"], "把二进制幂次区间的信息作为可合并状态，处理不同长度的数位块。"),
  createDpProblem("n23", "training", "CCPC Guangzhou 2022 M - XOR Sum", "https://codeforces.com/gym/104053/problem/M", "GYM", "104053M", "困难", ["dp-digit", "dp-knapsack"], ["数位背包", "二进制", "余数状态"], "同时记录卡上界数量和当前余数，是数位 DP 与背包状态的交叉模型。"),
  createDpProblem("n24", "training", "CF1734F - Zeros and Ones", "https://codeforces.com/contest/1734/problem/F", "Codeforces", "1734F", "困难", ["dp-carry-digit"], ["Thue-Morse", "进位", "数位递推"], "利用 Thue-Morse 的自相似性，把区间比较转成带进位的数位递推。"),
  createDpProblem("n25", "training", "CF1487F - Ones", "https://codeforces.com/contest/1487/problem/F", "Codeforces", "1487F", "困难", ["dp-carry-digit"], ["高位到低位", "借位", "延迟贡献"], "从高位向低位记录差值和仍会生效的全 1 前缀，处理借位影响。"),
  createDpProblem("n26", "training", "CF2021E2 - Digital Village (hard version)", "https://codeforces.com/contest/2021/problem/E2", "Codeforces", "2021E2", "困难", ["dp-tree", "dp-knapsack"], ["Kruskal 重构树", "树形背包", "闵可夫斯基和", "Slope Trick"], "在 Kruskal 重构树上合并凸代价函数，用闵可夫斯基和维护各选择数量的最优值。"),
  createDpProblem("n27", "training", "CF1868C - Travel Plan", "https://codeforces.com/contest/1868/problem/C", "Codeforces", "1868C", "困难", ["dp-tree"], ["完全二叉树", "组合计数", "记忆化"], "利用隐式完全二叉树的重复结构，记忆化统计路径贡献。"),
  createDpProblem("n28", "training", "HDU7401 - 流量监控", "https://vjudge.net/problem/HDU-7401", "HDU", "7401", "困难", ["dp-tree", "dp-knapsack"], ["树形背包", "匹配计数", "二维背包"], "在子树中统计未匹配节点，并用额外维度累计祖先链四元组贡献。"),
  createDpProblem("n29", "training", "CCPC Guangzhou 2022 I - Infection", "https://codeforces.com/gym/104053/problem/I", "GYM", "104053I", "困难", ["dp-tree", "dp-knapsack", "dp-probability"], ["树上概率 DP", "树形背包", "感染分布"], "在树上合并感染数量的概率分布，同时覆盖树形、背包和概率 DP。"),
  createDpProblem("n30", "training", "CF1695D2 - Tree Queries", "https://codeforces.com/contest/1695/problem/D2", "Codeforces", "1695D2", "困难", ["dp-tree"], ["树上状态", "结构分类", "叶子贡献"], "围绕树的分叉和叶子结构设计状态，训练树形问题的结构观察。"),
  createDpProblem("n31", "training", "HDU6540 - Neko and tree", "https://vjudge.net/problem/HDU-6540", "HDU", "6540", "困难", ["dp-tree"], ["树形 DP", "计数", "子树合并"], "在子树间合并计数状态，是正统的树上状态合并训练。"),
  createDpProblem("n32", "classic", "HDU6035 - Colorful Tree", "https://vjudge.net/problem/HDU-6035", "HDU", "6035", "困难", ["dp-tree"], ["颜色贡献", "补集计数", "树上路径"], "按颜色计算未经过该颜色的路径补集，再汇总所有路径贡献。"),
  createDpProblem("n33", "training", "2020 小米邀请赛决赛 J - Rikka with Book", "https://ac.nowcoder.com/acm/contest/9328/J", "牛客", "9328 J", "困难", ["dp-bitmask"], ["状态压缩 DP", "子集划分", "集合收益"], "预处理集合收益并枚举子集划分，完成小规模集合决策。"),
  createDpProblem("n34", "training", "CF1392G - Omkar and Pies", "https://codeforces.com/contest/1392/problem/G", "Codeforces", "1392G", "困难", ["dp-bitmask", "dp-subset"], ["置换状态", "滑动区间", "子集状态"], "用掩码描述短串置换结果，在超长操作序列上维护最优区间。"),
  createDpProblem("n35", "training", "CF1313D - Happy New Year", "https://codeforces.com/contest/1313/problem/D", "Codeforces", "1313D", "困难", ["dp-bitmask", "dp-subset"], ["扫描线", "超集转移", "局部轮廓"], "利用每点覆盖次数很小，把扫描线活跃区间压成局部掩码。"),
  createDpProblem("n36", "classic", "CF1215E - Marbles", "https://codeforces.com/contest/1215/problem/E", "Codeforces", "1215E", "困难", ["dp-bitmask", "dp-subset"], ["逆序对贡献", "颜色排列", "子集 DP"], "预处理颜色两两顺序代价，把颜色排列的阶乘枚举压成子集 DP。"),
  createDpProblem("n37", "classic", "ABC325 G - offence", "https://atcoder.jp/contests/abc325/tasks/abc325_g", "AtCoder", "ABC325 G", "中等", ["dp-interval"], ["字符串消除", "区间合并", "端点转移"], "按区间合并删除结果，是字符串消除类区间 DP 的清晰入门题。"),
  createDpProblem("n38", "training", "CF1870E - Another MEX Problem", "https://codeforces.com/contest/1870/problem/E", "Codeforces", "1870E", "困难", ["dp-bitmask", "dp-subset"], ["MEX", "集合状态", "子集转移"], "把可出现的 MEX 集合压成状态，处理多段选择带来的集合变化。"),
  createDpProblem("n39", "training", "CF1863F - Divide, XOR, and Conquer", "https://codeforces.com/contest/1863/problem/F", "Codeforces", "1863F", "困难", ["dp-interval"], ["XOR", "端点性质", "区间可达性"], "利用总 XOR 的最高位性质判断区间端点能否继续扩展。"),
  createDpProblem("n40", "classic", "HDU4283 - You Are the One", "https://vjudge.net/problem/HDU-4283", "HDU", "4283", "中等", ["dp-interval"], ["出栈顺序", "区间分割", "代价 DP"], "枚举首元素最终出现的位置，把左右部分拆成独立区间。"),
  createDpProblem("n41", "classic", "CF1312E - Array Shrinking", "https://codeforces.com/contest/1312/problem/E", "Codeforces", "1312E", "中等", ["dp-interval"], ["区间合并", "两阶段 DP", "最少分段"], "先判断区间能否缩成一个值，再求覆盖整个数组的最少可缩区间数。"),
  createDpProblem("n43", "classic", "POJ1390 - Blocks", "http://poj.org/problem?id=1390", "POJ", "1390", "困难", ["dp-interval"], ["附加维状态", "方块消除", "同色合并"], "用额外维记录右侧已连接的同色块数量，是消除类区间 DP 的代表状态。"),
  createDpProblem("n44", "training", "2020 Wannafly Winter Camp Day6 D - 递增递增", "https://ac.nowcoder.com/acm/problem/201932", "牛客", "NC201932", "困难", ["dp-interval"], ["填坑 DP", "组合计数", "非标准区间状态"], "围绕区间中的空位和递增约束设计填坑状态，适合作为非模板训练。"),
  createDpProblem("n45", "training", "CF1101F - Trucks and Cities", "https://codeforces.com/contest/1101/problem/F", "Codeforces", "1101F", "困难", ["dp-decision-monotonicity"], ["分段 DP", "分治优化", "二分答案"], "二分限制后做分段 DP，并利用决策单调性优化转移。"),
  createDpProblem("n46", "training", "CF1628D2 - Game on Sum", "https://codeforces.com/contest/1628/problem/D2", "Codeforces", "1628D2", "困难", ["dp-probability"], ["概率 DP", "逆向递推", "博弈过程"], "从终局逆推每一步的最优期望，状态小但概率转移很有启发性。"),
  createDpProblem("n47", "training", "CF1823F - Random Walk", "https://codeforces.com/contest/1823/problem/F", "Codeforces", "1823F", "困难", ["dp-probability", "dp-tree"], ["随机游走", "树上期望", "概率递推"], "在树上递推随机游走的访问期望，是概率与树形 DP 的交叉题。"),
  createDpProblem("n48", "training", "CF1753C - Wish I Knew How to Sort", "https://codeforces.com/contest/1753/problem/C", "Codeforces", "1753C", "困难", ["dp-probability"], ["随机交换", "错位数量", "状态降维"], "把整个 01 排列压成错位数量，递推随机交换达到有序的期望步数。"),
  createDpProblem("n50", "training", "CF1392H - ZS Shuffles Cards", "https://codeforces.com/contest/1392/problem/H", "Codeforces", "1392H", "困难", ["dp-probability"], ["随机过程", "期望贡献", "停止状态"], "拆分随机过程中的事件贡献，避免直接维护庞大排列状态。"),
  createDpProblem("n52", "training", "CF2021D - Boss, Thirsty", "https://codeforces.com/contest/2021/problem/D", "Codeforces", "2021D", "困难", ["dp-linear"], ["前后缀最值", "区间端点状态", "增量维护"], "拆分左右端点的四类转移，并用前后缀最值消去枚举。"),
  createDpProblem("n53", "training", "ARC115 E - LEQ and NEQ", "https://atcoder.jp/contests/arc115/tasks/arc115_e", "AtCoder", "ARC115 E", "困难", ["dp-linear"], ["容斥", "单调栈优化", "前缀和"], "从分段容斥 DP 出发，压缩奇偶维并用单调栈维护区间最小值贡献。"),
  createDpProblem("n55", "training", "CF1856E2 - PermuTree (hard version)", "https://codeforces.com/contest/1856/problem/E2", "Codeforces", "1856E2", "困难", ["dp-tree", "dp-knapsack"], ["树形背包", "bitset", "根号优化"], "按子树大小做背包划分，再用 bitset 和根号思想控制总复杂度。"),
  createDpProblem("n56", "classic", "ABC288 F - Integer Division", "https://atcoder.jp/contests/abc288/tasks/abc288_f", "AtCoder", "ABC288 F", "中等", ["dp-linear"], ["划分 DP", "贡献拆分", "前缀和优化"], "把最后一段数字拆成可递推贡献，将朴素二次转移降到线性。"),
  createDpProblem("n57", "training", "力扣天池 04 - 意外惊喜", "https://leetcode.cn/contest/tianchi2022/problems/tRZfIV/", "LeetCode", "天池 04", "困难", ["dp-knapsack"], ["背包 DP", "分治优化", "构造"], "用分治组织物品范围，减少重复背包计算并恢复需要的选择。"),
  createDpProblem("n58", "training", "CF1453F - Even Harder", "https://codeforces.com/contest/1453/problem/F", "Codeforces", "1453F", "困难", ["dp-linear"], ["路径唯一性", "后缀最小值", "状态推导"], "记录路径最后两个节点，并用后缀最小值维护合法前驱。"),
  createDpProblem("n59", "training", "2019 牛客多校 10 J - Wood Processing", "https://ac.nowcoder.com/acm/contest/890/J", "牛客", "890 J", "困难", ["dp-cht"], ["分组 DP", "斜率优化", "凸包"], "排序后做连续分组，用斜率优化维护每层分组转移。"),
  createDpProblem("n60", "classic", "CF868F - Yet Another Minimization Problem", "https://codeforces.com/contest/868/problem/F", "Codeforces", "868F", "困难", ["dp-decision-monotonicity"], ["分段 DP", "分治优化", "双指针维护代价"], "分治求每层最优决策，同时用双指针增删维护区间相等对数。"),
  createDpProblem("n61", "classic", "ICPC Kunming 2021 C - Cities", "https://ac.nowcoder.com/acm/contest/12548/C", "牛客", "12548 C", "困难", ["dp-interval"], ["区间 DP", "分割", "端点决策"], "围绕区间端点和最后一次分割组织转移，具有明确的区间模型。"),
  createDpProblem("n62", "training", "Nowcoder 91849 D - String Circle", "https://ac.nowcoder.com/acm/contest/91849/D", "牛客", "91849 D", "困难", ["dp-linear"], ["计数 DP", "KMP", "循环移位", "字符串周期"], "先识别每个串的合法旋转偏移，再统计非降切点序列。"),
  createDpProblem("n63", "training", "CF2109E - Binary String Wowee", "https://codeforces.com/contest/2109/problem/E", "Codeforces", "2109E", "困难", ["dp-linear"], ["组合数学", "二进制串", "计数 DP"], "拆分二进制串中的组合贡献，用递推累计合法方案。"),
  createDpProblem("n64", "classic", "CF659G - Fence Divercity", "https://codeforces.com/contest/659/problem/G", "Codeforces", "659G", "困难", ["dp-linear"], ["矩形计数", "前缀贡献", "滚动 DP"], "逐列维护以当前列结尾的连通矩形贡献，是简洁的线性计数 DP。"),
  createDpProblem("n65", "training", "CF2038D - Divide OR Conquer", "https://codeforces.com/contest/2038/problem/D", "Codeforces", "2038D", "困难", ["dp-out-of-order"], ["乱序 DP", "二维偏序", "遍历顺序"], "依据二维偏序安排状态遍历顺序，让依赖关系在乱序处理中仍保持可转移。"),
  createDpProblem("n66", "training", "CF938F - Erasing Substrings", "https://codeforces.com/contest/938/problem/F", "Codeforces", "938F", "困难", ["dp-bitmask"], ["贪心", "状压 DP", "字符串删除"], "先用贪心性质限制仍需记忆的字符集合，再进行状态压缩转移。"),
  createDpProblem("n67", "training", "CF1946F - Nobody is needed", "https://codeforces.com/contest/1946/problem/F", "Codeforces", "1946F", "困难", ["dp-linear"], ["离线", "刷表法", "Fenwick"], "将转移改成向未来状态刷表，并离线维护满足条件的贡献。"),
  createDpProblem("n68", "training", "CF2237F - Paint the Array", "https://codeforces.com/contest/2237/problem/F", "Codeforces", "2237F", "困难", ["dp-linear"], ["数组染色", "状态压缩", "分类转移"], "围绕相邻染色关系压缩局部状态，按位置推进最优方案。"),
  createDpProblem("n69", "training", "CF1832E - Combinatorics Problem", "https://codeforces.com/contest/1832/problem/E", "Codeforces", "1832E", "困难", ["dp-linear"], ["组合数递推", "多阶前缀和", "贡献计算"], "把组合恒等式转成多阶前缀和递推，在线性扫描中计算全部贡献。"),
  createDpProblem("n70", "classic", "P5999 [CEOI 2016] kangaroo", "https://www.luogu.com.cn/problem/P5999", "洛谷", "P5999", "困难", ["dp-insertion"], ["排列 DP", "插入法", "相邻关系"], "逐个插入数值并维护尚未闭合的相邻关系，与其他排列插入题形成完整链路。"),
  createDpProblem("n71", "training", "CF2122E - Greedy Grid Counting", "https://codeforces.com/contest/2122/problem/E", "Codeforces", "2122E", "困难", ["dp-linear"], ["网格计数", "组合递推", "状态设计"], "把网格上的贪心过程抽象成可计数状态，逐阶段累积方案。"),
  createDpProblem("n72", "training", "P3447 [POI 2006] KRY-Crystals", "https://www.luogu.com.cn/problem/P3447", "洛谷", "P3447", "困难", ["dp-digit"], ["数位 DP", "进制表示", "计数"], "按数位刻画晶体编号的结构约束，统计给定范围内的合法对象。"),
  createDpProblem("n73", "classic", "CF1715E - Long Way Home", "https://codeforces.com/contest/1715/problem/E", "Codeforces", "1715E", "困难", ["dp-cht"], ["最短路分层", "斜率优化", "CHT"], "在每轮额外操作之间跑最短路，并用凸包优化跨点转移。"),
  createDpProblem("n75", "classic", "ABC391 G - Many LCS", "https://atcoder.jp/contests/abc391/tasks/abc391_g", "AtCoder", "ABC391 G", "困难", ["dp-bitmask"], ["LCS 数组", "差分掩码", "自动机式转移"], "把一整行 LCS 的相邻差分压成掩码，在追加字符时做有限状态转移。"),
  createDpProblem("n76", "training", "CF2039E - Shohag Loves Inversions", "https://codeforces.com/contest/2039/problem/E", "Codeforces", "2039E", "困难", ["dp-linear"], ["组合数学", "逆序对计数", "递推"], "按新增元素对逆序对的贡献建立组合递推。"),
  createDpProblem("n77", "classic", "ABC231 G - Balls in Boxes", "https://atcoder.jp/contests/abc231/tasks/abc231_g", "AtCoder", "ABC231 G", "困难", ["dp-probability"], ["盒子模型", "组合期望", "概率 DP"], "围绕随机投球后的盒子占用状态计算期望，是标准概率 DP 模型。"),
  createDpProblem("n79", "training", "HDU6289 - 寻宝游戏", "https://vjudge.net/problem/HDU-6289", "HDU", "6289", "困难", ["dp-linear", "dp-knapsack"], ["网格 DP", "换入换出", "消除后效性", "背包倒序"], "分别记录换出和换入数量，使全局交换限制能在网格路径上局部转移。"),
  createDpProblem("n80", "training", "CCPC Xiamen 2019 J - Zayin and Tree", "https://qoj.ac/problem/9110", "QOJ", "9110", "困难", ["dp-wrong-solutions", "dp-tree"], ["松弛", "错误复杂度分析", "错解改进", "树形 DP"], "复盘能通过但复杂度不优的松弛写法，并对照更稳健的树上 DP 改进。"),
  createDpProblem("n81", "training", "CCPC Liaoning 2024 H - 划分数字", "https://codeforces.com/gym/105481/problem/H", "GYM", "105481H", "困难", ["dp-digit"], ["数位 DP", "数字划分", "计数"], "只收整篇补题中的 H，按数位状态统计数字划分方案。"),
  createDpProblem("n82", "classic", "CF1778D - Flexible String Revisit", "https://codeforces.com/contest/1778/problem/D", "Codeforces", "1778D", "困难", ["dp-probability"], ["期望 DP", "距离状态", "手动高斯消元"], "递推式形成线性方程组，利用相邻状态关系手动消元求期望。")
];

const defaultDpProblems = [
  {
    id: "dp-c01-abc275-f",
    title: "ABC275 F - Erase Subarrays",
    url: "https://atcoder.jp/contests/abc275/tasks/abc275_f",
    oj: "AtCoder",
    problemId: "ABC275 F",
    difficulty: "困难",
    knowledge: ["dp-linear"],
    techniques: ["分段状态", "前缀和", "最少操作"],
    kind: "classic",
    note: "把保留元素改写成分段状态，按目标和推进最少删除段数。"
  },
  {
    id: "dp-c09-abc160-f",
    title: "ABC160 F - Distributing Integers",
    url: "https://atcoder.jp/contests/abc160/tasks/abc160_f",
    oj: "AtCoder",
    problemId: "ABC160 F",
    difficulty: "困难",
    knowledge: ["dp-tree"],
    techniques: ["换根 DP", "组合计数", "子树合并"],
    kind: "classic",
    note: "树形组合计数配合换根，在线性时间内求出所有根的答案。"
  },
  {
    id: "dp-classic-gym102832-j",
    title: "2020 CCPC 长春站 J - Abstract Painting",
    url: "https://codeforces.com/gym/102832/problem/J",
    oj: "GYM",
    problemId: "102832J",
    difficulty: "困难",
    knowledge: ["dp-interval", "dp-bitmask"],
    techniques: ["区间 DP", "状态压缩 DP", "不交区间", "组合计数"],
    kind: "classic",
    note: "把圆映射为横轴上的区间；利用半径至多为 5 的局部性，可按区间分割递推，也可压缩最近端点的可用状态。"
  },
  {
    id: "dp-classic-qoj12409-l",
    title: "2020 ICPC 济南站 L - Bit Sequence",
    url: "https://qoj.ac/problem/12409",
    oj: "QOJ",
    problemId: "12409",
    difficulty: "困难",
    knowledge: ["dp-carry-digit"],
    techniques: ["二进制数位 DP", "低位枚举", "进位分类", "奇偶性"],
    kind: "classic",
    note: "枚举 x 的低 7 位，再用数位 DP 统计高位 1 的奇偶与连续 1 状态，分类处理 x+i 产生的进位。"
  },
  {
    id: "dp-t01-abc345-e",
    title: "ABC345 E - Colorful Subsequence",
    url: "https://atcoder.jp/contests/abc345/tasks/abc345_e",
    oj: "AtCoder",
    problemId: "ABC345 E",
    difficulty: "困难",
    knowledge: ["dp-linear", "dp-optimization"],
    techniques: ["最优与次优", "滚动 DP", "状态降维"],
    kind: "training",
    note: "每个删除次数只保留颜色不同的前两优值，避免状态按颜色扩张。"
  },
  {
    id: "dp-t02-abc227-e",
    title: "ABC227 E - Swap",
    url: "https://atcoder.jp/contests/abc227/tasks/abc227_e",
    oj: "AtCoder",
    problemId: "ABC227 E",
    difficulty: "困难",
    knowledge: ["dp-linear"],
    techniques: ["多维 DP", "逆序对计数", "字符计数"],
    kind: "training",
    note: "记录已放置字符数量与交换代价，在有限预算内统计可达排列。"
  },
  {
    id: "dp-t03-p1758",
    title: "P1758 [NOI2009] 管道取珠",
    url: "https://www.luogu.com.cn/problem/P1758",
    oj: "洛谷",
    problemId: "P1758",
    difficulty: "困难",
    knowledge: ["dp-linear"],
    techniques: ["序列交错", "平方贡献", "滚动数组"],
    kind: "training",
    note: "将两次取珠过程并行建模，用四维状态累计相同结果的平方贡献。"
  },
  {
    id: "dp-t04-hdu6092",
    title: "HDU 6092 - Rikka with Subset",
    url: "https://vjudge.net/problem/HDU-6092",
    oj: "HDU",
    problemId: "6092",
    difficulty: "中等",
    knowledge: ["dp-knapsack"],
    techniques: ["逆向背包", "子集和计数", "字典序构造"],
    kind: "training",
    note: "从子集和计数反推原多重集，利用背包转移逐项消去贡献。"
  },
  {
    id: "dp-t05-nowcoder-81605-d",
    title: "2024 牛客暑期多校训练营 10 D - Is it rated?",
    url: "https://ac.nowcoder.com/acm/contest/81605/D",
    oj: "牛客",
    problemId: "81605 D",
    difficulty: "困难",
    knowledge: ["dp-knapsack"],
    techniques: ["截断误差", "后缀 DP", "选择优化"],
    kind: "training",
    note: "只保留仍会影响精度的后缀，在跳过次数维度做选择 DP。"
  },
  {
    id: "dp-t06-cf1336-c",
    title: "CF1336C - Kaavi and Magic Spell",
    url: "https://codeforces.com/contest/1336/problem/C",
    oj: "Codeforces",
    problemId: "1336C",
    difficulty: "困难",
    knowledge: ["dp-interval"],
    techniques: ["区间构造", "端点转移", "字符串 DP"],
    kind: "training",
    note: "把字符从两端加入目标区间，以区间端点状态统计构造方案。"
  },
  {
    id: "dp-t07-abc340-g",
    title: "ABC340 G - Leaf Color",
    url: "https://atcoder.jp/contests/abc340/tasks/abc340_g",
    oj: "AtCoder",
    problemId: "ABC340 G",
    difficulty: "困难",
    knowledge: ["dp-tree"],
    techniques: ["树上计数", "贡献合并", "同色约束"],
    kind: "training",
    note: "围绕子树内同色叶子的贡献设计状态合并与重复计数修正。"
  },
  {
    id: "dp-t08-gym104076-c",
    title: "2022 ICPC 济南站 C - DFS Order 2",
    url: "https://codeforces.com/problemset/gymProblem/104076/C",
    oj: "GYM",
    problemId: "104076C",
    difficulty: "困难",
    knowledge: ["dp-tree", "dp-knapsack"],
    techniques: ["树形背包", "可撤销背包", "组合计数"],
    kind: "training",
    note: "树上每个节点做可撤销背包，统计目标儿子位于不同 DFS 次序位置的方案。"
  },
  {
    id: "dp-t09-abc283-e",
    title: "ABC283 E - Don't Isolate Elements",
    url: "https://atcoder.jp/contests/abc283/tasks/abc283_e",
    oj: "AtCoder",
    problemId: "ABC283 E",
    difficulty: "中等",
    knowledge: ["dp-bitmask"],
    techniques: ["轮廓状态", "逐行转移", "行翻转"],
    kind: "training",
    note: "只记录相邻三行的翻转状态，逐行保证中间行不出现孤立元素。"
  },
  {
    id: "dp-t10-cf11-d",
    title: "CF11D - A Simple Task",
    url: "https://codeforces.com/contest/11/problem/D",
    oj: "Codeforces",
    problemId: "11D",
    difficulty: "困难",
    knowledge: ["dp-bitmask"],
    techniques: ["子集状态", "最小点去重", "简单环计数"],
    kind: "training",
    note: "固定环上最小编号后做状态压缩 DP，避免同一无向简单环重复计数。"
  },
  {
    id: "dp-t11-cf1209-e2",
    title: "CF1209E2 - Rotate Columns (hard version)",
    url: "https://codeforces.com/contest/1209/problem/E2",
    oj: "Codeforces",
    problemId: "1209E2",
    difficulty: "困难",
    knowledge: ["dp-bitmask", "dp-subset"],
    techniques: ["子集 DP", "列旋转预处理", "子集划分"],
    kind: "training",
    note: "对每列预处理旋转后的子集最优值，再用子集划分 DP 合并列。"
  },
  {
    id: "dp-t12-arc100-e",
    title: "ARC100 E - Or Plus Max",
    url: "https://atcoder.jp/contests/arc100/tasks/arc100_c",
    oj: "AtCoder",
    problemId: "ARC100 E",
    difficulty: "困难",
    knowledge: ["dp-bitmask", "dp-sos"],
    techniques: ["SOS DP", "高维前缀和", "子集 Top-2"],
    kind: "training",
    note: "对子集维护最大两项并做 SOS 转移，最后取前缀最大答案。"
  },
  {
    id: "dp-bitmask-jisuanke-42577",
    title: "2019 ICPC 南昌区域赛 B - A Funny Bipartite Graph",
    url: "https://vjudge.net/problem/%E8%AE%A1%E8%92%9C%E5%AE%A2-42577",
    oj: "计蒜客",
    problemId: "42577",
    difficulty: "困难",
    knowledge: ["dp-bitmask"],
    techniques: ["二分图覆盖", "子集状态", "结构优化"],
    kind: "training",
    note: "利用左点只连接编号不小于自身的右点，以及选定左点集后的前缀覆盖性质，将搜索压成 O(n·2^n) 的状态压缩 DP。"
  },
  {
    id: "dp-wrong-gym104022-b",
    title: "2020 ICPC 银川站 B - The Great Wall",
    url: "https://codeforces.com/gym/104022/problem/B",
    oj: "GYM",
    problemId: "104022B",
    difficulty: "困难",
    knowledge: ["dp-linear", "dp-wrong-solutions"],
    techniques: ["极差分解", "状态正确性", "复杂度核验", "小数据对拍"],
    kind: "training",
    note: "把每段极差拆成正负贡献后，朴素状态很容易漏掉合法顺序或误判复杂度；保留为错解复盘与对拍验证训练。"
  },
  {
    id: "dp-optimization-gym102801-k",
    title: "2020 ICPC 东北赛 K - PepperLa's Boast",
    url: "https://codeforces.com/gym/102801/problem/K",
    oj: "GYM",
    problemId: "102801K",
    difficulty: "困难",
    knowledge: ["dp-optimization"],
    techniques: ["二维单调队列", "滑动窗口最值", "网格 DP"],
    kind: "classic",
    note: "把二维窗口转移拆成行列两级单调队列，在线维护 k×k 范围内的最优状态，是二维单调队列优化 DP 的代表题。"
  },
  {
    id: "dp-subset-nowcoder9328-g",
    title: "2020 ICPC 小米邀请赛决赛 G - Rikka with Game Theory",
    url: "https://ac.nowcoder.com/acm/contest/9328/G",
    oj: "牛客",
    problemId: "9328 G",
    difficulty: "困难",
    knowledge: ["dp-subset"],
    techniques: ["状态降维", "分层构造", "无后效性", "MEX"],
    kind: "classic",
    note: "只记录已经放入若干层的点集；新的一层可以直接叠在其后，层数本身不影响后续合法转移，因此无需额外开一维记录当前层数。"
  },
  ...reviewedDpProblems
].filter((problem) => !REMOVED_PROBLEM_IDS.has(problem.id));

const dpProblemRatings = [
  ["dp-c01-abc275-f", 1608, "AtCoder Problems"],
  ["dp-c09-abc160-f", 2048, "AtCoder Problems"],
  ["dp-t01-abc345-e", 2356, "AtCoder Problems"],
  ["dp-t02-abc227-e", 2377, "AtCoder Problems"],
  ["dp-t03-p1758", 6, "洛谷", "省选/NOI−"],
  ["dp-t06-cf1336-c", 2200, "Codeforces"],
  ["dp-t07-abc340-g", 2401, "AtCoder Problems"],
  ["dp-t09-abc283-e", 1802, "AtCoder Problems"],
  ["dp-t10-cf11-d", 2200, "Codeforces"],
  ["dp-t11-cf1209-e2", 2500, "Codeforces"],
  ["dp-t12-arc100-e", 2111, "AtCoder Problems"],
  ["dp-n01", 2028, "AtCoder Problems"],
  ["dp-n02", 2793, "AtCoder Problems"],
  ["dp-n03", 2100, "Codeforces"],
  ["dp-n04", 2200, "Codeforces"],
  ["dp-n05", 2349, "AtCoder Problems"],
  ["dp-n08", 1963, "AtCoder Problems"],
  ["dp-n09", 2431, "AtCoder Problems"],
  ["dp-n10", 2400, "Codeforces"],
  ["dp-n11", 2400, "Codeforces"],
  ["dp-n12", 2700, "Codeforces"],
  ["dp-n13", 2532, "AtCoder Problems"],
  ["dp-n19", 2200, "Codeforces"],
  ["dp-n20", 2200, "Codeforces"],
  ["dp-n22", 2300, "Codeforces"],
  ["dp-n24", 2500, "Codeforces"],
  ["dp-n25", 2900, "Codeforces"],
  ["dp-n27", 2400, "Codeforces"],
  ["dp-n30", 2300, "Codeforces"],
  ["dp-n34", 2900, "Codeforces"],
  ["dp-n35", 2500, "Codeforces"],
  ["dp-n36", 2200, "Codeforces"],
  ["dp-n37", 2388, "AtCoder Problems"],
  ["dp-n38", 2300, "Codeforces"],
  ["dp-n39", 2600, "Codeforces"],
  ["dp-n41", 2100, "Codeforces"],
  ["dp-n45", 2400, "Codeforces"],
  ["dp-n46", 2400, "Codeforces"],
  ["dp-n47", 2600, "Codeforces"],
  ["dp-n48", 2000, "Codeforces"],
  ["dp-n50", 3000, "Codeforces"],
  ["dp-n52", 2500, "Codeforces"],
  ["dp-n53", 2363, "AtCoder Problems"],
  ["dp-n55", 2700, "Codeforces"],
  ["dp-n56", 2024, "AtCoder Problems"],
  ["dp-n58", 2700, "Codeforces"],
  ["dp-n60", 2500, "Codeforces"],
  ["dp-n63", 2400, "Codeforces"],
  ["dp-n64", 2300, "Codeforces"],
  ["dp-n65", 2400, "Codeforces"],
  ["dp-n66", 2700, "Codeforces"],
  ["dp-n67", 2500, "Codeforces"],
  ["dp-n68", 2400, "Codeforces"],
  ["dp-n69", 2200, "Codeforces"],
  ["dp-n70", 6, "洛谷", "省选/NOI−"],
  ["dp-n71", 2600, "Codeforces"],
  ["dp-n72", 7, "洛谷", "NOI/NOI+/CTSC"],
  ["dp-n73", 2400, "Codeforces"],
  ["dp-n75", 2247, "AtCoder Problems"],
  ["dp-n76", 2200, "Codeforces"],
  ["dp-n77", 2606, "AtCoder Problems"],
  ["dp-n82", 2100, "Codeforces"]
];

function difficultyFromRating(rating, source) {
  if (source === "Codeforces") return rating < 2000 ? "简单" : rating <= 2400 ? "中等" : "困难";
  if (source === "AtCoder Problems") return rating < 2000 ? "简单" : rating <= 2400 ? "中等" : "困难";
  if (source === "洛谷") return rating <= 2 ? "简单" : rating <= 4 ? "中等" : "困难";
  return null;
}

for (const [id, rating, ratingSource, ratingLabel] of dpProblemRatings) {
  const problem = defaultDpProblems.find((item) => item.id === id);
  if (!problem) continue;
  problem.rating = rating;
  problem.ratingSource = ratingSource;
  problem.ratingLabel = ratingLabel || "";
  problem.difficulty = difficultyFromRating(rating, ratingSource) || problem.difficulty;
}

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
    ...defaultDpSubtopics,
    ...defaultDpCustomTopics
  ],
  problems: structuredClone(defaultDpProblems),
  contests: []
};

const ojStyles = {
  洛谷: { short: "LG", color: "#b54234", bg: "#fae9e3" },
  Codeforces: { short: "CF", color: "#3865a8", bg: "#e8edf6" },
  AtCoder: { short: "AT", color: "#4e5651", bg: "#eceeeb" },
  LeetCode: { short: "LC", color: "#9a670e", bg: "#f8efd7" },
  HDU: { short: "HD", color: "#3973a8", bg: "#e8f0f7" },
  计蒜客: { short: "JS", color: "#8a5a2f", bg: "#f5eadf" },
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
  classicDifficulty: "全部",
  trainingDifficulty: "全部",
  modalType: null,
  editingId: null,
  modalContext: {},
  expandedTopics: new Set(["dp"]),
  lessonExpanded: false,
  revealedRatingId: null
};

const cloud = {
  enabled: false,
  client: null,
  user: null,
  isAdmin: false,
  submissions: [],
  version: 0,
  updatedAt: null,
  status: "unconfigured",
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
  sidebarAddButton: document.querySelector("#sidebarAddButton"),
  modalLayer: document.querySelector("#modalLayer"),
  modalTitle: document.querySelector("#modalTitle"),
  modalEyebrow: document.querySelector("#modalEyebrow"),
  formFields: document.querySelector("#formFields"),
  entryForm: document.querySelector("#entryForm"),
  modalFooter: document.querySelector("#modalFooter"),
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

function normalizedCatalogName(value = "") {
  return String(value).trim().toLowerCase().replace(/[\s（）()_-]+/g, "");
}

function normalizedProblemUrl(value = "") {
  try {
    const url = new URL(String(value).trim());
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const path = url.pathname.replace(/\/+$/, "").toLowerCase();
    const codeforcesProblem = path.match(/^\/(?:contest|problemset\/problem)\/(\d+)\/(?:problem\/)?([^/]+)$/);
    if (host === "codeforces.com" && codeforcesProblem) {
      return `codeforces:${codeforcesProblem[1]}:${codeforcesProblem[2]}`;
    }
    const codeforcesGym = path.match(/^\/(?:gym\/(\d+)\/problem|problemset\/gymproblem\/(\d+))\/([^/]+)$/);
    if (host === "codeforces.com" && codeforcesGym) {
      return `codeforces-gym:${codeforcesGym[1] || codeforcesGym[2]}:${codeforcesGym[3]}`;
    }
    const atcoderProblem = path.match(/^\/contests\/([^/]+)\/tasks\/([^/]+)$/);
    if (host === "atcoder.jp" && atcoderProblem) return `atcoder:${atcoderProblem[2]}`;
    const nowcoderProblem = path.match(/^\/acm\/(contest\/[^/]+\/[^/]+|problem\/[^/]+)$/);
    if (host === "ac.nowcoder.com" && nowcoderProblem) return `nowcoder:${nowcoderProblem[1]}`;
    if (host === "acm.hdu.edu.cn" && url.searchParams.get("pid")) return `hdu:${url.searchParams.get("pid")}`;
    const luoguProblem = path.match(/^\/problem\/([^/]+)$/);
    if (host === "luogu.com.cn" && luoguProblem) return `luogu:${luoguProblem[1]}`;
    const qojProblem = path.match(/^\/problem\/(\d+)$/);
    if (host === "qoj.ac" && qojProblem) return `qoj:${qojProblem[1]}`;
    url.hash = "";
    url.searchParams.sort();
    return `${host}${path}${url.search}`;
  } catch {
    return String(value).trim().toLowerCase().replace(/\/+$/, "");
  }
}

function normalizedProblemSource(problem) {
  const oj = normalizedCatalogName(problem.oj);
  let problemId = normalizedCatalogName(problem.problemId);
  if (oj === "codeforces") problemId = problemId.replace(/^cf/, "");
  return oj && problemId ? `${oj}:${problemId}` : "";
}

function mergeProblemRecord(target, incoming) {
  target.knowledge = [...new Set([...(target.knowledge || []), ...(incoming.knowledge || [])])];
  target.techniques = [...new Set([...(target.techniques || []), ...(incoming.techniques || [])])];
  const solutionKeys = new Set((target.solutions || []).map((solution) => solution.submissionId || normalizedProblemUrl(solution.url)));
  target.solutions = [...(target.solutions || [])];
  for (const solution of incoming.solutions || []) {
    const key = solution.submissionId || normalizedProblemUrl(solution.url);
    if (key && solutionKeys.has(key)) continue;
    target.solutions.push(solution);
    if (key) solutionKeys.add(key);
  }
  for (const field of ["title", "url", "oj", "problemId", "difficulty", "kind", "note", "rating", "ratingLabel", "ratingSource"]) {
    if ((target[field] === undefined || target[field] === null || target[field] === "") && incoming[field] !== undefined) {
      target[field] = incoming[field];
    }
  }
  if (/blog\.csdn\.net|zhuanlan\.zhihu\.com/.test(String(target.url || ""))) target.url = incoming.url || target.url;
}

function mergeDuplicateProblems(problems) {
  const merged = [];
  const identities = new Map();
  for (const problem of problems) {
    const keys = [
      problem.id ? `id:${problem.id}` : "",
      problem.url ? `url:${normalizedProblemUrl(problem.url)}` : "",
      normalizedProblemSource(problem) ? `source:${normalizedProblemSource(problem)}` : ""
    ].filter(Boolean);
    const existing = keys.map((key) => identities.get(key)).find(Boolean);
    if (existing) {
      const notes = [existing.note, problem.note].map((note) => String(note || "").trim()).filter(Boolean);
      mergeProblemRecord(existing, problem);
      if (notes.length === 2 && notes[0] !== notes[1]) existing.note = [...new Set(notes)].join("；");
      for (const key of keys) identities.set(key, existing);
      continue;
    }
    merged.push(problem);
    for (const key of keys) identities.set(key, problem);
  }
  return merged;
}

function migrateCatalog(data) {
  const migrated = structuredClone(data);
  migrated.problems = Array.isArray(migrated.problems)
    ? migrated.problems.filter((problem) => (
      !PRESET_PROBLEM_IDS.has(problem.id)
      && !REMOVED_PROBLEM_IDS.has(problem.id)
      && !REMOVED_PROBLEM_SOURCES.has(normalizedProblemSource(problem))
    ))
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
  migrated.problems = migrated.problems.map((problem) => ({
    ...problem,
    knowledge: Array.isArray(problem.knowledge) ? problem.knowledge : [],
    techniques: Array.isArray(problem.techniques) ? problem.techniques : [],
    solutions: Array.isArray(problem.solutions) ? problem.solutions : []
  }));

  const topicIdAliases = new Map();
  for (const defaultTopic of [...defaultDpSubtopics, ...defaultDpCustomTopics]) {
    const expectedParentId = topicIdAliases.get(defaultTopic.parentId) || defaultTopic.parentId;
    const existing = migrated.topics.find((topic) => (
      topic.id === defaultTopic.id
      || (topic.parentId === expectedParentId && normalizedCatalogName(topic.name) === normalizedCatalogName(defaultTopic.name))
    ));
    if (!existing) {
      const added = structuredClone(defaultTopic);
      added.parentId = expectedParentId;
      migrated.topics.push(added);
      topicIdAliases.set(defaultTopic.id, added.id);
      continue;
    }
    topicIdAliases.set(defaultTopic.id, existing.id);
    existing.parentId = expectedParentId;
    existing.group = defaultTopic.group;
    if (["dp-cht", "dp-slope-trick"].includes(defaultTopic.id)) existing.name = defaultTopic.name;
    existing.description ||= defaultTopic.description;
    existing.color ||= defaultTopic.color;
    existing.article ||= structuredClone(defaultTopic.article);
  }

  const topicsById = new Map(migrated.topics.map((topic) => [topic.id, topic]));
  for (const topic of migrated.topics) {
    if (!topic.parentId) continue;
    let parent = topicsById.get(topic.parentId);
    const seen = new Set([topic.id]);
    while (parent?.parentId && !seen.has(parent.id)) {
      seen.add(parent.id);
      parent = topicsById.get(parent.parentId);
    }
    if (parent) topic.parentId = parent.id;
  }

  migrated.problems = mergeDuplicateProblems(migrated.problems);
  for (const defaultProblem of defaultDpProblems) {
    const candidate = structuredClone(defaultProblem);
    candidate.knowledge = candidate.knowledge.map((id) => topicIdAliases.get(id) || id);
    const normalizedUrl = normalizedProblemUrl(candidate.url);
    const normalizedSource = normalizedProblemSource(candidate);
    const existing = migrated.problems.find((problem) => (
      problem.id === candidate.id
      || normalizedProblemUrl(problem.url) === normalizedUrl
      || (normalizedSource && normalizedProblemSource(problem) === normalizedSource)
    ));
    if (!existing) migrated.problems.push(candidate);
    else {
      mergeProblemRecord(existing, candidate);
      if (candidate.rating !== undefined) {
        existing.rating = candidate.rating;
        existing.ratingSource = candidate.ratingSource;
        existing.ratingLabel = candidate.ratingLabel || "";
        existing.difficulty = candidate.difficulty;
      }
    }
  }
  migrated.problems = mergeDuplicateProblems(migrated.problems);

  const topicAssignments = [
    [["dp-n13", "dp-n16", "dp-n70"], ["dp-linear", "dp-counting", "dp-insertion"]],
    [["dp-n65"], ["dp-linear", "dp-counting", "dp-out-of-order"]],
    [["dp-classic-qoj12409-l", "dp-n24", "dp-n25"], ["dp-digit", "dp-carry-digit"]],
    [["dp-n59", "dp-n73"], ["dp-linear", "dp-optimization", "dp-cht"]],
    [["dp-n06", "dp-n45", "dp-n60"], ["dp-linear", "dp-optimization", "dp-decision-monotonicity"]],
    [["dp-optimization-gym102801-k", "dp-n03", "dp-n53"], ["dp-optimization", "dp-monotonic-optimization"]],
    [["dp-n37", "dp-n41", "dp-n43"], ["dp-interval", "dp-interval-elimination"]],
    [["dp-n44"], ["dp-interval", "dp-fill-holes"]],
    [["dp-n21", "dp-n26", "dp-n28", "dp-n29", "dp-n55", "dp-t08-gym104076-c"], ["dp-tree", "dp-knapsack", "dp-tree-knapsack"]],
    [["dp-n23"], ["dp-digit", "dp-knapsack", "dp-digit-knapsack"]],
    [["dp-n26"], ["dp-optimization", "dp-slope-trick"]],
    [["dp-n07"], ["dp-linear", "dp-wrong-solutions"]],
    [["dp-subset-nowcoder9328-g"], ["dp-bitmask", "dp-subset"]]
  ];
  for (const [defaultProblemIds, defaultTopicIds] of topicAssignments) {
    for (const defaultProblemId of defaultProblemIds) {
      const defaultProblem = defaultDpProblems.find((problem) => problem.id === defaultProblemId);
      if (!defaultProblem) continue;
      const problem = migrated.problems.find((item) => (
        item.id === defaultProblemId
        || normalizedProblemUrl(item.url) === normalizedProblemUrl(defaultProblem.url)
        || normalizedProblemSource(item) === normalizedProblemSource(defaultProblem)
      ));
      if (!problem) continue;
      problem.knowledge = [...new Set([
        ...problem.knowledge,
        ...defaultTopicIds.map((id) => topicIdAliases.get(id) || id)
      ])];
    }
  }

  const wrongSolutionsId = topicIdAliases.get("dp-wrong-solutions") || "dp-wrong-solutions";
  const optimizationId = topicIdAliases.get("dp-optimization") || "dp-optimization";
  const dpTopicIds = new Set(migrated.topics.filter((topic) => topic.id === "dp" || topic.parentId === "dp").map((topic) => topic.id));
  const techniqueRules = [
    { pattern: /(?:单调队列|单调栈)/, topics: ["dp-optimization", "dp-monotonic-optimization"] },
    { pattern: /(?:闵可夫斯基和|Slope\s*Trick)/i, topics: ["dp-optimization", "dp-slope-trick"] },
    { pattern: /填坑\s*DP/i, topics: ["dp-interval", "dp-fill-holes"] },
    { pattern: /树形背包/, topics: ["dp-tree", "dp-knapsack", "dp-tree-knapsack"] },
    { pattern: /数位背包/, topics: ["dp-digit", "dp-knapsack", "dp-digit-knapsack"] }
  ];
  for (const problem of migrated.problems) {
    if (!problem.knowledge.some((id) => dpTopicIds.has(id))) continue;
    const techniques = (problem.techniques || []).join(" ");
    for (const rule of techniqueRules) {
      if (!rule.pattern.test(techniques)) continue;
      problem.knowledge = [...new Set([
        ...problem.knowledge,
        ...rule.topics.map((id) => topicIdAliases.get(id) || id)
      ])];
    }
  }

  const colorfulSubsequence = migrated.problems.find((problem) => (
    problem.id === "dp-t01-abc345-e"
    || normalizedProblemUrl(problem.url) === "atcoder:abc345_e"
  ));
  if (colorfulSubsequence) {
    colorfulSubsequence.knowledge = [...new Set([
      ...colorfulSubsequence.knowledge.filter((id) => id !== wrongSolutionsId),
      optimizationId
    ])];
  }

  const funnyBipartiteDefault = defaultDpProblems.find((problem) => problem.id === "dp-bitmask-jisuanke-42577");
  const funnyBipartite = migrated.problems.find((problem) => normalizedProblemSource(problem) === "计蒜客:42577");
  if (funnyBipartiteDefault && funnyBipartite) {
    const solutions = funnyBipartite.solutions || [];
    Object.assign(funnyBipartite, structuredClone(funnyBipartiteDefault), { solutions });
  }

  for (const problem of migrated.problems) {
    const oj = normalizedCatalogName(problem.oj);
    const problemId = String(problem.problemId || "").trim();
    if (oj === "hdu" && /^\d+$/.test(problemId)) {
      problem.url = `https://vjudge.net/problem/HDU-${problemId}`;
    }
    const fzuProblem = problemId.match(/^FZU\s*-?(\d+)$/i);
    if (fzuProblem) problem.url = `https://vjudge.net/problem/FZU-${fzuProblem[1]}`;
  }

  migrated.problems = mergeDuplicateProblems(migrated.problems).filter((problem) => (
    !REMOVED_PROBLEM_IDS.has(problem.id)
    && !REMOVED_PROBLEM_SOURCES.has(normalizedProblemSource(problem))
  ));
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
  if (!cloud.user || !cloud.isAdmin) throw new Error("当前账号没有管理员权限");

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

    if (cloud.isAdmin && pending.expectedVersion === cloud.version) {
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
      cloud.status = pending.expectedVersion === cloud.version ? (cloud.isAdmin ? "offline" : "readonly") : "conflict";
    }
  } else if (remote && validateCatalog(remote.data)) {
    state.data = migrateCatalog(remote.data);
    stripSharedProgress(state.data);
    const migrationChangedCatalog = JSON.stringify(state.data) !== JSON.stringify(remote.data);
    cloud.version = remote.version;
    cloud.updatedAt = remote.updated_at;
    cloud.status = cloud.isAdmin ? "synced" : "readonly";
    cloud.error = "";
    cacheData();
    if (cloud.isAdmin && migrationChangedCatalog) {
      setPendingSync(state.data, cloud.version);
      try {
        const saved = await writeRemoteCatalog(state.data, cloud.version);
        cloud.version = saved.version;
        cloud.updatedAt = saved.updated_at;
        clearPendingSync();
        if (!silent) showToast("题单结构已合并并写回云端");
      } catch (error) {
        cloud.status = String(error.message || "").includes("catalog_conflict") ? "conflict" : "offline";
        cloud.error = error.message || "题单迁移写回失败";
      }
    }
  } else {
    cloud.version = 0;
    cloud.updatedAt = null;
    cloud.status = cloud.isAdmin ? "synced" : "readonly";
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
        cloud.status = cloud.isAdmin ? "synced" : "readonly";
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
    cloud.status = "unconfigured";
    render();
    return;
  }
  cloud.enabled = true;
  if (!window.supabase?.createClient) {
    cloud.status = "offline";
    cloud.error = "Supabase 客户端未加载";
    renderSyncStatus();
    return;
  }

  cloud.status = "loading";
  cloud.client = window.supabase.createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  renderSyncStatus();
  renderAccessControls();
  renderIcons();

  const sessionResult = await cloud.client.auth.getSession();
  cloud.user = sessionResult.data.session?.user || null;
  await refreshAdminAccess();
  cloud.client.auth.onAuthStateChange((_event, session) => {
    const previousUser = cloud.user?.id;
    cloud.user = session?.user || null;
    cloud.isAdmin = false;
    setTimeout(async () => {
      await refreshAdminAccess();
      if (cloud.user?.id !== previousUser) await loadRemoteData({ silent: true });
      else render();
    }, 0);
  });

  await loadRemoteData({ silent: true });
  subscribeToRemoteCatalog();
}

async function refreshAdminAccess() {
  cloud.isAdmin = false;
  if (!cloud.enabled || !cloud.user) return;
  const result = await cloud.client.rpc("is_catalog_admin");
  if (!result.error) cloud.isAdmin = result.data === true;
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

function getTopicPath(topicOrId) {
  const path = [];
  let topic = typeof topicOrId === "string" ? getTopic(topicOrId) : topicOrId;
  const seen = new Set();
  while (topic && !seen.has(topic.id)) {
    path.unshift(topic);
    seen.add(topic.id);
    topic = getParentTopic(topic);
  }
  return path;
}

function getTopicDisplayName(id) {
  const path = getTopicPath(id);
  if (path.length >= 3) return `${path.at(-2).name} / ${path.at(-1).name}`;
  return path.at(-1)?.name || id;
}

function getTopicScopeIds(topicId) {
  const ids = [topicId];
  for (const child of getChildTopics(topicId)) ids.push(...getTopicScopeIds(child.id));
  return ids;
}

function problemBelongsToTopic(problem, topicId) {
  const scope = new Set(getTopicScopeIds(topicId));
  return problem.knowledge.some((id) => scope.has(id));
}

function getTopicProblemCount(topicId) {
  return state.data.problems.filter((problem) => problemBelongsToTopic(problem, topicId)).length;
}

function normalizeKnowledgeSelection(ids) {
  const unique = [...new Set(ids)].filter((id) => state.data.topics.some((topic) => topic.id === id));
  return unique.filter((id) => !unique.some((otherId) => otherId !== id && getTopicScopeIds(id).includes(otherId)));
}

function canAdminEdit() {
  return cloud.enabled && cloud.isAdmin;
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
  const readonlyStatus = cloud.user
    ? { label: "只读账号", icon: "user-round", title: "当前账号不是管理员，点击查看账号状态" }
    : { label: "管理员登录", icon: "log-in", title: "登录管理员账号以编辑和审核题单" };
  const statuses = {
    unconfigured: { label: "管理员登录", icon: "log-in", title: "管理员登录尚未配置" },
    loading: { label: "正在同步", icon: "loader-circle", title: "正在读取云端数据" },
    readonly: readonlyStatus,
    synced: { label: "已同步", icon: "cloud-check", title: `云端版本 ${cloud.version}` },
    saving: { label: "正在保存", icon: "cloud-upload", title: "正在写入云端数据库" },
    offline: { label: "离线副本", icon: "cloud-off", title: cloud.error || "云端暂时不可用，本机修改会保留" },
    conflict: { label: "同步冲突", icon: "triangle-alert", title: "云端和本机都有新修改，本机副本已保留" }
  };
  const status = statuses[cloud.status] || statuses.unconfigured;
  els.syncStatusButton.className = `sync-status-button is-${cloud.status}`;
  els.syncStatusButton.title = status.title;
  els.syncStatusButton.innerHTML = `<i data-lucide="${status.icon}"></i><span>${status.label}</span>`;
  renderIcons();
}

function render() {
  renderSidebar();
  renderTopbar();
  renderAccessControls();
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
              ${standardChildren.map((child) => renderSidebarChild(child)).join("")}
              ${customChildren.length ? `<span class="topic-child-label">我的专题</span>${customChildren.map((child) => renderSidebarChild(child)).join("")}` : ""}
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
    <div class="topic-tree-node topic-tree-child">
      <div class="topic-nav-row">
        <button class="topic-nav-item topic-nav-child ${state.topicId === topic.id && state.route === "knowledge" ? "is-active" : ""}" data-topic="${topic.id}">
          <span class="topic-branch" aria-hidden="true"></span>
          <span>${escapeHtml(topic.name)}</span>
          ${topic.group === "custom" ? `<i class="custom-topic-icon" data-lucide="sparkles" aria-label="我的专题"></i>` : ""}
          <span class="topic-count">${getTopicProblemCount(topic.id)}</span>
        </button>
      </div>
    </div>`;
}

function renderTopbar() {
  const topic = getTopic(state.topicId);
  const path = getTopicPath(topic);
  els.breadcrumb.innerHTML = state.route === "knowledge"
    ? `<span>知识点题单</span><i data-lucide="chevron-right"></i>${path.slice(0, -1).map((item) => `<span>${escapeHtml(item.name)}</span><i data-lucide="chevron-right"></i>`).join("")}<strong>${escapeHtml(topic.name)}</strong>`
    : `<span>题径</span><i data-lucide="chevron-right"></i><strong>比赛收藏</strong>`;
  els.globalSearch.placeholder = state.route === "knowledge" ? "搜索题目、OJ 或标签" : "搜索比赛、OJ 或标签";
  els.knowledgeView.hidden = state.route !== "knowledge";
  els.contestView.hidden = state.route !== "contests";
  renderSyncStatus();
}

function renderAccessControls() {
  const admin = canAdminEdit();
  els.sidebarAddButton.hidden = !admin;
  if (admin) {
    els.addButton.innerHTML = `<i data-lucide="plus"></i><span>新建</span><i data-lucide="chevron-down" class="chevron"></i>`;
    els.addMenu.innerHTML = `
      <button role="menuitem" data-add="problem"><i data-lucide="file-plus-2"></i><span><strong>题目</strong><small>收录来自任意 OJ 的题目</small></span></button>
      <button role="menuitem" data-add="article"><i data-lucide="notebook-pen"></i><span><strong>教学内容</strong><small>补充讲解、思路或笔记</small></span></button>
      <button role="menuitem" data-add="contest"><i data-lucide="trophy"></i><span><strong>比赛</strong><small>收藏一场值得回看的比赛</small></span></button>
      <button role="menuitem" data-add="topic"><i data-lucide="tags"></i><span><strong>知识点 / 子专题</strong><small>扩展层级或整理自定义专题</small></span></button>
      ${cloud.enabled && cloud.isAdmin ? `<button role="menuitem" data-review-submissions><i data-lucide="inbox"></i><span><strong>投稿审核</strong><small>审核游客提交的题目与题解</small></span></button>` : ""}`;
  } else if (cloud.enabled) {
    els.addButton.innerHTML = `<i data-lucide="send"></i><span>投稿</span><i data-lucide="chevron-down" class="chevron"></i>`;
    els.addMenu.innerHTML = `
      <button role="menuitem" data-submit-entry="submit-problem"><i data-lucide="file-plus-2"></i><span><strong>投稿题目</strong><small>推荐一道值得收录的题</small></span></button>
      <button role="menuitem" data-submit-entry="submit-solution"><i data-lucide="notebook-pen"></i><span><strong>投稿题解</strong><small>为已有题目补充题解链接</small></span></button>
      <button role="menuitem" data-admin-login><i data-lucide="${cloud.user ? "user-round" : "log-in"}"></i><span><strong>${cloud.user ? "账号与权限" : "管理员登录"}</strong><small>${cloud.user ? "查看当前账号的权限状态" : "登录后编辑题单并审核投稿"}</small></span></button>`;
  } else {
    els.addButton.innerHTML = `<i data-lucide="log-in"></i><span>管理员登录</span>`;
    els.addMenu.innerHTML = "";
  }
}

function matchesQuery(problem) {
  const q = state.query.trim().toLowerCase();
  if (!q) return true;
  const text = [problem.title, problem.problemId, problem.oj, problem.note, ...(problem.techniques || []), ...problem.knowledge.map(getTopicName)].join(" ").toLowerCase();
  return text.includes(q);
}

function renderTags(ids, max = ids.length) {
  return ids.slice(0, max).map((id) => `<span class="tag">${escapeHtml(getTopicDisplayName(id))}</span>`).join("");
}

function renderTechniqueTags(tags = [], max = tags.length) {
  return tags.slice(0, max).map((tag) => `<button class="technique-tag" data-technique="${escapeHtml(tag)}" title="按技巧检索"># ${escapeHtml(tag)}</button>`).join("");
}

function problemRatingText(problem) {
  if (problem.rating === undefined || problem.rating === null || !problem.ratingSource) return "";
  if (problem.ratingSource === "洛谷") return `洛谷 · ${problem.ratingLabel || problem.rating}`;
  if (problem.ratingSource === "AtCoder Problems") return `AtCoder · ${problem.rating}`;
  if (problem.ratingSource === "Codeforces") return `CF · ${problem.rating}`;
  return `${problem.ratingSource} · ${problem.ratingLabel || problem.rating}`;
}

function renderRatingDisclosure(problem) {
  const ratingText = problemRatingText(problem);
  if (!ratingText) return "";
  const visible = state.revealedRatingId === problem.id;
  return `
    <span class="rating-disclosure">
      <button class="rating-toggle ${visible ? "is-visible" : ""}" type="button" data-toggle-rating="${escapeHtml(problem.id)}" aria-expanded="${visible}" aria-label="${visible ? "隐藏" : "查看"}${escapeHtml(problem.title)}的难度分" title="${visible ? "隐藏难度分" : "查看难度分"}">
        <i data-lucide="${visible ? "eye-off" : "eye"}"></i>
      </button>
      <span class="rating-value ${visible ? "is-visible" : ""}" role="status">${escapeHtml(ratingText)}</span>
    </span>`;
}

function renderEntryActions(type, id, label) {
  if (!canAdminEdit()) return "";
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

function problemDisplayUrl(problem) {
  if (problem.oj !== "GYM") return problem.url;
  try {
    const url = new URL(problem.url);
    const match = url.pathname.match(/^\/gym\/(\d+)/) || url.pathname.match(/^\/problemset\/gymProblem\/(\d+)/);
    return match ? `https://codeforces.com/gym/${match[1]}` : problem.url;
  } catch {
    return problem.url;
  }
}

function renderSolutionLinks(problem) {
  if (!problem.solutions?.length) return "";
  return `<div class="solution-links">${problem.solutions.map((solution) => `
    <a href="${escapeHtml(solution.url)}" target="_blank" rel="noreferrer" title="${escapeHtml(solution.summary || solution.title || "查看题解")}">
      <i data-lucide="notebook-text"></i>${escapeHtml(solution.title || "题解")}
    </a>`).join("")}</div>`;
}

function renderProblemCard(problem) {
  return `
    <article class="problem-card">
      <div class="problem-card-head">
        ${ojMark(problem.oj)}
        <div class="card-head-actions">
          <span class="difficulty ${difficultyClass(problem.difficulty)}">${escapeHtml(problem.difficulty)}</span>
          ${renderRatingDisclosure(problem)}
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
        ${group === "custom" && canAdminEdit() ? `<button class="text-button" data-add="topic" data-parent-id="${topic.id}" data-topic-group="custom"><i data-lucide="plus"></i>添加我的专题</button>` : ""}
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

function renderProblemTable(problems, { scope, showProgress }) {
  const filterKey = scope === "classic" ? "classicDifficulty" : "trainingDifficulty";
  const filtered = problems.filter((problem) => state[filterKey] === "全部" || problem.difficulty === state[filterKey]);
  const showActions = canAdminEdit();
  const columnCount = 4 + (showProgress ? 1 : 0) + (showActions ? 1 : 0);
  const emptyTitle = scope === "classic" ? "暂无匹配的经典例题" : "暂无匹配的训练题";
  return `
    <div class="training-panel problem-panel">
      <div class="training-toolbar">
        <div class="filter-group">
          ${["全部", "简单", "中等", "困难"].map((item) => `<button class="filter-button ${state[filterKey] === item ? "is-active" : ""}" data-difficulty="${item}" data-difficulty-scope="${scope}">${item}</button>`).join("")}
        </div>
        <span class="training-count">${filtered.length} problems</span>
      </div>
      ${filtered.length ? `
        <table class="problem-table ${showProgress ? "is-training" : "is-classic"}">
          <thead><tr>${showProgress ? "<th>状态</th>" : ""}<th>题目</th><th>难度</th><th class="knowledge-column">知识点</th><th>备注</th>${showActions ? "<th class=\"actions-column\"><span class=\"sr-only\">操作</span></th>" : ""}</tr></thead>
          <tbody>
            ${filtered.map((problem) => `
              <tr class="problem-row">
                ${showProgress ? `<td class="status-cell"><button class="status-check ${isProblemDone(problem) ? "is-done" : ""}" data-toggle-done="${problem.id}" aria-label="${isProblemDone(problem) ? "标记为未完成" : "标记为已完成"}" title="${isProblemDone(problem) ? "已完成" : "未完成"}"><i data-lucide="check"></i></button></td>` : ""}
                <td class="problem-cell"><div class="table-title">${ojMark(problem.oj)}<div><a href="${escapeHtml(problemDisplayUrl(problem))}" target="_blank" rel="noreferrer">${escapeHtml(problem.title)}</a><div class="problem-id">${escapeHtml(problem.problemId || problem.oj)}</div></div></div></td>
                <td class="difficulty-column"><div class="difficulty-cell"><span class="difficulty ${difficultyClass(problem.difficulty)}">${escapeHtml(problem.difficulty)}</span>${renderRatingDisclosure(problem)}</div></td>
                <td class="knowledge-column" data-label="知识点"><div class="table-tags">${renderTags(problem.knowledge)}</div></td>
                <td class="table-note" data-label="备注"><div class="table-note-copy">${escapeHtml(problem.note || "")}</div>${problem.techniques?.length ? `<div class="table-techniques">${renderTechniqueTags(problem.techniques)}</div>` : ""}${renderSolutionLinks(problem)}</td>
                ${showActions ? `<td class="table-actions">${renderEntryActions("problem", problem.id, problem.title)}</td>` : ""}
              </tr>`).join("")}
          </tbody>
        </table>` : `<div class="table-empty" style="--table-columns:${columnCount}">${renderEmpty(emptyTitle, "试试切换难度或更换搜索词。")}</div>`}
    </div>`;
}

function renderKnowledge() {
  const topic = getTopic(state.topicId);
  const parent = getParentTopic(topic);
  const topicProblems = state.data.problems.filter((problem) => problemBelongsToTopic(problem, topic.id) && matchesQuery(problem));
  const classics = topicProblems.filter((problem) => problem.kind === "classic");
  const training = topicProblems.filter((problem) => problem.kind === "training");
  const doneCount = topicProblems.filter(isProblemDone).length;
  const article = topic.article || { title: `${topic.name}学习笔记`, body: ["这里还没有教学内容。"], outline: ["补充知识梳理", "添加经典例题", "安排实战训练"] };

  els.knowledgeContent.innerHTML = `
    <div class="content-wrap">
      <header class="topic-hero">
        <div class="topic-hero-main">
          <div class="topic-kicker-row">
            <div class="topic-kicker"><span class="topic-dot" style="--topic-color:${topic.color}"></span>${topic.group === "custom" ? "MY TOPIC" : parent ? "SUBTOPIC" : "KNOWLEDGE PATH"}</div>
            <div class="topic-heading-actions">
              ${!parent && canAdminEdit() ? `<button class="entry-action" data-add="topic" data-parent-id="${topic.id}" data-topic-group="custom" aria-label="在${escapeHtml(topic.name)}下新增子专题" title="新增子专题"><i data-lucide="folder-plus"></i></button>` : ""}
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
          ${canAdminEdit() ? `<button class="text-button" data-add="article"><i data-lucide="pencil-line"></i>编辑内容</button>` : ""}
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
          ${canAdminEdit() ? `<button class="text-button" data-add="problem" data-kind="classic"><i data-lucide="plus"></i>添加例题</button>` : ""}
        </div>
        ${renderProblemTable(classics, { scope: "classic", showProgress: false })}
      </section>

      <section class="section">
        <div class="section-heading">
          <div><h2>实战训练</h2><p>完成后点亮状态，保留自己的练习节奏。</p></div>
          ${canAdminEdit() ? `<button class="text-button" data-add="problem" data-kind="training"><i data-lucide="plus"></i>添加训练</button>` : ""}
        </div>
        ${renderProblemTable(training, { scope: "training", showProgress: true })}
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
          ${canAdminEdit() ? `<button class="text-button" data-add="contest"><i data-lucide="plus"></i>添加比赛</button>` : ""}
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
            ${canAdminEdit() ? `<button class="text-button" data-add="contest"><i data-lucide="plus"></i>添加比赛</button>` : ""}
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
    const label = getTopicPath(topic).map((item) => item.name).join(" / ");
    return `<option value="${topic.id}" ${topic.id === selected ? "selected" : ""}>${escapeHtml(label)}</option>`;
  }).join("");
}

function topicCheckboxes(selectedIds = [state.topicId]) {
  const selected = new Set(selectedIds);
  return state.data.topics.map((topic) => {
    const parent = getParentTopic(topic);
    const label = getTopicPath(topic).map((item) => item.name).join(" / ");
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
    "setup-required": { eyebrow: "CLOUD", title: "管理员登录", button: "" },
    account: { eyebrow: "SYNC", title: "账号与同步", button: "退出登录" },
    "submit-problem": { eyebrow: "SUBMISSION", title: "投稿题目", button: "提交审核" },
    "submit-solution": { eyebrow: "SUBMISSION", title: "投稿题解", button: "提交审核" },
    "review-submissions": { eyebrow: "REVIEW", title: "投稿审核", button: "" }
  };
  const config = configs[type];
  els.modalEyebrow.textContent = config.eyebrow;
  els.modalTitle.textContent = config.title;
  els.submitButton.textContent = config.button;
  els.submitButton.classList.toggle("danger-button", type === "delete");
  els.modalFooter.hidden = type === "review-submissions" || type === "setup-required";
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
  if (type === "setup-required") {
    return `
      <div class="submission-notice"><i data-lucide="shield-alert"></i><span>管理员登录尚未配置，当前题单已锁定为只读。</span></div>
      <div class="account-summary"><strong>需要连接 Supabase</strong><span>配置完成后，这里会显示邮箱登录，并启用游客投稿与管理员审核。</span></div>`;
  }
  if (type === "account") {
    const pending = getPendingSync();
    return `
      <div class="account-summary"><strong>${escapeHtml(cloud.user?.email || "已登录")}</strong><span>${cloud.isAdmin ? "管理员" : "普通账号 · 只读"} · 云端版本 ${cloud.version}${cloud.updatedAt ? ` · ${new Date(cloud.updatedAt).toLocaleString("zh-CN")}` : ""}</span></div>
      ${pending ? `<div class="account-summary"><strong>本机有待同步修改</strong><span>${escapeHtml(pending.savedAt || "")}</span></div>` : ""}`;
  }
  if (type === "submit-problem") {
    return `
      <div class="submission-notice"><i data-lucide="shield-check"></i><span>投稿不会直接进入题单，管理员审核通过后才会公开。</span></div>
      <label class="field"><span>题目名称</span><input name="title" required maxlength="160" placeholder="比赛与题号 - 题目名称" /></label>
      <label class="field"><span>官方题目链接</span><input name="url" type="url" required maxlength="500" placeholder="https://..." /></label>
      <div class="form-row">
        <label class="field"><span>来源 OJ</span><input name="oj" required maxlength="40" list="ojList" placeholder="AtCoder / Codeforces / 牛客" /><datalist id="ojList">${Object.keys(ojStyles).map((oj) => `<option value="${oj}"></option>`).join("")}</datalist></label>
        <label class="field"><span>题号</span><input name="problemId" maxlength="60" placeholder="ABC345 E" /></label>
      </div>
      <div class="form-row">
        <label class="field"><span>建议难度</span><select name="difficulty">${["简单", "中等", "困难"].map((item) => `<option>${item}</option>`).join("")}</select></label>
        <fieldset class="field"><legend>建议区域</legend><div class="radio-row"><label class="radio-option"><input type="radio" name="kind" value="classic" />经典例题</label><label class="radio-option"><input type="radio" name="kind" value="training" checked />实战训练</label></div></fieldset>
      </div>
      <fieldset class="field"><legend>知识点（可多选）</legend><div class="checkbox-grid">${topicCheckboxes([state.topicId])}</div></fieldset>
      <label class="field"><span>技巧标签</span><input name="techniques" maxlength="300" placeholder="状态设计，插入法，前缀和优化" /></label>
      <label class="field"><span>推荐理由</span><textarea name="note" required maxlength="1200" placeholder="这道题为什么值得收录，关键模型或独特技巧是什么"></textarea></label>
      <label class="field"><span>署名（可选）</span><input name="author" maxlength="60" placeholder="昵称" /></label>`;
  }
  if (type === "submit-solution") {
    const options = [...state.data.problems]
      .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"))
      .map((problem) => `<option value="${escapeHtml(problem.id)}">${escapeHtml(problem.title)} · ${escapeHtml(problem.problemId || problem.oj)}</option>`)
      .join("");
    return `
      <div class="submission-notice"><i data-lucide="shield-check"></i><span>请提交可公开访问的题解；审核通过后会显示在对应题目旁。</span></div>
      <label class="field"><span>对应题目</span><select name="targetProblemId" required><option value="">请选择题目</option>${options}</select></label>
      <label class="field"><span>题解标题</span><input name="title" required maxlength="120" placeholder="例如：官方题解 / 我的题解" /></label>
      <label class="field"><span>题解链接</span><input name="url" type="url" required maxlength="500" placeholder="https://..." /></label>
      <label class="field"><span>内容摘要</span><textarea name="summary" maxlength="800" placeholder="主要思路、复杂度或这份题解的特点"></textarea></label>
      <label class="field"><span>署名（可选）</span><input name="author" maxlength="60" placeholder="昵称" /></label>`;
  }
  if (type === "review-submissions") {
    return `<div class="review-loading"><i data-lucide="loader-circle"></i><span>正在读取待审核投稿</span></div>`;
  }
  if (type === "problem") {
    const problem = state.data.problems.find((item) => item.id === state.editingId);
    const difficulty = problem?.difficulty || "中等";
    const kind = problem?.kind || state.modalContext.kind || "classic";
    const ratingSource = problem?.ratingSource || "";
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
      <div class="form-row">
        <label class="field"><span>难度分</span><input name="rating" type="number" min="0" step="1" value="${escapeHtml(problem?.rating ?? "")}" placeholder="无数据可留空" /><small>保存后默认隐藏，由用户主动查看</small></label>
        <label class="field"><span>评分来源</span><select name="ratingSource"><option value="">无</option>${["Codeforces", "AtCoder Problems", "洛谷"].map((item) => `<option value="${item}" ${item === ratingSource ? "selected" : ""}>${item}</option>`).join("")}</select></label>
      </div>
      <label class="field"><span>等级名称</span><input name="ratingLabel" value="${escapeHtml(problem?.ratingLabel || "")}" placeholder="洛谷可填写：省选/NOI−" /><small>数字评分平台可留空</small></label>
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
  els.modalFooter.hidden = false;
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

async function submitCatalogSuggestion(kind, payload) {
  if (!cloud.enabled || !cloud.client) throw new Error("投稿服务暂时不可用，请稍后重试");
  const result = await cloud.client.from("catalog_submissions").insert({ kind, payload });
  if (result.error) throw result.error;
}

async function loadPendingSubmissions() {
  if (!cloud.isAdmin) return;
  els.formFields.innerHTML = `<div class="review-loading"><i data-lucide="loader-circle"></i><span>正在读取待审核投稿</span></div>`;
  renderIcons();
  const result = await cloud.client
    .from("catalog_submissions")
    .select("id, kind, payload, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (result.error) {
    els.formFields.innerHTML = renderEmpty("读取投稿失败", result.error.message || "请稍后重试。");
    return;
  }

  cloud.submissions = result.data || [];
  renderSubmissionReview();
}

function renderSubmissionReview() {
  if (!cloud.submissions.length) {
    els.formFields.innerHTML = renderEmpty("没有待审核投稿", "新的题目或题解投稿会出现在这里。");
    renderIcons();
    return;
  }
  els.formFields.innerHTML = `<div class="review-list">${cloud.submissions.map((submission) => {
    const payload = submission.payload || {};
    const isProblem = submission.kind === "problem";
    const target = isProblem ? null : state.data.problems.find((problem) => problem.id === payload.targetProblemId);
    const knowledge = isProblem ? normalizeKnowledgeSelection(payload.knowledge || []).map(getTopicDisplayName).join("、") : "";
    return `
      <article class="review-item">
        <div class="review-item-head"><span class="review-kind">${isProblem ? "题目" : "题解"}</span><time>${new Date(submission.created_at).toLocaleString("zh-CN")}</time></div>
        <h3>${escapeHtml(payload.title || "未命名投稿")}</h3>
        ${!isProblem ? `<p class="review-target">对应：${escapeHtml(target?.title || payload.targetProblemTitle || "题目已不存在")}</p>` : ""}
        <a class="review-url" href="${escapeHtml(payload.url || "#")}" target="_blank" rel="noreferrer">${escapeHtml(payload.url || "未提供链接")}<i data-lucide="arrow-up-right"></i></a>
        <p>${escapeHtml(isProblem ? payload.note : payload.summary || "暂无摘要")}</p>
        <div class="review-meta">
          ${isProblem ? `<span>${escapeHtml(payload.oj || "其他")}${payload.problemId ? ` · ${escapeHtml(payload.problemId)}` : ""}</span><span>${escapeHtml(payload.kind === "classic" ? "经典例题" : "实战训练")}</span><span>${escapeHtml(knowledge || "未选择知识点")}</span>` : ""}
          ${payload.author ? `<span>投稿人：${escapeHtml(payload.author)}</span>` : ""}
        </div>
        <div class="review-actions">
          <button class="ghost-button" type="button" data-review-action="reject" data-submission-id="${submission.id}"><i data-lucide="x"></i>驳回</button>
          <button class="primary-button" type="button" data-review-action="approve" data-submission-id="${submission.id}"><i data-lucide="check"></i>通过并收录</button>
        </div>
      </article>`;
  }).join("")}</div>`;
  renderIcons();
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function applyApprovedSubmission(submission) {
  const payload = submission.payload || {};
  if (!isHttpUrl(payload.url)) throw new Error("投稿链接不是有效的 HTTP 地址");
  if (submission.kind === "problem") {
    const knowledge = normalizeKnowledgeSelection(payload.knowledge || []);
    if (!payload.title?.trim() || !payload.oj?.trim() || !knowledge.length) throw new Error("题目信息或知识点不完整");
    const source = normalizedProblemSource(payload);
    const existing = state.data.problems.find((problem) => (
      problem.submissionId === submission.id
      || normalizedProblemUrl(problem.url) === normalizedProblemUrl(payload.url)
      || (source && normalizedProblemSource(problem) === source)
    ));
    if (existing) return { changed: false, message: "题目已存在，投稿已标记通过" };
    state.data.problems.unshift({
      id: `submitted-${submission.id}`,
      submissionId: submission.id,
      title: payload.title.trim(),
      url: payload.url.trim(),
      oj: payload.oj.trim(),
      problemId: String(payload.problemId || "").trim(),
      difficulty: ["简单", "中等", "困难"].includes(payload.difficulty) ? payload.difficulty : "中等",
      knowledge,
      techniques: Array.isArray(payload.techniques) ? payload.techniques.map(String).map((tag) => tag.trim()).filter(Boolean).slice(0, 12) : [],
      kind: payload.kind === "classic" ? "classic" : "training",
      note: String(payload.note || "").trim(),
      solutions: []
    });
    return { changed: true, message: "题目已审核并收录" };
  }

  const problem = state.data.problems.find((item) => item.id === payload.targetProblemId);
  if (!problem) throw new Error("对应题目已不存在，请先驳回并让投稿人重新选择");
  problem.solutions ||= [];
  const existing = problem.solutions.find((solution) => (
    solution.submissionId === submission.id
    || normalizedProblemUrl(solution.url) === normalizedProblemUrl(payload.url)
  ));
  if (existing) return { changed: false, message: "题解已存在，投稿已标记通过" };
  problem.solutions.push({
    submissionId: submission.id,
    title: String(payload.title || "题解").trim() || "题解",
    url: payload.url.trim(),
    summary: String(payload.summary || "").trim(),
    author: String(payload.author || "").trim()
  });
  return { changed: true, message: "题解已审核并收录" };
}

async function reviewSubmission(submissionId, action) {
  if (!cloud.isAdmin) throw new Error("当前账号没有管理员权限");
  const submission = cloud.submissions.find((item) => item.id === submissionId);
  if (!submission) throw new Error("投稿不存在或已被处理");
  let message = "投稿已驳回";
  if (action === "approve") {
    const applied = applyApprovedSubmission(submission);
    if (applied.changed) await saveData();
    message = applied.message;
  }
  const result = await cloud.client
    .from("catalog_submissions")
    .update({ status: action === "approve" ? "approved" : "rejected", reviewed_at: new Date().toISOString(), reviewed_by: cloud.user.id })
    .eq("id", submissionId)
    .eq("status", "pending");
  if (result.error) throw result.error;
  cloud.submissions = cloud.submissions.filter((item) => item.id !== submissionId);
  renderSubmissionReview();
  render();
  showToast(message);
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const type = state.modalType;
  els.submitButton.disabled = true;

  if (type === "login") {
    if (!cloud.enabled || !cloud.client) {
      els.submitButton.disabled = false;
      openModal("setup-required");
      return;
    }
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

  if (type === "submit-problem" || type === "submit-solution") {
    try {
      if (type === "submit-problem") {
        const knowledge = normalizeKnowledgeSelection(form.getAll("knowledge"));
        if (!knowledge.length) throw new Error("请至少选择一个知识点");
        await submitCatalogSuggestion("problem", {
          title: form.get("title").trim(),
          url: form.get("url").trim(),
          oj: form.get("oj").trim(),
          problemId: form.get("problemId").trim(),
          difficulty: form.get("difficulty"),
          kind: form.get("kind"),
          knowledge,
          techniques: form.get("techniques").split(/[，,]/).map((tag) => tag.trim()).filter(Boolean).slice(0, 12),
          note: form.get("note").trim(),
          author: form.get("author").trim()
        });
      } else {
        const targetProblemId = form.get("targetProblemId");
        const target = state.data.problems.find((problem) => problem.id === targetProblemId);
        if (!target) throw new Error("请选择仍在题单中的题目");
        await submitCatalogSuggestion("solution", {
          targetProblemId,
          targetProblemTitle: target.title,
          title: form.get("title").trim(),
          url: form.get("url").trim(),
          summary: form.get("summary").trim(),
          author: form.get("author").trim()
        });
      }
      closeModal();
      showToast("投稿已提交，等待管理员审核");
    } catch (error) {
      showToast(error.message || "投稿失败，请稍后重试");
    } finally {
      els.submitButton.disabled = false;
    }
    return;
  }

  if (!canAdminEdit()) {
    els.submitButton.disabled = false;
    showToast("当前账号没有管理员权限");
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
    const knowledge = normalizeKnowledgeSelection(form.getAll("knowledge"));
    if (!knowledge.length) {
      els.submitButton.disabled = false;
      showToast("请至少选择一个知识点");
      return;
    }
    const existing = state.data.problems.find((problem) => problem.id === state.editingId);
    const ratingValue = form.get("rating").trim();
    const rating = ratingValue === "" ? null : Number(ratingValue);
    const ratingSource = form.get("ratingSource");
    const problem = {
      id: existing?.id || `p-${Date.now()}`,
      title: form.get("title").trim(),
      url: form.get("url").trim(),
      oj: form.get("oj").trim(),
      problemId: form.get("problemId").trim(),
      difficulty: Number.isFinite(rating) && ratingSource ? (difficultyFromRating(rating, ratingSource) || form.get("difficulty")) : form.get("difficulty"),
      rating: Number.isFinite(rating) ? rating : null,
      ratingSource: Number.isFinite(rating) ? ratingSource : "",
      ratingLabel: Number.isFinite(rating) ? form.get("ratingLabel").trim() : "",
      knowledge,
      techniques: form.get("techniques").split(/[，,]/).map((tag) => tag.trim()).filter(Boolean),
      kind: form.get("kind"),
      note: form.get("note").trim(),
      solutions: existing?.solutions || []
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
  if (canAdminEdit()) return true;
  openModal(!cloud.enabled ? "setup-required" : cloud.user ? "account" : "login");
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
    const topic = getTopic(state.topicId);
    for (const ancestor of getTopicPath(topic).slice(0, -1)) state.expandedTopics.add(ancestor.id);
    if (getChildTopics(topic.id).length) state.expandedTopics.add(topic.id);
    state.route = "knowledge";
    state.query = "";
    state.classicDifficulty = "全部";
    state.trainingDifficulty = "全部";
    state.lessonExpanded = false;
    state.revealedRatingId = null;
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

  const submitTarget = event.target.closest("[data-submit-entry]");
  if (submitTarget) {
    if (!cloud.enabled) showToast("投稿需要先配置云端数据库");
    else openModal(submitTarget.dataset.submitEntry);
  }

  if (event.target.closest("[data-admin-login]")) {
    openModal(!cloud.enabled ? "setup-required" : cloud.user ? "account" : "login");
  }

  if (event.target.closest("[data-review-submissions]")) {
    if (!cloud.isAdmin) showToast("当前账号没有管理员权限");
    else {
      openModal("review-submissions");
      await loadPendingSubmissions();
    }
  }

  const reviewTarget = event.target.closest("[data-review-action]");
  if (reviewTarget) {
    reviewTarget.disabled = true;
    try {
      await reviewSubmission(reviewTarget.dataset.submissionId, reviewTarget.dataset.reviewAction);
    } catch (error) {
      showToast(error.message || "审核失败，请稍后重试");
      reviewTarget.disabled = false;
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
    const key = difficultyButton.dataset.difficultyScope === "classic" ? "classicDifficulty" : "trainingDifficulty";
    state[key] = difficultyButton.dataset.difficulty;
    renderKnowledge();
    renderIcons();
  }

  const ratingButton = event.target.closest("[data-toggle-rating]");
  if (ratingButton) {
    const id = ratingButton.dataset.toggleRating;
    state.revealedRatingId = state.revealedRatingId === id ? null : id;
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
  if (!cloud.enabled) {
    openModal("setup-required");
    return;
  }
  els.addMenu.classList.toggle("is-open");
});

els.syncStatusButton.addEventListener("click", async () => {
  if (!cloud.enabled) {
    openModal("setup-required");
    return;
  }
  if (!cloud.client) {
    showToast(cloud.error || "云端服务暂时不可用");
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

initializeCloud().catch((error) => {
  cloud.status = "offline";
  cloud.error = error.message || "云端初始化失败";
  renderSyncStatus();
});
render();
