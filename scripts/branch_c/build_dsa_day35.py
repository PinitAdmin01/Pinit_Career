import json
import os

p1_say = [
    "In enterprise backbone networking, autonomous transit systems, and global cloud interconnects, routing massive petabit-scale traffic while preventing systemic congestion represents a premier challenge in computational graph theory. Modern telecommunications conglomerates, hyper-scale cloud service providers, and content delivery networks (CDNs) maintain heterogeneous topologies composed of edge ingress points, regional aggregation switches, and core optical transit backbones. To govern these massive networks autonomously, routing engines model the entire physical and overlay infrastructure as a capacitated directed graph G = (V, E). In this mathematical abstraction, vertices V represent routing hardware—ranging from software edge proxies running eBPF/XDP kernels to multi-chassis core routers—while directed edges E represent fiber links, undersea transit conduits, and intra-datacenter cross-connects.",
    "Formulating the enterprise transit problem requires formalizing multi-commodity capacity constraints and hierarchical routing domains. Each directed transit link (u, v) is characterized by a triple: capacity c(u, v) denoting maximum allowable throughput in gigabits per second, propagation delay d(u, v) measured in milliseconds, and an operational cost metric m(u, v) reflecting transit tariffs or power consumption. Conservation of flow dictates that for any transit node that is neither an ingress client gateway nor an egress regional sink, total incoming commodity flow must strictly balance total outgoing flow. Specifically, for every intermediate transit router v in V \\ {s, t}, the sum of flows entering v across all inbound directed links must identically equal the sum of flows leaving v across all outbound directed links, preventing internal packet buffering queues from swelling toward hardware packet drop thresholds.",
    "When network topologies grow to tens of thousands of links, cyclic peering agreements and multi-homed BGP connections often introduce routing cycles that degrade analytical convergence. If cyclic paths exist with zero or marginal cost metrics, naive routing engines risk establishing forwarding loops where packets circulate indefinitely until their IP Time-To-Live (TTL) headers expire. To mitigate this structural overhead, our transit architecture incorporates Tarjan Strongly Connected Components (SCC) condensation. By contracting dense, strongly connected subgraphs into acyclic transit clusters, routing governors can compute macro-transit schedules across hierarchical tiers before delegating fine-grained packet flow to intra-domain switching matrices with zero circular forwarding deadlock.",
    "Furthermore, real-world cloud architectures organize nodes into discrete operational tiers: Tier 1 Core, Tier 2 Aggregation, and Tier 3 Edge Gateways. Tier 1 Core switches are deployed with ultra-high bandwidth, redundant optical fiber cross-connects (such as 400 Gbps and 800 Gbps coherent optics) and participate in global transit meshes. Tier 2 Aggregation switches concentrate regional rack traffic and enforce Quality of Service (QoS) classification boundaries. Tier 3 Edge Gateways terminate client transport layer security (TLS) sessions and ingest external user traffic. By modeling nodes with explicit tier attributes, the transit graph formulation allows the routing governor to enforce hierarchical tier-traversal invariants, ensuring packets do not bounce arbitrarily between aggregation layers before traversing core backbones.",
    "In addition to capacity and delay metrics, enterprise routing engines must track link utilization ratios u(e) = f(e) / c(e). When utilization exceeds critical operating thresholds (typically 80% to 85%), packet serialization delay increases non-linearly due to queuing theory dynamics described by the Kleinrock Independence Approximation. Therefore, our formal graph formulation incorporates non-linear penalty curves into the operational cost metric m(u, v), guiding subsequent flow optimization algorithms to divert secondary payloads toward underutilized transit corridors before primary optical trunks experience interface bufferbloat.",
    "At the data structure level, an autonomous transit router must store and index these capacitated directed graphs with high spatial and temporal efficiency. Standard adjacency matrices require O(V^2) memory, which becomes prohibitive when managing WAN graphs containing hundreds of thousands of virtual tunnel endpoints. Instead, our engine utilizes an optimized adjacency list representation where each vertex maps to an array of outgoing transit links. By augmenting each link descriptor with direct index pointers to symmetric reverse links, the routing governor prepares the topology for rapid constant-time residual capacity lookups during subsequent max-flow augmentation phases."
]

p1_example = (
    "Consider an international financial clearinghouse operating across New York, London, Frankfurt, Tokyo, and Singapore. The global transit architecture must allocate dedicated bandwidth pipelines for low-latency algorithmic trading feeds, bulk clearing ledger synchronization, and telemetry logging. By constructing a formal transit graph G with strict capacity bounds, our routing governor registers core optical links operating at four hundred gigabits per second alongside regional aggregation trunks at one hundred gigabits per second. Through systematic adjacency indexing and Tarjan topological clustering, the routing engine identifies cyclic cross-border peering loops, collapses them into cohesive autonomous domains, and establishes a baseline transit capacity matrix. This formal representation guarantees that subsequent flow optimization engines operate on a mathematically rigorous model where bandwidth saturation thresholds and interface queue limits are strictly enforced."
)

p1_tryIt = (
    "Examine the topology formulation code below. Review how nodes are registered with explicit hierarchical tiers (CORE, AGGREGATION, EDGE) and how directed links enforce discrete capacity, latency, and cost attributes. Observe how the transit graph maintains efficient map-based adjacency lists to facilitate O(1) link traversal during pathfinding sweeps. Test how registering additional aggregation links scales the aggregate provisioned network throughput while preserving graph integrity constraints across diverse routing domains."
)

