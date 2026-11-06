import type { Difficulty, IntelligenceDimension, IntelligenceProfile, IntelligenceScores } from './types';

export type PuzzleArea = 'logic' | 'numerical' | 'pattern' | 'verbal';

export interface McqPuzzle {
  id: string;
  area: PuzzleArea;
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
}

export interface MindChoice {
  label: string;
  points: 0 | 1 | 2;
  feedback: string;
}

export interface MindScenario {
  id: string;
  dimension: Exclude<IntelligenceDimension, 'reasoning'>;
  title: string;
  context: string;
  constraint: string;
  choices: [MindChoice, MindChoice, MindChoice];
}

export const EMPTY_INTELLIGENCE_PROFILE: IntelligenceProfile = {
  reasoning: { total: 0, sessions: 0 },
  creative: { total: 0, sessions: 0 },
  executive: { total: 0, sessions: 0 },
  social: { total: 0, sessions: 0 },
};

export const MCQ_PUZZLES: Record<Difficulty, McqPuzzle[]> = {
  easy: [
    { id: 'e-l1', area: 'logic', prompt: 'Every nimb is a lora. Every lora has wings. What must be true?', choices: ['Every nimb has wings', 'Every winged thing is a nimb', 'No lora is a nimb', 'Some nimbs cannot fly'], answer: 0, explanation: 'The first rule puts every nimb inside the lora group; the second gives every lora wings.' },
    { id: 'e-l2', area: 'logic', prompt: 'A box contains only red and blue tiles. You draw one tile. What is certain?', choices: ['It is red', 'It is blue', 'It is red or blue', 'It is not blue'], answer: 2, explanation: 'Those are the only two colors in the box, so the draw must be one of them.' },
    { id: 'e-n1', area: 'numerical', prompt: 'What number comes next? 2, 4, 8, 16, …', choices: ['24', '30', '32', '34'], answer: 2, explanation: 'Each term doubles: 16 × 2 = 32.' },
    { id: 'e-n2', area: 'numerical', prompt: 'Five tickets cost ₹150. At the same price per ticket, what do eight cost?', choices: ['₹210', '₹220', '₹240', '₹280'], answer: 2, explanation: 'Each ticket costs ₹30, so eight cost 8 × ₹30 = ₹240.' },
    { id: 'e-p1', area: 'pattern', prompt: 'The shapes repeat: circle, square, triangle, circle, square, … What is the 8th shape?', choices: ['Circle', 'Square', 'Triangle', 'Cannot tell'], answer: 1, explanation: 'The pattern repeats every three positions. Position 8 matches position 2: square.' },
    { id: 'e-p2', area: 'pattern', prompt: 'Find the missing letter: A, C, F, J, O, …', choices: ['S', 'T', 'U', 'V'], answer: 2, explanation: 'The jumps grow by one: +2, +3, +4, +5, then +6 gives U.' },
    { id: 'e-v1', area: 'verbal', prompt: 'Choose the closest opposite of “fragile.”', choices: ['Delicate', 'Sturdy', 'Tiny', 'Rare'], answer: 1, explanation: 'Fragile means easily broken; sturdy means strong and not easily damaged.' },
    { id: 'e-v2', area: 'verbal', prompt: 'A reader finishes 12 pages in 20 minutes. At the same pace, how long for 18 pages?', choices: ['25 minutes', '28 minutes', '30 minutes', '36 minutes'], answer: 2, explanation: 'The pace is 0.6 pages per minute; 18 pages take 30 minutes.' },
  ],
  normal: [
    { id: 'n-l1', area: 'logic', prompt: 'If a release ships, its tests have passed. The tests did not pass. What follows?', choices: ['The release shipped anyway', 'The release did not ship', 'The tests were skipped', 'Nothing can be concluded'], answer: 1, explanation: 'If shipping requires passed tests, failed tests rule out a shipped release.' },
    { id: 'n-l2', area: 'logic', prompt: 'Mina arrived before Eli. Eli arrived before Noor. Who arrived first?', choices: ['Eli', 'Mina', 'Noor', 'There is not enough information'], answer: 1, explanation: 'Mina is before Eli, and Eli is before Noor, so Mina is first.' },
    { id: 'n-n1', area: 'numerical', prompt: 'What number comes next? 3, 7, 15, 31, …', choices: ['47', '55', '63', '64'], answer: 2, explanation: 'Double each term and add one: 31 × 2 + 1 = 63.' },
    { id: 'n-n2', area: 'numerical', prompt: 'Find the next number: 2, 3, 5, 9, 17, …', choices: ['25', '31', '33', '34'], answer: 2, explanation: 'The differences are 1, 2, 4, 8; they double, so the next difference is 16 and the answer is 33.' },
    { id: 'n-p1', area: 'pattern', prompt: 'What comes next? 1, 4, 9, 16, …', choices: ['20', '24', '25', '36'], answer: 2, explanation: 'These are consecutive squares: 1², 2², 3², 4², then 5² = 25.' },
    { id: 'n-p2', area: 'pattern', prompt: 'Face north. Turn right 90°, then left 180°. Which way are you facing?', choices: ['North', 'South', 'East', 'West'], answer: 3, explanation: 'From north, right is east. Turning left 180° from east points west.' },
    { id: 'n-v1', area: 'verbal', prompt: '“Scarce” is to “abundant” as “expand” is to …', choices: ['Enlarge', 'Contract', 'Stretch', 'Build'], answer: 1, explanation: 'Scarce and abundant are opposites; contract is the opposite of expand.' },
    { id: 'n-v2', area: 'verbal', prompt: 'All the editors are careful readers. Some careful readers are poets. Which must be true?', choices: ['Some editors are poets', 'All poets are editors', 'All editors are careful readers', 'No editors are poets'], answer: 2, explanation: 'Only the first statement is guaranteed. The overlap between poets and editors is unknown.' },
  ],
  hard: [
    { id: 'h-l1', area: 'logic', prompt: 'No A are B. Every C is A. Which statement must be true?', choices: ['No C are B', 'Every B is C', 'Some C are B', 'Every A is C'], answer: 0, explanation: 'Every C belongs to A, and A never overlaps B, so C cannot overlap B.' },
    { id: 'h-l2', area: 'logic', prompt: 'If A happens, B follows. If B happens, C follows. C did not happen. What must be true?', choices: ['A happened', 'B happened', 'Neither A nor B happened', 'C may still have happened'], answer: 2, explanation: 'Without C, B could not have happened; without B, A could not have happened.' },
    { id: 'h-n1', area: 'numerical', prompt: 'What number comes next? 1, 2, 6, 24, …', choices: ['96', '100', '120', '144'], answer: 2, explanation: 'Multiply by 2, then 3, then 4; next multiply 24 by 5 to get 120.' },
    { id: 'h-n2', area: 'numerical', prompt: 'Find the next number: 4, 9, 19, 39, …', choices: ['59', '69', '79', '81'], answer: 2, explanation: 'Each term doubles and adds one: 39 × 2 + 1 = 79.' },
    { id: 'h-p1', area: 'pattern', prompt: 'What comes next? 2, 6, 12, 20, 30, …', choices: ['36', '40', '42', '48'], answer: 2, explanation: 'The terms are n × (n + 1): 1×2, 2×3, …, 5×6, then 6×7 = 42.' },
    { id: 'h-p2', area: 'pattern', prompt: 'A mark turns 45° clockwise each step: ↑, ↗, →, ↘, … What is the 7th mark?', choices: ['↓', '↙', '←', '↖'], answer: 2, explanation: 'The sequence advances one eighth-turn each time. The 7th is six turns after ↑: ←.' },
    { id: 'h-v1', area: 'verbal', prompt: 'Choose the closest opposite of “opaque.”', choices: ['Dense', 'Transparent', 'Cloudy', 'Solid'], answer: 1, explanation: 'Opaque material does not let light through; transparent material does.' },
    { id: 'h-v2', area: 'verbal', prompt: 'Every analyst on the team knows SQL. No one who knows SQL is assigned to the audit queue. What follows about the analysts?', choices: ['All analysts are in the audit queue', 'No analyst is in the audit queue', 'Some analysts are not on the team', 'Analysts do not know SQL'], answer: 1, explanation: 'Team analysts know SQL, and nobody who knows SQL is assigned to the audit queue.' },
  ],
};

