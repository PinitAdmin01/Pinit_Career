import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { setLlmJsonTransportForTests } from '../src/lib/server/llmJson';
import {
  generateCompanyProfile,
  FICTIONAL_COMPANY_PREFIX,
  CompanyProfileSchema,
} from '../src/lib/internships/companyProfile';

describe('fictional company profile generation (generateCompanyProfile)', () => {
  afterEach(() => {
    setLlmJsonTransportForTests(null);
  });

  it('generates a valid company profile with mandatory fictional disclosure', async () => {
    setLlmJsonTransportForTests(async () => {
      return JSON.stringify({
        name: 'Apex Dispatch',
        industry: 'Autonomous Route Optimization',
        readme: `${FICTIONAL_COMPANY_PREFIX} Welcome to Apex Dispatch! We specialize in real-time telematics and automated dispatching pipelines using Python and distributed databases.`,
      });
    });

    const res = await generateCompanyProfile({
      tier: 't1_job_sim',
      seed: 'seed-company-1',
    });

    assert.strictEqual(res.ok, true);
    if (res.ok) {
      assert.strictEqual(res.profile.name, 'Apex Dispatch');
      assert.strictEqual(res.profile.industry, 'Autonomous Route Optimization');
      assert.ok(res.profile.readme.startsWith(FICTIONAL_COMPANY_PREFIX));
      assert.strictEqual(res.attempts, 1);
    }
  });

  it('rejects attempt 1 when mandatory prefix is missing and succeeds on attempt 2', async () => {
    let callCount = 0;
    setLlmJsonTransportForTests(async () => {
      callCount++;
      if (callCount === 1) {
        // Missing the mandatory prefix
        return JSON.stringify({
          name: 'Bad Corp',
          industry: 'Finance',
          readme: 'Welcome to Bad Corp, an innovative software platform.',
        });
      }
      // Attempt 2: valid prefix included
      return JSON.stringify({
        name: 'Good Corp',
        industry: 'Clean Tech',
        readme: `${FICTIONAL_COMPANY_PREFIX} Good Corp helps municipal utilities analyze power consumption curves.`,
      });
    });

    const res = await generateCompanyProfile({
      tier: 't1_job_sim',
      seed: 'seed-retry-prefix',
      maxAttempts: 3,
    });

    assert.strictEqual(res.ok, true);
    if (res.ok) {
      assert.strictEqual(res.attempts, 2);
      assert.strictEqual(res.profile.name, 'Good Corp');
      assert.ok(res.profile.readme.startsWith(FICTIONAL_COMPANY_PREFIX));
    }
  });

  it('returns ok: false when all attempts fail validation', async () => {
    setLlmJsonTransportForTests(async () => {
      return JSON.stringify({
        name: 'Missing Disclosure Corp',
        industry: 'Logistics',
        readme: 'We are a real company with real services (no disclosure).',
      });
    });

    const res = await generateCompanyProfile({
      tier: 't1_job_sim',
      seed: 'seed-always-fail',
      maxAttempts: 3,
    });

    assert.strictEqual(res.ok, false);
    if (!res.ok) {
      assert.strictEqual(res.reasons.length, 3);
      assert.match(res.reasons[0], /mandatory fictional disclosure/);
    }
  });

  it('CompanyProfileSchema validates required fields', () => {
    const valid = {
      name: 'Simulated Dynamics',
      industry: 'Robotics Software',
      readme: `${FICTIONAL_COMPANY_PREFIX} Internal onboarding documentation for junior engineers.`,
    };
    assert.strictEqual(CompanyProfileSchema.safeParse(valid).success, true);

    const invalidShort = {
      name: 'A', // too short
      industry: 'B', // too short
      readme: 'Short', // too short
    };
    assert.strictEqual(CompanyProfileSchema.safeParse(invalidShort).success, false);
  });
});
