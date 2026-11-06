import json
import re

def count_words(text):
    return len(re.findall(r'\b[A-Za-z0-9_-]+\b', text))

with open("scripts/test_day52_code.py", "r", encoding="utf-8") as f:
    day52_code = f.read()

day52_output = """Project: Project OncoShield
Total Research Phase Expensed to P&L: $5,000,000.00
Pre-PIRATE Development Expensed (No Retroactive Capitalization): $2,500,000.00
Total Expensed to P&L during R&D: $7,500,000.00
Capitalized Development Cost (Intangible Asset): $24,000,000.00
Finite Life Useful Life: 8 Years | Annual Amortization: $3,000,000.00
Year 1 Pro-Rata Amortization (6 Months): $1,500,000.00
Patent Closing Carrying Amount: $22,500,000.00
Indefinite Useful Life Brand: Cost $8,000,000.00 | Amortization $0.00 | Impairment $0.00
Total Intangibles Balance Sheet Carrying: $30,500,000.00
IND_AS_38_INTANGIBLE_ASSETS_PASS"""

part1_say = r"""Welcome to Day 52 of Corporate & Financial Accounting! Today we master Indian Accounting Standard 38 (Ind AS 38) and its global counterpart International Accounting Standard 38 (IAS 38)—Intangible Assets.

In the 21st-century knowledge economy, the valuation and accounting treatment of intangible assets—patents, proprietary software architectures, biotechnology formulations, licenses, and intellectual property—constitute the single largest driver of enterprise market value. Yet, because intangibles lack physical substance, accounting standard-setters have erected exceptionally rigorous gatekeeping criteria to prevent aggressive corporate earnings inflation and fictitious capitalization.

Under Ind AS 38.8, an intangible asset is formally defined as an identifiable non-monetary asset without physical substance:
1. Non-Monetary Character: It is an asset held for use in the production or supply of goods or services, for rental to others, or for administrative purposes, which does not represent money held or an asset to be received in fixed or determinable amounts of money.
2. Identifiability Invariant (Ind AS 38.12): An intangible asset is identifiable if and only if it satisfies at least one of two statutory criteria:
   (a) Separability Criterion: It is capable of being separated or divided from the entity and sold, transferred, licensed, rented, or exchanged, either individually or together with a related contract, identifiable asset, or liability, regardless of whether the entity intends to do so; or
   (b) Contractual-Legal Rights Criterion: It arises from contractual or other legal rights, regardless of whether those rights are transferable or separable from the entity or from other rights and obligations.
   This identifiability condition strictly distinguishes recognizable intangible assets from goodwill. Goodwill recognized in a business combination represents future economic benefits arising from other assets acquired in a business combination that are not individually identified and separately recognized.

3. Control Invariant (Ind AS 38.13):
   An entity controls an asset if the entity has the power to obtain the future economic benefits flowing from the underlying resource and to restrict the access of others to those benefits. The capacity of an entity to control the future economic benefits from an intangible asset would normally stem from legal rights that are enforceable in a court of law (such as registered patents, copyrights, or trade secrets). In the absence of legal rights, it is much more difficult to demonstrate control. For example, an entity may have a team of highly skilled staff and may identify incremental customer relationships, but because the entity cannot prevent skilled employees from leaving or customers from patronizing competitors, an entity usually cannot recognize human capital or customer portfolios as intangible assets unless protected by non-compete covenants or long-term enforceable commercial contracts!

4. Core Recognition Criteria (Ind AS 38.21):
   An intangible asset shall be recognized if, and only if:
   (a) It is probable that the expected future economic benefits that are attributable to the asset will flow to the entity; and
   (b) The cost of the asset can be measured reliably.
   In assessing the probability of expected future economic benefits, management must use reasonable and supportable assumptions that represent management's best estimate of the set of economic conditions that will exist over the useful life of the asset.

Initial Measurement:
An intangible asset shall be measured initially at cost. For separately acquired intangibles, cost comprises purchase price (including import duties and non-refundable purchase taxes) plus any directly attributable expenditure on preparing the asset for its intended use (such as professional legal fees and testing costs). However, when intangibles are generated internally through research and development, Ind AS 38 establishes strict phase-bifurcation rules that eliminate managerial discretion."""

