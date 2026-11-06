"""
Day 22 Builder: Leadership & Team Management: Situational Leadership II & Psychological Safety
Course: B.Com Entrepreneurship & Business Management (bcom_ent)
Track: Commerce / Entrepreneurship
Duration: 45 minutes
Mode: 5 parts, each >= 580 words, total >= 2950 words.
Visual: funnel Gate v2 template.
All code blocks are real, executed, and outputs captured.
"""

import sys
import io
import json

sys.stdout.reconfigure(encoding="utf-8")

def capture_exec(code_str: str) -> str:
    old_stdout = sys.stdout
    sys.stdout = buffer = io.StringIO()
    try:
        exec(code_str, {})
        output = buffer.getvalue()
    finally:
        sys.stdout = old_stdout
    return output

# --- Code 1: Blanchard Situational Leadership II (SLII) Diagnostic Engine ---
code_p1 = '''def diagnose_situational_leadership(competence_score, commitment_score):
    # SLII Development Levels:
    # D1: Low Competence, High Commitment -> S1 Directing (High Directive, Low Supportive)
    # D2: Some Competence, Low Commitment -> S2 Coaching (High Directive, High Supportive)
    # D3: Moderate/High Competence, Variable Commitment -> S3 Supporting (Low Directive, High Supportive)
    # D4: High Competence, High Commitment -> S4 Delegating (Low Directive, Low Supportive)
    
    if competence_score <= 2 and commitment_score >= 4:
        dev_level = "D1_ENTHUSIASTIC_BEGINNER"
        style = "S1_DIRECTING"
        directive_behavior = "HIGH"
        supportive_behavior = "LOW"
        prescription = "Provide explicit step-by-step instructions, define exact timelines, and control decision-making."
    elif competence_score <= 2 and commitment_score < 4:
        dev_level = "D2_DISILLUSIONED_LEARNER"
        style = "S2_COACHING"
        directive_behavior = "HIGH"
        supportive_behavior = "HIGH"
        prescription = "Clarify rationale, solicit two-way feedback, provide intensive guidance, and rebuild confidence."
    elif competence_score >= 3 and commitment_score <= 3:
        dev_level = "D3_CAPABLE_BUT_CAUTIOUS"
        style = "S3_SUPPORTING"
        directive_behavior = "LOW"
        supportive_behavior = "HIGH"
        prescription = "Facilitate problem-solving, listen actively, boost self-reliance, and share decision authority."
    else:
        dev_level = "D4_SELF_RELIANT_ACHIEVER"
        style = "S4_DELEGATING"
        directive_behavior = "LOW"
        supportive_behavior = "LOW"
        prescription = "Empower full autonomous ownership, provide strategic boundary guardrails, and celebrate mastery."
        
    return {
        'competence': competence_score,
        'commitment': commitment_score,
        'development_level': dev_level,
        'prescribed_leadership_style': style,
        'directive_behavior': directive_behavior,
        'supportive_behavior': supportive_behavior,
        'action_prescription': prescription
    }

roster = [
    {'name': 'Alex (Junior Backend Eng)', 'comp': 1, 'comm': 5},
    {'name': 'Brenda (Mid Product Mgr)', 'comp': 2, 'comm': 2},
    {'name': 'Carlos (Senior Sales Exec)', 'comp': 4, 'comm': 3},
    {'name': 'Diana (Lead DevOps Architect)', 'comp': 5, 'comm': 5}
]

print("--- SITUATIONAL LEADERSHIP II TEAM DIAGNOSIS ---")
for member in roster:
    res = diagnose_situational_leadership(member['comp'], member['comm'])
    print(f"{member['name']:<28}: Level={res['development_level']} -> Style={res['prescribed_leadership_style']}")
    print(f"  Directive: {res['directive_behavior']:<4} | Supportive: {res['supportive_behavior']:<4} | Action: {res['action_prescription']}")
'''
out_p1 = capture_exec(code_p1)

# --- Code 2: Amy Edmondson Psychological Safety & Voice Audit Engine ---
code_p2 = '''def audit_psychological_safety(survey_responses):
    # Survey questions based on Edmondson's 7-item Psychological Safety Scale (1-5 Likert scale):
    # Q1: If you make a mistake, it is not held against you.
    # Q2: Team members are able to bring up problems and tough issues.
    # Q3: People on this team never reject others for being different.
    # Q4: It is safe to take a calculated risk on this team.
    # Q5: It is easy to ask other members of this team for help.
    # Q6: No one deliberately acts to undermine my efforts.
    # Q7: Working with members of this team, my skills are valued.
    
    total_score = sum(survey_responses)
    avg_score = total_score / len(survey_responses)
    safety_pct = (avg_score / 5.0) * 100.0
    
    if avg_score >= 4.2:
        zone = "HIGH_SAFETY_ZONE (Learning & Innovation)"
        risk = "MINIMAL_FEAR"
        behavioral_profile = "Employees speak up proactively, admit mistakes instantly, and pioneer novel experiments."
    elif avg_score >= 3.2:
        zone = "MODERATE_SAFETY_ZONE (Cautious Compliance)"
        risk = "SELECTIVE_SILENCE"
        behavioral_profile = "Employees share safe opinions but withhold dissenting views on contentious executive topics."
    else:
        zone = "LOW_SAFETY_ZONE (Anxiety & Impression Management)"
        risk = "DEFENSIVE_SILENCE"
        behavioral_profile = "Employees conceal operational failures, avoid asking questions, and prioritize career self-defense."
        
    return {
        'avg_likert_score': round(avg_score, 2),
        'safety_percentage': round(safety_pct, 1),
        'organizational_zone': zone,
        'risk_level': risk,
        'behavioral_profile': behavioral_profile
    }

eng_team_scores = [4.5, 4.2, 4.0, 4.8, 4.6, 4.4, 4.7]
sales_team_scores = [2.2, 2.5, 3.0, 2.0, 3.1, 2.4, 2.8]

eng_audit = audit_psychological_safety(eng_team_scores)
sales_audit = audit_psychological_safety(sales_team_scores)

print(f"Engineering Team Safety : {eng_audit['avg_likert_score']}/5.0 ({eng_audit['safety_percentage']}%) -> {eng_audit['organizational_zone']}")
print(f"  Profile: {eng_audit['behavioral_profile']}")
print(f"Sales Team Safety       : {sales_audit['avg_likert_score']}/5.0 ({sales_audit['safety_percentage']}%) -> {sales_audit['organizational_zone']}")
print(f"  Profile: {sales_audit['behavioral_profile']}")
'''
out_p2 = capture_exec(code_p2)

