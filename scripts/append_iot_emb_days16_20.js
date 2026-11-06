import fs from 'fs';
import path from 'path';

function escapeTsString(s) {
  return JSON.stringify(s);
}

function formatDayTs(dayData) {
  const lines = [];
  lines.push('  {');
  lines.push(`    day: ${dayData.day},`);
  lines.push(`    title: ${escapeTsString(dayData.title)},`);
  lines.push(`    goal: ${escapeTsString(dayData.goal)},`);
  lines.push(`    minutes: ${dayData.minutes || 36},`);
  lines.push(`    recap: ${escapeTsString(dayData.recap)},`);
  lines.push('    parts: [');

  dayData.parts.forEach((p, i) => {
    const commaPart = i < dayData.parts.length - 1 ? ',' : '';
    lines.push('      {');
    lines.push(`        title: ${escapeTsString(p.title)},`);
    lines.push('        say: [');
    p.say.forEach((s, j) => {
      const commaSay = j < p.say.length - 1 ? ',' : '';
      lines.push(`          ${escapeTsString(s)}${commaSay}`);
    });
    lines.push('        ],');
    lines.push(`        example: ${escapeTsString(p.example)},`);

    const codeEscaped = p.code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
    lines.push(`        code: \`${codeEscaped}\`,`);

    const outEscaped = p.output.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
    lines.push(`        output: \`${outEscaped}\`,`);

    lines.push('        codeNotes: [');
    p.codeNotes.forEach((cn, j) => {
      const commaCn = j < p.codeNotes.length - 1 ? ',' : '';
      lines.push(`          { line: ${cn.line}, note: ${escapeTsString(cn.note)} }${commaCn}`);
    });
    lines.push('        ],');

    lines.push(`        tryIt: ${escapeTsString(p.tryIt)},`);

    const chk = p.check;
    lines.push('        check: {');
    lines.push(`          question: ${escapeTsString(chk.question)},`);
    lines.push('          options: [');
    chk.options.forEach((opt, j) => {
      const commaOpt = j < chk.options.length - 1 ? ',' : '';
      lines.push(`            ${escapeTsString(opt)}${commaOpt}`);
    });
    lines.push('          ],');
    lines.push(`          answer: ${chk.answer},`);
    lines.push(`          why: ${escapeTsString(chk.why)}`);
    lines.push('        }');
    lines.push(`      }${commaPart}`);
  });

  lines.push('    ],');
  lines.push('    summary: [');
  dayData.summary.forEach((s, j) => {
    const commaSum = j < dayData.summary.length - 1 ? ',' : '';
    lines.push(`      ${escapeTsString(s)}${commaSum}`);
  });
  lines.push('    ],');

  const ps = dayData.projectStep;
  lines.push('    projectStep: {');
  lines.push(`      title: ${escapeTsString(ps.title)},`);
  lines.push('      steps: [');
  ps.steps.forEach((st, j) => {
    const commaSt = j < ps.steps.length - 1 ? ',' : '';
    lines.push(`        ${escapeTsString(st)}${commaSt}`);
  });
  lines.push('      ]');
  lines.push('    }');
  lines.push('  }');
  return lines.join('\n');
}

const targetFile = 'src/lib/data/iotEmbLongLessons.ts';
let content = fs.readFileSync(targetFile, 'utf-8');

const closingPattern = /\n\];\s*$/;
const match = content.match(closingPattern);
if (!match) {
  throw new Error('Could not find closing `];` in iotEmbLongLessons.ts');
}
const insertPos = match.index;

const newDaysTs = [];
for (let d = 16; d <= 20; d++) {
  const dayData = JSON.parse(fs.readFileSync(`scripts/iot_emb_day${d}.json`, 'utf-8'));
  newDaysTs.push(formatDayTs(dayData));
}

const combinedNewContent = newDaysTs.join(',\n');
const updatedContent = content.slice(0, insertPos) + ',\n' + combinedNewContent + '\n];\n';

fs.writeFileSync(targetFile, updatedContent, 'utf-8');
console.log('Appended Days 16-20 to src/lib/data/iotEmbLongLessons.ts successfully!');
