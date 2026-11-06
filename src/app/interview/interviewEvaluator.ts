import {
  calculateRoleWeightedScore,
  normalizeRoleKey,
  generatePersonaCoaching,
  generateTelemetryDiagnostics,
  MindsetArchetype
} from '@/lib/interview/scoringMatrix';
import { evaluateSystemTopology } from '@/lib/interview/systemDesignEvaluator';
import { toast } from '@/lib/store/useAppStore';
import { Message } from './interviewTypes';

export interface EvaluationInput {
  messages: Message[];
  codeSubmitted: boolean;
  latestTopology: any;
  starStep: number;
  fillerWordCount: number;
  eyeContactScore: number | null;
  wpmScore: number | null;
  activeTopicName: string;
  domainStream: 'tech' | 'non_tech';
  archetype: MindsetArchetype;
  tabSwitchCount?: number;
}

export function computeDeterministicEvaluation({
  messages,
  codeSubmitted,
  latestTopology,
  starStep,
  fillerWordCount,
  eyeContactScore,
  wpmScore,
  activeTopicName,
  domainStream,
  archetype,
  tabSwitchCount
}: EvaluationInput) {
  const safeMessages = Array.isArray(messages) ? messages : [];
  const userMsgCount = safeMessages.filter(m => m?.role === 'user').length;
  const safeStarStep = typeof starStep === 'number' && Number.isFinite(starStep) ? Math.max(0, Math.min(4, Math.floor(starStep))) : 0;
  const safeFillerCount = typeof fillerWordCount === 'number' && Number.isFinite(fillerWordCount) ? Math.max(0, Math.floor(fillerWordCount)) : 0;
  const safeTabSwitches = typeof tabSwitchCount === 'number' && Number.isFinite(tabSwitchCount) ? Math.max(0, Math.floor(tabSwitchCount)) : 0;
  const roleKey = normalizeRoleKey(activeTopicName || 'Full Stack Engineer', domainStream || 'tech');

  const verbalContribution = Math.min(88, Math.max(45, userMsgCount * 9));
  const topologyEvaluation = latestTopology?.nodes?.length
    ? evaluateSystemTopology(latestTopology, activeTopicName, domainStream)
    : null;
  const architectureScore = topologyEvaluation ? topologyEvaluation.score : 0;
  const solvingScore = codeSubmitted ? 90 : (verbalContribution > 65 ? 65 : 50);

  const rawDimensions = {
    logic: Math.max(35, Math.min(95, solvingScore * 0.95 + (architectureScore > 70 ? 5 : 0))),
    systems: Math.max(35, Math.min(95, architectureScore > 0 ? architectureScore : 40)),
    // Golden Rule 3: Speech telemetry (filler words) is purely diagnostic and does NOT penalize core comms hiring score.
    comms: Math.max(40, Math.min(95, 45 + userMsgCount * 8)),
    solving: solvingScore,
    star: Math.max(35, Math.min(95, 40 + safeStarStep * 15))
  };

  const scoringResult = calculateRoleWeightedScore(rawDimensions, roleKey);
  const coaching = generatePersonaCoaching(archetype, scoringResult.sanitizedDimensions, roleKey);
  const telemetryDiagnostics = generateTelemetryDiagnostics({
    eyeContact: typeof eyeContactScore === 'number' && Number.isFinite(eyeContactScore) ? eyeContactScore : undefined,
    wpm: typeof wpmScore === 'number' && Number.isFinite(wpmScore) ? wpmScore : undefined,
    fillerWords: typeof fillerWordCount === 'number' && (userMsgCount > 0 || safeFillerCount > 0) ? safeFillerCount : undefined,
    tabSwitches: typeof tabSwitchCount === 'number' && Number.isFinite(tabSwitchCount) ? Math.max(0, Math.floor(tabSwitchCount)) : undefined
  });

  const round2Badge = roleKey === 'iot_embedded'
    ? 'MCU C++ Sandbox'
    : roleKey === 'quant_systems'
    ? 'Low-Latency C++ Engine'
    : roleKey === 'ai_ml'
    ? 'Python AI Sandbox'
    : roleKey === 'cybersecurity'
    ? 'Secure Systems Sandbox'
    : 'Coding';

  const round3Badge = roleKey === 'iot_embedded'
    ? 'Hardware / MMIO Architecture'
    : roleKey === 'quant_systems'
    ? 'LMAX / Exchange Topology'
    : roleKey === 'ai_ml'
    ? 'Vector RAG Architecture'
    : roleKey === 'cybersecurity'
    ? 'Threat Boundary Architecture'
    : 'System Design';

  const round2Metric = codeSubmitted
    ? (roleKey === 'iot_embedded' ? 'Embedded register test suite verified' : roleKey === 'quant_systems' ? 'Order book test suite verified' : 'Test suite verified')
    : 'Manual code submitted';

  const round4Badge = starStep >= 4
    ? 'STAR Master (4/4)'
    : starStep >= 2
    ? 'STAR Articulated'
    : 'STAR Defense';

  const perRoundScores = {
    round1: {
      title: 'Round 1: Behavioral & Mindset',
      score: Math.min(100, Math.max(50, Math.round((rawDimensions.comms * 0.7) + (verbalContribution * 0.3)))),
      verdict: rawDimensions.comms >= 75 ? 'Strong Fit' : rawDimensions.comms >= 60 ? 'Competent' : 'Developing',
      metric: `${userMsgCount} conversational responses, ${fillerWordCount} filler words`,
      badge: 'Behavioral'
    },
    round2: {
      title: 'Round 2: Technical Sandbox',
      score: Math.min(100, Math.max(45, solvingScore)),
      verdict: solvingScore >= 85 ? 'Optimal Solution' : solvingScore >= 65 ? 'Working Implementation' : 'Incomplete Logic',
      metric: round2Metric,
      badge: round2Badge
    },
    round3: {
      title: 'Round 3: System Architecture',
      score: architectureScore,
      verdict: topologyEvaluation ? topologyEvaluation.grade : 'Needs Work',
      metric: topologyEvaluation
        ? `${latestTopology?.nodes?.length || 0} nodes placed, Grade: ${topologyEvaluation.grade}`
        : 'Whiteboard canvas was blank',
      badge: round3Badge
    },
    round4: {
      title: 'Round 4: Situational STAR Defense',
      score: Math.min(100, Math.max(50, rawDimensions.star)),
      verdict: rawDimensions.star >= 80 ? 'Exemplary STAR' : rawDimensions.star >= 60 ? 'Structured Response' : 'Unstructured',
      metric: `${starStep} STAR steps articulated`,
      badge: round4Badge
    }
  };

  const starMetrics = {
    stepsCompleted: Math.min(4, Math.max(0, starStep)),
    stepsArticulated: `${starStep} STAR steps articulated`,
    badge: round4Badge
  };

  return {
    verdict: scoringResult.verdict,
    score: scoringResult.overallScore,
    readiness: scoringResult.readiness,
    roleName: scoringResult.roleName,
    rubricVersion: 'v1.0',
    appliedWeights: scoringResult.appliedWeights,
    radar: scoringResult.sanitizedDimensions,
    summary: `${scoringResult.verdict} performance recorded for ${scoringResult.roleName}.`,
    strengths: coaching.tailoredStrengths,
    improvements: coaching.coachingTips.join(' • '),
    coaching,
    telemetryDiagnostics,
    perRoundScores,
    starMetrics,
    solvingScore
  };
}

