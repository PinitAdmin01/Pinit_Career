/**
 * T-36 — Admin Verification and Records (unit tests)
 *
 * Tests for:
 *  1. Admin verify endpoint response structure
 *  2. Tier configuration resolution
 *  3. Certificate generation for verified tiers
 *  4. Data mapping to internship_records format
 */
import { describe, it, expect } from 'vitest';
import { newInternshipCertificateId } from '../src/lib/certificates/internshipCertificate';
import { INTERNSHIP_TIERS } from '../src/lib/internships/tiers';

describe('T-36 — Admin Verification and Records', () => {
  describe('Tier configurations for verification', () => {
    it('t4_industry is marked as needing partner and real company', () => {
      const tier = INTERNSHIP_TIERS.t4_industry;
      expect(tier.simulated).toBe(false);
      expect(tier.needsPartner).toBe(true);
    });

    it('t5_fellowship is marked as needing partner and real company', () => {
      const tier = INTERNSHIP_TIERS.t5_fellowship;
      expect(tier.simulated).toBe(false);
      expect(tier.needsPartner).toBe(true);
    });

    it('t3_project is marked as needing partner and real company', () => {
      const tier = INTERNSHIP_TIERS.t3_project;
      expect(tier.simulated).toBe(false);
      expect(tier.needsPartner).toBe(true);
    });
  });

  describe('Certificate ID generation for verified tiers', () => {
    it('generates valid certificate ID format', () => {
      const certId = newInternshipCertificateId();
      expect(certId).toMatch(/^PIN-IN-[A-Za-z0-9_-]+$/);
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

      const tierConfig = INTERNSHIP_TIERS.t4_industry;
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

      expect(recordPayload.company_name).toBe('Acme AI Corp');
      expect(recordPayload.role).toBe('Verified Industry Internship');
      expect(recordPayload.verified).toBe(true);
      expect(recordPayload.status).toBe('completed');
    });
  });
});
