# scripts/generate_day27.py
import sys
import os
import json
import subprocess
import hashlib

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

def run_py(code_str):
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    res = subprocess.run([sys.executable, "-c", code_str], capture_output=True, text=True, env=env)
    if res.returncode != 0:
        print("STDERR:", res.stderr)
        raise RuntimeError(f"Code execution failed with code {res.returncode}")
    return res.stdout

p1_say = [
    "Welcome to Day 27 of Excel and Data Analysis Fundamentals. Today, we venture into the powerhouse of modern enterprise spreadsheet architecture: Big Data Excel, driven by the Power Query Advanced M Engine, Web Scraping, and Multi-Source Financial Reconciliation. In common commercial practice, spreadsheets are often misunderstood as static calculation grids or visual presentation surfaces. Novice financial modelers rely heavily on point-and-click GUI buttons on the Excel ribbon to filter rows, split delimiter columns, and join tables. However, elite quantitative modelers, corporate controllers, and financial software architects never restrict themselves to the GUI. They write raw, programmatic transformations directly in Power Query's underlying functional data mashup language: M.",
    "The M language—formally named the Power Query Formula Language—is a functional, case-sensitive, expression-oriented data transformation language engineered specifically for enterprise Extract, Transform, and Load (ETL) pipelines. Unlike imperative languages like Python, C++, or VBA—where developers write sequential state-mutating commands such as incrementing counters or appending elements to lists—M is purely declarative. An M script evaluates a Directed Acyclic Graph (DAG) of functional transformations enclosed within a canonical let ... in expression block. Each step within the let block is an immutable definition bound to a variable name, and the final expression specified after the in keyword defines the root evaluation demand.",
    "To build institutional models, you must master M's primitive and structured type system. M defines four fundamental structured container types: 1. Records, denoted with square brackets like [TransactionID = 101, Vendor = 'Dell', Amount = 5400.0], representing a single row of heterogeneous fields; 2. Lists, denoted with curly braces like {10, 20, 30, 40}, representing ordered arrays of homogeneous or heterogeneous items accessed via zero-based integer index; 3. Tables, constructed via the #table intrinsic or Table functions, representing two-dimensional matrices of typed columns; and 4. Functions, defined with the lambda operator like (x as number, y as number) as number => x + y, which can be passed as first-class citizens into higher-order transformation iterators like Table.TransformColumns and Table.SelectRows.",
    "One of the most consequential architectural features of the Power Query M engine is Lazy Evaluation, also known as Call-by-Need. In an enterprise M script containing sixty sequential transformation steps, the engine does not evaluate every line sequentially from top to bottom upon execution. Instead, the final variable specified in the in clause serves as the demand target. The engine works backward through the dependency graph, executing only the precise subset of expressions strictly necessary to produce the requested output. If an analyst defines intermediate staging tables or exploratory debug views that are not referenced by the terminal in expression, the M compiler completely prunes those branches from execution. This lazy evaluation mechanism minimizes RAM consumption and avoids unnecessary computational drag when working with millions of transactional rows.",
    "Even more critical for enterprise database connectivity is Query Folding. Query folding is the compiler optimization mechanism where high-level M functional expressions are automatically translated into native database SQL queries (such as translating Table.SelectRows into SQL WHERE clauses, Table.Group into GROUP BY statements, and Table.Join into INNER JOIN operations). When query folding is active, the M engine pushes computational heavy lifting down to the remote database server (such as Microsoft SQL Server, Snowflake, Oracle, or Azure Synapse), rather than pulling millions of uncompressed records across the corporate wide area network into Excel's local memory. Preserving query folding requires avoiding folding-breaking operations like non-standard custom functions, early type coercions, or row-number index additions before server-side filters have been applied.",
    "Furthermore, enterprise modeling frequently requires Custom Recursive M Functions. When financial teams ingest hierarchical charts of accounts, multi-tier parent-child legal entities, or compounding depreciation curves with variable useful lives, simple built-in GUI transformations cannot solve the problem. Analysts write custom recursive M functions using the @ scoping operator to traverse parent-child trees and compute consolidated roll-ups.",
    "In this section, we construct a production-grade Power Query Advanced M Engine in pure Python. We model M's functional evaluation DAG, structured records, lazy dependency tracing, dead-code pruning, and SQL query folding push-down analysis to demonstrate how enterprise systems achieve blazing ETL throughput."
]

