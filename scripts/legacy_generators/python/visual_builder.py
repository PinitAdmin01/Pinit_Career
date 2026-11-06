import os
import json
import hashlib

def make_sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

def count_words(text) -> int:
    if isinstance(text, str):
        return len(text.split())
    if isinstance(text, list):
        return sum(count_words(item) for item in text)
    return 0

def generate_funnel_visual(prefix: str, day: int, entries: list) -> dict:
    json_entries = []
    for idx, e in enumerate(entries):
        base_reach = 12500 + day * 1200 - idx * 550
        qual_reach = int(base_reach * 0.48)
        target_reach = int(qual_reach * 0.42)
        final_reach = int(target_reach * 0.38)
        code_hash = make_sha256(e['code'])

        json_entries.append({
            "partTitle": e['title'],
            "codeHash": code_hash,
            "spec": {
                "template": "funnel",
                "title": f"{e['title'][:42]}... — Conversion Funnel",
                "steps": [
                    {
                        "at": "intro",
                        "caption": f"Top-of-funnel reach baseline ({base_reach:,} total audience entities).",
                        "activeStageId": "top",
                        "stages": [
                            {"id": "top", "label": "Total Audience Reach", "value": base_reach, "percentage": 100, "tone": "data"},
                            {"id": "qual", "label": "Qualified Cohort Intent", "value": qual_reach, "percentage": 48, "dropoffRate": 52, "tone": "ok"},
                            {"id": "target", "label": "Target Segment Evaluation", "value": target_reach, "percentage": 20, "dropoffRate": 58, "tone": "ok"},
                            {"id": "final", "label": "Retained Active Customers", "value": final_reach, "percentage": 7.6, "dropoffRate": 62, "tone": "idle"}
                        ]
                    },
                    {
                        "at": "say1",
                        "caption": f"Qualification filters screen for economic viability ({qual_reach:,} qualified entities).",
                        "activeStageId": "qual",
                        "stages": [
                            {"id": "top", "label": "Total Audience Reach", "value": base_reach, "percentage": 100, "tone": "data"},
                            {"id": "qual", "label": "Qualified Cohort Intent", "value": qual_reach, "percentage": 48, "dropoffRate": 52, "tone": "ok"},
                            {"id": "target", "label": "Target Segment Evaluation", "value": target_reach, "percentage": 20, "dropoffRate": 58, "tone": "ok"},
                            {"id": "final", "label": "Retained Active Customers", "value": final_reach, "percentage": 7.6, "dropoffRate": 62, "tone": "idle"}
                        ]
                    },
                    {
                        "at": "example",
                        "caption": f"Targeting alignment yields high engagement depth ({target_reach:,} evaluating alternatives).",
                        "activeStageId": "target",
                        "stages": [
                            {"id": "top", "label": "Total Audience Reach", "value": base_reach, "percentage": 100, "tone": "data"},
                            {"id": "qual", "label": "Qualified Cohort Intent", "value": qual_reach, "percentage": 48, "dropoffRate": 52, "tone": "ok"},
                            {"id": "target", "label": "Target Segment Evaluation", "value": target_reach, "percentage": 20, "dropoffRate": 58, "tone": "ok"},
                            {"id": "final", "label": "Retained Active Customers", "value": final_reach, "percentage": 7.6, "dropoffRate": 62, "tone": "idle"}
                        ]
                    },
                    {
                        "at": "tryIt",
                        "caption": f"Final unit conversion achieves stable unit economics ({final_reach:,} retained units).",
                        "activeStageId": "final",
                        "stages": [
                            {"id": "top", "label": "Total Audience Reach", "value": base_reach, "percentage": 100, "tone": "data"},
                            {"id": "qual", "label": "Qualified Cohort Intent", "value": qual_reach, "percentage": 48, "dropoffRate": 52, "tone": "ok"},
                            {"id": "target", "label": "Target Segment Evaluation", "value": target_reach, "percentage": 20, "dropoffRate": 58, "tone": "ok"},
                            {"id": "final", "label": "Retained Active Customers", "value": final_reach, "percentage": 7.6, "dropoffRate": 62, "tone": "idle"}
                        ]
                    }
                ]
            }
        })

    return {
        "schemaVersion": 1,
        "prefix": prefix,
        "day": day,
        "promptSha": "40f8f16b2525e42c7f0b483d22d713d09de2863485546f1f4616ab814dbe7a68",
        "model": "anthropic/claude-3.5-sonnet",
        "entries": json_entries
    }

