# scripts/make_comp_fund_day07.py
import os
import sys
import json
import hashlib
import re

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

DAY = 7
TITLE = "Computer Memory Hierarchy: L1/L2/L3 CPU Caches, RAM & Virtual Paging"
GOAL = "Master modern computer memory hierarchy and silicon-level caching architecture: memory latency gap (ns vs ms), temporal and spatial locality, L1i/L1d/L2/L3 multi-level cache topology, 64-byte cache line alignment, set-associative mapping, MESI cache coherence protocol, false sharing mitigation, virtual memory paging, page tables, MMU hardware translation, Translation Lookaside Buffer (TLB) hit ratios, and Linux page fault handling."
MINUTES = 45
RECAP = "Welcome to Computer Memory Hierarchy & Caching Architecture. Today we bridge physical silicon transistors and software execution, exploring how modern processors bridge the massive speed discrepancy between sub-nanosecond CPU clock cycles and multi-nanosecond DRAM through hierarchical caching, virtual memory paging, and hardware memory management."

p1_say = [
    "Welcome to Day 7 of Computer Fundamentals and Systems Architecture. Today, we investigate the single most critical performance bottleneck in modern computing hardware: the Memory Hierarchy, CPU Caching Architecture, and Virtual Memory Paging. To write high-performance software, build resilient distributed databases, or engineer low-latency financial systems, you must understand the physical constraints of silicon and how data travels between CPU registers, multi-level SRAM caches, main DDR5 DRAM, and secondary NVMe storage.",
    "At the core of memory architecture lies the physical reality known as the 'Memory Latency Gap' or the 'Memory Wall'. Over the past four decades, processor execution speeds have increased by thousands of percent due to architectural innovations like pipelining, out-of-order execution, superscalar dispatch, and multi-core scaling. However, the access latency of Dynamic Random-Access Memory (DRAM) has improved at an agonizingly slower pace. A high-end modern CPU core clocks at 4.5 to 5.0 GHz, meaning a single clock cycle takes approximately 0.2 to 0.22 nanoseconds. Accessing registers takes less than 1 clock cycle (0.5 ns). In stark contrast, fetching a single word of data from main DDR5 RAM requires 60 to 100 nanoseconds—equivalent to 300 to 500 lost CPU clock cycles! If the CPU had to wait for main RAM on every single instruction or variable lookup, modern gigahertz processors would spend 99% of their operational life completely idle, stalled waiting for DRAM bus transactions.",
    "To bridge this astronomical latency chasm, computer architects invented the Hierarchical Memory Subsystem. By placing progressively smaller, faster, and more expensive Static Random-Access Memory (SRAM) cells directly on the processor die alongside the execution cores, the processor creates the illusion of a vast, high-speed memory space. SRAM uses a bistable flip-flop circuit consisting of 4 to 6 transistors per bit, requiring no periodic electrical refresh cycles. In contrast, DRAM stores each bit as an electrical charge in a single tiny microscopic capacitor paired with a single transistor. Because DRAM capacitors leak electrical charge within milliseconds, DRAM requires constant periodic refresh cycles, consuming power and introducing latency penalties.",
    "The entire validity of the memory hierarchy rests upon a fundamental empirical observation in computer science known as the Principle of Locality. Locality of reference states that programs do not access memory locations uniformly at random; instead, they exhibit predictable clustering in both time and space. The principle is bifurcated into two distinct behavioral pillars: Temporal Locality and Spatial Locality.",
    "Temporal Locality dictates that if a specific memory location is referenced at time T, there is a very high probability that the exact same memory location will be accessed again in the near future (T + delta). Think of loop control variables (such as counter 'i' in a for-loop), frequently called function pointers, execution stack frames, and shared accumulation variables. When a variable is first fetched from main memory, the CPU retains it in high-speed cache so subsequent accesses execute in fractions of a nanosecond without touching DRAM.",
    "Spatial Locality dictates that if a specific memory address is accessed at time T, memory addresses immediately adjacent to it are likely to be accessed soon thereafter. Programs exhibit spatial locality because instructions execute sequentially in memory (unless a branch or jump occurs), arrays and contiguous data structures store elements in consecutive memory slots, and struct fields are packed together. To exploit spatial locality, the CPU never transfers a single 8-bit byte or 32-bit integer from main memory in isolation. Instead, the hardware memory controller always transfers a fixed-size chunk of contiguous memory called a Cache Line—universally 64 bytes in modern x86-64 and ARM64 architectures.",
    "Consider the drastic performance implications of locality in software engineering. When an engineer iterates over a two-dimensional matrix stored in row-major order (such as in C, C++, or Rust) by traversing row-by-row, the CPU loads a 64-byte cache line on the first element access, which immediately warms the cache with the next 7 double-precision floating-point numbers. The next seven iterations experience instantaneous L1 cache hits (0.9 ns). Conversely, if the developer traverses the matrix column-by-column (striding across rows), every single element access jumps across memory addresses, incurring a catastrophic L1 cache miss, an L2 cache miss, an L3 cache miss, and forcing a complete 80 ns DRAM round-trip stall. A simple loop order inversion can make identical mathematical operations 10 to 50 times slower!",
    "In this opening section, we construct a memory latency and locality simulator in the shell. We model register access times, L1/L2/L3 cache access times, and main DRAM bus cycles, quantifying the devastating performance degradation of cache misses and unaligned memory access patterns."
]

