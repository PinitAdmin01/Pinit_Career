import sys
sys.path.append('.')
import json

from scripts.make_soft_skills_day25 import get_day_25
d = get_day_25()

# Part 1 boost
d['parts'][0]['say'].extend([
    "Consider the tax implications that distinguish the various components of Total Compensation: Base salary and annual performance bonuses are treated as ordinary earned income, subjected to full federal, state, and payroll taxes (FICA/Medicare) immediately upon receipt. In high-tax jurisdictions like California or New York, your marginal tax rate on cash bonuses can easily exceed 45%!",
    "By contrast, long-term equity holdings and capital gains qualify for significantly lower tax rates if managed strategically. Understanding this tax geometry enables senior engineers to optimize not just their gross top-line compensation, but their net after-tax wealth accumulation. When negotiating with compensation committees, asking for equity or sign-on bonuses often provides higher tax efficiency and greater upside than fighting for a marginal $5,000 increase in base salary."
])

# Part 2 boost
d['parts'][1]['say'].extend([
    "Let us explore the critical concept of Equity Dilution across venture funding rounds. If you join a Series A startup and receive 100,000 options representing 1.0% of the company, that percentage does not remain static! When the company raises a Series B round, the venture capital firm purchases new shares, diluting existing shareholders by typically 15% to 25%. By the time the company reaches a Series D or IPO, your 1.0% ownership may be diluted down to 0.40% or less.",
    "However, dilution is not necessarily bad—as long as the valuation increases faster than the share count expands! 0.4% of a two-billion-dollar company ($8 million) is worth vastly more than 1.0% of a ten-million-dollar company ($100,000). But when evaluating startup offers, you must ask the recruiter for the Total Fully Diluted Share Count. If a recruiter tells you 'we are giving you 50,000 shares' but refuses to tell you the total share count, those 50,000 shares could represent 1% of the company or 0.0001% of the company! Never accept an equity offer without knowing your percentage ownership on a fully diluted basis."
])

# Part 3 boost
d['parts'][2]['say'].extend([
    "Notice how recruiters use subtle psychological pressure to induce early anchoring. A recruiter might say: 'We want to make sure we are in the same ballpark so we do not waste each other's time.' Inexperienced candidates feel guilty and cave in, giving a number to be polite. But senior candidates recognize this as standard negotiation theater. You can reply with flawless warmth: 'I completely respect your time, and I assure you that if there is a strong technical fit, we will be able to reach an agreement that aligns with market rates for this leveling.'",
    "Similarly, beware of the 'Exploding Offer' tactic, where a company gives you 48 hours to sign or threatens to revoke the offer. Exploding offers are high-pressure sales tactics designed to prevent you from collecting competing offers. In professional tech hiring, exploding deadlines can almost always be extended by expressing deep enthusiasm and requesting a reasonable one-week extension to conclude ongoing interview loops. A company that rescinds an offer simply because you asked for five business days to make a life-changing career decision has revealed a toxic, low-trust culture."
])

# Part 4 boost
d['parts'][3]['say'].extend([
    "Let us analyze the tactical nuance of negotiating non-salary compensation variables. While recruiters frequently hit hard ceilings on base salary due to internal equity and salary band parity across the engineering organization, they often possess massive flexibility in other areas: Sign-on bonuses, relocation stipends, equity grants, title leveling, remote work flexibility, and accelerated performance review timelines.",
    "If a recruiter tells you: 'We are at the absolute top of the base salary band for Senior Engineer ($195k) and cannot add another dollar', do not give up! Pivot gracefully to alternative levers: 'I completely understand that base salary is capped at the band maximum. Given that constraint, could we bridge the gap by increasing the first-year sign-on bonus by $30,000 or expanding the initial equity grant by $60,000 over four years? If you can make that adjustment, I would be delighted to finalize and sign today.' This flexible problem-solving makes it easy for the recruiter to say yes."
])

# Part 5 boost
d['parts'][4]['say'].extend([
    "Reflect on the profound psychological shift that occurs when you master compensation negotiation: You stop viewing negotiation as an adversarial confrontation and start viewing it as a collaborative architectural alignment. You and the company are negotiating the parameters of a high-value partnership. When you conduct yourself with poise, clarity, and market-backed data, you signal that you are a high-value professional who commands respect in the marketplace.",
    "As you conclude this capstone day of Milestone 4, look back on the complete journey: From reverse interviewing and live coding protocols, to system design communication and offer negotiation. You have acquired the complete, end-to-end communication and strategic apparatus of the top 1% of software engineering professionals. Go forward into the market, build extraordinary systems, negotiate your true worth, and claim the rewards of your technical excellence."
])

w = [len(' '.join(p['say']).split()) for p in d['parts']]
print('Boosted Day 25 Words:', sum(w), 'Parts:', w)

with open('scripts/make_soft_skills_day25.py', 'w', encoding='utf-8') as f:
    f.write(f'import json\n\ndef get_day_25():\n    return {json.dumps(d, indent=4)}\n')

print('Day 25 updated successfully!')
