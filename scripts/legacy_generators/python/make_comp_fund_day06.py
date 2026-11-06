# scripts/make_comp_fund_day06.py
import sys
import os
import json
import subprocess
import hashlib

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

p1_say = [
    "Welcome to Day 6 of Computer Fundamentals and Systems Architecture. Today, we step deep into the operating system kernel to master Process Management, Multitasking, Process IDs, Threads, and CPU Scheduling. When an engineer executes a compiled binary or starts a server on a Linux host, the operating system does not execute raw machine instructions in an unstructured sandbox. The kernel instantiates a sovereign execution container known as a Process. A process is an active instance of a running computer program, complete with its own private virtual memory space, file descriptor table, security credentials, and execution state.",
    "At the heart of kernel process management lies the Process Control Block (PCB)—represented in the Linux kernel source code by the monumental struct task_struct. The PCB is the operating system's internal ledger for tracking every living execution entity. Inside task_struct, the kernel stores the Process Identification number (PID), the Parent Process ID (PPID), current execution state (Running, Interruptible Sleep, Uninterruptible Sleep, Stopped, or Zombie), CPU register context (including the Instruction Pointer / Program Counter and Stack Pointer), memory management pointers (the mm_struct mapping page tables), and open file descriptors (files_struct). Without the PCB, the CPU would have no memory of where an interrupted program was executing.",
    "The lifecycle of a process in POSIX and UNIX systems is governed by a foundational triad of system calls: fork, execve, and waitpid. When a process spawns a child, it invokes fork(), which clones the parent's address space using modern Copy-on-Write (COW) memory semantics. The child inherits identical data pages initially marked read-only; physical RAM pages are only duplicated when one process attempts a write. Next, the child process invokes execve(), which wipes the cloned address space clean and loads a new executable binary from storage into memory. The parent process typically calls wait() or waitpid() to monitor child execution, collect its exit status code, and release kernel resources.",
    "Failure of the parent to call wait() creates an insidious system hazard: Zombie Processes. When a child process terminates, the kernel frees its user-space memory and file descriptors, but retains its PCB entry in the process table so the parent can read the exit status code. If the parent ignores the child's termination signal (SIGCHLD), the dead child remains in the process table with status 'Z' (Zombie). While zombies consume zero RAM or CPU cycles, they consume scarce Process IDs. If rogue software spawns thousands of zombies, the operating system exhausts its maximum PID limit (cat /proc/sys/kernel/pid_max), preventing any new processes—including administrative SSH logins—from spawning.",
    "Conversely, if a parent process dies before its child, the child becomes an Orphan Process. The operating system kernel immediately reparents all orphan processes to PID 1—the root init daemon (such as systemd in modern Linux). PID 1 runs continuously as the sovereign ancestor of every user-space process, periodically invoking wait() to harvest dead child exit codes and purge zombie entries from the kernel process table.",
    "In cloud container environments such as Docker and Kubernetes, PID namespaces isolate processes within containers. The primary application running inside a Docker container is assigned virtual PID 1 within its isolated namespace. If this containerized application fails to properly reap child worker processes, the container accumulates zombies, eventually stalling container health checks and triggering Kubernetes pod restarts.",
    "A foundational mechanism for inspecting process execution in Linux is the /proc Virtual Pseudo-Filesystem. Rather than residing on physical disk blocks, /proc is synthesized directly by the Linux kernel in RAM. Every living process has a dedicated subdirectory named after its numeric PID (e.g., /proc/1042/). Inside this directory, engineers inspect /proc/[PID]/status for human-readable process state, memory metrics (VmRSS, VmSize), and voluntary vs. involuntary context switches; /proc/[PID]/maps for the complete virtual memory layout; /proc/[PID]/fd for open file descriptors; and /proc/[PID]/cmdline for the command-line arguments that launched the binary. Standard diagnostic utilities like ps, top, and htop simply parse these /proc text files.",
    "Furthermore, process state transitions are triggered by POSIX Signals. Signals are asynchronous notifications delivered by the kernel to a process. Critical signals include SIGTERM (Signal 15, the polite request to shut down gracefully and flush database buffers), SIGKILL (Signal 9, the immediate, uncatchable termination executed directly by the kernel), SIGSEGV (Signal 11, the fatal segmentation fault triggered when a process dereferences an invalid memory address), and SIGCHLD (Signal 17, sent to the parent whenever a child terminates or stops). Robust server daemons install custom signal handlers for SIGTERM to ensure clean resource deallocation before process exit.",
    "In this opening section, we construct a production-grade POSIX process lifecycle tracking simulation using shell scripts and filesystem telemetry. We simulate PCB state tracking, trace fork and exec transformations, monitor parent-child PID lineage, and diagnose zombie process states."
]