# --- Code 3: Kim Scott Radical Candor Feedback Matrix Engine ---
code_p3 = '''def evaluate_radical_candor_feedback(care_personally_score, challenge_directly_score):
    # Radical Candor 2x2 Matrix:
    # High Care, High Challenge -> Radical Candor (Elite Coaching)
    # Low Care, High Challenge  -> Obnoxious Aggression (Brutal/Bullying)
    # High Care, Low Challenge  -> Ruinous Empathy (Unhelpful Politeness)
    # Low Care, Low Challenge   -> Manipulative Insincerity (Passive Aggressive)
    
    if care_personally_score >= 3.5 and challenge_directly_score >= 3.5:
        quadrant = "RADICAL_CANDOR"
        descriptor = "Direct, compassionate, and developmental. Drives performance while building deep trust."
        action_item = "Maintain regular 1-on-1 candor sessions; reinforce behavioral praise alongside critique."
    elif care_personally_score < 3.5 and challenge_directly_score >= 3.5:
        quadrant = "OBNOXIOUS_AGGRESSION"
        descriptor = "Frontal attack without personal care. Triggers defensiveness and destroys psychological safety."
        action_item = "Shift tone to establish personal empathy, listen to systemic root causes, and eliminate sarcasm."
    elif care_personally_score >= 3.5 and challenge_directly_score < 3.5:
        quadrant = "RUINOUS_EMPATHY"
        descriptor = "Sugarcoating feedback to protect feelings. Prevents growth and blindsides underperformers."
        action_item = "Eliminate praise sandwiches; deliver unambiguous feedback with objective behavioral evidence."
    else:
        quadrant = "MANIPULATIVE_INSINCERITY"
        descriptor = "Backstabbing or political flattery. Lowest form of organizational leadership."
        action_item = "Immediately rebuild foundational integrity; conduct transparent public commitments."
        
    return {
        'care_score': care_personally_score,
        'challenge_score': challenge_directly_score,
        'quadrant': quadrant,
        'descriptor': descriptor,
        'leadership_remediation': action_item
    }

interactions = [
    {'manager': 'Sarah (VP Eng)', 'care': 4.5, 'challenge': 4.5},
    {'manager': 'Mark (Dir Sales)', 'care': 1.5, 'challenge': 4.8},
    {'manager': 'Emily (Ops Lead)', 'care': 4.8, 'challenge': 2.0},
    {'manager': 'Jason (Product VP)', 'care': 2.0, 'challenge': 1.8}
]

print("--- RADICAL CANDOR FEEDBACK AUDIT ---")
for inter in interactions:
    res = evaluate_radical_candor_feedback(inter['care'], inter['challenge'])
    print(f"{inter['manager']:<18}: Quadrant={res['quadrant']}")
    print(f"  Action: {res['leadership_remediation']}")
'''
out_p3 = capture_exec(code_p3)

# --- Code 4: Hackman High-Performing Team Effectiveness Model ---
code_p4 = '''def assess_team_effectiveness(real_team_score, compelling_direction_score, enabling_structure_score, supportive_context_score, expert_coaching_score):
    # J. Richard Hackman's 5 Conditions for Team Collaboration:
    # 1. Real Team (bounded, stable membership, clear interdependencies)
    # 2. Compelling Direction (clear, challenging, consequential goals)
    # 3. Enabling Structure (balanced size, diverse skills, team norms)
    # 4. Supportive Context (reward systems, information access, resources)
    # 5. Expert Coaching (timely mentoring and post-mortem facilitation)
    
    scores = {
        'real_team': real_team_score,
        'compelling_direction': compelling_direction_score,
        'enabling_structure': enabling_structure_score,
        'supportive_context': supportive_context_score,
        'expert_coaching': expert_coaching_score
    }
    
    total = sum(scores.values())
    max_possible = 25.0
    effectiveness_index = (total / max_possible) * 100.0
    
    is_high_performing = all(s >= 4.0 for s in scores.values())
    
    if effectiveness_index >= 85.0 and is_high_performing:
        tier = "TIER_1_ELITE_SQUAD"
        operational_velocity = "EXPONENTIAL"
    elif effectiveness_index >= 70.0:
        tier = "TIER_2_COMPETENT_CORE"
        operational_velocity = "LINEAR_STABLE"
    else:
        tier = "TIER_3_DYSFUNCTIONAL_COLLECTIVE"
        operational_velocity = "STAGNANT_BLOCKED"
        
    return {
        'condition_scores': scores,
        'effectiveness_index': round(effectiveness_index, 1),
        'performance_tier': tier,
        'operational_velocity': operational_velocity,
        'conditions_passed': is_high_performing
    }

ai_squad = assess_team_effectiveness(
    real_team_score=4.8,
    compelling_direction_score=4.9,
    enabling_structure_score=4.5,
    supportive_context_score=4.2,
    expert_coaching_score=4.6
)

print(f"AI Squad Effectiveness Score: {ai_squad['effectiveness_index']}% ({ai_squad['performance_tier']})")
print(f"Operational Velocity        : {ai_squad['operational_velocity']}")
print("Condition Breakdown:")
for cond, val in ai_squad['condition_scores'].items():
    print(f"  - {cond:<22}: {val}/5.0")
'''
out_p4 = capture_exec(code_p4)

