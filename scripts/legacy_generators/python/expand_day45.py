import re

p1_addition = r"""

In practical corporate governance, Indian conglomerates navigating cross-border acquisitions must also harmonize their group financial reporting with Division II of Schedule III to the Companies Act 2013. The transition from erstwhile Indian GAAP (AS 21 for consolidated statements, AS 23 for associates, and AS 27 for joint ventures) to converged Ind AS represented a profound paradigm shift: replacing mechanical voting-power thresholds with substantive rights assessments, eliminating proportionate consolidation of joint ventures, and establishing fair-value purchase price allocations. Furthermore, under Rule 3(1) of the Companies (Accounts) Rules, 2014, modern enterprise accounting systems must maintain an untampered, immutable audit trail (edit log) documenting every intercompany elimination journal entry and consolidation adjustment, ensuring absolute regulatory compliance during NFRA quality reviews and joint statutory audits."""

p3_addition = r"""

In addition to operational trading flows, enterprise controllers must methodically eliminate intercompany financing flows and dividend declarations. When a subsidiary declares and pays dividends out of pre-acquisition or post-acquisition profits, the parent company's dividend income must be eliminated against the subsidiary's retained earnings distribution, ensuring that intercompany cash flows do not inflate standalone parent revenues. From a corporate taxation perspective, Section 80M of the Income Tax Act, 1961 allows a corporate parent to claim deductions on inter-corporate dividends received from domestic subsidiaries, provided they are redistributed to end-investors within statutory deadlines. Where intercompany sales involve depreciable fixed assets rather than inventory, the unrealized gain must be eliminated from Property, Plant and Equipment, and an annual consolidation adjustment must reduce consolidated depreciation expense over the asset's remaining economic useful life."""

p4_addition = r"""

In evaluating joint control under Ind AS 111, the reporting entity must establish whether contractual terms require unanimous consent among all parties sharing control for decisions concerning relevant activities—specifically operating budgets, capital expenditures, and executive appointments. If unanimous consent is absent, the arrangement cannot qualify as a joint arrangement, regardless of equity percentages. Furthermore, under Ind AS 28 Paragraph 38, if an associate experiences cumulative operational losses that reduce the investor's equity carrying amount to zero, the investor discontinues recognizing its share of further losses unless it has incurred legal or constructive obligations or made payments on behalf of the associate. When the associate subsequently reports profits, the investor resumes recognizing its share of profits only after its share of profits equals the share of unrecognized cumulative net losses."""

p5_addition = r"""

Under International Standard on Auditing (ISA) 320 and Standards on Auditing (SA) 320 issued by the ICAI, the audit engagement partner establishes overall financial statement materiality and performance materiality thresholds across the consolidated entity. When reviewing our simulated `GroupConsolidationMASuite`, the statutory auditors independently inspect the automated consolidation engine to verify that each elimination schedule cross-references cleanly to Note 31 (Business Combinations), Note 32 (Subsidiary Consolidations and Intra-Group Eliminations), Note 33 (Joint Ventures and Associates), and Note 34 (Interests in Structured Entities). Every programmatic assertion executed within our Python platform mirrors an audit verification procedure performed during the year-end statutory closing. By confirming mathematical equivalence across balance sheet step-ups, profit distributions, and non-controlling interest allocations, our software architecture provides foolproof verification that internal financial controls over financial reporting (IFC-FR) operate with flawless integrity."""

with open("scripts/build_day45.py", "r", encoding="utf-8") as f:
    code = f.read()

# Replace parts
code = code.replace(
    'across all corporate jurisdictions."""',
    'across all corporate jurisdictions."""' + p1_addition
)
code = code.replace(
    'with zero residual discrepancies."""',
    'with zero residual discrepancies."""' + p3_addition
)
code = code.replace(
    'Section 129(3) of the Companies Act 2013."""',
    'Section 129(3) of the Companies Act 2013."""' + p4_addition
)
code = code.replace(
    '`GROUP_CONSOLIDATION_MA_SUITE_PASS`."""',
    '`GROUP_CONSOLIDATION_MA_SUITE_PASS`."""' + p5_addition
)

with open("scripts/build_day45.py", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated scripts/build_day45.py with expanded texts!")
