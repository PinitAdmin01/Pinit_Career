# scripts/branch_c/build_day41_full.py
import json

part1_say = [
    "Welcome to Day 41 of Advanced Data Structures and Algorithmic Optimization. Today we inaugurate Month 2 Block 9, dedicated to one of the most powerful and mathematically profound paradigms in computer science: Dynamic Programming on Trees. In linear sequence dynamic programming, we traversed one-dimensional arrays or two-dimensional matrices, exploiting the linear ordering of indices. However, enterprise computing problems—such as distributed cloud network topologies, organizational corporate hierarchies, DOM abstract syntax trees, and infrastructure routing backbones—are structured as trees. A tree is a connected, acyclic undirected graph possessing N vertices and exactly N minus 1 edges. The absence of cycles imparts a deeply elegant topological property: removing any vertex or edge partitions the tree into completely independent, mutually disjoint connected subtrees.",
    "This structural independence provides the foundational prerequisite for dynamic programming: optimal substructure and overlapping subproblems without cyclic interference. When we designate an arbitrary vertex as the root of the tree, we impose a natural parent-child orientation. For every vertex u, its descendants form an isolated rooted subtree, denoted Subtree(u). The optimal solution to an algorithmic optimization problem on Subtree(u) depends exclusively on the optimal solutions of the subtrees rooted at its immediate children. Because subtrees of distinct children share zero vertices and zero edges, their solutions can be computed independently and coalesced upward through mathematical recurrence relations.",
    "The computational execution engine of tree dynamic programming is the Depth-First Search (DFS) post-order traversal. In a pre-order traversal, a vertex is processed before its descendants; conversely, in post-order traversal, a vertex u is evaluated strictly after all of its children have completed their recursive traversals. When the recursive DFS call returns from child vertex v to parent vertex u, the DP table entries for v—representing the optimal sub-solutions for the entire subtree under v—are guaranteed to be fully computed, memoized, and immutable. Parent vertex u aggregates these child values in O(deg(u)) time, where deg(u) is the out-degree of vertex u. Summing the work across all vertices yields a strictly deterministic linear running time of O(N) over the entire tree.",
    "Let us examine the memory architecture and cache locality of tree dynamic programming. In an unrooted tree represented as an adjacency list, traversing the graph requires maintaining a visited array or simply passing the parent identifier down the recursive call stack: dfs(u, parent). By enforcing that the recursive traversal never revisits parent, we eliminate the need for dynamic visited sets or cycle detection overhead. The recursive call stack depth is bounded by the height of the tree H, requiring O(H) stack memory, which ranges from O(log N) in balanced trees to O(N) in degenerate chain graphs. The DP state tables are allocated as flat contiguous primitive arrays indexed by vertex ID, providing near-optimal CPU cache line reuse during the upward aggregation sweep.",
    "In enterprise distributed systems engineering, mastering subtree invariants is foundational for capacity planning, hierarchical power optimization, and multi-tenant quota enforcement. Whether calculating total compute demand across a Kubernetes cluster tree, aggregating network bandwidth metrics along fiber distribution switches, or pruning idle branches in massive enterprise organizational graphs, post-order tree DP provides provably optimal linear time complexity, establishing the bedrock for the advanced rerooting and tree knapsack techniques we will conquer across Block 9."
]

part1_code = """export function computeSubtreeSizes(adj: number[][], root = 0): { sizes: number[]; order: number[] } {
  const n = adj.length;
  const sizes = new Array<number>(n).fill(0);
  const order: number[] = [];

  function dfs(u: number, parent: number): void {
    sizes[u] = 1;
    for (const v of adj[u]) {
      if (v !== parent) {
        dfs(v, u);
        sizes[u] += sizes[v];
      }
    }
    order.push(u);
  }

  dfs(root, -1);
  return { sizes, order };
}

const sampleTree = [
  [1, 2],
  [0, 3, 4],
  [0],
  [1],
  [1],
];
const { sizes, order } = computeSubtreeSizes(sampleTree, 0);
console.log(`Subtree sizes: [${sizes.join(", ")}]`);
console.log(`Post-order traversal: [${order.join(", ")}]`);"""

part1_output = """Subtree sizes: [5, 3, 1, 1, 1]
Post-order traversal: [3, 4, 1, 2, 0]"""

part1_example = "In an enterprise datacenter managing five hundred thousand server racks, cooling engineers optimize heating, ventilation, and air conditioning (HVAC) power consumption across a hierarchical power distribution tree. Each substation feeds several distribution units, which in turn feed individual server rows. By executing a post-order tree dynamic programming pass, the telemetry engine aggregates localized thermal dissipation metrics from leaf server racks up to primary substations in three milliseconds, dynamically balancing cooling output across the facility."

