#!/usr/bin/env python3
"""
Day 11 Builder: Startup Valuation Methodologies: DCF, Revenue Multiples & Berkus Method
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


CODE_DCF = r'''# Venture DCF: explicit forecast + Gordon-growth terminal value at a venture discount rate
def venture_dcf(fcfs_musd, discount_rate, terminal_growth):
    pv_explicit = 0.0
    for year, fcf in enumerate(fcfs_musd, start=1):
        pv_explicit += fcf / (1 + discount_rate) ** year
    n = len(fcfs_musd)
    terminal_value = fcfs_musd[-1] * (1 + terminal_growth) / (discount_rate - terminal_growth)
    pv_terminal = terminal_value / (1 + discount_rate) ** n
    enterprise_value = pv_explicit + pv_terminal
    return {
        "pv_explicit": round(pv_explicit, 2),
        "terminal_value": round(terminal_value, 2),
        "pv_terminal": round(pv_terminal, 2),
        "enterprise_value": round(enterprise_value, 2),
        "terminal_share_pct": round(pv_terminal / enterprise_value * 100, 1),
    }

forecast = [-2.0, -1.0, 0.5, 3.0, 8.0]  # free cash flow, $M, years 1-5
for rate in (0.25, 0.40, 0.55):
    r = venture_dcf(forecast, rate, 0.05)
    print(f"rate={int(rate*100)}% EV=${r['enterprise_value']}M terminal_share={r['terminal_share_pct']}%")
'''

CODE_MULT = r'''# Revenue-multiple valuation with a growth adjustment
def multiple_valuation(arr_musd, growth_pct, base_multiple, base_growth_pct, sensitivity):
    # each 10 points of growth above/below the peer baseline moves the multiple by `sensitivity`
    adjustment = (growth_pct - base_growth_pct) / 10.0 * sensitivity
    multiple = max(1.0, base_multiple + adjustment)
    return round(arr_musd * multiple, 2), round(multiple, 2)

peers = [("PeerA", 6.0, 40), ("PeerB", 9.0, 70), ("PeerC", 5.0, 30)]
avg_mult = sum(m for _, m, _ in peers) / len(peers)
avg_growth = sum(g for _, _, g in peers) / len(peers)
print(f"peer median-ish multiple={avg_mult:.2f}x avg growth={avg_growth:.1f}%")
for g in (30, 60, 120):
    value, mult = multiple_valuation(4.0, g, avg_mult, avg_growth, 0.8)
    print(f"ARR=$4.0M growth={g}% -> multiple={mult}x value=${value}M")
'''

CODE_BERKUS = r'''# Berkus Method: five risk-reduction factors, each worth up to $500K pre-revenue
FACTORS = ["sound_idea", "prototype", "quality_team", "strategic_relationships", "product_rollout"]
CAP_PER_FACTOR = 500_000

def berkus(scores):
    # scores: 0.0-1.0 completion of each factor
    total = 0
    detail = {}
    for f in FACTORS:
        s = min(max(scores.get(f, 0.0), 0.0), 1.0)
        value = s * CAP_PER_FACTOR
        detail[f] = int(value)
        total += value
    return int(total), detail

strong = {"sound_idea": 0.9, "prototype": 0.8, "quality_team": 1.0, "strategic_relationships": 0.5, "product_rollout": 0.2}
weak = {"sound_idea": 0.6, "prototype": 0.0, "quality_team": 0.4, "strategic_relationships": 0.0, "product_rollout": 0.0}
for name, sc in (("strong", strong), ("weak", weak)):
    total, detail = berkus(sc)
    print(f"{name}: pre-money=${total:,} (ceiling ${CAP_PER_FACTOR*len(FACTORS):,})")
    print("  " + ", ".join(f"{k}={v:,}" for k, v in detail.items()))
'''

CODE_VC = r'''# Venture Capital Method: work backward from exit value to today's post-money and pre-money
def vc_method(exit_value, target_multiple, expected_dilution_pct, investment):
    retention = 1 - expected_dilution_pct / 100.0
    required_ownership_at_exit = target_multiple * investment / exit_value
    required_ownership_today = required_ownership_at_exit / retention
    post_money = investment / required_ownership_today
    pre_money = post_money - investment
    return {
        "post_money": round(post_money),
        "pre_money": round(pre_money),
        "ownership_today_pct": round(required_ownership_today * 100, 2),
        "ownership_at_exit_pct": round(required_ownership_at_exit * 100, 2),
    }

for target in (10, 20, 30):
    r = vc_method(exit_value=200_000_000, target_multiple=target, expected_dilution_pct=50, investment=2_000_000)
    print(f"target {target}x -> post=${r['post_money']:,} pre=${r['pre_money']:,} own_today={r['ownership_today_pct']}%")
'''

CODE_TOWER = r'''# Valuation triangulation control tower: four methods must agree within a tolerance
def dcf(fcfs, r, g):
    pv = sum(f / (1 + r) ** i for i, f in enumerate(fcfs, 1))
    tv = fcfs[-1] * (1 + g) / (r - g) / (1 + r) ** len(fcfs)
    return (pv + tv) * 1_000_000

def revenue_multiple(arr, multiple):
    return arr * multiple

def berkus_value(scores):
    return sum(min(max(v, 0), 1) * 500_000 for v in scores)

def vc_post_money(exit_value, target, dilution, invest):
    return invest / (target * invest / exit_value / (1 - dilution))

estimates = {
    "DCF (venture 30%)": dcf([-1.0, 0.5, 3.0, 7.0, 14.0], 0.30, 0.05),
    "Revenue multiple": revenue_multiple(4_000_000, 7.5),
    "VC method (15x)": vc_post_money(600_000_000, 15, 0.5, 3_000_000),
    "Berkus (pre-rev cap)": berkus_value([0.9, 0.8, 1.0, 0.6, 0.4]),
}
vals = list(estimates.values())
mean = sum(vals) / len(vals)
trimmed = sorted(vals)[1:-1]
anchor = sum(trimmed) / len(trimmed)
spread = (max(vals) - min(vals)) / mean
for k, v in estimates.items():
    print(f"{k}: ${v/1e6:.2f}M")
print(f"mean=${mean/1e6:.2f}M trimmed_anchor=${anchor/1e6:.2f}M spread={spread*100:.0f}%")
# Pre-revenue Berkus is a ceiling for early ventures, not a peer of revenue methods:
usable = [v for k, v in estimates.items() if not k.startswith("Berkus")]
usable_spread = (max(usable) - min(usable)) / (sum(usable) / len(usable))
status = "VALUATION_TRIANGULATED" if usable_spread <= 0.60 else "VALUATION_METHODS_DIVERGE"
print(f"revenue-stage methods spread={usable_spread*100:.0f}% -> {status}")
'''


def get_day11_data() -> Dict[str, Any]:
    parts = [
        {
            "title": "Discounted Cash Flow for Startups: Forecasts, Terminal Value & Venture Discount Rates",
            "say": [
                "Valuation is the act of converting an uncertain future into a single number that two parties can sign. For a mature company with decades of audited cash flows, that conversion is a disciplined exercise. For a startup it is closer to structured storytelling backed by arithmetic, because the thing being valued does not yet exist in its final form. Discounted Cash Flow, or DCF, is the most theoretically pure method we have: the value of any business equals the present value of all the free cash flow it will ever produce. The method forces a founder to state, year by year, how much cash the company will generate, and then to ask what that cash is worth today given the risk of never receiving it. That discipline is the real product of a DCF; the final number is secondary.",
                "A DCF has three moving parts. First is the explicit forecast, usually five to ten years of free cash flow, which is operating cash flow minus the capital the business must reinvest. Second is the terminal value, which captures everything after the forecast window. The standard approach is the Gordon growth formula, where terminal value equals the final year's cash flow multiplied by one plus the growth rate, divided by the discount rate minus the growth rate. Third is the discount rate, which converts future dollars into present dollars. Each future cash flow is divided by one plus the discount rate raised to the number of years until it arrives. Because the exponent grows every year, distant cash flows shrink rapidly, and that shrinkage is exactly how risk and the time value of money enter the model.",
                "The discount rate is where startup DCF departs sharply from textbook corporate finance. A large public company might be discounted at eight to ten percent. A venture-backed startup is discounted at thirty to fifty percent or more, and the reason is not that investors are greedy. The rate has to compensate for the probability that the company fails entirely, a probability a diversified blue chip simply does not carry. Venture investors reason that most of their portfolio returns nothing, so the winners must be priced at a steep discount to make the whole portfolio work. Typical target rates are around fifty to seventy percent for seed stage, thirty to fifty percent for early growth, and twenty to thirty percent for later stage companies approaching profitability. Choosing the rate is the single most consequential judgment in the entire model.",
                "That judgment exposes the central weakness of startup DCF, which you should be able to explain to any skeptic. The terminal value usually dominates the result. When explicit cash flows are negative or tiny in early years, almost all of the enterprise value comes from the terminal value, which in turn depends on the growth rate and discount rate you assumed. A one-point change in terminal growth can move the valuation by twenty percent. This is why experienced investors treat a DCF as a sensitivity analysis rather than a point estimate. They run it at several discount rates, observe how much of the value sits in the terminal term, and ask whether the assumptions behind that term are believable. A DCF whose value is ninety percent terminal is telling you it is mostly a bet on the distant future.",
                "Used well, DCF still earns its place. It forces explicit assumptions about customer growth, margins, and capital needs that a multiple-based shortcut hides. It reveals which operating levers matter most, because you can change gross margin or sales efficiency and watch value respond. And it provides an internal consistency check against the market-based methods you will meet next. In the simulation below you will compute enterprise value at three different discount rates for the same forecast, and you will measure the terminal value share. Watch how violently the answer moves with the rate. That volatility is the lesson: the value of a startup is not a fact waiting to be discovered, it is a range produced by assumptions you must be able to defend."
            ],
            "example": "When Facebook was valued ahead of its 2012 IPO, analysts ran DCFs that disagreed by tens of billions of dollars, almost entirely because of differing assumptions about terminal growth and the discount rate applied to mobile advertising revenue. The company's explicit five-year cash flows were broadly agreed upon; the argument was about what the business was worth after year five. The same structural dispute appears in every startup valuation, only at smaller scale.",
            "code": CODE_DCF,
            "codeNotes": [
                "Lines 2-14: venture_dcf discounts each forecast year by (1+rate)^year and adds a Gordon-growth terminal value.",
                "Line 9: terminal value = last FCF x (1+g) / (rate - g); it requires rate > g or the formula breaks.",
                "Lines 15-16: the forecast is deliberately negative early, mirroring a startup burning cash before scaling.",
                "Lines 17-19: running three discount rates exposes how sensitive enterprise value and terminal share are."
            ],
            "tryIt": "Change terminal_growth from 0.05 to 0.08 and rerun. Which discount rate shows the largest swing in enterprise value, and why?",
            "check": {
                "question": "Why do venture-stage DCF models use discount rates of 30-50% or more instead of 8-10%?",
                "options": [
                    "Because venture investors are legally required to use higher rates.",
                    "To compensate for the high probability that the startup fails entirely, which diversified large companies do not carry.",
                    "Because higher discount rates always increase the valuation.",
                    "Because startups have no cash flows to discount."
                ],
                "answerIndex": 1,
                "explanation": "The discount rate prices in the risk of total failure and illiquidity. Since most venture investments return little or nothing, winners must be priced at a steep discount for the portfolio to earn an acceptable return."
            }
        },
        {
            "title": "Revenue Multiples & Comparable Company Analysis with Growth Adjustment",
            "say": [
                "If DCF asks what a company is worth in theory, the revenue multiple asks what the market is paying for similar companies today. It is the working language of venture finance: a company with four million dollars in annual recurring revenue valued at seven times ARR is worth twenty-eight million dollars. The appeal is speed and market grounding. You do not need to forecast ten years of cash flows; you observe what buyers have paid for comparable businesses and apply the same ratio. Revenue is used rather than earnings because most growth-stage startups have no profit, and a multiple of a negative number is meaningless. Revenue is at least positive, and for subscription businesses it is recurring, which makes it a more stable base than one-time sales.",
                "Choosing the comparable set is the craft in this method. Good comparables share a business model, a customer segment, a growth profile, and a stage. A fast-growing vertical software company should not be benchmarked against a slow-growing services firm even if both sell to the same industry, because the market pays for growth and gross margin, not for the industry label. Sources include public software companies, recent acquisitions, and disclosed private financing rounds. Private round multiples are noisy, since terms such as liquidation preferences and warrants can make a headline valuation misleading. A sensible analyst collects six to ten comparables, discards obvious outliers, and works from the median rather than the mean, because a single exuberant deal can drag an average far above what is reasonable.",
                "Raw multiples ignore the most important difference between companies, which is growth. A company growing at one hundred twenty percent deserves a higher multiple than one growing at thirty percent, because its revenue base will be much larger by the time an investor exits. The standard fix is a growth adjustment. You compute the average growth rate of the comparable set and then move the multiple up or down for every ten points of growth the target sits above or below that baseline. A related tool is the Rule of 40, where growth rate plus profit margin above forty percent signals a premium business. Margin quality matters as well: gross margin above seventy-five percent supports a software multiple, while sixty percent suggests a services-heavy mix that the market discounts.",
                "Multiples also move with market conditions, and this is the danger of anchoring on them. During the 2021 boom, median public software multiples exceeded fifteen times revenue. By late 2022 they had compressed to roughly six times. A startup that raised at twenty times in 2021 could be worth a third of that on identical operating performance a year later. Multiples are therefore a snapshot of sentiment as much as value. Founders who learned this the hard way now treat a multiple as a range tied to a date, and they pressure-test the result against a DCF to confirm that the implied growth and margins are plausible. A multiple that can only be justified by a DCF with impossible assumptions is a warning sign, not a bargain.",
                "The simulation that follows computes a peer baseline, then applies a growth adjustment of eight tenths of a turn per ten points of growth, with a floor of one times revenue. Run the same four million dollar ARR company at thirty, sixty, and one hundred twenty percent growth and observe how much of the valuation comes from growth alone. You are demonstrating that two companies with identical revenue can differ by a factor of two in value purely because of trajectory. When you present a valuation to an investor, show the peer set, show the adjustment logic, and be ready to explain why your company belongs at the multiple you chose."
            ],
            "example": "In 2021, the cloud security company Wiz reached a valuation above six billion dollars on roughly one hundred million dollars of annual revenue, a multiple near sixty times, justified by growth exceeding several hundred percent a year. Mature security vendors growing at twenty percent traded at under ten times. The gap was almost entirely a growth premium, which is exactly the effect a growth-adjusted multiple tries to capture.",
            "code": CODE_MULT,
            "codeNotes": [
                "Lines 2-6: multiple_valuation shifts the base multiple by `sensitivity` per 10 growth points versus the peer baseline.",
                "Line 7: max(1.0, ...) floors the multiple so a low-growth company is never valued below 1x revenue.",
                "Lines 9-11: the peer baseline uses an average multiple and average growth of three comparables.",
                "Lines 12-14: the same $4.0M ARR is valued at 30%, 60% and 120% growth to isolate the growth premium."
            ],
            "tryIt": "Add a fourth peer with a 15x multiple and 150% growth. Does the baseline move more than you expected? Explain why analysts prefer the median.",
            "check": {
                "question": "Why is a growth adjustment applied to a raw revenue multiple?",
                "options": [
                    "Because revenue is always negative for startups.",
                    "Because investors prefer round numbers.",
                    "Because faster-growing companies reach a much larger revenue base by exit, so the market pays a higher multiple for them.",
                    "Because growth rate has no relationship to company value."
                ],
                "answerIndex": 2,
                "explanation": "Two companies with identical revenue today can be worth very different amounts if one is growing far faster; the market capitalizes that future revenue base into a higher multiple."
            }
        },
        {
            "title": "The Berkus Method & Scorecard Valuation for Pre-Revenue Ventures",
            "say": [
                "Both DCF and revenue multiples fail the same way for a company at the very beginning: there is no revenue to multiply and no credible cash flow to discount. Yet founders still have to raise a first round, and investors still have to put a price on it. Pre-revenue valuation is therefore less about measuring the business and more about measuring how much risk has been removed. Dave Berkus, an angel investor, formalized a simple and widely used answer. His method assigns a fixed dollar value to each of five milestones that reduce a startup's risk, and a founder earns value as each milestone is achieved. It is deliberately crude, and that crudeness is a feature: it cannot be argued into absurd numbers, because every factor has a hard ceiling.",
                "The five Berkus factors are a sound idea, which reduces basic or market risk; a prototype, which reduces technology risk; a quality management team, which reduces execution risk; strategic relationships, which reduces competitive or market-entry risk; and product rollout or sales, which reduces financial or production risk. Each factor can contribute up to five hundred thousand dollars. A startup that scores full marks on all five reaches a pre-money valuation of two and a half million dollars, which is the method's ceiling. Notice what this structure implies: a team with only an idea and good people is worth a few hundred thousand dollars, and the number rises only as concrete evidence appears. The method rewards de-risking, not ambition.",
                "A common refinement is the Scorecard method, developed by Bill Payne. Instead of building a value from scratch, you start from the average pre-money valuation of recently funded pre-revenue companies in the same region and sector, then adjust it with weighted comparison factors. Typical weights are management team around thirty percent, size of opportunity twenty-five percent, product and technology fifteen percent, competitive environment ten percent, marketing and sales channels ten percent, need for additional funding five percent, and other factors five percent. You rate your company against the average on each factor, for example one hundred twenty-five percent for an unusually strong team and eighty percent for a weak competitive position, multiply by the weights, and scale the regional average accordingly.",
                "Both methods encode the same truth about early-stage investing: at this stage the team and the milestones matter far more than any financial projection. Investors know that a spreadsheet forecasting ten million dollars of revenue in year three is a statement of hope, not evidence. What they can observe is whether a technically credible founder has built a working prototype, secured a design partner, or signed a letter of intent. That is why a strong team with a prototype can credibly command a higher valuation than a polished slide deck with none. If you are a founder, the practical implication is to spend your pre-seed months converting risks into evidence, because each retired risk is worth real money at the negotiating table.",
                "Use these methods with humility, because they carry real limitations. The Berkus ceiling of two and a half million dollars reflects older market conditions, and in competitive ecosystems such as Silicon Valley or Bengaluru's current AI scene, pre-seed rounds frequently price above it. The method also gives no credit for a huge market, a flaw the Scorecard partly repairs. Treat the output as a floor for negotiation and a sanity check on what the evidence supports, not as a final answer. The simulation below scores a strong and a weak startup across the five factors so you can see how a missing prototype or an absent rollout costs real valuation dollars in a structured, defensible way."
            ],
            "example": "A two-person climate-hardware team arrives at a pre-seed round with a strong technical founder, a working lab prototype, and a signed pilot letter from a utility, but no sales. Under Berkus they earn near-full credit for idea, prototype, and team, partial credit for relationships, and almost nothing for rollout, producing a pre-money valuation of roughly one and a half to two million dollars. A competitor with only a pitch deck and the same team earns a fraction of that, which is exactly the signal the method is designed to send.",
            "code": CODE_BERKUS,
            "codeNotes": [
                "Lines 2-3: five Berkus factors, each capped at $500,000, give a $2.5M pre-revenue ceiling.",
                "Lines 5-13: berkus() clamps each completion score to 0-1 and converts it into a dollar contribution.",
                "Lines 15-16: 'strong' and 'weak' profiles differ mainly in prototype and rollout progress.",
                "Lines 17-20: output shows per-factor dollars so a founder can see which risk retirement is worth the most."
            ],
            "tryIt": "Raise the weak startup's prototype score from 0.0 to 0.8. How many dollars of valuation does building the prototype add?",
            "check": {
                "question": "What does the Berkus Method primarily reward in a pre-revenue startup?",
                "options": [
                    "The size of the revenue forecast in the pitch deck.",
                    "The number of employees on the payroll.",
                    "The amount of money the founders have personally invested.",
                    "Concrete progress that reduces specific risks: idea, prototype, team, relationships, and rollout."
                ],
                "answerIndex": 3,
                "explanation": "Berkus assigns value to risk reduction milestones, each capped at $500,000, rather than to unproven financial projections."
            }
        },
        {
            "title": "The Venture Capital Method: Working Backward from Exit to Pre-Money",
            "say": [
                "The Venture Capital Method is the one valuation approach that investors actually run in their heads during a pitch, because it starts from the question they care about: what do I need to own today to earn my target return at exit? Instead of projecting the company forward and discounting, it works backward. You estimate what the company could be worth when it is sold or goes public, you decide what multiple of invested capital your fund requires, and you let those two numbers dictate how much of the company you must hold. From the required ownership and the size of your check, the valuation falls out arithmetically. It is simple, fast, and brutally honest about the economics of venture funds.",
                "The mechanics have four steps. First, estimate exit value, typically from a revenue multiple applied to projected revenue in year five to seven. Second, set the target return multiple. Early-stage funds commonly target ten to thirty times their money, because they expect most investments to fail. Third, account for dilution: the company will raise further rounds and issue employee options, so an investor who owns twenty percent today may own only ten percent at exit. The retention ratio, one minus expected dilution, adjusts for this. Fourth, compute required ownership at exit as target multiple times investment divided by exit value, then divide by the retention ratio to get required ownership today. Post-money valuation is the investment divided by required ownership today, and pre-money is post-money minus the investment.",
                "Work through the logic with care, because the numbers reveal why venture investors are so demanding. Suppose a fund invests two million dollars and believes the company can exit at two hundred million. To earn twenty times its money it needs forty million dollars of proceeds, which is twenty percent of the exit. With fifty percent expected dilution it must own forty percent today. A two million dollar investment for forty percent implies a five million dollar post-money and a three million dollar pre-money valuation. A founder expecting a ten million dollar pre-money has just learned that, under this return target, the exit would need to be far larger. The method turns a vague argument about value into a precise argument about the exit.",
                "That precision is also the method's main vulnerability. Every output depends on two guesses: the exit value and the dilution assumption. A modest change in either can swing the valuation by multiples, and exit estimates made at seed stage are speculative by nature. Investors know this and compensate by using high target returns, which build in a margin for the probability of failure. Founders can use the method defensively too. If you can credibly argue for a larger exit, perhaps because the market is bigger or margins are stronger, you can show that the fund's own return target supports a higher valuation. Understanding the investor's arithmetic is the strongest negotiating position you can have, because it lets you debate assumptions rather than feelings.",
                "The simulation below runs the method for target returns of ten, twenty, and thirty times on the same two hundred million dollar exit. Observe how a more demanding return target reduces the valuation the investor is willing to accept, and see how required ownership today moves in the opposite direction. This is the structural tension at the heart of every term sheet negotiation: the investor's required return and the founder's desired valuation are two sides of one equation. Once you can solve that equation yourself in a minute, you will never again be surprised by an offer, because you will know which assumption the investor is leaning on."
            ],
            "example": "A seed fund evaluating a logistics-software startup reasoned that a successful exit would be around three hundred million dollars, required twenty times its money, and expected fifty percent dilution before exit. Working backward, it concluded that a three million dollar check needed to buy roughly forty percent of the company, implying a post-money of seven and a half million and a pre-money of four and a half million dollars. The founders had asked for fifteen million, and the gap was resolved only when they produced evidence supporting a much larger exit.",
            "code": CODE_VC,
            "codeNotes": [
                "Lines 2-5: retention = 1 - dilution; required exit ownership = target multiple x investment / exit value.",
                "Line 6: dividing by retention converts exit ownership into the ownership needed today.",
                "Lines 7-8: post-money = investment / ownership today; pre-money = post-money - investment.",
                "Lines 17-19: sweeping target multiples 10x/20x/30x shows how return demands compress the valuation."
            ],
            "tryIt": "Change expected_dilution_pct from 50 to 70. Predict first, then verify: does required ownership today rise or fall, and what happens to pre-money?",
            "check": {
                "question": "In the Venture Capital Method, what is the effect of raising the investor's target return multiple, holding exit value constant?",
                "options": [
                    "The investor must own more of the company today, so the valuation they will accept falls.",
                    "The investor can accept a higher valuation because the return is larger.",
                    "Nothing changes, because exit value alone determines valuation.",
                    "The company's exit value automatically increases."
                ],
                "answerIndex": 0,
                "explanation": "A higher return target requires a larger ownership share to hit the target proceeds, which means a smaller post-money and pre-money valuation for the same investment."
            }
        },
        {
            "title": "Valuation Triangulation Control Tower: Reconciling Four Methods into One Defensible Range",
            "say": [
                "No single valuation method is trustworthy on its own, and the professionals who value startups for a living never rely on one. They triangulate. They run several independent methods, compare the results, and treat the overlap as the credible range. This is the same logic a surveyor uses to locate a point from three bearings: any one measurement may be off, but agreement between independent measurements is strong evidence. In valuation the equivalent is the football field chart, a horizontal bar chart showing the range each method produces. Where the bars overlap, confidence is high. Where one bar sits far away from the others, something is wrong with that method's assumptions or that method does not apply to the company's stage.",
                "Triangulation requires you to match methods to the stage of the company, because applying a revenue method to a pre-revenue business is a category error. Berkus and Scorecard are appropriate before revenue and act as a ceiling on early valuations. Revenue multiples become meaningful once recurring revenue exists and a growth rate can be measured. DCF is most useful when cash flow forecasts are at least semi-credible, usually from Series B onward, and the Venture Capital Method applies whenever an investor can articulate a plausible exit. A disciplined analyst therefore excludes methods that do not fit the stage rather than averaging everything blindly. Averaging a Berkus pre-revenue ceiling with a growth-stage DCF produces a number that is wrong for both.",
                "Once you have estimates, the control tower tests them with a few simple statistics. Compute the mean to see the center of gravity, but also compute a trimmed anchor by discarding the highest and lowest estimates, which protects you from a single method distorted by an extreme assumption. Then measure the spread, defined as the range divided by the mean. A spread under about sixty percent among applicable methods signals that the assumptions broadly agree. A spread of two hundred percent signals that two methods are telling incompatible stories, and the useful response is to investigate which assumption, usually the discount rate, exit multiple, or growth rate, is driving the disagreement rather than simply choosing the number you prefer.",
                "This discipline matters most in negotiation. When a founder walks into a meeting with one method and one number, the investor can attack the single assumption holding it up. When the founder presents four methods whose ranges overlap, the conversation shifts from whether the valuation is defensible to where within the range the deal should land. Conversely, if you are an investor, a company whose methods disagree wildly is not necessarily a bad investment, but it is one whose value rests on a contested assumption you should understand before you wire money. Triangulation turns valuation from a debate about a number into a structured examination of the assumptions behind it.",
                "The control tower below runs all four methods on one illustrative company, reports each estimate, calculates the mean, trimmed anchor and spread, and then applies the stage-appropriate filter: the Berkus ceiling is shown for reference but excluded from the revenue-stage agreement test. Read the output as an investment committee would. Ask which method is the outlier, which assumption most plausibly explains the gap, and what evidence would close it. A valuation you can defend method by method, with the disagreements explained, is worth more in a negotiation than any single clever number. Finish by writing the range down with the assumption that would move it most, because a founder who can name their weakest assumption is far more credible than one who claims to have none, and credibility is what ultimately moves a term sheet."
            ],
            "example": "When Instacart reduced its internal valuation from thirty-nine billion dollars to roughly twelve billion dollars in 2022, it was in effect acknowledging that its revenue-multiple and market-comparable methods had moved far below its last venture round. The gap between a sentiment-driven private mark and what comparable public multiples supported was the signal that triangulation is designed to surface early, before it becomes a public markdown.",
            "code": CODE_TOWER,
            "codeNotes": [
                "Lines 2-14: four small functions implement DCF, revenue multiple, Berkus and the VC method independently.",
                "Lines 16-21: the estimates dict collects each method's dollar value for one illustrative company.",
                "Lines 22-26: mean, trimmed anchor (drop min and max) and spread = (max-min)/mean summarize agreement.",
                "Lines 31-34: Berkus is excluded from the agreement test because it is a pre-revenue ceiling, not a revenue-stage peer."
            ],
            "tryIt": "Change the revenue multiple from 7.5 to 15 and rerun. Does the spread breach the 60% tolerance? Which assumption would you challenge first?",
            "check": {
                "question": "Why does a disciplined analyst exclude the Berkus pre-revenue ceiling from the agreement test of revenue-stage methods?",
                "options": [
                    "Because Berkus always produces the highest value.",
                    "Because Berkus is illegal for companies with employees.",
                    "Because averaging methods is never allowed.",
                    "Because applying a pre-revenue method to a revenue-stage company is a category error that would distort the comparison."
                ],
                "answerIndex": 3,
                "explanation": "Each method fits a specific stage. Mixing a pre-revenue ceiling into revenue-stage methods produces a blended number that is wrong for both."
            }
        },
    ]

    for p in parts:
        p["output"] = run_snippet(p["code"])

    return {
        "day": 11,
        "title": "Startup Valuation Methodologies: DCF, Revenue Multiples & Berkus Method",
        "goal": "Value a startup defensibly: build a venture DCF with sensible discount rates, apply growth-adjusted revenue multiples, price pre-revenue risk with Berkus, solve the Venture Capital Method backward from exit, and triangulate all four into one credible range.",
        "minutes": 45,
        "recap": "Milestone 2 gave you a complete Business Model Canvas. Milestone 3 moves from designing a business to pricing it, structuring ownership, aligning the team, and running operations. Day 11 starts with the question every founder must answer before raising capital: what is this company worth, and how do you defend that number?",
        "parts": parts,
        "summary": [
            "Built a venture DCF with explicit forecasts and Gordon-growth terminal value, and measured how strongly the result depends on discount rate and terminal share.",
            "Applied growth-adjusted revenue multiples using a comparable set and explained why median peers and growth premiums matter.",
            "Scored pre-revenue ventures with the Berkus Method's five risk-reduction factors and the Scorecard approach.",
            "Solved the Venture Capital Method backward from exit value, target multiple, and dilution to derive pre-money and post-money valuation.",
            "Triangulated four methods into one range using mean, trimmed anchor, and spread, applying stage-appropriate method selection."
        ],
        "projectStep": {
            "title": "Produce a Defensible Valuation Range for Your Venture",
            "steps": [
                "Forecast five years of free cash flow and run a DCF at three discount rates.",
                "Select six comparable companies and derive a growth-adjusted revenue multiple.",
                "Score your venture on the five Berkus factors and note which risks are still open.",
                "Run the Venture Capital Method for 10x, 20x and 30x target returns.",
                "Triangulate the methods, report the spread, and write one paragraph defending your range."
            ]
        },
    }


if __name__ == "__main__":
    data = get_day11_data()
    print(f"Generated Day 11: {data['title']}")
    words = [sum(len(s.split()) for s in p["say"]) for p in data["parts"]]
    print(f"Parts word counts: {words} (Total: {sum(words)})")
    for i, p in enumerate(data["parts"]):
        print(f"--- Part {i+1} output ---")
        print(p["output"])
    for i, w in enumerate(words):
        assert w >= 580, f"Part {i+1} has {w} words (< 580)"
    assert sum(words) >= 2950
    print("PASS: Day 11 invariants OK")
