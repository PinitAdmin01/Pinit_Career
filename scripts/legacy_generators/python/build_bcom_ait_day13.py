import json, sys

# Day 13: Cloud AI Infrastructure & Token Economics: LLM Cost Modeling ($Cost <= $0.01/call)

part1_say = [
    "Welcome to Day 13 of AI & Digital Transformation for Business. Today, we investigate the financial engine and infrastructure architecture powering modern enterprise AI: Cloud GPU Infrastructure Tiers, Token Economics, Inference Cost Modeling, and Cloud FinOps Governance.",
    "When organizations scale generative AI from departmental prototypes to thousands of enterprise users, cloud infrastructure costs can escalate uncontrollably. If a global bank processes 10,000,000 customer inquiries a month, an unoptimized application architecture consuming $0.10 per query results in $1,000,000 in monthly cloud computing expenses ($12,000,000 annually).",
    "Enterprise Cloud AI operates across Three Infrastructure Tiers: Tier 1: Infrastructure-as-a-Service (IaaS)\u2014provisioning bare-metal GPU clusters (such as NVIDIA H100s or B200s in AWS EC2 or Google Cloud TPU v5e pods) where the enterprise pays hourly hardware reservation rates ($2.50 to $4.00 per GPU-hour) and manages CUDA drivers, orchestrators, and model weights; Tier 2: Platform-as-a-Service (PaaS / Model-as-a-Service)\u2014consuming managed foundation model APIs (such as Azure OpenAI, AWS Bedrock, Google Vertex AI, or Anthropic Claude) where the enterprise pays strictly per token processed without managing hardware; and Tier 3: Software-as-a-Service (SaaS AI)\u2014purchasing packaged end-user licenses (such as Microsoft Copilot at $30/user/month).",
    "The Chief Information Officer (CIO) and Chief Financial Officer (CFO) must establish rigorous architectural decision frameworks: knowing when to consume serverless PaaS APIs for variable workloads versus when to self-host fine-tuned open models on reserved IaaS GPU instances to minimize Total Cost of Ownership (TCO).",
    "In our institutional Python model for Part 1, we simulate an Infrastructure Tier TCO Calculator that models hardware reservation costs, managed API token bills, and software licenses to determine the optimal enterprise infrastructure deployment tier."
]

part1_code = """# Simulation: Cloud AI Infrastructure Tiers - TCO & Workload Optimization Model
class CloudAiInfrastructureTcoCalculator:
    def __init__(self):
        # Pricing parameters
        self.gpu_hourly_cost_iaas = 3.50 # Reserved NVIDIA H100 GPU instance
        self.paas_cost_per_m_tokens = 4.00 # Blended input/output rate per 1M tokens
        self.saas_license_per_user = 30.00 # Monthly seat license

    def evaluate_infrastructure_options(self, monthly_queries: int, avg_tokens_per_query: int, active_users: int) -> dict:
        total_monthly_tokens = monthly_queries * avg_tokens_per_query
        
        # Option 1: PaaS Model-as-a-Service (Pay-per-token API)
        paas_monthly_cost = (total_monthly_tokens / 1_000_000) * self.paas_cost_per_m_tokens

        # Option 2: IaaS Dedicated GPU Cluster (Assumes 2 reserved GPUs running 730 hrs/month)
        # Dedicated cluster handles up to 5,000,000 queries before scaling
        gpus_needed = max(1, (monthly_queries // 2_500_000) + 1)
        iaas_monthly_cost = gpus_needed * 730 * self.gpu_hourly_cost_iaas

        # Option 3: SaaS Per-User Seats
        saas_monthly_cost = active_users * self.saas_license_per_user

        # Optimal selection
        costs = {"PaaS_Serverless_API": paas_monthly_cost, "IaaS_Dedicated_GPU": iaas_monthly_cost, "SaaS_Per_User": saas_monthly_cost}
        optimal_tier = min(costs, key=costs.get)

        return {
            "Monthly_Query_Volume": monthly_queries,
            "Total_Monthly_Tokens": f"{total_monthly_tokens:,}",
            "PaaS_Monthly_Cost_USD": round(paas_monthly_cost, 2),
            "IaaS_Monthly_Cost_USD": round(iaas_monthly_cost, 2),
            "SaaS_Monthly_Cost_USD": round(saas_monthly_cost, 2),
            "Optimal_Infrastructure_Tier": optimal_tier,
            "Monthly_Cost_At_Optimal_USD": round(costs[optimal_tier], 2)
        }

calc = CloudAiInfrastructureTcoCalculator()
res = calc.evaluate_infrastructure_options(monthly_queries=1_000_000, avg_tokens_per_query=1500, active_users=500)

print("=== CLOUD AI INFRASTRUCTURE TCO AUDIT ===")
print(f"Monthly Queries:      {res['Monthly_Query_Volume']:,}")
print(f"PaaS Serverless Cost: ${res['PaaS_Monthly_Cost_USD']:,} / month")
print(f"IaaS Dedicated GPU:   ${res['IaaS_Monthly_Cost_USD']:,} / month")
print(f"SaaS User Seats:      ${res['SaaS_Monthly_Cost_USD']:,} / month")
print(f"Recommended Tier:     [{res['Optimal_Infrastructure_Tier']}] (Saves ${res['PaaS_Monthly_Cost_USD'] - res['Monthly_Cost_At_Optimal_USD']:,}/mo)")
"""

