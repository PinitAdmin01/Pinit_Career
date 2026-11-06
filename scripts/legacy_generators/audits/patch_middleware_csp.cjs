const fs = require('fs');
const path = require('path');

const file = path.resolve('src/middleware.ts');
let content = fs.readFileSync(file, 'utf8');

const target = "    \"connect-src 'self'\",\r\n    'blob:',\r\n    'https://*.supabase.co',";
const targetLF = "    \"connect-src 'self'\",\n    'blob:',\n    'https://*.supabase.co',";

const replacement = "    \"connect-src 'self'\",\r\n    'blob:',\r\n    'http://127.0.0.1:*',\r\n    'ws://127.0.0.1:*',\r\n    'http://localhost:*',\r\n    'ws://localhost:*',\r\n    'https://*.supabase.co',";
const replacementLF = "    \"connect-src 'self'\",\n    'blob:',\n    'http://127.0.0.1:*',\n    'ws://127.0.0.1:*',\n    'http://localhost:*',\n    'ws://localhost:*',\n    'https://*.supabase.co',";

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log('SUCCESS (CRLF): middleware.ts updated!');
} else if (content.includes(targetLF)) {
  content = content.replace(targetLF, replacementLF);
  fs.writeFileSync(file, content, 'utf8');
  console.log('SUCCESS (LF): middleware.ts updated!');
} else {
  console.error('FAILED to find target in middleware.ts');
  process.exit(1);
}