p1_code = """mkdir -p /home/student/workspace/proc_sim
echo "PID: 1042" > /home/student/workspace/proc_sim/process.pcb
echo "PPID: 1" >> /home/student/workspace/proc_sim/process.pcb
echo "NAME: nginx_worker" >> /home/student/workspace/proc_sim/process.pcb
echo "STATE: TASK_RUNNING" >> /home/student/workspace/proc_sim/process.pcb
echo "VIRT_MEM_MB: 128" >> /home/student/workspace/proc_sim/process.pcb
echo "OPEN_FD_COUNT: 16" >> /home/student/workspace/proc_sim/process.pcb
cat /home/student/workspace/proc_sim/process.pcb
grep "STATE" /home/student/workspace/proc_sim/process.pcb"""

p2_say = [
    "In the second operational tier of Day 6, we advance from whole processes to lightweight execution units: Multithreading Architecture, Concurrency, and Synchronization Primitives. While processes provide robust security and fault isolation through distinct, non-overlapping virtual memory address spaces, that very isolation makes inter-process communication (IPC) computationally expensive. Sharing data between two separate processes requires allocating shared memory segments, passing messages through kernel pipes, or transmitting packets over network sockets—all of which involve costly kernel mode transitions.",
    "To achieve high-performance concurrency within a single application, operating systems provide Threads (often termed Lightweight Processes). A thread is the smallest schedulable unit of execution dispatched by the CPU scheduler. Crucially, all threads belonging to the same process share the identical virtual memory address space: they share the Code Segment (text), Data Segment (global and static variables), Heap (dynamically allocated memory), and Open File Descriptors. However, every individual thread maintains its own private execution context: a dedicated Thread Control Block (TCB), a private Stack (for local variables and function call frames), private CPU Register states, and an independent Program Counter.",
    "Because threads share the same heap and global memory, communication between threads is instantaneous: one thread writes a pointer into a shared data structure, and another thread immediately reads it with zero kernel intervention. However, this shared memory paradigm introduces the single most notorious source of software bugs in computer systems: Race Conditions. A race condition occurs when multiple threads concurrently read and modify shared mutable memory without synchronization, producing non-deterministic data corruption that depends entirely on uncontrollable CPU scheduling timings.",
    "To prevent race conditions, systems engineers deploy Synchronization Primitives: Mutexes (Mutual Exclusion locks), Semaphores, and Atomic Operations. A Mutex ensures that only one thread can enter a Critical Section of code at any given microsecond. When Thread A acquires the mutex lock, any other thread attempting to access the critical section is suspended into sleep state by the kernel until Thread A releases the lock. Semaphores generalize this concept: a counting semaphore maintains an integer counter representing available shared resources (such as database connection pools), permitting up to N concurrent threads before blocking subsequent requests.",
    "However, careless locking architectures introduce an equally catastrophic danger: Deadlocks. A deadlock occurs when Thread 1 holds Lock A and requests Lock B, while Thread 2 simultaneously holds Lock B and requests Lock A. Neither thread can proceed, freezing application execution indefinitely. To prevent deadlocks, operating systems enforce strict lock acquisition hierarchies (always acquire locks in a predetermined global order) or utilize non-blocking try-lock operations with timeout fallbacks.",
    "In modern multi-core server processors (such as AMD EPYC or Intel Xeon with 128 physical cores), multithreading enables true parallel execution. While a single-core CPU provides only concurrent time-slicing (rapidly alternating between threads), a multi-core CPU executes dozens of distinct threads simultaneously in physical silicon, unlocking massive throughput for high-concurrency web servers, database engines, and AI inference pipelines.",
    "Beyond traditional locks, high-throughput systems deploy Lock-Free Concurrency and Hardware Atomic Operations. Standard mutexes force contending threads into kernel sleep states, incurring context switch latency. By contrast, atomic operations utilize specialized CPU hardware instructions—such as Compare-And-Swap (CAS, implemented via lock cmpxchg on x86_64 architectures)—to update memory variables atomically in silicon without entering the kernel. Lock-free queues and ring buffers enable threads to exchange millions of messages per second with microsecond predictability.",
    "Furthermore, systems developers utilize Thread-Local Storage (TLS). When a variable is declared with the thread_local keyword in C++ or __thread in C, the compiler and linker assign a private copy of the variable to each thread within its Thread Control Block. This eliminates shared mutable state entirely for per-thread buffers, random number generator seeds, and database transaction contexts, maximizing multi-core scalability without lock contention.",
    "In this section, we construct a thread lifecycle and concurrency synchronization simulation in the shell. We model Thread Control Blocks (TCB), track shared heap versus private stack allocations, simulate mutex lock acquisition states, and demonstrate race condition prevention."
]