export const MIND_MOSAIC_SCENARIOS: Record<Difficulty, MindScenario[]> = {
  easy: [
    { id: 'ec1', dimension: 'creative', title: 'The quiet club', context: 'A student club has good ideas but very few people attend.', constraint: 'You have one afternoon and no budget.', choices: [
      { label: 'Copy the biggest club’s event exactly.', points: 0, feedback: 'A familiar format is easy, but it does not solve why this club is different.' },
      { label: 'Ask three students what would make them curious, then pilot one small themed meetup.', points: 2, feedback: 'You combine fresh input with a low-cost experiment, so the idea can improve from real reactions.' },
      { label: 'Post more reminders about the next regular meeting.', points: 1, feedback: 'More visibility may help, though the experience itself may still need a new hook.' },
    ] },
    { id: 'ec2', dimension: 'creative', title: 'The blank noticeboard', context: 'Students keep missing useful campus events because information is scattered.', constraint: 'You can make only one small change this week.', choices: [
      { label: 'Create a student-curated weekly “three things worth your time” board.', points: 2, feedback: 'A concise, human-curated format reduces noise and gives the board a recognizable voice.' },
      { label: 'Add every event you can find to one very long list.', points: 0, feedback: 'The information is together, but the volume may recreate the original problem.' },
      { label: 'Share the official calendar link in one more group chat.', points: 1, feedback: 'This is quick to try, but it still depends on students finding and filtering the calendar.' },
    ] },
    { id: 'ee1', dimension: 'executive', title: 'The event checklist', context: 'A campus event starts in 30 minutes. The welcome slide is unfinished, but the accessible entrance sign is missing.', constraint: 'You can finish only one task yourself.', choices: [
      { label: 'Finish the welcome slide first because everyone will see it.', points: 0, feedback: 'Polish matters, but access is a higher-impact blocker for attendees who need that route.' },
      { label: 'Put up the entrance sign, then ask another organizer to check the slide.', points: 2, feedback: 'You address the most consequential risk first and delegate the lower-risk task.' },
      { label: 'Try to do both at once without telling the team.', points: 1, feedback: 'You show urgency, but splitting attention and not coordinating raises the chance both remain incomplete.' },
    ] },
    { id: 'ee2', dimension: 'executive', title: 'Two urgent requests', context: 'A teammate asks for help with a presentation due tomorrow. A customer reports that sign-in is failing for everyone.', constraint: 'You have 20 minutes before your next commitment.', choices: [
      { label: 'Start with sign-in, confirm impact and notify the owner; then set a clear time for presentation help.', points: 2, feedback: 'You triage broad user impact first and make the other commitment explicit rather than silently dropping it.' },
      { label: 'Help with the presentation because you promised first.', points: 0, feedback: 'Reliability matters, but the widespread access failure has greater immediate impact.' },
      { label: 'Work on both in parallel and hope they finish.', points: 1, feedback: 'You respond to both, but no owner or next checkpoint is clear.' },
    ] },
    { id: 'es1', dimension: 'social', title: 'A quiet teammate', context: 'In a group meeting, one teammate has not spoken. The group is about to choose a plan.', constraint: 'The meeting has five minutes left.', choices: [
      { label: 'Ask, “You have been quiet; do you disagree with us?”', points: 0, feedback: 'It invites a response, but can make someone feel singled out or pressured to defend themselves.' },
      { label: 'Summarize the options and invite anyone to add a concern before the group decides.', points: 2, feedback: 'You make space for input without putting one person on the spot, while keeping the meeting moving.' },
      { label: 'Choose the plan and ask afterward if anyone had concerns.', points: 1, feedback: 'A follow-up is useful, but people lose a chance to shape the decision in the room.' },
    ] },
    { id: 'es2', dimension: 'social', title: 'A sharp comment', context: 'During a review, a classmate says, “This plan makes no sense.” The author looks uncomfortable.', constraint: 'You want to keep the review useful and respectful.', choices: [
      { label: 'Say the comment is rude and end the discussion.', points: 1, feedback: 'You protect the author, but the underlying concern remains unexplored.' },
      { label: 'Ask what specific risk they see, then invite the author to respond to that point.', points: 2, feedback: 'You lower the temperature and turn a personal-sounding judgment into a testable concern.' },
      { label: 'Ignore it and move to the next slide.', points: 0, feedback: 'Avoiding the tension may feel easier, but it leaves both the concern and impact unaddressed.' },
    ] },
  ],
  normal: [
    { id: 'nc1', dimension: 'creative', title: 'The low-engagement workshop', context: 'Students sign up for a skills workshop but stop attending after the first session.', constraint: 'You may change one part of the next session, and must learn whether it helped.', choices: [
      { label: 'Add more slides so the workshop feels more complete.', points: 0, feedback: 'More content does not directly test why people stopped coming.' },
      { label: 'Let students choose a real mini-project, then compare return attendance with the prior session.', points: 2, feedback: 'A choice-rich, hands-on format is a clear experiment with an observable outcome.' },
      { label: 'Offer a small attendance prize without changing the session.', points: 1, feedback: 'A reward may affect attendance, but it does not reveal whether the learning experience is valuable.' },
    ] },
    { id: 'nc2', dimension: 'creative', title: 'The one-screen challenge', context: 'A campus service needs to explain a confusing process on one mobile screen.', constraint: 'Students have mixed language ability and limited data.', choices: [
      { label: 'Use a short visual step map with plain-language labels and an optional audio explanation.', points: 2, feedback: 'Multiple low-bandwidth ways to understand the same steps make the design more inclusive and memorable.' },
      { label: 'Shrink the current policy text until it fits.', points: 0, feedback: 'The content fits, but readability and comprehension are likely to suffer.' },
      { label: 'Link to a long FAQ and keep the screen minimal.', points: 1, feedback: 'A FAQ can hold detail, but it leaves the key action unclear at the moment it is needed.' },
    ] },
    { id: 'ne1', dimension: 'executive', title: 'The release trade-off', context: 'A team has two hours before release. A new feature works, but one accessibility check is failing.', constraint: 'The failure affects keyboard-only users; the feature is not required for launch.', choices: [
      { label: 'Ship the feature and put the accessibility fix on the next sprint.', points: 0, feedback: 'The failing check blocks some users from using the experience; the optional feature does not justify that risk.' },
      { label: 'Hold the feature, fix or safely disable the failing path, and communicate the launch decision.', points: 2, feedback: 'You protect access, reduce scope deliberately, and make ownership and expectations clear.' },
      { label: 'Ask the team to work faster on both without changing scope.', points: 1, feedback: 'The urgency is clear, but the plan does not make a risk-based trade-off.' },
    ] },
    { id: 'ne2', dimension: 'executive', title: 'The overloaded team', context: 'Three tasks compete for one afternoon: patch a small typo, investigate a recurring data mismatch, and prepare a demo.', constraint: 'The mismatch may affect tomorrow’s decisions; the demo is in two days.', choices: [
      { label: 'Fix the typo first because it is easiest to close.', points: 0, feedback: 'Fast completion feels good, but it ignores the potential impact of the data issue.' },
      { label: 'Quickly assess the mismatch’s scope, assign an owner, and reserve time for the demo after the risk is understood.', points: 2, feedback: 'You reduce uncertainty first and preserve capacity for the upcoming commitment.' },
      { label: 'Spend the whole afternoon preparing the demo.', points: 1, feedback: 'The demo matters, but the potential data risk remains unbounded.' },
    ] },
    { id: 'ns1', dimension: 'social', title: 'The missed deadline', context: 'A teammate missed a handoff. Another teammate wants to remove them from the project immediately.', constraint: 'The reason is unknown, and the delivery is at risk.', choices: [
      { label: 'Ask privately what blocked the handoff, agree a recovery plan, and clarify what the team needs next.', points: 2, feedback: 'You learn context, protect the delivery, and keep accountability focused on specific next steps.' },
      { label: 'Tell them the team cannot rely on them.', points: 0, feedback: 'This labels the person before understanding the situation and makes recovery harder.' },
      { label: 'Quietly take over their work and say nothing.', points: 1, feedback: 'You may protect the deadline, but it hides the risk and prevents a sustainable plan.' },
    ] },
    { id: 'ns2', dimension: 'social', title: 'The disagreement', context: 'Two classmates disagree about which users to prioritize. Each has useful evidence, and the conversation is getting personal.', constraint: 'A decision is needed today.', choices: [
      { label: 'Choose the more confident speaker so the group can move on.', points: 0, feedback: 'Confidence is not evidence, and the choice may leave useful information unused.' },
      { label: 'Restate the shared goal, compare the evidence against it, and agree what would change the decision.', points: 2, feedback: 'You separate people from the decision and make the disagreement productive and revisitable.' },
      { label: 'Let each person present again without changing the decision method.', points: 1, feedback: 'More explanation can help, but a shared criterion is still missing.' },
    ] },
  ],
  hard: [
    { id: 'hc1', dimension: 'creative', title: 'The accessibility redesign', context: 'Students with low vision, unstable connectivity, and different first languages struggle with the same enrollment flow for different reasons.', constraint: 'You can prototype one intervention in three days and must avoid collecting sensitive data.', choices: [
      { label: 'Build a lightweight guided flow with readable defaults, translated key steps, and optional non-identifying feedback.', points: 2, feedback: 'This tackles multiple barriers, works within the privacy constraint, and creates a way to learn safely.' },
      { label: 'Add a chatbot that stores every conversation for later analysis.', points: 0, feedback: 'It may help some users, but it creates a sensitive-data risk and may exclude users with poor connectivity.' },
      { label: 'Translate the entire existing page and leave the layout unchanged.', points: 1, feedback: 'Language access improves, but visual accessibility and low-bandwidth usability remain unresolved.' },
    ] },
    { id: 'hc2', dimension: 'creative', title: 'The shrinking budget', context: 'A peer-learning program is losing funding but has strong participation and no dedicated venue.', constraint: 'The next iteration must cost less and preserve belonging.', choices: [
      { label: 'Replace long sessions with rotating, student-hosted micro-circles and a shared take-away board.', points: 2, feedback: 'The format turns the venue constraint into a distributed model while preserving continuity between groups.' },
      { label: 'Cancel the program until full funding returns.', points: 0, feedback: 'This avoids overspending but discards a valued service without testing a smaller form.' },
      { label: 'Keep the current program and ask volunteers to cover every cost.', points: 1, feedback: 'It preserves the format, but shifts the budget problem onto volunteers and risks burnout.' },
    ] },
    { id: 'he1', dimension: 'executive', title: 'The incident and the deadline', context: 'A data export is producing incorrect totals for a small set of users. A major presentation using those totals starts in 40 minutes.', constraint: 'You have one analyst, one engineer, and cannot verify a full fix before the presentation.', choices: [
      { label: 'Use the current export and explain the issue only if someone notices.', points: 0, feedback: 'Unverified figures could mislead decisions; silence increases trust and compliance risk.' },
      { label: 'Stop distribution of affected totals, alert the presenter, isolate scope, and offer verified alternatives.', points: 2, feedback: 'You contain harm, communicate early, and preserve decision quality while the team investigates.' },
      { label: 'Ask the engineer to patch the calculation immediately and keep preparing the presentation.', points: 1, feedback: 'A fix attempt is reasonable, but the plan lacks containment and a fallback if verification fails.' },
    ] },
    { id: 'he2', dimension: 'executive', title: 'The irreversible choice', context: 'A team can migrate its records tonight or delay a week. A rehearsal found one unresolved edge case in restoring archived files.', constraint: 'The migration is reversible only if the archive restore works.', choices: [
      { label: 'Proceed to avoid missing the date; the issue is probably rare.', points: 0, feedback: 'A low-frequency failure can still be severe when the rollback path is unverified.' },
      { label: 'Test the restore edge case with a representative backup, set a go/no-go threshold, and keep the delay option.', points: 2, feedback: 'You reduce uncertainty around the critical rollback assumption and make the decision criteria explicit.' },
      { label: 'Delay automatically without investigating the rehearsal result.', points: 1, feedback: 'Delay is safer than an unverified migration, but it misses a chance to learn and decide with evidence.' },
    ] },
    { id: 'hs1', dimension: 'social', title: 'The credit imbalance', context: 'A presentation credits one teammate for a result built by the whole group. The teammate may not know the slide is inaccurate.', constraint: 'The presentation is tomorrow and tensions are already high.', choices: [
      { label: 'Correct the slide privately with the teammate, agree on accurate credit, and share the update with the group.', points: 2, feedback: 'You preserve dignity while correcting the record and making recognition fair to everyone.' },
      { label: 'Call them out in the group chat so the issue is visible.', points: 0, feedback: 'Public confrontation may escalate a mistake that could have been corrected with less harm.' },
      { label: 'Leave it alone because the work is already finished.', points: 1, feedback: 'Avoiding conflict saves time now but leaves an inaccurate record and an unresolved fairness concern.' },
    ] },
    { id: 'hs2', dimension: 'social', title: 'The competing needs', context: 'A student requests flexibility after a personal emergency. Another student says exceptions are unfair because they followed the original deadline.', constraint: 'You must be consistent without asking anyone to disclose private details.', choices: [
      { label: 'Apply a clear, private extension policy consistently, and explain the same process is available to everyone.', points: 2, feedback: 'You protect privacy, treat students fairly, and make the rule transparent rather than arbitrary.' },
      { label: 'Grant the request only after asking for detailed proof in the group chat.', points: 0, feedback: 'This exposes private information and sets an unnecessarily intrusive precedent.' },
      { label: 'Refuse all flexibility so no one can claim unfairness.', points: 1, feedback: 'Uniformity is simple, but fairness can require a consistent process for reasonable exceptions.' },
    ] },
  ],
};

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Returns a balanced four-question sprint with one challenge from each reasoning area. */
export function createIqPuzzleSet(difficulty: Difficulty, random: () => number = Math.random): McqPuzzle[] {
  const byArea = (['logic', 'numerical', 'pattern', 'verbal'] as PuzzleArea[]).flatMap((area) => {
    const selected = shuffle(MCQ_PUZZLES[difficulty].filter((item) => item.area === area), random).slice(0, 1);
    return selected.map((item) => {
      const choices = shuffle(item.choices.map((text, index) => ({ text, correct: index === item.answer })), random);
      return { ...item, choices: choices.map((choice) => choice.text), answer: choices.findIndex((choice) => choice.correct) };
    });
  });
  return shuffle(byArea, random);
}

