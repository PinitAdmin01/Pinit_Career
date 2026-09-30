import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';
import { TRAIN_DAYS } from './trainPythonDays';

/**
 * Distributed Model Training in Python (course-train-python), for the Python track.
 *
 * A Python-first course: the 30 days are in trainPythonDays.ts and every practice task is written and
 * checked in Python. The lessons are the long Python lessons (longLessons.ts).
 * Checks are plain `assert` statements run after the student's code; the reference answers live in
 * tests/fixtures/train_python_solutions.json, not here, so students never download them.
 */
type Task = { title: string; desc: string; starter: string; hint: string; test: string };
type Day = { e: Task; a: Task };

const DAYS: Day[] = [
  {
    "e": {
      "title": "Model Memory Calculator",
      "desc": "Write `model_memory_gb(params, precision)` returning the memory needed just to store the weights, in gigabytes (1 GB = 10**9 bytes), rounded to 2 decimals. Bytes per parameter: 'fp32' 4, 'fp16' 2, 'bf16' 2, 'int8' 1, 'int4' 0.5. Raise ValueError for any other precision or if params is not a positive number.",
      "starter": "BYTES = {'fp32': 4, 'fp16': 2}  # add bf16, int8 and int4\n\n\ndef model_memory_gb(params, precision):\n    pass",
      "hint": "round(params * BYTES[precision] / 10**9, 2), after checking the precision is known.",
      "test": "assert model_memory_gb(7_000_000_000, 'fp16') == 14.0, f'7B in fp16: got {model_memory_gb(7_000_000_000, \"fp16\")}'\nassert model_memory_gb(7_000_000_000, 'fp32') == 28.0, '7B in fp32'\nassert model_memory_gb(70_000_000_000, 'int4') == 35.0, '70B in int4'\nassert model_memory_gb(1_300_000_000, 'bf16') == 2.6, 'bf16 is 2 bytes'\nassert model_memory_gb(125_000_000, 'int8') == 0.12, 'rounded to 2 decimals'\nfor bad in [(1000, 'fp64'), (0, 'fp16'), (-5, 'fp32')]:\n    try:\n        model_memory_gb(*bad)\n        raise AssertionError(f'{bad} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Training Time Estimator",
      "desc": "Training compute is about 6 × parameters × tokens FLOPs. Write `training_days(params, tokens, gpus, peak_flops, mfu)` returning the wall-clock days, rounded to 1 decimal: total FLOPs / (gpus × peak_flops × mfu) seconds, divided by 86400. mfu is the fraction of peak actually achieved (between 0 and 1, exclusive of 0). Raise ValueError if gpus < 1 or mfu is not in (0, 1].",
      "starter": "def training_days(params, tokens, gpus, peak_flops, mfu):\n    pass",
      "hint": "seconds = 6 * params * tokens / (gpus * peak_flops * mfu); round(seconds / 86400, 1)",
      "test": "# 7B parameters, 1T tokens, 512 GPUs at 312 TFLOP/s, 40% utilisation\nd = training_days(7e9, 1e12, 512, 312e12, 0.4)\nassert d == 7.6, f'Got {d}'\nassert training_days(1e9, 2e10, 8, 312e12, 0.5) == 1.1, 'Small run'\nassert training_days(7e9, 1e12, 1024, 312e12, 0.4) == 3.8, 'Twice the GPUs, half the time'\nfor bad in [(1e9, 1e9, 0, 1e12, 0.5), (1e9, 1e9, 8, 1e12, 0), (1e9, 1e9, 8, 1e12, 1.5)]:\n    try:\n        training_days(*bad)\n        raise AssertionError(f'{bad} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Loss and Gradients",
      "desc": "For the model y = w·x + b, write `mse_and_grads(w, b, xs, ys)` returning (loss, dw, db) where loss = mean((w·x + b − y)²), dw = mean(2·(w·x + b − y)·x) and db = mean(2·(w·x + b − y)). Round all three to 4 decimals.",
      "starter": "def mse_and_grads(w, b, xs, ys):\n    pass",
      "hint": "errors = [w * x + b - y for x, y in zip(xs, ys)]; n = len(xs)",
      "test": "xs, ys = [1, 2, 3], [3, 5, 7]\nassert mse_and_grads(2, 1, xs, ys) == (0.0, 0.0, 0.0), 'Perfect fit: y = 2x + 1'\nr = mse_and_grads(0, 0, xs, ys)\nassert r == (27.6667, -22.6667, -10.0), f'Got {r}'\nassert mse_and_grads(1, 0, [2], [1]) == (1.0, 4.0, 2.0), 'One point'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Fit a Line by Gradient Descent",
      "desc": "Write `fit_line(xs, ys, lr, steps)` starting from w = 0 and b = 0. On each step compute the MSE gradients dw and db (as on Day 2 Practice 1, without rounding) and update w -= lr·dw, b -= lr·db. Return (w, b) rounded to 3 decimals.",
      "starter": "def fit_line(xs, ys, lr, steps):\n    w, b = 0.0, 0.0\n    pass",
      "hint": "Inside the loop compute errors, then dw and db, then update both.",
      "test": "xs, ys = [0, 1, 2, 3, 4], [1, 3, 5, 7, 9]\nw, b = fit_line(xs, ys, 0.05, 2000)\nassert (w, b) == (2.0, 1.0), f'Should learn y = 2x + 1, got {(w, b)}'\nassert fit_line(xs, ys, 0.05, 1) == (1.4, 0.5), f'One step: got {fit_line(xs, ys, 0.05, 1)}'\nassert fit_line(xs, ys, 0.05, 0) == (0.0, 0.0), 'No steps, no change'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Mini-Batch Maker",
      "desc": "Write `make_batches(n, batch_size, drop_last=False)` returning a list of (start, end) index pairs that cover 0..n in order, each of size batch_size except possibly the last. If drop_last is True, leave out a final batch that is smaller than batch_size. Raise ValueError if batch_size < 1.",
      "starter": "def make_batches(n, batch_size, drop_last=False):\n    pass",
      "hint": "Loop start over range(0, n, batch_size); end = min(start + batch_size, n).",
      "test": "assert make_batches(10, 4) == [(0, 4), (4, 8), (8, 10)], f'Got {make_batches(10, 4)}'\nassert make_batches(10, 4, drop_last=True) == [(0, 4), (4, 8)], 'Drop the short last batch'\nassert make_batches(8, 4, drop_last=True) == [(0, 4), (4, 8)], 'Nothing to drop'\nassert make_batches(0, 3) == [], 'No data'\ntry:\n    make_batches(5, 0)\n    raise AssertionError('batch_size 0 must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Learning Rate Scaling Rule",
      "desc": "When the batch size grows, the learning rate is often scaled. Write `scaled_lr(base_lr, base_batch, new_batch, rule='linear')`: 'linear' multiplies by new_batch / base_batch; 'sqrt' multiplies by the square root of that ratio. Round to 6 decimals. Raise ValueError for an unknown rule.",
      "starter": "import math\n\n\ndef scaled_lr(base_lr, base_batch, new_batch, rule='linear'):\n    pass",
      "hint": "ratio = new_batch / base_batch; use math.sqrt(ratio) for the sqrt rule.",
      "test": "assert scaled_lr(0.1, 256, 1024) == 0.4, f'Linear: got {scaled_lr(0.1, 256, 1024)}'\nassert scaled_lr(0.001, 256, 1024, 'sqrt') == 0.002, 'Square root of 4 is 2'\nassert scaled_lr(0.1, 256, 128) == 0.05, 'Smaller batch, smaller rate'\nassert scaled_lr(0.0003, 512, 2048, 'sqrt') == 0.0006, 'sqrt rule'\ntry:\n    scaled_lr(0.1, 256, 512, 'cubic')\n    raise AssertionError('unknown rule must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Distributed Sampler",
      "desc": "Write `shard_indices(n, world_size, rank)` like PyTorch's DistributedSampler without shuffling: take indices 0..n-1, pad the list by repeating indices from the start until its length is a multiple of world_size, then return every world_size-th index starting at rank (indices[rank::world_size]). Raise ValueError if rank is not in 0..world_size-1.",
      "starter": "def shard_indices(n, world_size, rank):\n    pass",
      "hint": "total = ceil(n / world_size) * world_size; indices = list(range(n)); indices += indices[:total - n]",
      "test": "assert shard_indices(10, 4, 0) == [0, 4, 8], f'Got {shard_indices(10, 4, 0)}'\nassert shard_indices(10, 4, 2) == [2, 6, 0], 'Padded with index 0'\nassert shard_indices(10, 4, 3) == [3, 7, 1], 'Padded with index 1'\nassert shard_indices(8, 2, 1) == [1, 3, 5, 7], 'No padding needed'\nassert sorted(sum((shard_indices(10, 4, r) for r in range(4)), [])) == [0, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9], 'All ranks cover all data'\ntry:\n    shard_indices(10, 4, 4)\n    raise AssertionError('rank 4 of 4 must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Gradient Averaging",
      "desc": "Each worker computes a gradient (a list of floats) on its own shard. Write `average_gradients(worker_grads)` returning the element-wise mean across workers, each value rounded to 4 decimals. Raise ValueError if the list is empty or the gradients have different lengths.",
      "starter": "def average_gradients(worker_grads):\n    pass",
      "hint": "Use zip(*worker_grads) to walk the same position across workers.",
      "test": "g = average_gradients([[1.0, 2.0, 3.0], [3.0, 2.0, 1.0]])\nassert g == [2.0, 2.0, 2.0], f'Got {g}'\nassert average_gradients([[0.5, -1.0]]) == [0.5, -1.0], 'One worker'\nassert average_gradients([[1, 1], [2, 2], [4, 4]]) == [2.3333, 2.3333], 'Three workers'\nfor bad in [[], [[1.0, 2.0], [1.0]]]:\n    try:\n        average_gradients(bad)\n        raise AssertionError(f'{bad} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "All-Reduce",
      "desc": "Write `all_reduce(vectors, op='sum')` where vectors is a list with one list of numbers per worker. Combine them element-wise with op ('sum', 'mean' or 'max') and return what every worker ends up holding: a list with one copy of the combined vector per worker. Mean values are rounded to 4 decimals. Raise ValueError for an unknown op.",
      "starter": "def all_reduce(vectors, op='sum'):\n    pass",
      "hint": "Combine position by position with zip(*vectors), then return [list(result) for _ in vectors].",
      "test": "r = all_reduce([[1, 2], [3, 4], [5, 6]])\nassert r == [[9, 12], [9, 12], [9, 12]], f'Got {r}'\nassert all_reduce([[1, 5], [3, 2]], 'max') == [[3, 5], [3, 5]], 'max'\nassert all_reduce([[1, 2], [2, 2], [2, 3]], 'mean') == [[1.6667, 2.3333]] * 3, 'mean'\nr = all_reduce([[1, 1], [1, 1]])\nr[0][0] = 99\nassert r[1][0] == 2, 'Each worker needs its own copy'\ntry:\n    all_reduce([[1]], 'min_max')\n    raise AssertionError('unknown op must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Ring All-Reduce Cost",
      "desc": "In ring all-reduce with p workers, each worker takes 2(p − 1) steps and sends 2(p − 1)/p of the data. Write `ring_cost(size_mb, workers)` returning {'steps': 2(p − 1), 'sent_mb_per_worker': rounded to 2 decimals}. With one worker, both are 0. Raise ValueError if workers < 1.",
      "starter": "def ring_cost(size_mb, workers):\n    pass",
      "hint": "p = workers; steps = 2 * (p - 1); sent = 2 * (p - 1) / p * size_mb",
      "test": "assert ring_cost(1000, 4) == {'steps': 6, 'sent_mb_per_worker': 1500.0}, f'Got {ring_cost(1000, 4)}'\nassert ring_cost(1000, 1) == {'steps': 0, 'sent_mb_per_worker': 0.0}, 'Nothing to send alone'\nassert ring_cost(1000, 64) == {'steps': 126, 'sent_mb_per_worker': 1968.75}, 'Traffic approaches 2x size'\nassert ring_cost(350, 3) == {'steps': 4, 'sent_mb_per_worker': 466.67}, 'Rounded'\ntry:\n    ring_cost(10, 0)\n    raise AssertionError('0 workers must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Gradient Accumulator",
      "desc": "Write `accumulate(micro_grads, accum_steps)` where micro_grads is a list of gradients (lists of floats), one per micro-batch. Group them into consecutive groups of accum_steps, and for each complete group return the element-wise mean (rounded to 4 decimals): that is the gradient used for one optimizer update. A final incomplete group is ignored.",
      "starter": "def accumulate(micro_grads, accum_steps):\n    pass",
      "hint": "for i in range(0, len(micro_grads) - accum_steps + 1, accum_steps): average micro_grads[i:i + accum_steps]",
      "test": "g = [[1.0, 0.0], [3.0, 2.0], [5.0, 4.0], [7.0, 6.0], [9.0, 9.0]]\nassert accumulate(g, 2) == [[2.0, 1.0], [6.0, 5.0]], f'Got {accumulate(g, 2)}'\nassert accumulate(g, 1) == [[1.0, 0.0], [3.0, 2.0], [5.0, 4.0], [7.0, 6.0], [9.0, 9.0]], 'No accumulation'\nassert accumulate(g, 3) == [[3.0, 2.0]], 'One full group of three'\nassert accumulate(g, 6) == [], 'Not enough micro-batches yet'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Accumulation Steps Planner",
      "desc": "The effective batch = micro_batch × accum_steps × gpus. Write `accum_steps_needed(target_batch, micro_batch, gpus)` returning the number of accumulation steps that gives exactly the target batch. Raise ValueError if it cannot be reached exactly (target not divisible by micro_batch × gpus) or any argument is below 1.",
      "starter": "def accum_steps_needed(target_batch, micro_batch, gpus):\n    pass",
      "hint": "per_step = micro_batch * gpus; check target_batch % per_step == 0",
      "test": "assert accum_steps_needed(1024, 8, 16) == 8, f'Got {accum_steps_needed(1024, 8, 16)}'\nassert accum_steps_needed(512, 4, 128) == 1, 'No accumulation needed'\nassert accum_steps_needed(2048, 2, 8) == 128, 'Few GPUs, many steps'\nfor bad in [(1000, 8, 16), (1024, 0, 16), (1024, 8, 0)]:\n    try:\n        accum_steps_needed(*bad)\n        raise AssertionError(f'{bad} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "FP16 Range Check",
      "desc": "FP16 can hold magnitudes up to 65504, and the smallest positive value it can represent is 2**-24 (about 5.96e-8). Write `fp16_status(x)` returning 'OVERFLOW' if abs(x) > 65504, 'UNDERFLOW' if x is not 0 but abs(x) < 2**-24, and 'OK' otherwise (including 0).",
      "starter": "def fp16_status(x):\n    pass",
      "hint": "Check overflow first, then underflow (x != 0 and abs(x) < 2 ** -24).",
      "test": "assert fp16_status(1.5) == 'OK', 'Normal value'\nassert fp16_status(65504) == 'OK', 'The largest FP16 value'\nassert fp16_status(70000) == 'OVERFLOW', 'Too big'\nassert fp16_status(-1e6) == 'OVERFLOW', 'Negative too big'\nassert fp16_status(1e-9) == 'UNDERFLOW', 'Tiny gradient becomes zero'\nassert fp16_status(0) == 'OK', 'Zero is fine'\nassert fp16_status(1e-7) == 'OK', 'Just above the smallest subnormal'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Dynamic Loss Scaler",
      "desc": "Write a class `LossScaler(scale=65536.0, growth_interval=2000)`. Method `update(found_overflow)` is called after each step and returns True if the optimizer step should be applied. On overflow: halve the scale (but never below 1.0), reset the good-step counter and return False. Otherwise: count a good step; when the counter reaches growth_interval, double the scale and reset the counter; return True. Keep the current scale in `self.scale`.",
      "starter": "class LossScaler:\n    def __init__(self, scale=65536.0, growth_interval=2000):\n        pass\n\n    def update(self, found_overflow):\n        pass",
      "hint": "Keep self.scale and self.good_steps; on overflow: self.scale = max(1.0, self.scale / 2).",
      "test": "s = LossScaler(scale=1024.0, growth_interval=3)\nassert s.update(True) is False and s.scale == 512.0, 'Overflow halves and skips'\nassert s.update(False) is True and s.scale == 512.0, 'One good step'\nassert s.update(False) is True and s.update(False) is True, 'More good steps'\nassert s.scale == 1024.0, f'Three good steps double the scale, got {s.scale}'\ns.update(False)\ns.update(True)\ns.update(False)\ns.update(False)\nassert s.scale == 512.0, f'Overflow resets the counter, got {s.scale}'\nt = LossScaler(scale=2.0)\nt.update(True)\nt.update(True)\nassert t.scale == 1.0, 'Never below 1.0'\nassert LossScaler().scale == 65536.0, 'Default scale'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Training Memory Calculator",
      "desc": "Write `training_memory_gb(params, setup)` returning weights + gradients + optimizer states in GB (10**9 bytes), rounded to 1 decimal. Bytes per parameter: 'adam_mixed' 16 (2 fp16 weights + 2 fp16 grads + 12 fp32 master weights and Adam moments), 'adam_fp32' 16 (4 weights + 4 grads + 8 moments), 'sgd_momentum_fp32' 12 (4 + 4 + 4), 'inference_fp16' 2. Raise ValueError for an unknown setup.",
      "starter": "BYTES_PER_PARAM = {'adam_mixed': 16}  # add the other setups\n\n\ndef training_memory_gb(params, setup):\n    pass",
      "hint": "round(params * BYTES_PER_PARAM[setup] / 1e9, 1)",
      "test": "assert training_memory_gb(7e9, 'adam_mixed') == 112.0, f'Got {training_memory_gb(7e9, \"adam_mixed\")}'\nassert training_memory_gb(7e9, 'inference_fp16') == 14.0, 'Inference only needs weights'\nassert training_memory_gb(1.5e9, 'sgd_momentum_fp32') == 18.0, 'SGD with momentum'\nassert training_memory_gb(125e6, 'adam_fp32') == 2.0, 'Small model'\ntry:\n    training_memory_gb(1e9, 'lion')\n    raise AssertionError('unknown setup must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Activation Memory and Fit Check",
      "desc": "Activation memory for a transformer is roughly batch × seq_len × hidden × layers × 34 bytes (with 16-bit activations). Write `fits_on_gpu(params, batch, seq_len, hidden, layers, gpu_gb)` returning {'states_gb': 16 × params / 1e9, 'activations_gb': the estimate / 1e9, 'total_gb': their sum, 'fits': total_gb <= gpu_gb}, with the three numbers rounded to 1 decimal (compare using the rounded total).",
      "starter": "def fits_on_gpu(params, batch, seq_len, hidden, layers, gpu_gb):\n    pass",
      "hint": "states = 16 * params / 1e9; acts = batch * seq_len * hidden * layers * 34 / 1e9",
      "test": "r = fits_on_gpu(1.3e9, 8, 2048, 2048, 24, 80)\nassert r == {'states_gb': 20.8, 'activations_gb': 27.4, 'total_gb': 48.2, 'fits': True}, f'Got {r}'\nr = fits_on_gpu(7e9, 8, 4096, 4096, 32, 80)\nassert r['fits'] is False and r['states_gb'] == 112.0, f'7B does not fit on one 80 GB GPU: {r}'\nassert fits_on_gpu(1e8, 1, 512, 768, 12, 16)['fits'] is True, 'Small model fits'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "ZeRO Memory per GPU",
      "desc": "With mixed-precision Adam (2 bytes weights, 2 bytes gradients, 12 bytes optimizer states per parameter) and N_d data-parallel GPUs, ZeRO stages need per GPU: stage 0: 16·Ψ; stage 1: 4·Ψ + 12·Ψ/N_d; stage 2: 2·Ψ + 14·Ψ/N_d; stage 3: 16·Ψ/N_d bytes (Ψ = params). Write `zero_memory_gb(params, gpus, stage)` returning GB (1e9 bytes) rounded to 1 decimal. Raise ValueError for a stage outside 0-3.",
      "starter": "def zero_memory_gb(params, gpus, stage):\n    pass",
      "hint": "Pick the formula for the stage, then divide by 1e9 and round.",
      "test": "p, g = 7.5e9, 64\nassert zero_memory_gb(p, g, 0) == 120.0, 'Baseline: 16 bytes per parameter'\nassert zero_memory_gb(p, g, 1) == 31.4, f'Stage 1: got {zero_memory_gb(p, g, 1)}'\nassert zero_memory_gb(p, g, 2) == 16.6, f'Stage 2: got {zero_memory_gb(p, g, 2)}'\nassert zero_memory_gb(p, g, 3) == 1.9, f'Stage 3: got {zero_memory_gb(p, g, 3)}'\nassert zero_memory_gb(p, 1, 3) == 120.0, 'One GPU: no sharding gain'\ntry:\n    zero_memory_gb(p, g, 4)\n    raise AssertionError('stage 4 must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Largest Model That Fits",
      "desc": "Using the same ZeRO formulas, write `max_params_billion(gpu_gb, gpus, stage, reserve_gb=0)` returning the largest parameter count (in billions, rounded down to 1 decimal with math.floor(x * 10) / 10) whose model states fit in gpu_gb − reserve_gb per GPU. Hint: bytes per parameter per GPU are 16, 4 + 12/N, 2 + 14/N and 16/N for stages 0-3.",
      "starter": "import math\n\n\ndef max_params_billion(gpu_gb, gpus, stage, reserve_gb=0):\n    pass",
      "hint": "per_param = [16, 4 + 12 / gpus, 2 + 14 / gpus, 16 / gpus][stage]; params = (gpu_gb - reserve_gb) * 1e9 / per_param",
      "test": "assert max_params_billion(80, 64, 0) == 5.0, f'Stage 0: got {max_params_billion(80, 64, 0)}'\nassert max_params_billion(80, 64, 1) == 19.1, f'Stage 1: got {max_params_billion(80, 64, 1)}'\nassert max_params_billion(80, 64, 2) == 36.0, f'Stage 2: got {max_params_billion(80, 64, 2)}'\nassert max_params_billion(80, 64, 3) == 320.0, f'Stage 3: got {max_params_billion(80, 64, 3)}'\nassert max_params_billion(80, 64, 3, reserve_gb=20) == 240.0, 'Reserve memory for activations'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "FSDP Schedule",
      "desc": "Write `fsdp_schedule(layers)` returning the list of events for one training step with FSDP over layer names. Forward: for each layer in order, 'gather:<L>', 'forward:<L>', 'free:<L>'. Backward: for each layer in reverse order, 'gather:<L>', 'backward:<L>', 'reduce_scatter:<L>', 'free:<L>'.",
      "starter": "def fsdp_schedule(layers):\n    pass",
      "hint": "Build the forward events in a loop, then loop over reversed(layers) for backward.",
      "test": "s = fsdp_schedule(['L1', 'L2'])\nassert s == ['gather:L1', 'forward:L1', 'free:L1', 'gather:L2', 'forward:L2', 'free:L2',\n             'gather:L2', 'backward:L2', 'reduce_scatter:L2', 'free:L2',\n             'gather:L1', 'backward:L1', 'reduce_scatter:L1', 'free:L1'], f'Got {s}'\nassert len(fsdp_schedule(['a', 'b', 'c'])) == 21, 'Seven events per layer'\nassert fsdp_schedule([]) == [], 'No layers'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Shard and Gather Parameters",
      "desc": "Write `shard(values, world_size)` that pads the flat parameter list with zeros to a multiple of world_size and splits it into world_size equal consecutive shards (a list of lists). Then write `gather(shards, original_length)` that joins the shards and removes the padding.",
      "starter": "def shard(values, world_size):\n    pass\n\n\ndef gather(shards, original_length):\n    pass",
      "hint": "size = ceil(len(values) / world_size); padded = values + [0] * (size * world_size - len(values))",
      "test": "s = shard([1, 2, 3, 4, 5], 2)\nassert s == [[1, 2, 3], [4, 5, 0]], f'Got {s}'\nassert gather(s, 5) == [1, 2, 3, 4, 5], 'Padding removed'\nassert shard([1, 2, 3, 4], 4) == [[1], [2], [3], [4]], 'Exact split'\nassert shard([7], 3) == [[7], [0], [0]], 'More ranks than values'\ndata = list(range(10))\nassert gather(shard(data, 3), 10) == data, 'Round trip'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Column-Parallel Linear Layer",
      "desc": "In column parallelism each device holds some columns of the weight matrix W (a list of rows) and computes part of the output. Write `col_parallel_matmul(x, W, parts)` where x is a vector (list) and W has len(x) rows: split the columns of W into `parts` consecutive equal groups (the number of columns is divisible by parts), compute x·W_part on each, and concatenate the partial outputs. Also return how many output values each device computed: return (output, per_device).",
      "starter": "def col_parallel_matmul(x, W, parts):\n    pass",
      "hint": "cols = len(W[0]) // parts; device k uses columns k*cols to (k+1)*cols; each output j is sum(x[i] * W[i][j]).",
      "test": "x = [1, 2]\nW = [[1, 0, 2, 1],\n     [0, 1, 1, 3]]\nout, per = col_parallel_matmul(x, W, 2)\nassert out == [1, 2, 4, 7] and per == 2, f'Got {(out, per)}'\nassert col_parallel_matmul(x, W, 4) == ([1, 2, 4, 7], 1), 'Four devices'\nassert col_parallel_matmul(x, W, 1) == ([1, 2, 4, 7], 4), 'One device does everything'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Row-Parallel Linear Layer",
      "desc": "In row parallelism each device holds some rows of W and the matching slice of x, computes a partial result of full length, and an all-reduce (sum) combines them. Write `row_parallel_matmul(x, W, parts)` returning (output, partials) where partials is the list of each device's partial output vector and output is their element-wise sum. len(x) is divisible by parts.",
      "starter": "def row_parallel_matmul(x, W, parts):\n    pass",
      "hint": "rows = len(x) // parts; device k computes sum over its rows i of x[i] * W[i][j] for every column j.",
      "test": "x = [1, 2, 3, 4]\nW = [[1, 0], [0, 1], [1, 1], [2, 0]]\nout, partials = row_parallel_matmul(x, W, 2)\nassert partials == [[1, 2], [11, 3]], f'Got {partials}'\nassert out == [12, 5], f'Got {out}'\nassert row_parallel_matmul(x, W, 1) == ([12, 5], [[12, 5]]), 'One device'\nassert row_parallel_matmul(x, W, 4)[0] == [12, 5], 'Same answer on four devices'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Pipeline Bubble",
      "desc": "With p pipeline stages and m micro-batches, the idle fraction of a GPipe schedule is (p − 1) / (m + p − 1). Write `bubble_fraction(stages, micro_batches)` returning it rounded to 3 decimals, and `micro_batches_for(stages, max_bubble)` returning the smallest m whose bubble fraction is at most max_bubble.",
      "starter": "def bubble_fraction(stages, micro_batches):\n    pass\n\n\ndef micro_batches_for(stages, max_bubble):\n    pass",
      "hint": "For the second function, try m = 1, 2, 3 ... until the unrounded fraction is <= max_bubble.",
      "test": "assert bubble_fraction(4, 1) == 0.75, 'One micro-batch: mostly idle'\nassert bubble_fraction(4, 8) == 0.273, f'Got {bubble_fraction(4, 8)}'\nassert bubble_fraction(1, 5) == 0.0, 'No pipeline, no bubble'\nassert micro_batches_for(4, 0.1) == 27, f'Got {micro_batches_for(4, 0.1)}'\nassert micro_batches_for(8, 0.5) == 7, f'Got {micro_batches_for(8, 0.5)}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "GPipe Forward Timeline",
      "desc": "Write `gpipe_forward(stages, micro_batches)` returning the forward-pass timeline: a list of time steps, each a list with one entry per stage holding the micro-batch number (starting at 1) that stage processes at that time, or None when idle. Stage s works on micro-batch k at time s + k − 1 (times and stages counted from 0 for the list positions). There are micro_batches + stages − 1 time steps.",
      "starter": "def gpipe_forward(stages, micro_batches):\n    pass",
      "hint": "At time t, stage s processes micro-batch t - s + 1 if that is between 1 and micro_batches.",
      "test": "t = gpipe_forward(3, 2)\nassert t == [[1, None, None], [2, 1, None], [None, 2, 1], [None, None, 2]], f'Got {t}'\nassert len(gpipe_forward(4, 8)) == 11, 'm + p - 1 steps'\nassert gpipe_forward(1, 3) == [[1], [2], [3]], 'Single stage'\nbusy = sum(v is not None for row in gpipe_forward(4, 8) for v in row)\nassert busy == 32, 'Every stage processes every micro-batch once'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Checkpointed Activation Memory",
      "desc": "Without checkpointing, activations for all L layers are stored. With checkpoints every k layers, you keep one input per segment (L / k of them) plus the full activations of one segment (k layers) during recomputation. Write `activation_memory(layers, per_layer_gb, every=None)` returning GB rounded to 2 decimals: layers × per_layer when every is None, else (layers / every + every) × per_layer. Raise ValueError if every does not divide layers.",
      "starter": "def activation_memory(layers, per_layer_gb, every=None):\n    pass",
      "hint": "if every is None: return round(layers * per_layer_gb, 2)",
      "test": "assert activation_memory(32, 1.5) == 48.0, 'No checkpointing'\nassert activation_memory(32, 1.5, every=4) == 18.0, f'Got {activation_memory(32, 1.5, every=4)}'\nassert activation_memory(32, 1.5, every=32) == 49.5, 'One big segment is worse'\nassert activation_memory(36, 0.25, every=6) == 3.0, 'Square-root spacing'\ntry:\n    activation_memory(32, 1.5, every=5)\n    raise AssertionError('5 does not divide 32')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Best Checkpoint Interval",
      "desc": "Write `best_interval(layers)` returning the divisor k of layers that minimises layers / k + k (the checkpointed memory in units of one layer). If two divisors tie, return the smaller one.",
      "starter": "def best_interval(layers):\n    pass",
      "hint": "Check every k from 1 to layers with layers % k == 0; keep the one with the smallest layers / k + k.",
      "test": "assert best_interval(36) == 6, 'Square root of 36'\nassert best_interval(32) == 4, f'4 and 8 both give 12; pick the smaller: got {best_interval(32)}'\nassert best_interval(24) == 4, f'Got {best_interval(24)}'\nassert best_interval(7) == 1, 'A prime: 1 and 7 tie at 8'\nassert best_interval(1) == 1, 'One layer'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "SGD with Momentum",
      "desc": "Write `momentum_step(w, g, v, lr, beta)` for lists of weights w, gradients g and velocities v. For each position: v_new = beta·v + g, w_new = w − lr·v_new. Return (w_new, v_new) with values rounded to 6 decimals.",
      "starter": "def momentum_step(w, g, v, lr, beta):\n    pass",
      "hint": "Loop with zip(w, g, v) and build two new lists.",
      "test": "w, v = momentum_step([1.0, 2.0], [0.5, -1.0], [0.0, 0.0], 0.1, 0.9)\nassert (w, v) == ([0.95, 2.1], [0.5, -1.0]), f'First step: got {(w, v)}'\nw, v = momentum_step(w, [0.5, -1.0], v, 0.1, 0.9)\nassert (w, v) == ([0.855, 2.29], [0.95, -1.9]), f'Momentum builds up: got {(w, v)}'\nassert momentum_step([1.0], [0.0], [1.0], 0.5, 0.0) == ([1.0], [0.0]), 'beta 0 is plain SGD'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Adam Optimizer",
      "desc": "Write a class `Adam(lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8)` with a method `step(w, g)` for lists w and g that returns the new weights rounded to 6 decimals. Keep first moments m and second moments v (start at zeros, sized on the first call) and a step counter t. Each step: t += 1; m = b1·m + (1 − b1)·g; v = b2·v + (1 − b2)·g²; m_hat = m / (1 − b1^t); v_hat = v / (1 − b2^t); w = w − lr·m_hat / (sqrt(v_hat) + eps). Keep the unrounded m and v.",
      "starter": "import math\n\n\nclass Adam:\n    def __init__(self, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):\n        pass\n\n    def step(self, w, g):\n        pass",
      "hint": "On the first step, m_hat equals g and v_hat equals g squared, so each weight moves by about lr in the opposite sign of its gradient.",
      "test": "opt = Adam(lr=0.1)\nw = opt.step([1.0, -1.0], [0.5, -2.0])\nassert w == [0.9, -0.9], f'First Adam step moves each weight by lr: got {w}'\nw = opt.step(w, [0.5, 1.0])\nassert w == [0.8, -0.873366], f'Got {w}'\nassert opt.t == 2, 'Step counter'\nassert Adam(lr=0.01).step([0.0], [0.0]) == [0.0], 'Zero gradient, no move'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Warmup + Cosine Schedule",
      "desc": "Write `lr_at(step, max_lr, warmup, total, min_lr=0.0)`. During warmup (step < warmup) the rate rises linearly: max_lr × (step + 1) / warmup. After that, progress = (step − warmup) / (total − warmup) and the rate is min_lr + 0.5 × (max_lr − min_lr) × (1 + cos(π × progress)). From step >= total, return min_lr. Round to 8 decimals.",
      "starter": "import math\n\n\ndef lr_at(step, max_lr, warmup, total, min_lr=0.0):\n    pass",
      "hint": "Handle three cases: warmup, cosine decay and after the end.",
      "test": "assert lr_at(0, 3e-4, 100, 1000) == 3e-6, 'First warmup step'\nassert lr_at(99, 3e-4, 100, 1000) == 3e-4, 'End of warmup'\nassert lr_at(100, 3e-4, 100, 1000) == 3e-4, 'Start of decay'\nassert lr_at(550, 3e-4, 100, 1000) == 1.5e-4, f'Halfway: got {lr_at(550, 3e-4, 100, 1000)}'\nassert lr_at(1000, 3e-4, 100, 1000, min_lr=3e-5) == 3e-5, 'Floor after the end'\nassert lr_at(550, 1.0, 100, 1000, min_lr=0.1) == 0.55, 'Halfway to the floor'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Step Decay Schedule",
      "desc": "Write `step_decay(step, base_lr, drop, every)` returning base_lr × drop^(step // every), rounded to 8 decimals, and `schedule(steps, base_lr, drop, every)` returning a list of (first_step, lr) pairs, one for each distinct rate over steps 0..steps-1, in order.",
      "starter": "def step_decay(step, base_lr, drop, every):\n    pass\n\n\ndef schedule(steps, base_lr, drop, every):\n    pass",
      "hint": "The rate changes at 0, every, 2*every, ...; build the pairs with range(0, steps, every).",
      "test": "assert step_decay(0, 0.1, 0.5, 30) == 0.1, 'Start'\nassert step_decay(29, 0.1, 0.5, 30) == 0.1, 'Still first stage'\nassert step_decay(30, 0.1, 0.5, 30) == 0.05, 'First drop'\nassert step_decay(95, 0.1, 0.1, 30) == 0.0001, f'Got {step_decay(95, 0.1, 0.1, 30)}'\nassert schedule(90, 0.1, 0.5, 30) == [(0, 0.1), (30, 0.05), (60, 0.025)], f'Got {schedule(90, 0.1, 0.5, 30)}'\nassert schedule(10, 0.2, 0.5, 30) == [(0, 0.2)], 'Short run'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Global-Norm Gradient Clipping",
      "desc": "Write `clip_by_global_norm(grads, max_norm)` where grads is a list of gradient lists (one per layer). The global norm is sqrt of the sum of squares of every value. If it is larger than max_norm, multiply every value by max_norm / norm. Return (clipped_grads, norm) with every number rounded to 4 decimals (clip using the unrounded norm).",
      "starter": "import math\n\n\ndef clip_by_global_norm(grads, max_norm):\n    pass",
      "hint": "norm = math.sqrt(sum(v * v for layer in grads for v in layer)); scale = max_norm / norm if norm > max_norm else 1.0",
      "test": "g, n = clip_by_global_norm([[3.0], [4.0]], 1.0)\nassert n == 5.0 and g == [[0.6], [0.8]], f'Got {(g, n)}'\ng, n = clip_by_global_norm([[0.3, 0.4]], 1.0)\nassert g == [[0.3, 0.4]] and n == 0.5, 'Small gradients unchanged'\ng, n = clip_by_global_norm([[1.0, 1.0], [1.0, 1.0]], 1.0)\nassert g == [[0.5, 0.5], [0.5, 0.5]] and n == 2.0, f'Got {(g, n)}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Loss Spike Detector",
      "desc": "Write `first_instability(losses, window=3, factor=2.0)` returning the index of the first loss that is NaN (use math.isnan) or greater than factor × the mean of the previous `window` losses (only check once at least `window` earlier losses exist). Return None if training looks stable.",
      "starter": "import math\n\n\ndef first_instability(losses, window=3, factor=2.0):\n    pass",
      "hint": "For i in range(len(losses)): check NaN first, then if i >= window compare with the mean of losses[i - window:i].",
      "test": "assert first_instability([4.0, 3.5, 3.2, 3.0, 2.9]) is None, 'Healthy run'\nassert first_instability([4.0, 3.5, 3.2, 3.0, 7.5, 3.1]) == 4, 'Spike at index 4'\nassert first_instability([4.0, 3.5, float('nan'), 3.0]) == 2, 'NaN at index 2'\nassert first_instability([1.0, 5.0, 1.0, 1.0]) is None, 'Too early to judge index 1'\nassert first_instability([2.0, 2.0, 5.0], window=2, factor=2.0) == 2, 'Window of 2'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Checkpoint Save and Load",
      "desc": "Write `save_checkpoint(step, weights, optimizer_state, seed)` returning a JSON string (json.dumps with sort_keys=True) of {'version': 1, 'step': ..., 'weights': ..., 'optimizer': ..., 'seed': ...}. Write `load_checkpoint(text)` that parses it and returns the dict, raising ValueError if the version is not 1 or any of the keys step, weights, optimizer, seed is missing.",
      "starter": "import json\n\n\ndef save_checkpoint(step, weights, optimizer_state, seed):\n    pass\n\n\ndef load_checkpoint(text):\n    pass",
      "hint": "Check data.get('version') == 1 and that every required key is in the dict.",
      "test": "text = save_checkpoint(1200, [0.5, -0.25], {'m': [0.1, 0.0], 't': 1200}, 42)\nassert isinstance(text, str) and text.startswith('{\"optimizer\"'), 'Sorted-key JSON text'\nck = load_checkpoint(text)\nassert ck['step'] == 1200 and ck['weights'] == [0.5, -0.25] and ck['optimizer']['t'] == 1200 and ck['seed'] == 42, f'Got {ck}'\nfor bad in ['{\"version\": 2, \"step\": 1, \"weights\": [], \"optimizer\": {}, \"seed\": 0}',\n            '{\"version\": 1, \"step\": 1, \"weights\": []}']:\n    try:\n        load_checkpoint(bad)\n        raise AssertionError('must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Latest Valid Checkpoint",
      "desc": "A sharded checkpoint is valid only if every shard was written and its checksum matches. Write `latest_valid(checkpoints, shards)` where checkpoints is a list of dicts {'step': int, 'written': list of shard ids written, 'bad_checksums': list of shard ids}. Return the highest step whose written shards include all ids 0..shards-1 and whose bad_checksums is empty, or None.",
      "starter": "def latest_valid(checkpoints, shards):\n    pass",
      "hint": "valid = [c['step'] for c in checkpoints if set(range(shards)) <= set(c['written']) and not c['bad_checksums']]",
      "test": "cks = [{'step': 1000, 'written': [0, 1, 2, 3], 'bad_checksums': []},\n       {'step': 2000, 'written': [0, 1, 2, 3], 'bad_checksums': [2]},\n       {'step': 3000, 'written': [0, 1, 3], 'bad_checksums': []}]\nassert latest_valid(cks, 4) == 1000, f'Got {latest_valid(cks, 4)}'\ncks.append({'step': 2500, 'written': [3, 2, 1, 0], 'bad_checksums': []})\nassert latest_valid(cks, 4) == 2500, 'Order of shards does not matter'\nassert latest_valid([], 4) is None, 'No checkpoints'\nassert latest_valid(cks[:1], 5) is None, 'Missing shard 4'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Elastic Batch Plan",
      "desc": "When GPUs join or leave, elastic training keeps the global batch fixed by changing gradient accumulation. Write `elastic_plan(global_batch, micro_batch, gpus)` returning {'gpus': gpus, 'accum_steps': ...} if global_batch is divisible by micro_batch × gpus. Otherwise use the largest number of GPUs up to `gpus` that divides it exactly, and return that. Raise ValueError if no GPU count from 1 up works.",
      "starter": "def elastic_plan(global_batch, micro_batch, gpus):\n    pass",
      "hint": "for n in range(gpus, 0, -1): if global_batch % (micro_batch * n) == 0: return ...",
      "test": "assert elastic_plan(1024, 8, 16) == {'gpus': 16, 'accum_steps': 8}, 'Full cluster'\nassert elastic_plan(1024, 8, 15) == {'gpus': 8, 'accum_steps': 16}, f'Lost one GPU: got {elastic_plan(1024, 8, 15)}'\nassert elastic_plan(960, 8, 15) == {'gpus': 15, 'accum_steps': 8}, '15 divides 120'\ntry:\n    elastic_plan(1000, 16, 4)\n    raise AssertionError('1000 is not a multiple of 16')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Lost Work on Failure",
      "desc": "Write `lost_work(fail_step, checkpoint_every, step_seconds, restart_seconds)` returning {'resume_from': the last checkpoint step at or before fail_step (a multiple of checkpoint_every), 'lost_steps': fail_step − resume_from, 'lost_minutes': (lost_steps × step_seconds + restart_seconds) / 60 rounded to 1 decimal}.",
      "starter": "def lost_work(fail_step, checkpoint_every, step_seconds, restart_seconds):\n    pass",
      "hint": "resume_from = fail_step // checkpoint_every * checkpoint_every",
      "test": "r = lost_work(2750, 500, 2.0, 300)\nassert r == {'resume_from': 2500, 'lost_steps': 250, 'lost_minutes': 13.3}, f'Got {r}'\nassert lost_work(3000, 500, 2.0, 0) == {'resume_from': 3000, 'lost_steps': 0, 'lost_minutes': 0.0}, 'Failed right after a checkpoint'\nassert lost_work(999, 1000, 1.5, 120)['lost_minutes'] == 27.0, 'Before the first checkpoint'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Deterministic Epoch Shuffle",
      "desc": "Write `epoch_order(n, seed, epoch)` returning a shuffled list of 0..n-1 made with random.Random(seed * 1000 + epoch).shuffle, so every worker that knows the seed and epoch gets the same order, and each epoch gets a different one.",
      "starter": "import random\n\n\ndef epoch_order(n, seed, epoch):\n    pass",
      "hint": "order = list(range(n)); random.Random(seed * 1000 + epoch).shuffle(order)",
      "test": "import random\na = epoch_order(20, 7, 0)\nassert sorted(a) == list(range(20)), 'A permutation of all indices'\nassert a == epoch_order(20, 7, 0), 'Same seed and epoch, same order'\nassert a != epoch_order(20, 7, 1), 'New epoch, new order'\nexpected = list(range(20))\nrandom.Random(7 * 1000 + 3).shuffle(expected)\nassert epoch_order(20, 7, 3) == expected, 'Use random.Random(seed * 1000 + epoch)'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Balanced Shard Assignment",
      "desc": "Data comes in files of different sizes. Write `assign_shards(sizes, workers)` that gives each file to a worker so loads stay balanced: process files from largest to smallest (ties by lower file index) and give each to the worker with the smallest current load (ties by lower worker index). Return a list with, for each worker, the sorted list of file indices it received.",
      "starter": "def assign_shards(sizes, workers):\n    pass",
      "hint": "order = sorted(range(len(sizes)), key=lambda i: (-sizes[i], i)); pick min(range(workers), key=lambda w: (load[w], w))",
      "test": "r = assign_shards([10, 7, 5, 4, 3, 1], 2)\nassert r == [[0, 3, 5], [1, 2, 4]], f'Got {r}'\nassert assign_shards([5, 5, 5], 3) == [[0], [1], [2]], 'Equal files'\nassert assign_shards([1, 2], 3) == [[1], [0], []], 'More workers than files'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Latency-Bandwidth Model",
      "desc": "The time to send a message is latency + size / bandwidth. Write `transfer_ms(size_mb, latency_us, bandwidth_gbps)` returning milliseconds rounded to 3 decimals. Use 1 MB = 8 megabits and 1 Gbps = 1000 megabits per second.",
      "starter": "def transfer_ms(size_mb, latency_us, bandwidth_gbps):\n    pass",
      "hint": "latency_us / 1000 + size_mb * 8 / (bandwidth_gbps * 1000) * 1000",
      "test": "assert transfer_ms(100, 5, 400) == 2.005, f'InfiniBand-like: got {transfer_ms(100, 5, 400)}'\nassert transfer_ms(100, 50, 25) == 32.05, 'Slower Ethernet'\nassert transfer_ms(0.001, 10, 400) == 0.01, 'Tiny message: latency dominates'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Ring All-Reduce Time",
      "desc": "Ring all-reduce with p GPUs takes 2(p − 1) steps, each sending size / p. Write `allreduce_ms(size_mb, gpus, latency_us, bandwidth_gbps)` returning 2(p − 1) × transfer time of one chunk (latency + (size/p) × 8 / (bandwidth × 1000) seconds, in ms), rounded to 2 decimals. Return 0.0 for one GPU.",
      "starter": "def allreduce_ms(size_mb, gpus, latency_us, bandwidth_gbps):\n    pass",
      "hint": "chunk_ms = latency_us / 1000 + (size_mb / gpus) * 8 / (bandwidth_gbps * 1000) * 1000",
      "test": "assert allreduce_ms(1000, 8, 5, 400) == 35.07, f'Got {allreduce_ms(1000, 8, 5, 400)}'\nassert allreduce_ms(1000, 1, 5, 400) == 0.0, 'Nothing to reduce'\nassert allreduce_ms(1000, 16, 5, 400) == 37.65, f'Bandwidth term approaches 2x size: got {allreduce_ms(1000, 16, 5, 400)}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Gradient Buckets",
      "desc": "Gradients become ready from the last layer to the first. Write `make_buckets(layer_sizes_mb, bucket_mb)` that walks the layers in reverse order (last layer first) and groups their indices into buckets: add layers to the current bucket until its total would exceed bucket_mb, then start a new bucket (a layer larger than bucket_mb gets a bucket of its own). Return the list of buckets (lists of layer indices in the order added).",
      "starter": "def make_buckets(layer_sizes_mb, bucket_mb):\n    pass",
      "hint": "Keep current and total; if current and total + size > bucket_mb: close the bucket.",
      "test": "r = make_buckets([10, 20, 5, 15, 30], 25)\nassert r == [[4], [3, 2], [1], [0]], f'Got {r}'\nassert make_buckets([1, 1, 1, 1], 2) == [[3, 2], [1, 0]], 'Pairs'\nassert make_buckets([100], 25) == [[0]], 'Oversized layer alone'\nassert make_buckets([], 25) == [], 'No layers'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Overlap Timeline",
      "desc": "Each bucket's gradients are computed (compute_ms[i]) one after another, and its all-reduce (comm_ms[i]) can start when its compute has finished and the previous all-reduce is done. Write `step_time(compute_ms, comm_ms)` returning {'overlapped': finish time of the last all-reduce, 'sequential': sum of all compute plus all comm, 'saved_pct': (sequential − overlapped) / sequential × 100 rounded to 1 decimal}.",
      "starter": "def step_time(compute_ms, comm_ms):\n    pass",
      "hint": "Track compute_done and comm_done; comm_done = max(comm_done, compute_done) + comm_ms[i].",
      "test": "r = step_time([10, 10, 10], [8, 8, 8])\nassert r == {'overlapped': 38, 'sequential': 54, 'saved_pct': 29.6}, f'Got {r}'\nr = step_time([5, 5], [20, 20])\nassert r == {'overlapped': 45, 'sequential': 50, 'saved_pct': 10.0}, f'Communication-bound: got {r}'\nassert step_time([10], [5])['saved_pct'] == 0.0, 'One bucket: nothing overlaps'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Compute-Optimal Model Size",
      "desc": "With C = 6·N·D FLOPs and the Chinchilla rule of about 20 tokens per parameter (D = 20·N), C = 120·N². Write `chinchilla(compute_flops)` returning {'params_b': N in billions, 'tokens_b': D in billions}, both rounded to 1 decimal.",
      "starter": "import math\n\n\ndef chinchilla(compute_flops):\n    pass",
      "hint": "N = math.sqrt(compute_flops / 120); D = 20 * N",
      "test": "r = chinchilla(5.76e23)\nassert r == {'params_b': 69.3, 'tokens_b': 1385.6}, f'Chinchilla-scale budget: got {r}'\nassert chinchilla(1.2e21) == {'params_b': 3.2, 'tokens_b': 63.2}, f'Got {chinchilla(1.2e21)}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Training Budget Check",
      "desc": "Write `budget_report(params, tokens, gpu_peak_flops, mfu, price_per_gpu_hour)` returning {'flops': 6 × params × tokens, 'gpu_hours': flops / (gpu_peak_flops × mfu) / 3600 rounded to 0 decimals as an int, 'cost': gpu_hours × price rounded to 0 decimals as an int, 'tokens_per_param': tokens / params rounded to 1 decimal, 'verdict': 'UNDERTRAINED' if tokens_per_param < 15, 'OVERTRAINED' if > 100, else 'BALANCED'}.",
      "starter": "def budget_report(params, tokens, gpu_peak_flops, mfu, price_per_gpu_hour):\n    pass",
      "hint": "Compute gpu_hours with int(round(...)) and use it (rounded) for the cost.",
      "test": "r = budget_report(7e9, 140e9, 312e12, 0.4, 2.0)\nassert r == {'flops': 5.88e21, 'gpu_hours': 13088, 'cost': 26176, 'tokens_per_param': 20.0, 'verdict': 'BALANCED'}, f'Got {r}'\nassert budget_report(70e9, 300e9, 312e12, 0.4, 2.0)['verdict'] == 'UNDERTRAINED', '4.3 tokens per parameter'\nassert budget_report(1e9, 2e12, 312e12, 0.4, 2.0)['verdict'] == 'OVERTRAINED', '2000 tokens per parameter'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Model FLOPs Utilisation",
      "desc": "MFU = achieved FLOP/s ÷ peak FLOP/s, where achieved = 6 × params × tokens_per_second. Write `mfu(tokens_per_second, params, gpus, peak_flops_per_gpu)` returning the fraction rounded to 3 decimals.",
      "starter": "def mfu(tokens_per_second, params, gpus, peak_flops_per_gpu):\n    pass",
      "hint": "6 * params * tokens_per_second / (gpus * peak_flops_per_gpu)",
      "test": "assert mfu(3000, 7e9, 1, 312e12) == 0.404, f'Got {mfu(3000, 7e9, 1, 312e12)}'\nassert mfu(1.1e6, 7e9, 512, 312e12) == 0.289, f'Got {mfu(1.1e6, 7e9, 512, 312e12)}'\nassert mfu(0, 7e9, 8, 312e12) == 0.0, 'Nothing processed'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Throughput Report",
      "desc": "Write `throughput_report(step_seconds, tokens_per_step)` for a list of step times. Return {'tokens_per_sec': total tokens / total seconds rounded to 0 decimals as an int, 'median_step': the median step time (statistics.median) rounded to 3 decimals, 'slowest_step': the max rounded to 3 decimals, 'slow_steps': number of steps taking more than 1.5 × the median}.",
      "starter": "import statistics\n\n\ndef throughput_report(step_seconds, tokens_per_step):\n    pass",
      "hint": "median = statistics.median(step_seconds); slow = sum(t > 1.5 * median for t in step_seconds)",
      "test": "r = throughput_report([1.0, 1.1, 0.9, 1.0, 3.0], 1_000_000)\nassert r == {'tokens_per_sec': 714286, 'median_step': 1.0, 'slowest_step': 3.0, 'slow_steps': 1}, f'Got {r}'\nr = throughput_report([0.5, 0.5], 262144)\nassert r == {'tokens_per_sec': 524288, 'median_step': 0.5, 'slowest_step': 0.5, 'slow_steps': 0}, f'Got {r}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Biggest Phase in a Profile",
      "desc": "Write `top_phase(profile)` where profile maps phase names to milliseconds. Return (name, share_pct) for the largest phase (ties: alphabetically first name), with share_pct = its time / total × 100 rounded to 1 decimal. Return (None, 0.0) for an empty profile.",
      "starter": "def top_phase(profile):\n    pass",
      "hint": "name = min(profile, key=lambda k: (-profile[k], k))",
      "test": "p = {'data_load': 30, 'forward': 120, 'backward': 240, 'allreduce': 90, 'optimizer': 20}\nassert top_phase(p) == ('backward', 48.0), f'Got {top_phase(p)}'\nassert top_phase({'b': 5, 'a': 5}) == ('a', 50.0), 'Tie: alphabetical'\nassert top_phase({}) == (None, 0.0), 'Empty'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Bottleneck Classifier",
      "desc": "Write `classify_step(data_wait_ms, compute_ms, comm_ms)` returning 'INPUT_BOUND' if data_wait is more than 20% of the total, otherwise 'COMM_BOUND' if exposed communication is larger than compute, otherwise 'COMPUTE_BOUND'. Also write `advice(kind)` returning a fix: INPUT_BOUND → 'add data loader workers and prefetch', COMM_BOUND → 'overlap communication or increase batch per GPU', COMPUTE_BOUND → 'use mixed precision and fused kernels'.",
      "starter": "def classify_step(data_wait_ms, compute_ms, comm_ms):\n    pass\n\n\ndef advice(kind):\n    pass",
      "hint": "total = data_wait_ms + compute_ms + comm_ms; check the input share first.",
      "test": "assert classify_step(50, 100, 30) == 'INPUT_BOUND', 'Waiting for data (27.8%)'\nassert classify_step(10, 100, 150) == 'COMM_BOUND', 'Network is slower than compute'\nassert classify_step(5, 200, 40) == 'COMPUTE_BOUND', 'GPU busy computing'\nassert classify_step(20, 50, 30) == 'COMPUTE_BOUND', 'Exactly 20% is not input-bound; comm < compute'\nassert advice('COMM_BOUND') == 'overlap communication or increase batch per GPU', 'Advice text'\nassert advice('INPUT_BOUND') == 'add data loader workers and prefetch', 'Advice text'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Top-k Expert Routing",
      "desc": "Write `route(gate_scores, k)` where gate_scores is a list with one list of expert scores per token. For each token return the indices of its k highest-scoring experts, highest first (ties: lower expert index first).",
      "starter": "def route(gate_scores, k):\n    pass",
      "hint": "sorted(range(len(scores)), key=lambda e: (-scores[e], e))[:k]",
      "test": "scores = [[0.1, 0.7, 0.2, 0.0], [0.4, 0.1, 0.4, 0.1], [0.0, 0.0, 0.1, 0.9]]\nassert route(scores, 1) == [[1], [0], [3]], f'Got {route(scores, 1)}'\nassert route(scores, 2) == [[1, 2], [0, 2], [3, 2]], f'Got {route(scores, 2)}'\nassert route([], 2) == [], 'No tokens'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Expert Capacity",
      "desc": "Each expert can take at most `capacity` tokens per batch. Write `apply_capacity(assignments, experts, capacity)` where assignments is a list with one expert index per token (in token order). Tokens are accepted in order until their expert is full; later tokens for a full expert are dropped. Return {'load': list of accepted counts per expert, 'dropped': list of dropped token indices, 'imbalance': max load ÷ mean load rounded to 2 decimals (0.0 if nothing accepted)}.",
      "starter": "def apply_capacity(assignments, experts, capacity):\n    pass",
      "hint": "Keep load = [0] * experts; if load[e] < capacity accept, otherwise drop the token.",
      "test": "r = apply_capacity([0, 0, 1, 0, 2, 0, 1], 4, 2)\nassert r == {'load': [2, 2, 1, 0], 'dropped': [3, 5], 'imbalance': 1.6}, f'Got {r}'\nr = apply_capacity([0, 1, 2, 3], 4, 1)\nassert r == {'load': [1, 1, 1, 1], 'dropped': [], 'imbalance': 1.0}, 'Perfect balance'\nassert apply_capacity([], 2, 3) == {'load': [0, 0], 'dropped': [], 'imbalance': 0.0}, 'Empty batch'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "LoRA Parameter Count",
      "desc": "LoRA replaces training a d_in × d_out weight with two small matrices A (d_in × r) and B (r × d_out). Write `lora_params(layers, d_in, d_out, rank)` returning {'full': layers × d_in × d_out, 'lora': layers × rank × (d_in + d_out), 'trainable_pct': lora / full × 100 rounded to 3 decimals}.",
      "starter": "def lora_params(layers, d_in, d_out, rank):\n    pass",
      "hint": "lora = layers * rank * (d_in + d_out)",
      "test": "r = lora_params(32, 4096, 4096, 8)\nassert r == {'full': 536870912, 'lora': 2097152, 'trainable_pct': 0.391}, f'Got {r}'\nassert lora_params(1, 100, 100, 50)['trainable_pct'] == 100.0, 'Rank too high saves nothing'\nassert lora_params(2, 1024, 4096, 16)['lora'] == 163840, 'Rectangular weights'\nprint('All checks passed.')"
    },
    "a": {
      "title": "LoRA Forward Pass",
      "desc": "Write `lora_forward(x, W, A, B, alpha, rank)` for a vector x (list), frozen weight W (list of rows, len(x) × d_out), A (len(x) × rank) and B (rank × d_out). Return y = x·W + (alpha / rank) × (x·A)·B as a list rounded to 4 decimals. Also write `merge(W, A, B, alpha, rank)` returning the merged weight W + (alpha / rank) × A·B (rounded to 4 decimals), which gives the same outputs with no extra cost.",
      "starter": "def matvec(x, M):\n    return [sum(x[i] * M[i][j] for i in range(len(x))) for j in range(len(M[0]))]\n\n\ndef lora_forward(x, W, A, B, alpha, rank):\n    pass\n\n\ndef merge(W, A, B, alpha, rank):\n    pass",
      "hint": "base = matvec(x, W); low = matvec(matvec(x, A), B); add them with the alpha / rank scale.",
      "test": "x = [1.0, 2.0]\nW = [[1.0, 0.0], [0.0, 1.0]]\nA = [[1.0], [0.0]]\nB = [[0.5, -0.5]]\nassert lora_forward(x, W, A, B, 2, 1) == [2.0, 1.0], f'Got {lora_forward(x, W, A, B, 2, 1)}'\nassert lora_forward(x, W, A, [[0.0, 0.0]], 2, 1) == [1.0, 2.0], 'B starts at zero: no change'\nM = merge(W, A, B, 2, 1)\nassert M == [[2.0, -1.0], [0.0, 1.0]], f'Got {M}'\nassert [round(v, 4) for v in matvec(x, M)] == lora_forward(x, W, A, B, 2, 1), 'Merged weights give the same output'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "INT8 Quantize and Dequantize",
      "desc": "Symmetric INT8 quantization uses scale = max(|v|) / 127 and q = round(v / scale), clamped to -127..127. Write `quantize(values)` returning (q_list, scale) with scale rounded to 6 decimals (use the unrounded scale for q; if all values are 0, the scale is 1.0), and `dequantize(q, scale)` returning [qi × scale] rounded to 4 decimals.",
      "starter": "def quantize(values):\n    pass\n\n\ndef dequantize(q, scale):\n    pass",
      "hint": "scale = max(abs(v) for v in values) / 127; q = [max(-127, min(127, round(v / scale))) for v in values]",
      "test": "q, s = quantize([0.5, -1.27, 0.0, 1.0])\nassert q == [50, -127, 0, 100] and s == 0.01, f'Got {(q, s)}'\nassert dequantize(q, s) == [0.5, -1.27, 0.0, 1.0], 'Round trip'\nassert quantize([0.0, 0.0]) == ([0, 0], 1.0), 'All zeros'\nq, s = quantize([3.0, 1.0])\nassert q == [127, 42], f'Got {q}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Quantized Model Size and Error",
      "desc": "Write `model_size_gb(params, bits)` returning params × bits / 8 / 1e9 rounded to 1 decimal, and `max_error(values)` returning the largest absolute difference between each value and its INT8 round trip (scale = max|v| / 127, q = round(v / scale), back = q × scale), rounded to 4 decimals.",
      "starter": "def model_size_gb(params, bits):\n    pass\n\n\ndef max_error(values):\n    pass",
      "hint": "The error of symmetric INT8 is at most half a step: scale / 2.",
      "test": "assert model_size_gb(70e9, 16) == 140.0, '70B in 16-bit'\nassert model_size_gb(70e9, 4) == 35.0, '70B in 4-bit'\nassert model_size_gb(7e9, 8) == 7.0, '7B in 8-bit'\nassert max_error([1.27, -0.5, 0.004]) == 0.004, f'Got {max_error([1.27, -0.5, 0.004])}'\nassert max_error([2.54, 0.03]) == 0.01, f'Got {max_error([2.54, 0.03])}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Softmax with Temperature",
      "desc": "Write `softmax_t(logits, temperature=1.0)` returning softmax(logits / temperature) rounded to 4 decimals. Subtract the largest scaled logit before exponentiating for numerical stability. Raise ValueError if temperature <= 0.",
      "starter": "import math\n\n\ndef softmax_t(logits, temperature=1.0):\n    pass",
      "hint": "z = [l / temperature for l in logits]; m = max(z); e = [math.exp(v - m) for v in z]",
      "test": "assert softmax_t([2.0, 1.0, 0.0]) == [0.6652, 0.2447, 0.09], f'Got {softmax_t([2.0, 1.0, 0.0])}'\nassert softmax_t([2.0, 1.0, 0.0], 4.0) == [0.4192, 0.3265, 0.2543], 'Higher temperature is softer'\nassert softmax_t([1000.0, 1000.0]) == [0.5, 0.5], 'Stable with big logits'\ntry:\n    softmax_t([1.0], 0)\n    raise AssertionError('temperature 0 must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Distillation Loss",
      "desc": "Write `distill_loss(student_logits, teacher_logits, temperature)` returning T² × KL(p_teacher ‖ p_student), where both distributions are softmax(logits / T) (unrounded) and KL(p ‖ q) = Σ p·log(p / q). Round to 4 decimals.",
      "starter": "import math\n\n\ndef distill_loss(student_logits, teacher_logits, temperature):\n    pass",
      "hint": "Write a small softmax helper without rounding, then sum p * math.log(p / q).",
      "test": "assert distill_loss([1.0, 2.0], [1.0, 2.0], 2.0) == 0.0, 'Identical logits'\nassert distill_loss([0.0, 0.0, 0.0], [3.0, 1.0, 0.0], 1.0) == 0.5743, f'Got {distill_loss([0.0, 0.0, 0.0], [3.0, 1.0, 0.0], 1.0)}'\nassert distill_loss([0.0, 0.0, 0.0], [3.0, 1.0, 0.0], 2.0) == 0.7706, f'Got {distill_loss([0.0, 0.0, 0.0], [3.0, 1.0, 0.0], 2.0)}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Job Placement",
      "desc": "Write `place_job(gpus_needed, free_gpus)` where free_gpus lists the free GPUs on each node. Use as few nodes as possible: first try a single node with enough free GPUs (choose the one with the fewest free GPUs that still fits, ties by lower node index). Otherwise take nodes from most free to least (ties by lower index) until the job fits. Return {node_index: gpus_used} or None if the cluster does not have enough free GPUs.",
      "starter": "def place_job(gpus_needed, free_gpus):\n    pass",
      "hint": "Best fit for one node; otherwise greedy by most free.",
      "test": "assert place_job(4, [8, 4, 6]) == {1: 4}, 'Best fit on one node'\nassert place_job(6, [8, 4, 6]) == {2: 6}, f'Got {place_job(6, [8, 4, 6])}'\nassert place_job(12, [8, 4, 6]) == {0: 8, 2: 4}, f'Two nodes: got {place_job(12, [8, 4, 6])}'\nassert place_job(20, [8, 4, 6]) is None, 'Not enough GPUs'\nassert place_job(2, [0, 2, 2]) == {1: 2}, 'Tie: lower index'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Training Run Cost",
      "desc": "Write `run_cost(gpu_hours, on_demand_price, spot_discount_pct, spot_share_pct, failure_overhead_pct)` returning the total cost rounded to 2 decimals: the effective hours are gpu_hours × (1 + failure_overhead_pct / 100); spot_share_pct of those hours are billed at the on-demand price minus spot_discount_pct percent, the rest at the on-demand price.",
      "starter": "def run_cost(gpu_hours, on_demand_price, spot_discount_pct, spot_share_pct, failure_overhead_pct):\n    pass",
      "hint": "hours = gpu_hours * (1 + overhead / 100); spot = hours * share / 100; cost = spot * price * (1 - discount / 100) + (hours - spot) * price",
      "test": "assert run_cost(10000, 2.0, 60, 0, 0) == 20000.0, 'All on-demand'\nassert run_cost(10000, 2.0, 60, 100, 0) == 8000.0, 'All spot'\nassert run_cost(10000, 2.0, 60, 50, 10) == 15400.0, f'Mixed with restarts: got {run_cost(10000, 2.0, 60, 50, 10)}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Parallelism Planner",
      "desc": "Write `plan_training(params, gpus, gpu_gb, activation_gb)` that chooses the smallest ZeRO stage (0 to 3) whose model states per GPU (16Ψ, 4Ψ + 12Ψ/N, 2Ψ + 14Ψ/N, 16Ψ/N bytes) plus activation_gb fit in gpu_gb. Return {'stage': s, 'per_gpu_gb': states + activations rounded to 1 decimal}, or {'stage': None, 'per_gpu_gb': the stage-3 figure} if nothing fits (then the model needs tensor or pipeline parallelism too).",
      "starter": "def plan_training(params, gpus, gpu_gb, activation_gb):\n    pass",
      "hint": "Loop over the four per-parameter byte counts; stop at the first that fits.",
      "test": "assert plan_training(1e9, 8, 80, 20) == {'stage': 0, 'per_gpu_gb': 36.0}, 'Small model: plain data parallel'\nassert plan_training(7e9, 64, 80, 20) == {'stage': 1, 'per_gpu_gb': 49.3}, f'Got {plan_training(7e9, 64, 80, 20)}'\nassert plan_training(30e9, 64, 80, 20) == {'stage': 3, 'per_gpu_gb': 27.5}, f'Got {plan_training(30e9, 64, 80, 20)}'\nassert plan_training(400e9, 64, 80, 20) == {'stage': None, 'per_gpu_gb': 120.0}, 'Too large for ZeRO alone'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Training Run Report",
      "desc": "Write `run_report(log)` where log is a list of dicts {'step': int, 'loss': float, 'tokens': int, 'seconds': float}. Return {'steps': number of entries, 'final_loss': loss of the last entry, 'best_loss': the smallest non-NaN loss, 'nan_steps': list of steps whose loss is NaN, 'tokens_per_sec': total tokens / total seconds rounded to 0 decimals as an int}. Round losses to 4 decimals. For an empty log return {'steps': 0, 'final_loss': None, 'best_loss': None, 'nan_steps': [], 'tokens_per_sec': 0}.",
      "starter": "import math\n\n\ndef run_report(log):\n    pass",
      "hint": "good = [e['loss'] for e in log if not math.isnan(e['loss'])]",
      "test": "log = [{'step': 1, 'loss': 4.2, 'tokens': 4000, 'seconds': 2.0},\n       {'step': 2, 'loss': float('nan'), 'tokens': 4000, 'seconds': 2.0},\n       {'step': 3, 'loss': 3.61234, 'tokens': 4000, 'seconds': 1.0},\n       {'step': 4, 'loss': 3.7, 'tokens': 4000, 'seconds': 1.0}]\nr = run_report(log)\nassert r == {'steps': 4, 'final_loss': 3.7, 'best_loss': 3.6123, 'nan_steps': [2], 'tokens_per_sec': 2667}, f'Got {r}'\nassert run_report([]) == {'steps': 0, 'final_loss': None, 'best_loss': None, 'nan_steps': [], 'tokens_per_sec': 0}, 'Empty log'\nprint('All checks passed.')"
    }
  }
];

export const TRAIN_PYTHON_30_DAYS_CONFIGS: DayConfig[] = TRAIN_DAYS.map((cfg, i) => {
  const day = DAYS[i];
  return {
    ...cfg,
    eTitle: day.e.title,
    eDesc: day.e.desc,
    eStarter: day.e.starter,
    eHint: day.e.hint,
    eTest: day.e.test,
    aTitle: day.a.title,
    aDesc: day.a.desc,
    aStarter: day.a.starter,
    aHint: day.a.hint,
    aTest: day.a.test,
  };
});

export const TRAIN_PYTHON_30_DAYS_QUESTS: CourseQuest[] = TRAIN_PYTHON_30_DAYS_CONFIGS.flatMap((cfg, idx) =>
  buildEnrichedDayQuests('train-py', idx + 1, cfg)
);
