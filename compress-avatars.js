const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const avatarDir = path.join(__dirname, 'public', 'avatar');
const files = fs.readdirSync(avatarDir);

console.log("--- Starting PinIT Avatar Batch Compressor ---");

for (const file of files) {
  if (file.endsWith('.glb')) {
    const filePath = path.join(avatarDir, file);
    const tempPath1 = path.join(avatarDir, 'temp1_' + file);
    const tempPath2 = path.join(avatarDir, 'temp2_' + file);

    console.log(`\nOptimizing: ${file}`);
    const initialSize = fs.statSync(filePath).size;
    console.log(`- Initial size: ${(initialSize / 1024 / 1024).toFixed(2)} MB`);

    try {
      // 1. Resize textures to max 1024x1024
      console.log(`- Resizing textures to 1024x1024...`);
      execSync(`npx @gltf-transform/cli resize --width 1024 --height 1024 "${filePath}" "${tempPath1}"`, { stdio: 'inherit' });

      // 2. Convert textures to high-performance WebP
      console.log(`- Converting textures to WebP format...`);
      execSync(`npx @gltf-transform/cli webp "${tempPath1}" "${tempPath2}"`, { stdio: 'inherit' });

      // 3. Apply Draco geometry compression
      console.log(`- Applying Draco mesh compression...`);
      execSync(`npx @gltf-transform/cli draco "${tempPath2}" "${filePath}"`, { stdio: 'inherit' });

      const finalSize = fs.statSync(filePath).size;
      const reduction = ((1 - finalSize / initialSize) * 100).toFixed(1);
      console.log(`✔️ Successfully optimized ${file}!`);
      console.log(`- Final size: ${(finalSize / 1024 / 1024).toFixed(2)} MB (Reduced by ${reduction}%)`);
    } catch (e) {
      console.error(`❌ Failed to compress ${file}:`, e.message);
    } finally {
      // Clean up temp files
      if (fs.existsSync(tempPath1)) fs.unlinkSync(tempPath1);
      if (fs.existsSync(tempPath2)) fs.unlinkSync(tempPath2);
    }
  }
}

console.log("\n--- Batch Compression complete! ---");