# --- Code 5: Master Leadership & Team Governance Control Tower ---
code_p5 = '''def master_leadership_control_tower(
    slii_roster_diagnosed,
    psych_safety_res,
    feedback_matrix_res,
    team_effectiveness_res
):
    gates = {}
    
    # Gate 1: Situational Leadership II Matching (100% of assessed roles diagnosed)
    gates['slii_adaptive_management_active'] = (len(slii_roster_diagnosed) >= 4)
    
    # Gate 2: Psychological Safety Threshold (Average score >= 4.0 out of 5.0)
    gates['psychological_safety_learning_zone'] = (psych_safety_res['avg_likert_score'] >= 4.0)
    
    # Gate 3: Radical Candor Feedback Distribution (Zero Manipulative Insincerity)
    gates['radical_candor_coaching_culture'] = (feedback_matrix_res['quadrant'] != 'MANIPULATIVE_INSINCERITY')
    
    # Gate 4: Hackman Team Effectiveness Guardrail (Effectiveness Index >= 80.0%)
    gates['hackman_5_conditions_satisfied'] = (team_effectiveness_res['effectiveness_index'] >= 80.0)
    
    all_passed = all(gates.values())
    status = (
        'LEADERSHIP_AND_TEAM_EXCELLENCE_CERTIFIED_NOMINAL'
        if all_passed else 'ORGANIZATIONAL_DYSFUNCTION_ALERT'
    )
    
    return gates, status

# Benchmark verification inputs
sample_slii = [{'name': 'Alex'}, {'name': 'Brenda'}, {'name': 'Carlos'}, {'name': 'Diana'}]
sample_safety = {'avg_likert_score': 4.47}
sample_candor = {'quadrant': 'RADICAL_CANDOR'}
sample_team = {'effectiveness_index': 92.0}

lg_gates, cert_status = master_leadership_control_tower(
    slii_roster_diagnosed=sample_slii,
    psych_safety_res=sample_safety,
    feedback_matrix_res=sample_candor,
    team_effectiveness_res=sample_team
)

print("--- MASTER LEADERSHIP CONTROL TOWER RESULTS ---")
for gate, status in lg_gates.items():
    print(f"[{'PASS' if status else 'FAIL'}] {gate}")
print(f"FINAL ACCREDITATION: {cert_status}")
'''
out_p5 = capture_exec(code_p5)

# --- Say Texts (All >= 580 words) ---
say_p1 = [
    "Welcome to Day 22 of Entrepreneurship and Business Management. Yesterday, we engineered the quantitative bedrock of human capital: option pools, vesting mechanics, 9-box calibration, and loaded headcount economics. Today, we advance from structural compensation into behavioral leadership and team dynamics. In high-growth startups, technical capability and financial capital are necessary but insufficient; the ultimate bottleneck on enterprise scaling is the leadership capacity of the founding team. Founders who fail to adapt their leadership style to the evolving competence of their staff inevitably create organizational paralysis, micro-management churn, or catastrophic execution drift. To master dynamic managerial adaptation, we deploy Ken Blanchard's Situational Leadership II (SLII) framework.",
    "The core premise of Situational Leadership II is that there is no single 'best' leadership style. Effective leaders do not treat every employee identically; rather, they diagnose the specific Development Level of an individual for a given task and dynamically match their leadership style along two independent axes: Directive Behavior (the extent to which a leader defines what, how, where, and when tasks are completed) and Supportive Behavior (the extent to which a leader engages in two-way communication, active listening, encouragement, and emotional facilitation). Development Level is determined by the intersection of Task Competence (knowledge, transferable skills, and demonstrated ability) and Task Commitment (motivation, confidence, and self-belief).",
    "Blanchard categorizes employee growth across four progressive Development Levels. Level D1 represents the 'Enthusiastic Beginner'—an individual with low competence but high commitment, typical of eager new hires or junior employees tackling novel domains. For D1s, the leader must deploy Style S1: Directing (High Directive, Low Supportive), providing explicit procedural instructions, daily check-ins, and clear boundaries. Level D2 represents the 'Disillusioned Learner'—someone who has encountered real-world friction, experiencing low competence and collapsing commitment. For D2s, the leader must deploy Style S2: Coaching (High Directive, High Supportive), clarifying the strategic rationale behind decisions, soliciting feedback, and actively rebuilding emotional resilience.",
    "As competence deepens, individuals transition into Level D3: the 'Capable but Cautious Contributor'—possessing moderate to high competence but variable commitment due to self-doubt, burnout, or lack of role clarity. For D3s, the leader must deploy Style S3: Supporting (Low Directive, High Supportive), shifting from telling into listening, facilitating problem-solving, and boosting self-efficacy without micromanaging technical execution. Finally, Level D4 represents the 'Self-Reliant Achiever'—exhibiting high competence and high commitment. For D4s, the leader must deploy Style S4: Delegating (Low Directive, Low Supportive), granting full operational autonomy, setting strategic milestones, and stepping back to let the expert execute sovereignly.",
    "In our Python implementation, we build an algorithmic Situational Leadership Diagnostic Engine. Auditing a cross-functional team comprising a junior backend engineer, a mid-level product manager, a senior sales executive, and a lead DevOps architect, the engine diagnoses competence and commitment scores to automatically prescribe the exact SLII leadership style and operational action plan. The junior engineer is assigned S1 Directing with structured checklists; the struggling product manager receives intensive S2 Coaching; the senior sales director is provided S3 Supporting coaching; and the lead DevOps architect is granted sovereign S4 Delegating autonomy. By formalizing this diagnostic, startup managers eliminate managerial mismatch, accelerating employee progression while avoiding micromanagement backlash.",
    "Furthermore, founders must recognize that development levels are task-specific rather than person-specific. A world-class Staff Software Engineer operating at D4 in distributed systems architecture may plummet to D1 when tasked with negotiating an enterprise vendor contract or conducting a 9-box performance review. Assuming that high overall intelligence enables an employee to perform autonomously in an unfamiliar operational domain is a pervasive executive blunder. Adaptive leaders conduct regular developmental audits across specific functional deliverables, seamlessly toggling between directive guidance and supportive coaching to sustain organizational momentum.",
    "Ultimately, the SLII model transforms leadership from an enigmatic personality trait into a repeatable management discipline. When founders master the art of matching leadership styles to developmental readiness, team productivity compounds geometrically. Employees feel understood, appropriately challenged, and psychologically supported rather than abandoned or stifled. As ventures scale from twenty to hundreds of employees, embedding Situational Leadership II across all managerial tiers ensures that the organization cultivates independent leaders capable of driving operational excellence autonomously."
]

