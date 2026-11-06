import os
import sys

sys.path.insert(0, os.path.abspath('scripts'))
from react_day36_data import day36

p3_code = """// Architecture of React Scheduler: MessageChannel Macro-Task Engine
class MessageChannelScheduler {
  constructor() {
    this.taskQueue = [];
    this.yieldCount = 0;
  }

  // Enqueue a unit of work
  schedule(task) {
    this.taskQueue.push(task);
  }

  // Simulating MessageChannel port.onmessage macro-task execution
  flushWork() {
    console.log('[Scheduler] Macro-task received | Processing work queue...');
    const startTime = Date.now();
    const FRAME_YIELD_MS = 5; // React's standard 5ms slice target

    while (this.taskQueue.length > 0) {
      const currentTask = this.taskQueue.shift();
      currentTask();

      // Check if we have exceeded our 5ms time-slice window
      const elapsed = Date.now() - startTime;
      if (elapsed >= FRAME_YIELD_MS && this.taskQueue.length > 0) {
        this.yieldCount++;
        console.log('[Scheduler] Slice exceeded 5ms limit (' + elapsed + 'ms). YIELDING to browser paint...');
        return;
      }
    }

    console.log('[Scheduler] Work queue completely drained | Total yields: ' + this.yieldCount);
  }
}

const scheduler = new MessageChannelScheduler();

// Queue 3 distinct computational tasks
scheduler.schedule(function() { console.log('  -> Executed Subtask A (Tree Reconciliation)'); });
scheduler.schedule(function() { console.log('  -> Executed Subtask B (Hook State Evaluation)'); });
scheduler.schedule(function() { console.log('  -> Executed Subtask C (DOM Mutation Prep)'); });

// Dispatch macro-task to flush queued work
scheduler.flushWork();
"""

day36['parts'][2]['code'] = p3_code

output_py = []
output_py.append("import hashlib\n")
output_py.append("def sha256(text: str) -> str:\n")
output_py.append("    return hashlib.sha256(text.encode('utf-8')).hexdigest()\n\n")
output_py.append("day36 = " + repr(day36) + "\n")

with open('scripts/react_day36_data.py', 'w', encoding='utf-8') as f:
    f.write("".join(output_py))

print("Updated Day 36 Part 3 successfully!")
