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
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
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
  describe('CreateOpportunitySchema', () => {
    it('accepts valid input with defaults', () => {
      const result = CreateOpportunitySchema.safeParse({
        orgName: 'Acme Corp',
        kind: 'client_project',
        title: 'Backend internship',
      });
      assert.strictEqual(result.success, true);
      if (result.success) {
        assert.strictEqual(result.data.orgName, 'Acme Corp');
        assert.strictEqual(result.data.minTier, 't3_project');
        assert.strictEqual(result.data.seats, 1);
        assert.strictEqual(result.data.paid, false);
        assert.strictEqual(result.data.status, 'draft');
        assert.strictEqual(result.data.description, '');
      }
    });

    it('rejects empty orgName', () => {
      const result = CreateOpportunitySchema.safeParse({
        orgName: '',
        kind: 'client_project',
        title: 'Test',
      });
      assert.strictEqual(result.success, false);
    });

    it('rejects invalid kind', () => {
      const result = CreateOpportunitySchema.safeParse({
        orgName: 'Test',
        kind: 'invalid_kind',
        title: 'Test',
      });
      assert.strictEqual(result.success, false);
    });

    it('rejects negative seats', () => {
      const result = CreateOpportunitySchema.safeParse({
        orgName: 'Test',
        kind: 'client_project',
        title: 'Test',
        seats: -1,
      });
      assert.strictEqual(result.success, false);
    });
  });

  describe('UpdateOpportunitySchema', () => {
    it('accepts partial updates', () => {
      const result = UpdateOpportunitySchema.safeParse({
        status: 'open',
        seats: 5,
      });
      assert.strictEqual(result.success, true);
    });

    it('rejects invalid status', () => {
      const result = UpdateOpportunitySchema.safeParse({
        status: 'invalid_status',
      });
      assert.strictEqual(result.success, false);
    });
  });

  describe('checkOrgAuthenticity (Verification Standard §6)', () => {
    it('disqualifies freemail domains (gmail.com)', () => {
      const res = checkOrgAuthenticity('Acme Inc', 'https://gmail.com');
      assert.strictEqual(res.valid, false);
      assert.strictEqual(res.recommendedTier, 'tier_3');
    });

    it('disqualifies Yahoo, Hotmail, Outlook freemails', () => {
      assert.strictEqual(checkOrgAuthenticity('A', 'https://yahoo.com').valid, false);
      assert.strictEqual(checkOrgAuthenticity('B', 'https://hotmail.com').valid, false);
      assert.strictEqual(checkOrgAuthenticity('C', 'https://outlook.com').valid, false);
    });

    it('assigns tier_1 strong evidence for HTTPS web presence and valid company domain', () => {
      const res = checkOrgAuthenticity('Acme Inc', 'https://acme.com');
      assert.strictEqual(res.valid, true);
      assert.strictEqual(res.recommendedTier, 'tier_1');
    });

    it('assigns tier_2 moderate evidence for HTTP web presence', () => {
      const res = checkOrgAuthenticity('Acme Inc', 'http://acme.com');
      assert.strictEqual(res.valid, true);
      assert.strictEqual(res.recommendedTier, 'tier_2');
    });

    it('assigns tier_3 weak evidence when no website is provided', () => {
      const res = checkOrgAuthenticity('Acme Inc', '');
      assert.strictEqual(res.valid, false);
      assert.strictEqual(res.recommendedTier, 'tier_3');
    });

    it('assigns tier_3 when website lacks protocol prefix', () => {
      const res = checkOrgAuthenticity('Acme Inc', 'just-a-string');
      assert.strictEqual(res.valid, false);
      assert.strictEqual(res.recommendedTier, 'tier_3');
    });
  });

  describe('opportunityToClient converter', () => {
    it('converts DB snake_case row to camelCase client object', () => {
      const row = {
        id: 'opp-100',
        org_name: 'Tech Corp',
        org_website: 'https://techcorp.com',
        authenticity_tier: 'tier_1',
        kind: 'industry',
        title: 'Full-Stack Developer Intern',
        description: 'Great role',
        min_tier: 't4_industry',
        seats: 3,
        paid: true,
        stipend: 1000,
        status: 'open',
        created_at: '2025-01-01T00:00:00Z',
      };
      const client = opportunityToClient(row);
      assert.strictEqual(client.id, 'opp-100');
      assert.strictEqual(client.orgName, 'Tech Corp');
      assert.strictEqual(client.orgWebsite, 'https://techcorp.com');
      assert.strictEqual(client.minTier, 't4_industry');
      assert.strictEqual(client.seats, 3);
      assert.strictEqual(client.paid, true);
    });

    it('handles camelCase object safely', () => {
      const camelObj = {
        id: 'opp-200',
        orgName: 'Alpha Inc',
        title: 'Python Intern',
        seats: 2,
      };
      const client = opportunityToClient(camelObj);
      assert.strictEqual(client.id, 'opp-200');
      assert.strictEqual(client.orgName, 'Alpha Inc');
    });
  });

  describe('applicationToClient converter', () => {
    it('converts application DB row to camelCase client object', () => {
      const row = {
        id: 'app-001',
        opportunity_id: 'opp-100',
        internship_enrollment_id: 'enr-100',
        student_id: 'stu-100',
        status: 'pending',
        note: 'I am excited to join',
        decision_by: null,
        decision_note: null,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      };
      const client = applicationToClient(row);
      assert.strictEqual(client.id, 'app-001');
      assert.strictEqual(client.opportunityId, 'opp-100');
      assert.strictEqual(client.studentId, 'stu-100');
      assert.strictEqual(client.status, 'pending');
    });
  });
});