p2_say = [
    "In the second operational tier of Big Data Excel, we master external automated data harvesting: Automated Web Scraping and Regulatory Filing HTML Extraction. In investment banking, corporate development, equity research, and macroeconomic benchmarking, the most valuable market intelligence does not arrive in tidy SQL database tables. Competitor earnings press releases, SEC EDGAR 10-K and 10-Q quarterly reports, central bank foreign exchange parity tables, and commodity benchmark prices are published directly to the public web in unstructured or semi-structured HTML format.",
    "Power Query provides a specialized web scraping capability through its built-in functions Web.Page(Web.Contents(url)) and Html.Table(). When an analyst connects to a financial URL, the M engine executes an HTTP GET request, retrieves the raw HTML Document Object Model (DOM) tree, parses the hierarchical markup, and searches for table, tr, and td tags to convert unstructured text into strongly typed spreadsheet matrices.",
    "However, real-world web scraping of regulatory portals presents major technical hurdles: 1. Dynamic class selectors and fluctuating table identifiers across quarterly reporting periods; 2. Nested tables, merged cells with colspan and rowspan attributes, and irregular sub-headers; 3. Non-standard accounting notations such as parenthetical negative numbers (e.g., ($450.20)), footnote reference characters, and thousands commas; and 4. Currency symbol variety and multi-period comparative disclosures requiring dimensional pivoting.",
    "To build institutional-grade web harvesting pipelines, professional financial engineers utilize Semantic CSS Class Selectors rather than fragile absolute cell indices. Using Html.Table with targeted CSS selectors allows the scraper to isolate metric labels and financial values based on their semantic styling tags rather than their visual row index. As a result, if a regulatory body adds an extra introductory paragraph or changes page banner heights, the semantic scraping pipeline continues extracting quarterly figures without crashing.",
    "Furthermore, understanding the underlying document structure of regulatory portals is vital. Modern filings on the US Securities and Exchange Commission (SEC) EDGAR system utilize Inline XBRL (iXBRL), where standardized financial taxonomy tags (such as us-gaap/Revenues or us-gaap/OperatingIncomeLoss) are embedded directly within standard HTML markup. By parsing these semantic tokens and their associated ix:nonFraction or ix:nonNumeric attributes, an automated M scraper extracts accounting data with absolute ontological precision, eliminating the guesswork of parsing visual column headings.",
    "Once the raw HTML table is parsed into memory, the extraction pipeline applies financial text normalization: stripping non-breaking spaces (&nbsp;) and HTML entity escapes (&amp;, &quot;), converting Unicode minus symbols into ASCII hyphens, and converting parenthetical currency strings into negative floating-point numbers. Furthermore, the pipeline automatically detects period headers (such as 'Three Months Ended September 30, 2026') and transforms string dates into ISO standard date fields, calculating Quarter-over-Quarter (QoQ) and Year-over-Year (YoY) variance percentages.",
    "Corporate web scraping pipelines also implement responsible governance: honoring website terms of service, respecting robots.txt directives, enforcing randomized exponential backoff and polite rate limiting to prevent denial-of-service alerts on government regulatory servers, and maintaining cryptographic audit hashes of downloaded filings.",
    "In this section, we construct a production-grade Web Scraping and Regulatory HTML Extraction Engine in pure Python. We parse raw SEC 10-Q filing markup, extract multi-quarter financial statements, resolve accounting parenthetical formatting, and compute QoQ financial performance metrics with forensic precision."
]