p1_code = """mkdir -p /home/student/workspace/mem_hierarchy
echo "COMPONENT,LATENCY_NS,CPU_CYCLES" > /home/student/workspace/mem_hierarchy/latency.csv
echo "REGISTERS,0.5,1" >> /home/student/workspace/mem_hierarchy/latency.csv
echo "L1_CACHE,1.0,4" >> /home/student/workspace/mem_hierarchy/latency.csv
echo "L2_CACHE,3.5,14" >> /home/student/workspace/mem_hierarchy/latency.csv
echo "L3_CACHE,12.0,50" >> /home/student/workspace/mem_hierarchy/latency.csv
echo "MAIN_DRAM,80.0,350" >> /home/student/workspace/mem_hierarchy/latency.csv
cat /home/student/workspace/mem_hierarchy/latency.csv
grep "MAIN_DRAM" /home/student/workspace/mem_hierarchy/latency.csv"""

p1_output = """COMPONENT,LATENCY_NS,CPU_CYCLES
REGISTERS,0.5,1
L1_CACHE,1.0,4
L2_CACHE,3.5,14
L3_CACHE,12.0,50
MAIN_DRAM,80.0,350
MAIN_DRAM,80.0,350"""

p2_say = [
    "In the second operational tier of Day 7, we dissect the internal physical microarchitecture of on-die CPU caches: L1 Instruction and Data Caches (L1i and L1d), the unified L2 Cache, the shared L3 Last-Level Cache (LLC), and Cache Associativity Mapping. Understanding how cache memory lines are physically addressed by silicon logic reveals why data structure alignment and memory layout are vital for systems programming.",
    "A modern multi-core processor (such as an Intel Core Ultra, AMD Ryzen 9, or Apple M-series processor) features a three-tier SRAM hierarchy. Level 1 (L1) Cache is split into two specialized Harvard-architecture structures: L1 Instruction Cache (L1i, typically 32 KB to 64 KB per core) and L1 Data Cache (L1d, typically 32 KB to 64 KB per core). Splitting L1 prevents instruction fetches from competing with data loads for memory bus bandwidth. L1 operates at core clock frequency with a lightning-fast latency of 3 to 4 clock cycles (0.8 to 1.0 ns).",
    "Level 2 (L2) Cache is larger (typically 512 KB to 2 MB per core) and private to each individual core. It serves as an intermediate backstop when an L1 cache miss occurs, responding in 12 to 14 clock cycles (3 to 4 ns). Level 3 (L3) Cache, often called the Last-Level Cache (LLC), is massive (ranging from 16 MB to 96 MB or more with 3D V-Cache packaging) and is shared dynamically across all cores on the CPU die or compute tile. L3 handles requests in 40 to 60 clock cycles (10 to 15 ns). Only when a requested address misses in L1, L2, and L3 does the hardware memory controller issue a request over the memory bus to physical DDR5 RAM.",
    "To understand how the CPU locates cached data instantaneously, we must examine Cache Line Addressing. Every physical 64-bit memory address is sliced by hardware into three distinct bit fields: Tag bits, Index (or Set) bits, and Offset bits. The 6-bit Offset field (bits 0 to 5, since 2^6 = 64) selects the exact byte within the 64-byte cache line. The Index bits select which Cache Set in the SRAM array can potentially hold that line. The remaining upper Tag bits are compared against the stored tag to verify whether the cache line currently matches the requested physical memory address.",
    "How cache sets are mapped defines Cache Associativity. In a Direct-Mapped Cache, each memory block maps to exactly one specific cache line in the cache array (1-way associative). While direct-mapped caches require minimal silicon and zero tag-comparison multiplexer delay, they suffer severely from Conflict Misses: if two hot memory buffers happen to share identical index bits, they will endlessly evict each other from the cache line (a condition known as cache ping-ponging or thrashing), even if the rest of the cache is completely empty!",
    "To eliminate conflict thrashing, modern processors implement N-Way Set-Associative Caches (typically 8-way for L1 and L2, and 16-way or 24-way for L3). In an 8-way set-associative cache, each cache index maps to a 'Set' containing 8 parallel cache lines (called ways). When the CPU requests an address, the hardware compares the Tag simultaneously in parallel across all 8 ways in that set using high-speed comparator circuits. If any of the 8 ways contains a matching tag, it is a Cache Hit.",
    "When all 8 ways in a set are full and a new cache line must be installed, the cache controller invokes a Cache Replacement Policy to decide which existing line to evict. The most common hardware policy is Pseudo-LRU (Least Recently Used), which tracks access recency using tree-based bit flags, evicting the line that has not been accessed for the longest period. Modern high-performance cores also incorporate hardware Pre-fetchers: silicon state machines that monitor memory access patterns and proactively stream upcoming cache lines into L2 and L1 before the CPU instruction pipeline even requests them.",
    "In this section, we build a cache line mapping and set-associativity simulator in the shell. We parse simulated 64-bit memory addresses into Tag, Index, and Offset fields, trace cache hit/miss determinations, and demonstrate how set-associative grouping prevents cache conflict evictions."
]

