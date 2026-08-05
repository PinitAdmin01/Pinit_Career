const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, 'TeacherPages.jsx'),
  path.join(__dirname, 'AdminPages.jsx')
];

const replacements = [
  // Background replacements
  [/\bbackground:\s*['"](?:white|#fff|#ffffff)['"]/g, "background: 'var(--bg2)'"],
  [/\bbackground:\s*['"]var\(--bg-primary\)['"]/g, "background: 'var(--bg)'"],
  [/\bbackground:\s*['"]var\(--bg-secondary\)['"]/g, "background: 'var(--bg2)'"],
  [/\bbackground:\s*['"]#f8faff['"]/g, "background: 'var(--bg3)'"],
  [/\bbackground:\s*['"]#f0fdf4['"]/g, "background: 'rgba(5,150,105,0.06)'"], // lighter success badge background
  [/\bbackground:\s*['"]#fff1f2['"]/g, "background: 'rgba(220,38,38,0.06)'"], // lighter danger badge background
  [/\bbackground:\s*['"]#eff6ff['"]/g, "background: 'rgba(37,99,235,0.06)'"], // lighter primary badge background
  [/\bbackground:\s*['"]#fffbeb['"]/g, "background: 'rgba(217,119,6,0.06)'"], // lighter warning badge background
  
  // Text color replacements
  [/\bcolor:\s*['"]var\(--text-primary\)['"]/g, "color: 'var(--t1)'"],
  [/\bcolor:\s*['"]var\(--text-secondary\)['"]/g, "color: 'var(--t2)'"],
  [/\bcolor:\s*['"]var\(--text-muted\)['"]/g, "color: 'var(--t3)'"],
  
  // Box shadow adjustments to match Career OS premium aesthetics
  [/boxShadow:\s*['"]0\s+1px\s+6px\s+rgba\(37,99,235,0\.06\)['"]/g, "boxShadow: 'var(--shadow-sm)'"],
  [/boxShadow:\s*['"]0\s+8px\s+40px\s+rgba\(5,150,105,0\.1\)['"]/g, "boxShadow: 'var(--shadow-md)'"],
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`File not found: ${file}`);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  replacements.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Successfully refactored styling in: ${path.basename(file)}`);
  } else {
    console.log(`No changes made to: ${path.basename(file)}`);
  }
});