p3_say = [
    "In the third operational tier of Big Data Excel, we tackle the single most pervasive data quality bottleneck in corporate treasury and enterprise finance: Entity Resolution and Fuzzy Matching across disparate accounting sub-ledgers. In multi-entity conglomerates and global organizations, vendor, supplier, and customer names are rarely recorded identically across systems. The central ERP ledger might record 'Amazon Web Services Inc.', the corporate credit card statement logs 'AWS Cloud Svcs', the procurement contract cites 'Amazon.com Services LLC', and the subsidiary ledger records 'Amazon Web Services, AWS'.",
    "Traditional lookup functions—such as =XLOOKUP(), =VLOOKUP(), or standard SQL INNER JOIN on a.vendor_name = b.vendor_name—fail catastrophically in this scenario. They treat 'Amazon Web Services Inc' and 'AWS Cloud Svcs' as completely distinct entities, resulting in #N/A lookup errors, dropped records, and massive undercounting of aggregate supplier spend.",
    "Power Query solves this through its integrated Fuzzy Matching algorithms (available via Table.FuzzyJoin and Table.FuzzyGroup). The fuzzy matching engine evaluates mathematical string distance metrics to calculate the semantic similarity between two text strings on a continuous probability scale from 0.0 (completely dissimilar) to 1.0 (exact character match).",
    "Under the hood, the fuzzy engine relies on two foundational mathematical algorithms: 1. Levenshtein Distance, which measures the minimum number of single-character edits (insertions, deletions, or substitutions) required to transform string A into string B, producing a normalized similarity metric of 1 - (edit_distance / max(len(A), len(B))); and 2. Jaccard Similarity of Word Tokens and N-Grams, which evaluates the intersection over union of word tokens: J(A, B) = |Tokens(A) cap Tokens(B)| / |Tokens(A) cup Tokens(B)|.",
    "In advanced enterprise settings, quantitative engineers also utilize Jaro-Winkler Distance and Damerau-Levenshtein metrics. Damerau-Levenshtein specifically accounts for adjacent character transpositions (such as typing 'teh' instead of 'the') as a single operation, while Jaro-Winkler gives higher weight to prefix matches, which is exceptionally effective for corporate names sharing identical brand roots. Combining token-based Jaccard similarity with character-level string distance creates a composite confidence score that is resilient against both rearranged words and typographic human error.",
    "To achieve commercial-grade entity resolution without false positives, the fuzzy engine applies multi-stage heuristic preprocessing: 1. Token Sorting: splitting strings into tokens, sorting alphabetically, and reassembling (ensuring 'Services Cloud Amazon' matches 'Amazon Cloud Services' with a 100% token score); 2. Stop-Word and Entity Suffix Stripping: discarding legal entity suffixes like 'Inc', 'LLC', 'Corp', 'Ltd', and 'GmbH'; and 3. Dynamic Confidence Thresholding: setting strict similarity hurdles (such as 0.75 or 0.80) to automatically approve matches while quarantining borderline scores for human review.",
    "Furthermore, in high-volume enterprise financial consolidation, the fuzzy engine builds a persistent Golden Record Transformation Dictionary. This dictionary maps hundreds of disparate subsidiary vendor variations to a single approved parent entity, ensuring consistent historical reporting across all business units.",
    "In this section, we construct a production-grade Fuzzy Matching and Entity Resolution Engine in pure Python. We implement Jaccard token similarity, dynamic programming Levenshtein distance, corporate suffix normalization, and confidence threshold routing to consolidate multi-subsidiary vendor spend seamlessly."
]