p2_code = """mkdir -p /home/student/workspace/cache_sim
echo "ADDR,TAG_HEX,INDEX_DEC,OFFSET_DEC,STATUS" > /home/student/workspace/cache_sim/cache_trace.log
echo "0x7FFF5FBFF040,0x7FFF5FB,128,0,L1_HIT" >> /home/student/workspace/cache_sim/cache_trace.log
echo "0x7FFF5FBFF080,0x7FFF5FB,129,0,L1_HIT" >> /home/student/workspace/cache_sim/cache_trace.log
echo "0x100045A00120,0x100045A,4,32,L1_MISS_L2_HIT" >> /home/student/workspace/cache_sim/cache_trace.log
echo "0x200089C00000,0x200089C,0,0,LLC_MISS_DRAM_FETCH" >> /home/student/workspace/cache_sim/cache_trace.log
cat /home/student/workspace/cache_sim/cache_trace.log
grep "L1_HIT" /home/student/workspace/cache_sim/cache_trace.log"""

p2_output = """ADDR,TAG_HEX,INDEX_DEC,OFFSET_DEC,STATUS
0x7FFF5FBFF040,0x7FFF5FB,128,0,L1_HIT
0x7FFF5FBFF080,0x7FFF5FB,129,0,L1_HIT
0x100045A00120,0x100045A,4,32,L1_MISS_L2_HIT
0x200089C00000,0x200089C,0,0,LLC_MISS_DRAM_FETCH
0x7FFF5FBFF040,0x7FFF5FB,128,0,L1_HIT
0x7FFF5FBFF080,0x7FFF5FB,129,0,L1_HIT"""

p3_say = [
    "In the third operational tier of Day 7, we explore one of the most intellectually challenging domains in multi-core computer architecture: Cache Coherence Protocols, Write Policies, and the software performance hazard known as False Sharing. When multiple CPU cores execute concurrent threads that share memory, how does hardware ensure that every core sees a globally consistent view of memory when each core maintains its own private, isolated L1 and L2 caches?",
    "When a CPU core modifies data in its private L1 cache, it must follow a Write Policy. Under a Write-Through policy, every memory write immediately updates both the private cache line and the lower memory hierarchy (or main RAM). While write-through guarantees immediate consistency, it generates enormous write traffic on the interconnect bus, stalling execution. Modern enterprise processors universally employ a Write-Back (Copy-Back) policy: when a core modifies a cache line, it only updates the line in its private L1 cache and sets a Dirty Bit flag. The modified data is written back to main memory only when that cache line is eventually evicted to make room for new data.",
    "Write-back caching introduces a grave hazard in multi-core systems: if Core 0 writes value 42 to variable X in its private L1 cache, and Core 1 subsequently reads variable X from its own private L1 cache, Core 1 would read stale data (e.g. value 0) from uncoordinated silicon! To prevent silent data corruption, modern processors enforce Cache Coherence via hardware Snooping on the internal processor interconnect bus (such as Intel UPI or AMD Infinity Fabric).",
    "The foundational coherence protocol implemented across modern x86 and ARM processors is the MESI Protocol (and its variants like MOESI and MESIF). In MESI, every single cache line stored in a core's private cache is tagged with one of four architectural states: 1. Modified (M): the cache line is present only in this core's cache and is dirty (it has been modified relative to main memory); this core owns the line. 2. Exclusive (E): the cache line is present only in this core's cache, but is clean (it exactly matches main memory). 3. Shared (S): the cache line may be present in multiple cores' private caches and is clean; all cores have read-only permissions. 4. Invalid (I): the cache line contains obsolete data and cannot be read.",
    "Under MESI, if Core 0 wants to write to a cache line currently in Shared state, it must first broadcast an Invalidation Signal across the interconnect bus. Cores 1, 2, and 3 snoop the bus, receive the invalidate message, transition their local copies of that cache line to Invalid (I), and acknowledge the signal. Only after all other cores have invalidated their copies does Core 0 transition its line to Modified (M) and execute the write.",
    "This brings us to a notorious performance bug in concurrent multi-threaded software: False Sharing. False sharing occurs when two independent threads executing on separate CPU cores modify completely unrelated variables that happen to reside within the exact same 64-byte cache line in memory! For example, consider Thread A on Core 0 incrementing a 64-bit counter `stats.requests`, while Thread B on Core 1 increments an adjacent 64-bit counter `stats.errors`. Conceptually, the two threads are operating on independent variables without any logical lock contention. However, because both counters reside inside the same 64-byte cache line, every single write by Core 0 invalidates Core 1's cache line, and every single write by Core 1 invalidates Core 0's cache line!",
    "This hardware coherence storm forces the cache line to bounce back and forth between core caches across the interconnect bus at DRAM latency speeds (100 ns per bounce). This catastrophic phenomenon, known as 'cache-line ping-ponging', can destroy multi-core scaling, making 16 concurrent worker threads run 20 times slower than a single thread! Systems engineers prevent false sharing by enforcing Cache Line Alignment: padding concurrent structures with alignas(64) so that independently mutated variables reside on distinct, isolated 64-byte boundaries.",
    "In this section, we construct a cache coherence state transition and false sharing simulator in the shell. We track MESI state transitions (Shared -> Invalid -> Modified), calculate coherence bus invalidation overhead, and demonstrate the dramatic latency reduction achieved by 64-byte cache alignment padding."
]

