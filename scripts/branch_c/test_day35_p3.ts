/**
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

main();
