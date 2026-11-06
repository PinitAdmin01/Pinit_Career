captions_data = [
    {
        "say1": "Directional stimulus prompting guides attention toward desired focal areas.",
        "say2": "Standard foundation prompts often emphasize irrelevant peripheral details.",
        "example": "A museum docent points visitors directly toward pivotal gallery art.",
        "tryIt": "Inject directional stimulus hints to steering summary attention weights."
    },
    {
        "say1": "The policy model architecture decouples hint generation from generation.",
        "say2": "Lightweight policy models generate compact directional hints in parallel.",
        "example": "Tugboats guide massive ocean vessels into tight metropolitan dock spaces.",
        "tryIt": "Deploy small policy models to emit targeted directional guidance tokens."
    },
    {
        "say1": "Meta prompting architectures utilize recursive reflection to optimize text.",
        "say2": "Evaluator models critique generated drafts and output refined instructions.",
        "example": "Editors critique rough drafts and provide structural guidance to authors.",
        "tryIt": "Build meta prompt rewriting loops using evaluation score feedback."
    },
    {
        "say1": "Gradient free prompt tuning algorithms explore vast linguistic spaces.",
        "say2": "Automatic prompt engineers mutate candidate prompts using fitness scores.",
        "example": "Biological evolution breeds diverse genetic variants across generations.",
        "tryIt": "Run evolutionary prompt mutation cycles evaluating candidates on test sets."
    },
    {
        "say1": "Production directional stimulus engines require hardened python pipelines.",
        "say2": "Dynamic hint injection operates through cached domain guidance libraries.",
        "example": "Precision flight computers compute navigational drift adjustments.",
        "tryIt": "Construct an adaptive directional stimulus engine using python classes."
    }
]

for p_idx, caps in enumerate(captions_data):
    for k, cap in caps.items():
        assert len(cap) <= 75, f"P{p_idx+1} {k} too long: {len(cap)} ({cap})"
        assert cap.endswith('.'), f"P{p_idx+1} {k} missing dot: {cap}"
        assert not any(c.isdigit() for c in cap), f"P{p_idx+1} {k} has digits: {cap}"
        print(f"P{p_idx+1} {k}: OK ({len(cap)} chars)")
print("ALL DAY 32 CAPTIONS VALIDATED!")
