import { FICTIONAL_COMPANY_PREFIX } from './companyProfile';
import type { GeneratedTask } from './generateTask';

export interface SeedCompany {
  name: string;
  industry: string;
  readme: string;
}

export const TIER1_WEB_TICKET_KINDS = [
  'component',
  'component_bug_fix',
  'form_validation',
  'refactor',
  'small_feature',
] as const;

export type Tier1WebTicketKind = (typeof TIER1_WEB_TICKET_KINDS)[number];

export const TIER1_WEB_MONTH1_SKILLS = [
  'React Components',
  'JSX and Element Rendering',
  'Props and Typing',
  'State Management (useState)',
  'Event Handling and Form Inputs',
  'Conditional Rendering and Lists',
  'Component Lifecycle and Effects (useEffect)',
] as const;

export const WEB_TIER1_SEED_COMPANIES: readonly SeedCompany[] = [
  {
    name: 'CloudPulse Analytics',
    industry: 'Cloud Infrastructure Monitoring',
    readme: `${FICTIONAL_COMPANY_PREFIX}
Welcome to CloudPulse Analytics. We provide real-time telemetry, server metric graphs, and latency dashboards for cloud-native engineering teams.
As an intern on the Frontend Engineering team, you will build and refine React UI components, fix stateful bugs, validate operational inputs, and enhance customer dashboards.`,
  },
  {
    name: 'NovaHealth Telemedicine',
    industry: 'Digital Patient Healthcare',
    readme: `${FICTIONAL_COMPANY_PREFIX}
Welcome to NovaHealth Telemedicine. Our platform connects remote healthcare providers with patients for asynchronous consultations, prescription tracking, and appointment scheduling.
As a web engineering intern, you will implement accessible patient portal components, ensure bulletproof form validation, and refine clinician interfaces.`,
  },
  {
    name: 'FinTrack Global',
    industry: 'Personal Wealth & Financial Analytics',
    readme: `${FICTIONAL_COMPANY_PREFIX}
Welcome to FinTrack Global. We build secure personal budgeting software, automated portfolio allocation trackers, and real-time currency conversion widgets.
Your internship tasks focus on developing performant React components, fixing rendering edge cases, and delivering crisp financial UI controls.`,
  },
] as const;

/**
 * Generates the deterministic 5 web Tier 1 job simulation tickets for a given company.
 * Covers: component, component_bug_fix, form_validation, refactor, and small_feature.
 */