part1_output = """=== CLOUD AI INFRASTRUCTURE TCO AUDIT ===
Monthly Queries:      1,000,000
PaaS Serverless Cost: $6,000.0 / month
IaaS Dedicated GPU:   2,555.0 / month
SaaS User Seats:      $15,000.0 / month
Recommended Tier:     [IaaS_Dedicated_GPU] (Saves $3,445.0/mo)"""

part2_say = [
    "Now we examine the mathematical mechanics of Token Economics and LLM Inference Cost Modeling.",
    "In PaaS foundation model APIs, pricing is not based on CPU time or database bandwidth; it is billed based on Token Usage. A token is the fundamental atomic unit of text processed by language models: in the English language, one token corresponds to approximately 4 characters or roughly 0.75 words. A 1,500-word corporate memo contains approximately 2,000 tokens.",
    "Importantly, foundation model providers implement Asymmetric Pricing: Output Tokens (generated completion tokens) are priced substantially higher—often 3 to 5 times more expensive—than Input Tokens (prompt context tokens). For example, a premier model may charge $2.50 per 1,000,000 input tokens, but $10.00 per 1,000,000 output tokens. This asymmetry exists because generating tokens auto-regressively requires sequential GPU memory bandwidth passes, whereas input tokens are processed in parallel.",
    "Mathematically, the Total Cost of an LLM query is formulated as: Cost equals (Input Tokens multiplied by Input Price per Million divided by 1,000,000) plus (Output Tokens multiplied by Output Price per Million divided by 1,000,000).",
    "In enterprise AI application design, the target financial benchmark is strictly less than or equal to $0.01 per transaction ($Cost <= $0.01/call). Achieving this requires meticulous prompt engineering: restricting system instructions to concise directives and enforcing concise output lengths."
]

part2_code = """# Simulation: LLM Token Pricing Economics & Cost Modeling Engine
class TokenEconomicsEngine:
    def __init__(self, input_price_per_m: float, output_price_per_m: float):
        self.p_in = input_price_per_m
        self.p_out = output_price_per_m

    def calculate_transaction_cost(self, prompt_tokens: int, completion_tokens: int) -> dict:
        cost_in = (prompt_tokens / 1_000_000.0) * self.p_in
        cost_out = (completion_tokens / 1_000_000.0) * self.p_out
        total_cost = cost_in + cost_out

        is_under_one_cent = total_cost <= 0.01

        return {
            "Prompt_Tokens": prompt_tokens,
            "Completion_Tokens": completion_tokens,
            "Total_Tokens": prompt_tokens + completion_tokens,
            "Input_Cost_USD": round(cost_in, 6),
            "Output_Cost_USD": round(cost_out, 6),
            "Total_Transaction_Cost_USD": round(total_cost, 6),
            "Cost_Under_One_Cent": is_under_one_cent,
            "Economics_Verdict": "APPROVED_SUB_CENT_UNIT_ECONOMICS" if is_under_one_cent else "EXCESSIVE_TOKEN_BURN_OPTIMIZE_PROMPT"
        }

# Model pricing: $2.50/M input, $10.00/M output
engine = TokenEconomicsEngine(input_price_per_m=2.50, output_price_per_m=10.00)

# Scenario 1: Lean prompt (2,000 input tokens, 500 output tokens)
q1 = engine.calculate_transaction_cost(prompt_tokens=2000, completion_tokens=500)

# Scenario 2: Bloated prompt (12,000 input tokens, 1,500 output tokens)
q2 = engine.calculate_transaction_cost(prompt_tokens=12000, completion_tokens=1500)

print("=== LLM TOKEN PRICING & TRANSACTION COST AUDIT ===")
print(f"Query 1 (Lean):   Total=${q1['Total_Transaction_Cost_USD']} -> [{q1['Economics_Verdict']}]")
print(f"Query 2 (Bloated):Total=${q2['Total_Transaction_Cost_USD']} -> [{q2['Economics_Verdict']}]")
"""