export function scoreIqPuzzleSet(questions: McqPuzzle[], answers: Array<number | null>): {
  score: number;
  areaScores: Partial<Record<PuzzleArea, number>>;
  correct: number;
} {
  const areas: PuzzleArea[] = ['logic', 'numerical', 'pattern', 'verbal'];
  let correct = 0;
  const areaScores: Partial<Record<PuzzleArea, number>> = {};
  for (const area of areas) {
    const items = questions.filter((question) => question.area === area);
    const attempted = items.filter((question) => answers[questions.indexOf(question)] !== null && answers[questions.indexOf(question)] !== undefined);
    const count = attempted.filter((question) => answers[questions.indexOf(question)] === question.answer).length;
    correct += count;
    if (attempted.length) areaScores[area] = Math.round((count / attempted.length) * 100);
  }
  const attempted = answers.filter((answer) => answer !== null && answer !== undefined).length;
  return { score: attempted ? Math.round((correct / attempted) * 100) : 0, areaScores, correct };
}

export function createMindMosaicSet(difficulty: Difficulty, random: () => number = Math.random): MindScenario[] {
  const dimensions: Array<Exclude<IntelligenceDimension, 'reasoning'>> = ['creative', 'executive', 'social'];
  return shuffle(dimensions.flatMap((dimension) => {
    const options = MIND_MOSAIC_SCENARIOS[difficulty].filter((scenario) => scenario.dimension === dimension);
    return shuffle(options, random).slice(0, 1);
  }), random);
}