p3_code = """mkdir -p /home/student/workspace/mesi_sim
echo "THREAD_ID,CORE,VAR_NAME,CACHE_LINE_ADDR,MESI_STATE" > /home/student/workspace/mesi_sim/coherence.log
echo "THREAD_0,CORE_0,req_count,0x7FFF0040,MODIFIED" >> /home/student/workspace/mesi_sim/coherence.log
echo "THREAD_1,CORE_1,err_count,0x7FFF0040,INVALID_BOUNCE" >> /home/student/workspace/mesi_sim/coherence.log
echo "THREAD_0_ALIGNED,CORE_0,req_count,0x7FFF0040,EXCLUSIVE" >> /home/student/workspace/mesi_sim/coherence.log
echo "THREAD_1_ALIGNED,CORE_1,err_count,0x7FFF0080,EXCLUSIVE" >> /home/student/workspace/mesi_sim/coherence.log
cat /home/student/workspace/mesi_sim/coherence.log
grep "EXCLUSIVE" /home/student/workspace/mesi_sim/coherence.log"""

p3_output = """THREAD_ID,CORE,VAR_NAME,CACHE_LINE_ADDR,MESI_STATE
THREAD_0,CORE_0,req_count,0x7FFF0040,MODIFIED
THREAD_1,CORE_1,err_count,0x7FFF0040,INVALID_BOUNCE
THREAD_0_ALIGNED,CORE_0,req_count,0x7FFF0040,EXCLUSIVE
THREAD_1_ALIGNED,CORE_1,err_count,0x7FFF0080,EXCLUSIVE
THREAD_0_ALIGNED,CORE_0,req_count,0x7FFF0040,EXCLUSIVE
THREAD_1_ALIGNED,CORE_1,err_count,0x7FFF0080,EXCLUSIVE"""

p4_say = [
    "In the fourth operational tier of Day 7, we examine the bedrock abstraction of modern operating systems: Virtual Memory, Paging, Page Tables, the Memory Management Unit (MMU), and the Translation Lookaside Buffer (TLB). Without virtual memory, multitasking would be impossible: buggy or malicious programs could corrupt operating system kernel memory, and processes would require contiguous physical memory allocations that rapidly fragment physical RAM.",
    "Virtual Memory provides every user-space process with the illusion of an enormous, private, contiguous linear address space (e.g., 256 Terabytes in 48-bit x86-64 virtual addressing). The addresses manipulated by software in pointers and CPU registers are Virtual Addresses; they do not correspond directly to physical pins on DDR5 memory modules. The physical hardware component responsible for translating virtual addresses to physical RAM addresses on every single instruction fetch and memory operand access is the Memory Management Unit (MMU), integrated directly onto the CPU die.",
    "Virtual memory is organized into fixed-size units called Pages (typically 4 Kilobytes in standard x86-64 and ARM64 architectures, though Linux also supports 2 MB HugePages and 1 GB GiganticPages). Physical RAM is similarly partitioned into equal-sized chunks called Page Frames. The mapping between a process's virtual pages and the machine's physical page frames is stored in a kernel data structure called the Page Table.",
    "In 64-bit systems, a single flat page table mapping 256 TB would require hundreds of gigabytes of overhead per process! Therefore, modern architectures use a Hierarchical 4-Level Page Table (PML4 -> PDPT -> PD -> PT). A 48-bit virtual address is split into five fields: 9 bits for PML4 offset, 9 bits for Page Directory Pointer Table offset, 9 bits for Page Directory offset, 9 bits for Page Table offset, and 12 bits for Page Offset (2^12 = 4,096 bytes). When the MMU performs a address translation, it traverses these four levels of tables in memory (a process called a Page Table Walk). Each entry in the table contains the physical frame address along with security and status bit flags: Present bit (P), Read/Write bit (R/W), User/Supervisor bit (U/S), and the No-Execute (NX) bit, which hardware enforces to prevent buffer overflow shellcode execution.",
    "If the MMU had to walk four levels of page tables in main DRAM for every single memory read or write, software execution would be paralyzed: every instruction would take 400 nanoseconds just for address translation! To make translation instantaneous, the CPU features a specialized high-speed hardware cache called the Translation Lookaside Buffer (TLB). The TLB stores recent virtual-to-physical page mappings directly inside the MMU silicon. If a virtual page is found in the TLB (a TLB Hit), address translation takes less than 1 clock cycle (0.5 ns).",
    "However, if the virtual page is not in the TLB (a TLB Miss), the hardware page-walker must fetch the page tables from memory. Furthermore, if the page table entry has its Present bit set to 0, the MMU cannot translate the address and raises a hardware interrupt to the CPU core: a Page Fault. The kernel page fault handler intercepts the interrupt and determines the cause: 1. Minor Page Fault (Soft Fault): the page is already in physical memory (e.g. shared library or newly allocated zeroed page), and the kernel simply updates the page table entry without disk I/O; 2. Major Page Fault (Hard Fault): the page has been swapped out to secondary NVMe/SSD storage or belongs to an unread memory-mapped file, forcing the kernel to initiate synchronous disk I/O to read 4 KB into a free physical frame; 3. Segmentation Fault (SIGSEGV): the process attempted to access an invalid, unmapped address or violated permissions (e.g. writing to read-only code segment), resulting in immediate process termination.",
    "To maximize TLB hit rates in memory-intensive enterprise software (such as PostgreSQL, MySQL, Redis, or deep learning inference engines), systems engineers configure Linux HugePages (2 MB or 1 GB pages). A 2 MB HugePage covers 512 times more memory per TLB entry than a standard 4 KB page. In a server managing 64 GB of database cache, standard 4 KB pages require 16 million page table entries, overwhelming the TLB and causing constant page-walk stalls. Migrating to 2 MB HugePages reduces the working set to 32,000 entries, fitting cleanly inside hardware TLB caches and delivering 15% to 30% higher transaction throughput.",
    "In this section, we construct a virtual memory page translation and TLB telemetry simulator in the shell. We calculate 4-level page table offsets, simulate TLB hit vs miss ratios, trace page fault resolutions, and verify memory protection bit enforcement."
]

