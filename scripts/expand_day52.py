with open('scripts/fullstack_day52_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Part 1 addition
p1_old = 'In this initial component, we implement a CPU-bound computational baseline in TypeScript to demonstrate algorithmic execution patterns before introducing native Wasm acceleration.'
p1_new = (
    "To understand why JavaScript encounters these ceilings, engineers must inspect V8's multi-tier execution pipeline. "
    "When JavaScript executes, the Ignition interpreter converts source code into bytecode. As functions run repeatedly, "
    "the Sparkplug and Maglev compilers generate baseline native code, while the TurboFan optimizing compiler monitors hidden "
    "classes and object shapes to emit heavily optimized assembly. However, TurboFan's optimizations depend entirely on "
    "speculative type stability. The moment an application feeds mixed numeric types or dynamic object structures through a hot "
    "loop, TurboFan aborts optimized execution and triggers a deoptimization bailout, falling back to interpreted bytecode.\n\n"
    "In contrast, WebAssembly completely bypasses shape checks and speculative type feedback. Because the Wasm module defines static, "
    "immutable type signatures at compile time, the host engine compiles the bytecode directly to native machine instructions "
    "without runtime deoptimization hooks. This predictable execution model guarantees deterministic throughput across millions "
    "of compute iterations. In this initial component, we implement a CPU-bound computational baseline in TypeScript to demonstrate "
    "algorithmic execution patterns before introducing native Wasm acceleration."
)
assert p1_old in text
text = text.replace(p1_old, p1_new, 1)

# Part 2 addition
p2_old = 'In this second component, we construct a complete, self-contained WebAssembly binary bytecode module in TypeScript.'
p2_new = (
    "The security and sandboxing architecture of WebAssembly is another critical capability for enterprise server environments. "
    "Unlike native C++ shared libraries (.so or .dll files) loaded via Node.js native addons, a WebAssembly module cannot execute "
    "arbitrary operating system system calls, open raw network sockets, or inspect host file systems unless explicit capability "
    "functions are passed into its importObject. The module is strictly isolated within its designated memory sandbox, protecting "
    "host Node.js servers from buffer overflow exploits and remote code execution vulnerabilities.\n\n"
    "Furthermore, developers author WebAssembly routines using human-readable WebAssembly Text Format (.wat) files before compiling "
    "them to binary bytecode. The runtime validation phase of WebAssembly verifies that every instruction respects operand stack depths "
    "and type signatures before any machine code is generated. This compile-time verification eliminates entire categories of runtime "
    "memory errors. In this second component, we construct a complete, self-contained WebAssembly binary bytecode module in TypeScript."
)
assert p2_old in text
text = text.replace(p2_old, p2_new, 1)

# Part 3 addition
p3_old = 'In this third component, we construct a Wasm Linear Memory Management Pipeline in TypeScript.'
p3_new = (
    "In enterprise multi-threaded Node.js architectures, linear memory can be shared across multiple worker threads using "
    "SharedArrayBuffer instances. By backing WebAssembly.Memory with a shared buffer, multiple worker threads can execute concurrent "
    "matrix operations or process parallel data partitions simultaneously. To coordinate access to shared memory coordinates without "
    "race conditions, the WebAssembly specification provides atomic memory instructions—such as atomic compare-and-swap, atomic loads, "
    "and atomic stores—that correspond directly to hardware atomic CPU primitives.\n\n"
    "Additionally, production Wasm modules compiled from C or Rust embed lightweight memory allocators (such as wee_alloc or dlmalloc) "
    "directly inside the linear memory space. The host runtime calls exported malloc and free functions to allocate dynamic memory blocks "
    "inside Wasm memory, preserving clean memory boundaries without fragmenting host process RAM. In this third component, we construct "
    "a Wasm Linear Memory Management Pipeline in TypeScript."
)
assert p3_old in text
text = text.replace(p3_old, p3_new, 1)

# Part 4 addition
p4_target = 'demonstrating four-way parallel arithmetic processing.'
p4_replacement = (
    "demonstrating four-way parallel arithmetic processing. "
    "Compiling code for Wasm SIMD requires configuring modern compilers—such as Clang with the -msimd128 flag or the Rust compiler "
    "with target-feature=+simd128. The compiler automatically analyzes loops, detects vectorization opportunities, and emits 128-bit "
    "vector instructions. Because Wasm SIMD opcodes are standardized by the W3C, the same compiled binary runs with identical "
    "mathematical precision on Intel x86 processors using SSE/AVX registers and on Apple Silicon or ARM64 servers using Neon vector registers.\n\n"
    "Furthermore, Wasm SIMD enforces strict floating-point determinism. In cross-platform distributed systems—such as multiplayer game "
    "servers, decentralized consensus nodes, or distributed physics engines—slight differences in floating-point rounding across different "
    "CPU architectures can cause divergent state calculations. WebAssembly SIMD specifies exact rounding modes and NaN canonicalization "
    "rules, ensuring that identical inputs produce bit-for-bit identical outputs regardless of the underlying hardware host."
)
assert p4_target in text
text = text.replace(p4_target, p4_replacement, 1)

# Part 5 addition
p5_target = 'concluding Day 52.'
p5_replacement = (
    "concluding Day 52. "
    "To implement automated capability detection in production, enterprise executors employ dynamic feature probing during application "
    "bootstrap. The executor attempts to compile a micro-Wasm binary containing a single SIMD instruction using WebAssembly.validate(). "
    "If the host engine or CPU does not support SIMD, the validation method returns false without throwing an unhandled exception. "
    "The executor immediately marks the accelerated pipeline as disabled and switches the routing table to the pure JavaScript engine.\n\n"
    "Additionally, memory sentinels continuously track memory allocation growth rates. If a runaway algorithmic loop attempts to allocate "
    "hundreds of memory pages within a short time window—suggesting a memory leak or malicious input payload—the sentinel clamps execution, "
    "records a high-severity diagnostic snapshot, and safely recycles the Wasm instance."
)
assert p5_target in text
text = text.replace(p5_target, p5_replacement, 1)

with open('scripts/fullstack_day52_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Expanded Day 52 successfully!')