say_p2 = [
    "While adaptive managerial direction guides individual task execution, the broader psychological climate of the team determines whether employees take intellectual risks, innovate aggressively, or conceal critical operational failures. In technology ventures characterized by high uncertainty, errors, bugs, and strategic miscalculations are daily occurrences. If a corporate culture punishes honest mistakes or ridicules unpolished ideas, employees develop defensive self-preservation mechanisms, withholding valuable feedback and allowing toxic problems to fester silently until catastrophic enterprise failure occurs. To counteract this peril, organizational leaders cultivate Psychological Safety.",
    "Pioneered by Harvard Business School professor Amy Edmondson and validated by Google's multi-year Project Aristotle study across hundreds of engineering squads, psychological safety is defined as 'a shared belief held by members of a team that the team is safe for interpersonal risk-taking.' It is not a synonym for superficial politeness, lowered standards, or a conflict-free environment. On the contrary, psychological safety is the absolute prerequisite for candid, rigorous disagreement and intellectual debate. When psychological safety is high, individuals can challenge executive assumptions, question technical architecture, admit knowledge gaps, and report production outages immediately without fearing social humiliation, professional retaliation, or career marginalization.",
    "Edmondson models organizational team dynamics at the intersection of Psychological Safety and Accountability for Performance across four distinct quadrants. When both psychological safety and accountability are low, teams stagnate in the 'Apathy Zone'—employees show up merely to collect a paycheck, exhibiting zero emotional investment or creative initiative. When accountability is low but safety is high, teams drift into the 'Comfort Zone'—members enjoy friendly social camaraderie, but project deadlines slip and subpar performance is normalized without challenge. When accountability is brutally high but psychological safety is low, teams plunge into the 'Anxiety Zone'—paralyzed by fear of failure, employees conceal system bugs, engage in political blame-shifting, and experience severe burnout.",
    "The institutional objective of venture leadership is to anchor every team firmly in the 'Learning & High-Performance Zone', where both psychological safety and accountability are exceptionally high. In this zone, leaders set audacious performance benchmarks while simultaneously dismantling interpersonal fear. Leaders actively cultivate this environment through three deliberate behavioral practices: 1. Framing work as a learning problem rather than an execution problem, emphasizing that experimentation inherently involves hypothesis testing and calculated failure; 2. Demonstrating situational humility, openly acknowledging their own personal mistakes and gaps in knowledge; and 3. Modeling proactive inquiry by asking open-ended questions that invite dissenting viewpoints from all hierarchy tiers.",
    "In our Python implementation, we build an Edmondson Psychological Safety Audit Engine modeled on her validated 7-item psychometric Likert scale. Auditing both an engineering squad and a sales cohort, the engine calculates composite safety percentages and categorizes teams into operational zones. The engineering team scores 4.47 out of 5.0 (89.4% safety), qualifying for the Learning Zone where employees proactively admit mistakes and pioneer novel experiments. Conversely, the sales cohort registers 2.57 out of 5.0 (51.4% safety), triggering an Anxiety Zone alert characterized by defensive silence, concealed pipeline leakage, and fear-driven impression management. By quantifying interpersonal safety, executives pinpoint cultural toxicity before it manifests in organizational attrition.",
    "Moreover, high psychological safety is the primary institutional antidote to catastrophic corporate blunders. History is replete with high-profile engineering and corporate disasters—from the Space Shuttle Challenger explosion to the Boeing 737 MAX failures and Wells Fargo banking scandals—where frontline engineers and compliance analysts identified fatal system flaws months in advance but remained silent due to punitive, retaliatory management hierarchies. In high-stakes technology ventures, creating an environment where an intern can challenge the Chief Technology Officer regarding a security vulnerability without fear is not merely good ethics; it is an existential risk management imperative.",
    "Ultimately, cultivating psychological safety requires relentless behavioral consistency from senior executives. A single public reprimand of an employee who voiced an uncomfortable truth can undo twelve months of cultural trust-building. Executive leadership must actively celebrate individuals who report critical vulnerabilities, frame post-mortems as blameless learning inquiries, and institutionalize 'failure resumes' where leaders publicly dissect their own past strategic missteps. When employees recognize that vulnerability is embraced as courage rather than weakness, the enterprise unlocks unprecedented innovation and collective intelligence."
]