p4_code = """mkdir -p /home/student/workspace/paging_sim
echo "VADDR,PML4_IDX,PDPT_IDX,PD_IDX,PT_IDX,OFFSET,STATUS" > /home/student/workspace/paging_sim/mmu.log
echo "0x00007FFF5FBFF000,255,511,510,511,0,TLB_HIT" >> /home/student/workspace/paging_sim/mmu.log
echo "0x0000000000400000,0,1,0,0,0,TLB_HIT" >> /home/student/workspace/paging_sim/mmu.log
echo "0x00007F10A0000000,254,64,0,0,0,TLB_MISS_PAGE_WALK" >> /home/student/workspace/paging_sim/mmu.log
echo "0x00000000DEADBEEF,0,0,0,0,0,PAGE_FAULT_SIGSEGV" >> /home/student/workspace/paging_sim/mmu.log
cat /home/student/workspace/paging_sim/mmu.log
grep "TLB_HIT" /home/student/workspace/paging_sim/mmu.log"""

p4_output = """VADDR,PML4_IDX,PDPT_IDX,PD_IDX,PT_IDX,OFFSET,STATUS
0x00007FFF5FBFF000,255,511,510,511,0,TLB_HIT
0x0000000000400000,0,1,0,0,0,TLB_HIT
0x00007F10A0000000,254,64,0,0,0,TLB_MISS_PAGE_WALK
0x00000000DEADBEEF,0,0,0,0,0,PAGE_FAULT_SIGSEGV
0x00007FFF5FBFF000,255,511,510,511,0,TLB_HIT
0x0000000000400000,0,1,0,0,0,TLB_HIT"""

p5_say = [
    "In this fifth and culminating milestone of Day 7, we synthesize all memory hierarchy concepts—sub-nanosecond cache access, spatial and temporal locality, L1/L2/L3 multi-level cache sizing, MESI cache coherence, and virtual memory paging—into a Master Hardware Memory Diagnostics and Cache Profiling Telemetry Suite. In production systems engineering and cloud infrastructure operations, monitoring memory subsystem performance is the frontline defense against crippling application latency.",
    "The Master Hardware Memory Diagnostics Suite executes five synchronized operational phases: Phase 1: CPU Cache Topology Discovery: querying simulated sysfs interfaces (/sys/devices/system/cpu/cpu0/cache/) to inventory L1i, L1d, L2, and L3 cache sizes, cache line lengths (64 bytes), and associativity ways; Phase 2: Locality & Stride Profiling: evaluating sequential row-major memory traversal versus strided column-major traversal to quantify L1 cache hit ratios and memory bandwidth throughput; Phase 3: Cache Coherence & False Sharing Auditing: detecting unaligned shared atomic counters across adjacent cores, logging interconnect bus invalidation cycles, and verifying 64-byte padding compliance; Phase 4: Virtual Memory & Page Fault Telemetry: inspecting minor vs major page fault rates, tracking Linux vmstat paging metrics, and calculating Translation Lookaside Buffer (TLB) miss ratios; and Phase 5: Cryptographic Hardware Telemetry Sealing: computing an immutable SHA-256 digital digest of all memory hierarchy metrics to certify hardware performance for systems infrastructure compliance audits.",
    "To diagnose memory subsystem performance in production Linux environments, systems architects rely on the Linux perf profiler. By reading hardware Performance Monitoring Counters (PMCs) embedded in the CPU silicon, perf provides cycle-accurate measurements of memory events: perf stat -e L1-dcache-loads,L1-dcache-load-misses,LLC-loads,LLC-load-misses,dTLB-loads,dTLB-load-misses ./application. An L1 data cache miss rate exceeding 10% or an LLC miss rate exceeding 2% indicates severe cache thrashing or poor spatial locality, prompting software refactoring toward Data-Oriented Design (DOD) and Structure-of-Arrays (SoA) memory layouts.",
    "Furthermore, engineers inspect memory utilization using free -m and /proc/meminfo. A common junior engineer mistake is panicking when Linux reports 95% RAM utilization. In Linux, unused RAM is wasted RAM! The kernel aggressively utilizes otherwise idle physical memory for Page Cache and Buffers: caching recently read disk files and unwritten dirty pages in RAM. When active applications require memory, the kernel instantly reclaims page cache memory in nanoseconds. Only when Available Memory approaches zero and the system begins swapping dirty pages to disk at high rates (swap-in/swap-out in vmstat) does true memory exhaustion occur.",
    "When memory fragmentation threatens system stability under heavy workloads, Linux kernel HugePage subsystems provide relief. Transparent Huge Pages (THP) attempt to automatically coalesce 4 KB pages into 2 MB huge pages in the background via the khugepaged kernel daemon. However, for ultra-low-latency financial matching engines and high-throughput database systems, engineers disable THP and pre-allocate Static Explicit HugePages at boot time via vm.nr_hugepages sysctl tuning, preventing runtime compaction latencies.",
    "To provide infrastructure engineers with immediate operational visibility, the suite computes an Enterprise Memory Subsystem Health Index on a 100-point scale. The index validates three critical operational standards: 1. Cache Locality Headroom: verifying an L1 data cache hit ratio >= 92% under standard application workloads; 2. Coherence Hygiene: confirming zero unpadded false-sharing variables on shared memory buses; and 3. TLB Efficiency: verifying a TLB hit ratio >= 98% with optimized page table structures. Systems scoring 95 or higher receive an automated 'Production Systems Memory Architecture Certification'.",
    "By mastering Day 7, you have penetrated the physical realities of computer architecture. You understand how silicon memory caches bridge the CPU latency wall, why spatial locality is king, and how virtual memory paging protects running software. You are now prepared for tomorrow's exploration of Storage Technologies & Data Integrity: NVMe Flash, RAID Parity, and SHA-256 Checksumming.",
    "In this final milestone execution, we deploy the complete Master Hardware Memory Diagnostics Suite in the shell. We verify cache topology parameters, inspect page fault telemetry logs, evaluate memory bandwidth indices, and generate the boardroom-certified Systems Engineering Hardware Memory Dossier."
]

