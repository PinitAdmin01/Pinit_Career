import sys, json
sys.path.append('.')

from scripts.make_soft_skills_day09 import get_day_09
d = get_day_09()

# Part 1: Economics of attention (636 words - already >= 620, let's add one more paragraph for extra depth)
d['parts'][0]['say'].append(
    "Let us examine how engineering organizations measure the ROI of recurring ceremonies: High-performing teams audit their calendars quarterly using a 'Meeting Purge' ritual. Every recurring meeting on the calendar is deleted, forcing organizers to justify re-adding it by proving that its synchronous value significantly exceeds its loaded cognitive cost. When teams subject their daily standups, backlog groomings, and sprint retrospectives to this rigorous financial and psychological audit, they eliminate low-signal bureaucratic overhead, restore twenty to thirty hours of weekly maker time, and unlock unprecedented engineering velocity."
)

# Part 2: The 90-Second Standup Protocol (Currently 492 words)
d['parts'][1]['say'].append(
    "Let us explore how to adapt the 90-second protocol in globally distributed, asynchronous-first engineering teams: When team members are distributed across multiple time zones spanning San Francisco, London, Bengaluru, and Tokyo, a mandatory 9:00 AM PST synchronous standup forces engineers in Asia to dial in at midnight, destroying their sleep hygiene, while engineers in Europe attend at the tail end of their working day when their mental energy is depleted. Elite remote organizations replace synchronous voice standups with Asynchronous Written Standups in a dedicated Slack or Teams channel (`#squad-daily-sync`)."
)
d['parts'][1]['say'].append(
    "In an asynchronous standup, every developer posts their 90-second equivalent update by 10:00 AM in their local time zone using a strict markdown template: three bullet points labeled 'Outcome Yesterday', 'Commitment Today', and 'Blockers'. Team members read the updates asynchronously during their morning startup routine. If an engineer flags a blocker, teammates tag relevant colleagues directly in the thread: '@sarah could you review PR #412 when you come online so Dave can proceed with deployment?' This asynchronous discipline delivers 100% of the alignment value with zero synchronous interruption, allowing developers across global time zones to collaborate seamlessly without sacrificing their health or circadian rhythm."
)

# Part 3: The Parking Lot Pattern (Currently 427 words)
d['parts'][2]['say'].append(
    "Let us examine how to run the post-standup Parking Lot breakout with maximum efficiency: In many teams, once the main standup concludes, developers who remain for the parking lot drift into unstructured, rambling conversations where no clear decision is reached. Elite agile facilitators apply strict structure to the parking lot: Before the breakout begins, the facilitator counts the parked topics and establishes an explicit timebox for each—typically five to ten minutes maximum. For each topic, the facilitator asks three diagnostic questions: First, what is the precise technical question we are resolving? Second, who in this breakout owns the ultimate decision? Third, what are the concrete next steps?"
)
d['parts'][2]['say'].append(
    "If a parked topic cannot be resolved within its ten-minute timebox because it requires deeper benchmarking or consultation with external teams (such as Security or Legal), the owner does not prolong the meeting. Instead, they make an explicit commitment: 'We need heap dump metrics under load before we can choose between Redis and Memcached; I will run a 30-minute benchmark this afternoon and post the results in our RFC document by 4:00 PM.' The parking lot is terminated immediately, respecting everyone's time and transforming open-ended debate into focused asynchronous action."
)

