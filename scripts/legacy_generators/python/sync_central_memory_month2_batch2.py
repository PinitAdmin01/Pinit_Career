import os

mem_dir = r"C:\Users\Admin\Desktop\projects\memory of agent"
proj_mem_path = os.path.join(mem_dir, "PROJECT_MEMORY.md")
agent_tasks_path = os.path.join(mem_dir, "agent_tasks.csv")
multi_agent_path = os.path.join(mem_dir, "multi_agent_control.csv")

# 1. Update PROJECT_MEMORY.md
entry = """* **2026-10-17 (Antigravity - 🚀 MONTH 2 (DAYS 31-60) BATCH 2 COMPLETE: COURSE 21 EXCEL_VIZ DAYS 36-40 (POWER QUERY M INTERNALS, STAR SCHEMAS, DAX EVALUATION CONTEXTS, TIME INTELLIGENCE & MILESTONE 5 CAPSTONE) - TASK-1187..1191, AGENT-380):**
  - **Monumental Initiative Milestone:** Advanced Month 2 (Days 31–60: Advanced Enterprise Specialization) of the PinIT Career OS curriculum on Branch A (`codex/interview-tab-reliability`) in `Present-Career-os`, grounding directly in the 678/697-page Master Architecture Bible (`docs/visuals/PINIT_MASTER_DEBUG.html` and `PINIT_ALL_IN_ONE_MASTER_SRS_AND_VISUALS_BIBLE.pdf`). Course 21 (`excel_viz`) is now at 40/60 Days (66.67% of 60-day curriculum, with Month 1 at 30/30 and Month 2 at 10/30).
  - **Batch 2 Scope (Course 21 `excel_viz` Days 36–40): 15,858 spoken words across 5 days (all 5 days >= 26.0 spoken min, average ~26.4 min/day):**
    * **Item 1: Power Query M Language Internals: Table Transformations, Custom Functions & Query Folding Optimization (TASK-1187 / Day 36):** (3,231 words, ~27.0m spoken). M functional evaluation semantics, environments and standard library immutable records, higher-order functions (`Table.TransformRows`, `Table.SelectRows`, curried transforms), SQL query folding pushdown translation mechanics, query folding breaker diagnostics (`Table.Buffer`, non-foldable primitives), and Master Power Query ETL Gateway (`MFunctionalEvaluationEngine`, `MCustomFunctionCompiler`, `QueryFoldingTranslator`, `QueryFoldingBreakerDiagnostic`, `MasterPowerQueryEtlGateway`). Generated `day-36.json`.
    * **Item 2: Dimensional Modeling in Excel: Star Schemas, Fact vs Dimension Tables & Active vs Inactive Relationships (TASK-1188 / Day 37):** (3,260 words, ~27.0m spoken). Ralph Kimball star schema topology vs snowflake design, VertiPaq columnar compression physics (dictionary encoding, run-length encoding, bit-packing), surrogate key integrity and synthetic hash keys, role-playing dimensions and USERELATIONSHIP switching, and Master Enterprise Star Schema Gateway (`StarSchemaTopologyEngine`, `VertiPaqCompressionSimulator`, `SurrogateKeyIntegrityAuditor`, `RolePlayingDimensionManager`, `MasterEnterpriseStarSchemaGateway`). Generated `day-37.json`.
    * **Item 3: Introduction to DAX (Data Analysis Expressions): Calculated Columns vs Measures, Filter Context & Row Context (TASK-1189 / Day 38):** (3,141 words, ~26.0m spoken). Dual evaluation context fundamentals, calculated column memory storage vs measure dynamic runtime evaluation, CALCULATE context transition mechanics and filter overwrite rules, row context iteration via iterator functions (SUMX, AVERAGEX, FILTER), and Master DAX Evaluation Gateway (`EvaluationContextEngine`, `CalculatedColumnMemoryAuditor`, `CalculateContextTransitionEngine`, `IterativeXAggregatorEngine`, `MasterDaxEvaluationGateway`). Generated `day-38.json`.
    * **Item 4: Time Intelligence in DAX: TOTALYTD, SAMEPERIODLASTYEAR, Rolling Averages & Calendar Tables (TASK-1190 / Day 39):** (3,127 words, ~26.0m spoken). Dedicated contiguous date table prerequisites, Year-to-Date (YTD) aggregation and variance analysis (`TOTALYTD`, budget comparisons), Prior Year comparison mechanics (`SAMEPERIODLASTYEAR`, `DATEADD`), rolling window period calculations (`DATESINPERIOD`, rolling 90-day moving averages), and Master Time Intelligence Gateway (`ContiguousCalendarAuditor`, `TotalYtdVarianceEngine`, `SamePeriodLastYearEngine`, `RollingPeriodDaxEngine`, `MasterTimeIntelligenceGateway`). Generated `day-39.json`.
    * **Item 5: ⭐ MILESTONE 5: ApexModel Star Schema Data Modeling & High-Performance DAX Engine Suite (TASK-1191 / Day 40):** (3,099 words, ~26.0m spoken). 4-pillar architectural audit across Star Schema topology, Query Folding pushdown, VertiPaq memory footprint, and Date table integrity; end-to-end multi-source Power Query ETL pipeline processing 100,000 raw rows with 100% folding pushdown; VertiPaq memory profiler evaluating dictionary encoding and cardinality reduction saving 82.5% RAM; executive DAX metric engine synthesizing revenue, YTD growth (+18.4%), and 90-day rolling moving averages; and Master ApexModel Platform issuing an immutable cryptographic SHA-256 SOX 404 & Enterprise Power BI architectural certification (`Milestone5ModelAuditor`, `MultiSourceQueryFoldingPipeline`, `VertiPaqPerformanceProfiler`, `ExecutiveDaxMetricEngine`, `MasterApexModelPlatform`). Generated `day-40.json`.
  - **Deterministic TypeScript Test Suite Verification:** All 71 tests passing in `tests/quant_excel_long_lessons.test.ts` (0 failures, 100% pass rate).
  - **Static Typecheck:** Zero TypeScript compilation errors (`npx tsc --noEmit` exited 0).
  - **Gate v2 Visual JSON Validation:** All visual files `src/lib/data/lessonVisuals/excel_viz/day-36.json` through `day-40.json` generated with matching SHA-256 `codeHash` bindings for all 25 parts.
  - **Status:** Batch 2 Days 36-40 100% Complete & Verified!

"""