export function scoreMindMosaic(scenarios: MindScenario[], answers: Array<number | null>): {
  score: number;
  dimensionScores: IntelligenceScores;
  totalPoints: number;
  maxPoints: number;
} {
  const dimensions: Array<Exclude<IntelligenceDimension, 'reasoning'>> = ['creative', 'executive', 'social'];
  const dimensionScores: IntelligenceScores = {};
  let totalPoints = 0;
  let maxPoints = 0;
  for (const dimension of dimensions) {
    const items = scenarios.filter((scenario) => scenario.dimension === dimension);
    let earned = 0;
    for (const scenario of items) {
      const max = Math.max(...scenario.choices.map((choice) => choice.points));
      const choiceIndex = answers[scenarios.indexOf(scenario)];
      if (choiceIndex === null || choiceIndex === undefined || !scenario.choices[choiceIndex]) continue;
      maxPoints += max;
      const points = choiceIndex === null || choiceIndex === undefined ? 0 : scenario.choices[choiceIndex]?.points || 0;
      earned += points;
      totalPoints += points;
    }
    const dimensionMax = items.reduce((sum, item) => {
      const choiceIndex = answers[scenarios.indexOf(item)];
      return choiceIndex === null || choiceIndex === undefined || !item.choices[choiceIndex]
        ? sum
        : sum + Math.max(...item.choices.map((choice) => choice.points));
    }, 0);
    if (dimensionMax > 0) dimensionScores[dimension] = Math.round((earned / dimensionMax) * 100);
  }
  return { score: maxPoints ? Math.round((totalPoints / maxPoints) * 100) : 0, dimensionScores, totalPoints, maxPoints };
}

