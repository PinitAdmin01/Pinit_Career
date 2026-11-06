import json
import hashlib
import os
import sys

sys.path.append('scripts/branch_c')
from generate_day34_all import part1_say, part2_say, part3_say, part4_say, part5_say

code1 = """function calculateQuantizationFootprint(paramsB: number, contextLen: number, batchSize: number) {
  const formats = [
    { name: 'FP16 (Baseline)', bitsPerWeight: 16, bytesPerKV: 2 },
    { name: 'INT8 / FP8', bitsPerWeight: 8, bytesPerKV: 1 },
    { name: 'INT4 (AWQ/GPTQ)', bitsPerWeight: 4, bytesPerKV: 2 },
    { name: 'INT4 Weight + FP8 KV', bitsPerWeight: 4, bytesPerKV: 1 }
  ];

  return formats.map(fmt => {
    const weightGB = (paramsB * 1e9 * (fmt.bitsPerWeight / 8)) / (1024 ** 3);
    const kvPerTokenBytes = 2 * 32 * 128 * fmt.bytesPerKV;
    const kvCacheGB = (batchSize * contextLen * kvPerTokenBytes) / (1024 ** 3);
    const totalVRAM = weightGB + kvCacheGB;
    return {
      format: fmt.name,
      weightGB: Number(weightGB.toFixed(2)),
      kvCacheGB: Number(kvCacheGB.toFixed(2)),
      totalVRAM_GB: Number(totalVRAM.toFixed(2)),
      compressionRatio: `${(16 / fmt.bitsPerWeight).toFixed(1)}x`
    };
  });
}
console.log(calculateQuantizationFootprint(70, 4096, 8));"""

output1 = """[
  {
    format: 'FP16 (Baseline)',
    weightGB: 130.39,
    kvCacheGB: 0.5,
    totalVRAM_GB: 130.89,
    compressionRatio: '1.0x'
  },
  {
    format: 'INT8 / FP8',
    weightGB: 65.19,
    kvCacheGB: 0.25,
    totalVRAM_GB: 65.44,
    compressionRatio: '2.0x'
  },
  {
    format: 'INT4 (AWQ/GPTQ)',
    weightGB: 32.6,
    kvCacheGB: 0.5,
    totalVRAM_GB: 33.1,
    compressionRatio: '4.0x'
  },
  {
    format: 'INT4 Weight + FP8 KV',
    weightGB: 32.6,
    kvCacheGB: 0.25,
    totalVRAM_GB: 32.85,
    compressionRatio: '4.0x'
  }
]"""

code2 = """function simulateGPTQQuantization(weights: number[], hessianDiag: number[]) {
  const quantized: number[] = [];
  const errors: number[] = [];
  const scale = 0.5;

  for (let i = 0; i < weights.length; i++) {
    const w = weights[i];
    const q = Math.round(w / scale) * scale;
    const err = w - q;
    quantized.push(q);
    errors.push(Number(err.toFixed(4)));

    if (i + 1 < weights.length && hessianDiag[i] > 0) {
      weights[i + 1] -= (err * 0.1) / hessianDiag[i];
    }
  }

  return { originalWeights: [1.24, -0.83, 2.45, -1.67], quantizedWeights: quantized, residualErrors: errors };
}
console.log(simulateGPTQQuantization([1.24, -0.83, 2.45, -1.67], [1.0, 1.2, 0.8, 1.5]));"""

output2 = """{
  originalWeights: [ 1.24, -0.83, 2.45, -1.67 ],
  quantizedWeights: [ 1, -1, 2.5, -1.5 ],
  residualErrors: [ 0.24, 0.146, -0.0622, -0.1622 ]
}"""