p4_say = [
    "In the fourth operational tier of Big Data Excel, we engineer the premier internal control of corporate accounting and auditing: Automated Multi-Source Reconciliation and Three-Way Match Triangulation. In enterprise procurement and financial operations, financial truth does not reside in a single file. Every commercial purchase generates records across three independent systems: 1. Purchase Orders (PO) generated in the enterprise resource planning (ERP) procurement module; 2. Goods Received Notes (GRN) logged by the warehouse receiving dock; and 3. Vendor Accounts Payable Invoices submitted to the finance department.",
    "To prevent cash leakage, overbilling, and fraudulent disbursements, statutory financial governance frameworks (such as Sarbanes-Oxley Section 404) mandate Three-Way Reconciliation: verifying that Vendor Invoiced Quantity equals Goods Received Quantity, and Vendor Invoiced Unit Price matches the approved Purchase Order Unit Price. In legacy accounting environments, teams of analysts spend hundreds of hours manually comparing printed invoices against warehouse logs. In Big Data Excel, we automate this three-way matching pipeline using Power Query relational joins (Table.NestedJoin).",
    "The automated reconciliation engine evaluates every transaction and classifies outcomes into five standardized audit categories: 1. Perfect Three-Way Match: PO, GRN, and Invoice quantities and prices agree within established materiality tolerances; 2. Unfavorable Price Variance: vendor invoiced at a higher price than authorized on the PO; 3. Quantity Discrepancy / Overbilling: vendor billed for more units than were physically scanned into the warehouse; 4. Goods Received Not Invoiced (GRNI): warehouse accepted goods but vendor has not billed, creating an unrecorded accrual liability; and 5. Orphaned Invoice: an invoice submitted without any corresponding PO, representing unauthorized rogue spend.",
    "Understanding the accounting implications of Goods Received Not Invoiced (GRNI) is critical for corporate controllers. When inventory arrives at the warehouse dock, the ERP debits Inventory and credits the GRNI Accrued Liability account. When the vendor invoice eventually arrives, Accounts Payable debits GRNI Accrual and credits Accounts Payable. If invoices are matched inaccurately, phantom balances accumulate in GRNI, distorting working capital telemetry and triggering audit adjustments by statutory external auditors.",
    "To handle real-world commercial volume without administrative paralysis, the reconciliation engine implements Materiality Tolerance Bands. Minor rounding differences (such as sales tax penny variances or fractional freight allocations under $10.00) are automatically reconciled and routed to an automated variance clearing account, allowing corporate controllers to direct their investigation toward high-risk material discrepancies.",
    "Once matching is executed, the engine compiles the Reconciliation Roll-Forward Schedule and Exception Action Roster. Every variance is automatically assigned to a designated stakeholder (Procurement Buyer, Warehouse Receiving Supervisor, or AP Specialist) with a recommended operational action: auto-approving payment, short-paying the invoice to the GRN quantity, or freezing disbursement pending audit review.",
    "Furthermore, the engine maintains complete audit trail telemetry: logging line-level item identifiers, timestamps, tolerance evaluations, and user sign-offs to satisfy external auditors (such as the Big Four) during annual statutory reviews.",
    "In this section, we construct a production-grade Multi-Source Reconciliation Engine in pure Python. We ingest PO, GRN, and Invoice ledgers, execute automated relational three-way matching, isolate price and quantity variances, and generate executive reconciliation exception ledgers."
]