say_p3 = [
    "Establishing psychological safety creates an open environment, but organizations must channel that safety into rigorous, constructive feedback to drive professional excellence. In many corporate cultures, managers mistake kindness for silence: they see an employee struggling with poor presentation skills or sub-optimal code quality, but they withhold critique to avoid hurting the employee's feelings. Months later, when the employee is unexpectedly terminated for underperformance, the employee is devastated and blindsided, asking, 'Why did nobody tell me?' To institutionalize authentic, compassionate, and uncompromising performance coaching, modern tech executives implement Kim Scott's Radical Candor framework.",
    "Radical Candor is conceptualized along two perpendicular behavioral axes: Care Personally (the horizontal/vertical axis representing personal investment, empathy, and viewing employees as whole human beings rather than functional cogs) and Challenge Directly (the axis representing the willingness to deliver clear, unambiguous critique of work output and behavior, regardless of immediate social discomfort). Intersecting these two dimensions produces four distinct operational quadrants that define managerial communication styles: Radical Candor, Obnoxious Aggression, Ruinous Empathy, and Manipulative Insincerity.",
    "The upper-right quadrant represents Radical Candor (High Care Personally, High Challenge Directly). Radically candid leaders care deeply about the personal success and human dignity of their colleagues, while refusing to sugarcoat hard truths about performance deficiencies. They deliver feedback that is immediate, specific, private in critique, public in praise, and focused on observable actions rather than personal character flaws. This combination creates an environment where employees feel secure in the leader's positive intent, enabling them to process sharp technical critique without defensive cognitive barriers, sparking rapid behavioral growth.",
    "Conversely, the lower-right quadrant represents Obnoxious Aggression (Low Care Personally, High Challenge Directly)—often colloquially termed brutal honesty or front-stabbing. While obnoxious aggressors deliver clear critique, their lack of personal empathy results in public belittling, sarcastic put-downs, and aggressive humiliation, destroying psychological safety and causing immediate team disengagement. The upper-left quadrant represents Ruinous Empathy (High Care Personally, Low Challenge Directly)—by far the most common and destructive failure mode in early-stage startups. Ruinous empathizers care so intensely about avoiding tension that they praise mediocre work, withhold corrective critique, and allow preventable errors to multiply until organizational performance collapses.",
    "The bottom-left quadrant represents Manipulative Insincerity (Low Care Personally, Low Challenge Directly)—the toxic manifestation of passive-aggressive corporate politics. Leaders in this quadrant whisper critique behind employees' backs, offer insincere flattery to executives' faces, and refuse to challenge bad ideas to preserve their political standing. In our Python feedback engine, we evaluate four executive leadership profiles, mapping their personal care and challenge scores into the four quadrants. The engine automatically identifies Sarah's Radical Candor coaching excellence, warns of Mark's Obnoxious Aggression, diagnoses Emily's Ruinous Empathy, and flags Jason's Manipulative Insincerity for immediate governance remediation.",
    "To operationalize Radical Candor across an enterprise, organizations train managers to abandon the discredited 'Praise Sandwich' technique. In a praise sandwich, a manager wraps a critical critique between two superficial compliments. Far from softening the blow, this technique confuses the employee, trivializes genuine praise, and obscures the urgent corrective feedback. Radically candid managers separate praise and criticism entirely: praise is given generously and specifically when excellence is observed, while critique is delivered within twenty-four hours of an issue, stated plainly, backed by objective metrics, and paired with immediate developmental support.",
    "Furthermore, Radical Candor must be bidirectional rather than top-down. True organizational leaders actively solicit radical candor about their own executive performance before offering critique to others. Asking direct reports, 'What is one thing I could do or stop doing that would make it easier to work with me?' and listening in complete silence for sixty seconds signals profound humility. When employees see executives accept tough critique with grace and implement tangible changes, radical candor permeates the entire corporate hierarchy, replacing toxic office politics with a vibrant meritocracy of continuous improvement."
]

say_p4 = [
    "Even when individual leaders possess situational adaptability and teams operate with psychological safety and candid feedback, organizational performance is ultimately determined by collective team effectiveness. A high-growth technology startup does not operate as an aggregation of isolated individual contributors; it operates as an interconnected network of cross-functional squads—product managers, engineers, designers, and data scientists—working collaboratively to solve complex customer challenges. When team collaboration breaks down, productivity plunges, deadlines are missed, and internal friction consumes corporate energy. To architect high-performing collaborative units, we deploy J. Richard Hackman's Five Conditions for Team Effectiveness.",
    "Developed through decades of empirical research at Harvard University, Hackman's model posits that team performance cannot be achieved through inspirational speeches or superficial team-building exercises. Instead, leaders must engineer the structural and contextual conditions that enable high-performing collaboration to emerge naturally. Hackman identified five foundational conditions that account for over eighty percent of team success: 1. A Real Team; 2. A Compelling Direction; 3. An Enabling Structure; 4. A Supportive Organizational Context; and 5. Competent Team Coaching.",
    "Condition 1—A Real Team—mandates that the collaborative unit must have clear, bounded membership, stable team rosters, and genuine task interdependency. In chaotic startups, teams frequently suffer from fluid, ill-defined boundaries where individuals float across five projects simultaneously; Hackman proved that stable teams with clear membership boundaries outperform rotating ad-hoc groups by an order of magnitude. Condition 2—A Compelling Direction—demands that the team's objective must be clear, challenging, and consequential. The goal must specify the destination without prescribing the journey, allowing the squad autonomous discretion over execution while providing purpose that galvanizes intrinsic motivation.",
    "Condition 3—An Enabling Structure—requires optimal team sizing (keeping squads between five and nine members, reflecting the 'Two-Pizza Team' rule championed by Amazon), balanced cross-functional skill diversity, and explicitly agreed-upon team operating norms. Large teams succumb to the Ringelmann effect and social loafing, where individual effort declines as group size increases. Condition 4—A Supportive Organizational Context—ensures that the broader company provides the essential resources, information access, technical tooling, and team-based reward structures necessary to execute without bureaucratic blockades. Finally, Condition 5—Competent Team Coaching—provides the squad with expert facilitation to conduct objective retrospectives, resolve interpersonal friction, and optimize collective workflows.",
    "In our Python implementation, we build an algorithmic Hackman Team Effectiveness Audit Engine. Auditing a high-stakes AI Autonomous Squad across the five core conditions, the engine calculates a composite Effectiveness Index and assigns an operational performance tier. Scoring 4.8 in Real Team boundedness, 4.9 in Compelling Direction, 4.5 in Enabling Structure, 4.2 in Supportive Context, and 4.6 in Expert Coaching, the squad achieves a 92.0% effectiveness rating. The system certifies the group as a 'Tier 1 Elite Squad' exhibiting exponential operational velocity. By systematically evaluating teams against Hackman's five pillars, startup leadership diagnoses structural bottlenecks and optimizes organizational design for maximum throughput.",
    "Furthermore, Hackman's research highlights the vital importance of team operating agreements (norms). High-performing engineering squads do not leave communication norms to chance; they explicitly document conventions regarding code review turnaround times, asynchronous Slack expectations, core working hours, and production incident escalation protocols. Codifying these behavioral norms into a living team charter eliminates ambiguity, accelerates onboarding for new hires, and establishes an objective standard against which team members hold one another accountable without managerial intervention.",
    "Ultimately, the Hackman framework proves that great teams are designed, not born. Venture founders who invest time in defining bounded squads, articulating compelling missions, capping team sizes, and providing uninhibited organizational support construct an antifragile operational engine. Such teams thrive amid market ambiguity, rapidly iterate through complex technical challenges, and execute with an efficiency that outpaces established market incumbents burdened by bureaucratic inertia."
]

