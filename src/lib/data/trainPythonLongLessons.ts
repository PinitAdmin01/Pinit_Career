/**
 * Distributed Model Training in Python: full-length lessons (about 20-30 minutes each), one per course day, written in plain
 * words for the Python track. Every code sample runs in the browser (Pyodide) and prints exactly
 * its `output`; tests/python_track_long_lessons.test.ts checks this and each lesson's length.
 * Days without a long lesson here still use the shorter lesson plan.
 */
import type { LongLesson } from './longLessons';

export const TRAIN_PYTHON_LONG_LESSONS: LongLesson[] = [
  {
    "day": 1,
    "title": "Why Models Need Many GPUs: Memory and Compute Arithmetic",
    "goal": "You can work out how much memory a model needs in different number formats, estimate the compute needed to train it, and turn that compute into GPU-days, which explains why large models are trained on many GPUs at once.",
    "minutes": 30,
    "recap": "This course begins where single-machine machine learning ends. Earlier months trained models that fit comfortably on one computer; now we ask what happens when a model has billions of parameters and must learn from trillions of words.",
    "parts": [
      {
        "title": "Parameters take up memory",
        "say": [
          "A neural network is mostly a very long list of numbers called parameters, or weights.",
          "A 7-billion-parameter model, often written 7B, holds seven thousand million numbers.",
          "Each number needs memory: 4 bytes in 32-bit floating point (FP32), 2 bytes in 16-bit formats (FP16 or BF16), 1 byte in INT8 and half a byte in 4-bit formats.",
          "So the weights of a 7B model take 28 GB in FP32 and 14 GB in FP16, before we even start training.",
          "Here a gigabyte means 10 to the power 9 bytes, which is how hardware vendors usually count.",
          "The example prints the weight memory of three model sizes in several formats.",
          "Practice 1 today is model_memory_gb(params, precision), which does exactly this calculation and rejects unknown formats.",
          "Knowing these numbers by heart lets you judge instantly whether a model can even be loaded on a given GPU.",
          "A typical data-centre GPU today has 40 to 80 GB of memory, and some newer ones have more.",
          "Memory for weights is only the beginning: training needs several times more, as Day 8 will show."
        ],
        "example": "Books on a shelf: a thicker binding (more bytes per number) means fewer books fit on the same shelf.",
        "code": "BYTES = {\"fp32\": 4, \"fp16\": 2, \"int8\": 1, \"int4\": 0.5}\nfor name, params in [(\"1.3B\", 1.3e9), (\"7B\", 7e9), (\"70B\", 70e9)]:\n    row = \"  \".join(f\"{p}: {params * b / 1e9:6.1f} GB\" for p, b in BYTES.items())\n    print(f\"{name:5} {row}\")",
        "output": "1.3B  fp32:    5.2 GB  fp16:    2.6 GB  int8:    1.3 GB  int4:    0.7 GB\n7B    fp32:   28.0 GB  fp16:   14.0 GB  int8:    7.0 GB  int4:    3.5 GB\n70B   fp32:  280.0 GB  fp16:  140.0 GB  int8:   70.0 GB  int4:   35.0 GB",
        "codeNotes": [
          {
            "line": 3,
            "note": "Parameters times bytes per parameter, in gigabytes."
          }
        ],
        "tryIt": "Which of these models could you load for inference on a single 24 GB gaming GPU, and in which format?",
        "check": {
          "question": "How much memory do the FP16 weights of a 7B model need?",
          "options": [
            "7 GB",
            "14 GB",
            "28 GB"
          ],
          "answer": 1,
          "why": "7 billion × 2 bytes = 14 GB."
        }
      },
      {
        "title": "How much compute training takes",
        "say": [
          "Training cost is measured in floating-point operations, or FLOPs: multiplications and additions.",
          "A very useful rule of thumb says that training a dense transformer costs about 6 × parameters × tokens FLOPs.",
          "The factor 6 comes from about 2 FLOPs per parameter per token in the forward pass and about 4 in the backward pass.",
          "A token is a piece of text, roughly three quarters of an English word.",
          "Training a 7B model on one trillion tokens therefore costs about 6 × 7e9 × 1e12 = 4.2e22 FLOPs.",
          "That number is so large that we need to compare it with how fast hardware can go.",
          "The example computes the training FLOPs for a few well-known sizes.",
          "This rule ignores some details, such as attention costs on very long sequences, but it is accurate enough for planning.",
          "Researchers and companies use exactly this estimate when they budget a training run.",
          "Scientific notation, like 4.2e22, is the natural way to write these numbers in Python."
        ],
        "example": "Estimating a road trip: distance times fuel per kilometre gives the fuel you need, before worrying about traffic.",
        "code": "runs = [(\"125M on 300B tokens\", 125e6, 300e9), (\"7B on 1T tokens\", 7e9, 1e12), (\"70B on 2T tokens\", 70e9, 2e12)]\nfor name, params, tokens in runs:\n    flops = 6 * params * tokens\n    print(f\"{name:20} {flops:.2e} FLOPs\")",
        "output": "125M on 300B tokens  2.25e+20 FLOPs\n7B on 1T tokens      4.20e+22 FLOPs\n70B on 2T tokens     8.40e+23 FLOPs",
        "codeNotes": [
          {
            "line": 3,
            "note": "The 6 × N × D rule."
          }
        ],
        "tryIt": "How many times more compute does the 70B run need than the 7B run? Work it out before printing.",
        "check": {
          "question": "What does the rule 6 × parameters × tokens estimate?",
          "options": [
            "Memory in bytes",
            "Total training compute in FLOPs",
            "The number of GPUs"
          ],
          "answer": 1,
          "why": "It estimates FLOPs for the forward and backward passes."
        }
      },
      {
        "title": "From FLOPs to days",
        "say": [
          "A modern data-centre GPU can do roughly 300 to 1000 trillion 16-bit FLOPs per second at its peak.",
          "Real training never reaches the peak: a well-tuned run achieves perhaps 35 to 55 percent of it.",
          "That achieved fraction is called model FLOPs utilisation, or MFU, and Day 23 covers it in detail.",
          "Wall-clock seconds = total FLOPs ÷ (number of GPUs × peak FLOPs per GPU × MFU).",
          "Practice 2 is training_days(params, tokens, gpus, peak_flops, mfu), which divides by 86400 to give days.",
          "The example shows that one GPU would need more than ten years for a 7B model, while 512 GPUs finish in about a week.",
          "This is the core reason for distributed training: it turns impossible timelines into practical ones.",
          "Doubling the GPUs halves the time only if communication and other overheads stay small, which later lessons address.",
          "Always sanity-check inputs: zero GPUs or a utilisation above 1 means something is wrong.",
          "Planning numbers like these are what engineers present when asking for a training budget."
        ],
        "example": "One painter would take years to paint a skyscraper; five hundred painters working together finish in days, if they do not get in each other's way.",
        "code": "flops = 6 * 7e9 * 1e12\npeak, mfu = 312e12, 0.4\nfor gpus in [1, 64, 512, 2048]:\n    days = flops / (gpus * peak * mfu) / 86400\n    print(f\"{gpus:5} GPUs: {days:9.1f} days\")",
        "output": "    1 GPUs:    3895.1 days\n   64 GPUs:      60.9 days\n  512 GPUs:       7.6 days\n 2048 GPUs:       1.9 days",
        "codeNotes": [
          {
            "line": 4,
            "note": "Seconds of compute, converted to days."
          }
        ],
        "tryIt": "What happens to the time if MFU drops from 40% to 20% because of slow communication?",
        "check": {
          "question": "What is MFU?",
          "options": [
            "Memory for users",
            "The fraction of the GPU's peak FLOPs actually achieved",
            "A file format"
          ],
          "answer": 1,
          "why": "Model FLOPs utilisation measures real efficiency."
        }
      },
      {
        "title": "Why one GPU is not enough",
        "say": [
          "There are two separate walls: memory and time.",
          "The memory wall means the model and its training data structures do not fit on one GPU.",
          "The time wall means that even if the model fits, one GPU would take far too long.",
          "Data parallelism (Day 4) attacks the time wall by processing different data on each GPU.",
          "Sharding techniques like ZeRO and FSDP (Days 9 and 10) and model parallelism (Days 11 and 12) attack the memory wall.",
          "Large runs combine several of these, often called 3D parallelism: data, tensor and pipeline.",
          "The example classifies a few scenarios by which wall they hit.",
          "Knowing which wall you face tells you which technique to reach for first.",
          "Small models that fit comfortably usually only need plain data parallelism.",
          "Very large models need memory sharding even before speed becomes the concern."
        ],
        "example": "Moving house: a piano that does not fit through the door is a different problem from having too many boxes to carry alone.",
        "code": "gpu_gb = 80\ncases = [(\"350M model, 20 GPU-days of work\", 0.35e9, 20), (\"7B model, 5000 GPU-days\", 7e9, 5000),\n         (\"70B model, 50000 GPU-days\", 70e9, 50000)]\nfor name, params, gpu_days in cases:\n    needs_gb = 16 * params / 1e9\n    walls = [w for w, hit in [(\"memory\", needs_gb > gpu_gb), (\"time\", gpu_days > 30)] if hit]\n    print(f\"{name:32} training memory {needs_gb:6.1f} GB -> walls: {walls or ['none']}\")",
        "output": "350M model, 20 GPU-days of work  training memory    5.6 GB -> walls: ['none']\n7B model, 5000 GPU-days          training memory  112.0 GB -> walls: ['memory', 'time']\n70B model, 50000 GPU-days        training memory 1120.0 GB -> walls: ['memory', 'time']",
        "codeNotes": [
          {
            "line": 5,
            "note": "About 16 bytes per parameter during training (Day 8)."
          },
          {
            "line": 6,
            "note": "Which walls this run hits."
          }
        ],
        "tryIt": "Which technique would you try first for the 7B case, and why?",
        "check": {
          "question": "Which problem does data parallelism mainly solve?",
          "options": [
            "The model does not fit in memory",
            "Training takes too long",
            "The data is private"
          ],
          "answer": 1,
          "why": "It speeds up training by splitting the data."
        }
      },
      {
        "title": "Validating inputs like a professional",
        "say": [
          "Planning tools are only useful if they refuse nonsense.",
          "Unknown precision names, zero or negative parameter counts and impossible utilisation values should raise a clear error.",
          "In Python we raise ValueError with a helpful message, so the caller learns what went wrong immediately.",
          "Silent mistakes in planning maths can cost real money when GPUs are rented by the hour.",
          "Dictionaries are a clean way to store lookup tables such as bytes per parameter.",
          "Checking membership with the in operator before using the table avoids confusing KeyError messages.",
          "The example validates inputs and reports errors politely.",
          "Every practice task in this course expects you to handle bad input as the description says.",
          "Good error messages also help teammates who use your tools later.",
          "Tests that feed bad inputs deliberately, as today's checks do, protect against regressions."
        ],
        "example": "A pharmacist who refuses a prescription for an impossible dose is being helpful, not difficult.",
        "code": "BYTES = {\"fp32\": 4, \"fp16\": 2, \"bf16\": 2, \"int8\": 1, \"int4\": 0.5}\ndef weight_gb(params, precision):\n    if precision not in BYTES:\n        raise ValueError(f\"unknown precision {precision!r}\")\n    if params <= 0:\n        raise ValueError(\"params must be positive\")\n    return round(params * BYTES[precision] / 1e9, 2)\n\nfor args in [(7e9, \"bf16\"), (7e9, \"fp64\"), (0, \"fp16\")]:\n    try:\n        print(args, \"->\", weight_gb(*args), \"GB\")\n    except ValueError as err:\n        print(args, \"-> error:\", err)",
        "output": "(7000000000.0, 'bf16') -> 14.0 GB\n(7000000000.0, 'fp64') -> error: unknown precision 'fp64'\n(0, 'fp16') -> error: params must be positive",
        "codeNotes": [
          {
            "line": 3,
            "note": "Check the lookup key before using it."
          },
          {
            "line": 12,
            "note": "Catch the error and report it."
          }
        ],
        "tryIt": "Add a check that params is a number, not a string. Which exception type fits best?",
        "check": {
          "question": "Why raise ValueError for an unknown precision instead of returning 0?",
          "options": [
            "It is faster",
            "A clear error prevents silently wrong plans",
            "Python requires it"
          ],
          "answer": 1,
          "why": "Silent wrong answers are more dangerous than errors."
        }
      },
      {
        "title": "Practice time: memory and time",
        "say": [
          "Practice 1: model_memory_gb(params, precision). Look up bytes per parameter for fp32, fp16, bf16, int8 and int4, validate the inputs, and return params × bytes ÷ 1e9 rounded to 2 decimals.",
          "The checks include a 7B model in FP16 and FP32, a 70B model in INT4, a small model in INT8 and three bad inputs.",
          "Practice 2: training_days(params, tokens, gpus, peak_flops, mfu). Compute 6 × params × tokens, divide by gpus × peak_flops × mfu, convert seconds to days and round to 1 decimal.",
          "Raise ValueError if gpus is below 1 or mfu is not greater than 0 and at most 1.",
          "After passing, try your own numbers: how many GPUs would you need to train a 13B model on 2 trillion tokens in 30 days?",
          "The example turns a deadline into a GPU count.",
          "Tomorrow we go back to basics and train a tiny model by hand, so that every later technique has a clear foundation.",
          "Keep these two calculations in mind: they appear again in the capstone on Day 30.",
          "Being able to estimate before building is one of the most valued skills in large-scale machine learning engineering.",
          "Write down your estimates and compare them with real published training runs to calibrate your intuition."
        ],
        "example": "A travel planner who works out the budget and the schedule before booking any tickets.",
        "code": "import math\n\nparams, tokens, peak, mfu, deadline_days = 13e9, 2e12, 312e12, 0.4, 30\nflops = 6 * params * tokens\ngpus = math.ceil(flops / (peak * mfu * deadline_days * 86400))\nprint(f\"compute {flops:.2e} FLOPs -> at least {gpus} GPUs to finish in {deadline_days} days\")",
        "output": "compute 1.56e+23 FLOPs -> at least 483 GPUs to finish in 30 days",
        "codeNotes": [
          {
            "line": 5,
            "note": "Round up: you cannot rent part of a GPU."
          }
        ],
        "tryIt": "How does the GPU count change if you allow 60 days instead?",
        "check": {
          "question": "What should training_days do if mfu is 0?",
          "options": [
            "Return 0",
            "Raise ValueError",
            "Return infinity"
          ],
          "answer": 1,
          "why": "Zero utilisation is not a valid input."
        }
      }
    ],
    "summary": [
      "Weight memory = parameters × bytes per parameter (4, 2, 1 or 0.5).",
      "Training compute is about 6 × parameters × tokens FLOPs.",
      "Days = FLOPs ÷ (GPUs × peak FLOPs × MFU) ÷ 86400.",
      "Large models hit a memory wall, a time wall, or both.",
      "Validate planning inputs and raise clear errors."
    ],
    "projectStep": {
      "title": "Training planner, part 1",
      "steps": [
        "Implement model_memory_gb and training_days.",
        "Estimate memory and time for three model sizes you are curious about.",
        "Keep the file: later days add communication, sharding and cost."
      ]
    }
  },
  {
    "day": 2,
    "title": "Training From Scratch: Gradient Descent on a Tiny Model",
    "goal": "You can compute a mean squared error loss and its gradients by hand, run gradient descent to fit a line, and explain how the learning rate and number of steps affect training.",
    "minutes": 30,
    "recap": "Yesterday showed why big models need many GPUs. Before splitting work across machines, we need a crystal-clear picture of the work itself: the training loop.",
    "parts": [
      {
        "title": "The training loop",
        "say": [
          "Every neural network, from a tiny line fit to a giant language model, is trained with the same loop.",
          "Step one: run the model on some data to get predictions, called the forward pass.",
          "Step two: measure how wrong the predictions are with a loss function.",
          "Step three: compute the gradient, which says how the loss changes when each parameter changes, in the backward pass.",
          "Step four: nudge every parameter a little against its gradient, which is the optimizer step.",
          "Repeat millions of times and the loss falls.",
          "Distributed training changes where each of these steps runs, never what they compute.",
          "The example prints the loop as a checklist.",
          "Keeping this loop in mind makes later topics much easier: data parallelism splits step one, sharding splits the parameters in step four, and so on.",
          "Today we implement all four steps for the smallest possible model."
        ],
        "example": "Learning to throw darts: throw, see how far off you were, work out which way to adjust, adjust a little, and throw again.",
        "code": "steps = [\"forward: predictions from current weights\", \"loss: how wrong the predictions are\",\n         \"backward: gradient of the loss for every weight\", \"update: weight -= learning_rate * gradient\"]\nfor i, s in enumerate(steps, 1):\n    print(f\"{i}. {s}\")",
        "output": "1. forward: predictions from current weights\n2. loss: how wrong the predictions are\n3. backward: gradient of the loss for every weight\n4. update: weight -= learning_rate * gradient",
        "codeNotes": [
          {
            "line": 2,
            "note": "The update rule of plain gradient descent."
          }
        ],
        "tryIt": "Which of the four steps would you expect to be the most expensive for a large model?",
        "check": {
          "question": "What does the backward pass compute?",
          "options": [
            "Predictions",
            "Gradients of the loss with respect to the weights",
            "The learning rate"
          ],
          "answer": 1,
          "why": "Backward computes gradients."
        }
      },
      {
        "title": "A tiny model and its loss",
        "say": [
          "Our model has two parameters: a weight w and a bias b. It predicts y = w·x + b.",
          "The mean squared error (MSE) loss averages the squared differences between predictions and true values.",
          "Squaring makes every error positive and punishes big mistakes much more than small ones.",
          "If the predictions are perfect, the loss is exactly zero.",
          "The example evaluates the loss for a few guesses of w and b on data that really follows y = 2x + 1.",
          "You can see the loss is smallest for the right answer and grows as the guess gets worse.",
          "Large language models use a different loss, cross-entropy, but the idea of one number measuring wrongness is the same.",
          "Loss curves, which plot this number over training steps, are the first thing engineers look at on any training run.",
          "A loss that stops falling, jumps up or becomes NaN is a warning sign (Day 16).",
          "Keeping the loss simple today lets us check every number by hand."
        ],
        "example": "A golf score: the lower the better, and zero would mean a perfect round.",
        "code": "xs, ys = [1, 2, 3], [3, 5, 7]\ndef mse(w, b):\n    return sum((w * x + b - y) ** 2 for x, y in zip(xs, ys)) / len(xs)\n\nfor w, b in [(2, 1), (2, 0), (1, 1), (0, 0)]:\n    print(f\"w={w} b={b} loss={mse(w, b):.4f}\")",
        "output": "w=2 b=1 loss=0.0000\nw=2 b=0 loss=1.0000\nw=1 b=1 loss=4.6667\nw=0 b=0 loss=27.6667",
        "codeNotes": [
          {
            "line": 3,
            "note": "Average of squared errors."
          }
        ],
        "tryIt": "Try w = 2.1 and b = 1. Is the loss close to zero? Why?",
        "check": {
          "question": "What is the MSE when every prediction is exactly right?",
          "options": [
            "1",
            "0",
            "It depends on the data size"
          ],
          "answer": 1,
          "why": "No errors, no loss."
        }
      },
      {
        "title": "Gradients by hand",
        "say": [
          "The gradient tells us the direction in which the loss increases fastest.",
          "For MSE with y = w·x + b, the error on one point is e = w·x + b − y.",
          "The gradient for w is the mean of 2·e·x, and the gradient for b is the mean of 2·e.",
          "If the gradient for w is negative, increasing w lowers the loss, so we move w up.",
          "Practice 1 is mse_and_grads(w, b, xs, ys), which returns the loss and both gradients rounded to 4 decimals.",
          "The example computes these for the starting point w = 0, b = 0.",
          "Both gradients are negative there, telling us to increase w and b, which matches the true answer w = 2, b = 1.",
          "Frameworks such as PyTorch compute gradients automatically with autograd, but they compute exactly these numbers.",
          "In distributed training, these gradients are what GPUs exchange and average (Day 4).",
          "Checking gradients by hand on tiny examples is a real debugging technique called gradient checking."
        ],
        "example": "Standing on a hillside in fog: feeling which way the ground slopes tells you which way is downhill.",
        "code": "xs, ys = [1, 2, 3], [3, 5, 7]\nw, b = 0.0, 0.0\nerrors = [w * x + b - y for x, y in zip(xs, ys)]\ndw = sum(2 * e * x for e, x in zip(errors, xs)) / len(xs)\ndb = sum(2 * e for e in errors) / len(xs)\nloss = sum(e * e for e in errors) / len(xs)\nprint(f\"errors={errors}\")\nprint(f\"loss={loss:.4f} dw={dw:.4f} db={db:.4f}\")",
        "output": "errors=[-3.0, -5.0, -7.0]\nloss=27.6667 dw=-22.6667 db=-10.0000",
        "codeNotes": [
          {
            "line": 3,
            "note": "Error for each data point."
          },
          {
            "line": 4,
            "note": "Gradient for w: mean of 2·e·x."
          }
        ],
        "tryIt": "Compute the gradients at w = 2, b = 1. What do you expect, and why?",
        "check": {
          "question": "The gradient for w is negative. Which way should w move?",
          "options": [
            "Down",
            "Up",
            "It should not move"
          ],
          "answer": 1,
          "why": "Move against the gradient: up."
        }
      },
      {
        "title": "Gradient descent in action",
        "say": [
          "Gradient descent repeats: compute gradients, then update w -= lr·dw and b -= lr·db.",
          "The learning rate lr controls the size of each step.",
          "Practice 2 is fit_line(xs, ys, lr, steps), which starts at zero and runs this loop.",
          "The example trains on five points and prints the loss every few hundred steps.",
          "The loss drops quickly at first and then more slowly as the model approaches the answer.",
          "After enough steps, w and b reach 2 and 1, the line that generated the data.",
          "On real models, one step processes a batch of data and may take a second or more on many GPUs.",
          "The total number of steps and the batch size together decide how many tokens the model sees.",
          "Deterministic starting points, like zeros here, make results reproducible and easy to test.",
          "Real networks start from small random values instead, because all-zero weights would make every neuron identical."
        ],
        "example": "Walking downhill in small steps, checking the slope at every step, until the ground is flat.",
        "code": "xs, ys = [0, 1, 2, 3, 4], [1, 3, 5, 7, 9]\nw, b, lr = 0.0, 0.0, 0.05\nfor step in range(1, 1201):\n    errors = [w * x + b - y for x, y in zip(xs, ys)]\n    w -= lr * sum(2 * e * x for e, x in zip(errors, xs)) / len(xs)\n    b -= lr * sum(2 * e for e in errors) / len(xs)\n    if step in (1, 10, 100, 400, 1200):\n        loss = sum((w * x + b - y) ** 2 for x, y in zip(xs, ys)) / len(xs)\n        print(f\"step {step:4}: w={w:.3f} b={b:.3f} loss={loss:.6f}\")",
        "output": "step    1: w=1.400 b=0.500 loss=3.610000\nstep   10: w=2.069 b=0.804 loss=0.012912\nstep  100: w=2.005 b=0.987 loss=0.000055\nstep  400: w=2.000 b=1.000 loss=0.000000\nstep 1200: w=2.000 b=1.000 loss=0.000000",
        "codeNotes": [
          {
            "line": 5,
            "note": "Update w against its gradient."
          },
          {
            "line": 7,
            "note": "Report a few checkpoints only."
          }
        ],
        "tryIt": "Why does the loss fall fast at first and slowly later?",
        "check": {
          "question": "What does the learning rate control?",
          "options": [
            "The number of data points",
            "The size of each update step",
            "The loss function"
          ],
          "answer": 1,
          "why": "It scales the gradient step."
        }
      },
      {
        "title": "Choosing the learning rate",
        "say": [
          "A learning rate that is too small makes training painfully slow.",
          "A learning rate that is too large overshoots the minimum; the loss bounces around or explodes to infinity.",
          "The example runs 50 steps with three different learning rates on the same data.",
          "With lr = 0.001 progress is slow, with 0.05 it converges nicely, and with 0.3 it diverges.",
          "Large-scale training uses schedules that change the learning rate over time (Day 15), and adaptive optimizers like Adam (Day 14).",
          "When the batch size changes, the best learning rate usually changes too (Day 3).",
          "Learning rate is usually the first hyperparameter people tune, because it matters most.",
          "A diverging run in a big cluster wastes enormous amounts of money, so stability checks are essential (Day 16).",
          "Small experiments like this one are how practitioners build intuition safely and cheaply.",
          "Record every experiment's settings so results can be compared fairly."
        ],
        "example": "Adjusting a shower temperature: tiny turns take forever, huge turns swing between freezing and scalding.",
        "code": "xs, ys = [0, 1, 2, 3, 4], [1, 3, 5, 7, 9]\ndef train(lr, steps=50):\n    w = b = 0.0\n    for _ in range(steps):\n        e = [w * x + b - y for x, y in zip(xs, ys)]\n        w, b = w - lr * sum(2 * ei * x for ei, x in zip(e, xs)) / 5, b - lr * sum(2 * ei for ei in e) / 5\n    return sum((w * x + b - y) ** 2 for x, y in zip(xs, ys)) / 5\n\nfor lr in [0.001, 0.05, 0.3]:\n    loss = train(lr)\n    print(f\"lr={lr:<6} loss after 50 steps: {loss:.3e}\")",
        "output": "lr=0.001  loss after 50 steps: 8.576e+00\nlr=0.05   loss after 50 steps: 1.144e-03\nlr=0.3    loss after 50 steps: 3.407e+49",
        "codeNotes": [
          {
            "line": 6,
            "note": "Both parameters updated from the same errors."
          },
          {
            "line": 11,
            "note": "Scientific notation shows huge and tiny losses clearly."
          }
        ],
        "tryIt": "Find the largest learning rate that still converges for this data. How close is it to divergence?",
        "check": {
          "question": "What happens with a learning rate that is far too large?",
          "options": [
            "Training is slow but safe",
            "The loss overshoots and can explode",
            "Nothing changes"
          ],
          "answer": 1,
          "why": "Too-large steps diverge."
        }
      },
      {
        "title": "Practice time: gradients and fitting",
        "say": [
          "Practice 1: mse_and_grads(w, b, xs, ys). Compute the errors, then the loss, dw and db as means, and return all three rounded to 4 decimals.",
          "The checks include a perfect fit (all zeros), the starting point w = 0, b = 0 and a single-point example.",
          "Practice 2: fit_line(xs, ys, lr, steps). Start from w = b = 0.0 and apply the update rule steps times, then return (w, b) rounded to 3 decimals.",
          "The checks confirm one step moves to (1.4, 0.5), that 2000 steps learn y = 2x + 1, and that zero steps change nothing.",
          "Make sure both updates in a step use gradients computed from the same errors.",
          "After passing, try fitting noisy data and see where the line settles.",
          "The example shows the first three steps in detail so you can check your own code.",
          "Tomorrow splits the data into mini-batches, the first step toward sharing work across GPUs.",
          "Everything in this course builds on this loop, so it is worth running it by hand once.",
          "If your numbers disagree with the checks, print the errors list first: it usually reveals the bug."
        ],
        "example": "Practising scales on a piano: simple, but the foundation of every piece you will play later.",
        "code": "xs, ys = [0, 1, 2, 3, 4], [1, 3, 5, 7, 9]\nw = b = 0.0\nfor step in range(1, 4):\n    e = [w * x + b - y for x, y in zip(xs, ys)]\n    dw = sum(2 * ei * x for ei, x in zip(e, xs)) / len(xs)\n    db = sum(2 * ei for ei in e) / len(xs)\n    w, b = w - 0.05 * dw, b - 0.05 * db\n    print(f\"step {step}: dw={dw:.3f} db={db:.3f} -> w={w:.3f} b={b:.3f}\")",
        "output": "step 1: dw=-28.000 db=-10.000 -> w=1.400 b=0.500\nstep 2: dw=-9.200 db=-3.400 -> w=1.860 b=0.670\nstep 3: dw=-3.000 db=-1.220 -> w=2.010 b=0.731",
        "codeNotes": [
          {
            "line": 7,
            "note": "Update both at once from the same gradients."
          }
        ],
        "tryIt": "Why is dw much larger than db at step 1?",
        "check": {
          "question": "Where should fit_line start?",
          "options": [
            "At random values",
            "At w = 0.0 and b = 0.0",
            "At the true answer"
          ],
          "answer": 1,
          "why": "The task starts from zeros so results are reproducible."
        }
      }
    ],
    "summary": [
      "Training loop: forward, loss, backward, update, repeated.",
      "MSE averages squared errors; zero means perfect predictions.",
      "For y = w·x + b: dw = mean(2·e·x), db = mean(2·e).",
      "Gradient descent: w -= lr·dw, b -= lr·db.",
      "Too small a learning rate is slow; too large diverges."
    ],
    "projectStep": {
      "title": "Training planner, part 2",
      "steps": [
        "Implement mse_and_grads and fit_line.",
        "Plot or print the loss curve for three learning rates.",
        "Write down which learning rate you would choose and why."
      ]
    }
  },
  {
    "day": 3,
    "title": "Mini-Batches, Batch Size and Learning Rate Scaling",
    "goal": "You can split a dataset into mini-batches, explain epochs and dropped batches, and adjust the learning rate when the batch size changes using the linear and square-root rules.",
    "minutes": 30,
    "recap": "Yesterday's gradient descent used all the data for every step. Real datasets are far too large for that, so today we split them into mini-batches, which is also how work is later shared between GPUs.",
    "parts": [
      {
        "title": "Why mini-batches",
        "say": [
          "Computing the gradient over billions of tokens before a single update would be absurdly slow.",
          "Instead we compute the gradient on a small random sample, a mini-batch, and update straight away.",
          "This is stochastic gradient descent: each step is noisy, but many quick steps beat a few perfect ones.",
          "The noise even helps models escape poor solutions and generalise better.",
          "An epoch is one full pass over the dataset; the number of steps per epoch is the dataset size divided by the batch size.",
          "Large language models often train for about one epoch over a huge dataset.",
          "The example counts steps per epoch for different batch sizes.",
          "Batch size is limited by GPU memory, because activations grow with the batch (Day 8).",
          "The global batch in distributed training is the sum of the batches on all GPUs.",
          "Choosing the batch size is a balance between speed, memory and training quality."
        ],
        "example": "Tasting soup with a spoon instead of drinking the whole pot before adding salt.",
        "code": "import math\n\ndataset = 1_000_000\nfor batch in [32, 256, 1024, 4096]:\n    print(f\"batch {batch:5}: {math.ceil(dataset / batch):6} steps per epoch\")",
        "output": "batch    32:  31250 steps per epoch\nbatch   256:   3907 steps per epoch\nbatch  1024:    977 steps per epoch\nbatch  4096:    245 steps per epoch",
        "codeNotes": [
          {
            "line": 5,
            "note": "Round up: the last batch may be smaller."
          }
        ],
        "tryIt": "How many epochs would 100,000 steps at batch 256 be for this dataset?",
        "check": {
          "question": "What is an epoch?",
          "options": [
            "One update step",
            "One full pass over the dataset",
            "One GPU"
          ],
          "answer": 1,
          "why": "An epoch sees every example once."
        }
      },
      {
        "title": "Making batches",
        "say": [
          "A simple way to batch is by index ranges: 0 to 4, 4 to 8, and so on.",
          "The last batch is often smaller when the dataset size is not a multiple of the batch size.",
          "Some training setups drop that last short batch so every step has the same shape, which matters for compiled or distributed code.",
          "Practice 1 is make_batches(n, batch_size, drop_last=False), which returns (start, end) pairs.",
          "Python's range with a step makes this neat: range(0, n, batch_size) gives every start index.",
          "The example shows batches with and without drop_last.",
          "Real data loaders also shuffle the order every epoch (Day 19), but the batching logic is the same.",
          "Batch sizes below 1 make no sense and should raise ValueError.",
          "Uniform batch shapes help GPUs run at full speed, which is why drop_last is popular in large runs.",
          "Losing a few examples per epoch is usually harmless on large datasets."
        ],
        "example": "Packing eggs into cartons of six: the last carton may be half empty, and you can choose to leave those eggs for tomorrow.",
        "code": "def batches(n, size, drop_last=False):\n    out = []\n    for start in range(0, n, size):\n        end = min(start + size, n)\n        if drop_last and end - start < size:\n            break\n        out.append((start, end))\n    return out\n\nprint(\"keep last:\", batches(10, 4))\nprint(\"drop last:\", batches(10, 4, drop_last=True))",
        "output": "keep last: [(0, 4), (4, 8), (8, 10)]\ndrop last: [(0, 4), (4, 8)]",
        "codeNotes": [
          {
            "line": 4,
            "note": "The last batch stops at n."
          },
          {
            "line": 5,
            "note": "Skip a short final batch if asked."
          }
        ],
        "tryIt": "What does batches(12, 4, drop_last=True) return? Does drop_last change anything?",
        "check": {
          "question": "When does drop_last actually drop something?",
          "options": [
            "Always",
            "When the dataset size is not a multiple of the batch size",
            "Never"
          ],
          "answer": 1,
          "why": "Only a short final batch is dropped."
        }
      },
      {
        "title": "Batch size and gradient noise",
        "say": [
          "A bigger batch gives a more accurate gradient estimate, with less noise.",
          "With less noise, we can safely take bigger steps, so the learning rate can grow.",
          "The example measures how much the gradient estimate varies for different batch sizes on toy data.",
          "The spread shrinks roughly with the square root of the batch size.",
          "This is why doubling the batch does not simply double progress per step: returns diminish.",
          "Beyond a certain critical batch size, larger batches waste compute without speeding training.",
          "Distributed training uses large global batches, so understanding this trade-off is essential.",
          "Research by OpenAI and others measured critical batch sizes for many tasks.",
          "In practice, teams pick the largest batch that still trains efficiently, then fill the cluster with it.",
          "We will use these ideas again when planning accumulation (Day 6) and elastic training (Day 18)."
        ],
        "example": "Asking more people in a survey: the average gets steadier, but asking a million instead of a thousand barely helps.",
        "code": "import random, statistics\n\nrng = random.Random(0)\ndata = [rng.gauss(2.0, 1.0) for _ in range(10000)]\nfor batch in [8, 64, 512]:\n    means = [statistics.mean(rng.sample(data, batch)) for _ in range(200)]\n    print(f\"batch {batch:4}: spread of estimates {statistics.stdev(means):.3f}\")",
        "output": "batch    8: spread of estimates 0.348\nbatch   64: spread of estimates 0.130\nbatch  512: spread of estimates 0.043",
        "codeNotes": [
          {
            "line": 3,
            "note": "A fixed seed makes the example repeatable."
          },
          {
            "line": 6,
            "note": "Many estimates from different random batches."
          }
        ],
        "tryIt": "By how much does the spread shrink when the batch grows 8 times? Compare with the square root of 8.",
        "check": {
          "question": "What happens to gradient noise as the batch grows?",
          "options": [
            "It grows",
            "It shrinks, roughly with the square root of the batch size",
            "It stays the same"
          ],
          "answer": 1,
          "why": "Averaging more samples reduces noise."
        }
      },
      {
        "title": "Learning rate scaling rules",
        "say": [
          "When you multiply the batch size by k, a common starting point is to multiply the learning rate by k too: the linear scaling rule.",
          "Goyal and colleagues used it to train ImageNet models with batches of 8192 in one hour.",
          "Adaptive optimizers like Adam often behave better with the square-root rule: multiply the learning rate by the square root of k.",
          "Practice 2 is scaled_lr(base_lr, base_batch, new_batch, rule), supporting both rules.",
          "Both rules are starting points for tuning, not guarantees.",
          "The example scales a base learning rate for several batch sizes with each rule.",
          "Very large learning rates at the start of training can be unstable, which is why warmup exists (Day 15).",
          "Rounding to 6 decimals keeps printed learning rates readable.",
          "Keep a record of the base batch and base learning rate so scaling is always done from a known point.",
          "Unknown rule names should raise an error rather than silently falling back."
        ],
        "example": "Doubling a recipe: some ingredients double exactly, others, like salt or spices, need a gentler increase.",
        "code": "import math\n\nbase_lr, base_batch = 3e-4, 256\nfor batch in [256, 1024, 4096]:\n    k = batch / base_batch\n    print(f\"batch {batch:5}: linear {base_lr * k:.6f}  sqrt {base_lr * math.sqrt(k):.6f}\")",
        "output": "batch   256: linear 0.000300  sqrt 0.000300\nbatch  1024: linear 0.001200  sqrt 0.000600\nbatch  4096: linear 0.004800  sqrt 0.001200",
        "codeNotes": [
          {
            "line": 5,
            "note": "How many times larger the batch is."
          }
        ],
        "tryIt": "Which rule gives the more cautious learning rate at batch 4096?",
        "check": {
          "question": "Under the linear rule, what happens to the learning rate when the batch is 4 times larger?",
          "options": [
            "It is divided by 4",
            "It is multiplied by 4",
            "It is multiplied by 2"
          ],
          "answer": 1,
          "why": "Linear means proportional."
        }
      },
      {
        "title": "Mini-batch training loop",
        "say": [
          "Putting it together: shuffle the data, cut it into batches, and update once per batch.",
          "Each epoch visits every example once, in a new random order.",
          "The example fits yesterday's line using batches of two points.",
          "The result reaches the right answer, but the path is noisier than with the full dataset.",
          "In distributed training, each GPU would take different batches at the same time.",
          "A seeded random number generator makes the shuffle repeatable, so results can be reproduced exactly.",
          "This is also what makes debugging possible when something goes wrong on step 51,203.",
          "Real frameworks wrap all of this in a DataLoader, but the logic is exactly this loop.",
          "The learning rate may need to be smaller with small, noisy batches.",
          "Tomorrow the batches are split across several workers for the first time."
        ],
        "example": "Revising for an exam with flashcards in a shuffled order each night, a few cards at a time.",
        "code": "import random\n\nxs, ys = [0, 1, 2, 3, 4, 5], [1, 3, 5, 7, 9, 11]\nw = b = 0.0\nrng = random.Random(42)\norder = list(range(len(xs)))\nfor epoch in range(300):\n    rng.shuffle(order)\n    for i in range(0, len(order), 2):\n        idx = order[i:i + 2]\n        e = [(w * xs[j] + b - ys[j], xs[j]) for j in idx]\n        w -= 0.02 * sum(2 * err * x for err, x in e) / len(e)\n        b -= 0.02 * sum(2 * err for err, _ in e) / len(e)\nprint(f\"w={w:.3f} b={b:.3f}\")",
        "output": "w=2.000 b=1.000",
        "codeNotes": [
          {
            "line": 8,
            "note": "A new order every epoch."
          },
          {
            "line": 10,
            "note": "Indices of the current mini-batch."
          }
        ],
        "tryIt": "Change the batch size to 1 and to 6. How does the final answer and the number of updates change?",
        "check": {
          "question": "Why use a seeded random generator for shuffling?",
          "options": [
            "It is faster",
            "Results become reproducible",
            "It removes noise"
          ],
          "answer": 1,
          "why": "Same seed, same order, same results."
        }
      },
      {
        "title": "Practice time: batches and scaling",
        "say": [
          "Practice 1: make_batches(n, batch_size, drop_last=False). Return (start, end) pairs covering 0..n; drop a short last batch when asked; raise ValueError for batch_size below 1.",
          "The checks include ten items in batches of four, with and without drop_last, an exact fit, an empty dataset and a bad batch size.",
          "Practice 2: scaled_lr(base_lr, base_batch, new_batch, rule='linear'). Multiply by the ratio for linear, by its square root for sqrt, round to 6 decimals, and raise ValueError for other rules.",
          "The checks cover scaling up, scaling down and both rules.",
          "After passing, combine them: for a dataset of one million examples, list steps per epoch and a scaled learning rate for several batch sizes.",
          "The example prints exactly that table.",
          "Tomorrow introduces data parallelism: several workers, each with their own batches, sharing gradients.",
          "Everything today applies to each worker's share of the data.",
          "Batch size decisions ripple into memory, speed and stability, so they deserve care.",
          "Keep today's helper functions: later practice tasks assume you understand them."
        ],
        "example": "A kitchen planning service: how many trays per batch, how many batches, and how hot the oven should be for each tray size.",
        "code": "import math\n\nn, base_lr, base_batch = 1_000_000, 1e-3, 256\nfor batch in [256, 1024, 4096]:\n    steps = math.ceil(n / batch)\n    lr = round(base_lr * math.sqrt(batch / base_batch), 6)\n    print(f\"batch {batch:5}: {steps:5} steps/epoch, sqrt-scaled lr {lr}\")",
        "output": "batch   256:  3907 steps/epoch, sqrt-scaled lr 0.001\nbatch  1024:   977 steps/epoch, sqrt-scaled lr 0.002\nbatch  4096:   245 steps/epoch, sqrt-scaled lr 0.004",
        "codeNotes": [
          {
            "line": 6,
            "note": "The square-root rule for an Adam-style optimizer."
          }
        ],
        "tryIt": "Which batch size would you pick for 16 GPUs with 64 examples each?",
        "check": {
          "question": "What should scaled_lr do with rule=\"cubic\"?",
          "options": [
            "Use linear",
            "Raise ValueError",
            "Return base_lr"
          ],
          "answer": 1,
          "why": "Unknown rules are errors."
        }
      }
    ],
    "summary": [
      "Mini-batches give fast, noisy gradient estimates; an epoch is one full pass.",
      "The last batch can be short; drop_last keeps shapes uniform.",
      "Bigger batches reduce gradient noise with diminishing returns.",
      "Scale the learning rate linearly or by the square root when the batch changes.",
      "Seeded shuffling makes training reproducible."
    ],
    "projectStep": {
      "title": "Training planner, part 3",
      "steps": [
        "Implement make_batches and scaled_lr.",
        "Train the line with several batch sizes and compare the number of updates.",
        "Add a table of steps per epoch and scaled learning rates to your planner."
      ]
    }
  },
  {
    "day": 4,
    "title": "Data Parallelism: Sharding Data and Averaging Gradients",
    "goal": "You can split a dataset across workers with a distributed sampler, average gradients from several workers, and explain why data-parallel training keeps every model copy identical.",
    "minutes": 30,
    "recap": "Yesterday we cut data into mini-batches. Today several workers each take different batches at the same time, the most common way to train on many GPUs.",
    "parts": [
      {
        "title": "The idea of data parallelism",
        "say": [
          "In data parallelism, every GPU holds a full copy of the model.",
          "Each GPU processes a different slice of the data, called its shard, and computes its own gradients.",
          "The gradients are then averaged across all GPUs, and every GPU applies the same update.",
          "Because every copy starts identical and applies identical updates, the copies stay identical forever.",
          "With 8 GPUs you process 8 times as much data per step, so training finishes much sooner.",
          "PyTorch's DistributedDataParallel (DDP) is the standard implementation.",
          "The example simulates three workers, each with its own slice of a small dataset.",
          "The limit of plain data parallelism is memory: every GPU still needs the whole model and optimizer state.",
          "That limit is what sharding techniques on Days 9 and 10 remove.",
          "Each worker in a data-parallel job has a number called its rank, from 0 to world_size − 1."
        ],
        "example": "A team of markers grading exams: each marks a different pile using the same marking scheme, and they meet to agree any changes to the scheme.",
        "code": "data = list(range(12))\nworld_size = 3\nfor rank in range(world_size):\n    shard = data[rank::world_size]\n    print(f\"rank {rank}: {shard}\")",
        "output": "rank 0: [0, 3, 6, 9]\nrank 1: [1, 4, 7, 10]\nrank 2: [2, 5, 8, 11]",
        "codeNotes": [
          {
            "line": 4,
            "note": "Every third item, starting at the rank."
          }
        ],
        "tryIt": "What happens to each shard's size if the world size becomes 4?",
        "check": {
          "question": "In data parallelism, what does each GPU hold?",
          "options": [
            "One layer of the model",
            "A full copy of the model and a different slice of the data",
            "Only the optimizer"
          ],
          "answer": 1,
          "why": "Full model, different data."
        }
      },
      {
        "title": "The distributed sampler",
        "say": [
          "A distributed sampler decides which examples each rank sees.",
          "Every rank must process the same number of batches, otherwise some GPUs would wait forever for others at the averaging step.",
          "When the dataset size is not divisible by the world size, the sampler pads the index list by repeating indices from the start.",
          "Then rank r takes indices r, r + world_size, r + 2·world_size and so on.",
          "Practice 1 is shard_indices(n, world_size, rank), which implements exactly this logic without shuffling.",
          "The example shows 10 examples split across 4 ranks, with two indices repeated as padding.",
          "A few repeated examples per epoch have almost no effect on training, while unequal shards could hang the whole job.",
          "Real samplers also shuffle with a shared seed, so all ranks agree on the order (Day 19).",
          "Invalid ranks, outside 0 to world_size − 1, are a configuration error and should raise ValueError.",
          "Understanding the sampler explains why the number of steps per epoch depends on the number of GPUs."
        ],
        "example": "Dealing cards around a table: if there are not enough to go round evenly, you reuse a couple from the top so everyone plays the same number of rounds.",
        "code": "import math\n\nn, world = 10, 4\ntotal = math.ceil(n / world) * world\nindices = list(range(n))\nindices += indices[:total - n]\nprint(\"padded:\", indices)\nfor rank in range(world):\n    print(f\"rank {rank}: {indices[rank::world]}\")",
        "output": "padded: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]\nrank 0: [0, 4, 8]\nrank 1: [1, 5, 9]\nrank 2: [2, 6, 0]\nrank 3: [3, 7, 1]",
        "codeNotes": [
          {
            "line": 4,
            "note": "Round up to a multiple of the world size."
          },
          {
            "line": 6,
            "note": "Pad by repeating from the start."
          }
        ],
        "tryIt": "Which indices appear twice, and on which ranks?",
        "check": {
          "question": "Why does the sampler pad the index list?",
          "options": [
            "To add new data",
            "So every rank gets the same number of examples",
            "To shuffle"
          ],
          "answer": 1,
          "why": "Equal shards keep ranks in step."
        }
      },
      {
        "title": "Averaging gradients",
        "say": [
          "After the backward pass, each rank has gradients computed from its own shard.",
          "Averaging them element by element gives the gradient that a single machine would have computed on all the data together, when shards are the same size.",
          "Practice 2 is average_gradients(worker_grads), which averages lists position by position.",
          "Python's zip(*lists) is perfect here: it walks through the same position in every list at once.",
          "The example averages the gradients from three workers.",
          "Gradients of different lengths indicate that the workers have different models, which is a serious bug.",
          "In real systems, this averaging is done with a collective operation called all-reduce, covered tomorrow.",
          "Averaging, rather than summing, keeps the learning rate meaning the same regardless of how many GPUs you use.",
          "Some frameworks sum and then divide, which is equivalent.",
          "Rounding helps only for display and testing; real systems keep full precision."
        ],
        "example": "Several scouts each measure the slope in their part of a valley; averaging their readings gives the best overall direction.",
        "code": "worker_grads = [[0.2, -0.4, 1.0], [0.4, -0.2, 0.0], [0.0, -0.3, 0.5]]\navg = [round(sum(vals) / len(worker_grads), 4) for vals in zip(*worker_grads)]\nprint(\"average gradient:\", avg)",
        "output": "average gradient: [0.2, -0.3, 0.5]",
        "codeNotes": [
          {
            "line": 2,
            "note": "zip(*...) groups the same position from every worker."
          }
        ],
        "tryIt": "Suppose one worker's data were much harder, giving large gradients. How would that affect the average?",
        "check": {
          "question": "What does zip(*worker_grads) produce?",
          "options": [
            "The workers one by one",
            "Tuples of the same position from every worker",
            "A flat list"
          ],
          "answer": 1,
          "why": "It transposes the list of lists."
        }
      },
      {
        "title": "Same result as one big batch",
        "say": [
          "A key property: data parallelism with equal shards gives the same update as one machine with the combined batch.",
          "The example verifies this on the line-fitting problem from Day 2.",
          "One machine computes the gradient on all six points; two workers each compute on three points and average.",
          "The two answers match exactly.",
          "This is why data parallelism does not change what the model learns, only how fast it learns it.",
          "The global batch size is the per-GPU batch multiplied by the number of GPUs.",
          "If you add GPUs and keep the per-GPU batch fixed, the global batch grows, and the learning rate may need scaling (Day 3).",
          "If you keep the global batch fixed, each GPU gets less work and communication becomes relatively more expensive.",
          "Balancing these choices is part of every distributed training plan.",
          "Checking equivalence on toy problems is a good habit when writing distributed code."
        ],
        "example": "Splitting a restaurant bill: whether one person adds it all up or four people each add their part and combine, the total is the same.",
        "code": "xs, ys = [0, 1, 2, 3, 4, 5], [1, 3, 5, 7, 9, 11]\nw, b = 0.5, 0.0\ndef grads(px, py):\n    e = [w * x + b - y for x, y in zip(px, py)]\n    return [sum(2 * ei * x for ei, x in zip(e, px)) / len(px), sum(2 * ei for ei in e) / len(px)]\n\nsingle = grads(xs, ys)\nworkers = [grads(xs[r::2], ys[r::2]) for r in range(2)]\naveraged = [sum(v) / 2 for v in zip(*workers)]\nprint(\"one machine:\", [round(g, 4) for g in single])\nprint(\"two workers:\", [round(g, 4) for g in averaged])",
        "output": "one machine: [-32.5, -9.5]\ntwo workers: [-32.5, -9.5]",
        "codeNotes": [
          {
            "line": 8,
            "note": "Each worker uses its own half of the data."
          },
          {
            "line": 9,
            "note": "Average the workers' gradients."
          }
        ],
        "tryIt": "Would the answers still match if one worker had 4 points and the other 2? Try it.",
        "check": {
          "question": "With equal shards, how does the averaged gradient compare with one big batch?",
          "options": [
            "It is noisier",
            "It is the same",
            "It is always smaller"
          ],
          "answer": 1,
          "why": "Equal shards make the average exact."
        }
      },
      {
        "title": "Where data parallelism struggles",
        "say": [
          "Every step, all GPUs must exchange gradients as large as the whole model.",
          "For a 7B model in 16-bit, that is 14 GB of gradients per step.",
          "If the network is slow, GPUs sit idle waiting, and adding GPUs stops helping.",
          "Every GPU also stores the full model, gradients and optimizer states, which may not fit at all.",
          "The example estimates gradient traffic per step for several model sizes.",
          "Solutions include faster networks, overlapping communication with computation (Day 21), gradient accumulation (Day 6) and sharding (Days 9 and 10).",
          "For small and medium models, plain data parallelism remains the simplest and often the fastest option.",
          "A straggler, one slow GPU, delays every step for everyone, because averaging waits for the last worker.",
          "Monitoring per-rank step times helps find stragglers early.",
          "Knowing the weaknesses tells you when to move to more advanced techniques."
        ],
        "example": "A choir that must pause after every line so everyone can agree on the next note: great with ten singers, slow with ten thousand.",
        "code": "for name, params in [(\"125M\", 125e6), (\"1.3B\", 1.3e9), (\"7B\", 7e9), (\"70B\", 70e9)]:\n    grad_gb = params * 2 / 1e9\n    print(f\"{name:5} gradients per step: {grad_gb:7.2f} GB (16-bit)\")",
        "output": "125M  gradients per step:    0.25 GB (16-bit)\n1.3B  gradients per step:    2.60 GB (16-bit)\n7B    gradients per step:   14.00 GB (16-bit)\n70B   gradients per step:  140.00 GB (16-bit)",
        "codeNotes": [
          {
            "line": 2,
            "note": "Two bytes per gradient value in 16-bit."
          }
        ],
        "tryIt": "At 50 GB per second of network bandwidth, roughly how long would sending the 70B gradients take?",
        "check": {
          "question": "What is a straggler?",
          "options": [
            "A fast GPU",
            "A slow worker that delays every step for everyone",
            "A dropped batch"
          ],
          "answer": 1,
          "why": "Synchronous steps wait for the slowest worker."
        }
      },
      {
        "title": "Practice time: sharding and averaging",
        "say": [
          "Practice 1: shard_indices(n, world_size, rank). Pad the list 0..n-1 by repeating from the start up to a multiple of world_size, then return indices[rank::world_size]; raise ValueError for an invalid rank.",
          "The checks include 10 examples on 4 ranks, where ranks 2 and 3 receive padded indices 0 and 1, and a check that all ranks together cover all the data.",
          "Practice 2: average_gradients(worker_grads). Return the element-wise mean rounded to 4 decimals, and raise ValueError for an empty list or mismatched lengths.",
          "The checks include two workers, one worker and three workers with a repeating decimal.",
          "After passing, combine them: shard a dataset, compute a gradient per rank and average them.",
          "The example runs one full data-parallel step on the line problem.",
          "Tomorrow looks at how GPUs actually exchange gradients efficiently: collective communication and ring all-reduce.",
          "Keep the picture in mind: same model everywhere, different data, averaged gradients, identical updates.",
          "This pattern trains a large share of the world's production models.",
          "If a check fails, print each rank's shard to see exactly which indices it received."
        ],
        "example": "A relay of identical workshops, each building from a different pile of parts, then sharing notes so all workshops improve in the same way.",
        "code": "xs, ys = [0, 1, 2, 3, 4, 5, 6, 7], [1, 3, 5, 7, 9, 11, 13, 15]\nw = b = 0.0\nworld = 4\nfor step in range(300):\n    per_rank = []\n    for rank in range(world):\n        idx = list(range(len(xs)))[rank::world]\n        e = [w * xs[i] + b - ys[i] for i in idx]\n        per_rank.append([sum(2 * ei * xs[i] for ei, i in zip(e, idx)) / len(idx), sum(2 * ei for ei in e) / len(idx)])\n    dw, db = [sum(v) / world for v in zip(*per_rank)]\n    w, b = w - 0.02 * dw, b - 0.02 * db\nprint(f\"after 300 data-parallel steps: w={w:.3f} b={b:.3f}\")",
        "output": "after 300 data-parallel steps: w=2.004 b=0.982",
        "codeNotes": [
          {
            "line": 7,
            "note": "Each rank's shard."
          },
          {
            "line": 10,
            "note": "Average across ranks, then one shared update."
          }
        ],
        "tryIt": "Change world to 2 and 8. Does the result change? Why or why not?",
        "check": {
          "question": "What should shard_indices do for rank 4 when world_size is 4?",
          "options": [
            "Return an empty list",
            "Raise ValueError",
            "Wrap around to rank 0"
          ],
          "answer": 1,
          "why": "Ranks go from 0 to world_size - 1."
        }
      }
    ],
    "summary": [
      "Data parallelism: full model on every GPU, different data, averaged gradients.",
      "Distributed samplers pad indices so every rank gets equal work.",
      "Average gradients element-wise; equal shards match one big batch exactly.",
      "Global batch = per-GPU batch × number of GPUs.",
      "Limits: gradient traffic, full model memory per GPU and stragglers."
    ],
    "projectStep": {
      "title": "Training planner, part 4",
      "steps": [
        "Implement shard_indices and average_gradients.",
        "Simulate data-parallel training of the line with 1, 2 and 4 workers.",
        "Estimate gradient traffic per step for your model sizes."
      ]
    }
  },
  {
    "day": 5,
    "title": "Collective Communication: All-Reduce, Broadcast and Ring All-Reduce",
    "goal": "You can describe broadcast, reduce, all-reduce, all-gather and reduce-scatter, simulate an all-reduce, and calculate the steps and traffic of ring all-reduce.",
    "minutes": 30,
    "recap": "Yesterday every worker averaged its gradients with the others, but we skipped how the numbers actually travel between GPUs. Today covers the communication operations that every distributed training system is built on.",
    "parts": [
      {
        "title": "Collective operations",
        "say": [
          "A collective operation is a communication pattern in which a whole group of workers takes part together.",
          "Broadcast sends one worker's data to everyone, for example the initial model weights.",
          "Reduce combines everyone's data, for example by summing, and delivers the result to one worker.",
          "All-reduce combines everyone's data and delivers the result to every worker, which is what gradient averaging needs.",
          "All-gather collects each worker's piece so everyone gets the whole thing; reduce-scatter combines and then gives each worker one piece of the result.",
          "Libraries such as NCCL on NVIDIA GPUs and Gloo or MPI on CPUs implement these operations very efficiently.",
          "The example demonstrates broadcast, reduce and all-gather on small lists.",
          "All-reduce can be built from a reduce-scatter followed by an all-gather, which is exactly how ring all-reduce works.",
          "Sharded training (Days 9 and 10) uses all-gather and reduce-scatter heavily.",
          "Learning these five names makes framework documentation and error messages much easier to read."
        ],
        "example": "Office messages: an announcement to everyone (broadcast), everyone reporting totals to the manager (reduce), and everyone getting the final totals (all-reduce).",
        "code": "workers = [[1, 2], [3, 4], [5, 6]]\nbroadcast = [list(workers[0]) for _ in workers]\nreduce_to_0 = [sum(v) for v in zip(*workers)]\nall_gather = [sum(workers, []) for _ in workers]\nprint(\"broadcast from 0:\", broadcast)\nprint(\"reduce (sum) on 0:\", reduce_to_0)\nprint(\"all-gather:\", all_gather[0], \"on every worker\")",
        "output": "broadcast from 0: [[1, 2], [1, 2], [1, 2]]\nreduce (sum) on 0: [9, 12]\nall-gather: [1, 2, 3, 4, 5, 6] on every worker",
        "codeNotes": [
          {
            "line": 3,
            "note": "Element-wise sum across workers."
          },
          {
            "line": 4,
            "note": "Every worker gets every piece."
          }
        ],
        "tryIt": "Which collective would you use to send the starting weights from rank 0 to every GPU?",
        "check": {
          "question": "Which collective gives every worker the combined result?",
          "options": [
            "Reduce",
            "All-reduce",
            "Broadcast"
          ],
          "answer": 1,
          "why": "All-reduce delivers the combined result to all."
        }
      },
      {
        "title": "All-reduce",
        "say": [
          "All-reduce is the workhorse of data-parallel training.",
          "Each worker contributes a vector; the vectors are combined element-wise with an operation such as sum, mean or max; every worker receives the result.",
          "Practice 1 is all_reduce(vectors, op), which returns one copy of the combined vector per worker.",
          "Each worker must get its own copy of the list, so changing one does not change the others, just as separate GPUs have separate memory.",
          "The example runs sum, mean and max all-reduces.",
          "Mean all-reduce gives averaged gradients directly.",
          "Max all-reduce is useful for checks like \"did any worker see an overflow?\" in mixed precision (Day 7).",
          "Unknown operations should raise ValueError.",
          "In real clusters an all-reduce over gigabytes may take tens of milliseconds, so it is a key performance factor.",
          "Everything we build today simulates the result; tomorrow's topics assume you know what the result should be."
        ],
        "example": "Every table in a quiz sends in its score, and the host reads out the combined scores to every table.",
        "code": "vectors = [[1.0, 4.0], [2.0, 0.0], [6.0, 2.0]]\nops = {\"sum\": lambda v: sum(v), \"mean\": lambda v: round(sum(v) / len(v), 4), \"max\": max}\nfor name, fn in ops.items():\n    result = [fn(v) for v in zip(*vectors)]\n    print(f\"{name:4}: every worker gets {result}\")",
        "output": "sum : every worker gets [9.0, 6.0]\nmean: every worker gets [3.0, 2.0]\nmax : every worker gets [6.0, 4.0]",
        "codeNotes": [
          {
            "line": 4,
            "note": "Combine position by position."
          }
        ],
        "tryIt": "Why would a copy of the list per worker matter in your practice solution?",
        "check": {
          "question": "Which all-reduce operation helps detect an overflow on any worker?",
          "options": [
            "sum",
            "max",
            "mean"
          ],
          "answer": 1,
          "why": "If any worker reports 1 for overflow, the max is 1."
        }
      },
      {
        "title": "The naive approach and its bottleneck",
        "say": [
          "A naive all-reduce sends every worker's data to one leader, which sums it and sends the result back.",
          "The leader must receive p − 1 full copies and send p − 1 full copies, so its network link becomes a bottleneck.",
          "With 64 GPUs and 14 GB of gradients, the leader would move almost 2 terabytes per step.",
          "The example computes the leader's traffic for different cluster sizes.",
          "The traffic grows linearly with the number of workers, which is why this approach does not scale.",
          "Parameter servers, used in early distributed training, suffered from a version of this problem.",
          "Modern systems use ring or tree algorithms that spread the traffic evenly across all links.",
          "Good algorithms make communication time nearly independent of the number of GPUs.",
          "This is one of the key reasons large clusters can be used efficiently at all.",
          "Understanding the naive version makes the clever version easier to appreciate."
        ],
        "example": "One teacher collecting and marking every homework in a school of thousands, instead of students checking each other's work in a circle.",
        "code": "size_gb = 14\nfor p in [4, 16, 64, 256]:\n    leader_traffic = 2 * (p - 1) * size_gb\n    print(f\"{p:4} GPUs: leader moves {leader_traffic:6} GB per step\")",
        "output": "   4 GPUs: leader moves     84 GB per step\n  16 GPUs: leader moves    420 GB per step\n  64 GPUs: leader moves   1764 GB per step\n 256 GPUs: leader moves   7140 GB per step",
        "codeNotes": [
          {
            "line": 3,
            "note": "Receive p - 1 copies and send p - 1 copies."
          }
        ],
        "tryIt": "At 50 GB per second, how long would the leader need with 256 GPUs?",
        "check": {
          "question": "Why does the naive leader approach not scale?",
          "options": [
            "It uses too little memory",
            "The leader's traffic grows with the number of workers",
            "It is inaccurate"
          ],
          "answer": 1,
          "why": "One link carries everything."
        }
      },
      {
        "title": "Ring all-reduce",
        "say": [
          "In ring all-reduce, workers are arranged in a circle, and each sends only to its right-hand neighbour.",
          "The data is cut into p chunks. In the reduce-scatter phase, over p − 1 steps, chunks are passed around and summed, so each worker ends up with one fully summed chunk.",
          "In the all-gather phase, over another p − 1 steps, the summed chunks travel around the ring until everyone has all of them.",
          "That is 2(p − 1) steps in total, and each step sends only one chunk of size data / p.",
          "So each worker sends 2(p − 1)/p times the data size, which stays below twice the data size however many workers there are.",
          "Practice 2 is ring_cost(size_mb, workers), which returns the steps and the megabytes each worker sends.",
          "The example simulates the reduce-scatter phase on three workers so you can watch the sums build up.",
          "Baidu popularised ring all-reduce for deep learning in 2017, and Horovod and NCCL build on it.",
          "Rings have a latency cost that grows with p, so very large clusters also use tree and hierarchical algorithms.",
          "Every link in the ring is busy at the same time, which is why bandwidth is used so efficiently."
        ],
        "example": "Passing dishes around a dinner table: everyone passes to the right at the same time, and after enough rounds everyone has tasted everything.",
        "code": "p = 3\ndata = [[1, 10, 100], [2, 20, 200], [3, 30, 300]]\nchunks = [list(d) for d in data]\nfor step in range(p - 1):\n    sends = [(r, (r - step) % p, chunks[r][(r - step) % p]) for r in range(p)]\n    for r, c, value in sends:\n        chunks[(r + 1) % p][c] += value\n    print(f\"after step {step + 1}: {chunks}\")\nprint(\"fully reduced chunk on each worker:\", [(r, (r + 1) % p, chunks[r][(r + 1) % p]) for r in range(p)])",
        "output": "after step 1: [[1, 10, 400], [3, 20, 200], [3, 50, 300]]\nafter step 2: [[1, 60, 400], [3, 20, 600], [6, 50, 300]]\nfully reduced chunk on each worker: [(0, 1, 60), (1, 2, 600), (2, 0, 6)]",
        "codeNotes": [
          {
            "line": 5,
            "note": "Each worker sends one chunk to its right neighbour."
          },
          {
            "line": 9,
            "note": "Each worker now owns one complete sum."
          }
        ],
        "tryIt": "After the reduce-scatter, what would the all-gather phase need to do?",
        "check": {
          "question": "How much data does each worker send in ring all-reduce?",
          "options": [
            "p times the data",
            "2(p - 1)/p times the data, less than twice the data",
            "Nothing"
          ],
          "answer": 1,
          "why": "Traffic per worker stays below 2x the data size."
        }
      },
      {
        "title": "Choosing and using collectives",
        "say": [
          "Frameworks choose algorithms automatically, but engineers still choose which collectives their training uses.",
          "Data parallelism needs one all-reduce of gradients per step.",
          "ZeRO and FSDP replace that with a reduce-scatter of gradients and all-gathers of parameters.",
          "Tensor parallelism uses all-reduce inside each layer, many times per step, so it needs very fast links such as NVLink.",
          "The example lists which collectives each technique relies on.",
          "Collective operations are blocking by default: every worker must call them, in the same order, or the job hangs.",
          "A mismatched collective, for example one rank skipping a call because of an if statement, is a classic distributed training bug.",
          "Timeouts and debug logs in NCCL help track down such hangs.",
          "Knowing the collectives also helps you read profiler traces (Day 24).",
          "The next days show how these operations are combined into larger strategies."
        ],
        "example": "Musicians in an orchestra must play their parts in the same order; if one skips a bar, everyone ends up waiting or out of time.",
        "code": "uses = {\"data parallel (DDP)\": [\"all-reduce gradients\"],\n        \"ZeRO / FSDP\": [\"all-gather parameters\", \"reduce-scatter gradients\"],\n        \"tensor parallel\": [\"all-reduce activations inside layers\"],\n        \"pipeline parallel\": [\"point-to-point sends between stages\"]}\nfor technique, ops in uses.items():\n    print(f\"{technique:20} -> {', '.join(ops)}\")",
        "output": "data parallel (DDP)  -> all-reduce gradients\nZeRO / FSDP          -> all-gather parameters, reduce-scatter gradients\ntensor parallel      -> all-reduce activations inside layers\npipeline parallel    -> point-to-point sends between stages",
        "codeNotes": [
          {
            "line": 2,
            "note": "Sharding swaps all-reduce for two cheaper pieces."
          }
        ],
        "tryIt": "Why does tensor parallelism need faster links than data parallelism?",
        "check": {
          "question": "What happens if one rank skips a collective call?",
          "options": [
            "It is ignored",
            "The other ranks wait and the job can hang",
            "The result is averaged anyway"
          ],
          "answer": 1,
          "why": "Every rank must call every collective."
        }
      },
      {
        "title": "Practice time: collectives",
        "say": [
          "Practice 1: all_reduce(vectors, op='sum'). Combine element-wise with sum, mean (rounded to 4 decimals) or max, return a separate copy of the result for every worker, and raise ValueError for other operations.",
          "The checks include sum, max and mean, and a test that changing one worker's copy leaves the others unchanged.",
          "Practice 2: ring_cost(size_mb, workers). Return {'steps': 2(p − 1), 'sent_mb_per_worker': 2(p − 1)/p × size rounded to 2 decimals}, and raise ValueError for fewer than one worker.",
          "The checks include 4 workers, a single worker, 64 workers and a rounding case.",
          "After passing, compare ring_cost with the naive leader traffic for your own cluster sizes.",
          "The example prints that comparison.",
          "Tomorrow shows how to reach large batch sizes on limited hardware with gradient accumulation, which also reduces how often all-reduce runs.",
          "Collectives are the vocabulary of distributed systems; you will meet them in every remaining lesson.",
          "Most real performance problems in large training runs involve communication somewhere.",
          "If a mean check fails, check that you divide by the number of workers, not the vector length."
        ],
        "example": "Comparing a single post office handling all the mail with neighbours passing letters along a street.",
        "code": "size_mb = 1000\nfor p in [2, 8, 64]:\n    ring = 2 * (p - 1) / p * size_mb\n    naive = 2 * (p - 1) * size_mb\n    print(f\"{p:3} workers: ring {ring:8.2f} MB per worker, naive leader {naive:7} MB\")",
        "output": "  2 workers: ring  1000.00 MB per worker, naive leader    2000 MB\n  8 workers: ring  1750.00 MB per worker, naive leader   14000 MB\n 64 workers: ring  1968.75 MB per worker, naive leader  126000 MB",
        "codeNotes": [
          {
            "line": 3,
            "note": "Ring traffic per worker."
          },
          {
            "line": 4,
            "note": "The busiest link in the naive scheme."
          }
        ],
        "tryIt": "At what cluster size does the naive leader move 100 times more data than a ring worker?",
        "check": {
          "question": "How many steps does ring all-reduce take with 8 workers?",
          "options": [
            "8",
            "14",
            "16"
          ],
          "answer": 1,
          "why": "2 × (8 − 1) = 14."
        }
      }
    ],
    "summary": [
      "Collectives: broadcast, reduce, all-reduce, all-gather, reduce-scatter.",
      "All-reduce gives every worker the combined result; it averages gradients in DDP.",
      "A naive leader becomes a bottleneck as workers grow.",
      "Ring all-reduce: 2(p − 1) steps, each worker sends 2(p − 1)/p of the data.",
      "Every rank must call every collective in the same order."
    ],
    "projectStep": {
      "title": "Training planner, part 5",
      "steps": [
        "Implement all_reduce and ring_cost.",
        "Simulate a ring reduce-scatter and check the sums by hand.",
        "Add communication estimates to your planner."
      ]
    }
  },
  {
    "day": 6,
    "title": "Gradient Accumulation: Big Batches on Small Hardware",
    "goal": "You can explain gradient accumulation, average accumulated gradients correctly, compute the effective batch size, and choose accumulation steps for a target global batch.",
    "minutes": 30,
    "recap": "Yesterday's all-reduce runs once per step. Today we reach large batch sizes even when each GPU can only hold a small micro-batch, and we do fewer all-reduces along the way.",
    "parts": [
      {
        "title": "Micro-batches and the memory limit",
        "say": [
          "The batch size a GPU can process at once is limited by memory for activations (Day 8).",
          "Sometimes the batch that trains best is far larger than what fits.",
          "Gradient accumulation solves this: run several small micro-batches, add up their gradients, and update only after the last one.",
          "The update is then equivalent to one step on the combined, larger batch.",
          "The number of micro-batches per update is called the accumulation steps.",
          "The example shows the memory needed for different micro-batch sizes, and which ones fit.",
          "Accumulation trades time for memory: the same number of examples, processed in more, smaller pieces.",
          "It is used in almost every large training run, alongside data parallelism.",
          "Hugging Face Trainer, DeepSpeed and PyTorch Lightning all offer it as a single setting.",
          "Understanding it precisely avoids a very common bug: forgetting to average instead of sum."
        ],
        "example": "Carrying shopping from the car in several trips because the bags are too heavy to carry all at once.",
        "code": "gpu_gb, fixed_gb, per_example_gb = 80, 40, 3.5\nfor micro in [4, 8, 11, 12, 16]:\n    need = fixed_gb + micro * per_example_gb\n    print(f\"micro-batch {micro:2}: {need:5.1f} GB -> {'fits' if need <= gpu_gb else 'too big'}\")",
        "output": "micro-batch  4:  54.0 GB -> fits\nmicro-batch  8:  68.0 GB -> fits\nmicro-batch 11:  78.5 GB -> fits\nmicro-batch 12:  82.0 GB -> too big\nmicro-batch 16:  96.0 GB -> too big",
        "codeNotes": [
          {
            "line": 3,
            "note": "Fixed model memory plus activations per example."
          }
        ],
        "tryIt": "What is the largest micro-batch that fits? How many accumulation steps reach a batch of 64?",
        "check": {
          "question": "What does gradient accumulation trade?",
          "options": [
            "Accuracy for speed",
            "Time for memory",
            "Memory for accuracy"
          ],
          "answer": 1,
          "why": "Smaller pieces fit in memory but take more passes."
        }
      },
      {
        "title": "Accumulating correctly",
        "say": [
          "Each micro-batch produces a gradient averaged over its own examples.",
          "To match one big batch, the accumulated gradient must be the average of the micro-batch gradients, not their sum.",
          "In PyTorch, people usually divide each micro-batch loss by the accumulation steps before calling backward, which gives the same result.",
          "Practice 1 is accumulate(micro_grads, accum_steps), which groups micro-batch gradients and averages each full group.",
          "An incomplete final group is ignored, because updating on fewer micro-batches would change the effective batch size.",
          "The example shows that summing makes the gradient four times too large with four accumulation steps.",
          "Such a mistake behaves like a learning rate four times too high, which can quietly destabilise training.",
          "Gradients are only zeroed after the optimizer step, not after every micro-batch.",
          "Forgetting to zero them makes gradients keep growing across updates, another classic bug.",
          "Clear, tested helpers prevent both mistakes."
        ],
        "example": "Averaging four thermometer readings gives the temperature; adding them gives a number four times too high.",
        "code": "micro = [[1.0, 2.0], [3.0, 2.0], [2.0, 4.0], [2.0, 0.0]]\nsummed = [sum(v) for v in zip(*micro)]\naveraged = [sum(v) / len(micro) for v in zip(*micro)]\nprint(\"wrong (sum):     \", summed)\nprint(\"right (average): \", averaged)",
        "output": "wrong (sum):      [8.0, 8.0]\nright (average):  [2.0, 2.0]",
        "codeNotes": [
          {
            "line": 3,
            "note": "Average across micro-batches."
          }
        ],
        "tryIt": "If you divided each loss by accumulation steps before backward, would you then sum or average the gradients?",
        "check": {
          "question": "Why is an incomplete final group ignored?",
          "options": [
            "To save memory",
            "An update on fewer micro-batches would change the effective batch",
            "Python requires it"
          ],
          "answer": 1,
          "why": "Every update should use the same batch size."
        }
      },
      {
        "title": "The effective batch size",
        "say": [
          "With data parallelism and accumulation together, the effective (global) batch = micro-batch × accumulation steps × number of GPUs.",
          "For example, micro-batch 8, 8 accumulation steps and 16 GPUs give 1024 examples per update.",
          "Practice 2 is accum_steps_needed(target_batch, micro_batch, gpus), which finds the accumulation steps for an exact target.",
          "If the target is not divisible by micro-batch × GPUs, no whole number of steps can reach it, so the function raises ValueError.",
          "The example prints the effective batch for several configurations.",
          "Changing any one of the three factors changes the effective batch, and possibly the right learning rate (Day 3).",
          "Keeping the effective batch fixed while changing the number of GPUs keeps training behaviour the same.",
          "This is exactly what elastic training relies on when GPUs fail (Day 18).",
          "Always log the effective batch size with every experiment; it is one of the most important numbers to compare runs.",
          "Language model batches are often counted in tokens: examples × sequence length."
        ],
        "example": "Total pages printed = pages per sheet × sheets per tray × number of printers.",
        "code": "configs = [(8, 8, 16), (4, 1, 128), (2, 128, 8), (16, 4, 64)]\nfor micro, accum, gpus in configs:\n    print(f\"micro {micro:2} x accum {accum:3} x gpus {gpus:3} = effective batch {micro * accum * gpus}\")",
        "output": "micro  8 x accum   8 x gpus  16 = effective batch 1024\nmicro  4 x accum   1 x gpus 128 = effective batch 512\nmicro  2 x accum 128 x gpus   8 = effective batch 2048\nmicro 16 x accum   4 x gpus  64 = effective batch 4096",
        "codeNotes": [
          {
            "line": 3,
            "note": "The three factors multiply."
          }
        ],
        "tryIt": "Which configuration would communicate least often per example processed?",
        "check": {
          "question": "What is the effective batch with micro-batch 4, 8 accumulation steps and 32 GPUs?",
          "options": [
            "44",
            "1024",
            "128"
          ],
          "answer": 1,
          "why": "4 × 8 × 32 = 1024."
        }
      },
      {
        "title": "Fewer all-reduces",
        "say": [
          "Accumulation has a second benefit: communication only needs to happen once per update, not once per micro-batch.",
          "In PyTorch DDP, the no_sync context manager skips the all-reduce on all but the last micro-batch.",
          "With 8 accumulation steps, gradient traffic per example falls by a factor of 8.",
          "This can make training much faster when the network is the bottleneck.",
          "The example compares the number of all-reduces with and without accumulation for the same data.",
          "The trade-off is a larger effective batch, which may need a tuned learning rate.",
          "Accumulation also slightly increases the time between updates, which rarely matters.",
          "Large runs routinely combine accumulation with overlapping communication (Day 21) for the best throughput.",
          "Profiling (Day 24) shows whether communication really is the bottleneck before you change the batch.",
          "Like most engineering choices, accumulation is a tool to use when measurements say it helps."
        ],
        "example": "Sending one full parcel a week instead of seven small ones: the same goods, fewer trips to the post office.",
        "code": "examples, micro, gpus = 1_000_000, 8, 16\nfor accum in [1, 4, 8, 16]:\n    updates = examples // (micro * gpus * accum)\n    print(f\"accum {accum:2}: {updates:5} updates, {updates:5} all-reduces for the same data\")",
        "output": "accum  1:  7812 updates,  7812 all-reduces for the same data\naccum  4:  1953 updates,  1953 all-reduces for the same data\naccum  8:   976 updates,   976 all-reduces for the same data\naccum 16:   488 updates,   488 all-reduces for the same data",
        "codeNotes": [
          {
            "line": 3,
            "note": "One all-reduce per optimizer update."
          }
        ],
        "tryIt": "If each all-reduce takes 40 ms, how much communication time does accumulation of 8 save?",
        "check": {
          "question": "What does DDP's no_sync do during accumulation?",
          "options": [
            "Stops training",
            "Skips the all-reduce on intermediate micro-batches",
            "Zeroes the gradients"
          ],
          "answer": 1,
          "why": "Communication only happens on the last micro-batch."
        }
      },
      {
        "title": "A full accumulation loop",
        "say": [
          "The example below trains the line from Day 2 with accumulation.",
          "Gradients are averaged over micro-batches and applied once per group.",
          "The result matches training with the full batch, which is the whole point.",
          "Notice that the gradient accumulator is reset only after each update.",
          "In real code, the same pattern appears as loss / accum_steps, backward, and an optimizer step every accum_steps iterations.",
          "Mixed precision (Day 7) and gradient clipping (Day 16) are applied at the update, after accumulation.",
          "Logging should also happen per update, so charts show the true number of optimizer steps.",
          "Schedulers step once per update too, which is easy to get wrong.",
          "Writing this loop yourself once makes every framework option understandable.",
          "Tomorrow looks at a way to make every one of these steps faster: 16-bit arithmetic."
        ],
        "example": "Collecting everyone's opinions on several pages before rewriting the plan once, instead of rewriting it after every page.",
        "code": "xs, ys = [0, 1, 2, 3, 4, 5, 6, 7], [1, 3, 5, 7, 9, 11, 13, 15]\nw = b = 0.0\nmicro, accum, lr = 2, 4, 0.02\nfor epoch in range(300):\n    gw = gb = 0.0\n    for m in range(accum):\n        idx = range(m * micro, (m + 1) * micro)\n        e = [(w * xs[i] + b - ys[i], xs[i]) for i in idx]\n        gw += sum(2 * err * x for err, x in e) / micro / accum\n        gb += sum(2 * err for err, _ in e) / micro / accum\n    w, b = w - lr * gw, b - lr * gb\nprint(f\"w={w:.3f} b={b:.3f} after 300 updates of batch {micro * accum}\")",
        "output": "w=2.004 b=0.982 after 300 updates of batch 8",
        "codeNotes": [
          {
            "line": 9,
            "note": "Divide by micro-batch size and by accumulation steps."
          },
          {
            "line": 11,
            "note": "One update per group of micro-batches."
          }
        ],
        "tryIt": "Change accum to 1 and micro to 8. Is the result the same? Why?",
        "check": {
          "question": "When should the scheduler step during accumulation?",
          "options": [
            "After every micro-batch",
            "Once per optimizer update",
            "Once per epoch only"
          ],
          "answer": 1,
          "why": "Schedules count optimizer updates."
        }
      },
      {
        "title": "Practice time: accumulation",
        "say": [
          "Practice 1: accumulate(micro_grads, accum_steps). Walk the list in groups of accum_steps and return the element-wise mean of each complete group, rounded to 4 decimals.",
          "The checks use five micro-batch gradients with accumulation of 1, 2, 3 and 6.",
          "Practice 2: accum_steps_needed(target_batch, micro_batch, gpus). Return target_batch ÷ (micro_batch × gpus), raising ValueError when it does not divide exactly or an argument is below 1.",
          "The checks include 1024 from 8 × 16, a case needing no accumulation, a small cluster needing 128 steps, and three bad inputs.",
          "After passing, plan three configurations for a global batch of 2048 on 8, 32 and 128 GPUs.",
          "The example prints such a plan.",
          "Tomorrow introduces mixed precision, which halves memory for weights and speeds up arithmetic.",
          "Accumulation, precision and sharding are the three tools engineers reach for first when memory runs out.",
          "Record the plan you choose along with its reasoning, as a team would in a design document.",
          "If a check fails, print the groups you formed before averaging."
        ],
        "example": "Planning a delivery route: the same number of parcels, split into trips that fit the van.",
        "code": "target, micro = 2048, 4\nfor gpus in [8, 32, 128]:\n    per_step = micro * gpus\n    if target % per_step == 0:\n        print(f\"{gpus:3} GPUs: accumulate {target // per_step:3} micro-batches per update\")\n    else:\n        print(f\"{gpus:3} GPUs: cannot reach {target} exactly\")",
        "output": "  8 GPUs: accumulate  64 micro-batches per update\n 32 GPUs: accumulate  16 micro-batches per update\n128 GPUs: accumulate   4 micro-batches per update",
        "codeNotes": [
          {
            "line": 4,
            "note": "Only exact multiples work."
          }
        ],
        "tryIt": "What happens with 24 GPUs? Which setting would you change?",
        "check": {
          "question": "accum_steps_needed(1000, 8, 16) should...",
          "options": [
            "Return 7",
            "Raise ValueError",
            "Return 8"
          ],
          "answer": 1,
          "why": "1000 is not a multiple of 128."
        }
      }
    ],
    "summary": [
      "Accumulation runs several micro-batches before one update.",
      "Average micro-batch gradients; summing inflates the step.",
      "Effective batch = micro-batch × accumulation steps × GPUs.",
      "Accumulation reduces all-reduces per example (no_sync).",
      "Step schedulers and logs once per update."
    ],
    "projectStep": {
      "title": "Training planner, part 6",
      "steps": [
        "Implement accumulate and accum_steps_needed.",
        "Train the line with accumulation and compare to full-batch training.",
        "Add an accumulation planner to your tool."
      ]
    }
  },
  {
    "day": 7,
    "title": "Mixed Precision: FP16, BF16 and Loss Scaling",
    "goal": "You can explain FP32, FP16 and BF16, detect overflow and underflow in FP16, and implement dynamic loss scaling that keeps mixed-precision training stable.",
    "minutes": 30,
    "recap": "Accumulation saved memory by using smaller pieces. Mixed precision saves memory and time in a different way: by storing and computing most numbers in 16 bits instead of 32.",
    "parts": [
      {
        "title": "Floating-point formats",
        "say": [
          "FP32 uses 32 bits: 1 sign bit, 8 exponent bits and 23 fraction bits, giving a huge range and about 7 decimal digits of precision.",
          "FP16 uses 16 bits: 5 exponent bits and 10 fraction bits, so its range is tiny by comparison, from about 6e-8 to 65504.",
          "BF16, the brain floating-point format from Google, keeps FP32's 8 exponent bits with only 7 fraction bits.",
          "BF16 therefore has the same range as FP32 but less precision, which suits training remarkably well.",
          "Modern GPUs process 16-bit numbers several times faster than 32-bit ones using tensor cores.",
          "The example uses Python's struct module to round numbers to FP16 and shows what survives.",
          "Numbers above 65504 cannot be stored in FP16 at all; struct raises an OverflowError.",
          "Tiny numbers, below about 6e-8, become zero, which is called underflow.",
          "Mixed precision keeps a master copy of weights in FP32 while doing most arithmetic in 16 bits.",
          "Choosing between FP16 and BF16 depends on hardware: newer GPUs and TPUs support BF16 natively."
        ],
        "example": "Writing measurements with fewer digits: fine for most things, but tiny amounts round to zero and huge ones do not fit on the form.",
        "code": "import struct\n\ndef to_fp16(x):\n    return struct.unpack(\"e\", struct.pack(\"e\", x))[0]\n\nfor x in [3.14159265, 0.1, 1e-5, 1e-8, 65504.0]:\n    print(f\"{x!r:>12} -> {to_fp16(x)!r}\")\ntry:\n    to_fp16(70000.0)\nexcept OverflowError as err:\n    print(\"70000.0 -> OverflowError:\", err)",
        "output": "  3.14159265 -> 3.140625\n         0.1 -> 0.0999755859375\n       1e-05 -> 1.0013580322265625e-05\n       1e-08 -> 0.0\n     65504.0 -> 65504.0\n70000.0 -> OverflowError: float too large to pack with e format",
        "codeNotes": [
          {
            "line": 4,
            "note": "Pack into 16 bits and unpack again."
          },
          {
            "line": 9,
            "note": "Too big for FP16."
          }
        ],
        "tryIt": "Why does 1e-8 become 0.0 while 1e-5 survives, only less exactly?",
        "check": {
          "question": "What does BF16 keep from FP32?",
          "options": [
            "The precision",
            "The exponent range",
            "The size in bytes"
          ],
          "answer": 1,
          "why": "BF16 has 8 exponent bits, like FP32."
        }
      },
      {
        "title": "Overflow and underflow",
        "say": [
          "In FP16, any magnitude above 65504 overflows to infinity, and any non-zero magnitude below 2 to the power −24 (about 5.96e-8) underflows to zero.",
          "Gradients in deep networks are often very small, so many would underflow and training would silently stop learning.",
          "Activations or losses can occasionally be large enough to overflow, producing infinities and then NaNs.",
          "Practice 1 is fp16_status(x), which returns OVERFLOW, UNDERFLOW or OK using these thresholds.",
          "Zero is a perfectly normal value and should be reported as OK.",
          "The example checks a list of typical gradient and activation values.",
          "BF16 almost never overflows or underflows, which is why many teams prefer it and skip loss scaling.",
          "Checking values against ranges is a quick diagnostic when a mixed-precision run starts producing NaNs.",
          "Libraries also offer functions such as torch.isfinite to check whole tensors at once.",
          "Knowing the thresholds by heart helps you read error messages about infinite gradients."
        ],
        "example": "A ruler marked only in centimetres cannot measure a hair's width, and a ruler one metre long cannot measure a house.",
        "code": "def status(x):\n    if abs(x) > 65504:\n        return \"OVERFLOW\"\n    if x != 0 and abs(x) < 2 ** -24:\n        return \"UNDERFLOW\"\n    return \"OK\"\n\nfor value in [0.02, 3e-6, 4e-9, 0.0, 12000.0, 1.2e5]:\n    print(f\"{value:>10} {status(value)}\")",
        "output": "      0.02 OK\n     3e-06 OK\n     4e-09 UNDERFLOW\n       0.0 OK\n   12000.0 OK\n  120000.0 OVERFLOW",
        "codeNotes": [
          {
            "line": 4,
            "note": "Non-zero and smaller than the smallest FP16 number."
          }
        ],
        "tryIt": "Which of these values would still be fine in BF16?",
        "check": {
          "question": "What happens to a gradient of 1e-9 stored in FP16?",
          "options": [
            "It is stored exactly",
            "It underflows to zero",
            "It overflows"
          ],
          "answer": 1,
          "why": "It is below about 6e-8."
        }
      },
      {
        "title": "Loss scaling",
        "say": [
          "Loss scaling rescues small gradients: multiply the loss by a large factor, such as 65536, before the backward pass.",
          "Because gradients are proportional to the loss, every gradient is multiplied by the same factor and moves out of the underflow zone.",
          "Before the optimizer step, the gradients are divided by the same factor, so the update is unchanged.",
          "The example shows a small gradient that underflows in FP16, and the same gradient surviving after scaling.",
          "The scaled value is stored in 16 bits, then unscaled in 32 bits for the update.",
          "If the scale is too large, some gradients overflow instead, producing infinities.",
          "So the scale must be large enough to lift small gradients and small enough to avoid overflow.",
          "That balance changes during training, which is why a dynamic scale works best.",
          "PyTorch implements this in torch.cuda.amp.GradScaler.",
          "Loss scaling is not needed with BF16, which is another reason for its popularity."
        ],
        "example": "Photographing a faint star with a long exposure, then dimming the picture afterwards so it looks right.",
        "code": "import struct\n\ndef fp16(x):\n    return struct.unpack(\"e\", struct.pack(\"e\", x))[0]\n\ngrad = 2e-8\nscale = 65536.0\nprint(\"unscaled in fp16:\", fp16(grad))\nstored = fp16(grad * scale)\nprint(\"scaled in fp16:  \", stored)\nprint(\"recovered:       \", f\"{stored / scale:.3e}\")",
        "output": "unscaled in fp16: 0.0\nscaled in fp16:   0.0013103485107421875\nrecovered:        1.999e-08",
        "codeNotes": [
          {
            "line": 9,
            "note": "Scale up, then store in 16 bits."
          },
          {
            "line": 11,
            "note": "Divide by the scale again before updating."
          }
        ],
        "tryIt": "What would happen with a scale of 2**40 on a gradient of 1e-3?",
        "check": {
          "question": "Why multiply the loss by a scale factor?",
          "options": [
            "To speed up training",
            "To lift small gradients out of the FP16 underflow range",
            "To reduce memory"
          ],
          "answer": 1,
          "why": "Scaling the loss scales every gradient."
        }
      },
      {
        "title": "Dynamic loss scaling",
        "say": [
          "Dynamic loss scaling adjusts the scale automatically.",
          "After each backward pass, check the gradients for infinities or NaNs.",
          "If any are found, skip that optimizer step, halve the scale and try the next batch.",
          "If a long run of steps, typically 2000, has no overflow, double the scale to rescue even smaller gradients.",
          "Practice 2 is the LossScaler class with an update(found_overflow) method that returns whether to apply the step.",
          "The scale should never drop below 1.0, which would amplify problems rather than solve them.",
          "The example runs a short sequence of steps with overflows and shows how the scale reacts.",
          "Skipped steps are normal early in training; many skips in a row signal a deeper problem such as a too-high learning rate.",
          "With data parallelism, all ranks must agree on skipping, so overflow flags are combined with a max all-reduce (Day 5).",
          "Logging the scale over time is a useful health check for mixed-precision runs."
        ],
        "example": "A thermostat that lowers the heating when the room overheats and slowly raises it again while it stays comfortable.",
        "code": "scale, good, interval = 1024.0, 0, 3\nevents = [False, True, False, False, False, False, True]\nfor step, overflow in enumerate(events, 1):\n    if overflow:\n        scale, good, applied = max(1.0, scale / 2), 0, False\n    else:\n        good += 1\n        applied = True\n        if good >= interval:\n            scale, good = scale * 2, 0\n    print(f\"step {step}: overflow={overflow!s:5} applied={applied!s:5} scale={scale}\")",
        "output": "step 1: overflow=False applied=True  scale=1024.0\nstep 2: overflow=True  applied=False scale=512.0\nstep 3: overflow=False applied=True  scale=512.0\nstep 4: overflow=False applied=True  scale=512.0\nstep 5: overflow=False applied=True  scale=1024.0\nstep 6: overflow=False applied=True  scale=1024.0\nstep 7: overflow=True  applied=False scale=512.0",
        "codeNotes": [
          {
            "line": 5,
            "note": "Back off and skip the step."
          },
          {
            "line": 9,
            "note": "Grow after a run of good steps."
          }
        ],
        "tryIt": "Why reset the good-step counter after an overflow?",
        "check": {
          "question": "What does dynamic loss scaling do after an overflow?",
          "options": [
            "Doubles the scale",
            "Halves the scale and skips the step",
            "Stops training"
          ],
          "answer": 1,
          "why": "Back off, skip and continue."
        }
      },
      {
        "title": "Mixed precision in practice",
        "say": [
          "A mixed-precision step: cast weights to 16 bits, run forward and backward in 16 bits, unscale gradients, update the FP32 master weights.",
          "Some operations, such as softmax, layer normalisation and loss computation, are kept in FP32 for accuracy.",
          "Frameworks handle these choices with automatic mixed precision (AMP), which keeps lists of safe and unsafe operations.",
          "The speed-up is often two to three times on modern GPUs, and activation memory roughly halves.",
          "The master weights mean memory for the model states actually grows slightly, as Day 8 will show.",
          "The example lists which parts of a step use which precision.",
          "Newer hardware also supports FP8 for some operations, pushing the same ideas further.",
          "Whatever the format, the principle stays: fast low precision for bulk arithmetic, high precision where accuracy matters.",
          "Mixed precision is on by default in most modern training recipes.",
          "When results differ slightly between FP32 and mixed precision, that is expected, as long as the loss curves match closely."
        ],
        "example": "Doing rough sums on a notepad but keeping the official accounts in a careful ledger.",
        "code": "plan = [(\"master weights\", \"fp32\"), (\"weights used in forward/backward\", \"bf16 or fp16\"),\n        (\"matrix multiplications\", \"bf16 or fp16\"), (\"softmax and layer norm\", \"fp32\"),\n        (\"loss\", \"fp32\"), (\"optimizer moments\", \"fp32\")]\nfor item, precision in plan:\n    print(f\"{item:34} {precision}\")",
        "output": "master weights                     fp32\nweights used in forward/backward   bf16 or fp16\nmatrix multiplications             bf16 or fp16\nsoftmax and layer norm             fp32\nloss                               fp32\noptimizer moments                  fp32",
        "codeNotes": [
          {
            "line": 1,
            "note": "The master copy stays in full precision."
          }
        ],
        "tryIt": "Why keep the optimizer moments in FP32?",
        "check": {
          "question": "What is kept in FP32 in mixed-precision training?",
          "options": [
            "Everything",
            "Master weights and sensitive operations",
            "Nothing"
          ],
          "answer": 1,
          "why": "Bulk maths in 16 bits, sensitive parts in 32."
        }
      },
      {
        "title": "Practice time: precision",
        "say": [
          "Practice 1: fp16_status(x). Return OVERFLOW if abs(x) > 65504, UNDERFLOW if x is non-zero and abs(x) < 2**-24, otherwise OK.",
          "The checks include the largest FP16 value 65504, which is OK, negative overflow, a tiny gradient, zero and a value just above the smallest subnormal.",
          "Practice 2: LossScaler(scale=65536.0, growth_interval=2000) with update(found_overflow). Halve (never below 1.0) and return False on overflow; otherwise count, double at the interval, and return True.",
          "The checks follow a scale through overflows and growth, test the floor of 1.0 and the default scale.",
          "After passing, simulate a thousand steps with random overflows and plot or print the scale.",
          "The example does exactly that with a fixed random seed.",
          "Tomorrow counts every byte a training run needs, so you can predict whether a model fits.",
          "Precision choices affect memory, speed and stability all at once.",
          "Most modern teams choose BF16 when the hardware supports it.",
          "If your scaler test fails, print the scale and counter after each call."
        ],
        "example": "A pilot trimming the aircraft: small, constant corrections keep the flight smooth.",
        "code": "import random\n\nrng = random.Random(7)\nscale, good = 65536.0, 0\nskipped = 0\nfor step in range(1000):\n    if rng.random() < 0.01:\n        scale, good = max(1.0, scale / 2), 0\n        skipped += 1\n    else:\n        good += 1\n        if good >= 200:\n            scale, good = scale * 2, 0\nprint(f\"skipped {skipped} of 1000 steps, final scale {scale}\")",
        "output": "skipped 12 of 1000 steps, final scale 16.0",
        "codeNotes": [
          {
            "line": 7,
            "note": "About 1% of steps overflow in this simulation."
          }
        ],
        "tryIt": "Change the overflow rate to 5%. What happens to the scale and the skipped steps?",
        "check": {
          "question": "What is fp16_status(65504)?",
          "options": [
            "OVERFLOW",
            "OK",
            "UNDERFLOW"
          ],
          "answer": 1,
          "why": "65504 is the largest FP16 value."
        }
      }
    ],
    "summary": [
      "FP16: small range (to 65504), BF16: FP32 range with less precision.",
      "Small FP16 gradients underflow to zero; large values overflow.",
      "Loss scaling lifts gradients; unscale before updating.",
      "Dynamic scaling halves on overflow and grows after stable runs.",
      "Mixed precision: 16-bit bulk maths, FP32 master weights and sensitive ops."
    ],
    "projectStep": {
      "title": "Training planner, part 7",
      "steps": [
        "Implement fp16_status and LossScaler.",
        "Simulate a run with occasional overflows and record the scale.",
        "Note in your planner which precision you would choose and why."
      ]
    }
  },
  {
    "day": 8,
    "title": "Memory Accounting: Parameters, Gradients, Optimizer States and Activations",
    "goal": "You can count the memory for parameters, gradients and optimizer states under different setups, estimate activation memory, and decide whether a training run fits on a GPU.",
    "minutes": 30,
    "recap": "Mixed precision changed the size of numbers. Today we add up every byte a training step needs, which tells us exactly when one GPU is not enough.",
    "parts": [
      {
        "title": "Where training memory goes",
        "say": [
          "Training memory has four main parts: parameters, gradients, optimizer states and activations.",
          "Parameters are the model weights; gradients have one value per parameter; optimizer states depend on the optimizer.",
          "Adam keeps two extra values per parameter: a running mean of gradients and a running mean of squared gradients.",
          "Activations are the intermediate results saved during the forward pass for use in the backward pass.",
          "There is also temporary working memory and fragmentation, often 5 to 20 percent extra.",
          "The example breaks down the memory for mixed-precision Adam on a 7B model.",
          "Together, parameters, gradients and optimizer states are called model states.",
          "Model states depend only on the number of parameters; activations also depend on batch size and sequence length.",
          "This split matters because different techniques shrink different parts.",
          "ZeRO shrinks model states (Day 9), and checkpointing shrinks activations (Day 13)."
        ],
        "example": "Packing for a trip: clothes (weights), notes about what to change (gradients), a diary of past trips (optimizer states) and souvenirs collected along the way (activations).",
        "code": "params = 7e9\nparts = [(\"fp16 weights\", 2), (\"fp16 gradients\", 2), (\"fp32 master weights\", 4),\n         (\"fp32 Adam first moment\", 4), (\"fp32 Adam second moment\", 4)]\ntotal = 0\nfor name, b in parts:\n    total += b\n    print(f\"{name:24} {b:2} bytes/param -> {params * b / 1e9:6.1f} GB\")\nprint(f\"{'model states':24} {total:2} bytes/param -> {params * total / 1e9:6.1f} GB\")",
        "output": "fp16 weights              2 bytes/param ->   14.0 GB\nfp16 gradients            2 bytes/param ->   14.0 GB\nfp32 master weights       4 bytes/param ->   28.0 GB\nfp32 Adam first moment    4 bytes/param ->   28.0 GB\nfp32 Adam second moment   4 bytes/param ->   28.0 GB\nmodel states             16 bytes/param ->  112.0 GB",
        "codeNotes": [
          {
            "line": 3,
            "note": "Adam keeps two extra FP32 values per parameter."
          }
        ],
        "tryIt": "Which single part is largest in total, and what does that suggest about where to save memory?",
        "check": {
          "question": "How many bytes per parameter does mixed-precision Adam need for model states?",
          "options": [
            "4",
            "16",
            "2"
          ],
          "answer": 1,
          "why": "2 + 2 + 4 + 4 + 4 = 16."
        }
      },
      {
        "title": "Comparing setups",
        "say": [
          "Different optimizers and precisions need different numbers of bytes per parameter.",
          "FP32 Adam: 4 bytes weights, 4 bytes gradients and 8 bytes for the two moments, 16 in total.",
          "FP32 SGD with momentum: 4 + 4 + 4 = 12 bytes.",
          "Inference in FP16 needs only the weights: 2 bytes.",
          "Practice 1 is training_memory_gb(params, setup), which uses a table of these values.",
          "The example compares all four setups for a 1.3B model.",
          "The eight-fold gap between inference and training explains why you can run a model you could never train on the same GPU.",
          "Memory-saving optimizers, such as 8-bit Adam or Adafactor, reduce optimizer states further.",
          "Parameter-efficient fine-tuning (Day 26) avoids most optimizer states by training only a few parameters.",
          "Always state which setup you assume when you quote a memory figure."
        ],
        "example": "Different luggage allowances: a day trip needs a small bag, a month-long expedition needs several suitcases.",
        "code": "SETUPS = {\"adam_mixed\": 16, \"adam_fp32\": 16, \"sgd_momentum_fp32\": 12, \"inference_fp16\": 2}\nparams = 1.3e9\nfor setup, b in SETUPS.items():\n    print(f\"{setup:18} {params * b / 1e9:6.1f} GB\")",
        "output": "adam_mixed           20.8 GB\nadam_fp32            20.8 GB\nsgd_momentum_fp32    15.6 GB\ninference_fp16        2.6 GB",
        "codeNotes": [
          {
            "line": 1,
            "note": "Bytes per parameter for each setup."
          }
        ],
        "tryIt": "Why does mixed-precision Adam need as much memory for model states as FP32 Adam?",
        "check": {
          "question": "How much memory does FP16 inference of a 1.3B model need for weights?",
          "options": [
            "1.3 GB",
            "2.6 GB",
            "20.8 GB"
          ],
          "answer": 1,
          "why": "1.3 billion × 2 bytes."
        }
      },
      {
        "title": "Activation memory",
        "say": [
          "Activations grow with batch size, sequence length, hidden size and number of layers.",
          "A common rough estimate for a transformer with 16-bit activations is batch × sequence × hidden × layers × 34 bytes, ignoring attention scores.",
          "Longer sequences also add attention memory that grows with the square of the sequence length, unless memory-efficient attention is used.",
          "For large batches and long sequences, activations can exceed model states.",
          "The example estimates activation memory for a 1.3B-sized model at several batch sizes.",
          "Doubling the batch doubles activation memory, which is why micro-batches must stay small (Day 6).",
          "Activation checkpointing trades extra compute for much less activation memory (Day 13).",
          "Flash attention and similar kernels avoid storing the full attention matrix.",
          "These estimates are approximate; profilers give exact numbers, but estimates guide design choices.",
          "Using rough formulas consistently is more useful than guessing."
        ],
        "example": "Notes taken during a lecture: more students, longer lectures and more detailed notes all mean more paper.",
        "code": "seq, hidden, layers = 2048, 2048, 24\nfor batch in [1, 4, 8, 16]:\n    gb = batch * seq * hidden * layers * 34 / 1e9\n    print(f\"batch {batch:2}: activations about {gb:5.1f} GB\")",
        "output": "batch  1: activations about   3.4 GB\nbatch  4: activations about  13.7 GB\nbatch  8: activations about  27.4 GB\nbatch 16: activations about  54.8 GB",
        "codeNotes": [
          {
            "line": 3,
            "note": "The rough 34 bytes per element estimate."
          }
        ],
        "tryIt": "At which batch size do activations exceed the 20.8 GB of model states for this 1.3B model?",
        "check": {
          "question": "What happens to activation memory when the sequence length doubles (ignoring attention)?",
          "options": [
            "It stays the same",
            "It roughly doubles",
            "It halves"
          ],
          "answer": 1,
          "why": "The estimate is proportional to sequence length."
        }
      },
      {
        "title": "Does it fit?",
        "say": [
          "To decide whether a run fits, add model states and activations and compare with GPU memory.",
          "Practice 2 is fits_on_gpu(params, batch, seq_len, hidden, layers, gpu_gb), which returns both parts, the total and a yes or no answer.",
          "The example checks a 1.3B model and a 7B model on an 80 GB GPU.",
          "The 1.3B model fits with room to spare; the 7B model does not even fit its model states.",
          "When a run does not fit, the options are: smaller micro-batch, checkpointing, lower precision, or sharding across GPUs.",
          "Leave headroom: running at 99 percent of memory often fails due to fragmentation.",
          "Out-of-memory errors, often printed as CUDA out of memory, are the most common first failure in any new training setup.",
          "Estimating first saves many failed launches, each of which may take minutes to reach the failing step.",
          "The 16 bytes per parameter rule says a single 80 GB GPU can train at most about 5 billion parameters with plain Adam.",
          "Tomorrow shows how ZeRO pushes far beyond that by sharing the load across GPUs."
        ],
        "example": "Checking whether furniture fits through the door before carrying it up three flights of stairs.",
        "code": "def fits(params, batch, seq, hidden, layers, gpu_gb):\n    states = round(16 * params / 1e9, 1)\n    acts = round(batch * seq * hidden * layers * 34 / 1e9, 1)\n    total = round(states + acts, 1)\n    return states, acts, total, total <= gpu_gb\n\nfor name, args in [(\"1.3B\", (1.3e9, 8, 2048, 2048, 24, 80)), (\"7B\", (7e9, 8, 4096, 4096, 32, 80))]:\n    s, a, t, ok = fits(*args)\n    print(f\"{name}: states {s} GB + activations {a} GB = {t} GB -> fits: {ok}\")",
        "output": "1.3B: states 20.8 GB + activations 27.4 GB = 48.2 GB -> fits: True\n7B: states 112.0 GB + activations 146.0 GB = 258.0 GB -> fits: False",
        "codeNotes": [
          {
            "line": 2,
            "note": "16 bytes per parameter."
          },
          {
            "line": 5,
            "note": "Compare the rounded total with GPU memory."
          }
        ],
        "tryIt": "What is the largest batch at which the 1.3B model still fits on an 80 GB GPU?",
        "check": {
          "question": "A 7B model with mixed-precision Adam needs about how much memory for model states alone?",
          "options": [
            "14 GB",
            "112 GB",
            "28 GB"
          ],
          "answer": 1,
          "why": "7 billion × 16 bytes."
        }
      },
      {
        "title": "Reading memory reports",
        "say": [
          "Frameworks report several memory figures: allocated, reserved (cached) and peak.",
          "Allocated memory is what tensors are using now; reserved memory is what the allocator has claimed from the GPU.",
          "Peak memory during a step decides whether it fits, so always look at the peak.",
          "Memory usually peaks during the backward pass, when activations and gradients coexist.",
          "The example simulates memory over one training step and prints the peak.",
          "Comparing measured peaks with your estimates reveals hidden costs, such as temporary buffers.",
          "In PyTorch, torch.cuda.max_memory_allocated reports the peak since the last reset.",
          "Good engineers keep a small table of measured memory for each model size and batch, so future plans start from real data.",
          "Memory snapshots can show exactly which tensors used the memory.",
          "Understanding the timeline explains why freeing activations as soon as possible matters."
        ],
        "example": "A water tank's highest level during a storm decides whether it overflows, not its average level.",
        "code": "timeline = [(\"load model states\", 20.8), (\"forward: activations grow\", 27.4), (\"backward starts\", 5.0),\n            (\"activations freed as used\", -20.0), (\"optimizer step\", 2.0), (\"clear gradients\", -5.0)]\nused = peak = 0.0\nfor event, delta in timeline:\n    used += delta\n    peak = max(peak, used)\n    print(f\"{event:28} used {used:5.1f} GB\")\nprint(f\"peak: {peak:.1f} GB\")",
        "output": "load model states            used  20.8 GB\nforward: activations grow    used  48.2 GB\nbackward starts              used  53.2 GB\nactivations freed as used    used  33.2 GB\noptimizer step               used  35.2 GB\nclear gradients              used  30.2 GB\npeak: 53.2 GB",
        "codeNotes": [
          {
            "line": 6,
            "note": "Track the highest level reached."
          }
        ],
        "tryIt": "Where in the step does the peak occur, and why?",
        "check": {
          "question": "Which memory figure decides whether a step fits?",
          "options": [
            "The average",
            "The peak",
            "The reserved amount at start"
          ],
          "answer": 1,
          "why": "The step fails if the peak does not fit."
        }
      },
      {
        "title": "Practice time: memory accounting",
        "say": [
          "Practice 1: training_memory_gb(params, setup). Use bytes per parameter of 16, 16, 12 and 2 for adam_mixed, adam_fp32, sgd_momentum_fp32 and inference_fp16, return GB rounded to 1 decimal, and raise ValueError for unknown setups.",
          "The checks include a 7B model in training and inference, SGD on 1.5B and a small FP32 Adam model.",
          "Practice 2: fits_on_gpu(params, batch, seq_len, hidden, layers, gpu_gb). Return states, activations and total, each rounded to 1 decimal, and whether the rounded total is at most gpu_gb.",
          "The checks include a 1.3B model that fits, a 7B model that does not, and a small model.",
          "After passing, find the largest model your favourite GPU could train with plain Adam at batch 1.",
          "The example searches for that limit.",
          "Tomorrow introduces ZeRO, which splits model states across data-parallel GPUs.",
          "Memory accounting is the foundation of every distributed training decision.",
          "Being able to explain these numbers in an interview is a strong signal of real experience.",
          "If fits_on_gpu disagrees with the check, compare your rounded parts one by one."
        ],
        "example": "Doing the maths on a moving van before booking it, instead of discovering on moving day that it is too small.",
        "code": "gpu_gb, batch, seq, layers = 80, 1, 2048, 24\nfor billions in [1, 2, 3, 4, 5]:\n    params = billions * 1e9\n    hidden = 2048 if billions < 3 else 3072\n    total = 16 * params / 1e9 + batch * seq * hidden * layers * 34 / 1e9\n    print(f\"{billions}B: {total:5.1f} GB -> {'fits' if total <= gpu_gb else 'too big'}\")",
        "output": "1B:  19.4 GB -> fits\n2B:  35.4 GB -> fits\n3B:  53.1 GB -> fits\n4B:  69.1 GB -> fits\n5B:  85.1 GB -> too big",
        "codeNotes": [
          {
            "line": 5,
            "note": "Model states plus activations."
          }
        ],
        "tryIt": "Which change would let the 5B model fit: smaller batch, checkpointing or sharding?",
        "check": {
          "question": "training_memory_gb(7e9, \"inference_fp16\") returns?",
          "options": [
            "112.0",
            "14.0",
            "7.0"
          ],
          "answer": 1,
          "why": "7 billion × 2 bytes = 14 GB."
        }
      }
    ],
    "summary": [
      "Model states: parameters, gradients and optimizer states.",
      "Mixed-precision Adam needs 16 bytes per parameter.",
      "Activations grow with batch, sequence, hidden size and layers.",
      "Compare peak memory (states + activations) with GPU memory.",
      "One 80 GB GPU trains at most about 5B parameters with plain Adam."
    ],
    "projectStep": {
      "title": "Training planner, part 8",
      "steps": [
        "Implement training_memory_gb and fits_on_gpu.",
        "Build a table of what fits for several models and batches.",
        "Note which technique you would use for each case that does not fit."
      ]
    }
  },
  {
    "day": 9,
    "title": "ZeRO Stages 1-3: Sharding Optimizer States, Gradients and Parameters",
    "goal": "You can explain ZeRO stages 1, 2 and 3, compute memory per GPU for each stage, find the largest model a cluster can train, and describe the communication cost of each stage.",
    "minutes": 30,
    "recap": "Yesterday showed that model states dominate memory and that plain data parallelism stores them on every GPU. ZeRO removes that duplication.",
    "parts": [
      {
        "title": "The redundancy problem",
        "say": [
          "In plain data parallelism, every GPU keeps an identical full copy of parameters, gradients and optimizer states.",
          "With 64 GPUs, that means 64 copies of the same numbers.",
          "ZeRO, the Zero Redundancy Optimizer from Microsoft's DeepSpeed team, removes this duplication by sharding.",
          "Sharding means splitting a set of values into pieces and giving each GPU one piece.",
          "Each GPU then owns and updates only its piece, and pieces are gathered or combined when needed.",
          "The example shows how much memory is wasted on copies for a 7.5B model on 64 GPUs.",
          "ZeRO keeps the simplicity of data parallelism, with every GPU processing different data, while cutting memory dramatically.",
          "It comes in three stages, each sharding more of the model states.",
          "PyTorch's FSDP (Day 10) implements the same ideas as ZeRO stage 3.",
          "The ZeRO paper by Rajbhandari and colleagues (2020) showed training of models with over 100 billion parameters this way."
        ],
        "example": "A study group where everyone owns a full copy of every textbook, compared with each person owning a few books and lending them when needed.",
        "code": "params, gpus = 7.5e9, 64\nper_gpu = 16 * params / 1e9\ncluster_total = per_gpu * gpus\nunique = 16 * params / 1e9\nprint(f\"each GPU holds {per_gpu:.0f} GB of model states\")\nprint(f\"cluster holds {cluster_total:.0f} GB, of which only {unique:.0f} GB is unique\")",
        "output": "each GPU holds 120 GB of model states\ncluster holds 7680 GB, of which only 120 GB is unique",
        "codeNotes": [
          {
            "line": 3,
            "note": "The same states copied onto every GPU."
          }
        ],
        "tryIt": "What fraction of the cluster's model-state memory is duplicated?",
        "check": {
          "question": "What does ZeRO remove?",
          "options": [
            "Data",
            "Duplicated model states across data-parallel GPUs",
            "The optimizer"
          ],
          "answer": 1,
          "why": "It shards states instead of copying them."
        }
      },
      {
        "title": "Stage 1: shard the optimizer states",
        "say": [
          "Optimizer states are 12 of the 16 bytes per parameter in mixed-precision Adam.",
          "ZeRO stage 1 shards only these: each of N GPUs keeps the FP32 master weights and Adam moments for 1/N of the parameters.",
          "Memory per GPU becomes 4Ψ + 12Ψ/N bytes, where Ψ is the number of parameters.",
          "After the gradients are averaged, each GPU updates its own slice, then the updated 16-bit weights are all-gathered so everyone has the full model again.",
          "The communication volume is about the same as plain data parallelism.",
          "The example computes stage 1 memory for a 7.5B model as the number of GPUs grows.",
          "With 64 GPUs, memory drops from 120 GB to about 31 GB per GPU.",
          "Stage 1 is a nearly free improvement, which is why it is widely used.",
          "Beyond a certain number of GPUs, the 4Ψ part (weights and gradients) dominates and more GPUs help little.",
          "That remaining 4Ψ is what stages 2 and 3 attack."
        ],
        "example": "Friends sharing the job of keeping detailed notes: each keeps notes on a few chapters, but everyone still owns the textbook.",
        "code": "params = 7.5e9\nfor gpus in [1, 8, 64, 512]:\n    per_gpu = (4 * params + 12 * params / gpus) / 1e9\n    print(f\"{gpus:3} GPUs: stage 1 needs {per_gpu:6.1f} GB per GPU\")",
        "output": "  1 GPUs: stage 1 needs  120.0 GB per GPU\n  8 GPUs: stage 1 needs   41.2 GB per GPU\n 64 GPUs: stage 1 needs   31.4 GB per GPU\n512 GPUs: stage 1 needs   30.2 GB per GPU",
        "codeNotes": [
          {
            "line": 3,
            "note": "Weights and gradients in full, optimizer states sharded."
          }
        ],
        "tryIt": "What limit does the per-GPU memory approach as GPUs grow very large?",
        "check": {
          "question": "Which part of model states does ZeRO stage 1 shard?",
          "options": [
            "Weights",
            "Optimizer states",
            "Activations"
          ],
          "answer": 1,
          "why": "Stage 1 shards optimizer states only."
        }
      },
      {
        "title": "Stages 2 and 3",
        "say": [
          "ZeRO stage 2 also shards gradients: each GPU keeps only the gradients for the parameters it updates.",
          "Instead of an all-reduce, gradients are combined with a reduce-scatter, so each GPU receives just its averaged slice.",
          "Memory per GPU becomes 2Ψ + 14Ψ/N bytes, with the same communication volume as data parallelism.",
          "ZeRO stage 3 shards the parameters too: memory per GPU becomes 16Ψ/N bytes.",
          "In stage 3, the full weights of each layer are all-gathered just before they are needed and freed afterwards.",
          "This adds about 50 percent more communication than plain data parallelism, because parameters are gathered in both the forward and the backward pass.",
          "Practice 1 is zero_memory_gb(params, gpus, stage), which applies the right formula for stages 0 to 3.",
          "The example prints all four stages for a 7.5B model on 64 GPUs, matching the numbers in the ZeRO paper.",
          "Stage 3 memory falls in direct proportion to the number of GPUs, which is what allows huge models.",
          "Choosing a stage is a balance between memory saved and extra communication."
        ],
        "example": "A library that not only shares the note-taking but also keeps each book on a different shelf, fetching it only while someone reads it.",
        "code": "params, gpus = 7.5e9, 64\nformulas = {0: 16 * params, 1: 4 * params + 12 * params / gpus,\n            2: 2 * params + 14 * params / gpus, 3: 16 * params / gpus}\nfor stage, b in formulas.items():\n    print(f\"stage {stage}: {b / 1e9:6.1f} GB per GPU\")",
        "output": "stage 0:  120.0 GB per GPU\nstage 1:   31.4 GB per GPU\nstage 2:   16.6 GB per GPU\nstage 3:    1.9 GB per GPU",
        "codeNotes": [
          {
            "line": 3,
            "note": "Stage 2 shards gradients too; stage 3 shards everything."
          }
        ],
        "tryIt": "Which stage would you choose if stage 1 already fits comfortably? Why?",
        "check": {
          "question": "How does stage 3 memory per GPU change when you double the GPUs?",
          "options": [
            "It stays the same",
            "It halves",
            "It doubles"
          ],
          "answer": 1,
          "why": "16Ψ/N halves when N doubles."
        }
      },
      {
        "title": "How big can we go?",
        "say": [
          "Turning the formulas around tells us the largest model that fits.",
          "Bytes per parameter per GPU are 16, 4 + 12/N, 2 + 14/N and 16/N for stages 0 to 3.",
          "Divide the available GPU memory by that figure to get the maximum parameters.",
          "Practice 2 is max_params_billion(gpu_gb, gpus, stage, reserve_gb), which rounds down to one decimal place of billions.",
          "Rounding down is deliberate: rounding up could suggest a model fits when it does not.",
          "The reserve leaves room for activations and working memory.",
          "The example prints the maximum model size for each stage on 64 GPUs with 80 GB each.",
          "With this reserve, stage 3 reaches hundreds of billions of parameters, while stage 0 stops below 4 billion.",
          "In practice, activations and communication limits usually reduce these numbers, but the ranking stays the same.",
          "This calculation is a quick first check when someone proposes training a particular model size."
        ],
        "example": "Working out the largest sofa that fits in a van, allowing a little space for the removal team.",
        "code": "import math\n\ngpu_gb, gpus, reserve = 80, 64, 20\nfor stage, per_param in enumerate([16, 4 + 12 / gpus, 2 + 14 / gpus, 16 / gpus]):\n    billions = (gpu_gb - reserve) / per_param\n    print(f\"stage {stage}: up to {math.floor(billions * 10) / 10} B parameters\")",
        "output": "stage 0: up to 3.7 B parameters\nstage 1: up to 14.3 B parameters\nstage 2: up to 27.0 B parameters\nstage 3: up to 240.0 B parameters",
        "codeNotes": [
          {
            "line": 5,
            "note": "GB available divided by bytes per parameter gives billions of parameters."
          },
          {
            "line": 6,
            "note": "Round down to be safe."
          }
        ],
        "tryIt": "How many GPUs would stage 3 need to train a 500B model with this reserve?",
        "check": {
          "question": "Why round the maximum model size down?",
          "options": [
            "It looks tidier",
            "Rounding up could suggest a model fits when it does not",
            "Python requires it"
          ],
          "answer": 1,
          "why": "Safe estimates round down."
        }
      },
      {
        "title": "Communication and offloading",
        "say": [
          "Stages 1 and 2 communicate about the same amount as plain data parallelism: 2Ψ values per step.",
          "Stage 3 communicates about 3Ψ values: parameters are gathered in forward and backward, and gradients are reduce-scattered.",
          "On fast networks, the extra communication of stage 3 costs little; on slow networks it can dominate.",
          "ZeRO-Offload and ZeRO-Infinity move optimizer states or even parameters to CPU memory or NVMe drives to fit even larger models on fewer GPUs.",
          "Offloading trades speed for capacity, which is useful for fine-tuning big models on modest hardware.",
          "The example compares communication volume per step for each stage.",
          "DeepSpeed configurations choose the stage with a single number, zero_optimization.stage.",
          "Hierarchical approaches, such as ZeRO++, reduce cross-node traffic further.",
          "Measure step time with each stage on your hardware before committing to one.",
          "Tomorrow looks at FSDP, PyTorch's built-in version of stage 3."
        ],
        "example": "Keeping rarely used books in a storage unit across town: you have room for many more, but each trip takes time.",
        "code": "params_b = 7.5\nvolumes = {\"stage 0 (DDP)\": 2, \"stage 1\": 2, \"stage 2\": 2, \"stage 3\": 3}\nfor stage, factor in volumes.items():\n    gb = factor * params_b * 2\n    print(f\"{stage:14} about {factor} x params values -> {gb:5.1f} GB moved per step (16-bit)\")",
        "output": "stage 0 (DDP)  about 2 x params values ->  30.0 GB moved per step (16-bit)\nstage 1        about 2 x params values ->  30.0 GB moved per step (16-bit)\nstage 2        about 2 x params values ->  30.0 GB moved per step (16-bit)\nstage 3        about 3 x params values ->  45.0 GB moved per step (16-bit)",
        "codeNotes": [
          {
            "line": 4,
            "note": "Values times 2 bytes, in GB."
          }
        ],
        "tryIt": "At 50 GB/s, how much extra time per step does stage 3 add for this model?",
        "check": {
          "question": "What does ZeRO-Offload do?",
          "options": [
            "Deletes old checkpoints",
            "Moves states to CPU memory or disk to fit bigger models",
            "Speeds up the network"
          ],
          "answer": 1,
          "why": "It trades speed for capacity."
        }
      },
      {
        "title": "Practice time: ZeRO",
        "say": [
          "Practice 1: zero_memory_gb(params, gpus, stage). Apply 16Ψ, 4Ψ + 12Ψ/N, 2Ψ + 14Ψ/N or 16Ψ/N bytes for stages 0 to 3, convert to GB and round to 1 decimal; raise ValueError for other stages.",
          "The checks reproduce 120.0, 31.4, 16.6 and 1.9 GB for a 7.5B model on 64 GPUs, and confirm one GPU gains nothing from stage 3.",
          "Practice 2: max_params_billion(gpu_gb, gpus, stage, reserve_gb=0). Divide available bytes by bytes per parameter and round down to one decimal of billions.",
          "The checks give 5.0, 19.1, 36.0 and 320.0 billion for stages 0 to 3 on 64 GPUs, and 240.0 with a 20 GB reserve.",
          "After passing, choose a stage for three model sizes on your imagined cluster and justify each choice.",
          "The example chooses the smallest stage that fits for several models.",
          "Tomorrow shows the gather-compute-free rhythm that makes stage 3 work, as implemented in FSDP.",
          "ZeRO is one of the most important ideas in modern large-model training.",
          "Its formulas also appear in interviews for machine learning infrastructure roles.",
          "If a check fails by a small amount, confirm you divide by 1e9, not 1024 cubed."
        ],
        "example": "An architect choosing the lightest structure that safely carries the load.",
        "code": "gpus, gpu_gb, reserve = 64, 80, 20\nfor billions in [3, 10, 30, 100]:\n    p = billions * 1e9\n    per_gpu = [16 * p, 4 * p + 12 * p / gpus, 2 * p + 14 * p / gpus, 16 * p / gpus]\n    stage = next((s for s, b in enumerate(per_gpu) if b / 1e9 + reserve <= gpu_gb), None)\n    print(f\"{billions:3}B -> smallest stage that fits: {stage}\")",
        "output": "  3B -> smallest stage that fits: 0\n 10B -> smallest stage that fits: 1\n 30B -> smallest stage that fits: 3\n100B -> smallest stage that fits: 3",
        "codeNotes": [
          {
            "line": 5,
            "note": "The first stage whose states plus reserve fit."
          }
        ],
        "tryIt": "Which model sizes would need tensor or pipeline parallelism on top of ZeRO with fewer GPUs?",
        "check": {
          "question": "What is stage 3 memory per GPU for 7.5B parameters on 64 GPUs?",
          "options": [
            "120 GB",
            "About 1.9 GB",
            "About 31 GB"
          ],
          "answer": 1,
          "why": "16 × 7.5e9 / 64 bytes ≈ 1.9 GB."
        }
      }
    ],
    "summary": [
      "Plain data parallelism duplicates model states on every GPU.",
      "Stage 1 shards optimizer states: 4Ψ + 12Ψ/N bytes per GPU.",
      "Stage 2 also shards gradients: 2Ψ + 14Ψ/N; stage 3 shards everything: 16Ψ/N.",
      "Stage 3 adds about 50% communication; offloading trades speed for capacity.",
      "Invert the formulas to find the largest model that fits, rounding down."
    ],
    "projectStep": {
      "title": "Training planner, part 9",
      "steps": [
        "Implement zero_memory_gb and max_params_billion.",
        "Build a table of stage choices for several models and cluster sizes.",
        "Record the communication cost of each choice."
      ]
    }
  },
  {
    "day": 10,
    "title": "Fully Sharded Data Parallel (FSDP): Gather, Compute, Free",
    "goal": "You can describe the FSDP gather-compute-free schedule, list the events of a training step layer by layer, and shard and reassemble flat parameter lists with padding.",
    "minutes": 30,
    "recap": "Yesterday's ZeRO stage 3 shards parameters across GPUs. Today we look at how PyTorch's Fully Sharded Data Parallel (FSDP) actually uses those shards during a step.",
    "parts": [
      {
        "title": "FSDP in one picture",
        "say": [
          "FSDP wraps groups of layers into units, each of which is sharded across all GPUs.",
          "Before a unit runs its forward pass, its full parameters are rebuilt with an all-gather.",
          "After the forward pass, the full parameters are freed, leaving only the local shard.",
          "In the backward pass, parameters are gathered again, gradients are computed, and a reduce-scatter leaves each GPU with its slice of averaged gradients.",
          "Each GPU then updates only its own shard with the optimizer.",
          "At any moment, only one or two units are fully materialised, so peak memory stays low.",
          "The example prints the lifetime of one unit through a step.",
          "This gather-compute-free rhythm is exactly ZeRO stage 3.",
          "FSDP2 in recent PyTorch versions represents shards as distributed tensors, but the rhythm is unchanged.",
          "Understanding the order of events makes FSDP configuration choices much clearer.",
          "Because every GPU follows the same schedule, all of them call the same collectives in the same order, which keeps the job from hanging (Day 5)."
        ],
        "example": "A shared toolkit: each worker keeps some tools in their locker, and the team gathers the full set only for the job at hand, then puts them away.",
        "code": "events = [\"all-gather full weights\", \"forward\", \"free full weights\",\n          \"all-gather full weights\", \"backward\", \"reduce-scatter gradients\", \"free full weights\", \"update own shard\"]\nfor i, e in enumerate(events, 1):\n    print(f\"{i}. {e}\")",
        "output": "1. all-gather full weights\n2. forward\n3. free full weights\n4. all-gather full weights\n5. backward\n6. reduce-scatter gradients\n7. free full weights\n8. update own shard",
        "codeNotes": [
          {
            "line": 2,
            "note": "The backward pass gathers again, then reduce-scatters gradients."
          }
        ],
        "tryIt": "Why must weights be gathered again in the backward pass?",
        "check": {
          "question": "What does FSDP do right after a unit's forward pass?",
          "options": [
            "Updates the weights",
            "Frees the full parameters, keeping only the shard",
            "Saves a checkpoint"
          ],
          "answer": 1,
          "why": "Free immediately to keep memory low."
        }
      },
      {
        "title": "The schedule layer by layer",
        "say": [
          "For a model with several layers, the forward pass runs gather, forward, free for each layer in order.",
          "The backward pass runs in reverse order: gather, backward, reduce-scatter, free.",
          "Practice 1 is fsdp_schedule(layers), which produces exactly this list of events.",
          "Each layer produces three forward events and four backward events, seven in total.",
          "The example prints the schedule for a three-layer model.",
          "Real FSDP also prefetches: it starts gathering the next layer while the current one computes, hiding communication time.",
          "Prefetching changes when events start, not which events happen.",
          "Wrapping too many layers into one unit raises peak memory; wrapping too few adds many small, slow communications.",
          "A common choice is one unit per transformer block.",
          "Reading such a schedule is how engineers reason about peak memory and communication overlap.",
          "Profiler traces of a real FSDP run show exactly these gathers, computations and reduce-scatters as coloured bars on a timeline."
        ],
        "example": "A kitchen that brings out ingredients for each course just before cooking it, and clears them before the next course.",
        "code": "layers = [\"block1\", \"block2\", \"block3\"]\nevents = []\nfor L in layers:\n    events += [f\"gather:{L}\", f\"forward:{L}\", f\"free:{L}\"]\nfor L in reversed(layers):\n    events += [f\"gather:{L}\", f\"backward:{L}\", f\"reduce_scatter:{L}\", f\"free:{L}\"]\nprint(len(events), \"events\")\nprint(events[:6])\nprint(events[9:13])",
        "output": "21 events\n['gather:block1', 'forward:block1', 'free:block1', 'gather:block2', 'forward:block2', 'free:block2']\n['gather:block3', 'backward:block3', 'reduce_scatter:block3', 'free:block3']",
        "codeNotes": [
          {
            "line": 5,
            "note": "Backward runs from the last layer to the first."
          }
        ],
        "tryIt": "Which layer's backward happens first, and why?",
        "check": {
          "question": "How many events per layer does the schedule have?",
          "options": [
            "3",
            "7",
            "4"
          ],
          "answer": 1,
          "why": "Three forward events and four backward events."
        }
      },
      {
        "title": "Flattening and sharding",
        "say": [
          "FSDP flattens all the parameters of a unit into one long one-dimensional list, called a flat parameter.",
          "The flat list is padded with zeros so its length divides evenly by the number of GPUs.",
          "It is then cut into equal consecutive shards, one per GPU.",
          "Practice 2 is shard(values, world_size) plus gather(shards, original_length), which reverses the process and removes the padding.",
          "The example shards 10 values across 3 GPUs, showing the two zeros of padding on the last shard.",
          "Equal shard sizes make the all-gather and reduce-scatter operations simple and fast.",
          "Keeping the original length lets gather strip the padding exactly.",
          "A round trip, sharding and then gathering, must return the original list; that is a perfect test.",
          "Padding wastes a tiny amount of memory, at most world_size − 1 values per unit.",
          "This is the same data layout that ZeRO uses internally.",
          "When a checkpoint is saved in a sharded format, it is these padded shards that each GPU writes to disk."
        ],
        "example": "Cutting a long ribbon into equal lengths for several people, adding a little blank ribbon so the pieces come out even.",
        "code": "import math\n\nvalues = list(range(1, 11))\nworld = 3\nsize = math.ceil(len(values) / world)\npadded = values + [0] * (size * world - len(values))\nshards = [padded[i * size:(i + 1) * size] for i in range(world)]\nprint(\"shards:\", shards)\nrestored = [v for s in shards for v in s][:len(values)]\nprint(\"gathered:\", restored)",
        "output": "shards: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 0, 0]]\ngathered: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
        "codeNotes": [
          {
            "line": 6,
            "note": "Pad to a multiple of the world size."
          },
          {
            "line": 9,
            "note": "Join and strip the padding."
          }
        ],
        "tryIt": "How much padding is needed for 12 values across 5 GPUs?",
        "check": {
          "question": "Why pad the flat parameter?",
          "options": [
            "To add new weights",
            "So it splits into equal shards",
            "To encrypt it"
          ],
          "answer": 1,
          "why": "Equal shards simplify collectives."
        }
      },
      {
        "title": "Peak memory with FSDP",
        "say": [
          "With FSDP, peak parameter memory is roughly the local shards plus the largest unit's full parameters, and perhaps one more when prefetching.",
          "The example compares peak parameter memory for plain data parallelism and FSDP.",
          "For a 24-layer model on 8 GPUs, FSDP needs only a fraction of the full model's parameters in memory at once.",
          "This is why wrapping granularity matters: a single huge unit would materialise the whole model.",
          "Gradients and optimizer states follow the same sharding, so they shrink with the number of GPUs.",
          "Activation memory is not reduced by FSDP; checkpointing handles that (Day 13).",
          "CPU offloading in FSDP moves shards to CPU memory between uses, at a cost in speed.",
          "Mixed precision policies in FSDP set the dtype for parameters, gradient reduction and buffers.",
          "Understanding these settings lets you tune FSDP rather than guessing.",
          "Measured peaks should be compared with the estimate to find surprises.",
          "A large gap usually means a unit is bigger than expected or activations were not freed on time."
        ],
        "example": "A stage play where only the scenery for the current scene is on stage, while everything else stays in the store room.",
        "code": "layers, per_layer_gb, gpus = 24, 1.0, 8\nddp = layers * per_layer_gb\nfsdp = layers * per_layer_gb / gpus + 2 * per_layer_gb\nprint(f\"DDP holds {ddp:.1f} GB of 16-bit parameters on every GPU\")\nprint(f\"FSDP holds about {fsdp:.1f} GB (own shards + current and prefetched layer)\")",
        "output": "DDP holds 24.0 GB of 16-bit parameters on every GPU\nFSDP holds about 5.0 GB (own shards + current and prefetched layer)",
        "codeNotes": [
          {
            "line": 3,
            "note": "Shards plus at most two full layers at a time."
          }
        ],
        "tryIt": "How does the FSDP figure change with 64 GPUs? What part stops shrinking?",
        "check": {
          "question": "Which memory does FSDP not reduce?",
          "options": [
            "Parameters",
            "Optimizer states",
            "Activations"
          ],
          "answer": 2,
          "why": "Activations need checkpointing instead."
        }
      },
      {
        "title": "Using FSDP well",
        "say": [
          "Wrap each transformer block as a unit using an auto-wrap policy.",
          "Enable forward and backward prefetching to overlap communication with computation.",
          "Choose BF16 for parameters and gradient reduction on hardware that supports it.",
          "Use sharded checkpoints, so each GPU saves its own shard in parallel (Day 17).",
          "Hybrid sharding shards inside a node and replicates across nodes, reducing slow cross-node traffic.",
          "The example prints a checklist of settings with the reason for each.",
          "Compare step time and memory with a small benchmark before a big run.",
          "Keep the wrapping policy consistent between training and checkpoint loading.",
          "Most FSDP problems come from wrapping choices or mismatched precision settings.",
          "The same checklist applies, with different names, to DeepSpeed ZeRO stage 3."
        ],
        "example": "A seasoned stage manager's checklist before opening night.",
        "code": "checklist = [(\"auto-wrap per transformer block\", \"limits peak memory\"),\n             (\"prefetch next unit\", \"hides communication\"),\n             (\"bf16 params and reduction\", \"halves traffic and memory\"),\n             (\"sharded checkpoints\", \"fast parallel saves\"),\n             (\"hybrid sharding across nodes\", \"keeps heavy traffic on fast links\")]\nfor setting, why in checklist:\n    print(f\"- {setting:32} {why}\")",
        "output": "- auto-wrap per transformer block  limits peak memory\n- prefetch next unit               hides communication\n- bf16 params and reduction        halves traffic and memory\n- sharded checkpoints              fast parallel saves\n- hybrid sharding across nodes     keeps heavy traffic on fast links",
        "codeNotes": [
          {
            "line": 5,
            "note": "Shard within a node, replicate across nodes."
          }
        ],
        "tryIt": "Which setting would you try first if FSDP is slower than expected?",
        "check": {
          "question": "What does hybrid sharding do?",
          "options": [
            "Shards everything everywhere",
            "Shards within a node and replicates across nodes",
            "Turns off sharding"
          ],
          "answer": 1,
          "why": "It keeps most traffic on fast intra-node links."
        }
      },
      {
        "title": "Practice time: FSDP",
        "say": [
          "Practice 1: fsdp_schedule(layers). Return gather, forward and free for each layer in order, then gather, backward, reduce_scatter and free for each layer in reverse, as strings like \"gather:L1\".",
          "The checks include a two-layer model event by event, the count for three layers and an empty model.",
          "Practice 2: shard(values, world_size) and gather(shards, original_length). Pad with zeros to a multiple of world_size, cut into equal consecutive shards, and join and trim to reverse it.",
          "The checks include uneven and exact splits, more ranks than values and a round trip.",
          "After passing, simulate peak memory by walking your schedule and tracking which layers are gathered.",
          "The example does that walk.",
          "Tomorrow changes approach entirely: instead of sharding whole layers across GPUs, tensor parallelism splits the matrix multiplications themselves.",
          "FSDP and ZeRO are the default choices for models up to tens of billions of parameters.",
          "For even larger models, they are combined with tensor and pipeline parallelism.",
          "If the schedule check fails, compare your list with the expected one event by event."
        ],
        "example": "Rehearsing a choreographed routine step by step before performing it at full speed.",
        "code": "layers, per_layer = [\"b1\", \"b2\", \"b3\", \"b4\"], 1.0\ngathered = set()\npeak = 0.0\norder = []\nfor L in layers:\n    order += [(\"gather\", L), (\"free\", L)]\nfor L in reversed(layers):\n    order += [(\"gather\", L), (\"free\", L)]\nfor kind, L in order:\n    if kind == \"gather\":\n        gathered.add(L)\n    else:\n        gathered.discard(L)\n    peak = max(peak, len(gathered) * per_layer)\nprint(f\"peak full-layer memory without prefetch: {peak} GB\")",
        "output": "peak full-layer memory without prefetch: 1.0 GB",
        "codeNotes": [
          {
            "line": 9,
            "note": "Walk the schedule and track gathered layers."
          }
        ],
        "tryIt": "Add prefetching (gather the next layer before freeing the current one). What is the new peak?",
        "check": {
          "question": "What does gather(shards, original_length) remove?",
          "options": [
            "The first shard",
            "The padding at the end",
            "Duplicate values"
          ],
          "answer": 1,
          "why": "Trim to the original length."
        }
      }
    ],
    "summary": [
      "FSDP: gather full layer weights, compute, free, then update own shard.",
      "Backward: gather, backward, reduce-scatter gradients, free, in reverse order.",
      "Flat parameters are padded and split into equal consecutive shards.",
      "Peak memory is shards plus one or two full units.",
      "Wrap per block, prefetch, use BF16 and sharded checkpoints."
    ],
    "projectStep": {
      "title": "Training planner, part 10",
      "steps": [
        "Implement fsdp_schedule, shard and gather.",
        "Simulate peak memory with and without prefetching.",
        "Add an FSDP settings checklist to your planner."
      ]
    }
  },
  {
    "day": 11,
    "title": "Tensor Parallelism: Splitting Matrix Multiplications",
    "goal": "You can split a linear layer's matrix multiplication across devices by columns or by rows, combine the partial results correctly, and explain why tensor parallelism needs very fast links.",
    "minutes": 30,
    "recap": "ZeRO and FSDP shard parameters but still run each layer's full computation on one GPU. Tensor parallelism goes further: it splits the computation of a single layer across GPUs.",
    "parts": [
      {
        "title": "Matrix multiplication recap",
        "say": [
          "Most of a transformer's computation is matrix multiplication in linear layers.",
          "A linear layer computes y = x·W, where x is an input vector and W is a weight matrix with one row per input feature and one column per output feature.",
          "Each output value is the sum over i of x[i] × W[i][j].",
          "In Python we represent W as a list of rows, so W[i][j] is row i, column j.",
          "The example multiplies a 2-element vector by a 2 × 4 matrix by hand.",
          "Large language models have matrices with tens of thousands of rows and columns, far too large to compute quickly on one device.",
          "Tensor parallelism splits these multiplications so several GPUs each compute a piece.",
          "Megatron-LM from NVIDIA made this approach popular for transformers.",
          "Understanding the maths on tiny examples makes the splitting rules obvious.",
          "The key question for any split is how the partial results must be combined afterwards."
        ],
        "example": "A big multiplication table shared among classmates: each fills in some columns, and the table is complete when the pieces are put side by side.",
        "code": "x = [1, 2]\nW = [[1, 0, 2, 1],\n     [0, 1, 1, 3]]\ny = [sum(x[i] * W[i][j] for i in range(len(x))) for j in range(len(W[0]))]\nprint(\"y = x.W =\", y)",
        "output": "y = x.W = [1, 2, 4, 7]",
        "codeNotes": [
          {
            "line": 4,
            "note": "One output value per column of W."
          }
        ],
        "tryIt": "Work out y[3] by hand before running the code.",
        "check": {
          "question": "In y = x·W, what does each column of W produce?",
          "options": [
            "One input value",
            "One output value",
            "Nothing"
          ],
          "answer": 1,
          "why": "Each output j uses column j."
        }
      },
      {
        "title": "Column parallelism",
        "say": [
          "In column parallelism, the columns of W are split into groups, and each device holds one group.",
          "Every device receives the full input x and computes the output values for its own columns.",
          "The partial outputs are simply placed side by side, concatenated, to form the full output.",
          "Practice 1 is col_parallel_matmul(x, W, parts), which returns the output and how many values each device computed.",
          "The example splits a 4-column matrix across 2 devices.",
          "No addition across devices is needed, only an all-gather if the next step needs the full output.",
          "In transformers, the first linear layer of each MLP block is column-parallel.",
          "The number of columns must divide evenly by the number of devices, which model designers ensure by choosing sizes carefully.",
          "Each device stores only its share of W, so weight memory is also divided.",
          "Column-parallel outputs can feed directly into a row-parallel layer, avoiding communication in between."
        ],
        "example": "Each classmate fills in whole columns of the table; putting the columns side by side gives the complete table.",
        "code": "x = [1, 2]\nW = [[1, 0, 2, 1],\n     [0, 1, 1, 3]]\nparts, cols = 2, 2\npieces = []\nfor k in range(parts):\n    piece = [sum(x[i] * W[i][j] for i in range(2)) for j in range(k * cols, (k + 1) * cols)]\n    print(f\"device {k} computes columns {k * cols}-{(k + 1) * cols - 1}: {piece}\")\n    pieces += piece\nprint(\"concatenated:\", pieces)",
        "output": "device 0 computes columns 0-1: [1, 2]\ndevice 1 computes columns 2-3: [4, 7]\nconcatenated: [1, 2, 4, 7]",
        "codeNotes": [
          {
            "line": 7,
            "note": "Each device uses only its own columns."
          },
          {
            "line": 9,
            "note": "Concatenate the pieces."
          }
        ],
        "tryIt": "What would each device compute with 4 devices?",
        "check": {
          "question": "How are column-parallel partial outputs combined?",
          "options": [
            "Summed",
            "Concatenated",
            "Averaged"
          ],
          "answer": 1,
          "why": "Each device produces different output values."
        }
      },
      {
        "title": "Row parallelism",
        "say": [
          "In row parallelism, the rows of W are split, and each device holds some rows plus the matching slice of the input x.",
          "Each device multiplies its slice of x by its rows, producing a full-length partial result.",
          "The true output is the sum of all partial results, so an all-reduce (sum) combines them.",
          "Practice 2 is row_parallel_matmul(x, W, parts), which returns the output and every device's partial vector.",
          "The example splits a 4-row matrix across 2 devices and shows the partial sums adding up.",
          "In transformers, the second linear layer of each MLP block is row-parallel.",
          "The input slices come naturally from the column-parallel layer before it, so no extra communication is needed there.",
          "This pairing, column then row, needs just one all-reduce per MLP block in the forward pass.",
          "Attention layers are split the same way, with attention heads divided across devices.",
          "The all-reduce happens inside every layer, which is why the links must be very fast."
        ],
        "example": "Each classmate adds up part of every total; the final totals are the sums of everyone's partial totals.",
        "code": "x = [1, 2, 3, 4]\nW = [[1, 0], [0, 1], [1, 1], [2, 0]]\nparts, rows = 2, 2\npartials = []\nfor k in range(parts):\n    p = [sum(x[i] * W[i][j] for i in range(k * rows, (k + 1) * rows)) for j in range(2)]\n    partials.append(p)\n    print(f\"device {k} uses x[{k * rows}:{(k + 1) * rows}] -> partial {p}\")\nprint(\"all-reduce (sum):\", [sum(v) for v in zip(*partials)])",
        "output": "device 0 uses x[0:2] -> partial [1, 2]\ndevice 1 uses x[2:4] -> partial [11, 3]\nall-reduce (sum): [12, 5]",
        "codeNotes": [
          {
            "line": 6,
            "note": "Only this device's rows and input slice."
          },
          {
            "line": 9,
            "note": "Summing partials gives the true output."
          }
        ],
        "tryIt": "Check the result by computing x·W directly without splitting.",
        "check": {
          "question": "How are row-parallel partial outputs combined?",
          "options": [
            "Concatenated",
            "Summed with an all-reduce",
            "The first one is used"
          ],
          "answer": 1,
          "why": "Partial sums must be added."
        }
      },
      {
        "title": "The Megatron MLP pattern",
        "say": [
          "A transformer MLP block has two linear layers with an activation function, such as GELU, in between.",
          "Megatron splits the first layer by columns, so each device produces part of the hidden vector.",
          "The activation function works element by element, so each device can apply it to its own part without communication.",
          "The second layer is split by rows, matching the parts each device already holds.",
          "A single all-reduce at the end sums the partial outputs.",
          "The example runs this full pattern on tiny matrices and checks it against the unsplit computation.",
          "The answers match exactly, which confirms the split is correct.",
          "In the backward pass, another all-reduce is needed at the start of the block, so there are two per block per step.",
          "With dozens of layers, that is many all-reduces per step, each on the critical path.",
          "Sequence parallelism, a later refinement, splits other operations such as layer normalisation along the sequence dimension to save more memory."
        ],
        "example": "An assembly line where one team cuts different parts, each team paints only its own parts, and the parts are assembled once at the end.",
        "code": "def relu(v):\n    return [max(0, a) for a in v]\ndef mm(x, W):\n    return [sum(x[i] * W[i][j] for i in range(len(x))) for j in range(len(W[0]))]\n\nx = [1, -1]\nA = [[1, 2, -1, 0], [0, 1, 1, -2]]\nB = [[1, 0], [0, 1], [1, 1], [2, -1]]\nfull = mm(relu(mm(x, A)), B)\ndev = []\nfor k in range(2):\n    h = relu(mm(x, [row[2 * k:2 * k + 2] for row in A]))\n    dev.append(mm(h, B[2 * k:2 * k + 2]))\nprint(\"unsplit:\", full)\nprint(\"two devices + all-reduce:\", [sum(v) for v in zip(*dev)])",
        "output": "unsplit: [5, -1]\ntwo devices + all-reduce: [5, -1]",
        "codeNotes": [
          {
            "line": 12,
            "note": "Column slice of A, activation applied locally."
          },
          {
            "line": 13,
            "note": "Matching row slice of B gives a partial output."
          }
        ],
        "tryIt": "Why can the activation be applied on each device without communication?",
        "check": {
          "question": "How many all-reduces does a Megatron MLP block need in the forward pass?",
          "options": [
            "None",
            "One",
            "One per column"
          ],
          "answer": 1,
          "why": "Column-parallel then row-parallel needs one all-reduce."
        }
      },
      {
        "title": "Where tensor parallelism fits",
        "say": [
          "Tensor parallelism divides both memory and computation of each layer across devices.",
          "But it needs an all-reduce inside every layer, forward and backward, on the critical path.",
          "That is only fast enough over very high-bandwidth links, such as NVLink within one server.",
          "So tensor parallelism is usually limited to the GPUs inside one node, typically 2, 4 or 8.",
          "Across nodes, data parallelism or pipeline parallelism (Day 12) is used instead.",
          "The example compares link bandwidths to show why.",
          "Combining tensor parallelism within nodes, pipelines across groups of nodes and data parallelism across everything is called 3D parallelism.",
          "Frameworks such as Megatron-LM and DeepSpeed provide these combinations.",
          "The tensor-parallel degree must divide the number of attention heads and hidden dimensions.",
          "Choosing the degree is about balancing memory savings with communication overhead."
        ],
        "example": "Close colleagues sharing a single desk can split every task finely; colleagues in different cities should split work into larger independent pieces.",
        "code": "links = {\"NVLink (within a server)\": 900, \"InfiniBand (between servers)\": 50, \"Ethernet (between servers)\": 12.5}\nsize_gb = 0.5\nfor name, gbps in links.items():\n    print(f\"{name:30} {size_gb / gbps * 1000:6.2f} ms to move {size_gb} GB\")",
        "output": "NVLink (within a server)         0.56 ms to move 0.5 GB\nInfiniBand (between servers)    10.00 ms to move 0.5 GB\nEthernet (between servers)      40.00 ms to move 0.5 GB",
        "codeNotes": [
          {
            "line": 1,
            "note": "Approximate bandwidth in GB per second."
          }
        ],
        "tryIt": "If one layer's all-reduce takes 40 ms over Ethernet, how does that compare with the layer's compute time of a few milliseconds?",
        "check": {
          "question": "Why is tensor parallelism usually kept inside one node?",
          "options": [
            "It uses less memory there",
            "It needs an all-reduce in every layer, which requires very fast links",
            "It is a licensing rule"
          ],
          "answer": 1,
          "why": "Per-layer communication needs NVLink-class speed."
        }
      },
      {
        "title": "Practice time: splitting layers",
        "say": [
          "Practice 1: col_parallel_matmul(x, W, parts). Split the columns into parts equal groups, compute x·W for each group and concatenate; return (output, columns per device).",
          "The checks use a 2 × 4 matrix with 1, 2 and 4 devices and always expect the same output [1, 2, 4, 7].",
          "Practice 2: row_parallel_matmul(x, W, parts). Split rows and the matching slices of x, compute each device's full-length partial vector and sum them; return (output, partials).",
          "The checks include the partial vectors for 2 devices and the same output for 1 and 4 devices.",
          "After passing, chain them: column-parallel into row-parallel, and confirm the result matches the unsplit calculation.",
          "The example verifies both functions against direct multiplication.",
          "Tomorrow uses a different split: whole groups of layers on different GPUs, passing activations along a pipeline.",
          "Tensor parallelism is what lets a single layer that is too large for one GPU be trained at all.",
          "The same splitting ideas are used for serving large models across several GPUs.",
          "If your output is wrong, print each device's piece or partial vector."
        ],
        "example": "Checking that the pieces of a jigsaw really do make the picture on the box.",
        "code": "def mm(x, W):\n    return [sum(x[i] * W[i][j] for i in range(len(x))) for j in range(len(W[0]))]\n\nx = [1, 2, 3, 4]\nW = [[1, 0, 2, 1], [0, 1, 1, 3], [2, 2, 0, 1], [1, 0, 1, 0]]\ndirect = mm(x, W)\ncols = sum((mm(x, [r[2 * k:2 * k + 2] for r in W]) for k in range(2)), [])\nrows = [sum(v) for v in zip(*(mm(x[2 * k:2 * k + 2], W[2 * k:2 * k + 2]) for k in range(2)))]\nprint(\"direct:\", direct)\nprint(\"column-parallel:\", cols)\nprint(\"row-parallel:\", rows)",
        "output": "direct: [11, 8, 8, 10]\ncolumn-parallel: [11, 8, 8, 10]\nrow-parallel: [11, 8, 8, 10]",
        "codeNotes": [
          {
            "line": 7,
            "note": "Concatenate column pieces."
          },
          {
            "line": 8,
            "note": "Sum row partials."
          }
        ],
        "tryIt": "Which split would each device need the full input x for?",
        "check": {
          "question": "What does row_parallel_matmul return besides the output?",
          "options": [
            "The weights",
            "Each device's partial vector",
            "The number of rows"
          ],
          "answer": 1,
          "why": "It returns (output, partials)."
        }
      }
    ],
    "summary": [
      "Linear layers compute y = x·W; tensor parallelism splits W across devices.",
      "Column parallelism: full x, split columns, concatenate outputs.",
      "Row parallelism: split rows and x, sum partial outputs with all-reduce.",
      "Megatron MLP: column then row, one all-reduce per block forward.",
      "Keep tensor parallelism on fast links, usually inside a node."
    ],
    "projectStep": {
      "title": "Training planner, part 11",
      "steps": [
        "Implement col_parallel_matmul and row_parallel_matmul.",
        "Verify a split MLP block against the unsplit version.",
        "Record the tensor-parallel degree you would use per node."
      ]
    }
  },
  {
    "day": 12,
    "title": "Pipeline Parallelism: Micro-Batches and the Pipeline Bubble",
    "goal": "You can explain pipeline parallelism, draw a GPipe forward timeline, compute the pipeline bubble fraction, and choose enough micro-batches to keep idle time low.",
    "minutes": 30,
    "recap": "Tensor parallelism split each layer inside a node. Pipeline parallelism splits the model the other way: different groups of layers on different GPUs, with data flowing between them like an assembly line.",
    "parts": [
      {
        "title": "Stages and the naive pipeline",
        "say": [
          "In pipeline parallelism, the model's layers are divided into consecutive groups called stages, and each stage lives on a different GPU.",
          "Activations flow forward from stage to stage, and gradients flow backward in reverse.",
          "Communication happens only between neighbouring stages, with point-to-point sends, so pipelines work well across nodes.",
          "Naively, while stage 1 works on a batch, all later stages are idle, and while the last stage works, all earlier ones are idle.",
          "With p stages, each GPU would be busy only 1/p of the time.",
          "The example simulates the naive pipeline for 4 stages.",
          "The solution is to cut each batch into micro-batches, so stages can work on different micro-batches at the same time.",
          "GPipe from Google (2019) introduced this idea for large models.",
          "Balancing stages so each has similar work is essential; the slowest stage sets the pace.",
          "Memory per GPU falls because each holds only its stage's layers."
        ],
        "example": "A car assembly line where each station must wait for the whole previous car to be finished before starting anything.",
        "code": "stages = 4\nfor t in range(stages):\n    row = [\"busy\" if s == t else \"idle\" for s in range(stages)]\n    print(f\"time {t}: {row}\")\nprint(f\"each stage busy {1 / stages:.0%} of the time\")",
        "output": "time 0: ['busy', 'idle', 'idle', 'idle']\ntime 1: ['idle', 'busy', 'idle', 'idle']\ntime 2: ['idle', 'idle', 'busy', 'idle']\ntime 3: ['idle', 'idle', 'idle', 'busy']\neach stage busy 25% of the time",
        "codeNotes": [
          {
            "line": 3,
            "note": "Only one stage works at a time."
          }
        ],
        "tryIt": "How busy would each stage be with 8 stages?",
        "check": {
          "question": "How do pipeline stages communicate?",
          "options": [
            "All-reduce in every layer",
            "Point-to-point sends between neighbouring stages",
            "They do not communicate"
          ],
          "answer": 1,
          "why": "Activations and gradients pass between neighbours."
        }
      },
      {
        "title": "Micro-batches and the GPipe schedule",
        "say": [
          "With micro-batches, stage 1 starts micro-batch 1, then moves on to micro-batch 2 while stage 2 processes micro-batch 1, and so on.",
          "At time t, stage s works on micro-batch t − s + 1, if that micro-batch exists.",
          "Practice 2 is gpipe_forward(stages, micro_batches), which returns this timeline with None for idle slots.",
          "The forward pass takes micro_batches + stages − 1 time steps.",
          "The example prints the timeline for 3 stages and 4 micro-batches.",
          "The idle slots at the start and end form a triangle-shaped gap called the pipeline bubble.",
          "In GPipe, all forward passes finish before the backward passes start, which means storing activations for every micro-batch.",
          "Gradients from all micro-batches are accumulated before a single optimizer step, just as on Day 6.",
          "Reading these timelines is the easiest way to understand any pipeline schedule.",
          "Profiler traces of real pipeline runs look like this table, rotated."
        ],
        "example": "A sandwich bar where one person spreads butter, the next adds fillings and the last wraps: once the first sandwich moves on, the next one starts.",
        "code": "stages, micro = 3, 4\nfor t in range(micro + stages - 1):\n    row = []\n    for s in range(stages):\n        k = t - s + 1\n        row.append(f\"m{k}\" if 1 <= k <= micro else \"--\")\n    print(f\"t={t}: \" + \"  \".join(row))",
        "output": "t=0: m1  --  --\nt=1: m2  m1  --\nt=2: m3  m2  m1\nt=3: m4  m3  m2\nt=4: --  m4  m3\nt=5: --  --  m4",
        "codeNotes": [
          {
            "line": 5,
            "note": "The micro-batch this stage handles at time t."
          }
        ],
        "tryIt": "Count the idle slots. How does the count change with 8 micro-batches?",
        "check": {
          "question": "How many time steps does the forward pass take with 3 stages and 4 micro-batches?",
          "options": [
            "4",
            "6",
            "12"
          ],
          "answer": 1,
          "why": "m + p − 1 = 4 + 3 − 1 = 6."
        }
      },
      {
        "title": "The bubble fraction",
        "say": [
          "The fraction of time each stage sits idle in a GPipe schedule is (p − 1) / (m + p − 1), where p is the number of stages and m the number of micro-batches.",
          "With 4 stages and only 1 micro-batch, the bubble is 75 percent; with 32 micro-batches, it falls to under 9 percent.",
          "Practice 1 is bubble_fraction(stages, micro_batches) plus micro_batches_for(stages, max_bubble), which finds the smallest m that keeps idle time acceptable.",
          "A common rule of thumb is to use at least four times as many micro-batches as stages.",
          "The example prints the bubble for several settings.",
          "More micro-batches mean smaller ones, which can use the GPU less efficiently, so there is a balance.",
          "The global batch fixes m × micro-batch size, so the pipeline also influences batch-size choices.",
          "Interleaved schedules, which assign several smaller chunks of layers to each GPU, shrink the bubble further.",
          "Zero-bubble schedules from recent research remove almost all idle time with clever ordering.",
          "Always compute the bubble before choosing pipeline depth."
        ],
        "example": "The time at the start of a relay race when later runners are still waiting for the baton.",
        "code": "for p in [2, 4, 8]:\n    row = [f\"m={m}: {(p - 1) / (m + p - 1):.3f}\" for m in [1, 4, 16, 64]]\n    print(f\"p={p}  \" + \"   \".join(row))",
        "output": "p=2  m=1: 0.500   m=4: 0.200   m=16: 0.059   m=64: 0.015\np=4  m=1: 0.750   m=4: 0.429   m=16: 0.158   m=64: 0.045\np=8  m=1: 0.875   m=4: 0.636   m=16: 0.304   m=64: 0.099",
        "codeNotes": [
          {
            "line": 2,
            "note": "The bubble fraction for each number of micro-batches."
          }
        ],
        "tryIt": "How many micro-batches keep the bubble under 10% with 8 stages?",
        "check": {
          "question": "What happens to the bubble as micro-batches increase?",
          "options": [
            "It grows",
            "It shrinks",
            "It stays constant"
          ],
          "answer": 1,
          "why": "More micro-batches fill the pipeline."
        }
      },
      {
        "title": "1F1B and memory",
        "say": [
          "GPipe stores activations for every micro-batch until the backward passes run, which can take a lot of memory.",
          "The one-forward-one-backward (1F1B) schedule, used in PipeDream and Megatron, starts backward passes as soon as possible.",
          "After a warm-up phase, each stage alternates one forward and one backward pass.",
          "This caps the number of micro-batches whose activations are stored at the number of stages, not the number of micro-batches.",
          "The bubble fraction stays the same, but memory falls dramatically when there are many micro-batches.",
          "The example compares stored activations for GPipe and 1F1B.",
          "Most production pipeline training uses 1F1B or its interleaved variant.",
          "Pipeline parallelism is combined with activation checkpointing (Day 13) to save even more memory.",
          "Stage balancing still matters: uneven stages create extra bubbles every step.",
          "Embedding and output layers are often large and need special care in stage assignment."
        ],
        "example": "Washing dishes as they come in rather than letting the whole pile build up before starting.",
        "code": "stages = 4\nfor micro in [4, 16, 64]:\n    gpipe = micro\n    one_f_one_b = min(micro, stages)\n    print(f\"{micro:2} micro-batches: GPipe stores {gpipe:2} sets of activations, 1F1B stores {one_f_one_b}\")",
        "output": " 4 micro-batches: GPipe stores  4 sets of activations, 1F1B stores 4\n16 micro-batches: GPipe stores 16 sets of activations, 1F1B stores 4\n64 micro-batches: GPipe stores 64 sets of activations, 1F1B stores 4",
        "codeNotes": [
          {
            "line": 4,
            "note": "At most one set per stage in flight."
          }
        ],
        "tryIt": "Why does 1F1B let you use more micro-batches without running out of memory?",
        "check": {
          "question": "What does 1F1B reduce compared with GPipe?",
          "options": [
            "The bubble",
            "Activation memory",
            "The number of stages"
          ],
          "answer": 1,
          "why": "It limits in-flight micro-batches."
        }
      },
      {
        "title": "Balancing stages",
        "say": [
          "The slowest stage determines the pipeline's speed, so layers should be split so stages take similar time.",
          "Transformer blocks are usually identical, which makes balancing easy, but embeddings and the output layer add extra work to the first and last stages.",
          "The example splits layer times into stages greedily and reports the slowest stage.",
          "A better split lowers the maximum stage time, which directly speeds up every step.",
          "Profiling each layer's time gives the numbers needed for balancing.",
          "Memory balance also matters: the first stage stores the most activations under 1F1B.",
          "Tools in DeepSpeed and Megatron offer partitioning methods based on parameter counts or measured times.",
          "Rebalancing is worth trying whenever pipeline efficiency is lower than expected.",
          "Balanced stages also make failures easier to reason about, since every stage behaves similarly.",
          "Pipeline balancing is a small version of a classic scheduling problem."
        ],
        "example": "Splitting a long walk into equal legs for a relay team, so no one runner slows everybody down.",
        "code": "layer_ms = [4, 3, 3, 3, 3, 3, 3, 6]\ndef split(times, stages):\n    target = sum(times) / stages\n    groups, cur = [], []\n    for t in times:\n        if cur and sum(cur) + t > target and len(groups) < stages - 1:\n            groups.append(cur)\n            cur = []\n        cur.append(t)\n    return groups + [cur]\ngroups = split(layer_ms, 4)\nprint(\"stages:\", groups, \"-> slowest stage\", max(sum(g) for g in groups), \"ms\")",
        "output": "stages: [[4, 3], [3, 3], [3, 3], [3, 6]] -> slowest stage 9 ms",
        "codeNotes": [
          {
            "line": 6,
            "note": "Start a new stage when this one would exceed its fair share."
          }
        ],
        "tryIt": "The perfect share would be 7 ms per stage. Can any split into 4 consecutive stages beat 9 ms here? Why not?",
        "check": {
          "question": "What sets the speed of a pipeline?",
          "options": [
            "The fastest stage",
            "The slowest stage",
            "The number of GPUs"
          ],
          "answer": 1,
          "why": "Everyone waits for the slowest stage."
        }
      },
      {
        "title": "Practice time: pipelines",
        "say": [
          "Practice 1: bubble_fraction(stages, micro_batches) returns (p − 1)/(m + p − 1) rounded to 3 decimals, and micro_batches_for(stages, max_bubble) returns the smallest m whose unrounded bubble is at most max_bubble.",
          "The checks include 4 stages with 1 and 8 micro-batches, a single stage, and targets of 10% and 50%.",
          "Practice 2: gpipe_forward(stages, micro_batches) returns the timeline: one row per time step, one entry per stage, holding the micro-batch number or None.",
          "The checks include 3 stages with 2 micro-batches, the number of time steps for 4 × 8, a single stage and a count of busy slots.",
          "After passing, print timelines for a few settings and count idle slots by hand to confirm the formula.",
          "The example does exactly that comparison.",
          "Tomorrow tackles the other big memory consumer, activations, with checkpointing.",
          "Pipelines are what make training across many nodes possible when models are too big for data parallelism alone.",
          "Real systems combine pipelines with tensor parallelism inside each stage.",
          "If your timeline is off by one, check that micro-batches are numbered from 1."
        ],
        "example": "A conductor checking that every section enters at the right bar.",
        "code": "for p, m in [(3, 2), (4, 8), (8, 32)]:\n    steps = m + p - 1\n    idle = steps * p - m * p\n    print(f\"p={p} m={m}: idle slots {idle} of {steps * p} -> {idle / (steps * p):.3f}\")",
        "output": "p=3 m=2: idle slots 6 of 12 -> 0.500\np=4 m=8: idle slots 12 of 44 -> 0.273\np=8 m=32: idle slots 56 of 312 -> 0.179",
        "codeNotes": [
          {
            "line": 3,
            "note": "All slots minus busy ones."
          }
        ],
        "tryIt": "Compare the printed fractions with bubble_fraction. Do they match?",
        "check": {
          "question": "What is bubble_fraction(1, 5)?",
          "options": [
            "0.2",
            "0.0",
            "1.0"
          ],
          "answer": 1,
          "why": "One stage has no pipeline bubble."
        }
      }
    ],
    "summary": [
      "Pipeline parallelism puts groups of layers on different GPUs.",
      "Micro-batches let stages work at the same time (GPipe).",
      "Bubble fraction = (p − 1)/(m + p − 1); use many micro-batches.",
      "1F1B caps stored activations at about the number of stages.",
      "Balance stages: the slowest one sets the pace."
    ],
    "projectStep": {
      "title": "Training planner, part 12",
      "steps": [
        "Implement bubble_fraction, micro_batches_for and gpipe_forward.",
        "Choose micro-batch counts for several pipeline depths.",
        "Balance a list of measured layer times into stages."
      ]
    }
  },
  {
    "day": 13,
    "title": "Activation Checkpointing: Trading Compute for Memory",
    "goal": "You can explain activation checkpointing, compute activation memory with and without it, choose a good checkpoint interval, and state the compute cost of recomputation.",
    "minutes": 30,
    "recap": "Sharding and pipelines reduced memory for model states. Activations, the intermediate results kept for the backward pass, remain large; today we trade a little extra compute to shrink them.",
    "parts": [
      {
        "title": "Why activations are stored",
        "say": [
          "During the forward pass, each layer's outputs are kept, because the backward pass needs them to compute gradients.",
          "For a model with L layers, the saved activations grow in proportion to L.",
          "With long sequences and large batches, activations can dwarf the model weights (Day 8).",
          "Activation checkpointing, also called gradient checkpointing, saves only some activations and recomputes the rest when needed.",
          "The idea goes back to Griewank and was popularised for deep learning by Chen and colleagues in 2016.",
          "The example shows activations piling up over the forward pass of an 8-layer model.",
          "Without checkpointing, peak activation memory is reached at the end of the forward pass.",
          "Freeing activations as the backward pass uses them reduces memory again.",
          "Checkpointing changes how much is kept, not what is computed.",
          "The result of training is identical with or without it."
        ],
        "example": "Writing down every step of a long calculation so you can check it, versus writing down a few milestones and redoing the steps between them when needed.",
        "code": "layers, per_layer_gb = 8, 1.5\nstored = 0.0\nfor L in range(1, layers + 1):\n    stored += per_layer_gb\n    print(f\"after layer {L}: {stored:4.1f} GB of activations stored\")",
        "output": "after layer 1:  1.5 GB of activations stored\nafter layer 2:  3.0 GB of activations stored\nafter layer 3:  4.5 GB of activations stored\nafter layer 4:  6.0 GB of activations stored\nafter layer 5:  7.5 GB of activations stored\nafter layer 6:  9.0 GB of activations stored\nafter layer 7: 10.5 GB of activations stored\nafter layer 8: 12.0 GB of activations stored",
        "codeNotes": [
          {
            "line": 4,
            "note": "Every layer adds its outputs to the store."
          }
        ],
        "tryIt": "How would this change with 32 layers?",
        "check": {
          "question": "Why are activations kept during the forward pass?",
          "options": [
            "For logging",
            "The backward pass needs them to compute gradients",
            "To speed up inference"
          ],
          "answer": 1,
          "why": "Gradients depend on the forward values."
        }
      },
      {
        "title": "Checkpointing every k layers",
        "say": [
          "With checkpointing every k layers, the model is divided into L/k segments, and only each segment's input is saved.",
          "During the backward pass, one segment at a time is recomputed from its saved input, so its k layers of activations exist briefly.",
          "Peak activation memory becomes about (L/k + k) layers' worth instead of L.",
          "Practice 1 is activation_memory(layers, per_layer_gb, every), which computes both versions.",
          "The example compares no checkpointing with several intervals for a 32-layer model.",
          "Checkpointing every 4 layers cuts memory from 48 GB to 18 GB in this example.",
          "Checkpointing every layer or every 32 layers helps less, because either the saved inputs or the segment size becomes large.",
          "The interval must divide the number of layers in this simple model.",
          "Frameworks let you wrap blocks with a checkpoint function, which is how the segments are defined.",
          "Selective checkpointing, which recomputes only cheap operations such as activations and normalisation, saves memory with even less extra compute."
        ],
        "example": "Keeping a photo at every fourth milestone of a hike, then retracing only one short stretch at a time when writing the story.",
        "code": "layers, per_layer = 32, 1.5\nprint(f\"no checkpointing: {layers * per_layer:.1f} GB\")\nfor every in [1, 2, 4, 8, 16, 32]:\n    mem = (layers / every + every) * per_layer\n    print(f\"checkpoint every {every:2}: {mem:5.1f} GB\")",
        "output": "no checkpointing: 48.0 GB\ncheckpoint every  1:  49.5 GB\ncheckpoint every  2:  27.0 GB\ncheckpoint every  4:  18.0 GB\ncheckpoint every  8:  18.0 GB\ncheckpoint every 16:  27.0 GB\ncheckpoint every 32:  49.5 GB",
        "codeNotes": [
          {
            "line": 4,
            "note": "Saved segment inputs plus one segment recomputed."
          }
        ],
        "tryIt": "Which interval gives the lowest memory, and why does it relate to the square root of 32?",
        "check": {
          "question": "What is saved when checkpointing every k layers?",
          "options": [
            "Nothing",
            "The input of each segment of k layers",
            "Every activation"
          ],
          "answer": 1,
          "why": "Only segment inputs are kept."
        }
      },
      {
        "title": "The square-root rule",
        "say": [
          "The expression L/k + k is smallest when k is close to the square root of L.",
          "For 36 layers, k = 6 gives 6 + 6 = 12 layers' worth of memory instead of 36.",
          "Practice 2 is best_interval(layers), which checks every divisor and returns the best one, preferring the smaller on ties.",
          "When L is not a perfect square, two divisors may tie: for 32 layers, k = 4 and k = 8 both give 12.",
          "For a prime number of layers, only 1 and L divide it, and they tie.",
          "The example searches all divisors for a few layer counts.",
          "This square-root saving is why checkpointing makes huge models trainable on limited hardware.",
          "In practice, transformer blocks are checkpointed individually, a simple and effective choice.",
          "Real-world memory also depends on which tensors each block keeps, so measure after choosing.",
          "Trying every option, as best_interval does, is a small but honest optimisation technique."
        ],
        "example": "Choosing how often to stop on a long drive: stopping too often wastes time, too rarely means a long stretch to redo if you miss a turn.",
        "code": "for L in [16, 24, 32, 36, 48]:\n    options = [(L / k + k, k) for k in range(1, L + 1) if L % k == 0]\n    cost, k = min(options)\n    print(f\"{L:2} layers: best interval {k} -> {cost:.0f} layers of memory\")",
        "output": "16 layers: best interval 4 -> 8 layers of memory\n24 layers: best interval 4 -> 10 layers of memory\n32 layers: best interval 4 -> 12 layers of memory\n36 layers: best interval 6 -> 12 layers of memory\n48 layers: best interval 6 -> 14 layers of memory",
        "codeNotes": [
          {
            "line": 2,
            "note": "Try every divisor."
          },
          {
            "line": 3,
            "note": "Smallest cost, then smallest k."
          }
        ],
        "tryIt": "For 48 layers, which divisors tie? Which one does min choose?",
        "check": {
          "question": "Around which value of k is L/k + k smallest?",
          "options": [
            "L",
            "The square root of L",
            "1"
          ],
          "answer": 1,
          "why": "Balance saved inputs and segment size."
        }
      },
      {
        "title": "The compute cost",
        "say": [
          "Recomputing activations means running parts of the forward pass twice.",
          "With full checkpointing, the extra cost is about one additional forward pass, roughly 33 percent more compute per step.",
          "The training FLOPs estimate becomes about 8 × parameters × tokens instead of 6 (Day 1).",
          "This extra compute is not counted in model FLOPs utilisation, which measures useful work only (Day 23).",
          "The example shows the step time with and without checkpointing for a sample model.",
          "Often the memory saved allows a larger micro-batch, which improves efficiency and can recover much of the lost speed.",
          "Selective checkpointing reduces the extra cost to a few percent in many transformer setups.",
          "Always compare total throughput, not just step time, when deciding.",
          "Checkpointing is a standard setting in large-model training recipes.",
          "Like accumulation, it is a trade: time for memory."
        ],
        "example": "Choosing to redo a few easy calculations rather than buying more notebooks to store every intermediate result.",
        "code": "forward_ms, backward_ms = 100, 200\nplain = forward_ms + backward_ms\ncheckpointed = forward_ms + (forward_ms + backward_ms)\nprint(f\"plain step: {plain} ms\")\nprint(f\"with full checkpointing: {checkpointed} ms (+{(checkpointed - plain) / plain:.0%})\")",
        "output": "plain step: 300 ms\nwith full checkpointing: 400 ms (+33%)",
        "codeNotes": [
          {
            "line": 3,
            "note": "The backward pass includes a recomputed forward."
          }
        ],
        "tryIt": "If checkpointing lets you double the micro-batch and the GPU becomes 20% more efficient, what happens to throughput?",
        "check": {
          "question": "About how much extra compute does full activation checkpointing add?",
          "options": [
            "None",
            "About one extra forward pass",
            "It doubles the backward pass"
          ],
          "answer": 1,
          "why": "Forward is recomputed once."
        }
      },
      {
        "title": "Putting the memory tools together",
        "say": [
          "Each memory technique shrinks a different part of the budget.",
          "Mixed precision halves 16-bit weights and activations; ZeRO and FSDP shard model states; checkpointing shrinks activations.",
          "Tensor and pipeline parallelism divide both parameters and activations across GPUs.",
          "Accumulation keeps activations small by using small micro-batches.",
          "The example applies these techniques one after another to a 13B model and prints the per-GPU memory at each stage.",
          "Order matters for understanding, not for the result: each technique multiplies its own part.",
          "A realistic plan usually applies several at once.",
          "The Day 30 capstone asks you to choose a combination for a given model and cluster.",
          "Memory is not the only constraint: each technique has a speed cost, so measure step time too.",
          "Being able to build this table is a sign of real understanding."
        ],
        "example": "Packing a suitcase: rolling clothes, using travel sizes and wearing the bulkiest items each save space in a different way.",
        "code": "params, gpus, layers, per_layer_act = 13e9, 64, 40, 2.0\nstates = 16 * params / 1e9\nacts = layers * per_layer_act\nprint(f\"start:              states {states:6.1f} GB + activations {acts:5.1f} GB = {states + acts:6.1f} GB\")\nstates = 16 * params / gpus / 1e9\nprint(f\"+ ZeRO-3 (64 GPUs): states {states:6.1f} GB + activations {acts:5.1f} GB = {states + acts:6.1f} GB\")\nacts = (layers / 5 + 5) * per_layer_act\nprint(f\"+ checkpoint /5:    states {states:6.1f} GB + activations {acts:5.1f} GB = {states + acts:6.1f} GB\")",
        "output": "start:              states  208.0 GB + activations  80.0 GB =  288.0 GB\n+ ZeRO-3 (64 GPUs): states    3.2 GB + activations  80.0 GB =   83.2 GB\n+ checkpoint /5:    states    3.2 GB + activations  26.0 GB =   29.2 GB",
        "codeNotes": [
          {
            "line": 5,
            "note": "Shard model states over 64 GPUs."
          },
          {
            "line": 7,
            "note": "Checkpoint every 5 layers."
          }
        ],
        "tryIt": "Which technique made the bigger difference for this model?",
        "check": {
          "question": "Which technique mainly shrinks activation memory?",
          "options": [
            "ZeRO stage 1",
            "Activation checkpointing",
            "Mixed precision master weights"
          ],
          "answer": 1,
          "why": "Checkpointing targets activations."
        }
      },
      {
        "title": "Practice time: checkpointing",
        "say": [
          "Practice 1: activation_memory(layers, per_layer_gb, every=None). Return layers × per_layer without checkpointing, or (layers/every + every) × per_layer with it, rounded to 2 decimals; raise ValueError if every does not divide layers.",
          "The checks include 32 layers with no checkpointing, every 4 and every 32, 36 layers every 6, and an invalid interval.",
          "Practice 2: best_interval(layers). Try every divisor and return the one with the smallest layers/k + k, smaller k on ties.",
          "The checks include 36, 32, 24, a prime number of layers and a single layer.",
          "After passing, compute the best memory for your favourite model's layer count.",
          "The example builds a small table for common model depths.",
          "Tomorrow implements the optimizers themselves: SGD with momentum and Adam.",
          "Checkpointing is simple to switch on but powerful; knowing its maths lets you predict the saving.",
          "Measured savings may differ because of attention memory and other buffers.",
          "If best_interval returns the wrong divisor on ties, check the order of your comparison."
        ],
        "example": "A hiker planning rest stops on routes of different lengths.",
        "code": "for name, L in [(\"GPT-2 small\", 12), (\"7B-class\", 32), (\"13B-class\", 40), (\"70B-class\", 80)]:\n    best = min(((L / k + k, k) for k in range(1, L + 1) if L % k == 0))\n    print(f\"{name:11} {L:2} layers: checkpoint every {best[1]:2} -> {best[0]:4.0f} layers of activations instead of {L}\")",
        "output": "GPT-2 small 12 layers: checkpoint every  3 ->    7 layers of activations instead of 12\n7B-class    32 layers: checkpoint every  4 ->   12 layers of activations instead of 32\n13B-class   40 layers: checkpoint every  5 ->   13 layers of activations instead of 40\n70B-class   80 layers: checkpoint every  8 ->   18 layers of activations instead of 80",
        "codeNotes": [
          {
            "line": 2,
            "note": "Smallest memory, then smallest interval."
          }
        ],
        "tryIt": "By what factor does checkpointing cut activation memory for the 80-layer model?",
        "check": {
          "question": "What should activation_memory(32, 1.5, every=5) do?",
          "options": [
            "Return 24.9",
            "Raise ValueError",
            "Round 5 to 4"
          ],
          "answer": 1,
          "why": "5 does not divide 32."
        }
      }
    ],
    "summary": [
      "Activations are stored for the backward pass and grow with depth.",
      "Checkpointing every k layers needs about (L/k + k) layers of memory.",
      "The best k is near the square root of L.",
      "Cost: about one extra forward pass (8 × N × D FLOPs instead of 6).",
      "Combine precision, sharding, checkpointing and parallelism for big models."
    ],
    "projectStep": {
      "title": "Training planner, part 13",
      "steps": [
        "Implement activation_memory and best_interval.",
        "Build a memory table applying each technique in turn.",
        "Estimate the throughput cost of checkpointing for your model."
      ]
    }
  },
  {
    "day": 14,
    "title": "Optimizers From Scratch: SGD, Momentum and Adam",
    "goal": "You can implement SGD with momentum and Adam with bias correction, explain what their states store, and relate optimizer choice to memory use in distributed training.",
    "minutes": 30,
    "recap": "We have counted optimizer states as bytes for several days. Today we implement the optimizers themselves, so those bytes have a meaning.",
    "parts": [
      {
        "title": "Plain SGD and its limits",
        "say": [
          "Plain stochastic gradient descent updates each weight with w = w − lr × gradient.",
          "It needs no extra memory beyond the gradients, which is attractive.",
          "But it struggles with ravines: valleys that are steep in one direction and flat in another.",
          "In a ravine, SGD zig-zags across the steep direction while crawling slowly along the flat one.",
          "The example runs SGD on a stretched bowl-shaped function and shows the zig-zag.",
          "A smaller learning rate stops the zig-zag but makes progress along the flat direction even slower.",
          "Loss surfaces of real neural networks are full of such ravines.",
          "Momentum and adaptive methods were invented to fix exactly this.",
          "Understanding the failure makes the fixes intuitive.",
          "We use a simple two-parameter function so every number can be followed."
        ],
        "example": "A ball rolling down a narrow, steep-sided gutter that bounces from side to side instead of rolling straight down.",
        "code": "def grad(x, y):\n    return 10 * x, 0.2 * y\n\nx, y, lr = 1.0, 10.0, 0.18\nfor step in range(1, 7):\n    gx, gy = grad(x, y)\n    x, y = x - lr * gx, y - lr * gy\n    print(f\"step {step}: x={x:+.3f} y={y:.3f}\")",
        "output": "step 1: x=-0.800 y=9.640\nstep 2: x=+0.640 y=9.293\nstep 3: x=-0.512 y=8.958\nstep 4: x=+0.410 y=8.636\nstep 5: x=-0.328 y=8.325\nstep 6: x=+0.262 y=8.025",
        "codeNotes": [
          {
            "line": 2,
            "note": "Steep in x, flat in y."
          },
          {
            "line": 7,
            "note": "Plain gradient descent."
          }
        ],
        "tryIt": "Why does x flip sign every step while y barely changes?",
        "check": {
          "question": "What problem does SGD have in ravines?",
          "options": [
            "It uses too much memory",
            "It zig-zags across the steep direction and crawls along the flat one",
            "It cannot compute gradients"
          ],
          "answer": 1,
          "why": "One learning rate suits neither direction."
        }
      },
      {
        "title": "Momentum",
        "say": [
          "Momentum keeps a velocity v that accumulates past gradients: v = β·v + gradient, then w = w − lr·v.",
          "Consistent gradient directions build up speed; directions that flip back and forth cancel out.",
          "β, often 0.9, controls how much of the past is remembered.",
          "Practice 1 is momentum_step(w, g, v, lr, beta), which updates lists of weights and velocities.",
          "The example repeats yesterday's ravine with momentum and reaches the bottom far faster along the flat direction.",
          "Momentum needs one extra value per parameter: the velocity, 4 bytes in FP32.",
          "With β = 0, momentum reduces to plain SGD, which is a useful test.",
          "Nesterov momentum, a small variant, looks ahead before computing the gradient and is often slightly better.",
          "SGD with momentum remains popular for training convolutional image models.",
          "For transformers, adaptive methods like Adam usually work better."
        ],
        "example": "A heavy ball rolling downhill: it keeps moving in the consistent direction and is not thrown about by every bump.",
        "code": "def grad(x, y):\n    return 10 * x, 0.2 * y\n\nfor beta in [0.0, 0.9]:\n    x, y, vx, vy, lr = 1.0, 10.0, 0.0, 0.0, 0.02\n    for step in range(60):\n        gx, gy = grad(x, y)\n        vx, vy = beta * vx + gx, beta * vy + gy\n        x, y = x - lr * vx, y - lr * vy\n    print(f\"beta={beta}: after 60 steps x={x:+.4f} y={y:.4f}\")",
        "output": "beta=0.0: after 60 steps x=+0.0000 y=7.8625\nbeta=0.9: after 60 steps x=-0.0365 y=0.1547",
        "codeNotes": [
          {
            "line": 8,
            "note": "Velocity accumulates gradients."
          },
          {
            "line": 9,
            "note": "Step along the velocity."
          }
        ],
        "tryIt": "Try beta = 0.99. Is more momentum always better?",
        "check": {
          "question": "What extra state does momentum keep per parameter?",
          "options": [
            "Nothing",
            "A velocity",
            "Two moments"
          ],
          "answer": 1,
          "why": "One velocity value per parameter."
        }
      },
      {
        "title": "Adam",
        "say": [
          "Adam keeps two running averages per parameter: m, an average of gradients (like momentum), and v, an average of squared gradients.",
          "The update divides m by the square root of v, so each parameter gets its own effective step size.",
          "Parameters with consistently large gradients take smaller steps; those with small gradients take relatively bigger ones.",
          "Because m and v start at zero, they are biased towards zero early on; Adam corrects this by dividing by 1 − β1^t and 1 − β2^t.",
          "Practice 2 is the Adam class, whose step method applies these rules and counts steps.",
          "The example runs Adam on the ravine and shows it moving steadily in both directions.",
          "On the very first step, the corrected m equals the gradient and the corrected v equals its square, so every parameter moves by about the learning rate.",
          "Default values are β1 = 0.9, β2 = 0.999 and ε = 1e-8, with learning rates around 1e-4 to 3e-4 for large transformers.",
          "AdamW, the variant used for most language models, applies weight decay directly to the weights rather than through the gradient.",
          "Adam's two states are why it needs 8 extra bytes per parameter in FP32."
        ],
        "example": "A hiker who remembers both the general direction of the path and how rocky each part has been, taking smaller steps on rough ground.",
        "code": "import math\n\ndef grad(x, y):\n    return 10 * x, 0.2 * y\n\np = [1.0, 10.0]\nm, v, lr, b1, b2 = [0.0, 0.0], [0.0, 0.0], 0.5, 0.9, 0.999\nfor t in range(1, 61):\n    g = grad(*p)\n    for i in range(2):\n        m[i] = b1 * m[i] + (1 - b1) * g[i]\n        v[i] = b2 * v[i] + (1 - b2) * g[i] ** 2\n        p[i] -= lr * (m[i] / (1 - b1 ** t)) / (math.sqrt(v[i] / (1 - b2 ** t)) + 1e-8)\n    if t in (1, 10, 30, 60):\n        print(f\"step {t:2}: x={p[0]:+.3f} y={p[1]:+.3f}\")",
        "output": "step  1: x=+0.500 y=+9.500\nstep 10: x=+0.180 y=+5.123\nstep 30: x=+0.136 y=-1.027\nstep 60: x=+0.011 y=+0.215",
        "codeNotes": [
          {
            "line": 13,
            "note": "Bias-corrected moments; each parameter gets its own step size."
          }
        ],
        "tryIt": "Why does y, the flat direction, move much faster with Adam than with plain SGD?",
        "check": {
          "question": "What does Adam's second moment v track?",
          "options": [
            "The learning rate",
            "A running average of squared gradients",
            "The weights"
          ],
          "answer": 1,
          "why": "v adapts each parameter's step size."
        }
      },
      {
        "title": "Optimizers and memory",
        "say": [
          "Optimizer states are a large part of training memory, and they depend on the optimizer.",
          "SGD: none. Momentum: one value per parameter. Adam and AdamW: two values per parameter.",
          "In mixed precision, the master weights add another FP32 copy, giving the 12 bytes of optimizer state per parameter we have used since Day 8.",
          "Memory-light alternatives include Adafactor, which stores factored second moments, and 8-bit Adam, which quantises states.",
          "Newer optimizers such as Lion keep only one state and are sometimes used to save memory.",
          "The example compares optimizer state memory for a 7B model.",
          "ZeRO stage 1 shards exactly these states, which is why it helps so much.",
          "Changing the optimizer changes both memory and training behaviour, so it needs careful evaluation.",
          "Most large-model recipes still use AdamW because it is reliable.",
          "Knowing the state sizes lets you predict memory before trying a new optimizer."
        ],
        "example": "Different note-taking styles: no notes, one line of notes per topic, or two detailed lines per topic.",
        "code": "params = 7e9\nstates = {\"SGD\": 0, \"SGD + momentum\": 4, \"Adam / AdamW\": 8, \"8-bit Adam\": 2, \"Lion\": 4}\nfor name, b in states.items():\n    print(f\"{name:15} {b} bytes/param -> {params * b / 1e9:5.1f} GB of optimizer state\")",
        "output": "SGD             0 bytes/param ->   0.0 GB of optimizer state\nSGD + momentum  4 bytes/param ->  28.0 GB of optimizer state\nAdam / AdamW    8 bytes/param ->  56.0 GB of optimizer state\n8-bit Adam      2 bytes/param ->  14.0 GB of optimizer state\nLion            4 bytes/param ->  28.0 GB of optimizer state",
        "codeNotes": [
          {
            "line": 2,
            "note": "FP32 bytes per parameter for the extra states, excluding master weights."
          }
        ],
        "tryIt": "How much memory would 8-bit Adam save compared with AdamW on a 70B model?",
        "check": {
          "question": "How many extra FP32 values per parameter does Adam keep?",
          "options": [
            "0",
            "2",
            "4"
          ],
          "answer": 1,
          "why": "m and v."
        }
      },
      {
        "title": "Optimizers in distributed training",
        "say": [
          "With data parallelism, every GPU runs the same optimizer step on the same averaged gradients, so the states stay identical.",
          "With ZeRO or FSDP, each GPU steps only its own shard of the parameters and keeps only that shard's states.",
          "Because Adam works parameter by parameter, sharding it is straightforward: no parameter needs another's state.",
          "Some optimizers that use whole-matrix statistics, such as Shampoo, need more careful distribution.",
          "The example splits Adam's work across 4 simulated shards and checks that the result equals the unsharded update.",
          "Checkpoints must save optimizer states along with weights, or training cannot resume exactly (Day 17).",
          "Gradient clipping (Day 16) is applied before the optimizer step, using the global norm across all shards.",
          "Learning rate schedules (Day 15) set the lr passed into each step.",
          "These pieces fit together into the full update step of a distributed training loop.",
          "Being able to implement an optimizer from scratch is a strong foundation for debugging real ones."
        ],
        "example": "Several accountants each balancing a different set of accounts using the same rules; together, the books are complete.",
        "code": "import math\n\ndef adam_first_step(w, g, lr=0.1):\n    m, v = 0.1 * g, 0.001 * g * g\n    return w - lr * (m / 0.1) / (math.sqrt(v / 0.001) + 1e-8)\n\nw = [0.5, -1.0, 2.0, 0.0, 1.5, -0.5, 0.25, 1.0]\ng = [0.2, -0.1, 0.4, 0.0, -0.3, 0.05, 0.1, -0.2]\nwhole = [round(adam_first_step(a, b), 4) for a, b in zip(w, g)]\nsharded = []\nfor s in range(4):\n    sharded += [round(adam_first_step(a, b), 4) for a, b in zip(w[2 * s:2 * s + 2], g[2 * s:2 * s + 2])]\nprint(\"unsharded:\", whole)\nprint(\"4 shards: \", sharded)\nprint(\"identical:\", whole == sharded)",
        "output": "unsharded: [0.4, -0.9, 1.9, 0.0, 1.6, -0.6, 0.15, 1.1]\n4 shards:  [0.4, -0.9, 1.9, 0.0, 1.6, -0.6, 0.15, 1.1]\nidentical: True",
        "codeNotes": [
          {
            "line": 4,
            "note": "First-step moments; bias correction divides them back."
          },
          {
            "line": 12,
            "note": "Each shard steps its own parameters."
          }
        ],
        "tryIt": "Why does the parameter with gradient 0.0 not move?",
        "check": {
          "question": "Why is Adam easy to shard?",
          "options": [
            "It has no state",
            "Its update for each parameter uses only that parameter's own values",
            "It is always in FP16"
          ],
          "answer": 1,
          "why": "Element-wise optimizers shard naturally."
        }
      },
      {
        "title": "Practice time: optimizers",
        "say": [
          "Practice 1: momentum_step(w, g, v, lr, beta). For each position, v_new = beta·v + g and w_new = w − lr·v_new; return both lists rounded to 6 decimals.",
          "The checks follow two steps where momentum builds up, and a case with beta 0 behaving like SGD.",
          "Practice 2: Adam(lr, beta1, beta2, eps) with step(w, g). Keep unrounded m, v and t; apply bias correction; return the new weights rounded to 6 decimals.",
          "The checks confirm the first step moves each weight by the learning rate, check the second step's exact values and the step counter, and test a zero gradient.",
          "After passing, train the Day 2 line with your Adam and compare the number of steps needed with plain gradient descent.",
          "The example runs that comparison.",
          "Tomorrow varies the learning rate itself over the course of training.",
          "Implementing Adam yourself explains every line of its documentation.",
          "Keep m and v unrounded: rounding internal state would slowly change the results.",
          "If the second step differs, check that t is incremented before computing the bias corrections."
        ],
        "example": "Rebuilding a familiar engine on the workbench to understand every part.",
        "code": "import math\n\nxs, ys = [0, 1, 2, 3, 4], [1, 3, 5, 7, 9]\nw = [0.0, 0.0]\nm, v = [0.0, 0.0], [0.0, 0.0]\nfor t in range(1, 501):\n    e = [w[0] * x + w[1] - y for x, y in zip(xs, ys)]\n    g = [sum(2 * ei * x for ei, x in zip(e, xs)) / 5, sum(2 * ei for ei in e) / 5]\n    for i in range(2):\n        m[i] = 0.9 * m[i] + 0.1 * g[i]\n        v[i] = 0.999 * v[i] + 0.001 * g[i] ** 2\n        w[i] -= 0.1 * (m[i] / (1 - 0.9 ** t)) / (math.sqrt(v[i] / (1 - 0.999 ** t)) + 1e-8)\nprint(f\"Adam after 500 steps: w={w[0]:.3f} b={w[1]:.3f}\")",
        "output": "Adam after 500 steps: w=2.000 b=1.000",
        "codeNotes": [
          {
            "line": 12,
            "note": "The full Adam update with bias correction."
          }
        ],
        "tryIt": "Try a learning rate of 0.01. How many steps does Adam need now?",
        "check": {
          "question": "On Adam's first step, about how far does each weight move?",
          "options": [
            "By its gradient",
            "By about the learning rate",
            "Not at all"
          ],
          "answer": 1,
          "why": "The bias-corrected ratio m/√v is about ±1 on the first step."
        }
      }
    ],
    "summary": [
      "SGD zig-zags in ravines; momentum smooths and accelerates it.",
      "Momentum: v = βv + g, w = w − lr·v (one state per parameter).",
      "Adam: running m and v with bias correction; per-parameter step sizes.",
      "Adam/AdamW keep 8 extra bytes per parameter; alternatives save memory.",
      "Element-wise optimizers shard naturally with ZeRO and FSDP."
    ],
    "projectStep": {
      "title": "Training planner, part 14",
      "steps": [
        "Implement momentum_step and the Adam class.",
        "Compare SGD, momentum and Adam on the ravine and the line.",
        "Add optimizer state sizes to your memory planner."
      ]
    }
  },
  {
    "day": 15,
    "title": "Learning Rate Schedules: Warmup and Cosine Decay",
    "goal": "You can implement a linear warmup followed by cosine decay, implement step decay, and explain why large-batch and large-model training need learning rate schedules.",
    "minutes": 30,
    "recap": "Yesterday's optimizers took a learning rate as input. Today that rate changes over time, which is one of the most important ingredients of stable large-scale training.",
    "parts": [
      {
        "title": "Why change the learning rate",
        "say": [
          "Early in training, weights are random and gradients can be large and erratic; big steps can throw the model into a bad region.",
          "In the middle, a fairly large learning rate makes fast progress.",
          "Near the end, smaller steps let the model settle into a good minimum instead of bouncing around it.",
          "A learning rate schedule is a rule giving the learning rate at every step.",
          "The example prints a simple three-phase plan for a 10,000-step run.",
          "Large batches and large models are especially sensitive to the early phase, which is why warmup became standard.",
          "Adam's second-moment estimates are also unreliable in the first steps, another reason for warmup.",
          "Schedules are defined in terms of optimizer steps, not micro-batches (Day 6).",
          "The schedule is part of the training recipe and must be recorded and checkpointed.",
          "Most modern language models use warmup followed by cosine decay."
        ],
        "example": "Driving a car: pull away gently, cruise at speed on the motorway, and slow down smoothly as you approach your destination.",
        "code": "plan = [(\"warmup\", 0, 500, \"rise from near 0 to the peak\"),\n        (\"main phase\", 500, 9000, \"large steps, fast progress\"),\n        (\"final phase\", 9000, 10000, \"small steps to settle\")]\nfor name, start, end, what in plan:\n    print(f\"{name:12} steps {start:5}-{end:5}: {what}\")",
        "output": "warmup       steps     0-  500: rise from near 0 to the peak\nmain phase   steps   500- 9000: large steps, fast progress\nfinal phase  steps  9000-10000: small steps to settle",
        "codeNotes": [
          {
            "line": 1,
            "note": "Warmup takes a small fraction of the run."
          }
        ],
        "tryIt": "What might go wrong if you started a large model at its peak learning rate?",
        "check": {
          "question": "Why use warmup?",
          "options": [
            "To save memory",
            "Early gradients are erratic, so big steps at the start can destabilise training",
            "To speed up the end of training"
          ],
          "answer": 1,
          "why": "Start gently while things settle."
        }
      },
      {
        "title": "Linear warmup",
        "say": [
          "In linear warmup, the learning rate rises in a straight line from near zero to the peak over a number of warmup steps.",
          "A common formula is max_lr × (step + 1) / warmup, so the very first step already uses a small non-zero rate.",
          "Warmup lengths range from a few hundred to a few thousand steps, often about 1 percent of training.",
          "Larger batches and higher peak rates usually need longer warmup.",
          "The example prints the learning rate at several warmup steps.",
          "Warmup is cheap insurance: it costs almost nothing in total training time.",
          "Some recipes warm up for a number of tokens rather than steps, which matters when batch size changes.",
          "After warmup, the learning rate reaches exactly max_lr, where decay begins.",
          "Mistakes in warmup, such as starting at zero forever, show up as a flat loss curve at the very beginning.",
          "Always plot the schedule before launching a long run."
        ],
        "example": "Warming up before a race: a few minutes of gentle jogging prevents injuries at full speed.",
        "code": "max_lr, warmup = 3e-4, 1000\nfor step in [0, 99, 499, 999]:\n    print(f\"step {step:4}: lr = {max_lr * (step + 1) / warmup:.2e}\")",
        "output": "step    0: lr = 3.00e-07\nstep   99: lr = 3.00e-05\nstep  499: lr = 1.50e-04\nstep  999: lr = 3.00e-04",
        "codeNotes": [
          {
            "line": 3,
            "note": "A straight line up to max_lr."
          }
        ],
        "tryIt": "What learning rate does step 249 use?",
        "check": {
          "question": "What is the learning rate at the last warmup step?",
          "options": [
            "0",
            "max_lr",
            "Half of max_lr"
          ],
          "answer": 1,
          "why": "Warmup ends at the peak."
        }
      },
      {
        "title": "Cosine decay",
        "say": [
          "After warmup, cosine decay lowers the learning rate smoothly following half a cosine wave.",
          "Progress p runs from 0 at the end of warmup to 1 at the last step; the rate is min_lr + 0.5 × (max_lr − min_lr) × (1 + cos(π × p)).",
          "At p = 0, the cosine is 1, giving max_lr; at p = 0.5, it is 0, giving halfway; at p = 1, it is −1, giving min_lr.",
          "Practice 1 is lr_at(step, max_lr, warmup, total, min_lr), which handles warmup, decay and steps after the end.",
          "The example prints the full schedule at a few points.",
          "A min_lr of about one tenth of max_lr is a common choice for language models.",
          "Cosine decay spends a long time at fairly high rates and slows down gently, which works well in practice.",
          "Because the total number of steps must be known in advance, extending a run later requires care.",
          "Warmup-stable-decay schedules, with a long flat phase, make extending runs easier and are increasingly popular.",
          "Rounding the rate to 8 decimals keeps printed values tidy without affecting training."
        ],
        "example": "A sunset: the light fades slowly at first, then faster, then gently settles into dusk.",
        "code": "import math\n\ndef lr_at(step, max_lr=3e-4, warmup=100, total=1000, min_lr=3e-5):\n    if step < warmup:\n        return max_lr * (step + 1) / warmup\n    if step >= total:\n        return min_lr\n    p = (step - warmup) / (total - warmup)\n    return min_lr + 0.5 * (max_lr - min_lr) * (1 + math.cos(math.pi * p))\n\nfor step in [0, 50, 99, 100, 325, 550, 775, 999, 1200]:\n    print(f\"step {step:4}: {lr_at(step):.2e}\")",
        "output": "step    0: 3.00e-06\nstep   50: 1.53e-04\nstep   99: 3.00e-04\nstep  100: 3.00e-04\nstep  325: 2.60e-04\nstep  550: 1.65e-04\nstep  775: 6.95e-05\nstep  999: 3.00e-05\nstep 1200: 3.00e-05",
        "codeNotes": [
          {
            "line": 8,
            "note": "Progress through the decay phase."
          },
          {
            "line": 9,
            "note": "Half a cosine wave from max_lr to min_lr."
          }
        ],
        "tryIt": "At step 550, halfway through decay, what is the learning rate in terms of max_lr and min_lr?",
        "check": {
          "question": "What is the cosine schedule's learning rate at the very end of decay?",
          "options": [
            "max_lr",
            "min_lr",
            "Zero always"
          ],
          "answer": 1,
          "why": "cos(π) = −1 gives min_lr."
        }
      },
      {
        "title": "Step decay",
        "say": [
          "Step decay keeps the learning rate constant for a while, then multiplies it by a factor, such as 0.1 or 0.5, at fixed intervals.",
          "The formula is base_lr × drop^(step // every).",
          "It was the standard schedule for image models such as ResNet, often dropping by ten times at fixed epochs.",
          "Practice 2 is step_decay(step, base_lr, drop, every) plus schedule(steps, base_lr, drop, every), which lists each distinct rate and where it starts.",
          "The example prints a step-decay schedule and the loss behaviour it often produces.",
          "Loss curves under step decay show characteristic sudden drops right after each learning-rate drop.",
          "Step decay is easy to reason about and to extend, which keeps it useful.",
          "Integer division, the // operator, counts how many drops have happened.",
          "Very small learning rates at the end rarely help much; stopping earlier may save compute.",
          "Comparing schedules on small runs before choosing one for a big run is good practice."
        ],
        "example": "Going down a staircase rather than a ramp: flat stretches with sudden drops.",
        "code": "base, drop, every = 0.1, 0.1, 30\nfor s in range(0, 100, 30):\n    print(f\"steps {s:2}-{s + every - 1:2}: lr = {base * drop ** (s // every):.4f}\")",
        "output": "steps  0-29: lr = 0.1000\nsteps 30-59: lr = 0.0100\nsteps 60-89: lr = 0.0010\nsteps 90-119: lr = 0.0001",
        "codeNotes": [
          {
            "line": 3,
            "note": "One drop for every completed interval."
          }
        ],
        "tryIt": "What learning rate does step 95 use?",
        "check": {
          "question": "What does step // every count in step decay?",
          "options": [
            "Epochs",
            "How many drops have happened",
            "The warmup"
          ],
          "answer": 1,
          "why": "Integer division counts completed intervals."
        }
      },
      {
        "title": "Schedules in practice",
        "say": [
          "In distributed training, the schedule must be identical on every rank, which is automatic when it depends only on the step count.",
          "After resuming from a checkpoint, the scheduler must continue from the saved step, not restart from zero (Day 17).",
          "If the global batch changes, for example in elastic training, the schedule may need to be defined in tokens to stay consistent.",
          "The example shows what goes wrong if a resumed run forgets the saved step.",
          "A second warmup in the middle of training, caused by a reset scheduler, can destabilise a run and waste days of compute.",
          "Logging the learning rate with the loss makes such bugs obvious on a chart.",
          "Schedules also interact with gradient clipping and loss scaling, so change one thing at a time.",
          "Hyperparameter searches on small models help choose peak rates and warmup lengths for big ones.",
          "Scaling laws research (Day 22) also studied how the best learning rate changes with model size.",
          "Good schedules are simple, logged and saved with the checkpoint."
        ],
        "example": "A recipe that says \"bake at 200°C, then lower to 160°C after 20 minutes\": if you forget how long it has been baking, the result suffers.",
        "code": "import math\n\ndef lr(step):\n    if step < 100:\n        return 3e-4 * (step + 1) / 100\n    return 3e-5 + 0.5 * 2.7e-4 * (1 + math.cos(math.pi * (step - 100) / 900))\n\nresume_step = 600\nprint(f\"correct resume at step {resume_step}: lr = {lr(resume_step):.2e}\")\nprint(f\"buggy resume from step 0:      lr = {lr(0):.2e}, then a second warmup\")",
        "output": "correct resume at step 600: lr = 1.42e-04\nbuggy resume from step 0:      lr = 3.00e-06, then a second warmup",
        "codeNotes": [
          {
            "line": 9,
            "note": "Continue from the saved step."
          },
          {
            "line": 10,
            "note": "A reset scheduler repeats warmup."
          }
        ],
        "tryIt": "How would you notice a scheduler reset on a training dashboard?",
        "check": {
          "question": "What must a resumed run restore for the schedule?",
          "options": [
            "Nothing",
            "The step count",
            "The random seed only"
          ],
          "answer": 1,
          "why": "The schedule depends on the step."
        }
      },
      {
        "title": "Practice time: schedules",
        "say": [
          "Practice 1: lr_at(step, max_lr, warmup, total, min_lr=0.0). Warmup gives max_lr × (step + 1)/warmup; from step >= total return min_lr; otherwise apply cosine decay; round to 8 decimals.",
          "The checks include the first warmup step, the end of warmup, the start and halfway point of decay, and the floor after the end.",
          "Practice 2: step_decay(step, base_lr, drop, every) returns base_lr × drop^(step // every) rounded to 8 decimals, and schedule(steps, base_lr, drop, every) lists (first_step, lr) for each distinct rate.",
          "The checks include values before and after the first drop, a steep drop factor and short and long runs.",
          "After passing, print both schedules side by side for a 1000-step run and compare them.",
          "The example prints that comparison at a few points.",
          "Tomorrow covers training stability: clipping gradients and spotting loss spikes before they ruin a run.",
          "A good schedule is one of the cheapest ways to improve training results.",
          "Keep your lr_at function: the capstone planner uses it.",
          "If a halfway check fails, check the progress formula uses total − warmup in the denominator."
        ],
        "example": "Comparing two route plans on a map before setting off on a long journey.",
        "code": "import math\n\ndef cosine(step, max_lr=0.1, warmup=50, total=1000):\n    if step < warmup:\n        return max_lr * (step + 1) / warmup\n    return 0.5 * max_lr * (1 + math.cos(math.pi * (step - warmup) / (total - warmup)))\n\nfor step in [0, 49, 250, 500, 750, 999]:\n    print(f\"step {step:3}: cosine {cosine(step):.4f}  step-decay {0.1 * 0.5 ** (step // 300):.4f}\")",
        "output": "step   0: cosine 0.0020  step-decay 0.1000\nstep  49: cosine 0.1000  step-decay 0.1000\nstep 250: cosine 0.0895  step-decay 0.1000\nstep 500: cosine 0.0541  step-decay 0.0500\nstep 750: cosine 0.0161  step-decay 0.0250\nstep 999: cosine 0.0000  step-decay 0.0125",
        "codeNotes": [
          {
            "line": 9,
            "note": "Step decay halves every 300 steps."
          }
        ],
        "tryIt": "Which schedule gives a larger learning rate at step 500?",
        "check": {
          "question": "What does lr_at return for steps at or after total?",
          "options": [
            "max_lr",
            "min_lr",
            "An error"
          ],
          "answer": 1,
          "why": "After the end, stay at the floor."
        }
      }
    ],
    "summary": [
      "Schedules change the learning rate over training.",
      "Linear warmup: max_lr × (step + 1)/warmup.",
      "Cosine decay: min_lr + 0.5 (max_lr − min_lr)(1 + cos(π p)).",
      "Step decay: base_lr × drop^(step // every).",
      "Resume schedules from the saved step and log the learning rate."
    ],
    "projectStep": {
      "title": "Training planner, part 15",
      "steps": [
        "Implement lr_at, step_decay and schedule.",
        "Plot or print both schedules for a 1000-step run.",
        "Add the chosen schedule to your training plan."
      ]
    }
  },
  {
    "day": 16,
    "title": "Gradient Clipping and Training Stability",
    "goal": "You can compute the global gradient norm, clip gradients by it, detect loss spikes and NaNs automatically, and describe the usual causes and fixes of unstable training.",
    "minutes": 30,
    "recap": "Schedules and optimizers decide the size of each step. Sometimes a single bad batch or an unlucky moment produces a huge gradient; today we stop such steps from wrecking a run.",
    "parts": [
      {
        "title": "Exploding gradients",
        "say": [
          "Occasionally a gradient becomes enormous, for example because of an unusual batch or a sharp region of the loss surface.",
          "A huge gradient multiplied by the learning rate produces a huge update, which can push the model into a region it never recovers from.",
          "The loss then spikes upwards, and sometimes becomes infinite or NaN (not a number).",
          "In a long, expensive run, this can waste days of compute.",
          "The example shows how a single large gradient throws a weight far off course.",
          "Large language models are especially prone to occasional loss spikes.",
          "Teams training large models report spikes openly, for example in the OPT and BLOOM logbooks, which are worth reading.",
          "The two main defences are gradient clipping and monitoring with automatic responses.",
          "Good initialisation, warmup and sensible learning rates prevent many spikes in the first place.",
          "Today we implement both defences."
        ],
        "example": "A car hitting a pothole at speed: one jolt can send it off the road unless something limits the steering.",
        "code": "w, lr = 1.0, 0.01\ngrads = [0.5, 0.4, 0.6, 250.0, 0.5]\nfor step, g in enumerate(grads, 1):\n    w -= lr * g\n    print(f\"step {step}: gradient {g:6.1f} -> w = {w:.3f}\")",
        "output": "step 1: gradient    0.5 -> w = 0.995\nstep 2: gradient    0.4 -> w = 0.991\nstep 3: gradient    0.6 -> w = 0.985\nstep 4: gradient  250.0 -> w = -1.515\nstep 5: gradient    0.5 -> w = -1.520",
        "codeNotes": [
          {
            "line": 2,
            "note": "One gradient is hundreds of times larger than the rest."
          }
        ],
        "tryIt": "How many normal steps would it take to undo the damage from step 4?",
        "check": {
          "question": "What is a loss spike?",
          "options": [
            "A normal drop in loss",
            "A sudden jump upwards in the loss",
            "A saved checkpoint"
          ],
          "answer": 1,
          "why": "Spikes are sudden increases."
        }
      },
      {
        "title": "The global gradient norm",
        "say": [
          "The global gradient norm measures the total size of all gradients together.",
          "It is the square root of the sum of the squares of every gradient value, across every layer.",
          "This is the familiar Euclidean length, extended to millions or billions of values.",
          "Watching the norm over time shows when training becomes unstable: spikes in the norm usually come before spikes in the loss.",
          "In sharded training, each GPU computes the sum of squares for its own shard, and an all-reduce adds them before the square root.",
          "The example computes the global norm for gradients spread over three layers.",
          "The norm is logged in almost every serious training run.",
          "A slowly rising norm can signal a learning rate that is too high.",
          "A norm of exactly zero means no learning is happening, often because of a bug.",
          "The norm also tells you how often clipping will activate."
        ],
        "example": "Measuring the total distance of a journey with many legs: square each leg, add them up and take the square root, as if all legs were at right angles.",
        "code": "import math\n\ngrads = [[0.3, -0.4], [1.2], [0.0, 0.5, -0.2]]\nsum_sq = sum(v * v for layer in grads for v in layer)\nprint(f\"sum of squares: {sum_sq:.2f}\")\nprint(f\"global norm:    {math.sqrt(sum_sq):.4f}\")",
        "output": "sum of squares: 1.98\nglobal norm:    1.4071",
        "codeNotes": [
          {
            "line": 4,
            "note": "Every value in every layer."
          }
        ],
        "tryIt": "In a sharded run, what must be all-reduced to compute this norm?",
        "check": {
          "question": "How is the global gradient norm computed?",
          "options": [
            "Largest gradient value",
            "Square root of the sum of squares of all gradient values",
            "Average gradient"
          ],
          "answer": 1,
          "why": "It is the Euclidean length of all gradients together."
        }
      },
      {
        "title": "Clipping by global norm",
        "say": [
          "Gradient clipping limits the global norm to a maximum, often 1.0 for language models.",
          "If the norm exceeds the maximum, every gradient value is multiplied by max_norm / norm, shrinking the whole vector to exactly the maximum length.",
          "The direction of the update stays the same; only its size is capped.",
          "Practice 1 is clip_by_global_norm(grads, max_norm), which returns the clipped gradients and the original norm.",
          "The example clips gradients whose norm is 5 down to 1.",
          "Clipping by global norm is better than clipping each value separately, which would change the direction.",
          "In PyTorch this is torch.nn.utils.clip_grad_norm_, which also returns the norm for logging.",
          "Clipping happens after gradients are averaged and unscaled (Day 7), and before the optimizer step.",
          "If clipping activates on nearly every step, the maximum may be too low or the learning rate too high.",
          "Clipping is a safety belt, not a cure: repeated large norms need investigation."
        ],
        "example": "A speed limiter on a van: it can still go in any direction, but never faster than the limit.",
        "code": "import math\n\ngrads = [[3.0], [4.0]]\nmax_norm = 1.0\nnorm = math.sqrt(sum(v * v for layer in grads for v in layer))\nscale = max_norm / norm if norm > max_norm else 1.0\nclipped = [[round(v * scale, 4) for v in layer] for layer in grads]\nprint(f\"norm before: {norm}, scale: {scale}, clipped: {clipped}\")\nprint(f\"norm after:  {math.sqrt(sum(v * v for layer in clipped for v in layer)):.4f}\")",
        "output": "norm before: 5.0, scale: 0.2, clipped: [[0.6], [0.8]]\nnorm after:  1.0000",
        "codeNotes": [
          {
            "line": 6,
            "note": "Only shrink when the norm is too large."
          }
        ],
        "tryIt": "What happens to gradients whose norm is 0.5 with max_norm 1.0?",
        "check": {
          "question": "What does global-norm clipping preserve?",
          "options": [
            "The size of the update",
            "The direction of the update",
            "Nothing"
          ],
          "answer": 1,
          "why": "All values are scaled by the same factor."
        }
      },
      {
        "title": "Detecting spikes and NaNs",
        "say": [
          "Automatic monitors watch the loss and stop or react when something looks wrong.",
          "A simple spike rule compares each loss with the mean of the previous few losses and flags it if it is more than a chosen factor larger.",
          "Any NaN loss is flagged immediately, since NaNs spread through every later computation.",
          "Practice 2 is first_instability(losses, window, factor), which returns the index of the first problem or None.",
          "The rule only judges a loss once enough earlier values exist to form a fair average.",
          "The example scans a loss log with one spike.",
          "In Python, math.isnan detects NaN; comparing NaN with anything returns False, so an ordinary comparison would miss it.",
          "Real monitors often use a smoothed average and several signals, including the gradient norm.",
          "Early detection saves compute: stopping within minutes rather than hours of a spike matters on a big cluster.",
          "The response is usually to roll back to a checkpoint, as the next part explains."
        ],
        "example": "A smoke detector that sounds when the reading jumps well above the room's recent normal level.",
        "code": "import math\n\nlosses = [4.1, 3.8, 3.6, 3.5, 3.4, 9.2, 3.3, float(\"nan\")]\nfor i, loss in enumerate(losses):\n    if math.isnan(loss):\n        print(f\"index {i}: NaN\")\n        continue\n    if i >= 3:\n        mean = sum(losses[i - 3:i]) / 3\n        if loss > 2.0 * mean:\n            print(f\"index {i}: spike ({loss} vs recent mean {mean:.2f})\")",
        "output": "index 5: spike (9.2 vs recent mean 3.50)\nindex 7: NaN",
        "codeNotes": [
          {
            "line": 5,
            "note": "Check NaN first: comparisons with NaN are always False."
          },
          {
            "line": 10,
            "note": "More than twice the recent mean."
          }
        ],
        "tryIt": "Why is float(\"nan\") > 5 False? What would a monitor without isnan miss?",
        "check": {
          "question": "Why must NaN be checked with math.isnan?",
          "options": [
            "It is faster",
            "Comparisons with NaN are always False",
            "NaN is a string"
          ],
          "answer": 1,
          "why": "NaN is not greater, smaller or equal to anything."
        }
      },
      {
        "title": "Responding to instability",
        "say": [
          "The standard response to a spike in a big run is to roll back to a recent checkpoint and skip or reorder the data batches around the spike.",
          "Lowering the learning rate for a while after rollback is another common fix.",
          "Persistent spikes point to deeper causes: learning rate too high, poor initialisation, precision problems, or bad data.",
          "Techniques such as QK-layernorm and z-loss were introduced specifically to stabilise large transformers.",
          "The example lists symptoms with their likely causes and first responses.",
          "Keeping an incident log, noting what happened and what fixed it, helps future runs.",
          "Automated rollback systems restart from the last good checkpoint without human intervention.",
          "BF16 instead of FP16 avoids many precision-related instabilities.",
          "Data problems, such as a batch of repeated or corrupted text, are surprisingly common causes.",
          "Stability is a team effort between optimisation settings, precision and data quality."
        ],
        "example": "A pilot's emergency checklist: specific symptoms lead to specific actions, practised in advance.",
        "code": "playbook = [(\"single loss spike, recovers\", \"watch; check the data batch\"),\n            (\"spike that does not recover\", \"roll back, skip batches, lower LR briefly\"),\n            (\"NaN loss\", \"roll back; check precision and loss scaling\"),\n            (\"gradient norm slowly rising\", \"lower peak LR or tighten clipping\")]\nfor symptom, action in playbook:\n    print(f\"{symptom:30} -> {action}\")",
        "output": "single loss spike, recovers    -> watch; check the data batch\nspike that does not recover    -> roll back, skip batches, lower LR briefly\nNaN loss                       -> roll back; check precision and loss scaling\ngradient norm slowly rising    -> lower peak LR or tighten clipping",
        "codeNotes": [
          {
            "line": 2,
            "note": "Rollback is the standard response."
          }
        ],
        "tryIt": "Which entry would you add for a run whose loss stops falling entirely?",
        "check": {
          "question": "What is a common response to a loss spike that does not recover?",
          "options": [
            "Keep going and hope",
            "Roll back to a checkpoint and skip the offending batches",
            "Delete the model"
          ],
          "answer": 1,
          "why": "Rollback plus skipping data is standard."
        }
      },
      {
        "title": "Practice time: stability",
        "say": [
          "Practice 1: clip_by_global_norm(grads, max_norm). Compute the global norm, scale every value by max_norm / norm if the norm is larger, and return the clipped gradients and the norm, rounded to 4 decimals.",
          "The checks include a norm of 5 clipped to 1, small gradients left unchanged, and four values of 1 with norm 2.",
          "Practice 2: first_instability(losses, window=3, factor=2.0). Return the first index that is NaN or more than factor times the mean of the previous window losses, or None.",
          "The checks include a healthy run, a spike, a NaN, an early value that cannot yet be judged, and a shorter window.",
          "After passing, feed your detector a simulated loss log with a spike and apply a rollback rule.",
          "The example simulates a run that rolls back and continues.",
          "Tomorrow covers checkpoints themselves: what they contain and how to pick a valid one.",
          "Stability tools are cheap to add and can save enormous costs.",
          "Every production training script should log the loss, learning rate and gradient norm at every step.",
          "If your NaN check fails, confirm you test for NaN before any comparison."
        ],
        "example": "A fire drill: practising the response so it is automatic when a real alarm sounds.",
        "code": "import math\n\nlosses = [3.2, 3.1, 3.0, 3.0, 8.5, 2.9, 2.9]\ncheckpoint_every = 2\nfor i, loss in enumerate(losses):\n    if i >= 3 and (math.isnan(loss) or loss > 2 * sum(losses[i - 3:i]) / 3):\n        rollback = (i - 1) // checkpoint_every * checkpoint_every\n        print(f\"instability at step {i}; roll back to checkpoint at step {rollback} and skip batch {i}\")\n        break",
        "output": "instability at step 4; roll back to checkpoint at step 2 and skip batch 4",
        "codeNotes": [
          {
            "line": 7,
            "note": "The last checkpoint before the bad step."
          }
        ],
        "tryIt": "What changes if checkpoints are saved every 10 steps instead?",
        "check": {
          "question": "What should clip_by_global_norm return besides the clipped gradients?",
          "options": [
            "The learning rate",
            "The original global norm",
            "The number of layers"
          ],
          "answer": 1,
          "why": "The norm is useful for logging."
        }
      }
    ],
    "summary": [
      "Huge gradients cause huge updates and loss spikes.",
      "Global norm: square root of the sum of all squared gradient values.",
      "Clip by global norm: scale everything by max_norm/norm when too large.",
      "Detect NaNs with math.isnan and spikes against a recent mean.",
      "Respond with rollback, skipped batches and a closer look at causes."
    ],
    "projectStep": {
      "title": "Training planner, part 16",
      "steps": [
        "Implement clip_by_global_norm and first_instability.",
        "Simulate a spike, detection and rollback.",
        "Write a short stability playbook for your planned run."
      ]
    }
  },
  {
    "day": 17,
    "title": "Checkpoints: Saving, Sharding and Resuming Training",
    "goal": "You can list what a training checkpoint must contain, save and load it safely with version checks, and choose the latest checkpoint whose shards are all present and valid.",
    "minutes": 30,
    "recap": "Yesterday's rollback needs somewhere to roll back to. Checkpoints are those save points, and on large clusters saving them correctly is its own engineering problem.",
    "parts": [
      {
        "title": "What a checkpoint contains",
        "say": [
          "A checkpoint must hold everything needed to continue training exactly as if nothing had stopped.",
          "That means model weights, optimizer states, the step count, the learning rate scheduler state, the loss scaler state and random number generator states.",
          "It should also record the data position, so the run continues with the next unseen batch.",
          "Missing any piece changes the run: forgetting optimizer states, for instance, restarts Adam's moments from zero.",
          "A version number lets future code recognise the format and refuse incompatible files.",
          "The example builds a checkpoint dictionary and prints its keys.",
          "Weights alone are enough for inference, which is why released models often ship without optimizer states.",
          "For training checkpoints, optimizer states are often twice the size of the weights.",
          "Clear naming, such as including the step number in the file name, makes checkpoints easy to find.",
          "Today we use JSON to keep things readable; real systems use efficient binary formats such as safetensors or distributed checkpoint formats."
        ],
        "example": "A save file in a video game: it stores not only your character, but your inventory, position and the quest you were on.",
        "code": "checkpoint = {\"version\": 1, \"step\": 12000, \"weights\": \"...\", \"optimizer\": {\"m\": \"...\", \"v\": \"...\", \"t\": 12000},\n              \"scheduler\": {\"last_step\": 12000}, \"loss_scaler\": {\"scale\": 32768.0},\n              \"rng_seed\": 1234, \"data_position\": {\"epoch\": 0, \"batch\": 12000}}\nfor key in checkpoint:\n    print(\"-\", key)",
        "output": "- version\n- step\n- weights\n- optimizer\n- scheduler\n- loss_scaler\n- rng_seed\n- data_position",
        "codeNotes": [
          {
            "line": 1,
            "note": "Weights and optimizer states together."
          }
        ],
        "tryIt": "What would go wrong if the data position were missing?",
        "check": {
          "question": "Why store the optimizer state in a checkpoint?",
          "options": [
            "It is small",
            "Without it, resuming changes the training trajectory",
            "It is required by JSON"
          ],
          "answer": 1,
          "why": "Adam's moments would restart from zero."
        }
      },
      {
        "title": "Saving and loading safely",
        "say": [
          "Saving turns the checkpoint dictionary into bytes or text; loading turns it back.",
          "Practice 1 is save_checkpoint(step, weights, optimizer_state, seed) and load_checkpoint(text).",
          "Using json.dumps with sort_keys=True makes the output deterministic, so identical states produce identical files.",
          "Loading must validate the version and required keys, raising ValueError for anything unexpected.",
          "Refusing a bad checkpoint loudly is far better than silently training from a wrong state.",
          "The example saves, loads and validates a tiny checkpoint.",
          "Writing to a temporary file and renaming it when complete prevents half-written checkpoints if the job dies mid-save.",
          "Checksums, such as SHA-256 hashes, detect corruption during storage or transfer.",
          "Never load checkpoints from untrusted sources with formats that can execute code; JSON and safetensors are safe choices.",
          "Test loading right after saving in development, so format bugs appear early."
        ],
        "example": "Sealing a document in an envelope labelled with its version, and checking the label before relying on it.",
        "code": "import json\n\nstate = {\"version\": 1, \"step\": 500, \"weights\": [0.25, -0.5], \"optimizer\": {\"t\": 500}, \"seed\": 7}\ntext = json.dumps(state, sort_keys=True)\nprint(text)\nloaded = json.loads(text)\nmissing = [k for k in (\"step\", \"weights\", \"optimizer\", \"seed\") if k not in loaded]\nprint(\"version ok:\", loaded[\"version\"] == 1, \"| missing keys:\", missing)",
        "output": "{\"optimizer\": {\"t\": 500}, \"seed\": 7, \"step\": 500, \"version\": 1, \"weights\": [0.25, -0.5]}\nversion ok: True | missing keys: []",
        "codeNotes": [
          {
            "line": 4,
            "note": "Sorted keys give deterministic text."
          },
          {
            "line": 7,
            "note": "Validate before trusting the data."
          }
        ],
        "tryIt": "What should happen if someone loads a version 2 checkpoint with version 1 code?",
        "check": {
          "question": "Why write to a temporary file and then rename it?",
          "options": [
            "It is faster",
            "A crash mid-save cannot leave a half-written checkpoint in place",
            "JSON requires it"
          ],
          "answer": 1,
          "why": "Renaming completes atomically."
        }
      },
      {
        "title": "Sharded checkpoints",
        "say": [
          "With FSDP or ZeRO, no single GPU holds the whole model, so each rank saves its own shard.",
          "Saving shards in parallel is much faster than gathering everything onto one GPU first.",
          "A checkpoint is then a folder of shard files plus a small metadata file describing how they fit together.",
          "A sharded checkpoint is valid only if every shard was written and none is corrupted.",
          "Practice 2 is latest_valid(checkpoints, shards), which finds the newest checkpoint that is complete and has no checksum failures.",
          "The example checks three checkpoints, one missing a shard and one with a bad checksum.",
          "Distributed checkpoint libraries can also reshard: load a checkpoint saved on 64 GPUs into a job with 32.",
          "Storage speed matters: saving terabytes can take minutes, during which training may pause.",
          "Asynchronous checkpointing copies state to CPU memory quickly and writes it to storage in the background.",
          "Keeping the last few checkpoints, not just the latest, protects against a corrupted latest save."
        ],
        "example": "A book split between several binders: the book is only usable if every binder is present and none has missing pages.",
        "code": "checkpoints = [(1000, {0, 1, 2, 3}, set()), (2000, {0, 1, 2, 3}, {2}), (3000, {0, 1, 3}, set())]\nneeded = set(range(4))\nfor step, written, bad in checkpoints:\n    ok = needed <= written and not bad\n    reason = \"ok\" if ok else (\"missing shards \" + str(sorted(needed - written)) if needed - written else \"bad checksum \" + str(sorted(bad)))\n    print(f\"step {step}: {reason}\")",
        "output": "step 1000: ok\nstep 2000: bad checksum [2]\nstep 3000: missing shards [2]",
        "codeNotes": [
          {
            "line": 4,
            "note": "All shards present and none corrupted."
          }
        ],
        "tryIt": "Which checkpoint should training resume from?",
        "check": {
          "question": "When is a sharded checkpoint valid?",
          "options": [
            "When any shard exists",
            "When every shard is written and none fails its checksum",
            "When the newest file exists"
          ],
          "answer": 1,
          "why": "Completeness and integrity are both required."
        }
      },
      {
        "title": "How often to checkpoint",
        "say": [
          "Checkpoint too rarely and a failure loses many hours of work; too often and saving itself wastes time and storage.",
          "A classic rule, from Young and Daly, sets the interval near the square root of 2 × save time × mean time between failures.",
          "The example computes this interval for a few cluster sizes.",
          "Large clusters fail more often, because more hardware means more chances of something breaking.",
          "So larger runs checkpoint more often, sometimes every few minutes with asynchronous saving.",
          "Tomorrow's lesson calculates how much work each failure costs.",
          "Checkpoint retention policies keep, for example, the last three checkpoints plus one per day.",
          "Uploading key checkpoints to durable storage protects against the loss of a whole cluster.",
          "Checkpoints are also used for evaluation during training and for choosing the final model.",
          "Planning the checkpoint strategy is part of the training plan, not an afterthought."
        ],
        "example": "Saving a long document: after every word is too slow, only once a day risks losing a day's work.",
        "code": "import math\n\nsave_minutes = 3\nfor gpus, mtbf_hours in [(64, 200), (512, 25), (4096, 3)]:\n    interval = math.sqrt(2 * save_minutes * mtbf_hours * 60)\n    print(f\"{gpus:5} GPUs, a failure every {mtbf_hours:3} h -> checkpoint about every {interval:4.0f} minutes\")",
        "output": "   64 GPUs, a failure every 200 h -> checkpoint about every  268 minutes\n  512 GPUs, a failure every  25 h -> checkpoint about every   95 minutes\n 4096 GPUs, a failure every   3 h -> checkpoint about every   33 minutes",
        "codeNotes": [
          {
            "line": 5,
            "note": "Young's approximation for the best interval."
          }
        ],
        "tryIt": "How does the interval change if saving becomes 10 times faster?",
        "check": {
          "question": "Why do larger clusters checkpoint more often?",
          "options": [
            "They have more storage",
            "They fail more often",
            "They train more slowly"
          ],
          "answer": 1,
          "why": "More hardware, more failures."
        }
      },
      {
        "title": "Resuming exactly",
        "say": [
          "Resuming means loading the checkpoint and restoring every piece: weights, optimizer, scheduler, scaler, random states and data position.",
          "If everything is restored, the loss curve continues smoothly, as if nothing had happened.",
          "A visible jump in the loss after resuming is a sign that something was not restored.",
          "The example shows a toy run that resumes correctly and another that forgets the optimizer's step counter.",
          "Bitwise-exact resumption is hard on GPUs because some operations are not perfectly deterministic, but the curve should match closely.",
          "Testing resumption on a small run, by stopping and restarting deliberately, catches bugs early.",
          "Checkpoints should also record the code version and configuration, so the same code is used when resuming.",
          "After changing code, resuming from an old checkpoint must be done carefully and documented.",
          "Good checkpointing turns failures from disasters into minor delays.",
          "Tomorrow builds on this with elastic training that adapts to changes in the cluster."
        ],
        "example": "Continuing a paused film exactly where you stopped, rather than from a random scene.",
        "code": "def adam_bias(t):\n    return round(1 - 0.9 ** t, 4)\n\nsaved_t = 1000\nprint(\"correct resume: bias correction\", adam_bias(saved_t + 1))\nprint(\"forgot t:       bias correction\", adam_bias(1), \"(treats step 1001 like step 1)\")",
        "output": "correct resume: bias correction 1.0\nforgot t:       bias correction 0.1 (treats step 1001 like step 1)",
        "codeNotes": [
          {
            "line": 5,
            "note": "Continue from the saved step counter."
          }
        ],
        "tryIt": "What effect would restarting Adam's t at 1 have on the update size?",
        "check": {
          "question": "What does a jump in the loss right after resuming suggest?",
          "options": [
            "Normal behaviour",
            "Some training state was not restored",
            "The data finished"
          ],
          "answer": 1,
          "why": "Exact resumption should continue smoothly."
        }
      },
      {
        "title": "Practice time: checkpoints",
        "say": [
          "Practice 1: save_checkpoint(step, weights, optimizer_state, seed) returns sorted-key JSON text with version 1; load_checkpoint(text) parses it and raises ValueError for the wrong version or missing keys.",
          "The checks save and load a checkpoint, confirm the text is sorted-key JSON, and reject a version 2 file and one with missing keys.",
          "Practice 2: latest_valid(checkpoints, shards). Return the highest step whose written shards include 0..shards−1 and whose bad_checksums list is empty, or None.",
          "The checks include missing shards, a bad checksum, shards listed in any order and no valid checkpoint.",
          "After passing, simulate a run that saves every N steps, fails, and resumes from latest_valid.",
          "The example does exactly that.",
          "Tomorrow calculates the cost of failures and adapts training when the number of GPUs changes.",
          "Checkpoints are the single most important protection for long training runs.",
          "Many teams keep a separate job that validates new checkpoints as soon as they are written.",
          "If your latest_valid picks the wrong step, print the validity of each checkpoint."
        ],
        "example": "A mountaineer's base camps: each one is only useful if it is fully stocked.",
        "code": "saved = []\nfor step in range(0, 2600, 500):\n    shards = {0, 1, 2, 3} if step != 2500 else {0, 1}\n    saved.append({\"step\": step, \"written\": shards, \"bad\": set()})\nprint(\"failure at step 2700\")\nvalid = [c[\"step\"] for c in saved if {0, 1, 2, 3} <= c[\"written\"] and not c[\"bad\"]]\nprint(\"resume from step\", max(valid), \"(step 2500 was incomplete)\")",
        "output": "failure at step 2700\nresume from step 2000 (step 2500 was incomplete)",
        "codeNotes": [
          {
            "line": 3,
            "note": "The last save was interrupted and only wrote two shards."
          }
        ],
        "tryIt": "How many steps of work were lost?",
        "check": {
          "question": "What should latest_valid return if no checkpoint is complete?",
          "options": [
            "0",
            "None",
            "The newest step"
          ],
          "answer": 1,
          "why": "No valid checkpoint means None."
        }
      }
    ],
    "summary": [
      "Checkpoints hold weights, optimizer, scheduler, scaler, RNG and data position.",
      "Save deterministically, validate versions and keys when loading.",
      "Sharded checkpoints are valid only when complete and uncorrupted.",
      "Checkpoint interval ≈ √(2 × save time × MTBF).",
      "Resume every piece of state; test resumption early."
    ],
    "projectStep": {
      "title": "Training planner, part 17",
      "steps": [
        "Implement save_checkpoint, load_checkpoint and latest_valid.",
        "Simulate a failure and resume from the latest valid checkpoint.",
        "Choose a checkpoint interval for your planned cluster."
      ]
    }
  },
  {
    "day": 18,
    "title": "Fault Tolerance and Elastic Training",
    "goal": "You can estimate how often large clusters fail, calculate the work lost to a failure, and keep the global batch size constant when the number of GPUs changes in elastic training.",
    "minutes": 30,
    "recap": "Checkpoints let us recover. Today we measure what failures cost and make training adapt when GPUs disappear or return.",
    "parts": [
      {
        "title": "Failures at scale",
        "say": [
          "Every GPU, server, cable and switch has a small chance of failing on any given day.",
          "With thousands of GPUs, small chances add up: large runs see failures many times a week.",
          "Meta reported hundreds of interruptions during the 54-day training of Llama 3 405B on 16,384 GPUs, most caused by hardware.",
          "If one GPU in a synchronous job fails, the whole job stops, because every step needs every rank.",
          "The example estimates the expected time between failures for different cluster sizes.",
          "Mean time between failures (MTBF) for the whole cluster is roughly the MTBF of one GPU divided by the number of GPUs.",
          "This makes fault tolerance a core design requirement, not an optional extra.",
          "Health checks before and during training find bad hardware early.",
          "Spare nodes let a job restart quickly instead of waiting for repairs.",
          "Good tooling turns failures into short pauses rather than lost days."
        ],
        "example": "A string of festival lights wired in series: the more bulbs, the more often one fails and the whole string goes dark.",
        "code": "gpu_mtbf_hours = 50000\nfor gpus in [8, 512, 4096, 16384]:\n    cluster_mtbf = gpu_mtbf_hours / gpus\n    print(f\"{gpus:6} GPUs: a failure about every {cluster_mtbf:8.1f} hours\")",
        "output": "     8 GPUs: a failure about every   6250.0 hours\n   512 GPUs: a failure about every     97.7 hours\n  4096 GPUs: a failure about every     12.2 hours\n 16384 GPUs: a failure about every      3.1 hours",
        "codeNotes": [
          {
            "line": 3,
            "note": "More GPUs, more frequent failures."
          }
        ],
        "tryIt": "How many failures would a 30-day run on 16,384 GPUs expect with these numbers?",
        "check": {
          "question": "Why does one failed GPU stop a synchronous job?",
          "options": [
            "It holds all the data",
            "Every step needs every rank to take part in the collectives",
            "It is the leader"
          ],
          "answer": 1,
          "why": "Collectives wait for all ranks."
        }
      },
      {
        "title": "The cost of a failure",
        "say": [
          "When a job fails, training resumes from the last checkpoint, so the work since then is lost.",
          "There is also restart time: detecting the failure, replacing hardware, reloading the checkpoint and warming up.",
          "Practice 2 is lost_work(fail_step, checkpoint_every, step_seconds, restart_seconds), which computes where training resumes and how many minutes are lost.",
          "The resume point is the last multiple of checkpoint_every at or before the failure step.",
          "The example calculates the loss for a failure between checkpoints.",
          "On average, a failure loses about half a checkpoint interval of work, plus the restart time.",
          "Multiply by the number of failures to estimate the total overhead of a run.",
          "Reducing restart time, for example with spare nodes and fast checkpoint loading, is often the biggest win.",
          "Goodput, the fraction of time spent on useful training, is the metric teams track for this.",
          "Large labs aim for goodput above 90 percent even on the biggest clusters."
        ],
        "example": "Losing unsaved work when the power goes off: the damage depends on how long since you last pressed save, plus the time to restart the computer.",
        "code": "fail_step, every, step_s, restart_s = 2750, 500, 2.0, 300\nresume = fail_step // every * every\nlost_steps = fail_step - resume\nminutes = (lost_steps * step_s + restart_s) / 60\nprint(f\"resume from {resume}, redo {lost_steps} steps, lose {minutes:.1f} minutes\")",
        "output": "resume from 2500, redo 250 steps, lose 13.3 minutes",
        "codeNotes": [
          {
            "line": 2,
            "note": "Round down to the last checkpoint."
          }
        ],
        "tryIt": "How many minutes would be lost if checkpoints were every 100 steps?",
        "check": {
          "question": "What is goodput?",
          "options": [
            "Network speed",
            "The fraction of time spent on useful training",
            "The number of GPUs"
          ],
          "answer": 1,
          "why": "Useful time over total time."
        }
      },
      {
        "title": "Elastic training",
        "say": [
          "Elastic training continues with fewer GPUs when some fail, and grows again when they return, instead of waiting.",
          "PyTorch's torchrun supports elastic jobs that re-form the group of workers after a change.",
          "The challenge is keeping training behaviour the same when the number of GPUs changes.",
          "The global batch must stay constant, so gradient accumulation (Day 6) compensates for fewer GPUs.",
          "Practice 1 is elastic_plan(global_batch, micro_batch, gpus), which finds the largest usable GPU count and the accumulation steps.",
          "Not every GPU count divides the global batch evenly, so sometimes a few healthy GPUs must sit out.",
          "The example shows the plan as a 16-GPU job loses GPUs one by one.",
          "The data sampler (Day 4) must also re-shard the data for the new world size without repeating or skipping examples.",
          "Some systems keep a pool of spare GPUs to swap in immediately, avoiding a smaller configuration altogether.",
          "Elasticity is most valuable on shared or preemptible cloud capacity."
        ],
        "example": "A rowing crew that loses a rower mid-race: the remaining rowers adjust their stroke so the boat keeps the same speed.",
        "code": "global_batch, micro = 1024, 8\nfor gpus in [16, 15, 12, 9, 8]:\n    for n in range(gpus, 0, -1):\n        if global_batch % (micro * n) == 0:\n            print(f\"{gpus:2} GPUs available -> use {n:2}, accumulate {global_batch // (micro * n):2} micro-batches\")\n            break",
        "output": "16 GPUs available -> use 16, accumulate  8 micro-batches\n15 GPUs available -> use  8, accumulate 16 micro-batches\n12 GPUs available -> use  8, accumulate 16 micro-batches\n 9 GPUs available -> use  8, accumulate 16 micro-batches\n 8 GPUs available -> use  8, accumulate 16 micro-batches",
        "codeNotes": [
          {
            "line": 4,
            "note": "Find the largest GPU count that divides the global batch."
          }
        ],
        "tryIt": "Is there any micro-batch size that lets all 12 GPUs share a global batch of 1024 exactly? Why not, and what could you change instead?",
        "check": {
          "question": "How does elastic training keep the global batch constant with fewer GPUs?",
          "options": [
            "It lowers the learning rate",
            "It increases gradient accumulation",
            "It drops data"
          ],
          "answer": 1,
          "why": "More accumulation steps make up for fewer GPUs."
        }
      },
      {
        "title": "Preemption and cloud capacity",
        "say": [
          "Cloud spot or preemptible instances are much cheaper, but the provider can take them back with little warning.",
          "Training on spot capacity only works with frequent checkpoints and elastic or fast restarts.",
          "A preemption notice, often 30 seconds to two minutes, can trigger an emergency checkpoint.",
          "The example compares the cost of on-demand and spot capacity including the extra lost work.",
          "Even with extra restarts, spot capacity is often much cheaper for flexible training jobs.",
          "Day 29 turns this into a full cost model.",
          "Mixing on-demand for a stable core with spot for extra capacity is a common compromise.",
          "Scheduling systems such as Kubernetes with Kueue or Slurm manage preemption policies.",
          "Being preemptible also makes jobs good citizens on shared research clusters.",
          "Design for interruption and the cheapest capacity becomes usable."
        ],
        "example": "Renting a room by the night at a discount, knowing you may have to move out at short notice: fine if you pack light.",
        "code": "gpu_hours, price = 10000, 2.0\nspot_discount, extra_work = 0.6, 0.15\non_demand = gpu_hours * price\nspot = gpu_hours * (1 + extra_work) * price * (1 - spot_discount)\nprint(f\"on-demand: ${on_demand:,.0f}\")\nprint(f\"spot with 15% redone work: ${spot:,.0f}\")",
        "output": "on-demand: $20,000\nspot with 15% redone work: $9,200",
        "codeNotes": [
          {
            "line": 4,
            "note": "More hours because of redone work, at a lower price."
          }
        ],
        "tryIt": "At what amount of redone work would spot stop being cheaper?",
        "check": {
          "question": "What makes spot capacity usable for training?",
          "options": [
            "Nothing, it never is",
            "Frequent checkpoints and fast restarts",
            "Bigger batches"
          ],
          "answer": 1,
          "why": "Interruptions must be cheap to recover from."
        }
      },
      {
        "title": "Designing for failure",
        "say": [
          "A fault-tolerant training system has several layers: health checks, frequent checkpoints, automatic restart and alerting.",
          "Health checks test GPUs, memory and network links before a job uses them and periodically during it.",
          "Watchdogs detect hangs, such as a collective that never completes (Day 5), and restart the job.",
          "The example scores a training setup against a fault-tolerance checklist.",
          "Every restart should be logged with its cause, so repeated hardware problems are spotted.",
          "Post-incident reviews after big interruptions improve the system for next time.",
          "Simulating failures on purpose, by killing a process during a test run, proves the recovery path works.",
          "Recovery paths that are never tested usually fail when needed.",
          "These practices come from site reliability engineering and apply directly to training infrastructure.",
          "Reliable infrastructure is what makes very large training runs possible at all."
        ],
        "example": "A hospital with backup generators that are tested every month, not just installed and forgotten.",
        "code": "setup = {\"pre-job GPU health checks\": True, \"checkpoint every 20 minutes\": True,\n         \"automatic restart on failure\": True, \"hang watchdog\": False,\n         \"spare nodes\": False, \"failure drills\": False}\nscore = sum(setup.values())\nprint(f\"fault tolerance: {score}/{len(setup)}\")\nprint(\"missing:\", [k for k, v in setup.items() if not v])",
        "output": "fault tolerance: 3/6\nmissing: ['hang watchdog', 'spare nodes', 'failure drills']",
        "codeNotes": [
          {
            "line": 4,
            "note": "True counts as 1."
          }
        ],
        "tryIt": "Which missing item would you add first for a two-month run?",
        "check": {
          "question": "Why run failure drills?",
          "options": [
            "To slow training",
            "Untested recovery paths often fail when needed",
            "To create checkpoints"
          ],
          "answer": 1,
          "why": "Test recovery before you need it."
        }
      },
      {
        "title": "Practice time: resilience",
        "say": [
          "Practice 1: elastic_plan(global_batch, micro_batch, gpus). Try GPU counts from gpus down to 1 and return the first that divides the global batch into micro-batches exactly, with its accumulation steps; raise ValueError if none works.",
          "The checks include a full cluster, a lost GPU forcing 8 GPUs, a count of 15 that works for a batch of 960, and an impossible micro-batch.",
          "Practice 2: lost_work(fail_step, checkpoint_every, step_seconds, restart_seconds). Return the resume step, the lost steps and the lost minutes rounded to 1 decimal.",
          "The checks include a failure between checkpoints, one right after a checkpoint and one before the first checkpoint.",
          "After passing, estimate the total lost time for a month-long run with a failure every day.",
          "The example makes that estimate.",
          "Tomorrow focuses on feeding data to thousands of GPUs reproducibly.",
          "Resilience planning is increasingly part of machine learning engineering interviews.",
          "Knowing your goodput helps justify investment in reliability.",
          "If elastic_plan gives the wrong count, print each candidate and whether it divides the batch."
        ],
        "example": "Planning a long voyage with spare parts, repair drills and a schedule that allows for bad weather.",
        "code": "days, failures_per_day, every_min, restart_min = 30, 1, 30, 10\navg_lost = every_min / 2 + restart_min\ntotal_hours = days * failures_per_day * avg_lost / 60\ngoodput = 1 - total_hours / (days * 24)\nprint(f\"about {total_hours:.1f} hours lost in {days} days -> goodput {goodput:.1%}\")",
        "output": "about 12.5 hours lost in 30 days -> goodput 98.3%",
        "codeNotes": [
          {
            "line": 2,
            "note": "On average, half an interval plus the restart."
          }
        ],
        "tryIt": "What goodput would you get with checkpoints every 10 minutes?",
        "check": {
          "question": "What does lost_work return as resume_from for fail_step 3000 and checkpoint_every 500?",
          "options": [
            "2500",
            "3000",
            "0"
          ],
          "answer": 1,
          "why": "3000 is itself a checkpoint step."
        }
      }
    ],
    "summary": [
      "Cluster MTBF shrinks as GPUs grow; big runs fail often.",
      "Lost work = steps since the last checkpoint plus restart time.",
      "Elastic training keeps the global batch fixed by adjusting accumulation.",
      "Spot capacity is cheaper if restarts are cheap.",
      "Health checks, watchdogs and failure drills make recovery reliable."
    ],
    "projectStep": {
      "title": "Training planner, part 18",
      "steps": [
        "Implement elastic_plan and lost_work.",
        "Estimate goodput for your planned run under different checkpoint intervals.",
        "Write a fault-tolerance checklist for the run."
      ]
    }
  },
  {
    "day": 19,
    "title": "Data Loading at Scale: Sharding and Deterministic Shuffling",
    "goal": "You can produce reproducible per-epoch shuffles shared by every worker, balance data files across workers by size, and recognise and fix input-pipeline bottlenecks.",
    "minutes": 30,
    "recap": "Fault tolerance keeps GPUs running. Today we make sure they never wait for data, and that every worker agrees on which data comes next.",
    "parts": [
      {
        "title": "Data at scale",
        "say": [
          "Large language models train on trillions of tokens stored in thousands of files, often totalling many terabytes.",
          "Data must be read, decoded, tokenised (or loaded pre-tokenised), shuffled, batched and sent to each GPU fast enough to keep it busy.",
          "If the data pipeline is slower than the GPUs, expensive hardware sits idle, which is called being input-bound (Day 24).",
          "Most large runs pre-tokenise the data and store it in compact binary shards that can be read quickly.",
          "The example estimates the reading speed needed to keep a cluster busy.",
          "The numbers are large but manageable with parallel reading and prefetching.",
          "Data quality matters as much as speed: deduplication and filtering happen before training.",
          "The order of data also matters, both for learning and for reproducibility.",
          "Streaming datasets read directly from cloud storage without copying everything first.",
          "Today we focus on order and balance, the two things every distributed data pipeline must get right."
        ],
        "example": "A busy restaurant kitchen: the chefs are fast, but if ingredients arrive slowly, the kitchen stalls.",
        "code": "tokens_per_sec_per_gpu, gpus, bytes_per_token = 3000, 1024, 2\ntotal = tokens_per_sec_per_gpu * gpus\nprint(f\"cluster consumes {total:,} tokens per second\")\nprint(f\"that is {total * bytes_per_token / 1e6:.1f} MB per second of token IDs\")",
        "output": "cluster consumes 3,072,000 tokens per second\nthat is 6.1 MB per second of token IDs",
        "codeNotes": [
          {
            "line": 2,
            "note": "Tokens per second across the whole cluster."
          }
        ],
        "tryIt": "Why is this manageable for pre-tokenised data but hard for raw text that needs cleaning?",
        "check": {
          "question": "What does input-bound mean?",
          "options": [
            "The GPUs are the bottleneck",
            "GPUs wait for data because the pipeline is too slow",
            "The model is too large"
          ],
          "answer": 1,
          "why": "Data cannot keep up with compute."
        }
      },
      {
        "title": "Deterministic shuffling",
        "say": [
          "Shuffling data each epoch helps training, but the shuffle must be reproducible.",
          "Every worker must see the same global order, so that each takes its own non-overlapping share.",
          "The trick is to seed the random number generator with values every worker knows, such as a base seed and the epoch number.",
          "Practice 1 is epoch_order(n, seed, epoch), which shuffles with random.Random(seed × 1000 + epoch).",
          "The same seed and epoch always give the same order, and a new epoch gives a new order.",
          "The example shows two workers computing the same order independently, then taking alternate items.",
          "Reproducibility means a run can be repeated or resumed exactly, which is vital for debugging.",
          "Using random.Random objects rather than the global random module avoids interference from other code.",
          "PyTorch's DistributedSampler uses the same idea with its set_epoch method.",
          "Forgetting to change the epoch, a common bug, makes every epoch use the same order."
        ],
        "example": "Two card dealers who shuffle identical decks using the same written sequence of moves, ending with identical orders.",
        "code": "import random\n\ndef order(n, seed, epoch):\n    items = list(range(n))\n    random.Random(seed * 1000 + epoch).shuffle(items)\n    return items\n\nfor epoch in [0, 1]:\n    worker_a = order(10, 42, epoch)\n    worker_b = order(10, 42, epoch)\n    print(f\"epoch {epoch}: same order on both workers: {worker_a == worker_b}; rank 0 gets {worker_a[0::2]}, rank 1 gets {worker_b[1::2]}\")",
        "output": "epoch 0: same order on both workers: True; rank 0 gets [2, 9, 1, 5, 8], rank 1 gets [4, 0, 3, 7, 6]\nepoch 1: same order on both workers: True; rank 0 gets [0, 8, 7, 4, 1], rank 1 gets [3, 6, 5, 9, 2]",
        "codeNotes": [
          {
            "line": 5,
            "note": "A private generator seeded with shared values."
          },
          {
            "line": 11,
            "note": "Each rank takes its own share of the shared order."
          }
        ],
        "tryIt": "What happens if one worker uses epoch 0 and the other epoch 1 by mistake?",
        "check": {
          "question": "Why seed the shuffle with the epoch number?",
          "options": [
            "To speed it up",
            "So every epoch has a new but reproducible order",
            "To avoid shuffling"
          ],
          "answer": 1,
          "why": "New order per epoch, same on every worker."
        }
      },
      {
        "title": "Balancing shards across workers",
        "say": [
          "Data files often differ in size, so giving each worker the same number of files can give very different amounts of data.",
          "A worker with more data takes longer, and synchronous training waits for it.",
          "A simple and effective balancing method is greedy: take files from largest to smallest and give each to the worker with the least data so far.",
          "Practice 2 is assign_shards(sizes, workers), which implements this with clear tie-breaking rules.",
          "The example balances six files across two workers.",
          "The result is close to equal, although perfect balance is not always possible.",
          "This is known as the longest-processing-time-first rule in scheduling, and it is provably close to optimal.",
          "In practice, many pipelines instead cut all data into equal-sized chunks, avoiding the problem.",
          "Balancing also applies to other tasks, such as evaluation jobs and preprocessing.",
          "Clear tie-breaking rules make the assignment deterministic and testable."
        ],
        "example": "Sharing out luggage between two porters by handing the heaviest bags first to whoever is carrying less.",
        "code": "sizes = [10, 7, 5, 4, 3, 1]\nload, assigned = [0, 0], [[], []]\nfor i in sorted(range(len(sizes)), key=lambda i: (-sizes[i], i)):\n    w = min(range(2), key=lambda k: (load[k], k))\n    load[w] += sizes[i]\n    assigned[w].append(i)\n    print(f\"file {i} (size {sizes[i]:2}) -> worker {w}, loads now {load}\")",
        "output": "file 0 (size 10) -> worker 0, loads now [10, 0]\nfile 1 (size  7) -> worker 1, loads now [10, 7]\nfile 2 (size  5) -> worker 1, loads now [10, 12]\nfile 3 (size  4) -> worker 0, loads now [14, 12]\nfile 4 (size  3) -> worker 1, loads now [14, 15]\nfile 5 (size  1) -> worker 0, loads now [15, 15]",
        "codeNotes": [
          {
            "line": 3,
            "note": "Largest files first."
          },
          {
            "line": 4,
            "note": "The least-loaded worker, lower index on ties."
          }
        ],
        "tryIt": "What would happen if you assigned files in their original order instead?",
        "check": {
          "question": "Which worker receives the next file in the greedy method?",
          "options": [
            "A random one",
            "The one with the least data so far",
            "Always worker 0"
          ],
          "answer": 1,
          "why": "Keep the loads as equal as possible."
        }
      },
      {
        "title": "Avoiding input bottlenecks",
        "say": [
          "Data loaders use several worker processes to read and prepare batches in parallel.",
          "Prefetching prepares the next batches while the GPU works on the current one.",
          "Pinned memory speeds up copying batches from CPU to GPU.",
          "Pre-tokenising and packing sequences removes expensive work from the training loop.",
          "The example compares GPU utilisation with and without prefetching in a small simulation.",
          "When loading one batch takes longer than a training step, even perfect prefetching cannot keep up; you need more loader workers.",
          "Monitoring the time spent waiting for data each step shows whether the pipeline is keeping up.",
          "Remote storage adds latency, so caching data on local disks helps.",
          "Deterministic data loading with multiple workers needs each worker to be seeded carefully as well.",
          "Tomorrow's communication model and Day 24's profiling complete the picture of where time goes."
        ],
        "example": "A waiter who brings the next course while you finish the current one, so there is no gap between dishes.",
        "code": "load_ms, compute_ms, steps = 60, 100, 10\nno_prefetch = steps * (load_ms + compute_ms)\nwith_prefetch = load_ms + steps * max(load_ms, compute_ms)\nfor name, total in [(\"no prefetch\", no_prefetch), (\"prefetch\", with_prefetch)]:\n    print(f\"{name:12} {total:5} ms, GPU busy {steps * compute_ms / total:.0%}\")",
        "output": "no prefetch   1600 ms, GPU busy 62%\nprefetch      1060 ms, GPU busy 94%",
        "codeNotes": [
          {
            "line": 3,
            "note": "Loading overlaps with computing after the first batch."
          }
        ],
        "tryIt": "What happens to the prefetch result if loading takes 150 ms?",
        "check": {
          "question": "What does prefetching do?",
          "options": [
            "Deletes old batches",
            "Prepares the next batches while the GPU computes",
            "Shuffles the data"
          ],
          "answer": 1,
          "why": "Overlap loading with computation."
        }
      },
      {
        "title": "Resuming the data stream",
        "say": [
          "After a failure, training must continue with the next unseen batch, not restart the epoch or repeat data.",
          "With deterministic shuffling, the position is just the epoch and the number of batches already consumed.",
          "Storing these two numbers in the checkpoint (Day 17) makes the data stream resumable.",
          "The example resumes a shuffled stream in the middle of an epoch.",
          "Repeating a few batches is usually harmless, but repeating large amounts can cause overfitting to those examples.",
          "Skipping data wastes it and can bias the model slightly.",
          "Stateful data loaders in newer libraries save and restore their exact position.",
          "Changing the number of workers after resuming requires re-sharding the remaining data carefully.",
          "Keeping the data order independent of the number of GPUs makes elastic training much simpler.",
          "These details separate a toy training loop from a production one.",
          "Testing resumption of the data stream, by stopping a small run mid-epoch and restarting it, is as important as testing the model checkpoint."
        ],
        "example": "Keeping a bookmark in a shuffled deck of flashcards, so tomorrow you continue from the right card in the same order.",
        "code": "import random\n\ndef epoch_order(n, seed, epoch):\n    items = list(range(n))\n    random.Random(seed * 1000 + epoch).shuffle(items)\n    return items\n\ncheckpoint = {\"epoch\": 2, \"batches_done\": 3}\norder = epoch_order(20, 7, checkpoint[\"epoch\"])\nbatch = 4\nremaining = order[checkpoint[\"batches_done\"] * batch:]\nprint(\"next batch after resuming:\", remaining[:batch])\nprint(\"examples left this epoch:\", len(remaining))",
        "output": "next batch after resuming: [1, 13, 7, 9]\nexamples left this epoch: 8",
        "codeNotes": [
          {
            "line": 9,
            "note": "Recreate the same order from the seed and epoch."
          },
          {
            "line": 11,
            "note": "Skip the batches already consumed."
          }
        ],
        "tryIt": "Why is it important that epoch_order does not depend on the number of GPUs?",
        "check": {
          "question": "What two numbers make a deterministic data stream resumable?",
          "options": [
            "Loss and learning rate",
            "Epoch and batches already consumed",
            "GPU count and seed only"
          ],
          "answer": 1,
          "why": "Order comes from the seed and epoch; position from batches done."
        }
      },
      {
        "title": "Practice time: data pipelines",
        "say": [
          "Practice 1: epoch_order(n, seed, epoch). Shuffle list(range(n)) with random.Random(seed × 1000 + epoch).shuffle and return it.",
          "The checks confirm it is a permutation, repeatable for the same inputs, different across epochs, and exactly equal to the reference shuffle.",
          "Practice 2: assign_shards(sizes, workers). Take files largest first (lower index on ties), give each to the least-loaded worker (lower index on ties), and return each worker's sorted file list.",
          "The checks include six files on two workers, equal files and more workers than files.",
          "After passing, balance your own list of file sizes across 4 and 8 workers and report the most and least loaded.",
          "The example prints that report.",
          "Tomorrow estimates how long communication takes using a simple model of latency and bandwidth.",
          "Data pipelines are unglamorous but decide whether expensive GPUs are fully used.",
          "Many real training slowdowns turn out to be data problems.",
          "If your shuffle check fails, make sure you use a new random.Random object, not the global random module."
        ],
        "example": "A warehouse manager checking that every delivery van leaves with a similar load.",
        "code": "sizes = [120, 80, 75, 60, 55, 40, 30, 25, 20, 10]\nfor workers in [4, 8]:\n    load = [0] * workers\n    for i in sorted(range(len(sizes)), key=lambda i: (-sizes[i], i)):\n        w = min(range(workers), key=lambda k: (load[k], k))\n        load[w] += sizes[i]\n    print(f\"{workers} workers: loads {load}, max/min = {max(load)}/{min(load)}\")",
        "output": "4 workers: loads [120, 135, 135, 125], max/min = 135/120\n8 workers: loads [120, 80, 75, 60, 55, 40, 40, 45], max/min = 120/40",
        "codeNotes": [
          {
            "line": 5,
            "note": "Greedy: least-loaded worker first."
          }
        ],
        "tryIt": "Why is the balance worse with 8 workers?",
        "check": {
          "question": "What makes epoch_order reproducible?",
          "options": [
            "Using the current time",
            "A generator seeded with seed and epoch",
            "Sorting the data"
          ],
          "answer": 1,
          "why": "Same seed, same order."
        }
      }
    ],
    "summary": [
      "Pipelines must deliver data fast enough to keep GPUs busy.",
      "Seed per-epoch shuffles with shared values so all workers agree.",
      "Balance files greedily: largest first to the least-loaded worker.",
      "Prefetch and parallel loaders hide loading time.",
      "Save epoch and batch position to resume the data stream exactly."
    ],
    "projectStep": {
      "title": "Training planner, part 19",
      "steps": [
        "Implement epoch_order and assign_shards.",
        "Simulate resuming the data stream mid-epoch.",
        "Estimate the data throughput your cluster needs."
      ]
    }
  },
  {
    "day": 20,
    "title": "Communication Cost Models: Latency, Bandwidth and Topology",
    "goal": "You can estimate message transfer times with the latency-bandwidth model, compute ring all-reduce time for a cluster, and explain how network topology affects distributed training.",
    "minutes": 30,
    "recap": "We have counted how much data collectives move. Today we turn that into time, using a simple model that explains most communication behaviour.",
    "parts": [
      {
        "title": "The latency-bandwidth model",
        "say": [
          "The time to send a message has two parts: a fixed start-up cost called latency, and a cost proportional to size, set by bandwidth.",
          "Time = latency + size / bandwidth. This is called the alpha-beta model, with alpha for latency and beta for the time per byte.",
          "Latency is measured in microseconds for fast interconnects and tens of microseconds or more for ordinary networks.",
          "Bandwidth is often quoted in gigabits per second (Gbps); one byte is 8 bits.",
          "Practice 1 is transfer_ms(size_mb, latency_us, bandwidth_gbps), which applies this model and returns milliseconds.",
          "The example compares a large and a tiny message on two kinds of network.",
          "For large messages, bandwidth dominates; for tiny ones, latency dominates.",
          "This is why many small messages are slower than one large one with the same total size (Day 21).",
          "Real networks add effects such as congestion, but the model is accurate enough for planning.",
          "Units are the most common source of mistakes: always convert bits, bytes, micro- and milliseconds carefully.",
          "Writing the units next to every number in your code, for example size_mb and latency_us, prevents most of these mistakes."
        ],
        "example": "Posting parcels: a fixed trip to the post office (latency) plus time proportional to how many boxes you carry (bandwidth).",
        "code": "def transfer_ms(size_mb, latency_us, gbps):\n    return latency_us / 1000 + size_mb * 8 / (gbps * 1000) * 1000\n\nfor net, lat, bw in [(\"InfiniBand 400G\", 5, 400), (\"Ethernet 25G\", 50, 25)]:\n    for size in [0.001, 100]:\n        print(f\"{net:16} {size:>7} MB: {transfer_ms(size, lat, bw):8.3f} ms\")",
        "output": "InfiniBand 400G    0.001 MB:    0.005 ms\nInfiniBand 400G      100 MB:    2.005 ms\nEthernet 25G       0.001 MB:    0.050 ms\nEthernet 25G         100 MB:   32.050 ms",
        "codeNotes": [
          {
            "line": 2,
            "note": "Latency plus size over bandwidth, in milliseconds."
          }
        ],
        "tryIt": "For which message and network does latency dominate?",
        "check": {
          "question": "In the alpha-beta model, what dominates the time of very large messages?",
          "options": [
            "Latency",
            "Bandwidth",
            "Neither"
          ],
          "answer": 1,
          "why": "Size over bandwidth grows with the message."
        }
      },
      {
        "title": "Ring all-reduce time",
        "say": [
          "Ring all-reduce takes 2(p − 1) steps, and each step sends a chunk of size data / p (Day 5).",
          "So its time is 2(p − 1) × (latency + (size / p) / bandwidth).",
          "The bandwidth part approaches 2 × size / bandwidth as p grows, which barely depends on the number of GPUs.",
          "The latency part grows linearly with p, which matters on very large clusters or for small messages.",
          "Practice 2 is allreduce_ms(size_mb, gpus, latency_us, bandwidth_gbps).",
          "The example computes all-reduce time for 1 GB of gradients on growing clusters.",
          "The time rises only slightly from 8 to 1024 GPUs, which is why rings scale so well for large messages.",
          "Tree algorithms have logarithmic latency terms and are used when latency dominates.",
          "NCCL chooses between ring and tree automatically based on message size and cluster shape.",
          "This formula lets you predict whether communication will be a bottleneck before you launch."
        ],
        "example": "A bucket brigade: adding more people barely changes the time per bucket, but each extra person adds a little handover delay.",
        "code": "def allreduce_ms(size_mb, p, lat_us, gbps):\n    if p == 1:\n        return 0.0\n    return 2 * (p - 1) * (lat_us / 1000 + (size_mb / p) * 8 / (gbps * 1000) * 1000)\n\nfor p in [8, 64, 1024]:\n    print(f\"{p:5} GPUs: {allreduce_ms(1000, p, 5, 400):7.2f} ms for 1 GB\")",
        "output": "    8 GPUs:   35.07 ms for 1 GB\n   64 GPUs:   40.01 ms for 1 GB\n 1024 GPUs:   50.19 ms for 1 GB",
        "codeNotes": [
          {
            "line": 4,
            "note": "2(p − 1) steps, each moving one chunk."
          }
        ],
        "tryIt": "How much of the 1024-GPU time is latency? Work it out from the formula.",
        "check": {
          "question": "What happens to the bandwidth term of ring all-reduce as p grows large?",
          "options": [
            "It grows linearly",
            "It approaches 2 × size / bandwidth",
            "It becomes zero"
          ],
          "answer": 1,
          "why": "Traffic per GPU stays below twice the data."
        }
      },
      {
        "title": "Network topology",
        "say": [
          "Inside a server, GPUs are connected by very fast links such as NVLink and NVSwitch, with hundreds of gigabytes per second.",
          "Between servers, InfiniBand or high-speed Ethernet (RoCE) connects each GPU at around 25 to 100 gigabytes per second.",
          "Large clusters use switch layers arranged as fat trees or rail-optimised designs, so many pairs can talk at once.",
          "Communication across racks or pods may pass through more switches and share bandwidth.",
          "The example compares the time to move 1 GB over each kind of link.",
          "Topology-aware placement puts the most communication-heavy parallelism on the fastest links.",
          "This is why tensor parallelism stays inside a server and data parallelism spans the cluster (Day 11).",
          "Hierarchical all-reduce first reduces inside each server, then across servers, then broadcasts inside again.",
          "Knowing your cluster's topology is part of planning a training run.",
          "Cloud providers publish these details for their GPU instances."
        ],
        "example": "Talking to someone at the same desk, in the same building by phone, or in another city by post.",
        "code": "links = {\"NVLink (same server)\": 900, \"InfiniBand per GPU\": 50, \"cross-pod share\": 12.5}\nfor name, gb_per_s in links.items():\n    print(f\"{name:22} {1 / gb_per_s * 1000:7.1f} ms per GB\")",
        "output": "NVLink (same server)       1.1 ms per GB\nInfiniBand per GPU        20.0 ms per GB\ncross-pod share           80.0 ms per GB",
        "codeNotes": [
          {
            "line": 1,
            "note": "Approximate GB per second."
          }
        ],
        "tryIt": "If an all-reduce crosses pods, which link sets its speed?",
        "check": {
          "question": "What does hierarchical all-reduce do first?",
          "options": [
            "Sends everything across the cluster",
            "Reduces within each server over fast links",
            "Broadcasts to all"
          ],
          "answer": 1,
          "why": "Use the fastest links first."
        }
      },
      {
        "title": "Is communication the bottleneck?",
        "say": [
          "To decide, compare the time for one step's communication with the time for its computation.",
          "Compute time per step is about 6 × parameters × tokens per step ÷ (GPU FLOPs × MFU) for each GPU's share.",
          "If communication takes less time than computation and can overlap with it, it costs little.",
          "The example compares both for a 7B model on 64 GPUs with two different networks.",
          "On a fast network, communication is a small fraction of step time; on a slow one it dominates.",
          "Remedies for slow networks include larger batches per GPU, gradient accumulation, overlap (Day 21) and gradient compression.",
          "Such estimates, done before buying or renting a cluster, can save large sums.",
          "They also explain why published results on one cluster may not transfer to another.",
          "Always validate estimates with a short benchmark run.",
          "A benchmark of a few hundred steps on the real cluster usually costs little compared with the full run it protects.",
          "This is the same analysis that network engineers use when designing AI clusters."
        ],
        "example": "Checking whether the delivery drive takes longer than the cooking before promising customers a delivery time.",
        "code": "params, tokens_per_gpu, flops, mfu = 7e9, 8192, 312e12, 0.45\ncompute_ms = 6 * params * tokens_per_gpu / (flops * mfu) * 1000\ngrad_mb, p = 14000, 64\nfor name, lat, gbps in [(\"InfiniBand 400G\", 5, 400), (\"Ethernet 25G\", 50, 25)]:\n    comm_ms = 2 * (p - 1) * (lat / 1000 + (grad_mb / p) * 8 / (gbps * 1000) * 1000)\n    print(f\"{name:16} compute {compute_ms:6.0f} ms, all-reduce {comm_ms:6.0f} ms\")",
        "output": "InfiniBand 400G  compute   2451 ms, all-reduce    552 ms\nEthernet 25G     compute   2451 ms, all-reduce   8826 ms",
        "codeNotes": [
          {
            "line": 2,
            "note": "Compute time for this GPU's tokens."
          },
          {
            "line": 5,
            "note": "Ring all-reduce of 14 GB of gradients."
          }
        ],
        "tryIt": "With the Ethernet network, how many tokens per GPU per step would make compute as long as communication?",
        "check": {
          "question": "When is communication cheap?",
          "options": [
            "Always",
            "When it is shorter than compute and can overlap with it",
            "Never"
          ],
          "answer": 1,
          "why": "Hidden communication costs little."
        }
      },
      {
        "title": "Reducing communication",
        "say": [
          "Several techniques reduce what must be communicated.",
          "Gradient accumulation communicates once per several micro-batches (Day 6).",
          "Mixed precision halves gradient size compared with FP32 (Day 7).",
          "Gradient compression, such as low-precision or sparse updates, shrinks messages further at some risk to accuracy.",
          "Local SGD and DiLoCo-style methods let groups train independently for many steps and synchronise rarely, suited to slow links between data centres.",
          "The example compares the communication per example for several strategies.",
          "Each technique has trade-offs in accuracy, complexity or memory.",
          "Measuring the effect on both speed and final quality is essential.",
          "For most runs on good networks, accumulation, BF16 and overlap are enough.",
          "Tomorrow shows how to overlap communication with the backward pass."
        ],
        "example": "Sending a weekly summary instead of hourly updates, or writing in shorthand, to save postage.",
        "code": "base_mb = 28000\nstrategies = [(\"fp32 gradients, every micro-batch\", base_mb, 1),\n              (\"bf16 gradients\", base_mb / 2, 1),\n              (\"bf16 + accumulate 8\", base_mb / 2, 8),\n              (\"bf16 + accumulate 8 + sync every 4 updates\", base_mb / 2, 32)]\nfor name, mb, every in strategies:\n    print(f\"{name:44} {mb / every:8.0f} MB per micro-batch\")",
        "output": "fp32 gradients, every micro-batch               28000 MB per micro-batch\nbf16 gradients                                  14000 MB per micro-batch\nbf16 + accumulate 8                              1750 MB per micro-batch\nbf16 + accumulate 8 + sync every 4 updates        438 MB per micro-batch",
        "codeNotes": [
          {
            "line": 4,
            "note": "One all-reduce per 8 micro-batches."
          }
        ],
        "tryIt": "Which of these strategies changes training behaviour, and which do not?",
        "check": {
          "question": "What does gradient accumulation do to communication per example?",
          "options": [
            "Increases it",
            "Reduces it",
            "Nothing"
          ],
          "answer": 1,
          "why": "Fewer all-reduces for the same data."
        }
      },
      {
        "title": "Practice time: communication cost",
        "say": [
          "Practice 1: transfer_ms(size_mb, latency_us, bandwidth_gbps). Return latency in milliseconds plus size × 8 / (bandwidth × 1000) seconds converted to milliseconds, rounded to 3 decimals.",
          "The checks include a 100 MB message on fast and slow networks and a tiny message dominated by latency.",
          "Practice 2: allreduce_ms(size_mb, gpus, latency_us, bandwidth_gbps). Return 2(p − 1) × (latency + chunk transfer time) in milliseconds, rounded to 2 decimals, and 0.0 for one GPU.",
          "The checks include 8 and 16 GPUs and a single GPU.",
          "After passing, compute the all-reduce time for your planned model and compare with its compute time.",
          "The example prints that comparison for several model sizes.",
          "Tomorrow overlaps communication with computation so it costs even less.",
          "This simple model explains most communication behaviour you will meet in practice.",
          "Network engineers and ML engineers speak the same language when they use it.",
          "If your numbers are off by a factor of 8 or 1000, check bits versus bytes and micro- versus milliseconds."
        ],
        "example": "An engineer's back-of-the-envelope calculation before a big build.",
        "code": "def allreduce_ms(size_mb, p, lat_us=5, gbps=400):\n    return 2 * (p - 1) * (lat_us / 1000 + (size_mb / p) * 8 / (gbps * 1000) * 1000)\n\nfor name, params in [(\"1.3B\", 1.3e9), (\"7B\", 7e9), (\"13B\", 13e9)]:\n    grad_mb = params * 2 / 1e6\n    print(f\"{name:5} bf16 gradients {grad_mb:7.0f} MB -> all-reduce on 64 GPUs {allreduce_ms(grad_mb, 64):7.1f} ms\")",
        "output": "1.3B  bf16 gradients    2600 MB -> all-reduce on 64 GPUs   103.0 ms\n7B    bf16 gradients   14000 MB -> all-reduce on 64 GPUs   551.9 ms\n13B   bf16 gradients   26000 MB -> all-reduce on 64 GPUs  1024.4 ms",
        "codeNotes": [
          {
            "line": 5,
            "note": "Two bytes per parameter in BF16."
          }
        ],
        "tryIt": "At what model size would the all-reduce take longer than one second?",
        "check": {
          "question": "What is allreduce_ms for one GPU?",
          "options": [
            "The transfer time",
            "0.0",
            "The latency"
          ],
          "answer": 1,
          "why": "No communication is needed."
        }
      }
    ],
    "summary": [
      "Transfer time = latency + size / bandwidth (alpha-beta model).",
      "Ring all-reduce time = 2(p − 1)(latency + (size/p)/bandwidth).",
      "Topology: NVLink inside servers, InfiniBand/Ethernet between them.",
      "Compare communication with compute to find bottlenecks.",
      "Accumulation, BF16, overlap and compression reduce communication."
    ],
    "projectStep": {
      "title": "Training planner, part 20",
      "steps": [
        "Implement transfer_ms and allreduce_ms.",
        "Estimate communication and compute time for your planned run.",
        "Choose communication-saving techniques if needed."
      ]
    }
  },
  {
    "day": 21,
    "title": "Overlapping Compute and Communication: Gradient Bucketing",
    "goal": "You can group gradients into buckets in the order they become ready, simulate overlapping each bucket's all-reduce with the remaining backward computation, and measure the time saved.",
    "minutes": 30,
    "recap": "Yesterday estimated how long communication takes. Today we hide most of that time behind computation, which is how data-parallel training stays fast on real networks.",
    "parts": [
      {
        "title": "Gradients become ready in reverse",
        "say": [
          "The backward pass runs from the last layer to the first.",
          "So the last layer's gradients are ready first, long before the first layer's.",
          "Waiting for the whole backward pass before communicating wastes that head start.",
          "Instead, we can start all-reducing the last layers' gradients while earlier layers are still computing.",
          "This overlap of communication and computation is one of the most important performance techniques in distributed training.",
          "The example prints when each layer's gradients become ready in a four-layer backward pass.",
          "PyTorch DDP does this automatically using hooks that fire as each gradient is ready.",
          "The same idea applies to FSDP's reduce-scatters and prefetched all-gathers (Day 10).",
          "Overlap works best when communication and computation use different hardware resources, as they do on GPUs with dedicated communication engines.",
          "Today we simulate it to understand exactly how much time it can save."
        ],
        "example": "Washing up while the next course is cooking, instead of leaving all the dishes until the meal is finished.",
        "code": "layer_ms = {\"layer 4\": 30, \"layer 3\": 30, \"layer 2\": 30, \"layer 1\": 30}\nclock = 0\nfor name, ms in layer_ms.items():\n    clock += ms\n    print(f\"t={clock:3} ms: gradients of {name} ready\")",
        "output": "t= 30 ms: gradients of layer 4 ready\nt= 60 ms: gradients of layer 3 ready\nt= 90 ms: gradients of layer 2 ready\nt=120 ms: gradients of layer 1 ready",
        "codeNotes": [
          {
            "line": 1,
            "note": "Backward order: last layer first."
          }
        ],
        "tryIt": "When could communication of layer 4's gradients start?",
        "check": {
          "question": "Which layer's gradients are ready first in the backward pass?",
          "options": [
            "The first layer",
            "The last layer",
            "All at the same time"
          ],
          "answer": 1,
          "why": "Backward runs from the output towards the input."
        }
      },
      {
        "title": "Gradient buckets",
        "say": [
          "Sending each small gradient separately would pay the latency cost many times (Day 20).",
          "Instead, gradients are grouped into buckets of a target size, commonly around 25 MB in DDP.",
          "Buckets are filled in the order gradients become ready: last layer first.",
          "When a bucket is full, its all-reduce starts while the backward pass continues.",
          "Practice 1 is make_buckets(layer_sizes_mb, bucket_mb), which forms buckets from the last layer to the first, giving an oversized layer its own bucket.",
          "The example groups five layers into buckets of at most 25 MB.",
          "Bucket size is a trade-off: small buckets start earlier but pay more latency, large buckets pay less latency but start later.",
          "DDP exposes this as the bucket_cap_mb setting.",
          "Very large layers, such as embeddings, often end up in a bucket of their own.",
          "Tuning bucket size is a quick win when profiling shows exposed communication."
        ],
        "example": "Posting letters in batches as each envelope fills, rather than one letter per trip or everything at the end.",
        "code": "sizes = [10, 20, 5, 15, 30]\nbuckets, current, total = [], [], 0\nfor i in reversed(range(len(sizes))):\n    if current and total + sizes[i] > 25:\n        buckets.append(current)\n        current, total = [], 0\n    current.append(i)\n    total += sizes[i]\nbuckets.append(current)\nprint(\"buckets (layer indices):\", buckets)",
        "output": "buckets (layer indices): [[4], [3, 2], [1], [0]]",
        "codeNotes": [
          {
            "line": 3,
            "note": "Walk the layers from last to first."
          },
          {
            "line": 4,
            "note": "Close the bucket when the next layer would overflow it."
          }
        ],
        "tryIt": "What buckets do you get with a limit of 40 MB?",
        "check": {
          "question": "Why group gradients into buckets?",
          "options": [
            "To compress them",
            "To avoid paying latency for many tiny messages",
            "To change their values"
          ],
          "answer": 1,
          "why": "Fewer, larger messages have less total latency."
        }
      },
      {
        "title": "Simulating overlap",
        "say": [
          "Each bucket's all-reduce can start only when its gradients have been computed and the previous all-reduce has finished.",
          "So we track two clocks: when computation of each bucket finishes, and when communication finishes.",
          "For each bucket, communication finishes at max(previous communication end, this bucket's compute end) + its communication time.",
          "Practice 2 is step_time(compute_ms, comm_ms), which returns the overlapped time, the fully sequential time and the percentage saved.",
          "The example simulates three buckets with equal compute and communication times.",
          "The overlapped step finishes much sooner than doing all computation and then all communication.",
          "Only the last bucket's communication is fully exposed, plus any waiting when communication is slower than computation.",
          "When communication is much slower than computation, overlap helps less, because communication dominates regardless.",
          "This simple model explains most of the behaviour seen in real profiler traces.",
          "It also shows why the final bucket should be small: its communication cannot be hidden."
        ],
        "example": "A factory where each finished batch of parts is shipped as soon as it is ready, while the next batch is being made.",
        "code": "compute = [10, 10, 10]\ncomm = [8, 8, 8]\ncompute_done = comm_done = 0\nfor i, (c, m) in enumerate(zip(compute, comm)):\n    compute_done += c\n    start = max(comm_done, compute_done)\n    comm_done = start + m\n    print(f\"bucket {i}: compute ends {compute_done:2}, all-reduce {start:2}-{comm_done:2}\")\nprint(f\"overlapped {comm_done} ms vs sequential {sum(compute) + sum(comm)} ms\")",
        "output": "bucket 0: compute ends 10, all-reduce 10-18\nbucket 1: compute ends 20, all-reduce 20-28\nbucket 2: compute ends 30, all-reduce 30-38\noverlapped 38 ms vs sequential 54 ms",
        "codeNotes": [
          {
            "line": 6,
            "note": "Start when both the gradients and the network are ready."
          }
        ],
        "tryIt": "Change comm to [20, 20, 20]. How much does overlap save now?",
        "check": {
          "question": "Which communication is always exposed in the overlap model?",
          "options": [
            "The first bucket's",
            "The last bucket's",
            "None"
          ],
          "answer": 1,
          "why": "Nothing is left to compute after the last bucket."
        }
      },
      {
        "title": "When overlap is not enough",
        "say": [
          "If the total communication time is larger than the backward computation, overlap cannot hide it all.",
          "The step is then communication-bound, and the fixes from Day 20 apply: accumulation, faster networks, compression, or a different parallel strategy.",
          "The example compares a compute-bound and a communication-bound case.",
          "Measuring the fraction of step time where the GPU is idle waiting for communication tells you which case you are in.",
          "Overlap can also slow down computation slightly, because both compete for memory bandwidth.",
          "Some systems reserve a few GPU cores for communication to keep both running at full speed.",
          "In pipeline and tensor parallelism, overlap is harder because communication sits on the critical path inside the forward pass.",
          "Advanced schedules break layers into pieces so that communication of one piece overlaps computation of another.",
          "The general principle is the same everywhere: keep every resource busy at the same time.",
          "Profiling (Day 24) is how you check whether overlap is really happening."
        ],
        "example": "A delivery service that can only ship as fast as its trucks allow, no matter how quickly the warehouse packs.",
        "code": "def overlapped(compute, comm):\n    cd = md = 0\n    for c, m in zip(compute, comm):\n        cd += c\n        md = max(md, cd) + m\n    return md\n\nfor name, comm in [(\"compute-bound\", [5, 5, 5, 5]), (\"comm-bound\", [25, 25, 25, 25])]:\n    t = overlapped([20, 20, 20, 20], comm)\n    print(f\"{name:14} step {t:3} ms, compute {80} ms, communication {sum(comm)} ms\")",
        "output": "compute-bound  step  85 ms, compute 80 ms, communication 20 ms\ncomm-bound     step 120 ms, compute 80 ms, communication 100 ms",
        "codeNotes": [
          {
            "line": 5,
            "note": "The overlap rule from the previous part."
          }
        ],
        "tryIt": "In the communication-bound case, what is the lower limit on step time?",
        "check": {
          "question": "When can overlap not hide communication?",
          "options": [
            "When communication is shorter than compute",
            "When total communication exceeds the computation it can overlap with",
            "Never"
          ],
          "answer": 1,
          "why": "You cannot hide more time than there is to hide behind."
        }
      },
      {
        "title": "Overlap in real frameworks",
        "say": [
          "DDP registers a hook on each parameter; when a bucket's gradients are all ready, it launches an asynchronous all-reduce.",
          "At the end of backward, DDP waits for all outstanding all-reduces before the optimizer step.",
          "FSDP prefetches the next unit's parameters during the current unit's computation, and reduce-scatters gradients as they become ready.",
          "DeepSpeed offers overlap_comm and bucket size settings for ZeRO.",
          "Megatron overlaps gradient reduction with the backward pass of pipeline stages and tensor-parallel communication with computation.",
          "The example lists the main overlap settings by framework.",
          "Default settings are usually sensible; tune them only after profiling.",
          "Order of parameters matters: DDP builds buckets in reverse registration order, which may not match execution order in unusual models.",
          "The find_unused_parameters option in DDP adds overhead and should only be used when needed.",
          "Reading framework documentation with today's model in mind makes the settings meaningful."
        ],
        "example": "A well-run restaurant where cooks, waiters and dishwashers all work at once, coordinated by a head chef.",
        "code": "settings = {\"PyTorch DDP\": [\"bucket_cap_mb\", \"gradient_as_bucket_view\"],\n            \"PyTorch FSDP\": [\"forward_prefetch\", \"backward_prefetch\"],\n            \"DeepSpeed ZeRO\": [\"overlap_comm\", \"reduce_bucket_size\", \"allgather_bucket_size\"]}\nfor framework, names in settings.items():\n    print(f\"{framework:15} {names}\")",
        "output": "PyTorch DDP     ['bucket_cap_mb', 'gradient_as_bucket_view']\nPyTorch FSDP    ['forward_prefetch', 'backward_prefetch']\nDeepSpeed ZeRO  ['overlap_comm', 'reduce_bucket_size', 'allgather_bucket_size']",
        "codeNotes": [
          {
            "line": 3,
            "note": "DeepSpeed exposes bucket sizes for both directions."
          }
        ],
        "tryIt": "Which of these settings would you change first if the last bucket is very large?",
        "check": {
          "question": "What does DDP do at the end of the backward pass?",
          "options": [
            "Starts all communication",
            "Waits for outstanding all-reduces before the optimizer step",
            "Saves a checkpoint"
          ],
          "answer": 1,
          "why": "Updates need the averaged gradients."
        }
      },
      {
        "title": "Practice time: overlap",
        "say": [
          "Practice 1: make_buckets(layer_sizes_mb, bucket_mb). Walk layers from last to first, closing the current bucket when adding the next layer would exceed bucket_mb, and return the list of buckets of layer indices.",
          "The checks include five layers with a 25 MB cap, pairs of small layers, an oversized layer and no layers.",
          "Practice 2: step_time(compute_ms, comm_ms). Simulate the two clocks and return overlapped time, sequential time and the percentage saved, rounded to 1 decimal.",
          "The checks include equal compute and communication, a communication-bound case and a single bucket that cannot overlap.",
          "After passing, feed make_buckets' output into step_time using compute and communication times proportional to bucket sizes.",
          "The example does that, comparing two bucket sizes.",
          "Tomorrow steps back to the biggest planning question: how large a model and how much data for a given budget.",
          "Overlap is why data-parallel training can scale to thousands of GPUs.",
          "The two-clock simulation is a pattern you can reuse for any pipeline of dependent tasks.",
          "If step_time is wrong, print both clocks after each bucket."
        ],
        "example": "Rehearsing a relay handover until no time is lost between runners.",
        "code": "def buckets(sizes, cap):\n    out, cur, tot = [], [], 0\n    for i in reversed(range(len(sizes))):\n        if cur and tot + sizes[i] > cap:\n            out.append(cur)\n            cur, tot = [], 0\n        cur.append(i)\n        tot += sizes[i]\n    return out + ([cur] if cur else [])\n\nsizes = [4, 8, 8, 8, 8, 8, 8, 12]\nfor cap in [16, 64]:\n    cd = md = 0\n    for b in buckets(sizes, cap):\n        mb = sum(sizes[i] for i in b)\n        cd += mb * 1.0\n        md = max(md, cd) + 0.5 + mb * 0.8\n    print(f\"cap {cap:2} MB: step {md:5.1f} ms (compute {sum(sizes) * 1.0} ms)\")",
        "output": "cap 16 MB: step  77.0 ms (compute 64.0 ms)\ncap 64 MB: step 115.7 ms (compute 64.0 ms)",
        "codeNotes": [
          {
            "line": 16,
            "note": "1 ms of compute per MB of gradients."
          },
          {
            "line": 17,
            "note": "0.5 ms latency plus 0.8 ms per MB of communication."
          }
        ],
        "tryIt": "Why does the large cap make the step slower here?",
        "check": {
          "question": "In make_buckets, which layer goes into the first bucket?",
          "options": [
            "Layer 0",
            "The last layer",
            "The largest layer"
          ],
          "answer": 1,
          "why": "Buckets fill in backward order."
        }
      }
    ],
    "summary": [
      "Backward produces gradients from the last layer to the first.",
      "Group gradients into buckets to limit latency costs.",
      "Each bucket's all-reduce overlaps with the remaining backward pass.",
      "Only the last bucket's communication is always exposed.",
      "If communication exceeds computation, overlap cannot hide it all."
    ],
    "projectStep": {
      "title": "Training planner, part 21",
      "steps": [
        "Implement make_buckets and step_time.",
        "Compare step times for several bucket sizes.",
        "Record the bucket size you would choose and why."
      ]
    }
  },
  {
    "day": 22,
    "title": "Scaling Laws and Compute-Optimal Training",
    "goal": "You can explain neural scaling laws, compute the compute-optimal model and data size for a budget with the Chinchilla rule, and produce a training budget report with GPU-hours, cost and a verdict.",
    "minutes": 30,
    "recap": "We now know how to run training efficiently on many GPUs. Today we ask what to train in the first place: how big a model, on how much data, for the compute we can afford.",
    "parts": [
      {
        "title": "Scaling laws",
        "say": [
          "Scaling laws describe how a model's loss falls predictably as model size, data and compute increase.",
          "Kaplan and colleagues at OpenAI (2020) found that loss follows smooth power laws over many orders of magnitude.",
          "This means small experiments can predict the results of much larger runs.",
          "Labs use scaling laws to choose model sizes and to forecast performance before spending millions.",
          "The example evaluates a power-law loss curve for several model sizes.",
          "Each tenfold increase in size gives a smaller absolute improvement, but improvements keep coming.",
          "The curves eventually flatten towards an irreducible loss set by the data itself.",
          "Scaling laws hold for loss; specific abilities can appear more suddenly, which is an active research area.",
          "Data quality shifts these curves, which is why data work matters so much.",
          "Knowing the shape of these curves helps you judge whether a bigger model is worth the cost.",
          "They also warn against a common mistake: judging a large model by a small run that stopped long before its loss curve had flattened."
        ],
        "example": "A savings plan: each extra amount saved adds a predictable, though gradually smaller, improvement to what you can afford.",
        "code": "E, A, alpha = 1.7, 400.0, 0.34\nfor params in [1e8, 1e9, 1e10, 1e11]:\n    loss = E + A / params ** alpha\n    print(f\"{params:.0e} parameters -> predicted loss {loss:.3f}\")",
        "output": "1e+08 parameters -> predicted loss 2.462\n1e+09 parameters -> predicted loss 2.048\n1e+10 parameters -> predicted loss 1.859\n1e+11 parameters -> predicted loss 1.773",
        "codeNotes": [
          {
            "line": 3,
            "note": "Irreducible loss plus a power-law term that shrinks with size."
          }
        ],
        "tryIt": "How much does loss improve from 1e10 to 1e11 compared with from 1e8 to 1e9?",
        "check": {
          "question": "What do scaling laws let researchers do?",
          "options": [
            "Avoid training",
            "Predict large-run results from small experiments",
            "Remove the need for data"
          ],
          "answer": 1,
          "why": "Smooth power laws allow extrapolation."
        }
      },
      {
        "title": "Chinchilla: balancing parameters and data",
        "say": [
          "For a fixed compute budget, you can train a big model on little data or a small model on lots of data.",
          "Hoffmann and colleagues at DeepMind (2022), in the Chinchilla paper, found that the best balance uses about 20 training tokens per parameter.",
          "Many earlier models, such as GPT-3 with 175B parameters on 300B tokens, were undertrained by this measure.",
          "Chinchilla, with 70B parameters on 1.4T tokens, beat the much larger Gopher using the same compute.",
          "Combining C = 6·N·D with D = 20·N gives C = 120·N², so N = √(C / 120).",
          "Practice 1 is chinchilla(compute_flops), which returns the compute-optimal parameters and tokens in billions.",
          "The example applies the rule to several budgets.",
          "The exact ratio depends on details of the data and model; later work estimated values between about 15 and 25.",
          "This is one of the most useful single rules in large-model planning.",
          "It assumes you care only about training compute, as the next part explains."
        ],
        "example": "Planning a garden: with a fixed budget, you can buy more plants or more soil, and the best garden balances both.",
        "code": "import math\n\nfor budget in [1e21, 1e22, 5.76e23]:\n    n = math.sqrt(budget / 120)\n    print(f\"{budget:.2e} FLOPs -> {n / 1e9:6.1f}B parameters on {20 * n / 1e9:8.1f}B tokens\")",
        "output": "1.00e+21 FLOPs ->    2.9B parameters on     57.7B tokens\n1.00e+22 FLOPs ->    9.1B parameters on    182.6B tokens\n5.76e+23 FLOPs ->   69.3B parameters on   1385.6B tokens",
        "codeNotes": [
          {
            "line": 4,
            "note": "From C = 120 N squared."
          }
        ],
        "tryIt": "Check the last line against Chinchilla's actual 70B parameters and 1.4T tokens.",
        "check": {
          "question": "About how many tokens per parameter does the Chinchilla rule recommend?",
          "options": [
            "1",
            "20",
            "1000"
          ],
          "answer": 1,
          "why": "Roughly 20 tokens per parameter."
        }
      },
      {
        "title": "Beyond compute-optimal",
        "say": [
          "Chinchilla optimises training compute only, but a model is then used for inference, often by millions of people.",
          "A smaller model trained on far more data costs more to train but less to run for every request.",
          "That is why models such as Llama 3 8B were trained on about 15 trillion tokens, nearly 2000 tokens per parameter.",
          "Such models are \"overtrained\" by the Chinchilla measure on purpose, and it is the right choice when inference dominates total cost.",
          "The example compares total cost for a compute-optimal and a smaller, overtrained model once inference is included.",
          "The best choice depends on expected usage, latency requirements and available data.",
          "Data availability is becoming a real limit: high-quality text is finite, so repeated epochs and synthetic data are studied.",
          "Always state which objective your plan optimises: training cost, inference cost, or quality at a fixed size.",
          "These trade-offs are a core part of strategy discussions at AI companies.",
          "Your budget report in Practice 2 flags whether a plan is undertrained, balanced or overtrained."
        ],
        "example": "Buying a car: a cheaper car that uses more fuel may cost more over ten years than a pricier efficient one.",
        "code": "train_cost = {\"compute-optimal 13B\": 1.0, \"overtrained 7B\": 1.4}\ninfer_cost_per_billion = {\"compute-optimal 13B\": 0.0013, \"overtrained 7B\": 0.0007}\nfor requests_billions in [10, 1000]:\n    for name in train_cost:\n        total = train_cost[name] + infer_cost_per_billion[name] * requests_billions\n        print(f\"{requests_billions:5}B requests, {name:20}: total {total:5.2f} (relative units)\")",
        "output": "   10B requests, compute-optimal 13B : total  1.01 (relative units)\n   10B requests, overtrained 7B      : total  1.41 (relative units)\n 1000B requests, compute-optimal 13B : total  2.30 (relative units)\n 1000B requests, overtrained 7B      : total  2.10 (relative units)",
        "codeNotes": [
          {
            "line": 5,
            "note": "Training once plus inference for every request."
          }
        ],
        "tryIt": "Above roughly how many billion requests does the overtrained model become cheaper overall?",
        "check": {
          "question": "Why train a small model on far more than 20 tokens per parameter?",
          "options": [
            "It is always cheaper to train",
            "It lowers inference cost when the model will be used heavily",
            "It removes the need for evaluation"
          ],
          "answer": 1,
          "why": "Inference cost matters when usage is large."
        }
      },
      {
        "title": "From FLOPs to a budget",
        "say": [
          "A budget report turns a plan into numbers decision makers understand: GPU-hours and money.",
          "GPU-hours = total FLOPs ÷ (peak FLOPs per GPU × MFU) ÷ 3600.",
          "Cost = GPU-hours × price per GPU-hour.",
          "Practice 2 is budget_report(params, tokens, gpu_peak_flops, mfu, price_per_gpu_hour), which also reports tokens per parameter and a verdict.",
          "The verdict is UNDERTRAINED below 15 tokens per parameter, OVERTRAINED above 100, and BALANCED between.",
          "The example builds a report for a 7B model on 140B tokens.",
          "Real budgets add overheads: failures (Day 18), evaluation runs, experiments and storage.",
          "A contingency of 20 to 30 percent is common for large runs.",
          "Reports should state their assumptions, especially MFU and price, since both vary widely.",
          "Being able to produce such a report quickly is a valuable skill for any ML engineer.",
          "Sharing the report with finance and leadership early avoids surprises when the bills arrive."
        ],
        "example": "A builder's quote: materials, labour hours and cost, with the assumptions written down.",
        "code": "params, tokens, peak, mfu, price = 7e9, 140e9, 312e12, 0.4, 2.0\nflops = 6 * params * tokens\nhours = round(flops / (peak * mfu) / 3600)\ntpp = tokens / params\nprint(f\"FLOPs {flops:.2e}, GPU-hours {hours:,}, cost ${hours * price:,.0f}, tokens/param {tpp:.1f}\")",
        "output": "FLOPs 5.88e+21, GPU-hours 13,088, cost $26,176, tokens/param 20.0",
        "codeNotes": [
          {
            "line": 3,
            "note": "Seconds of GPU time converted to whole hours."
          }
        ],
        "tryIt": "What happens to the cost if MFU improves from 40% to 50%?",
        "check": {
          "question": "How is GPU-hours computed from FLOPs?",
          "options": [
            "FLOPs × price",
            "FLOPs ÷ (peak FLOPs × MFU) ÷ 3600",
            "FLOPs ÷ tokens"
          ],
          "answer": 1,
          "why": "Divide by achieved speed, then convert seconds to hours."
        }
      },
      {
        "title": "Using scaling laws responsibly",
        "say": [
          "Scaling-law fits come from a range of experiments; extrapolating far beyond that range adds uncertainty.",
          "Fitting your own small-scale runs, on your own data, gives more reliable predictions than borrowed constants.",
          "The example fits a simple power law to three small runs and predicts a larger one.",
          "Always include error bars or a range, not a single number, when presenting forecasts.",
          "Changes in architecture, data mixture or tokenizer can change the curves.",
          "Compute is also only one input: engineering effort, data cleaning and evaluation all take time.",
          "Energy use and environmental impact scale with compute and should be considered too.",
          "Transparent reporting of compute and emissions is increasingly expected.",
          "Scaling laws inform decisions; they do not replace careful evaluation of the final model.",
          "Tomorrow measures how efficiently a real run uses its hardware, the MFU we have been assuming."
        ],
        "example": "A weather forecast: very useful for tomorrow, less certain for next month.",
        "code": "import math\n\nruns = [(1e8, 3.90), (3e8, 3.55), (1e9, 3.25)]\nxs = [math.log(n) for n, _ in runs]\nys = [math.log(loss - 1.7) for _, loss in runs]\nmx, my = sum(xs) / 3, sum(ys) / 3\nslope = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs)\nintercept = my - slope * mx\nfor n in [1e10, 1e11]:\n    print(f\"predicted loss at {n:.0e} parameters: {1.7 + math.exp(intercept + slope * math.log(n)):.2f}\")\nprint(f\"fitted exponent: {-slope:.2f}\")",
        "output": "predicted loss at 1e+10 parameters: 2.79\npredicted loss at 1e+11 parameters: 2.47\nfitted exponent: 0.15",
        "codeNotes": [
          {
            "line": 5,
            "note": "Assume an irreducible loss of 1.7 and fit the rest on a log-log scale."
          },
          {
            "line": 7,
            "note": "Least-squares slope."
          }
        ],
        "tryIt": "How sensitive is the prediction at 1e11 to the assumed irreducible loss? Try 1.6 and 1.8.",
        "check": {
          "question": "Why present forecasts with a range?",
          "options": [
            "It looks more scientific",
            "Extrapolation adds uncertainty",
            "Ranges are required by law"
          ],
          "answer": 1,
          "why": "Predictions far from the data are uncertain."
        }
      },
      {
        "title": "Practice time: budgets",
        "say": [
          "Practice 1: chinchilla(compute_flops). Compute N = √(C / 120) and D = 20N, and return both in billions rounded to 1 decimal.",
          "The checks include Chinchilla's own budget of 5.76e23 FLOPs and a smaller budget.",
          "Practice 2: budget_report(params, tokens, gpu_peak_flops, mfu, price_per_gpu_hour). Return FLOPs, whole GPU-hours, whole cost, tokens per parameter and the verdict.",
          "The checks include a balanced 7B plan, an undertrained 70B plan and an overtrained 1B plan.",
          "After passing, produce reports for three plans of your own and choose one, explaining your objective.",
          "The example compares three plans side by side.",
          "Tomorrow measures real throughput and MFU from a training log.",
          "Budget reports connect engineering to business decisions.",
          "Keeping assumptions visible makes reports easy to update when prices or hardware change.",
          "If the cost check fails, round GPU-hours before multiplying by the price, as the task describes."
        ],
        "example": "Comparing three holiday quotes side by side before booking.",
        "code": "plans = [(\"7B on 140B\", 7e9, 140e9), (\"7B on 2T\", 7e9, 2e12), (\"70B on 300B\", 70e9, 300e9)]\nfor name, n, d in plans:\n    hours = 6 * n * d / (312e12 * 0.4) / 3600\n    tpp = d / n\n    verdict = \"UNDERTRAINED\" if tpp < 15 else \"OVERTRAINED\" if tpp > 100 else \"BALANCED\"\n    print(f\"{name:12} {hours:10,.0f} GPU-hours, {tpp:6.1f} tokens/param, {verdict}\")",
        "output": "7B on 140B       13,088 GPU-hours,   20.0 tokens/param, BALANCED\n7B on 2T        186,966 GPU-hours,  285.7 tokens/param, OVERTRAINED\n70B on 300B     280,449 GPU-hours,    4.3 tokens/param, UNDERTRAINED",
        "codeNotes": [
          {
            "line": 5,
            "note": "The same verdict rule as Practice 2."
          }
        ],
        "tryIt": "Which plan would you choose for a model served to millions of users?",
        "check": {
          "question": "What verdict does 4.3 tokens per parameter get?",
          "options": [
            "BALANCED",
            "UNDERTRAINED",
            "OVERTRAINED"
          ],
          "answer": 1,
          "why": "Below 15 is undertrained."
        }
      }
    ],
    "summary": [
      "Loss falls as a smooth power law with size, data and compute.",
      "Chinchilla: about 20 tokens per parameter; N = √(C/120).",
      "Heavily used models are often trained far past compute-optimal.",
      "GPU-hours = FLOPs ÷ (peak × MFU) ÷ 3600; cost = hours × price.",
      "Fit your own curves and present forecasts with ranges."
    ],
    "projectStep": {
      "title": "Training planner, part 22",
      "steps": [
        "Implement chinchilla and budget_report.",
        "Produce budget reports for three candidate plans.",
        "Write a short recommendation stating your objective."
      ]
    }
  },
  {
    "day": 23,
    "title": "Measuring Throughput: Tokens per Second and MFU",
    "goal": "You can calculate tokens per second and model FLOPs utilisation (MFU), summarise step times with the median and slowest step, and spot slow steps that point to problems.",
    "minutes": 30,
    "recap": "Every estimate so far assumed a utilisation, usually 40%. Today we measure it from a real run, which tells us how efficient the whole system actually is.",
    "parts": [
      {
        "title": "Throughput",
        "say": [
          "Throughput is how much data training processes per second, usually measured in tokens per second for language models.",
          "Tokens per second = tokens per step ÷ seconds per step, or total tokens ÷ total time.",
          "It is the most direct measure of training speed and determines how long a run takes.",
          "Per-GPU throughput, total throughput divided by the number of GPUs, makes different cluster sizes comparable.",
          "The example computes throughput from a short log of step times.",
          "Averaging over many steps gives a stable number; the first few steps are often slower and are usually excluded.",
          "Throughput should be logged continuously, so drops are noticed immediately.",
          "A fall in throughput often signals a hardware problem, a straggler or a data slowdown.",
          "Comparing throughput before and after a change is the basic way to measure an optimisation.",
          "Throughput alone does not tell you how close you are to the hardware's limit; MFU does.",
          "Some teams also track throughput per dollar, which combines speed with the price of the hardware."
        ],
        "example": "A factory's output per hour: the simplest measure of how well the line is running.",
        "code": "tokens_per_step = 4 * 1024 * 2048\nstep_seconds = [2.9, 2.1, 2.0, 2.05, 1.98, 2.02]\nsteady = step_seconds[1:]\nprint(f\"tokens per step: {tokens_per_step:,}\")\nprint(f\"steady throughput: {tokens_per_step * len(steady) / sum(steady):,.0f} tokens/s\")",
        "output": "tokens per step: 8,388,608\nsteady throughput: 4,132,319 tokens/s",
        "codeNotes": [
          {
            "line": 3,
            "note": "Skip the slow first step."
          }
        ],
        "tryIt": "What would the throughput be if you included the first step?",
        "check": {
          "question": "What is throughput for a language model usually measured in?",
          "options": [
            "Parameters",
            "Tokens per second",
            "Gigabytes"
          ],
          "answer": 1,
          "why": "Tokens processed per second."
        }
      },
      {
        "title": "Model FLOPs utilisation",
        "say": [
          "Model FLOPs utilisation (MFU) is the fraction of the hardware's peak FLOPs spent on the model's own required computation.",
          "Achieved FLOPs per second = 6 × parameters × tokens per second (Day 1).",
          "MFU = achieved ÷ (number of GPUs × peak FLOPs per GPU).",
          "Practice 1 is mfu(tokens_per_second, params, gpus, peak_flops_per_gpu).",
          "Recomputation from checkpointing is not counted, so MFU measures useful work only.",
          "Hardware FLOPs utilisation (HFU) counts recomputation too, and is always at least as high.",
          "The example computes MFU for a single GPU and a large cluster.",
          "Well-tuned large runs typically achieve 35 to 55 percent MFU; the PaLM paper reported about 46 percent.",
          "Low MFU means there is room to improve: communication, data loading, small kernels or memory-bound operations may be wasting time.",
          "MFU makes runs on different hardware and model sizes comparable.",
          "Tracking MFU over the whole run also reveals slow drifts, such as a gradually overheating node.",
          "For example, a run with 30 percent MFU on new GPUs may still finish faster than a run with 50 percent MFU on older ones, so both numbers matter."
        ],
        "example": "A car's fuel efficiency compared with the best the engine could possibly achieve.",
        "code": "params, peak = 7e9, 312e12\nfor gpus, tps in [(1, 3000), (512, 1.1e6), (512, 1.6e6)]:\n    mfu = 6 * params * tps / (gpus * peak)\n    print(f\"{gpus:3} GPUs at {tps:>9,.0f} tokens/s -> MFU {mfu:.1%}\")",
        "output": "  1 GPUs at     3,000 tokens/s -> MFU 40.4%\n512 GPUs at 1,100,000 tokens/s -> MFU 28.9%\n512 GPUs at 1,600,000 tokens/s -> MFU 42.1%",
        "codeNotes": [
          {
            "line": 3,
            "note": "Useful FLOPs achieved over peak FLOPs available."
          }
        ],
        "tryIt": "How many tokens per second would 512 GPUs need for 50% MFU?",
        "check": {
          "question": "Why does MFU exclude recomputation from checkpointing?",
          "options": [
            "It is too small to count",
            "MFU measures only the model's required work",
            "It is included"
          ],
          "answer": 1,
          "why": "Recomputation is extra work, not useful progress."
        }
      },
      {
        "title": "Step time statistics",
        "say": [
          "Averages hide problems: a few very slow steps can matter a lot.",
          "The median step time is the typical step, unaffected by a few outliers.",
          "The slowest step shows the worst case, for example a checkpoint save or a hiccup.",
          "Counting slow steps, those taking more than, say, 1.5 times the median, shows how often problems happen.",
          "Practice 2 is throughput_report(step_seconds, tokens_per_step), which returns tokens per second, the median, the slowest step and the number of slow steps.",
          "The example summarises a log with one slow step.",
          "Python's statistics module provides median, mean and other summaries.",
          "Regular slow steps at fixed intervals often line up with checkpointing or evaluation.",
          "Irregular slow steps often point to network congestion or a failing GPU.",
          "Plotting step time over the whole run makes these patterns visible at a glance.",
          "A histogram of step times is another quick way to spot a long tail of slow steps."
        ],
        "example": "Commute times: the usual journey, the worst journey and how often you were very late tell you more than the average.",
        "code": "import statistics\n\nsteps = [1.0, 1.1, 0.9, 1.0, 3.0, 1.0, 1.05, 0.95, 2.4, 1.0]\nmedian = statistics.median(steps)\nslow = [i for i, t in enumerate(steps) if t > 1.5 * median]\nprint(f\"mean {statistics.mean(steps):.3f} s, median {median:.3f} s, slowest {max(steps)} s\")\nprint(f\"slow steps at indices {slow}\")",
        "output": "mean 1.340 s, median 1.000 s, slowest 3.0 s\nslow steps at indices [4, 8]",
        "codeNotes": [
          {
            "line": 5,
            "note": "More than 1.5 times the typical step."
          }
        ],
        "tryIt": "Why is the mean larger than the median here?",
        "check": {
          "question": "Why use the median step time?",
          "options": [
            "It is always larger",
            "It shows the typical step, unaffected by a few outliers",
            "It includes checkpoint time"
          ],
          "answer": 1,
          "why": "Outliers do not move the median much."
        }
      },
      {
        "title": "Where the missing FLOPs go",
        "say": [
          "If MFU is 40 percent, where does the other 60 percent go?",
          "Some operations, such as layer normalisation, softmax and element-wise functions, are limited by memory bandwidth rather than arithmetic.",
          "Communication that is not hidden by overlap leaves GPUs idle.",
          "Pipeline bubbles (Day 12) and waiting for data (Day 19) add idle time.",
          "Small matrix sizes use the hardware less efficiently than large ones.",
          "The example breaks a step's time into categories and computes the share doing useful matrix work.",
          "Fused kernels, such as Flash Attention, combine several memory-bound operations into one and reduce wasted time.",
          "Compilers like torch.compile fuse operations automatically.",
          "Larger micro-batches, where memory allows, raise arithmetic efficiency.",
          "Each improvement shows up directly as higher MFU and lower cost.",
          "Even a few percent of extra MFU on a month-long run can save thousands of GPU-hours."
        ],
        "example": "A delivery driver's day: time actually driving loaded, versus loading, waiting at lights and returning empty.",
        "code": "step = {\"matrix multiplications\": 520, \"attention (fused)\": 90, \"norms and activations\": 110,\n        \"exposed communication\": 150, \"data wait\": 30, \"optimizer\": 100}\ntotal = sum(step.values())\nfor part_, ms in step.items():\n    print(f\"{part_:24} {ms:4} ms ({ms / total:5.1%})\")\nuseful = step[\"matrix multiplications\"] + step[\"attention (fused)\"]\nprint(f\"share of step on core model maths: {useful / total:.1%}\")",
        "output": "matrix multiplications    520 ms (52.0%)\nattention (fused)          90 ms ( 9.0%)\nnorms and activations     110 ms (11.0%)\nexposed communication     150 ms (15.0%)\ndata wait                  30 ms ( 3.0%)\noptimizer                 100 ms (10.0%)\nshare of step on core model maths: 61.0%",
        "codeNotes": [
          {
            "line": 6,
            "note": "Most of the model FLOPs happen in these two categories."
          }
        ],
        "tryIt": "Which category would you attack first to raise MFU?",
        "check": {
          "question": "Why do layer normalisation and softmax lower MFU?",
          "options": [
            "They are wrong",
            "They are limited by memory bandwidth, not arithmetic",
            "They run on the CPU"
          ],
          "answer": 1,
          "why": "They move a lot of data for little arithmetic."
        }
      },
      {
        "title": "Reporting performance honestly",
        "say": [
          "Performance claims should state the model size, sequence length, batch size, hardware, number of GPUs and precision.",
          "Tokens per second without those details cannot be compared.",
          "MFU is the fairest single number, because it adjusts for model size and hardware.",
          "Report steady-state numbers, and say how you handled warm-up steps and checkpoints.",
          "The example prints a complete performance summary line.",
          "Comparing runs with different sequence lengths needs care, because attention costs grow with length.",
          "Some papers report HFU rather than MFU, which looks higher; always check which is used.",
          "Honest reporting builds trust within a team and in public results.",
          "Benchmark suites such as MLPerf Training define exact rules for fair comparison.",
          "Tomorrow uses these measurements to classify bottlenecks.",
          "Writing down these details for every run also makes it easy to spot when something changed between two experiments."
        ],
        "example": "A car review that quotes fuel economy along with the speed, load and road type it was measured on.",
        "code": "report = {\"model\": \"7B\", \"seq_len\": 4096, \"global_batch_tokens\": 4_194_304, \"gpus\": 512,\n          \"hardware\": \"312 TFLOP/s bf16\", \"precision\": \"bf16\", \"tokens_per_s\": 1_100_000}\nmfu = 6 * 7e9 * report[\"tokens_per_s\"] / (report[\"gpus\"] * 312e12)\nprint(\", \".join(f\"{k}={v}\" for k, v in report.items()) + f\", MFU={mfu:.1%}\")",
        "output": "model=7B, seq_len=4096, global_batch_tokens=4194304, gpus=512, hardware=312 TFLOP/s bf16, precision=bf16, tokens_per_s=1100000, MFU=28.9%",
        "codeNotes": [
          {
            "line": 3,
            "note": "MFU from the reported numbers."
          }
        ],
        "tryIt": "Which missing detail would you add to make this report complete?",
        "check": {
          "question": "Which single number compares efficiency across hardware and model sizes most fairly?",
          "options": [
            "Tokens per second",
            "MFU",
            "Step time"
          ],
          "answer": 1,
          "why": "MFU normalises for model size and hardware."
        }
      },
      {
        "title": "Practice time: measuring speed",
        "say": [
          "Practice 1: mfu(tokens_per_second, params, gpus, peak_flops_per_gpu). Return 6 × params × tokens per second ÷ (gpus × peak) rounded to 3 decimals.",
          "The checks include a single GPU, a 512-GPU cluster and zero throughput.",
          "Practice 2: throughput_report(step_seconds, tokens_per_step). Return whole tokens per second, the median and slowest step rounded to 3 decimals, and the number of steps taking more than 1.5 times the median.",
          "The checks include a log with one slow step and a perfectly steady log.",
          "After passing, compute MFU from the report of a published training run and compare it with your own estimates.",
          "The example runs your functions on a simulated log.",
          "Tomorrow profiles individual steps to find out exactly why a run is slower than hoped.",
          "Measuring before optimising is the golden rule of performance work.",
          "Keep a record of MFU for each configuration you try.",
          "If MFU looks impossibly high, check the units of peak FLOPs and tokens per second.",
          "An MFU above 1.0 is always a sign of a mistake, often the wrong number of GPUs."
        ],
        "example": "A coach timing every lap, not just the whole race.",
        "code": "import statistics\n\nsteps = [2.0, 2.1, 1.9, 2.0, 4.5, 2.0, 2.05, 1.95]\ntokens = 2_097_152\ntps = tokens * len(steps) / sum(steps)\nmedian = statistics.median(steps)\nprint(f\"{tps:,.0f} tokens/s, median {median:.3f} s, slowest {max(steps):.3f} s, slow steps {sum(t > 1.5 * median for t in steps)}\")\nprint(f\"MFU on 512 GPUs for 7B: {6 * 7e9 * tps / (512 * 312e12):.3f}\")",
        "output": "906,877 tokens/s, median 2.000 s, slowest 4.500 s, slow steps 1\nMFU on 512 GPUs for 7B: 0.238",
        "codeNotes": [
          {
            "line": 5,
            "note": "Total tokens over total time."
          }
        ],
        "tryIt": "What would MFU be without the 4.5-second step?",
        "check": {
          "question": "What does throughput_report count as a slow step?",
          "options": [
            "Any step above the mean",
            "A step taking more than 1.5 × the median",
            "The slowest step only"
          ],
          "answer": 1,
          "why": "The rule compares with the median."
        }
      }
    ],
    "summary": [
      "Throughput = tokens processed per second; exclude warm-up steps.",
      "MFU = 6 × params × tokens/s ÷ (GPUs × peak FLOPs).",
      "Use the median and slowest step; count steps above 1.5 × median.",
      "Memory-bound ops, exposed communication and idle time lower MFU.",
      "Report performance with all the details needed to compare."
    ],
    "projectStep": {
      "title": "Training planner, part 23",
      "steps": [
        "Implement mfu and throughput_report.",
        "Analyse a simulated log and explain its slow steps.",
        "Record expected and measured MFU for your planned run."
      ]
    }
  },
  {
    "day": 24,
    "title": "Profiling and Finding Bottlenecks",
    "goal": "You can break a training step into phases, find the biggest phase and its share, classify a step as input-, communication- or compute-bound, and choose the matching fix.",
    "minutes": 30,
    "recap": "Yesterday measured how fast training runs. Today asks why it is not faster, by profiling a step and classifying its bottleneck.",
    "parts": [
      {
        "title": "Profiling a step",
        "say": [
          "A profiler records how long each part of a step takes: data loading, forward, backward, communication and optimizer.",
          "PyTorch Profiler and NVIDIA Nsight Systems produce timelines showing every GPU kernel and communication call.",
          "Summarising a profile into a few phases makes it easy to see where time goes.",
          "The largest phase is usually the best place to look for improvements.",
          "Practice 1 is top_phase(profile), which returns the largest phase and its share of the total.",
          "The example summarises a profile and prints each phase's share.",
          "The backward pass normally takes about twice as long as the forward pass, matching the 2:4 FLOPs split (Day 1).",
          "If the forward pass is not the smaller one, something unusual is happening, such as heavy recomputation.",
          "Profiling a handful of steps after warm-up gives representative results.",
          "Profile first, then optimise: guesses about bottlenecks are often wrong.",
          "Saving profiles alongside the code version makes it possible to compare before and after a change months later.",
          "Profiling adds a little overhead of its own, so it is usually switched on for a short window rather than for the whole run."
        ],
        "example": "Timing each stage of making breakfast to see whether the toast, the eggs or the coffee holds everything up.",
        "code": "profile = {\"data_load\": 30, \"forward\": 120, \"backward\": 240, \"allreduce\": 90, \"optimizer\": 20}\ntotal = sum(profile.values())\nfor phase, ms in sorted(profile.items(), key=lambda kv: -kv[1]):\n    print(f\"{phase:10} {ms:4} ms {ms / total:6.1%}\")",
        "output": "backward    240 ms  48.0%\nforward     120 ms  24.0%\nallreduce    90 ms  18.0%\ndata_load    30 ms   6.0%\noptimizer    20 ms   4.0%",
        "codeNotes": [
          {
            "line": 3,
            "note": "Largest phase first."
          }
        ],
        "tryIt": "Does the backward-to-forward ratio look normal here?",
        "check": {
          "question": "Why profile before optimising?",
          "options": [
            "It is required",
            "Guesses about bottlenecks are often wrong",
            "It speeds up training"
          ],
          "answer": 1,
          "why": "Measure first."
        }
      },
      {
        "title": "Three kinds of bottleneck",
        "say": [
          "An input-bound step spends a large share of its time waiting for data.",
          "A communication-bound step spends more time in exposed communication than in computation.",
          "A compute-bound step spends most of its time computing, which is where you want to be.",
          "Practice 2 is classify_step(data_wait_ms, compute_ms, comm_ms), which applies simple rules: input-bound if data wait exceeds 20 percent of the total, then communication-bound if communication exceeds compute, otherwise compute-bound.",
          "The example classifies four different step profiles.",
          "Thresholds such as 20 percent are rules of thumb; the important thing is to apply them consistently.",
          "A step can have several problems at once; fixing the largest first gives the biggest gain.",
          "After each fix, profile again, because the bottleneck often moves.",
          "Compute-bound does not mean perfect: memory-bound kernels inside compute can still be optimised.",
          "Classifying bottlenecks turns a vague \"training is slow\" into a clear next action.",
          "It also makes conversations between researchers and infrastructure engineers much more productive."
        ],
        "example": "A car that is slow because of traffic, because it is waiting for passengers, or because its engine is working flat out.",
        "code": "def classify(data, compute, comm):\n    total = data + compute + comm\n    if data > 0.2 * total:\n        return \"INPUT_BOUND\"\n    return \"COMM_BOUND\" if comm > compute else \"COMPUTE_BOUND\"\n\nfor profile in [(50, 100, 30), (10, 100, 150), (5, 200, 40), (20, 50, 30)]:\n    print(profile, \"->\", classify(*profile))",
        "output": "(50, 100, 30) -> INPUT_BOUND\n(10, 100, 150) -> COMM_BOUND\n(5, 200, 40) -> COMPUTE_BOUND\n(20, 50, 30) -> COMPUTE_BOUND",
        "codeNotes": [
          {
            "line": 3,
            "note": "Input share checked first."
          }
        ],
        "tryIt": "Why is (20, 50, 30) not input-bound, even though data wait is 20% of the step?",
        "check": {
          "question": "What should you do after fixing the biggest bottleneck?",
          "options": [
            "Stop",
            "Profile again, since the bottleneck may move",
            "Double the GPUs"
          ],
          "answer": 1,
          "why": "Bottlenecks shift after each fix."
        }
      },
      {
        "title": "Fixes for each bottleneck",
        "say": [
          "Input-bound: add data loader workers, prefetch, pre-tokenise and pack data, and cache it on local disks (Day 19).",
          "Communication-bound: overlap communication, increase the batch per GPU, use accumulation, BF16 gradients or hierarchical collectives (Days 20 and 21).",
          "Compute-bound: use mixed precision, fused kernels such as Flash Attention, torch.compile and larger matrix sizes.",
          "Practice 2 also asks for advice(kind), which returns the first fix to try for each kind.",
          "The example prints a fix table.",
          "Each fix should be measured on its own, so you know what helped.",
          "Keeping a changelog of optimisations and their measured effect is very useful for teams.",
          "Some fixes interact: a larger batch helps communication but needs more memory, which may need checkpointing.",
          "Stop optimising when the remaining gains are small compared with the effort, or when MFU is close to the best known for your setup.",
          "The capstone will ask you to justify your choices with these tables.",
          "Most of these fixes cost nothing but a configuration change, so they are worth trying before buying more hardware."
        ],
        "example": "A mechanic's diagnosis chart: each symptom points to a specific repair.",
        "code": "fixes = {\"INPUT_BOUND\": \"add data loader workers and prefetch\",\n         \"COMM_BOUND\": \"overlap communication or increase batch per GPU\",\n         \"COMPUTE_BOUND\": \"use mixed precision and fused kernels\"}\nfor kind, fix in fixes.items():\n    print(f\"{kind:14} -> {fix}\")",
        "output": "INPUT_BOUND    -> add data loader workers and prefetch\nCOMM_BOUND     -> overlap communication or increase batch per GPU\nCOMPUTE_BOUND  -> use mixed precision and fused kernels",
        "codeNotes": [
          {
            "line": 2,
            "note": "Hide communication or make each step do more work."
          }
        ],
        "tryIt": "Which fix would you try if a step is communication-bound and memory is already full?",
        "check": {
          "question": "What is a first fix for an input-bound step?",
          "options": [
            "Use more GPUs",
            "Add data loader workers and prefetch",
            "Lower the learning rate"
          ],
          "answer": 1,
          "why": "Speed up the data pipeline."
        }
      },
      {
        "title": "Stragglers and variation",
        "say": [
          "In synchronous training, the slowest GPU sets the pace of every step.",
          "A straggler may be caused by thermal throttling, a failing component, a slower network link or uneven data.",
          "Comparing per-rank step times reveals stragglers: most ranks are similar and one is slower.",
          "The example finds a straggler among eight ranks.",
          "Removing or replacing a straggler can speed up the whole job noticeably.",
          "Some clusters run regular performance tests to catch slow hardware before jobs use it.",
          "Variation between steps on the same rank can come from garbage collection, logging or checkpointing.",
          "Turning off unnecessary work inside the training loop reduces variation.",
          "Good dashboards show per-rank metrics, not just averages.",
          "Straggler detection is part of both performance work and fault tolerance.",
          "A GPU that becomes slower over days is often about to fail completely, so stragglers deserve attention quickly."
        ],
        "example": "A group walk that moves at the pace of its slowest walker.",
        "code": "import statistics\n\nrank_ms = [402, 398, 401, 399, 400, 455, 403, 397]\nmedian = statistics.median(rank_ms)\nfor r, ms in enumerate(rank_ms):\n    if ms > 1.1 * median:\n        print(f\"rank {r} is a straggler: {ms} ms vs median {median} ms\")\nprint(f\"step time is set by the slowest rank: {max(rank_ms)} ms\")",
        "output": "rank 5 is a straggler: 455 ms vs median 400.5 ms\nstep time is set by the slowest rank: 455 ms",
        "codeNotes": [
          {
            "line": 6,
            "note": "More than 10% slower than the median rank."
          }
        ],
        "tryIt": "How much faster would each step be without the straggler?",
        "check": {
          "question": "Why does one slow GPU slow down the whole job?",
          "options": [
            "It holds the data",
            "Collectives wait for every rank",
            "It runs the optimizer"
          ],
          "answer": 1,
          "why": "Synchronous steps wait for the slowest."
        }
      },
      {
        "title": "A profiling workflow",
        "say": [
          "Step 1: measure throughput and MFU for a baseline.",
          "Step 2: profile a few steps and summarise by phase.",
          "Step 3: classify the bottleneck and choose the matching fix.",
          "Step 4: apply one change, measure again and record the result.",
          "Step 5: repeat until the gains become small.",
          "The example runs this loop on a simulated system for three iterations.",
          "Each iteration moves the bottleneck, which is typical in practice.",
          "Stopping criteria might be an MFU target or a time budget for optimisation work.",
          "This disciplined loop avoids random tweaking, which wastes time and hides what really helped.",
          "The same workflow applies to inference servers and data pipelines.",
          "Writing each iteration down, with the measured step time before and after, builds a record the whole team can learn from."
        ],
        "example": "A doctor's cycle of test, diagnose, treat and re-test.",
        "code": "state = {\"data\": 60, \"compute\": 200, \"comm\": 150}\nfixes = {\"data\": (\"prefetch\", 0.2), \"comm\": (\"overlap\", 0.4), \"compute\": (\"fused kernels\", 0.8)}\nfor it in range(3):\n    total = sum(state.values())\n    kind = \"data\" if state[\"data\"] > 0.2 * total else (\"comm\" if state[\"comm\"] > state[\"compute\"] else \"compute\")\n    name, factor = fixes[kind]\n    state[kind] = round(state[kind] * factor)\n    print(f\"iteration {it + 1}: step {total} ms, bottleneck {kind}, apply {name} -> {state}\")",
        "output": "iteration 1: step 410 ms, bottleneck compute, apply fused kernels -> {'data': 60, 'compute': 160, 'comm': 150}\niteration 2: step 370 ms, bottleneck compute, apply fused kernels -> {'data': 60, 'compute': 128, 'comm': 150}\niteration 3: step 338 ms, bottleneck comm, apply overlap -> {'data': 60, 'compute': 128, 'comm': 60}",
        "codeNotes": [
          {
            "line": 5,
            "note": "Classify with the same rules as Practice 2."
          },
          {
            "line": 7,
            "note": "The fix shrinks that phase."
          }
        ],
        "tryIt": "Why does the bottleneck change after each fix?",
        "check": {
          "question": "Why change one thing at a time?",
          "options": [
            "It is faster",
            "So you know which change helped",
            "Frameworks require it"
          ],
          "answer": 1,
          "why": "Isolated changes give clear measurements."
        }
      },
      {
        "title": "Practice time: bottlenecks",
        "say": [
          "Practice 1: top_phase(profile). Return the largest phase (alphabetical on ties) and its share of the total rounded to 1 decimal, or (None, 0.0) for an empty profile.",
          "The checks include a five-phase profile, a tie and an empty profile.",
          "Practice 2: classify_step(data_wait_ms, compute_ms, comm_ms) and advice(kind). Apply the input, communication and compute rules in that order, and return the matching fix text.",
          "The checks include each kind of bottleneck, the exact 20 percent boundary and two advice strings.",
          "After passing, classify three profiles from your own imagined runs and write the fix you would try.",
          "The example classifies a short series of profiles.",
          "Tomorrow introduces mixture-of-experts models, which scale parameters without scaling compute per token.",
          "Profiling skills transfer to every performance problem in software.",
          "Keep the fix table: it summarises most of this course's performance lessons.",
          "If the boundary check fails, remember that exactly 20 percent is not more than 20 percent.",
          "Boundaries like this are exactly where real classification code tends to have bugs, which is why the checks test them."
        ],
        "example": "A triage nurse sorting patients quickly by what they need most.",
        "code": "def classify(data, compute, comm):\n    total = data + compute + comm\n    if data > 0.2 * total:\n        return \"INPUT_BOUND\"\n    return \"COMM_BOUND\" if comm > compute else \"COMPUTE_BOUND\"\n\nprofiles = {\"run A\": (80, 150, 60), \"run B\": (10, 120, 180), \"run C\": (15, 300, 90)}\nfor name, p in profiles.items():\n    print(f\"{name}: data {p[0]} ms, compute {p[1]} ms, comm {p[2]} ms -> {classify(*p)}\")",
        "output": "run A: data 80 ms, compute 150 ms, comm 60 ms -> INPUT_BOUND\nrun B: data 10 ms, compute 120 ms, comm 180 ms -> COMM_BOUND\nrun C: data 15 ms, compute 300 ms, comm 90 ms -> COMPUTE_BOUND",
        "codeNotes": [
          {
            "line": 3,
            "note": "Input-bound is checked first."
          }
        ],
        "tryIt": "Which run would benefit most from more data loader workers?",
        "check": {
          "question": "What does top_phase return for an empty profile?",
          "options": [
            "An error",
            "(None, 0.0)",
            "(\"\", 0)"
          ],
          "answer": 1,
          "why": "Empty profiles return (None, 0.0)."
        }
      }
    ],
    "summary": [
      "Profile steps into phases; the largest phase is the first target.",
      "Bottlenecks: input-bound, communication-bound or compute-bound.",
      "Each bottleneck has standard fixes; apply one at a time.",
      "Stragglers set the pace of synchronous training.",
      "Loop: measure, profile, classify, fix, re-measure."
    ],
    "projectStep": {
      "title": "Training planner, part 24",
      "steps": [
        "Implement top_phase, classify_step and advice.",
        "Run the profiling loop on a simulated system.",
        "Write a performance changelog for your planned run."
      ]
    }
  },
  {
    "day": 25,
    "title": "Mixture of Experts: Routing and Load Balancing",
    "goal": "You can explain mixture-of-experts models, route tokens to their top-k experts, apply expert capacity limits and measure load imbalance.",
    "minutes": 30,
    "recap": "So far every token has used every parameter. Mixture of experts breaks that link, letting models grow in parameters while each token uses only a small part of them.",
    "parts": [
      {
        "title": "Sparse models",
        "say": [
          "A mixture-of-experts (MoE) layer contains several expert networks, usually copies of the MLP block, and a small router.",
          "For each token, the router picks a few experts, often 1 or 2, and only those experts process the token.",
          "The model has the parameters of all experts, but each token uses only a fraction of them.",
          "So a model can have many more parameters for about the same compute per token.",
          "Models such as Switch Transformer, Mixtral 8x7B and DeepSeek-V3 use this design.",
          "The example compares total and active parameters for a dense and an MoE model.",
          "MoE models need more memory, since all experts must be stored, but less compute per token than a dense model of the same size.",
          "The training FLOPs rule uses active parameters instead of total parameters.",
          "Distributing experts across GPUs is called expert parallelism.",
          "MoE brings new challenges: routing, load balance and extra communication."
        ],
        "example": "A hospital with many specialists: each patient sees only the one or two specialists they need, not every doctor.",
        "code": "dense_params = 13e9\nexperts, expert_params, shared, k = 8, 5.6e9, 2.0e9, 2\ntotal = shared + experts * expert_params\nactive = shared + k * expert_params\nprint(f\"dense: {dense_params / 1e9:.0f}B total, {dense_params / 1e9:.0f}B active per token\")\nprint(f\"MoE:   {total / 1e9:.0f}B total, {active / 1e9:.1f}B active per token\")",
        "output": "dense: 13B total, 13B active per token\nMoE:   47B total, 13.2B active per token",
        "codeNotes": [
          {
            "line": 4,
            "note": "Only k experts run for each token."
          }
        ],
        "tryIt": "Which model needs more memory, and which needs more compute per token?",
        "check": {
          "question": "What makes MoE models efficient?",
          "options": [
            "They have fewer parameters",
            "Each token uses only a few experts",
            "They skip the backward pass"
          ],
          "answer": 1,
          "why": "Sparse activation keeps compute per token low."
        }
      },
      {
        "title": "Top-k routing",
        "say": [
          "The router is a small linear layer that produces a score for each expert for each token.",
          "Top-k routing sends each token to the k experts with the highest scores.",
          "The experts' outputs are combined, weighted by softmax of the chosen scores.",
          "Practice 1 is route(gate_scores, k), which returns each token's top-k expert indices, highest first, lower index on ties.",
          "The example routes three tokens with k = 1 and k = 2.",
          "Consistent tie-breaking makes routing deterministic, which matters for reproducibility and testing.",
          "Top-2 routing is common because it adds robustness at modest extra cost.",
          "Some newer designs use many small experts with larger k, plus shared experts that every token uses.",
          "The router is trained along with everything else, learning which experts suit which tokens.",
          "Experts often specialise in patterns such as punctuation, code or particular topics, though not always in human-readable ways."
        ],
        "example": "A receptionist who reads each patient's notes and books them with the two most suitable specialists.",
        "code": "scores = [[0.1, 0.7, 0.2, 0.0], [0.4, 0.1, 0.4, 0.1], [0.0, 0.0, 0.1, 0.9]]\nfor k in [1, 2]:\n    chosen = [sorted(range(4), key=lambda e: (-s[e], e))[:k] for s in scores]\n    print(f\"top-{k}: {chosen}\")",
        "output": "top-1: [[1], [0], [3]]\ntop-2: [[1, 2], [0, 2], [3, 2]]",
        "codeNotes": [
          {
            "line": 3,
            "note": "Highest score first, lower expert index on ties."
          }
        ],
        "tryIt": "Token 2 has a tie between experts 0 and 2. Which is chosen first, and why?",
        "check": {
          "question": "In top-2 routing, how many experts process each token?",
          "options": [
            "All of them",
            "Two",
            "One"
          ],
          "answer": 1,
          "why": "k = 2 experts per token."
        }
      },
      {
        "title": "Expert capacity",
        "say": [
          "If the router sends too many tokens to one expert, that expert becomes a bottleneck and may run out of memory.",
          "Each expert therefore has a capacity: the maximum number of tokens it accepts per batch.",
          "Capacity is often set to the average load times a capacity factor, such as 1.25.",
          "Tokens that arrive when their expert is full are dropped from that layer and pass through unchanged by the residual connection.",
          "Practice 2 is apply_capacity(assignments, experts, capacity), which accepts tokens in order, drops overflow and reports the imbalance.",
          "The example applies a capacity of 2 to a batch where expert 0 is popular.",
          "Dropping too many tokens hurts quality, so routers are trained to balance load.",
          "Some newer systems avoid dropping by using flexible, dropless implementations.",
          "Capacity also fixes the size of each expert's work, which makes GPU execution efficient.",
          "Monitoring the fraction of dropped tokens is a standard MoE health check."
        ],
        "example": "A popular restaurant with a limited number of tables: once it is full, late arrivals are turned away.",
        "code": "assignments = [0, 0, 1, 0, 2, 0, 1]\ncapacity, load, dropped = 2, [0, 0, 0, 0], []\nfor token, e in enumerate(assignments):\n    if load[e] < capacity:\n        load[e] += 1\n    else:\n        dropped.append(token)\nmean = sum(load) / len(load)\nprint(f\"load per expert {load}, dropped tokens {dropped}, imbalance {max(load) / mean:.2f}\")",
        "output": "load per expert [2, 2, 1, 0], dropped tokens [3, 5], imbalance 1.60",
        "codeNotes": [
          {
            "line": 4,
            "note": "Accept only while the expert has room."
          },
          {
            "line": 9,
            "note": "Max load over mean load."
          }
        ],
        "tryIt": "What capacity would avoid dropping any token here?",
        "check": {
          "question": "What happens to a token whose expert is full?",
          "options": [
            "It waits for the next batch",
            "It is dropped from that layer and passes through the residual path",
            "It goes to all experts"
          ],
          "answer": 1,
          "why": "Overflow tokens skip the expert."
        }
      },
      {
        "title": "Load balancing",
        "say": [
          "Without encouragement, routers tend to favour a few experts, leaving others unused.",
          "An auxiliary load-balancing loss adds a small penalty when tokens are spread unevenly.",
          "In the Switch Transformer, this loss multiplies, for each expert, the fraction of tokens it received by its average router probability, and sums them.",
          "The loss is smallest when both are uniform across experts.",
          "The example computes this balance loss for a balanced and an unbalanced router.",
          "Recent models such as DeepSeek-V3 use loss-free balancing, adjusting per-expert biases instead.",
          "Imbalance measured as max load divided by mean load is a simple number to track.",
          "A value of 1.0 is perfect balance; higher values mean some experts are overloaded.",
          "Balanced load also makes expert-parallel training faster, since no GPU waits for an overloaded expert.",
          "Balancing is a good example of adding a small extra objective to steer training.",
          "The weight of the balancing loss is kept small, so it guides routing without overwhelming the main language modelling objective."
        ],
        "example": "A teacher making sure every group in a class project gets a fair share of the work.",
        "code": "def balance_loss(fraction, prob):\n    n = len(fraction)\n    return n * sum(f * p for f, p in zip(fraction, prob))\n\nbalanced = ([0.25] * 4, [0.25] * 4)\nskewed = ([0.7, 0.1, 0.1, 0.1], [0.6, 0.15, 0.15, 0.1])\nprint(f\"balanced router: loss {balance_loss(*balanced):.3f}\")\nprint(f\"skewed router:   loss {balance_loss(*skewed):.3f}\")",
        "output": "balanced router: loss 1.000\nskewed router:   loss 1.840",
        "codeNotes": [
          {
            "line": 3,
            "note": "Scaled so perfect balance gives 1.0."
          }
        ],
        "tryIt": "What is the minimum possible value of this loss, and when does it occur?",
        "check": {
          "question": "What does the auxiliary load-balancing loss encourage?",
          "options": [
            "Using one expert",
            "Spreading tokens evenly across experts",
            "Dropping tokens"
          ],
          "answer": 1,
          "why": "It penalises uneven routing."
        }
      },
      {
        "title": "Expert parallelism",
        "say": [
          "In expert parallelism, different experts live on different GPUs.",
          "After routing, each token must be sent to the GPU holding its expert, and the result sent back.",
          "This uses an all-to-all collective: every GPU sends a different piece of data to every other GPU.",
          "All-to-all communication is heavy and sensitive to imbalance, since the busiest GPU sets the pace.",
          "The example counts how many tokens each GPU must send to each other GPU.",
          "Expert parallelism is combined with data, tensor and pipeline parallelism in large MoE training.",
          "Placing experts that are often used together on the same GPU reduces communication.",
          "Frameworks such as DeepSpeed-MoE, Megatron-Core and specialised libraries implement efficient all-to-all.",
          "MoE inference also needs expert parallelism, which affects serving costs.",
          "Understanding all-to-all completes our set of collectives from Day 5.",
          "Because all-to-all traffic is uneven, network topology matters even more for MoE than for dense models."
        ],
        "example": "A sorting office where every branch sends each parcel to the branch responsible for its destination, and receives parcels back.",
        "code": "gpus = 4\nexpert_gpu = {0: 0, 1: 1, 2: 2, 3: 3}\ntokens_on_gpu = {0: [1, 1, 3, 0], 1: [0, 2, 2, 1], 2: [3, 3, 0, 2], 3: [1, 0, 0, 0]}\nmatrix = [[0] * gpus for _ in range(gpus)]\nfor src, experts in tokens_on_gpu.items():\n    for e in experts:\n        matrix[src][expert_gpu[e]] += 1\nfor src, row in enumerate(matrix):\n    print(f\"GPU {src} sends {row}\")\nprint(\"tokens received per GPU:\", [sum(col) for col in zip(*matrix)])",
        "output": "GPU 0 sends [1, 2, 0, 1]\nGPU 1 sends [1, 1, 2, 0]\nGPU 2 sends [1, 0, 1, 2]\nGPU 3 sends [3, 1, 0, 0]\ntokens received per GPU: [6, 4, 3, 3]",
        "codeNotes": [
          {
            "line": 7,
            "note": "Count tokens sent from each GPU to each expert's GPU."
          }
        ],
        "tryIt": "Which GPU receives the most tokens, and what does that mean for step time?",
        "check": {
          "question": "Which collective does expert parallelism mainly use?",
          "options": [
            "All-reduce",
            "All-to-all",
            "Broadcast"
          ],
          "answer": 1,
          "why": "Each GPU sends different tokens to every other GPU."
        }
      },
      {
        "title": "Practice time: experts",
        "say": [
          "Practice 1: route(gate_scores, k). For each token, return the indices of its k highest-scoring experts, highest first, lower index on ties.",
          "The checks include top-1 and top-2 routing with a tie and an empty batch.",
          "Practice 2: apply_capacity(assignments, experts, capacity). Accept tokens in order until their expert is full, and return the load per expert, the dropped token indices and the imbalance (max ÷ mean, 2 decimals, 0.0 if nothing accepted).",
          "The checks include a popular expert with dropped tokens, perfect balance and an empty batch.",
          "After passing, route a batch with top-1, apply a capacity and report the dropped fraction.",
          "The example combines both functions.",
          "Tomorrow turns to fine-tuning: adapting huge models cheaply with LoRA.",
          "MoE is one of the main ways frontier models grow while keeping costs manageable.",
          "Its ideas, routing, capacity and balance, also appear in other systems such as load balancers.",
          "If the imbalance is wrong, check you divide the max by the mean load across all experts, including unused ones."
        ],
        "example": "A hospital manager checking that no specialist is overbooked while others sit idle.",
        "code": "scores = [[0.9, 0.1, 0.0], [0.8, 0.2, 0.0], [0.7, 0.1, 0.2], [0.1, 0.8, 0.1], [0.6, 0.3, 0.1]]\ntop1 = [max(range(3), key=lambda e: (s[e], -e)) for s in scores]\ncapacity, load, dropped = 2, [0, 0, 0], []\nfor t, e in enumerate(top1):\n    if load[e] < capacity:\n        load[e] += 1\n    else:\n        dropped.append(t)\nprint(f\"routed to {top1}, load {load}, dropped {dropped} ({len(dropped) / len(top1):.0%})\")",
        "output": "routed to [0, 0, 0, 1, 0], load [2, 1, 0], dropped [2, 4] (40%)",
        "codeNotes": [
          {
            "line": 2,
            "note": "Top-1 expert, lower index on ties."
          }
        ],
        "tryIt": "How would a load-balancing loss change these router scores over training?",
        "check": {
          "question": "What imbalance does apply_capacity report when every expert gets the same load?",
          "options": [
            "0.0",
            "1.0",
            "2.0"
          ],
          "answer": 1,
          "why": "Max equals mean for perfect balance."
        }
      }
    ],
    "summary": [
      "MoE layers route each token to a few of many experts.",
      "Top-k routing picks the highest router scores, with fixed tie-breaking.",
      "Expert capacity limits tokens per expert; overflow is dropped.",
      "Load-balancing losses or biases keep experts evenly used.",
      "Expert parallelism uses all-to-all communication."
    ],
    "projectStep": {
      "title": "Training planner, part 25",
      "steps": [
        "Implement route and apply_capacity.",
        "Simulate routing with and without a capacity limit.",
        "Estimate total and active parameters for an MoE design."
      ]
    }
  },
  {
    "day": 26,
    "title": "Parameter-Efficient Fine-Tuning: LoRA",
    "goal": "You can explain low-rank adaptation (LoRA), count its trainable parameters, compute a LoRA layer's output, and merge adapters into the base weights for inference.",
    "minutes": 30,
    "recap": "Most of this course has been about training huge models from scratch. Far more often, teams adapt an existing model to a new task; LoRA makes that affordable on modest hardware.",
    "parts": [
      {
        "title": "Why full fine-tuning is expensive",
        "say": [
          "Fine-tuning means continuing to train a pretrained model on new data, such as customer support conversations.",
          "Full fine-tuning updates every weight, so it needs gradients and optimizer states for every parameter, 16 bytes each (Day 8).",
          "For a 7B model, that is over 100 GB before activations, requiring several GPUs.",
          "Every fine-tuned version is also a full copy of the model, which is expensive to store and serve.",
          "Parameter-efficient fine-tuning (PEFT) trains only a small number of new parameters and freezes the rest.",
          "The example compares memory for full fine-tuning and for training only 0.5 percent of the parameters.",
          "Frozen weights need no gradients and no optimizer states, only their own storage.",
          "This makes fine-tuning possible on a single GPU for models that would otherwise need a cluster.",
          "LoRA, introduced by Hu and colleagues at Microsoft in 2021, is the most widely used PEFT method.",
          "Many organisations keep one base model and dozens of small LoRA adapters for different tasks."
        ],
        "example": "Adding a small, removable annotation layer to a printed textbook instead of reprinting the whole book for each class.",
        "code": "params = 7e9\nfull = 16 * params / 1e9\ntrainable = 0.005 * params\npeft = (2 * params + 16 * trainable) / 1e9\nprint(f\"full fine-tuning model states: {full:6.1f} GB\")\nprint(f\"PEFT (0.5% trainable):         {peft:6.1f} GB\")",
        "output": "full fine-tuning model states:  112.0 GB\nPEFT (0.5% trainable):           14.6 GB",
        "codeNotes": [
          {
            "line": 4,
            "note": "Frozen weights in 16-bit plus full training state for the small trainable part."
          }
        ],
        "tryIt": "Which single GPU could hold the PEFT setup, before activations?",
        "check": {
          "question": "Why does freezing weights save memory?",
          "options": [
            "Frozen weights are deleted",
            "Frozen weights need no gradients or optimizer states",
            "They are compressed"
          ],
          "answer": 1,
          "why": "Only trainable parameters need training state."
        }
      },
      {
        "title": "The low-rank idea",
        "say": [
          "LoRA assumes that the change a fine-tune makes to a weight matrix can be described with far fewer numbers than the matrix itself.",
          "Instead of learning a full d_in × d_out update, it learns two thin matrices: A of size d_in × r and B of size r × d_out.",
          "Their product A·B has the full shape, but only r × (d_in + d_out) numbers are trained.",
          "The rank r is small, often 8 to 64.",
          "Practice 1 is lora_params(layers, d_in, d_out, rank), which compares full and LoRA parameter counts.",
          "The example shows that rank 8 on 4096 × 4096 matrices trains under 0.4 percent of the parameters.",
          "If the rank is too high relative to the matrix size, LoRA saves nothing, which the checks also test.",
          "LoRA is usually applied to the attention projections and sometimes the MLP layers.",
          "Choosing which layers get adapters is a trade-off between quality and parameter count.",
          "Low-rank structure appears throughout mathematics and machine learning; LoRA is a practical use of it."
        ],
        "example": "Describing a change to a large painting with a few brush-stroke instructions rather than repainting every pixel.",
        "code": "layers, d_in, d_out = 32, 4096, 4096\nfull = layers * d_in * d_out\nfor r in [4, 8, 16, 64]:\n    lora = layers * r * (d_in + d_out)\n    print(f\"rank {r:2}: {lora:>10,} trainable vs {full:,} full ({lora / full:.3%})\")",
        "output": "rank  4:  1,048,576 trainable vs 536,870,912 full (0.195%)\nrank  8:  2,097,152 trainable vs 536,870,912 full (0.391%)\nrank 16:  4,194,304 trainable vs 536,870,912 full (0.781%)\nrank 64: 16,777,216 trainable vs 536,870,912 full (3.125%)",
        "codeNotes": [
          {
            "line": 4,
            "note": "Two thin matrices per layer."
          }
        ],
        "tryIt": "At what rank would LoRA train as many parameters as the full matrix?",
        "check": {
          "question": "How many parameters does a rank-r LoRA adapter train for a d_in × d_out matrix?",
          "options": [
            "d_in × d_out",
            "r × (d_in + d_out)",
            "r × r"
          ],
          "answer": 1,
          "why": "A has d_in × r and B has r × d_out."
        }
      },
      {
        "title": "The LoRA forward pass",
        "say": [
          "A LoRA layer computes y = x·W + (alpha / r) × (x·A)·B, where W is frozen and only A and B are trained.",
          "The scale alpha / r keeps the size of the update roughly independent of the chosen rank.",
          "B is initialised to zeros, so at the start of fine-tuning the model behaves exactly like the original.",
          "A is initialised with small random values, so gradients can flow and learning begins.",
          "Practice 2 is lora_forward(x, W, A, B, alpha, rank) plus merge(W, A, B, alpha, rank).",
          "The example computes a LoRA output on tiny matrices and checks that zero B leaves the output unchanged.",
          "Computing x·A first and then multiplying by B is much cheaper than forming A·B, because r is small.",
          "During training, the optimizer only holds states for A and B.",
          "Dropout on the LoRA path is often used as regularisation.",
          "Understanding the forward pass makes LoRA's settings (rank, alpha, target modules) meaningful."
        ],
        "example": "A main road plus a small side lane: most traffic follows the main road, and the side lane adds a small adjustment.",
        "code": "def mm(x, M):\n    return [sum(x[i] * M[i][j] for i in range(len(x))) for j in range(len(M[0]))]\n\nx = [1.0, 2.0]\nW = [[1.0, 0.0], [0.0, 1.0]]\nA = [[1.0], [0.0]]\nfor B in ([[0.0, 0.0]], [[0.5, -0.5]]):\n    base, low = mm(x, W), mm(mm(x, A), B)\n    y = [b + (2 / 1) * l for b, l in zip(base, low)]\n    print(f\"B={B}: y = {y}\")",
        "output": "B=[[0.0, 0.0]]: y = [1.0, 2.0]\nB=[[0.5, -0.5]]: y = [2.0, 1.0]",
        "codeNotes": [
          {
            "line": 8,
            "note": "Frozen path and low-rank path."
          },
          {
            "line": 9,
            "note": "Scale alpha / r = 2 / 1."
          }
        ],
        "tryIt": "Why is B initialised to zeros rather than random values?",
        "check": {
          "question": "Why is B initialised to zero in LoRA?",
          "options": [
            "To save memory",
            "So the fine-tuned model starts identical to the original",
            "It is never trained"
          ],
          "answer": 1,
          "why": "A zero product means no change at the start."
        }
      },
      {
        "title": "Merging adapters",
        "say": [
          "After training, the adapter can be merged into the base weight: W_merged = W + (alpha / r) × A·B.",
          "The merged layer produces exactly the same outputs as the LoRA layer, with no extra computation at inference.",
          "Keeping adapters separate instead lets one server switch between many tasks by swapping small adapters.",
          "The example merges an adapter and confirms the outputs match.",
          "Systems such as S-LoRA serve thousands of adapters on top of one base model.",
          "Merging is also how a LoRA fine-tune becomes a standalone model for distribution.",
          "Merged weights should be checked on a few test inputs, as the example does, to catch shape or scale mistakes.",
          "Adapters trained on different tasks can sometimes be combined, though results vary.",
          "LoRA adapters are tiny files, often tens of megabytes, which makes sharing them easy.",
          "Choosing between merging and serving separately is a deployment decision."
        ],
        "example": "Printing a new edition of the textbook with the annotations built in, once you are sure they are right.",
        "code": "def mm(x, M):\n    return [sum(x[i] * M[i][j] for i in range(len(x))) for j in range(len(M[0]))]\n\nW = [[1.0, 0.0], [0.0, 1.0]]\nA, B, s = [[1.0], [0.0]], [[0.5, -0.5]], 2.0\nmerged = [[W[i][j] + s * sum(A[i][k] * B[k][j] for k in range(1)) for j in range(2)] for i in range(2)]\nx = [1.0, 2.0]\nlora = [b + s * l for b, l in zip(mm(x, W), mm(mm(x, A), B))]\nprint(\"merged weight:\", merged)\nprint(\"merged output:\", mm(x, merged), \"| LoRA output:\", lora)",
        "output": "merged weight: [[2.0, -1.0], [0.0, 1.0]]\nmerged output: [2.0, 1.0] | LoRA output: [2.0, 1.0]",
        "codeNotes": [
          {
            "line": 6,
            "note": "W plus the scaled product A·B."
          }
        ],
        "tryIt": "What would merging cost if the rank were 64 and the matrices 4096 × 4096?",
        "check": {
          "question": "What does merging a LoRA adapter change about inference?",
          "options": [
            "The outputs",
            "Nothing about the outputs; it removes the extra adapter computation",
            "The model size doubles"
          ],
          "answer": 1,
          "why": "Same outputs, no extra work."
        }
      },
      {
        "title": "QLoRA and distributed fine-tuning",
        "say": [
          "QLoRA combines LoRA with a 4-bit quantised base model, so even the frozen weights take little memory (Day 27).",
          "With QLoRA, a 65B model could be fine-tuned on a single 48 GB GPU, as the original paper showed.",
          "For larger models or faster fine-tuning, LoRA is combined with FSDP or ZeRO to shard the frozen base weights.",
          "Because only adapters are trained, gradient communication is tiny compared with full fine-tuning.",
          "The example estimates memory for full fine-tuning, LoRA and QLoRA on a 70B model.",
          "The quality of LoRA and QLoRA fine-tunes is often close to full fine-tuning for many tasks, though not all.",
          "Evaluation on the target task is essential to decide whether a PEFT method is good enough.",
          "Hugging Face PEFT and similar libraries make these methods a few lines of configuration.",
          "Understanding the memory maths helps you choose hardware for a fine-tuning project.",
          "Tomorrow looks at quantisation itself: how weights are stored in fewer bits."
        ],
        "example": "Renting a small studio instead of a whole building, because you only need to change a few things.",
        "code": "params, trainable = 70e9, 0.004 * 70e9\nsetups = {\"full fine-tuning\": 16 * params,\n          \"LoRA (bf16 base)\": 2 * params + 16 * trainable,\n          \"QLoRA (4-bit base)\": 0.5 * params + 16 * trainable}\nfor name, b in setups.items():\n    print(f\"{name:20} {b / 1e9:7.1f} GB before activations\")",
        "output": "full fine-tuning      1120.0 GB before activations\nLoRA (bf16 base)       144.5 GB before activations\nQLoRA (4-bit base)      39.5 GB before activations",
        "codeNotes": [
          {
            "line": 4,
            "note": "Half a byte per frozen weight in 4-bit."
          }
        ],
        "tryIt": "How many 80 GB GPUs would each setup need at minimum?",
        "check": {
          "question": "What does QLoRA add to LoRA?",
          "options": [
            "More trainable parameters",
            "A 4-bit quantised frozen base model",
            "Pipeline parallelism"
          ],
          "answer": 1,
          "why": "Quantised base weights save more memory."
        }
      },
      {
        "title": "Practice time: LoRA",
        "say": [
          "Practice 1: lora_params(layers, d_in, d_out, rank). Return the full count, the LoRA count r × (d_in + d_out) per layer times layers, and the trainable percentage rounded to 3 decimals.",
          "The checks include 32 layers of 4096 × 4096 at rank 8, a rank so high that nothing is saved, and rectangular weights.",
          "Practice 2: lora_forward(x, W, A, B, alpha, rank) returns x·W + (alpha / rank)(x·A)·B rounded to 4 decimals, and merge(W, A, B, alpha, rank) returns W + (alpha / rank)·A·B.",
          "The checks include a known output, zero B leaving the output unchanged, the merged matrix and a check that merged weights give the same output.",
          "After passing, compute trainable parameters for LoRA on attention only versus attention plus MLP for a 7B model.",
          "The example makes that comparison.",
          "Tomorrow shrinks the frozen weights themselves with quantisation.",
          "LoRA is probably the technique from this course you will use most often in practice.",
          "Adapters make experimentation cheap: many can be trained and compared on one GPU.",
          "If merge fails, check that the inner sum runs over the rank dimension of A and B."
        ],
        "example": "A tailor comparing small alterations with a full remake before choosing.",
        "code": "layers, hidden, mlp, r = 32, 4096, 11008, 16\nattention = layers * 4 * r * (hidden + hidden)\nmlp_extra = layers * 3 * r * (hidden + mlp)\nprint(f\"attention only:      {attention:>12,} trainable\")\nprint(f\"attention + MLP:     {attention + mlp_extra:>12,} trainable\")\nprint(f\"share of 7B params:  {attention / 7e9:.3%} vs {(attention + mlp_extra) / 7e9:.3%}\")",
        "output": "attention only:        16,777,216 trainable\nattention + MLP:       39,976,960 trainable\nshare of 7B params:  0.240% vs 0.571%",
        "codeNotes": [
          {
            "line": 2,
            "note": "Four attention projections per layer."
          },
          {
            "line": 3,
            "note": "Three MLP projections per layer."
          }
        ],
        "tryIt": "Would you expect adding MLP adapters to improve quality? Why?",
        "check": {
          "question": "What does lora_forward return when B is all zeros?",
          "options": [
            "Zeros",
            "Exactly x·W",
            "x·A"
          ],
          "answer": 1,
          "why": "The low-rank path adds nothing."
        }
      }
    ],
    "summary": [
      "Full fine-tuning needs training state for every parameter.",
      "LoRA trains A (d_in × r) and B (r × d_out): r(d_in + d_out) parameters.",
      "y = x·W + (alpha/r)(x·A)·B; B starts at zero.",
      "Merging W + (alpha/r)·A·B gives identical outputs with no extra cost.",
      "QLoRA adds a 4-bit base model; LoRA combines with FSDP for big models."
    ],
    "projectStep": {
      "title": "Training planner, part 26",
      "steps": [
        "Implement lora_params, lora_forward and merge.",
        "Estimate memory for full, LoRA and QLoRA fine-tuning of your model.",
        "Choose target modules and a rank, with reasons."
      ]
    }
  },
  {
    "day": 27,
    "title": "Quantization: INT8 and 4-bit Weights",
    "goal": "You can quantise numbers to INT8 with a symmetric scale and dequantise them, compute model sizes at different bit widths, and measure the error that quantisation introduces.",
    "minutes": 30,
    "recap": "LoRA trained few parameters but still stored every frozen weight. Quantisation stores weights in fewer bits, cutting memory for fine-tuning and, above all, for serving.",
    "parts": [
      {
        "title": "What quantisation does",
        "say": [
          "Quantisation maps high-precision numbers, such as 16-bit floats, to a small set of integer levels.",
          "With INT8, each weight becomes one of 255 levels from −127 to 127, stored in a single byte.",
          "A scale factor, stored once per group of weights, maps the integers back to real values.",
          "Memory falls by half compared with 16-bit, and by three quarters at 4 bits.",
          "The example shows the model size of a 70B model at several bit widths.",
          "Smaller models also run faster, because moving weights from memory is often the bottleneck in inference.",
          "Quantisation introduces rounding error, which usually has a small effect on quality when done carefully.",
          "Post-training quantisation converts a trained model without retraining; quantisation-aware training simulates it during training.",
          "Methods such as GPTQ, AWQ and bitsandbytes are widely used for language models.",
          "Today we implement the simplest version to understand them all."
        ],
        "example": "Rounding prices to the nearest ten pence: the list gets shorter to write, and the totals are nearly the same.",
        "code": "params = 70e9\nfor bits in [32, 16, 8, 4]:\n    print(f\"{bits:2}-bit: {params * bits / 8 / 1e9:6.1f} GB\")",
        "output": "32-bit:  280.0 GB\n16-bit:  140.0 GB\n 8-bit:   70.0 GB\n 4-bit:   35.0 GB",
        "codeNotes": [
          {
            "line": 3,
            "note": "Bits divided by 8 gives bytes per weight."
          }
        ],
        "tryIt": "Which bit width lets a 70B model fit on two 80 GB GPUs for inference?",
        "check": {
          "question": "How many bytes does an INT8 weight take?",
          "options": [
            "2",
            "1",
            "0.5"
          ],
          "answer": 1,
          "why": "Eight bits is one byte."
        }
      },
      {
        "title": "Symmetric INT8 quantisation",
        "say": [
          "Symmetric quantisation uses one scale: scale = the largest absolute value ÷ 127.",
          "Each value is quantised as q = round(v ÷ scale), clamped to the range −127 to 127.",
          "Dequantising multiplies back: v ≈ q × scale.",
          "The largest value maps exactly to ±127, so the full integer range is used.",
          "Practice 1 is quantize(values) and dequantize(q, scale), handling the all-zero case with a scale of 1.0.",
          "The example quantises four values and recovers them.",
          "Values that are exact multiples of the scale come back perfectly; others are off by at most half a step.",
          "Asymmetric quantisation adds a zero point to handle ranges that are not centred on zero, useful for activations.",
          "Per-channel or per-group scales, with a scale for every 64 or 128 weights, reduce error compared with one scale per tensor.",
          "This simple scheme is the foundation of most practical quantisation methods."
        ],
        "example": "Measuring with a ruler whose marks are spaced so that the longest item exactly reaches the last mark.",
        "code": "values = [0.5, -1.27, 0.0, 1.0, 0.333]\nscale = max(abs(v) for v in values) / 127\nq = [max(-127, min(127, round(v / scale))) for v in values]\nback = [round(qi * scale, 4) for qi in q]\nprint(f\"scale {scale:.6f}\")\nprint(\"quantised:  \", q)\nprint(\"dequantised:\", back)",
        "output": "scale 0.010000\nquantised:   [50, -127, 0, 100, 33]\ndequantised: [0.5, -1.27, 0.0, 1.0, 0.33]",
        "codeNotes": [
          {
            "line": 2,
            "note": "The largest magnitude maps to 127."
          },
          {
            "line": 3,
            "note": "Round and clamp to the INT8 range."
          }
        ],
        "tryIt": "Why does 0.333 not come back exactly?",
        "check": {
          "question": "How is the symmetric INT8 scale chosen?",
          "options": [
            "Always 1.0",
            "Largest absolute value divided by 127",
            "The average value"
          ],
          "answer": 1,
          "why": "So the biggest value maps to ±127."
        }
      },
      {
        "title": "Measuring quantisation error",
        "say": [
          "The round-trip error is the difference between a value and its quantised-then-dequantised version.",
          "For symmetric INT8, the error is at most half a step: scale ÷ 2.",
          "Practice 2 includes max_error(values), which measures the largest round-trip error, and model_size_gb(params, bits).",
          "One large outlier makes the scale big and the steps coarse, increasing error for all the other values.",
          "The example shows how a single outlier increases the error of every other value.",
          "Language models are known to have a few outlier features with very large values, which is why simple quantisation can hurt them.",
          "Methods such as LLM.int8() keep outlier features in 16-bit, and SmoothQuant moves difficulty from activations to weights.",
          "Per-group scales also limit the damage an outlier can do to a small group.",
          "Measuring error on real weights is the first step in evaluating a quantisation method.",
          "The final test is always model quality on real tasks, not just numerical error."
        ],
        "example": "One very tall person in a group photo forces the camera to zoom out, making everyone else smaller and less clear.",
        "code": "def max_err(values):\n    scale = max(abs(v) for v in values) / 127\n    return max(abs(v - round(v / scale) * scale) for v in values)\n\nnormal = [0.12, -0.05, 0.31, -0.22, 0.08]\nwith_outlier = normal + [12.0]\nprint(f\"without outlier: max error {max_err(normal):.5f}\")\nprint(f\"with outlier:    max error {max_err(with_outlier):.5f}\")",
        "output": "without outlier: max error 0.00118\nwith outlier:    max error 0.04449",
        "codeNotes": [
          {
            "line": 3,
            "note": "Largest round-trip error."
          }
        ],
        "tryIt": "How would per-group scales, putting the outlier in its own group, help?",
        "check": {
          "question": "What is the maximum error of symmetric INT8 quantisation?",
          "options": [
            "Zero",
            "About half a step (scale ÷ 2)",
            "The scale times 127"
          ],
          "answer": 1,
          "why": "Rounding is off by at most half a step."
        }
      },
      {
        "title": "4-bit quantisation",
        "say": [
          "4-bit quantisation stores each weight in half a byte, with only 16 levels.",
          "With so few levels, per-group scales are essential, typically one scale for every 64 or 128 weights.",
          "QLoRA introduced the NF4 format, whose levels are spaced to match the bell-shaped distribution of neural network weights.",
          "The storage for scales adds a little overhead, which double quantisation reduces by quantising the scales too.",
          "The example quantises a group of weights to 4 bits and measures the error compared with 8 bits.",
          "Error is larger at 4 bits, but good methods keep model quality surprisingly close to 16-bit for many tasks.",
          "Some very aggressive methods go to 3 or even 2 bits, with more noticeable quality loss.",
          "4-bit models are what make running 70B-class models on consumer hardware possible.",
          "Quantisation is now a standard step in deploying language models.",
          "Evaluate each quantised model on the tasks that matter to you before deploying it."
        ],
        "example": "Describing colours with only 16 crayons instead of 256: still recognisable, with some detail lost.",
        "code": "def roundtrip(values, bits):\n    levels = 2 ** (bits - 1) - 1\n    scale = max(abs(v) for v in values) / levels\n    return [round(v / scale) * scale for v in values]\n\ngroup = [0.12, -0.05, 0.31, -0.22, 0.08, 0.27, -0.3, 0.01]\nfor bits in [8, 4]:\n    back = roundtrip(group, bits)\n    err = max(abs(a - b) for a, b in zip(group, back))\n    print(f\"{bits}-bit: max error {err:.4f}\")",
        "output": "8-bit: max error 0.0012\n4-bit: max error 0.0129",
        "codeNotes": [
          {
            "line": 2,
            "note": "127 levels for 8 bits, 7 for 4 bits (symmetric)."
          }
        ],
        "tryIt": "Roughly how many times larger is the 4-bit error, and why?",
        "check": {
          "question": "Why are per-group scales essential at 4 bits?",
          "options": [
            "They are faster",
            "With only 16 levels, one scale per tensor would give very large errors",
            "They remove outliers"
          ],
          "answer": 1,
          "why": "Smaller groups fit their range more tightly."
        }
      },
      {
        "title": "Quantisation in training and serving",
        "say": [
          "Training in low precision beyond BF16 is harder: FP8 training is used on the newest hardware with careful scaling.",
          "Quantised base weights with LoRA adapters (QLoRA) are the main way quantisation meets training.",
          "For serving, weight-only quantisation to 8 or 4 bits speeds up generation because loading weights from memory dominates.",
          "Quantising activations and the key-value cache as well saves more memory for long contexts.",
          "The example estimates how many 4-bit 70B models fit on one server compared with 16-bit.",
          "Serving systems such as vLLM and TensorRT-LLM support many quantisation formats.",
          "The cost savings in serving can be very large, because inference runs continuously.",
          "Quality checks must use real prompts, including edge cases, before switching production traffic.",
          "Quantisation connects training decisions (Day 22) with deployment costs.",
          "Tomorrow looks at another way to make models cheaper to run: distillation into a smaller model."
        ],
        "example": "Packing a suitcase with vacuum bags: the same clothes take far less space, and a little care is needed when unpacking.",
        "code": "server_gb, params = 8 * 80, 70e9\nfor bits in [16, 8, 4]:\n    per_model = params * bits / 8 / 1e9 * 1.2\n    print(f\"{bits:2}-bit: {per_model:6.1f} GB per copy (with 20% for cache) -> {int(server_gb // per_model)} copies per 8-GPU server\")",
        "output": "16-bit:  168.0 GB per copy (with 20% for cache) -> 3 copies per 8-GPU server\n 8-bit:   84.0 GB per copy (with 20% for cache) -> 7 copies per 8-GPU server\n 4-bit:   42.0 GB per copy (with 20% for cache) -> 15 copies per 8-GPU server",
        "codeNotes": [
          {
            "line": 3,
            "note": "Add 20% for the key-value cache and buffers."
          }
        ],
        "tryIt": "How does serving cost per request change if you can fit four times as many copies?",
        "check": {
          "question": "Why does weight-only quantisation speed up generation?",
          "options": [
            "It skips layers",
            "Loading weights from memory dominates, and smaller weights load faster",
            "It uses fewer tokens"
          ],
          "answer": 1,
          "why": "Generation is often memory-bandwidth bound."
        }
      },
      {
        "title": "Practice time: quantisation",
        "say": [
          "Practice 1: quantize(values) returns the INT8 values and the scale (max |v| ÷ 127, rounded to 6 decimals, 1.0 for all zeros); dequantize(q, scale) returns q × scale rounded to 4 decimals.",
          "The checks include a round trip, the all-zero case and a case where values do not land exactly on a level.",
          "Practice 2: model_size_gb(params, bits) returns params × bits ÷ 8 ÷ 1e9 rounded to 1 decimal, and max_error(values) returns the largest round-trip error rounded to 4 decimals.",
          "The checks include 70B at 16 and 4 bits, 7B at 8 bits and two error measurements.",
          "After passing, quantise groups of random weights with and without an outlier and compare the errors.",
          "The example does that with a fixed random seed.",
          "Tomorrow teaches a small model to imitate a large one through distillation.",
          "Quantisation is one of the most practical skills for deploying models affordably.",
          "Always pair error measurements with task quality measurements.",
          "If quantize gives the wrong integers, check that you use the unrounded scale when dividing."
        ],
        "example": "A photographer comparing compressed images at different quality settings before choosing one.",
        "code": "import random\n\nrng = random.Random(3)\nweights = [rng.gauss(0, 0.02) for _ in range(128)]\ndef max_err(vals):\n    s = max(abs(v) for v in vals) / 127\n    return max(abs(v - round(v / s) * s) for v in vals)\nprint(f\"normal group:       max error {max_err(weights):.6f}\")\nprint(f\"with one outlier:   max error {max_err(weights + [0.8]):.6f}\")",
        "output": "normal group:       max error 0.000283\nwith one outlier:   max error 0.003148",
        "codeNotes": [
          {
            "line": 4,
            "note": "Typical small weights with a fixed seed."
          }
        ],
        "tryIt": "How many times larger is the error with the outlier?",
        "check": {
          "question": "What scale does quantize return for [0.0, 0.0]?",
          "options": [
            "0.0",
            "1.0",
            "An error"
          ],
          "answer": 1,
          "why": "Avoid dividing by zero with a scale of 1.0."
        }
      }
    ],
    "summary": [
      "Quantisation stores weights as integers plus a scale.",
      "Symmetric INT8: scale = max|v|/127, q = round(v/scale), clamped.",
      "Round-trip error is at most half a step; outliers enlarge it.",
      "4-bit needs per-group scales; NF4 suits weight distributions.",
      "Quantisation cuts memory for QLoRA and speeds up serving."
    ],
    "projectStep": {
      "title": "Training planner, part 27",
      "steps": [
        "Implement quantize, dequantize, model_size_gb and max_error.",
        "Measure error with and without outliers.",
        "Estimate serving memory for your model at 16, 8 and 4 bits."
      ]
    }
  },
  {
    "day": 28,
    "title": "Knowledge Distillation: Teaching Small Models",
    "goal": "You can compute softmax with temperature, calculate the distillation loss between teacher and student distributions, and explain when distillation is the right way to build a small model.",
    "minutes": 30,
    "recap": "Quantisation made a model smaller by storing it in fewer bits. Distillation makes a genuinely smaller model by teaching it to imitate a larger one.",
    "parts": [
      {
        "title": "Teachers and students",
        "say": [
          "Knowledge distillation trains a small student model to reproduce the outputs of a large teacher model.",
          "Hinton, Vinyals and Dean popularised the method in 2015.",
          "The teacher's output probabilities contain more information than a single correct answer: they show which wrong answers are nearly right.",
          "For example, a teacher might give \"cat\" 80 percent and \"kitten\" 15 percent, telling the student that these are related.",
          "This richer signal helps the student learn faster and generalise better than training on labels alone.",
          "The example compares a one-hot label with a teacher's soft distribution.",
          "Distillation is widely used to produce small, fast models, such as DistilBERT and many small language models.",
          "It connects directly to deployment costs: a small student can serve millions of requests cheaply.",
          "The teacher only needs to run once over the training data, and its outputs can be stored.",
          "Distilling in a distributed setting means running the teacher at scale, which uses everything this course has covered."
        ],
        "example": "An apprentice who learns not only the right answer but how the master weighs the alternatives.",
        "code": "words = [\"cat\", \"kitten\", \"dog\", \"car\"]\nlabel = [1.0, 0.0, 0.0, 0.0]\nteacher = [0.80, 0.15, 0.04, 0.01]\nfor w, l, t in zip(words, label, teacher):\n    print(f\"{w:7} label {l:.2f}   teacher {t:.2f}\")",
        "output": "cat     label 1.00   teacher 0.80\nkitten  label 0.00   teacher 0.15\ndog     label 0.00   teacher 0.04\ncar     label 0.00   teacher 0.01",
        "codeNotes": [
          {
            "line": 3,
            "note": "Soft probabilities carry extra information."
          }
        ],
        "tryIt": "What does the teacher's 0.15 for \"kitten\" tell the student that the label does not?",
        "check": {
          "question": "Why do teacher probabilities help more than labels alone?",
          "options": [
            "They are faster to compute",
            "They show which wrong answers are nearly right",
            "They remove noise"
          ],
          "answer": 1,
          "why": "Soft targets carry relationships between classes."
        }
      },
      {
        "title": "Softmax with temperature",
        "say": [
          "Models produce raw scores called logits, which softmax turns into probabilities.",
          "Dividing logits by a temperature T before softmax controls how peaked the distribution is.",
          "T above 1 softens the distribution, revealing more about the smaller probabilities; T below 1 sharpens it.",
          "Practice 1 is softmax_t(logits, temperature), which subtracts the largest scaled logit before exponentiating for numerical stability.",
          "Without that subtraction, large logits such as 1000 would overflow math.exp.",
          "The example prints the same logits at temperatures 1, 2 and 4.",
          "Distillation typically uses temperatures from 2 to 5 so the student sees the teacher's finer preferences.",
          "Temperature also controls randomness in text generation, the same idea used at inference time.",
          "Temperatures of zero or below are invalid, because the division is undefined or flips the ranking.",
          "Rounding probabilities to 4 decimals keeps printed values readable."
        ],
        "example": "Adjusting the contrast on a photo: turning it down reveals detail in the shadows.",
        "code": "import math\n\ndef softmax_t(logits, t):\n    z = [l / t for l in logits]\n    m = max(z)\n    e = [math.exp(v - m) for v in z]\n    return [round(v / sum(e), 4) for v in e]\n\nfor t in [1, 2, 4]:\n    print(f\"T={t}: {softmax_t([3.0, 1.0, 0.0], t)}\")\nprint(\"large logits:\", softmax_t([1000.0, 999.0], 1))",
        "output": "T=1: [0.8438, 0.1142, 0.042]\nT=2: [0.6285, 0.2312, 0.1402]\nT=4: [0.481, 0.2918, 0.2272]\nlarge logits: [0.7311, 0.2689]",
        "codeNotes": [
          {
            "line": 5,
            "note": "Subtract the maximum for numerical stability."
          }
        ],
        "tryIt": "What happens to the distribution as T becomes very large?",
        "check": {
          "question": "What does a temperature above 1 do?",
          "options": [
            "Sharpens the distribution",
            "Softens the distribution",
            "Nothing"
          ],
          "answer": 1,
          "why": "Higher T flattens the probabilities."
        }
      },
      {
        "title": "The distillation loss",
        "say": [
          "The distillation loss measures how different the student's softened distribution is from the teacher's.",
          "It uses the Kullback-Leibler (KL) divergence: KL(p ‖ q) = Σ p·log(p ÷ q), where p is the teacher and q the student.",
          "KL is zero when the distributions are identical and grows as they differ.",
          "The loss is multiplied by T², which keeps gradient sizes comparable when the temperature changes.",
          "Practice 2 is distill_loss(student_logits, teacher_logits, temperature).",
          "The example computes the loss for a student that matches the teacher and for one that knows nothing.",
          "In practice, the total loss usually mixes the distillation loss with the ordinary loss on true labels.",
          "Terms where the teacher probability is zero contribute nothing, which the implementation handles by skipping them.",
          "For language models, the loss is computed over the vocabulary at every token position.",
          "Storing only the teacher's top-k probabilities per token saves storage with little loss of information."
        ],
        "example": "Scoring how closely a student's estimates match an expert's, weighting the answers the expert considers most likely.",
        "code": "import math\n\ndef soft(logits, t):\n    z = [l / t for l in logits]\n    m = max(z)\n    e = [math.exp(v - m) for v in z]\n    return [v / sum(e) for v in e]\n\ndef kd_loss(student, teacher, t):\n    p, q = soft(teacher, t), soft(student, t)\n    return t * t * sum(a * math.log(a / b) for a, b in zip(p, q) if a > 0)\n\nteacher = [3.0, 1.0, 0.0]\nfor name, student in [(\"copy of teacher\", [3.0, 1.0, 0.0]), (\"half-learned\", [1.5, 0.5, 0.0]), (\"clueless\", [0.0, 0.0, 0.0])]:\n    print(f\"{name:16} loss {kd_loss(student, teacher, 2.0):.4f}\")",
        "output": "copy of teacher  loss 0.0000\nhalf-learned     loss 0.1867\nclueless         loss 0.7706",
        "codeNotes": [
          {
            "line": 11,
            "note": "T squared times KL(teacher ‖ student)."
          }
        ],
        "tryIt": "Why is the loss for the half-learned student between the other two?",
        "check": {
          "question": "What is the distillation loss when the student matches the teacher exactly?",
          "options": [
            "1",
            "0",
            "T squared"
          ],
          "answer": 1,
          "why": "KL divergence of identical distributions is zero."
        }
      },
      {
        "title": "Distillation in practice",
        "say": [
          "A common recipe: run the teacher over the training set, save its top probabilities, then train the student on a mix of distillation and label losses.",
          "Students are often a half to a tenth the size of the teacher.",
          "A good student can keep most of the teacher's quality at a fraction of the cost.",
          "The example compares serving cost for a teacher and a student over a month of traffic.",
          "Distillation can also transfer abilities from a large general model to a small specialised one.",
          "Sequence-level distillation trains the student on text the teacher generates, which is how many small chat models are built.",
          "Licences and terms of use of the teacher model must allow distillation; some commercial models forbid it.",
          "Evaluation must compare student and teacher on the same benchmarks to measure what was lost.",
          "Distillation, quantisation and pruning can be combined for the smallest, fastest models.",
          "These techniques connect training choices to the cost of every future request."
        ],
        "example": "A senior chef training a junior to cook the signature dishes, so the restaurant can open a second, smaller branch.",
        "code": "requests_per_month = 50_000_000\ncost_per_1k = {\"teacher 70B\": 0.60, \"student 8B\": 0.07}\nfor name, c in cost_per_1k.items():\n    print(f\"{name:12} ${requests_per_month / 1000 * c:10,.0f} per month\")",
        "output": "teacher 70B  $    30,000 per month\nstudent 8B   $     3,500 per month",
        "codeNotes": [
          {
            "line": 2,
            "note": "Illustrative serving cost per thousand requests."
          }
        ],
        "tryIt": "If distilling the student costs $20,000, how long until it pays for itself?",
        "check": {
          "question": "What must you check before distilling from a commercial model?",
          "options": [
            "Its colour",
            "That its licence and terms allow distillation",
            "Its file name"
          ],
          "answer": 1,
          "why": "Some terms forbid using outputs to train other models."
        }
      },
      {
        "title": "Choosing a small-model strategy",
        "say": [
          "There are several ways to get a small, cheap model: train a small model from scratch, quantise a large one, distil a large one, or fine-tune a small one with LoRA.",
          "Training from scratch needs lots of data and compute, but gives full control.",
          "Quantisation is fastest but keeps the large model's architecture and speed limits.",
          "Distillation needs a teacher and compute for the student, but can give the best small model.",
          "LoRA fine-tuning of an existing small model is cheapest when a good small base model exists.",
          "The example scores the options against three criteria.",
          "The right choice depends on budget, quality needs, latency targets and licences.",
          "Many production systems combine approaches, for example a distilled student that is then quantised.",
          "Documenting the choice and the reasons helps future teams revisit it.",
          "Tomorrow turns to the cluster itself: placing jobs on GPUs and estimating the full cost of a run."
        ],
        "example": "Choosing between building a new house, renovating, or moving into a smaller one that already suits you.",
        "code": "options = {\"train small from scratch\": (1, 3, 3), \"quantise large model\": (3, 2, 2),\n           \"distil into student\": (2, 3, 3), \"LoRA on small base\": (3, 2, 3)}\nprint(f\"{'option':26} cheap  quality  speed  total\")\nfor name, (cheap, quality, speed) in options.items():\n    print(f\"{name:26} {cheap:5} {quality:8} {speed:6} {cheap + quality + speed:6}\")",
        "output": "option                     cheap  quality  speed  total\ntrain small from scratch       1        3      3      7\nquantise large model           3        2      2      7\ndistil into student            2        3      3      8\nLoRA on small base             3        2      3      8",
        "codeNotes": [
          {
            "line": 1,
            "note": "Scores from 1 (weak) to 3 (strong)."
          }
        ],
        "tryIt": "How would the scores change if you had no suitable small base model?",
        "check": {
          "question": "When is LoRA fine-tuning of a small model the cheapest option?",
          "options": [
            "Always",
            "When a good small base model already exists",
            "Never"
          ],
          "answer": 1,
          "why": "It builds on existing work."
        }
      },
      {
        "title": "Practice time: distillation",
        "say": [
          "Practice 1: softmax_t(logits, temperature=1.0). Divide by the temperature, subtract the maximum, exponentiate, normalise and round to 4 decimals; raise ValueError for a temperature of 0 or below.",
          "The checks include temperatures 1 and 4, very large logits and an invalid temperature.",
          "Practice 2: distill_loss(student_logits, teacher_logits, temperature). Compute unrounded softmax for both at the temperature, then T² × Σ p·log(p ÷ q), rounded to 4 decimals.",
          "The checks include identical logits (zero loss) and a uniform student at temperatures 1 and 2.",
          "After passing, train a tiny student's logits by gradient steps to reduce the loss, and watch it approach the teacher.",
          "The example does that with a simple update rule.",
          "Tomorrow covers scheduling jobs on a cluster and the total cost of training.",
          "Distillation is a bridge between the large models this course trains and the small models most products deploy.",
          "Temperature is a small setting with a big effect; try several values in experiments.",
          "If your loss is negative, check the order: the teacher is p and the student is q."
        ],
        "example": "A student practising past papers with the teacher's marking notes until their answers match.",
        "code": "import math\n\ndef soft(l):\n    m = max(l)\n    e = [math.exp(v - m) for v in l]\n    return [v / sum(e) for v in e]\n\nteacher = soft([3.0, 1.0, 0.0])\nstudent = [0.0, 0.0, 0.0]\nfor step in range(1, 201):\n    q = soft(student)\n    student = [s - 0.5 * (qi - pi) for s, qi, pi in zip(student, q, teacher)]\n    if step in (1, 50, 200):\n        kl = sum(p * math.log(p / b) for p, b in zip(teacher, soft(student)))\n        print(f\"step {step:3}: KL {kl:.5f}\")",
        "output": "step   1: KL 0.39461\nstep  50: KL 0.00082\nstep 200: KL 0.00000",
        "codeNotes": [
          {
            "line": 12,
            "note": "The gradient of KL with respect to the student logits is q - p."
          }
        ],
        "tryIt": "What happens with a larger step size, such as 5.0?",
        "check": {
          "question": "What should softmax_t do with temperature 0?",
          "options": [
            "Return one-hot",
            "Raise ValueError",
            "Return uniform"
          ],
          "answer": 1,
          "why": "Temperature must be positive."
        }
      }
    ],
    "summary": [
      "Distillation trains a small student to imitate a large teacher.",
      "Softmax with temperature: softmax(logits/T); higher T is softer.",
      "Loss = T² × KL(teacher ‖ student), zero when they match.",
      "Distilled students cut serving costs; check licences.",
      "Choose between scratch, quantise, distil and LoRA by budget and needs."
    ],
    "projectStep": {
      "title": "Training planner, part 28",
      "steps": [
        "Implement softmax_t and distill_loss.",
        "Simulate a student learning from a teacher.",
        "Choose a small-model strategy for your product, with reasons."
      ]
    }
  },
  {
    "day": 29,
    "title": "Cluster Scheduling and Training Cost",
    "goal": "You can place training jobs on GPU nodes to minimise fragmentation, estimate the full cost of a run including spot pricing and failure overhead, and explain how shared clusters are scheduled.",
    "minutes": 30,
    "recap": "We have planned what to train and how to train it efficiently. Today we look at the cluster that runs it: how jobs get GPUs and what the whole run really costs.",
    "parts": [
      {
        "title": "Clusters and schedulers",
        "say": [
          "A GPU cluster is a set of nodes, each with several GPUs, typically 8, connected by a fast network.",
          "Many teams share the cluster, so a scheduler decides which job runs where and when.",
          "Common schedulers include Slurm on research clusters and Kubernetes with batch extensions such as Kueue or Volcano.",
          "Jobs request resources, such as 64 GPUs for 3 days, and wait in a queue until they fit.",
          "The example shows free GPUs across a small cluster and which requests could start now.",
          "Distributed training jobs need all their GPUs at once, called gang scheduling; half a job cannot start.",
          "Priorities, quotas and fair-share rules decide whose job goes first.",
          "Preemption lets urgent jobs take GPUs from lower-priority ones, which must checkpoint (Day 18).",
          "Good scheduling keeps expensive GPUs busy, a key cost metric for any organisation.",
          "Understanding the scheduler helps you write job requests that start sooner.",
          "For example, asking for exactly the GPUs and time you need, rather than generous round numbers, often moves a job up the queue."
        ],
        "example": "A restaurant host seating groups: a party of eight needs a big enough table free all at once.",
        "code": "free = [8, 4, 6, 0, 2]\nrequests = [(\"fine-tune\", 4), (\"eval\", 2), (\"pretrain\", 16), (\"experiment\", 8)]\nprint(\"free GPUs per node:\", free, \"total\", sum(free))\nfor name, gpus in requests:\n    print(f\"{name:10} needs {gpus:2}: {'could start' if gpus <= sum(free) else 'must wait'}\")",
        "output": "free GPUs per node: [8, 4, 6, 0, 2] total 20\nfine-tune  needs  4: could start\neval       needs  2: could start\npretrain   needs 16: could start\nexperiment needs  8: could start",
        "codeNotes": [
          {
            "line": 5,
            "note": "Enough free GPUs in total; placement decides the rest."
          }
        ],
        "tryIt": "Which requests could run on a single node?",
        "check": {
          "question": "What is gang scheduling?",
          "options": [
            "Scheduling by team",
            "Starting all of a job's GPUs together or not at all",
            "Running jobs one after another"
          ],
          "answer": 1,
          "why": "Distributed jobs need all their workers at once."
        }
      },
      {
        "title": "Placing jobs well",
        "say": [
          "Where a job runs matters: GPUs in the same node communicate much faster than GPUs across nodes (Day 20).",
          "So a job should use as few nodes as possible.",
          "For a job that fits on one node, best fit chooses the node with the fewest free GPUs that is still enough, leaving larger free blocks for bigger jobs.",
          "For jobs spanning nodes, taking the nodes with the most free GPUs first minimises the number of nodes.",
          "Practice 1 is place_job(gpus_needed, free_gpus), which applies these rules.",
          "The example places a series of jobs and shows the free GPUs after each one.",
          "Poor placement causes fragmentation: many nodes with a few free GPUs, and no room for a large job even though the total is enough.",
          "Schedulers use topology information to keep jobs within the same rack or network domain too.",
          "Some clusters reserve whole nodes for large jobs to avoid fragmentation entirely.",
          "Placement is a classic bin-packing problem, and simple heuristics work well in practice.",
          "The same idea appears when packing virtual machines onto servers or containers onto Kubernetes nodes."
        ],
        "example": "Parking cars: fit small cars into small gaps, so big spaces stay free for the lorries.",
        "code": "free = [8, 4, 6]\ndef best_fit(n, free):\n    fits = [i for i, f in enumerate(free) if f >= n]\n    return min(fits, key=lambda i: (free[i], i)) if fits else None\n\nfor job in [4, 2, 6, 8]:\n    node = best_fit(job, free)\n    if node is not None:\n        free[node] -= job\n    print(f\"job of {job}: node {node}, free now {free}\")",
        "output": "job of 4: node 1, free now [8, 0, 6]\njob of 2: node 2, free now [8, 0, 4]\njob of 6: node 0, free now [2, 0, 4]\njob of 8: node None, free now [2, 0, 4]",
        "codeNotes": [
          {
            "line": 4,
            "note": "The tightest node that still fits."
          }
        ],
        "tryIt": "What would happen to the 8-GPU job if the 4-GPU job had been put on node 0?",
        "check": {
          "question": "Why does best fit choose the node with the fewest sufficient free GPUs?",
          "options": [
            "It is random",
            "It keeps larger free blocks available for bigger jobs",
            "It is faster to compute"
          ],
          "answer": 1,
          "why": "Avoid fragmenting big blocks."
        }
      },
      {
        "title": "The full cost of a run",
        "say": [
          "GPU-hours from the budget report (Day 22) are the starting point for cost.",
          "Failures and restarts add extra hours, often 5 to 15 percent on large runs (Day 18).",
          "Spot or preemptible capacity is cheaper but brings more interruptions.",
          "Practice 2 is run_cost(gpu_hours, on_demand_price, spot_discount_pct, spot_share_pct, failure_overhead_pct).",
          "It adds the failure overhead, then prices the spot share at a discount and the rest at the on-demand price.",
          "The example compares all on-demand, all spot, and a mix.",
          "Other costs include storage for data and checkpoints, networking, engineers' time and evaluation runs.",
          "Reserved capacity, bought for a year or more, lowers prices for teams that train continuously.",
          "Tracking actual spend against the plan during the run avoids surprises.",
          "A realistic cost estimate is often the deciding factor in whether a project goes ahead.",
          "Presenting a range, from an optimistic to a cautious estimate, is more honest than a single number."
        ],
        "example": "Pricing a road trip: fuel for the distance, plus a little extra for detours, with cheaper fuel at some stations.",
        "code": "hours, price, discount = 10000, 2.0, 60\nfor spot_share, overhead in [(0, 0), (100, 20), (50, 10)]:\n    total_hours = hours * (1 + overhead / 100)\n    spot = total_hours * spot_share / 100\n    cost = spot * price * (1 - discount / 100) + (total_hours - spot) * price\n    print(f\"spot {spot_share:3}% with {overhead:2}% redo: ${cost:,.0f}\")",
        "output": "spot   0% with  0% redo: $20,000\nspot 100% with 20% redo: $9,600\nspot  50% with 10% redo: $15,400",
        "codeNotes": [
          {
            "line": 3,
            "note": "Failures add hours."
          },
          {
            "line": 5,
            "note": "Spot hours at a discount, the rest at full price."
          }
        ],
        "tryIt": "At what failure overhead would all-spot cost as much as all on-demand?",
        "check": {
          "question": "What does failure overhead do to cost?",
          "options": [
            "Nothing",
            "Adds extra GPU-hours to pay for",
            "Reduces the price"
          ],
          "answer": 1,
          "why": "Redone work must be paid for."
        }
      },
      {
        "title": "Utilisation of shared clusters",
        "say": [
          "Cluster utilisation is the fraction of GPU-hours spent running jobs rather than sitting idle.",
          "Idle time comes from fragmentation, jobs waiting for gang scheduling, and gaps between jobs.",
          "Backfilling lets small, short jobs use gaps while a large job waits for enough GPUs, as long as they finish in time.",
          "The example calculates utilisation for a week of jobs on a small cluster.",
          "Good clusters run above 80 percent utilisation; badly scheduled ones can fall below 50.",
          "Idle GPUs are expensive: an idle 8-GPU node can waste hundreds of dollars a day.",
          "Showing teams their GPU usage encourages efficient requests and freeing unused reservations.",
          "Jobs that request GPUs but barely use them, visible through low GPU activity, should be spotted and fixed.",
          "Utilisation of the cluster and MFU of each job (Day 23) together describe overall efficiency.",
          "Both are worth tracking on shared dashboards."
        ],
        "example": "A hotel's occupancy rate: empty rooms still cost money to run.",
        "code": "cluster_gpus, hours = 64, 7 * 24\njobs = [(\"pretrain\", 32, 150), (\"fine-tunes\", 16, 120), (\"evals\", 8, 60), (\"experiments\", 8, 90)]\nused = sum(g * h for _, g, h in jobs)\nprint(f\"GPU-hours used {used:,} of {cluster_gpus * hours:,} -> utilisation {used / (cluster_gpus * hours):.1%}\")",
        "output": "GPU-hours used 7,920 of 10,752 -> utilisation 73.7%",
        "codeNotes": [
          {
            "line": 3,
            "note": "GPUs times hours for each job."
          }
        ],
        "tryIt": "How much more work could run if utilisation rose to 85%?",
        "check": {
          "question": "What does backfilling do?",
          "options": [
            "Deletes old jobs",
            "Runs small jobs in gaps while large jobs wait",
            "Doubles GPU speed"
          ],
          "answer": 1,
          "why": "It fills idle time without delaying big jobs."
        }
      },
      {
        "title": "Planning the capacity you need",
        "say": [
          "Capacity planning estimates how many GPUs a team needs over the coming months.",
          "Start from the planned runs: their GPU-hours, deadlines and whether they can overlap.",
          "Add experiments, evaluations and fine-tunes, which often use as much as the big runs combined.",
          "Add headroom for failures, reruns and surprises.",
          "The example turns a quarter's plan into an average and a peak GPU requirement.",
          "Peak demand usually matters more than the average, because big runs need many GPUs at once.",
          "Cloud capacity can cover peaks, while owned or reserved capacity covers the steady base.",
          "Long lead times for new hardware mean capacity must be planned months ahead.",
          "Energy and cooling are real limits for on-premises clusters.",
          "Presenting capacity needs clearly is how engineering teams secure the resources they need."
        ],
        "example": "Planning staff for a shop: enough for normal days, with extra help booked for the holiday rush.",
        "code": "quarter_hours = 13 * 7 * 24\nwork = [(\"pretraining run\", 250_000, 512), (\"fine-tunes\", 40_000, 64), (\"experiments\", 60_000, 128)]\ntotal = sum(h for _, h, _ in work) * 1.2\nprint(f\"average GPUs needed: {total / quarter_hours:.0f}\")\nprint(f\"peak GPUs needed:    {sum(g for _, _, g in work)}\")",
        "output": "average GPUs needed: 192\npeak GPUs needed:    704",
        "codeNotes": [
          {
            "line": 3,
            "note": "20% headroom for failures and reruns."
          }
        ],
        "tryIt": "Why is the peak so much higher than the average here?",
        "check": {
          "question": "Why does peak demand matter for capacity planning?",
          "options": [
            "It does not",
            "Large runs need many GPUs at the same time",
            "It sets the price"
          ],
          "answer": 1,
          "why": "Gang-scheduled jobs need all GPUs at once."
        }
      },
      {
        "title": "Practice time: clusters and cost",
        "say": [
          "Practice 1: place_job(gpus_needed, free_gpus). Return None if the cluster lacks enough free GPUs; use best fit on one node if possible; otherwise take nodes with the most free GPUs first until the job fits; return {node: gpus}.",
          "The checks include best fit, a two-node placement, an impossible job and a tie between nodes.",
          "Practice 2: run_cost(gpu_hours, on_demand_price, spot_discount_pct, spot_share_pct, failure_overhead_pct). Return the total cost rounded to 2 decimals.",
          "The checks include all on-demand, all spot and a mixed case with 10 percent failure overhead.",
          "After passing, place a queue of jobs one after another and report the fragmentation at the end.",
          "The example does that.",
          "Tomorrow's capstone brings everything together: choosing a strategy that fits and reporting a run.",
          "Cluster skills are increasingly part of machine learning engineering roles.",
          "Cost awareness is valued highly by every organisation that trains models.",
          "If place_job chooses the wrong node, print the candidate nodes and their free GPUs."
        ],
        "example": "A logistics manager loading trucks efficiently and pricing the whole delivery round.",
        "code": "free = [8, 8, 8, 8]\nfor job in [3, 5, 6, 2, 8, 4]:\n    fits = [i for i, f in enumerate(free) if f >= job]\n    if fits:\n        node = min(fits, key=lambda i: (free[i], i))\n        free[node] -= job\n        print(f\"job {job}: node {node}, free {free}\")\n    else:\n        print(f\"job {job}: no single node fits, free {free}\")\nprint(f\"free GPUs {sum(free)}, largest free block {max(free)}\")",
        "output": "job 3: node 0, free [5, 8, 8, 8]\njob 5: node 0, free [0, 8, 8, 8]\njob 6: node 1, free [0, 2, 8, 8]\njob 2: node 1, free [0, 0, 8, 8]\njob 8: node 2, free [0, 0, 0, 8]\njob 4: node 3, free [0, 0, 0, 4]\nfree GPUs 4, largest free block 4",
        "codeNotes": [
          {
            "line": 5,
            "note": "Best fit keeps big blocks intact."
          }
        ],
        "tryIt": "Four GPUs are left free. Could another 8-GPU job start now, and would a different placement order have helped?",
        "check": {
          "question": "What should place_job return when the cluster has too few free GPUs?",
          "options": [
            "An empty dict",
            "None",
            "A partial placement"
          ],
          "answer": 1,
          "why": "A distributed job cannot start partially."
        }
      }
    ],
    "summary": [
      "Schedulers queue jobs; distributed jobs need gang scheduling.",
      "Best fit on one node; otherwise fewest nodes, most free first.",
      "Cost = hours × (1 + overhead), spot share discounted.",
      "Track cluster utilisation along with job MFU.",
      "Plan capacity for peaks, with headroom for failures."
    ],
    "projectStep": {
      "title": "Training planner, part 29",
      "steps": [
        "Implement place_job and run_cost.",
        "Simulate placing a week of jobs on a small cluster.",
        "Estimate the total cost of your planned run with spot and failures."
      ]
    }
  },
  {
    "day": 30,
    "title": "🏆 Capstone: Planning and Reporting a Distributed Training Run",
    "goal": "You can choose a sharding strategy that fits a model on a given cluster, summarise a training log into a clear report, and present a complete, justified distributed training plan.",
    "minutes": 30,
    "recap": "This final day brings together memory, parallelism, communication, stability, cost and reporting. You will plan a run end to end and report on it, as a machine learning infrastructure engineer does.",
    "parts": [
      {
        "title": "Choosing a strategy that fits",
        "say": [
          "The first question for any run is whether it fits, and with which technique.",
          "Start with the simplest option and move up only when needed: plain data parallelism, then ZeRO stages 1, 2 and 3.",
          "For each stage, compute model states per GPU (Day 9) and add activation memory (Day 8), then compare with GPU memory.",
          "Practice 1 is plan_training(params, gpus, gpu_gb, activation_gb), which returns the smallest ZeRO stage that fits, or None.",
          "If nothing fits, the model needs tensor or pipeline parallelism as well, or more GPUs.",
          "The example plans four model sizes on a 64-GPU cluster.",
          "Simpler strategies communicate less and are easier to debug, which is why the smallest working stage is preferred.",
          "Activation memory can be reduced with checkpointing (Day 13) if a stage almost fits.",
          "Always leave some headroom for memory spikes and fragmentation.",
          "Writing down why each alternative was rejected makes the plan convincing.",
          "For instance, a note that stage 0 needs 132 GB per GPU explains immediately why sharding is required."
        ],
        "example": "Choosing the smallest van that safely carries everything, rather than always hiring the biggest lorry.",
        "code": "def plan(params, gpus, gpu_gb, act_gb):\n    for stage, b in enumerate([16, 4 + 12 / gpus, 2 + 14 / gpus, 16 / gpus]):\n        total = b * params / 1e9 + act_gb\n        if total <= gpu_gb:\n            return stage, round(total, 1)\n    return None, round(16 / gpus * params / 1e9 + act_gb, 1)\n\nfor billions in [1, 7, 30, 400]:\n    stage, per_gpu = plan(billions * 1e9, 64, 80, 20)\n    print(f\"{billions:3}B: stage {stage}, {per_gpu} GB per GPU\")",
        "output": "  1B: stage 0, 36.0 GB per GPU\n  7B: stage 1, 49.3 GB per GPU\n 30B: stage 3, 27.5 GB per GPU\n400B: stage None, 120.0 GB per GPU",
        "codeNotes": [
          {
            "line": 2,
            "note": "Bytes per parameter per GPU for stages 0 to 3."
          },
          {
            "line": 6,
            "note": "Nothing fits: report the stage-3 figure."
          }
        ],
        "tryIt": "What would you do for the 400B model?",
        "check": {
          "question": "Why prefer the smallest ZeRO stage that fits?",
          "options": [
            "It uses more memory",
            "It communicates less and is simpler",
            "It is required"
          ],
          "answer": 1,
          "why": "Simpler, faster, easier to debug."
        }
      },
      {
        "title": "The complete plan",
        "say": [
          "A complete training plan answers a standard set of questions.",
          "What model size and how many tokens, and why (Day 22)?",
          "How much memory, which parallel strategy, and does it fit (Days 8 to 13)?",
          "What batch size, learning rate schedule and optimizer (Days 3, 14, 15)?",
          "How long, how much, and with what checkpointing and failure plan (Days 1, 17, 18, 29)?",
          "The example prints a one-page plan for a 7B model.",
          "Each line can be traced back to a calculation you can now do.",
          "Reviewers look for assumptions they disagree with, so stating them clearly speeds up approval.",
          "The plan is a living document: update it as measurements replace estimates.",
          "Writing such plans is a core part of senior engineering work in AI teams.",
          "A short risk section, listing what could go wrong and the planned response, completes the plan."
        ],
        "example": "An architect's plan: dimensions, materials, schedule and budget on one page, all justified.",
        "code": "plan = [(\"model\", \"7B dense transformer\"), (\"data\", \"140B tokens (20 per parameter)\"),\n        (\"compute\", \"5.9e21 FLOPs, about 13,100 GPU-hours at 40% MFU\"),\n        (\"cluster\", \"64 x 80 GB GPUs, ZeRO stage 1, BF16\"),\n        (\"batch\", \"micro 8 x accum 4 x 64 GPUs = 2048 sequences\"),\n        (\"schedule\", \"AdamW, warmup 2000 steps, cosine to 10% of peak\"),\n        (\"reliability\", \"checkpoint every 30 min, auto-restart, 10% overhead budget\"),\n        (\"cost\", \"about $29,000 including overhead\")]\nfor key, value in plan:\n    print(f\"{key:12} {value}\")",
        "output": "model        7B dense transformer\ndata         140B tokens (20 per parameter)\ncompute      5.9e21 FLOPs, about 13,100 GPU-hours at 40% MFU\ncluster      64 x 80 GB GPUs, ZeRO stage 1, BF16\nbatch        micro 8 x accum 4 x 64 GPUs = 2048 sequences\nschedule     AdamW, warmup 2000 steps, cosine to 10% of peak\nreliability  checkpoint every 30 min, auto-restart, 10% overhead budget\ncost         about $29,000 including overhead",
        "codeNotes": [
          {
            "line": 3,
            "note": "From the budget report (Day 22)."
          },
          {
            "line": 7,
            "note": "From run_cost (Day 29)."
          }
        ],
        "tryIt": "Which line would you check first if the run turned out to be slower than planned?",
        "check": {
          "question": "What should a training plan state clearly?",
          "options": [
            "Only the model name",
            "Its assumptions, such as MFU and prices",
            "Nothing numerical"
          ],
          "answer": 1,
          "why": "Assumptions let reviewers check the plan."
        }
      },
      {
        "title": "Reporting a training run",
        "say": [
          "During and after a run, a report summarises what actually happened.",
          "Key facts: steps completed, final and best loss, any NaN or unstable steps, and throughput.",
          "Practice 2 is run_report(log), which produces these facts from a list of step records.",
          "NaN losses must be excluded when finding the best loss, and listed separately.",
          "An empty log should produce a clear empty report rather than an error.",
          "The example summarises a short log with one NaN step.",
          "Reports should compare actual results with the plan: time, cost, loss and MFU.",
          "Differences are not failures; they are information for the next plan.",
          "Clear reports build trust with the people who fund the compute.",
          "Many teams publish model cards and training reports that include exactly these facts.",
          "Automating the report from the training log, as Practice 2 does, means it is always up to date and never copied by hand."
        ],
        "example": "A ship's log summarised at the end of a voyage: distance covered, conditions met and incidents handled.",
        "code": "import math\n\nlog = [{\"step\": 1, \"loss\": 4.2, \"tokens\": 4000, \"seconds\": 2.0},\n       {\"step\": 2, \"loss\": float(\"nan\"), \"tokens\": 4000, \"seconds\": 2.0},\n       {\"step\": 3, \"loss\": 3.61234, \"tokens\": 4000, \"seconds\": 1.0},\n       {\"step\": 4, \"loss\": 3.7, \"tokens\": 4000, \"seconds\": 1.0}]\ngood = [e[\"loss\"] for e in log if not math.isnan(e[\"loss\"])]\nprint(\"final loss:\", round(log[-1][\"loss\"], 4), \"| best loss:\", round(min(good), 4))\nprint(\"NaN steps:\", [e[\"step\"] for e in log if math.isnan(e[\"loss\"])])\nprint(\"tokens/s:\", round(sum(e[\"tokens\"] for e in log) / sum(e[\"seconds\"] for e in log)))",
        "output": "final loss: 3.7 | best loss: 3.6123\nNaN steps: [2]\ntokens/s: 2667",
        "codeNotes": [
          {
            "line": 7,
            "note": "Exclude NaN losses before taking the minimum."
          }
        ],
        "tryIt": "Why is the final loss higher than the best loss here, and is that a concern?",
        "check": {
          "question": "Why exclude NaN when finding the best loss?",
          "options": [
            "NaN is small",
            "min() with NaN values gives unreliable results",
            "NaN is a string"
          ],
          "answer": 1,
          "why": "NaN breaks comparisons."
        }
      },
      {
        "title": "Everything you can now calculate",
        "say": [
          "Over thirty days you have built a toolkit of calculations and simulations.",
          "Memory: weights, training states, activations, ZeRO stages, checkpointing, LoRA and quantisation.",
          "Time: FLOPs, MFU, communication, overlap, pipeline bubbles and throughput.",
          "Reliability: checkpoints, failures, elasticity and stability monitoring.",
          "Planning: scaling laws, budgets, cluster placement and cost.",
          "The example lists each practice function by theme.",
          "These are the same calculations used by the teams that train frontier models, at a smaller scale.",
          "Frameworks change quickly, but these principles stay the same.",
          "Being able to reason from first principles lets you learn any new framework faster.",
          "Your training planner, built day by day, is a portfolio piece you can show employers.",
          "Explaining one of these calculations clearly in an interview shows real understanding far better than naming frameworks."
        ],
        "example": "A toolbox that has been filled one tool at a time, ready for any job.",
        "code": "toolkit = {\"memory\": [\"model_memory_gb\", \"training_memory_gb\", \"zero_memory_gb\", \"activation_memory\", \"lora_params\"],\n           \"time\": [\"training_days\", \"ring_cost\", \"allreduce_ms\", \"step_time\", \"mfu\"],\n           \"reliability\": [\"clip_by_global_norm\", \"latest_valid\", \"elastic_plan\", \"lost_work\"],\n           \"planning\": [\"chinchilla\", \"budget_report\", \"place_job\", \"run_cost\", \"plan_training\"]}\nfor theme, tools in toolkit.items():\n    print(f\"{theme:12} {len(tools)} tools: {', '.join(tools)}\")",
        "output": "memory       5 tools: model_memory_gb, training_memory_gb, zero_memory_gb, activation_memory, lora_params\ntime         5 tools: training_days, ring_cost, allreduce_ms, step_time, mfu\nreliability  4 tools: clip_by_global_norm, latest_valid, elastic_plan, lost_work\nplanning     5 tools: chinchilla, budget_report, place_job, run_cost, plan_training",
        "codeNotes": [
          {
            "line": 1,
            "note": "Functions you wrote in this course."
          }
        ],
        "tryIt": "Which of these would you use first when someone proposes a new training run?",
        "check": {
          "question": "Why do first principles matter when frameworks change quickly?",
          "options": [
            "They do not",
            "They let you understand and learn any new framework faster",
            "They replace frameworks"
          ],
          "answer": 1,
          "why": "The underlying maths stays the same."
        }
      },
      {
        "title": "Where to go next",
        "say": [
          "Read the papers behind this course: ZeRO, Megatron-LM, GPipe, Chinchilla, LoRA and QLoRA are all readable with what you now know.",
          "Try the real tools: PyTorch DDP and FSDP on a machine with two GPUs, or DeepSpeed with ZeRO on a cloud instance.",
          "Reproduce a small published training run and compare your MFU with the reported numbers.",
          "Contribute to open-source training frameworks; many welcome documentation and small fixes.",
          "Roles such as ML infrastructure engineer, research engineer and ML platform engineer use these skills every day.",
          "The example prints a four-week follow-up plan.",
          "Keep a learning journal of experiments and results, just like a training log.",
          "Join communities around open models, where training reports and tips are shared openly.",
          "Follow new techniques critically: measure before adopting.",
          "Revisit the calculations from this course whenever new hardware appears; only the numbers change, not the methods.",
          "Congratulations on completing a demanding course."
        ],
        "example": "Finishing a first long hike and planning the next, slightly higher mountain.",
        "code": "weeks = [\"read ZeRO and Megatron-LM papers; summarise each in one page\",\n         \"run DDP and FSDP on 2 GPUs; measure memory and step time\",\n         \"fine-tune a small model with LoRA and QLoRA; compare quality\",\n         \"write a full training plan and report for a 1B-parameter run\"]\nfor i, w in enumerate(weeks, 1):\n    print(f\"week {i}: {w}\")",
        "output": "week 1: read ZeRO and Megatron-LM papers; summarise each in one page\nweek 2: run DDP and FSDP on 2 GPUs; measure memory and step time\nweek 3: fine-tune a small model with LoRA and QLoRA; compare quality\nweek 4: write a full training plan and report for a 1B-parameter run",
        "codeNotes": [
          {
            "line": 2,
            "note": "Measure real memory and speed yourself."
          }
        ],
        "tryIt": "Which week excites you most, and why?",
        "check": {
          "question": "What should you do before adopting a new training technique?",
          "options": [
            "Adopt it immediately",
            "Measure its effect on your own setup",
            "Ignore it"
          ],
          "answer": 1,
          "why": "Measure before adopting."
        }
      },
      {
        "title": "Capstone practice: plan and report",
        "say": [
          "Practice 1: plan_training(params, gpus, gpu_gb, activation_gb). Try stages 0 to 3 with 16, 4 + 12/N, 2 + 14/N and 16/N bytes per parameter, add activations, and return the first stage that fits with its per-GPU total rounded to 1 decimal, or stage None with the stage-3 figure.",
          "The checks include a small model at stage 0, a 7B model at stage 1, a 30B model at stage 3 and a 400B model that does not fit.",
          "Practice 2: run_report(log). Return the number of steps, final loss, best non-NaN loss, NaN steps and whole tokens per second, with an empty report for an empty log.",
          "The checks include a four-step log with one NaN and an empty log.",
          "Congratulations: you have completed Distributed Model Training in Python, with 60 working tools and 30 full lessons.",
          "As a final project, write a complete training plan for a model of your choice, using your planner, and a mock report comparing plan and outcome.",
          "The example produces a short plan-versus-actual comparison.",
          "Your certificate reflects real, tested understanding of how large models are trained.",
          "Thank you for working through every calculation carefully.",
          "The skills you have built will stay useful as models and hardware keep growing."
        ],
        "example": "Graduation day: the plans, the measurements and the lessons learned, presented together.",
        "code": "plan = {\"GPU-hours\": 13100, \"cost\": 29000, \"final loss\": 2.10, \"MFU\": 0.40}\nactual = {\"GPU-hours\": 14250, \"cost\": 31500, \"final loss\": 2.07, \"MFU\": 0.37}\nfor key in plan:\n    diff = (actual[key] - plan[key]) / plan[key]\n    print(f\"{key:10} plan {plan[key]:>8} actual {actual[key]:>8} ({diff:+.1%})\")",
        "output": "GPU-hours  plan    13100 actual    14250 (+8.8%)\ncost       plan    29000 actual    31500 (+8.6%)\nfinal loss plan      2.1 actual     2.07 (-1.4%)\nMFU        plan      0.4 actual     0.37 (-7.5%)",
        "codeNotes": [
          {
            "line": 4,
            "note": "Relative difference from the plan."
          }
        ],
        "tryIt": "Which difference would you investigate first, and what might explain it?",
        "check": {
          "question": "What does plan_training return when no ZeRO stage fits?",
          "options": [
            "Stage 3",
            "Stage None with the stage-3 figure",
            "An error"
          ],
          "answer": 1,
          "why": "None signals that more parallelism is needed."
        }
      }
    ],
    "summary": [
      "Choose the smallest ZeRO stage whose states plus activations fit.",
      "A complete plan covers model, data, compute, memory, batch, schedule, reliability and cost.",
      "Report runs with steps, final and best loss, NaN steps and throughput.",
      "Compare actual results with the plan and learn from differences.",
      "First-principles calculations outlast any single framework."
    ],
    "projectStep": {
      "title": "Final capstone: distributed training plan",
      "steps": [
        "Implement plan_training and run_report.",
        "Write a one-page training plan for a model of your choice with your planner.",
        "Produce a mock run report comparing plan and outcome, with explanations."
      ]
    }
  }
];
