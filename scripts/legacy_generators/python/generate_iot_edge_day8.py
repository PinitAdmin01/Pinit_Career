import json
import struct

# Day 8: TFLM Tensor Arena Memory Allocator & Offset Resolver
# Invariants:
# - 5 parts, >= 580 words per part in say (>= 2900 total words, >= 24 min audio)
# - minutes: 38
# - 4 options per check question, answer: 0, comprehensive why
# - runnable python code & realistic terminal output
# - line-by-line codeNotes & tryIt

day8 = {
    "coursePrefix": "iot_edge",
    "day": 8,
    "title": "TFLM Tensor Arena Memory Allocator & Offset Resolver",
    "goal": "Implement and verify the internal head-and-tail memory allocation algorithms of the TensorFlow Lite for Microcontrollers Tensor Arena to eliminate memory fragmentation on bare-metal systems.",
    "minutes": 38,
    "recap": "Yesterday on Day 7, we mastered the FlatBuffers binary schema, zero-copy pointer arithmetic, and the TFLM MicroInterpreter architecture. Today, we conquer the memory core of TFLM: the Tensor Arena allocator, bidirectional head-and-tail partitioning, and deterministic offset resolution.",
    "parts": [
        {
            "title": "The Architecture of the Contiguous Static Tensor Arena",
            "say": [
                "Welcome to Day Eight of Edge AI, DSP, and TinyML Systems. Today, we dive deep into the memory management engine of TensorFlow Lite for Microcontrollers: the Tensor Arena. In traditional desktop and mobile computing, applications rely on the operating system's virtual memory manager, paging tables, and runtime heaps to dynamically allocate, resize, and free memory buffers. On bare-metal microcontrollers running Cortex-M or RISC-V processors, these luxuries simply do not exist.",
                "In resource-constrained embedded systems, dynamic memory management via malloc() and free() is strictly forbidden in high-reliability and safety-critical environments. When memory is dynamically allocated and freed in unpredictable sequences, the heap becomes fragmented over time. Even if 40 kilobytes of total free memory remains, it may be shattered into hundreds of isolated 100-byte slivers, causing the next 2-kilobyte allocation request to fail catastrophically with an unrecoverable out-of-memory exception.",
                "To provide an ironclad mathematical guarantee against heap fragmentation, TFLM enforces a single, contiguous static memory pool: the Tensor Arena. As an embedded firmware engineer, you declare this pool at compile time as a statically allocated global or static byte array in C++: `constexpr int kTensorArenaSize = 64 * 1024; alignas(16) uint8_t tensor_arena[kTensorArenaSize];`. The microcontroller compiler places this array directly into the BSS segment in internal SRAM, guaranteeing that its physical memory boundaries are fixed and verified during firmware linking.",
                "The entire runtime lifecycle of TFLM—including internal interpreter scratchpads, operator execution nodes, tensor metadata descriptors, intermediate activation feature maps, and temporary scratchpad buffers—must fit completely inside this pre-allocated buffer. If the neural network graph fits within the Tensor Arena during the initial `AllocateTensors()` phase, it is mathematically guaranteed that inference will never run out of memory or fragment SRAM during runtime execution.",
                "In high-throughput industrial and medical appliances, this static predictability is the cornerstone of regulatory compliance. Certification bodies under IEC 61508 or ISO 26262 require verifiable proof of deterministic execution budgets. By encapsulating all runtime memory into an immutable, statically sized Tensor Arena, TFLM eliminates non-deterministic allocation latency and guarantees bounded execution time for every inference pass.",
                "Furthermore, declaring the arena with explicit 16-byte alignment (`alignas(16)`) ensures that the base address of the arena satisfies the strictest hardware requirements of 128-bit vector SIMD buses (such as ARM Helium MVE on Cortex-M55). Any internal tensor buffer offset calculated by the TFLM allocator naturally inherits this alignment baseline, preventing costly memory bus alignment faults during high-speed matrix multiplication."
            ],
            "example": "Think of booking an entire train car for an expedition rather than buying individual seats on random commuter trains. By reserving one contiguous car (the Tensor Arena) before departure, your entire crew and equipment have designated, collision-free spaces, and no outside passengers can take a seat and split up your team.",
            "code": """# TFLM Tensor Arena Static Declaration & Base Alignment Inspector
# Demonstrates contiguous static memory reservation and 16-byte SIMD alignment validation

class StaticTensorArena:
    def __init__(self, size_bytes: int, alignment: int = 16):
        self.total_size = size_bytes
        self.alignment = alignment
        # Simulate static contiguous BSS allocation
        self.raw_storage = bytearray(size_bytes + alignment)
        # Calculate aligned base address offset
        simulated_address = 0x20004003  # Simulated unaligned RAM start
        misalignment = simulated_address % alignment
        self.base_offset = (alignment - misalignment) if misalignment != 0 else 0
        self.aligned_address = simulated_address + self.base_offset

    def inspect_arena_layout(self) -> dict:
        return {
            "declared_capacity_bytes": self.total_size,
            "declared_capacity_kb": self.total_size / 1024,
            "simulated_raw_address": "0x20004003",
            "aligned_base_address": hex(self.aligned_address),
            "simd_16byte_aligned": (self.aligned_address % 16) == 0,
            "heap_fragmentation_risk": "ZERO (Static BSS Pool)"
        }

arena = StaticTensorArena(size_bytes=64 * 1024, alignment=16)
layout = arena.inspect_arena_layout()

print("=== TFLM STATIC TENSOR ARENA ALLOCATION ===")
for k, v in layout.items():
    print(f"{k:<26}: {v}")
print(f"Memory Allocation Model   : Single Contiguous BSS Segment")
print(f"Safety Verification Status : CERTIFIED (No Runtime malloc)")""",
            "output": """=== TFLM STATIC TENSOR ARENA ALLOCATION ===
declared_capacity_bytes   : 65536
declared_capacity_kb      : 64.0
simulated_raw_address     : 0x20004003
aligned_base_address      : 0x20004010
simd_16byte_aligned       : True
heap_fragmentation_risk   : ZERO (Static BSS Pool)
Memory Allocation Model   : Single Contiguous BSS Segment
Safety Verification Status : CERTIFIED (No Runtime malloc)""",
            "codeNotes": [
                "Line 4: StaticTensorArena models static compile-time BSS reservation without runtime heap allocation.",
                "Line 11: Calculates 16-byte alignment offset to ensure base pointer compliance with ARM SIMD buses.",
                "Line 24: Verifies zero heap fragmentation risk and deterministic memory placement."
            ],
            "tryIt": "Change alignment to 32 and observe how the aligned base address adjusts to a 32-byte cache line boundary.",
            "check": {
                "question": "Why does TensorFlow Lite for Microcontrollers mandate a single static Tensor Arena instead of using dynamic heap allocation (malloc/free)?",
                "options": [
                    "To permanently eliminate heap fragmentation and provide deterministic static memory guarantees for bare-metal safety compliance",
                    "Because microcontrollers do not have physical RAM chips installed on their circuit boards",
                    "To allow the microcontroller to automatically double its CPU clock frequency during inference",
                    "Because C++ compilers refuse to compile malloc() when building firmware for ARM processors"
                ],
                "answer": 0,
                "why": "Using a single static contiguous Tensor Arena prevents heap fragmentation, guarantees zero dynamic allocation during inference, and satisfies strict functional safety standards (IEC 61508 / ISO 26262)."
            }
        },
        {
            "title": "Bidirectional Head-and-Tail Memory Partitioning",
            "say": [
                "In Part Two, we examine the core allocation algorithm that makes the TFLM Tensor Arena so remarkably space-efficient: Bidirectional Head-and-Tail Partitioning.",
                "A naive memory allocator manages memory linearly from the bottom to the top. However, in neural network inference, runtime memory objects fall into two fundamentally distinct categories with completely different lifespans: Static Persistent Metadata and Transient Dynamic Activations.",
                "Persistent Metadata includes the interpreter's internal state, operator registration nodes (`TfLiteNode`), operator evaluation contexts (`TfLiteRegistration`), and tensor metadata descriptors (`TfLiteTensor`). These structs are allocated once during `AllocateTensors()` and must remain alive and immutable for the entire lifetime of the firmware application. Transient Activations, by contrast, are intermediate feature maps produced by convolutional layers that exist only for the duration of a few operator steps before being overwritten.",
                "If persistent structs and transient activation buffers were interleaved within a single linear allocator, the persistent structs would act as immovable barriers throughout the buffer. This would prevent large activation buffers from sharing memory, causing severe artificial fragmentation and tripling the required RAM footprint! TFLM solves this with an elegant bidirectional strategy: The Arena is divided into two pointers moving toward each other: The Head Pointer and The Tail Pointer.",
                "The Head Allocator starts at offset zero (the lowest memory address) and grows upward toward higher addresses. It is exclusively dedicated to persistent metadata structures, operator nodes, and static scratchpads. Once initialization completes, the Head Pointer freezes permanently at its high-water mark.",
                "The Tail Allocator starts at the very end of the Tensor Arena (the highest memory address) and grows downward toward lower addresses. It is dedicated exclusively to intermediate activation feature maps, input/output tensor buffers, and transient scratchpads. By separating persistent allocations at the Head and dynamic allocations at the Tail, the Tail allocator has an unobstructed, contiguous expanse of memory to perform complex lifespan-based buffer reuse and ping-pong scheduling.",
                "During initialization, TFLM continuously monitors the distance between the Head and Tail pointers. If the Head and Tail pointers ever collide (Head Address > Tail Address), the allocator detects an Arena Overflow, halts initialization safely, and reports the exact number of additional bytes required to fit the model."
            ],
            "example": "Think of packing a cargo ship with heavy cargo containers (persistent structures) and passenger luggage (transient activation bags). You load the heavy containers onto the ship's keel at the bow (the Head) where they remain stationary for the voyage. You stack the passenger luggage starting from the stern (the Tail). As long as the two piles do not collide in the middle of the hold, the ship is safely loaded.",
            "code": """# TFLM Bidirectional Head-and-Tail Arena Allocator Simulator
# Implements two-way pointer growth and collision detection

class BidirectionalArenaAllocator:
    def __init__(self, capacity_bytes: int):
        self.capacity = capacity_bytes
        self.head_offset = 0                 # Grows UPWARD from 0
        self.tail_offset = capacity_bytes    # Grows DOWNWARD from capacity
        self.head_allocations = []
        self.tail_allocations = []

    def allocate_head(self, name: str, size: int, align: int = 16) -> int:
        # Align upward
        rem = self.head_offset % align
        if rem != 0:
            self.head_offset += (align - rem)
        allocated_addr = self.head_offset
        self.head_offset += size
        
        if self.head_offset > self.tail_offset:
            raise MemoryError(f"Arena Overflow! Head collided with Tail. Deficit: {self.head_offset - self.tail_offset} bytes")
        self.head_allocations.append((name, allocated_addr, size))
        return allocated_addr

    def allocate_tail(self, name: str, size: int, align: int = 16) -> int:
        # Align downward
        new_tail = self.tail_offset - size
        new_tail -= (new_tail % align)
        if new_tail < self.head_offset:
            raise MemoryError(f"Arena Overflow! Tail collided with Head. Deficit: {self.head_offset - new_tail} bytes")
        self.tail_offset = new_tail
        self.tail_allocations.append((name, new_tail, size))
        return new_tail

    def get_watermark_report(self) -> dict:
        used_head = self.head_offset
        used_tail = self.capacity - self.tail_offset
        free_gap = self.tail_offset - self.head_offset
        return {
            "total_capacity": self.capacity,
            "head_persistent_used": used_head,
            "tail_activations_used": used_tail,
            "unallocated_free_gap": free_gap,
            "utilization_pct": round(((used_head + used_tail) / self.capacity) * 100, 2)
        }

allocator = BidirectionalArenaAllocator(capacity_bytes=32 * 1024)
# Persistent allocations at Head
allocator.allocate_head("InterpreterState", 512)
allocator.allocate_head("TfLiteNodesArray", 1024)
allocator.allocate_head("TfLiteTensorsArray", 2048)

# Dynamic activation buffers at Tail
allocator.allocate_tail("ActivationBufferA", 8192)
allocator.allocate_tail("ActivationBufferB", 8192)

report = allocator.get_watermark_report()
print("=== TFLM BIDIRECTIONAL ARENA WATERMARK REPORT ===")
for k, v in report.items():
    print(f"{k:<24}: {v}")
print(f"Safety Margin Gap Status: HEALTHY ({report['unallocated_free_gap']} Bytes Free)")""",
            "output": """=== TFLM BIDIRECTIONAL ARENA WATERMARK REPORT ===
total_capacity          : 32768
head_persistent_used    : 3584
tail_activations_used   : 16384
unallocated_free_gap    : 12800
utilization_pct         : 60.94
Safety Margin Gap Status: HEALTHY (12800 Bytes Free)""",
            "codeNotes": [
                "Line 5: head_offset tracks persistent metadata growing upward from 0.",
                "Line 6: tail_offset tracks transient activations growing downward from capacity.",
                "Line 24: Validates collision detection whenever head_offset exceeds tail_offset."
            ],
            "tryIt": "Increase ActivationBufferA to 25000 bytes and observe the descriptive MemoryError raised upon arena collision.",
            "check": {
                "question": "What is the primary benefit of TFLM's bidirectional Head-and-Tail memory allocation strategy?",
                "options": [
                    "It separates persistent metadata (at the Head) from transient activation feature maps (at the Tail), preventing fragmentation and maximizing contiguous space for tensor reuse",
                    "It allows two CPU cores to write to the same memory address simultaneously without bus arbitration",
                    "It automatically doubles the physical SRAM capacity by compressing bits in hardware",
                    "It stores the neural network weights inside the CPU register file instead of Flash"
                ],
                "answer": 0,
                "why": "Separating persistent metadata at the Head from transient activation buffers at the Tail prevents permanent structs from fragmenting the buffer space, leaving a large contiguous region at the Tail for dynamic buffer reuse."
            }
        },
        {
            "title": "Tensor Offset Resolution & Pointer Binding",
            "say": [
                "In Part Three, we investigate the mathematical process of Tensor Offset Resolution. How does a high-level tensor index in a FlatBuffer graph transform into a concrete, executable memory pointer on bare-metal hardware?",
                "In the FlatBuffers schema, tensors are referenced purely by logical indices: Tensor 0, Tensor 1, Tensor 2, and so forth. During model compilation and conversion, the FlatBuffer contains information about data types, shapes, and quantization scale factors, but contains zero physical memory addresses. Memory addresses cannot be assigned at compile time because the compiler does not know where the firmware linker or operating system will place the Tensor Arena in physical SRAM.",
                "During `AllocateTensors()`, the TFLM `MicroAllocator` iterates through all tensors in the model graph. For each tensor that represents an activation feature map (tensors whose buffer index is 0), the allocator calculates a relative byte offset within the arena: `tensor_offset_bytes`.",
                "Once all offsets are resolved, the allocator performs Pointer Binding: it computes the absolute physical memory pointer by adding the relative offset to the arena base pointer: `uint8_t* physical_ptr = arena_base_ptr + tensor_offset_bytes;`. This physical pointer is written directly into the tensor descriptor's `data.data` field: `tensor->data.uint8 = physical_ptr;`.",
                "Because pointer binding happens once during initialization, the operator execution kernels during `Invoke()` do not spend a single CPU cycle querying memory allocators, traversing hash tables, or adding base offsets! The C++ operator implementation simply accesses `tensor->data.int8` directly as a raw array. This direct pointer dereference achieves pure C-level execution speed, ensuring that every cycle of the microcontroller's CPU is dedicated to SIMD multiply-accumulate arithmetic.",
                "We will implement a Python simulator that models this exact two-phase lifecycle: first, calculating relative tensor offsets based on layer activation dimensions; second, binding those offsets to simulated physical MCU memory addresses."
            ],
            "example": "Think of assigning locker numbers in a gymnasium. During orientation, students are assigned relative locker numbers (Locker #1, Locker #12, Locker #45). When they arrive at the gym (initialization), they find Locker Bay B (the arena base address). Student #12 simply walks to Bay B + Locker 12. During workouts (inference), they open their locker instantly without asking the front desk where their locker is located.",
            "code": """# TFLM Tensor Offset Resolver & Physical Pointer Binding Simulator
# Translates logical tensor indices into relative offsets and bound physical addresses

class TensorDescriptor:
    def __init__(self, tensor_id: int, name: str, shape: list, dtype_bytes: int):
        self.tensor_id = tensor_id
        self.name = name
        self.shape = shape
        self.dtype_bytes = dtype_bytes
        self.byte_size = 1
        for dim in shape:
            self.byte_size *= dim
        self.byte_size *= dtype_bytes
        self.relative_offset = None
        self.bound_physical_address = None

class MicroOffsetResolver:
    def __init__(self, arena_base_address: int):
        self.arena_base = arena_base_address
        self.current_offset = 0

    def resolve_and_bind(self, tensor: TensorDescriptor, align: int = 16):
        # Enforce 16-byte alignment on relative offset
        rem = self.current_offset % align
        if rem != 0:
            self.current_offset += (align - rem)
        
        tensor.relative_offset = self.current_offset
        tensor.bound_physical_address = self.arena_base + self.current_offset
        self.current_offset += tensor.byte_size

# Simulate MCU SRAM placement
MCU_SRAM_ARENA_BASE = 0x20008000
resolver = MicroOffsetResolver(MCU_SRAM_ARENA_BASE)

tensors = [
    TensorDescriptor(0, "input_spectrogram", [1, 32, 32, 1], 1),   # 1024 Bytes INT8
    TensorDescriptor(1, "conv1_output",      [1, 16, 16, 8], 1),   # 2048 Bytes INT8
    TensorDescriptor(2, "conv2_output",      [1, 8, 8, 16],  1),   # 1024 Bytes INT8
    TensorDescriptor(3, "dense_logits",      [1, 5],         1)    # 5 Bytes INT8
]

for t in tensors:
    resolver.resolve_and_bind(t, align=16)

print("=== TFLM TENSOR OFFSET RESOLUTION & POINTER BINDING ===")
print(f"{'ID':<4} {'Tensor Name':<20} {'Size':<10} {'Rel Offset':<12} {'Physical Bound Addr':<20}")
print("-" * 70)
for t in tensors:
    print(f"{t.tensor_id:<4} {t.name:<20} {t.byte_size:<10} {hex(t.relative_offset):<12} {hex(t.bound_physical_address):<20}")
print(f"Total Arena Memory Bound: {resolver.current_offset} Bytes")""",
            "output": """=== TFLM TENSOR OFFSET RESOLUTION & POINTER BINDING ===
ID   Tensor Name          Size       Rel Offset   Physical Bound Addr 
----------------------------------------------------------------------
0    input_spectrogram    1024       0x0          0x20008000          
1    conv1_output         2048       0x400        0x20008400          
2    conv2_output         1024       0xc00        0x20008c00          
3    dense_logits         5          0x1000       0x20009000          
Total Arena Memory Bound: 4101 Bytes""",
            "codeNotes": [
                "Line 6: Calculates exact tensor byte footprint from multi-dimensional shape and element byte width.",
                "Line 21: Aligns relative offsets to 16-byte boundaries for vector SIMD compatibility.",
                "Line 26: Computes the final bound physical memory pointer by adding the relative offset to arena_base."
            ],
            "tryIt": "Verify that every physical bound address is divisible by 16 (hex ends in 0).",
            "check": {
                "question": "When does TensorFlow Lite for Microcontrollers bind physical memory pointers to tensor data structures?",
                "options": [
                    "Once during the initial AllocateTensors() phase, eliminating runtime pointer calculation overhead during inference",
                    "Continuously on every single multiply-accumulate operation during inference",
                    "Never; TFLM accesses tensors via HTTP REST requests to a cloud database",
                    "Only when the microcontroller enters low-power sleep mode"
                ],
                "answer": 0,
                "why": "Physical pointer binding is performed once during initialization (AllocateTensors()), allowing the operator kernels during Invoke() to dereference memory pointers directly with zero overhead."
            }
        },
        {
            "title": "Greedy Memory Planner & Tensor Lifetime Overlaying",
            "say": [
                "In Part Four, we tackle the mathematical optimization algorithm that allows complex deep neural networks to fit into tiny microcontrollers: Greedy Memory Planning and Lifetime Overlaying.",
                "If we allocated a separate, dedicated physical memory slot for every intermediate activation tensor in a 15-layer convolutional network, the total required RAM would easily exceed 200 kilobytes. However, intermediate activation tensors have finite temporal lifespans: A tensor is born when its producer operator executes, and it dies the exact instant its final consumer operator completes.",
                "Consider Layer 1 producing Tensor A, which is consumed by Layer 2 to produce Tensor B. Once Layer 2 finishes executing, Tensor A is never read again! Its physical memory can be immediately recycled and overwritten by Layer 3 to produce Tensor C. By reusing memory between tensors whose active lifespans do not overlap, we can reduce total RAM consumption by 50 to 75 percent!",
                "TFLM implements this using the `GreedyMemoryPlanner`. The planner models memory allocation as an offline 2D interval scheduling problem: Each tensor has a `first_time_step` (when it is allocated) and a `last_time_step` (when its last consumer finishes). The greedy algorithm sorts all tensors in descending order of size—allocating the largest tensors first—and places each tensor at the lowest possible offset that does not collide with any active, overlapping tensor.",
                "This offline planning produces a compact, puzzle-like packing arrangement inside the Tail of the Tensor Arena. The TFLM interpreter calculates this plan deterministically during initialization, locking in the relative offsets for the entire lifespan of the device.",
                "We will construct a fully functioning Greedy Memory Planner simulator, demonstrating how temporal lifespan overlap analysis enables dramatic RAM compression on bare-metal systems."
            ],
            "example": "Think of hotel rooms in a busy airport hotel. Instead of building 500 rooms for 500 guests who stay at different hours, the hotel manager reviews the check-in and check-out schedule (tensor lifespans) and books 100 rooms repeatedly as guests arrive and depart. As long as no two guests need the same room at the same time, everyone is accommodated comfortably.",
            "code": """# TFLM Greedy Memory Planner & Lifespan Overlay Simulator
# Allocates non-overlapping temporal intervals into shared memory offsets

class TensorLifespan:
    def __init__(self, name: str, size: int, birth_step: int, death_step: int):
        self.name = name
        self.size = size
        self.birth = birth_step
        self.death = death_step
        self.offset = None

    def overlaps_with(self, other: 'TensorLifespan') -> bool:
        # Returns True if active temporal intervals intersect
        return not (self.death < other.birth or self.birth > other.death)

class GreedyMemoryPlanner:
    def __init__(self):
        self.tensors = []

    def add_tensor(self, name: str, size: int, birth: int, death: int):
        self.tensors.append(TensorLifespan(name, size, birth, death))

    def plan(self, align: int = 16) -> int:
        # Sort tensors descending by size (Greedy by Size heuristic)
        sorted_tensors = sorted(self.tensors, key=lambda t: t.size, reverse=True)
        max_arena_offset = 0

        for target in sorted_tensors:
            candidate_offset = 0
            while True:
                # Align candidate offset
                rem = candidate_offset % align
                if rem != 0:
                    candidate_offset += (align - rem)
                
                conflict = False
                for placed in self.tensors:
                    if placed.offset is not None and target.overlaps_with(placed):
                        # Check spatial overlap
                        if not (candidate_offset + target.size <= placed.offset or candidate_offset >= placed.offset + placed.size):
                            conflict = True
                            candidate_offset = placed.offset + placed.size
                            break
                if not conflict:
                    target.offset = candidate_offset
                    max_arena_offset = max(max_arena_offset, candidate_offset + target.size)
                    break
        return max_arena_offset

planner = GreedyMemoryPlanner()
# Simulated 4-layer network with sequential activations
planner.add_tensor("Act_Layer1", size=4096, birth=1, death=2)
planner.add_tensor("Act_Layer2", size=2048, birth=2, death=3)
planner.add_tensor("Act_Layer3", size=4096, birth=3, death=4)  # Can reuse Act_Layer1's memory!
planner.add_tensor("Act_Layer4", size=1024, birth=4, death=5)  # Can reuse Act_Layer2's memory!

peak_ram = planner.plan(align=16)
naive_ram = sum(t.size for t in planner.tensors)
savings = round((1 - (peak_ram / naive_ram)) * 100, 1)

print("=== TFLM GREEDY MEMORY PLANNER OPTIMIZATION ===")
for t in planner.tensors:
    print(f"{t.name:<12}: Offset = {hex(t.offset):<8} | Size = {t.size} B | Lifespan = [{t.birth}..{t.death}]")
print("-" * 55)
print(f"Naive Unshared RAM Footprint : {naive_ram} Bytes")
print(f"Planned Optimized Footprint  : {peak_ram} Bytes")
print(f"RAM Compression Ratio        : {savings}% Space Saved")""",
            "output": """=== TFLM GREEDY MEMORY PLANNER OPTIMIZATION ===
Act_Layer1  : Offset = 0x0      | Size = 4096 B | Lifespan = [1..2]
Act_Layer2  : Offset = 0x1000   | Size = 2048 B | Lifespan = [2..3]
Act_Layer3  : Offset = 0x0      | Size = 4096 B | Lifespan = [3..4]
Act_Layer4  : Offset = 0x1000   | Size = 1024 B | Lifespan = [4..5]
-------------------------------------------------------
Naive Unshared RAM Footprint : 11264 Bytes
Planned Optimized Footprint  : 6144 Bytes
RAM Compression Ratio        : 45.5% Space Saved""",
            "codeNotes": [
                "Line 11: overlaps_with checks whether two tensors exist simultaneously during graph execution.",
                "Line 24: Sorts tensors by size descending, prioritizing optimal placement for the largest activation feature maps.",
                "Line 38: Reuses offset 0x0 for Act_Layer3 because Act_Layer1 has already concluded its lifespan."
            ],
            "tryIt": "Extend the lifespan of Act_Layer1 to death=4 (simulating a residual skip connection) and observe how the planner automatically relocates Act_Layer3.",
            "check": {
                "question": "How does the TFLM Greedy Memory Planner achieve up to 50% RAM savings for intermediate activation tensors?",
                "options": [
                    "By analyzing temporal tensor lifespans and overlaying non-overlapping tensors into the exact same physical memory offsets",
                    "By deleting half of the neural network layers during runtime",
                    "By sending intermediate activation values to an external cloud database over Wi-Fi",
                    "By rounding all activation values down to zero"
                ],
                "answer": 0,
                "why": "Intermediate tensors only exist for a few operator steps. The Greedy Memory Planner maps non-overlapping tensor lifespans into the same physical SRAM offsets, drastically cutting the required RAM footprint."
            }
        },
        {
            "title": "Hardware Memory Sizing & Sentry Canary Integrity Auditing",
            "say": [
                "In the final part of Day Eight, we integrate the TFLM Tensor Arena into safety-critical embedded firmware and implement Sentry Canary Integrity Auditing to guard against buffer overruns and memory corruption.",
                "In bare-metal embedded C++, how do you determine the exact `kTensorArenaSize` value needed for your application? If you allocate too little memory, `AllocateTensors()` returns `kTfLiteError` and your device cannot boot. If you allocate too much memory, you starve other critical firmware components—such as TCP/IP buffers, FreeRTOS task stacks, or DMA ring buffers.",
                "The industry-standard profiling procedure begins by deliberately allocating an oversized arena (e.g., 96 KB) during the development phase. After calling `AllocateTensors()`, the firmware queries the allocator's high-water mark via `allocator.used_bytes()`. If the allocator utilized 34,280 bytes, the engineer adds a deterministic safety margin—typically 15 to 20 percent (5 to 8 KB)—to accommodate worst-case intermediate scratchpads, resulting in a finalized production arena size of 40 KB.",
                "However, in high-reliability industrial automation, static sizing is not enough. Firmware must be resilient against rogue memory writes, electromagnetic interference (EMI) bit-flips, and stack overflows. To guarantee runtime integrity, safety architectures surround the Tensor Arena with Sentry Canaries.",
                "A Sentry Canary is an array of magic bytes (such as `0xDEADBEEF` or `0xAA55AA55`) placed immediately before the start of the arena and immediately after the end of the arena. Furthermore, modern microcontrollers (such as ARM Cortex-M33 with ARM TrustZone or Cortex-M7) feature a hardware Memory Protection Unit (MPU). The firmware configures the MPU to mark the Sentry Canary regions as Privileged Read-Only. If an errant operator kernel or runaway pointer attempts to write outside the Tensor Arena boundary, the hardware MPU instantly triggers a MemManage Fault interrupt, halting the system cleanly before corrupted data can propagate to physical actuators.",
                "We will implement an automated Memory Sizing & Sentry Canary Integrity Auditor that models this end-to-end safety envelope."
            ],
            "example": "Think of a high-security bank vault. In addition to building thick walls (the exact arena size), the bank places laser tripwires (Sentry Canaries) along the perimeter. If anyone touches the tripwire, the alarm triggers instantly (MPU fault) before anyone can access the gold.",
            "code": """# TFLM Tensor Arena Sizing & Sentry Canary Integrity Auditor
# Validates memory headroom, canary integrity, and MPU boundary compliance

import struct

class CanaryCorruptedError(Exception): pass

class ArenaSafetyAuditor:
    CANARY_MAGIC = 0xDEADBEEF

    def __init__(self, requested_capacity: int):
        self.capacity = requested_capacity
        # Pre-canary (8 bytes), Arena Payload, Post-canary (8 bytes)
        self.pre_canary = struct.pack('<II', self.CANARY_MAGIC, self.CANARY_MAGIC)
        self.post_canary = struct.pack('<II', self.CANARY_MAGIC, self.CANARY_MAGIC)
        self.arena_storage = bytearray(requested_capacity)
        self.used_watermark = 0

    def record_allocation(self, bytes_allocated: int):
        self.used_watermark += bytes_allocated
        if self.used_watermark > self.capacity:
            raise MemoryError(f"Fatal Arena Overflow! Exceeded {self.capacity} by {self.used_watermark - self.capacity} bytes")

    def simulate_buffer_overrun(self):
        # Simulate rogue operator writing 4 bytes past the end of the arena
        corrupted_bytes = b'\\xFF\\xFF\\xFF\\xFF'
        self.post_canary = corrupted_bytes + self.post_canary[4:]

    def audit_canary_integrity(self) -> bool:
        pre_val1, pre_val2 = struct.unpack('<II', self.pre_canary)
        post_val1, post_val2 = struct.unpack('<II', self.post_canary)
        
        if pre_val1 != self.CANARY_MAGIC or pre_val2 != self.CANARY_MAGIC:
            raise CanaryCorruptedError("CRITICAL: Pre-Arena Sentry Canary Corrupted! Memory underflow detected.")
        if post_val1 != self.CANARY_MAGIC or post_val2 != self.CANARY_MAGIC:
            raise CanaryCorruptedError("CRITICAL: Post-Arena Sentry Canary Corrupted! Buffer overrun detected.")
        return True

    def generate_safety_report(self) -> dict:
        free_headroom = self.capacity - self.used_watermark
        headroom_pct = round((free_headroom / self.capacity) * 100, 2)
        return {
            "arena_total_capacity": self.capacity,
            "arena_used_watermark": self.used_watermark,
            "arena_free_headroom": free_headroom,
            "headroom_percentage": f"{headroom_pct}%",
            "canary_status": "INTACT (0xDEADBEEF Verified)",
            "safety_verdict": "PASS (Production Sizing Certified)"
        }

auditor = ArenaSafetyAuditor(requested_capacity=48 * 1024)
auditor.record_allocation(38420)  # Simulated model allocation

# Verify clean state
auditor.audit_canary_integrity()
report = auditor.generate_safety_report()

print("=== TFLM TENSOR ARENA INTEGRITY & HEADROOM AUDIT ===")
for k, v in report.items():
    print(f"{k:<24}: {v}")
print(f"Safety Envelope Margin  : ACCEPTABLE (Target: 15-25% Headroom)")""",
            "output": """=== TFLM TENSOR ARENA INTEGRITY & HEADROOM AUDIT ===
arena_total_capacity    : 49152
arena_used_watermark    : 38420
arena_free_headroom     : 10732
headroom_percentage     : 21.83%
canary_status           : INTACT (0xDEADBEEF Verified)
safety_verdict          : PASS (Production Sizing Certified)
Safety Envelope Margin  : ACCEPTABLE (Target: 15-25% Headroom)""",
            "codeNotes": [
                "Line 9: Constructs 8-byte pre-canary and post-canary bounds populated with magic token 0xDEADBEEF.",
                "Line 24: audit_canary_integrity validates both boundary canaries to catch buffer overflows or underflows.",
                "Line 32: Generates a comprehensive safety report calculating percentage headroom for production sizing."
            ],
            "tryIt": "Call auditor.simulate_buffer_overrun() and verify that audit_canary_integrity() immediately catches the corrupted post-canary.",
            "check": {
                "question": "What is the purpose of placing Sentry Canaries around the TensorFlow Lite for Microcontrollers Tensor Arena?",
                "options": [
                    "To detect buffer overruns and memory corruption caused by rogue operator kernels before corrupted data affects actuators",
                    "To compress the neural network weights into 4-bit integers",
                    "To provide an encryption key for communicating with Wi-Fi routers",
                    "To automatically cool down the microcontroller processor"
                ],
                "answer": 0,
                "why": "Sentry canaries are known magic byte patterns flanking memory boundaries; if an operator writes outside the arena, the canary is corrupted, alerting the system to halt execution before safety is compromised."
            }
        }
    ],
    "summary": [
        "The TFLM Tensor Arena is a single contiguous static memory pool declared at compile time, eliminating heap fragmentation and dynamic allocation.",
        "Bidirectional Head-and-Tail partitioning separates persistent metadata (at the Head) from transient activation feature maps (at the Tail).",
        "Tensor offset resolution binds relative byte offsets into physical CPU memory pointers once during AllocateTensors(), ensuring zero overhead during Invoke().",
        "The Greedy Memory Planner overlays non-overlapping tensor lifespans into shared memory offsets, reducing activation RAM consumption by up to 50%.",
        "Sentry Canaries and Memory Protection Unit (MPU) boundaries guard against buffer overruns, establishing a certified safety envelope for industrial TinyML."
    ],
    "projectStep": {
        "title": "Construct a Deterministic TFLM Tensor Arena Allocator & Sentry Auditor",
        "steps": [
            "Declare a 16-byte SIMD-aligned contiguous memory pool modeling static BSS segment reservation.",
            "Implement bidirectional Head and Tail allocators with collision detection and watermark tracking.",
            "Resolve logical tensor indices into physical memory addresses and simulate pointer binding.",
            "Build an offline Greedy Memory Planner to compress intermediate activation lifespans into shared offsets.",
            "Deploy Sentry Canaries (0xDEADBEEF) and verify runtime boundary protection against buffer overflows."
        ]
    }
}

with open('scripts/iot_edge_day8.json', 'w', encoding='utf-8') as f:
    json.dump(day8, f, indent=2)

print("Successfully wrote scripts/iot_edge_day8.json")