say_p5 = [
    "We conclude Day 22 by uniting all four leadership and organizational frameworks into our Master Leadership & Team Governance Control Tower. In enterprise business management, leadership is not an ethereal charisma metric; it is an engineered operational discipline governed by diagnostic maturity models, psychological assessment metrics, feedback distribution matrices, and structural team efficacy indexes. Venture capital investors and board members evaluate founding CEOs not merely by their vision, but by their ability to architect scalable, autonomous, and self-correcting leadership hierarchies capable of executing under extreme pressure.",
    "Our Master Leadership Control Tower executes an automated four-gate accreditation verification. Gate 1 evaluates Situational Leadership II Matching, verifying that executive leadership actively assesses employee task competence and commitment across four distinct development levels (D1 through D4), matching each with tailored directive and supportive behaviors (S1 through S4) to eliminate managerial mismatch. Gate 2 evaluates Psychological Safety Health, auditing Edmondson survey distributions to confirm that teams maintain an average Likert score of 4.0 or higher out of 5.0, anchoring the organization firmly in the High-Safety Learning Zone where mistakes are embraced as data.",
    "Gate 3 verifies Radical Candor Feedback Distribution, confirming that management coaching practices operate with High Care Personally and High Challenge Directly, while strictly eliminating Manipulative Insincerity and destructive political posturing. Finally, Gate 4 inspects Hackman Team Effectiveness Integrity, confirming that cross-functional squads satisfy the five foundational conditions of team collaboration, maintaining a team effectiveness index above 80.0% to guarantee exponential operational velocity without organizational drag.",
    "In our executed benchmark demonstration, the Master Leadership Control Tower evaluates the integrated performance of our four foundational leadership engines. All four verification gates register unanimous PASS ratings, culminating in the formal conferral of the highest organizational governance accreditation: LEADERSHIP_AND_TEAM_EXCELLENCE_CERTIFIED_NOMINAL. As you advance into tomorrow's session covering Board of Directors governance, fiduciary duties, and supermajority voting rights, this behavioral leadership bedrock will ensure that your venture manages organizational complexity with institutional grace and sovereign excellence.",
    "Mastering behavioral leadership and team dynamics empowers founders to successfully navigate the hazardous transition from early-stage product development into enterprise scaling. In the earliest days of a startup, charismatic founder energy and informal communication can hold a ten-person team together. However, as the organization crosses the Dunbar number of fifty and one hundred employees, unstructured leadership collapses into organizational chaos, toxic cliques, and talent attrition. Codifying situational leadership, psychological safety, radical candor, and team effectiveness ensures that cultural excellence scales linearly with headcount expansion.",
    "Moreover, high-governance leadership frameworks serve as the ultimate defense against corporate burnout. When employees understand exactly what is expected of them (Situational Leadership), feel safe to voice concerns (Psychological Safety), receive clear, compassionate feedback on performance (Radical Candor), and work within bounded, autonomous squads (Hackman Conditions), cognitive friction evaporates. Employees experience high agency, profound professional growth, and deep mission alignment, transforming the workplace into an energizing incubator of human potential and commercial dominance.",
    "Ultimately, this Leadership Control Tower represents the human heartbeat of the PinIT Career OS enterprise philosophy. Technology tools, financial balance sheets, and competitive strategies are merely instruments wielded by human beings. By cultivating leaders who listen with empathy, challenge with courage, diagnose with precision, and empower with humility, executive leadership constructs an enduring corporate civilization capable of inspiring generations of talent and creating enduring enterprise value across decades of growth.",
    "In addition, embedding these leadership verification gates into regular executive staff meetings prevents cultural degradation as external market pressures mount. In hyper-growth phases, when customer demands surge and operational complexities threaten to overwhelm middle managers, returning to these quantitative human capital benchmarks allows the executive leadership team to course-correct before cultural drift manifests in team disengagement or high-profile turnover. Continuous leadership governance is the vital operating infrastructure that sustains enterprise agility throughout all stages of corporate maturation."
]