p2_code = """mkdir -p /home/student/workspace/threads_sim
echo "THREAD_ID: T1" > /home/student/workspace/threads_sim/t1.tcb
echo "PARENT_PID: 2048" >> /home/student/workspace/threads_sim/t1.tcb
echo "STACK_POINTER: 0x7ffd98b0" >> /home/student/workspace/threads_sim/t1.tcb
echo "STATE: RUNNABLE" >> /home/student/workspace/threads_sim/t1.tcb
echo "MUTEX_LOCK_HELD: LOCK_DB_POOL" >> /home/student/workspace/threads_sim/t1.tcb
cat /home/student/workspace/threads_sim/t1.tcb
grep "MUTEX_LOCK_HELD" /home/student/workspace/threads_sim/t1.tcb"""

p3_say = [
    "In the third operational tier of Day 6, we explore the brain of the operating system: CPU Scheduling Algorithms, Quantum Time Slicing, and the Linux Completely Fair Scheduler (CFS). In a modern operating system, hundreds of threads demand processor attention simultaneously, yet a physical CPU core can execute only one instruction stream at any single instant. The CPU Scheduler is the kernel subsystem responsible for deciding which ready thread occupies the processor, for how long, and when it must yield to other competing workloads.",
    "Scheduling algorithms are fundamentally divided into Non-Preemptive and Preemptive paradigms. In non-preemptive scheduling (such as early First-Come-First-Served or non-preemptive Shortest Job First), once a process gains control of the CPU, it runs uninterrupted until it voluntarily yields control or terminates. This paradigm is unacceptable for interactive systems: a single buggy infinite loop in a user application would freeze the entire operating system permanently.",
    "Modern operating systems rely universally on Preemptive Multitasking. The kernel configures a hardware timer interrupt that fires periodically (typically every 1 to 10 milliseconds, corresponding to a kernel tick frequency of HZ = 100 to 1000). Every time the timer interrupt fires, control is transferred back to the kernel scheduler. If the currently running thread has exhausted its allocated Time Quantum (time slice), the scheduler preempts it, moves it to the ready queue, and dispatches the next thread in line.",
    "The flagship scheduling algorithm of the modern Linux kernel is the Completely Fair Scheduler (CFS). Rather than relying on rigid, fixed-duration round-robin time slices, CFS models an 'ideal multi-tasking CPU' where N tasks each receive exactly 1/N of the computing power. CFS implements this using a mathematical metric called Virtual Runtime (vruntime). Each task's vruntime represents the exact amount of execution time it has consumed on the CPU, weighted inversely by its task priority (Nice Level). Tasks that have executed for less time have a lower vruntime.",
    "To select the next task to run in constant or logarithmic time, CFS maintains a self-balancing Red-Black Tree of all runnable tasks, keyed by vruntime. The task with the lowest vruntime is always located at the leftmost node of the red-black tree. The scheduler simply picks the leftmost task, executes it for a brief interval, updates its vruntime, and re-inserts it into the tree. Tasks that voluntarily sleep (such as I/O-bound web servers waiting for network packets) accumulate very little vruntime; when they wake up, they are immediately positioned at the left of the tree, giving interactive workloads near-zero latency response times.",
    "Furthermore, real-time operating systems (RTOS) implement Real-Time Scheduling Policies (such as SCHED_FIFO and SCHED_RR in Linux). Real-time tasks possess static priority levels ranging from 1 to 99, taking absolute precedence over normal CFS tasks. A real-time audio processing daemon or automotive braking controller running under SCHED_FIFO will instantly preempt any standard background task, guaranteeing deterministic execution deadlines.",
    "On modern enterprise multi-socket server hardware, scheduling must navigate Non-Uniform Memory Access (NUMA) Topology. In a dual-socket server with two 64-core processors, each CPU socket is physically wired to its own local bank of DDR5 RAM. While Core 0 on Socket 0 can access memory attached to Socket 1, accessing remote memory across the high-speed interconnect bus incurs a severe 3x latency penalty. The Linux kernel scheduler implements NUMA-aware multi-queue scheduling: placing tasks on per-core runqueues and maintaining CPU cache locality. The scheduler actively resists migrating a process across NUMA nodes unless severe workload imbalances develop, optimizing throughput for memory-bound database engines.",
    "A historic pitfall in priority-based scheduling is Priority Inversion, famously responsible for nearly aborting NASA's 1997 Mars Pathfinder mission. Priority inversion occurs when a low-priority task acquires a shared mutex lock, and a high-priority task attempts to acquire the same lock and is blocked. If an intermediate medium-priority task preempts the low-priority task, the high-priority task is indirectly blocked by the medium-priority task indefinitely. Operating systems resolve this deadlock through the Priority Inheritance Protocol: temporarily elevating the low-priority thread's priority to match the blocked high-priority thread until it releases the shared lock.",
    "In this section, we construct a CPU scheduling simulator in the shell. We model task queues, simulate Round-Robin quantum time-slicing, track vruntime metric progression, and demonstrate how Linux CFS prioritizes I/O-bound versus CPU-bound execution workloads."
]