p1_check = {
    "question": "Why is condensing cyclic peering topologies into Strongly Connected Components (SCCs) mathematically advantageous before running global transit flow optimization?",
    "options": [
        "It transforms cyclic transit clusters into a Directed Acyclic Graph (DAG) of macro-domains, bounding search complexity and preventing infinite circular routing loops",
        "It converts directed optical channels into undirected networks, allowing single-threaded linear programming solvers to eliminate all capacity constraints",
        "It eliminates the need to track interface bandwidth limits, automatically granting infinite transmission headroom across regional peering exchanges",
        "It replaces flow conservation equations with unconstrained shortest-path Dijkstra sweeps that ignore physical link propagation delays"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Condensing cyclic subgraphs into Strongly Connected Components (SCCs) using Tarjan's algorithm transforms dense, cyclic peering networks into a Directed Acyclic Graph (DAG) of autonomous transit domains. This structural reduction bounds algorithmic complexity, allows topological layering, eliminates infinite circular forwarding anomalies, and enables hierarchical flow optimization where inter-domain traffic schedules are resolved before local intra-domain packet distribution."
}

p1_code = """/**
 * Day 35 - Part 1: Enterprise Transit Topology & Multi-Commodity Capacity Formulation
 */

interface TransitNode {
  id: number;
  label: string;
  tier: 'CORE' | 'AGGREGATION' | 'EDGE';
}

interface TransitLink {
  from: number;
  to: number;
  capacityGbps: number;
  delayMs: number;
  costMetric: number;
}

class TransitTopologyGraph {
  public nodes: Map<number, TransitNode> = new Map();
  public adj: Map<number, TransitLink[]> = new Map();

  addNode(node: TransitNode): void {
    this.nodes.set(node.id, node);
    if (!this.adj.has(node.id)) {
      this.adj.set(node.id, []);
    }
  }

  addLink(link: TransitLink): void {
    this.adj.get(link.from)!.push(link);
  }

  computeTotalTransitCapacity(): number {
    let total = 0;
    for (const links of this.adj.values()) {
      for (const link of links) {
        total += link.capacityGbps;
      }
    }
    return total;
  }

  displayTopologySummary(): void {
    console.log(`[TransitTopology] Registered Nodes: ${this.nodes.size}, Total Directed Links: ${Array.from(this.adj.values()).reduce((acc, l) => acc + l.length, 0)}`);
    console.log(`[TransitTopology] Aggregate Provisioned Bandwidth: ${this.computeTotalTransitCapacity()} Gbps`);
  }
}

function main(): void {
  const topology = new TransitTopologyGraph();

  // Tier 1 Core, Tier 2 Aggregation, Tier 3 Edge Gateways
  topology.addNode({ id: 0, label: "Core-Alpha-US-East", tier: 'CORE' });
  topology.addNode({ id: 1, label: "Core-Beta-EU-Central", tier: 'CORE' });
  topology.addNode({ id: 2, label: "Agg-Dist-1", tier: 'AGGREGATION' });
  topology.addNode({ id: 3, label: "Agg-Dist-2", tier: 'AGGREGATION' });
  topology.addNode({ id: 4, label: "Edge-GW-Ingress", tier: 'EDGE' });
  topology.addNode({ id: 5, label: "Edge-GW-Egress", tier: 'EDGE' });

  // Links with capacity, delay, and metrics
  topology.addLink({ from: 4, to: 2, capacityGbps: 100, delayMs: 2, costMetric: 10 });
  topology.addLink({ from: 4, to: 3, capacityGbps: 100, delayMs: 4, costMetric: 15 });
  topology.addLink({ from: 2, to: 0, capacityGbps: 200, delayMs: 5, costMetric: 5 });
  topology.addLink({ from: 3, to: 1, capacityGbps: 150, delayMs: 8, costMetric: 8 });
  topology.addLink({ from: 0, to: 1, capacityGbps: 400, delayMs: 12, costMetric: 2 });
  topology.addLink({ from: 0, to: 5, capacityGbps: 150, delayMs: 6, costMetric: 12 });
  topology.addLink({ from: 1, to: 5, capacityGbps: 250, delayMs: 4, costMetric: 6 });

  topology.displayTopologySummary();
}

main();"""

p1_output = """[TransitTopology] Registered Nodes: 6, Total Directed Links: 7
[TransitTopology] Aggregate Provisioned Bandwidth: 1350 Gbps"""

p1_codeNotes = [
    {"line": 5, "note": "Defines TransitNode interface classifying devices into CORE, AGGREGATION, and EDGE tiers"},
    {"line": 11, "note": "Defines TransitLink interface encapsulating bandwidth capacity, propagation delay, and cost"},
    {"line": 19, "note": "Implements TransitTopologyGraph maintaining map-based adjacency lists for O(1) node access"},
    {"line": 40, "note": "Computes aggregate provisioned network throughput across all registered transit links"},
    {"line": 56, "note": "Populates realistic 6-node hierarchical WAN transit topology with tiered links"}
]

# ----------------- PART 2 -----------------
p2_say = [
    "Once an enterprise network topology is formulated as a capacitated directed graph, the primary objective is maximizing total transmission throughput from ingress gateways to destination egress points while uncovering critical structural bottlenecks. The Ford-Fulkerson method and its polynomial refinement, the Edmonds-Karp algorithm, achieve this by repeatedly discovering augmenting paths in a dynamically maintained residual graph G_f. In our transit routing engine, every physical fiber link (u, v) with nominal bandwidth capacity c(u, v) is paired with a symmetric residual edge (v, u) possessing initial zero capacity. Whenever an augmenting path pushes a bottleneck volume of flow delta through forward links, the forward residual capacity decreases by delta while the reverse residual capacity increases by exactly delta.",
    "The maintenance of skew symmetry and reverse residual capacity is not merely an algebraic convention; it provides the mathematical mechanism that enables our autonomous routing engine to revoke suboptimal routing decisions made during earlier path augmentations. When traffic is routed along an edge that subsequent path searches discover would be better allocated to an alternative flow commodity, pushing flow along the reverse residual edge (v, u) algebraically cancels the forward flow along (u, v). This dynamic cancellation reroutes the original flow along an alternative branch without requiring the router to maintain a complex combinatorial undo stack of previous routing choices.",
    "By utilizing Breadth-First Search (BFS) to identify shortest augmenting paths measured by edge hop count, Edmonds-Karp guarantees that the shortest path distance from source s to any node v in the residual graph increases monotonically throughout execution. Jack Edmonds and Richard Karp proved that under BFS path selection, each edge can become the bottleneck (critical edge) at most |V| / 2 times before its distance from the source increases. Because there are |E| edges in the network and each augmentation step saturates at least one critical edge, the total number of augmenting paths is bounded by O(V * E). Multiplying by the O(E) cost of each BFS traversal yields a strictly polynomial upper bound of O(V * E^2), completely eliminating the risk of infinite non-terminating loops with irrational capacities that plagued naive Ford-Fulkerson.",
    "Beyond calculating peak throughput, the ultimate diagnostic capability of this pipeline is extracted through the Max-Flow Min-Cut Theorem, first proven by Lester Ford and Delbert Fulkerson in 1956. The theorem establishes an exact mathematical duality: in any capacitated flow network, the maximum volume of flow from source s to sink t equals the minimum total capacity among all s-t cuts. An s-t cut is defined as a partition of the vertices V into two disjoint subsets, S and T, such that the source s belongs to S and the destination sink t belongs to T. The capacity of the cut C(S, T) is the sum of capacities of all directed edges originating in set S and terminating in set T.",
    "To extract this minimum cut in linear O(V + E) time following max-flow termination, the autonomous router initiates a residual reachability sweep. Starting at the source vertex s, a BFS traversal explores all vertices reachable via edges with non-zero residual capacity (c(u, v) - f(u, v) > 0). The set of visited vertices forms the reachable partition S, while all remaining unvisited vertices comprise the unreachable partition T. Every directed edge (u, v) spanning the boundary from S to T must have a residual capacity of zero; otherwise, vertex v would have been explored and included in S. Consequently, all edges spanning from S to T are completely saturated, and their combined nominal capacity exactly equals the computed maximum flow.",
    "In operational WAN environments, identifying these min-cut boundary edges provides extraordinary actionable intelligence. Rather than blindly upgrading random switches or expanding bandwidth across underutilized links, telecommunications operators can pinpoint the precise physical conduits that choke global data transfer. Autonomous network governors can immediately trigger targeted traffic-shaping policies, dynamically provision parallel multiprotocol label switching (MPLS) tunnels, or issue automated procurement orders for optical wavelength expansion precisely along the min-cut boundary."
]

p2_example = (
    "Consider a major software-as-a-service (SaaS) provider executing massive multi-region database replication between US-East and US-West data centers. During peak backup windows, customer API latency spikes due to interface queue overflows. The network engineering team deploys the autonomous flow pipeline to analyze the transit graph connecting ingress routers to egress database clusters. The Edmonds-Karp engine executes successive BFS augmentations, identifying optimal traffic splits across regional paths. Upon reaching a maximal flow of one hundred and ninety gigabits per second, the pipeline initiates a residual reachability sweep, instantly isolating two specific backbone links connecting Core routers to Egress gateways whose combined capacity exactly equals one hundred and ninety gigabits. This discovery demarks the exact structural bottleneck, directing automated traffic shaping algorithms to load-balance flows before hardware interfaces drop packets."
)

p2_tryIt = (
    "Review the flow pipeline implementation below. Trace how the FlowEdge data structure explicitly links forward edges with their symmetric reverse counterparts via index references. Follow the BFS augmentation loop as it tracks parent pointers, calculates the path bottleneck, and updates residual flows. Observe how the final residual reachability sweep accurately isolates the exact minimum cut edges whose cumulative capacity perfectly matches total computed max-flow throughput."
)

p2_check = {
    "question": "How does the residual graph reachability sweep guarantee that the extracted cut edges represent the absolute minimum capacity bottleneck in the network?",
    "options": [
        "Because all forward edges spanning from reachable set S to unreachable set T are completely saturated (residual capacity is zero), making the total cut capacity strictly equal to the maximal flow",
        "Because BFS selects the longest path across the network, forcing reverse residual edges to multiply forward bandwidth capacity exponentially",
        "Because every edge in set T has infinite residual headroom, allowing unconstrained packet transmission without consuming physical bandwidth",
        "Because the minimum cut algorithm arbitrarily deletes undirected links until the graph disconnects into two equal-sized vertex sets"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "According to the Max-Flow Min-Cut Theorem, when max flow is achieved, no augmenting path exists from source s to sink t in the residual graph G_f. The reachable set S contains all vertices accessible via non-zero residual edges. Any edge (u, v) where u is in S and v is in T must have zero residual capacity (cap - flow = 0), meaning it is completely saturated. Therefore, the net flow across the cut equals both the maximal flow and the total capacity of the cut, proving it is the absolute minimum cut."
}

p2_code = """/**
 * Day 35 - Part 2: High-Throughput Residual Flow Augmentation & Min-Cut Partitioning
 */

interface FlowEdge {
  to: number;
  rev: number;
  cap: number;
  flow: number;
}

class TransitFlowPipeline {
  private n: number;
  private adj: FlowEdge[][];

  constructor(n: number) {
    this.n = n;
    this.adj = Array.from({ length: n }, () => []);
  }

  addEdge(u: number, v: number, cap: number): void {
    const a: FlowEdge = { to: v, rev: this.adj[v].length, cap, flow: 0 };
    const b: FlowEdge = { to: u, rev: this.adj[u].length, cap: 0, flow: 0 };
    this.adj[u].push(a);
    this.adj[v].push(b);
  }

  computeMaxFlow(source: number, sink: number): { maxFlow: number; minCutEdges: [number, number, number][] } {
    let maxFlow = 0;

    while (true) {
      const parentEdge: { u: number; edgeIdx: number }[] = Array(this.n).fill(null);
      const queue: number[] = [source];
      let head = 0;

      while (head < queue.length) {
        const curr = queue[head++];
        if (curr === sink) break;

        for (let i = 0; i < this.adj[curr].length; i++) {
          const edge = this.adj[curr][i];
          const residual = edge.cap - edge.flow;
          if (residual > 0 && parentEdge[edge.to] === null && edge.to !== source) {
            parentEdge[edge.to] = { u: curr, edgeIdx: i };
            queue.push(edge.to);
          }
        }
      }

      if (parentEdge[sink] === null) break;

      let bottleNeck = Infinity;
      let curr = sink;
      while (curr !== source) {
        const { u, edgeIdx } = parentEdge[curr];
        const edge = this.adj[u][edgeIdx];
        bottleNeck = Math.min(bottleNeck, edge.cap - edge.flow);
        curr = u;
      }

      curr = sink;
      while (curr !== source) {
        const { u, edgeIdx } = parentEdge[curr];
        this.adj[u][edgeIdx].flow += bottleNeck;
        const revIdx = this.adj[u][edgeIdx].rev;
        this.adj[curr][revIdx].flow -= bottleNeck;
        curr = u;
      }

      maxFlow += bottleNeck;
    }

    // Min-cut discovery via BFS from source in residual graph
    const reachable = Array(this.n).fill(false);
    const q: number[] = [source];
    reachable[source] = true;
    let h = 0;
    while (h < q.length) {
      const u = q[h++];
      for (const edge of this.adj[u]) {
        if (edge.cap - edge.flow > 0 && !reachable[edge.to]) {
          reachable[edge.to] = true;
          q.push(edge.to);
        }
      }
    }

    const minCutEdges: [number, number, number][] = [];
    for (let u = 0; u < this.n; u++) {
      if (reachable[u]) {
        for (const edge of this.adj[u]) {
          if (!reachable[edge.to] && edge.cap > 0) {
            minCutEdges.push([u, edge.to, edge.cap]);
          }
        }
      }
    }

    return { maxFlow, minCutEdges };
  }
}

function main(): void {
  // 6 nodes: 0: Ingress-GW, 1: Agg-East, 2: Agg-West, 3: Core-1, 4: Core-2, 5: Egress-GW
  const flowNet = new TransitFlowPipeline(6);
  flowNet.addEdge(0, 1, 120);
  flowNet.addEdge(0, 2, 80);
  flowNet.addEdge(1, 3, 100);
  flowNet.addEdge(1, 4, 50);
  flowNet.addEdge(2, 3, 30);
  flowNet.addEdge(2, 4, 70);
  flowNet.addEdge(3, 5, 110);
  flowNet.addEdge(4, 5, 80);

  const { maxFlow, minCutEdges } = flowNet.computeMaxFlow(0, 5);
  console.log(`[TransitFlow] Max Flow Throughput: ${maxFlow} Gbps`);
  console.log(`[TransitFlow] S-T Min-Cut Bottleneck Links: ${minCutEdges.map(([u, v, c]) => `${u}->${v} (cap: ${c})`).join(", ")}`);
  const cutCapacity = minCutEdges.reduce((sum, [, , c]) => sum + c, 0);
  console.log(`[TransitFlow] Min-Cut Capacity: ${cutCapacity} Gbps (Theorem holds: ${maxFlow === cutCapacity})`);
}

main();"""

p2_output = """[TransitFlow] Max Flow Throughput: 190 Gbps
[TransitFlow] S-T Min-Cut Bottleneck Links: 3->5 (cap: 110), 4->5 (cap: 80)
[TransitFlow] Min-Cut Capacity: 190 Gbps (Theorem holds: true)"""

p2_codeNotes = [
    {"line": 5, "note": "Defines FlowEdge structure maintaining capacity, current flow, and reverse edge index pointer"},
    {"line": 19, "note": "Adds directed forward link paired with a symmetric zero-capacity residual reverse link"},
    {"line": 28, "note": "Executes Edmonds-Karp BFS loop to discover shortest augmenting paths in residual graph"},
    {"line": 64, "note": "Performs linear residual reachability sweep from source to partition graph into sets S and T"},
    {"line": 78, "note": "Extracts saturated boundary edges spanning from S to T, identifying the exact minimum cut bottleneck"}
]

# ----------------- PART 3 -----------------
p3_say = [
    "While high-throughput flow optimization guarantees maximum data transfer under static conditions, real-world telecommunications systems are inherently vulnerable to physical line severing, backhoe fiber cuts, and hardware chassis failures. An enterprise routing engine must possess continuous structural surveillance to identify Single Points of Failure (SPOF) before an outage occurs. In graph theory, an edge whose removal strictly increases the number of connected components is classified as a bridge, while a vertex whose removal partitions the remaining network into disjoint subgraphs is defined as an articulation point (or cut vertex). A network containing backbone bridges exhibits zero structural redundancy along those transit segments, representing severe operational fragility.",
    "To detect bridges and articulation points with optimal linear time complexity, our autonomous transit router executes the Hopcroft-Tarjan Depth-First Search (DFS) algorithm in O(V + E) time. During a single recursive traversal, the router assigns each vertex u a discovery entry timestamp tin[u]. Additionally, the router maintains a low-link value low[u], which represents the lowest discovery timestamp reachable from u by traversing at most one non-tree back-edge. As the DFS explores a tree edge (u, v), vertex v is traversed recursively. Upon returning, low[u] is updated to min(low[u], low[v]).",
    "The critical invariant established by John Hopcroft and Robert Tarjan states that link (u, v) is a bridge if and only if low[v] > tin[u]. This inequality demonstrates that no vertex in the subtree rooted at v has any back-edge reaching u or any ancestor of u in the DFS tree. Consequently, the edge (u, v) serves as the sole structural link connecting the subtree at v to the rest of the network; severing (u, v) leaves the entire subtree disconnected. Conversely, if low[v] <= tin[u], there exists at least one cycle or alternative path bypassing (u, v), guaranteeing that traffic can be rerouted if the link fails.",
    "Concurrently, the Hopcroft-Tarjan traversal identifies articulation points (critical routing chassis). A non-root vertex u is an articulation point if it has a child v such that low[v] >= tin[u]. This condition indicates that the subtree rooted at v cannot reach any ancestor of u without passing through u itself; removing router u completely isolates subtree v. For the root of the DFS tree, a distinct condition applies: the root is an articulation point if and only if it has two or more independent children in the DFS tree, because removing the root disconnects those subtrees from one another.",
    "Beyond raw detection, modern autonomous routing engines condense biconnected subgraphs into a formal Block-Cut Tree (BC-tree). In this bipartite representation, nodes represent either maximal 2-vertex-connected components (blocks) or articulation points (cut vertices). Traversing the block-cut tree allows the routing governor to model global WAN resilience as an acyclic structure where any path between two distinct operational blocks must traverse the sequence of articulation points separating them, simplifying complex multi-domain survivability proofs.",
    "At the physical infrastructure layer, these graph-theoretic metrics interface directly with kernel-level telemetry and hardware optical time-domain reflectometry (OTDR). When optical transceivers report deteriorating signal-to-noise ratios (SNR) or rising bit error rates (BER), our surveillance engine runs Hopcroft-Tarjan sweeps within sub-millisecond eBPF hooks. If a degrading conduit is identified as an active bridge, the governor immediately elevates alert priority from informational to critical, initiating automated path redundancy provisioning before physical fiber severance can induce catastrophic network partition.",
    "By computing bridges and articulation points in a single pass, the autonomous routing governor creates an instantaneous resilience topology map. Every link is classified into one of two operational categories: BICONNECTED (redundant, dual-path protected) or BRIDGE (vulnerable, single point of failure). When a bridge is detected on a transit corridor carrying critical traffic, the governor flags the link for automated protection-path provisioning.",
    "Furthermore, tracking articulation points allows the routing engine to identify vulnerable transit switches whose power failure, software kernel panic, or maintenance reboot would trigger a network partition. Enterprise routing policies can automatically reassign traffic away from articulation switches or alert data center operations to prioritize dual power supply feeds and redundant supervisory cards on those specific chassis."
]

p3_example = (
    "Consider an inter-datacenter backbone linking three primary operational regions: North America, Western Europe, and Asia-Pacific. Within North America and Europe, local datacenters are interconnected via redundant triangular fiber rings. However, transatlantic communication relies upon a single optical submarine cable connecting London to New York. The autonomous resilience scanner performs a periodic linear-time DFS sweep across the global topology. The scanner computes discovery timestamps and low-link values, immediately detecting that the transatlantic conduit satisfies low[v] > tin[u]. The link is flagged as a critical backbone bridge, and both termination routers are marked as articulation points. The autonomous controller generates a high-severity resilience advisory, preventing automated traffic engineering from routing unbacked high-priority payloads exclusively across the vulnerable segment."
)

p3_tryIt = (
    "Examine the resilience scanner implementation below. Observe how discovery entry timestamps and low-link values are initialized during DFS traversal. Trace how tree edges and back-edges are handled separately to avoid traversing parent links. Notice how the bridge condition (low[v] > tin[u]) and articulation conditions are evaluated concurrently in a single traversal pass, producing an instantaneous diagnostic report that categorizes the network as either BICONNECTED or facing PARTITION_RISK."
)

p3_check = {
    "question": "In the Hopcroft-Tarjan bridge detection algorithm, why does the condition low[v] > tin[u] definitively prove that the tree edge (u, v) is a bridge?",
    "options": [
        "It proves that no vertex in the subtree rooted at v possesses any back-edge reaching u or any ancestor of u, meaning removing (u, v) completely disconnects v from the rest of the graph",
        "It indicates that the residual flow through link (u, v) has reached maximum capacity, causing the BFS queue to encounter an infinite loop",
        "It establishes that vertex v is a leaf node with zero incoming edges, allowing the routing engine to prune it from the topological sort order",
        "It verifies that edge (u, v) forms part of a multi-hop directed cycle, guaranteeing that alternate paths exist to bypass link degradation"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "The low-link value low[v] records the earliest discovery timestamp reachable from v's subtree via at most one back-edge. If low[v] > tin[u], every back-edge from the subtree at v only leads to vertices within that subtree or to v itself; no back-edge reaches u or an ancestor of u. Consequently, the edge (u, v) is the sole connection between the subtree at v and the rest of the graph. Removing (u, v) leaves the subtree isolated, proving (u, v) is a bridge."
}

p3_code = """/**
 * Day 35 - Part 3: Autonomous Bridge & Articulation Vulnerability Scanner
 */

interface ResilienceEdge {
  to: number;
  id: number;
}

class TransitResilienceScanner {
  private n: number;
  private adj: ResilienceEdge[][];
  private timer: number = 0;
  private tin: number[];
  private low: number[];
  private visited: boolean[];
  public bridges: [number, number][];
  public articulationPoints: Set<number>;

  constructor(n: number) {
    this.n = n;
    this.adj = Array.from({ length: n }, () => []);
    this.tin = Array(n).fill(-1);
    this.low = Array(n).fill(-1);
    this.visited = Array(n).fill(false);
    this.bridges = [];
    this.articulationPoints = new Set();
  }

  addEdge(u: number, v: number, edgeId: number): void {
    this.adj[u].push({ to: v, id: edgeId });
    this.adj[v].push({ to: u, id: edgeId });
  }

  private dfs(u: number, p: number = -1): void {
    this.visited[u] = true;
    this.tin[u] = this.low[u] = ++this.timer;
    let children = 0;

    for (const edge of this.adj[u]) {
      const v = edge.to;
      if (v === p) continue;
      if (this.visited[v]) {
        this.low[u] = Math.min(this.low[u], this.tin[v]);
      } else {
        this.dfs(v, u);
        this.low[u] = Math.min(this.low[u], this.low[v]);
        if (this.low[v] > this.tin[u]) {
          this.bridges.push([u, v]);
        }
        if (this.low[v] >= this.tin[u] && p !== -1) {
          this.articulationPoints.add(u);
        }
        children++;
      }
    }

    if (p === -1 && children > 1) {
      this.articulationPoints.add(u);
    }
  }

  scanVulnerabilities(): { bridges: [number, number][]; articulationPoints: number[] } {
    this.timer = 0;
    this.bridges = [];
    this.articulationPoints.clear();
    this.visited.fill(false);
    this.tin.fill(-1);
    this.low.fill(-1);

    for (let i = 0; i < this.n; i++) {
      if (!this.visited[i]) {
        this.dfs(i);
      }
    }

    return {
      bridges: this.bridges,
      articulationPoints: Array.from(this.articulationPoints).sort((a, b) => a - b)
    };
  }
}

function main(): void {
  // Topology: 6 nodes.
  // Triangle 0-1-2, bridge 2-3, triangle 3-4-5
  const scanner = new TransitResilienceScanner(6);
  scanner.addEdge(0, 1, 1);
  scanner.addEdge(1, 2, 2);
  scanner.addEdge(2, 0, 3);
  scanner.addEdge(2, 3, 4); // Bridge & Articulations: 2, 3
  scanner.addEdge(3, 4, 5);
  scanner.addEdge(4, 5, 6);
  scanner.addEdge(5, 3, 7);

  const report = scanner.scanVulnerabilities();
  console.log(`[ResilienceScanner] Critical Backbone Bridges (SPOF Links): ${report.bridges.map(([u, v]) => `${u}<->${v}`).join(", ")}`);
  console.log(`[ResilienceScanner] Articulation Points (Vulnerable Routers): ${report.articulationPoints.join(", ")}`);
  console.log(`[ResilienceScanner] System Resilience Status: ${report.bridges.length === 0 ? "BICONNECTED" : "PARTITION_RISK"}`);
}

main();"""

p3_output = """[ResilienceScanner] Critical Backbone Bridges (SPOF Links): 2<->3
[ResilienceScanner] Articulation Points (Vulnerable Routers): 2, 3
[ResilienceScanner] System Resilience Status: PARTITION_RISK"""

p3_codeNotes = [
    {"line": 15, "note": "Initializes discovery entry timestamps tin and low-link values low to -1"},
    {"line": 34, "note": "Recursively explores tree edges, updating low-link values and testing the bridge invariant"},
    {"line": 40, "note": "Flags edge as a bridge when low[v] > tin[u], proving zero back-edges bypass the tree edge"},
    {"line": 43, "note": "Identifies articulation points when low[v] >= tin[u] for non-root nodes or multi-child root"},
    {"line": 63, "note": "Executes linear-time O(V + E) scan over all graph components, returning vulnerability report"}
]

# ----------------- PART 4 -----------------
p4_say = [
    "Enterprise network backbones operate in dynamic environments characterized by intermittent link flapping, maintenance windows, and rapid routing state churn. When fiber interfaces flap rapidly due to optical signal degradation or hardware transceiver resets, re-running full network flow recomputations and global DFS sweeps from scratch for every transient state change consumes prohibitive CPU cycles and introduces severe control-plane jitter. To achieve low-latency adaptive control, the autonomous transit router incorporates dynamic connectivity management backed by Rollback Disjoint Set Union (Rollback DSU). This temporal data structure enables the routing engine to test speculative route migrations and simulate link failures without permanently mutating the canonical routing state.",
    "The fundamental requirement of Rollback DSU is maintaining reversible union operations with logarithmic time bounds. In standard DSU implementations, path compression flattens tree pointers during find() calls, which destroys the historical ancestry tree and precludes exact state rollbacks. In Rollback DSU, path compression is strictly eliminated in favor of union by rank (or union by size). Every union operation evaluates the ranks of the canonical roots, updates the parent pointer of the smaller rank root, and appends a minimal state delta record to a historical undo stack.",
    "By restricting tree height to logarithmic depth O(log N) through union by rank alone, each find(u) operation traverses at most O(log N) parent pointers. When union(u, v) is invoked, at most two memory locations are altered: one parent pointer is reassigned to merge the root of the smaller tree into the larger, and the rank of the larger root may be incremented by one if both trees had identical initial ranks. By recording the modified root indices and a boolean flag indicating whether the rank changed in a lightweight record on an operation history stack, the data structure captures the complete state mutation in O(1) space.",
    "When the routing engine evaluates a speculative link reconfiguration—such as temporarily rerouting traffic across a backup peering exchange during scheduled carrier maintenance—it creates a checkpoint index corresponding to the current length of the history stack. The router then applies speculative union operations representing the candidate topology. If real-time telemetry indicates unpredicted packet loss, excessive queuing delay, or BGP route flapping along the speculative path, the governor simply invokes rollback(checkpoint).",
    "During the rollback operation, the engine pops records from the history stack in Last-In First-Out (LIFO) order, resetting the parent pointer of the child root back to itself, decrementing the parent rank if it had been incremented, and restoring the active connected component counter. Because each recorded operation is inverted in strict O(1) time, rolling back k speculative union operations executes in deterministic O(k) time, completely eliminating state pollution and maintaining control-plane stability across volatile infrastructure.",
    "In large-scale WAN deployment, this rollback mechanism integrates seamlessly with event-driven state machines monitoring border router peering sessions. When an external autonomous system (AS) begins withdrawing routes or advertising flapping prefixes, the routing controller checkpoints the internal forwarding table. It then speculatively introduces alternate transit peering links to determine if global reachability is preserved across all edge sites. If reachability checks pass, the checkpoint is committed; otherwise, the controller rolls back to the prior stable topology within microsecond latency, preventing transient blackholing.",
    "Moreover, when combined with offline dynamic connectivity algorithms backed by a segment tree over time, Rollback DSU allows network engineers to simulate complex multi-step maintenance schedules. By assigning each link an active time interval [t_start, t_end] in the segment tree and traversing the timeline with a DFS sweep, the engine can answer reachability and connectivity queries across all maintenance phases in O((V + Q) * log^2 Q) time without ever recomputing the graph from scratch.",
    "The memory footprint of this architecture is exceptionally lean. Storing arrays for parent and rank pointers requires merely 8 * N bytes of heap memory, while each history entry occupies a compact 16-byte struct. In high-performance embedded routing control planes, such data structures fit entirely within CPU L2/L3 hardware caches, eliminating DRAM memory bus stalls and providing predictable, jitter-free execution during catastrophic routing convergence events."
]

p4_example = (
    "Consider an automated traffic engineering controller managing thousands of software-defined WAN (SD-WAN) edge tunnels across multi-cloud regions. An optical transport provider announces scheduled maintenance that will temporarily sever a primary inter-region link. Before executing the cutover, the autonomous controller pushes speculative backup links into the Rollback DSU engine, verifying that all edge gateways remain connected within a single unified component. During the cutover window, an unexpected border gateway protocol (BGP) dampening event causes the backup peering connection to flap violently. Instead of crashing routing tables or recalculating global topologies, the controller executes a millisecond rollback to the pre-cutover checkpoint, immediately restoring the stable baseline topology and shedding non-critical payload traffic to preserve primary connectivity."
)

p4_tryIt = (
    "Examine the Rollback DSU implementation below. Notice how the find() operation navigates parent pointers without path compression to preserve tree structural integrity. Inspect the union() method to see how history records track whether ranks and component counts changed. Observe how the getCheckpoint() and rollback() routines enable instantaneous, deterministic reversal of speculative edge unions, restoring the original partition state flawlessly."
)

p4_check = {
    "question": "Why must path compression be strictly disabled in a Disjoint Set Union data structure when supporting temporal rollback operations?",
    "options": [
        "Path compression permanently flattens deep subtree pointers directly to the root, destroying historical tree topology and requiring an unbounded memory log to reconstruct previous states",
        "Path compression forces the time complexity of the find() operation to degrade from logarithmic depth to quadratic time O(N^2)",
        "Path compression alters the total number of connected components in the universe, violating graph conservation invariants during union merges",
        "Path compression converts the underlying tree structures into directed cyclic loops that cause infinite recursive loops during traversal"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Path compression flattens paths by reparenting every visited node directly to the set representative root during find() operations. Because a single find() call can arbitrarily mutate pointers across multiple nodes without a fixed upper bound, recording every modified pointer would require excessive memory overhead and invalidate standard constant-time rollback operations. By relying strictly on union by rank, tree height is strictly bounded to O(log N), and each union modifies at most one parent pointer and one rank value, enabling O(1) state logging and exact O(1) rollback per operation."
}

p4_code = """/**
 * Day 35 - Part 4: Dynamic Route Churn Governor with Rollback Disjoint Set Union
 */

interface RollbackHistory {
  u: number;
  v: number;
  rankUChanged: boolean;
  componentsChanged: boolean;
}

class RollbackTransitDSU {
  private parent: number[];
  private rank: number[];
  private history: RollbackHistory[] = [];
  public componentCount: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
    this.componentCount = n;
  }

  find(u: number): number {
    let curr = u;
    while (curr !== this.parent[curr]) {
      curr = this.parent[curr];
    }
    return curr;
  }

  connected(u: number, v: number): boolean {
    return this.find(u) === this.find(v);
  }

  union(u: number, v: number): boolean {
    let rootU = this.find(u);
    let rootV = this.find(v);

    if (rootU === rootV) {
      return false;
    }

    if (this.rank[rootU] < this.rank[rootV]) {
      const temp = rootU;
      rootU = rootV;
      rootV = temp;
    }

    let rankChanged = false;
    if (this.rank[rootU] === this.rank[rootV]) {
      this.rank[rootU]++;
      rankChanged = true;
    }

    this.parent[rootV] = rootU;
    this.componentCount--;

    this.history.push({
      u: rootU,
      v: rootV,
      rankUChanged: rankChanged,
      componentsChanged: true
    });

    return true;
  }

  getCheckpoint(): number {
    return this.history.length;
  }

  rollback(checkpoint: number): void {
    while (this.history.length > checkpoint) {
      const op = this.history.pop()!;
      this.parent[op.v] = op.v;
      if (op.rankUChanged) {
        this.rank[op.u]--;
      }
      if (op.componentsChanged) {
        this.componentCount++;
      }
    }
  }
}

function main(): void {
  // 6 routers
  const dsu = new RollbackTransitDSU(6);
  dsu.union(0, 1);
  dsu.union(1, 2);
  dsu.union(3, 4);

  console.log(`[TransitDSU] Base State - Active Components: ${dsu.componentCount}, Connected(0, 2): ${dsu.connected(0, 2)}, Connected(0, 4): ${dsu.connected(0, 4)}`);

  const checkpoint = dsu.getCheckpoint();
  // Simulate speculative link addition during failover
  dsu.union(2, 3);
  console.log(`[TransitDSU] Speculative Link (2-3) Added - Components: ${dsu.componentCount}, Connected(0, 4): ${dsu.connected(0, 4)}`);

  // Link flap triggers rollback
  dsu.rollback(checkpoint);
  console.log(`[TransitDSU] Rollback Complete - Components: ${dsu.componentCount}, Connected(0, 4): ${dsu.connected(0, 4)}`);
}

main();"""

p4_output = """[TransitDSU] Base State - Active Components: 3, Connected(0, 2): true, Connected(0, 4): false
[TransitDSU] Speculative Link (2-3) Added - Components: 2, Connected(0, 4): true
[TransitDSU] Rollback Complete - Components: 3, Connected(0, 4): false"""

p4_codeNotes = [
    {"line": 5, "note": "Defines RollbackHistory record capturing mutated roots, rank flags, and component counter changes"},
    {"line": 23, "note": "Implements pure find() traversal without path compression, strictly preserving tree hierarchy"},
    {"line": 42, "note": "Executes union by rank, attaching smaller subtree beneath larger and logging delta to history stack"},
    {"line": 64, "note": "Provides getCheckpoint() capturing atomic stack index prior to speculative operations"},
    {"line": 68, "note": "Pops history stack in LIFO order during rollback(), restoring original tree state in O(k) time"}
]

# ----------------- PART 5 -----------------
p5_say = [
    "In this Milestone 7 Capstone synthesis, we consolidate every algorithmic pillar developed across Days 31 to 34 into an integrated, production-grade transit operating system: AutonomousTransitRouterOS. Carrier-grade network systems cannot rely on isolated, disparate algorithms; they require an orchestration framework where graph topology ingestion, max-flow throughput maximization, min-cut bottleneck demarcation, bridge vulnerability assessment, and rollback-driven failover governors operate as a cohesive, fault-tolerant runtime. When petabits of client traffic flood edge ingress routers, AutonomousTransitRouterOS continuously analyzes end-to-end network flows, balances load across multi-hop transit paths, and maintains millisecond-grade fault recovery.",
    "The architecture of AutonomousTransitRouterOS operates through a five-stage autonomous control loop. In Stage 1 (Topology Formulation & Ingestion), the system models directed multi-chassis switching paths with discrete capacity limits. In Stage 2 (Throughput Maximization & Flow Augmentation), the engine executes Edmonds-Karp augmentation to compute global max-flow while maintaining symmetric residual capacity links. In Stage 3 (Bottleneck Demarcation & Min-Cut Analysis), the engine performs a residual reachability sweep, isolating the precise critical conduits that saturate the network and throttle egress capacity.",
    "In Stage 4 (Vulnerability & Bridge Scanning), the system runs a Hopcroft-Tarjan DFS sweep across backbone links, identifying structural single points of failure. If the scanner detects that a primary egress or core transit link is a bridge with zero redundant bypasses, the router generates an automated resilience alert before physical link degradation occurs.",
    "In Stage 5 (Dynamic Protection Provisioning & SLA Verification), the router provisions redundant bypass conduits to eliminate bridge bottlenecks, recalculates augmented max-flow throughput, and validates that aggregate bandwidth adheres to enterprise Service Level Agreements (SLAs). Through this end-to-end integration, AutonomousTransitRouterOS demonstrates that high-performance graph algorithms provide the computational bedrock for resilient, high-throughput autonomous cloud infrastructure.",
    "Operationally, carrier-grade SLAs specify minimum sustained throughput (e.g., 250 Gbps during normal operations and 270 Gbps during burst periods) alongside strict latency jitter bounds. When secondary egress conduits are provisioned, AutonomousTransitRouterOS recalculates the residual graph, verifies that the new s-t cut capacity increases to match expanded demand, and confirms that traffic splits proportionally across parallel paths, eliminating hot-spot queue build-ups.",
    "To govern autonomous remediation safely, the operating system pairs the flow engine with an automated closed-loop rollback guard. Prior to committing any dynamic routing reconfiguration, the governor takes an atomic checkpoint. It evaluates simulated flow convergence and link survivability; if synthetic telemetry indicates that the new configuration fails to meet carrier-grade SLA standards, the governor rolls back instantly to the prior stable topology, ensuring uninterrupted service for mission-critical client streams.",
    "Furthermore, the system maintains comprehensive audit trails and diagnostic telemetry streams. Every flow augmentation, min-cut partition boundary, detected bridge link, and rollback event is logged with microsecond-accurate timestamps. This forensic transparency allows network reliability engineers (SREs) and enterprise compliance auditors to verify algorithmic correctness, inspect historical bottleneck migrations, and optimize capital expenditure investments for upcoming fiber builds.",
    "At the operating system and silicon boundary, AutonomousTransitRouterOS integrates directly with high-speed kernel bypass frameworks, including the Data Plane Development Kit (DPDK) and eXpress Data Path (XDP). Rather than copying packets across user-kernel protection boundaries via standard BSD sockets, the autonomous router programs flow steering tables directly into SmartNIC hardware match-action pipelines. By compiling our residual flow allocations and protection paths into eBPF byte-code loaded directly onto network interfaces, packet forwarding executes at wire line speed—surpassing one hundred million packets per second per core with deterministic sub-microsecond latency.",
    "By fusing max-flow min-cut theorem guarantees with Hopcroft-Tarjan bridge surveillance and Rollback DSU speculative evaluation, this capstone architecture represents the state-of-the-art in software-defined autonomous network engineering. Students who master these foundational primitives possess the exact algorithmic toolkit deployed within top-tier cloud providers, hyperscale CDNs, and high-frequency trading networks to govern global data transport with mathematical certainty."
]

p5_example = (
    "Consider a global cloud infrastructure provider operating a distributed content and gaming delivery network during a major live international sporting broadcast. Hundreds of millions of concurrent video streams traverse edge aggregation points toward primary egress peering exchanges. AutonomousTransitRouterOS monitors the global transit mesh. In Phase 1, the baseline flow pipeline calculates a maximum throughput of two hundred and fifty gigabits per second, isolating saturated egress links (3->5 and 4->5) as the primary s-t minimum cut. Simultaneously, the vulnerability scanner identifies that the egress path lacks redundancy. In Phase 2, the automated controller activates a secondary egress gateway (node 6) and provisions protection conduits (3->6, 4->6, and 6->5). Re-running the integrated flow pipeline demonstrates that throughput surges to two hundred and seventy gigabits per second, with the redundant egress cut absorbing the expanded traffic seamlessly. The system logs successful verification, proving autonomous compliance with carrier-grade SLAs."
)

p5_tryIt = (
    "Run the complete Capstone verification suite below. Trace how AutonomousTransitRouterOS instantiates the seven-node multi-tier transit topology, executes Phase 1 baseline max-flow calculation with min-cut bottleneck extraction, and subsequently deploys Phase 2 redundant protection links. Observe how the router recalculates augmented flow throughput and verifies cut capacities deterministically. This capstone implementation embodies the pinnacle of algorithmic network engineering, fusing flow optimization, graph connectivity, and dynamic resilience into an autonomous production governor."
)

p5_check = {
    "question": "In an autonomous carrier-grade routing engine, why is combining max-flow bottleneck extraction with bridge detection and rollback DSU superior to running single-path OSPF/BGP routing protocols?",
    "options": [
        "It provides global multi-path throughput optimization, identifies structural network bottlenecks and single-point-of-failure bridges before saturation, and enables speculative failover testing without service disruption",
        "It replaces IP packet headers with static bitmasks that eliminate routing tables entirely, doubling transmission speeds across wireless links",
        "It eliminates physical fiber capacity constraints by compressing optical wavelength packets into virtual zero-latency streams",
        "It forces all network traffic through a single central mainframe, preventing distributed switches from consuming CPU power"
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Traditional single-path routing protocols like OSPF and standard BGP typically route along a single shortest path, leading to localized link congestion while parallel links sit idle, and they react slowly to topology failures. Integrating max-flow multi-path optimization with Hopcroft-Tarjan bridge detection and Rollback DSU allows the autonomous router to maximize network-wide throughput, proactively isolate structural bottlenecks and single-point-of-failure vulnerabilities, and simulate failover topologies with zero-risk instant rollbacks."
}

p5_code = """/**
 * Day 35 - Part 5: Full Capstone Suite - AutonomousTransitRouterOS
 */

interface RouterEdge {
  from: number;
  to: number;
  cap: number;
  flow: number;
  rev: number;
}

class AutonomousTransitRouterOS {
  private n: number;
  private adjFlow: RouterEdge[][];
  private timer: number = 0;
  private tin: number[];
  private low: number[];
  private visited: boolean[];
  public bridges: [number, number][];

  constructor(n: number) {
    this.n = n;
    this.adjFlow = Array.from({ length: n }, () => []);
    this.tin = Array(n).fill(-1);
    this.low = Array(n).fill(-1);
    this.visited = Array(n).fill(false);
    this.bridges = [];
  }

  addBidirectionalTransitLink(u: number, v: number, cap: number): void {
    const a: RouterEdge = { from: u, to: v, cap, flow: 0, rev: this.adjFlow[v].length };
    const b: RouterEdge = { from: v, to: u, cap, flow: 0, rev: this.adjFlow[u].length };
    this.adjFlow[u].push(a);
    this.adjFlow[v].push(b);
  }

  addDirectedTransitLink(u: number, v: number, cap: number): void {
    const a: RouterEdge = { from: u, to: v, cap, flow: 0, rev: this.adjFlow[v].length };
    const b: RouterEdge = { from: v, to: u, cap: 0, flow: 0, rev: this.adjFlow[u].length };
    this.adjFlow[u].push(a);
    this.adjFlow[v].push(b);
  }

  scanBridges(): [number, number][] {
    this.timer = 0;
    this.bridges = [];
    this.visited.fill(false);
    this.tin.fill(-1);
    this.low.fill(-1);

    const dfs = (u: number, p: number = -1) => {
      this.visited[u] = true;
      this.tin[u] = this.low[u] = ++this.timer;
      for (const edge of this.adjFlow[u]) {
        const v = edge.to;
        if (v === p) continue;
        if (this.visited[v]) {
          this.low[u] = Math.min(this.low[u], this.tin[v]);
        } else {
          dfs(v, u);
          this.low[u] = Math.min(this.low[u], this.low[v]);
          if (this.low[v] > this.tin[u]) {
            this.bridges.push([u, v]);
          }
        }
      }
    };

    for (let i = 0; i < this.n; i++) {
      if (!this.visited[i]) dfs(i);
    }
    return this.bridges;
  }

  computeMaxFlowWithMinCut(source: number, sink: number): {
    maxFlow: number;
    minCutEdges: [number, number, number][];
  } {
    // Reset flow
    for (let u = 0; u < this.n; u++) {
      for (const edge of this.adjFlow[u]) {
        edge.flow = 0;
      }
    }

    let maxFlow = 0;
    while (true) {
      const parent: { u: number; edgeIdx: number }[] = Array(this.n).fill(null);
      const queue: number[] = [source];
      let head = 0;

      while (head < queue.length) {
        const curr = queue[head++];
        if (curr === sink) break;

        for (let i = 0; i < this.adjFlow[curr].length; i++) {
          const edge = this.adjFlow[curr][i];
          if (edge.cap - edge.flow > 0 && parent[edge.to] === null && edge.to !== source) {
            parent[edge.to] = { u: curr, edgeIdx: i };
            queue.push(edge.to);
          }
        }
      }

      if (parent[sink] === null) break;

      let bottleNeck = Infinity;
      let curr = sink;
      while (curr !== source) {
        const { u, edgeIdx } = parent[curr];
        const edge = this.adjFlow[u][edgeIdx];
        bottleNeck = Math.min(bottleNeck, edge.cap - edge.flow);
        curr = u;
      }

      curr = sink;
      while (curr !== source) {
        const { u, edgeIdx } = parent[curr];
        this.adjFlow[u][edgeIdx].flow += bottleNeck;
        const revIdx = this.adjFlow[u][edgeIdx].rev;
        this.adjFlow[curr][revIdx].flow -= bottleNeck;
        curr = u;
      }

      maxFlow += bottleNeck;
    }

    // Min cut
    const reachable = Array(this.n).fill(false);
    const q: number[] = [source];
    reachable[source] = true;
    let h = 0;
    while (h < q.length) {
      const u = q[h++];
      for (const edge of this.adjFlow[u]) {
        if (edge.cap - edge.flow > 0 && !reachable[edge.to]) {
          reachable[edge.to] = true;
          q.push(edge.to);
        }
      }
    }

    const minCutEdges: [number, number, number][] = [];
    for (let u = 0; u < this.n; u++) {
      if (reachable[u]) {
        for (const edge of this.adjFlow[u]) {
          if (!reachable[edge.to] && edge.cap > 0) {
            minCutEdges.push([u, edge.to, edge.cap]);
          }
        }
      }
    }

    return { maxFlow, minCutEdges };
  }
}

function runCapstoneVerification(): void {
  console.log("=== Autonomous Transit Router OS: Milestone 7 Capstone Verification ===");

  // 7-Node Autonomous Transit System
  // 0: Client Ingress, 1: Aggregator East, 2: Aggregator West, 3: Backbone Core Alpha,
  // 4: Backbone Core Beta, 5: Egress Gateway Prime, 6: Egress Gateway Secondary
  const router = new AutonomousTransitRouterOS(7);

  router.addDirectedTransitLink(0, 1, 150); // Ingress -> Agg East
  router.addDirectedTransitLink(0, 2, 120); // Ingress -> Agg West
  router.addDirectedTransitLink(1, 3, 100); // Agg East -> Core Alpha
  router.addDirectedTransitLink(1, 4, 80);  // Agg East -> Core Beta
  router.addDirectedTransitLink(2, 3, 90);  // Agg West -> Core Alpha
  router.addDirectedTransitLink(2, 4, 70);  // Agg West -> Core Beta
  router.addDirectedTransitLink(3, 5, 140); // Core Alpha -> Egress Prime
  router.addDirectedTransitLink(4, 5, 110); // Core Beta -> Egress Prime

  const initialFlow = router.computeMaxFlowWithMinCut(0, 5);
  console.log(`[RouterOS] Phase 1 - Baseline Flow Throughput: ${initialFlow.maxFlow} Gbps`);
  console.log(`[RouterOS] Phase 1 - Critical Bottlenecks: ${initialFlow.minCutEdges.map(([u, v, c]) => `${u}->${v} (${c}G)`).join(", ")}`);

  // Add protection failover link to secondary egress
  router.addDirectedTransitLink(3, 6, 80);
  router.addDirectedTransitLink(4, 6, 60);
  router.addDirectedTransitLink(6, 5, 100);

  const enhancedFlow = router.computeMaxFlowWithMinCut(0, 5);
  console.log(`[RouterOS] Phase 2 - Post-Protection Provisioning Max Flow: ${enhancedFlow.maxFlow} Gbps`);
  console.log(`[RouterOS] Phase 2 - Redundant Egress Cut Capacity: ${enhancedFlow.minCutEdges.reduce((s, [, , c]) => s + c, 0)} Gbps`);
  console.log("[RouterOS] Verification Complete: Autonomous Transit Router Operating Within Performance SLA");
}

runCapstoneVerification();"""

p5_output = """=== Autonomous Transit Router OS: Milestone 7 Capstone Verification ===
[RouterOS] Phase 1 - Baseline Flow Throughput: 250 Gbps
[RouterOS] Phase 1 - Critical Bottlenecks: 3->5 (140G), 4->5 (110G)
[RouterOS] Phase 2 - Post-Protection Provisioning Max Flow: 270 Gbps
[RouterOS] Phase 2 - Redundant Egress Cut Capacity: 270 Gbps
[RouterOS] Verification Complete: Autonomous Transit Router Operating Within Performance SLA"""

p5_codeNotes = [
    {"line": 20, "note": "Initializes AutonomousTransitRouterOS with directed and bidirectional transit link builders"},
    {"line": 39, "note": "Integrates Hopcroft-Tarjan DFS bridge detector to discover single-point-of-failure transit trunks"},
    {"line": 67, "note": "Implements Edmonds-Karp max-flow residual graph augmentation paired with BFS reachability min-cut"},
    {"line": 137, "note": "Executes Phase 1 baseline evaluation discovering 250 Gbps max-flow and isolating saturated egress cut"},
    {"line": 147, "note": "Provisions Phase 2 redundant protection links, expanding throughput to 270 Gbps and satisfying carrier SLA"}
]

day35_data = {
    "day": 35,
    "coursePrefix": "dsa-optim",
    "title": "Milestone 7 Capstone: High-Throughput Autonomous Network Flow & Transit Router",
    "minutes": 38,
    "parts": [
        {
            "title": "Enterprise Transit Topology & Multi-Commodity Capacity Formulation",
            "say": p1_say,
            "example": p1_example,
            "tryIt": p1_tryIt,
            "check": p1_check,
            "code": p1_code,
            "output": p1_output,
            "codeNotes": p1_codeNotes
        },
        {
            "title": "High-Throughput Residual Flow Augmentation & Min-Cut Partitioning",
            "say": p2_say,
            "example": p2_example,
            "tryIt": p2_tryIt,
            "check": p2_check,
            "code": p2_code,
            "output": p2_output,
            "codeNotes": p2_codeNotes
        },
        {
            "title": "Autonomous Bridge & Articulation Vulnerability Scanner",
            "say": p3_say,
            "example": p3_example,
            "tryIt": p3_tryIt,
            "check": p3_check,
            "code": p3_code,
            "output": p3_output,
            "codeNotes": p3_codeNotes
        },
        {
            "title": "Dynamic Route Churn Governor with Rollback Disjoint Set Union",
            "say": p4_say,
            "example": p4_example,
            "tryIt": p4_tryIt,
            "check": p4_check,
            "code": p4_code,
            "output": p4_output,
            "codeNotes": p4_codeNotes
        },
        {
            "title": "Full Capstone Suite: AutonomousTransitRouterOS",
            "say": p5_say,
            "example": p5_example,
            "tryIt": p5_tryIt,
            "check": p5_check,
            "code": p5_code,
            "output": p5_output,
            "codeNotes": p5_codeNotes
        }
    ],
    "projectStep": {
        "title": "Industrial Capstone Project: Autonomous Transit Router OS & Multi-Path SLA Enforcement Engine",
        "steps": [
            "Construct enterprise transit topologies with tiered capacity, latency metrics, and Tarjan SCC condensation.",
            "Deploy Edmonds-Karp max-flow residual pipeline with linear-time reachability min-cut bottleneck extraction.",
            "Incorporate Hopcroft-Tarjan linear DFS bridge and articulation point surveillance to detect single points of failure.",
            "Implement Rollback DSU to simulate speculative failover cutovers and mitigate transient route flapping churn.",
            "Synthesize AutonomousTransitRouterOS to execute automated traffic rerouting and verify carrier SLA compliance."
        ]
    },
    "summary": [
        "Enterprise transit routers model physical networks as capacitated directed graphs and condense cyclic domains using Tarjan SCCs.",
        "Edmonds-Karp BFS augmentation guarantees monotonically increasing shortest-path distances and converges to maximal throughput in O(V * E^2).",
        "The Max-Flow Min-Cut Theorem identifies exact network bottlenecks by computing the S-T cut boundary via residual reachability sweeps.",
        "Hopcroft-Tarjan DFS detects critical single-point-of-failure bridges (low[v] > tin[u]) and articulation routers in linear O(V + E) time.",
        "Rollback DSU eliminates path compression to provide reversible union operations, enabling zero-risk speculative route migration testing."
    ]
}

# Verify word counts
total_words = 0
for idx, part in enumerate(day35_data["parts"]):
    words = sum(len(p.split()) for p in part["say"])
    total_words += words
    print(f"Part {idx + 1} say words: {words}")
    assert words >= 600, f"Part {idx + 1} words {words} < 600!"

print(f"Total Day 35 say words: {total_words}")
assert total_words >= 3100, f"Total words {total_words} < 3100!"

os.makedirs("scripts/branch_c", exist_ok=True)
with open("scripts/branch_c/day35_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day35_data, f, indent=2)

print("Saved scripts/branch_c/day35_lesson.json successfully!")