# Part 4: Active Facilitation & Board-Walking (Currently 361 words)
d['parts'][3]['say'].append(
    "Let us analyze the psychology of Work-In-Progress (WIP) limits and swarming during board-walking: One of the most dangerous symptoms of a dysfunctional sprint is 'Ticket Piling'—an anti-pattern where every engineer on the squad has two or three tickets simultaneously in 'In Progress', but zero tickets are getting completed. When an engineer finishes their current subtask and hits a minor review delay, their instinctive temptation is to pull a brand-new user story from the backlog to look productive. This floods the delivery pipeline, multiplies context switching across the team, and causes cycle times to explode."
)
d['parts'][3]['say'].append(
    "During the right-to-left board walk, the facilitator ruthlessly enforces Work-In-Progress (WIP) discipline: If an engineer says, 'I'm blocked waiting on PR review for Ticket A, so I started Ticket B,' the facilitator gently intervenes: 'Instead of starting Ticket B and increasing our squad's WIP, could you spend the next hour reviewing Elena's PR #302 or pairing with Blake to finish the payment integration?' This swarming mindset—where engineers prioritize unblocking existing work over starting new work—drives cycle time down, ensures collective code ownership, and guarantees that sprint commitments are actually delivered to production."
)
d['parts'][3]['say'].append(
    "Furthermore, rotating the facilitator role weekly among all squad members creates an extraordinary cultural transformation: When junior developers take their turn facilitating, they learn how to navigate Jira and Linear, how to read flow metrics, and how to hold senior staff engineers accountable to timeboxes with diplomatic grace. This accelerates their professional maturity and builds a deeply egalitarian, high-trust engineering culture where every developer feels full shared ownership of the team's operational success."
)

# Part 5: Master Synchronous Collaboration Suite (Currently 239 words)
d['parts'][4]['say'].append(
    "Let us examine how high-performing engineering divisions track meeting health quantitatively over time: Modern engineering leaders do not rely on gut feel to assess whether meetings are effective; they deploy automated telemetry and calendar analytics to monitor meeting load across their organization. Squads track metrics such as Average Standup Duration (target: <= 12 minutes), Maker Time Fragmentation Index (target: >= 4 consecutive uninterrupted hours per day), and Blocker Resolution Latency (target: <= 4 hours from standup declaration to unblocking)."
)
d['parts'][4]['say'].append(
    "If a squad's standup duration creeps above fifteen minutes for three consecutive days, or if developers report fewer than twenty hours of deep focus per week, the Engineering Manager immediately initiates a Ceremony Retrospective: The team audits their standup recordings, identifies which topics caused timebox breaches, and recalibrates their parking lot triggers. By treating meeting efficiency as an essential engineering operational metric—just like CPU utilization, API latency, and test coverage—the organization protects its most valuable asset: developer focus and creative flow."
)
d['parts'][4]['say'].append(
    "By mastering the 90-Second Standup Protocol, the Parking Lot Pattern, Right-to-Left Board Walking, and Attention Economics, you elevate your standing within the engineering organization. You become the engineer who runs crisp, inspiring, high-signal meetings that everyone looks forward to attending. You demonstrate that true engineering leadership is not about how long you speak, but about how effectively you empower your colleagues to do their best work with minimum friction and maximum velocity."
)
d['parts'][4]['say'].append(
    "Furthermore, consider how this rigorous synchronous discipline enhances psychological safety: When standup meetings are predictable, tightly timeboxed, and focused strictly on unblocking work rather than interrogating developers, anxiety evaporates. Engineers no longer dread morning standups as defensive compliance trials; instead, they view the ceremony as an empowering pit stop where the entire pit crew swarms to clear tires, refuel the engine, and propel them back onto the track at maximum velocity."
)
d['parts'][4]['say'].append(
    "In executive talent evaluations and promotion committee discussions, the ability to facilitate high-signal meetings and safeguard engineering attention is recognized as a hallmark of Staff-plus engineering maturity. Technical contributors who champion maker time, run crisp ceremonies, and respect the attention economics of their peers earn immense trust from engineering peers and executive leadership alike, establishing themselves as indispensable organizational leaders."
)

# Write clean make_soft_skills_day09.py with json.dumps
with open('scripts/make_soft_skills_day09.py', 'w', encoding='utf-8') as f:
    f.write("import json\n\n")
    f.write("def get_day_09():\n")
    f.write(f"    return {json.dumps(d, indent=4, ensure_ascii=False)}\n\n")
    f.write('if __name__ == "__main__":\n')
    f.write('    d = get_day_09()\n')
    f.write('    words = [len(" ".join(p["say"]).split()) for p in d["parts"]]\n')
    f.write('    total = sum(words)\n')
    f.write('    print(f"Day 9 Total Words: {total} (~{total/150:.1f} mins), Parts: {words}")\n')

print("Boosted Day 9 successfully!")
