import sys
import subprocess
import json

# Boost Day 22 spoken narrative and ensure 100% test matching across all 5 parts

p1_say = [
    "Welcome to Day 22 of Workplace Soft Skills and the inaugural day of Milestone 4: Advanced Interviewing, Technical Dialogue & Offer Negotiation. Today we deconstruct the critical final phase of every technical interview: The final five to eight minutes when the interviewer closes their coding document or architecture evaluation rubric and asks: 'Do you have any questions for me?'",
    "To the vast majority of software developers, this question feels like a polite, optional formality. The candidate has spent forty-five minutes sweating over complex dynamic programming algorithms or distributed cache coherence diagrams, their adrenaline is crashing, and they just want the interview to end. So they smile wearily and make the fatal mistake: 'No, I think you covered everything during the call, thank you!' Or worse, they ask a superficial throwaway question: 'So... what is your favorite thing about working here?' or 'What does a typical day look like for an engineer?'",
    "Let us understand The Reverse Interview Paradox: The final five minutes of an interview are NOT an intermission where the evaluation stops; the final five minutes are an active, high-leverage technical audition! In elite tech recruiting, the questions you ask reveal more about your seniority, architectural maturity, and systems thinking than the questions you answered.",
    "Think about the psychology of the interviewer: A junior engineer asks questions about themselves and their personal comfort: 'How soon will I get promoted?', 'What are the free snack options in the micro-kitchen?', 'Do you provide MacBooks?' These questions signal self-centered passivity and a lack of technical vision. But when a Senior or Staff Engineer takes the floor, their questions sound like an elite management consultant performing an operational audit! They ask about release engineering, technical debt allocation, on-call alert fatigue, architectural autonomy, and organizational bottlenecks.",
    "Notice what happens when you ask a truly high-signal technical question: The interviewer's posture changes! They lean forward, their eyes widen, and they realize: 'This candidate is not just looking for any random job; this candidate has standards. They care deeply about code craftsmanship, operational health, and team velocity.' You instantly shift the conversational power dynamic from an unequal interrogation to a peer-level architectural consultation.",
    "In this first part, we construct an automated Reverse Question Signal Classifier in TypeScript. We parse candidate reverse interview questions, categorize them into three signal tiers (Generic Fluff, Self-Centered Perqs, and High-Signal Engineering Diagnostics), compute an Interviewer Curiosity Score from 0 to 100, and evaluate candidate seniority perception.",
    "Let us analyze the three catastrophic anti-patterns of reverse interviewing: First, The Passive Pass: Saying you have no questions. This signals low intellectual curiosity and zero enthusiasm for the company's technical mission. Second, The Premature Compensation Inquiry: Asking about salary bands, bonus structures, or equity refreshes in the first technical screen. Compensation negotiation is critical, but it belongs with the recruiter or after an offer is extended. Third, The Generic Corporate Filler: Asking vague questions like 'What is the work-life balance like?' Nobody ever answers 'Our work-life balance is terrible and we hate our jobs.' You must ask precise, diagnostic questions that reveal the underlying truth through empirical data.",
    "Consider the concrete difference between a generic inquiry and an architectural diagnostic: A candidate who asks 'What is your release process?' gets a polished marketing response. But a candidate who asks 'From the moment a developer merges a pull request to main, what automated validation gates and canary analysis must pass before code hits production, and how frequently does the team deploy?' forces the interviewer to reveal their actual operational maturity. By mastering this reverse questioning posture, you elevate yourself from an ordinary applicant into an indispensable technical asset."
]