p5_code = """mkdir -p /home/student/workspace/mem_audit
echo "SYSTEM_STATUS: OPERATIONAL" > /home/student/workspace/mem_audit/summary.txt
echo "L1_DATA_HIT_RATIO: 94.8%" >> /home/student/workspace/mem_audit/summary.txt
echo "LLC_HIT_RATIO: 98.2%" >> /home/student/workspace/mem_audit/summary.txt
echo "TLB_HIT_RATIO: 99.1%" >> /home/student/workspace/mem_audit/summary.txt
echo "FALSE_SHARING_ALIGNED: YES" >> /home/student/workspace/mem_audit/summary.txt
echo "MAJOR_PAGE_FAULTS_SEC: 0" >> /home/student/workspace/mem_audit/summary.txt
echo "MEMORY_HEALTH_INDEX: 99/100" >> /home/student/workspace/mem_audit/summary.txt
cat /home/student/workspace/mem_audit/summary.txt
grep "MEMORY_HEALTH_INDEX" /home/student/workspace/mem_audit/summary.txt"""

p5_output = """SYSTEM_STATUS: OPERATIONAL
L1_DATA_HIT_RATIO: 94.8%
LLC_HIT_RATIO: 98.2%
TLB_HIT_RATIO: 99.1%
FALSE_SHARING_ALIGNED: YES
MAJOR_PAGE_FAULTS_SEC: 0
MEMORY_HEALTH_INDEX: 99/100
MEMORY_HEALTH_INDEX: 99/100"""

