import { compileVisualsForPrefixes } from './visuals/compile_standalone_visuals.mts';

console.log('Compiling Gate v2 visuals for iot_sec Days 31 to 35...');
const res = compileVisualsForPrefixes(['iot_sec'], 31, 35);
console.log(`Generated ${res.generatedFiles.length} visual files across ${res.totalParts} lesson parts:`);
for (const f of res.generatedFiles) {
  console.log(`  - ${f}`);
}
console.log('Visual compilation completed successfully!');