p5_say = [
    "In this fifth and culminating section of Day 27, we assemble all four Big Data Excel capabilities into an enterprise-scale Master Power Query & Reconciliation Gateway. In multinational corporations, tier-1 investment banks, and enterprise treasury departments, this gateway operates as the core transactional command spine—synthesizing M language functional DAG evaluation, automated regulatory web harvesting, fuzzy entity resolution, and three-way multi-source reconciliation into a single unified analytical operating system.",
    "The Enterprise Big Data Gateway executes four coordinated architectural phases: Phase 1: M Engine Query Folding and Database Extraction: pulling filtered, aggregated transactional data directly from remote SQL databases while eliminating client-side memory bloat; Phase 2: Regulatory HTML Filing Scraping: extracting competitor performance benchmarks from SEC EDGAR filings and standardizing accounting line items; Phase 3: Algorithmic Entity Resolution: harmonizing disparate subsidiary supplier names against corporate golden records via composite Jaccard-Levenshtein metrics; and Phase 4: Three-Way Multi-Source Reconciliation: cross-referencing purchase orders, warehouse receipts, and accounts payable invoices, isolating price and quantity variances, and verifying zero-leakage financial continuity.",
    "To enforce strict compliance with Sarbanes-Oxley (SOX) Section 404 and external audit committee standards, the gateway computes an Enterprise Big Data Health Score on a 100-point scale. The scoring algorithm audits three non-negotiable operational dimensions: 1. Query Folding Efficiency: verifying that 95% or more of raw database rows were filtered server-side; 2. Entity Resolution Certainty: confirming that 100% of vendor transactions were resolved to verified master supplier accounts; and 3. Zero Unresolved Exceptions: ensuring that every single purchase order variance was classified, assigned a resolution action, and balanced to the general ledger. Gateways scoring a perfect 100/100 receive an automated 'SOX Section 404 Big Data Reconciliation Certification', sealed with an immutable cryptographic SHA-256 digest.",
    "In large enterprise deployments, this gateway integrates seamlessly with Power BI On-Premises Data Gateways and automated cloud refresh schedules in Azure Data Factory. Transactional ledgers spanning tens of millions of rows are refreshed incrementally overnight, applying query folding partition elimination so that only current-quarter transactions are evaluated, keeping daily refresh runtimes under five minutes.",
    "Furthermore, the gateway outputs an executive-ready Big Data Financial Cockpit and Reconciliation Roll-Forward Manifesto. This boardroom package replaces hundreds of fragmented departmental spreadsheets with a single, synchronized executive dashboard. Chief Financial Officers, Corporate Controllers, and Internal Audit Directors can drill down from enterprise-level procurement spend directly to individual supplier invoice discrepancies or fuzzy match confidence scores with a single click.",
    "By completing Day 27, you have mastered the complete big data toolchain of modern Excel. You possess the functional programming expertise, web harvesting capabilities, algorithmic string distance mathematics, and multi-source reconciliation rigor required to govern billions of dollars of corporate transactional data with absolute mathematical certainty.",
    "In this final section, we deploy the complete Enterprise Big Data Excel Pipeline Gateway in pure Python. We orchestrate the full end-to-end multi-engine pipeline, generate the consolidated executive reconciliation ledger, verify zero-leakage financial continuity, and produce the boardroom-certified Big Data Master Scorecard."
]

