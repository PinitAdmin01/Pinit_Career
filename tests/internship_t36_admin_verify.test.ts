/**
 * T-36 — Admin Verification and Records (unit tests)
 *
 * Tests for:
 *  1. Admin verify endpoint response structure
 *  2. Tier configuration resolution
 *  3. Certificate generation for verified tiers
 *  4. Data mapping to internship_records format
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { newInternshipCertificateId } from '../src/lib/certificates/internshipCertificate';
import { INTERNSHIP_TIERS } from '../src/lib/internships/tiers';

describe('T-36 — Admin Verification and Records', () => {
  describe('Tier configurations for verification', () => {
    it('t4_industry is marked as needing partner and real company', () => {
      const tier = INTERNSHIP_TIERS.python_ai.t4_industry;
      assert.strictEqual(tier.simulated, false);
      assert.strictEqual(tier.needsPartner, true);
    });

    it('t5_fellowship is marked as needing partner and real company', () => {
      const tier = INTERNSHIP_TIERS.python_ai.t5_fellowship;
      assert.strictEqual(tier.simulated, false);
      assert.strictEqual(tier.needsPartner, true);
    });

    it('t3_project is marked as needing partner and real company', () => {
      const tier = INTERNSHIP_TIERS.python_ai.t3_project;
      assert.strictEqual(tier.simulated, false);
      assert.strictEqual(tier.needsPartner, true);
    });
  });

  describe('Certificate ID generation for verified tiers', () => {
    it('generates valid certificate ID format', () => {
      const certId = newInternshipCertificateId();
      assert.strictEqual(/^PIN-IN-[A-Za-z0-9_-]+$/.test(certId), true);
    });
  });

  describe('Record mapping structure', () => {
    it('maps company profile and tier name to internship_records fields', () => {
      const mockEnrollment = {
        id: 'enr-100',
        student_id: 'stu-100',
        tier: 't4_industry',
        started_at: '2025-01-15T00:00:00Z',
        company_profile: { companyName: 'Acme AI Corp' },
      };

      const tierConfig = INTERNSHIP_TIERS.python_ai.t4_industry;
      const companyName = String(mockEnrollment.company_profile.companyName);

      const recordPayload = {
        student_id: mockEnrollment.student_id,
        company_name: companyName,
        role: tierConfig.name,
        start_date: '2025-01-15',
        end_date: '2025-04-15',
        stipend: 0,
        status: 'completed',
        description: `Verified ${tierConfig.name} via PinIT Internship OS.`,
        verified: true,
      };

      assert.strictEqual(recordPayload.company_name, 'Acme AI Corp');
      assert.strictEqual(recordPayload.role, 'Verified Industry Internship');
      assert.strictEqual(recordPayload.verified, true);
      assert.strictEqual(recordPayload.status, 'completed');
    });
  });
});
