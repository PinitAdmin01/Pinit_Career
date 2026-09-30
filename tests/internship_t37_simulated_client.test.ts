/**
 * T-37 — Simulated-client fallback for Tier 3 (unit tests)
 *
 * Tests for:
 *  1. getSimulatedClientHonestyLabel returns '(simulated client)' when true
 *  2. getSimulatedClientHonestyLabel returns '(real client)' when false
 *  3. SimulatedClientMessageSchema validation
 *  4. buildSimulatedClientPrompt inclusion of project goal and phase
 */
import { describe, it, expect } from 'vitest';
import {
  getSimulatedClientHonestyLabel,
  SimulatedClientMessageSchema,
  buildSimulatedClientPrompt,
} from '../src/lib/internships/simulatedClient';

describe('T-37 — Simulated Client Fallback for Tier 3', () => {
  describe('getSimulatedClientHonestyLabel', () => {
    it('returns "(simulated client)" for simulated client fallback', () => {
      expect(getSimulatedClientHonestyLabel(true)).toBe('(simulated client)');
    });

    it('returns "(real client)" when not simulated', () => {
      expect(getSimulatedClientHonestyLabel(false)).toBe('(real client)');
    });
  });

  describe('SimulatedClientMessageSchema', () => {
    it('validates a client message with requirement change', () => {
      const msg = {
        role: 'client',
        content: 'We need to support JSON export now as well.',
        timestamp: '2025-08-01T10:00:00Z',
        requirementChange: true,
        newRequirement: 'Add GET /api/export/json endpoint',
      };
      const result = SimulatedClientMessageSchema.safeParse(msg);
      expect(result.success).toBe(true);
    });

    it('validates a student message', () => {
      const msg = {
        role: 'student',
        content: 'I have completed the user auth endpoints.',
        timestamp: '2025-08-01T10:05:00Z',
      };
      const result = SimulatedClientMessageSchema.safeParse(msg);
      expect(result.success).toBe(true);
    });
  });

  describe('buildSimulatedClientPrompt', () => {
    it('includes project name, goal, and phase', () => {
      const prompt = buildSimulatedClientPrompt(
        'Analytics Dashboard',
        'Build real-time metric graphs',
        2
      );
      expect(prompt).toContain('Analytics Dashboard');
      expect(prompt).toContain('Build real-time metric graphs');
      expect(prompt).toContain('Current Phase: 2 of 4');
    });
  });
});
