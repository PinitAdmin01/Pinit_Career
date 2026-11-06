import { compileVisualsForPrefixes } from './visuals/compile_standalone_visuals.mts';

console.log('Compiling Gate v2 visuals for iot_emb Days 46 to 50...');
const res = compileVisualsForPrefixes(['iot_emb'], 46, 50);
console.log(`Generated ${res.generatedFiles.length} visual files across ${res.totalParts} lesson parts:`);
for (const f of res.generatedFiles) {
  console.log(`  - ${f}`);
}
console.log('Visual compilation completed successfully!');
