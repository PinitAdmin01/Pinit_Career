// scripts/utils/compress_all_avatars.js
// PinIT Career OS Dual-Tier (HD + Lite) Avatar Optimizer
// Generates:
// 1. HD Tier (public/avatar/hd/*.glb) - Full 2048x2048 WebP (Q92) + Draco for high-end devices & fast network
// 2. Lite Tier (public/avatar/*.glb) - 1024x1024 WebP (Q85) + Draco for mobile devices & campus Wi-Fi

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = 'C:\\Users\\Admin\\Downloads';
const targetDir = path.join(__dirname, '..', '..', 'public', 'avatar');
const hdDir = path.join(targetDir, 'hd');

if (!fs.existsSync(hdDir)) {
  fs.mkdirSync(hdDir, { recursive: true });
}

const AVATAR_MAP = {
  priya:   ['Ms. Priya.vrm', 'Ms.Priya.vrm', 'priya.glb'],
  anish:   ['Mr.Anish.vrm', 'Mr. Anish.vrm', 'anish.glb'],
  kashyap: ['Kashyap sir.vrm', 'Kashyap Sir.vrm', 'kashyap.glb'],
  karthic: ['Karthi sir.vrm', 'Karthi Sir.vrm', 'karthic.glb'],
  maya:    ['Ms.Maya.vrm', 'Ms. Maya.vrm', 'maya.glb'],
  divya:   ['Ms.Divya.vrm', 'Ms. Divya.vrm', 'divya.glb'],
  aisha:   ['Ms.Aisha.vrm', 'Ms. Aisha.vrm', 'aisha.glb'],
  sneha:   ['Ms.Sneha.vrm', 'Ms. Sneha.vrm', 'sneha.glb'],
  rohan:   ['Mr.Rohan.vrm', 'Mr. Rohan.vrm', 'rohan.glb'],
  vikram:  ['Mr. Vikram.vrm', 'Mr.Vikram.vrm', 'vikram.glb'],
  shalini: ['Ms. Shalini.vrm', 'Ms.Shalini.vrm', 'shalini.glb'],
  aditya:  ['Mr.Aditya.vrm', 'Mr. Aditya.vrm', 'aditya.glb'],
  neha:    ['Ms.Neha.vrm', 'Ms. Neha.vrm', 'neha.glb'],
  rajesh:  ['Mr.Rajesh.vrm', 'Mr. Rajesh.vrm', 'rajesh.glb'],
  abhijit: ['Mr. Abhijit.vrm', 'Mr.Abhijit.vrm', 'abhijit.glb'],
};

console.log('========================================================');
console.log('   PinIT Dual-Tier Avatar Batch Compressor (HD + Lite)  ');
console.log('========================================================\n');

for (const [key, candidates] of Object.entries(AVATAR_MAP)) {
  let inputPath = null;
  for (const c of candidates) {
    const p1 = path.join(sourceDir, c);
    const p2 = path.join(targetDir, c);
    if (fs.existsSync(p1)) {
      inputPath = p1;
      break;
    } else if (fs.existsSync(p2)) {
      inputPath = p2;
      break;
    }
  }

  if (!inputPath) {
    console.warn(`[SKIP] No source file found for ${key}`);
    continue;
  }

  console.log(`\n--------------------------------------------------------`);
  console.log(`Processing avatar: ${key} (from ${path.basename(inputPath)})`);
  const initialMB = (fs.statSync(inputPath).size / 1024 / 1024).toFixed(2);
  console.log(`Initial raw size: ${initialMB} MB`);

  const hdOut = path.join(hdDir, `${key}.glb`);
  const liteOut = path.join(targetDir, `${key}.glb`);
  const temp1 = path.join(targetDir, `temp1_${key}.glb`);
  const temp2 = path.join(targetDir, `temp2_${key}.glb`);

  try {
    // 1. Generate HD Version (2048x2048 WebP Q92 + Draco)
    console.log(`1. Generating HD Tier -> ${key}.glb ...`);
    execSync(`npx @gltf-transform/cli webp "${inputPath}" "${temp1}" --quality 92`, { stdio: 'ignore' });
    execSync(`npx @gltf-transform/cli draco "${temp1}" "${hdOut}"`, { stdio: 'ignore' });
    if (fs.existsSync(temp1)) fs.unlinkSync(temp1);

    const hdMB = (fs.statSync(hdOut).size / 1024 / 1024).toFixed(2);
    console.log(`   ✔ HD Tier created: ${hdMB} MB (Saved in public/avatar/hd/${key}.glb)`);

    // 2. Generate Lite Version (1024x1024 WebP Q85 + Draco)
    console.log(`2. Generating Lite Tier -> ${key}.glb ...`);
    execSync(`npx @gltf-transform/cli resize --width 1024 --height 1024 "${inputPath}" "${temp1}"`, { stdio: 'ignore' });
    execSync(`npx @gltf-transform/cli webp "${temp1}" "${temp2}" --quality 85`, { stdio: 'ignore' });
    execSync(`npx @gltf-transform/cli draco "${temp2}" "${liteOut}"`, { stdio: 'ignore' });
    if (fs.existsSync(temp1)) fs.unlinkSync(temp1);
    if (fs.existsSync(temp2)) fs.unlinkSync(temp2);

    const liteMB = (fs.statSync(liteOut).size / 1024 / 1024).toFixed(2);
    console.log(`   ✔ Lite Tier created: ${liteMB} MB (Saved in public/avatar/${key}.glb)`);

    if (key === 'priya') {
      fs.copyFileSync(hdOut, path.join(hdDir, 'mentor.glb'));
      fs.copyFileSync(liteOut, path.join(targetDir, 'mentor.glb'));
      console.log(`   ✔ Synced mentor.glb in both HD and Lite directories.`);
    }
  } catch (err) {
    console.error(`[ERROR] Failed to compress ${key}:`, err.message);
  } finally {
    if (fs.existsSync(temp1)) fs.unlinkSync(temp1);
    if (fs.existsSync(temp2)) fs.unlinkSync(temp2);
  }
}

console.log('\n========================================================');
console.log('   All Avatars Compressed Successfully!                ');
console.log('========================================================');
