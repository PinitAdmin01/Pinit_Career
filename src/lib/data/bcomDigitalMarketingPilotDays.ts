import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const BCOM_DIGITAL_MARKETING_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Digital Marketing Ecosystem & Multi-Touch Attribution",
    "overviewMetaphor": "Digital Marketing is a Precision GPS Tracking Every Step of the Buyer's Journey: unlike traditional billboard advertising where half your budget is wasted on unknown drivers, digital marketing tracks every touchpoint (Paid Google Search ad $\\to$ Organic Blog reading $\\to$ Email Newsletter click $\\to$ Retargeting Instagram ad); Linear Multi-Touch Attribution divides a $1,000 checkout conversion equally across all 4 touchpoints ($250 each), proving no single channel acts alone.",
    "blocks": [
      {
        "id": "dmkt-d1-b1-linear-attribution-model",
        "day": 1,
        "blockNumber": 1,
        "title": "Linear Multi-Touch Attribution: Dividing Conversion Value Equally",
        "conceptBudget": {
          "primaryConcept": "Linear Multi-Touch Attribution Formula",
          "supportingTerms": [
            "$\\text{Value per Touchpoint} = \\frac{\\text{Total Conversion Value}}{\\text{Total Number of Touchpoints } N}$",
            "Eliminating single-channel bias",
            "Linear attribution maps fair contribution across the entire funnel"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Linear Attribution Ledger (Conversion = $1,000 across 4 Touchpoints)",
              "boxes": [
                {
                  "label": "Touchpoint 1: Paid Search",
                  "value": "$1,000 / 4 = $250.00 Attributed Value",
                  "varType": "Top of Funnel",
                  "isUpdated": false
                },
                {
                  "label": "Touchpoint 2: SEO Blog Post",
                  "value": "$1,000 / 4 = $250.00 Attributed Value",
                  "varType": "Mid Funnel",
                  "isUpdated": false
                },
                {
                  "label": "Touchpoint 3: Email & 4: Retargeting",
                  "value": "$250.00 + $250.00 = $500.00 Combined Value",
                  "varType": "Bottom of Funnel",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "linear_attribution_demo.js",
            "initialCode": "function calculateLinearAttribution(touchpoints, totalRevenue) {\n  const share = totalRevenue / touchpoints.length;\n  const result = {};\n  touchpoints.forEach(t => result[t] = Number(share.toFixed(2)));\n  return {\n    totalTouchpoints: touchpoints.length,\n    totalRevenue,\n    attributedSharePerChannel: share,\n    attributionMap: result,\n    status: 'ATTRIBUTION_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateLinearAttribution([\n  'GOOGLE_SEARCH',\n  'ORGANIC_BLOG',\n  'EMAIL_NEWSLETTER',\n  'INSTAGRAM_RETARGETING'\n], 1000)));",
            "expectedOutput": "{\"totalTouchpoints\":4,\"totalRevenue\":1000,\"attributedSharePerChannel\":250,\"attributionMap\":{\"GOOGLE_SEARCH\":250,\"ORGANIC_BLOG\":250,\"EMAIL_NEWSLETTER\":250,\"INSTAGRAM_RETARGETING\":250},\"status\":\"ATTRIBUTION_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the attributed dollar revenue for each channel when a $1,000 e-commerce order involves 4 distinct digital marketing touchpoints in a Linear Attribution model ($1,000 / 4$)?",
          "expectedStringOutput": "250",
          "acceptableAnswers": [
            "250",
            "$250",
            "250.0",
            "attributedSharePerChannel\":250"
          ],
          "primaryMisconceptionId": "MC_DMKT_ECOSYSTEM_TOUCHPOINTS_ATTRIBUTION",
          "diagnosisMap": {
            "1000": {
              "misconceptionId": "MC_DMKT_ECOSYSTEM_TOUCHPOINTS_ATTRIBUTION",
              "errorExplanation": "1,000 is Last-Touch attribution giving 100% to one channel. Linear attribution divides equally: 1,000 / 4 = $250.",
              "recoveryPath": {
                "simplerExplanation": "1,000 / 4 = 250.",
                "guidedFixPrompt": "Type 250"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d1-b2-digital-customer-decision-journey",
        "day": 1,
        "blockNumber": 2,
        "title": "The 5-Stage Digital Customer Decision Funnel",
        "conceptBudget": {
          "primaryConcept": "The 5-Stage Digital Funnel",
          "supportingTerms": [
            "1. Awareness (Top-of-Funnel TOFU: Display, YouTube, Social)",
            "2. Consideration (Middle-of-Funnel MOFU: SEO guides, Comparison pages, Webinars)",
            "3. Purchase (Bottom-of-Funnel BOFU: Search ads, Abandoned cart emails)",
            "4. Retention (Post-purchase drips, Loyalty programs)",
            "5. Advocacy (Referral loops, UGC reviews)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d1-b1-linear-attribution-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Digital Funnel Stage Alignment",
            "codeSnippet": "// TOFU (Awareness):     Viral TikTok / YouTube Shorts -> Broad reach\n// MOFU (Consideration): In-depth 4,000-word Whitepaper / Comparison Chart -> Lead capture\n// BOFU (Purchase):      High-intent Google Search Ad ('buy pro plan') -> Instant checkout!",
            "lineNotes": {
              "1": "Top of funnel.",
              "2": "Middle of funnel.",
              "3": "Bottom of funnel conversion."
            }
          },
          {
            "type": "runnable_code",
            "filename": "funnel_stage_demo.js",
            "initialCode": "function mapContentToFunnel(contentType) {\n  if (contentType === 'HIGH_INTENT_SEARCH_AD') return 'BOFU_PURCHASE_CONVERSION';\n  if (contentType === 'COMPARISON_WHITEPAPER') return 'MOFU_CONSIDERATION';\n  return 'TOFU_BRAND_AWARENESS';\n}\n\nconsole.log(mapContentToFunnel('HIGH_INTENT_SEARCH_AD'));\nconsole.log(mapContentToFunnel('COMPARISON_WHITEPAPER'));",
            "expectedOutput": "BOFU_PURCHASE_CONVERSION\nMOFU_CONSIDERATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which funnel stage is targeted by high-intent Google Search Ads displaying 'buy enterprise software license' keywords?",
          "expectedStringOutput": "BOFU_PURCHASE_CONVERSION",
          "acceptableAnswers": [
            "BOFU_PURCHASE_CONVERSION",
            "BOFU",
            "Bottom of Funnel"
          ],
          "primaryMisconceptionId": "MC_DMKT_ECOSYSTEM_TOUCHPOINTS_ATTRIBUTION",
          "diagnosisMap": {
            "TOFU": {
              "misconceptionId": "MC_DMKT_ECOSYSTEM_TOUCHPOINTS_ATTRIBUTION",
              "errorExplanation": "TOFU is broad awareness. 'Buy now' keywords target the bottom of the funnel (BOFU).",
              "recoveryPath": {
                "simplerExplanation": "'Buy' keywords are BOFU.",
                "guidedFixPrompt": "Type BOFU_PURCHASE_CONVERSION"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d1-b3-digital-vs-traditional-marketing-metrics",
        "day": 1,
        "blockNumber": 3,
        "title": "Digital vs Traditional Marketing: Real-Time Telemetry & Granular Measurability",
        "conceptBudget": {
          "primaryConcept": "Digital Measurability Advantages",
          "supportingTerms": [
            "Granular Cost Per Click (CPC) & Cost Per Acquisition (CAC)",
            "Real-time campaign telemetry (Pivoting ad spend within minutes)",
            "A/B creative testing versus rigid static print/TV billboards"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d1-b2-digital-customer-decision-journey",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "measurability_demo.js",
            "initialCode": "function evaluateMarketingChannel(isRealTimeMeasurable) {\n  return isRealTimeMeasurable\n    ? 'DIGITAL_PERFORMANCE_MARKETING_PRECISION'\n    : 'TRADITIONAL_BROADCAST_ESTIMATION';\n}\n\nconsole.log(evaluateMarketingChannel(true));\nconsole.log(evaluateMarketingChannel(false));",
            "expectedOutput": "DIGITAL_PERFORMANCE_MARKETING_PRECISION\nTRADITIONAL_BROADCAST_ESTIMATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What capability fundamentally distinguishes digital performance marketing from traditional billboard/TV broadcasting?",
          "expectedStringOutput": "DIGITAL_PERFORMANCE_MARKETING_PRECISION",
          "acceptableAnswers": [
            "DIGITAL_PERFORMANCE_MARKETING_PRECISION",
            "Real-time measurability",
            "Precision tracking"
          ],
          "primaryMisconceptionId": "MC_DMKT_ECOSYSTEM_TOUCHPOINTS_ATTRIBUTION",
          "diagnosisMap": {
            "TRADITIONAL": {
              "misconceptionId": "MC_DMKT_ECOSYSTEM_TOUCHPOINTS_ATTRIBUTION",
              "errorExplanation": "Traditional broadcast relies on broad estimates. Digital provides real-time precision.",
              "recoveryPath": {
                "simplerExplanation": "Matches DIGITAL_PERFORMANCE_MARKETING_PRECISION.",
                "guidedFixPrompt": "Type DIGITAL_PERFORMANCE_MARKETING_PRECISION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "SEO Keyword Research: Search Volume, Keyword Difficulty & Search Intent",
    "overviewMetaphor": "Keyword Research is Prospecting for Gold in a Search Engine Mountain: High Search Volume (10,000 searches/mo) is a rich gold vein; Keyword Difficulty (KD = 19/100) measures how hard the rock is to dig through; Search Intent (Transactional $1.5\\times$ multiplier) measures the purity of the gold; the Keyword Opportunity Score ($KOS = \\frac{10,000 \\times 1.5}{19 + 1} = 750.0$) proves this is an easy, high-yield gold mine to rank on Google Page 1.",
    "blocks": [
      {
        "id": "dmkt-d2-b1-keyword-opportunity-score-formula",
        "day": 2,
        "blockNumber": 1,
        "title": "The Keyword Opportunity Score (KOS) Formula: $\\frac{\\text{Volume} \\times \\text{Intent}}{\\text{KD} + 1}$",
        "conceptBudget": {
          "primaryConcept": "Keyword Opportunity Score (KOS)",
          "supportingTerms": [
            "Monthly Search Volume ($10,000$)",
            "Keyword Difficulty ($KD = 19$ on a scale of 0-100)",
            "Search Intent Multiplier ($1.5$ for Transactional, $1.2$ for Commercial, $1.0$ for Informational)",
            "$KOS = \\frac{10,000 \\times 1.5}{20} = 750.0 \\ge 500.0 \\implies$ High Priority Target!"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d1-b1-linear-attribution-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Keyword Valuation Ledger (Volume = 10k, KD = 19, Intent = 1.5x)",
              "boxes": [
                {
                  "label": "Search Demand",
                  "value": "10,000 Monthly Searches (High organic demand)",
                  "varType": "Volume",
                  "isUpdated": false
                },
                {
                  "label": "Competition Resistance",
                  "value": "KD = 19 / 100 (Low competition barrier -> KD + 1 = 20)",
                  "varType": "Difficulty",
                  "isUpdated": false
                },
                {
                  "label": "Opportunity Score (KOS)",
                  "value": "(10,000 x 1.5) / 20 = 15,000 / 20 = 750.0 (HIGH PRIORITY TARGET!)",
                  "varType": "KOS Score",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "kos_calc_demo.js",
            "initialCode": "function calculateKos(vol, kd, intentMultiplier) {\n  const score = (vol * intentMultiplier) / (kd + 1);\n  return {\n    volume: vol,\n    kd,\n    intentMultiplier,\n    kosScore: Number(score.toFixed(1)),\n    isHighPriority: score >= 500.0,\n    status: 'KOS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateKos(10000, 19, 1.5)));",
            "expectedOutput": "{\"volume\":10000,\"kd\":19,\"intentMultiplier\":1.5,\"kosScore\":750,\"isHighPriority\":true,\"status\":\"KOS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Keyword Opportunity Score (KOS) for a keyword with Volume=10,000, KD=19, and Intent=1.5 ($ (10,000 \\times 1.5) / (19 + 1) $)?",
          "expectedStringOutput": "750",
          "acceptableAnswers": [
            "750",
            "750.0",
            "kosScore\":750"
          ],
          "primaryMisconceptionId": "MC_DMKT_SEO_KEYWORD_SEARCH_INTENT_DIFFICULTY",
          "diagnosisMap": {
            "789": {
              "misconceptionId": "MC_DMKT_SEO_KEYWORD_SEARCH_INTENT_DIFFICULTY",
              "errorExplanation": "789 divides by 19 instead of (KD + 1 = 20). 15,000 / 20 = 750.0.",
              "recoveryPath": {
                "simplerExplanation": "15,000 / 20 = 750.",
                "guidedFixPrompt": "Type 750"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d2-b2-four-search-intent-types",
        "day": 2,
        "blockNumber": 2,
        "title": "The 4 Search Intent Types: Informational, Commercial, Transactional & Navigational",
        "conceptBudget": {
          "primaryConcept": "The 4 Search Intent Types",
          "supportingTerms": [
            "1. Informational ('How to fix a flat tire', 'What is SEO')",
            "2. Navigational ('Netflix login', 'Apple homepage')",
            "3. Commercial Investigation ('Best CRM software 2026', 'HubSpot vs Salesforce')",
            "4. Transactional ('Buy iPhone 16 Pro discount code', 'Sign up AWS free tier')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d2-b1-keyword-opportunity-score-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Search Intent Mapping",
            "codeSnippet": "// 'how does seo work'            -> INFORMATIONAL (Blog / Educational Guide)\n// 'best email marketing tools'   -> COMMERCIAL_INVESTIGATION (Comparison Listicle)\n// 'buy sendgrid email api pro'   -> TRANSACTIONAL (Pricing Page Checkout)",
            "lineNotes": {
              "1": "Top of funnel educational.",
              "2": "Mid of funnel evaluation.",
              "3": "Bottom of funnel transaction."
            }
          },
          {
            "type": "runnable_code",
            "filename": "search_intent_demo.js",
            "initialCode": "function classifySearchIntent(query) {\n  if (query.includes('buy') || query.includes('order') || query.includes('discount')) return 'TRANSACTIONAL_INTENT';\n  if (query.includes('best') || query.includes('vs') || query.includes('review')) return 'COMMERCIAL_INVESTIGATION_INTENT';\n  return 'INFORMATIONAL_INTENT';\n}\n\nconsole.log(classifySearchIntent('buy accounting software license'));\nconsole.log(classifySearchIntent('best accounting software vs excel'));",
            "expectedOutput": "TRANSACTIONAL_INTENT\nCOMMERCIAL_INVESTIGATION_INTENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is a search query like 'best CRM software comparison 2026' classified across the 4 search intent categories?",
          "expectedStringOutput": "COMMERCIAL_INVESTIGATION_INTENT",
          "acceptableAnswers": [
            "COMMERCIAL_INVESTIGATION_INTENT",
            "Commercial Investigation",
            "Commercial"
          ],
          "primaryMisconceptionId": "MC_DMKT_SEO_KEYWORD_SEARCH_INTENT_DIFFICULTY",
          "diagnosisMap": {
            "INFO": {
              "misconceptionId": "MC_DMKT_SEO_KEYWORD_SEARCH_INTENT_DIFFICULTY",
              "errorExplanation": "Comparison queries evaluating solutions represent Commercial Investigation intent.",
              "recoveryPath": {
                "simplerExplanation": "Matches COMMERCIAL_INVESTIGATION_INTENT.",
                "guidedFixPrompt": "Type COMMERCIAL_INVESTIGATION_INTENT"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d2-b3-long-tail-keyword-strategy",
        "day": 2,
        "blockNumber": 3,
        "title": "Long-Tail Keyword Economics: High Conversion, Low KD",
        "conceptBudget": {
          "primaryConcept": "Long-Tail Keyword Strategy",
          "supportingTerms": [
            "Head Terms (1-2 words e.g. 'Shoes': High volume, ultra-high KD, low conversion)",
            "Long-Tail Keywords (3-5+ words e.g. 'Men waterproof trail running shoes size 10': Lower volume, near-zero KD, 3x higher conversion rate!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d2-b2-four-search-intent-types",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "long_tail_demo.js",
            "initialCode": "function evaluateKeywordLength(wordCount) {\n  return wordCount >= 4\n    ? 'LONG_TAIL_HIGH_CONVERSION_TARGET'\n    : 'SHORT_HEAD_BROAD_HIGH_COMPETITION';\n}\n\nconsole.log(evaluateKeywordLength(5));\nconsole.log(evaluateKeywordLength(1));",
            "expectedOutput": "LONG_TAIL_HIGH_CONVERSION_TARGET\nSHORT_HEAD_BROAD_HIGH_COMPETITION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is a 5-word specific search phrase (e.g. 'organic dog food for puppies') classified in search engine optimization strategy?",
          "expectedStringOutput": "LONG_TAIL_HIGH_CONVERSION_TARGET",
          "acceptableAnswers": [
            "LONG_TAIL_HIGH_CONVERSION_TARGET",
            "Long Tail Keyword",
            "Long-Tail"
          ],
          "primaryMisconceptionId": "MC_DMKT_SEO_KEYWORD_SEARCH_INTENT_DIFFICULTY",
          "diagnosisMap": {
            "HEAD": {
              "misconceptionId": "MC_DMKT_SEO_KEYWORD_SEARCH_INTENT_DIFFICULTY",
              "errorExplanation": "Short head terms are 1-2 words. Specific 4+ word phrases are Long-Tail keywords.",
              "recoveryPath": {
                "simplerExplanation": "Specific multi-word phrases are Long-Tail.",
                "guidedFixPrompt": "Type LONG_TAIL_HIGH_CONVERSION_TARGET"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "On-Page & Technical SEO: Core Web Vitals & Structured Data (Schema.org)",
    "overviewMetaphor": "Technical SEO is the Engine and Structural Foundation of a Racecar: Google will not rank a slow, rattling website; Google's Core Web Vitals measure 3 strict speed and stability metrics: Largest Contentful Paint (LCP $\\le 2.5s$: How fast the main image loads), Interaction to Next Paint (INP $\\le 200ms$: How fast buttons respond to clicks), and Cumulative Layout Shift (CLS $\\le 0.1$: Preventing sudden visual jumps); Schema.org JSON-LD structured data provides clean blueprints that allow Google robots to display rich golden star review snippets in search results.",
    "blocks": [
      {
        "id": "dmkt-d3-b1-google-core-web-vitals-benchmarks",
        "day": 3,
        "blockNumber": 1,
        "title": "Google Core Web Vitals 3 Benchmarks: LCP $\\le 2.5s$, INP $\\le 200ms$, CLS $\\le 0.1$",
        "conceptBudget": {
          "primaryConcept": "Core Web Vitals Thresholds",
          "supportingTerms": [
            "LCP (Largest Contentful Paint $\\le 2.5$ seconds: Perceived loading speed)",
            "INP (Interaction to Next Paint $\\le 200$ milliseconds: User responsiveness)",
            "CLS (Cumulative Layout Shift $\\le 0.1$: Visual stability)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d2-b1-keyword-opportunity-score-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Google Core Web Vitals Ranking Criteria",
              "boxes": [
                {
                  "label": "1. LCP (Loading Speed)",
                  "value": "1.80s <= 2.5s Threshold -> PASS (Fast hero render)",
                  "varType": "LCP",
                  "isUpdated": false
                },
                {
                  "label": "2. INP (Responsiveness)",
                  "value": "120ms <= 200ms Threshold -> PASS (Snappy UI clicks)",
                  "varType": "INP",
                  "isUpdated": false
                },
                {
                  "label": "3. CLS (Visual Stability)",
                  "value": "0.05 <= 0.10 Threshold -> PASS (Zero annoying layout jump)",
                  "varType": "CLS",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cwv_audit_demo.js",
            "initialCode": "function auditCoreWebVitals(lcp, inp, cls) {\n  const ok = lcp <= 2.5 && inp <= 200 && cls <= 0.1;\n  return {\n    lcpSeconds: lcp,\n    inpMilliseconds: inp,\n    clsScore: cls,\n    meetsGoogleStandards: ok,\n    status: ok ? 'GOOD_CORE_WEB_VITALS_PASS' : 'POOR_PAGE_EXPERIENCE_FAIL'\n  };\n}\n\nconsole.log(JSON.stringify(auditCoreWebVitals(1.8, 120, 0.05)));\nconsole.log(JSON.stringify(auditCoreWebVitals(3.4, 250, 0.18)));",
            "expectedOutput": "{\"lcpSeconds\":1.8,\"inpMilliseconds\":120,\"clsScore\":0.05,\"meetsGoogleStandards\":true,\"status\":\"GOOD_CORE_WEB_VITALS_PASS\"}\n{\"lcpSeconds\":3.4,\"inpMilliseconds\":250,\"clsScore\":0.18,\"meetsGoogleStandards\":false,\"status\":\"POOR_PAGE_EXPERIENCE_FAIL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum allowable Largest Contentful Paint (LCP) time in seconds for a webpage to earn Google's 'Good' Core Web Vitals rating?",
          "expectedStringOutput": "2.5",
          "acceptableAnswers": [
            "2.5",
            "2.5s",
            "2.5 seconds",
            "lcpSeconds\":1.8"
          ],
          "primaryMisconceptionId": "MC_DMKT_ONPAGE_TECHNICAL_SEO_CORE_WEB_VITALS",
          "diagnosisMap": {
            "4.0": {
              "misconceptionId": "MC_DMKT_ONPAGE_TECHNICAL_SEO_CORE_WEB_VITALS",
              "errorExplanation": "4.0s is considered Poor. The Google 'Good' threshold is strictly <= 2.5 seconds.",
              "recoveryPath": {
                "simplerExplanation": "LCP benchmark is 2.5s.",
                "guidedFixPrompt": "Type 2.5"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d3-b2-schema-org-json-ld-structured-data",
        "day": 3,
        "blockNumber": 2,
        "title": "Schema.org JSON-LD Structured Data & Rich Snippets",
        "conceptBudget": {
          "primaryConcept": "JSON-LD Structured Data",
          "supportingTerms": [
            "JSON-LD (`<script type=\"application/ld+json\">`)",
            "Schema types: Article, Product, FAQPage, BreadcrumbList, Organization",
            "Rich Snippets (Star ratings, FAQ accordions, and price display in SERP)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d3-b1-google-core-web-vitals-benchmarks",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Schema.org JSON-LD Structure",
            "codeSnippet": "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Product\",\n  \"name\": \"PinIT Career OS Pro\",\n  \"aggregateRating\": { \"@type\": \"AggregateRating\", \"ratingValue\": \"4.9\", \"reviewCount\": \"1250\" }\n}",
            "lineNotes": {
              "2": "Standard vocabulary.",
              "3": "Product schema entity.",
              "5": "Generates 4.9 golden star rich snippet."
            }
          },
          {
            "type": "runnable_code",
            "filename": "json_ld_demo.js",
            "initialCode": "function getJsonLdFormat() {\n  return 'APPLICATION_LD_JSON_STRUCTURED_DATA';\n}\n\nconsole.log(getJsonLdFormat());",
            "expectedOutput": "APPLICATION_LD_JSON_STRUCTURED_DATA",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which structured data format is officially recommended by Google for implementing Schema.org rich snippets in web pages?",
          "expectedStringOutput": "APPLICATION_LD_JSON_STRUCTURED_DATA",
          "acceptableAnswers": [
            "APPLICATION_LD_JSON_STRUCTURED_DATA",
            "JSON-LD",
            "json-ld"
          ],
          "primaryMisconceptionId": "MC_DMKT_ONPAGE_TECHNICAL_SEO_CORE_WEB_VITALS",
          "diagnosisMap": {
            "MICRODATA": {
              "misconceptionId": "MC_DMKT_ONPAGE_TECHNICAL_SEO_CORE_WEB_VITALS",
              "errorExplanation": "Microdata is legacy HTML tagging. Google explicitly recommends JSON-LD structured data.",
              "recoveryPath": {
                "simplerExplanation": "Matches APPLICATION_LD_JSON_STRUCTURED_DATA.",
                "guidedFixPrompt": "Type APPLICATION_LD_JSON_STRUCTURED_DATA"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d3-b3-canonical-urls-duplicate-prevention",
        "day": 3,
        "blockNumber": 3,
        "title": "Canonical URLs & Preventing Duplicate Content Penalties",
        "conceptBudget": {
          "primaryConcept": "Canonical Tag Invariant",
          "supportingTerms": [
            "`<link rel=\"canonical\" href=\"https://example.com/canonical-page\" />`",
            "Consolidating URL parameters (UTM tags, sorting filters) to single authoritative master URL"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d3-b2-schema-org-json-ld-structured-data",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "canonical_demo.js",
            "initialCode": "function getCanonicalUrl(rawUrl) {\n  return rawUrl.split('?')[0];\n}\n\nconsole.log(getCanonicalUrl('https://example.com/shoes?color=blue&utm_source=facebook'));",
            "expectedOutput": "https://example.com/shoes",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What clean master URL is resolved as the canonical tag target for 'https://example.com/shoes?color=blue&utm_source=facebook'?",
          "expectedStringOutput": "https://example.com/shoes",
          "acceptableAnswers": [
            "https://example.com/shoes",
            "example.com/shoes"
          ],
          "primaryMisconceptionId": "MC_DMKT_ONPAGE_TECHNICAL_SEO_CORE_WEB_VITALS",
          "diagnosisMap": {
            "WITH_UTM": {
              "misconceptionId": "MC_DMKT_ONPAGE_TECHNICAL_SEO_CORE_WEB_VITALS",
              "errorExplanation": "Canonical tags strip tracking query parameters to consolidate PageRank on the master URL.",
              "recoveryPath": {
                "simplerExplanation": "Master URL is https://example.com/shoes.",
                "guidedFixPrompt": "Type https://example.com/shoes"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Off-Page SEO & Authority Building: Backlinks & Anchor Text Distribution",
    "overviewMetaphor": "Backlinks are Academic Citations and Votes of Peer Confidence: if 100 prestigious universities (High Domain Authority DA = 90) cite your research paper with natural, varied anchor text (60% branded 'PinIT', 20% partial keywords), Google trusts you as a world authority; if you buy 1,000 spammy backlinks with 80% identical exact-match anchor text, Google's Penguin algorithm flags an unnatural link manipulation penalty and removes you from the search index.",
    "blocks": [
      {
        "id": "dmkt-d4-b1-natural-anchor-text-distribution",
        "day": 4,
        "blockNumber": 1,
        "title": "Natural Anchor Text Profile Distribution & Google Penguin Invariants",
        "conceptBudget": {
          "primaryConcept": "Anchor Text Profile Invariants",
          "supportingTerms": [
            "Branded Anchors ($\\ge 50\\%$: e.g. 'PinIT Career OS', 'apple.com')",
            "Exact Match Anchors ($\\le 10\\%$: e.g. 'best career simulator' $\\implies$ Exceeding 10% triggers algorithm penalty)",
            "Partial Match & Semantic Anchors ($20-30\\%$)",
            "Generic Anchors ($10-15\\%$: e.g. 'click here', 'source')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d3-b1-google-core-web-vitals-benchmarks",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Anchor Text Natural Distribution Matrix",
              "boxes": [
                {
                  "label": "1. Branded Anchors",
                  "value": "60.0% (Strong corporate brand presence >= 50%)",
                  "varType": "Branded",
                  "isUpdated": false
                },
                {
                  "label": "2. Exact Match Anchors",
                  "value": "8.0% (Safe natural ratio <= 10.0% max limit)",
                  "varType": "Exact Match",
                  "isUpdated": false
                },
                {
                  "label": "3. Google Penguin Status",
                  "value": "100% HEALTHY NATURAL PROFILE (Zero algorithmic penalty!)",
                  "varType": "Health Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "anchor_audit_demo.js",
            "initialCode": "function auditAnchors(branded, exact) {\n  const isOverOptimized = exact > 10.0;\n  const isHealthy = branded >= 50.0 && !isOverOptimized;\n  return {\n    brandedPercentage: branded,\n    exactMatchPercentage: exact,\n    isHealthyProfile: isHealthy,\n    status: isHealthy ? 'NATURAL_HEALTHY_AUTHORITY_PROFILE' : 'HIGH_PENALTY_RISK_OVER_OPTIMIZED'\n  };\n}\n\nconsole.log(JSON.stringify(auditAnchors(60, 8)));\nconsole.log(JSON.stringify(auditAnchors(30, 35)));",
            "expectedOutput": "{\"brandedPercentage\":60,\"exactMatchPercentage\":8,\"isHealthyProfile\":true,\"status\":\"NATURAL_HEALTHY_AUTHORITY_PROFILE\"}\n{\"brandedPercentage\":30,\"exactMatchPercentage\":35,\"isHealthyProfile\":false,\"status\":\"HIGH_PENALTY_RISK_OVER_OPTIMIZED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum safe percentage threshold for Exact Match anchor text to avoid triggering a Google Penguin over-optimization penalty?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "10%",
            "10.0",
            "10.0%"
          ],
          "primaryMisconceptionId": "MC_DMKT_OFFPAGE_SEO_DOMAIN_AUTHORITY_BACKLINKS",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_DMKT_OFFPAGE_SEO_DOMAIN_AUTHORITY_BACKLINKS",
              "errorExplanation": "50% applies to Branded anchors. Exact match anchors must stay under 10% to look natural.",
              "recoveryPath": {
                "simplerExplanation": "Exact match must be <= 10%.",
                "guidedFixPrompt": "Type 10"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d4-b2-dofollow-vs-nofollow-backlinks",
        "day": 4,
        "blockNumber": 2,
        "title": "Dofollow vs Nofollow (rel=\"nofollow\", rel=\"sponsored\", rel=\"ugc\")",
        "conceptBudget": {
          "primaryConcept": "Dofollow vs Nofollow Link Equity",
          "supportingTerms": [
            "Dofollow (Standard hyperlink passing PageRank and ranking equity)",
            "rel=\"nofollow\" (Instructs search bots not to pass link equity)",
            "rel=\"sponsored\" (Mandatory for paid sponsorships/affiliate links)",
            "rel=\"ugc\" (User Generated Content comments)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d4-b1-natural-anchor-text-distribution",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Link Attribute Directives",
            "codeSnippet": "<a href=\"https://partner.com\" rel=\"sponsored\">Paid Partner</a>\n<a href=\"https://userblog.com\" rel=\"ugc\">User Comment</a>\n<a href=\"https://editorial.edu\">Organic Academic Citation (Passes PageRank!)</a>",
            "lineNotes": {
              "1": "Mandatory paid link tag.",
              "2": "User comment tag.",
              "3": "Dofollow editorial backlink."
            }
          },
          {
            "type": "runnable_code",
            "filename": "dofollow_demo.js",
            "initialCode": "function evaluateLinkEquity(relAttribute) {\n  return (!relAttribute || relAttribute === '')\n    ? 'PASSES_FULL_PAGERANK_EQUITY'\n    : 'NOFOLLOW_HINT_ONLY';\n}\n\nconsole.log(evaluateLinkEquity(''));\nconsole.log(evaluateLinkEquity('sponsored'));",
            "expectedOutput": "PASSES_FULL_PAGERANK_EQUITY\nNOFOLLOW_HINT_ONLY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which link type passes full PageRank equity and ranking authority from the referring domain to the target destination?",
          "expectedStringOutput": "PASSES_FULL_PAGERANK_EQUITY",
          "acceptableAnswers": [
            "PASSES_FULL_PAGERANK_EQUITY",
            "Dofollow",
            "Dofollow Link"
          ],
          "primaryMisconceptionId": "MC_DMKT_OFFPAGE_SEO_DOMAIN_AUTHORITY_BACKLINKS",
          "diagnosisMap": {
            "NOFOLLOW": {
              "misconceptionId": "MC_DMKT_OFFPAGE_SEO_DOMAIN_AUTHORITY_BACKLINKS",
              "errorExplanation": "Nofollow links do not pass PageRank equity. Standard Dofollow links pass full equity.",
              "recoveryPath": {
                "simplerExplanation": "Standard links pass full PageRank equity.",
                "guidedFixPrompt": "Type PASSES_FULL_PAGERANK_EQUITY"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d4-b3-digital-pr-link-building",
        "day": 4,
        "blockNumber": 3,
        "title": "Digital PR & Data-Driven White-Hat Link Acquisition",
        "conceptBudget": {
          "primaryConcept": "Digital PR Link Acquisition",
          "supportingTerms": [
            "Data-driven proprietary industry surveys (Journalists cite original data)",
            "Unlinked Brand Mention outreach",
            "HARO (Help A Reporter Out) expert commentary"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d4-b2-dofollow-vs-nofollow-backlinks",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "digital_pr_demo.js",
            "initialCode": "function getHighYieldLinkAsset() {\n  return 'PROPRIETARY_INDUSTRY_DATA_STUDY_WITH_INFOGRAPHIC';\n}\n\nconsole.log(getHighYieldLinkAsset());",
            "expectedOutput": "PROPRIETARY_INDUSTRY_DATA_STUDY_WITH_INFOGRAPHIC",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What content asset format generates the highest organic white-hat editorial citations from mainstream journalists and news publications?",
          "expectedStringOutput": "PROPRIETARY_INDUSTRY_DATA_STUDY_WITH_INFOGRAPHIC",
          "acceptableAnswers": [
            "PROPRIETARY_INDUSTRY_DATA_STUDY_WITH_INFOGRAPHIC",
            "Data Study",
            "Industry Data Study"
          ],
          "primaryMisconceptionId": "MC_DMKT_OFFPAGE_SEO_DOMAIN_AUTHORITY_BACKLINKS",
          "diagnosisMap": {
            "SPAM": {
              "misconceptionId": "MC_DMKT_OFFPAGE_SEO_DOMAIN_AUTHORITY_BACKLINKS",
              "errorExplanation": "Spam directories get penalized. High-yield editorial links come from original Data Studies.",
              "recoveryPath": {
                "simplerExplanation": "Matches PROPRIETARY_INDUSTRY_DATA_STUDY_WITH_INFOGRAPHIC.",
                "guidedFixPrompt": "Type PROPRIETARY_INDUSTRY_DATA_STUDY_WITH_INFOGRAPHIC"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete SEO & Organic Growth Optimization Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete sovereign search engine optimization and organic growth machine: 1. Multi-touch attribution modeling ($1,000 / 4 = $250); 2. SEO keyword opportunity scoring ($KOS = 750.0$); 3. Technical Core Web Vitals audit validation ($LCP = 1.8s, INP = 120ms, CLS = 0.05$); 4. Natural backlink anchor profile verification ($60\\% Branded, 8\\% Exact$).",
    "blocks": [
      {
        "id": "dmkt-d5-b1-seo-master-engine-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "SEO & Organic Growth Master Kernel Synthesis",
        "conceptBudget": {
          "primaryConcept": "SEO Master Kernel Synthesis",
          "supportingTerms": [
            "Attribution Engine",
            "Keyword Opportunity Engine",
            "Core Web Vitals Validator",
            "Backlink Profile Auditor"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d4-b3-digital-pr-link-building",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 SEO & Organic Growth Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Evaluates Multi-Touch Attribution ($250 per channel)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Scores Keyword Opportunity ($KOS = 750.0$ high yield)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Audits Core Web Vitals ($LCP \\le 2.5s, INP \\le 200ms, CLS \\le 0.1$)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Validates Natural Backlink Profile and certifies SEO engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "seo_master_kernel_demo.js",
            "initialCode": "function runSeoOrganicGrowthEngine() {\n  return {\n    attributionSubsystem: 'ONLINE_LINEAR_ATTRIBUTION_ACTIVE',\n    keywordSubsystem: 'ONLINE_KOS_SCORER_ACTIVE',\n    cwvSubsystem: 'ONLINE_CORE_WEB_VITALS_ACTIVE',\n    backlinkSubsystem: 'ONLINE_ANCHOR_AUDITOR_ACTIVE',\n    engineStatus: 'SEO_ORGANIC_GROWTH_MASTER_KERNEL_ACTIVE_NOMINAL'\n  };\n}\n\nconsole.log(runSeoOrganicGrowthEngine().engineStatus);",
            "expectedOutput": "SEO_ORGANIC_GROWTH_MASTER_KERNEL_ACTIVE_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the SEO & Organic Growth Master Kernel?",
          "expectedStringOutput": "SEO_ORGANIC_GROWTH_MASTER_KERNEL_ACTIVE_NOMINAL",
          "acceptableAnswers": [
            "SEO_ORGANIC_GROWTH_MASTER_KERNEL_ACTIVE_NOMINAL",
            "engineStatus: SEO_ORGANIC_GROWTH_MASTER_KERNEL_ACTIVE_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_DMKT_SEO_KEYWORD_SEARCH_INTENT_DIFFICULTY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DMKT_SEO_KEYWORD_SEARCH_INTENT_DIFFICULTY",
              "errorExplanation": "Matches SEO_ORGANIC_GROWTH_MASTER_KERNEL_ACTIVE_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type SEO_ORGANIC_GROWTH_MASTER_KERNEL_ACTIVE_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d5-b2-seo-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "SEO Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "SEO Invariant Verification",
          "supportingTerms": [
            "KOS Invariant",
            "CWV Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d5-b1-seo-master-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "seo_audit_demo.js",
            "initialCode": "function auditSeoEngine(attrValid, kwValid, cwvValid, linkValid) {\n  const passed = attrValid && kwValid && cwvValid && linkValid;\n  return {\n    attributionVerified: attrValid,\n    keywordVerified: kwValid,\n    cwvVerified: cwvValid,\n    backlinkVerified: linkValid,\n    grade: passed ? 'SEO_GROWTH_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditSeoEngine(true, true, true, true)));",
            "expectedOutput": "{\"attributionVerified\":true,\"keywordVerified\":true,\"cwvVerified\":true,\"backlinkVerified\":true,\"grade\":\"SEO_GROWTH_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Attribution, Keyword, Core Web Vitals, and Backlink engines pass 100%?",
          "expectedStringOutput": "SEO_GROWTH_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "SEO_GROWTH_ENGINE_AUDIT_PASSED",
            "grade\":\"SEO_GROWTH_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_DMKT_SEO_KEYWORD_SEARCH_INTENT_DIFFICULTY",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DMKT_SEO_KEYWORD_SEARCH_INTENT_DIFFICULTY",
              "errorExplanation": "All checks passing awards SEO_GROWTH_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards SEO_GROWTH_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type SEO_GROWTH_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d5-b3-milestone1-dmkt-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 SEO & Organic Growth Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "SEO Growth Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d5-b2-seo-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_dmkt_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete SEO & Organic Growth Optimization Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete SEO & Organic Growth Optimization Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete SEO & Organic Growth Optimization Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete SEO & Organic Growth Optimization Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DMKT_SEO_KEYWORD_SEARCH_INTENT_DIFFICULTY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DMKT_SEO_KEYWORD_SEARCH_INTENT_DIFFICULTY",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete SEO & Organic Growth Optimization Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Content Marketing & Topic Clusters: The Pillar-Cluster Model",
    "overviewMetaphor": "The Pillar-Cluster Model is the Hub and Spokes of a High-Speed Bicycle Wheel: The central Pillar Page (The Hub: A massive 4,000-word definitive guide on 'Digital Marketing') is surrounded by 8 specialized Sub-Topic Cluster Articles (The Spokes: 'Technical SEO', 'Meta Ads', 'Google Ads Auction', 'Email DMARC'); each cluster article links directly back to the central hub, channeling 16 internal PageRank links that signal supreme topical authority to Google.",
    "blocks": [
      {
        "id": "dmkt-d6-b1-pillar-cluster-link-architecture",
        "day": 6,
        "blockNumber": 1,
        "title": "The Topic Cluster Model: Pillar Pages, Cluster Spokes & Link Equity",
        "conceptBudget": {
          "primaryConcept": "Topic Cluster Internal Link Model",
          "supportingTerms": [
            "Pillar Page (Broad comprehensive category guide)",
            "Cluster Spokes (8+ focused sub-topic articles)",
            "Bidirectional Internal Links: Cluster $\\to$ Pillar, Pillar $\\to$ Cluster",
            "Total Link Equity = $\\text{Cluster Count} \\times \\text{Links per Article} = 8 \\times 2 = 16$ links"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d1-b1-linear-attribution-model",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Topic Cluster Architecture (8 Cluster Articles, 2 Links each)",
              "boxes": [
                {
                  "label": "Central Pillar Page (Hub)",
                  "value": "'The Ultimate Guide to Digital Marketing 2026' (4,000 words)",
                  "varType": "Pillar Hub",
                  "isUpdated": false
                },
                {
                  "label": "Sub-Topic Spokes (8 Articles)",
                  "value": "8 In-depth articles covering SEO, PPC, CRO, Email, Analytics...",
                  "varType": "Cluster Spokes",
                  "isUpdated": false
                },
                {
                  "label": "Internal Link Authority",
                  "value": "8 x 2 = 16 Direct Hyperlinks channeling PageRank to Pillar!",
                  "varType": "Link Equity",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cluster_calc_demo.js",
            "initialCode": "function calculateClusterEquity(clusterCount, linksPerArticle) {\n  const total = clusterCount * linksPerArticle;\n  return {\n    clusterArticlesCount: clusterCount,\n    linksPerArticle,\n    totalLinksToPillar: total,\n    isTopicAuthority: clusterCount >= 6,\n    status: 'CLUSTER_EQUITY_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateClusterEquity(8, 2)));",
            "expectedOutput": "{\"clusterArticlesCount\":8,\"linksPerArticle\":2,\"totalLinksToPillar\":16,\"isTopicAuthority\":true,\"status\":\"CLUSTER_EQUITY_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total internal links point to the central pillar page in a topic cluster containing 8 cluster articles with 2 links each ($8 \\times 2$)?",
          "expectedStringOutput": "16",
          "acceptableAnswers": [
            "16",
            "16 links",
            "totalLinksToPillar\":16"
          ],
          "primaryMisconceptionId": "MC_DMKT_CONTENT_MARKETING_TOPIC_CLUSTERS_PILLARS",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_DMKT_CONTENT_MARKETING_TOPIC_CLUSTERS_PILLARS",
              "errorExplanation": "10 is 8 + 2. Link equity multiplies articles by links per article: 8 * 2 = 16.",
              "recoveryPath": {
                "simplerExplanation": "8 * 2 = 16.",
                "guidedFixPrompt": "Type 16"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d6-b2-google-eeat-quality-guidelines",
        "day": 6,
        "blockNumber": 2,
        "title": "Google's E-E-A-T Quality Framework: Experience, Expertise, Authoritativeness & Trust",
        "conceptBudget": {
          "primaryConcept": "Google E-E-A-T Framework",
          "supportingTerms": [
            "Experience (First-hand, real-world user experience with product/topic)",
            "Expertise (Formal credentials and subject matter depth)",
            "Authoritativeness (Reputation as the go-to source in the field)",
            "Trustworthiness (The central, most vital pillar: Accuracy, transparency, safety)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d6-b1-pillar-cluster-link-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "E-E-A-T 4 Pillars",
            "codeSnippet": "// EXPERIENCE:        Author shares actual hands-on test screenshots & data logs\n// EXPERTISE:         Author is a certified CPA / Cloud Architect\n// AUTHORITATIVENESS: Industry peers frequently cite and quote the website\n// TRUSTWORTHINESS:   Clear refund policies, secure HTTPS, transparent disclosures!",
            "lineNotes": {
              "1": "First-hand proof.",
              "2": "Credentials.",
              "3": "Industry citations.",
              "4": "Foundational trust."
            }
          },
          {
            "type": "runnable_code",
            "filename": "eeat_demo.js",
            "initialCode": "function getEeatCorePillars() {\n  return ['EXPERIENCE', 'EXPERTISE', 'AUTHORITATIVENESS', 'TRUSTWORTHINESS'];\n}\n\nconsole.log(JSON.stringify(getEeatCorePillars()));",
            "expectedOutput": "[\"EXPERIENCE\",\"EXPERTISE\",\"AUTHORITATIVENESS\",\"TRUSTWORTHINESS\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which pillar is recognized as the most critical central foundation in Google's E-E-A-T search quality rating guidelines?",
          "expectedStringOutput": "TRUSTWORTHINESS",
          "acceptableAnswers": [
            "TRUSTWORTHINESS",
            "Trust",
            "Trustworthiness"
          ],
          "primaryMisconceptionId": "MC_DMKT_CONTENT_MARKETING_TOPIC_CLUSTERS_PILLARS",
          "diagnosisMap": {
            "EXPERIENCE": {
              "misconceptionId": "MC_DMKT_CONTENT_MARKETING_TOPIC_CLUSTERS_PILLARS",
              "errorExplanation": "Experience is important, but Google explicitly states Trustworthiness is the central most vital pillar.",
              "recoveryPath": {
                "simplerExplanation": "Most vital pillar is Trustworthiness.",
                "guidedFixPrompt": "Type TRUSTWORTHINESS"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d6-b3-content-repurposing-flywheel",
        "day": 6,
        "blockNumber": 3,
        "title": "The Content Repurposing Multiplier (1 Core Asset $\\to$ 5 Channel Formats)",
        "conceptBudget": {
          "primaryConcept": "Content Repurposing Multiplier",
          "supportingTerms": [
            "Core Asset (1 Long-form pillar blog post / podcast)",
            "Derivatives: 1. LinkedIn carousel, 2. YouTube Short / Reel, 3. Email newsletter digest, 4. Twitter/X thread, 5. SlideShare deck",
            "5x distribution leverage from 1 production effort"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d6-b2-google-eeat-quality-guidelines",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "repurpose_demo.js",
            "initialCode": "function calculateRepurposingMultiplier(coreAssetsCount, derivativesPerAsset) {\n  return coreAssetsCount * derivativesPerAsset;\n}\n\nconsole.log(calculateRepurposingMultiplier(4, 5));",
            "expectedOutput": "20",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total multichannel promotional assets are generated each month from 4 core pillar articles when each article is repurposed into 5 derivative formats ($4 \\times 5$)?",
          "expectedStringOutput": "20",
          "acceptableAnswers": [
            "20",
            "20 assets",
            "20 formats"
          ],
          "primaryMisconceptionId": "MC_DMKT_CONTENT_MARKETING_TOPIC_CLUSTERS_PILLARS",
          "diagnosisMap": {
            "9": {
              "misconceptionId": "MC_DMKT_CONTENT_MARKETING_TOPIC_CLUSTERS_PILLARS",
              "errorExplanation": "9 adds 4 and 5. The repurposing multiplier is 4 * 5 = 20 assets.",
              "recoveryPath": {
                "simplerExplanation": "4 * 5 = 20.",
                "guidedFixPrompt": "Type 20"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Google Search Ads (SEM) & The Ad Rank Auction Formula",
    "overviewMetaphor": "The Google Ads Auction is a Brains-Over-Money Tournament: a dumb competitor with a poor ad and terrible landing page (Quality Score = 3) might bid $10.00 to achieve an Ad Rank of 30 ($10 \\times 3$); your brilliantly written ad and lightning-fast landing page (Quality Score = 10) only bids $5.00 to achieve an Ad Rank of 50 ($5 \\times 10$); because your Ad Rank is higher, you win the #1 spot on Google, and the Vickrey auction pricing algorithm charges you only $3.01 ($Actual CPC = \\frac{30}{10} + \\$0.01$), saving you $1.99 on every click!",
    "blocks": [
      {
        "id": "dmkt-d7-b1-ad-rank-and-actual-cpc-auction",
        "day": 7,
        "blockNumber": 1,
        "title": "Google Ads Ad Rank & Actual CPC Formula: $Actual CPC = \\frac{\\text{AdRank}_{\\text{below}}}{\\text{QS}_{\\text{you}}} + \\$0.01$",
        "conceptBudget": {
          "primaryConcept": "Ad Rank & Actual CPC Formulas",
          "supportingTerms": [
            "$AdRank = Max CPC \\times Quality Score$",
            "Quality Score ($QS: 1-10$ based on CTR, Relevance, Landing Page)",
            "Actual CPC Formula: $Actual CPC = \\frac{\\text{Ad Rank of Competitor Below}}{\\text{Your Quality Score}} + \\$0.01$",
            "$Max CPC = \\$5.00, QS = 10, AdRank_{below} = 30.0 \\implies Actual CPC = \\frac{30}{10} + 0.01 = \\$3.01$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d6-b1-pillar-cluster-link-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Google Ads Auction Ledger (Max CPC = $5.00, QS = 10, Competitor AdRank = 30.0)",
              "boxes": [
                {
                  "label": "Your Ad Rank Score",
                  "value": "$5.00 Max Bid x 10 Quality Score = 50.00 Ad Rank (#1 POSITION!)",
                  "varType": "Ad Rank",
                  "isUpdated": false
                },
                {
                  "label": "Competitor Below Ad Rank",
                  "value": "30.00 Ad Rank (Bid $10.00 x QS 3)",
                  "varType": "Competitor Rank",
                  "isUpdated": false
                },
                {
                  "label": "Actual CPC Charged by Google",
                  "value": "(30.00 / 10) + $0.01 = $3.00 + $0.01 = $3.01 Actual CPC (SAVED $1.99/CLICK!)",
                  "varType": "Actual CPC",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ad_auction_calc_demo.js",
            "initialCode": "function calculateAdAuction(maxCpc, qs, nextAdRank) {\n  const yourAdRank = maxCpc * qs;\n  const actualCpc = (nextAdRank / qs) + 0.01;\n  return {\n    maxBid: maxCpc,\n    qualityScore: qs,\n    yourAdRank: Number(yourAdRank.toFixed(2)),\n    actualCpcCharged: Number(actualCpc.toFixed(2)),\n    cpcSavings: Number((maxCpc - actualCpc).toFixed(2)),\n    status: 'AUCTION_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateAdAuction(5.0, 10, 30.0)));",
            "expectedOutput": "{\"maxBid\":5,\"qualityScore\":10,\"yourAdRank\":50,\"actualCpcCharged\":3.01,\"cpcSavings\":1.99,\"status\":\"AUCTION_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Actual CPC is charged by Google when your Quality Score is 10 and the competitor directly below you has an Ad Rank of 30.0 ($ (30 / 10) + 0.01 $)?",
          "expectedStringOutput": "3.01",
          "acceptableAnswers": [
            "3.01",
            "$3.01",
            "actualCpcCharged\":3.01"
          ],
          "primaryMisconceptionId": "MC_DMKT_SEM_GOOGLE_ADS_AUCTION_QUALITY_SCORE",
          "diagnosisMap": {
            "5.00": {
              "misconceptionId": "MC_DMKT_SEM_GOOGLE_ADS_AUCTION_QUALITY_SCORE",
              "errorExplanation": "$5.00 is your Max CPC bid. Google's second-price auction charges (30 / 10) + $0.01 = $3.01.",
              "recoveryPath": {
                "simplerExplanation": "30 / 10 + 0.01 = 3.01.",
                "guidedFixPrompt": "Type 3.01"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d7-b2-quality-score-three-components",
        "day": 7,
        "blockNumber": 2,
        "title": "The 3 Components of Google Ads Quality Score",
        "conceptBudget": {
          "primaryConcept": "Quality Score 3 Components",
          "supportingTerms": [
            "1. Expected Click-Through Rate (Historical likelihood of ad clicks)",
            "2. Ad Relevance (Keyword semantic alignment with ad copy text)",
            "3. Landing Page Experience (Speed, mobile responsiveness, transparent content)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d7-b1-ad-rank-and-actual-cpc-auction",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Quality Score Component Weights",
            "codeSnippet": "// 1. EXPECTED CTR:            High ad copy appeal & compelling CTA\n// 2. AD RELEVANCE:            Exact keyword match in headline 1 & 2\n// 3. LANDING PAGE EXPERIENCE: Fast load time (<2.5s) & keyword-aligned landing page content!",
            "lineNotes": {
              "1": "CTR prediction.",
              "2": "Relevance alignment.",
              "3": "Post-click UX."
            }
          },
          {
            "type": "runnable_code",
            "filename": "qs_demo.js",
            "initialCode": "function evaluateQualityScore(ctrAboveAvg, relAboveAvg, landingAboveAvg) {\n  let qs = 4;\n  if (ctrAboveAvg) qs += 2;\n  if (relAboveAvg) qs += 2;\n  if (landingAboveAvg) qs += 2;\n  return {\n    qualityScore: qs,\n    isTopTier: qs >= 8,\n    status: 'QS_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateQualityScore(true, true, true)));",
            "expectedOutput": "{\"qualityScore\":10,\"isTopTier\":true,\"status\":\"QS_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum Quality Score rating achievable in Google Ads when Expected CTR, Ad Relevance, and Landing Page Experience are all rated 'Above Average'?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "10/10",
            "qualityScore\":10"
          ],
          "primaryMisconceptionId": "MC_DMKT_SEM_GOOGLE_ADS_AUCTION_QUALITY_SCORE",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_DMKT_SEM_GOOGLE_ADS_AUCTION_QUALITY_SCORE",
              "errorExplanation": "Quality score is on a 1 to 10 scale, not a 1 to 100 percentage scale.",
              "recoveryPath": {
                "simplerExplanation": "Top Quality Score is 10.",
                "guidedFixPrompt": "Type 10"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d7-b3-negative-keywords-spend-protection",
        "day": 7,
        "blockNumber": 3,
        "title": "Negative Keywords & Eliminating Wasteful Non-Converting Ad Spend",
        "conceptBudget": {
          "primaryConcept": "Negative Keyword List Invariant",
          "supportingTerms": [
            "Negative Keywords (Preventing ads from showing for irrelevant search queries e.g. adding -'free', -'jobs', -'download')",
            "Saves 20-40% of ad budget from accidental non-buyer clicks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d7-b2-quality-score-three-components",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "negative_kw_demo.js",
            "initialCode": "function shouldServeAd(searchQuery, negativeList) {\n  const words = searchQuery.toLowerCase().split(' ');\n  const isBlocked = negativeList.some(neg => words.includes(neg.toLowerCase()));\n  return isBlocked ? 'BLOCKED_BY_NEGATIVE_KEYWORD' : 'SERVE_PAID_SEARCH_AD';\n}\n\nconsole.log(shouldServeAd('accounting software free download', ['free', 'torrent', 'crack']));\nconsole.log(shouldServeAd('accounting software enterprise pricing', ['free', 'torrent', 'crack']));",
            "expectedOutput": "BLOCKED_BY_NEGATIVE_KEYWORD\nSERVE_PAID_SEARCH_AD",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action occurs when a user searches 'accounting software free download' and 'free' is configured on your campaign's Negative Keyword list?",
          "expectedStringOutput": "BLOCKED_BY_NEGATIVE_KEYWORD",
          "acceptableAnswers": [
            "BLOCKED_BY_NEGATIVE_KEYWORD",
            "Blocked",
            "Ad Blocked"
          ],
          "primaryMisconceptionId": "MC_DMKT_SEM_GOOGLE_ADS_AUCTION_QUALITY_SCORE",
          "diagnosisMap": {
            "SERVE": {
              "misconceptionId": "MC_DMKT_SEM_GOOGLE_ADS_AUCTION_QUALITY_SCORE",
              "errorExplanation": "Negative keywords prevent ads from serving to eliminate wasteful spend.",
              "recoveryPath": {
                "simplerExplanation": "Matches BLOCKED_BY_NEGATIVE_KEYWORD.",
                "guidedFixPrompt": "Type BLOCKED_BY_NEGATIVE_KEYWORD"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "PPC Bidding Strategies: Target CPA & Return on Ad Spend (ROAS)",
    "overviewMetaphor": "ROAS is the Multiplier on a Casino Slot Machine Where You Know the Exact Odds: Return on Ad Spend ($ROAS = \\frac{\\text{Revenue}}{\\text{Spend}} \\times 100\\%$) measures how many dollars of sales return for every dollar fed into advertising; if spending $5,000 generates $25,000 in e-commerce revenue, your ROAS is 500% ($5.0\\times$ return); if your product has a 40% gross margin, your Break-Even ROAS threshold is $BE\\text{ ROAS} = \\frac{1}{0.40} = 250\\%$—proving your 500% campaign is producing massive net cash profits.",
    "blocks": [
      {
        "id": "dmkt-d8-b1-roas-and-break-even-margin",
        "day": 8,
        "blockNumber": 1,
        "title": "ROAS Formula & The Break-Even ROAS Threshold: $BE\\text{ ROAS} = \\frac{1}{\\text{GM}\\%}$",
        "conceptBudget": {
          "primaryConcept": "ROAS & Break-Even Margin Formula",
          "supportingTerms": [
            "$ROAS = \\frac{\\text{Revenue}}{\\text{Ad Spend}} \\times 100\\%$",
            "$BE\\text{ ROAS} = \\frac{1}{\\text{Gross Margin}\\%} \\times 100\\%$",
            "Spend = $5,000, Rev = $25,000 \\implies ROAS = 500\\%$",
            "$GM = 40\\% \\implies BE\\text{ ROAS} = \\frac{1}{0.40} = 250\\%$ (500% > 250% $\\implies$ High Profitability!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d7-b1-ad-rank-and-actual-cpc-auction",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ROAS Financial Balance Sheet ($5k Spend, $25k Revenue, 40% Margin)",
              "boxes": [
                {
                  "label": "Revenue Generated",
                  "value": "$25,000 Gross Sales generated from $5,000 ad spend",
                  "varType": "Revenue",
                  "isUpdated": false
                },
                {
                  "label": "Campaign ROAS %",
                  "value": "($25,000 / $5,000) x 100 = 500.00% ROAS (5.0x return!)",
                  "varType": "ROAS",
                  "isUpdated": false
                },
                {
                  "label": "Break-Even Threshold",
                  "value": "1 / 0.40 = 250.00% BE ROAS (500% > 250% -> HIGHLY VALUE ACCRETIVE!)",
                  "varType": "Break-Even",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "roas_calc_demo.js",
            "initialCode": "function calculateRoasMetrics(spend, revenue, grossMarginPct) {\n  const roas = (revenue / spend) * 100;\n  const beRoas = (1 / (grossMarginPct / 100)) * 100;\n  return {\n    spend,\n    revenue,\n    roasPercent: Number(roas.toFixed(2)),\n    breakEvenRoasPercent: Number(beRoas.toFixed(2)),\n    isProfitable: roas >= beRoas,\n    status: 'ROAS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateRoasMetrics(5000, 25000, 40)));",
            "expectedOutput": "{\"spend\":5000,\"revenue\":25000,\"roasPercent\":500,\"breakEvenRoasPercent\":250,\"isProfitable\":true,\"status\":\"ROAS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Return on Ad Spend (ROAS) percentage when a $5,000 ad budget produces $25,000 in trackable e-commerce sales ($ (25,000 / 5,000) \\times 100 $)?",
          "expectedStringOutput": "500",
          "acceptableAnswers": [
            "500",
            "500%",
            "500.0",
            "roasPercent\":500"
          ],
          "primaryMisconceptionId": "MC_DMKT_PPC_BIDDING_TARGET_CPA_TARGET_ROAS",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_DMKT_PPC_BIDDING_TARGET_CPA_TARGET_ROAS",
              "errorExplanation": "5 is the multiplier ratio (5.0x). As a percentage, ROAS is 500%.",
              "recoveryPath": {
                "simplerExplanation": "25,000 / 5,000 * 100 = 500%.",
                "guidedFixPrompt": "Type 500"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d8-b2-smart-bidding-target-cpa",
        "day": 8,
        "blockNumber": 2,
        "title": "Smart Bidding: Target CPA (Cost-Per-Acquisition) Machine Learning",
        "conceptBudget": {
          "primaryConcept": "Target CPA Bidding Strategy",
          "supportingTerms": [
            "Target CPA (Setting a maximum target acquisition cost e.g. $50/customer)",
            "Google/Meta ML bids dynamically in real time based on user device, location, browsing history, and intent signals"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d8-b1-roas-and-break-even-margin",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Bidding Strategy Selection",
            "codeSnippet": "// E-commerce with variable cart values? -> TARGET_ROAS_MAXIMIZE_REVENUE_VALUE\n// Lead gen with fixed value per lead?   -> TARGET_CPA_MAXIMIZE_CONVERSION_VOLUME",
            "lineNotes": {
              "1": "Revenue optimization.",
              "2": "Volume cost ceiling."
            }
          },
          {
            "type": "runnable_code",
            "filename": "bidding_strategy_demo.js",
            "initialCode": "function selectBiddingStrategy(hasVariableCartValues) {\n  return hasVariableCartValues\n    ? 'TARGET_ROAS_VALUE_BASED_BIDDING'\n    : 'TARGET_CPA_VOLUME_BASED_BIDDING';\n}\n\nconsole.log(selectBiddingStrategy(true));\nconsole.log(selectBiddingStrategy(false));",
            "expectedOutput": "TARGET_ROAS_VALUE_BASED_BIDDING\nTARGET_CPA_VOLUME_BASED_BIDDING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which smart bidding strategy is optimal for e-commerce retailers where order basket values vary widely across transactions?",
          "expectedStringOutput": "TARGET_ROAS_VALUE_BASED_BIDDING",
          "acceptableAnswers": [
            "TARGET_ROAS_VALUE_BASED_BIDDING",
            "Target ROAS",
            "Value Based Bidding"
          ],
          "primaryMisconceptionId": "MC_DMKT_PPC_BIDDING_TARGET_CPA_TARGET_ROAS",
          "diagnosisMap": {
            "TARGET_CPA": {
              "misconceptionId": "MC_DMKT_PPC_BIDDING_TARGET_CPA_TARGET_ROAS",
              "errorExplanation": "Target CPA treats all conversions equally. Variable order values require Target ROAS value-based bidding.",
              "recoveryPath": {
                "simplerExplanation": "Variable cart values require Target ROAS.",
                "guidedFixPrompt": "Type TARGET_ROAS_VALUE_BASED_BIDDING"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d8-b3-ad-spend-scaling-diminishing-returns",
        "day": 8,
        "blockNumber": 3,
        "title": "Scaling Ad Spend & The Law of Diminishing Marginal Returns",
        "conceptBudget": {
          "primaryConcept": "Diminishing Marginal Ad Returns",
          "supportingTerms": [
            "Scaling ad spend too fast ($5k \\to $50k$) saturates audience and increases CPA",
            "Vertical Scaling (Increasing budget 20% every 3 days) vs Horizontal Scaling (Expanding lookalikes & new creatives)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d8-b2-smart-bidding-target-cpa",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "scaling_demo.js",
            "initialCode": "function evaluateBudgetScale(dailyBudgetIncreasePct) {\n  return dailyBudgetIncreasePct <= 20.0\n    ? 'SAFE_CONTROLLED_SCALING_PRESERVES_ALGORITHM_LEARNING'\n    : 'AGGRESSIVE_SCALE_RESETS_LEARNING_PHASE_SPIKES_CPA';\n}\n\nconsole.log(evaluateBudgetScale(15.0));\nconsole.log(evaluateBudgetScale(100.0));",
            "expectedOutput": "SAFE_CONTROLLED_SCALING_PRESERVES_ALGORITHM_LEARNING\nAGGRESSIVE_SCALE_RESETS_LEARNING_PHASE_SPIKES_CPA",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum safe percentage to increase ad campaign budgets without resetting machine learning optimization algorithms?",
          "expectedStringOutput": "20",
          "acceptableAnswers": [
            "20",
            "20%",
            "20.0",
            "20% every 3 days"
          ],
          "primaryMisconceptionId": "MC_DMKT_PPC_BIDDING_TARGET_CPA_TARGET_ROAS",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_DMKT_PPC_BIDDING_TARGET_CPA_TARGET_ROAS",
              "errorExplanation": "Doubling budget (100%) resets the learning phase and spikes CPA. Safe scaling increases by <= 20%.",
              "recoveryPath": {
                "simplerExplanation": "Safe scaling limit is 20%.",
                "guidedFixPrompt": "Type 20"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Meta Ads (Facebook/Instagram): Pixel Tracking & Lookalike Audiences",
    "overviewMetaphor": "Meta Lookalike Audiences are Finding Clones of Your Highest-Spending VIP Customers: If you upload a seed list of 1,000 customers who spent $500+ on your store, Meta's algorithm analyzes 10,000 behavioral data points across 200,000,000 users; building a 1.0% Lookalike Audience extracts the top 2,000,000 people in the nation who look, think, and buy exactly like your best VIPs.",
    "blocks": [
      {
        "id": "dmkt-d9-b1-meta-lookalike-audience-reach",
        "day": 9,
        "blockNumber": 1,
        "title": "Meta Lookalike Audiences (1% vs 2% vs 5% Reach & Match Quality)",
        "conceptBudget": {
          "primaryConcept": "Lookalike Audience Calculation",
          "supportingTerms": [
            "Seed Audience (1,000+ highest-LTV purchasers)",
            "1% Lookalike (Top 1% of population closest to seed: Highest match quality, lowest CPA)",
            "Reach Formula: $\\text{Population} \\times \\text{LAL}\\%$ e.g. $200\\text{M} \\times 1\\% = 2,000,000$ users"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d8-b1-roas-and-break-even-margin",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Meta Lookalike Tier Comparison (Population = 200,000,000)",
              "boxes": [
                {
                  "label": "1% Lookalike Tier",
                  "value": "200,000,000 x 1.0% = 2,000,000 Users (HIGHEST SIMILARITY & CONVERSION!)",
                  "varType": "1% LAL",
                  "isUpdated": true
                },
                {
                  "label": "2% Lookalike Tier",
                  "value": "200,000,000 x 2.0% = 4,000,000 Users (Balanced Scale & Match)",
                  "varType": "2% LAL",
                  "isUpdated": false
                },
                {
                  "label": "5% Lookalike Tier",
                  "value": "200,000,000 x 5.0% = 10,000,000 Users (Broad Scale Reach)",
                  "varType": "5% LAL",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "lal_calc_demo.js",
            "initialCode": "function calculateLalAudience(population, pct) {\n  const reach = population * (pct / 100);\n  return {\n    population,\n    lalPercentage: pct,\n    audienceSize: Math.round(reach),\n    matchTier: pct === 1.0 ? '1_PERCENT_HIGHEST_SIMILARITY' : 'BROAD_SCALE',\n    status: 'LAL_AUDIENCE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateLalAudience(200000000, 1.0)));",
            "expectedOutput": "{\"population\":200000000,\"lalPercentage\":1,\"audienceSize\":2000000,\"matchTier\":\"1_PERCENT_HIGHEST_SIMILARITY\",\"status\":\"LAL_AUDIENCE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the estimated audience size for a 1.0% Lookalike Audience in a country with 200,000,000 total social media users ($200,000,000 \\times 0.01$)?",
          "expectedStringOutput": "2000000",
          "acceptableAnswers": [
            "2000000",
            "2,000,000",
            "2 million",
            "audienceSize\":2000000"
          ],
          "primaryMisconceptionId": "MC_DMKT_SMM_META_LOOKALIKE_AUDIENCES_PIXEL",
          "diagnosisMap": {
            "200000": {
              "misconceptionId": "MC_DMKT_SMM_META_LOOKALIKE_AUDIENCES_PIXEL",
              "errorExplanation": "200,000 is 0.1%. 1.0% of 200,000,000 is 2,000,000 users.",
              "recoveryPath": {
                "simplerExplanation": "200,000,000 * 0.01 = 2,000,000.",
                "guidedFixPrompt": "Type 2000000"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d9-b2-conversions-api-capi-server-side",
        "day": 9,
        "blockNumber": 2,
        "title": "Meta Conversions API (CAPI) & Server-Side Event Tracking",
        "conceptBudget": {
          "primaryConcept": "Conversions API (CAPI) Architecture",
          "supportingTerms": [
            "Browser Pixel (Blocked by iOS 14.5+ ATT and ad blockers)",
            "Conversions API (CAPI: Direct server-to-server event payload transmission)",
            "Event Deduplication (Matching browser `event_id` with server `event_id`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d9-b1-meta-lookalike-audience-reach",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CAPI Server-Side Event Pipeline",
            "codeSnippet": "// 1. Browser Event fires -> Generates unique event_id: 'evt_987654'\n// 2. Server Event fires  -> Sends exact same event_id: 'evt_987654' to Meta Graph API\n// 3. Meta Deduplication Engine matches IDs -> 100% event capture with 0 duplicate counts!",
            "lineNotes": {
              "1": "Client side fire.",
              "2": "Server side bypass.",
              "3": "Deduplication invariant."
            }
          },
          {
            "type": "runnable_code",
            "filename": "capi_demo.js",
            "initialCode": "function evaluateEventCapture(hasCapi) {\n  return hasCapi\n    ? 'FULL_SERVER_SIDE_CAPI_100_PERCENT_CAPTURE'\n    : 'BROWSER_PIXEL_ONLY_30_PERCENT_DATA_LOSS';\n}\n\nconsole.log(evaluateEventCapture(true));\nconsole.log(evaluateEventCapture(false));",
            "expectedOutput": "FULL_SERVER_SIDE_CAPI_100_PERCENT_CAPTURE\nBROWSER_PIXEL_ONLY_30_PERCENT_DATA_LOSS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What tracking infrastructure bypasses browser ad-blockers and iOS privacy restrictions by streaming conversion events directly from server to Meta's Graph API?",
          "expectedStringOutput": "FULL_SERVER_SIDE_CAPI_100_PERCENT_CAPTURE",
          "acceptableAnswers": [
            "FULL_SERVER_SIDE_CAPI_100_PERCENT_CAPTURE",
            "Conversions API",
            "CAPI",
            "Server-Side CAPI"
          ],
          "primaryMisconceptionId": "MC_DMKT_SMM_META_LOOKALIKE_AUDIENCES_PIXEL",
          "diagnosisMap": {
            "PIXEL": {
              "misconceptionId": "MC_DMKT_SMM_META_LOOKALIKE_AUDIENCES_PIXEL",
              "errorExplanation": "Browser pixels are blocked by iOS. Server-side transmission uses Meta's Conversions API (CAPI).",
              "recoveryPath": {
                "simplerExplanation": "Matches FULL_SERVER_SIDE_CAPI_100_PERCENT_CAPTURE.",
                "guidedFixPrompt": "Type FULL_SERVER_SIDE_CAPI_100_PERCENT_CAPTURE"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d9-b3-ad-creative-fatigue-refresh",
        "day": 9,
        "blockNumber": 3,
        "title": "Social Creative Fatigue & Automated Dynamic Creative Optimization (DCO)",
        "conceptBudget": {
          "primaryConcept": "Ad Fatigue Mitigation & DCO",
          "supportingTerms": [
            "Ad Fatigue (Audience has seen ad 4+ times $\\implies$ CTR drops, CPA triples)",
            "Dynamic Creative Optimization (DCO: Testing 5 headlines, 5 videos, and 5 CTAs automatically)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d9-b2-conversions-api-capi-server-side",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dco_demo.js",
            "initialCode": "function calculateDcoCombinations(headlines, creatives, ctas) {\n  return headlines * creatives * ctas;\n}\n\nconsole.log(calculateDcoCombinations(5, 5, 5));",
            "expectedOutput": "125",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many unique automated ad variants are synthesized by Dynamic Creative Optimization (DCO) when testing 5 headlines, 5 video creatives, and 5 CTA buttons ($5 \\times 5 \\times 5$)?",
          "expectedStringOutput": "125",
          "acceptableAnswers": [
            "125",
            "125 variants",
            "125 combinations"
          ],
          "primaryMisconceptionId": "MC_DMKT_SMM_META_LOOKALIKE_AUDIENCES_PIXEL",
          "diagnosisMap": {
            "15": {
              "misconceptionId": "MC_DMKT_SMM_META_LOOKALIKE_AUDIENCES_PIXEL",
              "errorExplanation": "15 is 5 + 5 + 5. DCO creates permutations by multiplying: 5 * 5 * 5 = 125 variants.",
              "recoveryPath": {
                "simplerExplanation": "5 * 5 * 5 = 125.",
                "guidedFixPrompt": "Type 125"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "LinkedIn B2B Advertising & Account-Based Marketing (ABM)",
    "overviewMetaphor": "LinkedIn B2B Advertising is a Laser-Guided Missile Directed at the Executive Boardroom: Account-Based Marketing (ABM) uploads a target list of 1,000 specific Fortune 500 companies; Matched Audiences cross-references the list against 1 billion professional profiles, achieving an 80.0% match rate (800 verified enterprise accounts); ads are served exclusively to Vice Presidents of IT and CFOs with budget sign-off authority.",
    "blocks": [
      {
        "id": "dmkt-d10-b1-abm-matched-audiences-match-rate",
        "day": 10,
        "blockNumber": 1,
        "title": "Account-Based Marketing (ABM) & LinkedIn Matched Audiences Match Rate",
        "conceptBudget": {
          "primaryConcept": "ABM Match Rate Calculation",
          "supportingTerms": [
            "Uploaded Target Account List ($1,000$ companies)",
            "Matched Enterprise Accounts ($800$ companies $\\implies 80.0\\%$ Match Rate)",
            "Targeting criteria: Job Function (Engineering), Seniority (VP, C-Suite), Company Size ($1,000+$ employees)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d9-b1-meta-lookalike-audience-reach",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "LinkedIn ABM Campaign Architecture",
              "boxes": [
                {
                  "label": "Target Account List",
                  "value": "1,000 Target Enterprise Companies uploaded via CSV",
                  "varType": "Target List",
                  "isUpdated": false
                },
                {
                  "label": "LinkedIn Matched Accounts",
                  "value": "800 Accounts Matched (80.0% Match Rate >= 65.0% Benchmark)",
                  "varType": "Matched Accounts",
                  "isUpdated": false
                },
                {
                  "label": "Decision Maker Targeting",
                  "value": "VP of Engineering & CFOs within matched 800 firms (READY TO LAUNCH!)",
                  "varType": "Campaign Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "abm_calc_demo.js",
            "initialCode": "function evaluateAbmMatch(uploaded, matched) {\n  const rate = (matched / uploaded) * 100;\n  const isReady = rate >= 65.0;\n  return {\n    uploadedAccounts: uploaded,\n    matchedAccounts: matched,\n    matchRatePercent: Number(rate.toFixed(1)),\n    isCampaignReady: isReady,\n    status: isReady ? 'ABM_CAMPAIGN_LAUNCH_READY' : 'LOW_MATCH_RATE'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateAbmMatch(1000, 800)));",
            "expectedOutput": "{\"uploadedAccounts\":1000,\"matchedAccounts\":800,\"matchRatePercent\":80,\"isCampaignReady\":true,\"status\":\"ABM_CAMPAIGN_LAUNCH_READY\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the match rate percentage when LinkedIn Matched Audiences successfully identifies 800 enterprise accounts from an uploaded list of 1,000 target companies ($ (800 / 1,000) \\times 100 $)?",
          "expectedStringOutput": "80",
          "acceptableAnswers": [
            "80",
            "80%",
            "80.0",
            "matchRatePercent\":80"
          ],
          "primaryMisconceptionId": "MC_DMKT_B2B_LINKEDIN_ACCOUNT_BASED_MARKETING",
          "diagnosisMap": {
            "0.8": {
              "misconceptionId": "MC_DMKT_B2B_LINKEDIN_ACCOUNT_BASED_MARKETING",
              "errorExplanation": "0.8 is the decimal ratio. As a percentage, the match rate is 80.0%.",
              "recoveryPath": {
                "simplerExplanation": "800 / 1,000 * 100 = 80%.",
                "guidedFixPrompt": "Type 80"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d10-b2-linkedin-lead-gen-forms",
        "day": 10,
        "blockNumber": 2,
        "title": "LinkedIn Lead Gen Forms: Frictionless In-App Lead Capture",
        "conceptBudget": {
          "primaryConcept": "Native Lead Gen Forms",
          "supportingTerms": [
            "In-App Lead Gen Forms (Auto-fills user verified work email, company name, and job title directly from profile)",
            "2x-3x higher conversion rate than external landing page redirects"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d10-b1-abm-matched-audiences-match-rate",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Native Lead Gen Advantage",
            "codeSnippet": "// External Landing Page: User clicks -> Loads external URL -> Types 8 fields manually -> 80% drop-off!\n// Native Lead Gen Form:   User clicks -> Form opens instantly pre-filled with LinkedIn profile data -> 1-click submit!",
            "lineNotes": {
              "1": "High mobile friction.",
              "2": "Zero friction auto-fill."
            }
          },
          {
            "type": "runnable_code",
            "filename": "lead_gen_form_demo.js",
            "initialCode": "function evaluateLeadCaptureMethod(isNativePreFilled) {\n  return isNativePreFilled\n    ? 'HIGH_CONVERSION_NATIVE_AUTO_FILL'\n    : 'HIGH_FRICTION_EXTERNAL_FORM';\n}\n\nconsole.log(evaluateLeadCaptureMethod(true));",
            "expectedOutput": "HIGH_CONVERSION_NATIVE_AUTO_FILL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why do LinkedIn Native Lead Gen Forms achieve 2x to 3x higher conversion rates compared to external landing page redirects?",
          "expectedStringOutput": "HIGH_CONVERSION_NATIVE_AUTO_FILL",
          "acceptableAnswers": [
            "HIGH_CONVERSION_NATIVE_AUTO_FILL",
            "Auto fill",
            "Frictionless auto-fill"
          ],
          "primaryMisconceptionId": "MC_DMKT_B2B_LINKEDIN_ACCOUNT_BASED_MARKETING",
          "diagnosisMap": {
            "CHEAP": {
              "misconceptionId": "MC_DMKT_B2B_LINKEDIN_ACCOUNT_BASED_MARKETING",
              "errorExplanation": "LinkedIn CPMs are premium. The conversion advantage comes from pre-filled auto-fill data.",
              "recoveryPath": {
                "simplerExplanation": "Matches HIGH_CONVERSION_NATIVE_AUTO_FILL.",
                "guidedFixPrompt": "Type HIGH_CONVERSION_NATIVE_AUTO_FILL"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d10-b3-sponsored-inmail-message-ads",
        "day": 10,
        "blockNumber": 3,
        "title": "Sponsored Messaging (InMail) Frequency Caps & Deliverability",
        "conceptBudget": {
          "primaryConcept": "Sponsored Messaging Rules",
          "supportingTerms": [
            "Strict 45-day member frequency cap (Users receive max 1 sponsored InMail every 45 days)",
            "Delivered only when member is actively online $\\implies 50+\\%$ open rates"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d10-b2-linkedin-lead-gen-forms",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "inmail_demo.js",
            "initialCode": "function getInmailFrequencyCapDays() {\n  return 45;\n}\n\nconsole.log(getInmailFrequencyCapDays());",
            "expectedOutput": "45",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is LinkedIn's member frequency cap rule that prevents inbox spam by limiting users to receiving at most 1 sponsored InMail every how many days?",
          "expectedStringOutput": "45",
          "acceptableAnswers": [
            "45",
            "45 days",
            "Forty five"
          ],
          "primaryMisconceptionId": "MC_DMKT_B2B_LINKEDIN_ACCOUNT_BASED_MARKETING",
          "diagnosisMap": {
            "7": {
              "misconceptionId": "MC_DMKT_B2B_LINKEDIN_ACCOUNT_BASED_MARKETING",
              "errorExplanation": "LinkedIn enforces a strict 45-day frequency cap to protect member inboxes.",
              "recoveryPath": {
                "simplerExplanation": "Frequency cap is 45 days.",
                "guidedFixPrompt": "Type 45"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Performance Video Marketing: Hook Rates & View-Through Retention",
    "overviewMetaphor": "The First 3 Seconds of a Video Ad is the High-Speed Doorway: On TikTok, YouTube, and Instagram Reels, 80% of viewers scroll past within a fraction of a second; the 3-Second Hook Rate ($Hook = \\frac{\\text{3-Sec Plays}}{\\text{Impressions}} \\times 100\\%$) measures your doorway; if 4,000 out of 10,000 impressions watch past 3 seconds ($40.0\\%$ Hook Rate), your opening pattern interrupt successfully grabbed attention; high hook rates lower video CPMs and accelerate conversion.",
    "blocks": [
      {
        "id": "dmkt-d11-b1-video-three-second-hook-rate",
        "day": 11,
        "blockNumber": 1,
        "title": "The 3-Second Hook Rate Formula: $\\frac{\\text{3-Sec Video Plays}}{\\text{Impressions}} \\times 100\\%$",
        "conceptBudget": {
          "primaryConcept": "3-Second Hook Rate Formula",
          "supportingTerms": [
            "3-Second Plays ($4,000$)",
            "Total Impressions ($10,000$)",
            "$Hook Rate = \\frac{4,000}{10,000} \\times 100\\% = 40.0\\%$",
            "Hook Rate $\\ge 35\\% \\implies$ High Performing Creative; $< 20\\% \\implies$ Revise opening 3 seconds immediately"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d10-b1-abm-matched-audiences-match-rate",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Video Creative Funnel (10,000 Impressions)",
              "boxes": [
                {
                  "label": "Total Impressions Served",
                  "value": "10,000 Video Ad Views in user feed",
                  "varType": "Impressions",
                  "isUpdated": false
                },
                {
                  "label": "3-Second Watched Plays",
                  "value": "4,000 Users stopped scrolling past 3s",
                  "varType": "3-Sec Plays",
                  "isUpdated": false
                },
                {
                  "label": "Creative Hook Rate",
                  "value": "4,000 / 10,000 = 40.00% Hook Rate (HIGH PERFORMING VIRAL HOOK!)",
                  "varType": "Hook Rate",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "hook_calc_demo.js",
            "initialCode": "function calculateHookRate(threeSecPlays, impressions) {\n  const rate = (threeSecPlays / impressions) * 100;\n  return {\n    impressions,\n    threeSecPlays,\n    hookRatePercent: Number(rate.toFixed(2)),\n    isTopTier: rate >= 35.0,\n    status: 'HOOK_RATE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateHookRate(4000, 10000)));",
            "expectedOutput": "{\"impressions\":10000,\"threeSecPlays\":4000,\"hookRatePercent\":40,\"isTopTier\":true,\"status\":\"HOOK_RATE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the 3-Second Hook Rate percentage when a video ad achieves 4,000 three-second plays from 10,000 impressions ($ (4,000 / 10,000) \\times 100 $)?",
          "expectedStringOutput": "40",
          "acceptableAnswers": [
            "40",
            "40%",
            "40.0",
            "hookRatePercent\":40"
          ],
          "primaryMisconceptionId": "MC_DMKT_VIDEO_MARKETING_HOOK_RATES_RETENTION",
          "diagnosisMap": {
            "0.4": {
              "misconceptionId": "MC_DMKT_VIDEO_MARKETING_HOOK_RATES_RETENTION",
              "errorExplanation": "0.4 is decimal form. Multiplied by 100 gives 40.0%.",
              "recoveryPath": {
                "simplerExplanation": "4,000 / 10,000 * 100 = 40%.",
                "guidedFixPrompt": "Type 40"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d11-b2-pattern-interrupt-tactics",
        "day": 11,
        "blockNumber": 2,
        "title": "Pattern Interrupt Tactics in First 3 Seconds",
        "conceptBudget": {
          "primaryConcept": "Pattern Interrupt Mechanics",
          "supportingTerms": [
            "Pattern Interrupt (Unexpected visual motion, shocking statistic, reverse action, instant bold on-screen caption)",
            "Eliminates boring corporate logo introductions that cause 90% instant bounce"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d11-b1-video-three-second-hook-rate",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Opening 3 Seconds Best Practice",
            "codeSnippet": "// ❌ BORING LOGO OPENING: 5-second spinning 3D company logo -> 92% scroll away immediately!\n// ✅ PATTERN INTERRUPT:   'Stop wasting $5,000 on broken marketing...' + bold neon text overlay -> 45% stay!",
            "lineNotes": {
              "1": "Instant drop-off.",
              "2": "High hook retention."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pattern_interrupt_demo.js",
            "initialCode": "function evaluateVideoOpening(hasImmediateHook) {\n  return hasImmediateHook\n    ? 'PATTERN_INTERRUPT_STOPS_FEED_SCROLLING'\n    : 'BORING_LOGO_INTRO_CAUSES_INSTANT_BOUNCE';\n}\n\nconsole.log(evaluateVideoOpening(true));\nconsole.log(evaluateVideoOpening(false));",
            "expectedOutput": "PATTERN_INTERRUPT_STOPS_FEED_SCROLLING\nBORING_LOGO_INTRO_CAUSES_INSTANT_BOUNCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What creative visual technique is engineered into the opening 3 seconds of a social video ad to stop feed scrolling and boost hook rates?",
          "expectedStringOutput": "PATTERN_INTERRUPT_STOPS_FEED_SCROLLING",
          "acceptableAnswers": [
            "PATTERN_INTERRUPT_STOPS_FEED_SCROLLING",
            "Pattern Interrupt",
            "Pattern interrupt"
          ],
          "primaryMisconceptionId": "MC_DMKT_VIDEO_MARKETING_HOOK_RATES_RETENTION",
          "diagnosisMap": {
            "LOGO": {
              "misconceptionId": "MC_DMKT_VIDEO_MARKETING_HOOK_RATES_RETENTION",
              "errorExplanation": "Spinning logos cause instant drop-offs. High hook retention uses Pattern Interrupts.",
              "recoveryPath": {
                "simplerExplanation": "Matches PATTERN_INTERRUPT_STOPS_FEED_SCROLLING.",
                "guidedFixPrompt": "Type PATTERN_INTERRUPT_STOPS_FEED_SCROLLING"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d11-b3-youtube-trueview-vs-bumper-ads",
        "day": 11,
        "blockNumber": 3,
        "title": "YouTube TrueView In-Stream vs 6-Second Bumper Ads",
        "conceptBudget": {
          "primaryConcept": "YouTube Ad Formats",
          "supportingTerms": [
            "TrueView In-Stream (Skippable after 5 seconds: Advertiser pays only if user watches 30s or clicks)",
            "Bumper Ads (6 seconds non-skippable: Maximum brand frequency and reach)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d11-b2-pattern-interrupt-tactics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "youtube_formats_demo.js",
            "initialCode": "function getYouTubeFormat(seconds, isSkippable) {\n  if (seconds === 6 && !isSkippable) return 'NON_SKIPPABLE_BUMPER_AD';\n  return 'TRUEVIEW_SKIPPABLE_IN_STREAM';\n}\n\nconsole.log(getYouTubeFormat(6, false));\nconsole.log(getYouTubeFormat(30, true));",
            "expectedOutput": "NON_SKIPPABLE_BUMPER_AD\nTRUEVIEW_SKIPPABLE_IN_STREAM",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is a 6-second non-skippable YouTube video ad format classified in Google Ads video advertising?",
          "expectedStringOutput": "NON_SKIPPABLE_BUMPER_AD",
          "acceptableAnswers": [
            "NON_SKIPPABLE_BUMPER_AD",
            "Bumper Ad",
            "Bumper Ads"
          ],
          "primaryMisconceptionId": "MC_DMKT_VIDEO_MARKETING_HOOK_RATES_RETENTION",
          "diagnosisMap": {
            "TRUEVIEW": {
              "misconceptionId": "MC_DMKT_VIDEO_MARKETING_HOOK_RATES_RETENTION",
              "errorExplanation": "TrueView ads are skippable after 5s. 6-second non-skippable ads are Bumper Ads.",
              "recoveryPath": {
                "simplerExplanation": "6-second non-skippable is a Bumper Ad.",
                "guidedFixPrompt": "Type NON_SKIPPABLE_BUMPER_AD"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Email Marketing & Deliverability: SPF, DKIM, DMARC & List Hygiene",
    "overviewMetaphor": "Email Authentication is a Triple-Sealed Diplomatic Passport: If your domain lacks SPF (Sender Policy Framework: listing authorized mail servers), DKIM (Cryptographic digital signature), and DMARC (Enforcement policy), Gmail and Yahoo instantly dump your emails into the Spam dungeon; with all 3 protocols active, 99.0% of your emails land directly in the primary inbox, and maintaining spam complaints under 0.10% preserves an untouchable sender reputation.",
    "blocks": [
      {
        "id": "dmkt-d12-b1-email-authentication-spf-dkim-dmarc",
        "day": 12,
        "blockNumber": 1,
        "title": "The Triple Email Authentication Stack: SPF, DKIM & DMARC",
        "conceptBudget": {
          "primaryConcept": "Email Authentication Triad",
          "supportingTerms": [
            "SPF (Sender Policy Framework DNS TXT record)",
            "DKIM (DomainKeys Identified Mail cryptographic key signature)",
            "DMARC (Domain-based Message Authentication Reporting & Conformance `p=reject`)",
            "Deliverability Rate: $\\ge 98.0\\%$, Spam Complaint Rate: $\\le 0.10\\%$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d11-b1-video-three-second-hook-rate",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Email Deliverability Audit (100k Sent, 99k Delivered, 50 Complaints)",
              "boxes": [
                {
                  "label": "Deliverability Rate",
                  "value": "99,000 / 100,000 = 99.00% Deliverability (>= 98.0% standard)",
                  "varType": "Deliverability",
                  "isUpdated": false
                },
                {
                  "label": "Spam Complaint Rate",
                  "value": "50 / 99,000 = 0.051% (Well below 0.10% Yahoo/Gmail threshold!)",
                  "varType": "Complaint Rate",
                  "isUpdated": false
                },
                {
                  "label": "DMARC Status: `p=reject`",
                  "value": "100% AUTHENTICATED -> PRISTINE PRIMARY INBOX PLACEMENT!",
                  "varType": "Inbox Placement",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "email_audit_demo.js",
            "initialCode": "function auditEmailHealth(sent, delivered, complaints, dmarc) {\n  const delRate = (delivered / sent) * 100;\n  const compRate = (complaints / delivered) * 100;\n  const isPristine = delRate >= 98.0 && compRate <= 0.10 && dmarc;\n  return {\n    deliverabilityPercent: Number(delRate.toFixed(2)),\n    complaintPercent: Number(compRate.toFixed(3)),\n    hasDmarc: dmarc,\n    senderReputation: isPristine ? 'PRISTINE_INBOX_DELIVERABILITY' : 'SPAM_RISK'\n  };\n}\n\nconsole.log(JSON.stringify(auditEmailHealth(100000, 99000, 50, true)));",
            "expectedOutput": "{\"deliverabilityPercent\":99,\"complaintPercent\":0.051,\"hasDmarc\":true,\"senderReputation\":\"PRISTINE_INBOX_DELIVERABILITY\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the deliverability percentage when 99,000 out of 100,000 broadcast emails successfully reach recipient mail servers ($ (99,000 / 100,000) \\times 100 $)?",
          "expectedStringOutput": "99",
          "acceptableAnswers": [
            "99",
            "99%",
            "99.0",
            "deliverabilityPercent\":99"
          ],
          "primaryMisconceptionId": "MC_DMKT_EMAIL_MARKETING_DELIVERABILITY_DMARC_SPF",
          "diagnosisMap": {
            "0.99": {
              "misconceptionId": "MC_DMKT_EMAIL_MARKETING_DELIVERABILITY_DMARC_SPF",
              "errorExplanation": "0.99 is decimal ratio. As a percentage, deliverability is 99.0%.",
              "recoveryPath": {
                "simplerExplanation": "99,000 / 100,000 * 100 = 99%.",
                "guidedFixPrompt": "Type 99"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d12-b2-spam-complaint-rate-threshold",
        "day": 12,
        "blockNumber": 2,
        "title": "Google & Yahoo Spam Complaint Rate Limits ($0.10\\%$ Rule)",
        "conceptBudget": {
          "primaryConcept": "Spam Complaint Rate Rule",
          "supportingTerms": [
            "Strict 0.10% (1 in 1,000) spam complaint threshold",
            "Exceeding 0.30% results in immediate domain-wide blocking by Google/Yahoo",
            "One-click unsubscribe header requirement (RFC 8058)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d12-b1-email-authentication-spf-dkim-dmarc",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Spam Complaint Invariant",
            "codeSnippet": "// Complaints: 50 out of 99,000 emails = 0.051% <= 0.10% -> SAFE INBOX!\n// Complaints: 250 out of 50,000 emails = 0.500% > 0.30%  -> DOMAIN BLOCKED BY GMAIL!",
            "lineNotes": {
              "1": "Safe complaint threshold.",
              "2": "Domain blocking penalty."
            }
          },
          {
            "type": "runnable_code",
            "filename": "spam_limit_demo.js",
            "initialCode": "function getSpamComplaintLimit() {\n  return 0.10;\n}\n\nconsole.log(getSpamComplaintLimit());",
            "expectedOutput": "0.1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum spam complaint rate percentage threshold enforced by Google and Yahoo to maintain good sender reputation?",
          "expectedStringOutput": "0.1",
          "acceptableAnswers": [
            "0.1",
            "0.10",
            "0.1%",
            "0.10%"
          ],
          "primaryMisconceptionId": "MC_DMKT_EMAIL_MARKETING_DELIVERABILITY_DMARC_SPF",
          "diagnosisMap": {
            "1.0": {
              "misconceptionId": "MC_DMKT_EMAIL_MARKETING_DELIVERABILITY_DMARC_SPF",
              "errorExplanation": "1.0% is 10x too high and will get your domain permanently banned. The limit is 0.10%.",
              "recoveryPath": {
                "simplerExplanation": "Maximum complaint limit is 0.10%.",
                "guidedFixPrompt": "Type 0.1"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d12-b3-hard-vs-soft-email-bounces",
        "day": 12,
        "blockNumber": 3,
        "title": "Hard Bounces vs Soft Bounces & Automated List Pruning",
        "conceptBudget": {
          "primaryConcept": "Bounce Classification & Pruning",
          "supportingTerms": [
            "Hard Bounce (Permanent failure: Non-existent email address, invalid domain $\\implies$ Immediate automatic deletion from list)",
            "Soft Bounce (Temporary failure: Full mailbox, server downtime $\\implies$ Retry 3 times)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d12-b2-spam-complaint-rate-threshold",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bounce_demo.js",
            "initialCode": "function handleEmailBounce(bounceType) {\n  return bounceType === 'HARD_BOUNCE_INVALID_ADDRESS'\n    ? 'PERMANENTLY_PURGE_FROM_DATABASE_IMMEDIATELY'\n    : 'RETRY_UP_TO_THREE_TIMES';\n}\n\nconsole.log(handleEmailBounce('HARD_BOUNCE_INVALID_ADDRESS'));\nconsole.log(handleEmailBounce('SOFT_BOUNCE_MAILBOX_FULL'));",
            "expectedOutput": "PERMANENTLY_PURGE_FROM_DATABASE_IMMEDIATELY\nRETRY_UP_TO_THREE_TIMES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action must be executed immediately when an email encounters a Hard Bounce due to a non-existent email address?",
          "expectedStringOutput": "PERMANENTLY_PURGE_FROM_DATABASE_IMMEDIATELY",
          "acceptableAnswers": [
            "PERMANENTLY_PURGE_FROM_DATABASE_IMMEDIATELY",
            "Purge from database",
            "Delete immediately"
          ],
          "primaryMisconceptionId": "MC_DMKT_EMAIL_MARKETING_DELIVERABILITY_DMARC_SPF",
          "diagnosisMap": {
            "RETRY": {
              "misconceptionId": "MC_DMKT_EMAIL_MARKETING_DELIVERABILITY_DMARC_SPF",
              "errorExplanation": "Retrying non-existent emails destroys sender reputation. Hard bounces must be purged immediately.",
              "recoveryPath": {
                "simplerExplanation": "Hard bounces must be purged immediately.",
                "guidedFixPrompt": "Type PERMANENTLY_PURGE_FROM_DATABASE_IMMEDIATELY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Marketing Automation & Drip Sequences: Cart Abandonment Workflows",
    "overviewMetaphor": "Cart Abandonment Automation is an Attentive Store Clerk Running After a Customer: When a shopper leaves 1,000 full carts behind ($150 average value = $150,000 lost revenue), an automated 3-part drip email sequence triggers automatically: Email 1 (1 hour later: 'Did you leave something behind?'); Email 2 (24 hours: Customer reviews & social proof); Email 3 (48 hours: 10% coupon); recovering 12% of abandoned carts ($18,000 in pure recovered cash) with zero human manual labor.",
    "blocks": [
      {
        "id": "dmkt-d13-b1-cart-abandonment-recovery-revenue",
        "day": 13,
        "blockNumber": 1,
        "title": "Cart Abandonment Recovery Revenue: $\\text{Carts} \\times \\text{Recovery}\\% \\times \\text{AOV}$",
        "conceptBudget": {
          "primaryConcept": "Cart Recovery Formula",
          "supportingTerms": [
            "Abandoned Carts ($1,000$)",
            "Average Order Value ($AOV = \\$150$)",
            "Recovery Rate ($12.0\\% \\implies 120$ recovered carts)",
            "Recovered Revenue = $120 \\times \\$150 = \\$18,000$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d12-b1-email-authentication-spf-dkim-dmarc",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Cart Recovery Pipeline ($150 AOV)",
              "boxes": [
                {
                  "label": "Abandoned Carts",
                  "value": "1,000 Shoppers left checkout without paying ($150,000 GMV at risk)",
                  "varType": "Lost Carts",
                  "isUpdated": false
                },
                {
                  "label": "Drip Sequence Conversion",
                  "value": "12.0% Conversion Recovery across 3 automated emails",
                  "varType": "Recovery Rate",
                  "isUpdated": false
                },
                {
                  "label": "Recovered Revenue (USD)",
                  "value": "120 Carts x $150 = $18,000.00 RECOVERED REVENUE!",
                  "varType": "Recovered Revenue",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cart_recovery_calc_demo.js",
            "initialCode": "function calculateCartRecovery(abandonedCarts, aov, recoveryRatePct) {\n  const count = abandonedCarts * (recoveryRatePct / 100);\n  const rev = count * aov;\n  return {\n    abandonedCarts,\n    recoveredCount: count,\n    recoveredRevenue: rev,\n    status: 'CART_REVENUE_RECOVERED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCartRecovery(1000, 150, 12)));",
            "expectedOutput": "{\"abandonedCarts\":1000,\"recoveredCount\":120,\"recoveredRevenue\":18000,\"status\":\"CART_REVENUE_RECOVERED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How much revenue is recovered when 1,000 abandoned carts with an Average Order Value of $150 achieve a 12% recovery rate ($1,000 \\times 0.12 \\times 150$)?",
          "expectedStringOutput": "18000",
          "acceptableAnswers": [
            "18000",
            "$18,000",
            "18,000",
            "recoveredRevenue\":18000"
          ],
          "primaryMisconceptionId": "MC_DMKT_MARKETING_AUTOMATION_CART_ABANDONMENT",
          "diagnosisMap": {
            "120": {
              "misconceptionId": "MC_DMKT_MARKETING_AUTOMATION_CART_ABANDONMENT",
              "errorExplanation": "120 is the number of recovered carts. Multiplying by $150 AOV gives $18,000 in recovered revenue.",
              "recoveryPath": {
                "simplerExplanation": "120 * 150 = 18,000.",
                "guidedFixPrompt": "Type 18000"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d13-b2-drip-sequence-timing-schedule",
        "day": 13,
        "blockNumber": 2,
        "title": "The Optimal 3-Part Cart Drip Cadence (1h $\\to$ 24h $\\to$ 48h)",
        "conceptBudget": {
          "primaryConcept": "Drip Timing Cadence",
          "supportingTerms": [
            "Email 1 (1 hour post-abandonment: Highest open rate, helpful reminder)",
            "Email 2 (24 hours: Overcoming objections, customer reviews)",
            "Email 3 (48 hours: Urgency / Scarcity discount expiration)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d13-b1-cart-abandonment-recovery-revenue",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Cart Drip Schedule",
            "codeSnippet": "// 1 HOUR:  'Forgot something? We saved your cart for you!' (High intent)\n// 24 HOURS: 'See why 10,000 customers love our product' (Social proof)\n// 48 HOURS: 'Final 10% discount expires tonight!' (Urgency close)",
            "lineNotes": {
              "1": "Immediate recall.",
              "2": "Trust building.",
              "3": "Final incentive."
            }
          },
          {
            "type": "runnable_code",
            "filename": "drip_schedule_demo.js",
            "initialCode": "function getFirstCartEmailDelayHours() {\n  return 1;\n}\n\nconsole.log(getFirstCartEmailDelayHours());",
            "expectedOutput": "1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many hours after cart abandonment should the first automated reminder email be triggered to capture peak buyer intent?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "1 hour",
            "1 hr",
            "One hour"
          ],
          "primaryMisconceptionId": "MC_DMKT_MARKETING_AUTOMATION_CART_ABANDONMENT",
          "diagnosisMap": {
            "24": {
              "misconceptionId": "MC_DMKT_MARKETING_AUTOMATION_CART_ABANDONMENT",
              "errorExplanation": "Waiting 24 hours causes intent to cool. The first email should trigger within 1 hour.",
              "recoveryPath": {
                "simplerExplanation": "First email triggers after 1 hour.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d13-b3-lead-nurturing-behavioral-triggers",
        "day": 13,
        "blockNumber": 3,
        "title": "Behavioral Automation Triggers & Dynamic Email Branching",
        "conceptBudget": {
          "primaryConcept": "Dynamic Behavioral Branching",
          "supportingTerms": [
            "Behavioral Trigger (User visited pricing page 3x $\\implies$ Send enterprise demo invite)",
            "Branching Logic (If opened email A $\\to$ send case study; If did not open $\\to$ send alternative subject line)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d13-b2-drip-sequence-timing-schedule",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "branching_demo.js",
            "initialCode": "function evaluateBehavioralTrigger(pricingPageVisits) {\n  return pricingPageVisits >= 3\n    ? 'HIGH_INTENT_TRIGGER_SALES_DEMO_INVITATION'\n    : 'STANDARD_EDUCATIONAL_NURTURE';\n}\n\nconsole.log(evaluateBehavioralTrigger(3));\nconsole.log(evaluateBehavioralTrigger(1));",
            "expectedOutput": "HIGH_INTENT_TRIGGER_SALES_DEMO_INVITATION\nSTANDARD_EDUCATIONAL_NURTURE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What automated marketing action is triggered when an engaged prospect visits the corporate pricing page 3 or more times in a single week?",
          "expectedStringOutput": "HIGH_INTENT_TRIGGER_SALES_DEMO_INVITATION",
          "acceptableAnswers": [
            "HIGH_INTENT_TRIGGER_SALES_DEMO_INVITATION",
            "Sales Demo Invitation",
            "Demo Invitation"
          ],
          "primaryMisconceptionId": "MC_DMKT_MARKETING_AUTOMATION_CART_ABANDONMENT",
          "diagnosisMap": {
            "STANDARD": {
              "misconceptionId": "MC_DMKT_MARKETING_AUTOMATION_CART_ABANDONMENT",
              "errorExplanation": "3 pricing visits signals hot intent. It triggers a direct Sales Demo Invitation.",
              "recoveryPath": {
                "simplerExplanation": "Matches HIGH_INTENT_TRIGGER_SALES_DEMO_INVITATION.",
                "guidedFixPrompt": "Type HIGH_INTENT_TRIGGER_SALES_DEMO_INVITATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Conversion Rate Optimization (CRO) & A/B Split Testing Statistics",
    "overviewMetaphor": "A/B Testing is Running a Controlled Scientific Clinical Trial on Your Landing Page: Control (Version A: 10,000 visitors $\\to$ 300 sales = 3.0% conversion rate) vs Variation (Version B with a high-contrast green CTA and social proof: 10,000 visitors $\\to$ 450 sales = 4.5% conversion rate); Variation B delivers a massive +50.0% relative conversion uplift; with a sample size of 10,000 per variant, the result achieves $99.9\\%$ statistical confidence ($p < 0.001$), proving the win is real and not random luck.",
    "blocks": [
      {
        "id": "dmkt-d14-b1-ab-testing-relative-uplift",
        "day": 14,
        "blockNumber": 1,
        "title": "A/B Testing Conversion Uplift: $\\text{Uplift}\\% = \\frac{\\text{CR}_B - \\text{CR}_A}{\\text{CR}_A} \\times 100\\%$",
        "conceptBudget": {
          "primaryConcept": "Conversion Rate & Relative Uplift Formula",
          "supportingTerms": [
            "$CR_A = \\frac{300}{10,000} \\times 100\\% = 3.0\\%$",
            "$CR_B = \\frac{450}{10,000} \\times 100\\% = 4.5\\%$",
            "$Relative Uplift = \\frac{4.5\\% - 3.0\\%}{3.0\\%} \\times 100\\% = +50.0\\%$",
            "Absolute Difference: $1.5\\%$ percentage points"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d13-b1-cart-abandonment-recovery-revenue",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "A/B Test Results Ledger (10,000 Visitors per Variant)",
              "boxes": [
                {
                  "label": "Control (Version A)",
                  "value": "300 Conversions / 10,000 Visitors = 3.00% Baseline CR",
                  "varType": "Control CR",
                  "isUpdated": false
                },
                {
                  "label": "Variation (Version B)",
                  "value": "450 Conversions / 10,000 Visitors = 4.50% Test CR",
                  "varType": "Variation CR",
                  "isUpdated": false
                },
                {
                  "label": "Relative Conversion Uplift",
                  "value": "(4.50% - 3.00%) / 3.00% = +50.00% RELATIVE REVENUE UPLIFT!",
                  "varType": "Uplift",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ab_calc_demo.js",
            "initialCode": "function calculateAbTestUplift(vA, cA, vB, cB) {\n  const crA = (cA / vA) * 100;\n  const crB = (cB / vB) * 100;\n  const uplift = ((crB - crA) / crA) * 100;\n  return {\n    controlCr: Number(crA.toFixed(2)),\n    variationCr: Number(crB.toFixed(2)),\n    relativeUpliftPercent: Number(uplift.toFixed(2)),\n    status: 'AB_TEST_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateAbTestUplift(10000, 300, 10000, 450)));",
            "expectedOutput": "{\"controlCr\":3,\"variationCr\":4.5,\"relativeUpliftPercent\":50,\"status\":\"AB_TEST_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the relative conversion rate uplift percentage when Variation B (4.5% CR) outperforms Control A (3.0% CR) ($ (4.5 - 3.0) / 3.0 \\times 100 $)?",
          "expectedStringOutput": "50",
          "acceptableAnswers": [
            "50",
            "50%",
            "50.0",
            "relativeUpliftPercent\":50"
          ],
          "primaryMisconceptionId": "MC_DMKT_CONVERSION_RATE_OPTIMIZATION_AB_TESTING",
          "diagnosisMap": {
            "1.5": {
              "misconceptionId": "MC_DMKT_CONVERSION_RATE_OPTIMIZATION_AB_TESTING",
              "errorExplanation": "1.5% is the absolute percentage point difference. Relative uplift divides by baseline: (1.5 / 3.0) * 100 = 50.0%.",
              "recoveryPath": {
                "simplerExplanation": "(1.5 / 3.0) * 100 = 50%.",
                "guidedFixPrompt": "Type 50"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d14-b2-statistical-significance-p-value",
        "day": 14,
        "blockNumber": 2,
        "title": "Statistical Significance: The $95\\%$ Confidence Level ($p < 0.05$)",
        "conceptBudget": {
          "primaryConcept": "Statistical Significance Standards",
          "supportingTerms": [
            "$p < 0.05$ ($95\\%$ Confidence: 1 in 20 chance result is false positive)",
            "Minimum Detectable Effect (MDE)",
            "Peeking Problem (Do not stop test early before reaching pre-calculated sample size)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d14-b1-ab-testing-relative-uplift",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CRO Statistical Invariant",
            "codeSnippet": "// p-value = 0.012 < 0.05 -> 98.8% Statistical Confidence -> STATISTICALLY SIGNIFICANT WINNER!\n// p-value = 0.180 > 0.05 -> 82.0% Confidence -> INCONCLUSIVE NOISE (DO NOT SHIP)",
            "lineNotes": {
              "1": "Significant winner.",
              "2": "Inconclusive noise."
            }
          },
          {
            "type": "runnable_code",
            "filename": "p_val_demo.js",
            "initialCode": "function evaluateSignificance(pValue) {\n  return pValue < 0.05\n    ? 'STATISTICALLY_SIGNIFICANT_SHIP_VARIATION'\n    : 'INCONCLUSIVE_DATA_CONTINUE_TESTING';\n}\n\nconsole.log(evaluateSignificance(0.012));\nconsole.log(evaluateSignificance(0.18));",
            "expectedOutput": "STATISTICALLY_SIGNIFICANT_SHIP_VARIATION\nINCONCLUSIVE_DATA_CONTINUE_TESTING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What decision is confirmed when an A/B test variation achieves a p-value of 0.012 ($p < 0.05$)?",
          "expectedStringOutput": "STATISTICALLY_SIGNIFICANT_SHIP_VARIATION",
          "acceptableAnswers": [
            "STATISTICALLY_SIGNIFICANT_SHIP_VARIATION",
            "Statistically Significant",
            "Ship Variation"
          ],
          "primaryMisconceptionId": "MC_DMKT_CONVERSION_RATE_OPTIMIZATION_AB_TESTING",
          "diagnosisMap": {
            "INCONCLUSIVE": {
              "misconceptionId": "MC_DMKT_CONVERSION_RATE_OPTIMIZATION_AB_TESTING",
              "errorExplanation": "p-value 0.012 is less than 0.05, establishing 98.8% confidence. It is statistically significant.",
              "recoveryPath": {
                "simplerExplanation": "Matches STATISTICALLY_SIGNIFICANT_SHIP_VARIATION.",
                "guidedFixPrompt": "Type STATISTICALLY_SIGNIFICANT_SHIP_VARIATION"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d14-b3-landing-page-friction-reduction",
        "day": 14,
        "blockNumber": 3,
        "title": "Landing Page Architecture: F-Pattern, CTA Contrast & Friction Reduction",
        "conceptBudget": {
          "primaryConcept": "Landing Page Friction Reduction",
          "supportingTerms": [
            "F-Shaped Eye Tracking Pattern (Eye scans top headline, second subhead, then vertical left border)",
            "Color Contrast CTA Button (Stands out instantly against page background)",
            "Reducing form fields from 8 to 3 increases conversion by 50%"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d14-b2-statistical-significance-p-value",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "friction_demo.js",
            "initialCode": "function evaluateFormFields(fieldCount) {\n  return fieldCount <= 3\n    ? 'MINIMAL_FRICTION_OPTIMAL_CONVERSION'\n    : 'EXCESSIVE_FORM_FRICTION_DROPOFF';\n}\n\nconsole.log(evaluateFormFields(3));\nconsole.log(evaluateFormFields(8));",
            "expectedOutput": "MINIMAL_FRICTION_OPTIMAL_CONVERSION\nEXCESSIVE_FORM_FRICTION_DROPOFF",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is a lead capture form containing only 3 essential input fields (Name, Work Email, Company) evaluated in conversion rate optimization UX design?",
          "expectedStringOutput": "MINIMAL_FRICTION_OPTIMAL_CONVERSION",
          "acceptableAnswers": [
            "MINIMAL_FRICTION_OPTIMAL_CONVERSION",
            "Minimal Friction",
            "Optimal Conversion"
          ],
          "primaryMisconceptionId": "MC_DMKT_CONVERSION_RATE_OPTIMIZATION_AB_TESTING",
          "diagnosisMap": {
            "EXCESSIVE": {
              "misconceptionId": "MC_DMKT_CONVERSION_RATE_OPTIMIZATION_AB_TESTING",
              "errorExplanation": "8+ fields create excessive friction. 3 clean fields provide minimal friction.",
              "recoveryPath": {
                "simplerExplanation": "Matches MINIMAL_FRICTION_OPTIMAL_CONVERSION.",
                "guidedFixPrompt": "Type MINIMAL_FRICTION_OPTIMAL_CONVERSION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Performance Marketing, Paid Media & CRO Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete sovereign performance marketing, paid media scaling, and conversion optimization engine: 1. Return on Ad Spend ($ROAS = 500.0\\%$ vs $250\\%$ Break-Even); 2. Meta 1.0% Lookalike Audience extraction ($2,000,000$ VIP prospects); 3. Triple-authenticated email deliverability ($99.0\\%$ deliverability, $0.051\\%$ complaints); 4. Cart abandonment recovery automation ($18,000$ GMV recovered); 5. A/B split testing statistical analysis ($+50.0\\%$ conversion uplift, $p < 0.05$).",
    "blocks": [
      {
        "id": "dmkt-d15-b1-performance-cro-master-engine-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Performance Marketing & CRO Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Performance CRO Master Engine",
          "supportingTerms": [
            "ROAS Engine",
            "Lookalike Engine",
            "Deliverability Validator",
            "Cart Recovery Engine",
            "A/B Uplift Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d14-b3-landing-page-friction-reduction",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 Performance & CRO Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Evaluates 500% ROAS vs 250% Break-Even margin threshold",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Generates 1% Meta Lookalike Audience (2M targeted users)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Audits 99% email deliverability & $18,000 recovered cart drips",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Proves +50% A/B test conversion uplift and certifies CRO engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "performance_cro_kernel_demo.js",
            "initialCode": "function runPerformanceCroEngine() {\n  return {\n    roasSubsystem: 'ONLINE_ROAS_SCALING_ACTIVE',\n    lookalikeSubsystem: 'ONLINE_LAL_EXTRACTION_ACTIVE',\n    emailSubsystem: 'ONLINE_DMARC_DELIVERABILITY_ACTIVE',\n    cartSubsystem: 'ONLINE_CART_RECOVERY_ACTIVE',\n    croSubsystem: 'ONLINE_AB_STATISTICS_ACTIVE',\n    engineStatus: 'PERFORMANCE_AND_CRO_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runPerformanceCroEngine().engineStatus);",
            "expectedOutput": "PERFORMANCE_AND_CRO_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Performance Marketing & CRO Master Engine?",
          "expectedStringOutput": "PERFORMANCE_AND_CRO_MASTER_ACTIVE",
          "acceptableAnswers": [
            "PERFORMANCE_AND_CRO_MASTER_ACTIVE",
            "engineStatus: PERFORMANCE_AND_CRO_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_DMKT_CONVERSION_RATE_OPTIMIZATION_AB_TESTING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DMKT_CONVERSION_RATE_OPTIMIZATION_AB_TESTING",
              "errorExplanation": "Matches PERFORMANCE_AND_CRO_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type PERFORMANCE_AND_CRO_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d15-b2-performance-cro-engine-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Performance & CRO Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Performance CRO Invariant Verification",
          "supportingTerms": [
            "ROAS Invariant",
            "CRO Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d15-b1-performance-cro-master-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "performance_audit_demo.js",
            "initialCode": "function auditPerformanceCroEngine(roasValid, lalValid, emailValid, croValid) {\n  const passed = roasValid && lalValid && emailValid && croValid;\n  return {\n    roasVerified: roasValid,\n    lookalikeVerified: lalValid,\n    emailVerified: emailValid,\n    croVerified: croValid,\n    grade: passed ? 'PERFORMANCE_CRO_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditPerformanceCroEngine(true, true, true, true)));",
            "expectedOutput": "{\"roasVerified\":true,\"lookalikeVerified\":true,\"emailVerified\":true,\"croVerified\":true,\"grade\":\"PERFORMANCE_CRO_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when ROAS, Lookalike, Email, and CRO engines pass 100%?",
          "expectedStringOutput": "PERFORMANCE_CRO_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "PERFORMANCE_CRO_ENGINE_AUDIT_PASSED",
            "grade\":\"PERFORMANCE_CRO_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_DMKT_CONVERSION_RATE_OPTIMIZATION_AB_TESTING",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DMKT_CONVERSION_RATE_OPTIMIZATION_AB_TESTING",
              "errorExplanation": "All checks passing awards PERFORMANCE_CRO_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards PERFORMANCE_CRO_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type PERFORMANCE_CRO_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d15-b3-milestone2-dmkt-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Performance Marketing & CRO Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Performance Marketing Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d15-b2-performance-cro-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_dmkt_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Performance Marketing, Paid Media & CRO Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Performance Marketing, Paid Media & CRO Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Performance Marketing, Paid Media & CRO Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Performance Marketing, Paid Media & CRO Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DMKT_CONVERSION_RATE_OPTIMIZATION_AB_TESTING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DMKT_CONVERSION_RATE_OPTIMIZATION_AB_TESTING",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Performance Marketing, Paid Media & CRO Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Google Analytics 4 (GA4): Event-Driven Data Model & Exploration Reports",
    "overviewMetaphor": "GA4 is a High-Speed Video Camera Recording Atomic User Events: unlike legacy Universal Analytics which bundled actions into rigid session boxes, GA4 treats every single user action as an independent event (page_view, scroll, click, file_download, purchase); in an e-commerce funnel (50,000 product viewers $\\to$ 10,000 add_to_cart events [20% step conversion] $\\to$ 2,000 purchase events [20% step conversion]), GA4 Funnel Explorations pinpoint the exact friction point causing the 80% drop-off.",
    "blocks": [
      {
        "id": "dmkt-d16-b1-ga4-event-driven-funnel",
        "day": 16,
        "blockNumber": 1,
        "title": "GA4 Event-Driven Funnel Drop-Off Analysis: Step & Overall Conversion Rates",
        "conceptBudget": {
          "primaryConcept": "GA4 Event Funnel Metrics",
          "supportingTerms": [
            "Step 1 Event (`view_item`: $50,000$ users)",
            "Step 2 Event (`add_to_cart`: $10,000$ users $\\implies 20.0\\%$ Step 1-to-2 Conversion)",
            "Step 3 Event (`purchase`: $2,000$ users $\\implies 20.0\\%$ Step 2-to-3 Conversion)",
            "Overall Funnel Conversion: $\\frac{2,000}{50,000} \\times 100\\% = 4.0\\%$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d15-b1-performance-cro-master-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "GA4 Event Funnel Exploration (50k Views -> 10k Carts -> 2k Purchases)",
              "boxes": [
                {
                  "label": "Step 1: `view_item`",
                  "value": "50,000 Total Product View Events",
                  "varType": "Step 1",
                  "isUpdated": false
                },
                {
                  "label": "Step 2: `add_to_cart`",
                  "value": "10,000 Users (20.00% Step 1-to-2 Conversion Rate)",
                  "varType": "Step 2",
                  "isUpdated": false
                },
                {
                  "label": "Step 3: `purchase`",
                  "value": "2,000 Users (20.00% Step 2-to-3 | 4.00% OVERALL FUNNEL CONVERSION!)",
                  "varType": "Step 3",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ga4_funnel_calc_demo.js",
            "initialCode": "function calculateGa4Funnel(s1, s2, s3) {\n  const step1To2 = (s2 / s1) * 100;\n  const step2To3 = (s3 / s2) * 100;\n  const overall = (s3 / s1) * 100;\n  return {\n    step1Users: s1,\n    step2Users: s2,\n    step3Users: s3,\n    step1To2Percent: Number(step1To2.toFixed(2)),\n    step2To3Percent: Number(step2To3.toFixed(2)),\n    overallFunnelPercent: Number(overall.toFixed(2)),\n    status: 'GA4_FUNNEL_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateGa4Funnel(50000, 10000, 2000)));",
            "expectedOutput": "{\"step1Users\":50000,\"step2Users\":10000,\"step3Users\":2000,\"step1To2Percent\":20,\"step2To3Percent\":20,\"overallFunnelPercent\":4,\"status\":\"GA4_FUNNEL_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the overall funnel conversion percentage from product view (50,000) to final purchase (2,000) in GA4 ($ (2,000 / 50,000) \\times 100 $)?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "4%",
            "4.0",
            "overallFunnelPercent\":4"
          ],
          "primaryMisconceptionId": "MC_DMKT_GA4_WEB_ANALYTICS_EVENT_DRIVEN_MODEL",
          "diagnosisMap": {
            "0.04": {
              "misconceptionId": "MC_DMKT_GA4_WEB_ANALYTICS_EVENT_DRIVEN_MODEL",
              "errorExplanation": "0.04 is decimal form. Multiplied by 100 gives 4.0% overall conversion.",
              "recoveryPath": {
                "simplerExplanation": "2,000 / 50,000 * 100 = 4%.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d16-b2-enhanced-measurement-events",
        "day": 16,
        "blockNumber": 2,
        "title": "GA4 Enhanced Measurement: Automatic Zero-Code Tracking",
        "conceptBudget": {
          "primaryConcept": "GA4 Enhanced Measurement",
          "supportingTerms": [
            "Automated tracking: Page views, Scroll depth (90%), Outbound link clicks, Site search, Video engagement, File downloads",
            "Eliminates custom GTM triggers for standard interactions"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d16-b1-ga4-event-driven-funnel",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Enhanced Measurement Capabilities",
            "codeSnippet": "// Automatically captured by GA4 with 0 code changes:\n// 1. `scroll` (fires at 90% vertical depth)\n// 2. `file_download` (pdf, zip, doc)\n// 3. `video_complete` (embedded YouTube 100% watch)",
            "lineNotes": {
              "2": "Scroll engagement.",
              "3": "Resource downloads.",
              "4": "Video retention."
            }
          },
          {
            "type": "runnable_code",
            "filename": "enhanced_meas_demo.js",
            "initialCode": "function getEnhancedMeasurementStatus() {\n  return 'AUTOMATED_ZERO_CODE_EVENT_COLLECTION';\n}\n\nconsole.log(getEnhancedMeasurementStatus());",
            "expectedOutput": "AUTOMATED_ZERO_CODE_EVENT_COLLECTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What GA4 feature automatically captures 90% scroll depth, outbound link clicks, and file downloads without requiring custom JavaScript code?",
          "expectedStringOutput": "AUTOMATED_ZERO_CODE_EVENT_COLLECTION",
          "acceptableAnswers": [
            "AUTOMATED_ZERO_CODE_EVENT_COLLECTION",
            "Enhanced Measurement",
            "Enhanced measurement"
          ],
          "primaryMisconceptionId": "MC_DMKT_GA4_WEB_ANALYTICS_EVENT_DRIVEN_MODEL",
          "diagnosisMap": {
            "MANUAL": {
              "misconceptionId": "MC_DMKT_GA4_WEB_ANALYTICS_EVENT_DRIVEN_MODEL",
              "errorExplanation": "GA4 captures standard scroll and download events automatically via Enhanced Measurement.",
              "recoveryPath": {
                "simplerExplanation": "Matches AUTOMATED_ZERO_CODE_EVENT_COLLECTION.",
                "guidedFixPrompt": "Type AUTOMATED_ZERO_CODE_EVENT_COLLECTION"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d16-b3-user-id-cross-device-deduplication",
        "day": 16,
        "blockNumber": 3,
        "title": "User-ID Cross-Device Stitching & Identity Spaces",
        "conceptBudget": {
          "primaryConcept": "Cross-Device Identity Spaces",
          "supportingTerms": [
            "User-ID (Stitching smartphone app browsing and desktop checkout into 1 single user profile)",
            "Google Signals & Device-ID fallback hierarchy"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d16-b2-enhanced-measurement-events",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "user_id_demo.js",
            "initialCode": "function stitchUserSessions(hasUserId) {\n  return hasUserId\n    ? 'UNIFIED_CROSS_DEVICE_SINGLE_CUSTOMER_VIEW'\n    : 'FRAGMENTED_DISJOINTED_DEVICE_SESSIONS';\n}\n\nconsole.log(stitchUserSessions(true));",
            "expectedOutput": "UNIFIED_CROSS_DEVICE_SINGLE_CUSTOMER_VIEW",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What unified reporting state is achieved in GA4 when User-ID tracking stitches mobile phone browsing and laptop checkouts into a single customer profile?",
          "expectedStringOutput": "UNIFIED_CROSS_DEVICE_SINGLE_CUSTOMER_VIEW",
          "acceptableAnswers": [
            "UNIFIED_CROSS_DEVICE_SINGLE_CUSTOMER_VIEW",
            "Single Customer View",
            "Unified View"
          ],
          "primaryMisconceptionId": "MC_DMKT_GA4_WEB_ANALYTICS_EVENT_DRIVEN_MODEL",
          "diagnosisMap": {
            "FRAGMENTED": {
              "misconceptionId": "MC_DMKT_GA4_WEB_ANALYTICS_EVENT_DRIVEN_MODEL",
              "errorExplanation": "Without User-ID sessions are fragmented. With User-ID they achieve a Unified Single Customer View.",
              "recoveryPath": {
                "simplerExplanation": "Matches UNIFIED_CROSS_DEVICE_SINGLE_CUSTOMER_VIEW.",
                "guidedFixPrompt": "Type UNIFIED_CROSS_DEVICE_SINGLE_CUSTOMER_VIEW"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Multi-Touch Marketing Attribution: U-Shaped (Position-Based) & DDA",
    "overviewMetaphor": "U-Shaped Attribution is Awarding the Gold and Silver Medals to the Starter and Finisher of a Relay Race: In a 4-touchpoint customer journey ($1,000 checkout value), Position-Based U-Shaped attribution assigns 40% ($400) to the First Touch (Paid Search: The discovery trigger), 40% ($400) to the Last Touch (Direct Checkout: The closer), and splits the remaining 20% ($200) equally between the 2 middle nurturing touches ($100 each for Blog & Email); this balances brand awareness credit with closing conversion credit.",
    "blocks": [
      {
        "id": "dmkt-d17-b1-u-shaped-attribution-calculation",
        "day": 17,
        "blockNumber": 1,
        "title": "The 40-20-40 Position-Based (U-Shaped) Attribution Model",
        "conceptBudget": {
          "primaryConcept": "U-Shaped Attribution Formula",
          "supportingTerms": [
            "First Touch Weight ($40.0\\% \\implies \\$400$ of $1,000)",
            "Last Touch Weight ($40.0\\% \\implies \\$400$ of $1,000)",
            "Middle Touches ($20.0\\%$ split equally across $N-2$ middle steps: $200 / 2 = \\$100$ each)",
            "Total Conversion Value = $400 + 100 + 100 + 400 = \\$1,000$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d16-b1-ga4-event-driven-funnel",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "U-Shaped Attribution Ledger ($1,000 Revenue across 4 Steps)",
              "boxes": [
                {
                  "label": "Touch 1: Paid Search (First Touch)",
                  "value": "$1,000 x 40.0% = $400.00 (Discovery credit)",
                  "varType": "40% Anchor",
                  "isUpdated": false
                },
                {
                  "label": "Touch 2: Blog & Touch 3: Email",
                  "value": "$200 / 2 = $100.00 each ($200 middle nurturing pool)",
                  "varType": "20% Middle",
                  "isUpdated": false
                },
                {
                  "label": "Touch 4: Direct (Last Touch)",
                  "value": "$1,000 x 40.0% = $400.00 (Closing conversion credit)",
                  "varType": "40% Anchor",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "u_shaped_calc_demo.js",
            "initialCode": "function calculateUShaped(touchpoints, totalRev) {\n  const firstVal = totalRev * 0.40;\n  const lastVal = totalRev * 0.40;\n  const midVal = (totalRev * 0.20) / (touchpoints.length - 2);\n  const res = {};\n  touchpoints.forEach((t, idx) => {\n    if (idx === 0) res[t] = firstVal;\n    else if (idx === touchpoints.length - 1) res[t] = lastVal;\n    else res[t] = midVal;\n  });\n  return {\n    totalRevenue: totalRev,\n    firstTouchWeight: firstVal,\n    lastTouchWeight: lastVal,\n    middleTouchWeight: midVal,\n    attributionMap: res,\n    status: 'U_SHAPED_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateUShaped([\n  'PAID_SEARCH',\n  'SEO_BLOG',\n  'EMAIL_NURTURE',\n  'DIRECT_CHECKOUT'\n], 1000)));",
            "expectedOutput": "{\"totalRevenue\":1000,\"firstTouchWeight\":400,\"lastTouchWeight\":400,\"middleTouchWeight\":100,\"attributionMap\":{\"PAID_SEARCH\":400,\"SEO_BLOG\":100,\"EMAIL_NURTURE\":100,\"DIRECT_CHECKOUT\":400},\"status\":\"U_SHAPED_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How much revenue is attributed to the First Touch channel in a 40-20-40 U-Shaped attribution model for a $1,000 customer purchase ($1,000 \\times 0.40$)?",
          "expectedStringOutput": "400",
          "acceptableAnswers": [
            "400",
            "$400",
            "400.0",
            "firstTouchWeight\":400"
          ],
          "primaryMisconceptionId": "MC_DMKT_MULTI_TOUCH_ATTRIBUTION_MODELS",
          "diagnosisMap": {
            "250": {
              "misconceptionId": "MC_DMKT_MULTI_TOUCH_ATTRIBUTION_MODELS",
              "errorExplanation": "250 is Linear attribution (1000/4). U-shaped gives 40% ($400) to the First Touch.",
              "recoveryPath": {
                "simplerExplanation": "1,000 * 0.40 = 400.",
                "guidedFixPrompt": "Type 400"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d17-b2-data-driven-attribution-dda-machine-learning",
        "day": 17,
        "blockNumber": 2,
        "title": "Google Data-Driven Attribution (DDA): Cooperative Game Theory & Shapley Values",
        "conceptBudget": {
          "primaryConcept": "Data-Driven Attribution (DDA)",
          "supportingTerms": [
            "Shapley Value (Cooperative game theory calculating incremental lift of adding/removing each channel from path)",
            "Replaces rigid rule-based models with dynamic machine learning"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d17-b1-u-shaped-attribution-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Rule-Based vs Data-Driven Attribution",
            "codeSnippet": "// RULE-BASED (Last-Touch / Linear / U-Shaped): Static hard-coded percentage rules\n// DATA-DRIVEN (DDA / Shapley Value):           Machine learning calculates true fractional incremental lift!",
            "lineNotes": {
              "1": "Static heuristics.",
              "2": "Machine learning incrementality."
            }
          },
          {
            "type": "runnable_code",
            "filename": "dda_demo.js",
            "initialCode": "function getGoogleDefaultAttribution() {\n  return 'DATA_DRIVEN_ATTRIBUTION_MACHINE_LEARNING';\n}\n\nconsole.log(getGoogleDefaultAttribution());",
            "expectedOutput": "DATA_DRIVEN_ATTRIBUTION_MACHINE_LEARNING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What machine learning attribution model serves as the default standard in Google Ads and Google Analytics 4?",
          "expectedStringOutput": "DATA_DRIVEN_ATTRIBUTION_MACHINE_LEARNING",
          "acceptableAnswers": [
            "DATA_DRIVEN_ATTRIBUTION_MACHINE_LEARNING",
            "Data-Driven Attribution",
            "DDA"
          ],
          "primaryMisconceptionId": "MC_DMKT_MULTI_TOUCH_ATTRIBUTION_MODELS",
          "diagnosisMap": {
            "LAST_TOUCH": {
              "misconceptionId": "MC_DMKT_MULTI_TOUCH_ATTRIBUTION_MODELS",
              "errorExplanation": "Last-Touch is deprecated. Google defaults to Data-Driven Attribution (DDA).",
              "recoveryPath": {
                "simplerExplanation": "Matches DATA_DRIVEN_ATTRIBUTION_MACHINE_LEARNING.",
                "guidedFixPrompt": "Type DATA_DRIVEN_ATTRIBUTION_MACHINE_LEARNING"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d17-b3-time-decay-attribution-half-life",
        "day": 17,
        "blockNumber": 3,
        "title": "Time-Decay Attribution: 7-Day Exponential Half-Life Weighting",
        "conceptBudget": {
          "primaryConcept": "Time-Decay Exponential Weighting",
          "supportingTerms": [
            "7-Day Half-Life (Touchpoints closest in time to conversion receive exponentially higher credit)",
            "Ideal for short sales cycle transactional e-commerce"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d17-b2-data-driven-attribution-dda-machine-learning",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "time_decay_demo.js",
            "initialCode": "function getTimeDecayHalfLifeDays() {\n  return 7;\n}\n\nconsole.log(getTimeDecayHalfLifeDays());",
            "expectedOutput": "7",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What standard half-life time window in days is typically utilized in Time-Decay attribution algorithms to exponentially discount older touchpoints?",
          "expectedStringOutput": "7",
          "acceptableAnswers": [
            "7",
            "7 days",
            "Seven"
          ],
          "primaryMisconceptionId": "MC_DMKT_MULTI_TOUCH_ATTRIBUTION_MODELS",
          "diagnosisMap": {
            "30": {
              "misconceptionId": "MC_DMKT_MULTI_TOUCH_ATTRIBUTION_MODELS",
              "errorExplanation": "30 days is standard lookback window. The exponential half-life is 7 days.",
              "recoveryPath": {
                "simplerExplanation": "Standard half-life is 7 days.",
                "guidedFixPrompt": "Type 7"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Growth Hacking & The Pirate Metrics Funnel (AARRR)",
    "overviewMetaphor": "Growth Hacking is Captaining a Pirate Ship Across the 5 AARRR Seas: 1. Acquisition (10,000 site visits); 2. Activation (6,000 complete onboarding $\\implies 60.0\\%$ experiencing the 'Aha! moment'); 3. Retention (3,000 return in Week 2 $\\implies 50.0\\%$ retention); 4. Revenue (1,500 buy paid licenses $\\implies 50.0\\%$ paying); 5. Referral (300 invite coworkers $\\implies 20.0\\%$ viral referral); fixing a leaky bucket in Retention delivers $10\\times$ more growth than pouring expensive ad traffic into Acquisition.",
    "blocks": [
      {
        "id": "dmkt-d18-b1-aarrr-pirate-funnel-conversion-rates",
        "day": 18,
        "blockNumber": 1,
        "title": "The AARRR Pirate Metrics Funnel: Acquisition, Activation, Retention, Revenue & Referral",
        "conceptBudget": {
          "primaryConcept": "AARRR Pirate Funnel Metrics",
          "supportingTerms": [
            "Acquisition ($10,000$)",
            "Activation ($6,000 \\implies 60.0\\%$)",
            "Retention ($3,000 \\implies 50.0\\%$)",
            "Revenue ($1,500 \\implies 50.0\\%$)",
            "Referral ($300 \\implies 20.0\\%$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d17-b1-u-shaped-attribution-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "AARRR Pirate Metrics Pipeline (10,000 Acquisition Base)",
              "boxes": [
                {
                  "label": "1. Acquisition -> 2. Activation",
                  "value": "6,000 / 10,000 = 60.00% Activation ('Aha!' onboarding)",
                  "varType": "Activation",
                  "isUpdated": false
                },
                {
                  "label": "3. Retention -> 4. Revenue",
                  "value": "3,000 Retained (50.0%) -> 1,500 Paid Conversions (50.0%)",
                  "varType": "Retention & Rev",
                  "isUpdated": false
                },
                {
                  "label": "5. Referral (Viral Engine)",
                  "value": "300 / 1,500 = 20.00% Referral Rate (K-Factor growth loop!)",
                  "varType": "Referral",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "aarrr_calc_demo.js",
            "initialCode": "function calculateAarrr(acq, act, ret, rev, ref) {\n  return {\n    activationPercent: Number(((act / acq) * 100).toFixed(2)),\n    retentionPercent: Number(((ret / act) * 100).toFixed(2)),\n    revenuePercent: Number(((rev / ret) * 100).toFixed(2)),\n    referralPercent: Number(((ref / rev) * 100).toFixed(2)),\n    status: 'AARRR_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateAarrr(10000, 6000, 3000, 1500, 300)));",
            "expectedOutput": "{\"activationPercent\":60,\"retentionPercent\":50,\"revenuePercent\":50,\"referralPercent\":20,\"status\":\"AARRR_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Activation Rate percentage when 6,000 out of 10,000 acquired users successfully complete onboarding and experience the product's core value ($ (6,000 / 10,000) \\times 100 $)?",
          "expectedStringOutput": "60",
          "acceptableAnswers": [
            "60",
            "60%",
            "60.0",
            "activationPercent\":60"
          ],
          "primaryMisconceptionId": "MC_DMKT_GROWTH_HACKING_AARRR_PIRATE_METRICS",
          "diagnosisMap": {
            "0.6": {
              "misconceptionId": "MC_DMKT_GROWTH_HACKING_AARRR_PIRATE_METRICS",
              "errorExplanation": "0.6 is decimal form. As a percentage, the activation rate is 60.0%.",
              "recoveryPath": {
                "simplerExplanation": "6,000 / 10,000 * 100 = 60%.",
                "guidedFixPrompt": "Type 60"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d18-b2-aha-moment-activation-thresholds",
        "day": 18,
        "blockNumber": 2,
        "title": "Engineering the 'Aha! Moment' (Facebook 7 Friends in 10 Days Rule)",
        "conceptBudget": {
          "primaryConcept": "The 'Aha! Moment' Trigger",
          "supportingTerms": [
            "Facebook benchmark ('Add 7 friends in 10 days')",
            "Slack benchmark ('Send 2,000 team messages')",
            "Dropbox benchmark ('Put 1 file in folder on 1 device')",
            "Compressing Time-to-Value (TTV)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d18-b1-aarrr-pirate-funnel-conversion-rates",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Famous SaaS 'Aha! Moments'",
            "codeSnippet": "// Facebook: Add 7 friends in 10 days   -> Retained for years\n// Slack:    Send 2,000 team messages   -> 93% conversion to paid enterprise\n// PinIT:    Complete 1 proctored day   -> 3x higher job placement readiness!",
            "lineNotes": {
              "1": "Social connection threshold.",
              "2": "Collaboration threshold.",
              "3": "Skill mastery threshold."
            }
          },
          {
            "type": "runnable_code",
            "filename": "aha_moment_demo.js",
            "initialCode": "function evaluateActivationAha(actionsCount, threshold) {\n  return actionsCount >= threshold\n    ? 'AHA_MOMENT_ACHIEVED_HIGH_RETENTION_PREDICTED'\n    : 'INCOMPLETE_ACTIVATION_AT_RISK_OF_CHURN';\n}\n\nconsole.log(evaluateActivationAha(8, 7));\nconsole.log(evaluateActivationAha(3, 7));",
            "expectedOutput": "AHA_MOMENT_ACHIEVED_HIGH_RETENTION_PREDICTED\nINCOMPLETE_ACTIVATION_AT_RISK_OF_CHURN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What user lifecycle status is achieved when a new user successfully crosses the 'Aha! Moment' activation threshold?",
          "expectedStringOutput": "AHA_MOMENT_ACHIEVED_HIGH_RETENTION_PREDICTED",
          "acceptableAnswers": [
            "AHA_MOMENT_ACHIEVED_HIGH_RETENTION_PREDICTED",
            "Aha Moment Achieved",
            "High Retention Predicted"
          ],
          "primaryMisconceptionId": "MC_DMKT_GROWTH_HACKING_AARRR_PIRATE_METRICS",
          "diagnosisMap": {
            "CHURN": {
              "misconceptionId": "MC_DMKT_GROWTH_HACKING_AARRR_PIRATE_METRICS",
              "errorExplanation": "Crossing the threshold locks in retention. Incomplete activation causes churn.",
              "recoveryPath": {
                "simplerExplanation": "Matches AHA_MOMENT_ACHIEVED_HIGH_RETENTION_PREDICTED.",
                "guidedFixPrompt": "Type AHA_MOMENT_ACHIEVED_HIGH_RETENTION_PREDICTED"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d18-b3-leaky-bucket-retention-priority",
        "day": 18,
        "blockNumber": 3,
        "title": "The Leaky Bucket Theorem: Retention as the Foundation of Sustainable Growth",
        "conceptBudget": {
          "primaryConcept": "Retention Before Acquisition Invariant",
          "supportingTerms": [
            "Pouring paid acquisition traffic into a leaky bucket (high churn) burns cash and destroys venture scale",
            "Flattening the cohort retention curve is mandatory before turning on paid marketing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d18-b2-aha-moment-activation-thresholds",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "leaky_bucket_demo.js",
            "initialCode": "function evaluateGrowthPacing(isRetentionCurveFlat) {\n  return isRetentionCurveFlat\n    ? 'SAFE_TO_SCALE_PAID_ACQUISITION_FIREHOSE'\n    : 'FIX_PRODUCT_RETENTION_BEFORE_SPENDING_ON_ADS';\n}\n\nconsole.log(evaluateGrowthPacing(true));\nconsole.log(evaluateGrowthPacing(false));",
            "expectedOutput": "SAFE_TO_SCALE_PAID_ACQUISITION_FIREHOSE\nFIX_PRODUCT_RETENTION_BEFORE_SPENDING_ON_ADS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What strategic mandate must be executed in growth engineering before scaling up paid acquisition ad spend?",
          "expectedStringOutput": "FIX_PRODUCT_RETENTION_BEFORE_SPENDING_ON_ADS",
          "acceptableAnswers": [
            "FIX_PRODUCT_RETENTION_BEFORE_SPENDING_ON_ADS",
            "Fix retention first",
            "Fix retention"
          ],
          "primaryMisconceptionId": "MC_DMKT_GROWTH_HACKING_AARRR_PIRATE_METRICS",
          "diagnosisMap": {
            "SCALE_ADS": {
              "misconceptionId": "MC_DMKT_GROWTH_HACKING_AARRR_PIRATE_METRICS",
              "errorExplanation": "Scaling ads before fixing retention burns cash. Retention must be fixed first.",
              "recoveryPath": {
                "simplerExplanation": "Matches FIX_PRODUCT_RETENTION_BEFORE_SPENDING_ON_ADS.",
                "guidedFixPrompt": "Type FIX_PRODUCT_RETENTION_BEFORE_SPENDING_ON_ADS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "App Store Optimization (ASO) & Mobile User Acquisition",
    "overviewMetaphor": "ASO is Search Engine Optimization and Merchandising Inside Apple App Store & Google Play: 50,000 product page views yielding 15,000 total installs achieves a 30.0% App Store Conversion Rate; if 10,000 installs came from paid Apple Search Ads and 5,000 came from organic search, your Organic Install Multiplier is $1.50\\times$ (every 2 paid installs drag 1 free organic install along with them), reducing your Blended Cost Per Install (CPI).",
    "blocks": [
      {
        "id": "dmkt-d19-b1-aso-conversion-and-organic-multiplier",
        "day": 19,
        "blockNumber": 1,
        "title": "App Store Conversion Rate & The Organic Install Multiplier: $\\frac{\\text{Total Installs}}{\\text{Paid Installs}}$",
        "conceptBudget": {
          "primaryConcept": "ASO Conversion & Organic Multiplier",
          "supportingTerms": [
            "Product Page Views ($50,000$)",
            "Total Installs ($15,000 \\implies 30.0\\%$ App Store CR)",
            "Paid Installs ($10,000$)",
            "Organic Multiplier: $\\frac{15,000}{10,000} = 1.50x$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d18-b1-aarrr-pirate-funnel-conversion-rates",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ASO Performance Ledger (50k Views -> 15k Installs [10k Paid])",
              "boxes": [
                {
                  "label": "Product Page Views",
                  "value": "50,000 App Store / Play Store page impressions",
                  "varType": "Page Views",
                  "isUpdated": false
                },
                {
                  "label": "App Store Conversion Rate",
                  "value": "15,000 / 50,000 = 30.00% Install Conversion Rate",
                  "varType": "App Store CR",
                  "isUpdated": false
                },
                {
                  "label": "Organic Install Multiplier",
                  "value": "15,000 / 10,000 = 1.50x K-Factor Multiplier (50% FREE ORGANIC LIFT!)",
                  "varType": "Multiplier",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "aso_calc_demo.js",
            "initialCode": "function calculateAso(views, totalInstalls, paidInstalls) {\n  const cr = (totalInstalls / views) * 100;\n  const multiplier = totalInstalls / paidInstalls;\n  return {\n    views,\n    totalInstalls,\n    appStoreCrPercent: Number(cr.toFixed(2)),\n    organicMultiplier: Number(multiplier.toFixed(2)),\n    status: 'ASO_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateAso(50000, 15000, 10000)));",
            "expectedOutput": "{\"views\":50000,\"totalInstalls\":15000,\"appStoreCrPercent\":30,\"organicMultiplier\":1.5,\"status\":\"ASO_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Organic Install Multiplier when an app generates 15,000 total installs from 10,000 paid user acquisition installs ($15,000 / 10,000$)?",
          "expectedStringOutput": "1.5",
          "acceptableAnswers": [
            "1.5",
            "1.5x",
            "1.50",
            "organicMultiplier\":1.5"
          ],
          "primaryMisconceptionId": "MC_DMKT_APP_STORE_OPTIMIZATION_ASO_RETENTION",
          "diagnosisMap": {
            "0.67": {
              "misconceptionId": "MC_DMKT_APP_STORE_OPTIMIZATION_ASO_RETENTION",
              "errorExplanation": "0.67 divides paid by total. The multiplier divides Total Installs by Paid Installs: 15,000 / 10,000 = 1.50x.",
              "recoveryPath": {
                "simplerExplanation": "15,000 / 10,000 = 1.5.",
                "guidedFixPrompt": "Type 1.5"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d19-b2-app-screenshot-ab-testing",
        "day": 19,
        "blockNumber": 2,
        "title": "App Store Screenshot A/B Testing & Visual Icon Optimization",
        "conceptBudget": {
          "primaryConcept": "App Store Visual Conversion Optimization",
          "supportingTerms": [
            "First 3 Screenshots (Viewed by 100% of store visitors in search results)",
            "Large bold benefit captions over small UI screenshots boost install CR by 20-35%"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d19-b1-aso-conversion-and-organic-multiplier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "App Store Screenshot Hierarchy",
            "codeSnippet": "// Screenshot 1: Big bold value hook: 'Accelerate Your Career in 30 Days'\n// Screenshot 2: Visual proof of interactive proctored coding editor\n// Screenshot 3: 100% verified certification credential badge!",
            "lineNotes": {
              "1": "Primary benefit hook.",
              "2": "Interactive product proof.",
              "3": "Credibility close."
            }
          },
          {
            "type": "runnable_code",
            "filename": "screenshot_demo.js",
            "initialCode": "function getAsoFirstScreenshotFocus() {\n  return 'BOLD_VALUE_PROPOSITION_BENEFIT_HEADLINE';\n}\n\nconsole.log(getAsoFirstScreenshotFocus());",
            "expectedOutput": "BOLD_VALUE_PROPOSITION_BENEFIT_HEADLINE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What visual design element on the first App Store screenshot produces the highest install conversion rate uplift?",
          "expectedStringOutput": "BOLD_VALUE_PROPOSITION_BENEFIT_HEADLINE",
          "acceptableAnswers": [
            "BOLD_VALUE_PROPOSITION_BENEFIT_HEADLINE",
            "Bold Value Proposition",
            "Benefit Headline"
          ],
          "primaryMisconceptionId": "MC_DMKT_APP_STORE_OPTIMIZATION_ASO_RETENTION",
          "diagnosisMap": {
            "BLANK_UI": {
              "misconceptionId": "MC_DMKT_APP_STORE_OPTIMIZATION_ASO_RETENTION",
              "errorExplanation": "Unlabeled UI screenshots convert poorly. Bold value proposition headlines drive top conversion.",
              "recoveryPath": {
                "simplerExplanation": "Matches BOLD_VALUE_PROPOSITION_BENEFIT_HEADLINE.",
                "guidedFixPrompt": "Type BOLD_VALUE_PROPOSITION_BENEFIT_HEADLINE"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d19-b3-day1-day7-day30-mobile-retention",
        "day": 19,
        "blockNumber": 3,
        "title": "Mobile App Retention Curves: The D1, D7 & D30 Retention Benchmarks",
        "conceptBudget": {
          "primaryConcept": "Mobile Retention Benchmarks",
          "supportingTerms": [
            "D1 Retention ($\\ge 40.0\\%$ of new users return next day: Great onboarding)",
            "D7 Retention ($\\ge 20.0\\%$ return on Day 7: Habit forming)",
            "D30 Retention ($\\ge 10.0\\%$ return on Day 30: Long-term stickiness)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d19-b2-app-screenshot-ab-testing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "retention_benchmarks_demo.js",
            "initialCode": "function evaluateD1Retention(d1Pct) {\n  return d1Pct >= 40.0\n    ? 'TOP_TIER_MOBILE_APP_ONBOARDING'\n    : 'LEAKY_APP_ONBOARDING_FIX_REQUIRED';\n}\n\nconsole.log(evaluateD1Retention(42.5));\nconsole.log(evaluateD1Retention(18.0));",
            "expectedOutput": "TOP_TIER_MOBILE_APP_ONBOARDING\nLEAKY_APP_ONBOARDING_FIX_REQUIRED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the global industry benchmark percentage for Day 1 (D1) mobile app retention to qualify as top-tier app onboarding?",
          "expectedStringOutput": "40",
          "acceptableAnswers": [
            "40",
            "40%",
            "40.0",
            "40.0%"
          ],
          "primaryMisconceptionId": "MC_DMKT_APP_STORE_OPTIMIZATION_ASO_RETENTION",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_DMKT_APP_STORE_OPTIMIZATION_ASO_RETENTION",
              "errorExplanation": "10% applies to Day 30 (D30). Day 1 (D1) requires at least 40% retention.",
              "recoveryPath": {
                "simplerExplanation": "D1 benchmark is 40%.",
                "guidedFixPrompt": "Type 40"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Programmatic Advertising & Real-Time Bidding (RTB)",
    "overviewMetaphor": "Programmatic Advertising is a Wall Street High-Frequency Trading Floor Executed in 100 Milliseconds: When a user opens a web article, the Supply-Side Platform (SSP) puts the ad slot on the Ad Exchange; your Demand-Side Platform (DSP) evaluates the user's cookies and bids in real time; spending $2,500 across 500,000 served impressions yields an effective CPM of $5.00 ($eCPM = \\frac{\\$2,500}{500,000} \\times 1,000$); with 400,000 viewable impressions (80.0%), the campaign surpasses the 70% MRC viewability standard.",
    "blocks": [
      {
        "id": "dmkt-d20-b1-programmatic-ecpm-and-viewability",
        "day": 20,
        "blockNumber": 1,
        "title": "Effective CPM (eCPM) & MRC Ad Viewability Standards",
        "conceptBudget": {
          "primaryConcept": "eCPM & Viewability Formulas",
          "supportingTerms": [
            "$eCPM = \\frac{\\text{Total Spend}}{\\text{Total Impressions}} \\times 1,000$",
            "Spend = $2,500, Impressions = $500,000 \\implies eCPM = \\$5.00$",
            "MRC Viewability Standard: At least 50% pixels in-view for $\\ge 1$ second",
            "Viewability $% = \\frac{400,000}{500,000} \\times 100\\% = 80.0\\% \\ge 70.0\\%$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d19-b1-aso-conversion-and-organic-multiplier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Programmatic Media Balance Sheet ($2,500 Spend, 500k Impressions)",
              "boxes": [
                {
                  "label": "Effective CPM (eCPM)",
                  "value": "($2,500 / 500,000) x 1,000 = $5.00 / thousand impressions",
                  "varType": "eCPM",
                  "isUpdated": false
                },
                {
                  "label": "Viewable Impressions",
                  "value": "400,000 out of 500,000 met MRC standard (80.0% Viewability Rate)",
                  "varType": "Viewability",
                  "isUpdated": false
                },
                {
                  "label": "MRC Quality Compliance",
                  "value": "80.0% >= 70.0% Benchmark -> PASSED TOP QUALITY VIEWABILITY!",
                  "varType": "Compliance",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "programmatic_calc_demo.js",
            "initialCode": "function calculateProgrammatic(spend, impressions, viewable) {\n  const ecpm = (spend / impressions) * 1000;\n  const viewRate = (viewable / impressions) * 100;\n  return {\n    spend,\n    impressions,\n    viewableImpressions: viewable,\n    effectiveCpm: Number(ecpm.toFixed(2)),\n    viewabilityPercent: Number(viewRate.toFixed(2)),\n    isCompliant: viewRate >= 70.0,\n    status: 'PROGRAMMATIC_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateProgrammatic(2500, 500000, 400000)));",
            "expectedOutput": "{\"spend\":2500,\"impressions\":500000,\"viewableImpressions\":400000,\"effectiveCpm\":5,\"viewabilityPercent\":80,\"isCompliant\":true,\"status\":\"PROGRAMMATIC_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Effective Cost Per Mille (eCPM) when $2,500 in programmatic ad spend serves 500,000 total impressions ($ (2,500 / 500,000) \\times 1,000 $)?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "$5",
            "5.0",
            "$5.00",
            "effectiveCpm\":5"
          ],
          "primaryMisconceptionId": "MC_DMKT_PROGRAMMATIC_RTB_DSP_SSP_VIEWABILITY",
          "diagnosisMap": {
            "0.005": {
              "misconceptionId": "MC_DMKT_PROGRAMMATIC_RTB_DSP_SSP_VIEWABILITY",
              "errorExplanation": "0.005 is cost per single impression. Multiplied by 1,000 gives an eCPM of $5.00.",
              "recoveryPath": {
                "simplerExplanation": "(2,500 / 500,000) * 1,000 = $5.00.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d20-b2-dsp-ssp-ad-exchange-architecture",
        "day": 20,
        "blockNumber": 2,
        "title": "The Programmatic Ecosystem: DSPs, SSPs & Ad Exchanges",
        "conceptBudget": {
          "primaryConcept": "DSP vs SSP Roles",
          "supportingTerms": [
            "DSP (Demand-Side Platform: Advertisers manage bids and targeting)",
            "SSP (Supply-Side Platform: Publishers manage ad inventory and yield)",
            "Ad Exchange (Open auction marketplace connecting DSPs and SSPs)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d20-b1-programmatic-ecpm-and-viewability",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Programmatic Roles",
            "codeSnippet": "// Advertisers (Buyers)   -> Use DSP (Demand-Side Platform) to place bids\n// Publishers  (Sellers)  -> Use SSP (Supply-Side Platform) to monetize inventory\n// Central Auction Hub    -> Ad Exchange matches bids in 100ms second-price auction!",
            "lineNotes": {
              "1": "Buyer side.",
              "2": "Seller side.",
              "3": "Market clearinghouse."
            }
          },
          {
            "type": "runnable_code",
            "filename": "programmatic_roles_demo.js",
            "initialCode": "function getBuyerPlatformType() {\n  return 'DEMAND_SIDE_PLATFORM_DSP';\n}\n\nconsole.log(getBuyerPlatformType());",
            "expectedOutput": "DEMAND_SIDE_PLATFORM_DSP",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which software platform is utilized by corporate advertisers and media agencies to configure programmatic audience targeting and submit automated bids?",
          "expectedStringOutput": "DEMAND_SIDE_PLATFORM_DSP",
          "acceptableAnswers": [
            "DEMAND_SIDE_PLATFORM_DSP",
            "DSP",
            "Demand Side Platform"
          ],
          "primaryMisconceptionId": "MC_DMKT_PROGRAMMATIC_RTB_DSP_SSP_VIEWABILITY",
          "diagnosisMap": {
            "SSP": {
              "misconceptionId": "MC_DMKT_PROGRAMMATIC_RTB_DSP_SSP_VIEWABILITY",
              "errorExplanation": "SSPs are used by publishers to sell inventory. Advertisers use DSPs (Demand-Side Platforms).",
              "recoveryPath": {
                "simplerExplanation": "Advertisers use DSPs.",
                "guidedFixPrompt": "Type DEMAND_SIDE_PLATFORM_DSP"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d20-b3-ad-fraud-bot-traffic-detection",
        "day": 20,
        "blockNumber": 3,
        "title": "Programmatic Ad Fraud: Domain Spoofing & Invalid Bot Traffic (IVT)",
        "conceptBudget": {
          "primaryConcept": "Ad Fraud Prevention Invariant",
          "supportingTerms": [
            "Invalid Traffic (IVT: GIVT General Bot Traffic vs SIVT Sophisticated Invalid Traffic)",
            "ads.txt & sellers.json (Authorizes legitimate SSP sellers and eliminates domain spoofing)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d20-b2-dsp-ssp-ad-exchange-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ads_txt_demo.js",
            "initialCode": "function evaluatePublisherVerification(hasAdsTxt) {\n  return hasAdsTxt\n    ? 'VERIFIED_AUTHORIZED_ADS_TXT_SELLER'\n    : 'UNVERIFIED_DOMAIN_SPOOFING_FRAUD_RISK';\n}\n\nconsole.log(evaluatePublisherVerification(true));",
            "expectedOutput": "VERIFIED_AUTHORIZED_ADS_TXT_SELLER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What public web standard file published on a domain's root directory prevents unauthorized domain spoofing and verifies legitimate programmatic ad sellers?",
          "expectedStringOutput": "VERIFIED_AUTHORIZED_ADS_TXT_SELLER",
          "acceptableAnswers": [
            "VERIFIED_AUTHORIZED_ADS_TXT_SELLER",
            "ads.txt",
            "Ads.txt"
          ],
          "primaryMisconceptionId": "MC_DMKT_PROGRAMMATIC_RTB_DSP_SSP_VIEWABILITY",
          "diagnosisMap": {
            "ROBOTS": {
              "misconceptionId": "MC_DMKT_PROGRAMMATIC_RTB_DSP_SSP_VIEWABILITY",
              "errorExplanation": "robots.txt controls web crawlers. Verifying authorized ad sellers uses ads.txt.",
              "recoveryPath": {
                "simplerExplanation": "Matches VERIFIED_AUTHORIZED_ADS_TXT_SELLER.",
                "guidedFixPrompt": "Type VERIFIED_AUTHORIZED_ADS_TXT_SELLER"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Web Analytics, Attribution & Growth Hacking Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete sovereign web analytics, multi-touch attribution, and autonomous growth hacking engine: 1. GA4 event-driven funnel exploration ($4.0\\%$ overall checkout conversion); 2. Position-based U-shaped multi-touch attribution ($40\\%$ First Touch = $400, $40\\%$ Last Touch = $400); 3. AARRR Pirate Metric funnel modeling ($60\\%$ Activation, $50\\%$ Retention); 4. App Store Optimization ($1.50\\times$ organic install multiplier); 5. Programmatic RTB viewability auditing ($80.0\\% \\ge 70\\%$ MRC standard).",
    "blocks": [
      {
        "id": "dmkt-d21-b1-analytics-growth-master-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Analytics, Attribution & Growth Hacking Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Analytics & Growth Engine Synthesis",
          "supportingTerms": [
            "GA4 Funnel Engine",
            "U-Shaped Attribution Engine",
            "AARRR Pirate Funnel",
            "ASO Multiplier",
            "Programmatic Auditor"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d20-b3-ad-fraud-bot-traffic-detection",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Analytics & Growth Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Evaluates GA4 event funnel drop-offs (4% overall conversion)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Calculates U-Shaped 40-20-40 multi-touch attribution shares",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Tracks AARRR Pirate metrics and 1.50x ASO organic multiplier",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Audits 80% programmatic viewability and certifies growth engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "analytics_growth_kernel_demo.js",
            "initialCode": "function runAnalyticsGrowthEngine() {\n  return {\n    ga4Subsystem: 'ONLINE_GA4_FUNNELS_ACTIVE',\n    attributionSubsystem: 'ONLINE_U_SHAPED_ACTIVE',\n    aarrrSubsystem: 'ONLINE_PIRATE_METRICS_ACTIVE',\n    asoSubsystem: 'ONLINE_ASO_MULTIPLIER_ACTIVE',\n    programmaticSubsystem: 'ONLINE_RTB_VIEWABILITY_ACTIVE',\n    engineStatus: 'ANALYTICS_AND_GROWTH_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runAnalyticsGrowthEngine().engineStatus);",
            "expectedOutput": "ANALYTICS_AND_GROWTH_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Analytics, Attribution & Growth Hacking Master Engine?",
          "expectedStringOutput": "ANALYTICS_AND_GROWTH_MASTER_ACTIVE",
          "acceptableAnswers": [
            "ANALYTICS_AND_GROWTH_MASTER_ACTIVE",
            "engineStatus: ANALYTICS_AND_GROWTH_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_DMKT_GA4_WEB_ANALYTICS_EVENT_DRIVEN_MODEL",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DMKT_GA4_WEB_ANALYTICS_EVENT_DRIVEN_MODEL",
              "errorExplanation": "Matches ANALYTICS_AND_GROWTH_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ANALYTICS_AND_GROWTH_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d21-b2-analytics-growth-engine-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Analytics & Growth Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Growth Invariant Verification",
          "supportingTerms": [
            "GA4 Invariant",
            "Attribution Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d21-b1-analytics-growth-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "growth_audit_demo.js",
            "initialCode": "function auditAnalyticsGrowthEngine(ga4Valid, attrValid, aarrrValid, rtbValid) {\n  const passed = ga4Valid && attrValid && aarrrValid && rtbValid;\n  return {\n    ga4Verified: ga4Valid,\n    attributionVerified: attrValid,\n    aarrrVerified: aarrrValid,\n    rtbVerified: rtbValid,\n    grade: passed ? 'ANALYTICS_GROWTH_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditAnalyticsGrowthEngine(true, true, true, true)));",
            "expectedOutput": "{\"ga4Verified\":true,\"attributionVerified\":true,\"aarrrVerified\":true,\"rtbVerified\":true,\"grade\":\"ANALYTICS_GROWTH_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when GA4, Attribution, AARRR, and RTB engines pass 100%?",
          "expectedStringOutput": "ANALYTICS_GROWTH_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "ANALYTICS_GROWTH_ENGINE_AUDIT_PASSED",
            "grade\":\"ANALYTICS_GROWTH_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_DMKT_GA4_WEB_ANALYTICS_EVENT_DRIVEN_MODEL",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DMKT_GA4_WEB_ANALYTICS_EVENT_DRIVEN_MODEL",
              "errorExplanation": "All checks passing awards ANALYTICS_GROWTH_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards ANALYTICS_GROWTH_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type ANALYTICS_GROWTH_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d21-b3-milestone3-dmkt-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Analytics, Attribution & Growth Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Growth Engine Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d21-b2-analytics-growth-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_dmkt_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete Web Analytics, Attribution & Growth Hacking Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete Web Analytics, Attribution & Growth Hacking Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete Web Analytics, Attribution & Growth Hacking Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete Web Analytics, Attribution & Growth Hacking Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_DMKT_GA4_WEB_ANALYTICS_EVENT_DRIVEN_MODEL",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DMKT_GA4_WEB_ANALYTICS_EVENT_DRIVEN_MODEL",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete Web Analytics, Attribution & Growth Hacking Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Dynamic Retargeting & Ad Fatigue Frequency Capping",
    "overviewMetaphor": "Retargeting is Politely Reminding a Shopper What They Picked Up, Not Stalking Them Through Town: Dynamic Product Ads (DPA) show the exact brown leather boots a user browsed on your store; Frequency Capping enforces a strict limit of 3 impressions per user per day; when an ad's frequency climbs to 5.2 and Click-Through Rate drops by 40% (from 2.0% down to 1.2%), the Ad Fatigue index automatically triggers an immediate creative refresh to prevent customer annoyance and wasted budget.",
    "blocks": [
      {
        "id": "dmkt-d22-b1-ad-fatigue-ctr-degradation-trigger",
        "day": 22,
        "blockNumber": 1,
        "title": "Ad Fatigue Detection: Frequency Capping & 30% CTR Degradation Trigger",
        "conceptBudget": {
          "primaryConcept": "Ad Fatigue Index Formula",
          "supportingTerms": [
            "$\\text{CTR Degradation Drop}\\% = \\frac{\\text{Baseline CTR} - \\text{Current CTR}}{\\text{Baseline CTR}} \\times 100\\%$",
            "Baseline CTR = 2.0%, Current CTR = 1.2% $\\implies$ 40.0% Drop",
            "Frequency $> 4.0$ or CTR Drop $\\ge 30.0\\% \\implies$ Trigger immediate creative refresh"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d21-b1-analytics-growth-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Ad Fatigue Diagnostics (Frequency = 5.2, CTR = 1.2% vs 2.0% Baseline)",
              "boxes": [
                {
                  "label": "Daily User Frequency",
                  "value": "5.2 Impressions / user / day (Exceeds 4.0 threshold -> High annoyance risk)",
                  "varType": "Frequency",
                  "isUpdated": false
                },
                {
                  "label": "CTR Degradation",
                  "value": "(2.0% - 1.2%) / 2.0% = 40.00% Performance Drop (>= 30% limit)",
                  "varType": "CTR Drop",
                  "isUpdated": false
                },
                {
                  "label": "Automated Corrective Action",
                  "value": "TRIGGER IMMEDIATE CREATIVE REFRESH (Rotate new hooks and visual angles!)",
                  "varType": "Action",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ad_fatigue_calc_demo.js",
            "initialCode": "function auditFatigue(freq, currentCtr, baselineCtr) {\n  const drop = ((baselineCtr - currentCtr) / baselineCtr) * 100;\n  const isFatigued = freq > 4.0 || drop >= 30.0;\n  return {\n    frequency: freq,\n    currentCtrPercent: currentCtr,\n    baselineCtrPercent: baselineCtr,\n    ctrDropPercent: Number(drop.toFixed(2)),\n    isFatigued,\n    action: isFatigued ? 'TRIGGER_IMMEDIATE_CREATIVE_REFRESH' : 'MAINTAIN_ROTATION',\n    status: 'FATIGUE_AUDITED'\n  };\n}\n\nconsole.log(JSON.stringify(auditFatigue(5.2, 1.2, 2.0)));",
            "expectedOutput": "{\"frequency\":5.2,\"currentCtrPercent\":1.2,\"baselineCtrPercent\":2,\"ctrDropPercent\":40,\"isFatigued\":true,\"action\":\"TRIGGER_IMMEDIATE_CREATIVE_REFRESH\",\"status\":\"FATIGUE_AUDITED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the CTR degradation drop percentage when a retargeting ad's CTR falls from 2.0% down to 1.2% ($ (2.0 - 1.2) / 2.0 \\times 100 $)?",
          "expectedStringOutput": "40",
          "acceptableAnswers": [
            "40",
            "40%",
            "40.0",
            "ctrDropPercent\":40"
          ],
          "primaryMisconceptionId": "MC_DMKT_DYNAMIC_RETARGETING_FREQUENCY_CAPPING",
          "diagnosisMap": {
            "0.8": {
              "misconceptionId": "MC_DMKT_DYNAMIC_RETARGETING_FREQUENCY_CAPPING",
              "errorExplanation": "0.8% is the absolute percentage point difference. Relative degradation is (0.8 / 2.0) * 100 = 40.0%.",
              "recoveryPath": {
                "simplerExplanation": "(0.8 / 2.0) * 100 = 40%.",
                "guidedFixPrompt": "Type 40"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d22-b2-recency-window-segmentation",
        "day": 22,
        "blockNumber": 2,
        "title": "Retargeting Recency Windows (1-3 Days vs 7-14 Days vs 30 Days)",
        "conceptBudget": {
          "primaryConcept": "Recency Window Bidding",
          "supportingTerms": [
            "1-3 Days (Hottest intent: Bid aggressively, show product browsed)",
            "7-14 Days (Warm intent: Offer social proof, comparison charts, and FAQs)",
            "15-30 Days (Cool intent: Special limited-time discount incentive)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d22-b1-ad-fatigue-ctr-degradation-trigger",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Recency Window Bid Strategy",
            "codeSnippet": "// 1-3 DAYS:  Bid 1.5x Max -> High urgency dynamic catalog product ad\n// 7-14 DAYS: Bid 1.0x Base -> Social proof customer review testimonials\n// 30 DAYS:   Bid 0.5x Low  -> 15% Win-back reactivation offer",
            "lineNotes": {
              "1": "Peak purchase intent.",
              "2": "Trust building.",
              "3": "Discount reactivation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "recency_demo.js",
            "initialCode": "function getRecencyStrategy(daysSinceVisit) {\n  if (daysSinceVisit <= 3) return 'HOTTEST_INTENT_DYNAMIC_PRODUCT_CATALOG';\n  if (daysSinceVisit <= 14) return 'WARM_INTENT_SOCIAL_PROOF_TESTIMONIALS';\n  return 'COOL_INTENT_WIN_BACK_DISCOUNT';\n}\n\nconsole.log(getRecencyStrategy(2));\nconsole.log(getRecencyStrategy(10));\nconsole.log(getRecencyStrategy(25));",
            "expectedOutput": "HOTTEST_INTENT_DYNAMIC_PRODUCT_CATALOG\nWARM_INTENT_SOCIAL_PROOF_TESTIMONIALS\nCOOL_INTENT_WIN_BACK_DISCOUNT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which retargeting creative strategy is deployed for shoppers who browsed your product catalog within the last 1 to 3 days?",
          "expectedStringOutput": "HOTTEST_INTENT_DYNAMIC_PRODUCT_CATALOG",
          "acceptableAnswers": [
            "HOTTEST_INTENT_DYNAMIC_PRODUCT_CATALOG",
            "Dynamic Product Catalog",
            "Hottest Intent"
          ],
          "primaryMisconceptionId": "MC_DMKT_DYNAMIC_RETARGETING_FREQUENCY_CAPPING",
          "diagnosisMap": {
            "DISCOUNT": {
              "misconceptionId": "MC_DMKT_DYNAMIC_RETARGETING_FREQUENCY_CAPPING",
              "errorExplanation": "Discounts are reserved for cold win-back leads (15-30 days). Recent visitors receive dynamic product catalog ads.",
              "recoveryPath": {
                "simplerExplanation": "Matches HOTTEST_INTENT_DYNAMIC_PRODUCT_CATALOG.",
                "guidedFixPrompt": "Type HOTTEST_INTENT_DYNAMIC_PRODUCT_CATALOG"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d22-b3-burn-pixel-purchaser-exclusion",
        "day": 22,
        "blockNumber": 3,
        "title": "The Burn Pixel: Excluding Recent Purchasers from Retargeting",
        "conceptBudget": {
          "primaryConcept": "Burn Pixel Purchaser Exclusion",
          "supportingTerms": [
            "Burn Pixel (Immediately firing upon order confirmation to add customer to 180-day retargeting exclusion list)",
            "Prevents showing ads for products the user already bought, saving 15-20% of ad spend"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d22-b2-recency-window-segmentation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "burn_pixel_demo.js",
            "initialCode": "function evaluateRetargetingEligibility(hasPurchasedInLast30Days) {\n  return hasPurchasedInLast30Days\n    ? 'EXCLUDE_VIA_BURN_PIXEL_PREVENT_WASTE'\n    : 'SERVE_ACTIVE_RETARGETING_AD';\n}\n\nconsole.log(evaluateRetargetingEligibility(true));\nconsole.log(evaluateRetargetingEligibility(false));",
            "expectedOutput": "EXCLUDE_VIA_BURN_PIXEL_PREVENT_WASTE\nSERVE_ACTIVE_RETARGETING_AD",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What tracking mechanism immediately excludes recent buyers from retargeting campaigns to avoid wasting ad budget on completed purchases?",
          "expectedStringOutput": "EXCLUDE_VIA_BURN_PIXEL_PREVENT_WASTE",
          "acceptableAnswers": [
            "EXCLUDE_VIA_BURN_PIXEL_PREVENT_WASTE",
            "Burn Pixel",
            "Burn pixel exclusion"
          ],
          "primaryMisconceptionId": "MC_DMKT_DYNAMIC_RETARGETING_FREQUENCY_CAPPING",
          "diagnosisMap": {
            "SERVE": {
              "misconceptionId": "MC_DMKT_DYNAMIC_RETARGETING_FREQUENCY_CAPPING",
              "errorExplanation": "Showing ads for products already bought wastes budget. The Burn Pixel excludes recent buyers.",
              "recoveryPath": {
                "simplerExplanation": "Matches EXCLUDE_VIA_BURN_PIXEL_PREVENT_WASTE.",
                "guidedFixPrompt": "Type EXCLUDE_VIA_BURN_PIXEL_PREVENT_WASTE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Customer Lifetime Value to CAC Ratio (CLV:CAC >= 3:1)",
    "overviewMetaphor": "The CLV to CAC Ratio is the Iron Law of Venture Unit Economics: Customer Lifetime Value ($CLV = \\frac{\\text{ARPU} \\times \\text{GM}\\%}{\\text{Monthly Churn}\\%}$) measures the total lifetime gross profit generated by a customer; with $100/mo ARPU, 80% margin, and 5% monthly churn, a customer yields $1,600 in lifetime gross margin ($CLV = \\frac{\\$100 \\times 0.80}{0.05} = \\$1,600$); acquiring that customer for a $400 CAC creates a $4.0\\times$ Golden Ratio ($CLV:CAC = 4.0 \\ge 3.0$), unlocking limitless profitable venture scalability.",
    "blocks": [
      {
        "id": "dmkt-d23-b1-clv-to-cac-golden-ratio",
        "day": 23,
        "blockNumber": 1,
        "title": "The Golden CLV:CAC Ratio: $CLV = \\frac{\\text{ARPU} \\times \\text{GM}\\%}{\\text{Churn}\\%}$ and $CLV:CAC \\ge 3.0$",
        "conceptBudget": {
          "primaryConcept": "CLV to CAC Unit Economics Ratio",
          "supportingTerms": [
            "$ARPU = \\$100/mo, GM = 80\\%, Churn = 5.0\\% \\implies CLV = \\frac{80}{0.05} = \\$1,600$",
            "$CAC = \\$400 \\implies Ratio = \\frac{1,600}{400} = 4.0x$",
            "Golden Ratio Benchmark: $\\ge 3.0 \\implies$ Profitable venture scale; $< 1.0 \\implies$ Immediate bankruptcy"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d22-b1-ad-fatigue-ctr-degradation-trigger",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Unit Economics Balance Sheet ($100 ARPU, 80% Margin, 5% Churn, $400 CAC)",
              "boxes": [
                {
                  "label": "Customer Lifetime Value",
                  "value": "($100 x 0.80) / 0.05 = $80 / 0.05 = $1,600.00 Gross Profit / User",
                  "varType": "CLV",
                  "isUpdated": false
                },
                {
                  "label": "Customer Acquisition Cost",
                  "value": "$400.00 Blended Sales & Marketing CAC",
                  "varType": "CAC",
                  "isUpdated": false
                },
                {
                  "label": "The Golden CLV:CAC Ratio",
                  "value": "$1,600 / $400 = 4.00x (HIGHLY PROFITABLE VENTURE SCALE!)",
                  "varType": "Ratio",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "clv_cac_calc_demo.js",
            "initialCode": "function calculateClvCac(arpu, gmPct, churnPct, cac) {\n  const clv = (arpu * (gmPct / 100)) / (churnPct / 100);\n  const ratio = clv / cac;\n  return {\n    customerLifetimeValue: Number(clv.toFixed(2)),\n    cac,\n    clvToCacRatio: Number(ratio.toFixed(2)),\n    isHealthy: ratio >= 3.0,\n    status: 'UNIT_ECONOMICS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateClvCac(100, 80, 5, 400)));",
            "expectedOutput": "{\"customerLifetimeValue\":1600,\"cac\":400,\"clvToCacRatio\":4,\"isHealthy\":true,\"status\":\"UNIT_ECONOMICS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the CLV to CAC Ratio when Customer Lifetime Value is $1,600 and Customer Acquisition Cost is $400 ($1,600 / 400$)?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "4.0",
            "4.0x",
            "clvToCacRatio\":4"
          ],
          "primaryMisconceptionId": "MC_DMKT_OMNICHANNEL_CLV_TO_CAC_RATIO",
          "diagnosisMap": {
            "0.25": {
              "misconceptionId": "MC_DMKT_OMNICHANNEL_CLV_TO_CAC_RATIO",
              "errorExplanation": "0.25 divides CAC by CLV. The ratio divides CLV by CAC: 1,600 / 400 = 4.0x.",
              "recoveryPath": {
                "simplerExplanation": "1,600 / 400 = 4.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d23-b2-cac-payback-period-months",
        "day": 23,
        "blockNumber": 2,
        "title": "CAC Payback Period: $\\text{Payback Months} = \\frac{\\text{CAC}}{\\text{ARPU} \\times \\text{GM}\\%}$",
        "conceptBudget": {
          "primaryConcept": "CAC Payback Period Formula",
          "supportingTerms": [
            "$\\text{CAC Payback} = \\frac{\\$400}{\\$100 \\times 0.80} = \\frac{\\$400}{\\$80} = 5.0$ months",
            "Benchmark: $\\le 12$ months is elite venture standard; $> 24$ months risks severe cash flow insolvency"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d23-b1-clv-to-cac-golden-ratio",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CAC Payback Invariant",
            "codeSnippet": "// CAC = $400, Monthly Margin = $80 -> Payback = 400 / 80 = 5.0 Months (Cash recovered in 5 months!)\n// CAC = $1,200, Monthly Margin = $40 -> Payback = 1200 / 40 = 30.0 Months (DANGEROUS CASH DRAIN)",
            "lineNotes": {
              "1": "Elite payback period.",
              "2": "Insolvent burn rate."
            }
          },
          {
            "type": "runnable_code",
            "filename": "payback_demo.js",
            "initialCode": "function calculatePaybackMonths(cac, monthlyMargin) {\n  return cac / monthlyMargin;\n}\n\nconsole.log(calculatePaybackMonths(400, 80));",
            "expectedOutput": "5",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many months are required to break even on a $400 CAC when each customer generates $80 in monthly gross profit ($400 / 80$)?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "5 months",
            "5.0",
            "Five months"
          ],
          "primaryMisconceptionId": "MC_DMKT_OMNICHANNEL_CLV_TO_CAC_RATIO",
          "diagnosisMap": {
            "0.2": {
              "misconceptionId": "MC_DMKT_OMNICHANNEL_CLV_TO_CAC_RATIO",
              "errorExplanation": "0.2 is 80 / 400. Payback months divides CAC by monthly margin: 400 / 80 = 5.0 months.",
              "recoveryPath": {
                "simplerExplanation": "400 / 80 = 5.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d23-b3-blended-vs-paid-cac",
        "day": 23,
        "blockNumber": 3,
        "title": "Blended CAC vs Paid CAC: The Organic Acquisition Multiplier",
        "conceptBudget": {
          "primaryConcept": "Blended vs Paid CAC Dynamics",
          "supportingTerms": [
            "Paid CAC (Total ad spend divided strictly by paid ad customers)",
            "Blended CAC (Total sales & marketing spend divided by ALL customers [Paid + Organic + Word of Mouth])",
            "Strong SEO/Word-of-mouth cuts Blended CAC in half"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d23-b2-cac-payback-period-months",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "blended_cac_demo.js",
            "initialCode": "function calculateBlendedCac(totalSpend, totalNewCustomers) {\n  return totalSpend / totalNewCustomers;\n}\n\nconsole.log(calculateBlendedCac(100000, 500));",
            "expectedOutput": "200",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Blended Customer Acquisition Cost (CAC) when $100,000 in total marketing spend acquires 500 total customers across all channels ($100,000 / 500$)?",
          "expectedStringOutput": "200",
          "acceptableAnswers": [
            "200",
            "$200",
            "200.0",
            "$200.00"
          ],
          "primaryMisconceptionId": "MC_DMKT_OMNICHANNEL_CLV_TO_CAC_RATIO",
          "diagnosisMap": {
            "500": {
              "misconceptionId": "MC_DMKT_OMNICHANNEL_CLV_TO_CAC_RATIO",
              "errorExplanation": "500 is total customers. Spending $100,000 across 500 customers results in a $200 Blended CAC.",
              "recoveryPath": {
                "simplerExplanation": "100,000 / 500 = 200.",
                "guidedFixPrompt": "Type 200"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Community & Social Commerce: WhatsApp Business API & D2C Live Selling",
    "overviewMetaphor": "Conversational Commerce is Opening a Direct VIP Lounge in Every Customer's Pocket: WhatsApp Business API broadcast messages achieve an astounding 98.0% open rate and 8.0% sales conversion (800 sales from 10,000 sends), compared to email's 20.0% open and 2.0% conversion (200 sales); WhatsApp generates a massive $4.0\\times$ sales multiplier, enabling conversational checkout, automated shipping updates, and direct live commerce.",
    "blocks": [
      {
        "id": "dmkt-d24-b1-whatsapp-commerce-sales-multiplier",
        "day": 24,
        "blockNumber": 1,
        "title": "WhatsApp Conversational Commerce: 98% Open Rate & $4.0\\times$ Sales Multiplier",
        "conceptBudget": {
          "primaryConcept": "Conversational Channel Sales Multiplier",
          "supportingTerms": [
            "WhatsApp Broadcast: $98.0\\%$ Open Rate, $8.0\\%$ Sales Conversion Rate ($800$ sales per 10,000 sends)",
            "Email Marketing: $20.0\\%$ Open Rate, $2.0\\%$ Sales Conversion Rate ($200$ sales per 10,000 sends)",
            "Sales Multiplier: $\\frac{800}{200} = 4.0x$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d23-b1-clv-to-cac-golden-ratio",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Channel Performance Comparison (10,000 Broadcast Sends)",
              "boxes": [
                {
                  "label": "WhatsApp Broadcast (10k)",
                  "value": "9,800 Opens (98.0%) -> 800 Completed Sales (8.00% Conv)",
                  "varType": "WhatsApp",
                  "isUpdated": false
                },
                {
                  "label": "Email Broadcast (10k)",
                  "value": "2,000 Opens (20.0%) -> 200 Completed Sales (2.00% Conv)",
                  "varType": "Email",
                  "isUpdated": false
                },
                {
                  "label": "Conversational Multiplier",
                  "value": "800 / 200 = 4.00x SALES VOLUME ADVANTAGE!",
                  "varType": "Multiplier",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "wa_calc_demo.js",
            "initialCode": "function compareChannels(waSends, emailSends) {\n  const waSales = waSends * 0.08;\n  const emailSales = emailSends * 0.02;\n  const multiplier = waSales / emailSales;\n  return {\n    whatsappSales: Math.round(waSales),\n    emailSales: Math.round(emailSales),\n    multiplier: Number(multiplier.toFixed(2)),\n    status: 'CHANNELS_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(compareChannels(10000, 10000)));",
            "expectedOutput": "{\"whatsappSales\":800,\"emailSales\":200,\"multiplier\":4,\"status\":\"CHANNELS_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the sales volume multiplier achieved by WhatsApp (800 sales) compared to email (200 sales) from 10,000 broadcast sends ($800 / 200$)?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "4x",
            "4.0",
            "multiplier\":4"
          ],
          "primaryMisconceptionId": "MC_DMKT_COMMUNITY_COMMERCE_WHATSAPP_D2C",
          "diagnosisMap": {
            "0.25": {
              "misconceptionId": "MC_DMKT_COMMUNITY_COMMERCE_WHATSAPP_D2C",
              "errorExplanation": "0.25 divides email by WhatsApp. WhatsApp produces 800 / 200 = 4.0x more sales.",
              "recoveryPath": {
                "simplerExplanation": "800 / 200 = 4.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d24-b2-meta-whatsapp-template-guidelines",
        "day": 24,
        "blockNumber": 2,
        "title": "Meta WhatsApp Cloud API Template Categories: Marketing, Utility & Authentication",
        "conceptBudget": {
          "primaryConcept": "WhatsApp Cloud API Categories",
          "supportingTerms": [
            "Marketing Templates (Promotions, offers, product launches: Requires explicit 24h opt-in)",
            "Utility Templates (Order confirmations, tracking updates, receipts)",
            "Authentication Templates (One-time passwords OTP)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d24-b1-whatsapp-commerce-sales-multiplier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "WhatsApp API Categories",
            "codeSnippet": "// MARKETING:      'Flash Sale: 20% off all courses!' (Requires marketing opt-in)\n// UTILITY:        'Your package has shipped! Tracking: #9876'\n// AUTHENTICATION: 'Your PinIT security login code is 492810'",
            "lineNotes": {
              "1": "Promotional message.",
              "2": "Transaction update.",
              "3": "Security OTP."
            }
          },
          {
            "type": "runnable_code",
            "filename": "wa_templates_demo.js",
            "initialCode": "function classifyWaTemplate(isPromotional) {\n  return isPromotional\n    ? 'MARKETING_TEMPLATE_REQUIRES_OPT_IN'\n    : 'UTILITY_TRANSACTIONAL_UPDATE';\n}\n\nconsole.log(classifyWaTemplate(true));\nconsole.log(classifyWaTemplate(false));",
            "expectedOutput": "MARKETING_TEMPLATE_REQUIRES_OPT_IN\nUTILITY_TRANSACTIONAL_UPDATE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which WhatsApp Business API template category is assigned to promotional discount announcements and product launch campaigns?",
          "expectedStringOutput": "MARKETING_TEMPLATE_REQUIRES_OPT_IN",
          "acceptableAnswers": [
            "MARKETING_TEMPLATE_REQUIRES_OPT_IN",
            "Marketing",
            "Marketing Template"
          ],
          "primaryMisconceptionId": "MC_DMKT_COMMUNITY_COMMERCE_WHATSAPP_D2C",
          "diagnosisMap": {
            "UTILITY": {
              "misconceptionId": "MC_DMKT_COMMUNITY_COMMERCE_WHATSAPP_D2C",
              "errorExplanation": "Utility templates are for order shipping updates. Promotional campaigns use Marketing templates.",
              "recoveryPath": {
                "simplerExplanation": "Matches MARKETING_TEMPLATE_REQUIRES_OPT_IN.",
                "guidedFixPrompt": "Type MARKETING_TEMPLATE_REQUIRES_OPT_IN"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d24-b3-d2c-live-commerce-selling",
        "day": 24,
        "blockNumber": 3,
        "title": "D2C Live Stream Commerce & Instant In-Stream Purchasing",
        "conceptBudget": {
          "primaryConcept": "Live Stream Social Commerce",
          "supportingTerms": [
            "Live Stream Commerce (Host showcases product on TikTok/Instagram live with 1-click in-stream checkout)",
            "Time-limited live flash pricing boosts purchase urgency"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d24-b2-meta-whatsapp-template-guidelines",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "live_commerce_demo.js",
            "initialCode": "function getLiveCommerceMechanism() {\n  return 'ONE_CLICK_IN_STREAM_SOCIAL_CHECKOUT';\n}\n\nconsole.log(getLiveCommerceMechanism());",
            "expectedOutput": "ONE_CLICK_IN_STREAM_SOCIAL_CHECKOUT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What checkout mechanism enables shoppers to purchase items instantly during a live stream broadcast without leaving the social app?",
          "expectedStringOutput": "ONE_CLICK_IN_STREAM_SOCIAL_CHECKOUT",
          "acceptableAnswers": [
            "ONE_CLICK_IN_STREAM_SOCIAL_CHECKOUT",
            "In stream checkout",
            "Social checkout"
          ],
          "primaryMisconceptionId": "MC_DMKT_COMMUNITY_COMMERCE_WHATSAPP_D2C",
          "diagnosisMap": {
            "EXTERNAL": {
              "misconceptionId": "MC_DMKT_COMMUNITY_COMMERCE_WHATSAPP_D2C",
              "errorExplanation": "Redirecting to external websites causes high drop-off. Live shopping uses 1-click in-stream checkout.",
              "recoveryPath": {
                "simplerExplanation": "Matches ONE_CLICK_IN_STREAM_SOCIAL_CHECKOUT.",
                "guidedFixPrompt": "Type ONE_CLICK_IN_STREAM_SOCIAL_CHECKOUT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Marketing Mix Modeling (MMM) & Incrementality Geo-Testing",
    "overviewMetaphor": "Geo-Testing is the Gold-Standard Double-Blind Medical Trial of Paid Advertising: If you run ads everywhere, you cannot prove if customers bought because of the ads or would have bought anyway (Brand Search Cannibalization); in a Geo-Lift Holdout experiment, you run ads in Texas ($125,000 sales) and completely black out ads in an identical Control region like Ohio ($100,000 organic baseline sales); the $25,000 difference proves an indisputable +25.0% incremental sales lift caused specifically by your advertising.",
    "blocks": [
      {
        "id": "dmkt-d25-b1-geo-lift-incrementality-lift",
        "day": 25,
        "blockNumber": 1,
        "title": "Geo-Lift Incrementality: True Lift $% = \\frac{\\text{Treated} - \\text{Control}}{\\text{Control}} \\times 100\\%$",
        "conceptBudget": {
          "primaryConcept": "Geo-Lift Incremental Sales Lift",
          "supportingTerms": [
            "Treated Region (With ad spend: $\\$125,000$ sales)",
            "Control Region Baseline (No ad spend holdout: $\\$100,000$ sales)",
            "Incremental Lift Dollars: $\\$125,000 - \\$100,000 = \\$25,000$",
            "Incremental Lift $% = \\frac{\\$25,000}{\\$100,000} \\times 100\\% = +25.0\\%$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d24-b1-whatsapp-commerce-sales-multiplier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Geo-Lift Incrementality Experiment ($125k Treated vs $100k Control)",
              "boxes": [
                {
                  "label": "Treated Region (Ads Active)",
                  "value": "$125,000 Gross Sales in active ad DMA market",
                  "varType": "Treated Sales",
                  "isUpdated": false
                },
                {
                  "label": "Control Region (Ad Holdout)",
                  "value": "$100,000 Baseline Sales in holdout market (0 ad spend)",
                  "varType": "Control Sales",
                  "isUpdated": false
                },
                {
                  "label": "True Incremental Lift",
                  "value": "($125k - $100k) / $100k = +25.00% PROVEN INCREMENTAL SALES LIFT!",
                  "varType": "Incremental Lift",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "geo_lift_calc_demo.js",
            "initialCode": "function calculateGeoLift(treated, control) {\n  const liftDollars = treated - control;\n  const liftPct = (liftDollars / control) * 100;\n  return {\n    treatedSales: treated,\n    controlSales: control,\n    incrementalLiftDollars: liftDollars,\n    incrementalLiftPercent: Number(liftPct.toFixed(2)),\n    status: 'INCREMENTALITY_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateGeoLift(125000, 100000)));",
            "expectedOutput": "{\"treatedSales\":125000,\"controlSales\":100000,\"incrementalLiftDollars\":25000,\"incrementalLiftPercent\":25,\"status\":\"INCREMENTALITY_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the incremental sales lift percentage achieved when a treated ad region ($125,000) outperforms an ad-free control region ($100,000) ($ (125,000 - 100,000) / 100,000 \\times 100 $)?",
          "expectedStringOutput": "25",
          "acceptableAnswers": [
            "25",
            "25%",
            "25.0",
            "incrementalLiftPercent\":25"
          ],
          "primaryMisconceptionId": "MC_DMKT_MARKETING_MIX_MODELING_INCREMENTALITY",
          "diagnosisMap": {
            "0.25": {
              "misconceptionId": "MC_DMKT_MARKETING_MIX_MODELING_INCREMENTALITY",
              "errorExplanation": "0.25 is decimal form. Multiplied by 100 gives an incremental lift of 25.0%.",
              "recoveryPath": {
                "simplerExplanation": "25,000 / 100,000 * 100 = 25%.",
                "guidedFixPrompt": "Type 25"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d25-b2-marketing-mix-modeling-mmm-econometrics",
        "day": 25,
        "blockNumber": 2,
        "title": "Marketing Mix Modeling (MMM): Econometric Regression & Adstock Decay",
        "conceptBudget": {
          "primaryConcept": "Marketing Mix Modeling (MMM)",
          "supportingTerms": [
            "Adstock Decay (Advertising impact lingers over weeks following Weibull distribution)",
            "Macro Econometric Regression (Measures impact of TV, Search, Social, Seasonality, and Price changes on total revenue)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d25-b1-geo-lift-incrementality-lift",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "MTA vs MMM Comparison",
            "codeSnippet": "// Multi-Touch Attribution (MTA): Bottom-up user cookie tracking (Fails with cookie loss)\n// Marketing Mix Modeling (MMM):   Top-down aggregate econometric regression (100% privacy-safe!)",
            "lineNotes": {
              "1": "Bottom up user level.",
              "2": "Top down macro econometric."
            }
          },
          {
            "type": "runnable_code",
            "filename": "mmm_demo.js",
            "initialCode": "function getMmmPillarType() {\n  return 'TOP_DOWN_ECONOMETRIC_AGGREGATE_REGRESSION';\n}\n\nconsole.log(getMmmPillarType());",
            "expectedOutput": "TOP_DOWN_ECONOMETRIC_AGGREGATE_REGRESSION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is Marketing Mix Modeling (MMM) structured to provide 100% privacy-safe revenue attribution without relying on individual user tracking cookies?",
          "expectedStringOutput": "TOP_DOWN_ECONOMETRIC_AGGREGATE_REGRESSION",
          "acceptableAnswers": [
            "TOP_DOWN_ECONOMETRIC_AGGREGATE_REGRESSION",
            "Top Down Econometric",
            "Econometric Regression"
          ],
          "primaryMisconceptionId": "MC_DMKT_MARKETING_MIX_MODELING_INCREMENTALITY",
          "diagnosisMap": {
            "COOKIE": {
              "misconceptionId": "MC_DMKT_MARKETING_MIX_MODELING_INCREMENTALITY",
              "errorExplanation": "MMM does not use cookies. It uses top-down econometric aggregate regression.",
              "recoveryPath": {
                "simplerExplanation": "Matches TOP_DOWN_ECONOMETRIC_AGGREGATE_REGRESSION.",
                "guidedFixPrompt": "Type TOP_DOWN_ECONOMETRIC_AGGREGATE_REGRESSION"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d25-b3-brand-search-cannibalization-audit",
        "day": 25,
        "blockNumber": 3,
        "title": "Auditing Paid Brand Search Cannibalization",
        "conceptBudget": {
          "primaryConcept": "Brand Cannibalization Invariant",
          "supportingTerms": [
            "Paid Brand Search (Bidding on your own brand name e.g. 'Nike')",
            "Incrementality Test (Pausing brand ads when no competitor is bidding reveals 98% of clicks still come through free organic ranking #1)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d25-b2-marketing-mix-modeling-mmm-econometrics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "brand_cannibalize_demo.js",
            "initialCode": "function evaluateBrandSearchBidding(isCompetitorPoachingBrandName) {\n  return isCompetitorPoachingBrandName\n    ? 'BID_DEFENSIVELY_ON_BRAND_NAME'\n    : 'PAUSE_BRAND_SEARCH_CAPTURE_100_PERCENT_ORGANICALLY';\n}\n\nconsole.log(evaluateBrandSearchBidding(false));\nconsole.log(evaluateBrandSearchBidding(true));",
            "expectedOutput": "PAUSE_BRAND_SEARCH_CAPTURE_100_PERCENT_ORGANICALLY\nBID_DEFENSIVELY_ON_BRAND_NAME",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What money-saving action should be executed on paid brand search ads when no competitors are actively bidding on your corporate brand keyword?",
          "expectedStringOutput": "PAUSE_BRAND_SEARCH_CAPTURE_100_PERCENT_ORGANICALLY",
          "acceptableAnswers": [
            "PAUSE_BRAND_SEARCH_CAPTURE_100_PERCENT_ORGANICALLY",
            "Pause Brand Search",
            "Pause brand ads"
          ],
          "primaryMisconceptionId": "MC_DMKT_MARKETING_MIX_MODELING_INCREMENTALITY",
          "diagnosisMap": {
            "DOUBLE_BID": {
              "misconceptionId": "MC_DMKT_MARKETING_MIX_MODELING_INCREMENTALITY",
              "errorExplanation": "Paying for searches you already own organically wastes money. If competitors are absent, pause brand search.",
              "recoveryPath": {
                "simplerExplanation": "Matches PAUSE_BRAND_SEARCH_CAPTURE_100_PERCENT_ORGANICALLY.",
                "guidedFixPrompt": "Type PAUSE_BRAND_SEARCH_CAPTURE_100_PERCENT_ORGANICALLY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "AI in Digital Marketing: Generative Creative Generation & Predictive Churn",
    "overviewMetaphor": "AI in Digital Marketing is an Autonomous Growth Factory Operating 24/7: Generative AI synthesizes 100 custom ad creatives and copy angles in seconds; Predictive Machine Learning calculates real-time customer churn risk; when a customer's product usage drops by 50%, support tickets hit 4, and NPS falls to 3, the AI calculates a 66.0% Churn Probability ($Risk = (50 \\times 0.5) + (4 \\times 5) + ((10-3) \\times 3) = 66.0$) and automatically deploys a VIP Customer Success intervention before they leave.",
    "blocks": [
      {
        "id": "dmkt-d26-b1-predictive-churn-risk-scoring",
        "day": 26,
        "blockNumber": 1,
        "title": "Predictive Churn Risk Scoring: Usage Drop, Ticket Velocity & NPS Dissatisfaction",
        "conceptBudget": {
          "primaryConcept": "Predictive Churn Scoring Formula",
          "supportingTerms": [
            "$Risk Score = (\\text{Usage Drop}\\% \\times 0.5) + (\\text{Tickets} \\times 5.0) + ((10 - NPS) \\times 3.0)$",
            "Usage Drop = 50%, Tickets = 4, NPS = 3 $\\implies Risk = 25 + 20 + 21 = 66.0$",
            "Risk $\\ge 60.0 \\implies$ Automated VIP Success outreach & 20% renewal discount trigger"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d25-b1-geo-lift-incrementality-lift",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "AI Churn Scoring Engine (50% Drop, 4 Tickets, NPS 3)",
              "boxes": [
                {
                  "label": "Product Inactivity",
                  "value": "50% Drop in Weekly Active Usage x 0.5 = 25.0 Risk Points",
                  "varType": "Inactivity",
                  "isUpdated": false
                },
                {
                  "label": "Support Friction & NPS",
                  "value": "4 Tickets (20.0 pts) + (10 - 3) x 3 (21.0 pts) = 41.0 Points",
                  "varType": "Friction",
                  "isUpdated": false
                },
                {
                  "label": "Total Churn Probability",
                  "value": "25.0 + 41.0 = 66.00% HIGH CHURN RISK -> TRIGGER INTERVENTION!",
                  "varType": "Risk Score",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "churn_ai_calc_demo.js",
            "initialCode": "function calculateChurnRisk(usageDrop, tickets, nps) {\n  let risk = (usageDrop * 0.5) + (tickets * 5.0) + ((10 - nps) * 3.0);\n  risk = Math.min(100, Math.max(0, risk));\n  const isHigh = risk >= 60.0;\n  return {\n    churnRiskScore: Number(risk.toFixed(1)),\n    isHighRisk: isHigh,\n    action: isHigh ? 'DEPLOY_VIP_SUCCESS_CALL_AND_RENEWAL_DISCOUNT' : 'STANDARD_NURTURE',\n    status: 'CHURN_PREDICTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateChurnRisk(50, 4, 3)));",
            "expectedOutput": "{\"churnRiskScore\":66,\"isHighRisk\":true,\"action\":\"DEPLOY_VIP_SUCCESS_CALL_AND_RENEWAL_DISCOUNT\",\"status\":\"CHURN_PREDICTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Predictive Churn Risk score for a customer with 50% usage drop, 4 support tickets, and an NPS rating of 3 ($ (50 \\times 0.5) + (4 \\times 5) + (7 \\times 3) $)?",
          "expectedStringOutput": "66",
          "acceptableAnswers": [
            "66",
            "66.0",
            "66%",
            "churnRiskScore\":66"
          ],
          "primaryMisconceptionId": "MC_DMKT_AI_MARKETING_GENERATIVE_CREATIVE_LEADS",
          "diagnosisMap": {
            "45": {
              "misconceptionId": "MC_DMKT_AI_MARKETING_GENERATIVE_CREATIVE_LEADS",
              "errorExplanation": "45 forgets the NPS dissatisfaction component. Total risk is 25 + 20 + 21 = 66.0.",
              "recoveryPath": {
                "simplerExplanation": "25 + 20 + 21 = 66.",
                "guidedFixPrompt": "Type 66"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d26-b2-multimodal-generative-ai-ad-creative",
        "day": 26,
        "blockNumber": 2,
        "title": "Multimodal Generative AI: Synthesizing 100 Ad Creatives in Parallel",
        "conceptBudget": {
          "primaryConcept": "Multimodal Creative Generation",
          "supportingTerms": [
            "Generative Image & Video Diffusion models (Product placed in 20 background environments)",
            "LLM Copywriting Engines (Crafting 10 emotional angles: Pain relief, Aspirations, Social proof)",
            "Reduces creative production costs by 85%"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d26-b1-predictive-churn-risk-scoring",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Generative AI Ad Synthesis",
            "codeSnippet": "// 1. Generate 10 visual environments via Diffusion (Beach, City, Studio, Home)\n// 2. Generate 10 copy hooks via LLM (Question, Statistic, Fear-of-missing-out, Humor)\n// 3. Automated Synthesis = 100 localized high-converting ad variations ready for testing!",
            "lineNotes": {
              "1": "Visual variation.",
              "2": "Copy angle variation.",
              "3": "Permutation matrix."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ai_creative_demo.js",
            "initialCode": "function getGenerativeCreativeEfficiency() {\n  return '85_PERCENT_COST_REDUCTION_AND_10X_TESTING_VELOCITY';\n}\n\nconsole.log(getGenerativeCreativeEfficiency());",
            "expectedOutput": "85_PERCENT_COST_REDUCTION_AND_10X_TESTING_VELOCITY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What strategic production and testing advantage is unlocked by multimodal Generative AI ad synthesis in digital marketing teams?",
          "expectedStringOutput": "85_PERCENT_COST_REDUCTION_AND_10X_TESTING_VELOCITY",
          "acceptableAnswers": [
            "85_PERCENT_COST_REDUCTION_AND_10X_TESTING_VELOCITY",
            "85% Cost Reduction",
            "10x Testing Velocity"
          ],
          "primaryMisconceptionId": "MC_DMKT_AI_MARKETING_GENERATIVE_CREATIVE_LEADS",
          "diagnosisMap": {
            "SLOW": {
              "misconceptionId": "MC_DMKT_AI_MARKETING_GENERATIVE_CREATIVE_LEADS",
              "errorExplanation": "AI accelerates ad production and cuts costs dramatically.",
              "recoveryPath": {
                "simplerExplanation": "Matches 85_PERCENT_COST_REDUCTION_AND_10X_TESTING_VELOCITY.",
                "guidedFixPrompt": "Type 85_PERCENT_COST_REDUCTION_AND_10X_TESTING_VELOCITY"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d26-b3-ai-lead-scoring-routing",
        "day": 26,
        "blockNumber": 3,
        "title": "Predictive AI Lead Scoring & Instant Sales Routing",
        "conceptBudget": {
          "primaryConcept": "Predictive Lead Scoring & Routing",
          "supportingTerms": [
            "Predictive Scoring (Assigning 0-100 score based on company size, job title, and web behaviors)",
            "Hot Leads ($Score \\ge 85$) instantly routed to Senior Account Executive phone in under 60 seconds (7x higher close rate!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d26-b2-multimodal-generative-ai-ad-creative",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lead_routing_demo.js",
            "initialCode": "function routeLead(score) {\n  return score >= 85\n    ? 'INSTANT_ROUTING_TO_SENIOR_AE_UNDER_60_SECONDS'\n    : 'AUTOMATED_MARKETING_EMAIL_NURTURE';\n}\n\nconsole.log(routeLead(92));\nconsole.log(routeLead(45));",
            "expectedOutput": "INSTANT_ROUTING_TO_SENIOR_AE_UNDER_60_SECONDS\nAUTOMATED_MARKETING_EMAIL_NURTURE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What sales action is triggered when an incoming B2B enterprise lead receives an AI predictive lead score of 92 (Score >= 85)?",
          "expectedStringOutput": "INSTANT_ROUTING_TO_SENIOR_AE_UNDER_60_SECONDS",
          "acceptableAnswers": [
            "INSTANT_ROUTING_TO_SENIOR_AE_UNDER_60_SECONDS",
            "Instant Routing",
            "Route to AE"
          ],
          "primaryMisconceptionId": "MC_DMKT_AI_MARKETING_GENERATIVE_CREATIVE_LEADS",
          "diagnosisMap": {
            "NURTURE": {
              "misconceptionId": "MC_DMKT_AI_MARKETING_GENERATIVE_CREATIVE_LEADS",
              "errorExplanation": "Score 92 is an ultra-hot lead. It triggers instant routing to a Senior AE in under 60 seconds.",
              "recoveryPath": {
                "simplerExplanation": "Matches INSTANT_ROUTING_TO_SENIOR_AE_UNDER_60_SECONDS.",
                "guidedFixPrompt": "Type INSTANT_ROUTING_TO_SENIOR_AE_UNDER_60_SECONDS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Data Privacy, Cookie Deprecation & First-Party Data Strategies",
    "overviewMetaphor": "First-Party Data is Owning the Deed to Your Farmland Instead of Renting from Landlords: When third-party tracking cookies are wiped out by Chrome, Safari, and GDPR/DPDP Act 2023 regulations, companies relying on third-party cookies go blind; companies with a First-Party Data strategy (Interactive assessment quizzes, gated career tools, SMS loyalty clubs) combined with Server-Side Tagging and explicit Consent Management Platforms (CMP) thrive with 100% compliant, permanent customer relationships.",
    "blocks": [
      {
        "id": "dmkt-d27-b1-cookieless-privacy-compliance-pillars",
        "day": 27,
        "blockNumber": 1,
        "title": "The 3 Pillars of Cookieless Compliance: Server-Side Tagging, CMP & First-Party Data",
        "conceptBudget": {
          "primaryConcept": "Cookieless Privacy Compliance",
          "supportingTerms": [
            "Server-Side Tagging (Cloud GTM container on own subdomain)",
            "Consent Management Platform (CMP: GDPR & India DPDP Act 2023 explicit opt-in)",
            "First-Party Data Capture (Direct customer-provided email/phone assets)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d26-b1-predictive-churn-risk-scoring",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Cookieless Compliance Verification",
              "boxes": [
                {
                  "label": "1. Server-Side Tagging",
                  "value": "Cloud GTM on `metrics.company.com` -> 100% Tracking Resilience",
                  "varType": "Server Tagging",
                  "isUpdated": false
                },
                {
                  "label": "2. Consent CMP (GDPR / DPDP)",
                  "value": "Explicit opt-in banner verified (Zero unconsented tracking)",
                  "varType": "CMP Consent",
                  "isUpdated": false
                },
                {
                  "label": "3. First-Party Capture Asset",
                  "value": "Gated interactive career diagnostic tools capture 10k verified emails!",
                  "varType": "First Party",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "privacy_audit_demo.js",
            "initialCode": "function auditPrivacy(serverSide, cmp, firstParty) {\n  const ok = serverSide && cmp && firstParty;\n  return {\n    hasServerSideTagging: serverSide,\n    hasCmpConsent: cmp,\n    hasFocusOnFirstParty: firstParty,\n    isCookielessReady: ok,\n    status: ok ? 'FULLY_PREPARED_FOR_COOKIELESS_FUTURE' : 'CRITICAL_PRIVACY_RISK'\n  };\n}\n\nconsole.log(JSON.stringify(auditPrivacy(true, true, true)));",
            "expectedOutput": "{\"hasServerSideTagging\":true,\"hasCmpConsent\":true,\"hasFocusOnFirstParty\":true,\"isCookielessReady\":true,\"status\":\"FULLY_PREPARED_FOR_COOKIELESS_FUTURE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What compliance status is achieved when an organization implements Server-Side Tagging, CMP Consent, and First-Party data capture?",
          "expectedStringOutput": "FULLY_PREPARED_FOR_COOKIELESS_FUTURE",
          "acceptableAnswers": [
            "FULLY_PREPARED_FOR_COOKIELESS_FUTURE",
            "Cookieless Ready",
            "Fully Prepared"
          ],
          "primaryMisconceptionId": "MC_DMKT_DATA_PRIVACY_GDPR_DPDP_FIRST_PARTY",
          "diagnosisMap": {
            "RISK": {
              "misconceptionId": "MC_DMKT_DATA_PRIVACY_GDPR_DPDP_FIRST_PARTY",
              "errorExplanation": "All 3 pillars passing achieves FULLY_PREPARED_FOR_COOKIELESS_FUTURE.",
              "recoveryPath": {
                "simplerExplanation": "Matches FULLY_PREPARED_FOR_COOKIELESS_FUTURE.",
                "guidedFixPrompt": "Type FULLY_PREPARED_FOR_COOKIELESS_FUTURE"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d27-b2-gdpr-and-dpdp-2023-statutory-penalties",
        "day": 27,
        "blockNumber": 2,
        "title": "Statutory Privacy Regulations: GDPR & India DPDP Act 2023 Penalties",
        "conceptBudget": {
          "primaryConcept": "Statutory Privacy Invariants",
          "supportingTerms": [
            "GDPR Max Fine (€20M or 4% of global turnover)",
            "India DPDP Act 2023 (Penalties up to ₹250 Crore for personal data breaches)",
            "Right to erasure / Right to be forgotten"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d27-b1-cookieless-privacy-compliance-pillars",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Privacy Statutory Penalties",
            "codeSnippet": "// GDPR (EU):           Up to €20 Million or 4% of Global Annual Turnover\n// DPDP Act 2023 (India): Up to ₹250 Crore ($30 Million) per data breach violation\n// MANDATE:              Explicit granular consent BEFORE firing tracking pixels!",
            "lineNotes": {
              "1": "European privacy penalty.",
              "2": "Indian privacy penalty.",
              "3": "Pre-execution consent."
            }
          },
          {
            "type": "runnable_code",
            "filename": "dpdp_penalties_demo.js",
            "initialCode": "function getIndiaDpdpMaxFineCrores() {\n  return 250;\n}\n\nconsole.log(getIndiaDpdpMaxFineCrores());",
            "expectedOutput": "250",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum financial penalty in Crore Rupees prescribed under India's Digital Personal Data Protection (DPDP) Act 2023 for significant data protection breaches?",
          "expectedStringOutput": "250",
          "acceptableAnswers": [
            "250",
            "₹250 Crore",
            "250 Crore",
            "250 crores"
          ],
          "primaryMisconceptionId": "MC_DMKT_DATA_PRIVACY_GDPR_DPDP_FIRST_PARTY",
          "diagnosisMap": {
            "20": {
              "misconceptionId": "MC_DMKT_DATA_PRIVACY_GDPR_DPDP_FIRST_PARTY",
              "errorExplanation": "20 is GDPR €20M fine. India DPDP Act 2023 specifies fines up to ₹250 Crore.",
              "recoveryPath": {
                "simplerExplanation": "India DPDP penalty is up to ₹250 Crore.",
                "guidedFixPrompt": "Type 250"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d27-b3-first-party-data-capture-mechanisms",
        "day": 27,
        "blockNumber": 3,
        "title": "High-Converting First-Party Data Capture: Interactive Diagnostic Tools",
        "conceptBudget": {
          "primaryConcept": "Interactive First-Party Lead Magnets",
          "supportingTerms": [
            "Interactive Quizzes & Free Tools (40% opt-in rate vs 3% on standard PDF ebook lead magnets)",
            "Direct value exchange for customer contact information"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d27-b2-gdpr-and-dpdp-2023-statutory-penalties",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "first_party_tool_demo.js",
            "initialCode": "function evaluateLeadMagnet(isInteractiveTool) {\n  return isInteractiveTool\n    ? 'HIGH_40_PERCENT_FIRST_PARTY_OPT_IN_RATE'\n    : 'LOW_3_PERCENT_STATIC_EBOOK_OPT_IN';\n}\n\nconsole.log(evaluateLeadMagnet(true));",
            "expectedOutput": "HIGH_40_PERCENT_FIRST_PARTY_OPT_IN_RATE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why do interactive diagnostic simulators and calculators outperform traditional PDF ebooks as first-party data capture assets?",
          "expectedStringOutput": "HIGH_40_PERCENT_FIRST_PARTY_OPT_IN_RATE",
          "acceptableAnswers": [
            "HIGH_40_PERCENT_FIRST_PARTY_OPT_IN_RATE",
            "High 40% Opt-In Rate",
            "Interactive value"
          ],
          "primaryMisconceptionId": "MC_DMKT_DATA_PRIVACY_GDPR_DPDP_FIRST_PARTY",
          "diagnosisMap": {
            "LOW": {
              "misconceptionId": "MC_DMKT_DATA_PRIVACY_GDPR_DPDP_FIRST_PARTY",
              "errorExplanation": "Static PDFs have low opt-in. Interactive tools achieve high 40% opt-in rates.",
              "recoveryPath": {
                "simplerExplanation": "Matches HIGH_40_PERCENT_FIRST_PARTY_OPT_IN_RATE.",
                "guidedFixPrompt": "Type HIGH_40_PERCENT_FIRST_PARTY_OPT_IN_RATE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Digital Marketing Budgeting & Annual Media Planning: Share of Voice (SOV)",
    "overviewMetaphor": "Media Planning is Distributing Fuel Across an Armada of Racing Engines: A company targeting $10,000,000 in gross revenue allocates a 10.0% digital marketing budget ($1,000,000 annual media fund); the budget is mathematically allocated across channels: 40% Google Search ($400,000), 30% Meta Social ($300,000), 15% SEO Topic Content ($150,000), and 15% Email/SMS Automation ($150,000); maintaining a Share of Voice (SOV) higher than current Share of Market (SOM) guarantees continuous market share expansion.",
    "blocks": [
      {
        "id": "dmkt-d28-b1-media-budget-allocation-engine",
        "day": 28,
        "blockNumber": 1,
        "title": "The Annual Media Budget Allocation Model ($1,000,000 Multi-Channel Plan)",
        "conceptBudget": {
          "primaryConcept": "Media Budget Planning Formula",
          "supportingTerms": [
            "Target Revenue ($10,000,000)",
            "Marketing Budget $% (10.0\\% \\implies \\$1,000,000$ Total Budget)",
            "Google Search Ads ($40.0\\% \\implies \\$400,000$)",
            "Meta Social Ads ($30.0\\% \\implies \\$300,000$)",
            "SEO & Email ($15.0\\% \\implies \\$150,000$ each)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d27-b1-cookieless-privacy-compliance-pillars",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Annual Media Budget Plan ($10M Target Revenue, 10% Marketing Fund)",
              "boxes": [
                {
                  "label": "Total Marketing Budget",
                  "value": "$10,000,000 x 10.0% = $1,000,000.00 Annual Media Budget",
                  "varType": "Total Budget",
                  "isUpdated": false
                },
                {
                  "label": "Paid Search & Social",
                  "value": "Google ($400k [40%]) + Meta ($300k [30%]) = $700,000 Paid Media",
                  "varType": "Paid Spend",
                  "isUpdated": false
                },
                {
                  "label": "Organic SEO & Email",
                  "value": "SEO ($150k [15%]) + Email ($150k [15%]) = $300,000 Owned Assets",
                  "varType": "Owned Spend",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "budget_plan_calc_demo.js",
            "initialCode": "function calculateMediaPlan(revenue, budgetPct, searchPct, socialPct) {\n  const total = revenue * (budgetPct / 100);\n  const searchSpend = total * (searchPct / 100);\n  const socialSpend = total * (socialPct / 100);\n  return {\n    targetRevenue: revenue,\n    totalBudget: total,\n    searchSpend: Number(searchSpend.toFixed(2)),\n    socialSpend: Number(socialSpend.toFixed(2)),\n    status: 'MEDIA_PLAN_BUDGETED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateMediaPlan(10000000, 10, 40, 30)));",
            "expectedOutput": "{\"targetRevenue\":10000000,\"totalBudget\":1000000,\"searchSpend\":400000,\"socialSpend\":300000,\"status\":\"MEDIA_PLAN_BUDGETED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many dollars are allocated to Google Paid Search Ads in a $1,000,000 marketing budget where Search receives a 40% allocation ($1,000,000 \\times 0.40$)?",
          "expectedStringOutput": "400000",
          "acceptableAnswers": [
            "400000",
            "$400,000",
            "400,000",
            "searchSpend\":400000"
          ],
          "primaryMisconceptionId": "MC_DMKT_BUDGETING_SHARE_OF_VOICE_MEDIA_PLANNING",
          "diagnosisMap": {
            "40000": {
              "misconceptionId": "MC_DMKT_BUDGETING_SHARE_OF_VOICE_MEDIA_PLANNING",
              "errorExplanation": "40,000 is 4%. 40% of $1,000,000 is $400,000.",
              "recoveryPath": {
                "simplerExplanation": "1,000,000 * 0.40 = 400,000.",
                "guidedFixPrompt": "Type 400000"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d28-b2-share-of-voice-growth-dynamic",
        "day": 28,
        "blockNumber": 2,
        "title": "Share of Voice (SOV) vs Share of Market (SOM) Dynamic",
        "conceptBudget": {
          "primaryConcept": "Excess Share of Voice (ESOV)",
          "supportingTerms": [
            "Excess Share of Voice ($ESOV = SOV - SOM$)",
            "When $SOV > SOM$, market share expands organically by $0.5\\%$ to $1.0\\%$ for every $10\\%$ of ESOV"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d28-b1-media-budget-allocation-engine",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SOV Market Expansion Rule",
            "codeSnippet": "// SOV = 25%, SOM = 15% -> ESOV = +10% -> MARKET SHARE GROWS EXPONENTIALLY!\n// SOV = 10%, SOM = 15% -> ESOV = -5%  -> MARKET SHARE SLOWLY ERODES",
            "lineNotes": {
              "1": "Aggressive market capture.",
              "2": "Market erosion risk."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sov_demo.js",
            "initialCode": "function evaluateMarketExpansion(sov, som) {\n  return sov > som\n    ? 'SHARE_OF_VOICE_EXCEEDS_SHARE_OF_MARKET_EXPANSION'\n    : 'UNDER_INVESTMENT_MARKET_SHARE_EROSION';\n}\n\nconsole.log(evaluateMarketExpansion(25, 15));\nconsole.log(evaluateMarketExpansion(10, 15));",
            "expectedOutput": "SHARE_OF_VOICE_EXCEEDS_SHARE_OF_MARKET_EXPANSION\nUNDER_INVESTMENT_MARKET_SHARE_EROSION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What market condition predicts market share growth when an enterprise's Share of Voice (SOV = 25%) exceeds its current Share of Market (SOM = 15%)?",
          "expectedStringOutput": "SHARE_OF_VOICE_EXCEEDS_SHARE_OF_MARKET_EXPANSION",
          "acceptableAnswers": [
            "SHARE_OF_VOICE_EXCEEDS_SHARE_OF_MARKET_EXPANSION",
            "SOV exceeds SOM",
            "Market expansion"
          ],
          "primaryMisconceptionId": "MC_DMKT_BUDGETING_SHARE_OF_VOICE_MEDIA_PLANNING",
          "diagnosisMap": {
            "EROSION": {
              "misconceptionId": "MC_DMKT_BUDGETING_SHARE_OF_VOICE_MEDIA_PLANNING",
              "errorExplanation": "SOV > SOM creates Excess Share of Voice, driving market expansion.",
              "recoveryPath": {
                "simplerExplanation": "Matches SHARE_OF_VOICE_EXCEEDS_SHARE_OF_MARKET_EXPANSION.",
                "guidedFixPrompt": "Type SHARE_OF_VOICE_EXCEEDS_SHARE_OF_MARKET_EXPANSION"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d28-b3-marketing-budget-percentage-of-revenue",
        "day": 28,
        "blockNumber": 3,
        "title": "Standard Budgeting Benchmarks (B2B SaaS 10-15% vs B2C D2C 20-30%)",
        "conceptBudget": {
          "primaryConcept": "Industry Marketing Budget Benchmarks",
          "supportingTerms": [
            "Mature Enterprise B2B (6-10% of revenue)",
            "High-Growth B2B SaaS (15-25% of revenue)",
            "Fast-Growing B2C D2C (25-40% of revenue)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d28-b2-share-of-voice-growth-dynamic",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "industry_budget_demo.js",
            "initialCode": "function getBenchmarkBudgetPct(businessType) {\n  return businessType === 'HIGH_GROWTH_D2C'\n    ? '25_TO_40_PERCENT_OF_REVENUE'\n    : '10_TO_15_PERCENT_OF_REVENUE';\n}\n\nconsole.log(getBenchmarkBudgetPct('ENTERPRISE_B2B'));\nconsole.log(getBenchmarkBudgetPct('HIGH_GROWTH_D2C'));",
            "expectedOutput": "10_TO_15_PERCENT_OF_REVENUE\n25_TO_40_PERCENT_OF_REVENUE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What standard marketing budget percentage of gross revenue is typically allocated by mature Enterprise B2B technology organizations?",
          "expectedStringOutput": "10_TO_15_PERCENT_OF_REVENUE",
          "acceptableAnswers": [
            "10_TO_15_PERCENT_OF_REVENUE",
            "10-15%",
            "10 to 15 percent"
          ],
          "primaryMisconceptionId": "MC_DMKT_BUDGETING_SHARE_OF_VOICE_MEDIA_PLANNING",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_DMKT_BUDGETING_SHARE_OF_VOICE_MEDIA_PLANNING",
              "errorExplanation": "50% is extreme early-stage burn. Mature enterprise B2B standard is 10-15% of revenue.",
              "recoveryPath": {
                "simplerExplanation": "Standard B2B budget is 10-15%.",
                "guidedFixPrompt": "Type 10_TO_15_PERCENT_OF_REVENUE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Omnichannel Customer Journey & Full-Funnel Growth Orchestration",
    "overviewMetaphor": "Full-Funnel Growth Orchestration is Conducting a 100-Piece Symphony Orchestra in Perfect Harmony: When Top-of-Funnel Brand awareness (SEO & Video hooks), Middle-of-Funnel Lead nurturing (Email drips & ABM forms), and Bottom-of-Funnel Conversion (Google Ads & Dynamic retargeting) synchronize, the growth engine achieves elite efficiency ($250 Blended CAC, $4.0\\times CLV:CAC Ratio, and a 6.0-month cash payback period), qualifying as a Tier-1 Venture Scale Growth Machine.",
    "blocks": [
      {
        "id": "dmkt-d29-b1-full-funnel-growth-velocity",
        "day": 29,
        "blockNumber": 1,
        "title": "The Full-Funnel Growth Velocity Index: CAC, CLV:CAC Ratio & Payback",
        "conceptBudget": {
          "primaryConcept": "Growth Velocity Index",
          "supportingTerms": [
            "Blended CAC ($250)",
            "CLV:CAC Ratio ($4.0x \\ge 3.0$)",
            "Payback Period ($6.0$ months $\\le 12.0$)",
            "Tier-1 Venture Scale Growth Status"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d28-b1-media-budget-allocation-engine",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Full-Funnel Executive Dashboard ($250 CAC, 4.0x Ratio, 6 Mo Payback)",
              "boxes": [
                {
                  "label": "Blended Acquisition CAC",
                  "value": "$250.00 Comprehensive Sales & Marketing CAC",
                  "varType": "Blended CAC",
                  "isUpdated": false
                },
                {
                  "label": "CLV:CAC Unit Health",
                  "value": "4.00x Golden Ratio (Surpasses 3.0x venture threshold)",
                  "varType": "Unit Ratio",
                  "isUpdated": false
                },
                {
                  "label": "Cash Payback Velocity",
                  "value": "6.0 Months (Under 12.0 mo limit -> TIER 1 VENTURE SCALE!)",
                  "varType": "Growth Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "growth_velocity_calc_demo.js",
            "initialCode": "function evaluateGrowthEngine(cac, ratio, payback) {\n  const isElite = ratio >= 3.0 && payback <= 12.0 && cac > 0;\n  return {\n    blendedCac: cac,\n    clvToCacRatio: ratio,\n    paybackMonths: payback,\n    isEliteEngine: isElite,\n    tier: isElite ? 'TIER_1_VENTURE_SCALE_GROWTH_ENGINE' : 'SUB_OPTIMAL',\n    status: 'GROWTH_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateGrowthEngine(250, 4.0, 6.0)));",
            "expectedOutput": "{\"blendedCac\":250,\"clvToCacRatio\":4,\"paybackMonths\":6,\"isEliteEngine\":true,\"tier\":\"TIER_1_VENTURE_SCALE_GROWTH_ENGINE\",\"status\":\"GROWTH_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What growth tier rating is awarded to an enterprise marketing machine operating with a 4.0x CLV:CAC ratio and a 6-month cash payback period?",
          "expectedStringOutput": "TIER_1_VENTURE_SCALE_GROWTH_ENGINE",
          "acceptableAnswers": [
            "TIER_1_VENTURE_SCALE_GROWTH_ENGINE",
            "Tier 1",
            "Venture Scale"
          ],
          "primaryMisconceptionId": "MC_DMKT_OMNICHANNEL_CLV_TO_CAC_RATIO",
          "diagnosisMap": {
            "SUB_OPTIMAL": {
              "misconceptionId": "MC_DMKT_OMNICHANNEL_CLV_TO_CAC_RATIO",
              "errorExplanation": "4.0x ratio and 6-month payback are elite benchmarks. It earns Tier-1 Venture Scale status.",
              "recoveryPath": {
                "simplerExplanation": "Matches TIER_1_VENTURE_SCALE_GROWTH_ENGINE.",
                "guidedFixPrompt": "Type TIER_1_VENTURE_SCALE_GROWTH_ENGINE"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d29-b2-growth-flywheel-vs-linear-funnel",
        "day": 29,
        "blockNumber": 2,
        "title": "The Growth Flywheel: Transforming Customers into Growth Accelerators",
        "conceptBudget": {
          "primaryConcept": "Growth Flywheel Model",
          "supportingTerms": [
            "Linear Funnel (Customers drop out at bottom)",
            "Growth Flywheel (Delighted customers power product advocacy, referral loops, and user-generated content, feeding top of funnel automatically)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d29-b1-full-funnel-growth-velocity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Funnel vs Flywheel Dynamics",
            "codeSnippet": "// LINEAR FUNNEL: Spend $10k -> Get 100 customers -> Process ends (Must spend another $10k)\n// GROWTH FLYWHEEL: Spend $10k -> Get 100 customers -> 30 refer friends -> Flywheel spins faster!",
            "lineNotes": {
              "1": "Exhaustive paid loop.",
              "2": "Compounding self-reinforcing flywheel."
            }
          },
          {
            "type": "runnable_code",
            "filename": "flywheel_demo.js",
            "initialCode": "function getGrowthArchitectureModel() {\n  return 'COMPOUNDING_SELF_REINFORCING_GROWTH_FLYWHEEL';\n}\n\nconsole.log(getGrowthArchitectureModel());",
            "expectedOutput": "COMPOUNDING_SELF_REINFORCING_GROWTH_FLYWHEEL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which strategic growth architecture replaces traditional linear drop-off funnels with self-reinforcing viral customer advocacy loops?",
          "expectedStringOutput": "COMPOUNDING_SELF_REINFORCING_GROWTH_FLYWHEEL",
          "acceptableAnswers": [
            "COMPOUNDING_SELF_REINFORCING_GROWTH_FLYWHEEL",
            "Flywheel",
            "Growth Flywheel"
          ],
          "primaryMisconceptionId": "MC_DMKT_GROWTH_HACKING_AARRR_PIRATE_METRICS",
          "diagnosisMap": {
            "LINEAR": {
              "misconceptionId": "MC_DMKT_GROWTH_HACKING_AARRR_PIRATE_METRICS",
              "errorExplanation": "Linear funnels have no compounding loop. The modern model is the Compounding Growth Flywheel.",
              "recoveryPath": {
                "simplerExplanation": "Matches COMPOUNDING_SELF_REINFORCING_GROWTH_FLYWHEEL.",
                "guidedFixPrompt": "Type COMPOUNDING_SELF_REINFORCING_GROWTH_FLYWHEEL"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d29-b3-executive-growth-kpi-dashboard",
        "day": 29,
        "blockNumber": 3,
        "title": "Executive Growth Dashboards: North Star Metric & Leading Indicators",
        "conceptBudget": {
          "primaryConcept": "North Star Metric Selection",
          "supportingTerms": [
            "North Star Metric (The single key metric that best captures the core value delivered to customers e.g. Spotify: 'Time spent listening'; Airbnb: 'Nights booked'; PinIT: 'Proctored coding quests completed')",
            "Leading Indicators vs Lagging Financials"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d29-b2-growth-flywheel-vs-linear-funnel",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "north_star_demo.js",
            "initialCode": "function getNorthStarMetric() {\n  return 'VALUE_DELIVERED_CUSTOMER_CORE_ENGAGEMENT_METRIC';\n}\n\nconsole.log(getNorthStarMetric());",
            "expectedOutput": "VALUE_DELIVERED_CUSTOMER_CORE_ENGAGEMENT_METRIC",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core characteristic defines an organization's North Star Metric in executive growth strategy?",
          "expectedStringOutput": "VALUE_DELIVERED_CUSTOMER_CORE_ENGAGEMENT_METRIC",
          "acceptableAnswers": [
            "VALUE_DELIVERED_CUSTOMER_CORE_ENGAGEMENT_METRIC",
            "Core Value Delivered",
            "Customer Value Metric"
          ],
          "primaryMisconceptionId": "MC_DMKT_GROWTH_HACKING_AARRR_PIRATE_METRICS",
          "diagnosisMap": {
            "RAW_CLICKS": {
              "misconceptionId": "MC_DMKT_GROWTH_HACKING_AARRR_PIRATE_METRICS",
              "errorExplanation": "Vanity clicks do not represent customer value. The North Star metric measures core value delivered.",
              "recoveryPath": {
                "simplerExplanation": "Matches VALUE_DELIVERED_CUSTOMER_CORE_ENGAGEMENT_METRIC.",
                "guidedFixPrompt": "Type VALUE_DELIVERED_CUSTOMER_CORE_ENGAGEMENT_METRIC"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Digital Marketing & Autonomous Growth Hacking Suite",
    "overviewMetaphor": "Day 30 Final Capstone Synthesis: The complete sovereign digital marketing and growth hacking suite: 1. SEO technical Core Web Vitals ($LCP \\le 2.5s$) & keyword opportunity scoring ($KOS = 750.0$); 2. Google Ads auction Ad Rank calculation ($Actual CPC = \\$3.01$), Target ROAS bidding ($500\\%$ ROAS), and Meta 1% Lookalikes ($2\\text{M}$ users); 3. Triple-authenticated email deliverability ($99.0\\%$), automated cart recovery drips ($18,000$ recovered), and A/B split testing ($+50\\%$ uplift, $p < 0.05$); 4. GA4 event funnels ($4\\%$ conversion), U-shaped 40-20-40 multi-touch attribution, and AARRR Pirate Metrics; 5. Dynamic retargeting frequency capping, $CLV:CAC = 4.0 \\ge 3:1$ unit economics, MMM geo-lift incrementality ($+25\\%$ true lift), and server-side first-party privacy compliance.",
    "blocks": [
      {
        "id": "dmkt-d30-b1-digital-growth-capstone-orchestrator",
        "day": 30,
        "blockNumber": 1,
        "title": "Enterprise Digital Marketing & Autonomous Growth Master Suite Orchestrator",
        "conceptBudget": {
          "primaryConcept": "Enterprise Digital Marketing Orchestration",
          "supportingTerms": [
            "Module 1: SEO & Topic Clusters",
            "Module 2: Paid Media & Bidding",
            "Module 3: CRO & Email Automation",
            "Module 4: Analytics & Attribution",
            "Module 5: Unit Economics & Privacy Compliance"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d29-b1-full-funnel-growth-velocity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Enterprise Digital Marketing & Growth Master Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Executes SEO & Topic Clusters ($KOS = 750.0, LCP \\le 2.5s$)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Runs Paid Media Auctions & Meta Lookalikes ($500\\%$ ROAS)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Drives CRO A/B testing & $18,000 cart recovery automation",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Analyzes GA4 funnels & U-Shaped multi-touch attribution",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Locks in $4.0\\times CLV:CAC$ unit economics and privacy compliance!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "digital_growth_capstone_demo.js",
            "initialCode": "function orchestrateDigitalGrowthSuite(seo, paid, cro, analytics, unit) {\n  const ok = seo && paid && cro && analytics && unit;\n  return {\n    seoModule: seo,\n    paidMediaModule: paid,\n    croAutomationModule: cro,\n    analyticsAttributionModule: analytics,\n    unitEconomicsPrivacyModule: unit,\n    isCertified: ok,\n    status: ok ? 'DIGITAL_MARKETING_AND_GROWTH_MASTER_CERTIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(orchestrateDigitalGrowthSuite(true, true, true, true, true).status);",
            "expectedOutput": "DIGITAL_MARKETING_AND_GROWTH_MASTER_CERTIFIED_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What master certification status string confirms the flawless operational execution of the Enterprise Digital Marketing & Autonomous Growth Suite?",
          "expectedStringOutput": "DIGITAL_MARKETING_AND_GROWTH_MASTER_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "DIGITAL_MARKETING_AND_GROWTH_MASTER_CERTIFIED_NOMINAL",
            "status: DIGITAL_MARKETING_AND_GROWTH_MASTER_CERTIFIED_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_DMKT_CAPSTONE_ENTERPRISE_DIGITAL_GROWTH_SYSTEMS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_DMKT_CAPSTONE_ENTERPRISE_DIGITAL_GROWTH_SYSTEMS",
              "errorExplanation": "Matches DIGITAL_MARKETING_AND_GROWTH_MASTER_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type DIGITAL_MARKETING_AND_GROWTH_MASTER_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d30-b2-capstone-system-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Enterprise Digital Marketing Capstone Audit & Precision Invariant Verification",
        "conceptBudget": {
          "primaryConcept": "Capstone System Precision Audit",
          "supportingTerms": [
            "Zero Defect Guarantee",
            "100% Quality Invariant across all 30 Days"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d30-b1-digital-growth-capstone-orchestrator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_audit_demo.js",
            "initialCode": "function auditCapstoneSystem(modules) {\n  const allPassed = modules.every(m => m.passed);\n  return {\n    totalModules: modules.length,\n    allPassed,\n    grade: allPassed ? 'ENTERPRISE_DIGITAL_MARKETING_CAPSTONE_PASSED' : 'AUDIT_FAILED'\n  };\n}\n\nconsole.log(JSON.stringify(auditCapstoneSystem([\n  { name: 'SEO_TOPICS', passed: true },\n  { name: 'PAID_MEDIA_ROAS', passed: true },\n  { name: 'CRO_AUTOMATION', passed: true },\n  { name: 'ANALYTICS_ATTRIBUTION', passed: true },\n  { name: 'UNIT_ECONOMICS_PRIVACY', passed: true }\n])));",
            "expectedOutput": "{\"totalModules\":5,\"allPassed\":true,\"grade\":\"ENTERPRISE_DIGITAL_MARKETING_CAPSTONE_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when all 5 enterprise digital marketing modules pass verification?",
          "expectedStringOutput": "ENTERPRISE_DIGITAL_MARKETING_CAPSTONE_PASSED",
          "acceptableAnswers": [
            "ENTERPRISE_DIGITAL_MARKETING_CAPSTONE_PASSED",
            "grade\":\"ENTERPRISE_DIGITAL_MARKETING_CAPSTONE_PASSED\""
          ],
          "primaryMisconceptionId": "MC_DMKT_CAPSTONE_ENTERPRISE_DIGITAL_GROWTH_SYSTEMS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DMKT_CAPSTONE_ENTERPRISE_DIGITAL_GROWTH_SYSTEMS",
              "errorExplanation": "All checks passing awards ENTERPRISE_DIGITAL_MARKETING_CAPSTONE_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards ENTERPRISE_DIGITAL_MARKETING_CAPSTONE_PASSED.",
                "guidedFixPrompt": "Type ENTERPRISE_DIGITAL_MARKETING_CAPSTONE_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "dmkt-d30-b3-digital-marketing-master-credential",
        "day": 30,
        "blockNumber": 3,
        "title": "Digital Marketing & Growth Strategy Master Certification Credential",
        "conceptBudget": {
          "primaryConcept": "Master Certification Credential",
          "supportingTerms": [
            "Enterprise Digital Growth Certified",
            "100/100 QA Master Verification"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "dmkt-d30-b2-capstone-system-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "master_credential_demo.js",
            "initialCode": "console.log('🏆 PINIT CAREER OS: DIGITAL MARKETING & GROWTH STRATEGY (B.COM / BBA / MBA) CERTIFIED MASTER');",
            "expectedOutput": "🏆 PINIT CAREER OS: DIGITAL MARKETING & GROWTH STRATEGY (B.COM / BBA / MBA) CERTIFIED MASTER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What final master credential string is awarded upon successful completion of the PinIT Digital Marketing & Growth Strategy curriculum?",
          "expectedStringOutput": "🏆 PINIT CAREER OS: DIGITAL MARKETING & GROWTH STRATEGY (B.COM / BBA / MBA) CERTIFIED MASTER",
          "acceptableAnswers": [
            "🏆 PINIT CAREER OS: DIGITAL MARKETING & GROWTH STRATEGY (B.COM / BBA / MBA) CERTIFIED MASTER",
            "CERTIFIED MASTER"
          ],
          "primaryMisconceptionId": "MC_DMKT_CAPSTONE_ENTERPRISE_DIGITAL_GROWTH_SYSTEMS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_DMKT_CAPSTONE_ENTERPRISE_DIGITAL_GROWTH_SYSTEMS",
              "errorExplanation": "Matches final master certification credential string.",
              "recoveryPath": {
                "simplerExplanation": "Matches credential string.",
                "guidedFixPrompt": "Type 🏆 PINIT CAREER OS: DIGITAL MARKETING & GROWTH STRATEGY (B.COM / BBA / MBA) CERTIFIED MASTER"
              }
            }
          }
        }
      }
    ]
  }
];