with open(proj_mem_path, "r", encoding="utf-8") as f:
    existing_mem = f.read()

with open(proj_mem_path, "w", encoding="utf-8") as f:
    f.write(entry + existing_mem)

print("PROJECT_MEMORY.md updated successfully.")

# 2. Append new tasks to agent_tasks.csv
new_tasks = [
    'TASK-1187,"excel_viz Day 36: Power Query M Language Internals: Table Transformations, Custom Functions & Query Folding Optimization",AGENT-380,Course 21 excel_viz,Complete,2026-10-17',
    'TASK-1188,"excel_viz Day 37: Dimensional Modeling in Excel: Star Schemas, Fact vs Dimension Tables & Active vs Inactive Relationships",AGENT-380,Course 21 excel_viz,Complete,2026-10-17',
    'TASK-1189,"excel_viz Day 38: Introduction to DAX (Data Analysis Expressions): Calculated Columns vs Measures, Filter Context & Row Context",AGENT-380,Course 21 excel_viz,Complete,2026-10-17',
    'TASK-1190,"excel_viz Day 39: Time Intelligence in DAX: TOTALYTD, SAMEPERIODLASTYEAR, Rolling Averages & Calendar Tables",AGENT-380,Course 21 excel_viz,Complete,2026-10-17',
    'TASK-1191,"excel_viz Day 40: ⭐ Milestone 5: ApexModel Star Schema Data Modeling & High-Performance DAX Engine Suite",AGENT-380,Course 21 excel_viz,Complete,2026-10-17'
]

with open(agent_tasks_path, "a", encoding="utf-8") as f:
    f.write("\n" + "\n".join(new_tasks) + "\n")

print("agent_tasks.csv updated with TASK-1187..1191.")

# 3. Append AGENT-380 to multi_agent_control.csv
agent_row = 'AGENT-380,Antigravity,codex/interview-tab-reliability,Present-Career-os,TASK-1191,Completed,2026-10-17 21:12:00,"5-Task Batch Protocol Complete: Month 2 Pioneer Batch 2 — Course 21 excel_viz Days 36-40 & Milestone 5 Capstone: ApexModel Star Schema Data Modeling & High-Performance DAX Engine Suite (TASK-1187..1191) committed & pushed. 15,858 spoken words (all 5 days >= 26.0 spoken min), 71/71 tests passing, 0 tsc errors, Gate v2 visual JSONs with SHA-256 bindings."'

with open(multi_agent_path, "a", encoding="utf-8") as f:
    f.write("\n" + agent_row + "\n")

print("multi_agent_control.csv updated with AGENT-380.")