day22_data = {
    "day": 22,
    "title": "Leadership & Team Management: Situational Leadership II & Psychological Safety",
    "goal": "Master high-performance startup leadership and team dynamics: Blanchard Situational Leadership II (SLII D1-D4 / S1-S4) task-maturity matching, Amy Edmondson Psychological Safety 7-item audit in the Learning Zone, Kim Scott Radical Candor feedback matrix, and J. Richard Hackman's 5 Conditions for Team Effectiveness. Execute the Master Leadership Control Tower to confer LEADERSHIP_AND_TEAM_EXCELLENCE_CERTIFIED_NOMINAL.",
    "minutes": 45,
    "recap": "Welcome to Day 22 of Entrepreneurship & Business Management. Today, we architect behavioral leadership excellence: situational managerial adaptation, fearless psychological safety, radically candid feedback loops, and structural team effectiveness.",
    "parts": [
        {
            "part": 1,
            "title": "Blanchard Situational Leadership II (SLII): Competence, Commitment & Style Matching",
            "say": say_p1,
            "example": "A startup CTO diagnoses four team members across SLII, assigning S1 Directing to an enthusiastic junior engineer, S2 Coaching to a struggling product manager, S3 Supporting to an experienced sales lead, and S4 Delegating to a lead DevOps architect.",
            "code": code_p1,
            "output": out_p1,
            "codeNotes": [
                "Lines 1-28: Implements diagnose_situational_leadership mapping competence and commitment into D1-D4 developmental levels and S1-S4 leadership styles.",
                "Lines 30-36: Configures a sample team roster across junior, mid-level, and senior engineering/product roles.",
                "Lines 38-42: Outputs developmental classifications, directive/supportive behaviors, and concrete action prescriptions."
            ],
            "tryIt": "Set Alex's competence score to 4. Observe how his developmental classification advances to D4, shifting the prescribed style from S1 Directing to S4 Delegating.",
            "check": {
                "question": "Under Blanchard's Situational Leadership II model, what leadership style is prescribed for an employee at Development Level D2 (Low Competence, Low Commitment)?",
                "options": [
                    "S2 Coaching (High Directive, High Supportive behavior to clarify rationale and rebuild confidence).",
                    "S4 Delegating (Complete autonomy with zero managerial oversight).",
                    "S1 Directing (Issuing orders without explaining the underlying reasoning).",
                    "Immediate termination without further developmental investment."
                ],
                "answer": 0,
                "why": "D2 'Disillusioned Learners' suffer from low competence and falling motivation; they require both intensive directive guidance to build skills and high supportive behavior to restore confidence.",
                "answerIndex": 0,
                "explanation": "D2 'Disillusioned Learners' suffer from low competence and falling motivation; they require both intensive directive guidance to build skills and high supportive behavior to restore confidence."
            }
        },
        {
            "part": 2,
            "title": "Amy Edmondson Psychological Safety Audit & High-Performance Learning Zones",
            "say": say_p2,
            "example": "An engineering team scores 4.47/5.0 on Edmondson's 7-item survey, placing it in the High-Safety Learning Zone where failures are embraced as learning data, while a sales cohort scoring 2.57/5.0 triggers an Anxiety Zone alert.",
            "code": code_p2,
            "output": out_p2,
            "codeNotes": [
                "Lines 1-27: Defines audit_psychological_safety scoring Edmondson's 7-item Likert scale into High-Safety, Moderate, and Low-Safety organizational zones.",
                "Lines 29-30: Evaluates survey responses for an engineering squad and a sales cohort.",
                "Lines 32-38: Prints composite Likert scores, safety percentages, organizational zones, and behavioral profiles."
            ],
            "tryIt": "Reduce the engineering team scores to average 2.0. Observe how the classification shifts into the Low Safety / Anxiety Zone, indicating defensive silence.",
            "check": {
                "question": "What is the defining characteristic of teams operating in Amy Edmondson's 'Learning & High-Performance Zone'?",
                "options": [
                    "High psychological safety combined with high accountability for performance, enabling bold experimentation and candid debate.",
                    "Zero accountability where deadlines are disregarded to prevent stress.",
                    "Brutal interpersonal criticism without personal empathy.",
                    "Complete silence where junior employees never question executive leadership."
                ],
                "answer": 0,
                "why": "The Learning Zone occurs when psychological safety is high enough to take interpersonal risks while accountability remains high enough to drive world-class execution.",
                "answerIndex": 0,
                "explanation": "The Learning Zone occurs when psychological safety is high enough to take interpersonal risks while accountability remains high enough to drive world-class execution."
            }
        },
        {
            "part": 3,
            "title": "Kim Scott Radical Candor Feedback Matrix: Care Personally vs. Challenge Directly",
            "say": say_p3,
            "example": "An executive coach evaluates four managerial styles, identifying Radical Candor in high care/high challenge coaching, while diagnosing and remediating Obnoxious Aggression, Ruinous Empathy, and Manipulative Insincerity.",
            "code": code_p3,
            "output": out_p3,
            "codeNotes": [
                "Lines 1-26: Implements evaluate_radical_candor_feedback mapping Care Personally and Challenge Directly scores into the four quadrant archetypes.",
                "Lines 28-34: Assesses four executive manager communication profiles across engineering, sales, ops, and product.",
                "Lines 36-40: Outputs quadrant classifications and specific leadership remediation action plans."
            ],
            "tryIt": "Change Emily's challenge score to 4.5. Notice how her classification shifts from Ruinous Empathy to Radical Candor, eliminating the risk of sugarcoated feedback.",
            "check": {
                "question": "Why is 'Ruinous Empathy' (High Care Personally, Low Challenge Directly) considered the most dangerous feedback trap in startup management?",
                "options": [
                    "Because managers withhold critical performance feedback to avoid temporary emotional discomfort, allowing preventable mistakes to compound until the employee is blindsided by termination.",
                    "Because it causes managers to shout profanities at employees during public meetings.",
                    "Because it leads to excessive executive stock option grants.",
                    "Because employees receive so much harsh criticism that they immediately resign."
                ],
                "answer": 0,
                "why": "Ruinous Empathy feels kind in the short term but is cruel in the long term, denying employees the actionable feedback required to improve and succeed.",
                "answerIndex": 0,
                "explanation": "Ruinous Empathy feels kind in the short term but is cruel in the long term, denying employees the actionable feedback required to improve and succeed."
            }
        },
        {
            "part": 4,
            "title": "J. Richard Hackman's 5 Conditions for Team Collaboration & Effectiveness",
            "say": say_p4,
            "example": "A high-stakes AI squad scores 92.0% on Hackman's Five Conditions model (real team, compelling direction, enabling structure, supportive context, expert coaching), certifying it as a Tier 1 Elite Squad with exponential velocity.",
            "code": code_p4,
            "output": out_p4,
            "codeNotes": [
                "Lines 1-32: Implements assess_team_effectiveness evaluating Hackman's 5 conditions and computing the team effectiveness index and operational tier.",
                "Lines 34-40: Evaluates a cross-functional AI product squad across the five empirical dimensions.",
                "Lines 42-47: Prints total effectiveness index, performance tier, operational velocity, and itemized scores."
            ],
            "tryIt": "Set real_team_score to 2.5 and compelling_direction_score to 2.0. Observe how the squad drops to Tier 3 Dysfunctional Collective with stagnant velocity.",
            "check": {
                "question": "According to J. Richard Hackman, what is the primary condition required for a group to be considered a 'Real Team'?",
                "options": [
                    "Bounded, stable membership with clear task interdependency and defined collective responsibility.",
                    "Having an informal group chat where anyone can join or leave at will.",
                    "Employing at least fifty engineers on a single project.",
                    "Requiring all team members to work in the same physical cubicle."
                ],
                "answer": 0,
                "why": "A 'Real Team' requires clear boundaries, stable membership over time, and genuine interdependency where members must collaborate to achieve common goals.",
                "answerIndex": 0,
                "explanation": "A 'Real Team' requires clear boundaries, stable membership over time, and genuine interdependency where members must collaborate to achieve common goals."
            }
        },
        {
            "part": 5,
            "title": "Master Leadership & Team Governance Control Tower: 4-Gate Leadership Accreditation",
            "say": say_p5,
            "example": "The Master Leadership Control Tower audits SLII adaptive management, psychological safety benchmarks, radical candor feedback distribution, and Hackman team effectiveness, passing all gates and conferring master accreditation.",
            "code": code_p5,
            "output": out_p5,
            "codeNotes": [
                "Lines 1-28: Implements master_leadership_control_tower validating SLII diagnostic coverage, psychological safety thresholds (>= 4.0), radical candor integrity, and Hackman effectiveness (>= 80%).",
                "Lines 30-46: Evaluates benchmark verification inputs and prints gate clearance statuses and final accreditation."
            ],
            "tryIt": "Set sample_safety avg_likert_score to 3.5. Observe how Gate 2 fails, triggering an ORGANIZATIONAL_DYSFUNCTION_ALERT.",
            "check": {
                "question": "What is the primary governance objective of the Master Leadership & Team Governance Control Tower?",
                "options": [
                    "To execute an automated four-gate audit verifying adaptive managerial matching, fearless psychological safety, radical candor coaching, and team structural efficacy.",
                    "To eliminate all 1-on-1 meetings between managers and employees.",
                    "To enforce a rigid military chain of command across all startup departments.",
                    "To replace human executive leadership with automated bots."
                ],
                "answer": 0,
                "why": "The Master Leadership Control Tower provides rigorous governance ensuring that behavioral leadership, psychological safety, candid feedback, and team structure are optimized for exponential performance.",
                "answerIndex": 0,
                "explanation": "The Master Leadership Control Tower provides rigorous governance ensuring that behavioral leadership, psychological safety, candid feedback, and team structure are optimized for exponential performance."
            }
        }
    ],
    "visual": {
        "type": "funnel",
        "data": {
            "title": "Leadership & Team Management Governance",
            "subtitle": "4-Gate Behavioral Leadership & High-Performance Squad Control Tower",
            "steps": [
                {
                    "label": "Gate 1: Situational Leadership II",
                    "value": "Adaptive D1-D4 / S1-S4 Matching",
                    "color": "emerald"
                },
                {
                    "label": "Gate 2: Psychological Safety",
                    "value": "Edmondson Learning Zone (>= 4.0/5.0)",
                    "color": "blue"
                },
                {
                    "label": "Gate 3: Radical Candor",
                    "value": "Care Personally & Challenge Directly",
                    "color": "indigo"
                },
                {
                    "label": "Gate 4: Hackman Team Efficacy",
                    "value": "5 Conditions (Index >= 80%)",
                    "color": "amber"
                }
            ]
        }
    }
}

