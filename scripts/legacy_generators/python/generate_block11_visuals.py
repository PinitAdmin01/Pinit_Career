import hashlib
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.abspath('scripts'))

from design_day51_data import DAY_51
from design_day52_data import DAY_52
from design_day53_data import DAY_53
from design_day54_data import DAY_54
from design_day55_data import DAY_55

DAYS = [DAY_51, DAY_52, DAY_53, DAY_54, DAY_55]

VISUAL_DIR = 'src/lib/data/lessonVisuals/design'
os.makedirs(VISUAL_DIR, exist_ok=True)

VISUAL_SPECS = {
    51: {
        "step_labels": [
            ["Unstructured JSON Map", "DTCG Dollar Schema", "Type Metadata Declaration", "Normalized Token Tree"],
            ["Raw Hex Color Strings", "Standard DTCG Color Object", "Dimension Value and Unit", "Validated Primitive Node"],
            ["Disjoint CSS Properties", "Composite Typography Token", "Sub-Value Map Extraction", "Atomic Property Expansion"],
            ["Hardcoded Literal Values", "Alias Reference Pointer", "Dependency Graph Walking", "Resolved Concrete Token"]
        ],
        "captions": [
            [
                "Legacy designs store arbitrary key value pairs without standard semantics.",
                "The Community Group standard enforces dollar value and dollar type properties.",
                "Explicit token types enable automated validation and multi-platform compilation.",
                "Normalized design token trees establish a single deterministic source of truth."
            ],
            [
                "Primitive visual constants are represented as strongly typed token objects.",
                "Color definitions specify color spaces and explicit hex or oklch values.",
                "Dimension tokens declare explicit unit values such as pixels or rem units.",
                "Strong typing prevents runtime CSS parsing failures across consumer applications."
            ],
            [
                "Composite tokens bundle related typography or shadow properties together.",
                "Typography bundles font family, font size, line height, and font weight.",
                "Compilers extract individual sub-values for targeted platform emitters.",
                "Atomic expansion enables platforms to consume composite properties cleanly."
            ],
            [
                "Design systems link semantic tokens to primitives through alias references.",
                "Curly brace pointers denote references to global foundation values.",
                "Reference resolvers construct directed acyclic graphs to detect cycles.",
                "Deep references resolve into concrete leaf values for runtime stylesheet injection."
            ]
        ]
    },
    52: {
        "step_labels": [
            ["Single Flat Palette", "Global Primitive Tier", "Semantic Purpose Tier", "Component Scoped Tier"],
            ["Hardcoded Brand Styles", "Brand Delta Manifest", "Recursive Token Merge", "Branded Design System"],
            ["Global Window Pollution", "Data Theme Attribute", "CSS Custom Property Scope", "Nested Subtree Override"],
            ["Standard Color Palette", "High Contrast Palette", "Perceptual Contrast Calculation", "Accessible Color Palette"]
        ],
        "captions": [
            [
                "Monolithic styling bundles color primitives directly into visual components.",
                "Global primitives define base scales independent of brand or intent.",
                "Semantic tokens map primitive values to specific user interface roles.",
                "Component tokens encapsulate private styles for targeted local overrides."
            ],
            [
                "Enterprise ecosystems demand multiple unique brand identities from one codebase.",
                "Brand manifests define surgical delta overrides atop common foundations.",
                "Deep recursive merging combines baseline primitives with brand tokens.",
                "Consumer applications inherit unique branding without duplicating core layouts."
            ],
            [
                "Unscoped global variables create collision hazards across nested widgets.",
                "Data theme attributes define isolated scopes on parent container nodes.",
                "Scoped custom properties restrict variable overrides to target subtrees.",
                "Nested elements reflect contextual brand styling without side effects."
            ],
            [
                "Standard brand palettes may fail strict regulatory contrast standards.",
                "High contrast mode overrides semantic tokens with maximized luminance.",
                "Algorithmic validation verifies high text contrast against solid surfaces.",
                "Accessible themes preserve brand essence while ensuring universal readability."
            ]
        ]
    },
    53: {
        "step_labels": [
            ["Raw JSON Token File", "Style Dictionary Parser", "Transformation Pipeline", "Platform Specific Artifact"],
            ["Pixel Unit Tokens", "Rem Unit Converter", "Oklch to Hex Converter", "Transformed Value Objects"],
            ["Manual Multi-Platform Setup", "CSS Custom Properties", "Swift Struct Declaration", "Kotlin Compose Object"],
            ["Manual File Copying", "Automated Token Build", "Package Version Bumping", "NPM and Maven Publishing"]
        ],
        "captions": [
            [
                "Style Dictionary consumes standardized tokens as input for automated build runs.",
                "The parser validates token structure against schema specifications.",
                "Configured transforms adapt values to target language syntax and conventions.",
                "Generators produce platform artifacts for web, mobile, and desktop runtimes."
            ],
            [
                "Web platforms require rem units while mobile native frameworks demand pixels.",
                "Value transformers calculate rem dimensions based on root font size.",
                "Color formatters convert advanced color spaces into compatible hex codes.",
                "Clean transformed values feed directly into native code templates."
            ],
            [
                "Engineers traditionally duplicate design tokens across separate codebases.",
                "Web outputs generate CSS custom property declarations within root rules.",
                "iOS targets receive Swift structs with static color and dimension constants.",
                "Android targets receive Kotlin Compose objects for Jetpack user interfaces."
            ],
            [
                "Manual token maintenance causes synchronization drift between platforms.",
                "Automated pipelines trigger token compilation upon every repository push.",
                "Semantic release tooling computes automated version numbers from commits.",
                "Distributed packages publish simultaneously to web and mobile package managers."
            ]
        ]
    },
    54: {
        "step_labels": [
            ["sRGB Color Gamut", "Oklab Color Space", "Oklch Polar Coordinates", "Perceptually Uniform Gamut"],
            ["WCAG Ratio Paradox", "APCA Contrast Algorithm", "Spatial Frequency Weight", "Polarity Aware Scoring"],
            ["Manual Dark Palette", "Algorithmic Luminance Invert", "Chroma Suppression Pass", "Harmonious Dark Theme"],
            ["Standard Color Vision", "Protanopia Simulation", "Deuteranopia Simulation", "Universal Color Affirmation"]
        ],
        "captions": [
            [
                "Legacy color spaces exhibit non-uniform perceived lightness across hues.",
                "Oklab establishes cylindrical coordinates with uniform lightness axes.",
                "Oklch enables intuitive adjustments to lightness, chroma, and hue angles.",
                "Perceptually uniform scales ensure smooth color gradations across all themes."
            ],
            [
                "Mathematical contrast ratios fail to reflect human visual perception accurately.",
                "The Advanced Perceptual Contrast Algorithm evaluates spatial frequency.",
                "Light text on dark surfaces is scored differently from dark on light.",
                "Accurate contrast scores eliminate false passes and unreadable text."
            ],
            [
                "Naive color inversion produces harsh and unreadable dark interfaces.",
                "Luminance inversion shifts brightness while preserving relative hue contrasts.",
                "Chroma suppression softens saturated colors to prevent visual vibration.",
                "Harmonious dark themes reduce eye fatigue while maintaining brand recognition."
            ],
            [
                "Color deficiency affects a significant portion of user populations.",
                "Matrices simulate red-green and blue-yellow color vision deficiencies.",
                "Color palette auditing confirms sufficient lightness difference without hue cues.",
                "Design systems validate multi-gamut readability before production release."
            ]
        ]
    },
    55: {
        "step_labels": [
            ["Multi-Brand Token Architecture", "DTCG Parser and Cycle Resolver", "Style Dictionary Multi-Platform", "Live DOM CSS Variable Injection"],
            ["Unparsed Token JSON Streams", "AST Generation and Type Checking", "Cyclic Reference Detection", "Compiled Token Tree"],
            ["Base Foundation Primitives", "Brand Delta Overrides", "Runtime Theme Switcher", "Live CSS Property Updates"],
            ["Color Theme Palette", "Perceptual Contrast Calculation", "Automated APCA Verification", "Accessible Production Release"]
        ],
        "captions": [
            [
                "Enterprise systems unify cross-platform tokens into a single pipeline.",
                "Token parsers validate types and resolve reference aliases across brands.",
                "Build pipelines emit target assets for web and native mobile clients.",
                "Client runtimes inject custom properties dynamically upon theme selection."
            ],
            [
                "Token files stream into the compiler from multiple brand repositories.",
                "Syntax parsers validate property schemas and token type declarations.",
                "Graph traversal detects and flags recursive circular alias dependencies.",
                "Compiled token dictionaries feed downstream code generation targets."
            ],
            [
                "Base themes establish foundational spacing, typography, and core elevations.",
                "Brand overrides swap semantic color values without altering structural metrics.",
                "Runtime managers toggle data theme attributes on document root elements.",
                "Targeted stylesheets update visual appearance instantaneously without reloading."
            ],
            [
                "Dynamic themes undergo real-time perceptual contrast verification.",
                "Calculators evaluate contrast scores across all text and background pairings.",
                "Automated assertion checks fail builds that violate accessibility thresholds.",
                "Certified multi-brand token suites guarantee compliance and brand fidelity."
            ]
        ]
    }
}