p2_say = [
    "Now that we recognize the strategic power of the reverse interview, let us master the definitive framework for constructing your inquiry portfolio: The 4 Pillars of High-Signal Reverse Engineering Inquiry.",
    "To systematically diagnose an engineering organization without coming across as aggressive or cynical, elite candidates structure their questions across four specific architectural pillars: Pillar 1: Technical Debt & Architectural Velocity; Pillar 2: Release Cadence, Testing & CI/CD Pipelines; Pillar 3: On-Call Health, SRE Practices & Incident Triage; and Pillar 4: Autonomy, Psychological Safety & Collaborative Disagreement.",
    "Let us dissect Pillar 1: Technical Debt & Architectural Velocity. In healthy engineering teams, leadership acknowledges that technical debt is real and allocates protected capacity to address it. Ask: 'How does your engineering team formally balance roadmap feature requests against refactoring legacy architecture? Is there a dedicated percentage of sprint capacity (such as 20%) allocated to debt, or how do tech leads champion architectural refactoring?' If the interviewer answers: 'Honestly, we don't really have time to pay down debt right now', you have discovered a critical architectural red flag: A burnout-inducing feature factory where technical debt compounds until production outages paralyze development.",
    "Next, examine Pillar 2: Release Cadence, Testing & CI/CD Pipelines. The deployment pipeline is the central nervous system of any software company. Ask: 'From the moment a developer merges a pull request to main, what automated validation gates (unit tests, integration tests, canary deploys) must pass before code hits production, and how frequently does the team deploy?' If the interviewer says: 'We deploy to production multiple times a day using automated canaries with automated rollback', you are looking at an elite DevOps culture. If they say: 'We deploy once a month on a Sunday night and everyone has to be on Zoom', you have uncovered an operational nightmare characterized by manual QA bottlenecks and risky mega-releases.",
    "Now examine Pillar 3: On-Call Health, SRE Practices & Incident Triage. On-call rotations can make or break your quality of life. Ask: 'What does your team's on-call rotation look like, what is the average alert volume during an on-call shift, and can you share an example of a systemic guardrail implemented from your last blameless postmortem?' This question immediately tells you whether the team suffers from toxic midnight alert fatigue or practices high-maturity SRE discipline where incidents are treated as learning opportunities rather than blame sessions.",
    "Finally, examine Pillar 4: Autonomy, Psychological Safety & Collaborative Disagreement. Engineering culture is revealed by how teams handle disagreement. Ask: 'Can you describe a recent situation where an engineer disagreed with an architectural proposal or roadmap decision? How was that disagreement evaluated, and how did the team align?' This reveals whether the culture welcomes data-driven debate or enforces authoritarian, top-down decrees.",
    "In this second part, we construct a 4-Pillars Reverse Inquiry Validator in TypeScript. We accept a candidate's portfolio of questions, verify balanced distribution across all four pillars, check for empirical diagnostic markers, and calculate a Culture Diagnostic Coverage Score from 0 to 100.",
    "Observe how a balanced inquiry portfolio operates during an interview: When an interviewer sees that you have structured questions across code health, operational deployment, incident response, and psychological safety, they realize that you are evaluating the company just as rigorously as they are evaluating you. This mutual respect changes the tenor of the hiring committee discussion from 'Should we hire this candidate?' to 'Can we win this candidate against competing offers?'"
]

p3_say = [
    "Now that we know what questions to ask, let us master the art of decoding the interviewer's answers: Diagnosing Engineering Culture Red Flags and Corporate Euphemisms.",
    "In job interviews, interviewers are naturally incentivized to present their company in the best possible light. Very few engineering managers will bluntly say: 'Our codebase is a spaghetti nightmare, our tests take four hours to run, and our CEO changes roadmap priorities every Friday afternoon.' Instead, unhealthy engineering teams disguise their operational dysfunction behind corporate euphemisms and coded language!",
    "Let us decode the four most common Engineering Euphemism Red Flags: Red Flag 1: 'We work hard and play hard!' Translation: Chronic unpaid overtime, midnight Slack pings, and boundary erosion disguised as team camaraderie. A healthy engineering culture values rested, sustainable engineers; Red Flag 2: 'Everyone here wears many hats!' Translation: Total role ambiguity, lack of dedicated DevOps or QA infrastructure, and engineers constantly pulled off core development to firefight customer support escalations; Red Flag 3: 'We move fast and don't believe in excessive bureaucracy or documentation!' Translation: Zero RFC architectural review, unreviewed code pushed directly to production, and zero onboarding runbooks; Red Flag 4: 'Leadership has a clear vision, so we execute without getting bogged down in debate.' Translation: Top-down authoritarian management where individual developer feedback is ignored and psychological safety is non-existent.",
    "Look at how an elite technical candidate detects these red flags: You do not accept superficial answers; you follow up with polite, empirical calibration probes! If the manager says 'We deploy frequently', probe gently: 'That is great! What percentage of your deploys require manual intervention or hotfixes in the first hour?' If the manager says 'We have a great on-call rotation', probe: 'How many times was the primary engineer paged outside of business hours last week?' Empirical numbers cannot hide behind corporate marketing.",
    "In this third part, we construct an automated Engineering Culture Red Flag Detector in TypeScript. We parse interviewer response transcripts, match them against a database of corporate euphemisms and dysfunction markers, compute an Organizational Health Score from 0 to 100, and calculate a Burnout Risk Index categorized as Low, Moderate, or Critical.",
    "Notice the profound career protection this skill provides: Accepting a job offer is a major multi-year commitment of your life and energy. Joining a company with chronic operational burnout, toxic technical debt, and zero psychological safety can stall your career progression and destroy your mental health. By mastering the diagnostic art of red flag detection, you protect your professional trajectory with surgical precision.",
    "Remember that an interview is a two-way forensic evaluation. When an engineering manager pauses awkwardly after being asked about on-call paging frequency or postmortem follow-through, that pause speaks volumes. Learn to listen not just to what is said, but to what is omitted. When you hear euphemisms of chaos, you can either probe deeper to quantify the risk or politely decline to move forward, preserving your career velocity for organizations that honor engineering excellence."
]