part2_say = r"""In Part 2 of Day 52, we explore Internally Generated Intangible Assets: The Critical Bifurcation between the Research Phase and the Development Phase.

To determine whether an internally generated intangible asset meets the criteria for recognition, an entity classifies the generation of the asset into two distinct operational phases:
1. The Research Phase:
   - Under Ind AS 38.54, research is defined as original and planned investigation undertaken with the prospect of gaining new scientific or technical knowledge and understanding. Examples include laboratory activities aimed at obtaining new knowledge, searching for applications of research findings, and formulating or evaluating alternative materials, devices, products, or processes.
   - Statutory Rule (Ind AS 38.54): No intangible asset arising from research (or from the research phase of an internal project) shall be recognized! Expenditure on research shall be recognized as an operating expense in the Statement of Profit and Loss when it is incurred.
   - Accounting Rationale: In the research phase of an internal project, an entity cannot demonstrate that an intangible asset exists that will generate probable future economic benefits. Therefore, this expenditure is recognized as an expense when incurred, regardless of the size or scientific prestige of the project.
   - For Novavax BioPharma Ltd's Project OncoShield, Months 1 through 6 were devoted to basic molecular screening and oncology laboratory assays. Lab consumables ($1.8M), scientist salaries ($2.4M), and overhead ($0.8M) totaled $5,000,000.00. Under Ind AS 38.54, this entire $5.0M was expensed immediately to profit or loss.

2. The Development Phase & The Six PIRATE Criteria:
   - Under Ind AS 38.57, development is the application of research findings or other knowledge to a plan or design for the production of new or substantially improved materials, devices, products, processes, systems, or services, before the start of commercial production or use.
   - Statutory Rule: An intangible asset arising from development shall be recognized if, and only if, an entity can demonstrate ALL six cumulative **PIRATE** criteria:
     (1) **P** - Probable Future Economic Benefits: How the intangible asset will generate probable future economic benefits, including demonstrating the existence of a viable market for the output or its internal usefulness.
     (2) **I** - Intention to Complete: The formal intention of management to complete the intangible asset and use or sell it.
     (3) **R** - Resources Adequate: The availability of adequate technical, financial, and other resources to complete the development and to use or sell the asset.
     (4) **A** - Ability to Use or Sell: The ability of the entity to use or sell the intangible asset.
     (5) **T** - Technical Feasibility: The technical feasibility of completing the intangible asset so that it will be available for use or sale.
     (6) **E** - Expenditure Reliably Measurable: The ability to measure reliably the expenditure attributable to the intangible asset during its development.

3. The Absolute Ban on Retroactive Capitalization (Ind AS 38.71):
   - In Months 7 through 9, Novavax incurred $2,500,000.00 on pre-clinical synthesis and toxicity trials. While technically development work, management had not yet secured formal clinical trial authorization or commercial financing (failing the "R" and "T" criteria). Consequently, this $2.5M was expensed as incurred.
   - On October 1 (Month 10), Novavax received Phase II regulatory approval and secured formal bank financing, fulfilling all six PIRATE criteria simultaneously.
   - Critical Invariant: Under Ind AS 38.71, expenditure on an intangible item that was initially recognized as an expense in prior annual or interim financial reports shall NOT be recognized as part of the cost of an intangible asset at a later date! The previous $2.5M expensed can never be capitalized retroactively.
   - From Month 10 through Month 18, Novavax incurred $24,000,000.00 across clinical trial cohorts ($12M), bioreactor validation ($6.5M), patent filings ($1.5M), and clinical scientist salaries ($4.0M). Because all PIRATE criteria were active, this entire $24.0M was capitalized as Intangible Assets under Development."""

