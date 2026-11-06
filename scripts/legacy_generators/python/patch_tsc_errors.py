import re

# 1. Patch excelVizLongLessons.ts
excel_path = "src/lib/data/excelVizLongLessons.ts"
with open(excel_path, "r", encoding="utf-8") as f:
    excel_content = f.read()

excel_content_patched = re.sub(r'(\s*)"track":\s*"excel_viz",\n', '', excel_content)

if excel_content != excel_content_patched:
    with open(excel_path, "w", encoding="utf-8") as f:
        f.write(excel_content_patched)
    print("Patched excelVizLongLessons.ts successfully: removed track properties.")
else:
    print("Warning: no track properties found to remove in excelVizLongLessons.ts")

# 2. Patch compFundLongLessons.ts
comp_path = "src/lib/data/compFundLongLessons.ts"
with open(comp_path, "r", encoding="utf-8") as f:
    comp_content = f.read()

summaries = {
    6: [
        "The Process Control Block (struct task_struct) encapsulates all process execution state, PID, PPID, registers, and file descriptor tables.",
        "POSIX process creation relies on fork() with Copy-on-Write semantics, execve() for image replacement, and waitpid() for child harvesting.",
        "Zombie processes retain PCB entries until reaped by parents; uncollected zombies risk kernel PID exhaustion.",
        "CPU context switching incurs register saves, pipeline invalidations, and TLB flushes; multithreading shares virtual address spaces.",
        "Linux Completely Fair Scheduler (CFS) balances virtual runtime (vruntime) via red-black trees, while cgroups v2 enforces CPU quota ceilings."
    ],
    7: [
        "The Memory Latency Gap spans from 1 ns (L1 cache) to ~80 ns (DRAM), making cache optimization essential for high-throughput software.",
        "Temporal and spatial locality ensure cache lines (64 bytes) maximize data reuse and prefetching efficiency.",
        "Direct-mapped, fully associative, and set-associative cache placement models balance lookup speed with collision eviction rates.",
        "The MESI cache coherence protocol (Modified, Exclusive, Shared, Invalid) maintains memory consistency across multi-core CPU architectures.",
        "Virtual memory translates virtual to physical addresses via multi-level page tables, accelerated by hardware Translation Lookaside Buffers (TLB)."
    ],
    8: [
        "Storage media span HDDs (rotational latency, ~10ms), SATA SSDs (AHCI queue depth 32, ~100μs), and NVMe PCIe SSDs (64K queues, ~10μs).",
        "RAID configurations balance performance and parity: RAID 0 (striping), RAID 1 (mirroring), RAID 5 (single parity), RAID 6 (dual parity), and RAID 10.",
        "Silent data corruption (bit rot) occurs due to cosmic radiation and media degradation; traditional filesystems fail to detect silent bit flips.",
        "Copy-on-Write (CoW) filesystems like ZFS and Btrfs maintain end-to-end cryptographic checksum trees to detect and self-heal corrupted data blocks.",
        "Linux block storage layers coordinate I/O schedulers (none, mq-deadline, bfq) and direct I/O (O_DIRECT) to bypass OS page cache for transactional durability."
    ],
    9: [
        "The 7-layer OSI model and 4-layer TCP/IP stack define modular network abstractions from physical bits to application protocols.",
        "Data encapsulation wraps application payload in TCP segments, IP packets, and Ethernet frames with L2 MAC and L3 IP addresses.",
        "Address Resolution Protocol (ARP) dynamically resolves IPv4 addresses to physical MAC hardware addresses across local broadcast domains.",
        "Classless Inter-Domain Routing (CIDR) uses subnet masks (e.g. /24, /26) to allocate network IDs and host capacity efficiently.",
        "The Domain Name System (DNS) operates a distributed hierarchical resolution tree (Root, TLD, Authoritative servers) with caching resolvers."
    ],
    10: [
        "TCP provides reliable, ordered, byte-stream transmission with congestion control, while UDP prioritizes low-latency datagram delivery.",
        "The TCP 3-way handshake (SYN, SYN-ACK, ACK) and 4-way teardown manage connection lifecycles, culminating in TIME_WAIT to purge stale packets.",
        "HTTP/1.1 suffers from Head-of-Line blocking; HTTP/2 eliminates this via binary framing, multiplexed streams, and HPACK header compression.",
        "HTTP/3 transitions transport to QUIC over UDP, resolving transport-layer packet loss stalls and enabling zero-RTT handshakes.",
        "TLS 1.3 reduces cryptographic handshakes to a single round-trip using Ephemeral Diffie-Hellman (ECDHE) for perfect forward secrecy."
    ],
    11: [
        "Modern browsers utilize multi-process sandboxing (Browser, Renderer, GPU, Network) to isolate tabs and protect against privilege escalation.",
        "The Critical Rendering Path processes HTML into DOM and CSS into CSSOM, combining into a Render Tree for Layout and Paint stages.",
        "Network waterfall analysis identifies performance bottlenecks across DNS lookup, TCP connect, TLS handshake, and Time to First Byte (TTFB).",
        "Browser storage mechanisms (Cookies, LocalStorage, IndexedDB) enforce security boundaries via HttpOnly, Secure, and SameSite attributes.",
        "The JavaScript single-threaded event loop processes microtasks (Promises) before macrotasks (setTimeout, DOM events) to maintain responsive UI."
    ]
}

# For each day 6 through 11, find the end of the parts array and append summary
import json

for day in range(6, 12):
    # Pattern to match day definition
    day_marker = f'"day": {day},'
    idx = comp_content.find(day_marker)
    if idx == -1:
        print(f"Could not find day {day}")
        continue
    
    # Next day or end of array
    next_marker = f'"day": {day + 1},' if day < 11 else '];'
    next_idx = comp_content.find(next_marker, idx)
    if next_idx == -1:
        print(f"Could not find end of day {day}")
        continue
    
    day_block = comp_content[idx:next_idx]
    
    # We want to find the last `]` of the `parts` array before `},` or `}`
    # In our generated days, the parts array ends with `\n    }\n  ]\n}`
    # Let's inspect the ending of day_block
    summary_json = json.dumps(summaries[day], indent=4)
    summary_indented = ',\n  "summary": ' + summary_json
    
    # Replace `\n  ]\n}` with `\n  ]` + summary_indented + `\n}`
    # Or find the last `]` in day_block
    last_bracket = day_block.rfind(']')
    if last_bracket == -1:
        print(f"Could not find ] in day {day}")
        continue
    
    # Check if summary is already present
    if '"summary":' in day_block:
        print(f"Day {day} already has summary")
        continue
        
    new_day_block = day_block[:last_bracket+1] + summary_indented + day_block[last_bracket+1:]
    comp_content = comp_content[:idx] + new_day_block + comp_content[next_idx:]
    print(f"Added summary to day {day}")

with open(comp_path, "w", encoding="utf-8") as f:
    f.write(comp_content)
print("Updated compFundLongLessons.ts with summaries.")
