# scripts/branch_c/build_day44_full.py
import json

day44 = {
  "day": 44,
  "coursePrefix": "dsa-optim",
  "title": "Subtree Knapsack, Size-Bounded Tree Merging & Tree Convolution",
  "minutes": 38,
  "projectStep": {
    "title": "Hierarchical Cloud Microservice Resource Budgeter with Euler Skip DP",
    "steps": [
      "Model multi-tiered microservice dependencies as capacity-bounded directed trees",
      "Apply the Cartesian Pairwise Sizing Lemma to bound tree knapsack merging complexity",
      "Flatten hierarchical dependency graphs via Euler Tour pre-order linearization",
      "Execute linear DAG skip knapsack DP to allocate CPU cores under strict SLA utility maximization"
    ]
  },
  "summary": [
    "Subtree Knapsack (also known as Tree Knapsack or Tree Convolution) selects an optimal subset of vertices subject to hierarchical dependency and resource capacity constraints.",
    "A naive implementation of tree knapsack loops over the global capacity K at every node, incurring a prohibitively slow O(N * K^2) worst-case time complexity.",
    "By bounding convolution loops to the actual subtree sizes sz[u] and sz[v], the Cartesian Pairwise Sizing Lemma guarantees that the total number of operations across the entire tree is strictly bounded by O(N^2) or O(N * K).",
    "Every inner loop iteration corresponds to uniquely pairing two distinct vertices whose Lowest Common Ancestor is u; because every pair of vertices has exactly one LCA, no pair is ever evaluated twice.",
    "Euler Tour Flattening linearizes hierarchical tree dependencies into a contiguous DFS entry order, converting complex tree DP into an elegant linear DAG knapsack with subtree skip transitions in O(N * K) time.",
    "Enterprise cloud orchestrators utilize size-bounded tree knapsacks to budget compute resources across microservice hierarchies, maximizing business SLA utility under physical hardware constraints."
  ],
  "parts": [
    # Part 1
    {
      "title": "Knapsack on Trees: Capacity-Bounded Subtree DP Formulation",
      "say": [
        "Welcome to Day 44 of Advanced Data Structures and Algorithmic Optimization. Today we explore one of the most sophisticated dynamic programming patterns in computer science: Subtree Knapsack, also widely referred to as Tree Knapsack, Tree Merging DP, or Tree Convolution. In classical linear knapsack problems, items are independent: selecting item A has no bearing on whether item B can be chosen. However, in enterprise systems engineering, cloud architecture, and organizational budgeting, items are rarely independent. Instead, they exhibit strict hierarchical dependencies: a microservice pod cannot be provisioned unless its parent domain gateway is active; a database read replica cannot be deployed unless the primary database cluster is initialized; and a feature module cannot execute unless its core runtime framework is allocated.",
        "Formally, in a Tree Knapsack problem, we are given a rooted tree of N vertices where each vertex u has a weight cost[u] (representing consumed resources such as memory, CPU cores, or financial budget) and a business value value[u] (representing throughput, SLA utility, or revenue). We are given a total resource capacity budget K. The operational dependency invariant dictates that a child node v can be included in the selected knapsack set if and only if its parent u is also included. Our objective is to select a subset of vertices that satisfies this ancestral dependency rule while maximizing the total value without exceeding the budget K.",
        "To formulate this problem as a tree dynamic program, let dp[u][w] denote the maximum value achievable within the subtree rooted at u using exactly w units of resource capacity. When vertex u is a leaf node, its state is trivial: if w = cost[u], dp[u][w] = value[u]; if w = 0, dp[u][0] = 0; and for all other w, dp[u][w] = -infinity. However, when vertex u is an internal node with multiple children, we must merge the dynamic programming states of its children into u's state table. This merging operation is a Discrete Convolution: if we allocate i units of capacity to u and its previously processed subtrees, and j units of capacity to the newly arriving child v, the combined state achieves capacity i + j with value dp[u][i] + dp[v][j].",
        "A naive implementation of this convolution iterates i from 0 to K and j from 0 to K for every child edge, resulting in an O(K^2) merging step per edge. Across all N - 1 edges in the tree, this naive approach consumes O(N * K^2) time. When K is large (for instance, allocating hundreds of gigabytes of RAM or thousands of CPU threads), an O(N * K^2) algorithm suffers severe performance degradation, stalling cluster orchestration pipelines and causing scheduling timeouts.",
        "However, a profound algorithmic optimization exists: Subtree Size-Bounding. Notice that vertex u and its subtree can never consume more capacity than the total number of items or total weight physically present in that subtree. If child v's subtree has size sz[v], it is impossible for v to utilize more than sz[v] items. Therefore, instead of looping up to the global constant K, we strictly bound our convolution loops: i iterates only up to min(K, sz[u]), and j iterates only up to min(K, sz[v]). As we will formally prove in Part 2, this seemingly simple sizing bound causes the total time complexity to collapse from O(N * K^2) down to strict O(N * K) when K <= N, or O(N^2) when K >= N!",
        "In enterprise cloud Kubernetes clusters, this size-bounded knapsack formulation is deployed in hierarchical pod autoscalers and resource quota controllers. When an enterprise tenant requests a burst allocation of container instances across multiple microservice sub-domains, the scheduler evaluates the dependency tree. By running the size-bounded subtree knapsack, the scheduler maximizes tenant workload throughput while strictly respecting node affinity rules and cluster memory limits in less than five milliseconds."
      ],
      "example": "In a corporate enterprise data platform managing multi-tiered analytics pipelines, data engineering teams allocate cloud compute instances across extract, transform, and load (ETL) tasks organized in a dependency tree. By executing size-bounded subtree knapsack DP, the scheduler determines the optimal set of dependent pipeline stages that maximizes data processing volume within a sixty-core budget.",
      "tryIt": "Examine the TypeScript code below. Observe how limitU and limitV bound the convolution loops to min(k, sz[u]) and min(k, sz[v]), preventing unnecessary iterations beyond actual subtree capacities. Run the code and verify the optimal knapsack value for budget K = 3.",
      "code": "function runSubtreeKnapsack() {\n  const n = 6;\n  const k = 3;\n  const adj: number[][] = Array.from({ length: n }, () => []);\n  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n\n  const values = [10, 20, 15, 30, 25, 18];\n  const sz = new Array(n).fill(1);\n  const dp: number[][] = Array.from({ length: n }, () => new Array(k + 1).fill(-Infinity));\n\n  function dfs(u: number, p: number) {\n    dp[u][1] = values[u];\n    sz[u] = 1;\n\n    for (const v of adj[u]) {\n      if (v === p) continue;\n      dfs(v, u);\n\n      const nextDP = new Array(k + 1).fill(-Infinity);\n      const limitU = Math.min(k, sz[u]);\n      const limitV = Math.min(k, sz[v]);\n\n      for (let i = 1; i <= limitU; i++) {\n        for (let j = 0; j <= limitV && i + j <= k; j++) {\n          const val = j === 0 ? dp[u][i] : dp[u][i] + dp[v][j];\n          nextDP[i + j] = Math.max(nextDP[i + j], val);\n        }\n      }\n      for (let w = 1; w <= k; w++) {\n        dp[u][w] = Math.max(dp[u][w], nextDP[w]);\n      }\n      sz[u] += sz[v];\n    }\n  }\n  dfs(0, -1);\n\n  const bestVal = Math.max(...dp[0].filter(v => isFinite(v)));\n  console.log(JSON.stringify({\n    nodeCount: n,\n    maxBudgetK: k,\n    rootDP: dp[0],\n    optimalValue: bestVal\n  }));\n}\nrunSubtreeKnapsack();",
      "output": "{\"nodeCount\":6,\"maxBudgetK\":3,\"rootDP\":[null,10,30,60],\"optimalValue\":60}",
      "codeNotes": [
        "Lines 14-16: Initializes dp[u][1] = values[u] (the cost of including u itself is 1 unit) and base sz[u] = 1.",
        "Lines 22-24: Crucial optimization: limitU and limitV restrict loop bounds to actual accumulated subtree sizes.",
        "Lines 26-31: Merges child DP table into nextDP using discrete convolution.",
        "Lines 32-34: Copies merged values back into dp[u] and increments subtree size sz[u] += sz[v].",
        "Line 44: Outputs rootDP [null, 10, 30, 60] and optimalValue 60."
      ],
      "check": {
        "question": "Why does bounding the convolution inner loops by min(K, sz[u]) and min(K, sz[v]) dramatically improve time complexity over looping to K?",
        "options": [
          "Because a subtree of size sz cannot contribute more than sz items, eliminating millions of unreachable capacity iterations across small subtrees",
          "Because JavaScript engines vectorize loops whose bounds are dynamic variables",
          "Because it converts the problem into a continuous convex quadratic program",
          "Because it guarantees that all child subtrees have equal depth"
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "A subtree containing sz nodes cannot physically contain more than sz selected items. Restricting loop bounds to actual subtree sizes eliminates wasteful calculations for unreachable capacities."
      }
    },
    # Part 2
    {
      "title": "Cartesian Pairwise Lemma: Proving O(N^2) Complexity",
      "say": [
        "In Part 2, we establish the mathematical proof of the Cartesian Pairwise Sizing Lemma. When software engineers first encounter the size-bounded subtree knapsack algorithm, their intuitive reaction is often skeptical: they see two nested loops (for i in 1..sz[u] and for j in 1..sz[v]) inside a recursive depth-first search, and naturally assume the worst-case time complexity must still be cubic O(N^3) or at best O(N * K^2). However, a rigorous combinatorial counting argument proves that the total number of inner loop executions across the entire tree is strictly bounded by N * (N - 1) / 2 = O(N^2) when unweighted (or O(N * K) when bounded by capacity K).",
        "Let us examine the Cartesian Product interpretation. Consider the moment in our algorithm when we are processing vertex u, and we are merging the subtree of child v into the previously accumulated subtree of u. The inner loops execute exactly sz[u] * sz[v] times. What does each individual execution of that inner loop represent combinatorially? It represents choosing exactly one vertex x from the previously accumulated subtree of u, and choosing exactly one vertex y from the newly arriving subtree of v. In other words, every single execution of the inner loop corresponds to a unique unordered pair of vertices {x, y} in the tree!",
        "Now, consider the relationship between vertices x and y in the tree topology. Where do their paths intersect? Because x belongs to one branch of u and y belongs to another branch of u, their unique Lowest Common Ancestor (LCA) in the rooted tree is precisely vertex u: LCA(x, y) = u. In any tree, for any two distinct vertices x and y, how many lowest common ancestors can they have? Exactly one! A pair of vertices has one and only one lowest common ancestor.",
        "Therefore, the pair {x, y} is paired together during the merging operation at vertex u, and they will never, ever be paired together at any other vertex in the entire tree! When u's parent merges u into an ancestor, all nodes in u's subtree (including both x and y) belong to the same branch, so they are never compared against each other again. Because every pair of vertices {x, y} is paired at most once throughout the entire lifetime of the algorithm, the total number of inner loop executions summed over all vertices in the tree cannot exceed the total number of unordered pairs in a set of N elements: sum_{u in V} sum_{v in Children(u)} sz[u] * sz[v] = C(N, 2) = N * (N - 1) / 2 <= N^2 / 2.",
        "What happens when we introduce a capacity limit K? If each loop is bounded by min(K, sz), the number of operations per pair is further truncated. If K >= N, the complexity remains bounded by O(N^2). If K < N, each vertex can participate in at most K pairings before the capacity cutoff takes effect, bounding the total complexity to strict O(N * K). This profound result proves that the size-bounded tree knapsack is asymptotically optimal: it achieves identical complexity to linear knapsack without paying any penalty for tree branching!",
        "In enterprise software architecture, understanding the Cartesian Pairwise Sizing Lemma transforms how engineers design hierarchical data pipelines. When processing recursive JSON documents, organizational charts, or hierarchical tax structures, developers often avoid dynamic programming due to fears of exponential or polynomial blowup. Recognizing that tree convolutions are provably O(N^2) empowers engineers to deploy mathematically optimal resource allocators with total confidence in their bounded execution times."
      ],
      "example": "In an enterprise supply chain network spanning seven regional distribution warehouses, an inventory optimization algorithm merges local stock constraints. By verifying the Cartesian Pairwise Lemma, the engineering team confirms that the total number of pair interactions across all warehouse merges is exactly twenty-one, strictly matching the theoretical maximum C(7, 2) = 21.",
      "tryIt": "Examine the TypeScript code below. Observe how totalInnerIterations increments by sz[u] * sz[v] at each merge step. Run the code and verify that the empirical loop count equals the theoretical maximum N * (N - 1) / 2 = 21.",
      "code": "function verifyCartesianLemma() {\n  const n = 7;\n  const adj: number[][] = Array.from({ length: n }, () => []);\n  const edges = [\n    [0, 1], [0, 2],\n    [1, 3], [1, 4],\n    [4, 5], [4, 6]\n  ];\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n\n  const sz = new Array(n).fill(1);\n  let totalInnerIterations = 0;\n\n  function dfsCount(u: number, p: number) {\n    sz[u] = 1;\n    for (const v of adj[u]) {\n      if (v === p) continue;\n      dfsCount(v, u);\n      // Inner loop executes sz[u] * sz[v] times\n      totalInnerIterations += sz[u] * sz[v];\n      sz[u] += sz[v];\n    }\n  }\n  dfsCount(0, -1);\n\n  const theoreticalMax = (n * (n - 1)) / 2;\n  console.log(JSON.stringify({\n    nodeCount: n,\n    totalInnerIterations,\n    theoreticalMax,\n    strictlyWithinBound: totalInnerIterations <= theoreticalMax\n  }));\n}\nverifyCartesianLemma();",
      "output": "{\"nodeCount\":7,\"totalInnerIterations\":21,\"theoreticalMax\":21,\"strictlyWithinBound\":true}",
      "codeNotes": [
        "Lines 10-18: Constructs an undirected tree of 7 vertices.",
        "Lines 24-30: Recursively accumulates subtree sizes and increments totalInnerIterations by sz[u] * sz[v].",
        "Line 34: Calculates theoretical maximum C(7, 2) = (7 * 6) / 2 = 21.",
        "Line 40: Confirms empirical totalInnerIterations (21) matches theoreticalMax perfectly."
      ],
      "check": {
        "question": "In the Cartesian Pairwise Sizing Lemma, why is each pair of vertices {x, y} processed at most once across the entire tree traversal?",
        "options": [
          "Because any two vertices in a tree share exactly one unique Lowest Common Ancestor where their branches are merged",
          "Because the garbage collector deletes processed vertices from memory",
          "Because leaf vertices are skipped during depth-first search",
          "Because tree edges are directed from leaves to root in binary heaps"
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "A pair of vertices {x, y} is compared if and only if the algorithm is merging the branch containing x with the branch containing y. This occurs exclusively at u = LCA(x, y). Since LCA is unique for any pair, they are merged at most once."
      }
    },
    # Part 3
    {
      "title": "Subtree Merging Algorithm & In-Place 1D Convolution",
      "say": [
        "In Part 3, we advance from theoretical bounds to high-performance systems implementation: In-Place 1D Vector Convolution for Tree Merging. In Part 1, our implementation utilized an auxiliary nextDP array to stage the merged results before copying them back into dp[u]. While conceptually straightforward, allocating auxiliary arrays at every child merge incurs substantial heap allocation overhead, triggers frequent garbage collection pauses, and degrades CPU cache locality.",
        "In production environments managing large trees, we optimize this convolution to execute in-place using a single 1D array per vertex. Just as in the classical linear 0/1 knapsack problem where iterating capacity in reverse order allows state transitions to be evaluated within a single array without dirty self-overwrites, we can merge child subtree states into the parent's DP table by iterating the parent capacity i in reverse: from maxU down to 1. For each capacity i, we iterate the child capacity j from 1 to maxV, updating dp[u][i + j] = max(dp[u][i + j], dp[u][i] + dp[v][j]).",
        "Let us examine why reverse iteration guarantees algorithmic correctness. If we were to iterate capacity i in forward order (from 1 up to maxU), an update made at capacity i would overwrite dp[u][i + j], and later in the same loop, that newly written value might be read again when processing capacity i + j, effectively allowing child v's items to be selected multiple times! By iterating i backward, any update to dp[u][i + j] writes to an index strictly greater than i, ensuring that the source value dp[u][i] represents the uncorrupted state prior to merging child v.",
        "Furthermore, by setting dp[u][0] = 0 and initializing all other entries to -1 (or -infinity), we maintain strict reachability invariants. An entry dp[u][w] = -1 signifies that it is physically impossible to achieve a capacity utilization of exactly w units within the subtree. During convolution, an update is executed if and only if both dp[u][i] !== -1 and dp[v][j] !== -1. This reachability guard prevents invalid state combinations from polluting the dynamic programming table.",
        "This in-place 1D convolution pattern yields significant memory and speed benefits. Instead of allocating O(N * K) temporary arrays across the traversal, each vertex maintains exactly one static array of length K + 1. Memory is allocated once during DFS entry, and updates operate directly within L1/L2 CPU cache lines. In microbenchmarks, in-place reverse convolution runs up to four times faster than auxiliary array staging, while slashing memory consumption by over seventy percent.",
        "In enterprise database query engines (such as PostgreSQL, CockroachDB, and Presto), this in-place convolution is used in cost-based query optimizers (CBO). When optimizing complex multi-table join trees, the optimizer models join filters and index scans as a tree knapsack problem to balance memory consumption against disk I/O cost. In-place convolution allows the query planner to evaluate thousands of candidate join tree configurations in sub-millisecond planning intervals, selecting optimal physical execution plans without slowing down client SQL transactions."
      ],
      "example": "In an autonomous robotics operating system (ROS 2), onboard compute units allocate real-time sensor processing pipelines arranged in a computational DAG tree. By applying in-place 1D tree convolution, the embedded robot controller recalculates perception module thread priorities in fifty microseconds without triggering dynamic memory allocations.",
      "tryIt": "Examine the TypeScript code below. Trace how the outer loop iterates i backward from maxU down to 1, while j iterates from 1 to maxV, safely updating dp[u][i + j] in-place. Run the code and verify the merged DP table for budget K = 3.",
      "code": "function runInPlaceConvolution() {\n  const n = 5;\n  const k = 3;\n  const values = [5, 8, 12, 14, 7];\n  const adj: number[][] = Array.from({ length: n }, () => []);\n  const edges = [[0, 1], [0, 2], [1, 3], [1, 4]];\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n\n  const sz = new Array(n).fill(1);\n  const dp: number[][] = Array.from({ length: n }, () => new Array(k + 1).fill(-1));\n\n  function dfsMerge(u: number, p: number) {\n    dp[u][1] = values[u];\n    dp[u][0] = 0;\n    sz[u] = 1;\n\n    for (const v of adj[u]) {\n      if (v === p) continue;\n      dfsMerge(v, u);\n\n      const maxU = Math.min(k, sz[u]);\n      const maxV = Math.min(k, sz[v]);\n\n      // Reverse iteration to merge in-place safely\n      for (let i = maxU; i >= 1; i--) {\n        for (let j = 1; j <= maxV && i + j <= k; j++) {\n          if (dp[u][i] !== -1 && dp[v][j] !== -1) {\n            dp[u][i + j] = Math.max(dp[u][i + j], dp[u][i] + dp[v][j]);\n          }\n        }\n      }\n      sz[u] += sz[v];\n    }\n  }\n  dfsMerge(0, -1);\n\n  console.log(JSON.stringify({\n    rootDPTable: dp[0],\n    budget3Max: dp[0][3]\n  }));\n}\nrunInPlaceConvolution();",
      "output": "{\"rootDPTable\":[0,5,17,27],\"budget3Max\":27}",
      "codeNotes": [
        "Line 13: Initializes dp[u] with -1 to track reachability; dp[u][0] = 0 and dp[u][1] = values[u].",
        "Line 24: Iterates parent capacity i in reverse from maxU down to 1.",
        "Lines 25-29: Merges dp[v][j] into dp[u][i + j] without allocating auxiliary arrays.",
        "Line 37: Outputs rootDPTable [0, 5, 17, 27] and budget3Max 27."
      ],
      "check": {
        "question": "Why must the parent capacity loop iterate in reverse order (from maxU down to 1) when performing in-place tree convolution?",
        "options": [
          "To prevent newly updated values at capacity i + j from being read and reused during the same child merge pass",
          "Because tree edges must be traversed in descending topological order",
          "To allow the CPU to execute SIMD vector instructions on backward memory strides",
          "Because negative weights can only be resolved in reverse direction"
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "Iterating backward ensures that when computing dp[u][i + j], the value dp[u][i] represents the uncorrupted state prior to merging child v, preventing child v's items from being selected multiple times."
      }
    },
    # Part 4
    {
      "title": "Euler Tour Flattening to Linear Skip Knapsack",
      "say": [
        "In Part 4, we introduce an alternative, exceptionally elegant architectural perspective on tree knapsacks: Euler Tour Flattening with Subtree Skip Transitions. While subtree convolution operates directly on the branching tree topology, Euler Tour Flattening transforms the tree into a contiguous linear array. This transformation converts the complex hierarchical dependency problem into an ordinary linear knapsack problem over a Directed Acyclic Graph (DAG), yielding optimal O(N * K) time complexity and eliminating recursive convolution loops entirely.",
        "The conceptual foundation rests upon the Euler Tour (pre-order DFS traversal). When we traverse a tree in pre-order, each vertex u is assigned an entry index in[u]. Crucially, because a depth-first search explores the entire subtree of u before returning to u's parent, all vertices residing within u's subtree occupy a contiguous range of indices in the Euler traversal sequence: from in[u] to in[u] + SubtreeSize(u) - 1. The vertex immediately following u's entire subtree in the Euler sequence is located at index in[u] + SubtreeSize(u).",
        "This contiguous interval property enables a binary choice at each step of our dynamic program. Suppose we are considering the vertex located at position i in the Euler sequence (which corresponds to node u). We have exactly two mutually exclusive choices: Option A: We decide NOT to include node u in our knapsack. Because of the ancestral dependency rule, if node u is not included, none of its descendants can ever be included! Therefore, we can immediately SKIP u's entire downward subtree, jumping directly to index skipIndex = i + SubtreeSize(u). Option B: We decide TO include node u in our knapsack. We pay cost[u], receive value[u], and advance to the immediate next position in the Euler sequence: index i + 1. By advancing to i + 1, u's children are now liberated and available to be selected.",
        "To formulate this mathematically, we define dp[i][w] as the maximum value achievable from Euler tour positions i through N given remaining capacity w. The recurrence is evaluated from the end of the Euler tour (i = N - 1) backward to the start (i = 0): dp[i][w] = max(skipVal, takeVal), where skipVal = dp[i + SubtreeSize(u)][w], and takeVal = value[u] + dp[i + 1][w - cost[u]] (valid when w >= cost[u]). Base cases are dp[N][w] = 0 for all w. The optimal answer for the entire tree is simply dp[0][K].",
        "Notice the extraordinary elegance of this recurrence: there are no nested convolution loops! The recurrence consists of exactly one max comparison between two scalar lookups. The state space has size N * K, and each state is computed in constant time O(1). The total time complexity is strictly O(N * K), and the space complexity is O(N * K) (which can easily be reduced to O(K) space if state reconstruction is not required). This formulation represents the gold standard for production tree knapsack implementations.",
        "In enterprise software engineering, Euler Tour Flattening is widely employed in feature toggle management and enterprise permission licensing systems. In large enterprise platforms (such as Salesforce, Workday, or SAP), feature licenses are structured in hierarchical trees: activating an advanced AI analytics module requires licensing the core analytics engine, which in turn requires the enterprise base platform. License configuration engines use Euler tour skip knapsacks to recommend feature bundles that maximize client utility within enterprise procurement budget constraints."
      ],
      "example": "In a cloud virtualization hypervisor, virtual machine provisioning software evaluates CPU core allocations for nested virtualization containers. Using Euler Tour Flattening, the provisioning engine computes the optimal container allocation plan in strict O(N * K) time, avoiding recursive tree merging overhead.",
      "tryIt": "Examine the TypeScript code below. Trace how dfsEuler generates the eulerOrder array and subtree sizes, and how the linear DP table evaluates skipVal vs takeVal. Run the code and verify that optimalBudgetK matches Part 1's result (60).",
      "code": "function runEulerTourKnapsack() {\n  const n = 6;\n  const k = 3;\n  const values = [10, 20, 15, 30, 25, 18];\n  const costs = [1, 1, 1, 1, 1, 1];\n  const adj: number[][] = Array.from({ length: n }, () => []);\n  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n\n  const eulerOrder: number[] = [];\n  const subSize = new Array(n).fill(0);\n\n  function dfsEuler(u: number, p: number) {\n    eulerOrder.push(u);\n    let s = 1;\n    for (const v of adj[u]) {\n      if (v === p) continue;\n      dfsEuler(v, u);\n      s += subSize[v];\n    }\n    subSize[u] = s;\n  }\n  dfsEuler(0, -1);\n\n  // Linear DP table: dp[i][w]\n  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(0));\n\n  for (let i = n - 1; i >= 0; i--) {\n    const node = eulerOrder[i];\n    const c = costs[node];\n    const v = values[node];\n    const skipIndex = i + subSize[node];\n\n    for (let w = 0; w <= k; w++) {\n      // Option A: Skip this node and its entire subtree\n      const skipVal = skipIndex <= n ? dp[skipIndex][w] : 0;\n      let takeVal = 0;\n      // Option B: Take this node and advance to i + 1\n      if (w >= c) {\n        takeVal = v + dp[i + 1][w - c];\n      }\n      dp[i][w] = Math.max(skipVal, takeVal);\n    }\n  }\n\n  console.log(JSON.stringify({\n    eulerOrder,\n    optimalBudgetK: dp[0][k],\n    matchesPart1: dp[0][k] === 60\n  }));\n}\nrunEulerTourKnapsack();",
      "output": "{\"eulerOrder\":[0,1,3,4,2,5],\"optimalBudgetK\":60,\"matchesPart1\":true}",
      "codeNotes": [
        "Lines 13-25: Generates pre-order eulerOrder and records subtree sizes subSize.",
        "Lines 32-34: Computes skipIndex = i + subSize[node], pointing past the entire subtree.",
        "Line 37: Option A: Evaluates skipVal by jumping to skipIndex.",
        "Lines 39-42: Option B: Evaluates takeVal by taking node and advancing to i + 1.",
        "Line 48: Confirms optimalBudgetK matches 60 perfectly."
      ],
      "check": {
        "question": "In the Euler Tour Flattening knapsack formulation, why does skipping a node jump to index i + subSize[u]?",
        "options": [
          "Because all descendants of node u occupy a contiguous block of length subSize[u] in the pre-order traversal",
          "Because Euler tours always double the number of vertices",
          "To allow the algorithm to restart from the tree root",
          "Because leaf vertices have a subtree size of zero"
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "In a pre-order traversal, all nodes in u's subtree appear consecutively immediately following u. Skipping u and its descendants requires advancing past the entire block of size subSize[u]."
      }
    },
    # Part 5
    {
      "title": "Enterprise Application: CloudTreeResourceAllocator",
      "say": [
        "In Part 5, we culminate Day 44 by engineering an industrial-grade enterprise resource management system: the CloudTreeResourceAllocator. In modern cloud-native architectures (such as AWS, Azure, and Google Cloud Platform), microservices are organized into hierarchical dependency trees. Top-level API gateways route traffic to core domain controllers (such as Authentication, Billing, and Catalog), which in turn depend on specialized sub-services (such as OAuth providers, MFA handlers, and ledger engines). Each microservice requires a specific allocation of CPU cores and yields a calibrated Business SLA Utility score.",
        "During high-load flash sales, cyber events, or physical datacenter capacity constraints, cluster administrators face a hard hardware limit: the total available CPU core budget K across a server rack cluster is constrained. The CloudTreeResourceAllocator must compute the optimal subset of microservices to provision such that the aggregate SLA utility score is maximized, total CPU consumption does not exceed K, and no sub-service is ever provisioned without its parent domain dependency being active.",
        "The CloudTreeResourceAllocator implements the high-performance Euler Tour Flattening algorithm mastered in Part 4. During cluster initialization, it registers the service hierarchy, CPU core requirements, and business SLA values. It constructs the pre-order Euler tour, mapping each service node to its contiguous subtree range. Then, it executes the linear DAG skip knapsack dynamic program in strict O(N * K) time.",
        "In addition to computing the optimal aggregate utility score, the allocator performs deterministic state reconstruction. By maintaining a boolean decision matrix choice[i][w] during the backward DP pass, the allocator traces forward from the root to extract the exact list of service IDs selected for deployment. If a domain controller is skipped, the reconstructor instantly jumps past its entire subtree, guaranteeing that dependent microservices are never orphaned.",
        "In production cloud enterprise environments, the CloudTreeResourceAllocator integrates directly with Kubernetes Custom Resource Definitions (CRDs) and Cluster Autoscalers. When node capacity metrics fluctuate, the allocator recalculates the global allocation plan in under two milliseconds, streaming updated deployment manifests to the Kubernetes API server via admission webhooks. This automated optimization eliminates manual operator intervention, guarantees zero dependency violations, and maximizes enterprise operational revenue.",
        "By mastering Subtree Knapsacks, the Cartesian Pairwise Sizing Lemma, In-Place 1D Convolution, and Euler Tour Flattening, software architects possess the complete mathematical and algorithmic foundation required to solve complex hierarchical allocation problems at hyperscale. The CloudTreeResourceAllocator stands as an unyielding testament to the power of advanced algorithmic optimization in modern enterprise cloud computing."
      ],
      "example": "In a global e-commerce platform preparing for Black Friday peak traffic, infrastructure engineers allocate six thousand CPU cores across three hundred microservices organized hierarchically. The CloudTreeResourceAllocator computes the exact provisioning plan in four milliseconds, maximizing transaction processing capacity while enforcing strict service dependencies.",
      "tryIt": "Explore the CloudTreeResourceAllocator class below. Trace how registerService adds services with CPU costs and SLA values, how optimizeAllocation flattens the tree via Euler tour, executes linear skip DP, and reconstructs selected service IDs. Run the code and inspect the generated allocation plan.",
      "code": "interface ServiceNode {\n  id: number;\n  name: string;\n  cpuCoresRequired: number;\n  businessSlaValue: number;\n}\n\ninterface AllocationPlan {\n  totalBudgetCPU: number;\n  allocatedCPU: number;\n  totalSlaScore: number;\n  selectedServiceIds: number[];\n}\n\nclass CloudTreeResourceAllocator {\n  private n: number;\n  private services: ServiceNode[];\n  private adj: number[][];\n\n  constructor(serviceCount: number) {\n    this.n = serviceCount;\n    this.services = [];\n    this.adj = Array.from({ length: serviceCount }, () => []);\n  }\n\n  public registerService(id: number, name: string, cpuCores: number, slaValue: number): void {\n    this.services[id] = { id, name, cpuCoresRequired: cpuCores, businessSlaValue: slaValue };\n  }\n\n  public addDependency(parentId: number, childId: number): void {\n    this.adj[parentId].push(childId);\n  }\n\n  public optimizeAllocation(maxCpuBudget: number): AllocationPlan {\n    // 1. Euler Tour Flattening\n    const euler: number[] = [];\n    const subSize = new Array(this.n).fill(0);\n\n    const dfs = (u: number) => {\n      euler.push(u);\n      let count = 1;\n      for (const v of this.adj[u]) {\n        dfs(v);\n        count += subSize[v];\n      }\n      subSize[u] = count;\n    };\n    dfs(0);\n\n    // 2. Linear DAG Knapsack\n    const dp: number[][] = Array.from({ length: this.n + 1 }, () => new Array(maxCpuBudget + 1).fill(0));\n    const choice: boolean[][] = Array.from({ length: this.n + 1 }, () => new Array(maxCpuBudget + 1).fill(false));\n\n    for (let i = this.n - 1; i >= 0; i--) {\n      const u = euler[i];\n      const cost = this.services[u].cpuCoresRequired;\n      const val = this.services[u].businessSlaValue;\n      const skipIdx = i + subSize[u];\n\n      for (let w = 0; w <= maxCpuBudget; w++) {\n        const skipVal = skipIdx <= this.n ? dp[skipIdx][w] : 0;\n        let takeVal = -1;\n        if (w >= cost) {\n          takeVal = val + dp[i + 1][w - cost];\n        }\n\n        if (takeVal > skipVal) {\n          dp[i][w] = takeVal;\n          choice[i][w] = true;\n        } else {\n          dp[i][w] = skipVal;\n          choice[i][w] = false;\n        }\n      }\n    }\n\n    // 3. Reconstruct selection\n    const selected: number[] = [];\n    let currIdx = 0;\n    let currBudget = maxCpuBudget;\n    while (currIdx < this.n && currBudget > 0) {\n      if (choice[currIdx][currBudget]) {\n        const u = euler[currIdx];\n        selected.push(u);\n        currBudget -= this.services[u].cpuCoresRequired;\n        currIdx++;\n      } else {\n        currIdx += subSize[euler[currIdx]];\n      }\n    }\n\n    const allocatedCpu = selected.reduce((sum, id) => sum + this.services[id].cpuCoresRequired, 0);\n\n    return {\n      totalBudgetCPU: maxCpuBudget,\n      allocatedCPU: allocatedCpu,\n      totalSlaScore: dp[0][maxCpuBudget],\n      selectedServiceIds: selected\n    };\n  }\n}\n\nconst allocator = new CloudTreeResourceAllocator(6);\nallocator.registerService(0, \"Gateway-Proxy\", 2, 50);\nallocator.registerService(1, \"Auth-Domain\", 2, 40);\nallocator.registerService(2, \"Billing-Domain\", 3, 45);\nallocator.registerService(3, \"OAuth-Subservice\", 1, 30);\nallocator.registerService(4, \"MFA-Subservice\", 2, 25);\nallocator.registerService(5, \"Ledger-Subservice\", 2, 35);\n\nallocator.addDependency(0, 1);\nallocator.addDependency(0, 2);\nallocator.addDependency(1, 3);\nallocator.addDependency(1, 4);\nallocator.addDependency(2, 5);\n\nconst plan = allocator.optimizeAllocation(6);\nconsole.log(JSON.stringify(plan));",
      "output": "{\"totalBudgetCPU\":6,\"allocatedCPU\":5,\"totalSlaScore\":120,\"selectedServiceIds\":[0,1,3]}",
      "codeNotes": [
        "Lines 15-24: Manages service metadata (CPU cores, SLA value) and dependency adjacency.",
        "Lines 30-41: Linearizes tree into euler tour and records subtree sizes.",
        "Lines 44-67: Executes linear DAG knapsack evaluating skipIdx vs i + 1.",
        "Lines 70-82: Traces choice matrix forward to extract selectedServiceIds [0, 1, 3].",
        "Line 104: Outputs allocation plan achieving 120 SLA score using 5 CPU cores."
      ],
      "check": {
        "question": "How does the CloudTreeResourceAllocator enforce the dependency rule that a sub-service can only be provisioned if its parent domain is active?",
        "options": [
          "By jumping past the entire subtree when a parent node is skipped, ensuring children can only be evaluated if the parent was selected",
          "By running an asynchronous garbage collector after all services are deployed",
          "By forcing all child services to have zero CPU cost",
          "By deploying all microservices in separate Kubernetes namespaces"
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "In Euler tour skip DP, choosing not to take a parent node advances the evaluation index to i + subSize[u], skipping all of its children completely and guaranteeing that no child can ever be provisioned without its parent."
      }
    }
  ]
}

with open("scripts/branch_c/day44_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day44, f, indent=2)

print("day44_lesson.json successfully generated.")
