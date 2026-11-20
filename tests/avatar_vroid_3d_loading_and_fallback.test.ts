import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('TASK 2 BRUTAL VERIFICATION: VRoid 3D Mentor Avatar Loading & Network Resilience', () => {
  const interviewAvatarPath = path.resolve(process.cwd(), 'src/components/avatar/VRoidInterviewAvatar.tsx');
  const enginePath = path.resolve(process.cwd(), 'src/components/avatar/VRoidAvatarEngine.ts');
  const missionsPagePath = path.resolve(process.cwd(), 'src/app/missions/page.tsx');

  const interviewAvatarSource = fs.readFileSync(interviewAvatarPath, 'utf8');
  const engineSource = fs.readFileSync(enginePath, 'utf8');
  const missionsPageSource = fs.readFileSync(missionsPagePath, 'utf8');

  it('2.1: Safety timeout in VRoidInterviewAvatar is generous (>= 20s) and does not kill cold 18MB GLB downloads', () => {
    // Look for setTimeout with duration
    const timeoutMatch = interviewAvatarSource.match(/safetyTimer\s*=\s*setTimeout\([\s\S]*?,\s*(\d+)\)/);
    assert.ok(timeoutMatch, 'Must define a safetyTimer setTimeout in VRoidInterviewAvatar');
    const timeoutMs = parseInt(timeoutMatch[1], 10);
    assert.ok(
      timeoutMs >= 20000,
      `safetyTimer (${timeoutMs}ms) must be at least 20000ms to allow 17.9MB GLB download & Three.js parse without premature 2D fallback`
    );
  });

  it('2.2: VRoidAvatarEngine connects error handling to signal irrecoverable failures to VRoidInterviewAvatar', () => {
    assert.ok(
      engineSource.includes('onError?:'),
      'VRoidAvatarEngine must declare an onError callback'
    );
    assert.ok(
      interviewAvatarSource.includes('scene.onError'),
      'VRoidInterviewAvatar must register scene.onError handler'
    );
  });

  it('2.3: preloadAvatarGLB preloads and caches multiple mentor models in pinit_avatar_v1 CacheStorage', () => {
    assert.ok(
      interviewAvatarSource.includes('pinit_avatar_v1'),
      'preloadAvatarGLB must populate pinit_avatar_v1 CacheStorage for instant cache hits'
    );
    assert.ok(
      interviewAvatarSource.includes('cache.put('),
      'preloadAvatarGLB must put downloaded model responses into CacheStorage'
    );
  });

  it('2.4: Missions page proactively preloads AI mentor avatars on mount', () => {
    assert.ok(
      missionsPageSource.includes('preloadAvatarGLB'),
      'Missions page must import and invoke preloadAvatarGLB'
    );
    assert.ok(
      missionsPageSource.includes("'rohan'") || missionsPageSource.includes('"rohan"'),
      'Missions page must preload rohan (the crisis mentor avatar)'
    );
  });

  it('2.5: Mentor model GLB files for Missions are physically present and valid glTF 2.0 binaries', () => {
    const requiredAvatars = ['rohan.glb', 'priya.glb', 'rajesh.glb', 'sneha.glb', 'abhijit.glb'];
    for (const file of requiredAvatars) {
      const fullPath = path.resolve(process.cwd(), 'public/avatar', file);
      assert.ok(fs.existsSync(fullPath), `public/avatar/${file} must exist`);
      const buffer = fs.readFileSync(fullPath);
      assert.ok(buffer.length > 1000000, `${file} must be a substantial 3D binary model (> 1MB)`);
      const magic = buffer.slice(0, 4).toString('utf8');
      assert.equal(magic, 'glTF', `${file} must start with glTF magic bytes`);
      const version = buffer.readUInt32LE(4);
      assert.equal(version, 2, `${file} must be glTF binary version 2`);
    }
  });
});
