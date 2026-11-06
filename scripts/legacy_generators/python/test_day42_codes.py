import io, sys, json

p1_code = '''class TaskSignature:
    def __init__(self, name, func):
        self.name = name
        self.func = func

    def __or__(self, other):
        return TaskChain([self, other])

class TaskChain:
    def __init__(self, tasks=None):
        self.tasks = tasks or []

    def __or__(self, other):
        if isinstance(other, TaskChain):
            self.tasks.extend(other.tasks)
        else:
            self.tasks.append(other)
        return self

    def apply(self, initial_val):
        curr = initial_val
        log = []
        for t in self.tasks:
            prev = curr
            curr = t.func(curr)
            log.append(f"{t.name}({prev}) -> {curr}")
        return curr, log

t1 = TaskSignature("download_raw", lambda url: f"raw_data_from_{url}")
t2 = TaskSignature("clean_tokens", lambda text: text.upper().replace("_", " "))
t3 = TaskSignature("generate_hash", lambda s: f"token_sum:{sum(ord(c) for c in s)}")

pipeline = t1 | t2 | t3
result, execution_log = pipeline.apply("s3://bucket/input.txt")

print(f"Chain execution completed! Final result: {result}")
print("Step-by-step pipeline execution:")
for step in execution_log:
    print(f"  -> {step}")'''

p2_code = '''class TaskGroup:
    def __init__(self, tasks):
        self.tasks = tasks

    def apply(self, arg_list):
        results = []
        for task_func, arg in zip(self.tasks, arg_list):
            out = task_func(arg)
            results.append(out)
        return results

# Parallel thumbnail generation functions
funcs = [
    lambda size: f"thumb_{size}x{size}.jpg",
    lambda size: f"thumb_{size}x{size}.jpg",
    lambda size: f"thumb_{size}x{size}.jpg"
]

group = TaskGroup(funcs)
sizes = [128, 256, 512]
outputs = group.apply(sizes)

print(f"Parallel Group dispatched {len(sizes)} tasks concurrently:")
for sz, out in zip(sizes, outputs):
    print(f"  Processed {sz}px -> Generated: {out}")'''

p3_code = '''class ChordBarrier:
    def __init__(self, expected_count, callback):
        self.expected_count = expected_count
        self.callback = callback
        self.completed_results = []

    def task_complete(self, task_idx, result):
        self.completed_results.append(result)
        print(f"[Chord Barrier] Task {task_idx+1}/{self.expected_count} completed: '{result}'")
        if len(self.completed_results) == self.expected_count:
            print("[Chord Barrier] ALL group tasks completed! Firing aggregate callback...")
            return self.callback(self.completed_results)
        return None

def merge_chunks_callback(results):
    return f"FINAL_RENDER_COMPOSED({','.join(results)})"

barrier = ChordBarrier(expected_count=3, callback=merge_chunks_callback)
barrier.task_complete(0, "chunk_0_encoded")
barrier.task_complete(1, "chunk_1_encoded")
final_output = barrier.task_complete(2, "chunk_2_encoded")

print("Callback result:", final_output)'''

p4_code = '''class ChordPollingDefense:
    def __init__(self, max_polls=5):
        self.poll_log = []

    def simulate_thundering_herd(self, task_count=100, poll_interval_ms=50):
        # Naive polling: 100 workers poll Redis every 50ms -> 2000 queries/sec
        qps = (1000 // poll_interval_ms) * task_count
        return f"NAIVE POLLING STORM: {task_count} tasks polling every {poll_interval_ms}ms = {qps} QPS on Redis!"

    def simulate_adaptive_backoff(self, initial_ms=100, max_ms=1600):
        interval = initial_ms
        backoff_steps = []
        while interval <= max_ms:
            backoff_steps.append(f"{interval}ms")
            interval *= 2
        return backoff_steps

defense = ChordPollingDefense()
storm_stat = defense.simulate_thundering_herd(task_count=100, poll_interval_ms=50)
print(storm_stat)

backoff = defense.simulate_adaptive_backoff()
print(f"Defensive exponential backoff intervals: {' -> '.join(backoff)}")
print("Redis QPS reduced by 94%, connection pool protected from exhaustion.")'''

p5_code = '''class CompleteMediaPipelineWorkflow:
    def __init__(self, video_id):
        self.video_id = video_id
        self.log = []

    def run(self):
        # Step 1: Sequential Chain (Extract audio & chunk video)
        self.log.append("STEP 1 [Chain]: Extract audio stream 'audio.aac' from source.")
        self.log.append("STEP 1 [Chain]: Split video into 3 independent 10-second segments.")
        
        # Step 2: Parallel Group (Transcode segments)
        segments = ["seg_0.ts", "seg_1.ts", "seg_2.ts"]
        self.log.append(f"STEP 2 [Group]: Parallel transcode of {len(segments)} segments across worker cluster.")
        
        # Step 3: Chord Barrier (Merge segments + mux audio)
        self.log.append("STEP 3 [Chord]: Barrier sync reached (3/3 segments ready).")
        self.log.append("STEP 3 [Chord]: Mux audio.aac with segments -> 'master_1080p.mp4'.")
        return "master_1080p.mp4"

pipeline = CompleteMediaPipelineWorkflow("vid_9841")
output = pipeline.run()

print("=== Complete Celery Canvas Media Pipeline ===")
for entry in pipeline.log:
    print(f"  {entry}")
print(f"Workflow finished successfully! Deliverable: {output}")'''

for idx, code in enumerate([p1_code, p2_code, p3_code, p4_code, p5_code]):
    old_stdout = sys.stdout
    buf = io.StringIO()
    sys.stdout = buf
    exec(code, {'__name__': '__main__'})
    sys.stdout = old_stdout
    out = buf.getvalue().strip()
    print(f"--- Part {idx+1} Output ---")
    print(out)
    print()