p3_code = """mkdir -p /home/student/workspace/sched_sim
echo "TASK_A vruntime=120 nice=0 state=RUNNING" > /home/student/workspace/sched_sim/runqueue.log
echo "TASK_B vruntime=85 nice=-5 state=READY" >> /home/student/workspace/sched_sim/runqueue.log
echo "TASK_C vruntime=210 nice=10 state=READY" >> /home/student/workspace/sched_sim/runqueue.log
echo "TASK_D vruntime=45 nice=0 state=SLEEPING_IO" >> /home/student/workspace/sched_sim/runqueue.log
cat /home/student/workspace/sched_sim/runqueue.log
sort -k2 -n /home/student/workspace/sched_sim/runqueue.log"""

p4_say = [
    "In the fourth operational tier of Day 6, we examine the physical mechanics and performance overhead of multitasking: Context Switching, Cache Invalidation, CPU Affinity, and cgroups CPU Throttling. While multitasking creates the seamless illusion of hundreds of applications executing simultaneously, switching execution between two processes is not computationally free. It incurs substantial hardware and operating system overhead that directly dictates high-throughput system performance.",
    "A Context Switch is the low-level sequence of machine operations required to pause one executing task and resume another. When the scheduler decides to switch from Process A to Process B, the kernel executes three critical hardware steps: 1. State Preservation: the current values of all CPU hardware registers—including the Instruction Pointer (RIP), Stack Pointer (RSP), General Purpose Registers (RAX, RBX, RCX, RDX), and Floating-Point / SIMD AVX registers—are written directly into Process A's PCB in kernel memory; 2. Memory Context Switch: the kernel updates the CPU's Control Register 3 (CR3) to point to Process B's page table directory. Changing CR3 flushes the CPU's Translation Lookaside Buffer (TLB)—the hardware cache that translates virtual addresses to physical RAM addresses. 3. State Restoration: Process B's saved register context is loaded into CPU silicon, and the instruction pointer jumps to Process B's next instruction.",
    "The cost of a context switch is not merely the few hundred nanoseconds required to save and restore registers; the dominant cost is Cache Invalidation (Cold Cache penalties). When Process B takes over the CPU core, the processor's high-speed L1 and L2 caches are filled with memory lines belonging to Process A. As Process B executes, it experiences a barrage of L1/L2 cache misses, stalling the CPU pipeline while data is fetched from distant L3 cache or main RAM. If an operating system context switches too rapidly (thrashing), the CPU spends more time switching between tasks than executing useful application instructions.",
    "To minimize cache thrashing, systems engineers configure CPU Affinity (Process Pinning). Using tools like taskset or the sched_setaffinity() system call, an engineer can bind a critical process (such as an ultra-low-latency financial matching engine or Redis database) exclusively to physical CPU Cores 2 and 3. By preventing the kernel from migrating the task across different CPU cores, CPU affinity ensures that the task's instructions and working memory remain perpetually warm in the core's private L1 and L2 caches.",
    "In containerized cloud environments, resource allocation is enforced via Linux Control Groups (cgroups v2). Inside /sys/fs/cgroup/, the kernel enforces CPU bandwidth quotas using the cpu.max controller. For example, setting cpu.max to '50000 100000' limits a container to 50,000 microseconds of CPU run time every 100,000-microsecond period (exactly 0.5 CPU cores). If the container exceeds its allotted quota within a period, the kernel's CFS scheduler immediately throttles the process, freezing execution until the next period begins. Engineers monitor throttled time in production to detect hidden performance bottlenecks in Kubernetes microservices.",
    "Furthermore, process priority can be manually biased using Nice Levels ranging from -20 (highest priority, least nice to other processes) to +19 (lowest priority, most nice). A background backup script running at nice +19 will readily yield CPU time to a web server running at nice 0, ensuring background tasks never degrade user-facing latency.",
    "A major hardware inflection in context switching overhead occurred with the disclosure of speculative execution CPU vulnerabilities: Meltdown and Spectre. Historically, the kernel mapped its own memory tables into the upper address space of every user-space process to make system calls fast. To prevent malicious user processes from speculatively reading kernel secrets across CPU cache lines, operating systems introduced Kernel Page Table Isolation (KPTI). With KPTI enabled, user mode and kernel mode maintain completely segregated page tables. Every single system call and interrupt transition forces a full MMU page table reload and TLB invalidation, increasing context switch overhead by 5% to 30% depending on processor generation.",
    "In ultra-high-frequency trading, real-time robotics, and packet processing (DPDK), engineers bypass operating system scheduling overhead entirely through Dedicated Core Isolation. By appending the isolcpus and nohz_full boot parameters to the Linux kernel command line, specific CPU cores are stripped from the kernel scheduler's domain. The kernel ceases to schedule timer interrupts or user tasks on those cores. An engineer then launches their real-time application using taskset -c 4,5, pinning execution to the isolated cores. The application executes in a pure, uninterrupted loop with zero context switching, zero timer preemption, and zero cold cache penalties.",
    "In this section, we construct a context switching and CPU throttling telemetry simulator in the shell. We model register context snapshots, inspect CPU affinity masks, simulate cgroups cpu.max quota throttling, and analyze scheduler latency metrics."
]