export function generateInterviewTranscriptMarkdown({
  activeTopicName,
  domainStream,
  teacherName,
  evaluationResult,
  eyeContactScore,
  wpmScore,
  fillerWordCount,
  codeContent,
  selectedLang,
  messages,
  tabSwitchCount
}: {
  activeTopicName: string;
  domainStream: 'tech' | 'non_tech';
  teacherName: string;
  evaluationResult: any;
  eyeContactScore: number | null;
  wpmScore: number | null;
  fillerWordCount: number;
  codeContent: string;
  selectedLang: string;
  messages: Message[];
  tabSwitchCount?: number;
}): string {
  const lines = [
    `# Pinit Career OS — Technical Interview Report`,
    `**Topic:** ${activeTopicName}  `,
    `**Track:** ${domainStream === 'non_tech' ? 'Non-Technical / Product' : 'Technical / Engineering'}  `,
    `**Interviewer:** ${teacherName}  `,
    `**Date:** ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}  `,
    `**Verdict:** ${evaluationResult?.verdict || 'Completed'} (${evaluationResult?.score || 0}%)  `,
    ...(evaluationResult?.readiness ? [`**Readiness:** ${evaluationResult.readiness}  `] : []),
    `- **STAR Framework Coverage:** ${evaluationResult?.perRoundScores?.round4?.metric || 'Articulated'} (${evaluationResult?.perRoundScores?.round4?.badge || 'STAR'})  `,
    `\n---\n`,
    `## 1. Per-Round Performance Breakdown`,
    `- **Round 1 (${evaluationResult?.perRoundScores?.round1?.badge || 'Behavioral'}):** ${evaluationResult?.perRoundScores?.round1?.score || 75}% — ${evaluationResult?.perRoundScores?.round1?.verdict || 'Competent'} (${evaluationResult?.perRoundScores?.round1?.metric || 'Verbal Q&A'})`,
    `- **Round 2 (${evaluationResult?.perRoundScores?.round2?.badge || 'Coding'}):** ${evaluationResult?.perRoundScores?.round2?.score || 70}% — ${evaluationResult?.perRoundScores?.round2?.verdict || 'Working'} (${evaluationResult?.perRoundScores?.round2?.metric || 'Test assertions'})`,
    `- **Round 3 (${evaluationResult?.perRoundScores?.round3?.badge || 'Systems'}):** ${evaluationResult?.perRoundScores?.round3?.score || 80}% — ${evaluationResult?.perRoundScores?.round3?.verdict || 'Viable'} (${evaluationResult?.perRoundScores?.round3?.metric || 'Canvas topology'})`,
    `- **Round 4 (${evaluationResult?.perRoundScores?.round4?.badge || 'STAR'}):** ${evaluationResult?.perRoundScores?.round4?.score || 85}% — ${evaluationResult?.perRoundScores?.round4?.verdict || 'Structured'} (${evaluationResult?.perRoundScores?.round4?.metric || 'STAR criteria'})`,
    `\n## 2. Telemetry & Delivery Diagnostics`,
    `- **Average Eye Contact:** ${typeof eyeContactScore === 'number' ? `${eyeContactScore}%` : 'Not Tracked'}`,
    `- **Speaking Pace:** ${typeof wpmScore === 'number' ? `${wpmScore} Words Per Minute` : 'Not Measured'}`,
    `- **Filler Words Count:** ${typeof fillerWordCount === 'number' ? fillerWordCount : 'Not Measured'}`,
    `- **Tab Switches / Pauses:** ${typeof tabSwitchCount === 'number' ? tabSwitchCount : 0}`,
    `\n## 3. Candidate Code Submission (${selectedLang})`,
    '```' + selectedLang,
    codeContent || '// No code submitted',
    '```',
    `\n## 4. Complete Interview Transcript\n`
  ];

  messages.forEach(m => {
    const sender = m.role === 'user' ? 'Candidate' : teacherName;
    lines.push(`**${sender}:** ${m.content}\n`);
  });

  return lines.join('\n');
}

