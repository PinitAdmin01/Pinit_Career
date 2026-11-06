import json
import re

STOP_WORDS = {
    'this', 'that', 'with', 'from', 'have', 'were', 'what', 'when', 'your', 'will',
    'then', 'them', 'they', 'some', 'each', 'also', 'just', 'into', 'only', 'more',
    'here', 'make', 'like', 'than', 'been', 'there', 'their', 'which', 'about', 'would',
    'could', 'should', 'other', 'these', 'those', 'after', 'first', 'where', 'while',
    'being', 'does', 'doing', 'look', 'same', 'over', 'such', 'most'
}

def get_important_words(text):
    words = re.findall(r'[a-z0-9]+', text.lower())
    return {w for w in words if len(w) >= 4 and w not in STOP_WORDS}

with open("scripts/branch_c/day35_lesson.json") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Massive routing infrastructure connects regional aggregation links.",
        "say2": "Hierarchical schedules balance formalizing multi commodity transit flow.",
        "example": "Algorithmic trading feeds traverse regional aggregation interface.",
        "tryIt": "Routing graphs enforce discrete hierarchical attributes on links."
    },
    # Part 2
    {
        "say1": "Augmenting flow paths maximize throughput across transit gateways.",
        "say2": "Reverse residual capacity cancels forward flow along transit edge.",
        "example": "Interface queue monitors uncover bottleneck links for provider.",
        "tryIt": "FlowEdge implementation verifies reachability and peak throughput."
    },
    # Part 3
    {
        "say1": "Link removal increases disconnected components across transit mesh.",
        "say2": "Resilience scanner scores single points of failure across subtree.",
        "example": "Submarine cable powers transatlantic communication across regions.",
        "tryIt": "Resilience implementation provides instantaneous diagnostic reports."
    },
    # Part 4
    {
        "say1": "Transient link flapping introduces control plane jitter during updates.",
        "say2": "Engine creates checkpoint to rollback unpredicted state churn.",
        "example": "Provider controller executes checkpoint rollback shedding payload.",
        "tryIt": "Parent pointers track component unions with instantaneous recovery."
    },
    # Part 5
    {
        "say1": "Cohesive architecture optimizes throughput removing bottleneck nodes.",
        "say2": "Autonomous infrastructure executes flow augmentation and formulation.",
        "example": "Secondary peering gateway absorbs broadcast traffic for provider.",
        "tryIt": "Verification represents pinnacle of throughput and resilience engineering."
    }
]

print("=== Strict Verification ===")
all_pass = True
for i, part in enumerate(lesson["parts"]):
    caps = captions_data[i]
    targets = {
        "say1": part["say"][0],
        "say2": part["say"][1],
        "example": part["example"],
        "tryIt": part["tryIt"]
    }
    for slot, caption in caps.items():
        if len(caption) > 75:
            print(f"FAIL: Part {i+1} {slot} len > 75: {len(caption)}")
            all_pass = False
        if not caption.endswith('.'):
            print(f"FAIL: Part {i+1} {slot} does not end with .: {caption}")
            all_pass = False
        if any(c.isdigit() for c in caption):
            print(f"FAIL: Part {i+1} {slot} contains digits: {caption}")
            all_pass = False
        cap_w = get_important_words(caption)
        tgt_w = get_important_words(targets[slot])
        shared = cap_w & tgt_w
        if not shared:
            print(f"FAIL: Part {i+1} {slot} shares ZERO words with target! Cap words: {cap_w}, Target words: {tgt_w}")
            all_pass = False
        else:
            print(f"PASS: Part {i+1} {slot} shares {len(shared)} words: {shared}")

if all_pass:
    print("\nALL 20 SLOTS PASS 100%!")