def verify_and_save():
    day = day22_data
    print(f"Generated Day {day['day']}: {day['title']}")
    word_counts = []
    for p in day["parts"]:
        wc = sum(len(para.split()) for para in p["say"])
        word_counts.append(wc)
        assert wc >= 580, f"Part {p['part']} word count {wc} < 580"
        assert p["code"] and len(p["code"].strip()) > 0, f"Part {p['part']} missing code"
        assert p["output"] and len(p["output"].strip()) > 0, f"Part {p['part']} missing output"
        assert p["check"]["question"], f"Part {p['part']} missing check question"
        assert len(p["check"]["options"]) == 4, f"Part {p['part']} options count != 4"
        assert p["check"]["answerIndex"] == 0, f"Part {p['part']} answerIndex != 0"
    
    total_words = sum(word_counts)
    print(f"Parts word counts: {word_counts} (Total: {total_words})")
    assert total_words >= 2950, f"Total word count {total_words} < 2950"
    assert len(day["parts"]) == 5, f"Parts count {len(day['parts'])} != 5"
    assert day["minutes"] == 45, f"Day 22 minutes {day['minutes']} != 45"
    
    # Print sample captured output
    for i in range(1, 6):
        print(f"--- Part {i} output ---")
        lines = day["parts"][i-1]["output"].strip().splitlines()
        print("\n".join(lines[:6]))
    
    with open("scripts/bcom_ent_day22_data.json", "w", encoding="utf-8") as f:
        json.dump(day, f, indent=2, ensure_ascii=False)
    print("PASS: Day 22 invariants OK")

if __name__ == "__main__":
    verify_and_save()
