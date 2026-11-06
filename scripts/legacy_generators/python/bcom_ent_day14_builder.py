#!/usr/bin/env python3
"""
Day 14 Builder: Operations Management: Process Mapping & Bottleneck Little's Law (L = lambda x W)
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


CODE_MAP = r'''# Process map: touch time (real work) versus wait time (queueing) for one customer order
steps = [
    {"step": "Order received",       "touch_min": 5,   "wait_min": 0},
    {"step": "Credit check",         "touch_min": 10,  "wait_min": 240},
    {"step": "Contract approval",    "touch_min": 20,  "wait_min": 1440},
    {"step": "Account provisioning", "touch_min": 30,  "wait_min": 120},
    {"step": "Customer onboarding",  "touch_min": 60,  "wait_min": 480},
]
touch = sum(s["touch_min"] for s in steps)
wait = sum(s["wait_min"] for s in steps)
lead = touch + wait
pce = touch / lead * 100.0
print(f"touch time = {touch} min ({touch/60:.1f} h)")
print(f"wait time  = {wait} min ({wait/60:.1f} h)")
print(f"lead time  = {lead} min ({lead/1440:.2f} days)")
print(f"process cycle efficiency = {pce:.1f}%")
worst = max(steps, key=lambda s: s["wait_min"])
print(f"largest queue: {worst['step']} ({worst['wait_min']} min of waiting)")
'''

CODE_LITTLE = r'''# Little's Law: L = lambda x W  (items in system = arrival rate x time in system)
def lead_time_days(wip, throughput_per_day):
    return wip / throughput_per_day

def wip_limit(target_lead_days, throughput_per_day):
    return target_lead_days * throughput_per_day

throughput = 30  # tickets closed per day
for wip in (240, 120, 60):
    print(f"WIP={wip:>3} tickets, throughput={throughput}/day -> average lead time = {lead_time_days(wip, throughput):.1f} days")

target = 1.0
print(f"to reach a {target:.0f}-day lead time at {throughput}/day, cap WIP at {wip_limit(target, throughput):.0f} tickets")
# verify the identity both ways with measured data
measured_L = 90
measured_lambda = 45
print(f"measured L={measured_L}, lambda={measured_lambda}/day -> implied W = {measured_L / measured_lambda:.1f} days")
'''

CODE_BOTTLENECK = r'''# Theory of Constraints: system throughput equals the capacity of the slowest stage
stages = {"Intake": 120, "Design": 60, "Build": 45, "QA": 80, "Deploy": 100}  # units per day
demand = 55

throughput = min(stages.values())
bottleneck = min(stages, key=stages.get)
print(f"system throughput = {throughput}/day, bottleneck = {bottleneck}")
for name, cap in stages.items():
    util = min(demand, cap) / cap * 100
    print(f"{name:<7} capacity={cap:>3} utilisation at demand {demand} = {util:.0f}%")

def throughput_after(additions):
    s = dict(stages)
    for stage, extra in additions.items():
        s[stage] += extra
    return min(s.values())

print("add +30 to Intake (non-bottleneck):", throughput_after({"Intake": 30}), "per day")
print("add +30 to Build  (bottleneck)    :", throughput_after({"Build": 30}), "per day")
print("add +30 to Build and Design       :", throughput_after({"Build": 30, "Design": 30}), "per day")
'''

CODE_QUEUE = r'''# Why 100% utilisation is a trap: single-server queue (M/M/1) waiting time explodes near saturation
service_rate = 10.0  # jobs the server can finish per hour

def mm1(arrival_rate, mu):
    rho = arrival_rate / mu
    if rho >= 1:
        return rho, float("inf"), float("inf")
    time_in_system_h = 1.0 / (mu - arrival_rate)
    jobs_in_system = rho / (1 - rho)
    return rho, time_in_system_h * 60, jobs_in_system

for rho_target in (0.50, 0.70, 0.80, 0.90, 0.95, 0.99):
    lam = rho_target * service_rate
    rho, minutes, jobs = mm1(lam, service_rate)
    print(f"utilisation {rho:.0%}: avg time in system = {minutes:>6.1f} min, avg jobs in system = {jobs:>5.1f}")
'''

CODE_TOWER = r'''# Operations health control tower
# the Part 1 process after queues were removed: wait cut from 2280 to 240 minutes
process = {"touch_min": 125, "wait_min": 240}
pce = process["touch_min"] / (process["touch_min"] + process["wait_min"]) * 100

wip, throughput_per_day = 60, 30
lead_days = wip / throughput_per_day

stage_utils = {"Intake": 46, "Design": 80, "Build": 100, "QA": 69, "Deploy": 55}
bottleneck_util = max(stage_utils.values())

checks = {
    "process_cycle_efficiency_ge_25pct": pce >= 25.0,
    "lead_time_le_3_days": lead_days <= 3.0,
    "wip_limit_enforced": wip <= 2 * throughput_per_day,
    "bottleneck_identified": max(stage_utils, key=stage_utils.get) == "Build",
    "utilisation_headroom_le_85pct_outside_bottleneck":
        all(u <= 85 for k, u in stage_utils.items() if k != "Build"),
    "no_stage_above_95pct_except_managed_bottleneck": sum(1 for u in stage_utils.values() if u > 95) <= 1,
}
print(f"PCE = {pce:.1f}%, lead time = {lead_days:.1f} days, bottleneck utilisation = {bottleneck_util}%")
for k, v in checks.items():
    print(f"{k}: {'PASS' if v else 'FAIL'}")
print("status:", "OPERATIONS_FLOW_HEALTHY" if all(checks.values()) else "OPERATIONS_FLOW_CONSTRAINED")
'''


def get_day14_data() -> Dict[str, Any]:
    parts = [
        {
            "title": "Process Mapping: Touch Time, Wait Time & Process Cycle Efficiency",
            "say": [
                "Every business is a collection of processes, and most founders have never drawn one. They know that an order arrives and that, eventually, a customer is onboarded, but the path between those two events is a blur of handoffs, approvals, and waiting that nobody has ever looked at end to end. Operations management begins with the unglamorous act of making that path visible. A process map lists every step a unit of work passes through, from the moment a request enters the company to the moment value reaches the customer. The act of mapping alone is usually revealing, because the people who perform each step discover for the first time how many other steps surround theirs and how long work sits untouched between them.",
                "The most useful distinction on any process map is between touch time and wait time. Touch time is the time someone is actually working on the item, adding value or at least performing a necessary action. Wait time is everything else: the item sitting in an inbox, in an approval queue, or in a batch waiting for enough companions to be processed together. Add the two and you have the lead time, the total elapsed time from request to delivery. Almost every organization that measures this for the first time is shocked by the ratio. It is common to find that an order requiring two hours of real work takes two weeks to complete, meaning that the work is being touched less than one percent of the time it is in the system.",
                "That ratio has a name: process cycle efficiency, defined as value-adding touch time divided by total lead time. A process with a cycle efficiency of five percent is spending ninety-five percent of its elapsed time with nothing happening to the customer's request. Studies of typical office and service processes frequently find efficiencies between one and ten percent, while well-tuned lean processes approach twenty-five percent or more. The implication is liberating for managers: because most of the lead time is waiting, speeding up the work itself, by pushing people to type faster or meet more deadlines, barely moves the total. The leverage lies in removing the queues, and the queues are created by the structure of the process, not by the speed of the people in it.",
                "Several mapping formats exist, and the right choice depends on the question. A simple flowchart shows the sequence of steps and decisions. A swim-lane diagram adds a lane per team or role, which exposes handoffs between functions, where delays and errors concentrate. A SIPOC diagram, short for suppliers, inputs, process, outputs, and customers, frames a process at a high level and is useful when scoping an improvement project. A value stream map, borrowed from Toyota's lean tradition, adds data to each step, such as cycle time, wait time, and defect rate, and is the tool of choice when the goal is to find waste. For a startup, a hand-drawn swim-lane with a measured time on every step is usually sufficient.",
                "A few practical rules make the exercise honest. Walk the process yourself and follow a real item through, rather than asking people how it is supposed to work, because the documented process and the actual process differ more often than anyone admits. Record real elapsed times from timestamps, not guesses. Mark every handoff, rework loop, and approval, because these are the most common sources of delay. The simulation below maps a five-step order-to-onboarding process and computes touch time, wait time, lead time, and process cycle efficiency. Run it, find the step with the largest queue, and notice that it is not the step with the most work. Improving where the item waits will help far more than improving where it is worked on."
            ],
            "example": "When a large bank mapped its mortgage approval process, it found that applications needed roughly six hours of genuine processing time but took forty days from submission to decision. More than ninety-nine percent of the elapsed time was waiting in queues between departments. By redesigning handoffs and cutting two redundant approvals, the bank reduced average approval time to eleven days without asking any employee to work faster.",
            "code": CODE_MAP,
            "codeNotes": [
                "Lines 2-8: five process steps, each with value-adding touch minutes and idle wait minutes.",
                "Lines 9-12: lead time = touch + wait; process cycle efficiency = touch / lead.",
                "Lines 13-17: results are printed in minutes, hours and days for readability.",
                "Lines 18-19: max() on wait_min finds the longest queue, which is the best first improvement target."
            ],
            "tryIt": "Cut the Contract approval wait from 1440 to 240 minutes. How much does lead time and process cycle efficiency improve?",
            "check": {
                "question": "A process has 2 hours of touch time but a 10-day lead time. What does this tell you about where improvement effort should go?",
                "options": [
                    "Employees need to work faster during the touch time.",
                    "The process should be abandoned.",
                    "More approvals should be added.",
                    "Almost all of the time is waiting, so removing queues and handoffs will have the greatest effect."
                ],
                "answerIndex": 3,
                "explanation": "With touch time under 1% of lead time, accelerating the work itself changes almost nothing; the delay lives in the queues."
            }
        },
        {
            "title": "Little's Law: L = \u03bb \u00d7 W and the Physics of Work-in-Progress",
            "say": [
                "There is one equation in operations management that every founder should be able to write from memory, because it governs every queue they will ever manage: Little's Law. It states that the average number of items in a system, written L, equals the average arrival rate, written lambda, multiplied by the average time each item spends in the system, written W. If customers arrive at forty per day and each spends an average of three days in your process, there are on average one hundred twenty customers in the system at any moment. The elegance of the law is that it holds for almost any stable system, regardless of how irregular the arrivals are or how the work is organized inside.",
                "The law is usually applied in a rearranged form that managers find more useful: lead time equals work in progress divided by throughput. Work in progress, or WIP, is the number of items started but not yet finished. Throughput is the rate at which items are completed. If your support team has two hundred forty open tickets and closes thirty a day, the average ticket waits eight days. This is not a trend or an estimate but arithmetic, and it carries a striking consequence. If you want faster delivery and your throughput is fixed, there is only one lever left: reduce the amount of work in progress. Starting less work causes finished work to come out sooner.",
                "That conclusion contradicts the instinct of most busy organizations, which respond to delay by starting more things in parallel, on the theory that being busier produces more output. In reality, when throughput is limited by capacity, adding work to the system does not raise throughput; it simply lengthens the queue and therefore the lead time. Every additional item you start makes every other item wait longer. This is why a restaurant that seats too many tables at once serves everyone slowly, and why a development team juggling fifteen projects delivers none of them quickly. Limiting WIP is the single most effective and least expensive intervention in operations, and it works in factories, hospitals, software teams, and kitchens alike.",
                "Kanban, the scheduling method developed at Toyota and later adapted for knowledge work, is essentially the practical application of Little's Law. A kanban board sets an explicit limit on how many items may be in each stage at once. When a stage reaches its limit, no new work may enter until something leaves, which forces the team to finish things before starting more and exposes bottlenecks immediately. Teams that adopt WIP limits typically see lead times fall by thirty to fifty percent within weeks, without hiring anyone, because the improvement comes from the arithmetic of the system rather than from anyone working harder.",
                "The law also provides a simple way to set a WIP limit. Choose the lead time your customers need, multiply by your throughput, and the product is the number of items you can hold in progress. If you want a one-day response and you close thirty tickets a day, you can afford thirty open tickets and no more. The simulation below applies the formula to a support queue at three WIP levels, computes the limit that achieves a one-day target, and then checks the identity against measured data to show how to infer an unknown average from the other two. Remember the conditions: the system must be reasonably stable, meaning arrivals and departures roughly balance over the period measured, and the average must be taken over a long enough window to smooth out unusually busy or quiet days."
            ],
            "example": "A software team with sixty open work items and a throughput of ten items a week had an average lead time of six weeks. Rather than hiring, the team introduced a WIP limit of twenty items. Within two months average lead time fell to roughly two weeks, since the throughput stayed near ten per week, exactly as the law predicted. Stakeholders reported that the team had suddenly become responsive, though no one was working longer hours.",
            "code": CODE_LITTLE,
            "codeNotes": [
                "Lines 2-6: lead_time_days = WIP / throughput and wip_limit = target lead time x throughput.",
                "Lines 8-10: a support team closing 30 tickets/day is evaluated at WIP of 240, 120 and 60.",
                "Lines 12-13: the WIP cap that delivers a 1-day lead time is computed directly from the formula.",
                "Lines 15-17: the identity is rearranged to infer W from measured L and lambda."
            ],
            "tryIt": "Double throughput to 60 per day but keep WIP at 240. What happens to lead time, and what does it say about hiring versus limiting WIP?",
            "check": {
                "question": "If throughput is fixed, what is the only way to reduce average lead time according to Little's Law?",
                "options": [
                    "Increase the amount of work in progress.",
                    "Reduce the amount of work in progress.",
                    "Add more approvals.",
                    "Ignore the queue."
                ],
                "answerIndex": 1,
                "explanation": "Lead time = WIP / throughput, so with throughput fixed, lowering WIP is the only way to lower lead time."
            }
        },
        {
            "title": "Bottlenecks & the Theory of Constraints: Finding the Stage That Sets Your Speed",
            "say": [
                "Imagine five stages connected in a line, each able to process a different number of units per day. Work cannot flow faster than the slowest stage permits, so the capacity of the entire system equals the capacity of its weakest link. That weakest link is the bottleneck, or constraint, and it determines how much your whole operation can deliver, regardless of how impressive the other stages are. This simple observation is the core of the Theory of Constraints, developed by physicist Eliyahu Goldratt and popularized in his novel The Goal. Its central claim is that every system has exactly one constraint at a time, and that improving anything other than that constraint is, at best, an illusion of progress.",
                "The implications are uncomfortable for organizations that spread improvement effort evenly. If a company invests in making its intake team thirty percent faster but intake was never the constraint, system throughput does not change at all. The extra output simply piles up in front of the bottleneck as additional WIP, lengthening queues and making delivery slower. Money and attention spent upstream of a constraint produce inventory, not revenue, and money spent downstream of it produces idle capacity. Only an hour gained at the bottleneck is an hour gained for the whole system, and an hour lost there is an hour lost forever, a fact that changes how you value the bottleneck's time.",
                "Goldratt prescribed five focusing steps. First, identify the constraint. Second, exploit it, meaning squeeze every possible bit of output from the existing capacity: eliminate downtime, never let it starve for work, and ensure it only processes things that matter. Third, subordinate everything else to the constraint, so that other stages work at the pace the bottleneck can absorb rather than overproducing. Fourth, elevate the constraint, investing in more capacity at that point only after exploiting it fully. Fifth, when the constraint moves, and it will, return to step one and do not let inertia carry old policies forward. The cycle repeats indefinitely, because removing one bottleneck simply exposes the next slowest stage.",
                "In practice, the bottleneck can usually be found by watching where work accumulates. A queue that is consistently longest sits immediately upstream of the constraint, and the stages after it often wait idle for input. Utilization data tells the same story: the constraint runs close to its full capacity while others have slack. Be wary of mistaking a temporary spike for a constraint, and also of the fact that in knowledge work the constraint is often a person, a scarce skill, an approval authority, or a decision rather than a machine. A single senior engineer who must review every change, or a founder who approves every contract, is a bottleneck just as real as the slowest machine on a factory floor.",
                "The simulation below defines five stages with different daily capacities and finds the system throughput and the bottleneck, then compares adding thirty units of capacity to a non-bottleneck stage with adding it to the actual bottleneck. The result is a lesson worth remembering: the same investment produces zero improvement in one place and a large improvement in another. It also shows that once the first bottleneck is relieved, another stage immediately becomes the new limit. Before you spend money or hire anyone in an operations team, ask one question first: where is the constraint, and is this investment going to it? If the honest answer is that nobody has measured, then measuring, not spending, is the first investment, and it is almost always the cheapest one available to you."
            ],
            "example": "A contract manufacturer invested heavily in faster cutting machines, only to find that output did not change. A process study showed that the real constraint was a single paint-curing oven that could process only forty units per day. Redirecting the investment to a second oven raised output by sixty percent, while the faster cutters had simply created a growing pile of unpainted parts waiting in front of the first oven.",
            "code": CODE_BOTTLENECK,
            "codeNotes": [
                "Lines 2-3: five stages with daily capacities and a demand of 55 units per day.",
                "Lines 5-6: system throughput is min(capacity); the bottleneck is the stage with that minimum.",
                "Lines 7-9: utilisation at demand is min(demand, capacity)/capacity for each stage.",
                "Lines 11-19: throughput_after() recomputes min(capacity) after adding capacity at a non-bottleneck, the bottleneck, and the bottleneck plus the next constraint."
            ],
            "tryIt": "Add +30 to Design only and rerun the comparison. Does throughput change? Which stage is now the constraint?",
            "check": {
                "question": "Why does adding capacity to a non-bottleneck stage not increase system throughput?",
                "options": [
                    "Because non-bottleneck stages cannot be improved.",
                    "Because capacity is irrelevant to throughput.",
                    "Because the system can never produce more than the slowest stage allows, so extra output just piles up as WIP.",
                    "Because only the first stage matters."
                ],
                "answerIndex": 2,
                "explanation": "System throughput equals the bottleneck's capacity; additional upstream output simply accumulates in front of the constraint."
            }
        },
        {
            "title": "Utilisation, Variability & Queueing: Why Running at 100% Capacity Fails",
            "say": [
                "A manager looking at a team that is ninety-five percent utilized is often pleased: no one is idle, no capacity is wasted, and the investment in people is fully used. Queueing theory tells a very different story. Utilization is the share of a resource's capacity that is occupied by work, and as it approaches one hundred percent the time that items spend waiting does not rise gently. It rises explosively. This is one of the most counterintuitive results in operations and one of the most important, because it explains why highly utilized organizations are slow, fragile, and perpetually late, even though everyone in them seems to be working extremely hard.",
                "The simplest model is a single server, such as one engineer, one machine, or one approver, serving jobs that arrive at random. Even with this basic setup the mathematics is instructive. If jobs arrive at a rate lambda and the server completes jobs at a rate mu, the utilization is rho, equal to lambda divided by mu. The average time a job spends in the system is one divided by mu minus lambda, and the average number of jobs in the system is rho divided by one minus rho. Look at the denominators. As lambda approaches mu, the quantity mu minus lambda approaches zero, and the time in the system grows without bound. Waiting time depends on how close you are to the limit, not on how far you are from zero.",
                "Concrete numbers show how sharp the curve is. For a server completing ten jobs an hour, at fifty percent utilization the average time in the system is twelve minutes. At eighty percent it is thirty minutes, at ninety percent it is sixty minutes, and at ninety-nine percent it is ten hours. Going from eighty to ninety percent utilization, a ten point change that seems modest, doubles the delay. Going from ninety to ninety-nine percent multiplies it by ten. The system has not become only slightly worse; it has crossed into a regime where small fluctuations in arrivals create enormous backlogs that take a long time to clear, and where any additional demand can cause a collapse.",
                "This is why resilient operations deliberately maintain slack. A hospital emergency department that is run at ninety-five percent bed occupancy cannot absorb a surge in arrivals and ends up diverting ambulances. A software team scheduled to one hundred percent of its capacity cannot respond to a production incident without dropping something committed. Highways, call centers, and servers all show the same pattern. Experienced operators therefore target utilization of roughly seventy to eighty-five percent for resources that face unpredictable demand, and they accept the apparent inefficiency as the cost of staying responsive. Variability is the other half of the equation: the more irregular arrivals or service times are, the earlier the queue explodes, so reducing variability is as valuable as adding capacity.",
                "The exception, as the last section showed, is the managed bottleneck, which is deliberately kept busy because its throughput is the system's throughput, and which is protected from starvation by buffers placed in front of it. Everywhere else, high utilization is a warning, not a trophy. The simulation below runs the single-server formula at six utilization levels and prints the average time and the number of jobs in the system. Run it and notice how little the numbers change up to seventy percent, and how violently they change after ninety. Then consider which resources in your own business are running near the edge and what happens when demand rises by ten percent."
            ],
            "example": "A call center managed to a target of ninety-five percent agent occupancy to minimize labor cost, and discovered that customer hold times were routinely over twenty minutes and that any small rise in call volume caused them to double. Lowering the target occupancy to eighty-five percent by adding a modest number of agents cut average hold time to under four minutes and reduced abandoned calls so much that revenue rose enough to pay for the additional staff.",
            "code": CODE_QUEUE,
            "codeNotes": [
                "Lines 2-3: a single server completing 10 jobs per hour.",
                "Lines 5-10: M/M/1 formulas: time in system = 1/(mu - lambda); jobs in system = rho/(1 - rho).",
                "Line 7: utilisation at or above 100% returns infinity because the queue never clears.",
                "Lines 12-15: six utilisation levels from 50% to 99% show waiting time exploding near saturation."
            ],
            "tryIt": "Add 0.85 to the list of utilisation levels. Where does the average time fall relative to 80% and 90%?",
            "check": {
                "question": "Why does average waiting time rise sharply as utilisation approaches 100%?",
                "options": [
                    "Because workers become tired at high utilisation.",
                    "Because time in system is proportional to 1/(service rate - arrival rate), which grows without bound as the two converge.",
                    "Because queues are always the same length.",
                    "Because arrival rates fall as utilisation rises."
                ],
                "answerIndex": 1,
                "explanation": "As arrivals approach capacity the denominator shrinks toward zero, so small increases in load cause large increases in waiting time."
            }
        },
        {
            "title": "Operations Flow Control Tower: Cycle Efficiency, WIP Limits, Bottlenecks & Headroom",
            "say": [
                "The four preceding sections each examine operations from a different angle: process maps expose waiting, Little's Law links WIP to lead time, the Theory of Constraints locates the stage that sets throughput, and queueing theory explains why running everything at full capacity backfires. These are not four separate topics but four views of one underlying system, and a manager who understands the system can diagnose almost any slowness by asking the corresponding four questions. Where does work wait? How much is in progress? Which stage is the constraint? Is anything running too hot? This final section combines the answers into a single flow health check that an operations lead could review weekly.",
                "The control tower measures six conditions. The first is process cycle efficiency of at least twenty-five percent, which is demanding for most processes and is the mark of a lean flow. The second is average lead time within a target the customer can accept, here three days. The third confirms that a WIP limit is actually enforced, set at no more than two days of throughput. The fourth confirms that the bottleneck has been identified, because an organization that cannot name its constraint cannot manage it. The fifth checks utilization headroom: non-constraint stages that face variable demand should sit below about eighty-five percent. The sixth checks that no more than one stage is above ninety-five percent, and that the one that is, is a deliberately managed bottleneck.",
                "Each condition links to a specific action when it fails. A low cycle efficiency points to waiting, so you remap the process and remove approvals or batching. A long lead time with high WIP points to a WIP limit. An unidentified bottleneck points to measuring queues and utilization at each stage. Excess utilization points to adding capacity or reducing variability on the stages that are too hot. A good control tower is not merely a scorecard but a decision tree that tells you what to do next. It also provides a baseline against which you can judge improvements, so that a change in process can be shown to have moved a number rather than merely feeling better.",
                "It is worth reflecting on how this connects to the rest of the milestone. Valuation told you what the company is worth, vesting and agreements protected its ownership, OKRs aligned the team on goals, and operations determines whether the team can actually deliver on those goals. An organization with strong goals and weak flow will set ambitious objectives and then miss them because work sits in queues, because a single bottleneck absorbs everything, or because everyone is overloaded. Investors increasingly ask operational questions during diligence, such as lead time, backlog age, and capacity utilization, because they reveal whether a company's growth is sustainable or whether it is being held together by heroics.",
                "The simulation below implements the six checks on a sample operation whose Build stage is a managed bottleneck running at full capacity while other stages retain headroom. Run it to see a healthy result, then break it deliberately, perhaps by increasing the work in progress to two hundred, or by pushing Intake to ninety-eight percent utilization, and observe which checks fail and why. The aim is to develop an instinct for reading an operation as a system of flows and queues, so that when something is slow you can ask a few precise questions rather than simply telling people to work harder. Pair this with the process map from the first section, because a scorecard tells you that something is wrong while the map shows you exactly where the waiting happens and what to change."
            ],
            "example": "When Toyota's production system was studied by Western manufacturers, the surprise was not that the plants were faster but that they deliberately held lower inventory, enforced strict WIP limits through kanban cards, and kept non-constraint resources below full utilization. Those policies, which looked wasteful by conventional measures, gave Toyota shorter lead times, higher quality, and the ability to absorb demand swings that disrupted competitors.",
            "code": CODE_TOWER,
            "codeNotes": [
                "Lines 2-4: the redesigned process (wait cut to 240 min) gives touch / (touch + wait) of about 34%.",
                "Lines 5-6: lead time is derived from WIP and throughput through Little's Law.",
                "Lines 8-9: stage utilisation data identifies the bottleneck as the most utilised stage.",
                "Lines 11-21: six checks combine cycle efficiency, lead time, WIP discipline, bottleneck knowledge and headroom."
            ],
            "tryIt": "Set wip = 200 and Intake utilisation to 98. Which checks fail, and which action from this lesson fixes each?",
            "check": {
                "question": "Why is running a non-bottleneck stage above ~95% utilisation a warning sign?",
                "options": [
                    "It means the stage is unusually efficient.",
                    "It means the stage has no queue.",
                    "It guarantees the stage will become the new bottleneck immediately.",
                    "Waiting times explode near saturation, so small demand fluctuations create large backlogs and delays."
                ],
                "answerIndex": 3,
                "explanation": "Queueing behaviour is highly nonlinear near 100% utilisation; variability then produces long, slow-to-clear queues."
            }
        },
    ]

    for p in parts:
        p["output"] = run_snippet(p["code"])

    return {
        "day": 14,
        "title": "Operations Management: Process Mapping & Bottleneck Little's Law (L = \u03bb \u00d7 W)",
        "goal": "Diagnose and improve an operation: map processes to separate touch time from waiting, apply Little's Law to set WIP limits, locate bottlenecks with the Theory of Constraints, and understand why high utilisation destroys responsiveness.",
        "minutes": 45,
        "recap": "Day 13 aligned the team on goals. Day 14 asks whether the organisation can actually deliver them: where work waits, how much is in progress, which stage limits output, and how close to the edge each resource is running.",
        "parts": parts,
        "summary": [
            "Mapped a process and separated touch time from wait time to compute lead time and process cycle efficiency.",
            "Applied Little's Law (L = lambda x W) to derive lead time and set a WIP limit for a target lead time.",
            "Located a bottleneck and showed that capacity added elsewhere does not raise system throughput.",
            "Quantified how queueing delay explodes as utilisation approaches 100% in a single-server model.",
            "Combined cycle efficiency, lead time, WIP, bottleneck and headroom checks into one operations health gate."
        ],
        "projectStep": {
            "title": "Diagnose the Flow of One Real Process in Your Venture",
            "steps": [
                "Map one customer process end to end and record touch time and wait time for every step.",
                "Count current WIP and weekly throughput, then compute lead time with Little's Law.",
                "Identify the bottleneck stage using queue length and utilisation, and decide how to exploit it.",
                "Set a WIP limit that delivers a target lead time and list stages running above 85% utilisation.",
                "Run the flow health scorecard and choose the single highest-leverage fix."
            ]
        },
    }


if __name__ == "__main__":
    data = get_day14_data()
    print(f"Generated Day 14: {data['title']}")
    words = [sum(len(s.split()) for s in p["say"]) for p in data["parts"]]
    print(f"Parts word counts: {words} (Total: {sum(words)})")
    for i, p in enumerate(data["parts"]):
        print(f"--- Part {i+1} output ---")
        print(p["output"])
    for i, w in enumerate(words):
        assert w >= 580, f"Part {i+1} has {w} words (< 580)"
    assert sum(words) >= 2950
    print("PASS: Day 14 invariants OK")
