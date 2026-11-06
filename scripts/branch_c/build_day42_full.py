# scripts/branch_c/build_day42_full.py
import json

day42 = {
  "day": 42,
  "coursePrefix": "dsa-optim",
  "title": "Tree Diameter, Path Properties & All-Pairs Distances via Tree DP",
  "minutes": 38,
  "projectStep": {
    "title": "High-Throughput Optical Backplane Router with Dynamic Tree DP",
    "steps": [
      "Model multi-switch fiber interconnect fabrics as unrooted acyclic topologies",
      "Compute worst-case optical propagation diameter in a single linear DFS traversal",
      "Isolate optimal synchronization clock placement using Kahn-like leaf peeling center discovery",
      "Construct Heavy-Light trunk decompositions to reserve ultra-low-latency wavelength channels"
    ]
  },
  "summary": [
    "The diameter of a tree represents the maximum geodesic distance between any two vertices.",
    "While the classic two-DFS algorithm computes diameter in O(N) time for non-negative unweighted/weighted trees, it fails on negative edge weights and requires multiple global graph sweeps.",
    "Single-pass Tree DP computes tree diameter by maintaining the two longest disjoint downward paths from each vertex, evaluating the local path apex in post-order time O(N).",
    "Tree centers minimize maximum eccentricity (radius = ceil(diameter / 2)), identifying optimal coordinator and SDN controller placement.",
    "Subtree distance aggregations establish the foundation for all-roots rerooting algorithms by accumulating subtree sizes and distance contributions in a bottom-up pass.",
    "Heavy-Light Path Decomposition assigns heavy edges to children with maximal subtree size, bounding any root-to-node path to at most log N distinct heavy chains."
  ],
  "parts": [
    # Part 1
    {
      "title": "Tree Path Properties: Two-DFS vs Single-Pass Tree DP Diameter",
      "say": [
        "Welcome to Day 42 of Advanced Data Structures and Algorithmic Optimization. Today we explore the geodesic foundation of tree networks: Tree Diameter, Path Properties, and All-Pairs Distances via Tree Dynamic Programming. In any connected, acyclic undirected graph (a tree), there exists exactly one unique simple path between any pair of vertices u and v. The diameter of the tree is formally defined as the length of the longest simple path among all pairs of vertices in the tree: Diameter(T) = max_{u, v in V} dist(u, v). Measuring and bounding tree diameter is essential in distributed systems engineering, optical switching fabrics, network routing protocols, and parallel computing architectures, because it establishes the theoretical upper bound on worst-case message propagation latency.",
        "Historically, two primary algorithmic paradigms have emerged for computing tree diameter. The first paradigm is the celebrated Two-DFS (or Two-BFS) algorithm. Starting from an arbitrary source vertex s, a first breadth-first or depth-first search traverses the tree to identify the farthest vertex A. Then, a second search originates at A to find the vertex B that is farthest from A. The distance between A and B is provably equal to the diameter of the tree. While conceptually straightforward and running in linear time O(N), the two-DFS technique exhibits notable operational constraints: it requires two full passes over the graph topology, assumes non-negative edge weights, and does not seamlessly integrate with subtree dynamic programming state aggregations.",
        "The second, more powerful paradigm is Single-Pass Tree Dynamic Programming. Rather than treating diameter calculation as an external graph traversal problem, tree DP formulates diameter as a local apex optimization problem. In any rooted tree, every simple path between two nodes u and v has a unique 'lowest common ancestor' (LCA) which acts as the apex or peak of the path. If we root the tree arbitrarily (for instance, at vertex 0), any simple path either lies entirely within a single child's subtree or reaches its highest elevation at some vertex w, extending downward into two disjoint child branches of w.",
        "By defining down1[u] as the length of the longest downward path originating at u and terminating at any leaf in u's subtree, we can compute down1[u] recursively: down1[u] = 1 + max_{v in Children(u)} down1[v] (with down1[leaf] = 0). Simultaneously, by maintaining down2[u] as the second longest downward path from u through a distinct child branch, the longest simple path that has vertex u as its apex is given by down1[u] + down2[u]. The global diameter of the entire tree is simply the maximum apex sum encountered across all vertices: Diameter = max_{u in V} (down1[u] + down2[u]). This calculation completes in a single post-order traversal in strict O(N) time and O(N) auxiliary stack memory.",
        "From an engineering perspective, the single-pass DP approach provides significant architectural advantages over multi-pass search. In streaming and distributed settings, nodes often report their subtree metrics asynchronously upward through a hierarchy. A coordinator node does not need to pause execution and trigger a secondary global broadcast traversal across the network; instead, it observes the local sum of its top two incoming branch heights. Furthermore, the single-pass formulation extends naturally to trees with negative edge weights, trees with dynamic link capacity updates, and multi-objective path optimization problems where latency and packet loss are evaluated concurrently.",
        "In enterprise datacenter backplane networks, switches and routing line cards are frequently arranged in spine-leaf or fat-tree topologies to maximize bisection bandwidth. When hardware diagnostic tools evaluate backplane health, calculating the diameter verifies that optical transceiver delays remain within the IEEE 802.3 Ethernet jitter budget. If a severed fiber link or failed switch module forces traffic through redundant bypass links, the single-pass Tree DP engine instantly computes the new path diameter in under a millisecond, alerting network monitoring dashboards if the latency budget for real-time algorithmic trading or high-frequency telemetry streaming has been breached."
      ],
      "example": "In an optical carrier transport network spanning nationwide data centers, fiber route optimization software evaluates network hop latency between core cross-connect switches. By executing single-pass Tree DP across the fiber spanning tree, the routing orchestrator verifies that the maximum optical delay between any two regional endpoints matches the two-DFS traversal output while consuming half the traversal memory passes.",
      "tryIt": "Examine the TypeScript code below. Observe how dfsDP performs a single post-order traversal to compute down1 and down2, evaluating dpDiameter as first + second, while bfsFarthest performs two consecutive breadth-first searches to locate endpoints A and B. Run the code and verify that both paradigms yield identical diameter metrics.",
      "code": "function analyzeDiameter() {\n  const n = 7;\n  const adj: number[][] = Array.from({ length: n }, () => []);\n  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [4, 5], [4, 6]];\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n\n  // Method A: Single-Pass Tree DP\n  let dpDiameter = 0;\n  function dfsDP(u: number, parent: number): number {\n    let first = 0;\n    let second = 0;\n    for (const v of adj[u]) {\n      if (v === parent) continue;\n      const childH = dfsDP(v, u) + 1;\n      if (childH > first) {\n        second = first;\n        first = childH;\n      } else if (childH > second) {\n        second = childH;\n      }\n    }\n    dpDiameter = Math.max(dpDiameter, first + second);\n    return first;\n  }\n  dfsDP(0, -1);\n\n  // Method B: Two-DFS Paradigm\n  function bfsFarthest(start: number): { node: number; dist: number } {\n    const dist = new Array(n).fill(-1);\n    const queue = [start];\n    dist[start] = 0;\n    let farthestNode = start;\n    let maxDist = 0;\n    while (queue.length > 0) {\n      const u = queue.shift()!;\n      if (dist[u] > maxDist) {\n        maxDist = dist[u];\n        farthestNode = u;\n      }\n      for (const v of adj[u]) {\n        if (dist[v] === -1) {\n          dist[v] = dist[u] + 1;\n          queue.push(v);\n        }\n      }\n    }\n    return { node: farthestNode, dist: maxDist };\n  }\n\n  const endA = bfsFarthest(0).node;\n  const resB = bfsFarthest(endA);\n  const twoDfsDiameter = resB.dist;\n\n  console.log(JSON.stringify({\n    dpDiameter,\n    twoDfsDiameter,\n    endpoints: [endA, resB.node],\n    match: dpDiameter === twoDfsDiameter\n  }));\n}\nanalyzeDiameter();",
      "output": "{\"dpDiameter\":4,\"twoDfsDiameter\":4,\"endpoints\":[5,2],\"match\":true}",
      "codeNotes": [
        "Line 12: dpDiameter tracks the maximum apex sum encountered during post-order traversal.",
        "Lines 15-24: Updates first (down1) and second (down2) longest paths through distinct child branches.",
        "Line 25: Evaluates the local diameter apex (first + second) at vertex u.",
        "Lines 31-48: Implements BFS to locate the extreme farthest node from any query vertex.",
        "Line 58: Confirms both paradigms arrive at an identical diameter of 4 hops."
      ],
      "check": {
        "question": "Why is the single-pass Tree DP formulation preferred over the Two-DFS algorithm in modular distributed routing architectures?",
        "options": [
          "It computes diameter in a single post-order pass without requiring global graph rescanning and naturally incorporates subtree state aggregations",
          "It reduces the asymptotic time complexity from O(N^2) down to O(log N)",
          "It completely avoids allocating adjacency lists by computing paths purely in GPU hardware shaders",
          "It guarantees that all trees have an even number of vertices and zero edge delays"
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "Single-pass Tree DP determines diameter in O(N) time within a single traversal by computing downward branch heights at path apexes, enabling seamless co-computation of subtree metrics and eliminating redundant global graph sweeps."
      }
    },
    # Part 2
    {
      "title": "Subtree Radii, Tree Centers & Minimum Eccentricity Discovery",
      "say": [
        "In Part 2, we advance from computing total diameter to identifying the structural equilibrium of trees: Tree Centers and Minimum Eccentricity. While the diameter measures the maximum distance between any two peripheral nodes, the eccentricity of a specific vertex u is defined as the maximum distance from u to any other vertex in the entire tree: Eccentricity(u) = max_{v in V} dist(u, v). The radius of the tree is the minimum eccentricity among all vertices: Radius(T) = min_{u in V} Eccentricity(u). The vertices that achieve this minimum eccentricity are designated as the Tree Centers.",
        "A foundational theorem of graph theory, established by Camille Jordan in 1869, states that every finite tree has either exactly one center (if its diameter is even) or exactly two adjacent centers connected by an edge (if its diameter is odd). Furthermore, the radius and diameter of any tree satisfy the exact mathematical relationship: Radius(T) = ceil(Diameter(T) / 2). If a tree has an even diameter 2k, the unique center lies exactly at distance k from all peripheral endpoints. If the diameter is odd (2k + 1), the two adjacent centers each exhibit an eccentricity of k + 1.",
        "Finding tree centers is of paramount importance in distributed systems, distributed database architecture, and network engineering. When establishing a centralized synchronization clock, a Raft/Paxos consensus leader, or an SDN (Software-Defined Networking) controller, positioning the controller at the tree center mathematically minimizes the maximum communication latency to the farthest node in the network. A poorly placed coordinator located at a peripheral leaf might require diameter hops to communicate with opposite leaves, whereas a centroid-centered or radius-centered coordinator requires at most radius hops, slashing worst-case response times by approximately fifty percent.",
        "To compute tree centers in optimal linear time O(N), we employ the Kahn-style Leaf Peeling algorithm (also known as topological leaf trimming). The conceptual intuition is strikingly elegant: because tree centers must lie at the exact midpoint of all longest paths, the peripheral leaves of the tree can never be centers (unless the tree consists of only one or two nodes). Therefore, we initialize an array storing the degree of every vertex and gather all initial leaves (vertices with degree <= 1). In successive iterative rounds, we remove the current set of leaves, decrement the degrees of their adjacent neighbors, and collect newly formed leaves.",
        "This iterative pruning process continues while the count of remaining unpruned vertices strictly exceeds 2. When the count of remaining vertices reaches either 1 or 2, the pruning terminates immediately. The remaining vertices are guaranteed to be the exact tree centers. Because every vertex and edge is examined and decremented at most a constant number of times, the entire leaf peeling algorithm executes in O(N) time and requires only O(N) memory for degree tracking and queue buffers.",
        "In physical enterprise infrastructure, such as multi-story corporate campuses or smart industrial factories, Internet of Things (IoT) sensor meshes frequently adopt spanning tree routing topologies to conserve battery power. Plant operations engineers utilize tree center discovery to deploy primary gateway base stations and emergency siren controllers. By stationing the primary RF gateway at the tree center, safety signals and critical sensor alerts propagate to all endpoints within the guaranteed radius bound, ensuring regulatory compliance with fire safety and industrial containment protocols."
      ],
      "example": "In a municipal fiber-to-the-home (FTTH) distribution network, telecom infrastructure engineers analyze optical splitters arranged in a branching tree. By executing leaf peeling center discovery, the software identifies the exact distribution hub that minimizes the maximum optical attenuation and transit time to subscriber premises.",
      "tryIt": "Review the TypeScript implementation below. Trace how the degree array is initialized, how peripheral leaves are iteratively trimmed in rounds, and how the algorithm halts when exactly one or two central vertices remain. Run the code and verify the identified tree center.",
      "code": "function findTreeCenters() {\n  const n = 7;\n  const adj: number[][] = Array.from({ length: n }, () => []);\n  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [4, 5], [4, 6]];\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n\n  // Degree array for leaf-peeling\n  const degree = adj.map(neighbors => neighbors.length);\n  let leaves: number[] = [];\n  for (let i = 0; i < n; i++) {\n    if (degree[i] <= 1) {\n      leaves.push(i);\n    }\n  }\n\n  let remaining = n;\n  while (remaining > 2) {\n    const count = leaves.length;\n    remaining -= count;\n    const newLeaves: number[] = [];\n    for (const leaf of leaves) {\n      for (const v of adj[leaf]) {\n        degree[v]--;\n        if (degree[v] === 1) {\n          newLeaves.push(v);\n        }\n      }\n    }\n    leaves = newLeaves;\n  }\n\n  const centers = leaves.sort((a, b) => a - b);\n  console.log(JSON.stringify({\n    nodeCount: n,\n    treeCenters: centers,\n    centerCount: centers.length\n  }));\n}\nfindTreeCenters();",
      "output": "{\"nodeCount\":7,\"treeCenters\":[1],\"centerCount\":1}",
      "codeNotes": [
        "Line 11: Computes initial node degrees across the tree topology.",
        "Lines 12-17: Populates the initial queue of boundary leaves (degree <= 1).",
        "Line 20: Halts peeling as soon as remaining vertices count is <= 2.",
        "Lines 25-30: Decrements neighbor degrees and pushes new leaves that have degree exactly 1.",
        "Line 39: Outputs the verified tree center vertex [1]."
      ],
      "check": {
        "question": "What is the maximum number of centers that any finite unrooted tree can possess?",
        "options": [
          "At most two centers, which must be directly adjacent and connected by an edge",
          "Exactly one center for all trees regardless of diameter parity",
          "As many centers as there are leaf nodes in the tree",
          "Log2(N) centers distributed along the longest path"
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "Jordan's 1869 theorem proves that any finite tree has either exactly one center (if the diameter is even) or exactly two adjacent centers connected by an edge (if the diameter is odd)."
      }
    },
    # Part 3
    {
      "title": "Subtree Distance Sums & Bottom-Up DP Accumulation",
      "say": [
        "In Part 3, we investigate Subtree Distance Sums, a vital computational primitive that bridges local subtree properties with global all-pairs network analytics. Consider a rooted tree where each vertex u coordinates a distinct organizational unit or microservice cluster. A fundamental question arises: what is the aggregate communication distance from u to all nodes residing in its downward subtree? Formally, we define SubtreeDistanceSum(u) = sum_{w in Subtree(u)} dist(u, w). Computing this metric efficiently enables hierarchical resource allocation, data replication costing, and latency budget evaluation.",
        "To formulate the bottom-up dynamic programming recurrence for subtree distance sums, we recognize that the distance from vertex u to any node w located in a child v's subtree is exactly one hop greater than the distance from v to w: dist(u, w) = dist(v, w) + 1. Consequently, summing this relation over all nodes w in Subtree(v) yields: sum_{w in Subtree(v)} dist(u, w) = sum_{w in Subtree(v)} (dist(v, w) + 1) = SubtreeDistanceSum(v) + SubtreeSize(v), where SubtreeSize(v) represents the total number of nodes in v's subtree.",
        "By aggregating this formula across all immediate children of vertex u, we arrive at the elegant Tree DP recurrence: SubtreeDistanceSum(u) = sum_{v in Children(u)} (SubtreeDistanceSum(v) + SubtreeSize(v)). Concurrently, the subtree size follows the familiar post-order relation: SubtreeSize(u) = 1 + sum_{v in Children(u)} SubtreeSize(v), with base cases SubtreeSize(leaf) = 1 and SubtreeDistanceSum(leaf) = 0. Both quantities can be computed simultaneously in a single bottom-up post-order depth-first search in linear time O(N).",
        "Understanding this bottom-up aggregation is mathematically transformative. Notice what this equation accomplishes: it compresses the total distance to all downward vertices into two scalar integers (SubtreeDistanceSum and SubtreeSize). When evaluating subtree migrations, backup snapshot replication, or localized failover scenarios, an enterprise orchestration engine does not need to re-traverse the millions of individual edges in the subtree. The aggregate latency and transmission costs are already precomputed and instantly accessible in constant time O(1).",
        "Furthermore, Subtree Distance Sums serve as the direct mathematical stepping stone to the celebrated All-Roots Rerooting DP technique (which we will master comprehensively in Day 43). While SubtreeDistanceSum only accounts for nodes inside u's downward subtree, an enterprise system often requires the total distance from u to all N nodes in the entire tree. By computing SubtreeDistanceSum and SubtreeSize during the initial bottom-up pass, a subsequent top-down pass can push downward the distance contributions from the rest of the tree in O(1) time per node, yielding all-pairs distance sums for all N nodes in O(N) overall time.",
        "In large-scale distributed cloud storage engines (such as Apache Cassandra, Ceph, or Google Colossus), data replicas are placed across hierarchical rack, row, and datacenter fault domains. Storage placement engines utilize subtree distance sums to evaluate data replication penalties. By computing the sum of hop distances to all replicas in a subtree, the scheduler selects primary coordinator replicas that minimize inter-rack switch traffic, preventing saturation of top-of-rack (ToR) uplinks and reducing 99th-percentile client read latencies."
      ],
      "example": "In an enterprise multi-datacenter Kubernetes cluster, the cluster autoscaler evaluates pod placement along a hierarchical topology tree. By calculating subtree distance sums, the autoscaler determines the network latency penalty of deploying worker nodes within a specific availability zone hierarchy.",
      "tryIt": "Examine the TypeScript code below. Observe how dfsDist recursively visits children first, accumulates their subtree sizes into subtreeSize[u], and adds subtreeSize[v] to sumDistSubtree[u]. Run the code and verify the computed subtree distance sums.",
      "code": "function computeSubtreeDistances() {\n  const n = 6;\n  const adj: number[][] = Array.from({ length: n }, () => []);\n  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n\n  const subtreeSize = new Array(n).fill(1);\n  const sumDistSubtree = new Array(n).fill(0);\n\n  function dfsDist(u: number, parent: number) {\n    for (const v of adj[u]) {\n      if (v === parent) continue;\n      dfsDist(v, u);\n      subtreeSize[u] += subtreeSize[v];\n      sumDistSubtree[u] += sumDistSubtree[v] + subtreeSize[v];\n    }\n  }\n  dfsDist(0, -1);\n\n  console.log(JSON.stringify({\n    root: 0,\n    rootSubtreeSize: subtreeSize[0],\n    rootSumDistSubtree: sumDistSubtree[0],\n    nodeOneSumDist: sumDistSubtree[1]\n  }));\n}\ncomputeSubtreeDistances();",
      "output": "{\"root\":0,\"rootSubtreeSize\":6,\"rootSumDistSubtree\":8,\"nodeOneSumDist\":2}",
      "codeNotes": [
        "Lines 10-11: Allocates subtreeSize initialized to 1 and sumDistSubtree initialized to 0.",
        "Lines 16-18: Post-order recurrence: accumulates subtreeSize[v] and adds (sumDistSubtree[v] + subtreeSize[v]).",
        "Line 21: Initiates traversal from root 0 with sentinel parent -1.",
        "Lines 23-28: Outputs the aggregate subtree distances for the root and internal node 1."
      ],
      "check": {
        "question": "In the recurrence SubtreeDistanceSum(u) = sum_{v in Children(u)} (SubtreeDistanceSum(v) + SubtreeSize(v)), why is SubtreeSize(v) added to the sum?",
        "options": [
          "Because every node in v's subtree is exactly one edge further away from u than it is from v",
          "Because each child edge has an exponential amplification factor of two",
          "To account for cyclic routing loops present in the graph",
          "Because leaf nodes do not contribute to distance calculations"
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "Traversing the edge from u to v adds 1 unit of distance for every single node residing within v's subtree. Summing 1 across all SubtreeSize(v) nodes contributes exactly SubtreeSize(v) additional distance."
      }
    },
    # Part 4
    {
      "title": "Heavy-Light Path Decomposition (HLD) Preliminaries",
      "say": [
        "In Part 4, we introduce Heavy-Light Path Decomposition (HLD), one of the most powerful and celebrated techniques in advanced algorithmic graph theory. Invented by Sleator and Tarjan in 1983, Heavy-Light Decomposition partitions the vertices of any arbitrary tree of size N into a set of disjoint linear paths (called 'heavy chains'). This decomposition allows complex path queries—such as finding the maximum edge weight, summing values along a path between arbitrary nodes u and v, or updating values on path segments—to be answered in O(log^2 N) or O(log N) time using standard linear data structures like Segment Trees or Fenwick Trees.",
        "The mathematical foundation of HLD begins with a precise classification of tree edges into 'Heavy Edges' and 'Light Edges'. For every non-leaf vertex u with children Children(u), we examine the subtree sizes SubtreeSize(v) of each child. The child v that possesses the strictly largest subtree size is designated as the 'Heavy Child': HeavyChild(u) = argmax_{v in Children(u)} SubtreeSize(v). If there are multiple children tied for maximum size, any one is chosen arbitrarily. The directed edge (u, HeavyChild(u)) is classified as a Heavy Edge. All other edges connecting u to its remaining children are classified as Light Edges.",
        "This simple classification yields an astonishing mathematical property known as the Heavy-Light Bounding Lemma: along any simple path from the root of the tree down to any arbitrary node w, the path traverses at most floor(log2 N) light edges. Why? Because whenever a path transitions across a light edge from a parent u to a child v, by definition v cannot be strictly larger than any heavy sibling. Therefore, SubtreeSize(v) <= SubtreeSize(u) / 2. Because the subtree size at least halves with every light edge traversed, one can traverse at most log2 N light edges before reaching a subtree of size 1 (a leaf).",
        "By grouping contiguous sequences of heavy edges together, the tree vertices are partitioned into maximal heavy chains. Each heavy chain has a unique 'head' vertex located closest to the root. When querying or updating information along a path between two arbitrary nodes u and v, the algorithm identifies their Lowest Common Ancestor (LCA) and jumps up the tree heavy chain by heavy chain. Because there are at most log2 N light edges on any path, a query traverses at most O(log N) disjoint heavy chains.",
        "To connect HLD with flat array data structures, we perform an Euler Tour or DFS traversal that visits the heavy child of each vertex before visiting any light children. This deliberate traversal ordering guarantees that all vertices belonging to the same heavy chain receive contiguous indices in the DFS in-time array. Consequently, any heavy chain segment corresponds to a contiguous index range [in[head], in[u]], which can be queried or updated in a Segment Tree in O(log N) time, yielding an overall path query complexity of O(log^2 N).",
        "In enterprise telecommunications and high-speed network backbones, HLD is utilized to manage quality-of-service (QoS) traffic reservations across software-defined wide area networks (SD-WAN). When enterprise applications request guaranteed bandwidth between remote corporate branches, the SDN controller decomposes the underlying network routing tree into heavy chains. Bandwidth reservations along high-volume trunk corridors are updated via segment trees in microseconds, enabling real-time admission control without network congestion or dropped video conferences."
      ],
      "example": "In a cloud networking infrastructure provider, network telemetry engines trace packet loss across thousands of virtual switches organized hierarchically. By applying Heavy-Light Decomposition, the telemetry collector resolves packet loss queries across arbitrary virtual switch paths in sub-millisecond time.",
      "tryIt": "Examine the TypeScript implementation below. Observe how dfsHeavy calculates subtree sizes, identifies the heavy child for each vertex with maximal subtree size, and populates the heavy array. Run the code and verify the identified heavy children.",
      "code": "function computeHeavyLightPreliminaries() {\n  const n = 7;\n  const adj: number[][] = Array.from({ length: n }, () => []);\n  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [4, 5], [4, 6]];\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n\n  const sz = new Array(n).fill(1);\n  const heavy = new Array(n).fill(-1);\n  const depth = new Array(n).fill(0);\n  const parent = new Array(n).fill(-1);\n\n  function dfsHeavy(u: number, p: number, d: number) {\n    depth[u] = d;\n    parent[u] = p;\n    let maxSub = 0;\n    for (const v of adj[u]) {\n      if (v === p) continue;\n      dfsHeavy(v, u, d + 1);\n      sz[u] += sz[v];\n      if (sz[v] > maxSub) {\n        maxSub = sz[v];\n        heavy[u] = v;\n      }\n    }\n  }\n  dfsHeavy(0, -1, 0);\n\n  console.log(JSON.stringify({\n    rootHeavyChild: heavy[0],\n    nodeOneHeavyChild: heavy[1],\n    nodeOneSubtreeSize: sz[1],\n    heavyVector: heavy\n  }));\n}\ncomputeHeavyLightPreliminaries();",
      "output": "{\"rootHeavyChild\":1,\"nodeOneHeavyChild\":4,\"nodeOneSubtreeSize\":5,\"heavyVector\":[1,4,-1,-1,5,-1,-1]}",
      "codeNotes": [
        "Lines 10-13: Initializes sz, heavy (-1 for leaves), depth, and parent tracking arrays.",
        "Lines 20-25: Compares child subtree sizes to isolate the child with maximum weight.",
        "Line 24: Sets heavy[u] = v to designate the heavy edge link.",
        "Lines 29-34: Outputs the heavy children: root 0's heavy child is 1, and node 1's heavy child is 4."
      ],
      "check": {
        "question": "What is the maximum number of light edges that can be encountered on any root-to-node path in a tree of N vertices?",
        "options": [
          "At most floor(log2 N) light edges, because each light edge at least halves the remaining subtree size",
          "At most N / 2 light edges, proportional to the number of leaves",
          "Exactly one light edge per heavy chain",
          "O(sqrt(N)) light edges under worst-case unbalanced topologies"
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "A light child by definition has size <= parentSize / 2. Therefore, traversing a light edge reduces the remaining subtree size by at least half, bounding the total number of light edges to at most floor(log2 N)."
      }
    },
    # Part 5
    {
      "title": "Enterprise Application: Low-Latency Backplane Optical Router",
      "say": [
        "In Part 5, we synthesize today's algorithmic breakthroughs into a production-grade enterprise system: the OpticalBackplaneRouter. Modern high-density modular datacenter switches—such as those manufactured by Cisco, Arista, and Juniper—consist of a chassis containing multiple line cards interconnected by an optical backplane fabric. Each line card houses high-speed optical transceivers (operating at 400 Gbps or 800 Gbps). To prevent packet collisions and minimize cross-chassis latency, optical engineers design the internal switching fabric as an ultra-low-diameter tree topology.",
        "The OpticalBackplaneRouter is charged with three mission-critical operational responsibilities. First, it must compute the worst-case optical propagation diameter across the chassis fabric. Because light traveling through silicon waveguides and fiber interconnects experiences approximately 5 nanoseconds of physical propagation delay per meter plus fixed switch serialization overhead, bounding the backplane diameter guarantees deterministic worst-case frame delivery times for ultra-low-latency financial trading and high-performance computing (HPC) workloads.",
        "Second, the router must identify the optimal chassis synchronization clock placement. In distributed synchronous Ethernet (SyncE) and IEEE 1588 Precision Time Protocol (PTP) systems, clock jitter accumulates with each intermediate hop. By utilizing Kahn-style leaf peeling to locate the exact tree center, the OpticalBackplaneRouter places the master PTP clock oscillator at the center switch. This placement guarantees that time synchronization packets reach every line card within minimum eccentricity hops, eliminating phase drift and clock skew across distributed ADC/DAC transceivers.",
        "Third, the router must construct Heavy-Light optical trunk paths. High-bandwidth east-west traffic between line cards requires dedicated optical wavelength division multiplexing (WDM) channel reservations. By calculating subtree sizes and isolating heavy chains, the router automatically allocates high-capacity 800 Gbps wavelength bands along the heavy trunk corridors, reserving lightweight 100 Gbps channels for peripheral leaf line cards. This differential allocation maximizes optical spectrum efficiency while eliminating buffer overflow and packet drops during bursty microburst traffic events.",
        "In enterprise cloud environments, the OpticalBackplaneRouter integrates directly with datacenter orchestration frameworks via gRPC and NETCONF/YANG management interfaces. Real-time telemetry collected by optical transceivers—including bit error rates (BER), optical power levels, and link status—is streamed to the routing engine. If an optical transceiver degrades or a physical backplane fiber fails, the router re-computes tree diameter, relocates the active clock center, and reroutes heavy trunk channels in sub-millisecond time without dropping active customer TCP sessions.",
        "By grounding theoretical graph concepts—tree diameter, leaf-peeling centers, subtree distance sums, and heavy-light decomposition—into an industrial-grade optical routing engine, software engineers bridge the gap between pure mathematics and high-reliability systems engineering. The OpticalBackplaneRouter stands as an exemplary model of how advanced algorithmic optimization powers the mission-critical digital infrastructure of modern global enterprises."
      ],
      "example": "In a hyperscale cloud datacenter hosting distributed AI model training clusters, optical engineers deploy chassis routers to interconnect GPU line cards. The OpticalBackplaneRouter determines optimal clock placement and trunk bandwidth reservations, ensuring synchronization jitter remains below ten nanoseconds across tens of thousands of tensor processing units.",
      "tryIt": "Explore the OpticalBackplaneRouter class below. Trace how addFiberInterconnect builds the bidirectional optical topology, how analyzeTopology computes diameter via Tree DP, locates the central switch via leaf peeling, and extracts heavy trunks. Run the code and inspect the generated telemetry report.",
      "code": "interface SwitchLink {\n  u: number;\n  v: number;\n  bandwidthGbps: number;\n}\n\ninterface BackplaneTelemetry {\n  totalSwitches: number;\n  backplaneDiameterHops: number;\n  centralSwitchId: number;\n  worstCasePropagationDelayNs: number;\n  heavyTrunks: Array<{ from: number; to: number }>;\n}\n\nclass OpticalBackplaneRouter {\n  private n: number;\n  private adj: Array<Array<{ to: number; bw: number }>>;\n\n  constructor(switchCount: number) {\n    this.n = switchCount;\n    this.adj = Array.from({ length: switchCount }, () => []);\n  }\n\n  public addFiberInterconnect(u: number, v: number, bandwidthGbps: number): void {\n    this.adj[u].push({ to: v, bw: bandwidthGbps });\n    this.adj[v].push({ to: u, bw: bandwidthGbps });\n  }\n\n  public analyzeTopology(): BackplaneTelemetry {\n    // 1. Calculate diameter via Tree DP\n    let maxDiameter = 0;\n    const dfsDiam = (u: number, p: number): number => {\n      let f = 0;\n      let s = 0;\n      for (const edge of this.adj[u]) {\n        if (edge.to === p) continue;\n        const h = dfsDiam(edge.to, u) + 1;\n        if (h > f) {\n          s = f;\n          f = h;\n        } else if (h > s) {\n          s = h;\n        }\n      }\n      maxDiameter = Math.max(maxDiameter, f + s);\n      return f;\n    };\n    dfsDiam(0, -1);\n\n    // 2. Find tree center via leaf peeling\n    const deg = this.adj.map(l => l.length);\n    let leaves: number[] = [];\n    for (let i = 0; i < this.n; i++) {\n      if (deg[i] <= 1) leaves.push(i);\n    }\n    let rem = this.n;\n    while (rem > 2) {\n      rem -= leaves.length;\n      const nextLeaves: number[] = [];\n      for (const leaf of leaves) {\n        for (const edge of this.adj[leaf]) {\n          deg[edge.to]--;\n          if (deg[edge.to] === 1) nextLeaves.push(edge.to);\n        }\n      }\n      leaves = nextLeaves;\n    }\n    const center = leaves[0];\n\n    // 3. Compute heavy trunks rooted at center\n    const sz = new Array(this.n).fill(1);\n    const heavyTrunk = new Array(this.n).fill(-1);\n    const dfsHeavy = (u: number, p: number) => {\n      let maxC = 0;\n      for (const edge of this.adj[u]) {\n        if (edge.to === p) continue;\n        dfsHeavy(edge.to, u);\n        sz[u] += sz[edge.to];\n        if (sz[edge.to] > maxC) {\n          maxC = sz[edge.to];\n          heavyTrunk[u] = edge.to;\n        }\n      }\n    };\n    dfsHeavy(center, -1);\n\n    const trunks: Array<{ from: number; to: number }> = [];\n    for (let i = 0; i < this.n; i++) {\n      if (heavyTrunk[i] !== -1) {\n        trunks.push({ from: i, to: heavyTrunk[i] });\n      }\n    }\n\n    // Physical propagation delay: 20 ns per optical hop\n    const worstCaseDelay = maxDiameter * 20;\n\n    return {\n      totalSwitches: this.n,\n      backplaneDiameterHops: maxDiameter,\n      centralSwitchId: center,\n      worstCasePropagationDelayNs: worstCaseDelay,\n      heavyTrunks: trunks\n    };\n  }\n}\n\nconst router = new OpticalBackplaneRouter(8);\nrouter.addFiberInterconnect(0, 1, 800);\nrouter.addFiberInterconnect(0, 2, 800);\nrouter.addFiberInterconnect(1, 3, 400);\nrouter.addFiberInterconnect(1, 4, 800);\nrouter.addFiberInterconnect(4, 5, 400);\nrouter.addFiberInterconnect(4, 6, 800);\nrouter.addFiberInterconnect(6, 7, 400);\n\nconst telemetry = router.analyzeTopology();\nconsole.log(JSON.stringify(telemetry));",
      "output": "{\"totalSwitches\":8,\"backplaneDiameterHops\":5,\"centralSwitchId\":1,\"worstCasePropagationDelayNs\":100,\"heavyTrunks\":[{\"from\":0,\"to\":2},{\"from\":1,\"to\":4},{\"from\":4,\"to\":6},{\"from\":6,\"to\":7}]}",
      "codeNotes": [
        "Lines 15-23: OpticalBackplaneRouter stores fiber adjacency with optical bandwidth ratings.",
        "Lines 28-44: Tree DP computes maximum hop diameter across the chassis interconnect fabric.",
        "Lines 47-66: Leaf-peeling algorithm isolates central switch ID 1 for master PTP clock placement.",
        "Lines 69-89: Computes heavy optical trunk links rooted at the central switch.",
        "Lines 92-98: Calculates worst-case propagation delay (5 hops * 20 ns = 100 ns)."
      ],
      "check": {
        "question": "Why does the OpticalBackplaneRouter position the master PTP clock oscillator at the tree center rather than at an arbitrary line card?",
        "options": [
          "To minimize the maximum hop distance (eccentricity) to all line cards, bounding worst-case optical clock skew and phase jitter",
          "Because tree leaves are physically incapable of receiving optical clock signals",
          "To force all packet routing to bypass the hardware switching fabric",
          "Because optical fiber delay scales exponentially with leaf node count"
        ],
        "answer": 0,
        "answerIndex": 0,
        "why": "Positioning the master clock oscillator at the tree center guarantees that the maximum distance to any line card is bounded by the radius (ceil(diameter / 2)), minimizing physical propagation delay, clock skew, and phase jitter."
      }
    }
  ]
}

with open("scripts/branch_c/day42_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day42, f, indent=2)

print("day42_lesson.json successfully generated.")