part2_output = """=== LLM TOKEN PRICING & TRANSACTION COST AUDIT ===
Query 1 (Lean):   Total=$0.01 -> [APPROVED_SUB_CENT_UNIT_ECONOMICS]
Query 2 (Bloated):Total=$0.045 -> [EXCESSIVE_TOKEN_BURN_OPTIMIZE_PROMPT]"""

part3_say = [
    "To drive inference costs below $0.01 while accelerating generation speeds, enterprise AI engineering employs Model Optimization: Quantization, Speculative Decoding, and Small Language Models (SLMs).",
    "Foundation models are natively trained using 16-bit floating point weights (FP16 or BF16), meaning each neural network weight parameter occupies 2 bytes of GPU VRAM memory. A 70-billion parameter model requires over 140 gigabytes of high-bandwidth GPU memory solely to hold its weights, necessitating two top-tier 80GB NVIDIA H100 GPUs.",
    "Quantization is the mathematical technique of mapping high-precision 16-bit weights into lower-precision representations, such as 8-bit integers (INT8) or 4-bit representations (INT4, AWQ, or GPTQ). Quantizing a model to 4-bit shrinks its memory footprint by 75%: allowing a 70B parameter model to run on a single 40GB or 48GB GPU with less than 1% degradation in cognitive reasoning capability.",
    "Concurrently, enterprises deploy Small Language Models (SLMs, such as Llama 3 8B, Mistral 7B, or Phi-3) for specialized tasks: using a lightweight 8B model for classification, summarization, and entity extraction at 1/10th the cost of an enormous frontier model.",
    "In our institutional Python model for Part 3, we simulate a Model Quantization and VRAM Sizing Engine that calculates memory savings, GPU count requirements, and inference cost reduction across FP16, INT8, and INT4 precision levels."
]

part3_code = """# Simulation: Enterprise Model Optimization - Quantization & VRAM Sizing Engine
class ModelQuantizationOptimizer:
    def __init__(self, parameter_count_billions: float):
        self.params_b = parameter_count_billions

    def evaluate_quantization_levels(self) -> dict:
        # VRAM footprint: Params * bytes_per_param * 1.2 (20% KV-cache and activation overhead)
        vram_fp16 = round(self.params_b * 2.0 * 1.2, 1)  # 2 bytes/param
        vram_int8 = round(self.params_b * 1.0 * 1.2, 1)  # 1 byte/param
        vram_int4 = round(self.params_b * 0.5 * 1.2, 1)  # 0.5 bytes/param

        # Required 80GB enterprise GPUs
        gpus_fp16 = max(1, int(vram_fp16 // 70) + 1)
        gpus_int4 = max(1, int(vram_int4 // 70) + 1)

        vram_saved_pct = round(((vram_fp16 - vram_int4) / vram_fp16) * 100.0, 1)

        return {
            "Model_Size_Parameters": f"{self.params_b}B",
            "FP16_Uncompressed_VRAM_GB": vram_fp16,
            "INT8_Quantized_VRAM_GB": vram_int8,
            "INT4_Quantized_VRAM_GB": vram_int4,
            "VRAM_Savings_Pct": vram_saved_pct,
            "GPUs_Required_FP16": gpus_fp16,
            "GPUs_Required_INT4": gpus_int4,
            "Infrastructure_Cost_Cut_Pct": round(((gpus_fp16 - gpus_int4) / gpus_fp16) * 100.0, 1) if gpus_fp16 > gpus_int4 else 0.0
        }

optimizer = ModelQuantizationOptimizer(parameter_count_billions=70.0) # 70B parameter model
q_res = optimizer.evaluate_quantization_levels()

print("=== MODEL QUANTIZATION & GPU SIZING AUDIT ===")
print(f"Model Parameters:     {q_res['Model_Size_Parameters']}")
print(f"FP16 Baseline VRAM:   {q_res['FP16_Uncompressed_VRAM_GB']} GB ({q_res['GPUs_Required_FP16']} x 80GB GPUs)")
print(f"INT4 Quantized VRAM:  {q_res['INT4_Quantized_VRAM_GB']} GB ({q_res['GPUs_Required_INT4']} x 80GB GPU)")
print(f"VRAM Reduction:       {q_res['VRAM_Savings_Pct']}% savings")
print(f"Hardware Cost Cut:    {q_res['Infrastructure_Cost_Cut_Pct']}% cloud GPU bill reduction")
"""

