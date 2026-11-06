import io, sys, json, time

p1_code = '''import json
import uuid

class TaskMessageEnvelope:
    def __init__(self, task_name, args=None, kwargs=None, task_id="c7e2b10a"):
        self.task_id = task_id
        self.task_name = task_name
        self.args = args or []
        self.kwargs = kwargs or {}
        self.retries = 0

    def serialize(self):
        return json.dumps({
            "task_id": self.task_id,
            "task": self.task_name,
            "args": self.args,
            "kwargs": self.kwargs,
            "retries": self.retries
        })

class InMemoryBrokerQueue:
    def __init__(self, queue_name="celery"):
        self.queue_name = queue_name
        self.queue = []

    def publish(self, envelope):
        payload = envelope.serialize()
        self.queue.append(payload)
        return envelope.task_id

    def size(self):
        return len(self.queue)

broker = InMemoryBrokerQueue("video_processing")
msg = TaskMessageEnvelope("tasks.transcode_video", args=["video_1080p.mp4"], kwargs={"codec": "h265"})
task_id = broker.publish(msg)

print(f"Published task to queue '{broker.queue_name}' with ID: {task_id}")
print(f"Queue depth: {broker.size()} message(s)")
print("Payload sample:", broker.queue[0][:75] + "...")'''

p2_code = '''class WorkerCrashException(Exception):
    pass

class EarlyVsLateAckSimulator:
    def __init__(self):
        self.broker_queue = ["task_alpha", "task_beta"]
        self.inflight_unacked = {}
        self.lost_tasks = []
        self.completed_tasks = []

    def process_early_ack(self, task):
        # Early ACK: acknowledge message immediately before execution begins
        print(f"[Early ACK] Message '{task}' dequeued and ACKed immediately to broker.")
        # Worker crashes mid-execution!
        print(f"[Early ACK] CRASH: Worker killed mid-execution of '{task}'!")
        self.lost_tasks.append(task)

    def process_late_ack(self, task, should_crash=True):
        # Late ACK: keep task in unacked inflight registry
        self.inflight_unacked[task] = "RUNNING"
        print(f"[Late ACK] Message '{task}' leased. Kept in inflight registry.")
        if should_crash:
            print(f"[Late ACK] CRASH: Worker killed mid-execution of '{task}'!")
            # Worker crash detected; broker redelivers unacked message
            del self.inflight_unacked[task]
            print(f"[Late ACK] Broker REDELIVERS '{task}' to standby worker.")
            self.completed_tasks.append(f"{task}_recovered")
        else:
            del self.inflight_unacked[task]
            self.completed_tasks.append(task)

sim = EarlyVsLateAckSimulator()
sim.process_early_ack("video_encode_01")
print(f"Early ACK outcome: Lost tasks = {sim.lost_tasks}")
print("-" * 50)
sim.process_late_ack("video_encode_02", should_crash=True)
print(f"Late ACK outcome: Completed/Recovered = {sim.completed_tasks}")'''

p3_code = '''class PrefetchWorker:
    def __init__(self, worker_id, prefetch_limit=1):
        self.worker_id = worker_id
        self.prefetch_limit = prefetch_limit
        self.reserved_tasks = []

    def prefetch_from_broker(self, broker_queue):
        while len(self.reserved_tasks) < self.prefetch_limit and broker_queue:
            task = broker_queue.pop(0)
            self.reserved_tasks.append(task)

class WorkloadDispatcher:
    def __init__(self):
        self.queue = ["fast_task_1", "fast_task_2", "slow_task_3", "fast_task_4"]

dispatcher = WorkloadDispatcher()
# Worker A has naive prefetch=4, hoards all tasks
worker_greedy = PrefetchWorker("worker_greedy", prefetch_limit=4)
worker_greedy.prefetch_from_broker(dispatcher.queue)

print(f"Greedy Worker reserved: {worker_greedy.reserved_tasks}")
print(f"Broker queue remaining: {dispatcher.queue} (Idle workers starved!)")

# Fair dispatch with prefetch=1
dispatcher.queue = ["fast_task_1", "fast_task_2", "slow_task_3", "fast_task_4"]
w1 = PrefetchWorker("worker_1", prefetch_limit=1)
w2 = PrefetchWorker("worker_2", prefetch_limit=1)
w1.prefetch_from_broker(dispatcher.queue)
w2.prefetch_from_broker(dispatcher.queue)

print(f"Fair dispatch -> W1: {w1.reserved_tasks}, W2: {w2.reserved_tasks}")
print(f"Broker queue remaining for other workers: {dispatcher.queue}")'''

p4_code = '''class TaskStatus:
    PENDING = "PENDING"
    STARTED = "STARTED"
    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE"

class InMemoryResultBackend:
    def __init__(self):
        self.store = {}

    def set_state(self, task_id, state, result=None):
        self.store[task_id] = {"state": state, "result": result}

    def get_state(self, task_id):
        return self.store.get(task_id, {"state": TaskStatus.PENDING, "result": None})

backend = InMemoryResultBackend()
tid = "task_992"

backend.set_state(tid, TaskStatus.STARTED)
print(f"Task {tid} query: State = {backend.get_state(tid)['state']}")

backend.set_state(tid, TaskStatus.SUCCESS, result={"duration_sec": 4.2, "bytes_written": 1048576})
res = backend.get_state(tid)
print(f"Task {tid} resolved: State = {res['state']}, Output = {res['result']}")'''

p5_code = '''class DistributedTaskSupervisor:
    def __init__(self, acks_late=True, prefetch_limit=1):
        self.acks_late = acks_late
        self.prefetch_limit = prefetch_limit
        self.queue = []
        self.processed = []
        self.redelivered = []

    def enqueue(self, task_name):
        self.queue.append(task_name)

    def execute_with_fault_injection(self, fail_first_attempt=True):
        print(f"Supervisor started (acks_late={self.acks_late}, prefetch={self.prefetch_limit})")
        while self.queue:
            task = self.queue.pop(0)
            print(f"Worker leased '{task}'...")
            if fail_first_attempt and task not in self.redelivered:
                print(f"Worker CRASH simulated on '{task}'!")
                if self.acks_late:
                    print(f"Late ACK safety: '{task}' returned to queue for redelivery.")
                    self.redelivered.append(task)
                    self.queue.insert(0, task)
                else:
                    print(f"Early ACK failure: '{task}' was acknowledged early and is PERMANENTLY LOST.")
            else:
                self.processed.append(task)
                print(f"Worker completed '{task}' successfully (ACK sent).")

sup = DistributedTaskSupervisor(acks_late=True, prefetch_limit=1)
sup.enqueue("render_3d_frame_001")
sup.execute_with_fault_injection(fail_first_attempt=True)

print(f"Summary: Processed tasks = {sup.processed}, Redelivered count = {len(sup.redelivered)}")
print("INVARIANT SATISFIED: Zero task loss under worker crash.")'''

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
