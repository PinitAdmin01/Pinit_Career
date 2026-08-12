import { supabase } from '@/lib/supabaseClient';
import { tableExists } from '@/lib/services/supabaseTable';
import { readLocalJson, writeLocalJson } from '@/lib/services/localJsonDb';

const NONCE_KEY = 'pinit_face_nonce';

function euclideanDistance(v1: number[], v2: number[]): number {
  if (v1.length !== v2.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < v1.length; i++) {
    const diff = v1[i] - v2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

function fuseDescriptors(descriptors: number[][]): number[] {
  const dim = descriptors[0].length;
  const fused = new Array(dim).fill(0);
  for (const frame of descriptors) {
    if (frame.length !== dim) continue;
    for (let i = 0; i < dim; i++) fused[i] += frame[i];
  }
  for (let i = 0; i < dim; i++) fused[i] /= descriptors.length;
  let norm = 0;
  for (let i = 0; i < dim; i++) norm += fused[i] * fused[i];
  norm = Math.sqrt(norm);
  return norm > 0 ? fused.map(v => v / norm) : fused;
}

async function loadTemplate(userKey: string): Promise<number[] | null> {
  const key = userKey.toLowerCase();
  if (await tableExists('face_templates')) {
    const { data, error } = await supabase.from('face_templates').select('descriptor').eq('user_key', key).maybeSingle();
    if (!error && data?.descriptor) return data.descriptor as number[];
  }
  const stored = await readLocalJson<number[] | null>(`face:${key}`, null, 'personal');
  return Array.isArray(stored) ? stored : null;
}

async function saveTemplate(userKey: string, descriptor: number[]): Promise<void> {
  const key = userKey.toLowerCase();
  if (await tableExists('face_templates')) {
    const { error } = await supabase.from('face_templates').upsert({
      user_key: key,
      descriptor,
      updated_at: new Date().toISOString(),
    });
    if (!error) return;
  }
  await writeLocalJson(`face:${key}`, descriptor, 'personal');
}

export async function faceChallenge() {
  const nonce = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `n_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  if (typeof window !== 'undefined') sessionStorage.setItem(NONCE_KEY, nonce);
  return { success: true, nonce, expiresAt: Date.now() + 5 * 60 * 1000 };
}

export async function faceEnroll(body: any, uid: string | null, email: string) {
  const descriptors: number[][] = body?.descriptors;
  if (!Array.isArray(descriptors) || descriptors.length === 0) {
    return { ok: false, error: 'No face descriptor vectors provided.' };
  }
  const userKey = (email || uid || body?.username || '').toLowerCase();
  if (!userKey) return { ok: false, error: 'Not logged in.' };
  const vector = fuseDescriptors(descriptors);
  await saveTemplate(userKey, vector);
  if (typeof window !== 'undefined') sessionStorage.removeItem(NONCE_KEY);
  return { ok: true, success: true, message: 'Face biometric profile enrolled successfully.', user: userKey };
}

export async function faceVerify(body: any) {
  const username = String(body?.username || '').trim();
  if (!username) return { ok: false, success: false, error: 'Username required for face verify.', match: false };
  const descriptor: number[] = body?.descriptor;
  if (!Array.isArray(descriptor)) return { ok: false, success: false, error: 'Live face descriptor vector missing.', match: false };
  const stored = await loadTemplate(username);
  if (!stored) return { ok: false, success: false, error: 'No enrolled face template for this user.', match: false };
  const dist = euclideanDistance(descriptor, stored);
  const match = dist < 0.6;
  const confidence = Math.max(0, Math.round((1 - dist) * 100));
  return { ok: match, success: match, match, confidence, error: match ? undefined : 'Face match verification failed.' };
}

export async function faceEnrolled(username: string) {
  if (!username) return { enrolled: false };
  const stored = await loadTemplate(username);
  return { enrolled: !!stored };
}
