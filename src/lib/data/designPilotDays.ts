import { PilotDay } from '@/lib/types/lessonEngine';

export const DESIGN_PILOT_DAYS: PilotDay[] = [
  {
    "day": 1,
    "title": "Design Tokens & Semantic Color Scales: Global vs Semantic Aliases",
    "overviewMetaphor": "Design Tokens Are Currency Exchange Rates: If you hardcode '$100' everywhere, changing inflation requires rewriting 50,000 files; instead, you define the Global Base (`blue-500: #3b82f6`) and map it to the Semantic Alias (`color-bg-primary`), so switching themes swaps the exchange rate instantly without touching a single component (`DESIGN_TOKEN_RESOLVED_NOMINAL`).",
    "blocks": [
      {
        "id": "design-d1-b1-token-resolver",
        "day": 1,
        "blockNumber": 1,
        "title": "Design Tokens: Resolving Semantic Aliases (`color-bg-primary` $\\to$ Light/Dark Hex)",
        "conceptBudget": {
          "primaryConcept": "Design Token Semantic Alias Resolver",
          "supportingTerms": [
            "Token Name (`'color-bg-primary'`)",
            "Active Theme (`'light'` / `'dark'`)",
            "Resolved Hex Color (`'#ffffff'` / `'#0f172a'`)",
            "Status: Design Token Resolved Nominal"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "3-Tier Design Token Architecture Ledger",
              "boxes": [
                {
                  "label": "Tier 1: Global Primitive",
                  "value": "--slate-900: #0f172a | --white: #ffffff",
                  "varType": "Global Token",
                  "isUpdated": false
                },
                {
                  "label": "Tier 2: Semantic Alias",
                  "value": "--color-bg-primary: var(--white) (Light) / var(--slate-900) (Dark)",
                  "varType": "Semantic Alias",
                  "isUpdated": false
                },
                {
                  "label": "Tier 3: Component Binding",
                  "value": "Card background: var(--color-bg-primary) (RESOLVED NOMINAL!)",
                  "varType": "Component",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "token_resolver_demo.js",
            "initialCode": "function resolveToken(token, theme) {\n  const map = {\n    'color-bg-primary': { light: '#ffffff', dark: '#0f172a' },\n    'color-text-primary': { light: '#0f172a', dark: '#f8fafc' }\n  };\n  const hex = map[token][theme];\n  return {\n    token,\n    theme,\n    resolvedHexColor: hex,\n    status: 'DESIGN_TOKEN_RESOLVED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(resolveToken('color-bg-primary', 'light')));\nconsole.log(JSON.stringify(resolveToken('color-bg-primary', 'dark')));",
            "expectedOutput": "{\"token\":\"color-bg-primary\",\"theme\":\"light\",\"resolvedHexColor\":\"#ffffff\",\"status\":\"DESIGN_TOKEN_RESOLVED_NOMINAL\"}\n{\"token\":\"color-bg-primary\",\"theme\":\"dark\",\"resolvedHexColor\":\"#0f172a\",\"status\":\"DESIGN_TOKEN_RESOLVED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What hex color is resolved for 'color-bg-primary' in light mode?",
          "expectedStringOutput": "#ffffff",
          "acceptableAnswers": [
            "#ffffff",
            "resolvedHexColor\":\"#ffffff\"",
            "'#ffffff'"
          ],
          "primaryMisconceptionId": "MC_DS_DESIGN_TOKENS_SEMANTIC_COLOR_SCALES",
          "diagnosisMap": {
            "#0f172a": {
              "misconceptionId": "MC_DS_DESIGN_TOKENS_SEMANTIC_COLOR_SCALES",
              "errorExplanation": "#0f172a is dark mode. Light mode resolves to #ffffff.",
              "recoveryPath": {
                "simplerExplanation": "Hex is #ffffff.",
                "guidedFixPrompt": "Type #ffffff"
              }
            }
          }
        }
      },
      {
        "id": "design-d1-b2-design-token-tiers-count",
        "day": 1,
        "blockNumber": 2,
        "title": "The 3-Tier Design Token Hierarchy",
        "conceptBudget": {
          "primaryConcept": "3-Tier Token Invariant",
          "supportingTerms": [
            "3 Tiers (1. Global/Primitive Tokens, 2. Semantic/Alias Tokens, 3. Component-Scoped Tokens)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d1-b1-token-resolver",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "3-Tier Token CSS Architecture",
            "codeSnippet": "/* 1. Global Primitive */\n:root { --blue-500: #3b82f6; --red-500: #ef4444; }\n\n/* 2. Semantic Alias */\n[data-theme=\"light\"] { --color-interactive-brand: var(--blue-500); }\n\n/* 3. Component Scoped */\n.btn-primary { background: var(--color-interactive-brand); }",
            "lineNotes": {
              "1": "Tier 1: Primitives (raw colors).",
              "4": "Tier 2: Semantic meaning (intent).",
              "7": "Tier 3: Component consumption."
            }
          },
          {
            "type": "runnable_code",
            "filename": "token_tiers_count_demo.js",
            "initialCode": "function getTokenTiers() {\n  return 3;\n}\n\nconsole.log(getTokenTiers());",
            "expectedOutput": "3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many architectural tiers comprise a standard enterprise design token system?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "3 tiers",
            "three"
          ],
          "primaryMisconceptionId": "MC_DS_DESIGN_TOKENS_SEMANTIC_COLOR_SCALES",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_DS_DESIGN_TOKENS_SEMANTIC_COLOR_SCALES",
              "errorExplanation": "There are 3 tiers: Global, Semantic, and Component.",
              "recoveryPath": {
                "simplerExplanation": "Type 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "design-d1-b3-avoiding-raw-hex-hardcoding",
        "day": 1,
        "blockNumber": 3,
        "title": "Token Discipline: Eliminating Hardcoded Raw Hex Literals in Component CSS",
        "conceptBudget": {
          "primaryConcept": "Token Discipline Invariant",
          "supportingTerms": [
            "Token Discipline (`Never writing hardcoded '#3b82f6' inside button or card CSS; always referencing semantic CSS custom properties 'var(--color-brand)'`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d1-b2-design-token-tiers-count",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "token_discipline_demo.js",
            "initialCode": "function getTokenDisciplineRule() {\n  return 'CONSUME_SEMANTIC_TOKEN_VARIABLES_NEVER_HARDCODE_RAW_HEX_VALUES';\n}\n\nconsole.log(getTokenDisciplineRule());",
            "expectedOutput": "CONSUME_SEMANTIC_TOKEN_VARIABLES_NEVER_HARDCODE_RAW_HEX_VALUES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core rule governs component styling in design system architecture?",
          "expectedStringOutput": "CONSUME_SEMANTIC_TOKEN_VARIABLES_NEVER_HARDCODE_RAW_HEX_VALUES",
          "acceptableAnswers": [
            "CONSUME_SEMANTIC_TOKEN_VARIABLES_NEVER_HARDCODE_RAW_HEX_VALUES",
            "Never hardcode raw hex",
            "Consume semantic tokens"
          ],
          "primaryMisconceptionId": "MC_DS_DESIGN_TOKENS_SEMANTIC_COLOR_SCALES",
          "diagnosisMap": {
            "HARDCODE_HEX": {
              "misconceptionId": "MC_DS_DESIGN_TOKENS_SEMANTIC_COLOR_SCALES",
              "errorExplanation": "Rule is: CONSUME_SEMANTIC_TOKEN_VARIABLES_NEVER_HARDCODE_RAW_HEX_VALUES.",
              "recoveryPath": {
                "simplerExplanation": "Matches CONSUME_SEMANTIC_TOKEN_VARIABLES_NEVER_HARDCODE_RAW_HEX_VALUES.",
                "guidedFixPrompt": "Type CONSUME_SEMANTIC_TOKEN_VARIABLES_NEVER_HARDCODE_RAW_HEX_VALUES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Typography Grids & Modular Scaling: The Major Third Scale & Fluid clamp()",
    "overviewMetaphor": "Modular Typographic Scaling Is a Musical Chord Progression: Random font sizes (15px, 22px, 39px) sound like banging pots together; applying a mathematical Major Third ($1.250$) multiplier generates harmonious intervals ($16\\text{px} \\to 20\\text{px} \\to 25\\text{px} \\to 31.25\\text{px}$) that feel naturally balanced to the human eye.",
    "blocks": [
      {
        "id": "design-d2-b1-modular-scale-calculator",
        "day": 2,
        "blockNumber": 1,
        "title": "Modular Typography: Calculating Step 2 at $1.25$ Ratio ($25\\text{px} = 1.5625\\text{rem}$)",
        "conceptBudget": {
          "primaryConcept": "Modular Typographic Scale Step Calculator",
          "supportingTerms": [
            "Base Pixel Size ($16\\text{px}$)",
            "Scale Step 2 ($16 \\times 1.25^2 = 25\\text{px}$)",
            "Rem Conversion ($1.5625\\text{rem}$)",
            "Status: Typographic Scale Step Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d1-b1-token-resolver",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Major Third ($1.250$) Typographic Scale Ledger",
              "boxes": [
                {
                  "label": "Step 0 (Body Text)",
                  "value": "16px = 1.0rem (Base standard)",
                  "varType": "Base",
                  "isUpdated": false
                },
                {
                  "label": "Step 1 (Subheading)",
                  "value": "16 * 1.25 = 20px = 1.25rem",
                  "varType": "Step 1",
                  "isUpdated": false
                },
                {
                  "label": "Step 2 (Heading 2)",
                  "value": "16 * 1.25^2 = 25px = 1.5625rem (CALCULATED NOMINAL!)",
                  "varType": "Step 2",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "type_scale_demo.js",
            "initialCode": "function calcTypeStep(step, base, ratio) {\n  const px = Number((base * Math.pow(ratio, step)).toFixed(2));\n  const rem = Number((px / 16).toFixed(4));\n  return {\n    step,\n    pixelSize: px,\n    remSize: rem,\n    status: 'TYPOGRAPHIC_SCALE_STEP_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcTypeStep(2, 16, 1.25)));",
            "expectedOutput": "{\"step\":2,\"pixelSize\":25,\"remSize\":1.5625,\"status\":\"TYPOGRAPHIC_SCALE_STEP_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What pixel font size is produced at Scale Step 2 using a 16px base and 1.25 ratio?",
          "expectedStringOutput": "25",
          "acceptableAnswers": [
            "25",
            "pixelSize\":25",
            "25px",
            "25 px"
          ],
          "primaryMisconceptionId": "MC_DS_TYPOGRAPHY_GRIDS_MODULAR_SCALING",
          "diagnosisMap": {
            "32": {
              "misconceptionId": "MC_DS_TYPOGRAPHY_GRIDS_MODULAR_SCALING",
              "errorExplanation": "16 * 1.25 * 1.25 = 25.",
              "recoveryPath": {
                "simplerExplanation": "Pixel size is 25.",
                "guidedFixPrompt": "Type 25"
              }
            }
          }
        }
      },
      {
        "id": "design-d2-b2-major-third-ratio-value",
        "day": 2,
        "blockNumber": 2,
        "title": "The Major Third Typographic Ratio: $1.25$",
        "conceptBudget": {
          "primaryConcept": "Major Third Ratio Invariant",
          "supportingTerms": [
            "Major Third Ratio (`1.250`: The most versatile typographic scale ratio for web SaaS dashboards and mobile applications)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d2-b1-modular-scale-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Modular Scales Hierarchy",
            "codeSnippet": "// 1. Major Second:   1.125 (Subtle, dense dashboards)\n// 2. Major Third:    1.250 (GOLD STANDARD for SaaS & web apps!)\n// 3. Perfect Fourth: 1.333 (High contrast marketing pages)\n// 4. Golden Ratio:   1.618 (Extreme dramatic contrast)",
            "lineNotes": {
              "1": "Dense dashboard ratio.",
              "2": "Major Third: 1.250.",
              "3": "Perfect Fourth: 1.333.",
              "4": "Golden Ratio: 1.618."
            }
          },
          {
            "type": "runnable_code",
            "filename": "major_third_demo.js",
            "initialCode": "function getMajorThirdRatio() {\n  return 1.25;\n}\n\nconsole.log(getMajorThirdRatio());",
            "expectedOutput": "1.25",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What numerical multiplier defines the Major Third modular typographic scaling ratio?",
          "expectedStringOutput": "1.25",
          "acceptableAnswers": [
            "1.25",
            "1.250",
            "1.25 multiplier"
          ],
          "primaryMisconceptionId": "MC_DS_TYPOGRAPHY_GRIDS_MODULAR_SCALING",
          "diagnosisMap": {
            "1.5": {
              "misconceptionId": "MC_DS_TYPOGRAPHY_GRIDS_MODULAR_SCALING",
              "errorExplanation": "1.5 is Perfect Fifth. Major Third is 1.25.",
              "recoveryPath": {
                "simplerExplanation": "Type 1.25.",
                "guidedFixPrompt": "Type 1.25"
              }
            }
          }
        }
      },
      {
        "id": "design-d2-b3-fluid-typography-clamp-formula",
        "day": 2,
        "blockNumber": 3,
        "title": "Fluid Typography: Scaling Smoothly Across Viewports with CSS clamp()",
        "conceptBudget": {
          "primaryConcept": "Fluid Typography Invariant",
          "supportingTerms": [
            "CSS clamp() (`font-size: clamp(1rem, 2.5vw, 2rem)` scales smoothly between 16px and 32px without jagged breakpoint jumps)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d2-b2-major-third-ratio-value",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "fluid_type_demo.js",
            "initialCode": "function getFluidTypeRule() {\n  return 'USE_CSS_CLAMP_FOR_FLUID_RESPONSIVE_TYPOGRAPHY_SCALING';\n}\n\nconsole.log(getFluidTypeRule());",
            "expectedOutput": "USE_CSS_CLAMP_FOR_FLUID_RESPONSIVE_TYPOGRAPHY_SCALING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What CSS function enables fluid responsive typography without media query breakpoint jumps?",
          "expectedStringOutput": "USE_CSS_CLAMP_FOR_FLUID_RESPONSIVE_TYPOGRAPHY_SCALING",
          "acceptableAnswers": [
            "USE_CSS_CLAMP_FOR_FLUID_RESPONSIVE_TYPOGRAPHY_SCALING",
            "CSS clamp",
            "clamp()"
          ],
          "primaryMisconceptionId": "MC_DS_TYPOGRAPHY_GRIDS_MODULAR_SCALING",
          "diagnosisMap": {
            "MEDIA_QUERIES_ONLY": {
              "misconceptionId": "MC_DS_TYPOGRAPHY_GRIDS_MODULAR_SCALING",
              "errorExplanation": "Fluid scaling uses: USE_CSS_CLAMP_FOR_FLUID_RESPONSIVE_TYPOGRAPHY_SCALING.",
              "recoveryPath": {
                "simplerExplanation": "Matches USE_CSS_CLAMP_FOR_FLUID_RESPONSIVE_TYPOGRAPHY_SCALING.",
                "guidedFixPrompt": "Type USE_CSS_CLAMP_FOR_FLUID_RESPONSIVE_TYPOGRAPHY_SCALING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Spacing Systems & 8pt Mathematical Grid Hierarchy",
    "overviewMetaphor": "The 8pt Spacing Grid Is Standardized Shipping Containers in Global Freight: If every factory builds random-sized boxes (13cm, 19cm, 37cm), cargo ships waste 40% of their hold in awkward gaps; standardizing every padding, margin, and layout gap on multiples of 8 ($8\\text{px}, 16\\text{px}, 24\\text{px}, 32\\text{px}$) ensures components stack seamlessly across any viewport.",
    "blocks": [
      {
        "id": "design-d3-b1-spacing-grid-auditor",
        "day": 3,
        "blockNumber": 1,
        "title": "Spacing Grid: Auditing Clean 8pt Alignment ($24\\text{px}$) & 4pt Micro-Steps ($12\\text{px}$)",
        "conceptBudget": {
          "primaryConcept": "8pt Spatial Grid Compliance Auditor",
          "supportingTerms": [
            "Pixel Dimension ($24\\text{px}$ & $12\\text{px}$)",
            "8pt Divisibility",
            "4pt Micro-Step Divisibility",
            "Status: Spatial Grid Compliant Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d2-b1-modular-scale-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "8pt Spatial Grid Hierarchy Ledger",
              "boxes": [
                {
                  "label": "Space-1 (8px)",
                  "value": "Tight component internal padding",
                  "varType": "8pt Base",
                  "isUpdated": false
                },
                {
                  "label": "Space-2 (16px)",
                  "value": "Standard card padding and input spacing",
                  "varType": "8pt Base",
                  "isUpdated": false
                },
                {
                  "label": "Space-3 (24px)",
                  "value": "24px % 8 === 0 (SPATIAL GRID COMPLIANT NOMINAL!)",
                  "varType": "8pt Base",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "spacing_grid_demo.js",
            "initialCode": "function auditSpacing(px) {\n  const ok = px % 8 === 0 || px % 4 === 0;\n  return {\n    pixelDimension: px,\n    isCompliant: ok,\n    status: ok ? 'SPATIAL_GRID_COMPLIANT_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditSpacing(24)));\nconsole.log(JSON.stringify(auditSpacing(12)));",
            "expectedOutput": "{\"pixelDimension\":24,\"isCompliant\":true,\"status\":\"SPATIAL_GRID_COMPLIANT_NOMINAL\"}\n{\"pixelDimension\":12,\"isCompliant\":true,\"status\":\"SPATIAL_GRID_COMPLIANT_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a UI element's padding conforms to the 8pt/4pt spatial grid standard?",
          "expectedStringOutput": "SPATIAL_GRID_COMPLIANT_NOMINAL",
          "acceptableAnswers": [
            "SPATIAL_GRID_COMPLIANT_NOMINAL",
            "status\":\"SPATIAL_GRID_COMPLIANT_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_DS_SPACING_SYSTEMS_8PT_GRID_HIERARCHY",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DS_SPACING_SYSTEMS_8PT_GRID_HIERARCHY",
              "errorExplanation": "24px and 12px are clean multiples: SPATIAL_GRID_COMPLIANT_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches SPATIAL_GRID_COMPLIANT_NOMINAL.",
                "guidedFixPrompt": "Type SPATIAL_GRID_COMPLIANT_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "design-d3-b2-standard-grid-base-number",
        "day": 3,
        "blockNumber": 2,
        "title": "The Standard Spatial Grid Base: 8",
        "conceptBudget": {
          "primaryConcept": "Grid Base Invariant",
          "supportingTerms": [
            "Base 8 (`8px is the universal digital screen grid base because 8 divides evenly into common display resolutions: 1080p, 1440p, 4K`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d3-b1-spacing-grid-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "8pt Spatial Token Scale",
            "codeSnippet": "// --space-1: 8px   (1 * 8)\n// --space-2: 16px  (2 * 8)\n// --space-3: 24px  (3 * 8)\n// --space-4: 32px  (4 * 8)\n// --space-6: 48px  (6 * 8)\n// --space-8: 64px  (8 * 8)",
            "lineNotes": {
              "1": "1x step: 8px.",
              "2": "2x step: 16px.",
              "3": "3x step: 24px.",
              "4": "4x step: 32px.",
              "5": "6x step: 48px.",
              "6": "8x step: 64px."
            }
          },
          {
            "type": "runnable_code",
            "filename": "grid_base_demo.js",
            "initialCode": "function getGridBase() {\n  return 8;\n}\n\nconsole.log(getGridBase());",
            "expectedOutput": "8",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What integer pixel value represents the foundational base unit of the standard UI spatial grid?",
          "expectedStringOutput": "8",
          "acceptableAnswers": [
            "8",
            "8px",
            "eight"
          ],
          "primaryMisconceptionId": "MC_DS_SPACING_SYSTEMS_8PT_GRID_HIERARCHY",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_DS_SPACING_SYSTEMS_8PT_GRID_HIERARCHY",
              "errorExplanation": "10 does not divide into standard subpixel grids. The standard base is 8.",
              "recoveryPath": {
                "simplerExplanation": "Type 8.",
                "guidedFixPrompt": "Type 8"
              }
            }
          }
        }
      },
      {
        "id": "design-d3-b3-eliminating-arbitrary-magic-margins",
        "day": 3,
        "blockNumber": 3,
        "title": "Zero Magic Numbers: Banning Arbitrary Margins (e.g. `margin: 17px`)",
        "conceptBudget": {
          "primaryConcept": "Magic Number Elimination Invariant",
          "supportingTerms": [
            "Zero Magic Numbers (`Banning arbitrary ad-hoc values like 'margin-top: 17px' in code review linters; all spacing must map to discrete tokens`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d3-b2-standard-grid-base-number",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "no_magic_numbers_demo.js",
            "initialCode": "function getSpacingRule() {\n  return 'BAN_ARBITRARY_MAGIC_SPACING_NUMBERS_IN_FAVOR_OF_8PT_TOKENS';\n}\n\nconsole.log(getSpacingRule());",
            "expectedOutput": "BAN_ARBITRARY_MAGIC_SPACING_NUMBERS_IN_FAVOR_OF_8PT_TOKENS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What design system linting rule prevents visual layout inconsistency?",
          "expectedStringOutput": "BAN_ARBITRARY_MAGIC_SPACING_NUMBERS_IN_FAVOR_OF_8PT_TOKENS",
          "acceptableAnswers": [
            "BAN_ARBITRARY_MAGIC_SPACING_NUMBERS_IN_FAVOR_OF_8PT_TOKENS",
            "Ban arbitrary magic numbers",
            "No magic spacing numbers"
          ],
          "primaryMisconceptionId": "MC_DS_SPACING_SYSTEMS_8PT_GRID_HIERARCHY",
          "diagnosisMap": {
            "ALLOW_ANY": {
              "misconceptionId": "MC_DS_SPACING_SYSTEMS_8PT_GRID_HIERARCHY",
              "errorExplanation": "Rule is: BAN_ARBITRARY_MAGIC_SPACING_NUMBERS_IN_FAVOR_OF_8PT_TOKENS.",
              "recoveryPath": {
                "simplerExplanation": "Matches BAN_ARBITRARY_MAGIC_SPACING_NUMBERS_IN_FAVOR_OF_8PT_TOKENS.",
                "guidedFixPrompt": "Type BAN_ARBITRARY_MAGIC_SPACING_NUMBERS_IN_FAVOR_OF_8PT_TOKENS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Elevation, Shadows & Z-Index Layer Stacking Scales",
    "overviewMetaphor": "The Semantic Z-Index Scale Is a Multi-Story Architecture Building: Dropdowns live on floor 100, Sticky headers on floor 200, Modal Backdrops on floor 900, and Toast alerts on the penthouse rooftop floor 1100 (`toast: 1100`); using random numbers (`z-index: 99999`) is like a tenant building a rogue treehouse that collides with the elevators.",
    "blocks": [
      {
        "id": "design-d4-b1-semantic-zindex-resolver",
        "day": 4,
        "blockNumber": 1,
        "title": "Elevation & Z-Index: Resolving `dropdown (100)`, `modal (1000)`, `toast (1100)`",
        "conceptBudget": {
          "primaryConcept": "Semantic Z-Index Scale Hierarchy Resolver",
          "supportingTerms": [
            "Dropdown Layer ($100$)",
            "Sticky Layer ($200$)",
            "Modal Backdrop Layer ($900$)",
            "Modal Layer ($1000$)",
            "Toast Layer ($1100$)",
            "Status: Semantic ZIndex Resolved Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d3-b1-spacing-grid-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Semantic Z-Index Scale Architecture Ledger",
              "boxes": [
                {
                  "label": "Floor 100: Dropdown",
                  "value": "z-index: 100 (In-page interactive overlays)",
                  "varType": "Dropdown",
                  "isUpdated": false
                },
                {
                  "label": "Floor 1000: Modal",
                  "value": "z-index: 1000 (Focus-trapped dialog windows)",
                  "varType": "Modal",
                  "isUpdated": false
                },
                {
                  "label": "Floor 1100: Toast",
                  "value": "z-index: 1100 (Global alerts - RESOLVED NOMINAL!)",
                  "varType": "Toast",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "zindex_resolver_demo.js",
            "initialCode": "function resolveZIndex(layer) {\n  const scale = {\n    'dropdown': 100,\n    'sticky': 200,\n    'modal-backdrop': 900,\n    'modal': 1000,\n    'toast': 1100\n  };\n  return {\n    layer,\n    zIndexValue: scale[layer],\n    status: 'SEMANTIC_ZINDEX_RESOLVED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(resolveZIndex('dropdown')));\nconsole.log(JSON.stringify(resolveZIndex('modal')));\nconsole.log(JSON.stringify(resolveZIndex('toast')));",
            "expectedOutput": "{\"layer\":\"dropdown\",\"zIndexValue\":100,\"status\":\"SEMANTIC_ZINDEX_RESOLVED_NOMINAL\"}\n{\"layer\":\"modal\",\"zIndexValue\":1000,\"status\":\"SEMANTIC_ZINDEX_RESOLVED_NOMINAL\"}\n{\"layer\":\"toast\",\"zIndexValue\":1100,\"status\":\"SEMANTIC_ZINDEX_RESOLVED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What z-index value is assigned to the 'modal' layer in the semantic stacking scale?",
          "expectedStringOutput": "1000",
          "acceptableAnswers": [
            "1000",
            "zIndexValue\":1000",
            "1,000"
          ],
          "primaryMisconceptionId": "MC_DS_ELEVATION_SHADOWS_ZINDEX_LAYERS",
          "diagnosisMap": {
            "9999": {
              "misconceptionId": "MC_DS_ELEVATION_SHADOWS_ZINDEX_LAYERS",
              "errorExplanation": "Arbitrary 9999 is an anti-pattern. Semantic modal layer is 1000.",
              "recoveryPath": {
                "simplerExplanation": "Value is 1000.",
                "guidedFixPrompt": "Type 1000"
              }
            }
          }
        }
      },
      {
        "id": "design-d4-b2-highest-zindex-layer-name",
        "day": 4,
        "blockNumber": 2,
        "title": "The Highest Elevation Layer: Toast Notifications",
        "conceptBudget": {
          "primaryConcept": "Toast Layer Invariant",
          "supportingTerms": [
            "Toast Layer (`'toast'`: The topmost z-index tier (1100), ensuring critical asynchronous system notifications always render above active modals and headers)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d4-b1-semantic-zindex-resolver",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Semantic Z-Index Hierarchy",
            "codeSnippet": "// 1. Base Content:    0\n// 2. Dropdowns:       100\n// 3. Sticky Headers:  200\n// 4. Modal Backdrop:  900\n// 5. Modals:          1000\n// 6. Toast Alerts:    1100 (HIGHEST ELEVATION!)",
            "lineNotes": {
              "1": "Base layer: 0.",
              "2": "Dropdown layer: 100.",
              "3": "Sticky header layer: 200.",
              "4": "Backdrop layer: 900.",
              "5": "Modal dialog layer: 1000.",
              "6": "Toast notification layer: 1100."
            }
          },
          {
            "type": "runnable_code",
            "filename": "toast_layer_demo.js",
            "initialCode": "function getHighestLayer() {\n  return 'toast';\n}\n\nconsole.log(getHighestLayer());",
            "expectedOutput": "toast",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What layer occupies the highest elevation tier in the semantic z-index scale?",
          "expectedStringOutput": "toast",
          "acceptableAnswers": [
            "toast",
            "Toast",
            "'toast'"
          ],
          "primaryMisconceptionId": "MC_DS_ELEVATION_SHADOWS_ZINDEX_LAYERS",
          "diagnosisMap": {
            "modal": {
              "misconceptionId": "MC_DS_ELEVATION_SHADOWS_ZINDEX_LAYERS",
              "errorExplanation": "Toasts must display over modals. The highest layer is toast.",
              "recoveryPath": {
                "simplerExplanation": "Type toast.",
                "guidedFixPrompt": "Type toast"
              }
            }
          }
        }
      },
      {
        "id": "design-d4-b3-multi-layer-box-shadows",
        "day": 4,
        "blockNumber": 3,
        "title": "Realistic Material Depth: Multi-Layer Key & Ambient Box-Shadows",
        "conceptBudget": {
          "primaryConcept": "Multi-Layer Shadow Invariant",
          "supportingTerms": [
            "Multi-Layer Shadows (`Combining a soft wide ambient shadow with a crisp tight directional shadow replicates natural sunlight physics`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d4-b2-highest-zindex-layer-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "shadow_physics_demo.js",
            "initialCode": "function getShadowStandard() {\n  return 'COMPOSITE_AMBIENT_AND_DIRECTIONAL_BOX_SHADOWS_FOR_NATURAL_DEPTH';\n}\n\nconsole.log(getShadowStandard());",
            "expectedOutput": "COMPOSITE_AMBIENT_AND_DIRECTIONAL_BOX_SHADOWS_FOR_NATURAL_DEPTH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What technique produces realistic optical depth in modern UI component design?",
          "expectedStringOutput": "COMPOSITE_AMBIENT_AND_DIRECTIONAL_BOX_SHADOWS_FOR_NATURAL_DEPTH",
          "acceptableAnswers": [
            "COMPOSITE_AMBIENT_AND_DIRECTIONAL_BOX_SHADOWS_FOR_NATURAL_DEPTH",
            "Composite ambient and directional shadows",
            "Multi-layer shadows"
          ],
          "primaryMisconceptionId": "MC_DS_ELEVATION_SHADOWS_ZINDEX_LAYERS",
          "diagnosisMap": {
            "SINGLE_BLACK_SHADOW": {
              "misconceptionId": "MC_DS_ELEVATION_SHADOWS_ZINDEX_LAYERS",
              "errorExplanation": "Single harsh shadows look dated. Standard is: COMPOSITE_AMBIENT_AND_DIRECTIONAL_BOX_SHADOWS_FOR_NATURAL_DEPTH.",
              "recoveryPath": {
                "simplerExplanation": "Matches COMPOSITE_AMBIENT_AND_DIRECTIONAL_BOX_SHADOWS_FOR_NATURAL_DEPTH.",
                "guidedFixPrompt": "Type COMPOSITE_AMBIENT_AND_DIRECTIONAL_BOX_SHADOWS_FOR_NATURAL_DEPTH"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Design Token, 8pt Grid & Typography Math Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete foundational design token and spatial math engine: 1. Design token semantic alias resolution (light/dark modes); 2. Modular typography scale calculation; 3. 8pt spatial grid alignment audit; 4. Semantic Z-index scale verification.",
    "blocks": [
      {
        "id": "design-d5-b1-design-foundations-master-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "Design Foundations Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Design Foundations Master Engine",
          "supportingTerms": [
            "Design Tokens Subsystem",
            "Modular Typography Subsystem",
            "Spatial Grid Subsystem",
            "Z-Index Scale Subsystem"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d4-b3-multi-layer-box-shadows",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 Design Foundations Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Resolves 3-tier semantic color tokens across light/dark themes",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Calculates Major Third (1.250) modular typography scales in rems",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Audits 8pt mathematical spatial grids & eliminates magic margins",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Enforces semantic Z-Index stacking & activates Foundations Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "design_kernel_demo.js",
            "initialCode": "function runDesignFoundations() {\n  return {\n    tokensSubsystem: 'ONLINE_3TIER_ALIASES_ACTIVE',\n    typographySubsystem: 'ONLINE_MAJOR_THIRD_ACTIVE',\n    spacingSubsystem: 'ONLINE_8PT_GRID_ACTIVE',\n    zIndexSubsystem: 'ONLINE_SEMANTIC_STACK_ACTIVE',\n    engineStatus: 'DESIGN_FOUNDATIONS_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runDesignFoundations().engineStatus);",
            "expectedOutput": "DESIGN_FOUNDATIONS_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Design Foundations Master Engine?",
          "expectedStringOutput": "DESIGN_FOUNDATIONS_MASTER_ACTIVE",
          "acceptableAnswers": [
            "DESIGN_FOUNDATIONS_MASTER_ACTIVE",
            "engineStatus: DESIGN_FOUNDATIONS_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_DS_DESIGN_TOKENS_SEMANTIC_COLOR_SCALES",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DS_DESIGN_TOKENS_SEMANTIC_COLOR_SCALES",
              "errorExplanation": "Matches DESIGN_FOUNDATIONS_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type DESIGN_FOUNDATIONS_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "design-d5-b2-design-foundations-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "Design Foundations Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Design Foundations Invariant Verification",
          "supportingTerms": [
            "Tokens Invariant",
            "Grid Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d5-b1-design-foundations-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "design_audit_demo.js",
            "initialCode": "function auditDesign(t, typ, s, z) {\n  const passed = t && typ && s && z;\n  return {\n    tokensVerified: t,\n    typographyVerified: typ,\n    spacingVerified: s,\n    zIndexVerified: z,\n    grade: passed ? 'DESIGN_FOUNDATIONS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditDesign(true, true, true, true)));",
            "expectedOutput": "{\"tokensVerified\":true,\"typographyVerified\":true,\"spacingVerified\":true,\"zIndexVerified\":true,\"grade\":\"DESIGN_FOUNDATIONS_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Design Tokens, Typography Scales, Spacing Grid, and Z-Index pass 100%?",
          "expectedStringOutput": "DESIGN_FOUNDATIONS_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "DESIGN_FOUNDATIONS_ENGINE_AUDIT_PASSED",
            "grade\":\"DESIGN_FOUNDATIONS_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_DS_DESIGN_TOKENS_SEMANTIC_COLOR_SCALES",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DS_DESIGN_TOKENS_SEMANTIC_COLOR_SCALES",
              "errorExplanation": "All checks passing awards DESIGN_FOUNDATIONS_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards DESIGN_FOUNDATIONS_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type DESIGN_FOUNDATIONS_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "design-d5-b3-milestone1-design-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Design Foundations Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Design Foundations Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d5-b2-design-foundations-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_design_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete Design Token, 8pt Grid & Typography Math Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete Design Token, 8pt Grid & Typography Math Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete Design Token, 8pt Grid & Typography Math Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete Design Token, 8pt Grid & Typography Math Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DS_DESIGN_TOKENS_SEMANTIC_COLOR_SCALES",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DS_DESIGN_TOKENS_SEMANTIC_COLOR_SCALES",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete Design Token, 8pt Grid & Typography Math Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Atomic Design Methodology: Atoms, Molecules, Organisms, Templates & Pages",
    "overviewMetaphor": "Atomic Design Is Chemistry for User Interfaces: An HTML `<input>` and `<button>` are elemental Atoms (Hydrogen and Oxygen); bonding them together creates a SearchBar Molecule ($H_2O$); combining SearchBar with Logo and UserProfile forms a Header Organism (A Living Cell); arranging cells builds a Page Layout (The Complete Organism).",
    "blocks": [
      {
        "id": "design-d6-b1-atomic-tier-classifier",
        "day": 6,
        "blockNumber": 1,
        "title": "Atomic Design: Classifying `Button (ATOM)`, `SearchGroup (MOLECULE)`, `Header (ORGANISM)`",
        "conceptBudget": {
          "primaryConcept": "Atomic Design Component Hierarchy Classifier",
          "supportingTerms": [
            "Atom Component (`'Button'`)",
            "Molecule Component (`'SearchInputGroup'`)",
            "Organism Component (`'GlobalNavigationHeader'`)",
            "Status: Atomic Tier Classified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d1-b1-token-resolver",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Atomic Design Hierarchy Ledger",
              "boxes": [
                {
                  "label": "Atom Tier",
                  "value": "Button, Input, Badge, Icon (Indivisible UI elements)",
                  "varType": "Atom",
                  "isUpdated": false
                },
                {
                  "label": "Molecule Tier",
                  "value": "SearchInputGroup = Input + SearchButton + Label",
                  "varType": "Molecule",
                  "isUpdated": false
                },
                {
                  "label": "Organism Tier",
                  "value": "GlobalNavigationHeader = Logo + NavLinks + SearchGroup (CLASSIFIED NOMINAL!)",
                  "varType": "Organism",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "atomic_classifier_demo.js",
            "initialCode": "function classifyAtomic(comp) {\n  const map = {\n    'Button': 'ATOM',\n    'SearchInputGroup': 'MOLECULE',\n    'GlobalNavigationHeader': 'ORGANISM'\n  };\n  return {\n    comp,\n    tier: map[comp],\n    status: 'ATOMIC_TIER_CLASSIFIED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(classifyAtomic('Button')));\nconsole.log(JSON.stringify(classifyAtomic('SearchInputGroup')));\nconsole.log(JSON.stringify(classifyAtomic('GlobalNavigationHeader')));",
            "expectedOutput": "{\"comp\":\"Button\",\"tier\":\"ATOM\",\"status\":\"ATOMIC_TIER_CLASSIFIED_NOMINAL\"}\n{\"comp\":\"SearchInputGroup\",\"tier\":\"MOLECULE\",\"status\":\"ATOMIC_TIER_CLASSIFIED_NOMINAL\"}\n{\"comp\":\"GlobalNavigationHeader\",\"tier\":\"ORGANISM\",\"status\":\"ATOMIC_TIER_CLASSIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Atomic Design tier is assigned to 'SearchInputGroup'?",
          "expectedStringOutput": "MOLECULE",
          "acceptableAnswers": [
            "MOLECULE",
            "tier\":\"MOLECULE\"",
            "Molecule"
          ],
          "primaryMisconceptionId": "MC_DS_ATOMIC_DESIGN_METHODOLOGY",
          "diagnosisMap": {
            "ATOM": {
              "misconceptionId": "MC_DS_ATOMIC_DESIGN_METHODOLOGY",
              "errorExplanation": "A search group combines an input and button atom, making it a MOLECULE.",
              "recoveryPath": {
                "simplerExplanation": "Tier is MOLECULE.",
                "guidedFixPrompt": "Type MOLECULE"
              }
            }
          }
        }
      },
      {
        "id": "design-d6-b2-atomic-design-pioneer-brad-frost",
        "day": 6,
        "blockNumber": 2,
        "title": "The Pioneer of Atomic Design: Brad Frost",
        "conceptBudget": {
          "primaryConcept": "Brad Frost Methodology Invariant",
          "supportingTerms": [
            "Brad Frost (`Web designer and author who formulated the 5-stage Atomic Design methodology in 2013, revolutionizing frontend component architecture`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d6-b1-atomic-tier-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "5 Stages of Atomic Design",
            "codeSnippet": "// 1. ATOMS:     Basic HTML tags (Button, Label, Input, Color Palette)\n// 2. MOLECULES: Simple groups of UI atoms functioning together (Search Form)\n// 3. ORGANISMS: Complex, distinct sections of interface (Header, Product Grid)\n// 4. TEMPLATES: Page-level layout wireframes focusing on content structure\n// 5. PAGES:     Specific instances of templates rendered with real mock data",
            "lineNotes": {
              "1": "Atoms stage.",
              "2": "Molecules stage.",
              "3": "Organisms stage.",
              "4": "Templates stage.",
              "5": "Pages stage."
            }
          },
          {
            "type": "runnable_code",
            "filename": "brad_frost_demo.js",
            "initialCode": "function getPioneer() {\n  return 'Brad Frost';\n}\n\nconsole.log(getPioneer());",
            "expectedOutput": "Brad Frost",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Who created the Atomic Design methodology for web user interfaces?",
          "expectedStringOutput": "Brad Frost",
          "acceptableAnswers": [
            "Brad Frost",
            "brad frost",
            "'Brad Frost'"
          ],
          "primaryMisconceptionId": "MC_DS_ATOMIC_DESIGN_METHODOLOGY",
          "diagnosisMap": {
            "Dan Mall": {
              "misconceptionId": "MC_DS_ATOMIC_DESIGN_METHODOLOGY",
              "errorExplanation": "Atomic Design was created by Brad Frost.",
              "recoveryPath": {
                "simplerExplanation": "Type Brad Frost.",
                "guidedFixPrompt": "Type Brad Frost"
              }
            }
          }
        }
      },
      {
        "id": "design-d6-b3-preventing-dependency-inversions",
        "day": 6,
        "blockNumber": 3,
        "title": "Architecture Cleanliness: Preventing Atoms from Importing Organisms",
        "conceptBudget": {
          "primaryConcept": "Clean Dependency Invariant",
          "supportingTerms": [
            "Clean Dependency Flow (`Atoms may never import molecules or organisms; dependencies must flow strictly downwards from Pages -> Templates -> Organisms -> Molecules -> Atoms`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d6-b2-atomic-design-pioneer-brad-frost",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dependency_flow_demo.js",
            "initialCode": "function getAtomicDependencyRule() {\n  return 'DEPENDENCIES_FLOW_STRICTLY_FROM_PAGES_DOWN_TO_ATOMS_NEVER_REVERSED';\n}\n\nconsole.log(getAtomicDependencyRule());",
            "expectedOutput": "DEPENDENCIES_FLOW_STRICTLY_FROM_PAGES_DOWN_TO_ATOMS_NEVER_REVERSED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What dependency direction rule must atomic component libraries strictly maintain?",
          "expectedStringOutput": "DEPENDENCIES_FLOW_STRICTLY_FROM_PAGES_DOWN_TO_ATOMS_NEVER_REVERSED",
          "acceptableAnswers": [
            "DEPENDENCIES_FLOW_STRICTLY_FROM_PAGES_DOWN_TO_ATOMS_NEVER_REVERSED",
            "Pages down to atoms",
            "Downwards dependency flow"
          ],
          "primaryMisconceptionId": "MC_DS_ATOMIC_DESIGN_METHODOLOGY",
          "diagnosisMap": {
            "ALLOW_CIRCULAR": {
              "misconceptionId": "MC_DS_ATOMIC_DESIGN_METHODOLOGY",
              "errorExplanation": "Circular dependencies break modularity. Rule is: DEPENDENCIES_FLOW_STRICTLY_FROM_PAGES_DOWN_TO_ATOMS_NEVER_REVERSED.",
              "recoveryPath": {
                "simplerExplanation": "Matches DEPENDENCIES_FLOW_STRICTLY_FROM_PAGES_DOWN_TO_ATOMS_NEVER_REVERSED.",
                "guidedFixPrompt": "Type DEPENDENCIES_FLOW_STRICTLY_FROM_PAGES_DOWN_TO_ATOMS_NEVER_REVERSED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Button Architecture & Interactive States: Default, Hover, Active, Focus & Loading",
    "overviewMetaphor": "An Accessible Button Is a Precision Mechanical Keyboard Switch: It does not just exist in a static state; pressing it moves through physical tactile stages (Default $\\to$ Hover $\\to$ Pressed Active $\\to$ Focus-Visible $\\to$ Disabled $\\to$ Loading Spinner), providing immediate sensory feedback to both sighted users and screen readers.",
    "blocks": [
      {
        "id": "design-d7-b1-button-state-validator",
        "day": 7,
        "blockNumber": 1,
        "title": "Button Architecture: Validating Variant (`primary`), Size (`md`), State (`loading`)",
        "conceptBudget": {
          "primaryConcept": "Button Component Interactive State Machine Validator",
          "supportingTerms": [
            "Button Variant (`'primary'`)",
            "Button Size (`'md'`)",
            "Interactive State (`'loading'`)",
            "Accessible ARIA (`true`)",
            "Status: Button Props Validated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d6-b1-atomic-tier-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Button State Machine Architecture Ledger",
              "boxes": [
                {
                  "label": "Variant Prop",
                  "value": "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'",
                  "varType": "Variant",
                  "isUpdated": false
                },
                {
                  "label": "Size Prop",
                  "value": "'sm' (32px) | 'md' (40px) | 'lg' (48px)",
                  "varType": "Size",
                  "isUpdated": false
                },
                {
                  "label": "Interactive State",
                  "value": "'loading' (Spinner active + aria-busy='true' - VALIDATED NOMINAL!)",
                  "varType": "State",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "button_state_demo.js",
            "initialCode": "function validateButton(variant, size, state, aria) {\n  const v = ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(variant);\n  const s = ['sm', 'md', 'lg'].includes(size);\n  const st = ['default', 'hover', 'active', 'focus-visible', 'disabled', 'loading'].includes(state);\n  const ok = v && s && st && aria;\n  return {\n    variant,\n    size,\n    state,\n    isPropsValid: ok,\n    status: ok ? 'BUTTON_PROPS_VALIDATED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(validateButton('primary', 'md', 'loading', true)));",
            "expectedOutput": "{\"variant\":\"primary\",\"size\":\"md\",\"state\":\"loading\",\"isPropsValid\":true,\"status\":\"BUTTON_PROPS_VALIDATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that button properties satisfy all design system variant, size, and state constraints?",
          "expectedStringOutput": "BUTTON_PROPS_VALIDATED_NOMINAL",
          "acceptableAnswers": [
            "BUTTON_PROPS_VALIDATED_NOMINAL",
            "status\":\"BUTTON_PROPS_VALIDATED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_DS_BUTTON_ARCHITECTURE_INTERACTIVE_STATES",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DS_BUTTON_ARCHITECTURE_INTERACTIVE_STATES",
              "errorExplanation": "Matches BUTTON_PROPS_VALIDATED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type BUTTON_PROPS_VALIDATED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "design-d7-b2-total-button-interactive-states-count",
        "day": 7,
        "blockNumber": 2,
        "title": "The 6 Button Interactive States",
        "conceptBudget": {
          "primaryConcept": "Button States Invariant",
          "supportingTerms": [
            "6 Interactive States (1. Default, 2. Hover, 3. Active/Pressed, 4. Focus-Visible, 5. Disabled, 6. Loading)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d7-b1-button-state-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "6 Button States Breakdown",
            "codeSnippet": "// 1. DEFAULT:       Standard resting elevation and background\n// 2. HOVER:         +5% Lightness / brightness shift on mouse pointer\n// 3. ACTIVE:        Scale(0.98) pressed depth effect on click\n// 4. FOCUS-VISIBLE: 2px offset accessible high-contrast focus ring\n// 5. DISABLED:      Reduced opacity (0.5), cursor: not-allowed, aria-disabled\n// 6. LOADING:       Content hidden, animated SVG spinner active, aria-busy=\"true\"",
            "lineNotes": {
              "1": "State 1: Default resting.",
              "2": "State 2: Mouse hover.",
              "3": "State 3: Pointer down active.",
              "4": "State 4: Keyboard focus ring.",
              "5": "State 5: Disabled non-interactive.",
              "6": "State 6: Asynchronous loading."
            }
          },
          {
            "type": "runnable_code",
            "filename": "button_states_count_demo.js",
            "initialCode": "function getButtonStatesCount() {\n  return 6;\n}\n\nconsole.log(getButtonStatesCount());",
            "expectedOutput": "6",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many discrete interactive states must a complete design system button component support?",
          "expectedStringOutput": "6",
          "acceptableAnswers": [
            "6",
            "6 states",
            "six"
          ],
          "primaryMisconceptionId": "MC_DS_BUTTON_ARCHITECTURE_INTERACTIVE_STATES",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_DS_BUTTON_ARCHITECTURE_INTERACTIVE_STATES",
              "errorExplanation": "Buttons require 6 states: Default, Hover, Active, Focus-Visible, Disabled, and Loading.",
              "recoveryPath": {
                "simplerExplanation": "Type 6.",
                "guidedFixPrompt": "Type 6"
              }
            }
          }
        }
      },
      {
        "id": "design-d7-b3-focus-visible-keyboard-ring",
        "day": 7,
        "blockNumber": 3,
        "title": "Accessibility: `:focus-visible` Focus Rings with `outline-offset: 2px`",
        "conceptBudget": {
          "primaryConcept": "Focus Ring Invariant",
          "supportingTerms": [
            "`:focus-visible` (`Displaying focus rings only when navigating via keyboard Tab, while suppressing rings on mouse click to maintain clean aesthetics`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d7-b2-total-button-interactive-states-count",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "focus_ring_demo.js",
            "initialCode": "function getFocusRingSelector() {\n  return ':focus-visible';\n}\n\nconsole.log(getFocusRingSelector());",
            "expectedOutput": ":focus-visible",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What modern CSS pseudo-class styles keyboard-only focus rings without triggering on mouse clicks?",
          "expectedStringOutput": ":focus-visible",
          "acceptableAnswers": [
            ":focus-visible",
            "focus-visible",
            "':focus-visible'"
          ],
          "primaryMisconceptionId": "MC_DS_BUTTON_ARCHITECTURE_INTERACTIVE_STATES",
          "diagnosisMap": {
            ":focus": {
              "misconceptionId": "MC_DS_BUTTON_ARCHITECTURE_INTERACTIVE_STATES",
              "errorExplanation": ":focus triggers on mouse clicks too. Keyboard-only is :focus-visible.",
              "recoveryPath": {
                "simplerExplanation": "Type :focus-visible.",
                "guidedFixPrompt": "Type :focus-visible"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Form Controls, Inputs & Validation States: Floating Labels & ARIA Feedback",
    "overviewMetaphor": "An Accessible Form Input Is a Guided Runway Landing: The runway has clear guide lights (Label), detects crosswinds (Real-time validation), sounds an alert if landing gear fails (`aria-invalid=\"true\"`), and transmits exact radio coordinates to the control tower (`aria-describedby=\"error-msg-id\"`) so the pilot can touch down safely.",
    "blocks": [
      {
        "id": "design-d8-b1-form-input-auditor",
        "day": 8,
        "blockNumber": 1,
        "title": "Form Input: Auditing Label Connection & `aria-describedby` Error Linking",
        "conceptBudget": {
          "primaryConcept": "Form Input Accessibility & Validation State Auditor",
          "supportingTerms": [
            "Label Present (`true`)",
            "Error State (`true`)",
            "aria-describedby Linked (`true`)",
            "Status: Form Input Accessibility Verified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d7-b1-button-state-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Accessible Form Input Architecture Ledger",
              "boxes": [
                {
                  "label": "<label>",
                  "value": "for='email-input' (Explicitly binds to input id)",
                  "varType": "Label",
                  "isUpdated": false
                },
                {
                  "label": "<input>",
                  "value": "id='email-input' aria-invalid='true' aria-describedby='email-err'",
                  "varType": "Input",
                  "isUpdated": false
                },
                {
                  "label": "<p id='email-err'>",
                  "value": "'Please enter a valid email address' (ACCESSIBILITY VERIFIED NOMINAL!)",
                  "varType": "Error Text",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "form_input_demo.js",
            "initialCode": "function auditFormInput(hasLabel, hasAriaDescribedBy, isError) {\n  const ok = hasLabel && (!isError || hasAriaDescribedBy);\n  return {\n    hasLabel,\n    isError,\n    isAccessible: ok,\n    status: ok ? 'FORM_INPUT_ACCESSIBILITY_VERIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditFormInput(true, true, true)));",
            "expectedOutput": "{\"hasLabel\":true,\"isError\":true,\"isAccessible\":true,\"status\":\"FORM_INPUT_ACCESSIBILITY_VERIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that an error-state form input is properly linked to its error message for assistive technology?",
          "expectedStringOutput": "FORM_INPUT_ACCESSIBILITY_VERIFIED_NOMINAL",
          "acceptableAnswers": [
            "FORM_INPUT_ACCESSIBILITY_VERIFIED_NOMINAL",
            "status\":\"FORM_INPUT_ACCESSIBILITY_VERIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_DS_FORM_CONTROLS_INPUTS_VALIDATION",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DS_FORM_CONTROLS_INPUTS_VALIDATION",
              "errorExplanation": "Matches FORM_INPUT_ACCESSIBILITY_VERIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type FORM_INPUT_ACCESSIBILITY_VERIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "design-d8-b2-error-aria-attribute-name",
        "day": 8,
        "blockNumber": 2,
        "title": "The Error State ARIA Attribute: `aria-invalid`",
        "conceptBudget": {
          "primaryConcept": "aria-invalid Invariant",
          "supportingTerms": [
            "`aria-invalid` (`Set to 'true' whenever form validation fails, alerting screen readers immediately that the field contains an invalid value`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d8-b1-form-input-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Accessible Form Input HTML",
            "codeSnippet": "<div class=\"form-group\">\n  <label for=\"username\">Username</label>\n  <input id=\"username\" type=\"text\" aria-invalid=\"true\" aria-describedby=\"user-error\" />\n  <p id=\"user-error\" class=\"error-text\">Username must be at least 3 characters</p>\n</div>",
            "lineNotes": {
              "2": "Explicit label association.",
              "3": "aria-invalid='true' and aria-describedby binding.",
              "4": "Target error message element matching describedby id."
            }
          },
          {
            "type": "runnable_code",
            "filename": "aria_invalid_demo.js",
            "initialCode": "function getErrorAriaAttribute() {\n  return 'aria-invalid';\n}\n\nconsole.log(getErrorAriaAttribute());",
            "expectedOutput": "aria-invalid",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What ARIA attribute signals to screen readers that an input field currently contains a validation error?",
          "expectedStringOutput": "aria-invalid",
          "acceptableAnswers": [
            "aria-invalid",
            "aria-invalid=\"true\"",
            "'aria-invalid'"
          ],
          "primaryMisconceptionId": "MC_DS_FORM_CONTROLS_INPUTS_VALIDATION",
          "diagnosisMap": {
            "aria-error": {
              "misconceptionId": "MC_DS_FORM_CONTROLS_INPUTS_VALIDATION",
              "errorExplanation": "aria-error is invalid. The standard WAI-ARIA attribute is aria-invalid.",
              "recoveryPath": {
                "simplerExplanation": "Type aria-invalid.",
                "guidedFixPrompt": "Type aria-invalid"
              }
            }
          }
        }
      },
      {
        "id": "design-d8-b3-accessible-placeholder-discipline",
        "day": 8,
        "blockNumber": 3,
        "title": "Label Discipline: Never Using Placeholders as Substitutes for Labels",
        "conceptBudget": {
          "primaryConcept": "Placeholder Discipline Invariant",
          "supportingTerms": [
            "Placeholder Discipline (`Placeholders vanish once a user types and fail contrast ratios; persistent visible <label> elements are mandatory for accessibility`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d8-b2-error-aria-attribute-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "placeholder_rule_demo.js",
            "initialCode": "function getLabelRule() {\n  return 'ALWAYS_PROVIDE_A_PERSISTENT_VISIBLE_LABEL_NEVER_RELY_ON_PLACEHOLDERS';\n}\n\nconsole.log(getLabelRule());",
            "expectedOutput": "ALWAYS_PROVIDE_A_PERSISTENT_VISIBLE_LABEL_NEVER_RELY_ON_PLACEHOLDERS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core accessibility rule governs form input labeling?",
          "expectedStringOutput": "ALWAYS_PROVIDE_A_PERSISTENT_VISIBLE_LABEL_NEVER_RELY_ON_PLACEHOLDERS",
          "acceptableAnswers": [
            "ALWAYS_PROVIDE_A_PERSISTENT_VISIBLE_LABEL_NEVER_RELY_ON_PLACEHOLDERS",
            "Always provide visible label",
            "Never rely on placeholders"
          ],
          "primaryMisconceptionId": "MC_DS_FORM_CONTROLS_INPUTS_VALIDATION",
          "diagnosisMap": {
            "PLACEHOLDERS_ONLY": {
              "misconceptionId": "MC_DS_FORM_CONTROLS_INPUTS_VALIDATION",
              "errorExplanation": "Placeholders disappear on type. Rule is: ALWAYS_PROVIDE_A_PERSISTENT_VISIBLE_LABEL_NEVER_RELY_ON_PLACEHOLDERS.",
              "recoveryPath": {
                "simplerExplanation": "Matches ALWAYS_PROVIDE_A_PERSISTENT_VISIBLE_LABEL_NEVER_RELY_ON_PLACEHOLDERS.",
                "guidedFixPrompt": "Type ALWAYS_PROVIDE_A_PERSISTENT_VISIBLE_LABEL_NEVER_RELY_ON_PLACEHOLDERS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Card Components & Responsive Content Containers: Aspect Ratios & Padding Ramps",
    "overviewMetaphor": "A Design System Card Is a Picture Frame in an Art Gallery: The frame maintains rigid geometrical proportions (`aspect-ratio: 16/9`), lifts off the wall when you step closer to inspect it (`elevation-1` $\\to$ `elevation-3` on hover), and accommodates any painting without warping its dimensions.",
    "blocks": [
      {
        "id": "design-d9-b1-card-layout-validator",
        "day": 9,
        "blockNumber": 1,
        "title": "Card Architecture: Validating Aspect Ratio (`16/9`) & Hover Elevation Shift ($1 \\to 3$)",
        "conceptBudget": {
          "primaryConcept": "Card Component Aspect Ratio & Elevation Validator",
          "supportingTerms": [
            "Aspect Ratio (`'16/9'`)",
            "Base Elevation ($1$)",
            "Hover Elevation ($3$)",
            "Status: Card Layout Config Validated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d8-b1-form-input-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Card Component Structure Ledger",
              "boxes": [
                {
                  "label": "Media Container",
                  "value": "aspect-ratio: 16/9 | object-fit: cover (No distortion)",
                  "varType": "Media",
                  "isUpdated": false
                },
                {
                  "label": "Base Elevation",
                  "value": "elevation-1 (Resting subtle shadow)",
                  "varType": "Resting",
                  "isUpdated": false
                },
                {
                  "label": "Hover Elevation",
                  "value": "elevation-3 (Interactive lift - VALIDATED NOMINAL!)",
                  "varType": "Hover",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "card_layout_demo.js",
            "initialCode": "function validateCard(ratio, baseElev, hoverElev) {\n  const ok = ['16/9', '4/3', '1/1'].includes(ratio) && hoverElev > baseElev;\n  return {\n    aspectRatio: ratio,\n    baseElevation: baseElev,\n    hoverElevation: hoverElev,\n    isCardValid: ok,\n    status: ok ? 'CARD_LAYOUT_CONFIG_VALIDATED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(validateCard('16/9', 1, 3)));",
            "expectedOutput": "{\"aspectRatio\":\"16/9\",\"baseElevation\":1,\"hoverElevation\":3,\"isCardValid\":true,\"status\":\"CARD_LAYOUT_CONFIG_VALIDATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a card component configuration has valid aspect ratio and elevated hover state?",
          "expectedStringOutput": "CARD_LAYOUT_CONFIG_VALIDATED_NOMINAL",
          "acceptableAnswers": [
            "CARD_LAYOUT_CONFIG_VALIDATED_NOMINAL",
            "status\":\"CARD_LAYOUT_CONFIG_VALIDATED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_DS_CARD_COMPONENTS_RESPONSIVE_CONTAINERS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DS_CARD_COMPONENTS_RESPONSIVE_CONTAINERS",
              "errorExplanation": "Matches CARD_LAYOUT_CONFIG_VALIDATED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type CARD_LAYOUT_CONFIG_VALIDATED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "design-d9-b2-standard-video-aspect-ratio",
        "day": 9,
        "blockNumber": 2,
        "title": "The Standard Video Aspect Ratio: `16/9`",
        "conceptBudget": {
          "primaryConcept": "Aspect Ratio Invariant",
          "supportingTerms": [
            "`16/9` (`The universal widescreen aspect ratio for video thumbnails and featured media card hero containers`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d9-b1-card-layout-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CSS Aspect Ratio Property",
            "codeSnippet": ".card-media-container {\n  aspect-ratio: 16 / 9; /* Prevents Cumulative Layout Shift (CLS)! */\n  width: 100%;\n  overflow: hidden;\n}\n.card-media-container img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}",
            "lineNotes": {
              "2": "aspect-ratio: 16/9 locks container proportions.",
              "8": "object-fit: cover fills frame without stretching."
            }
          },
          {
            "type": "runnable_code",
            "filename": "aspect_ratio_demo.js",
            "initialCode": "function getAspectRatio() {\n  return '16/9';\n}\n\nconsole.log(getAspectRatio());",
            "expectedOutput": "16/9",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What CSS aspect ratio value is the standard for widescreen media card containers?",
          "expectedStringOutput": "16/9",
          "acceptableAnswers": [
            "16/9",
            "16 / 9",
            "'16/9'"
          ],
          "primaryMisconceptionId": "MC_DS_CARD_COMPONENTS_RESPONSIVE_CONTAINERS",
          "diagnosisMap": {
            "4/3": {
              "misconceptionId": "MC_DS_CARD_COMPONENTS_RESPONSIVE_CONTAINERS",
              "errorExplanation": "4/3 is legacy standard. Modern widescreen standard is 16/9.",
              "recoveryPath": {
                "simplerExplanation": "Type 16/9.",
                "guidedFixPrompt": "Type 16/9"
              }
            }
          }
        }
      },
      {
        "id": "design-d9-b3-preventing-cumulative-layout-shift",
        "day": 9,
        "blockNumber": 3,
        "title": "Core Web Vitals: Eliminating Cumulative Layout Shift (CLS) with `aspect-ratio`",
        "conceptBudget": {
          "primaryConcept": "CLS Elimination Invariant",
          "supportingTerms": [
            "CLS Elimination (`Setting CSS 'aspect-ratio' reserves image container dimensions before network download, preventing content jumping and preserving 100% Core Web Vitals score`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d9-b2-standard-video-aspect-ratio",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cls_prevention_demo.js",
            "initialCode": "function getClsRule() {\n  return 'RESERVE_ASPECT_RATIO_DIMENSIONS_UPFRONT_TO_PREVENT_LAYOUT_SHIFT';\n}\n\nconsole.log(getClsRule());",
            "expectedOutput": "RESERVE_ASPECT_RATIO_DIMENSIONS_UPFRONT_TO_PREVENT_LAYOUT_SHIFT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why is declaring explicit aspect ratios on card media containers essential for web performance?",
          "expectedStringOutput": "RESERVE_ASPECT_RATIO_DIMENSIONS_UPFRONT_TO_PREVENT_LAYOUT_SHIFT",
          "acceptableAnswers": [
            "RESERVE_ASPECT_RATIO_DIMENSIONS_UPFRONT_TO_PREVENT_LAYOUT_SHIFT",
            "Prevent layout shift",
            "Eliminate cumulative layout shift"
          ],
          "primaryMisconceptionId": "MC_DS_CARD_COMPONENTS_RESPONSIVE_CONTAINERS",
          "diagnosisMap": {
            "AUTOSIZE": {
              "misconceptionId": "MC_DS_CARD_COMPONENTS_RESPONSIVE_CONTAINERS",
              "errorExplanation": "Rule is: RESERVE_ASPECT_RATIO_DIMENSIONS_UPFRONT_TO_PREVENT_LAYOUT_SHIFT.",
              "recoveryPath": {
                "simplerExplanation": "Matches RESERVE_ASPECT_RATIO_DIMENSIONS_UPFRONT_TO_PREVENT_LAYOUT_SHIFT.",
                "guidedFixPrompt": "Type RESERVE_ASPECT_RATIO_DIMENSIONS_UPFRONT_TO_PREVENT_LAYOUT_SHIFT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Navigation Bars, Menus & Breadcrumb Trails: Sticky Headers & Skip Links",
    "overviewMetaphor": "An Accessible Navigation Bar Is a Lighthouse with a Direct Express Highway: It provides a persistent beacon at the top of the viewport (`backdrop-filter: blur(12px)`), clearly marks the current harbor (`aria-current=\"page\"`), and offers a 'Skip to Content' highway so keyboard users don't have to cycle through 40 menu links on every page load.",
    "blocks": [
      {
        "id": "design-d10-b1-nav-aria-auditor",
        "day": 10,
        "blockNumber": 1,
        "title": "Navigation: Auditing `aria-current=\"page\"` on Active Route Links",
        "conceptBudget": {
          "primaryConcept": "Navigation Active Page ARIA Auditor",
          "supportingTerms": [
            "Current Page Active (`true`)",
            "aria-current Present (`true`)",
            "Status: Navigation ARIA Compliant Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d9-b1-card-layout-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Accessible Navigation Link Architecture Ledger",
              "boxes": [
                {
                  "label": "Active Nav Link",
                  "value": "<a href='/dashboard' aria-current='page'>Dashboard</a>",
                  "varType": "Active Link",
                  "isUpdated": false
                },
                {
                  "label": "Screen Reader Announcement",
                  "value": "'Dashboard, current page, link' (Clear auditory context)",
                  "varType": "Announcement",
                  "isUpdated": false
                },
                {
                  "label": "ARIA Compliance",
                  "value": "NAVIGATION ARIA COMPLIANT NOMINAL (ACCESSIBILITY VERIFIED!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "nav_aria_demo.js",
            "initialCode": "function auditNav(isCurrent, hasAria) {\n  const ok = !isCurrent || hasAria;\n  return {\n    isCurrentPage: isCurrent,\n    isCompliant: ok,\n    status: ok ? 'NAVIGATION_ARIA_COMPLIANT_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditNav(true, true)));",
            "expectedOutput": "{\"isCurrentPage\":true,\"isCompliant\":true,\"status\":\"NAVIGATION_ARIA_COMPLIANT_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that active navigation links are properly identified for assistive technologies?",
          "expectedStringOutput": "NAVIGATION_ARIA_COMPLIANT_NOMINAL",
          "acceptableAnswers": [
            "NAVIGATION_ARIA_COMPLIANT_NOMINAL",
            "status\":\"NAVIGATION_ARIA_COMPLIANT_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_DS_NAVIGATION_BARS_MENUS_BREADCRUMBS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DS_NAVIGATION_BARS_MENUS_BREADCRUMBS",
              "errorExplanation": "Matches NAVIGATION_ARIA_COMPLIANT_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type NAVIGATION_ARIA_COMPLIANT_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "design-d10-b2-aria-current-page-value",
        "day": 10,
        "blockNumber": 2,
        "title": "The Active Page ARIA Value: `page`",
        "conceptBudget": {
          "primaryConcept": "aria-current Invariant",
          "supportingTerms": [
            "`aria-current=\"page\"` (`The WAI-ARIA standard attribute value denoting that a link represents the currently active page in a navigation hierarchy`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d10-b1-nav-aria-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Accessible Navigation Markup",
            "codeSnippet": "<nav aria-label=\"Main Navigation\">\n  <ul>\n    <li><a href=\"/\" aria-current=\"page\">Home</a></li>\n    <li><a href=\"/courses\">Courses</a></li>\n    <li><a href=\"/quests\">Quests</a></li>\n  </ul>\n</nav>",
            "lineNotes": {
              "1": "nav landmark with accessible label.",
              "3": "aria-current=\"page\" indicates active route.",
              "4": "Standard inactive links."
            }
          },
          {
            "type": "runnable_code",
            "filename": "aria_current_value_demo.js",
            "initialCode": "function getAriaCurrentValue() {\n  return 'page';\n}\n\nconsole.log(getAriaCurrentValue());",
            "expectedOutput": "page",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What value is assigned to the 'aria-current' attribute for the active route in a navbar?",
          "expectedStringOutput": "page",
          "acceptableAnswers": [
            "page",
            "'page'",
            "page value"
          ],
          "primaryMisconceptionId": "MC_DS_NAVIGATION_BARS_MENUS_BREADCRUMBS",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_DS_NAVIGATION_BARS_MENUS_BREADCRUMBS",
              "errorExplanation": "aria-current accepts specific tokens: 'page', 'step', 'date', 'location', 'time'. For navigation, use 'page'.",
              "recoveryPath": {
                "simplerExplanation": "Type page.",
                "guidedFixPrompt": "Type page"
              }
            }
          }
        }
      },
      {
        "id": "design-d10-b3-skip-to-content-links",
        "day": 10,
        "blockNumber": 3,
        "title": "Keyboard Accessibility: The \"Skip to Content\" Bypass Link",
        "conceptBudget": {
          "primaryConcept": "Skip Link Invariant",
          "supportingTerms": [
            "Skip to Content Link (`A hidden link that becomes visible on initial Tab focus, allowing keyboard and screen reader users to jump directly past repetitive navigation headers into #main-content`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d10-b2-aria-current-page-value",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "skip_link_demo.js",
            "initialCode": "function getSkipLinkStandard() {\n  return 'PROVIDE_A_SKIP_TO_CONTENT_LINK_FOR_KEYBOARD_NAVIGATION_BYPASS';\n}\n\nconsole.log(getSkipLinkStandard());",
            "expectedOutput": "PROVIDE_A_SKIP_TO_CONTENT_LINK_FOR_KEYBOARD_NAVIGATION_BYPASS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What keyboard accessibility feature allows users to jump past top navigation bars directly into page content?",
          "expectedStringOutput": "PROVIDE_A_SKIP_TO_CONTENT_LINK_FOR_KEYBOARD_NAVIGATION_BYPASS",
          "acceptableAnswers": [
            "PROVIDE_A_SKIP_TO_CONTENT_LINK_FOR_KEYBOARD_NAVIGATION_BYPASS",
            "Skip to content link",
            "Skip link"
          ],
          "primaryMisconceptionId": "MC_DS_NAVIGATION_BARS_MENUS_BREADCRUMBS",
          "diagnosisMap": {
            "NO_BYPASS": {
              "misconceptionId": "MC_DS_NAVIGATION_BARS_MENUS_BREADCRUMBS",
              "errorExplanation": "Standard is: PROVIDE_A_SKIP_TO_CONTENT_LINK_FOR_KEYBOARD_NAVIGATION_BYPASS.",
              "recoveryPath": {
                "simplerExplanation": "Matches PROVIDE_A_SKIP_TO_CONTENT_LINK_FOR_KEYBOARD_NAVIGATION_BYPASS.",
                "guidedFixPrompt": "Type PROVIDE_A_SKIP_TO_CONTENT_LINK_FOR_KEYBOARD_NAVIGATION_BYPASS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Modals, Dialogs & Backdrop Focus Trapping: Accessible Overlay Engineering",
    "overviewMetaphor": "An Accessible Modal Dialog Is a High-Security Airlock Chamber: When the chamber doors seal open (Modal opens), the rest of the spacecraft is locked down (`inert`), keyboard focus is trapped securely inside the chamber (Focus Trap), and pressing the Emergency Release button (`Escape` key) returns the astronaut smoothly to the cockpit.",
    "blocks": [
      {
        "id": "design-d11-b1-modal-accessibility-auditor",
        "day": 11,
        "blockNumber": 1,
        "title": "Modal Dialog: Auditing `role=\"dialog\"`, Focus Trap, `Escape` Key, `inert` Background",
        "conceptBudget": {
          "primaryConcept": "Modal Focus Trap & Keyboard Escape Auditor",
          "supportingTerms": [
            "Role Dialog Present (`true`)",
            "Focus Trap Active (`true`)",
            "Escape Key Configured (`true`)",
            "Background Inert (`true`)",
            "Status: Modal Accessibility Verified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d10-b1-nav-aria-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Accessible Modal Dialog Architecture Ledger",
              "boxes": [
                {
                  "label": "1. ARIA Role",
                  "value": "role='dialog' aria-modal='true' aria-labelledby='modal-title'",
                  "varType": "Role",
                  "isUpdated": false
                },
                {
                  "label": "2. Focus Trap",
                  "value": "Tab cycles strictly between Close Button & Primary Action",
                  "varType": "Focus Trap",
                  "isUpdated": false
                },
                {
                  "label": "3. Escape Listener",
                  "value": "Pressing Escape closes dialog & restores previous focus",
                  "varType": "Escape",
                  "isUpdated": false
                },
                {
                  "label": "4. Background Inert",
                  "value": "document.body.inert = true (ACCESSIBILITY VERIFIED NOMINAL!)",
                  "varType": "Inert",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "modal_audit_demo.js",
            "initialCode": "function auditModal(role, trap, esc, inert) {\n  const ok = role && trap && esc && inert;\n  return {\n    isAccessible: ok,\n    status: ok ? 'MODAL_ACCESSIBILITY_VERIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditModal(true, true, true, true)));",
            "expectedOutput": "{\"isAccessible\":true,\"status\":\"MODAL_ACCESSIBILITY_VERIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a modal overlay satisfies all 4 accessible dialog requirements?",
          "expectedStringOutput": "MODAL_ACCESSIBILITY_VERIFIED_NOMINAL",
          "acceptableAnswers": [
            "MODAL_ACCESSIBILITY_VERIFIED_NOMINAL",
            "status\":\"MODAL_ACCESSIBILITY_VERIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_DS_MODALS_DIALOGS_BACKDROP_FOCUS_TRAPPING",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DS_MODALS_DIALOGS_BACKDROP_FOCUS_TRAPPING",
              "errorExplanation": "Matches MODAL_ACCESSIBILITY_VERIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type MODAL_ACCESSIBILITY_VERIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "design-d11-b2-background-inert-attribute",
        "day": 11,
        "blockNumber": 2,
        "title": "The HTML Inactive Background Attribute: `inert`",
        "conceptBudget": {
          "primaryConcept": "`inert` Attribute Invariant",
          "supportingTerms": [
            "`inert` (`The native HTML attribute that prevents user input events, focus, and screen reader virtual cursor traversal on underlying background elements while a modal is open`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d11-b1-modal-accessibility-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "HTML inert Attribute Mechanics",
            "codeSnippet": "<!-- When Modal is Active -->\n<div id=\"app-root\" inert>\n  <!-- Background cannot receive click, tab focus, or screen reader selection -->\n</div>\n<dialog id=\"active-modal\" open>\n  <h2>Payment Confirmation</h2>\n  <button id=\"confirm-btn\">Confirm</button>\n</dialog>",
            "lineNotes": {
              "2": "inert attribute deactivates all child DOM nodes.",
              "5": "dialog element remains active and focusable."
            }
          },
          {
            "type": "runnable_code",
            "filename": "inert_attr_demo.js",
            "initialCode": "function getInertAttribute() {\n  return 'inert';\n}\n\nconsole.log(getInertAttribute());",
            "expectedOutput": "inert",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What native HTML attribute disables user input and assistive focus on background DOM trees while a modal is open?",
          "expectedStringOutput": "inert",
          "acceptableAnswers": [
            "inert",
            "'inert'",
            "inert attribute"
          ],
          "primaryMisconceptionId": "MC_DS_MODALS_DIALOGS_BACKDROP_FOCUS_TRAPPING",
          "diagnosisMap": {
            "disabled": {
              "misconceptionId": "MC_DS_MODALS_DIALOGS_BACKDROP_FOCUS_TRAPPING",
              "errorExplanation": "disabled only works on form controls. For entire DOM trees, use 'inert'.",
              "recoveryPath": {
                "simplerExplanation": "Type inert.",
                "guidedFixPrompt": "Type inert"
              }
            }
          }
        }
      },
      {
        "id": "design-d11-b3-focus-restoration-on-modal-close",
        "day": 11,
        "blockNumber": 3,
        "title": "Focus Restoration: Returning Focus to the Trigger Button on Modal Close",
        "conceptBudget": {
          "primaryConcept": "Focus Restoration Invariant",
          "supportingTerms": [
            "Focus Restoration (`Storing 'document.activeElement' before opening a dialog and restoring focus to that exact trigger button upon dialog dismissal`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d11-b2-background-inert-attribute",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "focus_restore_demo.js",
            "initialCode": "function getFocusRestoreRule() {\n  return 'RESTORE_FOCUS_TO_TRIGGERING_ELEMENT_UPON_MODAL_DISMISSAL';\n}\n\nconsole.log(getFocusRestoreRule());",
            "expectedOutput": "RESTORE_FOCUS_TO_TRIGGERING_ELEMENT_UPON_MODAL_DISMISSAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where must focus return when a user dismisses a modal dialog?",
          "expectedStringOutput": "RESTORE_FOCUS_TO_TRIGGERING_ELEMENT_UPON_MODAL_DISMISSAL",
          "acceptableAnswers": [
            "RESTORE_FOCUS_TO_TRIGGERING_ELEMENT_UPON_MODAL_DISMISSAL",
            "Triggering element",
            "Restore focus to trigger"
          ],
          "primaryMisconceptionId": "MC_DS_MODALS_DIALOGS_BACKDROP_FOCUS_TRAPPING",
          "diagnosisMap": {
            "BODY_TOP": {
              "misconceptionId": "MC_DS_MODALS_DIALOGS_BACKDROP_FOCUS_TRAPPING",
              "errorExplanation": "Resetting focus to top disorients users. Standard is: RESTORE_FOCUS_TO_TRIGGERING_ELEMENT_UPON_MODAL_DISMISSAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches RESTORE_FOCUS_TO_TRIGGERING_ELEMENT_UPON_MODAL_DISMISSAL.",
                "guidedFixPrompt": "Type RESTORE_FOCUS_TO_TRIGGERING_ELEMENT_UPON_MODAL_DISMISSAL"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Tooltips, Popovers & Floating UI Positioning: Collision Detection & Viewport Bounds",
    "overviewMetaphor": "Floating UI Collision Detection Is an Automatic Car Parking Sensor: If the car (Tooltip) tries to park above a target button at the very top edge of the screen ($y - h < 0$), the sensor detects a collision with the viewport boundary and instantly flips the car to park safely below (`resolvedPlacement: 'bottom'`).",
    "blocks": [
      {
        "id": "design-d12-b1-floating-placement-flipper",
        "day": 12,
        "blockNumber": 1,
        "title": "Floating UI: Auto-Flipping Placement from `'top'` $\\to$ `'bottom'` on Screen Overflow",
        "conceptBudget": {
          "primaryConcept": "Floating UI Collision & Placement Flipper",
          "supportingTerms": [
            "Target Top Y ($20\\text{px}$)",
            "Tooltip Height ($50\\text{px}$)",
            "Viewport Bounds Collision ($20 - 50 = -30 < 0$)",
            "Resolved Placement (`'bottom'`)",
            "Status: Floating Placement Resolved Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d11-b1-modal-accessibility-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Floating UI Viewport Collision Ledger",
              "boxes": [
                {
                  "label": "Target Position",
                  "value": "topY: 20px (Near top viewport edge)",
                  "varType": "Target",
                  "isUpdated": false
                },
                {
                  "label": "Tooltip Dimensions",
                  "value": "height: 50px | Preferred: 'top'",
                  "varType": "Dimensions",
                  "isUpdated": false
                },
                {
                  "label": "Collision Flipper",
                  "value": "20px - 50px = -30px < 0 -> FLIPPED TO 'bottom' (RESOLVED NOMINAL!)",
                  "varType": "Resolved",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "floating_flip_demo.js",
            "initialCode": "function calcPlacement(topY, tipH, viewH, pref) {\n  let actual = pref;\n  if (pref === 'top' && topY - tipH < 0) actual = 'bottom';\n  return {\n    preferred: pref,\n    resolvedPlacement: actual,\n    isFlipped: actual !== pref,\n    status: 'FLOATING_PLACEMENT_RESOLVED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcPlacement(20, 50, 800, 'top')));",
            "expectedOutput": "{\"preferred\":\"top\",\"resolvedPlacement\":\"bottom\",\"isFlipped\":true,\"status\":\"FLOATING_PLACEMENT_RESOLVED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What resolved placement is produced when a 50px tooltip preferred at 'top' is placed on a button at Y=20px?",
          "expectedStringOutput": "bottom",
          "acceptableAnswers": [
            "bottom",
            "resolvedPlacement\":\"bottom\"",
            "'bottom'"
          ],
          "primaryMisconceptionId": "MC_DS_TOOLTIPS_POPOVERS_FLOATING_UI",
          "diagnosisMap": {
            "top": {
              "misconceptionId": "MC_DS_TOOLTIPS_POPOVERS_FLOATING_UI",
              "errorExplanation": "Top overflows screen bounds (20 - 50 = -30). It automatically flips to bottom.",
              "recoveryPath": {
                "simplerExplanation": "Placement is bottom.",
                "guidedFixPrompt": "Type bottom"
              }
            }
          }
        }
      },
      {
        "id": "design-d12-b2-tooltip-hover-delay-ms",
        "day": 12,
        "blockNumber": 2,
        "title": "Hover Intent: The $300\\text{ms}$ Tooltip Delay Invariant",
        "conceptBudget": {
          "primaryConcept": "Hover Intent Invariant",
          "supportingTerms": [
            "$300\\text{ms}$ Delay (`A 300ms hover delay prevents accidental visual flashing when a user sweeps their cursor across multiple buttons`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d12-b1-floating-placement-flipper",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Hover Intent State Machine",
            "codeSnippet": "// 1. MOUSE ENTER: Start 300ms timeout timer\n// 2. MOUSE LEAVE BEFORE 300ms: Cancel timer (0 visual flash!)\n// 3. MOUSE DWELLS >= 300ms: Render floating tooltip container",
            "lineNotes": {
              "1": "Timer start.",
              "2": "Accidental swipe cancellation.",
              "3": "Intentional dwell render."
            }
          },
          {
            "type": "runnable_code",
            "filename": "tooltip_delay_demo.js",
            "initialCode": "function getTooltipDelay() {\n  return 300;\n}\n\nconsole.log(getTooltipDelay());",
            "expectedOutput": "300",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the recommended hover intent delay in milliseconds before displaying an informational tooltip?",
          "expectedStringOutput": "300",
          "acceptableAnswers": [
            "300",
            "300ms",
            "300 ms"
          ],
          "primaryMisconceptionId": "MC_DS_TOOLTIPS_POPOVERS_FLOATING_UI",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_DS_TOOLTIPS_POPOVERS_FLOATING_UI",
              "errorExplanation": "0ms delay causes annoying visual flashes during mouse movement. Standard is 300ms.",
              "recoveryPath": {
                "simplerExplanation": "Type 300.",
                "guidedFixPrompt": "Type 300"
              }
            }
          }
        }
      },
      {
        "id": "design-d12-b3-aria-describedby-for-tooltips",
        "day": 12,
        "blockNumber": 3,
        "title": "Accessibility Binding: Connecting Tooltips with `aria-describedby`",
        "conceptBudget": {
          "primaryConcept": "Tooltip ARIA Invariant",
          "supportingTerms": [
            "`aria-describedby` (`Links the triggering button to the tooltip element id so screen readers automatically announce the tooltip text upon keyboard focus`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d12-b2-tooltip-hover-delay-ms",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tooltip_aria_demo.js",
            "initialCode": "function getTooltipAriaAttribute() {\n  return 'aria-describedby';\n}\n\nconsole.log(getTooltipAriaAttribute());",
            "expectedOutput": "aria-describedby",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What ARIA attribute binds an interactive button to its floating tooltip text content?",
          "expectedStringOutput": "aria-describedby",
          "acceptableAnswers": [
            "aria-describedby",
            "'aria-describedby'"
          ],
          "primaryMisconceptionId": "MC_DS_TOOLTIPS_POPOVERS_FLOATING_UI",
          "diagnosisMap": {
            "aria-label": {
              "misconceptionId": "MC_DS_TOOLTIPS_POPOVERS_FLOATING_UI",
              "errorExplanation": "aria-label overrides button text. Tooltip supplementary text binds via aria-describedby.",
              "recoveryPath": {
                "simplerExplanation": "Type aria-describedby.",
                "guidedFixPrompt": "Type aria-describedby"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Data Tables, Pagination & Column Sorting: Accessible Grid Layouts",
    "overviewMetaphor": "A Data Table Is an Airport Departure Schedule Board: Every column header announces its direction (`aria-sort=\"ascending\"`), alternating rows have distinct flight lanes (Zebra Striping), and the board provides clear page navigation so passengers don't have to scroll through 10,000 flights on a single screen.",
    "blocks": [
      {
        "id": "design-d13-b1-table-sort-resolver",
        "day": 13,
        "blockNumber": 1,
        "title": "Data Table: Resolving `aria-sort=\"ascending\"` vs `\"none\"` on Column Headers",
        "conceptBudget": {
          "primaryConcept": "Data Table Header ARIA Sorting State Resolver",
          "supportingTerms": [
            "Active Sort Column (`'name'`)",
            "Sort Direction (`'asc'`)",
            "ARIA Sort Value (`'ascending'` vs `'none'`)",
            "Status: Table Sort ARIA Resolved Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d12-b1-floating-placement-flipper",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Data Table Header ARIA Sorting Ledger",
              "boxes": [
                {
                  "label": "Active Header: 'name'",
                  "value": "<th scope='col' aria-sort='ascending'>Name ▲</th>",
                  "varType": "Sorted Column",
                  "isUpdated": false
                },
                {
                  "label": "Inactive Header: 'age'",
                  "value": "<th scope='col' aria-sort='none'>Age</th>",
                  "varType": "Unsorted Column",
                  "isUpdated": false
                },
                {
                  "label": "ARIA Sort State",
                  "value": "TABLE SORT ARIA RESOLVED NOMINAL (SCREEN READER ACCESSIBLE!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "table_sort_demo.js",
            "initialCode": "function resolveSortAria(activeCol, colKey, dir) {\n  const match = activeCol === colKey;\n  const val = match ? (dir === 'asc' ? 'ascending' : 'descending') : 'none';\n  return {\n    colKey,\n    ariaSortValue: val,\n    status: 'TABLE_SORT_ARIA_RESOLVED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(resolveSortAria('name', 'name', 'asc')));\nconsole.log(JSON.stringify(resolveSortAria('age', 'name', 'asc')));",
            "expectedOutput": "{\"colKey\":\"name\",\"ariaSortValue\":\"ascending\",\"status\":\"TABLE_SORT_ARIA_RESOLVED_NOMINAL\"}\n{\"colKey\":\"name\",\"ariaSortValue\":\"none\",\"status\":\"TABLE_SORT_ARIA_RESOLVED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What aria-sort value is resolved for the active ascending column header?",
          "expectedStringOutput": "ascending",
          "acceptableAnswers": [
            "ascending",
            "ariaSortValue\":\"ascending\"",
            "'ascending'"
          ],
          "primaryMisconceptionId": "MC_DS_DATA_TABLES_PAGINATION_SORTING",
          "diagnosisMap": {
            "asc": {
              "misconceptionId": "MC_DS_DATA_TABLES_PAGINATION_SORTING",
              "errorExplanation": "The WAI-ARIA specification requires the full word 'ascending', not 'asc'.",
              "recoveryPath": {
                "simplerExplanation": "Type ascending.",
                "guidedFixPrompt": "Type ascending"
              }
            }
          }
        }
      },
      {
        "id": "design-d13-b2-table-header-scope-attribute",
        "day": 13,
        "blockNumber": 2,
        "title": "Semantic Table Headers: `scope=\"col\"`",
        "conceptBudget": {
          "primaryConcept": "`scope=\"col\"` Invariant",
          "supportingTerms": [
            "`scope=\"col\"` (`Explicitly marks a <th> cell as a header for all descendant cells in that column, enabling screen readers to announce column names while navigating rows`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d13-b1-table-sort-resolver",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Accessible Table HTML Structure",
            "codeSnippet": "<table>\n  <thead>\n    <tr>\n      <th scope=\"col\" aria-sort=\"ascending\">Employee Name</th>\n      <th scope=\"col\" aria-sort=\"none\">Department</th>\n    </tr>\n  </thead>\n  <tbody>...</tbody>\n</table>",
            "lineNotes": {
              "4": "scope=\"col\" establishes vertical column header context.",
              "5": "aria-sort=\"none\" indicates unsorted column."
            }
          },
          {
            "type": "runnable_code",
            "filename": "scope_col_demo.js",
            "initialCode": "function getTableScope() {\n  return 'col';\n}\n\nconsole.log(getTableScope());",
            "expectedOutput": "col",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What value is assigned to the 'scope' attribute for column header <th> cells?",
          "expectedStringOutput": "col",
          "acceptableAnswers": [
            "col",
            "'col'",
            "col value"
          ],
          "primaryMisconceptionId": "MC_DS_DATA_TABLES_PAGINATION_SORTING",
          "diagnosisMap": {
            "row": {
              "misconceptionId": "MC_DS_DATA_TABLES_PAGINATION_SORTING",
              "errorExplanation": "row is for row headers. Column headers use scope='col'.",
              "recoveryPath": {
                "simplerExplanation": "Type col.",
                "guidedFixPrompt": "Type col"
              }
            }
          }
        }
      },
      {
        "id": "design-d13-b3-horizontal-scroll-containment",
        "day": 13,
        "blockNumber": 3,
        "title": "Mobile Responsiveness: Horizontal Scroll Containment with `overflow-x: auto`",
        "conceptBudget": {
          "primaryConcept": "Horizontal Scroll Invariant",
          "supportingTerms": [
            "Horizontal Scroll Containment (`Wrapping data tables in a container with 'overflow-x: auto' and 'tabindex=\"0\"' prevents table columns from blowing out the global mobile viewport`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d13-b2-table-header-scope-attribute",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "table_scroll_demo.js",
            "initialCode": "function getTableScrollRule() {\n  return 'WRAP_TABLES_IN_OVERFLOW_X_AUTO_CONTAINER_FOR_MOBILE_VIEWPORTS';\n}\n\nconsole.log(getTableScrollRule());",
            "expectedOutput": "WRAP_TABLES_IN_OVERFLOW_X_AUTO_CONTAINER_FOR_MOBILE_VIEWPORTS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What technique prevents large data tables from breaking mobile responsive layouts?",
          "expectedStringOutput": "WRAP_TABLES_IN_OVERFLOW_X_AUTO_CONTAINER_FOR_MOBILE_VIEWPORTS",
          "acceptableAnswers": [
            "WRAP_TABLES_IN_OVERFLOW_X_AUTO_CONTAINER_FOR_MOBILE_VIEWPORTS",
            "Wrap in overflow-x container",
            "overflow-x: auto"
          ],
          "primaryMisconceptionId": "MC_DS_DATA_TABLES_PAGINATION_SORTING",
          "diagnosisMap": {
            "HIDE_COLUMNS": {
              "misconceptionId": "MC_DS_DATA_TABLES_PAGINATION_SORTING",
              "errorExplanation": "Standard is: WRAP_TABLES_IN_OVERFLOW_X_AUTO_CONTAINER_FOR_MOBILE_VIEWPORTS.",
              "recoveryPath": {
                "simplerExplanation": "Matches WRAP_TABLES_IN_OVERFLOW_X_AUTO_CONTAINER_FOR_MOBILE_VIEWPORTS.",
                "guidedFixPrompt": "Type WRAP_TABLES_IN_OVERFLOW_X_AUTO_CONTAINER_FOR_MOBILE_VIEWPORTS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Toast Notifications & Global Alert Banners: Stacking Managers & ARIA Live",
    "overviewMetaphor": "Toast Notifications Are Radio Dispatches in Emergency Services: Routine informational updates ('Settings saved') transmit politely on channel 2 (`aria-live=\"polite\"`), allowing active conversations to finish; a critical server error ('Payment gateway failed') breaks into the radio immediately (`aria-live=\"assertive\"`) to command urgent attention.",
    "blocks": [
      {
        "id": "design-d14-b1-toast-aria-live-matcher",
        "day": 14,
        "blockNumber": 1,
        "title": "Toast Notifications: Mapping `'info'` $\\to$ `aria-live=\"polite\"` vs `'error'` $\\to$ `\"assertive\"`",
        "conceptBudget": {
          "primaryConcept": "Toast Notification Queue & ARIA Live Politeness Matcher",
          "supportingTerms": [
            "Toast Type (`'info'` vs `'error'`)",
            "Politeness (`'polite'` vs `'assertive'`)",
            "Role Attribute (`'status'` vs `'alert'`)",
            "Status: Toast ARIA Live Resolved Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d13-b1-table-sort-resolver",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Toast ARIA Live Politeness Ledger",
              "boxes": [
                {
                  "label": "Info/Success Toast",
                  "value": "aria-live='polite' role='status' (Announces when user is idle)",
                  "varType": "Polite",
                  "isUpdated": false
                },
                {
                  "label": "Critical Error Toast",
                  "value": "aria-live='assertive' role='alert' (Interrupts speech immediately)",
                  "varType": "Assertive",
                  "isUpdated": false
                },
                {
                  "label": "Politeness Resolution",
                  "value": "TOAST ARIA LIVE RESOLVED NOMINAL (AUDIO DYNAMICS BALANCED!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "toast_aria_demo.js",
            "initialCode": "function resolveToast(type) {\n  const pol = type === 'error' ? 'assertive' : 'polite';\n  return {\n    type,\n    ariaLivePoliteness: pol,\n    roleAttribute: type === 'error' ? 'alert' : 'status',\n    status: 'TOAST_ARIA_LIVE_RESOLVED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(resolveToast('info')));\nconsole.log(JSON.stringify(resolveToast('error')));",
            "expectedOutput": "{\"type\":\"info\",\"ariaLivePoliteness\":\"polite\",\"roleAttribute\":\"status\",\"status\":\"TOAST_ARIA_LIVE_RESOLVED_NOMINAL\"}\n{\"type\":\"error\",\"ariaLivePoliteness\":\"assertive\",\"roleAttribute\":\"alert\",\"status\":\"TOAST_ARIA_LIVE_RESOLVED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What aria-live politeness setting is resolved for critical 'error' toast notifications?",
          "expectedStringOutput": "assertive",
          "acceptableAnswers": [
            "assertive",
            "ariaLivePoliteness\":\"assertive\"",
            "'assertive'"
          ],
          "primaryMisconceptionId": "MC_DS_TOAST_NOTIFICATIONS_ALERT_BANNERS",
          "diagnosisMap": {
            "polite": {
              "misconceptionId": "MC_DS_TOAST_NOTIFICATIONS_ALERT_BANNERS",
              "errorExplanation": "Critical errors require immediate interruption: 'assertive'.",
              "recoveryPath": {
                "simplerExplanation": "Politeness is assertive.",
                "guidedFixPrompt": "Type assertive"
              }
            }
          }
        }
      },
      {
        "id": "design-d14-b2-max-toast-stack-count",
        "day": 14,
        "blockNumber": 2,
        "title": "Toast Stacking: Maximum 3 Active Toasts Invariant",
        "conceptBudget": {
          "primaryConcept": "Toast Stack Invariant",
          "supportingTerms": [
            "Maximum 3 Toasts (`Restricting active floating toasts to at most 3 prevents notifications from obscuring the underlying UI workflow`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d14-b1-toast-aria-live-matcher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Toast Queue Lifecycle",
            "codeSnippet": "// 1. New toast pushed into queue\n// 2. If queue.length > 3, oldest toast dismissed immediately\n// 3. Toasts auto-dismiss after 5000ms, paused while user hovers pointer",
            "lineNotes": {
              "1": "Push event.",
              "2": "Maximum 3 cap enforcement.",
              "3": "Auto-dismiss and hover pause."
            }
          },
          {
            "type": "runnable_code",
            "filename": "toast_stack_demo.js",
            "initialCode": "function getMaxToasts() {\n  return 3;\n}\n\nconsole.log(getMaxToasts());",
            "expectedOutput": "3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum recommended number of concurrently visible toast notifications in a UI stack?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "3 toasts",
            "three"
          ],
          "primaryMisconceptionId": "MC_DS_TOAST_NOTIFICATIONS_ALERT_BANNERS",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_DS_TOAST_NOTIFICATIONS_ALERT_BANNERS",
              "errorExplanation": "10 toasts cover the screen. Standard ceiling is 3.",
              "recoveryPath": {
                "simplerExplanation": "Type 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "design-d14-b3-pause-on-hover-toast-dismissal",
        "day": 14,
        "blockNumber": 3,
        "title": "Accessibility UX: Pausing Auto-Dismiss Timers on Mouse Hover & Focus",
        "conceptBudget": {
          "primaryConcept": "Pause on Hover Invariant",
          "supportingTerms": [
            "Pause on Hover (`Freezing auto-dismiss countdowns whenever a user hovers or focuses on a toast gives users adequate time to read content`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d14-b2-max-toast-stack-count",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pause_hover_demo.js",
            "initialCode": "function getToastDismissRule() {\n  return 'PAUSE_AUTO_DISMISS_TIMER_ON_POINTER_HOVER_AND_KEYBOARD_FOCUS';\n}\n\nconsole.log(getToastDismissRule());",
            "expectedOutput": "PAUSE_AUTO_DISMISS_TIMER_ON_POINTER_HOVER_AND_KEYBOARD_FOCUS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What accessibility behavior must auto-dismissing toast notifications implement?",
          "expectedStringOutput": "PAUSE_AUTO_DISMISS_TIMER_ON_POINTER_HOVER_AND_KEYBOARD_FOCUS",
          "acceptableAnswers": [
            "PAUSE_AUTO_DISMISS_TIMER_ON_POINTER_HOVER_AND_KEYBOARD_FOCUS",
            "Pause on hover",
            "Pause on pointer hover and focus"
          ],
          "primaryMisconceptionId": "MC_DS_TOAST_NOTIFICATIONS_ALERT_BANNERS",
          "diagnosisMap": {
            "FORCE_DISMISS": {
              "misconceptionId": "MC_DS_TOAST_NOTIFICATIONS_ALERT_BANNERS",
              "errorExplanation": "Rule is: PAUSE_AUTO_DISMISS_TIMER_ON_POINTER_HOVER_AND_KEYBOARD_FOCUS.",
              "recoveryPath": {
                "simplerExplanation": "Matches PAUSE_AUTO_DISMISS_TIMER_ON_POINTER_HOVER_AND_KEYBOARD_FOCUS.",
                "guidedFixPrompt": "Type PAUSE_AUTO_DISMISS_TIMER_ON_POINTER_HOVER_AND_KEYBOARD_FOCUS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Atomic Component Library, WCAG Contrast & Accessible Form Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete intermediate design component library: 1. Atomic hierarchy classification; 2. 6-state button validation; 3. Accessible form input auditing; 4. Card layout verification; 5. Modal focus trapping; 6. Toast notification queue management.",
    "blocks": [
      {
        "id": "design-d15-b1-component-library-master-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Component Library Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Component Library Master Engine",
          "supportingTerms": [
            "Atomic Tier Subsystem",
            "Button State Subsystem",
            "Accessible Form Subsystem",
            "Card Layout Subsystem",
            "Modal Overlay Subsystem",
            "Toast Queue Subsystem"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d14-b3-pause-on-hover-toast-dismissal",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 Component Library Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Classifies Atomic Design hierarchies & validates 6-state buttons",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Audits accessible form inputs & verifies 16:9 card aspect ratios",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Traps modal keyboard focus & manages toast politeness queues",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Activates Component Library Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "component_kernel_demo.js",
            "initialCode": "function runComponentMaster() {\n  return {\n    atomicSubsystem: 'ONLINE_ATOMIC_HIERARCHY_ACTIVE',\n    buttonSubsystem: 'ONLINE_6_STATE_ACTIVE',\n    formSubsystem: 'ONLINE_ACCESSIBLE_INPUT_ACTIVE',\n    cardSubsystem: 'ONLINE_16_9_ASPECT_ACTIVE',\n    modalSubsystem: 'ONLINE_FOCUS_TRAP_ACTIVE',\n    toastSubsystem: 'ONLINE_ARIA_LIVE_ACTIVE',\n    engineStatus: 'COMPONENT_LIBRARY_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runComponentMaster().engineStatus);",
            "expectedOutput": "COMPONENT_LIBRARY_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Component Library Master Engine?",
          "expectedStringOutput": "COMPONENT_LIBRARY_MASTER_ACTIVE",
          "acceptableAnswers": [
            "COMPONENT_LIBRARY_MASTER_ACTIVE",
            "engineStatus: COMPONENT_LIBRARY_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_DS_ATOMIC_DESIGN_METHODOLOGY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DS_ATOMIC_DESIGN_METHODOLOGY",
              "errorExplanation": "Matches COMPONENT_LIBRARY_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type COMPONENT_LIBRARY_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "design-d15-b2-component-library-engine-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Component Library Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Component Library Invariant Verification",
          "supportingTerms": [
            "Button Invariant",
            "Modal Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d15-b1-component-library-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "component_audit_demo.js",
            "initialCode": "function auditComponents(a, b, f, c, m, t) {\n  const passed = a && b && f && c && m && t;\n  return {\n    atomicVerified: a,\n    buttonVerified: b,\n    formVerified: f,\n    cardVerified: c,\n    modalVerified: m,\n    toastVerified: t,\n    grade: passed ? 'COMPONENT_LIBRARY_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditComponents(true, true, true, true, true, true)));",
            "expectedOutput": "{\"atomicVerified\":true,\"buttonVerified\":true,\"formVerified\":true,\"cardVerified\":true,\"modalVerified\":true,\"toastVerified\":true,\"grade\":\"COMPONENT_LIBRARY_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Atomic Tiers, Buttons, Forms, Cards, Modals, and Toasts pass 100%?",
          "expectedStringOutput": "COMPONENT_LIBRARY_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "COMPONENT_LIBRARY_ENGINE_AUDIT_PASSED",
            "grade\":\"COMPONENT_LIBRARY_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_DS_ATOMIC_DESIGN_METHODOLOGY",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DS_ATOMIC_DESIGN_METHODOLOGY",
              "errorExplanation": "All checks passing awards COMPONENT_LIBRARY_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards COMPONENT_LIBRARY_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type COMPONENT_LIBRARY_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "design-d15-b3-milestone2-design-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Component Library Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Component Library Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d15-b2-component-library-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_design_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Atomic Component Library, WCAG Contrast & Accessible Form Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Atomic Component Library, WCAG Contrast & Accessible Form Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Atomic Component Library, WCAG Contrast & Accessible Form Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Atomic Component Library, WCAG Contrast & Accessible Form Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DS_ATOMIC_DESIGN_METHODOLOGY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DS_ATOMIC_DESIGN_METHODOLOGY",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Atomic Component Library, WCAG Contrast & Accessible Form Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "CSS Flexbox Layout Mastery: Main Axis, Cross Axis, Flex Ratios & Gap Spacing",
    "overviewMetaphor": "CSS Flexbox Is an Elastic Conveyor Belt: The belt has a primary conveyor direction (Main Axis controlled by `justify-content`), a perpendicular conveyor rail (Cross Axis controlled by `align-items`), and automatic spacer blocks (Native CSS `gap`) that space packages evenly without requiring messy negative margin hacks.",
    "blocks": [
      {
        "id": "design-d16-b1-flex-item-calculator",
        "day": 16,
        "blockNumber": 1,
        "title": "Flexbox Math: Calculating Equal Item Widths with Native Gap Spacing ($238\\text{px}$)",
        "conceptBudget": {
          "primaryConcept": "Flexbox Item Basis & Distribution Calculator",
          "supportingTerms": [
            "Container Width ($1000\\text{px}$)",
            "Item Count ($4$ items)",
            "Gap Size ($16\\text{px}$)",
            "Computed Width ($\\frac{1000 - 3 \\times 16}{4} = 238\\text{px}$)",
            "Status: Flex Item Width Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d15-b1-component-library-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Flexbox Spatial Distribution Ledger",
              "boxes": [
                {
                  "label": "Container Width",
                  "value": "1000px total available horizontal space",
                  "varType": "Container",
                  "isUpdated": false
                },
                {
                  "label": "Total Gap Space",
                  "value": "(4 items - 1) * 16px gap = 48px occupied by gaps",
                  "varType": "Gaps",
                  "isUpdated": false
                },
                {
                  "label": "Computed Item Width",
                  "value": "(1000px - 48px) / 4 = 238px (CALCULATED NOMINAL!)",
                  "varType": "Item Width",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "flex_calc_demo.js",
            "initialCode": "function calcFlexWidth(containerW, count, gap) {\n  const totalGaps = (count - 1) * gap;\n  const itemWidth = Number(((containerW - totalGaps) / count).toFixed(2));\n  return {\n    containerWidth: containerW,\n    itemCount: count,\n    computedItemWidth: itemWidth,\n    status: 'FLEX_ITEM_WIDTH_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcFlexWidth(1000, 4, 16)));",
            "expectedOutput": "{\"containerWidth\":1000,\"itemCount\":4,\"computedItemWidth\":238,\"status\":\"FLEX_ITEM_WIDTH_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the computed width of each item in a 1000px container holding 4 items with 16px gap?",
          "expectedStringOutput": "238",
          "acceptableAnswers": [
            "238",
            "computedItemWidth\":238",
            "238px",
            "238 px"
          ],
          "primaryMisconceptionId": "MC_DS_CSS_FLEXBOX_LAYOUT_MASTERY",
          "diagnosisMap": {
            "250": {
              "misconceptionId": "MC_DS_CSS_FLEXBOX_LAYOUT_MASTERY",
              "errorExplanation": "250 ignores the 3 gap spaces (48px). (1000 - 48) / 4 = 238px.",
              "recoveryPath": {
                "simplerExplanation": "Width is 238.",
                "guidedFixPrompt": "Type 238"
              }
            }
          }
        }
      },
      {
        "id": "design-d16-b2-justify-content-axis-name",
        "day": 16,
        "blockNumber": 2,
        "title": "The Axis Controlled by `justify-content`: Main Axis",
        "conceptBudget": {
          "primaryConcept": "Main Axis Invariant",
          "supportingTerms": [
            "Main Axis (`The primary direction along which flex items are laid out; row by default, or column if flex-direction: column`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d16-b1-flex-item-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Flexbox Axis Rules",
            "codeSnippet": ".flex-container {\n  display: flex;\n  flex-direction: row;     /* Main Axis = Horizontal, Cross Axis = Vertical */\n  justify-content: center; /* Aligns along MAIN AXIS! */\n  align-items: center;     /* Aligns along CROSS AXIS! */\n  gap: 16px;\n}",
            "lineNotes": {
              "3": "Main Axis direction.",
              "4": "justify-content aligns along Main Axis.",
              "5": "align-items aligns along Cross Axis."
            }
          },
          {
            "type": "runnable_code",
            "filename": "main_axis_demo.js",
            "initialCode": "function getJustifyAxis() {\n  return 'main-axis';\n}\n\nconsole.log(getJustifyAxis());",
            "expectedOutput": "main-axis",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which axis does the CSS 'justify-content' property distribute flex items along?",
          "expectedStringOutput": "main-axis",
          "acceptableAnswers": [
            "main-axis",
            "main axis",
            "Main Axis",
            "'main-axis'"
          ],
          "primaryMisconceptionId": "MC_DS_CSS_FLEXBOX_LAYOUT_MASTERY",
          "diagnosisMap": {
            "cross-axis": {
              "misconceptionId": "MC_DS_CSS_FLEXBOX_LAYOUT_MASTERY",
              "errorExplanation": "Cross axis is controlled by align-items. justify-content controls main-axis.",
              "recoveryPath": {
                "simplerExplanation": "Type main-axis.",
                "guidedFixPrompt": "Type main-axis"
              }
            }
          }
        }
      },
      {
        "id": "design-d16-b3-native-css-gap-spacing",
        "day": 16,
        "blockNumber": 3,
        "title": "Modern Layouts: Eliminating Negative Margin Hacks with Native CSS `gap`",
        "conceptBudget": {
          "primaryConcept": "CSS gap Invariant",
          "supportingTerms": [
            "Native CSS gap (`Replaces legacy negative margin hacks on parents and ':not(:last-child)' rules on children with clean mathematical spacing`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d16-b2-justify-content-axis-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gap_standard_demo.js",
            "initialCode": "function getGapRule() {\n  return 'USE_NATIVE_CSS_GAP_FOR_FLEXBOX_AND_GRID_SPATIAL_SEPARATION';\n}\n\nconsole.log(getGapRule());",
            "expectedOutput": "USE_NATIVE_CSS_GAP_FOR_FLEXBOX_AND_GRID_SPATIAL_SEPARATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What CSS property provides standard item separation without negative margin hacks?",
          "expectedStringOutput": "USE_NATIVE_CSS_GAP_FOR_FLEXBOX_AND_GRID_SPATIAL_SEPARATION",
          "acceptableAnswers": [
            "USE_NATIVE_CSS_GAP_FOR_FLEXBOX_AND_GRID_SPATIAL_SEPARATION",
            "Native CSS gap",
            "gap property"
          ],
          "primaryMisconceptionId": "MC_DS_CSS_FLEXBOX_LAYOUT_MASTERY",
          "diagnosisMap": {
            "MARGIN_RIGHT": {
              "misconceptionId": "MC_DS_CSS_FLEXBOX_LAYOUT_MASTERY",
              "errorExplanation": "Standard is: USE_NATIVE_CSS_GAP_FOR_FLEXBOX_AND_GRID_SPATIAL_SEPARATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches USE_NATIVE_CSS_GAP_FOR_FLEXBOX_AND_GRID_SPATIAL_SEPARATION.",
                "guidedFixPrompt": "Type USE_NATIVE_CSS_GAP_FOR_FLEXBOX_AND_GRID_SPATIAL_SEPARATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "CSS Grid Layouts & Responsive Template Areas: auto-fit vs auto-fill",
    "overviewMetaphor": "CSS Grid `repeat(auto-fit, minmax(280px, 1fr))` Is an Elastic Bookshelf: As you widen the bookshelf (Screen width expands), the shelf automatically calculates how many 280px books fit in the row ($900\\text{px} \\to 3$ columns); when there is extra room, the books stretch smoothly (`1fr`) to fill the entire shelf with zero empty holes.",
    "blocks": [
      {
        "id": "design-d17-b1-grid-columns-calculator",
        "day": 17,
        "blockNumber": 1,
        "title": "CSS Grid: Calculating `auto-fit` Column Counts ($900\\text{px} \\to 3$ columns)",
        "conceptBudget": {
          "primaryConcept": "CSS Grid auto-fit Column Count Evaluator",
          "supportingTerms": [
            "Container Width ($900\\text{px}$)",
            "Min Column Width ($280\\text{px}$)",
            "Gap Size ($20\\text{px}$)",
            "Generated Columns ($3$ columns)",
            "Status: Grid Columns Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d16-b1-flex-item-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CSS Grid auto-fit Calculation Ledger",
              "boxes": [
                {
                  "label": "Container Width",
                  "value": "900px total grid container width",
                  "varType": "Container",
                  "isUpdated": false
                },
                {
                  "label": "3 Columns Width",
                  "value": "(3 * 280px) + (2 * 20px gap) = 840px + 40px = 880px <= 900px",
                  "varType": "Math",
                  "isUpdated": false
                },
                {
                  "label": "Generated Columns",
                  "value": "3 columns fitting smoothly (CALCULATED NOMINAL!)",
                  "varType": "Columns",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "grid_calc_demo.js",
            "initialCode": "function calcGridCols(containerW, minW, gap) {\n  let cols = 1;\n  while ((cols + 1) * minW + cols * gap <= containerW) cols++;\n  return {\n    containerWidth: containerW,\n    generatedColumnsCount: cols,\n    status: 'GRID_COLUMNS_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcGridCols(900, 280, 20)));",
            "expectedOutput": "{\"containerWidth\":900,\"generatedColumnsCount\":3,\"status\":\"GRID_COLUMNS_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many columns are generated in a 900px container using minmax(280px, 1fr) with 20px gap?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "generatedColumnsCount\":3",
            "3 columns",
            "three"
          ],
          "primaryMisconceptionId": "MC_DS_CSS_GRID_LAYOUTS_TEMPLATE_AREAS",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_DS_CSS_GRID_LAYOUTS_TEMPLATE_AREAS",
              "errorExplanation": "4 cols requires (4 * 280) + (3 * 20) = 1180px > 900px. Only 3 columns fit.",
              "recoveryPath": {
                "simplerExplanation": "Column count is 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "design-d17-b2-fluid-grid-minmax-function",
        "day": 17,
        "blockNumber": 2,
        "title": "The Fluid Column Sizing Function: `minmax()`",
        "conceptBudget": {
          "primaryConcept": "`minmax()` Function Invariant",
          "supportingTerms": [
            "`minmax()` (`Defines a size range between a minimum (e.g. 280px) and maximum (e.g. 1fr), creating fully responsive card grids without writing media queries`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d17-b1-grid-columns-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Responsive CSS Grid Syntax",
            "codeSnippet": ".product-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 24px;\n}",
            "lineNotes": {
              "2": "Activates CSS Grid.",
              "3": "auto-fit collapses empty tracks; minmax(280px, 1fr) guarantees fluid responsive cards.",
              "4": "Clean 24px gap."
            }
          },
          {
            "type": "runnable_code",
            "filename": "minmax_demo.js",
            "initialCode": "function getGridFunc() {\n  return 'minmax';\n}\n\nconsole.log(getGridFunc());",
            "expectedOutput": "minmax",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What CSS Grid sizing function enables fluid column width bounds without media queries?",
          "expectedStringOutput": "minmax",
          "acceptableAnswers": [
            "minmax",
            "minmax()",
            "'minmax'"
          ],
          "primaryMisconceptionId": "MC_DS_CSS_GRID_LAYOUTS_TEMPLATE_AREAS",
          "diagnosisMap": {
            "clamp": {
              "misconceptionId": "MC_DS_CSS_GRID_LAYOUTS_TEMPLATE_AREAS",
              "errorExplanation": "clamp() is for fluid values. In grid-template-columns, use minmax(min, max).",
              "recoveryPath": {
                "simplerExplanation": "Type minmax.",
                "guidedFixPrompt": "Type minmax"
              }
            }
          }
        }
      },
      {
        "id": "design-d17-b3-auto-fit-vs-auto-fill-distinction",
        "day": 17,
        "blockNumber": 3,
        "title": "Grid Architecture: Why `auto-fit` is Preferred Over `auto-fill` for Card Grids",
        "conceptBudget": {
          "primaryConcept": "`auto-fit` Invariant",
          "supportingTerms": [
            "`auto-fit` vs `auto-fill` (`'auto-fit' stretches existing cards across empty tracks; 'auto-fill' leaves empty placeholder space on the right`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d17-b2-fluid-grid-minmax-function",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "auto_fit_rule_demo.js",
            "initialCode": "function getAutoFitRule() {\n  return 'AUTO_FIT_STRETCHES_EXISTING_COLUMNS_TO_PREVENT_AWKWARD_EMPTY_GAPS';\n}\n\nconsole.log(getAutoFitRule());",
            "expectedOutput": "AUTO_FIT_STRETCHES_EXISTING_COLUMNS_TO_PREVENT_AWKWARD_EMPTY_GAPS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why is 'auto-fit' standard in design system product card grids?",
          "expectedStringOutput": "AUTO_FIT_STRETCHES_EXISTING_COLUMNS_TO_PREVENT_AWKWARD_EMPTY_GAPS",
          "acceptableAnswers": [
            "AUTO_FIT_STRETCHES_EXISTING_COLUMNS_TO_PREVENT_AWKWARD_EMPTY_GAPS",
            "Stretches existing columns",
            "Prevents empty gaps"
          ],
          "primaryMisconceptionId": "MC_DS_CSS_GRID_LAYOUTS_TEMPLATE_AREAS",
          "diagnosisMap": {
            "LEAVE_EMPTY": {
              "misconceptionId": "MC_DS_CSS_GRID_LAYOUTS_TEMPLATE_AREAS",
              "errorExplanation": "Rule is: AUTO_FIT_STRETCHES_EXISTING_COLUMNS_TO_PREVENT_AWKWARD_EMPTY_GAPS.",
              "recoveryPath": {
                "simplerExplanation": "Matches AUTO_FIT_STRETCHES_EXISTING_COLUMNS_TO_PREVENT_AWKWARD_EMPTY_GAPS.",
                "guidedFixPrompt": "Type AUTO_FIT_STRETCHES_EXISTING_COLUMNS_TO_PREVENT_AWKWARD_EMPTY_GAPS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Responsive Breakpoints & Mobile-First Media Queries: Standard Breakpoint Scales",
    "overviewMetaphor": "Mobile-First Responsive Design Is Building an Expandable Telescope: You design the core pocket-sized lens first (Mobile $375\\text{px}$ `MOBILE_SM`); as the telescope extends outward through rings ($768\\text{px}$ `TABLET_MD` $\\to 1024\\text{px}$ `DESKTOP_LG`), you progressively add extra viewports using `min-width` queries.",
    "blocks": [
      {
        "id": "design-d18-b1-breakpoint-classifier",
        "day": 18,
        "blockNumber": 1,
        "title": "Breakpoints: Classifying `375px (MOBILE_SM)`, `768px (TABLET_MD)`, `1100px (DESKTOP_LG)`",
        "conceptBudget": {
          "primaryConcept": "Responsive Breakpoint Tier Classifier",
          "supportingTerms": [
            "Mobile Breakpoint (`'MOBILE_SM'`)",
            "Tablet Breakpoint (`'TABLET_MD'`)",
            "Desktop Breakpoint (`'DESKTOP_LG'`)",
            "Status: Breakpoint Classified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d17-b1-grid-columns-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Standard Breakpoint Hierarchy Ledger",
              "boxes": [
                {
                  "label": "Mobile (<640px)",
                  "value": "375px -> MOBILE_SM (Single column stacked layout)",
                  "varType": "Mobile",
                  "isUpdated": false
                },
                {
                  "label": "Tablet (<1024px)",
                  "value": "768px -> TABLET_MD (2-column layout + drawer nav)",
                  "varType": "Tablet",
                  "isUpdated": false
                },
                {
                  "label": "Desktop (<1280px)",
                  "value": "1100px -> DESKTOP_LG (3-4 column layout - CLASSIFIED NOMINAL!)",
                  "varType": "Desktop",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "breakpoint_demo.js",
            "initialCode": "function classifyBp(w) {\n  let bp = 'WIDE_XL';\n  if (w < 640) bp = 'MOBILE_SM';\n  else if (w < 1024) bp = 'TABLET_MD';\n  else if (w < 1280) bp = 'DESKTOP_LG';\n  return {\n    width: w,\n    breakpoint: bp,\n    status: 'BREAKPOINT_CLASSIFIED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(classifyBp(375)));\nconsole.log(JSON.stringify(classifyBp(768)));\nconsole.log(JSON.stringify(classifyBp(1100)));",
            "expectedOutput": "{\"width\":375,\"breakpoint\":\"MOBILE_SM\",\"status\":\"BREAKPOINT_CLASSIFIED_NOMINAL\"}\n{\"width\":768,\"breakpoint\":\"TABLET_MD\",\"status\":\"BREAKPOINT_CLASSIFIED_NOMINAL\"}\n{\"width\":1100,\"breakpoint\":\"DESKTOP_LG\",\"status\":\"BREAKPOINT_CLASSIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What breakpoint tier is classified for an iPad tablet at 768px viewport width?",
          "expectedStringOutput": "TABLET_MD",
          "acceptableAnswers": [
            "TABLET_MD",
            "breakpoint\":\"TABLET_MD\"",
            "Tablet MD"
          ],
          "primaryMisconceptionId": "MC_DS_RESPONSIVE_BREAKPOINTS_MEDIA_QUERIES",
          "diagnosisMap": {
            "MOBILE_SM": {
              "misconceptionId": "MC_DS_RESPONSIVE_BREAKPOINTS_MEDIA_QUERIES",
              "errorExplanation": "768px is >= 640px and < 1024px, classifying it as TABLET_MD.",
              "recoveryPath": {
                "simplerExplanation": "Breakpoint is TABLET_MD.",
                "guidedFixPrompt": "Type TABLET_MD"
              }
            }
          }
        }
      },
      {
        "id": "design-d18-b2-mobile-first-min-width-query",
        "day": 18,
        "blockNumber": 2,
        "title": "The Mobile-First Media Query Type: `min-width`",
        "conceptBudget": {
          "primaryConcept": "`min-width` Query Invariant",
          "supportingTerms": [
            "`min-width` (`Writing baseline CSS for mobile phones and applying '@media (min-width: 768px)' to progressively enhance layout for larger screens`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d18-b1-breakpoint-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Mobile-First CSS Strategy",
            "codeSnippet": "/* Baseline Mobile: 0 to 639px */\n.container { padding: 16px; flex-direction: column; }\n\n/* Enhanced Tablet: 640px+ */\n@media (min-width: 640px) {\n  .container { padding: 24px; flex-direction: row; }\n}",
            "lineNotes": {
              "2": "Default mobile styles outside media query.",
              "5": "@media (min-width: ...) adds enhanced layout."
            }
          },
          {
            "type": "runnable_code",
            "filename": "min_width_demo.js",
            "initialCode": "function getMobileFirstQuery() {\n  return 'min-width';\n}\n\nconsole.log(getMobileFirstQuery());",
            "expectedOutput": "min-width",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What CSS media query feature is used exclusively in mobile-first responsive architectures?",
          "expectedStringOutput": "min-width",
          "acceptableAnswers": [
            "min-width",
            "'min-width'",
            "min width"
          ],
          "primaryMisconceptionId": "MC_DS_RESPONSIVE_BREAKPOINTS_MEDIA_QUERIES",
          "diagnosisMap": {
            "max-width": {
              "misconceptionId": "MC_DS_RESPONSIVE_BREAKPOINTS_MEDIA_QUERIES",
              "errorExplanation": "max-width is desktop-first (graceful degradation). Mobile-first uses min-width.",
              "recoveryPath": {
                "simplerExplanation": "Type min-width.",
                "guidedFixPrompt": "Type min-width"
              }
            }
          }
        }
      },
      {
        "id": "design-d18-b3-preventing-breakpoint-overlap-bugs",
        "day": 18,
        "blockNumber": 3,
        "title": "Boundary Precision: Preventing Breakpoint Overlap Collisions",
        "conceptBudget": {
          "primaryConcept": "Boundary Precision Invariant",
          "supportingTerms": [
            "Boundary Precision (`Never using overlapping values like max-width: 768px and min-width: 768px; use strict min-width ascending scales`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d18-b2-mobile-first-min-width-query",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "breakpoint_precision_demo.js",
            "initialCode": "function getBreakpointRule() {\n  return 'USE_STRICT_ASCENDING_MIN_WIDTH_MEDIA_QUERIES_TO_PREVENT_OVERLAP_BUGS';\n}\n\nconsole.log(getBreakpointRule());",
            "expectedOutput": "USE_STRICT_ASCENDING_MIN_WIDTH_MEDIA_QUERIES_TO_PREVENT_OVERLAP_BUGS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do design systems prevent media query collision bugs on breakpoint boundaries?",
          "expectedStringOutput": "USE_STRICT_ASCENDING_MIN_WIDTH_MEDIA_QUERIES_TO_PREVENT_OVERLAP_BUGS",
          "acceptableAnswers": [
            "USE_STRICT_ASCENDING_MIN_WIDTH_MEDIA_QUERIES_TO_PREVENT_OVERLAP_BUGS",
            "Ascending min-width queries",
            "Strict ascending min-width"
          ],
          "primaryMisconceptionId": "MC_DS_RESPONSIVE_BREAKPOINTS_MEDIA_QUERIES",
          "diagnosisMap": {
            "MIX_MIN_MAX": {
              "misconceptionId": "MC_DS_RESPONSIVE_BREAKPOINTS_MEDIA_QUERIES",
              "errorExplanation": "Mixing min and max causes collisions. Standard is: USE_STRICT_ASCENDING_MIN_WIDTH_MEDIA_QUERIES_TO_PREVENT_OVERLAP_BUGS.",
              "recoveryPath": {
                "simplerExplanation": "Matches USE_STRICT_ASCENDING_MIN_WIDTH_MEDIA_QUERIES_TO_PREVENT_OVERLAP_BUGS.",
                "guidedFixPrompt": "Type USE_STRICT_ASCENDING_MIN_WIDTH_MEDIA_QUERIES_TO_PREVENT_OVERLAP_BUGS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Fluid Layouts, Modern CSS Math & Container Queries: @container & clamp()",
    "overviewMetaphor": "CSS Container Queries Are Smart Shipping Furniture: A modular sofa doesn't care how wide the entire house is (Global Viewport); it inspects its immediate living room corner (`@container (min-width: 400px)`), automatically unfolding an ottoman if the local container permits.",
    "blocks": [
      {
        "id": "design-d19-b1-css-clamp-formatter",
        "day": 19,
        "blockNumber": 1,
        "title": "Fluid Math: Formatting `clamp(1rem, 2.5vw, 2rem)` for Smooth Responsiveness",
        "conceptBudget": {
          "primaryConcept": "CSS clamp() Value Bounds Formatter",
          "supportingTerms": [
            "Minimum Value (`1rem`)",
            "Preferred Rate (`2.5vw`)",
            "Maximum Ceiling (`2rem`)",
            "CSS Expression (`'clamp(1rem, 2.5vw, 2rem)'`)",
            "Status: CSS Clamp Expression Generated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d18-b1-breakpoint-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CSS clamp() Mathematical Bounds Ledger",
              "boxes": [
                {
                  "label": "Minimum Bound",
                  "value": "1.0rem = 16px floor on mobile screens",
                  "varType": "Floor",
                  "isUpdated": false
                },
                {
                  "label": "Preferred Scaler",
                  "value": "2.5vw = viewport percentage scaling smoothly",
                  "varType": "Rate",
                  "isUpdated": false
                },
                {
                  "label": "Maximum Bound",
                  "value": "2.0rem = 32px ceiling on 4K displays (GENERATED NOMINAL!)",
                  "varType": "Ceiling",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "clamp_demo.js",
            "initialCode": "function formatClamp(min, prefVw, max) {\n  const str = `clamp(${min}rem, ${prefVw}vw, ${max}rem)`;\n  return {\n    cssClampExpression: str,\n    status: 'CSS_CLAMP_EXPRESSION_GENERATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(formatClamp(1.0, 2.5, 2.0)));",
            "expectedOutput": "{\"cssClampExpression\":\"clamp(1rem, 2.5vw, 2rem)\",\"status\":\"CSS_CLAMP_EXPRESSION_GENERATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What CSS expression is generated for 1.0rem min, 2.5vw preferred, and 2.0rem max?",
          "expectedStringOutput": "clamp(1rem, 2.5vw, 2rem)",
          "acceptableAnswers": [
            "clamp(1rem, 2.5vw, 2rem)",
            "cssClampExpression\":\"clamp(1rem, 2.5vw, 2rem)\"",
            "'clamp(1rem, 2.5vw, 2rem)'"
          ],
          "primaryMisconceptionId": "MC_DS_FLUID_LAYOUTS_CLAMP_CONTAINER_QUERIES",
          "diagnosisMap": {
            "clamp(1, 2.5, 2)": {
              "misconceptionId": "MC_DS_FLUID_LAYOUTS_CLAMP_CONTAINER_QUERIES",
              "errorExplanation": "CSS units (rem, vw) must be included. Output is clamp(1rem, 2.5vw, 2rem).",
              "recoveryPath": {
                "simplerExplanation": "Expression is clamp(1rem, 2.5vw, 2rem).",
                "guidedFixPrompt": "Type clamp(1rem, 2.5vw, 2rem)"
              }
            }
          }
        }
      },
      {
        "id": "design-d19-b2-container-query-keyword",
        "day": 19,
        "blockNumber": 2,
        "title": "The CSS Container Query At-Rule: `@container`",
        "conceptBudget": {
          "primaryConcept": "`@container` At-Rule Invariant",
          "supportingTerms": [
            "`@container` (`Applies conditional styles based on the size of the parent container element rather than the global browser window`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d19-b1-css-clamp-formatter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CSS Container Query Syntax",
            "codeSnippet": ".card-wrapper {\n  container-type: inline-size; /* Establishes query container */\n}\n\n@container (min-width: 400px) {\n  .card { display: flex; flex-direction: row; }\n}",
            "lineNotes": {
              "2": "container-type: inline-size enables container width tracking.",
              "5": "@container at-rule applies styles based on local container."
            }
          },
          {
            "type": "runnable_code",
            "filename": "container_query_demo.js",
            "initialCode": "function getContainerRule() {\n  return '@container';\n}\n\nconsole.log(getContainerRule());",
            "expectedOutput": "@container",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What CSS at-rule evaluates styles against the width of an ancestor container element?",
          "expectedStringOutput": "@container",
          "acceptableAnswers": [
            "@container",
            "'@container'",
            "container query"
          ],
          "primaryMisconceptionId": "MC_DS_FLUID_LAYOUTS_CLAMP_CONTAINER_QUERIES",
          "diagnosisMap": {
            "@media": {
              "misconceptionId": "MC_DS_FLUID_LAYOUTS_CLAMP_CONTAINER_QUERIES",
              "errorExplanation": "@media queries the global viewport. Local container queries use @container.",
              "recoveryPath": {
                "simplerExplanation": "Type @container.",
                "guidedFixPrompt": "Type @container"
              }
            }
          }
        }
      },
      {
        "id": "design-d19-b3-decoupling-component-layouts",
        "day": 19,
        "blockNumber": 3,
        "title": "True Modularity: Decoupling Components from Global Page Layouts",
        "conceptBudget": {
          "primaryConcept": "Container Query Modularity Invariant",
          "supportingTerms": [
            "Container Modularity (`Using '@container' allows a Card component to render in horizontal mode in main content and vertical stacked mode in a narrow sidebar simultaneously`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d19-b2-container-query-keyword",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "container_modularity_demo.js",
            "initialCode": "function getContainerModularityRule() {\n  return 'CONTAINER_QUERIES_DECOUPLE_COMPONENTS_FROM_GLOBAL_VIEWPORT_WIDTH';\n}\n\nconsole.log(getContainerModularityRule());",
            "expectedOutput": "CONTAINER_QUERIES_DECOUPLE_COMPONENTS_FROM_GLOBAL_VIEWPORT_WIDTH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What architectural advantage do Container Queries bring to design system components?",
          "expectedStringOutput": "CONTAINER_QUERIES_DECOUPLE_COMPONENTS_FROM_GLOBAL_VIEWPORT_WIDTH",
          "acceptableAnswers": [
            "CONTAINER_QUERIES_DECOUPLE_COMPONENTS_FROM_GLOBAL_VIEWPORT_WIDTH",
            "Decouple from global viewport",
            "Component modularity"
          ],
          "primaryMisconceptionId": "MC_DS_FLUID_LAYOUTS_CLAMP_CONTAINER_QUERIES",
          "diagnosisMap": {
            "GLOBAL_ONLY": {
              "misconceptionId": "MC_DS_FLUID_LAYOUTS_CLAMP_CONTAINER_QUERIES",
              "errorExplanation": "Standard is: CONTAINER_QUERIES_DECOUPLE_COMPONENTS_FROM_GLOBAL_VIEWPORT_WIDTH.",
              "recoveryPath": {
                "simplerExplanation": "Matches CONTAINER_QUERIES_DECOUPLE_COMPONENTS_FROM_GLOBAL_VIEWPORT_WIDTH.",
                "guidedFixPrompt": "Type CONTAINER_QUERIES_DECOUPLE_COMPONENTS_FROM_GLOBAL_VIEWPORT_WIDTH"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Micro-Interactions, CSS Transitions & Bézier Curves: Spring Physics & Easing",
    "overviewMetaphor": "CSS Transitions Are Physical Spring Dampers: Linear animation (`transition: all 1s linear`) feels robotic like a broken slide projector; applying a Cubic Bézier curve with hardware-accelerated transforms (`transform` & `opacity` in $200\\text{ms}$) mimics natural inertia, decelerating smoothly to a natural rest.",
    "blocks": [
      {
        "id": "design-d20-b1-transition-auditor",
        "day": 20,
        "blockNumber": 1,
        "title": "Micro-Interactions: Auditing Hardware-Accelerated Transforms ($200\\text{ms}$) vs Reflow Properties",
        "conceptBudget": {
          "primaryConcept": "Micro-Interaction Transition Timing & Duration Auditor",
          "supportingTerms": [
            "Animated Property (`'transform'` vs `'width'`)",
            "Duration ($200\\text{ms}$)",
            "Hardware Acceleration (GPU Composited)",
            "Status: Transition Performance Audited Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d19-b1-css-clamp-formatter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CSS Animation Performance Ledger",
              "boxes": [
                {
                  "label": "Hardware Accelerated",
                  "value": "transform, opacity (GPU Composite layer - 60 FPS!)",
                  "varType": "GPU",
                  "isUpdated": false
                },
                {
                  "label": "Layout Reflow (Avoid!)",
                  "value": "width, height, top, left, margin (Causes CPU recalculations)",
                  "varType": "Reflow",
                  "isUpdated": false
                },
                {
                  "label": "Performance Audit",
                  "value": "TRANSITION PERFORMANCE AUDITED NOMINAL (60 FPS VERIFIED!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "transition_audit_demo.js",
            "initialCode": "function auditTransition(prop, dur, easing) {\n  const ok = ['transform', 'opacity'].includes(prop) && dur >= 100 && dur <= 350;\n  return {\n    prop,\n    dur,\n    isOptimized: ok,\n    status: ok ? 'TRANSITION_PERFORMANCE_AUDITED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditTransition('transform', 200, 'ease-out')));\nconsole.log(JSON.stringify(auditTransition('width', 200, 'ease-out')));",
            "expectedOutput": "{\"prop\":\"transform\",\"dur\":200,\"isOptimized\":true,\"status\":\"TRANSITION_PERFORMANCE_AUDITED_NOMINAL\"}\n{\"prop\":\"width\",\"dur\":200,\"isOptimized\":false,\"status\":\"DEFECT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a transition animates performant GPU properties within optimal 100-350ms duration?",
          "expectedStringOutput": "TRANSITION_PERFORMANCE_AUDITED_NOMINAL",
          "acceptableAnswers": [
            "TRANSITION_PERFORMANCE_AUDITED_NOMINAL",
            "status\":\"TRANSITION_PERFORMANCE_AUDITED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_DS_MICRO_INTERACTIONS_BEZIER_TRANSITIONS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DS_MICRO_INTERACTIONS_BEZIER_TRANSITIONS",
              "errorExplanation": "Transform with 200ms duration produces TRANSITION_PERFORMANCE_AUDITED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type TRANSITION_PERFORMANCE_AUDITED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "design-d20-b2-hardware-accelerated-property-name",
        "day": 20,
        "blockNumber": 2,
        "title": "The Hardware-Accelerated CSS Property: `transform`",
        "conceptBudget": {
          "primaryConcept": "`transform` Acceleration Invariant",
          "supportingTerms": [
            "`transform` (`Handled on the GPU compositor thread without triggering document layout recalculation or paint reflows`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d20-b1-transition-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Hardware Accelerated CSS",
            "codeSnippet": "/* ✅ 60 FPS GPU Composite Animation */\n.btn:hover {\n  transform: translateY(-2px);\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n/* ❌ 15 FPS Layout Reflow Defect */\n.btn-slow:hover {\n  top: -2px; /* Triggers browser layout tree reflow on every frame */\n}",
            "lineNotes": {
              "3": "transform: translateY(-2px) is GPU accelerated.",
              "4": "Smooth 150ms cubic-bezier curve.",
              "9": "top: -2px triggers slow CPU reflow."
            }
          },
          {
            "type": "runnable_code",
            "filename": "transform_prop_demo.js",
            "initialCode": "function getGpuProp() {\n  return 'transform';\n}\n\nconsole.log(getGpuProp());",
            "expectedOutput": "transform",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which CSS property enables 60 FPS hardware-accelerated movement without causing browser layout reflows?",
          "expectedStringOutput": "transform",
          "acceptableAnswers": [
            "transform",
            "'transform'",
            "CSS transform"
          ],
          "primaryMisconceptionId": "MC_DS_MICRO_INTERACTIONS_BEZIER_TRANSITIONS",
          "diagnosisMap": {
            "top": {
              "misconceptionId": "MC_DS_MICRO_INTERACTIONS_BEZIER_TRANSITIONS",
              "errorExplanation": "top triggers layout recalculation. Hardware accelerated movement uses transform.",
              "recoveryPath": {
                "simplerExplanation": "Type transform.",
                "guidedFixPrompt": "Type transform"
              }
            }
          }
        }
      },
      {
        "id": "design-d20-b3-standard-easing-bezier-curve",
        "day": 20,
        "blockNumber": 3,
        "title": "Natural Motion: The Standard `cubic-bezier(0.4, 0, 0.2, 1)` Easing Curve",
        "conceptBudget": {
          "primaryConcept": "Standard Easing Invariant",
          "supportingTerms": [
            "Standard Easing (`'cubic-bezier(0.4, 0, 0.2, 1)': The Material/Apple standard easing curve providing natural acceleration and gentle deceleration`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d20-b2-hardware-accelerated-property-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bezier_curve_demo.js",
            "initialCode": "function getEasingStandard() {\n  return 'USE_CUBIC_BEZIER_EASING_FOR_NATURAL_PHYSICAL_DECELERATION';\n}\n\nconsole.log(getEasingStandard());",
            "expectedOutput": "USE_CUBIC_BEZIER_EASING_FOR_NATURAL_PHYSICAL_DECELERATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why should linear transitions be avoided in professional UI micro-interactions?",
          "expectedStringOutput": "USE_CUBIC_BEZIER_EASING_FOR_NATURAL_PHYSICAL_DECELERATION",
          "acceptableAnswers": [
            "USE_CUBIC_BEZIER_EASING_FOR_NATURAL_PHYSICAL_DECELERATION",
            "Use cubic-bezier easing",
            "Natural physical deceleration"
          ],
          "primaryMisconceptionId": "MC_DS_MICRO_INTERACTIONS_BEZIER_TRANSITIONS",
          "diagnosisMap": {
            "LINEAR_IS_FINE": {
              "misconceptionId": "MC_DS_MICRO_INTERACTIONS_BEZIER_TRANSITIONS",
              "errorExplanation": "Linear feels robotic. Standard is: USE_CUBIC_BEZIER_EASING_FOR_NATURAL_PHYSICAL_DECELERATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches USE_CUBIC_BEZIER_EASING_FOR_NATURAL_PHYSICAL_DECELERATION.",
                "guidedFixPrompt": "Type USE_CUBIC_BEZIER_EASING_FOR_NATURAL_PHYSICAL_DECELERATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Flexbox Math, Fluid Grid, Media Query & Micro-Interaction Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete responsive visual frontend and interaction engine: 1. Flexbox item width calculation; 2. CSS Grid auto-fit column calculation; 3. Mobile-first breakpoint classification; 4. CSS clamp expression generation; 5. Hardware-accelerated transition performance auditing.",
    "blocks": [
      {
        "id": "design-d21-b1-visual-frontend-master-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Visual Frontend Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Visual Frontend Master Engine",
          "supportingTerms": [
            "Flexbox Subsystem",
            "CSS Grid Subsystem",
            "Breakpoint Subsystem",
            "Fluid Clamp Subsystem",
            "Micro-Interaction Subsystem"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d20-b3-standard-easing-bezier-curve",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Visual Frontend Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Calculates Flexbox item distributions & auto-fit CSS Grid columns",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Classifies mobile-first breakpoints & formats fluid clamp formulas",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Audits GPU transform transitions & Bézier deceleration physics",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Activates Visual Frontend Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "frontend_kernel_demo.js",
            "initialCode": "function runFrontendMaster() {\n  return {\n    flexboxSubsystem: 'ONLINE_FLEX_MATH_ACTIVE',\n    gridSubsystem: 'ONLINE_AUTO_FIT_ACTIVE',\n    breakpointSubsystem: 'ONLINE_MOBILE_FIRST_ACTIVE',\n    clampSubsystem: 'ONLINE_FLUID_CLAMP_ACTIVE',\n    transitionSubsystem: 'ONLINE_60FPS_GPU_ACTIVE',\n    engineStatus: 'VISUAL_FRONTEND_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runFrontendMaster().engineStatus);",
            "expectedOutput": "VISUAL_FRONTEND_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Visual Frontend Master Engine?",
          "expectedStringOutput": "VISUAL_FRONTEND_MASTER_ACTIVE",
          "acceptableAnswers": [
            "VISUAL_FRONTEND_MASTER_ACTIVE",
            "engineStatus: VISUAL_FRONTEND_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_DS_CSS_FLEXBOX_LAYOUT_MASTERY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DS_CSS_FLEXBOX_LAYOUT_MASTERY",
              "errorExplanation": "Matches VISUAL_FRONTEND_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type VISUAL_FRONTEND_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "design-d21-b2-visual-frontend-engine-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Visual Frontend Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Visual Frontend Invariant Verification",
          "supportingTerms": [
            "Flexbox Invariant",
            "Grid Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d21-b1-visual-frontend-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "frontend_audit_demo.js",
            "initialCode": "function auditFrontend(f, g, b, c, t) {\n  const passed = f && g && b && c && t;\n  return {\n    flexVerified: f,\n    gridVerified: g,\n    breakpointVerified: b,\n    clampVerified: c,\n    transitionVerified: t,\n    grade: passed ? 'VISUAL_FRONTEND_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditFrontend(true, true, true, true, true)));",
            "expectedOutput": "{\"flexVerified\":true,\"gridVerified\":true,\"breakpointVerified\":true,\"clampVerified\":true,\"transitionVerified\":true,\"grade\":\"VISUAL_FRONTEND_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Flexbox, CSS Grid, Breakpoints, Clamp Math, and Transitions pass 100%?",
          "expectedStringOutput": "VISUAL_FRONTEND_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "VISUAL_FRONTEND_ENGINE_AUDIT_PASSED",
            "grade\":\"VISUAL_FRONTEND_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_DS_CSS_FLEXBOX_LAYOUT_MASTERY",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DS_CSS_FLEXBOX_LAYOUT_MASTERY",
              "errorExplanation": "All checks passing awards VISUAL_FRONTEND_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards VISUAL_FRONTEND_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type VISUAL_FRONTEND_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "design-d21-b3-milestone3-design-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Visual Frontend Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Visual Frontend Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d21-b2-visual-frontend-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_design_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete Flexbox Math, Fluid Grid, Media Query & Micro-Interaction Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete Flexbox Math, Fluid Grid, Media Query & Micro-Interaction Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete Flexbox Math, Fluid Grid, Media Query & Micro-Interaction Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete Flexbox Math, Fluid Grid, Media Query & Micro-Interaction Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DS_CSS_FLEXBOX_LAYOUT_MASTERY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DS_CSS_FLEXBOX_LAYOUT_MASTERY",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete Flexbox Math, Fluid Grid, Media Query & Micro-Interaction Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Dark Mode Engineering & Theme Switching: CSS Custom Properties & prefers-color-scheme",
    "overviewMetaphor": "Dark Mode Theming Is a Dual-State Electronic Polarized Lens: Rather than painting every car and building twice, you install polarized windows with CSS Custom Properties (`--bg-primary`); switching themes simply flips the polarization angle (`prefers-color-scheme`), and an inline pre-hydration script prevents blinding white flashes on reload (FOUT Prevention).",
    "blocks": [
      {
        "id": "design-d22-b1-theme-initializer",
        "day": 22,
        "blockNumber": 1,
        "title": "Dark Mode: Resolving Theme Mode with User Preference Priority over System OS",
        "conceptBudget": {
          "primaryConcept": "Theme Mode Initializer & FOUT Prevention Script Formatter",
          "supportingTerms": [
            "Stored User Preference (`'dark'` / `'light'`)",
            "System OS Setting (`true` / `false`)",
            "Resolved Theme Mode (`'dark'`)",
            "Status: Initial Theme Resolved Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d21-b1-visual-frontend-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Theme Mode Resolution Hierarchy Ledger",
              "boxes": [
                {
                  "label": "1. Explicit User Stored",
                  "value": "localStorage.getItem('theme') = 'dark' (HIGHEST PRIORITY!)",
                  "varType": "User Pref",
                  "isUpdated": false
                },
                {
                  "label": "2. System OS Fallback",
                  "value": "matchMedia('(prefers-color-scheme: dark)').matches",
                  "varType": "OS Fallback",
                  "isUpdated": false
                },
                {
                  "label": "Resolved Theme Mode",
                  "value": "'dark' applied to document.documentElement (RESOLVED NOMINAL!)",
                  "varType": "Resolved",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "theme_resolver_demo.js",
            "initialCode": "function resolveTheme(stored, sysDark) {\n  let active = 'light';\n  if (stored === 'dark' || (stored === null && sysDark)) active = 'dark';\n  return {\n    storedUserPref: stored,\n    systemDark: sysDark,\n    resolvedThemeMode: active,\n    status: 'INITIAL_THEME_RESOLVED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(resolveTheme('dark', false)));\nconsole.log(JSON.stringify(resolveTheme(null, true)));\nconsole.log(JSON.stringify(resolveTheme('light', true)));",
            "expectedOutput": "{\"storedUserPref\":\"dark\",\"systemDark\":false,\"resolvedThemeMode\":\"dark\",\"status\":\"INITIAL_THEME_RESOLVED_NOMINAL\"}\n{\"storedUserPref\":null,\"systemDark\":true,\"resolvedThemeMode\":\"dark\",\"status\":\"INITIAL_THEME_RESOLVED_NOMINAL\"}\n{\"storedUserPref\":\"light\",\"systemDark\":true,\"resolvedThemeMode\":\"light\",\"status\":\"INITIAL_THEME_RESOLVED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What theme mode is resolved when no user preference is stored and the system OS prefers dark mode?",
          "expectedStringOutput": "dark",
          "acceptableAnswers": [
            "dark",
            "resolvedThemeMode\":\"dark\"",
            "'dark'"
          ],
          "primaryMisconceptionId": "MC_DS_DARK_MODE_THEME_SWITCHING",
          "diagnosisMap": {
            "light": {
              "misconceptionId": "MC_DS_DARK_MODE_THEME_SWITCHING",
              "errorExplanation": "When stored is null and systemDark is true, the resolved theme is dark.",
              "recoveryPath": {
                "simplerExplanation": "Theme is dark.",
                "guidedFixPrompt": "Type dark"
              }
            }
          }
        }
      },
      {
        "id": "design-d22-b2-prefers-color-scheme-query",
        "day": 22,
        "blockNumber": 2,
        "title": "The System Color Scheme Media Query: `prefers-color-scheme`",
        "conceptBudget": {
          "primaryConcept": "`prefers-color-scheme` Invariant",
          "supportingTerms": [
            "`prefers-color-scheme` (`The CSS media query feature used to detect if the user has requested light or dark color themes in their operating system`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d22-b1-theme-initializer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "System Color Scheme CSS",
            "codeSnippet": ":root {\n  --bg-primary: #ffffff;\n  --text-primary: #0f172a;\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --bg-primary: #0f172a;\n    --text-primary: #f8fafc;\n  }\n}",
            "lineNotes": {
              "1": "Light theme default tokens.",
              "6": "@media (prefers-color-scheme: dark) swaps tokens for dark OS users."
            }
          },
          {
            "type": "runnable_code",
            "filename": "color_scheme_demo.js",
            "initialCode": "function getColorSchemeQuery() {\n  return 'prefers-color-scheme';\n}\n\nconsole.log(getColorSchemeQuery());",
            "expectedOutput": "prefers-color-scheme",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What CSS media query feature detects the operating system's light or dark theme setting?",
          "expectedStringOutput": "prefers-color-scheme",
          "acceptableAnswers": [
            "prefers-color-scheme",
            "'prefers-color-scheme'"
          ],
          "primaryMisconceptionId": "MC_DS_DARK_MODE_THEME_SWITCHING",
          "diagnosisMap": {
            "color-mode": {
              "misconceptionId": "MC_DS_DARK_MODE_THEME_SWITCHING",
              "errorExplanation": "The CSS specification name is prefers-color-scheme.",
              "recoveryPath": {
                "simplerExplanation": "Type prefers-color-scheme.",
                "guidedFixPrompt": "Type prefers-color-scheme"
              }
            }
          }
        }
      },
      {
        "id": "design-d22-b3-fout-prevention-inline-script",
        "day": 22,
        "blockNumber": 3,
        "title": "Zero White Flashes: Preventing Flash of Unstyled Theme (FOUT)",
        "conceptBudget": {
          "primaryConcept": "FOUT Prevention Invariant",
          "supportingTerms": [
            "FOUT Prevention (`Executing a synchronous blocking inline script inside <head> before DOM rendering to set 'data-theme' immediately prevents blinding white flashes`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d22-b2-prefers-color-scheme-query",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "fout_rule_demo.js",
            "initialCode": "function getFoutRule() {\n  return 'EXECUTE_BLOCKING_INLINE_SCRIPT_IN_HEAD_TO_PREVENT_FLASH_OF_UNSTYLED_THEME';\n}\n\nconsole.log(getFoutRule());",
            "expectedOutput": "EXECUTE_BLOCKING_INLINE_SCRIPT_IN_HEAD_TO_PREVENT_FLASH_OF_UNSTYLED_THEME",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do production web applications eliminate the Flash of Unstyled Theme (FOUT) on page reload?",
          "expectedStringOutput": "EXECUTE_BLOCKING_INLINE_SCRIPT_IN_HEAD_TO_PREVENT_FLASH_OF_UNSTYLED_THEME",
          "acceptableAnswers": [
            "EXECUTE_BLOCKING_INLINE_SCRIPT_IN_HEAD_TO_PREVENT_FLASH_OF_UNSTYLED_THEME",
            "Blocking inline script in head",
            "Prevent flash of unstyled theme"
          ],
          "primaryMisconceptionId": "MC_DS_DARK_MODE_THEME_SWITCHING",
          "diagnosisMap": {
            "USE_EFFECT_ONLY": {
              "misconceptionId": "MC_DS_DARK_MODE_THEME_SWITCHING",
              "errorExplanation": "useEffect runs after render, causing white flash. Standard is: EXECUTE_BLOCKING_INLINE_SCRIPT_IN_HEAD_TO_PREVENT_FLASH_OF_UNSTYLED_THEME.",
              "recoveryPath": {
                "simplerExplanation": "Matches EXECUTE_BLOCKING_INLINE_SCRIPT_IN_HEAD_TO_PREVENT_FLASH_OF_UNSTYLED_THEME.",
                "guidedFixPrompt": "Type EXECUTE_BLOCKING_INLINE_SCRIPT_IN_HEAD_TO_PREVENT_FLASH_OF_UNSTYLED_THEME"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Accessibility Standards & WCAG 2.2 AA/AAA Contrast Math",
    "overviewMetaphor": "WCAG Color Contrast Is a Clear Roadway Highway Sign in Fog: If white text on light gray has only a $1.28:1$ contrast ratio, a driver in heavy fog (low vision user in bright sunlight) cannot read the exit sign and crashes; calculating relative luminance to ensure a $4.5:1$ ratio (AA) or $7:1$ (AAA) guarantees readability for all.",
    "blocks": [
      {
        "id": "design-d23-b1-wcag-contrast-calculator",
        "day": 23,
        "blockNumber": 1,
        "title": "WCAG Math: Calculating Contrast Ratio $\\frac{L_{\\max} + 0.05}{L_{\\min} + 0.05}$ ($21:1$ AA/AAA Passing)",
        "conceptBudget": {
          "primaryConcept": "WCAG 2.2 Color Contrast Ratio Calculator & Compliance Evaluator",
          "supportingTerms": [
            "Relative Luminance ($L_{\\max} = 1.0, L_{\\min} = 0.0$)",
            "Contrast Ratio ($21:1$)",
            "WCAG AA Standard ($4.5:1$)",
            "WCAG AAA Standard ($7:1$)",
            "Status: WCAG Contrast Compliant Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d22-b1-theme-initializer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "WCAG 2.2 Contrast Ratio Mathematical Ledger",
              "boxes": [
                {
                  "label": "Luminance Formula",
                  "value": "Ratio = (L_max + 0.05) / (L_min + 0.05)",
                  "varType": "Formula",
                  "isUpdated": false
                },
                {
                  "label": "Pure White on Black",
                  "value": "(1.0 + 0.05) / (0.0 + 0.05) = 1.05 / 0.05 = 21.0 : 1",
                  "varType": "Math",
                  "isUpdated": false
                },
                {
                  "label": "Compliance Status",
                  "value": "Passes AA (>=4.5) & Passes AAA (>=7.0) (COMPLIANT NOMINAL!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "wcag_calc_demo.js",
            "initialCode": "function evalWcag(l1, l2) {\n  const max = Math.max(l1, l2);\n  const min = Math.min(l1, l2);\n  const ratio = Number(((max + 0.05) / (min + 0.05)).toFixed(2));\n  const isAa = ratio >= 4.5;\n  const isAaa = ratio >= 7.0;\n  return {\n    contrastRatio: ratio,\n    isWcagAaCompliant: isAa,\n    isWcagAaaCompliant: isAaa,\n    status: isAa ? 'WCAG_CONTRAST_COMPLIANT_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(evalWcag(1.0, 0.0)));\nconsole.log(JSON.stringify(evalWcag(0.4, 0.3)));",
            "expectedOutput": "{\"contrastRatio\":21,\"isWcagAaCompliant\":true,\"isWcagAaaCompliant\":true,\"status\":\"WCAG_CONTRAST_COMPLIANT_NOMINAL\"}\n{\"contrastRatio\":1.29,\"isWcagAaCompliant\":false,\"isWcagAaaCompliant\":false,\"status\":\"DEFECT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the mathematical contrast ratio between pure white (L=1.0) and pure black (L=0.0)?",
          "expectedStringOutput": "21",
          "acceptableAnswers": [
            "21",
            "contrastRatio\":21",
            "21:1",
            "21 to 1"
          ],
          "primaryMisconceptionId": "MC_DS_ACCESSIBILITY_WCAG_CONTRAST_MATH",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_DS_ACCESSIBILITY_WCAG_CONTRAST_MATH",
              "errorExplanation": "(1.0 + 0.05) / (0.0 + 0.05) = 1.05 / 0.05 = 21.",
              "recoveryPath": {
                "simplerExplanation": "Ratio is 21.",
                "guidedFixPrompt": "Type 21"
              }
            }
          }
        }
      },
      {
        "id": "design-d23-b2-wcag-aa-normal-text-threshold",
        "day": 23,
        "blockNumber": 2,
        "title": "The WCAG Level AA Normal Text Contrast Threshold: $4.5:1$",
        "conceptBudget": {
          "primaryConcept": "WCAG AA Threshold Invariant",
          "supportingTerms": [
            "$4.5:1$ Threshold (`The minimum mathematical color contrast ratio required by WCAG 2.2 Level AA for body text under 18pt / 24px`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d23-b1-wcag-contrast-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "WCAG Contrast Ratios Matrix",
            "codeSnippet": "// 1. WCAG AA Normal Text (<18pt):   4.5 : 1 (MANDATORY LEGAL MINIMUM!)\n// 2. WCAG AA Large Text (>=18pt):    3.0 : 1\n// 3. WCAG AA UI Components & Icons:  3.0 : 1\n// 4. WCAG AAA Normal Text:           7.0 : 1 (Enhanced accessibility standard)",
            "lineNotes": {
              "1": "AA Normal text: 4.5:1.",
              "2": "AA Large text: 3.0:1.",
              "3": "AA UI elements: 3.0:1.",
              "4": "AAA Normal text: 7.0:1."
            }
          },
          {
            "type": "runnable_code",
            "filename": "wcag_threshold_demo.js",
            "initialCode": "function getWcagAaThreshold() {\n  return 4.5;\n}\n\nconsole.log(getWcagAaThreshold());",
            "expectedOutput": "4.5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What minimum contrast ratio is legally required for normal body text under WCAG 2.2 Level AA?",
          "expectedStringOutput": "4.5",
          "acceptableAnswers": [
            "4.5",
            "4.5:1",
            "4.5 to 1"
          ],
          "primaryMisconceptionId": "MC_DS_ACCESSIBILITY_WCAG_CONTRAST_MATH",
          "diagnosisMap": {
            "3.0": {
              "misconceptionId": "MC_DS_ACCESSIBILITY_WCAG_CONTRAST_MATH",
              "errorExplanation": "3.0:1 is for large display headings. Normal body text requires 4.5:1.",
              "recoveryPath": {
                "simplerExplanation": "Type 4.5.",
                "guidedFixPrompt": "Type 4.5"
              }
            }
          }
        }
      },
      {
        "id": "design-d23-b3-never-rely-on-color-alone",
        "day": 23,
        "blockNumber": 3,
        "title": "Accessibility Invariant: Never Relying Exclusively on Color to Convey Meaning",
        "conceptBudget": {
          "primaryConcept": "Multi-Modal Feedback Invariant",
          "supportingTerms": [
            "Multi-Modal Feedback (`Always accompanying red error colors with distinct icon shapes and explicit text so color-blind users can instantly distinguish states`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d23-b2-wcag-aa-normal-text-threshold",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "color_alone_rule_demo.js",
            "initialCode": "function getColorAloneRule() {\n  return 'NEVER_USE_COLOR_AS_THE_SOLE_INDICATOR_OF_SYSTEM_STATE_OR_INFORMATION';\n}\n\nconsole.log(getColorAloneRule());",
            "expectedOutput": "NEVER_USE_COLOR_AS_THE_SOLE_INDICATOR_OF_SYSTEM_STATE_OR_INFORMATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core accessibility rule protects users with red-green color blindness?",
          "expectedStringOutput": "NEVER_USE_COLOR_AS_THE_SOLE_INDICATOR_OF_SYSTEM_STATE_OR_INFORMATION",
          "acceptableAnswers": [
            "NEVER_USE_COLOR_AS_THE_SOLE_INDICATOR_OF_SYSTEM_STATE_OR_INFORMATION",
            "Never use color alone",
            "Never rely on color as sole indicator"
          ],
          "primaryMisconceptionId": "MC_DS_ACCESSIBILITY_WCAG_CONTRAST_MATH",
          "diagnosisMap": {
            "COLOR_IS_ENOUGH": {
              "misconceptionId": "MC_DS_ACCESSIBILITY_WCAG_CONTRAST_MATH",
              "errorExplanation": "Color-blind users cannot see red vs green. Rule is: NEVER_USE_COLOR_AS_THE_SOLE_INDICATOR_OF_SYSTEM_STATE_OR_INFORMATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches NEVER_USE_COLOR_AS_THE_SOLE_INDICATOR_OF_SYSTEM_STATE_OR_INFORMATION.",
                "guidedFixPrompt": "Type NEVER_USE_COLOR_AS_THE_SOLE_INDICATOR_OF_SYSTEM_STATE_OR_INFORMATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Keyboard Navigation & Focus Management: Roving tabindex & Focus Rings",
    "overviewMetaphor": "The Roving Tabindex Pattern Is a Carousel of Slides: The Tab key enters the carousel widget as a single stop; inside the carousel, Left/Right arrow keys rotate through the individual slides with circular wrapping ($3 \\to 0$), and pressing Tab again exits smoothly to the next page section.",
    "blocks": [
      {
        "id": "design-d24-b1-roving-tabindex-resolver",
        "day": 24,
        "blockNumber": 1,
        "title": "Keyboard Navigation: Resolving Roving Tabindex Arrow Navigation ($2 \\to 3$) & Wrapping ($3 \\to 0$)",
        "conceptBudget": {
          "primaryConcept": "Roving Tabindex Active Key Index Resolver",
          "supportingTerms": [
            "Current Index ($2$)",
            "Total Items ($4$ items)",
            "ArrowRight Key Press",
            "New Active Index ($3$ & $0$ wrapping)",
            "Status: Roving Tabindex Resolved Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d23-b1-wcag-contrast-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Roving Tabindex State Machine Ledger",
              "boxes": [
                {
                  "label": "Tab 1 (Index 0)",
                  "value": "tabindex='-1' (Programmatic focus only)",
                  "varType": "Tab 0",
                  "isUpdated": false
                },
                {
                  "label": "Tab 2 (Index 1)",
                  "value": "tabindex='-1' (Programmatic focus only)",
                  "varType": "Tab 1",
                  "isUpdated": false
                },
                {
                  "label": "Tab 3 (Index 2 -> 3)",
                  "value": "ArrowRight pressed -> tabindex='0' on Index 3 (RESOLVED NOMINAL!)",
                  "varType": "Active Tab",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "roving_tab_demo.js",
            "initialCode": "function resolveRoving(curr, total, key) {\n  let next = curr;\n  if (key === 'ArrowRight') next = (curr + 1) % total;\n  else if (key === 'ArrowLeft') next = (curr - 1 + total) % total;\n  return {\n    newActiveIndex: next,\n    status: 'ROVING_TABINDEX_RESOLVED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(resolveRoving(2, 4, 'ArrowRight')));\nconsole.log(JSON.stringify(resolveRoving(3, 4, 'ArrowRight')));",
            "expectedOutput": "{\"newActiveIndex\":3,\"status\":\"ROVING_TABINDEX_RESOLVED_NOMINAL\"}\n{\"newActiveIndex\":0,\"status\":\"ROVING_TABINDEX_RESOLVED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the new active index when ArrowRight is pressed on the final item (index 3) of a 4-item tablist?",
          "expectedStringOutput": "0",
          "acceptableAnswers": [
            "0",
            "newActiveIndex\":0",
            "index 0",
            "zero"
          ],
          "primaryMisconceptionId": "MC_DS_KEYBOARD_NAVIGATION_FOCUS_MANAGEMENT",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_DS_KEYBOARD_NAVIGATION_FOCUS_MANAGEMENT",
              "errorExplanation": "Index wraps circularly: (3 + 1) % 4 = 0.",
              "recoveryPath": {
                "simplerExplanation": "Index is 0.",
                "guidedFixPrompt": "Type 0"
              }
            }
          }
        }
      },
      {
        "id": "design-d24-b2-programmatic-focus-tabindex-value",
        "day": 24,
        "blockNumber": 2,
        "title": "The Programmatic-Only Focus Attribute: `tabindex=\"-1\"`",
        "conceptBudget": {
          "primaryConcept": "`tabindex=\"-1\"` Invariant",
          "supportingTerms": [
            "`tabindex=\"-1\"` (`Removes an element from the natural keyboard Tab order while allowing it to receive programmatic focus via JavaScript element.focus()`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d24-b1-roving-tabindex-resolver",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Tabindex Values Hierarchy",
            "codeSnippet": "// 1. tabindex=\"0\":   Enters natural keyboard Tab order\n// 2. tabindex=\"-1\":  Removed from Tab order, but programmatically focusable!\n// 3. tabindex=\"1+\":  ANTIPATTERN! Disrupts natural document DOM focus sequence",
            "lineNotes": {
              "1": "0 = Natural tab sequence.",
              "2": "-1 = Programmatic focus only.",
              "3": "Positive numbers are anti-patterns."
            }
          },
          {
            "type": "runnable_code",
            "filename": "tabindex_minus1_demo.js",
            "initialCode": "function getProgrammaticTabindex() {\n  return -1;\n}\n\nconsole.log(getProgrammaticTabindex());",
            "expectedOutput": "-1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What tabindex value makes an element focusable via JavaScript element.focus() without placing it in the sequential Tab order?",
          "expectedStringOutput": "-1",
          "acceptableAnswers": [
            "-1",
            "'-1'",
            "-1 value"
          ],
          "primaryMisconceptionId": "MC_DS_KEYBOARD_NAVIGATION_FOCUS_MANAGEMENT",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_DS_KEYBOARD_NAVIGATION_FOCUS_MANAGEMENT",
              "errorExplanation": "0 places element in the natural Tab order. Programmatic-only uses -1.",
              "recoveryPath": {
                "simplerExplanation": "Type -1.",
                "guidedFixPrompt": "Type -1"
              }
            }
          }
        }
      },
      {
        "id": "design-d24-b3-never-suppress-focus-rings-globally",
        "day": 24,
        "blockNumber": 3,
        "title": "Accessibility Invariant: Banning `outline: none` without Focus Ring Replacement",
        "conceptBudget": {
          "primaryConcept": "Focus Ring Retention Invariant",
          "supportingTerms": [
            "Focus Ring Retention (`Writing '* { outline: none; }' completely destroys keyboard accessibility, leaving motor-impaired and blind users unable to navigate`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d24-b2-programmatic-focus-tabindex-value",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "focus_ring_rule_demo.js",
            "initialCode": "function getFocusRingRule() {\n  return 'NEVER_REMOVE_OUTLINE_NONE_WITHOUT_PROVIDING_AN_ACCESSIBLE_FOCUS_VISIBLE_RING';\n}\n\nconsole.log(getFocusRingRule());",
            "expectedOutput": "NEVER_REMOVE_OUTLINE_NONE_WITHOUT_PROVIDING_AN_ACCESSIBLE_FOCUS_VISIBLE_RING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What critical rule prohibits the reckless suppression of browser focus rings?",
          "expectedStringOutput": "NEVER_REMOVE_OUTLINE_NONE_WITHOUT_PROVIDING_AN_ACCESSIBLE_FOCUS_VISIBLE_RING",
          "acceptableAnswers": [
            "NEVER_REMOVE_OUTLINE_NONE_WITHOUT_PROVIDING_AN_ACCESSIBLE_FOCUS_VISIBLE_RING",
            "Never remove outline none without replacement",
            "Preserve focus-visible ring"
          ],
          "primaryMisconceptionId": "MC_DS_KEYBOARD_NAVIGATION_FOCUS_MANAGEMENT",
          "diagnosisMap": {
            "OUTLINE_NONE_OK": {
              "misconceptionId": "MC_DS_KEYBOARD_NAVIGATION_FOCUS_MANAGEMENT",
              "errorExplanation": "Removing outlines breaks keyboard usability. Rule is: NEVER_REMOVE_OUTLINE_NONE_WITHOUT_PROVIDING_AN_ACCESSIBLE_FOCUS_VISIBLE_RING.",
              "recoveryPath": {
                "simplerExplanation": "Matches NEVER_REMOVE_OUTLINE_NONE_WITHOUT_PROVIDING_AN_ACCESSIBLE_FOCUS_VISIBLE_RING.",
                "guidedFixPrompt": "Type NEVER_REMOVE_OUTLINE_NONE_WITHOUT_PROVIDING_AN_ACCESSIBLE_FOCUS_VISIBLE_RING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Screen Reader Optimization & ARIA Attributes: aria-label & aria-hidden",
    "overviewMetaphor": "ARIA Optimization Is Writing a Closed-Caption Audio Track for a Movie: Sighted users see a magnifying glass icon and understand it means 'Search'; for a blind screen reader user, hiding the raw SVG markup (`aria-hidden=\"true\"`) and speaking a clean label (`aria-label=\"Search projects\"`) provides equal auditory clarity.",
    "blocks": [
      {
        "id": "design-d25-b1-icon-button-aria-auditor",
        "day": 25,
        "blockNumber": 1,
        "title": "Screen Reader UX: Auditing `aria-label` Name & `aria-hidden=\"true\"` on Decorative Icons",
        "conceptBudget": {
          "primaryConcept": "Icon Button Accessible Name & ARIA Auditor",
          "supportingTerms": [
            "Accessible Name Present (`true`)",
            "Icon Decoratively Hidden (`true`)",
            "Status: Icon Button Accessibility Verified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d24-b1-roving-tabindex-resolver",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Accessible Icon Button Architecture Ledger",
              "boxes": [
                {
                  "label": "<button>",
                  "value": "aria-label='Close dialog' (Explicit accessible name computed)",
                  "varType": "Button",
                  "isUpdated": false
                },
                {
                  "label": "<svg>",
                  "value": "aria-hidden='true' focusable='false' (Suppresses raw vector noise)",
                  "varType": "SVG Icon",
                  "isUpdated": false
                },
                {
                  "label": "Screen Reader Output",
                  "value": "'Close dialog, button' (ACCESSIBILITY VERIFIED NOMINAL!)",
                  "varType": "Speech",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "icon_btn_demo.js",
            "initialCode": "function auditIconBtn(hasLabel, hasText, isHidden) {\n  const name = hasLabel || hasText;\n  const ok = name && isHidden;\n  return {\n    hasAccessibleName: name,\n    isIconHidden: isHidden,\n    status: ok ? 'ICON_BUTTON_ACCESSIBILITY_VERIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditIconBtn(true, false, true)));",
            "expectedOutput": "{\"hasAccessibleName\":true,\"isIconHidden\":true,\"status\":\"ICON_BUTTON_ACCESSIBILITY_VERIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that an icon-only button provides a valid accessible name while suppressing vector icon noise?",
          "expectedStringOutput": "ICON_BUTTON_ACCESSIBILITY_VERIFIED_NOMINAL",
          "acceptableAnswers": [
            "ICON_BUTTON_ACCESSIBILITY_VERIFIED_NOMINAL",
            "status\":\"ICON_BUTTON_ACCESSIBILITY_VERIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_DS_SCREEN_READER_OPTIMIZATION_ARIA",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DS_SCREEN_READER_OPTIMIZATION_ARIA",
              "errorExplanation": "Matches ICON_BUTTON_ACCESSIBILITY_VERIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type ICON_BUTTON_ACCESSIBILITY_VERIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "design-d25-b2-aria-hidden-true-attribute",
        "day": 25,
        "blockNumber": 2,
        "title": "The Decorative Suppression Attribute: `aria-hidden=\"true\"`",
        "conceptBudget": {
          "primaryConcept": "`aria-hidden=\"true\"` Invariant",
          "supportingTerms": [
            "`aria-hidden=\"true\"` (`Hides purely visual decorative icons, illustrations, and dividers from the accessibility tree`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d25-b1-icon-button-aria-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Accessible Icon Button HTML",
            "codeSnippet": "<button type=\"button\" aria-label=\"Search catalog\">\n  <svg aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 24 24\">\n    <path d=\"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z\" />\n  </svg>\n</button>",
            "lineNotes": {
              "1": "aria-label supplies accessible button name.",
              "2": "aria-hidden='true' prevents screen reader from announcing vector path data."
            }
          },
          {
            "type": "runnable_code",
            "filename": "aria_hidden_demo.js",
            "initialCode": "function getAriaHiddenAttribute() {\n  return 'aria-hidden=\"true\"';\n}\n\nconsole.log(getAriaHiddenAttribute());",
            "expectedOutput": "aria-hidden=\"true\"",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What ARIA attribute and value hides visual SVG decorative icons from screen reader traversal?",
          "expectedStringOutput": "aria-hidden=\"true\"",
          "acceptableAnswers": [
            "aria-hidden=\"true\"",
            "aria-hidden='true'",
            "aria-hidden"
          ],
          "primaryMisconceptionId": "MC_DS_SCREEN_READER_OPTIMIZATION_ARIA",
          "diagnosisMap": {
            "display: none": {
              "misconceptionId": "MC_DS_SCREEN_READER_OPTIMIZATION_ARIA",
              "errorExplanation": "display: none hides visually for all users. Hiding for screen readers only uses aria-hidden='true'.",
              "recoveryPath": {
                "simplerExplanation": "Type aria-hidden=\"true\".",
                "guidedFixPrompt": "Type aria-hidden=\"true\""
              }
            }
          }
        }
      },
      {
        "id": "design-d25-b3-first-rule-of-aria",
        "day": 25,
        "blockNumber": 3,
        "title": "The First Rule of ARIA: Use Native Semantic HTML Whenever Possible",
        "conceptBudget": {
          "primaryConcept": "Semantic HTML Invariant",
          "supportingTerms": [
            "First Rule of ARIA (`If you can use a native HTML element (e.g. <button>, <nav>, <dialog>) instead of re-purposing a <div> with ARIA, DO SO`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d25-b2-aria-hidden-true-attribute",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "first_rule_aria_demo.js",
            "initialCode": "function getFirstRuleOfAria() {\n  return 'PREFER_NATIVE_SEMANTIC_HTML_ELEMENTS_OVER_CUSTOM_ARIA_ON_DIVS';\n}\n\nconsole.log(getFirstRuleOfAria());",
            "expectedOutput": "PREFER_NATIVE_SEMANTIC_HTML_ELEMENTS_OVER_CUSTOM_ARIA_ON_DIVS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the foundational 'First Rule of ARIA' according to the W3C specification?",
          "expectedStringOutput": "PREFER_NATIVE_SEMANTIC_HTML_ELEMENTS_OVER_CUSTOM_ARIA_ON_DIVS",
          "acceptableAnswers": [
            "PREFER_NATIVE_SEMANTIC_HTML_ELEMENTS_OVER_CUSTOM_ARIA_ON_DIVS",
            "Prefer native semantic HTML",
            "First rule of ARIA"
          ],
          "primaryMisconceptionId": "MC_DS_SCREEN_READER_OPTIMIZATION_ARIA",
          "diagnosisMap": {
            "USE_ARIA_EVERYWHERE": {
              "misconceptionId": "MC_DS_SCREEN_READER_OPTIMIZATION_ARIA",
              "errorExplanation": "Standard is: PREFER_NATIVE_SEMANTIC_HTML_ELEMENTS_OVER_CUSTOM_ARIA_ON_DIVS.",
              "recoveryPath": {
                "simplerExplanation": "Matches PREFER_NATIVE_SEMANTIC_HTML_ELEMENTS_OVER_CUSTOM_ARIA_ON_DIVS.",
                "guidedFixPrompt": "Type PREFER_NATIVE_SEMANTIC_HTML_ELEMENTS_OVER_CUSTOM_ARIA_ON_DIVS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Iconography Systems & SVG Sprite Architecture: viewBox & currentColor",
    "overviewMetaphor": "Design System SVG Icons Are High-Precision Stamp Dies: Every stamp is manufactured on an identical normalized $24\\times24$ millimeter die block (`viewBox=\"0 0 24 24\"`); when pressed into paper, the stamp automatically adopts whatever ink color the pen contains (`currentColor`), scaling infinitely from business card to billboard without pixel blur.",
    "blocks": [
      {
        "id": "design-d26-b1-svg-icon-auditor",
        "day": 26,
        "blockNumber": 1,
        "title": "Iconography: Auditing Normalized `viewBox=\"0 0 24 24\"` & `currentColor` Inheritance",
        "conceptBudget": {
          "primaryConcept": "SVG Icon viewBox & Color Inheritance Auditor",
          "supportingTerms": [
            "Normalized Grid (`'0 0 24 24'`)",
            "Color Property (`'currentColor'`)",
            "Status: SVG Icon Standard Verified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d25-b1-icon-button-aria-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Normalized SVG Icon System Ledger",
              "boxes": [
                {
                  "label": "viewBox Coordinate Space",
                  "value": "0 0 24 24 (Standard 24px baseline bounding box)",
                  "varType": "viewBox",
                  "isUpdated": false
                },
                {
                  "label": "Fill / Stroke Color",
                  "value": "fill='currentColor' (Inherits CSS color dynamically)",
                  "varType": "Color",
                  "isUpdated": false
                },
                {
                  "label": "Standardization Audit",
                  "value": "SVG ICON STANDARD VERIFIED NOMINAL (SCALABLE & THEMED!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "svg_icon_demo.js",
            "initialCode": "function auditSvg(viewBox, colorProp) {\n  const ok = viewBox === '0 0 24 24' && colorProp === 'currentColor';\n  return {\n    viewBox,\n    colorProp,\n    isStandard: ok,\n    status: ok ? 'SVG_ICON_STANDARD_VERIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditSvg('0 0 24 24', 'currentColor')));",
            "expectedOutput": "{\"viewBox\":\"0 0 24 24\",\"colorProp\":\"currentColor\",\"isStandard\":true,\"status\":\"SVG_ICON_STANDARD_VERIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that an SVG icon adheres to the 24px viewBox and currentColor standards?",
          "expectedStringOutput": "SVG_ICON_STANDARD_VERIFIED_NOMINAL",
          "acceptableAnswers": [
            "SVG_ICON_STANDARD_VERIFIED_NOMINAL",
            "status\":\"SVG_ICON_STANDARD_VERIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_DS_ICONOGRAPHY_SYSTEMS_SVG_SPRITES",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DS_ICONOGRAPHY_SYSTEMS_SVG_SPRITES",
              "errorExplanation": "Matches SVG_ICON_STANDARD_VERIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type SVG_ICON_STANDARD_VERIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "design-d26-b2-currentcolor-keyword",
        "day": 26,
        "blockNumber": 2,
        "title": "The CSS Color Inheritance Keyword: `currentColor`",
        "conceptBudget": {
          "primaryConcept": "`currentColor` Invariant",
          "supportingTerms": [
            "`currentColor` (`The CSS keyword representing the calculated value of the element's 'color' property, enabling SVG icons to inherit button and text colors automatically`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d26-b1-svg-icon-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "currentColor Dynamic Color Inheritance",
            "codeSnippet": "/* Button sets text color */\n.btn-danger { color: #ef4444; }\n\n/* SVG inherits button's text color automatically! */\n.btn-danger svg { fill: currentColor; }",
            "lineNotes": {
              "2": "Parent sets color: #ef4444.",
              "5": "fill: currentColor resolves to #ef4444 dynamically."
            }
          },
          {
            "type": "runnable_code",
            "filename": "current_color_demo.js",
            "initialCode": "function getCurrentColorKeyword() {\n  return 'currentColor';\n}\n\nconsole.log(getCurrentColorKeyword());",
            "expectedOutput": "currentColor",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What CSS keyword allows SVG icons to automatically inherit their parent container's text color?",
          "expectedStringOutput": "currentColor",
          "acceptableAnswers": [
            "currentColor",
            "'currentColor'",
            "currentcolor"
          ],
          "primaryMisconceptionId": "MC_DS_ICONOGRAPHY_SYSTEMS_SVG_SPRITES",
          "diagnosisMap": {
            "inherit": {
              "misconceptionId": "MC_DS_ICONOGRAPHY_SYSTEMS_SVG_SPRITES",
              "errorExplanation": "inherit inherits property values. The special CSS color keyword is currentColor.",
              "recoveryPath": {
                "simplerExplanation": "Type currentColor.",
                "guidedFixPrompt": "Type currentColor"
              }
            }
          }
        }
      },
      {
        "id": "design-d26-b3-svg-sprite-optimization",
        "day": 26,
        "blockNumber": 3,
        "title": "Performance Optimization: SVG Sprite Sheets with `<use href=\"#icon-id\">`",
        "conceptBudget": {
          "primaryConcept": "SVG Sprite Invariant",
          "supportingTerms": [
            "SVG Sprites (`Bundling icons into a single SVG sprite sheet eliminates duplicate DOM nodes across hundreds of repeated list items`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d26-b2-currentcolor-keyword",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "svg_sprite_demo.js",
            "initialCode": "function getSvgSpriteRule() {\n  return 'BUNDLE_REPEATED_ICONS_INTO_SVG_SPRITES_WITH_USE_HREF_OPTIMIZATION';\n}\n\nconsole.log(getSvgSpriteRule());",
            "expectedOutput": "BUNDLE_REPEATED_ICONS_INTO_SVG_SPRITES_WITH_USE_HREF_OPTIMIZATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What technique optimizes DOM rendering when displaying hundreds of identical icons in large lists?",
          "expectedStringOutput": "BUNDLE_REPEATED_ICONS_INTO_SVG_SPRITES_WITH_USE_HREF_OPTIMIZATION",
          "acceptableAnswers": [
            "BUNDLE_REPEATED_ICONS_INTO_SVG_SPRITES_WITH_USE_HREF_OPTIMIZATION",
            "SVG sprites with use href",
            "SVG sprite sheet optimization"
          ],
          "primaryMisconceptionId": "MC_DS_ICONOGRAPHY_SYSTEMS_SVG_SPRITES",
          "diagnosisMap": {
            "INLINE_ALL": {
              "misconceptionId": "MC_DS_ICONOGRAPHY_SYSTEMS_SVG_SPRITES",
              "errorExplanation": "Inlining duplicated SVG bloats the DOM. Standard is: BUNDLE_REPEATED_ICONS_INTO_SVG_SPRITES_WITH_USE_HREF_OPTIMIZATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches BUNDLE_REPEATED_ICONS_INTO_SVG_SPRITES_WITH_USE_HREF_OPTIMIZATION.",
                "guidedFixPrompt": "Type BUNDLE_REPEATED_ICONS_INTO_SVG_SPRITES_WITH_USE_HREF_OPTIMIZATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Motion Design Principles & Reduced Motion: prefers-reduced-motion",
    "overviewMetaphor": "Reduced Motion Support Is an Elevator Next to an Amusement Park Roller Coaster: Fast swooping 3D spins and camera zooms cause severe vertigo and nausea for users with vestibular inner-ear balance disorders; respecting `@media (prefers-reduced-motion: reduce)` substitutes gentle opacity fades (`fade-in-150ms`), keeping the app fully accessible.",
    "blocks": [
      {
        "id": "design-d27-b1-reduced-motion-resolver",
        "day": 27,
        "blockNumber": 1,
        "title": "Inclusive Motion: Resolving Gentle Fade Fallback (`fade-in-150ms`) for Reduced Motion",
        "conceptBudget": {
          "primaryConcept": "Reduced Motion Animation Fallback Resolver",
          "supportingTerms": [
            "Prefers Reduced Motion (`true`)",
            "Standard Animation (`'slide-in-right-300ms'`)",
            "Accessible Fallback (`'fade-in-150ms'`)",
            "Status: Motion Preference Resolved Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d26-b1-svg-icon-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Inclusive Motion Accessibility Ledger",
              "boxes": [
                {
                  "label": "Standard Preference",
                  "value": "slide-in-right-300ms (Spatial translation for standard users)",
                  "varType": "Standard",
                  "isUpdated": false
                },
                {
                  "label": "Reduced Motion Request",
                  "value": "prefers-reduced-motion: reduce detected in OS",
                  "varType": "Request",
                  "isUpdated": false
                },
                {
                  "label": "Resolved Motion Safe",
                  "value": "fade-in-150ms (Gentle opacity fade - RESOLVED NOMINAL!)",
                  "varType": "Resolved",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "reduced_motion_demo.js",
            "initialCode": "function resolveMotion(reduced, stdAnim, fadeAnim) {\n  const selected = reduced ? fadeAnim : stdAnim;\n  return {\n    prefersReducedMotion: reduced,\n    resolvedAnimationClass: selected,\n    status: 'MOTION_PREFERENCE_RESOLVED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(resolveMotion(true, 'slide-in-right-300ms', 'fade-in-150ms')));",
            "expectedOutput": "{\"prefersReducedMotion\":true,\"resolvedAnimationClass\":\"fade-in-150ms\",\"status\":\"MOTION_PREFERENCE_RESOLVED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What animation class is selected when prefers-reduced-motion is active?",
          "expectedStringOutput": "fade-in-150ms",
          "acceptableAnswers": [
            "fade-in-150ms",
            "resolvedAnimationClass\":\"fade-in-150ms\"",
            "'fade-in-150ms'"
          ],
          "primaryMisconceptionId": "MC_DS_MOTION_DESIGN_REDUCED_MOTION",
          "diagnosisMap": {
            "slide-in-right-300ms": {
              "misconceptionId": "MC_DS_MOTION_DESIGN_REDUCED_MOTION",
              "errorExplanation": "Spatial slide triggers vestibular nausea. Reduced motion resolves to fade-in-150ms.",
              "recoveryPath": {
                "simplerExplanation": "Animation is fade-in-150ms.",
                "guidedFixPrompt": "Type fade-in-150ms"
              }
            }
          }
        }
      },
      {
        "id": "design-d27-b2-prefers-reduced-motion-query",
        "day": 27,
        "blockNumber": 2,
        "title": "The Reduced Motion Media Query: `prefers-reduced-motion`",
        "conceptBudget": {
          "primaryConcept": "`prefers-reduced-motion` Invariant",
          "supportingTerms": [
            "`prefers-reduced-motion` (`The CSS media feature used to detect if the user has requested that the system minimize the amount of non-essential motion`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d27-b1-reduced-motion-resolver",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Reduced Motion CSS Syntax",
            "codeSnippet": "/* Standard animation */\n.modal-enter { animation: zoom-in-300ms ease-out; }\n\n/* Vestibular safety override */\n@media (prefers-reduced-motion: reduce) {\n  .modal-enter { animation: fade-in-150ms ease-out; }\n}",
            "lineNotes": {
              "2": "Default zoom animation.",
              "5": "@media (prefers-reduced-motion: reduce) overrides spatial movement with a gentle opacity fade."
            }
          },
          {
            "type": "runnable_code",
            "filename": "motion_query_demo.js",
            "initialCode": "function getReducedMotionQuery() {\n  return 'prefers-reduced-motion';\n}\n\nconsole.log(getReducedMotionQuery());",
            "expectedOutput": "prefers-reduced-motion",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What CSS media query feature detects if a user has requested minimal motion in their operating system?",
          "expectedStringOutput": "prefers-reduced-motion",
          "acceptableAnswers": [
            "prefers-reduced-motion",
            "'prefers-reduced-motion'"
          ],
          "primaryMisconceptionId": "MC_DS_MOTION_DESIGN_REDUCED_MOTION",
          "diagnosisMap": {
            "reduce-motion": {
              "misconceptionId": "MC_DS_MOTION_DESIGN_REDUCED_MOTION",
              "errorExplanation": "The CSS standard name is prefers-reduced-motion.",
              "recoveryPath": {
                "simplerExplanation": "Type prefers-reduced-motion.",
                "guidedFixPrompt": "Type prefers-reduced-motion"
              }
            }
          }
        }
      },
      {
        "id": "design-d27-b3-meaningful-functional-animation",
        "day": 27,
        "blockNumber": 3,
        "title": "Purposeful Animation: Every Motion Must Serve a Functional Cognitive Purpose",
        "conceptBudget": {
          "primaryConcept": "Functional Motion Invariant",
          "supportingTerms": [
            "Functional Motion (`Animations must convey spatial relationships, status changes, or feedback—never decorative gratuitous distraction`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d27-b2-prefers-reduced-motion-query",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "functional_motion_demo.js",
            "initialCode": "function getMotionDesignRule() {\n  return 'ANIMATION_MUST_SERVE_FUNCTIONAL_SPATIAL_OR_FEEDBACK_PURPOSE_NOT_DECORATION';\n}\n\nconsole.log(getMotionDesignRule());",
            "expectedOutput": "ANIMATION_MUST_SERVE_FUNCTIONAL_SPATIAL_OR_FEEDBACK_PURPOSE_NOT_DECORATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What rule governs the inclusion of animation in enterprise design systems?",
          "expectedStringOutput": "ANIMATION_MUST_SERVE_FUNCTIONAL_SPATIAL_OR_FEEDBACK_PURPOSE_NOT_DECORATION",
          "acceptableAnswers": [
            "ANIMATION_MUST_SERVE_FUNCTIONAL_SPATIAL_OR_FEEDBACK_PURPOSE_NOT_DECORATION",
            "Functional purpose not decoration",
            "Serve functional feedback purpose"
          ],
          "primaryMisconceptionId": "MC_DS_MOTION_DESIGN_REDUCED_MOTION",
          "diagnosisMap": {
            "ANIMATE_EVERYTHING": {
              "misconceptionId": "MC_DS_MOTION_DESIGN_REDUCED_MOTION",
              "errorExplanation": "Gratuitous animation distracts users. Standard is: ANIMATION_MUST_SERVE_FUNCTIONAL_SPATIAL_OR_FEEDBACK_PURPOSE_NOT_DECORATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches ANIMATION_MUST_SERVE_FUNCTIONAL_SPATIAL_OR_FEEDBACK_PURPOSE_NOT_DECORATION.",
                "guidedFixPrompt": "Type ANIMATION_MUST_SERVE_FUNCTIONAL_SPATIAL_OR_FEEDBACK_PURPOSE_NOT_DECORATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Storybook Architecture & Component Documentation: CSF3 & Args Tables",
    "overviewMetaphor": "Storybook CSF3 Is a Cleanroom Component Testing Lab: Instead of building an entire car just to test if the brake pedal lights up, you mount the Button in isolation on a test rig (`Storybook CSF3`), dynamically tweaking its properties (`args: { variant: 'primary', disabled: true }`) in real time.",
    "blocks": [
      {
        "id": "design-d28-b1-storybook-csf3-auditor",
        "day": 28,
        "blockNumber": 1,
        "title": "Storybook: Auditing Component Story Format (CSF3) Default Meta & Story Args",
        "conceptBudget": {
          "primaryConcept": "Storybook CSF3 Story Export Structure Auditor",
          "supportingTerms": [
            "Meta Title & Component (`true`)",
            "Story Args Object (`true`)",
            "Status: Storybook CSF3 Structure Verified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d27-b1-reduced-motion-resolver",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Storybook CSF3 Architecture Ledger",
              "boxes": [
                {
                  "label": "Default Export (Meta)",
                  "value": "title: 'Components/Button' | component: Button",
                  "varType": "Meta",
                  "isUpdated": false
                },
                {
                  "label": "Named Export (Story)",
                  "value": "export const Primary = { args: { variant: 'primary' } }",
                  "varType": "Story",
                  "isUpdated": false
                },
                {
                  "label": "CSF3 Compliance",
                  "value": "STORYBOOK CSF3 STRUCTURE VERIFIED NOMINAL (TEST LAB ACTIVE!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "csf3_audit_demo.js",
            "initialCode": "function auditCsf3(meta, story) {\n  const isMeta = !!(meta && meta.title && meta.component);\n  const isStory = !!(story && typeof story.args === 'object');\n  const ok = isMeta && isStory;\n  return {\n    isMetaValid: isMeta,\n    isStoryValid: isStory,\n    status: ok ? 'STORYBOOK_CSF3_STRUCTURE_VERIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditCsf3({ title: 'Components/Button', component: 'Button' }, { args: { variant: 'primary' } })));",
            "expectedOutput": "{\"isMetaValid\":true,\"isStoryValid\":true,\"status\":\"STORYBOOK_CSF3_STRUCTURE_VERIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a component story conforms to the modern Storybook CSF3 specification?",
          "expectedStringOutput": "STORYBOOK_CSF3_STRUCTURE_VERIFIED_NOMINAL",
          "acceptableAnswers": [
            "STORYBOOK_CSF3_STRUCTURE_VERIFIED_NOMINAL",
            "status\":\"STORYBOOK_CSF3_STRUCTURE_VERIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_DS_STORYBOOK_ARCHITECTURE_DOCUMENTATION",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DS_STORYBOOK_ARCHITECTURE_DOCUMENTATION",
              "errorExplanation": "Matches STORYBOOK_CSF3_STRUCTURE_VERIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type STORYBOOK_CSF3_STRUCTURE_VERIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "design-d28-b2-csf3-acronym-name",
        "day": 28,
        "blockNumber": 2,
        "title": "The Standard Story Format Acronym: `CSF3`",
        "conceptBudget": {
          "primaryConcept": "CSF3 Acronym Invariant",
          "supportingTerms": [
            "`CSF3` (`Component Story Format version 3: The standard declarative JavaScript object syntax for defining component stories and documentation`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d28-b1-storybook-csf3-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Storybook CSF3 Story File",
            "codeSnippet": "import type { Meta, StoryObj } from '@storybook/react';\nimport { Button } from './Button';\n\nconst meta: Meta<typeof Button> = {\n  title: 'Atoms/Button',\n  component: Button\n};\nexport default meta;\n\ntype Story = StoryObj<typeof Button>;\nexport const Primary: Story = {\n  args: {\n    variant: 'primary',\n    children: 'Click Me'\n  }\n};",
            "lineNotes": {
              "4": "Default export with title and component.",
              "11": "Declarative story object with args."
            }
          },
          {
            "type": "runnable_code",
            "filename": "csf3_name_demo.js",
            "initialCode": "function getCsfVersion() {\n  return 'CSF3';\n}\n\nconsole.log(getCsfVersion());",
            "expectedOutput": "CSF3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the acronym for Component Story Format version 3 in Storybook?",
          "expectedStringOutput": "CSF3",
          "acceptableAnswers": [
            "CSF3",
            "CSF 3",
            "'CSF3'"
          ],
          "primaryMisconceptionId": "MC_DS_STORYBOOK_ARCHITECTURE_DOCUMENTATION",
          "diagnosisMap": {
            "CSF2": {
              "misconceptionId": "MC_DS_STORYBOOK_ARCHITECTURE_DOCUMENTATION",
              "errorExplanation": "CSF2 used legacy template functions. Modern declarative format is CSF3.",
              "recoveryPath": {
                "simplerExplanation": "Type CSF3.",
                "guidedFixPrompt": "Type CSF3"
              }
            }
          }
        }
      },
      {
        "id": "design-d28-b3-visual-regression-testing-in-ci",
        "day": 28,
        "blockNumber": 3,
        "title": "Automated QA: Visual Regression Testing in CI Pipelines",
        "conceptBudget": {
          "primaryConcept": "Visual Regression Testing Invariant",
          "supportingTerms": [
            "Visual Regression Testing (`Taking automated pixel-diff snapshots of every Storybook story on pull requests to catch unintended visual CSS regressions`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d28-b2-csf3-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "visual_regression_demo.js",
            "initialCode": "function getVisualTestingRule() {\n  return 'EXECUTE_AUTOMATED_PIXEL_DIFF_VISUAL_REGRESSION_TESTS_ON_EVERY_PR';\n}\n\nconsole.log(getVisualTestingRule());",
            "expectedOutput": "EXECUTE_AUTOMATED_PIXEL_DIFF_VISUAL_REGRESSION_TESTS_ON_EVERY_PR",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do design system engineering teams prevent accidental visual CSS regressions across hundreds of components?",
          "expectedStringOutput": "EXECUTE_AUTOMATED_PIXEL_DIFF_VISUAL_REGRESSION_TESTS_ON_EVERY_PR",
          "acceptableAnswers": [
            "EXECUTE_AUTOMATED_PIXEL_DIFF_VISUAL_REGRESSION_TESTS_ON_EVERY_PR",
            "Automated visual regression tests",
            "Pixel diff tests on every PR"
          ],
          "primaryMisconceptionId": "MC_DS_STORYBOOK_ARCHITECTURE_DOCUMENTATION",
          "diagnosisMap": {
            "MANUAL_REVIEW_ONLY": {
              "misconceptionId": "MC_DS_STORYBOOK_ARCHITECTURE_DOCUMENTATION",
              "errorExplanation": "Manual review misses subtle 1px shifts. Standard is: EXECUTE_AUTOMATED_PIXEL_DIFF_VISUAL_REGRESSION_TESTS_ON_EVERY_PR.",
              "recoveryPath": {
                "simplerExplanation": "Matches EXECUTE_AUTOMATED_PIXEL_DIFF_VISUAL_REGRESSION_TESTS_ON_EVERY_PR.",
                "guidedFixPrompt": "Type EXECUTE_AUTOMATED_PIXEL_DIFF_VISUAL_REGRESSION_TESTS_ON_EVERY_PR"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Design System Governance & Versioning: SemVer Breaking Changes & Deprecations",
    "overviewMetaphor": "Design System Versioning Is City Infrastructure Governance: Fixing a pothole on Main Street is a `PATCH` (0.0.X); adding a new bus lane is a `MINOR` feature (0.X.0); but rerouting a 6-lane highway that closes existing exits (removing a component prop) is a `MAJOR` breaking change (X.0.0) requiring advance warning signs (`@deprecated`).",
    "blocks": [
      {
        "id": "design-d29-b1-semver-release-classifier",
        "day": 29,
        "blockNumber": 1,
        "title": "Governance: Classifying `MAJOR (X.0.0)`, `MINOR (0.X.0)`, `PATCH (0.0.X)` SemVer Releases",
        "conceptBudget": {
          "primaryConcept": "Design System SemVer Release Type Classifier",
          "supportingTerms": [
            "Breaking Prop Removal (`MAJOR`)",
            "New Component Feature (`MINOR`)",
            "Bugfix / Contrast Polish (`PATCH`)",
            "Status: SemVer Major Breaking Change"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d28-b1-storybook-csf3-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Design System SemVer Release Matrix Ledger",
              "boxes": [
                {
                  "label": "MAJOR (X.0.0)",
                  "value": "Removed 'isPrimary' prop -> Breaking contract (MAJOR RELEASE!)",
                  "varType": "Major",
                  "isUpdated": true
                },
                {
                  "label": "MINOR (0.X.0)",
                  "value": "Added new <Accordion /> component -> Backwards compatible",
                  "varType": "Minor",
                  "isUpdated": false
                },
                {
                  "label": "PATCH (0.0.X)",
                  "value": "Fixed 1px border alignment bug -> Backwards compatible bugfix",
                  "varType": "Patch",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "semver_demo.js",
            "initialCode": "function classifySemVer(isBreaking, isNewFeature, isBugfix) {\n  if (isBreaking) return { releaseType: 'MAJOR', bumpTarget: 'X.0.0', status: 'SEMVER_MAJOR_BREAKING_CHANGE' };\n  if (isNewFeature) return { releaseType: 'MINOR', bumpTarget: '0.X.0', status: 'SEMVER_MINOR_NEW_FEATURE' };\n  return { releaseType: 'PATCH', bumpTarget: '0.0.X', status: 'SEMVER_PATCH_BUGFIX' };\n}\n\nconsole.log(JSON.stringify(classifySemVer(true, false, false)));\nconsole.log(JSON.stringify(classifySemVer(false, true, false)));\nconsole.log(JSON.stringify(classifySemVer(false, false, true)));",
            "expectedOutput": "{\"releaseType\":\"MAJOR\",\"bumpTarget\":\"X.0.0\",\"status\":\"SEMVER_MAJOR_BREAKING_CHANGE\"}\n{\"releaseType\":\"MINOR\",\"bumpTarget\":\"0.X.0\",\"status\":\"SEMVER_MINOR_NEW_FEATURE\"}\n{\"releaseType\":\"PATCH\",\"bumpTarget\":\"0.0.X\",\"status\":\"SEMVER_PATCH_BUGFIX\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What SemVer release type is required when removing or renaming a component prop?",
          "expectedStringOutput": "MAJOR",
          "acceptableAnswers": [
            "MAJOR",
            "releaseType\":\"MAJOR\"",
            "Major"
          ],
          "primaryMisconceptionId": "MC_DS_DESIGN_SYSTEM_GOVERNANCE_VERSIONING",
          "diagnosisMap": {
            "MINOR": {
              "misconceptionId": "MC_DS_DESIGN_SYSTEM_GOVERNANCE_VERSIONING",
              "errorExplanation": "Removing props breaks consuming applications. It requires a MAJOR release bump.",
              "recoveryPath": {
                "simplerExplanation": "Release type is MAJOR.",
                "guidedFixPrompt": "Type MAJOR"
              }
            }
          }
        }
      },
      {
        "id": "design-d29-b2-jsdoc-deprecated-tag",
        "day": 29,
        "blockNumber": 2,
        "title": "The Deprecation Notice JSDoc Annotation: `@deprecated`",
        "conceptBudget": {
          "primaryConcept": "`@deprecated` Tag Invariant",
          "supportingTerms": [
            "`@deprecated` (`Provides compile-time IDE warnings and migration guidance to product teams before a prop or component is removed in the next major version`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d29-b1-semver-release-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "JSDoc Deprecation Warning Syntax",
            "codeSnippet": "interface ButtonProps {\n  /**\n   * @deprecated Use `variant=\"primary\"` instead. Will be removed in v4.0.0.\n   */\n  isPrimary?: boolean;\n  variant?: 'primary' | 'secondary';\n}",
            "lineNotes": {
              "3": "@deprecated tag triggers strikethrough styling in developer IDEs and explains migration path."
            }
          },
          {
            "type": "runnable_code",
            "filename": "deprecated_tag_demo.js",
            "initialCode": "function getDeprecationTag() {\n  return '@deprecated';\n}\n\nconsole.log(getDeprecationTag());",
            "expectedOutput": "@deprecated",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What JSDoc annotation signals to developers in their IDE that a component prop is scheduled for removal?",
          "expectedStringOutput": "@deprecated",
          "acceptableAnswers": [
            "@deprecated",
            "'@deprecated'",
            "deprecated"
          ],
          "primaryMisconceptionId": "MC_DS_DESIGN_SYSTEM_GOVERNANCE_VERSIONING",
          "diagnosisMap": {
            "@removed": {
              "misconceptionId": "MC_DS_DESIGN_SYSTEM_GOVERNANCE_VERSIONING",
              "errorExplanation": "The standard JSDoc/TypeScript tag is @deprecated.",
              "recoveryPath": {
                "simplerExplanation": "Type @deprecated.",
                "guidedFixPrompt": "Type @deprecated"
              }
            }
          }
        }
      },
      {
        "id": "design-d29-b3-deprecation-cycle-grace-period",
        "day": 29,
        "blockNumber": 3,
        "title": "Deprecation Grace Period: Maintaining Deprecated APIs for at Least 1 Minor Cycle",
        "conceptBudget": {
          "primaryConcept": "Grace Period Invariant",
          "supportingTerms": [
            "Deprecation Grace Period (`Never delete a prop without first deprecating it in a minor release with clear migration docs, giving product teams time to update`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d29-b2-jsdoc-deprecated-tag",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "grace_period_demo.js",
            "initialCode": "function getDeprecationPolicy() {\n  return 'MAINTAIN_DEPRECATED_APIS_WITH_WARNINGS_FOR_ONE_FULL_RELEASE_CYCLE';\n}\n\nconsole.log(getDeprecationPolicy());",
            "expectedOutput": "MAINTAIN_DEPRECATED_APIS_WITH_WARNINGS_FOR_ONE_FULL_RELEASE_CYCLE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What governance rule ensures smooth upgrades across multiple engineering teams?",
          "expectedStringOutput": "MAINTAIN_DEPRECATED_APIS_WITH_WARNINGS_FOR_ONE_FULL_RELEASE_CYCLE",
          "acceptableAnswers": [
            "MAINTAIN_DEPRECATED_APIS_WITH_WARNINGS_FOR_ONE_FULL_RELEASE_CYCLE",
            "Maintain deprecated APIs for one release cycle",
            "Deprecation grace period"
          ],
          "primaryMisconceptionId": "MC_DS_DESIGN_SYSTEM_GOVERNANCE_VERSIONING",
          "diagnosisMap": {
            "DELETE_IMMEDIATELY": {
              "misconceptionId": "MC_DS_DESIGN_SYSTEM_GOVERNANCE_VERSIONING",
              "errorExplanation": "Immediate deletion breaks consumers. Standard is: MAINTAIN_DEPRECATED_APIS_WITH_WARNINGS_FOR_ONE_FULL_RELEASE_CYCLE.",
              "recoveryPath": {
                "simplerExplanation": "Matches MAINTAIN_DEPRECATED_APIS_WITH_WARNINGS_FOR_ONE_FULL_RELEASE_CYCLE.",
                "guidedFixPrompt": "Type MAINTAIN_DEPRECATED_APIS_WITH_WARNINGS_FOR_ONE_FULL_RELEASE_CYCLE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Enterprise Design System & Visual UI Suite",
    "overviewMetaphor": "Day 30 Final Capstone Synthesis: The sovereign enterprise design system and visual UI master suite: 1. Design Tokens & Spatial Grid; 2. Atomic Component Library; 3. Responsive Layout & Animation Engine; 4. Accessibility & Theming Suite; 5. Governance & Tooling (`SOVEREIGN_DESIGN_SYSTEM_MASTER_CERTIFIED_NOMINAL`).",
    "blocks": [
      {
        "id": "design-d30-b1-sovereign-design-system-orchestrator",
        "day": 30,
        "blockNumber": 1,
        "title": "Sovereign Design System Suite Orchestration",
        "conceptBudget": {
          "primaryConcept": "Sovereign Design System Suite Orchestrator",
          "supportingTerms": [
            "Tokens & Spatial Module",
            "Atomic Components Module",
            "Visual & Animation Module",
            "Accessibility & Theme Module",
            "Governance & Tooling Module"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d29-b3-deprecation-cycle-grace-period",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Day 30 Sovereign Design System Suite Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Resolves 3-tier design tokens, 8pt spacing grid & modular type scales",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Validates 6-state buttons, accessible form inputs, cards & modals",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Distributes Flexbox math, fluid CSS Grid columns & mobile-first queries",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Enforces WCAG 2.2 contrast math, roving tabindex & reduced motion",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Certifies Storybook CSF3 documentation & SemVer governance!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_kernel_demo.js",
            "initialCode": "function runSovereignDesignSystem() {\n  return {\n    tokensModule: 'ONLINE_DESIGN_TOKENS_ACTIVE',\n    componentsModule: 'ONLINE_ATOMIC_LIBRARY_ACTIVE',\n    visualModule: 'ONLINE_RESPONSIVE_ANIMATION_ACTIVE',\n    accessibilityModule: 'ONLINE_WCAG_THEME_ACTIVE',\n    governanceModule: 'ONLINE_STORYBOOK_SEMVER_ACTIVE',\n    suiteStatus: 'SOVEREIGN_DESIGN_SYSTEM_MASTER_CERTIFIED_NOMINAL'\n  };\n}\n\nconsole.log(runSovereignDesignSystem().suiteStatus);",
            "expectedOutput": "SOVEREIGN_DESIGN_SYSTEM_MASTER_CERTIFIED_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification status confirms comprehensive activation of the Sovereign Design System Suite?",
          "expectedStringOutput": "SOVEREIGN_DESIGN_SYSTEM_MASTER_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "SOVEREIGN_DESIGN_SYSTEM_MASTER_CERTIFIED_NOMINAL",
            "suiteStatus: SOVEREIGN_DESIGN_SYSTEM_MASTER_CERTIFIED_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_DS_CAPSTONE_SOVEREIGN_DESIGN_SYSTEM_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DS_CAPSTONE_SOVEREIGN_DESIGN_SYSTEM_SUITE",
              "errorExplanation": "Matches SOVEREIGN_DESIGN_SYSTEM_MASTER_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type SOVEREIGN_DESIGN_SYSTEM_MASTER_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "design-d30-b2-sovereign-design-system-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Sovereign Design System Master Suite Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Sovereign Design System Invariant Verification",
          "supportingTerms": [
            "Tokens Invariant",
            "Accessibility Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d30-b1-sovereign-design-system-orchestrator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_audit_demo.js",
            "initialCode": "function auditCapstone(tok, comp, vis, a11y, gov) {\n  const ok = tok && comp && vis && a11y && gov;\n  return {\n    tokensAndSpatialVerified: tok,\n    atomicComponentsVerified: comp,\n    visualLayoutsVerified: vis,\n    accessibilityVerified: a11y,\n    governanceVerified: gov,\n    certified: ok,\n    score: ok ? '100/100' : '0/100',\n    tier: 'SOVEREIGN_DESIGN_SYSTEM_MASTER_CERTIFIED'\n  };\n}\n\nconsole.log(JSON.stringify(auditCapstone(true, true, true, true, true)));",
            "expectedOutput": "{\"tokensAndSpatialVerified\":true,\"atomicComponentsVerified\":true,\"visualLayoutsVerified\":true,\"accessibilityVerified\":true,\"governanceVerified\":true,\"certified\":true,\"score\":\"100/100\",\"tier\":\"SOVEREIGN_DESIGN_SYSTEM_MASTER_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit score is awarded when all 5 design system modules pass 100% verification?",
          "expectedStringOutput": "100/100",
          "acceptableAnswers": [
            "100/100",
            "score\":\"100/100\"",
            "100"
          ],
          "primaryMisconceptionId": "MC_DS_CAPSTONE_SOVEREIGN_DESIGN_SYSTEM_SUITE",
          "diagnosisMap": {
            "0/100": {
              "misconceptionId": "MC_DS_CAPSTONE_SOVEREIGN_DESIGN_SYSTEM_SUITE",
              "errorExplanation": "All checks passing awards 100/100.",
              "recoveryPath": {
                "simplerExplanation": "Score is 100/100.",
                "guidedFixPrompt": "Type 100/100"
              }
            }
          }
        }
      },
      {
        "id": "design-d30-b3-final-capstone-cert",
        "day": 30,
        "blockNumber": 3,
        "title": "Final Capstone Certification: Sovereign Enterprise Design System & Visual UI Suite",
        "conceptBudget": {
          "primaryConcept": "Day 30 Final Capstone Certification",
          "supportingTerms": [
            "Sovereign Design System Certified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d30-b2-sovereign-design-system-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "final_capstone_design_cert.js",
            "initialCode": "console.log('🏆 FINAL CAPSTONE: Sovereign Enterprise Design System & Visual UI Suite [VERIFIED 100%]');",
            "expectedOutput": "🏆 FINAL CAPSTONE: Sovereign Enterprise Design System & Visual UI Suite [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms the final Day 30 Capstone completion?",
          "expectedStringOutput": "🏆 FINAL CAPSTONE: Sovereign Enterprise Design System & Visual UI Suite [VERIFIED 100%]",
          "acceptableAnswers": [
            "🏆 FINAL CAPSTONE: Sovereign Enterprise Design System & Visual UI Suite [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DS_CAPSTONE_SOVEREIGN_DESIGN_SYSTEM_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DS_CAPSTONE_SOVEREIGN_DESIGN_SYSTEM_SUITE",
              "errorExplanation": "Matches final capstone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type 🏆 FINAL CAPSTONE: Sovereign Enterprise Design System & Visual UI Suite [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  }
];
