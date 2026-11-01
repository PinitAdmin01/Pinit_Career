import type { GeneratedTask } from './generateTask';

/**
 * Generates deterministic 5 web Tier 1 job simulation tickets for a given company.
 * Covers: component, component_bug_fix, form_validation, refactor, and small_feature.
 */
export function getSeedWebTier1Tasks(company: { name: string; industry: string }): GeneratedTask[] {
  const companyName = company.name || 'PulseSync Systems';

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
      skills: ['Conditional Rendering and Lists', 'React Components'],
    },

    // Ticket 3: form_validation
    {
      title: 'Implement ThresholdInput form validation',
      brief: `At ${companyName}, engineers configure alerting thresholds between 0 and 100%.
Implement a ThresholdInput component that receives an "onChange" callback prop. It renders an input of type "number" and displays an error message with class "input-error" if the value is outside the 0–100 range or not a valid number.`,
      starter_code: `export function ThresholdInput({ onChange }: { onChange: (val: number | null) => void }) {
  return <input type="number" />;
}
`,
      visible_tests: `const res1 = render(ThresholdInput, { onChange: () => {} });
assert(res1.includes('<input'));
assert(res1.includes('type="number"'));
`,
      hidden_tests: `const res2 = render(ThresholdInput, { onChange: () => {} });
assert(res2.includes('<input'));
`,
      reference_solution: `import React, { useState } from 'react';

export function ThresholdInput({ onChange }: { onChange: (val: number | null) => void }) {
  const [val, setVal] = useState<string>('');
  const [err, setErr] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setVal(raw);
    const num = Number(raw);
    if (isNaN(num) || num < 0 || num > 100) {
      setErr('Threshold must be between 0 and 100');
      onChange(null);
    } else {
      setErr(null);
      onChange(num);
    }
  };

  return (
    <div>
      <input type="number" value={val} onChange={handleChange} min={0} max={100} />
      {err && <span className="input-error">{err}</span>}
    </div>
  );
}
`,
      skills: ['State Management (useState)', 'Event Handling and Form Inputs'],
    },

    // Ticket 4: refactor
    {
      title: 'Refactor LogViewer into clean list items',
      brief: `Refactor the LogViewer component at ${companyName} to render a collection of logs passed in as props. Each log contains id, timestamp, and message.
Ensure each item renders with key=id and class "log-item".`,
      starter_code: `export function LogViewer({ logs }: { logs: Array<{ id: string; timestamp: string; message: string }> }) {
  return <div>{JSON.stringify(logs)}</div>;
}
`,
      visible_tests: `const logs = [{ id: "l1", timestamp: "10:00", message: "Server started" }];
const html = render(LogViewer, { logs });
assert(html.includes("Server started"));
assert(html.includes("log-item"));
`,
      hidden_tests: `const logs2 = [
  { id: "1", timestamp: "10:01", message: "Cache hit" },
  { id: "2", timestamp: "10:02", message: "Cache miss" }
];
const html2 = render(LogViewer, { logs: logs2 });
assert(html2.includes("Cache hit"));
assert(html2.includes("Cache miss"));
`,
      reference_solution: `export function LogViewer({ logs }: { logs: Array<{ id: string; timestamp: string; message: string }> }) {
  return (
    <ul className="log-viewer">
      {logs.map((log) => (
        <li key={log.id} className="log-item">
          <span className="log-time">{log.timestamp}</span>
          <span className="log-msg">{log.message}</span>
        </li>
      ))}
    </ul>
  );
}
`,
      skills: ['Conditional Rendering and Lists', 'Props and Typing'],
    },

    // Ticket 5: small_feature
    {
      title: 'Build NotificationToggle with active count',
      brief: `Build a NotificationToggle component at ${companyName}.
It accepts "initialActive" (boolean) and "unreadCount" (number). It renders a toggle button with class "toggle-btn" and an unread badge with class "unread-badge" when unreadCount > 0.`,
      starter_code: `export function NotificationToggle(props: { initialActive?: boolean; unreadCount: number }) {
  return <button className="toggle-btn">Toggle</button>;
}
`,
      visible_tests: `const html = render(NotificationToggle, { unreadCount: 5 });
assert(html.includes("toggle-btn"));
assert(html.includes("unread-badge"));
assert(html.includes("5"));
`,
      hidden_tests: `const html2 = render(NotificationToggle, { unreadCount: 0 });
assert(html2.includes("toggle-btn"));
assert(!html2.includes("unread-badge"));
`,
      reference_solution: `import React, { useState } from 'react';

export function NotificationToggle({ initialActive = false, unreadCount }: { initialActive?: boolean; unreadCount: number }) {
  const [active, setActive] = useState(initialActive);

  return (
    <button
      type="button"
      className={\`toggle-btn \${active ? 'active' : 'inactive'}\`}
      onClick={() => setActive(!active)}
    >
      <span>Alerts: {active ? 'ON' : 'OFF'}</span>
      {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
    </button>
  );
}
`,
      skills: ['State Management (useState)', 'Event Handling and Form Inputs', 'React Components'],
    },
  ];
}