code3 = """function simulateAWQChannelScaling(weightMatrix: number[][], activationMagnitudes: number[]) {
  const salientThreshold = 10.0;
  const scaledWeights: number[][] = [];
  const scalingFactors: number[] = [];

  for (let col = 0; col < activationMagnitudes.length; col++) {
    const actMag = activationMagnitudes[col];
    const s = actMag > salientThreshold ? Math.sqrt(actMag) : 1.0;
    scalingFactors.push(Number(s.toFixed(2)));

    const colWeights: number[] = [];
    for (let row = 0; row < weightMatrix.length; row++) {
      colWeights.push(Number((weightMatrix[row][col] * s).toFixed(3)));
    }
    scaledWeights.push(colWeights);
  }

  return {
    activationMagnitudes,
    scalingFactors,
    isSalient: activationMagnitudes.map(m => m > salientThreshold)
  };
}
const dummyW = [[0.4, 1.2, 0.1], [-0.5, 2.1, 0.3]];
console.log(simulateAWQChannelScaling(dummyW, [2.1, 15.4, 1.8]));"""

output3 = """{
  activationMagnitudes: [ 2.1, 15.4, 1.8 ],
  scalingFactors: [ 1, 3.92, 1 ],
  isSalient: [ false, true, false ]
}"""

code4 = """interface FP8FormatSpec {
  name: string;
  exponentBits: number;
  mantissaBits: number;
  maxRepresentable: number;
  recommendedUse: string;
}

function inspectFP8Formats(): FP8FormatSpec[] {
  return [
    { name: 'FP8 E4M3', exponentBits: 4, mantissaBits: 3, maxRepresentable: 448.0, recommendedUse: 'Forward GEMM & Activations (Higher Precision)' },
    { name: 'FP8 E5M2', exponentBits: 5, mantissaBits: 2, maxRepresentable: 57344.0, recommendedUse: 'Gradients & Backward Pass (Higher Dynamic Range)' }
  ];
}
console.log(inspectFP8Formats());"""

output4 = """[
  {
    name: 'FP8 E4M3',
    exponentBits: 4,
    mantissaBits: 3,
    maxRepresentable: 448,
    recommendedUse: 'Forward GEMM & Activations (Higher Precision)'
  },
  {
    name: 'FP8 E5M2',
    exponentBits: 5,
    mantissaBits: 2,
    maxRepresentable: 57344,
    recommendedUse: 'Gradients & Backward Pass (Higher Dynamic Range)'
  }
]"""

code5 = """interface QuantizationBenchmark {
  quantMethod: string;
  weightPrecision: string;
  tokensPerSec: number;
  vramUsageGB: number;
  perplexityScore: number;
}

function evaluateQuantizationBenchmarks(): QuantizationBenchmark[] {
  return [
    { quantMethod: 'Unquantized FP16 Baseline', weightPrecision: '16-bit Float', tokensPerSec: 32.4, vramUsageGB: 14.8, perplexityScore: 5.62 },
    { quantMethod: 'GPTQ INT4', weightPrecision: '4-bit Integer', tokensPerSec: 78.2, vramUsageGB: 4.6, perplexityScore: 5.74 },
    { quantMethod: 'AWQ INT4', weightPrecision: '4-bit Integer', tokensPerSec: 84.5, vramUsageGB: 4.5, perplexityScore: 5.65 },
    { quantMethod: 'Hopper FP8 Native', weightPrecision: '8-bit Float', tokensPerSec: 112.0, vramUsageGB: 8.2, perplexityScore: 5.63 }
  ];
}
console.log(evaluateQuantizationBenchmarks());"""

output5 = """[
  {
    quantMethod: 'Unquantized FP16 Baseline',
    weightPrecision: '16-bit Float',
    tokensPerSec: 32.4,
    vramUsageGB: 14.8,
    perplexityScore: 5.62
  },
  {
    quantMethod: 'GPTQ INT4',
    weightPrecision: '4-bit Integer',
    tokensPerSec: 78.2,
    vramUsageGB: 4.6,
    perplexityScore: 5.74
  },
  {
    quantMethod: 'AWQ INT4',
    weightPrecision: '4-bit Integer',
    tokensPerSec: 84.5,
    vramUsageGB: 4.5,
    perplexityScore: 5.65
  },
  {
    quantMethod: 'Hopper FP8 Native',
    weightPrecision: '8-bit Float',
    tokensPerSec: 112,
    vramUsageGB: 8.2,
    perplexityScore: 5.63
  }
]"""

