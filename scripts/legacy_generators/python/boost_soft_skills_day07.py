import sys, json
sys.path.append('.')

from scripts.make_soft_skills_day07 import get_day_07
d = get_day_07()

# Part 1 boost
d['parts'][0]['say'].append(
    "Let us examine how to handle code reviews on large cross-functional refactors: When an author submits a massive pull request spanning thousands of lines across multiple microservices, reviewers experience severe cognitive exhaustion, often resulting in superficial 'looks good to me' rubber-stamping or hyper-focused trivial nitpicking on formatting. Elite engineering leaders establish PR Size Governance: Pull requests should ideally be scoped between 200 and 400 lines of diff. If a feature inherently requires 2,000 lines of modifications, the author breaks the work down into stacked, atomic pull requests that can be reviewed independently. This reduces cognitive load on reviewers, ensures thorough scrutiny of critical architectural invariants, and protects psychological safety by preventing reviewers from feeling overwhelmed by impossible review burdens."
)

# Part 2 boost
d['parts'][1]['say'].append(
    "Let us explore how to deliver SBI feedback during high-stakes incident retrospectives: In post-incident post-mortems following a Tier-1 production outage, engineers often feel immense guilt, anxiety, and fear of termination. If the retrospective meeting begins with executive leadership asking, 'Who broke the build?' or 'Why didn't anyone catch this bug in QA?', psychological safety is shattered, and engineers learn to conceal future mistakes. By enforcing the SBI framework within the blameless post-mortem, the facilitator guides the conversation strictly toward system invariants: 'During yesterday's peak checkout surge at 14:00 UTC (Situation), the cache invalidation job executed without rate limiting (Behavior), which caused 10,000 concurrent database connections and a 20-minute database failover (Impact). Moving forward, what automated circuit breakers can we engineer into the cache worker to eliminate this failure mode permanently?'"
)
d['parts'][1]['say'].append(
    "This rigorous grounding in observable behavior and systemic impact shifts the retrospective from a punitive witch hunt into an empowering engineering resilience session. When developers realize that failure is treated as a learning opportunity rather than a personal character flaw, team transparency skyrockets, incident detection times decrease, and engineers eagerly share near-misses before they escalate into customer-facing catastrophes."
)

# Part 3 boost
d['parts'][2]['say'].append(
    "Let us analyze how Conventional Comments transform junior engineer mentorship: For early-career developers and new hires, the first few months at a technology company are fraught with imposter syndrome. When a junior engineer opens their first pull request and receives twenty comments from senior colleagues, they frequently misinterpret every single comment as evidence that they are inadequate and failing. When the team adopts Conventional Comments, the junior engineer can immediately triage the feedback: 'Ah, fifteen of these twenty comments are tagged [nit] or [suggestion], which means my core logic is sound and the team is simply teaching me their formatting conventions and idiomatic design patterns!' This eliminates debilitating anxiety and accelerates the junior developer's learning velocity by orders of magnitude."
)
d['parts'][2]['say'].append(
    "Furthermore, Conventional Comments includes the `[thought]` tag: used when a reviewer wants to share an interesting architectural observation or alternative approach without expecting any action from the author (`[thought] In Go or Rust, this pattern would typically use a channel or actor model; interesting to see how cleanly TypeScript handles it with async iterators`). This encourages intellectual curiosity, turns routine PR reviews into masterclasses in software architecture, and builds an enriching engineering culture where colleagues learn from each other every day."
)

# Part 4 boost
d['parts'][3]['say'].append(
    "Let us examine how senior engineers cultivate the emotional resilience required to Disagree and Commit: Many junior developers mistakenly believe that 'Disagree and Commit' means silently fuming while someone else's bad idea gets built. True commitment requires emotional maturity and intellectual humility: You advocate passionately for your proposal during the evaluation phase, presenting benchmark data, architectural trade-off analyses, and risk matrices. But once the Tech Lead or team consensus decides to move forward with the alternative approach, you make a conscious mental choice: You discard your attachment to being 'right', take full personal ownership of the chosen strategy, and dedicate your engineering talent to making it wildly successful."
)
d['parts'][3]['say'].append(
    "If the chosen strategy later encounters unexpected edge cases in production, an aligned engineer never says, 'I told you so; if we used my approach this wouldn't have happened.' Instead, they jump onto the incident call with empathy, roll up their sleeves, and help solve the problem collaboratively. This unwavering commitment to collective team success over individual ego is the definitive characteristic that executive leadership looks for when promoting engineers into Staff, Principal, and Director positions."
)

# Part 5 boost
d['parts'][4]['say'].append(
    "Let us explore how high-performing engineering squads maintain culture accountability over time: High-trust engineering culture is not a static milestone that is achieved once and forgotten; it is an active institutional discipline that requires continuous hygiene, role modeling, and proactive feedback. Elite engineering organizations conduct quarterly Code Review Retrospectives where the entire team reviews anonymized PR comment threads together, celebrating examples of exceptional empathy, discussing ambiguous feedback tags, and refining team working agreements."
)
d['parts'][4]['say'].append(
    "When new engineers join the organization, they are not merely handed a linter config and told to read the documentation; they are paired with a seasoned culture mentor who reviews their first five PRs side-by-side, demonstrating how to write empathetic comments, how to tag feedback with Conventional Comments, and how to invoke the 3-Comment circuit breaker gracefully. By deliberately onboarding every new hire into high-trust communication protocols, the engineering organization preserves its psychological safety even as the department scales from twenty engineers to two thousand."
)
d['parts'][4]['say'].append(
    "By mastering the complete Master Code Review & Constructive Feedback Suite, you become a catalyst for cultural excellence. You transform routine code reviews from a stressful corporate chore into an empowering engine of continuous learning, mutual respect, and accelerated engineering velocity. You become the engineer everyone wants on their pull requests—not only because you catch critical bugs, but because working with you makes everyone on the team a better engineer."
)

# Write back to make_soft_skills_day07.py
with open('scripts/make_soft_skills_day07.py', 'w', encoding='utf-8') as f:
    f.write("import json\n\n")
    f.write("def get_day_07():\n")
    f.write(f"    return {json.dumps(d, indent=4, ensure_ascii=False)}\n\n")
    f.write('if __name__ == "__main__":\n')
    f.write('    d = get_day_07()\n')
    f.write('    words = [len(" ".join(p["say"]).split()) for p in d["parts"]]\n')
    f.write('    total = sum(words)\n')
    f.write('    print(f"Day 7 Total Words: {total} (~{total/150:.1f} mins), Parts: {words}")\n')

print("Boosted Day 7 successfully!")
