/**
 * Known lesson defect counts per web course before F-20 content remediation.
 * This gate ensures that no course introduces new violations and strictly shrinks to zero in F-20.
 */
export const KNOWN_LESSON_DEFECTS: Record<string, number> = {
  'node-web': 201,
  'devops': 92,
  'cloud': 34,
  'design': 86,
  'dsa-optim': 0,
  'dist': 0,
  'cyber': 0,
  'ai': 0,
  'sre-web': 3,
  'stream-web': 3,
  'aideploy-web': 184,
};