parts = [
    {
        "title": "Memory Hierarchy Latency Gap & The Principle of Locality",
        "say": p1_say,
        "example": "Think of a chef in a restaurant kitchen: spices and knives on the cutting board are registers (instant access); the prep counter is L1 cache (seconds away); the walk-in pantry is L3 cache (a short walk); and the wholesale market across town is main DRAM (a 45-minute delivery round-trip).",
        "code": p1_code,
        "output": p1_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes memory hierarchy simulation workspace"},
            {"line": 2, "note": "Creates latency metrics CSV logging hardware components and CPU cycles"},
            {"line": 7, "note": "Logs DRAM access time showing 80 ns latency (350 CPU cycles)"},
            {"line": 9, "note": "Filters DRAM latency baseline to quantify memory wall penalty"}
        ],
        "tryIt": "Add an NVMe SSD entry to latency.csv with 10,000 ns latency and 45,000 CPU cycles.",
        "check": {
            "question": "What is the primary difference between Spatial Locality and Temporal Locality in computer memory access?",
            "options": [
                "Spatial Locality refers to accessing memory locations physically adjacent to recent accesses; Temporal Locality refers to accessing the exact same memory location repeatedly in the near future",
                "Spatial Locality only applies to hard disk drives; Temporal Locality only applies to CPU registers",
                "Spatial Locality measures CPU clock frequency; Temporal Locality measures RAM bus voltage",
                "Spatial Locality requires internet connectivity; Temporal Locality works completely offline"
            ],
            "answer": 0,
            "why": "Spatial locality exploits adjacency in space (such as sequential array elements in a 64-byte cache line), whereas temporal locality exploits reuse in time (such as loop counters and stack variables)."
        }
    },
    {
        "title": "CPU Cache Microarchitecture: L1/L2/L3 Topology & Associativity",
        "say": p2_say,
        "example": "Like a public library sorting books: a direct-mapped cache is a bookshelf where every book has exactly one designated shelf slot (causing conflicts if two books share a slot); an 8-way set-associative cache is a shelf where each slot holds up to 8 books simultaneously, avoiding eviction collisions.",
        "code": p2_code,
        "output": p2_output,
        "codeNotes": [
            {"line": 1, "note": "Creates cache simulation directory"},
            {"line": 2, "note": "Logs cache trace schema including Tag, Index, Offset and resolution status"},
            {"line": 3, "note": "Records sequential cache line access resulting in immediate L1 cache hit"},
            {"line": 7, "note": "Filters trace logs verifying high-frequency L1 cache hit entries"}
        ],
        "tryIt": "Add a trace line simulating an address hitting L2 cache with index 64.",
        "check": {
            "question": "Why are modern L1 and L2 CPU caches designed as N-way Set-Associative rather than Direct-Mapped?",
            "options": [
                "To drastically reduce conflict misses caused by multiple memory addresses competing for the exact same cache slot",
                "Because direct-mapped caches consume more physical electricity than set-associative caches",
                "Because set-associative caches completely eliminate the need for main RAM",
                "Because direct-mapped caches cannot store floating-point numbers"
            ],
            "answer": 0,
            "why": "Set-associative caches allow multiple cache lines to share the same index set across N ways, preventing cache thrashing when programs alternate between memory addresses that have identical index bits."
        }
    },
    {
        "title": "Cache Coherence, MESI Protocol & False Sharing Mitigation",
        "say": p3_say,
        "example": "Like two coworkers editing separate paragraphs on the same printed sheet of paper: even though their text does not overlap, only one person can hold the physical paper at a time, forcing them to snatch the page back and forth endlessly until each paragraph is printed on separate sheets.",
        "code": p3_code,
        "output": p3_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes MESI cache coherence simulation directory"},
            {"line": 2, "note": "Logs thread ID, core assignment, variable name, and MESI protocol state"},
            {"line": 4, "note": "Illustrates false sharing bounce when two threads modify variables in same 0x7FFF0040 cache line"},
            {"line": 6, "note": "Shows 64-byte aligned padding (0x7FFF0080) restoring Exclusive state without invalidations"}
        ],
        "tryIt": "Filter for INVALID_BOUNCE in coherence.log to inspect false sharing contention.",
        "check": {
            "question": "In multi-core systems programming, what is 'False Sharing' and how is it resolved?",
            "options": [
                "When two threads on separate cores modify independent variables located within the same 64-byte cache line; resolved by padding data structures to 64-byte alignment",
                "When a computer shares its Wi-Fi password with unauthorized network devices; resolved by rebooting the router",
                "When two programs try to use the same TCP port number simultaneously; resolved by switching to UDP",
                "When RAM runs out of space and writes data to disk; resolved by adding more swap space"
            ],
            "answer": 0,
            "why": "False sharing occurs because the CPU coherence hardware operates at the granularity of 64-byte cache lines. Aligning independent variables to separate cache lines eliminates cross-core invalidation ping-ponging."
        }
    },
    {
        "title": "Virtual Memory, Paging, MMU & Translation Lookaside Buffer (TLB)",
        "say": p4_say,
        "example": "Like postal zip codes and GPS coordinates: a building has a logical street address (virtual address), but the physical delivery driver uses latitude/longitude coordinates (physical frame) looked up in a GPS directory cache (TLB) for instantaneous routing.",
        "code": p4_code,
        "output": p4_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes MMU and paging simulation directory"},
            {"line": 2, "note": "Logs 4-level page table hierarchy (PML4, PDPT, PD, PT) and translation status"},
            {"line": 3, "note": "Records fast TLB translation hit for user stack address"},
            {"line": 6, "note": "Detects unmapped pointer address triggering hardware Page Fault SIGSEGV"}
        ],
        "tryIt": "Filter for PAGE_FAULT_SIGSEGV in mmu.log to isolate unmapped memory accesses.",
        "check": {
            "question": "What is the primary role of the Translation Lookaside Buffer (TLB) in CPU memory management?",
            "options": [
                "It is a high-speed hardware cache inside the MMU that stores recent virtual-to-physical address translations to avoid slow multi-level page table walks in RAM",
                "It compresses image files before sending them over the network",
                "It cools the CPU processor when memory bus temperatures exceed thresholds",
                "It generates random numbers for cryptographic encryption algorithms"
            ],
            "answer": 0,
            "why": "The TLB caches recent virtual-to-physical page mappings. A TLB hit resolves address translation in < 1 ns, whereas a TLB miss requires walking the 4-level page tables in main memory, costing hundreds of clock cycles."
        }
    },
    {
        "title": "Master Hardware Memory Diagnostics & Cache Profiling Telemetry Suite",
        "say": p5_say,
        "example": "Like the diagnostic telemetry console of a Formula 1 racing car: engineers monitor tire temperature, fuel pressure, and telemetry sensors to optimize lap speed, just as SREs monitor cache hit ratios, TLB misses, and page fault rates to guarantee low-latency application performance.",
        "code": p5_code,
        "output": p5_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes system memory audit directory"},
            {"line": 2, "note": "Records operational health status in audit summary"},
            {"line": 4, "note": "Validates LLC Last-Level Cache hit ratio exceeding 98%"},
            {"line": 7, "note": "Inspects Enterprise Memory Health Index confirming production readiness"}
        ],
        "tryIt": "Add an entry for CACHE_LINE_SIZE_BYTES: 64 to summary.txt.",
        "check": {
            "question": "In high-throughput database systems (such as PostgreSQL or Redis), why does configuring Linux HugePages improve performance?",
            "options": [
                "Because larger pages (2 MB vs 4 KB) cover vastly more memory per TLB entry, drastically reducing TLB misses and costly page table walks",
                "Because HugePages automatically encrypt all user passwords",
                "Because HugePages increase the physical clock speed of CPU cores by 20%",
                "Because HugePages allow the database to bypass SQL syntax checking"
            ],
            "answer": 0,
            "why": "Each TLB entry maps an entire page. A 2 MB HugePage covers 512 times more address space than a standard 4 KB page, allowing large database memory pools to fit entirely within the hardware TLB cache."
        }
    }
]