p4_say = [
    "Now let us examine how to adapt your reverse interview questions dynamically based on who is sitting across the table: Role-Tailored Inquiries across the hiring loop.",
    "A fatal blunder made by inexperienced candidates is asking the exact same questions to every single interviewer regardless of their role. If you ask a non-technical corporate recruiter: 'How do you tune your Kafka partition rebalancing under Kubernetes?', the recruiter will look at you with total bewilderment! You waste your final five minutes and fail to extract valuable organizational signal. Conversely, if you ask a Staff Distributed Systems Architect: 'What is the company's health insurance policy?', you waste precious face time with an elite technical leader on administrative HR trivia.",
    "Senior technical candidates tailor their reverse inquiries with surgical precision across the three primary interview personas: Persona 1: The Corporate Recruiter. The recruiter is the expert on organizational logistics, leveling, compensation philosophies, and company trajectory. Ask them: 'How is the engineering organization scaling over the next 12 months?', 'What is your leveling philosophy between L4, L5, and L6?', and 'What is the typical promotion and compensation review cadence?'; Persona 2: The Engineering Manager or Hiring Manager. The EM is the guardian of team health, product delivery, and performance management. Ask them: 'What does a successful first 90 days look like for this role?', 'How does the team balance roadmap feature requests against technical debt?', and 'What was the most challenging cross-functional disagreement your team resolved recently?'; Persona 3: The Staff or Principal Engineer Peer. The technical peer is in the trenches with code, architecture, and production outages. Ask them: 'What is the biggest architectural bottleneck in your distributed services right now?', 'From PR merge to production, what CI/CD gates exist?', and 'What was the last blameless postmortem action item that your team shipped?'",
    "In this fourth part, we construct an Interviewer Persona Question Matcher in TypeScript. We accept a candidate's prospective reverse interview questions, validate role-specific persona alignment across Recruiter, Engineering Manager, and Staff Peer, check for cross-persona misallocations, and score Persona Targeting Precision from 0 to 100.",
    "Notice the compound psychological effect of role-tailored inquiries: When an EM hears you ask about 90-day success metrics and cross-functional alignment, they recognize a future team anchor who understands business value. When a Staff Engineer hears you ask about distributed bottlenecks and CI gates, they recognize a peer with whom they can design systems on day one. You leave every interviewer feeling understood and deeply impressed.",
    "When you tailor questions to the interviewer's specific span of control, you demonstrate organizational intelligence. You prove that you understand how engineering organizations function, how decisions get made, and who owns which problems. This role-attuned communication style is one of the strongest subconscious signals of senior and executive presence in the entire interview process."
]