export function mergeIntelligenceProfile(
  previous: Partial<IntelligenceProfile> | undefined,
  scores: IntelligenceScores
): IntelligenceProfile {
  const merged = { ...EMPTY_INTELLIGENCE_PROFILE } as IntelligenceProfile;
  for (const dimension of Object.keys(merged) as IntelligenceDimension[]) {
    const prior = previous?.[dimension];
    const total = Number.isFinite(prior?.total) ? Math.max(0, Math.min(100_000, Number(prior?.total))) : 0;
    const sessions = Number.isFinite(prior?.sessions) ? Math.max(0, Math.min(10_000, Number(prior?.sessions))) : 0;
    const nextScore = scores[dimension];
    if (typeof nextScore === 'number' && Number.isFinite(nextScore)) {
      merged[dimension] = { total: total + Math.max(0, Math.min(100, Math.round(nextScore))), sessions: sessions + 1 };
    } else {
      merged[dimension] = { total, sessions };
    }
  }
  return merged;
}

export function intelligenceProfileAverages(profile: Partial<IntelligenceProfile> | undefined): Record<IntelligenceDimension, number> {
  const dimensions: IntelligenceDimension[] = ['reasoning', 'creative', 'executive', 'social'];
  return Object.fromEntries(dimensions.map((dimension) => {
    const entry = profile?.[dimension];
    const total = Number.isFinite(entry?.total) ? Number(entry?.total) : 0;
    const sessions = Number.isFinite(entry?.sessions) ? Number(entry?.sessions) : 0;
    return [dimension, sessions > 0 ? Math.round(total / sessions) : 0];
  })) as Record<IntelligenceDimension, number>;
}
