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

with open("scripts/branch_c/day36_lesson.json") as f:
    lesson = json.load(f)

captions_data = [
    # Part 1
    {
        "say1": "Large scale genomic comparisons execute constant time substring checks.",
        "say2": "String polynomial hash maps character values into finite modulus.",
        "example": "Cloud platform indexing pipeline analyzes millions of code tokens.",
        "tryIt": "Hasher precomputes powers producing distinct substring fingerprints."
    },
    # Part 2
    {
        "say1": "Single hash comparisons risk silent data corruption on distinct strings.",
        "say2": "Birthday paradox triggers collisions across finite hash space.",
        "example": "Enterprise security gateway inspects packet payloads without false alarms.",
        "tryIt": "Double string hasher extracts dual hash tuples for distinct phrases."
    },
    # Part 3
    {
        "say1": "Rabin Karp locates pattern occurrences within text without quadratic cost.",
        "say2": "Sliding window updates rolling hash as trailing character enters.",
        "example": "Database firewall scans incoming network packets for injection strings.",
        "tryIt": "Searcher matches pattern hash finding all motif occurrences cleanly."
    },
    # Part 4
    {
        "say1": "Hashing accelerates longest common prefix and palindrome queries.",
        "say2": "Binary search evaluates suffix equality across prefix length intervals.",
        "example": "Genomic engine identifies palindromic hairpin repeats in chromosome.",
        "tryIt": "String oracle computes longest common prefix and checks radar symmetry."
    },
    # Part 5
    {
        "say1": "Genomic sequencing pipeline deduplicates nucleotide fragments.",
        "say2": "Oracle maps nucleotide alphabet to dense integers with dual prime bases.",
        "example": "Oncology pipeline detects repetitive promoter duplications across genome.",
        "tryIt": "Suite extracts duplicate genomic promoters and confirms exact match."
    }
]

print("=== Strict Verification Day 36 ===")
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
