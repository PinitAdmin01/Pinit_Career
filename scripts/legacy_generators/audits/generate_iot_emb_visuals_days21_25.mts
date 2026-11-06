import { compileVisualsForPrefixes } from './visuals/compile_standalone_visuals.mts';

const res = compileVisualsForPrefixes(['iot_emb'], 21, 25);
console.log(`Successfully compiled ${res.generatedFiles.length} visual day files (${res.totalParts} total parts) for iot_emb Days 21-25:`);
for (const file of res.generatedFiles) {
  console.log(` - ${file}`);
}