p5_say = [
    "We have systematically mastered the four pillars of reverse interviewing: 1. The psychological audition paradox of the final five minutes; 2. The 4-Pillars inquiry framework across Technical Debt, Release Cadence, On-Call, and Safety; 3. Decoding corporate euphemisms and operational red flags; and 4. Tailoring inquiries to specific interviewer personas.",
    "In this capstone fifth part, we synthesize these four disciplines into a unified Master Reverse Interviewing Simulator in TypeScript. This engine executes a 360-degree audit of any candidate's reverse interview strategy: It audits signal density across technical depth, verifies persona alignment, detects culture red flags from simulated interviewer responses, and calculates an overall Candidate Reverse Interview Mastery Score from 0 to 100.",
    "Let us reflect on the profound competitive transformation that occurs when you master reverse interviewing: In typical technical hiring loops, interviewers speak to five or six candidates a day. By 4:00 PM, all the candidates blur together in a sea of LeetCode code and similar resumes. But when the interviewer reaches the final five minutes with you, instead of hearing awkward silence or generic fluff, they find themselves engaged in the most intellectually stimulating technical conversation of their entire day!",
    "You ask about their deployment pipelines, their postmortem learnings, and their architectural bottlenecks with genuine curiosity and deep technical respect. When the interviewer fills out their evaluation scorecard that evening, they do not merely mark 'Pass'; they write an impassioned note: 'This candidate has exceptional systems maturity. They interviewed us as much as we interviewed them. Must hire at Senior or Staff leveling.'",
    "Let us examine how to prepare your personal reverse interview bank: Before every technical interview, prepare three customized questions for each interviewer on your schedule. Write them down in your private notes with the interviewer's name and title. When the interviewer opens the floor, do not hesitate: Deliver your questions with crisp, confident vocal presence, take active notes on their answers, and follow up on their technical details. You are now fully certified to conquer the reverse interview.",
    "Execute the Master Reverse Interviewing Simulator in TypeScript. Review its comprehensive composite scoring, analyze the multi-persona targeting benchmarks, and commit this high-signal framework to your permanent career repertoire. You are now prepared to turn the final five minutes of every interview into a commanding display of technical leadership.",
    "Always remember: Elite engineering organizations do not want desperate candidates who will accept any offer without scrutiny; they want discerning, thoughtful partners who care deeply about the systems they build and the teams they join. By treating the reverse interview as an architectural diagnostic, you establish yourself as an engineer of high caliber, integrity, and enduring value."
]

# Fix Part 3 code and output in Day 22
part3_code = """// Engineering Culture Red Flag Detector & Euphemism Decoder
interface InterviewerResponseTranscript {
  interviewerRole: string;
  companyName: string;
  questionAsked: string;
  interviewerAnswerText: string;
}

interface CultureDiagnosticScorecard {
  company: string;
  interviewerRole: string;
  organizationalHealthScore: number; // 0 - 100
  burnoutRiskLevel: 'LOW_RISK' | 'MODERATE_RISK' | 'CRITICAL_RISK';
  detectedRedFlags: string[];
  detectedPositiveSignals: string[];
  evaluationVerdict: string;
}

class EngineeringCultureRedFlagDetector {
  private readonly redFlagEuphemisms = [
    { pattern: 'work hard and play hard', flag: 'Chronic overtime and boundary erosion risk' },
    { pattern: 'wear many hats', flag: 'Role ambiguity and lack of operational support roles' },
    { pattern: 'wears many hats', flag: 'Role ambiguity and lack of operational support roles' },
    { pattern: 'don\\'t get bogged down', flag: 'Aversion to automated testing and documentation' },
    { pattern: 'fast-paced startup culture', flag: 'Erratic roadmap shifts and reactive fire-fighting' },
    { pattern: 'leadership has a clear vision', flag: 'Top-down authoritarian management without IC autonomy' },
    { pattern: 'deploy whenever we need to', flag: 'Absence of automated CI/CD deployment gates' },
    { pattern: 'rarely have time for refactoring', flag: 'Accumulating technical debt and feature factory mentality' }
  ];

  private readonly positiveSignals = [
    'blameless postmortem', 'automated canary', 'circuit breaker', 'protected sprint capacity',
    'sustainable on-call', 'rfc process', 'psychological safety', 'automated tests in ci',
    'error budget', 'dedicated platform team', 'work-life balance'
  ];

  auditInterviewerResponse(resp: InterviewerResponseTranscript): CultureDiagnosticScorecard {
    const textLower = resp.interviewerAnswerText.toLowerCase();

    const flagsFound: string[] = [];
    for (const item of this.redFlagEuphemisms) {
      if (textLower.includes(item.pattern.toLowerCase()) && !flagsFound.includes(item.flag)) {
        flagsFound.push(item.flag);
      }
    }

    const positivesFound: string[] = [];
    for (const pos of this.positiveSignals) {
      if (textLower.includes(pos.toLowerCase()) && !positivesFound.includes(pos)) {
        positivesFound.push(pos);
      }
    }

    // Calculate Health Score
    let score = 50 + (positivesFound.length * 20) - (flagsFound.length * 25);
    score = Math.max(0, Math.min(100, score));

    let risk: CultureDiagnosticScorecard['burnoutRiskLevel'] = 'LOW_RISK';
    if (score < 40) risk = 'CRITICAL_RISK';
    else if (score < 75) risk = 'MODERATE_RISK';

    let verdict = 'HEALTHY ENGINEERING CULTURE: High operational maturity, sustainable practices, and psychological safety.';
    if (risk === 'CRITICAL_RISK') {
      verdict = 'CRITICAL CULTURE ALERT: Multiple toxic euphemisms detected. High probability of operational chaos and burnout.';
    } else if (risk === 'MODERATE_RISK') {
      verdict = 'PROCEED WITH CAUTION: Some operational friction detected. Probe further on on-call load and technical debt.';
    }

    return {
      company: resp.companyName,
      interviewerRole: resp.interviewerRole,
      organizationalHealthScore: score,
      burnoutRiskLevel: risk,
      detectedRedFlags: flagsFound,
      detectedPositiveSignals: positivesFound,
      evaluationVerdict: verdict
    };
  }
}

const redFlagDetector = new EngineeringCultureRedFlagDetector();

const toxicResponse: InterviewerResponseTranscript = {
  interviewerRole: 'Engineering Manager',
  companyName: 'FinTech Chaos Inc',
  questionAsked: 'How does your team handle on-call shifts and technical debt?',
  interviewerAnswerText: 'Well, we are a fast-paced startup culture where everyone wears many hats. We work hard and play hard, so we deploy whenever we need to and rarely have time for refactoring or getting bogged down in documentation, but we celebrate wins together.'
};

const healthyResponse: InterviewerResponseTranscript = {
  interviewerRole: 'Staff Infrastructure Lead',
  companyName: 'Reliable Cloud Corp',
  questionAsked: 'How does your team handle on-call shifts and technical debt?',
  interviewerAnswerText: 'We maintain an error budget and allocate 20% protected sprint capacity exclusively for technical debt. Our on-call rotations are sustainable with automated canary deployments and instant automated rollbacks in CI, and every severity-1 incident results in a blameless postmortem with permanent systemic guardrails.'
};

console.log('=== ENGINEERING CULTURE RED FLAG AUDIT ===');
const diag1 = redFlagDetector.auditInterviewerResponse(toxicResponse);
console.log('Company:      ' + diag1.company + ' (' + diag1.interviewerRole + ')');
console.log('Health Score: ' + diag1.organizationalHealthScore + '/100 [Risk: ' + diag1.burnoutRiskLevel + ']');
console.log('Red Flags:    ' + diag1.detectedRedFlags.join(' | '));
console.log('Verdict:      ' + diag1.evaluationVerdict);
console.log('');
const diag2 = redFlagDetector.auditInterviewerResponse(healthyResponse);
console.log('Company:      ' + diag2.company + ' (' + diag2.interviewerRole + ')');
console.log('Health Score: ' + diag2.organizationalHealthScore + '/100 [Risk: ' + diag2.burnoutRiskLevel + ']');
console.log('Positives:    ' + diag2.detectedPositiveSignals.join(' | '));
console.log('Verdict:      ' + diag2.evaluationVerdict);
console.log('Diagnostic Invariant: Euphemisms like "work hard play hard" mask operational burnout; true health is proven by automated CI/CD and blameless postmortems.');"""

