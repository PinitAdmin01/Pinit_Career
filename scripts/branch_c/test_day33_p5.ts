interface ResidualEdge {
  to: string;
  rev: number;
  capacity: number;
  flow: number;
  isOriginal: boolean;
}

class EnterpriseTaskAllocationGovernor {
  private adj = new Map<string, ResidualEdge[]>();
  private teams = new Map<string, number>();
  private tasks = new Set<string>();
  private allNodes = new Set<string>();

  registerTeam(team: string, maxTasksPerSprint: number): void {
    this.teams.set(team, maxTasksPerSprint);
    this.allNodes.add(team);
  }

  registerTaskDemand(task: string): void {
    this.tasks.add(task);
    this.allNodes.add(task);
  }

  registerSkillAffinity(team: string, task: string): void {
    this.addEdge(team, task, 1, true);
  }

  private addEdge(u: string, v: string, capacity: number, isOriginal = false): void {
    if (!this.adj.has(u)) this.adj.set(u, []);
    if (!this.adj.has(v)) this.adj.set(v, []);
    this.allNodes.add(u);
    this.allNodes.add(v);

    const fwd: ResidualEdge = { to: v, rev: this.adj.get(v)!.length, capacity, flow: 0, isOriginal };
    const bwd: ResidualEdge = { to: u, rev: this.adj.get(u)!.length, capacity: 0, flow: 0, isOriginal: false };

    this.adj.get(u)!.push(fwd);
    this.adj.get(v)!.push(bwd);
  }

  auditSprintAllocation(): {
    assignedTaskCount: number;
    totalDemandCount: number;
    bottleneckResourceCuts: string[];
    allocations: { team: string; task: string }[];
    governanceStatus: string;
  } {
    const s = 'Source';
    const t = 'Sink';

    for (const [team, quota] of this.teams.entries()) {
      this.addEdge(s, team, quota);
    }
    for (const task of this.tasks) {
      this.addEdge(task, t, 1);
    }

    // Edmonds-Karp Max Flow
    let totalAssigned = 0;
    while (true) {
      const parentNode = new Map<string, string>();
      const parentEdgeIdx = new Map<string, number>();
      const queue: string[] = [s];
      parentNode.set(s, s);

      while (queue.length > 0 && !parentNode.has(t)) {
        const curr = queue.shift()!;
        for (let i = 0; i < (this.adj.get(curr) || []).length; i++) {
          const e = this.adj.get(curr)![i];
          if (e.capacity - e.flow > 0 && !parentNode.has(e.to)) {
            parentNode.set(e.to, curr);
            parentEdgeIdx.set(e.to, i);
            queue.push(e.to);
          }
        }
      }

      if (!parentNode.has(t)) break;

      let bottleneck = Infinity;
      let curr = t;
      while (curr !== s) {
        const p = parentNode.get(curr)!;
        const idx = parentEdgeIdx.get(curr)!;
        const e = this.adj.get(p)![idx];
        bottleneck = Math.min(bottleneck, e.capacity - e.flow);
        curr = p;
      }

      curr = t;
      while (curr !== s) {
        const p = parentNode.get(curr)!;
        const idx = parentEdgeIdx.get(curr)!;
        const e = this.adj.get(p)![idx];
        e.flow += bottleneck;
        const rev = this.adj.get(e.to)![e.rev];
        rev.flow -= bottleneck;
        curr = p;
      }
      totalAssigned += bottleneck;
    }

    // Min-Cut extraction via residual reachability from Source S
    const reachableS = new Set<string>();
    const queue: string[] = [s];
    reachableS.add(s);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      for (const e of this.adj.get(curr) || []) {
        if (e.capacity - e.flow > 0 && !reachableS.has(e.to)) {
          reachableS.add(e.to);
          queue.push(e.to);
        }
      }
    }

    const bottleneckCuts: string[] = [];
    for (const u of reachableS) {
      for (const e of this.adj.get(u) || []) {
        if (e.capacity > 0 && !reachableS.has(e.to)) {
          bottleneckCuts.push(`${u} -> ${e.to} (Cap: ${e.capacity})`);
        }
      }
    }

    const allocations: { team: string; task: string }[] = [];
    for (const [team] of this.teams.entries()) {
      for (const e of this.adj.get(team) || []) {
        if (this.tasks.has(e.to) && e.flow === 1) {
          allocations.push({ team, task: e.to });
        }
      }
    }

    const status = totalAssigned === this.tasks.size ? 'OPTIMAL (ALL DEMANDS MET)' : 'CONSTRAINED (CAPACITY DEFICIT)';

    return {
      assignedTaskCount: totalAssigned,
      totalDemandCount: this.tasks.size,
      bottleneckResourceCuts: bottleneckCuts,
      allocations,
      governanceStatus: status
    };
  }
}

const governor = new EnterpriseTaskAllocationGovernor();
governor.registerTeam('PlatformTeam', 2);
governor.registerTeam('SecurityTeam', 1);
governor.registerTeam('DataTeam', 2);

governor.registerTaskDemand('KubernetesUpgrade');
governor.registerTaskDemand('VulnerabilityAudit');
governor.registerTaskDemand('PipelineOptimization');
governor.registerTaskDemand('SchemaMigration');
governor.registerTaskDemand('ETLPipeline');

governor.registerSkillAffinity('PlatformTeam', 'KubernetesUpgrade');
governor.registerSkillAffinity('PlatformTeam', 'PipelineOptimization');
governor.registerSkillAffinity('SecurityTeam', 'VulnerabilityAudit');
governor.registerSkillAffinity('DataTeam', 'SchemaMigration');
governor.registerSkillAffinity('DataTeam', 'ETLPipeline');

const report = governor.auditSprintAllocation();
console.log('=== SPRINT TASK ALLOCATION GOVERNANCE REPORT ===');
console.log(`Assigned Tasks: ${report.assignedTaskCount} / ${report.totalDemandCount}`);
console.log('Active Sprint Allocations:');
report.allocations.forEach(a => console.log(`- ${a.team} assigned to: ${a.task}`));
console.log(`Bottleneck Resource Cuts Identified: ${report.bottleneckResourceCuts.length}`);
report.bottleneckResourceCuts.forEach(b => console.log(`- Cut: ${b}`));
console.log(`Governance Status: ${report.governanceStatus}`);