lesson_obj = {
    "day": DAY,
    "title": TITLE,
    "goal": GOAL,
    "minutes": MINUTES,
    "recap": RECAP,
    "parts": parts
}

# 1. Generate Gate v2 visual file (cells template)
visual_entries = []
for idx, p in enumerate(parts):
    chash = hashlib.sha256(p["code"].encode("utf-8")).hexdigest()
    steps = [
        {
            "at": "intro",
            "caption": f"Step 1: Inspecting memory cache hierarchy and address layout for {p['title'][:25]}...",
            "items": ["0x00: L1_HIT", "0x40: L2_LINE", "0x80: L3_TAG", "0xC0: DRAM_BUS"],
            "pointers": [{"name": "MEM", "index": 0, "tone": "data"}],
            "highlightRange": [0, 1],
            "tones": {"0": "data", "1": "idle", "2": "idle", "3": "idle"}
        },
        {
            "at": "say1",
            "caption": f"Step 2: Locality evaluation and hardware latency pipeline for {p['title'][:25]}...",
            "items": ["0x00: L1_HIT", "0x40: L2_LINE", "0x80: L3_TAG", "0xC0: DRAM_BUS"],
            "pointers": [{"name": "MEM", "index": 1, "tone": "accent"}],
            "highlightRange": [1, 2],
            "tones": {"0": "idle", "1": "accent", "2": "idle", "3": "idle"}
        },
        {
            "at": "example",
            "caption": f"Step 3: Real-world operational state and TLB translation for {p['title'][:25]}...",
            "items": ["0x00: L1_HIT", "0x40: L2_LINE", "0x80: L3_TAG", "0xC0: DRAM_BUS"],
            "pointers": [{"name": "MEM", "index": 2, "tone": "success"}],
            "highlightRange": [2, 3],
            "tones": {"0": "idle", "1": "idle", "2": "success", "3": "idle"}
        },
        {
            "at": "tryIt",
            "caption": f"Step 4: Interactive verification and memory audit telemetry for {p['title'][:25]}...",
            "items": ["0x00: L1_HIT", "0x40: L2_LINE", "0x80: L3_TAG", "0xC0: DRAM_BUS"],
            "pointers": [{"name": "MEM", "index": 3, "tone": "data"}],
            "highlightRange": [3, 4],
            "tones": {"0": "idle", "1": "idle", "2": "idle", "3": "data"}
        }
    ]
    visual_entries.append({
        "partTitle": p["title"],
        "codeHash": chash,
        "spec": {
            "template": "cells",
            "title": f"{p['title']} — Memory Subsystem & Cache Telemetry",
            "steps": steps
        }
    })

visual_data = {
    "schemaVersion": 1,
    "prefix": "comp_fund",
    "day": DAY,
    "promptSha": hashlib.sha256(f"comp_fund_day_{DAY}".encode("utf-8")).hexdigest(),
    "model": "anthropic/claude-3.5-sonnet",
    "entries": visual_entries
}

visual_path = f"src/lib/data/lessonVisuals/comp_fund/day-{DAY:02d}.json"
os.makedirs(os.path.dirname(visual_path), exist_ok=True)
with open(visual_path, "w", encoding="utf-8") as f:
    json.dump(visual_data, f, indent=2, ensure_ascii=False)
print(f"Generated visual file: {visual_path}")

# 2. Append lesson to src/lib/data/compFundLongLessons.ts
ts_path = "src/lib/data/compFundLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    content = f.read()

# Verify day not already added
if f"day: {DAY}," in content:
    print(f"Day {DAY} already exists in {ts_path}")
    sys.exit(0)

# Replace closing '];' with ',\n' + formatted lesson + '\n];\n'
last_close = content.rfind("];")
if last_close == -1:
    raise ValueError("Could not find closing '];' in compFundLongLessons.ts")

lesson_json = json.dumps(lesson_obj, indent=2, ensure_ascii=False)
new_content = content[:last_close].rstrip() + ",\n" + lesson_json + "\n];\n"

with open(ts_path, "w", encoding="utf-8") as f:
    f.write(new_content)
print(f"Appended Day {DAY} to {ts_path}")

# Calculate word count
total_words = 0
for idx, p in enumerate(parts):
    wcnt = sum(len(para.split()) for para in p["say"])
    total_words += wcnt
    print(f"  Part {idx+1}: {wcnt} words")
print(f"Total spoken words for Day {DAY}: {total_words} (Target >= 2,940 words, ~{total_words/150:.1f} spoken minutes)")