part3_output = """=== MODEL QUANTIZATION & GPU SIZING AUDIT ===
Model Parameters:     70.0B
FP16 Baseline VRAM:   168.0 GB (3 x 80GB GPUs)
INT4 Quantized VRAM:  42.0 GB (1 x 80GB GPU)
VRAM Reduction:       75.0% savings
Hardware Cost Cut:    66.7% cloud GPU bill reduction"""

part4_say = [
    "Another transformative cost-reduction technique in enterprise cloud AI is Semantic Caching and Intelligent Request Routing.",
    "In high-volume customer support and internal enterprise search, up to 40% of incoming user questions are semantically equivalent: 'What is our parental leave policy?', 'How many weeks of paternity leave do I get?', and 'Tell me about parental leave benefits' all require the exact same factual answer.",
    "Traditional HTTP caching relies on exact string matches: if a single character differs, the cache misses and a full LLM inference call executes. Semantic Caching (such as GPTCache or Redis Vector Cache) embeds incoming queries into dense vector spaces and checks if the cosine similarity against cached historical questions exceeds a threshold (typically 0.95 or 95.0%).",
    "If a semantic cache hit occurs, the cached response is served instantly in under 15 milliseconds at zero token cost, bypassing cloud foundation model APIs entirely. Combined with client-level rate limiting, semantic caching routinely slashes enterprise monthly API bills by 30% to 50%.",
    "In our institutional Python model for Part 4, we build an Enterprise Semantic Cache Simulator that calculates vector similarity, serves cached responses, and computes cumulative cloud cost savings."
]

part4_code = """# Simulation: Enterprise Semantic Caching & API Token Cost Avoidance Engine
from typing import Dict, List
import math

class SemanticCacheGateway:
    def __init__(self, similarity_threshold: float = 0.90, cost_per_miss_usd: float = 0.01):
        self.threshold = similarity_threshold
        self.cost_per_miss = cost_per_miss_usd
        # Cache entries: (query_vector, cached_response)
        self.cache: List[dict] = []
        self.total_queries = 0
        self.cache_hits = 0

    def query(self, query_text: str, query_vector: list[float]) -> dict:
        self.total_queries += 1

        # Step 1: Scan cache for semantic cosine similarity match
        for item in self.cache:
            sim = self._cosine_similarity(query_vector, item["vector"])
            if sim >= self.threshold:
                self.cache_hits += 1
                return {
                    "Query": query_text,
                    "Cache_Hit": True,
                    "Similarity": round(sim, 3),
                    "Response": item["response"],
                    "Inference_Cost_USD": 0.00,
                    "Latency_Ms": 12.0
                }

        # Step 2: Cache miss - simulate full LLM generation and store in cache
        response = f"Grounded AI response for: '{query_text}'"
        self.cache.append({"query": query_text, "vector": query_vector, "response": response})

        return {
            "Query": query_text,
            "Cache_Hit": False,
            "Similarity": 0.0,
            "Response": response,
            "Inference_Cost_USD": self.cost_per_miss,
            "Latency_Ms": 850.0
        }

    def _cosine_similarity(self, a: list[float], b: list[float]) -> float:
        dot = sum(x * y for x, y in zip(a, b))
        mag_a = math.sqrt(sum(x * x for x in a))
        mag_b = math.sqrt(sum(y * y for y in b))
        return dot / (mag_a * mag_b) if mag_a > 0 and mag_b > 0 else 0.0

gateway = SemanticCacheGateway(similarity_threshold=0.90, cost_per_miss_usd=0.01)

# Ingest initial query (Cache Miss)
q1 = gateway.query("What is our corporate remote work policy?", [0.8, 0.6])

# Ingest semantically equivalent query (Cache Hit - vector [0.78, 0.62] -> ~0.999 sim)
q2 = gateway.query("Can you tell me about the remote work rules?", [0.78, 0.62])

print("=== ENTERPRISE SEMANTIC CACHE SIMULATOR ===")
print(f"Query 1: Cache Hit={q1['Cache_Hit']} | Cost=${q1['Inference_Cost_USD']} | Latency={q1['Latency_Ms']} ms")
print(f"Query 2: Cache Hit={q2['Cache_Hit']} | Cost=${q2['Inference_Cost_USD']} | Latency={q2['Latency_Ms']} ms (FREE CACHE HIT)")
print(f"Cache Hit Rate: {(gateway.cache_hits / gateway.total_queries) * 100.0}%")
"""