parts = [
    {
        "title": "Advanced Power Query M Language & Functional Paradigm",
        "say": p1_say,
        "example": "Think of an executive chef preparing a banquet: instead of chopping every vegetable in the kitchen just in case, the chef inspects the final menu (the 'in' clause) and only prepares the exact ingredients needed for the ordered dishes, delegating heavy chopping to specialized sous-chefs (query folding).",
        "code": p1_code,
        "codeNotes": [
            {"line": 2, "note": "Initializes PowerQueryAdvancedMEngine modeling M language functional let-in evaluation"},
            {"line": 10, "note": "Implements lazy dependency graph traversal tracing backward from target demand step"},
            {"line": 29, "note": "Analyzes query folding compatibility pushing filter, sort, and group operations to SQL server"},
            {"line": 49, "note": "Defines M let-block demonstrating lazy dead-code pruning on 'UnusedDebugTable'"}
        ],
        "tryIt": "Target 'SortedSpend' instead of 'CustomCleanedVendors' to see how lazy evaluation prunes downstream transformations.",
        "check": {
            "question": "What is the primary performance benefit of 'Query Folding' in Power Query M?",
            "options": [
                "It pushes filtering, sorting, and aggregation down to the remote SQL database server, preventing millions of raw records from being dragged across the network into local RAM",
                "It automatically prints spreadsheet tables on paper",
                "It compresses the Excel file into a ZIP archive",
                "It changes the font color of headers to gold"
            ],
            "answer": 0,
            "why": "Query folding translates M operations into native SQL statements executed directly by the database server, drastically accelerating query performance."
        }
    },
    {
        "title": "Automated Web Scraping & Regulatory Filing HTML Extraction",
        "say": p2_say,
        "example": "Think of an archaeologist excavating an ancient inscription: the raw stone tablet is covered in dirt and eroded glyphs (raw HTML markup); the archaeologist uses delicate brushes to uncover the true hieroglyphs (HTML table tags) and translates them into modern words (structured financial metrics).",
        "code": p2_code,
        "codeNotes": [
            {"line": 2, "note": "Initializes WebScrapingHtmlExtractorEngine modeling Power Query Web.Page table extraction"},
            {"line": 10, "note": "Implements semantic CSS selector parsing extracting line items, Q3, and Q2 figures"},
            {"line": 24, "note": "Parses accounting parenthetical negative numbers (e.g., ($480.20) -> -480.20)"},
            {"line": 52, "note": "Calculates QoQ financial growth rates from parsed multi-period SEC filing tables"}
        ],
        "tryIt": "Add a row for 'Net Income' with parenthetical tax expenses and verify how the parser extracts negative numbers.",
        "check": {
            "question": "Why is semantic CSS class targeting superior to absolute column/row index scraping when extracting financial tables?",
            "options": [
                "Semantic CSS selectors target specific data classes, preventing extraction pipelines from breaking when webpage layouts undergo minor cosmetic changes",
                "Because CSS selectors make internet connections 10x faster",
                "Because absolute cell indices are illegal under SEC regulations",
                "Because HTML tables cannot store negative numbers"
            ],
            "answer": 0,
            "why": "Semantic CSS class selectors isolate the exact financial data elements regardless of visual padding, header modifications, or cosmetic layout updates."
        }
    },
    {
        "title": "Fuzzy Matching, Jaccard Similarity & Multi-Source Data Blending",
        "say": p3_say,
        "example": "Think of facial recognition at international airport customs: minor variations like a new haircut, glasses, or a smile don't fool the biometric scanner; the algorithm measures invariant facial geometry to confirm your identity with 99% statistical confidence.",
        "code": p3_code,
        "codeNotes": [
            {"line": 2, "note": "Initializes FuzzyMatchingEntityResolutionEngine with Jaccard and Levenshtein algorithms"},
            {"line": 10, "note": "Normalizes string tokens stripping legal corporate entity stop words (Inc, LLC, Corp)"},
            {"line": 23, "note": "Implements dynamic programming Levenshtein distance calculating character edit counts"},
            {"line": 43, "note": "Combines token Jaccard (60%) and string Levenshtein (40%) into composite confidence score"}
        ],
        "tryIt": "Add a typo like 'Amezon Web Servises' to observe how Levenshtein distance successfully recovers the match.",
        "check": {
            "question": "Why does the Fuzzy Matching Engine combine token-based Jaccard similarity with character-based Levenshtein distance?",
            "options": [
                "Jaccard handles rearranged word order while Levenshtein handles typographical character errors, providing robust composite entity resolution",
                "Because US GAAP requires two separate mathematical formulas for tax deductions",
                "To make the Python code look twice as long",
                "Because Jaccard similarity only works for numbers"
            ],
            "answer": 0,
            "why": "Combining token Jaccard and character Levenshtein captures both inverted word orders ('Services Amazon') and spelling typos ('Amezon')."
        }
    },
    {
        "title": "Automated Multi-Source Reconciliation & Exception Triangulation",
        "say": p4_say,
        "example": "Think of air traffic radar triangulation: to confirm an aircraft's exact position, controllers verify the transponder signal (PO), primary radar echo (GRN), and secondary radar track (Invoice); if all three coordinates align, the airspace is certified safe.",
        "code": p4_code,
        "codeNotes": [
            {"line": 2, "note": "Initializes MultiSourceReconciliationEngine enforcing three-way matching and materiality bands"},
            {"line": 15, "note": "Triangulates PO, Goods Received Note (GRN), and Vendor Invoice ledgers"},
            {"line": 45, "note": "Isolates price variance from quantity variance determining automated AP short-pay rules"},
            {"line": 52, "note": "Quarantines orphaned invoices lacking authorized corporate purchase orders"}
        ],
        "tryIt": "Adjust Cisco inv_qty to 8 to observe how quantity discrepancy converts into a perfect match.",
        "check": {
            "question": "What is the primary fiduciary purpose of automated Three-Way Match Reconciliation in corporate finance?",
            "options": [
                "To verify that the company only pays for goods that were both legally authorized via a PO and physically verified as received in the warehouse",
                "To automatically double all vendor invoice prices",
                "To delete purchase order numbers from the computer system",
                "To convert accounts payable into accounts receivable"
            ],
            "answer": 0,
            "why": "Three-way matching protects corporate cash by verifying authorized pricing (PO) and physical receipt (GRN) before authorizing AP cash disbursement."
        }
    },
    {
        "title": "Enterprise Big Data Excel Pipeline Gateway & Boardroom Telemetry",
        "say": p5_say,
        "example": "Think of a central bank gold vault audit: auditors don't just count the gold bars in the vault; they cross-reference mining dispatch receipts (PO), armored transport custody logs (GRN), and treasury deposit certificates (Invoice), verifying every ounce of gold with forensic metallurgical precision.",
        "code": p5_code,
        "codeNotes": [
            {"line": 2, "note": "Initializes EnterpriseBigDataPowerQueryGateway uniting all four big data engines"},
            {"line": 15, "note": "Simulates 500,000-row SQL query folding push-down (99% remote processing)"},
            {"line": 35, "note": "Evaluates composite Big Data Health Score across folding, fuzzy, and reconciliation dimensions"},
            {"line": 42, "note": "Generates immutable cryptographic SHA-256 SOX Section 404 audit certificate seal"}
        ],
        "tryIt": "Increase client_memory_records to 50,000 to observe how memory drag impacts the health score.",
        "check": {
            "question": "What does a cryptographic SHA-256 audit digest verify in an Enterprise Big Data Reconciliation Gateway?",
            "options": [
                "It proves mathematically that the reconciliation ledger and SOX 404 certification data have not been tampered with or modified post-audit",
                "It generates random bitcoins for the company treasury",
                "It replaces the need for a corporate board of directors",
                "It forces Excel to save files exclusively as text files"
            ],
            "answer": 0,
            "why": "The cryptographic SHA-256 seal creates an immutable tamper-evident mathematical digest guaranteeing the integrity of the financial reconciliation audit."
        }
    }
]