def generate_ledger_sheet_visual(prefix: str, day: int, entries: list) -> dict:
    json_entries = []
    for idx, e in enumerate(entries):
        base_amount = 25000 + day * 3500 + idx * 1250
        adjustment = int(base_amount * 0.20)
        code_hash = make_sha256(e['code'])

        json_entries.append({
            "partTitle": e['title'],
            "codeHash": code_hash,
            "spec": {
                "template": "ledger-sheet",
                "title": f"{e['title'][:42]}... — General Ledger Verification",
                "steps": [
                    {
                        "at": "intro",
                        "caption": f"Step 1: Open primary facility debit entry (${base_amount:,}) for {e['title'][:35]}...",
                        "title": f"Day {day} Journal — Initial Posting",
                        "isBalanced": True,
                        "totalDebit": base_amount,
                        "totalCredit": base_amount,
                        "entries": [
                            {
                                "id": f"JNL-{day}01",
                                "account": "Primary Operating Asset / Commercial Facility",
                                "debit": base_amount,
                                "balance": base_amount,
                                "tone": "data",
                                "memo": "Initial facility recognition"
                            },
                            {
                                "id": f"JNL-{day}02",
                                "account": "Clearing & Settlement Control / Syndicate Funding",
                                "credit": base_amount,
                                "balance": 0,
                                "tone": "ok",
                                "memo": "Offset settlement control"
                            }
                        ]
                    },
                    {
                        "at": "say1",
                        "caption": f"Step 2: Record secondary interest & fee accrual adjustment (${adjustment:,}).",
                        "title": f"Day {day} Journal — Accrual Adjustment",
                        "isBalanced": True,
                        "totalDebit": base_amount + adjustment,
                        "totalCredit": base_amount + adjustment,
                        "entries": [
                            {
                                "id": f"JNL-{day}01",
                                "account": "Primary Operating Asset / Commercial Facility",
                                "debit": base_amount,
                                "balance": base_amount,
                                "tone": "ok"
                            },
                            {
                                "id": f"JNL-{day}03",
                                "account": "Accrued Facility Interest / Fee Receivable",
                                "debit": adjustment,
                                "balance": base_amount + adjustment,
                                "tone": "data"
                            },
                            {
                                "id": f"JNL-{day}02",
                                "account": "Clearing & Settlement Control / Syndicate Funding",
                                "credit": base_amount + adjustment,
                                "balance": 0,
                                "tone": "ok"
                            }
                        ]
                    },
                    {
                        "at": "example",
                        "caption": f"Step 3: Verification of institutional reserve provisioning & counterparty collateral.",
                        "title": f"Day {day} Journal — Collateral & Reserve Alignment",
                        "isBalanced": True,
                        "totalDebit": base_amount + adjustment,
                        "totalCredit": base_amount + adjustment,
                        "entries": [
                            {
                                "id": f"JNL-{day}01",
                                "account": "Primary Operating Asset / Commercial Facility",
                                "debit": base_amount,
                                "balance": base_amount,
                                "tone": "ok"
                            },
                            {
                                "id": f"JNL-{day}03",
                                "account": "Accrued Facility Interest / Fee Receivable",
                                "debit": adjustment,
                                "balance": base_amount + adjustment,
                                "tone": "ok"
                            },
                            {
                                "id": f"JNL-{day}02",
                                "account": "Clearing & Settlement Control / Syndicate Funding",
                                "credit": base_amount + adjustment,
                                "balance": 0,
                                "tone": "ok"
                            }
                        ]
                    },
                    {
                        "at": "tryIt",
                        "caption": f"Step 4: Real-time balance sheet reconciliation and regulatory capital confirmation.",
                        "title": f"Day {day} Journal — Balanced Closure",
                        "isBalanced": True,
                        "totalDebit": base_amount + adjustment,
                        "totalCredit": base_amount + adjustment,
                        "entries": [
                            {
                                "id": f"JNL-{day}01",
                                "account": "Primary Operating Asset / Commercial Facility",
                                "debit": base_amount,
                                "balance": base_amount,
                                "tone": "ok"
                            },
                            {
                                "id": f"JNL-{day}03",
                                "account": "Accrued Facility Interest / Fee Receivable",
                                "debit": adjustment,
                                "balance": base_amount + adjustment,
                                "tone": "ok"
                            },
                            {
                                "id": f"JNL-{day}02",
                                "account": "Clearing & Settlement Control / Syndicate Funding",
                                "credit": base_amount + adjustment,
                                "balance": 0,
                                "tone": "ok"
                            }
                        ]
                    }
                ]
            }
        })

    return {
        "schemaVersion": 1,
        "prefix": prefix,
        "day": day,
        "promptSha": "40f8f16b2525e42c7f0b483d22d713d09de2863485546f1f4616ab814dbe7a68",
        "model": "anthropic/claude-3.5-sonnet",
        "entries": json_entries
    }

