import sys, os
sys.path.insert(0, os.path.abspath('.'))
from scripts.design_day57_data import DAY_57

DAY_57['parts'][2]['code'] = r"""// Enterprise Deprecation Analyzer & Automated Codemod Suggestion Engine
interface DeprecationRule {
  component: string;
  deprecatedProp?: string;
  suggestedProp?: string;
  migrationGuideUrl: string;
  severity: 'warning' | 'error';
  autoFix?: (props: Record<string, any>) => Record<string, any>;
}

interface DeprecationFinding {
  component: string;
  propName?: string;
  line: number;
  message: string;
  fixedProps?: Record<string, any>;
}

class DeprecationEngine {
  private rules: DeprecationRule[] = [];

  public registerRule(rule: DeprecationRule): void {
    this.rules.push(rule);
  }

  public auditUsages(
    usages: { component: string; props: Record<string, any>; line: number }[]
  ): DeprecationFinding[] {
    const findings: DeprecationFinding[] = [];

    for (const usage of usages) {
      for (const rule of this.rules) {
        if (rule.component === usage.component) {
          // Check deprecated prop
          if (rule.deprecatedProp && rule.deprecatedProp in usage.props) {
            const fixedProps = rule.autoFix ? rule.autoFix({ ...usage.props }) : undefined;
            findings.push({
              component: usage.component,
              propName: rule.deprecatedProp,
              line: usage.line,
              message: "Prop '" + rule.deprecatedProp + "' on <" + usage.component + "> is deprecated. See: " + rule.migrationGuideUrl,
              fixedProps
            });
          }
        }
      }
    }

    return findings;
  }
}

// Register enterprise migration rules
const engine = new DeprecationEngine();
engine.registerRule({
  component: 'Button',
  deprecatedProp: 'isPrimary',
  suggestedProp: 'variant="primary"',
  migrationGuideUrl: 'https://pinit.dev/migration/v2#button-variants',
  severity: 'warning',
  autoFix: (props) => {
    delete props['isPrimary'];
    props['variant'] = 'primary';
    return props;
  }
});

// Audit consumer component usages
const auditUsages = [
  { component: 'Button', props: { isPrimary: 'true', size: 'md' }, line: 42 },
  { component: 'Button', props: { variant: 'primary', size: 'lg' }, line: 88 }
];

const findings = engine.auditUsages(auditUsages);

console.log("Total Deprecation Warnings: " + findings.length);
findings.forEach(f => {
  console.log("[Line " + f.line + "] " + f.message);
  if (f.fixedProps) {
    console.log("  --> Autofix Transform Result: " + JSON.stringify(f.fixedProps));
  }
});
"""

# Also clean Part 5 template literals
DAY_57['parts'][4]['code'] = r"""// Sovereign Enterprise Telemetry Dashboard & Governance Platform
interface SystemAuditSummary {
  enterpriseName: string;
  totalRepositories: number;
  totalComponentsMonitored: number;
  overallAdoptionRate: number;
  deprecationDebtCount: number;
  topAdoptedComponents: { name: string; count: number }[];
  criticalMigrationActionItems: string[];
}

class SovereignGovernanceDashboard {
  public static generateExecutiveReport(
    orgName: string,
    repoScorecards: { name: string; adoptionRate: number; elements: number; deprecations: number }[],
    componentCounts: Record<string, number>
  ): SystemAuditSummary {
    const totalRepos = repoScorecards.length;
    const totalElements = repoScorecards.reduce((acc, r) => acc + r.elements, 0);
    const weightedAdoption = repoScorecards.reduce((acc, r) => acc + (r.adoptionRate * r.elements), 0) / (totalElements || 1);
    const totalDeprecations = repoScorecards.reduce((acc, r) => acc + r.deprecations, 0);

    const topAdopted = Object.entries(componentCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const actionItems: string[] = [];
    for (const r of repoScorecards) {
      if (r.adoptionRate < 70) {
        actionItems.push("Repository '" + r.name + "' has low adoption (" + r.adoptionRate.toFixed(1) + "%). Schedule architectural pairing.");
      }
      if (r.deprecations > 10) {
        actionItems.push("Repository '" + r.name + "' has " + r.deprecations + " deprecated usages. Trigger automated ESLint codemod.");
      }
    }

    return {
      enterpriseName: orgName,
      totalRepositories: totalRepos,
      totalComponentsMonitored: Object.keys(componentCounts).length,
      overallAdoptionRate: weightedAdoption,
      deprecationDebtCount: totalDeprecations,
      topAdoptedComponents: topAdopted,
      criticalMigrationActionItems: actionItems
    };
  }
}

// Sample enterprise ecosystem data
const repos = [
  { name: 'wealth-portal', adoptionRate: 94.2, elements: 450, deprecations: 2 },
  { name: 'institutional-trading', adoptionRate: 86.5, elements: 1200, deprecations: 14 },
  { name: 'retail-banking-mobile', adoptionRate: 64.0, elements: 800, deprecations: 35 }
];

const counts = {
  Button: 3200,
  Dialog: 850,
  DataGrid: 420,
  Input: 2100,
  Badge: 1400
};

const report = SovereignGovernanceDashboard.generateExecutiveReport('PinIT Global Capital', repos, counts);

console.log("=== " + report.enterpriseName + " Design System Governance Report ===");
console.log("Monitored Repositories: " + report.totalRepositories);
console.log("Overall Enterprise Adoption: " + report.overallAdoptionRate.toFixed(1) + "%");
console.log("Total Deprecation Debt: " + report.deprecationDebtCount + " instances");
console.log("Top Adopted Components:");
report.topAdoptedComponents.forEach(c => console.log("  - " + c.name + ": " + c.count + " instances"));
console.log("Critical Action Items (" + report.criticalMigrationActionItems.length + "):");
report.criticalMigrationActionItems.forEach(a => console.log("  [!] " + a));
"""

with open('scripts/design_day57_data.py', 'w', encoding='utf-8') as f:
    f.write('''# scripts/design_day57_data.py
import re
import sys

def count_words(text_list):
    words = len(re.findall(r'\\b[A-Za-z0-9_\\-\\.\\$\\/:\\@\\\']+\\b', ' '.join(text_list)))
    return words

DAY_57 = ''' + repr(DAY_57) + '''

if __name__ == '__main__':
    print(f"Day 57: {DAY_57['title']}")
    for i, p in enumerate(DAY_57['parts'], 1):
        w = count_words(p['say'])
        print(f"  Part {i}: {w} words")
        assert w >= 600, f"Part {i} has {w} words (< 600)"
    print("Day 57 verification complete!")
''')

print("Successfully updated Parts 3 and 5 code in design_day57_data.py!")
