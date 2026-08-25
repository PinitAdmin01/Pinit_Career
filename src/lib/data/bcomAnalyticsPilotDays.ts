import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const BCOM_ANALYTICS_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Introduction to Business Analytics & Data-Driven Decision Making",
    "overviewMetaphor": "Business Analytics is the Headlights, GPS, and Autopilot of a Modern Enterprise: Flying blind on 'gut feelings' or managerial intuition is like driving a supersonic car through dense fog; Business Analytics converts noisy data exhaust into 4 clear levels of sight: 1. Descriptive Analytics (The Rear-View Mirror: What happened?); 2. Diagnostic Analytics (The Engine Trouble Code: Why did it happen?); 3. Predictive Analytics (The Weather Radar: What will happen next?); 4. Prescriptive Analytics (The AI GPS Autopilot: What optimal action should we take right now?).",
    "blocks": [
      {
        "id": "ana-d1-b1-four-pillars-analytics",
        "day": 1,
        "blockNumber": 1,
        "title": "The 4 Pillars of Business Analytics: Descriptive, Diagnostic, Predictive & Prescriptive",
        "conceptBudget": {
          "primaryConcept": "The 4 Analytics Pillars",
          "supportingTerms": [
            "Descriptive Analytics (Historical reporting & dashboards: What happened?)",
            "Diagnostic Analytics (Root-cause analysis & drill-downs: Why did it happen?)",
            "Predictive Analytics (Statistical forecasting & ML: What will happen?)",
            "Prescriptive Analytics (Optimization & decision intelligence: What should we do?)"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Analytics Maturity Spectrum",
              "boxes": [
                {
                  "label": "1. Descriptive (Hindsight)",
                  "value": "Sales dropped 12% in Q3 | Reports & BI Dashboards",
                  "varType": "Historical",
                  "isUpdated": false
                },
                {
                  "label": "2. Diagnostic (Insight)",
                  "value": "Root Cause: Supply chain delays in Region East",
                  "varType": "Root Cause",
                  "isUpdated": false
                },
                {
                  "label": "3. Predictive (Foresight)",
                  "value": "Forecast: Demand will rebound 18% in Q4",
                  "varType": "ML Forecast",
                  "isUpdated": false
                },
                {
                  "label": "4. Prescriptive (Optimization)",
                  "value": "Action: Re-route 5,000 units from Warehouse B to minimize shipping cost!",
                  "varType": "Optimal Action",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pillars_demo.js",
            "initialCode": "function classifyBusinessQuestion(question) {\n  if (question.includes('should we') || question.includes('optimize')) return 'PRESCRIPTIVE_ANALYTICS_OPTIMIZATION';\n  if (question.includes('will') || question.includes('forecast')) return 'PREDICTIVE_ANALYTICS_FORESIGHT';\n  if (question.includes('why')) return 'DIAGNOSTIC_ANALYTICS_ROOT_CAUSE';\n  return 'DESCRIPTIVE_ANALYTICS_HINDSIGHT';\n}\n\nconsole.log(classifyBusinessQuestion('What were our total sales last month?'));\nconsole.log(classifyBusinessQuestion('Why did customer churn spike in March?'));\nconsole.log(classifyBusinessQuestion('What will our revenue be next quarter?'));\nconsole.log(classifyBusinessQuestion('How should we allocate our $1M marketing budget to maximize ROI?'));",
            "expectedOutput": "DESCRIPTIVE_ANALYTICS_HINDSIGHT\nDIAGNOSTIC_ANALYTICS_ROOT_CAUSE\nPREDICTIVE_ANALYTICS_FORESIGHT\nPRESCRIPTIVE_ANALYTICS_OPTIMIZATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which analytics pillar answers the executive question: 'How should we allocate our budget across channels to maximize profit?'",
          "expectedStringOutput": "PRESCRIPTIVE_ANALYTICS_OPTIMIZATION",
          "acceptableAnswers": [
            "PRESCRIPTIVE_ANALYTICS_OPTIMIZATION",
            "Prescriptive Analytics",
            "Prescriptive"
          ],
          "primaryMisconceptionId": "MC_ANA_DATA_LITERACY_TYPES_NOMINAL_ORDINAL_INTERVAL_RATIO",
          "diagnosisMap": {
            "PREDICTIVE": {
              "misconceptionId": "MC_ANA_DATA_LITERACY_TYPES_NOMINAL_ORDINAL_INTERVAL_RATIO",
              "errorExplanation": "Predictive forecasts what will happen. Prescriptive recommends what optimal decision to take.",
              "recoveryPath": {
                "simplerExplanation": "Optimization is Prescriptive Analytics.",
                "guidedFixPrompt": "Type PRESCRIPTIVE_ANALYTICS_OPTIMIZATION"
              }
            }
          }
        }
      },
      {
        "id": "ana-d1-b2-scales-of-data-measurement",
        "day": 1,
        "blockNumber": 2,
        "title": "Scales of Data Measurement: Nominal, Ordinal, Interval & Ratio",
        "conceptBudget": {
          "primaryConcept": "Scales of Data Measurement",
          "supportingTerms": [
            "Nominal (Categories without order e.g. Customer Gender, Country, Payment Method)",
            "Ordinal (Ordered ranks e.g. CSAT Ratings 1-5, Bronze/Silver/Gold)",
            "Interval (Equal distances without true zero e.g. Temperature Celsius, Calendar Year)",
            "Ratio (True zero point allowing multiplication/division e.g. Revenue, Sales Volume, Age)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d1-b1-four-pillars-analytics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Data Scales Mathematical Capabilities",
            "codeSnippet": "// Nominal:   Counts, Frequency, Mode (e.g. 'Credit_Card' vs 'UPI')\n// Ordinal:   Median, Percentiles, Rank Order (e.g. 'Low' < 'Medium' < 'High')\n// Interval:  Addition, Subtraction, Mean (Zero is arbitrary!)\n// Ratio:     Multiplication, Division, Geometric Mean (True Zero: $0 Revenue = Zero money!)",
            "lineNotes": {
              "1": "Categorical mode only.",
              "2": "Ordered ranking.",
              "4": "Full arithmetic with true zero."
            }
          },
          {
            "type": "runnable_code",
            "filename": "scales_demo.js",
            "initialCode": "function evaluateDataScaleOperations(scaleName) {\n  const allowsRatios = scaleName === 'RATIO';\n  return {\n    scale: scaleName,\n    hasTrueZero: allowsRatios,\n    canCalculateMeaningfulRatios: allowsRatios,\n    status: allowsRatios ? 'RATIO_SCALE_SUPPORTS_ALL_ARITHMETIC' : 'LIMITED_MATHEMATICAL_OPERATIONS'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateDataScaleOperations('RATIO')));\nconsole.log(JSON.stringify(evaluateDataScaleOperations('ORDINAL')));",
            "expectedOutput": "{\"scale\":\"RATIO\",\"hasTrueZero\":true,\"canCalculateMeaningfulRatios\":true,\"status\":\"RATIO_SCALE_SUPPORTS_ALL_ARITHMETIC\"}\n{\"scale\":\"ORDINAL\",\"hasTrueZero\":false,\"canCalculateMeaningfulRatios\":false,\"status\":\"LIMITED_MATHEMATICAL_OPERATIONS\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which measurement scale possesses a true absolute zero point that allows meaningful multiplication and division operations ($200 is twice as large as $100)?",
          "expectedStringOutput": "RATIO",
          "acceptableAnswers": [
            "RATIO",
            "Ratio Scale",
            "Ratio"
          ],
          "primaryMisconceptionId": "MC_ANA_DATA_LITERACY_TYPES_NOMINAL_ORDINAL_INTERVAL_RATIO",
          "diagnosisMap": {
            "INTERVAL": {
              "misconceptionId": "MC_ANA_DATA_LITERACY_TYPES_NOMINAL_ORDINAL_INTERVAL_RATIO",
              "errorExplanation": "Interval scales (like Celsius) lack a true zero. Ratio scales (like Revenue) possess a true absolute zero.",
              "recoveryPath": {
                "simplerExplanation": "Scale with true zero is RATIO.",
                "guidedFixPrompt": "Type RATIO"
              }
            }
          }
        }
      },
      {
        "id": "ana-d1-b3-structured-vs-unstructured-data",
        "day": 1,
        "blockNumber": 3,
        "title": "Structured, Semi-Structured & Unstructured Business Data",
        "conceptBudget": {
          "primaryConcept": "Enterprise Data Structures",
          "supportingTerms": [
            "Structured Data (Relational tables, SQL databases, CSV rows/columns)",
            "Semi-Structured Data (JSON API payloads, XML, NoSQL document stores)",
            "Unstructured Data (Customer call recordings, support emails, PDFs, product images)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d1-b2-scales-of-data-measurement",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "datastructure_demo.js",
            "initialCode": "function classifyDataStructure(format) {\n  if (format === 'SQL_TABLE' || format === 'CSV') return 'STRUCTURED_RELATIONAL_DATA';\n  if (format === 'JSON' || format === 'XML') return 'SEMI_STRUCTURED_DATA';\n  return 'UNSTRUCTURED_NATURAL_TEXT_OR_MEDIA';\n}\n\nconsole.log(classifyDataStructure('SQL_TABLE'));\nconsole.log(classifyDataStructure('JSON'));\nconsole.log(classifyDataStructure('CUSTOMER_SUPPORT_AUDIO'));",
            "expectedOutput": "STRUCTURED_RELATIONAL_DATA\nSEMI_STRUCTURED_DATA\nUNSTRUCTURED_NATURAL_TEXT_OR_MEDIA",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How are standard relational database SQL tables and CSV spreadsheets classified in data architecture?",
          "expectedStringOutput": "STRUCTURED_RELATIONAL_DATA",
          "acceptableAnswers": [
            "STRUCTURED_RELATIONAL_DATA",
            "Structured Data",
            "Structured"
          ],
          "primaryMisconceptionId": "MC_ANA_DATA_LITERACY_TYPES_NOMINAL_ORDINAL_INTERVAL_RATIO",
          "diagnosisMap": {
            "UNSTRUCTURED": {
              "misconceptionId": "MC_ANA_DATA_LITERACY_TYPES_NOMINAL_ORDINAL_INTERVAL_RATIO",
              "errorExplanation": "SQL tables with rows and columns are structured data.",
              "recoveryPath": {
                "simplerExplanation": "Matches STRUCTURED_RELATIONAL_DATA.",
                "guidedFixPrompt": "Type STRUCTURED_RELATIONAL_DATA"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Descriptive Statistics: Central Tendency & Dispersion",
    "overviewMetaphor": "Descriptive Statistics is Taking a Single High-Resolution Panoramic Snapshot of a Massive Stadium Crowd: instead of inspecting all 50,000 fans individually, Central Tendency finds the center of mass (Mean and Median); Dispersion measures how widely scattered the crowd is across the bleachers (Standard Deviation and IQR); if CEO salary is $10,000,000 while 99 workers earn $50,000, the Mean ($149,500) lies to you, but the Median ($50,000) tells the unvarnished truth.",
    "blocks": [
      {
        "id": "ana-d2-b1-mean-median-mode-skewness",
        "day": 2,
        "blockNumber": 1,
        "title": "Central Tendency: Mean vs Median in Skewed Business Distributions",
        "conceptBudget": {
          "primaryConcept": "Mean vs Median Robustness",
          "supportingTerms": [
            "Arithmetic Mean ($\\bar{x} = \\frac{\\sum x_i}{n}$: Highly sensitive to extreme outliers)",
            "Median (50th percentile midpoint: Robust and unaffected by extreme outliers)",
            "Right-Skewed Distribution ($\\text{Mean} > \\text{Median}$ e.g. Customer Wealth, Housing Prices)",
            "Left-Skewed Distribution ($\\text{Mean} < \\text{Median}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d1-b2-scales-of-data-measurement",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Outlier Impact on Central Tendency ([10, 20, 30, 40, 1000])",
              "boxes": [
                {
                  "label": "Original Set ([10, 20, 30, 40, 50])",
                  "value": "Mean = 30.0 | Median = 30.0 (Symmetric)",
                  "varType": "Base Set",
                  "isUpdated": false
                },
                {
                  "label": "Outlier Injected ([10, 20, 30, 40, 1000])",
                  "value": "Mean jumps to 220.0 (+633% distortion!) | Median = 30.0 (ROCK SOLID UNCHANGED!)",
                  "varType": "Robustness Test",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "mean_median_demo.js",
            "initialCode": "function calculateCentralTendency(arr) {\n  const n = arr.length;\n  const sum = arr.reduce((a, b) => a + b, 0);\n  const mean = sum / n;\n  const sorted = [...arr].sort((a, b) => a - b);\n  const median = n % 2 === 1 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;\n  return {\n    mean: Number(mean.toFixed(2)),\n    median: Number(median.toFixed(2)),\n    distributionType: mean > median + 1 ? 'RIGHT_SKEWED_POSITIVE' : (mean < median - 1 ? 'LEFT_SKEWED_NEGATIVE' : 'SYMMETRIC'),\n    status: 'CENTRAL_TENDENCY_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCentralTendency([10, 20, 30, 40, 50])));\nconsole.log(JSON.stringify(calculateCentralTendency([10, 20, 30, 40, 1000])));",
            "expectedOutput": "{\"mean\":30,\"median\":30,\"distributionType\":\"SYMMETRIC\",\"status\":\"CENTRAL_TENDENCY_EVALUATED\"}\n{\"mean\":220,\"median\":30,\"distributionType\":\"RIGHT_SKEWED_POSITIVE\",\"status\":\"CENTRAL_TENDENCY_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When a business dataset contains extreme positive outliers (e.g. employee salaries with a billionaire CEO), which measure of central tendency remains robust and unaffected?",
          "expectedStringOutput": "median",
          "acceptableAnswers": [
            "median",
            "Median",
            "median\":30"
          ],
          "primaryMisconceptionId": "MC_ANA_DESCRIPTIVE_STATS_MEAN_MEDIAN_SKEWNESS",
          "diagnosisMap": {
            "mean": {
              "misconceptionId": "MC_ANA_DESCRIPTIVE_STATS_MEAN_MEDIAN_SKEWNESS",
              "errorExplanation": "Mean is heavily distorted by extreme values. Median is robust.",
              "recoveryPath": {
                "simplerExplanation": "Robust central metric is the median.",
                "guidedFixPrompt": "Type median"
              }
            }
          }
        }
      },
      {
        "id": "ana-d2-b2-sample-standard-deviation-variance",
        "day": 2,
        "blockNumber": 2,
        "title": "Measures of Dispersion: Sample Variance ($s^2$) & Standard Deviation ($s$)",
        "conceptBudget": {
          "primaryConcept": "Sample Standard Deviation Formula",
          "supportingTerms": [
            "Sample Variance: $s^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n - 1}$ (Bessel's Correction: $n-1$ avoids underestimating population variance)",
            "Sample Standard Deviation: $s = \\sqrt{s^2}$",
            "Measured in the original units of the data"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d2-b1-mean-median-mode-skewness",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Sample Standard Deviation Math ([10, 20, 30, 40, 50])",
            "codeSnippet": "Mean = 30 | n = 5\nSquared Deviations = (10-30)^2 + (20-30)^2 + (30-30)^2 + (40-30)^2 + (50-30)^2\nSum of Squares = 400 + 100 + 0 + 100 + 400 = 1,000\nSample Variance s^2 = 1,000 / (5 - 1) = 1,000 / 4 = 250.0\nSample Std Dev s = sqrt(250) = 15.81",
            "lineNotes": {
              "2": "Sum of squared differences from mean.",
              "4": "Bessel correction divides by n - 1.",
              "5": "Standard deviation in original units."
            }
          },
          {
            "type": "runnable_code",
            "filename": "std_calc_demo.js",
            "initialCode": "function calculateSampleStd(arr) {\n  const n = arr.length;\n  const mean = arr.reduce((a, b) => a + b, 0) / n;\n  const sumSq = arr.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);\n  const sampleVar = sumSq / (n - 1);\n  const sampleStd = Math.sqrt(sampleVar);\n  return {\n    mean: Number(mean.toFixed(2)),\n    sampleVariance: Number(sampleVar.toFixed(2)),\n    sampleStandardDeviation: Number(sampleStd.toFixed(2)),\n    status: 'SAMPLE_STD_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateSampleStd([10, 20, 30, 40, 50])));",
            "expectedOutput": "{\"mean\":30,\"sampleVariance\":250,\"sampleStandardDeviation\":15.81,\"status\":\"SAMPLE_STD_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Sample Standard Deviation for the dataset [10, 20, 30, 40, 50] with Bessel's correction ($\\sqrt{1000 / 4}$)?",
          "expectedStringOutput": "15.81",
          "acceptableAnswers": [
            "15.81",
            "sampleStandardDeviation\":15.81"
          ],
          "primaryMisconceptionId": "MC_ANA_DESCRIPTIVE_STATS_MEAN_MEDIAN_SKEWNESS",
          "diagnosisMap": {
            "14.14": {
              "misconceptionId": "MC_ANA_DESCRIPTIVE_STATS_MEAN_MEDIAN_SKEWNESS",
              "errorExplanation": "14.14 divides by n (population variance). Sample standard deviation divides by n - 1 = 4 -> sqrt(250) = 15.81.",
              "recoveryPath": {
                "simplerExplanation": "sqrt(1000 / 4) = 15.81.",
                "guidedFixPrompt": "Type 15.81"
              }
            }
          }
        }
      },
      {
        "id": "ana-d2-b3-coefficient-of-variation-cv",
        "day": 2,
        "blockNumber": 3,
        "title": "Coefficient of Variation ($CV = \\frac{s}{\\bar{x}} \\times 100\\%$): Relative Risk Benchmarking",
        "conceptBudget": {
          "primaryConcept": "Coefficient of Variation (CV)",
          "supportingTerms": [
            "$CV = \\frac{s}{\\bar{x}} \\times 100\\%$",
            "Unit-less percentage measure of relative dispersion",
            "Comparing risk between stock prices with wildly different price scales ($10 stock vs $1,000 stock)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d2-b2-sample-standard-deviation-variance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cv_demo.js",
            "initialCode": "function calculateCv(mean, std) {\n  const cv = (std / mean) * 100;\n  return {\n    mean,\n    standardDeviation: std,\n    coefficientOfVariationPercent: Number(cv.toFixed(2)),\n    status: 'CV_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCv(100, 15)));\nconsole.log(JSON.stringify(calculateCv(1000, 50)));",
            "expectedOutput": "{\"mean\":100,\"standardDeviation\":15,\"coefficientOfVariationPercent\":15,\"status\":\"CV_COMPUTED\"}\n{\"mean\":1000,\"standardDeviation\":50,\"coefficientOfVariationPercent\":5,\"status\":\"CV_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Coefficient of Variation percentage for a business process with a mean of 100 and standard deviation of 15 ($ (15 / 100) \\times 100 $)?",
          "expectedStringOutput": "15",
          "acceptableAnswers": [
            "15",
            "15%",
            "15.0",
            "coefficientOfVariationPercent\":15"
          ],
          "primaryMisconceptionId": "MC_ANA_DESCRIPTIVE_STATS_MEAN_MEDIAN_SKEWNESS",
          "diagnosisMap": {
            "0.15": {
              "misconceptionId": "MC_ANA_DESCRIPTIVE_STATS_MEAN_MEDIAN_SKEWNESS",
              "errorExplanation": "0.15 is the decimal ratio. Multiplied by 100 gives 15%.",
              "recoveryPath": {
                "simplerExplanation": "(15 / 100) * 100 = 15%.",
                "guidedFixPrompt": "Type 15"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Data Cleaning: Missing Value Imputation & Outlier Detection (Z-Score & IQR)",
    "overviewMetaphor": "Data Cleaning is Purifying Raw River Water Before It Enters a City's Drinking Reservoirs: feeding raw, muddy data full of `null` missing values and fat-finger typos into a machine learning algorithm will poison all business predictions (Garbage In, Garbage Out); Data Cleaning filters out contaminants using Tukey's Fences ($Q_1 - 1.5 \\times IQR$) to isolate outliers and imputes missing cells with robust median values.",
    "blocks": [
      {
        "id": "ana-d3-b1-missing-value-imputation-strategies",
        "day": 3,
        "blockNumber": 1,
        "title": "Missing Value Imputation: Mean, Median & Mode Strategies",
        "conceptBudget": {
          "primaryConcept": "Missing Data Imputation",
          "supportingTerms": [
            "Missing Data Mechanisms: MCAR (Completely at Random), MAR (At Random), MNAR (Not at Random)",
            "Mean Imputation (For symmetric continuous data)",
            "Median Imputation (For skewed continuous data with outliers)",
            "Mode Imputation (For categorical variables)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d2-b1-mean-median-mode-skewness",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Missing Value Imputation Pipeline",
              "boxes": [
                {
                  "label": "Raw Dirty Data",
                  "value": "[10, 20, null, 40, 50] (1 missing cell)",
                  "varType": "Raw Inflow",
                  "isUpdated": false
                },
                {
                  "label": "Imputation Candidate",
                  "value": "Median of valid numbers ([10, 20, 40, 50]) = 30.0",
                  "varType": "Imputed Value",
                  "isUpdated": false
                },
                {
                  "label": "Cleaned Imputed Data",
                  "value": "[10, 20, 30.0, 40, 50] (Zero missing records!)",
                  "varType": "Clean Output",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "imputation_demo.js",
            "initialCode": "function imputeMissingWithMedian(arr) {\n  const valid = arr.filter(v => v !== null && v !== undefined && !isNaN(v)).sort((a, b) => a - b);\n  const n = valid.length;\n  const median = n % 2 === 1 ? valid[Math.floor(n / 2)] : (valid[n / 2 - 1] + valid[n / 2]) / 2;\n  const imputed = arr.map(v => (v === null || v === undefined || isNaN(v)) ? median : v);\n  return {\n    originalLength: arr.length,\n    imputedMedianValue: median,\n    imputedArray: imputed,\n    status: 'MISSING_VALUES_IMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(imputeMissingWithMedian([10, 20, null, 40, 50])));",
            "expectedOutput": "{\"originalLength\":5,\"imputedMedianValue\":30,\"imputedArray\":[10,20,30,40,50],\"status\":\"MISSING_VALUES_IMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What value replaces the `null` entry in the array [10, 20, null, 40, 50] when using Median Imputation?",
          "expectedStringOutput": "30",
          "acceptableAnswers": [
            "30",
            "30.0",
            "imputedMedianValue\":30"
          ],
          "primaryMisconceptionId": "MC_ANA_DATA_CLEANING_IMPUTATION_AND_OUTLIERS_IQR",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_ANA_DATA_CLEANING_IMPUTATION_AND_OUTLIERS_IQR",
              "errorExplanation": "Filling with 0 artificially drags down the mean. Median imputation preserves the distribution = 30.",
              "recoveryPath": {
                "simplerExplanation": "Median of (10, 20, 40, 50) is 30.",
                "guidedFixPrompt": "Type 30"
              }
            }
          }
        }
      },
      {
        "id": "ana-d3-b2-tukey-iqr-outlier-detection",
        "day": 3,
        "blockNumber": 2,
        "title": "Tukey's Fences & Interquartile Range (IQR) Outlier Detection",
        "conceptBudget": {
          "primaryConcept": "Tukey's IQR Outlier Rule",
          "supportingTerms": [
            "$IQR = Q_3 - Q_1$ (Distance between 75th and 25th percentiles)",
            "Lower Fence: $Q_1 - 1.5 \\times IQR$",
            "Upper Fence: $Q_3 + 1.5 \\times IQR$",
            "Any point outside $[\\text{Lower Fence}, \\text{Upper Fence}]$ is flagged as an Outlier"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d3-b1-missing-value-imputation-strategies",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Tukey's Outlier Bounds Math",
            "codeSnippet": "Q1 = 12 | Q3 = 18\nIQR = Q3 - Q1 = 18 - 12 = 6\nLower Fence = Q1 - 1.5 * IQR = 12 - 9 = 3\nUpper Fence = Q3 + 1.5 * IQR = 18 + 9 = 27\nValue 1000 > 27 -> FLAGGED AS OUTLIER AND ISOLATED!",
            "lineNotes": {
              "2": "Interquartile spread.",
              "3": "Lower cutoff.",
              "4": "Upper cutoff.",
              "5": "Outlier detection trigger."
            }
          },
          {
            "type": "runnable_code",
            "filename": "tukey_demo.js",
            "initialCode": "function detectTukeyOutliers(arr) {\n  const sorted = [...arr].sort((a, b) => a - b);\n  const q1 = sorted[Math.floor(sorted.length * 0.25)];\n  const q3 = sorted[Math.floor(sorted.length * 0.75)];\n  const iqr = q3 - q1;\n  const lower = q1 - 1.5 * iqr;\n  const upper = q3 + 1.5 * iqr;\n  const outliers = arr.filter(v => v < lower || v > upper);\n  return {\n    q1,\n    q3,\n    iqr,\n    lowerFence: lower,\n    upperFence: upper,\n    detectedOutliers: outliers,\n    status: 'OUTLIERS_DETECTED'\n  };\n}\n\nconsole.log(JSON.stringify(detectTukeyOutliers([10, 12, 14, 16, 18, 20, 1000])));",
            "expectedOutput": "{\"q1\":12,\"q3\":18,\"iqr\":6,\"lowerFence\":3,\"upperFence\":27,\"detectedOutliers\":[1000],\"status\":\"OUTLIERS_DETECTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Upper Fence outlier threshold when $Q_1 = 12$, $Q_3 = 18$, and $IQR = 6$ ($18 + 1.5 \\times 6$)?",
          "expectedStringOutput": "27",
          "acceptableAnswers": [
            "27",
            "27.0",
            "upperFence\":27"
          ],
          "primaryMisconceptionId": "MC_ANA_DATA_CLEANING_IMPUTATION_AND_OUTLIERS_IQR",
          "diagnosisMap": {
            "24": {
              "misconceptionId": "MC_ANA_DATA_CLEANING_IMPUTATION_AND_OUTLIERS_IQR",
              "errorExplanation": "Q3 + 1.5 * IQR = 18 + 9 = 27.",
              "recoveryPath": {
                "simplerExplanation": "18 + (1.5 * 6) = 27.",
                "guidedFixPrompt": "Type 27"
              }
            }
          }
        }
      },
      {
        "id": "ana-d3-b3-z-score-outlier-standardization",
        "day": 3,
        "blockNumber": 3,
        "title": "Z-Score Outlier Detection ($|Z| > 3.0$ Rule)",
        "conceptBudget": {
          "primaryConcept": "Z-Score Outlier Rule",
          "supportingTerms": [
            "$Z_i = \\frac{x_i - \\bar{x}}{s}$",
            "Standard Normal Threshold: $|Z| > 3.0$ represents points beyond 3 standard deviations (less than 0.3% probability)",
            "Winsorization / Capping outliers at 3-sigma bounds"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d3-b2-tukey-iqr-outlier-detection",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "zscore_outlier_demo.js",
            "initialCode": "function evaluateZScoreOutlier(zVal) {\n  return Math.abs(zVal) > 3.0\n    ? 'OUTLIER_EXCEEDS_THREE_SIGMA_THRESHOLD'\n    : 'INLIER_WITHIN_NORMAL_OPERATING_RANGE';\n}\n\nconsole.log(evaluateZScoreOutlier(3.45));\nconsole.log(evaluateZScoreOutlier(1.80));",
            "expectedOutput": "OUTLIER_EXCEEDS_THREE_SIGMA_THRESHOLD\nINLIER_WITHIN_NORMAL_OPERATING_RANGE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is a data point with a Z-Score of +3.45 classified under the standard 3-sigma statistical outlier rule?",
          "expectedStringOutput": "OUTLIER_EXCEEDS_THREE_SIGMA_THRESHOLD",
          "acceptableAnswers": [
            "OUTLIER_EXCEEDS_THREE_SIGMA_THRESHOLD",
            "Outlier",
            "Exceeds 3 sigma"
          ],
          "primaryMisconceptionId": "MC_ANA_DATA_CLEANING_IMPUTATION_AND_OUTLIERS_IQR",
          "diagnosisMap": {
            "INLIER": {
              "misconceptionId": "MC_ANA_DATA_CLEANING_IMPUTATION_AND_OUTLIERS_IQR",
              "errorExplanation": "Any Z-score with absolute value > 3.0 is flagged as an outlier.",
              "recoveryPath": {
                "simplerExplanation": "|3.45| > 3.0 -> Outlier.",
                "guidedFixPrompt": "Type OUTLIER_EXCEEDS_THREE_SIGMA_THRESHOLD"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Exploratory Data Analysis (EDA): Pearson & Spearman Correlation",
    "overviewMetaphor": "Correlation is a Two-Person Tandem Bicycle: when Driver X pedals harder, Pearson Correlation ($r$) measures whether Rider Y's speed rises in a strict, straight line ($r = +1.0$); but remember the golden rule of data science: 'Ice cream sales and drowning rates are strongly correlated in the summer, but eating ice cream does NOT cause drowning'—Correlation measures co-movement, never causation.",
    "blocks": [
      {
        "id": "ana-d4-b1-pearson-correlation-formula",
        "day": 4,
        "blockNumber": 1,
        "title": "Pearson Correlation Coefficient ($r = \\frac{\\text{Cov}(X, Y)}{s_x s_y}$)",
        "conceptBudget": {
          "primaryConcept": "Pearson Correlation Coefficient Formula",
          "supportingTerms": [
            "$r = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum(x_i - \\bar{x})^2 \\sum(y_i - \\bar{y})^2}}$",
            "Scale: $-1.0 \\le r \\le +1.0$",
            "Linear relationship measurement between continuous variables"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d2-b2-sample-standard-deviation-variance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Pearson Correlation Math (Ad Spend vs Sales)",
              "boxes": [
                {
                  "label": "Ad Spend X ([1, 2, 3, 4, 5])",
                  "value": "Mean = 3.0",
                  "varType": "Feature X",
                  "isUpdated": false
                },
                {
                  "label": "Sales Y ([2, 4, 6, 8, 10])",
                  "value": "Mean = 6.0",
                  "varType": "Feature Y",
                  "isUpdated": false
                },
                {
                  "label": "Pearson r",
                  "value": "r = +1.0000 (PERFECT POSITIVE LINEAR CORRELATION!)",
                  "varType": "Correlation",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pearson_calc_demo.js",
            "initialCode": "function calculatePearson(x, y) {\n  const n = x.length;\n  const meanX = x.reduce((a, b) => a + b, 0) / n;\n  const meanY = y.reduce((a, b) => a + b, 0) / n;\n  let num = 0;\n  let denX = 0;\n  let denY = 0;\n  for (let i = 0; i < n; i++) {\n    const dx = x[i] - meanX;\n    const dy = y[i] - meanY;\n    num += dx * dy;\n    denX += dx * dx;\n    denY += dy * dy;\n  }\n  const r = num / Math.sqrt(denX * denY);\n  return {\n    pearsonR: Number(r.toFixed(4)),\n    status: 'PEARSON_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculatePearson([1, 2, 3, 4, 5], [2, 4, 6, 8, 10])));",
            "expectedOutput": "{\"pearsonR\":1,\"status\":\"PEARSON_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Pearson correlation coefficient ($r$) when Variable Y is exactly double Variable X ($Y = 2X$)?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "1.0",
            "1.0000",
            "pearsonR\":1"
          ],
          "primaryMisconceptionId": "MC_ANA_EXPLORATORY_DATA_ANALYSIS_PEARSON_SPEARMAN",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_ANA_EXPLORATORY_DATA_ANALYSIS_PEARSON_SPEARMAN",
              "errorExplanation": "2 is the slope. Pearson correlation is normalized between -1.0 and +1.0 -> r = 1.0.",
              "recoveryPath": {
                "simplerExplanation": "Max positive correlation is 1.0.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "ana-d4-b2-spearman-rank-correlation",
        "day": 4,
        "blockNumber": 2,
        "title": "Spearman Rank Correlation ($\\rho_s$): Monotonic Non-Linear Relationships",
        "conceptBudget": {
          "primaryConcept": "Spearman Rank Correlation",
          "supportingTerms": [
            "$\\rho_s = 1 - \\frac{6 \\sum d_i^2}{n(n^2 - 1)}$",
            "Operates on ranked positions rather than raw values",
            "Captures monotonic curved relationships (e.g. exponential growth) where Pearson fails"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d4-b1-pearson-correlation-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Pearson vs Spearman on Exponential Data",
            "codeSnippet": "// X = [1, 2, 3, 4, 5], Y = [1, 10, 100, 1000, 10000] (Strict monotonic curve!)\n// Pearson r = 0.76 (Underestimates relationship due to non-linearity)\n// Spearman rho = 1.00 (Perfect rank alignment recognizes 100% monotonic relationship!)",
            "lineNotes": {
              "1": "Non-linear exponential curve.",
              "2": "Pearson checks straight line only.",
              "3": "Spearman ranks capture pure monotonic increase."
            }
          },
          {
            "type": "runnable_code",
            "filename": "spearman_demo.js",
            "initialCode": "function evaluateCorrelationType(isMonotonicCurve) {\n  return isMonotonicCurve\n    ? 'USE_SPEARMAN_RANK_FOR_MONOTONIC_NON_LINEAR_RELATIONSHIPS'\n    : 'USE_PEARSON_FOR_LINEAR_CONTINUOUS_RELATIONSHIPS';\n}\n\nconsole.log(evaluateCorrelationType(true));\nconsole.log(evaluateCorrelationType(false));",
            "expectedOutput": "USE_SPEARMAN_RANK_FOR_MONOTONIC_NON_LINEAR_RELATIONSHIPS\nUSE_PEARSON_FOR_LINEAR_CONTINUOUS_RELATIONSHIPS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which correlation metric should be used when two business variables exhibit a curved, monotonic relationship (e.g. ranked customer satisfaction vs retention)?",
          "expectedStringOutput": "USE_SPEARMAN_RANK_FOR_MONOTONIC_NON_LINEAR_RELATIONSHIPS",
          "acceptableAnswers": [
            "USE_SPEARMAN_RANK_FOR_MONOTONIC_NON_LINEAR_RELATIONSHIPS",
            "Spearman",
            "Spearman Rank"
          ],
          "primaryMisconceptionId": "MC_ANA_EXPLORATORY_DATA_ANALYSIS_PEARSON_SPEARMAN",
          "diagnosisMap": {
            "PEARSON": {
              "misconceptionId": "MC_ANA_EXPLORATORY_DATA_ANALYSIS_PEARSON_SPEARMAN",
              "errorExplanation": "Pearson requires linear relationships. Spearman captures non-linear monotonic curves.",
              "recoveryPath": {
                "simplerExplanation": "Use Spearman for monotonic curves.",
                "guidedFixPrompt": "Type USE_SPEARMAN_RANK_FOR_MONOTONIC_NON_LINEAR_RELATIONSHIPS"
              }
            }
          }
        }
      },
      {
        "id": "ana-d4-b3-correlation-vs-causation",
        "day": 4,
        "blockNumber": 3,
        "title": "Correlation vs Causation & Confounding Variables",
        "conceptBudget": {
          "primaryConcept": "Causation Fallacy Invariant",
          "supportingTerms": [
            "Spurious Correlation (Coincidental statistical alignment)",
            "Confounding Variable (A hidden 3rd factor driving both observed variables e.g. Summer Temperature)",
            "Randomized Controlled Trials (RCTs / A/B testing: The only gold standard for proving causality!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d4-b2-spearman-rank-correlation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "causation_demo.js",
            "initialCode": "function evaluateCausalInference(hasRandomizedExperiment) {\n  return hasRandomizedExperiment\n    ? 'CONTROLLED_AB_EXPERIMENT_PROVES_CAUSALITY'\n    : 'OBSERVATIONAL_CORRELATION_DOES_NOT_PROVE_CAUSATION';\n}\n\nconsole.log(evaluateCausalInference(true));\nconsole.log(evaluateCausalInference(false));",
            "expectedOutput": "CONTROLLED_AB_EXPERIMENT_PROVES_CAUSALITY\nOBSERVATIONAL_CORRELATION_DOES_NOT_PROVE_CAUSATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What fundamental statistical truth must every business analyst remember when finding a strong correlation ($r = 0.92$) between two observational business metrics?",
          "expectedStringOutput": "OBSERVATIONAL_CORRELATION_DOES_NOT_PROVE_CAUSATION",
          "acceptableAnswers": [
            "OBSERVATIONAL_CORRELATION_DOES_NOT_PROVE_CAUSATION",
            "Correlation is not causation",
            "Does not prove causation"
          ],
          "primaryMisconceptionId": "MC_ANA_EXPLORATORY_DATA_ANALYSIS_PEARSON_SPEARMAN",
          "diagnosisMap": {
            "PROVES": {
              "misconceptionId": "MC_ANA_EXPLORATORY_DATA_ANALYSIS_PEARSON_SPEARMAN",
              "errorExplanation": "Observational correlation does not prove causation without a controlled experiment.",
              "recoveryPath": {
                "simplerExplanation": "Correlation does not prove causation.",
                "guidedFixPrompt": "Type OBSERVATIONAL_CORRELATION_DOES_NOT_PROVE_CAUSATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Descriptive Analytics & Data Profiling Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete sovereign descriptive statistics, automated data cleansing, and exploratory profiling engine: 1. Central tendency and Bessel sample variance; 2. Median imputation and Tukey IQR outlier filtration; 3. Pearson and Spearman correlation matrices; 4. Automated dataset quality certification.",
    "blocks": [
      {
        "id": "ana-d5-b1-descriptive-profiling-engine-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "Descriptive Analytics & Data Profiling Master Kernel Synthesis",
        "conceptBudget": {
          "primaryConcept": "Descriptive Engine Synthesis",
          "supportingTerms": [
            "Central Tendency Engine",
            "Dispersion Engine",
            "Tukey Outlier Filter",
            "Correlation Matrix Calculator"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d4-b3-correlation-vs-causation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 Data Profiling Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Inputs raw dirty enterprise dataset with missing values & outliers",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Imputes missing cells via robust median imputation",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Isolates outliers using Tukey's 1.5x IQR Fences",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Generates clean descriptive summary & Pearson correlation matrix!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "profiler_kernel_demo.js",
            "initialCode": "function runDataProfilingEngine() {\n  return {\n    centralTendencySubsystem: 'ONLINE_MEAN_MEDIAN_ACTIVE',\n    dispersionSubsystem: 'ONLINE_SAMPLE_STD_ACTIVE',\n    cleansingSubsystem: 'ONLINE_TUKEY_IQR_ACTIVE',\n    correlationSubsystem: 'ONLINE_PEARSON_SPEARMAN_ACTIVE',\n    engineStatus: 'DATA_PROFILING_MASTER_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runDataProfilingEngine().engineStatus);",
            "expectedOutput": "DATA_PROFILING_MASTER_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Data Profiling Master Engine?",
          "expectedStringOutput": "DATA_PROFILING_MASTER_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "DATA_PROFILING_MASTER_ENGINE_ACTIVE",
            "engineStatus: DATA_PROFILING_MASTER_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_ANA_DESCRIPTIVE_STATS_MEAN_MEDIAN_SKEWNESS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ANA_DESCRIPTIVE_STATS_MEAN_MEDIAN_SKEWNESS",
              "errorExplanation": "Matches DATA_PROFILING_MASTER_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type DATA_PROFILING_MASTER_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "ana-d5-b2-profiling-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "Descriptive Profiling Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Profiling Invariant Verification",
          "supportingTerms": [
            "Imputation Invariant",
            "Outlier Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d5-b1-descriptive-profiling-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "profiler_audit_demo.js",
            "initialCode": "function auditProfilingEngine(statsValid, cleanValid, corrValid) {\n  const passed = statsValid && cleanValid && corrValid;\n  return {\n    statsVerified: statsValid,\n    cleansingVerified: cleanValid,\n    correlationVerified: corrValid,\n    grade: passed ? 'DATA_PROFILING_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditProfilingEngine(true, true, true)));",
            "expectedOutput": "{\"statsVerified\":true,\"cleansingVerified\":true,\"correlationVerified\":true,\"grade\":\"DATA_PROFILING_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Descriptive Statistics, Cleansing, and Correlation engines pass 100%?",
          "expectedStringOutput": "DATA_PROFILING_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "DATA_PROFILING_ENGINE_AUDIT_PASSED",
            "grade\":\"DATA_PROFILING_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_ANA_DESCRIPTIVE_STATS_MEAN_MEDIAN_SKEWNESS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ANA_DESCRIPTIVE_STATS_MEAN_MEDIAN_SKEWNESS",
              "errorExplanation": "All checks passing awards DATA_PROFILING_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards DATA_PROFILING_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type DATA_PROFILING_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "ana-d5-b3-milestone1-analytics-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Descriptive Analytics & Profiling Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Data Profiler Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d5-b2-profiling-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_ana_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete Descriptive Analytics & Data Profiling Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete Descriptive Analytics & Data Profiling Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete Descriptive Analytics & Data Profiling Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete Descriptive Analytics & Data Profiling Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_ANA_DESCRIPTIVE_STATS_MEAN_MEDIAN_SKEWNESS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ANA_DESCRIPTIVE_STATS_MEAN_MEDIAN_SKEWNESS",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete Descriptive Analytics & Data Profiling Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Probability Distributions: Normal Distribution & Z-Score Probabilities",
    "overviewMetaphor": "The Normal Distribution is Nature's Bell-Shaped Mold: when thousands of random factors combine (like customer delivery times, manufacturing screw diameters, or test scores), data naturally clusters in a symmetric Bell Curve; the Empirical Rule tells you that exactly 68% of customers will fall within 1 standard deviation, 95% within 2 standard deviations, and 99.7% within 3 standard deviations; a Z-Score ($Z = \\frac{X - \\mu}{\\sigma}$) is your Universal Ruler that measures exactly how many standard deviations an observation sits away from normal.",
    "blocks": [
      {
        "id": "ana-d6-b1-normal-distribution-empirical-rule",
        "day": 6,
        "blockNumber": 1,
        "title": "The Normal Distribution & The Empirical 68-95-99.7 Rule",
        "conceptBudget": {
          "primaryConcept": "Normal Distribution Empirical Rule",
          "supportingTerms": [
            "Symmetric Bell Curve centered at Mean $\\mu$",
            "68.27% of observations fall within $[\\mu - 1\\sigma, \\mu + 1\\sigma]$",
            "95.45% of observations fall within $[\\mu - 2\\sigma, \\mu + 2\\sigma]$",
            "99.73% of observations fall within $[\\mu - 3\\sigma, \\mu + 3\\sigma]$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d2-b2-sample-standard-deviation-variance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Empirical Rule Bounds (Delivery Time: $\\mu=100 \\text{ mins}, \\sigma=15$)",
              "boxes": [
                {
                  "label": "1-Sigma Band (68%)",
                  "value": "100 \\pm 15 = [85 mins, 115 mins] (68% of all deliveries)",
                  "varType": "1-Sigma",
                  "isUpdated": false
                },
                {
                  "label": "2-Sigma Band (95%)",
                  "value": "100 \\pm 30 = [70 mins, 130 mins] (95% confidence SLA)",
                  "varType": "2-Sigma",
                  "isUpdated": false
                },
                {
                  "label": "3-Sigma Band (99.7%)",
                  "value": "100 \\pm 45 = [55 mins, 145 mins] (99.7% of all deliveries)",
                  "varType": "3-Sigma",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "empirical_demo.js",
            "initialCode": "function getEmpiricalBands(mu, sigma) {\n  return {\n    mean: mu,\n    sigma,\n    band68Percent: [mu - sigma, mu + sigma],\n    band95Percent: [mu - 2 * sigma, mu + 2 * sigma],\n    band997Percent: [mu - 3 * sigma, mu + 3 * sigma],\n    status: 'EMPIRICAL_BANDS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(getEmpiricalBands(100, 15)));",
            "expectedOutput": "{\"mean\":100,\"sigma\":15,\"band68Percent\":[85,115],\"band95Percent\":[70,130],\"band997Percent\":[55,145],\"status\":\"EMPIRICAL_BANDS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Under the Empirical Rule for a delivery process with mean = 100 minutes and std dev = 15 minutes, what is the upper limit of the 95% confidence band ($100 + 2 \\times 15$)?",
          "expectedStringOutput": "130",
          "acceptableAnswers": [
            "130",
            "130 mins",
            "130.0"
          ],
          "primaryMisconceptionId": "MC_ANA_PROBABILITY_DISTRIBUTIONS_NORMAL_Z_SCORES",
          "diagnosisMap": {
            "115": {
              "misconceptionId": "MC_ANA_PROBABILITY_DISTRIBUTIONS_NORMAL_Z_SCORES",
              "errorExplanation": "115 is 1-sigma (68%). 95% band is 2-sigma = 100 + 2*15 = 130 minutes.",
              "recoveryPath": {
                "simplerExplanation": "100 + 30 = 130.",
                "guidedFixPrompt": "Type 130"
              }
            }
          }
        }
      },
      {
        "id": "ana-d6-b2-standard-normal-z-scores",
        "day": 6,
        "blockNumber": 2,
        "title": "Standardizing Data: Z-Scores ($Z = \\frac{X - \\mu}{\\sigma}$)",
        "conceptBudget": {
          "primaryConcept": "Standard Normal Z-Score Formula",
          "supportingTerms": [
            "$Z = \\frac{X - \\mu}{\\sigma}$",
            "Standard Normal Distribution: $\\mu = 0, \\sigma = 1$",
            "Allows comparison across entirely different business metrics (e.g. Sales in USD vs Website Clicks)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d6-b1-normal-distribution-empirical-rule",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Z-Score Standardization Math",
            "codeSnippet": "Observed Value X = 130 mins | Mean mu = 100 mins | Std Dev sigma = 15 mins\nZ = (130 - 100) / 15 = 30 / 15 = +2.00\nMeaning: This delivery took exactly 2.0 standard deviations longer than average!",
            "lineNotes": {
              "1": "Raw process metrics.",
              "2": "Standardized Z-Score equation.",
              "3": "Interpretation as distance from mean."
            }
          },
          {
            "type": "runnable_code",
            "filename": "z_calc_demo.js",
            "initialCode": "function calculateZ(x, mu, sigma) {\n  const z = (x - mu) / sigma;\n  return {\n    observedValue: x,\n    zScore: Number(z.toFixed(2)),\n    status: 'Z_SCORE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateZ(130, 100, 15)));",
            "expectedOutput": "{\"observedValue\":130,\"zScore\":2,\"status\":\"Z_SCORE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the standardized Z-Score for a value of 130 when population mean $\\mu = 100$ and standard deviation $\\sigma = 15$ ($ (130 - 100) / 15 $)?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2.0",
            "2.00",
            "zScore\":2"
          ],
          "primaryMisconceptionId": "MC_ANA_PROBABILITY_DISTRIBUTIONS_NORMAL_Z_SCORES",
          "diagnosisMap": {
            "30": {
              "misconceptionId": "MC_ANA_PROBABILITY_DISTRIBUTIONS_NORMAL_Z_SCORES",
              "errorExplanation": "30 is the raw difference (130 - 100). Dividing by sigma = 15 gives Z = 2.0.",
              "recoveryPath": {
                "simplerExplanation": "30 / 15 = 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "ana-d6-b3-binomial-poisson-distributions",
        "day": 6,
        "blockNumber": 3,
        "title": "Discrete Distributions: Binomial (Conversions) & Poisson (Call Center Arrivals)",
        "conceptBudget": {
          "primaryConcept": "Binomial & Poisson Discrete Models",
          "supportingTerms": [
            "Binomial Distribution: Number of successes $k$ out of $n$ independent trials with probability $p$ ($P(k) = \\binom{n}{k} p^k (1-p)^{n-k}$)",
            "Poisson Distribution: Number of events occurring in a fixed time interval with arrival rate $\\lambda$ ($P(k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d6-b2-standard-normal-z-scores",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "discrete_dist_demo.js",
            "initialCode": "function evaluateDiscreteDistribution(scenario) {\n  return scenario === 'CALL_CENTER_ARRIVALS_PER_HOUR'\n    ? 'POISSON_DISTRIBUTION_ARRIVAL_RATE_LAMBDA'\n    : 'BINOMIAL_DISTRIBUTION_SUCCESS_TRIALS_P';\n}\n\nconsole.log(evaluateDiscreteDistribution('CALL_CENTER_ARRIVALS_PER_HOUR'));\nconsole.log(evaluateDiscreteDistribution('E_COMMERCE_CHECKOUT_CONVERSIONS'));",
            "expectedOutput": "POISSON_DISTRIBUTION_ARRIVAL_RATE_LAMBDA\nBINOMIAL_DISTRIBUTION_SUCCESS_TRIALS_P",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which probability distribution models the number of customer incoming calls arriving at a help desk per hour with constant average rate $\\lambda$?",
          "expectedStringOutput": "POISSON_DISTRIBUTION_ARRIVAL_RATE_LAMBDA",
          "acceptableAnswers": [
            "POISSON_DISTRIBUTION_ARRIVAL_RATE_LAMBDA",
            "Poisson",
            "Poisson Distribution"
          ],
          "primaryMisconceptionId": "MC_ANA_PROBABILITY_DISTRIBUTIONS_NORMAL_Z_SCORES",
          "diagnosisMap": {
            "NORMAL": {
              "misconceptionId": "MC_ANA_PROBABILITY_DISTRIBUTIONS_NORMAL_Z_SCORES",
              "errorExplanation": "Incoming discrete arrivals in a fixed time window follow a Poisson distribution.",
              "recoveryPath": {
                "simplerExplanation": "Arrivals per hour follow Poisson.",
                "guidedFixPrompt": "Type POISSON_DISTRIBUTION_ARRIVAL_RATE_LAMBDA"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Hypothesis Testing: Null ($H_0$), Alternative ($H_1$), p-Values & Alpha ($\\alpha$)",
    "overviewMetaphor": "Hypothesis Testing is a Criminal Trial in Court: the defendant is presumed innocent until proven guilty beyond a reasonable doubt; the Null Hypothesis ($H_0$) assumes 'No Effect / No Difference'; the p-Value is the probability that the evidence occurred by pure dumb luck; if the p-Value drops below our strict 5% threshold ($p < 0.05$), the evidence is overwhelming—we Reject the Null Hypothesis ($H_0$) and declare that the new marketing campaign genuinely boosted revenue.",
    "blocks": [
      {
        "id": "ana-d7-b1-null-vs-alternative-hypothesis",
        "day": 7,
        "blockNumber": 1,
        "title": "Framing Hypotheses: Null ($H_0$) vs Alternative ($H_1$)",
        "conceptBudget": {
          "primaryConcept": "Hypothesis Testing Framing",
          "supportingTerms": [
            "Null Hypothesis ($H_0$: Default state of no difference, no effect, $\\mu_1 = \\mu_2$)",
            "Alternative Hypothesis ($H_1$: The claim being tested, $\\mu_1 \\ne \\mu_2$ or $\\mu_1 > \\mu_2$)",
            "Burden of Proof lies on $H_1$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d6-b2-standard-normal-z-scores",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Hypothesis Framing Matrix (Website Redesign)",
              "boxes": [
                {
                  "label": "Null Hypothesis (H0)",
                  "value": "H0: Redesign has NO effect on conversion rate (p_new = p_old)",
                  "varType": "Status Quo",
                  "isUpdated": false
                },
                {
                  "label": "Alternative Hypothesis (H1)",
                  "value": "H1: Redesign INCREASES conversion rate (p_new > p_old)",
                  "varType": "Claim Tested",
                  "isUpdated": false
                },
                {
                  "label": "Decision Goal",
                  "value": "Gather evidence to either Reject H0 or Fail to Reject H0!",
                  "varType": "Inference Goal",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "hypothesis_frame_demo.js",
            "initialCode": "function frameHypothesis(metric) {\n  return {\n    nullHypothesis: `H0: There is NO difference in ${metric}`,\n    alternativeHypothesis: `H1: There IS a significant difference in ${metric}`,\n    status: 'HYPOTHESIS_FRAMED'\n  };\n}\n\nconsole.log(JSON.stringify(frameHypothesis('Checkout Conversion Rate')));",
            "expectedOutput": "{\"nullHypothesis\":\"H0: There is NO difference in Checkout Conversion Rate\",\"alternativeHypothesis\":\"H1: There IS a significant difference in Checkout Conversion Rate\",\"status\":\"HYPOTHESIS_FRAMED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In hypothesis testing, what does the Null Hypothesis ($H_0$) always represent?",
          "expectedStringOutput": "H0: There is NO difference in Checkout Conversion Rate",
          "acceptableAnswers": [
            "H0: There is NO difference in Checkout Conversion Rate",
            "No difference",
            "Status Quo"
          ],
          "primaryMisconceptionId": "MC_ANA_HYPOTHESIS_TESTING_P_VALUE_TYPE_I_II_ERRORS",
          "diagnosisMap": {
            "H1": {
              "misconceptionId": "MC_ANA_HYPOTHESIS_TESTING_P_VALUE_TYPE_I_II_ERRORS",
              "errorExplanation": "H0 always represents the baseline assumption of no difference or no effect.",
              "recoveryPath": {
                "simplerExplanation": "H0 states there is no difference.",
                "guidedFixPrompt": "Type H0: There is NO difference in Checkout Conversion Rate"
              }
            }
          }
        }
      },
      {
        "id": "ana-d7-b2-p-value-and-significance-alpha",
        "day": 7,
        "blockNumber": 2,
        "title": "p-Values & Significance Level Alpha ($\\alpha = 0.05$): The Golden Decision Rule",
        "conceptBudget": {
          "primaryConcept": "p-Value Decision Rule",
          "supportingTerms": [
            "p-Value: Probability of obtaining test results at least as extreme as observed, assuming $H_0$ is true",
            "$\\alpha = 0.05$ (5% Significance Level)",
            "Golden Rule: 'If $p < \\alpha \\implies$ Reject $H_0$ (Statistically Significant!)'"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d7-b1-null-vs-alternative-hypothesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "The p-Value Decision Rule",
            "codeSnippet": "// Significance threshold alpha = 0.05 (5%)\n// Case A: p-value = 0.012 -> 0.012 < 0.05 -> REJECT NULL HYPOTHESIS (Statistically Significant!)\n// Case B: p-value = 0.085 -> 0.085 > 0.05 -> FAIL TO REJECT NULL (Insufficient Evidence)",
            "lineNotes": {
              "2": "p < 0.05 rejects null.",
              "3": "p > 0.05 fails to reject."
            }
          },
          {
            "type": "runnable_code",
            "filename": "p_value_demo.js",
            "initialCode": "function evaluatePValueDecision(pVal, alpha = 0.05) {\n  const rejectNull = pVal < alpha;\n  return {\n    pValue: pVal,\n    alphaThreshold: alpha,\n    decision: rejectNull ? 'REJECT_NULL_STATISTICALLY_SIGNIFICANT' : 'FAIL_TO_REJECT_NULL_INSUFFICIENT_EVIDENCE',\n    status: 'DECISION_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluatePValueDecision(0.012)));\nconsole.log(JSON.stringify(evaluatePValueDecision(0.085)));",
            "expectedOutput": "{\"pValue\":0.012,\"alphaThreshold\":0.05,\"decision\":\"REJECT_NULL_STATISTICALLY_SIGNIFICANT\",\"status\":\"DECISION_EVALUATED\"}\n{\"pValue\":0.085,\"alphaThreshold\":0.05,\"decision\":\"FAIL_TO_REJECT_NULL_INSUFFICIENT_EVIDENCE\",\"status\":\"DECISION_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What statistical decision is reached when an experiment yields a p-value of 0.012 at the standard $\\alpha = 0.05$ significance level ($0.012 < 0.05$)?",
          "expectedStringOutput": "REJECT_NULL_STATISTICALLY_SIGNIFICANT",
          "acceptableAnswers": [
            "REJECT_NULL_STATISTICALLY_SIGNIFICANT",
            "Reject H0",
            "Reject Null"
          ],
          "primaryMisconceptionId": "MC_ANA_HYPOTHESIS_TESTING_P_VALUE_TYPE_I_II_ERRORS",
          "diagnosisMap": {
            "FAIL": {
              "misconceptionId": "MC_ANA_HYPOTHESIS_TESTING_P_VALUE_TYPE_I_II_ERRORS",
              "errorExplanation": "Since p-value (0.012) is less than alpha (0.05), we reject the null hypothesis.",
              "recoveryPath": {
                "simplerExplanation": "p < alpha -> Reject null.",
                "guidedFixPrompt": "Type REJECT_NULL_STATISTICALLY_SIGNIFICANT"
              }
            }
          }
        }
      },
      {
        "id": "ana-d7-b3-type-1-vs-type-2-errors",
        "day": 7,
        "blockNumber": 3,
        "title": "Type I Error ($\\alpha$: False Positive) vs Type II Error ($\\beta$: False Negative)",
        "conceptBudget": {
          "primaryConcept": "Type I vs Type II Errors",
          "supportingTerms": [
            "Type I Error ($\\alpha$: False Alarm / Rejecting true $H_0$)",
            "Type II Error ($\\beta$: Missed Effect / Failing to reject false $H_0$)",
            "Statistical Power ($1 - \\beta$: Probability of detecting a true effect)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d7-b2-p-value-and-significance-alpha",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "errors_demo.js",
            "initialCode": "function classifyHypothesisError(action, truth) {\n  if (action === 'REJECT_H0' && truth === 'H0_IS_TRUE') return 'TYPE_I_ERROR_FALSE_POSITIVE';\n  if (action === 'FAIL_TO_REJECT' && truth === 'H0_IS_FALSE') return 'TYPE_II_ERROR_FALSE_NEGATIVE';\n  return 'CORRECT_STATISTICAL_DECISION';\n}\n\nconsole.log(classifyHypothesisError('REJECT_H0', 'H0_IS_TRUE'));\nconsole.log(classifyHypothesisError('FAIL_TO_REJECT', 'H0_IS_FALSE'));",
            "expectedOutput": "TYPE_I_ERROR_FALSE_POSITIVE\nTYPE_II_ERROR_FALSE_NEGATIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What type of statistical error is committed when an analyst rejects a Null Hypothesis that was actually true (False Alarm / False Positive)?",
          "expectedStringOutput": "TYPE_I_ERROR_FALSE_POSITIVE",
          "acceptableAnswers": [
            "TYPE_I_ERROR_FALSE_POSITIVE",
            "Type I Error",
            "Type 1 Error",
            "False Positive"
          ],
          "primaryMisconceptionId": "MC_ANA_HYPOTHESIS_TESTING_P_VALUE_TYPE_I_II_ERRORS",
          "diagnosisMap": {
            "TYPE_II": {
              "misconceptionId": "MC_ANA_HYPOTHESIS_TESTING_P_VALUE_TYPE_I_II_ERRORS",
              "errorExplanation": "Rejecting a true null is a Type I error (False Positive).",
              "recoveryPath": {
                "simplerExplanation": "False alarm is Type I error.",
                "guidedFixPrompt": "Type TYPE_I_ERROR_FALSE_POSITIVE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Comparative Tests: Two-Sample t-Test, ANOVA & Chi-Square Independence",
    "overviewMetaphor": "Comparative Statistical Tests are the Forensic Fingerprint Kits of Business Analytics: a Two-Sample t-Test compares two competing teams (e.g. Website Variant A vs Variant B) to see if their score difference is real; One-Way ANOVA is a multi-team championship tournament that checks whether differences across 4 product categories are statistically real ($F = \\frac{\\text{Between-Group Variance}}{\\text{Within-Group Variance}}$); a Chi-Square Contingency Test checks whether customer age brackets and subscription preferences are independent or deeply linked.",
    "blocks": [
      {
        "id": "ana-d8-b1-two-sample-t-test-math",
        "day": 8,
        "blockNumber": 1,
        "title": "Two-Sample t-Test: $t = \\frac{\\bar{x}_1 - \\bar{x}_2}{\\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}}$",
        "conceptBudget": {
          "primaryConcept": "Two-Sample t-Statistic Formula",
          "supportingTerms": [
            "$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{SE_{\\text{diff}}}$",
            "$SE_{\\text{diff}} = \\sqrt{\\frac{s_1^2}{n_1} + \\frac{s_2^2}{n_2}}$",
            "Degrees of Freedom & Welch's t-Test for unequal variances"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d7-b2-p-value-and-significance-alpha",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Two-Sample t-Test Math (Group 1: $\\bar{x}_1=120, s_1=15, n_1=50$ vs Group 2: $\\bar{x}_2=110, s_2=15, n_2=50$)",
              "boxes": [
                {
                  "label": "Difference in Means",
                  "value": "120 - 110 = +10.0 points",
                  "varType": "Mean Diff",
                  "isUpdated": false
                },
                {
                  "label": "Standard Error of Difference",
                  "value": "sqrt(225/50 + 225/50) = sqrt(4.5 + 4.5) = sqrt(9) = 3.00",
                  "varType": "SE",
                  "isUpdated": false
                },
                {
                  "label": "t-Statistic",
                  "value": "t = 10.0 / 3.00 = +3.33 (Statistically Significant difference!)",
                  "varType": "t-Stat",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "two_sample_t_demo.js",
            "initialCode": "function calculateTwoSampleT(m1, s1, n1, m2, s2, n2) {\n  const diff = m1 - m2;\n  const se = Math.sqrt((s1 * s1) / n1 + (s2 * s2) / n2);\n  const t = diff / se;\n  return {\n    meanDifference: diff,\n    standardError: Number(se.toFixed(2)),\n    tStatistic: Number(t.toFixed(2)),\n    status: 'T_STATISTIC_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateTwoSampleT(120, 15, 50, 110, 15, 50)));",
            "expectedOutput": "{\"meanDifference\":10,\"standardError\":3,\"tStatistic\":3.33,\"status\":\"T_STATISTIC_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the t-statistic when the difference in means is 10.0 and the pooled standard error is 3.00 ($10.0 / 3.00$)?",
          "expectedStringOutput": "3.33",
          "acceptableAnswers": [
            "3.33",
            "tStatistic\":3.33"
          ],
          "primaryMisconceptionId": "MC_ANA_TWO_SAMPLE_T_TEST_AND_ANOVA_F_STAT",
          "diagnosisMap": {
            "10.0": {
              "misconceptionId": "MC_ANA_TWO_SAMPLE_T_TEST_AND_ANOVA_F_STAT",
              "errorExplanation": "10.0 is the raw difference. Dividing by SE = 3.0 gives t = 3.33.",
              "recoveryPath": {
                "simplerExplanation": "10.0 / 3.0 = 3.33.",
                "guidedFixPrompt": "Type 3.33"
              }
            }
          }
        }
      },
      {
        "id": "ana-d8-b2-one-way-anova-f-statistic",
        "day": 8,
        "blockNumber": 2,
        "title": "One-Way ANOVA: The F-Statistic ($F = \\frac{\\text{MSB}}{\\text{MSW}}$)",
        "conceptBudget": {
          "primaryConcept": "ANOVA F-Statistic Formula",
          "supportingTerms": [
            "$F = \\frac{\\text{Mean Square Between Groups (MSB)}}{\\text{Mean Square Within Groups (MSW)}}$",
            "Avoids Family-Wise Type I Error inflation from running multiple pairwise t-tests",
            "Post-Hoc Tukey HSD tests for pairwise group differences"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d8-b1-two-sample-t-test-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "ANOVA F-Ratio Decomposition",
            "codeSnippet": "// MSB = Variance explained by differences BETWEEN the 4 store regions\n// MSW = Unexplained noise/variance WITHIN each store region\n// F-Statistic = MSB / MSW\n// High F (e.g. F = 12.5, p < 0.001) -> Proves at least ONE region is significantly different!",
            "lineNotes": {
              "1": "Signal (between group variance).",
              "2": "Noise (within group variance).",
              "3": "Signal to noise ratio."
            }
          },
          {
            "type": "runnable_code",
            "filename": "anova_demo.js",
            "initialCode": "function calculateAnovaF(msb, msw) {\n  const f = msb / msw;\n  return {\n    meanSquareBetween: msb,\n    meanSquareWithin: msw,\n    fStatistic: Number(f.toFixed(2)),\n    isSignificant: f > 3.0,\n    status: 'ANOVA_F_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateAnovaF(125, 10)));",
            "expectedOutput": "{\"meanSquareBetween\":125,\"meanSquareWithin\":10,\"fStatistic\":12.5,\"isSignificant\":true,\"status\":\"ANOVA_F_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the ANOVA F-Statistic when Mean Square Between (MSB) is 125 and Mean Square Within (MSW) is 10 ($125 / 10$)?",
          "expectedStringOutput": "12.5",
          "acceptableAnswers": [
            "12.5",
            "12.50",
            "fStatistic\":12.5"
          ],
          "primaryMisconceptionId": "MC_ANA_TWO_SAMPLE_T_TEST_AND_ANOVA_F_STAT",
          "diagnosisMap": {
            "115": {
              "misconceptionId": "MC_ANA_TWO_SAMPLE_T_TEST_AND_ANOVA_F_STAT",
              "errorExplanation": "F-statistic divides MSB by MSW (125 / 10 = 12.5), not subtracts them.",
              "recoveryPath": {
                "simplerExplanation": "125 / 10 = 12.5.",
                "guidedFixPrompt": "Type 12.5"
              }
            }
          }
        }
      },
      {
        "id": "ana-d8-b3-chi-square-test-of-independence",
        "day": 8,
        "blockNumber": 3,
        "title": "Chi-Square Test of Independence ($\\chi^2 = \\sum \\frac{(O - E)^2}{E}$)",
        "conceptBudget": {
          "primaryConcept": "Chi-Square Contingency Test",
          "supportingTerms": [
            "$\\chi^2 = \\sum \\frac{(O_i - E_i)^2}{E_i}$",
            "$O_i$ (Observed categorical counts)",
            "$E_i = \\frac{\\text{Row Total} \\times \\text{Column Total}}{\\text{Grand Total}}$ (Expected counts under independence)",
            "Testing customer demographic vs product preference associations"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d8-b2-one-way-anova-f-statistic",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "chi_square_demo.js",
            "initialCode": "function calculateChiSquareCell(observed, expected) {\n  const cellChiSq = Math.pow(observed - expected, 2) / expected;\n  return {\n    observed,\n    expected,\n    cellContribution: Number(cellChiSq.toFixed(2)),\n    status: 'CHI_SQUARE_CELL_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateChiSquareCell(60, 40))); // (60 - 40)^2 / 40 = 400 / 40 = 10.00",
            "expectedOutput": "{\"observed\":60,\"expected\":40,\"cellContribution\":10,\"status\":\"CHI_SQUARE_CELL_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Chi-Square cell contribution when Observed count is 60 and Expected count is 40 ($ (60 - 40)^2 / 40 $)?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "10.0",
            "10.00",
            "cellContribution\":10"
          ],
          "primaryMisconceptionId": "MC_ANA_CHI_SQUARE_INDEPENDENCE_CONTINGENCY",
          "diagnosisMap": {
            "20": {
              "misconceptionId": "MC_ANA_CHI_SQUARE_INDEPENDENCE_CONTINGENCY",
              "errorExplanation": "20 is (O - E). Formula squares this and divides by E: (20^2) / 40 = 400 / 40 = 10.0.",
              "recoveryPath": {
                "simplerExplanation": "400 / 40 = 10.",
                "guidedFixPrompt": "Type 10"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Simple Linear Regression: OLS Line, Slope ($\\beta_1$) & $R^2$",
    "overviewMetaphor": "Linear Regression is Drawing the Best-Fit Thread Through a Scatter of Beads: if each bead represents a past advertising campaign (Ad Spend $X$ vs Sales $Y$), Ordinary Least Squares (OLS) minimizes the squared distances from every bead to the thread ($Y = \\beta_0 + \\beta_1 X$); the slope ($\\beta_1 = 2.0$) tells the VP of Marketing that every $1 invested in advertising reliably creates $2 in gross sales; $R^2 = 1.0$ (or 100%) measures what fraction of sales variance is explained by your ad campaign.",
    "blocks": [
      {
        "id": "ana-d9-b1-ols-regression-line-equation",
        "day": 9,
        "blockNumber": 1,
        "title": "Ordinary Least Squares (OLS) Regression Equation: $Y = \\beta_0 + \\beta_1 X$",
        "conceptBudget": {
          "primaryConcept": "OLS Regression Line Formula",
          "supportingTerms": [
            "$Y = \\beta_0 + \\beta_1 X + \\epsilon$",
            "Slope: $\\beta_1 = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{\\sum (x_i - \\bar{x})^2} = \\frac{\\text{Cov}(X, Y)}{\\text{Var}(X)}$",
            "Intercept: $\\beta_0 = \\bar{Y} - \\beta_1 \\bar{X}$",
            "Residual / Error term: $e_i = y_i - \\hat{y}_i$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d4-b1-pearson-correlation-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "OLS Regression Parameters ($X=[10, 20, 30, 40, 50], Y=[25, 45, 65, 85, 105]$)",
              "boxes": [
                {
                  "label": "Mean X & Mean Y",
                  "value": "\\bar{X} = 30.0 | \\bar{Y} = 65.0",
                  "varType": "Averages",
                  "isUpdated": false
                },
                {
                  "label": "Slope Beta1",
                  "value": "\\beta_1 = 2000 / 1000 = 2.00 (Sales increase by $2 per $1 Ad Spend!)",
                  "varType": "Slope",
                  "isUpdated": false
                },
                {
                  "label": "Intercept Beta0",
                  "value": "\\beta_0 = 65 - (2.0 x 30) = 65 - 60 = $5.00 Baseline Sales",
                  "varType": "Intercept",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ols_calc_demo.js",
            "initialCode": "function calculateOls(xArr, yArr) {\n  const n = xArr.length;\n  const meanX = xArr.reduce((a, b) => a + b, 0) / n;\n  const meanY = yArr.reduce((a, b) => a + b, 0) / n;\n  let num = 0;\n  let den = 0;\n  for (let i = 0; i < n; i++) {\n    num += (xArr[i] - meanX) * (yArr[i] - meanY);\n    den += Math.pow(xArr[i] - meanX, 2);\n  }\n  const slope = num / den;\n  const intercept = meanY - slope * meanX;\n  return {\n    slopeBeta1: Number(slope.toFixed(2)),\n    interceptBeta0: Number(intercept.toFixed(2)),\n    regressionEquation: `Y = ${intercept} + ${slope} * X`,\n    status: 'OLS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateOls([10, 20, 30, 40, 50], [25, 45, 65, 85, 105])));",
            "expectedOutput": "{\"slopeBeta1\":2,\"interceptBeta0\":5,\"regressionEquation\":\"Y = 5 + 2 * X\",\"status\":\"OLS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the slope ($\\beta_1$) of the regression line for dataset $X=[10, 20, 30, 40, 50]$ and $Y=[25, 45, 65, 85, 105]$ ($2000 / 1000$)?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2.0",
            "2.00",
            "slopeBeta1\":2"
          ],
          "primaryMisconceptionId": "MC_ANA_SIMPLE_LINEAR_REGRESSION_R_SQUARED_OLS",
          "diagnosisMap": {
            "5": {
              "misconceptionId": "MC_ANA_SIMPLE_LINEAR_REGRESSION_R_SQUARED_OLS",
              "errorExplanation": "5 is the intercept Beta0. The slope Beta1 is 2.0.",
              "recoveryPath": {
                "simplerExplanation": "Slope is 2.0.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "ana-d9-b2-coefficient-of-determination-r-squared",
        "day": 9,
        "blockNumber": 2,
        "title": "The Coefficient of Determination ($R^2 = 1 - \\frac{SS_{\\text{res}}}{SS_{\\text{tot}}}$)",
        "conceptBudget": {
          "primaryConcept": "R-Squared Goodness of Fit",
          "supportingTerms": [
            "$R^2 = 1 - \\frac{SS_{\\text{res}}}{SS_{\\text{tot}}} = \\frac{SS_{\\text{reg}}}{SS_{\\text{tot}}}$",
            "Percentage of total dependent variable variation explained by the model",
            "$R^2 = r^2$ in simple linear regression"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d9-b1-ols-regression-line-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "R-Squared Goodness of Fit Math",
            "codeSnippet": "Total Sum of Squares SStot = sum((y - y_mean)^2) = 4,000\nResidual Sum of Squares SSres = sum((y - y_pred)^2) = 0 (All points lie on line!)\nR^2 = 1 - (0 / 4,000) = 1.00 (100% of sales variation explained by advertising!)",
            "lineNotes": {
              "1": "Total variance in Y.",
              "2": "Unexplained residual error.",
              "3": "Perfect model fit."
            }
          },
          {
            "type": "runnable_code",
            "filename": "r2_calc_demo.js",
            "initialCode": "function calculateR2(ssTot, ssRes) {\n  const r2 = 1 - (ssRes / ssTot);\n  return {\n    totalSumOfSquares: ssTot,\n    residualSumOfSquares: ssRes,\n    rSquared: Number(r2.toFixed(4)),\n    varianceExplainedPercent: Number((r2 * 100).toFixed(2)),\n    status: 'R_SQUARED_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateR2(4000, 600))); // R2 = 1 - 600/4000 = 1 - 0.15 = 0.85 (85%)",
            "expectedOutput": "{\"totalSumOfSquares\":4000,\"residualSumOfSquares\":600,\"rSquared\":0.85,\"varianceExplainedPercent\":85,\"status\":\"R_SQUARED_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the $R^2$ coefficient of determination when Total Sum of Squares ($SS_{\\text{tot}}$) is 4,000 and Residual Sum of Squares ($SS_{\\text{res}}$) is 600 ($1 - 600/4000$)?",
          "expectedStringOutput": "0.85",
          "acceptableAnswers": [
            "0.85",
            "85%",
            "rSquared\":0.85"
          ],
          "primaryMisconceptionId": "MC_ANA_SIMPLE_LINEAR_REGRESSION_R_SQUARED_OLS",
          "diagnosisMap": {
            "0.15": {
              "misconceptionId": "MC_ANA_SIMPLE_LINEAR_REGRESSION_R_SQUARED_OLS",
              "errorExplanation": "0.15 is the unexplained residual ratio (600/4000). R-squared is 1 - 0.15 = 0.85.",
              "recoveryPath": {
                "simplerExplanation": "1 - 0.15 = 0.85.",
                "guidedFixPrompt": "Type 0.85"
              }
            }
          }
        }
      },
      {
        "id": "ana-d9-b3-regression-residual-assumptions",
        "day": 9,
        "blockNumber": 3,
        "title": "Classical Regression Assumptions: Linearity, Normality & Homoscedasticity",
        "conceptBudget": {
          "primaryConcept": "Regression Diagnostic Invariants",
          "supportingTerms": [
            "Homoscedasticity (Constant residual variance across all values of X)",
            "Heteroscedasticity (Fan-shaped widening of residuals $\\implies$ Standard errors distorted!)",
            "Normality of Residuals (Q-Q plot)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d9-b2-coefficient-of-determination-r-squared",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "residuals_demo.js",
            "initialCode": "function evaluateResidualPattern(isFanShaped) {\n  return isFanShaped\n    ? 'HETEROSCEDASTICITY_DETECTED_TRANSFORM_VARIABLE_LOG'\n    : 'HOMOSCEDASTICITY_ASSUMPTION_VALIDATED';\n}\n\nconsole.log(evaluateResidualPattern(false));\nconsole.log(evaluateResidualPattern(true));",
            "expectedOutput": "HOMOSCEDASTICITY_ASSUMPTION_VALIDATED\nHETEROSCEDASTICITY_DETECTED_TRANSFORM_VARIABLE_LOG",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What diagnostic condition confirms that the variance of regression residuals remains constant and uniform across all predicted values?",
          "expectedStringOutput": "HOMOSCEDASTICITY_ASSUMPTION_VALIDATED",
          "acceptableAnswers": [
            "HOMOSCEDASTICITY_ASSUMPTION_VALIDATED",
            "Homoscedasticity",
            "Constant variance"
          ],
          "primaryMisconceptionId": "MC_ANA_SIMPLE_LINEAR_REGRESSION_R_SQUARED_OLS",
          "diagnosisMap": {
            "HETERO": {
              "misconceptionId": "MC_ANA_SIMPLE_LINEAR_REGRESSION_R_SQUARED_OLS",
              "errorExplanation": "Heteroscedasticity is non-constant variance. Constant variance is Homoscedasticity.",
              "recoveryPath": {
                "simplerExplanation": "Matches HOMOSCEDASTICITY_ASSUMPTION_VALIDATED.",
                "guidedFixPrompt": "Type HOMOSCEDASTICITY_ASSUMPTION_VALIDATED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Multiple Linear Regression & Multicollinearity (VIF)",
    "overviewMetaphor": "Multiple Regression is a Symphony Orchestra Where Each Instrument Adds Its Own Unique Melody: if you predict Hotel Revenue using Ad Spend ($X_1$), Room Price ($X_2$), and Seasonality ($X_3$), Multiple Regression measures the unique standalone impact of each variable; but if two musicians play the exact same notes in unison (Multicollinearity: e.g. TV Ad Spend and Total Marketing Spend), the conductor cannot tell who is making the music—causing the Variance Inflation Factor ($VIF > 5.0$) to blow up the regression coefficients.",
    "blocks": [
      {
        "id": "ana-d10-b1-multiple-regression-adjusted-r2",
        "day": 10,
        "blockNumber": 1,
        "title": "Multiple Regression Equation & Adjusted $R^2$ Penalty",
        "conceptBudget": {
          "primaryConcept": "Adjusted R-Squared Formula",
          "supportingTerms": [
            "$Y = \\beta_0 + \\beta_1 X_1 + \\beta_2 X_2 + \\dots + \\beta_k X_k$",
            "$R^2_{\\text{adj}} = 1 - \\left[\\frac{(1 - R^2)(n - 1)}{n - k - 1}\\right]$",
            "Penalizes adding useless junk features to prevent overfitting"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d9-b2-coefficient-of-determination-r-squared",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "R2 vs Adjusted R2 ($R^2=0.85, n=100, k=3$ Features)",
              "boxes": [
                {
                  "label": "Raw R-Squared",
                  "value": "R^2 = 0.8500 (Always increases when adding new features, even noise!)",
                  "varType": "Raw R2",
                  "isUpdated": false
                },
                {
                  "label": "Degrees of Freedom Correction",
                  "value": "(1 - 0.85) x (99 / 96) = 0.15 x 1.03125 = 0.1547",
                  "varType": "Penalty Factor",
                  "isUpdated": false
                },
                {
                  "label": "Adjusted R-Squared",
                  "value": "1 - 0.1547 = 0.8453 (True parsimonious model explanatory power!)",
                  "varType": "Adjusted R2",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "adj_r2_demo.js",
            "initialCode": "function calculateAdjustedR2(r2, n, k) {\n  const adjR2 = 1 - ((1 - r2) * (n - 1)) / (n - k - 1);\n  return {\n    rawRSquared: r2,\n    sampleSize: n,\n    featureCount: k,\n    adjustedRSquared: Number(adjR2.toFixed(4)),\n    status: 'ADJUSTED_R2_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateAdjustedR2(0.85, 100, 3)));",
            "expectedOutput": "{\"rawRSquared\":0.85,\"sampleSize\":100,\"featureCount\":3,\"adjustedRSquared\":0.8453,\"status\":\"ADJUSTED_R2_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Adjusted $R^2$ for a multiple regression model with $R^2 = 0.85$, sample size $n = 100$, and $k = 3$ independent features ($1 - \\frac{0.15 \\times 99}{96}$)?",
          "expectedStringOutput": "0.8453",
          "acceptableAnswers": [
            "0.8453",
            "adjustedRSquared\":0.8453"
          ],
          "primaryMisconceptionId": "MC_ANA_MULTIPLE_REGRESSION_MULTICOLLINEARITY_VIF",
          "diagnosisMap": {
            "0.8500": {
              "misconceptionId": "MC_ANA_MULTIPLE_REGRESSION_MULTICOLLINEARITY_VIF",
              "errorExplanation": "0.8500 is raw R2. Adjusted R2 applies degrees-of-freedom penalty = 0.8453.",
              "recoveryPath": {
                "simplerExplanation": "1 - (0.15 * 99 / 96) = 0.8453.",
                "guidedFixPrompt": "Type 0.8453"
              }
            }
          }
        }
      },
      {
        "id": "ana-d10-b2-variance-inflation-factor-vif",
        "day": 10,
        "blockNumber": 2,
        "title": "Multicollinearity Diagnosis: Variance Inflation Factor ($VIF = \\frac{1}{1 - R_i^2}$)",
        "conceptBudget": {
          "primaryConcept": "Variance Inflation Factor (VIF)",
          "supportingTerms": [
            "$VIF = \\frac{1}{1 - R_i^2}$ where $R_i^2$ is the regression of feature $X_i$ on all other features",
            "$VIF = 1.0$ (Zero collinearity)",
            "$VIF > 5.0$ (Severe Multicollinearity $\\implies$ Unstable coefficients, drop or combine features!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d10-b1-multiple-regression-adjusted-r2",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "VIF Danger Zone Calculation ($R_i^2 = 0.80$)",
            "codeSnippet": "R_i^2 = 0.80 (Feature X1 is 80% redundant with X2!)\nVIF = 1 / (1 - 0.80) = 1 / 0.20 = 5.00\nThreshold: VIF >= 5.0 -> SEVERE MULTICOLLINEARITY DETECTED -> REMOVE REDUNDANT FEATURE!",
            "lineNotes": {
              "1": "Feature correlation with peers.",
              "2": "VIF calculation.",
              "3": "Actionable decision."
            }
          },
          {
            "type": "runnable_code",
            "filename": "vif_calc_demo.js",
            "initialCode": "function calculateVif(featureR2) {\n  const vif = 1 / (1 - featureR2);\n  return {\n    featureR2,\n    vifValue: Number(vif.toFixed(2)),\n    isSevereCollinearity: vif >= 5.0,\n    status: 'VIF_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateVif(0.80)));\nconsole.log(JSON.stringify(calculateVif(0.50)));",
            "expectedOutput": "{\"featureR2\":0.8,\"vifValue\":5,\"isSevereCollinearity\":true,\"status\":\"VIF_COMPUTED\"}\n{\"featureR2\":0.5,\"vifValue\":2,\"isSevereCollinearity\":false,\"status\":\"VIF_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Variance Inflation Factor (VIF) when an independent feature has an $R_i^2 = 0.80$ against other features in the model ($1 / (1 - 0.80)$)?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "5.0",
            "5.00",
            "vifValue\":5"
          ],
          "primaryMisconceptionId": "MC_ANA_MULTIPLE_REGRESSION_MULTICOLLINEARITY_VIF",
          "diagnosisMap": {
            "0.20": {
              "misconceptionId": "MC_ANA_MULTIPLE_REGRESSION_MULTICOLLINEARITY_VIF",
              "errorExplanation": "0.20 is tolerance (1 - R2). VIF is 1 / Tolerance = 1 / 0.20 = 5.0.",
              "recoveryPath": {
                "simplerExplanation": "1 / (1 - 0.80) = 5.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      },
      {
        "id": "ana-d10-b3-dummy-variables-n-minus-1",
        "day": 10,
        "blockNumber": 3,
        "title": "Categorical Features & The Dummy Variable Trap ($k - 1$ Encoding)",
        "conceptBudget": {
          "primaryConcept": "Dummy Variable Encoding Invariant",
          "supportingTerms": [
            "For a categorical feature with $k$ distinct categories, create exactly $k - 1$ binary dummy columns",
            "Base / Reference Category",
            "The Dummy Variable Trap: Including all $k$ columns creates perfect multicollinearity (singular matrix invert error!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d10-b2-variance-inflation-factor-vif",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dummy_demo.js",
            "initialCode": "function getDummyColumnCount(categoryCount) {\n  return categoryCount - 1;\n}\n\nconsole.log(getDummyColumnCount(4)); // 4 regions (North, South, East, West) -> 3 dummy columns!",
            "expectedOutput": "3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many binary dummy variables must be created in a multiple regression model to encode a categorical feature with 4 geographic regions to avoid the Dummy Variable Trap ($4 - 1$)?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "3 columns",
            "k - 1 = 3"
          ],
          "primaryMisconceptionId": "MC_ANA_MULTIPLE_REGRESSION_MULTICOLLINEARITY_VIF",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_ANA_MULTIPLE_REGRESSION_MULTICOLLINEARITY_VIF",
              "errorExplanation": "Including all 4 categories causes the Dummy Variable Trap (perfect multicollinearity). Must use k - 1 = 3.",
              "recoveryPath": {
                "simplerExplanation": "4 - 1 = 3 dummy columns.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Classification & Logistic Regression: Sigmoid, Odds Ratios & Churn Probability",
    "overviewMetaphor": "Logistic Regression is an S-Shaped Probability Ramp: standard linear regression would predict impossible values like '+150% probability' or '-30% chance of buying'; Logistic Regression bends the line into a smooth S-shaped Sigmoid curve ($P = \\frac{1}{1 + e^{-z}}$) that squashes any input between 0.0% and 100.0%; if customer churn probability exceeds 50%, the retention team immediately triggers a discount coupon intervention.",
    "blocks": [
      {
        "id": "ana-d11-b1-logistic-sigmoid-activation",
        "day": 11,
        "blockNumber": 1,
        "title": "The Logistic Function (Sigmoid): $P(Y=1) = \\frac{1}{1 + e^{-z}}$",
        "conceptBudget": {
          "primaryConcept": "Logistic Sigmoid Function",
          "supportingTerms": [
            "$z = \\beta_0 + \\beta_1 X_1 + \\dots$",
            "$P(Y=1) = \\frac{1}{1 + e^{-z}}$",
            "Probability range strictly bounded in $[0.0, 1.0]$",
            "Decision threshold (Default = 0.50)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d9-b1-ols-regression-line-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Sigmoid S-Curve Mapping ($z = -2.0 + 0.05 \\times 60 = +1.00$)",
              "boxes": [
                {
                  "label": "Log-Odds Score z",
                  "value": "z = +1.00 (Customer support ticket count = 60)",
                  "varType": "Log-Odds",
                  "isUpdated": false
                },
                {
                  "label": "Sigmoid Exponential",
                  "value": "e^-z = e^-1.0 = 0.367879",
                  "varType": "Exp Term",
                  "isUpdated": false
                },
                {
                  "label": "Predicted Churn Probability",
                  "value": "P = 1 / (1 + 0.367879) = 1 / 1.367879 = 0.7311 (73.11% Churn Risk!)",
                  "varType": "Probability",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sigmoid_calc_demo.js",
            "initialCode": "function calculateLogisticProb(b0, b1, x) {\n  const z = b0 + b1 * x;\n  const prob = 1 / (1 + Math.exp(-z));\n  return {\n    zScore: Number(z.toFixed(2)),\n    predictedProbability: Number(prob.toFixed(4)),\n    probabilityPercent: Number((prob * 100).toFixed(2)),\n    status: 'LOGISTIC_PROBABILITY_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateLogisticProb(-2.0, 0.05, 60)));",
            "expectedOutput": "{\"zScore\":1,\"predictedProbability\":0.7311,\"probabilityPercent\":73.11,\"status\":\"LOGISTIC_PROBABILITY_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the predicted churn probability for a customer when the logistic log-odds $z = +1.00$ ($1 / (1 + e^{-1})$)?",
          "expectedStringOutput": "0.7311",
          "acceptableAnswers": [
            "0.7311",
            "73.11%",
            "predictedProbability\":0.7311"
          ],
          "primaryMisconceptionId": "MC_ANA_LOGISTIC_REGRESSION_ODDS_RATIO_SIGMOID",
          "diagnosisMap": {
            "1.0": {
              "misconceptionId": "MC_ANA_LOGISTIC_REGRESSION_ODDS_RATIO_SIGMOID",
              "errorExplanation": "1.0 is the log-odds z. Sigmoid squashes z to probability = 1 / (1 + e^-1) = 0.7311.",
              "recoveryPath": {
                "simplerExplanation": "1 / (1 + exp(-1)) = 0.7311.",
                "guidedFixPrompt": "Type 0.7311"
              }
            }
          }
        }
      },
      {
        "id": "ana-d11-b2-odds-ratios-and-logit",
        "day": 11,
        "blockNumber": 2,
        "title": "Odds & Odds Ratios: The Logit Transformation ($\\ln\\left(\\frac{p}{1 - p}\\right)$)",
        "conceptBudget": {
          "primaryConcept": "Odds Ratios & Logit Transformation",
          "supportingTerms": [
            "$\\text{Odds} = \\frac{p}{1 - p}$",
            "Log-Odds / Logit: $\\ln\\left(\\frac{p}{1 - p}\\right) = \\beta_0 + \\beta_1 X$",
            "Odds Ratio ($OR = e^{\\beta_1}$: Multiplicative increase in odds of success for each 1-unit increase in $X$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d11-b1-logistic-sigmoid-activation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Odds Ratio Interpretation ($\\beta_1 = 0.693$)",
            "codeSnippet": "Coefficient Beta1 = 0.693\nOdds Ratio OR = exp(0.693) = 2.00\nInterpretation: Each 1-unit increase in feature doubles the odds of conversion!",
            "lineNotes": {
              "1": "Log-odds coefficient.",
              "2": "Odds ratio multiplier.",
              "3": "Business explanation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "odds_demo.js",
            "initialCode": "function calculateOddsRatio(beta1) {\n  const orVal = Math.exp(beta1);\n  return {\n    beta1Coefficient: beta1,\n    oddsRatio: Number(orVal.toFixed(2)),\n    status: 'ODDS_RATIO_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateOddsRatio(0.693147)));",
            "expectedOutput": "{\"beta1Coefficient\":0.693147,\"oddsRatio\":2,\"status\":\"ODDS_RATIO_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Odds Ratio ($OR$) when the logistic regression coefficient $\\beta_1 = 0.693147$ ($e^{0.693147}$)?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2.0",
            "2.00",
            "oddsRatio\":2"
          ],
          "primaryMisconceptionId": "MC_ANA_LOGISTIC_REGRESSION_ODDS_RATIO_SIGMOID",
          "diagnosisMap": {
            "0.693": {
              "misconceptionId": "MC_ANA_LOGISTIC_REGRESSION_ODDS_RATIO_SIGMOID",
              "errorExplanation": "0.693 is the log-odds. Odds ratio exponentiates beta: exp(0.693) = 2.0.",
              "recoveryPath": {
                "simplerExplanation": "exp(0.693147) = 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "ana-d11-b3-binary-classification-thresholding",
        "day": 11,
        "blockNumber": 3,
        "title": "Decision Threshold Optimization (Tuning Beyond 0.50)",
        "conceptBudget": {
          "primaryConcept": "Classification Threshold Tuning",
          "supportingTerms": [
            "Default threshold = 0.50",
            "Lowering threshold (e.g. 0.30) catches more high-risk fraud cases (High Recall)",
            "Raising threshold (e.g. 0.70) reduces false alarms (High Precision)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d11-b2-odds-ratios-and-logit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "threshold_demo.js",
            "initialCode": "function classifyWithThreshold(prob, threshold = 0.5) {\n  return prob >= threshold ? 'POSITIVE_CLASS_1' : 'NEGATIVE_CLASS_0';\n}\n\nconsole.log(classifyWithThreshold(0.60, 0.50));\nconsole.log(classifyWithThreshold(0.40, 0.50));\nconsole.log(classifyWithThreshold(0.40, 0.30)); // Lower threshold catches it!",
            "expectedOutput": "POSITIVE_CLASS_1\nNEGATIVE_CLASS_0\nPOSITIVE_CLASS_1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When the decision threshold is lowered to 0.30 for fraud prevention, how is a transaction with 0.40 predicted fraud probability classified?",
          "expectedStringOutput": "POSITIVE_CLASS_1",
          "acceptableAnswers": [
            "POSITIVE_CLASS_1",
            "Class 1",
            "Positive Class"
          ],
          "primaryMisconceptionId": "MC_ANA_LOGISTIC_REGRESSION_ODDS_RATIO_SIGMOID",
          "diagnosisMap": {
            "NEGATIVE": {
              "misconceptionId": "MC_ANA_LOGISTIC_REGRESSION_ODDS_RATIO_SIGMOID",
              "errorExplanation": "Since 0.40 >= 0.30, it is classified as POSITIVE_CLASS_1.",
              "recoveryPath": {
                "simplerExplanation": "0.40 >= 0.30 threshold -> POSITIVE_CLASS_1.",
                "guidedFixPrompt": "Type POSITIVE_CLASS_1"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Classification Metrics: Confusion Matrix, Precision, Recall & F1-Score",
    "overviewMetaphor": "The Confusion Matrix is the Airport Security Metal Detector Scorecard: True Positives ($TP = 80$) are real weapons successfully detected; False Positives ($FP = 20$) are metal belt buckles that trigger false alarms; False Negatives ($FN = 10$) are smuggled weapons that slip through undetected (disastrous!); Precision measures 'When the alarm beeps, how likely is it a real weapon?'; Recall measures 'What percentage of all real weapons did we catch?'; F1-Score blends both into a single harmonic balance.",
    "blocks": [
      {
        "id": "ana-d12-b1-confusion-matrix-architecture",
        "day": 12,
        "blockNumber": 1,
        "title": "Confusion Matrix 2x2 Grid: TP, FP, FN & TN",
        "conceptBudget": {
          "primaryConcept": "Confusion Matrix 2x2 Grid",
          "supportingTerms": [
            "True Positive (TP: Correctly predicted positive)",
            "False Positive (FP: Type I Error / False alarm)",
            "False Negative (FN: Type II Error / Missed detection)",
            "True Negative (TN: Correctly predicted negative)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d11-b1-logistic-sigmoid-activation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Confusion Matrix Layout ($TP=80, FP=20, FN=10, TN=90$)",
              "boxes": [
                {
                  "label": "Predicted Positive (100 Total)",
                  "value": "TP = 80 (True Hits) | FP = 20 (False Alarms)",
                  "varType": "Positive Column",
                  "isUpdated": false
                },
                {
                  "label": "Predicted Negative (100 Total)",
                  "value": "FN = 10 (Misses) | TN = 90 (True Rejections)",
                  "varType": "Negative Column",
                  "isUpdated": false
                },
                {
                  "label": "Overall Accuracy",
                  "value": "(80 + 90) / 200 = 170 / 200 = 85.00% Accuracy!",
                  "varType": "Accuracy",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cm_calc_demo.js",
            "initialCode": "function evaluateAccuracy(tp, fp, fn, tn) {\n  const total = tp + fp + fn + tn;\n  const acc = (tp + tn) / total;\n  return {\n    totalRecords: total,\n    accuracyPercent: Number((acc * 100).toFixed(2)),\n    status: 'ACCURACY_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateAccuracy(80, 20, 10, 90)));",
            "expectedOutput": "{\"totalRecords\":200,\"accuracyPercent\":85,\"status\":\"ACCURACY_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the classification accuracy percentage for a confusion matrix with $TP=80, FP=20, FN=10, TN=90$ ($ (80 + 90) / 200 \\times 100 $)?",
          "expectedStringOutput": "85",
          "acceptableAnswers": [
            "85",
            "85%",
            "85.0",
            "accuracyPercent\":85"
          ],
          "primaryMisconceptionId": "MC_ANA_CLASSIFICATION_METRICS_PRECISION_RECALL_F1_ROC",
          "diagnosisMap": {
            "80": {
              "misconceptionId": "MC_ANA_CLASSIFICATION_METRICS_PRECISION_RECALL_F1_ROC",
              "errorExplanation": "80 is TP. Total correct is TP + TN = 80 + 90 = 170. 170 / 200 = 85%.",
              "recoveryPath": {
                "simplerExplanation": "170 / 200 = 85%.",
                "guidedFixPrompt": "Type 85"
              }
            }
          }
        }
      },
      {
        "id": "ana-d12-b2-precision-recall-tradeoff",
        "day": 12,
        "blockNumber": 2,
        "title": "Precision vs Recall (Sensitivity): The Fundamental Trade-Off",
        "conceptBudget": {
          "primaryConcept": "Precision vs Recall Formulas",
          "supportingTerms": [
            "$\\text{Precision} = \\frac{TP}{TP + FP}$ (Quality of positive predictions / Minimizing false alarms)",
            "$\\text{Recall} = \\frac{TP}{TP + FN}$ (Completeness / Minimizing missed frauds)",
            "Precision-Recall Trade-off Curve"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d12-b1-confusion-matrix-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Precision & Recall Math ($TP=80, FP=20, FN=10$)",
            "codeSnippet": "Precision = TP / (TP + FP) = 80 / (80 + 20) = 80 / 100 = 0.80 (80% Precision)\nRecall    = TP / (TP + FN) = 80 / (80 + 10) = 80 / 90  = 0.8889 (88.89% Recall)",
            "lineNotes": {
              "1": "Positive predictive value.",
              "2": "Sensitivity rate."
            }
          },
          {
            "type": "runnable_code",
            "filename": "prec_rec_demo.js",
            "initialCode": "function calculatePrecisionRecall(tp, fp, fn) {\n  const p = tp / (tp + fp);\n  const r = tp / (tp + fn);\n  return {\n    precision: Number(p.toFixed(4)),\n    recall: Number(r.toFixed(4)),\n    status: 'PRECISION_RECALL_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculatePrecisionRecall(80, 20, 10)));",
            "expectedOutput": "{\"precision\":0.8,\"recall\":0.8889,\"status\":\"PRECISION_RECALL_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Precision for a model with $TP = 80$ and $FP = 20$ ($80 / (80 + 20)$)?",
          "expectedStringOutput": "0.8",
          "acceptableAnswers": [
            "0.8",
            "0.80",
            "80%",
            "precision\":0.8"
          ],
          "primaryMisconceptionId": "MC_ANA_CLASSIFICATION_METRICS_PRECISION_RECALL_F1_ROC",
          "diagnosisMap": {
            "0.8889": {
              "misconceptionId": "MC_ANA_CLASSIFICATION_METRICS_PRECISION_RECALL_F1_ROC",
              "errorExplanation": "0.8889 is Recall (80/90). Precision is 80/100 = 0.80.",
              "recoveryPath": {
                "simplerExplanation": "80 / 100 = 0.80.",
                "guidedFixPrompt": "Type 0.8"
              }
            }
          }
        }
      },
      {
        "id": "ana-d12-b3-f1-score-harmonic-mean",
        "day": 12,
        "blockNumber": 3,
        "title": "The F1-Score: Harmonic Mean of Precision and Recall ($F_1 = 2 \\times \\frac{P \\times R}{P + R}$)",
        "conceptBudget": {
          "primaryConcept": "F1-Score Harmonic Mean Formula",
          "supportingTerms": [
            "$F_1 = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}$",
            "Harmonic mean severely penalizes extreme imbalances (e.g. if Recall is 0.01, F1 collapses to ~0)",
            "Macro vs Weighted F1 in imbalanced multi-class problems"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d12-b2-precision-recall-tradeoff",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "f1_calc_demo.js",
            "initialCode": "function calculateF1(p, r) {\n  const f1 = (2 * p * r) / (p + r);\n  return {\n    precision: p,\n    recall: r,\n    f1Score: Number(f1.toFixed(4)),\n    status: 'F1_SCORE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateF1(0.80, 0.888889)));",
            "expectedOutput": "{\"precision\":0.8,\"recall\":0.888889,\"f1Score\":0.8421,\"status\":\"F1_SCORE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the F1-Score when Precision is 0.80 and Recall is 0.8889 ($ (2 \\times 0.80 \\times 0.8889) / (0.80 + 0.8889) $)?",
          "expectedStringOutput": "0.8421",
          "acceptableAnswers": [
            "0.8421",
            "f1Score\":0.8421"
          ],
          "primaryMisconceptionId": "MC_ANA_CLASSIFICATION_METRICS_PRECISION_RECALL_F1_ROC",
          "diagnosisMap": {
            "0.8444": {
              "misconceptionId": "MC_ANA_CLASSIFICATION_METRICS_PRECISION_RECALL_F1_ROC",
              "errorExplanation": "0.8444 is arithmetic mean. F1 is harmonic mean = 0.8421.",
              "recoveryPath": {
                "simplerExplanation": "2 * 0.8 * 0.8889 / 1.6889 = 0.8421.",
                "guidedFixPrompt": "Type 0.8421"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Customer Analytics: RFM Segmentation (Recency, Frequency, Monetary)",
    "overviewMetaphor": "RFM Segmentation is Sorting Your Customer Base into Strategic Treasure Chests: Recency ($R$) measures how fresh their footprint is (bought yesterday vs 1 year ago); Frequency ($F$) measures how habituated they are (12 orders vs 1 order); Monetary ($M$) measures their gold spend ($1,500 vs $20); an RFM score of 555 marks your Champions (shower them with VIP perks); an RFM score of 133 marks your At Risk customers (send an urgent win-back discount before they churn forever).",
    "blocks": [
      {
        "id": "ana-d13-b1-rfm-scoring-methodology",
        "day": 13,
        "blockNumber": 1,
        "title": "RFM Scoring Architecture: Quintiles (1-5) & Composite Codes",
        "conceptBudget": {
          "primaryConcept": "RFM Scoring Architecture",
          "supportingTerms": [
            "Recency (Days since last purchase: Lower days $\\implies$ Higher score 5)",
            "Frequency (Number of distinct transactions: Higher count $\\implies$ Higher score 5)",
            "Monetary (Total revenue spend: Higher spend $\\implies$ Higher score 5)",
            "Composite 3-Digit Code (e.g. 555, 155, 111)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d12-b1-confusion-matrix-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "RFM Scoring Breakdown (VIP Customer)",
              "boxes": [
                {
                  "label": "Recency (15 Days Ago)",
                  "value": "Score = 5 / 5 (Bought within last 30 days)",
                  "varType": "Recency",
                  "isUpdated": false
                },
                {
                  "label": "Frequency (12 Orders)",
                  "value": "Score = 5 / 5 (Placed >= 10 orders)",
                  "varType": "Frequency",
                  "isUpdated": false
                },
                {
                  "label": "Monetary ($1,500 Spent)",
                  "value": "Score = 5 / 5 (Spent >= $1,000 total)",
                  "varType": "Monetary",
                  "isUpdated": false
                },
                {
                  "label": "Composite RFM Code",
                  "value": "Code = '555' -> CHAMPION HIGH-VALUE VIP CUSTOMER!",
                  "varType": "RFM Code",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "rfm_calc_demo.js",
            "initialCode": "function scoreRfm(rDays, freq, spend) {\n  const r = rDays <= 30 ? 5 : (rDays <= 90 ? 3 : 1);\n  const f = freq >= 10 ? 5 : (freq >= 4 ? 3 : 1);\n  const m = spend >= 1000 ? 5 : (spend >= 300 ? 3 : 1);\n  return {\n    recencyScore: r,\n    frequencyScore: f,\n    monetaryScore: m,\n    compositeRfm: `${r}${f}${m}`,\n    status: 'RFM_SCORED'\n  };\n}\n\nconsole.log(JSON.stringify(scoreRfm(15, 12, 1500)));\nconsole.log(JSON.stringify(scoreRfm(120, 6, 400)));",
            "expectedOutput": "{\"recencyScore\":5,\"frequencyScore\":5,\"monetaryScore\":5,\"compositeRfm\":\"555\",\"status\":\"RFM_SCORED\"}\n{\"recencyScore\":1,\"frequencyScore\":3,\"monetaryScore\":3,\"compositeRfm\":\"133\",\"status\":\"RFM_SCORED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the 3-digit composite RFM code for a customer who purchased 15 days ago (R=5), placed 12 orders (F=5), and spent $1,500 (M=5)?",
          "expectedStringOutput": "555",
          "acceptableAnswers": [
            "555",
            "compositeRfm\":\"555\""
          ],
          "primaryMisconceptionId": "MC_ANA_CUSTOMER_RFM_SEGMENTATION_ANALYSIS",
          "diagnosisMap": {
            "111": {
              "misconceptionId": "MC_ANA_CUSTOMER_RFM_SEGMENTATION_ANALYSIS",
              "errorExplanation": "111 is a lost low-value customer. High activity gets score 555.",
              "recoveryPath": {
                "simplerExplanation": "Top quintile across all 3 metrics is 555.",
                "guidedFixPrompt": "Type 555"
              }
            }
          }
        }
      },
      {
        "id": "ana-d13-b2-customer-segment-action-grid",
        "day": 13,
        "blockNumber": 2,
        "title": "Actionable RFM Segments: Champions, Loyal, At Risk & Lost",
        "conceptBudget": {
          "primaryConcept": "RFM Marketing Action Grid",
          "supportingTerms": [
            "Champions (555, 554: Reward with loyalty perks and early access)",
            "Loyal Customers (X4X: Upsell higher value products)",
            "At Risk (14X, 15X: High value in past, but haven't purchased recently $\\implies$ Win-back discount campaign!)",
            "Lost (111: Low margin, minimal marketing spend)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d13-b1-rfm-scoring-methodology",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "RFM Segment Strategy Matrix",
            "codeSnippet": "// 555 -> CHAMPIONS (Reward loyalty, request reviews, zero discounts needed)\n// 511 -> NEW CUSTOMERS (Onboarding sequences, welcome incentives)\n// 155 -> CANNOT LOSE THEM (Aggressive phone/email win-back offers)\n// 111 -> LOST (Do not waste expensive paid acquisition budget)",
            "lineNotes": {
              "1": "High value brand ambassadors.",
              "3": "Crucial lapsed VIPs.",
              "4": "Discontinued churned accounts."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rfm_actions_demo.js",
            "initialCode": "function getRfmMarketingAction(rfmCode) {\n  if (rfmCode === '555') return 'VIP_LOYALTY_PERKS_NO_DISCOUNT';\n  if (rfmCode === '155' || rfmCode === '133') return 'URGENT_WIN_BACK_REENGAGEMENT_CAMPAIGN';\n  return 'STANDARD_NEWSLETTER_PROMOTIONS';\n}\n\nconsole.log(getRfmMarketingAction('555'));\nconsole.log(getRfmMarketingAction('155'));",
            "expectedOutput": "VIP_LOYALTY_PERKS_NO_DISCOUNT\nURGENT_WIN_BACK_REENGAGEMENT_CAMPAIGN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What strategic marketing action should be deployed for customers in the 'At Risk / Cannot Lose Them' segment with RFM code 155 (Lapsed high-spenders)?",
          "expectedStringOutput": "URGENT_WIN_BACK_REENGAGEMENT_CAMPAIGN",
          "acceptableAnswers": [
            "URGENT_WIN_BACK_REENGAGEMENT_CAMPAIGN",
            "Win-Back Campaign",
            "Reengagement Campaign"
          ],
          "primaryMisconceptionId": "MC_ANA_CUSTOMER_RFM_SEGMENTATION_ANALYSIS",
          "diagnosisMap": {
            "IGNORE": {
              "misconceptionId": "MC_ANA_CUSTOMER_RFM_SEGMENTATION_ANALYSIS",
              "errorExplanation": "155 customers spent massive money in the past. They require an urgent win-back campaign.",
              "recoveryPath": {
                "simplerExplanation": "Deploy urgent win-back campaign.",
                "guidedFixPrompt": "Type URGENT_WIN_BACK_REENGAGEMENT_CAMPAIGN"
              }
            }
          }
        }
      },
      {
        "id": "ana-d13-b3-clv-rfm-integration",
        "day": 13,
        "blockNumber": 3,
        "title": "Monetary Value Weighting & Historical vs Predictive RFM",
        "conceptBudget": {
          "primaryConcept": "Predictive RFM Enhancements",
          "supportingTerms": [
            "Historical RFM (Past transaction behavior)",
            "Predictive RFM (Machine Learning projected customer value)",
            "Pareto 80/20 Rule: Top 20% of RFM segments generate 80% of corporate profits"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d13-b2-customer-segment-action-grid",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pareto_demo.js",
            "initialCode": "function evaluateParetoPrinciple() {\n  return 'TOP_20_PERCENT_OF_CUSTOMERS_GENERATE_80_PERCENT_OF_CORPORATE_REVENUE';\n}\n\nconsole.log(evaluateParetoPrinciple());",
            "expectedOutput": "TOP_20_PERCENT_OF_CUSTOMERS_GENERATE_80_PERCENT_OF_CORPORATE_REVENUE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "According to the Pareto 80/20 Principle in customer analytics, what percentage of corporate profits is typically generated by the top 20% of customers?",
          "expectedStringOutput": "80",
          "acceptableAnswers": [
            "80",
            "80%",
            "80 percent"
          ],
          "primaryMisconceptionId": "MC_ANA_CUSTOMER_RFM_SEGMENTATION_ANALYSIS",
          "diagnosisMap": {
            "20": {
              "misconceptionId": "MC_ANA_CUSTOMER_RFM_SEGMENTATION_ANALYSIS",
              "errorExplanation": "Top 20% generate 80% of profits (Pareto 80/20 rule).",
              "recoveryPath": {
                "simplerExplanation": "Generates 80% of profits.",
                "guidedFixPrompt": "Type 80"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Customer Lifetime Value (CLV) & Churn Rate Analytics",
    "overviewMetaphor": "Customer Lifetime Value (CLV) is the Net Lifetime Gold Nugget Yield of Every Customer: if a subscription customer pays $50/month with an 80% gross margin ($40 profit), and your monthly churn rate is 5% ($CR = 0.05$), the average customer stays for 20 months ($L = 1 / 0.05$)—yielding a Customer Lifetime Value of $800 ($CLV = 40 / 0.05$); if acquiring that customer costs $200 (CAC), your $CLV : CAC$ ratio is 4.0x—signaling a highly profitable, scalable business engine.",
    "blocks": [
      {
        "id": "ana-d14-b1-clv-equation-and-lifespan",
        "day": 14,
        "blockNumber": 1,
        "title": "Customer Lifetime Value Formula: $CLV = \\frac{\\text{ARPU} \\times \\text{Gross Margin}}{\\text{Churn Rate}}$",
        "conceptBudget": {
          "primaryConcept": "Customer Lifetime Value (CLV) Formula",
          "supportingTerms": [
            "$CLV = \\frac{\\text{ARPU} \\times GM}{CR}$",
            "ARPU (Average Revenue Per User per period)",
            "$GM$ (Gross Margin percentage)",
            "$CR$ (Monthly / Annual Churn Rate)",
            "Average Customer Lifespan: $L = \\frac{1}{CR}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d13-b1-rfm-scoring-methodology",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CLV Unit Economics Math (ARPU=$50, GM=80%, Churn=5%)",
              "boxes": [
                {
                  "label": "Monthly Gross Profit / User",
                  "value": "$50 ARPU x 0.80 Gross Margin = $40.00 profit/month",
                  "varType": "Margin",
                  "isUpdated": false
                },
                {
                  "label": "Expected Lifespan (1 / Churn)",
                  "value": "1 / 0.05 = 20.0 Months average retention",
                  "varType": "Lifespan",
                  "isUpdated": false
                },
                {
                  "label": "Customer Lifetime Value (CLV)",
                  "value": "$40.00 / 0.05 = $40 x 20 = EXACTLY $800.00 CLV!",
                  "varType": "CLV Result",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "clv_calc_demo.js",
            "initialCode": "function calculateClv(arpu, gmPct, churnPct) {\n  const gm = gmPct / 100;\n  const churn = churnPct / 100;\n  const lifespan = 1 / churn;\n  const clv = (arpu * gm) / churn;\n  return {\n    averageLifespanMonths: Number(lifespan.toFixed(1)),\n    customerLifetimeValue: Number(clv.toFixed(2)),\n    status: 'CLV_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateClv(50, 80, 5)));",
            "expectedOutput": "{\"averageLifespanMonths\":20,\"customerLifetimeValue\":800,\"status\":\"CLV_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Customer Lifetime Value ($CLV$) when monthly ARPU is $50, Gross Margin is 80%, and monthly churn rate is 5% ($ (50 \\times 0.80) / 0.05 $)?",
          "expectedStringOutput": "800",
          "acceptableAnswers": [
            "800",
            "$800",
            "800.0",
            "customerLifetimeValue\":800"
          ],
          "primaryMisconceptionId": "MC_ANA_CUSTOMER_LIFETIME_VALUE_CLV_CHURN",
          "diagnosisMap": {
            "1000": {
              "misconceptionId": "MC_ANA_CUSTOMER_LIFETIME_VALUE_CLV_CHURN",
              "errorExplanation": "$1,000 forgets gross margin (50/0.05). Net profit CLV is ($50 * 0.80) / 0.05 = $800.",
              "recoveryPath": {
                "simplerExplanation": "40 / 0.05 = 800.",
                "guidedFixPrompt": "Type 800"
              }
            }
          }
        }
      },
      {
        "id": "ana-d14-b2-clv-cac-ratio-benchmark",
        "day": 14,
        "blockNumber": 2,
        "title": "Unit Economics Health: The $CLV : CAC \\ge 3.0$ Golden Benchmark",
        "conceptBudget": {
          "primaryConcept": "CLV to CAC Ratio Benchmark",
          "supportingTerms": [
            "$\\text{CLV : CAC Ratio} = \\frac{CLV}{CAC}$",
            "$< 1.0x$: Burning money on acquisition (Bankruptcy track!)",
            "$1.0x - 3.0x$: Marginal / Unprofitable after overhead",
            "$\\ge 3.0x$: Healthy scalable venture benchmark!"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d14-b1-clv-equation-and-lifespan",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CLV/CAC Ratio Economics",
            "codeSnippet": "CLV = $800 | Customer Acquisition Cost CAC = $200\nCLV / CAC Ratio = 800 / 200 = 4.0x\nBenchmark Evaluation: 4.0x >= 3.0x -> HEALTHY SCALABLE BUSINESS MODEL!",
            "lineNotes": {
              "1": "Lifetime profit vs acquisition spend.",
              "2": "Unit economics multiple.",
              "3": "Venture scale validation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "cac_ratio_demo.js",
            "initialCode": "function evaluateUnitEconomics(clv, cac) {\n  const ratio = clv / cac;\n  const isHealthy = ratio >= 3.0;\n  return {\n    clvToCacRatio: Number(ratio.toFixed(2)),\n    isHealthy,\n    recommendation: isHealthy ? 'EXPAND_MARKETING_SPEND_SCALABLE' : 'FIX_CHURN_OR_LOWER_CAC_BEFORE_SCALING',\n    status: 'UNIT_ECONOMICS_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateUnitEconomics(800, 200)));\nconsole.log(JSON.stringify(evaluateUnitEconomics(400, 200)));",
            "expectedOutput": "{\"clvToCacRatio\":4,\"isHealthy\":true,\"recommendation\":\"EXPAND_MARKETING_SPEND_SCALABLE\",\"status\":\"UNIT_ECONOMICS_EVALUATED\"}\n{\"clvToCacRatio\":2,\"isHealthy\":false,\"recommendation\":\"FIX_CHURN_OR_LOWER_CAC_BEFORE_SCALING\",\"status\":\"UNIT_ECONOMICS_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the CLV to CAC ratio for a company with $800 CLV and $200 CAC ($800 / 200$)?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "4.0",
            "4.0x",
            "clvToCacRatio\":4"
          ],
          "primaryMisconceptionId": "MC_ANA_CUSTOMER_LIFETIME_VALUE_CLV_CHURN",
          "diagnosisMap": {
            "0.25": {
              "misconceptionId": "MC_ANA_CUSTOMER_LIFETIME_VALUE_CLV_CHURN",
              "errorExplanation": "Ratio is CLV / CAC = 800 / 200 = 4.0x.",
              "recoveryPath": {
                "simplerExplanation": "800 / 200 = 4.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "ana-d14-b3-cac-payback-period",
        "day": 14,
        "blockNumber": 3,
        "title": "CAC Payback Period: Cash Flow Recovery Speed",
        "conceptBudget": {
          "primaryConcept": "CAC Payback Period Formula",
          "supportingTerms": [
            "$\\text{CAC Payback (Months)} = \\frac{CAC}{\\text{Monthly ARPU} \\times \\text{Gross Margin}}$",
            "Target: $< 12 \\text{ Months}$ for capital-efficient SaaS growth"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d14-b2-clv-cac-ratio-benchmark",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cac_payback_demo.js",
            "initialCode": "function calculateCacPayback(cac, arpu, gmPct) {\n  const monthlyMargin = arpu * (gmPct / 100);\n  const paybackMonths = cac / monthlyMargin;\n  return {\n    cac,\n    monthlyGrossMargin: monthlyMargin,\n    cacPaybackMonths: Number(paybackMonths.toFixed(1)),\n    isCapitalEfficient: paybackMonths <= 12,\n    status: 'CAC_PAYBACK_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateCacPayback(200, 50, 80))); // 200 / 40 = 5.0 months",
            "expectedOutput": "{\"cac\":200,\"monthlyGrossMargin\":40,\"cacPaybackMonths\":5,\"isCapitalEfficient\":true,\"status\":\"CAC_PAYBACK_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many months does it take to recover customer acquisition cost when CAC is $200 and monthly gross profit is $40 ($200 / 40$)?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "5 months",
            "5.0",
            "cacPaybackMonths\":5"
          ],
          "primaryMisconceptionId": "MC_ANA_CUSTOMER_LIFETIME_VALUE_CLV_CHURN",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_ANA_CUSTOMER_LIFETIME_VALUE_CLV_CHURN",
              "errorExplanation": "200 / 40 = 5.0 months.",
              "recoveryPath": {
                "simplerExplanation": "200 / 40 = 5 months.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Predictive Analytics & Customer Intelligence Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete sovereign customer predictive intelligence and unit economics engine: 1. Multiple regression sales forecasting and VIF collinearity diagnostics; 2. Logistic regression churn probability classification; 3. RFM behavioral customer segmentation; 4. CLV, CAC payback, and unit economics viability modeling.",
    "blocks": [
      {
        "id": "ana-d15-b1-customer-intelligence-engine-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Predictive Analytics & Customer Intelligence Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Customer Intelligence Engine Synthesis",
          "supportingTerms": [
            "Regression Forecaster",
            "Logistic Classifier",
            "RFM Segmentation Engine",
            "CLV Unit Economics Modeler"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d14-b3-cac-payback-period",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 Predictive Customer Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Predicts customer churn probability via Logistic Sigmoid function ($P=73.1\\%$)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Segments accounts into RFM behavioral quintiles (555 VIP vs 155 At-Risk)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Computes Customer Lifetime Value ($800) and CLV:CAC unit economics (4.0x)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Certifies predictive customer intelligence engine for automated decisioning!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cust_intel_demo.js",
            "initialCode": "function runCustomerIntelligenceEngine() {\n  return {\n    regressionSubsystem: 'ONLINE_OLS_FORECASTING_ACTIVE',\n    logisticSubsystem: 'ONLINE_CHURN_CLASSIFIER_ACTIVE',\n    rfmSubsystem: 'ONLINE_RFM_SEGMENTATION_ACTIVE',\n    clvSubsystem: 'ONLINE_UNIT_ECONOMICS_ACTIVE',\n    engineStatus: 'CUSTOMER_PREDICTIVE_INTELLIGENCE_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runCustomerIntelligenceEngine().engineStatus);",
            "expectedOutput": "CUSTOMER_PREDICTIVE_INTELLIGENCE_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Customer Predictive Intelligence Master Engine?",
          "expectedStringOutput": "CUSTOMER_PREDICTIVE_INTELLIGENCE_MASTER_ACTIVE",
          "acceptableAnswers": [
            "CUSTOMER_PREDICTIVE_INTELLIGENCE_MASTER_ACTIVE",
            "engineStatus: CUSTOMER_PREDICTIVE_INTELLIGENCE_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_ANA_CUSTOMER_LIFETIME_VALUE_CLV_CHURN",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ANA_CUSTOMER_LIFETIME_VALUE_CLV_CHURN",
              "errorExplanation": "Matches CUSTOMER_PREDICTIVE_INTELLIGENCE_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type CUSTOMER_PREDICTIVE_INTELLIGENCE_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "ana-d15-b2-predictive-engine-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Predictive Intelligence Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Predictive Invariant Verification",
          "supportingTerms": [
            "Regression Invariant",
            "CLV Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d15-b1-customer-intelligence-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cust_audit_demo.js",
            "initialCode": "function auditCustomerIntelligenceSystem(regValid, logValid, rfmValid, clvValid) {\n  const passed = regValid && logValid && rfmValid && clvValid;\n  return {\n    regressionVerified: regValid,\n    logisticVerified: logValid,\n    rfmVerified: rfmValid,\n    clvVerified: clvValid,\n    grade: passed ? 'CUSTOMER_INTELLIGENCE_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditCustomerIntelligenceSystem(true, true, true, true)));",
            "expectedOutput": "{\"regressionVerified\":true,\"logisticVerified\":true,\"rfmVerified\":true,\"clvVerified\":true,\"grade\":\"CUSTOMER_INTELLIGENCE_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Regression, Logistic, RFM, and CLV engines pass 100%?",
          "expectedStringOutput": "CUSTOMER_INTELLIGENCE_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "CUSTOMER_INTELLIGENCE_ENGINE_AUDIT_PASSED",
            "grade\":\"CUSTOMER_INTELLIGENCE_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_ANA_CUSTOMER_LIFETIME_VALUE_CLV_CHURN",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ANA_CUSTOMER_LIFETIME_VALUE_CLV_CHURN",
              "errorExplanation": "All checks passing awards CUSTOMER_INTELLIGENCE_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards CUSTOMER_INTELLIGENCE_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type CUSTOMER_INTELLIGENCE_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "ana-d15-b3-milestone2-analytics-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Predictive Customer Intelligence Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Customer Intelligence Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d15-b2-predictive-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_ana_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Predictive Analytics & Customer Intelligence Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Predictive Analytics & Customer Intelligence Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Predictive Analytics & Customer Intelligence Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Predictive Analytics & Customer Intelligence Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_ANA_CUSTOMER_LIFETIME_VALUE_CLV_CHURN",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ANA_CUSTOMER_LIFETIME_VALUE_CLV_CHURN",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Predictive Analytics & Customer Intelligence Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Price Elasticity of Demand & Revenue Optimization",
    "overviewMetaphor": "Price Elasticity of Demand is the Stretchiness of a Rubber Band on Customer Wallets: if raising your product price by 10% causes customers to flee in terror, dropping demand by 20% ($E_d = -2.0$), your demand is Highly Elastic—raising prices destroyed total revenue; but if you sell life-saving insulin or enterprise ERP software where a 10% price hike causes only a tiny 2% drop in volume ($E_d = -0.2$), demand is Inelastic—raising prices effortlessly expands total revenue.",
    "blocks": [
      {
        "id": "ana-d16-b1-price-elasticity-formula",
        "day": 16,
        "blockNumber": 1,
        "title": "Price Elasticity of Demand Formula: $E_d = \\frac{\\% \\Delta Q}{\\% \\Delta P}$",
        "conceptBudget": {
          "primaryConcept": "Price Elasticity of Demand Formula",
          "supportingTerms": [
            "$E_d = \\frac{(Q_2 - Q_1) / Q_1}{(P_2 - P_1) / P_1}$",
            "Midpoint / Arc Elasticity Formula",
            "Elastic ($|E_d| > 1.0$)",
            "Inelastic ($|E_d| < 1.0$)",
            "Unitary ($|E_d| = 1.0$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d9-b1-ols-regression-line-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Price Elasticity Math (Price: $100 -> $110, Q: 1000 -> 800 units)",
              "boxes": [
                {
                  "label": "Percentage Price Change",
                  "value": "(110 - 100) / 100 = +10.0% Price Hike",
                  "varType": "Delta P",
                  "isUpdated": false
                },
                {
                  "label": "Percentage Quantity Change",
                  "value": "(800 - 1000) / 1000 = -20.0% Quantity Drop",
                  "varType": "Delta Q",
                  "isUpdated": false
                },
                {
                  "label": "Elasticity Coefficient",
                  "value": "Ed = -20.0% / +10.0% = -2.00 (|Ed| = 2.0 > 1.0 -> HIGHLY ELASTIC!)",
                  "varType": "Ed Result",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "elasticity_calc_demo.js",
            "initialCode": "function calculatePriceElasticity(p1, q1, p2, q2) {\n  const pctP = (p2 - p1) / p1;\n  const pctQ = (q2 - q1) / q1;\n  const ed = pctQ / pctP;\n  const absEd = Math.abs(ed);\n  let category = 'UNITARY_ELASTIC';\n  if (absEd > 1.0) category = 'ELASTIC_PRICE_SENSITIVE';\n  else if (absEd < 1.0) category = 'INELASTIC_PRICE_INSENSITIVE';\n  return {\n    priceChangePercent: Number((pctP * 100).toFixed(2)),\n    quantityChangePercent: Number((pctQ * 100).toFixed(2)),\n    elasticityCoefficient: Number(ed.toFixed(2)),\n    category,\n    status: 'ELASTICITY_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculatePriceElasticity(100, 1000, 110, 800)));",
            "expectedOutput": "{\"priceChangePercent\":10,\"quantityChangePercent\":-20,\"elasticityCoefficient\":-2,\"category\":\"ELASTIC_PRICE_SENSITIVE\",\"status\":\"ELASTICITY_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Price Elasticity of Demand ($E_d$) when a +10% price increase leads to a -20% decline in quantity demanded ($ -20\\% / +10\\% $)?",
          "expectedStringOutput": "-2",
          "acceptableAnswers": [
            "-2",
            "-2.0",
            "-2.00",
            "elasticityCoefficient\":-2"
          ],
          "primaryMisconceptionId": "MC_ANA_PRICE_ELASTICITY_DEMAND_DYNAMIC_PRICING",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_ANA_PRICE_ELASTICITY_DEMAND_DYNAMIC_PRICING",
              "errorExplanation": "2 is the absolute magnitude. In standard economics, price elasticity has a negative sign (-2.0).",
              "recoveryPath": {
                "simplerExplanation": "-20 / 10 = -2.",
                "guidedFixPrompt": "Type -2"
              }
            }
          }
        }
      },
      {
        "id": "ana-d16-b2-total-revenue-test-pricing-rules",
        "day": 16,
        "blockNumber": 2,
        "title": "The Total Revenue Test: Strategic Pricing Actions",
        "conceptBudget": {
          "primaryConcept": "Total Revenue Test Pricing Rules",
          "supportingTerms": [
            "Total Revenue: $TR = P \\times Q$",
            "Elastic Demand ($|E_d| > 1.0$): Lowering price expands Total Revenue! (Volume gain outweighs price drop)",
            "Inelastic Demand ($|E_d| < 1.0$): Raising price expands Total Revenue! (Price gain outweighs minor volume loss)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d16-b1-price-elasticity-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Total Revenue Test Rules",
            "codeSnippet": "// If |Ed| > 1 (Elastic)   -> LOWER Price to BOOST Total Revenue!\n// If |Ed| < 1 (Inelastic) -> RAISE Price to BOOST Total Revenue!\n// If |Ed| = 1 (Unitary)   -> MAINTAIN Price (Revenue is maximized at vertex!)",
            "lineNotes": {
              "1": "Elastic price cut expands revenue.",
              "2": "Inelastic price hike expands revenue.",
              "3": "Unitary revenue optimum."
            }
          },
          {
            "type": "runnable_code",
            "filename": "tr_test_demo.js",
            "initialCode": "function getOptimalPricingAction(ed) {\n  const absEd = Math.abs(ed);\n  if (absEd > 1.0) return 'LOWER_PRICE_TO_EXPAND_TOTAL_REVENUE';\n  if (absEd < 1.0) return 'RAISE_PRICE_TO_EXPAND_TOTAL_REVENUE';\n  return 'MAINTAIN_CURRENT_PRICE_AT_REVENUE_OPTIMUM';\n}\n\nconsole.log(getOptimalPricingAction(-0.4)); // Inelastic -> Raise price!\nconsole.log(getOptimalPricingAction(-2.5)); // Elastic -> Lower price!",
            "expectedOutput": "RAISE_PRICE_TO_EXPAND_TOTAL_REVENUE\nLOWER_PRICE_TO_EXPAND_TOTAL_REVENUE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What strategic pricing action maximizes total corporate revenue when a company discovers its product demand is Inelastic ($E_d = -0.4$)?",
          "expectedStringOutput": "RAISE_PRICE_TO_EXPAND_TOTAL_REVENUE",
          "acceptableAnswers": [
            "RAISE_PRICE_TO_EXPAND_TOTAL_REVENUE",
            "Raise price",
            "Increase price"
          ],
          "primaryMisconceptionId": "MC_ANA_PRICE_ELASTICITY_DEMAND_DYNAMIC_PRICING",
          "diagnosisMap": {
            "LOWER": {
              "misconceptionId": "MC_ANA_PRICE_ELASTICITY_DEMAND_DYNAMIC_PRICING",
              "errorExplanation": "Lowering price on inelastic goods destroys revenue. Must raise price.",
              "recoveryPath": {
                "simplerExplanation": "Inelastic goods -> Raise price.",
                "guidedFixPrompt": "Type RAISE_PRICE_TO_EXPAND_TOTAL_REVENUE"
              }
            }
          }
        }
      },
      {
        "id": "ana-d16-b3-dynamic-pricing-algorithms",
        "day": 16,
        "blockNumber": 3,
        "title": "Dynamic Pricing & Surge Optimization Algorithms",
        "conceptBudget": {
          "primaryConcept": "Dynamic Surge Pricing",
          "supportingTerms": [
            "Real-time supply and demand balancing",
            "Willingness to Pay (WTP) segmentation",
            "Surge Multiplier ($P_{\\text{surge}} = P_{\\text{base}} \\times \\text{Multiplier}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d16-b2-total-revenue-test-pricing-rules",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "surge_pricing_demo.js",
            "initialCode": "function calculateSurgePrice(basePrice, demandIndex, supplyIndex) {\n  const ratio = demandIndex / supplyIndex;\n  const multiplier = ratio > 1.5 ? 1.5 : (ratio > 1.0 ? ratio : 1.0);\n  const finalPrice = basePrice * multiplier;\n  return {\n    basePrice,\n    surgeMultiplier: Number(multiplier.toFixed(2)),\n    finalDynamicPrice: Number(finalPrice.toFixed(2)),\n    status: 'DYNAMIC_PRICE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateSurgePrice(50, 150, 100)));",
            "expectedOutput": "{\"basePrice\":50,\"surgeMultiplier\":1.5,\"finalDynamicPrice\":75,\"status\":\"DYNAMIC_PRICE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the final surge price when base ride fare is $50 and the surge multiplier is 1.5x ($50 \\times 1.5$)?",
          "expectedStringOutput": "75",
          "acceptableAnswers": [
            "75",
            "$75",
            "75.0",
            "finalDynamicPrice\":75"
          ],
          "primaryMisconceptionId": "MC_ANA_PRICE_ELASTICITY_DEMAND_DYNAMIC_PRICING",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_ANA_PRICE_ELASTICITY_DEMAND_DYNAMIC_PRICING",
              "errorExplanation": "50 * 1.5 = 75.",
              "recoveryPath": {
                "simplerExplanation": "50 * 1.5 = 75.",
                "guidedFixPrompt": "Type 75"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Time Series Forecasting: Moving Averages & Exponential Smoothing",
    "overviewMetaphor": "Exponential Smoothing is Driving While Glancing in the Rear-View Mirror with Decreasing Memory: Simple Moving Average treats last year's data with the exact same importance as yesterday's data; Exponential Smoothing ($hat{Y}_{t+1} = \\alpha Y_t + (1-\\alpha) \\hat{Y}_t$) assigns fresh, heavy weight to the most recent month ($\\alpha = 0.5$) while smoothly fading distant history into the background.",
    "blocks": [
      {
        "id": "ana-d17-b1-simple-exponential-smoothing-ses",
        "day": 17,
        "blockNumber": 1,
        "title": "Simple Exponential Smoothing (SES): $\\hat{Y}_{t+1} = \\alpha Y_t + (1 - \\alpha) \\hat{Y}_t$",
        "conceptBudget": {
          "primaryConcept": "Simple Exponential Smoothing Formula",
          "supportingTerms": [
            "$\\hat{Y}_{t+1} = \\alpha Y_t + (1 - \\alpha) \\hat{Y}_t$",
            "Smoothing Constant $\\alpha \\in [0.0, 1.0]$",
            "High $\\alpha$ (e.g. 0.8) reacts aggressively to recent demand shocks",
            "Low $\\alpha$ (e.g. 0.1) produces a ultra-smooth, damp trend"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d9-b1-ols-regression-line-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Exponential Smoothing Iteration (Actual $Y_t = 130$, Prior Forecast $\\hat{Y}_t = 110, \\alpha = 0.5$)",
              "boxes": [
                {
                  "label": "New Actual Demand Shock (Y_t)",
                  "value": "0.50 x 130 = 65.0 (Fresh market demand)",
                  "varType": "New Actual",
                  "isUpdated": false
                },
                {
                  "label": "Prior Historical Forecast (F_t)",
                  "value": "(1 - 0.50) x 110 = 0.50 x 110 = 55.0 (Historical memory)",
                  "varType": "Prior Forecast",
                  "isUpdated": false
                },
                {
                  "label": "Next Period Forecast",
                  "value": "65.0 + 55.0 = EXACTLY 120.0 Units Demand Forecast!",
                  "varType": "Updated Forecast",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ses_calc_demo.js",
            "initialCode": "function calculateSesForecast(actualY, priorForecast, alpha = 0.5) {\n  const nextForecast = alpha * actualY + (1 - alpha) * priorForecast;\n  return {\n    actualSales: actualY,\n    priorForecast,\n    smoothingAlpha: alpha,\n    nextPeriodForecast: Number(nextForecast.toFixed(2)),\n    status: 'SES_FORECAST_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateSesForecast(130, 110, 0.5)));",
            "expectedOutput": "{\"actualSales\":130,\"priorForecast\":110,\"smoothingAlpha\":0.5,\"nextPeriodForecast\":120,\"status\":\"SES_FORECAST_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the next period forecast when actual sales $Y_t = 130$, prior forecast $\\hat{Y}_t = 110$, and smoothing constant $\\alpha = 0.5$ ($0.5 \\times 130 + 0.5 \\times 110$)?",
          "expectedStringOutput": "120",
          "acceptableAnswers": [
            "120",
            "120.0",
            "nextPeriodForecast\":120"
          ],
          "primaryMisconceptionId": "MC_ANA_TIME_SERIES_FORECASTING_EXPONENTIAL_SMOOTHING",
          "diagnosisMap": {
            "130": {
              "misconceptionId": "MC_ANA_TIME_SERIES_FORECASTING_EXPONENTIAL_SMOOTHING",
              "errorExplanation": "130 only happens if alpha = 1.0 (naive forecast). With alpha = 0.5, forecast is 0.5*130 + 0.5*110 = 120.",
              "recoveryPath": {
                "simplerExplanation": "65 + 55 = 120.",
                "guidedFixPrompt": "Type 120"
              }
            }
          }
        }
      },
      {
        "id": "ana-d17-b2-forecast-error-mae-and-mape",
        "day": 17,
        "blockNumber": 2,
        "title": "Forecasting Error Metrics: MAE, MSE & MAPE",
        "conceptBudget": {
          "primaryConcept": "Forecasting Error Evaluation",
          "supportingTerms": [
            "Mean Absolute Error: $MAE = \\frac{1}{n} \\sum |Y_t - \\hat{Y}_t|$",
            "Mean Squared Error: $MSE = \\frac{1}{n} \\sum (Y_t - \\hat{Y}_t)^2$",
            "Mean Absolute Percentage Error: $MAPE = \\frac{100\\%}{n} \\sum \\left|\\frac{Y_t - \\hat{Y}_t}{Y_t}\\right|$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d17-b1-simple-exponential-smoothing-ses",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Forecast Error Formulas",
            "codeSnippet": "Errors: [|100 - 100|=0, |120 - 100|=20, |110 - 110|=0, |130 - 110|=20]\nTotal Absolute Error = 0 + 20 + 0 + 20 = 40\nMean Absolute Error MAE = 40 / 4 = 10.00 Units",
            "lineNotes": {
              "1": "Absolute residuals.",
              "2": "Sum of errors.",
              "3": "Average error magnitude."
            }
          },
          {
            "type": "runnable_code",
            "filename": "mae_calc_demo.js",
            "initialCode": "function calculateMae(actuals, forecasts) {\n  const n = actuals.length;\n  let sumAbsErr = 0;\n  for (let i = 0; i < n; i++) {\n    sumAbsErr += Math.abs(actuals[i] - forecasts[i]);\n  }\n  const mae = sumAbsErr / n;\n  return {\n    samplePoints: n,\n    meanAbsoluteError: Number(mae.toFixed(2)),\n    status: 'MAE_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateMae([100, 120, 110, 130], [100, 100, 110, 110])));",
            "expectedOutput": "{\"samplePoints\":4,\"meanAbsoluteError\":10,\"status\":\"MAE_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Mean Absolute Error (MAE) across 4 periods with absolute errors of [0, 20, 0, 20] ($40 / 4$)?",
          "expectedStringOutput": "10",
          "acceptableAnswers": [
            "10",
            "10.0",
            "meanAbsoluteError\":10"
          ],
          "primaryMisconceptionId": "MC_ANA_TIME_SERIES_FORECASTING_EXPONENTIAL_SMOOTHING",
          "diagnosisMap": {
            "40": {
              "misconceptionId": "MC_ANA_TIME_SERIES_FORECASTING_EXPONENTIAL_SMOOTHING",
              "errorExplanation": "40 is the total error sum. Dividing by n = 4 gives MAE = 10.0.",
              "recoveryPath": {
                "simplerExplanation": "40 / 4 = 10.",
                "guidedFixPrompt": "Type 10"
              }
            }
          }
        }
      },
      {
        "id": "ana-d17-b3-holt-winters-trend-seasonality",
        "day": 17,
        "blockNumber": 3,
        "title": "Holt-Winters Triple Exponential Smoothing (Level, Trend & Seasonality)",
        "conceptBudget": {
          "primaryConcept": "Holt-Winters Decomposition",
          "supportingTerms": [
            "Level parameter $\\alpha$",
            "Trend parameter $\\beta$ (Holt's Linear Trend)",
            "Seasonal parameter $\\gamma$ (Multiplicative or Additive Seasonality)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d17-b2-forecast-error-mae-and-mape",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "holt_winters_demo.js",
            "initialCode": "function getHoltWintersParameters() {\n  return {\n    alpha: 'SMOOTHS_LEVEL',\n    beta: 'SMOOTHS_TREND',\n    gamma: 'SMOOTHS_SEASONALITY',\n    status: 'HOLT_WINTERS_CONFIGURED'\n  };\n}\n\nconsole.log(JSON.stringify(getHoltWintersParameters()));",
            "expectedOutput": "{\"alpha\":\"SMOOTHS_LEVEL\",\"beta\":\"SMOOTHS_TREND\",\"gamma\":\"SMOOTHS_SEASONALITY\",\"status\":\"HOLT_WINTERS_CONFIGURED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which parameter in Holt-Winters triple exponential smoothing models the repeating seasonal quarterly or monthly swings ($\\gamma$)?",
          "expectedStringOutput": "SMOOTHS_SEASONALITY",
          "acceptableAnswers": [
            "SMOOTHS_SEASONALITY",
            "gamma",
            "Seasonality",
            "gamma: SMOOTHS_SEASONALITY"
          ],
          "primaryMisconceptionId": "MC_ANA_TIME_SERIES_FORECASTING_EXPONENTIAL_SMOOTHING",
          "diagnosisMap": {
            "TREND": {
              "misconceptionId": "MC_ANA_TIME_SERIES_FORECASTING_EXPONENTIAL_SMOOTHING",
              "errorExplanation": "Beta models trend. Gamma models seasonality.",
              "recoveryPath": {
                "simplerExplanation": "Gamma smooths seasonality.",
                "guidedFixPrompt": "Type SMOOTHS_SEASONALITY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Inventory Analytics: Economic Order Quantity (EOQ) & Safety Stock",
    "overviewMetaphor": "EOQ is the See-Saw Balance Between Ordering Costs and Warehouse Holding Costs: if you order 1 box of inventory every day, your warehouse holding cost is zero, but your delivery ordering fees will bankrupt you; if you order 10,000 boxes at once, delivery fees are tiny, but warehouse rent, insurance, and spoilage will crush your profits; the Economic Order Quantity ($EOQ = \\sqrt{\\frac{2DS}{H}}$) finds the exact mathematical sweet spot that minimizes total operational inventory costs.",
    "blocks": [
      {
        "id": "ana-d18-b1-eoq-formula-and-derivation",
        "day": 18,
        "blockNumber": 1,
        "title": "The Economic Order Quantity (EOQ) Formula: $EOQ = \\sqrt{\\frac{2 D S}{H}}$",
        "conceptBudget": {
          "primaryConcept": "Economic Order Quantity (EOQ) Formula",
          "supportingTerms": [
            "$D$ (Annual Demand in units)",
            "$S$ (Fixed ordering cost per purchase order)",
            "$H$ (Annual holding / carrying cost per unit)",
            "$EOQ = \\sqrt{\\frac{2 D S}{H}}$",
            "Total Inventory Cost: $TIC = \\left(\\frac{D}{Q}\\right) S + \\left(\\frac{Q}{2}\\right) H$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d16-b1-price-elasticity-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "EOQ Optimization Math ($D=10,000, S=\\$50, H=\\$4$)",
              "boxes": [
                {
                  "label": "Numerator (2 x D x S)",
                  "value": "2 x 10,000 x 50 = 1,000,000",
                  "varType": "Demand Order Num",
                  "isUpdated": false
                },
                {
                  "label": "Holding Denominator (H)",
                  "value": "$4.00 per unit/year",
                  "varType": "Holding Cost",
                  "isUpdated": false
                },
                {
                  "label": "Economic Order Quantity (EOQ)",
                  "value": "sqrt(1,000,000 / 4) = sqrt(250,000) = EXACTLY 500 UNITS!",
                  "varType": "Optimal Q",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "eoq_calc_demo.js",
            "initialCode": "function calculateEoq(d, s, h) {\n  const eoq = Math.sqrt((2 * d * s) / h);\n  const ordersPerYear = d / eoq;\n  const totalCost = (d / eoq) * s + (eoq / 2) * h;\n  return {\n    annualDemand: d,\n    orderCost: s,\n    holdingCostPerUnit: h,\n    economicOrderQuantity: Math.round(eoq),\n    ordersPerYear: Number(ordersPerYear.toFixed(1)),\n    totalAnnualInventoryCost: Math.round(totalCost),\n    status: 'EOQ_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateEoq(10000, 50, 4)));",
            "expectedOutput": "{\"annualDemand\":10000,\"orderCost\":50,\"holdingCostPerUnit\":4,\"economicOrderQuantity\":500,\"ordersPerYear\":20,\"totalAnnualInventoryCost\":2000,\"status\":\"EOQ_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Economic Order Quantity (EOQ) when annual demand $D = 10,000$, ordering cost $S = \\$50$, and holding cost $H = \\$4$ ($\\sqrt{250,000}$)?",
          "expectedStringOutput": "500",
          "acceptableAnswers": [
            "500",
            "500 units",
            "economicOrderQuantity\":500"
          ],
          "primaryMisconceptionId": "MC_ANA_INVENTORY_OPTIMIZATION_EOQ_SAFETY_STOCK",
          "diagnosisMap": {
            "250000": {
              "misconceptionId": "MC_ANA_INVENTORY_OPTIMIZATION_EOQ_SAFETY_STOCK",
              "errorExplanation": "250,000 is (2DS/H). The formula takes the square root: sqrt(250,000) = 500 units.",
              "recoveryPath": {
                "simplerExplanation": "sqrt(250,000) = 500.",
                "guidedFixPrompt": "Type 500"
              }
            }
          }
        }
      },
      {
        "id": "ana-d18-b2-reorder-point-and-safety-stock",
        "day": 18,
        "blockNumber": 2,
        "title": "Reorder Point (ROP) & Safety Stock for Lead Time Variability",
        "conceptBudget": {
          "primaryConcept": "Reorder Point (ROP) Formula",
          "supportingTerms": [
            "$ROP = d \\times L + \\text{Safety Stock}$",
            "$d$ (Average daily demand)",
            "$L$ (Lead time in days)",
            "Safety Stock ($SS = Z_{\\text{service}} \\times \\sigma_L$: Buffer against stock-outs)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d18-b1-eoq-formula-and-derivation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Reorder Point Math ($d=40 \\text{ units/day}, L=5 \\text{ days}, SS=50$)",
            "codeSnippet": "Lead Time Demand = d * L = 40 * 5 = 200 units\nSafety Stock = 50 units\nReorder Point ROP = 200 + 50 = 250 units\nRule: When warehouse stock drops to 250 units, place a new purchase order for 500 units!",
            "lineNotes": {
              "1": "Expected demand during supplier transit.",
              "2": "Buffer cushion.",
              "3": "Inventory trigger point."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rop_calc_demo.js",
            "initialCode": "function calculateRop(dailyD, leadDays, safetyStock) {\n  const rop = dailyD * leadDays + safetyStock;\n  return {\n    leadTimeDemand: dailyD * leadDays,\n    safetyStock,\n    reorderPoint: rop,\n    status: 'ROP_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateRop(40, 5, 50)));",
            "expectedOutput": "{\"leadTimeDemand\":200,\"safetyStock\":50,\"reorderPoint\":250,\"status\":\"ROP_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Reorder Point ($ROP$) when average daily demand is 40 units, supplier lead time is 5 days, and safety stock is 50 units ($40 \\times 5 + 50$)?",
          "expectedStringOutput": "250",
          "acceptableAnswers": [
            "250",
            "250 units",
            "reorderPoint\":250"
          ],
          "primaryMisconceptionId": "MC_ANA_INVENTORY_OPTIMIZATION_EOQ_SAFETY_STOCK",
          "diagnosisMap": {
            "200": {
              "misconceptionId": "MC_ANA_INVENTORY_OPTIMIZATION_EOQ_SAFETY_STOCK",
              "errorExplanation": "200 is lead time demand only. Adding safety stock of 50 gives ROP = 250 units.",
              "recoveryPath": {
                "simplerExplanation": "200 + 50 = 250 units.",
                "guidedFixPrompt": "Type 250"
              }
            }
          }
        }
      },
      {
        "id": "ana-d18-b3-abc-inventory-classification",
        "day": 18,
        "blockNumber": 3,
        "title": "ABC Inventory Classification (Pareto Value Stratification)",
        "conceptBudget": {
          "primaryConcept": "ABC Inventory Analysis",
          "supportingTerms": [
            "Category A: Top 20% of SKU items accounting for 80% of total inventory value (Tight daily control)",
            "Category B: Next 30% of items accounting for 15% of value (Standard periodic review)",
            "Category C: Bottom 50% of items accounting for 5% of value (Bulk simple ordering)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d18-b2-reorder-point-and-safety-stock",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "abc_demo.js",
            "initialCode": "function classifyAbcItem(cumulativeValuePct) {\n  if (cumulativeValuePct <= 80) return 'CATEGORY_A_TIGHT_MANAGEMENT';\n  if (cumulativeValuePct <= 95) return 'CATEGORY_B_PERIODIC_REVIEW';\n  return 'CATEGORY_C_BULK_SIMPLE_CONTROL';\n}\n\nconsole.log(classifyAbcItem(75));\nconsole.log(classifyAbcItem(90));\nconsole.log(classifyAbcItem(98));",
            "expectedOutput": "CATEGORY_A_TIGHT_MANAGEMENT\nCATEGORY_B_PERIODIC_REVIEW\nCATEGORY_C_BULK_SIMPLE_CONTROL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How are the highest-value inventory SKUs (representing the top 80% of total inventory dollar volume) classified in ABC analysis?",
          "expectedStringOutput": "CATEGORY_A_TIGHT_MANAGEMENT",
          "acceptableAnswers": [
            "CATEGORY_A_TIGHT_MANAGEMENT",
            "Category A",
            "Class A"
          ],
          "primaryMisconceptionId": "MC_ANA_INVENTORY_OPTIMIZATION_EOQ_SAFETY_STOCK",
          "diagnosisMap": {
            "C": {
              "misconceptionId": "MC_ANA_INVENTORY_OPTIMIZATION_EOQ_SAFETY_STOCK",
              "errorExplanation": "Top 80% value items are Category A.",
              "recoveryPath": {
                "simplerExplanation": "Category A represents top value.",
                "guidedFixPrompt": "Type CATEGORY_A_TIGHT_MANAGEMENT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "A/B Testing Analytics & Conversion Rate Optimization (CRO)",
    "overviewMetaphor": "A/B Testing is a Blind Taste Test of Two Competing Soda Recipes: 1,000 customers try Recipe A (50 buy $\\implies 5.0\\%$ conversion) and 1,000 try Recipe B (80 buy $\\implies 8.0\\%$ conversion); the Relative Uplift is a massive $+60.0\\%$; but before spending $10M on Recipe B, the Two-Proportion Pooled Z-Test calculates $Z = 2.74$ ($p = 0.006 < 0.05$)—proving beyond statistical doubt that Variant B is the genuine champion.",
    "blocks": [
      {
        "id": "ana-d19-b1-two-proportion-z-test-ab",
        "day": 19,
        "blockNumber": 1,
        "title": "Two-Proportion Pooled Z-Test for A/B Experiments: $Z = \\frac{p_B - p_A}{\\text{SE}_{\\text{pool}}}$",
        "conceptBudget": {
          "primaryConcept": "Two-Proportion Pooled Z-Test",
          "supportingTerms": [
            "$p_A = \\frac{c_A}{n_A}, p_B = \\frac{c_B}{n_B}$",
            "Pooled Proportion: $p_{\\text{pool}} = \\frac{c_A + c_B}{n_A + n_B}$",
            "Standard Error: $SE_{\\text{pool}} = \\sqrt{p_{\\text{pool}}(1 - p_{\\text{pool}}) \\left(\\frac{1}{n_A} + \\frac{1}{n_B}\\right)}$",
            "Critical Z-score at $\\alpha = 0.05$ is $|Z| \\ge 1.96$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d7-b2-p-value-and-significance-alpha",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "A/B Experiment Math (Variant A: 50/1000 vs Variant B: 80/1000)",
              "boxes": [
                {
                  "label": "Conversion Rates",
                  "value": "p_A = 5.00% | p_B = 8.00% -> Relative Uplift = +60.00%!",
                  "varType": "Conversion Rates",
                  "isUpdated": false
                },
                {
                  "label": "Pooled Proportion",
                  "value": "p_pool = (50 + 80) / 2000 = 130 / 2000 = 0.065 (6.5%)",
                  "varType": "Pooled Base",
                  "isUpdated": false
                },
                {
                  "label": "Pooled Z-Statistic",
                  "value": "Z = (0.08 - 0.05) / 0.01102 = +2.72 (|Z| >= 1.96 -> STATISTICALLY SIGNIFICANT WINNER!)",
                  "varType": "Z-Score",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ab_calc_demo.js",
            "initialCode": "function calculateAbZScore(nA, cA, nB, cB) {\n  const pA = cA / nA;\n  const pB = cB / nB;\n  const pPool = (cA + cB) / (nA + nB);\n  const se = Math.sqrt(pPool * (1 - pPool) * (1 / nA + 1 / nB));\n  const z = (pB - pA) / se;\n  return {\n    conversionRateA: Number((pA * 100).toFixed(2)),\n    conversionRateB: Number((pB * 100).toFixed(2)),\n    upliftPercent: Number((((pB - pA) / pA) * 100).toFixed(2)),\n    zScore: Number(z.toFixed(2)),\n    isSignificantWinner: z >= 1.96,\n    status: 'AB_TEST_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateAbZScore(1000, 50, 1000, 80)));",
            "expectedOutput": "{\"conversionRateA\":5,\"conversionRateB\":8,\"upliftPercent\":60,\"zScore\":2.72,\"isSignificantWinner\":true,\"status\":\"AB_TEST_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the relative percentage uplift in conversion rate when Variant B achieves 8.0% conversion compared to Variant A's 5.0% base ($ (8.0 - 5.0) / 5.0 \\times 100 $)?",
          "expectedStringOutput": "60",
          "acceptableAnswers": [
            "60",
            "60%",
            "60.0",
            "upliftPercent\":60"
          ],
          "primaryMisconceptionId": "MC_ANA_AB_TESTING_SAMPLE_SIZE_STATISTICAL_POWER",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_ANA_AB_TESTING_SAMPLE_SIZE_STATISTICAL_POWER",
              "errorExplanation": "3% is the absolute difference (8% - 5%). The relative percentage uplift is (3 / 5) * 100 = 60%.",
              "recoveryPath": {
                "simplerExplanation": "(8 - 5) / 5 * 100 = 60%.",
                "guidedFixPrompt": "Type 60"
              }
            }
          }
        }
      },
      {
        "id": "ana-d19-b2-sample-size-and-mde",
        "day": 19,
        "blockNumber": 2,
        "title": "Sample Size Sizing & Minimum Detectable Effect (MDE)",
        "conceptBudget": {
          "primaryConcept": "A/B Sample Size Determination",
          "supportingTerms": [
            "Evan Miller Sample Size Formula",
            "Statistical Power ($1 - \\beta = 80\\%$)",
            "Significance Level ($\\alpha = 5\\%$)",
            "Peeking Problem (Stopping experiments prematurely causes massive false-positive inflation!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d19-b1-two-proportion-z-test-ab",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "The Peeking Problem Invariant",
            "codeSnippet": "// ❌ NEVER stop an A/B test early just because day 2 looks positive!\n// Early peeking inflates false positive rate from 5% to >30%!\n// ✅ ALWAYS run the experiment until the pre-computed sample size (e.g. 10,000 visitors) is fully reached!",
            "lineNotes": {
              "1": "Early stopping trap.",
              "2": "False positive hazard.",
              "3": "Sound testing protocol."
            }
          },
          {
            "type": "runnable_code",
            "filename": "peeking_demo.js",
            "initialCode": "function evaluateExperimentStopping(currentSample, requiredSample) {\n  return currentSample >= requiredSample\n    ? 'SAMPLE_SIZE_REACHED_VALID_TO_MAKE_DECISION'\n    : 'DO_NOT_PEEK_CONTINUE_COLLECTING_SAMPLES';\n}\n\nconsole.log(evaluateExperimentStopping(2500, 10000));\nconsole.log(evaluateExperimentStopping(10000, 10000));",
            "expectedOutput": "DO_NOT_PEEK_CONTINUE_COLLECTING_SAMPLES\nSAMPLE_SIZE_REACHED_VALID_TO_MAKE_DECISION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What must an analyst do when an A/B test has only collected 2,500 visitors out of a required 10,000 sample size?",
          "expectedStringOutput": "DO_NOT_PEEK_CONTINUE_COLLECTING_SAMPLES",
          "acceptableAnswers": [
            "DO_NOT_PEEK_CONTINUE_COLLECTING_SAMPLES",
            "Continue collecting samples",
            "Do not stop"
          ],
          "primaryMisconceptionId": "MC_ANA_AB_TESTING_SAMPLE_SIZE_STATISTICAL_POWER",
          "diagnosisMap": {
            "STOP": {
              "misconceptionId": "MC_ANA_AB_TESTING_SAMPLE_SIZE_STATISTICAL_POWER",
              "errorExplanation": "Stopping early causes false positives due to the peeking problem.",
              "recoveryPath": {
                "simplerExplanation": "Do not peek; continue collecting.",
                "guidedFixPrompt": "Type DO_NOT_PEEK_CONTINUE_COLLECTING_SAMPLES"
              }
            }
          }
        }
      },
      {
        "id": "ana-d19-b3-guardrail-metrics",
        "day": 19,
        "blockNumber": 3,
        "title": "Guardrail Metrics (Preventing Unintended Business Damage)",
        "conceptBudget": {
          "primaryConcept": "A/B Guardrail Metrics",
          "supportingTerms": [
            "Primary Goal Metric (e.g. Sign-up Clicks)",
            "Guardrail Metrics (e.g. Page Load Latency, Unsubscribe Rate, Refund Rate)",
            "A winning variant must improve primary metric WITHOUT degrading guardrails!"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d19-b2-sample-size-and-mde",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "guardrail_demo.js",
            "initialCode": "function evaluateExperimentLaunch(primaryUpliftPct, latencySpikeMs) {\n  const passesGuardrail = latencySpikeMs <= 50;\n  const isApproved = primaryUpliftPct > 0 && passesGuardrail;\n  return {\n    primaryUpliftPercent: primaryUpliftPct,\n    latencySpikeMs,\n    isLaunchApproved: isApproved,\n    status: isApproved ? 'APPROVED_LAUNCH_TO_PRODUCTION' : 'REJECTED_GUARDRAIL_VIOLATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateExperimentLaunch(15, 20)));\nconsole.log(JSON.stringify(evaluateExperimentLaunch(25, 400))); // Huge latency spike!",
            "expectedOutput": "{\"primaryUpliftPercent\":15,\"latencySpikeMs\":20,\"isLaunchApproved\":true,\"status\":\"APPROVED_LAUNCH_TO_PRODUCTION\"}\n{\"primaryUpliftPercent\":25,\"latencySpikeMs\":400,\"isLaunchApproved\":false,\"status\":\"REJECTED_GUARDRAIL_VIOLATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the launch decision for a variant that increases conversion by 25% but causes an unacceptable 400ms page latency spike that violates the site guardrail?",
          "expectedStringOutput": "REJECTED_GUARDRAIL_VIOLATED",
          "acceptableAnswers": [
            "REJECTED_GUARDRAIL_VIOLATED",
            "Rejected",
            "Guardrail violated"
          ],
          "primaryMisconceptionId": "MC_ANA_AB_TESTING_SAMPLE_SIZE_STATISTICAL_POWER",
          "diagnosisMap": {
            "APPROVED": {
              "misconceptionId": "MC_ANA_AB_TESTING_SAMPLE_SIZE_STATISTICAL_POWER",
              "errorExplanation": "Even with positive uplift, violating a critical guardrail rejects the experiment.",
              "recoveryPath": {
                "simplerExplanation": "Guardrail violation rejects launch.",
                "guidedFixPrompt": "Type REJECTED_GUARDRAIL_VIOLATED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Executive Dashboarding: Balanced Scorecard & KPI Tree Architecture",
    "overviewMetaphor": "An Executive Dashboard is the Airplane Cockpit Multi-Function Display: the CEO cannot read 1,000 raw spreadsheets during flight; the Balanced Scorecard synthesizes altitude, fuel, airspeed, and engine status into 4 balanced panels (Financial, Customer, Internal Processes, Learning & Growth); Red-Amber-Green (RAG) alerts immediately illuminate when revenue variance drops -10% below target so the flight crew can correct course before hitting turbulence.",
    "blocks": [
      {
        "id": "ana-d20-b1-balanced-scorecard-perspectives",
        "day": 20,
        "blockNumber": 1,
        "title": "The Kaplan-Norton Balanced Scorecard: 4 Balanced Corporate Perspectives",
        "conceptBudget": {
          "primaryConcept": "Balanced Scorecard 4 Perspectives",
          "supportingTerms": [
            "1. Financial Perspective (Revenue Growth, ROE, Profit Margins: How do we look to shareholders?)",
            "2. Customer Perspective (CSAT, NPS, Churn, Retention: How do customers see us?)",
            "3. Internal Business Processes (Cycle Time, Quality Yield, Unit Cost)",
            "4. Learning & Growth (Employee Retention, Upskilling, Innovation Index)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d1-b1-four-pillars-analytics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Balanced Scorecard Matrix",
              "boxes": [
                {
                  "label": "1. Financial Perspective",
                  "value": "Operating Margin: 24.5% | Target: 20% (GREEN)",
                  "varType": "Financial",
                  "isUpdated": false
                },
                {
                  "label": "2. Customer Perspective",
                  "value": "NPS Score: +68 | CSAT: 92% (GREEN)",
                  "varType": "Customer",
                  "isUpdated": false
                },
                {
                  "label": "3. Internal Process",
                  "value": "Order Fulfillment: 1.8 Days | Target: 2.0 Days (GREEN)",
                  "varType": "Operations",
                  "isUpdated": false
                },
                {
                  "label": "4. Learning & Growth",
                  "value": "Engineering Training Hours / Employee: 42 hrs (GREEN)",
                  "varType": "Growth",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bsc_demo.js",
            "initialCode": "function getBalancedScorecardPerspectives() {\n  return ['FINANCIAL', 'CUSTOMER', 'INTERNAL_PROCESS', 'LEARNING_AND_GROWTH'];\n}\n\nconsole.log(JSON.stringify(getBalancedScorecardPerspectives()));",
            "expectedOutput": "[\"FINANCIAL\",\"CUSTOMER\",\"INTERNAL_PROCESS\",\"LEARNING_AND_GROWTH\"]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many core perspectives comprise the Kaplan-Norton Balanced Scorecard framework?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "4 perspectives",
            "Four"
          ],
          "primaryMisconceptionId": "MC_ANA_EXECUTIVE_DASHBOARD_KPI_BALANCED_SCORECARD",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_ANA_EXECUTIVE_DASHBOARD_KPI_BALANCED_SCORECARD",
              "errorExplanation": "Focusing only on financial metrics ignores customer and operational health. The Balanced Scorecard has 4 pillars.",
              "recoveryPath": {
                "simplerExplanation": "Balanced Scorecard has 4 perspectives.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "ana-d20-b2-kpi-tree-decomposition-rag",
        "day": 20,
        "blockNumber": 2,
        "title": "KPI Tree Decomposition & RAG Status Variance Alerting",
        "conceptBudget": {
          "primaryConcept": "KPI Tree & RAG Status Logic",
          "supportingTerms": [
            "KPI Tree: $\\text{Revenue} = \\text{Traffic} \\times \\text{Conversion Rate} \\times \\text{AOV}$",
            "Variance $\\% = \\frac{\\text{Actual} - \\text{Target}}{\\text{Target}} \\times 100\\%$",
            "Green (Variance $\\ge 0\\%$)",
            "Amber (Variance $-5\\% \\text{ to } 0\\%$)",
            "Red (Variance $< -5\\% \\implies$ Immediate intervention required!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d20-b1-balanced-scorecard-perspectives",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "RAG Alert Threshold Math (Actual = $90k, Target = $100k)",
            "codeSnippet": "Variance % = ((90 - 100) / 100) * 100 = -10.0%\nCondition: -10.0% < -5.0% threshold\nResult: RED_CRITICAL_INTERVENTION_NEEDED -> ALERT VP IMMEDIATELY!",
            "lineNotes": {
              "1": "Variance percentage.",
              "2": "Threshold comparison.",
              "3": "Executive RAG alert."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rag_calc_demo.js",
            "initialCode": "function evaluateRag(actual, target) {\n  const variancePct = ((actual - target) / target) * 100;\n  let rag = 'GREEN_TARGET_ACHIEVED';\n  if (variancePct < -5.0) rag = 'RED_CRITICAL_INTERVENTION_NEEDED';\n  else if (variancePct < 0) rag = 'AMBER_WARNING_MONITOR_REQUIRED';\n  return {\n    actual,\n    target,\n    variancePercent: Number(variancePct.toFixed(2)),\n    ragStatus: rag,\n    status: 'RAG_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateRag(105, 100)));\nconsole.log(JSON.stringify(evaluateRag(90, 100)));",
            "expectedOutput": "{\"actual\":105,\"target\":100,\"variancePercent\":5,\"ragStatus\":\"GREEN_TARGET_ACHIEVED\",\"status\":\"RAG_EVALUATED\"}\n{\"actual\":90,\"target\":100,\"variancePercent\":-10,\"ragStatus\":\"RED_CRITICAL_INTERVENTION_NEEDED\",\"status\":\"RAG_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What RAG alert status is triggered when actual sales are $90,000 against a $100,000 target (-10.0% variance)?",
          "expectedStringOutput": "RED_CRITICAL_INTERVENTION_NEEDED",
          "acceptableAnswers": [
            "RED_CRITICAL_INTERVENTION_NEEDED",
            "Red",
            "Critical intervention"
          ],
          "primaryMisconceptionId": "MC_ANA_EXECUTIVE_DASHBOARD_KPI_BALANCED_SCORECARD",
          "diagnosisMap": {
            "AMBER": {
              "misconceptionId": "MC_ANA_EXECUTIVE_DASHBOARD_KPI_BALANCED_SCORECARD",
              "errorExplanation": "-10% exceeds the -5% warning threshold, triggering a RED critical alert.",
              "recoveryPath": {
                "simplerExplanation": "Variance < -5% triggers RED.",
                "guidedFixPrompt": "Type RED_CRITICAL_INTERVENTION_NEEDED"
              }
            }
          }
        }
      },
      {
        "id": "ana-d20-b3-leading-vs-lagging-indicators",
        "day": 20,
        "blockNumber": 3,
        "title": "Leading vs Lagging Indicators: Steering vs Accounting",
        "conceptBudget": {
          "primaryConcept": "Leading vs Lagging Indicators",
          "supportingTerms": [
            "Lagging Indicators (Output results e.g. Quarterly Revenue, Churn Count: Easy to measure, impossible to change retroactively!)",
            "Leading Indicators (Input drivers e.g. Daily active users, Outbound sales calls, Customer onboarding completion: Controllable predictive levers)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d20-b2-kpi-tree-decomposition-rag",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "indicators_demo.js",
            "initialCode": "function classifyIndicator(kpiName) {\n  if (kpiName === 'QUARTERLY_REVENUE' || kpiName === 'ANNUAL_PROFIT') return 'LAGGING_OUTPUT_METRIC';\n  return 'LEADING_INPUT_DRIVER';\n}\n\nconsole.log(classifyIndicator('QUARTERLY_REVENUE'));\nconsole.log(classifyIndicator('DAILY_OUTBOUND_DEMO_CALLS'));",
            "expectedOutput": "LAGGING_OUTPUT_METRIC\nLEADING_INPUT_DRIVER",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is Quarterly Net Profit classified in corporate performance analytics?",
          "expectedStringOutput": "LAGGING_OUTPUT_METRIC",
          "acceptableAnswers": [
            "LAGGING_OUTPUT_METRIC",
            "Lagging Indicator",
            "Lagging Metric"
          ],
          "primaryMisconceptionId": "MC_ANA_EXECUTIVE_DASHBOARD_KPI_BALANCED_SCORECARD",
          "diagnosisMap": {
            "LEADING": {
              "misconceptionId": "MC_ANA_EXECUTIVE_DASHBOARD_KPI_BALANCED_SCORECARD",
              "errorExplanation": "Profit is a historical output (lagging). Daily sales activity is leading.",
              "recoveryPath": {
                "simplerExplanation": "Profit is a lagging metric.",
                "guidedFixPrompt": "Type LAGGING_OUTPUT_METRIC"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Operational Analytics & Experimentation Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete sovereign operational intelligence and scientific experimentation engine: 1. Price elasticity optimization and dynamic pricing; 2. Exponential smoothing demand forecasting; 3. EOQ inventory cost minimization and ROP safety stock sizing; 4. A/B testing two-proportion Z-test experimentation validation.",
    "blocks": [
      {
        "id": "ana-d21-b1-operational-engine-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Operational Analytics & Optimization Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Operational Engine Synthesis",
          "supportingTerms": [
            "Elasticity Modeler",
            "Demand Forecaster",
            "EOQ Inventory Optimizer",
            "A/B Testing Framework"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d20-b3-leading-vs-lagging-indicators",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Operational Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Evaluates Price Elasticity of Demand ($E_d = -2.0$) & pricing action",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Forecasts next period demand via Exponential Smoothing (120 units)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Calculates Economic Order Quantity ($EOQ = 500$ units, $ROP = 250$)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Validates A/B experimentation significance ($Z = +2.72, p < 0.05$)!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ops_master_demo.js",
            "initialCode": "function runOperationalAnalyticsEngine() {\n  return {\n    pricingSubsystem: 'ONLINE_ELASTICITY_OPTIMIZER_ACTIVE',\n    forecastingSubsystem: 'ONLINE_EXPONENTIAL_SMOOTHING_ACTIVE',\n    inventorySubsystem: 'ONLINE_EOQ_ROP_OPTIMIZER_ACTIVE',\n    experimentationSubsystem: 'ONLINE_AB_TWO_PROPORTION_Z_ACTIVE',\n    engineStatus: 'OPERATIONAL_ANALYTICS_MASTER_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runOperationalAnalyticsEngine().engineStatus);",
            "expectedOutput": "OPERATIONAL_ANALYTICS_MASTER_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Operational Analytics Master Engine?",
          "expectedStringOutput": "OPERATIONAL_ANALYTICS_MASTER_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "OPERATIONAL_ANALYTICS_MASTER_ENGINE_ACTIVE",
            "engineStatus: OPERATIONAL_ANALYTICS_MASTER_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_ANA_INVENTORY_OPTIMIZATION_EOQ_SAFETY_STOCK",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ANA_INVENTORY_OPTIMIZATION_EOQ_SAFETY_STOCK",
              "errorExplanation": "Matches OPERATIONAL_ANALYTICS_MASTER_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type OPERATIONAL_ANALYTICS_MASTER_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "ana-d21-b2-operational-engine-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Operational Analytics Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Operational Invariant Verification",
          "supportingTerms": [
            "Elasticity Invariant",
            "EOQ Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d21-b1-operational-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ops_audit_demo.js",
            "initialCode": "function auditOperationalEngine(priceValid, forecastValid, eoqValid, abValid) {\n  const passed = priceValid && forecastValid && eoqValid && abValid;\n  return {\n    pricingVerified: priceValid,\n    forecastingVerified: forecastValid,\n    inventoryVerified: eoqValid,\n    experimentationVerified: abValid,\n    grade: passed ? 'OPERATIONAL_ANALYTICS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditOperationalEngine(true, true, true, true)));",
            "expectedOutput": "{\"pricingVerified\":true,\"forecastingVerified\":true,\"inventoryVerified\":true,\"experimentationVerified\":true,\"grade\":\"OPERATIONAL_ANALYTICS_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Pricing, Forecasting, Inventory, and Experimentation engines pass 100%?",
          "expectedStringOutput": "OPERATIONAL_ANALYTICS_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "OPERATIONAL_ANALYTICS_ENGINE_AUDIT_PASSED",
            "grade\":\"OPERATIONAL_ANALYTICS_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_ANA_INVENTORY_OPTIMIZATION_EOQ_SAFETY_STOCK",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ANA_INVENTORY_OPTIMIZATION_EOQ_SAFETY_STOCK",
              "errorExplanation": "All checks passing awards OPERATIONAL_ANALYTICS_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards OPERATIONAL_ANALYTICS_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type OPERATIONAL_ANALYTICS_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "ana-d21-b3-milestone3-analytics-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Operational Analytics Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Operational Engine Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d21-b2-operational-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_ana_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete Operational Analytics & Experimentation Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete Operational Analytics & Experimentation Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete Operational Analytics & Experimentation Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete Operational Analytics & Experimentation Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_ANA_INVENTORY_OPTIMIZATION_EOQ_SAFETY_STOCK",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ANA_INVENTORY_OPTIMIZATION_EOQ_SAFETY_STOCK",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete Operational Analytics & Experimentation Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Prescriptive Analytics: Linear Programming Optimization (Resource Allocation)",
    "overviewMetaphor": "Linear Programming is Packing the World's Most Valuable Suitcase Under Strict Weight and Size Limits: your factory makes Luxury Chairs ($40 profit) and Luxury Tables ($50 profit); you have only 120 labor hours and 80 board-feet of oak lumber; the Corner Point Theorem mathematically proves that maximum profit will NEVER hide in the fuzzy middle—it will ALWAYS sit on an extreme corner vertex of your feasible polygon (e.g. at 30 Chairs and 20 Tables $\\implies \\$2,200$ Maximum Profit).",
    "blocks": [
      {
        "id": "ana-d22-b1-linear-programming-formulation",
        "day": 22,
        "blockNumber": 1,
        "title": "Linear Programming Formulation: Objective Function & Constraints",
        "conceptBudget": {
          "primaryConcept": "Linear Programming Formulation",
          "supportingTerms": [
            "Objective Function: Maximize Profit $Z = c_1 X_1 + c_2 X_2$",
            "Structural Constraints: $a_{11} X_1 + a_{12} X_2 \\le b_1$",
            "Non-Negativity Constraints: $X_1 \\ge 0, X_2 \\ge 0$",
            "Feasible Region (The convex polygon of all valid production combinations)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d18-b1-eoq-formula-and-derivation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "LP Resource Allocation Problem",
              "boxes": [
                {
                  "label": "Objective Function",
                  "value": "Maximize Profit Z = $40 X1 (Chairs) + $50 X2 (Tables)",
                  "varType": "Objective",
                  "isUpdated": false
                },
                {
                  "label": "Labor Constraint",
                  "value": "2 X1 + 3 X2 <= 120 Hours",
                  "varType": "Labor Limit",
                  "isUpdated": false
                },
                {
                  "label": "Lumber Constraint",
                  "value": "2 X1 + 1 X2 <= 80 Board-Feet",
                  "varType": "Lumber Limit",
                  "isUpdated": false
                },
                {
                  "label": "Optimal Corner Solution",
                  "value": "(X1 = 30, X2 = 20) -> Max Profit = 40(30) + 50(20) = $2,200!",
                  "varType": "Max Profit",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "lp_corner_demo.js",
            "initialCode": "function solveLpCornerPoints(c1, c2, corners) {\n  let maxProfit = -Infinity;\n  let best = null;\n  corners.forEach(pt => {\n    const profit = c1 * pt[0] + c2 * pt[1];\n    if (profit > maxProfit) {\n      maxProfit = profit;\n      best = pt;\n    }\n  });\n  return {\n    optimalX1: best[0],\n    optimalX2: best[1],\n    maximumProfit: maxProfit,\n    status: 'LP_OPTIMUM_FOUND'\n  };\n}\n\nconst corners = [[0, 0], [0, 40], [30, 20], [40, 0]]; // (0,40)->$2000, (30,20)->$2200, (40,0)->$1600\nconsole.log(JSON.stringify(solveLpCornerPoints(40, 50, corners)));",
            "expectedOutput": "{\"optimalX1\":30,\"optimalX2\":20,\"maximumProfit\":2200,\"status\":\"LP_OPTIMUM_FOUND\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum profit achievable under the objective function $Z = 40 X_1 + 50 X_2$ at the optimal corner point $(X_1=30, X_2=20)$ ($40 \\times 30 + 50 \\times 20$)?",
          "expectedStringOutput": "2200",
          "acceptableAnswers": [
            "2200",
            "$2200",
            "$2,200",
            "maximumProfit\":2200"
          ],
          "primaryMisconceptionId": "MC_ANA_PRESCRIPTIVE_OPTIMIZATION_LINEAR_PROGRAMMING",
          "diagnosisMap": {
            "2000": {
              "misconceptionId": "MC_ANA_PRESCRIPTIVE_OPTIMIZATION_LINEAR_PROGRAMMING",
              "errorExplanation": "2000 is (0, 40). The optimal vertex is (30, 20) which yields $2,200.",
              "recoveryPath": {
                "simplerExplanation": "1200 + 1000 = 2200.",
                "guidedFixPrompt": "Type 2200"
              }
            }
          }
        }
      },
      {
        "id": "ana-d22-b2-corner-point-optimum-theorem",
        "day": 22,
        "blockNumber": 2,
        "title": "The Fundamental Corner Point Theorem of Linear Programming",
        "conceptBudget": {
          "primaryConcept": "Corner Point Theorem",
          "supportingTerms": [
            "The optimal solution to any linear programming problem ALWAYS occurs at one of the vertices (corner points) of the feasible region",
            "Simplex Algorithm (George Dantzig: Iterates from corner to corner along edges)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d22-b1-linear-programming-formulation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Simplex Method Invariant",
            "codeSnippet": "// Feasible region is convex polygon\n// Objective contour lines are linear\n// Extreme value theorem guarantees optimum at a CORNER VERTEX!",
            "lineNotes": {
              "1": "Boundary convexity.",
              "2": "Linear gradient.",
              "3": "Corner vertex theorem."
            }
          },
          {
            "type": "runnable_code",
            "filename": "corner_theorem_demo.js",
            "initialCode": "function getLpOptimumLocation() {\n  return 'CORNER_POINT_OF_FEASIBLE_REGION';\n}\n\nconsole.log(getLpOptimumLocation());",
            "expectedOutput": "CORNER_POINT_OF_FEASIBLE_REGION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where is the optimal profit solution guaranteed to occur in any standard Linear Programming problem?",
          "expectedStringOutput": "CORNER_POINT_OF_FEASIBLE_REGION",
          "acceptableAnswers": [
            "CORNER_POINT_OF_FEASIBLE_REGION",
            "Corner Point",
            "Extreme Vertex"
          ],
          "primaryMisconceptionId": "MC_ANA_PRESCRIPTIVE_OPTIMIZATION_LINEAR_PROGRAMMING",
          "diagnosisMap": {
            "CENTER": {
              "misconceptionId": "MC_ANA_PRESCRIPTIVE_OPTIMIZATION_LINEAR_PROGRAMMING",
              "errorExplanation": "Linear gradients push the optimum to the extreme boundaries (corner points), never the interior center.",
              "recoveryPath": {
                "simplerExplanation": "Optimum is at a corner point.",
                "guidedFixPrompt": "Type CORNER_POINT_OF_FEASIBLE_REGION"
              }
            }
          }
        }
      },
      {
        "id": "ana-d22-b3-shadow-prices-and-sensitivity",
        "day": 22,
        "blockNumber": 3,
        "title": "Shadow Prices (Dual Values) & Sensitivity Analysis",
        "conceptBudget": {
          "primaryConcept": "Shadow Price (Dual Value)",
          "supportingTerms": [
            "Shadow Price: Increase in optimal objective value per 1-unit increase in right-hand side resource limit $b_i$",
            "Allowable increase/decrease ranges",
            "Determining maximum willingness to pay for additional factory overtime labor"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d22-b2-corner-point-optimum-theorem",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "shadow_demo.js",
            "initialCode": "function evaluateShadowPrice(shadowPriceLabor, overtimeCostPerHour) {\n  const isWorthBuying = shadowPriceLabor > overtimeCostPerHour;\n  return {\n    shadowPricePerLaborHour: shadowPriceLabor,\n    overtimeCostPerHour,\n    isOvertimeProfitable: isWorthBuying,\n    recommendation: isWorthBuying ? 'HIRE_OVERTIME_LABOR_EXPANDS_PROFIT' : 'REJECT_OVERTIME_COST_EXCEEDS_VALUE',\n    status: 'SHADOW_PRICE_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateShadowPrice(15.0, 10.0)));\nconsole.log(JSON.stringify(evaluateShadowPrice(8.0, 10.0)));",
            "expectedOutput": "{\"shadowPricePerLaborHour\":15,\"overtimeCostPerHour\":10,\"isOvertimeProfitable\":true,\"recommendation\":\"HIRE_OVERTIME_LABOR_EXPANDS_PROFIT\",\"status\":\"SHADOW_PRICE_EVALUATED\"}\n{\"shadowPricePerLaborHour\":8,\"overtimeCostPerHour\":10,\"isOvertimeProfitable\":false,\"recommendation\":\"REJECT_OVERTIME_COST_EXCEEDS_VALUE\",\"status\":\"SHADOW_PRICE_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "If the shadow price of labor is $15/hour and overtime wages are $10/hour ($15 > $10$), what is the optimal management decision?",
          "expectedStringOutput": "HIRE_OVERTIME_LABOR_EXPANDS_PROFIT",
          "acceptableAnswers": [
            "HIRE_OVERTIME_LABOR_EXPANDS_PROFIT",
            "Hire overtime",
            "Buy labor"
          ],
          "primaryMisconceptionId": "MC_ANA_PRESCRIPTIVE_OPTIMIZATION_LINEAR_PROGRAMMING",
          "diagnosisMap": {
            "REJECT": {
              "misconceptionId": "MC_ANA_PRESCRIPTIVE_OPTIMIZATION_LINEAR_PROGRAMMING",
              "errorExplanation": "Since shadow price ($15) > cost ($10), hiring overtime adds $5 net profit per hour.",
              "recoveryPath": {
                "simplerExplanation": "Shadow price > cost -> Hire overtime.",
                "guidedFixPrompt": "Type HIRE_OVERTIME_LABOR_EXPANDS_PROFIT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Decision Trees & Ensemble Models for Business Decision Support",
    "overviewMetaphor": "A Business Decision Tree is a Strategic Flowchart with Financial Price Tags at Every Fork: when deciding whether to launch a new product line, square Decision Nodes represent management choices, while circular Chance Nodes represent uncertain market reactions (e.g. 60% probability of High Demand earning $100k vs 40% probability of Low Demand losing -$30k); Expected Monetary Value ($EMV = \\sum p_i \\times \\text{Payoff}_i = \\$48,000$) calculates the weighted mathematical value of the decision branch.",
    "blocks": [
      {
        "id": "ana-d23-b1-decision-trees-emv-calculation",
        "day": 23,
        "blockNumber": 1,
        "title": "Expected Monetary Value (EMV): $EMV = \\sum (p_i \\times \\text{Payoff}_i)$",
        "conceptBudget": {
          "primaryConcept": "Expected Monetary Value (EMV) Formula",
          "supportingTerms": [
            "$EMV = p_1 X_1 + p_2 X_2 + \\dots$",
            "Decision Nodes (Squares: Controlled choices)",
            "Chance Nodes (Circles: Probabilistic states of nature)",
            "Rollback / Backward Induction decision process"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d6-b1-normal-distribution-empirical-rule",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "EMV Decision Tree Branch (High Demand: 60% @ +$100k, Low Demand: 40% @ -$30k)",
              "boxes": [
                {
                  "label": "High Demand State (60%)",
                  "value": "0.60 x $100,000 = +$60,000 expected cash",
                  "varType": "High State",
                  "isUpdated": false
                },
                {
                  "label": "Low Demand State (40%)",
                  "value": "0.40 x (-$30,000) = -$12,000 expected cash",
                  "varType": "Low State",
                  "isUpdated": false
                },
                {
                  "label": "Expected Monetary Value",
                  "value": "EMV = $60,000 - $12,000 = +$48,000 (PURSUE PROJECT!)",
                  "varType": "Net EMV",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "emv_calc_demo.js",
            "initialCode": "function calculateEmv(branches) {\n  let emv = 0;\n  branches.forEach(b => {\n    emv += b.prob * b.payoff;\n  });\n  return {\n    expectedMonetaryValue: Number(emv.toFixed(2)),\n    recommendation: emv > 0 ? 'PURSUE_STRATEGIC_INITIATIVE' : 'REJECT_NEGATIVE_EMV',\n    status: 'EMV_COMPUTED'\n  };\n}\n\nconst projectA = [{ prob: 0.6, payoff: 100000 }, { prob: 0.4, payoff: -30000 }];\nconsole.log(JSON.stringify(calculateEmv(projectA)));",
            "expectedOutput": "{\"expectedMonetaryValue\":48000,\"recommendation\":\"PURSUE_STRATEGIC_INITIATIVE\",\"status\":\"EMV_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Expected Monetary Value (EMV) for a decision branch with a 60% chance of $100,000 payoff and 40% chance of -$30,000 payoff ($0.60 \\times 100,000 + 0.40 \\times (-30,000)$)?",
          "expectedStringOutput": "48000",
          "acceptableAnswers": [
            "48000",
            "$48,000",
            "48000.0",
            "expectedMonetaryValue\":48000"
          ],
          "primaryMisconceptionId": "MC_ANA_DECISION_TREES_RANDOM_FORESTS_IMPORTANCE",
          "diagnosisMap": {
            "70000": {
              "misconceptionId": "MC_ANA_DECISION_TREES_RANDOM_FORESTS_IMPORTANCE",
              "errorExplanation": "70000 is 100,000 - 30,000. Weighted EMV is (0.60 * 100k) + (0.40 * -30k) = $48,000.",
              "recoveryPath": {
                "simplerExplanation": "60,000 - 12,000 = 48,000.",
                "guidedFixPrompt": "Type 48000"
              }
            }
          }
        }
      },
      {
        "id": "ana-d23-b2-decision-tree-splitting-gini",
        "day": 23,
        "blockNumber": 2,
        "title": "Machine Learning Decision Trees: Gini Impurity & Information Gain",
        "conceptBudget": {
          "primaryConcept": "Gini Impurity Splitting Metric",
          "supportingTerms": [
            "Gini Impurity: $I_G(p) = 1 - \\sum p_i^2$",
            "Gini = 0.0 (Pure homogeneous leaf node: 100% of customers bought)",
            "Information Gain / Entropy (Shannon Entropy: $H(X) = -\\sum p_i \\log_2 p_i$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d23-b1-decision-trees-emv-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Gini Impurity Calculation (Binary Split: 80% Yes, 20% No)",
            "codeSnippet": "p_yes = 0.80 | p_no = 0.20\nGini Impurity = 1 - (0.80^2 + 0.20^2) = 1 - (0.64 + 0.04) = 1 - 0.68 = 0.32",
            "lineNotes": {
              "1": "Class probabilities.",
              "2": "Sum of squared probabilities subtracted from 1."
            }
          },
          {
            "type": "runnable_code",
            "filename": "gini_demo.js",
            "initialCode": "function calculateGini(pYes, pNo) {\n  const gini = 1 - (pYes * pYes + pNo * pNo);\n  return {\n    pYes,\n    pNo,\n    giniImpurity: Number(gini.toFixed(4)),\n    status: 'GINI_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateGini(0.80, 0.20)));",
            "expectedOutput": "{\"pYes\":0.8,\"pNo\":0.2,\"giniImpurity\":0.32,\"status\":\"GINI_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Gini Impurity for a decision tree node with 80% positive and 20% negative records ($1 - (0.80^2 + 0.20^2)$)?",
          "expectedStringOutput": "0.32",
          "acceptableAnswers": [
            "0.32",
            "0.3200",
            "giniImpurity\":0.32"
          ],
          "primaryMisconceptionId": "MC_ANA_DECISION_TREES_RANDOM_FORESTS_IMPORTANCE",
          "diagnosisMap": {
            "0.68": {
              "misconceptionId": "MC_ANA_DECISION_TREES_RANDOM_FORESTS_IMPORTANCE",
              "errorExplanation": "0.68 is (0.8^2 + 0.2^2). Subtracting from 1 gives Gini = 1 - 0.68 = 0.32.",
              "recoveryPath": {
                "simplerExplanation": "1 - 0.68 = 0.32.",
                "guidedFixPrompt": "Type 0.32"
              }
            }
          }
        }
      },
      {
        "id": "ana-d23-b3-random-forests-feature-importance",
        "day": 23,
        "blockNumber": 3,
        "title": "Random Forests & Ensemble Feature Importance",
        "conceptBudget": {
          "primaryConcept": "Random Forest Feature Importance",
          "supportingTerms": [
            "Bagging (Bootstrap Aggregation of 100+ randomized decision trees)",
            "Out-Of-Bag (OOB) Error",
            "Mean Decrease in Impurity (MDI) feature importance ranking"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d23-b2-decision-tree-splitting-gini",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rf_importance_demo.js",
            "initialCode": "function rankFeatures(featureList) {\n  return featureList.sort((a, b) => b.importance - a.importance);\n}\n\nconst features = [\n  { name: 'Ad_Spend', importance: 0.45 },\n  { name: 'Customer_Age', importance: 0.15 },\n  { name: 'Past_Orders', importance: 0.40 }\n];\nconsole.log(rankFeatures(features)[0].name);",
            "expectedOutput": "Ad_Spend",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which feature has the highest explanatory importance when Ad_Spend = 0.45, Past_Orders = 0.40, and Customer_Age = 0.15?",
          "expectedStringOutput": "Ad_Spend",
          "acceptableAnswers": [
            "Ad_Spend",
            "Ad Spend"
          ],
          "primaryMisconceptionId": "MC_ANA_DECISION_TREES_RANDOM_FORESTS_IMPORTANCE",
          "diagnosisMap": {
            "AGE": {
              "misconceptionId": "MC_ANA_DECISION_TREES_RANDOM_FORESTS_IMPORTANCE",
              "errorExplanation": "Ad_Spend has the highest importance (0.45).",
              "recoveryPath": {
                "simplerExplanation": "Highest value is Ad_Spend.",
                "guidedFixPrompt": "Type Ad_Spend"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Unsupervised Learning: K-Means Customer Clustering & Silhouette Score",
    "overviewMetaphor": "K-Means Clustering is Gravitational Planets Pulling Asteroids into Natural Solar Systems: when you have 100,000 customers without any pre-existing labels, K-Means drops $K$ cluster centroids into the coordinate space; each centroid acts as a gravitational anchor, pulling nearby customers into its orbit; iterative re-centering converges until $K=3$ distinct clusters emerge: Bargain Hunters, Occasional Gifters, and Whale Power-Users.",
    "blocks": [
      {
        "id": "ana-d24-b1-k-means-algorithm-loop",
        "day": 24,
        "blockNumber": 1,
        "title": "The K-Means Clustering Algorithm: Assignment & Update Steps",
        "conceptBudget": {
          "primaryConcept": "K-Means Clustering Mechanics",
          "supportingTerms": [
            "Step 1: Initialize $K$ Centroids ($k$-means++)",
            "Step 2: Assign each data point to nearest centroid via Euclidean Distance ($d = \\sqrt{\\sum (x_i - c_i)^2}$)",
            "Step 3: Update centroids to the arithmetic mean of all assigned cluster points",
            "Repeat until centroids stabilize / converge"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d2-b1-mean-median-mode-skewness",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "K-Means Centroid Convergence ([2, 4, 10, 12, 100, 102])",
              "boxes": [
                {
                  "label": "Cluster 1 ([2, 4])",
                  "value": "Mean = (2 + 4) / 2 = 3.00 (Low spend cluster)",
                  "varType": "Centroid 1",
                  "isUpdated": false
                },
                {
                  "label": "Cluster 2 ([10, 12])",
                  "value": "Mean = (10 + 12) / 2 = 11.00 (Mid spend cluster)",
                  "varType": "Centroid 2",
                  "isUpdated": false
                },
                {
                  "label": "Cluster 3 ([100, 102])",
                  "value": "Mean = (100 + 102) / 2 = 101.00 (High spend whales)",
                  "varType": "Centroid 3",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "kmeans_demo.js",
            "initialCode": "function runKMeans1D(data, initialCentroids, iterations = 5) {\n  let centroids = [...initialCentroids];\n  for (let iter = 0; iter < iterations; iter++) {\n    const clusters = centroids.map(() => []);\n    data.forEach(pt => {\n      let minDist = Infinity;\n      let bestIdx = 0;\n      centroids.forEach((c, idx) => {\n        const dist = Math.abs(pt - c);\n        if (dist < minDist) {\n          minDist = dist;\n          bestIdx = idx;\n        }\n      });\n      clusters[bestIdx].push(pt);\n    });\n    centroids = clusters.map((cl, idx) => cl.length > 0 ? (cl.reduce((a, b) => a + b, 0) / cl.length) : centroids[idx]);\n  }\n  return {\n    convergedCentroids: centroids,\n    status: 'KMEANS_CONVERGED'\n  };\n}\n\nconsole.log(JSON.stringify(runKMeans1D([2, 4, 10, 12, 100, 102], [3, 11, 101])));",
            "expectedOutput": "{\"convergedCentroids\":[3,11,101],\"status\":\"KMEANS_CONVERGED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What are the 3 converged centroid values for the 1D dataset [2, 4, 10, 12, 100, 102]?",
          "expectedStringOutput": "3,11,101",
          "acceptableAnswers": [
            "3,11,101",
            "[3,11,101]",
            "[3, 11, 101]",
            "convergedCentroids\":[3,11,101]"
          ],
          "primaryMisconceptionId": "MC_ANA_CLUSTERING_K_MEANS_SILHOUETTE_SCORE",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_ANA_CLUSTERING_K_MEANS_SILHOUETTE_SCORE",
              "errorExplanation": "Centroids converge to the mean of each cluster: (2+4)/2=3, (10+12)/2=11, (100+102)/2=101.",
              "recoveryPath": {
                "simplerExplanation": "Means are 3, 11, 101.",
                "guidedFixPrompt": "Type 3,11,101"
              }
            }
          }
        }
      },
      {
        "id": "ana-d24-b2-elbow-method-wcss",
        "day": 24,
        "blockNumber": 2,
        "title": "Choosing Optimal $K$: The Elbow Method & WCSS",
        "conceptBudget": {
          "primaryConcept": "Elbow Method & WCSS",
          "supportingTerms": [
            "Within-Cluster Sum of Squares (WCSS / Inertia: $\\sum_{k} \\sum_{x \\in C_k} ||x - c_k||^2$)",
            "The Elbow Point: The inflection point where adding more clusters yields diminishing returns in WCSS reduction"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d24-b1-k-means-algorithm-loop",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Elbow Method Decision Rule",
            "codeSnippet": "// K=1: WCSS = 50,000\n// K=2: WCSS = 20,000 (Drop of 30,000!)\n// K=3: WCSS = 5,000  (Drop of 15,000! -> THE ELBOW INFLECTION POINT!)\n// K=4: WCSS = 4,200  (Drop of only 800 -> Diminishing returns)",
            "lineNotes": {
              "2": "Large variance drop.",
              "3": "Optimal inflection elbow.",
              "4": "Diminishing marginal improvement."
            }
          },
          {
            "type": "runnable_code",
            "filename": "elbow_demo.js",
            "initialCode": "function evaluateElbowChoice(k) {\n  return k === 3\n    ? 'OPTIMAL_ELBOW_K_CHOSEN'\n    : 'SUB_OPTIMAL_CLUSTER_COUNT';\n}\n\nconsole.log(evaluateElbowChoice(3));\nconsole.log(evaluateElbowChoice(10));",
            "expectedOutput": "OPTIMAL_ELBOW_K_CHOSEN\nSUB_OPTIMAL_CLUSTER_COUNT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What metric is minimized within clusters and plotted against $K$ on the y-axis in the Elbow Method?",
          "expectedStringOutput": "WITHIN_CLUSTER_SUM_OF_SQUARES_WCSS",
          "acceptableAnswers": [
            "WITHIN_CLUSTER_SUM_OF_SQUARES_WCSS",
            "WCSS",
            "Inertia"
          ],
          "primaryMisconceptionId": "MC_ANA_CLUSTERING_K_MEANS_SILHOUETTE_SCORE",
          "diagnosisMap": {
            "R2": {
              "misconceptionId": "MC_ANA_CLUSTERING_K_MEANS_SILHOUETTE_SCORE",
              "errorExplanation": "R2 is for regression. K-Means Elbow Method minimizes WCSS (Within-Cluster Sum of Squares).",
              "recoveryPath": {
                "simplerExplanation": "Plots WCSS against K.",
                "guidedFixPrompt": "Type WITHIN_CLUSTER_SUM_OF_SQUARES_WCSS"
              }
            }
          }
        }
      },
      {
        "id": "ana-d24-b3-silhouette-score-validation",
        "day": 24,
        "blockNumber": 3,
        "title": "Silhouette Score: Cluster Cohesion & Separation ($s \\in [-1.0, +1.0]$)",
        "conceptBudget": {
          "primaryConcept": "Silhouette Score Validation",
          "supportingTerms": [
            "$s(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))}$",
            "$a(i)$ (Mean intra-cluster distance / Cohesion)",
            "$b(i)$ (Mean nearest-cluster distance / Separation)",
            "$s \\approx +1.0$ (Dense, well-separated clusters)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d24-b2-elbow-method-wcss",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "silhouette_demo.js",
            "initialCode": "function evaluateSilhouette(score) {\n  if (score >= 0.70) return 'STRONG_CLUSTER_STRUCTURE_EXCELLENT';\n  if (score >= 0.50) return 'REASONABLE_CLUSTER_STRUCTURE';\n  return 'WEAK_OR_ARTIFICIAL_CLUSTERING';\n}\n\nconsole.log(evaluateSilhouette(0.78));\nconsole.log(evaluateSilhouette(0.35));",
            "expectedOutput": "STRONG_CLUSTER_STRUCTURE_EXCELLENT\nWEAK_OR_ARTIFICIAL_CLUSTERING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How is a customer clustering solution with a high Silhouette Score of 0.78 evaluated?",
          "expectedStringOutput": "STRONG_CLUSTER_STRUCTURE_EXCELLENT",
          "acceptableAnswers": [
            "STRONG_CLUSTER_STRUCTURE_EXCELLENT",
            "Strong structure",
            "Excellent"
          ],
          "primaryMisconceptionId": "MC_ANA_CLUSTERING_K_MEANS_SILHOUETTE_SCORE",
          "diagnosisMap": {
            "WEAK": {
              "misconceptionId": "MC_ANA_CLUSTERING_K_MEANS_SILHOUETTE_SCORE",
              "errorExplanation": "Silhouette score > 0.70 represents excellent, dense cluster separation.",
              "recoveryPath": {
                "simplerExplanation": "Score >= 0.70 is strong.",
                "guidedFixPrompt": "Type STRONG_CLUSTER_STRUCTURE_EXCELLENT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Text Analytics & NLP: Customer Review Sentiment Scoring",
    "overviewMetaphor": "Text Analytics is an Automated Thermometer for 100,000 Customer Reviews: reading thousands of Amazon reviews manually is impossible; NLP tokenizes the text into clean words, strips out noisy stopwords ('the', 'is', 'and'), and maps adjectives against a calibrated sentiment lexicon; 'Great product with fast shipping' scores $+3 + 2 = +5$ (Positive!), while 'Broken screen and terrible support' scores $-3 - 4 = -7$ (Negative!).",
    "blocks": [
      {
        "id": "ana-d25-b1-tokenization-and-text-cleaning",
        "day": 25,
        "blockNumber": 1,
        "title": "Text Preprocessing: Tokenization, Stopwords & Lemmatization",
        "conceptBudget": {
          "primaryConcept": "NLP Text Preprocessing Pipeline",
          "supportingTerms": [
            "Tokenization (Splitting sentences into lowercase word tokens)",
            "Stopword Removal (Filtering uninformative words: 'the', 'is', 'at')",
            "Lemmatization (Reducing inflected words to root dictionary form: 'running' $\\to$ 'run')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d1-b3-structured-vs-unstructured-data",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "NLP Preprocessing Steps ('The products are AMAZING!')",
              "boxes": [
                {
                  "label": "Raw String",
                  "value": "'The products are AMAZING!'",
                  "varType": "Raw Inflow",
                  "isUpdated": false
                },
                {
                  "label": "Lowercasing & Tokenization",
                  "value": "['the', 'products', 'are', 'amazing']",
                  "varType": "Tokens",
                  "isUpdated": false
                },
                {
                  "label": "Stopword Filtered & Lemmatized",
                  "value": "['product', 'amaze'] (Pure informative features!)",
                  "varType": "Clean Output",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "nlp_clean_demo.js",
            "initialCode": "function cleanTextTokens(rawText) {\n  const stopwords = new Set(['the', 'is', 'are', 'a', 'and', 'with']);\n  const tokens = rawText.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\\s+/);\n  const filtered = tokens.filter(t => !stopwords.has(t));\n  return {\n    rawTokenCount: tokens.length,\n    cleanTokenCount: filtered.length,\n    cleanTokens: filtered,\n    status: 'TEXT_PREPROCESSED'\n  };\n}\n\nconsole.log(JSON.stringify(cleanTextTokens('The product is great and shipping was fast')));",
            "expectedOutput": "{\"rawTokenCount\":8,\"cleanTokenCount\":5,\"cleanTokens\":[\"product\",\"great\",\"shipping\",\"was\",\"fast\"],\"status\":\"TEXT_PREPROCESSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What NLP step breaks a raw customer review paragraph into an array of individual lowercase word tokens?",
          "expectedStringOutput": "Tokenization",
          "acceptableAnswers": [
            "Tokenization",
            "tokenization",
            "Tokenize"
          ],
          "primaryMisconceptionId": "MC_ANA_TEXT_ANALYTICS_NLP_SENTIMENT_SCORING",
          "diagnosisMap": {
            "STOPWORD": {
              "misconceptionId": "MC_ANA_TEXT_ANALYTICS_NLP_SENTIMENT_SCORING",
              "errorExplanation": "Stopword removal filters words. Breaking text into word units is Tokenization.",
              "recoveryPath": {
                "simplerExplanation": "Splitting text into words is Tokenization.",
                "guidedFixPrompt": "Type Tokenization"
              }
            }
          }
        }
      },
      {
        "id": "ana-d25-b2-lexicon-sentiment-scoring",
        "day": 25,
        "blockNumber": 2,
        "title": "Lexicon-Based Sentiment Scoring & Valence Aggregation",
        "conceptBudget": {
          "primaryConcept": "Lexicon Sentiment Scoring",
          "supportingTerms": [
            "Valence weights (e.g. 'great' = +3, 'fast' = +2, 'broken' = -3, 'terrible' = -4)",
            "Sentence Valence Sum ($S = \\sum w_i$)",
            "Polarity Classification (Positive: $S > 0$, Negative: $S < 0$, Neutral: $S = 0$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d25-b1-tokenization-and-text-cleaning",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Sentiment Lexicon Valence Math",
            "codeSnippet": "Review: 'Great product with fast shipping'\n'great'   -> +3\n'fast'    -> +2\nTotal Net Score = +3 + 2 = +5 -> POSITIVE_SENTIMENT",
            "lineNotes": {
              "2": "Positive word weight.",
              "3": "Positive speed modifier.",
              "4": "Aggregated polarity classification."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sentiment_calc_demo.js",
            "initialCode": "function scoreSentiment(text) {\n  const lexicon = { great: 3, fast: 2, good: 1, broken: -3, terrible: -4, slow: -2 };\n  const words = text.toLowerCase().split(/\\s+/);\n  let score = 0;\n  words.forEach(w => {\n    if (lexicon[w]) score += lexicon[w];\n  });\n  return {\n    netSentimentScore: score,\n    polarity: score > 0 ? 'POSITIVE_SENTIMENT' : (score < 0 ? 'NEGATIVE_SENTIMENT' : 'NEUTRAL_SENTIMENT'),\n    status: 'SENTIMENT_SCORED'\n  };\n}\n\nconsole.log(JSON.stringify(scoreSentiment('Great product with fast delivery')));\nconsole.log(JSON.stringify(scoreSentiment('Broken item with terrible support')));",
            "expectedOutput": "{\"netSentimentScore\":5,\"polarity\":\"POSITIVE_SENTIMENT\",\"status\":\"SENTIMENT_SCORED\"}\n{\"netSentimentScore\":-7,\"polarity\":\"NEGATIVE_SENTIMENT\",\"status\":\"SENTIMENT_SCORED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the net sentiment score for the review 'Great product with fast delivery' when 'great' = +3 and 'fast' = +2 ($+3 + 2$)?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "+5",
            "5.0",
            "netSentimentScore\":5"
          ],
          "primaryMisconceptionId": "MC_ANA_TEXT_ANALYTICS_NLP_SENTIMENT_SCORING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_ANA_TEXT_ANALYTICS_NLP_SENTIMENT_SCORING",
              "errorExplanation": "Score is the sum of valence weights: 3 + 2 = +5.",
              "recoveryPath": {
                "simplerExplanation": "3 + 2 = 5.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      },
      {
        "id": "ana-d25-b3-net-sentiment-score-nss",
        "day": 25,
        "blockNumber": 3,
        "title": "Net Sentiment Score (NSS): Corporate Brand Health Metric",
        "conceptBudget": {
          "primaryConcept": "Net Sentiment Score (NSS) Formula",
          "supportingTerms": [
            "$\\text{NSS} = \\frac{\\text{Positive Reviews} - \\text{Negative Reviews}}{\\text{Total Reviews}} \\times 100\\%$",
            "Range: $-100\\% \\text{ to } +100\\%$",
            "Executive brand reputation tracking over time"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d25-b2-lexicon-sentiment-scoring",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "nss_calc_demo.js",
            "initialCode": "function calculateNss(pos, neg, total) {\n  const nss = ((pos - neg) / total) * 100;\n  return {\n    positiveReviews: pos,\n    negativeReviews: neg,\n    totalReviews: total,\n    netSentimentScorePercent: Number(nss.toFixed(2)),\n    status: 'NSS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateNss(70, 10, 100)));",
            "expectedOutput": "{\"positiveReviews\":70,\"negativeReviews\":10,\"totalReviews\":100,\"netSentimentScorePercent\":60,\"status\":\"NSS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Net Sentiment Score (NSS) percentage for a brand with 70 positive reviews and 10 negative reviews out of 100 total reviews ($ (70 - 10) / 100 \\times 100 $)?",
          "expectedStringOutput": "60",
          "acceptableAnswers": [
            "60",
            "60%",
            "60.0",
            "netSentimentScorePercent\":60"
          ],
          "primaryMisconceptionId": "MC_ANA_TEXT_ANALYTICS_NLP_SENTIMENT_SCORING",
          "diagnosisMap": {
            "70": {
              "misconceptionId": "MC_ANA_TEXT_ANALYTICS_NLP_SENTIMENT_SCORING",
              "errorExplanation": "70 is positive percentage. NSS subtracts negatives: (70 - 10) = 60%.",
              "recoveryPath": {
                "simplerExplanation": "70 - 10 = 60%.",
                "guidedFixPrompt": "Type 60"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Fraud Analytics & Anomaly Detection: Benford's Law & Z-Score Isolation",
    "overviewMetaphor": "Benford's Law is Nature's Forensic Audit Stamp on Authentic Accounting Ledgers: when fraudsters fabricate fake expense receipts, human psychology causes them to invent numbers starting with digits 4, 5, 6, and 7 uniformly; but in genuine, naturally occurring financial ledgers (invoices, market caps, populations), Benford's Law mathematically dictates that the first digit '1' MUST appear approximately 30.1% of the time, while '9' appears only 4.6% of the time; any invoice book where digit 1 occurs only 5% of the time is immediately flagged for forensic fraud investigation.",
    "blocks": [
      {
        "id": "ana-d26-b1-benfords-law-distribution",
        "day": 26,
        "blockNumber": 1,
        "title": "Benford's Law: First-Digit Probability Distribution ($P(d) = \\log_{10}(1 + 1/d)$)",
        "conceptBudget": {
          "primaryConcept": "Benford's Law First-Digit Distribution",
          "supportingTerms": [
            "$P(d) = \\log_{10}\\left(1 + \\frac{1}{d}\\right)$ for $d \\in \\{1, 2, \\dots, 9\\}$",
            "Digit 1: 30.10% probability",
            "Digit 2: 17.61%",
            "Digit 9: 4.58%",
            "Testing corporate accounting books for fabricated fraudulent transactions"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d6-b1-normal-distribution-empirical-rule",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Benford's Law Expected First-Digit Frequencies",
              "boxes": [
                {
                  "label": "Digit 1 Frequency",
                  "value": "log10(1 + 1/1) = log10(2) = 30.10% (Nearly 1 out of 3 transactions!)",
                  "varType": "Digit 1",
                  "isUpdated": false
                },
                {
                  "label": "Digit 2 Frequency",
                  "value": "log10(1 + 1/2) = log10(1.5) = 17.61%",
                  "varType": "Digit 2",
                  "isUpdated": false
                },
                {
                  "label": "Digit 9 Frequency",
                  "value": "log10(1 + 1/9) = log10(1.111) = 4.58% (Rarest leading digit!)",
                  "varType": "Digit 9",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "benford_calc_demo.js",
            "initialCode": "function getBenfordExpected(d) {\n  const prob = Math.log10(1 + 1 / d) * 100;\n  return {\n    leadingDigit: d,\n    expectedFrequencyPercent: Number(prob.toFixed(2)),\n    status: 'BENFORD_PROBABILITY_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(getBenfordExpected(1)));\nconsole.log(JSON.stringify(getBenfordExpected(9)));",
            "expectedOutput": "{\"leadingDigit\":1,\"expectedFrequencyPercent\":30.1,\"status\":\"BENFORD_PROBABILITY_COMPUTED\"}\n{\"leadingDigit\":9,\"expectedFrequencyPercent\":4.58,\"status\":\"BENFORD_PROBABILITY_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "According to Benford's Law, what is the expected theoretical frequency percentage for the leading first digit '1' in authentic accounting ledgers?",
          "expectedStringOutput": "30.1",
          "acceptableAnswers": [
            "30.1",
            "30.1%",
            "30.10",
            "expectedFrequencyPercent\":30.1"
          ],
          "primaryMisconceptionId": "MC_ANA_FRAUD_ANOMALY_DETECTION_BENFORD_OUTLIERS",
          "diagnosisMap": {
            "11.1": {
              "misconceptionId": "MC_ANA_FRAUD_ANOMALY_DETECTION_BENFORD_OUTLIERS",
              "errorExplanation": "11.1% (1/9) assumes a uniform random distribution. Naturally occurring ledgers follow Benford's logarithmic scale where Digit 1 occurs 30.1% of the time.",
              "recoveryPath": {
                "simplerExplanation": "Digit 1 frequency is 30.1%.",
                "guidedFixPrompt": "Type 30.1"
              }
            }
          }
        }
      },
      {
        "id": "ana-d26-b2-benford-divergence-fraud-alert",
        "day": 26,
        "blockNumber": 2,
        "title": "Divergence Testing & Fraud Auditing with Chi-Square",
        "conceptBudget": {
          "primaryConcept": "Benford Fraud Divergence",
          "supportingTerms": [
            "$\\chi^2 = \\sum_{d=1}^9 \\frac{(O_d - E_d)^2}{E_d}$",
            "Z-Score test for individual digit anomalies",
            "Flagging fake invoice vendors and inflated expense accounts"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d26-b1-benfords-law-distribution",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "benford_audit_demo.js",
            "initialCode": "function auditBenfordConformity(observedDigit1Pct) {\n  const diff = Math.abs(observedDigit1Pct - 30.1);\n  const isAnomaly = diff > 10.0;\n  return {\n    observedDigit1Percent: observedDigit1Pct,\n    isFraudAnomalySuspected: isAnomaly,\n    auditRecommendation: isAnomaly ? 'AUDIT_FLAG_SUSPECTED_FABRICATED_TRANSACTIONS' : 'BENFORD_CONFORMITY_VALIDATED',\n    status: 'BENFORD_AUDIT_EVALUATED'\n  };\n}\n\nconsole.log(auditBenfordConformity(29.5).auditRecommendation);\nconsole.log(auditBenfordConformity(8.0).auditRecommendation); // Massive deviation!",
            "expectedOutput": "BENFORD_CONFORMITY_VALIDATED\nAUDIT_FLAG_SUSPECTED_FABRICATED_TRANSACTIONS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit action is triggered when an invoice ledger contains leading digit 1 only 8.0% of the time (deviating massively from the 30.1% Benford expectation)?",
          "expectedStringOutput": "AUDIT_FLAG_SUSPECTED_FABRICATED_TRANSACTIONS",
          "acceptableAnswers": [
            "AUDIT_FLAG_SUSPECTED_FABRICATED_TRANSACTIONS",
            "Audit Flag",
            "Suspected fabricated transactions"
          ],
          "primaryMisconceptionId": "MC_ANA_FRAUD_ANOMALY_DETECTION_BENFORD_OUTLIERS",
          "diagnosisMap": {
            "VALID": {
              "misconceptionId": "MC_ANA_FRAUD_ANOMALY_DETECTION_BENFORD_OUTLIERS",
              "errorExplanation": "8% vs 30.1% indicates human number fabrication.",
              "recoveryPath": {
                "simplerExplanation": "Severe divergence triggers audit flag.",
                "guidedFixPrompt": "Type AUDIT_FLAG_SUSPECTED_FABRICATED_TRANSACTIONS"
              }
            }
          }
        }
      },
      {
        "id": "ana-d26-b3-isolation-forests-multivariate-fraud",
        "day": 26,
        "blockNumber": 3,
        "title": "Multi-Variate Anomaly Detection: Isolation Forests",
        "conceptBudget": {
          "primaryConcept": "Isolation Forest Algorithm",
          "supportingTerms": [
            "Isolates anomalies instead of profiling normal points",
            "Tree depth to isolation: Anomalies isolate very quickly with short paths",
            "Anomaly score calculation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d26-b2-benford-divergence-fraud-alert",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "isolation_demo.js",
            "initialCode": "function evaluateIsolationPath(averagePathLength) {\n  return averagePathLength < 3.0\n    ? 'SHORT_PATH_ISOLATION_ANOMALY_DETECTED'\n    : 'NORMAL_OPERATIONAL_TRANSACTION';\n}\n\nconsole.log(evaluateIsolationPath(1.8));\nconsole.log(evaluateIsolationPath(8.5));",
            "expectedOutput": "SHORT_PATH_ISOLATION_ANOMALY_DETECTED\nNORMAL_OPERATIONAL_TRANSACTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "In an Isolation Forest algorithm, how is a data point classified when it isolates extremely quickly with a very short average tree path length (< 3.0)?",
          "expectedStringOutput": "SHORT_PATH_ISOLATION_ANOMALY_DETECTED",
          "acceptableAnswers": [
            "SHORT_PATH_ISOLATION_ANOMALY_DETECTED",
            "Anomaly",
            "Outlier"
          ],
          "primaryMisconceptionId": "MC_ANA_FRAUD_ANOMALY_DETECTION_BENFORD_OUTLIERS",
          "diagnosisMap": {
            "NORMAL": {
              "misconceptionId": "MC_ANA_FRAUD_ANOMALY_DETECTION_BENFORD_OUTLIERS",
              "errorExplanation": "Anomalies require very few splits to isolate (short paths).",
              "recoveryPath": {
                "simplerExplanation": "Short path signifies an anomaly.",
                "guidedFixPrompt": "Type SHORT_PATH_ISOLATION_ANOMALY_DETECTED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Supply Chain & Queueing Analytics: Little's Law & $M/M/1$ Bottlenecks",
    "overviewMetaphor": "Little's Law is the Universal Law of Highway Traffic and Warehouse Inventory: $L = \\lambda W$ (Average Number of Cars on the Highway = Arrival Rate of Cars per hour $\\times$ Average Time Spent in Traffic); in an e-commerce fulfillment warehouse, if 100 orders arrive per hour ($\\lambda = 100$) and each order takes 2 hours to pack and ship ($W = 2$), there will ALWAYS be exactly 200 orders sitting on warehouse shelves ($L = 200$); server utilization $\\rho = \\frac{\\lambda}{\\mu} = 80\\%$ warns management before lines explode exponentially.",
    "blocks": [
      {
        "id": "ana-d27-b1-littles-law-equation",
        "day": 27,
        "blockNumber": 1,
        "title": "Little's Law Formula: $L = \\lambda W$",
        "conceptBudget": {
          "primaryConcept": "Little's Law Fundamental Equation",
          "supportingTerms": [
            "$L = \\lambda W$",
            "$L$ (Average number of units/customers in the system / Work-In-Progress WIP)",
            "$\\lambda$ (Average throughput / arrival rate per unit time)",
            "$W$ (Average cycle time / wait time in the system)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d18-b1-eoq-formula-and-derivation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Little's Law Math (Throughput $\\lambda = 100 \\text{ orders/hr}, W = 2.0 \\text{ hrs}$)",
              "boxes": [
                {
                  "label": "Arrival / Throughput Rate (Lambda)",
                  "value": "100 orders / hour",
                  "varType": "Throughput",
                  "isUpdated": false
                },
                {
                  "label": "Average Cycle Time (W)",
                  "value": "2.0 hours from order receipt to dispatch",
                  "varType": "Cycle Time",
                  "isUpdated": false
                },
                {
                  "label": "Average Work-in-Progress (L)",
                  "value": "L = 100 x 2.0 = EXACTLY 200 Orders in Warehouse WIP!",
                  "varType": "WIP Units",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "littles_law_demo.js",
            "initialCode": "function calculateLittlesLaw(lambda, w) {\n  const l = lambda * w;\n  return {\n    arrivalRateLambda: lambda,\n    cycleTimeW: w,\n    wipInventoryL: l,\n    status: 'LITTLES_LAW_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateLittlesLaw(100, 2.0)));",
            "expectedOutput": "{\"arrivalRateLambda\":100,\"cycleTimeW\":2,\"wipInventoryL\":200,\"status\":\"LITTLES_LAW_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the average Work-in-Progress ($L$) in a warehouse when order throughput is 100 orders/hour and average cycle time is 2 hours ($100 \\times 2$)?",
          "expectedStringOutput": "200",
          "acceptableAnswers": [
            "200",
            "200 orders",
            "200.0",
            "wipInventoryL\":200"
          ],
          "primaryMisconceptionId": "MC_ANA_QUEUEING_THEORY_LITTLES_LAW_BOTTLENECK",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_ANA_QUEUEING_THEORY_LITTLES_LAW_BOTTLENECK",
              "errorExplanation": "50 divides 100 by 2. Little's Law multiplies them: L = lambda * W = 100 * 2 = 200.",
              "recoveryPath": {
                "simplerExplanation": "100 * 2 = 200.",
                "guidedFixPrompt": "Type 200"
              }
            }
          }
        }
      },
      {
        "id": "ana-d27-b2-mm1-queue-congestion",
        "day": 27,
        "blockNumber": 2,
        "title": "The $M/M/1$ Queueing Model: Server Utilization ($\\rho$) & Wait Times",
        "conceptBudget": {
          "primaryConcept": "M/M/1 Queueing Formulas",
          "supportingTerms": [
            "Server Utilization: $\\rho = \\frac{\\lambda}{\\mu}$ (Must be $< 1.0$ for stability!)",
            "Average Waiting Time in Queue: $W_q = \\frac{\\lambda}{\\mu(\\mu - \\lambda)}$",
            "Non-linear queue explosion as utilization approaches 100%"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d27-b1-littles-law-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "M/M/1 Queueing Math (Arrivals $\\lambda = 8/\\text{hr}$, Service Rate $\\mu = 10/\\text{hr}$)",
            "codeSnippet": "Utilization rho = 8 / 10 = 0.80 (80% busy)\nWait Time Wq = 8 / (10 * (10 - 8)) = 8 / 20 = 0.40 Hours (24 mins waiting!)\nQueue Length Lq = lambda * Wq = 8 * 0.40 = 3.2 Customers in line",
            "lineNotes": {
              "1": "Server load percentage.",
              "2": "Average wait time.",
              "3": "Queue depth."
            }
          },
          {
            "type": "runnable_code",
            "filename": "mm1_calc_demo.js",
            "initialCode": "function calculateQueueMetrics(lambda, mu) {\n  const rho = lambda / mu;\n  const wq = lambda / (mu * (mu - lambda));\n  const lq = lambda * wq;\n  return {\n    serverUtilizationRho: Number(rho.toFixed(2)),\n    waitTimeHours: Number(wq.toFixed(2)),\n    waitTimeMinutes: Number((wq * 60).toFixed(1)),\n    queueLengthLq: Number(lq.toFixed(2)),\n    status: 'QUEUE_METRICS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateQueueMetrics(8, 10)));",
            "expectedOutput": "{\"serverUtilizationRho\":0.8,\"waitTimeHours\":0.4,\"waitTimeMinutes\":24,\"queueLengthLq\":3.2,\"status\":\"QUEUE_METRICS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the server utilization ratio ($\\rho$) when arrival rate $\\lambda = 8$ customers/hour and service rate $\\mu = 10$ customers/hour ($8 / 10$)?",
          "expectedStringOutput": "0.8",
          "acceptableAnswers": [
            "0.8",
            "0.80",
            "80%",
            "serverUtilizationRho\":0.8"
          ],
          "primaryMisconceptionId": "MC_ANA_QUEUEING_THEORY_LITTLES_LAW_BOTTLENECK",
          "diagnosisMap": {
            "1.25": {
              "misconceptionId": "MC_ANA_QUEUEING_THEORY_LITTLES_LAW_BOTTLENECK",
              "errorExplanation": "1.25 is mu / lambda. Utilization is lambda / mu = 8 / 10 = 0.80.",
              "recoveryPath": {
                "simplerExplanation": "8 / 10 = 0.80.",
                "guidedFixPrompt": "Type 0.8"
              }
            }
          }
        }
      },
      {
        "id": "ana-d27-b3-theory-of-constraints-bottlenecks",
        "day": 27,
        "blockNumber": 3,
        "title": "Goldratt's Theory of Constraints (TOC) & Bottleneck Optimization",
        "conceptBudget": {
          "primaryConcept": "Theory of Constraints Invariants",
          "supportingTerms": [
            "An entire factory pipeline throughput is dictated by its single slowest bottleneck machine",
            "Elevating the constraint",
            "Drum-Buffer-Rope scheduling"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d27-b2-mm1-queue-congestion",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bottleneck_demo.js",
            "initialCode": "function findSystemBottleneck(stages) {\n  let slowest = stages[0];\n  stages.forEach(s => {\n    if (s.capacityPerHour < slowest.capacityPerHour) slowest = s;\n  });\n  return {\n    bottleneckStage: slowest.name,\n    maxSystemThroughputPerHour: slowest.capacityPerHour,\n    status: 'BOTTLENECK_IDENTIFIED'\n  };\n}\n\nconst stages = [\n  { name: 'Stage_1_Cutting', capacityPerHour: 100 },\n  { name: 'Stage_2_Painting', capacityPerHour: 30 },\n  { name: 'Stage_3_Packaging', capacityPerHour: 80 }\n];\nconsole.log(findSystemBottleneck(stages).bottleneckStage);",
            "expectedOutput": "Stage_2_Painting",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which production stage dictates the maximum throughput of the factory when Stage 1 = 100/hr, Stage 2 = 30/hr, and Stage 3 = 80/hr?",
          "expectedStringOutput": "Stage_2_Painting",
          "acceptableAnswers": [
            "Stage_2_Painting",
            "Stage 2 Painting",
            "Stage 2"
          ],
          "primaryMisconceptionId": "MC_ANA_QUEUEING_THEORY_LITTLES_LAW_BOTTLENECK",
          "diagnosisMap": {
            "STAGE_1": {
              "misconceptionId": "MC_ANA_QUEUEING_THEORY_LITTLES_LAW_BOTTLENECK",
              "errorExplanation": "The stage with the lowest capacity (Stage 2 at 30/hr) is the bottleneck that limits the entire system.",
              "recoveryPath": {
                "simplerExplanation": "Lowest capacity is Stage_2_Painting.",
                "guidedFixPrompt": "Type Stage_2_Painting"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Marketing Attribution Modeling: Multi-Touch Attribution (MTA)",
    "overviewMetaphor": "Marketing Attribution is Crediting Players on a Football Team for Scoring a Goal: Last-Touch Attribution gives 100% of the glory to the striker who tapped the ball into the net; First-Touch gives 100% of the glory to the defender who stole the ball; Linear Multi-Touch Attribution (MTA) divides the revenue equally across all touches (e.g. $90 order across Google Ad, Facebook Ad, Direct Visit $\\implies \\$30$ to each channel); Time-Decay Attribution gives exponential weight to recent touches.",
    "blocks": [
      {
        "id": "ana-d28-b1-attribution-models-comparison",
        "day": 28,
        "blockNumber": 1,
        "title": "Attribution Models: First-Touch, Last-Touch & Linear MTA",
        "conceptBudget": {
          "primaryConcept": "Multi-Touch Marketing Attribution",
          "supportingTerms": [
            "First-Touch Attribution (100% credit to initial discovery channel)",
            "Last-Touch Attribution (100% credit to final converting click: Overvalues retargeting!)",
            "Linear Attribution (Equal split: $\\frac{\\text{Revenue}}{n}$ to each touchpoint)",
            "Position-Based / U-Shaped (40% First, 40% Last, 20% Middle split)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d13-b1-rfm-scoring-methodology",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Linear Attribution Allocation ($90 Order across 3 Touches)",
              "boxes": [
                {
                  "label": "1. Google Search Ad",
                  "value": "$90 / 3 = $30.00 Revenue Credit",
                  "varType": "Touch 1",
                  "isUpdated": false
                },
                {
                  "label": "2. Facebook Retargeting",
                  "value": "$90 / 3 = $30.00 Revenue Credit",
                  "varType": "Touch 2",
                  "isUpdated": false
                },
                {
                  "label": "3. Direct Email Link",
                  "value": "$90 / 3 = $30.00 Revenue Credit",
                  "varType": "Touch 3",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "attribution_demo.js",
            "initialCode": "function calculateLinearAttribution(touchpoints, totalRevenue) {\n  const split = totalRevenue / touchpoints.length;\n  const creditMap = {};\n  touchpoints.forEach(t => {\n    creditMap[t] = Number(split.toFixed(2));\n  });\n  return {\n    model: 'LINEAR_ATTRIBUTION',\n    allocatedCredits: creditMap,\n    status: 'ATTRIBUTION_ALLOCATED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateLinearAttribution(['Google_Ad', 'Facebook_Ad', 'Direct_Visit'], 90)));",
            "expectedOutput": "{\"model\":\"LINEAR_ATTRIBUTION\",\"allocatedCredits\":{\"Google_Ad\":30,\"Facebook_Ad\":30,\"Direct_Visit\":30},\"status\":\"ATTRIBUTION_ALLOCATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Under the Linear Attribution model, how much revenue credit is assigned to Google_Ad when a $90 purchase involves 3 distinct touchpoints ($90 / 3$)?",
          "expectedStringOutput": "30",
          "acceptableAnswers": [
            "30",
            "$30",
            "30.0",
            "30.00"
          ],
          "primaryMisconceptionId": "MC_ANA_MARKETING_ATTRIBUTION_MULTI_TOUCH_MODELS",
          "diagnosisMap": {
            "90": {
              "misconceptionId": "MC_ANA_MARKETING_ATTRIBUTION_MULTI_TOUCH_MODELS",
              "errorExplanation": "90 is First-Touch credit. Linear attribution divides $90 equally across 3 touches = $30.",
              "recoveryPath": {
                "simplerExplanation": "90 / 3 = 30.",
                "guidedFixPrompt": "Type 30"
              }
            }
          }
        }
      },
      {
        "id": "ana-d28-b2-markov-chain-attribution",
        "day": 28,
        "blockNumber": 2,
        "title": "Algorithmic Attribution: Markov Chains & Removal Effect",
        "conceptBudget": {
          "primaryConcept": "Markov Chain Attribution",
          "supportingTerms": [
            "State Transition Probability Matrix",
            "Removal Effect: Removing Channel $X$ and calculating the percentage drop in total conversion probability",
            "Data-Driven Shapley Value attribution"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d28-b1-attribution-models-comparison",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Markov Removal Effect Logic",
            "codeSnippet": "// Baseline overall conversion probability = 10%\n// Remove 'Facebook_Ad' from user paths -> Conversion drops to 6%\n// Removal Effect = (10 - 6) / 10 = 0.40 (Facebook contributed 40% of conversion lift!)",
            "lineNotes": {
              "1": "Baseline conversion rate.",
              "2": "Ablation test.",
              "3": "Removal effect weight."
            }
          },
          {
            "type": "runnable_code",
            "filename": "markov_demo.js",
            "initialCode": "function calculateRemovalEffect(baselineProb, removedProb) {\n  const effect = (baselineProb - removedProb) / baselineProb;\n  return {\n    removalEffectWeight: Number(effect.toFixed(2)),\n    status: 'MARKOV_REMOVAL_EFFECT_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateRemovalEffect(0.10, 0.06)));",
            "expectedOutput": "{\"removalEffectWeight\":0.4,\"status\":\"MARKOV_REMOVAL_EFFECT_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the removal effect weight for a channel when baseline conversion is 0.10 and drops to 0.06 upon removing the channel ($ (0.10 - 0.06) / 0.10 $)?",
          "expectedStringOutput": "0.4",
          "acceptableAnswers": [
            "0.4",
            "0.40",
            "40%",
            "removalEffectWeight\":0.4"
          ],
          "primaryMisconceptionId": "MC_ANA_MARKETING_ATTRIBUTION_MULTI_TOUCH_MODELS",
          "diagnosisMap": {
            "0.04": {
              "misconceptionId": "MC_ANA_MARKETING_ATTRIBUTION_MULTI_TOUCH_MODELS",
              "errorExplanation": "0.04 is the absolute difference. Normalized removal effect is 0.04 / 0.10 = 0.40.",
              "recoveryPath": {
                "simplerExplanation": "0.04 / 0.10 = 0.40.",
                "guidedFixPrompt": "Type 0.4"
              }
            }
          }
        }
      },
      {
        "id": "ana-d28-b3-roas-and-mer",
        "day": 28,
        "blockNumber": 3,
        "title": "Return on Ad Spend (ROAS) & Marketing Efficiency Ratio (MER)",
        "conceptBudget": {
          "primaryConcept": "ROAS & MER Formulas",
          "supportingTerms": [
            "$\\text{ROAS} = \\frac{\\text{Attributed Revenue}}{\\text{Ad Spend}}$",
            "Marketing Efficiency Ratio: $\\text{MER} = \\frac{\\text{Total Company Gross Revenue}}{\\text{Total Marketing Spend}}$",
            "Blended CAC vs Platform-Reported CAC"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d28-b2-markov-chain-attribution",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "roas_demo.js",
            "initialCode": "function calculateRoas(revenue, spend) {\n  const roas = revenue / spend;\n  return {\n    attributedRevenue: revenue,\n    adSpend: spend,\n    roasMultiple: Number(roas.toFixed(2)),\n    isProfitable: roas >= 3.0,\n    status: 'ROAS_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateRoas(50000, 10000)));",
            "expectedOutput": "{\"attributedRevenue\":50000,\"adSpend\":10000,\"roasMultiple\":5,\"isProfitable\":true,\"status\":\"ROAS_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Return on Ad Spend (ROAS) multiple when $10,000 in advertising spend generates $50,000 in attributed revenue ($50,000 / 10,000$)?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "5.0",
            "5x",
            "5.0x",
            "roasMultiple\":5"
          ],
          "primaryMisconceptionId": "MC_ANA_MARKETING_ATTRIBUTION_MULTI_TOUCH_MODELS",
          "diagnosisMap": {
            "0.20": {
              "misconceptionId": "MC_ANA_MARKETING_ATTRIBUTION_MULTI_TOUCH_MODELS",
              "errorExplanation": "0.20 is spend/revenue. ROAS is Revenue / Spend = 50k / 10k = 5.0x.",
              "recoveryPath": {
                "simplerExplanation": "50,000 / 10,000 = 5.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "AI Decision Intelligence & Data Ethics / Statutory Privacy",
    "overviewMetaphor": "Algorithmic Ethics is the Moral Compass and Airbag of Autonomous Decision Intelligence: deploying an AI credit scoring or hiring engine without ethical auditing can accidentally discriminate against demographic groups; the Four-Fifths (80%) Rule tests for Disparate Impact (Selection Rate Group B / Selection Rate Group A $\\ge 0.80$); statutory compliance frameworks (GDPR & India's Digital Personal Data Protection Act 2023) protect fundamental consumer privacy rights.",
    "blocks": [
      {
        "id": "ana-d29-b1-disparate-impact-four-fifths-rule",
        "day": 29,
        "blockNumber": 1,
        "title": "Algorithmic Fairness: Disparate Impact & The EEOC Four-Fifths (80%) Rule",
        "conceptBudget": {
          "primaryConcept": "EEOC 4/5ths Disparate Impact Rule",
          "supportingTerms": [
            "Disparate Impact Ratio: $\\text{DIR} = \\frac{\\text{Selection Rate of Protected Group}}{\\text{Selection Rate of Benchmark Group}}$",
            "Four-Fifths Rule: If $\\text{DIR} < 0.80$ (80%), the AI decision model is legally presumed biased!",
            "Fairness through unawareness fallacies (Proxy variables)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d12-b1-confusion-matrix-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Algorithmic Fairness Audit (Group A: 50% Selected, Group B: 42% Selected)",
              "boxes": [
                {
                  "label": "Group A Selection Rate",
                  "value": "Rate A = 0.50 (50% approved)",
                  "varType": "Rate A",
                  "isUpdated": false
                },
                {
                  "label": "Group B Selection Rate",
                  "value": "Rate B = 0.42 (42% approved)",
                  "varType": "Rate B",
                  "isUpdated": false
                },
                {
                  "label": "Disparate Impact Ratio",
                  "value": "0.42 / 0.50 = 0.84 (84% >= 80% threshold -> PASSES FOUR-FIFTHS FAIRNESS AUDIT!)",
                  "varType": "DIR Result",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "fairness_demo.js",
            "initialCode": "function auditFairness(rateA, rateB) {\n  const dir = rateB / rateA;\n  const passes = dir >= 0.80;\n  return {\n    disparateImpactRatio: Number(dir.toFixed(2)),\n    passesFourFifthsRule: passes,\n    status: passes ? 'ALGORITHMIC_FAIRNESS_COMPLIANT' : 'DISPARATE_IMPACT_BIAS_DETECTED'\n  };\n}\n\nconsole.log(JSON.stringify(auditFairness(0.50, 0.42)));\nconsole.log(JSON.stringify(auditFairness(0.50, 0.35))); // 0.35 / 0.50 = 0.70 < 0.80 -> Biased!",
            "expectedOutput": "{\"disparateImpactRatio\":0.84,\"passesFourFifthsRule\":true,\"status\":\"ALGORITHMIC_FAIRNESS_COMPLIANT\"}\n{\"disparateImpactRatio\":0.7,\"passesFourFifthsRule\":false,\"status\":\"DISPARATE_IMPACT_BIAS_DETECTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Disparate Impact Ratio when Group B selection rate is 0.42 and Group A selection rate is 0.50 ($0.42 / 0.50$)?",
          "expectedStringOutput": "0.84",
          "acceptableAnswers": [
            "0.84",
            "84%",
            "disparateImpactRatio\":0.84"
          ],
          "primaryMisconceptionId": "MC_ANA_DATA_LITERACY_TYPES_NOMINAL_ORDINAL_INTERVAL_RATIO",
          "diagnosisMap": {
            "0.80": {
              "misconceptionId": "MC_ANA_DATA_LITERACY_TYPES_NOMINAL_ORDINAL_INTERVAL_RATIO",
              "errorExplanation": "0.80 is the minimum threshold. 0.42 / 0.50 = 0.84.",
              "recoveryPath": {
                "simplerExplanation": "0.42 / 0.50 = 0.84.",
                "guidedFixPrompt": "Type 0.84"
              }
            }
          }
        }
      },
      {
        "id": "ana-d29-b2-explainable-ai-shap",
        "day": 29,
        "blockNumber": 2,
        "title": "Explainable AI (XAI): SHAP Values & Model Interpretability",
        "conceptBudget": {
          "primaryConcept": "Explainable AI (SHAP & LIME)",
          "supportingTerms": [
            "SHAP (SHapley Additive exPlanations: Rooted in cooperative game theory)",
            "Individual prediction explanation: How much did Feature X add or subtract from base probability?",
            "Regulatory requirement for 'Right to Explanation'"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d29-b1-disparate-impact-four-fifths-rule",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "shap_demo.js",
            "initialCode": "function explainPredictionShap(baseProb, featureShapContributions) {\n  let finalProb = baseProb;\n  featureShapContributions.forEach(f => {\n    finalProb += f.shapVal;\n  });\n  return {\n    baselinePopulationProbability: baseProb,\n    individualPredictedProbability: Number(finalProb.toFixed(2)),\n    status: 'EXPLAINABLE_AI_PREDICTION_DECOMPOSED'\n  };\n}\n\nconst shapList = [{ feature: 'Credit_Score_High', shapVal: -0.20 }, { feature: 'High_Debt_Ratio', shapVal: +0.35 }];\nconsole.log(JSON.stringify(explainPredictionShap(0.20, shapList)));",
            "expectedOutput": "{\"baselinePopulationProbability\":0.2,\"individualPredictedProbability\":0.35,\"status\":\"EXPLAINABLE_AI_PREDICTION_DECOMPOSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the final predicted default probability when base probability is 0.20 and SHAP feature contributions are -0.20 and +0.35 ($0.20 - 0.20 + 0.35$)?",
          "expectedStringOutput": "0.35",
          "acceptableAnswers": [
            "0.35",
            "35%",
            "individualPredictedProbability\":0.35"
          ],
          "primaryMisconceptionId": "MC_ANA_DATA_LITERACY_TYPES_NOMINAL_ORDINAL_INTERVAL_RATIO",
          "diagnosisMap": {
            "0.20": {
              "misconceptionId": "MC_ANA_DATA_LITERACY_TYPES_NOMINAL_ORDINAL_INTERVAL_RATIO",
              "errorExplanation": "0.20 is base. Adding net SHAP (+0.15) gives 0.35.",
              "recoveryPath": {
                "simplerExplanation": "0.20 - 0.20 + 0.35 = 0.35.",
                "guidedFixPrompt": "Type 0.35"
              }
            }
          }
        }
      },
      {
        "id": "ana-d29-b3-statutory-data-privacy-governance",
        "day": 29,
        "blockNumber": 3,
        "title": "Statutory Data Protection: GDPR & India DPDP Act 2023 Compliance",
        "conceptBudget": {
          "primaryConcept": "Statutory Data Privacy Compliance",
          "supportingTerms": [
            "Data Principal / Data Subject rights",
            "Data Fiduciary obligations",
            "Purpose Limitation & Data Minimization invariants",
            "Anonymization vs Pseudonymization"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d29-b2-explainable-ai-shap",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "privacy_demo.js",
            "initialCode": "function evaluateDataGovernance(hasConsent, purposeLimited) {\n  const isCompliant = hasConsent && purposeLimited;\n  return isCompliant\n    ? 'STATUTORY_PRIVACY_DPDP_GDPR_COMPLIANT'\n    : 'STATUTORY_DATA_BREACH_RISK';\n}\n\nconsole.log(evaluateDataGovernance(true, true));\nconsole.log(evaluateDataGovernance(false, true));",
            "expectedOutput": "STATUTORY_PRIVACY_DPDP_GDPR_COMPLIANT\nSTATUTORY_DATA_BREACH_RISK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What compliance status is achieved when data collection maintains explicit user consent and strict purpose limitation?",
          "expectedStringOutput": "STATUTORY_PRIVACY_DPDP_GDPR_COMPLIANT",
          "acceptableAnswers": [
            "STATUTORY_PRIVACY_DPDP_GDPR_COMPLIANT",
            "Compliant",
            "GDPR DPDP Compliant"
          ],
          "primaryMisconceptionId": "MC_ANA_DATA_LITERACY_TYPES_NOMINAL_ORDINAL_INTERVAL_RATIO",
          "diagnosisMap": {
            "BREACH": {
              "misconceptionId": "MC_ANA_DATA_LITERACY_TYPES_NOMINAL_ORDINAL_INTERVAL_RATIO",
              "errorExplanation": "Explicit consent and purpose limitation ensures full compliance.",
              "recoveryPath": {
                "simplerExplanation": "Matches STATUTORY_PRIVACY_DPDP_GDPR_COMPLIANT.",
                "guidedFixPrompt": "Type STATUTORY_PRIVACY_DPDP_GDPR_COMPLIANT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Integrated Enterprise Business Analytics & Decision Intelligence Suite",
    "overviewMetaphor": "Final Capstone Synthesis: The complete sovereign business analytics and decision intelligence suite: 1. Descriptive profiling and outlier cleansing; 2. Regression forecasting and inferential hypothesis testing; 3. Predictive CLV, churn, and RFM customer intelligence; 4. Operational pricing elasticity, EOQ inventory, and A/B test CRO optimization; 5. Prescriptive linear programming, fraud anomaly detection, and ethical AI decision governance.",
    "blocks": [
      {
        "id": "ana-d30-b1-enterprise-analytics-suite-synthesis",
        "day": 30,
        "blockNumber": 1,
        "title": "Enterprise Business Analytics & Decision Intelligence Master Architecture",
        "conceptBudget": {
          "primaryConcept": "Enterprise Analytics Architecture",
          "supportingTerms": [
            "Descriptive Subsystem",
            "Predictive Subsystem",
            "Customer Intelligence Subsystem",
            "Operational Subsystem",
            "Prescriptive AI Governance Subsystem"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d29-b3-statutory-data-privacy-governance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "30-Day Master Business Analytics Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Cleanses raw enterprise data & profiles descriptive statistics",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Fits OLS & Logistic regression models with VIF collinearity checks",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Segments customers into RFM tiers and computes CLV:CAC unit economics",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Optimizes price elasticity, EOQ inventory, and validates A/B experiments",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Solves Linear Programming resource allocation and audits AI fairness!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_ana_demo.js",
            "initialCode": "function runEnterpriseAnalyticsSuite() {\n  return {\n    descriptiveModule: 'ONLINE_PROFILING_ACTIVE',\n    predictiveModule: 'ONLINE_REGRESSION_ACTIVE',\n    customerModule: 'ONLINE_RFM_CLV_ACTIVE',\n    operationsModule: 'ONLINE_EOQ_AB_TEST_ACTIVE',\n    prescriptiveModule: 'ONLINE_LP_AI_GOVERNANCE_ACTIVE',\n    suiteStatus: 'BUSINESS_ANALYTICS_AND_DECISION_INTELLIGENCE_MASTER_CERTIFIED_NOMINAL'\n  };\n}\n\nconsole.log(runEnterpriseAnalyticsSuite().suiteStatus);",
            "expectedOutput": "BUSINESS_ANALYTICS_AND_DECISION_INTELLIGENCE_MASTER_CERTIFIED_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What master status confirms certified operational deployment of the complete 30-Day Business Analytics Suite?",
          "expectedStringOutput": "BUSINESS_ANALYTICS_AND_DECISION_INTELLIGENCE_MASTER_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "BUSINESS_ANALYTICS_AND_DECISION_INTELLIGENCE_MASTER_CERTIFIED_NOMINAL",
            "suiteStatus: BUSINESS_ANALYTICS_AND_DECISION_INTELLIGENCE_MASTER_CERTIFIED_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_ANA_CAPSTONE_ENTERPRISE_BUSINESS_DECISION_INTELLIGENCE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ANA_CAPSTONE_ENTERPRISE_BUSINESS_DECISION_INTELLIGENCE",
              "errorExplanation": "Matches BUSINESS_ANALYTICS_AND_DECISION_INTELLIGENCE_MASTER_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type BUSINESS_ANALYTICS_AND_DECISION_INTELLIGENCE_MASTER_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "ana-d30-b2-capstone-suite-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Enterprise Analytics 5-Pillar Comprehensive Audit",
        "conceptBudget": {
          "primaryConcept": "Enterprise Analytics Audit",
          "supportingTerms": [
            "Descriptive Verified",
            "Predictive Verified",
            "Customer Verified",
            "Operations Verified",
            "Prescriptive AI Verified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d30-b1-enterprise-analytics-suite-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_audit_demo.js",
            "initialCode": "function auditMasterAnalyticsSuite(d, p, c, o, pr) {\n  const ok = d && p && c && o && pr;\n  return {\n    allFivePillarsVerified: ok,\n    auditGrade: ok ? 'ENTERPRISE_BUSINESS_ANALYTICS_MASTER_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditMasterAnalyticsSuite(true, true, true, true, true)));",
            "expectedOutput": "{\"allFivePillarsVerified\":true,\"auditGrade\":\"ENTERPRISE_BUSINESS_ANALYTICS_MASTER_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when all 5 pillars of the Business Analytics and Decision Intelligence curriculum pass 100%?",
          "expectedStringOutput": "ENTERPRISE_BUSINESS_ANALYTICS_MASTER_AUDIT_PASSED",
          "acceptableAnswers": [
            "ENTERPRISE_BUSINESS_ANALYTICS_MASTER_AUDIT_PASSED",
            "auditGrade\":\"ENTERPRISE_BUSINESS_ANALYTICS_MASTER_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_ANA_CAPSTONE_ENTERPRISE_BUSINESS_DECISION_INTELLIGENCE",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_ANA_CAPSTONE_ENTERPRISE_BUSINESS_DECISION_INTELLIGENCE",
              "errorExplanation": "All checks passing awards ENTERPRISE_BUSINESS_ANALYTICS_MASTER_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards ENTERPRISE_BUSINESS_ANALYTICS_MASTER_AUDIT_PASSED.",
                "guidedFixPrompt": "Type ENTERPRISE_BUSINESS_ANALYTICS_MASTER_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "ana-d30-b3-final-capstone-cert",
        "day": 30,
        "blockNumber": 3,
        "title": "Final Capstone Business Analytics & Decision Intelligence Master Certification",
        "conceptBudget": {
          "primaryConcept": "Final Capstone Master Certification",
          "supportingTerms": [
            "30-Day Complete",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ana-d30-b2-capstone-suite-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "final_capstone_ana_cert.js",
            "initialCode": "console.log('🏆 FINAL CAPSTONE: Integrated Enterprise Business Analytics & Decision Intelligence Suite [VERIFIED 100%]');",
            "expectedOutput": "🏆 FINAL CAPSTONE: Integrated Enterprise Business Analytics & Decision Intelligence Suite [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Final Capstone completion across all 30 days of the Business Analytics curriculum?",
          "expectedStringOutput": "🏆 FINAL CAPSTONE: Integrated Enterprise Business Analytics & Decision Intelligence Suite [VERIFIED 100%]",
          "acceptableAnswers": [
            "🏆 FINAL CAPSTONE: Integrated Enterprise Business Analytics & Decision Intelligence Suite [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_ANA_CAPSTONE_ENTERPRISE_BUSINESS_DECISION_INTELLIGENCE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_ANA_CAPSTONE_ENTERPRISE_BUSINESS_DECISION_INTELLIGENCE",
              "errorExplanation": "Matches capstone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type 🏆 FINAL CAPSTONE: Integrated Enterprise Business Analytics & Decision Intelligence Suite [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  }
];
