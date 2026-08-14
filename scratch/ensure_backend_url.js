const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const KEY = 'NEXT_PUBLIC_BACKEND_URL';
const VALUE = 'https://pinit-backend-v8pd.onrender.com';

function ensure(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) return file + ': missing';
  const text = fs.readFileSync(full, 'utf8');
  const m = text.match(new RegExp('^' + KEY + '=(.*)$', 'm'));
  if (m && String(m[1] || '').trim()) return file + ': already-set';
  fs.appendFileSync(full, (text.endsWith('\n') ? '' : '\n') + KEY + '=' + VALUE + '\n');
  return file + ': appended';
}

console.log(ensure('.env'));
console.log(ensure('.env.local'));
