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
  archetype
}: EvaluationInput) {
  const userMsgCount = messages.filter(m => m.role === 'user').length;
  const roleKey = normalizeRoleKey(activeTopicName, domainStream);

  const verbalContribution = Math.min(88, Math.max(45, userMsgCount * 9));
  const topologyEvaluation = latestTopology?.nodes?.length
    ? evaluateSystemTopology(latestTopology, activeTopicName, domainStream)
    : null;
  const architectureScore = topologyEvaluation ? topologyEvaluation.score : 0;
  const solvingScore = codeSubmitted ? 90 : (verbalContribution > 65 ? 65 : 50);

  const rawDimensions = {
    logic: Math.max(35, Math.min(95, solvingScore * 0.95 + (architectureScore > 70 ? 5 : 0))),
    systems: Math.max(35, Math.min(95, architectureScore > 0 ? architectureScore : 40)),
    comms: Math.max(40, Math.min(95, 45 + userMsgCount * 8 - Math.min(15, fillerWordCount * 2))),
    solving: solvingScore,
    star: Math.max(35, Math.min(95, 40 + starStep * 15))
  };

  const scoringResult = calculateRoleWeightedScore(rawDimensions, roleKey);
  const coaching = generatePersonaCoaching(archetype, scoringResult.sanitizedDimensions, roleKey);
  const telemetryDiagnostics = generateTelemetryDiagnostics({
    eyeContact: typeof eyeContactScore === 'number' ? eyeContactScore : undefined,
    wpm: typeof wpmScore === 'number' ? wpmScore : undefined,
    fillerWords: typeof wpmScore === 'number' ? fillerWordCount : undefined
  });

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
      metric: codeSubmitted ? 'Test suite verified' : 'Manual code submitted',
      badge: 'Coding'
    },
    round3: {
      title: 'Round 3: System Architecture',
      score: architectureScore,
      verdict: topologyEvaluation ? topologyEvaluation.grade : 'Needs Work',
      metric: topologyEvaluation
        ? `${latestTopology?.nodes?.length || 0} nodes placed, Grade: ${topologyEvaluation.grade}`
        : 'Whiteboard canvas was blank',
      badge: 'System Design'
    },
    round4: {
      title: 'Round 4: Situational STAR Defense',
      score: Math.min(100, Math.max(50, rawDimensions.star)),
      verdict: rawDimensions.star >= 80 ? 'Exemplary STAR' : rawDimensions.star >= 60 ? 'Structured Response' : 'Unstructured',
      metric: `${starStep} STAR steps articulated`,
      badge: 'STAR Defense'
    }
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
    solvingScore
  };
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
  messages
}: {
  format: 'markdown' | 'json';
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
}) {
  if (format === 'json') {
    const payload = {
      topic: activeTopicName,
      domain: domainStream,
      interviewer: teacherName,
      date: new Date().toISOString(),
      overallScore: evaluationResult?.score || 0,
      verdict: evaluationResult?.verdict || 'Recorded',
      perRoundScores: evaluationResult?.perRoundScores,
      telemetry: {
        eyeContact: typeof eyeContactScore === 'number' ? eyeContactScore : null,
        wpm: typeof wpmScore === 'number' ? wpmScore : null,
        fillerWords: typeof wpmScore === 'number' ? fillerWordCount : null
      },
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
    const lines = [
      `# Pinit Career OS — Technical Interview Report`,
      `**Topic:** ${activeTopicName}  `,
      `**Track:** ${domainStream === 'non_tech' ? 'Non-Technical / Product' : 'Technical / Engineering'}  `,
      `**Interviewer:** ${teacherName}  `,
      `**Date:** ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}  `,
      `**Verdict:** ${evaluationResult?.verdict || 'Completed'} (${evaluationResult?.score || 0}%)  `,
      `\n---\n`,
      `## 1. Per-Round Performance Breakdown`,
      `- **Round 1 (Behavioral):** ${evaluationResult?.perRoundScores?.round1?.score || 75}% — ${evaluationResult?.perRoundScores?.round1?.verdict || 'Competent'} (${evaluationResult?.perRoundScores?.round1?.metric || 'Verbal Q&A'})`,
      `- **Round 2 (Coding):** ${evaluationResult?.perRoundScores?.round2?.score || 70}% — ${evaluationResult?.perRoundScores?.round2?.verdict || 'Working'} (${evaluationResult?.perRoundScores?.round2?.metric || 'Test assertions'})`,
      `- **Round 3 (Systems):** ${evaluationResult?.perRoundScores?.round3?.score || 80}% — ${evaluationResult?.perRoundScores?.round3?.verdict || 'Viable'} (${evaluationResult?.perRoundScores?.round3?.metric || 'Canvas topology'})`,
      `- **Round 4 (STAR):** ${evaluationResult?.perRoundScores?.round4?.score || 85}% — ${evaluationResult?.perRoundScores?.round4?.verdict || 'Structured'} (${evaluationResult?.perRoundScores?.round4?.metric || 'STAR criteria'})`,
      `\n## 2. Telemetry & Delivery Diagnostics`,
      `- **Average Eye Contact:** ${typeof eyeContactScore === 'number' ? `${eyeContactScore}%` : 'Not Tracked'}`,
      `- **Speaking Pace:** ${typeof wpmScore === 'number' ? `${wpmScore} Words Per Minute` : 'Not Measured'}`,
      `- **Filler Words Count:** ${typeof wpmScore === 'number' ? fillerWordCount : 'Not Measured'}`,
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

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Interview_${activeTopicName.replace(/[^a-zA-Z0-9]/g, '_')}_Transcript.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Transcript Downloaded 📋', 'Exported comprehensive Markdown interview report.');
  }
}
