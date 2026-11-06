// Part 1: Standard Attention Memory Bottleneck Simulator
function simulateMemoryAccess(seqLen: number, dModel: number, numHeads: number) {
  const headDim = dModel / numHeads;
  // Naive attention stores S = Q * K^T and P = softmax(S) in HBM (N x N per head)
  const scoreMatrixBytes = seqLen * seqLen * 4 * numHeads; // float32
  const softmaxMatrixBytes = seqLen * seqLen * 4 * numHeads;
  const totalHBMBytes = scoreMatrixBytes + softmaxMatrixBytes;
  
  // FlashAttention keeps intermediate scores entirely in SRAM tiled chunks of block size B
  const blockSize = 64;
  const tiledSramBytes = blockSize * headDim * 4 * 2; // Q block and K block in SRAM
  
  return {
    seqLen,
    naiveHBM_MB: (totalHBMBytes / (1024 * 1024)).toFixed(2),
    tiledSRAM_KB: (tiledSramBytes / 1024).toFixed(2),
    ratio: (totalHBMBytes / tiledSramBytes).toFixed(0)
  };
}

console.log('--- PART 1: MEMORY ACCESS BOTTLENECK ---');
console.log(simulateMemoryAccess(4096, 4096, 32));

// Part 2: Online Softmax Demonstration
function onlineSoftmax(logits: number[]): { standardSoftmax: number[]; onlineSoftmax: number[] } {
  // 1. Standard 2-pass softmax
  const maxVal = Math.max(...logits);
  const exps = logits.map(v => Math.exp(v - maxVal));
  const sumExp = exps.reduce((a, b) => a + b, 0);
  const standardSoftmax = exps.map(v => Number((v / sumExp).toFixed(4)));

  // 2. Online streaming softmax (Milakov & Gimelshein)
  let m = -Infinity; // running max
  let d = 0;         // running sum of exps
  const unnorm: number[] = [];

  for (let i = 0; i < logits.length; i++) {
    const x = logits[i];
    const prevM = m;
    m = Math.max(prevM, x);
    d = d * Math.exp(prevM - m) + Math.exp(x - m);
  }

  const onlineResult = logits.map(x => Number((Math.exp(x - m) / d).toFixed(4)));
  return { standardSoftmax, onlineSoftmax: onlineResult };
}

console.log('--- PART 2: ONLINE SOFTMAX ---');
const sampleLogits = [2.4, 4.1, 1.2, 5.8, 3.0];
console.log(onlineSoftmax(sampleLogits));

// Part 3: FlashAttention-2 Tiled Block Attention Simulation
interface BlockResult {
  blockIdx: number;
  outputVector: number[];
  peakMemoryBytes: number;
}

function simulateFlashAttention2(Q: number[][], K: number[][], V: number[][], blockSize: number): number[][] {
  const N = Q.length;
  const d = Q[0].length;
  const O: number[][] = Array.from({ length: N }, () => new Array(d).fill(0));
  const scale = 1.0 / Math.sqrt(d);

  // Outer loop over Q blocks (FlashAttention-2 paradigm: parallelize over Q blocks)
  for (let i = 0; i < N; i += blockSize) {
    const qi_end = Math.min(i + blockSize, N);
    const Q_block = Q.slice(i, qi_end);

    // Initialize running max m and sum d for this Q block
    const m_block = new Array(qi_end - i).fill(-Infinity);
    const d_block = new Array(qi_end - i).fill(0);
    const O_block = Array.from({ length: qi_end - i }, () => new Array(d).fill(0));

    // Inner loop over K, V blocks
    for (let j = 0; j < N; j += blockSize) {
      const kj_end = Math.min(j + blockSize, N);
      const K_block = K.slice(j, kj_end);
      const V_block = V.slice(j, kj_end);

      // Compute tile scores S_tile = Q_block * K_block^T * scale
      for (let bi = 0; bi < Q_block.length; bi++) {
        const scores: number[] = [];
        for (let bj = 0; bj < K_block.length; bj++) {
          let dot = 0;
          for (let k = 0; k < d; k++) dot += Q_block[bi][k] * K_block[bj][k];
          scores.push(dot * scale);
        }

        const tileMax = Math.max(...scores);
        const prevM = m_block[bi];
        const newM = Math.max(prevM, tileMax);
        const alpha = Math.exp(prevM - newM);

        let tileExpSum = 0;
        const P_tile: number[] = [];
        for (let bj = 0; bj < scores.length; bj++) {
          const p = Math.exp(scores[bj] - newM);
          P_tile.push(p);
          tileExpSum += p;
        }

        // Rescale running O_block and add P_tile * V_block
        for (let k = 0; k < d; k++) {
          let pv = 0;
          for (let bj = 0; bj < V_block.length; bj++) {
            pv += P_tile[bj] * V_block[bj][k];
          }
          O_block[bi][k] = O_block[bi][k] * alpha + pv;
        }

        d_block[bi] = d_block[bi] * alpha + tileExpSum;
        m_block[bi] = newM;
      }
    }

    // Final normalization by d_block
    for (let bi = 0; bi < Q_block.length; bi++) {
      for (let k = 0; k < d; k++) {
        O[i + bi][k] = Number((O_block[bi][k] / d_block[bi]).toFixed(4));
      }
    }
  }

  return O;
}

