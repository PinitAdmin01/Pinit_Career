#!/usr/bin/env python3
"""
Day 12 Builder: Founder Equity Vesting, IP Assignment & Shareholders' Agreements (SHA)
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


CODE_VEST = r'''# Founder vesting: 4-year schedule, 1-year cliff, monthly thereafter, with acceleration
TOTAL_SHARES = 4_000_000
VEST_MONTHS = 48
CLIFF_MONTHS = 12

def vested_shares(months_served, acceleration=0.0):
    # acceleration = fraction of the UNVESTED remainder that vests immediately
    if months_served < CLIFF_MONTHS:
        base = 0.0
    else:
        base = min(months_served, VEST_MONTHS) / VEST_MONTHS
    total_fraction = base + (1 - base) * acceleration
    return int(TOTAL_SHARES * total_fraction)

for m in (6, 12, 18, 30, 48):
    v = vested_shares(m)
    print(f"month {m:>2}: vested={v:>9,} ({v / TOTAL_SHARES:.1%}) unvested={TOTAL_SHARES - v:>9,}")

# Double-trigger acceleration: acquisition AND termination within 12 months -> 100% of remainder
left_at = 20
print("departure at month 20, no acceleration:", f"{vested_shares(left_at):,}")
print("departure at month 20, double-trigger  :", f"{vested_shares(left_at, acceleration=1.0):,}")
'''

CODE_IP = r'''# IP chain-of-title audit: every contributor needs a signed assignment that predates their work
contributors = [
    {"name": "Founder A", "assignment_signed": "2024-01-10", "work_started": "2024-01-15", "prior_inventions_listed": True},
    {"name": "Founder B", "assignment_signed": "2024-03-02", "work_started": "2024-01-15", "prior_inventions_listed": True},
    {"name": "Contractor C", "assignment_signed": None, "work_started": "2024-05-01", "prior_inventions_listed": False},
    {"name": "Employee D", "assignment_signed": "2024-06-01", "work_started": "2024-06-01", "prior_inventions_listed": True},
]

def audit(contribs):
    issues = []
    for c in contribs:
        if c["assignment_signed"] is None:
            issues.append((c["name"], "NO_ASSIGNMENT"))
        elif c["assignment_signed"] > c["work_started"]:
            issues.append((c["name"], "ASSIGNMENT_AFTER_WORK_STARTED"))
        if not c["prior_inventions_listed"]:
            issues.append((c["name"], "NO_PRIOR_INVENTIONS_SCHEDULE"))
    return issues

problems = audit(contributors)
for who, why in problems:
    print(f"GAP: {who} -> {why}")
clean = len({who for who, _ in problems})
print(f"contributors with gaps: {clean}/{len(contributors)}")
print("diligence status:", "CHAIN_OF_TITLE_CLEAN" if not problems else "CHAIN_OF_TITLE_REMEDIATION_REQUIRED")
'''

CODE_SHA = r'''# Shareholders' Agreement: who can block a special resolution (75%) or trigger a drag-along (75%)?
cap_table = {"Founder A": 30.0, "Founder B": 25.0, "Seed Fund": 25.0, "Angel": 10.0, "ESOP pool": 10.0}
SPECIAL = 75.0

def blocking_holders(table, threshold):
    # a holder can block if the OTHERS cannot reach the threshold without them
    return [name for name, pct in table.items() if 100.0 - pct < threshold]

voting = {k: v for k, v in cap_table.items() if k != "ESOP pool"}  # unexercised options do not vote
total_vote = sum(voting.values())
normalised = {k: v / total_vote * 100.0 for k, v in voting.items()}
for name, pct in normalised.items():
    print(f"{name}: {pct:.1f}% of voting shares")
print("can block special resolution:", blocking_holders(normalised, SPECIAL))
founders = normalised["Founder A"] + normalised["Founder B"]
print(f"founders together: {founders:.1f}% -> can pass special resolution alone: {founders >= SPECIAL}")
with_fund = founders + normalised["Seed Fund"]
print(f"founders + seed fund: {with_fund:.1f}% -> can trigger drag-along: {with_fund >= SPECIAL}")
'''

CODE_LEAVER = r'''# Good leaver vs bad leaver: what the company can repurchase, and at what price
def leaver_settlement(vested, unvested, fmv_per_share, cost_per_share, leaver_type):
    # unvested shares always lapse back to the company at cost
    unvested_price = cost_per_share
    if leaver_type == "GOOD":
        vested_price = fmv_per_share
    elif leaver_type == "BAD":
        vested_price = min(fmv_per_share, cost_per_share)
    else:
        raise ValueError("leaver_type must be GOOD or BAD")
    return {
        "vested_payout": round(vested * vested_price),
        "unvested_payout": round(unvested * unvested_price),
        "vested_price_per_share": vested_price,
    }

vested, unvested = 1_500_000, 2_500_000
for kind in ("GOOD", "BAD"):
    r = leaver_settlement(vested, unvested, fmv_per_share=2.40, cost_per_share=0.01, leaver_type=kind)
    total = r["vested_payout"] + r["unvested_payout"]
    print(f"{kind} leaver: price/share=${r['vested_price_per_share']} vested=${r['vested_payout']:,} unvested=${r['unvested_payout']:,} total=${total:,}")
'''

CODE_TOWER = r'''# Founder-governance control tower: vesting, IP title, SHA protections and leaver terms must all pass
checks = {}

# 1) Vesting terms
terms = {"vest_months": 48, "cliff_months": 12, "founder_vested_at_close_pct": 0}
checks["vesting_standard"] = (
    terms["vest_months"] >= 36 and 6 <= terms["cliff_months"] <= 12 and terms["founder_vested_at_close_pct"] <= 25
)

# 2) IP chain of title
assignments = [("A", True), ("B", True), ("C", True), ("D", True)]
checks["ip_chain_complete"] = all(signed for _, signed in assignments)

# 3) SHA protections present
required_clauses = {"reserved_matters", "rofr", "tag_along", "drag_along", "anti_dilution", "board_seats"}
present = {"reserved_matters", "rofr", "tag_along", "drag_along", "anti_dilution", "board_seats"}
checks["sha_clauses_complete"] = required_clauses <= present

# 4) Leaver terms defined and unvested lapses at cost
leaver = {"good_leaver_defined": True, "bad_leaver_defined": True, "unvested_lapses_at_cost": True}
checks["leaver_terms_defined"] = all(leaver.values())

for name, ok in checks.items():
    print(f"{name}: {'PASS' if ok else 'FAIL'}")
status = "FOUNDER_GOVERNANCE_CERTIFIED" if all(checks.values()) else "FOUNDER_GOVERNANCE_GAPS"
print("status:", status)
'''


def get_day12_data() -> Dict[str, Any]:
    parts = [
        {
            "title": "Founder Vesting: Cliffs, Schedules & Acceleration Triggers",
            "say": [
                "Most founders believe that the shares they receive at incorporation are theirs, permanently and unconditionally, and that vesting is something that happens to employees. This belief is one of the most expensive misunderstandings in entrepreneurship. Vesting is the mechanism by which ownership is earned over time rather than granted all at once, and sophisticated investors will almost always require it of the founders themselves. The logic is straightforward. An investor is betting on a team's future work, not on its past. If a founder holds a fifty percent stake from day one and walks away after six months, that founder keeps half the company while contributing nothing further, and the remaining team must carry the business with their equity permanently diluted by someone who is no longer there. This is called dead equity, and it can make a company uninvestable.",
                "The standard structure is a four-year vesting schedule with a one-year cliff. Under this arrangement the founder's shares are subject to a repurchase right held by the company. During the first twelve months nothing vests at all. On the first anniversary, the cliff, twenty-five percent vests at once. After that, the remaining seventy-five percent vests in equal monthly installments over the following thirty-six months. If a founder leaves before the cliff, they receive nothing; if they leave at month thirty, they keep thirty forty-eighths of their shares and the company can repurchase the unvested remainder, usually at the original purchase price, which is often a fraction of a cent per share. The cliff exists to filter out the early departures that would otherwise leave small but nuisance shareholders on the cap table.",
                "Founders sometimes object that vesting is an insult to people who have already invested months of unpaid work. The answer is that a well-designed schedule accounts for that history through credit for prior service. A founder who has worked for eight months before incorporation can negotiate that those eight months count toward vesting, so that perhaps twenty percent is already earned at signing. Investors generally accept some credit, but rarely full credit, because they want the founders' remaining commitment to be meaningful. A typical outcome is that founders enter the financing with zero to twenty-five percent vested, and the vesting clock is restarted or re-papered at the time of the first priced round. Resist the temptation to see this as a negotiation you lose; it protects every founder in the room from every other founder.",
                "Acceleration clauses determine what happens to unvested shares when the company is acquired. Single-trigger acceleration vests some or all unvested shares upon the acquisition alone. This is attractive to founders but unattractive to acquirers, who want the team to stay and often reduce their offer when the key people are already fully vested and free to leave. Double-trigger acceleration is the market norm: shares accelerate only if two events occur, namely a change of control and the founder's termination without cause or resignation for good reason within a defined window, typically twelve months. This protects founders from being acquired and then fired to recapture their unvested stock, while still giving the acquirer retention leverage. Understanding the difference is essential, because the two clauses can change the value of a founder's stake by millions of dollars.",
                "There is also a tax dimension that founders in many jurisdictions ignore at their peril. In the United States, a founder who receives restricted stock should usually file an election under Section 83(b) within thirty days of the grant, paying tax on the then-trivial value of the shares rather than on their value as they vest later. Missing that thirty-day window can convert a harmless paperwork task into a six-figure tax liability, and the window cannot be reopened. Other countries have their own equivalents and their own traps, so take local advice before issuing founder stock. The simulation below implements the standard schedule and compares a departure at month twenty with and without double-trigger acceleration, so you can see exactly how many shares are at stake in each scenario."
            ],
            "example": "When two co-founders of a consumer app split equally with no vesting, one left after nine months to join a larger company. The remaining founder was left running the business while the departed co-founder still held fifty percent. Every investor who looked at the company asked for the departed founder to be bought out or their shares reduced, and the company lost most of a year and a large part of its seed round resolving a problem that a four-year vesting schedule would have prevented.",
            "code": CODE_VEST,
            "codeNotes": [
                "Lines 2-4: 4,000,000 founder shares vest over 48 months with a 12-month cliff.",
                "Lines 6-13: vested_shares returns 0 before the cliff, then months/48; acceleration vests a fraction of the remainder.",
                "Lines 15-17: the loop prints vested vs unvested shares at months 6, 12, 18, 30 and 48.",
                "Lines 19-22: double-trigger acceleration (100% of the remainder) is compared with no acceleration at month 20."
            ],
            "tryIt": "Change CLIFF_MONTHS to 6 and rerun. Which rows change, and who benefits from a shorter cliff?",
            "check": {
                "question": "Why is double-trigger acceleration the market norm instead of single-trigger?",
                "options": [
                    "It protects founders from being acquired and then fired to recapture their unvested stock, while still giving the acquirer retention leverage.",
                    "It vests all shares the moment a term sheet is signed.",
                    "It removes the need for a vesting schedule entirely.",
                    "It is required by every company law statute."
                ],
                "answerIndex": 0,
                "explanation": "Double-trigger needs both a change of control and a qualifying termination, balancing founder protection against the acquirer's need to keep the team."
            }
        },
        {
            "title": "IP Assignment: Chain of Title, Invention Assignment & Prior Inventions",
            "say": [
                "A startup is, in most cases, a bundle of intellectual property wrapped in a corporate shell. The code, the designs, the brand, the datasets, and the processes are the assets an acquirer or investor is actually paying for. Yet those assets frequently belong, legally, to someone other than the company. The default rule in most jurisdictions is that the person who creates a work owns it, and that ownership transfers to a company only through a written agreement or through employment under specific conditions. A founder who writes the first version of the product on a weekend before the company exists owns that code personally. A freelance designer who builds the logo owns the copyright unless a signed document says otherwise. Discovering this during investor due diligence is common and, depending on the circumstances, can delay or kill a financing.",
                "The solution is a Proprietary Information and Inventions Assignment Agreement, usually called a PIIA or an invention assignment agreement, signed by every founder, employee, and contractor who contributes anything to the product. It does three things. It assigns to the company all rights in work product created for the company, including inventions, code, and designs. It imposes confidentiality obligations to protect trade secrets. And it includes a schedule in which the person lists any prior inventions they are excluding from the assignment. That final schedule matters more than founders expect. A clean schedule that says none, or that precisely identifies a small open-source side project, is far better than silence, because silence leaves the question open and invites an expensive argument later.",
                "Diligence lawyers verify what is known as the chain of title. They trace each piece of intellectual property from its original creator to the company, confirming at every step that a signed assignment exists and that it covers the work in question. The two most common failures are timing and omission. A timing failure occurs when someone signs the assignment after they began working, which leaves a gap period during which they may still own what they built, so the agreement needs retroactive language assigning past work. An omission failure occurs when a contractor, an advisor, a university collaborator, or an early part-time contributor never signed anything. Each gap is a potential claim by a person who may no longer be friendly and who may now see a valuable company.",
                "Special care is needed with employers and universities. Many employment contracts, particularly in technology firms and research institutions, assign to the employer any invention related to the employer's business, sometimes even those made outside working hours. A founder who writes the core algorithm while still employed by a larger company, or while using university laboratory resources, may find that the former employer or university claims the technology. Founders should review their employment agreements before writing a single line of product code, and should obtain written releases where there is any doubt. A release obtained at the beginning costs very little. The same release requested after the company has raised money costs far more and sometimes cannot be obtained at all.",
                "Open-source software introduces a different class of risk. Using code licensed under a strong copyleft license such as the GPL in a proprietary product can obligate the company to release its own source code under the same terms. A company that has built its product on top of such code without understanding the obligation may face a demand to open its entire codebase, or a costly rewrite. Maintain a software bill of materials listing each third-party component and its license. The simulation below audits a small set of contributors for the two classic failures, missing assignments and assignments signed after work began, and reports a clear diligence status, mimicking the first screen an investor's lawyer will run."
            ],
            "example": "A health-technology startup in late-stage due diligence discovered that its core data-processing module had been written by a freelance engineer who never signed an assignment. The engineer, by then working at a competitor, demanded a six-figure payment to sign. The acquirer reduced its offer and delayed closing by two months while the startup negotiated, a cost that a one-page agreement signed on the engineer's first day would have avoided.",
            "code": CODE_IP,
            "codeNotes": [
                "Lines 2-7: four contributors with assignment dates, work start dates and prior-invention schedule flags.",
                "Lines 9-19: audit flags NO_ASSIGNMENT, ASSIGNMENT_AFTER_WORK_STARTED and NO_PRIOR_INVENTIONS_SCHEDULE.",
                "Lines 21-24: ISO date strings compare correctly with >, so late-signed assignments are detected.",
                "Lines 25-26: the status string mirrors the pass/fail screen an investor's counsel would run."
            ],
            "tryIt": "Set Contractor C's assignment_signed to '2024-05-01' and prior_inventions_listed to True. Which gaps remain, and what does the status become?",
            "check": {
                "question": "What is the chain-of-title problem with an assignment signed after the contributor started working?",
                "options": [
                    "Assignments can only be signed on the first day of a quarter.",
                    "It creates a gap period in which the contributor may still own the work, unless the agreement also assigns past work retroactively.",
                    "It automatically invalidates the company's incorporation.",
                    "It transfers ownership to the company's investors."
                ],
                "answerIndex": 1,
                "explanation": "Work created before the assignment may still be owned by the creator; a retroactive assignment clause closes that gap."
            }
        },
        {
            "title": "Shareholders' Agreements: Reserved Matters, Blocking Rights, Tag-Along & Drag-Along",
            "say": [
                "The articles of incorporation tell you the minimum a company must do to exist. The Shareholders' Agreement, or SHA, tells you how the people who own it have agreed to behave. It is a private contract among the shareholders and the company, and it governs the things that matter most when relationships are under stress: who controls the board, which decisions need consent, what happens when someone wants to sell, and how a deadlock is resolved. Founders who skip careful SHA drafting in the early days frequently regret it, because the agreement is easiest to negotiate when everyone is optimistic and expensive to renegotiate when they are not. It is also the document investors scrutinize most closely, because it defines their protections in practice.",
                "The central concept is the reserved matters list. These are decisions the company cannot take without the prior consent of a specified shareholder or class, regardless of how the ordinary vote would go. Typical reserved matters include issuing new shares, changing the articles, taking on debt above a threshold, selling the business or its key assets, approving the annual budget, hiring or firing senior executives, paying dividends, and entering transactions with related parties. An investor holding a minority stake usually cannot win a simple majority vote, but a reserved-matters right gives them a veto over decisions that could damage their investment. Founders should negotiate the list carefully: a long list effectively hands operating control to the investor, while a short and focused list protects them without paralyzing management.",
                "Thresholds for passing resolutions matter just as much. Ordinary resolutions need a simple majority, but special resolutions, used for changing the constitution or approving major transactions, typically need seventy-five percent. This creates a blocking minority, since any holder of more than twenty-five percent of the voting shares can prevent a special resolution from passing. Founders who split a company three ways, or who bring in an investor holding twenty-six percent, may unwittingly hand that holder a veto they did not intend. The simulation below calculates exactly who can block a special resolution on a realistic cap table, a calculation that should be run before any term sheet is signed, because ownership percentages and control rights are related but not identical.",
                "Exit mechanics are governed by two mirror-image clauses. Tag-along, also called co-sale, protects minority shareholders: if the majority sells, the minority has the right to sell on the same terms, so they cannot be left behind with a new and possibly unwelcome controlling owner. Drag-along protects the majority and the buyer: if holders of a specified percentage, often seventy-five percent, agree to sell the whole company, they can compel all other shareholders to sell on the same terms. Without drag-along, a single small holder can block an acquisition, and sophisticated buyers will refuse to proceed unless one hundred percent of the shares can be delivered. Together these clauses make a company saleable while protecting minority holders from being treated worse than the majority.",
                "Other standard provisions round out the agreement. The right of first refusal gives existing shareholders or the company the first opportunity to buy shares a holder wants to sell, preventing strangers from entering the cap table. Pre-emption rights allow shareholders to maintain their percentage in future issues. Anti-dilution protection adjusts the investor's conversion price if the company later sells shares at a lower valuation. Board composition clauses specify how many seats each group appoints. Deadlock provisions, sometimes involving a shotgun buy-sell mechanism, provide an exit when two equal holders cannot agree. Read every clause as a transfer of control or of economics between parties, and you will understand the agreement far better than by treating it as legal boilerplate."
            ],
            "example": "A founding team gave a seed fund twenty-six percent of the voting shares without thinking about thresholds. When the team later wanted to approve a restructuring that required a seventy-five percent special resolution, the fund declined to support it and, because it held more than twenty-five percent, simply blocked it. The founders held a majority of the company and still could not change its structure, a consequence they had never modeled.",
            "code": CODE_SHA,
            "codeNotes": [
                "Lines 2-3: a five-holder cap table including a 10% ESOP pool and a 75% special-resolution threshold.",
                "Lines 5-7: a holder can block if the other holders combined cannot reach the threshold without them.",
                "Lines 9-12: unexercised ESOP options are excluded from voting, so percentages are renormalised.",
                "Lines 15-19: founders alone vs founders + seed fund are tested against the 75% special-resolution and drag-along bar."
            ],
            "tryIt": "Change the Angel holding to 5 and the Seed Fund to 30, then rerun. Who can block a special resolution now?",
            "check": {
                "question": "What is the practical effect of a 75% special-resolution threshold on a holder with just over 25% of the voting shares?",
                "options": [
                    "It forces that holder to sell their shares.",
                    "It gives that holder no additional rights.",
                    "It lets that holder block any special resolution, because the other holders cannot reach 75% without them.",
                    "It lets that holder pass resolutions alone."
                ],
                "answerIndex": 2,
                "explanation": "If the others hold less than 75% in total, the minority holder is a blocking minority regardless of how the rest vote."
            }
        },
        {
            "title": "Good Leaver, Bad Leaver & Repurchase Economics",
            "say": [
                "Every founding team eventually faces a departure, and the way the agreement handles that moment determines whether it is a manageable transition or a destructive fight. Leaver provisions are the clauses that decide what a departing shareholder keeps and what they must give back, and at what price. They exist because equity is meant to reward continued contribution. When someone stops contributing, the agreement needs a fair and predetermined way to retrieve some or all of their shares, so the remaining team and the investors are not left with an inactive owner. Resolving this on the day of a bitter dispute is nearly impossible; resolving it in advance, while everyone is on good terms, is straightforward.",
                "The most common framework divides departures into good leavers and bad leavers. A good leaver is someone who departs for reasons the parties regard as legitimate: death, serious illness or disability, redundancy, wrongful dismissal, or sometimes simple retirement after a long period of service. A bad leaver is someone who departs in circumstances the parties regard as culpable: resignation within an early period, dismissal for cause such as fraud or gross misconduct, breach of restrictive covenants, or joining a competitor. The categories are defined in the agreement, and the definitions are the most heavily negotiated language in the document, because they determine economic outcomes worth very large amounts of money. Vague wording invites litigation over whether a particular departure counts as good or bad.",
                "The economic consequences differ sharply. A good leaver typically keeps the shares that have already vested and may be paid fair market value if the company or other shareholders buy them back. A bad leaver typically sees the vested shares repurchased at the lower of their cost or fair market value, which can mean a near-total forfeiture, and in the most punitive agreements the entire holding is forfeited. Unvested shares, in either case, generally lapse back to the company at the original purchase price. Some agreements use an intermediate category, an intermediate leaver, who recovers something between cost and fair value. The structure is intentionally asymmetric, to discourage damaging departures and to reward those who leave on acceptable terms.",
                "Courts and counsel pay close attention to how severe these provisions are. A forfeiture clause that is wildly disproportionate to the harm caused may be challenged as a penalty and held unenforceable in some jurisdictions. For that reason a well-drafted agreement ties the discount to a clear and defensible principle, for example, tying the repurchase price to the vested percentage or to the period served before departure. Founders should also consider what happens to the repurchased shares. They may be cancelled, returned to the option pool for new hires, or offered to remaining shareholders, and each choice has different effects on the cap table, on control percentages, and on the funds the company must find to pay for the purchase.",
                "Payment mechanics are the part most often overlooked. A company that owes millions of dollars to a departing founder at fair market value may be unable to pay in cash without damaging its runway. Agreements therefore commonly allow payment in installments, subject to the company's financial capacity, or permit the repurchase to be funded by other shareholders. The simulation below compares the payout to a good leaver and to a bad leaver who each hold the same number of vested and unvested shares, with a fair market value of two dollars and forty cents per share and an original cost of one cent. The difference between the two outcomes is large enough that no founder should sign without understanding which category they would fall into."
            ],
            "example": "A founder who had vested thirty-eight percent of his holding resigned after a disagreement and joined a competitor eight weeks later. The agreement classified resignation to join a competitor as bad-leaver conduct, so the company repurchased his vested shares at cost, a tiny fraction of their market value. The founder challenged the clause, but it was upheld because the terms had been clearly defined and the price was tied to a stated principle.",
            "code": CODE_LEAVER,
            "codeNotes": [
                "Lines 2-14: unvested shares always lapse at cost; vested shares are bought at FMV (good) or min(FMV, cost) (bad).",
                "Line 16: invalid leaver types raise ValueError, so mis-classified departures cannot silently pass.",
                "Lines 19-20: the same 1.5M vested / 2.5M unvested holding is evaluated under both classifications.",
                "Lines 21-23: the printed totals show the economic gap created purely by how the departure is classified."
            ],
            "tryIt": "Change cost_per_share to 1.00 and rerun. How does the bad-leaver payout change, and why does min(FMV, cost) matter?",
            "check": {
                "question": "Under a typical bad-leaver clause, at what price are the departing holder's vested shares repurchased?",
                "options": [
                    "At the highest valuation achieved in any funding round.",
                    "At the lower of cost or fair market value.",
                    "At double fair market value.",
                    "They are never repurchased."
                ],
                "answerIndex": 1,
                "explanation": "Bad-leaver clauses typically repurchase vested shares at the lower of original cost and fair market value, creating a strong deterrent against damaging departures."
            }
        },
        {
            "title": "Founder Governance Control Tower: Vesting, IP Title, SHA Protections & Leaver Terms",
            "say": [
                "The previous four sections each address a different way that founder relationships and company assets can fail. Vesting protects against dead equity. IP assignment protects against clouded ownership of the product. The Shareholders' Agreement protects against deadlock and unwanted exits. Leaver provisions protect against destructive departures. Taken individually each is manageable, but investors do not look at them individually. In legal due diligence they check all four together, because a gap in any one can undermine a financing. A company with perfect vesting but an unsigned contractor assignment is not clean. A company with a beautiful SHA but no defined leaver terms has left its most dangerous scenario undefined. This section assembles the four checks into a single gate that mirrors how counsel reviews a deal.",
                "Think of the control tower as a pre-flight checklist for a financing. The first check confirms that the founders' vesting terms are market-standard: a schedule of at least thirty-six months, a cliff between six and twelve months, and no more than a quarter of the founders' shares vested at the time of the investment. The second check confirms that the intellectual property chain is complete, with a signed assignment from every person who contributed to the product. The third check confirms that the Shareholders' Agreement contains the standard protective clauses: reserved matters, a right of first refusal, tag-along, drag-along, anti-dilution protection, and defined board composition. The fourth confirms that leaver terms exist, that good and bad leavers are defined, and that unvested shares lapse at cost.",
                "The design principle behind a gate like this is that each failure is binary and each has a known remedy. A missing assignment is fixed by obtaining a signed agreement with retroactive assignment of past work. A missing vesting schedule is fixed by re-papering founder stock with a repurchase right, ideally before the round rather than as a closing condition. A missing clause in the SHA is fixed by an amendment. A lack of leaver definitions is fixed by negotiating them while the team is friendly. Because the remedies are cheap early and expensive late, running this checklist before approaching investors is one of the highest-return uses of a founder's time and a small legal budget.",
                "Founders should also understand why investors care so intensely about these matters, because that understanding changes how the negotiation feels. An investor in a seed round is making a bet that a particular team will build a particular product over several years. Everything in this lesson reduces the probability that the bet is lost for non-business reasons: a founder leaving with a large unvested stake, a contractor claiming the code, a minority holder blocking a sale, or a legal dispute over who is entitled to what. When a founder arrives with these items already resolved, the investor reads it as evidence of discipline, and that impression carries into every later conversation about valuation and terms.",
                "The simulation below implements the four checks and prints a pass or fail for each, followed by an overall status. Treat it as a template you would adapt to your own documents, replacing the sample values with the real ones. Then modify a single input at a time, such as leaving one contractor unsigned or removing the drag-along clause, and watch the status change. The goal is to build the instinct that governance quality is measurable and testable, and that the time to find a gap is long before a lawyer on the other side of the table finds it for you."
            ],
            "example": "When a well-known consumer-technology company prepared for its IPO, its counsel ran an exhaustive chain-of-title and governance review and found that several early contributors had never signed assignments. The company spent weeks locating those individuals and obtaining confirmatory assignments, some in exchange for small payments, so the registration could proceed. A checklist at incorporation would have cost almost nothing.",
            "code": CODE_TOWER,
            "codeNotes": [
                "Lines 4-8: vesting_standard requires >= 36 months, a 6-12 month cliff and <= 25% vested at close.",
                "Lines 10-12: ip_chain_complete requires every contributor to have a signed assignment.",
                "Lines 14-17: sha_clauses_complete checks that all six required clauses are a subset of those present.",
                "Lines 19-27: leaver terms are verified and the overall FOUNDER_GOVERNANCE_CERTIFIED status is printed."
            ],
            "tryIt": "Change one assignment to ('C', False) and remove 'drag_along' from present. Which checks fail and what is the status?",
            "check": {
                "question": "Why should a founder run a governance checklist before approaching investors?",
                "options": [
                    "Because investors only invest in companies without legal documents.",
                    "Because checklists replace the need for any lawyers.",
                    "Because gaps are cheap to fix early and expensive or deal-threatening to fix during diligence.",
                    "Because it increases the founders' vesting percentage."
                ],
                "answerIndex": 2,
                "explanation": "Missing assignments, vesting terms or SHA clauses are routine fixes before a round but can delay or reprice a deal when found during diligence."
            }
        },
    ]

    for p in parts:
        p["output"] = run_snippet(p["code"])

    return {
        "day": 12,
        "title": "Founder Equity Vesting, IP Assignment & Shareholders' Agreements (SHA)",
        "goal": "Protect a startup's ownership structure: design founder vesting with cliffs and double-trigger acceleration, secure a clean IP chain of title, understand SHA reserved matters and blocking rights, and price good-leaver versus bad-leaver outcomes.",
        "minutes": 45,
        "recap": "Day 11 priced the company. Day 12 protects what you just priced: who actually owns the equity, who owns the intellectual property, who controls decisions, and what happens when a founder leaves.",
        "parts": parts,
        "summary": [
            "Modeled a 4-year vesting schedule with a 1-year cliff and compared single- and double-trigger acceleration.",
            "Audited an IP chain of title for missing and late-signed invention assignments.",
            "Calculated blocking minorities and drag-along thresholds on a realistic cap table under a 75% special-resolution rule.",
            "Compared good-leaver and bad-leaver repurchase economics for identical holdings.",
            "Combined vesting, IP, SHA and leaver checks into a single founder-governance gate."
        ],
        "projectStep": {
            "title": "Run a Founder-Governance Readiness Review",
            "steps": [
                "List all contributors and verify each has a signed, retroactive IP assignment.",
                "Draft a 4-year vesting schedule with a 1-year cliff and double-trigger acceleration.",
                "Map your cap table and identify every holder who can block a 75% special resolution.",
                "Define good-leaver and bad-leaver events and compute payouts for a month-20 departure.",
                "Run the governance gate and fix every failing check before approaching investors."
            ]
        },
    }


if __name__ == "__main__":
    data = get_day12_data()
    print(f"Generated Day 12: {data['title']}")
    words = [sum(len(s.split()) for s in p["say"]) for p in data["parts"]]
    print(f"Parts word counts: {words} (Total: {sum(words)})")
    for i, p in enumerate(data["parts"]):
        print(f"--- Part {i+1} output ---")
        print(p["output"])
    for i, w in enumerate(words):
        assert w >= 580, f"Part {i+1} has {w} words (< 580)"
    assert sum(words) >= 2950
    print("PASS: Day 12 invariants OK")
