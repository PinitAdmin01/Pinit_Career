import os
import sys

sys.path.insert(0, os.path.abspath('scripts'))
from react_day36_data import day36

p5_code = """// Production Cooperative Task Scheduler Engine with Deterministic Slicing
class ProductionTaskScheduler {
  constructor(sliceLimitMs) {
    this.sliceLimitMs = sliceLimitMs || 5;
    this.queue = [];
    this.virtualClock = 0;
    this.metrics = {
      totalTasks: 0,
      completedTasks: 0,
      slicesCount: 0,
      yieldCount: 0
    };
  }

  // Push work unit with simulated duration into queue
  postTask(taskName, simulatedDurationMs, taskFn) {
    this.queue.push({
      name: taskName,
      duration: simulatedDurationMs,
      fn: taskFn
    });
    this.metrics.totalTasks++;
  }

  // Flushes queue across cooperative time-sliced macro-tasks
  flush() {
    this.workLoop();
  }

  workLoop() {
    this.metrics.slicesCount++;
    let sliceElapsed = 0;
    console.log('[Scheduler] Slice #' + this.metrics.slicesCount + ' started with ' + this.queue.length + ' tasks in queue');

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      task.fn();
      this.metrics.completedTasks++;
      sliceElapsed += task.duration;
      this.virtualClock += task.duration;
      console.log('  -> Finished task: ' + task.name + ' (took ' + task.duration + 'ms)');

      // Check if current slice has exceeded its limit and more work remains
      if (sliceElapsed >= this.sliceLimitMs && this.queue.length > 0) {
        this.metrics.yieldCount++;
        console.log('[Scheduler] Yield limit reached (' + sliceElapsed + 'ms >= ' + this.sliceLimitMs + 'ms). Yielding...');
        this.workLoop(); // Resumes on subsequent macro-task turn
        return;
      }
    }

    console.log('[Scheduler] All tasks completed!');
    console.log('Execution Summary: Tasks=' + this.metrics.completedTasks + ' | Slices=' + this.metrics.slicesCount + ' | Yields=' + this.metrics.yieldCount);
  }
}

const scheduler = new ProductionTaskScheduler(5);

// Add 4 enterprise tasks with deterministic execution weights
scheduler.postTask('ComputeTaxSummary', 2, function() { /* Task logic */ });
scheduler.postTask('ReconcileGridRows', 4, function() { /* Triggers yield after 6ms total */ });
scheduler.postTask('GenerateChartData', 2, function() { /* Runs in slice 2 */ });
scheduler.postTask('CommitLayoutTree', 1, function() { /* Runs in slice 2 */ });

// Execute time-sliced flush
scheduler.flush();
"""

day36['parts'][4]['code'] = p5_code

output_py = []
output_py.append("import hashlib\n")
output_py.append("def sha256(text: str) -> str:\n")
output_py.append("    return hashlib.sha256(text.encode('utf-8')).hexdigest()\n\n")
output_py.append("day36 = " + repr(day36) + "\n")

with open('scripts/react_day36_data.py', 'w', encoding='utf-8') as f:
    f.write("".join(output_py))

print("Updated Day 36 Part 5 successfully!")
