# scripts/topup_dist_day36.py

with open("scripts/create_dist_day36_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Part 2 addition
p2_target = '"Notice how the participant successfully locks the balance resource for transaction tx-101'
p2_extra = '''    "Moreover, modern database engines implement Deadlock Detection and Lock Wait Timeouts to prevent cyclic wait dependencies during the prepare phase. If Transaction Alpha prepares on Node 1 holding Row X and attempts to prepare on Node 2 needing Row Y, while Transaction Beta prepares on Node 2 holding Row Y and needs Row X, a classic distributed deadlock emerges. Distributed deadlock detectors must either maintain global Wait-For Graphs (WFGs) across all cohorts or enforce wound-wait / wait-die timestamp prioritization schemes to preemptively abort the younger transaction before cluster resources become permanently gridlocked.",
    "Notice how the participant successfully locks the balance resource for transaction tx-101'''

content = content.replace(p2_target, p2_extra)

# Part 3 addition
p3_target = '"Notice how the auditor confirms three stalled nodes with autonomous resolution strictly false'
p3_extra = '''    "Furthermore, the Cooperative Termination Protocol represents a partial mitigation where prepared participants query surviving peers when the coordinator fails. If any peer received a GLOBAL_COMMIT or GLOBAL_ABORT from the coordinator before it crashed, the surviving peers can adopt that decision safely. However, if ALL surviving peers are in the PREPARED state, they remain fundamentally stuck! Because the coordinator and one crashed participant could have formed a private decision channel, the surviving cohorts cannot distinguish between global commit and global abort, cementing the reality of Skeen\'s blocking theorem.",
    "Notice how the auditor confirms three stalled nodes with autonomous resolution strictly false'''

content = content.replace(p3_target, p3_extra)

# Part 4 addition
p4_target = '"Notice how the optimization requires disk fsync for commit decisions while abort decisions require zero disk writes'
p4_extra = '''    "In addition to Presumed Abort, Jim Gray and colleagues also formulated The Presumed Commit (PC) Protocol. Under Presumed Commit, the system inverts the assumption: absence of an unrecorded transaction implies that the transaction COMMITTED! Consequently, aborts require explicit durable logging and acknowledgments, whereas commits require no acknowledgments. In practice, however, Presumed Abort became the dominant enterprise standard because crashes during the prepare phase naturally leave transactions in an uncommitted state, making abort presumption vastly more intuitive and resilient to edge-case recovery bugs.",
    "From an operational reliability standpoint, Presumed Abort guarantees that transaction tables in database shared memory do not experience unbounded memory leaks during failure storms. Because aborted transactions are deleted from coordinator memory immediately upon voting evaluation, network partitions that force hundreds of concurrent transactions to abort do not exhaust operating system memory buffers. The recovery manager simply discards dangling references, allowing the database engine to maintain stable RAM utilization.",
    "Notice how the optimization requires disk fsync for commit decisions while abort decisions require zero disk writes'''

content = content.replace(p4_target, p4_extra)

# Part 5 addition
p5_target = '"Notice how the production 2PC engine executes across all three database cohorts'
p5_extra = '''    "To prevent operational surprises under high network traffic, our production deployment blueprint couples the Two-Phase Commit engine with Distributed Tracing (OpenTelemetry) and circuit breakers. Each distributed transaction injects a W3C tracecontext header (`traceparent`) into every prepare and commit RPC. The OpenTelemetry collector records span latencies across each cohort, providing instantaneous visibility into whether database lock acquisition, local WAL fsync, or network packet serialization is contributing to tail latency outliers.",
    "Notice how the production 2PC engine executes across all three database cohorts'''

content = content.replace(p5_target, p5_extra)

with open("scripts/create_dist_day36_data.py", "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully injected pedagogical expansions into create_dist_day36_data.py!")