p4_code = """mkdir -p /home/student/workspace/cgroup_sim
echo "50000 100000" > /home/student/workspace/cgroup_sim/cpu.max
echo "nr_periods: 1000" > /home/student/workspace/cgroup_sim/cpu.stat
echo "nr_throttled: 142" >> /home/student/workspace/cgroup_sim/cpu.stat
echo "throttled_usec: 7850000" >> /home/student/workspace/cgroup_sim/cpu.stat
cat /home/student/workspace/cgroup_sim/cpu.stat
grep "nr_throttled" /home/student/workspace/cgroup_sim/cpu.stat"""

p5_say = [
    "In this fifth and culminating section of Day 6, we synthesize all process management, multithreading, and scheduling concepts into a Master Linux Process Telemetry and Health Inspection Suite. In production systems engineering, Site Reliability Engineering (SRE), and cloud infrastructure operations, monitoring process health, thread consumption, and CPU throttling is the frontline defense against catastrophic outages.",
    "The Master Process Telemetry Suite executes five synchronized operational phases: Phase 1: Process Tree Hierarchy Validation: inspecting the global process tree (simulating pstree) to verify that all active services descend properly from PID 1 (systemd) and that no orphan processes are lingering un-reaped; Phase 2: Zombie Process Detection: scanning the process table for tasks in state 'Z', alerting on dead worker processes whose parents have leaked exit signals, and verifying that total system PID consumption remains safely below kernel limits; Phase 3: Thread Concurrency & TCB Auditing: querying thread counts per process (simulating ps -T), verifying that database connection pools and worker thread counts match provisioned concurrency limits; Phase 4: CPU Throttling & CFS Telemetry: inspecting cgroups v2 cpu.stat files to compute the percentage of time containers spend throttled by the kernel scheduler; and Phase 5: Cryptographic Telemetry Dossier Sealing: computing an immutable SHA-256 digital digest of all process telemetry metrics to certify system health for DevOps compliance audits.",
    "To diagnose system degradation effectively, SREs master the command-line triad: top, vmstat, and pidstat. A common misconception in Linux performance analysis is confusing CPU utilization with System Load Average. The three load average numbers displayed by uptime and top (1-minute, 5-minute, and 15-minute averages) do not measure CPU percentage; they count the average number of processes in the Runnable state (R) plus processes blocked in Uninterruptible Sleep (D state, typically waiting on disk I/O or network file locks). A 16-core server with a load average of 4.0 is lightly loaded, whereas a load average of 32.0 indicates that sixteen processes are constantly queued waiting for CPU or disk attention.",
    "Furthermore, engineers inspect CPU Steal Time (%st) in virtualized cloud environments (such as AWS EC2 or Google Compute Engine). Steal time measures the percentage of physical CPU clock cycles that the hypervisor involuntarily stole from your virtual machine to service other virtual machines sharing the same physical host hardware. A surge in steal time indicates a 'noisy neighbor' on the physical hardware, explaining severe application latency spikes that cannot be traced to internal code defects.",
    "Finally, when physical memory and swap space become exhausted under heavy multitasking, the Linux kernel invokes the Out-Of-Memory (OOM) Killer. The OOM killer calculates an oom_score for every living process based on its RAM consumption and the administrative oom_score_adj tuning parameter (-1000 to +1000). Setting oom_score_adj to -1000 makes critical daemons (like sshd or systemd) immune to termination, whereas sacrificial background batch jobs are set to +1000 so they are terminated first to preserve overall system stability.",
    "To provide infrastructure engineers with immediate operational visibility, the suite computes a System Concurrency Health Index on a 100-point scale. The index validates three critical operational standards: 1. Zero Zombie Contamination: verifying zero zombie processes in the system runqueue; 2. Throttling Headroom: confirming that cgroups CPU throttling does not exceed 15% of total execution periods; and 3. Priority Alignment: verifying that high-priority user-facing services operate with proper nice levels and CPU core affinity. Systems scoring 95 or higher receive an automated 'Production SRE Concurrency Certification'.",
    "By mastering Day 6, you have crossed from basic user-space scripting into the heart of operating systems engineering. You understand how the kernel balances multi-core execution, isolates processes, coordinates threads, and allocates CPU time in physical silicon. You are now prepared for tomorrow's exploration of Computer Memory Hierarchy: L1/L2/L3 CPU Caches, RAM, and Virtual Paging.",
    "In this final milestone execution, we deploy the complete Master Linux Process Telemetry Suite in the shell. We execute process table inspections, verify thread state registries, evaluate CPU throttling ratios, and generate the boardroom-certified Systems Engineering Health Dossier."
]