part4_output = """=== ENTERPRISE SEMANTIC CACHE SIMULATOR ===
Query 1: Cache Hit=False | Cost=$0.01 | Latency=850.0 ms
Query 2: Cache Hit=True | Cost=$0.0 | Latency=12.0 ms (FREE CACHE HIT)
Cache Hit Rate: 50.0%"""

part5_say = [
    "To conclude Day 13, we integrate cloud infrastructure TCO modeling, token economics, quantization savings, and semantic caching into an Enterprise FinOps for AI Control Tower.",
    "Cloud FinOps (Financial Operations) is the operational practice of bringing financial accountability to the variable spend model of cloud computing and artificial intelligence. In an enterprise organization, the FinOps Control Tower tracks inference spend across business units, allocates multi-tenant chargebacks, enforces budget hard-caps, and monitors cost-per-query efficiency.",
    "Our FinOps Control Tower enforces three core enterprise mandates: First, Unit Cost Governance\u2014verifying that average transaction cost remains strictly below $0.01 per query; Second, Cache Efficiency\u2014mandating a minimum 30.0% semantic cache hit rate across repetitive customer workloads; and Third, Budget Variance Control\u2014generating real-time burn-rate forecasts to ensure monthly spending never exceeds authorized departmental budgets.",
    "By establishing disciplined FinOps governance, the enterprise transforms AI from an unpredictable, runaway infrastructure expense into an optimized, predictable, and highly profitable corporate capability.",
    "Review the institutional Python implementation below. The FinOps Control Tower evaluates monthly cloud AI telemetry across 100,000 queries and issues a formal FinOps Budget & Cost Clearance certification."
]

part5_code = """# Simulation: Enterprise FinOps for AI Control Tower - Cost Tracking & Chargebacks
class EnterpriseFinOpsControlTower:
    def __init__(self, enterprise: str):
        self.enterprise = enterprise

    def audit_monthly_finops_performance(
        self,
        total_queries: int,
        total_inference_cost_usd: float,
        cache_hit_rate_pct: float,
        authorized_budget_usd: float
    ) -> dict:
        avg_cost_per_query = total_inference_cost_usd / total_queries if total_queries > 0 else 0.0
        is_sub_cent = avg_cost_per_query <= 0.01
        is_cache_healthy = cache_hit_rate_pct >= 30.0
        is_under_budget = total_inference_cost_usd <= authorized_budget_usd

        is_cleared = is_sub_cent and is_cache_healthy and is_under_budget

        return {
            "Enterprise": self.enterprise,
            "Total_Queries_Audited": total_queries,
            "Total_Inference_Cost_USD": round(total_inference_cost_usd, 2),
            "Authorized_Budget_USD": authorized_budget_usd,
            "Budget_Surplus_USD": round(authorized_budget_usd - total_inference_cost_usd, 2),
            "Average_Cost_Per_Query_USD": round(avg_cost_per_query, 5),
            "Sub_Cent_Unit_Economics_Met": is_sub_cent,
            "Cache_Hit_Rate_Pct": cache_hit_rate_pct,
            "FinOps_Clearance": "APPROVED_FINOPS_BUDGET_COMPLIANT" if is_cleared else "BUDGET_BREACH_REMEDIATION_REQUIRED"
        }

tower = EnterpriseFinOpsControlTower("Apex Enterprise Global")
finops_audit = tower.audit_monthly_finops_performance(
    total_queries=100000,
    total_inference_cost_usd=740.0, # $0.0074 / query
    cache_hit_rate_pct=38.5,        # Target >= 30.0%
    authorized_budget_usd=1200.0
)

print("=== ENTERPRISE FINOPS FOR AI CONTROL TOWER ===")
print(f"Enterprise:        {finops_audit['Enterprise']}")
print(f"Queries Audited:   {finops_audit['Total_Queries_Audited']:,}")
print(f"Total Spent:       ${finops_audit['Total_Inference_Cost_USD']} (Budget: ${finops_audit['Authorized_Budget_USD']})")
print(f"Cost per Query:    ${finops_audit['Average_Cost_Per_Query_USD']} USD (Target <= $0.01)")
print(f"Cache Hit Rate:    {finops_audit['Cache_Hit_Rate_Pct']}%")
print(f"FinOps Clearance:  [{finops_audit['FinOps_Clearance']}]")
"""

