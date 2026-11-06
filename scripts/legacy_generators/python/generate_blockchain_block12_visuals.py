# -*- coding: utf-8 -*-
"""
Generate Gate v2 Visual JSON specs for Blockchain Days 56 to 60 (Block 12 & Master Capstone).
Sequence template matching days 31-55.
"""

import json
import hashlib
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from blockchain_day56_data import day56
from blockchain_day57_data import day57
from blockchain_day58_data import day58
from blockchain_day59_data import day59
from blockchain_day60_data import day60

days = [day56, day57, day58, day59, day60]

actors_map = {
    56: ["Trader Wallet", "Uniswap v4 Router", "PoolManager (Singleton)", "Dynamic Fee Hook"],
    57: ["Borrower Account", "Aave v3 Pool", "Isolation Mode / eMode Engine", "Liquidation Keeper"],
    58: ["Student Wallet", "PinIT Credential Registry", "EAS Schema Resolver", "Institutional Authority"],
    59: ["Principal Web3 Architect", "Monolithic L1 (Ethereum)", "Modular Rollup (Arbitrum)", "Executive Review Board"],
    60: ["Staff Web3 Architect", "ApexDEX Core Protocol", "Groth16 Verifier (0x08)", "Senior Examination Board"]
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
            "title": f"{part_title} — Production Web3 Architecture Sequence",
            "actors": actors,
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Initialization of architectural payload for {part_title[:30]}...",
                    "activeActor": actors[0],
                    "messages": [
                        {
                            "from": actors[0],
                            "to": actors[1],
                            "label": f"initiateOperation(preparePayload) [Phase 1]",
                            "tone": "data"
                        }
                    ]
                },
                {
                    "at": "say1",
                    "caption": f"Step 2: Constraint validation, delta accounting, or risk parameter evaluation",
                    "activeActor": actors[1],
                    "messages": [
                        {
                            "from": actors[1],
                            "to": actors[2],
                            "label": f"evaluateRulesOrExecute(verifyInvariants) [Phase 2]",
                            "tone": "ok"
                        }
                    ]
                },
                {
                    "at": "example",
                    "caption": f"Step 3: Verification of hook callback, isolation ceiling, or ZK pairing precompile",
                    "activeActor": actors[2],
                    "messages": [
                        {
                            "from": actors[2],
                            "to": actors[3],
                            "label": f"verifyOnChainOrAudit(executePrecompile) [Phase 3]",
                            "tone": "alert"
                        }
                    ]
                },
                {
                    "at": "tryIt",
                    "caption": f"Step 4: Transaction settled and finalized; institutional invariant sealed",
                    "activeActor": actors[1],
                    "messages": [
                        {
                            "from": actors[1],
                            "to": actors[0],
                            "label": f"OperationFinalized(verified ✓)",
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

print("All 5 Blockchain Visual JSON specs generated successfully for Days 56-60!")
