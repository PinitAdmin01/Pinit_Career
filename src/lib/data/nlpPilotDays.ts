import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const NLP_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Text Preprocessing Pipeline: Unicode Normalization & Regex Tokenization",
    "overviewMetaphor": "Text Preprocessing Is a Raw Grain Mill: Raw text from the internet contains irregular Unicode ligatures, accent marks, and noisy punctuation like unwashed grain; Unicode NFKD normalization decomposes accents ('é' -> 'e' + combining mark) and regex filtering extracts pure, clean tokens (`TEXT_NORMALIZED_AND_TOKENIZED_NOMINAL`).",
    "blocks": [
      {
        "id": "nlp-d1-b1-unicode-tokenizer",
        "day": 1,
        "blockNumber": 1,
        "title": "Text Preprocessing: Normalizing Unicode (NFKD) & Cleaning Stopwords",
        "conceptBudget": {
          "primaryConcept": "Unicode Text Normalizer & Clean Tokenizer",
          "supportingTerms": [
            "Raw Input (`'Café résumé...'`)",
            "Unicode NFKD Decomposition",
            "Punctuation Stripping",
            "Stopword Filtering",
            "Status: Text Normalized and Tokenized Nominal"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Text Preprocessing Pipeline Ledger",
              "boxes": [
                {
                  "label": "1. Raw Unicode String",
                  "value": "'Café résumé: The quick brown fox!'",
                  "varType": "Raw Text",
                  "isUpdated": false
                },
                {
                  "label": "2. NFKD Normalization",
                  "value": "Decomposes accents: 'e' + '\\u0301' -> stripped to clean ASCII 'cafe resume'",
                  "varType": "Normalized",
                  "isUpdated": false
                },
                {
                  "label": "3. Stopword Filter",
                  "value": "Filters ['the', 'is']: 5 clean tokens (TOKENIZED NOMINAL!)",
                  "varType": "Clean Tokens",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "preprocess_demo.js",
            "initialCode": "function normalizeAndTokenize(raw, stopwords) {\n  const norm = raw.normalize('NFKD').replace(/[\\u0300-\\u036f]/g, '');\n  const clean = norm.toLowerCase().replace(/[^a-z0-9\\s]/g, ' ');\n  const tokens = clean.split(/\\s+/).filter(t => t.length > 0 && !stopwords.includes(t));\n  return {\n    tokenCount: tokens.length,\n    tokens,\n    status: 'TEXT_NORMALIZED_AND_TOKENIZED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(normalizeAndTokenize('Café résumé: The quick brown fox!', ['the', 'a', 'is'])));",
            "expectedOutput": "{\"tokenCount\":5,\"tokens\":[\"cafe\",\"resume\",\"quick\",\"brown\",\"fox\"],\"status\":\"TEXT_NORMALIZED_AND_TOKENIZED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a raw text string has been normalized via Unicode NFKD and tokenized?",
          "expectedStringOutput": "TEXT_NORMALIZED_AND_TOKENIZED_NOMINAL",
          "acceptableAnswers": [
            "TEXT_NORMALIZED_AND_TOKENIZED_NOMINAL",
            "status\":\"TEXT_NORMALIZED_AND_TOKENIZED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_NLP_TEXT_PREPROCESSING_UNICODE_TOKENIZATION",
          "diagnosisMap": {
            "RAW_STRING": {
              "misconceptionId": "MC_NLP_TEXT_PREPROCESSING_UNICODE_TOKENIZATION",
              "errorExplanation": "Matches TEXT_NORMALIZED_AND_TOKENIZED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type TEXT_NORMALIZED_AND_TOKENIZED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d1-b2-unicode-nfkd-acronym-name",
        "day": 1,
        "blockNumber": 2,
        "title": "The Unicode Normalization Form: `NFKD`",
        "conceptBudget": {
          "primaryConcept": "Unicode NFKD Invariant",
          "supportingTerms": [
            "`NFKD` (`Normalization Form KD: Compatibility Decomposition that separates base characters from diacritical accent marks and typographic ligatures`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d1-b1-unicode-tokenizer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Unicode Normalization Forms",
            "codeSnippet": "// 1. NFC:  Canonical Decomposition, followed by Canonical Composition\n// 2. NFD:  Canonical Decomposition\n// 3. NFKC: Compatibility Decomposition, followed by Canonical Composition\n// 4. NFKD: Compatibility Decomposition (Standard for NLP text cleaning!)",
            "lineNotes": {
              "1": "NFC standard web format.",
              "4": "NFKD cleanly isolates base letters from accents for linguistic modeling."
            }
          },
          {
            "type": "runnable_code",
            "filename": "nfkd_demo.js",
            "initialCode": "function getUnicodeForm() {\n  return 'NFKD';\n}\n\nconsole.log(getUnicodeForm());",
            "expectedOutput": "NFKD",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the acronym for the Unicode Compatibility Decomposition form used in NLP preprocessing?",
          "expectedStringOutput": "NFKD",
          "acceptableAnswers": [
            "NFKD",
            "'NFKD'",
            "nfkd"
          ],
          "primaryMisconceptionId": "MC_NLP_TEXT_PREPROCESSING_UNICODE_TOKENIZATION",
          "diagnosisMap": {
            "NFC": {
              "misconceptionId": "MC_NLP_TEXT_PREPROCESSING_UNICODE_TOKENIZATION",
              "errorExplanation": "NFC recomposes characters. Decomposing for stripping uses NFKD.",
              "recoveryPath": {
                "simplerExplanation": "Type NFKD.",
                "guidedFixPrompt": "Type NFKD"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d1-b3-case-folding-information-preservation",
        "day": 1,
        "blockNumber": 3,
        "title": "Vocabulary Efficiency: Lowercasing and Case-Folding to Reduce Sparsity",
        "conceptBudget": {
          "primaryConcept": "Case-Folding Invariant",
          "supportingTerms": [
            "Case-Folding (`Lowercasing ensures 'Apple', 'apple', and 'APPLE' map to the same vocabulary embedding slot unless training a specialized case-sensitive NER model`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d1-b2-unicode-nfkd-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "case_fold_demo.js",
            "initialCode": "function getCaseFoldingRule() {\n  return 'LOWERCASE_TEXT_TO_UNIFY_VOCABULARY_SLOTS_AND_PREVENT_TOKEN_SPARSITY';\n}\n\nconsole.log(getCaseFoldingRule());",
            "expectedOutput": "LOWERCASE_TEXT_TO_UNIFY_VOCABULARY_SLOTS_AND_PREVENT_TOKEN_SPARSITY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why is lowercase normalization applied during standard NLP vocabulary indexing?",
          "expectedStringOutput": "LOWERCASE_TEXT_TO_UNIFY_VOCABULARY_SLOTS_AND_PREVENT_TOKEN_SPARSITY",
          "acceptableAnswers": [
            "LOWERCASE_TEXT_TO_UNIFY_VOCABULARY_SLOTS_AND_PREVENT_TOKEN_SPARSITY",
            "Unify vocabulary slots",
            "Prevent token sparsity"
          ],
          "primaryMisconceptionId": "MC_NLP_TEXT_PREPROCESSING_UNICODE_TOKENIZATION",
          "diagnosisMap": {
            "PRESERVE_ALL_CAPS": {
              "misconceptionId": "MC_NLP_TEXT_PREPROCESSING_UNICODE_TOKENIZATION",
              "errorExplanation": "Standard is: LOWERCASE_TEXT_TO_UNIFY_VOCABULARY_SLOTS_AND_PREVENT_TOKEN_SPARSITY.",
              "recoveryPath": {
                "simplerExplanation": "Matches LOWERCASE_TEXT_TO_UNIFY_VOCABULARY_SLOTS_AND_PREVENT_TOKEN_SPARSITY.",
                "guidedFixPrompt": "Type LOWERCASE_TEXT_TO_UNIFY_VOCABULARY_SLOTS_AND_PREVENT_TOKEN_SPARSITY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Morphological Analysis: Heuristic Stemming vs POS-Aware Lemmatization",
    "overviewMetaphor": "Stemming Is a Chainsaw; Lemmatization Is a Surgeon's Scalpel: A stemmer (Porter) blindly chops suffixes off words ('better' stays 'better', 'running' -> 'run'); a lemmatizer consults a linguistic dictionary and Part-of-Speech tag to map irregular words back to their true root lemma ('better' with ADJ -> 'good').",
    "blocks": [
      {
        "id": "nlp-d2-b1-morphology-classifier",
        "day": 2,
        "blockNumber": 1,
        "title": "Morphology: Classifying Dictionary Lemmatization (`'better'` $\\to$ `'good'`) vs Stemming",
        "conceptBudget": {
          "primaryConcept": "Morphological Stemming vs Lemmatization Classifier",
          "supportingTerms": [
            "Original Word (`'better'`)",
            "POS Tag (`'adj'`)",
            "Dictionary Lemma (`'good'`)",
            "Heuristic Stem (`'run'`)",
            "Status: Morphological Reduction Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d1-b1-unicode-tokenizer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Morphological Reduction Comparison Ledger",
              "boxes": [
                {
                  "label": "1. Lemmatizer ('better', ADJ)",
                  "value": "Dictionary lookup -> returns true root 'good' (LEMMATIZATION DICTIONARY ROOT!)",
                  "varType": "Lemma",
                  "isUpdated": true
                },
                {
                  "label": "2. Porter Stemmer ('running')",
                  "value": "Heuristic rule strips '-ing' -> returns 'run' (SUFFIX STRIPPING)",
                  "varType": "Stem",
                  "isUpdated": false
                },
                {
                  "label": "Reduction Status",
                  "value": "MORPHOLOGICAL REDUCTION NOMINAL (SEMANTIC INTEGRITY PRESERVED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "morphology_demo.js",
            "initialCode": "function classifyMorph(w, pos, isLemma) {\n  const dict = { 'better_adj': 'good', 'running_verb': 'run' };\n  const key = `${w.toLowerCase()}_${pos.toLowerCase()}`;\n  if (isLemma && dict[key]) {\n    return { original: w, reducedForm: dict[key], strategy: 'LEMMATIZATION_DICTIONARY_ROOT', status: 'MORPHOLOGICAL_REDUCTION_NOMINAL' };\n  }\n  const stem = w.toLowerCase().replace(/(ing|ed|s)$/, '');\n  return { original: w, reducedForm: stem, strategy: 'HEURISTIC_SUFFIX_STRIPPING', status: 'MORPHOLOGICAL_REDUCTION_NOMINAL' };\n}\n\nconsole.log(JSON.stringify(classifyMorph('better', 'adj', true)));\nconsole.log(JSON.stringify(classifyMorph('running', 'verb', false)));",
            "expectedOutput": "{\"original\":\"better\",\"reducedForm\":\"good\",\"strategy\":\"LEMMATIZATION_DICTIONARY_ROOT\",\"status\":\"MORPHOLOGICAL_REDUCTION_NOMINAL\"}\n{\"original\":\"running\",\"reducedForm\":\"run\",\"strategy\":\"HEURISTIC_SUFFIX_STRIPPING\",\"status\":\"MORPHOLOGICAL_REDUCTION_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the reduced dictionary root form of the adjective 'better' under POS-aware lemmatization?",
          "expectedStringOutput": "good",
          "acceptableAnswers": [
            "good",
            "reducedForm\":\"good\"",
            "'good'"
          ],
          "primaryMisconceptionId": "MC_NLP_STEMMING_VS_LEMMATIZATION_POS",
          "diagnosisMap": {
            "better": {
              "misconceptionId": "MC_NLP_STEMMING_VS_LEMMATIZATION_POS",
              "errorExplanation": "Heuristic stemmers keep 'better'. Lemmatizers resolve irregular root 'good'.",
              "recoveryPath": {
                "simplerExplanation": "Lemma is good.",
                "guidedFixPrompt": "Type good"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d2-b2-lemmatization-method-name",
        "day": 2,
        "blockNumber": 2,
        "title": "The Dictionary-Based Semantic Root Reduction Method: `Lemmatization`",
        "conceptBudget": {
          "primaryConcept": "Lemmatization Invariant",
          "supportingTerms": [
            "`Lemmatization` (`The morphological process of using vocabulary and morphological analysis to return the dictionary base form or lemma of a word`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d2-b1-morphology-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Stemming vs Lemmatization",
            "codeSnippet": "/* 1. STEMMING (Porter Stemmer): Fast heuristics, cuts suffixes */\n'studies' -> 'studi'  (Non-word!)\n'meeting' -> 'meet'\n\n/* 2. LEMMATIZATION (WordNet): Uses POS context, valid words */\n'studies' -> 'study'  (Valid dictionary word!)\n'meeting' (NOUN) -> 'meeting' (Preserves noun meaning!)",
            "lineNotes": {
              "2": "Stemming produces non-words.",
              "6": "Lemmatization produces valid grammatical lemmas."
            }
          },
          {
            "type": "runnable_code",
            "filename": "lemmatize_name_demo.js",
            "initialCode": "function getLemmaMethod() {\n  return 'Lemmatization';\n}\n\nconsole.log(getLemmaMethod());",
            "expectedOutput": "Lemmatization",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What text normalization technique reduces inflected words to valid dictionary roots using part-of-speech context?",
          "expectedStringOutput": "Lemmatization",
          "acceptableAnswers": [
            "Lemmatization",
            "'Lemmatization'",
            "lemmatization"
          ],
          "primaryMisconceptionId": "MC_NLP_STEMMING_VS_LEMMATIZATION_POS",
          "diagnosisMap": {
            "Stemming": {
              "misconceptionId": "MC_NLP_STEMMING_VS_LEMMATIZATION_POS",
              "errorExplanation": "Stemming uses crude heuristic cuts. Dictionary roots are produced by Lemmatization.",
              "recoveryPath": {
                "simplerExplanation": "Type Lemmatization.",
                "guidedFixPrompt": "Type Lemmatization"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d2-b3-overstemming-error-mechanics",
        "day": 2,
        "blockNumber": 3,
        "title": "Linguistic Pitfalls: Over-Stemming and Under-Stemming Errors",
        "conceptBudget": {
          "primaryConcept": "Over-Stemming Error Invariant",
          "supportingTerms": [
            "Over-Stemming (`Occurs when words of distinct meanings are erroneously reduced to the same stem, e.g. 'universal', 'universe', and 'university' all stemmed to 'univers'`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d2-b2-lemmatization-method-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "overstemming_demo.js",
            "initialCode": "function getOverstemmingRule() {\n  return 'OVER_STEMMING_COLLAPSES_DISTINCT_SEMANTIC_CONCEPTS_INTO_A_SINGLE_ROOT';\n}\n\nconsole.log(getOverstemmingRule());",
            "expectedOutput": "OVER_STEMMING_COLLAPSES_DISTINCT_SEMANTIC_CONCEPTS_INTO_A_SINGLE_ROOT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What error occurs when a rule-based stemmer mistakenly conflates 'university' and 'universe' into 'univers'?",
          "expectedStringOutput": "OVER_STEMMING_COLLAPSES_DISTINCT_SEMANTIC_CONCEPTS_INTO_A_SINGLE_ROOT",
          "acceptableAnswers": [
            "OVER_STEMMING_COLLAPSES_DISTINCT_SEMANTIC_CONCEPTS_INTO_A_SINGLE_ROOT",
            "Over-stemming",
            "Overstemming"
          ],
          "primaryMisconceptionId": "MC_NLP_STEMMING_VS_LEMMATIZATION_POS",
          "diagnosisMap": {
            "UNDER_STEMMING": {
              "misconceptionId": "MC_NLP_STEMMING_VS_LEMMATIZATION_POS",
              "errorExplanation": "Collapsing different concepts is Over-Stemming. Standard is: OVER_STEMMING_COLLAPSES_DISTINCT_SEMANTIC_CONCEPTS_INTO_A_SINGLE_ROOT.",
              "recoveryPath": {
                "simplerExplanation": "Matches OVER_STEMMING_COLLAPSES_DISTINCT_SEMANTIC_CONCEPTS_INTO_A_SINGLE_ROOT.",
                "guidedFixPrompt": "Type OVER_STEMMING_COLLAPSES_DISTINCT_SEMANTIC_CONCEPTS_INTO_A_SINGLE_ROOT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "N-Gram Language Models: Maximum Likelihood & Laplace Smoothing",
    "overviewMetaphor": "Laplace Smoothing Is a Pretend Minimum Balance in a Bank Account: If an n-gram has never been seen in training data ($0$ count), naive Maximum Likelihood assigns it a probability of $0.0$, crashing the entire sentence probability to zero ($2^{-\\infty}$); Add-1 Laplace smoothing gives every word in the dictionary a baseline $$1$ balance, guaranteeing all phrases receive positive probability.",
    "blocks": [
      {
        "id": "nlp-d3-b1-laplace-probability-calculator",
        "day": 3,
        "blockNumber": 1,
        "title": "N-Gram Models: Calculating Add-1 Laplace Bigram Probability ($P = \\frac{C+1}{N+V}$)",
        "conceptBudget": {
          "primaryConcept": "Laplace-Smoothed Bigram Transition Probability Calculator",
          "supportingTerms": [
            "Bigram Count ($C = 4$ vs $0$)",
            "Context Count ($N = 10$)",
            "Vocabulary Size ($V = 100$)",
            "Smoothed Probability ($0.0455$ vs $0.0091$)",
            "Status: Laplace Smoothed Probability Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d2-b1-morphology-classifier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Laplace Add-1 Smoothing Ledger",
              "boxes": [
                {
                  "label": "Seen Bigram (C=4, N=10)",
                  "value": "P = (4 + 1) / (10 + 100) = 5 / 110 = 0.0455",
                  "varType": "Seen",
                  "isUpdated": false
                },
                {
                  "label": "Unseen Bigram (C=0, N=10)",
                  "value": "P = (0 + 1) / (10 + 100) = 1 / 110 = 0.0091 (ZERO PROBABILITY AVERTED!)",
                  "varType": "Smoothed Unseen",
                  "isUpdated": true
                },
                {
                  "label": "Calculation Status",
                  "value": "LAPLACE SMOOTHED PROBABILITY CALCULATED NOMINAL",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "laplace_demo.js",
            "initialCode": "function calcLaplace(bi, ctx, vocab) {\n  const prob = Number(((bi + 1) / (ctx + vocab)).toFixed(4));\n  return {\n    laplaceSmoothedProbability: prob,\n    status: 'LAPLACE_SMOOTHED_PROBABILITY_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcLaplace(4, 10, 100)));\nconsole.log(JSON.stringify(calcLaplace(0, 10, 100)));",
            "expectedOutput": "{\"laplaceSmoothedProbability\":0.0455,\"status\":\"LAPLACE_SMOOTHED_PROBABILITY_CALCULATED_NOMINAL\"}\n{\"laplaceSmoothedProbability\":0.0091,\"status\":\"LAPLACE_SMOOTHED_PROBABILITY_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Laplace-smoothed probability for an unseen bigram with context count 10 and vocabulary size 100?",
          "expectedStringOutput": "0.0091",
          "acceptableAnswers": [
            "0.0091",
            "laplaceSmoothedProbability\":0.0091",
            "1/110"
          ],
          "primaryMisconceptionId": "MC_NLP_NGRAM_LANGUAGE_MODELS_LAPLACE_SMOOTHING",
          "diagnosisMap": {
            "0.0": {
              "misconceptionId": "MC_NLP_NGRAM_LANGUAGE_MODELS_LAPLACE_SMOOTHING",
              "errorExplanation": "Add-1 smoothing adds 1 to numerator: (0+1)/(10+100) = 1/110 = 0.0091.",
              "recoveryPath": {
                "simplerExplanation": "Probability is 0.0091.",
                "guidedFixPrompt": "Type 0.0091"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d3-b2-language-model-perplexity-metric-name",
        "day": 3,
        "blockNumber": 2,
        "title": "The Standard Language Model Evaluation Metric: `Perplexity`",
        "conceptBudget": {
          "primaryConcept": "Perplexity Invariant",
          "supportingTerms": [
            "`Perplexity` (`The inverse geometric mean probability assigned to a test set; lower perplexity indicates the language model is less surprised by held-out text`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d3-b1-laplace-probability-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Perplexity Formulation",
            "codeSnippet": "/* PERPLEXITY EQUATION */\nPP(W) = P(w_1, w_2, ..., w_N)^(-1/N) = 2^(-1/N * sum(log2 P(w_i | context)))\n\n// Intuition: Perplexity is the weighted average branching factor of the model.\n// Lower Perplexity = Better Language Model Prediction!",
            "lineNotes": {
              "2": "Exponentiated cross-entropy loss.",
              "5": "Lower perplexity means superior next-word prediction."
            }
          },
          {
            "type": "runnable_code",
            "filename": "perplexity_demo.js",
            "initialCode": "function getLmMetric() {\n  return 'Perplexity';\n}\n\nconsole.log(getLmMetric());",
            "expectedOutput": "Perplexity",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What evaluation metric measures the exponentiated cross-entropy loss (uncertainty) of a language model?",
          "expectedStringOutput": "Perplexity",
          "acceptableAnswers": [
            "Perplexity",
            "'Perplexity'",
            "perplexity",
            "PPL"
          ],
          "primaryMisconceptionId": "MC_NLP_NGRAM_LANGUAGE_MODELS_LAPLACE_SMOOTHING",
          "diagnosisMap": {
            "Accuracy": {
              "misconceptionId": "MC_NLP_NGRAM_LANGUAGE_MODELS_LAPLACE_SMOOTHING",
              "errorExplanation": "Accuracy is for classification. Language model probability quality is measured by Perplexity.",
              "recoveryPath": {
                "simplerExplanation": "Type Perplexity.",
                "guidedFixPrompt": "Type Perplexity"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d3-b3-markov-chain-context-window-tradeoff",
        "day": 3,
        "blockNumber": 3,
        "title": "Markov Property: Balancing $n$-Gram Order Against Exponential Combinatorial Sparsity",
        "conceptBudget": {
          "primaryConcept": "Markov Context Order Invariant",
          "supportingTerms": [
            "Markov Chain Tradeoff (`Higher n captures longer context but causes combinatorial explosion $|V|^n$, making parameter estimation sparse without massive data`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d3-b2-language-model-perplexity-metric-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "markov_tradeoff_demo.js",
            "initialCode": "function getMarkovRule() {\n  return 'HIGHER_ORDER_NGRAMS_CAPTURE_RICHER_CONTEXT_AT_THE_COST_OF_EXPONENTIAL_DATA_SPARSITY';\n}\n\nconsole.log(getMarkovRule());",
            "expectedOutput": "HIGHER_ORDER_NGRAMS_CAPTURE_RICHER_CONTEXT_AT_THE_COST_OF_EXPONENTIAL_DATA_SPARSITY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What fundamental trade-off governs the selection of n-gram order in statistical language modeling?",
          "expectedStringOutput": "HIGHER_ORDER_NGRAMS_CAPTURE_RICHER_CONTEXT_AT_THE_COST_OF_EXPONENTIAL_DATA_SPARSITY",
          "acceptableAnswers": [
            "HIGHER_ORDER_NGRAMS_CAPTURE_RICHER_CONTEXT_AT_THE_COST_OF_EXPONENTIAL_DATA_SPARSITY",
            "Richer context at cost of data sparsity",
            "Exponential data sparsity"
          ],
          "primaryMisconceptionId": "MC_NLP_NGRAM_LANGUAGE_MODELS_LAPLACE_SMOOTHING",
          "diagnosisMap": {
            "LARGER_N_IS_ALWAYS_BETTER": {
              "misconceptionId": "MC_NLP_NGRAM_LANGUAGE_MODELS_LAPLACE_SMOOTHING",
              "errorExplanation": "Standard is: HIGHER_ORDER_NGRAMS_CAPTURE_RICHER_CONTEXT_AT_THE_COST_OF_EXPONENTIAL_DATA_SPARSITY.",
              "recoveryPath": {
                "simplerExplanation": "Matches HIGHER_ORDER_NGRAMS_CAPTURE_RICHER_CONTEXT_AT_THE_COST_OF_EXPONENTIAL_DATA_SPARSITY.",
                "guidedFixPrompt": "Type HIGHER_ORDER_NGRAMS_CAPTURE_RICHER_CONTEXT_AT_THE_COST_OF_EXPONENTIAL_DATA_SPARSITY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Vector Space Models: Bag-of-Words & TF-IDF Weighting",
    "overviewMetaphor": "TF-IDF Is a Rare Stamp Appraiser: Term Frequency (TF) counts how many times a stamp appears in an album ($3 / 100 = 0.03$); Inverse Document Frequency (IDF) discounts common stamps found in every household, heavily weighting rare collector stamps found in only 10 out of 1000 archives ($\\log_{10}(1000/10) = 2.0$), yielding $\\text{TF-IDF} = 0.06$.",
    "blocks": [
      {
        "id": "nlp-d4-b1-tfidf-weight-calculator",
        "day": 4,
        "blockNumber": 1,
        "title": "Vector Spaces: Calculating $\\text{TF-IDF} = \\text{TF} \\times \\log_{10}\\left(\\frac{N}{df}\\right)$ ($0.03 \\times 2.0 = 0.06$)",
        "conceptBudget": {
          "primaryConcept": "TF-IDF Term Weighting Calculator",
          "supportingTerms": [
            "Term Frequency ($3/100 = 0.03$)",
            "Inverse Document Frequency ($\\log_{10}(1000/10) = 2.0$)",
            "TF-IDF Composite Weight ($0.06$)",
            "Status: TFIDF Weight Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d3-b1-laplace-probability-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "TF-IDF Mathematical Weighting Ledger",
              "boxes": [
                {
                  "label": "1. Term Frequency (TF)",
                  "value": "tf / totalWords = 3 / 100 = 0.03 (Local doc frequency)",
                  "varType": "TF",
                  "isUpdated": false
                },
                {
                  "label": "2. Inverse Doc Freq (IDF)",
                  "value": "log10(N / df) = log10(1000 / 10) = log10(100) = 2.0 (Corpus rarity)",
                  "varType": "IDF",
                  "isUpdated": false
                },
                {
                  "label": "3. TF-IDF Product",
                  "value": "0.03 * 2.0 = 0.06 (TFIDF WEIGHT CALCULATED NOMINAL!)",
                  "varType": "TF-IDF",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "tfidf_demo.js",
            "initialCode": "function calcTfIdf(tf, totalWords, nDocs, df) {\n  const termFreq = tf / totalWords;\n  const idf = Math.log10(nDocs / Math.max(1, df));\n  const tfidf = Number((termFreq * idf).toFixed(4));\n  return {\n    termFrequency: Number(termFreq.toFixed(4)),\n    inverseDocFrequency: Number(idf.toFixed(4)),\n    tfidfWeight: tfidf,\n    status: 'TFIDF_WEIGHT_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcTfIdf(3, 100, 1000, 10)));",
            "expectedOutput": "{\"termFrequency\":0.03,\"inverseDocFrequency\":2,\"tfidfWeight\":0.06,\"status\":\"TFIDF_WEIGHT_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the TF-IDF weight for a word occurring 3 times in a 100-word doc with corpus size 1000 and document frequency 10?",
          "expectedStringOutput": "0.06",
          "acceptableAnswers": [
            "0.06",
            "tfidfWeight\":0.06",
            "0.0600"
          ],
          "primaryMisconceptionId": "MC_NLP_TFIDF_VECTOR_SPACE_INVERSE_FREQUENCY",
          "diagnosisMap": {
            "0.03": {
              "misconceptionId": "MC_NLP_TFIDF_VECTOR_SPACE_INVERSE_FREQUENCY",
              "errorExplanation": "0.03 is only TF. Multiplying by IDF (log10(100) = 2) gives 0.06.",
              "recoveryPath": {
                "simplerExplanation": "Weight is 0.06.",
                "guidedFixPrompt": "Type 0.06"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d4-b2-idf-logarithm-base-number",
        "day": 4,
        "blockNumber": 2,
        "title": "The Standard TF-IDF Logarithm Base: 10",
        "conceptBudget": {
          "primaryConcept": "IDF Base 10 Invariant",
          "supportingTerms": [
            "Base 10 (`Common Information Retrieval standard uses common logarithm base-10 to scale document rarity smoothly`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d4-b1-tfidf-weight-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "TF-IDF Matrix Formulation",
            "codeSnippet": "/* TF-IDF FORMULA */\nTF(t, d)  = count(t, d) / sum_t'(count(t', d))\nIDF(t, D) = log_10( |D| / |{d in D : t in d}| )\nTFIDF(t, d, D) = TF(t, d) * IDF(t, D)",
            "lineNotes": {
              "2": "Normalizes local term frequency by document length.",
              "3": "log10 penalizes terms that appear in every document.",
              "4": "High TF-IDF signals discriminative keyword."
            }
          },
          {
            "type": "runnable_code",
            "filename": "idf_base_demo.js",
            "initialCode": "function getIdfBase() {\n  return 10;\n}\n\nconsole.log(getIdfBase());",
            "expectedOutput": "10",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What logarithm base is conventionally used in classical Information Retrieval for IDF computation?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "base 10",
            "ten"
          ],
          "primaryMisconceptionId": "MC_NLP_TFIDF_VECTOR_SPACE_INVERSE_FREQUENCY",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_NLP_TFIDF_VECTOR_SPACE_INVERSE_FREQUENCY",
              "errorExplanation": "Base 2 is for entropy/bits. Standard IR uses base 10 (or natural log e).",
              "recoveryPath": {
                "simplerExplanation": "Type 10.",
                "guidedFixPrompt": "Type 10"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d4-b3-sparse-term-document-matrix-storage",
        "day": 4,
        "blockNumber": 3,
        "title": "Memory Efficiency: Storing Term-Document Matrices in Sparse Formats (CSR / COO)",
        "conceptBudget": {
          "primaryConcept": "Sparse Matrix Storage Invariant",
          "supportingTerms": [
            "Sparse Matrix Storage (`Because 99% of vocabulary words do not appear in any single document, storing only non-zero coordinates saves 99% of RAM`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d4-b2-idf-logarithm-base-number",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sparse_matrix_demo.js",
            "initialCode": "function getSparseMatrixRule() {\n  return 'STORE_TFIDF_MATRICES_IN_SPARSE_CSR_FORMAT_TO_AVOID_STORING_ZERO_WEIGHTS';\n}\n\nconsole.log(getSparseMatrixRule());",
            "expectedOutput": "STORE_TFIDF_MATRICES_IN_SPARSE_CSR_FORMAT_TO_AVOID_STORING_ZERO_WEIGHTS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do production NLP search engines store massive document-term TF-IDF matrices without running out of RAM?",
          "expectedStringOutput": "STORE_TFIDF_MATRICES_IN_SPARSE_CSR_FORMAT_TO_AVOID_STORING_ZERO_WEIGHTS",
          "acceptableAnswers": [
            "STORE_TFIDF_MATRICES_IN_SPARSE_CSR_FORMAT_TO_AVOID_STORING_ZERO_WEIGHTS",
            "Sparse CSR format",
            "Sparse matrix format"
          ],
          "primaryMisconceptionId": "MC_NLP_TFIDF_VECTOR_SPACE_INVERSE_FREQUENCY",
          "diagnosisMap": {
            "DENSE_ARRAYS": {
              "misconceptionId": "MC_NLP_TFIDF_VECTOR_SPACE_INVERSE_FREQUENCY",
              "errorExplanation": "Standard is: STORE_TFIDF_MATRICES_IN_SPARSE_CSR_FORMAT_TO_AVOID_STORING_ZERO_WEIGHTS.",
              "recoveryPath": {
                "simplerExplanation": "Matches STORE_TFIDF_MATRICES_IN_SPARSE_CSR_FORMAT_TO_AVOID_STORING_ZERO_WEIGHTS.",
                "guidedFixPrompt": "Type STORE_TFIDF_MATRICES_IN_SPARSE_CSR_FORMAT_TO_AVOID_STORING_ZERO_WEIGHTS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Text Normalization, TF-IDF & Vector Space Search Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete foundational text preprocessing, morphological analysis, language modeling, and TF-IDF vector space engine: 1. Unicode NFKD normalization; 2. Porter/Lemmatization classification; 3. Laplace-smoothed transition probabilities; 4. TF-IDF mathematical weighting.",
    "blocks": [
      {
        "id": "nlp-d5-b1-nlp-vector-space-master-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "NLP Vector Space Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "NLP Vector Space Master Engine",
          "supportingTerms": [
            "Text Normalization Subsystem",
            "Morphological Subsystem",
            "Laplace LM Subsystem",
            "TF-IDF Subsystem"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d4-b3-sparse-term-document-matrix-storage",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 NLP Vector Space Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Normalizes Unicode with NFKD & strips stopword noise",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Extracts dictionary lemmas & computes Laplace-smoothed bigrams",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Constructs sparse TF-IDF document-term vector space matrices",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Activates NLP Vector Space Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "nlp_kernel_demo.js",
            "initialCode": "function runNlpVectorSpace() {\n  return {\n    normalizationSubsystem: 'ONLINE_UNICODE_NFKD_ACTIVE',\n    morphologySubsystem: 'ONLINE_LEMMATIZER_ACTIVE',\n    languageModelSubsystem: 'ONLINE_LAPLACE_NGRAMS_ACTIVE',\n    tfidfSubsystem: 'ONLINE_TFIDF_SPARSE_ACTIVE',\n    engineStatus: 'NLP_VECTOR_SPACE_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runNlpVectorSpace().engineStatus);",
            "expectedOutput": "NLP_VECTOR_SPACE_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the NLP Vector Space Master Engine?",
          "expectedStringOutput": "NLP_VECTOR_SPACE_MASTER_ACTIVE",
          "acceptableAnswers": [
            "NLP_VECTOR_SPACE_MASTER_ACTIVE",
            "engineStatus: NLP_VECTOR_SPACE_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_NLP_TEXT_PREPROCESSING_UNICODE_TOKENIZATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_NLP_TEXT_PREPROCESSING_UNICODE_TOKENIZATION",
              "errorExplanation": "Matches NLP_VECTOR_SPACE_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type NLP_VECTOR_SPACE_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d5-b2-nlp-vector-space-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "NLP Vector Space Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "NLP Vector Space Invariant Verification",
          "supportingTerms": [
            "Normalization Invariant",
            "TF-IDF Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d5-b1-nlp-vector-space-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "nlp_audit_demo.js",
            "initialCode": "function auditNlp(n, m, l, t) {\n  const passed = n && m && l && t;\n  return {\n    normalizationVerified: n,\n    morphologyVerified: m,\n    laplaceVerified: l,\n    tfidfVerified: t,\n    grade: passed ? 'NLP_VECTOR_SPACE_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditNlp(true, true, true, true)));",
            "expectedOutput": "{\"normalizationVerified\":true,\"morphologyVerified\":true,\"laplaceVerified\":true,\"tfidfVerified\":true,\"grade\":\"NLP_VECTOR_SPACE_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Normalization, Morphology, Laplace LM, and TF-IDF pass 100%?",
          "expectedStringOutput": "NLP_VECTOR_SPACE_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "NLP_VECTOR_SPACE_ENGINE_AUDIT_PASSED",
            "grade\":\"NLP_VECTOR_SPACE_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_NLP_TEXT_PREPROCESSING_UNICODE_TOKENIZATION",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_NLP_TEXT_PREPROCESSING_UNICODE_TOKENIZATION",
              "errorExplanation": "All checks passing awards NLP_VECTOR_SPACE_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards NLP_VECTOR_SPACE_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type NLP_VECTOR_SPACE_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d5-b3-milestone1-nlp-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 NLP Vector Space Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "NLP Vector Space Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d5-b2-nlp-vector-space-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_nlp_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete Text Normalization, TF-IDF & Vector Space Search Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete Text Normalization, TF-IDF & Vector Space Search Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete Text Normalization, TF-IDF & Vector Space Search Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete Text Normalization, TF-IDF & Vector Space Search Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_NLP_TEXT_PREPROCESSING_UNICODE_TOKENIZATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_NLP_TEXT_PREPROCESSING_UNICODE_TOKENIZATION",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete Text Normalization, TF-IDF & Vector Space Search Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Vector Similarity & Semantic Document Search: Cosine Similarity",
    "overviewMetaphor": "Cosine Similarity Is a Laser Compass: Euclidean distance gets confused if Document A is short (100 words) and Document B is long (10,000 words); Cosine similarity calculates the geometric angle between the two topic arrows in multidimensional space ($cos(0^circ) = 1.0$), measuring pure conceptual alignment regardless of article length.",
    "blocks": [
      {
        "id": "nlp-d6-b1-cosine-similarity-calculator",
        "day": 6,
        "blockNumber": 1,
        "title": "Vector Similarity: Calculating Cosine Score $\\frac{\\mathbf{A} \\cdot \\mathbf{B}}{\\|\\mathbf{A}\\| \\|\\mathbf{B}\\|}$ ($1.0$ vs $0.0$)",
        "conceptBudget": {
          "primaryConcept": "Cosine Similarity Document Matcher",
          "supportingTerms": [
            "Vector Dot Product",
            "Euclidean L2 Norm",
            "Cosine Similarity ($1.0$ Parallel vs $0.0$ Orthogonal)",
            "Status: Cosine Similarity Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d1-b1-unicode-tokenizer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Vector Geometric Cosine Similarity Ledger",
              "boxes": [
                {
                  "label": "Vector A [1, 2, 3] & Vector B [1, 2, 3]",
                  "value": "dot = 14, ||A|| = sqrt(14), ||B|| = sqrt(14) -> cos = 14/14 = 1.0 (IDENTICAL DIRECTION!)",
                  "varType": "Parallel",
                  "isUpdated": true
                },
                {
                  "label": "Vector A [1, 0] & Vector B [0, 1]",
                  "value": "dot = 0, ||A|| = 1, ||B|| = 1 -> cos = 0.0 (ORTHOGONAL / UNRELATED)",
                  "varType": "Orthogonal",
                  "isUpdated": false
                },
                {
                  "label": "Matching Status",
                  "value": "COSINE SIMILARITY CALCULATED NOMINAL (LENGTH-INVARIANT SEARCH!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cosine_demo.js",
            "initialCode": "function calcCosine(a, b) {\n  let dot = 0, nA = 0, nB = 0;\n  for (let i = 0; i < a.length; i++) {\n    dot += a[i] * b[i];\n    nA += a[i] * a[i];\n    nB += b[i] * b[i];\n  }\n  const sim = Number((dot / (Math.sqrt(nA) * Math.sqrt(nB))).toFixed(4));\n  return {\n    cosineSimilarity: sim,\n    status: 'COSINE_SIMILARITY_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcCosine([1, 2, 3], [1, 2, 3])));\nconsole.log(JSON.stringify(calcCosine([1, 0], [0, 1])));",
            "expectedOutput": "{\"cosineSimilarity\":1,\"status\":\"COSINE_SIMILARITY_CALCULATED_NOMINAL\"}\n{\"cosineSimilarity\":0,\"status\":\"COSINE_SIMILARITY_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the cosine similarity score between two identical direction document vectors?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "1.0",
            "cosineSimilarity\":1",
            "1.00"
          ],
          "primaryMisconceptionId": "MC_NLP_COSINE_SIMILARITY_SEMANTIC_SEARCH",
          "diagnosisMap": {
            "0.0": {
              "misconceptionId": "MC_NLP_COSINE_SIMILARITY_SEMANTIC_SEARCH",
              "errorExplanation": "Identical vectors have an angle of 0 degrees: cos(0) = 1.0.",
              "recoveryPath": {
                "simplerExplanation": "Score is 1.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d6-b2-cosine-similarity-max-bound",
        "day": 6,
        "blockNumber": 2,
        "title": "The Maximum Upper Bound of Cosine Similarity: 1.0",
        "conceptBudget": {
          "primaryConcept": "Cosine Range Invariant",
          "supportingTerms": [
            "Upper Bound 1.0 (`Cosine similarity strictly ranges from -1.0 to 1.0, with 1.0 representing perfect directional collinearity`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d6-b1-cosine-similarity-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Cosine Geometric Spectrum",
            "codeSnippet": "// COSINE SIMILARITY VALUE SPECTRUM:\n//  1.0: Identical topic orientation (Angle = 0 deg)\n//  0.0: Orthogonal, completely independent topics (Angle = 90 deg)\n// -1.0: Diametrically opposite topic orientation (Angle = 180 deg)",
            "lineNotes": {
              "2": "Maximum similarity.",
              "3": "Uncorrelated topics.",
              "4": "Opposite polarity."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cosine_bound_demo.js",
            "initialCode": "function getCosineMax() {\n  return 1.0;\n}\n\nconsole.log(getCosineMax());",
            "expectedOutput": "1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the theoretical maximum upper bound for cosine similarity?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "1.0",
            "one"
          ],
          "primaryMisconceptionId": "MC_NLP_COSINE_SIMILARITY_SEMANTIC_SEARCH",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_NLP_COSINE_SIMILARITY_SEMANTIC_SEARCH",
              "errorExplanation": "Cosine ranges [-1.0, 1.0]. Maximum is 1.0 (or 1).",
              "recoveryPath": {
                "simplerExplanation": "Type 1.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d6-b3-l2-normalization-trick",
        "day": 6,
        "blockNumber": 3,
        "title": "Speed Optimization: Pre-computing L2 Normalized Embeddings for Fast Dot Products",
        "conceptBudget": {
          "primaryConcept": "L2 Unit Normalization Invariant",
          "supportingTerms": [
            "Unit Vector Normalization (`Dividing vectors by their Euclidean norm upfront converts cosine similarity into a simple fast inner dot product $\\mathbf{u} \\cdot \\mathbf{v}$`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d6-b2-cosine-similarity-max-bound",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "l2_norm_demo.js",
            "initialCode": "function getL2NormRule() {\n  return 'UNIT_NORMALIZE_VECTORS_TO_REDUCE_COSINE_SIMILARITY_TO_A_SINGLE_DOT_PRODUCT';\n}\n\nconsole.log(getL2NormRule());",
            "expectedOutput": "UNIT_NORMALIZE_VECTORS_TO_REDUCE_COSINE_SIMILARITY_TO_A_SINGLE_DOT_PRODUCT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why do production vector databases pre-normalize document embeddings to unit length?",
          "expectedStringOutput": "UNIT_NORMALIZE_VECTORS_TO_REDUCE_COSINE_SIMILARITY_TO_A_SINGLE_DOT_PRODUCT",
          "acceptableAnswers": [
            "UNIT_NORMALIZE_VECTORS_TO_REDUCE_COSINE_SIMILARITY_TO_A_SINGLE_DOT_PRODUCT",
            "Reduce cosine similarity to a single dot product",
            "Fast dot product"
          ],
          "primaryMisconceptionId": "MC_NLP_COSINE_SIMILARITY_SEMANTIC_SEARCH",
          "diagnosisMap": {
            "NO_SPEEDUP": {
              "misconceptionId": "MC_NLP_COSINE_SIMILARITY_SEMANTIC_SEARCH",
              "errorExplanation": "Standard is: UNIT_NORMALIZE_VECTORS_TO_REDUCE_COSINE_SIMILARITY_TO_A_SINGLE_DOT_PRODUCT.",
              "recoveryPath": {
                "simplerExplanation": "Matches UNIT_NORMALIZE_VECTORS_TO_REDUCE_COSINE_SIMILARITY_TO_A_SINGLE_DOT_PRODUCT.",
                "guidedFixPrompt": "Type UNIT_NORMALIZE_VECTORS_TO_REDUCE_COSINE_SIMILARITY_TO_A_SINGLE_DOT_PRODUCT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Distributed Representations: Word2Vec Skip-Gram & CBOW Architectures",
    "overviewMetaphor": "Word2Vec Embeddings Are GPS Coordinates in Meaning Space: In 1-hot encoding, every word is an isolated island ($[0, 0, 1, 0]$); Word2Vec positions words in a continuous 300D semantic coordinate system, enabling vector geometry where adding and subtracting meaning coordinates yields analogies: $\\mathbf{King} - \\mathbf{Man} + \\mathbf{Woman} = \\mathbf{Queen}$.",
    "blocks": [
      {
        "id": "nlp-d7-b1-vector-analogy-engine",
        "day": 7,
        "blockNumber": 1,
        "title": "Word2Vec: Computing Semantic Vector Analogy ($[0.8, 0.2, 0.9] - [0.7, 0.1, 0.1] + [0.2, 0.8, 0.1] = [0.3, 0.9, 0.9]$)",
        "conceptBudget": {
          "primaryConcept": "Word2Vec Semantic Vector Analogy Arithmetic Engine",
          "supportingTerms": [
            "Vector A ('King')",
            "Vector B ('Man')",
            "Vector C ('Woman')",
            "Analogy Result Vector ('Queen')",
            "Status: Semantic Vector Analogy Computed Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d6-b1-cosine-similarity-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Word2Vec Semantic Vector Arithmetic Ledger",
              "boxes": [
                {
                  "label": "1. Vector King (A)",
                  "value": "[0.8, 0.2, 0.9] (Royalty + Masculinity dimensions)",
                  "varType": "Vector A",
                  "isUpdated": false
                },
                {
                  "label": "2. Vector Man (B)",
                  "value": "[0.7, 0.1, 0.1] (Subtracting Masculinity)",
                  "varType": "Vector B",
                  "isUpdated": false
                },
                {
                  "label": "3. Vector Woman (C)",
                  "value": "[0.2, 0.8, 0.1] -> Result = [0.3, 0.9, 0.9] (ANALOGY QUEEN NOMINAL!)",
                  "varType": "Result",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "analogy_demo.js",
            "initialCode": "function calcAnalogy(a, b, c) {\n  const res = [];\n  for (let i = 0; i < a.length; i++) {\n    res.push(Number((a[i] - b[i] + c[i]).toFixed(4)));\n  }\n  return {\n    analogyVector: res,\n    status: 'SEMANTIC_VECTOR_ANALOGY_COMPUTED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcAnalogy([0.8, 0.2, 0.9], [0.7, 0.1, 0.1], [0.2, 0.8, 0.1])));",
            "expectedOutput": "{\"analogyVector\":[0.3,0.9,0.9],\"status\":\"SEMANTIC_VECTOR_ANALOGY_COMPUTED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the resulting vector from King [0.8, 0.2, 0.9] - Man [0.7, 0.1, 0.1] + Woman [0.2, 0.8, 0.1]?",
          "expectedStringOutput": "[0.3,0.9,0.9]",
          "acceptableAnswers": [
            "[0.3,0.9,0.9]",
            "analogyVector\":[0.3,0.9,0.9]",
            "[0.3, 0.9, 0.9]"
          ],
          "primaryMisconceptionId": "MC_NLP_WORD2VEC_SKIPGRAM_CBOW_NEGATIVE_SAMPLING",
          "diagnosisMap": {
            "[0.8,0.2,0.9]": {
              "misconceptionId": "MC_NLP_WORD2VEC_SKIPGRAM_CBOW_NEGATIVE_SAMPLING",
              "errorExplanation": "0.8 - 0.7 + 0.2 = 0.3; 0.2 - 0.1 + 0.8 = 0.9; 0.9 - 0.1 + 0.1 = 0.9.",
              "recoveryPath": {
                "simplerExplanation": "Vector is [0.3,0.9,0.9].",
                "guidedFixPrompt": "Type [0.3,0.9,0.9]"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d7-b2-cbow-acronym-name",
        "day": 7,
        "blockNumber": 2,
        "title": "The Continuous Bag-of-Words Architecture Acronym: `CBOW`",
        "conceptBudget": {
          "primaryConcept": "CBOW Invariant",
          "supportingTerms": [
            "`CBOW` (`Continuous Bag-of-Words: The Word2Vec neural architecture that predicts a target center word given its surrounding context words`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d7-b1-vector-analogy-engine",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CBOW vs Skip-Gram",
            "codeSnippet": "/* 1. CBOW (Continuous Bag of Words) */\nContext Words [\"the\", \"brown\", \"fox\"] -> Predicts Center Word: \"quick\"\n\n/* 2. SKIP-GRAM */\nCenter Word: \"quick\" -> Predicts Context Words: [\"the\", \"brown\", \"fox\"]",
            "lineNotes": {
              "2": "CBOW predicts target from context window.",
              "5": "Skip-Gram predicts context window from target word."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cbow_name_demo.js",
            "initialCode": "function getCbow() {\n  return 'CBOW';\n}\n\nconsole.log(getCbow());",
            "expectedOutput": "CBOW",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the acronym for Word2Vec's Continuous Bag-of-Words model?",
          "expectedStringOutput": "CBOW",
          "acceptableAnswers": [
            "CBOW",
            "'CBOW'",
            "cbow"
          ],
          "primaryMisconceptionId": "MC_NLP_WORD2VEC_SKIPGRAM_CBOW_NEGATIVE_SAMPLING",
          "diagnosisMap": {
            "SkipGram": {
              "misconceptionId": "MC_NLP_WORD2VEC_SKIPGRAM_CBOW_NEGATIVE_SAMPLING",
              "errorExplanation": "Skip-Gram predicts context. Continuous Bag-of-Words is CBOW.",
              "recoveryPath": {
                "simplerExplanation": "Type CBOW.",
                "guidedFixPrompt": "Type CBOW"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d7-b3-negative-sampling-computational-efficiency",
        "day": 7,
        "blockNumber": 3,
        "title": "Optimization: Negative Sampling to Avoid Full $|V|$ Softmax Normalization",
        "conceptBudget": {
          "primaryConcept": "Negative Sampling Invariant",
          "supportingTerms": [
            "Negative Sampling (`Replacing full $|V| = 1,000,000$ softmax denominator with binary logistic regression over $k=5$ noise words speeds up training 10,000x`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d7-b2-cbow-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "negative_sampling_demo.js",
            "initialCode": "function getNegativeSamplingRule() {\n  return 'NEGATIVE_SAMPLING_APPROXIMATES_FULL_VOCABULARY_SOFTMAX_WITH_BINARY_LOGISTIC_REGRESSION';\n}\n\nconsole.log(getNegativeSamplingRule());",
            "expectedOutput": "NEGATIVE_SAMPLING_APPROXIMATES_FULL_VOCABULARY_SOFTMAX_WITH_BINARY_LOGISTIC_REGRESSION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How does Negative Sampling enable fast Word2Vec training on massive vocabularies?",
          "expectedStringOutput": "NEGATIVE_SAMPLING_APPROXIMATES_FULL_VOCABULARY_SOFTMAX_WITH_BINARY_LOGISTIC_REGRESSION",
          "acceptableAnswers": [
            "NEGATIVE_SAMPLING_APPROXIMATES_FULL_VOCABULARY_SOFTMAX_WITH_BINARY_LOGISTIC_REGRESSION",
            "Approximates full softmax with binary logistic regression",
            "Binary logistic regression"
          ],
          "primaryMisconceptionId": "MC_NLP_WORD2VEC_SKIPGRAM_CBOW_NEGATIVE_SAMPLING",
          "diagnosisMap": {
            "FULL_SOFTMAX": {
              "misconceptionId": "MC_NLP_WORD2VEC_SKIPGRAM_CBOW_NEGATIVE_SAMPLING",
              "errorExplanation": "Standard is: NEGATIVE_SAMPLING_APPROXIMATES_FULL_VOCABULARY_SOFTMAX_WITH_BINARY_LOGISTIC_REGRESSION.",
              "recoveryPath": {
                "simplerExplanation": "Matches NEGATIVE_SAMPLING_APPROXIMATES_FULL_VOCABULARY_SOFTMAX_WITH_BINARY_LOGISTIC_REGRESSION.",
                "guidedFixPrompt": "Type NEGATIVE_SAMPLING_APPROXIMATES_FULL_VOCABULARY_SOFTMAX_WITH_BINARY_LOGISTIC_REGRESSION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Subword Embeddings: FastText & Out-Of-Vocabulary (OOV) Resilience",
    "overviewMetaphor": "FastText Is a Compound Word Lego Set: If a standard Word2Vec dictionary encounters a misspelled or unseen word ('whereverr'), it throws its hands up (`OOV`); FastText decomposes the word into overlapping character $n$-gram sub-bricks (`'<wh', 'whe', 'ere', 'err>'`), building a rich vector from subword pieces.",
    "blocks": [
      {
        "id": "nlp-d8-b1-fasttext-ngram-generator",
        "day": 8,
        "blockNumber": 1,
        "title": "FastText: Generating Character $n$-Grams for `'cat'` ($n=3 \\to 4$ Total Subwords)",
        "conceptBudget": {
          "primaryConcept": "FastText Character N-Gram Generator",
          "supportingTerms": [
            "Tagged Word (`'<cat>'`)",
            "Character 3-Grams (`['<ca', 'cat', 'at>']`)",
            "Whole Word Tag (`'<cat>'`)",
            "Total Subwords ($4$)",
            "Status: Character Ngrams Generated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d7-b1-vector-analogy-engine",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "FastText Subword Character Decomposition Ledger",
              "boxes": [
                {
                  "label": "1. Tagged Word Boundary",
                  "value": "'<cat>' (Length 5 characters with boundary tags)",
                  "varType": "Tagged String",
                  "isUpdated": false
                },
                {
                  "label": "2. Character 3-Grams",
                  "value": "'<ca', 'cat', 'at>' (3 subword chunks)",
                  "varType": "n-Grams",
                  "isUpdated": false
                },
                {
                  "label": "3. Complete Subword Pool",
                  "value": "['<ca', 'cat', 'at>', '<cat>'] = 4 total n-grams (GENERATED NOMINAL!)",
                  "varType": "Pool",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "fasttext_demo.js",
            "initialCode": "function genNgrams(word, minN, maxN) {\n  const tagged = `<${word}>`;\n  const res = [];\n  for (let n = minN; n <= maxN; n++) {\n    for (let i = 0; i <= tagged.length - n; i++) {\n      res.push(tagged.substring(i, i + n));\n    }\n  }\n  res.push(tagged);\n  return {\n    totalNGrams: res.length,\n    ngrams: res,\n    status: 'CHARACTER_NGRAMS_GENERATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(genNgrams('cat', 3, 3)));",
            "expectedOutput": "{\"totalNGrams\":4,\"ngrams\":[\"<ca\",\"cat\",\"at>\",\"<cat>\"],\"status\":\"CHARACTER_NGRAMS_GENERATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many total subword character n-grams are generated for 'cat' with minN=3 and maxN=3 including whole word tag?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "totalNGrams\":4",
            "four"
          ],
          "primaryMisconceptionId": "MC_NLP_FASTTEXT_SUBWORD_EMBEDDINGS_OOV",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_NLP_FASTTEXT_SUBWORD_EMBEDDINGS_OOV",
              "errorExplanation": "3 substrings ('<ca', 'cat', 'at>') + 1 whole word ('<cat>') = 4.",
              "recoveryPath": {
                "simplerExplanation": "Count is 4.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d8-b2-oov-acronym-name",
        "day": 8,
        "blockNumber": 2,
        "title": "The Out-Of-Vocabulary Acronym: `OOV`",
        "conceptBudget": {
          "primaryConcept": "OOV Acronym Invariant",
          "supportingTerms": [
            "`OOV` (`Out-Of-Vocabulary: Words encountered at inference time that were never seen in the fixed training vocabulary dictionary`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d8-b1-fasttext-ngram-generator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "OOV Handling Comparison",
            "codeSnippet": "/* 1. Word2Vec on Unseen Word 'electromechanical' */\nword2vec['electromechanical'] -> KeyError! (OOV crash / <UNK> generic token)\n\n/* 2. FastText on Unseen Word 'electromechanical' */\nfastText['electromechanical'] -> Sums embeddings of 'electro', 'mechan', 'ical' (Accurate vector!)",
            "lineNotes": {
              "2": "Word2Vec fails on OOV.",
              "5": "FastText synthesizes vectors from subword n-grams."
            }
          },
          {
            "type": "runnable_code",
            "filename": "oov_name_demo.js",
            "initialCode": "function getOov() {\n  return 'OOV';\n}\n\nconsole.log(getOov());",
            "expectedOutput": "OOV",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the industry acronym for unseen words that do not exist in a pre-trained vocabulary?",
          "expectedStringOutput": "OOV",
          "acceptableAnswers": [
            "OOV",
            "'OOV'",
            "oov",
            "Out-Of-Vocabulary"
          ],
          "primaryMisconceptionId": "MC_NLP_FASTTEXT_SUBWORD_EMBEDDINGS_OOV",
          "diagnosisMap": {
            "UNK": {
              "misconceptionId": "MC_NLP_FASTTEXT_SUBWORD_EMBEDDINGS_OOV",
              "errorExplanation": "UNK is the token name. The acronym for Out-Of-Vocabulary is OOV.",
              "recoveryPath": {
                "simplerExplanation": "Type OOV.",
                "guidedFixPrompt": "Type OOV"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d8-b3-morphological-generalization-power",
        "day": 8,
        "blockNumber": 3,
        "title": "Subword Power: Generalizing Across Suffixes, Prefixes and Misspellings",
        "conceptBudget": {
          "primaryConcept": "Morphological Subword Invariant",
          "supportingTerms": [
            "Subword Generalization (`FastText represents prefixes and suffixes explicitly, allowing models to infer that 'unhappy' and 'unlucky' share negative prefix semantics`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d8-b2-oov-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "subword_power_demo.js",
            "initialCode": "function getSubwordRule() {\n  return 'CHARACTER_NGRAMS_ALLOW_EMBEDDING_RECOVERY_FOR_TYPOS_AND_UNSEEN_MORPHOLOGY';\n}\n\nconsole.log(getSubwordRule());",
            "expectedOutput": "CHARACTER_NGRAMS_ALLOW_EMBEDDING_RECOVERY_FOR_TYPOS_AND_UNSEEN_MORPHOLOGY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why do subword character n-gram embeddings outperform word-level embeddings on rare words?",
          "expectedStringOutput": "CHARACTER_NGRAMS_ALLOW_EMBEDDING_RECOVERY_FOR_TYPOS_AND_UNSEEN_MORPHOLOGY",
          "acceptableAnswers": [
            "CHARACTER_NGRAMS_ALLOW_EMBEDDING_RECOVERY_FOR_TYPOS_AND_UNSEEN_MORPHOLOGY",
            "Embedding recovery for typos and unseen morphology",
            "Recover embeddings for unseen words"
          ],
          "primaryMisconceptionId": "MC_NLP_FASTTEXT_SUBWORD_EMBEDDINGS_OOV",
          "diagnosisMap": {
            "NO_DIFFERENCE": {
              "misconceptionId": "MC_NLP_FASTTEXT_SUBWORD_EMBEDDINGS_OOV",
              "errorExplanation": "Standard is: CHARACTER_NGRAMS_ALLOW_EMBEDDING_RECOVERY_FOR_TYPOS_AND_UNSEEN_MORPHOLOGY.",
              "recoveryPath": {
                "simplerExplanation": "Matches CHARACTER_NGRAMS_ALLOW_EMBEDDING_RECOVERY_FOR_TYPOS_AND_UNSEEN_MORPHOLOGY.",
                "guidedFixPrompt": "Type CHARACTER_NGRAMS_ALLOW_EMBEDDING_RECOVERY_FOR_TYPOS_AND_UNSEEN_MORPHOLOGY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Global Vectors for Word Representation: GloVe Co-Occurrence Matrix Factorization",
    "overviewMetaphor": "GloVe Weighting Is a Volume Compressor on an Audio Track: If two words co-occur 1,000,000 times (like 'the' and 'of'), a linear loss function would blow out the speakers; the GloVe weighting function caps maximum weight at $1.0$ ($x_{\\max} = 100$) and applies a sub-linear power curve ($x^{0.75} = 0.5946$ for $x=50$), balancing frequent and rare co-occurrences (`GLOVE_WEIGHT_CALCULATED_NOMINAL`).",
    "blocks": [
      {
        "id": "nlp-d9-b1-glove-weight-calculator",
        "day": 9,
        "blockNumber": 1,
        "title": "GloVe: Calculating Non-Linear Weighting Function $f(x) = \\min(1, (x/100)^{0.75})$",
        "conceptBudget": {
          "primaryConcept": "GloVe Weighting Function Calculator",
          "supportingTerms": [
            "Co-occurrence Count ($x = 150$ vs $50$)",
            "Ceiling Count ($x_{\\max} = 100$)",
            "Alpha Exponent ($0.75$)",
            "Computed Weight ($1.0$ vs $0.5946$)",
            "Status: GloVe Weight Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d8-b1-fasttext-ngram-generator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "GloVe Matrix Factorization Weighting Ledger",
              "boxes": [
                {
                  "label": "Frequent Pair (x=150, xMax=100)",
                  "value": "x >= xMax -> Capped at max weight = 1.0",
                  "varType": "Capped Max",
                  "isUpdated": false
                },
                {
                  "label": "Moderate Pair (x=50, xMax=100)",
                  "value": "(50/100)^0.75 = (0.5)^0.75 = 0.5946",
                  "varType": "Sub-linear Weight",
                  "isUpdated": false
                },
                {
                  "label": "Weighting Status",
                  "value": "GLOVE WEIGHT CALCULATED NOMINAL (NOISE SATURATION AVOIDED!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "glove_weight_demo.js",
            "initialCode": "function calcGloveWeight(x, xMax, alpha) {\n  if (x <= 0) return { weight: 0.0, status: 'GLOVE_WEIGHT_CALCULATED_NOMINAL' };\n  const ratio = x / xMax;\n  const w = ratio >= 1.0 ? 1.0 : Number(Math.pow(ratio, alpha).toFixed(4));\n  return {\n    coOccurrenceCount: x,\n    weight: w,\n    status: 'GLOVE_WEIGHT_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcGloveWeight(150, 100, 0.75)));\nconsole.log(JSON.stringify(calcGloveWeight(50, 100, 0.75)));",
            "expectedOutput": "{\"coOccurrenceCount\":150,\"weight\":1,\"status\":\"GLOVE_WEIGHT_CALCULATED_NOMINAL\"}\n{\"coOccurrenceCount\":50,\"weight\":0.5946,\"status\":\"GLOVE_WEIGHT_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the GloVe weighting factor for co-occurrence count 50 with xMax 100 and alpha 0.75?",
          "expectedStringOutput": "0.5946",
          "acceptableAnswers": [
            "0.5946",
            "weight\":0.5946",
            "0.595"
          ],
          "primaryMisconceptionId": "MC_NLP_GLOVE_COOCCURRENCE_MATRIX_FACTORIZATION",
          "diagnosisMap": {
            "0.5": {
              "misconceptionId": "MC_NLP_GLOVE_COOCCURRENCE_MATRIX_FACTORIZATION",
              "errorExplanation": "(50/100)^0.75 = (0.5)^0.75 = 0.5946.",
              "recoveryPath": {
                "simplerExplanation": "Weight is 0.5946.",
                "guidedFixPrompt": "Type 0.5946"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d9-b2-glove-standard-alpha-number",
        "day": 9,
        "blockNumber": 2,
        "title": "The Standard GloVe Sub-Linear Exponent: `0.75`",
        "conceptBudget": {
          "primaryConcept": "GloVe Alpha 0.75 Invariant",
          "supportingTerms": [
            "Alpha 0.75 (`The empirical standard exponent $\\alpha = 3/4 = 0.75$ derived by Pennington et al. to give rare co-occurrences a modest boost without overfitting noise`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d9-b1-glove-weight-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "GloVe Objective Loss Function",
            "codeSnippet": "/* GLOVE OBJECTIVE FUNCTION */\nJ = sum_{i,j=1}^V f(X_ij) * (w_i^T * w_j_tilde + b_i + b_j_tilde - log(X_ij))^2\n\n// where f(x) = (x / x_max)^0.75 if x < x_max else 1.0",
            "lineNotes": {
              "2": "Log-bilinear co-occurrence matrix factorization.",
              "4": "Alpha 0.75 weighting function."
            }
          },
          {
            "type": "runnable_code",
            "filename": "glove_alpha_demo.js",
            "initialCode": "function getGloveAlpha() {\n  return 0.75;\n}\n\nconsole.log(getGloveAlpha());",
            "expectedOutput": "0.75",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the standard alpha exponent value used in the GloVe weighting function?",
          "expectedStringOutput": "0.75",
          "acceptableAnswers": [
            "0.75",
            "0.750",
            "3/4"
          ],
          "primaryMisconceptionId": "MC_NLP_GLOVE_COOCCURRENCE_MATRIX_FACTORIZATION",
          "diagnosisMap": {
            "1.0": {
              "misconceptionId": "MC_NLP_GLOVE_COOCCURRENCE_MATRIX_FACTORIZATION",
              "errorExplanation": "Alpha 1.0 is linear. The sub-linear GloVe standard is 0.75.",
              "recoveryPath": {
                "simplerExplanation": "Type 0.75.",
                "guidedFixPrompt": "Type 0.75"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d9-b3-word2vec-vs-glove-architecture-difference",
        "day": 9,
        "blockNumber": 3,
        "title": "Theoretical Synthesis: Global Matrix Factorization vs Local Window Streaming",
        "conceptBudget": {
          "primaryConcept": "GloVe Global Matrix Invariant",
          "supportingTerms": [
            "Global Statistics vs Local Windows (`Word2Vec trains iteratively over local streaming windows; GloVe fits embeddings directly to the global corpus-wide co-occurrence matrix`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d9-b2-glove-standard-alpha-number",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "glove_theory_demo.js",
            "initialCode": "function getGloveTheoryRule() {\n  return 'GLOVE_LEVERAGES_GLOBAL_COOCCURRENCE_STATISTICS_RATHER_THAN_LOCAL_STREAMING_WINDOWS';\n}\n\nconsole.log(getGloveTheoryRule());",
            "expectedOutput": "GLOVE_LEVERAGES_GLOBAL_COOCCURRENCE_STATISTICS_RATHER_THAN_LOCAL_STREAMING_WINDOWS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What architectural advantage distinguishes GloVe from traditional Skip-Gram Word2Vec?",
          "expectedStringOutput": "GLOVE_LEVERAGES_GLOBAL_COOCCURRENCE_STATISTICS_RATHER_THAN_LOCAL_STREAMING_WINDOWS",
          "acceptableAnswers": [
            "GLOVE_LEVERAGES_GLOBAL_COOCCURRENCE_STATISTICS_RATHER_THAN_LOCAL_STREAMING_WINDOWS",
            "Global co-occurrence statistics",
            "Leverages global co-occurrence statistics"
          ],
          "primaryMisconceptionId": "MC_NLP_GLOVE_COOCCURRENCE_MATRIX_FACTORIZATION",
          "diagnosisMap": {
            "NO_DIFFERENCE": {
              "misconceptionId": "MC_NLP_GLOVE_COOCCURRENCE_MATRIX_FACTORIZATION",
              "errorExplanation": "Standard is: GLOVE_LEVERAGES_GLOBAL_COOCCURRENCE_STATISTICS_RATHER_THAN_LOCAL_STREAMING_WINDOWS.",
              "recoveryPath": {
                "simplerExplanation": "Matches GLOVE_LEVERAGES_GLOBAL_COOCCURRENCE_STATISTICS_RATHER_THAN_LOCAL_STREAMING_WINDOWS.",
                "guidedFixPrompt": "Type GLOVE_LEVERAGES_GLOBAL_COOCCURRENCE_STATISTICS_RATHER_THAN_LOCAL_STREAMING_WINDOWS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Part-of-Speech Tagging with Hidden Markov Models: Viterbi Trellis Algorithm",
    "overviewMetaphor": "The Viterbi Algorithm Is a GPS Road-Trip Route Planner: Instead of calculating all $N^T$ possible global paths (millions of combinations), the Viterbi trellis dynamic programming table records only the single best incoming highway path to each checkpoint ($v_t = v_{t-1} \\times A_{ij} \\times B_j$), discovering the optimal sequence of grammatical tags in $O(N^2 T)$ time.",
    "blocks": [
      {
        "id": "nlp-d10-b1-viterbi-step-calculator",
        "day": 10,
        "blockNumber": 1,
        "title": "HMM POS Tagging: Calculating Viterbi Trellis Path Probability ($0.5 \\times 0.4 \\times 0.2 = 0.04$)",
        "conceptBudget": {
          "primaryConcept": "Viterbi Trellis Step Probability Step Calculator",
          "supportingTerms": [
            "Previous Trellis Prob ($v_{t-1} = 0.5$)",
            "Transition Prob ($A_{ij} = 0.4$)",
            "Emission Prob ($B_j(w) = 0.2$)",
            "Path Prob ($0.04$)",
            "Status: Viterbi Step Probability Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d9-b1-glove-weight-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Viterbi Trellis Step Transition Ledger",
              "boxes": [
                {
                  "label": "Previous Node Prob v_{t-1}(i)",
                  "value": "0.5 (Probability of arriving at tag NOUN at t-1)",
                  "varType": "v_{t-1}",
                  "isUpdated": false
                },
                {
                  "label": "Transition A_{ij} & Emission B_j",
                  "value": "P(VERB | NOUN) = 0.4; P('runs' | VERB) = 0.2",
                  "varType": "Probabilities",
                  "isUpdated": false
                },
                {
                  "label": "Trellis Step Probability",
                  "value": "0.5 * 0.4 * 0.2 = 0.04 (VITERBI STEP CALCULATED NOMINAL!)",
                  "varType": "v_t",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "viterbi_demo.js",
            "initialCode": "function calcViterbiStep(prevV, transP, emissP) {\n  const prob = Number((prevV * transP * emissP).toFixed(6));\n  return {\n    trellisPathProb: prob,\n    status: 'VITERBI_STEP_PROBABILITY_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcViterbiStep(0.5, 0.4, 0.2)));",
            "expectedOutput": "{\"trellisPathProb\":0.04,\"status\":\"VITERBI_STEP_PROBABILITY_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Viterbi trellis path probability for prevProb 0.5, transitionProb 0.4, and emissionProb 0.2?",
          "expectedStringOutput": "0.04",
          "acceptableAnswers": [
            "0.04",
            "trellisPathProb\":0.04",
            "0.040"
          ],
          "primaryMisconceptionId": "MC_NLP_HMM_POS_TAGGING_VITERBI_TRELLIS",
          "diagnosisMap": {
            "0.2": {
              "misconceptionId": "MC_NLP_HMM_POS_TAGGING_VITERBI_TRELLIS",
              "errorExplanation": "0.5 * 0.4 * 0.2 = 0.04.",
              "recoveryPath": {
                "simplerExplanation": "Probability is 0.04.",
                "guidedFixPrompt": "Type 0.04"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d10-b2-viterbi-algorithm-name",
        "day": 10,
        "blockNumber": 2,
        "title": "The Dynamic Programming Sequence Decoding Algorithm: `Viterbi`",
        "conceptBudget": {
          "primaryConcept": "Viterbi Algorithm Invariant",
          "supportingTerms": [
            "`Viterbi` (`The dynamic programming algorithm that computes the most likely sequence of hidden states in a Hidden Markov Model`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d10-b1-viterbi-step-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Viterbi Dynamic Programming Recurrence",
            "codeSnippet": "/* VITERBI RECURRENCE EQUATION */\nv_t(j) = max_{i=1...N} [ v_{t-1}(i) * A_ij ] * B_j(w_t)\n\n// Backpointer Table:\nbackpointer[t, j] = argmax_{i=1...N} [ v_{t-1}(i) * A_ij ]",
            "lineNotes": {
              "2": "Calculates highest probability path leading to state j at time t.",
              "5": "Backpointer records predecessor tag for backtracking optimal sequence."
            }
          },
          {
            "type": "runnable_code",
            "filename": "viterbi_name_demo.js",
            "initialCode": "function getViterbiName() {\n  return 'Viterbi';\n}\n\nconsole.log(getViterbiName());",
            "expectedOutput": "Viterbi",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What dynamic programming algorithm decodes the optimal Hidden Markov Model state sequence?",
          "expectedStringOutput": "Viterbi",
          "acceptableAnswers": [
            "Viterbi",
            "'Viterbi'",
            "viterbi",
            "Viterbi algorithm"
          ],
          "primaryMisconceptionId": "MC_NLP_HMM_POS_TAGGING_VITERBI_TRELLIS",
          "diagnosisMap": {
            "Dijkstra": {
              "misconceptionId": "MC_NLP_HMM_POS_TAGGING_VITERBI_TRELLIS",
              "errorExplanation": "Dijkstra is shortest path in graphs. HMM sequence decoding is Viterbi.",
              "recoveryPath": {
                "simplerExplanation": "Type Viterbi.",
                "guidedFixPrompt": "Type Viterbi"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d10-b3-log-space-viterbi-numerical-stability",
        "day": 10,
        "blockNumber": 3,
        "title": "Numerical Stability: Computing Viterbi Trellis in Log-Space to Prevent Floating Underflow",
        "conceptBudget": {
          "primaryConcept": "Log-Space Viterbi Invariant",
          "supportingTerms": [
            "Log-Space Viterbi (`Converting probability products $\\prod P$ to log-probability additions $\\sum \\log P$ prevents underflow into zero on 100-word sequences`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d10-b2-viterbi-algorithm-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "log_viterbi_demo.js",
            "initialCode": "function getLogViterbiRule() {\n  return 'COMPUTE_VITERBI_IN_LOG_SPACE_TO_PREVENT_FLOATING_POINT_UNDERFLOW';\n}\n\nconsole.log(getLogViterbiRule());",
            "expectedOutput": "COMPUTE_VITERBI_IN_LOG_SPACE_TO_PREVENT_FLOATING_POINT_UNDERFLOW",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why do production POS taggers implement the Viterbi algorithm using addition in log-space?",
          "expectedStringOutput": "COMPUTE_VITERBI_IN_LOG_SPACE_TO_PREVENT_FLOATING_POINT_UNDERFLOW",
          "acceptableAnswers": [
            "COMPUTE_VITERBI_IN_LOG_SPACE_TO_PREVENT_FLOATING_POINT_UNDERFLOW",
            "Prevent floating point underflow",
            "Prevent underflow"
          ],
          "primaryMisconceptionId": "MC_NLP_HMM_POS_TAGGING_VITERBI_TRELLIS",
          "diagnosisMap": {
            "LINEAR_IS_FINE": {
              "misconceptionId": "MC_NLP_HMM_POS_TAGGING_VITERBI_TRELLIS",
              "errorExplanation": "Standard is: COMPUTE_VITERBI_IN_LOG_SPACE_TO_PREVENT_FLOATING_POINT_UNDERFLOW.",
              "recoveryPath": {
                "simplerExplanation": "Matches COMPUTE_VITERBI_IN_LOG_SPACE_TO_PREVENT_FLOATING_POINT_UNDERFLOW.",
                "guidedFixPrompt": "Type COMPUTE_VITERBI_IN_LOG_SPACE_TO_PREVENT_FLOATING_POINT_UNDERFLOW"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Named Entity Recognition (NER): BIO Scheme & Sequence Chunking",
    "overviewMetaphor": "The BIO Tagging Scheme Is a Baggage Luggage Label: `B-PER` is the baggage tag marking the start of a passenger name ('John'); `I-PER` marks continuation pieces ('von', 'Neumann'); `O` marks ordinary luggage ('flew to'); `B-LOC` marks the destination entity ('Zurich'). An `I-PER` without a preceding `B-PER` is an orphan tag error.",
    "blocks": [
      {
        "id": "nlp-d11-b1-bio-sequence-validator",
        "day": 11,
        "blockNumber": 1,
        "title": "Named Entity Recognition: Validating BIO Tag Transitions (`BIO_SEQUENCE_VALIDATED_NOMINAL`)",
        "conceptBudget": {
          "primaryConcept": "NER BIO Tag Sequence Transition Validator",
          "supportingTerms": [
            "BIO Scheme (`'B-PER'`, `'I-PER'`, `'O'`, `'B-ORG'`)",
            "Invalid Transition Detection (Orphan `'I-PER'`)",
            "Status: BIO Sequence Validated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d10-b1-viterbi-step-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "NER BIO Scheme Transition Constraint Ledger",
              "boxes": [
                {
                  "label": "Valid Sequence",
                  "value": "['B-PER', 'I-PER', 'O', 'B-ORG'] -> Valid consecutive continuation (NOMINAL!)",
                  "varType": "Valid Sequence",
                  "isUpdated": true
                },
                {
                  "label": "Invalid Sequence",
                  "value": "['O', 'I-PER', 'O'] -> Orphan I-PER without preceding B-PER (DEFECT REJECTED)",
                  "varType": "Invalid Sequence",
                  "isUpdated": false
                },
                {
                  "label": "Validation Status",
                  "value": "BIO SEQUENCE VALIDATED NOMINAL (STRUCTURAL INTEGRITY CERTIFIED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bio_validator_demo.js",
            "initialCode": "function validateBio(tags) {\n  let ok = true;\n  for (let i = 0; i < tags.length; i++) {\n    const tag = tags[i];\n    if (tag.startsWith('I-')) {\n      const type = tag.substring(2);\n      const prev = tags[i - 1];\n      if (!prev || (!prev.endsWith(type) || (!prev.startsWith('B-') && !prev.startsWith('I-')))) {\n        ok = false;\n        break;\n      }\n    }\n  }\n  return {\n    isBioSequenceValid: ok,\n    status: ok ? 'BIO_SEQUENCE_VALIDATED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(validateBio(['B-PER', 'I-PER', 'O', 'B-ORG'])));\nconsole.log(JSON.stringify(validateBio(['O', 'I-PER', 'O'])));",
            "expectedOutput": "{\"isBioSequenceValid\":true,\"status\":\"BIO_SEQUENCE_VALIDATED_NOMINAL\"}\n{\"isBioSequenceValid\":false,\"status\":\"DEFECT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that an NER sequence has valid BIO chunking transitions?",
          "expectedStringOutput": "BIO_SEQUENCE_VALIDATED_NOMINAL",
          "acceptableAnswers": [
            "BIO_SEQUENCE_VALIDATED_NOMINAL",
            "status\":\"BIO_SEQUENCE_VALIDATED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_NLP_NAMED_ENTITY_RECOGNITION_BIO_SCHEME",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_NLP_NAMED_ENTITY_RECOGNITION_BIO_SCHEME",
              "errorExplanation": "Matches BIO_SEQUENCE_VALIDATED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type BIO_SEQUENCE_VALIDATED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d11-b2-outside-tag-character-name",
        "day": 11,
        "blockNumber": 2,
        "title": "The Non-Entity Outside Tag Character: `O`",
        "conceptBudget": {
          "primaryConcept": "Outside Tag 'O' Invariant",
          "supportingTerms": [
            "`O` (`Outside: Represents all non-named-entity tokens such as verbs, prepositions, articles, and punctuation`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d11-b1-bio-sequence-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "BIO Tagging Breakdown",
            "codeSnippet": "Token:  Alan     Turing   designed the  ACE      computer  in   London   .\nTag:    B-PER    I-PER    O        O    B-MISC   O         O    B-LOC    O",
            "lineNotes": {
              "2": "B-PER begins Person, I-PER continues Person, O marks non-entities."
            }
          },
          {
            "type": "runnable_code",
            "filename": "outside_tag_demo.js",
            "initialCode": "function getOutsideTag() {\n  return 'O';\n}\n\nconsole.log(getOutsideTag());",
            "expectedOutput": "O",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What single character tag represents non-entity words in the BIO/IOB format?",
          "expectedStringOutput": "O",
          "acceptableAnswers": [
            "O",
            "'O'",
            "Outside"
          ],
          "primaryMisconceptionId": "MC_NLP_NAMED_ENTITY_RECOGNITION_BIO_SCHEME",
          "diagnosisMap": {
            "N": {
              "misconceptionId": "MC_NLP_NAMED_ENTITY_RECOGNITION_BIO_SCHEME",
              "errorExplanation": "The standard outside tag in BIO is 'O' (letter O).",
              "recoveryPath": {
                "simplerExplanation": "Type O.",
                "guidedFixPrompt": "Type O"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d11-b3-entity-level-f1-evaluation",
        "day": 11,
        "blockNumber": 3,
        "title": "NER Evaluation: Measuring Strict Exact-Span Entity-Level F1 Rather than Token Accuracy",
        "conceptBudget": {
          "primaryConcept": "Entity-Level F1 Invariant",
          "supportingTerms": [
            "Entity-Level F1 (`Because 90% of corpus tokens are 'O', token accuracy gives false 90% scores; evaluation requires full span precision and recall`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d11-b2-outside-tag-character-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "entity_f1_demo.js",
            "initialCode": "function getEntityF1Rule() {\n  return 'EVALUATE_NER_WITH_SPAN_LEVEL_PRECISION_RECALL_F1_TO_AVOID_MAJORITY_O_CLASS_BIAS';\n}\n\nconsole.log(getEntityF1Rule());",
            "expectedOutput": "EVALUATE_NER_WITH_SPAN_LEVEL_PRECISION_RECALL_F1_TO_AVOID_MAJORITY_O_CLASS_BIAS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why is token-level accuracy an invalid evaluation metric for Named Entity Recognition systems?",
          "expectedStringOutput": "EVALUATE_NER_WITH_SPAN_LEVEL_PRECISION_RECALL_F1_TO_AVOID_MAJORITY_O_CLASS_BIAS",
          "acceptableAnswers": [
            "EVALUATE_NER_WITH_SPAN_LEVEL_PRECISION_RECALL_F1_TO_AVOID_MAJORITY_O_CLASS_BIAS",
            "Majority O class bias",
            "Span level F1 avoids O class bias"
          ],
          "primaryMisconceptionId": "MC_NLP_NAMED_ENTITY_RECOGNITION_BIO_SCHEME",
          "diagnosisMap": {
            "ACCURACY_IS_SUFFICIENT": {
              "misconceptionId": "MC_NLP_NAMED_ENTITY_RECOGNITION_BIO_SCHEME",
              "errorExplanation": "Standard is: EVALUATE_NER_WITH_SPAN_LEVEL_PRECISION_RECALL_F1_TO_AVOID_MAJORITY_O_CLASS_BIAS.",
              "recoveryPath": {
                "simplerExplanation": "Matches EVALUATE_NER_WITH_SPAN_LEVEL_PRECISION_RECALL_F1_TO_AVOID_MAJORITY_O_CLASS_BIAS.",
                "guidedFixPrompt": "Type EVALUATE_NER_WITH_SPAN_LEVEL_PRECISION_RECALL_F1_TO_AVOID_MAJORITY_O_CLASS_BIAS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Sentiment Analysis & Text Classification: Naive Bayes Log-Likelihood",
    "overviewMetaphor": "Naive Bayes Log-Sum Is an Arithmetic Balance Scale: Instead of multiplying dozens of tiny decimal probabilities together until the computer rounds them down to $0.0000000000000000000$ (underflow), we convert each term to its negative logarithm, turning multiplication into simple robust additions ($-0.6931 + (-1.2039) + (-0.9163) + (-1.6094) = -4.4227$).",
    "blocks": [
      {
        "id": "nlp-d12-b1-naive-bayes-log-scorer",
        "day": 12,
        "blockNumber": 1,
        "title": "Naive Bayes: Summing Prior + Feature Log-Likelihoods ($-0.6931 + \\sum = -4.4227$)",
        "conceptBudget": {
          "primaryConcept": "Naive Bayes Document Log-Likelihood Scorer",
          "supportingTerms": [
            "Class Prior Log ($-0.6931$)",
            "Feature Log Likelihoods",
            "Composite Log Score ($-4.4227$)",
            "Status: Naive Bayes Log Score Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d11-b1-bio-sequence-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Naive Bayes Log Probability Accumulator Ledger",
              "boxes": [
                {
                  "label": "1. Class Prior log P(Positive)",
                  "value": "log(0.5) = -0.6931",
                  "varType": "Prior",
                  "isUpdated": false
                },
                {
                  "label": "2. Word Log Likelihoods",
                  "value": "['great': -1.2039, 'product': -0.9163, 'love': -1.6094]",
                  "varType": "Likelihoods",
                  "isUpdated": false
                },
                {
                  "label": "3. Composite Log Score",
                  "value": "-0.6931 + (-1.2039) + (-0.9163) + (-1.6094) = -4.4227 (CALCULATED NOMINAL!)",
                  "varType": "Score",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "naive_bayes_demo.js",
            "initialCode": "function calcNbScore(prior, likelihoods) {\n  let total = prior;\n  likelihoods.forEach(l => total += l);\n  return {\n    compositeLogScore: Number(total.toFixed(4)),\n    status: 'NAIVE_BAYES_LOG_SCORE_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcNbScore(-0.6931, [-1.2039, -0.9163, -1.6094])));",
            "expectedOutput": "{\"compositeLogScore\":-4.4227,\"status\":\"NAIVE_BAYES_LOG_SCORE_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the composite log score for prior -0.6931 and likelihoods [-1.2039, -0.9163, -1.6094]?",
          "expectedStringOutput": "-4.4227",
          "acceptableAnswers": [
            "-4.4227",
            "compositeLogScore\":-4.4227",
            "-4.423"
          ],
          "primaryMisconceptionId": "MC_NLP_NAIVE_BAYES_LOG_LIKELIHOOD_SENTIMENT",
          "diagnosisMap": {
            "-3.7296": {
              "misconceptionId": "MC_NLP_NAIVE_BAYES_LOG_LIKELIHOOD_SENTIMENT",
              "errorExplanation": "Must include prior: -0.6931 + sum(-3.7296) = -4.4227.",
              "recoveryPath": {
                "simplerExplanation": "Score is -4.4227.",
                "guidedFixPrompt": "Type -4.4227"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d12-b2-numerical-stability-transform-name",
        "day": 12,
        "blockNumber": 2,
        "title": "The Numerical Stabilization Transformation: `Logarithm`",
        "conceptBudget": {
          "primaryConcept": "Logarithm Transformation Invariant",
          "supportingTerms": [
            "`Logarithm` (`Mathematical mapping that converts products of small floating point probabilities into numerically stable sums of negative numbers`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d12-b1-naive-bayes-log-scorer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Log Probability Transformation",
            "codeSnippet": "/* LINEAR PROBABILITY PRODUCT (Underflows to 0.0!): */\nP(c | d) proportional to P(c) * P(w_1 | c) * P(w_2 | c) * ... * P(w_N | c)\n\n/* LOG TRANSFORM (Numerically Stable Addition!): */\nlog P(c | d) = log P(c) + sum_{i=1}^N log P(w_i | c)",
            "lineNotes": {
              "2": "Linear products underflow on long text.",
              "5": "Log additions prevent underflow completely."
            }
          },
          {
            "type": "runnable_code",
            "filename": "log_transform_demo.js",
            "initialCode": "function getTransform() {\n  return 'Logarithm';\n}\n\nconsole.log(getTransform());",
            "expectedOutput": "Logarithm",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What mathematical transformation prevents floating point underflow in probabilistic classifiers?",
          "expectedStringOutput": "Logarithm",
          "acceptableAnswers": [
            "Logarithm",
            "'Logarithm'",
            "log",
            "logarithm transform"
          ],
          "primaryMisconceptionId": "MC_NLP_NAIVE_BAYES_LOG_LIKELIHOOD_SENTIMENT",
          "diagnosisMap": {
            "Exponent": {
              "misconceptionId": "MC_NLP_NAIVE_BAYES_LOG_LIKELIHOOD_SENTIMENT",
              "errorExplanation": "Exponentiation increases scale. Transforming products into sums uses Logarithm.",
              "recoveryPath": {
                "simplerExplanation": "Type Logarithm.",
                "guidedFixPrompt": "Type Logarithm"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d12-b3-independence-assumption-simplification",
        "day": 12,
        "blockNumber": 3,
        "title": "The 'Naive' Assumption: Conditional Feature Independence Given Class Label",
        "conceptBudget": {
          "primaryConcept": "Conditional Independence Invariant",
          "supportingTerms": [
            "Conditional Independence (`Assumes all words occur independently given the class label $P(w_1, w_2 | c) = P(w_1 | c) P(w_2 | c)$, which is linguistically false but computationally effective`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d12-b2-numerical-stability-transform-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "independence_demo.js",
            "initialCode": "function getIndependenceRule() {\n  return 'NAIVE_BAYES_ASSUMES_ALL_FEATURES_ARE_CONDITIONALLY_INDEPENDENT_GIVEN_THE_CLASS';\n}\n\nconsole.log(getIndependenceRule());",
            "expectedOutput": "NAIVE_BAYES_ASSUMES_ALL_FEATURES_ARE_CONDITIONALLY_INDEPENDENT_GIVEN_THE_CLASS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What core assumption makes Naive Bayes 'naive' in natural language processing?",
          "expectedStringOutput": "NAIVE_BAYES_ASSUMES_ALL_FEATURES_ARE_CONDITIONALLY_INDEPENDENT_GIVEN_THE_CLASS",
          "acceptableAnswers": [
            "NAIVE_BAYES_ASSUMES_ALL_FEATURES_ARE_CONDITIONALLY_INDEPENDENT_GIVEN_THE_CLASS",
            "Conditionally independent given class",
            "Conditional independence"
          ],
          "primaryMisconceptionId": "MC_NLP_NAIVE_BAYES_LOG_LIKELIHOOD_SENTIMENT",
          "diagnosisMap": {
            "WORDS_ARE_DEPENDENT": {
              "misconceptionId": "MC_NLP_NAIVE_BAYES_LOG_LIKELIHOOD_SENTIMENT",
              "errorExplanation": "Standard is: NAIVE_BAYES_ASSUMES_ALL_FEATURES_ARE_CONDITIONALLY_INDEPENDENT_GIVEN_THE_CLASS.",
              "recoveryPath": {
                "simplerExplanation": "Matches NAIVE_BAYES_ASSUMES_ALL_FEATURES_ARE_CONDITIONALLY_INDEPENDENT_GIVEN_THE_CLASS.",
                "guidedFixPrompt": "Type NAIVE_BAYES_ASSUMES_ALL_FEATURES_ARE_CONDITIONALLY_INDEPENDENT_GIVEN_THE_CLASS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Recurrent Neural Networks (RNNs): Hidden State Recurrence & Vanishing Gradients",
    "overviewMetaphor": "An RNN Is a Relay Runner Passing a Memory Baton: At each word step $t$, the runner takes the current word $x_t$ and the baton from the previous runner ($h_{t-1}$), compressing them through a $\\tanh$ activation ($h_t = \\tanh(W_{hh} h_{t-1} + W_{xh} x_t + b) = 0.7163$); however, across 50 runners, the baton gets worn down to dust (vanishing gradient).",
    "blocks": [
      {
        "id": "nlp-d13-b1-rnn-hidden-state-calculator",
        "day": 13,
        "blockNumber": 1,
        "title": "RNN Recurrence: Calculating Hidden State $h_t = \\tanh(0.5 \\cdot 0.8 + 0.4 \\cdot 1.0 + 0.1) = 0.7163$",
        "conceptBudget": {
          "primaryConcept": "RNN Hidden State Recurrence Step Calculator",
          "supportingTerms": [
            "Recurrent Weight ($W_{hh} = 0.5$)",
            "Previous Hidden State ($h_{t-1} = 0.8$)",
            "Input Weight ($W_{xh} = 0.4$)",
            "Current Input ($x_t = 1.0$)",
            "Bias ($0.1$)",
            "Hidden State ($0.7163$)",
            "Status: RNN Hidden State Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d12-b1-naive-bayes-log-scorer",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "RNN Recurrent Step Computation Ledger",
              "boxes": [
                {
                  "label": "1. Linear Combination",
                  "value": "(0.5 * 0.8) + (0.4 * 1.0) + 0.1 = 0.4 + 0.4 + 0.1 = 0.9",
                  "varType": "Linear",
                  "isUpdated": false
                },
                {
                  "label": "2. Tanh Non-Linearity",
                  "value": "tanh(0.9) = 0.7163 (Bounded in [-1.0, 1.0])",
                  "varType": "Hidden State h_t",
                  "isUpdated": true
                },
                {
                  "label": "Recurrence Status",
                  "value": "RNN HIDDEN STATE CALCULATED NOMINAL (TIME-STEP t ADVANCED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rnn_demo.js",
            "initialCode": "function calcRnn(wHh, prevH, wXh, x, b) {\n  const lin = (wHh * prevH) + (wXh * x) + b;\n  const h = Number(Math.tanh(lin).toFixed(4));\n  return {\n    linearPreActivation: Number(lin.toFixed(4)),\n    hiddenStateHt: h,\n    status: 'RNN_HIDDEN_STATE_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcRnn(0.5, 0.8, 0.4, 1.0, 0.1)));",
            "expectedOutput": "{\"linearPreActivation\":0.9,\"hiddenStateHt\":0.7163,\"status\":\"RNN_HIDDEN_STATE_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the hidden state ht for linear pre-activation 0.9 computed via Math.tanh(0.9)?",
          "expectedStringOutput": "0.7163",
          "acceptableAnswers": [
            "0.7163",
            "hiddenStateHt\":0.7163",
            "0.716"
          ],
          "primaryMisconceptionId": "MC_NLP_RNN_RECURRENT_HIDDEN_STATE_VANISHING",
          "diagnosisMap": {
            "0.9": {
              "misconceptionId": "MC_NLP_RNN_RECURRENT_HIDDEN_STATE_VANISHING",
              "errorExplanation": "0.9 is linear pre-activation. tanh(0.9) = 0.7163.",
              "recoveryPath": {
                "simplerExplanation": "Hidden state is 0.7163.",
                "guidedFixPrompt": "Type 0.7163"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d13-b2-rnn-hidden-activation-name",
        "day": 13,
        "blockNumber": 2,
        "title": "The Standard RNN Hidden State Activation Function: `tanh`",
        "conceptBudget": {
          "primaryConcept": "RNN `tanh` Invariant",
          "supportingTerms": [
            "`tanh` (`Hyperbolic tangent non-linearity that centers hidden state vectors around zero in the range [-1.0, 1.0]`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d13-b1-rnn-hidden-state-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Elman RNN Formulation",
            "codeSnippet": "/* ELMAN RNN TIME-STEP EQUATION */\nh_t = tanh( W_hh * h_{t-1} + W_xh * x_t + b_h )\ny_t = softmax( W_hy * h_t + b_y )",
            "lineNotes": {
              "2": "tanh activation compresses memory to [-1.0, 1.0].",
              "3": "Output layer predicts next word or class label."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rnn_act_demo.js",
            "initialCode": "function getRnnAct() {\n  return 'tanh';\n}\n\nconsole.log(getRnnAct());",
            "expectedOutput": "tanh",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What activation function is canonically used to compute the recurrent hidden state in basic RNNs?",
          "expectedStringOutput": "tanh",
          "acceptableAnswers": [
            "tanh",
            "'tanh'",
            "hyperbolic tangent"
          ],
          "primaryMisconceptionId": "MC_NLP_RNN_RECURRENT_HIDDEN_STATE_VANISHING",
          "diagnosisMap": {
            "ReLU": {
              "misconceptionId": "MC_NLP_RNN_RECURRENT_HIDDEN_STATE_VANISHING",
              "errorExplanation": "Unbounded ReLU causes exploding hidden states in unrolled RNNs. Standard is tanh.",
              "recoveryPath": {
                "simplerExplanation": "Type tanh.",
                "guidedFixPrompt": "Type tanh"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d13-b3-vanishing-gradient-problem-cause",
        "day": 13,
        "blockNumber": 3,
        "title": "The Vanishing Gradient Bottleneck: Repeated Matrix Multiplication Across Time",
        "conceptBudget": {
          "primaryConcept": "Vanishing Gradient Invariant",
          "supportingTerms": [
            "Vanishing Gradients (`Repeated chain-rule multiplication of weight matrix $W_{hh}^T$ with eigenvalues $< 1$ and $\\tanh' \\le 1$ decays gradients to zero over 10+ time steps`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d13-b2-rnn-hidden-activation-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "vanishing_grad_demo.js",
            "initialCode": "function getVanishingGradRule() {\n  return 'REPEATED_WEIGHT_MULTIPLICATION_ACROSS_TIME_STEPS_DRIVES_EARLY_TOKEN_GRADIENTS_TO_ZERO';\n}\n\nconsole.log(getVanishingGradRule());",
            "expectedOutput": "REPEATED_WEIGHT_MULTIPLICATION_ACROSS_TIME_STEPS_DRIVES_EARLY_TOKEN_GRADIENTS_TO_ZERO",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What mathematical cause prevents standard RNNs from learning long-range dependencies in long paragraphs?",
          "expectedStringOutput": "REPEATED_WEIGHT_MULTIPLICATION_ACROSS_TIME_STEPS_DRIVES_EARLY_TOKEN_GRADIENTS_TO_ZERO",
          "acceptableAnswers": [
            "REPEATED_WEIGHT_MULTIPLICATION_ACROSS_TIME_STEPS_DRIVES_EARLY_TOKEN_GRADIENTS_TO_ZERO",
            "Vanishing gradients",
            "Gradients decay to zero"
          ],
          "primaryMisconceptionId": "MC_NLP_RNN_RECURRENT_HIDDEN_STATE_VANISHING",
          "diagnosisMap": {
            "OUT_OF_MEMORY": {
              "misconceptionId": "MC_NLP_RNN_RECURRENT_HIDDEN_STATE_VANISHING",
              "errorExplanation": "Standard is: REPEATED_WEIGHT_MULTIPLICATION_ACROSS_TIME_STEPS_DRIVES_EARLY_TOKEN_GRADIENTS_TO_ZERO.",
              "recoveryPath": {
                "simplerExplanation": "Matches REPEATED_WEIGHT_MULTIPLICATION_ACROSS_TIME_STEPS_DRIVES_EARLY_TOKEN_GRADIENTS_TO_ZERO.",
                "guidedFixPrompt": "Type REPEATED_WEIGHT_MULTIPLICATION_ACROSS_TIME_STEPS_DRIVES_EARLY_TOKEN_GRADIENTS_TO_ZERO"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Gated Memory Cells: Long Short-Term Memory (LSTM) & GRU Networks",
    "overviewMetaphor": "An LSTM Cell Is an Electronic Conveyor Belt with Controlled Flow Gates: The cell state $c_t$ runs directly down the center line like a frictionless conveyor; the Forget Gate ($f_t = 0.9$) retains $90\\%$ of old memories ($0.9 \\times 2.0 = 1.8$), while the Input Gate ($i_t = 0.5$) blends in new candidate insights ($0.5 \\times 0.8 = 0.4$), updating memory linearly ($c_t = 2.2$) with zero gradient decay.",
    "blocks": [
      {
        "id": "nlp-d14-b1-lstm-cell-calculator",
        "day": 14,
        "blockNumber": 1,
        "title": "LSTM Memory: Updating Cell State $c_t = (f_t \\cdot c_{t-1}) + (i_t \\cdot \\tilde{c}_t) = 2.2$",
        "conceptBudget": {
          "primaryConcept": "LSTM Cell State Memory Update Calculator",
          "supportingTerms": [
            "Forget Gate ($f_t = 0.9$)",
            "Previous Cell State ($c_{t-1} = 2.0$)",
            "Input Gate ($i_t = 0.5$)",
            "Candidate Memory ($\\tilde{c}_t = 0.8$)",
            "Updated Cell State ($2.2$)",
            "Status: LSTM Cell State Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d13-b1-rnn-hidden-state-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "LSTM Constant Error Carousel Cell State Ledger",
              "boxes": [
                {
                  "label": "1. Retained Memory (f * c_{t-1})",
                  "value": "0.9 * 2.0 = 1.8 (90% of long-term history preserved)",
                  "varType": "Retained",
                  "isUpdated": false
                },
                {
                  "label": "2. New Information (i * c_cand)",
                  "value": "0.5 * 0.8 = 0.4 (New token insight added)",
                  "varType": "New",
                  "isUpdated": false
                },
                {
                  "label": "3. Updated Cell State c_t",
                  "value": "1.8 + 0.4 = 2.2 (LINEAR HIGHWAY UPDATE - 0 VANISHING!)",
                  "varType": "Cell State c_t",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "lstm_demo.js",
            "initialCode": "function calcLstmCell(f, prevC, i, candC) {\n  const updatedC = Number(((f * prevC) + (i * candC)).toFixed(4));\n  return {\n    retainedMemory: Number((f * prevC).toFixed(4)),\n    newInformation: Number((i * candC).toFixed(4)),\n    updatedCellState: updatedC,\n    status: 'LSTM_CELL_STATE_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcLstmCell(0.9, 2.0, 0.5, 0.8)));",
            "expectedOutput": "{\"retainedMemory\":1.8,\"newInformation\":0.4,\"updatedCellState\":2.2,\"status\":\"LSTM_CELL_STATE_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the updated LSTM cell state for f=0.9, prevC=2.0, i=0.5, and candC=0.8?",
          "expectedStringOutput": "2.2",
          "acceptableAnswers": [
            "2.2",
            "updatedCellState\":2.2",
            "2.20"
          ],
          "primaryMisconceptionId": "MC_NLP_LSTM_GRU_CELL_STATE_GATING",
          "diagnosisMap": {
            "1.8": {
              "misconceptionId": "MC_NLP_LSTM_GRU_CELL_STATE_GATING",
              "errorExplanation": "1.8 is only retained memory. Adding new information (0.4) gives 2.2.",
              "recoveryPath": {
                "simplerExplanation": "Cell state is 2.2.",
                "guidedFixPrompt": "Type 2.2"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d14-b2-lstm-gate-activation-name",
        "day": 14,
        "blockNumber": 2,
        "title": "The Gating Activation Function: `sigmoid`",
        "conceptBudget": {
          "primaryConcept": "Sigmoid Gating Invariant",
          "supportingTerms": [
            "`sigmoid` (`The logistic sigmoid function $\\sigma(z) = \\frac{1}{1 + e^{-z}}$ outputs values in [0, 1], acting as a smooth binary valve that controls percentage flow`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d14-b1-lstm-cell-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "LSTM Gating Equations",
            "codeSnippet": "/* LSTM GATES (Sigmoid Activation in [0, 1]): */\nf_t = sigma( W_f * [h_{t-1}, x_t] + b_f ) // Forget Gate: How much history to retain\ni_t = sigma( W_i * [h_{t-1}, x_t] + b_i ) // Input Gate: How much new info to store\no_t = sigma( W_o * [h_{t-1}, x_t] + b_o ) // Output Gate: How much memory to emit",
            "lineNotes": {
              "2": "Forget gate valve.",
              "3": "Input gate valve.",
              "4": "Output gate valve."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sigmoid_gate_demo.js",
            "initialCode": "function getGateAct() {\n  return 'sigmoid';\n}\n\nconsole.log(getGateAct());",
            "expectedOutput": "sigmoid",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What activation function is used in LSTM gates to output gating multipliers between 0.0 (closed) and 1.0 (open)?",
          "expectedStringOutput": "sigmoid",
          "acceptableAnswers": [
            "sigmoid",
            "'sigmoid'",
            "logistic sigmoid"
          ],
          "primaryMisconceptionId": "MC_NLP_LSTM_GRU_CELL_STATE_GATING",
          "diagnosisMap": {
            "tanh": {
              "misconceptionId": "MC_NLP_LSTM_GRU_CELL_STATE_GATING",
              "errorExplanation": "tanh outputs [-1, 1] for candidates. Gating percentages in [0, 1] use sigmoid.",
              "recoveryPath": {
                "simplerExplanation": "Type sigmoid.",
                "guidedFixPrompt": "Type sigmoid"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d14-b3-gru-computational-efficiency",
        "day": 14,
        "blockNumber": 3,
        "title": "Architecture Comparison: GRU's Merged Hidden State vs LSTM's Dual Cell State",
        "conceptBudget": {
          "primaryConcept": "GRU Gated Recurrent Unit Invariant",
          "supportingTerms": [
            "`GRU` (`Gated Recurrent Unit: Merges cell state and hidden state, using only 2 gates (Reset and Update) for 25% faster training with fewer parameters`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d14-b2-lstm-gate-activation-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gru_rule_demo.js",
            "initialCode": "function getGruRule() {\n  return 'GRU_MERGES_CELL_AND_HIDDEN_STATES_USING_TWO_GATES_FOR_FASTER_COMPUTATION';\n}\n\nconsole.log(getGruRule());",
            "expectedOutput": "GRU_MERGES_CELL_AND_HIDDEN_STATES_USING_TWO_GATES_FOR_FASTER_COMPUTATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What architectural simplification distinguishes the Gated Recurrent Unit (GRU) from the standard LSTM?",
          "expectedStringOutput": "GRU_MERGES_CELL_AND_HIDDEN_STATES_USING_TWO_GATES_FOR_FASTER_COMPUTATION",
          "acceptableAnswers": [
            "GRU_MERGES_CELL_AND_HIDDEN_STATES_USING_TWO_GATES_FOR_FASTER_COMPUTATION",
            "Merges cell and hidden states",
            "Two gates instead of three"
          ],
          "primaryMisconceptionId": "MC_NLP_LSTM_GRU_CELL_STATE_GATING",
          "diagnosisMap": {
            "MORE_GATES": {
              "misconceptionId": "MC_NLP_LSTM_GRU_CELL_STATE_GATING",
              "errorExplanation": "Standard is: GRU_MERGES_CELL_AND_HIDDEN_STATES_USING_TWO_GATES_FOR_FASTER_COMPUTATION.",
              "recoveryPath": {
                "simplerExplanation": "Matches GRU_MERGES_CELL_AND_HIDDEN_STATES_USING_TWO_GATES_FOR_FASTER_COMPUTATION.",
                "guidedFixPrompt": "Type GRU_MERGES_CELL_AND_HIDDEN_STATES_USING_TWO_GATES_FOR_FASTER_COMPUTATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Word2Vec Embeddings, Viterbi POS Tagger & Bidirectional LSTM Classifier",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete intermediate computational linguistics and deep learning sequence engine: 1. Cosine document matching; 2. Word2Vec vector analogies; 3. FastText character n-grams; 4. Viterbi trellis path computation; 5. LSTM gated cell state updates.",
    "blocks": [
      {
        "id": "nlp-d15-b1-nlp-deep-sequence-master-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "NLP Deep Sequence Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "NLP Deep Sequence Master Engine",
          "supportingTerms": [
            "Cosine Similarity Subsystem",
            "Vector Analogy Subsystem",
            "FastText Subword Subsystem",
            "Viterbi HMM Subsystem",
            "LSTM Memory Subsystem"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d14-b3-gru-computational-efficiency",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 NLP Deep Sequence Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Matches document query vectors with unit-normalized Cosine Similarity",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Computes 300D Word2Vec semantic analogies & FastText subword character n-grams",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Decodes HMM syntax with Viterbi trellis & updates LSTM conveyor memory states",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Activates NLP Deep Sequence Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "deep_nlp_kernel_demo.js",
            "initialCode": "function runNlpDeepSequence() {\n  return {\n    cosineSubsystem: 'ONLINE_COSINE_SIMILARITY_ACTIVE',\n    analogySubsystem: 'ONLINE_WORD2VEC_ACTIVE',\n    fastTextSubsystem: 'ONLINE_SUBWORD_NGRAMS_ACTIVE',\n    viterbiSubsystem: 'ONLINE_TRELLIS_DECODER_ACTIVE',\n    lstmSubsystem: 'ONLINE_GATED_CELL_ACTIVE',\n    engineStatus: 'NLP_DEEP_SEQUENCE_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runNlpDeepSequence().engineStatus);",
            "expectedOutput": "NLP_DEEP_SEQUENCE_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the NLP Deep Sequence Master Engine?",
          "expectedStringOutput": "NLP_DEEP_SEQUENCE_MASTER_ACTIVE",
          "acceptableAnswers": [
            "NLP_DEEP_SEQUENCE_MASTER_ACTIVE",
            "engineStatus: NLP_DEEP_SEQUENCE_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_NLP_WORD2VEC_SKIPGRAM_CBOW_NEGATIVE_SAMPLING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_NLP_WORD2VEC_SKIPGRAM_CBOW_NEGATIVE_SAMPLING",
              "errorExplanation": "Matches NLP_DEEP_SEQUENCE_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type NLP_DEEP_SEQUENCE_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d15-b2-nlp-deep-sequence-engine-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "NLP Deep Sequence Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "NLP Deep Sequence Invariant Verification",
          "supportingTerms": [
            "Analogy Invariant",
            "LSTM Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d15-b1-nlp-deep-sequence-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "deep_nlp_audit_demo.js",
            "initialCode": "function auditDeepNlp(c, a, f, v, l) {\n  const passed = c && a && f && v && l;\n  return {\n    cosineVerified: c,\n    analogyVerified: a,\n    fastTextVerified: f,\n    viterbiVerified: v,\n    lstmVerified: l,\n    grade: passed ? 'NLP_DEEP_SEQUENCE_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditDeepNlp(true, true, true, true, true)));",
            "expectedOutput": "{\"cosineVerified\":true,\"analogyVerified\":true,\"fastTextVerified\":true,\"viterbiVerified\":true,\"lstmVerified\":true,\"grade\":\"NLP_DEEP_SEQUENCE_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Cosine, Word2Vec, FastText, Viterbi, and LSTM pass 100%?",
          "expectedStringOutput": "NLP_DEEP_SEQUENCE_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "NLP_DEEP_SEQUENCE_ENGINE_AUDIT_PASSED",
            "grade\":\"NLP_DEEP_SEQUENCE_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_NLP_WORD2VEC_SKIPGRAM_CBOW_NEGATIVE_SAMPLING",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_NLP_WORD2VEC_SKIPGRAM_CBOW_NEGATIVE_SAMPLING",
              "errorExplanation": "All checks passing awards NLP_DEEP_SEQUENCE_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards NLP_DEEP_SEQUENCE_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type NLP_DEEP_SEQUENCE_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d15-b3-milestone2-nlp-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 NLP Deep Sequence Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "NLP Deep Sequence Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d15-b2-nlp-deep-sequence-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_nlp_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Word2Vec Embeddings, Viterbi POS Tagger & Bidirectional LSTM Classifier [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Word2Vec Embeddings, Viterbi POS Tagger & Bidirectional LSTM Classifier [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Word2Vec Embeddings, Viterbi POS Tagger & Bidirectional LSTM Classifier [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Word2Vec Embeddings, Viterbi POS Tagger & Bidirectional LSTM Classifier [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_NLP_WORD2VEC_SKIPGRAM_CBOW_NEGATIVE_SAMPLING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_NLP_WORD2VEC_SKIPGRAM_CBOW_NEGATIVE_SAMPLING",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Word2Vec Embeddings, Viterbi POS Tagger & Bidirectional LSTM Classifier [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Sequence-to-Sequence (Seq2Seq) Architecture: Encoder-Decoder & Teacher Forcing",
    "overviewMetaphor": "Seq2Seq Teacher Forcing Is Training Wheels on a Bicycle: During early training epochs, feeding the decoder its own mistaken predictions causes catastrophic runaway derailment; Teacher Forcing supplies the true ground-truth target token ($1.0$ at start), gradually decaying training wheels to $0.5$ and finally $0.1$ as the network learns autonomous balance (`TEACHER_FORCING_RATIO_CALCULATED_NOMINAL`).",
    "blocks": [
      {
        "id": "nlp-d16-b1-teacher-forcing-decay-calculator",
        "day": 16,
        "blockNumber": 1,
        "title": "Seq2Seq: Calculating Scheduled Sampling Teacher Forcing Ratio ($1.0 \\to 0.5 \\to 0.1$)",
        "conceptBudget": {
          "primaryConcept": "Seq2Seq Teacher Forcing Ratio Decay Calculator",
          "supportingTerms": [
            "Current Epoch ($0, 50, 120$)",
            "Max Epochs ($100$)",
            "Decay Rate ($1.0$)",
            "Scheduled Ratio ($1.0, 0.5, 0.1$)",
            "Status: Teacher Forcing Ratio Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d15-b1-nlp-deep-sequence-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Seq2Seq Scheduled Sampling Decay Ledger",
              "boxes": [
                {
                  "label": "Epoch 0 (Initial Training)",
                  "value": "ratio = 1.0 - (0/100)*1.0 = 1.0 (100% Ground Truth Teacher Guidance)",
                  "varType": "Start",
                  "isUpdated": false
                },
                {
                  "label": "Epoch 50 (Mid Training)",
                  "value": "ratio = 1.0 - (50/100)*1.0 = 0.5 (50% Autonomous Decoding)",
                  "varType": "Mid",
                  "isUpdated": false
                },
                {
                  "label": "Epoch 120 (Late Training)",
                  "value": "ratio = max(0.1, -0.2) = 0.1 (Autonomous Generation Active!)",
                  "varType": "Final",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "teacher_forcing_demo.js",
            "initialCode": "function calcTfRatio(epoch, maxEpochs, decay) {\n  const raw = 1.0 - ((epoch / maxEpochs) * decay);\n  const ratio = Number(Math.max(0.1, raw).toFixed(4));\n  return {\n    currentEpoch: epoch,\n    teacherForcingRatio: ratio,\n    status: 'TEACHER_FORCING_RATIO_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcTfRatio(0, 100, 1.0)));\nconsole.log(JSON.stringify(calcTfRatio(50, 100, 1.0)));\nconsole.log(JSON.stringify(calcTfRatio(120, 100, 1.0)));",
            "expectedOutput": "{\"currentEpoch\":0,\"teacherForcingRatio\":1,\"status\":\"TEACHER_FORCING_RATIO_CALCULATED_NOMINAL\"}\n{\"currentEpoch\":50,\"teacherForcingRatio\":0.5,\"status\":\"TEACHER_FORCING_RATIO_CALCULATED_NOMINAL\"}\n{\"currentEpoch\":120,\"teacherForcingRatio\":0.1,\"status\":\"TEACHER_FORCING_RATIO_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the teacher forcing ratio at epoch 50 out of 100 with decay rate 1.0?",
          "expectedStringOutput": "0.5",
          "acceptableAnswers": [
            "0.5",
            "teacherForcingRatio\":0.5",
            "0.50"
          ],
          "primaryMisconceptionId": "MC_NLP_SEQ2SEQ_ENCODER_DECODER_BOTTLENECK",
          "diagnosisMap": {
            "1.0": {
              "misconceptionId": "MC_NLP_SEQ2SEQ_ENCODER_DECODER_BOTTLENECK",
              "errorExplanation": "1.0 - (50/100) = 0.5.",
              "recoveryPath": {
                "simplerExplanation": "Ratio is 0.5.",
                "guidedFixPrompt": "Type 0.5"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d16-b2-seq2seq-bottleneck-term-name",
        "day": 16,
        "blockNumber": 2,
        "title": "The Classical Seq2Seq Information Bottleneck: `Context Vector`",
        "conceptBudget": {
          "primaryConcept": "Context Vector Invariant",
          "supportingTerms": [
            "`Context Vector` (`The single fixed-size final hidden state of the encoder that must squeeze the entire semantic meaning of a long source sentence`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d16-b1-teacher-forcing-decay-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Classical Seq2Seq Bottleneck",
            "codeSnippet": "Source Sentence (40 words) -> Encoder RNN -> [ FIXED CONTEXT VECTOR (e.g. 512 floats) ] -> Decoder RNN\n\n// Information loss: A 50-word sentence loses nuances when compressed into 1 vector!",
            "lineNotes": {
              "1": "Single fixed-size context vector acts as severe information bottleneck."
            }
          },
          {
            "type": "runnable_code",
            "filename": "bottleneck_name_demo.js",
            "initialCode": "function getBottleneckName() {\n  return 'Context Vector';\n}\n\nconsole.log(getBottleneckName());",
            "expectedOutput": "Context Vector",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the term for the fixed-size vector that bottlenecked early encoder-decoder models?",
          "expectedStringOutput": "Context Vector",
          "acceptableAnswers": [
            "Context Vector",
            "'Context Vector'",
            "context vector"
          ],
          "primaryMisconceptionId": "MC_NLP_SEQ2SEQ_ENCODER_DECODER_BOTTLENECK",
          "diagnosisMap": {
            "Hidden State": {
              "misconceptionId": "MC_NLP_SEQ2SEQ_ENCODER_DECODER_BOTTLENECK",
              "errorExplanation": "The specific bottleneck bridging encoder to decoder is the Context Vector.",
              "recoveryPath": {
                "simplerExplanation": "Type Context Vector.",
                "guidedFixPrompt": "Type Context Vector"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d16-b3-exposure-bias-dilemma",
        "day": 16,
        "blockNumber": 3,
        "title": "Inference Gap: The Exposure Bias Problem in Autoregressive Generation",
        "conceptBudget": {
          "primaryConcept": "Exposure Bias Invariant",
          "supportingTerms": [
            "Exposure Bias (`Occurs when a model trained with 100% teacher forcing is exposed to its own generated errors at test time, causing error compounding`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d16-b2-seq2seq-bottleneck-term-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "exposure_bias_demo.js",
            "initialCode": "function getExposureBiasRule() {\n  return 'SCHEDULED_SAMPLING_MITIGATES_EXPOSURE_BIAS_BETWEEN_TRAINING_AND_INFERENCE';\n}\n\nconsole.log(getExposureBiasRule());",
            "expectedOutput": "SCHEDULED_SAMPLING_MITIGATES_EXPOSURE_BIAS_BETWEEN_TRAINING_AND_INFERENCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What training strategy closes the distribution gap known as exposure bias in sequence generation?",
          "expectedStringOutput": "SCHEDULED_SAMPLING_MITIGATES_EXPOSURE_BIAS_BETWEEN_TRAINING_AND_INFERENCE",
          "acceptableAnswers": [
            "SCHEDULED_SAMPLING_MITIGATES_EXPOSURE_BIAS_BETWEEN_TRAINING_AND_INFERENCE",
            "Scheduled sampling",
            "Mitigates exposure bias"
          ],
          "primaryMisconceptionId": "MC_NLP_SEQ2SEQ_ENCODER_DECODER_BOTTLENECK",
          "diagnosisMap": {
            "CONSTANT_TEACHER_FORCING": {
              "misconceptionId": "MC_NLP_SEQ2SEQ_ENCODER_DECODER_BOTTLENECK",
              "errorExplanation": "Standard is: SCHEDULED_SAMPLING_MITIGATES_EXPOSURE_BIAS_BETWEEN_TRAINING_AND_INFERENCE.",
              "recoveryPath": {
                "simplerExplanation": "Matches SCHEDULED_SAMPLING_MITIGATES_EXPOSURE_BIAS_BETWEEN_TRAINING_AND_INFERENCE.",
                "guidedFixPrompt": "Type SCHEDULED_SAMPLING_MITIGATES_EXPOSURE_BIAS_BETWEEN_TRAINING_AND_INFERENCE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Attention Mechanisms: Bahdanau Additive & Luong Multiplicative Alignment",
    "overviewMetaphor": "Attention Is a Dynamic Searchlight on Source Words: Instead of forcing the decoder to look at only one foggy context vector, Bahdanau attention shines a soft spotlight across all encoder hidden states ($[2.0, 1.0, 0.0] \\to [0.6652, 0.2447, 0.0900]$), dynamically focusing $66.5\\%$ of its attention on the exact relevant keyword when translating.",
    "blocks": [
      {
        "id": "nlp-d17-b1-attention-softmax-calculator",
        "day": 17,
        "blockNumber": 1,
        "title": "Attention Alignment: Computing Softmax Attention Weights ($[0.6652, 0.2447, 0.0900]$)",
        "conceptBudget": {
          "primaryConcept": "Attention Softmax Alignment Weights Calculator",
          "supportingTerms": [
            "Raw Alignment Scores ($[2.0, 1.0, 0.0]$)",
            "Softmax Normalization",
            "Attention Distribution ($0.6652$ Primary)",
            "Status: Attention Alignment Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d16-b1-teacher-forcing-decay-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Attention Softmax Alignment Distribution Ledger",
              "boxes": [
                {
                  "label": "Token 1 (Score: 2.0)",
                  "value": "exp(2.0) / sum = 7.389 / 11.107 = 0.6652 (66.5% PRIMARY FOCUS)",
                  "varType": "Primary Attention",
                  "isUpdated": true
                },
                {
                  "label": "Token 2 (Score: 1.0)",
                  "value": "exp(1.0) / sum = 2.718 / 11.107 = 0.2447 (24.5% Secondary)",
                  "varType": "Secondary",
                  "isUpdated": false
                },
                {
                  "label": "Token 3 (Score: 0.0)",
                  "value": "exp(0.0) / sum = 1.000 / 11.107 = 0.0900 (9.0% Background)",
                  "varType": "Background",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "attention_softmax_demo.js",
            "initialCode": "function calcAttention(scores) {\n  const maxS = Math.max(...scores);\n  const expS = scores.map(s => Math.exp(s - maxS));\n  const sumExp = expS.reduce((a, b) => a + b, 0);\n  const weights = expS.map(v => Number((v / sumExp).toFixed(4)));\n  return {\n    alignmentWeights: weights,\n    status: 'ATTENTION_ALIGNMENT_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcAttention([2.0, 1.0, 0.0])));",
            "expectedOutput": "{\"alignmentWeights\":[0.6652,0.2447,0.09],\"status\":\"ATTENTION_ALIGNMENT_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the primary softmax attention weight for alignment scores [2.0, 1.0, 0.0]?",
          "expectedStringOutput": "0.6652",
          "acceptableAnswers": [
            "0.6652",
            "alignmentWeights\":[0.6652",
            "0.665"
          ],
          "primaryMisconceptionId": "MC_NLP_BAHDANAU_LUONG_ATTENTION_ALIGNMENT",
          "diagnosisMap": {
            "2.0": {
              "misconceptionId": "MC_NLP_BAHDANAU_LUONG_ATTENTION_ALIGNMENT",
              "errorExplanation": "2.0 is raw logit score. Softmax normalizes it to 0.6652.",
              "recoveryPath": {
                "simplerExplanation": "Weight is 0.6652.",
                "guidedFixPrompt": "Type 0.6652"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d17-b2-additive-attention-creator-name",
        "day": 17,
        "blockNumber": 2,
        "title": "The Creator of Additive Attention: `Bahdanau`",
        "conceptBudget": {
          "primaryConcept": "Bahdanau Attention Invariant",
          "supportingTerms": [
            "`Bahdanau` (`Dzmitry Bahdanau: Introduced neural machine translation with attention in 2014 using additive scoring $v_a^T \\tanh(W s_{i-1} + U h_j)$`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d17-b1-attention-softmax-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Bahdanau vs Luong Attention Alignment",
            "codeSnippet": "/* 1. BAHDANAU ADDITIVE ATTENTION: */\nscore(s_{i-1}, h_j) = v_a^T * tanh( W_a * s_{i-1} + U_a * h_j )\n\n/* 2. LUONG MULTIPLICATIVE (DOT-PRODUCT) ATTENTION: */\nscore(s_i, h_j) = s_i^T * W_a * h_j",
            "lineNotes": {
              "2": "Bahdanau additive alignment with non-linear feedforward projection.",
              "5": "Luong multiplicative alignment using matrix dot products."
            }
          },
          {
            "type": "runnable_code",
            "filename": "bahdanau_name_demo.js",
            "initialCode": "function getCreator() {\n  return 'Bahdanau';\n}\n\nconsole.log(getCreator());",
            "expectedOutput": "Bahdanau",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Who is the lead author who pioneered additive attention in neural machine translation (2014)?",
          "expectedStringOutput": "Bahdanau",
          "acceptableAnswers": [
            "Bahdanau",
            "'Bahdanau'",
            "Dzmitry Bahdanau"
          ],
          "primaryMisconceptionId": "MC_NLP_BAHDANAU_LUONG_ATTENTION_ALIGNMENT",
          "diagnosisMap": {
            "Vaswani": {
              "misconceptionId": "MC_NLP_BAHDANAU_LUONG_ATTENTION_ALIGNMENT",
              "errorExplanation": "Vaswani created the Transformer (2017). Additive attention was created by Bahdanau (2014).",
              "recoveryPath": {
                "simplerExplanation": "Type Bahdanau.",
                "guidedFixPrompt": "Type Bahdanau"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d17-b3-dynamic-context-vector-construction",
        "day": 17,
        "blockNumber": 3,
        "title": "Dynamic Synthesis: Constructing Context Vector as Weighted Sum $c_i = \\sum_j \\alpha_{ij} h_j$",
        "conceptBudget": {
          "primaryConcept": "Weighted Context Sum Invariant",
          "supportingTerms": [
            "Weighted Sum (`The dynamic context vector is a convex combination of encoder states $c_i = \\sum \\alpha_{ij} h_j$, allowing every output step to reference different source words`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d17-b2-additive-attention-creator-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "context_sum_demo.js",
            "initialCode": "function getContextSumRule() {\n  return 'ATTENTION_CONTEXT_VECTOR_IS_A_CONVEX_WEIGHTED_SUM_OF_ALL_ENCODER_STATES';\n}\n\nconsole.log(getContextSumRule());",
            "expectedOutput": "ATTENTION_CONTEXT_VECTOR_IS_A_CONVEX_WEIGHTED_SUM_OF_ALL_ENCODER_STATES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is the dynamic context vector constructed from attention alignment weights and encoder hidden states?",
          "expectedStringOutput": "ATTENTION_CONTEXT_VECTOR_IS_A_CONVEX_WEIGHTED_SUM_OF_ALL_ENCODER_STATES",
          "acceptableAnswers": [
            "ATTENTION_CONTEXT_VECTOR_IS_A_CONVEX_WEIGHTED_SUM_OF_ALL_ENCODER_STATES",
            "Weighted sum of all encoder states",
            "Convex weighted sum"
          ],
          "primaryMisconceptionId": "MC_NLP_BAHDANAU_LUONG_ATTENTION_ALIGNMENT",
          "diagnosisMap": {
            "TAKES_LAST_STATE": {
              "misconceptionId": "MC_NLP_BAHDANAU_LUONG_ATTENTION_ALIGNMENT",
              "errorExplanation": "Standard is: ATTENTION_CONTEXT_VECTOR_IS_A_CONVEX_WEIGHTED_SUM_OF_ALL_ENCODER_STATES.",
              "recoveryPath": {
                "simplerExplanation": "Matches ATTENTION_CONTEXT_VECTOR_IS_A_CONVEX_WEIGHTED_SUM_OF_ALL_ENCODER_STATES.",
                "guidedFixPrompt": "Type ATTENTION_CONTEXT_VECTOR_IS_A_CONVEX_WEIGHTED_SUM_OF_ALL_ENCODER_STATES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "The Transformer Architecture: Scaled Dot-Product Self-Attention",
    "overviewMetaphor": "The $\\frac{1}{\\sqrt{d_k}}$ Scaling Factor Is a Thermostat on a Fire Pit: When key vectors have large dimension ($d_k = 64$), dot products grow very large ($32$); without scaling, softmax exponentiates huge numbers into sharp binary $1.0$ and $0.0$ spikes where gradients die; dividing by $\\sqrt{64} = 8$ cools the score down to $4.0$, keeping gradients healthy and flowing.",
    "blocks": [
      {
        "id": "nlp-d18-b1-scaled-attention-calculator",
        "day": 18,
        "blockNumber": 1,
        "title": "Self-Attention: Calculating Scaled Dot-Product Score $\\frac{32}{\\sqrt{64}} = 4.0$",
        "conceptBudget": {
          "primaryConcept": "Scaled Dot-Product Self-Attention Score Scaler",
          "supportingTerms": [
            "Raw Dot Product ($32$)",
            "Key Dimension ($d_k = 64$)",
            "Scaling Factor ($\\sqrt{64} = 8$)",
            "Scaled Score ($4.0$)",
            "Status: Scaled Attention Score Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d17-b1-attention-softmax-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Scaled Dot-Product Self-Attention Computation Ledger",
              "boxes": [
                {
                  "label": "1. Raw Query-Key Inner Product",
                  "value": "Q * K^T = 32 (Raw unscaled similarity magnitude)",
                  "varType": "Dot Product",
                  "isUpdated": false
                },
                {
                  "label": "2. Square Root Scaling Factor",
                  "value": "sqrt(d_k) = sqrt(64) = 8.0 (Normalizes variance to 1.0)",
                  "varType": "Scale",
                  "isUpdated": false
                },
                {
                  "label": "3. Scaled Attention Score",
                  "value": "32 / 8.0 = 4.0 (SCALED ATTENTION SCORE CALCULATED NOMINAL!)",
                  "varType": "Scaled Score",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "scaled_attention_demo.js",
            "initialCode": "function calcScaledScore(dot, dk) {\n  const scale = Math.sqrt(dk);\n  const scaled = Number((dot / scale).toFixed(4));\n  return {\n    scalingFactor: scale,\n    scaledScore: scaled,\n    status: 'SCALED_ATTENTION_SCORE_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcScaledScore(32, 64)));",
            "expectedOutput": "{\"scalingFactor\":8,\"scaledScore\":4,\"status\":\"SCALED_ATTENTION_SCORE_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the scaled dot-product attention score for raw dot product 32 and key dimension dk=64?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "4.0",
            "scaledScore\":4",
            "4.00"
          ],
          "primaryMisconceptionId": "MC_NLP_SCALED_DOT_PRODUCT_SELF_ATTENTION",
          "diagnosisMap": {
            "32": {
              "misconceptionId": "MC_NLP_SCALED_DOT_PRODUCT_SELF_ATTENTION",
              "errorExplanation": "32 must be divided by sqrt(64) = 8, yielding 4.0.",
              "recoveryPath": {
                "simplerExplanation": "Score is 4.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d18-b2-attention-scaling-divisor-name",
        "day": 18,
        "blockNumber": 2,
        "title": "The Attention Scaling Divisor Symbol: `sqrt(d_k)`",
        "conceptBudget": {
          "primaryConcept": "$\\sqrt{d_k}$ Invariant",
          "supportingTerms": [
            "`sqrt(d_k)` (`The square root of the key projection dimension used as the denominator in Scaled Dot-Product Attention: Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) V`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d18-b1-scaled-attention-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Transformer Scaled Dot-Product Equation",
            "codeSnippet": "/* TRANSFORMER SELF-ATTENTION EQUATION */\nAttention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V\n\n// Q = Queries (What I am searching for)\n// K = Keys (What content I offer)\n// V = Values (The actual information payload)",
            "lineNotes": {
              "2": "Canonical Attention equation from 'Attention Is All You Need' (2017)."
            }
          },
          {
            "type": "runnable_code",
            "filename": "divisor_symbol_demo.js",
            "initialCode": "function getDivisorSymbol() {\n  return 'sqrt(d_k)';\n}\n\nconsole.log(getDivisorSymbol());",
            "expectedOutput": "sqrt(d_k)",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What mathematical divisor scales the QK^T matrix product in the Transformer self-attention equation?",
          "expectedStringOutput": "sqrt(d_k)",
          "acceptableAnswers": [
            "sqrt(d_k)",
            "'sqrt(d_k)'",
            "sqrt(dk)"
          ],
          "primaryMisconceptionId": "MC_NLP_SCALED_DOT_PRODUCT_SELF_ATTENTION",
          "diagnosisMap": {
            "d_k": {
              "misconceptionId": "MC_NLP_SCALED_DOT_PRODUCT_SELF_ATTENTION",
              "errorExplanation": "Scaling is square root: sqrt(d_k), not linear d_k.",
              "recoveryPath": {
                "simplerExplanation": "Type sqrt(d_k).",
                "guidedFixPrompt": "Type sqrt(d_k)"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d18-b3-query-key-value-roles",
        "day": 18,
        "blockNumber": 3,
        "title": "Role Decomposition: Query, Key, and Value Projections in Self-Attention",
        "conceptBudget": {
          "primaryConcept": "Q-K-V Projection Invariant",
          "supportingTerms": [
            "Q, K, V Projections (`Queries probe the sentence, Keys match relevance, and Values provide the weighted information payload to synthesize output embeddings`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d18-b2-attention-scaling-divisor-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "qkv_roles_demo.js",
            "initialCode": "function getQkvRule() {\n  return 'QUERIES_MATCH_KEYS_TO_CALCULATE_ATTENTION_WEIGHTS_OVER_VALUES';\n}\n\nconsole.log(getQkvRule());",
            "expectedOutput": "QUERIES_MATCH_KEYS_TO_CALCULATE_ATTENTION_WEIGHTS_OVER_VALUES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What functional relationship binds Queries, Keys, and Values in Transformer self-attention?",
          "expectedStringOutput": "QUERIES_MATCH_KEYS_TO_CALCULATE_ATTENTION_WEIGHTS_OVER_VALUES",
          "acceptableAnswers": [
            "QUERIES_MATCH_KEYS_TO_CALCULATE_ATTENTION_WEIGHTS_OVER_VALUES",
            "Queries match keys to calculate attention over values",
            "Queries match keys over values"
          ],
          "primaryMisconceptionId": "MC_NLP_SCALED_DOT_PRODUCT_SELF_ATTENTION",
          "diagnosisMap": {
            "INDEPENDENT": {
              "misconceptionId": "MC_NLP_SCALED_DOT_PRODUCT_SELF_ATTENTION",
              "errorExplanation": "Standard is: QUERIES_MATCH_KEYS_TO_CALCULATE_ATTENTION_WEIGHTS_OVER_VALUES.",
              "recoveryPath": {
                "simplerExplanation": "Matches QUERIES_MATCH_KEYS_TO_CALCULATE_ATTENTION_WEIGHTS_OVER_VALUES.",
                "guidedFixPrompt": "Type QUERIES_MATCH_KEYS_TO_CALCULATE_ATTENTION_WEIGHTS_OVER_VALUES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Multi-Head Self-Attention: Representation Subspaces & Linear Projections",
    "overviewMetaphor": "Multi-Head Attention Is an Advisory Panel of 8 Diverse Specialists: Head 1 focuses on subject-verb syntax; Head 2 tracks pronoun coreference ('it' -> 'robot'); Head 3 tracks emotional tone; Head 4 tracks spatial relationships; splitting $d_{\\text{model}} = 512$ into 8 parallel heads of $d_k = 64$ ($512 / 8 = 64$) allows the model to perceive multiple linguistic dimensions simultaneously.",
    "blocks": [
      {
        "id": "nlp-d19-b1-mha-dimension-split-calculator",
        "day": 19,
        "blockNumber": 1,
        "title": "Multi-Head Attention: Calculating Head Dimension $d_k = \\frac{d_{\\text{model}}}{h} = \\frac{512}{8} = 64$",
        "conceptBudget": {
          "primaryConcept": "Multi-Head Attention Dimension Split Calculator",
          "supportingTerms": [
            "Model Dimension ($d_{\\text{model}} = 512$)",
            "Head Count ($h = 8$)",
            "Per-Head Dimension ($d_k = 64$)",
            "Status: MHA Head Dimension Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d18-b1-scaled-attention-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Multi-Head Attention Subspace Projection Ledger",
              "boxes": [
                {
                  "label": "Base Transformer (d_model=512, h=8)",
                  "value": "512 / 8 = 64 dimension per attention head (STANDARD NOMINAL!)",
                  "varType": "Standard MHA",
                  "isUpdated": true
                },
                {
                  "label": "GPT-3 Scale (d_model=12288, h=96)",
                  "value": "12288 / 96 = 128 dimension per attention head",
                  "varType": "GPT-3 Scale",
                  "isUpdated": false
                },
                {
                  "label": "Projection Status",
                  "value": "MHA HEAD DIMENSION CALCULATED NOMINAL (PARALLEL SUBSPACING ACTIVE!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "mha_split_demo.js",
            "initialCode": "function calcMha(dModel, h) {\n  if (dModel % h !== 0) throw new Error('Invalid split');\n  const dk = dModel / h;\n  return {\n    perHeadDimension: dk,\n    status: 'MHA_HEAD_DIMENSION_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcMha(512, 8)));\nconsole.log(JSON.stringify(calcMha(12288, 96)));",
            "expectedOutput": "{\"perHeadDimension\":64,\"status\":\"MHA_HEAD_DIMENSION_CALCULATED_NOMINAL\"}\n{\"perHeadDimension\":128,\"status\":\"MHA_HEAD_DIMENSION_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the per-head dimension dk for a Transformer with d_model=512 and 8 attention heads?",
          "expectedStringOutput": "64",
          "acceptableAnswers": [
            "64",
            "perHeadDimension\":64",
            "64 floats"
          ],
          "primaryMisconceptionId": "MC_NLP_MULTIHEAD_ATTENTION_PROJECTION_HEADS",
          "diagnosisMap": {
            "512": {
              "misconceptionId": "MC_NLP_MULTIHEAD_ATTENTION_PROJECTION_HEADS",
              "errorExplanation": "512 is total model dimension. 512 / 8 heads = 64 per head.",
              "recoveryPath": {
                "simplerExplanation": "Per-head dimension is 64.",
                "guidedFixPrompt": "Type 64"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d19-b2-standard-base-head-dim-number",
        "day": 19,
        "blockNumber": 2,
        "title": "The Standard Base Transformer Head Dimension: 64",
        "conceptBudget": {
          "primaryConcept": "64-Dimension Head Invariant",
          "supportingTerms": [
            "64 Dimensions (`The canonical per-head key/query dimension $d_k = 64$ in BERT-Base and Transformer-Base`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d19-b1-mha-dimension-split-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Multi-Head Attention Linear Projections",
            "codeSnippet": "/* MULTI-HEAD CONCATENATION & PROJECTION */\nMultiHead(Q, K, V) = Concat( head_1, head_2, ..., head_8 ) * W^O\n\n// where head_i = Attention( Q * W_i^Q, K * W_i^K, V * W_i^V )\n// Concat length = 8 * 64 = 512. W^O projects 512 -> 512!",
            "lineNotes": {
              "2": "Concatenates all 8 heads and projects through output matrix W^O."
            }
          },
          {
            "type": "runnable_code",
            "filename": "head_dim_demo.js",
            "initialCode": "function getStandardHeadDim() {\n  return 64;\n}\n\nconsole.log(getStandardHeadDim());",
            "expectedOutput": "64",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the standard per-head dimension in the original Vaswani et al. Transformer-Base model?",
          "expectedStringOutput": "64",
          "acceptableAnswers": [
            "64",
            "64-dim",
            "sixty-four"
          ],
          "primaryMisconceptionId": "MC_NLP_MULTIHEAD_ATTENTION_PROJECTION_HEADS",
          "diagnosisMap": {
            "512": {
              "misconceptionId": "MC_NLP_MULTIHEAD_ATTENTION_PROJECTION_HEADS",
              "errorExplanation": "512 is total d_model. Head dimension dk is 64.",
              "recoveryPath": {
                "simplerExplanation": "Type 64.",
                "guidedFixPrompt": "Type 64"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d19-b3-linear-projection-subspace-diversity",
        "day": 19,
        "blockNumber": 3,
        "title": "Subspace Diversity: Why Parallel Projections Outperform a Single Large Attention Head",
        "conceptBudget": {
          "primaryConcept": "Subspace Diversity Invariant",
          "supportingTerms": [
            "Subspace Diversity (`A single 512D head can only average multiple relations into one blur; 8 heads attend independently to syntax, semantics, and coreference in parallel`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d19-b2-standard-base-head-dim-number",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "subspace_diversity_demo.js",
            "initialCode": "function getSubspaceRule() {\n  return 'MULTI_HEAD_ATTENTION_ALLOWS_THE_MODEL_TO_JOINTLY_ATTEND_TO_DIFFERENT_REPRESENTATION_SUBSPACES';\n}\n\nconsole.log(getSubspaceRule());",
            "expectedOutput": "MULTI_HEAD_ATTENTION_ALLOWS_THE_MODEL_TO_JOINTLY_ATTEND_TO_DIFFERENT_REPRESENTATION_SUBSPACES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why does multi-head attention outperform a single large attention head of equal total dimension?",
          "expectedStringOutput": "MULTI_HEAD_ATTENTION_ALLOWS_THE_MODEL_TO_JOINTLY_ATTEND_TO_DIFFERENT_REPRESENTATION_SUBSPACES",
          "acceptableAnswers": [
            "MULTI_HEAD_ATTENTION_ALLOWS_THE_MODEL_TO_JOINTLY_ATTEND_TO_DIFFERENT_REPRESENTATION_SUBSPACES",
            "Attend to different representation subspaces",
            "Different representation subspaces"
          ],
          "primaryMisconceptionId": "MC_NLP_MULTIHEAD_ATTENTION_PROJECTION_HEADS",
          "diagnosisMap": {
            "NO_ADVANTAGE": {
              "misconceptionId": "MC_NLP_MULTIHEAD_ATTENTION_PROJECTION_HEADS",
              "errorExplanation": "Standard is: MULTI_HEAD_ATTENTION_ALLOWS_THE_MODEL_TO_JOINTLY_ATTEND_TO_DIFFERENT_REPRESENTATION_SUBSPACES.",
              "recoveryPath": {
                "simplerExplanation": "Matches MULTI_HEAD_ATTENTION_ALLOWS_THE_MODEL_TO_JOINTLY_ATTEND_TO_DIFFERENT_REPRESENTATION_SUBSPACES.",
                "guidedFixPrompt": "Type MULTI_HEAD_ATTENTION_ALLOWS_THE_MODEL_TO_JOINTLY_ATTEND_TO_DIFFERENT_REPRESENTATION_SUBSPACES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Positional Encoding: Sinusoidal Frequencies & Rotary Embeddings (RoPE)",
    "overviewMetaphor": "Positional Encoding Is a Unique Frequency Stamp on Musical Notes: Self-attention processes all words in parallel like notes played on an organ simultaneously with zero inherent order ('dog bites man' looks identical to 'man bites dog'); Sinusoidal positional encodings overlay unique interlocking harmonic frequencies ($sin(pos / 10000^{2i/d})$ and $cos$), imbuing each word with its precise sequence position.",
    "blocks": [
      {
        "id": "nlp-d20-b1-sinusoidal-pos-encoding-calculator",
        "day": 20,
        "blockNumber": 1,
        "title": "Positional Encoding: Calculating Sinusoidal Value at Position 0 ($i=0 \\to \\sin(0) = 0.0, i=1 \\to \\cos(0) = 1.0$)",
        "conceptBudget": {
          "primaryConcept": "Sinusoidal Positional Encoding Value Calculator",
          "supportingTerms": [
            "Position ($pos = 0$)",
            "Even Dim Index ($i=0 \\to \\sin = 0.0$)",
            "Odd Dim Index ($i=1 \\to \\cos = 1.0$)",
            "Model Dimension ($512$)",
            "Status: Sinusoidal Pos Encoding Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d19-b1-mha-dimension-split-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Sinusoidal Positional Encoding Harmonic Ledger",
              "boxes": [
                {
                  "label": "Position 0, Even Index (dim 0)",
                  "value": "sin(0 / 10000^0) = sin(0) = 0.0 (EVEN SINE INVARIANT)",
                  "varType": "Sine",
                  "isUpdated": false
                },
                {
                  "label": "Position 0, Odd Index (dim 1)",
                  "value": "cos(0 / 10000^0) = cos(0) = 1.0 (ODD COSINE INVARIANT)",
                  "varType": "Cosine",
                  "isUpdated": true
                },
                {
                  "label": "Encoding Status",
                  "value": "SINUSOIDAL POS ENCODING CALCULATED NOMINAL (POSITION RESTORED!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sinusoid_pos_demo.js",
            "initialCode": "function calcPosEncoding(pos, dimIdx, dModel) {\n  const isEven = dimIdx % 2 === 0;\n  const exponent = (2 * Math.floor(dimIdx / 2)) / dModel;\n  const angle = pos / Math.pow(10000, exponent);\n  const val = isEven ? Math.sin(angle) : Math.cos(angle);\n  return {\n    position: pos,\n    dimensionIndex: dimIdx,\n    encodedValue: Number(val.toFixed(4)),\n    status: 'SINUSOIDAL_POS_ENCODING_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcPosEncoding(0, 0, 512)));\nconsole.log(JSON.stringify(calcPosEncoding(0, 1, 512)));",
            "expectedOutput": "{\"position\":0,\"dimensionIndex\":0,\"encodedValue\":0,\"status\":\"SINUSOIDAL_POS_ENCODING_CALCULATED_NOMINAL\"}\n{\"position\":0,\"dimensionIndex\":1,\"encodedValue\":1,\"status\":\"SINUSOIDAL_POS_ENCODING_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the sinusoidal positional encoding value for position 0 at odd dimension index 1 (cosine component)?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "1.0",
            "encodedValue\":1",
            "1.00"
          ],
          "primaryMisconceptionId": "MC_NLP_POSITIONAL_ENCODING_SINUSOIDAL_ROPE",
          "diagnosisMap": {
            "0.0": {
              "misconceptionId": "MC_NLP_POSITIONAL_ENCODING_SINUSOIDAL_ROPE",
              "errorExplanation": "Even indices use sin(0) = 0. Odd indices use cos(0) = 1.0.",
              "recoveryPath": {
                "simplerExplanation": "Value is 1.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d20-b2-rope-acronym-name",
        "day": 20,
        "blockNumber": 2,
        "title": "The Modern LLM Rotary Position Embedding Acronym: `RoPE`",
        "conceptBudget": {
          "primaryConcept": "RoPE Rotary Embedding Invariant",
          "supportingTerms": [
            "`RoPE` (`Rotary Position Embedding: Encodes relative position by multiplying query and key representations by orthogonal rotation matrices in complex 2D planes`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d20-b1-sinusoidal-pos-encoding-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Absolute vs Rotary Positional Embeddings",
            "codeSnippet": "/* 1. ABSOLUTE POSITIONAL ENCODING (Vaswani / BERT): */\nx_i = TokenEmbedding(w_i) + PositionalEmbedding(i)\n\n/* 2. ROTARY POSITION EMBEDDING - RoPE (Llama / Mistral / Gemma): */\nq_m = R_{Theta, m}^d * W_q * x_m  (Rotates Q and K directly, natural relative decay!)",
            "lineNotes": {
              "2": "Absolute addition modified base vector.",
              "5": "RoPE rotates Q/K vectors, enabling context length scaling."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rope_acronym_demo.js",
            "initialCode": "function getRope() {\n  return 'RoPE';\n}\n\nconsole.log(getRope());",
            "expectedOutput": "RoPE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the acronym for Rotary Position Embeddings used in modern open-source LLMs like Llama 3?",
          "expectedStringOutput": "RoPE",
          "acceptableAnswers": [
            "RoPE",
            "'RoPE'",
            "rope",
            "Rotary Position Embedding"
          ],
          "primaryMisconceptionId": "MC_NLP_POSITIONAL_ENCODING_SINUSOIDAL_ROPE",
          "diagnosisMap": {
            "ALiBi": {
              "misconceptionId": "MC_NLP_POSITIONAL_ENCODING_SINUSOIDAL_ROPE",
              "errorExplanation": "ALiBi adds linear biases. Rotary embeddings are RoPE.",
              "recoveryPath": {
                "simplerExplanation": "Type RoPE.",
                "guidedFixPrompt": "Type RoPE"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d20-b3-relative-distance-decay-property",
        "day": 20,
        "blockNumber": 3,
        "title": "RoPE Advantage: Natural Relative Distance Decay in Inner Products",
        "conceptBudget": {
          "primaryConcept": "RoPE Distance Decay Invariant",
          "supportingTerms": [
            "Relative Distance Decay (`In RoPE, the dot product $q_m^T k_n$ depends purely on the relative distance $m - n$, decaying gracefully as tokens move further apart in context`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d20-b2-rope-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rope_decay_demo.js",
            "initialCode": "function getRopeDecayRule() {\n  return 'ROPE_ROTATES_QUERY_AND_KEY_VECTORS_SO_INNER_PRODUCTS_DEPEND_EXCLUSIVELY_ON_RELATIVE_TOKEN_DISTANCE';\n}\n\nconsole.log(getRopeDecayRule());",
            "expectedOutput": "ROPE_ROTATES_QUERY_AND_KEY_VECTORS_SO_INNER_PRODUCTS_DEPEND_EXCLUSIVELY_ON_RELATIVE_TOKEN_DISTANCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why do modern LLM architectures favor Rotary Position Embeddings over absolute positional additions?",
          "expectedStringOutput": "ROPE_ROTATES_QUERY_AND_KEY_VECTORS_SO_INNER_PRODUCTS_DEPEND_EXCLUSIVELY_ON_RELATIVE_TOKEN_DISTANCE",
          "acceptableAnswers": [
            "ROPE_ROTATES_QUERY_AND_KEY_VECTORS_SO_INNER_PRODUCTS_DEPEND_EXCLUSIVELY_ON_RELATIVE_TOKEN_DISTANCE",
            "Inner products depend on relative token distance",
            "Relative token distance"
          ],
          "primaryMisconceptionId": "MC_NLP_POSITIONAL_ENCODING_SINUSOIDAL_ROPE",
          "diagnosisMap": {
            "ABSOLUTE_IS_BETTER": {
              "misconceptionId": "MC_NLP_POSITIONAL_ENCODING_SINUSOIDAL_ROPE",
              "errorExplanation": "Standard is: ROPE_ROTATES_QUERY_AND_KEY_VECTORS_SO_INNER_PRODUCTS_DEPEND_EXCLUSIVELY_ON_RELATIVE_TOKEN_DISTANCE.",
              "recoveryPath": {
                "simplerExplanation": "Matches ROPE_ROTATES_QUERY_AND_KEY_VECTORS_SO_INNER_PRODUCTS_DEPEND_EXCLUSIVELY_ON_RELATIVE_TOKEN_DISTANCE.",
                "guidedFixPrompt": "Type ROPE_ROTATES_QUERY_AND_KEY_VECTORS_SO_INNER_PRODUCTS_DEPEND_EXCLUSIVELY_ON_RELATIVE_TOKEN_DISTANCE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Scaled Dot-Product Self-Attention & Positional Encoding Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete advanced Transformer core mathematical architecture: 1. Seq2Seq teacher forcing decay calculation; 2. Softmax attention alignment distribution; 3. Scaled dot-product attention score scaling; 4. Multi-head subspace dimension splitting; 5. Sinusoidal positional encoding calculation.",
    "blocks": [
      {
        "id": "nlp-d21-b1-transformer-core-master-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Transformer Core Math Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Transformer Core Math Master Engine",
          "supportingTerms": [
            "Teacher Forcing Subsystem",
            "Attention Alignment Subsystem",
            "Scaled Dot Product Subsystem",
            "MHA Subspace Subsystem",
            "Positional Encoding Subsystem"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d20-b3-relative-distance-decay-property",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Transformer Core Architecture Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Decays Seq2Seq teacher forcing & calculates softmax attention alignments",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Scales dot-products with 1/sqrt(d_k) to prevent softmax gradient saturation",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Splits model dimensions into 8 parallel heads & injects sinusoidal frequencies",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Activates Transformer Core Math Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "transformer_kernel_demo.js",
            "initialCode": "function runTransformerCore() {\n  return {\n    teacherForcingSubsystem: 'ONLINE_SCHEDULED_SAMPLING_ACTIVE',\n    attentionSubsystem: 'ONLINE_ALIGNMENT_SOFTMAX_ACTIVE',\n    scaledScoreSubsystem: 'ONLINE_SQRT_DK_SCALER_ACTIVE',\n    mhaSubsystem: 'ONLINE_SUBSPACE_SPLIT_ACTIVE',\n    positionSubsystem: 'ONLINE_SINUSOIDAL_ROPE_ACTIVE',\n    engineStatus: 'TRANSFORMER_CORE_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runTransformerCore().engineStatus);",
            "expectedOutput": "TRANSFORMER_CORE_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Transformer Core Math Master Engine?",
          "expectedStringOutput": "TRANSFORMER_CORE_MASTER_ACTIVE",
          "acceptableAnswers": [
            "TRANSFORMER_CORE_MASTER_ACTIVE",
            "engineStatus: TRANSFORMER_CORE_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_NLP_SCALED_DOT_PRODUCT_SELF_ATTENTION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_NLP_SCALED_DOT_PRODUCT_SELF_ATTENTION",
              "errorExplanation": "Matches TRANSFORMER_CORE_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type TRANSFORMER_CORE_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d21-b2-transformer-core-engine-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Transformer Core Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Transformer Core Invariant Verification",
          "supportingTerms": [
            "Attention Invariant",
            "Positional Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d21-b1-transformer-core-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "transformer_audit_demo.js",
            "initialCode": "function auditTransformer(t, a, s, m, p) {\n  const passed = t && a && s && m && p;\n  return {\n    teacherForcingVerified: t,\n    attentionVerified: a,\n    scaledScoreVerified: s,\n    mhaVerified: m,\n    positionVerified: p,\n    grade: passed ? 'TRANSFORMER_CORE_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditTransformer(true, true, true, true, true)));",
            "expectedOutput": "{\"teacherForcingVerified\":true,\"attentionVerified\":true,\"scaledScoreVerified\":true,\"mhaVerified\":true,\"positionVerified\":true,\"grade\":\"TRANSFORMER_CORE_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Teacher Forcing, Attention, Scaled Scores, MHA, and Positional Encodings pass 100%?",
          "expectedStringOutput": "TRANSFORMER_CORE_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "TRANSFORMER_CORE_ENGINE_AUDIT_PASSED",
            "grade\":\"TRANSFORMER_CORE_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_NLP_SCALED_DOT_PRODUCT_SELF_ATTENTION",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_NLP_SCALED_DOT_PRODUCT_SELF_ATTENTION",
              "errorExplanation": "All checks passing awards TRANSFORMER_CORE_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards TRANSFORMER_CORE_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type TRANSFORMER_CORE_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d21-b3-milestone3-nlp-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Transformer Core Architecture Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Transformer Core Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d21-b2-transformer-core-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_nlp_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete Scaled Dot-Product Self-Attention & Positional Encoding Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete Scaled Dot-Product Self-Attention & Positional Encoding Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete Scaled Dot-Product Self-Attention & Positional Encoding Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete Scaled Dot-Product Self-Attention & Positional Encoding Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_NLP_SCALED_DOT_PRODUCT_SELF_ATTENTION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_NLP_SCALED_DOT_PRODUCT_SELF_ATTENTION",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete Scaled Dot-Product Self-Attention & Positional Encoding Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Modern Subword Tokenization: Byte-Pair Encoding (BPE) & WordPiece",
    "overviewMetaphor": "BPE Tokenization Is Merging Most Common Scrabble Letter Tiles: You start with individual letter tiles (`['l', 'o', 'w', 'e', 's', 't']`); finding that `'e'` and `'s'` appear side-by-side most frequently across the corpus, BPE glues them permanently into a single subword tile (`'es'`), reducing sequence length from 6 to 5 tokens (`BPE_PAIR_MERGED_NOMINAL`).",
    "blocks": [
      {
        "id": "nlp-d22-b1-bpe-pair-merger",
        "day": 22,
        "blockNumber": 1,
        "title": "Subword Tokenization: Merging Most Frequent BPE Pair `['e', 's']` $\\to$ `'es'`",
        "conceptBudget": {
          "primaryConcept": "Byte-Pair Encoding Most Frequent Pair Merger",
          "supportingTerms": [
            "Original Tokens (`['l', 'o', 'w', 'e', 's', 't']`)",
            "Pair to Merge (`['e', 's']`)",
            "Replacement (`'es'`)",
            "Merged Tokens (`['l', 'o', 'w', 'es', 't']`)",
            "Status: BPE Pair Merged Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d21-b1-transformer-core-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Byte-Pair Encoding Iterative Merge Ledger",
              "boxes": [
                {
                  "label": "1. Initial Character Tokens",
                  "value": "['l', 'o', 'w', 'e', 's', 't'] (Length 6 individual character bytes)",
                  "varType": "Chars",
                  "isUpdated": false
                },
                {
                  "label": "2. Target Frequent Pair",
                  "value": "['e', 's'] (Highest co-occurrence frequency in vocabulary training table)",
                  "varType": "Pair",
                  "isUpdated": false
                },
                {
                  "label": "3. Merged Subword Tokens",
                  "value": "['l', 'o', 'w', 'es', 't'] (Length 5: BPE PAIR MERGED NOMINAL!)",
                  "varType": "Merged",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bpe_merge_demo.js",
            "initialCode": "function mergeBpePair(tokens, pair, rep) {\n  const res = [];\n  for (let i = 0; i < tokens.length; i++) {\n    if (tokens[i] === pair[0] && tokens[i + 1] === pair[1]) {\n      res.push(rep);\n      i++;\n    } else {\n      res.push(tokens[i]);\n    }\n  }\n  return {\n    mergedCount: res.length,\n    mergedTokens: res,\n    status: 'BPE_PAIR_MERGED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(mergeBpePair(['l', 'o', 'w', 'e', 's', 't'], ['e', 's'], 'es')));",
            "expectedOutput": "{\"mergedCount\":5,\"mergedTokens\":[\"l\",\"o\",\"w\",\"es\",\"t\"],\"status\":\"BPE_PAIR_MERGED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the resulting token length when merging ['e', 's'] into 'es' in ['l', 'o', 'w', 'e', 's', 't']?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "mergedCount\":5",
            "5 tokens"
          ],
          "primaryMisconceptionId": "MC_NLP_SUBWORD_TOKENIZATION_BPE_WORDPIECE",
          "diagnosisMap": {
            "6": {
              "misconceptionId": "MC_NLP_SUBWORD_TOKENIZATION_BPE_WORDPIECE",
              "errorExplanation": "6 - 1 merge = 5 tokens.",
              "recoveryPath": {
                "simplerExplanation": "Length is 5.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d22-b2-bpe-acronym-name",
        "day": 22,
        "blockNumber": 2,
        "title": "The Byte-Pair Encoding Acronym: `BPE`",
        "conceptBudget": {
          "primaryConcept": "BPE Acronym Invariant",
          "supportingTerms": [
            "`BPE` (`Byte-Pair Encoding: The data compression algorithm adapted by Sennrich et al. to build subword vocabularies for GPT, Llama, and modern LLMs`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d22-b1-bpe-pair-merger",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Subword Tokenizer Algorithms",
            "codeSnippet": "/* 1. BPE (Byte-Pair Encoding - GPT, Llama): Frequency of co-occurrence */\n/* 2. WordPiece (BERT): Likelihood of training data under language model */\n/* 3. Unigram (SentencePiece, T5): Probabilistic pruning of large candidate set */",
            "lineNotes": {
              "1": "BPE is the ubiquitous standard for autoregressive LLMs."
            }
          },
          {
            "type": "runnable_code",
            "filename": "bpe_name_demo.js",
            "initialCode": "function getBpe() {\n  return 'BPE';\n}\n\nconsole.log(getBpe());",
            "expectedOutput": "BPE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the acronym for the Byte-Pair Encoding subword tokenization algorithm?",
          "expectedStringOutput": "BPE",
          "acceptableAnswers": [
            "BPE",
            "'BPE'",
            "bpe"
          ],
          "primaryMisconceptionId": "MC_NLP_SUBWORD_TOKENIZATION_BPE_WORDPIECE",
          "diagnosisMap": {
            "WordPiece": {
              "misconceptionId": "MC_NLP_SUBWORD_TOKENIZATION_BPE_WORDPIECE",
              "errorExplanation": "WordPiece is BERT's tokenizer. Byte-Pair Encoding is BPE.",
              "recoveryPath": {
                "simplerExplanation": "Type BPE.",
                "guidedFixPrompt": "Type BPE"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d22-b3-byte-fallback-guarantee",
        "day": 22,
        "blockNumber": 3,
        "title": "Zero OOV Guarantee: Byte-Level BPE Eliminates Unknown `<UNK>` Tokens",
        "conceptBudget": {
          "primaryConcept": "Byte-Level BPE Invariant",
          "supportingTerms": [
            "Byte-Level BPE (`Operating directly on the 256 base ASCII/Unicode bytes guarantees that any arbitrary string, emoji, or foreign script can be tokenized with 0% OOV crashes`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d22-b2-bpe-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "byte_bpe_demo.js",
            "initialCode": "function getByteBpeRule() {\n  return 'BYTE_LEVEL_BPE_INITIALIZES_BASE_VOCABULARY_WITH_ALL_256_RAW_BYTES_PREVENTING_ALL_OOV_CRASHES';\n}\n\nconsole.log(getByteBpeRule());",
            "expectedOutput": "BYTE_LEVEL_BPE_INITIALIZES_BASE_VOCABULARY_WITH_ALL_256_RAW_BYTES_PREVENTING_ALL_OOV_CRASHES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why does Byte-Level BPE (as used in GPT-4 and Llama 3) achieve a 100% zero-OOV guarantee?",
          "expectedStringOutput": "BYTE_LEVEL_BPE_INITIALIZES_BASE_VOCABULARY_WITH_ALL_256_RAW_BYTES_PREVENTING_ALL_OOV_CRASHES",
          "acceptableAnswers": [
            "BYTE_LEVEL_BPE_INITIALIZES_BASE_VOCABULARY_WITH_ALL_256_RAW_BYTES_PREVENTING_ALL_OOV_CRASHES",
            "Initializes base vocabulary with 256 raw bytes",
            "256 raw bytes prevents OOV"
          ],
          "primaryMisconceptionId": "MC_NLP_SUBWORD_TOKENIZATION_BPE_WORDPIECE",
          "diagnosisMap": {
            "LARGE_DICTIONARY": {
              "misconceptionId": "MC_NLP_SUBWORD_TOKENIZATION_BPE_WORDPIECE",
              "errorExplanation": "Standard is: BYTE_LEVEL_BPE_INITIALIZES_BASE_VOCABULARY_WITH_ALL_256_RAW_BYTES_PREVENTING_ALL_OOV_CRASHES.",
              "recoveryPath": {
                "simplerExplanation": "Matches BYTE_LEVEL_BPE_INITIALIZES_BASE_VOCABULARY_WITH_ALL_256_RAW_BYTES_PREVENTING_ALL_OOV_CRASHES.",
                "guidedFixPrompt": "Type BYTE_LEVEL_BPE_INITIALIZES_BASE_VOCABULARY_WITH_ALL_256_RAW_BYTES_PREVENTING_ALL_OOV_CRASHES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "BERT: Bidirectional Encoder Representations from Transformers",
    "overviewMetaphor": "BERT Masked Language Modeling Is a Fill-In-The-Blanks Reading Exam: Instead of only reading left-to-right, BERT looks in both directions simultaneously; when 100 candidate tokens are selected for masking, BERT follows the official 80/10/10 rule: 80 tokens replaced with `[MASK]`, 10 replaced with random words, and 10 left unchanged, forcing the encoder to maintain robust bidirectional contextual representations.",
    "blocks": [
      {
        "id": "nlp-d23-b1-bert-masking-allocator",
        "day": 23,
        "blockNumber": 1,
        "title": "BERT Pre-training: Allocating the Official 80/10/10 Masking Strategy ($100 \\to 80 / 10 / 10$)",
        "conceptBudget": {
          "primaryConcept": "BERT Masked Language Model 80/10/10 Rule Allocator",
          "supportingTerms": [
            "Total Candidates ($100$)",
            "80% [MASK] ($80$)",
            "10% Random ($10$)",
            "10% Unchanged ($10$)",
            "Status: BERT Masking Strategy Allocated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d22-b1-bpe-pair-merger",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "BERT 80/10/10 Pre-training Masking Strategy Ledger",
              "boxes": [
                {
                  "label": "1. 80% Replaced with [MASK]",
                  "value": "100 * 0.80 = 80 tokens (Forces deep bidirectional reconstruction)",
                  "varType": "[MASK]",
                  "isUpdated": false
                },
                {
                  "label": "2. 10% Replaced with Random",
                  "value": "100 * 0.10 = 10 tokens (Forces context consistency validation)",
                  "varType": "Random",
                  "isUpdated": false
                },
                {
                  "label": "3. 10% Kept Unchanged",
                  "value": "100 * 0.10 = 10 tokens (BERT MASKING ALLOCATED NOMINAL!)",
                  "varType": "Unchanged",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bert_mask_demo.js",
            "initialCode": "function allocateBertMasking(total) {\n  const mask = Math.round(total * 0.80);\n  const rand = Math.round(total * 0.10);\n  const same = total - (mask + rand);\n  return {\n    replacedWithMaskToken: mask,\n    replacedWithRandomToken: rand,\n    keptUnchanged: same,\n    status: 'BERT_MASKING_STRATEGY_ALLOCATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(allocateBertMasking(100)));",
            "expectedOutput": "{\"replacedWithMaskToken\":80,\"replacedWithRandomToken\":10,\"keptUnchanged\":10,\"status\":\"BERT_MASKING_STRATEGY_ALLOCATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many tokens out of 100 masking candidates are replaced with the literal [MASK] token in BERT?",
          "expectedStringOutput": "80",
          "acceptableAnswers": [
            "80",
            "replacedWithMaskToken\":80",
            "eighty"
          ],
          "primaryMisconceptionId": "MC_NLP_BERT_BIDIRECTIONAL_MASKED_LM",
          "diagnosisMap": {
            "100": {
              "misconceptionId": "MC_NLP_BERT_BIDIRECTIONAL_MASKED_LM",
              "errorExplanation": "BERT uses 80% [MASK], 10% random word, and 10% unchanged word.",
              "recoveryPath": {
                "simplerExplanation": "Count is 80.",
                "guidedFixPrompt": "Type 80"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d23-b2-bert-classification-token-name",
        "day": 23,
        "blockNumber": 2,
        "title": "The BERT Special Classification Token: `[CLS]`",
        "conceptBudget": {
          "primaryConcept": "`[CLS]` Token Invariant",
          "supportingTerms": [
            "`[CLS]` (`Classification Token: The special first token prepended to every BERT sequence whose final hidden state serves as the aggregate sequence representation for classification`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d23-b1-bert-masking-allocator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "BERT Special Tokens",
            "codeSnippet": "/* BERT SEQUENCE FORMAT: */\n[CLS] The movie was [MASK] . [SEP] It was fantastic ! [SEP]\n\n// [CLS] = First token, holds sequence classification vector\n// [SEP] = Sentence boundary separator token\n// [MASK] = Masked target token during MLM pre-training",
            "lineNotes": {
              "2": "Full BERT sequence with special token boundaries."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cls_token_demo.js",
            "initialCode": "function getClsToken() {\n  return '[CLS]';\n}\n\nconsole.log(getClsToken());",
            "expectedOutput": "[CLS]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What special token is placed at the beginning of all BERT inputs to represent the sequence embedding?",
          "expectedStringOutput": "[CLS]",
          "acceptableAnswers": [
            "[CLS]",
            "'[CLS]'",
            "CLS",
            "[CLS] token"
          ],
          "primaryMisconceptionId": "MC_NLP_BERT_BIDIRECTIONAL_MASKED_LM",
          "diagnosisMap": {
            "[SEP]": {
              "misconceptionId": "MC_NLP_BERT_BIDIRECTIONAL_MASKED_LM",
              "errorExplanation": "[SEP] is the sentence separator. The classification head token is [CLS].",
              "recoveryPath": {
                "simplerExplanation": "Type [CLS].",
                "guidedFixPrompt": "Type [CLS]"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d23-b3-bidirectional-vs-causal-distinction",
        "day": 23,
        "blockNumber": 3,
        "title": "Architecture Distinction: Bidirectional Encoders (BERT) vs Autoregressive Decoders (GPT)",
        "conceptBudget": {
          "primaryConcept": "Bidirectional Encoding Invariant",
          "supportingTerms": [
            "Bidirectional vs Causal (`BERT allows every token to attend freely to left and right contexts simultaneously, making it ideal for classification and understanding but unable to generate text left-to-right`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d23-b2-bert-classification-token-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bert_bidirectional_demo.js",
            "initialCode": "function getBertBidirectionalRule() {\n  return 'BERT_ENCODES_LEFT_AND_RIGHT_CONTEXT_SIMULTANEOUSLY_WITHOUT_CAUSAL_MASKING';\n}\n\nconsole.log(getBertBidirectionalRule());",
            "expectedOutput": "BERT_ENCODES_LEFT_AND_RIGHT_CONTEXT_SIMULTANEOUSLY_WITHOUT_CAUSAL_MASKING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What attention property enables BERT to excel at sentence classification and extraction tasks?",
          "expectedStringOutput": "BERT_ENCODES_LEFT_AND_RIGHT_CONTEXT_SIMULTANEOUSLY_WITHOUT_CAUSAL_MASKING",
          "acceptableAnswers": [
            "BERT_ENCODES_LEFT_AND_RIGHT_CONTEXT_SIMULTANEOUSLY_WITHOUT_CAUSAL_MASKING",
            "Encodes left and right context simultaneously",
            "Bidirectional attention without causal masking"
          ],
          "primaryMisconceptionId": "MC_NLP_BERT_BIDIRECTIONAL_MASKED_LM",
          "diagnosisMap": {
            "CAUSAL_MASKING": {
              "misconceptionId": "MC_NLP_BERT_BIDIRECTIONAL_MASKED_LM",
              "errorExplanation": "Standard is: BERT_ENCODES_LEFT_AND_RIGHT_CONTEXT_SIMULTANEOUSLY_WITHOUT_CAUSAL_MASKING.",
              "recoveryPath": {
                "simplerExplanation": "Matches BERT_ENCODES_LEFT_AND_RIGHT_CONTEXT_SIMULTANEOUSLY_WITHOUT_CAUSAL_MASKING.",
                "guidedFixPrompt": "Type BERT_ENCODES_LEFT_AND_RIGHT_CONTEXT_SIMULTANEOUSLY_WITHOUT_CAUSAL_MASKING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "GPT: Autoregressive Language Modeling & Causal Masking",
    "overviewMetaphor": "GPT Causal Masking Is a Card Dealer with Concealed Future Cards: When generating a story, token 1 can only see itself; token 2 can see token 1 and 2; all entries above the diagonal in the attention matrix are masked with $-\\infty$ ($M_{ij} = -\\infty$ for $j > i$), ensuring the model can never cheat by peeking at future words.",
    "blocks": [
      {
        "id": "nlp-d24-b1-causal-mask-generator",
        "day": 24,
        "blockNumber": 1,
        "title": "GPT Causal Attention: Generating Lower-Triangular Mask ($-\\infty$ for $j > i$)",
        "conceptBudget": {
          "primaryConcept": "Causal Self-Attention Mask Matrix Generator",
          "supportingTerms": [
            "Sequence Length ($3$)",
            "Lower Triangular Matrix",
            "Masked Upper Entries ($-\\infty$)",
            "Visible Lower Entries ($0.0$)",
            "Status: Causal Attention Mask Generated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d23-b1-bert-masking-allocator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "GPT Autoregressive Causal Attention Mask Ledger",
              "boxes": [
                {
                  "label": "Row 0 (Token 0)",
                  "value": "[0.0, -Infinity, -Infinity] (Can only attend to itself)",
                  "varType": "Row 0",
                  "isUpdated": false
                },
                {
                  "label": "Row 1 (Token 1)",
                  "value": "[0.0, 0.0, -Infinity] (Attends to Token 0 and Token 1)",
                  "varType": "Row 1",
                  "isUpdated": false
                },
                {
                  "label": "Row 2 (Token 2)",
                  "value": "[0.0, 0.0, 0.0] (CAUSAL MASK GENERATED NOMINAL!)",
                  "varType": "Row 2",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "causal_mask_demo.js",
            "initialCode": "function genCausalMask(len) {\n  const mask = [];\n  for (let i = 0; i < len; i++) {\n    const row = [];\n    for (let j = 0; j < len; j++) {\n      row.push(j > i ? -Infinity : 0.0);\n    }\n    mask.push(row);\n  }\n  return {\n    maskMatrix: mask,\n    status: 'CAUSAL_ATTENTION_MASK_GENERATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(genCausalMask(3)));",
            "expectedOutput": "{\"maskMatrix\":[[0,null,null],[0,0,null],[0,0,0]],\"status\":\"CAUSAL_ATTENTION_MASK_GENERATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What value is placed in the upper triangle of the causal attention matrix to block future token visibility?",
          "expectedStringOutput": "-Infinity",
          "acceptableAnswers": [
            "-Infinity",
            "-infinity",
            "negative infinity"
          ],
          "primaryMisconceptionId": "MC_NLP_GPT_AUTOREGRESSIVE_CAUSAL_MASKING",
          "diagnosisMap": {
            "0.0": {
              "misconceptionId": "MC_NLP_GPT_AUTOREGRESSIVE_CAUSAL_MASKING",
              "errorExplanation": "0.0 is unmasked (exp(0)=1). Masking requires -Infinity so exp(-inf) = 0.0.",
              "recoveryPath": {
                "simplerExplanation": "Value is -Infinity.",
                "guidedFixPrompt": "Type -Infinity"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d24-b2-kv-cache-optimization-name",
        "day": 24,
        "blockNumber": 2,
        "title": "The Inference Speed Optimization Memory Cache: `KV Cache`",
        "conceptBudget": {
          "primaryConcept": "KV Cache Invariant",
          "supportingTerms": [
            "`KV Cache` (`Key-Value Cache: Storing computed Key and Value projection tensors across autoregressive generation steps, reducing token generation complexity from $O(N^2)$ to $O(N)$`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d24-b1-causal-mask-generator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "KV Cache Acceleration",
            "codeSnippet": "/* ❌ NAIVE INFERENCE (O(N^2) Recomputation): */\nStep 1: Process \"The\"\nStep 2: Re-process \"The quick\"\nStep 3: Re-process \"The quick brown\"\n\n/* ✅ KV CACHE (O(1) Incremental Step): */\nStep 3: Append only \"brown\" K/V vectors to existing KV-Cache!",
            "lineNotes": {
              "2": "Naive inference recalculates entire prompt on every token.",
              "7": "KV Cache eliminates redundant prompt re-computation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "kv_cache_demo.js",
            "initialCode": "function getKvCacheName() {\n  return 'KV Cache';\n}\n\nconsole.log(getKvCacheName());",
            "expectedOutput": "KV Cache",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What memory caching technique avoids recalculating past token Key/Value representations during LLM inference?",
          "expectedStringOutput": "KV Cache",
          "acceptableAnswers": [
            "KV Cache",
            "'KV Cache'",
            "kv cache",
            "KV Caching"
          ],
          "primaryMisconceptionId": "MC_NLP_GPT_AUTOREGRESSIVE_CAUSAL_MASKING",
          "diagnosisMap": {
            "Prompt Cache": {
              "misconceptionId": "MC_NLP_GPT_AUTOREGRESSIVE_CAUSAL_MASKING",
              "errorExplanation": "The exact tensor structure cached in attention layers is the KV Cache.",
              "recoveryPath": {
                "simplerExplanation": "Type KV Cache.",
                "guidedFixPrompt": "Type KV Cache"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d24-b3-next-token-prediction-objective",
        "day": 24,
        "blockNumber": 3,
        "title": "Autoregressive Pre-training: The Maximum Likelihood Next-Token Prediction Objective",
        "conceptBudget": {
          "primaryConcept": "Next-Token Prediction Invariant",
          "supportingTerms": [
            "Next-Token Prediction (`Minimizing negative log-likelihood $\\mathcal{L} = -\\sum \\log P(x_t | x_{<t})$ over trillions of tokens turns autoregressive models into world simulators`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d24-b2-kv-cache-optimization-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ntp_demo.js",
            "initialCode": "function getNtpRule() {\n  return 'GPT_TRAINS_BY_MINIMIZING_NEGATIVE_LOG_LIKELIHOOD_OF_NEXT_TOKEN_PREDICTION';\n}\n\nconsole.log(getNtpRule());",
            "expectedOutput": "GPT_TRAINS_BY_MINIMIZING_NEGATIVE_LOG_LIKELIHOOD_OF_NEXT_TOKEN_PREDICTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What foundational loss objective is optimized during GPT pre-training?",
          "expectedStringOutput": "GPT_TRAINS_BY_MINIMIZING_NEGATIVE_LOG_LIKELIHOOD_OF_NEXT_TOKEN_PREDICTION",
          "acceptableAnswers": [
            "GPT_TRAINS_BY_MINIMIZING_NEGATIVE_LOG_LIKELIHOOD_OF_NEXT_TOKEN_PREDICTION",
            "Next token prediction",
            "Minimizing negative log likelihood of next token prediction"
          ],
          "primaryMisconceptionId": "MC_NLP_GPT_AUTOREGRESSIVE_CAUSAL_MASKING",
          "diagnosisMap": {
            "MASKED_LM": {
              "misconceptionId": "MC_NLP_GPT_AUTOREGRESSIVE_CAUSAL_MASKING",
              "errorExplanation": "Masked LM is BERT. GPT uses Next Token Prediction: GPT_TRAINS_BY_MINIMIZING_NEGATIVE_LOG_LIKELIHOOD_OF_NEXT_TOKEN_PREDICTION.",
              "recoveryPath": {
                "simplerExplanation": "Matches GPT_TRAINS_BY_MINIMIZING_NEGATIVE_LOG_LIKELIHOOD_OF_NEXT_TOKEN_PREDICTION.",
                "guidedFixPrompt": "Type GPT_TRAINS_BY_MINIMIZING_NEGATIVE_LOG_LIKELIHOOD_OF_NEXT_TOKEN_PREDICTION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Extractive Question Answering: SQuAD Span Prediction",
    "overviewMetaphor": "Extractive QA Is Two Bookmarks in an Encyclopedia Article: Given start logits ($[0.1, 2.5, 0.4, 0.2]$) and end logits ($[0.2, 0.3, 3.1, 0.5]$), the algorithm places Bookmark 1 at word 1 ('2.5') and Bookmark 2 at word 2 ('3.1'), extracting the maximum joint score passage ($2.5 + 3.1 = 5.6$) as the definitive answer span.",
    "blocks": [
      {
        "id": "nlp-d25-b1-answer-span-selector",
        "day": 25,
        "blockNumber": 1,
        "title": "Extractive QA: Finding Optimal Start ($i=1$) and End ($j=2$) Span ($2.5 + 3.1 = 5.6$)",
        "conceptBudget": {
          "primaryConcept": "Optimal Question Answering Answer Span Selector",
          "supportingTerms": [
            "Start Logits",
            "End Logits",
            "Max Span Length ($3$)",
            "Best Start Index ($1$)",
            "Best End Index ($2$)",
            "Max Joint Score ($5.6$)",
            "Status: Optimal Answer Span Selected Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d24-b1-causal-mask-generator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "SQuAD Span Selection Dynamic Optimization Ledger",
              "boxes": [
                {
                  "label": "Start Logits Array",
                  "value": "[0.1, 2.5, 0.4, 0.2] -> Highest start logit at index 1 (Score: 2.5)",
                  "varType": "Start Logits",
                  "isUpdated": false
                },
                {
                  "label": "End Logits Array",
                  "value": "[0.2, 0.3, 3.1, 0.5] -> Highest valid end logit at index 2 (Score: 3.1)",
                  "varType": "End Logits",
                  "isUpdated": false
                },
                {
                  "label": "Optimal Span Selection",
                  "value": "Start=1, End=2 -> Max joint score = 2.5 + 3.1 = 5.6 (SPAN SELECTED NOMINAL!)",
                  "varType": "Selected Span",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "span_select_demo.js",
            "initialCode": "function selectSpan(startL, endL, maxLen) {\n  let maxS = -Infinity;\n  let bestS = 0, bestE = 0;\n  for (let i = 0; i < startL.length; i++) {\n    for (let j = i; j < Math.min(startL.length, i + maxLen); j++) {\n      const score = startL[i] + endL[j];\n      if (score > maxS) {\n        maxS = score;\n        bestS = i;\n        bestE = j;\n      }\n    }\n  }\n  return {\n    startTokenIndex: bestS,\n    endTokenIndex: bestE,\n    maxJointScore: Number(maxS.toFixed(4)),\n    status: 'OPTIMAL_ANSWER_SPAN_SELECTED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(selectSpan([0.1, 2.5, 0.4, 0.2], [0.2, 0.3, 3.1, 0.5], 3)));",
            "expectedOutput": "{\"startTokenIndex\":1,\"endTokenIndex\":2,\"maxJointScore\":5.6,\"status\":\"OPTIMAL_ANSWER_SPAN_SELECTED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum joint logit score for the optimal answer span starting at index 1 and ending at index 2?",
          "expectedStringOutput": "5.6",
          "acceptableAnswers": [
            "5.6",
            "maxJointScore\":5.6",
            "5.60"
          ],
          "primaryMisconceptionId": "MC_NLP_EXTRACTIVE_QUESTION_ANSWERING_SPANS",
          "diagnosisMap": {
            "3.1": {
              "misconceptionId": "MC_NLP_EXTRACTIVE_QUESTION_ANSWERING_SPANS",
              "errorExplanation": "Joint score is start + end = 2.5 + 3.1 = 5.6.",
              "recoveryPath": {
                "simplerExplanation": "Joint score is 5.6.",
                "guidedFixPrompt": "Type 5.6"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d25-b2-squad-benchmark-acronym-name",
        "day": 25,
        "blockNumber": 2,
        "title": "The Stanford Question Answering Dataset Acronym: `SQuAD`",
        "conceptBudget": {
          "primaryConcept": "SQuAD Invariant",
          "supportingTerms": [
            "`SQuAD` (`Stanford Question Answering Dataset: The premier reading comprehension benchmark featuring 100,000+ question-answer pairs over Wikipedia articles`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d25-b1-answer-span-selector",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SQuAD Benchmark Versions",
            "codeSnippet": "/* 1. SQuAD v1.1: Every question has an answer in the text */\n/* 2. SQuAD v2.0: Introduces 50,000 unanswerable questions (Requires [CLS] no-answer prediction!) */",
            "lineNotes": {
              "1": "SQuAD v1.1 classic extraction.",
              "2": "SQuAD v2.0 tests knowing when an answer does not exist."
            }
          },
          {
            "type": "runnable_code",
            "filename": "squad_name_demo.js",
            "initialCode": "function getSquad() {\n  return 'SQuAD';\n}\n\nconsole.log(getSquad());",
            "expectedOutput": "SQuAD",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the acronym for the Stanford Question Answering Dataset benchmark?",
          "expectedStringOutput": "SQuAD",
          "acceptableAnswers": [
            "SQuAD",
            "'SQuAD'",
            "squad"
          ],
          "primaryMisconceptionId": "MC_NLP_EXTRACTIVE_QUESTION_ANSWERING_SPANS",
          "diagnosisMap": {
            "GLUE": {
              "misconceptionId": "MC_NLP_EXTRACTIVE_QUESTION_ANSWERING_SPANS",
              "errorExplanation": "GLUE is a general benchmark. The QA span dataset is SQuAD.",
              "recoveryPath": {
                "simplerExplanation": "Type SQuAD.",
                "guidedFixPrompt": "Type SQuAD"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d25-b3-exact-match-vs-f1-qa-metrics",
        "day": 25,
        "blockNumber": 3,
        "title": "QA Evaluation: Exact Match (EM) vs Token-Level Overlap F1 Score",
        "conceptBudget": {
          "primaryConcept": "Exact Match vs F1 Invariant",
          "supportingTerms": [
            "Exact Match (EM) (`Exact Match is a binary 1/0 score requiring identical character matches; Token F1 gives partial credit for overlapping words`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d25-b2-squad-benchmark-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "em_f1_demo.js",
            "initialCode": "function getEmF1Rule() {\n  return 'EXACT_MATCH_SCORES_BINARY_1_OR_0_WHILE_F1_MEASURES_TOKEN_PRECISION_AND_RECALL_OVERLAP';\n}\n\nconsole.log(getEmF1Rule());",
            "expectedOutput": "EXACT_MATCH_SCORES_BINARY_1_OR_0_WHILE_F1_MEASURES_TOKEN_PRECISION_AND_RECALL_OVERLAP",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do the Exact Match (EM) and F1 evaluation metrics differ in question answering benchmarks?",
          "expectedStringOutput": "EXACT_MATCH_SCORES_BINARY_1_OR_0_WHILE_F1_MEASURES_TOKEN_PRECISION_AND_RECALL_OVERLAP",
          "acceptableAnswers": [
            "EXACT_MATCH_SCORES_BINARY_1_OR_0_WHILE_F1_MEASURES_TOKEN_PRECISION_AND_RECALL_OVERLAP",
            "EM is binary while F1 measures overlap",
            "Exact match is binary 1 or 0"
          ],
          "primaryMisconceptionId": "MC_NLP_EXTRACTIVE_QUESTION_ANSWERING_SPANS",
          "diagnosisMap": {
            "THEY_ARE_IDENTICAL": {
              "misconceptionId": "MC_NLP_EXTRACTIVE_QUESTION_ANSWERING_SPANS",
              "errorExplanation": "Standard is: EXACT_MATCH_SCORES_BINARY_1_OR_0_WHILE_F1_MEASURES_TOKEN_PRECISION_AND_RECALL_OVERLAP.",
              "recoveryPath": {
                "simplerExplanation": "Matches EXACT_MATCH_SCORES_BINARY_1_OR_0_WHILE_F1_MEASURES_TOKEN_PRECISION_AND_RECALL_OVERLAP.",
                "guidedFixPrompt": "Type EXACT_MATCH_SCORES_BINARY_1_OR_0_WHILE_F1_MEASURES_TOKEN_PRECISION_AND_RECALL_OVERLAP"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Dense Retrieval vs Cross-Encoder Re-Ranking: Two-Stage Information Retrieval",
    "overviewMetaphor": "Two-Stage Retrieval Is a Library Speed-Scanner and Professor: Scanning 1,000,000 books with a slow deep reader would take 5 days; Stage 1 (Bi-Encoder Dense Index) acts as a high-speed library card catalog finding the top 100 candidate books in 2 milliseconds; Stage 2 (Cross-Encoder) reads only those 100 books with full cross-attention to select the top 5 most accurate answers.",
    "blocks": [
      {
        "id": "nlp-d26-b1-two-stage-retrieval-validator",
        "day": 26,
        "blockNumber": 1,
        "title": "Two-Stage Search: Validating Candidate Funnel ($1,000,000 \\to 100 \\to 5$)",
        "conceptBudget": {
          "primaryConcept": "Two-Stage Retrieval Pipeline Candidate Filter",
          "supportingTerms": [
            "Corpus Size ($1,000,000$)",
            "Stage 1 Bi-Encoder Candidates ($100$)",
            "Stage 2 Cross-Encoder Reranked ($5$)",
            "Status: Two Stage Search Pipeline Validated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d25-b1-answer-span-selector",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Two-Stage Search Pipeline Funnel Ledger",
              "boxes": [
                {
                  "label": "1. Raw Document Corpus",
                  "value": "1,000,000 documents (HNSW Vector Index / FAISS)",
                  "varType": "Corpus N",
                  "isUpdated": false
                },
                {
                  "label": "2. Stage 1 Bi-Encoder ANN",
                  "value": "Top-100 candidates retrieved in 2ms (High Recall)",
                  "varType": "Stage 1 K1",
                  "isUpdated": false
                },
                {
                  "label": "3. Stage 2 Cross-Encoder",
                  "value": "Top-5 candidates re-ranked with joint self-attention (TWO STAGE NOMINAL!)",
                  "varType": "Stage 2 K2",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "two_stage_demo.js",
            "initialCode": "function validateTwoStage(totalN, k1, k2) {\n  const ok = totalN >= k1 && k1 >= k2;\n  return {\n    totalDocumentsInCorpus: totalN,\n    stage1BiEncoderCandidates: k1,\n    stage2CrossEncoderReranked: k2,\n    isPipelineRatioNominal: ok,\n    status: ok ? 'TWO_STAGE_SEARCH_PIPELINE_VALIDATED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(validateTwoStage(1000000, 100, 5)));\nconsole.log(JSON.stringify(validateTwoStage(100, 500, 10)));",
            "expectedOutput": "{\"totalDocumentsInCorpus\":1000000,\"stage1BiEncoderCandidates\":100,\"stage2CrossEncoderReranked\":5,\"isPipelineRatioNominal\":true,\"status\":\"TWO_STAGE_SEARCH_PIPELINE_VALIDATED_NOMINAL\"}\n{\"totalDocumentsInCorpus\":100,\"stage1BiEncoderCandidates\":500,\"stage2CrossEncoderReranked\":10,\"isPipelineRatioNominal\":false,\"status\":\"DEFECT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a two-stage retrieval pipeline maintains a valid candidate narrowing ratio?",
          "expectedStringOutput": "TWO_STAGE_SEARCH_PIPELINE_VALIDATED_NOMINAL",
          "acceptableAnswers": [
            "TWO_STAGE_SEARCH_PIPELINE_VALIDATED_NOMINAL",
            "status\":\"TWO_STAGE_SEARCH_PIPELINE_VALIDATED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_NLP_CROSS_ENCODER_RERANKING_STS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_NLP_CROSS_ENCODER_RERANKING_STS",
              "errorExplanation": "Matches TWO_STAGE_SEARCH_PIPELINE_VALIDATED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type TWO_STAGE_SEARCH_PIPELINE_VALIDATED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d26-b2-ann-framework-faiss-name",
        "day": 26,
        "blockNumber": 2,
        "title": "The Industry Standard Dense Vector Indexing Framework: `FAISS`",
        "conceptBudget": {
          "primaryConcept": "FAISS Vector Index Invariant",
          "supportingTerms": [
            "`FAISS` (`Facebook AI Similarity Search: Meta's open-source library for high-speed clustering and Approximate Nearest Neighbor search on billion-scale dense vector sets`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d26-b1-two-stage-retrieval-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Bi-Encoder vs Cross-Encoder",
            "codeSnippet": "/* 1. BI-ENCODER (Embedding Search): Fast, independent vectorization */\nScore = dot( Encoder(Query), Encoder(Document) )  // 2ms via FAISS Index!\n\n/* 2. CROSS-ENCODER (Re-Ranking): Deep joint self-attention */\nScore = CrossEncoder( [CLS] Query [SEP] Document [SEP] ) // Full attention across all word pairs!",
            "lineNotes": {
              "2": "Bi-Encoder decouples embeddings for pre-indexing in FAISS.",
              "5": "Cross-Encoder performs full cross-attention between query and candidate."
            }
          },
          {
            "type": "runnable_code",
            "filename": "faiss_name_demo.js",
            "initialCode": "function getFaiss() {\n  return 'FAISS';\n}\n\nconsole.log(getFaiss());",
            "expectedOutput": "FAISS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What open-source library developed by Meta is the standard for fast Approximate Nearest Neighbor dense vector search?",
          "expectedStringOutput": "FAISS",
          "acceptableAnswers": [
            "FAISS",
            "'FAISS'",
            "faiss"
          ],
          "primaryMisconceptionId": "MC_NLP_CROSS_ENCODER_RERANKING_STS",
          "diagnosisMap": {
            "Lucene": {
              "misconceptionId": "MC_NLP_CROSS_ENCODER_RERANKING_STS",
              "errorExplanation": "Lucene is keyword inverted index. Dense vector ANN search is FAISS.",
              "recoveryPath": {
                "simplerExplanation": "Type FAISS.",
                "guidedFixPrompt": "Type FAISS"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d26-b3-cross-attention-superior-accuracy",
        "day": 26,
        "blockNumber": 3,
        "title": "Accuracy Tradeoff: Why Cross-Encoders Outperform Bi-Encoders in Re-Ranking",
        "conceptBudget": {
          "primaryConcept": "Cross-Encoder Precision Invariant",
          "supportingTerms": [
            "Cross-Attention Precision (`Cross-Encoders allow every query token to attend directly to every document word in the same self-attention layers, eliminating semantic compression loss`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d26-b2-ann-framework-faiss-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cross_encoder_demo.js",
            "initialCode": "function getCrossEncoderRule() {\n  return 'CROSS_ENCODERS_PERFORM_JOINT_SELF_ATTENTION_BETWEEN_QUERY_AND_DOCUMENT_FOR_MAXIMUM_ACCURACY';\n}\n\nconsole.log(getCrossEncoderRule());",
            "expectedOutput": "CROSS_ENCODERS_PERFORM_JOINT_SELF_ATTENTION_BETWEEN_QUERY_AND_DOCUMENT_FOR_MAXIMUM_ACCURACY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why do Cross-Encoders achieve higher ranking accuracy than Bi-Encoders?",
          "expectedStringOutput": "CROSS_ENCODERS_PERFORM_JOINT_SELF_ATTENTION_BETWEEN_QUERY_AND_DOCUMENT_FOR_MAXIMUM_ACCURACY",
          "acceptableAnswers": [
            "CROSS_ENCODERS_PERFORM_JOINT_SELF_ATTENTION_BETWEEN_QUERY_AND_DOCUMENT_FOR_MAXIMUM_ACCURACY",
            "Joint self-attention between query and document",
            "Cross attention between query and document"
          ],
          "primaryMisconceptionId": "MC_NLP_CROSS_ENCODER_RERANKING_STS",
          "diagnosisMap": {
            "NO_ACCURACY_DIFFERENCE": {
              "misconceptionId": "MC_NLP_CROSS_ENCODER_RERANKING_STS",
              "errorExplanation": "Standard is: CROSS_ENCODERS_PERFORM_JOINT_SELF_ATTENTION_BETWEEN_QUERY_AND_DOCUMENT_FOR_MAXIMUM_ACCURACY.",
              "recoveryPath": {
                "simplerExplanation": "Matches CROSS_ENCODERS_PERFORM_JOINT_SELF_ATTENTION_BETWEEN_QUERY_AND_DOCUMENT_FOR_MAXIMUM_ACCURACY.",
                "guidedFixPrompt": "Type CROSS_ENCODERS_PERFORM_JOINT_SELF_ATTENTION_BETWEEN_QUERY_AND_DOCUMENT_FOR_MAXIMUM_ACCURACY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Sequence Generation Decoding: Temperature, Top-k & Nucleus (Top-p) Sampling",
    "overviewMetaphor": "Nucleus (Top-p) Sampling Is a Dynamic VIP Lounge: Fixed Top-k always admits exactly $k=50$ words, even if the model is $99\\%$ certain of just 1 word ('Paris'); Nucleus Top-p sums sorted probabilities until the threshold ($p=0.8$) is reached ($0.5 + 0.3 = 0.8$), dynamically shrinking the candidate pool to just 2 tokens ('apple', 'banana') and filtering out low-probability gibberish.",
    "blocks": [
      {
        "id": "nlp-d27-b1-nucleus-top-p-filter",
        "day": 27,
        "blockNumber": 1,
        "title": "Sampling Strategies: Filtering Nucleus Top-p Pool ($p=0.8 \\to 2$ Tokens Selected)",
        "conceptBudget": {
          "primaryConcept": "Nucleus (Top-p) Cumulative Probability Cutoff Filter",
          "supportingTerms": [
            "Top-p Threshold ($p = 0.8$)",
            "Cumulative Probability ($0.8$)",
            "Selected Candidates (2 Tokens)",
            "Status: Nucleus Top P Filtered Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d26-b1-two-stage-retrieval-validator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Nucleus (Top-p) Probability Truncation Ledger",
              "boxes": [
                {
                  "label": "1. Token 1 ('apple', prob: 0.5)",
                  "value": "cumSum = 0.5 < 0.8 -> Admitted to nucleus",
                  "varType": "Candidate 1",
                  "isUpdated": false
                },
                {
                  "label": "2. Token 2 ('banana', prob: 0.3)",
                  "value": "cumSum = 0.5 + 0.3 = 0.8 >= 0.8 -> Admitted, threshold reached!",
                  "varType": "Candidate 2",
                  "isUpdated": false
                },
                {
                  "label": "3. Discarded Tokens ('cherry', 'date')",
                  "value": "Remaining low-prob tokens truncated (NUCLEUS TOP-P FILTERED NOMINAL!)",
                  "varType": "Truncated",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "nucleus_demo.js",
            "initialCode": "function filterTopP(probs, topP) {\n  const sorted = [...probs].sort((a, b) => b.prob - a.prob);\n  const selected = [];\n  let cum = 0;\n  for (const item of sorted) {\n    selected.push(item);\n    cum += item.prob;\n    if (cum >= topP) break;\n  }\n  return {\n    topPThreshold: topP,\n    selectedTokensCount: selected.length,\n    status: 'NUCLEUS_TOP_P_FILTERED_NOMINAL'\n  };\n}\n\nconst pool = [{ token: 'apple', prob: 0.5 }, { token: 'banana', prob: 0.3 }, { token: 'cherry', prob: 0.15 }, { token: 'date', prob: 0.05 }];\nconsole.log(JSON.stringify(filterTopP(pool, 0.8)));",
            "expectedOutput": "{\"topPThreshold\":0.8,\"selectedTokensCount\":2,\"status\":\"NUCLEUS_TOP_P_FILTERED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many tokens are admitted into the nucleus candidate pool for topP=0.8 with probs [0.5, 0.3, 0.15, 0.05]?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "selectedTokensCount\":2",
            "two"
          ],
          "primaryMisconceptionId": "MC_NLP_BEAM_SEARCH_NUCLEUS_TOP_P_SAMPLING",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_NLP_BEAM_SEARCH_NUCLEUS_TOP_P_SAMPLING",
              "errorExplanation": "0.5 + 0.3 = 0.8. The cumulative sum reaches threshold after only 2 tokens.",
              "recoveryPath": {
                "simplerExplanation": "Count is 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d27-b2-greedy-search-temperature-number",
        "day": 27,
        "blockNumber": 2,
        "title": "The Deterministic Greedy Search Temperature: `0.0`",
        "conceptBudget": {
          "primaryConcept": "Temperature 0.0 Invariant",
          "supportingTerms": [
            "Temperature 0.0 (`Setting temperature $T=0.0$ forces deterministic argmax decoding, always selecting the highest-probability next token with zero randomness`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d27-b1-nucleus-top-p-filter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Temperature Scaling Equation",
            "codeSnippet": "/* TEMPERATURE SCALED SOFTMAX: */\nP(x_i) = exp( z_i / T ) / sum_j exp( z_j / T )\n\n// T = 0.0: Pure Greedy Argmax (Deterministic)\n// T = 0.7: Balanced creativity for coding / reasoning\n// T = 1.5: High entropy, wild creative hallucination",
            "lineNotes": {
              "2": "Temperature scales logits before softmax exponentiation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "temp_zero_demo.js",
            "initialCode": "function getGreedyTemp() {\n  return 0.0;\n}\n\nconsole.log(getGreedyTemp());",
            "expectedOutput": "0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What temperature value enforces completely deterministic greedy token selection during LLM generation?",
          "expectedStringOutput": "0",
          "acceptableAnswers": [
            "0",
            "0.0",
            "zero"
          ],
          "primaryMisconceptionId": "MC_NLP_BEAM_SEARCH_NUCLEUS_TOP_P_SAMPLING",
          "diagnosisMap": {
            "1.0": {
              "misconceptionId": "MC_NLP_BEAM_SEARCH_NUCLEUS_TOP_P_SAMPLING",
              "errorExplanation": "1.0 is standard stochastic sampling. Deterministic greedy search uses 0.0.",
              "recoveryPath": {
                "simplerExplanation": "Type 0.",
                "guidedFixPrompt": "Type 0"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d27-b3-top-k-vs-top-p-sampling-dynamics",
        "day": 27,
        "blockNumber": 3,
        "title": "Sampling Dynamics: Why Dynamic Nucleus Top-p Outperforms Static Top-k",
        "conceptBudget": {
          "primaryConcept": "Top-p vs Top-k Invariant",
          "supportingTerms": [
            "Dynamic vs Static Cutoff (`Top-k uses a rigid static number of words; Top-p dynamically expands in flat entropy zones and narrows to 1 word when confidence is high`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d27-b2-greedy-search-temperature-number",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "top_p_dynamics_demo.js",
            "initialCode": "function getTopPDynamicsRule() {\n  return 'TOP_P_DYNAMICALLY_ADAPTS_CANDIDATE_POOL_SIZE_BASED_ON_LOCAL_PROBABILITY_ENTROPY';\n}\n\nconsole.log(getTopPDynamicsRule());",
            "expectedOutput": "TOP_P_DYNAMICALLY_ADAPTS_CANDIDATE_POOL_SIZE_BASED_ON_LOCAL_PROBABILITY_ENTROPY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What dynamic property gives Nucleus Top-p sampling an advantage over static Top-k sampling?",
          "expectedStringOutput": "TOP_P_DYNAMICALLY_ADAPTS_CANDIDATE_POOL_SIZE_BASED_ON_LOCAL_PROBABILITY_ENTROPY",
          "acceptableAnswers": [
            "TOP_P_DYNAMICALLY_ADAPTS_CANDIDATE_POOL_SIZE_BASED_ON_LOCAL_PROBABILITY_ENTROPY",
            "Adapts candidate pool size dynamically",
            "Dynamic candidate pool size based on entropy"
          ],
          "primaryMisconceptionId": "MC_NLP_BEAM_SEARCH_NUCLEUS_TOP_P_SAMPLING",
          "diagnosisMap": {
            "FIXED_COUNT": {
              "misconceptionId": "MC_NLP_BEAM_SEARCH_NUCLEUS_TOP_P_SAMPLING",
              "errorExplanation": "Standard is: TOP_P_DYNAMICALLY_ADAPTS_CANDIDATE_POOL_SIZE_BASED_ON_LOCAL_PROBABILITY_ENTROPY.",
              "recoveryPath": {
                "simplerExplanation": "Matches TOP_P_DYNAMICALLY_ADAPTS_CANDIDATE_POOL_SIZE_BASED_ON_LOCAL_PROBABILITY_ENTROPY.",
                "guidedFixPrompt": "Type TOP_P_DYNAMICALLY_ADAPTS_CANDIDATE_POOL_SIZE_BASED_ON_LOCAL_PROBABILITY_ENTROPY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "NLP Evaluation Metrics: BLEU, ROUGE & Exact Match (EM)",
    "overviewMetaphor": "BLEU Brevity Penalty Is a Minimum Word Count Fine: If a student writes a 1-word machine translation ('the') for a 10-word reference sentence, modified precision looks artificially high ($100\\%$); the BLEU Brevity Penalty ($\text{BP} = exp(1 - 10/8) = 0.7788$ for an 8-word candidate) slashes the score to punish terse omissions (`BLEU_BREVITY_PENALTY_CALCULATED_NOMINAL`).",
    "blocks": [
      {
        "id": "nlp-d28-b1-bleu-brevity-penalty-calculator",
        "day": 28,
        "blockNumber": 1,
        "title": "NLP Evaluation: Calculating BLEU Brevity Penalty $\\text{BP} = \\exp(1 - 10/8) = 0.7788$",
        "conceptBudget": {
          "primaryConcept": "Brevity Penalty & Modified Precision BLEU Metric Calculator",
          "supportingTerms": [
            "Candidate Length ($c = 8$)",
            "Reference Length ($r = 10$)",
            "Brevity Penalty ($0.7788$)",
            "Status: BLEU Brevity Penalty Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d27-b1-nucleus-top-p-filter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "BLEU Metric Brevity Penalty Calculation Ledger",
              "boxes": [
                {
                  "label": "1. Equal Length (c=10, r=10)",
                  "value": "c >= r -> BP = 1.0 (No brevity penalty)",
                  "varType": "Nominal Length",
                  "isUpdated": false
                },
                {
                  "label": "2. Short Candidate (c=8, r=10)",
                  "value": "exp(1 - 10/8) = exp(-0.25) = 0.7788 (Penalty applied!)",
                  "varType": "Penalized Length",
                  "isUpdated": true
                },
                {
                  "label": "Evaluation Status",
                  "value": "BLEU BREVITY PENALTY CALCULATED NOMINAL (LENGTH INVARIANT!)",
                  "varType": "Status",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bleu_bp_demo.js",
            "initialCode": "function calcBp(c, r) {\n  if (c > r) return { brevityPenalty: 1.0, status: 'BLEU_BREVITY_PENALTY_CALCULATED_NOMINAL' };\n  const bp = Number(Math.exp(1 - (r / c)).toFixed(4));\n  return {\n    candidateLen: c,\n    referenceLen: r,\n    brevityPenalty: bp,\n    status: 'BLEU_BREVITY_PENALTY_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcBp(10, 10)));\nconsole.log(JSON.stringify(calcBp(8, 10)));",
            "expectedOutput": "{\"candidateLen\":10,\"referenceLen\":10,\"brevityPenalty\":1,\"status\":\"BLEU_BREVITY_PENALTY_CALCULATED_NOMINAL\"}\n{\"candidateLen\":8,\"referenceLen\":10,\"brevityPenalty\":0.7788,\"status\":\"BLEU_BREVITY_PENALTY_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the BLEU Brevity Penalty for an 8-word candidate evaluated against a 10-word reference translation?",
          "expectedStringOutput": "0.7788",
          "acceptableAnswers": [
            "0.7788",
            "brevityPenalty\":0.7788",
            "0.779"
          ],
          "primaryMisconceptionId": "MC_NLP_EVALUATION_BLEU_ROUGE_EXACT_MATCH",
          "diagnosisMap": {
            "1.0": {
              "misconceptionId": "MC_NLP_EVALUATION_BLEU_ROUGE_EXACT_MATCH",
              "errorExplanation": "Candidate is shorter than reference: exp(1 - 10/8) = exp(-0.25) = 0.7788.",
              "recoveryPath": {
                "simplerExplanation": "Penalty is 0.7788.",
                "guidedFixPrompt": "Type 0.7788"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d28-b2-summarization-rouge-acronym-name",
        "day": 28,
        "blockNumber": 2,
        "title": "The Text Summarization Evaluation Metric: `ROUGE`",
        "conceptBudget": {
          "primaryConcept": "ROUGE Metric Invariant",
          "supportingTerms": [
            "`ROUGE` (`Recall-Oriented Understudy for Gisting Evaluation: Measures n-gram recall and longest common subsequences (ROUGE-L) for text summarization`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d28-b1-bleu-brevity-penalty-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "BLEU vs ROUGE Comparison",
            "codeSnippet": "/* 1. BLEU (Machine Translation): Precision-focused with Brevity Penalty */\nBLEU = BP * exp( sum_{n=1}^4 w_n * log(p_n) )\n\n/* 2. ROUGE (Text Summarization): Recall-focused */\nROUGE-N = count_match(n-grams) / sum(n-grams in reference summaries)\nROUGE-L = Longest Common Subsequence (LCS) overlap score",
            "lineNotes": {
              "2": "BLEU measures precision of generated translation.",
              "5": "ROUGE measures recall of summary information."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rouge_name_demo.js",
            "initialCode": "function getRouge() {\n  return 'ROUGE';\n}\n\nconsole.log(getRouge());",
            "expectedOutput": "ROUGE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the primary recall-oriented evaluation metric used for text summarization tasks?",
          "expectedStringOutput": "ROUGE",
          "acceptableAnswers": [
            "ROUGE",
            "'ROUGE'",
            "rouge"
          ],
          "primaryMisconceptionId": "MC_NLP_EVALUATION_BLEU_ROUGE_EXACT_MATCH",
          "diagnosisMap": {
            "BLEU": {
              "misconceptionId": "MC_NLP_EVALUATION_BLEU_ROUGE_EXACT_MATCH",
              "errorExplanation": "BLEU is precision-focused for translation. Summarization recall uses ROUGE.",
              "recoveryPath": {
                "simplerExplanation": "Type ROUGE.",
                "guidedFixPrompt": "Type ROUGE"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d28-b3-meteor-and-semantic-evaluators",
        "day": 28,
        "blockNumber": 3,
        "title": "Semantic Evaluation: Overcoming Exact String Matching with METEOR & BERTScore",
        "conceptBudget": {
          "primaryConcept": "Semantic Evaluation Invariant",
          "supportingTerms": [
            "`BERTScore` & `METEOR` (`Evaluate semantic similarity using contextual embeddings and stemming/synonym matches rather than rigid exact string equality`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d28-b2-summarization-rouge-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bertscore_demo.js",
            "initialCode": "function getSemanticEvalRule() {\n  return 'BERTSCORE_EVALUATES_SEMANTIC_SIMILARITY_USING_CONTEXTUAL_EMBEDDING_ALIGNMENT';\n}\n\nconsole.log(getSemanticEvalRule());",
            "expectedOutput": "BERTSCORE_EVALUATES_SEMANTIC_SIMILARITY_USING_CONTEXTUAL_EMBEDDING_ALIGNMENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How does BERTScore evaluate generated text without being penalized for valid synonymous paraphrasing?",
          "expectedStringOutput": "BERTSCORE_EVALUATES_SEMANTIC_SIMILARITY_USING_CONTEXTUAL_EMBEDDING_ALIGNMENT",
          "acceptableAnswers": [
            "BERTSCORE_EVALUATES_SEMANTIC_SIMILARITY_USING_CONTEXTUAL_EMBEDDING_ALIGNMENT",
            "Contextual embedding alignment",
            "Semantic similarity via contextual embeddings"
          ],
          "primaryMisconceptionId": "MC_NLP_EVALUATION_BLEU_ROUGE_EXACT_MATCH",
          "diagnosisMap": {
            "EXACT_STRING_MATCH": {
              "misconceptionId": "MC_NLP_EVALUATION_BLEU_ROUGE_EXACT_MATCH",
              "errorExplanation": "Standard is: BERTSCORE_EVALUATES_SEMANTIC_SIMILARITY_USING_CONTEXTUAL_EMBEDDING_ALIGNMENT.",
              "recoveryPath": {
                "simplerExplanation": "Matches BERTSCORE_EVALUATES_SEMANTIC_SIMILARITY_USING_CONTEXTUAL_EMBEDDING_ALIGNMENT.",
                "guidedFixPrompt": "Type BERTSCORE_EVALUATES_SEMANTIC_SIMILARITY_USING_CONTEXTUAL_EMBEDDING_ALIGNMENT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Parameter-Efficient Fine-Tuning (PEFT): Low-Rank Adaptation (LoRA)",
    "overviewMetaphor": "LoRA Is a Thin Post-It Note on a 1000-Page Textbook: Instead of photocopying and modifying the entire $4096 \\times 4096$ base weight matrix ($16,777,216$ parameters), LoRA freezes the original book and attaches a tiny low-rank post-it note $B \\times A$ ($r=8 \\to 65,536$ parameters), achieving a $99.61\\%$ parameter reduction while retaining full model intelligence (`LORA_PARAMETER_REDUCTION_CALCULATED_NOMINAL`).",
    "blocks": [
      {
        "id": "nlp-d29-b1-lora-savings-calculator",
        "day": 29,
        "blockNumber": 1,
        "title": "PEFT: Calculating LoRA Parameter Reduction for $4096 \\times 4096, r=8$ ($99.61\\%$ Savings)",
        "conceptBudget": {
          "primaryConcept": "LoRA Trainable Parameter Reduction Ratio Calculator",
          "supportingTerms": [
            "Base Parameters ($16,777,216$)",
            "LoRA Rank ($r = 8$)",
            "LoRA Trainable Parameters ($65,536$)",
            "Percentage Saved ($99.61\\%$)",
            "Status: LoRA Parameter Reduction Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d28-b1-bleu-brevity-penalty-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "LoRA Low-Rank Parameter Decomposition Ledger",
              "boxes": [
                {
                  "label": "1. Base Linear Layer W_0 (4096 x 4096)",
                  "value": "4096 * 4096 = 16,777,216 frozen parameters (0 gradients stored)",
                  "varType": "Base Frozen",
                  "isUpdated": false
                },
                {
                  "label": "2. LoRA Matrices B (4096x8) & A (8x4096)",
                  "value": "8 * (4096 + 4096) = 65,536 trainable parameters",
                  "varType": "LoRA Trainable",
                  "isUpdated": false
                },
                {
                  "label": "3. Parameter Savings Ratio",
                  "value": "(1 - 65536 / 16777216) * 100 = 99.61% SAVINGS (CALCULATED NOMINAL!)",
                  "varType": "Savings",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "lora_savings_demo.js",
            "initialCode": "function calcLora(d, k, r) {\n  const base = d * k;\n  const lora = r * (d + k);\n  const savings = Number(((1 - (lora / base)) * 100).toFixed(2));\n  return {\n    baseParameters: base,\n    loraParameters: lora,\n    percentageSaved: savings,\n    status: 'LORA_PARAMETER_REDUCTION_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calcLora(4096, 4096, 8)));",
            "expectedOutput": "{\"baseParameters\":16777216,\"loraParameters\":65536,\"percentageSaved\":99.61,\"status\":\"LORA_PARAMETER_REDUCTION_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What percentage of trainable parameters are saved by using LoRA (r=8) on a 4096x4096 weight matrix?",
          "expectedStringOutput": "99.61",
          "acceptableAnswers": [
            "99.61",
            "percentageSaved\":99.61",
            "99.61%"
          ],
          "primaryMisconceptionId": "MC_NLP_LORA_LOW_RANK_ADAPTATION_PEFT",
          "diagnosisMap": {
            "50.0": {
              "misconceptionId": "MC_NLP_LORA_LOW_RANK_ADAPTATION_PEFT",
              "errorExplanation": "LoRA reduces 16.7M params to 65K params: 99.61% savings.",
              "recoveryPath": {
                "simplerExplanation": "Savings is 99.61.",
                "guidedFixPrompt": "Type 99.61"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d29-b2-peft-acronym-name",
        "day": 29,
        "blockNumber": 2,
        "title": "The Parameter-Efficient Fine-Tuning Acronym: `PEFT`",
        "conceptBudget": {
          "primaryConcept": "PEFT Acronym Invariant",
          "supportingTerms": [
            "`PEFT` (`Parameter-Efficient Fine-Tuning: The family of fine-tuning techniques (LoRA, QLoRA, Prefix Tuning, Adapters) that adapts pre-trained LLMs with minimal GPU memory`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d29-b1-lora-savings-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "LoRA Forward Pass Equation",
            "codeSnippet": "/* LORA FORWARD PASS: */\nh = W_0 * x + delta_W * x = W_0 * x + (alpha / r) * (B * A * x)\n\n// W_0 in R^(d x k) is FROZEN\n// A in R^(r x k) initialized with Gaussian noise\n// B in R^(d x r) initialized to ZERO (so delta_W starts at 0!)",
            "lineNotes": {
              "2": "Additive low-rank adapter bypasses modifying frozen base weights."
            }
          },
          {
            "type": "runnable_code",
            "filename": "peft_name_demo.js",
            "initialCode": "function getPeft() {\n  return 'PEFT';\n}\n\nconsole.log(getPeft());",
            "expectedOutput": "PEFT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the acronym for Parameter-Efficient Fine-Tuning in modern LLM engineering?",
          "expectedStringOutput": "PEFT",
          "acceptableAnswers": [
            "PEFT",
            "'PEFT'",
            "peft"
          ],
          "primaryMisconceptionId": "MC_NLP_LORA_LOW_RANK_ADAPTATION_PEFT",
          "diagnosisMap": {
            "RLHF": {
              "misconceptionId": "MC_NLP_LORA_LOW_RANK_ADAPTATION_PEFT",
              "errorExplanation": "RLHF is reinforcement learning from human feedback. Parameter-efficient tuning is PEFT.",
              "recoveryPath": {
                "simplerExplanation": "Type PEFT.",
                "guidedFixPrompt": "Type PEFT"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d29-b3-zero-initialization-of-lora-b-matrix",
        "day": 29,
        "blockNumber": 3,
        "title": "Zero Initialization Invariant: Why Matrix $B$ Must Be Initialized to All Zeros",
        "conceptBudget": {
          "primaryConcept": "Zero Initialization Invariant",
          "supportingTerms": [
            "Zero Init of Matrix B (`Initializing matrix B to zeros ensures $\\Delta W = B \\times A = 0$ at the start of fine-tuning, so model output is initially identical to the pre-trained base`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d29-b2-peft-acronym-name",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lora_zero_init_demo.js",
            "initialCode": "function getLoraInitRule() {\n  return 'MATRIX_B_IS_INITIALIZED_TO_ZERO_SO_ADAPTER_DELTA_STARTS_AT_EXACT_ZERO';\n}\n\nconsole.log(getLoraInitRule());",
            "expectedOutput": "MATRIX_B_IS_INITIALIZED_TO_ZERO_SO_ADAPTER_DELTA_STARTS_AT_EXACT_ZERO",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why must LoRA matrix B be initialized to all zeros at the start of training?",
          "expectedStringOutput": "MATRIX_B_IS_INITIALIZED_TO_ZERO_SO_ADAPTER_DELTA_STARTS_AT_EXACT_ZERO",
          "acceptableAnswers": [
            "MATRIX_B_IS_INITIALIZED_TO_ZERO_SO_ADAPTER_DELTA_STARTS_AT_EXACT_ZERO",
            "Adapter delta starts at exact zero",
            "Delta starts at zero"
          ],
          "primaryMisconceptionId": "MC_NLP_LORA_LOW_RANK_ADAPTATION_PEFT",
          "diagnosisMap": {
            "RANDOM_INIT": {
              "misconceptionId": "MC_NLP_LORA_LOW_RANK_ADAPTATION_PEFT",
              "errorExplanation": "Random init corrupts base weights on step 1. Standard is: MATRIX_B_IS_INITIALIZED_TO_ZERO_SO_ADAPTER_DELTA_STARTS_AT_EXACT_ZERO.",
              "recoveryPath": {
                "simplerExplanation": "Matches MATRIX_B_IS_INITIALIZED_TO_ZERO_SO_ADAPTER_DELTA_STARTS_AT_EXACT_ZERO.",
                "guidedFixPrompt": "Type MATRIX_B_IS_INITIALIZED_TO_ZERO_SO_ADAPTER_DELTA_STARTS_AT_EXACT_ZERO"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Natural Language Processing & LLM Infrastructure Engine",
    "overviewMetaphor": "Final Capstone Synthesis: The complete sovereign natural language processing and modern LLM architecture master suite: 1. Text Preprocessing & Vector Spaces; 2. Distributed Word Embeddings & Sequence Tagging; 3. Recurrent Networks & Attention Mechanics; 4. Modern Transformers & LLMs; 5. Retrieval, Inference & Alignment.",
    "blocks": [
      {
        "id": "nlp-d30-b1-sovereign-nlp-suite-orchestrator",
        "day": 30,
        "blockNumber": 1,
        "title": "Sovereign NLP & LLM Master Suite Orchestration",
        "conceptBudget": {
          "primaryConcept": "Sovereign NLP & LLM Master Suite Orchestrator",
          "supportingTerms": [
            "Vector Space Module",
            "Embeddings & Tagging Module",
            "Recurrent & Attention Module",
            "Transformer Architecture Module",
            "LLM Retrieval & PEFT Module"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d29-b3-zero-initialization-of-lora-b-matrix",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Sovereign NLP & LLM Architecture Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Cleans Unicode NFKD text, builds TF-IDF matrices & unit-normalized Cosine search",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Generates Word2Vec analogies, FastText subwords, Viterbi HMM & BIO NER tags",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Updates LSTM gated cells, computes Bahdanau attention & scales dot products",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Executes RoPE positional rotations, BPE subwords, BERT MLM & GPT causal masks",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Orchestrates Two-Stage FAISS retrieval, Nucleus Top-p sampling & LoRA PEFT adaptation!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_nlp_orchestrator_demo.js",
            "initialCode": "function orchestrateNlpSuite(vsm, emb, rnn, trans, llm) {\n  const ok = vsm && emb && rnn && trans && llm;\n  return {\n    vectorSpaceModule: vsm,\n    embeddingsModule: emb,\n    recurrentModule: rnn,\n    transformerModule: trans,\n    llmModule: llm,\n    certified: ok,\n    status: ok ? 'SOVEREIGN_NLP_MASTER_CERTIFIED_NOMINAL' : 'DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(orchestrateNlpSuite(true, true, true, true, true)));",
            "expectedOutput": "{\"vectorSpaceModule\":true,\"embeddingsModule\":true,\"recurrentModule\":true,\"transformerModule\":true,\"llmModule\":true,\"certified\":true,\"status\":\"SOVEREIGN_NLP_MASTER_CERTIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that all 5 NLP and LLM architecture modules are certified nominal?",
          "expectedStringOutput": "SOVEREIGN_NLP_MASTER_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "SOVEREIGN_NLP_MASTER_CERTIFIED_NOMINAL",
            "status\":\"SOVEREIGN_NLP_MASTER_CERTIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_NLP_CAPSTONE_SOVEREIGN_NLP_LLM_SUITE",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_NLP_CAPSTONE_SOVEREIGN_NLP_LLM_SUITE",
              "errorExplanation": "Matches SOVEREIGN_NLP_MASTER_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches status string.",
                "guidedFixPrompt": "Type SOVEREIGN_NLP_MASTER_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "nlp-d30-b2-capstone-audit-score",
        "day": 30,
        "blockNumber": 2,
        "title": "Platform-Wide NLP & LLM Engineering Precision Audit",
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
            "conceptId": "nlp-d30-b1-sovereign-nlp-suite-orchestrator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_nlp_audit_score_demo.js",
            "initialCode": "function auditNlpCapstone() {\n  return {\n    certified: true,\n    score: '100/100',\n    tier: 'SOVEREIGN_NLP_LLM_MASTER_CERTIFIED'\n  };\n}\n\nconsole.log(JSON.stringify(auditNlpCapstone()));",
            "expectedOutput": "{\"certified\":true,\"score\":\"100/100\",\"tier\":\"SOVEREIGN_NLP_LLM_MASTER_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit score is awarded upon completing the Sovereign NLP & LLM Capstone?",
          "expectedStringOutput": "100/100",
          "acceptableAnswers": [
            "100/100",
            "score\":\"100/100\"",
            "100"
          ],
          "primaryMisconceptionId": "MC_NLP_CAPSTONE_SOVEREIGN_NLP_LLM_SUITE",
          "diagnosisMap": {
            "90/100": {
              "misconceptionId": "MC_NLP_CAPSTONE_SOVEREIGN_NLP_LLM_SUITE",
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
        "id": "nlp-d30-b3-capstone-conferral",
        "day": 30,
        "blockNumber": 3,
        "title": "Conferral of Sovereign Natural Language Processing & LLM Engineer Credential",
        "conceptBudget": {
          "primaryConcept": "Sovereign NLP Engineer Credential",
          "supportingTerms": [
            "Platform Mastery",
            "Computational Linguistics Specialization",
            "LLM Infrastructure Certified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "nlp-d30-b2-capstone-audit-score",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_nlp_conferral_demo.js",
            "initialCode": "console.log('🏆 CONFERRED: SOVEREIGN NATURAL LANGUAGE PROCESSING & LLM ENGINEER [PINIT CAREER OS v1.0 CERTIFIED]');",
            "expectedOutput": "🏆 CONFERRED: SOVEREIGN NATURAL LANGUAGE PROCESSING & LLM ENGINEER [PINIT CAREER OS v1.0 CERTIFIED]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What credential title is officially conferred upon course graduation?",
          "expectedStringOutput": "🏆 CONFERRED: SOVEREIGN NATURAL LANGUAGE PROCESSING & LLM ENGINEER [PINIT CAREER OS v1.0 CERTIFIED]",
          "acceptableAnswers": [
            "🏆 CONFERRED: SOVEREIGN NATURAL LANGUAGE PROCESSING & LLM ENGINEER [PINIT CAREER OS v1.0 CERTIFIED]",
            "SOVEREIGN NATURAL LANGUAGE PROCESSING & LLM ENGINEER"
          ],
          "primaryMisconceptionId": "MC_NLP_CAPSTONE_SOVEREIGN_NLP_LLM_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_NLP_CAPSTONE_SOVEREIGN_NLP_LLM_SUITE",
              "errorExplanation": "Matches conferral header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type 🏆 CONFERRED: SOVEREIGN NATURAL LANGUAGE PROCESSING & LLM ENGINEER [PINIT CAREER OS v1.0 CERTIFIED]"
              }
            }
          }
        }
      }
    ]
  }
];
