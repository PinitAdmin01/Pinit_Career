import re

def fix_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        code = f.read()

    # Replace 'correctIndex' with 'answer'
    code = code.replace('"correctIndex":', '"answer":')
    code = code.replace("'correctIndex':", "'answer':")

    # Fix summaries to list of strings
    # For day 46
    code = re.sub(
        r'"summary":\s*"Master the financial mechanics of tech total compensation \(TC\):[^"]*",',
        '"summary": [\n            "Master the financial mechanics of tech total compensation (TC): equity dilution, liquidation preferences, vesting schedules, 409A valuations, and tax implications (AMT).",\n            "Evaluate cap tables, 83(b) tax elections, and liquidation waterfalls across venture stages.",\n            "Audit offer contracts for extended post-termination exercise windows and non-compete clauses."\n        ],',
        code
    )
    # For day 47
    code = re.sub(
        r'"summary":\s*"Master the professional negotiation playbook:[^"]*",',
        '"summary": [\n            "Master the professional negotiation playbook: using competing offers as market data, anchoring high with data, negotiating non-monetary levers, and crafting respectful counter-offer emails.",\n            "Leverage Fisher & Ury Getting to Yes BATNA and ZOPA principles to anchor near the 90th percentile of company bands.",\n            "De-escalate recruiter pressure tactics including exploding offers with calm emotional poise."\n        ],',
        code
    )
    # For day 48
    code = re.sub(
        r'"summary":\s*"Master the protocol for difficult performance conversations:[^"]*",',
        '"summary": [\n            "Master the protocol for difficult performance conversations: Radical Candor (Kim Scott), objective metric documentation, Performance Improvement Plans (PIPs), and managing out with dignity.",\n            "Eliminate Ruinous Empathy by pairing caring personally with challenging directly on observable engineering standards.",\n            "Handle emotional reactivity with composure, anchoring to facts and preserving human dignity."\n        ],',
        code
    )
    # For day 49
    code = re.sub(
        r'"summary":\s*"Master the protocol for delivering bad news to leadership:[^"]*",',
        '"summary": [\n            "Master the protocol for delivering bad news to leadership: early escalation, proactive risk framing, presenting three actionable mitigation paths, and preserving trust under fire.",\n            "Apply High-Reliability Organizational theory and Challenger dissent lessons to escalate issues within 24 hours.",\n            "Always present the Triple Option with quantified trade-offs and decisive engineering recommendations."\n        ],',
        code
    )
    # For day 50
    code = re.sub(
        r'"summary":\s*"Deliver and defend ApexNegotiation:[^"]*",',
        '"summary": [\n            "Deliver and defend ApexNegotiation: a high-stakes technology compensation and executive negotiation suite, surviving the live recruiter and executive crisis gauntlet.",\n            "Model compensation strategy through cooperative Nash Equilibria to maximize total compensation and eliminate deadlock.",\n            "Survive the dual-phase recruiter negotiation and executive crisis gauntlet to achieve L7 certification."\n        ],',
        code
    )

    # For day 51
    code = re.sub(
        r'"summary":\s*"Master the art of tech conference public speaking:[^"]*",',
        '"summary": [\n            "Master the art of tech conference public speaking: CFP scoring rubrics, magnetic abstract blueprints, zero-network demo containerization, and stage catastrophe recovery.",\n            "Align talk proposals with selection committee rubrics emphasizing vendor neutrality and actionable takeaways.",\n            "Containerize live demos into offline Docker images with pre-recorded video backups to eliminate stage failure."\n        ],',
        code
    )
    # For day 52
    code = re.sub(
        r'"summary":\s*"Master world-class technical writing:[^"]*",',
        '"summary": [\n            "Master world-class technical writing: Hacker News virality mechanics, 5-part post-mortem blog blueprints, automated markdown publishing, and adversarial comment defense.",\n            "Structure 2,000-word engineering post-mortems around real production cliffs and reproducible flamegraph telemetry.",\n            "Automate multi-platform markdown validation and defend architecture decisions with poised empirical data."\n        ],',
        code
    )
    # For day 53
    code = re.sub(
        r'"summary":\s*"Master Asynchronous Sovereignty:[^"]*",',
        '"summary": [\n            "Master Asynchronous Sovereignty: GitLab\'s Handbook-First manifesto, high-density 120-second video walkthroughs, follow-the-sun handoffs, and zero-sync emergency crisis orchestration.",\n            "Eliminate synchronous meeting bottlenecks by treating public handbook documentation as the Single Source of Truth.",\n            "Orchestrate 24-hour follow-the-sun development and zero-sync incident resolution across global engineering squads."\n        ],',
        code
    )
    # For day 54
    code = re.sub(
        r'"summary":\s*"Master the full-day Staff\+ onsite interview gauntlet:[^"]*",',
        '"summary": [\n            "Master the full-day Staff+ onsite interview gauntlet: Bayesian independence in committee rubrics, 14-day athletic preparation schedules, and the 60-second inter-round reset protocol.",\n            "Leverage Bayesian independence in hiring committee rubrics to sever emotional contagion between interview rounds.",\n            "Condition physical and mental stamina with athletic tapering and deliberate 120-140 WPM speaking cadence."\n        ],',
        code
    )
    # For day 55
    code = re.sub(
        r'"summary":\s*"Dissect the communication failure of the Space Shuttle Challenger disaster:[^"]*",',
        '"summary": [\n            "Dissect the communication failure of the Space Shuttle Challenger disaster: Edward Tufte\'s forensic analysis, causal scatter plot reconstruction, and moral engineering courage under executive pressure.",\n            "Eliminate selection bias and chart junk by plotting complete causal distributions along continuous operational axes.",\n            "Uphold moral engineering courage by refusing to compromise safety invariants under executive launch pressure."\n        ],',
        code
    )

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(code)

    print(f"Fixed {filename} successfully!")

if __name__ == '__main__':
    fix_file('scripts/generate_soft_skills_days46_50_final.py')
    fix_file('scripts/generate_soft_skills_days51_55_final.py')