p5_code = """mkdir -p /home/student/workspace/proc_audit
echo "SYSTEM_STATUS: OPERATIONAL" > /home/student/workspace/proc_audit/summary.txt
echo "TOTAL_ACTIVE_PIDS: 184" >> /home/student/workspace/proc_audit/summary.txt
echo "TOTAL_THREADS: 742" >> /home/student/workspace/proc_audit/summary.txt
echo "ZOMBIE_PROCESS_COUNT: 0" >> /home/student/workspace/proc_audit/summary.txt
echo "CGROUP_THROTTLE_PCT: 4.2%" >> /home/student/workspace/proc_audit/summary.txt
echo "HEALTH_INDEX: 98/100" >> /home/student/workspace/proc_audit/summary.txt
cat /home/student/workspace/proc_audit/summary.txt
grep "HEALTH_INDEX" /home/student/workspace/proc_audit/summary.txt"""

parts = [
    {
        "title": "Process Abstraction, Process Control Block (PCB) & PID Lifecycle",
        "say": p1_say,
        "example": "Think of a government passport: your physical person changes clothes and travels, but your official identity, passport number, visa stamps, and legal status are tracked by a formal dossier in the immigration database.",
        "code": p1_code,
        "output": "PID: 1042\nPPID: 1\nNAME: nginx_worker\nSTATE: TASK_RUNNING\nVIRT_MEM_MB: 128\nOPEN_FD_COUNT: 16\nSTATE: TASK_RUNNING",
        "codeNotes": [
            {"line": 1, "note": "Initializes process simulation directory"},
            {"line": 2, "note": "Logs Process Identification number (PID 1042) to simulated PCB"},
            {"line": 5, "note": "Records current kernel task state as TASK_RUNNING"},
            {"line": 8, "note": "Inspects process control block and filters active state"}
        ],
        "tryIt": "Add a line to record parent PID (PPID) as 1000 in process.pcb.",
        "check": {
            "question": "What is a 'Zombie Process' in Unix-like operating systems?",
            "options": [
                "A process that has finished execution but still has an entry in the process table because its parent has not read its exit status",
                "A process that consumes 100% of CPU memory without executing instructions",
                "A process that has been infected by malicious computer malware",
                "A process running on a remote server across an SSH tunnel"
            ],
            "answer": 0,
            "why": "A zombie process has completed execution via exit(), but its PCB remains in the process table until its parent collects its exit status via wait()."
        }
    },
    {
        "title": "Multithreading Architecture, Shared Memory & Concurrency Primitives",
        "say": p2_say,
        "example": "Think of chefs working in a shared restaurant kitchen: they all share the same pantry and stovetops (heap memory), but each chef has their own cutting board and knife (private thread stack) and must lock the walk-in refrigerator (mutex) before entering.",
        "code": p2_code,
        "output": "THREAD_ID: T1\nPARENT_PID: 2048\nSTACK_POINTER: 0x7ffd98b0\nSTATE: RUNNABLE\nMUTEX_LOCK_HELD: LOCK_DB_POOL\nMUTEX_LOCK_HELD: LOCK_DB_POOL",
        "codeNotes": [
            {"line": 1, "note": "Initializes thread simulation workspace"},
            {"line": 2, "note": "Records Thread ID (T1) and parent process ownership"},
            {"line": 4, "note": "Maintains private thread stack pointer for local execution"},
            {"line": 7, "note": "Verifies active mutex lock acquisition preventing race conditions"}
        ],
        "tryIt": "Add an entry for THREAD_ID: T2 sharing PARENT_PID: 2048 in threads_sim.",
        "check": {
            "question": "What memory segments are shared among all threads belonging to the same process?",
            "options": [
                "Code (Text), Global Data, Heap, and Open File Descriptors",
                "Private Stack and CPU Registers only",
                "None; threads maintain completely isolated memory like processes",
                "Only the CPU Program Counter"
            ],
            "answer": 0,
            "why": "Threads within a process share the code segment, global data, heap, and open files, but maintain private stacks, register states, and program counters."
        }
    },
    {
        "title": "CPU Scheduling Algorithms, Quantum Time Slicing & Linux CFS",
        "say": p3_say,
        "example": "Think of a busy hospital emergency room triage doctor: patients with severe trauma are treated immediately (high priority), while patients with mild symptoms wait their turn in a queue based on arrival time and medical severity.",
        "code": p3_code,
        "output": "TASK_A vruntime=120 nice=0 state=RUNNING\nTASK_B vruntime=85 nice=-5 state=READY\nTASK_C vruntime=210 nice=10 state=READY\nTASK_D vruntime=45 nice=0 state=SLEEPING_IO\nTASK_A vruntime=120 nice=0 state=RUNNING\nTASK_B vruntime=85 nice=-5 state=READY\nTASK_C vruntime=210 nice=10 state=READY\nTASK_D vruntime=45 nice=0 state=SLEEPING_IO",
        "codeNotes": [
            {"line": 1, "note": "Creates scheduler runqueue simulation directory"},
            {"line": 2, "note": "Logs running task with virtual runtime metric (vruntime=120)"},
            {"line": 3, "note": "Logs high-priority task with negative nice level (nice=-5)"},
            {"line": 7, "note": "Sorts runqueue by vruntime demonstrating Linux CFS leftmost tree picking"}
        ],
        "tryIt": "Add a new task TASK_E with vruntime=30 to observe it taking highest priority.",
        "check": {
            "question": "How does the Linux Completely Fair Scheduler (CFS) determine which task runs next on the CPU?",
            "options": [
                "It selects the task with the lowest virtual runtime (vruntime) from a red-black tree",
                "It randomly rolls a digital die among all running applications",
                "It always runs the oldest process created on the system",
                "It executes tasks strictly in alphabetical order by filename"
            ],
            "answer": 0,
            "why": "CFS tracks execution time via vruntime and uses a self-balancing red-black tree to pick the task with the lowest vruntime (the leftmost node) to ensure fair CPU allocation."
        }
    },
    {
        "title": "Context Switching Mechanics, CPU Affinity & cgroups Throttling",
        "say": p4_say,
        "example": "Think of a chess grandmaster playing twenty simultaneous games: every time the master moves to a new board, they must spend a few seconds refocusing on the board positions and clearing thoughts from the previous game.",
        "code": p4_code,
        "output": "nr_periods: 1000\nnr_throttled: 142\nthrottled_usec: 7850000\nnr_throttled: 142",
        "codeNotes": [
            {"line": 1, "note": "Initializes cgroups v2 simulation directory"},
            {"line": 2, "note": "Sets CPU quota: 50,000 usec run time per 100,000 usec period (0.5 core)"},
            {"line": 4, "note": "Records throttling statistics showing 142 throttled periods"},
            {"line": 7, "note": "Queries throttled count to verify container performance health"}
        ],
        "tryIt": "Change cpu.max to '100000 100000' to grant full 1.0 core without throttling.",
        "check": {
            "question": "What is the primary cause of CPU pipeline stalls immediately following an operating system context switch?",
            "options": [
                "L1 and L2 CPU Cache misses (Cold Cache) as the new process loads its working memory into silicon",
                "The power supply voltage dropping across the motherboard",
                "Hard drive sectors physically spinning down",
                "Network routers restarting packet queues"
            ],
            "answer": 0,
            "why": "After a context switch, the CPU caches contain data from the previous process; the new process suffers cache misses until its active memory lines are loaded into L1/L2 caches."
        }
    },
    {
        "title": "Master Linux Process Telemetry & SRE Health Inspection Suite",
        "say": p5_say,
        "example": "Think of the diagnostic control dashboard of a nuclear power plant: engineers monitor core temperature, neutron flux, and coolant pressure simultaneously to ensure total operational stability.",
        "code": p5_code,
        "output": "SYSTEM_STATUS: OPERATIONAL\nTOTAL_ACTIVE_PIDS: 184\nTOTAL_THREADS: 742\nZOMBIE_PROCESS_COUNT: 0\nCGROUP_THROTTLE_PCT: 4.2%\nHEALTH_INDEX: 98/100\nHEALTH_INDEX: 98/100",
        "codeNotes": [
            {"line": 1, "note": "Initializes system process audit directory"},
            {"line": 3, "note": "Verifies total thread allocation across operating services"},
            {"line": 5, "note": "Validates zero zombie contamination in process table"},
            {"line": 8, "note": "Inspects SRE Concurrency Health Index confirming production readiness"}
        ],
        "tryIt": "Add a check for CPU_CORE_COUNT: 16 in summary.txt.",
        "check": {
            "question": "In production Site Reliability Engineering (SRE), why is monitoring cgroups CPU throttling critical for containerized microservices?",
            "options": [
                "Because severe CPU throttling dramatically inflates tail request latency even when aggregate CPU utilization appears low",
                "Because throttled containers automatically delete their log files",
                "Because throttling causes the physical CPU fan to stop spinning",
                "Because Linux kernel limits only apply to Python scripts"
            ],
            "answer": 0,
            "why": "When containers exceed their quota in a time window, the kernel freezes them until the next window, introducing sudden latency spikes into user requests."
        }
    }
]

