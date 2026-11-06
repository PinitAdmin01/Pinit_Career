const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// Helper to write file and ensure directory
function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Common CSS for all 4 PDFs
const COMMON_CSS = `
  @page {
    size: A4 portrait;
    margin: 12mm 14mm 12mm 14mm;
    @bottom-right {
      content: counter(page) " / " counter(pages);
      font-size: 8pt;
      color: #64748b;
    }
  }
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #0f172a;
    background: #ffffff;
    line-height: 1.4;
    font-size: 8.8pt;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .header-card {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #ffffff;
    padding: 16px 20px;
    border-radius: 8px;
    margin-bottom: 14px;
    border-left: 6px solid #6366f1;
  }
  .header-card h1 {
    font-size: 16pt;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .header-card .subtitle {
    font-size: 9.5pt;
    color: #94a3b8;
    font-weight: 500;
    margin-bottom: 10px;
  }
  .meta-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    background: rgba(255, 255, 255, 0.07);
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 7.8pt;
  }
  .meta-item strong {
    color: #cbd5e1;
    display: block;
    font-size: 7pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .meta-item span {
    color: #ffffff;
    font-weight: 600;
  }
  h2 {
    font-size: 11.5pt;
    font-weight: 700;
    color: #0f172a;
    border-bottom: 1.5px solid #e2e8f0;
    padding-bottom: 4px;
    margin-top: 14px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  h3 {
    font-size: 9.8pt;
    font-weight: 700;
    color: #1e293b;
    margin-top: 10px;
    margin-bottom: 4px;
  }
  p {
    margin-bottom: 6px;
    color: #334155;
    text-align: justify;
  }
  .alert-box {
    padding: 10px 14px;
    border-radius: 6px;
    margin: 8px 0;
    font-size: 8.2pt;
    border-left: 4px solid;
  }
  .alert-critical {
    background: #fef2f2;
    border-color: #ef4444;
    color: #991b1b;
  }
  .alert-warning {
    background: #fffbeb;
    border-color: #f59e0b;
    color: #92400e;
  }
  .alert-success {
    background: #f0fdf4;
    border-color: #10b981;
    color: #065f46;
  }
  .alert-info {
    background: #eef2ff;
    border-color: #6366f1;
    color: #3730a3;
  }
  .badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 7.2pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .badge-purple { background: #f3e8ff; color: #7e22ce; }
  .badge-blue { background: #e0f2fe; color: #0369a1; }
  .badge-green { background: #dcfce7; color: #15803d; }
  .badge-amber { background: #fef3c7; color: #b45309; }
  .badge-red { background: #fee2e2; color: #b91c1c; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0;
    font-size: 7.8pt;
  }
  th {
    background: #f1f5f9;
    color: #334155;
    font-weight: 700;
    text-align: left;
    padding: 6px 8px;
    border: 1px solid #cbd5e1;
    text-transform: uppercase;
    font-size: 7pt;
    letter-spacing: 0.04em;
  }
  td {
    padding: 5px 8px;
    border: 1px solid #e2e8f0;
    color: #334155;
    vertical-align: top;
  }
  tr:nth-child(even) td {
    background: #f8fafc;
  }
  code {
    font-family: "JetBrains Mono", Consolas, "Courier New", monospace;
    font-size: 7.5pt;
    background: #f1f5f9;
    padding: 1px 4px;
    border-radius: 3px;
    color: #0f172a;
    border: 1px solid #e2e8f0;
  }
  .block-card {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 8px 12px;
    margin-bottom: 8px;
    break-inside: avoid;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }
  .block-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
    margin-bottom: 6px;
  }
  .block-title {
    font-size: 8.8pt;
    font-weight: 700;
    color: #0f172a;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .page-break {
    page-break-before: always;
  }
  ul, ol {
    margin-left: 16px;
    margin-bottom: 6px;
    color: #334155;
  }
  li {
    margin-bottom: 3px;
  }
`;

console.log('Script initialized. Generating directives...');
