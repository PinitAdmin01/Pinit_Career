import sys, json
sys.path.append('.')

from scripts.make_soft_skills_day18 import get_day_18
d = get_day_18()

# Part 3: Currently 552 words. Add ~80 words
d['parts'][2]['say'].append(
    "Let us examine how to handle follow-up interruptions during your STAR response: Sometimes an experienced interviewer will interject mid-sentence: 'Wait, why did you choose Kafka instead of RabbitMQ?' Inexperienced candidates panic, feeling that an interruption means they are failing. In reality, an interruption is a fantastic signal! It means the interviewer is deeply engaged and wants to explore your architectural reasoning. Gracefully pause your narrative arc, answer their specific technical trade-off with crisp empirical data for twenty to thirty seconds ('We chose Kafka because we needed immutable replayable event streams and high partition throughput for 30,000 RPS, whereas RabbitMQ's message broker model would have created queue serialization bottlenecks'), and then smoothly re-anchor your narrative: 'With that architectural choice validated, I then transitioned to our database connection pooling strategy...'"
)

# Part 4: Currently 468 words. Add ~180 words
d['parts'][3]['say'].append(
    "Let us explore how to handle behavioral questions when you were a junior engineer or an individual contributor working under a tech lead: Junior candidates often fear using 'I' because they worry the interviewer will assume they are misrepresenting their seniority. They think: 'I didn't make the final architectural decision, my tech lead did, so I have to say we.' This is a misunderstanding. You can acknowledge the tech lead while proudly claiming your engineering execution: 'Our tech lead established the high-level microservice boundaries, but I took full ownership of the payment gateway implementation. I designed the idempotency layer, I wrote the retry policies with exponential backoff, and I implemented the automated integration tests.' Notice how this demonstrates deep respect for team structure while clearly defining your individual technical agency."
)
d['parts'][3]['say'].append(
    "Furthermore, observe the empowering psychological transformation that occurs when you practice speaking in active first-person: Many engineers suffer from imposter syndrome, believing that their accomplishments were simply luck, good timing, or the work of brilliant teammates. When you deliberately practice structuring your stories with 'I analyzed', 'I designed', 'I resolved', you begin to internalize your own hard-won competence. You realize that you did not merely occupy a chair; you made critical architectural contributions that solved real-world engineering problems."
)

# Part 5: Currently 381 words. Add ~260 words
d['parts'][4]['say'].append(
    "Let us examine how hiring committees calibrate behavioral responses across engineering levels: When evaluating a Junior or Mid-level Engineer (L3/L4), committees focus heavily on execution rigor, individual problem-solving, and coachability: Did you take ownership of assigned tasks? Did you ask for help proactively when blocked? Did you write robust tests? However, when evaluating Senior, Staff, and Principal Engineers (L5/L6/L7), the evaluation lens shifts dramatically toward Organizational Leverage, Ambiguity Resolution, and Mentorship: Did you identify systemic architectural risks before they caused outages? Did you align multiple dissenting teams around a technical vision? Did you mentor junior engineers and elevate team-wide coding standards?"
)
d['parts'][4]['say'].append(
    "Consider the strategic impact of practicing STAR delivery under pressure: The best way to build unshakeable behavioral fluency is through peer mock interviews and video playback audits. Pair up with a fellow software engineer, pick a challenging behavioral prompt, and deliver your response while timing yourself on a stopwatch. Play back the audio recording and evaluate yourself ruthlessly: Did you spend too long in the Situation? Did you use passive 'we'? Did you end with a quantified Result and a systemic guardrail? By conducting three to four rigorous mock audits, you transform behavioral interviewing from an awkward interrogation into an effortless, authoritative masterclass in technical leadership."
)

with open('scripts/make_soft_skills_day18.py', 'w', encoding='utf-8') as f:
    f.write("import json\n\ndef get_day_18():\n    return " + json.dumps(d, indent=4) + "\n")

print("Day 18 successfully boosted!")
