import sys, json
sys.path.append('.')

from scripts.make_soft_skills_day13 import get_day_13
d = get_day_13()

# Part 1 is 712 words (already > 700)

# Part 2 is 555 words: Add ~200 words
d['parts'][1]['say'].append(
    "Let us examine how to implement 'Silent Synchronous Pairing' as an alternative to fragmented status meetings: In many agile engineering teams, managers schedule daily standups, backlog refinings, and design syncs that scatter thirty-minute slots throughout the week. High-performing engineering teams replace these disparate syncs with silent pairing rooms: The team opens a persistent virtual room or gathers in a dedicated physical quiet space for a 3-hour morning block. Team members keep their microphones muted and write code in deep flow. If an engineer hits a gnarly race condition or needs a quick code review, they post a link in the chat; a peer reviews it silently or hops into a breakout room for five minutes, and both instantly return to flow. This preserves the collaborative bandwidth of a close-knit team without puncturing continuous maker concentration."
)
d['parts'][1]['say'].append(
    "Furthermore, consider the profound impact of calendar audits on engineering retention: Exit interviews across Silicon Valley reveal that the number-one frustration cited by departing senior software engineers is not compensation—it is 'too many useless meetings preventing me from doing real engineering.' When engineers spend 60% of their week sitting in status meetings listening to updates irrelevant to their systems, their intrinsic motivation withers. By vigorously defending the Maker's Schedule and enforcing continuous 3.5+ hour focus blocks, engineering leadership demonstrates deep respect for craft, dramatically boosting developer retention, morale, and pride in craftsmanship."
)

# Part 3 is 575 words: Add ~200 words
d['parts'][2]['say'].append(
    "Let us explore how to defend deep work boundaries against executive and managerial overreach: When an executive or VP reaches out directly on Slack with a drive-by request ('Can you pull together a quick performance benchmark comparison for our board deck tomorrow?'), junior developers panic and instantly derail their entire sprint. The master tech lead utilizes William Ury's Positive No with executive framing: 'Yes, I understand the immense strategic importance of presenting flawless infrastructure metrics to the Board of Directors tomorrow. Because I am currently running our load-testing suite to ensure our checkout service doesn't crash during the marketing campaign, I cannot assemble the custom deck this morning. Let me introduce you to Sarah from our Platform Ops team who has the raw Grafana dashboards ready, or I can deliver a polished one-page summary by 4:30 PM today during my afternoon collaboration block.' You demonstrate deep executive empathy, protect your active focus, and provide a seamless solution."
)
d['parts'][2]['say'].append(
    "Additionally, consider the compound effect of setting healthy boundaries across your entire career: Engineers who never learn to say No become overwhelmed workaholics who accumulate resentment. They privately grumble about how 'toxic' the company is, while failing to realize that they trained the organization to treat them as an on-demand answering service. When you establish firm, empathetic boundaries using William Ury's framework, you train colleagues to treat your time as a finite, high-value asset. People respect professionals who respect their own time."
)

# Part 4 is 475 words: Add ~280 words
d['parts'][3]['say'].append(
    "Let us examine the operational protocols of Code Review Batching (PR SLAs): In many engineering teams, developers treat Pull Request reviews as real-time emergencies. The moment a GitHub notification arrives, an engineer drops their active feature branch to review their teammate's PR. This practice creates massive context fragmentation. High-velocity teams establish an explicit Pull Request Service Level Agreement (SLA): Non-emergency PRs have a 24-hour review SLA. Engineers review PRs in two dedicated batching windows: Once in the late morning (11:30 AM to 12:00 PM) before lunch, and once in the late afternoon (4:00 PM to 4:30 PM) before logging off."
)
d['parts'][3]['say'].append(
    "By batching PR reviews, developers review code with deep, uninterrupted attention rather than skimming lines in a hurry between meetings. Code quality improves, subtle security vulnerabilities are caught, and teammates receive predictable, high-signal feedback. Furthermore, authors learn to structure their PRs asynchronously: They write comprehensive PR descriptions, link relevant Jira tickets, include before/after screenshots, and paste test execution logs, eliminating the need for synchronous back-and-forth explanations."
)
d['parts'][3]['say'].append(
    "Let us examine how to handle 'False Emergencies' in asynchronous communication: In immature organizations, team members frequently mark ordinary requests as 'URGENT' simply because they waited until the last minute. The senior engineer establishes a clear operational rubric: An emergency is strictly defined as an active production outage, data corruption event, or critical security breach. Everything else—including upcoming marketing launches, feature requests, and non-blocking bugs—is prioritized within normal sprint backlogs and asynchronous batch windows. By enforcing this standard, the team inoculates itself against manufactured panic."
)

# Part 5 is 324 words: Add ~420 words
d['parts'][4]['say'].append(
    "Let us examine the economic reality of engineering focus from an executive perspective: A technology company that employs fifty software engineers with an average total compensation of $180,000 per year spends $9,000,000 annually on engineering talent. If those engineers spend 40% of their working hours lost in context switching, fragmented 30-minute meetings, and hyper-responsive chat triage, the enterprise is literally setting $3,600,000 on fire every single year in lost cognitive output."
)
d['parts'][4]['say'].append(
    "When a senior tech lead presents our Deep Work and Attention Residue Audit to the Chief Technology Officer, they are not presenting a subjective lifestyle preference; they are presenting an operational turnaround plan that unlocks millions of dollars in enterprise value. By eliminating two recurring weekly status syncs, clustering 1-on-1s into Tuesday afternoons, and mandating morning deep work blocks, the organization recaptures hundreds of engineering hours per sprint, accelerating time-to-market for revenue-generating features."
)
d['parts'][4]['say'].append(
    "Let us reflect on the profound personal mastery that deep work unlocks in your engineering life: The greatest computer scientists, system architects, and software pioneers—from Donald Knuth and Linus Torvalds to Grace Hopper and Paul Graham—did not achieve greatness by answering emails faster than anyone else. They achieved greatness because they carved out monastic sanctuaries of uninterrupted concentration where they could wrestle with the deepest, most difficult mathematical and algorithmic challenges of their era."
)
d['parts'][4]['say'].append(
    "When you master the discipline of deep work, you step off the frantic, superficial treadmill of corporate reactivity. You reclaim your mental clarity, your joy of coding, and your ability to build enduring software systems. You become an unshakeable master of your craft—a software engineer who commands deep respect and delivers extraordinary technical impact."
)

with open('scripts/make_soft_skills_day13.py', 'w', encoding='utf-8') as f:
    f.write("import json\n\n")
    f.write("def get_day_13():\n")
    f.write("    return " + json.dumps(d, indent=4) + "\n")

print("Day 13 successfully boosted!")