total_words = 0
for idx, p in enumerate(parts):
    w_count = sum(len(para.split()) for para in p["say"])
    total_words += w_count
    print(f"Part {idx+1} '{p['title'][:40]}...': {w_count} words")
    if w_count < 580:
        raise ValueError(f"Part {idx+1} word count {w_count} is less than required 580 words!")
    output = run_py(p["code"])
    p["output"] = output.strip()

print(f"\nTotal Day 27 spoken words: {total_words} words (Target >= 2,940 words, ~{total_words/150:.1f} minutes of audio)")

# Build Gate v2 visual file: day-27.json
visual_entries = []
for p in parts:
    c_hash = hashlib.sha256(p["code"].encode("utf-8")).hexdigest()
    entry = {
        "partTitle": p["title"],
        "codeHash": c_hash,
        "spec": {
            "template": "bars",
            "title": f"{p['title']} — Big Data Pipeline Telemetry",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Ingesting data structures and architectural scope for {p['title'][:32]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Query Folding", "value": 25, "tone": "accent"},
                        {"label": "Web Scraping", "value": 15, "tone": "data"},
                        {"label": "Fuzzy Matching", "value": 10, "tone": "data"},
                        {"label": "3-Way Recon", "value": 5, "tone": "data"}
                    ]
                },
                {
                    "at": "say1",
                    "caption": f"Step 2: Processing transformation algorithms and data pipelines for {p['title'][:32]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Query Folding", "value": 65, "tone": "accent"},
                        {"label": "Web Scraping", "value": 50, "tone": "data"},
                        {"label": "Fuzzy Matching", "value": 45, "tone": "data"},
                        {"label": "3-Way Recon", "value": 30, "tone": "data"}
                    ]
                },
                {
                    "at": "example",
                    "caption": f"Step 3: Evaluating real-world institutional enterprise scenario for {p['title'][:32]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Query Folding", "value": 90, "tone": "accent"},
                        {"label": "Web Scraping", "value": 85, "tone": "data"},
                        {"label": "Fuzzy Matching", "value": 80, "tone": "data"},
                        {"label": "3-Way Recon", "value": 75, "tone": "data"}
                    ]
                },
                {
                    "at": "tryIt",
                    "caption": f"Step 4: Enterprise Big Data gateway certification and SHA-256 seal for {p['title'][:32]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Query Folding", "value": 100, "tone": "data"},
                        {"label": "Web Scraping", "value": 100, "tone": "accent"},
                        {"label": "Fuzzy Matching", "value": 100, "tone": "accent"},
                        {"label": "3-Way Recon", "value": 100, "tone": "accent"}
                    ]
                }
            ]
        }
    }
    visual_entries.append(entry)