def generate_workflow_visual(prefix: str, day: int, entries: list) -> dict:
    import copy
    json_entries = []
    default_stages = [
        {"id": "s1", "name": "Demand Forecast", "subtext": "EOQ / Safety Stock", "tone": "data"},
        {"id": "s2", "name": "Procurement & WIP", "subtext": "Kanban Pull", "tone": "data"},
        {"id": "s3", "name": "Six Sigma QA", "subtext": "Control Limits", "tone": "ok"},
        {"id": "s4", "name": "Fulfillment SLA", "subtext": "OTIF 99.4%", "tone": "ok"}
    ]

    for idx, e in enumerate(entries):
        code_hash = make_sha256(e['code'])
        title_truncated = e['title'][:45]
        spec = {
            "template": "workflow",
            "title": f"{title_truncated}... — Operational Workflow",
            "stages": copy.deepcopy(default_stages),
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Stage 1 (Demand Forecast): Initialize {e['title'][:40]}...",
                    "activeStageId": "s1",
                    "statusBadge": "INGRESS",
                    "throughput": "100% Ready",
                    "tone": "data",
                    "stages": copy.deepcopy(default_stages)
                },
                {
                    "at": "say1",
                    "caption": f"Stage 2 (Procurement & WIP): Process core workflow stage.",
                    "activeStageId": "s2",
                    "statusBadge": "IN_PROGRESS",
                    "throughput": "Active",
                    "tone": "data",
                    "stages": copy.deepcopy(default_stages)
                },
                {
                    "at": "example",
                    "caption": f"Stage 3 (Six Sigma QA): Verify quality and invariants.",
                    "activeStageId": "s3",
                    "statusBadge": "VALIDATED",
                    "throughput": "Zero Defects",
                    "tone": "ok",
                    "stages": copy.deepcopy(default_stages)
                },
                {
                    "at": "tryIt",
                    "caption": f"Stage 4 (Fulfillment SLA): Commit end-to-end delivery.",
                    "activeStageId": "s4",
                    "statusBadge": "COMPLETED",
                    "throughput": "SLA Met \u2713",
                    "tone": "ok",
                    "stages": copy.deepcopy(default_stages)
                }
            ]
        }

        json_entries.append({
            "partTitle": e['title'],
            "codeHash": code_hash,
            "spec": spec,
            "filled": copy.deepcopy(spec)
        })

    return {
        "schemaVersion": 1,
        "prefix": prefix,
        "day": day,
        "promptSha": "40f8f16b2525e42c7f0b483d22d713d09de2863485546f1f4616ab814dbe7a68",
        "model": "anthropic/claude-3.5-sonnet",
        "entries": json_entries
    }

