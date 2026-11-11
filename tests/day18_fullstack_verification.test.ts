import { describe, it } from 'node:test';
import assert from 'node:assert';
import vm from 'node:vm';
import { FULLSTACK_30_DAYS_CONFIGS } from '../src/lib/data/fullstack30DayData';
import { FULLSTACK_JS_LONG_LESSONS } from '../src/lib/data/fullstackJsLongLessons';

describe('Day 18 Full-Stack Certification Invariant Verification', () => {
  const day18Config = FULLSTACK_30_DAYS_CONFIGS[17];
  const day18Lesson = FULLSTACK_JS_LONG_LESSONS[17];

  it('Day 18 title and syllabus align between config and long lesson', () => {
    assert.strictEqual(day18Config.day, 18);
    assert.strictEqual(day18Lesson.day, 18);
    assert.strictEqual(day18Config.title, 'Streaming File Processing & Cloud Storage Architecture: Multipart Form-Data, Busboy & S3 Presigned Uploads');
    assert.strictEqual(day18Lesson.title, 'Streaming File Processing & Cloud Storage Architecture: Multipart Form-Data, Busboy & S3 Presigned Uploads');
    assert.strictEqual(day18Config.syllabus.length, 3);
  });

  it('Day 18 LongLesson satisfies pedagogical invariants (>= 580 words/part, 0 AI filler)', () => {
    assert.strictEqual(day18Lesson.parts.length, 5);

    const forbiddenPhrases = [
      'pay close attention to how each state transition is structured',
      'trace how the input parameters flow through',
      'In production engineering and operational workflows, mastering',
      'in this section we will explore',
      'delve into',
      'testament to',
      'embark on',
      'it is important to note',
      'crucial to understand',
      'it is worth noting'
    ];

    day18Lesson.parts.forEach((part, idx) => {
      const fullText = [
        part.title,
        ...part.say,
        part.example,
        part.tryIt,
        part.check.question,
        ...part.check.options,
        part.check.why
      ].join(' ');

      const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;
      assert.ok(
        wordCount >= 580,
        `Part ${idx + 1} (${part.title}) has only ${wordCount} words (minimum required: 580)`
      );

      forbiddenPhrases.forEach((phrase) => {
        assert.ok(
          !fullText.toLowerCase().includes(phrase.toLowerCase()),
          `Part ${idx + 1} contains prohibited robotic filler: "${phrase}"`
        );
      });
    });
  });

  function runSandbox(code: string, testSuite: string) {
    const context = {
      console: { log: () => {}, error: () => {}, warn: () => {}, info: () => {} },
      assert: (cond: boolean, msg?: string) => { if (!cond) throw new Error(msg || 'Assertion failed'); },
      TextEncoder: global.TextEncoder,
      TextDecoder: global.TextDecoder,
      Buffer: Buffer,
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      Promise: Promise,
      Map: Map,
      Set: Set,
      Date: Date,
      JSON: JSON,
      Math: Math,
      RegExp: RegExp,
      Array: Array,
      Object: Object,
      String: String,
      Number: Number,
      Boolean: Boolean,
      TypeError: TypeError,
      Error: Error,
      parseInt: parseInt,
      isNaN: isNaN
    };
    vm.createContext(context);
    const script = new vm.Script(`
      (async () => {
        ${code}
        ;
        ${testSuite}
      })()
    `);
    return script.runInContext(context);
  }

  it('Day 18 Exam (generatePresignedUploadUrl): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function generatePresignedUploadUrl(bucket, key, expiresInSeconds = 900) {
        if (!bucket || typeof bucket !== 'string') {
          throw new Error('Valid bucket name is required');
        }
        if (!key || typeof key !== 'string') {
          throw new Error('Valid object key is required');
        }
        if (typeof expiresInSeconds !== 'number' || expiresInSeconds < 1 || expiresInSeconds > 604800) {
          throw new Error('Expiration must be between 1 and 604800 seconds');
        }
        const algorithm = 'AWS4-HMAC-SHA256';
        const rawMsg = bucket + ':' + key + ':' + expiresInSeconds;
        let hash = 0;
        for (let i = 0; i < rawMsg.length; i++) {
          hash = ((hash << 5) - hash + rawMsg.charCodeAt(i)) | 0;
        }
        const signature = Math.abs(hash).toString(16).padStart(16, '0');
        const uploadUrl = 'https://' + bucket + '.s3.amazonaws.com/' + key + '?X-Amz-Algorithm=' + algorithm + '&X-Amz-Expires=' + expiresInSeconds + '&X-Amz-Signature=' + signature;
        return {
          bucket,
          key,
          expiresInSeconds,
          uploadUrl
        };
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day18Config.eTest);
    });
  });

  it('Day 18 Exam: catches defective implementation that omits AWS query params or fails expiration check', async () => {
    // Defective code that omits required AWS signature query parameters
    const defectiveCode = `
      function generatePresignedUploadUrl(bucket, key, expiresInSeconds = 900) {
        return {
          bucket,
          key,
          expiresInSeconds,
          uploadUrl: 'https://' + bucket + '.s3.amazonaws.com/' + key
        };
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day18Config.eTest);
    });
  });

  it('Day 18 Assignment (isAllowedImageMime): valid implementation passes automated test suite', async () => {
    const studentCode = `
      function isAllowedImageMime(mime) {
        if (typeof mime !== 'string') return false;
        const allowed = new Set(['image/png', 'image/jpeg', 'image/webp']);
        return allowed.has(mime.toLowerCase());
      }
    `;

    await assert.doesNotReject(async () => {
      await runSandbox(studentCode, day18Config.aTest);
    });
  });

  it('Day 18 Assignment: catches defective implementation that is case-sensitive or misses webp', async () => {
    // Defective code that does strict case match and omits webp
    const defectiveCode = `
      function isAllowedImageMime(mime) {
        return mime === 'image/png' || mime === 'image/jpeg';
      }
    `;

    await assert.rejects(async () => {
      await runSandbox(defectiveCode, day18Config.aTest);
    });
  });
});