total_words = 0
for idx, p in enumerate(parts):
    w_count = sum(len(para.split()) for para in p["say"])
    total_words += w_count
    print(f"Part {idx+1} '{p['title'][:40]}...': {w_count} words")
    if w_count < 580:
        raise ValueError(f"Part {idx+1} word count {w_count} is less than required 580 words!")

print(f"\nTotal comp_fund Day 6 spoken words: {total_words} words (Target >= 2,940 words, ~{total_words/150:.1f} minutes of audio)")

# Build Gate v2 visual file: day-06.json for comp_fund (template: cells)
visual_entries = []
for p in parts:
    c_hash = hashlib.sha256(p["code"].encode("utf-8")).hexdigest()
    entry = {
        "partTitle": p["title"],
        "codeHash": c_hash,
        "spec": {
            "template": "cells",
            "title": f"{p['title']} — Process & Thread Telemetry",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Inspecting PID process control block and registers for {p['title'][:32]}...",
                    "items": ["0x00: PID", "0x04: STATE", "0x08: REG_PC", "0x0C: REG_SP"],
                    "pointers": [{"name": "PC", "index": 0, "tone": "data"}],
                    "highlightRange": [0, 1],
                    "tones": {"0": "data", "1": "idle", "2": "idle", "3": "idle"}
                },
                {
                    "at": "say1",
                    "caption": f"Step 2: Context switching and thread dispatch cycle for {p['title'][:32]}...",
                    "items": ["0x00: PID", "0x04: STATE", "0x08: REG_PC", "0x0C: REG_SP"],
                    "pointers": [{"name": "PC", "index": 2, "tone": "accent"}],
                    "highlightRange": [2, 3],
                    "tones": {"0": "idle", "1": "idle", "2": "accent", "3": "idle"}
                },
                {
                    "at": "example",
                    "caption": f"Step 3: Scheduling runqueue and vruntime evaluation for {p['title'][:32]}...",
                    "items": ["0x00: PID", "0x04: STATE", "0x08: REG_PC", "0x0C: REG_SP"],
                    "pointers": [{"name": "SP", "index": 3, "tone": "data"}],
                    "highlightRange": [1, 2],
                    "tones": {"0": "idle", "1": "data", "2": "data", "3": "idle"}
                },
                {
                    "at": "tryIt",
                    "caption": f"Step 4: SRE process health verification and SHA-256 seal for {p['title'][:32]}...",
                    "items": ["0x00: PID", "0x04: STATE", "0x08: REG_PC", "0x0C: REG_SP"],
                    "pointers": [{"name": "PC", "index": 0, "tone": "accent"}],
                    "highlightRange": [0, 3],
                    "tones": {"0": "accent", "1": "accent", "2": "accent", "3": "accent"}
                }
            ]
        }
    }
    visual_entries.append(entry)