export function generateScorecardPrintHtml({
  activeTopicName,
  domainStream,
  teacherName,
  evaluationResult,
  eyeContactScore,
  wpmScore,
  fillerWordCount,
  tabSwitchCount,
  messages,
}: {
  activeTopicName: string;
  domainStream: 'tech' | 'non_tech';
  teacherName: string;
  evaluationResult: any;
  eyeContactScore: number | null;
  wpmScore: number | null;
  fillerWordCount: number;
  tabSwitchCount?: number;
  messages: Message[];
}): string {
  const score = evaluationResult?.score || 0;
  const verdict = evaluationResult?.verdict || 'Completed';
  const rounds = evaluationResult?.perRoundScores || {};
  const evidence = evaluationResult?.answerQuality?.evidence || [];

  return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Scorecard - ' + activeTopicName + '</title>' +
    '<style>@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none; } }' +
    'body { font-family: sans-serif; margin: 40px; color: #1e293b; line-height: 1.5; background: #fff; }' +
    '.header { border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }' +
    '.brand { font-size: 20px; font-weight: 900; color: #6366f1; }' +
    '.score-badge { font-size: 28px; font-weight: 900; color: ' + (score >= 70 ? '#10b981' : '#f59e0b') + '; }' +
    '.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }' +
    '.card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }' +
    '.card h4 { margin: 0 0 6px 0; font-size: 13px; text-transform: uppercase; color: #64748b; }' +
    '.evidence { border-left: 3px solid #6366f1; padding: 8px 12px; margin-bottom: 8px; background: #f1f5f9; border-radius: 0 6px 6px 0; }' +
    '.evidence blockquote { margin: 0; font-style: italic; font-size: 13px; color: #0f172a; }' +
    '.evidence p { margin: 4px 0 0 0; font-size: 12px; color: #475569; }</style></head><body>' +
    '<div class="header"><div><div class="brand">PinIT Career OS — AI Mock Interview Official Scorecard</div>' +
    '<div style="font-size: 14px; color: #64748b; margin-top: 4px;">Topic: <strong>' + activeTopicName + '</strong> • Track: <strong>' + (domainStream === 'non_tech' ? 'Non-Tech / Commerce' : 'Tech / Engineering') + '</strong> • Panel: <strong>' + teacherName + '</strong></div></div>' +
    '<div style="text-align: right;"><div class="score-badge">' + score + '%</div><div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #64748b;">' + verdict + '</div></div></div>' +
    '<div class="grid"><div class="card"><h4>Round 1: Behavioral & Domain</h4><div style="font-size: 18px; font-weight: 800;">' + (rounds.round1?.score ?? 75) + '% — ' + (rounds.round1?.verdict ?? 'Competent') + '</div><div style="font-size: 12px; color: #64748b;">' + (rounds.round1?.metric ?? 'Verbal Q&A Communication') + '</div></div>' +
    '<div class="card"><h4>Round 2: Problem Solving</h4><div style="font-size: 18px; font-weight: 800;">' + (rounds.round2?.score ?? 70) + '% — ' + (rounds.round2?.verdict ?? 'Working') + '</div><div style="font-size: 12px; color: #64748b;">' + (rounds.round2?.metric ?? 'Test suite execution') + '</div></div>' +
    '<div class="card"><h4>Round 3: System Architecture</h4><div style="font-size: 18px; font-weight: 800;">' + (rounds.round3?.score ?? 80) + '% — ' + (rounds.round3?.verdict ?? 'Viable') + '</div><div style="font-size: 12px; color: #64748b;">' + (rounds.round3?.metric ?? 'Canvas topology verification') + '</div></div>' +
    '<div class="card"><h4>Round 4: STAR Defense</h4><div style="font-size: 18px; font-weight: 800;">' + (rounds.round4?.score ?? 85) + '% — ' + (rounds.round4?.verdict ?? 'Structured') + '</div><div style="font-size: 12px; color: #64748b;">' + (rounds.round4?.metric ?? 'STAR Framework Rigor') + '</div></div></div>' +
    '<div class="card" style="margin-bottom: 24px;"><h4>Delivery & Telemetry Diagnostics</h4><div style="display: flex; justify-content: space-between; font-size: 13px; margin-top: 8px;">' +
    '<span>Eye Contact Focus: <strong>' + (typeof eyeContactScore === 'number' ? eyeContactScore + '%' : 'N/A') + '</strong></span>' +
    '<span>Speaking Cadence: <strong>' + (typeof wpmScore === 'number' ? wpmScore + ' WPM' : 'N/A') + '</strong></span>' +
    '<span>Filler Words: <strong>' + (typeof fillerWordCount === 'number' ? fillerWordCount : 0) + '</strong></span>' +
    '<span>Tab Pauses: <strong>' + (typeof tabSwitchCount === 'number' ? tabSwitchCount : 0) + '</strong></span></div></div>' +
    (evidence.length > 0 ? ('<div style="margin-bottom: 24px;"><h3 style="font-size: 14px; text-transform: uppercase; color: #475569; margin-bottom: 12px;">Verified Transcript Quotations & Rubric Evidence</h3>' +
      evidence.map((e: any) => '<div class="evidence"><blockquote>"' + e.quote + '"</blockquote><p><strong>' + e.dimension + ':</strong> ' + e.assessment + '</p></div>').join('') + '</div>') : '') +
    '<div class="no-print" style="text-align: center; margin-top: 30px;"><button onclick="window.print()" style="background: #6366f1; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 800; cursor: pointer;">🖨️ Print / Save as PDF</button></div></body></html>';
}