console.log('--- PART 3: FLASHATTENTION-2 TILING ---');
const dummyQ = [[1, 0], [0, 1], [1, 1], [0.5, 0.5]];
const dummyK = [[1, 0], [0, 1], [1, 1], [0.5, 0.5]];
const dummyV = [[10, 20], [30, 40], [50, 60], [70, 80]];
const outO = simulateFlashAttention2(dummyQ, dummyK, dummyV, 2);
console.log('Tiled FlashAttention Output:', outO);

// Part 4: FlashAttention-3 Hardware Asynchrony Simulation
interface HopperPipelineStage {
  stage: string;
  hardwareUnit: string;
  latencyNs: number;
  isAsynchronous: boolean;
}

function inspectHopperFA3Pipeline(): HopperPipelineStage[] {
  return [
    { stage: 'TMA Global-to-Shared Load', hardwareUnit: 'TMA Engine', latencyNs: 120, isAsynchronous: true },
    { stage: 'Warpgroup MMA FP8 Matrix Mult', hardwareUnit: 'Tensor Cores (WGMMA)', latencyNs: 45, isAsynchronous: true },
    { stage: 'Softmax Rescaling & Exponentiation', hardwareUnit: 'CUDA Cores (ALU)', latencyNs: 25, isAsynchronous: false },
    { stage: 'TMA Shared-to-Global Store', hardwareUnit: 'TMA Engine', latencyNs: 90, isAsynchronous: true }
  ];
}

console.log('--- PART 4: FLASHATTENTION-3 ASYNC PIPELINE ---');
console.log(inspectHopperFA3Pipeline());

// Part 5: Benchmark & Telemetry Summary
interface KernelBenchmark {
  kernel: string;
  seqLen: number;
  hbmTrafficGB: number;
  runtimeMs: number;
  speedupRatio: string;
}

function benchmarkAttentionKernels(seqLen: number): KernelBenchmark[] {
  const naiveHBM = (seqLen * seqLen * 4 * 32 * 2) / (1024 * 1024 * 1024);
  const fa2HBM = (seqLen * 4096 * 4 * 4) / (1024 * 1024 * 1024); // only Q, K, V, O read/write
  const fa3HBM = fa2HBM * 0.5; // FP8 halves memory traffic

  const naiveRuntime = seqLen * 0.05;
  const fa2Runtime = naiveRuntime * 0.28;
  const fa3Runtime = fa2Runtime * 0.52;

  return [
    { kernel: 'Standard PyTorch Attention', seqLen, hbmTrafficGB: Number(naiveHBM.toFixed(2)), runtimeMs: Number(naiveRuntime.toFixed(2)), speedupRatio: '1.00x (Baseline)' },
    { kernel: 'FlashAttention-2 (FP16)', seqLen, hbmTrafficGB: Number(fa2HBM.toFixed(2)), runtimeMs: Number(fa2Runtime.toFixed(2)), speedupRatio: `${(naiveRuntime / fa2Runtime).toFixed(2)}x` },
    { kernel: 'FlashAttention-3 (FP8 Hopper)', seqLen, hbmTrafficGB: Number(fa3HBM.toFixed(2)), runtimeMs: Number(fa3Runtime.toFixed(2)), speedupRatio: `${(naiveRuntime / fa3Runtime).toFixed(2)}x` }
  ];
}

console.log('--- PART 5: BENCHMARK SUMMARY ---');
console.log(benchmarkAttentionKernels(8192));