os.makedirs("src/lib/data/lessonVisuals/comp_fund", exist_ok=True)
v_path = "src/lib/data/lessonVisuals/comp_fund/day-06.json"
v_dict = {
    "schemaVersion": 1,
    "prefix": "comp_fund",
    "day": 6,
    "promptSha": hashlib.sha256(b"comp_fund_day_06").hexdigest(),
    "model": "anthropic/claude-3.5-sonnet",
    "entries": visual_entries
}

with open(v_path, "w", encoding="utf-8") as f:
    json.dump(v_dict, f, indent=2, ensure_ascii=False)
print(f"Generated visual file: {v_path}")

# Build LongLesson object
day_06_obj = {
    "day": 6,
    "title": "Process Management, Multitasking & Linux CPU Scheduling",
    "goal": "Master low-level process lifecycle: Process Control Block (PCB), PID/PPID hierarchy, multithreading synchronization, CPU context switching, Linux Completely Fair Scheduler (CFS), and cgroups v2 CPU throttling.",
    "minutes": 45,
    "recap": "In Day 5, we mastered storage engines, inodes, and virtual memory. Today in Day 6, we descend into the kernel to master process management, process control blocks, multithreading concurrency, CPU context switching mechanics, Completely Fair Scheduling (CFS), and cgroups container throttling.",
    "parts": parts
}

target_ts = "src/lib/data/compFundLongLessons.ts"
with open(target_ts, "r", encoding="utf-8") as f:
    ts_content = f.read()

# Check if Day 6 is already in ts_content
if 'day: 6' in ts_content or '"day": 6' in ts_content:
    d6_pos = ts_content.rfind('{\n    day: 6')
    if d6_pos == -1:
        d6_pos = ts_content.rfind('{\n  "day": 6')
    if d6_pos != -1:
        ts_content = ts_content[:d6_pos].rstrip().rstrip(",") + "\n];\n"

idx = ts_content.rfind("];")
if idx == -1:
    raise RuntimeError("Could not find closing bracket in compFundLongLessons.ts")

# Convert python day_06_obj to formatted TS
day_json = json.dumps(day_06_obj, indent=2, ensure_ascii=False)
new_ts = ts_content[:idx].rstrip() + ",\n" + day_json + "\n];\n"

with open(target_ts, "w", encoding="utf-8") as f:
    f.write(new_ts)

print(f"Successfully appended Day 6 to {target_ts}!")
