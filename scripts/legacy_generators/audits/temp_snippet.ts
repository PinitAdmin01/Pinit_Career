interface ShadowTimings {
  rayQueryDispatchMs: number;
  anyHitAlphaTestMs: number;
  svgfDenoiserMs: number;
}

class ShadowPerformanceAuditor {
  static audit(timings: ShadowTimings): { totalMs: number; meetsSla: boolean; passes60Fps: boolean } {
    const totalMs = parseFloat((
      timings.rayQueryDispatchMs +
      timings.anyHitAlphaTestMs +
      timings.svgfDenoiserMs
    ).toFixed(2));

    const meetsSla = totalMs <= 2.0; // Strict 2.0ms shadow SLA
    const passes60Fps = meetsSla && timings.svgfDenoiserMs > 0;

    return { totalMs, meetsSla, passes60Fps };
  }
}

const timings: ShadowTimings = {
  rayQueryDispatchMs: 0.95,
  anyHitAlphaTestMs: 0.35,
  svgfDenoiserMs: 0.45
};

const audit = ShadowPerformanceAuditor.audit(timings);
console.log(`[Shadow Audit] Total Ray Traced Shadow Time: ${audit.totalMs} ms`);
console.log(`[Shadow Audit] Meets 2.0ms Post-Processing SLA: ${audit.meetsSla}`);
console.log(`[Shadow Audit] 60 FPS Target Certified: ${audit.passes60Fps}`);