export function getSeedWebTier1Tasks(company: { name: string; industry: string }): GeneratedTask[] {
  const companyName = company.name || 'CloudPulse Analytics';

  return [
    // Ticket 1: component
    {
      title: 'Build the MetricCard component',
      brief: `At ${companyName}, our dashboard displays infrastructure health across thousands of nodes.
Create a MetricCard component that accepts "title" (string), "value" (number or string), and an optional "unit" (string).
The component must render a div with class "metric-card", a heading (h3) for the title, and a paragraph or span with class "metric-value" displaying value and optional unit.`,
      starter_code: `export function MetricCard(props: { title: string; value: string | number; unit?: string }) {
  return <div className="metric-card">TODO</div>;
}
`,
      visible_tests: `const html1 = render(MetricCard, { title: "CPU Usage", value: 42, unit: "%" });
assert(html1.includes("CPU Usage"));
assert(html1.includes("42%"));
assert(html1.includes('class="metric-card"'));
`,
      hidden_tests: `const html2 = render(MetricCard, { title: "Active Nodes", value: 128 });
assert(html2.includes("Active Nodes"));
assert(html2.includes("128"));
const html3 = render(MetricCard, { title: "Latency", value: 2.4, unit: "ms" });
assert(html3.includes("2.4ms"));
assert(html3.includes("<h3"));
`,
      reference_solution: `export function MetricCard({ title, value, unit }: { title: string; value: string | number; unit?: string }) {
  const displayVal = unit ? \`\${value}\${unit}\` : String(value);
  return (
    <div className="metric-card">
      <h3 className="metric-title">{title}</h3>
      <span className="metric-value">{displayVal}</span>
    </div>
  );
}
`,
      skills: ['React Components', 'JSX and Element Rendering', 'Props and Typing'],
    },

    // Ticket 2: component_bug_fix
    {
      title: 'Fix StatusBadge conditional rendering bug',
      brief: `In the ${companyName} incident tracker, the StatusBadge component incorrectly renders undefined badges or missing fallback labels when a status is unrecognized.
Fix the StatusBadge component to accept "status" ('online' | 'offline' | 'degraded') and render a span with class "status-badge status-{status}".
If status is unrecognized or empty, fallback to "status-unknown" and render "Unknown".`,
      starter_code: `export function StatusBadge({ status }: { status: string }) {
  // BUGGY: does not handle unknown statuses or correct class naming
  return <span className="status-badge">{status}</span>;
}
`,
      visible_tests: `const html1 = render(StatusBadge, { status: "online" });
assert(html1.includes("status-online"));
assert(html1.includes("online"));
const html2 = render(StatusBadge, { status: "offline" });
assert(html2.includes("status-offline"));
assert(html2.includes("offline"));
`,
      hidden_tests: `const html3 = render(StatusBadge, { status: "degraded" });
assert(html3.includes("status-degraded"));
const html4 = render(StatusBadge, { status: "invalid-code" });
assert(html4.includes("status-unknown"));
assert(html4.includes("Unknown"));
const html5 = render(StatusBadge, { status: "" });
assert(html5.includes("status-unknown"));
`,
      reference_solution: `export function StatusBadge({ status }: { status: string }) {
  const allowed = ['online', 'offline', 'degraded'];
  const isKnown = allowed.includes(status);
  const safeStatus = isKnown ? status : 'unknown';
  const label = isKnown ? status : 'Unknown';

  return <span className={\`status-badge status-\${safeStatus}\`}>{label}</span>;
}
`,
      skills: ['React Components', 'Conditional Rendering and Lists', 'Props and Typing'],
    },

    // Ticket 3: form_validation
    {
      title: 'Implement ValidateEmailInput component',
      brief: `Our signup and alert registration modal at ${companyName} needs clean client-side validation.
Implement ValidateEmailInput that takes "value" (string), "required" (boolean), and renders an input container.
If the email is empty and required, or does not contain an "@" and a ".", render an error paragraph with class "error-msg" stating "Invalid email address".
When valid, no error paragraph should be rendered.`,
      starter_code: `export function ValidateEmailInput({ value, required }: { value: string; required?: boolean }) {
  return (
    <div className="input-group">
      <input type="email" defaultValue={value} />
    </div>
  );
}
`,
      visible_tests: `const h1 = render(ValidateEmailInput, { value: "test@domain.com", required: true });
assert(!h1.includes("error-msg"));
const h2 = render(ValidateEmailInput, { value: "invalid-address", required: true });
assert(h2.includes("error-msg"));
assert(h2.includes("Invalid email address"));
`,
      hidden_tests: `const h3 = render(ValidateEmailInput, { value: "", required: true });
assert(h3.includes("error-msg"));
const h4 = render(ValidateEmailInput, { value: "", required: false });
assert(!h4.includes("error-msg"));
const h5 = render(ValidateEmailInput, { value: "admin@cloudpulse.io", required: false });
assert(!h5.includes("error-msg"));
`,
      reference_solution: `export function ValidateEmailInput({ value, required }: { value: string; required?: boolean }) {
  const isBlank = !value || value.trim() === '';
  const hasValidFormat = value && value.includes('@') && value.includes('.');
  const hasError = (required && isBlank) || (!isBlank && !hasValidFormat);

  return (
    <div className="input-group">
      <input type="email" defaultValue={value} />
      {hasError && <p className="error-msg">Invalid email address</p>}
    </div>
  );
}
`,
      skills: ['Event Handling and Form Inputs', 'Conditional Rendering and Lists', 'React Components'],
    },

    // Ticket 4: refactor
    {
      title: 'Refactor ServerList to use typed subcomponents',
      brief: `The server overview table at ${companyName} had redundant markup.
Refactor ServerList to accept "servers": Array<{ id: string; name: string; port: number; active: boolean }>.
Render an unordered list with class "server-list". Each item must be rendered inside an li with key and class "server-item", showing "name (port) - Active" or "name (port) - Inactive".`,
      starter_code: `export function ServerList({ servers }: { servers: Array<{ id: string; name: string; port: number; active: boolean }> }) {
  return <div>Not implemented</div>;
}
`,
      visible_tests: `const sample = [
  { id: "s1", name: "auth-service", port: 8080, active: true },
  { id: "s2", name: "cache-redis", port: 6379, active: false }
];
const h1 = render(ServerList, { servers: sample });
assert(h1.includes('class="server-list"'));
assert(h1.includes("auth-service (8080) - Active"));
assert(h1.includes("cache-redis (6379) - Inactive"));
`,
      hidden_tests: `const h2 = render(ServerList, { servers: [] });
assert(h2.includes('class="server-list"'));
const sample2 = [
  { id: "s3", name: "gateway", port: 443, active: true }
];
const h3 = render(ServerList, { servers: sample2 });
assert(h3.includes("gateway (443) - Active"));
assert(h3.includes('class="server-item"'));
`,
      reference_solution: `export function ServerListItem({ name, port, active }: { name: string; port: number; active: boolean }) {
  const stateLabel = active ? 'Active' : 'Inactive';
  return (
    <li className="server-item">
      {name} ({port}) - {stateLabel}
    </li>
  );
}

export function ServerList({ servers }: { servers: Array<{ id: string; name: string; port: number; active: boolean }> }) {
  return (
    <ul className="server-list">
      {servers.map((s) => (
        <ServerListItem key={s.id} name={s.name} port={s.port} active={s.active} />
      ))}
    </ul>
  );
}
`,
      skills: ['React Components', 'Props and Typing', 'Conditional Rendering and Lists'],
    },

    // Ticket 5: small_feature
    {
      title: 'Build AlertCounter badge feature',
      brief: `Our operations center at ${companyName} needs a badge feature to notify engineers of pending alarms.
Implement AlertCounter that accepts "count" (number) and "maxDisplay" (optional number, defaults to 99).
Render a span with class "alert-badge".
If count is 0, render nothing (null or empty string).
If count is greater than maxDisplay, display "\${maxDisplay}+" (e.g. "99+"). Otherwise display the count as string.`,
      starter_code: `export function AlertCounter({ count, maxDisplay = 99 }: { count: number; maxDisplay?: number }) {
  return <span>0</span>;
}
`,
      visible_tests: `const h1 = render(AlertCounter, { count: 5 });
assert(h1.includes('class="alert-badge"'));
assert(h1.includes("5"));
const h2 = render(AlertCounter, { count: 0 });
assert(!h2.includes("alert-badge"));
`,
      hidden_tests: `const h3 = render(AlertCounter, { count: 150, maxDisplay: 99 });
assert(h3.includes("99+"));
const h4 = render(AlertCounter, { count: 12, maxDisplay: 10 });
assert(h4.includes("10+"));
const h5 = render(AlertCounter, { count: 50, maxDisplay: 100 });
assert(h5.includes("50"));
`,
      reference_solution: `export function AlertCounter({ count, maxDisplay = 99 }: { count: number; maxDisplay?: number }) {
  if (count <= 0) {
    return null;
  }
  const label = count > maxDisplay ? \`\${maxDisplay}+\` : String(count);
  return <span className="alert-badge">{label}</span>;
}
`,
      skills: ['React Components', 'Props and Typing', 'Conditional Rendering and Lists'],
    },
  ];
}
