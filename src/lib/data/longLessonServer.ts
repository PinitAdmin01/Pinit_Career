/**
 * Server-only on-demand reader for precompiled LongLesson archives.
 *
 * Reads compressed per-course archives from src/generated/longLessons/<key>.json.gz
 * so Next.js/Webpack never parses or bundles the 131 MB TypeScript curriculum corpus.
 * Caches up to 8 active courses in an LRU Map to keep server memory bounded (<15 MB).
 */

import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import type { LongLesson } from './longLessonTypes';

interface LongLessonsManifest {
  schemaVersion: number;
  prefixes: Record<string, string>;
}

const MAX_CACHED_COURSES = 8;
const ARCHIVE_DIR = path.join(process.cwd(), 'src', 'generated', 'longLessons');
const MANIFEST_FILE = path.join(ARCHIVE_DIR, '_manifest.json');

let cachedManifest: LongLessonsManifest | null | undefined = undefined;
const courseCache = new Map<string, ReadonlyArray<LongLesson>>();

function loadManifest(): LongLessonsManifest | null {
  if (cachedManifest !== undefined) return cachedManifest;
  try {
    if (!fs.existsSync(MANIFEST_FILE)) {
      cachedManifest = null;
      return null;
    }
    cachedManifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8')) as LongLessonsManifest;
    return cachedManifest;
  } catch {
    cachedManifest = null;
    return null;
  }
}

function loadCourseArchive(fileKey: string): ReadonlyArray<LongLesson> | null {
  const hit = courseCache.get(fileKey);
  if (hit) {
    // Refresh LRU order
    courseCache.delete(fileKey);
    courseCache.set(fileKey, hit);
    return hit;
  }

  const archivePath = path.join(ARCHIVE_DIR, `${fileKey}.json.gz`);
  if (!fs.existsSync(archivePath)) return null;

  const compressed = fs.readFileSync(archivePath);
  const jsonText = zlib.gunzipSync(compressed).toString('utf8');
  const parsed = JSON.parse(jsonText) as ReadonlyArray<LongLesson>;

  if (courseCache.size >= MAX_CACHED_COURSES) {
    const oldestKey = courseCache.keys().next().value;
    if (oldestKey) courseCache.delete(oldestKey);
  }
  courseCache.set(fileKey, parsed);
  return parsed;
}

export function getLongLessonServer(prefix: string, dayNum: number): LongLesson | null {
  // Option 1 (Primary): Fast on-demand read from precompiled gzip archive
  // [FIX-STAGE: phase2b-archive-fallback-telemetry] Surface archive/fallback errors clearly without spamming hot hits.
  try {
    const manifest = loadManifest();
    if (manifest) {
      const fileKey = manifest.prefixes[prefix];
      if (fileKey) {
        const days = loadCourseArchive(fileKey);
        if (days) {
          const match = days.find((d) => d.day === dayNum);
          if (match) return match;
        }
      }
    }
  } catch (err) {
    console.warn('[PinIT][Fix:LongLessonServer] Precompiled archive load failed; falling back to TS barrel.', {
      prefix,
      dayNum,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  // Option 2 (Fallback): Direct dynamic require from longLessons.ts if archive was missing, corrupt, or unbuilt
  // Opaque to Webpack so Next.js build-time bundling never bundles the 131 MB TypeScript file.
  if (typeof (globalThis as Record<string, unknown>).__webpack_require__ === 'undefined') {
    try {
      const dynamicRequire = eval('require') as NodeRequire;
      const barrel = dynamicRequire('./longLessons') as {
        getLongLesson: (p: string, d: number) => LongLesson | null;
      };
      return barrel.getLongLesson(prefix, dayNum);
    } catch (err) {
      console.error('[PinIT][Fix:LongLessonServer] Fallback TS barrel lookup failed.', {
        prefix,
        dayNum,
        error: err instanceof Error ? err.message : String(err),
      });
      return null;
    }
  }

  return null;
}
