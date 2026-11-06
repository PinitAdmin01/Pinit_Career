const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DESKTOP_DIR = 'C:\\Users\\Admin\\Desktop';
const DOCS_DIR = path.join(__dirname, '..', '..', 'docs', 'directives');

if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

const COMMON_STYLES = `
  @page {
    size: A4 portrait;
    margin: 10mm 12mm 10mm 12mm;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #0f172a;
    background: #ffffff;
    line-height: 1.36;
    font-size: 8.5pt;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .header-card {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #ffffff;
    padding: 14px 18px;
    border-radius: 6px;
    margin-bottom: 12px;
    border-left: 6px solid #6366f1;
  }
  .header-card h1 {
    font-size: 15pt;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 3px;
  }
  .header-card .subtitle {
    font-size: 9pt;
    color: #94a3b8;
    font-weight: 500;
    margin-bottom: 8px;
  }
  .meta-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    background: rgba(255, 255, 255, 0.08);
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 7.5pt;
  }
  .meta-item strong {
    color: #cbd5e1;
    display: block;
    font-size: 6.8pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .meta-item span { color: #ffffff; font-weight: 600; }
  h2 {
    font-size: 10.5pt;
    font-weight: 700;
    color: #0f172a;
    border-bottom: 1.5px solid #cbd5e1;
    padding-bottom: 3px;
    margin-top: 10px;
    margin-bottom: 6px;
  }
  h3 {
    font-size: 9pt;
    font-weight: 700;
    color: #1e293b;
    margin-top: 8px;
    margin-bottom: 3px;
  }
  p { margin-bottom: 5px; color: #334155; text-align: justify; }
  .alert-box {
    padding: 8px 12px;
    border-radius: 4px;
    margin: 6px 0;
    font-size: 8pt;
    border-left: 4px solid;
  }
  .alert-critical { background: #fef2f2; border-color: #ef4444; color: #991b1b; }
  .alert-warning { background: #fffbeb; border-color: #f59e0b; color: #92400e; }
  .alert-success { background: #f0fdf4; border-color: #10b981; color: #065f46; }
  .alert-info { background: #eef2ff; border-color: #6366f1; color: #3730a3; }
  .badge {
    display: inline-block;
    padding: 1.5px 5px;
    border-radius: 3px;
    font-size: 6.8pt;
    font-weight: 700;
    text-transform: uppercase;
  }
  .badge-purple { background: #f3e8ff; color: #7e22ce; }
  .badge-blue { background: #e0f2fe; color: #0369a1; }
  .badge-green { background: #dcfce7; color: #15803d; }
  .badge-amber { background: #fef3c7; color: #b45309; }
  .badge-red { background: #fee2e2; color: #b91c1c; }

  table { width: 100%; border-collapse: collapse; margin: 6px 0; font-size: 7.6pt; }
  th {
    background: #f1f5f9;
    color: #334155;
    font-weight: 700;
    text-align: left;
    padding: 5px 6px;
    border: 1px solid #cbd5e1;
    text-transform: uppercase;
    font-size: 6.8pt;
  }
  td { padding: 4px 6px; border: 1px solid #e2e8f0; color: #334155; vertical-align: top; }
  tr:nth-child(even) td { background: #f8fafc; }
  code {
    font-family: "JetBrains Mono", Consolas, monospace;
    font-size: 7.2pt;
    background: #f1f5f9;
    padding: 1px 3px;
    border-radius: 2px;
    color: #0f172a;
    border: 1px solid #e2e8f0;
  }
  .block-card {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 6px 10px;
    margin-bottom: 6px;
    break-inside: avoid;
  }
  .block-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 3px;
    margin-bottom: 4px;
  }
  .block-title { font-size: 8.5pt; font-weight: 700; color: #0f172a; }
  .page-break { page-break-before: always; }
  ul, ol { margin-left: 14px; margin-bottom: 5px; color: #334155; }
  li { margin-bottom: 2px; }
`;

module.exports = {
  DESKTOP_DIR,
  DOCS_DIR,
  COMMON_STYLES
};
