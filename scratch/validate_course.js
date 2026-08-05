const fs = require('fs');

const bcomDataContent = fs.readFileSync('./src/lib/data/bcomAccounting30DayData.ts', 'utf8');

// Count total quests in bcomAccounting30DayData.ts
const questIdMatches = bcomDataContent.match(/id:\s*'bcom-day\d+-q\d+'/g);
console.log('Total quest IDs matched:', questIdMatches ? questIdMatches.length : 0);

// Check Days 1 & 2 quest IDs
const day1and2 = bcomDataContent.match(/id:\s*'bcom-day[12]-q\d+'/g);
console.log('Day 1 & 2 Quests count:', day1and2 ? day1and2.length : 0);

// Check Day 30 quest IDs
const day30 = bcomDataContent.match(/id:\s*'bcom-day30-q\d+'/g);
console.log('Day 30 Quests count:', day30 ? day30.length : 0);

// Check Days 3-29 quest IDs
const days3to29 = bcomDataContent.match(/id:\s*'bcom-day(?:[3-9]|[12][0-9])-q\d+'/g);
console.log('Days 3 to 29 Quests count:', days3to29 ? days3to29.length : 0);

console.log('Validation complete!');