part3_say = r"""In Part 3 of Day 52, we examine Useful Life Architecture: Finite versus Indefinite Useful Life, Amortization Mechanics, and Subsequent Review Cycles.

Under Ind AS 38.88, an entity shall assess whether the useful life of an intangible asset is finite or indefinite. This classification fundamentally dictates the subsequent balance sheet and income statement mechanics:

1. Intangibles with a Finite Useful Life:
   - An intangible asset with a finite useful life is assessed to have a limited duration of economic benefit flow, either in terms of years or production units.
   - Amortization Rule (Ind AS 38.97): The depreciable amount of an intangible asset with a finite useful life shall be allocated on a systematic basis over its useful life.
   - Amortization begins when the asset is available for use—that is, when it is in the location and condition necessary for it to be capable of operating in the manner intended by management. Amortization ceases at the earlier of the date that the asset is classified as held for sale (under Ind AS 105) and the date that the asset is derecognized.
   - Method of Amortization: The amortization method used shall reflect the pattern in which the asset's future economic benefits are expected to be consumed by the entity. If that pattern cannot be determined reliably, the straight-line method shall be used.
   - Residual Value Assumption (Ind AS 38.100): The residual value of an intangible asset with a finite useful life shall be assumed to be zero unless:
     (a) There is a commitment by a third party to purchase the asset at the end of its useful life; or
     (b) There is an active market for the asset, and residual value can be determined by reference to that market and it is probable that such a market will exist at the end of the asset's useful life.
   - Case Study Application: Project OncoShield was commercially approved and launched in Month 19. The capitalized development cost of $24,000,000.00 was reclassified from Intangibles under Development to Commercial Patent Intangibles. Management established an 8-year useful life corresponding to regulatory exclusivity. The annual amortization charge is:
     $$\text{Annual Amortization} = \frac{\$24,000,000.00}{8} = \$3,000,000.00/\text{year}$$
     During Year 1 of commercialization, the drug operated for exactly 6 months. Pro-rata amortization recognized in profit or loss was:
     $$\text{Year 1 Amortization} = \$3,000,000.00 \times \frac{6}{12} = \$1,500,000.00$$
     The closing carrying amount of the patent on the balance sheet is $\$24,000,000.00 - \$1,500,000.00 = \$22,500,000.00$.

2. Intangibles with an Indefinite Useful Life:
   - An intangible asset shall be regarded by the entity as having an indefinite useful life when, based on an analysis of all of the relevant factors, there is no foreseeable limit to the period over which the asset is expected to generate net cash inflows for the entity.
   - Critical Invariant (Ind AS 38.107): An intangible asset with an indefinite useful life shall NOT be amortized!
   - Novavax acquired the "OncoShield Global Brand" for $8,000,000.00. Because pharmaceutical brands can be renewed indefinitely at nominal legal cost and generate sustained customer loyalty, it is classified as having an indefinite useful life. Annual amortization is exactly $0.00.
   - Mandatory Annual Impairment Testing: Under Ind AS 38.108 and Ind AS 36, an entity is required to test an intangible asset with an indefinite useful life for impairment by comparing its recoverable amount with its carrying amount annually, and whenever there is an indication that the intangible asset may be impaired. Novavax's certified valuation confirms a recoverable amount of $11,500,000.00, confirming zero impairment!"""

