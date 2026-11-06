// scripts/branch_c/test_day41_snippets.ts

// --- Snippet 1: Tree DFS Post-Order Traversal & Subtree Sizing ---
export class TreeNode {
  public children: number[] = [];
  constructor(public id: number, public weight: number = 1) {}
}

export function computeSubtreeSizes(adj: number[][], root = 0): { sizes: number[]; order: number[] } {
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
    order.push(u); // post-order visit
  }

  dfs(root, -1);
  return { sizes, order };
}

console.log("=== Snippet 1: Tree Post-Order Subtree Sizing ===");
const sampleTree = [
  [1, 2],    // 0 -> 1, 2
  [0, 3, 4], // 1 -> 0, 3, 4
  [0],       // 2 -> 0
  [1],       // 3 -> 1
  [1],       // 4 -> 1
];
const { sizes, order } = computeSubtreeSizes(sampleTree, 0);
console.log(`Subtree sizes: [${sizes.join(", ")}]`);
console.log(`Post-order traversal: [${order.join(", ")}]`);

// --- Snippet 2: Maximum Independent Set on Trees ---
export interface MISResult {
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
        // If u is taken, child v cannot be taken
        dpTaken[u] += dpNotTaken[v];
        // If u is not taken, child v can be either taken or not taken
        dpNotTaken[u] += Math.max(dpTaken[v], dpNotTaken[v]);
      }
    }
  }

  dfs(root, -1);
  const maxWeight = Math.max(dpTaken[root], dpNotTaken[root]);
  return { maxWeight, dpNotTaken, dpTaken };
}

console.log("\n=== Snippet 2: Maximum Independent Set on Trees ===");
const nodeWeights = [10, 5, 8, 7, 6];
const misResult = maxIndependentSetTree(sampleTree, nodeWeights, 0);
console.log(`Weights: [${nodeWeights.join(", ")}]`);
console.log(`Maximum Independent Set Weight: ${misResult.maxWeight}`);
console.log(`Root Taken: ${misResult.dpTaken[0]}, Root Not Taken: ${misResult.dpNotTaken[0]}`);

// --- Snippet 3: Tree Centroid Discovery ---
export function findTreeCentroids(adj: number[][]): number[] {
  const n = adj.length;
  const { sizes } = computeSubtreeSizes(adj, 0);
  const centroids: number[] = [];

  function dfs(u: number, parent: number): void {
    let isCentroid = true;
    for (const v of adj[u]) {
      if (v !== parent) {
        dfs(v, u);
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

  dfs(0, -1);
  return centroids;
}

console.log("\n=== Snippet 3: Tree Centroid Discovery ===");
const centroids = findTreeCentroids(sampleTree);
console.log(`Tree Centroid(s): [${centroids.join(", ")}]`);

// --- Snippet 4: Minimum Vertex Cover on Trees ---
export interface MVCResult {
  minCoverSize: number;
  dpNotCover: number[];
  dpCover: number[];
}

export function minVertexCoverTree(adj: number[][], root = 0): MVCResult {
  const n = adj.length;
  const dpNotCover = new Array<number>(n).fill(0);
  const dpCover = new Array<number>(n).fill(0);

  function dfs(u: number, parent: number): void {
    dpCover[u] = 1; // including node u costs 1
    dpNotCover[u] = 0;

    for (const v of adj[u]) {
      if (v !== parent) {
        dfs(v, u);
        // If u is not in cover, all children MUST be in cover to cover edge (u, v)
        dpNotCover[u] += dpCover[v];
        // If u is in cover, child v can be either in or out
        dpCover[u] += Math.min(dpCover[v], dpNotCover[v]);
      }
    }
  }

  dfs(root, -1);
  const minCoverSize = Math.min(dpCover[root], dpNotCover[root]);
  return { minCoverSize, dpNotCover, dpCover };
}

console.log("\n=== Snippet 4: Minimum Vertex Cover ===");
const mvcResult = minVertexCoverTree(sampleTree, 0);
console.log(`Minimum Vertex Cover Size: ${mvcResult.minCoverSize}`);
console.log(`Duality Check: MIS (${5 - mvcResult.minCoverSize}) + MVC (${mvcResult.minCoverSize}) = Total Nodes (5)`);

// --- Snippet 5: Enterprise Distributed Microservice Role Allocator ---
export interface ServiceNode {
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

    // Backtrack to reconstruct optimal node selection
    const selected = new Set<number>();

    function reconstruct(u: number, parent: number, parentSelected: boolean): void {
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

console.log("\n=== Snippet 5: Enterprise Cluster Role Allocator ===");
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
}
