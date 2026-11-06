import { compileVisualsForPrefixes } from './visuals/compile_standalone_visuals.mts';

console.log('Compiling Gate v2 visuals for iot_sec Days 41 to 45...');
const res = compileVisualsForPrefixes(['iot_sec'], 41, 45);
console.log(`Generated ${res.generatedFiles.length} visual files across ${res.totalParts} lesson parts:`);
for (const f of res.generatedFiles) {
  console.log(`  - ${f}`);
}
console.log('Visual compilation completed successfully!');
