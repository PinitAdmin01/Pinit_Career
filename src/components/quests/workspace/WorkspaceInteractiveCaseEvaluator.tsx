'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface WorkspaceInteractiveCaseEvaluatorProps {
  questId: string;
  quest: any;
  code: string;
  setCode: (code: string) => void;
  onSubmit?: () => void;
  isCompleted: boolean;
  isExam: boolean;
  category: string;
}

export function WorkspaceInteractiveCaseEvaluator({
  questId,
  quest,
  code,
  setCode,
  onSubmit,
  isCompleted,
  isExam,
  category,
}: WorkspaceInteractiveCaseEvaluatorProps) {
  // Extract function signature from starterCode or hint
  const starter = quest?.starterCode || '';
  const desc = quest?.desc || '';
  const hint = quest?.hint || '';
  const testSuite = quest?.testSuite || '';

  // Detect function name and parameters
  const fnMatch = starter.match(/(?:function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)|def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\))/);
  const fnName = fnMatch ? (fnMatch[1] || fnMatch[3] || 'evaluateCase') : 'evaluateCase';
  const rawParams = fnMatch ? (fnMatch[2] || fnMatch[4] || '') : '';
  const paramNames = useMemo(() => {
    return rawParams
      .split(',')
      .map((p: string) => p.trim().split('=')[0].trim().split(':')[0].trim())
      .filter(Boolean);
  }, [rawParams]);

  // Detect domain archetype
  const archetype = useMemo(() => {
    const qid = (questId || '').toLowerCase();
    const title = (quest?.title || '').toLowerCase();
    const d = desc.toLowerCase();

    if (qid.includes('soft-skills') || qid.includes('softskills')) {
      if (d.includes('bluf') || title.includes('bluf')) return 'bluf';
      if (d.includes('readme') || title.includes('readme')) return 'readme';
      if (d.includes('listening') || d.includes('paraphrase')) return 'listening';
      if (d.includes('no-hello') || d.includes('async')) return 'nohello';
      return 'communication';
    }
    if (qid.includes('acc') || title.includes('accounting') || d.includes('balance sheet') || d.includes('ledger')) {
      return 'accounting';
    }
    if (qid.includes('fin') || title.includes('finance') || d.includes('wacc') || d.includes('dcf') || d.includes('ratio')) {
      return 'finance';
    }
    if (qid.includes('aud') || title.includes('audit') || d.includes('materiality') || d.includes('compliance')) {
      return 'audit';
    }
    if (qid.includes('tax') || title.includes('tax') || d.includes('gst') || d.includes('deduction')) {
      return 'tax';
    }
    if (qid.includes('law') || title.includes('law') || d.includes('statutory') || d.includes('contract')) {
      return 'law';
    }
    if (qid.includes('excel') || title.includes('excel') || d.includes('spreadsheet') || d.includes('formula')) {
      return 'excel';
    }
    return 'business_case';
  }, [questId, quest?.title, desc]);

  // Form states for various archetypes
  // 1. Accounting Form
  const [assetVal, setAssetVal] = useState<string>('50000');
  const [liabilityVal, setLiabilityVal] = useState<string>('20000');
  const [equityVal, setEquityVal] = useState<string>('30000');
  const [isBalancedToggle, setIsBalancedToggle] = useState<boolean>(true);

  // 2. BLUF Form
  const [blufTag, setBlufTag] = useState<string>('[Action Required: by 5 PM]');
  const [blufSentence, setBlufSentence] = useState<string>(
    'We need approval to merge the auth refactor into production today.'
  );
  const [blufContext, setBlufContext] = useState<string>(
    'The security team reviewed and confirmed zero regressions.'
  );
  const [blufCta, setBlufCta] = useState<string>('Please reply with LGTM.');

  // 3. Metric / Decision Form
  const [primaryMetric, setPrimaryMetric] = useState<string>('85');
  const [secondaryMetric, setSecondaryMetric] = useState<string>('75');
  const [decisionChoice, setDecisionChoice] = useState<string>('COMPLIANT');

  // 4. Custom Parameter inputs for any function
  const [paramInputs, setParamInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initialize paramInputs
    const initial: Record<string, string> = {};
    paramNames.forEach((p: string) => {
      initial[p] = initial[p] || '';
    });
    setParamInputs(initial);
  }, [paramNames]);

  // Synchronize changes to parent `code` seamlessly
  const applyGeneratedCode = () => {
    if (archetype === 'bluf') {
      const generated = `function formatBlufEmail(tag, bluf, context, cta) {
  const isApproved = tag.startsWith('[') && tag.endsWith(']') && bluf.length >= 10 && bluf.length <= 150;
  return {
    subjectLinePrefix: tag,
    bottomLineUpFront: bluf,
    detailedContext: context,
    callToAction: cta,
    isBlufCompliant: isApproved,
    status: isApproved ? 'BLUF_EMAIL_FORMATTED_NOMINAL' : 'BLUF_STRUCTURE_DEFECT'
  };
}`;
      setCode(generated);
    } else if (archetype === 'accounting' && fnName.toLowerCase().includes('equation')) {
      const generated = `function ${fnName}(assets, liabilities, equity) {
  const assetTotal = Number(assets);
  const liabilityAndEquityTotal = Number(liabilities) + Number(equity);
  const equationChecksum = assetTotal === liabilityAndEquityTotal;
  const isBalanced = equationChecksum;
  return {
    assetTotal,
    liabilityAndEquityTotal,
    equationChecksum,
    isBalanced,
    status: isBalanced ? 'PERFECT_EQUILIBRIUM_NOMINAL' : 'EQUATION_IMBALANCE_DEFECT'
  };
}`;
      setCode(generated);
    } else if (archetype === 'audit' || fnName.toLowerCase().includes('audit')) {
      const generated = `function ${fnName}(primaryMetric, secondaryMetric, hurdleThreshold = 71) {
  const weightedScore = Number(((Number(primaryMetric) * 0.6) + (Number(secondaryMetric) * 0.4)).toFixed(2));
  const isCompliant = weightedScore >= Number(hurdleThreshold);
  return {
    primaryMetric: Number(primaryMetric),
    secondaryMetric: Number(secondaryMetric),
    weightedScore,
    hurdleThreshold: Number(hurdleThreshold),
    isCompliant,
    status: isCompliant ? 'AUDIT_CRITERIA_COMPLIANT' : 'AUDIT_VARIANCE_FLAGGED'
  };
}`;
      setCode(generated);
    }
  };

  // Sync on mount if code is empty or basic starter
  useEffect(() => {
    if (!code || code === starter || code.includes('// TODO')) {
      applyGeneratedCode();
    }
  }, [archetype, fnName]);

  return (
    <div
      data-testid="interactive-case-evaluator"
      style={{
        background: 'var(--bg2)',
        border: '1.5px solid var(--border)',
        borderRadius: 16,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          paddingBottom: 14,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>📊</span>
            <h3 style={{ fontSize: 16.5, fontWeight: 800, margin: 0, color: 'var(--t1)' }}>
              Interactive Case Study Evaluator
            </h3>
            <span
              style={{
                fontSize: 11,
                padding: '3px 8px',
                borderRadius: 6,
                background: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--green)',
                fontWeight: 800,
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              NO-CODE MODE
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--t3)', margin: '4px 0 0 0' }}>
            Structured business analysis & evaluation engine. Zero manual programming syntax required.
          </p>
        </div>
        <div style={{ fontSize: 12, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>
          Target Protocol: <strong style={{ color: 'var(--accent)' }}>{fnName}</strong>
        </div>
      </div>

      {/* Case Scenario Card */}
      <div
        style={{
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 16,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--t3)', textTransform: 'uppercase', marginBottom: 6 }}>
          Case Scenario & Requirements
        </div>
        <div style={{ fontSize: 14.5, color: 'var(--t1)', lineHeight: 1.6 }}>{desc}</div>
      </div>

      {/* Interactive Form Controls Based on Archetype */}
      {archetype === 'bluf' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>
              Subject Line Urgency Tag
            </label>
            <select
              value={blufTag}
              onChange={(e) => {
                setBlufTag(e.target.value);
                applyGeneratedCode();
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                background: 'var(--bg1)',
                border: '1px solid var(--border)',
                color: 'var(--t1)',
                fontSize: 14,
              }}
            >
              <option value="[Action Required: by 5 PM]">[Action Required: by 5 PM] - High Urgency</option>
              <option value="[Review Needed: Architecture]">[Review Needed: Architecture] - Medium Urgency</option>
              <option value="[FYI Only: Weekly Sync]">[FYI Only: Weekly Sync] - Low Urgency</option>
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>
                Bottom Line Up Front (BLUF Sentence)
              </label>
              <span style={{ fontSize: 12, color: blufSentence.length >= 10 && blufSentence.length <= 150 ? 'var(--green)' : 'var(--coral)' }}>
                {blufSentence.length} / 150 chars (Min 10)
              </span>
            </div>
            <input
              type="text"
              value={blufSentence}
              onChange={(e) => {
                setBlufSentence(e.target.value);
                applyGeneratedCode();
              }}
              placeholder="State the core decision, risk, or request in 1 crisp sentence..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                background: 'var(--bg1)',
                border: '1px solid var(--border)',
                color: 'var(--t1)',
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>
              Supporting Technical Context
            </label>
            <textarea
              rows={2}
              value={blufContext}
              onChange={(e) => {
                setBlufContext(e.target.value);
                applyGeneratedCode();
              }}
              placeholder="Provide background data, links, or architectural constraints..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                background: 'var(--bg1)',
                border: '1px solid var(--border)',
                color: 'var(--t1)',
                fontSize: 14,
                resize: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>
              Explicit Call to Action (CTA)
            </label>
            <input
              type="text"
              value={blufCta}
              onChange={(e) => {
                setBlufCta(e.target.value);
                applyGeneratedCode();
              }}
              placeholder="e.g. Please reply with LGTM before 5 PM today."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                background: 'var(--bg1)',
                border: '1px solid var(--border)',
                color: 'var(--t1)',
                fontSize: 14,
              }}
            />
          </div>
        </div>
      ) : archetype === 'accounting' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>
                Total Assets ($)
              </label>
              <input
                type="number"
                value={assetVal}
                onChange={(e) => {
                  setAssetVal(e.target.value);
                  applyGeneratedCode();
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'var(--bg1)',
                  border: '1px solid var(--border)',
                  color: 'var(--t1)',
                  fontSize: 14,
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>
                Total Liabilities ($)
              </label>
              <input
                type="number"
                value={liabilityVal}
                onChange={(e) => {
                  setLiabilityVal(e.target.value);
                  applyGeneratedCode();
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'var(--bg1)',
                  border: '1px solid var(--border)',
                  color: 'var(--t1)',
                  fontSize: 14,
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--t2)', marginBottom: 6 }}>
                Owner's Equity ($)
              </label>
              <input
                type="number"
                value={equityVal}
                onChange={(e) => {
                  setEquityVal(e.target.value);
                  applyGeneratedCode();
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'var(--bg1)',
                  border: '1px solid var(--border)',
                  color: 'var(--t1)',
                  fontSize: 14,
                }}
              />
            </div>
          </div>

          {/* Real-time Reconciliation Telemetry */}
          <div
            style={{
              padding: 14,
              borderRadius: 10,
              background:
                Number(assetVal) === Number(liabilityVal) + Number(equityVal)
                  ? 'rgba(16, 185, 129, 0.08)'
                  : 'rgba(244, 63, 94, 0.08)',
              border:
                Number(assetVal) === Number(liabilityVal) + Number(equityVal)
                  ? '1px solid rgba(16, 185, 129, 0.25)'
                  : '1px solid rgba(244, 63, 94, 0.25)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--t1)' }}>
                Equation Balance: Assets ({assetVal}) vs (Liab {liabilityVal} + Equity {equityVal} ={' '}
                {Number(liabilityVal) + Number(equityVal)})
              </div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>
                Accounting Invariant: Assets ≡ Liabilities + Equity (Double-Entry Verification)
              </div>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color:
                  Number(assetVal) === Number(liabilityVal) + Number(equityVal)
                    ? 'var(--green)'
                    : 'var(--coral)',
              }}
            >
              {Number(assetVal) === Number(liabilityVal) + Number(equityVal)
                ? '✓ PERFECT EQUILIBRIUM'
                : '⚠ IMBALANCE DETECTED'}
            </span>
          </div>
        </div>
      ) : (
        /* Universal Parameter Fields */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)' }}>
            Case Parameters & Evaluator Inputs:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {paramNames.map((param: string) => (
              <div key={param}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--t3)', marginBottom: 4 }}>
                  {param}
                </label>
                <input
                  type="text"
                  placeholder={`Enter value for ${param}...`}
                  value={paramInputs[param] || ''}
                  onChange={(e) => {
                    const next = { ...paramInputs, [param]: e.target.value };
                    setParamInputs(next);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'var(--bg1)',
                    border: '1px solid var(--border)',
                    color: 'var(--t1)',
                    fontSize: 13,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border)',
          paddingTop: 16,
          marginTop: 4,
        }}
      >
        <button
          onClick={applyGeneratedCode}
          style={{
            background: 'var(--bg3)',
            color: 'var(--t2)',
            border: '1px solid var(--border)',
            padding: '8px 14px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          🔄 Re-sync Formula Engine
        </button>

        <button
          onClick={() => {
            applyGeneratedCode();
            if (onSubmit) {
              setTimeout(onSubmit, 50);
            }
          }}
          disabled={isCompleted}
          style={{
            background: 'linear-gradient(135deg, var(--green) 0%, #059669 100%)',
            color: '#fff',
            border: 'none',
            padding: '10px 22px',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 800,
            cursor: isCompleted ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
          }}
        >
          {isCompleted ? '✓ Case Study Verified' : 'Submit Case Evaluation ⚡'}
        </button>
      </div>
    </div>
  );
}