visual_path = os.path.join("src", "lib", "data", "lessonVisuals", "excel_viz", "day-27.json")
with open(visual_path, "w", encoding="utf-8") as f:
    json.dump(visual_entries, f, indent=2)
print(f"Generated visual file: {visual_path}")

# Construct LongLesson object for Day 27
day27_lesson = {
    "day": 27,
    "title": "Big Data Excel: Power Query Advanced M Engine, Web Scraping & Multi-Source Reconciliation",
    "summary": [
        "Master the Power Query M functional formula language, lazy dependency DAG evaluation, and remote SQL query folding.",
        "Scrape regulatory SEC 10-Q HTML tables using semantic CSS selectors, accounting parenthetical parsing, and normalization.",
        "Resolve disparate subsidiary vendor entities using token-based Jaccard similarity and character-based Levenshtein distance.",
        "Automate multi-source three-way reconciliation triangulating Purchase Orders, Goods Receipts, and Vendor AP Invoices.",
        "Deploy the Enterprise Big Data Excel Pipeline Gateway generating consolidated audit ledgers and SHA-256 verification seals."
    ],
    "projectStep": {
        "title": "Construct the Enterprise Big Data Power Query & Reconciliation Gateway",
        "steps": [
            "Build the PowerQueryAdvancedMEngine modeling M functional let-in evaluation and query folding push-downs.",
            "Implement the WebScrapingHtmlExtractorEngine harvesting regulatory SEC filings with accounting parenthetical parsing.",
            "Develop the FuzzyMatchingEntityResolutionEngine resolving messy vendor strings via Jaccard and Levenshtein metrics.",
            "Construct the MultiSourceReconciliationEngine triangulating POs, warehouse GRNs, and vendor AP invoices.",
            "Deploy the consolidated EnterpriseBigDataPowerQueryGateway producing boardroom-certified reconciliation scorecards."
        ]
    },
    "parts": parts
}

# Append Day 27 to excelVizLongLessons.ts
target_ts = r"src\lib\data\excelVizLongLessons.ts"
with open(target_ts, "r", encoding="utf-8") as f:
    ts_content = f.read()

lesson_json = json.dumps(day27_lesson, indent=2)

idx = ts_content.rfind("];")
if idx == -1:
    raise ValueError("Could not find closing '];' in excelVizLongLessons.ts")

prev_text = ts_content[:idx].rstrip()
needs_comma = not prev_text.endswith(",")

new_ts_content = ts_content[:idx].rstrip()
if needs_comma:
    new_ts_content += ",\n"
else:
    new_ts_content += "\n"

new_ts_content += "  " + lesson_json.replace("\n", "\n  ") + "\n];\n"

with open(target_ts, "w", encoding="utf-8") as f:
    f.write(new_ts_content)

print("Successfully appended Day 27 to src/lib/data/excelVizLongLessons.ts!")