part5_output = """=== ENTERPRISE FINOPS FOR AI CONTROL TOWER ===
Enterprise:        Apex Enterprise Global
Queries Audited:   100,000
Total Spent:       $740.0 (Budget: $1200.0)
Cost per Query:    $0.0074 USD (Target <= $0.01)
Cache Hit Rate:    38.5%
FinOps Clearance:  [APPROVED_FINOPS_BUDGET_COMPLIANT]"""

day13_data = {
    "day": 13,
    "coursePrefix": "bcom_ait",
    "title": "Cloud AI Infrastructure & Token Economics: LLM Cost Modeling ($Cost <= $0.01/call)",
    "goal": "Master Cloud AI infrastructure and token economics: IaaS vs PaaS vs SaaS TCO modeling, asymmetric token pricing math, 4-bit quantization VRAM reduction, semantic caching, and enterprise Cloud FinOps cost governance.",
    "minutes": 40,
    "recap": "Welcome to Day 13 of AI & Digital Transformation. Today we explore cloud AI economics: infrastructure tiers (IaaS vs PaaS), asymmetric input/output token pricing, INT4 model quantization, semantic caching, and Cloud FinOps budget control.",
    "parts": [
        {
            "part": 1,
            "title": "Cloud AI Infrastructure Tiers: IaaS vs PaaS vs SaaS TCO Optimization",
            "say": part1_say,
            "example": "An enterprise evaluating 1,000,000 monthly queries discovers that reserved IaaS GPU instances cost $2,555/month compared to $6,000/month for PaaS APIs, capturing $3,445 in monthly savings.",
            "code": part1_code,
            "output": part1_output,
            "codeNotes": [
                {"line": 13, "note": "Calculates serverless PaaS cost based on total monthly tokens processed"},
                {"line": 18, "note": "Models IaaS dedicated GPU reservation cost based on hardware capacity scaling"},
                {"line": 23, "note": "Selects optimal infrastructure tier to minimize total cost of ownership (TCO)"}
            ],
            "tryIt": "Lower monthly_queries to 100,000 to observe PaaS Serverless API become the optimal cost-effective tier.",
            "check": {
                "question": "When should an enterprise transition from serverless PaaS model APIs to dedicated IaaS GPU clusters?",
                "options": [
                    "When continuous high-volume query workloads make hourly reserved GPU instance costs substantially cheaper than cumulative per-token API fees.",
                    "Only when foundation model companies go out of business.",
                    "When building static HTML websites.",
                    "Never; dedicated GPUs are obsolete."
                ],
                "answerIndex": 0,
                "answer": 0,
                "explanation": "At high continuous volume, dedicated GPU reservations offer fixed predictable costs that undercut variable pay-per-token API fees, lowering TCO.",
                "why": "At high continuous volume, dedicated GPU reservations offer fixed predictable costs that undercut variable pay-per-token API fees, lowering TCO."
            }
        },
        {
            "part": 2,
            "title": "Token Economics & Cost Modeling: Asymmetric Pricing & Sub-$0.01 Target Math",
            "say": part2_say,
            "example": "A lean prompt with 2,000 input tokens and 500 output tokens costs exactly $0.01, whereas a bloated 12,000-token prompt costs $0.045, breaching the sub-cent benchmark.",
            "code": part2_code,
            "output": part2_output,
            "codeNotes": [
                {"line": 8, "note": "Applies asymmetric pricing rates: output tokens priced 4x higher than input tokens"},
                {"line": 12, "note": "Evaluates total transaction cost against the institutional $0.01 per query ceiling"},
                {"line": 18, "note": "Flags excessive token burn to enforce prompt engineering discipline across engineering teams"}
            ],
            "tryIt": "Reduce prompt_tokens on Query 2 to 3,000 to observe transaction cost drop into the approved sub-cent range.",
            "check": {
                "question": "Why do foundation model cloud providers price Output Tokens significantly higher than Input Tokens?",
                "options": [
                    "Generating output tokens requires sequential autoregressive GPU passes, which are memory-bandwidth constrained, whereas input tokens are processed in parallel.",
                    "Output tokens are legally copyrighted by the user.",
                    "Input tokens take up more hard drive space.",
                    "Providers charge an arbitrary fee because output tokens contain vowels."
                ],
                "answerIndex": 0,
                "answer": 0,
                "explanation": "Autoregressive token generation is sequentially bound by GPU memory bandwidth, requiring orders of magnitude more computing cycles per token than parallel prompt ingestion.",
                "why": "Autoregressive token generation is sequentially bound by GPU memory bandwidth, requiring orders of magnitude more computing cycles per token than parallel prompt ingestion."
            }
        },
        {
            "part": 3,
            "title": "Model Optimization: 4-Bit Quantization (INT4) & VRAM Memory Sizing",
            "say": part3_say,
            "example": "A 70B parameter model requiring 168 GB VRAM (3 GPUs) in FP16 shrinks to 42 GB in INT4, running on a single GPU and cutting cloud hardware costs by 66.7%.",
            "code": part3_code,
            "output": part3_output,
            "codeNotes": [
                {"line": 8, "note": "Models VRAM footprint across FP16 (2 bytes/param), INT8 (1 byte), and INT4 (0.5 bytes)"},
                {"line": 13, "note": "Calculates discrete 80GB GPU hardware requirement across precision levels"},
                {"line": 22, "note": "Demonstrates 75% memory reduction and 66.7% cloud GPU cost containment via INT4 quantization"}
            ],
            "tryIt": "Change parameter_count_billions to 8.0 (Llama-3-8B) to see it fit on a single consumer GPU under INT4.",
            "check": {
                "question": "What is the primary benefit of INT4 model weight quantization in enterprise AI infrastructure?",
                "options": [
                    "It reduces model VRAM memory requirements by 75%, allowing massive models to run on fewer, cheaper GPUs with negligible reasoning loss.",
                    "It makes the language model speak 4 different languages simultaneously.",
                    "It prevents models from using numbers greater than 4.",
                    "It deletes 75% of the company's customer data."
                ],
                "answerIndex": 0,
                "answer": 0,
                "explanation": "Quantization shrinks weight precision from 16 bits to 4 bits, drastically cutting VRAM needs and cloud hosting expenses while retaining high accuracy.",
                "why": "Quantization shrinks weight precision from 16 bits to 4 bits, drastically cutting VRAM needs and cloud hosting expenses while retaining high accuracy."
            }
        },
        {
            "part": 4,
            "title": "Semantic Caching & Token Cost Avoidance: Vector Similarity & Fast Retrieval",
            "say": part4_say,
            "example": "A user asks a semantically equivalent question about remote work; the semantic cache detects 0.999 cosine similarity and serves the answer in 12 ms at zero token cost.",
            "code": part4_code,
            "output": part4_output,
            "codeNotes": [
                {"line": 16, "note": "Scans vector cache calculating cosine similarity between incoming query and cached questions"},
                {"line": 18, "note": "Serves instantaneous cache hit in 12 ms at $0.00 cost when similarity >= 0.90"},
                {"line": 28, "note": "Stores new query responses in cache on miss, building a compounding cost-saving asset"}
            ],
            "tryIt": "Raise similarity_threshold to 0.9999 to observe how strict matching forces a cache miss on slightly altered queries.",
            "check": {
                "question": "How does Semantic Caching differ from traditional exact-match HTTP web caching?",
                "options": [
                    "Semantic caching uses vector embeddings to recognize conceptually identical questions phrased with different words, whereas HTTP caching requires exact byte-for-byte string matches.",
                    "Semantic caching only works on mobile phones.",
                    "HTTP caching is illegal under federal banking laws.",
                    "Semantic caching deletes the cache after 5 seconds."
                ],
                "answerIndex": 0,
                "answer": 0,
                "explanation": "Semantic caching evaluates conceptual meaning via dense vector similarity, allowing varied phrasings of the same question to hit the cache and avoid API costs.",
                "why": "Semantic caching evaluates conceptual meaning via dense vector similarity, allowing varied phrasings of the same question to hit the cache and avoid API costs."
            }
        },
        {
            "part": 5,
            "title": "Enterprise FinOps for AI Control Tower: Cost Governance & Departmental Chargebacks",
            "say": part5_say,
            "example": "A FinOps Control Tower audits 100,000 monthly queries, tracking an average unit cost of $0.0074 USD (under the $0.01 target) and a 38.5% cache hit rate to grant budget clearance.",
            "code": part5_code,
            "output": part5_output,
            "codeNotes": [
                {"line": 12, "note": "Audits three FinOps pillars: Sub-cent cost (<= $0.01), cache hit rate (>= 30%), and budget surplus"},
                {"line": 23, "note": "Calculates exact departmental chargeback and budget surplus tracking in real-time"},
                {"line": 26, "note": "Confers formal FinOps Budget Compliant clearance for enterprise financial governance"}
            ],
            "tryIt": "Set total_inference_cost_usd to 1400.0 to observe the audit fail due to budget deficit and trigger remediation.",
            "check": {
                "question": "What is the core objective of an Enterprise FinOps for AI Control Tower?",
                "options": [
                    "Bringing financial accountability, unit-cost tracking, semantic cache optimization, and budget guardrails to cloud AI spending.",
                    "Replacing human corporate treasurers with cryptocurrency.",
                    "Printing physical paper currency in corporate offices.",
                    "Banning marketing departments from purchasing software."
                ],
                "answerIndex": 0,
                "answer": 0,
                "explanation": "FinOps provides real-time financial transparency, multi-tenant chargebacks, and automated cost optimization to ensure cloud AI investments remain disciplined and profitable.",
                "why": "FinOps provides real-time financial transparency, multi-tenant chargebacks, and automated cost optimization to ensure cloud AI investments remain disciplined and profitable."
            }
        }
    ],
    "summary": [
        "Cloud Infrastructure Tiers: Evaluating IaaS GPU clusters, PaaS model APIs, and SaaS seats allows enterprises to optimize TCO across variable and high-volume workloads.",
        "Token Economics: Asymmetric pricing (output tokens 3-5x input tokens) dictates that prompt brevity and concise completions are critical to maintaining sub-$0.01 unit costs.",
        "Model Quantization: 4-bit INT4 quantization slashes VRAM memory footprints by 75%, reducing dedicated enterprise GPU hardware requirements by two-thirds.",
        "Semantic Caching: Embedding vector similarity serves repetitive user inquiries in under 15 ms at zero token cost, reducing monthly cloud API invoices by 30-50%.",
        "FinOps for AI Control Tower: Real-time cost telemetry, multi-tenant departmental chargebacks, and budget compliance guardrails ensure scalable enterprise profitability."
    ],
    "projectStep": {
        "title": "Deploying the Enterprise Cloud AI FinOps & Token Economics Suite",
        "steps": [
            "Construct a cloud infrastructure TCO calculator comparing PaaS API costs against dedicated IaaS GPU cluster reservations.",
            "Build an asymmetric token economics pricing model verifying transaction costs against the $0.01 ceiling.",
            "Implement a model quantization VRAM sizing calculator evaluating hardware reductions under INT4 precision.",
            "Deploy a semantic cache simulator with vector cosine matching and synthesize telemetry into the FinOps Control Tower."
        ]
    }
}

with open('scripts/bcom_ait_day13_data.json', 'w', encoding='utf-8') as f:
    json.dump(day13_data, f, indent=2)
print('Day 13 data written successfully.')
