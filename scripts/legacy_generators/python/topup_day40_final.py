import json

with open('scripts/iot_emb_day40.json', 'r', encoding='utf-8') as f:
    d40 = json.load(f)

# Part 3 top up
d40['parts'][2]['say'].append(
    "From a microarchitectural perspective, our NanoPB encoding utilizes pre-allocated static streaming buffers. When serializing the 38-byte binary frame, NanoPB writes bytes directly into a hardware-aligned memory region mapped to the network interface DMA buffer. By eliminating intermediate dynamic heap allocations (`malloc`/`free`), the gateway prevents heap fragmentation entirely, ensuring that the microcontroller can operate for years of continuous 24/7 uptime without experiencing memory exhaustion crashes."
)

# Part 4 top up
d40['parts'][3]['say'].append(
    "To guard against silent network socket drops where the cellular connection hangs in a half-open state, the gateway arms a 10-second TCP socket inactivity timer. If the remote broker fails to respond to QoS 1 publish packets or ping requests within this window, the gateway forces a hard socket reset (`SO_LINGER`), cleanly tears down the TCP session, and immediately engages its offline flash spooling engine."
)

with open('scripts/iot_emb_day40.json', 'w', encoding='utf-8') as f:
    json.dump(d40, f, indent=2, ensure_ascii=False)

print("Updated Day 40 Parts 3 & 4!")
total_w = sum(sum(len(s.split()) for s in p['say']) for p in d40['parts'])
part_words = [sum(len(s.split()) for s in p['say']) for p in d40['parts']]
print(f"Day 40: declared minutes={d40['minutes']}, total say words={total_w} ({total_w/120:.1f} mins spoken), parts={part_words}")
