/**
 * T-30 — Internship Opportunities admin CRUD
 *
 * Tests for:
 *  1. CreateOpportunitySchema validation
 *  2. UpdateOpportunitySchema partial validation
 *  3. checkOrgAuthenticity — freemail rejection
 *  4. checkOrgAuthenticity — HTTPS strong evidence → tier_1
 *  5. checkOrgAuthenticity — missing website → tier_3
 *  6. checkOrgAuthenticity — HTTP moderate → tier_2
 *  7. opportunityToClient converter (snake_case → camelCase)
 *  8. applicationToClient converter
 */
import { describe, it, expect } from 'vitest';
import {
  CreateOpportunitySchema,
  UpdateOpportunitySchema,
  checkOrgAuthenticity,
} from '../src/lib/internships/opportunities';
import {
  opportunityToClient,
  applicationToClient,
} from '../src/lib/internships/toClient';

describe('T-30 — Internship Opportunities Admin', () => {
  // ── Schema validation ─────────────────────────────────────────────

  describe('CreateOpportunitySchema', () => {
    it('accepts valid input with defaults', () => {
      const result = CreateOpportunitySchema.safeParse({
        orgName: 'Acme Corp',
        kind: 'client_project',
        title: 'Backend internship',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.orgName).toBe('Acme Corp');
        expect(result.data.minTier).toBe('t3_project');
        expect(result.data.seats).toBe(1);
        expect(result.data.paid).toBe(false);
        expect(result.data.status).toBe('draft');
        expect(result.data.description).toBe('');
      }
    });

    it('rejects empty orgName', () => {
      const result = CreateOpportunitySchema.safeParse({
        orgName: '',
        kind: 'client_project',
        title: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid kind', () => {
      const result = CreateOpportunitySchema.safeParse({
        orgName: 'Test',
        kind: 'invalid_kind',
        title: 'Test',
      });
      expect(result.success).toBe(false);
    });

    it('rejects negative stipend', () => {
      const result = CreateOpportunitySchema.safeParse({
        orgName: 'Test Corp',
        kind: 'industry',
        title: 'Paid internship',
        stipend: -100,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('UpdateOpportunitySchema', () => {
    it('accepts partial update with single field', () => {
      const result = UpdateOpportunitySchema.safeParse({ title: 'New Title' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('New Title');
        expect(result.data.orgName).toBeUndefined();
      }
    });

    it('accepts empty object (no fields)', () => {
      const result = UpdateOpportunitySchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  // ── §6 Authenticity checks ────────────────────────────────────────

  describe('checkOrgAuthenticity', () => {
    it('flags freemail domain as tier_3 invalid', () => {
      const result = checkOrgAuthenticity('Shady LLC', 'https://gmail.com');
      expect(result.valid).toBe(false);
      expect(result.recommendedTier).toBe('tier_3');
      expect(result.reasons.some((r) => r.includes('freemail'))).toBe(true);
    });

    it('flags yahoo.com as freemail', () => {
      const result = checkOrgAuthenticity('Yahoo Org', 'https://yahoo.com/about');
      expect(result.valid).toBe(false);
      expect(result.recommendedTier).toBe('tier_3');
    });

    it('recommends tier_1 for HTTPS with valid org', () => {
      const result = checkOrgAuthenticity('Google', 'https://google.com');
      expect(result.valid).toBe(true);
      expect(result.recommendedTier).toBe('tier_1');
    });

    it('returns tier_3 when website is missing', () => {
      const result = checkOrgAuthenticity('NoWeb Inc');
      expect(result.valid).toBe(false);
      expect(result.recommendedTier).toBe('tier_3');
      expect(result.reasons.some((r) => r.includes('Missing'))).toBe(true);
    });

    it('returns tier_3 for empty string website', () => {
      const result = checkOrgAuthenticity('Empty Web Corp', '');
      expect(result.valid).toBe(false);
      expect(result.recommendedTier).toBe('tier_3');
    });

    it('returns tier_2 for HTTP-only domain', () => {
      const result = checkOrgAuthenticity('OldCorp', 'http://oldcorp.in');
      expect(result.valid).toBe(true);
      expect(result.recommendedTier).toBe('tier_2');
    });

    it('handles bare domain without protocol', () => {
      const result = checkOrgAuthenticity('Bare', 'bare-domain.com');
      // Gets auto-prefixed with https:// inside the function
      expect(result.valid).toBe(true);
    });

    it('rejects malformed URL', () => {
      const result = checkOrgAuthenticity('Bad', 'not a url at all!!!');
      expect(result.valid).toBe(false);
      expect(result.recommendedTier).toBe('tier_3');
    });
  });

  // ── toClient converters ───────────────────────────────────────────

  describe('opportunityToClient', () => {
    it('converts snake_case DB row to camelCase client object', () => {
      const row = {
        id: 'opp-001',
        org_name: 'Test Corp',
        org_website: 'https://testcorp.com',
        kind: 'client_project',
        title: 'Fullstack Intern',
        description: 'Build an API',
        min_tier: 't3_project',
        seats: 3,
        paid: true,
        stipend: 5000,
        authenticity_tier: 'tier_1',
        status: 'open',
        created_at: '2025-01-01T00:00:00Z',
      };
      const client = opportunityToClient(row);
      expect(client.id).toBe('opp-001');
      expect(client.orgName).toBe('Test Corp');
      expect(client.orgWebsite).toBe('https://testcorp.com');
      expect(client.kind).toBe('client_project');
      expect(client.minTier).toBe('t3_project');
      expect(client.seats).toBe(3);
      expect(client.paid).toBe(true);
      expect(client.stipend).toBe(5000);
      expect(client.authenticityTier).toBe('tier_1');
      expect(client.status).toBe('open');
      expect(client.createdAt).toBe('2025-01-01T00:00:00Z');
    });

    it('handles null optional fields', () => {
      const row = {
        id: 'opp-002',
        org_name: 'Mini',
        org_website: null,
        kind: 'open_source',
        title: 'OSS Contrib',
        description: '',
        min_tier: 't3_project',
        seats: 1,
        paid: false,
        stipend: null,
        authenticity_tier: null,
        status: 'draft',
        created_at: '2025-06-01',
      };
      const client = opportunityToClient(row);
      expect(client.orgWebsite).toBeNull();
      expect(client.stipend).toBeNull();
      expect(client.authenticityTier).toBeNull();
    });
  });

  describe('applicationToClient', () => {
    it('converts snake_case application row', () => {
      const row = {
        id: 'app-001',
        opportunity_id: 'opp-001',
        student_id: 'stu-001',
        internship_enrollment_id: 'enr-001',
        status: 'applied',
        created_at: '2025-03-01',
      };
      const client = applicationToClient(row);
      expect(client.id).toBe('app-001');
      expect(client.opportunityId).toBe('opp-001');
      expect(client.studentId).toBe('stu-001');
      expect(client.internshipEnrollmentId).toBe('enr-001');
      expect(client.status).toBe('applied');
      expect(client.createdAt).toBe('2025-03-01');
    });

    it('handles camelCase input too', () => {
      const row = {
        id: 'app-002',
        opportunityId: 'opp-002',
        studentId: 'stu-002',
        internshipEnrollmentId: 'enr-002',
        status: 'shortlisted',
        createdAt: '2025-04-01',
      };
      const client = applicationToClient(row);
      expect(client.opportunityId).toBe('opp-002');
      expect(client.internshipEnrollmentId).toBe('enr-002');
    });
  });
});
