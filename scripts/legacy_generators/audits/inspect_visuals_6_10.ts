import * as fs from 'fs';
import * as path from 'path';

console.log("=== INSPECTING VISUALS FOR DAYS 6 TO 10 ===");

for (let d = 6; d <= 10; d++) {
    const filename = `day-${String(d).padStart(2, '0')}.json`;
    const p = path.join(process.cwd(), 'src/lib/data/lessonVisuals/java-basics', filename);
    if (!fs.existsSync(p)) {
        console.log(`${filename}: DOES NOT EXIST`);
        continue;
    }
    const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
    console.log(`\n${filename}: schemaVersion=${data.schemaVersion}, entries=${data.entries?.length}`);
    data.entries?.forEach((e: any, idx: number) => {
        console.log(`  Entry ${idx + 1}: partId=${e.partId}, title="${e.title}", steps=${e.visualSpec?.steps?.length}`);
    });
}
