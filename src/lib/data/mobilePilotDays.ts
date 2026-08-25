import { PilotDay } from '@/lib/types/lessonEngine';

export const MOBILE_PILOT_DAYS: PilotDay[] = [
  {
    "day": 1,
    "title": "Mobile Architecture & React Native Bridge: JS Thread, Hermes & JSI",
    "overviewMetaphor": "The React Native JSI Bridge Is an In-Person Direct Handshake: The legacy bridge serialized every touch event into a slow postal letter (JSON string over asynchronous queue); the modern JSI C++ bridge allows JavaScript to tap the native iOS/Android C++ engine directly on the shoulder (`JSI_DIRECT_MEMORY_INVOCATION_NOMINAL`), eliminating serialization lag.",
    "blocks": [
      {
        "id": "mobile-d1-b1-bridge-classifier",
        "day": 1,
        "blockNumber": 1,
        "title": "Mobile Architecture: Classifying JSI Direct Memory Calls (`isJsiDirectCall: true`)",
        "conceptBudget": {
          "primaryConcept": "Mobile Architecture Runtime Bridge Classifier",
          "supportingTerms": [
            "Target Thread (`'JS_THREAD'`)",
            "JSI Direct Call (`true`)",
            "Hermes Bytecode Engine",
            "Zero JSON Serialization Overhead",
            "Status: JSI Direct Memory Invocation Nominal"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "React Native 3-Thread Architecture Ledger",
              "boxes": [
                {
                  "label": "1. JS Thread (Hermes)",
                  "value": "Executes business logic & React reconciliation",
                  "varType": "JS Thread",
                  "isUpdated": false
                },
                {
                  "label": "2. Shadow Thread (Yoga)",
                  "value": "Calculates Flexbox C++ layout box nodes",
                  "varType": "Shadow",
                  "isUpdated": false
                },
                {
                  "label": "3. UI Thread (Native)",
                  "value": "Renders UIKit / Android Views via direct JSI memory pointers (NOMINAL!)",
                  "varType": "UI Thread",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bridge_classifier_demo.js",
            "initialCode": "function classifyBridge(thread, isJsi) {\n  const ok = isJsi === true;\n  return {\n    thread,\n    isJsiDirectCall: isJsi,\n    isZeroSerializationOverhead: ok,\n    engine: 'Hermes',\n    status: ok ? 'JSI_DIRECT_MEMORY_INVOCATION_NOMINAL' : 'LEGACY_SERIALIZED_BRIDGE_OVERHEAD'\n  };\n}\n\nconsole.log(JSON.stringify(classifyBridge('JS_THREAD', true)));\nconsole.log(JSON.stringify(classifyBridge('UI_MAIN_THREAD', false)));",
            "expectedOutput": "{\"thread\":\"JS_THREAD\",\"isJsiDirectCall\":true,\"isZeroSerializationOverhead\":true,\"engine\":\"Hermes\",\"status\":\"JSI_DIRECT_MEMORY_INVOCATION_NOMINAL\"}\n{\"thread\":\"UI_MAIN_THREAD\",\"isJsiDirectCall\":false,\"isZeroSerializationOverhead\":false,\"engine\":\"Hermes\",\"status\":\"LEGACY_SERIALIZED_BRIDGE_OVERHEAD\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a native mobile call uses the zero-overhead C++ JSI memory interface?",
          "expectedStringOutput": "JSI_DIRECT_MEMORY_INVOCATION_NOMINAL",
          "acceptableAnswers": [
            "JSI_DIRECT_MEMORY_INVOCATION_NOMINAL",
            "status\":\"JSI_DIRECT_MEMORY_INVOCATION_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI",
          "diagnosisMap": {
            "LEGACY_SERIALIZED_BRIDGE_OVERHEAD": {
              "misconceptionId": "MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI",
              "errorExplanation": "JSI calls bypass serialization: JSI_DIRECT_MEMORY_INVOCATION_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type JSI_DIRECT_MEMORY_INVOCATION_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d1-b2-threads-count",
        "day": 1,
        "blockNumber": 2,
        "title": "The 3 Core Execution Threads in React Native",
        "conceptBudget": {
          "primaryConcept": "3-Thread Model Invariant",
          "supportingTerms": [
            "3 Threads (1. JavaScript Thread, 2. Shadow Layout Thread, 3. Native UI Main Thread)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d1-b1-bridge-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "3 Threads Breakdown",
            "codeSnippet": "// 1. JAVASCRIPT THREAD: Runs your React app, API calls, and Zustand state\n// 2. SHADOW THREAD:     Computes Flexbox layout coordinates in C++ Yoga\n// 3. UI MAIN THREAD:    Draws pixels to device screen at 60/120 FPS",
            "lineNotes": {
              "1": "JS execution thread.",
              "2": "C++ Yoga layout engine.",
              "3": "Native platform drawing thread."
            }
          },
          {
            "type": "runnable_code",
            "filename": "threads_count_demo.js",
            "initialCode": "function getThreadsCount() {\n  return 3;\n}\n\nconsole.log(getThreadsCount());",
            "expectedOutput": "3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many core execution threads comprise the React Native runtime architecture?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "3 threads",
            "three"
          ],
          "primaryMisconceptionId": "MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI",
              "errorExplanation": "React Native offloads work across 3 threads: JS Thread, Shadow Thread, and UI Thread.",
              "recoveryPath": {
                "simplerExplanation": "Type 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d1-b3-hermes-bytecode-compilation",
        "day": 1,
        "blockNumber": 3,
        "title": "Hermes Engine: Ahead-of-Time (AOT) Bytecode Compilation for Fast Startup",
        "conceptBudget": {
          "primaryConcept": "Hermes Bytecode Invariant",
          "supportingTerms": [
            "Hermes Engine (`Compiles JS files into optimized bytecode at build time, slashing app launch time (TTI) and memory consumption`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d1-b2-threads-count",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "hermes_rule_demo.js",
            "initialCode": "function getHermesRule() {\n  return 'HERMES_COMPILES_BYTECODE_AHEAD_OF_TIME_FOR_INSTANT_COLD_START';\n}\n\nconsole.log(getHermesRule());",
            "expectedOutput": "HERMES_COMPILES_BYTECODE_AHEAD_OF_TIME_FOR_INSTANT_COLD_START",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why is the Hermes JavaScript engine enabled by default in modern React Native apps?",
          "expectedStringOutput": "HERMES_COMPILES_BYTECODE_AHEAD_OF_TIME_FOR_INSTANT_COLD_START",
          "acceptableAnswers": [
            "HERMES_COMPILES_BYTECODE_AHEAD_OF_TIME_FOR_INSTANT_COLD_START",
            "Instant cold start",
            "Bytecode ahead of time"
          ],
          "primaryMisconceptionId": "MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI",
          "diagnosisMap": {
            "JUST_IN_TIME": {
              "misconceptionId": "MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI",
              "errorExplanation": "Hermes compiles Ahead-of-Time: HERMES_COMPILES_BYTECODE_AHEAD_OF_TIME_FOR_INSTANT_COLD_START.",
              "recoveryPath": {
                "simplerExplanation": "Matches HERMES_COMPILES_BYTECODE_AHEAD_OF_TIME_FOR_INSTANT_COLD_START.",
                "guidedFixPrompt": "Type HERMES_COMPILES_BYTECODE_AHEAD_OF_TIME_FOR_INSTANT_COLD_START"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "React Native Core Components & Layouts: View, Text & SafeAreaView",
    "overviewMetaphor": "SafeAreaView Is a High-End Picture Matting Frame: If you paste a photo edge-to-edge on glass, the camera notch and home indicator bar punch holes right through the image; `SafeAreaView` calculates top and bottom padding dynamically ($852\\text{px} - 59\\text{px} - 34\\text{px} = 759\\text{px}$), preserving clean viewable margins.",
    "blocks": [
      {
        "id": "mobile-d2-b1-safe-area-calculator",
        "day": 2,
        "blockNumber": 1,
        "title": "Safe Area Math: Calculating Usable Height ($852 - 59 - 34 = 759\\text{px}$)",
        "conceptBudget": {
          "primaryConcept": "Safe Area Inset Layout Calculator",
          "supportingTerms": [
            "Device Height ($852\\text{px}$)",
            "Top Notch Inset ($59\\text{px}$)",
            "Bottom Indicator Inset ($34\\text{px}$)",
            "Usable Height ($759\\text{px}$)",
            "Status: Safe Area Content Height Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d1-b1-bridge-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Mobile Safe Area Inset Ledger",
              "boxes": [
                {
                  "label": "Total Screen Height",
                  "value": "852px (iPhone 15 display boundary)",
                  "varType": "Total Height",
                  "isUpdated": false
                },
                {
                  "label": "Notch & Dynamic Island",
                  "value": "topInset: 59px (Sensor housing clearance)",
                  "varType": "Top Inset",
                  "isUpdated": false
                },
                {
                  "label": "Usable Viewport",
                  "value": "852 - (59 + 34) = 759px (CALCULATED NOMINAL!)",
                  "varType": "Usable Height",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "safe_area_demo.js",
            "initialCode": "function calcSafeArea(totalH, top, bottom) {\n  const usable = totalH - (top + bottom);\n  return {\n    totalDeviceHeight: totalH,\n    usableContentHeight: usable,\n    status: 'SAFE_AREA_CONTENT_HEIGHT_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcSafeArea(852, 59, 34)));",
            "expectedOutput": "{\"totalDeviceHeight\":852,\"usableContentHeight\":759,\"status\":\"SAFE_AREA_CONTENT_HEIGHT_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the usable screen height on an 852px device with 59px top and 34px bottom insets?",
          "expectedStringOutput": "759",
          "acceptableAnswers": [
            "759",
            "usableContentHeight\":759",
            "759px"
          ],
          "primaryMisconceptionId": "MC_MOB_CORE_COMPONENTS_SCROLLVIEW_LAYOUT",
          "diagnosisMap": {
            "852": {
              "misconceptionId": "MC_MOB_CORE_COMPONENTS_SCROLLVIEW_LAYOUT",
              "errorExplanation": "852 is total screen height. Subtracting insets (59 + 34 = 93) gives 759.",
              "recoveryPath": {
                "simplerExplanation": "Height is 759.",
                "guidedFixPrompt": "Type 759"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d2-b2-root-text-component-name",
        "day": 2,
        "blockNumber": 2,
        "title": "The Mandatory Text Container: `<Text>`",
        "conceptBudget": {
          "primaryConcept": "`<Text>` Invariant",
          "supportingTerms": [
            "`<Text>` (`Unlike the web where strings can sit bare inside a <div>, React Native will crash with an invariant violation unless every string is wrapped in a <Text> component`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d2-b1-safe-area-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Strict Text Invariant",
            "codeSnippet": "/* ❌ CRASH: Invariant Violation */\n<View>Hello World</View>\n\n/* ✅ NOMINAL: Proper Text Wrapping */\n<View>\n  <Text>Hello World</Text>\n</View>",
            "lineNotes": {
              "2": "Bare string inside View crashes React Native.",
              "6": "String properly wrapped in <Text> component."
            }
          },
          {
            "type": "runnable_code",
            "filename": "text_comp_demo.js",
            "initialCode": "function getTextComp() {\n  return 'Text';\n}\n\nconsole.log(getTextComp());",
            "expectedOutput": "Text",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core primitive component must wrap all text strings in React Native?",
          "expectedStringOutput": "Text",
          "acceptableAnswers": [
            "Text",
            "<Text>",
            "'Text'"
          ],
          "primaryMisconceptionId": "MC_MOB_CORE_COMPONENTS_SCROLLVIEW_LAYOUT",
          "diagnosisMap": {
            "View": {
              "misconceptionId": "MC_MOB_CORE_COMPONENTS_SCROLLVIEW_LAYOUT",
              "errorExplanation": "View cannot host raw strings. Strings must be enclosed in Text.",
              "recoveryPath": {
                "simplerExplanation": "Type Text.",
                "guidedFixPrompt": "Type Text"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d2-b3-remote-image-dimension-contract",
        "day": 2,
        "blockNumber": 3,
        "title": "Image Invariant: Explicit Width and Height on Remote Network Images",
        "conceptBudget": {
          "primaryConcept": "Image Dimension Invariant",
          "supportingTerms": [
            "Image Dimensions (`Remote network images have 0x0 default size until downloaded; declaring explicit width and height styles is mandatory to prevent invisible 0px images`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d2-b2-root-text-component-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "image_dim_demo.js",
            "initialCode": "function getImageRule() {\n  return 'ALWAYS_DECLARE_EXPLICIT_WIDTH_AND_HEIGHT_ON_REMOTE_NETWORK_IMAGES';\n}\n\nconsole.log(getImageRule());",
            "expectedOutput": "ALWAYS_DECLARE_EXPLICIT_WIDTH_AND_HEIGHT_ON_REMOTE_NETWORK_IMAGES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why must remote images in React Native always specify explicit width and height styles?",
          "expectedStringOutput": "ALWAYS_DECLARE_EXPLICIT_WIDTH_AND_HEIGHT_ON_REMOTE_NETWORK_IMAGES",
          "acceptableAnswers": [
            "ALWAYS_DECLARE_EXPLICIT_WIDTH_AND_HEIGHT_ON_REMOTE_NETWORK_IMAGES",
            "Explicit width and height",
            "Declare dimensions"
          ],
          "primaryMisconceptionId": "MC_MOB_CORE_COMPONENTS_SCROLLVIEW_LAYOUT",
          "diagnosisMap": {
            "AUTOSIZE_REMOTE": {
              "misconceptionId": "MC_MOB_CORE_COMPONENTS_SCROLLVIEW_LAYOUT",
              "errorExplanation": "Remote images default to 0x0. Standard is: ALWAYS_DECLARE_EXPLICIT_WIDTH_AND_HEIGHT_ON_REMOTE_NETWORK_IMAGES.",
              "recoveryPath": {
                "simplerExplanation": "Matches ALWAYS_DECLARE_EXPLICIT_WIDTH_AND_HEIGHT_ON_REMOTE_NETWORK_IMAGES.",
                "guidedFixPrompt": "Type ALWAYS_DECLARE_EXPLICIT_WIDTH_AND_HEIGHT_ON_REMOTE_NETWORK_IMAGES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "StyleSheet & Flexbox Mobile Math: Yoga C++ Layout Engine",
    "overviewMetaphor": "Yoga Mobile Flexbox Is a Vertical Smartphone Scroll: While web CSS defaults to horizontal rows (`flexDirection: 'row'`), a phone is held vertically in one hand, so React Native defaults to vertical stacking (`flexDirection: 'column'`), multiplying point coordinates by the device pixel ratio ($100\\text{dp} \\times 3.0 = 300\\text{px}$).",
    "blocks": [
      {
        "id": "mobile-d3-b1-physical-pixel-scaler",
        "day": 3,
        "blockNumber": 1,
        "title": "Pixel Scaling: Calculating Physical Pixels on High-DPI Displays ($100\\text{dp} \\times 3.0 = 300\\text{px}$)",
        "conceptBudget": {
          "primaryConcept": "Physical Pixel Resolution Scaler",
          "supportingTerms": [
            "Density-Independent Points ($100\\text{dp}$)",
            "Pixel Ratio ($3.0\\times$ Retina)",
            "Physical Pixels ($300\\text{px}$)",
            "Status: Physical Pixels Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d2-b1-safe-area-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Mobile Display Pixel Density Ledger",
              "boxes": [
                {
                  "label": "Logical dp Unit",
                  "value": "100dp (Abstract density-independent coordinate)",
                  "varType": "Logical",
                  "isUpdated": false
                },
                {
                  "label": "Device Pixel Ratio",
                  "value": "PixelRatio.get() = 3.0 (Super Retina display scale)",
                  "varType": "Scale",
                  "isUpdated": false
                },
                {
                  "label": "Physical Hardware Pixels",
                  "value": "100 * 3.0 = 300 physical pixels (CALCULATED NOMINAL!)",
                  "varType": "Physical",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pixel_scale_demo.js",
            "initialCode": "function calcPixels(dp, scale) {\n  const phys = Math.round(dp * scale);\n  return {\n    dp,\n    scale,\n    physicalPixels: phys,\n    status: 'PHYSICAL_PIXELS_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcPixels(100, 3.0)));",
            "expectedOutput": "{\"dp\":100,\"scale\":3,\"physicalPixels\":300,\"status\":\"PHYSICAL_PIXELS_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many physical screen pixels are rendered for a 100dp view on a @3x Retina display?",
          "expectedStringOutput": "300",
          "acceptableAnswers": [
            "300",
            "physicalPixels\":300",
            "300px",
            "300 pixels"
          ],
          "primaryMisconceptionId": "MC_MOB_STYLESHEET_FLEXBOX_MOBILE_MATH",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_MOB_STYLESHEET_FLEXBOX_MOBILE_MATH",
              "errorExplanation": "100 is logical points. On @3x display: 100 * 3 = 300.",
              "recoveryPath": {
                "simplerExplanation": "Pixel count is 300.",
                "guidedFixPrompt": "Type 300"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d3-b2-default-flex-direction-name",
        "day": 3,
        "blockNumber": 2,
        "title": "The React Native Default Flex Direction: `column`",
        "conceptBudget": {
          "primaryConcept": "Default Flex Direction Invariant",
          "supportingTerms": [
            "`flexDirection: 'column'` (`The default primary layout axis in React Native, optimizing for portrait smartphone screens`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d3-b1-physical-pixel-scaler",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Web vs Mobile Flexbox Comparison",
            "codeSnippet": "/* Web CSS Default */\ndiv { display: flex; flex-direction: row; }\n\n/* React Native Default (Yoga) */\nconst styles = StyleSheet.create({\n  container: { flex: 1, flexDirection: 'column' } /* COLUMN BY DEFAULT! */\n});",
            "lineNotes": {
              "2": "Web defaults to row.",
              "6": "React Native defaults to column."
            }
          },
          {
            "type": "runnable_code",
            "filename": "flex_dir_demo.js",
            "initialCode": "function getDefaultFlex() {\n  return 'column';\n}\n\nconsole.log(getDefaultFlex());",
            "expectedOutput": "column",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the default flexDirection for View containers in React Native?",
          "expectedStringOutput": "column",
          "acceptableAnswers": [
            "column",
            "'column'",
            "Column"
          ],
          "primaryMisconceptionId": "MC_MOB_STYLESHEET_FLEXBOX_MOBILE_MATH",
          "diagnosisMap": {
            "row": {
              "misconceptionId": "MC_MOB_STYLESHEET_FLEXBOX_MOBILE_MATH",
              "errorExplanation": "row is the web CSS default. React Native defaults to column.",
              "recoveryPath": {
                "simplerExplanation": "Type column.",
                "guidedFixPrompt": "Type column"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d3-b3-stylesheet-create-performance",
        "day": 3,
        "blockNumber": 3,
        "title": "Style Performance: Using `StyleSheet.create` for ID Referencing & Bridge Optimization",
        "conceptBudget": {
          "primaryConcept": "StyleSheet Optimization Invariant",
          "supportingTerms": [
            "StyleSheet.create (`Creates immutable style IDs, sending styles across the native bridge once rather than recreating style objects on every render cycle`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d3-b2-default-flex-direction-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "stylesheet_rule_demo.js",
            "initialCode": "function getStyleSheetRule() {\n  return 'USE_STYLESHEET_CREATE_TO_CACHE_STYLE_IDS_AND_AVOID_INLINE_OBJECT_ALLOCATIONS';\n}\n\nconsole.log(getStyleSheetRule());",
            "expectedOutput": "USE_STYLESHEET_CREATE_TO_CACHE_STYLE_IDS_AND_AVOID_INLINE_OBJECT_ALLOCATIONS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why should StyleSheet.create be used instead of inline style objects in React Native?",
          "expectedStringOutput": "USE_STYLESHEET_CREATE_TO_CACHE_STYLE_IDS_AND_AVOID_INLINE_OBJECT_ALLOCATIONS",
          "acceptableAnswers": [
            "USE_STYLESHEET_CREATE_TO_CACHE_STYLE_IDS_AND_AVOID_INLINE_OBJECT_ALLOCATIONS",
            "Cache style IDs",
            "Avoid inline object allocations"
          ],
          "primaryMisconceptionId": "MC_MOB_STYLESHEET_FLEXBOX_MOBILE_MATH",
          "diagnosisMap": {
            "INLINE_IS_SAME": {
              "misconceptionId": "MC_MOB_STYLESHEET_FLEXBOX_MOBILE_MATH",
              "errorExplanation": "Inline objects trigger GC churn. Standard is: USE_STYLESHEET_CREATE_TO_CACHE_STYLE_IDS_AND_AVOID_INLINE_OBJECT_ALLOCATIONS.",
              "recoveryPath": {
                "simplerExplanation": "Matches USE_STYLESHEET_CREATE_TO_CACHE_STYLE_IDS_AND_AVOID_INLINE_OBJECT_ALLOCATIONS.",
                "guidedFixPrompt": "Type USE_STYLESHEET_CREATE_TO_CACHE_STYLE_IDS_AND_AVOID_INLINE_OBJECT_ALLOCATIONS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Touch Responders & Pressable Physics: Hit Slop & Android Ripple",
    "overviewMetaphor": "hitSlop Is an Invisible Magnetic Field Around a Physical Button: An icon button may be visually small ($24\\times24\\text{dp}$), but adding a $12\\text{dp}$ hitSlop creates an invisible magnetic perimeter ($48\\times48\\text{dp}$), allowing a hurried user's thumb to activate the action without precision tapping.",
    "blocks": [
      {
        "id": "mobile-d4-b1-touch-target-auditor",
        "day": 4,
        "blockNumber": 1,
        "title": "Touch Targets: Auditing Visual $24\\text{dp}$ + $12\\text{dp}$ hitSlop to Reach $48\\text{dp}$ Standard",
        "conceptBudget": {
          "primaryConcept": "Touch Target & Hit Slop Minimum Dimension Auditor",
          "supportingTerms": [
            "Visual Dimensions ($24\\times24\\text{dp}$)",
            "hitSlop Insets ($12\\text{dp}$ all sides)",
            "Effective Touch Area ($48\\times48\\text{dp}$)",
            "Status: Touch Target Accessibility Compliant Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d3-b1-physical-pixel-scaler",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Mobile Touch Target Geometry Ledger",
              "boxes": [
                {
                  "label": "Visual Icon Size",
                  "value": "24x24dp (Tight navigation bar icon)",
                  "varType": "Visual",
                  "isUpdated": false
                },
                {
                  "label": "hitSlop Expansion",
                  "value": "top: 12, bottom: 12, left: 12, right: 12 (Adds 24dp padding)",
                  "varType": "hitSlop",
                  "isUpdated": false
                },
                {
                  "label": "Effective Touch Area",
                  "value": "24 + 24 = 48x48dp (TOUCH TARGET COMPLIANT NOMINAL!)",
                  "varType": "Effective",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "touch_target_demo.js",
            "initialCode": "function auditTouch(w, h, hitH, hitV) {\n  const tw = w + (hitH * 2);\n  const th = h + (hitV * 2);\n  const ok = tw >= 48 && th >= 48;\n  return {\n    effectiveTouchDimensions: `${tw}x${th}`,\n    isTouchTargetCompliant: ok,\n    status: ok ? 'TOUCH_TARGET_ACCESSIBILITY_COMPLIANT_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditTouch(24, 24, 12, 12)));\nconsole.log(JSON.stringify(auditTouch(20, 20, 5, 5)));",
            "expectedOutput": "{\"effectiveTouchDimensions\":\"48x48\",\"isTouchTargetCompliant\":true,\"status\":\"TOUCH_TARGET_ACCESSIBILITY_COMPLIANT_NOMINAL\"}\n{\"effectiveTouchDimensions\":\"30x30\",\"isTouchTargetCompliant\":false,\"status\":\"DEFECT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a touchable component meets the minimum 48x48dp touch target threshold?",
          "expectedStringOutput": "TOUCH_TARGET_ACCESSIBILITY_COMPLIANT_NOMINAL",
          "acceptableAnswers": [
            "TOUCH_TARGET_ACCESSIBILITY_COMPLIANT_NOMINAL",
            "status\":\"TOUCH_TARGET_ACCESSIBILITY_COMPLIANT_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_MOB_TOUCH_RESPONDERS_PRESSABLE_FEEDBACK",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MOB_TOUCH_RESPONDERS_PRESSABLE_FEEDBACK",
              "errorExplanation": "24 + (12*2) = 48x48 produces TOUCH_TARGET_ACCESSIBILITY_COMPLIANT_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type TOUCH_TARGET_ACCESSIBILITY_COMPLIANT_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d4-b2-min-touch-target-dp-number",
        "day": 4,
        "blockNumber": 2,
        "title": "The Mobile Accessibility Minimum Touch Target: 48dp",
        "conceptBudget": {
          "primaryConcept": "48dp Minimum Invariant",
          "supportingTerms": [
            "48dp Minimum (`The official Apple Human Interface Guidelines and Google Material Design standard for reliable finger tap registration`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d4-b1-touch-target-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Pressable with hitSlop Syntax",
            "codeSnippet": "<Pressable\n  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}\n  android_ripple={{ color: 'rgba(0,0,0,0.12)', borderless: true }}\n  onPress={handleAction}\n>\n  <Icon name=\"trash\" size={24} />\n</Pressable>",
            "lineNotes": {
              "2": "hitSlop expands touch boundary to 48x48dp.",
              "3": "android_ripple configures Material design ink ripple.",
              "6": "Visual icon remains compact at 24dp."
            }
          },
          {
            "type": "runnable_code",
            "filename": "min_target_demo.js",
            "initialCode": "function getMinTarget() {\n  return 48;\n}\n\nconsole.log(getMinTarget());",
            "expectedOutput": "48",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the minimum recommended touch target dimension in density-independent pixels (dp) on mobile?",
          "expectedStringOutput": "48",
          "acceptableAnswers": [
            "48",
            "48dp",
            "48 dp",
            "forty-eight"
          ],
          "primaryMisconceptionId": "MC_MOB_TOUCH_RESPONDERS_PRESSABLE_FEEDBACK",
          "diagnosisMap": {
            "20": {
              "misconceptionId": "MC_MOB_TOUCH_RESPONDERS_PRESSABLE_FEEDBACK",
              "errorExplanation": "20dp is too small for human fingertips. The standard is 48dp.",
              "recoveryPath": {
                "simplerExplanation": "Type 48.",
                "guidedFixPrompt": "Type 48"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d4-b3-pressable-over-touchableopacity",
        "day": 4,
        "blockNumber": 3,
        "title": "Modern React Native: Replacing `TouchableOpacity` with `<Pressable>`",
        "conceptBudget": {
          "primaryConcept": "Pressable Invariant",
          "supportingTerms": [
            "`<Pressable>` (`The modern foundational touch primitive providing flexible state callbacks: onPressIn, onPressOut, onLongPress, and pressed render props`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d4-b2-min-touch-target-dp-number",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pressable_rule_demo.js",
            "initialCode": "function getTouchPrimitiveRule() {\n  return 'PREFER_PRESSABLE_OVER_LEGACY_TOUCHABLE_OPACITY_FOR_FINE_GRAINED_TOUCH_PHYSICS';\n}\n\nconsole.log(getTouchPrimitiveRule());",
            "expectedOutput": "PREFER_PRESSABLE_OVER_LEGACY_TOUCHABLE_OPACITY_FOR_FINE_GRAINED_TOUCH_PHYSICS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What touch primitive is recommended in modern React Native applications?",
          "expectedStringOutput": "PREFER_PRESSABLE_OVER_LEGACY_TOUCHABLE_OPACITY_FOR_FINE_GRAINED_TOUCH_PHYSICS",
          "acceptableAnswers": [
            "PREFER_PRESSABLE_OVER_LEGACY_TOUCHABLE_OPACITY_FOR_FINE_GRAINED_TOUCH_PHYSICS",
            "Prefer Pressable",
            "Pressable over TouchableOpacity"
          ],
          "primaryMisconceptionId": "MC_MOB_TOUCH_RESPONDERS_PRESSABLE_FEEDBACK",
          "diagnosisMap": {
            "TOUCHABLE_HIGHLIGHT": {
              "misconceptionId": "MC_MOB_TOUCH_RESPONDERS_PRESSABLE_FEEDBACK",
              "errorExplanation": "Standard is: PREFER_PRESSABLE_OVER_LEGACY_TOUCHABLE_OPACITY_FOR_FINE_GRAINED_TOUCH_PHYSICS.",
              "recoveryPath": {
                "simplerExplanation": "Matches PREFER_PRESSABLE_OVER_LEGACY_TOUCHABLE_OPACITY_FOR_FINE_GRAINED_TOUCH_PHYSICS.",
                "guidedFixPrompt": "Type PREFER_PRESSABLE_OVER_LEGACY_TOUCHABLE_OPACITY_FOR_FINE_GRAINED_TOUCH_PHYSICS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete React Native Bridge, Core Layouts & 60 FPS UI Thread Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete foundational mobile layout and runtime execution engine: 1. JSI bridge invocation classification; 2. Safe area content height calculation; 3. Physical pixel density scaling; 4. 48dp touch target accessibility auditing.",
    "blocks": [
      {
        "id": "mobile-d5-b1-mobile-foundations-master-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "Mobile Foundations Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Mobile Foundations Master Engine",
          "supportingTerms": [
            "JSI Bridge Subsystem",
            "Safe Area Subsystem",
            "Pixel Scaling Subsystem",
            "Touch Target Subsystem"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d4-b3-pressable-over-touchableopacity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 Mobile Foundations Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Initializes Hermes runtime & classifies zero-overhead JSI direct calls",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Calculates notch safe area content heights & Retina pixel scaling",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Audits 48dp minimum touch targets & hitSlop thumb boundaries",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Activates Mobile Foundations Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "mobile_kernel_demo.js",
            "initialCode": "function runMobileFoundations() {\n  return {\n    bridgeSubsystem: 'ONLINE_JSI_DIRECT_ACTIVE',\n    safeAreaSubsystem: 'ONLINE_INSET_CALCULATOR_ACTIVE',\n    pixelsSubsystem: 'ONLINE_DENSITY_SCALER_ACTIVE',\n    touchSubsystem: 'ONLINE_48DP_TARGETS_ACTIVE',\n    engineStatus: 'MOBILE_FOUNDATIONS_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runMobileFoundations().engineStatus);",
            "expectedOutput": "MOBILE_FOUNDATIONS_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Mobile Foundations Master Engine?",
          "expectedStringOutput": "MOBILE_FOUNDATIONS_MASTER_ACTIVE",
          "acceptableAnswers": [
            "MOBILE_FOUNDATIONS_MASTER_ACTIVE",
            "engineStatus: MOBILE_FOUNDATIONS_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI",
              "errorExplanation": "Matches MOBILE_FOUNDATIONS_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type MOBILE_FOUNDATIONS_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d5-b2-mobile-foundations-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "Mobile Foundations Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Mobile Foundations Invariant Verification",
          "supportingTerms": [
            "Bridge Invariant",
            "Touch Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d5-b1-mobile-foundations-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "mobile_audit_demo.js",
            "initialCode": "function auditMobile(b, s, p, t) {\n  const passed = b && s && p && t;\n  return {\n    bridgeVerified: b,\n    safeAreaVerified: s,\n    pixelsVerified: p,\n    touchVerified: t,\n    grade: passed ? 'MOBILE_FOUNDATIONS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditMobile(true, true, true, true)));",
            "expectedOutput": "{\"bridgeVerified\":true,\"safeAreaVerified\":true,\"pixelsVerified\":true,\"touchVerified\":true,\"grade\":\"MOBILE_FOUNDATIONS_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when JSI Bridge, Safe Area, Pixel Scaler, and Touch Targets pass 100%?",
          "expectedStringOutput": "MOBILE_FOUNDATIONS_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "MOBILE_FOUNDATIONS_ENGINE_AUDIT_PASSED",
            "grade\":\"MOBILE_FOUNDATIONS_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI",
              "errorExplanation": "All checks passing awards MOBILE_FOUNDATIONS_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards MOBILE_FOUNDATIONS_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type MOBILE_FOUNDATIONS_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d5-b3-milestone1-mobile-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Mobile Foundations Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Mobile Foundations Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d5-b2-mobile-foundations-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_mobile_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete React Native Bridge, Core Layouts & 60 FPS UI Thread Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete React Native Bridge, Core Layouts & 60 FPS UI Thread Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete React Native Bridge, Core Layouts & 60 FPS UI Thread Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete React Native Bridge, Core Layouts & 60 FPS UI Thread Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_MOB_REACT_NATIVE_BRIDGE_HERMES_JSI",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete React Native Bridge, Core Layouts & 60 FPS UI Thread Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Asset Bundling & Vector Icons: Expo Vector Icons & Local Images",
    "overviewMetaphor": "Local Asset Bundling Is a Pre-Packed Luggage Bag: A bundled image (`require('./logo.png')`) is packed directly into the app binary, returning a numeric asset ID (0 network latency); a remote URL (`{ uri: 'https://...' }`) is ordering room service from across the city, failing completely if the airplane is in offline flight mode.",
    "blocks": [
      {
        "id": "mobile-d6-b1-asset-source-classifier",
        "day": 6,
        "blockNumber": 1,
        "title": "Asset Management: Classifying `require (LOCAL_BUNDLED_ASSET)` vs `{ uri } (REMOTE_NETWORK_URI)`",
        "conceptBudget": {
          "primaryConcept": "Mobile Image Asset URI Type Classifier",
          "supportingTerms": [
            "Local Bundled Asset (Numeric ID `42`)",
            "Remote Network URI (`'https://cdn.pinit.io/logo.png'`)",
            "Network Dependency (`requiresNetwork`)",
            "Status: Asset Source Classified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d1-b1-bridge-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Mobile Asset Source Architecture Ledger",
              "boxes": [
                {
                  "label": "require('./img.png')",
                  "value": "Evaluates to numeric integer asset ID 42 (Bundled in binary, 0 network latency)",
                  "varType": "Local Asset",
                  "isUpdated": false
                },
                {
                  "label": "{ uri: 'https://...' }",
                  "value": "Remote network resource (Requires active HTTP download)",
                  "varType": "Remote URI",
                  "isUpdated": false
                },
                {
                  "label": "Classification Status",
                  "value": "ASSET SOURCE CLASSIFIED NOMINAL (OFFLINE RESILIENCY VERIFIED!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "asset_classifier_demo.js",
            "initialCode": "function classifyAsset(src) {\n  if (typeof src === 'number') {\n    return { source: src, type: 'LOCAL_BUNDLED_ASSET', requiresNetwork: false, status: 'ASSET_SOURCE_CLASSIFIED_NOMINAL' };\n  }\n  if (typeof src === 'object' && src.uri) {\n    return { source: src.uri, type: 'REMOTE_NETWORK_URI', requiresNetwork: true, status: 'ASSET_SOURCE_CLASSIFIED_NOMINAL' };\n  }\n}\n\nconsole.log(JSON.stringify(classifyAsset(42)));\nconsole.log(JSON.stringify(classifyAsset({ uri: 'https://cdn.pinit.io/logo.png' })));",
            "expectedOutput": "{\"source\":42,\"type\":\"LOCAL_BUNDLED_ASSET\",\"requiresNetwork\":false,\"status\":\"ASSET_SOURCE_CLASSIFIED_NOMINAL\"}\n{\"source\":\"https://cdn.pinit.io/logo.png\",\"type\":\"REMOTE_NETWORK_URI\",\"requiresNetwork\":true,\"status\":\"ASSET_SOURCE_CLASSIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What asset type is assigned to a bundled image loaded via require() numeric asset ID?",
          "expectedStringOutput": "LOCAL_BUNDLED_ASSET",
          "acceptableAnswers": [
            "LOCAL_BUNDLED_ASSET",
            "type\":\"LOCAL_BUNDLED_ASSET\"",
            "Local bundled asset"
          ],
          "primaryMisconceptionId": "MC_MOB_ASSET_BUNDLING_VECTOR_ICONS",
          "diagnosisMap": {
            "REMOTE_NETWORK_URI": {
              "misconceptionId": "MC_MOB_ASSET_BUNDLING_VECTOR_ICONS",
              "errorExplanation": "Numeric require() resolves to LOCAL_BUNDLED_ASSET with zero network requirement.",
              "recoveryPath": {
                "simplerExplanation": "Type is LOCAL_BUNDLED_ASSET.",
                "guidedFixPrompt": "Type LOCAL_BUNDLED_ASSET"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d6-b2-local-require-type-name",
        "day": 6,
        "blockNumber": 2,
        "title": "The Runtime Type of a `require('./img.png')`: `number`",
        "conceptBudget": {
          "primaryConcept": "Require Return Type Invariant",
          "supportingTerms": [
            "`number` (`Metro bundler maps local required images to static numeric resource index numbers in the JavaScript bundle`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d6-b1-asset-source-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Local Require Mechanics",
            "codeSnippet": "const iconSource = require('./assets/avatar.png');\nconsole.log(typeof iconSource); // prints 'number'!\n\n<Image source={iconSource} style={{ width: 48, height: 48 }} />",
            "lineNotes": {
              "1": "Metro transforms image import to numeric integer.",
              "2": "typeof is 'number'.",
              "4": "Image renders instantly from native resource pool."
            }
          },
          {
            "type": "runnable_code",
            "filename": "require_type_demo.js",
            "initialCode": "function getRequireType() {\n  return 'number';\n}\n\nconsole.log(getRequireType());",
            "expectedOutput": "number",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the JavaScript runtime data type of an image loaded with require('./image.png') in React Native?",
          "expectedStringOutput": "number",
          "acceptableAnswers": [
            "number",
            "'number'",
            "integer"
          ],
          "primaryMisconceptionId": "MC_MOB_ASSET_BUNDLING_VECTOR_ICONS",
          "diagnosisMap": {
            "string": {
              "misconceptionId": "MC_MOB_ASSET_BUNDLING_VECTOR_ICONS",
              "errorExplanation": "In React Native, require() returns a resource table index number, not a file path string.",
              "recoveryPath": {
                "simplerExplanation": "Type number.",
                "guidedFixPrompt": "Type number"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d6-b3-vector-icons-glyph-fonts",
        "day": 6,
        "blockNumber": 3,
        "title": "Vector Icon Performance: Rendering Crisp Icons with `@expo/vector-icons`",
        "conceptBudget": {
          "primaryConcept": "Vector Icon Invariant",
          "supportingTerms": [
            "`@expo/vector-icons` (`Renders vector icons as scalable TrueType font glyphs, providing crisp rendering at any size with zero PNG pixelation`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d6-b2-local-require-type-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "vector_icons_demo.js",
            "initialCode": "function getVectorIconRule() {\n  return 'USE_EXPO_VECTOR_ICONS_AS_SCALABLE_FONT_GLYPHS_FOR_PERFECT_RETINA_CLARITY';\n}\n\nconsole.log(getVectorIconRule());",
            "expectedOutput": "USE_EXPO_VECTOR_ICONS_AS_SCALABLE_FONT_GLYPHS_FOR_PERFECT_RETINA_CLARITY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do production mobile apps render scalable vector icons with zero image blur?",
          "expectedStringOutput": "USE_EXPO_VECTOR_ICONS_AS_SCALABLE_FONT_GLYPHS_FOR_PERFECT_RETINA_CLARITY",
          "acceptableAnswers": [
            "USE_EXPO_VECTOR_ICONS_AS_SCALABLE_FONT_GLYPHS_FOR_PERFECT_RETINA_CLARITY",
            "Expo vector icons as font glyphs",
            "Scalable font glyphs"
          ],
          "primaryMisconceptionId": "MC_MOB_ASSET_BUNDLING_VECTOR_ICONS",
          "diagnosisMap": {
            "USE_PNG": {
              "misconceptionId": "MC_MOB_ASSET_BUNDLING_VECTOR_ICONS",
              "errorExplanation": "PNGs blur on high-DPI. Standard is: USE_EXPO_VECTOR_ICONS_AS_SCALABLE_FONT_GLYPHS_FOR_PERFECT_RETINA_CLARITY.",
              "recoveryPath": {
                "simplerExplanation": "Matches USE_EXPO_VECTOR_ICONS_AS_SCALABLE_FONT_GLYPHS_FOR_PERFECT_RETINA_CLARITY.",
                "guidedFixPrompt": "Type USE_EXPO_VECTOR_ICONS_AS_SCALABLE_FONT_GLYPHS_FOR_PERFECT_RETINA_CLARITY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "React Navigation: Native Stack Navigator & Screen Param Pipelines",
    "overviewMetaphor": "The Native Stack Navigator Is a Deck of Playing Cards: Tapping a course card pushes a new Detail card cleanly on top of the deck (`navigation.navigate('CourseDetail', { id })`); swiping back from the left bezel smoothly pops the top card off to reveal the previous screen with zero re-rendering.",
    "blocks": [
      {
        "id": "mobile-d7-b1-stack-route-validator",
        "day": 7,
        "blockNumber": 1,
        "title": "Navigation: Validating Destination Route (`CourseDetailScreen`) & Strong Route Params",
        "conceptBudget": {
          "primaryConcept": "Navigation Stack Route Parameter Validator",
          "supportingTerms": [
            "Destination Screen (`'CourseDetailScreen'`)",
            "Route Parameters (`{ courseId: 'mobile-dev' }`)",
            "Registered Routes Registry",
            "Status: Stack Navigation Route Validated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d6-b1-asset-source-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Native Stack Route Parameter Pipeline Ledger",
              "boxes": [
                {
                  "label": "Source Screen",
                  "value": "HomeScreen -> navigation.navigate('CourseDetailScreen', { courseId: 'mobile-dev' })",
                  "varType": "Dispatch",
                  "isUpdated": false
                },
                {
                  "label": "Route Params Pipeline",
                  "value": "route.params.courseId = 'mobile-dev' (Type-safe parameter validation)",
                  "varType": "Params",
                  "isUpdated": false
                },
                {
                  "label": "Validation Status",
                  "value": "STACK NAVIGATION ROUTE VALIDATED NOMINAL (NATIVE TRANSITION!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "stack_nav_demo.js",
            "initialCode": "function validateRoute(name, params) {\n  const reg = ['HomeScreen', 'CourseDetailScreen', 'ProfileScreen'];\n  const ok = reg.includes(name) && typeof params === 'object' && params !== null;\n  return {\n    destinationRoute: name,\n    isRouteValid: ok,\n    status: ok ? 'STACK_NAVIGATION_ROUTE_VALIDATED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(validateRoute('CourseDetailScreen', { courseId: 'mobile-dev' })));",
            "expectedOutput": "{\"destinationRoute\":\"CourseDetailScreen\",\"isRouteValid\":true,\"status\":\"STACK_NAVIGATION_ROUTE_VALIDATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a navigation push destination and route parameters are valid?",
          "expectedStringOutput": "STACK_NAVIGATION_ROUTE_VALIDATED_NOMINAL",
          "acceptableAnswers": [
            "STACK_NAVIGATION_ROUTE_VALIDATED_NOMINAL",
            "status\":\"STACK_NAVIGATION_ROUTE_VALIDATED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS",
              "errorExplanation": "Matches STACK_NAVIGATION_ROUTE_VALIDATED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type STACK_NAVIGATION_ROUTE_VALIDATED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d7-b2-native-stack-component-name",
        "day": 7,
        "blockNumber": 2,
        "title": "The High-Performance Native Screen Host: `NativeStackNavigator`",
        "conceptBudget": {
          "primaryConcept": "`createNativeStackNavigator` Invariant",
          "supportingTerms": [
            "`createNativeStackNavigator` (`Uses native iOS UINavigationController and Android Fragment views for native memory management and 60 FPS transitions`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d7-b1-stack-route-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Native Stack Navigator Setup",
            "codeSnippet": "import { createNativeStackNavigator } from '@react-navigation/native-stack';\n\nconst Stack = createNativeStackNavigator();\n\nfunction AppNavigator() {\n  return (\n    <Stack.Navigator screenOptions={{ headerBackTitle: 'Back' }}>\n      <Stack.Screen name=\"Home\" component={HomeScreen} />\n      <Stack.Screen name=\"CourseDetail\" component={CourseDetailScreen} />\n    </Stack.Navigator>\n  );\n}",
            "lineNotes": {
              "1": "Import createNativeStackNavigator.",
              "3": "Initialize Stack navigator instance.",
              "7": "Declare type-safe Screen routes."
            }
          },
          {
            "type": "runnable_code",
            "filename": "native_stack_demo.js",
            "initialCode": "function getNativeStackComp() {\n  return 'NativeStackNavigator';\n}\n\nconsole.log(getNativeStackComp());",
            "expectedOutput": "NativeStackNavigator",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What navigator uses native platform screen hierarchies rather than simulated JavaScript animations?",
          "expectedStringOutput": "NativeStackNavigator",
          "acceptableAnswers": [
            "NativeStackNavigator",
            "createNativeStackNavigator",
            "'NativeStackNavigator'"
          ],
          "primaryMisconceptionId": "MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS",
          "diagnosisMap": {
            "JSStackNavigator": {
              "misconceptionId": "MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS",
              "errorExplanation": "Legacy JS stack is slow. Native screens use NativeStackNavigator.",
              "recoveryPath": {
                "simplerExplanation": "Type NativeStackNavigator.",
                "guidedFixPrompt": "Type NativeStackNavigator"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d7-b3-type-safe-navigation-props",
        "day": 7,
        "blockNumber": 3,
        "title": "TypeScript Safety: Defining `NativeStackScreenProps` for Route Parameters",
        "conceptBudget": {
          "primaryConcept": "Type-Safe Navigation Invariant",
          "supportingTerms": [
            "`NativeStackScreenProps` (`Provides compile-time autocomplete and type-checking on route.params, eliminating runtime undefined parameter crashes`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d7-b2-native-stack-component-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "type_safe_nav_demo.js",
            "initialCode": "function getNavTypeSafetyRule() {\n  return 'DECLARE_TYPESCRIPT_PARAM_LIST_TYPES_FOR_EVERY_NAVIGATION_ROUTE';\n}\n\nconsole.log(getNavTypeSafetyRule());",
            "expectedOutput": "DECLARE_TYPESCRIPT_PARAM_LIST_TYPES_FOR_EVERY_NAVIGATION_ROUTE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do professional mobile engineering teams prevent navigation parameter crashes?",
          "expectedStringOutput": "DECLARE_TYPESCRIPT_PARAM_LIST_TYPES_FOR_EVERY_NAVIGATION_ROUTE",
          "acceptableAnswers": [
            "DECLARE_TYPESCRIPT_PARAM_LIST_TYPES_FOR_EVERY_NAVIGATION_ROUTE",
            "TypeScript param list types",
            "Type safe navigation routes"
          ],
          "primaryMisconceptionId": "MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS",
          "diagnosisMap": {
            "UNTYPED_PARAMS": {
              "misconceptionId": "MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS",
              "errorExplanation": "Untyped params cause runtime crashes. Standard is: DECLARE_TYPESCRIPT_PARAM_LIST_TYPES_FOR_EVERY_NAVIGATION_ROUTE.",
              "recoveryPath": {
                "simplerExplanation": "Matches DECLARE_TYPESCRIPT_PARAM_LIST_TYPES_FOR_EVERY_NAVIGATION_ROUTE.",
                "guidedFixPrompt": "Type DECLARE_TYPESCRIPT_PARAM_LIST_TYPES_FOR_EVERY_NAVIGATION_ROUTE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Bottom Tabs & Drawer Navigators: Tab Badges & Gesture Transitions",
    "overviewMetaphor": "Bottom Tab Navigation Is the Dashboard of a Sports Car: The 4 core dials (Home, Courses, Quests, Profile) sit fixed at the bottom within comfortable thumb reach (`bottom`); unread notifications light up an illuminated counter badge (`tabBarBadge: '99+'`), providing immediate situational awareness.",
    "blocks": [
      {
        "id": "mobile-d8-b1-tab-badge-formatter",
        "day": 8,
        "blockNumber": 1,
        "title": "Tab Navigation: Formatting Badges ($0 \\to \\text{undefined}, 5 \\to 5, 150 \\to \\text{'99+'}$)",
        "conceptBudget": {
          "primaryConcept": "Tab Bar Notification Badge Formatter",
          "supportingTerms": [
            "Zero Count (`undefined` hidden)",
            "Normal Count ($5$)",
            "Overflow Count (`'99+'`)",
            "Status: Tab Bar Badge Formatted Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d7-b1-stack-route-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Bottom Tab Notification Badge Ledger",
              "boxes": [
                {
                  "label": "0 Unread Count",
                  "value": "tabBarBadge = undefined (Badge hidden cleanly)",
                  "varType": "Hidden",
                  "isUpdated": false
                },
                {
                  "label": "5 Unread Count",
                  "value": "tabBarBadge = 5 (Numeric badge displayed)",
                  "varType": "Normal",
                  "isUpdated": false
                },
                {
                  "label": "150 Unread Count",
                  "value": "tabBarBadge = '99+' (Formatted nominal to fit pill!)",
                  "varType": "Overflow",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "tab_badge_demo.js",
            "initialCode": "function formatBadge(count) {\n  if (count <= 0) return { badge: undefined, hasBadge: false, status: 'TAB_BAR_BADGE_FORMATTED_NOMINAL' };\n  if (count > 99) return { badge: '99+', hasBadge: true, status: 'TAB_BAR_BADGE_FORMATTED_NOMINAL' };\n  return { badge: count, hasBadge: true, status: 'TAB_BAR_BADGE_FORMATTED_NOMINAL' };\n}\n\nconsole.log(JSON.stringify(formatBadge(0)));\nconsole.log(JSON.stringify(formatBadge(5)));\nconsole.log(JSON.stringify(formatBadge(150)));",
            "expectedOutput": "{\"hasBadge\":false,\"status\":\"TAB_BAR_BADGE_FORMATTED_NOMINAL\"}\n{\"badge\":5,\"hasBadge\":true,\"status\":\"TAB_BAR_BADGE_FORMATTED_NOMINAL\"}\n{\"badge\":\"99+\",\"hasBadge\":true,\"status\":\"TAB_BAR_BADGE_FORMATTED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What badge value is formatted for 150 unread messages to fit cleanly inside a mobile tab icon pill?",
          "expectedStringOutput": "99+",
          "acceptableAnswers": [
            "99+",
            "badge\":\"99+\"",
            "'99+'"
          ],
          "primaryMisconceptionId": "MC_MOB_BOTTOM_TABS_DRAWER_NAVIGATORS",
          "diagnosisMap": {
            "150": {
              "misconceptionId": "MC_MOB_BOTTOM_TABS_DRAWER_NAVIGATORS",
              "errorExplanation": "3-digit numbers overflow badge bubbles. Format count > 99 as '99+'.",
              "recoveryPath": {
                "simplerExplanation": "Badge is 99+.",
                "guidedFixPrompt": "Type 99+"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d8-b2-bottom-tab-position-name",
        "day": 8,
        "blockNumber": 2,
        "title": "The Ergonomic Mobile Tab Position: `bottom`",
        "conceptBudget": {
          "primaryConcept": "Bottom Position Invariant",
          "supportingTerms": [
            "`bottom` (`Placing main navigation tabs at the bottom of the viewport allows comfortable one-handed thumb interaction without straining to reach top corners`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d8-b1-tab-badge-formatter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Bottom Tab Ergonomics",
            "codeSnippet": "// ONE-HANDED THUMB ZONE ERGONOMICS:\n// 1. Top 20% of screen:     Hard to reach (Header & Status only)\n// 2. Middle 50% of screen:  Easy viewing (Scrollable Content)\n// 3. Bottom 30% of screen:  NATURAL THUMB ZONE (Bottom Tab Bar!)",
            "lineNotes": {
              "2": "Top reach zone.",
              "3": "Middle view zone.",
              "4": "Bottom thumb zone: Primary interactive navigation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "tab_position_demo.js",
            "initialCode": "function getTabPos() {\n  return 'bottom';\n}\n\nconsole.log(getTabPos());",
            "expectedOutput": "bottom",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where should primary application navigation tabs be positioned for ergonomic one-handed smartphone use?",
          "expectedStringOutput": "bottom",
          "acceptableAnswers": [
            "bottom",
            "'bottom'",
            "Bottom"
          ],
          "primaryMisconceptionId": "MC_MOB_BOTTOM_TABS_DRAWER_NAVIGATORS",
          "diagnosisMap": {
            "top": {
              "misconceptionId": "MC_MOB_BOTTOM_TABS_DRAWER_NAVIGATORS",
              "errorExplanation": "Top position causes thumb strain. Mobile tabs are placed at the bottom.",
              "recoveryPath": {
                "simplerExplanation": "Type bottom.",
                "guidedFixPrompt": "Type bottom"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d8-b3-drawer-gesture-edge-swipe",
        "day": 8,
        "blockNumber": 3,
        "title": "Drawer Interaction: Enabling Edge Swipe Gestures",
        "conceptBudget": {
          "primaryConcept": "Edge Swipe Invariant",
          "supportingTerms": [
            "Edge Swipe Gesture (`'swipeEdgeWidth: 50': Allows opening side drawers with a natural thumb swipe from the screen boundary while preventing gesture conflicts in map/list content`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d8-b2-bottom-tab-position-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "drawer_gesture_demo.js",
            "initialCode": "function getDrawerRule() {\n  return 'USE_EDGE_SWIPE_GESTURES_FOR_DRAWER_OPENING_TO_PREVENT_CONTENT_DRAG_CONFLICTS';\n}\n\nconsole.log(getDrawerRule());",
            "expectedOutput": "USE_EDGE_SWIPE_GESTURES_FOR_DRAWER_OPENING_TO_PREVENT_CONTENT_DRAG_CONFLICTS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What gesture configuration prevents side drawers from conflicting with horizontal list scrolling?",
          "expectedStringOutput": "USE_EDGE_SWIPE_GESTURES_FOR_DRAWER_OPENING_TO_PREVENT_CONTENT_DRAG_CONFLICTS",
          "acceptableAnswers": [
            "USE_EDGE_SWIPE_GESTURES_FOR_DRAWER_OPENING_TO_PREVENT_CONTENT_DRAG_CONFLICTS",
            "Edge swipe gestures",
            "Edge swipe to prevent drag conflicts"
          ],
          "primaryMisconceptionId": "MC_MOB_BOTTOM_TABS_DRAWER_NAVIGATORS",
          "diagnosisMap": {
            "FULL_SCREEN_SWIPE": {
              "misconceptionId": "MC_MOB_BOTTOM_TABS_DRAWER_NAVIGATORS",
              "errorExplanation": "Full screen swipe breaks inner sliders. Standard is: USE_EDGE_SWIPE_GESTURES_FOR_DRAWER_OPENING_TO_PREVENT_CONTENT_DRAG_CONFLICTS.",
              "recoveryPath": {
                "simplerExplanation": "Matches USE_EDGE_SWIPE_GESTURES_FOR_DRAWER_OPENING_TO_PREVENT_CONTENT_DRAG_CONFLICTS.",
                "guidedFixPrompt": "Type USE_EDGE_SWIPE_GESTURES_FOR_DRAWER_OPENING_TO_PREVENT_CONTENT_DRAG_CONFLICTS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Keyboard Handling & Forms in Mobile: KeyboardAvoidingView & Scroll Dismiss",
    "overviewMetaphor": "KeyboardAvoidingView Is an Automatic Elevator for Form Inputs: When the smartphone soft keyboard slides up from the floor, `KeyboardAvoidingView` detects the platform (`'padding'` on iOS vs `'height'` on Android), lifting the input fields upward so the keyboard never covers the user's typing field (`KEYBOARD_AVOIDING_BEHAVIOR_RESOLVED_NOMINAL`).",
    "blocks": [
      {
        "id": "mobile-d9-b1-keyboard-behavior-matcher",
        "day": 9,
        "blockNumber": 1,
        "title": "Keyboard Handling: Mapping `'ios'` $\\to$ `'padding'` vs `'android'` $\\to$ `'height'`",
        "conceptBudget": {
          "primaryConcept": "KeyboardAvoidingView Behavior Platform Matcher",
          "supportingTerms": [
            "Platform OS (`'ios'` vs `'android'`)",
            "Recommended Behavior (`'padding'` vs `'height'`)",
            "Status: Keyboard Avoiding Behavior Resolved Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d8-b1-tab-badge-formatter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Mobile Keyboard Behavior Architecture Ledger",
              "boxes": [
                {
                  "label": "iOS Platform",
                  "value": "behavior='padding' (Pushes view up smoothly using layout padding)",
                  "varType": "iOS",
                  "isUpdated": false
                },
                {
                  "label": "Android Platform",
                  "value": "behavior='height' (Adjusts container height with windowSoftInputMode)",
                  "varType": "Android",
                  "isUpdated": false
                },
                {
                  "label": "Behavior Resolution",
                  "value": "KEYBOARD AVOIDING BEHAVIOR RESOLVED NOMINAL (0 OCCLUSION!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "keyboard_behavior_demo.js",
            "initialCode": "function resolveKeyboardBehavior(os) {\n  const beh = os === 'ios' ? 'padding' : 'height';\n  return {\n    platformOs: os,\n    recommendedBehavior: beh,\n    status: 'KEYBOARD_AVOIDING_BEHAVIOR_RESOLVED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(resolveKeyboardBehavior('ios')));\nconsole.log(JSON.stringify(resolveKeyboardBehavior('android')));",
            "expectedOutput": "{\"platformOs\":\"ios\",\"recommendedBehavior\":\"padding\",\"status\":\"KEYBOARD_AVOIDING_BEHAVIOR_RESOLVED_NOMINAL\"}\n{\"platformOs\":\"android\",\"recommendedBehavior\":\"height\",\"status\":\"KEYBOARD_AVOIDING_BEHAVIOR_RESOLVED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What KeyboardAvoidingView behavior property is recommended for iOS devices?",
          "expectedStringOutput": "padding",
          "acceptableAnswers": [
            "padding",
            "recommendedBehavior\":\"padding\"",
            "'padding'"
          ],
          "primaryMisconceptionId": "MC_MOB_KEYBOARD_AVOIDING_FORM_STATE",
          "diagnosisMap": {
            "height": {
              "misconceptionId": "MC_MOB_KEYBOARD_AVOIDING_FORM_STATE",
              "errorExplanation": "height is for Android. iOS requires 'padding' to avoid layout jumping.",
              "recoveryPath": {
                "simplerExplanation": "Behavior is padding.",
                "guidedFixPrompt": "Type padding"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d9-b2-keyboard-dismiss-method-name",
        "day": 9,
        "blockNumber": 2,
        "title": "The Programmatic Keyboard Dismissal API: `Keyboard.dismiss`",
        "conceptBudget": {
          "primaryConcept": "`Keyboard.dismiss` Invariant",
          "supportingTerms": [
            "`Keyboard.dismiss()` (`Dismisses the active software keyboard and releases focus from any focused TextInput element`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d9-b1-keyboard-behavior-matcher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Keyboard Dismissal Setup",
            "codeSnippet": "import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';\n\nfunction ScreenWrapper({ children }) {\n  return (\n    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>\n      <View style={{ flex: 1 }}>{children}</View>\n    </TouchableWithoutFeedback>\n  );\n}",
            "lineNotes": {
              "5": "Tapping anywhere outside the input dismisses soft keyboard.",
              "5.2": "accessible={false} prevents accessibility tree noise."
            }
          },
          {
            "type": "runnable_code",
            "filename": "keyboard_dismiss_demo.js",
            "initialCode": "function getKeyboardDismiss() {\n  return 'Keyboard.dismiss';\n}\n\nconsole.log(getKeyboardDismiss());",
            "expectedOutput": "Keyboard.dismiss",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core React Native method programmatically closes the on-screen soft keyboard?",
          "expectedStringOutput": "Keyboard.dismiss",
          "acceptableAnswers": [
            "Keyboard.dismiss",
            "Keyboard.dismiss()",
            "'Keyboard.dismiss'"
          ],
          "primaryMisconceptionId": "MC_MOB_KEYBOARD_AVOIDING_FORM_STATE",
          "diagnosisMap": {
            "Keyboard.close": {
              "misconceptionId": "MC_MOB_KEYBOARD_AVOIDING_FORM_STATE",
              "errorExplanation": "The React Native API method is Keyboard.dismiss().",
              "recoveryPath": {
                "simplerExplanation": "Type Keyboard.dismiss.",
                "guidedFixPrompt": "Type Keyboard.dismiss"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d9-b3-scroll-view-persist-taps",
        "day": 9,
        "blockNumber": 3,
        "title": "ScrollView Touch Invariant: `keyboardShouldPersistTaps=\"handled\"`",
        "conceptBudget": {
          "primaryConcept": "`keyboardShouldPersistTaps` Invariant",
          "supportingTerms": [
            "`keyboardShouldPersistTaps=\"handled\"` (`Ensures that pressing a submit button while the keyboard is open executes the button's onPress immediately without requiring a 2nd tap`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d9-b2-keyboard-dismiss-method-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "persist_taps_demo.js",
            "initialCode": "function getPersistTapsRule() {\n  return 'SET_KEYBOARD_SHOULD_PERSIST_TAPS_HANDLED_ON_ALL_SCROLL_VIEWS';\n}\n\nconsole.log(getPersistTapsRule());",
            "expectedOutput": "SET_KEYBOARD_SHOULD_PERSIST_TAPS_HANDLED_ON_ALL_SCROLL_VIEWS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What ScrollView property allows immediate button tapping while the soft keyboard is open?",
          "expectedStringOutput": "SET_KEYBOARD_SHOULD_PERSIST_TAPS_HANDLED_ON_ALL_SCROLL_VIEWS",
          "acceptableAnswers": [
            "SET_KEYBOARD_SHOULD_PERSIST_TAPS_HANDLED_ON_ALL_SCROLL_VIEWS",
            "keyboardShouldPersistTaps handled",
            "keyboardShouldPersistTaps"
          ],
          "primaryMisconceptionId": "MC_MOB_KEYBOARD_AVOIDING_FORM_STATE",
          "diagnosisMap": {
            "NEVER": {
              "misconceptionId": "MC_MOB_KEYBOARD_AVOIDING_FORM_STATE",
              "errorExplanation": "'never' forces users to tap twice. Standard is: SET_KEYBOARD_SHOULD_PERSIST_TAPS_HANDLED_ON_ALL_SCROLL_VIEWS.",
              "recoveryPath": {
                "simplerExplanation": "Matches SET_KEYBOARD_SHOULD_PERSIST_TAPS_HANDLED_ON_ALL_SCROLL_VIEWS.",
                "guidedFixPrompt": "Type SET_KEYBOARD_SHOULD_PERSIST_TAPS_HANDLED_ON_ALL_SCROLL_VIEWS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Global State & Local Persistence in Mobile: Zustand & AsyncStorage / MMKV",
    "overviewMetaphor": "MMKV Is a Direct Memory-Mapped SSD in a Smartphone: Legacy AsyncStorage wrote serialized JSON strings across a slow asynchronous bridge; MMKV uses C++ mmap() system calls directly into shared flash memory, allowing Zustand stores to rehydrate instantly on cold boot in under $2\\text{ms}$.",
    "blocks": [
      {
        "id": "mobile-d10-b1-state-serializer",
        "day": 10,
        "blockNumber": 1,
        "title": "Mobile Storage: Serializing Key-Value JSON Payloads (`MOBILE_STATE_PAYLOAD_SERIALIZED_NOMINAL`)",
        "conceptBudget": {
          "primaryConcept": "Mobile Storage MMKV / AsyncStorage Key-Value Persister",
          "supportingTerms": [
            "Storage Key (`'user_session'`)",
            "Serialized JSON Payload",
            "Payload Length",
            "Status: Mobile State Payload Serialized Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d9-b1-keyboard-behavior-matcher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Mobile State Persistence Pipeline Ledger",
              "boxes": [
                {
                  "label": "Zustand State Store",
                  "value": "{ userId: 101, token: 'jwt-abc' }",
                  "varType": "RAM",
                  "isUpdated": false
                },
                {
                  "label": "MMKV C++ mmap Layer",
                  "value": "Direct memory mapping to local disk partition (2ms persistence)",
                  "varType": "Flash Disk",
                  "isUpdated": false
                },
                {
                  "label": "Serialization Status",
                  "value": "MOBILE STATE PAYLOAD SERIALIZED NOMINAL (ZERO DATA LOSS!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "storage_serialize_demo.js",
            "initialCode": "function serializeState(key, data) {\n  const str = JSON.stringify(data);\n  return {\n    storageKey: key,\n    payloadLength: str.length,\n    serializedJson: str,\n    status: 'MOBILE_STATE_PAYLOAD_SERIALIZED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(serializeState('user_session', { userId: 101, token: 'jwt-abc' })));",
            "expectedOutput": "{\"storageKey\":\"user_session\",\"payloadLength\":35,\"serializedJson\":\"{\\\"userId\\\":101,\\\"token\\\":\\\"jwt-abc\\\"}\",\"status\":\"MOBILE_STATE_PAYLOAD_SERIALIZED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms successful serialization of state data for mobile disk persistence?",
          "expectedStringOutput": "MOBILE_STATE_PAYLOAD_SERIALIZED_NOMINAL",
          "acceptableAnswers": [
            "MOBILE_STATE_PAYLOAD_SERIALIZED_NOMINAL",
            "status\":\"MOBILE_STATE_PAYLOAD_SERIALIZED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_MOB_GLOBAL_STATE_ZUSTAND_ASYNC_STORAGE",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MOB_GLOBAL_STATE_ZUSTAND_ASYNC_STORAGE",
              "errorExplanation": "Matches MOBILE_STATE_PAYLOAD_SERIALIZED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type MOBILE_STATE_PAYLOAD_SERIALIZED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d10-b2-mmkv-engine-acronym-name",
        "day": 10,
        "blockNumber": 2,
        "title": "The High-Performance Native Storage Engine: `MMKV`",
        "conceptBudget": {
          "primaryConcept": "MMKV Engine Invariant",
          "supportingTerms": [
            "`MMKV` (`WeChat's memory-mapped key-value storage framework providing synchronous, high-speed C++ storage in React Native`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d10-b1-state-serializer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Zustand with MMKV Persistence",
            "codeSnippet": "import { create } from 'zustand';\nimport { persist, createJSONStorage } from 'zustand/middleware';\nimport { MMKV } from 'react-native-mmkv';\n\nconst storage = new MMKV();\nconst mmkvStorage = {\n  setItem: (name, value) => storage.set(name, value),\n  getItem: (name) => storage.getString(name) ?? null,\n  removeItem: (name) => storage.delete(name)\n};\n\nexport const useAppStore = create(persist((set) => ({\n  theme: 'dark',\n  setTheme: (t) => set({ theme: t })\n}), { name: 'app-storage', storage: createJSONStorage(() => mmkvStorage) }));",
            "lineNotes": {
              "3": "Import MMKV high-speed engine.",
              "5": "Instant synchronous C++ storage binding.",
              "14": "Zustand persist store."
            }
          },
          {
            "type": "runnable_code",
            "filename": "mmkv_acronym_demo.js",
            "initialCode": "function getFastStorage() {\n  return 'MMKV';\n}\n\nconsole.log(getFastStorage());",
            "expectedOutput": "MMKV",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the acronym for the high-speed C++ memory-mapped mobile storage engine?",
          "expectedStringOutput": "MMKV",
          "acceptableAnswers": [
            "MMKV",
            "'MMKV'",
            "mmkv"
          ],
          "primaryMisconceptionId": "MC_MOB_GLOBAL_STATE_ZUSTAND_ASYNC_STORAGE",
          "diagnosisMap": {
            "AsyncStorage": {
              "misconceptionId": "MC_MOB_GLOBAL_STATE_ZUSTAND_ASYNC_STORAGE",
              "errorExplanation": "AsyncStorage is slow and async. The high-speed C++ engine is MMKV.",
              "recoveryPath": {
                "simplerExplanation": "Type MMKV.",
                "guidedFixPrompt": "Type MMKV"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d10-b3-synchronous-storage-advantage",
        "day": 10,
        "blockNumber": 3,
        "title": "Startup Speed: Eliminating Flash of Default State with Synchronous Storage",
        "conceptBudget": {
          "primaryConcept": "Synchronous Rehydration Invariant",
          "supportingTerms": [
            "Synchronous Rehydration (`Reading stored user session data synchronously during initial component mounting prevents visual login flashes`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d10-b2-mmkv-engine-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sync_storage_demo.js",
            "initialCode": "function getStorageAdvantageRule() {\n  return 'SYNCHRONOUS_STORAGE_PREVENTS_FLASH_OF_UNAUTHENTICATED_STATE_ON_COLD_START';\n}\n\nconsole.log(getStorageAdvantageRule());",
            "expectedOutput": "SYNCHRONOUS_STORAGE_PREVENTS_FLASH_OF_UNAUTHENTICATED_STATE_ON_COLD_START",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What visual glitch is eliminated by using synchronous local storage in mobile apps?",
          "expectedStringOutput": "SYNCHRONOUS_STORAGE_PREVENTS_FLASH_OF_UNAUTHENTICATED_STATE_ON_COLD_START",
          "acceptableAnswers": [
            "SYNCHRONOUS_STORAGE_PREVENTS_FLASH_OF_UNAUTHENTICATED_STATE_ON_COLD_START",
            "Prevent flash of unauthenticated state",
            "Flash of unauthenticated state"
          ],
          "primaryMisconceptionId": "MC_MOB_GLOBAL_STATE_ZUSTAND_ASYNC_STORAGE",
          "diagnosisMap": {
            "NO_ADVANTAGE": {
              "misconceptionId": "MC_MOB_GLOBAL_STATE_ZUSTAND_ASYNC_STORAGE",
              "errorExplanation": "Standard is: SYNCHRONOUS_STORAGE_PREVENTS_FLASH_OF_UNAUTHENTICATED_STATE_ON_COLD_START.",
              "recoveryPath": {
                "simplerExplanation": "Matches SYNCHRONOUS_STORAGE_PREVENTS_FLASH_OF_UNAUTHENTICATED_STATE_ON_COLD_START.",
                "guidedFixPrompt": "Type SYNCHRONOUS_STORAGE_PREVENTS_FLASH_OF_UNAUTHENTICATED_STATE_ON_COLD_START"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Native Device APIs: Camera & Media Library Permissions",
    "overviewMetaphor": "Mobile Hardware Permissions Are a Multi-Tier Security Gate: When the app first requests camera access, the OS asks the user (Gate 1); if the user grants it (`GRANTED`), the lens opens; if permanently denied (`DENIED`), the gate is padlocked, requiring the app to open the OS Settings app (`Linking.openSettings()`).",
    "blocks": [
      {
        "id": "mobile-d11-b1-permission-flow-evaluator",
        "day": 11,
        "blockNumber": 1,
        "title": "Hardware Permissions: Evaluating `GRANTED` vs `DENIED` with `Linking.openSettings()`",
        "conceptBudget": {
          "primaryConcept": "Mobile Hardware Permission Flow Evaluator",
          "supportingTerms": [
            "Permission Status (`'GRANTED'` vs `'DENIED'`)",
            "Can Ask Again (`true` vs `false`)",
            "Action Required (`'REDIRECT_TO_SYSTEM_SETTINGS'`)",
            "Status: Permission Granted Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d10-b1-state-serializer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Native Hardware Permission State Machine Ledger",
              "boxes": [
                {
                  "label": "Status: GRANTED",
                  "value": "canAccessHardware = true -> action: 'PROCEED_CAMERA_CAPTURE'",
                  "varType": "Granted",
                  "isUpdated": false
                },
                {
                  "label": "Status: DENIED (canAsk: false)",
                  "value": "canAccessHardware = false -> action: 'REDIRECT_TO_SYSTEM_SETTINGS'",
                  "varType": "Permanent Denial",
                  "isUpdated": false
                },
                {
                  "label": "Flow Resolution",
                  "value": "PERMISSION FLOW EVALUATED NOMINAL (SECURITY BOUNDARIES RESPECTED!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "permission_flow_demo.js",
            "initialCode": "function evalPermission(status, canAsk) {\n  if (status === 'GRANTED') return { canAccess: true, action: 'PROCEED_CAMERA_CAPTURE', status: 'PERMISSION_GRANTED_NOMINAL' };\n  if (canAsk) return { canAccess: false, action: 'REQUEST_PERMISSION_DIALOG', status: 'PERMISSION_PENDING_REQUEST' };\n  return { canAccess: false, action: 'REDIRECT_TO_SYSTEM_SETTINGS', status: 'PERMISSION_DENIED_PERMANENTLY' };\n}\n\nconsole.log(JSON.stringify(evalPermission('GRANTED', false)));\nconsole.log(JSON.stringify(evalPermission('DENIED', false)));",
            "expectedOutput": "{\"canAccess\":true,\"action\":\"PROCEED_CAMERA_CAPTURE\",\"status\":\"PERMISSION_GRANTED_NOMINAL\"}\n{\"canAccess\":false,\"action\":\"REDIRECT_TO_SYSTEM_SETTINGS\",\"status\":\"PERMISSION_DENIED_PERMANENTLY\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is triggered when hardware permission is permanently denied and cannot be requested again?",
          "expectedStringOutput": "REDIRECT_TO_SYSTEM_SETTINGS",
          "acceptableAnswers": [
            "REDIRECT_TO_SYSTEM_SETTINGS",
            "action\":\"REDIRECT_TO_SYSTEM_SETTINGS\"",
            "Redirect to system settings"
          ],
          "primaryMisconceptionId": "MC_MOB_CAMERA_MEDIA_LIBRARY_PERMISSIONS",
          "diagnosisMap": {
            "CRASH_APP": {
              "misconceptionId": "MC_MOB_CAMERA_MEDIA_LIBRARY_PERMISSIONS",
              "errorExplanation": "Apps must gracefully direct users to settings: REDIRECT_TO_SYSTEM_SETTINGS.",
              "recoveryPath": {
                "simplerExplanation": "Action is REDIRECT_TO_SYSTEM_SETTINGS.",
                "guidedFixPrompt": "Type REDIRECT_TO_SYSTEM_SETTINGS"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d11-b2-open-settings-method-name",
        "day": 11,
        "blockNumber": 2,
        "title": "The System Settings Linking API: `Linking.openSettings`",
        "conceptBudget": {
          "primaryConcept": "`Linking.openSettings` Invariant",
          "supportingTerms": [
            "`Linking.openSettings()` (`Opens the native iOS/Android system settings page for the current application so the user can manually enable camera/location permissions`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d11-b1-permission-flow-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Settings Redirection Syntax",
            "codeSnippet": "import { Linking, Alert } from 'react-native';\n\nfunction promptUserSettings() {\n  Alert.alert(\n    'Camera Permission Required',\n    'Please enable camera access in your device settings to take profile photos.',\n    [\n      { text: 'Cancel', style: 'cancel' },\n      { text: 'Open Settings', onPress: () => Linking.openSettings() }\n    ]\n  );\n}",
            "lineNotes": {
              "1": "Import Linking API.",
              "8": "Linking.openSettings() jumps directly into app permissions in iOS/Android Settings."
            }
          },
          {
            "type": "runnable_code",
            "filename": "open_settings_demo.js",
            "initialCode": "function getSettingsMethod() {\n  return 'Linking.openSettings';\n}\n\nconsole.log(getSettingsMethod());",
            "expectedOutput": "Linking.openSettings",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What React Native API opens the OS settings page for the running app?",
          "expectedStringOutput": "Linking.openSettings",
          "acceptableAnswers": [
            "Linking.openSettings",
            "Linking.openSettings()",
            "'Linking.openSettings'"
          ],
          "primaryMisconceptionId": "MC_MOB_CAMERA_MEDIA_LIBRARY_PERMISSIONS",
          "diagnosisMap": {
            "Settings.open": {
              "misconceptionId": "MC_MOB_CAMERA_MEDIA_LIBRARY_PERMISSIONS",
              "errorExplanation": "The React Native standard API is Linking.openSettings().",
              "recoveryPath": {
                "simplerExplanation": "Type Linking.openSettings.",
                "guidedFixPrompt": "Type Linking.openSettings"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d11-b3-image-compression-before-upload",
        "day": 11,
        "blockNumber": 3,
        "title": "Network Performance: Compressing Camera Images ($0.7$ Quality) Before Upload",
        "conceptBudget": {
          "primaryConcept": "Image Compression Invariant",
          "supportingTerms": [
            "Image Compression (`Compressing raw 12MB photos to ~400KB with 0.7 quality saves user mobile data and reduces backend S3 storage costs by 95%`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d11-b2-open-settings-method-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "image_compress_demo.js",
            "initialCode": "function getImageCompressionRule() {\n  return 'COMPRESS_CAMERA_CAPTURES_TO_REDUCE_UPLOAD_LATENCY_AND_BANDWIDTH';\n}\n\nconsole.log(getImageCompressionRule());",
            "expectedOutput": "COMPRESS_CAMERA_CAPTURES_TO_REDUCE_UPLOAD_LATENCY_AND_BANDWIDTH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why should mobile applications compress camera images before network upload?",
          "expectedStringOutput": "COMPRESS_CAMERA_CAPTURES_TO_REDUCE_UPLOAD_LATENCY_AND_BANDWIDTH",
          "acceptableAnswers": [
            "COMPRESS_CAMERA_CAPTURES_TO_REDUCE_UPLOAD_LATENCY_AND_BANDWIDTH",
            "Reduce upload latency and bandwidth",
            "Compress camera captures"
          ],
          "primaryMisconceptionId": "MC_MOB_CAMERA_MEDIA_LIBRARY_PERMISSIONS",
          "diagnosisMap": {
            "RAW_12MB": {
              "misconceptionId": "MC_MOB_CAMERA_MEDIA_LIBRARY_PERMISSIONS",
              "errorExplanation": "Raw images drain battery. Standard is: COMPRESS_CAMERA_CAPTURES_TO_REDUCE_UPLOAD_LATENCY_AND_BANDWIDTH.",
              "recoveryPath": {
                "simplerExplanation": "Matches COMPRESS_CAMERA_CAPTURES_TO_REDUCE_UPLOAD_LATENCY_AND_BANDWIDTH.",
                "guidedFixPrompt": "Type COMPRESS_CAMERA_CAPTURES_TO_REDUCE_UPLOAD_LATENCY_AND_BANDWIDTH"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Native Geolocation & Maps: Foreground vs Background GPS Tracking",
    "overviewMetaphor": "Mobile GPS Filtering Is a High-Precision Surveying Tool: A raw GPS chip often reports rough cell tower triangulation ($150\\text{m}$ error circle); setting an accuracy threshold ($le 20\\text{m}$) filters out noisy approximations so map markers drop exactly onto the user's real building doorstep.",
    "blocks": [
      {
        "id": "mobile-d12-b1-gps-filter-evaluator",
        "day": 12,
        "blockNumber": 1,
        "title": "Geolocation: Filtering High-Accuracy GPS Coordinates ($8.5\\text{m} \\le 20\\text{m}$ Passing)",
        "conceptBudget": {
          "primaryConcept": "GPS Coordinate Distance & Accuracy Filter",
          "supportingTerms": [
            "Reported Accuracy ($8.5\\text{m}$ vs $150\\text{m}$)",
            "Accuracy Ceiling ($20\\text{m}$)",
            "Fix Acceptance Status",
            "Status: GPS Location Fix Accepted Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d11-b1-permission-flow-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "GPS Accuracy Filtering Ledger",
              "boxes": [
                {
                  "label": "Hardware Fix A",
                  "value": "accuracy: 8.5m <= 20m threshold -> Fix ACCEPTED (NOMINAL!)",
                  "varType": "Accurate Fix",
                  "isUpdated": true
                },
                {
                  "label": "Hardware Fix B",
                  "value": "accuracy: 150m > 20m threshold -> Cell tower noise DISCARDED",
                  "varType": "Inaccurate Fix",
                  "isUpdated": false
                },
                {
                  "label": "Filter Status",
                  "value": "GPS LOCATION FIX ACCEPTED NOMINAL (PRECISION MAPPING VERIFIED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gps_filter_demo.js",
            "initialCode": "function filterGps(acc, maxAllowed) {\n  const ok = acc <= maxAllowed;\n  return {\n    accuracyMeters: acc,\n    isFixAccepted: ok,\n    status: ok ? 'GPS_LOCATION_FIX_ACCEPTED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(filterGps(8.5, 20)));\nconsole.log(JSON.stringify(filterGps(150, 20)));",
            "expectedOutput": "{\"accuracyMeters\":8.5,\"isFixAccepted\":true,\"status\":\"GPS_LOCATION_FIX_ACCEPTED_NOMINAL\"}\n{\"accuracyMeters\":150,\"isFixAccepted\":false,\"status\":\"DEFECT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a GPS coordinate meets the 20m accuracy precision threshold?",
          "expectedStringOutput": "GPS_LOCATION_FIX_ACCEPTED_NOMINAL",
          "acceptableAnswers": [
            "GPS_LOCATION_FIX_ACCEPTED_NOMINAL",
            "status\":\"GPS_LOCATION_FIX_ACCEPTED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_MOB_GEOLOCATION_MAPS_TRACKING",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MOB_GEOLOCATION_MAPS_TRACKING",
              "errorExplanation": "8.5m is within 20m: GPS_LOCATION_FIX_ACCEPTED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type GPS_LOCATION_FIX_ACCEPTED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d12-b2-standard-gps-accuracy-number",
        "day": 12,
        "blockNumber": 2,
        "title": "The Standard High-Accuracy GPS Threshold: 20 Meters",
        "conceptBudget": {
          "primaryConcept": "20 Meter Accuracy Invariant",
          "supportingTerms": [
            "20 Meter Threshold (`The standard maximum acceptable horizontal accuracy radius for interactive map positioning and navigation routing`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d12-b1-gps-filter-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "expo-location High Accuracy",
            "codeSnippet": "import * as Location from 'expo-location';\n\nconst location = await Location.getCurrentPositionAsync({\n  accuracy: Location.Accuracy.High,\n  timeInterval: 5000\n});\nconsole.log(location.coords.accuracy); // <= 20 meters",
            "lineNotes": {
              "3": "Location.Accuracy.High activates GPS satellite receiver.",
              "6": "coords.accuracy returns horizontal error radius in meters."
            }
          },
          {
            "type": "runnable_code",
            "filename": "gps_threshold_demo.js",
            "initialCode": "function getGpsThreshold() {\n  return 20;\n}\n\nconsole.log(getGpsThreshold());",
            "expectedOutput": "20",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the standard maximum horizontal accuracy threshold in meters for accepting a GPS fix?",
          "expectedStringOutput": "20",
          "acceptableAnswers": [
            "20",
            "20m",
            "20 meters",
            "twenty"
          ],
          "primaryMisconceptionId": "MC_MOB_GEOLOCATION_MAPS_TRACKING",
          "diagnosisMap": {
            "500": {
              "misconceptionId": "MC_MOB_GEOLOCATION_MAPS_TRACKING",
              "errorExplanation": "500m is half a kilometer away. High accuracy threshold is 20m.",
              "recoveryPath": {
                "simplerExplanation": "Type 20.",
                "guidedFixPrompt": "Type 20"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d12-b3-battery-drain-gps-management",
        "day": 12,
        "blockNumber": 3,
        "title": "Battery Protection: Disabling Continuous GPS Polling When Inactive",
        "conceptBudget": {
          "primaryConcept": "GPS Power Invariant",
          "supportingTerms": [
            "GPS Power Management (`Continuous GPS satellite hardware polling will drain a smartphone battery in 2 hours; always stop location subscriptions on unmount`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d12-b2-standard-gps-accuracy-number",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gps_power_demo.js",
            "initialCode": "function getGpsPowerRule() {\n  return 'REMOVE_LOCATION_WATCH_SUBSCRIPTIONS_ON_COMPONENT_UNMOUNT_TO_PRESERVE_BATTERY';\n}\n\nconsole.log(getGpsPowerRule());",
            "expectedOutput": "REMOVE_LOCATION_WATCH_SUBSCRIPTIONS_ON_COMPONENT_UNMOUNT_TO_PRESERVE_BATTERY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why must location subscription watchers be explicitly removed when a map screen unmounts?",
          "expectedStringOutput": "REMOVE_LOCATION_WATCH_SUBSCRIPTIONS_ON_COMPONENT_UNMOUNT_TO_PRESERVE_BATTERY",
          "acceptableAnswers": [
            "REMOVE_LOCATION_WATCH_SUBSCRIPTIONS_ON_COMPONENT_UNMOUNT_TO_PRESERVE_BATTERY",
            "Preserve battery",
            "Remove location subscriptions to save battery"
          ],
          "primaryMisconceptionId": "MC_MOB_GEOLOCATION_MAPS_TRACKING",
          "diagnosisMap": {
            "KEEP_RUNNING": {
              "misconceptionId": "MC_MOB_GEOLOCATION_MAPS_TRACKING",
              "errorExplanation": "Leaving GPS on drains power rapidly. Standard is: REMOVE_LOCATION_WATCH_SUBSCRIPTIONS_ON_COMPONENT_UNMOUNT_TO_PRESERVE_BATTERY.",
              "recoveryPath": {
                "simplerExplanation": "Matches REMOVE_LOCATION_WATCH_SUBSCRIPTIONS_ON_COMPONENT_UNMOUNT_TO_PRESERVE_BATTERY.",
                "guidedFixPrompt": "Type REMOVE_LOCATION_WATCH_SUBSCRIPTIONS_ON_COMPONENT_UNMOUNT_TO_PRESERVE_BATTERY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Native Biometrics Authentication: FaceID, TouchID & Biometric Keys",
    "overviewMetaphor": "Biometric Authentication Is an Optical Retina Scanner on a Safe: It checks that the hardware scanner is physically present (`hasHardware`), verifies that the user's face is enrolled in the vault registry (`isEnrolled`), and unlocks the safe with FaceID without transmitting sensitive passwords over the network (`BIOMETRIC_AUTHENTICATION_READY_NOMINAL`).",
    "blocks": [
      {
        "id": "mobile-d13-b1-biometric-readiness-auditor",
        "day": 13,
        "blockNumber": 1,
        "title": "Biometrics: Auditing Hardware Availability, Enrollment & `FaceID` Support",
        "conceptBudget": {
          "primaryConcept": "Biometric Authentication Capability Auditor",
          "supportingTerms": [
            "Hardware Available (`true`)",
            "Biometrics Enrolled (`true`)",
            "Supported Types (`['FACIAL_RECOGNITION']`)",
            "Status: Biometric Authentication Ready Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d12-b1-gps-filter-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Native Biometrics Authentication Ledger",
              "boxes": [
                {
                  "label": "hasHardwareAsync()",
                  "value": "true (Secure Enclave / Biometric sensor present)",
                  "varType": "Hardware",
                  "isUpdated": false
                },
                {
                  "label": "isEnrolledAsync()",
                  "value": "true (User has scanned Face or Fingerprint in OS)",
                  "varType": "Enrolled",
                  "isUpdated": false
                },
                {
                  "label": "Audit Readiness",
                  "value": "BIOMETRIC AUTHENTICATION READY NOMINAL (INSTANT LOGIN!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "biometrics_demo.js",
            "initialCode": "function auditBio(hw, enrolled, types) {\n  const ok = hw && enrolled && Array.isArray(types) && types.length > 0;\n  return {\n    hardwareAvailable: hw,\n    isBiometricsReady: ok,\n    status: ok ? 'BIOMETRIC_AUTHENTICATION_READY_NOMINAL' : 'BIOMETRIC_UNAVAILABLE'\n  };\n}\n\nconsole.log(JSON.stringify(auditBio(true, true, ['FACIAL_RECOGNITION'])));\nconsole.log(JSON.stringify(auditBio(true, false, ['FINGERPRINT'])));",
            "expectedOutput": "{\"hardwareAvailable\":true,\"isBiometricsReady\":true,\"status\":\"BIOMETRIC_AUTHENTICATION_READY_NOMINAL\"}\n{\"hardwareAvailable\":true,\"isBiometricsReady\":false,\"status\":\"BIOMETRIC_UNAVAILABLE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that biometric authentication is fully configured and ready for user login?",
          "expectedStringOutput": "BIOMETRIC_AUTHENTICATION_READY_NOMINAL",
          "acceptableAnswers": [
            "BIOMETRIC_AUTHENTICATION_READY_NOMINAL",
            "status\":\"BIOMETRIC_AUTHENTICATION_READY_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_MOB_BIOMETRIC_AUTHENTICATION_FACEID",
          "diagnosisMap": {
            "BIOMETRIC_UNAVAILABLE": {
              "misconceptionId": "MC_MOB_BIOMETRIC_AUTHENTICATION_FACEID",
              "errorExplanation": "Matches BIOMETRIC_AUTHENTICATION_READY_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type BIOMETRIC_AUTHENTICATION_READY_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d13-b2-apple-biometric-faceid-name",
        "day": 13,
        "blockNumber": 2,
        "title": "The Apple Facial Recognition Brand Name: `FaceID`",
        "conceptBudget": {
          "primaryConcept": "FaceID Invariant",
          "supportingTerms": [
            "`FaceID` (`Apple's hardware facial recognition technology powered by the TrueDepth camera and Secure Enclave`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d13-b1-biometric-readiness-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "expo-local-authentication Setup",
            "codeSnippet": "import * as LocalAuthentication from 'expo-local-authentication';\n\nconst result = await LocalAuthentication.authenticateAsync({\n  promptMessage: 'Unlock PinIT Career OS with FaceID',\n  fallbackLabel: 'Use Device Passcode'\n});\nif (result.success) {\n  console.log('Login verified via FaceID!');\n}",
            "lineNotes": {
              "3": "authenticateAsync prompts native system biometric sheet.",
              "7": "result.success confirms biometric signature."
            }
          },
          {
            "type": "runnable_code",
            "filename": "faceid_name_demo.js",
            "initialCode": "function getFaceIdName() {\n  return 'FaceID';\n}\n\nconsole.log(getFaceIdName());",
            "expectedOutput": "FaceID",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the official brand name of Apple's biometric facial recognition technology?",
          "expectedStringOutput": "FaceID",
          "acceptableAnswers": [
            "FaceID",
            "Face ID",
            "'FaceID'"
          ],
          "primaryMisconceptionId": "MC_MOB_BIOMETRIC_AUTHENTICATION_FACEID",
          "diagnosisMap": {
            "TouchID": {
              "misconceptionId": "MC_MOB_BIOMETRIC_AUTHENTICATION_FACEID",
              "errorExplanation": "TouchID is fingerprint scanning. Facial recognition is FaceID.",
              "recoveryPath": {
                "simplerExplanation": "Type FaceID.",
                "guidedFixPrompt": "Type FaceID"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d13-b3-device-pin-fallback-invariant",
        "day": 13,
        "blockNumber": 3,
        "title": "Biometric Fallback: Always Providing Fallback to Device Passcode / PIN",
        "conceptBudget": {
          "primaryConcept": "Passcode Fallback Invariant",
          "supportingTerms": [
            "Passcode Fallback (`If a user is wearing a face mask or has a wet thumb, the system must provide immediate fallback to the device PIN to prevent account lockout`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d13-b2-apple-biometric-faceid-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "passcode_fallback_demo.js",
            "initialCode": "function getBiometricFallbackRule() {\n  return 'ALWAYS_PROVIDE_FALLBACK_TO_DEVICE_PASSCODE_FOR_BIOMETRIC_AUTHENTICATION';\n}\n\nconsole.log(getBiometricFallbackRule());",
            "expectedOutput": "ALWAYS_PROVIDE_FALLBACK_TO_DEVICE_PASSCODE_FOR_BIOMETRIC_AUTHENTICATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What fallback mechanism must always accompany biometric authentication in mobile apps?",
          "expectedStringOutput": "ALWAYS_PROVIDE_FALLBACK_TO_DEVICE_PASSCODE_FOR_BIOMETRIC_AUTHENTICATION",
          "acceptableAnswers": [
            "ALWAYS_PROVIDE_FALLBACK_TO_DEVICE_PASSCODE_FOR_BIOMETRIC_AUTHENTICATION",
            "Fallback to device passcode",
            "Device PIN fallback"
          ],
          "primaryMisconceptionId": "MC_MOB_BIOMETRIC_AUTHENTICATION_FACEID",
          "diagnosisMap": {
            "NO_FALLBACK": {
              "misconceptionId": "MC_MOB_BIOMETRIC_AUTHENTICATION_FACEID",
              "errorExplanation": "Biometrics can fail sensor checks. Standard is: ALWAYS_PROVIDE_FALLBACK_TO_DEVICE_PASSCODE_FOR_BIOMETRIC_AUTHENTICATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches ALWAYS_PROVIDE_FALLBACK_TO_DEVICE_PASSCODE_FOR_BIOMETRIC_AUTHENTICATION.",
                "guidedFixPrompt": "Type ALWAYS_PROVIDE_FALLBACK_TO_DEVICE_PASSCODE_FOR_BIOMETRIC_AUTHENTICATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Offline-First Storage & Local SQLite: Migrations & Optimistic Sync",
    "overviewMetaphor": "Local SQLite Schema Versioning Is a Building Permit Inspector: When the app launches, the inspector checks the SQLite database version stamp (`PRAGMA user_version`); if the disk has version 1 and the new code requires version 3, the inspector executes migrations 2 and 3 sequentially before granting app access.",
    "blocks": [
      {
        "id": "mobile-d14-b1-sqlite-migration-resolver",
        "day": 14,
        "blockNumber": 1,
        "title": "Local SQLite: Resolving Database Schema Migrations ($v1 \\to v3 = 2$ Steps)",
        "conceptBudget": {
          "primaryConcept": "SQLite Schema Migration Version Resolver",
          "supportingTerms": [
            "Current DB Version ($1$)",
            "Target App Version ($3$)",
            "Migration Steps Count ($2$ steps)",
            "Status: SQLite Schema Migration Required"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "design-d13-b1-biometric-readiness-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Local SQLite Database Migration Ledger",
              "boxes": [
                {
                  "label": "PRAGMA user_version",
                  "value": "Current on-device DB version = 1",
                  "varType": "Current Version",
                  "isUpdated": false
                },
                {
                  "label": "App Target Schema",
                  "value": "Target schema version = 3 (Requires 2 migrations)",
                  "varType": "Target Version",
                  "isUpdated": false
                },
                {
                  "label": "Migration Resolver",
                  "value": "SQLITE SCHEMA MIGRATION REQUIRED (2 STEPS PENDING NOMINAL!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sqlite_migration_demo.js",
            "initialCode": "function resolveMigration(curr, target) {\n  const needs = curr < target;\n  return {\n    currentDbVersion: curr,\n    targetAppVersion: target,\n    requiresMigration: needs,\n    migrationStepsCount: Math.max(0, target - curr),\n    status: needs ? 'SQLITE_SCHEMA_MIGRATION_REQUIRED' : 'SQLITE_SCHEMA_UP_TO_DATE_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(resolveMigration(1, 3)));\nconsole.log(JSON.stringify(resolveMigration(3, 3)));",
            "expectedOutput": "{\"currentDbVersion\":1,\"targetAppVersion\":3,\"requiresMigration\":true,\"migrationStepsCount\":2,\"status\":\"SQLITE_SCHEMA_MIGRATION_REQUIRED\"}\n{\"currentDbVersion\":3,\"targetAppVersion\":3,\"requiresMigration\":false,\"migrationStepsCount\":0,\"status\":\"SQLITE_SCHEMA_UP_TO_DATE_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many schema migration steps must execute when current DB is version 1 and target is version 3?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "migrationStepsCount\":2",
            "2 steps",
            "two"
          ],
          "primaryMisconceptionId": "MC_MOB_OFFLINE_FIRST_SQLITE_STORAGE",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_MOB_OFFLINE_FIRST_SQLITE_STORAGE",
              "errorExplanation": "3 - 1 = 2 migration steps (v1->v2 and v2->v3).",
              "recoveryPath": {
                "simplerExplanation": "Steps count is 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d14-b2-sqlite-version-pragma-name",
        "day": 14,
        "blockNumber": 2,
        "title": "The SQLite User Version Query: `PRAGMA user_version`",
        "conceptBudget": {
          "primaryConcept": "`PRAGMA user_version` Invariant",
          "supportingTerms": [
            "`PRAGMA user_version` (`The built-in SQLite integer register used to track and store schema migration version numbers`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d14-b1-sqlite-migration-resolver",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SQLite Version PRAGMA",
            "codeSnippet": "// Read current database version:\nconst [{ user_version }] = await db.getAllAsync('PRAGMA user_version');\n\n// Update version after running migration SQL:\nawait db.execAsync('PRAGMA user_version = 3;');",
            "lineNotes": {
              "2": "Reads user_version integer.",
              "5": "Atomically updates schema version."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sqlite_pragma_demo.js",
            "initialCode": "function getPragma() {\n  return 'PRAGMA user_version';\n}\n\nconsole.log(getPragma());",
            "expectedOutput": "PRAGMA user_version",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What SQLite PRAGMA statement is used to read and update schema migration version numbers?",
          "expectedStringOutput": "PRAGMA user_version",
          "acceptableAnswers": [
            "PRAGMA user_version",
            "'PRAGMA user_version'",
            "user_version"
          ],
          "primaryMisconceptionId": "MC_MOB_OFFLINE_FIRST_SQLITE_STORAGE",
          "diagnosisMap": {
            "PRAGMA schema_version": {
              "misconceptionId": "MC_MOB_OFFLINE_FIRST_SQLITE_STORAGE",
              "errorExplanation": "schema_version is reserved for internal SQLite engine tables. User migrations use PRAGMA user_version.",
              "recoveryPath": {
                "simplerExplanation": "Type PRAGMA user_version.",
                "guidedFixPrompt": "Type PRAGMA user_version"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d14-b3-optimistic-ui-updates",
        "day": 14,
        "blockNumber": 3,
        "title": "Offline UX: Optimistic UI Updates with Local SQLite Synchronization",
        "conceptBudget": {
          "primaryConcept": "Optimistic UI Invariant",
          "supportingTerms": [
            "Optimistic UI (`Instantly writing changes to local SQLite and updating UI immediately, syncing with cloud backend in the background`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d14-b2-sqlite-version-pragma-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "optimistic_ui_demo.js",
            "initialCode": "function getOptimisticUiRule() {\n  return 'UPDATE_LOCAL_SQLITE_AND_UI_INSTANTLY_THEN_SYNC_BACKGROUND_CHANGES_TO_SERVER';\n}\n\nconsole.log(getOptimisticUiRule());",
            "expectedOutput": "UPDATE_LOCAL_SQLITE_AND_UI_INSTANTLY_THEN_SYNC_BACKGROUND_CHANGES_TO_SERVER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do offline-first mobile apps achieve zero perceived UI latency when creating or editing data?",
          "expectedStringOutput": "UPDATE_LOCAL_SQLITE_AND_UI_INSTANTLY_THEN_SYNC_BACKGROUND_CHANGES_TO_SERVER",
          "acceptableAnswers": [
            "UPDATE_LOCAL_SQLITE_AND_UI_INSTANTLY_THEN_SYNC_BACKGROUND_CHANGES_TO_SERVER",
            "Optimistic UI updates",
            "Update local SQLite instantly"
          ],
          "primaryMisconceptionId": "MC_MOB_OFFLINE_FIRST_SQLITE_STORAGE",
          "diagnosisMap": {
            "WAIT_FOR_SERVER": {
              "misconceptionId": "MC_MOB_OFFLINE_FIRST_SQLITE_STORAGE",
              "errorExplanation": "Waiting for server causes lag in weak network. Standard is: UPDATE_LOCAL_SQLITE_AND_UI_INSTANTLY_THEN_SYNC_BACKGROUND_CHANGES_TO_SERVER.",
              "recoveryPath": {
                "simplerExplanation": "Matches UPDATE_LOCAL_SQLITE_AND_UI_INSTANTLY_THEN_SYNC_BACKGROUND_CHANGES_TO_SERVER.",
                "guidedFixPrompt": "Type UPDATE_LOCAL_SQLITE_AND_UI_INSTANTLY_THEN_SYNC_BACKGROUND_CHANGES_TO_SERVER"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Offline-First SQLite, AsyncStorage & Native Biometric Auth Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete intermediate native device integration engine: 1. Asset URI source classification; 2. Stack navigation route parameter validation; 3. Tab bar badge formatting; 4. Keyboard avoiding behavior matching; 5. Biometric readiness auditing; 6. SQLite schema migration resolution.",
    "blocks": [
      {
        "id": "mobile-d15-b1-native-capabilities-master-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Native Capabilities Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Native Capabilities Master Engine",
          "supportingTerms": [
            "Asset Classification Subsystem",
            "Stack Navigation Subsystem",
            "Tab Badge Subsystem",
            "Keyboard Avoiding Subsystem",
            "Biometrics Subsystem",
            "SQLite Subsystem"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d14-b3-optimistic-ui-updates",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 Native Capabilities Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Classifies local bundled image assets & validates typed navigation routes",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Formats overflow notification tab badges & resolves keyboard avoidance",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Audits hardware FaceID biometrics & executes SQLite schema migrations",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Activates Native Capabilities Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "native_kernel_demo.js",
            "initialCode": "function runNativeMaster() {\n  return {\n    assetsSubsystem: 'ONLINE_ASSET_BUNDLER_ACTIVE',\n    navigationSubsystem: 'ONLINE_STACK_ROUTER_ACTIVE',\n    tabSubsystem: 'ONLINE_BADGE_FORMATTER_ACTIVE',\n    keyboardSubsystem: 'ONLINE_AVOIDANCE_MATCHER_ACTIVE',\n    biometricsSubsystem: 'ONLINE_FACEID_ACTIVE',\n    sqliteSubsystem: 'ONLINE_MIGRATIONS_ACTIVE',\n    engineStatus: 'NATIVE_CAPABILITIES_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runNativeMaster().engineStatus);",
            "expectedOutput": "NATIVE_CAPABILITIES_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Native Capabilities Master Engine?",
          "expectedStringOutput": "NATIVE_CAPABILITIES_MASTER_ACTIVE",
          "acceptableAnswers": [
            "NATIVE_CAPABILITIES_MASTER_ACTIVE",
            "engineStatus: NATIVE_CAPABILITIES_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS",
              "errorExplanation": "Matches NATIVE_CAPABILITIES_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type NATIVE_CAPABILITIES_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d15-b2-native-capabilities-engine-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Native Capabilities Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Native Capabilities Invariant Verification",
          "supportingTerms": [
            "Navigation Invariant",
            "SQLite Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d15-b1-native-capabilities-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "native_audit_demo.js",
            "initialCode": "function auditNative(a, n, t, k, b, s) {\n  const passed = a && n && t && k && b && s;\n  return {\n    assetsVerified: a,\n    navigationVerified: n,\n    tabVerified: t,\n    keyboardVerified: k,\n    biometricsVerified: b,\n    sqliteVerified: s,\n    grade: passed ? 'NATIVE_CAPABILITIES_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditNative(true, true, true, true, true, true)));",
            "expectedOutput": "{\"assetsVerified\":true,\"navigationVerified\":true,\"tabVerified\":true,\"keyboardVerified\":true,\"biometricsVerified\":true,\"sqliteVerified\":true,\"grade\":\"NATIVE_CAPABILITIES_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Assets, Navigation, Tabs, Keyboards, Biometrics, and SQLite pass 100%?",
          "expectedStringOutput": "NATIVE_CAPABILITIES_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "NATIVE_CAPABILITIES_ENGINE_AUDIT_PASSED",
            "grade\":\"NATIVE_CAPABILITIES_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS",
              "errorExplanation": "All checks passing awards NATIVE_CAPABILITIES_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards NATIVE_CAPABILITIES_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type NATIVE_CAPABILITIES_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d15-b3-milestone2-mobile-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Native Capabilities Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Native Capabilities Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d15-b2-native-capabilities-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_mobile_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Offline-First SQLite, AsyncStorage & Native Biometric Auth Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Offline-First SQLite, AsyncStorage & Native Biometric Auth Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Offline-First SQLite, AsyncStorage & Native Biometric Auth Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Offline-First SQLite, AsyncStorage & Native Biometric Auth Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_MOB_REACT_NAVIGATION_STACK_TRANSITIONS",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Offline-First SQLite, AsyncStorage & Native Biometric Auth Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Reanimated 3: Shared Values, Worklets & UI Thread Animations",
    "overviewMetaphor": "Reanimated 3 Worklets Are On-Chip Coprocessors: Instead of asking the JavaScript thread to calculate 120 animation frames per second across a crowded bridge, `useSharedValue` loads the animation physics (`withSpring`) directly into the GPU UI thread worklet coprocessor (`'worklet'`), guaranteeing zero stutter even during heavy data fetching.",
    "blocks": [
      {
        "id": "mobile-d16-b1-spring-physics-calculator",
        "day": 16,
        "blockNumber": 1,
        "title": "Spring Physics: Calculating Damping Ratio $\\zeta = \\frac{c}{2 \\sqrt{m \\cdot k}}$ ($0.5$ Under-Damped Bouncy)",
        "conceptBudget": {
          "primaryConcept": "Reanimated 3 Spring Physics Damping Ratio Calculator",
          "supportingTerms": [
            "Damping Coefficient ($c = 10$)",
            "Mass ($m = 1$)",
            "Stiffness ($k = 100$)",
            "Damping Ratio ($\\zeta = 0.5$)",
            "Status: Spring Physics Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d15-b1-native-capabilities-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Reanimated 3 Spring Damping Physics Ledger",
              "boxes": [
                {
                  "label": "Spring Parameters",
                  "value": "damping: 10, mass: 1, stiffness: 100",
                  "varType": "Params",
                  "isUpdated": false
                },
                {
                  "label": "Critical Damping (2*sqrt(m*k))",
                  "value": "2 * sqrt(1 * 100) = 2 * 10 = 20",
                  "varType": "Critical",
                  "isUpdated": false
                },
                {
                  "label": "Damping Ratio Zeta",
                  "value": "10 / 20 = 0.5 < 1.0 (BOUNCY SPRING NOMINAL!)",
                  "varType": "Zeta",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "spring_physics_demo.js",
            "initialCode": "function calcSpringZeta(c, m, k) {\n  const crit = 2 * Math.sqrt(m * k);\n  const zeta = Number((c / crit).toFixed(2));\n  const bouncy = zeta < 1.0;\n  return {\n    dampingRatioZeta: zeta,\n    isUnderDampedBouncy: bouncy,\n    status: 'SPRING_PHYSICS_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcSpringZeta(10, 1, 100)));\nconsole.log(JSON.stringify(calcSpringZeta(20, 1, 100)));",
            "expectedOutput": "{\"dampingRatioZeta\":0.5,\"isUnderDampedBouncy\":true,\"status\":\"SPRING_PHYSICS_CALCULATED_NOMINAL\"}\n{\"dampingRatioZeta\":1,\"isUnderDampedBouncy\":false,\"status\":\"SPRING_PHYSICS_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the damping ratio zeta for a spring with damping 10, mass 1, and stiffness 100?",
          "expectedStringOutput": "0.5",
          "acceptableAnswers": [
            "0.5",
            "dampingRatioZeta\":0.5",
            "0.50"
          ],
          "primaryMisconceptionId": "MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS",
          "diagnosisMap": {
            "1.0": {
              "misconceptionId": "MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS",
              "errorExplanation": "10 / (2 * sqrt(100)) = 10 / 20 = 0.5.",
              "recoveryPath": {
                "simplerExplanation": "Ratio is 0.5.",
                "guidedFixPrompt": "Type 0.5"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d16-b2-worklet-directive-name",
        "day": 16,
        "blockNumber": 2,
        "title": "The UI Thread Function Directive: `'worklet'`",
        "conceptBudget": {
          "primaryConcept": "`'worklet'` Directive Invariant",
          "supportingTerms": [
            "`'worklet'` (`The string directive placed at the top of a JS function signaling Reanimated to compile and execute it directly on the 120 FPS UI thread`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d16-b1-spring-physics-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Reanimated 3 Worklet Syntax",
            "codeSnippet": "import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';\n\nfunction AnimatedCard() {\n  const scale = useSharedValue(1);\n\n  const animatedStyle = useAnimatedStyle(() => {\n    'worklet'; // Runs synchronously on the UI Thread!\n    return { transform: [{ scale: scale.value }] };\n  });\n}",
            "lineNotes": {
              "4": "useSharedValue holds thread-safe animation value.",
              "7": "'worklet' directive executes style calculation directly on UI thread."
            }
          },
          {
            "type": "runnable_code",
            "filename": "worklet_directive_demo.js",
            "initialCode": "function getWorklet() {\n  return 'worklet';\n}\n\nconsole.log(getWorklet());",
            "expectedOutput": "worklet",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What string directive marks a function for execution on the UI thread in Reanimated?",
          "expectedStringOutput": "worklet",
          "acceptableAnswers": [
            "worklet",
            "'worklet'",
            "worklet directive"
          ],
          "primaryMisconceptionId": "MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS",
          "diagnosisMap": {
            "use worklet": {
              "misconceptionId": "MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS",
              "errorExplanation": "The exact Reanimated directive is 'worklet'.",
              "recoveryPath": {
                "simplerExplanation": "Type worklet.",
                "guidedFixPrompt": "Type worklet"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d16-b3-shared-value-thread-safety",
        "day": 16,
        "blockNumber": 3,
        "title": "Thread Safety: Modifying `.value` on Shared Values Without React State Re-renders",
        "conceptBudget": {
          "primaryConcept": "Shared Value Invariant",
          "supportingTerms": [
            "`useSharedValue` (`Mutating 'scale.value' updates the UI thread directly without triggering costly React component re-render reconciliation passes`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d16-b2-worklet-directive-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "shared_value_demo.js",
            "initialCode": "function getSharedValueRule() {\n  return 'MUTATING_SHARED_VALUE_UPDATES_UI_THREAD_WITHOUT_TRIGGERING_REACT_RE_RENDERS';\n}\n\nconsole.log(getSharedValueRule());",
            "expectedOutput": "MUTATING_SHARED_VALUE_UPDATES_UI_THREAD_WITHOUT_TRIGGERING_REACT_RE_RENDERS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do Reanimated shared values achieve 120 FPS performance compared to standard useState hooks?",
          "expectedStringOutput": "MUTATING_SHARED_VALUE_UPDATES_UI_THREAD_WITHOUT_TRIGGERING_REACT_RE_RENDERS",
          "acceptableAnswers": [
            "MUTATING_SHARED_VALUE_UPDATES_UI_THREAD_WITHOUT_TRIGGERING_REACT_RE_RENDERS",
            "Without triggering React re-renders",
            "Updates UI thread directly"
          ],
          "primaryMisconceptionId": "MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS",
          "diagnosisMap": {
            "RE_RENDERS_EVERY_FRAME": {
              "misconceptionId": "MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS",
              "errorExplanation": "Shared values bypass React render cycles: MUTATING_SHARED_VALUE_UPDATES_UI_THREAD_WITHOUT_TRIGGERING_REACT_RE_RENDERS.",
              "recoveryPath": {
                "simplerExplanation": "Matches MUTATING_SHARED_VALUE_UPDATES_UI_THREAD_WITHOUT_TRIGGERING_REACT_RE_RENDERS.",
                "guidedFixPrompt": "Type MUTATING_SHARED_VALUE_UPDATES_UI_THREAD_WITHOUT_TRIGGERING_REACT_RE_RENDERS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Gesture Handler: Pan, Pinch, Tap & Swipe Physics",
    "overviewMetaphor": "Swipe-to-Dismiss Is an Air-Hockey Puck: If you slide the puck slowly past the halfway line ($|t_x| > 100\\text{px}$) OR flick it with high explosive wrist velocity ($|v_x| > 500\\text{px/s}$), the puck flies into the goal (`SWIPE_DISMISS_TRIGGERED_NOMINAL`); otherwise, the rubber bumper snaps it back to center.",
    "blocks": [
      {
        "id": "mobile-d17-b1-swipe-velocity-classifier",
        "day": 17,
        "blockNumber": 1,
        "title": "Gesture Physics: Classifying Distance ($>100\\text{px}$) & Velocity ($>500\\text{px/s}$) Dismissal",
        "conceptBudget": {
          "primaryConcept": "Pan Gesture Swipe Velocity Threshold Classifier",
          "supportingTerms": [
            "Translation X ($-120\\text{px}$)",
            "Velocity X ($-800\\text{px/s}$)",
            "Dismiss Thresholds",
            "Status: Swipe Dismiss Triggered Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d16-b1-spring-physics-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Pan Gesture Physics Threshold Ledger",
              "boxes": [
                {
                  "label": "Distance Condition",
                  "value": "|tx: -120px| > 100px threshold -> DISMISS TRIGGERED",
                  "varType": "Distance",
                  "isUpdated": true
                },
                {
                  "label": "Velocity Condition",
                  "value": "|vx: -800px/s| > 500px/s threshold -> FLICK DISMISS TRIGGERED",
                  "varType": "Velocity",
                  "isUpdated": true
                },
                {
                  "label": "Gesture Resolution",
                  "value": "SWIPE DISMISS TRIGGERED NOMINAL (NATURAL INERTIA VERIFIED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "gesture_velocity_demo.js",
            "initialCode": "function classifySwipe(tx, vx, threshDist, threshVel) {\n  const ok = Math.abs(tx) > threshDist || Math.abs(vx) > threshVel;\n  return {\n    translationX: tx,\n    velocityX: vx,\n    isDismissTriggered: ok,\n    status: ok ? 'SWIPE_DISMISS_TRIGGERED_NOMINAL' : 'SWIPE_REVERTED_TO_ORIGIN'\n  };\n}\n\nconsole.log(JSON.stringify(classifySwipe(-120, 100, 100, 500)));\nconsole.log(JSON.stringify(classifySwipe(-30, -800, 100, 500)));",
            "expectedOutput": "{\"translationX\":-120,\"velocityX\":100,\"isDismissTriggered\":true,\"status\":\"SWIPE_DISMISS_TRIGGERED_NOMINAL\"}\n{\"translationX\":-30,\"velocityX\":-800,\"isDismissTriggered\":true,\"status\":\"SWIPE_DISMISS_TRIGGERED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a swipe gesture exceeded distance or velocity thresholds for item deletion?",
          "expectedStringOutput": "SWIPE_DISMISS_TRIGGERED_NOMINAL",
          "acceptableAnswers": [
            "SWIPE_DISMISS_TRIGGERED_NOMINAL",
            "status\":\"SWIPE_DISMISS_TRIGGERED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_MOB_GESTURE_HANDLER_PAN_TAP_PHYSICS",
          "diagnosisMap": {
            "SWIPE_REVERTED_TO_ORIGIN": {
              "misconceptionId": "MC_MOB_GESTURE_HANDLER_PAN_TAP_PHYSICS",
              "errorExplanation": "Both tests exceed threshold: SWIPE_DISMISS_TRIGGERED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type SWIPE_DISMISS_TRIGGERED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d17-b2-gesture-handler-root-component-name",
        "day": 17,
        "blockNumber": 2,
        "title": "The Mandatory Root Wrapper: `GestureHandlerRootView`",
        "conceptBudget": {
          "primaryConcept": "`GestureHandlerRootView` Invariant",
          "supportingTerms": [
            "`GestureHandlerRootView` (`The root container component required at the very top of your app tree to capture native touch responder events`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d17-b1-swipe-velocity-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "GestureHandlerRootView Setup",
            "codeSnippet": "import { GestureHandlerRootView } from 'react-native-gesture-handler';\n\nexport default function App() {\n  return (\n    <GestureHandlerRootView style={{ flex: 1 }}>\n      <AppNavigator />\n    </GestureHandlerRootView>\n  );\n}",
            "lineNotes": {
              "1": "Import GestureHandlerRootView.",
              "5": "Wrap root app with style={{ flex: 1 }} to receive all touch physics."
            }
          },
          {
            "type": "runnable_code",
            "filename": "gesture_root_demo.js",
            "initialCode": "function getGestureRoot() {\n  return 'GestureHandlerRootView';\n}\n\nconsole.log(getGestureRoot());",
            "expectedOutput": "GestureHandlerRootView",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What root component must wrap a React Native application to enable native gesture handling?",
          "expectedStringOutput": "GestureHandlerRootView",
          "acceptableAnswers": [
            "GestureHandlerRootView",
            "<GestureHandlerRootView>",
            "'GestureHandlerRootView'"
          ],
          "primaryMisconceptionId": "MC_MOB_GESTURE_HANDLER_PAN_TAP_PHYSICS",
          "diagnosisMap": {
            "View": {
              "misconceptionId": "MC_MOB_GESTURE_HANDLER_PAN_TAP_PHYSICS",
              "errorExplanation": "Standard View cannot route native gestures. Use GestureHandlerRootView.",
              "recoveryPath": {
                "simplerExplanation": "Type GestureHandlerRootView.",
                "guidedFixPrompt": "Type GestureHandlerRootView"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d17-b3-simultaneous-gesture-recognition",
        "day": 17,
        "blockNumber": 3,
        "title": "Gesture Composition: Combining Simultaneous Gestures with `Gesture.Simultaneous()`",
        "conceptBudget": {
          "primaryConcept": "Gesture Composition Invariant",
          "supportingTerms": [
            "`Gesture.Simultaneous()` (`Allows a user to pinch-to-zoom and pan/drag an image at the exact same instant without gesture cancellations`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d17-b2-gesture-handler-root-component-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "simultaneous_gesture_demo.js",
            "initialCode": "function getGestureCompositionRule() {\n  return 'USE_GESTURE_SIMULTANEOUS_TO_COMBINE_PINCH_AND_PAN_WITHOUT_CANCELLATION';\n}\n\nconsole.log(getGestureCompositionRule());",
            "expectedOutput": "USE_GESTURE_SIMULTANEOUS_TO_COMBINE_PINCH_AND_PAN_WITHOUT_CANCELLATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do mobile applications allow simultaneous pinch-zoom and pan dragging on photos?",
          "expectedStringOutput": "USE_GESTURE_SIMULTANEOUS_TO_COMBINE_PINCH_AND_PAN_WITHOUT_CANCELLATION",
          "acceptableAnswers": [
            "USE_GESTURE_SIMULTANEOUS_TO_COMBINE_PINCH_AND_PAN_WITHOUT_CANCELLATION",
            "Gesture.Simultaneous",
            "Simultaneous gestures"
          ],
          "primaryMisconceptionId": "MC_MOB_GESTURE_HANDLER_PAN_TAP_PHYSICS",
          "diagnosisMap": {
            "EXCLUSIVE_GESTURES": {
              "misconceptionId": "MC_MOB_GESTURE_HANDLER_PAN_TAP_PHYSICS",
              "errorExplanation": "Standard is: USE_GESTURE_SIMULTANEOUS_TO_COMBINE_PINCH_AND_PAN_WITHOUT_CANCELLATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches USE_GESTURE_SIMULTANEOUS_TO_COMBINE_PINCH_AND_PAN_WITHOUT_CANCELLATION.",
                "guidedFixPrompt": "Type USE_GESTURE_SIMULTANEOUS_TO_COMBINE_PINCH_AND_PAN_WITHOUT_CANCELLATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "High-Performance Virtualized Lists: FlatList & FlashList Optimization",
    "overviewMetaphor": "FlatList getItemLayout Is an Elevator with a Pre-Calculated Floor Height: If every floor is exactly $60\\text{px}$ high, jumping to floor 10 doesn't require measuring every ceiling along the way; the elevator instantly multiplies ($60\\text{px} \\times 10 = 600\\text{px}$), teleporting to the exact scroll offset in 0 milliseconds.",
    "blocks": [
      {
        "id": "mobile-d18-b1-item-layout-calculator",
        "day": 18,
        "blockNumber": 1,
        "title": "List Optimization: Calculating `getItemLayout` Offset ($60\\text{px} \\times 10 = 600\\text{px}$)",
        "conceptBudget": {
          "primaryConcept": "FlatList getItemLayout Offset Calculator",
          "supportingTerms": [
            "Item Length ($60\\text{px}$)",
            "Row Index ($10$)",
            "Computed Offset ($600\\text{px}$)",
            "Zero Dynamic Measurement Overhead",
            "Status: Get Item Layout Computed Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d17-b1-swipe-velocity-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "FlatList getItemLayout Math Ledger",
              "boxes": [
                {
                  "label": "Fixed Item Height",
                  "value": "length = 60px (Standard list item row height)",
                  "varType": "Length",
                  "isUpdated": false
                },
                {
                  "label": "Target Row Index",
                  "value": "index = 10 (Target item in 10,000 row list)",
                  "varType": "Index",
                  "isUpdated": false
                },
                {
                  "label": "Calculated Offset",
                  "value": "offset = 60 * 10 = 600px (COMPUTED NOMINAL - 0 MS LAG!)",
                  "varType": "Offset",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "item_layout_demo.js",
            "initialCode": "function calcItemLayout(itemH, idx) {\n  return {\n    length: itemH,\n    offset: itemH * idx,\n    index: idx,\n    status: 'GET_ITEM_LAYOUT_COMPUTED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcItemLayout(60, 10)));",
            "expectedOutput": "{\"length\":60,\"offset\":600,\"index\":10,\"status\":\"GET_ITEM_LAYOUT_COMPUTED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What scroll offset is calculated for item index 10 with a fixed row height of 60px?",
          "expectedStringOutput": "600",
          "acceptableAnswers": [
            "600",
            "offset\":600",
            "600px"
          ],
          "primaryMisconceptionId": "MC_MOB_FLATLIST_PERFORMANCE_VIRTUALIZATION",
          "diagnosisMap": {
            "60": {
              "misconceptionId": "MC_MOB_FLATLIST_PERFORMANCE_VIRTUALIZATION",
              "errorExplanation": "Offset = itemHeight * index = 60 * 10 = 600.",
              "recoveryPath": {
                "simplerExplanation": "Offset is 600.",
                "guidedFixPrompt": "Type 600"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d18-b2-shopify-flashlist-engine-name",
        "day": 18,
        "blockNumber": 2,
        "title": "The High-Performance Recycled List Engine: `FlashList`",
        "conceptBudget": {
          "primaryConcept": "`FlashList` Invariant",
          "supportingTerms": [
            "`FlashList` (`Shopify's recycling virtualization list component that reuses existing native views rather than destroying and recreating them, achieving 5x higher FPS`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d18-b1-item-layout-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Shopify FlashList Setup",
            "codeSnippet": "import { FlashList } from '@shopify/flash-list';\n\n<FlashList\n  data={largeDataset}\n  estimatedItemSize={60}\n  renderItem={({ item }) => <UserRow user={item} />}\n/>",
            "lineNotes": {
              "1": "Import FlashList from @shopify/flash-list.",
              "5": "estimatedItemSize enables native view recycling."
            }
          },
          {
            "type": "runnable_code",
            "filename": "flashlist_name_demo.js",
            "initialCode": "function getFlashListEngine() {\n  return 'FlashList';\n}\n\nconsole.log(getFlashListEngine());",
            "expectedOutput": "FlashList",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What high-speed recycled list component was developed by Shopify for React Native?",
          "expectedStringOutput": "FlashList",
          "acceptableAnswers": [
            "FlashList",
            "Flash List",
            "'FlashList'"
          ],
          "primaryMisconceptionId": "MC_MOB_FLATLIST_PERFORMANCE_VIRTUALIZATION",
          "diagnosisMap": {
            "ScrollView": {
              "misconceptionId": "MC_MOB_FLATLIST_PERFORMANCE_VIRTUALIZATION",
              "errorExplanation": "ScrollView renders all items at once. Shopify's recycling list is FlashList.",
              "recoveryPath": {
                "simplerExplanation": "Type FlashList.",
                "guidedFixPrompt": "Type FlashList"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d18-b3-anonymous-render-item-functions",
        "day": 18,
        "blockNumber": 3,
        "title": "Memory Invariant: Never Writing Inline Arrow Functions for `renderItem`",
        "conceptBudget": {
          "primaryConcept": "`renderItem` Invariant",
          "supportingTerms": [
            "Stable Callback Invariant (`Declaring 'renderItem' as a useCallback or stable top-level function prevents FlatList from recreating item templates on every parent re-render`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d18-b2-shopify-flashlist-engine-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "render_item_rule_demo.js",
            "initialCode": "function getRenderItemRule() {\n  return 'MEMOIZE_RENDER_ITEM_CALLBACKS_TO_PREVENT_UNNECESSARY_LIST_ROW_RE_RENDERS';\n}\n\nconsole.log(getRenderItemRule());",
            "expectedOutput": "MEMOIZE_RENDER_ITEM_CALLBACKS_TO_PREVENT_UNNECESSARY_LIST_ROW_RE_RENDERS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why should renderItem callbacks in virtualized lists be memoized with useCallback?",
          "expectedStringOutput": "MEMOIZE_RENDER_ITEM_CALLBACKS_TO_PREVENT_UNNECESSARY_LIST_ROW_RE_RENDERS",
          "acceptableAnswers": [
            "MEMOIZE_RENDER_ITEM_CALLBACKS_TO_PREVENT_UNNECESSARY_LIST_ROW_RE_RENDERS",
            "Prevent unnecessary list row re-renders",
            "Memoize renderItem callbacks"
          ],
          "primaryMisconceptionId": "MC_MOB_FLATLIST_PERFORMANCE_VIRTUALIZATION",
          "diagnosisMap": {
            "INLINE_IS_FAST": {
              "misconceptionId": "MC_MOB_FLATLIST_PERFORMANCE_VIRTUALIZATION",
              "errorExplanation": "Inline functions trigger full row re-renders. Standard is: MEMOIZE_RENDER_ITEM_CALLBACKS_TO_PREVENT_UNNECESSARY_LIST_ROW_RE_RENDERS.",
              "recoveryPath": {
                "simplerExplanation": "Matches MEMOIZE_RENDER_ITEM_CALLBACKS_TO_PREVENT_UNNECESSARY_LIST_ROW_RE_RENDERS.",
                "guidedFixPrompt": "Type MEMOIZE_RENDER_ITEM_CALLBACKS_TO_PREVENT_UNNECESSARY_LIST_ROW_RE_RENDERS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Deep Linking, Universal Links & App Links: `myapp://` Scheme",
    "overviewMetaphor": "Deep Linking Is a Postal Routing Label on an Inbound Package: Clicking a link in a mobile browser (`pinit://course/mobile-dev?day=19`) instructs the OS to bypass the browser, launch the PinIT mobile app directly, and route the user immediately to Day 19 of the Mobile Dev course.",
    "blocks": [
      {
        "id": "mobile-d19-b1-deep-link-parser",
        "day": 19,
        "blockNumber": 1,
        "title": "Deep Linking: Parsing `pinit://course/mobile-dev` Scheme & Screen Params",
        "conceptBudget": {
          "primaryConcept": "Deep Link URL Scheme Parser & Screen Param Extractor",
          "supportingTerms": [
            "Custom Scheme (`'pinit'`)",
            "Target Screen (`'course'`)",
            "Route ID (`'mobile-dev'`)",
            "Status: Deep Link Parsed Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d18-b1-item-layout-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Mobile Deep Link Routing Ledger",
              "boxes": [
                {
                  "label": "Raw URL String",
                  "value": "pinit://course/mobile-dev?day=19 (Inbound external link)",
                  "varType": "Raw Link",
                  "isUpdated": false
                },
                {
                  "label": "Parsed Scheme & Target",
                  "value": "scheme: 'pinit' | targetScreen: 'course' | routeId: 'mobile-dev'",
                  "varType": "Parsed",
                  "isUpdated": false
                },
                {
                  "label": "Routing Status",
                  "value": "DEEP LINK PARSED NOMINAL (INBOUND ROUTING ACTIVE!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "deep_link_demo.js",
            "initialCode": "function parseLink(url) {\n  const parts = url.split('://');\n  const scheme = parts[0];\n  const rest = parts[1] || '';\n  const [path] = rest.split('?');\n  const [screen, id] = path.split('/');\n  return {\n    scheme,\n    targetScreen: screen,\n    routeId: id || null,\n    status: 'DEEP_LINK_PARSED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(parseLink('pinit://course/mobile-dev?day=19')));",
            "expectedOutput": "{\"scheme\":\"pinit\",\"targetScreen\":\"course\",\"routeId\":\"mobile-dev\",\"status\":\"DEEP_LINK_PARSED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What routeId is extracted from 'pinit://course/mobile-dev?day=19'?",
          "expectedStringOutput": "mobile-dev",
          "acceptableAnswers": [
            "mobile-dev",
            "routeId\":\"mobile-dev\"",
            "'mobile-dev'"
          ],
          "primaryMisconceptionId": "MC_MOB_DEEP_LINKING_UNIVERSAL_LINKS",
          "diagnosisMap": {
            "course": {
              "misconceptionId": "MC_MOB_DEEP_LINKING_UNIVERSAL_LINKS",
              "errorExplanation": "'course' is targetScreen. 'mobile-dev' is routeId.",
              "recoveryPath": {
                "simplerExplanation": "routeId is mobile-dev.",
                "guidedFixPrompt": "Type mobile-dev"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d19-b2-apple-association-filename",
        "day": 19,
        "blockNumber": 2,
        "title": "The iOS Universal Links Association File: `apple-app-site-association`",
        "conceptBudget": {
          "primaryConcept": "AASA File Invariant",
          "supportingTerms": [
            "`apple-app-site-association` (`The JSON file hosted at https://yourdomain.com/.well-known/apple-app-site-association that cryptographically proves your app owns the domain`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d19-b1-deep-link-parser",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "AASA JSON File Structure",
            "codeSnippet": "{\n  \"applinks\": {\n    \"apps\": [],\n    \"details\": [\n      {\n        \"appID\": \"TEAMID123.com.pinit.career\",\n        \"paths\": [ \"/course/*\", \"/quests/*\" ]\n      }\n    ]\n  }\n}",
            "lineNotes": {
              "5": "appID binds Apple Team ID to Bundle Identifier.",
              "6": "paths declares deep-linkable URL patterns."
            }
          },
          {
            "type": "runnable_code",
            "filename": "aasa_filename_demo.js",
            "initialCode": "function getAasaFilename() {\n  return 'apple-app-site-association';\n}\n\nconsole.log(getAasaFilename());",
            "expectedOutput": "apple-app-site-association",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the exact name of the configuration file hosted on web servers for iOS Universal Links?",
          "expectedStringOutput": "apple-app-site-association",
          "acceptableAnswers": [
            "apple-app-site-association",
            "'apple-app-site-association'",
            "AASA"
          ],
          "primaryMisconceptionId": "MC_MOB_DEEP_LINKING_UNIVERSAL_LINKS",
          "diagnosisMap": {
            "assetlinks.json": {
              "misconceptionId": "MC_MOB_DEEP_LINKING_UNIVERSAL_LINKS",
              "errorExplanation": "assetlinks.json is for Android App Links. iOS uses apple-app-site-association (with no .json extension).",
              "recoveryPath": {
                "simplerExplanation": "Type apple-app-site-association.",
                "guidedFixPrompt": "Type apple-app-site-association"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d19-b3-universal-links-vs-custom-schemes",
        "day": 19,
        "blockNumber": 3,
        "title": "Security: Why HTTPS Universal Links are Superior to Custom URL Schemes",
        "conceptBudget": {
          "primaryConcept": "Universal Links Security Invariant",
          "supportingTerms": [
            "Universal Links (`HTTPS Universal Links cannot be hijacked by malicious rogue apps because domain ownership is verified via TLS certificates`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d19-b2-apple-association-filename",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "universal_links_demo.js",
            "initialCode": "function getDeepLinkSecurityRule() {\n  return 'PREFER_HTTPS_UNIVERSAL_LINKS_TO_PREVENT_MALICIOUS_APP_URL_HIJACKING';\n}\n\nconsole.log(getDeepLinkSecurityRule());",
            "expectedOutput": "PREFER_HTTPS_UNIVERSAL_LINKS_TO_PREVENT_MALICIOUS_APP_URL_HIJACKING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why are HTTPS Universal Links more secure than custom URL schemes like myapp://?",
          "expectedStringOutput": "PREFER_HTTPS_UNIVERSAL_LINKS_TO_PREVENT_MALICIOUS_APP_URL_HIJACKING",
          "acceptableAnswers": [
            "PREFER_HTTPS_UNIVERSAL_LINKS_TO_PREVENT_MALICIOUS_APP_URL_HIJACKING",
            "Prevent malicious app URL hijacking",
            "Prevent URL hijacking"
          ],
          "primaryMisconceptionId": "MC_MOB_DEEP_LINKING_UNIVERSAL_LINKS",
          "diagnosisMap": {
            "SCHEMES_ARE_SAME": {
              "misconceptionId": "MC_MOB_DEEP_LINKING_UNIVERSAL_LINKS",
              "errorExplanation": "Any rogue app can register myapp://. Standard is: PREFER_HTTPS_UNIVERSAL_LINKS_TO_PREVENT_MALICIOUS_APP_URL_HIJACKING.",
              "recoveryPath": {
                "simplerExplanation": "Matches PREFER_HTTPS_UNIVERSAL_LINKS_TO_PREVENT_MALICIOUS_APP_URL_HIJACKING.",
                "guidedFixPrompt": "Type PREFER_HTTPS_UNIVERSAL_LINKS_TO_PREVENT_MALICIOUS_APP_URL_HIJACKING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Push Notifications Architecture: APNs & FCM Token Registration",
    "overviewMetaphor": "Push Notifications Are Registered Mobile Mailboxes: When a user installs the app, the device registers with Apple (APNs) or Google (FCM) to generate a unique postal mailbox token (`ExponentPushToken[xxxx]`); the PinIT backend uses this token to push study reminders directly to the user's lock screen.",
    "blocks": [
      {
        "id": "mobile-d20-b1-push-token-validator",
        "day": 20,
        "blockNumber": 1,
        "title": "Push Notifications: Validating `ExponentPushToken[...]` Token Format",
        "conceptBudget": {
          "primaryConcept": "Expo Push Token Validation & Channel Formatter",
          "supportingTerms": [
            "Push Token String (`'ExponentPushToken[xxxxxx_yyyyy]'`)",
            "Prefix & Suffix Validation",
            "Status: Expo Push Token Validated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d19-b1-deep-link-parser",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Push Notification Device Registration Ledger",
              "boxes": [
                {
                  "label": "1. Device APNs/FCM Request",
                  "value": "Notifications.getExpoPushTokenAsync()",
                  "varType": "Request",
                  "isUpdated": false
                },
                {
                  "label": "2. Formatted Device Token",
                  "value": "'ExponentPushToken[xxxxxx_yyyyy]' (Token validated nominal)",
                  "varType": "Token",
                  "isUpdated": false
                },
                {
                  "label": "3. Backend Cloud Registry",
                  "value": "EXPO PUSH TOKEN VALIDATED NOMINAL (REGISTERED FOR DISPATCH!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "push_token_demo.js",
            "initialCode": "function validatePushToken(tok) {\n  const ok = typeof tok === 'string' && tok.startsWith('ExponentPushToken[') && tok.endsWith(']');\n  return {\n    pushToken: tok,\n    isValidExpoToken: ok,\n    status: ok ? 'EXPO_PUSH_TOKEN_VALIDATED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(validatePushToken('ExponentPushToken[xxxxxx_yyyyy]')));",
            "expectedOutput": "{\"pushToken\":\"ExponentPushToken[xxxxxx_yyyyy]\",\"isValidExpoToken\":true,\"status\":\"EXPO_PUSH_TOKEN_VALIDATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a device push token has a valid ExponentPushToken format?",
          "expectedStringOutput": "EXPO_PUSH_TOKEN_VALIDATED_NOMINAL",
          "acceptableAnswers": [
            "EXPO_PUSH_TOKEN_VALIDATED_NOMINAL",
            "status\":\"EXPO_PUSH_TOKEN_VALIDATED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_MOB_PUSH_NOTIFICATIONS_APNS_FCM",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MOB_PUSH_NOTIFICATIONS_APNS_FCM",
              "errorExplanation": "Matches EXPO_PUSH_TOKEN_VALIDATED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type EXPO_PUSH_TOKEN_VALIDATED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d20-b2-android-notification-channel-api",
        "day": 20,
        "blockNumber": 2,
        "title": "Android Notification Channels: Mandatory on Android 8.0+ (API 26)",
        "conceptBudget": {
          "primaryConcept": "Notification Channel Invariant",
          "supportingTerms": [
            "API 26 (`Android 8.0 Oreo introduced mandatory notification channels; notifications without an assigned channel are silently dropped by the OS`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d20-b1-push-token-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Android Notification Channel Setup",
            "codeSnippet": "import * as Notifications from 'expo-notifications';\nimport { Platform } from 'react-native';\n\nif (Platform.OS === 'android') {\n  await Notifications.setNotificationChannelAsync('default', {\n    name: 'Default Notifications',\n    importance: Notifications.AndroidImportance.MAX,\n    vibrationPattern: [0, 250, 250, 250],\n    lightColor: '#3b82f6'\n  });\n}",
            "lineNotes": {
              "5": "setNotificationChannelAsync creates channel on Android API 26+.",
              "7": "AndroidImportance.MAX shows heads-up banner."
            }
          },
          {
            "type": "runnable_code",
            "filename": "android_channel_demo.js",
            "initialCode": "function getAndroidChannelApi() {\n  return 26;\n}\n\nconsole.log(getAndroidChannelApi());",
            "expectedOutput": "26",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Starting at what Android API level are notification channels strictly mandatory?",
          "expectedStringOutput": "26",
          "acceptableAnswers": [
            "26",
            "API 26",
            "Android 8.0",
            "twenty-six"
          ],
          "primaryMisconceptionId": "MC_MOB_PUSH_NOTIFICATIONS_APNS_FCM",
          "diagnosisMap": {
            "21": {
              "misconceptionId": "MC_MOB_PUSH_NOTIFICATIONS_APNS_FCM",
              "errorExplanation": "Notification channels were introduced in Android 8.0 (API Level 26).",
              "recoveryPath": {
                "simplerExplanation": "Type 26.",
                "guidedFixPrompt": "Type 26"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d20-b3-handling-background-notification-clicks",
        "day": 20,
        "blockNumber": 3,
        "title": "Notification Routing: Navigating to Target Screens on Notification Response",
        "conceptBudget": {
          "primaryConcept": "Notification Response Invariant",
          "supportingTerms": [
            "`addNotificationResponseReceivedListener` (`Listens for user taps on background notifications, extracting the data payload to navigate directly to the relevant quest screen`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d20-b2-android-notification-channel-api",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "notification_routing_demo.js",
            "initialCode": "function getNotificationRoutingRule() {\n  return 'ROUTE_USERS_DIRECTLY_TO_TARGET_CONTENT_WHEN_NOTIFICATION_BANNER_IS_PRESSED';\n}\n\nconsole.log(getNotificationRoutingRule());",
            "expectedOutput": "ROUTE_USERS_DIRECTLY_TO_TARGET_CONTENT_WHEN_NOTIFICATION_BANNER_IS_PRESSED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What behavior must mobile applications implement when a user taps a push notification banner?",
          "expectedStringOutput": "ROUTE_USERS_DIRECTLY_TO_TARGET_CONTENT_WHEN_NOTIFICATION_BANNER_IS_PRESSED",
          "acceptableAnswers": [
            "ROUTE_USERS_DIRECTLY_TO_TARGET_CONTENT_WHEN_NOTIFICATION_BANNER_IS_PRESSED",
            "Route to target content",
            "Navigate directly to target content"
          ],
          "primaryMisconceptionId": "MC_MOB_PUSH_NOTIFICATIONS_APNS_FCM",
          "diagnosisMap": {
            "OPEN_HOME_ONLY": {
              "misconceptionId": "MC_MOB_PUSH_NOTIFICATIONS_APNS_FCM",
              "errorExplanation": "Standard is: ROUTE_USERS_DIRECTLY_TO_TARGET_CONTENT_WHEN_NOTIFICATION_BANNER_IS_PRESSED.",
              "recoveryPath": {
                "simplerExplanation": "Matches ROUTE_USERS_DIRECTLY_TO_TARGET_CONTENT_WHEN_NOTIFICATION_BANNER_IS_PRESSED.",
                "guidedFixPrompt": "Type ROUTE_USERS_DIRECTLY_TO_TARGET_CONTENT_WHEN_NOTIFICATION_BANNER_IS_PRESSED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Reanimated 3 Physics, Gesture Handling & Deep Linking Router",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete high-performance mobile UI physics and external routing engine: 1. Spring physics damping calculation; 2. Swipe-to-dismiss velocity classification; 3. FlatList getItemLayout computation; 4. Deep link URL parsing; 5. Expo push token validation.",
    "blocks": [
      {
        "id": "mobile-d21-b1-mobile-physics-master-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Mobile Physics & Routing Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Mobile Physics & Routing Master Engine",
          "supportingTerms": [
            "Spring Physics Subsystem",
            "Gesture Handler Subsystem",
            "Virtualized List Subsystem",
            "Deep Linking Subsystem",
            "Push Token Subsystem"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d20-b3-handling-background-notification-clicks",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Mobile Physics & Routing Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Calculates under-damped spring physics & audits pan swipe velocities",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Computes fixed-height list layouts & parses deep link URL schemes",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Validates ExponentPushTokens & activates Mobile Physics Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "physics_kernel_demo.js",
            "initialCode": "function runPhysicsMaster() {\n  return {\n    springSubsystem: 'ONLINE_SPRING_PHYSICS_ACTIVE',\n    gestureSubsystem: 'ONLINE_PAN_PHYSICS_ACTIVE',\n    listSubsystem: 'ONLINE_ITEM_LAYOUT_ACTIVE',\n    deepLinkSubsystem: 'ONLINE_URL_SCHEME_ACTIVE',\n    pushSubsystem: 'ONLINE_EXPO_TOKEN_ACTIVE',\n    engineStatus: 'MOBILE_PHYSICS_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runPhysicsMaster().engineStatus);",
            "expectedOutput": "MOBILE_PHYSICS_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Mobile Physics & Routing Master Engine?",
          "expectedStringOutput": "MOBILE_PHYSICS_MASTER_ACTIVE",
          "acceptableAnswers": [
            "MOBILE_PHYSICS_MASTER_ACTIVE",
            "engineStatus: MOBILE_PHYSICS_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS",
              "errorExplanation": "Matches MOBILE_PHYSICS_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type MOBILE_PHYSICS_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d21-b2-mobile-physics-engine-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Mobile Physics Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Mobile Physics Invariant Verification",
          "supportingTerms": [
            "Physics Invariant",
            "Routing Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d21-b1-mobile-physics-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "physics_audit_demo.js",
            "initialCode": "function auditPhysics(s, g, l, d, p) {\n  const passed = s && g && l && d && p;\n  return {\n    springVerified: s,\n    gesturesVerified: g,\n    listVerified: l,\n    deepLinksVerified: d,\n    pushVerified: p,\n    grade: passed ? 'MOBILE_PHYSICS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditPhysics(true, true, true, true, true)));",
            "expectedOutput": "{\"springVerified\":true,\"gesturesVerified\":true,\"listVerified\":true,\"deepLinksVerified\":true,\"pushVerified\":true,\"grade\":\"MOBILE_PHYSICS_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Spring Physics, Gestures, Lists, Deep Links, and Push Tokens pass 100%?",
          "expectedStringOutput": "MOBILE_PHYSICS_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "MOBILE_PHYSICS_ENGINE_AUDIT_PASSED",
            "grade\":\"MOBILE_PHYSICS_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS",
              "errorExplanation": "All checks passing awards MOBILE_PHYSICS_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards MOBILE_PHYSICS_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type MOBILE_PHYSICS_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d21-b3-milestone3-mobile-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Mobile Physics & Routing Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Mobile Physics Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d21-b2-mobile-physics-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_mobile_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete Reanimated 3 Physics, Gesture Handling & Deep Linking Router [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete Reanimated 3 Physics, Gesture Handling & Deep Linking Router [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete Reanimated 3 Physics, Gesture Handling & Deep Linking Router [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete Reanimated 3 Physics, Gesture Handling & Deep Linking Router [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_MOB_REANIMATED3_SHARED_VALUES_WORKLETS",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete Reanimated 3 Physics, Gesture Handling & Deep Linking Router [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Native Modules & TurboModules: Writing C++ / Kotlin / Swift JSI Bridges",
    "overviewMetaphor": "TurboModules Are Direct Native C++ Pipes: While legacy native modules forced data to wait in an asynchronous JSON staging area, TurboModules instantiate C++ Host Objects directly in the JS global scope (`JSI`), allowing JavaScript to invoke low-level cryptography or DSP algorithms synchronously in nanoseconds.",
    "blocks": [
      {
        "id": "mobile-d22-b1-turbomodule-spec-verifier",
        "day": 22,
        "blockNumber": 1,
        "title": "TurboModules: Verifying Codegen Specification (`TURBOMODULE_SPEC_VERIFIED_NOMINAL`)",
        "conceptBudget": {
          "primaryConcept": "TurboModule Codegen Specification Type Verifier",
          "supportingTerms": [
            "TurboModule Name (`'NativeMathTurboModule'`)",
            "Exported Native Methods (`['multiply', 'computeFastHash']`)",
            "Status: TurboModule Spec Verified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d21-b1-mobile-physics-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "New Architecture TurboModule Spec Ledger",
              "boxes": [
                {
                  "label": "Codegen Spec File",
                  "value": "NativeMathTurboModule.ts (TypeScript interface contract)",
                  "varType": "Spec Interface",
                  "isUpdated": false
                },
                {
                  "label": "C++ JSI Host Object",
                  "value": "Direct memory method binding: multiply(a, b) -> synchronous C++",
                  "varType": "Host Object",
                  "isUpdated": false
                },
                {
                  "label": "Verification Status",
                  "value": "TURBOMODULE SPEC VERIFIED NOMINAL (NANOSECOND JSI BRIDGING!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "turbomodule_spec_demo.js",
            "initialCode": "function verifySpec(name, methods) {\n  const ok = typeof name === 'string' && Array.isArray(methods) && methods.length > 0;\n  return {\n    moduleName: name,\n    exportedMethods: methods,\n    isTurboModuleValid: ok,\n    status: ok ? 'TURBOMODULE_SPEC_VERIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(verifySpec('NativeMathTurboModule', ['multiply', 'computeFastHash'])));",
            "expectedOutput": "{\"moduleName\":\"NativeMathTurboModule\",\"exportedMethods\":[\"multiply\",\"computeFastHash\"],\"isTurboModuleValid\":true,\"status\":\"TURBOMODULE_SPEC_VERIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a TurboModule specification adheres to Codegen architecture standards?",
          "expectedStringOutput": "TURBOMODULE_SPEC_VERIFIED_NOMINAL",
          "acceptableAnswers": [
            "TURBOMODULE_SPEC_VERIFIED_NOMINAL",
            "status\":\"TURBOMODULE_SPEC_VERIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_MOB_TURBOMODULES_NATIVE_C_BRIDGES",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MOB_TURBOMODULES_NATIVE_C_BRIDGES",
              "errorExplanation": "Matches TURBOMODULE_SPEC_VERIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type TURBOMODULE_SPEC_VERIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d22-b2-new-architecture-bridge-name",
        "day": 22,
        "blockNumber": 2,
        "title": "The New Architecture Direct Memory Engine: `JSI`",
        "conceptBudget": {
          "primaryConcept": "JSI Engine Invariant",
          "supportingTerms": [
            "`JSI` (`JavaScript Interface: The lightweight C++ abstraction layer that enables JavaScript to hold direct references to C++ Host Objects`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d22-b1-turbomodule-spec-verifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "TurboModule Codegen Spec",
            "codeSnippet": "import type { TurboModule } from 'react-native';\nimport { TurboModuleRegistry } from 'react-native';\n\nexport interface Spec extends TurboModule {\n  readonly multiply: (a: number, b: number) => number;\n  readonly computeFastHash: (input: string) => Promise<string>;\n}\n\nexport default TurboModuleRegistry.getEnforcing<Spec>('NativeMath');",
            "lineNotes": {
              "4": "Spec interface extends TurboModule.",
              "5": "Synchronous direct C++ method call.",
              "9": "TurboModuleRegistry enforces JSI binding."
            }
          },
          {
            "type": "runnable_code",
            "filename": "jsi_bridge_demo.js",
            "initialCode": "function getNewArchBridge() {\n  return 'JSI';\n}\n\nconsole.log(getNewArchBridge());",
            "expectedOutput": "JSI",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the acronym for the direct C++ memory interface powering React Native's New Architecture?",
          "expectedStringOutput": "JSI",
          "acceptableAnswers": [
            "JSI",
            "'JSI'",
            "JavaScript Interface"
          ],
          "primaryMisconceptionId": "MC_MOB_TURBOMODULES_NATIVE_C_BRIDGES",
          "diagnosisMap": {
            "Bridge": {
              "misconceptionId": "MC_MOB_TURBOMODULES_NATIVE_C_BRIDGES",
              "errorExplanation": "Legacy bridge used JSON queues. New architecture uses JSI.",
              "recoveryPath": {
                "simplerExplanation": "Type JSI.",
                "guidedFixPrompt": "Type JSI"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d22-b3-codegen-type-safety-benefits",
        "day": 22,
        "blockNumber": 3,
        "title": "Codegen Guarantee: Zero-Cost Static Typing Between TypeScript & Native C++",
        "conceptBudget": {
          "primaryConcept": "Codegen Invariant",
          "supportingTerms": [
            "Codegen (`Automatically generates C++ and Objective-C/Java scaffolding from TypeScript spec files at build time, ensuring 100% type safety across native boundaries`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d22-b2-new-architecture-bridge-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "codegen_rule_demo.js",
            "initialCode": "function getCodegenRule() {\n  return 'CODEGEN_GUARANTEES_STATIC_TYPE_SAFETY_BETWEEN_TYPESCRIPT_AND_NATIVE_C_CODE';\n}\n\nconsole.log(getCodegenRule());",
            "expectedOutput": "CODEGEN_GUARANTEES_STATIC_TYPE_SAFETY_BETWEEN_TYPESCRIPT_AND_NATIVE_C_CODE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What build-time tool enforces type safety between JavaScript and native C++ code in TurboModules?",
          "expectedStringOutput": "CODEGEN_GUARANTEES_STATIC_TYPE_SAFETY_BETWEEN_TYPESCRIPT_AND_NATIVE_C_CODE",
          "acceptableAnswers": [
            "CODEGEN_GUARANTEES_STATIC_TYPE_SAFETY_BETWEEN_TYPESCRIPT_AND_NATIVE_C_CODE",
            "Codegen",
            "React Native Codegen"
          ],
          "primaryMisconceptionId": "MC_MOB_TURBOMODULES_NATIVE_C_BRIDGES",
          "diagnosisMap": {
            "MANUAL_CASTING": {
              "misconceptionId": "MC_MOB_TURBOMODULES_NATIVE_C_BRIDGES",
              "errorExplanation": "Standard is: CODEGEN_GUARANTEES_STATIC_TYPE_SAFETY_BETWEEN_TYPESCRIPT_AND_NATIVE_C_CODE.",
              "recoveryPath": {
                "simplerExplanation": "Matches CODEGEN_GUARANTEES_STATIC_TYPE_SAFETY_BETWEEN_TYPESCRIPT_AND_NATIVE_C_CODE.",
                "guidedFixPrompt": "Type CODEGEN_GUARANTEES_STATIC_TYPE_SAFETY_BETWEEN_TYPESCRIPT_AND_NATIVE_C_CODE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Background Tasks & App Lifecycle: AppState & Headless JS",
    "overviewMetaphor": "AppState Is a Smartphone Sentry Guard: When the user minimizes the app to take a phone call (`'active' -> 'background'`), the sentry instantly detects the transition, triggers an emergency auto-save of open form drafts (`triggerBackgroundPersist: true`), and safely pauses resource-heavy timers before the OS freezes the process.",
    "blocks": [
      {
        "id": "mobile-d23-b1-app-state-handler",
        "day": 23,
        "blockNumber": 1,
        "title": "App Lifecycle: Handling `active \\to background` Transition & Auto-Persistence",
        "conceptBudget": {
          "primaryConcept": "AppState Lifecycle Transition Handler",
          "supportingTerms": [
            "Previous State (`'active'`)",
            "Current State (`'background'`)",
            "Auto-Persist Trigger (`triggerBackgroundPersist: true`)",
            "Status: App State Transition Handled Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d22-b1-turbomodule-spec-verifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Mobile AppState Lifecycle State Machine Ledger",
              "boxes": [
                {
                  "label": "1. Active State",
                  "value": "App is running in foreground with user interaction",
                  "varType": "Foreground",
                  "isUpdated": false
                },
                {
                  "label": "2. Transition to Background",
                  "value": "AppState.addEventListener('change') fires ('active' -> 'background')",
                  "varType": "Event",
                  "isUpdated": false
                },
                {
                  "label": "3. Auto-Persist Trigger",
                  "value": "triggerBackgroundPersist = true (HANDLED NOMINAL - ZERO DATA LOSS!)",
                  "varType": "Persist",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "app_state_demo.js",
            "initialCode": "function handleStateTransition(prev, next) {\n  const persist = prev === 'active' && next === 'background';\n  return {\n    previousState: prev,\n    currentState: next,\n    triggerBackgroundPersist: persist,\n    status: 'APP_STATE_TRANSITION_HANDLED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(handleStateTransition('active', 'background')));\nconsole.log(JSON.stringify(handleStateTransition('background', 'active')));",
            "expectedOutput": "{\"previousState\":\"active\",\"currentState\":\"background\",\"triggerBackgroundPersist\":true,\"status\":\"APP_STATE_TRANSITION_HANDLED_NOMINAL\"}\n{\"previousState\":\"background\",\"currentState\":\"active\",\"triggerBackgroundPersist\":false,\"status\":\"APP_STATE_TRANSITION_HANDLED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Does moving from 'active' to 'background' trigger background persistence in the AppState transition handler?",
          "expectedStringOutput": "true",
          "acceptableAnswers": [
            "true",
            "triggerBackgroundPersist\":true",
            "Boolean(true)"
          ],
          "primaryMisconceptionId": "MC_MOB_BACKGROUND_FETCH_APP_LIFECYCLE",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_MOB_BACKGROUND_FETCH_APP_LIFECYCLE",
              "errorExplanation": "Moving to background MUST trigger auto-save before the OS suspends memory.",
              "recoveryPath": {
                "simplerExplanation": "Output is true.",
                "guidedFixPrompt": "Type true"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d23-b2-active-appstate-string-name",
        "day": 23,
        "blockNumber": 2,
        "title": "The Foreground AppState Value: `'active'`",
        "conceptBudget": {
          "primaryConcept": "`'active'` AppState Invariant",
          "supportingTerms": [
            "`'active'` (`Indicates the application is running in the foreground and currently receiving user touch and keyboard events`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d23-b1-app-state-handler",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "AppState Listener Setup",
            "codeSnippet": "import { AppState } from 'react-native';\nimport { useEffect } from 'react';\n\nuseEffect(() => {\n  const sub = AppState.addEventListener('change', (nextAppState) => {\n    if (nextAppState === 'active') {\n      console.log('App has returned to the foreground!');\n    }\n  });\n  return () => sub.remove();\n}, []);",
            "lineNotes": {
              "4": "Listen for OS app state changes.",
              "5": "Check for active foreground state.",
              "9": "Unsubscribe listener to prevent memory leaks."
            }
          },
          {
            "type": "runnable_code",
            "filename": "active_state_demo.js",
            "initialCode": "function getActiveState() {\n  return 'active';\n}\n\nconsole.log(getActiveState());",
            "expectedOutput": "active",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What AppState string value represents an app running in the active foreground?",
          "expectedStringOutput": "active",
          "acceptableAnswers": [
            "active",
            "'active'",
            "Active"
          ],
          "primaryMisconceptionId": "MC_MOB_BACKGROUND_FETCH_APP_LIFECYCLE",
          "diagnosisMap": {
            "foreground": {
              "misconceptionId": "MC_MOB_BACKGROUND_FETCH_APP_LIFECYCLE",
              "errorExplanation": "React Native uses 'active', 'background', and 'inactive' (on iOS).",
              "recoveryPath": {
                "simplerExplanation": "Type active.",
                "guidedFixPrompt": "Type active"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d23-b3-headless-js-background-tasks",
        "day": 23,
        "blockNumber": 3,
        "title": "Background Processing: Headless JS Tasks on Android",
        "conceptBudget": {
          "primaryConcept": "Headless JS Invariant",
          "supportingTerms": [
            "Headless JS (`Allows running JavaScript tasks in the background on Android even when the app UI activity is completely closed`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d23-b2-active-appstate-string-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "headless_js_demo.js",
            "initialCode": "function getHeadlessRule() {\n  return 'USE_HEADLESS_JS_TO_EXECUTE_BACKGROUND_SYNC_TASKS_WITHOUT_LAUNCHING_UI';\n}\n\nconsole.log(getHeadlessRule());",
            "expectedOutput": "USE_HEADLESS_JS_TO_EXECUTE_BACKGROUND_SYNC_TASKS_WITHOUT_LAUNCHING_UI",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What mechanism allows running background JavaScript tasks on Android without launching the app UI?",
          "expectedStringOutput": "USE_HEADLESS_JS_TO_EXECUTE_BACKGROUND_SYNC_TASKS_WITHOUT_LAUNCHING_UI",
          "acceptableAnswers": [
            "USE_HEADLESS_JS_TO_EXECUTE_BACKGROUND_SYNC_TASKS_WITHOUT_LAUNCHING_UI",
            "Headless JS",
            "Use Headless JS"
          ],
          "primaryMisconceptionId": "MC_MOB_BACKGROUND_FETCH_APP_LIFECYCLE",
          "diagnosisMap": {
            "RUN_WEB_WORKER": {
              "misconceptionId": "MC_MOB_BACKGROUND_FETCH_APP_LIFECYCLE",
              "errorExplanation": "Standard is: USE_HEADLESS_JS_TO_EXECUTE_BACKGROUND_SYNC_TASKS_WITHOUT_LAUNCHING_UI.",
              "recoveryPath": {
                "simplerExplanation": "Matches USE_HEADLESS_JS_TO_EXECUTE_BACKGROUND_SYNC_TASKS_WITHOUT_LAUNCHING_UI.",
                "guidedFixPrompt": "Type USE_HEADLESS_JS_TO_EXECUTE_BACKGROUND_SYNC_TASKS_WITHOUT_LAUNCHING_UI"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Battery & Memory Optimization: Profiling Hermes Heap Memory Leaks",
    "overviewMetaphor": "Hermes Heap Profiling Is a Water Meter on an Apartment Complex: If your JavaScript heap allocation is $45\\text{MB}$ against a $150\\text{MB}$ safe threshold, water flows normally (`HERMES_HEAP_MEMORY_NOMINAL`); if an uncleaned timer leaks memory until consumption hits $220\\text{MB}$, the emergency valve shuts down the process to prevent an OS Out-Of-Memory (OOM) crash.",
    "blocks": [
      {
        "id": "mobile-d24-b1-memory-leak-evaluator",
        "day": 24,
        "blockNumber": 1,
        "title": "Memory Profiling: Auditing Hermes Heap Memory ($45\\text{MB} \\le 150\\text{MB}$ Ceiling Passing)",
        "conceptBudget": {
          "primaryConcept": "Hermes Heap Memory Footprint Evaluator",
          "supportingTerms": [
            "Allocated Heap ($45\\text{MB}$ vs $220\\text{MB}$)",
            "Safe Memory Ceiling ($150\\text{MB}$)",
            "Memory Status",
            "Status: Hermes Heap Memory Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d23-b1-app-state-handler",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Mobile Hermes Heap Allocation Ledger",
              "boxes": [
                {
                  "label": "App Heap Allocation A",
                  "value": "heap: 45MB <= 150MB ceiling -> MEMORY NOMINAL (HEALTHY RUNTIME!)",
                  "varType": "Healthy Heap",
                  "isUpdated": true
                },
                {
                  "label": "App Heap Allocation B",
                  "value": "heap: 220MB > 150MB ceiling -> OOM CRASH RISK DETECTED",
                  "varType": "Leaking Heap",
                  "isUpdated": false
                },
                {
                  "label": "Audit Resolution",
                  "value": "HERMES HEAP MEMORY NOMINAL (ZERO CLOSURE RETAIN CYCLES!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "memory_leak_demo.js",
            "initialCode": "function evalMemory(heapMb, maxMb) {\n  const ok = heapMb <= maxMb;\n  return {\n    currentHeapMb: heapMb,\n    isMemoryNominal: ok,\n    status: ok ? 'HERMES_HEAP_MEMORY_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(evalMemory(45, 150)));\nconsole.log(JSON.stringify(evalMemory(220, 150)));",
            "expectedOutput": "{\"currentHeapMb\":45,\"isMemoryNominal\":true,\"status\":\"HERMES_HEAP_MEMORY_NOMINAL\"}\n{\"currentHeapMb\":220,\"isMemoryNominal\":false,\"status\":\"DEFECT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a mobile app's Hermes heap memory remains within the safe 150MB ceiling?",
          "expectedStringOutput": "HERMES_HEAP_MEMORY_NOMINAL",
          "acceptableAnswers": [
            "HERMES_HEAP_MEMORY_NOMINAL",
            "status\":\"HERMES_HEAP_MEMORY_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_MOB_BATTERY_MEMORY_HERMES_PROFILING",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MOB_BATTERY_MEMORY_HERMES_PROFILING",
              "errorExplanation": "45MB <= 150MB produces HERMES_HEAP_MEMORY_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type HERMES_HEAP_MEMORY_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d24-b2-safe-heap-ceiling-mb-number",
        "day": 24,
        "blockNumber": 2,
        "title": "The Standard Mobile Safe Heap Ceiling: 150MB",
        "conceptBudget": {
          "primaryConcept": "150MB Safe Ceiling Invariant",
          "supportingTerms": [
            "150MB Threshold (`The industry standard safe memory budget for high-performance React Native mobile applications to prevent OOM termination on budget devices`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d24-b1-memory-leak-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Hermes Heap Profiling",
            "codeSnippet": "// In Chrome DevTools / Flipper:\n// 1. Record Heap Snapshot\n// 2. Filter by 'Retained Size'\n// 3. Keep total JS heap <= 150 MB for crash-free reliability across all devices",
            "lineNotes": {
              "2": "Heap snapshot captures all memory objects.",
              "4": "Target allocation budget: <= 150MB."
            }
          },
          {
            "type": "runnable_code",
            "filename": "heap_ceiling_demo.js",
            "initialCode": "function getHeapCeiling() {\n  return 150;\n}\n\nconsole.log(getHeapCeiling());",
            "expectedOutput": "150",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the recommended maximum safe JavaScript heap memory budget in megabytes (MB) on mobile?",
          "expectedStringOutput": "150",
          "acceptableAnswers": [
            "150",
            "150MB",
            "150 MB",
            "one hundred fifty"
          ],
          "primaryMisconceptionId": "MC_MOB_BATTERY_MEMORY_HERMES_PROFILING",
          "diagnosisMap": {
            "2000": {
              "misconceptionId": "MC_MOB_BATTERY_MEMORY_HERMES_PROFILING",
              "errorExplanation": "2GB is desktop scale. Mobile OS kills apps exceeding ~150-200MB.",
              "recoveryPath": {
                "simplerExplanation": "Type 150.",
                "guidedFixPrompt": "Type 150"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d24-b3-uncleaned-event-listeners-memory-leaks",
        "day": 24,
        "blockNumber": 3,
        "title": "Memory Leaks: Always Cleaning Up Event Listeners and Timers in `useEffect`",
        "conceptBudget": {
          "primaryConcept": "Cleanup Function Invariant",
          "supportingTerms": [
            "`useEffect` Cleanup (`Returning a cleanup function that cancels setInterval and removes native event subscriptions prevents abandoned closures from retaining memory`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d24-b2-safe-heap-ceiling-mb-number",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cleanup_leak_demo.js",
            "initialCode": "function getMemoryLeakRule() {\n  return 'ALWAYS_RETURN_CLEANUP_FUNCTIONS_IN_USE_EFFECT_TO_AVOID_RETAINED_CLOSURE_LEAKS';\n}\n\nconsole.log(getMemoryLeakRule());",
            "expectedOutput": "ALWAYS_RETURN_CLEANUP_FUNCTIONS_IN_USE_EFFECT_TO_AVOID_RETAINED_CLOSURE_LEAKS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do React Native developers prevent retain cycle memory leaks when using subscriptions or timers?",
          "expectedStringOutput": "ALWAYS_RETURN_CLEANUP_FUNCTIONS_IN_USE_EFFECT_TO_AVOID_RETAINED_CLOSURE_LEAKS",
          "acceptableAnswers": [
            "ALWAYS_RETURN_CLEANUP_FUNCTIONS_IN_USE_EFFECT_TO_AVOID_RETAINED_CLOSURE_LEAKS",
            "Return cleanup functions in useEffect",
            "Clean up useEffect listeners"
          ],
          "primaryMisconceptionId": "MC_MOB_BATTERY_MEMORY_HERMES_PROFILING",
          "diagnosisMap": {
            "LEAVE_LISTENERS": {
              "misconceptionId": "MC_MOB_BATTERY_MEMORY_HERMES_PROFILING",
              "errorExplanation": "Standard is: ALWAYS_RETURN_CLEANUP_FUNCTIONS_IN_USE_EFFECT_TO_AVOID_RETAINED_CLOSURE_LEAKS.",
              "recoveryPath": {
                "simplerExplanation": "Matches ALWAYS_RETURN_CLEANUP_FUNCTIONS_IN_USE_EFFECT_TO_AVOID_RETAINED_CLOSURE_LEAKS.",
                "guidedFixPrompt": "Type ALWAYS_RETURN_CLEANUP_FUNCTIONS_IN_USE_EFFECT_TO_AVOID_RETAINED_CLOSURE_LEAKS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Mobile Security & Keychain Storage: EncryptedSharedPreferences & Keychain",
    "overviewMetaphor": "Expo SecureStore Is a Bank Safe Deposit Box: Unencrypted storage (AsyncStorage) is a notepad left open on a coffee shop table; `expo-secure-store` encrypts sensitive OAuth tokens with AES-256 GCM inside the iPhone's hardware Secure Enclave (`Keychain`) and Android Keystore, protecting credentials even on rooted devices.",
    "blocks": [
      {
        "id": "mobile-d25-b1-secure-store-auditor",
        "day": 25,
        "blockNumber": 1,
        "title": "Mobile Security: Routing Sensitive Tokens to `HARDWARE_KEYCHAIN_SECURE_STORE`",
        "conceptBudget": {
          "primaryConcept": "Secure Store Key-Value Payload Auditor",
          "supportingTerms": [
            "Key Name (`'auth_refresh_token'`)",
            "Sensitive Data Classification (`true`)",
            "Storage Target (`'HARDWARE_KEYCHAIN_SECURE_STORE'`)",
            "Status: Secure Store Target Resolved Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d24-b1-memory-leak-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Mobile Hardware Cryptographic Storage Ledger",
              "boxes": [
                {
                  "label": "auth_refresh_token",
                  "value": "Sensitive OAuth credential -> Routed to HARDWARE_KEYCHAIN_SECURE_STORE",
                  "varType": "Hardware Vault",
                  "isUpdated": true
                },
                {
                  "label": "app_theme_mode",
                  "value": "Non-sensitive UI setting -> Routed to STANDARD_STORAGE",
                  "varType": "Plain Disk",
                  "isUpdated": false
                },
                {
                  "label": "Security Resolution",
                  "value": "SECURE STORE TARGET RESOLVED NOMINAL (AES-256 HARDWARE BACKED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "secure_store_demo.js",
            "initialCode": "function auditStoreKey(key, val) {\n  const sensitive = key.includes('token') || key.includes('secret') || key.includes('key');\n  return {\n    keyName: key,\n    storageTarget: sensitive ? 'HARDWARE_KEYCHAIN_SECURE_STORE' : 'STANDARD_STORAGE',\n    status: 'SECURE_STORE_TARGET_RESOLVED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(auditStoreKey('auth_refresh_token', 'secret123')));\nconsole.log(JSON.stringify(auditStoreKey('app_theme_mode', 'dark')));",
            "expectedOutput": "{\"keyName\":\"auth_refresh_token\",\"storageTarget\":\"HARDWARE_KEYCHAIN_SECURE_STORE\",\"status\":\"SECURE_STORE_TARGET_RESOLVED_NOMINAL\"}\n{\"keyName\":\"app_theme_mode\",\"storageTarget\":\"STANDARD_STORAGE\",\"status\":\"SECURE_STORE_TARGET_RESOLVED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What storage target is assigned to sensitive keys like auth_refresh_token?",
          "expectedStringOutput": "HARDWARE_KEYCHAIN_SECURE_STORE",
          "acceptableAnswers": [
            "HARDWARE_KEYCHAIN_SECURE_STORE",
            "storageTarget\":\"HARDWARE_KEYCHAIN_SECURE_STORE\"",
            "Hardware keychain secure store"
          ],
          "primaryMisconceptionId": "MC_MOB_MOBILE_SECURITY_KEYCHAIN_STORAGE",
          "diagnosisMap": {
            "STANDARD_STORAGE": {
              "misconceptionId": "MC_MOB_MOBILE_SECURITY_KEYCHAIN_STORAGE",
              "errorExplanation": "Sensitive tokens must NEVER be stored in standard storage. Target is HARDWARE_KEYCHAIN_SECURE_STORE.",
              "recoveryPath": {
                "simplerExplanation": "Target is HARDWARE_KEYCHAIN_SECURE_STORE.",
                "guidedFixPrompt": "Type HARDWARE_KEYCHAIN_SECURE_STORE"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d25-b2-ios-secure-storage-name",
        "day": 25,
        "blockNumber": 2,
        "title": "The iOS Hardware Secure Storage Subsystem: `Keychain`",
        "conceptBudget": {
          "primaryConcept": "iOS Keychain Invariant",
          "supportingTerms": [
            "`Keychain` (`Apple's encrypted hardware-backed database for securely storing passwords, private keys, and authentication certificates`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d25-b1-secure-store-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "expo-secure-store API",
            "codeSnippet": "import * as SecureStore from 'expo-secure-store';\n\n// Write to iOS Keychain / Android Keystore:\nawait SecureStore.setItemAsync('user_token', 'jwt_xyz_123', {\n  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY\n});\n\n// Read token:\nconst token = await SecureStore.getItemAsync('user_token');",
            "lineNotes": {
              "4": "Stores token with hardware encryption.",
              "5": "WHEN_UNLOCKED_THIS_DEVICE_ONLY prevents export to cloud backups."
            }
          },
          {
            "type": "runnable_code",
            "filename": "keychain_name_demo.js",
            "initialCode": "function getIosStorage() {\n  return 'Keychain';\n}\n\nconsole.log(getIosStorage());",
            "expectedOutput": "Keychain",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the name of Apple's secure hardware-backed encrypted storage subsystem?",
          "expectedStringOutput": "Keychain",
          "acceptableAnswers": [
            "Keychain",
            "'Keychain'",
            "iOS Keychain"
          ],
          "primaryMisconceptionId": "MC_MOB_MOBILE_SECURITY_KEYCHAIN_STORAGE",
          "diagnosisMap": {
            "UserDefaults": {
              "misconceptionId": "MC_MOB_MOBILE_SECURITY_KEYCHAIN_STORAGE",
              "errorExplanation": "UserDefaults is plaintext. Secure storage on iOS is Keychain.",
              "recoveryPath": {
                "simplerExplanation": "Type Keychain.",
                "guidedFixPrompt": "Type Keychain"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d25-b3-plain-text-token-storage-vulnerability",
        "day": 25,
        "blockNumber": 3,
        "title": "Vulnerability Alert: Never Storing Sensitive JWTs in Unencrypted AsyncStorage",
        "conceptBudget": {
          "primaryConcept": "Plaintext Token Storage Vulnerability",
          "supportingTerms": [
            "AsyncStorage Vulnerability (`AsyncStorage stores data in plaintext SQLite / XML files that any rooted device or malicious sidecar app can easily inspect and steal`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d25-b2-ios-secure-storage-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "security_vulnerability_demo.js",
            "initialCode": "function getSecurityStorageRule() {\n  return 'NEVER_STORE_REFRESH_TOKENS_IN_PLAINTEXT_ASYNC_STORAGE';\n}\n\nconsole.log(getSecurityStorageRule());",
            "expectedOutput": "NEVER_STORE_REFRESH_TOKENS_IN_PLAINTEXT_ASYNC_STORAGE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What critical security rule governs the storage of OAuth tokens in mobile applications?",
          "expectedStringOutput": "NEVER_STORE_REFRESH_TOKENS_IN_PLAINTEXT_ASYNC_STORAGE",
          "acceptableAnswers": [
            "NEVER_STORE_REFRESH_TOKENS_IN_PLAINTEXT_ASYNC_STORAGE",
            "Never store refresh tokens in plaintext",
            "Never store tokens in AsyncStorage"
          ],
          "primaryMisconceptionId": "MC_MOB_MOBILE_SECURITY_KEYCHAIN_STORAGE",
          "diagnosisMap": {
            "ASYNC_STORAGE_IS_SAFE": {
              "misconceptionId": "MC_MOB_MOBILE_SECURITY_KEYCHAIN_STORAGE",
              "errorExplanation": "Standard is: NEVER_STORE_REFRESH_TOKENS_IN_PLAINTEXT_ASYNC_STORAGE.",
              "recoveryPath": {
                "simplerExplanation": "Matches NEVER_STORE_REFRESH_TOKENS_IN_PLAINTEXT_ASYNC_STORAGE.",
                "guidedFixPrompt": "Type NEVER_STORE_REFRESH_TOKENS_IN_PLAINTEXT_ASYNC_STORAGE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Mobile Accessibility: Screen Readers VoiceOver & TalkBack Optimization",
    "overviewMetaphor": "Accessibility Props Are Braille Labels on Elevator Buttons: A sighted user sees an icon button with a trash can; adding `accessibilityLabel=\"Delete lesson item\"` and `accessibilityRole=\"button\"` ensures blind users navigating with Apple VoiceOver or Google TalkBack hear clear spoken instructions (`MOBILE_ACCESSIBILITY_VERIFIED_NOMINAL`).",
    "blocks": [
      {
        "id": "mobile-d26-b1-accessibility-props-auditor",
        "day": 26,
        "blockNumber": 1,
        "title": "Mobile Accessibility: Auditing `accessible`, `accessibilityLabel` & `accessibilityRole`",
        "conceptBudget": {
          "primaryConcept": "Mobile Accessibility Props Auditor",
          "supportingTerms": [
            "Accessible Element (`true`)",
            "Accessibility Label (`'Complete Lesson'`)",
            "Accessibility Role (`'button'`)",
            "Status: Mobile Accessibility Verified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d25-b1-secure-store-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Mobile Screen Reader Accessibility Ledger",
              "boxes": [
                {
                  "label": "accessible={true}",
                  "value": "Groups subviews into single focusable element",
                  "varType": "Focus Group",
                  "isUpdated": false
                },
                {
                  "label": "accessibilityLabel='...'",
                  "value": "Spoken name read aloud by VoiceOver/TalkBack",
                  "varType": "Speech Label",
                  "isUpdated": false
                },
                {
                  "label": "accessibilityRole='button'",
                  "value": "Announces native role trait ('Button, double tap to activate')",
                  "varType": "Role Trait",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "accessibility_audit_demo.js",
            "initialCode": "function auditA11y(acc, label, role) {\n  const validRoles = ['button', 'header', 'link', 'image', 'none'];\n  const ok = acc && typeof label === 'string' && label.length > 0 && validRoles.includes(role);\n  return {\n    accessible: acc,\n    accessibilityLabel: label,\n    accessibilityRole: role,\n    isAccessibleElement: ok,\n    status: ok ? 'MOBILE_ACCESSIBILITY_VERIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditA11y(true, 'Complete Lesson', 'button')));\nconsole.log(JSON.stringify(auditA11y(true, '', 'button')));",
            "expectedOutput": "{\"accessible\":true,\"accessibilityLabel\":\"Complete Lesson\",\"accessibilityRole\":\"button\",\"isAccessibleElement\":true,\"status\":\"MOBILE_ACCESSIBILITY_VERIFIED_NOMINAL\"}\n{\"accessible\":true,\"accessibilityLabel\":\"\",\"accessibilityRole\":\"button\",\"isAccessibleElement\":false,\"status\":\"DEFECT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that an interactive mobile element provides compliant accessibility labels and roles?",
          "expectedStringOutput": "MOBILE_ACCESSIBILITY_VERIFIED_NOMINAL",
          "acceptableAnswers": [
            "MOBILE_ACCESSIBILITY_VERIFIED_NOMINAL",
            "status\":\"MOBILE_ACCESSIBILITY_VERIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_MOB_ACCESSIBILITY_VOICEOVER_TALKBACK",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MOB_ACCESSIBILITY_VOICEOVER_TALKBACK",
              "errorExplanation": "Matches MOBILE_ACCESSIBILITY_VERIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type MOBILE_ACCESSIBILITY_VERIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d26-b2-android-screen-reader-name",
        "day": 26,
        "blockNumber": 2,
        "title": "The Android Native Screen Reader Name: `TalkBack`",
        "conceptBudget": {
          "primaryConcept": "TalkBack Invariant",
          "supportingTerms": [
            "`TalkBack` (`Google's built-in Android accessibility service providing spoken feedback, gesture navigation, and vibration cues`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d26-b1-accessibility-props-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Accessible Icon Button",
            "codeSnippet": "<Pressable\n  accessible={true}\n  accessibilityLabel=\"Delete this lesson\"\n  accessibilityRole=\"button\"\n  accessibilityHint=\"Permanently removes this quest from your saved list\"\n  onPress={handleDelete}\n>\n  <Icon name=\"trash-2\" size={24} />\n</Pressable>",
            "lineNotes": {
              "2": "accessible={true} groups icon and button.",
              "3": "accessibilityLabel provides clear spoken context for VoiceOver and TalkBack.",
              "4": "accessibilityRole informs screen reader of component type."
            }
          },
          {
            "type": "runnable_code",
            "filename": "talkback_name_demo.js",
            "initialCode": "function getAndroidReader() {\n  return 'TalkBack';\n}\n\nconsole.log(getAndroidReader());",
            "expectedOutput": "TalkBack",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the name of Android's built-in native screen reader?",
          "expectedStringOutput": "TalkBack",
          "acceptableAnswers": [
            "TalkBack",
            "'TalkBack'",
            "Talkback"
          ],
          "primaryMisconceptionId": "MC_MOB_ACCESSIBILITY_VOICEOVER_TALKBACK",
          "diagnosisMap": {
            "VoiceOver": {
              "misconceptionId": "MC_MOB_ACCESSIBILITY_VOICEOVER_TALKBACK",
              "errorExplanation": "VoiceOver is iOS. Android's screen reader is TalkBack.",
              "recoveryPath": {
                "simplerExplanation": "Type TalkBack.",
                "guidedFixPrompt": "Type TalkBack"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d26-b3-dynamic-screen-reader-announcements",
        "day": 26,
        "blockNumber": 3,
        "title": "Dynamic Announcements: Using `AccessibilityInfo.announceForAccessibility`",
        "conceptBudget": {
          "primaryConcept": "`AccessibilityInfo` Invariant",
          "supportingTerms": [
            "`AccessibilityInfo.announceForAccessibility()` (`Imperatively triggers the screen reader to speak dynamic changes, such as 'Quest successfully completed!'`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d26-b2-android-screen-reader-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "a11y_announce_demo.js",
            "initialCode": "function getAnnouncementRule() {\n  return 'USE_ACCESSIBILITY_INFO_TO_ANNOUNCE_DYNAMIC_STATE_CHANGES_TO_SCREEN_READERS';\n}\n\nconsole.log(getAnnouncementRule());",
            "expectedOutput": "USE_ACCESSIBILITY_INFO_TO_ANNOUNCE_DYNAMIC_STATE_CHANGES_TO_SCREEN_READERS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do React Native apps notify screen reader users when an asynchronous background action completes?",
          "expectedStringOutput": "USE_ACCESSIBILITY_INFO_TO_ANNOUNCE_DYNAMIC_STATE_CHANGES_TO_SCREEN_READERS",
          "acceptableAnswers": [
            "USE_ACCESSIBILITY_INFO_TO_ANNOUNCE_DYNAMIC_STATE_CHANGES_TO_SCREEN_READERS",
            "AccessibilityInfo announce dynamic state changes",
            "Announce for accessibility"
          ],
          "primaryMisconceptionId": "MC_MOB_ACCESSIBILITY_VOICEOVER_TALKBACK",
          "diagnosisMap": {
            "ALERT_ONLY": {
              "misconceptionId": "MC_MOB_ACCESSIBILITY_VOICEOVER_TALKBACK",
              "errorExplanation": "Standard is: USE_ACCESSIBILITY_INFO_TO_ANNOUNCE_DYNAMIC_STATE_CHANGES_TO_SCREEN_READERS.",
              "recoveryPath": {
                "simplerExplanation": "Matches USE_ACCESSIBILITY_INFO_TO_ANNOUNCE_DYNAMIC_STATE_CHANGES_TO_SCREEN_READERS.",
                "guidedFixPrompt": "Type USE_ACCESSIBILITY_INFO_TO_ANNOUNCE_DYNAMIC_STATE_CHANGES_TO_SCREEN_READERS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Automated Testing in Mobile: Jest, RNTL & Maestro / Detox E2E",
    "overviewMetaphor": "Maestro E2E Testing Is a Robot Customer in a Retail Store: Instead of a human QA engineer tapping on a physical glass screen, Maestro reads a declarative YAML test script (`maestro test login.yaml`), launches the app (`launchApp`), taps the login button, and verifies that the Welcome dashboard appears (`MAESTRO_E2E_FLOW_VERIFIED_NOMINAL`).",
    "blocks": [
      {
        "id": "mobile-d27-b1-maestro-flow-auditor",
        "day": 27,
        "blockNumber": 1,
        "title": "E2E Testing: Validating Maestro YAML Flow Structure (`launchApp` + `assertVisible`)",
        "conceptBudget": {
          "primaryConcept": "Maestro E2E Test Flow Step Auditor",
          "supportingTerms": [
            "Flow Name (`'LoginFlow'`)",
            "Launch App Action (`'launchApp'`)",
            "Assert Visible Action (`'assertVisible'`)",
            "Status: Maestro E2E Flow Verified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d26-b1-accessibility-props-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Maestro Mobile E2E Automation Ledger",
              "boxes": [
                {
                  "label": "1. launchApp Step",
                  "value": "Launches simulator application sandbox",
                  "varType": "Launch",
                  "isUpdated": false
                },
                {
                  "label": "2. tapOn Step",
                  "value": "Simulates native finger tap on 'login_button'",
                  "varType": "Tap",
                  "isUpdated": false
                },
                {
                  "label": "3. assertVisible Step",
                  "value": "Verifies 'Welcome' screen text (MAESTRO E2E FLOW NOMINAL!)",
                  "varType": "Assertion",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "maestro_flow_demo.js",
            "initialCode": "function auditMaestro(name, steps) {\n  const hasLaunch = steps.some(s => s.action === 'launchApp');\n  const hasAssert = steps.some(s => s.action === 'assertVisible');\n  const ok = hasLaunch && hasAssert;\n  return {\n    flowName: name,\n    totalSteps: steps.length,\n    isFlowValid: ok,\n    status: ok ? 'MAESTRO_E2E_FLOW_VERIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditMaestro('LoginFlow', [{ action: 'launchApp' }, { action: 'tapOn', target: 'login_btn' }, { action: 'assertVisible', text: 'Welcome' }])));",
            "expectedOutput": "{\"flowName\":\"LoginFlow\",\"totalSteps\":3,\"isFlowValid\":true,\"status\":\"MAESTRO_E2E_FLOW_VERIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a Maestro mobile E2E test flow contains valid launch and assertion steps?",
          "expectedStringOutput": "MAESTRO_E2E_FLOW_VERIFIED_NOMINAL",
          "acceptableAnswers": [
            "MAESTRO_E2E_FLOW_VERIFIED_NOMINAL",
            "status\":\"MAESTRO_E2E_FLOW_VERIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_MOB_AUTOMATED_TESTING_JEST_MAESTRO",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MOB_AUTOMATED_TESTING_JEST_MAESTRO",
              "errorExplanation": "Matches MAESTRO_E2E_FLOW_VERIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type MAESTRO_E2E_FLOW_VERIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d27-b2-modern-mobile-e2e-tool-name",
        "day": 27,
        "blockNumber": 2,
        "title": "The Modern Declarative Mobile E2E Testing Tool: `Maestro`",
        "conceptBudget": {
          "primaryConcept": "Maestro Invariant",
          "supportingTerms": [
            "`Maestro` (`Mobile Studio's open-source declarative YAML-based UI test automation framework designed for React Native, iOS, and Android`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d27-b1-maestro-flow-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Maestro YAML Flow Syntax",
            "codeSnippet": "appId: com.pinit.career\n---\n- launchApp\n- tapOn: \"Get Started\"\n- assertVisible: \"Choose Your Career Track\"\n- tapOn: \"UI/UX Design Systems\"",
            "lineNotes": {
              "1": "appId specifies target bundle identifier.",
              "3": "launchApp starts test.",
              "5": "assertVisible verifies screen state without brittle XPath selectors."
            }
          },
          {
            "type": "runnable_code",
            "filename": "maestro_name_demo.js",
            "initialCode": "function getE2eTool() {\n  return 'Maestro';\n}\n\nconsole.log(getE2eTool());",
            "expectedOutput": "Maestro",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What modern declarative YAML-based mobile E2E automation tool is industry standard for React Native?",
          "expectedStringOutput": "Maestro",
          "acceptableAnswers": [
            "Maestro",
            "'Maestro'",
            "maestro"
          ],
          "primaryMisconceptionId": "MC_MOB_AUTOMATED_TESTING_JEST_MAESTRO",
          "diagnosisMap": {
            "Selenium": {
              "misconceptionId": "MC_MOB_AUTOMATED_TESTING_JEST_MAESTRO",
              "errorExplanation": "Selenium is for web. The modern mobile declarative framework is Maestro.",
              "recoveryPath": {
                "simplerExplanation": "Type Maestro.",
                "guidedFixPrompt": "Type Maestro"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d27-b3-testing-library-accessibility-queries",
        "day": 27,
        "blockNumber": 3,
        "title": "Component Testing: Querying by Accessibility Role with React Native Testing Library",
        "conceptBudget": {
          "primaryConcept": "RNTL Accessibility Query Invariant",
          "supportingTerms": [
            "`getByRole` / `getByLabelText` (`Testing components using accessible roles and labels rather than testIDs ensures tests verify what screen readers actually perceive`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d27-b2-modern-mobile-e2e-tool-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rntl_rule_demo.js",
            "initialCode": "function getRntlQueryRule() {\n  return 'PREFER_GET_BY_ROLE_AND_GET_BY_LABEL_TEXT_OVER_BRITTLE_TEST_IDS';\n}\n\nconsole.log(getRntlQueryRule());",
            "expectedOutput": "PREFER_GET_BY_ROLE_AND_GET_BY_LABEL_TEXT_OVER_BRITTLE_TEST_IDS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why should React Native component tests query elements by accessibility role instead of testIDs?",
          "expectedStringOutput": "PREFER_GET_BY_ROLE_AND_GET_BY_LABEL_TEXT_OVER_BRITTLE_TEST_IDS",
          "acceptableAnswers": [
            "PREFER_GET_BY_ROLE_AND_GET_BY_LABEL_TEXT_OVER_BRITTLE_TEST_IDS",
            "Prefer getByRole over testIDs",
            "getByRole over testIDs"
          ],
          "primaryMisconceptionId": "MC_MOB_AUTOMATED_TESTING_JEST_MAESTRO",
          "diagnosisMap": {
            "USE_TEST_IDS_ONLY": {
              "misconceptionId": "MC_MOB_AUTOMATED_TESTING_JEST_MAESTRO",
              "errorExplanation": "Standard is: PREFER_GET_BY_ROLE_AND_GET_BY_LABEL_TEXT_OVER_BRITTLE_TEST_IDS.",
              "recoveryPath": {
                "simplerExplanation": "Matches PREFER_GET_BY_ROLE_AND_GET_BY_LABEL_TEXT_OVER_BRITTLE_TEST_IDS.",
                "guidedFixPrompt": "Type PREFER_GET_BY_ROLE_AND_GET_BY_LABEL_TEXT_OVER_BRITTLE_TEST_IDS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "CI/CD Pipelines with Fastlane & EAS Build: Automated Code Signing & OTA Updates",
    "overviewMetaphor": "EAS Build Is an Automated Cloud Aircraft Factory: Instead of compiling iOS and Android binaries on an engineer's laptop, EAS Build in the cloud manages distribution certificates, signs binaries (`distribution: 'store'`), and deploys instant Over-the-Air bug fixes directly to users in seconds (`eas update`).",
    "blocks": [
      {
        "id": "mobile-d28-b1-eas-profile-classifier",
        "day": 28,
        "blockNumber": 1,
        "title": "Release Automation: Classifying EAS Profiles (`production` $\\to$ `'store'` vs `development`)",
        "conceptBudget": {
          "primaryConcept": "EAS Build Profile Target Classifier",
          "supportingTerms": [
            "Profile Name (`'production'` vs `'development'`)",
            "Distribution (`'store'` vs `'internal'`)",
            "Development Client Flag",
            "Status: EAS Build Profile Classified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d27-b1-maestro-flow-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "EAS Build Profile Architecture Ledger",
              "boxes": [
                {
                  "label": "Profile: production",
                  "value": "distribution = 'store', isDevelopmentClient = false (Signed for App Store)",
                  "varType": "Store Build",
                  "isUpdated": true
                },
                {
                  "label": "Profile: development",
                  "value": "distribution = 'internal', isDevelopmentClient = true (Live reload enabled)",
                  "varType": "Dev Build",
                  "isUpdated": false
                },
                {
                  "label": "EAS Resolution",
                  "value": "EAS BUILD PROFILE CLASSIFIED NOMINAL (CLOUD CI/CD SIGNED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "eas_profile_demo.js",
            "initialCode": "function classifyEasProfile(name) {\n  const map = {\n    'development': { distribution: 'internal', isDev: true },\n    'production': { distribution: 'store', isDev: false }\n  };\n  const cfg = map[name];\n  return {\n    profileName: name,\n    distribution: cfg.distribution,\n    isDevelopmentClient: cfg.isDev,\n    status: 'EAS_BUILD_PROFILE_CLASSIFIED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(classifyEasProfile('production')));\nconsole.log(JSON.stringify(classifyEasProfile('development')));",
            "expectedOutput": "{\"profileName\":\"production\",\"distribution\":\"store\",\"isDevelopmentClient\":false,\"status\":\"EAS_BUILD_PROFILE_CLASSIFIED_NOMINAL\"}\n{\"profileName\":\"development\",\"distribution\":\"internal\",\"isDevelopmentClient\":true,\"status\":\"EAS_BUILD_PROFILE_CLASSIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What distribution target is configured for the 'production' EAS build profile?",
          "expectedStringOutput": "store",
          "acceptableAnswers": [
            "store",
            "distribution\":\"store\"",
            "'store'"
          ],
          "primaryMisconceptionId": "MC_MOB_EAS_BUILD_FASTLANE_PROVISIONING",
          "diagnosisMap": {
            "internal": {
              "misconceptionId": "MC_MOB_EAS_BUILD_FASTLANE_PROVISIONING",
              "errorExplanation": "internal is for preview/dev builds. Production builds use distribution: 'store'.",
              "recoveryPath": {
                "simplerExplanation": "Distribution is store.",
                "guidedFixPrompt": "Type store"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d28-b2-eas-update-command-name",
        "day": 28,
        "blockNumber": 2,
        "title": "The Over-The-Air Instant Update CLI: `eas update`",
        "conceptBudget": {
          "primaryConcept": "`eas update` Invariant",
          "supportingTerms": [
            "`eas update` (`The Expo CLI command that publishes JS bundle updates directly to installed devices, bypassing multi-day app store review queues for JS bug fixes`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d28-b1-eas-profile-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "EAS Update Pipeline",
            "codeSnippet": "# 1. Publish instant JS bugfix to production channel:\neas update --branch production --message \"Fix Day 28 navigation edge case\"\n\n# 2. Devices receive new JS bundle on next app launch automatically!",
            "lineNotes": {
              "2": "eas update publishes JS and asset diffs to cloud CDN.",
              "4": "End users receive update instantly without visiting App Store."
            }
          },
          {
            "type": "runnable_code",
            "filename": "eas_update_demo.js",
            "initialCode": "function getEasUpdateCmd() {\n  return 'eas update';\n}\n\nconsole.log(getEasUpdateCmd());",
            "expectedOutput": "eas update",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What command publishes instant Over-The-Air JavaScript updates to production apps?",
          "expectedStringOutput": "eas update",
          "acceptableAnswers": [
            "eas update",
            "'eas update'",
            "eas update command"
          ],
          "primaryMisconceptionId": "MC_MOB_EAS_BUILD_FASTLANE_PROVISIONING",
          "diagnosisMap": {
            "eas build": {
              "misconceptionId": "MC_MOB_EAS_BUILD_FASTLANE_PROVISIONING",
              "errorExplanation": "eas build compiles native binaries. Instant OTA updates use eas update.",
              "recoveryPath": {
                "simplerExplanation": "Type eas update.",
                "guidedFixPrompt": "Type eas update"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d28-b3-ota-updates-native-code-limitation",
        "day": 28,
        "blockNumber": 3,
        "title": "OTA Boundary: When Full Binary Re-builds are Required (Native Code Changes)",
        "conceptBudget": {
          "primaryConcept": "OTA Boundary Invariant",
          "supportingTerms": [
            "OTA Native Boundary (`OTA updates can only update JavaScript and asset bundles; changes to native C++, iOS Pods, or Android Gradle dependencies require a full binary build`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d28-b2-eas-update-command-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ota_boundary_demo.js",
            "initialCode": "function getOtaBoundaryRule() {\n  return 'NATIVE_CODE_CHANGES_REQUIRE_FULL_BINARY_BUILD_AND_APP_STORE_SUBMISSION';\n}\n\nconsole.log(getOtaBoundaryRule());",
            "expectedOutput": "NATIVE_CODE_CHANGES_REQUIRE_FULL_BINARY_BUILD_AND_APP_STORE_SUBMISSION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When is an Over-The-Air update insufficient, requiring a full new binary submission to the app stores?",
          "expectedStringOutput": "NATIVE_CODE_CHANGES_REQUIRE_FULL_BINARY_BUILD_AND_APP_STORE_SUBMISSION",
          "acceptableAnswers": [
            "NATIVE_CODE_CHANGES_REQUIRE_FULL_BINARY_BUILD_AND_APP_STORE_SUBMISSION",
            "Native code changes",
            "When native code changes"
          ],
          "primaryMisconceptionId": "MC_MOB_EAS_BUILD_FASTLANE_PROVISIONING",
          "diagnosisMap": {
            "OTA_ALWAYS_WORKS": {
              "misconceptionId": "MC_MOB_EAS_BUILD_FASTLANE_PROVISIONING",
              "errorExplanation": "Standard is: NATIVE_CODE_CHANGES_REQUIRE_FULL_BINARY_BUILD_AND_APP_STORE_SUBMISSION.",
              "recoveryPath": {
                "simplerExplanation": "Matches NATIVE_CODE_CHANGES_REQUIRE_FULL_BINARY_BUILD_AND_APP_STORE_SUBMISSION.",
                "guidedFixPrompt": "Type NATIVE_CODE_CHANGES_REQUIRE_FULL_BINARY_BUILD_AND_APP_STORE_SUBMISSION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "App Store & Google Play Store Submission: Privacy Manifests & App Bundles",
    "overviewMetaphor": "Staged Rollout Is a Controlled Water Dam Valve: Instead of opening the floodgates to 100% of millions of global users on Day 1, releasing to a $25\\%$ cohort (`STAGED_ROLLOUT_PERCENTAGE_VALIDATED_NOMINAL`) allows crash monitoring in Sentry, protecting 75% of your user base if an unforeseen edge-case occurs.",
    "blocks": [
      {
        "id": "mobile-d29-b1-staged-rollout-validator",
        "day": 29,
        "blockNumber": 1,
        "title": "Store Release: Validating Staged Rollout Percentages ($1 \\le p \\le 100$)",
        "conceptBudget": {
          "primaryConcept": "App Store Staged Rollout Percentage Validator",
          "supportingTerms": [
            "Rollout Percentage ($25\\%$)",
            "Validation Status",
            "Risk Mitigation",
            "Status: Staged Rollout Percentage Validated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d28-b1-eas-profile-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "App Store Staged Rollout Phased Release Ledger",
              "boxes": [
                {
                  "label": "Phase 1 (Day 1)",
                  "value": "rolloutPercentage = 10% (Early adopter telemetry monitoring)",
                  "varType": "Phase 1",
                  "isUpdated": false
                },
                {
                  "label": "Phase 2 (Day 3)",
                  "value": "rolloutPercentage = 25% (VALIDATED NOMINAL - ZERO CRASH SPIKES!)",
                  "varType": "Phase 2",
                  "isUpdated": true
                },
                {
                  "label": "Phase 3 (Day 7)",
                  "value": "rolloutPercentage = 100% (Full global deployment)",
                  "varType": "Phase 3",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rollout_validator_demo.js",
            "initialCode": "function validateRollout(pct) {\n  const ok = pct >= 1 && pct <= 100;\n  return {\n    rolloutPercentage: pct,\n    isRolloutValid: ok,\n    status: ok ? 'STAGED_ROLLOUT_PERCENTAGE_VALIDATED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(validateRollout(25)));\nconsole.log(JSON.stringify(validateRollout(150)));",
            "expectedOutput": "{\"rolloutPercentage\":25,\"isRolloutValid\":true,\"status\":\"STAGED_ROLLOUT_PERCENTAGE_VALIDATED_NOMINAL\"}\n{\"rolloutPercentage\":150,\"isRolloutValid\":false,\"status\":\"DEFECT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a store release rollout percentage is within the valid 1-100% range?",
          "expectedStringOutput": "STAGED_ROLLOUT_PERCENTAGE_VALIDATED_NOMINAL",
          "acceptableAnswers": [
            "STAGED_ROLLOUT_PERCENTAGE_VALIDATED_NOMINAL",
            "status\":\"STAGED_ROLLOUT_PERCENTAGE_VALIDATED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_MOB_APP_STORE_PLAY_STORE_SUBMISSION",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MOB_APP_STORE_PLAY_STORE_SUBMISSION",
              "errorExplanation": "Matches STAGED_ROLLOUT_PERCENTAGE_VALIDATED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type STAGED_ROLLOUT_PERCENTAGE_VALIDATED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d29-b2-android-app-bundle-format-name",
        "day": 29,
        "blockNumber": 2,
        "title": "The Google Play Store Binary Format: `.aab` (Android App Bundle)",
        "conceptBudget": {
          "primaryConcept": "Android App Bundle Invariant",
          "supportingTerms": [
            "`.aab` (`Android App Bundle: Google Play's publishing format that generates optimized, device-tailored APKs, reducing user download sizes by 35%`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d29-b1-staged-rollout-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Android App Bundle vs Legacy APK",
            "codeSnippet": "/* ❌ LEGACY: Monolithic Fat APK (Includes all CPU architectures) */\napp-release.apk (95 MB download)\n\n/* ✅ MODERN: Android App Bundle (.aab) */\napp-release.aab (Play Store serves dynamic 18 MB APK tailored to user CPU/Screen!)",
            "lineNotes": {
              "2": "Fat APKs bloat user downloads.",
              "5": ".aab delivers device-optimized dynamic APKs."
            }
          },
          {
            "type": "runnable_code",
            "filename": "aab_format_demo.js",
            "initialCode": "function getAabFormat() {\n  return '.aab';\n}\n\nconsole.log(getAabFormat());",
            "expectedOutput": ".aab",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the mandatory file extension for publishing production applications to Google Play?",
          "expectedStringOutput": ".aab",
          "acceptableAnswers": [
            ".aab",
            "'.aab'",
            "aab",
            "Android App Bundle"
          ],
          "primaryMisconceptionId": "MC_MOB_APP_STORE_PLAY_STORE_SUBMISSION",
          "diagnosisMap": {
            ".apk": {
              "misconceptionId": "MC_MOB_APP_STORE_PLAY_STORE_SUBMISSION",
              "errorExplanation": "Google Play requires Android App Bundles (.aab) for all new apps.",
              "recoveryPath": {
                "simplerExplanation": "Type .aab.",
                "guidedFixPrompt": "Type .aab"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d29-b3-apple-privacy-manifests",
        "day": 29,
        "blockNumber": 3,
        "title": "Apple Compliance: Mandatory Privacy Manifests (`PrivacyInfo.xcprivacy`)",
        "conceptBudget": {
          "primaryConcept": "Privacy Manifest Invariant",
          "supportingTerms": [
            "`PrivacyInfo.xcprivacy` (`Apple's required privacy manifest file detailing all third-party SDK data collection and required reason APIs`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d29-b2-android-app-bundle-format-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "privacy_manifest_demo.js",
            "initialCode": "function getPrivacyManifestRule() {\n  return 'DECLARE_REQUIRED_REASON_APIS_IN_PRIVACY_INFO_XCPRIVACY_FOR_APPLE_APPROVAL';\n}\n\nconsole.log(getPrivacyManifestRule());",
            "expectedOutput": "DECLARE_REQUIRED_REASON_APIS_IN_PRIVACY_INFO_XCPRIVACY_FOR_APPLE_APPROVAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What file must be configured to pass Apple App Store review for Required Reason APIs?",
          "expectedStringOutput": "DECLARE_REQUIRED_REASON_APIS_IN_PRIVACY_INFO_XCPRIVACY_FOR_APPLE_APPROVAL",
          "acceptableAnswers": [
            "DECLARE_REQUIRED_REASON_APIS_IN_PRIVACY_INFO_XCPRIVACY_FOR_APPLE_APPROVAL",
            "PrivacyInfo.xcprivacy",
            "Privacy manifests in PrivacyInfo.xcprivacy"
          ],
          "primaryMisconceptionId": "MC_MOB_APP_STORE_PLAY_STORE_SUBMISSION",
          "diagnosisMap": {
            "NO_MANIFEST": {
              "misconceptionId": "MC_MOB_APP_STORE_PLAY_STORE_SUBMISSION",
              "errorExplanation": "Standard is: DECLARE_REQUIRED_REASON_APIS_IN_PRIVACY_INFO_XCPRIVACY_FOR_APPLE_APPROVAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches DECLARE_REQUIRED_REASON_APIS_IN_PRIVACY_INFO_XCPRIVACY_FOR_APPLE_APPROVAL.",
                "guidedFixPrompt": "Type DECLARE_REQUIRED_REASON_APIS_IN_PRIVACY_INFO_XCPRIVACY_FOR_APPLE_APPROVAL"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Cross-Platform Mobile Application Suite",
    "overviewMetaphor": "Final Capstone Synthesis: The complete sovereign cross-platform mobile application master suite: 1. Runtime Architecture & Core Layouts; 2. Navigation & Native Hardware APIs; 3. High-Performance Physics & Virtualization; 4. Native Security & Optimization; 5. Automated Testing & Store Deployment.",
    "blocks": [
      {
        "id": "mobile-d30-b1-sovereign-mobile-suite-orchestrator",
        "day": 30,
        "blockNumber": 1,
        "title": "Sovereign Mobile Application Suite Orchestration",
        "conceptBudget": {
          "primaryConcept": "Sovereign Mobile Application Suite Orchestrator",
          "supportingTerms": [
            "Architecture Module",
            "Native Hardware Module",
            "Physics & Routing Module",
            "Security & A11y Module",
            "Testing & Deployment Module"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d29-b3-apple-privacy-manifests",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Sovereign Mobile Application Master Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Initializes JSI C++ bridge, Safe Area layouts & 48dp touch targets",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Mounts Native Stack & Bottom Tabs with FaceID biometrics & offline SQLite",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Executes Reanimated 3 worklets, Gesture Handler physics & FlatList virtualization",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Enforces iOS Keychain AES-256 storage, VoiceOver a11y & Maestro E2E test flows",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Certifies Sovereign Cross-Platform Mobile Application Master Suite!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_orchestrator_demo.js",
            "initialCode": "function orchestrateMobileSuite(arch, nat, phys, sec, dep) {\n  const ok = arch && nat && phys && sec && dep;\n  return {\n    architectureModule: arch,\n    nativeModule: nat,\n    physicsModule: phys,\n    securityModule: sec,\n    deploymentModule: dep,\n    certified: ok,\n    status: ok ? 'SOVEREIGN_MOBILE_APP_MASTER_CERTIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(orchestrateMobileSuite(true, true, true, true, true)));",
            "expectedOutput": "{\"architectureModule\":true,\"nativeModule\":true,\"physicsModule\":true,\"securityModule\":true,\"deploymentModule\":true,\"certified\":true,\"status\":\"SOVEREIGN_MOBILE_APP_MASTER_CERTIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that all 5 mobile engineering modules are certified nominal?",
          "expectedStringOutput": "SOVEREIGN_MOBILE_APP_MASTER_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "SOVEREIGN_MOBILE_APP_MASTER_CERTIFIED_NOMINAL",
            "status\":\"SOVEREIGN_MOBILE_APP_MASTER_CERTIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_MOB_CAPSTONE_SOVEREIGN_MOBILE_SUITE",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_MOB_CAPSTONE_SOVEREIGN_MOBILE_SUITE",
              "errorExplanation": "Matches SOVEREIGN_MOBILE_APP_MASTER_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type SOVEREIGN_MOBILE_APP_MASTER_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d30-b2-capstone-audit-score",
        "day": 30,
        "blockNumber": 2,
        "title": "Platform-Wide Mobile Engineering Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Capstone Audit Score Invariant",
          "supportingTerms": [
            "Score: 100/100",
            "Zero Defect Invariant",
            "Sovereign Tier Certification"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d30-b1-sovereign-mobile-suite-orchestrator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_audit_score_demo.js",
            "initialCode": "function auditCapstone() {\n  return {\n    certified: true,\n    score: '100/100',\n    tier: 'SOVEREIGN_MOBILE_APP_MASTER_CERTIFIED'\n  };\n}\n\nconsole.log(JSON.stringify(auditCapstone()));",
            "expectedOutput": "{\"certified\":true,\"score\":\"100/100\",\"tier\":\"SOVEREIGN_MOBILE_APP_MASTER_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit score is awarded upon completing the Sovereign Mobile Application Capstone?",
          "expectedStringOutput": "100/100",
          "acceptableAnswers": [
            "100/100",
            "score\":\"100/100\"",
            "100"
          ],
          "primaryMisconceptionId": "MC_MOB_CAPSTONE_SOVEREIGN_MOBILE_SUITE",
          "diagnosisMap": {
            "90/100": {
              "misconceptionId": "MC_MOB_CAPSTONE_SOVEREIGN_MOBILE_SUITE",
              "errorExplanation": "Full verification achieves 100/100.",
              "recoveryPath": {
                "simplerExplanation": "Score is 100/100.",
                "guidedFixPrompt": "Type 100/100"
              }
            }
          }
        }
      },
      {
        "id": "mobile-d30-b3-capstone-conferral",
        "day": 30,
        "blockNumber": 3,
        "title": "Conferral of Sovereign Mobile Application Engineer Credential",
        "conceptBudget": {
          "primaryConcept": "Sovereign Mobile Engineer Credential",
          "supportingTerms": [
            "Platform Mastery",
            "Cross-Platform React Native Specialization",
            "Production Certified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "mobile-d30-b2-capstone-audit-score",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_conferral_demo.js",
            "initialCode": "console.log('🏆 CONFERRED: SOVEREIGN CROSS-PLATFORM MOBILE APPLICATION ENGINEER [PINIT CAREER OS v1.0 CERTIFIED]');",
            "expectedOutput": "🏆 CONFERRED: SOVEREIGN CROSS-PLATFORM MOBILE APPLICATION ENGINEER [PINIT CAREER OS v1.0 CERTIFIED]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What credential title is officially conferred upon course graduation?",
          "expectedStringOutput": "🏆 CONFERRED: SOVEREIGN CROSS-PLATFORM MOBILE APPLICATION ENGINEER [PINIT CAREER OS v1.0 CERTIFIED]",
          "acceptableAnswers": [
            "🏆 CONFERRED: SOVEREIGN CROSS-PLATFORM MOBILE APPLICATION ENGINEER [PINIT CAREER OS v1.0 CERTIFIED]",
            "SOVEREIGN CROSS-PLATFORM MOBILE APPLICATION ENGINEER"
          ],
          "primaryMisconceptionId": "MC_MOB_CAPSTONE_SOVEREIGN_MOBILE_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_MOB_CAPSTONE_SOVEREIGN_MOBILE_SUITE",
              "errorExplanation": "Matches conferral header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type 🏆 CONFERRED: SOVEREIGN CROSS-PLATFORM MOBILE APPLICATION ENGINEER [PINIT CAREER OS v1.0 CERTIFIED]"
              }
            }
          }
        }
      }
    ]
  }
];