for day_data in DAYS:
    day_num = day_data['day']
    spec = VISUAL_SPECS[day_num]
    
    visuals = []
    for v_idx in range(4):
        part = day_data['parts'][v_idx]
        code = part.get('code', '')
        code_hash = hashlib.sha256(code.encode('utf-8')).hexdigest()
        
        prompt = f"Architectural and conceptual diagram for Day {day_num} Part {v_idx + 1}: {part['title']}. Visualizing step progression with compare template."
        prompt_sha = hashlib.sha256(prompt.encode('utf-8')).hexdigest()
        
        steps = []
        for s_idx in range(4):
            title = spec["step_labels"][v_idx][s_idx]
            caption = spec["captions"][v_idx][s_idx]
            
            # Verify no digits in caption
            assert not re.search(r'\d', caption), f"Day {day_num} Part {v_idx+1} Step {s_idx+1} caption has digits: {caption}"
            assert caption.endswith('.'), f"Caption must end with period: {caption}"
            
            steps.append({
                "step": s_idx + 1,
                "title": title,
                "caption": caption
            })
            
        visuals.append({
            "partIndex": v_idx + 1,
            "template": "compare",
            "prompt": prompt,
            "promptSha": prompt_sha,
            "codeHash": code_hash,
            "steps": steps
        })
        
    envelope = {
        "schemaVersion": "2.0",
        "courseId": "course-design-systems",
        "day": day_num,
        "visuals": visuals
    }
    
    out_path = os.path.join(VISUAL_DIR, f"day-{day_num}.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(envelope, f, indent=2)
    print(f"Generated Gate v2 visual: {out_path}")

print("All Block 11 visual envelopes generated successfully!")
