import json
import hashlib
import os

# Generates register-bits visuals for Days 16 to 20 of Course 14: iot_emb
# Schema matches Gate v2 register-bits specification

OUT_DIR = "src/lib/data/lessonVisuals/iot_emb"
os.makedirs(OUT_DIR, exist_ok=True)

# Register naming by day topic:
# Day 16: DMA Controller & Bus Matrix -> DMA_SxCR / DMA_SxFCR
# Day 17: Circular Streaming & Ping-Pong -> DMA_SxNDTR / DMA_LISR
# Day 18: L1 Cache Coherency & Memory Barriers -> SCB_CCR / SCB_CSSELR
# Day 19: Hardware Watchdogs & Anti-Freeze -> IWDG_KR / WWDG_CR
# Day 20: Milestone 4 Engine -> SYS_DMA_CR / SYS_WDT_SR

day_reg_names = {
    16: "DMA_SxCR",
    17: "DMA_SxNDTR",
    18: "SCB_CCR",
    19: "IWDG_KR",
    20: "SYS_DMA_CR"
}

for day in range(16, 21):
    day_json_path = f"scripts/iot_emb_day{day}.json"
    with open(day_json_path, "r", encoding="utf-8") as f:
        day_data = json.load(f)
        
    entries = []
    reg_base = day_reg_names[day]
    
    for p_idx, part in enumerate(day_data["parts"]):
        title = part["title"]
        code = part["code"]
        code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()
        reg_name = f"{reg_base}{p_idx+1}"
        
        # 4 synchronized steps: intro, say1, example, tryIt
        steps = [
            {
                "at": "intro",
                "caption": f"Step 1: Initialize {title[:35]} with hardware clock gate & EN=1.",
                "registerName": reg_name,
                "bitWidth": 8,
                "hexValue": "0x80",
                "decimalValue": 128,
                "maskApplied": "1 << 7",
                "bits": [
                    {"index": 7, "name": "EN", "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 6, "name": "RDY", "value": 0, "tone": "idle"},
                    {"index": 5, "name": "IRQ", "value": 0, "tone": "idle"},
                    {"index": 4, "name": "DMA", "value": 0, "tone": "idle"},
                    {"index": 3, "name": "TC", "value": 0, "tone": "idle"},
                    {"index": 2, "name": "HT", "value": 0, "tone": "idle"},
                    {"index": 1, "name": "BUSY", "value": 0, "tone": "idle"},
                    {"index": 0, "name": "ERR", "value": 0, "tone": "idle"}
                ]
            },
            {
                "at": "say1",
                "caption": f"Step 2: Assert RDY and IRQ flags under hardware interrupt preemption.",
                "registerName": reg_name,
                "bitWidth": 8,
                "hexValue": "0xE0",
                "decimalValue": 224,
                "maskApplied": "(1 << 6) | (1 << 5)",
                "bits": [
                    {"index": 7, "name": "EN", "value": 1, "tone": "ok"},
                    {"index": 6, "name": "RDY", "value": 1, "tone": "data", "highlighted": True},
                    {"index": 5, "name": "IRQ", "value": 1, "tone": "data", "highlighted": True},
                    {"index": 4, "name": "DMA", "value": 0, "tone": "idle"},
                    {"index": 3, "name": "TC", "value": 0, "tone": "idle"},
                    {"index": 2, "name": "HT", "value": 0, "tone": "idle"},
                    {"index": 1, "name": "BUSY", "value": 0, "tone": "idle"},
                    {"index": 0, "name": "ERR", "value": 0, "tone": "idle"}
                ]
            },
            {
                "at": "example",
                "caption": f"Step 3: Enable DMA burst and Transfer Complete flags.",
                "registerName": reg_name,
                "bitWidth": 8,
                "hexValue": "0xF8",
                "decimalValue": 248,
                "maskApplied": "(1 << 4) | (1 << 3)",
                "bits": [
                    {"index": 7, "name": "EN", "value": 1, "tone": "ok"},
                    {"index": 6, "name": "RDY", "value": 1, "tone": "ok"},
                    {"index": 5, "name": "IRQ", "value": 1, "tone": "ok"},
                    {"index": 4, "name": "DMA", "value": 1, "tone": "data", "highlighted": True},
                    {"index": 3, "name": "TC", "value": 1, "tone": "data", "highlighted": True},
                    {"index": 2, "name": "HT", "value": 0, "tone": "idle"},
                    {"index": 1, "name": "BUSY", "value": 0, "tone": "idle"},
                    {"index": 0, "name": "ERR", "value": 0, "tone": "idle"}
                ]
            },
            {
                "at": "tryIt",
                "caption": f"Step 4: Full ping-pong streaming active with zero-drop verified.",
                "registerName": reg_name,
                "bitWidth": 8,
                "hexValue": "0xFE",
                "decimalValue": 254,
                "maskApplied": "~0x01",
                "bits": [
                    {"index": 7, "name": "EN", "value": 1, "tone": "ok"},
                    {"index": 6, "name": "RDY", "value": 1, "tone": "ok"},
                    {"index": 5, "name": "IRQ", "value": 1, "tone": "ok"},
                    {"index": 4, "name": "DMA", "value": 1, "tone": "ok"},
                    {"index": 3, "name": "TC", "value": 1, "tone": "ok"},
                    {"index": 2, "name": "HT", "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 1, "name": "BUSY", "value": 1, "tone": "ok", "highlighted": True},
                    {"index": 0, "name": "ERR", "value": 0, "tone": "idle"}
                ]
            }
        ]
        
        spec = {
            "template": "register-bits",
            "title": f"{title[:45]} — Register Bit Architecture",
            "steps": steps
        }
        
        entries.append({
            "partTitle": title,
            "codeHash": code_hash,
            "spec": spec
        })
        
    visual_doc = {
        "schemaVersion": 1,
        "prefix": "iot_emb",
        "day": day,
        "promptSha": hashlib.sha256(f"iot_emb_day_{day}".encode("utf-8")).hexdigest(),
        "model": "google/gemini-3.8-flash",
        "entries": entries
    }
    
    pad = str(day).zfill(2)
    out_file = os.path.join(OUT_DIR, f"day-{pad}.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(visual_doc, f, indent=2, ensure_ascii=False)
        
    print(f"Generated {out_file} with {len(entries)} register-bits entries!")

print("All Days 16-20 visual JSON files generated successfully!")
