captions_data = [
    {
        "say1": "Linear autoregressive generation lacks backtracking for complex problems.",
        "say2": "Early reasoning assumptions lock forward generation into justifying flaws.",
        "example": "A chess player visualizes multiple competing moves before acting.",
        "tryIt": "Trace how linear prompt chains get trapped in flawed early commitments."
    },
    {
        "say1": "Tree of thoughts decouples generation from evaluation across state trees.",
        "say2": "Thought generators create branching candidate paths from current states.",
        "example": "Medical diagnostic teams formulate candidate hypotheses from evidence.",
        "tryIt": "Construct independent generation and evaluation prompts to score nodes."
    },
    {
        "say1": "Search algorithms govern efficiency and traversal across reasoning trees.",
        "say2": "Breadth first beam search retains only the top scoring candidate nodes.",
        "example": "Route planning algorithms explore highway corridors using cost estimates.",
        "tryIt": "Implement a beam search controller retaining top candidate paths."
    },
    {
        "say1": "Graph of thoughts expands tree structures into directed cognitive graphs.",
        "say2": "Thought aggregation combines insights from multiple reasoning branches.",
        "example": "Corporate mergers consolidate financial audits into unified agreements.",
        "tryIt": "Design a graph aggregation prompt merging multiple exploratory branches."
    },
    {
        "say1": "Enterprise cognitive architectures implement python controller harnesses.",
        "say2": "Separation divides search harnesses from heuristic scoring oracles.",
        "example": "Air traffic management software routes aircraft through safe waypoints.",
        "tryIt": "Build a modular Python class with frontier priority queue management."
    }
]

for p_idx, caps in enumerate(captions_data):
    for k, cap in caps.items():
        assert len(cap) <= 75, f"P{p_idx+1} {k} too long: {len(cap)} ({cap})"
        assert cap.endswith('.'), f"P{p_idx+1} {k} missing dot: {cap}"
        assert not any(c.isdigit() for c in cap), f"P{p_idx+1} {k} has digits: {cap}"
        print(f"P{p_idx+1} {k}: OK ({len(cap)} chars)")
print("ALL DAY 31 CAPTIONS VALIDATED!")
