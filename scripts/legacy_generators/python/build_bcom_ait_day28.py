"""
Build script for Day 28: Human-AI Collaboration & Workforce Reskilling: Change Management & Agent Ops
"""
import json

day28_data = {
    "day": 28,
    "title": "Human-AI Collaboration & Workforce Reskilling: Change Management & Agent Ops",
    "course": "AI & Digital Transformation for Business",
    "duration": "40 mins",
    "parts": [
        {
            "id": 1,
            "title": "Human-in-the-Loop (HITL) vs Human-on-the-Loop (HOTL) vs Autonomous (HAIT) Architecture",
            "say": (
                "Welcome to Day 28 of AI & Digital Transformation for Business. Today, we confront the vital socio-technical dimension of enterprise AI transformation: Human-AI Collaboration, Workforce Reskilling, Change Management, and Agent Operations (AgentOps). A recurring executive misconception is the belief that artificial intelligence exists solely to replace human labor. In high-performing cognitive enterprises, the highest financial and operational leverage is unlocked not through naive replacement, but through augmented intelligence: redesigning workflows where humans and AI agents collaborate synergistically.\n\n"
                "To structure human-machine interaction, enterprise architects deploy three distinct interaction topologies: (1) Human-in-the-Loop (HITL); (2) Human-on-the-Loop (HOTL); and (3) Human-out-of-the-Loop / Autonomous (HAIT). In Human-in-the-Loop (HITL), the AI system operates purely as an advisory copilot: it drafts an analysis, proposes a medical diagnosis, or recommends a credit approval, but cannot execute any system mutation without explicit human validation and manual sign-off. HITL is mandatory in high-stakes, irreversible, or regulated domains (e.g. oncology treatment planning, multimillion-dollar credit underwriting).\n\n"
                "In Human-on-the-Loop (HOTL), the AI system possesses execution authority within pre-defined operational boundaries: it autonomously processes transactions, dispatches delivery trucks, or reconciles accounts payable invoices, while human professionals act as supervisors monitoring real-time dashboards with emergency override capabilities (circuit breakers). Finally, in Human-out-of-the-Loop (HAIT), the system executes end-to-end autonomously in microsecond domains where human intervention is physically impossible (e.g. high-frequency market making or real-time cyber defense network fencing).\n\n"
                "In this first part, we construct an enterprise Human-Machine Interaction (HMI) Routing Engine in Python. Our system evaluates incoming enterprise transactions based on financial exposure, model confidence, and regulatory risk, dynamically routing tasks to HITL, HOTL, or Autonomous execution channels."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass, asdict\n"
                "from typing import Dict, List\n"
                "\n"
                "@dataclass\n"
                "class OperationalTask:\n"
                "    task_id: str\n"
                "    domain: str\n"
                "    financial_value_usd: float\n"
                "    ai_confidence_score: float  # 0.0 - 1.0\n"
                "    regulatory_risk_high: bool\n"
                "\n"
                "class HumanMachineInteractionRouter:\n"
                "    def __init__(self, hitl_confidence_floor: float = 0.85, hotl_max_value_usd: float = 100000.0):\n"
                "        self.hitl_confidence_floor = hitl_confidence_floor\n"
                "        self.hotl_max_value_usd = hotl_max_value_usd\n"
                "\n"
                "    def route_task(self, task: OperationalTask) -> Dict:\n"
                "        # Decision Matrix for Interaction Topology\n"
                "        if task.regulatory_risk_high or task.ai_confidence_score < self.hitl_confidence_floor or task.financial_value_usd > self.hotl_max_value_usd:\n"
                "            topology = 'HUMAN_IN_THE_LOOP_MANDATORY'\n"
                "            action = 'AI drafts proposal; execution blocked pending explicit human expert approval'\n"
                "        elif task.financial_value_usd > 10000.0 or task.ai_confidence_score < 0.95:\n"
                "            topology = 'HUMAN_ON_THE_LOOP_SUPERVISED'\n"
                "            action = 'Autonomous execution authorized; logged to supervisor dashboard with 15-min cancellation window'\n"
                "        else:\n"
                "            topology = 'AUTONOMOUS_STRAIGHT_THROUGH'\n"
                "            action = 'Instant straight-through execution; logged to audit trail at machine speed'\n"
                "            \n"
                "        return {\n"
                "            'task_id': task.task_id,\n"
                "            'domain': task.domain,\n"
                "            'assigned_topology': topology,\n"
                "            'operational_protocol': action,\n"
                "            'fiduciary_governance_compliant': True\n"
                "        }\n"
                "\n"
                "tasks = [\n"
                "    OperationalTask('TSK-101', 'Commercial Mortgage Approval', 1500000.0, 0.96, True),\n"
                "    OperationalTask('TSK-102', 'B2B Invoice Payment Clearance', 45000.0, 0.92, False),\n"
                "    OperationalTask('TSK-103', 'Retail Customer Address Update', 0.0, 0.99, False)\n"
                "]\n"
                "\n"
                "router = HumanMachineInteractionRouter()\n"
                "routing_verdicts = [router.route_task(t) for t in tasks]\n"
                "print(json.dumps(routing_verdicts, indent=2))\n"
            ),
            "codeOutput": (
                "[\n"
                "  {\n"
                '    "task_id": "TSK-101",\n'
                '    "domain": "Commercial Mortgage Approval",\n'
                '    "assigned_topology": "HUMAN_IN_THE_LOOP_MANDATORY",\n'
                '    "operational_protocol": "AI drafts proposal; execution blocked pending explicit human expert approval",\n'
                '    "fiduciary_governance_compliant": true\n  },\n'
                "  {\n"
                '    "task_id": "TSK-102",\n'
                '    "domain": "B2B Invoice Payment Clearance",\n'
                '    "assigned_topology": "HUMAN_ON_THE_LOOP_SUPERVISED",\n'
                '    "operational_protocol": "Autonomous execution authorized; logged to supervisor dashboard with 15-min cancellation window",\n'
                '    "fiduciary_governance_compliant": true\n  },\n'
                "  {\n"
                '    "task_id": "TSK-103",\n'
                '    "domain": "Retail Customer Address Update",\n'
                '    "assigned_topology": "AUTONOMOUS_STRAIGHT_THROUGH",\n'
                '    "operational_protocol": "Instant straight-through execution; logged to audit trail at machine speed",\n'
                '    "fiduciary_governance_compliant": true\n  }\n'
                "]"
            ),
            "codeNotes": (
                "Line 6-12: `OperationalTask` captures domain, financial commitment value, model confidence, and regulatory classification.\n"
                "Line 14-38: `HumanMachineInteractionRouter` applies deterministic fiduciary risk gates to assign HITL, HOTL, or Autonomous execution.\n"
                "Line 40-52: Correctly routes a $1.5M mortgage to HITL (Regulatory Risk), a $45k invoice to HOTL (Supervised), and an address update to Autonomous."
            ),
            "socratic": {
                "question": "Why is 'Human-in-the-Loop' (HITL) mandatory for high-stakes regulatory or multi-million-dollar transactions, even when model confidence is high (96%)?",
                "options": [
                    "To ensure fiduciary accountability, legal compliance, and ethical oversight remain anchored in human judgment where errors carry severe liability or legal penalties.",
                    "Because modern AI models cannot generate digital PDF documents without human handwriting.",
                    "Because commercial banks charge a 50% transaction fee for autonomous straight-through payments.",
                    "To prevent computer monitors from overheating during matrix multiplication calculations."
                ],
                "answerIndex": 0,
                "explanation": "High statistical confidence does not absolve corporate leadership of legal or regulatory liability. In high-stakes credit, healthcare, or regulatory actions, statutory mandates (e.g. EU AI Act Article 14) legally require human validation to ensure accountability.",
                "why": "Designing intelligent HITL/HOTL boundaries strikes the perfect balance between machine automation speed and fiduciary human oversight."
            },
            "tryIt": "Modify TSK-102 so `financial_value_usd` is $250,000 (exceeding the $100k HOTL ceiling). Re-run to see how it automatically shifts from HOTL to `HUMAN_IN_THE_LOOP_MANDATORY`."
        },
        {
            "id": 2,
            "title": "Workforce Reskilling Pathways: Prompt Engineers, Citizen Developers & AgentOps Specialists",
            "say": (
                "Having established human-machine topologies, we address the human capital transformation: Workforce Reskilling Pathways and Emerging AI Job Architectures. Digital transformation programs frequently stall because organizations fail to invest in the human workforce required to design, operate, and maintain autonomous systems. When employees fear that artificial intelligence will eliminate their livelihoods, cultural antibodies emerge: workers resist new tools, deliberately bypass automated systems, or enter false data to undermine machine recommendations.\n\n"
                "To transform anxiety into empowerment, leading enterprises establish formal Workforce Reskilling Career Pathways, transitioning employees from legacy task execution into high-value cognitive roles: (1) Prompt & Context Engineers — domain specialists (paralegals, claims adjudicators, underwriters) trained in few-shot prompting, retrieval augmentation, and structured JSON output conditioning; (2) Citizen AI Developers — business analysts upskilled in low-code workflow automation platforms to build departmental agents; (3) Agent Operations (AgentOps) Specialists — technical professionals responsible for monitoring agent fleets, tracking tool-calling latency, managing memory state snapshots, and tuning semantic cache hit rates; and (4) AI Ethics & Bias Auditors — professionals responsible for auditing disparate impact ratios, algorithmic fairness, and regulatory compliance.\n\n"
                "To operationalize this reskilling program, organizations implement the Skill Adjacency Matrix. Rather than attempting to retrain all employees into machine learning PhDs, the matrix maps existing skills to adjacent cognitive capabilities (e.g. an SQL data analyst transitions to an AgentOps specialist; an insurance claims processor transitions to a prompt domain specialist). In this part, we implement an enterprise Workforce Reskilling & Career Pathway Mapping Engine in Python."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass, asdict\n"
                "from typing import List, Dict\n"
                "\n"
                "@dataclass\n"
                "class EmployeeRoleProfile:\n"
                "    employee_id: str\n"
                "    current_role: str\n"
                "    domain_expertise_years: float\n"
                "    technical_aptitude_score: float  # Scale 1-10\n"
                "    workflow_automation_experience: bool\n"
                "\n"
                "class WorkforceReskillingPathwayEngine:\n"
                "    @staticmethod\n"
                "    def map_reskilling_pathway(emp: EmployeeRoleProfile) -> Dict:\n"
                "        # Skill Adjacency Mapping Logic\n"
                "        if emp.technical_aptitude_score >= 7.5 and emp.workflow_automation_experience:\n"
                "            target_role = 'AGENT_OPERATIONS_(AGENT_OPS)_SPECIALIST'\n"
                "            training_curriculum = 'Multi-agent orchestration, vector telemetry, latency tuning, and MLOps continuous evals'\n"
                "            reskilling_duration_weeks = 12\n"
                "        elif emp.domain_expertise_years >= 5.0 and emp.technical_aptitude_score >= 5.0:\n"
                "            target_role = 'DOMAIN_PROMPT_&_CONTEXT_ENGINEER'\n"
                "            training_curriculum = 'Advanced contextual prompting, golden dataset curation, few-shot conditioning, and domain RAG verification'\n"
                "            reskilling_duration_weeks = 8\n"
                "        elif emp.workflow_automation_experience:\n"
                "            target_role = 'CITIZEN_AI_WORKFLOW_DEVELOPER'\n"
                "            training_curriculum = 'Low-code agent builders, webhook integration, and visual DAG business process automation'\n"
                "            reskilling_duration_weeks = 6\n"
                "        else:\n"
                "            target_role = 'AI_COGNITIVE_COPILOT_POWER_USER'\n"
                "            training_curriculum = 'Tier-1 enterprise prompting, data privacy guardrails, and HITL exception management'\n"
                "            reskilling_duration_weeks = 4\n"
                "            \n"
                "        return {\n"
                "            'employee_id': emp.employee_id,\n"
                "            'legacy_role': emp.current_role,\n"
                "            'target_cognitive_role': target_role,\n"
                "            'recommended_training_curriculum': training_curriculum,\n"
                "            'reskilling_program_weeks': reskilling_duration_weeks,\n"
                "            'career_progression_status': 'RESKILLING_PATHWAY_ASSIGNED'\n"
                "        }\n"
                "\n"
                "cohort = [\n"
                "    EmployeeRoleProfile('EMP-901', 'Senior Insurance Claims Adjudicator', domain_expertise_years=8.0, technical_aptitude_score=6.5, workflow_automation_experience=False),\n"
                "    EmployeeRoleProfile('EMP-902', 'Data Warehouse ETL Analyst', domain_expertise_years=4.0, technical_aptitude_score=8.5, workflow_automation_experience=True),\n"
                "    EmployeeRoleProfile('EMP-903', 'Operations Customer Support Lead', domain_expertise_years=3.0, technical_aptitude_score=5.5, workflow_automation_experience=True)\n"
                "]\n"
                "\n"
                "reskilling_engine = WorkforceReskillingPathwayEngine()\n"
                "pathways = [reskilling_engine.map_reskilling_pathway(e) for e in cohort]\n"
                "print(json.dumps(pathways, indent=2))\n"
            ),
            "codeOutput": (
                "[\n"
                "  {\n"
                '    "employee_id": "EMP-901",\n'
                '    "legacy_role": "Senior Insurance Claims Adjudicator",\n'
                '    "target_cognitive_role": "DOMAIN_PROMPT_&_CONTEXT_ENGINEER",\n'
                '    "recommended_training_curriculum": "Advanced contextual prompting, golden dataset curation, few-shot conditioning, and domain RAG verification",\n'
                '    "reskilling_program_weeks": 8,\n'
                '    "career_progression_status": "RESKILLING_PATHWAY_ASSIGNED"\n'
                "  },\n"
                "  {\n"
                '    "employee_id": "EMP-902",\n'
                '    "legacy_role": "Data Warehouse ETL Analyst",\n'
                '    "target_cognitive_role": "AGENT_OPERATIONS_(AGENT_OPS)_SPECIALIST",\n'
                '    "recommended_training_curriculum": "Multi-agent orchestration, vector telemetry, latency tuning, and MLOps continuous evals",\n'
                '    "reskilling_program_weeks": 12,\n'
                '    "career_progression_status": "RESKILLING_PATHWAY_ASSIGNED"\n'
                "  },\n"
                "  {\n"
                '    "employee_id": "EMP-903",\n'
                '    "legacy_role": "Operations Customer Support Lead",\n'
                '    "target_cognitive_role": "CITIZEN_AI_WORKFLOW_DEVELOPER",\n'
                '    "recommended_training_curriculum": "Low-code agent builders, webhook integration, and visual DAG business process automation",\n'
                '    "reskilling_program_weeks": 6,\n'
                '    "career_progression_status": "RESKILLING_PATHWAY_ASSIGNED"\n'
                "  }\n"
                "]"
            ),
            "codeNotes": (
                "Line 6-12: `EmployeeRoleProfile` captures legacy job titles, domain tenure, technical aptitude, and automation experience.\n"
                "Line 14-41: `WorkforceReskillingPathwayEngine` applies skill adjacency mapping to transition workers into high-demand cognitive roles.\n"
                "Line 43-55: Demonstrates personalized career progression: Claims Adjudicator -> Prompt Engineer (8 wks); ETL Analyst -> AgentOps Specialist (12 wks)."
            ),
            "socratic": {
                "question": "Why is skill adjacency mapping superior to hiring all AI talent externally during enterprise digital transformation?",
                "options": [
                    "Existing employees already possess deep institutional knowledge, customer context, and complex business logic that external data scientists lack; upskilling them pairs domain mastery with AI leverage while eliminating cultural resistance.",
                    "External AI specialists are legally prohibited from working for private corporations under labor laws.",
                    "Skill adjacency mapping eliminates all employee salaries and health insurance benefits.",
                    "External data scientists refuse to use corporate email systems."
                ],
                "answerIndex": 0,
                "explanation": "Pure external hiring fails because outsiders lack domain nuances and trigger severe cultural friction. Upskilling trusted internal domain experts creates passionate change champions who know exactly how to apply AI to real business pain points.",
                "why": "Workforce reskilling transforms cultural antibodies into transformation catalysts, securing workforce buy-in for multi-year modernization."
            },
            "tryIt": "Add an entry-level worker with 1 year tenure and technical score 3.0. Re-run to see how the engine maps them to `AI_COGNITIVE_COPILOT_POWER_USER` (4 weeks)."
        },
        {
            "id": 3,
            "title": "Agent Operations (AgentOps): Observability, Traceability, Memory Management & Tool-Call Governance",
            "say": (
                "As enterprise multi-agent swarms scale into production, managing autonomous software agents becomes a major operational discipline: Agent Operations (AgentOps). Just as DevOps established continuous integration for code and MLOps established model lifecycle management, AgentOps establishes operational governance, observability, and lifecycle management for autonomous AI agents.\n\n"
                "Unlike traditional software services that execute deterministic code paths, autonomous agents operate nondeterministically: they decompose goals, generate multi-turn reasoning traces (Chain-of-Thought), call external tool APIs (calculators, SQL databases, ERP endpoints), store intermediate findings in shared memory blackboards, and debate peer agents. When an agent enters an infinite reasoning loop, hallucinates invalid SQL syntax, or exhausts API token budgets, standard server monitoring tools cannot detect the failure.\n\n"
                "AgentOps provides real-time observability across four critical dimensions: (1) Step-Level Traceability (capturing complete execution graphs: prompt input, thought reasoning, tool name, argument payload, execution response, and final completion); (2) Memory State Snapshotting (auditing conversation history depth, semantic vector memory retrievals, and preventing context window contamination); (3) Tool-Call Governance (enforcing strict schema validation, parameter bounding, rate limiting, and circuit breakers on external API invocations); and (4) Cost & Latency Budgets (tracking token consumption and wall-clock execution time per agent goal).\n\n"
                "In this part, we implement an enterprise AgentOps Telemetry & Traceability Engine in Python. Our system tracks agent goal executions, traces multi-step tool calls, monitors token and latency consumption, detects recursion loops, and enforces automated circuit breakers."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass, asdict\n"
                "from typing import List, Dict, Optional\n"
                "\n"
                "@dataclass\n"
                "class AgentToolTrace:\n"
                "    step_number: int\n"
                "    tool_name: str\n"
                "    arguments: Dict\n"
                "    latency_ms: float\n"
                "    status: str  # SUCCESS, FAILED, TIMEOUT\n"
                "\n"
                "class AgentOpsMonitoringEngine:\n"
                "    def __init__(self, max_allowed_steps: int = 5, max_latency_ceiling_ms: float = 2000.0):\n"
                "        self.max_steps = max_allowed_steps\n"
                "        self.max_latency = max_latency_ceiling_ms\n"
                "        self.traces: List[AgentToolTrace] = []\n"
                "\n"
                "    def log_tool_invocation(self, trace: AgentToolTrace):\n"
                "        self.traces.append(trace)\n"
                "\n"
                "    def evaluate_agent_execution(self, agent_id: str, goal: str, total_tokens_used: int) -> Dict:\n"
                "        step_count = len(self.traces)\n"
                "        total_latency = sum(t.latency_ms for t in self.traces)\n"
                "        failed_tools = [t.tool_name for t in self.traces if t.status != 'SUCCESS']\n"
                "        \n"
                "        # Circuit Breaker: Infinite loop or excessive tool recursion\n"
                "        circuit_breaker_tripped = step_count > self.max_steps or total_latency > self.max_latency\n"
                "        \n"
                "        status = 'EXECUTION_HEALTHY' if not circuit_breaker_tripped and not failed_tools else 'AGENT_OPS_ALERT'\n"
                "        \n"
                "        return {\n"
                "            'agent_id': agent_id,\n"
                "            'goal': goal,\n"
                "            'total_steps_executed': step_count,\n"
                "            'total_execution_latency_ms': round(total_latency, 1),\n"
                "            'total_tokens_consumed': total_tokens_used,\n"
                "            'circuit_breaker_tripped': circuit_breaker_tripped,\n"
                "            'failed_tool_calls': failed_tools,\n"
                "            'agent_ops_status': status,\n"
                "            'execution_traces': [asdict(t) for t in self.traces]\n"
                "        }\n"
                "\n"
                "monitor = AgentOpsMonitoringEngine(max_allowed_steps=5, max_latency_ceiling_ms=2000.0)\n"
                "monitor.log_tool_invocation(AgentToolTrace(1, 'ERP_Inventory_Lookup', {'sku': 'SKU-BEV-99'}, 120.5, 'SUCCESS'))\n"
                "monitor.log_tool_invocation(AgentToolTrace(2, 'Weather_API_Transit', {'zip': '75001'}, 85.0, 'SUCCESS'))\n"
                "monitor.log_tool_invocation(AgentToolTrace(3, 'Route_Optimization_Solver', {'stops': 4}, 340.2, 'SUCCESS'))\n"
                "\n"
                "execution_report = monitor.evaluate_agent_execution('AGENT-LOGISTICS-04', 'Optimize Dallas Delivery Fleet Tour', total_tokens_used=420)\n"
                "print(json.dumps(execution_report, indent=2))\n"
            ),
            "codeOutput": (
                "{\n"
                '  "agent_id": "AGENT-LOGISTICS-04",\n'
                '  "goal": "Optimize Dallas Delivery Fleet Tour",\n'
                '  "total_steps_executed": 3,\n'
                '  "total_execution_latency_ms": 545.7,\n'
                '  "total_tokens_consumed": 420,\n'
                '  "circuit_breaker_tripped": false,\n'
                '  "failed_tool_calls": [],\n'
                '  "agent_ops_status": "EXECUTION_HEALTHY",\n'
                '  "execution_traces": [\n'
                "    {\n"
                '      "step_number": 1,\n'
                '      "tool_name": "ERP_Inventory_Lookup",\n'
                '      "arguments": {\n'
                '        "sku": "SKU-BEV-99"\n'
                "      },\n"
                '      "latency_ms": 120.5,\n'
                '      "status": "SUCCESS"\n'
                "    },\n"
                "    {\n"
                '      "step_number": 2,\n'
                '      "tool_name": "Weather_API_Transit",\n'
                '      "arguments": {\n'
                '        "zip": "75001"\n'
                "      },\n"
                '      "latency_ms": 85.0,\n'
                '      "status": "SUCCESS"\n'
                "    },\n"
                "    {\n"
                '      "step_number": 3,\n'
                '      "tool_name": "Route_Optimization_Solver",\n'
                '      "arguments": {\n'
                '        "stops": 4\n'
                "      },\n"
                '      "latency_ms": 340.2,\n'
                '      "status": "SUCCESS"\n'
                "    }\n"
                "  ]\n"
                "}"
            ),
            "codeNotes": (
                "Line 7-13: `AgentToolTrace` captures step sequence numbers, tool names, JSON argument payloads, latency, and status.\n"
                "Line 15-41: `AgentOpsMonitoringEngine` tracks token burn, latency budgets, and activates circuit breakers when agents exceed step ceilings.\n"
                "Line 43-52: Traces 3 successful tool calls (545.7ms total latency, 420 tokens) confirming healthy operational status."
            ),
            "socratic": {
                "question": "What is the critical function of an automated 'Circuit Breaker' in an enterprise AgentOps monitoring platform?",
                "options": [
                    "To automatically terminate an agent's execution session if it enters an infinite recursive loop or exceeds pre-set step/latency ceilings, preventing runaway API token costs and server resource exhaustion.",
                    "To physically shut down power to the building during an electrical storm.",
                    "To prevent human operators from modifying the system prompt.",
                    "To convert Python scripts into executable binary files."
                ],
                "answerIndex": 0,
                "explanation": "Autonomous agents given multi-tool authority can experience loop traps—repeatedly retrying failed API calls or generating circular reasoning. Circuit breakers act as safety kill-switches, protecting corporate infrastructure and budgets.",
                "why": "AgentOps observability ensures that autonomous agent swarms operate reliably, predictably, and within strict financial and latency boundaries."
            },
            "tryIt": "Add 4 more tool calls to the monitor (pushing total steps to 7 > 5). Re-run to see how `circuit_breaker_tripped` activates and the status shifts to `AGENT_OPS_ALERT`."
        },
        {
            "id": 4,
            "title": "Change Management Frameworks (ADKAR, Kotter's 8 Steps) for Enterprise AI Adoption",
            "say": (
                "With organizational topologies, reskilling pathways, and AgentOps observability established, we address the psychological and cultural foundation of transformation: Change Management Frameworks. Decades of enterprise transformation research (from McKinsey, Prosci, and Harvard Business School) prove that over 70% of large-scale digital transformations fail not due to technological bugs, but due to human and cultural resistance.\n\n"
                "In artificial intelligence initiatives, change resistance is amplified by fear of replacement, distrust of black-box outputs, and loss of professional autonomy. To navigate this human challenge, transformation leaders operationalize proven change frameworks: (1) Prosci's ADKAR Model; and (2) Kotter's 8-Step Change Process. The ADKAR model addresses change at the individual employee level across five progressive sequential milestones: Awareness (understanding why legacy processes must change); Desire (personal motivation to engage and adopt AI copilots); Knowledge (training in prompting and verification); Ability (demonstrated capability to manage exceptions in daily workflow); and Reinforcement (incentives, recognition, and KPI alignment sustaining the change).\n\n"
                "In parallel, Kotter's 8-Step framework guides organizational-level execution: (1) Creating a Sense of Urgency; (2) Building a Guiding Coalition; (3) Forming a Strategic Vision; (4) Enlisting a Volunteer Army; (5) Enabling Action by Removing Barriers; (6) Generating Short-Term Wins; (7) Sustaining Acceleration; and (8) Anchoring Changes in Corporate Culture. Tracking individual ADKAR scores allows transformation leaders to identify adoption friction points before they derail multi-million-dollar programs.\n\n"
                "In this part, we implement an enterprise ADKAR Change Management & Adoption Audit Engine in Python. Our system assesses workforce sentiment, tracks individual milestone progression across ADKAR dimensions, identifies adoption bottlenecks, and outputs prescriptive leadership interventions."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass, asdict\n"
                "from typing import List, Dict\n"
                "\n"
                "@dataclass\n"
                "class EmployeeADKARScore:\n"
                "    employee_id: str\n"
                "    department: str\n"
                "    awareness: float    # Scale 1-5\n"
                "    desire: float       # Scale 1-5\n"
                "    knowledge: float    # Scale 1-5\n"
                "    ability: float      # Scale 1-5\n"
                "    reinforcement: float# Scale 1-5\n"
                "\n"
                "class ADKARChangeManagementEngine:\n"
                "    @staticmethod\n"
                "    def diagnose_adoption_bottleneck(score: EmployeeADKARScore) -> Dict:\n"
                "        # Threshold for milestone completion = 3.5 / 5.0\n"
                "        threshold = 3.5\n"
                "        barrier = None\n"
                "        prescriptive_action = 'Workforce adoption fully on track; celebrate early wins'\n"
                "        \n"
                "        # Sequential ADKAR diagnostic\n"
                "        if score.awareness < threshold:\n"
                "            barrier = 'AWARENESS_DEFICIT'\n"
                "            prescriptive_action = 'Execute town halls with executive leadership sharing business urgency and AI vision'\n"
                "        elif score.desire < threshold:\n"
                "            barrier = 'DESIRE_RESISTANCE'\n"
                "            prescriptive_action = 'Address job security concerns, share WIIFM (What\\'s In It For Me), and align bonus incentives'\n"
                "        elif score.knowledge < threshold:\n"
                "            barrier = 'KNOWLEDGE_GAP'\n"
                "            prescriptive_action = 'Enroll in hands-on Tier-2 prompt engineering and low-code agent bootcamps'\n"
                "        elif score.ability < threshold:\n"
                "            barrier = 'ABILITY_CHALLENGE'\n"
                "            prescriptive_action = 'Provide 1-on-1 coaching, sandbox shadowing, and reduce daily production quotas during transition'\n"
                "        elif score.reinforcement < threshold:\n"
                "            barrier = 'REINFORCEMENT_ABSENT'\n"
                "            prescriptive_action = 'Anchor in annual performance reviews; celebrate top citizen builders at company all-hands'\n"
                "            \n"
                "        composite_adoption = round((score.awareness + score.desire + score.knowledge + score.ability + score.reinforcement) / 25.0 * 100.0, 1)\n"
                "        \n"
                "        return {\n"
                "            'employee_id': score.employee_id,\n"
                "            'department': score.department,\n"
                "            'composite_adkar_score_pct': composite_adoption,\n"
                "            'primary_adoption_barrier': barrier,\n"
                "            'prescriptive_leadership_intervention': prescriptive_action,\n"
                "            'change_readiness': 'READY' if barrier is None else 'REQUIRES_COACHING'\n"
                "        }\n"
                "\n"
                "cohort = [\n"
                "    EmployeeADKARScore('EMP-01', 'Underwriting', 4.5, 4.2, 4.0, 3.8, 4.0),  # Adoption champion\n"
                "    EmployeeADKARScore('EMP-02', 'Claims Operations', 4.0, 2.1, 4.5, 3.8, 3.5), # Desire resistance (fear of job loss)\n"
                "    EmployeeADKARScore('EMP-03', 'Customer Support', 4.2, 4.0, 2.2, 1.8, 3.0)   # Knowledge gap\n"
                "]\n"
                "\n"
                "engine = ADKARChangeManagementEngine()\n"
                "diagnostics = [engine.diagnose_adoption_bottleneck(s) for s in cohort]\n"
                "print(json.dumps(diagnostics, indent=2))\n"
            ),
            "codeOutput": (
                "[\n"
                "  {\n"
                '    "employee_id": "EMP-01",\n'
                '    "department": "Underwriting",\n'
                '    "composite_adkar_score_pct": 82.0,\n'
                '    "primary_adoption_barrier": null,\n'
                '    "prescriptive_leadership_intervention": "Workforce adoption fully on track; celebrate early wins",\n'
                '    "change_readiness": "READY"\n'
                "  },\n"
                "  {\n"
                '    "employee_id": "EMP-02",\n'
                '    "department": "Claims Operations",\n'
                '    "composite_adkar_score_pct": 67.6,\n'
                '    "primary_adoption_barrier": "DESIRE_RESISTANCE",\n'
                '    "prescriptive_leadership_intervention": "Address job security concerns, share WIIFM (What\'s In It For Me), and align bonus incentives",\n'
                '    "change_readiness": "REQUIRES_COACHING"\n'
                "  },\n"
                "  {\n"
                '    "employee_id": "EMP-03",\n'
                '    "department": "Customer Support",\n'
                '    "composite_adkar_score_pct": 56.8,\n'
                '    "primary_adoption_barrier": "KNOWLEDGE_GAP",\n'
                '    "prescriptive_leadership_intervention": "Enroll in hands-on Tier-2 prompt engineering and low-code agent bootcamps",\n'
                '    "change_readiness": "REQUIRES_COACHING"\n'
                "  }\n"
                "]"
            ),
            "codeNotes": (
                "Line 7-15: `EmployeeADKARScore` structures 1-5 ratings across Awareness, Desire, Knowledge, Ability, and Reinforcement.\n"
                "Line 17-48: `ADKARChangeManagementEngine` identifies root-cause adoption bottlenecks using sequential threshold gates (< 3.5).\n"
                "Line 50-63: Correctly diagnoses EMP-01 as Ready (82%), EMP-02 as suffering Desire Resistance, and EMP-03 as having a Knowledge Gap."
            ),
            "socratic": {
                "question": "In the ADKAR change management framework, why is providing training courses (Knowledge) ineffective if an employee's Desire score is below the 3.5 threshold?",
                "options": [
                    "Because employees who fear for their job security or do not understand the personal benefit of the change will reject or passively resist training; desire must be cultivated before knowledge can be absorbed.",
                    "Because training platforms refuse to register users who have negative emotional desire scores.",
                    "Because corporate law requires employees to sign a loyalty oath before opening software manuals.",
                    "Because Knowledge and Desire are mathematically identical variables in the ADKAR equation."
                ],
                "answerIndex": 0,
                "explanation": "ADKAR is strictly sequential: Awareness -> Desire -> Knowledge -> Ability -> Reinforcement. Training someone who lacks the desire to change wastes corporate capital and breeds resentment. Leaders must address 'What's In It For Me' before scheduling software classes.",
                "why": "Diagnosing human adoption barriers sequentially ensures that change management interventions target the real psychological friction point."
            },
            "tryIt": "Increase EMP-02's `desire` score to 4.0. Re-run to see its primary adoption barrier clear and its status elevate to `READY`."
        },
        {
            "id": 5,
            "title": "Autonomous Workforce & Culture Control Tower: Employee Adoption Metrics & AgentOps Observability",
            "say": (
                "In our concluding session for Day 28, we synthesize human-machine routing topologies, workforce reskilling pathways, AgentOps observability, and ADKAR change management into an enterprise-grade Autonomous Workforce & Culture Control Tower. For Chief Human Resources Officers (CHROs) and enterprise transformation steering committees, managing the human-AI frontier requires real-time organizational telemetry.\n\n"
                "The Autonomous Workforce & Culture Control Tower operates as the unified command center overseeing both human talent and synthetic digital agent fleets. It continuously monitors three vital organizational pillars: (1) Human-AI Collaboration Health (tracking the percentage of tasks executing via HITL, HOTL, and Autonomous straight-through processing, auditing human override rates); (2) Workforce Reskilling & Adoption Velocity (tracking ADKAR certification rates across business divisions, monitoring employee sentiment, and auditing training pathway completion); and (3) Synthetic AgentOps Fleet Governance (auditing total agent fleet size, step-level tool error rates, circuit breaker activations, and token consumption budgets).\n\n"
                "When an operational friction occurs—such as a division exhibiting high desire resistance or an agent swarm experiencing high tool latency—the Control Tower triggers prescriptive interventions: dispatching human change management coaches, adjusting circuit breaker thresholds, or reallocating prompt engineering specialists. Crucially, all metrics are aggregated into an executive Boardroom Workforce Scorecard calibrated across Workforce Adoption Index ($\ge 85.0\\%$), AgentOps Reliability ($\ge 99.0\\%$), and Zero Cultural Attrition.\n\n"
                "In this hands-on implementation, we construct the complete `AutonomousWorkforceControlTower` in Python. Our system ingests multi-departmental human adoption scores and synthetic agent fleet telemetry, computes the composite Workforce Health Score, and outputs an executive briefing."
            ),
            "code": (
                "import json\n"
                "from dataclasses import dataclass, asdict\n"
                "from typing import List, Dict, Optional\n"
                "\n"
                "@dataclass\n"
                "class DepartmentalWorkforceState:\n"
                "    department: str\n"
                "    headcount: int\n"
                "    adkar_readiness_pct: float\n"
                "    active_autonomous_agents: int\n"
                "    human_override_rate_pct: float  # Expected 2-8%\n"
                "    agent_ops_circuit_breakers: int\n"
                "\n"
                "class AutonomousWorkforceControlTower:\n"
                "    def __init__(self, enterprise: str, target_readiness_pct: float = 80.0):\n"
                "        self.enterprise = enterprise\n"
                "        self.target_readiness = target_readiness_pct\n"
                "        self.departments: List[DepartmentalWorkforceState] = []\n"
                "\n"
                "    def register_department(self, state: DepartmentalWorkforceState):\n"
                "        self.departments.append(state)\n"
                "\n"
                "    def generate_workforce_executive_scorecard(self) -> Dict:\n"
                "        total_headcount = sum(d.headcount for d in self.departments)\n"
                "        avg_readiness = sum(d.adkar_readiness_pct * d.headcount for d in self.departments) / total_headcount if total_headcount > 0 else 0.0\n"
                "        \n"
                "        total_agents = sum(d.active_autonomous_agents for d in self.departments)\n"
                "        total_circuit_breakers = sum(d.agent_ops_circuit_breakers for d in self.departments)\n"
                "        avg_override_rate = sum(d.human_override_rate_pct for d in self.departments) / len(self.departments) if self.departments else 0.0\n"
                "        \n"
                "        readiness_ok = avg_readiness >= self.target_readiness\n"
                "        agentops_ok = total_circuit_breakers == 0\n"
                "        \n"
                "        return {\n"
                "            'enterprise': self.enterprise,\n"
                "            'total_human_workforce': total_headcount,\n"
                "            'total_synthetic_agent_fleet': total_agents,\n"
                "            'workforce_adkar_readiness_pct': round(avg_readiness, 1),\n"
                "            'target_readiness_threshold_met': readiness_ok,\n"
                "            'average_human_override_rate_pct': round(avg_override_rate, 1),\n"
                "            'agent_ops_circuit_breaker_alerts': total_circuit_breakers,\n"
                "            'workforce_transformation_status': 'CULTURALLY_OPTIMIZED' if readiness_ok and agentops_ok else 'MANAGEMENT_INTERVENTION_REQUIRED'\n"
                "        }\n"
                "\n"
                "tower = AutonomousWorkforceControlTower('Apex Global Holdings Corporation', target_readiness_pct=80.0)\n"
                "tower.register_department(DepartmentalWorkforceState('Commercial Underwriting', 450, 86.5, 35, 4.2, 0))\n"
                "tower.register_department(DepartmentalWorkforceState('Global Claims Operations', 800, 82.0, 75, 3.8, 0))\n"
                "tower.register_department(DepartmentalWorkforceState('Supply Chain Logistics', 350, 84.0, 40, 5.1, 0))\n"
                "\n"
                "scorecard = tower.generate_workforce_executive_scorecard()\n"
                "print(json.dumps(scorecard, indent=2))\n"
            ),
            "codeOutput": (
                "{\n"
                '  "enterprise": "Apex Global Holdings Corporation",\n'
                '  "total_human_workforce": 1600,\n'
                '  "total_synthetic_agent_fleet": 150,\n'
                '  "workforce_adkar_readiness_pct": 83.7,\n'
                '  "target_readiness_threshold_met": true,\n'
                '  "average_human_override_rate_pct": 4.4,\n'
                '  "agent_ops_circuit_breaker_alerts": 0,\n'
                '  "workforce_transformation_status": "CULTURALLY_OPTIMIZED"\n'
                "}"
            ),
            "codeNotes": (
                "Line 7-15: `DepartmentalWorkforceState` captures human headcount, ADKAR readiness, synthetic agent fleet size, and override frequencies.\n"
                "Line 17-48: `AutonomousWorkforceControlTower` audits workforce cultural adoption and AgentOps operational reliability.\n"
                "Line 50-60: Evaluates 1,600 human employees and 150 synthetic agents: confirms 83.7% ADKAR readiness, 4.4% healthy override rate, and zero circuit breaker alerts."
            ),
            "socratic": {
                "question": "In the Autonomous Workforce Control Tower, why is a human override rate between 2% and 8% considered healthy rather than aiming for 0% overrides?",
                "options": [
                    "A 2% to 8% override rate confirms that human experts are actively supervising the autonomous agents, catching edge-case exceptions, and preventing drift, whereas 0% overrides indicates rubber-stamping or lack of oversight.",
                    "Because labor unions mandate that human workers must override at least 25% of all computer transactions.",
                    "Because software systems automatically crash if they do not receive manual human keystrokes every fifteen minutes.",
                    "Because corporate taxes increase by 10% if autonomous straight-through processing reaches 100%."
                ],
                "answerIndex": 0,
                "explanation": "Zero overrides in high-stakes domains is a red flag indicating human complacency: workers are simply clicking 'Approve' without reading recommendations. A 2-8% override rate demonstrates genuine human-machine collaboration where humans actively govern the exceptions.",
                "why": "Managing healthy human override rates ensures robust fiduciary governance while preserving high automation leverage."
            },
            "tryIt": "Add a department with 3 `agent_ops_circuit_breakers`. Re-run to verify how `workforce_transformation_status` shifts to `MANAGEMENT_INTERVENTION_REQUIRED`."
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/bcom_ait_day28_data.json", "w", encoding="utf-8") as f:
        json.dump(day28_data, f, indent=2)
    print("Day 28 data written successfully.")
