import { compileVisualsForPrefixes } from './visuals/compile_standalone_visuals.mts';

console.log('Compiling Gate v2 visuals for iot_sec Days 6 to 10...');
const res = compileVisualsForPrefixes(['iot_sec'], 6, 10);
console.log(`Generated ${res.generatedFiles.length} visual files across ${res.totalParts} lesson parts:`);
for (const f of res.generatedFiles) {
  console.log(`  - ${f}`);
}
console.log('Visual compilation completed successfully!');
