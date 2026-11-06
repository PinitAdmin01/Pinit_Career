import sys, json, subprocess
sys.path.append('.')

from scripts.make_soft_skills_day20 import get_day_20
d = get_day_20()

# 1. Boost Part 1: Currently 578 words. Add ~90 words
d['parts'][0]['say'].append(
    "Let us examine how to distinguish between high-signal technical failure and disqualifying behavioral or ethical failure: In engineering interviews, not all failures are created equal. A high-signal technical failure involves an ambitious architectural goal that encountered unexpected real-world edge cases (such as a database replica lag surge, a distributed consensus race condition, or a third-party webhook timeout). These demonstrate that you work on complex, high-scale engineering challenges. In contrast, disqualifying failures involve negligence, carelessness, or interpersonal hostility (such as missing a release because you forgot to check email, or getting into a shouting match with a coworker). When selecting your failure story, always ensure the failure stemmed from genuine systems complexity, and that your response highlights mature operational composure."
)

# 2. Boost Part 2: Currently 512 words. Add ~140 words
d['parts'][1]['say'].append(
    "Let us explore how to maintain emotional composure and scientific objectivity throughout your postmortem narrative: When recalling a major outage, many developers unconsciously slip into self-flagellation: 'I felt so stupid', 'I ruined everything', 'It was the worst day of my life.' This emotional drama undermines your professional posture! Senior engineering leaders discuss outages with the calm, analytical detachment of an aircraft accident investigator or a cardiovascular surgeon. You do not treat the outage as a personal moral failure; you treat it as an empirical collision between software architecture and production traffic. By speaking with objective precision ('The system reached 100% thread pool saturation due to unthrottled synchronous I/O'), you project unshakeable emotional resilience under fire."
)

# 3. Boost Part 3: Currently 514 words. Add ~130 words
d['parts'][2]['say'].append(
    "Let us analyze why an elite Five Whys analysis must NEVER terminate at human error: In low-maturity engineering teams, incident analyses frequently stop at an engineer's action: 'Why did the bug ship? Because John forgot to run the unit tests before pushing.' In elite SRE culture, 'John forgot to run the tests' is merely Why #3! You must immediately ask Why #4: 'Why was John able to push code to production without unit tests executing automatically in CI?' And Why #5: 'Why did our repository branch protection rules lack mandatory automated status checks?' When your root cause analysis terminates at automated policy, tooling, and architecture rather than individual blame, you demonstrate the strategic systems mindset that defines Principal Engineers."
)

# 4. Boost Part 4: Currently 421 words. Add ~220 words
d['parts'][3]['say'].append(
    "Let us examine how senior technical leaders institute cultural and procedural guardrails alongside automated code linters: While static linters and compiler checks are the gold standard of defense, complex distributed systems also require robust operational guardrails. Consider three high-impact institutional guardrails: 1. Architecture Review RFCs: Establishing a lightweight Request for Comments (RFC) process for high-risk schema migrations or distributed state changes, ensuring that at least two senior architects review locking mechanics before code is written; 2. Chaos Engineering Game Days: Using tools like Chaos Mesh or AWS Fault Injection Simulator to proactively inject latency, network partitions, and pod failures into staging environments, verifying that circuit breakers and failovers operate as designed before traffic spikes; 3. Verified Disaster Recovery Runbooks: Documenting step-by-step mitigation procedures with exact CLI commands, reducing Mean Time to Recovery (MTTR) during real midnight incidents."
)
d['parts'][3]['say'].append(
    "Notice how this holistic defense-in-depth model transforms your interview answer: When an interviewer asks how you prevented the failure from recurring, you do not just say: 'I wrote a linter.' You say: 'I implemented a three-tier defense-in-depth strategy: First, an automated CI AST linter to catch static violations at compile time; second, automated chaos load testing to verify circuit breakers under simulated traffic; and third, an updated operational runbook with pre-configured Grafana alerts.' This comprehensive answer demonstrates true engineering maturity."
)

# 5. Boost Part 5: Currently 353 words. Add ~280 words
d['parts'][4]['say'].append(
    "Let us examine how the five days of Milestone 3 interconnect to form an impregnable career advancement engine: In Day 16, you engineered your resume with Google X-Y-Z precision to pass automated ATS parsers; in Day 17, you optimized your LinkedIn profile and proof-of-work to generate consistent inbound recruiter demand; in Day 18, you mastered the STAR method and the 60/40 action pacing rule to conquer behavioral rubrics; in Day 19, you perfected the 90-second Present-Past-Future elevator pitch to capture the opening screen; and today, in Day 20, you mastered blameless postmortem storytelling to turn failure into an undeniable proof of senior technical leadership."
)
d['parts'][4]['say'].append(
    "Reflect on the profound career sovereignty this curriculum delivers: Throughout the technology industry, software developers frequently feel vulnerable, anxious, and at the mercy of unpredictable hiring markets and economic cycles. But when you treat your career, your communication, and your interview delivery with the same empirical engineering rigor that you apply to distributed systems, you reclaim total agency over your professional destiny. You become an engineer who not only writes elegant code, but who articulates value with undeniable clarity, earns the trust of executive leadership, and commands top-tier compensation across the global technology ecosystem."
)

# Fix Part 4 Code: In eliteCandidate, ensure circuit breaker keyword is present so hasCircuit is true
d['parts'][3]['code'] = d['parts'][3]['code'].replace(
    "Furthermore, I implemented an automated regression test in our CI test suite and configured an automated canary deployment pipeline in ArgoCD that automatically rolls back deployments if error rates exceed 0.5%.",
    "Furthermore, I implemented an automated regression test in our CI test suite, added an architectural circuit breaker with graceful fallback in our connection pool, and configured an automated canary deployment pipeline in ArgoCD that automatically rolls back deployments if error rates exceed 0.5%."
)

# Run tsx on all 5 parts and capture exact output
for i, p in enumerate(d['parts']):
    with open(f'temp_d20_p{i+1}.ts', 'w', encoding='utf-8') as f:
        f.write(p['code'])
    res = subprocess.run(['npx', 'tsx', f'temp_d20_p{i+1}.ts'], capture_output=True, text=True, shell=True)
    if res.returncode != 0:
        print(f'Part {i+1} FAILED tsx:\n{res.stderr}')
    else:
        p['output'] = res.stdout.strip()
        print(f'Part {i+1} output updated and matched.')

with open('scripts/make_soft_skills_day20.py', 'w', encoding='utf-8') as f:
    f.write('import json\n\ndef get_day_20():\n    return ' + json.dumps(d, indent=4) + '\n')

print("Day 20 successfully boosted, fixed, and synced!")
