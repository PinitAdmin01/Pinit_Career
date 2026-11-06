#!/usr/bin/env python3
"""
Day 13 Builder: Strategic Planning & Goal Alignment: Objectives & Key Results (OKRs)
Course: bcom_ent | Block 228 (Milestone 3: TASK-1254..1258)
Each code snippet is EXECUTED at build time and its real stdout becomes the lesson 'output'.
"""
import sys
import io
import contextlib
from typing import Dict, Any

sys.stdout.reconfigure(encoding="utf-8")


def run_snippet(code: str) -> str:
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(compile(code, "<snippet>", "exec"), {"__name__": "snippet"})
    return buf.getvalue().strip()


CODE_PROGRESS = r'''# OKR progress: each Key Result is a measured move from a baseline toward a target
def kr_progress(baseline, current, target):
    # works for "higher is better" (target > baseline) and "lower is better" (target < baseline)
    if target == baseline:
        return 1.0
    raw = (current - baseline) / (target - baseline)
    return max(0.0, min(1.0, raw))

objective = "Become the default invoicing tool for Indian freelancers"
key_results = [
    {"kr": "Grow monthly active paying users", "baseline": 1_200, "current": 2_700, "target": 4_000},
    {"kr": "Raise week-4 retention (%)", "baseline": 22, "current": 31, "target": 40},
    {"kr": "Cut monthly churn (%)", "baseline": 6.0, "current": 4.5, "target": 3.0},
]
scores = []
for k in key_results:
    s = kr_progress(k["baseline"], k["current"], k["target"])
    scores.append(s)
    print(f"{k['kr']}: {k['baseline']} -> {k['current']} (target {k['target']}) = {s:.2f}")
print(f"Objective '{objective}': average score {sum(scores) / len(scores):.2f}")
'''

CODE_QUALITY = r'''# Key Result quality gate: a KR must be a measured OUTCOME with baseline, target and deadline
CRITERIA = ["has_metric", "has_baseline", "has_target", "has_deadline", "is_outcome"]

candidates = [
    {"kr": "Launch the new onboarding flow", "has_metric": False, "has_baseline": False,
     "has_target": False, "has_deadline": True, "is_outcome": False},
    {"kr": "Increase activation rate from 38% to 55% by Q3", "has_metric": True, "has_baseline": True,
     "has_target": True, "has_deadline": True, "is_outcome": True},
    {"kr": "Send 40 outbound emails per rep per week", "has_metric": True, "has_baseline": False,
     "has_target": True, "has_deadline": True, "is_outcome": False},
    {"kr": "Reduce p95 checkout latency from 2.4s to 1.2s by Q2", "has_metric": True, "has_baseline": True,
     "has_target": True, "has_deadline": True, "is_outcome": True},
]

def grade(c):
    score = sum(1 for key in CRITERIA if c[key])
    if score == len(CRITERIA):
        return score, "GOOD_KR"
    if not c["is_outcome"] and c["has_metric"]:
        return score, "OUTPUT_NOT_OUTCOME"
    return score, "REWRITE"

for c in candidates:
    score, verdict = grade(c)
    print(f"[{score}/5] {verdict}: {c['kr']}")
'''

CODE_GRADE = r'''# Grading: committed OKRs should land at 1.0; aspirational (stretch) OKRs are healthy near 0.7
def band(score):
    if score >= 0.7:
        return "GREEN"
    if score >= 0.4:
        return "YELLOW"
    return "RED"

okrs = [
    {"name": "Hit $2M ARR", "kind": "COMMITTED", "score": 1.0},
    {"name": "Ship SOC 2 Type II", "kind": "COMMITTED", "score": 0.8},
    {"name": "Expand into EU", "kind": "ASPIRATIONAL", "score": 0.7},
    {"name": "10x organic traffic", "kind": "ASPIRATIONAL", "score": 0.2},
    {"name": "Launch mobile app", "kind": "ASPIRATIONAL", "score": 1.0},
]

for o in okrs:
    note = ""
    if o["kind"] == "COMMITTED" and o["score"] < 1.0:
        note = "  <- committed goal missed: escalate and explain"
    elif o["kind"] == "ASPIRATIONAL" and o["score"] >= 1.0:
        note = "  <- stretch goal fully hit: it was probably not a stretch"
    print(f"{o['name']:<22} {o['kind']:<13} {o['score']:.1f} {band(o['score'])}{note}")

asp = [o["score"] for o in okrs if o["kind"] == "ASPIRATIONAL"]
print(f"average aspirational score: {sum(asp) / len(asp):.2f} (healthy range 0.6-0.7)")
'''