# Run part3_code via tsx to capture exact deterministic output
res = subprocess.run(['npx', 'tsx', '-e', part3_code], capture_output=True, text=True, shell=True)
if res.returncode != 0:
    print("Part 3 TSX Error:", res.stderr)
    sys.exit(1)
part3_output = res.stdout.strip().replace('\r\n', '\n')

# Now load get_day_22 from scripts/make_soft_skills_day22.py and update it
with open('scripts/make_soft_skills_day22.py', 'r', encoding='utf-8') as f:
    day22_code = f.read()

# Replace say arrays and part 3 code/output
# We can rewrite scripts/make_soft_skills_day22.py cleanly using json or template
from scripts.make_soft_skills_day22 import get_day_22
d = get_day_22()
d['parts'][0]['say'] = p1_say
d['parts'][1]['say'] = p2_say
d['parts'][2]['say'] = p3_say
d['parts'][2]['code'] = part3_code
d['parts'][2]['output'] = part3_output
d['parts'][3]['say'] = p4_say
d['parts'][4]['say'] = p5_say

# Verify words
w = [len(' '.join(p['say']).split()) for p in d['parts']]
print('Updated Day 22 Words:', sum(w), 'Parts:', w)

# Write updated day 22 python file
day22_py_content = f'''import json

def get_day_22():
    return {json.dumps(d, indent=4)}
'''
with open('scripts/make_soft_skills_day22.py', 'w', encoding='utf-8') as f:
    f.write(day22_py_content)

print('Updated scripts/make_soft_skills_day22.py successfully.')
