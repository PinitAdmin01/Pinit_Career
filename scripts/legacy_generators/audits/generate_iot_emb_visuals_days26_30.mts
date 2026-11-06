import { compileVisualsForPrefixes } from './visuals/compile_standalone_visuals.mts';

const res = compileVisualsForPrefixes(['iot_emb'], 26, 30);
console.log(`Successfully compiled ${res.generatedFiles.length} visual day files (${res.totalParts} total parts) for iot_emb Days 26-30:`);
for (const file of res.generatedFiles) {
  console.log(` - ${file}`);
}
