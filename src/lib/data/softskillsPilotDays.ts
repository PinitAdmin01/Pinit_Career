import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const SOFTSKILLS_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Professional Written Communication & Email Architecture: The BLUF Principle",
    "overviewMetaphor": "The BLUF Principle Is a Newspaper Headline: Executives receive 200 emails a day; if your bottom-line request is buried on line 18 after 3 paragraphs of background backstory, they will miss the deadline; putting the core decision in sentence 1 (`[Action Required: by 5 PM]`) guarantees immediate action.",
    "blocks": [
      {
        "id": "comm-d1-b1-bluf-email-formatter",
        "day": 1,
        "blockNumber": 1,
        "title": "BLUF Architecture: `[Action Required: by 5 PM]` + Bottom Line Up Front",
        "conceptBudget": {
          "primaryConcept": "BLUF Email Structure & Urgency Tag Validator",
          "supportingTerms": [
            "Subject Prefix (`'[Action Required: by 5 PM]'`)",
            "Bottom Line Up Front",
            "Concise Character Length",
            "Call to Action",
            "Status: BLUF Email Formatted Nominal"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Executive Email Architecture Ledger",
              "boxes": [
                {
                  "label": "Subject Tag",
                  "value": "'[Action Required: by Friday 5 PM]' (Clear deadline & action signal)",
                  "varType": "Tag",
                  "isUpdated": false
                },
                {
                  "label": "Sentence 1 (BLUF)",
                  "value": "'We need approval to merge the auth refactor into production today.'",
                  "varType": "BLUF",
                  "isUpdated": false
                },
                {
                  "label": "Executive Verdict",
                  "value": "BLUF EMAIL FORMATTED NOMINAL (INSTANT CLARITY!)",
                  "varType": "Verdict",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bluf_demo.js",
            "initialCode": "function formatBluf(tag, bluf, cta) {\n  const ok = tag.startsWith('[') && tag.endsWith(']') && bluf.trim().length >= 10;\n  return {\n    tag,\n    bluf,\n    cta,\n    isCompliant: ok,\n    status: ok ? 'BLUF_EMAIL_FORMATTED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(formatBluf('[Action Required: by 5 PM]', 'We need approval to merge auth refactor today.', 'Reply with LGTM.')));",
            "expectedOutput": "{\"tag\":\"[Action Required: by 5 PM]\",\"bluf\":\"We need approval to merge auth refactor today.\",\"cta\":\"Reply with LGTM.\",\"isCompliant\":true,\"status\":\"BLUF_EMAIL_FORMATTED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that an email conforms to the BLUF executive communication standard?",
          "expectedStringOutput": "BLUF_EMAIL_FORMATTED_NOMINAL",
          "acceptableAnswers": [
            "BLUF_EMAIL_FORMATTED_NOMINAL",
            "status\":\"BLUF_EMAIL_FORMATTED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_PROFESSIONAL_WRITTEN_COMMUNICATION_BLUF",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SK_PROFESSIONAL_WRITTEN_COMMUNICATION_BLUF",
              "errorExplanation": "Valid tag and concise first sentence awards BLUF_EMAIL_FORMATTED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches BLUF_EMAIL_FORMATTED_NOMINAL.",
                "guidedFixPrompt": "Type BLUF_EMAIL_FORMATTED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d1-b2-bluf-acronym-expansion",
        "day": 1,
        "blockNumber": 2,
        "title": "The BLUF Acronym: Bottom Line Up Front",
        "conceptBudget": {
          "primaryConcept": "BLUF Invariant",
          "supportingTerms": [
            "BLUF (`Bottom Line Up Front`: A military and executive communication standard where the conclusion or request precedes background context)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d1-b1-bluf-email-formatter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "BLUF Structure Breakdown",
            "codeSnippet": "// ❌ BURIED:   Hello Dave, hope you had a good weekend. Last month we noticed some latency issues on server 3...\n//              [3 paragraphs later] ...so please click approve by 5 PM today.\n// ✅ BLUF:     [Action Required: by 5 PM] Database Migration Approval\n//              Hi Dave, we need your sign-off by 5 PM to execute tonight's DB migration.",
            "lineNotes": {
              "1": "Buried request anti-pattern.",
              "2": "Missed deadline risk.",
              "3": "Clear subject line.",
              "4": "Bottom line in sentence 1."
            }
          },
          {
            "type": "runnable_code",
            "filename": "bluf_acronym_demo.js",
            "initialCode": "function getBlufMeaning() {\n  return 'Bottom Line Up Front';\n}\n\nconsole.log(getBlufMeaning());",
            "expectedOutput": "Bottom Line Up Front",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does the executive communication acronym 'BLUF' stand for?",
          "expectedStringOutput": "Bottom Line Up Front",
          "acceptableAnswers": [
            "Bottom Line Up Front",
            "bottom line up front",
            "'Bottom Line Up Front'"
          ],
          "primaryMisconceptionId": "MC_SK_PROFESSIONAL_WRITTEN_COMMUNICATION_BLUF",
          "diagnosisMap": {
            "Best Logical User Feedback": {
              "misconceptionId": "MC_SK_PROFESSIONAL_WRITTEN_COMMUNICATION_BLUF",
              "errorExplanation": "BLUF stands for Bottom Line Up Front.",
              "recoveryPath": {
                "simplerExplanation": "Type Bottom Line Up Front.",
                "guidedFixPrompt": "Type Bottom Line Up Front"
              }
            }
          }
        }
      },
      {
        "id": "comm-d1-b3-eliminating-passive-aggressive-phrasing",
        "day": 1,
        "blockNumber": 3,
        "title": "Tone Engineering: Replacing Passive-Aggressive Phrasing with Empathy",
        "conceptBudget": {
          "primaryConcept": "Empathetic Tone Invariant",
          "supportingTerms": [
            "Tone Engineering (Replacing hostile phrases like 'As stated previously' or 'Per my last email' with helpful re-shares: 'Re-sharing the document link below for quick reference')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d1-b2-bluf-acronym-expansion",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "tone_engineering_demo.js",
            "initialCode": "function getConstructiveToneAlternative() {\n  return 'RE_SHARING_THE_LINK_BELOW_FOR_CONVENIENCE';\n}\n\nconsole.log(getConstructiveToneAlternative());",
            "expectedOutput": "RE_SHARING_THE_LINK_BELOW_FOR_CONVENIENCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What constructive phrase professionally replaces the passive-aggressive anti-pattern 'Per my last email'?",
          "expectedStringOutput": "RE_SHARING_THE_LINK_BELOW_FOR_CONVENIENCE",
          "acceptableAnswers": [
            "RE_SHARING_THE_LINK_BELOW_FOR_CONVENIENCE",
            "Re-sharing the link below for convenience",
            "Re-sharing link for convenience"
          ],
          "primaryMisconceptionId": "MC_SK_PROFESSIONAL_WRITTEN_COMMUNICATION_BLUF",
          "diagnosisMap": {
            "AS_STATED": {
              "misconceptionId": "MC_SK_PROFESSIONAL_WRITTEN_COMMUNICATION_BLUF",
              "errorExplanation": "As stated is passive-aggressive. Empathetic alternative is: RE_SHARING_THE_LINK_BELOW_FOR_CONVENIENCE.",
              "recoveryPath": {
                "simplerExplanation": "Matches RE_SHARING_THE_LINK_BELOW_FOR_CONVENIENCE.",
                "guidedFixPrompt": "Type RE_SHARING_THE_LINK_BELOW_FOR_CONVENIENCE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Technical Documentation & README Engineering: The Standard 5-Section Architecture",
    "overviewMetaphor": "A Technical README Is the Owner's Manual in a New Car's Glovebox: If the manual has no Quickstart ignition instructions, the driver is stranded; an elite 5-section README (`Overview`, `Quickstart`, `Architecture`, `API`, `Contributing`) allows any newly hired engineer to boot the engine and drive safely on Day 1.",
    "blocks": [
      {
        "id": "comm-d2-b1-readme-completeness-auditor",
        "day": 2,
        "blockNumber": 1,
        "title": "Technical README: Auditing All 5 Required Structural Sections",
        "conceptBudget": {
          "primaryConcept": "Technical README 5-Section Completeness Auditor",
          "supportingTerms": [
            "Overview Section",
            "Quickstart Section",
            "Architecture Section",
            "API Reference Section",
            "Contributing Section",
            "Status: Technical README 5 Sections Verified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d1-b1-bluf-email-formatter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Technical README 5-Section Architecture Ledger",
              "boxes": [
                {
                  "label": "1. Overview & Value",
                  "value": "What problem does this project solve?",
                  "varType": "Section 1",
                  "isUpdated": false
                },
                {
                  "label": "2. Quickstart & Install",
                  "value": "Exact terminal commands to run locally",
                  "varType": "Section 2",
                  "isUpdated": false
                },
                {
                  "label": "3. Architecture Flow",
                  "value": "System diagram & component interactions",
                  "varType": "Section 3",
                  "isUpdated": false
                },
                {
                  "label": "4. API Reference",
                  "value": "Endpoints, parameters, and environment config",
                  "varType": "Section 4",
                  "isUpdated": false
                },
                {
                  "label": "5. Contributing",
                  "value": "PR workflow & lint standards (VERIFIED NOMINAL!)",
                  "varType": "Section 5",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "readme_audit_demo.js",
            "initialCode": "function auditReadme(sections) {\n  const req = ['Overview', 'Quickstart', 'Architecture', 'API', 'Contributing'];\n  const missing = req.filter(r => !sections.some(s => s.toLowerCase().includes(r.toLowerCase())));\n  const ok = missing.length === 0;\n  return {\n    missing,\n    isProductionReady: ok,\n    status: ok ? 'TECHNICAL_README_5_SECTIONS_VERIFIED_NOMINAL' : 'INCOMPLETE'\n  };\n}\n\nconst secs = ['Project Overview', 'Quickstart Guide', 'System Architecture Diagram', 'API Reference', 'Contributing Guidelines'];\nconsole.log(JSON.stringify(auditReadme(secs)));",
            "expectedOutput": "{\"missing\":[],\"isProductionReady\":true,\"status\":\"TECHNICAL_README_5_SECTIONS_VERIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a technical README contains all 5 required production sections?",
          "expectedStringOutput": "TECHNICAL_README_5_SECTIONS_VERIFIED_NOMINAL",
          "acceptableAnswers": [
            "TECHNICAL_README_5_SECTIONS_VERIFIED_NOMINAL",
            "status\":\"TECHNICAL_README_5_SECTIONS_VERIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_TECHNICAL_DOCUMENTATION_README_WRITING",
          "diagnosisMap": {
            "INCOMPLETE": {
              "misconceptionId": "MC_SK_TECHNICAL_DOCUMENTATION_README_WRITING",
              "errorExplanation": "Contains all 5 sections: TECHNICAL_README_5_SECTIONS_VERIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches TECHNICAL_README_5_SECTIONS_VERIFIED_NOMINAL.",
                "guidedFixPrompt": "Type TECHNICAL_README_5_SECTIONS_VERIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d2-b2-mandatory-readme-sections-count",
        "day": 2,
        "blockNumber": 2,
        "title": "The 5 Mandatory README Sections",
        "conceptBudget": {
          "primaryConcept": "README Sections Invariant",
          "supportingTerms": [
            "5 Mandatory Sections (Overview, Quickstart, Architecture, API Reference, Contributing)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d2-b1-readme-completeness-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Standard README Structure",
            "codeSnippet": "# 📦 Project Name\n\n## 1. Overview\nHigh-level purpose and core business problem solved.\n\n## 2. Quickstart\n```bash\ngit clone https://github.com/org/repo.git\ncd repo && npm install && npm run dev\n```\n\n## 3. Architecture\nSystem diagram and data flow overview.\n\n## 4. API & Config\nEnvironment variables and endpoint schemas.\n\n## 5. Contributing\nBranching and code review standards.",
            "lineNotes": {
              "1": "Project title.",
              "3": "Section 1: Overview.",
              "6": "Section 2: Quickstart.",
              "12": "Section 3: Architecture.",
              "15": "Section 4: API.",
              "18": "Section 5: Contributing."
            }
          },
          {
            "type": "runnable_code",
            "filename": "readme_sections_count_demo.js",
            "initialCode": "function getReadmeSectionsCount() {\n  return 5;\n}\n\nconsole.log(getReadmeSectionsCount());",
            "expectedOutput": "5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many mandatory structural sections comprise an enterprise-grade developer README?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "5 sections",
            "five"
          ],
          "primaryMisconceptionId": "MC_SK_TECHNICAL_DOCUMENTATION_README_WRITING",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_SK_TECHNICAL_DOCUMENTATION_README_WRITING",
              "errorExplanation": "There are 5: Overview, Quickstart, Architecture, API, and Contributing.",
              "recoveryPath": {
                "simplerExplanation": "Type 5.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      },
      {
        "id": "comm-d2-b3-quickstart-zero-assumptions-standard",
        "day": 2,
        "blockNumber": 3,
        "title": "The Zero-Assumption Quickstart Standard: Copy-Paste Executable Commands",
        "conceptBudget": {
          "primaryConcept": "Zero-Assumption Quickstart Invariant",
          "supportingTerms": [
            "Zero-Assumption (`Every command in Quickstart must run verbatim on a fresh machine without hidden undocumented global dependencies`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d2-b2-mandatory-readme-sections-count",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "quickstart_standard_demo.js",
            "initialCode": "function getQuickstartStandard() {\n  return 'COMMANDS_MUST_EXECUTE_VERBATIM_ON_A_CLEAN_MACHINE_WITH_ZERO_HIDDEN_ASSUMPTIONS';\n}\n\nconsole.log(getQuickstartStandard());",
            "expectedOutput": "COMMANDS_MUST_EXECUTE_VERBATIM_ON_A_CLEAN_MACHINE_WITH_ZERO_HIDDEN_ASSUMPTIONS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core quality standard governs the commands provided in a technical Quickstart guide?",
          "expectedStringOutput": "COMMANDS_MUST_EXECUTE_VERBATIM_ON_A_CLEAN_MACHINE_WITH_ZERO_HIDDEN_ASSUMPTIONS",
          "acceptableAnswers": [
            "COMMANDS_MUST_EXECUTE_VERBATIM_ON_A_CLEAN_MACHINE_WITH_ZERO_HIDDEN_ASSUMPTIONS",
            "Execute verbatim on clean machine",
            "Zero assumptions"
          ],
          "primaryMisconceptionId": "MC_SK_TECHNICAL_DOCUMENTATION_README_WRITING",
          "diagnosisMap": {
            "ASSUMES_SETUP": {
              "misconceptionId": "MC_SK_TECHNICAL_DOCUMENTATION_README_WRITING",
              "errorExplanation": "Quickstart must require no guessing: COMMANDS_MUST_EXECUTE_VERBATIM_ON_A_CLEAN_MACHINE_WITH_ZERO_HIDDEN_ASSUMPTIONS.",
              "recoveryPath": {
                "simplerExplanation": "Matches COMMANDS_MUST_EXECUTE_VERBATIM_ON_A_CLEAN_MACHINE_WITH_ZERO_HIDDEN_ASSUMPTIONS.",
                "guidedFixPrompt": "Type COMMANDS_MUST_EXECUTE_VERBATIM_ON_A_CLEAN_MACHINE_WITH_ZERO_HIDDEN_ASSUMPTIONS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Active Listening & Paraphrasing in Engineering Meetings: The 3-Step Protocol",
    "overviewMetaphor": "Active Listening Is an Echo Cancellation System in Acoustic Audio: Instead of preparing your defensive counter-argument while the speaker is talking, you record their signal, reflect the core intention back to them (\"What I am hearing from Sarah is...\"), and get mutual validation before proposing an engineering solution.",
    "blocks": [
      {
        "id": "comm-d3-b1-active-listening-paraphrase-generator",
        "day": 3,
        "blockNumber": 1,
        "title": "Active Listening: 3-Step Intent Reflection with Speaker Validation",
        "conceptBudget": {
          "primaryConcept": "Active Listening 3-Step Paraphrase Generator",
          "supportingTerms": [
            "Speaker Name (`'Sarah'`)",
            "Core Technical Point (`'shard database'`)",
            "Reflection String",
            "Paraphrase Valid (`true`)",
            "Status: Active Listening Paraphrase Generated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d2-b1-readme-completeness-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Active Listening 3-Step Protocol Ledger",
              "boxes": [
                {
                  "label": "Step 1: Silent Listening",
                  "value": "Absorb speaker message without defensive interruption",
                  "varType": "Listen",
                  "isUpdated": false
                },
                {
                  "label": "Step 2: Reflect Intent",
                  "value": "'What I am hearing from Sarah is that we need to shard DB...'",
                  "varType": "Reflect",
                  "isUpdated": false
                },
                {
                  "label": "Step 3: Validate Alignment",
                  "value": "'Does that accurately reflect your intent?' (PARAPHRASE GENERATED NOMINAL!)",
                  "varType": "Validate",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "active_listening_demo.js",
            "initialCode": "function reflectIntent(speaker, point) {\n  const str = `What I am hearing from ${speaker} is that ${point}. Does that accurately reflect your intent?`;\n  return {\n    speaker,\n    point,\n    reflection: str,\n    status: 'ACTIVE_LISTENING_PARAPHRASE_GENERATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(reflectIntent('Sarah', 'we need to shard database before peak traffic')));",
            "expectedOutput": "{\"speaker\":\"Sarah\",\"point\":\"we need to shard database before peak traffic\",\"reflection\":\"What I am hearing from Sarah is that we need to shard database before peak traffic. Does that accurately reflect your intent?\",\"status\":\"ACTIVE_LISTENING_PARAPHRASE_GENERATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What closing validation question completes the active listening intent reflection protocol?",
          "expectedStringOutput": "Does that accurately reflect your intent?",
          "acceptableAnswers": [
            "Does that accurately reflect your intent?",
            "Does that accurately reflect your intent",
            "Is that accurate?"
          ],
          "primaryMisconceptionId": "MC_SK_ACTIVE_LISTENING_PARAPHRASING_INTENT",
          "diagnosisMap": {
            "Are you done?": {
              "misconceptionId": "MC_SK_ACTIVE_LISTENING_PARAPHRASING_INTENT",
              "errorExplanation": "Validating alignment uses: Does that accurately reflect your intent?.",
              "recoveryPath": {
                "simplerExplanation": "Question is: Does that accurately reflect your intent?.",
                "guidedFixPrompt": "Type Does that accurately reflect your intent?"
              }
            }
          }
        }
      },
      {
        "id": "comm-d3-b2-active-listening-protocol-steps-count",
        "day": 3,
        "blockNumber": 2,
        "title": "The 3 Steps: Listen $\\to$ Reflect $\\to$ Validate",
        "conceptBudget": {
          "primaryConcept": "Active Listening Steps Invariant",
          "supportingTerms": [
            "3 Protocol Steps (1. Listen without interrupting, 2. Reflect core intention, 3. Validate mutual understanding)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d3-b1-active-listening-paraphrase-generator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "3 Steps of Active Listening",
            "codeSnippet": "// Step 1: LISTEN   -> Stop thinking about your rebuttal; focus 100% on speaker's words\n// Step 2: REFLECT  -> Paraphrase their underlying technical concern in your own vocabulary\n// Step 3: VALIDATE -> Ask for confirmation before transitioning into problem-solving",
            "lineNotes": {
              "1": "Step 1: Attentive absorption.",
              "2": "Step 2: Intent translation.",
              "3": "Step 3: Verification confirmation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "listening_steps_demo.js",
            "initialCode": "function getListeningSteps() {\n  return 3;\n}\n\nconsole.log(getListeningSteps());",
            "expectedOutput": "3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many sequential steps make up the structured active listening paraphrasing protocol?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "3 steps",
            "three"
          ],
          "primaryMisconceptionId": "MC_SK_ACTIVE_LISTENING_PARAPHRASING_INTENT",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_SK_ACTIVE_LISTENING_PARAPHRASING_INTENT",
              "errorExplanation": "There are 3 steps: Listen, Reflect, and Validate.",
              "recoveryPath": {
                "simplerExplanation": "Type 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "comm-d3-b3-avoiding-defensive-interruptions",
        "day": 3,
        "blockNumber": 3,
        "title": "Eliminating Defensive Interruptions During Technical Critiques",
        "conceptBudget": {
          "primaryConcept": "Non-Defensive Receptive Invariant",
          "supportingTerms": [
            "Non-Defensive Posture (`Allowing the speaker to finish their critique completely before speaking; premature defense signals insecurity and blocks root-cause understanding`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d3-b2-active-listening-protocol-steps-count",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "non_defensive_demo.js",
            "initialCode": "function getInterruptionRule() {\n  return 'ALLOW_SPEAKER_TO_FINISH_COMPLETELY_BEFORE_SPEAKING';\n}\n\nconsole.log(getInterruptionRule());",
            "expectedOutput": "ALLOW_SPEAKER_TO_FINISH_COMPLETELY_BEFORE_SPEAKING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What fundamental rule governs verbal turn-taking during technical architecture reviews?",
          "expectedStringOutput": "ALLOW_SPEAKER_TO_FINISH_COMPLETELY_BEFORE_SPEAKING",
          "acceptableAnswers": [
            "ALLOW_SPEAKER_TO_FINISH_COMPLETELY_BEFORE_SPEAKING",
            "Allow speaker to finish",
            "Do not interrupt"
          ],
          "primaryMisconceptionId": "MC_SK_ACTIVE_LISTENING_PARAPHRASING_INTENT",
          "diagnosisMap": {
            "INTERRUPT_EARLY": {
              "misconceptionId": "MC_SK_ACTIVE_LISTENING_PARAPHRASING_INTENT",
              "errorExplanation": "Rule is: ALLOW_SPEAKER_TO_FINISH_COMPLETELY_BEFORE_SPEAKING.",
              "recoveryPath": {
                "simplerExplanation": "Matches ALLOW_SPEAKER_TO_FINISH_COMPLETELY_BEFORE_SPEAKING.",
                "guidedFixPrompt": "Type ALLOW_SPEAKER_TO_FINISH_COMPLETELY_BEFORE_SPEAKING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Asynchronous Communication & Slack/Teams Etiquette: The \"No-Hello\" Standard",
    "overviewMetaphor": "The \"No-Hello\" Rule Is a Self-Contained Shipping Package: Sending a bare 'Hi' and waiting for a reply is like sending an empty box with a note saying 'I will send the actual item later'; an elite async engineer packages the greeting, context, question, and links together in one single delivery (`ASYNC_MESSAGE_QUALITY_COMPLIANT_NOMINAL`).",
    "blocks": [
      {
        "id": "comm-d4-b1-async-no-hello-auditor",
        "day": 4,
        "blockNumber": 1,
        "title": "Async Etiquette: Auditing Messages Against the \"No-Hello\" Anti-Pattern",
        "conceptBudget": {
          "primaryConcept": "Asynchronous Message Quality & No-Hello Auditor",
          "supportingTerms": [
            "Bare Greeting Anti-Pattern (`'Hi'` $\\implies$ Defect)",
            "Actionable Question Present",
            "Message Character Length",
            "Status: Async Message Quality Compliant Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d3-b1-active-listening-paraphrase-generator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Asynchronous Message Quality Ledger",
              "boxes": [
                {
                  "label": "Bare 'Hey' Anti-Pattern",
                  "value": "'Hi' (Forces context switch without providing actionable information -> DEFECT)",
                  "varType": "Anti-Pattern",
                  "isUpdated": false
                },
                {
                  "label": "High-Signal Async Package",
                  "value": "'Hi Dave, could you review auth PR #42? Link: github.com/org/repo/pull/42'",
                  "varType": "High-Signal",
                  "isUpdated": false
                },
                {
                  "label": "Async Compliance",
                  "value": "ASYNC MESSAGE QUALITY COMPLIANT NOMINAL (NO-HELLO SATISFIED!)",
                  "varType": "Compliance",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "async_no_hello_demo.js",
            "initialCode": "function auditAsync(msg) {\n  const text = msg.trim();\n  const isBare = /^(hey|hi|hello|morning)[.! ]*$/i.test(text);\n  const ok = !isBare && text.includes('?') && text.length >= 25;\n  return {\n    isBareGreeting: isBare,\n    isCompliant: ok,\n    status: ok ? 'ASYNC_MESSAGE_QUALITY_COMPLIANT_NOMINAL' : 'ASYNC_MESSAGE_DEFECT_NO_HELLO_VIOLATION'\n  };\n}\n\nconsole.log(JSON.stringify(auditAsync('Hi Dave, could you review auth PR #42 when you get a chance?')));\nconsole.log(JSON.stringify(auditAsync('Hi')));",
            "expectedOutput": "{\"isBareGreeting\":false,\"isCompliant\":true,\"status\":\"ASYNC_MESSAGE_QUALITY_COMPLIANT_NOMINAL\"}\n{\"isBareGreeting\":true,\"isCompliant\":false,\"status\":\"ASYNC_MESSAGE_DEFECT_NO_HELLO_VIOLATION\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What violation status is triggered when sending a bare 'Hi' message on Slack without context?",
          "expectedStringOutput": "ASYNC_MESSAGE_DEFECT_NO_HELLO_VIOLATION",
          "acceptableAnswers": [
            "ASYNC_MESSAGE_DEFECT_NO_HELLO_VIOLATION",
            "status\":\"ASYNC_MESSAGE_DEFECT_NO_HELLO_VIOLATION\"",
            "No-hello violation"
          ],
          "primaryMisconceptionId": "MC_SK_ASYNC_COMMUNICATION_SLACK_ETIQUETTE",
          "diagnosisMap": {
            "VALID": {
              "misconceptionId": "MC_SK_ASYNC_COMMUNICATION_SLACK_ETIQUETTE",
              "errorExplanation": "Bare greetings waste time: ASYNC_MESSAGE_DEFECT_NO_HELLO_VIOLATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches ASYNC_MESSAGE_DEFECT_NO_HELLO_VIOLATION.",
                "guidedFixPrompt": "Type ASYNC_MESSAGE_DEFECT_NO_HELLO_VIOLATION"
              }
            }
          }
        }
      },
      {
        "id": "comm-d4-b2-no-hello-rule-name",
        "day": 4,
        "blockNumber": 2,
        "title": "The Universal Async Collaboration Standard: NO_HELLO_RULE",
        "conceptBudget": {
          "primaryConcept": "NO_HELLO_RULE Invariant",
          "supportingTerms": [
            "`NO_HELLO_RULE` (The industry standard practice of including your greeting, question, relevant context, and links in the very first message sent)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d4-b1-async-no-hello-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "No-Hello Communication Transformation",
            "codeSnippet": "// ❌ ASYNC DEFECT (30 minute delay):\n// 10:00 AM: \"Hey\"\n// 10:15 AM: \"Hey, what's up?\"\n// 10:16 AM: \"Do you have the prod DB password?\"\n//\n// ✅ ASYNC EXCELLENCE (Single atomic message):\n// 10:00 AM: \"Hi Sarah, what is the staging DB host? Trying to test the auth migration. Thanks!\"",
            "lineNotes": {
              "1": "Wasted context switch.",
              "2": "Ping.",
              "3": "Delayed response.",
              "4": "Belated question.",
              "6": "Single atomic message."
            }
          },
          {
            "type": "runnable_code",
            "filename": "no_hello_name_demo.js",
            "initialCode": "function getNoHelloRule() {\n  return 'NO_HELLO_RULE';\n}\n\nconsole.log(getNoHelloRule());",
            "expectedOutput": "NO_HELLO_RULE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the official industry name for the asynchronous communication standard prohibiting bare greetings?",
          "expectedStringOutput": "NO_HELLO_RULE",
          "acceptableAnswers": [
            "NO_HELLO_RULE",
            "No-Hello Rule",
            "No hello rule"
          ],
          "primaryMisconceptionId": "MC_SK_ASYNC_COMMUNICATION_SLACK_ETIQUETTE",
          "diagnosisMap": {
            "ASYNC_FIRST": {
              "misconceptionId": "MC_SK_ASYNC_COMMUNICATION_SLACK_ETIQUETTE",
              "errorExplanation": "The specific rule name is NO_HELLO_RULE.",
              "recoveryPath": {
                "simplerExplanation": "Type NO_HELLO_RULE.",
                "guidedFixPrompt": "Type NO_HELLO_RULE"
              }
            }
          }
        }
      },
      {
        "id": "comm-d4-b3-thread-discipline-in-slack",
        "day": 4,
        "blockNumber": 3,
        "title": "Thread Discipline: Confining Topic Discussions to In-Thread Replies",
        "conceptBudget": {
          "primaryConcept": "Thread Discipline Invariant",
          "supportingTerms": [
            "Thread Discipline (`Replying inside message threads rather than main channel root to preserve notification hygiene for hundreds of teammates`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d4-b2-no-hello-rule-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "thread_discipline_demo.js",
            "initialCode": "function getThreadDisciplineStandard() {\n  return 'REPLY_IN_THREADS_TO_PREVENT_CHANNEL_NOTIFICATION_SPAM';\n}\n\nconsole.log(getThreadDisciplineStandard());",
            "expectedOutput": "REPLY_IN_THREADS_TO_PREVENT_CHANNEL_NOTIFICATION_SPAM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why is replying inside message threads considered mandatory Slack/Teams etiquette?",
          "expectedStringOutput": "REPLY_IN_THREADS_TO_PREVENT_CHANNEL_NOTIFICATION_SPAM",
          "acceptableAnswers": [
            "REPLY_IN_THREADS_TO_PREVENT_CHANNEL_NOTIFICATION_SPAM",
            "Prevent channel notification spam",
            "Prevent notification spam"
          ],
          "primaryMisconceptionId": "MC_SK_ASYNC_COMMUNICATION_SLACK_ETIQUETTE",
          "diagnosisMap": {
            "ARCHIVE": {
              "misconceptionId": "MC_SK_ASYNC_COMMUNICATION_SLACK_ETIQUETTE",
              "errorExplanation": "Primary reason is: REPLY_IN_THREADS_TO_PREVENT_CHANNEL_NOTIFICATION_SPAM.",
              "recoveryPath": {
                "simplerExplanation": "Matches REPLY_IN_THREADS_TO_PREVENT_CHANNEL_NOTIFICATION_SPAM.",
                "guidedFixPrompt": "Type REPLY_IN_THREADS_TO_PREVENT_CHANNEL_NOTIFICATION_SPAM"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Professional Written Communication, Technical README, Active Listening & Async Collaboration Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete foundational tech communication and collaboration engine: 1. BLUF email structure validation (`[Action Required]`); 2. 5-Section README completeness verification; 3. 3-Step active listening paraphrase generation; 4. \"No-Hello\" asynchronous Slack message compliance.",
    "blocks": [
      {
        "id": "comm-d5-b1-comm-foundations-master-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "Communication Foundations Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Communication Foundations Master Engine",
          "supportingTerms": [
            "BLUF Email Subsystem",
            "Technical README Subsystem",
            "Active Listening Subsystem",
            "Async Etiquette Subsystem"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d4-b3-thread-discipline-in-slack",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 Communication Foundations Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Formats BLUF executive emails ([Action Required: by 5 PM])",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Audits technical README completeness across all 5 mandatory sections",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Generates 3-step active listening intent reflections ('What I am hearing from Sarah is...')",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Enforces No-Hello async Slack standards & activates Foundations Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "comm_kernel_demo.js",
            "initialCode": "function runCommFoundations() {\n  return {\n    blufSubsystem: 'ONLINE_ACTION_REQUIRED_ACTIVE',\n    readmeSubsystem: 'ONLINE_5_SECTIONS_ACTIVE',\n    listeningSubsystem: 'ONLINE_3_STEPS_ACTIVE',\n    asyncSubsystem: 'ONLINE_NO_HELLO_ACTIVE',\n    engineStatus: 'COMMUNICATION_FOUNDATIONS_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runCommFoundations().engineStatus);",
            "expectedOutput": "COMMUNICATION_FOUNDATIONS_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Communication Foundations Master Engine?",
          "expectedStringOutput": "COMMUNICATION_FOUNDATIONS_MASTER_ACTIVE",
          "acceptableAnswers": [
            "COMMUNICATION_FOUNDATIONS_MASTER_ACTIVE",
            "engineStatus: COMMUNICATION_FOUNDATIONS_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_SK_PROFESSIONAL_WRITTEN_COMMUNICATION_BLUF",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SK_PROFESSIONAL_WRITTEN_COMMUNICATION_BLUF",
              "errorExplanation": "Matches COMMUNICATION_FOUNDATIONS_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type COMMUNICATION_FOUNDATIONS_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "comm-d5-b2-comm-foundations-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "Communication Foundations Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Communication Foundations Invariant Verification",
          "supportingTerms": [
            "BLUF Invariant",
            "README Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d5-b1-comm-foundations-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "comm_audit_demo.js",
            "initialCode": "function auditComm(b, r, l, a) {\n  const passed = b && r && l && a;\n  return {\n    blufVerified: b,\n    readmeVerified: r,\n    listeningVerified: l,\n    asyncVerified: a,\n    grade: passed ? 'COMMUNICATION_FOUNDATIONS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditComm(true, true, true, true)));",
            "expectedOutput": "{\"blufVerified\":true,\"readmeVerified\":true,\"listeningVerified\":true,\"asyncVerified\":true,\"grade\":\"COMMUNICATION_FOUNDATIONS_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when BLUF Emails, Technical README, Active Listening, and Async Etiquette pass 100%?",
          "expectedStringOutput": "COMMUNICATION_FOUNDATIONS_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "COMMUNICATION_FOUNDATIONS_ENGINE_AUDIT_PASSED",
            "grade\":\"COMMUNICATION_FOUNDATIONS_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_SK_PROFESSIONAL_WRITTEN_COMMUNICATION_BLUF",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SK_PROFESSIONAL_WRITTEN_COMMUNICATION_BLUF",
              "errorExplanation": "All checks passing awards COMMUNICATION_FOUNDATIONS_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards COMMUNICATION_FOUNDATIONS_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type COMMUNICATION_FOUNDATIONS_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "comm-d5-b3-milestone1-comm-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Communication Foundations Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Communication Foundations Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d5-b2-comm-foundations-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_comm_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete Professional Written Communication, Technical README, Active Listening & Async Collaboration Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete Professional Written Communication, Technical README, Active Listening & Async Collaboration Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete Professional Written Communication, Technical README, Active Listening & Async Collaboration Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete Professional Written Communication, Technical README, Active Listening & Async Collaboration Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_SK_PROFESSIONAL_WRITTEN_COMMUNICATION_BLUF",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SK_PROFESSIONAL_WRITTEN_COMMUNICATION_BLUF",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete Professional Written Communication, Technical README, Active Listening & Async Collaboration Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Cross-Functional Alignment & Non-Technical Translation: The ELI5 Framework",
    "overviewMetaphor": "Cross-Functional Translation Is Converting Voltage to Currency: Telling the VP of Sales that 'We need to implement Redis LRU caching for our Postgres B-tree index' sounds like alien noise; telling them 'This upgrade makes the checkout screen 2x faster and will prevent $15,000 in lost shopping cart sales' translates raw engineering voltage directly into business gold.",
    "blocks": [
      {
        "id": "comm-d6-b1-technical-jargon-translator",
        "day": 6,
        "blockNumber": 1,
        "title": "Technical Translation: Mapping Technical Debt $\\to$ Business Revenue Risk",
        "conceptBudget": {
          "primaryConcept": "Technical-to-Business Value Translation Matcher",
          "supportingTerms": [
            "Technical Jargon (`'REFACTOR_DATABASE'`)",
            "Business Impact (`'Improves page speed by 2x, reducing user churn'`)",
            "Business Aligned (`true`)",
            "Status: Technical Translation Completed Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d1-b1-bluf-email-formatter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Technical-to-Business Value Translation Ledger",
              "boxes": [
                {
                  "label": "Technical Term",
                  "value": "'REFACTOR_DATABASE' (Postgres index optimization & normalization)",
                  "varType": "Jargon",
                  "isUpdated": false
                },
                {
                  "label": "Business Value Translation",
                  "value": "'Improves page load speed by 2x, reducing user churn during checkout'",
                  "varType": "Business Impact",
                  "isUpdated": false
                },
                {
                  "label": "Translation Outcome",
                  "value": "TECHNICAL TRANSLATION COMPLETED NOMINAL (STAKEHOLDER BUY-IN!)",
                  "varType": "Outcome",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "translation_demo.js",
            "initialCode": "function translateJargon(term) {\n  const map = {\n    'REFACTOR_DATABASE': 'Improves page load speed by 2x, reducing user churn during checkout',\n    'ADD_CACHE_LAYER': 'Reduces cloud server costs by 35% while keeping app fast during traffic spikes'\n  };\n  return {\n    term,\n    businessValue: map[term],\n    status: 'TECHNICAL_TRANSLATION_COMPLETED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(translateJargon('REFACTOR_DATABASE')));",
            "expectedOutput": "{\"term\":\"REFACTOR_DATABASE\",\"businessValue\":\"Improves page load speed by 2x, reducing user churn during checkout\",\"status\":\"TECHNICAL_TRANSLATION_COMPLETED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What business value phrase translates 'REFACTOR_DATABASE' for executive stakeholders?",
          "expectedStringOutput": "Improves page load speed by 2x, reducing user churn during checkout",
          "acceptableAnswers": [
            "Improves page load speed by 2x, reducing user churn during checkout",
            "businessValue\":\"Improves page load speed by 2x, reducing user churn during checkout\""
          ],
          "primaryMisconceptionId": "MC_SK_CROSS_FUNCTIONAL_TRANSLATION_ELI5",
          "diagnosisMap": {
            "Index B-tree": {
              "misconceptionId": "MC_SK_CROSS_FUNCTIONAL_TRANSLATION_ELI5",
              "errorExplanation": "Executives need business impact: Improves page load speed by 2x, reducing user churn during checkout.",
              "recoveryPath": {
                "simplerExplanation": "Phrase is: Improves page load speed by 2x, reducing user churn during checkout.",
                "guidedFixPrompt": "Type Improves page load speed by 2x, reducing user churn during checkout"
              }
            }
          }
        }
      },
      {
        "id": "comm-d6-b2-eli5-acronym-meaning",
        "day": 6,
        "blockNumber": 2,
        "title": "The ELI5 Translation Framework: Explain Like I'm 5",
        "conceptBudget": {
          "primaryConcept": "ELI5 Invariant",
          "supportingTerms": [
            "ELI5 (`Explain Like I'm 5`: Simplifying complex technical architectures into intuitive real-world metaphors without losing essential truth)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d6-b1-technical-jargon-translator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "ELI5 Metaphor Pairings",
            "codeSnippet": "// 1. KUBERNETES:     \"Like an automated air traffic controller routing airplanes to empty runways\"\n// 2. REDIS CACHE:    \"Like keeping the top 10 best-selling books on the store counter instead of back storage\"\n// 3. LOAD BALANCER:  \"Like a bank teller queue manager directing customers to open teller windows\"",
            "lineNotes": {
              "1": "Kubernetes metaphor.",
              "2": "Redis caching metaphor.",
              "3": "Load balancing metaphor."
            }
          },
          {
            "type": "runnable_code",
            "filename": "eli5_demo.js",
            "initialCode": "function getEli5Acronym() {\n  return 'ELI5';\n}\n\nconsole.log(getEli5Acronym());",
            "expectedOutput": "ELI5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 4-letter acronym describes the popular technique of explaining complex systems using simple everyday pictures?",
          "expectedStringOutput": "ELI5",
          "acceptableAnswers": [
            "ELI5",
            "eli5",
            "'ELI5'"
          ],
          "primaryMisconceptionId": "MC_SK_CROSS_FUNCTIONAL_TRANSLATION_ELI5",
          "diagnosisMap": {
            "KISS": {
              "misconceptionId": "MC_SK_CROSS_FUNCTIONAL_TRANSLATION_ELI5",
              "errorExplanation": "KISS is Keep It Simple. Explaining simply is ELI5.",
              "recoveryPath": {
                "simplerExplanation": "Type ELI5.",
                "guidedFixPrompt": "Type ELI5"
              }
            }
          }
        }
      },
      {
        "id": "comm-d6-b3-quantifying-technical-debt-financials",
        "day": 6,
        "blockNumber": 3,
        "title": "Financial Framing: Pitching Refactors in Dollars & Churn Prevention",
        "conceptBudget": {
          "primaryConcept": "Financial Framing Invariant",
          "supportingTerms": [
            "Financial Framing (`Framing engineering refactors in terms of monthly cloud infrastructure savings, customer support ticket reduction, or revenue risk mitigation`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d6-b2-eli5-acronym-meaning",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "financial_framing_demo.js",
            "initialCode": "function getRefactorFramingRule() {\n  return 'FRAME_TECHNICAL_REFACTORS_IN_TERMS_OF_REVENUE_SAVINGS_AND_CUSTOMER_RETENTION';\n}\n\nconsole.log(getRefactorFramingRule());",
            "expectedOutput": "FRAME_TECHNICAL_REFACTORS_IN_TERMS_OF_REVENUE_SAVINGS_AND_CUSTOMER_RETENTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How should senior engineers frame technical refactoring proposals to executive leadership?",
          "expectedStringOutput": "FRAME_TECHNICAL_REFACTORS_IN_TERMS_OF_REVENUE_SAVINGS_AND_CUSTOMER_RETENTION",
          "acceptableAnswers": [
            "FRAME_TECHNICAL_REFACTORS_IN_TERMS_OF_REVENUE_SAVINGS_AND_CUSTOMER_RETENTION",
            "Revenue savings and retention",
            "Financial impact"
          ],
          "primaryMisconceptionId": "MC_SK_CROSS_FUNCTIONAL_TRANSLATION_ELI5",
          "diagnosisMap": {
            "CLEAN_CODE": {
              "misconceptionId": "MC_SK_CROSS_FUNCTIONAL_TRANSLATION_ELI5",
              "errorExplanation": "Executives prioritize business metrics: FRAME_TECHNICAL_REFACTORS_IN_TERMS_OF_REVENUE_SAVINGS_AND_CUSTOMER_RETENTION.",
              "recoveryPath": {
                "simplerExplanation": "Matches FRAME_TECHNICAL_REFACTORS_IN_TERMS_OF_REVENUE_SAVINGS_AND_CUSTOMER_RETENTION.",
                "guidedFixPrompt": "Type FRAME_TECHNICAL_REFACTORS_IN_TERMS_OF_REVENUE_SAVINGS_AND_CUSTOMER_RETENTION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Constructive Feedback & Code Review Psychology: The SBI Feedback Framework",
    "overviewMetaphor": "SBI Feedback Is a Precision Surgical Laser, Not a Sledgehammer: Vague criticism (\"Your code is sloppy\") triggers defensiveness and damages morale; using Situation-Behavior-Impact (\"In yesterday's release [S], untested code was pushed [B], causing the login service to go down for 30 minutes [I]\") pinpoints the exact operational defect calmly and constructively.",
    "blocks": [
      {
        "id": "comm-d7-b1-sbi-feedback-generator",
        "day": 7,
        "blockNumber": 1,
        "title": "SBI Feedback: Situation $\\to$ Behavior $\\to$ Impact $\\to$ Next Steps",
        "conceptBudget": {
          "primaryConcept": "SBI Constructive Feedback Message Generator",
          "supportingTerms": [
            "Situation (`'In yesterday release'`)",
            "Behavior (`'untested code pushed'`)",
            "Impact (`'login service down 30m'`)",
            "Next Step (`'pair on writing unit tests'`)",
            "Status: SBI Constructive Feedback Formatted Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d6-b1-technical-jargon-translator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "SBI Feedback Architecture Ledger",
              "boxes": [
                {
                  "label": "S - Situation",
                  "value": "'In yesterday\\'s release' (Specific timestamp & context)",
                  "varType": "Situation",
                  "isUpdated": false
                },
                {
                  "label": "B - Behavior",
                  "value": "'untested code was pushed to main' (Objective observable action)",
                  "varType": "Behavior",
                  "isUpdated": false
                },
                {
                  "label": "I - Impact",
                  "value": "'the login service was down for 30 minutes' (Factual business outcome)",
                  "varType": "Impact",
                  "isUpdated": false
                },
                {
                  "label": "Next Step",
                  "value": "'let\\'s pair on unit tests' (SBI FEEDBACK FORMATTED NOMINAL!)",
                  "varType": "Resolution",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sbi_feedback_demo.js",
            "initialCode": "function formatSbi(s, b, i, next) {\n  const full = `Situation: ${s}. Behavior: ${b}. Impact: ${i}. Next Step: ${next}`;\n  return {\n    situation: s,\n    behavior: b,\n    impact: i,\n    nextStep: next,\n    status: 'SBI_CONSTRUCTIVE_FEEDBACK_FORMATTED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(formatSbi('In yesterday release', 'untested code pushed', 'login service down 30m', 'pair on unit tests')));",
            "expectedOutput": "{\"situation\":\"In yesterday release\",\"behavior\":\"untested code pushed\",\"impact\":\"login service down 30m\",\"nextStep\":\"pair on unit tests\",\"status\":\"SBI_CONSTRUCTIVE_FEEDBACK_FORMATTED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a feedback delivery conforms to the Situation-Behavior-Impact (SBI) framework?",
          "expectedStringOutput": "SBI_CONSTRUCTIVE_FEEDBACK_FORMATTED_NOMINAL",
          "acceptableAnswers": [
            "SBI_CONSTRUCTIVE_FEEDBACK_FORMATTED_NOMINAL",
            "status\":\"SBI_CONSTRUCTIVE_FEEDBACK_FORMATTED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_CONSTRUCTIVE_FEEDBACK_SBI_FRAMEWORK",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SK_CONSTRUCTIVE_FEEDBACK_SBI_FRAMEWORK",
              "errorExplanation": "Matches SBI_CONSTRUCTIVE_FEEDBACK_FORMATTED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type SBI_CONSTRUCTIVE_FEEDBACK_FORMATTED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d7-b2-sbi-components-count",
        "day": 7,
        "blockNumber": 2,
        "title": "The 3 Core Pillars of SBI Feedback",
        "conceptBudget": {
          "primaryConcept": "SBI Components Invariant",
          "supportingTerms": [
            "3 Core Pillars (Situation, Behavior, Impact)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d7-b1-sbi-feedback-generator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SBI Framework Breakdown",
            "codeSnippet": "// 1. SITUATION: Anchor feedback in a specific time, place, or meeting\n// 2. BEHAVIOR:  Describe specific, observable actions (Never judge personality!)\n// 3. IMPACT:    Explain the factual effect on the team, project, or customers",
            "lineNotes": {
              "1": "Pillar 1: Situation context.",
              "2": "Pillar 2: Observable behavior.",
              "3": "Pillar 3: Measurable impact."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sbi_count_demo.js",
            "initialCode": "function getSbiPillarsCount() {\n  return 3;\n}\n\nconsole.log(getSbiPillarsCount());",
            "expectedOutput": "3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many fundamental core pillars comprise the SBI feedback delivery model?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "3 pillars",
            "three"
          ],
          "primaryMisconceptionId": "MC_SK_CONSTRUCTIVE_FEEDBACK_SBI_FRAMEWORK",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_SK_CONSTRUCTIVE_FEEDBACK_SBI_FRAMEWORK",
              "errorExplanation": "There are 3 core pillars: Situation, Behavior, and Impact.",
              "recoveryPath": {
                "simplerExplanation": "Type 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "comm-d7-b3-separating-identity-from-code",
        "day": 7,
        "blockNumber": 3,
        "title": "Psychological Safety: Separating Developer Identity from Code Pull Requests",
        "conceptBudget": {
          "primaryConcept": "Identity Separation Invariant",
          "supportingTerms": [
            "Identity Separation (`Critiquing code artifacts ('This function has an edge-case null exception') rather than labeling developers ('You wrote buggy code') preserves psychological safety`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d7-b2-sbi-components-count",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "identity_separation_demo.js",
            "initialCode": "function getCodeReviewPsychologyRule() {\n  return 'CRITIQUE_THE_CODE_ARTIFACT_NEVER_THE_DEVELOPER_IDENTITY';\n}\n\nconsole.log(getCodeReviewPsychologyRule());",
            "expectedOutput": "CRITIQUE_THE_CODE_ARTIFACT_NEVER_THE_DEVELOPER_IDENTITY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core psychological safety rule governs high-performing code review cultures?",
          "expectedStringOutput": "CRITIQUE_THE_CODE_ARTIFACT_NEVER_THE_DEVELOPER_IDENTITY",
          "acceptableAnswers": [
            "CRITIQUE_THE_CODE_ARTIFACT_NEVER_THE_DEVELOPER_IDENTITY",
            "Critique code not developer",
            "Critique the code artifact"
          ],
          "primaryMisconceptionId": "MC_SK_CONSTRUCTIVE_FEEDBACK_SBI_FRAMEWORK",
          "diagnosisMap": {
            "CRITIQUE_DEV": {
              "misconceptionId": "MC_SK_CONSTRUCTIVE_FEEDBACK_SBI_FRAMEWORK",
              "errorExplanation": "Rule is: CRITIQUE_THE_CODE_ARTIFACT_NEVER_THE_DEVELOPER_IDENTITY.",
              "recoveryPath": {
                "simplerExplanation": "Matches CRITIQUE_THE_CODE_ARTIFACT_NEVER_THE_DEVELOPER_IDENTITY.",
                "guidedFixPrompt": "Type CRITIQUE_THE_CODE_ARTIFACT_NEVER_THE_DEVELOPER_IDENTITY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Conflict Resolution & De-escalation in Tech Teams: The IBR Approach",
    "overviewMetaphor": "The IBR Conflict Approach Is a Joint Laboratory Experiment: When two engineers argue passionately over REST vs GraphQL, they step away from personal positions, write down the objective hypothesis metrics on the lab whiteboard (Payload Size, Network Roundtrips, Caching Efficiency), and run a benchmark test together to let data decide the outcome.",
    "blocks": [
      {
        "id": "comm-d8-b1-ibr-conflict-evaluator",
        "day": 8,
        "blockNumber": 1,
        "title": "Conflict Resolution: Interest-Based Relational (IBR) Standard Certification",
        "conceptBudget": {
          "primaryConcept": "Interest-Based Conflict De-escalation Evaluator",
          "supportingTerms": [
            "Personal Attacks Eliminated (`true`)",
            "Objective Criteria Defined (`true`)",
            "Mutual Gain Explored (`true`)",
            "IBR Compliant (`true`)",
            "Status: IBR Conflict Resolution Certified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d7-b1-sbi-feedback-generator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Interest-Based Relational (IBR) Conflict Ledger",
              "boxes": [
                {
                  "label": "Criterion 1: People vs Problem",
                  "value": "Personal attacks eliminated | Mutual respect preserved",
                  "varType": "Criterion 1",
                  "isUpdated": false
                },
                {
                  "label": "Criterion 2: Objective Metrics",
                  "value": "Evaluated on Latency (ms), Memory (MB), and Dev Velocity",
                  "varType": "Criterion 2",
                  "isUpdated": false
                },
                {
                  "label": "Criterion 3: Mutual Gain",
                  "value": "Both services get optimized (IBR CONFLICT RESOLUTION CERTIFIED NOMINAL!)",
                  "varType": "Criterion 3",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ibr_demo.js",
            "initialCode": "function evaluateIbr(noAttacks, objCriteria, mutualGain) {\n  const ok = noAttacks && objCriteria && mutualGain;\n  return {\n    isCompliant: ok,\n    status: ok ? 'IBR_CONFLICT_RESOLUTION_CERTIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateIbr(true, true, true)));",
            "expectedOutput": "{\"isCompliant\":true,\"status\":\"IBR_CONFLICT_RESOLUTION_CERTIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a technical dispute was resolved according to Interest-Based Relational (IBR) principles?",
          "expectedStringOutput": "IBR_CONFLICT_RESOLUTION_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "IBR_CONFLICT_RESOLUTION_CERTIFIED_NOMINAL",
            "status\":\"IBR_CONFLICT_RESOLUTION_CERTIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_CONFLICT_RESOLUTION_IBR_DEESCALATION",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SK_CONFLICT_RESOLUTION_IBR_DEESCALATION",
              "errorExplanation": "All 3 criteria satisfied awards IBR_CONFLICT_RESOLUTION_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches IBR_CONFLICT_RESOLUTION_CERTIFIED_NOMINAL.",
                "guidedFixPrompt": "Type IBR_CONFLICT_RESOLUTION_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d8-b2-ibr-acronym-meaning",
        "day": 8,
        "blockNumber": 2,
        "title": "The IBR Acronym: Interest-Based Relational Approach",
        "conceptBudget": {
          "primaryConcept": "IBR Acronym Invariant",
          "supportingTerms": [
            "IBR (`Interest-Based Relational`: A conflict resolution methodology that separates personal relationships from technical problems and focuses on underlying interests)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d8-b1-ibr-conflict-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "IBR Core Principles",
            "codeSnippet": "// 1. Maintain good working relationships as the first priority\n// 2. Separate people from problems (Dispute the architecture, not the human)\n// 3. Listen to understand the underlying technical concerns before proposing fixes\n// 4. Establish objective, testable benchmarks (Benchmark latency, don't argue opinions!)",
            "lineNotes": {
              "1": "Relationship priority.",
              "2": "Separation of people and problems.",
              "3": "Empathetic listening.",
              "4": "Objective benchmarks."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ibr_acronym_demo.js",
            "initialCode": "function getIbr() {\n  return 'IBR';\n}\n\nconsole.log(getIbr());",
            "expectedOutput": "IBR",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 3-letter acronym denotes the Interest-Based Relational conflict resolution framework?",
          "expectedStringOutput": "IBR",
          "acceptableAnswers": [
            "IBR",
            "ibr",
            "'IBR'"
          ],
          "primaryMisconceptionId": "MC_SK_CONFLICT_RESOLUTION_IBR_DEESCALATION",
          "diagnosisMap": {
            "RAD": {
              "misconceptionId": "MC_SK_CONFLICT_RESOLUTION_IBR_DEESCALATION",
              "errorExplanation": "The acronym is IBR.",
              "recoveryPath": {
                "simplerExplanation": "Type IBR.",
                "guidedFixPrompt": "Type IBR"
              }
            }
          }
        }
      },
      {
        "id": "comm-d8-b3-shared-north-star-metrics",
        "day": 8,
        "blockNumber": 3,
        "title": "Breaking Deadlocks: Establishing Shared North Star Technical Metrics",
        "conceptBudget": {
          "primaryConcept": "North Star Metric Invariant",
          "supportingTerms": [
            "North Star Metric (`Agreeing on an objective success metric—such as 99.9th percentile latency or developer onboarding time—to resolve polarized engineering debates objectively`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d8-b2-ibr-acronym-meaning",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "north_star_demo.js",
            "initialCode": "function getDeadlockBreaker() {\n  return 'ESTABLISH_OBJECTIVE_BENCHMARKABLE_NORTH_STAR_METRICS';\n}\n\nconsole.log(getDeadlockBreaker());",
            "expectedOutput": "ESTABLISH_OBJECTIVE_BENCHMARKABLE_NORTH_STAR_METRICS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the most effective engineering technique for breaking ideological deadlocks in technical design reviews?",
          "expectedStringOutput": "ESTABLISH_OBJECTIVE_BENCHMARKABLE_NORTH_STAR_METRICS",
          "acceptableAnswers": [
            "ESTABLISH_OBJECTIVE_BENCHMARKABLE_NORTH_STAR_METRICS",
            "Establish objective metrics",
            "Benchmarkable north star metrics"
          ],
          "primaryMisconceptionId": "MC_SK_CONFLICT_RESOLUTION_IBR_DEESCALATION",
          "diagnosisMap": {
            "VOTING": {
              "misconceptionId": "MC_SK_CONFLICT_RESOLUTION_IBR_DEESCALATION",
              "errorExplanation": "Data breaks deadlocks: ESTABLISH_OBJECTIVE_BENCHMARKABLE_NORTH_STAR_METRICS.",
              "recoveryPath": {
                "simplerExplanation": "Matches ESTABLISH_OBJECTIVE_BENCHMARKABLE_NORTH_STAR_METRICS.",
                "guidedFixPrompt": "Type ESTABLISH_OBJECTIVE_BENCHMARKABLE_NORTH_STAR_METRICS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Effective Agile Standups & Synchronous Meetings: The 90-Second Update",
    "overviewMetaphor": "A Daily Agile Standup Is an F1 Pit Stop, Not a Garage Overhaul: You pull into the pit lane, report fuel status in 3 crisp numbers (Yesterday, Today, Blockers), and accelerate back onto the race track in under 90 seconds (`durationSeconds: 45`); deep engine troubleshooting is parked in the garage after the race.",
    "blocks": [
      {
        "id": "comm-d9-b1-standup-parser-timer-auditor",
        "day": 9,
        "blockNumber": 1,
        "title": "Agile Standup: 3-Part Update Delivered in Under 90 Seconds ($45$s)",
        "conceptBudget": {
          "primaryConcept": "90-Second Standup Update Parser & Timer Auditor",
          "supportingTerms": [
            "Yesterday Delivered",
            "Today Planned",
            "Blockers Reported",
            "Duration Seconds ($45$s $\\le 90$s)",
            "Status: Standup Update High Signal Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d8-b1-ibr-conflict-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Agile Standup 3-Part High-Signal Ledger",
              "boxes": [
                {
                  "label": "1. Yesterday Delivered",
                  "value": "'Finished JWT auth unit tests'",
                  "varType": "Yesterday",
                  "isUpdated": false
                },
                {
                  "label": "2. Today Planned",
                  "value": "'Will integrate Stripe webhook listener'",
                  "varType": "Today",
                  "isUpdated": false
                },
                {
                  "label": "3. Blockers / Help",
                  "value": "'None' | Duration: 45s <= 90s (HIGH SIGNAL NOMINAL!)",
                  "varType": "Blocker/Timer",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "standup_demo.js",
            "initialCode": "function auditStandup(yest, tod, blk, sec) {\n  const ok = !!(yest && tod) && sec <= 90;\n  return {\n    durationSeconds: sec,\n    isHighSignal: ok,\n    status: ok ? 'STANDUP_UPDATE_HIGH_SIGNAL_NOMINAL' : 'OVERTIME'\n  };\n}\n\nconsole.log(JSON.stringify(auditStandup('Finished JWT auth tests', 'Will integrate Stripe webhooks', null, 45)));",
            "expectedOutput": "{\"durationSeconds\":45,\"isHighSignal\":true,\"status\":\"STANDUP_UPDATE_HIGH_SIGNAL_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a daily standup update was delivered with high signal in under 90 seconds?",
          "expectedStringOutput": "STANDUP_UPDATE_HIGH_SIGNAL_NOMINAL",
          "acceptableAnswers": [
            "STANDUP_UPDATE_HIGH_SIGNAL_NOMINAL",
            "status\":\"STANDUP_UPDATE_HIGH_SIGNAL_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_AGILE_STANDUPS_90_SECOND_UPDATES",
          "diagnosisMap": {
            "OVERTIME": {
              "misconceptionId": "MC_SK_AGILE_STANDUPS_90_SECOND_UPDATES",
              "errorExplanation": "45 seconds is well under 90s: STANDUP_UPDATE_HIGH_SIGNAL_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches STANDUP_UPDATE_HIGH_SIGNAL_NOMINAL.",
                "guidedFixPrompt": "Type STANDUP_UPDATE_HIGH_SIGNAL_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d9-b2-maximum-standup-duration-seconds",
        "day": 9,
        "blockNumber": 2,
        "title": "The 90-Second Standup Duration Ceiling",
        "conceptBudget": {
          "primaryConcept": "Standup Duration Invariant",
          "supportingTerms": [
            "90-Second Ceiling (`Keeping individual updates under 90 seconds prevents meeting fatigue across a 10-person engineering team`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d9-b1-standup-parser-timer-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Standup Time Allocation",
            "codeSnippet": "// 1. What was completed yesterday: ~30 seconds\n// 2. What will be delivered today:   ~30 seconds\n// 3. Blockers or dependencies:      ~15 seconds\n// TOTAL PER ENGINEER:               <= 90 SECONDS!",
            "lineNotes": {
              "1": "Yesterday time budget.",
              "2": "Today time budget.",
              "3": "Blockers time budget.",
              "4": "Total cap."
            }
          },
          {
            "type": "runnable_code",
            "filename": "standup_timer_demo.js",
            "initialCode": "function getMaxStandupSeconds() {\n  return 90;\n}\n\nconsole.log(getMaxStandupSeconds());",
            "expectedOutput": "90",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum recommended duration in seconds for an individual developer's daily standup report?",
          "expectedStringOutput": "90",
          "acceptableAnswers": [
            "90",
            "90 seconds",
            "90s"
          ],
          "primaryMisconceptionId": "MC_SK_AGILE_STANDUPS_90_SECOND_UPDATES",
          "diagnosisMap": {
            "300": {
              "misconceptionId": "MC_SK_AGILE_STANDUPS_90_SECOND_UPDATES",
              "errorExplanation": "5 minutes is too long for 1 person. Individual ceiling is 90 seconds.",
              "recoveryPath": {
                "simplerExplanation": "Type 90.",
                "guidedFixPrompt": "Type 90"
              }
            }
          }
        }
      },
      {
        "id": "comm-d9-b3-the-parking-lot-principle",
        "day": 9,
        "blockNumber": 3,
        "title": "The Parking Lot Principle: Offloading Deep Technical Dives to Post-Sync",
        "conceptBudget": {
          "primaryConcept": "Parking Lot Invariant",
          "supportingTerms": [
            "The Parking Lot (`When a blocker requires deep debugging, declaring 'Let's take this to the parking lot after standup' releases unaffected teammates`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d9-b2-maximum-standup-duration-seconds",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "parking_lot_demo.js",
            "initialCode": "function getParkingLotPhrase() {\n  return 'PARKING_LOT_AFTER_STANDUP';\n}\n\nconsole.log(getParkingLotPhrase());",
            "expectedOutput": "PARKING_LOT_AFTER_STANDUP",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What standard agile meeting mechanism offloads deep technical problem-solving away from the general standup?",
          "expectedStringOutput": "PARKING_LOT_AFTER_STANDUP",
          "acceptableAnswers": [
            "PARKING_LOT_AFTER_STANDUP",
            "Parking lot",
            "The parking lot"
          ],
          "primaryMisconceptionId": "MC_SK_AGILE_STANDUPS_90_SECOND_UPDATES",
          "diagnosisMap": {
            "DEBUG_IN_STANDUP": {
              "misconceptionId": "MC_SK_AGILE_STANDUPS_90_SECOND_UPDATES",
              "errorExplanation": "Mechanism is: PARKING_LOT_AFTER_STANDUP.",
              "recoveryPath": {
                "simplerExplanation": "Matches PARKING_LOT_AFTER_STANDUP.",
                "guidedFixPrompt": "Type PARKING_LOT_AFTER_STANDUP"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Technical Presentations & Slide Deck Architecture: The Minto Pyramid Principle",
    "overviewMetaphor": "The Minto Pyramid Is a Royal Crown, Not an Archaeological Dig: Weak presentations force listeners to dig through 40 slides of raw database logs before finding the treasure; Barbara Minto's Pyramid crowns slide 1 with the Core Recommendation, followed by 3 supporting pillars (`supportingPillars: 3`), ensuring executive buy-in within 60 seconds.",
    "blocks": [
      {
        "id": "comm-d10-b1-minto-pyramid-validator",
        "day": 10,
        "blockNumber": 1,
        "title": "Minto Pyramid: Governing Thought + 3 Logical Supporting Pillars",
        "conceptBudget": {
          "primaryConcept": "Minto Pyramid Presentation Outline Validator",
          "supportingTerms": [
            "Governing Thought",
            "Supporting Pillars Count ($3$)",
            "Pillars: Scalability, Isolation, Velocity",
            "Status: Minto Pyramid Outline Valid Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d9-b1-standup-parser-timer-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Minto Pyramid Presentation Architecture Ledger",
              "boxes": [
                {
                  "label": "Top: Governing Thought",
                  "value": "'We should migrate monolith to microservices to support 10x traffic'",
                  "varType": "Top Tier",
                  "isUpdated": false
                },
                {
                  "label": "Pillar 1: Scalability",
                  "value": "Supports 10M DAU with horizontal node scaling",
                  "varType": "Pillar 1",
                  "isUpdated": false
                },
                {
                  "label": "Pillar 2: Blast Radius",
                  "value": "Isolates payment failures from catalog browsing",
                  "varType": "Pillar 2",
                  "isUpdated": false
                },
                {
                  "label": "Pillar 3: Team Velocity",
                  "value": "Enables 4 independent deployment pipelines (VALID NOMINAL!)",
                  "varType": "Pillar 3",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "minto_demo.js",
            "initialCode": "function validateMinto(thought, pillars) {\n  const ok = thought.length >= 15 && pillars.length >= 2 && pillars.length <= 4;\n  return {\n    thought,\n    pillarsCount: pillars.length,\n    isCompliant: ok,\n    status: ok ? 'MINTO_PYRAMID_OUTLINE_VALID_NOMINAL' : 'DEFECT'\n  };\n}\n\nconst p = ['Improves system scalability', 'Isolates deployment failure domains', 'Allows independent team velocity'];\nconsole.log(JSON.stringify(validateMinto('We should migrate our monolithic backend to microservices to support 10x growth.', p)));",
            "expectedOutput": "{\"thought\":\"We should migrate our monolithic backend to microservices to support 10x growth.\",\"pillarsCount\":3,\"isCompliant\":true,\"status\":\"MINTO_PYRAMID_OUTLINE_VALID_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a presentation outline conforms to the Minto Pyramid architecture?",
          "expectedStringOutput": "MINTO_PYRAMID_OUTLINE_VALID_NOMINAL",
          "acceptableAnswers": [
            "MINTO_PYRAMID_OUTLINE_VALID_NOMINAL",
            "status\":\"MINTO_PYRAMID_OUTLINE_VALID_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_TECHNICAL_PRESENTATIONS_MINTO_PYRAMID",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SK_TECHNICAL_PRESENTATIONS_MINTO_PYRAMID",
              "errorExplanation": "Matches MINTO_PYRAMID_OUTLINE_VALID_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type MINTO_PYRAMID_OUTLINE_VALID_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d10-b2-minto-top-tier-name",
        "day": 10,
        "blockNumber": 2,
        "title": "The Minto Apex: The Governing Thought",
        "conceptBudget": {
          "primaryConcept": "Governing Thought Invariant",
          "supportingTerms": [
            "Governing Thought (`The single, central thesis statement or core recommendation placed at the very apex of the Minto Pyramid`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d10-b1-minto-pyramid-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Minto Pyramid Hierarchy",
            "codeSnippet": "// 1. APEX:         Governing Thought (Core conclusion/recommendation)\n// 2. MIDDLE TIER:  Key Logical Pillars (2-4 mutually exclusive reasons)\n// 3. BASE TIER:    Evidentiary Data & Benchmarks (Metrics, charts, code proofs)",
            "lineNotes": {
              "1": "Apex tier.",
              "2": "Middle logical tier.",
              "3": "Evidentiary foundation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "minto_apex_demo.js",
            "initialCode": "function getMintoApexName() {\n  return 'Governing Thought';\n}\n\nconsole.log(getMintoApexName());",
            "expectedOutput": "Governing Thought",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the official term for the single core recommendation at the apex of the Minto Pyramid?",
          "expectedStringOutput": "Governing Thought",
          "acceptableAnswers": [
            "Governing Thought",
            "governing thought",
            "'Governing Thought'"
          ],
          "primaryMisconceptionId": "MC_SK_TECHNICAL_PRESENTATIONS_MINTO_PYRAMID",
          "diagnosisMap": {
            "Executive Summary": {
              "misconceptionId": "MC_SK_TECHNICAL_PRESENTATIONS_MINTO_PYRAMID",
              "errorExplanation": "The precise Minto term is Governing Thought.",
              "recoveryPath": {
                "simplerExplanation": "Type Governing Thought.",
                "guidedFixPrompt": "Type Governing Thought"
              }
            }
          }
        }
      },
      {
        "id": "comm-d10-b3-cognitive-load-one-idea-per-slide",
        "day": 10,
        "blockNumber": 3,
        "title": "Slide Design Psychology: One Core Idea per Slide",
        "conceptBudget": {
          "primaryConcept": "Slide Cognitive Load Invariant",
          "supportingTerms": [
            "One Idea per Slide (`Eliminating dense walls of bullet text; each slide conveys exactly one visual diagram or key takeaway for effortless audience parsing`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d10-b2-minto-top-tier-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "slide_design_demo.js",
            "initialCode": "function getSlideDesignStandard() {\n  return 'ONE_CORE_IDEA_PER_SLIDE_WITH_ZERO_DENSE_BULLET_WALLS';\n}\n\nconsole.log(getSlideDesignStandard());",
            "expectedOutput": "ONE_CORE_IDEA_PER_SLIDE_WITH_ZERO_DENSE_BULLET_WALLS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core visual communication standard prevents cognitive overload during technical slide presentations?",
          "expectedStringOutput": "ONE_CORE_IDEA_PER_SLIDE_WITH_ZERO_DENSE_BULLET_WALLS",
          "acceptableAnswers": [
            "ONE_CORE_IDEA_PER_SLIDE_WITH_ZERO_DENSE_BULLET_WALLS",
            "One idea per slide",
            "One core idea per slide"
          ],
          "primaryMisconceptionId": "MC_SK_TECHNICAL_PRESENTATIONS_MINTO_PYRAMID",
          "diagnosisMap": {
            "MAX_BULLETS": {
              "misconceptionId": "MC_SK_TECHNICAL_PRESENTATIONS_MINTO_PYRAMID",
              "errorExplanation": "Standard is: ONE_CORE_IDEA_PER_SLIDE_WITH_ZERO_DENSE_BULLET_WALLS.",
              "recoveryPath": {
                "simplerExplanation": "Matches ONE_CORE_IDEA_PER_SLIDE_WITH_ZERO_DENSE_BULLET_WALLS.",
                "guidedFixPrompt": "Type ONE_CORE_IDEA_PER_SLIDE_WITH_ZERO_DENSE_BULLET_WALLS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Executive Presence & Delivering Bad News: The SCR Communication Framework",
    "overviewMetaphor": "The SCR Framework Is a Sea Captain's Navigational Log in a Storm: When an engine explodes at sea, the captain does not panic or hide in their cabin; they announce the Situation ('We are in Sector 4'), the Complication ('Engine 2 has lost pressure'), and 2 clear Resolution paths ('Option A: Run on Engine 1 at half speed; Option B: Drop anchor and replace the gasket in 20 mins').",
    "blocks": [
      {
        "id": "comm-d11-b1-scr-crisis-communication-generator",
        "day": 11,
        "blockNumber": 1,
        "title": "SCR Crisis Communication: Situation $\\to$ Complication $\\to$ 2 Resolution Options",
        "conceptBudget": {
          "primaryConcept": "SCR Executive Crisis Communication Generator",
          "supportingTerms": [
            "Situation (`'Payment API is live'`)",
            "Complication (`'Latency spiked to 8s causing 15% timeouts'`)",
            "Resolution Option A & Option B",
            "Status: SCR Executive Communication Formatted Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d10-b1-minto-pyramid-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "SCR Executive Incident Briefing Ledger",
              "boxes": [
                {
                  "label": "S - Situation",
                  "value": "'Payment processing API is live in US region'",
                  "varType": "Situation",
                  "isUpdated": false
                },
                {
                  "label": "C - Complication",
                  "value": "'Gateway latency spiked to 8s causing 15% transaction timeouts'",
                  "varType": "Complication",
                  "isUpdated": false
                },
                {
                  "label": "R - Resolution Options",
                  "value": "Option A: Failover to Stripe (5m) | Option B: Throttle traffic (0 downtime) (FORMATTED NOMINAL!)",
                  "varType": "Resolutions",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "scr_demo.js",
            "initialCode": "function formatScr(s, c, res) {\n  const ok = !!(s && c && res.length >= 2);\n  return {\n    situation: s,\n    complication: c,\n    resolutionsCount: res.length,\n    isCompliant: ok,\n    status: ok ? 'SCR_EXECUTIVE_COMMUNICATION_FORMATTED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconst r = ['Option A: Failover to backup gateway', 'Option B: Throttle non-critical traffic'];\nconsole.log(JSON.stringify(formatScr('Payment API is live', 'Gateway latency spiked causing timeouts', r)));",
            "expectedOutput": "{\"situation\":\"Payment API is live\",\"complication\":\"Gateway latency spiked causing timeouts\",\"resolutionsCount\":2,\"isCompliant\":true,\"status\":\"SCR_EXECUTIVE_COMMUNICATION_FORMATTED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that an incident briefing adheres to the Situation-Complication-Resolution (SCR) standard?",
          "expectedStringOutput": "SCR_EXECUTIVE_COMMUNICATION_FORMATTED_NOMINAL",
          "acceptableAnswers": [
            "SCR_EXECUTIVE_COMMUNICATION_FORMATTED_NOMINAL",
            "status\":\"SCR_EXECUTIVE_COMMUNICATION_FORMATTED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_EXECUTIVE_PRESENCE_SCR_DELIVERING_BAD_NEWS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SK_EXECUTIVE_PRESENCE_SCR_DELIVERING_BAD_NEWS",
              "errorExplanation": "Matches SCR_EXECUTIVE_COMMUNICATION_FORMATTED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type SCR_EXECUTIVE_COMMUNICATION_FORMATTED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d11-b2-scr-acronym-expansion",
        "day": 11,
        "blockNumber": 2,
        "title": "The SCR Acronym: Situation-Complication-Resolution",
        "conceptBudget": {
          "primaryConcept": "SCR Acronym Invariant",
          "supportingTerms": [
            "SCR (`Situation-Complication-Resolution`: A McKinsey executive storytelling structure widely adopted by engineering leaders for incident management and strategic pivot communication)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d11-b1-scr-crisis-communication-generator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SCR Incident Anatomy",
            "codeSnippet": "// 1. SITUATION:    Establish neutral baseline context everyone agrees on\n// 2. COMPLICATION: Introduce the sudden constraint, bug, or blocker\n// 3. RESOLUTION:   Present 2-3 viable tradeoff paths with explicit recommendations",
            "lineNotes": {
              "1": "Neutral baseline.",
              "2": "The sudden complication.",
              "3": "Actionable resolution paths."
            }
          },
          {
            "type": "runnable_code",
            "filename": "scr_acronym_demo.js",
            "initialCode": "function getScrMeaning() {\n  return 'Situation-Complication-Resolution';\n}\n\nconsole.log(getScrMeaning());",
            "expectedOutput": "Situation-Complication-Resolution",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What three words expand the executive crisis communication acronym 'SCR'?",
          "expectedStringOutput": "Situation-Complication-Resolution",
          "acceptableAnswers": [
            "Situation-Complication-Resolution",
            "situation-complication-resolution",
            "Situation, Complication, Resolution"
          ],
          "primaryMisconceptionId": "MC_SK_EXECUTIVE_PRESENCE_SCR_DELIVERING_BAD_NEWS",
          "diagnosisMap": {
            "Source Code Repository": {
              "misconceptionId": "MC_SK_EXECUTIVE_PRESENCE_SCR_DELIVERING_BAD_NEWS",
              "errorExplanation": "In leadership communication, SCR stands for Situation-Complication-Resolution.",
              "recoveryPath": {
                "simplerExplanation": "Type Situation-Complication-Resolution.",
                "guidedFixPrompt": "Type Situation-Complication-Resolution"
              }
            }
          }
        }
      },
      {
        "id": "comm-d11-b3-presenting-tradeoffs-over-concealing",
        "day": 11,
        "blockNumber": 3,
        "title": "Extreme Transparency: Communicating Delays Early with Explicit Tradeoffs",
        "conceptBudget": {
          "primaryConcept": "Early Transparency Invariant",
          "supportingTerms": [
            "Early Transparency (`Alerting stakeholders 3 days before a deadline when a delay is first identified builds trust; concealing delays until delivery day destroys executive credibility`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d11-b2-scr-acronym-expansion",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "early_transparency_demo.js",
            "initialCode": "function getBadNewsDeliveryStandard() {\n  return 'ALERT_LEADERSHIP_IMMEDIATELY_WITH_EXPLICIT_MITIGATION_TRADEOFFS';\n}\n\nconsole.log(getBadNewsDeliveryStandard());",
            "expectedOutput": "ALERT_LEADERSHIP_IMMEDIATELY_WITH_EXPLICIT_MITIGATION_TRADEOFFS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the gold standard for delivering bad news about schedule slips or outages to executive leadership?",
          "expectedStringOutput": "ALERT_LEADERSHIP_IMMEDIATELY_WITH_EXPLICIT_MITIGATION_TRADEOFFS",
          "acceptableAnswers": [
            "ALERT_LEADERSHIP_IMMEDIATELY_WITH_EXPLICIT_MITIGATION_TRADEOFFS",
            "Alert immediately with tradeoffs",
            "Early transparency with tradeoffs"
          ],
          "primaryMisconceptionId": "MC_SK_EXECUTIVE_PRESENCE_SCR_DELIVERING_BAD_NEWS",
          "diagnosisMap": {
            "WAIT_TILL_DEADLINE": {
              "misconceptionId": "MC_SK_EXECUTIVE_PRESENCE_SCR_DELIVERING_BAD_NEWS",
              "errorExplanation": "Waiting destroys credibility: ALERT_LEADERSHIP_IMMEDIATELY_WITH_EXPLICIT_MITIGATION_TRADEOFFS.",
              "recoveryPath": {
                "simplerExplanation": "Matches ALERT_LEADERSHIP_IMMEDIATELY_WITH_EXPLICIT_MITIGATION_TRADEOFFS.",
                "guidedFixPrompt": "Type ALERT_LEADERSHIP_IMMEDIATELY_WITH_EXPLICIT_MITIGATION_TRADEOFFS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Negotiation & Persuasion for Engineers: Establishing ZOPA & BATNA",
    "overviewMetaphor": "ZOPA Is the Overlap on a Real Estate Property Negotiation: The engineering team needs at least $20\\%$ of sprint capacity for refactoring; product management can afford up to $30\\%$ (`overlapPoints: 10`); because the maximum product allows exceeds the minimum engineering requires, a deal is sealed in the Zone of Possible Agreement (ZOPA).",
    "blocks": [
      {
        "id": "comm-d12-b1-zopa-range-evaluator",
        "day": 12,
        "blockNumber": 1,
        "title": "Negotiation Dynamics: Calculating $10\\%$ ZOPA Overlap ($20\\%$ Min vs $30\\%$ Max)",
        "conceptBudget": {
          "primaryConcept": "ZOPA Scope Negotiation Range Evaluator",
          "supportingTerms": [
            "Engineering Minimum ($20\\%$)",
            "Business Maximum ($30\\%$)",
            "Viable ZOPA (`true`)",
            "Overlap Range Points ($10\\%$)",
            "Status: ZOPA Agreement Range Established Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d11-b1-scr-crisis-communication-generator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ZOPA Scope Negotiation Range Ledger",
              "boxes": [
                {
                  "label": "Engineering Minimum",
                  "value": "20% sprint points reserved for technical debt",
                  "varType": "Eng Min",
                  "isUpdated": false
                },
                {
                  "label": "Business Maximum",
                  "value": "30% sprint points allowed without delaying roadmap",
                  "varType": "Biz Max",
                  "isUpdated": false
                },
                {
                  "label": "ZOPA Agreement Overlap",
                  "value": "30% - 20% = 10% Overlap Zone (AGREEMENT ESTABLISHED NOMINAL!)",
                  "varType": "ZOPA",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "zopa_demo.js",
            "initialCode": "function evalZopa(min, max) {\n  const ok = max >= min;\n  return {\n    hasZopa: ok,\n    overlap: ok ? max - min : 0,\n    status: ok ? 'ZOPA_AGREEMENT_RANGE_ESTABLISHED_NOMINAL' : 'DEADLOCK'\n  };\n}\n\nconsole.log(JSON.stringify(evalZopa(20, 30)));",
            "expectedOutput": "{\"hasZopa\":true,\"overlap\":10,\"status\":\"ZOPA_AGREEMENT_RANGE_ESTABLISHED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many overlap percentage points exist when engineering requests 20% minimum and product allows up to 30%?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "overlap\":10",
            "10 points",
            "10%"
          ],
          "primaryMisconceptionId": "MC_SK_NEGOTIATION_PERSUASION_ZOPA_BATNA",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_SK_NEGOTIATION_PERSUASION_ZOPA_BATNA",
              "errorExplanation": "Overlap is the difference: 30 - 20 = 10.",
              "recoveryPath": {
                "simplerExplanation": "Overlap is 10.",
                "guidedFixPrompt": "Type 10"
              }
            }
          }
        }
      },
      {
        "id": "comm-d12-b2-batna-acronym-expansion",
        "day": 12,
        "blockNumber": 2,
        "title": "The BATNA Principle: Best Alternative to a Negotiated Agreement",
        "conceptBudget": {
          "primaryConcept": "BATNA Invariant",
          "supportingTerms": [
            "BATNA (`Best Alternative to a Negotiated Agreement`: The course of action taken if negotiations fail; having a strong BATNA provides leverage and psychological safety in any negotiation)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d12-b1-zopa-range-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "BATNA in Engineering Scope",
            "codeSnippet": "// 1. TARGET: Refactor payment microservice in Sprint 14\n// 2. NEGOTIATION: Product refuses 40% sprint allocation\n// 3. STRONG BATNA: Deploy feature flags and incrementally refactor 1 module per sprint (No deadlock!)",
            "lineNotes": {
              "1": "Target request.",
              "2": "Pushback encountered.",
              "3": "Strong alternative."
            }
          },
          {
            "type": "runnable_code",
            "filename": "batna_demo.js",
            "initialCode": "function getBatnaMeaning() {\n  return 'Best Alternative to a Negotiated Agreement';\n}\n\nconsole.log(getBatnaMeaning());",
            "expectedOutput": "Best Alternative to a Negotiated Agreement",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does the negotiation acronym 'BATNA' stand for?",
          "expectedStringOutput": "Best Alternative to a Negotiated Agreement",
          "acceptableAnswers": [
            "Best Alternative to a Negotiated Agreement",
            "best alternative to a negotiated agreement",
            "'Best Alternative to a Negotiated Agreement'"
          ],
          "primaryMisconceptionId": "MC_SK_NEGOTIATION_PERSUASION_ZOPA_BATNA",
          "diagnosisMap": {
            "Best Action To Negotiate Ahead": {
              "misconceptionId": "MC_SK_NEGOTIATION_PERSUASION_ZOPA_BATNA",
              "errorExplanation": "BATNA stands for Best Alternative to a Negotiated Agreement.",
              "recoveryPath": {
                "simplerExplanation": "Type Best Alternative to a Negotiated Agreement.",
                "guidedFixPrompt": "Type Best Alternative to a Negotiated Agreement"
              }
            }
          }
        }
      },
      {
        "id": "comm-d12-b3-the-art-of-the-professional-no",
        "day": 12,
        "blockNumber": 3,
        "title": "The Professional \"No\": Rejecting Timelines by Providing Viable Scope Alternatives",
        "conceptBudget": {
          "primaryConcept": "Professional No Invariant",
          "supportingTerms": [
            "The Professional No (`Never saying a flat 'No'; saying 'We cannot ship both Auth and Checkout by Friday, but we can deliver 100% of Auth on Friday and Checkout by Tuesday'`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d12-b2-batna-acronym-expansion",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "professional_no_demo.js",
            "initialCode": "function getProfessionalNoFormula() {\n  return 'REJECT_IMPOSSIBLE_DEADLINES_BY_OFFERING_CONSTRUCTIVE_SCOPE_ALTERNATIVES';\n}\n\nconsole.log(getProfessionalNoFormula());",
            "expectedOutput": "REJECT_IMPOSSIBLE_DEADLINES_BY_OFFERING_CONSTRUCTIVE_SCOPE_ALTERNATIVES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What communication strategy allows senior engineers to professionally reject impossible feature deadlines?",
          "expectedStringOutput": "REJECT_IMPOSSIBLE_DEADLINES_BY_OFFERING_CONSTRUCTIVE_SCOPE_ALTERNATIVES",
          "acceptableAnswers": [
            "REJECT_IMPOSSIBLE_DEADLINES_BY_OFFERING_CONSTRUCTIVE_SCOPE_ALTERNATIVES",
            "Offer scope alternatives",
            "Constructive scope alternatives"
          ],
          "primaryMisconceptionId": "MC_SK_NEGOTIATION_PERSUASION_ZOPA_BATNA",
          "diagnosisMap": {
            "FLAT_NO": {
              "misconceptionId": "MC_SK_NEGOTIATION_PERSUASION_ZOPA_BATNA",
              "errorExplanation": "Strategy is: REJECT_IMPOSSIBLE_DEADLINES_BY_OFFERING_CONSTRUCTIVE_SCOPE_ALTERNATIVES.",
              "recoveryPath": {
                "simplerExplanation": "Matches REJECT_IMPOSSIBLE_DEADLINES_BY_OFFERING_CONSTRUCTIVE_SCOPE_ALTERNATIVES.",
                "guidedFixPrompt": "Type REJECT_IMPOSSIBLE_DEADLINES_BY_OFFERING_CONSTRUCTIVE_SCOPE_ALTERNATIVES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Time Management & Deep Work Boundary Setting: Maker's Schedule vs Manager's Schedule",
    "overviewMetaphor": "A Maker's Schedule Is a Submarine Dive: An engineer building complex distributed consensus code requires a 3-hour uninterrupted dive to reach the Mariana Trench of deep thought; a single 15-minute meeting mid-dive forces the submarine to emergency-surface, wasting 45 minutes of decompression time.",
    "blocks": [
      {
        "id": "comm-d13-b1-makers-schedule-auditor",
        "day": 13,
        "blockNumber": 1,
        "title": "Maker's Schedule: Auditing 2 Uninterrupted Focus Blocks ($2.0$+ Hours)",
        "conceptBudget": {
          "primaryConcept": "Maker's Schedule Deep Work Block Auditor",
          "supportingTerms": [
            "Focus Blocks Count ($2$ blocks)",
            "Block Duration ($3.0$h & $2.5$h)",
            "Maker Schedule Protected (`true`)",
            "Status: Makers Schedule Deep Work Protected Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d12-b1-zopa-range-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Maker's Schedule Focus Architecture Ledger",
              "boxes": [
                {
                  "label": "Morning Focus Block",
                  "value": "9:00 AM - 12:00 PM (3.0h uninterrupted coding dive)",
                  "varType": "Block 1",
                  "isUpdated": false
                },
                {
                  "label": "Afternoon Focus Block",
                  "value": "1:30 PM - 4:00 PM (2.5h uninterrupted coding dive)",
                  "varType": "Block 2",
                  "isUpdated": false
                },
                {
                  "label": "Schedule Health",
                  "value": "2 Focus Blocks Protected (MAKERS SCHEDULE PROTECTED NOMINAL!)",
                  "varType": "Health",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "makers_schedule_demo.js",
            "initialCode": "function auditMakers(events) {\n  let focus = 0;\n  events.forEach(e => {\n    if (e.dur >= 2.0 && e.clean) focus++;\n  });\n  const ok = focus >= 2;\n  return {\n    focusBlocks: focus,\n    isProtected: ok,\n    status: ok ? 'MAKERS_SCHEDULE_DEEP_WORK_PROTECTED_NOMINAL' : 'FRAGMENTED'\n  };\n}\n\nconst evs = [{ dur: 3.0, clean: true }, { dur: 2.5, clean: true }, { dur: 0.5, clean: false }];\nconsole.log(JSON.stringify(auditMakers(evs)));",
            "expectedOutput": "{\"focusBlocks\":2,\"isProtected\":true,\"status\":\"MAKERS_SCHEDULE_DEEP_WORK_PROTECTED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many uninterrupted 2+ hour focus blocks were audited in the protected schedule?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "focusBlocks\":2",
            "2 blocks",
            "two"
          ],
          "primaryMisconceptionId": "MC_SK_TIME_MANAGEMENT_MAKERS_SCHEDULE_BOUNDARIES",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_SK_TIME_MANAGEMENT_MAKERS_SCHEDULE_BOUNDARIES",
              "errorExplanation": "The 0.5h event was fragmented. There are 2 clean focus blocks.",
              "recoveryPath": {
                "simplerExplanation": "Count is 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "comm-d13-b2-makers-schedule-author-paul-graham",
        "day": 13,
        "blockNumber": 2,
        "title": "The Maker's Schedule: Paul Graham's Seminal Essay",
        "conceptBudget": {
          "primaryConcept": "Paul Graham Essay Invariant",
          "supportingTerms": [
            "Paul Graham (`Author of the legendary 2009 essay 'Maker's Schedule, Manager's Schedule' articulating why developer time cannot be divided into 30-minute intervals`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d13-b1-makers-schedule-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Maker vs Manager Contrast",
            "codeSnippet": "// MANAGER'S SCHEDULE: Day divided into 30-minute meeting slots (Meetings are normal)\n// MAKER'S SCHEDULE:   Day divided into half-day units (A single meeting destroys the half-day block!)",
            "lineNotes": {
              "1": "Manager's calendar model.",
              "2": "Maker's deep work requirement."
            }
          },
          {
            "type": "runnable_code",
            "filename": "paul_graham_demo.js",
            "initialCode": "function getMakersAuthor() {\n  return 'Paul Graham';\n}\n\nconsole.log(getMakersAuthor());",
            "expectedOutput": "Paul Graham",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Who authored the famous technology essay 'Maker's Schedule, Manager's Schedule'?",
          "expectedStringOutput": "Paul Graham",
          "acceptableAnswers": [
            "Paul Graham",
            "paul graham",
            "'Paul Graham'"
          ],
          "primaryMisconceptionId": "MC_SK_TIME_MANAGEMENT_MAKERS_SCHEDULE_BOUNDARIES",
          "diagnosisMap": {
            "Peter Drucker": {
              "misconceptionId": "MC_SK_TIME_MANAGEMENT_MAKERS_SCHEDULE_BOUNDARIES",
              "errorExplanation": "The essay was written by Y Combinator founder Paul Graham.",
              "recoveryPath": {
                "simplerExplanation": "Type Paul Graham.",
                "guidedFixPrompt": "Type Paul Graham"
              }
            }
          }
        }
      },
      {
        "id": "comm-d13-b3-time-blocking-calendar-declarations",
        "day": 13,
        "blockNumber": 3,
        "title": "Calendar Time-Blocking: Declaring Focus Mode & Async Status",
        "conceptBudget": {
          "primaryConcept": "Time Blocking Invariant",
          "supportingTerms": [
            "Time Blocking (`Explicitly placing recurring 'Focus Time - No Meetings' blocks on calendars and setting Slack status to 'In Flow State'`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d13-b2-makers-schedule-author-paul-graham",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "time_block_demo.js",
            "initialCode": "function getTimeBlockingRule() {\n  return 'BLOCK_LARGE_UNINTERRUPTED_CALENDAR_CHUNKS_FOR_DEEP_WORK';\n}\n\nconsole.log(getTimeBlockingRule());",
            "expectedOutput": "BLOCK_LARGE_UNINTERRUPTED_CALENDAR_CHUNKS_FOR_DEEP_WORK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What calendar management practice preserves uninterrupted engineering flow?",
          "expectedStringOutput": "BLOCK_LARGE_UNINTERRUPTED_CALENDAR_CHUNKS_FOR_DEEP_WORK",
          "acceptableAnswers": [
            "BLOCK_LARGE_UNINTERRUPTED_CALENDAR_CHUNKS_FOR_DEEP_WORK",
            "Time blocking",
            "Block calendar chunks"
          ],
          "primaryMisconceptionId": "MC_SK_TIME_MANAGEMENT_MAKERS_SCHEDULE_BOUNDARIES",
          "diagnosisMap": {
            "NO_CALENDAR": {
              "misconceptionId": "MC_SK_TIME_MANAGEMENT_MAKERS_SCHEDULE_BOUNDARIES",
              "errorExplanation": "Rule is: BLOCK_LARGE_UNINTERRUPTED_CALENDAR_CHUNKS_FOR_DEEP_WORK.",
              "recoveryPath": {
                "simplerExplanation": "Matches BLOCK_LARGE_UNINTERRUPTED_CALENDAR_CHUNKS_FOR_DEEP_WORK.",
                "guidedFixPrompt": "Type BLOCK_LARGE_UNINTERRUPTED_CALENDAR_CHUNKS_FOR_DEEP_WORK"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Mental Health, Imposter Syndrome & Burnout Prevention: Psychological Safety",
    "overviewMetaphor": "Imposter Syndrome Is a Distorted Carnival Mirror: Highly competent engineers look into the mirror and see a fraud who got lucky; reframing \"I don't know\" into an empowered commitment (\"I haven't used Kubernetes Operators yet, but I will investigate and build a prototype by tomorrow\") replaces insecurity with fearless curiosity.",
    "blocks": [
      {
        "id": "comm-d14-b1-constructive-learning-reframer",
        "day": 14,
        "blockNumber": 1,
        "title": "Growth Mindset: Reframing \"I don't know\" $\\to$ \"I will investigate a POC\"",
        "conceptBudget": {
          "primaryConcept": "Constructive Learning Reframing Response Generator",
          "supportingTerms": [
            "Target Technology (`'Kubernetes Operators'`)",
            "Empowered Response String",
            "Psychological Safety (`true`)",
            "Status: Constructive Learning Reframing Generated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d13-b1-makers-schedule-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Growth Mindset Reframing Ledger",
              "boxes": [
                {
                  "label": "Imposter Reaction",
                  "value": "'I don't know anything about that...' (Insecure defensive freeze)",
                  "varType": "Insecure",
                  "isUpdated": false
                },
                {
                  "label": "Empowered Reframing",
                  "value": "'I haven't worked with Kubernetes Operators in production yet, but I will investigate and build a POC by tomorrow'",
                  "varType": "Growth",
                  "isUpdated": false
                },
                {
                  "label": "Psychological Safety",
                  "value": "CONSTRUCTIVE LEARNING REFRAMING GENERATED NOMINAL (GROWTH MINDSET!)",
                  "varType": "Safety",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "growth_mindset_demo.js",
            "initialCode": "function reframeLearning(tech) {\n  const res = `I have not worked with ${tech} in production yet, but I understand the core principles and will build a working POC to evaluate it by tomorrow.`;\n  return {\n    tech,\n    response: res,\n    status: 'CONSTRUCTIVE_LEARNING_REFRAMING_GENERATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(reframeLearning('Kubernetes Operators')));",
            "expectedOutput": "{\"tech\":\"Kubernetes Operators\",\"response\":\"I have not worked with Kubernetes Operators in production yet, but I understand the core principles and will build a working POC to evaluate it by tomorrow.\",\"status\":\"CONSTRUCTIVE_LEARNING_REFRAMING_GENERATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms the generation of an empowered, growth-mindset learning response?",
          "expectedStringOutput": "CONSTRUCTIVE_LEARNING_REFRAMING_GENERATED_NOMINAL",
          "acceptableAnswers": [
            "CONSTRUCTIVE_LEARNING_REFRAMING_GENERATED_NOMINAL",
            "status\":\"CONSTRUCTIVE_LEARNING_REFRAMING_GENERATED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_IMPOSTER_SYNDROME_BURNOUT_PREVENTION",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SK_IMPOSTER_SYNDROME_BURNOUT_PREVENTION",
              "errorExplanation": "Matches CONSTRUCTIVE_LEARNING_REFRAMING_GENERATED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type CONSTRUCTIVE_LEARNING_REFRAMING_GENERATED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d14-b2-growth-mindset-phrase",
        "day": 14,
        "blockNumber": 2,
        "title": "The Growth Mindset Inquiry Phrase: \"I will investigate and document a POC\"",
        "conceptBudget": {
          "primaryConcept": "Growth Inquiry Invariant",
          "supportingTerms": [
            "Growth Phrase (`'I will investigate and document a POC': The senior engineering signature indicating rapid adaptability and self-directed learning`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d14-b1-constructive-learning-reframer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Reframing Matrix",
            "codeSnippet": "// ❌ INSECURE:  \"I've never done that, sorry.\"\n// ❌ OVERCONFIDENT: \"Oh yeah I'm an expert\" (When you've never used it)\n// ✅ HIGH-SIGNAL: \"I haven't used it in production, but I will investigate and document a POC!\"",
            "lineNotes": {
              "1": "Defeatist rejection.",
              "2": "Dangerous false claim.",
              "3": "High-signal truth and action."
            }
          },
          {
            "type": "runnable_code",
            "filename": "poc_phrase_demo.js",
            "initialCode": "function getPocPhrase() {\n  return 'I will investigate and document a POC';\n}\n\nconsole.log(getPocPhrase());",
            "expectedOutput": "I will investigate and document a POC",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What high-signal commitment phrase replaces 'I don't know' when asked about an unfamiliar framework?",
          "expectedStringOutput": "I will investigate and document a POC",
          "acceptableAnswers": [
            "I will investigate and document a POC",
            "i will investigate and document a poc",
            "'I will investigate and document a POC'"
          ],
          "primaryMisconceptionId": "MC_SK_IMPOSTER_SYNDROME_BURNOUT_PREVENTION",
          "diagnosisMap": {
            "I don't know": {
              "misconceptionId": "MC_SK_IMPOSTER_SYNDROME_BURNOUT_PREVENTION",
              "errorExplanation": "High-signal response is: I will investigate and document a POC.",
              "recoveryPath": {
                "simplerExplanation": "Type I will investigate and document a POC.",
                "guidedFixPrompt": "Type I will investigate and document a POC"
              }
            }
          }
        }
      },
      {
        "id": "comm-d14-b3-remote-work-burnout-boundaries",
        "day": 14,
        "blockNumber": 3,
        "title": "Burnout Prevention: Hard Boundaries on Remote Work Notifications",
        "conceptBudget": {
          "primaryConcept": "Burnout Boundary Invariant",
          "supportingTerms": [
            "Notification Boundaries (`Turning off work Slack/Email notifications on personal phones after 6 PM to prevent chronic sympathetic nervous system exhaustion`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d14-b2-growth-mindset-phrase",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "burnout_boundaries_demo.js",
            "initialCode": "function getBurnoutRule() {\n  return 'ESTABLISH_STRICT_AFTER_HOURS_NOTIFICATION_BOUNDARIES';\n}\n\nconsole.log(getBurnoutRule());",
            "expectedOutput": "ESTABLISH_STRICT_AFTER_HOURS_NOTIFICATION_BOUNDARIES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What critical boundary habit prevents remote software engineering burnout?",
          "expectedStringOutput": "ESTABLISH_STRICT_AFTER_HOURS_NOTIFICATION_BOUNDARIES",
          "acceptableAnswers": [
            "ESTABLISH_STRICT_AFTER_HOURS_NOTIFICATION_BOUNDARIES",
            "After-hours notification boundaries",
            "Notification boundaries"
          ],
          "primaryMisconceptionId": "MC_SK_IMPOSTER_SYNDROME_BURNOUT_PREVENTION",
          "diagnosisMap": {
            "WORK_24_7": {
              "misconceptionId": "MC_SK_IMPOSTER_SYNDROME_BURNOUT_PREVENTION",
              "errorExplanation": "Habit is: ESTABLISH_STRICT_AFTER_HOURS_NOTIFICATION_BOUNDARIES.",
              "recoveryPath": {
                "simplerExplanation": "Matches ESTABLISH_STRICT_AFTER_HOURS_NOTIFICATION_BOUNDARIES.",
                "guidedFixPrompt": "Type ESTABLISH_STRICT_AFTER_HOURS_NOTIFICATION_BOUNDARIES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Cross-Functional Translation, SBI Feedback, Conflict Resolution & Executive Storytelling Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete intermediate soft skills and leadership engine: 1. Technical-to-business translation; 2. SBI constructive feedback delivery; 3. IBR conflict resolution certification; 4. 90-second standup timing; 5. Minto Pyramid presentation validation; 6. ZOPA negotiation range calculation.",
    "blocks": [
      {
        "id": "comm-d15-b1-tech-leadership-master-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Tech Leadership Communication Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Tech Leadership Communication Master Engine",
          "supportingTerms": [
            "Business Translation Engine",
            "SBI Feedback Engine",
            "IBR Conflict Engine",
            "Standup Discipline Engine",
            "Minto Pyramid Engine",
            "ZOPA Negotiation Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d14-b3-remote-work-burnout-boundaries",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 Tech Leadership Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Translates technical debt to business ROI & delivers SBI constructive feedback",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Resolves architectural disputes via IBR objective metrics & enforces 90s standups",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Structures Minto executive decks & calculates ZOPA negotiation overlaps",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Activates Tech Leadership Communication Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "leadership_kernel_demo.js",
            "initialCode": "function runLeadershipMaster() {\n  return {\n    translationSubsystem: 'ONLINE_BUSINESS_ROI_ACTIVE',\n    feedbackSubsystem: 'ONLINE_SBI_FRAMEWORK_ACTIVE',\n    conflictSubsystem: 'ONLINE_IBR_OBJECTIVE_ACTIVE',\n    standupSubsystem: 'ONLINE_90SEC_CAP_ACTIVE',\n    presentationSubsystem: 'ONLINE_MINTO_PYRAMID_ACTIVE',\n    negotiationSubsystem: 'ONLINE_ZOPA_RANGE_ACTIVE',\n    engineStatus: 'TECH_LEADERSHIP_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runLeadershipMaster().engineStatus);",
            "expectedOutput": "TECH_LEADERSHIP_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Tech Leadership Communication Master Engine?",
          "expectedStringOutput": "TECH_LEADERSHIP_MASTER_ACTIVE",
          "acceptableAnswers": [
            "TECH_LEADERSHIP_MASTER_ACTIVE",
            "engineStatus: TECH_LEADERSHIP_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_SK_CROSS_FUNCTIONAL_TRANSLATION_ELI5",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SK_CROSS_FUNCTIONAL_TRANSLATION_ELI5",
              "errorExplanation": "Matches TECH_LEADERSHIP_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type TECH_LEADERSHIP_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "comm-d15-b2-tech-leadership-engine-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Tech Leadership Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Tech Leadership Invariant Verification",
          "supportingTerms": [
            "Feedback Invariant",
            "Conflict Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d15-b1-tech-leadership-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "leadership_audit_demo.js",
            "initialCode": "function auditLeadership(t, s, i, st, m, z) {\n  const passed = t && s && i && st && m && z;\n  return {\n    translationVerified: t,\n    sbiVerified: s,\n    ibrVerified: i,\n    standupVerified: st,\n    mintoVerified: m,\n    zopaVerified: z,\n    grade: passed ? 'TECH_LEADERSHIP_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditLeadership(true, true, true, true, true, true)));",
            "expectedOutput": "{\"translationVerified\":true,\"sbiVerified\":true,\"ibrVerified\":true,\"standupVerified\":true,\"mintoVerified\":true,\"zopaVerified\":true,\"grade\":\"TECH_LEADERSHIP_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Translation, SBI Feedback, IBR Conflict, Standups, Minto, and ZOPA pass 100%?",
          "expectedStringOutput": "TECH_LEADERSHIP_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "TECH_LEADERSHIP_ENGINE_AUDIT_PASSED",
            "grade\":\"TECH_LEADERSHIP_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_SK_CROSS_FUNCTIONAL_TRANSLATION_ELI5",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SK_CROSS_FUNCTIONAL_TRANSLATION_ELI5",
              "errorExplanation": "All checks passing awards TECH_LEADERSHIP_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards TECH_LEADERSHIP_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type TECH_LEADERSHIP_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "comm-d15-b3-milestone2-comm-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Tech Leadership Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Tech Leadership Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d15-b2-tech-leadership-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_comm_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Cross-Functional Translation, SBI Feedback, Conflict Resolution & Executive Storytelling Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Cross-Functional Translation, SBI Feedback, Conflict Resolution & Executive Storytelling Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Cross-Functional Translation, SBI Feedback, Conflict Resolution & Executive Storytelling Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Cross-Functional Translation, SBI Feedback, Conflict Resolution & Executive Storytelling Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_SK_CROSS_FUNCTIONAL_TRANSLATION_ELI5",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SK_CROSS_FUNCTIONAL_TRANSLATION_ELI5",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Cross-Functional Translation, SBI Feedback, Conflict Resolution & Executive Storytelling Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Tech Resume Engineering: The Google X-Y-Z Formula & Impact Quantification",
    "overviewMetaphor": "The Google X-Y-Z Formula Is an Olympic Scorecard for Software Engineering: Stating 'I worked on databases' is like saying 'I ran around a track'; using Google's formula ('Optimized database query latency by 45% by implementing Redis caching and indexing slow Postgres queries') proves your medal-winning technical impact in numbers.",
    "blocks": [
      {
        "id": "comm-d16-b1-google-xyz-validator",
        "day": 16,
        "blockNumber": 1,
        "title": "Google X-Y-Z Formula: Accomplished [X] by [Y] via [Z]",
        "conceptBudget": {
          "primaryConcept": "Google X-Y-Z Resume Bullet Point Structure Validator",
          "supportingTerms": [
            "Action Verb (`'Optimized'`)",
            "Quantitative Metric (`'by 45%'`)",
            "Action Method (`'by implementing Redis'`)",
            "Google X-Y-Z Compliant (`true`)",
            "Status: Google XYZ Bullet Valid Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d15-b1-tech-leadership-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Google X-Y-Z Resume Bullet Architecture Ledger",
              "boxes": [
                {
                  "label": "X - Accomplished",
                  "value": "'Optimized database query latency' (Clear technical achievement)",
                  "varType": "Accomplishment",
                  "isUpdated": false
                },
                {
                  "label": "Y - Measured By",
                  "value": "'by 45%' (Definitive quantitative metric)",
                  "varType": "Metric",
                  "isUpdated": false
                },
                {
                  "label": "Z - Done By",
                  "value": "'by implementing Redis caching and indexing Postgres' (VALID NOMINAL!)",
                  "varType": "Method",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "google_xyz_demo.js",
            "initialCode": "function validateXyz(bullet) {\n  const hasVerb = /^(Architected|Engineered|Optimized|Developed|Implemented)/i.test(bullet);\n  const hasMetric = /\\d+(?:%|ms|x|k|\\$)/i.test(bullet);\n  const hasMethod = /(?:by|using|via)\\s+[a-z0-9]/i.test(bullet);\n  const ok = hasVerb && hasMetric && hasMethod;\n  return {\n    hasVerb,\n    hasMetric,\n    hasMethod,\n    isCompliant: ok,\n    status: ok ? 'GOOGLE_XYZ_BULLET_VALID_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(validateXyz('Optimized database query latency by 45% by implementing Redis caching and indexing slow Postgres queries.')));",
            "expectedOutput": "{\"hasVerb\":true,\"hasMetric\":true,\"hasMethod\":true,\"isCompliant\":true,\"status\":\"GOOGLE_XYZ_BULLET_VALID_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a resume bullet point adheres to Google's X-Y-Z structural formula?",
          "expectedStringOutput": "GOOGLE_XYZ_BULLET_VALID_NOMINAL",
          "acceptableAnswers": [
            "GOOGLE_XYZ_BULLET_VALID_NOMINAL",
            "status\":\"GOOGLE_XYZ_BULLET_VALID_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_TECH_RESUME_GOOGLE_XYZ_FORMULA",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SK_TECH_RESUME_GOOGLE_XYZ_FORMULA",
              "errorExplanation": "Contains verb, metric, and method: GOOGLE_XYZ_BULLET_VALID_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches GOOGLE_XYZ_BULLET_VALID_NOMINAL.",
                "guidedFixPrompt": "Type GOOGLE_XYZ_BULLET_VALID_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d16-b2-google-formula-acronym-name",
        "day": 16,
        "blockNumber": 2,
        "title": "The Google X-Y-Z Formula Name",
        "conceptBudget": {
          "primaryConcept": "Google Formula Invariant",
          "supportingTerms": [
            "`X-Y-Z Formula` (Pioneered by Google's VP of People Operations Laszlo Bock to evaluate candidates on concrete delivered outcomes)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d16-b1-google-xyz-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Formula Structure",
            "codeSnippet": "// \"Accomplished [X] as measured by [Y], by doing [Z]\"\n// Example: \"Reduced API p99 latency [X] by 60% (from 400ms to 160ms) [Y] by migrating backend services to Go [Z]\"",
            "lineNotes": {
              "1": "Universal template.",
              "2": "Concrete production example."
            }
          },
          {
            "type": "runnable_code",
            "filename": "xyz_name_demo.js",
            "initialCode": "function getXyzFormulaName() {\n  return 'X-Y-Z Formula';\n}\n\nconsole.log(getXyzFormulaName());",
            "expectedOutput": "X-Y-Z Formula",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the official name of the three-variable resume structuring formula popularized by Google?",
          "expectedStringOutput": "X-Y-Z Formula",
          "acceptableAnswers": [
            "X-Y-Z Formula",
            "XYZ Formula",
            "X-Y-Z formula"
          ],
          "primaryMisconceptionId": "MC_SK_TECH_RESUME_GOOGLE_XYZ_FORMULA",
          "diagnosisMap": {
            "STAR Formula": {
              "misconceptionId": "MC_SK_TECH_RESUME_GOOGLE_XYZ_FORMULA",
              "errorExplanation": "STAR is for interviews. Google's resume formula is the X-Y-Z Formula.",
              "recoveryPath": {
                "simplerExplanation": "Type X-Y-Z Formula.",
                "guidedFixPrompt": "Type X-Y-Z Formula"
              }
            }
          }
        }
      },
      {
        "id": "comm-d16-b3-action-verbs-over-passive-words",
        "day": 16,
        "blockNumber": 3,
        "title": "Action Verbs: Replacing \"Assisted with\" with \"Architected\" & \"Engineered\"",
        "conceptBudget": {
          "primaryConcept": "Action Verb Invariant",
          "supportingTerms": [
            "High-Impact Action Verbs (`'Architected'`, `'Engineered'`, `'Automated'`, `'Refactored'` directly demonstrate personal agency and technical ownership)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d16-b2-google-formula-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "action_verbs_demo.js",
            "initialCode": "function getHighImpactVerbs() {\n  return 'ARCHITECTED_ENGINEERED_OPTIMIZED_AUTOMATED';\n}\n\nconsole.log(getHighImpactVerbs());",
            "expectedOutput": "ARCHITECTED_ENGINEERED_OPTIMIZED_AUTOMATED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What class of powerful technical verbs should lead every resume bullet point?",
          "expectedStringOutput": "ARCHITECTED_ENGINEERED_OPTIMIZED_AUTOMATED",
          "acceptableAnswers": [
            "ARCHITECTED_ENGINEERED_OPTIMIZED_AUTOMATED",
            "Action verbs",
            "High-impact action verbs"
          ],
          "primaryMisconceptionId": "MC_SK_TECH_RESUME_GOOGLE_XYZ_FORMULA",
          "diagnosisMap": {
            "HELPED": {
              "misconceptionId": "MC_SK_TECH_RESUME_GOOGLE_XYZ_FORMULA",
              "errorExplanation": "Passive words weaken impact. Use: ARCHITECTED_ENGINEERED_OPTIMIZED_AUTOMATED.",
              "recoveryPath": {
                "simplerExplanation": "Matches ARCHITECTED_ENGINEERED_OPTIMIZED_AUTOMATED.",
                "guidedFixPrompt": "Type ARCHITECTED_ENGINEERED_OPTIMIZED_AUTOMATED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "LinkedIn Optimization & Personal Branding: High-Signal Engineering Profiles",
    "overviewMetaphor": "A LinkedIn Profile Is an API Endpoint for Recruiters: A generic headline ('Looking for software roles') returns HTTP 404 No Match; a 3-part pipe-delimited headline (`Senior Software Engineer | React, TypeScript, Node.js | Scaling Cloud SaaS Systems`) returns an instant JSON 200 OK with relevant recruiter inbound requests.",
    "blocks": [
      {
        "id": "comm-d17-b1-linkedin-headline-evaluator",
        "day": 17,
        "blockNumber": 1,
        "title": "LinkedIn Headline: 3-Part Architecture (Role | Tech Stack | Impact Domain)",
        "conceptBudget": {
          "primaryConcept": "LinkedIn Technical Headline Signal Evaluator",
          "supportingTerms": [
            "Target Role (`'Senior Software Engineer'`)",
            "Core Tech Stack (`'React, TypeScript, Node.js'`)",
            "Specialty Domain (`'Scaling Cloud SaaS Systems'`)",
            "Status: LinkedIn Headline High Signal Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d16-b1-google-xyz-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "LinkedIn High-Signal Headline Architecture Ledger",
              "boxes": [
                {
                  "label": "Segment 1: Target Role",
                  "value": "'Senior Software Engineer' (Exact search keyword match)",
                  "varType": "Role",
                  "isUpdated": false
                },
                {
                  "label": "Segment 2: Primary Stack",
                  "value": "'React, TypeScript, Node.js' (High-demand technical stack)",
                  "varType": "Stack",
                  "isUpdated": false
                },
                {
                  "label": "Segment 3: Domain Value",
                  "value": "'Scaling Cloud SaaS Systems' (HIGH SIGNAL NOMINAL!)",
                  "varType": "Domain",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "linkedin_headline_demo.js",
            "initialCode": "function evalHeadline(hl) {\n  const parts = hl.split('|').map(s => s.trim());\n  const ok = parts.length >= 3 && hl.length >= 30;\n  return {\n    role: parts[0],\n    stack: parts[1],\n    domain: parts[2],\n    isHighSignal: ok,\n    status: ok ? 'LINKEDIN_HEADLINE_HIGH_SIGNAL_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(evalHeadline('Senior Software Engineer | React, TypeScript, Node.js | Scaling Cloud SaaS Systems')));",
            "expectedOutput": "{\"role\":\"Senior Software Engineer\",\"stack\":\"React, TypeScript, Node.js\",\"domain\":\"Scaling Cloud SaaS Systems\",\"isHighSignal\":true,\"status\":\"LINKEDIN_HEADLINE_HIGH_SIGNAL_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a LinkedIn profile headline contains high-signal role, stack, and domain components?",
          "expectedStringOutput": "LINKEDIN_HEADLINE_HIGH_SIGNAL_NOMINAL",
          "acceptableAnswers": [
            "LINKEDIN_HEADLINE_HIGH_SIGNAL_NOMINAL",
            "status\":\"LINKEDIN_HEADLINE_HIGH_SIGNAL_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_LINKEDIN_OPTIMIZATION_PERSONAL_BRAND",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SK_LINKEDIN_OPTIMIZATION_PERSONAL_BRAND",
              "errorExplanation": "Matches LINKEDIN_HEADLINE_HIGH_SIGNAL_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type LINKEDIN_HEADLINE_HIGH_SIGNAL_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d17-b2-headline-pipe-delimiter",
        "day": 17,
        "blockNumber": 2,
        "title": "The Professional Pipe Delimiter `|` in LinkedIn Headlines",
        "conceptBudget": {
          "primaryConcept": "Pipe Delimiter Invariant",
          "supportingTerms": [
            "Pipe Character (`|`: Provides clean, scannable visual segmentation between role title, programming languages, and industry domain)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d17-b1-linkedin-headline-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Headline Layout Format",
            "codeSnippet": "// [Role Title] | [Key Technical Languages/Frameworks] | [Impact/Specialty Domain]\n// Example: Backend Engineer | Go, Python, Distributed Systems | High-Throughput Fintech APIs",
            "lineNotes": {
              "1": "Structure template.",
              "2": "Concrete production headline."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pipe_delimiter_demo.js",
            "initialCode": "function getDelimiter() {\n  return '|';\n}\n\nconsole.log(getDelimiter());",
            "expectedOutput": "|",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What single character is standardly used to separate segments in a high-signal technical headline?",
          "expectedStringOutput": "|",
          "acceptableAnswers": [
            "|",
            "pipe",
            "vertical bar",
            "'|'"
          ],
          "primaryMisconceptionId": "MC_SK_LINKEDIN_OPTIMIZATION_PERSONAL_BRAND",
          "diagnosisMap": {
            ",": {
              "misconceptionId": "MC_SK_LINKEDIN_OPTIMIZATION_PERSONAL_BRAND",
              "errorExplanation": "Commas blend into text. Standard delimiter is the pipe character |.",
              "recoveryPath": {
                "simplerExplanation": "Type |.",
                "guidedFixPrompt": "Type |"
              }
            }
          }
        }
      },
      {
        "id": "comm-d17-b3-showcasing-github-open-source-projects",
        "day": 17,
        "blockNumber": 3,
        "title": "Proof of Work: Linking GitHub Repositories & Live Demos in Featured Section",
        "conceptBudget": {
          "primaryConcept": "Proof of Work Invariant",
          "supportingTerms": [
            "Featured Section Proof (`Pinning live demo links, architecture case studies, and GitHub repositories in the Featured section proves actual coding ability to recruiters`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d17-b2-headline-pipe-delimiter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "featured_proof_demo.js",
            "initialCode": "function getFeaturedSectionStrategy() {\n  return 'PIN_LIVE_PROJECT_DEMOS_AND_GITHUB_REPOSITORIES';\n}\n\nconsole.log(getFeaturedSectionStrategy());",
            "expectedOutput": "PIN_LIVE_PROJECT_DEMOS_AND_GITHUB_REPOSITORIES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What content should software engineers pin in their LinkedIn Featured section to maximize credibility?",
          "expectedStringOutput": "PIN_LIVE_PROJECT_DEMOS_AND_GITHUB_REPOSITORIES",
          "acceptableAnswers": [
            "PIN_LIVE_PROJECT_DEMOS_AND_GITHUB_REPOSITORIES",
            "Live project demos and GitHub repos",
            "Live demos and GitHub"
          ],
          "primaryMisconceptionId": "MC_SK_LINKEDIN_OPTIMIZATION_PERSONAL_BRAND",
          "diagnosisMap": {
            "CERTIFICATES_ONLY": {
              "misconceptionId": "MC_SK_LINKEDIN_OPTIMIZATION_PERSONAL_BRAND",
              "errorExplanation": "Working code is highest signal: PIN_LIVE_PROJECT_DEMOS_AND_GITHUB_REPOSITORIES.",
              "recoveryPath": {
                "simplerExplanation": "Matches PIN_LIVE_PROJECT_DEMOS_AND_GITHUB_REPOSITORIES.",
                "guidedFixPrompt": "Type PIN_LIVE_PROJECT_DEMOS_AND_GITHUB_REPOSITORIES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "The Behavioral Interview Framework: The STAR Method & Time Allocation",
    "overviewMetaphor": "The STAR Method Is a 2-Minute Movie Trailer: The Situation (15s) sets the dark Gotham backdrop; the Task (15s) explains the Joker's bomb; the Action (80s, $64\\%$) is Batman building the sonar gadget and executing the rescue; and the Result (15s) shows Gotham saved with $0$ casualties.",
    "blocks": [
      {
        "id": "comm-d18-b1-star-time-allocation-auditor",
        "day": 18,
        "blockNumber": 1,
        "title": "STAR Method: Allocating $\\ge 60\\%$ of Time ($64.0\\%$) to the Action Section",
        "conceptBudget": {
          "primaryConcept": "STAR Behavioral Response Time Allocation Auditor",
          "supportingTerms": [
            "Situation ($15$s)",
            "Task ($15$s)",
            "Action ($80$s $\\implies 64.0\\%$)",
            "Result ($15$s)",
            "Total Duration ($125$s $\\le 180$s)",
            "Status: STAR Time Allocation Optimal Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d17-b1-linkedin-headline-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "STAR Behavioral Time Allocation Ledger",
              "boxes": [
                {
                  "label": "S - Situation (15s)",
                  "value": "Brief context of the legacy payment monolith",
                  "varType": "Situation",
                  "isUpdated": false
                },
                {
                  "label": "T - Task (15s)",
                  "value": "My objective was to decouple billing from user auth",
                  "varType": "Task",
                  "isUpdated": false
                },
                {
                  "label": "A - Action (80s)",
                  "value": "80s (64.0% of total speaking time) -> PERSONAL LEADERSHIP & TECH CODE",
                  "varType": "Action",
                  "isUpdated": false
                },
                {
                  "label": "R - Result (15s)",
                  "value": "Zero downtime & p99 latency dropped by 50% (ALLOCATION OPTIMAL NOMINAL!)",
                  "varType": "Result",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "star_allocation_demo.js",
            "initialCode": "function auditStar(s, t, a, r) {\n  const tot = s + t + a + r;\n  const pct = Number(((a / tot) * 100).toFixed(1));\n  const ok = pct >= 60.0 && tot <= 180;\n  return {\n    totalSeconds: tot,\n    actionPercentage: pct,\n    isOptimal: ok,\n    status: ok ? 'STAR_TIME_ALLOCATION_OPTIMAL_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditStar(15, 15, 80, 15)));",
            "expectedOutput": "{\"totalSeconds\":125,\"actionPercentage\":64,\"isOptimal\":true,\"status\":\"STAR_TIME_ALLOCATION_OPTIMAL_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action percentage number is achieved in a 125-second response with 80 seconds spent on Action?",
          "expectedStringOutput": "64",
          "acceptableAnswers": [
            "64",
            "64.0",
            "actionPercentage\":64",
            "64%"
          ],
          "primaryMisconceptionId": "MC_SK_BEHAVIORAL_INTERVIEW_STAR_METHOD",
          "diagnosisMap": {
            "20": {
              "misconceptionId": "MC_SK_BEHAVIORAL_INTERVIEW_STAR_METHOD",
              "errorExplanation": "80 / 125 is 64%.",
              "recoveryPath": {
                "simplerExplanation": "Percentage is 64.",
                "guidedFixPrompt": "Type 64"
              }
            }
          }
        }
      },
      {
        "id": "comm-d18-b2-target-star-action-percentage",
        "day": 18,
        "blockNumber": 2,
        "title": "Target STAR Action Allocation: $70\\%$ on Personal Contribution",
        "conceptBudget": {
          "primaryConcept": "STAR Action Target Invariant",
          "supportingTerms": [
            "$70\\%$ Action Target (`Interviewers hire YOU, not your team; allocating ~70% of response time to 'What I designed, coded, tested, and led' demonstrates senior competency`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d18-b1-star-time-allocation-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "STAR Time Budgeting",
            "codeSnippet": "// 1. Situation: ~10% (Set context fast - 15 seconds)\n// 2. Task:      ~10% (Define your specific problem - 15 seconds)\n// 3. Action:    ~70% (WHERE YOU SHINE: Specific tools, decisions, leadership - 80 seconds)\n// 4. Result:    ~10% (Metrics and lasting automated guardrails - 15 seconds)",
            "lineNotes": {
              "1": "Situation budget.",
              "2": "Task budget.",
              "3": "Action budget (70%).",
              "4": "Result budget."
            }
          },
          {
            "type": "runnable_code",
            "filename": "star_target_demo.js",
            "initialCode": "function getTargetActionPct() {\n  return 70;\n}\n\nconsole.log(getTargetActionPct());",
            "expectedOutput": "70",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What target percentage of behavioral interview response time should be dedicated to the Action section?",
          "expectedStringOutput": "70",
          "acceptableAnswers": [
            "70",
            "70%",
            "70 percent",
            "about 70%"
          ],
          "primaryMisconceptionId": "MC_SK_BEHAVIORAL_INTERVIEW_STAR_METHOD",
          "diagnosisMap": {
            "25": {
              "misconceptionId": "MC_SK_BEHAVIORAL_INTERVIEW_STAR_METHOD",
              "errorExplanation": "Equal division spends too much on setup. Action target is 70%.",
              "recoveryPath": {
                "simplerExplanation": "Type 70.",
                "guidedFixPrompt": "Type 70"
              }
            }
          }
        }
      },
      {
        "id": "comm-d18-b3-i-vs-we-in-behavioral-interviews",
        "day": 18,
        "blockNumber": 3,
        "title": "The \"I vs We\" Dynamic: Owning Personal Technical Leadership",
        "conceptBudget": {
          "primaryConcept": "I vs We Invariant",
          "supportingTerms": [
            "I vs We (`Using 'We' to credit team collaboration on the project overview, but shifting strictly to 'I architected', 'I investigated', 'I decided' during the Action section`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d18-b2-target-star-action-percentage",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "i_vs_we_demo.js",
            "initialCode": "function getPronounStrategy() {\n  return 'USE_I_TO_DESCRIBE_YOUR_SPECIFIC_TECHNICAL_ACTIONS_AND_DECISIONS';\n}\n\nconsole.log(getPronounStrategy());",
            "expectedOutput": "USE_I_TO_DESCRIBE_YOUR_SPECIFIC_TECHNICAL_ACTIONS_AND_DECISIONS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What pronoun standard should software candidates follow when detailing the Action section of a STAR response?",
          "expectedStringOutput": "USE_I_TO_DESCRIBE_YOUR_SPECIFIC_TECHNICAL_ACTIONS_AND_DECISIONS",
          "acceptableAnswers": [
            "USE_I_TO_DESCRIBE_YOUR_SPECIFIC_TECHNICAL_ACTIONS_AND_DECISIONS",
            "Use I for actions",
            "Use I"
          ],
          "primaryMisconceptionId": "MC_SK_BEHAVIORAL_INTERVIEW_STAR_METHOD",
          "diagnosisMap": {
            "ALWAYS_WE": {
              "misconceptionId": "MC_SK_BEHAVIORAL_INTERVIEW_STAR_METHOD",
              "errorExplanation": "Always using 'we' obscures your personal contribution. Use: USE_I_TO_DESCRIBE_YOUR_SPECIFIC_TECHNICAL_ACTIONS_AND_DECISIONS.",
              "recoveryPath": {
                "simplerExplanation": "Matches USE_I_TO_DESCRIBE_YOUR_SPECIFIC_TECHNICAL_ACTIONS_AND_DECISIONS.",
                "guidedFixPrompt": "Type USE_I_TO_DESCRIBE_YOUR_SPECIFIC_TECHNICAL_ACTIONS_AND_DECISIONS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Answering \"Tell Me About Yourself\": The 90-Second Present-Past-Future Pitch",
    "overviewMetaphor": "The 90-Second Pitch Is a Guided Highway Route into the Interviewer's City: Starting from your current engineering vehicle (Present: 'Fullstack engineer scaling React/Node apps'), tracing the highway milestones you crossed (Past: 'Led database migrations'), and parking seamlessly in the target company's garage (Future: 'Excited to scale payments infrastructure at Stripe').",
    "blocks": [
      {
        "id": "comm-d19-b1-elevator-pitch-validator",
        "day": 19,
        "blockNumber": 1,
        "title": "Opening Pitch: Present $\\to$ Past $\\to$ Future Tailored to `'Stripe'`",
        "conceptBudget": {
          "primaryConcept": "Present-Past-Future Pitch Structure Validator",
          "supportingTerms": [
            "Present Strengths",
            "Past Crucible Milestones",
            "Future Target Vision (`'Stripe'`)",
            "Tailored to Company (`true`)",
            "Status: Elevator Pitch Tailored Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d18-b1-star-time-allocation-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Present-Past-Future Pitch Architecture Ledger",
              "boxes": [
                {
                  "label": "1. Present",
                  "value": "'Currently a fullstack developer building React/Node microservices'",
                  "varType": "Present",
                  "isUpdated": false
                },
                {
                  "label": "2. Past",
                  "value": "'Previously led database migrations and caching at a fintech startup'",
                  "varType": "Past",
                  "isUpdated": false
                },
                {
                  "label": "3. Future (Stripe)",
                  "value": "'Excited to scale high-throughput payments at Stripe' (TAILORED NOMINAL!)",
                  "varType": "Future",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pitch_demo.js",
            "initialCode": "function validatePitch(pres, past, fut, co) {\n  const ok = pres.length >= 20 && past.length >= 20 && fut.includes(co);\n  return {\n    targetCompany: co,\n    isTailored: ok,\n    status: ok ? 'ELEVATOR_PITCH_TAILORED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(validatePitch('Currently fullstack dev building React/Node apps', 'Previously led database migrations at fintech startup', 'Excited to bring this expertise to Stripe to scale payments infrastructure', 'Stripe')));",
            "expectedOutput": "{\"targetCompany\":\"Stripe\",\"isTailored\":true,\"status\":\"ELEVATOR_PITCH_TAILORED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that an opening interview pitch follows the Present-Past-Future framework tailored to the company?",
          "expectedStringOutput": "ELEVATOR_PITCH_TAILORED_NOMINAL",
          "acceptableAnswers": [
            "ELEVATOR_PITCH_TAILORED_NOMINAL",
            "status\":\"ELEVATOR_PITCH_TAILORED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_TELL_ME_ABOUT_YOURSELF_PITCH",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SK_TELL_ME_ABOUT_YOURSELF_PITCH",
              "errorExplanation": "Matches ELEVATOR_PITCH_TAILORED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type ELEVATOR_PITCH_TAILORED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d19-b2-pitch-narrative-arc-model",
        "day": 19,
        "blockNumber": 2,
        "title": "The Present-Past-Future Narrative Arc",
        "conceptBudget": {
          "primaryConcept": "Present-Past-Future Invariant",
          "supportingTerms": [
            "Present-Past-Future (`The gold standard 3-stage temporal narrative arc for opening interviews, preventing rambling chronological life stories`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d19-b1-elevator-pitch-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "90-Second Pitch Blueprint",
            "codeSnippet": "// 1. PRESENT (~30s): Who you are right now, core tech stack, and primary superpower\n// 2. PAST (~30s):    2-3 highlight reel project milestones that shaped your engineering caliber\n// 3. FUTURE (~30s):  Why this specific company & role is the exact logical next chapter",
            "lineNotes": {
              "1": "Present stage.",
              "2": "Past crucible stage.",
              "3": "Future company alignment."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pitch_arc_demo.js",
            "initialCode": "function getPitchArc() {\n  return 'Present-Past-Future';\n}\n\nconsole.log(getPitchArc());",
            "expectedOutput": "Present-Past-Future",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the name of the 3-part narrative model used to structure 'Tell me about yourself' responses?",
          "expectedStringOutput": "Present-Past-Future",
          "acceptableAnswers": [
            "Present-Past-Future",
            "present-past-future",
            "Present Past Future"
          ],
          "primaryMisconceptionId": "MC_SK_TELL_ME_ABOUT_YOURSELF_PITCH",
          "diagnosisMap": {
            "Chronological Life Story": {
              "misconceptionId": "MC_SK_TELL_ME_ABOUT_YOURSELF_PITCH",
              "errorExplanation": "Chronological stories ramble. The modern standard is Present-Past-Future.",
              "recoveryPath": {
                "simplerExplanation": "Type Present-Past-Future.",
                "guidedFixPrompt": "Type Present-Past-Future"
              }
            }
          }
        }
      },
      {
        "id": "comm-d19-b3-maximum-elevator-pitch-duration",
        "day": 19,
        "blockNumber": 3,
        "title": "The 90-Second Duration Ceiling for Opening Pitches",
        "conceptBudget": {
          "primaryConcept": "Pitch Duration Invariant",
          "supportingTerms": [
            "90-Second Pitch (`Keeping the opening pitch between 60 and 90 seconds hooks the interviewer's attention without inducing cognitive fatigue`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d19-b2-pitch-narrative-arc-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pitch_duration_demo.js",
            "initialCode": "function getMaxPitchSeconds() {\n  return 90;\n}\n\nconsole.log(getMaxPitchSeconds());",
            "expectedOutput": "90",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the recommended maximum duration in seconds for an opening 'Tell me about yourself' pitch?",
          "expectedStringOutput": "90",
          "acceptableAnswers": [
            "90",
            "90 seconds",
            "90s"
          ],
          "primaryMisconceptionId": "MC_SK_TELL_ME_ABOUT_YOURSELF_PITCH",
          "diagnosisMap": {
            "300": {
              "misconceptionId": "MC_SK_TELL_ME_ABOUT_YOURSELF_PITCH",
              "errorExplanation": "5 minutes is far too long. Target maximum is 90 seconds.",
              "recoveryPath": {
                "simplerExplanation": "Type 90.",
                "guidedFixPrompt": "Type 90"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Tackling \"Tell Me About a Time You Failed\": Blameless Postmortem Storytelling",
    "overviewMetaphor": "Failure Storytelling Is an Aviation Black-Box Flight Investigation: The greatest pilots do not pretend they never encounter turbulence; they explain how an engine flameout occurred, how they used the '5 Whys' to diagnose the faulty valve, and how they installed an automated backup sensor so the flameout can never happen again.",
    "blocks": [
      {
        "id": "comm-d20-b1-failure-story-auditor",
        "day": 20,
        "blockNumber": 1,
        "title": "Failure Story: Ownership + 5-Whys Root Cause + Permanent Guardrail",
        "conceptBudget": {
          "primaryConcept": "Blameless Failure Story & Prevention Guardrail Auditor",
          "supportingTerms": [
            "Technical Ownership Demonstrated (`true`)",
            "Root Cause Analyzed (`true`)",
            "Permanent Guardrail Constructed (`true`)",
            "Status: Blameless Failure Story Certified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d19-b1-elevator-pitch-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Blameless Postmortem Storytelling Ledger",
              "boxes": [
                {
                  "label": "1. Ownership",
                  "value": "'I owned the defective cache invalidation bug without blaming teammates'",
                  "varType": "Ownership",
                  "isUpdated": false
                },
                {
                  "label": "2. 5 Whys Root Cause",
                  "value": "Diagnosed lack of automated integration tests on edge-case TTLs",
                  "varType": "Root Cause",
                  "isUpdated": false
                },
                {
                  "label": "3. Permanent Guardrail",
                  "value": "Wrote automated CI integration test suite (CERTIFIED NOMINAL!)",
                  "varType": "Guardrail",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "failure_story_demo.js",
            "initialCode": "function auditFailure(owned, rootCause, guardrail) {\n  const ok = owned && rootCause && guardrail;\n  return {\n    isHighSignal: ok,\n    status: ok ? 'BLAMELESS_FAILURE_STORY_CERTIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditFailure(true, true, true)));",
            "expectedOutput": "{\"isHighSignal\":true,\"status\":\"BLAMELESS_FAILURE_STORY_CERTIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a failure story demonstrates extreme ownership and permanent systemic guardrail construction?",
          "expectedStringOutput": "BLAMELESS_FAILURE_STORY_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "BLAMELESS_FAILURE_STORY_CERTIFIED_NOMINAL",
            "status\":\"BLAMELESS_FAILURE_STORY_CERTIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_FAILURE_POSTMORTEM_STORYTELLING",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SK_FAILURE_POSTMORTEM_STORYTELLING",
              "errorExplanation": "Matches BLAMELESS_FAILURE_STORY_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type BLAMELESS_FAILURE_STORY_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d20-b2-five-whys-root-cause-analysis",
        "day": 20,
        "blockNumber": 2,
        "title": "Root Cause Investigation: The 5 Whys Analysis Methodology",
        "conceptBudget": {
          "primaryConcept": "5 Whys Invariant",
          "supportingTerms": [
            "5 Whys (`Drilling down through 5 layers of 'Why did this happen?' until uncovering the fundamental systemic or testing deficiency`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d20-b1-failure-story-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "5 Whys Sequence",
            "codeSnippet": "// 1. Why did the site crash? -> Database ran out of connections\n// 2. Why did it run out?      -> Auth service leaked open socket pool handles\n// 3. Why did it leak?        -> Error handler missed a finally block close\n// 4. Why was it missed?      -> No unit test covered the 500 error code path\n// 5. Why no test?            -> SYSTEMIC ROOT CAUSE: CI lacked mandatory branch coverage threshold!",
            "lineNotes": {
              "1": "Why 1: Symptom.",
              "2": "Why 2: Mechanism.",
              "3": "Why 3: Code bug.",
              "4": "Why 4: Testing gap.",
              "5": "Why 5: Systemic root cause."
            }
          },
          {
            "type": "runnable_code",
            "filename": "five_whys_demo.js",
            "initialCode": "function get5WhysName() {\n  return '5 Whys Analysis';\n}\n\nconsole.log(get5WhysName());",
            "expectedOutput": "5 Whys Analysis",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What root cause analysis methodology drills down through 5 layers of causation to find systemic flaws?",
          "expectedStringOutput": "5 Whys Analysis",
          "acceptableAnswers": [
            "5 Whys Analysis",
            "5 Whys",
            "Five Whys",
            "The 5 Whys"
          ],
          "primaryMisconceptionId": "MC_SK_FAILURE_POSTMORTEM_STORYTELLING",
          "diagnosisMap": {
            "Blame Game": {
              "misconceptionId": "MC_SK_FAILURE_POSTMORTEM_STORYTELLING",
              "errorExplanation": "Engineering postmortems use 5 Whys Analysis.",
              "recoveryPath": {
                "simplerExplanation": "Type 5 Whys Analysis.",
                "guidedFixPrompt": "Type 5 Whys Analysis"
              }
            }
          }
        }
      },
      {
        "id": "comm-d20-b3-permanent-automated-guardrails",
        "day": 20,
        "blockNumber": 3,
        "title": "The Ultimate Answer: Building Permanent Automated Guardrails",
        "conceptBudget": {
          "primaryConcept": "Automated Guardrail Invariant",
          "supportingTerms": [
            "Automated Guardrail (`The final victory of a failure story is showing that you wrote an automated linter, unit test, or CI check so the bug can NEVER recur in production`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d20-b2-five-whys-root-cause-analysis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "guardrail_demo.js",
            "initialCode": "function getFailureConclusionRule() {\n  return 'CONSTRUCT_PERMANENT_AUTOMATED_GUARDRAILS_TO_PREVENT_RECURRENCE';\n}\n\nconsole.log(getFailureConclusionRule());",
            "expectedOutput": "CONSTRUCT_PERMANENT_AUTOMATED_GUARDRAILS_TO_PREVENT_RECURRENCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What must a candidate highlight at the conclusion of a failure interview story to prove senior engineering maturity?",
          "expectedStringOutput": "CONSTRUCT_PERMANENT_AUTOMATED_GUARDRAILS_TO_PREVENT_RECURRENCE",
          "acceptableAnswers": [
            "CONSTRUCT_PERMANENT_AUTOMATED_GUARDRAILS_TO_PREVENT_RECURRENCE",
            "Permanent automated guardrails",
            "Automated guardrails"
          ],
          "primaryMisconceptionId": "MC_SK_FAILURE_POSTMORTEM_STORYTELLING",
          "diagnosisMap": {
            "APOLOGY": {
              "misconceptionId": "MC_SK_FAILURE_POSTMORTEM_STORYTELLING",
              "errorExplanation": "Interviewers want systemic prevention: CONSTRUCT_PERMANENT_AUTOMATED_GUARDRAILS_TO_PREVENT_RECURRENCE.",
              "recoveryPath": {
                "simplerExplanation": "Matches CONSTRUCT_PERMANENT_AUTOMATED_GUARDRAILS_TO_PREVENT_RECURRENCE.",
                "guidedFixPrompt": "Type CONSTRUCT_PERMANENT_AUTOMATED_GUARDRAILS_TO_PREVENT_RECURRENCE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Google X-Y-Z Resume, STAR Method Behavioral Responses & Root-Cause Failure Storytelling Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete advanced tech career acceleration engine: 1. Google X-Y-Z resume bullet point validation; 2. High-signal LinkedIn headline auditing; 3. STAR behavioral interview time allocation ($70\\%$ Action allocation); 4. Present-Past-Future tailored pitch generation; 5. Blameless failure guardrail verification.",
    "blocks": [
      {
        "id": "comm-d21-b1-career-interview-master-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Tech Career & Interview Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Tech Career & Interview Master Engine",
          "supportingTerms": [
            "Google X-Y-Z Engine",
            "LinkedIn Headline Engine",
            "STAR Allocation Engine",
            "Tailored Pitch Engine",
            "Failure Guardrail Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d20-b3-permanent-automated-guardrails",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Career & Interview Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Validates Google X-Y-Z resume bullets & audits 3-part LinkedIn headlines",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Allocates 64%+ of behavioral speaking time to STAR personal actions",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Crafts 90s Present-Past-Future pitches & certifies 5-Whys failure guardrails",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Activates Tech Career & Interview Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "career_kernel_demo.js",
            "initialCode": "function runCareerMaster() {\n  return {\n    xyzSubsystem: 'ONLINE_GOOGLE_XYZ_ACTIVE',\n    linkedinSubsystem: 'ONLINE_3PART_HEADLINE_ACTIVE',\n    starSubsystem: 'ONLINE_64PCT_ACTION_ACTIVE',\n    pitchSubsystem: 'ONLINE_PRESENT_PAST_FUTURE_ACTIVE',\n    failureSubsystem: 'ONLINE_5WHYS_GUARDRAIL_ACTIVE',\n    engineStatus: 'CAREER_INTERVIEW_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runCareerMaster().engineStatus);",
            "expectedOutput": "CAREER_INTERVIEW_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Tech Career & Interview Master Engine?",
          "expectedStringOutput": "CAREER_INTERVIEW_MASTER_ACTIVE",
          "acceptableAnswers": [
            "CAREER_INTERVIEW_MASTER_ACTIVE",
            "engineStatus: CAREER_INTERVIEW_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_SK_TECH_RESUME_GOOGLE_XYZ_FORMULA",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SK_TECH_RESUME_GOOGLE_XYZ_FORMULA",
              "errorExplanation": "Matches CAREER_INTERVIEW_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type CAREER_INTERVIEW_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "comm-d21-b2-career-interview-engine-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Tech Career Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Tech Career Invariant Verification",
          "supportingTerms": [
            "Resume Invariant",
            "STAR Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d21-b1-career-interview-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "career_audit_demo.js",
            "initialCode": "function auditCareer(x, l, s, p, f) {\n  const passed = x && l && s && p && f;\n  return {\n    xyzVerified: x,\n    linkedinVerified: l,\n    starVerified: s,\n    pitchVerified: p,\n    failureVerified: f,\n    grade: passed ? 'CAREER_INTERVIEW_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditCareer(true, true, true, true, true)));",
            "expectedOutput": "{\"xyzVerified\":true,\"linkedinVerified\":true,\"starVerified\":true,\"pitchVerified\":true,\"failureVerified\":true,\"grade\":\"CAREER_INTERVIEW_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Google X-Y-Z, LinkedIn, STAR Allocation, Pitch, and Failure Guardrails pass 100%?",
          "expectedStringOutput": "CAREER_INTERVIEW_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "CAREER_INTERVIEW_ENGINE_AUDIT_PASSED",
            "grade\":\"CAREER_INTERVIEW_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_SK_TECH_RESUME_GOOGLE_XYZ_FORMULA",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SK_TECH_RESUME_GOOGLE_XYZ_FORMULA",
              "errorExplanation": "All checks passing awards CAREER_INTERVIEW_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards CAREER_INTERVIEW_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type CAREER_INTERVIEW_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "comm-d21-b3-milestone3-comm-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Tech Career Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Tech Career Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d21-b2-career-interview-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_comm_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete Google X-Y-Z Resume, STAR Method Behavioral Responses & Root-Cause Failure Storytelling Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete Google X-Y-Z Resume, STAR Method Behavioral Responses & Root-Cause Failure Storytelling Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete Google X-Y-Z Resume, STAR Method Behavioral Responses & Root-Cause Failure Storytelling Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete Google X-Y-Z Resume, STAR Method Behavioral Responses & Root-Cause Failure Storytelling Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_SK_TECH_RESUME_GOOGLE_XYZ_FORMULA",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SK_TECH_RESUME_GOOGLE_XYZ_FORMULA",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete Google X-Y-Z Resume, STAR Method Behavioral Responses & Root-Cause Failure Storytelling Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "High-Signal Reverse Interviewing: Questions to Ask the Interviewer",
    "overviewMetaphor": "Reverse Interviewing Is an Architect Inspecting the Foundation Before Buying the House: Asking 'What's the deployment health?' and 'How often are engineers paged on-call?' (`category: ON_CALL_CULTURE`) uncovers whether the team has automated CI guardrails or is burning out under chronic emergency alerts.",
    "blocks": [
      {
        "id": "comm-d22-b1-reverse-question-classifier",
        "day": 22,
        "blockNumber": 1,
        "title": "Reverse Interviewing: Classifying Questions into `'DEPLOYMENT_HEALTH'` vs `'ON_CALL_CULTURE'`",
        "conceptBudget": {
          "primaryConcept": "Reverse Interview Question Signal & Category Classifier",
          "supportingTerms": [
            "Question Text (`'How long does a deployment take?'`)",
            "Category (`'DEPLOYMENT_HEALTH'`)",
            "High Signal (`true`)",
            "Status: Question Classified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d21-b1-career-interview-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Reverse Interview Question Signal Ledger",
              "boxes": [
                {
                  "label": "Deployment Health",
                  "value": "'How long does a deployment take from merge to prod?' -> DEPLOYMENT_HEALTH",
                  "varType": "Deployment",
                  "isUpdated": false
                },
                {
                  "label": "On-Call Culture",
                  "value": "'How often are engineers paged on-call after hours?' -> ON_CALL_CULTURE",
                  "varType": "On-Call",
                  "isUpdated": false
                },
                {
                  "label": "Psychological Safety",
                  "value": "'How does team handle incident postmortems?' (CLASSIFIED NOMINAL!)",
                  "varType": "Safety",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "reverse_question_demo.js",
            "initialCode": "function classifyQuestion(q) {\n  const text = q.toLowerCase();\n  if (text.includes('deploy')) return { cat: 'DEPLOYMENT_HEALTH', isHigh: true, status: 'QUESTION_CLASSIFIED_NOMINAL' };\n  if (text.includes('on-call')) return { cat: 'ON_CALL_CULTURE', isHigh: true, status: 'QUESTION_CLASSIFIED_NOMINAL' };\n  return { cat: 'GENERIC', isHigh: false };\n}\n\nconsole.log(JSON.stringify(classifyQuestion('How long does a deployment take from merge to prod?')));\nconsole.log(JSON.stringify(classifyQuestion('How often are engineers paged on-call?')));",
            "expectedOutput": "{\"cat\":\"DEPLOYMENT_HEALTH\",\"isHigh\":true,\"status\":\"QUESTION_CLASSIFIED_NOMINAL\"}\n{\"cat\":\"ON_CALL_CULTURE\",\"isHigh\":true,\"status\":\"QUESTION_CLASSIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What category is assigned to the reverse question 'How long does a deployment take from merge to prod?'",
          "expectedStringOutput": "DEPLOYMENT_HEALTH",
          "acceptableAnswers": [
            "DEPLOYMENT_HEALTH",
            "cat\":\"DEPLOYMENT_HEALTH\"",
            "Deployment health"
          ],
          "primaryMisconceptionId": "MC_SK_REVERSE_INTERVIEWING_QUESTIONS_TO_ASK",
          "diagnosisMap": {
            "GENERIC": {
              "misconceptionId": "MC_SK_REVERSE_INTERVIEWING_QUESTIONS_TO_ASK",
              "errorExplanation": "Questions about deployment frequency belong to DEPLOYMENT_HEALTH.",
              "recoveryPath": {
                "simplerExplanation": "Category is DEPLOYMENT_HEALTH.",
                "guidedFixPrompt": "Type DEPLOYMENT_HEALTH"
              }
            }
          }
        }
      },
      {
        "id": "comm-d22-b2-high-signal-question-categories-total",
        "day": 3,
        "blockNumber": 2,
        "title": "The 3 High-Signal Reverse Question Categories",
        "conceptBudget": {
          "primaryConcept": "Question Categories Invariant",
          "supportingTerms": [
            "3 High-Signal Categories (1. Deployment Health & CI/CD Velocity, 2. On-Call Health & Alert Volume, 3. Team Psychological Safety & Postmortem Blamelessness)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d22-b1-reverse-question-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "3 Categories of Reverse Questions",
            "codeSnippet": "// 1. DEPLOYMENT HEALTH:      \"How many times a day do you deploy to production?\"\n// 2. ON-CALL HEALTH:          \"How often are on-call engineers woken up at 2 AM?\"\n// 3. PSYCHOLOGICAL SAFETY:    \"Can you walk me through your last blameless postmortem?\"",
            "lineNotes": {
              "1": "Deployment health inquiry.",
              "2": "On-call culture inquiry.",
              "3": "Psychological safety inquiry."
            }
          },
          {
            "type": "runnable_code",
            "filename": "reverse_cat_demo.js",
            "initialCode": "function getReverseCategoriesTotal() {\n  return 3;\n}\n\nconsole.log(getReverseCategoriesTotal());",
            "expectedOutput": "3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many primary high-signal categories of reverse questions should candidates prepare for technical interviewers?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "3 categories",
            "three"
          ],
          "primaryMisconceptionId": "MC_SK_REVERSE_INTERVIEWING_QUESTIONS_TO_ASK",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SK_REVERSE_INTERVIEWING_QUESTIONS_TO_ASK",
              "errorExplanation": "There are 3 categories: Deployment Health, On-Call Health, and Psychological Safety.",
              "recoveryPath": {
                "simplerExplanation": "Type 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "comm-d22-b3-uncovering-engineering-red-flags",
        "day": 22,
        "blockNumber": 3,
        "title": "Uncovering Hidden Red Flags: Manual Deployments & Hero-Driven On-Call",
        "conceptBudget": {
          "primaryConcept": "Engineering Red Flag Invariant",
          "supportingTerms": [
            "Red Flag Detection (`If an interviewer answers 'We deploy manually on weekends' or 'On-call is rough but our senior lead fixes everything', it signals severe technical debt`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d22-b2-high-signal-question-categories-total",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "red_flags_demo.js",
            "initialCode": "function getMajorEngineeringRedFlag() {\n  return 'MANUAL_WEEKEND_DEPLOYMENTS_AND_FREQUENT_OVERNIGHT_PAGES';\n}\n\nconsole.log(getMajorEngineeringRedFlag());",
            "expectedOutput": "MANUAL_WEEKEND_DEPLOYMENTS_AND_FREQUENT_OVERNIGHT_PAGES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What interviewer response constitutes a major technical culture red flag for prospective software engineers?",
          "expectedStringOutput": "MANUAL_WEEKEND_DEPLOYMENTS_AND_FREQUENT_OVERNIGHT_PAGES",
          "acceptableAnswers": [
            "MANUAL_WEEKEND_DEPLOYMENTS_AND_FREQUENT_OVERNIGHT_PAGES",
            "Manual deployments and overnight pages",
            "Manual weekend deployments"
          ],
          "primaryMisconceptionId": "MC_SK_REVERSE_INTERVIEWING_QUESTIONS_TO_ASK",
          "diagnosisMap": {
            "CI_CD": {
              "misconceptionId": "MC_SK_REVERSE_INTERVIEWING_QUESTIONS_TO_ASK",
              "errorExplanation": "Red flag is: MANUAL_WEEKEND_DEPLOYMENTS_AND_FREQUENT_OVERNIGHT_PAGES.",
              "recoveryPath": {
                "simplerExplanation": "Matches MANUAL_WEEKEND_DEPLOYMENTS_AND_FREQUENT_OVERNIGHT_PAGES.",
                "guidedFixPrompt": "Type MANUAL_WEEKEND_DEPLOYMENTS_AND_FREQUENT_OVERNIGHT_PAGES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Live Coding & Whiteboard Communication Protocols: \"Think Aloud\" Protocol",
    "overviewMetaphor": "Live Coding Is an Open-Cockpit Flight Demonstration: If the pilot flies in complete silence for 25 minutes, the examiner has no idea if they are following flight instruments or guessing; narrating your thought process out loud ('I am choosing a hash map here because we need $O(1)$ lookups, and I will check for empty array edge cases first') guarantees top technical grades even if a minor syntax typo occurs.",
    "blocks": [
      {
        "id": "comm-d23-b1-live-coding-protocol-evaluator",
        "day": 23,
        "blockNumber": 1,
        "title": "Live Coding: Clarified Edge Cases + Complexity Upfront + Think-Aloud",
        "conceptBudget": {
          "primaryConcept": "Live Coding Whiteboard Protocol Step Evaluator",
          "supportingTerms": [
            "Clarified Edge Cases (`true`)",
            "Stated Complexity Upfront (`true`)",
            "Narrated Thought Process (`true`)",
            "Status: Live Coding Protocol Passed Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d21-b1-career-interview-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Live Coding Whiteboard Protocol Ledger",
              "boxes": [
                {
                  "label": "Step 1: Clarify Constraints",
                  "value": "Asked about null inputs, duplicates, and integer bounds",
                  "varType": "Clarify",
                  "isUpdated": false
                },
                {
                  "label": "Step 2: Stated Complexity",
                  "value": "Stated target O(N) time and O(N) auxiliary space upfront",
                  "varType": "Complexity",
                  "isUpdated": false
                },
                {
                  "label": "Step 3: Think-Aloud Coding",
                  "value": "Narrated thought process continuously (PROTOCOL PASSED NOMINAL!)",
                  "varType": "Narrate",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "live_coding_demo.js",
            "initialCode": "function evalLiveCoding(clar, comp, narr) {\n  const ok = clar && comp && narr;\n  return {\n    isPassed: ok,\n    status: ok ? 'LIVE_CODING_PROTOCOL_PASSED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(evalLiveCoding(true, true, true)));",
            "expectedOutput": "{\"isPassed\":true,\"status\":\"LIVE_CODING_PROTOCOL_PASSED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a candidate followed all live coding and whiteboard communication protocols?",
          "expectedStringOutput": "LIVE_CODING_PROTOCOL_PASSED_NOMINAL",
          "acceptableAnswers": [
            "LIVE_CODING_PROTOCOL_PASSED_NOMINAL",
            "status\":\"LIVE_CODING_PROTOCOL_PASSED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_LIVE_CODING_THINK_ALOUD_PROTOCOL",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SK_LIVE_CODING_THINK_ALOUD_PROTOCOL",
              "errorExplanation": "Matches LIVE_CODING_PROTOCOL_PASSED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type LIVE_CODING_PROTOCOL_PASSED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d23-b2-think-aloud-protocol-name",
        "day": 23,
        "blockNumber": 2,
        "title": "The Think-Aloud Protocol Name",
        "conceptBudget": {
          "primaryConcept": "Think-Aloud Protocol Invariant",
          "supportingTerms": [
            "`THINK_ALOUD_PROTOCOL` (The standardized communication methodology of verbalizing assumptions, algorithmic tradeoffs, and edge cases while typing code)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d23-b1-live-coding-protocol-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Live Coding Flow",
            "codeSnippet": "// 1. REPEAT & CLARIFY: \"So we are given an unsorted array of integers, and need to return two sum indices?\"\n// 2. STATE INTENT:     \"I will start with a brute force O(N^2) concept, then optimize to O(N) using a Hash Map\"\n// 3. NARRATE CODE:      \"Here I am checking if map.has(target - val)...\"\n// 4. TEST WITH TRACE:  \"Let's trace this with array [2, 7, 11] and target 9...\"",
            "lineNotes": {
              "1": "Step 1: Clarification.",
              "2": "Step 2: Solution roadmap.",
              "3": "Step 3: Continuous narration.",
              "4": "Step 4: Manual trace test."
            }
          },
          {
            "type": "runnable_code",
            "filename": "think_aloud_demo.js",
            "initialCode": "function getThinkAloudRule() {\n  return 'THINK_ALOUD_PROTOCOL';\n}\n\nconsole.log(getThinkAloudRule());",
            "expectedOutput": "THINK_ALOUD_PROTOCOL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the industry term for the protocol where engineers narrate their thought process in real-time while coding?",
          "expectedStringOutput": "THINK_ALOUD_PROTOCOL",
          "acceptableAnswers": [
            "THINK_ALOUD_PROTOCOL",
            "Think Aloud Protocol",
            "Think aloud protocol"
          ],
          "primaryMisconceptionId": "MC_SK_LIVE_CODING_THINK_ALOUD_PROTOCOL",
          "diagnosisMap": {
            "SILENT_CODING": {
              "misconceptionId": "MC_SK_LIVE_CODING_THINK_ALOUD_PROTOCOL",
              "errorExplanation": "The protocol name is THINK_ALOUD_PROTOCOL.",
              "recoveryPath": {
                "simplerExplanation": "Type THINK_ALOUD_PROTOCOL.",
                "guidedFixPrompt": "Type THINK_ALOUD_PROTOCOL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d23-b3-receiving-interviewer-hints-with-gratitude",
        "day": 23,
        "blockNumber": 3,
        "title": "Coachability: Receiving Interviewer Hints with Gratitude & Agility",
        "conceptBudget": {
          "primaryConcept": "Coachability Invariant",
          "supportingTerms": [
            "Coachability (`When an interviewer offers a hint like 'What if the input contains duplicates?', responding with enthusiastic gratitude ('Great point, let's adjust our hash set to track frequencies') signals strong team collaboration`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d23-b2-think-aloud-protocol-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "coachability_demo.js",
            "initialCode": "function getHintResponseStandard() {\n  return 'RECEIVE_HINTS_WITH_ENTHUSIASTIC_GRATITUDE_AND_ADAPT_IMMEDIATELY';\n}\n\nconsole.log(getHintResponseStandard());",
            "expectedOutput": "RECEIVE_HINTS_WITH_ENTHUSIASTIC_GRATITUDE_AND_ADAPT_IMMEDIATELY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How should software engineering candidates respond when an interviewer provides an algorithmic hint?",
          "expectedStringOutput": "RECEIVE_HINTS_WITH_ENTHUSIASTIC_GRATITUDE_AND_ADAPT_IMMEDIATELY",
          "acceptableAnswers": [
            "RECEIVE_HINTS_WITH_ENTHUSIASTIC_GRATITUDE_AND_ADAPT_IMMEDIATELY",
            "Receive hints with gratitude",
            "Enthusiastic gratitude and adapt"
          ],
          "primaryMisconceptionId": "MC_SK_LIVE_CODING_THINK_ALOUD_PROTOCOL",
          "diagnosisMap": {
            "ARGUE_BACK": {
              "misconceptionId": "MC_SK_LIVE_CODING_THINK_ALOUD_PROTOCOL",
              "errorExplanation": "Arguing shows defensiveness. Standard is: RECEIVE_HINTS_WITH_ENTHUSIASTIC_GRATITUDE_AND_ADAPT_IMMEDIATELY.",
              "recoveryPath": {
                "simplerExplanation": "Matches RECEIVE_HINTS_WITH_ENTHUSIASTIC_GRATITUDE_AND_ADAPT_IMMEDIATELY.",
                "guidedFixPrompt": "Type RECEIVE_HINTS_WITH_ENTHUSIASTIC_GRATITUDE_AND_ADAPT_IMMEDIATELY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "System Design Interview Communication: The RADIO Framework",
    "overviewMetaphor": "The RADIO Framework Is an Architectural Blueprint for a Skyscraper: You do not start by pouring cement for floor 42; you begin with Requirements (R), sketch the Structural Frame Architecture (A), map the Plumbing & Electrical Data Model (D), specify the Elevator Interfaces (I), and optimize Wind & Earthquake Dampeners (O).",
    "blocks": [
      {
        "id": "comm-d24-b1-radio-system-design-auditor",
        "day": 24,
        "blockNumber": 1,
        "title": "RADIO System Design: Auditing All 5 Structural Phases",
        "conceptBudget": {
          "primaryConcept": "System Design RADIO Framework Completeness Auditor",
          "supportingTerms": [
            "Requirements Phase",
            "Architecture Phase",
            "Data Model Phase",
            "Interfaces Phase",
            "Optimizations Phase",
            "Status: System Design RADIO Compliant Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d23-b1-live-coding-protocol-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "RADIO System Design Architecture Ledger",
              "boxes": [
                {
                  "label": "R - Requirements",
                  "value": "Functional & non-functional scoping (10M DAU, 5k QPS)",
                  "varType": "Requirements",
                  "isUpdated": false
                },
                {
                  "label": "A - Architecture",
                  "value": "High-level components (LB, API Gateways, Microservices)",
                  "varType": "Architecture",
                  "isUpdated": false
                },
                {
                  "label": "D - Data Model",
                  "value": "Relational vs NoSQL schemas, partition keys, B-trees",
                  "varType": "Data Model",
                  "isUpdated": false
                },
                {
                  "label": "I - Interfaces",
                  "value": "REST / gRPC endpoint contracts and payloads",
                  "varType": "Interfaces",
                  "isUpdated": false
                },
                {
                  "label": "O - Optimizations",
                  "value": "Caching, CDN, sharding, replication (RADIO COMPLIANT NOMINAL!)",
                  "varType": "Optimizations",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "radio_demo.js",
            "initialCode": "function auditRadio(sections) {\n  const req = ['Requirements', 'Architecture', 'DataModel', 'Interfaces', 'Optimizations'];\n  const missing = req.filter(p => !sections.includes(p));\n  const ok = missing.length === 0;\n  return {\n    missing,\n    isComplete: ok,\n    status: ok ? 'SYSTEM_DESIGN_RADIO_COMPLIANT_NOMINAL' : 'INCOMPLETE'\n  };\n}\n\nconst secs = ['Requirements', 'Architecture', 'DataModel', 'Interfaces', 'Optimizations'];\nconsole.log(JSON.stringify(auditRadio(secs)));",
            "expectedOutput": "{\"missing\":[],\"isComplete\":true,\"status\":\"SYSTEM_DESIGN_RADIO_COMPLIANT_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a system design interview covered all 5 phases of the RADIO framework?",
          "expectedStringOutput": "SYSTEM_DESIGN_RADIO_COMPLIANT_NOMINAL",
          "acceptableAnswers": [
            "SYSTEM_DESIGN_RADIO_COMPLIANT_NOMINAL",
            "status\":\"SYSTEM_DESIGN_RADIO_COMPLIANT_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_SYSTEM_DESIGN_RADIO_FRAMEWORK",
          "diagnosisMap": {
            "INCOMPLETE": {
              "misconceptionId": "MC_SK_SYSTEM_DESIGN_RADIO_FRAMEWORK",
              "errorExplanation": "All 5 phases verified: SYSTEM_DESIGN_RADIO_COMPLIANT_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches SYSTEM_DESIGN_RADIO_COMPLIANT_NOMINAL.",
                "guidedFixPrompt": "Type SYSTEM_DESIGN_RADIO_COMPLIANT_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d24-b2-radio-acronym-name",
        "day": 24,
        "blockNumber": 2,
        "title": "The RADIO System Design Acronym",
        "conceptBudget": {
          "primaryConcept": "RADIO Acronym Invariant",
          "supportingTerms": [
            "`RADIO` (Requirements, Architecture, Data Model, Interfaces, Optimizations: The standard system design interview framework)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d24-b1-radio-system-design-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "RADIO Framework Breakdown",
            "codeSnippet": "// R: Requirements   -> Scope functional features & non-functional SLA targets (DAU, latency)\n// A: Architecture   -> Draw high-level boxes (Client -> CDN -> LB -> App Servers -> DB)\n// D: Data Model     -> Define database tables, primary keys, and storage volumes\n// I: Interfaces     -> Specify exact API schemas (POST /api/v1/tweet)\n// O: Optimizations  -> Address single points of failure, bottleneck queues, and replication",
            "lineNotes": {
              "1": "R: Requirements.",
              "2": "A: High-level design.",
              "3": "D: Schema.",
              "4": "I: API contract.",
              "5": "O: Scale and resilience."
            }
          },
          {
            "type": "runnable_code",
            "filename": "radio_name_demo.js",
            "initialCode": "function getRadioName() {\n  return 'RADIO';\n}\n\nconsole.log(getRadioName());",
            "expectedOutput": "RADIO",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 5-letter acronym names the standardized system design communication framework?",
          "expectedStringOutput": "RADIO",
          "acceptableAnswers": [
            "RADIO",
            "radio",
            "'RADIO'"
          ],
          "primaryMisconceptionId": "MC_SK_SYSTEM_DESIGN_RADIO_FRAMEWORK",
          "diagnosisMap": {
            "RADAR": {
              "misconceptionId": "MC_SK_SYSTEM_DESIGN_RADIO_FRAMEWORK",
              "errorExplanation": "Framework is RADIO.",
              "recoveryPath": {
                "simplerExplanation": "Type RADIO.",
                "guidedFixPrompt": "Type RADIO"
              }
            }
          }
        }
      },
      {
        "id": "comm-d24-b3-scoping-non-functional-metrics",
        "day": 24,
        "blockNumber": 3,
        "title": "Calculations on the Board: Quantifying QPS, Storage & Bandwidth",
        "conceptBudget": {
          "primaryConcept": "Non-Functional Scoping Invariant",
          "supportingTerms": [
            "Back-of-the-Envelope Math (`Calculating read vs write QPS (e.g. 5,000 QPS) and daily storage growth (500 GB/day) on the whiteboard before choosing database technologies`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d24-b2-radio-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "back_of_envelope_demo.js",
            "initialCode": "function getScopingRule() {\n  return 'CALCULATE_QPS_AND_STORAGE_SCALE_UPFRONT_BEFORE_DRAWING_COMPONENTS';\n}\n\nconsole.log(getScopingRule());",
            "expectedOutput": "CALCULATE_QPS_AND_STORAGE_SCALE_UPFRONT_BEFORE_DRAWING_COMPONENTS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What numerical estimation step must precede architecture drawing in a system design interview?",
          "expectedStringOutput": "CALCULATE_QPS_AND_STORAGE_SCALE_UPFRONT_BEFORE_DRAWING_COMPONENTS",
          "acceptableAnswers": [
            "CALCULATE_QPS_AND_STORAGE_SCALE_UPFRONT_BEFORE_DRAWING_COMPONENTS",
            "Calculate QPS and storage",
            "Back of envelope calculations"
          ],
          "primaryMisconceptionId": "MC_SK_SYSTEM_DESIGN_RADIO_FRAMEWORK",
          "diagnosisMap": {
            "DRAW_FIRST": {
              "misconceptionId": "MC_SK_SYSTEM_DESIGN_RADIO_FRAMEWORK",
              "errorExplanation": "Rule is: CALCULATE_QPS_AND_STORAGE_SCALE_UPFRONT_BEFORE_DRAWING_COMPONENTS.",
              "recoveryPath": {
                "simplerExplanation": "Matches CALCULATE_QPS_AND_STORAGE_SCALE_UPFRONT_BEFORE_DRAWING_COMPONENTS.",
                "guidedFixPrompt": "Type CALCULATE_QPS_AND_STORAGE_SCALE_UPFRONT_BEFORE_DRAWING_COMPONENTS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Salary Negotiation & Compensation Mastery: Total Compensation (TC) Mechanics",
    "overviewMetaphor": "Total Compensation Is a 3-Course Gourmet Meal, Not Just a Breadbasket: Junior engineers fixate exclusively on the breadbasket (Base Salary); senior engineers negotiate the entire feast: Base ($$150$k) + Annual Bonus ($$15$k, $10\\%$) + Equity ($$50$k/yr over 4 years) + First-Year Sign-on ($$20$k), unlocking a First-Year Total Compensation of $$235,000$ (`firstYearTotalCompensation: 235000`).",
    "blocks": [
      {
        "id": "comm-d25-b1-total-compensation-calculator",
        "day": 25,
        "blockNumber": 1,
        "title": "Total Compensation (TC): Calculating $$235,000$ First-Year Package",
        "conceptBudget": {
          "primaryConcept": "Total Compensation (TC) Annual Package Calculator",
          "supportingTerms": [
            "Base Salary ($$150,000$)",
            "Annual Bonus ($$15,000$)",
            "Annualized Equity ($$50,000$)",
            "Sign-on Bonus ($$20,000$)",
            "First Year TC ($$235,000$)",
            "Status: Total Compensation Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d24-b1-radio-system-design-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Total Compensation (TC) Architecture Ledger",
              "boxes": [
                {
                  "label": "1. Base Salary",
                  "value": "$150,000 guaranteed cash",
                  "varType": "Base",
                  "isUpdated": false
                },
                {
                  "label": "2. Annual Bonus (10%)",
                  "value": "$15,000 performance incentive",
                  "varType": "Bonus",
                  "isUpdated": false
                },
                {
                  "label": "3. Annualized Equity",
                  "value": "$200,000 / 4 yrs = $50,000/yr RSU grant",
                  "varType": "Equity",
                  "isUpdated": false
                },
                {
                  "label": "4. Sign-on Bonus",
                  "value": "$20,000 -> Total First Year TC: $235,000 (CALCULATED NOMINAL!)",
                  "varType": "Sign-on/TC",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "tc_calc_demo.js",
            "initialCode": "function calcTc(base, bonusPct, equity4Yr, signOn) {\n  const bonus = base * (bonusPct / 100);\n  const eq = equity4Yr / 4;\n  const rec = base + bonus + eq;\n  const firstYr = rec + (signOn || 0);\n  return {\n    recurringAnnualTc: rec,\n    firstYearTotalCompensation: firstYr,\n    status: 'TOTAL_COMPENSATION_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcTc(150000, 10, 200000, 20000)));",
            "expectedOutput": "{\"recurringAnnualTc\":215000,\"firstYearTotalCompensation\":235000,\"status\":\"TOTAL_COMPENSATION_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the first-year total compensation for an offer with $150k base, 10% bonus, $200k 4-year equity, and $20k sign-on?",
          "expectedStringOutput": "235000",
          "acceptableAnswers": [
            "235000",
            "235,000",
            "$235,000",
            "firstYearTotalCompensation\":235000"
          ],
          "primaryMisconceptionId": "MC_SK_SALARY_NEGOTIATION_TOTAL_COMPENSATION",
          "diagnosisMap": {
            "150000": {
              "misconceptionId": "MC_SK_SALARY_NEGOTIATION_TOTAL_COMPENSATION",
              "errorExplanation": "150k is base only. First year TC is 150k + 15k + 50k + 20k = 235,000.",
              "recoveryPath": {
                "simplerExplanation": "TC is 235000.",
                "guidedFixPrompt": "Type 235000"
              }
            }
          }
        }
      },
      {
        "id": "comm-d25-b2-standard-equity-vesting-period-years",
        "day": 25,
        "blockNumber": 2,
        "title": "Standard 4-Year Equity Vesting Schedule with 1-Year Cliff",
        "conceptBudget": {
          "primaryConcept": "Equity Vesting Invariant",
          "supportingTerms": [
            "4-Year Vesting Schedule (`The tech industry standard where stock options or RSUs vest incrementally over 4 years, typically with a 1-year cliff before initial vesting`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d25-b1-total-compensation-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Standard Vesting Schedule",
            "codeSnippet": "// Grant: $200,000 total RSUs over 4 years\n// Year 1 (Cliff): 25% vests ($50,000)\n// Years 2-4:      Vests quarterly (6.25% per quarter = $12,500/quarter)",
            "lineNotes": {
              "1": "Total grant value.",
              "2": "1-Year cliff milestone.",
              "3": "Quarterly distribution."
            }
          },
          {
            "type": "runnable_code",
            "filename": "vesting_years_demo.js",
            "initialCode": "function getVestingYears() {\n  return 4;\n}\n\nconsole.log(getVestingYears());",
            "expectedOutput": "4",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many years is the standard tech equity grant vesting duration?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "4 years",
            "four"
          ],
          "primaryMisconceptionId": "MC_SK_SALARY_NEGOTIATION_TOTAL_COMPENSATION",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_SK_SALARY_NEGOTIATION_TOTAL_COMPENSATION",
              "errorExplanation": "1 year is the cliff. The standard vesting cycle is 4 years.",
              "recoveryPath": {
                "simplerExplanation": "Type 4.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "comm-d25-b3-deflecting-early-salary-questions",
        "day": 25,
        "blockNumber": 3,
        "title": "Negotiation Tactics: Deflecting Early Salary Questions with Market Fit",
        "conceptBudget": {
          "primaryConcept": "Salary Deflection Invariant",
          "supportingTerms": [
            "Salary Deflection (`When asked for salary expectations on initial recruiter calls, stating 'I am focused on finding the right role match; I trust your offer will be competitive with market rates' prevents premature anchoring`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d25-b2-standard-equity-vesting-period-years",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "salary_deflection_demo.js",
            "initialCode": "function getDeflectionPhrase() {\n  return 'DEFLECT_EARLY_SALARY_ANCHORS_UNTIL_MUTUAL_OFFER_ALIGNMENT';\n}\n\nconsole.log(getDeflectionPhrase());",
            "expectedOutput": "DEFLECT_EARLY_SALARY_ANCHORS_UNTIL_MUTUAL_OFFER_ALIGNMENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What negotiation strategy protects candidate leverage during early recruiter screening calls?",
          "expectedStringOutput": "DEFLECT_EARLY_SALARY_ANCHORS_UNTIL_MUTUAL_OFFER_ALIGNMENT",
          "acceptableAnswers": [
            "DEFLECT_EARLY_SALARY_ANCHORS_UNTIL_MUTUAL_OFFER_ALIGNMENT",
            "Deflect early salary anchors",
            "Deflect early salary questions"
          ],
          "primaryMisconceptionId": "MC_SK_SALARY_NEGOTIATION_TOTAL_COMPENSATION",
          "diagnosisMap": {
            "GIVE_LOW_NUMBER": {
              "misconceptionId": "MC_SK_SALARY_NEGOTIATION_TOTAL_COMPENSATION",
              "errorExplanation": "Naming a number early limits your top range: DEFLECT_EARLY_SALARY_ANCHORS_UNTIL_MUTUAL_OFFER_ALIGNMENT.",
              "recoveryPath": {
                "simplerExplanation": "Matches DEFLECT_EARLY_SALARY_ANCHORS_UNTIL_MUTUAL_OFFER_ALIGNMENT.",
                "guidedFixPrompt": "Type DEFLECT_EARLY_SALARY_ANCHORS_UNTIL_MUTUAL_OFFER_ALIGNMENT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "First 90 Days Engineering Onboarding Strategy: The 30-60-90 Day Plan",
    "overviewMetaphor": "The 30-60-90 Day Plan Is an Airplane Taking Off: Days 1-30 are the taxiway (Learn architecture, set up IDE, and ship 1 small bugfix); Days 31-60 are the takeoff climb (Own a full feature independently); and Days 61-90 are cruising altitude (Lead architectural improvements and mentor newcomers).",
    "blocks": [
      {
        "id": "comm-d26-b1-onboarding-milestone-tracker",
        "day": 26,
        "blockNumber": 1,
        "title": "30-60-90 Day Onboarding: Tracking `'LEARN_AND_SHIP_BUGFIX'` on Day 30",
        "conceptBudget": {
          "primaryConcept": "30-60-90 Day Onboarding Milestone Tracker",
          "supportingTerms": [
            "Day Number ($30$)",
            "Phase (`'DAYS_1_TO_30'`)",
            "Milestone (`'LEARN_AND_SHIP_BUGFIX'`)",
            "Status: Onboarding Day 30 Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d25-b1-total-compensation-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "30-60-90 Day Onboarding Roadmap Ledger",
              "boxes": [
                {
                  "label": "Days 1 - 30",
                  "value": "Learn architecture, set up dev environment, and ship 1 small bugfix",
                  "varType": "Day 30",
                  "isUpdated": false
                },
                {
                  "label": "Days 31 - 60",
                  "value": "Own a feature independently & participate actively in code reviews",
                  "varType": "Day 60",
                  "isUpdated": false
                },
                {
                  "label": "Days 61 - 90",
                  "value": "Lead architectural improvements & mentor others (TRACKED NOMINAL!)",
                  "varType": "Day 90",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "onboarding_demo.js",
            "initialCode": "function trackOnboarding(day) {\n  if (day <= 30) return { milestone: 'LEARN_AND_SHIP_BUGFIX', status: 'ONBOARDING_DAY_30_NOMINAL' };\n  if (day <= 60) return { milestone: 'OWN_FEATURE_INDEPENDENTLY', status: 'ONBOARDING_DAY_60_NOMINAL' };\n  return { milestone: 'LEAD_AND_IMPROVE_ARCHITECTURE', status: 'ONBOARDING_DAY_90_NOMINAL' };\n}\n\nconsole.log(JSON.stringify(trackOnboarding(30)));",
            "expectedOutput": "{\"milestone\":\"LEARN_AND_SHIP_BUGFIX\",\"status\":\"ONBOARDING_DAY_30_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the primary milestone goal for an engineer during their first 30 days on a new team?",
          "expectedStringOutput": "LEARN_AND_SHIP_BUGFIX",
          "acceptableAnswers": [
            "LEARN_AND_SHIP_BUGFIX",
            "milestone\":\"LEARN_AND_SHIP_BUGFIX\"",
            "Learn and ship bugfix"
          ],
          "primaryMisconceptionId": "MC_SK_FIRST_90_DAYS_ONBOARDING_PLAN",
          "diagnosisMap": {
            "REWRITE_ARCHITECTURE": {
              "misconceptionId": "MC_SK_FIRST_90_DAYS_ONBOARDING_PLAN",
              "errorExplanation": "Rewriting architecture on day 30 alienates teammates. The goal is: LEARN_AND_SHIP_BUGFIX.",
              "recoveryPath": {
                "simplerExplanation": "Matches LEARN_AND_SHIP_BUGFIX.",
                "guidedFixPrompt": "Type LEARN_AND_SHIP_BUGFIX"
              }
            }
          }
        }
      },
      {
        "id": "comm-d26-b2-day30-primary-onboarding-goal",
        "day": 26,
        "blockNumber": 2,
        "title": "Day 30 Signature: Shipping Small Early Wins",
        "conceptBudget": {
          "primaryConcept": "Day 30 Win Invariant",
          "supportingTerms": [
            "Small Early Wins (`Shipping a small bugfix or documentation update within the first 2 weeks validates your local dev environment, build pipeline, and deployment permissions`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d26-b1-onboarding-milestone-tracker",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "30-60-90 Velocity Curve",
            "codeSnippet": "// DAY 30:  Absorb context, master deployment tools, and merge 1 small bugfix\n// DAY 60:  Deliver a complete sprint feature with unit tests and zero hand-holding\n// DAY 90:  Author a technical RFC and contribute to cross-team architecture discussions",
            "lineNotes": {
              "1": "Day 30 baseline.",
              "2": "Day 60 independence.",
              "3": "Day 90 leadership."
            }
          },
          {
            "type": "runnable_code",
            "filename": "day30_goal_demo.js",
            "initialCode": "function getDay30Goal() {\n  return 'LEARN_AND_SHIP_BUGFIX';\n}\n\nconsole.log(getDay30Goal());",
            "expectedOutput": "LEARN_AND_SHIP_BUGFIX",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What standardized goal token represents the Day 30 onboarding achievement milestone?",
          "expectedStringOutput": "LEARN_AND_SHIP_BUGFIX",
          "acceptableAnswers": [
            "LEARN_AND_SHIP_BUGFIX",
            "learn and ship bugfix",
            "'LEARN_AND_SHIP_BUGFIX'"
          ],
          "primaryMisconceptionId": "MC_SK_FIRST_90_DAYS_ONBOARDING_PLAN",
          "diagnosisMap": {
            "LEAD_TEAM": {
              "misconceptionId": "MC_SK_FIRST_90_DAYS_ONBOARDING_PLAN",
              "errorExplanation": "Token is LEARN_AND_SHIP_BUGFIX.",
              "recoveryPath": {
                "simplerExplanation": "Type LEARN_AND_SHIP_BUGFIX.",
                "guidedFixPrompt": "Type LEARN_AND_SHIP_BUGFIX"
              }
            }
          }
        }
      },
      {
        "id": "comm-d26-b3-building-relational-social-capital",
        "day": 26,
        "blockNumber": 3,
        "title": "Relational Capital: Scheduling 1-on-1 Coffee Chats with Key Stakeholders",
        "conceptBudget": {
          "primaryConcept": "Relational Capital Invariant",
          "supportingTerms": [
            "1-on-1 Stakeholder Chats (`Booking 20-minute introductory coffee chats with product managers, QA leads, and adjacent engineering peers during week 1 builds long-term collaboration trust`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d26-b2-day30-primary-onboarding-goal",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "social_capital_demo.js",
            "initialCode": "function getSocialCapitalStrategy() {\n  return 'SCHEDULE_INTRODUCTORY_1_ON_1S_WITH_CROSS_FUNCTIONAL_PEERS_IN_WEEK_1';\n}\n\nconsole.log(getSocialCapitalStrategy());",
            "expectedOutput": "SCHEDULE_INTRODUCTORY_1_ON_1S_WITH_CROSS_FUNCTIONAL_PEERS_IN_WEEK_1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What proactive relationship habit builds social capital during an engineer's first week on a new team?",
          "expectedStringOutput": "SCHEDULE_INTRODUCTORY_1_ON_1S_WITH_CROSS_FUNCTIONAL_PEERS_IN_WEEK_1",
          "acceptableAnswers": [
            "SCHEDULE_INTRODUCTORY_1_ON_1S_WITH_CROSS_FUNCTIONAL_PEERS_IN_WEEK_1",
            "Introductory 1-on-1s in week 1",
            "Schedule 1-on-1s"
          ],
          "primaryMisconceptionId": "MC_SK_FIRST_90_DAYS_ONBOARDING_PLAN",
          "diagnosisMap": {
            "STAY_SILENT": {
              "misconceptionId": "MC_SK_FIRST_90_DAYS_ONBOARDING_PLAN",
              "errorExplanation": "Proactive connection builds trust: SCHEDULE_INTRODUCTORY_1_ON_1S_WITH_CROSS_FUNCTIONAL_PEERS_IN_WEEK_1.",
              "recoveryPath": {
                "simplerExplanation": "Matches SCHEDULE_INTRODUCTORY_1_ON_1S_WITH_CROSS_FUNCTIONAL_PEERS_IN_WEEK_1.",
                "guidedFixPrompt": "Type SCHEDULE_INTRODUCTORY_1_ON_1S_WITH_CROSS_FUNCTIONAL_PEERS_IN_WEEK_1"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Mentorship, Peer Coaching & Knowledge Sharing: Writing Team RFCs",
    "overviewMetaphor": "An Engineering RFC (Request for Comments) Is a Written Constitution for Architectural Proposals: Instead of pitching a controversial change verbally in a noisy meeting where the loudest voice wins, an RFC lays out Summary, Motivation, Proposed Design, and Alternatives in writing (`RFC_PROPOSAL_STRUCTURE_VERIFIED_NOMINAL`), giving everyone time to review asynchronously.",
    "blocks": [
      {
        "id": "comm-d27-b1-rfc-structure-auditor",
        "day": 27,
        "blockNumber": 1,
        "title": "Technical RFC: Auditing `# Summary`, `# Motivation`, `# Proposed Design`, `# Alternatives`",
        "conceptBudget": {
          "primaryConcept": "RFC (Request for Comments) Proposal Structure Auditor",
          "supportingTerms": [
            "Summary Section",
            "Motivation Section",
            "Proposed Design Section",
            "Alternatives Section",
            "Status: RFC Proposal Structure Verified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d26-b1-onboarding-milestone-tracker",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Technical RFC Proposal Architecture Ledger",
              "boxes": [
                {
                  "label": "# Summary",
                  "value": "Executive 1-paragraph overview of proposed change",
                  "varType": "Summary",
                  "isUpdated": false
                },
                {
                  "label": "# Motivation",
                  "value": "Why current architecture fails under scale / pain points",
                  "varType": "Motivation",
                  "isUpdated": false
                },
                {
                  "label": "# Proposed Design",
                  "value": "API contracts, database schemas, and migration steps",
                  "varType": "Design",
                  "isUpdated": false
                },
                {
                  "label": "# Alternatives",
                  "value": "Discarded options and explicit tradeoffs (VERIFIED NOMINAL!)",
                  "varType": "Alternatives",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rfc_demo.js",
            "initialCode": "function auditRfc(doc) {\n  const ok = doc.includes('# Summary') && doc.includes('# Motivation') && doc.includes('# Proposed Design') && doc.includes('# Alternatives');\n  return {\n    isCompliant: ok,\n    status: ok ? 'RFC_PROPOSAL_STRUCTURE_VERIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconst text = '# Summary\\nDetails\\n# Motivation\\nWhy\\n# Proposed Design\\nHow\\n# Alternatives\\nOther options';\nconsole.log(JSON.stringify(auditRfc(text)));",
            "expectedOutput": "{\"isCompliant\":true,\"status\":\"RFC_PROPOSAL_STRUCTURE_VERIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a technical design document adheres to the standard RFC structure?",
          "expectedStringOutput": "RFC_PROPOSAL_STRUCTURE_VERIFIED_NOMINAL",
          "acceptableAnswers": [
            "RFC_PROPOSAL_STRUCTURE_VERIFIED_NOMINAL",
            "status\":\"RFC_PROPOSAL_STRUCTURE_VERIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_MENTORSHIP_PEER_COACHING_RFCS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SK_MENTORSHIP_PEER_COACHING_RFCS",
              "errorExplanation": "Contains all 4 headers: RFC_PROPOSAL_STRUCTURE_VERIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type RFC_PROPOSAL_STRUCTURE_VERIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d27-b2-rfc-acronym-expanded",
        "day": 27,
        "blockNumber": 2,
        "title": "The RFC Acronym: Request for Comments",
        "conceptBudget": {
          "primaryConcept": "RFC Acronym Invariant",
          "supportingTerms": [
            "RFC (`Request for Comments`: Originating from early IETF internet standards, now universally used in modern tech companies to propose architectural changes asynchronously)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d27-b1-rfc-structure-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "RFC Lifecycle",
            "codeSnippet": "// 1. DRAFT:        Author writes RFC doc with Motivation & Design\n// 2. COMMENT:      Team adds inline async feedback & questions (7 days)\n// 3. RESOLUTION:   Final consensus reached: ACCEPTED, REJECTED, or SUPERSEDED",
            "lineNotes": {
              "1": "Drafting phase.",
              "2": "Review period.",
              "3": "Final verdict."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rfc_acronym_demo.js",
            "initialCode": "function getRfcMeaning() {\n  return 'Request for Comments';\n}\n\nconsole.log(getRfcMeaning());",
            "expectedOutput": "Request for Comments",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What does the architectural documentation acronym 'RFC' stand for?",
          "expectedStringOutput": "Request for Comments",
          "acceptableAnswers": [
            "Request for Comments",
            "request for comments",
            "'Request for Comments'"
          ],
          "primaryMisconceptionId": "MC_SK_MENTORSHIP_PEER_COACHING_RFCS",
          "diagnosisMap": {
            "Remote File Control": {
              "misconceptionId": "MC_SK_MENTORSHIP_PEER_COACHING_RFCS",
              "errorExplanation": "In engineering design, RFC stands for Request for Comments.",
              "recoveryPath": {
                "simplerExplanation": "Type Request for Comments.",
                "guidedFixPrompt": "Type Request for Comments"
              }
            }
          }
        }
      },
      {
        "id": "comm-d27-b3-watch-one-do-one-teach-one",
        "day": 27,
        "blockNumber": 3,
        "title": "Junior Mentorship: The \"Watch One, Do One, Teach One\" Medical Model",
        "conceptBudget": {
          "primaryConcept": "Peer Coaching Invariant",
          "supportingTerms": [
            "Watch One Do One Teach One (`1. Junior watches senior deploy a service; 2. Junior deploys service while senior shadows; 3. Junior teaches another peer how to deploy service`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d27-b2-rfc-acronym-expanded",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "coaching_model_demo.js",
            "initialCode": "function getMentorshipModel() {\n  return 'WATCH_ONE_DO_ONE_TEACH_ONE';\n}\n\nconsole.log(getMentorshipModel());",
            "expectedOutput": "WATCH_ONE_DO_ONE_TEACH_ONE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What 3-stage peer coaching model builds deep operational independence in junior engineers?",
          "expectedStringOutput": "WATCH_ONE_DO_ONE_TEACH_ONE",
          "acceptableAnswers": [
            "WATCH_ONE_DO_ONE_TEACH_ONE",
            "Watch One Do One Teach One",
            "Watch one do one teach one"
          ],
          "primaryMisconceptionId": "MC_SK_MENTORSHIP_PEER_COACHING_RFCS",
          "diagnosisMap": {
            "DO_IT_FOR_THEM": {
              "misconceptionId": "MC_SK_MENTORSHIP_PEER_COACHING_RFCS",
              "errorExplanation": "Doing work for them creates dependency. The model is: WATCH_ONE_DO_ONE_TEACH_ONE.",
              "recoveryPath": {
                "simplerExplanation": "Matches WATCH_ONE_DO_ONE_TEACH_ONE.",
                "guidedFixPrompt": "Type WATCH_ONE_DO_ONE_TEACH_ONE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Global Remote & Multi-Cultural Team Dynamics: Low-Context vs High-Context",
    "overviewMetaphor": "Cross-Cultural Communication Is a Radio Protocol Frequency: Low-Context cultures (US, Germany, Netherlands) transmit on explicit literal frequencies (Everything must be written down directly); High-Context cultures (Japan, India, Brazil) transmit on nuanced relational frequencies where shared context and diplomatic phrasing govern interactions.",
    "blocks": [
      {
        "id": "comm-d28-b1-cultural-style-matcher",
        "day": 28,
        "blockNumber": 1,
        "title": "Cross-Cultural Communication: Matching `'LOW_CONTEXT'` $\\implies$ Explicit Written Docs",
        "conceptBudget": {
          "primaryConcept": "Communication Context Style Matcher: High-Context vs Low-Context",
          "supportingTerms": [
            "Low-Context Culture Type",
            "Explicit Written Documentation Style",
            "Direct Feedback Style",
            "Status: Low Context Matched"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d27-b1-rfc-structure-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Cross-Cultural Communication Style Ledger",
              "boxes": [
                {
                  "label": "LOW_CONTEXT (US/Germany)",
                  "value": "Explicit literal written documentation | Direct upfront feedback",
                  "varType": "Low Context",
                  "isUpdated": false
                },
                {
                  "label": "HIGH_CONTEXT (Japan/India)",
                  "value": "Relational nuanced context-aware | Diplomatic indirect phrasing",
                  "varType": "High Context",
                  "isUpdated": false
                },
                {
                  "label": "Global Matching",
                  "value": "LOW CONTEXT MATCHED (CROSS-CULTURAL ALIGNMENT!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "culture_demo.js",
            "initialCode": "function matchCulture(type) {\n  if (type === 'LOW_CONTEXT') {\n    return { style: 'EXPLICIT_LITERAL_WRITTEN_DOCUMENTATION', status: 'LOW_CONTEXT_MATCHED' };\n  }\n  return { style: 'RELATIONAL_NUANCED_CONTEXT_AWARE', status: 'HIGH_CONTEXT_MATCHED' };\n}\n\nconsole.log(JSON.stringify(matchCulture('LOW_CONTEXT')));",
            "expectedOutput": "{\"style\":\"EXPLICIT_LITERAL_WRITTEN_DOCUMENTATION\",\"status\":\"LOW_CONTEXT_MATCHED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What communication style is recommended for collaborating effectively in low-context engineering cultures?",
          "expectedStringOutput": "EXPLICIT_LITERAL_WRITTEN_DOCUMENTATION",
          "acceptableAnswers": [
            "EXPLICIT_LITERAL_WRITTEN_DOCUMENTATION",
            "style\":\"EXPLICIT_LITERAL_WRITTEN_DOCUMENTATION\"",
            "Explicit written documentation"
          ],
          "primaryMisconceptionId": "MC_SK_GLOBAL_REMOTE_CULTURAL_DYNAMICS",
          "diagnosisMap": {
            "IMPLICIT": {
              "misconceptionId": "MC_SK_GLOBAL_REMOTE_CULTURAL_DYNAMICS",
              "errorExplanation": "Low-context requires explicit text: EXPLICIT_LITERAL_WRITTEN_DOCUMENTATION.",
              "recoveryPath": {
                "simplerExplanation": "Style is EXPLICIT_LITERAL_WRITTEN_DOCUMENTATION.",
                "guidedFixPrompt": "Type EXPLICIT_LITERAL_WRITTEN_DOCUMENTATION"
              }
            }
          }
        }
      },
      {
        "id": "comm-d28-b2-culture-map-author-erin-meyer",
        "day": 28,
        "blockNumber": 2,
        "title": "The Culture Map: Erin Meyer's Cross-Cultural Framework",
        "conceptBudget": {
          "primaryConcept": "Erin Meyer Framework Invariant",
          "supportingTerms": [
            "Erin Meyer (`INSEAD professor and author of 'The Culture Map' defining 8 behavioral scales for navigating multi-cultural international teams`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d28-b1-cultural-style-matcher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Culture Map Dimensions",
            "codeSnippet": "// 1. COMMUNICATING:  Low-Context (Explicit) vs High-Context (Nuanced)\n// 2. EVALUATING:     Direct Negative Feedback vs Indirect Negative Feedback\n// 3. PERSUADING:     Principles-First (Deductive) vs Applications-First (Inductive)\n// 4. LEADING:        Egalitarian (Flat) vs Hierarchical (Top-Down)",
            "lineNotes": {
              "1": "Communication axis.",
              "2": "Feedback axis.",
              "3": "Persuasion axis.",
              "4": "Leadership axis."
            }
          },
          {
            "type": "runnable_code",
            "filename": "erin_meyer_demo.js",
            "initialCode": "function getCultureAuthor() {\n  return 'Erin Meyer';\n}\n\nconsole.log(getCultureAuthor());",
            "expectedOutput": "Erin Meyer",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Who authored the acclaimed book 'The Culture Map' analyzing international communication styles?",
          "expectedStringOutput": "Erin Meyer",
          "acceptableAnswers": [
            "Erin Meyer",
            "erin meyer",
            "'Erin Meyer'"
          ],
          "primaryMisconceptionId": "MC_SK_GLOBAL_REMOTE_CULTURAL_DYNAMICS",
          "diagnosisMap": {
            "Geert Hofstede": {
              "misconceptionId": "MC_SK_GLOBAL_REMOTE_CULTURAL_DYNAMICS",
              "errorExplanation": "The Culture Map was authored by Erin Meyer.",
              "recoveryPath": {
                "simplerExplanation": "Type Erin Meyer.",
                "guidedFixPrompt": "Type Erin Meyer"
              }
            }
          }
        }
      },
      {
        "id": "comm-d28-b3-time-zone-asynchrony-discipline",
        "day": 28,
        "blockNumber": 3,
        "title": "Time-Zone Asynchrony: Writing Complete Handover Logs",
        "conceptBudget": {
          "primaryConcept": "Handover Log Invariant",
          "supportingTerms": [
            "Async Handover Logs (`When handing off on-call or development across 8+ hour time zones, writing explicit ticket status logs ensures work flows continuously around the clock`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d28-b2-culture-map-author-erin-meyer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "handover_demo.js",
            "initialCode": "function getHandoverRule() {\n  return 'WRITE_COMPREHENSIVE_ASYNC_HANDOVER_LOGS_FOR_TIMEZONE_TRANSITIONS';\n}\n\nconsole.log(getHandoverRule());",
            "expectedOutput": "WRITE_COMPREHENSIVE_ASYNC_HANDOVER_LOGS_FOR_TIMEZONE_TRANSITIONS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What documentation habit enables smooth development across distributed global time zones?",
          "expectedStringOutput": "WRITE_COMPREHENSIVE_ASYNC_HANDOVER_LOGS_FOR_TIMEZONE_TRANSITIONS",
          "acceptableAnswers": [
            "WRITE_COMPREHENSIVE_ASYNC_HANDOVER_LOGS_FOR_TIMEZONE_TRANSITIONS",
            "Async handover logs",
            "Write handover logs"
          ],
          "primaryMisconceptionId": "MC_SK_GLOBAL_REMOTE_CULTURAL_DYNAMICS",
          "diagnosisMap": {
            "LATE_CALLS": {
              "misconceptionId": "MC_SK_GLOBAL_REMOTE_CULTURAL_DYNAMICS",
              "errorExplanation": "Rule is: WRITE_COMPREHENSIVE_ASYNC_HANDOVER_LOGS_FOR_TIMEZONE_TRANSITIONS.",
              "recoveryPath": {
                "simplerExplanation": "Matches WRITE_COMPREHENSIVE_ASYNC_HANDOVER_LOGS_FOR_TIMEZONE_TRANSITIONS.",
                "guidedFixPrompt": "Type WRITE_COMPREHENSIVE_ASYNC_HANDOVER_LOGS_FOR_TIMEZONE_TRANSITIONS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Tech Lead & Engineering Leadership Communication: Servant Leadership Principles",
    "overviewMetaphor": "A Servant Tech Lead Is an Umbrella & Snowplow, Not a Taskmaster on a Throne: They clear road blocks ahead of the team (The Snowplow), shield engineers from distracting upstream executive noise (The Umbrella), and measure their personal success by how many junior developers they elevate into autonomous leaders.",
    "blocks": [
      {
        "id": "comm-d29-b1-tech-lead-delegation-auditor",
        "day": 29,
        "blockNumber": 1,
        "title": "Tech Leadership: Context Provided + Clear Metrics + Psychological Support",
        "conceptBudget": {
          "primaryConcept": "Tech Lead Delegation & Outcome Clarity Auditor",
          "supportingTerms": [
            "Task Context Provided (`true`)",
            "Clear Success Metric Defined (`true`)",
            "Psychological Support Offered (`true`)",
            "Status: Tech Lead Delegation Certified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d28-b1-cultural-style-matcher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Servant Leadership Delegation Architecture Ledger",
              "boxes": [
                {
                  "label": "1. Strategic Context",
                  "value": "'Here is why this payment feature matters to our Q3 churn goal'",
                  "varType": "Context",
                  "isUpdated": false
                },
                {
                  "label": "2. Success Metric",
                  "value": "'Target: < 200ms latency & 99.9% test coverage'",
                  "varType": "Metric",
                  "isUpdated": false
                },
                {
                  "label": "3. Support & Safety",
                  "value": "'I am available for pairing if you hit blockers' (CERTIFIED NOMINAL!)",
                  "varType": "Support",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "lead_delegation_demo.js",
            "initialCode": "function auditDelegation(ctx, metric, support) {\n  const ok = ctx && metric && support;\n  return {\n    isCompliant: ok,\n    status: ok ? 'TECH_LEAD_DELEGATION_CERTIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditDelegation(true, true, true)));",
            "expectedOutput": "{\"isCompliant\":true,\"status\":\"TECH_LEAD_DELEGATION_CERTIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a tech lead delegated a major feature according to servant leadership standards?",
          "expectedStringOutput": "TECH_LEAD_DELEGATION_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "TECH_LEAD_DELEGATION_CERTIFIED_NOMINAL",
            "status\":\"TECH_LEAD_DELEGATION_CERTIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_TECH_LEAD_SERVANT_LEADERSHIP",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SK_TECH_LEAD_SERVANT_LEADERSHIP",
              "errorExplanation": "Matches TECH_LEAD_DELEGATION_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type TECH_LEAD_DELEGATION_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d29-b2-tech-lead-philosophy-name",
        "day": 29,
        "blockNumber": 2,
        "title": "The Core Tech Lead Philosophy: Servant Leadership",
        "conceptBudget": {
          "primaryConcept": "Servant Leadership Invariant",
          "supportingTerms": [
            "`Servant Leadership` (The philosophy that an engineering manager or tech lead's primary job is to serve the team by removing blockers, empowering autonomy, and coaching growth)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d29-b1-tech-lead-delegation-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Command-and-Control vs Servant Leadership",
            "codeSnippet": "// ❌ COMMAND & CONTROL: \"Do this exact task by 5 PM, don't ask questions\"\n// ✅ SERVANT LEADERSHIP: \"Here is the customer problem and latency goal. How would you approach it? Let me know how I can support you.\"",
            "lineNotes": {
              "1": "Micromanagement anti-pattern.",
              "2": "Empowering servant leadership."
            }
          },
          {
            "type": "runnable_code",
            "filename": "servant_leadership_demo.js",
            "initialCode": "function getPhilosophy() {\n  return 'Servant Leadership';\n}\n\nconsole.log(getPhilosophy());",
            "expectedOutput": "Servant Leadership",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What leadership philosophy prioritizes removing team obstacles and fostering developer autonomy?",
          "expectedStringOutput": "Servant Leadership",
          "acceptableAnswers": [
            "Servant Leadership",
            "servant leadership",
            "'Servant Leadership'"
          ],
          "primaryMisconceptionId": "MC_SK_TECH_LEAD_SERVANT_LEADERSHIP",
          "diagnosisMap": {
            "Command and Control": {
              "misconceptionId": "MC_SK_TECH_LEAD_SERVANT_LEADERSHIP",
              "errorExplanation": "Top tech companies practice Servant Leadership.",
              "recoveryPath": {
                "simplerExplanation": "Type Servant Leadership.",
                "guidedFixPrompt": "Type Servant Leadership"
              }
            }
          }
        }
      },
      {
        "id": "comm-d29-b3-shielding-the-team-from-noise",
        "day": 29,
        "blockNumber": 3,
        "title": "The Umbrella Role: Shielding Engineers from Premature Executive Panic",
        "conceptBudget": {
          "primaryConcept": "Umbrella Shielding Invariant",
          "supportingTerms": [
            "The Umbrella Role (`Absorbing shifting executive priorities and half-baked feature ideas without disrupting active sprint focus until requirements are finalized`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d29-b2-tech-lead-philosophy-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "umbrella_shield_demo.js",
            "initialCode": "function getShieldingRule() {\n  return 'SHIELD_ENGINEERS_FROM_DISTRACTING_UPSTREAM_EXECUTIVE_NOISE';\n}\n\nconsole.log(getShieldingRule());",
            "expectedOutput": "SHIELD_ENGINEERS_FROM_DISTRACTING_UPSTREAM_EXECUTIVE_NOISE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What protective function must tech leads perform to safeguard developer flow during active sprints?",
          "expectedStringOutput": "SHIELD_ENGINEERS_FROM_DISTRACTING_UPSTREAM_EXECUTIVE_NOISE",
          "acceptableAnswers": [
            "SHIELD_ENGINEERS_FROM_DISTRACTING_UPSTREAM_EXECUTIVE_NOISE",
            "Shield from executive noise",
            "Shield engineers from noise"
          ],
          "primaryMisconceptionId": "MC_SK_TECH_LEAD_SERVANT_LEADERSHIP",
          "diagnosisMap": {
            "FORWARD_ALL": {
              "misconceptionId": "MC_SK_TECH_LEAD_SERVANT_LEADERSHIP",
              "errorExplanation": "Forwarding every panic creates chaos. Standard is: SHIELD_ENGINEERS_FROM_DISTRACTING_UPSTREAM_EXECUTIVE_NOISE.",
              "recoveryPath": {
                "simplerExplanation": "Matches SHIELD_ENGINEERS_FROM_DISTRACTING_UPSTREAM_EXECUTIVE_NOISE.",
                "guidedFixPrompt": "Type SHIELD_ENGINEERS_FROM_DISTRACTING_UPSTREAM_EXECUTIVE_NOISE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Professional Tech Communication & Executive Career Suite",
    "overviewMetaphor": "Day 30 Sovereign Capstone Orchestration: The complete sovereign tech communication and career acceleration master suite: 1. Written Documentation & Async Etiquette (BLUF emails, 5-section README, and No-Hello Slack hygiene); 2. Interpersonal Alignment & Feedback (SBI feedback delivery, IBR conflict resolution, and 90-second standups); 3. Executive Storytelling & Negotiation (Minto Pyramid decks, SCR crisis briefings, and ZOPA/BATNA persuasion); 4. Interview Mastery (Google X-Y-Z resume bullets, STAR behavioral responses, and RADIO system design communication); 5. Career & Leadership Acceleration (Total Compensation negotiation, 30-60-90 onboarding, team RFC authoring, and Servant Leadership).",
    "blocks": [
      {
        "id": "comm-d30-b1-capstone-suite-orchestrator",
        "day": 30,
        "blockNumber": 1,
        "title": "Sovereign Tech Communication & Career Suite Orchestrator",
        "conceptBudget": {
          "primaryConcept": "Sovereign Tech Communication & Career Suite Orchestrator",
          "supportingTerms": [
            "Written & Async Module",
            "Interpersonal & Feedback Module",
            "Executive & Negotiation Module",
            "Interview Mastery Module",
            "Career & Leadership Module",
            "Status: Sovereign Tech Communication and Career Master Certified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d29-b1-tech-lead-delegation-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Day 30 Sovereign Master Architecture Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Executes BLUF written emails, 5-section READMEs, and No-Hello async Slack etiquette",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Deploys SBI feedback, IBR conflict resolution, and 90s daily standups",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Structures Minto Pyramid presentations, SCR incident briefings, and ZOPA negotiations",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Formats Google X-Y-Z resumes, STAR interview responses, and RADIO system design diagrams",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Calculates Total Compensation, 30-60-90 onboarding plans, team RFCs, and Servant Leadership!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_kernel_demo.js",
            "initialCode": "function orchestrateCapstone(f, l, c, i, s) {\n  const ok = f && l && c && i && s;\n  return {\n    sovereignTechCommCertified: ok,\n    status: ok ? 'SOVEREIGN_TECH_COMMUNICATION_AND_CAREER_MASTER_CERTIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(orchestrateCapstone(true, true, true, true, true)));",
            "expectedOutput": "{\"sovereignTechCommCertified\":true,\"status\":\"SOVEREIGN_TECH_COMMUNICATION_AND_CAREER_MASTER_CERTIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What master status confirms full sovereign certification of the Tech Communication & Executive Career Suite?",
          "expectedStringOutput": "SOVEREIGN_TECH_COMMUNICATION_AND_CAREER_MASTER_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "SOVEREIGN_TECH_COMMUNICATION_AND_CAREER_MASTER_CERTIFIED_NOMINAL",
            "status\":\"SOVEREIGN_TECH_COMMUNICATION_AND_CAREER_MASTER_CERTIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_SK_CAPSTONE_SOVEREIGN_TECH_COMMUNICATION_SUITE",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_SK_CAPSTONE_SOVEREIGN_TECH_COMMUNICATION_SUITE",
              "errorExplanation": "All 5 core modules verified: SOVEREIGN_TECH_COMMUNICATION_AND_CAREER_MASTER_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches SOVEREIGN_TECH_COMMUNICATION_AND_CAREER_MASTER_CERTIFIED_NOMINAL.",
                "guidedFixPrompt": "Type SOVEREIGN_TECH_COMMUNICATION_AND_CAREER_MASTER_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "comm-d30-b2-capstone-cert-auditor",
        "day": 30,
        "blockNumber": 2,
        "title": "Master Capstone Certification Tier Audit",
        "conceptBudget": {
          "primaryConcept": "Master Capstone Certification Tier",
          "supportingTerms": [
            "Score: 100/100",
            "Tier: SOVEREIGN_TECH_COMMUNICATION_MASTER_CERTIFIED",
            "Certified: true"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d30-b1-capstone-suite-orchestrator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_cert_demo.js",
            "initialCode": "function auditMasterCert() {\n  return {\n    certified: true,\n    score: '100/100',\n    tier: 'SOVEREIGN_TECH_COMMUNICATION_MASTER_CERTIFIED'\n  };\n}\n\nconsole.log(JSON.stringify(auditMasterCert()));",
            "expectedOutput": "{\"certified\":true,\"score\":\"100/100\",\"tier\":\"SOVEREIGN_TECH_COMMUNICATION_MASTER_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What master certification tier is awarded upon completing the Day 30 Capstone audit?",
          "expectedStringOutput": "SOVEREIGN_TECH_COMMUNICATION_MASTER_CERTIFIED",
          "acceptableAnswers": [
            "SOVEREIGN_TECH_COMMUNICATION_MASTER_CERTIFIED",
            "tier\":\"SOVEREIGN_TECH_COMMUNICATION_MASTER_CERTIFIED\""
          ],
          "primaryMisconceptionId": "MC_SK_CAPSTONE_SOVEREIGN_TECH_COMMUNICATION_SUITE",
          "diagnosisMap": {
            "JUNIOR": {
              "misconceptionId": "MC_SK_CAPSTONE_SOVEREIGN_TECH_COMMUNICATION_SUITE",
              "errorExplanation": "Tier awarded is SOVEREIGN_TECH_COMMUNICATION_MASTER_CERTIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Type SOVEREIGN_TECH_COMMUNICATION_MASTER_CERTIFIED.",
                "guidedFixPrompt": "Type SOVEREIGN_TECH_COMMUNICATION_MASTER_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "comm-d30-b3-final-capstone-cert",
        "day": 30,
        "blockNumber": 3,
        "title": "Final 30-Day Master Tech Communication Certification",
        "conceptBudget": {
          "primaryConcept": "Final 30-Day Master Tech Communication Certification",
          "supportingTerms": [
            "30 Days Completed",
            "90 Blocks Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "comm-d30-b2-capstone-cert-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "final_capstone_cert.js",
            "initialCode": "console.log('🏆 30-DAY PIN-IT MASTER CERTIFICATION: Sovereign Professional Tech Communication & Executive Career Suite [100/100 PRODUCTION COMPLETE]');",
            "expectedOutput": "🏆 30-DAY PIN-IT MASTER CERTIFICATION: Sovereign Professional Tech Communication & Executive Career Suite [100/100 PRODUCTION COMPLETE]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What graduation certification message confirms 30-Day Tech Communication curriculum completion?",
          "expectedStringOutput": "🏆 30-DAY PIN-IT MASTER CERTIFICATION: Sovereign Professional Tech Communication & Executive Career Suite [100/100 PRODUCTION COMPLETE]",
          "acceptableAnswers": [
            "🏆 30-DAY PIN-IT MASTER CERTIFICATION: Sovereign Professional Tech Communication & Executive Career Suite [100/100 PRODUCTION COMPLETE]",
            "100/100 PRODUCTION COMPLETE"
          ],
          "primaryMisconceptionId": "MC_SK_CAPSTONE_SOVEREIGN_TECH_COMMUNICATION_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_SK_CAPSTONE_SOVEREIGN_TECH_COMMUNICATION_SUITE",
              "errorExplanation": "Matches graduation header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches graduation string.",
                "guidedFixPrompt": "Type 🏆 30-DAY PIN-IT MASTER CERTIFICATION: Sovereign Professional Tech Communication & Executive Career Suite [100/100 PRODUCTION COMPLETE]"
              }
            }
          }
        }
      }
    ]
  }
];