part4_say = r"""In Part 4 of Day 52, we analyze Cross-Standard Interactions with Ind AS 36 Impairment, Derecognition Rules, and Statutory Disclosure Architecture under Schedule III and CARO 2020.

Intangible assets are among the highest-risk balance sheet accounts scrutinized by regulatory agencies (MCA, SEBI, US SEC) due to the risk of obsolete software or failed pharmaceutical R&D being hidden on balance sheets:
1. Impairment Trigger Interactions under Ind AS 36:
   - For intangibles with finite useful lives (such as the OncoShield patent), impairment testing is conducted whenever an impairment indicator arises (e.g., a competitor launches a superior oncology drug, or clinical patent challenges emerge).
   - For intangibles with indefinite useful lives and intangible assets not yet available for use (capitalized development projects in progress), impairment testing is mandatory annually, regardless of whether any indicators exist. If clinical trials fail or regulatory clearance is denied, the entire capitalized development balance must be written off immediately to profit or loss as an impairment charge under Ind AS 36.

2. Derecognition & Disposals (Ind AS 38.112):
   - An intangible asset shall be derecognized:
     (a) On disposal (by sale, lease, or donation); or
     (b) When no future economic benefits are expected from its use or disposal.
   - The gain or loss arising from the derecognition of an intangible asset shall be determined as the difference between the net disposal proceeds (if any) and the carrying amount of the asset. It shall be recognized in profit or loss when the asset is derecognized. Gains shall not be classified as revenue from operations!

3. Prohibition on Internally Generated Brands, Mastheads & Customer Lists:
   - Under Ind AS 38.63, internally generated brands, mastheads, publishing titles, customer lists, and items similar in substance shall NOT be recognized as intangible assets under any circumstances.
   - Rationale: Expenditures on internally generated brands cannot be distinguished from the cost of developing the business as a whole. Only acquired brands through third-party purchase or business combinations (Ind AS 103) can be recognized on the balance sheet.

4. Statutory Schedule III & CARO 2020 Disclosure Invariants:
   - Under Division II of Schedule III of the Companies Act 2013, an entity must present Intangible Assets and Intangible Assets under Development as separate line items on the face of the Balance Sheet.
   - In the financial statement footnotes, an entity must disclose a comprehensive reconciliation of the gross carrying amount and accumulated amortization (together with accumulated impairment losses) at the beginning and end of the period, disclosing additions, assets classified as held for sale, acquisitions through business combinations, amortization recognized during the period, and impairment losses.
   - For intangible assets with indefinite useful lives, the entity must disclose the carrying amount of each such asset and the reasons supporting the assessment of an indefinite useful life.
   - Under Clause 3(i)(c) of CARO 2020, statutory auditors must state whether the company has revalued its Property, Plant and Equipment or intangible assets during the year, and if so, whether the revaluation is based on the valuation by a Registered Valuer; specify the amount of change, if change is 10% or more in the aggregate of the net carrying value of each class of intangible assets. Under Clause 3(i)(d), the auditor must verify whether any proceedings have been initiated or are pending against the company for holding any benami property. Furthermore, the capitalization of development expenditure creates substantial deferred tax interactions under Ind AS 12. For income tax purposes under Section 35(1)(iv) and Section 35(2AB) of the Income Tax Act, 1961, scientific research capital expenditures are frequently deductible in full in the year incurred (100% immediate tax write-off). In contrast, under Ind AS 38, qualifying development costs are capitalized and amortized over 8 years. This divergence results in the tax base of the intangible asset being zero upon commercialization while its accounting carrying amount is $24,000,000.00. This $24.0M taxable temporary difference requires the immediate recognition of a Deferred Tax Liability (DTL) of $\$24,000,000.00 \times 25.168\% = \$6,040,320.00$ under Section 115BAA, which gradually unwinds as the patent is amortized for financial accounting purposes over its 8-year useful life."""

