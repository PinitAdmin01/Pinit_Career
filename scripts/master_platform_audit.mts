import { getLongLesson } from '../src/lib/data/longLessons';
import fs from 'node:fs';
import path from 'node:path';

// All 37 canonical course prefixes
const ALL_COURSES = [
  // Tech & Engineering (1-20)
  { prefix: 'py', name: 'Python Enterprise Foundations' },
  { prefix: 'fullstack', name: 'Full-Stack Web Architectures' },
  { prefix: 'react', name: 'Modern React Architecture' },
  { prefix: 'node', name: 'Node.js Microservices' },
  { prefix: 'next', name: 'Next.js Enterprise Systems' },
  { prefix: 'mobile', name: 'Mobile App Engineering' },
  { prefix: 'cyber', name: 'Cybersecurity Operations' },
  { prefix: 'devops', name: 'DevOps & CI/CD Pipelines' },
  { prefix: 'cloud', name: 'Cloud Infrastructure Engineering' },
  { prefix: 'db', name: 'Distributed Databases' },
  { prefix: 'dsa', name: 'Data Structures & Algorithms' },
  { prefix: 'ai', name: 'Applied AI & Machine Learning' },
  { prefix: 'g3d', name: '3D Graphics & Game Engines' },
  { prefix: 'graphics', name: 'Computer Graphics & Vision' },
  { prefix: 'net', name: 'Computer Networking & Protocols' },
  { prefix: 'dist', name: 'Distributed Systems' },
  { prefix: 'iot', name: 'Internet of Things' },
  { prefix: 'iot_net', name: 'IoT Networking & Cloud' },
  { prefix: 'iot_sec', name: 'IoT Security & Device Lifecycle' },
  { prefix: 'iot_edge', name: 'IoT Edge Computing' },
  { prefix: 'iot_emb', name: 'Embedded IoT Systems' },
  // Specialized & Commerce (21-37)
  { prefix: 'blockchain', name: 'Enterprise Blockchain' },
  { prefix: 'quant', name: 'Quantitative Finance' },
  { prefix: 'design', name: 'Product Design & UI/UX' },
  { prefix: 'bcom_acc', name: 'Accounting & Forensic Bookkeeping' },
  { prefix: 'bcom_fin', name: 'Corporate Finance & Capital Markets' },
  { prefix: 'bcom_mkt', name: 'Strategic Marketing & Brand Systems' },
  { prefix: 'bcom_aud', name: 'Statutory Audit & Corporate Assurance' },
  { prefix: 'bcom_ban', name: 'Banking, Treasury & Credit Operations' },
  { prefix: 'bcom_dmkt', name: 'Digital Marketing Analytics' },
  { prefix: 'bcom_ecom', name: 'E-Commerce Platform Architecture' },
  { prefix: 'bcom_law', name: 'Corporate & Commercial Law' },
  { prefix: 'bcom_tax', name: 'Direct & Indirect Taxation' },
  { prefix: 'bcom_ent', name: 'Entrepreneurship & Venture Creation' },
  { prefix: 'bcom_ib', name: 'International Business & Trade' },
  { prefix: 'bcom_scrm', name: 'Supply Chain Risk Management' },
  { prefix: 'bcom_ait', name: 'AI & Digital Transformation' },
  { prefix: 'nlp', name: 'Natural Language Processing & Linguistics' },
];

console.log('=' .repeat(80));
console.log('   PINIT CAREER OS: MASTER PLATFORM 100% COMPLETION GLOBAL AUDIT   ');
console.log('=' .repeat(80));

let grandTotalDays = 0;
let grandTotalParts = 0;
const results: Array<{ prefix: string; name: string; days: number; parts: number; status: string }> = [];

for (const c of ALL_COURSES) {
  let daysCount = 0;
  let partsCount = 0;

  for (let day = 1; day <= 60; day++) {
    const lesson = getLongLesson(c.prefix, day);
    if (lesson && lesson.parts && lesson.parts.length === 5) {
      daysCount++;
      partsCount += lesson.parts.length;
    }
  }

  const isComplete = daysCount === 60;
  grandTotalDays += daysCount;
  grandTotalParts += partsCount;

  results.push({
    prefix: c.prefix,
    name: c.name,
    days: daysCount,
    parts: partsCount,
    status: isComplete ? '60/60 (100.0%)' : `${daysCount}/60 (DEFICIT)`
  });
}

console.log(`\n#   | Prefix       | Days             | Parts    | Course Name`);
console.log('-'.repeat(80));
results.forEach((r, idx) => {
  const numStr = String(idx + 1).padEnd(3);
  const prefixStr = r.prefix.padEnd(12);
  const statusStr = r.status.padEnd(16);
  const partsStr = String(r.parts).padEnd(8);
  console.log(`${numStr} | ${prefixStr} | ${statusStr} | ${partsStr} | ${r.name}`);
});

console.log('='.repeat(80));
console.log(`Total Courses Audited:     ${results.length}`);
console.log(`Total Completed Days:      ${grandTotalDays} / 2,220`);
console.log(`Total Verified Parts:     ${grandTotalParts} / 11,100`);
console.log(`Global Platform Standing:  ${((grandTotalDays / 2220) * 100).toFixed(2)}% COMPLETE`);
console.log('='.repeat(80));

if (grandTotalDays >= 2220) {
  console.log('\n🏆 CONGRATULATIONS! PINIT CAREER OS IS 100.00% CONQUERED ACROSS ALL COURSES!');
} else {
  console.log(`\nRemaining Deficit: ${2220 - grandTotalDays} Days.`);
}
