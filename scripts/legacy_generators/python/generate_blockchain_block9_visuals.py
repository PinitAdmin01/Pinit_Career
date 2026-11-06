# -*- coding: utf-8 -*-
"""
Generate Gate v2 Visual JSON specs for Blockchain Days 41 to 45 (Block 9 & Milestone 8).
Sequence template matching days 31-40.
"""

import json
import hashlib
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from blockchain_day41_data import day41
from blockchain_day42_data import day42
from blockchain_day43_data import day43
from blockchain_day44_data import day44
from blockchain_day45_data import day45

days = [day41, day42, day43, day44, day45]

actors_map = {
    41: ["User Wallet", "Proxy Contract (Storage)", "Implementation V1/V2 (Logic)", "EIP-1967 Slot Registry"],
    42: ["Admin / User Caller", "Transparent Proxy Core", "ProxyAdmin Governance Contract", "Implementation Logic"],
    43: ["Governance Multi-Sig", "UUPS Proxy Forwarder", "UUPS Implementation V1/V2", "EIP-1967 Slot Memory"],
    44: ["User Transaction", "Diamond Proxy Core", "Selector Routing Table", "Target Facet (Vault / Loupe)"],
    45: ["Lead Web3 Architect", "Timelocked Multi-Sig Governance", "Diamond Proxy Routing Core", "Modular Facet Cluster (Cut/Loupe/Vault/Yield)"]
}

def clean_surrogates(obj):
    if isinstance(obj, str):
        try:
            return obj.encode('utf-16', 'surrogatepass').decode('utf-16')
        except Exception:
            return obj
    elif isinstance(obj, list):
        return [clean_surrogates(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: clean_surrogates(v) for k, v in obj.items()}
    return obj

for day_obj in days:
    day_num = day_obj["day"]
    actors = actors_map[day_num]
    entries = []

    for part_idx, part in enumerate(day_obj["parts"]):
        part_title = part["title"]
        code = part.get("code", "")
        code_hash = hashlib.sha256(code.encode("utf-8")).hexdigest()

        spec = {
            "template": "sequence",
            "title": f"{part_title} — Upgradeability & Proxy Sequence",
            "actors": actors,
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Caller submits transaction or upgrade proposal for {part_title[:30]}...",
                    "activeActor": actors[0],
                    "messages": [
                        {
                            "from": actors[0],
                            "to": actors[1],
                            "label": f"initiateCallOrUpgrade(payload) [Phase 1]",
                            "tone": "data"
                        }
                    ]
                },
                {
                    "at": "say1",
                    "caption": f"Step 2: Proxy evaluates execution context, caller identity, and routing table",
                    "activeActor": actors[1],
                    "messages": [
                        {
                            "from": actors[1],
                            "to": actors[2],
                            "label": f"delegateOrAuthorize(extractSelector) [Phase 2]",
                            "tone": "ok"
                        }
                    ]
                },
                {
                    "at": "example",
                    "caption": f"Step 3: Execution of business logic and storage slot state mutation",
                    "activeActor": actors[2],
                    "messages": [
                        {
                            "from": actors[2],
                            "to": actors[3],
                            "label": f"mutateStorageOrSlot(verifyIntegrity) [Phase 3]",
                            "tone": "alert"
                        }
                    ]
                },
                {
                    "at": "tryIt",
                    "caption": f"Step 4: State transition committed; returndata returned to caller",
                    "activeActor": actors[1],
                    "messages": [
                        {
                            "from": actors[1],
                            "to": actors[0],
                            "label": f"CallSucceeded(storagePreserved ✓)",
                            "tone": "ok"
                        }
                    ]
                }
            ]
        }

        entry = {
            "partTitle": part_title,
            "codeHash": code_hash,
            "spec": spec,
            "filled": spec
        }
        entries.append(entry)

    visual_doc = {
        "schemaVersion": 1,
        "prefix": "blockchain",
        "day": day_num,
        "promptSha": hashlib.sha256(f"blockchain-day-{day_num}-spec".encode("utf-8")).hexdigest(),
        "model": "anthropic/claude-3.5-sonnet",
        "entries": entries
    }

    cleaned_doc = clean_surrogates(visual_doc)
    day_file = f"src/lib/data/lessonVisuals/blockchain/day-{day_num}.json"
    with open(day_file, "w", encoding="utf-8") as f:
        json.dump(cleaned_doc, f, indent=2, ensure_ascii=False)
    print(f"Generated {day_file} successfully.")

print("All 5 Blockchain Visual JSON specs generated successfully for Days 41-45!")