part5_say = r"""In Part 5 of Day 52, we deploy our standalone Python enterprise software engine `IndAS38IntangiblesEngine`, verify all financial statement invariants, review balance sheet totals, and certify completion of Day 52!

Inspect the Python simulation code in the interactive sandbox editor. It encapsulates the full Ind AS 38 accounting lifecycle for Novavax BioPharma Ltd's Project OncoShield:
1. Research Phase Expensing: Aggregates $5,000,000.00 across lab consumables ($1.8M), scientist salaries ($2.4M), and overhead ($0.8M), charging it directly to profit or loss under Ind AS 38.54.
2. Pre-PIRATE Development Handling: Aggregates $2,500,000.00 of pre-clinical development incurred before meeting all six criteria, charging it to P&L and enforcing the prohibition against retroactive capitalization under Ind AS 38.71.
3. Total R&D Profit and Loss Burden: Verifies total operating expenses recognized during research and pre-PIRATE phases: $\$5,000,000.00 + \$2,500,000.00 = \$7,500,000.00$.
4. Development Capitalization: Captures $24,000,000.00 of qualifying post-PIRATE clinical costs ($12M trial cohorts, $6.5M bioreactors, $1.5M patent filings, $4M clinical salaries), capitalizing it as Intangible Assets under Development under Ind AS 38.57.
5. Finite Life Amortization Engine: Reclassifies $24M to commercial patents upon regulatory approval, establishing an 8-year useful life ($3M/year). For 6 months of Year 1 operations, computes exact pro-rata amortization of $1,500,000.00, yielding a closing carrying amount of $22,500,000.00.
6. Indefinite Life Intangible Brand: Tracks the $8,000,000.00 acquired brand with zero annual amortization, confirming an annual impairment test where recoverable amount ($11.5M) exceeds cost, resulting in $0.00 impairment.
7. Balance Sheet Aggregation: Sums the carrying values across finite-life patents ($22.5M) and indefinite-life brands ($8.0M), confirming total balance sheet intangible assets of $30,500,000.00.

Statutory Audit Verification & Certification:
The statutory audit partner, reviewing the R&D project ledger, examines the time logs of clinical scientists, validates the Board resolution documenting technical and commercial feasibility on October 1, and inspects the registered patent documentation. The auditor confirms that internal controls over development expenditure tracking operate effectively under Section 143(3)(i) of the Companies Act 2013. The accounting treatment strictly satisfies Ind AS 38, Ind AS 36, and Schedule III presentation norms.

Under Standard on Auditing (SA) 701 (Communicating Key Audit Matters in the Independent Auditor's Report), capitalization of internal development costs for pharmaceutical and software enterprises is almost universally designated as a Key Audit Matter (KAM). The audit report details the specific audit procedures performed to address this risk:
1. Evaluating Management's PIRATE Documentation: Testing the objective technical evidence supporting feasibility, including regulatory correspondence with drug authorities (such as the Central Drugs Standard Control Organisation - CDSCO, or US FDA) and clinical trial progression reports.
2. Direct Cost Tracing: Programmatically reconciling payroll records of clinical researchers and invoices from contract research organizations (CROs) to verify that only directly attributable development costs were capitalized, and that general administrative overhead was properly expensed.
3. Useful Life & Amortization Scrutiny: Evaluating whether the 8-year useful life aligns with remaining patent protection periods, taking into account potential generic competition and obsolescence risks.
4. Annual Impairment Review: For the unamortized indefinite-life brand ($8.0M) and development projects in progress, verifying that the discounted cash flow model utilized conservative revenue projections and a market-derived WACC rate.
5. Engagement Quality Review: Under SA 220, an independent Engagement Quality Reviewer (EQR) reviews the audit working papers to ensure objective skepticism was maintained regarding commercialization viability.

Our automated software platform performs deterministic validation checks across each accounting step, ensuring that the trial balance, cash flow statement, and balance sheet reflect exact mathematical harmony. When our Python simulation engine executes, every single assertion and statutory check validates with zero discrepancy, culminating in the terminal confirmation string:
`IND_AS_38_INTANGIBLE_ASSETS_PASS`."""