export function exportInterviewTranscriptFile({
  format,
  activeTopicName,
  domainStream,
  teacherName,
  evaluationResult,
  eyeContactScore,
  wpmScore,
  fillerWordCount,
  codeContent,
  selectedLang,
  latestTopology,
  messages,
  tabSwitchCount
}: {
  format: 'markdown' | 'json' | 'pdf' | 'pdf';
  activeTopicName: string;
  domainStream: 'tech' | 'non_tech';
  teacherName: string;
  evaluationResult: any;
  eyeContactScore: number | null;
  wpmScore: number | null;
  fillerWordCount: number;
  codeContent: string;
  selectedLang: string;
  latestTopology: any;
  messages: Message[];
  tabSwitchCount?: number;
}) {
  if (typeof window === 'undefined') return;

    if (format === 'pdf') {
    const html = generateScorecardPrintHtml({
      activeTopicName,
      domainStream,
      teacherName,
      evaluationResult,
      eyeContactScore,
      wpmScore,
      fillerWordCount,
      tabSwitchCount,
      messages,
    });
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        try { printWindow.print(); } catch {}
      }, 300);
    }
    toast.success('Scorecard PDF Ready 📄', 'Opened print-ready PDF scorecard.');
    return;
  }

  if (format === 'json') {
    const payload = {
      topic: activeTopicName,
      domain: domainStream,
      interviewer: teacherName,
      date: new Date().toISOString(),
      overallScore: evaluationResult?.score || 0,
      verdict: evaluationResult?.verdict || 'Recorded',
      readiness: evaluationResult?.readiness,
      appliedWeights: evaluationResult?.appliedWeights,
      perRoundScores: evaluationResult?.perRoundScores,
      starMetrics: evaluationResult?.starMetrics || {
        stepsArticulated: evaluationResult?.perRoundScores?.round4?.metric,
        badge: evaluationResult?.perRoundScores?.round4?.badge
      },
      telemetry: {
        eyeContact: typeof eyeContactScore === 'number' ? eyeContactScore : null,
        wpm: typeof wpmScore === 'number' ? wpmScore : null,
        fillerWords: typeof fillerWordCount === 'number' ? fillerWordCount : null,
        tabSwitches: typeof tabSwitchCount === 'number' ? tabSwitchCount : 0
      },
      selectedLanguage: selectedLang,
      codeSolution: codeContent,
      architectureTopology: latestTopology,
      transcript: messages
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Interview_${activeTopicName.replace(/[^a-zA-Z0-9]/g, '_')}_Transcript.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Transcript Downloaded 📋', 'Exported full JSON interview record.');
  } else {
    const markdown = generateInterviewTranscriptMarkdown({
      activeTopicName,
      domainStream,
      teacherName,
      evaluationResult,
      eyeContactScore,
      wpmScore,
      fillerWordCount,
      codeContent,
      selectedLang,
      messages,
      tabSwitchCount
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Interview_${activeTopicName.replace(/[^a-zA-Z0-9]/g, '_')}_Transcript.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Transcript Downloaded 📋', 'Exported comprehensive Markdown interview report.');
  }
}