CODE_ALIGN = r'''# Alignment and focus: every team objective should ladder up, and teams must not be overloaded
company = {"C1": "Reach $2M ARR", "C2": "Become the trusted brand in the segment"}
team_objectives = [
    {"team": "Sales", "id": "S1", "parent": "C1"},
    {"team": "Sales", "id": "S2", "parent": "C1"},
    {"team": "Product", "id": "P1", "parent": "C1"},
    {"team": "Product", "id": "P2", "parent": "C2"},
    {"team": "Marketing", "id": "M1", "parent": "C2"},
    {"team": "Marketing", "id": "M2", "parent": None},
    {"team": "Support", "id": "R1", "parent": "C2"},
    {"team": "Support", "id": "R2", "parent": "C2"},
    {"team": "Support", "id": "R3", "parent": "C2"},
    {"team": "Support", "id": "R4", "parent": "C2"},
]
MAX_PER_TEAM = 3

orphans = [o["id"] for o in team_objectives if o["parent"] not in company]
print("orphan objectives (no company parent):", orphans)

counts = {}
for o in team_objectives:
    counts[o["team"]] = counts.get(o["team"], 0) + 1
overloaded = {t: n for t, n in counts.items() if n > MAX_PER_TEAM}
print("objectives per team:", counts)
print("overloaded teams (>3):", overloaded)

linked = {o["parent"] for o in team_objectives if o["parent"] in company}
print("company objectives with at least one contributor:", sorted(linked), "of", sorted(company))
'''

CODE_TOWER = r'''# OKR system health control tower
company_objectives = 3
krs_per_objective = [3, 4, 3]
outcome_krs, total_krs = 8, 10
orphans = 0
aspirational_avg = 0.65
committed_hit_rate = 1.0

checks = {
    "focus_objectives_le_5": company_objectives <= 5,
    "kr_count_2_to_5": all(2 <= n <= 5 for n in krs_per_objective),
    "outcome_ratio_ge_70pct": outcome_krs / total_krs >= 0.70,
    "full_alignment": orphans == 0,
    "stretch_calibrated": 0.55 <= aspirational_avg <= 0.80,
    "committed_delivered": committed_hit_rate >= 0.90,
}
for k, v in checks.items():
    print(f"{k}: {'PASS' if v else 'FAIL'}")
print("status:", "OKR_SYSTEM_HEALTHY" if all(checks.values()) else "OKR_SYSTEM_NEEDS_REPAIR")
'''