day52_lesson = {
    "coursePrefix": "bcom-accounting",
    "day": 52,
    "title": "Ind AS 38 / IAS 38: Intangible Assets (R&D Capitalization, PIRATE Criteria, Useful Life & Amortization)",
    "parts": [
        {
            "part": 1,
            "title": "Ind AS 38 Scope, Definition & Identifiability Invariants",
            "say": part1_say,
            "code": day52_code,
            "output": day52_output,
            "check": {
                "question": "Under Ind AS 38, what are the two alternative conditions under which an intangible asset is considered 'identifiable'?",
                "options": [
                    "It is separable (capable of being divided and sold/licensed) OR arises from contractual or other legal rights",
                    "It has physical substance OR can be converted into physical gold within 30 days",
                    "It was purchased exclusively for cash OR has an indefinite market life",
                    "It is listed on a recognized stock exchange OR owned by the government"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 38.12 establishes that an intangible asset is identifiable if it is separable OR arises from contractual or other legal rights.",
                "why": "Ind AS 38.12 establishes that an intangible asset is identifiable if it is separable OR arises from contractual or other legal rights."
            }
        },
        {
            "part": 2,
            "title": "Internally Generated Intangibles: Research Phase Expensing vs Development Capitalization (PIRATE Criteria)",
            "say": part2_say,
            "code": day52_code,
            "output": day52_output,
            "check": {
                "question": "What is the statutory accounting treatment under Ind AS 38 for expenditure incurred during the research phase of an internal project?",
                "options": [
                    "It must be recognized as an expense in the Statement of Profit and Loss when it is incurred, with zero capitalization permitted",
                    "It may be capitalized as an asset if approved by the Chief Technology Officer",
                    "It should be deferred on the balance sheet and amortized over 20 years",
                    "It must be retroactively added to goodwill upon commercial product launch"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 38.54 explicitly requires that expenditure on research must be expensed in profit or loss when incurred; no intangible asset arising from research can be recognized.",
                "why": "Ind AS 38.54 explicitly requires that expenditure on research must be expensed in profit or loss when incurred; no intangible asset arising from research can be recognized."
            }
        },
        {
            "part": 3,
            "title": "Useful Life Architecture: Finite vs Indefinite Useful Life, Amortization & Review Cycles",
            "say": part3_say,
            "code": day52_code,
            "output": day52_output,
            "check": {
                "question": "How are intangible assets with an indefinite useful life accounted for under Ind AS 38?",
                "options": [
                    "They are not amortized, but must be tested for impairment annually under Ind AS 36 and whenever an impairment indicator exists",
                    "They are amortized over a mandatory default period of 10 years",
                    "They are written off immediately to capital reserves at acquisition",
                    "They are amortized on a straight-line basis over 40 years without impairment testing"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 38.107-108 establishes that intangibles with indefinite useful lives are NOT amortized, but must be tested for impairment at least annually under Ind AS 36.",
                "why": "Ind AS 38.107-108 establishes that intangibles with indefinite useful lives are NOT amortized, but must be tested for impairment at least annually under Ind AS 36."
            }
        },
        {
            "part": 4,
            "title": "Impairment Interaction under Ind AS 36, Derecognition & Schedule III / CARO Disclosures",
            "say": part4_say,
            "code": day52_code,
            "output": day52_output,
            "check": {
                "question": "What does Ind AS 38.63 prescribe regarding the recognition of internally generated brands, mastheads, and customer lists?",
                "options": [
                    "They shall NOT be recognized as intangible assets under any circumstances",
                    "They may be recognized if valued by an independent merchant banker",
                    "They can be capitalized up to 50% of market advertising expenditures",
                    "They are recognized directly in Other Comprehensive Income (OCI)"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "Ind AS 38.63 prohibits the recognition of internally generated brands, mastheads, publishing titles, and customer lists because they cannot be distinguished from the cost of developing the business as a whole.",
                "why": "Ind AS 38.63 prohibits the recognition of internally generated brands, mastheads, publishing titles, and customer lists because they cannot be distinguished from the cost of developing the business as a whole."
            }
        },
        {
            "part": 5,
            "title": "Enterprise Ind AS 38 Software Platform, Programmatic Verification & Day 52 Completion",
            "say": part5_say,
            "code": day52_code,
            "output": day52_output,
            "check": {
                "question": "What is the final confirmation string emitted by the Enterprise Ind AS 38 Intangibles Engine upon verifying all R&D and amortization assertions?",
                "options": [
                    "IND_AS_38_INTANGIBLE_ASSETS_PASS",
                    "IND_AS_38_RND_CAPITALIZATION_FAILED",
                    "PIRATE_CRITERIA_VERIFICATION_ERROR",
                    "INTANGIBLE_AMORTIZATION_OVERFLOW"
                ],
                "answer": 0,
                "answerIndex": 0,
                "explanation": "The simulation engine verifies all Ind AS 38 R&D, PIRATE, and amortization assertions and concludes by emitting IND_AS_38_INTANGIBLE_ASSETS_PASS.",
                "why": "The simulation engine verifies all Ind AS 38 R&D, PIRATE, and amortization assertions and concludes by emitting IND_AS_38_INTANGIBLE_ASSETS_PASS."
            }
        }
    ]
}

total_words = 0
for p in day52_lesson["parts"]:
    wc = count_words(p["say"])
    total_words += wc
    print(f"Day 52 Part {p['part']} words: {wc}")

for p in day52_lesson["parts"]:
    wc = count_words(p["say"])
    assert wc >= 580, f"Part {p['part']} word count {wc} < 580"

print(f"Day 52 Total words: {total_words}")
assert total_words >= 3000, f"Total word count {total_words} < 3000"

with open("scripts/bcom_acc_day52.json", "w", encoding="utf-8") as f:
    json.dump(day52_lesson, f, indent=2)

print("Saved scripts/bcom_acc_day52.json successfully!")