day34_dict = {
    "day": 34,
    "title": "Advanced Model Quantization: AWQ, GPTQ & FP8 Scaling Kernels",
    "goal": "Master Activation-Aware Weight Quantization (AWQ), second-order error minimization via GPTQ, and Hopper hardware-native FP8 Tensor Core scaling to deploy frontier foundation models at maximum price-performance.",
    "minutes": 38,
    "recap": "Yesterday we mastered PagedAttention virtual block tables, zero-copy prefix caching, and chunked prefill scheduling to eliminate KV-cache memory fragmentation. Today we conquer the foundational model memory footprint itself through post-training weight quantization and hardware-native FP8 execution.",
    "parts": [
        {
            "title": "Precision Anatomy, Dynamic Range & The Memory-Bandwidth Bottleneck",
            "say": part1_say,
            "example": "Quantizing weights from FP16 to INT4 is like switching from shipping heavy hardcover encyclopedias to delivering compact electronic tablets; the semantic knowledge remains pristine while cargo weight and transportation bandwidth shrink dramatically.",
            "code": code1,
            "output": output1,
            "codeNotes": [
                {"line": 1, "note": "Calculates physical VRAM consumption for model weights and KV-cache across FP16, INT8, and INT4."},
                {"line": 10, "note": "Computes weight footprint in gigabytes using bit-width divided by eight."},
                {"line": 17, "note": "Demonstrates a 4x reduction in weight memory, slashing a 70B model from 130GB down to 32.6GB."}
            ],
            "tryIt": "Simulate memory footprint reduction across varying parameter dimensions.",
            "check": {
                "question": "Why does 4-bit weight quantization (INT4) yield dramatic latency improvements during autoregressive decoding despite the model performing similar compute operations?",
                "options": [
                    "Autoregressive generation is strictly memory-bandwidth bound, so transferring 4-bit weights requires one-quarter of the DRAM memory bandwidth per generated token",
                    "4-bit quantization automatically reduces the sequence length of the prompt by seventy-five percent",
                    "The GPU clock frequency doubles automatically whenever INT4 tensors are detected",
                    "Transformer attention layers are completely bypassed when weights are quantized"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "During autoregressive decoding, each step transfers all weight matrices from high-bandwidth DRAM into GPU SRAM registers to generate a single token. INT4 quantization cuts this memory traffic by 4x, directly relieving the memory-bandwidth bottleneck."
            }
        },
        {
            "title": "GPTQ: Second-Order Error Minimization & Optimal Brain Surgeon Adaptation",
            "say": part2_say,
            "example": "GPTQ compensation is like an expert watchmaker adjusting adjacent delicate gears when one gear tooth is slightly rounded; by redistributing minute mechanical tensions, the overall clock keeps perfect second-by-second time.",
            "code": code2,
            "output": output2,
            "codeNotes": [
                {"line": 1, "note": "Simulates second-order error compensation using the inverse Hessian diagonal."},
                {"line": 8, "note": "Quantizes the current weight to the nearest INT4 grid point and computes residual rounding error."},
                {"line": 13, "note": "Propagates the residual error to unquantized neighboring weights to minimize overall layer distortion."}
            ],
            "tryIt": "Trace residual quantization errors across unquantized weight elements.",
            "check": {
                "question": "How does the GPTQ algorithm prevent error accumulation across billions of weight parameters during post-training quantization?",
                "options": [
                    "It uses the inverse Hessian matrix of layer activations to analytically compensate unquantized weights for the rounding error introduced by each newly quantized weight",
                    "It executes a full one-hundred-epoch backpropagation retraining loop with stochastic gradient descent",
                    "It permanently zeroes out any weight parameter that cannot be represented exactly in four bits",
                    "It randomly reshuffles the order of attention heads before computing weight norms"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "GPTQ uses second-order Taylor expansion and the inverse Hessian matrix of activations to compensate remaining unquantized weights in closed-form as each column is quantized, keeping output degradation mathematically bounded."
            }
        },
        {
            "title": "AWQ: Activation-Aware Weight Quantization & Per-Channel Equivalent Scaling",
            "say": part3_say,
            "example": "AWQ protects salient weights like an art museum curator reinforcing fragile structural pillars before moving an ancient sculpture; protecting the critical one percent of load-bearing columns preserves the entire architectural masterpiece.",
            "code": code3,
            "output": output3,
            "codeNotes": [
                {"line": 1, "note": "Identifies salient weight channels based on input activation magnitude thresholds."},
                {"line": 8, "note": "Calculates per-channel scaling factor proportional to the square root of activation magnitude."},
                {"line": 13, "note": "Scales salient weight columns to protect dynamic range while dividing activation channels during inference."}
            ],
            "tryIt": "Examine channel scaling factors and evaluate salient feature preservation.",
            "check": {
                "question": "Why does AWQ apply per-channel scaling factors instead of using mixed-precision FP16 storage for salient weight channels?",
                "options": [
                    "Mixed-precision storage causes irregular matrix layouts that break GPU warp alignment, whereas per-channel scaling maintains a uniform INT4 matrix layout across all execution units",
                    "Floating-point numbers can never be stored in the same GPU high-bandwidth memory block as integers",
                    "Per-channel scaling triples the total number of floating-point operations executed per second",
                    "Modern GPU streaming multiprocessors disable cache lines when mixed precision is detected"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "Keeping weights in mixed precision introduces hardware divergence and memory fragmentation. AWQ scales salient channels so all weights can be uniformly stored in INT4 while protecting critical accuracy."
            }
        },
        {
            "title": "Hardware-Native FP8 Scaling: Hopper E4M3 vs E5M2 Tensor Core Kernels",
            "say": part4_say,
            "example": "FP8 E4M3 and E5M2 are like precision surgical scalpels and heavy-duty demolition hammers; E4M3 preserves fine detail for forward inference, while E5M2 provides vast dynamic range to prevent gradient overflow during training.",
            "code": code4,
            "output": output4,
            "codeNotes": [
                {"line": 1, "note": "Defines format specifications for Hopper fourth-generation Tensor Core native FP8 formats."},
                {"line": 11, "note": "FP8 E4M3 allocates 3 mantissa bits for higher precision in forward GEMM passes."},
                {"line": 12, "note": "FP8 E5M2 allocates 5 exponent bits matching FP16 dynamic range for backward gradients."}
            ],
            "tryIt": "Contrast eight bit floating point formats across forward inference modes.",
            "check": {
                "question": "Which FP8 format is recommended for large language model forward inference activations and weights on NVIDIA Hopper architectures, and why?",
                "options": [
                    "FP8 E4M3, because its three mantissa bits provide higher numerical precision and resolution required to preserve output logits without severe quality degradation",
                    "FP8 E5M2, because its five exponent bits allow weights to exceed one billion in magnitude",
                    "FP8 E2M5, because having two exponent bits eliminates all floating-point rounding errors",
                    "FP8 INT8, because signed integers are always more accurate than floating-point numbers"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "FP8 E4M3 allocates 4 exponent bits and 3 mantissa bits, maximizing numerical precision for weights and activations where dynamic range is bounded, resulting in superior perplexity preservation."
            }
        },
        {
            "title": "Production Quantization Benchmarking, Perplexity Auditing & Serving Economics",
            "say": part5_say,
            "example": "Dense intermodal shipping maximizes cargo while cutting operational waste; rigorous benchmarking ensures payload capacity is maximized without risking aircraft stability.",
            "code": code5,
            "output": output5,
            "codeNotes": [
                {"line": 1, "note": "Defines evaluation metrics for production serving benchmarks: throughput, VRAM, and perplexity."},
                {"line": 11, "note": "Baseline FP16 yields 32.4 tokens/s and consumes 14.8GB on a 7B model."},
                {"line": 13, "note": "AWQ INT4 boosts throughput to 84.5 tokens/s and cuts VRAM to 4.5GB with negligible perplexity degradation."}
            ],
            "tryIt": "Measure latency and throughput gains across production serving platforms.",
            "check": {
                "question": "What is the primary operational and economic benefit of serving a 70B parameter model in AWQ INT4 or Hopper FP8 instead of unquantized FP16?",
                "options": [
                    "It compresses model memory from 140GB down to under 40GB, allowing a 70B model to be served on a single 80GB GPU instead of requiring expensive multi-GPU pipeline clusters",
                    "It completely eliminates the need for prompt tokenization and embedding tables",
                    "It enables the foundation model to run directly on consumer microcontrollers with 16KB of RAM",
                    "It automatically converts English text into all global languages during inference"
                ],
                "answer": 0,
                "answerIndex": 0,
                "why": "A 70B parameter model requires ~140GB in FP16, needing multiple A100/H100 GPUs. In INT4 or FP8, the model fits into 35-70GB, allowing hosting on a single or dual GPU, cutting infrastructure costs by over 60%."
            }
        }
    ],
    "summary": [
        "Autoregressive decoding is strictly memory-bandwidth bound; 4-bit weight quantization reduces memory traffic by 4x, directly increasing token generation speed.",
        "GPTQ uses second-order Taylor expansions and the inverse Hessian matrix to compensate unquantized weights in closed form, preventing error accumulation.",
        "AWQ observes that only 1% of weight channels are salient and protects them by scaling weight columns by activation magnitudes, preserving a uniform INT4 layout.",
        "NVIDIA Hopper architecture introduces native hardware Tensor Core execution for FP8 E4M3 (forward inference) and FP8 E5M2 (training gradients).",
        "Delayed dynamic scaling tracks maximum tensor activations across historical iterations, avoiding runtime synchronization stalls during FP8 GEMM execution.",
        "Production quantization allows serving 70B foundation models on a single 80GB accelerator, slashing hardware infrastructure costs by 60% while preserving benchmark accuracy."
    ],
    "projectStep": {
        "title": "Industrial Multi-Format Quantization & Kernel Acceleration Pipeline",
        "steps": [
            "Implement a second-order GPTQ quantization engine with inverse Hessian error compensation.",
            "Develop an AWQ per-channel equivalent scaling module protecting salient feature activations.",
            "Deploy an automated perplexity auditing and regression benchmark suite comparing FP16, AWQ, and FP8 kernels."
        ]
    }
}

# 1. Save day34_lesson.json
with open('scripts/branch_c/day34_lesson.json', 'w', encoding='utf-8') as f:
    json.dump(day34_dict, f, indent=2)

# 2. Append into src/lib/data/aiWebLongLessons.ts
ai_ts_path = 'src/lib/data/aiWebLongLessons.ts'
with open(ai_ts_path, 'r', encoding='utf-8') as f:
    ts_content = f.read()

last_bracket = ts_content.rfind('];')
assert last_bracket != -1, "Could not find '];'"

day34_json_str = json.dumps(day34_dict, indent=2)

new_ts_content = ts_content[:last_bracket].rstrip()
if not new_ts_content.endswith(','):
    new_ts_content += ',\n'
else:
    new_ts_content += '\n'

new_ts_content += day34_json_str + '\n];\n'

with open(ai_ts_path, 'w', encoding='utf-8') as f:
    f.write(new_ts_content)

print(f"Appended Day 34 to {ai_ts_path}")

# 3. Generate Visual Envelope
captions_data = [
    {
        "say1": "Different floating point precisions dictate physical memory requirements.",
        "say2": "Quantizing weights to four bits relieves severe memory bandwidth limits.",
        "example": "Compact electronic tablets deliver text without heavy encyclopedia cargo.",
        "tryIt": "Evaluate memory footprint reduction across varying parameter dimensions."
    },
    {
        "say1": "Optimal brain surgeon algorithms compute second order error gradients.",
        "say2": "Closed form inverse Hessian updates compensate neighboring weight values.",
        "example": "Delicate watchmaker adjustments align gears to maintain exact cadence.",
        "tryIt": "Trace residual quantization errors across unquantized weight elements."
    },
    {
        "say1": "Activation aware quantization identifies salient weight channel outliers.",
        "say2": "Channel scaling protects critical columns while preserving uniform grids.",
        "example": "Reinforcing structural pillars preserves architectural stability cleanly.",
        "tryIt": "Examine channel scaling factors and evaluate salient feature preservation."
    },
    {
        "say1": "Hopper tensor cores execute native eight bit floating point arithmetic.",
        "say2": "Delayed dynamic scaling prevents numerical overflow across dynamic ranges.",
        "example": "Precision scalpels resolve fine detail while hammers absorb heavy loads.",
        "tryIt": "Contrast eight bit floating point formats across forward inference modes."
    },
    {
        "say1": "Enterprise quality assurance validates perplexity and benchmark accuracy.",
        "say2": "Quantization shrinks physical hardware footprints and operational costs.",
        "example": "Dense intermodal shipping maximizes cargo while cutting operational waste.",
        "tryIt": "Measure latency and throughput gains across production serving platforms."
    }
]

titles = [
    "Precision Anatomy and Memory Bandwidth Bottlenecks.",
    "Second Order Hessian Error Minimization in GPTQ.",
    "Activation Aware Salient Weight Scaling in AWQ.",
    "Hardware Native FP Eight Floating Point Kernels.",
    "Production Quantization Benchmarking and Economics."
]

columns_list = [
    ["Precision Format", "Bytes Per Parameter", "Memory Bandwidth Demand"],
    ["Quantization Approach", "Weight Compensation Mechanism", "Perplexity Preservation"],
    ["Weight Category", "Activation Magnitude Profile", "Quantization Protection Mode"],
    ["Binary Precision Format", "Bit Allocation Layout", "Target Workload Application"],
    ["Deployment Configuration", "Physical Hardware Requirement", "Per Token Hosting Cost"]
]

steps_rows = [
    [
        [["FP Thirty Two Single Precision", "Four Bytes Per Weight", "Extreme Bus Contention"], ["FP Sixteen Half Precision", "Two Bytes Per Weight", "Standard Baseline Bandwidth"]],
        [["INT Four Integer Quantization", "Half Byte Per Weight", "Four Times Bandwidth Reduction"], ["Autoregressive Decode Bound", "Weight Fetch Dominated", "Massive Token Generation Speedup"]],
        [["Heavy Printed Encyclopedia", "Bulky Shipping Crates", "Slow Distribution Freight"], ["Compact Digital Reader", "Featherweight Data File", "Instant Global Delivery"]],
        [["Seventy Billion Parameter Model", "One Hundred Forty Gigabyte FP Sixteen", "Requires Multiple Accelerators"], ["Quantized Four Bit Model", "Thirty Five Gigabyte DRAM", "Runs On Single Physical GPU"]]
    ],
    [
        [["Naive Round To Nearest", "Zero Error Compensation", "Severe Compounding Degradation"], ["Optimal Brain Surgeon", "Inverse Hessian Weight Updates", "Near Zero Output Distortion"]],
        [["Sequential Column Quantization", "Greedy Rounding Scheme", "High Accumulative Error"], ["Cholesky Decomposition", "Direct Closed Form Updates", "Strict Numerical Stability"]],
        [["Crude Gear Adjustment", "Jarring Mechanical Shock", "Broken Watch Movement"], ["Delicate Watchmaker Calibration", "Harmonic Tension Balancing", "Flawless Chronometer Accuracy"]],
        [["Residual Error Propagation", "Neighboring Weight Offsets", "Bounded Output Deviation"], ["Calibration Set Tuning", "One Hundred Text Samples", "Rapid Two Hour Compression"]]
    ],
    [
        [["Top One Percent Salient Weights", "Massive Hidden State Outliers", "Per Channel Equivalent Scaling"], ["Ninety Nine Percent Standard Weights", "Uniform Gaussian Distribution", "Direct Four Bit Integer Grid"]],
        [["Mixed Precision Layouts", "Hardware Divergence Latency", "Fragmented Execution Warps"], ["Uniform INT Four Packing", "Tensor Core Aligned", "Peak Hardware Streaming GEMM"]],
        [["Fragile Marble Columns", "Carrying Massive Ceiling Load", "Rigid Steel Reinforcement"], ["Non Structural Partitions", "Lightweight Drywall Panels", "Standard Framing Support"]],
        [["Salient Channel Detection", "Top Activation Thresholds", "Square Root Magnitude Scaling"], ["Inference Normalization Folding", "Zero Runtime Compute Overhead", "Flawless Reasoning Accuracy"]]
    ],
    [
        [["FP Eight E Four M Three", "Four Exponent Three Mantissa", "Forward Pass Weights And Activations"], ["FP Eight E Five M Two", "Five Exponent Two Mantissa", "Backward Pass Gradients And Tuning"]],
        [["Static Quantization Range", "Susceptible To Outlier Overflow", "Clipping Artifacts"], ["Delayed Dynamic Scaling", "History Based Tensor Bounds", "Zero Synchronization Stalls"]],
        [["Fine Precision Scalpel", "Delicate Microscopic Cuts", "Optimal Feature Resolution"], ["Heavy Duty Hammer", "Wide Dynamic Force", "Broad Parameter Stability"]],
        [["Hopper Tensor Core Support", "Native Hardware Instructions", "Two Times Compute Flops Gain"], ["Ada Lovelace Architecture", "E Four M Three Native Execution", "High Efficiency Prefill Accelerate"]]
    ],
    [
        [["Unquantized FP Sixteen Model", "Two Eight Gigabyte Nodes", "High Infrastructure Expenditure"], ["AWQ INT Four Model", "Single Physical Accelerator", "Sixty Percent Cost Reduction"]],
        [["Automated Perplexity Gate", "WikiText Two Cross Entropy", "Strict Fifteen Point Threshold"], ["Continuous Task Regression", "HumanEval Code Reasoning", "Zero Syntax Accuracy Loss"]],
        [["Chartering Empty Cargo Jets", "Excessive Fuel Waste", "Unviable Operating Margins"], ["Optimized Intermodal Shipping", "Maximum Density Cargo", "Profitable Commercial Scale"]],
        [["Eighty Gigabyte A One Hundred", "Hosts Seventy Billion Model", "Sub Thirty Millisecond Latency"], ["Multi Tenant Capacity Pool", "Four Times Serving Concurrency", "Predictable Enterprise SLA"]]
    ]
]

entries = []
for p_idx, part in enumerate(day34_dict['parts']):
    code_hash = hashlib.sha256(part['code'].encode('utf-8')).hexdigest()
    caps = captions_data[p_idx]
    
    spec_steps = []
    at_keys = ["say1", "say2", "example", "tryIt"]
    for s_idx, at_k in enumerate(at_keys):
        cap = caps[at_k]
        assert len(cap) <= 75, f"Part {p_idx+1} {at_k} caption too long: {len(cap)} ({cap})"
        assert cap.endswith('.'), f"Part {p_idx+1} {at_k} caption must end with period: ({cap})"
        assert not any(c.isdigit() for c in cap), f"Part {p_idx+1} {at_k} caption contains digits: ({cap})"
        spec_steps.append({
            "at": at_k,
            "caption": cap,
            "rows": steps_rows[p_idx][s_idx]
        })
    
    entry_dict = {
        "partTitle": part['title'],
        "codeHash": code_hash,
        "filled": {
            "template": "table",
            "title": titles[p_idx],
            "columns": columns_list[p_idx],
            "steps": spec_steps
        },
        "spec": {
            "template": "table",
            "title": titles[p_idx],
            "columns": columns_list[p_idx],
            "steps": spec_steps
        }
    }
    entries.append(entry_dict)

envelope = {
    "schemaVersion": "2.0.0",
    "prefix": "ai",
    "day": 34,
    "entries": entries
}

out_path = 'src/lib/data/lessonVisuals/ai/day-34.json'
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(envelope, f, indent=2)

print(f"Generated Gate v2 visual envelope with 5 entries at {out_path}")