part1_tryIt = "Examine the computeSubtreeSizes function below. Trace how the recursive dfs method initializes the size of vertex u to 1, traverses every unvisited child v, and accumulates sizes[v] into sizes[u]. Notice how order.push(u) executes strictly after all children have returned, recording the exact post-order evaluation sequence. Run the script and observe the resulting subtree sizes and traversal order printed to the console."

part1_check = {
    "question": "Why does Dynamic Programming on Trees guarantee strictly linear O(N) time complexity using post-order DFS traversal?",
    "options": [
        "Because subtrees of children are completely disjoint and acyclic, allowing each vertex to aggregate child DP values in time proportional to its degree without re-evaluating subproblems",
        "Because trees can always be flattened into sorted arrays using comparison sorting in O(N log N) time",
        "Because trees have no edges and therefore require zero graph traversal steps",
        "Because tree DP converts all vertex weights into 32-bit floating point numbers that can be summed with SIMD instructions"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "In a rooted tree, removing the root partitions the graph into completely disjoint subtrees. In a post-order traversal, each vertex aggregates precomputed results from its children in O(deg(u)) time. The sum of degrees across all vertices in a tree is 2(N - 1), yielding deterministic O(N) overall execution."
}

part2_say = [
    "In Part 2, we tackle the canonical benchmark of tree dynamic programming: the Maximum Independent Set on Trees (MIS). Given an undirected graph G equals (V, E) where each vertex v has a non-negative weight w(v), an independent set is a subset of vertices S such that no two vertices in S are adjacent (connected by an edge). The Maximum Independent Set problem seeks to select an independent set of maximum total weight. On arbitrary graphs, Maximum Independent Set is one of Karp's 21 NP-hard problems, possessing no known polynomial-time solution and being notoriously difficult to approximate. However, on trees, the acyclic structure allows us to solve the weighted Maximum Independent Set problem in strictly linear O(N) time!",
    "To formulate the tree dynamic programming recurrence, we define a two-state DP table for every vertex u. Because vertex u can either be included in the independent set or excluded from it, we define two state values: DP_taken[u], representing the maximum weight achievable in the subtree rooted at u given that vertex u IS selected; and DP_notTaken[u], representing the maximum weight achievable in the subtree rooted at u given that vertex u is NOT selected.",
    "Let us derive the exact state transition equations. First, consider the scenario where vertex u is included in the independent set (DP_taken[u]). Under the fundamental independence constraint, if vertex u is selected, none of its immediate neighbors can be selected. Therefore, for every child v of u, vertex v CANNOT be included in the independent set! Consequently, child v must contribute its non-selected state, DP_notTaken[v]. Summing over all children and adding the intrinsic weight of vertex u yields: DP_taken[u] equals weight[u] plus the summation over all children v of DP_notTaken[v].",
    "Next, consider the scenario where vertex u is NOT included in the independent set (DP_notTaken[u]). Because vertex u is not selected, the independence constraint imposes zero restrictions on its children! For each child v, we are completely free to either include child v or exclude child v, whichever yields the superior total weight in child v's subtree. Because the subtrees of distinct children are completely disjoint, we can optimize the choice for each child independently! Therefore, for each child v, we take the maximum of DP_taken[v] and DP_notTaken[v]. Summing over all children yields: DP_notTaken[u] equals the summation over all children v of the maximum of DP_taken[v] and DP_notTaken[v].",
    "The base case occurs naturally at the leaf vertices: for a leaf node L possessing no children, DP_taken[L] equals weight[L], and DP_notTaken[L] equals zero. As the post-order DFS ascends from the leaves to the root, every vertex evaluates its two state values in O(deg(u)) time. Finally, the maximum weight of an independent set across the entire tree is simply the maximum of DP_taken[root] and DP_notTaken[root]. To reconstruct the actual subset of selected vertices, we execute a second linear top-down traversal from the root, recording whether each vertex was included or excluded based on the precomputed DP decisions."
]

part2_code = """export interface MISResult {
  maxWeight: number;
  dpNotTaken: number[];
  dpTaken: number[];
}

export function maxIndependentSetTree(adj: number[][], weights: number[], root = 0): MISResult {
  const n = adj.length;
  const dpNotTaken = new Array<number>(n).fill(0);
  const dpTaken = new Array<number>(n).fill(0);

  function dfs(u: number, parent: number): void {
    dpTaken[u] = weights[u];
    dpNotTaken[u] = 0;

    for (const v of adj[u]) {
      if (v !== parent) {
        dfs(v, u);
        dpTaken[u] += dpNotTaken[v];
        dpNotTaken[u] += Math.max(dpTaken[v], dpNotTaken[v]);
      }
    }
  }

  dfs(root, -1);
  const maxWeight = Math.max(dpTaken[root], dpNotTaken[root]);
  return { maxWeight, dpNotTaken, dpTaken };
}

const sampleTree = [
  [1, 2],
  [0, 3, 4],
  [0],
  [1],
  [1],
];
const nodeWeights = [10, 5, 8, 7, 6];
const misResult = maxIndependentSetTree(sampleTree, nodeWeights, 0);
console.log(`Weights: [${nodeWeights.join(", ")}]`);
console.log(`Maximum Independent Set Weight: ${misResult.maxWeight}`);
console.log(`Root Taken: ${misResult.dpTaken[0]}, Root Not Taken: ${misResult.dpNotTaken[0]}`);"""

part2_output = """Weights: [10, 5, 8, 7, 6]
Maximum Independent Set Weight: 23
Root Taken: 23, Root Not Taken: 21"""

part2_example = "In a telecommunications cellular network spanning a mountainous geographic region, radio engineers deploy base station towers connected via microwave line-of-sight tree links. Due to co-channel radio interference, two adjacent connected towers cannot transmit simultaneously on the identical primary carrier frequency. By modeling the microwave network as a tree with population coverage weights, network controllers compute the weighted Maximum Independent Set in under two milliseconds, maximizing regional population coverage without wireless packet collisions."

part2_tryIt = "Examine the maxIndependentSetTree function below. Follow how the recursive dfs computes dpTaken[u] and dpNotTaken[u]. Notice how selecting node u forces each child v to contribute dpNotTaken[v], while skipping node u allows each child v to contribute Math.max(dpTaken[v], dpNotTaken[v]). Run the code with the sample weighted tree and verify the maximum weight of 23 computed at the root."

part2_check = {
    "question": "In the Maximum Independent Set on Trees recurrence, why does DP_notTaken[u] equal the sum of Math.max(DP_taken[v], DP_notTaken[v]) across all children v?",
    "options": [
        "Because excluding parent vertex u relieves all independence constraints on its children, allowing each child v's subtree to independently choose the optimal state (taken or not taken)",
        "Because excluding parent vertex u forces all children to be included in the independent set simultaneously",
        "Because independent sets require all leaf nodes to have equal weights",
        "Because tree DP cannot process vertices with odd degrees without balancing adjustments"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "When vertex u is not selected, its children are not constrained by an edge to an active node. Since the subtrees of distinct children are disjoint, each child can independently choose whichever state (taken or not taken) yields higher weight, and their optimal values are summed."
}

part3_say = [
    "In Part 3, we expand our tree dynamic programming toolkit to encompass Subtree Aggregations and Tree Centroid Discovery. Beyond computing binary selection states like independent sets, enterprise graph processing frequently requires aggregating structural metrics across subtrees: computing subtree vertex counts, weighted subtree resource demands, path depth sums, and topological centers of mass. These metrics form the computational foundation for load balancing, query routing, and divide-and-conquer tree partitioning.",
    "Let us formalize the Tree Centroid. In an unrooted tree of N vertices, a vertex C is defined as a centroid if and only if removing vertex C splits the tree into a forest of connected components such that no resulting component has a size strictly greater than floor(N / 2). A fundamental theorem of graph theory asserts that every tree possesses at least one centroid and at most two centroids; if two centroids exist, they are directly connected by an edge. Centroid discovery is a critical milestone because finding the centroid allows us to partition the tree into balanced subcomponents, guaranteeing logarithmic recursion depth in divide-and-conquer algorithms.",
    "To locate the centroid in strictly linear O(N) time, we execute a single post-order DFS to compute subtree sizes. Let size[u] denote the total number of vertices in Subtree(u) when the tree is arbitrarily rooted at vertex 0. Now consider any candidate vertex u. If vertex u is removed from the tree, what are the sizes of the resulting connected components? For every child v of u in the rooted orientation, the component corresponding to child v has size exactly equal to size[v]. Furthermore, the remainder of the tree—representing the ancestors and sibling branches above u—forms a single connected component whose size is exactly N minus size[u]!",
    "Therefore, vertex u is a centroid if and only if two simultaneous mathematical conditions are met: first, for every child v of u, size[v] must be less than or equal to floor(N / 2); and second, the upper component size, N minus size[u], must be less than or equal to floor(N / 2). If any child v violates this condition by having size[v] strictly greater than floor(N / 2), the centroid cannot possibly be u or any vertex outside v's subtree; the centroid is guaranteed to lie deeper inside the subtree of child v. By evaluating these conditions, a single DFS scan pinpoints the centroid in deterministic O(N) time.",
    "In enterprise distributed database architecture and consensus engine design, tree centroids play a pivotal operational role. When deploying a consensus cluster (such as Raft or Paxos) across a hierarchical multi-rack datacenter network, selecting the coordinator node at the topological tree centroid minimizes worst-case network latency to all participating replica nodes. Furthermore, Centroid Decomposition—recursively finding centroids to build a balanced centroid tree of depth O(log N)—enables enterprise search engines to answer distance queries, path-bounded aggregations, and lowest common ancestor lookups in O(log N) time per query."
]

part3_code = """export function findTreeCentroids(adj: number[][]): number[] {
  const n = adj.length;
  const sizes = new Array<number>(n).fill(0);
  const centroids: number[] = [];

  function dfsSize(u: number, parent: number): void {
    sizes[u] = 1;
    for (const v of adj[u]) {
      if (v !== parent) {
        dfsSize(v, u);
        sizes[u] += sizes[v];
      }
    }
  }

  dfsSize(0, -1);

  function dfsCentroid(u: number, parent: number): void {
    let isCentroid = true;
    for (const v of adj[u]) {
      if (v !== parent) {
        dfsCentroid(v, u);
        if (sizes[v] > Math.floor(n / 2)) {
          isCentroid = false;
        }
      }
    }
    if (n - sizes[u] > Math.floor(n / 2)) {
      isCentroid = false;
    }
    if (isCentroid) {
      centroids.push(u);
    }
  }

  dfsCentroid(0, -1);
  return centroids;
}

const sampleTree = [
  [1, 2],
  [0, 3, 4],
  [0],
  [1],
  [1],
];
const centroids = findTreeCentroids(sampleTree);
console.log(`Tree Centroid(s): [${centroids.join(", ")}]`);"""

part3_output = """Tree Centroid(s): [1]"""

part3_example = "In an enterprise globally distributed distributed database cluster deployed across cloud regions, the cluster leader coordinates distributed transactions across twenty regional nodes connected via dedicated low-latency backbones. By identifying the tree centroid of the inter-datacenter network topology, the cluster provisioning system automatically designates the leader node at vertex 1, reducing 99th-percentile commit latency by thirty-five percent across transatlantic consensus rounds."

part3_tryIt = "Examine the findTreeCentroids implementation below. Trace how dfsSize first computes subtree node counts, and how dfsCentroid tests both child component sizes and the ancestor component size N - sizes[u] against Math.floor(n / 2). Run the script with the 5-node sample tree and observe that vertex 1 is identified as the unique balanced centroid."

part3_check = {
    "question": "What mathematical property characterizes a tree centroid vertex C in an unrooted tree of N vertices?",
    "options": [
        "Removing vertex C partitions the tree into connected components such that no component has size strictly greater than floor(N / 2)",
        "Vertex C has the maximum degree among all vertices in the graph",
        "Vertex C is directly connected to all leaf nodes in the tree",
        "Vertex C has an equal number of odd and even vertex neighbors"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "By definition, a tree centroid is a vertex whose removal leaves no connected component of size greater than floor(N / 2). This guarantees that centroid decomposition divides the tree into balanced subproblems with maximum depth O(log N)."
}

part4_say = [
    "In Part 4, we examine the structural duality between Maximum Independent Set and Minimum Vertex Cover on Trees. In graph theory, a vertex cover is a subset of vertices C such that every edge in the graph has at least one endpoint in C. The Minimum Vertex Cover problem seeks to select a vertex cover of minimum possible cardinality or total weight. Like Maximum Independent Set, Minimum Vertex Cover is NP-hard on general graphs. However, on trees, we can either solve it directly using a two-state tree dynamic programming recurrence, or derive it instantly using Gallai's Theorem.",
    "Let us explore Gallai's Theorem (1959), one of the fundamental duality theorems in combinatorial optimization. Gallai proved that for any graph G with N vertices and no isolated vertices, the size of the Maximum Independent Set plus the size of the Minimum Vertex Cover equals exactly the total number of vertices: MIS(G) plus MVC(G) equals N! The intuition is immediate: if S is an independent set, no two vertices in S share an edge; therefore, every edge in G must have at least one endpoint lying outside of S. Consequently, the complement set V minus S forms a valid vertex cover! To minimize the size of the vertex cover, we must maximize the size of the independent set.",
    "Now let us derive the direct tree dynamic programming formulation for Minimum Vertex Cover. For each vertex u, we define two states: DP_cover[u], the minimum vertex cover size in Subtree(u) given that vertex u IS included in the cover; and DP_notCover[u], the minimum vertex cover size in Subtree(u) given that vertex u is NOT included in the cover.",
    "Consider the transition equations. If vertex u is NOT included in the vertex cover (DP_notCover[u]), consider every edge connecting u to its children v. Because vertex u is not in the cover, the only way to cover the edge (u, v) is for child vertex v to be included in the cover! There is zero choice: child v MUST be in the cover. Therefore, DP_notCover[u] equals the summation over all children v of DP_cover[v].",
    "Conversely, if vertex u IS included in the vertex cover (DP_cover[u]), vertex u successfully covers all edges (u, v) incident to its children! Consequently, for each child v, we are free to either include child v or exclude child v. To minimize the cover, we choose the minimum value for each child: DP_cover[u] equals 1 (for selecting u) plus the summation over all children v of the minimum of DP_cover[v] and DP_notCover[v]. Running this post-order DFS on our sample 5-node tree yields a minimum vertex cover of size 2. Because the maximum independent set has size 3, MIS plus MVC equals 3 plus 2 equals 5, perfectly validating Gallai's duality theorem."
]

part4_code = """export interface MVCResult {
  minCoverSize: number;
  dpNotCover: number[];
  dpCover: number[];
}

export function minVertexCoverTree(adj: number[][], root = 0): MVCResult {
  const n = adj.length;
  const dpNotCover = new Array<number>(n).fill(0);
  const dpCover = new Array<number>(n).fill(0);

  function dfs(u: number, parent: number): void {
    dpCover[u] = 1;
    dpNotCover[u] = 0;

    for (const v of adj[u]) {
      if (v !== parent) {
        dfs(v, u);
        dpNotCover[u] += dpCover[v];
        dpCover[u] += Math.min(dpCover[v], dpNotCover[v]);
      }
    }
  }

  dfs(root, -1);
  const minCoverSize = Math.min(dpCover[root], dpNotCover[root]);
  return { minCoverSize, dpNotCover, dpCover };
}

const sampleTree = [
  [1, 2],
  [0, 3, 4],
  [0],
  [1],
  [1],
];
const mvcResult = minVertexCoverTree(sampleTree, 0);
console.log(`Minimum Vertex Cover Size: ${mvcResult.minCoverSize}`);
console.log(`Duality Check: MIS (${5 - mvcResult.minCoverSize}) + MVC (${mvcResult.minCoverSize}) = Total Nodes (5)`);"""

part4_output = """Minimum Vertex Cover Size: 2
Duality Check: MIS (3) + MVC (2) = Total Nodes (5)"""

part4_example = "In an enterprise corporate campus facility security system, security engineers deploy surveillance cameras along tree-like building corridor networks. To guarantee complete video surveillance, every hallway connecting two junction corridors must be monitored by at least one camera positioned at an adjacent junction. By formulating the problem as a Minimum Vertex Cover on the corridor tree, the facility team identifies the minimum number of cameras needed to monitor all hallways, reducing hardware capital expenditure by forty percent."

part4_tryIt = "Examine the minVertexCoverTree implementation below. Trace how dpNotCover[u] sums dpCover[v] because excluding u forces every child v into the cover. Follow how dpCover[u] adds 1 and sums Math.min(dpCover[v], dpNotCover[v]). Run the snippet and verify that the minimum cover size of 2 satisfies Gallai's duality relation with the 3-node maximum independent set."

part4_check = {
    "question": "According to Gallai's Theorem and tree duality, how does the Minimum Vertex Cover relate to the Maximum Independent Set in a tree of N vertices?",
    "options": [
        "The complement of any Maximum Independent Set is a Minimum Vertex Cover, and their cardinalities satisfy MIS + MVC = N",
        "The Minimum Vertex Cover is always twice the size of the Maximum Independent Set",
        "The Minimum Vertex Cover and Maximum Independent Set always contain the identical set of vertices",
        "Gallai's Theorem only applies to complete graphs and fails on trees"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "In any graph, if S is an independent set, no two vertices in S share an edge; thus, every edge has at least one endpoint in V \\ S, meaning V \\ S is a vertex cover. Maximizing |S| directly minimizes |V \\ S|, establishing that |MIS| + |MVC| = N."
}

part5_say = [
    "In Part 5, we culminate Day 41 by engineering an industrial-grade enterprise role allocator: the TreeRoleAllocationEngine. In modern cloud-native datacenter fabrics and microservice clusters, infrastructure nodes are organized into a strict hierarchical topology: datacenter regions encompass availability zones, availability zones contain network aggregation switches, aggregation switches feed top-of-rack (ToR) switches, and ToR switches connect physical bare-metal worker hosts. In such multi-tiered systems, deploying high-availability services—such as distributed database leader nodes, Kafka cluster controllers, or monitoring sidecars—imposes strict fault domain isolation rules.",
    "Specifically, to prevent catastrophic single-point-of-failure cascades, two primary controller roles must never be allocated to adjacent or directly connected infrastructure nodes (for example, placing two active database primaries on the same physical host or top-of-rack switch). At the same time, different infrastructure nodes possess varying compute capacities (measured in GFLOPS, CPU cores, or RAM). The cluster orchestrator must solve a weighted Maximum Independent Set on the cluster tree: selecting a subset of non-adjacent nodes that maximizes total compute capacity while strictly enforcing fault domain isolation.",
    "Our TreeRoleAllocationEngine encapsulates this optimization into a production-grade, object-oriented pipeline. When instantiated with the cluster topology adjacency list and a registry of ServiceNode objects (detailing node name, compute capacity in GFLOPS, and failure domain identifier), the engine executes the two-state tree dynamic programming recurrence developed in Part 2. It computes the maximum achievable capacity and performs a deterministic top-down reconstruction traversal to extract the exact list of chosen node identifiers.",
    "Let us examine the sample execution output. In our 5-node cluster topology representing a core switch (Node 0, 100 GFLOPS), north aggregation switch (Node 1, 50 GFLOPS), south switch (Node 2, 80 GFLOPS), and worker hosts (Node 3, 70 GFLOPS; Node 4, 60 GFLOPS), the engine evaluates all trade-offs. Selecting Node 0 (capacity 100) precludes selecting Node 1 and Node 2. However, with Node 1 excluded, both Node 3 (70 GFLOPS) and Node 4 (60 GFLOPS) can be selected simultaneously! The engine selects Nodes 0, 3, and 4, achieving an optimal total capacity of 230 GFLOPS with zero adjacent controller conflicts.",
    "In enterprise production environments, the TreeRoleAllocationEngine integrates directly into Kubernetes custom schedulers and cloud resource managers. By executing in strictly linear O(N) time with minimal memory allocations, the engine can recompute optimal role assignments across hundred-thousand-node cluster trees in under fifteen milliseconds during node failure events, enabling autonomous self-healing cloud infrastructure that maintains peak availability without human operator intervention."
]

part5_code = """export interface ServiceNode {
  id: number;
  name: string;
  computeCapacityGflops: number;
  failureDomain: string;
}

export interface AllocationPlan {
  totalCapacity: number;
  selectedNodeIds: number[];
  selectedNodes: ServiceNode[];
}

export class TreeRoleAllocationEngine {
  private nodes = new Map<number, ServiceNode>();

  constructor(private adj: number[][], nodeList: ServiceNode[]) {
    nodeList.forEach((n) => this.nodes.set(n.id, n));
  }

  public computeOptimalPrimaryPlacements(root = 0): AllocationPlan {
    const n = this.adj.length;
    const weights = new Array<number>(n).fill(0);
    for (let i = 0; i < n; i++) {
      weights[i] = this.nodes.get(i)?.computeCapacityGflops ?? 1;
    }

    const { maxWeight, dpTaken, dpNotTaken } = maxIndependentSetTree(this.adj, weights, root);

    const selected = new Set<number>();

    function reconstruct(this: TreeRoleAllocationEngine, u: number, parent: number, parentSelected: boolean): void {
      if (!parentSelected && dpTaken[u] > dpNotTaken[u]) {
        selected.add(u);
        for (const v of this.adj[u]) {
          if (v !== parent) reconstruct.call(this, v, u, true);
        }
      } else {
        for (const v of this.adj[u]) {
          if (v !== parent) reconstruct.call(this, v, u, false);
        }
      }
    }

    reconstruct.call(this, root, -1, false);

    const selectedIds = Array.from(selected).sort((a, b) => a - b);
    const selectedNodes = selectedIds.map((id) => this.nodes.get(id)!);

    return {
      totalCapacity: maxWeight,
      selectedNodeIds: selectedIds,
      selectedNodes,
    };
  }
}

const clusterNodes: ServiceNode[] = [
  { id: 0, name: "Core-Switch-Primary", computeCapacityGflops: 100, failureDomain: "rack-0" },
  { id: 1, name: "Agg-Switch-North", computeCapacityGflops: 50, failureDomain: "rack-1" },
  { id: 2, name: "Agg-Switch-South", computeCapacityGflops: 80, failureDomain: "rack-2" },
  { id: 3, name: "Host-Worker-01", computeCapacityGflops: 70, failureDomain: "rack-1" },
  { id: 4, name: "Host-Worker-02", computeCapacityGflops: 60, failureDomain: "rack-1" },
];

const allocator = new TreeRoleAllocationEngine(sampleTree, clusterNodes);
const plan = allocator.computeOptimalPrimaryPlacements(0);
console.log(`Optimal Compute Capacity: ${plan.totalCapacity} GFLOPS`);
console.log(`Selected Primary Controller Nodes: [${plan.selectedNodeIds.join(", ")}]`);
for (const node of plan.selectedNodes) {
  console.log(`  -> Node ${node.id} (${node.name}): Capacity=${node.computeCapacityGflops} GFLOPS [Domain: ${node.failureDomain}]`);
}"""

part5_output = """Optimal Compute Capacity: 230 GFLOPS
Selected Primary Controller Nodes: [0, 3, 4]
  -> Node 0 (Core-Switch-Primary): Capacity=100 GFLOPS [Domain: rack-0]
  -> Node 3 (Host-Worker-01): Capacity=70 GFLOPS [Domain: rack-1]
  -> Node 4 (Host-Worker-02): Capacity=60 GFLOPS [Domain: rack-1]"""

part5_example = "In an enterprise multi-tenant financial cloud running hundreds of microservices, cloud operations teams deploy primary database replicas across bare-metal server trees. To meet banking compliance mandates and ensure continuous availability during rack power outages, no two primary database replicas can reside in adjacent failure domains. The TreeRoleAllocationEngine computes optimal replica placements across twenty thousand servers in eight milliseconds, maximizing system transaction processing power."

part5_tryIt = "Explore the TreeRoleAllocationEngine class below. Trace how computeOptimalPrimaryPlacements maps compute capacities into node weights, runs the two-state tree DP, and executes recursive reconstruction to identify the exact optimal subset. Run the snippet to verify that nodes 0, 3, and 4 are selected, achieving the maximum capacity of 230 GFLOPS."

part5_check = {
    "question": "How does the TreeRoleAllocationEngine guarantee fault domain isolation while maximizing cluster compute throughput?",
    "options": [
        "By modeling the infrastructure hierarchy as a tree and solving weighted Maximum Independent Set in linear O(N) time to prevent adjacent controller placement",
        "By assigning all primary roles randomly to leaf nodes in the network",
        "By duplicating every primary service onto all connected nodes simultaneously",
        "By converting the cluster topology into a directed acyclic graph and executing topological sort"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The engine models the datacenter hierarchy as a tree and executes weighted Maximum Independent Set DP. This guarantees in strictly linear O(N) time that no two selected primary nodes are adjacent, eliminating single-point-of-failure cascades while maximizing aggregate compute capacity."
}

# Root projectStep & summary
project_step = {
    "title": "Industrial Case Study: Enterprise Hierarchical Infrastructure Role Allocation & Fault Domain Isolation Engine",
    "steps": [
        "Formulate cluster topology as an unrooted tree graph with non-negative compute capacity weights across all nodes.",
        "Implement post-order DFS subtree sizing to establish the execution order for bottom-up dynamic programming.",
        "Derive and execute two-state Maximum Independent Set recurrence (DP_taken and DP_notTaken) in deterministic linear O(N) time.",
        "Validate topological duality by verifying that Minimum Vertex Cover and Maximum Independent Set satisfy Gallai's Theorem.",
        "Synthesize TreeRoleAllocationEngine to perform top-down decision reconstruction and deploy non-interfering controller roles across enterprise clouds."
    ]
}

summary = [
    "A tree is an acyclic connected graph where removing any vertex decomposes the graph into completely disjoint subtrees.",
    "Dynamic programming on trees executes in linear O(N) time via post-order DFS, evaluating leaves before aggregating child states upward.",
    "Maximum Independent Set on Trees uses a two-state recurrence (taken vs not taken) to select non-adjacent vertices of maximum total weight.",
    "A tree centroid is a balance point whose removal leaves no connected component larger than floor(N / 2), discoverable in linear O(N) time.",
    "By Gallai's Theorem, Maximum Independent Set and Minimum Vertex Cover are exact duals satisfying |MIS| + |MVC| = N.",
    "The TreeRoleAllocationEngine deploys weighted tree DP to allocate primary controller roles across failure domains with zero adjacency conflicts."
]

# Assemble day41 lesson dictionary
day41_lesson = {
    "day": 41,
    "coursePrefix": "dsa-optim",
    "title": "Tree DP Foundations: Maximum Independent Set on Trees & Subtree Aggregations",
    "minutes": 38,
    "parts": [
        {
            "title": "Foundations of Dynamic Programming on Trees, Subtree Invariant & Post-Order Traversal",
            "say": part1_say,
            "example": part1_example,
            "tryIt": part1_tryIt,
            "code": part1_code,
            "output": part1_output,
            "codeNotes": [
                {"line": 1, "note": "Define computeSubtreeSizes accepting adjacency list and root node index."},
                {"line": 6, "note": "Recursive DFS post-order traversal visits children before parent."},
                {"line": 10, "note": "Aggregate child subtree size into parent size accumulating total descendant count."},
                {"line": 14, "note": "Push vertex to order array after all children return, establishing post-order sequence."},
                {"line": 29, "note": "Execute sample run on 5-node tree verifying subtree sizes and traversal sequence."}
            ],
            "check": part1_check
        },
        {
            "title": "Maximum Independent Set on Trees: Two-State Dynamic Programming Recurrence",
            "say": part2_say,
            "example": part2_example,
            "tryIt": part2_tryIt,
            "code": part2_code,
            "output": part2_output,
            "codeNotes": [
                {"line": 7, "note": "Define maxIndependentSetTree accepting tree adjacency, vertex weights, and root."},
                {"line": 13, "note": "Initialize dpTaken with intrinsic node weight and dpNotTaken with zero."},
                {"line": 18, "note": "If node u is taken, child v must not be taken (accumulate dpNotTaken[v])."},
                {"line": 19, "note": "If node u is not taken, child v can choose optimal state Math.max(taken, notTaken)."},
                {"line": 39, "note": "Verify maximum independent set weight on sample tree producing optimal weight 23."}
            ],
            "check": part2_check
        },
        {
            "title": "Subtree Aggregations: Node Counts, Structural Metrics & Tree Centroid Discovery",
            "say": part3_say,
            "example": part3_example,
            "tryIt": part3_tryIt,
            "code": part3_code,
            "output": part3_output,
            "codeNotes": [
                {"line": 1, "note": "Define findTreeCentroids to locate balance points whose component sizes <= N/2."},
                {"line": 7, "note": "First DFS pass computes subtree size for every vertex under root 0."},
                {"line": 23, "note": "Check whether any child subtree exceeds floor(N / 2) nodes."},
                {"line": 27, "note": "Check whether upper ancestor component N - sizes[u] exceeds floor(N / 2)."},
                {"line": 45, "note": "Identify unique centroid vertex 1 for the 5-node sample tree."}
            ],
            "check": part3_check
        },
        {
            "title": "Minimum Vertex Cover on Trees: Gallai's Duality Theorem & Direct DP Formulation",
            "say": part4_say,
            "example": part4_example,
            "tryIt": part4_tryIt,
            "code": part4_code,
            "output": part4_output,
            "codeNotes": [
                {"line": 7, "note": "Define minVertexCoverTree computing minimum vertex cover cardinality."},
                {"line": 12, "note": "Initialize dpCover with 1 (selecting u costs 1) and dpNotCover with 0."},
                {"line": 17, "note": "If u is not in cover, all children v MUST be in cover to cover edge (u, v)."},
                {"line": 19, "note": "If u is in cover, each child v can independently choose Math.min(cover, notCover)."},
                {"line": 36, "note": "Validate Gallai's Theorem: MIS (3) + MVC (2) = Total Nodes (5)."}
            ],
            "check": part4_check
        },
        {
            "title": "Enterprise Application: Distributed Microservice Infrastructure Role Allocator",
            "say": part5_say,
            "example": part5_example,
            "tryIt": part5_tryIt,
            "code": part5_code,
            "output": part5_output,
            "codeNotes": [
                {"line": 13, "note": "TreeRoleAllocationEngine encapsulates cluster tree optimization."},
                {"line": 20, "note": "Map service node compute capacities into DP vertex weight vectors."},
                {"line": 26, "note": "Reconstruct exact optimal node subset using top-down decision backtracking."},
                {"line": 29, "note": "If parent was not selected and dpTaken > dpNotTaken, select current node."},
                {"line": 56, "note": "Execute allocation on cluster tree selecting non-adjacent nodes [0, 3, 4] for 230 GFLOPS."}
            ],
            "check": part5_check
        }
    ],
    "projectStep": project_step,
    "summary": summary
}

with open("scripts/branch_c/day41_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day41_lesson, f, indent=2)
print("day41_lesson.json successfully generated.")