def get_day13_data() -> Dict[str, Any]:
    parts = [
        {
            "title": "OKR Fundamentals: Objectives, Key Results & the Measured Move from Baseline to Target",
            "say": [
                "Every company has goals, and nearly every company discovers that having goals is not the same as being aligned around them. A founder says the company wants to grow, the sales team hears bookings, the engineers hear stability, and the designers hear polish, and each group works hard in a different direction. Objectives and Key Results, universally shortened to OKRs, are a method for preventing that drift. The framework pairs a qualitative statement of what you want to achieve, the Objective, with a small set of measurable outcomes that prove you achieved it, the Key Results. It is simple enough to explain in a minute and demanding enough that many organizations apply it poorly for years.",
                "The history explains the design. Andy Grove developed the approach at Intel in the 1970s, building on Peter Drucker's management by objectives, and summarized it in two questions: where do I want to go, and how will I pace myself to see whether I am getting there. John Doerr, who had learned the method at Intel, introduced it to Google in 1999 when the company had only a few dozen employees, and Google credits it with helping it stay focused through extraordinary growth. Since then it has spread to organizations of every size, because its core mechanism, making progress visible and comparable, works equally well for a five-person startup and a multinational.",
                "An Objective should be ambitious, qualitative, and time-bound, and it should be able to stir the people who read it. A strong objective names a destination, not an activity: become the default invoicing tool for freelancers, rather than improve the invoicing product. It is deliberately not a number, because numbers belong in the Key Results. An objective that can be measured directly is usually a Key Result in disguise. A good test is to ask whether a new employee reading it would understand what success looks like and feel some motivation to pursue it. If the answer is a shrug, the objective needs sharpening.",
                "Key Results are the opposite: specific, quantitative, and verifiable. Each one describes a measurable move from a baseline to a target by a deadline, and a reasonable objective has between two and five of them. If you achieved all the key results, the objective would almost certainly be achieved. The arithmetic of progress is simple. You take the current value, subtract the baseline, and divide by the distance between the target and the baseline, producing a number between zero and one. This formula handles metrics where lower is better, such as churn or latency, because the sign of the distance flips automatically. Always record the baseline, since a target of four thousand users means little without knowing you started at twelve hundred.",
                "The framework works because it forces three kinds of honesty. It forces you to choose, since you cannot have fifteen objectives and call them priorities. It forces you to measure, since a key result without a number cannot be graded. And it forces you to be transparent, since OKRs are typically visible across the whole organization, so everyone can see what everyone else is trying to do. The simulation below calculates progress for three key results under one objective, including a lower-is-better metric, and averages them into an objective score. Notice how a single baseline-to-target formula handles all three, and how the average gives a quick but imperfect summary of overall progress. Keep the first quarter small on purpose: two or three objectives you genuinely understand will teach you more about how your team sets and measures goals than a sprawling list ever could."
            ],
            "example": "When Google adopted OKRs, the Chrome team set a key result of reaching 20 million users in a year, starting from a much lower baseline. The team's progress was graded every quarter on a zero-to-one scale, and the transparency of the goal across the company meant that engineers, marketers, and executives were all measured against the same visible number rather than against private interpretations of success.",
            "code": CODE_PROGRESS,
            "codeNotes": [
                "Lines 2-8: kr_progress computes (current - baseline) / (target - baseline) and clamps to the 0-1 range.",
                "Line 3-4: if target equals baseline the goal is already met, avoiding division by zero.",
                "Lines 11-15: three KRs, one of which (churn) is lower-is-better, share the same formula.",
                "Lines 16-20: per-KR scores are printed and averaged into a single objective score."
            ],
            "tryIt": "Set the churn KR's current value to 7.5 (worse than baseline). What score does the clamp produce, and why is clamping useful?",
            "check": {
                "question": "Why does the baseline-to-target formula work for both 'increase users' and 'reduce churn' key results?",
                "options": [
                    "Because churn is not measurable.",
                    "Because the distance (target - baseline) changes sign automatically for lower-is-better metrics, keeping progress between 0 and 1.",
                    "Because it ignores the current value.",
                    "Because lower-is-better metrics are not allowed in OKRs."
                ],
                "answerIndex": 1,
                "explanation": "Dividing by (target - baseline) preserves direction: when the target is below the baseline, a falling value produces positive progress."
            }
        },
        {
            "title": "Writing Key Results That Matter: Outcomes versus Outputs",
            "say": [
                "The most common failure in OKR practice is writing key results that describe activity instead of impact. Launch the new onboarding flow is not a key result; it is a task. It is also a trap, because a team can complete every task on its list and still fail to improve the business. The distinction between outputs and outcomes is the heart of the craft. An output is something you produce: a feature, a campaign, a report, a redesign. An outcome is a change in the world that results from what you produced: customers activate faster, support tickets fall, revenue rises. OKRs are meant to measure outcomes, because outcomes are what the business actually needs.",
                "Consider the difference in practice. A team that writes a key result to ship a referral program has defined success as completing the program. A team that writes a key result to increase the share of new customers who arrive by referral from five percent to fifteen percent has defined success as customers behaving differently. The second version leaves room for the team to discover that a referral program is the wrong tool and to try something else, while still holding them accountable for the result. The first version rewards finishing, even if the finished thing does nothing. Outcome-based key results grant autonomy over method while demanding accountability for results, which is exactly what good management tries to achieve.",
                "A practical test uses five criteria. A good key result has a metric, meaning it is expressed as a number. It has a baseline, because progress cannot be judged without a starting point. It has a target, a specific level the team commits to reach. It has a deadline, normally the end of the quarter. And it is an outcome, meaning it measures an effect rather than an activity. A key result that fails the outcome test but passes the others is an output with a number attached, such as sending forty outbound emails per week. Such metrics are not worthless; they are often useful inputs to monitor, but they should not be mistaken for the outcomes they are supposed to drive.",
                "There is an important subtlety about leading and lagging indicators. Revenue is a lagging indicator: by the time it moves, the work that caused the movement happened months ago. A team chasing only lagging indicators gets feedback too slowly to correct course. Leading indicators, such as activation rate, trial-to-paid conversion, or the number of qualified pipeline meetings, move sooner and let the team learn within the quarter. A strong set of key results typically mixes both, with one or two lagging measures that capture the ultimate goal and several leading measures that indicate whether the team is on the path. This combination provides both accountability and early warning.",
                "Beware also of metrics that can be gamed. A key result to reduce average support ticket resolution time can be hit by closing tickets prematurely, and a key result to increase sign-ups can be hit by lowering the quality of users. The standard defense is to pair every growth metric with a quality metric, so improvement in one cannot come at the expense of the other. The simulation below grades four candidate key results against the five criteria, and classifies the ones that pass the metric test but fail the outcome test as outputs rather than outcomes. Run it, then rewrite the failing candidates yourself until each one scores five out of five. When in doubt, ask whether a result would change what the team does next week; if no number could ever change a decision, it is decoration rather than a measure of progress."
            ],
            "example": "A product team at a streaming company replaced the key result of launching a recommendation redesign with a key result of increasing the share of sessions that begin with a title the viewer actually plays, from forty-one to fifty-two percent. The redesign shipped, but the team discovered that a smaller change to the first row of results captured most of the improvement, and they redirected effort accordingly. The outcome framing led them to a better solution than the one they had initially planned.",
            "code": CODE_QUALITY,
            "codeNotes": [
                "Line 2: five criteria define a good key result: metric, baseline, target, deadline and outcome.",
                "Lines 4-14: four candidate KRs are annotated with boolean flags for each criterion.",
                "Lines 16-22: grade() sums satisfied criteria and labels output-style KRs separately from rewrite-needed ones.",
                "Lines 24-26: results print as [score/5] VERDICT so reviewers can scan a whole OKR set quickly."
            ],
            "tryIt": "Rewrite 'Send 40 outbound emails per rep per week' as an outcome KR, flip its flags to True, and rerun. What verdict do you get?",
            "check": {
                "question": "Which of these is an outcome rather than an output?",
                "options": [
                    "Launch the redesigned dashboard.",
                    "Publish 12 blog posts.",
                    "Increase the share of trial users who become paying customers from 9% to 14%.",
                    "Hold 30 customer interviews."
                ],
                "answerIndex": 2,
                "explanation": "The first, second and fourth describe activities completed; only the conversion change measures an effect on customer behaviour."
            }
        },
        {
            "title": "Scoring, Committed versus Aspirational OKRs & the 0.7 Rule",
            "say": [
                "An OKR system is only as honest as its scoring, and the way a company scores goals shapes the way people set them. If missing a goal is punished, people write goals they know they can hit, and the whole system collapses into a list of things that would have happened anyway. If goals are scored too leniently, nobody takes them seriously. The solution that Google and many others use is to distinguish between two types of OKR, committed and aspirational, and to score them against different expectations. This single distinction removes most of the fear and the sandbagging that make OKR programs fail.",
                "Committed OKRs are promises. They are the things the company has agreed it will deliver, such as a contractual launch date, a compliance certification, or a revenue number already built into the budget. The expected score is one point zero, and anything lower is a signal that requires explanation and, if necessary, a change in resources or scope. Missing a committed OKR is not a catastrophe, but it should never be a surprise or an unexamined event. Teams are expected to flag risk early and to adjust, because other people have built plans on the assumption that a commitment will be met.",
                "Aspirational OKRs, often called stretch or moonshot goals, describe a bold outcome the team will pursue without being sure it is achievable. The expected score is around zero point seven, and a score of one point zero is actually a warning sign: it suggests the goal was not ambitious enough. The reasoning is that if a team consistently hits every aspirational goal, it is setting its targets too low and leaving potential on the table. A typical cycle of aspirational goals therefore averages between roughly sixty and seventy percent. A score of zero point three, by contrast, signals either a failure of execution or a goal that was wildly out of range, and the team should discuss which.",
                "Most organizations score on a scale from zero to one and attach color bands to give a quick reading. A score of zero point seven or above is green, indicating the team delivered strongly. A score between zero point four and zero point seven is yellow, indicating progress that fell short and merits a discussion. A score below zero point four is red, indicating a significant miss. These bands are communication tools, not performance ratings, and the most important rule is that OKR scores should never be directly tied to compensation. The moment pay depends on the score, people begin to negotiate for easy targets, and the stretch that makes the system valuable disappears.",
                "Scoring is also a learning ritual, and the discussion afterward matters more than the number. At the end of each quarter, teams grade their key results, write a short reflection about why they scored as they did, and carry the lessons into the next cycle. Did external events intervene, was the target miscalibrated, or did the team simply focus on the wrong things? Mid-quarter check-ins, often weekly, ask for a confidence rating on each key result so that risk surfaces early. The simulation below applies the color bands and flags two classic anomalies: a missed committed OKR and a fully achieved aspirational one. Run it and consider what you would say in a review meeting for each flagged line. Whatever the score, finish each review by writing down one decision it changes, because a grade that does not alter next quarter's plan has not taught the team anything and quickly becomes ceremony that people stop taking seriously."
            ],
            "example": "At Google, Larry Page's famous push for aspirational goals meant that a team scoring 100 percent on a stretch objective would be asked whether the goal had been ambitious enough. The practice taught engineers that reaching seventy percent of an extraordinary goal was a better result than reaching one hundred percent of a modest one, and it encouraged projects such as Chrome and Gmail to pursue targets that seemed out of reach at the time.",
            "code": CODE_GRADE,
            "codeNotes": [
                "Lines 2-7: band() maps scores to GREEN (>=0.7), YELLOW (0.4-0.7) and RED (<0.4).",
                "Lines 9-15: five OKRs tagged COMMITTED or ASPIRATIONAL with their final scores.",
                "Lines 17-23: a missed commitment and a fully hit stretch goal each trigger a diagnostic note.",
                "Lines 25-26: the average aspirational score is compared with the healthy 0.6-0.7 range."
            ],
            "tryIt": "Change 'Launch mobile app' to a score of 0.7. Does the average aspirational score move into the healthy range?",
            "check": {
                "question": "Why is a score of 1.0 on an aspirational OKR considered a warning sign?",
                "options": [
                    "It means the team cheated.",
                    "It suggests the goal was not ambitious enough to be a true stretch.",
                    "It means the OKR should be removed from the system.",
                    "It guarantees a promotion."
                ],
                "answerIndex": 1,
                "explanation": "Stretch goals are designed to land near 0.7; consistently hitting 1.0 indicates targets are being set too low."
            }
        },
        {
            "title": "Alignment, Cascading & Focus: Keeping OKRs From Becoming a Wish List",
            "say": [
                "The promise of OKRs is alignment: the idea that every person in the company can see how their work connects to the goals of the whole. This promise is easily broken. In many organizations OKRs become a quarterly paperwork exercise in which each team writes its own list, nobody checks whether those lists add up to the company's goals, and the connection between a developer's task and the strategy remains invisible. Real alignment requires a deliberate structure, and it requires saying no to many good ideas so that a few important ones can be done well.",
                "There are two basic ways to connect objectives across levels. In top-down cascading, leadership sets company objectives and each team writes objectives that support them. This produces clarity but can feel like orders delivered from above, and it can suppress useful ideas from people closest to the customer. In bottom-up alignment, teams propose objectives and then check how they contribute to the company's priorities. Most mature organizations blend the two: roughly half of team objectives come from leadership direction, and the remainder originate with the teams, with negotiation in both directions. What matters is that every team objective can point to a parent it contributes to, and that nothing important at the company level lacks a contributor.",
                "A simple audit catches the most common structural problems. Orphan objectives are team goals that connect to nothing at the company level; they may be worthwhile but they are using capacity that the company's priorities did not call for. Uncovered objectives are company goals that no team has taken ownership of, which usually means nothing is being done about them. Overloaded teams have more objectives than they can realistically achieve, and the evidence is a pile of yellow and red scores every quarter. The audit takes minutes and reveals more about the health of an organization's strategy than many long planning meetings.",
                "Focus is the discipline underneath all of this. Doerr's central argument in his book on the subject is that the power of OKRs comes from the choice of what not to do. A company with ten objectives has no priorities. The common guidance is to limit a company to three to five objectives per quarter, and a team to a similar number, each with two to five key results. This is not an arbitrary limit; it reflects how many things human beings can hold in mind and how much work a team can finish. When a new opportunity appears mid-quarter, the question is not whether it is good but which existing objective it replaces.",
                "OKRs also need to be distinguished from other management tools. Key performance indicators, or KPIs, measure the continuing health of the business, such as uptime, gross margin, or customer satisfaction, and they are monitored continuously. OKRs describe the change you want to create this quarter, and they often aim at improving a KPI. A healthy practice uses both: KPIs act as the dashboard that tells you something is wrong, and OKRs are how you decide what to do about it. The simulation below audits ten team objectives against two company objectives, reporting orphans, overloaded teams, and coverage. Run it and ask what you would do about each issue it surfaces. Review the alignment map each quarter and publish it where every employee can see it, because visibility is what lets people notice a missing owner or a duplicated effort long before leadership does, and it turns alignment from a leadership claim into something anyone can verify."
            ],
            "example": "A fifty-person software company discovered during a quarterly review that its marketing team had spent the quarter on a brand-refresh objective that connected to none of the company's three priorities, while the company's top retention objective had no owner at all. Reassigning two marketers to the retention objective and shelving the brand refresh improved churn by almost a full point within two quarters.",
            "code": CODE_ALIGN,
            "codeNotes": [
                "Lines 2-3: two company objectives define what team objectives may legitimately contribute to.",
                "Lines 4-15: ten team objectives, each with a parent company objective or None for an orphan.",
                "Lines 19-20: orphans are objectives whose parent is not a company objective.",
                "Lines 22-33: per-team counts reveal overload (> 3) and a final check confirms every company objective has a contributor."
            ],
            "tryIt": "Assign Marketing's M2 to parent 'C1' and move Support's R4 to Product. Which audit lines change?",
            "check": {
                "question": "What is an 'orphan' objective in an OKR alignment audit?",
                "options": [
                    "An objective that has already been completed.",
                    "An objective with no key results.",
                    "A company objective that no team supports.",
                    "A team objective that does not connect to any company objective."
                ],
                "answerIndex": 3,
                "explanation": "Orphans consume team capacity on work that the company's stated priorities did not call for."
            }
        },
        {
            "title": "OKR System Health Control Tower: Focus, Quality, Alignment & Calibration",
            "say": [
                "Having examined how to write, grade and align OKRs, we can now step back and ask a question that most organizations neglect: is the OKR system itself healthy? It is entirely possible to run OKRs every quarter, produce impressive-looking documents, and still gain nothing from them. A system that has degenerated into ritual has characteristic symptoms: too many objectives, key results that are really tasks, teams working on things unconnected to the strategy, and scores that cluster suspiciously at either extreme. A health check turns these vague worries into specific, testable conditions that leadership can review each quarter.",
                "The control tower evaluates six conditions. The first is focus: no more than five company objectives. The second is key result structure: every objective has between two and five key results, because one is too fragile and more than five dilutes attention. The third is outcome quality: at least seventy percent of key results should be outcomes rather than outputs. The fourth is alignment: no orphan objectives and no uncovered company goals. The fifth is calibration of ambition: the average aspirational score should fall between about zero point five five and zero point eight, showing that stretch goals are neither sandbagged nor wildly unrealistic. The sixth is delivery on commitments: at least ninety percent of committed OKRs should reach full score.",
                "These thresholds are not laws of nature, and a company can reasonably adjust them. What matters is that they are written down, measured, and discussed. The value of the exercise lies in turning the amorphous feeling that something is off with our OKRs into a specific finding such as our outcome ratio is forty percent. That finding suggests a specific action: run a workshop on rewriting output-style key results. Without measurement, organizations cycle through the same frustrations quarter after quarter, blaming the framework rather than their use of it. A quarterly retrospective that reviews this scorecard is the cheapest way to improve the system.",
                "Leadership behavior is the most powerful determinant of OKR health, and it deserves explicit mention. If executives write OKRs and then ignore them in day-to-day decisions, the organization draws the correct conclusion that the framework is decorative. If they refer to OKRs in staff meetings, cite them when saying no to requests, and openly share their own scores, including the misses, the framework acquires authority. Equally important is protecting psychological safety around the aspirational scores. A leader who criticizes a team for scoring zero point six on a stretch goal will receive modest goals next quarter. The control tower measures structure, but culture determines whether the structure produces honest numbers.",
                "The simulation below implements the six checks on a sample company and prints a pass or fail for each along with an overall verdict. As with the earlier governance gate, use it as a template. Modify one input at a time, such as raising the number of company objectives to seven or dropping the outcome ratio to fifty percent, and observe the status change. The aim is to leave this lesson with a working picture of an OKR practice that is deliberately small, measurable, and aligned, and with the habit of examining it critically every quarter rather than trusting that it works because it exists. Revisit this scorecard at every quarterly retrospective and keep the history, because a trend across several quarters tells you far more than any single reading, and it shows whether your OKR practice is genuinely improving or only repeating the same habits under a fresh set of labels."
            ],
            "example": "A growth-stage company ran its first OKR retrospective using a scorecard like this one and discovered it had eleven company objectives, an outcome ratio of thirty percent, and two orphaned team goals. It cut to four company objectives the next quarter, rewrote its key results, and reported that quarterly planning meetings became shorter and that the leadership team stopped relitigating priorities every few weeks.",
            "code": CODE_TOWER,
            "codeNotes": [
                "Lines 2-7: sample company inputs: 3 objectives, KR counts, 8/10 outcome KRs, 0 orphans and calibration scores.",
                "Lines 9-16: six boolean checks cover focus, KR structure, outcome ratio, alignment, calibration and delivery.",
                "Line 12: outcome ratio is outcome_krs / total_krs and must be at least 70%.",
                "Lines 17-19: the OKR_SYSTEM_HEALTHY verdict requires every check to pass."
            ],
            "tryIt": "Set company_objectives to 7 and outcome_krs to 5. Which checks fail, and what would you fix first?",
            "check": {
                "question": "Which condition best indicates that stretch goals are well calibrated?",
                "options": [
                    "Every aspirational OKR scores exactly 1.0.",
                    "Every aspirational OKR scores 0.0.",
                    "The average aspirational score sits roughly between 0.55 and 0.8.",
                    "There are no aspirational OKRs at all."
                ],
                "answerIndex": 2,
                "explanation": "An average in that band suggests goals are ambitious enough to stretch the team but still reachable in part."
            }
        },
    ]

    for p in parts:
        p["output"] = run_snippet(p["code"])

    return {
        "day": 13,
        "title": "Strategic Planning & Goal Alignment: Objectives & Key Results (OKRs)",
        "goal": "Run OKRs as a working system: write qualitative objectives and measurable outcome key results, score committed versus aspirational goals, align and focus objectives across teams, and audit the health of the whole OKR practice.",
        "minutes": 45,
        "recap": "Days 11 and 12 priced the company and protected its ownership. Day 13 turns to execution: how a team of any size agrees on what matters this quarter and measures whether it is getting there.",
        "parts": parts,
        "summary": [
            "Computed key result progress from baseline to target for both higher-is-better and lower-is-better metrics.",
            "Graded candidate key results on five quality criteria and separated outcomes from outputs.",
            "Applied committed versus aspirational scoring with green, yellow and red bands and the 0.7 rule.",
            "Audited team objectives for orphans, overloaded teams and uncovered company goals.",
            "Checked OKR system health across focus, structure, outcome ratio, alignment, calibration and delivery."
        ],
        "projectStep": {
            "title": "Write and Audit Your First Quarter of OKRs",
            "steps": [
                "Write three company objectives, each with two to five measurable key results including baselines.",
                "Grade every key result on metric, baseline, target, deadline and outcome, and rewrite weak ones.",
                "Tag each OKR as committed or aspirational and set the expected score for each.",
                "Map team objectives to company objectives and fix any orphans or overloaded teams.",
                "Run the health scorecard and list the two changes that would improve it most."
            ]
        },
    }


if __name__ == "__main__":
    data = get_day13_data()
    print(f"Generated Day 13: {data['title']}")
    words = [sum(len(s.split()) for s in p["say"]) for p in data["parts"]]
    print(f"Parts word counts: {words} (Total: {sum(words)})")
    for i, p in enumerate(data["parts"]):
        print(f"--- Part {i+1} output ---")
        print(p["output"])
    for i, w in enumerate(words):
        assert w >= 580, f"Part {i+1} has {w} words (< 580)"
    assert sum(words) >= 2950
    print("PASS: Day 13 invariants OK")
