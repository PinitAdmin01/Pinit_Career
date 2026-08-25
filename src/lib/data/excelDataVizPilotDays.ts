import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const EXCEL_DATA_VIZ_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Spreadsheet Grid Architecture: Cells, 2D Coordinates & Data Types",
    "overviewMetaphor": "A Spreadsheet Is a Massive 2D Battleship Game Grid: Every cell has a precise coordinate address like `B12` (Column B = horizontal index 1, Row 12 = vertical index 11); knowing that the grid holds 16,384 columns and 1,048,576 rows allows you to structure clean datasets without mixing data types (Text vs Floats vs Serial Dates).",
    "blocks": [
      {
        "id": "ex-d1-b1-cell-coordinate-parser",
        "day": 1,
        "blockNumber": 1,
        "title": "Cell Address Coordinate Parsing: `B12` $\\to$ `{ colIndex: 1, rowIndex: 11 }`",
        "conceptBudget": {
          "primaryConcept": "Cell Reference Coordinate Parsing",
          "supportingTerms": [
            "Cell Reference (`'B12'`)",
            "Column Letter (`'B'`)",
            "Row Number (`12`)",
            "0-Indexed Coordinates: `{ colIndex: 1, rowIndex: 11 }`",
            "Status: Cell Coordinate Parsed Nominal"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Spreadsheet Grid Coordinate & Addressing Ledger",
              "boxes": [
                {
                  "label": "Alphanumeric Address",
                  "value": "Cell Reference: 'B12'",
                  "varType": "String",
                  "isUpdated": false
                },
                {
                  "label": "Column Coordinate",
                  "value": "Column 'B' -> Base-26 Index 1 (2nd Column)",
                  "varType": "Col Index",
                  "isUpdated": false
                },
                {
                  "label": "Row Coordinate",
                  "value": "Row 12 -> 0-Indexed Row 11 (CELL COORDINATE PARSED NOMINAL!)",
                  "varType": "Row Index",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cell_parser_demo.js",
            "initialCode": "function parseCoord(ref) {\n  const match = ref.match(/^([A-Za-z]+)(\\d+)$/);\n  const col = match[1].toUpperCase();\n  const row = parseInt(match[2], 10);\n  let colIdx = 0;\n  for (let i = 0; i < col.length; i++) colIdx = colIdx * 26 + (col.charCodeAt(i) - 64);\n  return {\n    cellRef: ref.toUpperCase(),\n    colLetter: col,\n    rowNumber: row,\n    colIndex: colIdx - 1,\n    rowIndex: row - 1,\n    status: 'CELL_COORDINATE_PARSED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(parseCoord('B12')));",
            "expectedOutput": "{\"cellRef\":\"B12\",\"colLetter\":\"B\",\"rowNumber\":\"12\",\"colIndex\":1,\"rowIndex\":11,\"status\":\"CELL_COORDINATE_PARSED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the 0-indexed column index of cell reference 'B12' in a standard spreadsheet grid?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "colIndex\":1",
            "colIndex: 1"
          ],
          "primaryMisconceptionId": "MC_EX_SPREADSHEET_GRID_DATA_TYPES",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_EX_SPREADSHEET_GRID_DATA_TYPES",
              "errorExplanation": "2 is 1-indexed. In 0-indexed programming arrays, Column B is index 1 (A=0, B=1).",
              "recoveryPath": {
                "simplerExplanation": "Column B is 0-indexed position 1.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "ex-d1-b2-data-types-and-alignment",
        "day": 1,
        "blockNumber": 2,
        "title": "Spreadsheet Data Types: Left-Aligned Text vs Right-Aligned Numbers",
        "conceptBudget": {
          "primaryConcept": "Spreadsheet Data Type Invariant",
          "supportingTerms": [
            "Data Type Alignment (In Excel, text strings align to the LEFT by default, while numbers, floats, and currency align to the RIGHT; numbers stored as text align left and fail mathematical formulas)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d1-b1-cell-coordinate-parser",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Default Spreadsheet Cell Alignment",
            "codeSnippet": "// Cell A1: 'Acme Corp' -> Aligns LEFT  (Text String)\n// Cell B1: 4250.00     -> Aligns RIGHT (Numeric Float)\n// Cell C1: '100'       -> Aligns LEFT  (Number Stored As Text -> Warning Triangle!)",
            "lineNotes": {
              "1": "Text data string.",
              "2": "Proper numeric float.",
              "3": "Dirty number stored as text."
            }
          },
          {
            "type": "runnable_code",
            "filename": "alignment_demo.js",
            "initialCode": "function getNumericAlignmentStandard() {\n  return 'NUMBERS_ALIGN_RIGHT_AND_STRINGS_ALIGN_LEFT';\n}\n\nconsole.log(getNumericAlignmentStandard());",
            "expectedOutput": "NUMBERS_ALIGN_RIGHT_AND_STRINGS_ALIGN_LEFT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do valid numerical values align by default inside Microsoft Excel and Google Sheets cells?",
          "expectedStringOutput": "NUMBERS_ALIGN_RIGHT_AND_STRINGS_ALIGN_LEFT",
          "acceptableAnswers": [
            "NUMBERS_ALIGN_RIGHT_AND_STRINGS_ALIGN_LEFT",
            "Right",
            "Align right",
            "Right aligned"
          ],
          "primaryMisconceptionId": "MC_EX_SPREADSHEET_GRID_DATA_TYPES",
          "diagnosisMap": {
            "LEFT": {
              "misconceptionId": "MC_EX_SPREADSHEET_GRID_DATA_TYPES",
              "errorExplanation": "Text aligns left. Numbers align right: NUMBERS_ALIGN_RIGHT_AND_STRINGS_ALIGN_LEFT.",
              "recoveryPath": {
                "simplerExplanation": "Matches NUMBERS_ALIGN_RIGHT_AND_STRINGS_ALIGN_LEFT.",
                "guidedFixPrompt": "Type NUMBERS_ALIGN_RIGHT_AND_STRINGS_ALIGN_LEFT"
              }
            }
          }
        }
      },
      {
        "id": "ex-d1-b3-grid-dimensions-and-limits",
        "day": 1,
        "blockNumber": 3,
        "title": "Grid Limits: 16,384 Columns ($XFD$) $\\times$ 1,048,576 Rows",
        "conceptBudget": {
          "primaryConcept": "Grid Dimension Limit Invariant",
          "supportingTerms": [
            "Excel Worksheet Limits (Max columns = $16,384$ ending at column $XFD$; Max rows = $1,048,576$ rows; total capacity = 17,179,869,184 cells)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d1-b2-data-types-and-alignment",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "grid_limits_demo.js",
            "initialCode": "function getMaxColumnsCount() {\n  return 16384;\n}\n\nconsole.log(getMaxColumnsCount());",
            "expectedOutput": "16384",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the maximum number of columns available in a modern Microsoft Excel worksheet (.xlsx)?",
          "expectedStringOutput": "16384",
          "acceptableAnswers": [
            "16384",
            "16,384",
            "16384 columns"
          ],
          "primaryMisconceptionId": "MC_EX_SPREADSHEET_GRID_DATA_TYPES",
          "diagnosisMap": {
            "256": {
              "misconceptionId": "MC_EX_SPREADSHEET_GRID_DATA_TYPES",
              "errorExplanation": "256 was the old .xls limit. Modern Excel supports 16,384 columns.",
              "recoveryPath": {
                "simplerExplanation": "Modern Excel column limit is 16384.",
                "guidedFixPrompt": "Type 16384"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Core Mathematical & Aggregation Functions: `SUM`, `AVERAGE`, `COUNT` & `ROUND`",
    "overviewMetaphor": "Spreadsheet Aggregations Are a Grocery Cash Register Receipt: The register sums every item ($Sum = \\$152.00$), divides by 5 items to compute the average item cost ($Average = \\$30.40$), and rounds the tax to 2 decimal places ($Round = \\$30.40$), giving the store manager a comprehensive statistical snapshot in real time.",
    "blocks": [
      {
        "id": "ex-d2-b1-aggregation-engine-calculation",
        "day": 2,
        "blockNumber": 1,
        "title": "Descriptive Statistics: $Sum = 152.00$, $Avg = 30.40$, $Min = 10.50$ & $Max = 50.50$",
        "conceptBudget": {
          "primaryConcept": "Descriptive Statistics Aggregation Engine",
          "supportingTerms": [
            "Item Count ($N = 5$ items)",
            "Sum Total ($152.00$)",
            "Arithmetic Mean / Average ($30.40$)",
            "Minimum Value ($10.50$)",
            "Maximum Value ($50.50$)",
            "Status: Aggregations Computed Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d1-b1-cell-coordinate-parser",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Spreadsheet Descriptive Aggregations Ledger",
              "boxes": [
                {
                  "label": "Data Array Sample",
                  "value": "[10.5, 20.25, 30.75, 40.0, 50.5] (N = 5 elements)",
                  "varType": "Dataset",
                  "isUpdated": false
                },
                {
                  "label": "Calculated Sum Total",
                  "value": "SUM(A1:A5) = 152.00",
                  "varType": "Sum",
                  "isUpdated": false
                },
                {
                  "label": "Arithmetic Average",
                  "value": "AVERAGE(A1:A5) = 30.40 (AGGREGATIONS COMPUTED NOMINAL!)",
                  "varType": "Average",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "aggregations_demo.js",
            "initialCode": "function computeAggs(arr) {\n  const sum = arr.reduce((acc, n) => acc + n, 0);\n  const avg = sum / arr.length;\n  return {\n    count: arr.length,\n    sum: Number(sum.toFixed(2)),\n    average: Number(avg.toFixed(2)),\n    min: Math.min(...arr),\n    max: Math.max(...arr),\n    status: 'AGGREGATIONS_COMPUTED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(computeAggs([10.5, 20.25, 30.75, 40.0, 50.5])));",
            "expectedOutput": "{\"count\":5,\"sum\":152,\"average\":30.4,\"min\":10.5,\"max\":50.5,\"status\":\"AGGREGATIONS_COMPUTED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the calculated sum total of the array `[10.5, 20.25, 30.75, 40.0, 50.5]`?",
          "expectedStringOutput": "152",
          "acceptableAnswers": [
            "152",
            "152.0",
            "152.00",
            "sum\":152"
          ],
          "primaryMisconceptionId": "MC_EX_AGGREGATIONS_SUM_AVERAGE_ROUND",
          "diagnosisMap": {
            "30.4": {
              "misconceptionId": "MC_EX_AGGREGATIONS_SUM_AVERAGE_ROUND",
              "errorExplanation": "30.4 is the average. The total sum is 152.0.",
              "recoveryPath": {
                "simplerExplanation": "Sum is 152.",
                "guidedFixPrompt": "Type 152"
              }
            }
          }
        }
      },
      {
        "id": "ex-d2-b2-count-vs-counta-mechanics",
        "day": 2,
        "blockNumber": 2,
        "title": "`COUNT` (Numbers Only) vs `COUNTA` (All Non-Empty Cells)",
        "conceptBudget": {
          "primaryConcept": "COUNT vs COUNTA Invariant",
          "supportingTerms": [
            "`COUNT` (Only tallies cells containing numeric numbers and dates)",
            "`COUNTA` (Tallies all non-blank cells including text strings, booleans, and error codes)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d2-b1-aggregation-engine-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Counting Function Distinctions",
            "codeSnippet": "// Range A1:A4 contains: [100, 'N/A', 250, 'Pending']\n// =COUNT(A1:A4)  -> Returns 2 (Only cells A1 and A3 are numeric numbers!)\n// =COUNTA(A1:A4) -> Returns 4 (All 4 cells contain data!)",
            "lineNotes": {
              "1": "Sample column with mixed numbers and strings.",
              "2": "COUNT ignores text.",
              "3": "COUNTA counts all non-empty entries."
            }
          },
          {
            "type": "runnable_code",
            "filename": "count_demo.js",
            "initialCode": "function getCountVsCountaRule() {\n  return 'COUNT_IGNORES_TEXT_WHILE_COUNTA_COUNTS_ALL_NON_EMPTY_CELLS';\n}\n\nconsole.log(getCountVsCountaRule());",
            "expectedOutput": "COUNT_IGNORES_TEXT_WHILE_COUNTA_COUNTS_ALL_NON_EMPTY_CELLS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which spreadsheet counting function tallies all non-empty cells including text strings?",
          "expectedStringOutput": "COUNT_IGNORES_TEXT_WHILE_COUNTA_COUNTS_ALL_NON_EMPTY_CELLS",
          "acceptableAnswers": [
            "COUNT_IGNORES_TEXT_WHILE_COUNTA_COUNTS_ALL_NON_EMPTY_CELLS",
            "COUNTA",
            "counta"
          ],
          "primaryMisconceptionId": "MC_EX_AGGREGATIONS_SUM_AVERAGE_ROUND",
          "diagnosisMap": {
            "COUNT": {
              "misconceptionId": "MC_EX_AGGREGATIONS_SUM_AVERAGE_ROUND",
              "errorExplanation": "COUNT ignores text strings. Counting all non-empty cells uses COUNTA.",
              "recoveryPath": {
                "simplerExplanation": "Matches COUNT_IGNORES_TEXT_WHILE_COUNTA_COUNTS_ALL_NON_EMPTY_CELLS.",
                "guidedFixPrompt": "Type COUNT_IGNORES_TEXT_WHILE_COUNTA_COUNTS_ALL_NON_EMPTY_CELLS"
              }
            }
          }
        }
      },
      {
        "id": "ex-d2-b3-round-vs-display-formatting",
        "day": 2,
        "blockNumber": 3,
        "title": "`ROUND` Function vs Visual Cell Number Formatting",
        "conceptBudget": {
          "primaryConcept": "Precision Rounding Invariant",
          "supportingTerms": [
            "`ROUND` (Permanently alters the underlying float value in memory: `=ROUND(10.555, 2) -> 10.56`; visual formatting only masks decimals on screen while preserving hidden precision)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d2-b2-count-vs-counta-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "round_precision_demo.js",
            "initialCode": "function getRoundPrecisionStandard() {\n  return 'ROUND_FUNCTION_PERMANENTLY_TRUNCATES_MATHEMATICAL_PRECISION_IN_MEMORY';\n}\n\nconsole.log(getRoundPrecisionStandard());",
            "expectedOutput": "ROUND_FUNCTION_PERMANENTLY_TRUNCATES_MATHEMATICAL_PRECISION_IN_MEMORY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How does using the `=ROUND()` function differ from applying visual 2-decimal cell formatting?",
          "expectedStringOutput": "ROUND_FUNCTION_PERMANENTLY_TRUNCATES_MATHEMATICAL_PRECISION_IN_MEMORY",
          "acceptableAnswers": [
            "ROUND_FUNCTION_PERMANENTLY_TRUNCATES_MATHEMATICAL_PRECISION_IN_MEMORY",
            "Alters memory precision",
            "Truncates precision"
          ],
          "primaryMisconceptionId": "MC_EX_AGGREGATIONS_SUM_AVERAGE_ROUND",
          "diagnosisMap": {
            "SAME": {
              "misconceptionId": "MC_EX_AGGREGATIONS_SUM_AVERAGE_ROUND",
              "errorExplanation": "Visual formatting leaves underlying decimals intact. True rounding uses ROUND_FUNCTION_PERMANENTLY_TRUNCATES_MATHEMATICAL_PRECISION_IN_MEMORY.",
              "recoveryPath": {
                "simplerExplanation": "Matches ROUND_FUNCTION_PERMANENTLY_TRUNCATES_MATHEMATICAL_PRECISION_IN_MEMORY.",
                "guidedFixPrompt": "Type ROUND_FUNCTION_PERMANENTLY_TRUNCATES_MATHEMATICAL_PRECISION_IN_MEMORY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Cell Referencing Mechanics: Relative (`A1`), Absolute (`$A$1`) & Mixed (`$A1`)",
    "overviewMetaphor": "The Dollar Sign `$` Is a Steel Anchor on a Ship: When you drag a formula across the grid, unanchored references (`A1`) drift with the ocean current (Relative); hammering a `$` anchor in front of both column and row (`$A$1`) locks the formula permanently to cell A1 (Absolute); anchoring only the column (`$A1`) lets the row slide freely while keeping the column locked.",
    "blocks": [
      {
        "id": "ex-d3-b1-cell-reference-lock-shifts",
        "day": 3,
        "blockNumber": 1,
        "title": "Cell Reference Transformation: `A1` $\\to$ `B3`, `$A$1` $\\to$ `$A$1` & `$A1` $\\to$ `$A3`",
        "conceptBudget": {
          "primaryConcept": "Cell Reference Shift & Coordinate Locking",
          "supportingTerms": [
            "Relative Reference (`'A1'` shifts by row/col delta)",
            "Absolute Reference (`'$A$1'` locks both coordinates)",
            "Mixed Reference (`'$A1'` locks column, shifts row)",
            "Shift (+2 Rows, +1 Col)",
            "Status: Cell Reference Locks Verified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d2-b1-aggregation-engine-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Formula Drag-and-Fill Coordinate Shifting Ledger",
              "boxes": [
                {
                  "label": "Relative: 'A1' (+2R, +1C)",
                  "value": "Shifts to 'B3' (Both coordinates move dynamically)",
                  "varType": "Relative",
                  "isUpdated": false
                },
                {
                  "label": "Absolute: '$A$1' (+2R, +1C)",
                  "value": "Remains '$A$1' (Both coordinates anchored by $)",
                  "varType": "Absolute",
                  "isUpdated": false
                },
                {
                  "label": "Mixed Column: '$A1' (+2R, +1C)",
                  "value": "Shifts to '$A3' (CELL REFERENCE LOCKS VERIFIED NOMINAL!)",
                  "varType": "Mixed Col",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "reference_shift_demo.js",
            "initialCode": "function shiftRef(ref, rDelta, cDelta) {\n  const match = ref.match(/^(\\$?)([A-Za-z]+)(\\$?)(\\d+)$/);\n  const cLock = match[1] === '$', rLock = match[3] === '$';\n  let col = match[2].toUpperCase(), row = parseInt(match[4], 10);\n  if (!rLock) row += rDelta;\n  if (!cLock) {\n    let idx = 0;\n    for (let i = 0; i < col.length; i++) idx = idx * 26 + (col.charCodeAt(i) - 64);\n    idx += cDelta;\n    let temp = '', n = idx;\n    while (n > 0) { let rem = (n - 1) % 26; temp = String.fromCharCode(65 + rem) + temp; n = Math.floor((n - 1) / 26); }\n    col = temp;\n  }\n  return (cLock ? '$' : '') + col + (rLock ? '$' : '') + row;\n}\n\nconsole.log(shiftRef('$A1', 2, 1));\nconsole.log(shiftRef('A1', 2, 1));",
            "expectedOutput": "$A3\nB3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What cell reference string is produced when dragging the mixed formula reference `$A1` down 2 rows and right 1 column?",
          "expectedStringOutput": "$A3",
          "acceptableAnswers": [
            "$A3",
            "$a3",
            "result: $A3"
          ],
          "primaryMisconceptionId": "MC_EX_CELL_REFERENCING_RELATIVE_ABSOLUTE",
          "diagnosisMap": {
            "B3": {
              "misconceptionId": "MC_EX_CELL_REFERENCING_RELATIVE_ABSOLUTE",
              "errorExplanation": "The dollar sign $ anchors Column A, preventing it from shifting to B. The output is $A3.",
              "recoveryPath": {
                "simplerExplanation": "Column stays A, row becomes 1+2=3 -> $A3.",
                "guidedFixPrompt": "Type $A3"
              }
            }
          }
        }
      },
      {
        "id": "ex-d3-b2-f4-shortcut-cycling",
        "day": 3,
        "blockNumber": 2,
        "title": "Keyboard Shortcut `F4`: Cycling Through Reference Lock States",
        "conceptBudget": {
          "primaryConcept": "F4 Reference Cycling Invariant",
          "supportingTerms": [
            "F4 Shortcut (Pressing F4 in the formula bar cycles: `A1` $\\to$ `$A$1` (Absolute) $\\to$ `A$1` (Row locked) $\\to$ `$A1` (Column locked) $\\to$ `A1` (Relative))"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d3-b1-cell-reference-lock-shifts",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "F4 Reference Cycle Sequence",
            "codeSnippet": "// 1. Press F4 once:   A1  -> $A$1 (Absolute row and column lock)\n// 2. Press F4 twice:  $A$1 -> A$1  (Mixed: Row locked only)\n// 3. Press F4 thrice: A$1  -> $A1  (Mixed: Column locked only)\n// 4. Press F4 fourth: $A1  -> A1   (Relative: Unlocked)",
            "lineNotes": {
              "1": "First press gives full lock.",
              "2": "Second press locks row.",
              "3": "Third press locks column.",
              "4": "Fourth press returns to relative."
            }
          },
          {
            "type": "runnable_code",
            "filename": "f4_shortcut_demo.js",
            "initialCode": "function getF4ShortcutKey() {\n  return 'F4_KEY_CYCLES_THROUGH_ALL_FOUR_CELL_REFERENCE_LOCK_STATES';\n}\n\nconsole.log(getF4ShortcutKey());",
            "expectedOutput": "F4_KEY_CYCLES_THROUGH_ALL_FOUR_CELL_REFERENCE_LOCK_STATES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What function key shortcut cycles through absolute, mixed, and relative reference locks in Excel formula editing?",
          "expectedStringOutput": "F4_KEY_CYCLES_THROUGH_ALL_FOUR_CELL_REFERENCE_LOCK_STATES",
          "acceptableAnswers": [
            "F4_KEY_CYCLES_THROUGH_ALL_FOUR_CELL_REFERENCE_LOCK_STATES",
            "F4",
            "f4"
          ],
          "primaryMisconceptionId": "MC_EX_CELL_REFERENCING_RELATIVE_ABSOLUTE",
          "diagnosisMap": {
            "F2": {
              "misconceptionId": "MC_EX_CELL_REFERENCING_RELATIVE_ABSOLUTE",
              "errorExplanation": "F2 enters edit mode. Cycling reference locks uses F4.",
              "recoveryPath": {
                "simplerExplanation": "Matches F4_KEY_CYCLES_THROUGH_ALL_FOUR_CELL_REFERENCE_LOCK_STATES.",
                "guidedFixPrompt": "Type F4_KEY_CYCLES_THROUGH_ALL_FOUR_CELL_REFERENCE_LOCK_STATES"
              }
            }
          }
        }
      },
      {
        "id": "ex-d3-b3-external-sheet-and-workbook-references",
        "day": 3,
        "blockNumber": 3,
        "title": "Cross-Sheet References: `'Sheet2'!A1` & `[Workbook.xlsx]Sheet1!$A$1`",
        "conceptBudget": {
          "primaryConcept": "Cross-Sheet Reference Invariant",
          "supportingTerms": [
            "Sheet Reference Syntax (Using exclamation mark `!` e.g. `'Q3 Financials'!B10` to pull values across distinct workbook tabs)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d3-b2-f4-shortcut-cycling",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "sheet_ref_demo.js",
            "initialCode": "function getCrossSheetSeparator() {\n  return 'EXCLAMATION_MARK_SEPARATES_SHEET_NAME_FROM_CELL_COORDINATES';\n}\n\nconsole.log(getCrossSheetSeparator());",
            "expectedOutput": "EXCLAMATION_MARK_SEPARATES_SHEET_NAME_FROM_CELL_COORDINATES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What punctuation character separates the worksheet name from the cell reference in cross-sheet Excel formulas (e.g. `'Summary'!A1`)?",
          "expectedStringOutput": "EXCLAMATION_MARK_SEPARATES_SHEET_NAME_FROM_CELL_COORDINATES",
          "acceptableAnswers": [
            "EXCLAMATION_MARK_SEPARATES_SHEET_NAME_FROM_CELL_COORDINATES",
            "!",
            "Exclamation mark"
          ],
          "primaryMisconceptionId": "MC_EX_CELL_REFERENCING_RELATIVE_ABSOLUTE",
          "diagnosisMap": {
            ":": {
              "misconceptionId": "MC_EX_CELL_REFERENCING_RELATIVE_ABSOLUTE",
              "errorExplanation": "Colon : defines ranges (A1:B10). Cross-sheet separation uses EXCLAMATION_MARK_SEPARATES_SHEET_NAME_FROM_CELL_COORDINATES.",
              "recoveryPath": {
                "simplerExplanation": "Matches EXCLAMATION_MARK_SEPARATES_SHEET_NAME_FROM_CELL_COORDINATES.",
                "guidedFixPrompt": "Type EXCLAMATION_MARK_SEPARATES_SHEET_NAME_FROM_CELL_COORDINATES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Logical Evaluation Functions: Single `IF`, Nested `IF` & Multi-Condition `AND`/`OR`",
    "overviewMetaphor": "The `IF` Function Is a Traffic Guard at an Intersection: If the light is green (`True`), cars proceed (`Value_if_true`); if the light is red (`False`), cars stop (`Value_if_false`); nesting multiple `IF` conditions allows you to handle complex traffic patterns like grading student performance tiers (`DISTINCTION`, `PASS`, `FAIL`) based on test scores and attendance percentages.",
    "blocks": [
      {
        "id": "ex-d4-b1-nested-if-logical-grading",
        "day": 4,
        "blockNumber": 1,
        "title": "Multi-Tier Logic: Distinction (Score $\\ge 90$ & Att $\\ge 90$) vs Pass (Score $\\ge 70$)",
        "conceptBudget": {
          "primaryConcept": "Multi-Condition Logical Tier Evaluation",
          "supportingTerms": [
            "Score ($95$)",
            "Attendance Percentage ($92\\%$)",
            "Violation Flag (`false`)",
            "Grading Tiers (`'DISTINCTION'`, `'PASS'`, `'FAIL'`)",
            "Status: Performance Evaluated Distinction"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d3-b1-cell-reference-lock-shifts",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Spreadsheet Logical Evaluation & Tier Classification Ledger",
              "boxes": [
                {
                  "label": "Student Performance Profile",
                  "value": "Score: 95 | Attendance: 92% | Disciplinary Violation: False",
                  "varType": "Student",
                  "isUpdated": false
                },
                {
                  "label": "Logical Condition",
                  "value": "IF(AND(Score>=90, Att>=90, NOT(Violation)), 'DISTINCTION', ...)",
                  "varType": "Condition",
                  "isUpdated": false
                },
                {
                  "label": "Assigned Grade Tier",
                  "value": "'DISTINCTION' (PERFORMANCE EVALUATED DISTINCTION NOMINAL!)",
                  "varType": "Tier",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "nested_if_demo.js",
            "initialCode": "function evaluateTier(score, att, viol) {\n  if (viol || att < 75) return { tier: 'FAIL', isQualified: false, status: 'PERFORMANCE_EVALUATED_FAIL' };\n  if (score >= 90 && att >= 90) return { tier: 'DISTINCTION', isQualified: true, status: 'PERFORMANCE_EVALUATED_DISTINCTION' };\n  if (score >= 70) return { tier: 'PASS', isQualified: true, status: 'PERFORMANCE_EVALUATED_PASS' };\n  return { tier: 'FAIL', isQualified: false, status: 'PERFORMANCE_EVALUATED_FAIL' };\n}\n\nconsole.log(JSON.stringify(evaluateTier(95, 92, false)));\nconsole.log(JSON.stringify(evaluateTier(75, 80, false)));",
            "expectedOutput": "{\"tier\":\"DISTINCTION\",\"isQualified\":true,\"status\":\"PERFORMANCE_EVALUATED_DISTINCTION\"}\n{\"tier\":\"PASS\",\"isQualified\":true,\"status\":\"PERFORMANCE_EVALUATED_PASS\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What tier is assigned to a student with score 95, attendance 92%, and zero violations?",
          "expectedStringOutput": "DISTINCTION",
          "acceptableAnswers": [
            "DISTINCTION",
            "Distinction",
            "tier\":\"DISTINCTION\""
          ],
          "primaryMisconceptionId": "MC_EX_LOGICAL_FUNCTIONS_IF_AND_OR",
          "diagnosisMap": {
            "PASS": {
              "misconceptionId": "MC_EX_LOGICAL_FUNCTIONS_IF_AND_OR",
              "errorExplanation": "Score 95 and Attendance 92% exceeds the 90/90 threshold, awarding DISTINCTION.",
              "recoveryPath": {
                "simplerExplanation": "Meets distinction threshold.",
                "guidedFixPrompt": "Type DISTINCTION"
              }
            }
          }
        }
      },
      {
        "id": "ex-d4-b2-and-or-truth-table-composition",
        "day": 4,
        "blockNumber": 2,
        "title": "Compound Logic: `=AND(c1, c2)` vs `=OR(c1, c2)` Truth Tables",
        "conceptBudget": {
          "primaryConcept": "AND vs OR Truth Table Invariant",
          "supportingTerms": [
            "`AND` (Returns TRUE only if ALL conditions evaluate to TRUE)",
            "`OR` (Returns TRUE if AT LEAST ONE condition evaluates to TRUE)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d4-b1-nested-if-logical-grading",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Boolean Formula Composition",
            "codeSnippet": "// =IF(AND(A2>100, B2=\"Approved\"), \"Authorize Payment\", \"Hold\")\n// =IF(OR(C2=\"VIP\", D2>5000), \"Free Expedited Shipping\", \"Standard Shipping\")",
            "lineNotes": {
              "1": "AND requires both conditions to be true.",
              "2": "OR requires either condition to be true."
            }
          },
          {
            "type": "runnable_code",
            "filename": "and_or_demo.js",
            "initialCode": "function getAndFunctionRule() {\n  return 'AND_FUNCTION_REQUIRES_ALL_ARGUMENTS_TO_BE_TRUE';\n}\n\nconsole.log(getAndFunctionRule());",
            "expectedOutput": "AND_FUNCTION_REQUIRES_ALL_ARGUMENTS_TO_BE_TRUE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Under what condition does the Excel `=AND()` function return TRUE?",
          "expectedStringOutput": "AND_FUNCTION_REQUIRES_ALL_ARGUMENTS_TO_BE_TRUE",
          "acceptableAnswers": [
            "AND_FUNCTION_REQUIRES_ALL_ARGUMENTS_TO_BE_TRUE",
            "All true",
            "When all arguments are true"
          ],
          "primaryMisconceptionId": "MC_EX_LOGICAL_FUNCTIONS_IF_AND_OR",
          "diagnosisMap": {
            "ANY": {
              "misconceptionId": "MC_EX_LOGICAL_FUNCTIONS_IF_AND_OR",
              "errorExplanation": "Any true is the OR function. AND requires AND_FUNCTION_REQUIRES_ALL_ARGUMENTS_TO_BE_TRUE.",
              "recoveryPath": {
                "simplerExplanation": "Matches AND_FUNCTION_REQUIRES_ALL_ARGUMENTS_TO_BE_TRUE.",
                "guidedFixPrompt": "Type AND_FUNCTION_REQUIRES_ALL_ARGUMENTS_TO_BE_TRUE"
              }
            }
          }
        }
      },
      {
        "id": "ex-d4-b3-ifs-function-modern-syntax",
        "day": 4,
        "blockNumber": 3,
        "title": "The Modern `=IFS()` Function: Eliminating Deeply Nested Parentheses",
        "conceptBudget": {
          "primaryConcept": "IFS Function Invariant",
          "supportingTerms": [
            "`IFS` (`=IFS(c1, v1, c2, v2, c3, v3, TRUE, default_val)`: Tests conditions sequentially without closing 10 sets of nested parentheses at the end of the formula)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d4-b2-and-or-truth-table-composition",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ifs_demo.js",
            "initialCode": "function getIfsCatchAllCondition() {\n  return 'TRUE_SERVES_AS_THE_FINAL_DEFAULT_CATCH_ALL_CONDITION_IN_IFS';\n}\n\nconsole.log(getIfsCatchAllCondition());",
            "expectedOutput": "TRUE_SERVES_AS_THE_FINAL_DEFAULT_CATCH_ALL_CONDITION_IN_IFS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What condition parameter is placed at the end of an `=IFS()` formula to serve as the default catch-all fallback?",
          "expectedStringOutput": "TRUE_SERVES_AS_THE_FINAL_DEFAULT_CATCH_ALL_CONDITION_IN_IFS",
          "acceptableAnswers": [
            "TRUE_SERVES_AS_THE_FINAL_DEFAULT_CATCH_ALL_CONDITION_IN_IFS",
            "TRUE",
            "True"
          ],
          "primaryMisconceptionId": "MC_EX_LOGICAL_FUNCTIONS_IF_AND_OR",
          "diagnosisMap": {
            "ELSE": {
              "misconceptionId": "MC_EX_LOGICAL_FUNCTIONS_IF_AND_OR",
              "errorExplanation": "Excel has no ELSE keyword. Catch-all in IFS uses TRUE_SERVES_AS_THE_FINAL_DEFAULT_CATCH_ALL_CONDITION_IN_IFS.",
              "recoveryPath": {
                "simplerExplanation": "Matches TRUE_SERVES_AS_THE_FINAL_DEFAULT_CATCH_ALL_CONDITION_IN_IFS.",
                "guidedFixPrompt": "Type TRUE_SERVES_AS_THE_FINAL_DEFAULT_CATCH_ALL_CONDITION_IN_IFS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Spreadsheet Grid Architecture, Aggregation & Logical Evaluation Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete foundational spreadsheet computation engine: 1. Grid coordinate parsing (`B12` $\\to$ row 11, col 1); 2. Descriptive statistics aggregation ($Sum = 152.00, Avg = 30.40$); 3. Cell referencing lock shifts (`$A1` $\\to$ `$A3$`); 4. Logical performance grading (Distinction qualification).",
    "blocks": [
      {
        "id": "ex-d5-b1-spreadsheet-foundations-master-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "Spreadsheet Foundations Master Kernel Synthesis",
        "conceptBudget": {
          "primaryConcept": "Spreadsheet Foundations Master Kernel",
          "supportingTerms": [
            "Grid Coordinates Engine",
            "Descriptive Aggregations Engine",
            "Cell Referencing Lock Engine",
            "Logical Branching Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d4-b3-ifs-function-modern-syntax",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 Spreadsheet Foundations Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Parses 2D grid coordinates (B12 -> colIndex 1, rowIndex 11)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Computes descriptive aggregations (Sum 152.00, Avg 30.40)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Simulates $A1 reference locking shifts ($A3)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Evaluates multi-tier logical grading and activates Foundations kernel!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "spreadsheet_kernel_demo.js",
            "initialCode": "function runSpreadsheetFoundations() {\n  return {\n    gridSubsystem: 'ONLINE_B12_PARSED_ACTIVE',\n    aggSubsystem: 'ONLINE_152SUM_30_4AVG_ACTIVE',\n    refSubsystem: 'ONLINE_A1_LOCKS_ACTIVE',\n    logicSubsystem: 'ONLINE_DISTINCTION_LOGIC_ACTIVE',\n    engineStatus: 'SPREADSHEET_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL'\n  };\n}\n\nconsole.log(runSpreadsheetFoundations().engineStatus);",
            "expectedOutput": "SPREADSHEET_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Spreadsheet Foundations Master Kernel?",
          "expectedStringOutput": "SPREADSHEET_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL",
          "acceptableAnswers": [
            "SPREADSHEET_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL",
            "engineStatus: SPREADSHEET_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_EX_SPREADSHEET_GRID_DATA_TYPES",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_EX_SPREADSHEET_GRID_DATA_TYPES",
              "errorExplanation": "Matches SPREADSHEET_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type SPREADSHEET_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "ex-d5-b2-spreadsheet-foundations-engine-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "Spreadsheet Foundations Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Spreadsheet Foundations Invariant Verification",
          "supportingTerms": [
            "Grid Invariant",
            "Aggregation Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d5-b1-spreadsheet-foundations-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "spreadsheet_audit_demo.js",
            "initialCode": "function auditSpreadsheet(g, a, r, l) {\n  const passed = g && a && r && l;\n  return {\n    gridVerified: g,\n    aggVerified: a,\n    refVerified: r,\n    logicVerified: l,\n    grade: passed ? 'SPREADSHEET_FOUNDATIONS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditSpreadsheet(true, true, true, true)));",
            "expectedOutput": "{\"gridVerified\":true,\"aggVerified\":true,\"refVerified\":true,\"logicVerified\":true,\"grade\":\"SPREADSHEET_FOUNDATIONS_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Grid, Aggregations, Referencing, and Logical Branching engines pass 100%?",
          "expectedStringOutput": "SPREADSHEET_FOUNDATIONS_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "SPREADSHEET_FOUNDATIONS_ENGINE_AUDIT_PASSED",
            "grade\":\"SPREADSHEET_FOUNDATIONS_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_EX_SPREADSHEET_GRID_DATA_TYPES",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_EX_SPREADSHEET_GRID_DATA_TYPES",
              "errorExplanation": "All checks passing awards SPREADSHEET_FOUNDATIONS_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards SPREADSHEET_FOUNDATIONS_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type SPREADSHEET_FOUNDATIONS_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "ex-d5-b3-milestone1-ex-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Spreadsheet Foundations Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Spreadsheet Foundations Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d5-b2-spreadsheet-foundations-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_ex_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete Spreadsheet Grid Architecture, Aggregation & Logical Evaluation Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete Spreadsheet Grid Architecture, Aggregation & Logical Evaluation Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete Spreadsheet Grid Architecture, Aggregation & Logical Evaluation Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete Spreadsheet Grid Architecture, Aggregation & Logical Evaluation Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_EX_SPREADSHEET_GRID_DATA_TYPES",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_EX_SPREADSHEET_GRID_DATA_TYPES",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete Spreadsheet Grid Architecture, Aggregation & Logical Evaluation Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Statistical Conditional Aggregations: `SUMIF`, `SUMIFS`, `COUNTIF` & `AVERAGEIFS`",
    "overviewMetaphor": "Conditional Aggregations Are High-Speed Mail Sorting Belts: Instead of summing every package in the warehouse, `SUMIFS` acts as an automated optical sorter that only tallies boxes stamped 'NORTH Region' with a value exceeding $1,000 ($Sum = \\$4,000.00$ across 2 matching shipments), filtering and calculating in a single atomic pass.",
    "blocks": [
      {
        "id": "ex-d6-b1-sumifs-multi-criteria-aggregation",
        "day": 6,
        "blockNumber": 1,
        "title": "Multi-Criteria Filtering: `SUMIFS(Amount, Region, \"NORTH\", Amount, \">=1000\") = $4,000.00`",
        "conceptBudget": {
          "primaryConcept": "Multi-Criteria SUMIFS Aggregation Engine",
          "supportingTerms": [
            "Region Filter (`'NORTH'`)",
            "Minimum Amount Filter ($1,000$)",
            "Matched Count ($2$ records)",
            "Total Amount Sum ($4,000.00$)",
            "Average Amount ($2,000.00$)",
            "Status: SUMIFS Conditional Aggregation Computed Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d1-b1-cell-coordinate-parser",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "SUMIFS Multi-Criteria Filtering & Aggregation Ledger",
              "boxes": [
                {
                  "label": "Transaction Database",
                  "value": "4 Sales Records across NORTH & SOUTH regions",
                  "varType": "Dataset",
                  "isUpdated": false
                },
                {
                  "label": "Filtering Criteria",
                  "value": "Region = 'NORTH' AND Amount >= $1,000 (Matches Tx #2: $1500 + Tx #4: $2500)",
                  "varType": "Filter",
                  "isUpdated": false
                },
                {
                  "label": "Aggregated Sales Volume",
                  "value": "$4,000.00 across 2 matched transactions (SUMIFS COMPUTED NOMINAL!)",
                  "varType": "Sum",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sumifs_demo.js",
            "initialCode": "function computeSumifs(records, reg, min) {\n  const matched = records.filter(r => r.region === reg && r.amount >= min);\n  const sum = matched.reduce((acc, r) => acc + r.amount, 0);\n  return {\n    region: reg,\n    matchedCount: matched.length,\n    totalSum: Number(sum.toFixed(2)),\n    average: matched.length > 0 ? Number((sum / matched.length).toFixed(2)) : 0,\n    status: 'SUMIFS_CONDITIONAL_AGGREGATION_COMPUTED_NOMINAL'\n  };\n}\n\nconst db = [\n  { id: 1, region: 'NORTH', amount: 500 },\n  { id: 2, region: 'NORTH', amount: 1500 },\n  { id: 3, region: 'SOUTH', amount: 2000 },\n  { id: 4, region: 'NORTH', amount: 2500 }\n];\nconsole.log(JSON.stringify(computeSumifs(db, 'NORTH', 1000)));",
            "expectedOutput": "{\"region\":\"NORTH\",\"matchedCount\":2,\"totalSum\":4000,\"average\":2000,\"status\":\"SUMIFS_CONDITIONAL_AGGREGATION_COMPUTED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the total aggregated sum calculated by `SUMIFS` for region 'NORTH' transactions greater than or equal to $1,000?",
          "expectedStringOutput": "4000",
          "acceptableAnswers": [
            "4000",
            "4,000",
            "4000.0",
            "totalSum\":4000"
          ],
          "primaryMisconceptionId": "MC_EX_CONDITIONAL_AGGREGATIONS_SUMIFS_COUNTIFS",
          "diagnosisMap": {
            "4500": {
              "misconceptionId": "MC_EX_CONDITIONAL_AGGREGATIONS_SUMIFS_COUNTIFS",
              "errorExplanation": "4500 includes the $500 record. The >=1000 filter only includes 1500 + 2500 = 4000.",
              "recoveryPath": {
                "simplerExplanation": "1500 + 2500 = 4000.",
                "guidedFixPrompt": "Type 4000"
              }
            }
          }
        }
      },
      {
        "id": "ex-d6-b2-sumif-vs-sumifs-argument-order",
        "day": 6,
        "blockNumber": 2,
        "title": "Argument Order Trap: Single `SUMIF` vs Multi-Criteria `SUMIFS`",
        "conceptBudget": {
          "primaryConcept": "SUMIF vs SUMIFS Argument Order Invariant",
          "supportingTerms": [
            "`SUMIF(criteria_range, criterion, [sum_range])` puts sum range LAST",
            "`SUMIFS(sum_range, criteria_range1, crit1, ...)` puts sum range FIRST"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d6-b1-sumifs-multi-criteria-aggregation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Argument Order Comparison",
            "codeSnippet": "// SINGLE CRITERION SUMIF:  =SUMIF(A2:A10, \"NORTH\", B2:B10)  (Sum range B2:B10 is LAST!)\n// MULTI CRITERIA SUMIFS:   =SUMIFS(B2:B10, A2:A10, \"NORTH\") (Sum range B2:B10 is FIRST!)",
            "lineNotes": {
              "1": "SUMIF syntax.",
              "2": "SUMIFS syntax puts sum range first."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sumifs_order_demo.js",
            "initialCode": "function getSumifsSumRangePosition() {\n  return 'SUMIFS_PLACES_THE_SUM_RANGE_AS_THE_FIRST_ARGUMENT';\n}\n\nconsole.log(getSumifsSumRangePosition());",
            "expectedOutput": "SUMIFS_PLACES_THE_SUM_RANGE_AS_THE_FIRST_ARGUMENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where is the `sum_range` argument positioned in the multi-criteria `=SUMIFS()` function?",
          "expectedStringOutput": "SUMIFS_PLACES_THE_SUM_RANGE_AS_THE_FIRST_ARGUMENT",
          "acceptableAnswers": [
            "SUMIFS_PLACES_THE_SUM_RANGE_AS_THE_FIRST_ARGUMENT",
            "First",
            "First argument",
            "As the first argument"
          ],
          "primaryMisconceptionId": "MC_EX_CONDITIONAL_AGGREGATIONS_SUMIFS_COUNTIFS",
          "diagnosisMap": {
            "LAST": {
              "misconceptionId": "MC_EX_CONDITIONAL_AGGREGATIONS_SUMIFS_COUNTIFS",
              "errorExplanation": "SUMIF puts it last. SUMIFS puts SUMIFS_PLACES_THE_SUM_RANGE_AS_THE_FIRST_ARGUMENT.",
              "recoveryPath": {
                "simplerExplanation": "Matches SUMIFS_PLACES_THE_SUM_RANGE_AS_THE_FIRST_ARGUMENT.",
                "guidedFixPrompt": "Type SUMIFS_PLACES_THE_SUM_RANGE_AS_THE_FIRST_ARGUMENT"
              }
            }
          }
        }
      },
      {
        "id": "ex-d6-b3-wildcard-character-matching",
        "day": 6,
        "blockNumber": 3,
        "title": "Wildcard Filtering: Asterisk `*` and Question Mark `?` in Criteria",
        "conceptBudget": {
          "primaryConcept": "Wildcard Filtering Invariant",
          "supportingTerms": [
            "Wildcards (`\"*Tech*\"` matches any text containing 'Tech'; `\"?001\"` matches exactly 4-character codes ending in 001)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d6-b2-sumif-vs-sumifs-argument-order",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "wildcards_demo.js",
            "initialCode": "function getWildcardAsteriskStandard() {\n  return 'ASTERISK_MATCHES_ZERO_OR_MORE_CHARACTERS_IN_CRITERIA_STRINGS';\n}\n\nconsole.log(getWildcardAsteriskStandard());",
            "expectedOutput": "ASTERISK_MATCHES_ZERO_OR_MORE_CHARACTERS_IN_CRITERIA_STRINGS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What wildcard symbol matches any sequence of zero or more characters inside Excel conditional criteria strings?",
          "expectedStringOutput": "ASTERISK_MATCHES_ZERO_OR_MORE_CHARACTERS_IN_CRITERIA_STRINGS",
          "acceptableAnswers": [
            "ASTERISK_MATCHES_ZERO_OR_MORE_CHARACTERS_IN_CRITERIA_STRINGS",
            "*",
            "Asterisk"
          ],
          "primaryMisconceptionId": "MC_EX_CONDITIONAL_AGGREGATIONS_SUMIFS_COUNTIFS",
          "diagnosisMap": {
            "?": {
              "misconceptionId": "MC_EX_CONDITIONAL_AGGREGATIONS_SUMIFS_COUNTIFS",
              "errorExplanation": "? matches exactly 1 character. Matching any length sequence uses ASTERISK_MATCHES_ZERO_OR_MORE_CHARACTERS_IN_CRITERIA_STRINGS.",
              "recoveryPath": {
                "simplerExplanation": "Matches ASTERISK_MATCHES_ZERO_OR_MORE_CHARACTERS_IN_CRITERIA_STRINGS.",
                "guidedFixPrompt": "Type ASTERISK_MATCHES_ZERO_OR_MORE_CHARACTERS_IN_CRITERIA_STRINGS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Text Manipulation & Cleaning Functions: `TRIM`, `CLEAN`, `PROPER` & `TEXTJOIN`",
    "overviewMetaphor": "Text Cleansing Functions Are a Car Wash for Dirty ERP Data: When customer names are exported with ugly trailing spaces (`'   john   DOE   '`), `TRIM` removes the mud, `PROPER` polishes the capitalization into `'John Doe'`, and `TEXTJOIN` neatly connects first name, last name, and department with a clean hyphen.",
    "blocks": [
      {
        "id": "ex-d7-b1-text-cleansing-pipeline",
        "day": 7,
        "blockNumber": 1,
        "title": "Text Sanitization: `TRIM('   john   DOE   ')` & `PROPER` $\\to$ `'John Doe'`",
        "conceptBudget": {
          "primaryConcept": "Spreadsheet Data Cleansing & Text Sanitization",
          "supportingTerms": [
            "Raw Dirty String (`'   john   DOE   '`)",
            "Cleansed Text (`'John Doe'`)",
            "Spaces Removed",
            "Status: Text Cleansed Proper Case Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d6-b1-sumifs-multi-criteria-aggregation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Spreadsheet Text Cleansing & Formatting Ledger",
              "boxes": [
                {
                  "label": "Raw Dirty ERP String",
                  "value": "'   john   DOE   ' (17 Characters with irregular spaces)",
                  "varType": "Raw String",
                  "isUpdated": false
                },
                {
                  "label": "TRIM Operation",
                  "value": "Removes leading, trailing & duplicate inner spaces -> 'john DOE'",
                  "varType": "TRIM",
                  "isUpdated": false
                },
                {
                  "label": "PROPER Operation",
                  "value": "'John Doe' (TEXT CLEANSED PROPER CASE NOMINAL!)",
                  "varType": "PROPER",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "text_clean_demo.js",
            "initialCode": "function cleanText(raw) {\n  const trimmed = raw.trim().replace(/\\s+/g, ' ');\n  const proper = trimmed.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');\n  return {\n    raw,\n    cleansedText: proper,\n    spacesRemoved: raw.length - proper.length,\n    status: 'TEXT_CLEANSED_PROPER_CASE_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(cleanText('   john   DOE   ')));",
            "expectedOutput": "{\"raw\":\"   john   DOE   \",\"cleansedText\":\"John Doe\",\"spacesRemoved\":9,\"status\":\"TEXT_CLEANSED_PROPER_CASE_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What clean string is returned after applying `TRIM` and `PROPER` to the raw string `'   john   DOE   '`?",
          "expectedStringOutput": "John Doe",
          "acceptableAnswers": [
            "John Doe",
            "cleansedText\":\"John Doe\""
          ],
          "primaryMisconceptionId": "MC_EX_TEXT_MANIPULATION_TRIM_CONCAT_PROPER",
          "diagnosisMap": {
            "JOHN DOE": {
              "misconceptionId": "MC_EX_TEXT_MANIPULATION_TRIM_CONCAT_PROPER",
              "errorExplanation": "PROPER converts to Title Case: 'John Doe'. UPPER produces 'JOHN DOE'.",
              "recoveryPath": {
                "simplerExplanation": "Result is 'John Doe'.",
                "guidedFixPrompt": "Type John Doe"
              }
            }
          }
        }
      },
      {
        "id": "ex-d7-b2-textjoin-vs-concatenate",
        "day": 7,
        "blockNumber": 2,
        "title": "Modern Concatenation: `=TEXTJOIN(\", \", TRUE, A1:A5)` vs Old `CONCATENATE`",
        "conceptBudget": {
          "primaryConcept": "TEXTJOIN Function Invariant",
          "supportingTerms": [
            "`TEXTJOIN` (Accepts a delimiter and an `ignore_empty: TRUE` flag, joining an entire range `A1:A10` without typing 10 separate ampersands `&`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d7-b1-text-cleansing-pipeline",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "TEXTJOIN Syntax",
            "codeSnippet": "// OLD METHOD: =A1 & \", \" & A2 & \", \" & A3 & \", \" & A4 (Manual, leaves empty commas if cells blank)\n// MODERN:     =TEXTJOIN(\", \", TRUE, A1:A4)            (Automatic delimiter + skips empty cells!)",
            "lineNotes": {
              "1": "Fragile manual concatenation.",
              "2": "Robust modern TEXTJOIN."
            }
          },
          {
            "type": "runnable_code",
            "filename": "textjoin_demo.js",
            "initialCode": "function getTextjoinIgnoreEmptyParam() {\n  return 'TRUE_PARAMETER_AUTOMATICALLY_SKIPS_BLANK_CELLS_IN_TEXTJOIN';\n}\n\nconsole.log(getTextjoinIgnoreEmptyParam());",
            "expectedOutput": "TRUE_PARAMETER_AUTOMATICALLY_SKIPS_BLANK_CELLS_IN_TEXTJOIN",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What boolean parameter in `=TEXTJOIN(delimiter, ignore_empty, range)` instructs the function to skip blank cells?",
          "expectedStringOutput": "TRUE_PARAMETER_AUTOMATICALLY_SKIPS_BLANK_CELLS_IN_TEXTJOIN",
          "acceptableAnswers": [
            "TRUE_PARAMETER_AUTOMATICALLY_SKIPS_BLANK_CELLS_IN_TEXTJOIN",
            "TRUE",
            "True",
            "true"
          ],
          "primaryMisconceptionId": "MC_EX_TEXT_MANIPULATION_TRIM_CONCAT_PROPER",
          "diagnosisMap": {
            "FALSE": {
              "misconceptionId": "MC_EX_TEXT_MANIPULATION_TRIM_CONCAT_PROPER",
              "errorExplanation": "FALSE includes blank commas. Skipping blanks requires TRUE_PARAMETER_AUTOMATICALLY_SKIPS_BLANK_CELLS_IN_TEXTJOIN.",
              "recoveryPath": {
                "simplerExplanation": "Matches TRUE_PARAMETER_AUTOMATICALLY_SKIPS_BLANK_CELLS_IN_TEXTJOIN.",
                "guidedFixPrompt": "Type TRUE_PARAMETER_AUTOMATICALLY_SKIPS_BLANK_CELLS_IN_TEXTJOIN"
              }
            }
          }
        }
      },
      {
        "id": "ex-d7-b3-string-slicing-left-right-mid",
        "day": 7,
        "blockNumber": 3,
        "title": "String Slicing: `LEFT(text, num)`, `RIGHT(text, num)` & `MID(text, start, num)`",
        "conceptBudget": {
          "primaryConcept": "String Slicing Invariant",
          "supportingTerms": [
            "`LEFT` (Extracts leading characters)",
            "`RIGHT` (Extracts trailing characters)",
            "`MID` (Extracts characters from the center based on starting character index)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d7-b2-textjoin-vs-concatenate",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "string_slice_demo.js",
            "initialCode": "function getMidFunctionRule() {\n  return 'MID_FUNCTION_EXTRACTS_SUBSTRINGS_FROM_SPECIFIED_START_POSITION';\n}\n\nconsole.log(getMidFunctionRule());",
            "expectedOutput": "MID_FUNCTION_EXTRACTS_SUBSTRINGS_FROM_SPECIFIED_START_POSITION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which Excel text function extracts characters from the middle of a string based on a specified starting character position?",
          "expectedStringOutput": "MID_FUNCTION_EXTRACTS_SUBSTRINGS_FROM_SPECIFIED_START_POSITION",
          "acceptableAnswers": [
            "MID_FUNCTION_EXTRACTS_SUBSTRINGS_FROM_SPECIFIED_START_POSITION",
            "MID",
            "mid"
          ],
          "primaryMisconceptionId": "MC_EX_TEXT_MANIPULATION_TRIM_CONCAT_PROPER",
          "diagnosisMap": {
            "LEFT": {
              "misconceptionId": "MC_EX_TEXT_MANIPULATION_TRIM_CONCAT_PROPER",
              "errorExplanation": "LEFT extracts from the beginning. Center extraction is MID_FUNCTION_EXTRACTS_SUBSTRINGS_FROM_SPECIFIED_START_POSITION.",
              "recoveryPath": {
                "simplerExplanation": "Matches MID_FUNCTION_EXTRACTS_SUBSTRINGS_FROM_SPECIFIED_START_POSITION.",
                "guidedFixPrompt": "Type MID_FUNCTION_EXTRACTS_SUBSTRINGS_FROM_SPECIFIED_START_POSITION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Date & Time Calculation Mechanics: Excel Serial Numbers, `DATEDIF` & `EOMONTH`",
    "overviewMetaphor": "Spreadsheet Dates Are Days Marked on a Continuous Calendar Tape: Excel does not store 'January 31, 2026' as a string; it stores the integer number of elapsed days since January 1, 1900; subtracting January 1 from January 31 ($31 - 1 = 30\\text{ days}$) is as simple as subtracting two integers.",
    "blocks": [
      {
        "id": "ex-d8-b1-date-interval-calculation",
        "day": 8,
        "blockNumber": 1,
        "title": "Date Interval Calculation: `'2026-01-01'` to `'2026-01-31'` $\\to 30$ Elapsed Days",
        "conceptBudget": {
          "primaryConcept": "Excel Serial Date Interval Calculation",
          "supportingTerms": [
            "Start Date (`'2026-01-01'`)",
            "End Date (`'2026-01-31'`)",
            "Elapsed Calendar Days ($30$ days)",
            "Status: Date Interval Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d7-b1-text-cleansing-pipeline",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Excel Serial Date & Calendar Difference Ledger",
              "boxes": [
                {
                  "label": "Start Date Serial",
                  "value": "2026-01-01 (Excel Serial Number: ~46,023)",
                  "varType": "Start Serial",
                  "isUpdated": false
                },
                {
                  "label": "End Date Serial",
                  "value": "2026-01-31 (Excel Serial Number: ~46,053)",
                  "varType": "End Serial",
                  "isUpdated": false
                },
                {
                  "label": "Elapsed Calendar Days",
                  "value": "46,053 - 46,023 = 30 Days (DATE INTERVAL CALCULATED NOMINAL!)",
                  "varType": "Days",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "date_calc_demo.js",
            "initialCode": "function calculateDays(d1Str, d2Str) {\n  const diff = new Date(d2Str).getTime() - new Date(d1Str).getTime();\n  const days = Math.round(diff / (1000 * 60 * 60 * 24));\n  return {\n    d1: d1Str,\n    d2: d2Str,\n    elapsedDays: days,\n    status: 'DATE_INTERVAL_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(calculateDays('2026-01-01', '2026-01-31')));",
            "expectedOutput": "{\"d1\":\"2026-01-01\",\"d2\":\"2026-01-31\",\"elapsedDays\":30,\"status\":\"DATE_INTERVAL_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many elapsed calendar days occur between '2026-01-01' and '2026-01-31'?",
          "expectedStringOutput": "30",
          "acceptableAnswers": [
            "30",
            "30 days",
            "elapsedDays\":30"
          ],
          "primaryMisconceptionId": "MC_EX_DATE_TIME_CALCULATIONS_SERIAL_DATEDIF",
          "diagnosisMap": {
            "31": {
              "misconceptionId": "MC_EX_DATE_TIME_CALCULATIONS_SERIAL_DATEDIF",
              "errorExplanation": "January has 31 days total, but the elapsed difference between Jan 1 and Jan 31 is 31 - 1 = 30 days.",
              "recoveryPath": {
                "simplerExplanation": "31 - 1 = 30 days.",
                "guidedFixPrompt": "Type 30"
              }
            }
          }
        }
      },
      {
        "id": "ex-d8-b2-eomonth-financial-month-ends",
        "day": 8,
        "blockNumber": 2,
        "title": "Financial Month-Ends: `=EOMONTH(start_date, months)` Mechanics",
        "conceptBudget": {
          "primaryConcept": "EOMONTH Function Invariant",
          "supportingTerms": [
            "`EOMONTH` (`=EOMONTH(\"2026-01-15\", 0)` returns 2026-01-31; `=EOMONTH(\"2026-01-15\", 1)` returns 2026-02-28, handling leap years automatically)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d8-b1-date-interval-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "EOMONTH Syntax",
            "codeSnippet": "// =EOMONTH(TODAY(), 0)  -> Last day of the current month (e.g. March 31)\n// =EOMONTH(TODAY(), 1)  -> Last day of next month (e.g. April 30)\n// =EOMONTH(TODAY(), -1) -> Last day of previous month (e.g. February 28)",
            "lineNotes": {
              "1": "Current month end.",
              "2": "Next month end.",
              "3": "Prior month end."
            }
          },
          {
            "type": "runnable_code",
            "filename": "eomonth_demo.js",
            "initialCode": "function getEomonthZeroParamRule() {\n  return 'EOMONTH_WITH_ZERO_RETURNS_LAST_DAY_OF_CURRENT_MONTH';\n}\n\nconsole.log(getEomonthZeroParamRule());",
            "expectedOutput": "EOMONTH_WITH_ZERO_RETURNS_LAST_DAY_OF_CURRENT_MONTH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What date is returned when passing `0` as the months parameter in `=EOMONTH(date, 0)`?",
          "expectedStringOutput": "EOMONTH_WITH_ZERO_RETURNS_LAST_DAY_OF_CURRENT_MONTH",
          "acceptableAnswers": [
            "EOMONTH_WITH_ZERO_RETURNS_LAST_DAY_OF_CURRENT_MONTH",
            "Last day of current month",
            "End of current month"
          ],
          "primaryMisconceptionId": "MC_EX_DATE_TIME_CALCULATIONS_SERIAL_DATEDIF",
          "diagnosisMap": {
            "START": {
              "misconceptionId": "MC_EX_DATE_TIME_CALCULATIONS_SERIAL_DATEDIF",
              "errorExplanation": "EOMONTH calculates the end: EOMONTH_WITH_ZERO_RETURNS_LAST_DAY_OF_CURRENT_MONTH.",
              "recoveryPath": {
                "simplerExplanation": "Matches EOMONTH_WITH_ZERO_RETURNS_LAST_DAY_OF_CURRENT_MONTH.",
                "guidedFixPrompt": "Type EOMONTH_WITH_ZERO_RETURNS_LAST_DAY_OF_CURRENT_MONTH"
              }
            }
          }
        }
      },
      {
        "id": "ex-d8-b3-workday-and-networkdays-business-calendars",
        "day": 8,
        "blockNumber": 3,
        "title": "Business Days: `WORKDAY` & `NETWORKDAYS` (Excluding Weekends & Holidays)",
        "conceptBudget": {
          "primaryConcept": "Business Day Calculation Invariant",
          "supportingTerms": [
            "`NETWORKDAYS(start, end, [holidays])` (Calculates actual working business days by automatically excluding Saturdays, Sundays, and customized corporate holiday ranges)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d8-b2-eomonth-financial-month-ends",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "workday_demo.js",
            "initialCode": "function getNetworkdaysExclusionStandard() {\n  return 'NETWORKDAYS_AUTOMATICALLY_EXCLUDES_SATURDAYS_SUNDAYS_AND_HOLIDAYS';\n}\n\nconsole.log(getNetworkdaysExclusionStandard());",
            "expectedOutput": "NETWORKDAYS_AUTOMATICALLY_EXCLUDES_SATURDAYS_SUNDAYS_AND_HOLIDAYS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which days of the week are automatically excluded by default in `=NETWORKDAYS()` calculations?",
          "expectedStringOutput": "NETWORKDAYS_AUTOMATICALLY_EXCLUDES_SATURDAYS_SUNDAYS_AND_HOLIDAYS",
          "acceptableAnswers": [
            "NETWORKDAYS_AUTOMATICALLY_EXCLUDES_SATURDAYS_SUNDAYS_AND_HOLIDAYS",
            "Weekends",
            "Saturdays and Sundays"
          ],
          "primaryMisconceptionId": "MC_EX_DATE_TIME_CALCULATIONS_SERIAL_DATEDIF",
          "diagnosisMap": {
            "NONE": {
              "misconceptionId": "MC_EX_DATE_TIME_CALCULATIONS_SERIAL_DATEDIF",
              "errorExplanation": "NETWORKDAYS filters business days: NETWORKDAYS_AUTOMATICALLY_EXCLUDES_SATURDAYS_SUNDAYS_AND_HOLIDAYS.",
              "recoveryPath": {
                "simplerExplanation": "Matches NETWORKDAYS_AUTOMATICALLY_EXCLUDES_SATURDAYS_SUNDAYS_AND_HOLIDAYS.",
                "guidedFixPrompt": "Type NETWORKDAYS_AUTOMATICALLY_EXCLUDES_SATURDAYS_SUNDAYS_AND_HOLIDAYS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Classic Lookup Functions: `VLOOKUP` (Exact Match `FALSE` / `0`), `HLOOKUP` & `#N/A`",
    "overviewMetaphor": "VLOOKUP Is Looking Up a Phone Number in a Physical Yellow Pages Book: You scan down the leftmost column (ID 101), move your finger 3 columns to the right, and read the job title ('Engineer'); if the name is absent, you get an `#N/A` error; forgetting the `FALSE` exact match parameter makes you call the wrong person!",
    "blocks": [
      {
        "id": "ex-d9-b1-vlookup-exact-match-simulator",
        "day": 9,
        "blockNumber": 1,
        "title": "VLOOKUP Table Search: `VLOOKUP(101, Table, 3, FALSE)` $\\to$ `'Engineer'`",
        "conceptBudget": {
          "primaryConcept": "VLOOKUP Exact Match Table Search",
          "supportingTerms": [
            "Lookup Value (`101`)",
            "Table Array Database",
            "Target Column Index (`3`)",
            "Exact Match Parameter (`FALSE` / `0`)",
            "Status: VLOOKUP Exact Match Resolved Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d8-b1-date-interval-calculation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "VLOOKUP Column Indexing & Search Ledger",
              "boxes": [
                {
                  "label": "Col 1: Primary Key",
                  "value": "ID: 101 (Scanned vertically in column A)",
                  "varType": "Key",
                  "isUpdated": false
                },
                {
                  "label": "Col 2: Employee Name",
                  "value": "Name: 'Alice'",
                  "varType": "Col 2",
                  "isUpdated": false
                },
                {
                  "label": "Col 3: Job Role Target",
                  "value": "Role: 'Engineer' (VLOOKUP EXACT MATCH RESOLVED NOMINAL!)",
                  "varType": "Col 3",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "vlookup_demo.js",
            "initialCode": "function executeVlookup(records, key, targetCol) {\n  const match = records.find(r => r.id === key);\n  if (!match) return { found: false, result: '#N/A', status: 'LOOKUP_KEY_NOT_FOUND' };\n  return { found: true, result: match[targetCol], status: 'VLOOKUP_EXACT_MATCH_RESOLVED_NOMINAL' };\n}\n\nconst db = [{ id: 101, name: 'Alice', role: 'Engineer' }, { id: 102, name: 'Bob', role: 'Designer' }];\nconsole.log(JSON.stringify(executeVlookup(db, 101, 'role')));\nconsole.log(JSON.stringify(executeVlookup(db, 999, 'role')));",
            "expectedOutput": "{\"found\":true,\"result\":\"Engineer\",\"status\":\"VLOOKUP_EXACT_MATCH_RESOLVED_NOMINAL\"}\n{\"found\":false,\"result\":\"#N/A\",\"status\":\"LOOKUP_KEY_NOT_FOUND\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What exact match parameter flag must be provided as the 4th argument in `=VLOOKUP()` to prevent approximate match errors?",
          "expectedStringOutput": "FALSE",
          "acceptableAnswers": [
            "FALSE",
            "false",
            "0",
            "Exact match false"
          ],
          "primaryMisconceptionId": "MC_EX_CLASSIC_LOOKUPS_VLOOKUP_EXACT_MATCH",
          "diagnosisMap": {
            "TRUE": {
              "misconceptionId": "MC_EX_CLASSIC_LOOKUPS_VLOOKUP_EXACT_MATCH",
              "errorExplanation": "TRUE performs approximate matching on sorted data. Exact lookups mandate FALSE.",
              "recoveryPath": {
                "simplerExplanation": "Use FALSE for exact match.",
                "guidedFixPrompt": "Type FALSE"
              }
            }
          }
        }
      },
      {
        "id": "ex-d9-b2-vlookup-leftward-limitation",
        "day": 9,
        "blockNumber": 2,
        "title": "The Left-to-Right Limitation of VLOOKUP",
        "conceptBudget": {
          "primaryConcept": "VLOOKUP Leftward Limitation Invariant",
          "supportingTerms": [
            "Left-to-Right Barrier (VLOOKUP can only search for a key in column 1 and look rightward; it cannot return a column located to the left of the lookup key)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d9-b1-vlookup-exact-match-simulator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "VLOOKUP Leftward Failure",
            "codeSnippet": "// If Key is in Column C and Target Value is in Column A:\n// =VLOOKUP(\"Key\", A:C, -2, FALSE) -> #VALUE! ERROR (VLOOKUP cannot look left!)\n// Solution: Use INDEX-MATCH or modern XLOOKUP!",
            "lineNotes": {
              "1": "Target column to the left of key.",
              "2": "Negative column index crashes.",
              "3": "Recommended architectural fix."
            }
          },
          {
            "type": "runnable_code",
            "filename": "leftward_limitation_demo.js",
            "initialCode": "function getVlookupDirectionalLimitation() {\n  return 'VLOOKUP_CANNOT_SEARCH_COLUMNS_LOCATED_TO_THE_LEFT_OF_THE_LOOKUP_KEY';\n}\n\nconsole.log(getVlookupDirectionalLimitation());",
            "expectedOutput": "VLOOKUP_CANNOT_SEARCH_COLUMNS_LOCATED_TO_THE_LEFT_OF_THE_LOOKUP_KEY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What major directional limitation restricts the classic `=VLOOKUP()` function?",
          "expectedStringOutput": "VLOOKUP_CANNOT_SEARCH_COLUMNS_LOCATED_TO_THE_LEFT_OF_THE_LOOKUP_KEY",
          "acceptableAnswers": [
            "VLOOKUP_CANNOT_SEARCH_COLUMNS_LOCATED_TO_THE_LEFT_OF_THE_LOOKUP_KEY",
            "Cannot look left",
            "Left to right only"
          ],
          "primaryMisconceptionId": "MC_EX_CLASSIC_LOOKUPS_VLOOKUP_EXACT_MATCH",
          "diagnosisMap": {
            "NONE": {
              "misconceptionId": "MC_EX_CLASSIC_LOOKUPS_VLOOKUP_EXACT_MATCH",
              "errorExplanation": "VLOOKUP is structurally limited: VLOOKUP_CANNOT_SEARCH_COLUMNS_LOCATED_TO_THE_LEFT_OF_THE_LOOKUP_KEY.",
              "recoveryPath": {
                "simplerExplanation": "Matches VLOOKUP_CANNOT_SEARCH_COLUMNS_LOCATED_TO_THE_LEFT_OF_THE_LOOKUP_KEY.",
                "guidedFixPrompt": "Type VLOOKUP_CANNOT_SEARCH_COLUMNS_LOCATED_TO_THE_LEFT_OF_THE_LOOKUP_KEY"
              }
            }
          }
        }
      },
      {
        "id": "ex-d9-b3-column-insertion-breaking-fragility",
        "day": 9,
        "blockNumber": 3,
        "title": "Hardcoded Column Index Fragility: Why Inserting Columns Breaks VLOOKUP",
        "conceptBudget": {
          "primaryConcept": "Column Index Fragility Invariant",
          "supportingTerms": [
            "Fragile Column Indices (Hardcoding `col_index = 3` in `=VLOOKUP(A1, B:E, 3, FALSE)` silently returns wrong data when a user inserts a new column in between)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d9-b2-vlookup-leftward-limitation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "fragility_demo.js",
            "initialCode": "function getHardcodedColIndexRisk() {\n  return 'INSERTING_A_COLUMN_SILENTLY_BREAKS_HARDCODED_VLOOKUP_INDEX_NUMBERS';\n}\n\nconsole.log(getHardcodedColIndexRisk());",
            "expectedOutput": "INSERTING_A_COLUMN_SILENTLY_BREAKS_HARDCODED_VLOOKUP_INDEX_NUMBERS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why do enterprise financial modelers avoid hardcoding static column index numbers in `=VLOOKUP()` formulas?",
          "expectedStringOutput": "INSERTING_A_COLUMN_SILENTLY_BREAKS_HARDCODED_VLOOKUP_INDEX_NUMBERS",
          "acceptableAnswers": [
            "INSERTING_A_COLUMN_SILENTLY_BREAKS_HARDCODED_VLOOKUP_INDEX_NUMBERS",
            "Inserting columns breaks formula",
            "Fragile"
          ],
          "primaryMisconceptionId": "MC_EX_CLASSIC_LOOKUPS_VLOOKUP_EXACT_MATCH",
          "diagnosisMap": {
            "SAFE": {
              "misconceptionId": "MC_EX_CLASSIC_LOOKUPS_VLOOKUP_EXACT_MATCH",
              "errorExplanation": "Inserted columns offset indices: INSERTING_A_COLUMN_SILENTLY_BREAKS_HARDCODED_VLOOKUP_INDEX_NUMBERS.",
              "recoveryPath": {
                "simplerExplanation": "Matches INSERTING_A_COLUMN_SILENTLY_BREAKS_HARDCODED_VLOOKUP_INDEX_NUMBERS.",
                "guidedFixPrompt": "Type INSERTING_A_COLUMN_SILENTLY_BREAKS_HARDCODED_VLOOKUP_INDEX_NUMBERS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Advanced Two-Way Lookups: `INDEX` & `MATCH` Dynamic Matrix Retrieval",
    "overviewMetaphor": "INDEX-MATCH Is a GPS Coordinate System for Spreadsheets: `MATCH` acts as the satellite finding your exact latitude and longitude indices (Row 3 = 'Q3', Col 2 = 'SOUTH'); `INDEX` then drives directly to that GPS cross-street coordinate and retrieves the exact revenue value ($280), immune to column insertions and capable of looking in any direction.",
    "blocks": [
      {
        "id": "ex-d10-b1-index-match-two-way-matrix-lookup",
        "day": 10,
        "blockNumber": 1,
        "title": "Two-Way `INDEX-MATCH`: Matrix Intersection Retrieval (`'Q3'` $\\times$ `'SOUTH'` $\\to 280$)",
        "conceptBudget": {
          "primaryConcept": "Two-Way INDEX-MATCH Matrix Lookup",
          "supportingTerms": [
            "Row Headers (`['Q1', 'Q2', 'Q3', 'Q4']`)",
            "Column Headers (`['NORTH', 'SOUTH', 'EAST']`)",
            "Target Row (`'Q3'`)",
            "Target Col (`'SOUTH'`)",
            "Intersected Matrix Value ($280$)",
            "Status: INDEX MATCH Two-Way Resolved Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d9-b1-vlookup-exact-match-simulator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "INDEX-MATCH 2D Cross-Table Matrix Ledger",
              "boxes": [
                {
                  "label": "Row Coordinate Match",
                  "value": "MATCH('Q3', Rows, 0) -> Row Index 2",
                  "varType": "Row Match",
                  "isUpdated": false
                },
                {
                  "label": "Col Coordinate Match",
                  "value": "MATCH('SOUTH', Cols, 0) -> Col Index 1",
                  "varType": "Col Match",
                  "isUpdated": false
                },
                {
                  "label": "INDEX Value Retrieval",
                  "value": "INDEX(Matrix, 2, 1) = 280 (INDEX-MATCH TWO-WAY RESOLVED NOMINAL!)",
                  "varType": "Value",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "index_match_demo.js",
            "initialCode": "function executeIndexMatch2D(matrix, rows, cols, rTarget, cTarget) {\n  const rIdx = rows.indexOf(rTarget);\n  const cIdx = cols.indexOf(cTarget);\n  if (rIdx === -1 || cIdx === -1) return { found: false, value: '#N/A' };\n  return {\n    rIdx, cIdx,\n    value: matrix[rIdx][cIdx],\n    status: 'INDEX_MATCH_TWO_WAY_RESOLVED_NOMINAL'\n  };\n}\n\nconst rows = ['Q1', 'Q2', 'Q3', 'Q4'];\nconst cols = ['NORTH', 'SOUTH', 'EAST'];\nconst matrix = [[100, 200, 300], [150, 250, 350], [180, 280, 380], [220, 320, 420]];\nconsole.log(JSON.stringify(executeIndexMatch2D(matrix, rows, cols, 'Q3', 'SOUTH')));",
            "expectedOutput": "{\"rIdx\":2,\"cIdx\":1,\"value\":280,\"status\":\"INDEX_MATCH_TWO_WAY_RESOLVED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What intersection value is returned by `INDEX-MATCH-MATCH` for row 'Q3' and column 'SOUTH'?",
          "expectedStringOutput": "280",
          "acceptableAnswers": [
            "280",
            "value\":280",
            "value: 280"
          ],
          "primaryMisconceptionId": "MC_EX_ADVANCED_LOOKUPS_INDEX_MATCH_TWO_WAY",
          "diagnosisMap": {
            "180": {
              "misconceptionId": "MC_EX_ADVANCED_LOOKUPS_INDEX_MATCH_TWO_WAY",
              "errorExplanation": "180 is Q3 NORTH. Q3 SOUTH is column index 1 = 280.",
              "recoveryPath": {
                "simplerExplanation": "Matrix value is 280.",
                "guidedFixPrompt": "Type 280"
              }
            }
          }
        }
      },
      {
        "id": "ex-d10-b2-match-exact-match-type-zero",
        "day": 10,
        "blockNumber": 2,
        "title": "The Mandatory `0` Match Type Parameter in `=MATCH()`",
        "conceptBudget": {
          "primaryConcept": "MATCH Exact Type Invariant",
          "supportingTerms": [
            "`MATCH(val, range, 0)` (`0` enforces exact match; `1` performs approximate less-than match on ascending data; `-1` performs greater-than match on descending data)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d10-b1-index-match-two-way-matrix-lookup",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "MATCH Function Type Argument",
            "codeSnippet": "// =MATCH(lookup_value, lookup_array, [match_type])\n// match_type = 0:  EXACT MATCH (Default required for database queries!)\n// match_type = 1:  Less than or equal (Requires sorted ascending array)\n// match_type = -1: Greater than or equal (Requires sorted descending array)",
            "lineNotes": {
              "2": "0 is exact match.",
              "3": "1 is approximate ascending.",
              "4": "-1 is approximate descending."
            }
          },
          {
            "type": "runnable_code",
            "filename": "match_type_demo.js",
            "initialCode": "function getExactMatchTypeParam() {\n  return 0;\n}\n\nconsole.log(getExactMatchTypeParam());",
            "expectedOutput": "0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What number must be passed as the 3rd argument in `=MATCH(value, range, 0)` to guarantee an exact match lookup?",
          "expectedStringOutput": "0",
          "acceptableAnswers": [
            "0",
            "zero",
            "0 (zero)"
          ],
          "primaryMisconceptionId": "MC_EX_ADVANCED_LOOKUPS_INDEX_MATCH_TWO_WAY",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_EX_ADVANCED_LOOKUPS_INDEX_MATCH_TWO_WAY",
              "errorExplanation": "1 is approximate match. Exact matching requires 0.",
              "recoveryPath": {
                "simplerExplanation": "Pass 0 for exact match.",
                "guidedFixPrompt": "Type 0"
              }
            }
          }
        }
      },
      {
        "id": "ex-d10-b3-index-match-resilience-to-column-inserts",
        "day": 10,
        "blockNumber": 3,
        "title": "Architectural Resilience: Why INDEX-MATCH Never Breaks on Column Inserts",
        "conceptBudget": {
          "primaryConcept": "INDEX-MATCH Column Resilience Invariant",
          "supportingTerms": [
            "Dynamic Column Ranges (`INDEX(C:C, MATCH(...))` references the specific column range object directly, dynamically updating range addresses when new columns are inserted)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d10-b2-match-exact-match-type-zero",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "resilience_demo.js",
            "initialCode": "function getIndexMatchResilienceBenefit() {\n  return 'EXPLICIT_RANGE_REFERENCES_DYNAMICALLY_ADAPT_WHEN_COLUMNS_ARE_INSERTED';\n}\n\nconsole.log(getIndexMatchResilienceBenefit());",
            "expectedOutput": "EXPLICIT_RANGE_REFERENCES_DYNAMICALLY_ADAPT_WHEN_COLUMNS_ARE_INSERTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why is `INDEX-MATCH` preferred over `VLOOKUP` in enterprise financial modeling workbooks?",
          "expectedStringOutput": "EXPLICIT_RANGE_REFERENCES_DYNAMICALLY_ADAPT_WHEN_COLUMNS_ARE_INSERTED",
          "acceptableAnswers": [
            "EXPLICIT_RANGE_REFERENCES_DYNAMICALLY_ADAPT_WHEN_COLUMNS_ARE_INSERTED",
            "Adapts to inserted columns",
            "Immune to column inserts"
          ],
          "primaryMisconceptionId": "MC_EX_ADVANCED_LOOKUPS_INDEX_MATCH_TWO_WAY",
          "diagnosisMap": {
            "FASTER": {
              "misconceptionId": "MC_EX_ADVANCED_LOOKUPS_INDEX_MATCH_TWO_WAY",
              "errorExplanation": "Primary advantage is safety: EXPLICIT_RANGE_REFERENCES_DYNAMICALLY_ADAPT_WHEN_COLUMNS_ARE_INSERTED.",
              "recoveryPath": {
                "simplerExplanation": "Matches EXPLICIT_RANGE_REFERENCES_DYNAMICALLY_ADAPT_WHEN_COLUMNS_ARE_INSERTED.",
                "guidedFixPrompt": "Type EXPLICIT_RANGE_REFERENCES_DYNAMICALLY_ADAPT_WHEN_COLUMNS_ARE_INSERTED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Modern Universal Lookup Function: `XLOOKUP` (Leftward, Defaults & Search Modes)",
    "overviewMetaphor": "XLOOKUP Is the Smartphone That Replaced Both the Landline and Fax Machine: It combines the simplicity of VLOOKUP with the power of INDEX-MATCH; it searches leftward without hacks, defaults to exact match (no more forgetting `FALSE`), handles missing records with custom fallback text ('Employee Not Found'), and searches top-to-bottom or bottom-to-top.",
    "blocks": [
      {
        "id": "ex-d11-b1-xlookup-universal-lookup-simulator",
        "day": 11,
        "blockNumber": 1,
        "title": "`XLOOKUP` Universal Search: Native Leftward Lookups & Built-in Fallbacks",
        "conceptBudget": {
          "primaryConcept": "Modern XLOOKUP Universal Lookup Engine",
          "supportingTerms": [
            "Lookup Array (`[101, 102, 103]`)",
            "Return Array (`['Alice', 'Bob', 'Charlie']`)",
            "Target Lookup (`102` $\\to$ `'Bob'`)",
            "Missing Lookup (`999` $\\to$ `'Employee Not Found'`)",
            "Status: XLOOKUP Exact Match Resolved Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d10-b1-index-match-two-way-matrix-lookup",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "XLOOKUP Modern Vector-to-Vector Search Ledger",
              "boxes": [
                {
                  "label": "Lookup Array Range",
                  "value": "[101, 102, 103] (Independent Vector A)",
                  "varType": "Lookup Range",
                  "isUpdated": false
                },
                {
                  "label": "Return Array Range",
                  "value": "['Alice', 'Bob', 'Charlie'] (Independent Vector B)",
                  "varType": "Return Range",
                  "isUpdated": false
                },
                {
                  "label": "XLOOKUP Match & Fallback",
                  "value": "102 -> 'Bob' | 999 -> 'Employee Not Found' (XLOOKUP RESOLVED NOMINAL!)",
                  "varType": "Result",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "xlookup_demo.js",
            "initialCode": "function executeXlookup(lookups, returns, target, fallback) {\n  const idx = lookups.indexOf(target);\n  const val = idx !== -1 ? returns[idx] : fallback;\n  return {\n    target,\n    matchedIndex: idx,\n    returnValue: val,\n    status: idx !== -1 ? 'XLOOKUP_EXACT_MATCH_RESOLVED_NOMINAL' : 'XLOOKUP_FALLBACK_APPLIED'\n  };\n}\n\nconst ids = [101, 102, 103];\nconst names = ['Alice', 'Bob', 'Charlie'];\nconsole.log(JSON.stringify(executeXlookup(ids, names, 102, 'Not Found')));\nconsole.log(JSON.stringify(executeXlookup(ids, names, 999, 'Employee Not Found')));",
            "expectedOutput": "{\"target\":102,\"matchedIndex\":1,\"returnValue\":\"Bob\",\"status\":\"XLOOKUP_EXACT_MATCH_RESOLVED_NOMINAL\"}\n{\"target\":999,\"matchedIndex\":-1,\"returnValue\":\"Employee Not Found\",\"status\":\"XLOOKUP_FALLBACK_APPLIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What string value is returned by `XLOOKUP` when looking up ID 999 with the fallback argument 'Employee Not Found'?",
          "expectedStringOutput": "Employee Not Found",
          "acceptableAnswers": [
            "Employee Not Found",
            "returnValue\":\"Employee Not Found\""
          ],
          "primaryMisconceptionId": "MC_EX_MODERN_LOOKUPS_XLOOKUP_FALLBACKS",
          "diagnosisMap": {
            "#N/A": {
              "misconceptionId": "MC_EX_MODERN_LOOKUPS_XLOOKUP_FALLBACKS",
              "errorExplanation": "XLOOKUP has a built-in fallback parameter that replaces #N/A with 'Employee Not Found'.",
              "recoveryPath": {
                "simplerExplanation": "Returns fallback string 'Employee Not Found'.",
                "guidedFixPrompt": "Type Employee Not Found"
              }
            }
          }
        }
      },
      {
        "id": "ex-d11-b2-xlookup-default-exact-match",
        "day": 11,
        "blockNumber": 2,
        "title": "Default Match Mode: Why XLOOKUP Defaults to Exact Match",
        "conceptBudget": {
          "primaryConcept": "XLOOKUP Default Exact Match Invariant",
          "supportingTerms": [
            "Match Mode Default (In XLOOKUP, `match_mode` defaults to `0` exact match; unlike VLOOKUP, you do NOT need to specify `FALSE` to prevent errors)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d11-b1-xlookup-universal-lookup-simulator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "XLOOKUP Concise Syntax",
            "codeSnippet": "// =XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])\n// Example: =XLOOKUP(A2, B:B, C:C, \"Missing\") -> Performs exact match by default!",
            "lineNotes": {
              "1": "Full XLOOKUP signature.",
              "2": "Concise 4-argument implementation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "xlookup_default_demo.js",
            "initialCode": "function getXlookupDefaultMatchMode() {\n  return 'EXACT_MATCH_IS_THE_BUILT_IN_DEFAULT_IN_XLOOKUP';\n}\n\nconsole.log(getXlookupDefaultMatchMode());",
            "expectedOutput": "EXACT_MATCH_IS_THE_BUILT_IN_DEFAULT_IN_XLOOKUP",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the default match mode behavior in `=XLOOKUP()` when the match_mode parameter is omitted?",
          "expectedStringOutput": "EXACT_MATCH_IS_THE_BUILT_IN_DEFAULT_IN_XLOOKUP",
          "acceptableAnswers": [
            "EXACT_MATCH_IS_THE_BUILT_IN_DEFAULT_IN_XLOOKUP",
            "Exact match",
            "Exact match default"
          ],
          "primaryMisconceptionId": "MC_EX_MODERN_LOOKUPS_XLOOKUP_FALLBACKS",
          "diagnosisMap": {
            "APPROXIMATE": {
              "misconceptionId": "MC_EX_MODERN_LOOKUPS_XLOOKUP_FALLBACKS",
              "errorExplanation": "VLOOKUP defaulted to approximate. XLOOKUP defaults to EXACT_MATCH_IS_THE_BUILT_IN_DEFAULT_IN_XLOOKUP.",
              "recoveryPath": {
                "simplerExplanation": "Matches EXACT_MATCH_IS_THE_BUILT_IN_DEFAULT_IN_XLOOKUP.",
                "guidedFixPrompt": "Type EXACT_MATCH_IS_THE_BUILT_IN_DEFAULT_IN_XLOOKUP"
              }
            }
          }
        }
      },
      {
        "id": "ex-d11-b3-xlookup-reverse-search-mode",
        "day": 11,
        "blockNumber": 3,
        "title": "Search Modes: Bottom-to-Top Reverse Lookups (`search_mode: -1`)",
        "conceptBudget": {
          "primaryConcept": "Reverse Search Mode Invariant",
          "supportingTerms": [
            "`search_mode = -1` (Searches from the bottom of the table upward, enabling instant lookup of the MOST RECENT transaction for a given customer)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d11-b2-xlookup-default-exact-match",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "reverse_search_demo.js",
            "initialCode": "function getReverseSearchParam() {\n  return -1;\n}\n\nconsole.log(getReverseSearchParam());",
            "expectedOutput": "-1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What search_mode argument value in `=XLOOKUP()` performs a reverse bottom-to-top search to find the latest transaction entry?",
          "expectedStringOutput": "-1",
          "acceptableAnswers": [
            "-1",
            "search_mode: -1",
            "minus one"
          ],
          "primaryMisconceptionId": "MC_EX_MODERN_LOOKUPS_XLOOKUP_FALLBACKS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_EX_MODERN_LOOKUPS_XLOOKUP_FALLBACKS",
              "errorExplanation": "1 is top-to-bottom. Reverse search requires -1.",
              "recoveryPath": {
                "simplerExplanation": "Pass -1 for reverse search.",
                "guidedFixPrompt": "Type -1"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Dynamic Array Formulas & Spill Ranges: `FILTER`, `UNIQUE`, `SORT` & `#SPILL!`",
    "overviewMetaphor": "Dynamic Array Formulas Are a Water Waterfall Spilling into Multiple Buckets: You write one single formula in cell `A1` (`=SORT(UNIQUE(FILTER(Data, Cat=\"TECH\")))`), and the output automatically overflows and spills down into cells A1:A5 without typing formulas in the other cells; placing physical text in cell A3 blocks the waterfall and triggers a `#SPILL!` collision error.",
    "blocks": [
      {
        "id": "ex-d12-b1-dynamic-array-filter-unique-engine",
        "day": 12,
        "blockNumber": 1,
        "title": "Dynamic Arrays: `=SORT(UNIQUE(FILTER(Records, Cat=\"TECH\")))` $\\to$ `['Alice', 'Bob']`",
        "conceptBudget": {
          "primaryConcept": "Dynamic Array FILTER and UNIQUE Spilling Engine",
          "supportingTerms": [
            "Category Filter (`'TECH'`)",
            "Spill Count ($2$ elements)",
            "Spilled Array (`['Alice', 'Bob']`)",
            "Status: Dynamic Array Filter Unique Spilled Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d11-b1-xlookup-universal-lookup-simulator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Dynamic Array Spill Range & Multi-Cell Ledger",
              "boxes": [
                {
                  "label": "Formula Origin Cell (A1)",
                  "value": "=SORT(UNIQUE(FILTER(Sales[Name], Sales[Cat]=\"TECH\")))",
                  "varType": "Formula",
                  "isUpdated": false
                },
                {
                  "label": "Spill Range (A1:A2)",
                  "value": "Cell A1: 'Alice' | Cell A2: 'Bob' (Spill Count = 2)",
                  "varType": "Spill Range",
                  "isUpdated": false
                },
                {
                  "label": "Spill Status",
                  "value": "DYNAMIC ARRAY FILTER UNIQUE SPILLED NOMINAL (0 BLOCKING COLLISIONS!)",
                  "varType": "Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dynamic_array_demo.js",
            "initialCode": "function executeFilterUnique(records, cat) {\n  const matched = records.filter(r => r.category === cat).map(r => r.name);\n  const unique = Array.from(new Set(matched)).sort();\n  return {\n    cat,\n    spillCount: unique.length,\n    spilledArray: unique,\n    status: 'DYNAMIC_ARRAY_FILTER_UNIQUE_SPILLED_NOMINAL'\n  };\n}\n\nconst data = [\n  { category: 'TECH', name: 'Bob' },\n  { category: 'TECH', name: 'Alice' },\n  { category: 'SALES', name: 'Charlie' },\n  { category: 'TECH', name: 'Alice' }\n];\nconsole.log(JSON.stringify(executeFilterUnique(data, 'TECH')));",
            "expectedOutput": "{\"cat\":\"TECH\",\"spillCount\":2,\"spilledArray\":[\"Alice\",\"Bob\"],\"status\":\"DYNAMIC_ARRAY_FILTER_UNIQUE_SPILLED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many unique names are spilled when filtering category 'TECH' from `['Bob', 'Alice', 'Charlie', 'Alice']`?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "spillCount\":2",
            "2 elements"
          ],
          "primaryMisconceptionId": "MC_EX_DYNAMIC_ARRAYS_FILTER_UNIQUE_SPILL",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_EX_DYNAMIC_ARRAYS_FILTER_UNIQUE_SPILL",
              "errorExplanation": "3 includes the duplicate 'Alice'. UNIQUE deduplicates 'Alice' and 'Bob' to 2 items.",
              "recoveryPath": {
                "simplerExplanation": "Unique count is 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "ex-d12-b2-spill-operator-hash-symbol",
        "day": 12,
        "blockNumber": 2,
        "title": "The Spill Operator Hash `#`: Referencing Entire Dynamic Array Spill Ranges",
        "conceptBudget": {
          "primaryConcept": "Spill Operator Invariant",
          "supportingTerms": [
            "Spill Operator (`A1#`: Referencing `A1#` dynamically grabs the entire spilled array range regardless of whether it spans 5 rows or 500 rows)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d12-b1-dynamic-array-filter-unique-engine",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Spill Operator Syntax",
            "codeSnippet": "// Cell A1: =UNIQUE(B2:B100) -> Spills names into A1:A12\n// Cell C1: =COUNTA(A1#)     -> Dynamically references all 12 spilled items!\n// If data expands to 20 names, A1# automatically expands without formula edits!",
            "lineNotes": {
              "1": "Origin formula cell.",
              "2": "Spill reference using # symbol.",
              "3": "Dynamic automatic expansion."
            }
          },
          {
            "type": "runnable_code",
            "filename": "spill_operator_demo.js",
            "initialCode": "function getSpillOperatorSymbol() {\n  return '#';\n}\n\nconsole.log(getSpillOperatorSymbol());",
            "expectedOutput": "#",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What symbol appended to a cell address (e.g. `A1#`) references the entire dynamic array spill range?",
          "expectedStringOutput": "#",
          "acceptableAnswers": [
            "#",
            "Hash",
            "hash",
            "# symbol"
          ],
          "primaryMisconceptionId": "MC_EX_DYNAMIC_ARRAYS_FILTER_UNIQUE_SPILL",
          "diagnosisMap": {
            "$": {
              "misconceptionId": "MC_EX_DYNAMIC_ARRAYS_FILTER_UNIQUE_SPILL",
              "errorExplanation": "$ is absolute cell locking. Referencing spilled ranges uses the hash symbol #.",
              "recoveryPath": {
                "simplerExplanation": "Type #.",
                "guidedFixPrompt": "Type #"
              }
            }
          }
        }
      },
      {
        "id": "ex-d12-b3-resolving-spill-collision-errors",
        "day": 12,
        "blockNumber": 3,
        "title": "Resolving `#SPILL!` Errors: Clearing Blocking Obstacles",
        "conceptBudget": {
          "primaryConcept": "Spill Collision Invariant",
          "supportingTerms": [
            "`#SPILL!` Error (Occurs when an adjacent cell in the expected spill range contains text, numbers, or merged formatting, physically obstructing the array)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d12-b2-spill-operator-hash-symbol",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "spill_error_demo.js",
            "initialCode": "function getSpillResolutionAction() {\n  return 'DELETE_OBSTRUCTING_DATA_IN_THE_SPILL_RANGE_TO_RESOLVE_SPILL_ERROR';\n}\n\nconsole.log(getSpillResolutionAction());",
            "expectedOutput": "DELETE_OBSTRUCTING_DATA_IN_THE_SPILL_RANGE_TO_RESOLVE_SPILL_ERROR",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How do spreadsheet users resolve a `#SPILL!` error in Excel formulas?",
          "expectedStringOutput": "DELETE_OBSTRUCTING_DATA_IN_THE_SPILL_RANGE_TO_RESOLVE_SPILL_ERROR",
          "acceptableAnswers": [
            "DELETE_OBSTRUCTING_DATA_IN_THE_SPILL_RANGE_TO_RESOLVE_SPILL_ERROR",
            "Clear obstructing cells",
            "Delete blocking data"
          ],
          "primaryMisconceptionId": "MC_EX_DYNAMIC_ARRAYS_FILTER_UNIQUE_SPILL",
          "diagnosisMap": {
            "REWRITE": {
              "misconceptionId": "MC_EX_DYNAMIC_ARRAYS_FILTER_UNIQUE_SPILL",
              "errorExplanation": "The formula is valid; the grid is blocked: DELETE_OBSTRUCTING_DATA_IN_THE_SPILL_RANGE_TO_RESOLVE_SPILL_ERROR.",
              "recoveryPath": {
                "simplerExplanation": "Matches DELETE_OBSTRUCTING_DATA_IN_THE_SPILL_RANGE_TO_RESOLVE_SPILL_ERROR.",
                "guidedFixPrompt": "Type DELETE_OBSTRUCTING_DATA_IN_THE_SPILL_RANGE_TO_RESOLVE_SPILL_ERROR"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Error Trapping & Formula Debugging: `IFERROR`, `IFNA`, `#DIV/0!` & Precedents",
    "overviewMetaphor": "Error Trapping Is a Fallback Safety Net on a Circus High-Wire: If an acrobat slips ($100 / 0 \\implies \\#\\text{DIV/0!}$), the safety net catches them safely (`=IFERROR(100/0, 0)` returns $0$), preventing an ugly fatal crash from ruining the entire executive dashboard presentation.",
    "blocks": [
      {
        "id": "ex-d13-b1-iferror-division-by-zero-trapping",
        "day": 13,
        "blockNumber": 1,
        "title": "Fault Tolerance: `=IFERROR(100 / 0, 0)` Traps `#DIV/0!` and Returns Safe Fallback",
        "conceptBudget": {
          "primaryConcept": "Safe Spreadsheet Division & IFERROR Trapping",
          "supportingTerms": [
            "Numerator ($100$)",
            "Denominator ($0$)",
            "Trapped Error Type (`'#DIV/0!'`)",
            "Safe Fallback Value ($0$)",
            "Status: Error Trapped Safe Fallback Applied"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d12-b1-dynamic-array-filter-unique-engine",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Spreadsheet Error Handling & Division Defense Ledger",
              "boxes": [
                {
                  "label": "Valid Calculation",
                  "value": "100 / 4 = 25.00 (isErrorTrapped: False)",
                  "varType": "Valid",
                  "isUpdated": false
                },
                {
                  "label": "Divide-by-Zero Slip",
                  "value": "100 / 0 -> #DIV/0! Intercepted by IFERROR Guard",
                  "varType": "Trapped",
                  "isUpdated": false
                },
                {
                  "label": "Safe Fallback Output",
                  "value": "Returns 0.00 (ERROR TRAPPED SAFE FALLBACK APPLIED NOMINAL!)",
                  "varType": "Fallback",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "iferror_demo.js",
            "initialCode": "function safeDivide(num, den, fallback) {\n  if (den === 0 || isNaN(den) || isNaN(num)) {\n    return { result: fallback, isTrapped: true, error: '#DIV/0!', status: 'ERROR_TRAPPED_SAFE_FALLBACK_APPLIED' };\n  }\n  return { result: Number((num / den).toFixed(2)), isTrapped: false, status: 'CALC_NOMINAL' };\n}\n\nconsole.log(JSON.stringify(safeDivide(100, 4, 0)));\nconsole.log(JSON.stringify(safeDivide(100, 0, 0)));",
            "expectedOutput": "{\"result\":25,\"isTrapped\":false,\"status\":\"CALC_NOMINAL\"}\n{\"result\":0,\"isTrapped\":true,\"error\":\"#DIV/0!\",\"status\":\"ERROR_TRAPPED_SAFE_FALLBACK_APPLIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What error code is generated when a spreadsheet formula attempts to divide a number by zero or an empty cell?",
          "expectedStringOutput": "#DIV/0!",
          "acceptableAnswers": [
            "#DIV/0!",
            "#DIV/0",
            "error\":\"#DIV/0!\""
          ],
          "primaryMisconceptionId": "MC_EX_ERROR_TRAPPING_IFERROR_IFNA_DEBUG",
          "diagnosisMap": {
            "#VALUE!": {
              "misconceptionId": "MC_EX_ERROR_TRAPPING_IFERROR_IFNA_DEBUG",
              "errorExplanation": "#VALUE! is type mismatch. Division by zero yields #DIV/0!.",
              "recoveryPath": {
                "simplerExplanation": "The error is #DIV/0!.",
                "guidedFixPrompt": "Type #DIV/0!"
              }
            }
          }
        }
      },
      {
        "id": "ex-d13-b2-ifna-vs-iferror-targeted-trapping",
        "day": 13,
        "blockNumber": 2,
        "title": "`IFNA` vs `IFERROR`: Why Senior Modelers Prefer Targeted `#N/A` Trapping",
        "conceptBudget": {
          "primaryConcept": "IFNA vs IFERROR Invariant",
          "supportingTerms": [
            "`IFNA` (Only suppresses missing lookup `#N/A` errors, allowing genuine formula syntax errors like `#REF!` or `#NAME?` to surface for debugging)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d13-b1-iferror-division-by-zero-trapping",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Targeted Error Suppression",
            "codeSnippet": "// ❌ DANGEROUS: =IFERROR(VLOOKUP(A1, Sheet2!A:C, 3, FALSE), \"\") (Hides broken sheet #REF! errors!)\n// ✅ SOUND:     =IFNA(VLOOKUP(A1, Sheet2!A:C, 3, FALSE), \"\")    (Only hides missing keys!)",
            "lineNotes": {
              "1": "IFERROR masks critical corrupted formula bugs.",
              "2": "IFNA safely handles missing data while exposing broken references."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ifna_demo.js",
            "initialCode": "function getIfnaAdvantage() {\n  return 'IFNA_ONLY_SUPPRESSES_MISSING_LOOKUPS_ALLOWING_SYNTAX_ERRORS_TO_SURFACE';\n}\n\nconsole.log(getIfnaAdvantage());",
            "expectedOutput": "IFNA_ONLY_SUPPRESSES_MISSING_LOOKUPS_ALLOWING_SYNTAX_ERRORS_TO_SURFACE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why do financial modelers prefer `=IFNA()` over `=IFERROR()` when wrapping lookup functions?",
          "expectedStringOutput": "IFNA_ONLY_SUPPRESSES_MISSING_LOOKUPS_ALLOWING_SYNTAX_ERRORS_TO_SURFACE",
          "acceptableAnswers": [
            "IFNA_ONLY_SUPPRESSES_MISSING_LOOKUPS_ALLOWING_SYNTAX_ERRORS_TO_SURFACE",
            "Only suppresses NA",
            "Exposes syntax errors"
          ],
          "primaryMisconceptionId": "MC_EX_ERROR_TRAPPING_IFERROR_IFNA_DEBUG",
          "diagnosisMap": {
            "FASTER": {
              "misconceptionId": "MC_EX_ERROR_TRAPPING_IFERROR_IFNA_DEBUG",
              "errorExplanation": "IFNA prevents masking bugs: IFNA_ONLY_SUPPRESSES_MISSING_LOOKUPS_ALLOWING_SYNTAX_ERRORS_TO_SURFACE.",
              "recoveryPath": {
                "simplerExplanation": "Matches IFNA_ONLY_SUPPRESSES_MISSING_LOOKUPS_ALLOWING_SYNTAX_ERRORS_TO_SURFACE.",
                "guidedFixPrompt": "Type IFNA_ONLY_SUPPRESSES_MISSING_LOOKUPS_ALLOWING_SYNTAX_ERRORS_TO_SURFACE"
              }
            }
          }
        }
      },
      {
        "id": "ex-d13-b3-trace-precedents-and-dependents",
        "day": 13,
        "blockNumber": 3,
        "title": "Formula Auditing: Trace Precedents (`Ctrl + [`) & Trace Dependents (`Ctrl + ]`)",
        "conceptBudget": {
          "primaryConcept": "Formula Auditing Arrows Invariant",
          "supportingTerms": [
            "Trace Precedents (Draws visual blue arrows pointing to all cells that feed data into the active formula cell)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d13-b2-ifna-vs-iferror-targeted-trapping",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "audit_arrows_demo.js",
            "initialCode": "function getTracePrecedentsShortcut() {\n  return 'CTRL_LEFT_BRACKET_TRACES_PRECEDENTS_AND_CTRL_RIGHT_BRACKET_TRACES_DEPENDENTS';\n}\n\nconsole.log(getTracePrecedentsShortcut());",
            "expectedOutput": "CTRL_LEFT_BRACKET_TRACES_PRECEDENTS_AND_CTRL_RIGHT_BRACKET_TRACES_DEPENDENTS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What keyboard shortcut traces precedent cells that directly feed into the currently selected formula cell?",
          "expectedStringOutput": "CTRL_LEFT_BRACKET_TRACES_PRECEDENTS_AND_CTRL_RIGHT_BRACKET_TRACES_DEPENDENTS",
          "acceptableAnswers": [
            "CTRL_LEFT_BRACKET_TRACES_PRECEDENTS_AND_CTRL_RIGHT_BRACKET_TRACES_DEPENDENTS",
            "Ctrl + [",
            "Ctrl+[",
            "Ctrl + Left Bracket"
          ],
          "primaryMisconceptionId": "MC_EX_ERROR_TRAPPING_IFERROR_IFNA_DEBUG",
          "diagnosisMap": {
            "CTRL+]": {
              "misconceptionId": "MC_EX_ERROR_TRAPPING_IFERROR_IFNA_DEBUG",
              "errorExplanation": "Ctrl+] traces dependents. Precedents uses CTRL_LEFT_BRACKET_TRACES_PRECEDENTS_AND_CTRL_RIGHT_BRACKET_TRACES_DEPENDENTS.",
              "recoveryPath": {
                "simplerExplanation": "Matches CTRL_LEFT_BRACKET_TRACES_PRECEDENTS_AND_CTRL_RIGHT_BRACKET_TRACES_DEPENDENTS.",
                "guidedFixPrompt": "Type CTRL_LEFT_BRACKET_TRACES_PRECEDENTS_AND_CTRL_RIGHT_BRACKET_TRACES_DEPENDENTS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Data Validation & Dropdown Integrity: In-Cell Lists & Input Constraints",
    "overviewMetaphor": "Data Validation Is a Bouncer with a VIP Guest List: If a user tries to type 'Enginering' (misspelled) into the Department column, the Data Validation Stop Alert rejects the entry immediately; restricting inputs to an In-Cell Dropdown List guarantees 100% clean data before it ever enters your formulas.",
    "blocks": [
      {
        "id": "ex-d14-b1-data-validation-gatekeeper",
        "day": 14,
        "blockNumber": 1,
        "title": "Data Validation: In-Cell Dropdowns & Stop Alert Constraints",
        "conceptBudget": {
          "primaryConcept": "Spreadsheet Data Validation & Dropdown Constraint Gatekeeper",
          "supportingTerms": [
            "Allowed Department List (`['Engineering', 'Marketing', 'Finance']`)",
            "Validated Input (`'Engineering'` $\\to$ Valid)",
            "Invalid Input (`'Sales'` $\\to$ Stop Alert)",
            "Status: Data Validation Passed Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d13-b1-iferror-division-by-zero-trapping",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Spreadsheet Data Validation & Entry Guard Ledger",
              "boxes": [
                {
                  "label": "Allowed List Rule",
                  "value": "Department in [Engineering, Marketing, Finance]",
                  "varType": "Rule",
                  "isUpdated": false
                },
                {
                  "label": "Valid Entry: 'Engineering'",
                  "value": "Allowed -> DATA VALIDATION PASSED NOMINAL!",
                  "varType": "Valid",
                  "isUpdated": false
                },
                {
                  "label": "Invalid Entry: 'Sales'",
                  "value": "Blocked by STOP_ALERT (VALIDATION FAILED VALUE NOT IN LIST!)",
                  "varType": "Invalid",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "validation_demo.js",
            "initialCode": "function validateInput(val, allowed) {\n  const ok = allowed.includes(val);\n  return {\n    val,\n    isValid: ok,\n    errorStyle: ok ? 'NONE' : 'STOP_ALERT',\n    status: ok ? 'DATA_VALIDATION_PASSED_NOMINAL' : 'VALIDATION_FAILED_VALUE_NOT_IN_LIST'\n  };\n}\n\nconst depts = ['Engineering', 'Marketing', 'Finance'];\nconsole.log(JSON.stringify(validateInput('Engineering', depts)));\nconsole.log(JSON.stringify(validateInput('Sales', depts)));",
            "expectedOutput": "{\"val\":\"Engineering\",\"isValid\":true,\"errorStyle\":\"NONE\",\"status\":\"DATA_VALIDATION_PASSED_NOMINAL\"}\n{\"val\":\"Sales\",\"isValid\":false,\"errorStyle\":\"STOP_ALERT\",\"status\":\"VALIDATION_FAILED_VALUE_NOT_IN_LIST\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What strict error alert style physically prevents invalid data from being entered into a cell in Microsoft Excel?",
          "expectedStringOutput": "STOP_ALERT",
          "acceptableAnswers": [
            "STOP_ALERT",
            "Stop",
            "Stop Alert",
            "errorStyle\":\"STOP_ALERT\""
          ],
          "primaryMisconceptionId": "MC_EX_DATA_VALIDATION_DROPDOWNS_INPUT_RULES",
          "diagnosisMap": {
            "WARNING": {
              "misconceptionId": "MC_EX_DATA_VALIDATION_DROPDOWNS_INPUT_RULES",
              "errorExplanation": "Warning allows the user to click Continue. Strictly blocking entry uses STOP_ALERT.",
              "recoveryPath": {
                "simplerExplanation": "Type STOP_ALERT.",
                "guidedFixPrompt": "Type STOP_ALERT"
              }
            }
          }
        }
      },
      {
        "id": "ex-d14-b2-custom-formula-validation",
        "day": 14,
        "blockNumber": 2,
        "title": "Custom Formula Validation: `=ISNUMBER(A1)` & `=LEN(A1)=10`",
        "conceptBudget": {
          "primaryConcept": "Custom Formula Validation Invariant",
          "supportingTerms": [
            "Custom Validation Rules (Using formulas like `=AND(ISNUMBER(A1), A1>0)` or `=COUNTIF(A:A, A1)=1` to prevent duplicate employee ID entries)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d14-b1-data-validation-gatekeeper",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Custom Validation Formulas",
            "codeSnippet": "// PREVENT DUPLICATES: =COUNTIF($A:$A, A1)=1 (Blocks entering duplicate IDs!)\n// EXACT 10 DIGIT PHONE: =AND(ISNUMBER(A1), LEN(A1)=10)\n// UPPERCASE ONLY:       =EXACT(A1, UPPER(A1))",
            "lineNotes": {
              "1": "Uniqueness constraint.",
              "2": "Numeric length constraint.",
              "3": "Case constraint."
            }
          },
          {
            "type": "runnable_code",
            "filename": "custom_val_demo.js",
            "initialCode": "function getUniqueValidationFormula() {\n  return '=COUNTIF($A:$A, A1)=1';\n}\n\nconsole.log(getUniqueValidationFormula());",
            "expectedOutput": "=COUNTIF($A:$A, A1)=1",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What custom formula expression in Excel Data Validation guarantees that all entries in column A remain 100% unique without duplicates?",
          "expectedStringOutput": "=COUNTIF($A:$A, A1)=1",
          "acceptableAnswers": [
            "=COUNTIF($A:$A, A1)=1",
            "COUNTIF($A:$A, A1)=1",
            "COUNTIF"
          ],
          "primaryMisconceptionId": "MC_EX_DATA_VALIDATION_DROPDOWNS_INPUT_RULES",
          "diagnosisMap": {
            "=UNIQUE": {
              "misconceptionId": "MC_EX_DATA_VALIDATION_DROPDOWNS_INPUT_RULES",
              "errorExplanation": "UNIQUE is an array formula. Validation uses =COUNTIF($A:$A, A1)=1.",
              "recoveryPath": {
                "simplerExplanation": "Type =COUNTIF($A:$A, A1)=1.",
                "guidedFixPrompt": "Type =COUNTIF($A:$A, A1)=1"
              }
            }
          }
        }
      },
      {
        "id": "ex-d14-b3-input-messages-for-user-guidance",
        "day": 14,
        "blockNumber": 3,
        "title": "Input Prompts: Displaying Guidance Tooltips on Cell Selection",
        "conceptBudget": {
          "primaryConcept": "Input Prompt Tooltip Invariant",
          "supportingTerms": [
            "Input Message (A yellow hover tooltip appearing automatically when a cell is clicked, instructing data entry staff: 'Enter 10-digit tax ID format')"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d14-b2-custom-formula-validation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "input_message_demo.js",
            "initialCode": "function getInputMessageBenefit() {\n  return 'INPUT_MESSAGES_PROVIDE_PROACTIVE_IN_CELL_USER_GUIDANCE_BEFORE_ERRORS_OCCUR';\n}\n\nconsole.log(getInputMessageBenefit());",
            "expectedOutput": "INPUT_MESSAGES_PROVIDE_PROACTIVE_IN_CELL_USER_GUIDANCE_BEFORE_ERRORS_OCCUR",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Data Validation tab configures proactive tooltip guidance messages that appear when a user selects a target cell?",
          "expectedStringOutput": "INPUT_MESSAGES_PROVIDE_PROACTIVE_IN_CELL_USER_GUIDANCE_BEFORE_ERRORS_OCCUR",
          "acceptableAnswers": [
            "INPUT_MESSAGES_PROVIDE_PROACTIVE_IN_CELL_USER_GUIDANCE_BEFORE_ERRORS_OCCUR",
            "Input Message",
            "Input message tab"
          ],
          "primaryMisconceptionId": "MC_EX_DATA_VALIDATION_DROPDOWNS_INPUT_RULES",
          "diagnosisMap": {
            "ALERT": {
              "misconceptionId": "MC_EX_DATA_VALIDATION_DROPDOWNS_INPUT_RULES",
              "errorExplanation": "Error alerts fire after mistakes. Proactive tooltips are INPUT_MESSAGES_PROVIDE_PROACTIVE_IN_CELL_USER_GUIDANCE_BEFORE_ERRORS_OCCUR.",
              "recoveryPath": {
                "simplerExplanation": "Matches INPUT_MESSAGES_PROVIDE_PROACTIVE_IN_CELL_USER_GUIDANCE_BEFORE_ERRORS_OCCUR.",
                "guidedFixPrompt": "Type INPUT_MESSAGES_PROVIDE_PROACTIVE_IN_CELL_USER_GUIDANCE_BEFORE_ERRORS_OCCUR"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Multi-Condition Aggregations, XLOOKUP, Dynamic Arrays & Error Trapping Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete intermediate spreadsheet analytics engine: 1. `SUMIFS` multi-condition filtering ($4,000.00$); 2. `INDEX-MATCH` 2D matrix lookups ($280$); 3. `XLOOKUP` universal fallback resolution; 4. Dynamic array `FILTER` unique spilling; 5. `IFERROR` fault tolerance; 6. Data validation gatekeeping.",
    "blocks": [
      {
        "id": "ex-d15-b1-spreadsheet-analytics-master-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Spreadsheet Analytics Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Spreadsheet Analytics Master Engine",
          "supportingTerms": [
            "SUMIFS Engine",
            "INDEX-MATCH Engine",
            "XLOOKUP Engine",
            "Dynamic Array Engine",
            "Error Trapping Engine",
            "Data Validation Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d14-b3-input-messages-for-user-guidance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 Spreadsheet Analytics Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Aggregates multi-criteria SUMIFS ($4,000.00) & executes INDEX-MATCH (280)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Performs XLOOKUP with fallbacks & spills dynamic FILTER arrays",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Traps #DIV/0! errors with IFERROR & enforces Data Validation stop alerts",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Activates Spreadsheet Analytics Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "analytics_kernel_demo.js",
            "initialCode": "function runAnalyticsMaster() {\n  return {\n    sumifsSubsystem: 'ONLINE_4000_SUM_ACTIVE',\n    indexMatchSubsystem: 'ONLINE_280_MATCH_ACTIVE',\n    xlookupSubsystem: 'ONLINE_FALLBACK_ACTIVE',\n    dynArraySubsystem: 'ONLINE_SPILL_ACTIVE',\n    iferrorSubsystem: 'ONLINE_DIV0_TRAPPED_ACTIVE',\n    valSubsystem: 'ONLINE_STOP_ALERT_ACTIVE',\n    engineStatus: 'SPREADSHEET_ANALYTICS_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runAnalyticsMaster().engineStatus);",
            "expectedOutput": "SPREADSHEET_ANALYTICS_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Spreadsheet Analytics Master Engine?",
          "expectedStringOutput": "SPREADSHEET_ANALYTICS_MASTER_ACTIVE",
          "acceptableAnswers": [
            "SPREADSHEET_ANALYTICS_MASTER_ACTIVE",
            "engineStatus: SPREADSHEET_ANALYTICS_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_EX_CONDITIONAL_AGGREGATIONS_SUMIFS_COUNTIFS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_EX_CONDITIONAL_AGGREGATIONS_SUMIFS_COUNTIFS",
              "errorExplanation": "Matches SPREADSHEET_ANALYTICS_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type SPREADSHEET_ANALYTICS_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "ex-d15-b2-spreadsheet-analytics-engine-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Spreadsheet Analytics Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Spreadsheet Analytics Invariant Verification",
          "supportingTerms": [
            "SUMIFS Invariant",
            "XLOOKUP Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d15-b1-spreadsheet-analytics-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "analytics_audit_demo.js",
            "initialCode": "function auditAnalytics(s, i, x, d, ife, v) {\n  const passed = s && i && x && d && ife && v;\n  return {\n    sumifsVerified: s,\n    indexMatchVerified: i,\n    xlookupVerified: x,\n    dynArrayVerified: d,\n    iferrorVerified: ife,\n    validationVerified: v,\n    grade: passed ? 'SPREADSHEET_ANALYTICS_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditAnalytics(true, true, true, true, true, true)));",
            "expectedOutput": "{\"sumifsVerified\":true,\"indexMatchVerified\":true,\"xlookupVerified\":true,\"dynArrayVerified\":true,\"iferrorVerified\":true,\"validationVerified\":true,\"grade\":\"SPREADSHEET_ANALYTICS_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when SUMIFS, INDEX-MATCH, XLOOKUP, Dynamic Arrays, IFERROR, and Data Validation pass 100%?",
          "expectedStringOutput": "SPREADSHEET_ANALYTICS_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "SPREADSHEET_ANALYTICS_ENGINE_AUDIT_PASSED",
            "grade\":\"SPREADSHEET_ANALYTICS_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_EX_CONDITIONAL_AGGREGATIONS_SUMIFS_COUNTIFS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_EX_CONDITIONAL_AGGREGATIONS_SUMIFS_COUNTIFS",
              "errorExplanation": "All checks passing awards SPREADSHEET_ANALYTICS_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards SPREADSHEET_ANALYTICS_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type SPREADSHEET_ANALYTICS_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "ex-d15-b3-milestone2-ex-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Spreadsheet Analytics Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Spreadsheet Analytics Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d15-b2-spreadsheet-analytics-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_ex_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Multi-Condition Aggregations, XLOOKUP, Dynamic Arrays & Error Trapping Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Multi-Condition Aggregations, XLOOKUP, Dynamic Arrays & Error Trapping Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Multi-Condition Aggregations, XLOOKUP, Dynamic Arrays & Error Trapping Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Multi-Condition Aggregations, XLOOKUP, Dynamic Arrays & Error Trapping Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_EX_CONDITIONAL_AGGREGATIONS_SUMIFS_COUNTIFS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_EX_CONDITIONAL_AGGREGATIONS_SUMIFS_COUNTIFS",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Multi-Condition Aggregations, XLOOKUP, Dynamic Arrays & Error Trapping Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Conditional Formatting & Visual Highlighting: Data Bars, Color Scales & Custom Rules",
    "overviewMetaphor": "Conditional Formatting Is a Thermal Heatmap Camera for Your Grid: Instead of reading 10,000 numbers manually, high-performing sales ($>90$) glow vibrant Green (`GREEN_HIGHLIGHT`), moderate numbers glow Yellow (`YELLOW_WARNING`), and critical deficits ($<70$) glow Red (`RED_CRITICAL`), instantly directing executive attention to problem areas.",
    "blocks": [
      {
        "id": "ex-d16-b1-conditional-formatting-formula-evaluator",
        "day": 16,
        "blockNumber": 1,
        "title": "Conditional Formatting: Visual Heatmaps (`GREEN_HIGHLIGHT`, `YELLOW`, `RED`)",
        "conceptBudget": {
          "primaryConcept": "Conditional Formatting Visual Hierarchy",
          "supportingTerms": [
            "High Performance Threshold ($90$)",
            "Low Performance Threshold ($70$)",
            "Visual Class (`'GREEN_HIGHLIGHT'` $\\to 95$)",
            "Status: Format High Performance"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d15-b1-spreadsheet-analytics-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Conditional Formatting Thermal Rule Ledger",
              "boxes": [
                {
                  "label": "High Threshold Rule",
                  "value": "Score >= 90 -> GREEN_HIGHLIGHT (Top Performer)",
                  "varType": "High Rule",
                  "isUpdated": false
                },
                {
                  "label": "Moderate Threshold Rule",
                  "value": "Score >= 70 -> YELLOW_WARNING (Acceptable)",
                  "varType": "Med Rule",
                  "isUpdated": false
                },
                {
                  "label": "Critical Low Rule",
                  "value": "Score < 70 -> RED_CRITICAL (FORMAT HIGH PERFORMANCE NOMINAL!)",
                  "varType": "Low Rule",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cond_format_demo.js",
            "initialCode": "function assignFormat(val, high, low) {\n  if (val >= high) return { val, format: 'GREEN_HIGHLIGHT', status: 'FORMAT_HIGH_PERFORMANCE' };\n  if (val >= low) return { val, format: 'YELLOW_WARNING', status: 'FORMAT_MODERATE_PERFORMANCE' };\n  return { val, format: 'RED_CRITICAL', status: 'FORMAT_CRITICAL_PERFORMANCE' };\n}\n\nconsole.log(JSON.stringify(assignFormat(95, 90, 70)));\nconsole.log(JSON.stringify(assignFormat(75, 90, 70)));",
            "expectedOutput": "{\"val\":95,\"format\":\"GREEN_HIGHLIGHT\",\"status\":\"FORMAT_HIGH_PERFORMANCE\"}\n{\"val\":75,\"format\":\"YELLOW_WARNING\",\"status\":\"FORMAT_MODERATE_PERFORMANCE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What visual formatting class is assigned to a score of 95 when the high threshold is 90?",
          "expectedStringOutput": "GREEN_HIGHLIGHT",
          "acceptableAnswers": [
            "GREEN_HIGHLIGHT",
            "Green highlight",
            "format\":\"GREEN_HIGHLIGHT\""
          ],
          "primaryMisconceptionId": "MC_EX_CONDITIONAL_FORMATTING_CUSTOM_FORMULAS",
          "diagnosisMap": {
            "YELLOW_WARNING": {
              "misconceptionId": "MC_EX_CONDITIONAL_FORMATTING_CUSTOM_FORMULAS",
              "errorExplanation": "95 exceeds the 90 high threshold, awarding GREEN_HIGHLIGHT.",
              "recoveryPath": {
                "simplerExplanation": "Awards GREEN_HIGHLIGHT.",
                "guidedFixPrompt": "Type GREEN_HIGHLIGHT"
              }
            }
          }
        }
      },
      {
        "id": "ex-d16-b2-custom-formula-row-highlighting",
        "day": 16,
        "blockNumber": 2,
        "title": "Entire Row Highlighting: The Mixed Reference Dollar Sign Rule (`=$C2>1000`)",
        "conceptBudget": {
          "primaryConcept": "Row Highlighting Formula Invariant",
          "supportingTerms": [
            "Row Highlighting Formula (`=$C2>1000`: Anchoring column C with `$` forces every cell in row 2 to evaluate cell C2, highlighting the ENTIRE row instead of just one cell)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d16-b1-conditional-formatting-formula-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Row Highlighting Formula Anchor",
            "codeSnippet": "// ❌ FLAWED: =C2>1000  (Only highlights individual cells because column drifts to D, E, F!)\n// ✅ SOUND:  =$C2>1000 (Locks column C with $, highlighting the ENTIRE row across all columns!)",
            "lineNotes": {
              "1": "Unanchored formula fails to color the whole row.",
              "2": "Dollar anchor on column C successfully colors all columns in the row."
            }
          },
          {
            "type": "runnable_code",
            "filename": "row_highlight_demo.js",
            "initialCode": "function getRowHighlightingAnchorRule() {\n  return 'DOLLAR_SIGN_ON_COLUMN_LETTER_LOCKS_EVALUATION_TO_HIGHLIGHT_ENTIRE_ROWS';\n}\n\nconsole.log(getRowHighlightingAnchorRule());",
            "expectedOutput": "DOLLAR_SIGN_ON_COLUMN_LETTER_LOCKS_EVALUATION_TO_HIGHLIGHT_ENTIRE_ROWS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where must the dollar sign `$` be placed in a custom conditional formatting rule (e.g. `=$C2>1000`) to highlight entire rows?",
          "expectedStringOutput": "DOLLAR_SIGN_ON_COLUMN_LETTER_LOCKS_EVALUATION_TO_HIGHLIGHT_ENTIRE_ROWS",
          "acceptableAnswers": [
            "DOLLAR_SIGN_ON_COLUMN_LETTER_LOCKS_EVALUATION_TO_HIGHLIGHT_ENTIRE_ROWS",
            "Before column letter",
            "On column letter"
          ],
          "primaryMisconceptionId": "MC_EX_CONDITIONAL_FORMATTING_CUSTOM_FORMULAS",
          "diagnosisMap": {
            "ROW": {
              "misconceptionId": "MC_EX_CONDITIONAL_FORMATTING_CUSTOM_FORMULAS",
              "errorExplanation": "Placing $ on row locks evaluation to row 2. Highlighting entire rows requires DOLLAR_SIGN_ON_COLUMN_LETTER_LOCKS_EVALUATION_TO_HIGHLIGHT_ENTIRE_ROWS.",
              "recoveryPath": {
                "simplerExplanation": "Matches DOLLAR_SIGN_ON_COLUMN_LETTER_LOCKS_EVALUATION_TO_HIGHLIGHT_ENTIRE_ROWS.",
                "guidedFixPrompt": "Type DOLLAR_SIGN_ON_COLUMN_LETTER_LOCKS_EVALUATION_TO_HIGHLIGHT_ENTIRE_ROWS"
              }
            }
          }
        }
      },
      {
        "id": "ex-d16-b3-data-bars-and-icon-sets",
        "day": 16,
        "blockNumber": 3,
        "title": "In-Cell Data Bars & Traffic Light Icon Sets",
        "conceptBudget": {
          "primaryConcept": "In-Cell Visual Formatting Invariant",
          "supportingTerms": [
            "Data Bars (Horizontal mini-progress bars embedded directly inside numeric cells)",
            "Icon Sets (3-arrow direction indicators or 3-traffic lights)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d16-b2-custom-formula-row-highlighting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "data_bars_demo.js",
            "initialCode": "function getDataBarsBenefit() {\n  return 'DATA_BARS_RENDER_PROPORTIONAL_HORIZONTAL_BARS_DIRECTLY_INSIDE_CELLS';\n}\n\nconsole.log(getDataBarsBenefit());",
            "expectedOutput": "DATA_BARS_RENDER_PROPORTIONAL_HORIZONTAL_BARS_DIRECTLY_INSIDE_CELLS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What conditional formatting feature renders proportional horizontal visual bars directly inside numeric cells without creating a separate chart?",
          "expectedStringOutput": "DATA_BARS_RENDER_PROPORTIONAL_HORIZONTAL_BARS_DIRECTLY_INSIDE_CELLS",
          "acceptableAnswers": [
            "DATA_BARS_RENDER_PROPORTIONAL_HORIZONTAL_BARS_DIRECTLY_INSIDE_CELLS",
            "Data Bars",
            "data bars"
          ],
          "primaryMisconceptionId": "MC_EX_CONDITIONAL_FORMATTING_CUSTOM_FORMULAS",
          "diagnosisMap": {
            "SPARKLINES": {
              "misconceptionId": "MC_EX_CONDITIONAL_FORMATTING_CUSTOM_FORMULAS",
              "errorExplanation": "Sparklines are mini charts. In-cell conditional formatting is DATA_BARS_RENDER_PROPORTIONAL_HORIZONTAL_BARS_DIRECTLY_INSIDE_CELLS.",
              "recoveryPath": {
                "simplerExplanation": "Matches DATA_BARS_RENDER_PROPORTIONAL_HORIZONTAL_BARS_DIRECTLY_INSIDE_CELLS.",
                "guidedFixPrompt": "Type DATA_BARS_RENDER_PROPORTIONAL_HORIZONTAL_BARS_DIRECTLY_INSIDE_CELLS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Excel Tables (`Ctrl + T`) & Structured Referencing: `Table1[@Sales]` Syntax",
    "overviewMetaphor": "An Excel Table (`Ctrl + T`) Is an SQL Database Table Inside Your Spreadsheet: Instead of writing obscure cell math (`=C2 * D2`), you write readable English formulas (`=[@Price] * [@Qty]`); new rows automatically inherit all formulas and formatting, and column calculations auto-fill instantly to the bottom.",
    "blocks": [
      {
        "id": "ex-d17-b1-structured-referencing-calculator",
        "day": 17,
        "blockNumber": 1,
        "title": "Structured Tables: `=[@Price] * [@Qty]` $\\to$ Grand Total Sum ($205.00$)",
        "conceptBudget": {
          "primaryConcept": "Excel Table Structured Reference Calculation Engine",
          "supportingTerms": [
            "Item 1: Price $10.50$, Qty $10$ ($105.00$)",
            "Item 2: Price $20.00$, Qty $5$ ($100.00$)",
            "Grand Total Revenue ($205.00$)",
            "Status: Table Structured Reference Computed Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d16-b1-conditional-formatting-formula-evaluator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Structured Table Field Calculation Ledger",
              "boxes": [
                {
                  "label": "Structured Formula",
                  "value": "=[@Price] * [@Qty] (Self-Documenting Column Calculation)",
                  "varType": "Formula",
                  "isUpdated": false
                },
                {
                  "label": "Row 1: Item 1",
                  "value": "10.50 * 10 = $105.00",
                  "varType": "Row 1",
                  "isUpdated": false
                },
                {
                  "label": "Calculated Grand Total",
                  "value": "$205.00 Grand Total Sum (TABLE STRUCTURED REFERENCE COMPUTED NOMINAL!)",
                  "varType": "Total",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "structured_table_demo.js",
            "initialCode": "function computeTable(rows) {\n  const calc = rows.map(r => ({ ...r, total: Number((r.price * r.qty).toFixed(2)) }));\n  const grand = calc.reduce((acc, r) => acc + r.total, 0);\n  return {\n    rowCount: rows.length,\n    rows: calc,\n    grandTotal: Number(grand.toFixed(2)),\n    status: 'TABLE_STRUCTURED_REFERENCE_COMPUTED_NOMINAL'\n  };\n}\n\nconst items = [{ id: 1, price: 10.5, qty: 10 }, { id: 2, price: 20.0, qty: 5 }];\nconsole.log(JSON.stringify(computeTable(items)));",
            "expectedOutput": "{\"rowCount\":2,\"rows\":[{\"id\":1,\"price\":10.5,\"qty\":10,\"total\":105},{\"id\":2,\"price\":20,\"qty\":5,\"total\":100}],\"grandTotal\":205,\"status\":\"TABLE_STRUCTURED_REFERENCE_COMPUTED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the calculated grand total revenue of the two table items ($10.50 \\times 10$ and $20.00 \\times 5$)?",
          "expectedStringOutput": "205",
          "acceptableAnswers": [
            "205",
            "205.0",
            "205.00",
            "grandTotal\":205"
          ],
          "primaryMisconceptionId": "MC_EX_EXCEL_TABLES_STRUCTURED_REFERENCING",
          "diagnosisMap": {
            "105": {
              "misconceptionId": "MC_EX_EXCEL_TABLES_STRUCTURED_REFERENCING",
              "errorExplanation": "105 is only row 1. Total table revenue is 105 + 100 = 205.0.",
              "recoveryPath": {
                "simplerExplanation": "Grand total is 205.",
                "guidedFixPrompt": "Type 205"
              }
            }
          }
        }
      },
      {
        "id": "ex-d17-b2-ctrl-t-table-shortcut",
        "day": 17,
        "blockNumber": 2,
        "title": "The `Ctrl + T` Table Creation Shortcut & Dynamic Range Expansion",
        "conceptBudget": {
          "primaryConcept": "Ctrl+T Table Invariant",
          "supportingTerms": [
            "`Ctrl + T` (Instantly transforms a standard raw grid range into an official Excel Table object with auto-expanding formulas, sorting dropdowns, and dynamic range names)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d17-b1-structured-referencing-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Structured Reference Syntax Elements",
            "codeSnippet": "// =Table1[@Sales]       -> Value in the Sales column on the SAME row\n// =Table1[Sales]        -> Entire column vector range\n// =Table1[[#Totals],[Sales]] -> The total row cell for Sales",
            "lineNotes": {
              "1": "@ represents current row.",
              "2": "Full column without @.",
              "3": "Special table parts using #Totals."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ctrl_t_demo.js",
            "initialCode": "function getTableCreationShortcut() {\n  return 'CTRL_T_CONVERTS_RAW_CELL_RANGES_INTO_OFFICIAL_EXCEL_TABLES';\n}\n\nconsole.log(getTableCreationShortcut());",
            "expectedOutput": "CTRL_T_CONVERTS_RAW_CELL_RANGES_INTO_OFFICIAL_EXCEL_TABLES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What keyboard shortcut instantly converts a raw data range into an official Excel Table in Windows Excel?",
          "expectedStringOutput": "CTRL_T_CONVERTS_RAW_CELL_RANGES_INTO_OFFICIAL_EXCEL_TABLES",
          "acceptableAnswers": [
            "CTRL_T_CONVERTS_RAW_CELL_RANGES_INTO_OFFICIAL_EXCEL_TABLES",
            "Ctrl + T",
            "Ctrl+T"
          ],
          "primaryMisconceptionId": "MC_EX_EXCEL_TABLES_STRUCTURED_REFERENCING",
          "diagnosisMap": {
            "CTRL+L": {
              "misconceptionId": "MC_EX_EXCEL_TABLES_STRUCTURED_REFERENCING",
              "errorExplanation": "Ctrl+L also works, but universal standard is CTRL_T_CONVERTS_RAW_CELL_RANGES_INTO_OFFICIAL_EXCEL_TABLES.",
              "recoveryPath": {
                "simplerExplanation": "Matches CTRL_T_CONVERTS_RAW_CELL_RANGES_INTO_OFFICIAL_EXCEL_TABLES.",
                "guidedFixPrompt": "Type CTRL_T_CONVERTS_RAW_CELL_RANGES_INTO_OFFICIAL_EXCEL_TABLES"
              }
            }
          }
        }
      },
      {
        "id": "ex-d17-b3-at-symbol-current-row-operator",
        "day": 17,
        "blockNumber": 3,
        "title": "The Current Row `@` Operator in Structured References",
        "conceptBudget": {
          "primaryConcept": "At-Symbol Current Row Invariant",
          "supportingTerms": [
            "The `@` Symbol (Tells the calculation engine to evaluate the field on the current active record row rather than the whole column)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d17-b2-ctrl-t-table-shortcut",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "at_symbol_demo.js",
            "initialCode": "function getAtSymbolRole() {\n  return '@_OPERATOR_REFERENCES_THE_FIELD_ON_THE_CURRENT_ACTIVE_ROW';\n}\n\nconsole.log(getAtSymbolRole());",
            "expectedOutput": "@_OPERATOR_REFERENCES_THE_FIELD_ON_THE_CURRENT_ACTIVE_ROW",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What symbol in structured table formulas (e.g. `Table1[@Price]`) designates that the formula evaluates the value on the current row?",
          "expectedStringOutput": "@_OPERATOR_REFERENCES_THE_FIELD_ON_THE_CURRENT_ACTIVE_ROW",
          "acceptableAnswers": [
            "@_OPERATOR_REFERENCES_THE_FIELD_ON_THE_CURRENT_ACTIVE_ROW",
            "@",
            "@ symbol",
            "At symbol"
          ],
          "primaryMisconceptionId": "MC_EX_EXCEL_TABLES_STRUCTURED_REFERENCING",
          "diagnosisMap": {
            "#": {
              "misconceptionId": "MC_EX_EXCEL_TABLES_STRUCTURED_REFERENCING",
              "errorExplanation": "# is the spill operator. Current row in tables is @_OPERATOR_REFERENCES_THE_FIELD_ON_THE_CURRENT_ACTIVE_ROW.",
              "recoveryPath": {
                "simplerExplanation": "Type @.",
                "guidedFixPrompt": "Type @_OPERATOR_REFERENCES_THE_FIELD_ON_THE_CURRENT_ACTIVE_ROW"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Pivot Tables I: Field List Architecture (Rows, Columns, Values & Filters)",
    "overviewMetaphor": "A Pivot Table Is a Rubik's Cube for Enterprise Data: Instead of writing complex nested formulas, you grab dimensions (Region, Quarter, Product) and twist the cube to view sales grouped by Region on Rows ($EAST = \\$250.00, WEST = \\$200.00$), slicing and aggregating raw databases in seconds.",
    "blocks": [
      {
        "id": "ex-d18-b1-pivot-table-summary-generator",
        "day": 18,
        "blockNumber": 1,
        "title": "Pivot Table Aggregation: Grouping Sales by Region (`EAST: $250.00, WEST: $200.00`)",
        "conceptBudget": {
          "primaryConcept": "Pivot Table Row Grouping & Aggregation Engine",
          "supportingTerms": [
            "Row Dimension (`'region'`)",
            "Value Metric (`'amount'`)",
            "EAST Region Sum ($250.00$)",
            "WEST Region Sum ($200.00$)",
            "Status: Pivot Table Summary Generated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d17-b1-structured-referencing-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Pivot Table 4-Quadrant Architecture Ledger",
              "boxes": [
                {
                  "label": "Filters Quadrant",
                  "value": "Global Page Filters (e.g. Year = 2026)",
                  "varType": "Filter",
                  "isUpdated": false
                },
                {
                  "label": "Rows Quadrant",
                  "value": "Region Field -> Unique Rows [EAST, WEST]",
                  "varType": "Rows",
                  "isUpdated": false
                },
                {
                  "label": "Values Quadrant",
                  "value": "SUM(Amount) -> EAST: $250.00, WEST: $200.00 (PIVOT SUMMARY GENERATED NOMINAL!)",
                  "varType": "Values",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pivot_summary_demo.js",
            "initialCode": "function generatePivot(records) {\n  const res = {};\n  records.forEach(r => {\n    res[r.region] = (res[r.region] || 0) + r.amount;\n  });\n  return {\n    pivotData: res,\n    status: 'PIVOT_TABLE_SUMMARY_GENERATED_NOMINAL'\n  };\n}\n\nconst sales = [{ region: 'EAST', amount: 100 }, { region: 'WEST', amount: 200 }, { region: 'EAST', amount: 150 }];\nconsole.log(JSON.stringify(generatePivot(sales)));",
            "expectedOutput": "{\"pivotData\":{\"EAST\":250,\"WEST\":200},\"status\":\"PIVOT_TABLE_SUMMARY_GENERATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the aggregated Pivot Table sum for the 'EAST' region given transactions of $100 and $150?",
          "expectedStringOutput": "250",
          "acceptableAnswers": [
            "250",
            "250.0",
            "EAST\":250",
            "EAST: 250"
          ],
          "primaryMisconceptionId": "MC_EX_PIVOT_TABLES_FIELD_LIST_SUMMARIES",
          "diagnosisMap": {
            "450": {
              "misconceptionId": "MC_EX_PIVOT_TABLES_FIELD_LIST_SUMMARIES",
              "errorExplanation": "450 is grand total. EAST is 100 + 150 = 250.",
              "recoveryPath": {
                "simplerExplanation": "EAST sum is 250.",
                "guidedFixPrompt": "Type 250"
              }
            }
          }
        }
      },
      {
        "id": "ex-d18-b2-pivot-quadrants-four-areas",
        "day": 18,
        "blockNumber": 2,
        "title": "The 4 Core Quadrants: Filters, Columns, Rows, and Values",
        "conceptBudget": {
          "primaryConcept": "Pivot 4 Quadrants Invariant",
          "supportingTerms": [
            "4 Quadrants (Filters = global page slicer; Columns = horizontal headers; Rows = vertical categories; Values = mathematical aggregation metrics)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d18-b1-pivot-table-summary-generator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Pivot Field List Layout",
            "codeSnippet": "// [ FILTERS ]  -> Year, ActiveStatus\n// [ COLUMNS ]  -> Quarter (Q1, Q2, Q3, Q4)\n// [ ROWS ]     -> Product Line (Laptops, Phones)\n// [ VALUES ]   -> Sum of Revenue, Count of Orders",
            "lineNotes": {
              "1": "Top filter area.",
              "2": "Horizontal column dimension.",
              "3": "Vertical row dimension.",
              "4": "Mathematical summary metric."
            }
          },
          {
            "type": "runnable_code",
            "filename": "quadrants_demo.js",
            "initialCode": "function getPivotQuadrantsTotal() {\n  return 4;\n}\n\nconsole.log(getPivotQuadrantsTotal());",
            "expectedOutput": "4",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many core layout quadrants make up the Microsoft Excel Pivot Table Field List window?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "4 quadrants",
            "four"
          ],
          "primaryMisconceptionId": "MC_EX_PIVOT_TABLES_FIELD_LIST_SUMMARIES",
          "diagnosisMap": {
            "3": {
              "misconceptionId": "MC_EX_PIVOT_TABLES_FIELD_LIST_SUMMARIES",
              "errorExplanation": "There are 4 quadrants: Filters, Columns, Rows, and Values.",
              "recoveryPath": {
                "simplerExplanation": "Type 4.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "ex-d18-b3-pivot-cache-and-refresh-mechanics",
        "day": 18,
        "blockNumber": 3,
        "title": "The Pivot Cache: Why Pivot Tables Do Not Auto-Refresh by Default",
        "conceptBudget": {
          "primaryConcept": "Pivot Cache Refresh Invariant",
          "supportingTerms": [
            "Pivot Cache (`Alt + F5` Refresh: Pivot tables store a snapshot in a memory cache; modifying underlying cells requires clicking Refresh to update calculations)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d18-b2-pivot-quadrants-four-areas",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "pivot_cache_demo.js",
            "initialCode": "function getPivotRefreshShortcut() {\n  return 'ALT_F5_REFRESHES_THE_ACTIVE_PIVOT_TABLE_CACHE';\n}\n\nconsole.log(getPivotRefreshShortcut());",
            "expectedOutput": "ALT_F5_REFRESHES_THE_ACTIVE_PIVOT_TABLE_CACHE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What keyboard shortcut refreshes the active Pivot Table cache after underlying source data has been modified?",
          "expectedStringOutput": "ALT_F5_REFRESHES_THE_ACTIVE_PIVOT_TABLE_CACHE",
          "acceptableAnswers": [
            "ALT_F5_REFRESHES_THE_ACTIVE_PIVOT_TABLE_CACHE",
            "Alt + F5",
            "Alt+F5"
          ],
          "primaryMisconceptionId": "MC_EX_PIVOT_TABLES_FIELD_LIST_SUMMARIES",
          "diagnosisMap": {
            "F5": {
              "misconceptionId": "MC_EX_PIVOT_TABLES_FIELD_LIST_SUMMARIES",
              "errorExplanation": "F5 opens the Go To dialog. Refreshing pivot cache uses ALT_F5_REFRESHES_THE_ACTIVE_PIVOT_TABLE_CACHE.",
              "recoveryPath": {
                "simplerExplanation": "Matches ALT_F5_REFRESHES_THE_ACTIVE_PIVOT_TABLE_CACHE.",
                "guidedFixPrompt": "Type ALT_F5_REFRESHES_THE_ACTIVE_PIVOT_TABLE_CACHE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Pivot Tables II: Grouping Dates, Value Field Settings & Calculated Fields",
    "overviewMetaphor": "Value Field Settings Are a Chameleonic Lens on Your Financial Data: With one click, your Pivot Table transforms from showing raw dollar sums ($Laptops = \\$6,000, Phones = \\$4,000$) into percentage market share ($Laptops = 60.0\\%, Phones = 40.0\\%$ of Grand Total), revealing relative market power instantly.",
    "blocks": [
      {
        "id": "ex-d19-b1-pivot-percentage-of-total-calculator",
        "day": 19,
        "blockNumber": 1,
        "title": "Value Field Settings: `% of Grand Total` ($Laptops = 60.0\\%, Phones = 40.0\\%$)",
        "conceptBudget": {
          "primaryConcept": "Pivot Table Percentage of Grand Total Engine",
          "supportingTerms": [
            "Laptops Sum ($6,000$)",
            "Phones Sum ($4,000$)",
            "Grand Total ($10,000$)",
            "Laptops Share ($60.0\\%$)",
            "Phones Share ($40.0\\%$)",
            "Status: Pivot Percentage of Total Computed Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d18-b1-pivot-table-summary-generator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Value Field Settings & Grand Total Share Ledger",
              "boxes": [
                {
                  "label": "Raw Aggregate Totals",
                  "value": "Laptops: $6,000.00 | Phones: $4,000.00 (Grand Total: $10,000.00)",
                  "varType": "Raw Totals",
                  "isUpdated": false
                },
                {
                  "label": "Value Field Setting",
                  "value": "Show Values As: '% of Grand Total' (Share = Value / 10,000 * 100)",
                  "varType": "Setting",
                  "isUpdated": false
                },
                {
                  "label": "Calculated Shares",
                  "value": "Laptops: 60.0% | Phones: 40.0% (PIVOT PERCENTAGE COMPUTED NOMINAL!)",
                  "varType": "Shares",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pivot_pct_demo.js",
            "initialCode": "function computePivotPct(totals) {\n  const grand = Object.values(totals).reduce((acc, v) => acc + v, 0);\n  const shares = {};\n  for (const [k, v] of Object.entries(totals)) shares[k] = Number(((v / grand) * 100).toFixed(1));\n  return {\n    grandTotal: grand,\n    shares,\n    status: 'PIVOT_PERCENTAGE_OF_TOTAL_COMPUTED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(computePivotPct({ Laptops: 6000, Phones: 4000 })));",
            "expectedOutput": "{\"grandTotal\":10000,\"shares\":{\"Laptops\":60,\"Phones\":40},\"status\":\"PIVOT_PERCENTAGE_OF_TOTAL_COMPUTED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What percentage share of grand total is calculated for 'Laptops' ($6,000 out of $10,000 total)?",
          "expectedStringOutput": "60",
          "acceptableAnswers": [
            "60",
            "60%",
            "60.0",
            "Laptops\":60"
          ],
          "primaryMisconceptionId": "MC_EX_PIVOT_TABLES_GROUPINGS_CALCULATED_FIELDS",
          "diagnosisMap": {
            "40": {
              "misconceptionId": "MC_EX_PIVOT_TABLES_GROUPINGS_CALCULATED_FIELDS",
              "errorExplanation": "40% is Phones. Laptops is 6,000 / 10,000 = 60%.",
              "recoveryPath": {
                "simplerExplanation": "Laptops share is 60%.",
                "guidedFixPrompt": "Type 60"
              }
            }
          }
        }
      },
      {
        "id": "ex-d19-b2-grouping-dates-by-year-and-quarter",
        "day": 19,
        "blockNumber": 2,
        "title": "Automated Date Hierarchies: Grouping Daily Dates into Years & Quarters",
        "conceptBudget": {
          "primaryConcept": "Date Grouping Hierarchy Invariant",
          "supportingTerms": [
            "Pivot Date Grouping (Right-click date $\\to$ Group $\\to$ Select Years, Quarters, Months; creates virtual hierarchy fields automatically without editing raw data)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d19-b1-pivot-percentage-of-total-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Pivot Date Grouping Selection",
            "codeSnippet": "// Right-click date in Pivot Table -> Group...\n// Select: [x] Years  [x] Quarters  [x] Months\n// Excel automatically generates virtual 'Years' and 'Quarters' fields in Field List!",
            "lineNotes": {
              "1": "Context menu command.",
              "2": "Multi-tier time dimension selection.",
              "3": "Virtual hierarchy creation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "date_group_demo.js",
            "initialCode": "function getDateGroupingBenefit() {\n  return 'DATE_GROUPING_CREATES_VIRTUAL_YEAR_AND_QUARTER_HIERARCHIES_AUTOMATICALLY';\n}\n\nconsole.log(getDateGroupingBenefit());",
            "expectedOutput": "DATE_GROUPING_CREATES_VIRTUAL_YEAR_AND_QUARTER_HIERARCHIES_AUTOMATICALLY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How does grouping daily dates in a Pivot Table benefit multi-year trend analysis?",
          "expectedStringOutput": "DATE_GROUPING_CREATES_VIRTUAL_YEAR_AND_QUARTER_HIERARCHIES_AUTOMATICALLY",
          "acceptableAnswers": [
            "DATE_GROUPING_CREATES_VIRTUAL_YEAR_AND_QUARTER_HIERARCHIES_AUTOMATICALLY",
            "Creates year and quarter hierarchies",
            "Groups by year and quarter"
          ],
          "primaryMisconceptionId": "MC_EX_PIVOT_TABLES_GROUPINGS_CALCULATED_FIELDS",
          "diagnosisMap": {
            "SLOW": {
              "misconceptionId": "MC_EX_PIVOT_TABLES_GROUPINGS_CALCULATED_FIELDS",
              "errorExplanation": "Grouping enables instant rollups: DATE_GROUPING_CREATES_VIRTUAL_YEAR_AND_QUARTER_HIERARCHIES_AUTOMATICALLY.",
              "recoveryPath": {
                "simplerExplanation": "Matches DATE_GROUPING_CREATES_VIRTUAL_YEAR_AND_QUARTER_HIERARCHIES_AUTOMATICALLY.",
                "guidedFixPrompt": "Type DATE_GROUPING_CREATES_VIRTUAL_YEAR_AND_QUARTER_HIERARCHIES_AUTOMATICALLY"
              }
            }
          }
        }
      },
      {
        "id": "ex-d19-b3-calculated-fields-vs-source-data-columns",
        "day": 19,
        "blockNumber": 3,
        "title": "Calculated Fields: Creating Dynamic Formulas Inside Pivot Tables",
        "conceptBudget": {
          "primaryConcept": "Calculated Field Invariant",
          "supportingTerms": [
            "Calculated Field (`= Revenue - Cost`: Computes margin at the aggregated subtotal level rather than adding redundant columns to raw data)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d19-b2-grouping-dates-by-year-and-quarter",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "calc_field_demo.js",
            "initialCode": "function getCalculatedFieldEvaluationRule() {\n  return 'CALCULATED_FIELDS_EVALUATE_MATHEMATICS_AFTER_SUMMARIZING_VALUES';\n}\n\nconsole.log(getCalculatedFieldEvaluationRule());",
            "expectedOutput": "CALCULATED_FIELDS_EVALUATE_MATHEMATICS_AFTER_SUMMARIZING_VALUES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "When does a Pivot Table Calculated Field perform its mathematical formula evaluation?",
          "expectedStringOutput": "CALCULATED_FIELDS_EVALUATE_MATHEMATICS_AFTER_SUMMARIZING_VALUES",
          "acceptableAnswers": [
            "CALCULATED_FIELDS_EVALUATE_MATHEMATICS_AFTER_SUMMARIZING_VALUES",
            "After summarizing values",
            "At aggregated level"
          ],
          "primaryMisconceptionId": "MC_EX_PIVOT_TABLES_GROUPINGS_CALCULATED_FIELDS",
          "diagnosisMap": {
            "BEFORE": {
              "misconceptionId": "MC_EX_PIVOT_TABLES_GROUPINGS_CALCULATED_FIELDS",
              "errorExplanation": "Calculated fields sum first then calculate: CALCULATED_FIELDS_EVALUATE_MATHEMATICS_AFTER_SUMMARIZING_VALUES.",
              "recoveryPath": {
                "simplerExplanation": "Matches CALCULATED_FIELDS_EVALUATE_MATHEMATICS_AFTER_SUMMARIZING_VALUES.",
                "guidedFixPrompt": "Type CALCULATED_FIELDS_EVALUATE_MATHEMATICS_AFTER_SUMMARIZING_VALUES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Pivot Charts & Interactive Slicers: Multi-Pivot Dashboard Connections",
    "overviewMetaphor": "A Dashboard Slicer Is a Master TV Remote Control: Clicking the 'Q3' button sends an infrared signal that simultaneously updates the Sales Pivot Table, the Regional Bar Chart, and the Product Donut Chart ($\\ge 2$ connected pivots), delivering seamless interactivity for executive presentations.",
    "blocks": [
      {
        "id": "ex-d20-b1-interactive-slicer-connection-auditor",
        "day": 20,
        "blockNumber": 1,
        "title": "Multi-Pivot Slicers: Report Connections ($Count \\ge 2$ Connected Pivots)",
        "conceptBudget": {
          "primaryConcept": "Interactive Slicer Multi-Pivot Connection Auditor",
          "supportingTerms": [
            "Connected Pivot Tables Count ($3$ tables)",
            "Multi-Pivot Interactivity (`true`)",
            "Status: Multi-Pivot Slicer Connected Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d19-b1-pivot-percentage-of-total-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Dashboard Slicer Report Connections Ledger",
              "boxes": [
                {
                  "label": "Interactive Visual Slicer",
                  "value": "Slicer_Region (Buttons: NORTH, SOUTH, EAST, WEST)",
                  "varType": "Slicer",
                  "isUpdated": false
                },
                {
                  "label": "Report Connections",
                  "value": "Checked: PivotTable1 (Revenue) & PivotTable2 (Profit) & PivotTable3 (Volume)",
                  "varType": "Connections",
                  "isUpdated": false
                },
                {
                  "label": "Interactivity Audit",
                  "value": "Count = 3 >= 2 (MULTI-PIVOT SLICER CONNECTED NOMINAL!)",
                  "varType": "Audit",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "slicer_demo.js",
            "initialCode": "function auditSlicer(count) {\n  const ok = count >= 2;\n  return {\n    count,\n    isInteractive: ok,\n    status: ok ? 'MULTI_PIVOT_SLICER_CONNECTED_NOMINAL' : 'ISOLATED_SINGLE_PIVOT'\n  };\n}\n\nconsole.log(JSON.stringify(auditSlicer(3)));\nconsole.log(JSON.stringify(auditSlicer(1)));",
            "expectedOutput": "{\"count\":3,\"isInteractive\":true,\"status\":\"MULTI_PIVOT_SLICER_CONNECTED_NOMINAL\"}\n{\"count\":1,\"isInteractive\":false,\"status\":\"ISOLATED_SINGLE_PIVOT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many Pivot Tables must be linked via Report Connections for a slicer to be certified as a true multi-pivot dashboard filter?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "At least 2",
            "2 or more",
            "count >= 2"
          ],
          "primaryMisconceptionId": "MC_EX_PIVOT_CHARTS_INTERACTIVE_SLICERS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_EX_PIVOT_CHARTS_INTERACTIVE_SLICERS",
              "errorExplanation": "1 is an isolated single table filter. Multi-pivot dashboards require at least 2 connected tables.",
              "recoveryPath": {
                "simplerExplanation": "Requires at least 2 tables.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "ex-d20-b2-slicer-report-connections-menu",
        "day": 20,
        "blockNumber": 2,
        "title": "The Slicer 'Report Connections' Dialog Configuration",
        "conceptBudget": {
          "primaryConcept": "Report Connections Dialog Invariant",
          "supportingTerms": [
            "Report Connections (Right-click slicer $\\to$ Report Connections $\\to$ Check all target Pivot Tables to synchronize filter state across the entire workbook)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d20-b1-interactive-slicer-connection-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Slicer Synchronization Steps",
            "codeSnippet": "// 1. Insert Slicer on PivotTable1\n// 2. Right-click Slicer -> Report Connections...\n// 3. Check [x] PivotTable2 and [x] PivotTable3\n// Now 1 click filters all 3 pivot tables simultaneously!",
            "lineNotes": {
              "1": "Initial slicer insertion.",
              "2": "Accessing synchronization menu.",
              "3": "Linking multi-pivot targets."
            }
          },
          {
            "type": "runnable_code",
            "filename": "report_conn_demo.js",
            "initialCode": "function getReportConnectionsDialogName() {\n  return 'REPORT_CONNECTIONS_SYNCHRONIZES_SLICERS_ACROSS_MULTIPLE_PIVOT_TABLES';\n}\n\nconsole.log(getReportConnectionsDialogName());",
            "expectedOutput": "REPORT_CONNECTIONS_SYNCHRONIZES_SLICERS_ACROSS_MULTIPLE_PIVOT_TABLES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What context menu dialog connects a single slicer to multiple Pivot Tables across an Excel workbook?",
          "expectedStringOutput": "REPORT_CONNECTIONS_SYNCHRONIZES_SLICERS_ACROSS_MULTIPLE_PIVOT_TABLES",
          "acceptableAnswers": [
            "REPORT_CONNECTIONS_SYNCHRONIZES_SLICERS_ACROSS_MULTIPLE_PIVOT_TABLES",
            "Report Connections",
            "report connections"
          ],
          "primaryMisconceptionId": "MC_EX_PIVOT_CHARTS_INTERACTIVE_SLICERS",
          "diagnosisMap": {
            "HYPERLINK": {
              "misconceptionId": "MC_EX_PIVOT_CHARTS_INTERACTIVE_SLICERS",
              "errorExplanation": "Hyperlinks navigate URLs. Slicer linking uses REPORT_CONNECTIONS_SYNCHRONIZES_SLICERS_ACROSS_MULTIPLE_PIVOT_TABLES.",
              "recoveryPath": {
                "simplerExplanation": "Matches REPORT_CONNECTIONS_SYNCHRONIZES_SLICERS_ACROSS_MULTIPLE_PIVOT_TABLES.",
                "guidedFixPrompt": "Type REPORT_CONNECTIONS_SYNCHRONIZES_SLICERS_ACROSS_MULTIPLE_PIVOT_TABLES"
              }
            }
          }
        }
      },
      {
        "id": "ex-d20-b3-timeline-slicers-for-dates",
        "day": 20,
        "blockNumber": 3,
        "title": "Timeline Slicers: Interactive Horizontal Date Sliders",
        "conceptBudget": {
          "primaryConcept": "Timeline Slicer Invariant",
          "supportingTerms": [
            "Timeline Slicer (An interactive visual date slider allowing executives to scrub across Years, Quarters, and Months with draggable handles)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d20-b2-slicer-report-connections-menu",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "timeline_demo.js",
            "initialCode": "function getTimelineSlicerRequirement() {\n  return 'TIMELINE_SLICERS_REQUIRE_UNDERLYING_COLUMNS_TO_BE_FORMATTED_AS_DATES';\n}\n\nconsole.log(getTimelineSlicerRequirement());",
            "expectedOutput": "TIMELINE_SLICERS_REQUIRE_UNDERLYING_COLUMNS_TO_BE_FORMATTED_AS_DATES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What strict data type requirement must a column satisfy to support inserting an interactive Timeline Slicer?",
          "expectedStringOutput": "TIMELINE_SLICERS_REQUIRE_UNDERLYING_COLUMNS_TO_BE_FORMATTED_AS_DATES",
          "acceptableAnswers": [
            "TIMELINE_SLICERS_REQUIRE_UNDERLYING_COLUMNS_TO_BE_FORMATTED_AS_DATES",
            "Date",
            "Dates",
            "Must be dates"
          ],
          "primaryMisconceptionId": "MC_EX_PIVOT_CHARTS_INTERACTIVE_SLICERS",
          "diagnosisMap": {
            "TEXT": {
              "misconceptionId": "MC_EX_PIVOT_CHARTS_INTERACTIVE_SLICERS",
              "errorExplanation": "Text columns cannot generate timelines: TIMELINE_SLICERS_REQUIRE_UNDERLYING_COLUMNS_TO_BE_FORMATTED_AS_DATES.",
              "recoveryPath": {
                "simplerExplanation": "Matches TIMELINE_SLICERS_REQUIRE_UNDERLYING_COLUMNS_TO_BE_FORMATTED_AS_DATES.",
                "guidedFixPrompt": "Type TIMELINE_SLICERS_REQUIRE_UNDERLYING_COLUMNS_TO_BE_FORMATTED_AS_DATES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Conditional Formatting, Structured Tables, Pivot Tables & Slicers Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete reporting and business intelligence master engine: 1. Conditional formatting heatmaps; 2. Excel table structured references ($205.00$); 3. Pivot Table aggregations; 4. 60% grand total share calculations; 5. Multi-pivot interactive slicers.",
    "blocks": [
      {
        "id": "ex-d21-b1-spreadsheet-bi-master-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Spreadsheet Business Intelligence Master Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Spreadsheet Business Intelligence Master Engine",
          "supportingTerms": [
            "Conditional Formatting Engine",
            "Structured Tables Engine",
            "Pivot Tables Engine",
            "Value Field Share Engine",
            "Interactive Slicers Engine"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d20-b3-timeline-slicers-for-dates",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Spreadsheet Business Intelligence Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Applies conditional formatting heatmaps & calculates structured tables ($205.00)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Aggregates Pivot Tables (EAST: $250.00, WEST: $200.00)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Computes 60% grand total share & connects multi-pivot slicers (3 linked tables)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Activates Spreadsheet Business Intelligence Master Engine!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bi_kernel_demo.js",
            "initialCode": "function runBiMaster() {\n  return {\n    formatSubsystem: 'ONLINE_HEATMAP_ACTIVE',\n    tableSubsystem: 'ONLINE_205_STRUCTURED_ACTIVE',\n    pivotSubsystem: 'ONLINE_SUMMARY_ACTIVE',\n    shareSubsystem: 'ONLINE_60PCT_SHARE_ACTIVE',\n    slicerSubsystem: 'ONLINE_3PIVOT_SLICER_ACTIVE',\n    engineStatus: 'SPREADSHEET_BI_MASTER_ACTIVE'\n  };\n}\n\nconsole.log(runBiMaster().engineStatus);",
            "expectedOutput": "SPREADSHEET_BI_MASTER_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Spreadsheet Business Intelligence Master Engine?",
          "expectedStringOutput": "SPREADSHEET_BI_MASTER_ACTIVE",
          "acceptableAnswers": [
            "SPREADSHEET_BI_MASTER_ACTIVE",
            "engineStatus: SPREADSHEET_BI_MASTER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_EX_EXCEL_TABLES_STRUCTURED_REFERENCING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_EX_EXCEL_TABLES_STRUCTURED_REFERENCING",
              "errorExplanation": "Matches SPREADSHEET_BI_MASTER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type SPREADSHEET_BI_MASTER_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "ex-d21-b2-spreadsheet-bi-engine-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Spreadsheet Business Intelligence Engine Invariant Verification & Precision Audit",
        "conceptBudget": {
          "primaryConcept": "Spreadsheet BI Invariant Verification",
          "supportingTerms": [
            "Formatting Invariant",
            "Pivot Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d21-b1-spreadsheet-bi-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bi_audit_demo.js",
            "initialCode": "function auditBi(f, t, p, s, sl) {\n  const passed = f && t && p && s && sl;\n  return {\n    formatVerified: f,\n    tableVerified: t,\n    pivotVerified: p,\n    shareVerified: s,\n    slicerVerified: sl,\n    grade: passed ? 'SPREADSHEET_BI_ENGINE_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditBi(true, true, true, true, true)));",
            "expectedOutput": "{\"formatVerified\":true,\"tableVerified\":true,\"pivotVerified\":true,\"shareVerified\":true,\"slicerVerified\":true,\"grade\":\"SPREADSHEET_BI_ENGINE_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Conditional Formatting, Tables, Pivots, Percentage Shares, and Slicers pass 100%?",
          "expectedStringOutput": "SPREADSHEET_BI_ENGINE_AUDIT_PASSED",
          "acceptableAnswers": [
            "SPREADSHEET_BI_ENGINE_AUDIT_PASSED",
            "grade\":\"SPREADSHEET_BI_ENGINE_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_EX_EXCEL_TABLES_STRUCTURED_REFERENCING",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_EX_EXCEL_TABLES_STRUCTURED_REFERENCING",
              "errorExplanation": "All checks passing awards SPREADSHEET_BI_ENGINE_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards SPREADSHEET_BI_ENGINE_AUDIT_PASSED.",
                "guidedFixPrompt": "Type SPREADSHEET_BI_ENGINE_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "ex-d21-b3-milestone3-ex-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Spreadsheet BI Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Spreadsheet BI Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d21-b2-spreadsheet-bi-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_ex_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete Conditional Formatting, Structured Tables, Pivot Tables & Slicers Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete Conditional Formatting, Structured Tables, Pivot Tables & Slicers Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete Conditional Formatting, Structured Tables, Pivot Tables & Slicers Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete Conditional Formatting, Structured Tables, Pivot Tables & Slicers Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_EX_EXCEL_TABLES_STRUCTURED_REFERENCING",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_EX_EXCEL_TABLES_STRUCTURED_REFERENCING",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete Conditional Formatting, Structured Tables, Pivot Tables & Slicers Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Business Charting & Data Visualization: Chart Type Selection & Secondary Axes",
    "overviewMetaphor": "A Dual-Axis Combo Chart Is a Dual-Scale Thermometer: Plotting Revenue ($10,000,000$) on the same axis as Profit Margin ($18.5\\%$) flattens the percentage into a completely invisible flat line at zero; adding a Secondary Axis on the right side lets the profit margin line soar prominently across the revenue column bars.",
    "blocks": [
      {
        "id": "ex-d22-b1-business-chart-type-matcher",
        "day": 22,
        "blockNumber": 1,
        "title": "Chart Type Selection: Combo Charts with Secondary Axes for Dual-Unit Metrics",
        "conceptBudget": {
          "primaryConcept": "Business Chart Selection & Secondary Axis Matcher",
          "supportingTerms": [
            "Dual-Unit Metric (Revenue in $\\$$ vs Profit Margin in $\\%\\implies$ `'COMBO_CHART_SECONDARY_AXIS'`)",
            "Time Series Trend ($\\implies$ `'LINE_CHART'`)",
            "Status: Dual Axis Chart Matched"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d21-b1-spreadsheet-bi-master-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Business Chart Type Decision Matrix Ledger",
              "boxes": [
                {
                  "label": "Time-Series Trend",
                  "value": "Monthly Sales History -> LINE_CHART",
                  "varType": "Trend",
                  "isUpdated": false
                },
                {
                  "label": "Categorical Comparison",
                  "value": "Sales by Product Line -> COLUMN_OR_BAR_CHART",
                  "varType": "Category",
                  "isUpdated": false
                },
                {
                  "label": "Dual Scale ($ vs %)",
                  "value": "Revenue ($) + Margin (%) -> COMBO_CHART_SECONDARY_AXIS (MATCHED NOMINAL!)",
                  "varType": "Dual Scale",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "chart_match_demo.js",
            "initialCode": "function matchChart(type, diffUnits) {\n  if (diffUnits) return { chart: 'COMBO_CHART_SECONDARY_AXIS', status: 'DUAL_AXIS_CHART_MATCHED' };\n  return { chart: type === 'TIME_SERIES' ? 'LINE_CHART' : 'COLUMN_CHART', status: 'MATCHED' };\n}\n\nconsole.log(JSON.stringify(matchChart('REVENUE_AND_MARGIN', true)));\nconsole.log(JSON.stringify(matchChart('TIME_SERIES', false)));",
            "expectedOutput": "{\"chart\":\"COMBO_CHART_SECONDARY_AXIS\",\"status\":\"DUAL_AXIS_CHART_MATCHED\"}\n{\"chart\":\"LINE_CHART\",\"status\":\"MATCHED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What chart configuration is required when visualizing Dollar Revenue alongside Percentage Profit Margins on the same graph?",
          "expectedStringOutput": "COMBO_CHART_SECONDARY_AXIS",
          "acceptableAnswers": [
            "COMBO_CHART_SECONDARY_AXIS",
            "Combo chart with secondary axis",
            "Combo chart",
            "Secondary axis"
          ],
          "primaryMisconceptionId": "MC_EX_BUSINESS_CHARTING_VISUALIZATION_BEST_PRACTICES",
          "diagnosisMap": {
            "PIE": {
              "misconceptionId": "MC_EX_BUSINESS_CHARTING_VISUALIZATION_BEST_PRACTICES",
              "errorExplanation": "Pie charts cannot show 2 different units. Dual scales use COMBO_CHART_SECONDARY_AXIS.",
              "recoveryPath": {
                "simplerExplanation": "Matches COMBO_CHART_SECONDARY_AXIS.",
                "guidedFixPrompt": "Type COMBO_CHART_SECONDARY_AXIS"
              }
            }
          }
        }
      },
      {
        "id": "ex-d22-b2-waterfall-charts-for-variance",
        "day": 22,
        "blockNumber": 2,
        "title": "Waterfall Charts: Visualizing Bridges from Starting Budget to Final Profit",
        "conceptBudget": {
          "primaryConcept": "Waterfall Chart Invariant",
          "supportingTerms": [
            "Waterfall Chart (A visual financial bridge showing positive revenue additions and negative cost subtractions leading to net ending cash)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d22-b1-business-chart-type-matcher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Waterfall Financial Bridge",
            "codeSnippet": "// Starting Gross Revenue: $1,000,000 (Base Column)\n//   - Cost of Goods Sold: -$400,000   (Floating Red Bar Down)\n//   - Operating Expenses: -$350,000   (Floating Red Bar Down)\n//   + Tax Credits:        +$50,000    (Floating Green Bar Up)\n// = Net Operating Profit: $300,000   (Total Pillar Column)",
            "lineNotes": {
              "1": "Starting base pillar.",
              "2": "Negative variance component.",
              "3": "Negative overhead component.",
              "4": "Positive credit addition.",
              "5": "Ending net total pillar."
            }
          },
          {
            "type": "runnable_code",
            "filename": "waterfall_demo.js",
            "initialCode": "function getWaterfallPrimaryUse() {\n  return 'WATERFALL_CHARTS_VISUALIZE_FINANCIAL_BRIDGES_FROM_STARTING_TO_ENDING_TOTALS';\n}\n\nconsole.log(getWaterfallPrimaryUse());",
            "expectedOutput": "WATERFALL_CHARTS_VISUALIZE_FINANCIAL_BRIDGES_FROM_STARTING_TO_ENDING_TOTALS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which chart type is specifically designed to visualize financial variance bridges between starting revenue and net ending profit?",
          "expectedStringOutput": "WATERFALL_CHARTS_VISUALIZE_FINANCIAL_BRIDGES_FROM_STARTING_TO_ENDING_TOTALS",
          "acceptableAnswers": [
            "WATERFALL_CHARTS_VISUALIZE_FINANCIAL_BRIDGES_FROM_STARTING_TO_ENDING_TOTALS",
            "Waterfall",
            "Waterfall chart"
          ],
          "primaryMisconceptionId": "MC_EX_BUSINESS_CHARTING_VISUALIZATION_BEST_PRACTICES",
          "diagnosisMap": {
            "DONUT": {
              "misconceptionId": "MC_EX_BUSINESS_CHARTING_VISUALIZATION_BEST_PRACTICES",
              "errorExplanation": "Donut charts show parts of whole. Financial variance bridges use WATERFALL_CHARTS_VISUALIZE_FINANCIAL_BRIDGES_FROM_STARTING_TO_ENDING_TOTALS.",
              "recoveryPath": {
                "simplerExplanation": "Matches WATERFALL_CHARTS_VISUALIZE_FINANCIAL_BRIDGES_FROM_STARTING_TO_ENDING_TOTALS.",
                "guidedFixPrompt": "Type WATERFALL_CHARTS_VISUALIZE_FINANCIAL_BRIDGES_FROM_STARTING_TO_ENDING_TOTALS"
              }
            }
          }
        }
      },
      {
        "id": "ex-d22-b3-eliminating-chart-clutter-edward-tufte",
        "day": 22,
        "blockNumber": 3,
        "title": "Maximizing Data-Ink Ratio: Eliminating 3D Effects, Heavy Gridlines & Legends",
        "conceptBudget": {
          "primaryConcept": "Data-Ink Ratio Invariant",
          "supportingTerms": [
            "Data-Ink Ratio (Remove heavy black gridlines, remove redundant legends on single-series charts, and never use distorted 3D perspective charts)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d22-b2-waterfall-charts-for-variance",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "data_ink_demo.js",
            "initialCode": "function get3DChartRule() {\n  return 'AVOID_3D_CHARTS_BECAUSE_PERSPECTIVE_DISTORTS_NUMERICAL_PROPORTIONS';\n}\n\nconsole.log(get3DChartRule());",
            "expectedOutput": "AVOID_3D_CHARTS_BECAUSE_PERSPECTIVE_DISTORTS_NUMERICAL_PROPORTIONS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why do senior data visualization experts avoid 3D bar and pie charts in executive reports?",
          "expectedStringOutput": "AVOID_3D_CHARTS_BECAUSE_PERSPECTIVE_DISTORTS_NUMERICAL_PROPORTIONS",
          "acceptableAnswers": [
            "AVOID_3D_CHARTS_BECAUSE_PERSPECTIVE_DISTORTS_NUMERICAL_PROPORTIONS",
            "Distorts proportions",
            "Distorts data"
          ],
          "primaryMisconceptionId": "MC_EX_BUSINESS_CHARTING_VISUALIZATION_BEST_PRACTICES",
          "diagnosisMap": {
            "GOOD": {
              "misconceptionId": "MC_EX_BUSINESS_CHARTING_VISUALIZATION_BEST_PRACTICES",
              "errorExplanation": "3D perspective misleads viewers: AVOID_3D_CHARTS_BECAUSE_PERSPECTIVE_DISTORTS_NUMERICAL_PROPORTIONS.",
              "recoveryPath": {
                "simplerExplanation": "Matches AVOID_3D_CHARTS_BECAUSE_PERSPECTIVE_DISTORTS_NUMERICAL_PROPORTIONS.",
                "guidedFixPrompt": "Type AVOID_3D_CHARTS_BECAUSE_PERSPECTIVE_DISTORTS_NUMERICAL_PROPORTIONS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Financial Modeling Functions: `PMT` Loan Repayments, `NPV`, `PV`, `FV` & `IRR`",
    "overviewMetaphor": "The `PMT` Function Is an Amortization Clock: Borrowing $\\$100,000$ at a 6% annual interest rate over a 30-year mortgage ($n = 360\\text{ months}$) calculates the exact fixed monthly payment ($PMT = \\$599.55/\\text{month}$), decomposing payments into principal repayment and compound interest balance.",
    "blocks": [
      {
        "id": "ex-d23-b1-financial-pmt-loan-calculator",
        "day": 23,
        "blockNumber": 1,
        "title": "Loan Amortization: `PMT(6%/12, 360, 100000)` $\\to \\$599.55/\\text{month}$",
        "conceptBudget": {
          "primaryConcept": "Financial Loan Amortization PMT Engine",
          "supportingTerms": [
            "Principal ($100,000$)",
            "Annual Interest Rate ($6.0\\%$)",
            "Loan Term ($30$ years / $360$ months)",
            "Monthly Payment ($599.55$)",
            "Total Repayment ($215,838.00$)",
            "Status: Loan PMT Payment Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d22-b1-business-chart-type-matcher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Loan Amortization & PMT Mechanics Ledger",
              "boxes": [
                {
                  "label": "Loan Terms",
                  "value": "$100,000 Principal | 6.0% Annual Rate (0.5%/month) | 30 Years (360 Months)",
                  "varType": "Terms",
                  "isUpdated": false
                },
                {
                  "label": "PMT Formula",
                  "value": "PMT = (P * r) / (1 - (1 + r)^-n)",
                  "varType": "Formula",
                  "isUpdated": false
                },
                {
                  "label": "Monthly Repayment",
                  "value": "$599.55 per month (LOAN PMT PAYMENT CALCULATED NOMINAL!)",
                  "varType": "Payment",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pmt_demo.js",
            "initialCode": "function computePmt(p, ratePct, years) {\n  const r = (ratePct / 100) / 12;\n  const n = years * 12;\n  const pmt = (p * r) / (1 - Math.pow(1 + r, -n));\n  return {\n    principal: p,\n    months: n,\n    monthlyPmt: Number(pmt.toFixed(2)),\n    totalRepayment: Number((pmt * n).toFixed(2)),\n    status: 'LOAN_PMT_PAYMENT_CALCULATED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(computePmt(100000, 6.0, 30)));",
            "expectedOutput": "{\"principal\":100000,\"months\":360,\"monthlyPmt\":599.55,\"totalRepayment\":215838,\"status\":\"LOAN_PMT_PAYMENT_CALCULATED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the exact monthly payment on a $100,000 loan at 6% annual interest over 30 years (360 months)?",
          "expectedStringOutput": "599.55",
          "acceptableAnswers": [
            "599.55",
            "$599.55",
            "monthlyPmt\":599.55"
          ],
          "primaryMisconceptionId": "MC_EX_FINANCIAL_MODELING_PMT_NPV_IRR",
          "diagnosisMap": {
            "277.78": {
              "misconceptionId": "MC_EX_FINANCIAL_MODELING_PMT_NPV_IRR",
              "errorExplanation": "277.78 ignores interest. Compound interest at 6% yields $599.55.",
              "recoveryPath": {
                "simplerExplanation": "Monthly payment is 599.55.",
                "guidedFixPrompt": "Type 599.55"
              }
            }
          }
        }
      },
      {
        "id": "ex-d23-b2-rate-conversion-annual-to-monthly",
        "day": 23,
        "blockNumber": 2,
        "title": "The Periodic Rate Trap: Dividing Annual Rates by 12 in `=PMT()`",
        "conceptBudget": {
          "primaryConcept": "Periodic Rate Conversion Invariant",
          "supportingTerms": [
            "Monthly Rate Conversion (In Excel `=PMT(rate, nper, pv)`, if payments are monthly, `rate` MUST be divided by 12 (`6%/12`) and `nper` MUST be multiplied by 12 (`30*12`))"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d23-b1-financial-pmt-loan-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Periodic Parameter Alignment",
            "codeSnippet": "// ❌ FLAWED: =PMT(0.06, 30, 100000)      (Computes 30 ANNUAL payments at 6% per period!)\n// ✅ SOUND:  =PMT(0.06/12, 30*12, 100000) (Computes 360 MONTHLY payments at 0.5% per month!)",
            "lineNotes": {
              "1": "Mismatched annual period inputs.",
              "2": "Properly converted monthly parameters."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rate_conversion_demo.js",
            "initialCode": "function getPeriodicRateRule() {\n  return 'ANNUAL_INTEREST_RATES_MUST_BE_DIVIDED_BY_12_FOR_MONTHLY_PAYMENTS';\n}\n\nconsole.log(getPeriodicRateRule());",
            "expectedOutput": "ANNUAL_INTEREST_RATES_MUST_BE_DIVIDED_BY_12_FOR_MONTHLY_PAYMENTS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How must an annual interest rate parameter be adjusted in `=PMT()` when calculating monthly mortgage repayments?",
          "expectedStringOutput": "ANNUAL_INTEREST_RATES_MUST_BE_DIVIDED_BY_12_FOR_MONTHLY_PAYMENTS",
          "acceptableAnswers": [
            "ANNUAL_INTEREST_RATES_MUST_BE_DIVIDED_BY_12_FOR_MONTHLY_PAYMENTS",
            "Divide by 12",
            "Divided by 12"
          ],
          "primaryMisconceptionId": "MC_EX_FINANCIAL_MODELING_PMT_NPV_IRR",
          "diagnosisMap": {
            "NONE": {
              "misconceptionId": "MC_EX_FINANCIAL_MODELING_PMT_NPV_IRR",
              "errorExplanation": "Annual rates must match monthly periods: ANNUAL_INTEREST_RATES_MUST_BE_DIVIDED_BY_12_FOR_MONTHLY_PAYMENTS.",
              "recoveryPath": {
                "simplerExplanation": "Matches ANNUAL_INTEREST_RATES_MUST_BE_DIVIDED_BY_12_FOR_MONTHLY_PAYMENTS.",
                "guidedFixPrompt": "Type ANNUAL_INTEREST_RATES_MUST_BE_DIVIDED_BY_12_FOR_MONTHLY_PAYMENTS"
              }
            }
          }
        }
      },
      {
        "id": "ex-d23-b3-npv-and-irr-discounted-cash-flow",
        "day": 23,
        "blockNumber": 3,
        "title": "Capital Budgeting: `NPV` (Net Present Value) & `IRR` (Internal Rate of Return)",
        "conceptBudget": {
          "primaryConcept": "NPV and IRR Invariant",
          "supportingTerms": [
            "`NPV` (Discounts future cash flows back to today's present value)",
            "`IRR` (Calculates the exact discount rate where project Net Present Value equals zero)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d23-b2-rate-conversion-annual-to-monthly",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "npv_irr_demo.js",
            "initialCode": "function getIrrDefinitionStandard() {\n  return 'IRR_IS_THE_DISCOUNT_RATE_AT_WHICH_PROJECT_NPV_EQUALS_ZERO';\n}\n\nconsole.log(getIrrDefinitionStandard());",
            "expectedOutput": "IRR_IS_THE_DISCOUNT_RATE_AT_WHICH_PROJECT_NPV_EQUALS_ZERO",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the financial definition of the Internal Rate of Return (IRR) in Excel investment analysis?",
          "expectedStringOutput": "IRR_IS_THE_DISCOUNT_RATE_AT_WHICH_PROJECT_NPV_EQUALS_ZERO",
          "acceptableAnswers": [
            "IRR_IS_THE_DISCOUNT_RATE_AT_WHICH_PROJECT_NPV_EQUALS_ZERO",
            "Discount rate where NPV is zero",
            "Rate where NPV equals 0"
          ],
          "primaryMisconceptionId": "MC_EX_FINANCIAL_MODELING_PMT_NPV_IRR",
          "diagnosisMap": {
            "PROFIT": {
              "misconceptionId": "MC_EX_FINANCIAL_MODELING_PMT_NPV_IRR",
              "errorExplanation": "IRR is a discount rate: IRR_IS_THE_DISCOUNT_RATE_AT_WHICH_PROJECT_NPV_EQUALS_ZERO.",
              "recoveryPath": {
                "simplerExplanation": "Matches IRR_IS_THE_DISCOUNT_RATE_AT_WHICH_PROJECT_NPV_EQUALS_ZERO.",
                "guidedFixPrompt": "Type IRR_IS_THE_DISCOUNT_RATE_AT_WHICH_PROJECT_NPV_EQUALS_ZERO"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "What-If Analysis & Scenario Planning: Goal Seek & Sensitivity Data Tables",
    "overviewMetaphor": "Goal Seek Is Driving in Reverse to Reach an Exact Destination: Instead of guessing how many widgets you must sell to make $\\$10,000$ profit, Goal Seek back-solves the mathematical equation in reverse ($Units = \\frac{\\$50,000\\text{ Fixed} + \\$10,000\\text{ Target}}{\\$30\\text{ Margin}} = 2,000\\text{ units}$), giving executives the exact sales target needed.",
    "blocks": [
      {
        "id": "ex-d24-b1-goal-seek-break-even-solver",
        "day": 24,
        "blockNumber": 1,
        "title": "Goal Seek Back-Solving: Required Unit Volume for Target Profit ($2,000$ units)",
        "conceptBudget": {
          "primaryConcept": "Goal Seek Break-Even Unit Volume Back-Solver",
          "supportingTerms": [
            "Fixed Costs ($50,000$)",
            "Sale Price ($50$)",
            "Variable Cost ($20$)",
            "Target Profit ($10,000$)",
            "Contribution Margin ($30.00$)",
            "Required Units ($2,000$)",
            "Status: Goal Seek Units Resolved Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d23-b1-financial-pmt-loan-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Goal Seek Reverse Solver & Sensitivity Ledger",
              "boxes": [
                {
                  "label": "Cost Parameters",
                  "value": "Fixed: $50,000 | Price: $50 | VarCost: $20 (Margin = $30/unit)",
                  "varType": "Costs",
                  "isUpdated": false
                },
                {
                  "label": "Target Profit Goal",
                  "value": "Target Net Profit = $10,000.00",
                  "varType": "Target",
                  "isUpdated": false
                },
                {
                  "label": "Back-Solved Units",
                  "value": "(50k + 10k) / 30 = 2,000 Units (GOAL SEEK UNITS RESOLVED NOMINAL!)",
                  "varType": "Solved",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "goal_seek_demo.js",
            "initialCode": "function backSolveUnits(fixed, price, varCost, target) {\n  const margin = price - varCost;\n  const units = Math.ceil((fixed + target) / margin);\n  return {\n    fixed,\n    margin,\n    requiredUnits: units,\n    revenue: units * price,\n    status: 'GOAL_SEEK_UNITS_RESOLVED_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(backSolveUnits(50000, 50, 20, 10000)));",
            "expectedOutput": "{\"fixed\":50000,\"margin\":30,\"requiredUnits\":2000,\"revenue\":100000,\"status\":\"GOAL_SEEK_UNITS_RESOLVED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many units must be sold to earn $10,000 profit given $50,000 fixed costs and $30 unit contribution margin?",
          "expectedStringOutput": "2000",
          "acceptableAnswers": [
            "2000",
            "2,000",
            "requiredUnits\":2000"
          ],
          "primaryMisconceptionId": "MC_EX_WHAT_IF_ANALYSIS_GOAL_SEEK_SCENARIOS",
          "diagnosisMap": {
            "1667": {
              "misconceptionId": "MC_EX_WHAT_IF_ANALYSIS_GOAL_SEEK_SCENARIOS",
              "errorExplanation": "1667 only covers fixed costs ($0 profit). Earning $10,000 profit requires (50,000 + 10,000) / 30 = 2000 units.",
              "recoveryPath": {
                "simplerExplanation": "Units required is 2000.",
                "guidedFixPrompt": "Type 2000"
              }
            }
          }
        }
      },
      {
        "id": "ex-d24-b2-two-variable-data-tables-sensitivity",
        "day": 24,
        "blockNumber": 2,
        "title": "2-Variable Data Tables: Multi-Scenario Sensitivity Matrices",
        "conceptBudget": {
          "primaryConcept": "2-Variable Data Table Invariant",
          "supportingTerms": [
            "Data Table (`{=TABLE(RowInput, ColInput)}`: Computes a 10x10 matrix of profit outcomes across varying price and interest rate combinations simultaneously)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d24-b1-goal-seek-break-even-solver",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Data Table Matrix Setup",
            "codeSnippet": "// Top-Left Corner Cell:  Link formula =B10 (Net Profit)\n// Row Input Cell:       Points to Price ($40, $45, $50, $55, $60)\n// Column Input Cell:    Points to Volume (1000, 1500, 2000, 2500)",
            "lineNotes": {
              "1": "Origin formula pointer.",
              "2": "Row parameter variation.",
              "3": "Column parameter variation."
            }
          },
          {
            "type": "runnable_code",
            "filename": "data_table_demo.js",
            "initialCode": "function getDataTableCornerRule() {\n  return 'TOP_LEFT_CORNER_OF_A_TWO_VARIABLE_DATA_TABLE_MUST_CONTAIN_THE_OUTPUT_FORMULA';\n}\n\nconsole.log(getDataTableCornerRule());",
            "expectedOutput": "TOP_LEFT_CORNER_OF_A_TWO_VARIABLE_DATA_TABLE_MUST_CONTAIN_THE_OUTPUT_FORMULA",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What must be placed in the top-left corner cell of an Excel 2-Variable Data Table matrix?",
          "expectedStringOutput": "TOP_LEFT_CORNER_OF_A_TWO_VARIABLE_DATA_TABLE_MUST_CONTAIN_THE_OUTPUT_FORMULA",
          "acceptableAnswers": [
            "TOP_LEFT_CORNER_OF_A_TWO_VARIABLE_DATA_TABLE_MUST_CONTAIN_THE_OUTPUT_FORMULA",
            "Output formula",
            "The output formula"
          ],
          "primaryMisconceptionId": "MC_EX_WHAT_IF_ANALYSIS_GOAL_SEEK_SCENARIOS",
          "diagnosisMap": {
            "BLANK": {
              "misconceptionId": "MC_EX_WHAT_IF_ANALYSIS_GOAL_SEEK_SCENARIOS",
              "errorExplanation": "Blank breaks the table: TOP_LEFT_CORNER_OF_A_TWO_VARIABLE_DATA_TABLE_MUST_CONTAIN_THE_OUTPUT_FORMULA.",
              "recoveryPath": {
                "simplerExplanation": "Matches TOP_LEFT_CORNER_OF_A_TWO_VARIABLE_DATA_TABLE_MUST_CONTAIN_THE_OUTPUT_FORMULA.",
                "guidedFixPrompt": "Type TOP_LEFT_CORNER_OF_A_TWO_VARIABLE_DATA_TABLE_MUST_CONTAIN_THE_OUTPUT_FORMULA"
              }
            }
          }
        }
      },
      {
        "id": "ex-d24-b3-scenario-manager-summaries",
        "day": 24,
        "blockNumber": 3,
        "title": "Scenario Manager: Best-Case, Base-Case & Worst-Case Forecasts",
        "conceptBudget": {
          "primaryConcept": "Scenario Manager Invariant",
          "supportingTerms": [
            "Scenario Manager (Saves multiple named input variable sets and generates an executive Scenario Summary comparison report)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d24-b2-two-variable-data-tables-sensitivity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "scenario_demo.js",
            "initialCode": "function getScenarioManagerBenefit() {\n  return 'SCENARIO_MANAGER_GENERATES_SIDE_BY_SIDE_EXECUTIVE_SUMMARY_COMPARISONS';\n}\n\nconsole.log(getScenarioManagerBenefit());",
            "expectedOutput": "SCENARIO_MANAGER_GENERATES_SIDE_BY_SIDE_EXECUTIVE_SUMMARY_COMPARISONS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What What-If Analysis tool produces a side-by-side comparison summary sheet across Best-Case, Base-Case, and Worst-Case models?",
          "expectedStringOutput": "SCENARIO_MANAGER_GENERATES_SIDE_BY_SIDE_EXECUTIVE_SUMMARY_COMPARISONS",
          "acceptableAnswers": [
            "SCENARIO_MANAGER_GENERATES_SIDE_BY_SIDE_EXECUTIVE_SUMMARY_COMPARISONS",
            "Scenario Manager",
            "scenario manager"
          ],
          "primaryMisconceptionId": "MC_EX_WHAT_IF_ANALYSIS_GOAL_SEEK_SCENARIOS",
          "diagnosisMap": {
            "SOLVER": {
              "misconceptionId": "MC_EX_WHAT_IF_ANALYSIS_GOAL_SEEK_SCENARIOS",
              "errorExplanation": "Solver optimizes single targets. Multi-case comparisons use SCENARIO_MANAGER_GENERATES_SIDE_BY_SIDE_EXECUTIVE_SUMMARY_COMPARISONS.",
              "recoveryPath": {
                "simplerExplanation": "Matches SCENARIO_MANAGER_GENERATES_SIDE_BY_SIDE_EXECUTIVE_SUMMARY_COMPARISONS.",
                "guidedFixPrompt": "Type SCENARIO_MANAGER_GENERATES_SIDE_BY_SIDE_EXECUTIVE_SUMMARY_COMPARISONS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Power Query (Get & Transform) I: Data Cleaning, Splitting & Unpivoting",
    "overviewMetaphor": "Power Query Is an Automated Factory Assembly Line for Messy CSV Data: Raw, disfigured monthly spreadsheets (Wide format with Jan, Feb columns) enter the conveyor belt; the Unpivot robotic arm transforms 2 wide rows into 4 tall database rows ($Jan = 100, Feb = 150$), perfectly normalized for downstream Pivot Table analysis.",
    "blocks": [
      {
        "id": "ex-d25-b1-power-query-unpivoting-transformation",
        "day": 25,
        "blockNumber": 1,
        "title": "Power Query Unpivot: Normalizing Wide Tables ($2\\text{ wide rows} \\to 4\\text{ tall rows}$)",
        "conceptBudget": {
          "primaryConcept": "Power Query Wide-to-Long Unpivoting Engine",
          "supportingTerms": [
            "Wide Row Count ($2$ products)",
            "Month Columns (`['Jan', 'Feb']`)",
            "Normalized Tall Rows ($4$ records)",
            "Status: Power Query Unpivot Transformation Computed Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d24-b1-goal-seek-break-even-solver",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Power Query ETL Wide-to-Tall Normalization Ledger",
              "boxes": [
                {
                  "label": "Wide Source Table",
                  "value": "Product A [Jan: 100, Feb: 150] | Product B [Jan: 200, Feb: 250]",
                  "varType": "Wide Format",
                  "isUpdated": false
                },
                {
                  "label": "Unpivot Other Columns",
                  "value": "Transforms Month Headers into a 'Month' Attribute Column",
                  "varType": "ETL Step",
                  "isUpdated": false
                },
                {
                  "label": "Normalized Tall Output",
                  "value": "4 Normalized Rows: {A, Jan, 100}, {A, Feb, 150}... (UNPIVOT COMPUTED NOMINAL!)",
                  "varType": "Tall Format",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "unpivot_demo.js",
            "initialCode": "function unpivotData(records, idKey, months) {\n  const unpivoted = [];\n  records.forEach(r => {\n    months.forEach(m => {\n      unpivoted.push({ id: r[idKey], month: m, amount: r[m] });\n    });\n  });\n  return {\n    wideRows: records.length,\n    tallRows: unpivoted.length,\n    records: unpivoted,\n    status: 'POWER_QUERY_UNPIVOT_TRANSFORMATION_COMPUTED_NOMINAL'\n  };\n}\n\nconst wide = [{ product: 'A', Jan: 100, Feb: 150 }, { product: 'B', Jan: 200, Feb: 250 }];\nconsole.log(JSON.stringify(unpivotData(wide, 'product', ['Jan', 'Feb'])));",
            "expectedOutput": "{\"wideRows\":2,\"tallRows\":4,\"records\":[{\"id\":\"A\",\"month\":\"Jan\",\"amount\":100},{\"id\":\"A\",\"month\":\"Feb\",\"amount\":150},{\"id\":\"B\",\"month\":\"Jan\",\"amount\":200},{\"id\":\"B\",\"month\":\"Feb\",\"amount\":250}],\"status\":\"POWER_QUERY_UNPIVOT_TRANSFORMATION_COMPUTED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many normalized tall database rows are produced when unpivoting 2 products across 2 monthly columns?",
          "expectedStringOutput": "4",
          "acceptableAnswers": [
            "4",
            "4 rows",
            "tallRows\":4"
          ],
          "primaryMisconceptionId": "MC_EX_POWER_QUERY_ETL_UNPIVOT_CLEANING",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_EX_POWER_QUERY_ETL_UNPIVOT_CLEANING",
              "errorExplanation": "2 was the wide format. Unpivoting 2 products * 2 months generates 4 tall rows.",
              "recoveryPath": {
                "simplerExplanation": "2 * 2 = 4 tall rows.",
                "guidedFixPrompt": "Type 4"
              }
            }
          }
        }
      },
      {
        "id": "ex-d25-b2-power-query-applied-steps-repeatability",
        "day": 25,
        "blockNumber": 2,
        "title": "The 'Applied Steps' Pane: Self-Documenting Repeatable ETL Recipes",
        "conceptBudget": {
          "primaryConcept": "Applied Steps Recipe Invariant",
          "supportingTerms": [
            "Applied Steps (Every cleaning action: Promoted Headers, Removed Columns, Changed Type is recorded as a repeatable script that runs on future data refreshes)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d25-b1-power-query-unpivoting-transformation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Applied Steps Sequence",
            "codeSnippet": "// APPLIED STEPS:\n// 1. Source (Connects to CSV)\n// 2. Promoted Headers\n// 3. Changed Type (Converts Date to Date type)\n// 4. Unpivoted Other Columns\n// 5. Filtered Rows (Removes null transactions)",
            "lineNotes": {
              "1": "Data ingestion.",
              "2": "Header row promotion.",
              "3": "Strong type coercion.",
              "4": "Database normalization.",
              "5": "Data sanitization."
            }
          },
          {
            "type": "runnable_code",
            "filename": "applied_steps_demo.js",
            "initialCode": "function getAppliedStepsBenefit() {\n  return 'APPLIED_STEPS_AUTOMATICALLY_REAPPLY_ALL_CLEANING_ACTIONS_UPON_DATA_REFRESH';\n}\n\nconsole.log(getAppliedStepsBenefit());",
            "expectedOutput": "APPLIED_STEPS_AUTOMATICALLY_REAPPLY_ALL_CLEANING_ACTIONS_UPON_DATA_REFRESH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Power Query interface pane records transformation actions as an automated, re-executable recipe for future data refreshes?",
          "expectedStringOutput": "APPLIED_STEPS_AUTOMATICALLY_REAPPLY_ALL_CLEANING_ACTIONS_UPON_DATA_REFRESH",
          "acceptableAnswers": [
            "APPLIED_STEPS_AUTOMATICALLY_REAPPLY_ALL_CLEANING_ACTIONS_UPON_DATA_REFRESH",
            "Applied Steps",
            "applied steps"
          ],
          "primaryMisconceptionId": "MC_EX_POWER_QUERY_ETL_UNPIVOT_CLEANING",
          "diagnosisMap": {
            "VBA": {
              "misconceptionId": "MC_EX_POWER_QUERY_ETL_UNPIVOT_CLEANING",
              "errorExplanation": "VBA is macro code. Power Query uses APPLIED_STEPS_AUTOMATICALLY_REAPPLY_ALL_CLEANING_ACTIONS_UPON_DATA_REFRESH.",
              "recoveryPath": {
                "simplerExplanation": "Matches APPLIED_STEPS_AUTOMATICALLY_REAPPLY_ALL_CLEANING_ACTIONS_UPON_DATA_REFRESH.",
                "guidedFixPrompt": "Type APPLIED_STEPS_AUTOMATICALLY_REAPPLY_ALL_CLEANING_ACTIONS_UPON_DATA_REFRESH"
              }
            }
          }
        }
      },
      {
        "id": "ex-d25-b3-splitting-columns-by-delimiter",
        "day": 25,
        "blockNumber": 3,
        "title": "Splitting Columns: Extracting First and Last Names by Delimiter",
        "conceptBudget": {
          "primaryConcept": "Column Splitting Invariant",
          "supportingTerms": [
            "Split by Delimiter (Splits compound strings `'Doe, John'` into separate `'Last Name'` and `'First Name'` columns based on the comma delimiter)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d25-b2-power-query-applied-steps-repeatability",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "split_col_demo.js",
            "initialCode": "function getSplitByDelimiterStandard() {\n  return 'SPLIT_COLUMN_BY_DELIMITER_PARSES_COMPOUND_FIELDS_INTO_ATOMIC_COLUMNS';\n}\n\nconsole.log(getSplitByDelimiterStandard());",
            "expectedOutput": "SPLIT_COLUMN_BY_DELIMITER_PARSES_COMPOUND_FIELDS_INTO_ATOMIC_COLUMNS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What Power Query transformation separates full name strings like `'Smith, Jane'` into individual Last Name and First Name columns?",
          "expectedStringOutput": "SPLIT_COLUMN_BY_DELIMITER_PARSES_COMPOUND_FIELDS_INTO_ATOMIC_COLUMNS",
          "acceptableAnswers": [
            "SPLIT_COLUMN_BY_DELIMITER_PARSES_COMPOUND_FIELDS_INTO_ATOMIC_COLUMNS",
            "Split Column by Delimiter",
            "Split column"
          ],
          "primaryMisconceptionId": "MC_EX_POWER_QUERY_ETL_UNPIVOT_CLEANING",
          "diagnosisMap": {
            "MERGE": {
              "misconceptionId": "MC_EX_POWER_QUERY_ETL_UNPIVOT_CLEANING",
              "errorExplanation": "Merge joins tables. Separating text uses SPLIT_COLUMN_BY_DELIMITER_PARSES_COMPOUND_FIELDS_INTO_ATOMIC_COLUMNS.",
              "recoveryPath": {
                "simplerExplanation": "Matches SPLIT_COLUMN_BY_DELIMITER_PARSES_COMPOUND_FIELDS_INTO_ATOMIC_COLUMNS.",
                "guidedFixPrompt": "Type SPLIT_COLUMN_BY_DELIMITER_PARSES_COMPOUND_FIELDS_INTO_ATOMIC_COLUMNS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Power Query (Get & Transform) II: Merging Queries (Joins), Appending & Refresh",
    "overviewMetaphor": "Merging Queries Is an SQL Left Outer Join Without SQL Code: Power Query matches customer IDs between your Sales Table and Customer Master Table (`custId = 101 \\implies 'Acme Corp'`, `custId = 102 \\implies 'Globex'`), joining multi-million-row enterprise tables with point-and-click ease.",
    "blocks": [
      {
        "id": "ex-d26-b1-power-query-merge-queries-join",
        "day": 26,
        "blockNumber": 1,
        "title": "Power Query Merge: Left Outer Join Matching Customer Names (`'Acme Corp'`, `'Globex'`)",
        "conceptBudget": {
          "primaryConcept": "Power Query Left Outer Join Merge Engine",
          "supportingTerms": [
            "Sales Table ($2$ orders)",
            "Customer Master ($2$ accounts)",
            "Join Key (`'custId'`)",
            "Merged Customer Names (`'Acme Corp'`, `'Globex'`)",
            "Status: Power Query Left Outer Join Merged Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d25-b1-power-query-unpivoting-transformation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Power Query Merge Queries (Left Outer Join) Ledger",
              "boxes": [
                {
                  "label": "Left Table (Sales)",
                  "value": "Order 1 [custId: 101, $50] | Order 2 [custId: 102, $80]",
                  "varType": "Left Table",
                  "isUpdated": false
                },
                {
                  "label": "Right Table (Customers)",
                  "value": "Cust 101 -> 'Acme Corp' | Cust 102 -> 'Globex'",
                  "varType": "Right Table",
                  "isUpdated": false
                },
                {
                  "label": "Merged Join Result",
                  "value": "Order 1 -> 'Acme Corp' | Order 2 -> 'Globex' (MERGE JOIN COMPUTED NOMINAL!)",
                  "varType": "Merged",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "merge_demo.js",
            "initialCode": "function mergeQueries(left, right, key, field) {\n  const map = new Map();\n  right.forEach(r => map.set(r[key], r[field]));\n  const merged = left.map(l => ({ ...l, [field]: map.get(l[key]) || null }));\n  return {\n    leftCount: left.length,\n    merged,\n    status: 'POWER_QUERY_LEFT_OUTER_JOIN_MERGED_NOMINAL'\n  };\n}\n\nconst sales = [{ orderId: 1, custId: 101, amount: 50 }, { orderId: 2, custId: 102, amount: 80 }];\nconst customers = [{ custId: 101, name: 'Acme Corp' }, { custId: 102, name: 'Globex' }];\nconsole.log(JSON.stringify(mergeQueries(sales, customers, 'custId', 'name')));",
            "expectedOutput": "{\"leftCount\":2,\"merged\":[{\"orderId\":1,\"custId\":101,\"amount\":50,\"name\":\"Acme Corp\"},{\"orderId\":2,\"custId\":102,\"amount\":80,\"name\":\"Globex\"}],\"status\":\"POWER_QUERY_LEFT_OUTER_JOIN_MERGED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What customer name is merged into Order 1 (custId: 101) after executing a Power Query Left Outer Join?",
          "expectedStringOutput": "Acme Corp",
          "acceptableAnswers": [
            "Acme Corp",
            "name\":\"Acme Corp\""
          ],
          "primaryMisconceptionId": "MC_EX_POWER_QUERY_MERGE_JOINS_APPEND",
          "diagnosisMap": {
            "Globex": {
              "misconceptionId": "MC_EX_POWER_QUERY_MERGE_JOINS_APPEND",
              "errorExplanation": "Globex is custId 102. CustId 101 matches Acme Corp.",
              "recoveryPath": {
                "simplerExplanation": "101 matches Acme Corp.",
                "guidedFixPrompt": "Type Acme Corp"
              }
            }
          }
        }
      },
      {
        "id": "ex-d26-b2-append-queries-stacking-tables",
        "day": 26,
        "blockNumber": 2,
        "title": "Appending Queries: Stacking Monthly Sales CSVs into a Unified Master Table",
        "conceptBudget": {
          "primaryConcept": "Append Queries Stacking Invariant",
          "supportingTerms": [
            "Append Queries (`UNION ALL`: Vertically stacks Q1, Q2, Q3, and Q4 tables on top of each other, aligning identical column headers automatically)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d26-b1-power-query-merge-queries-join",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Merge vs Append Distinctions",
            "codeSnippet": "// MERGE QUERIES:  Adds COLUMNS horizontally (Like an SQL JOIN on common keys)\n// APPEND QUERIES: Adds ROWS vertically       (Like an SQL UNION stacking files)",
            "lineNotes": {
              "1": "Horizontal join adding fields.",
              "2": "Vertical union adding records."
            }
          },
          {
            "type": "runnable_code",
            "filename": "append_demo.js",
            "initialCode": "function getAppendQueriesRole() {\n  return 'APPEND_QUERIES_VERTICALLY_STACKS_TABLES_WITH_MATCHING_HEADERS';\n}\n\nconsole.log(getAppendQueriesRole());",
            "expectedOutput": "APPEND_QUERIES_VERTICALLY_STACKS_TABLES_WITH_MATCHING_HEADERS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How does 'Append Queries' differ from 'Merge Queries' in Microsoft Excel Power Query?",
          "expectedStringOutput": "APPEND_QUERIES_VERTICALLY_STACKS_TABLES_WITH_MATCHING_HEADERS",
          "acceptableAnswers": [
            "APPEND_QUERIES_VERTICALLY_STACKS_TABLES_WITH_MATCHING_HEADERS",
            "Stacks rows vertically",
            "Adds rows vertically"
          ],
          "primaryMisconceptionId": "MC_EX_POWER_QUERY_MERGE_JOINS_APPEND",
          "diagnosisMap": {
            "HORIZONTAL": {
              "misconceptionId": "MC_EX_POWER_QUERY_MERGE_JOINS_APPEND",
              "errorExplanation": "Horizontal is Merge. Append is APPEND_QUERIES_VERTICALLY_STACKS_TABLES_WITH_MATCHING_HEADERS.",
              "recoveryPath": {
                "simplerExplanation": "Matches APPEND_QUERIES_VERTICALLY_STACKS_TABLES_WITH_MATCHING_HEADERS.",
                "guidedFixPrompt": "Type APPEND_QUERIES_VERTICALLY_STACKS_TABLES_WITH_MATCHING_HEADERS"
              }
            }
          }
        }
      },
      {
        "id": "ex-d26-b3-m-code-formula-language-basics",
        "day": 26,
        "blockNumber": 3,
        "title": "The 'M' Formula Language: The Functional Scripting Core of Power Query",
        "conceptBudget": {
          "primaryConcept": "M Formula Language Invariant",
          "supportingTerms": [
            "Power Query M Code (A case-sensitive functional language structured in `let ... in ...` blocks that powers every Power Query step under the hood)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d26-b2-append-queries-stacking-tables",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "m_code_demo.js",
            "initialCode": "function getPowerQueryLanguage() {\n  return 'M_CODE';\n}\n\nconsole.log(getPowerQueryLanguage());",
            "expectedOutput": "M_CODE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the official name of the underlying functional formula language used by Microsoft Power Query?",
          "expectedStringOutput": "M_CODE",
          "acceptableAnswers": [
            "M_CODE",
            "M Code",
            "M",
            "M language"
          ],
          "primaryMisconceptionId": "MC_EX_POWER_QUERY_MERGE_JOINS_APPEND",
          "diagnosisMap": {
            "DAX": {
              "misconceptionId": "MC_EX_POWER_QUERY_MERGE_JOINS_APPEND",
              "errorExplanation": "DAX is used in Power Pivot data modeling. Power Query uses M_CODE.",
              "recoveryPath": {
                "simplerExplanation": "Type M_CODE.",
                "guidedFixPrompt": "Type M_CODE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Executive Dashboard Design & Layout Principles: KPI Metric Cards & Visual Flow",
    "overviewMetaphor": "An Executive Dashboard Is a Fighter Jet Cockpit Heads-Up Display: High-level KPI Metric Cards ($120k\\text{ Actual vs }\\$100k\\text{ Target} \\implies +20.0\\%\\text{ Variance}$, `'TARGET_EXCEEDED'`) sit at the top-left where the CEO looks first; disciplined color palettes (Max 3 colors) eliminate sensory overload and highlight mission-critical anomalies.",
    "blocks": [
      {
        "id": "ex-d27-b1-executive-kpi-metric-card-calculator",
        "day": 27,
        "blockNumber": 1,
        "title": "Executive KPI Cards: Actual $\\$120\\text{k}$ vs Target $\\$100\\text{k}$ (+$20.0\\%$ YoY Variance)",
        "conceptBudget": {
          "primaryConcept": "Executive KPI Metric Card Variance Scorecard",
          "supportingTerms": [
            "Actual Value ($120,000$)",
            "Target Value ($100,000$)",
            "Variance Percentage ($+20.0\\%$)",
            "Target Status (`'TARGET_EXCEEDED_NOMINAL'`)",
            "Status: Executive KPI Metric Card Calculated Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d26-b1-power-query-merge-queries-join",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Executive KPI Metric Card & Variance Ledger",
              "boxes": [
                {
                  "label": "Target Benchmark",
                  "value": "Annual Revenue Target: $100,000.00",
                  "varType": "Target",
                  "isUpdated": false
                },
                {
                  "label": "Actual Performance",
                  "value": "Actual Delivered: $120,000.00 (+20k Overperformance)",
                  "varType": "Actual",
                  "isUpdated": false
                },
                {
                  "label": "Variance Percentage",
                  "value": "+20.0% YoY Growth (TARGET EXCEEDED NOMINAL!)",
                  "varType": "KPI Status",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "kpi_card_demo.js",
            "initialCode": "function computeKpiCard(actual, target) {\n  const pct = ((actual - target) / target) * 100;\n  const ok = actual >= target;\n  return {\n    actual,\n    target,\n    variancePct: Number(pct.toFixed(1)),\n    isTargetAchieved: ok,\n    status: ok ? 'TARGET_EXCEEDED_NOMINAL' : 'TARGET_MISSED_DEFICIT'\n  };\n}\n\nconsole.log(JSON.stringify(computeKpiCard(120000, 100000)));\nconsole.log(JSON.stringify(computeKpiCard(85000, 100000)));",
            "expectedOutput": "{\"actual\":120000,\"target\":100000,\"variancePct\":20,\"isTargetAchieved\":true,\"status\":\"TARGET_EXCEEDED_NOMINAL\"}\n{\"actual\":85000,\"target\":100000,\"variancePct\":-15,\"isTargetAchieved\":false,\"status\":\"TARGET_MISSED_DEFICIT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What variance percentage is calculated for an actual revenue of $120,000 against a $100,000 target?",
          "expectedStringOutput": "20",
          "acceptableAnswers": [
            "20",
            "+20",
            "20%",
            "20.0",
            "variancePct\":20"
          ],
          "primaryMisconceptionId": "MC_EX_EXECUTIVE_DASHBOARD_KPI_LAYOUT_DESIGN",
          "diagnosisMap": {
            "120": {
              "misconceptionId": "MC_EX_EXECUTIVE_DASHBOARD_KPI_LAYOUT_DESIGN",
              "errorExplanation": "120% is attainment. Variance is ((120,000 - 100,000) / 100,000) * 100 = 20.0%.",
              "recoveryPath": {
                "simplerExplanation": "Variance is 20%.",
                "guidedFixPrompt": "Type 20"
              }
            }
          }
        }
      },
      {
        "id": "ex-d27-b2-three-second-rule-and-visual-hierarchy",
        "day": 27,
        "blockNumber": 2,
        "title": "The '3-Second Rule' & Top-Left Executive Reading Hierarchy",
        "conceptBudget": {
          "primaryConcept": "3-Second Rule Invariant",
          "supportingTerms": [
            "3-Second Rule (An executive must understand company financial health within 3 seconds of viewing the dashboard, scanning from Top-Left to Bottom-Right)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d27-b1-executive-kpi-metric-card-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Dashboard Spatial Layout",
            "codeSnippet": "// [ TOP ROW ]      -> 4 High-Level KPI Metric Cards (Revenue, Profit, Margin, CAC)\n// [ MIDDLE ROW ]   -> Monthly Trend Line Chart + Regional Sales Bar Chart\n// [ BOTTOM ROW ]   -> Granular Drill-Down Summary Table + Interactive Slicers",
            "lineNotes": {
              "1": "High-level summary cards.",
              "2": "Visual analytical charts.",
              "3": "Detailed tabular records."
            }
          },
          {
            "type": "runnable_code",
            "filename": "visual_hierarchy_demo.js",
            "initialCode": "function getVisualHierarchyStandard() {\n  return 'TOP_LEFT_POSITION_HOLDS_THE_HIGHEST_EXECUTIVE_VISUAL_PRIORITY';\n}\n\nconsole.log(getVisualHierarchyStandard());",
            "expectedOutput": "TOP_LEFT_POSITION_HOLDS_THE_HIGHEST_EXECUTIVE_VISUAL_PRIORITY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which region of an executive dashboard layout receives the highest visual priority based on natural eye-tracking patterns?",
          "expectedStringOutput": "TOP_LEFT_POSITION_HOLDS_THE_HIGHEST_EXECUTIVE_VISUAL_PRIORITY",
          "acceptableAnswers": [
            "TOP_LEFT_POSITION_HOLDS_THE_HIGHEST_EXECUTIVE_VISUAL_PRIORITY",
            "Top Left",
            "Top-Left",
            "top left"
          ],
          "primaryMisconceptionId": "MC_EX_EXECUTIVE_DASHBOARD_KPI_LAYOUT_DESIGN",
          "diagnosisMap": {
            "BOTTOM": {
              "misconceptionId": "MC_EX_EXECUTIVE_DASHBOARD_KPI_LAYOUT_DESIGN",
              "errorExplanation": "Eyes land top-left first: TOP_LEFT_POSITION_HOLDS_THE_HIGHEST_EXECUTIVE_VISUAL_PRIORITY.",
              "recoveryPath": {
                "simplerExplanation": "Matches TOP_LEFT_POSITION_HOLDS_THE_HIGHEST_EXECUTIVE_VISUAL_PRIORITY.",
                "guidedFixPrompt": "Type TOP_LEFT_POSITION_HOLDS_THE_HIGHEST_EXECUTIVE_VISUAL_PRIORITY"
              }
            }
          }
        }
      },
      {
        "id": "ex-d27-b3-color-discipline-and-gridline-removal",
        "day": 27,
        "blockNumber": 3,
        "title": "Palette Discipline: The 3-Color Rule & Removing Default Spreadsheet Gridlines",
        "conceptBudget": {
          "primaryConcept": "Palette Discipline Invariant",
          "supportingTerms": [
            "Color Palette Limit (Never use more than 3 primary palette colors: 1 neutral dark grey for text, 1 brand primary blue/navy for charts, and 1 accent green/red for status highlights; always uncheck Gridlines)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d27-b2-three-second-rule-and-visual-hierarchy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "palette_demo.js",
            "initialCode": "function getMaxDashboardColors() {\n  return 3;\n}\n\nconsole.log(getMaxDashboardColors());",
            "expectedOutput": "3",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the recommended maximum number of primary palette colors in professional executive dashboard design?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "3 colors",
            "three"
          ],
          "primaryMisconceptionId": "MC_EX_EXECUTIVE_DASHBOARD_KPI_LAYOUT_DESIGN",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_EX_EXECUTIVE_DASHBOARD_KPI_LAYOUT_DESIGN",
              "errorExplanation": "10 colors creates visual noise. Professional dashboards limit primary colors to 3.",
              "recoveryPath": {
                "simplerExplanation": "Type 3.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Spreadsheet Security, Protection & Auditing: Sheet Protection & Formula Locks",
    "overviewMetaphor": "Sheet Protection Is a Museum Display Case with Glove Ports: The master financial formulas ($PMT, XLOOKUP$) are locked behind bulletproof glass (`CELL_LOCKED_MODIFICATION_BLOCKED`); users can only reach through the open glove ports into Unlocked Input Cells (`UNLOCKED_INPUT_CELL_EDIT_PERMITTED`), preventing accidental formula overwrites.",
    "blocks": [
      {
        "id": "ex-d28-b1-spreadsheet-protection-gatekeeper",
        "day": 28,
        "blockNumber": 1,
        "title": "Cell Protection: Unlocked Input Cells vs Locked Formula Cells",
        "conceptBudget": {
          "primaryConcept": "Spreadsheet Cell Protection & Formula Lock Gatekeeper",
          "supportingTerms": [
            "Sheet Protected (`true`)",
            "Unlocked Input Cell (`editAllowed: true`)",
            "Locked Formula Cell (`editAllowed: false`)",
            "Status: Unlocked Input Cell Edit Permitted"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d27-b1-executive-kpi-metric-card-calculator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Spreadsheet Protection & Cell Locking Ledger",
              "boxes": [
                {
                  "label": "Unlocked Input Cell",
                  "value": "Locked = False -> Users can input assumptions (EDIT PERMITTED!)",
                  "varType": "Input",
                  "isUpdated": false
                },
                {
                  "label": "Locked Formula Cell",
                  "value": "Locked = True -> Formula protected from edits (MODIFICATION BLOCKED!)",
                  "varType": "Formula",
                  "isUpdated": false
                },
                {
                  "label": "Admin Override",
                  "value": "Admin Privileges -> Full modification access (OVERRIDE PERMITTED!)",
                  "varType": "Admin",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "protection_demo.js",
            "initialCode": "function evaluateEdit(isProtected, isLocked, isAdmin) {\n  if (!isProtected || isAdmin) return { editAllowed: true, status: 'EDIT_PERMITTED' };\n  if (isLocked) return { editAllowed: false, status: 'CELL_LOCKED_MODIFICATION_BLOCKED' };\n  return { editAllowed: true, status: 'UNLOCKED_INPUT_CELL_EDIT_PERMITTED' };\n}\n\nconsole.log(JSON.stringify(evaluateEdit(true, false, false)));\nconsole.log(JSON.stringify(evaluateEdit(true, true, false)));",
            "expectedOutput": "{\"editAllowed\":true,\"status\":\"UNLOCKED_INPUT_CELL_EDIT_PERMITTED\"}\n{\"editAllowed\":false,\"status\":\"CELL_LOCKED_MODIFICATION_BLOCKED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Can a user edit a cell with `Locked: True` when the worksheet is actively protected?",
          "expectedStringOutput": "false",
          "acceptableAnswers": [
            "false",
            "editAllowed\":false",
            "No",
            "Blocked"
          ],
          "primaryMisconceptionId": "MC_EX_SPREADSHEET_SECURITY_PROTECTION_AUDITING",
          "diagnosisMap": {
            "true": {
              "misconceptionId": "MC_EX_SPREADSHEET_SECURITY_PROTECTION_AUDITING",
              "errorExplanation": "Locked cells on protected sheets reject edits: editAllowed: false.",
              "recoveryPath": {
                "simplerExplanation": "Type false.",
                "guidedFixPrompt": "Type false"
              }
            }
          }
        }
      },
      {
        "id": "ex-d28-b2-two-step-protection-workflow",
        "day": 28,
        "blockNumber": 2,
        "title": "The 2-Step Protection Invariant: Unlock Inputs First, Then Protect Sheet",
        "conceptBudget": {
          "primaryConcept": "2-Step Protection Invariant",
          "supportingTerms": [
            "2-Step Protection (1. Select assumption input cells $\\to$ Format Cells $\\to$ Uncheck 'Locked'; 2. Review tab $\\to$ Protect Sheet; all other formula cells remain locked automatically)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d28-b1-spreadsheet-protection-gatekeeper",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Protection Workflow Sequence",
            "codeSnippet": "// Step 1: Select Input Cells (e.g. B2:B5) -> Format Cells -> Protection -> UNCHECK [ ] Locked\n// Step 2: Review Ribbon -> Protect Sheet -> Set Password\n// Result: Users can type into B2:B5 while formulas in C2:C100 are completely protected!",
            "lineNotes": {
              "1": "First unlock input cells.",
              "2": "Then lock down worksheet.",
              "3": "Protected outcome."
            }
          },
          {
            "type": "runnable_code",
            "filename": "protection_steps_demo.js",
            "initialCode": "function getProtectionWorkflowStandard() {\n  return 'UNLOCK_INPUT_CELLS_FIRST_BEFORE_ENABLING_WORKSHEET_PROTECTION';\n}\n\nconsole.log(getProtectionWorkflowStandard());",
            "expectedOutput": "UNLOCK_INPUT_CELLS_FIRST_BEFORE_ENABLING_WORKSHEET_PROTECTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What must a financial modeler do to input assumption cells before turning on Sheet Protection?",
          "expectedStringOutput": "UNLOCK_INPUT_CELLS_FIRST_BEFORE_ENABLING_WORKSHEET_PROTECTION",
          "acceptableAnswers": [
            "UNLOCK_INPUT_CELLS_FIRST_BEFORE_ENABLING_WORKSHEET_PROTECTION",
            "Unlock input cells",
            "Uncheck locked"
          ],
          "primaryMisconceptionId": "MC_EX_SPREADSHEET_SECURITY_PROTECTION_AUDITING",
          "diagnosisMap": {
            "HIDE": {
              "misconceptionId": "MC_EX_SPREADSHEET_SECURITY_PROTECTION_AUDITING",
              "errorExplanation": "Hiding hides formulas. Allowing input edits requires UNLOCK_INPUT_CELLS_FIRST_BEFORE_ENABLING_WORKSHEET_PROTECTION.",
              "recoveryPath": {
                "simplerExplanation": "Matches UNLOCK_INPUT_CELLS_FIRST_BEFORE_ENABLING_WORKSHEET_PROTECTION.",
                "guidedFixPrompt": "Type UNLOCK_INPUT_CELLS_FIRST_BEFORE_ENABLING_WORKSHEET_PROTECTION"
              }
            }
          }
        }
      },
      {
        "id": "ex-d28-b3-hidden-formulas-and-workbook-structure",
        "day": 28,
        "blockNumber": 3,
        "title": "Hiding Proprietary Formulas & Protecting Workbook Structure",
        "conceptBudget": {
          "primaryConcept": "Proprietary Formula Hiding Invariant",
          "supportingTerms": [
            "Hidden Formulas (Checking 'Hidden' in Format Cells hides proprietary formula syntax from the formula bar while continuing to display computed values)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d28-b2-two-step-protection-workflow",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "hide_formula_demo.js",
            "initialCode": "function getHiddenFormulaBenefit() {\n  return 'HIDDEN_CHECKBOX_MASKS_FORMULA_SYNTAX_FROM_THE_FORMULA_BAR';\n}\n\nconsole.log(getHiddenFormulaBenefit());",
            "expectedOutput": "HIDDEN_CHECKBOX_MASKS_FORMULA_SYNTAX_FROM_THE_FORMULA_BAR",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What cell protection setting conceals proprietary formula logic from the formula bar while still displaying calculated results?",
          "expectedStringOutput": "HIDDEN_CHECKBOX_MASKS_FORMULA_SYNTAX_FROM_THE_FORMULA_BAR",
          "acceptableAnswers": [
            "HIDDEN_CHECKBOX_MASKS_FORMULA_SYNTAX_FROM_THE_FORMULA_BAR",
            "Hidden",
            "Hidden checkbox"
          ],
          "primaryMisconceptionId": "MC_EX_SPREADSHEET_SECURITY_PROTECTION_AUDITING",
          "diagnosisMap": {
            "LOCKED": {
              "misconceptionId": "MC_EX_SPREADSHEET_SECURITY_PROTECTION_AUDITING",
              "errorExplanation": "Locked prevents edits. Hiding formula text uses HIDDEN_CHECKBOX_MASKS_FORMULA_SYNTAX_FROM_THE_FORMULA_BAR.",
              "recoveryPath": {
                "simplerExplanation": "Matches HIDDEN_CHECKBOX_MASKS_FORMULA_SYNTAX_FROM_THE_FORMULA_BAR.",
                "guidedFixPrompt": "Type HIDDEN_CHECKBOX_MASKS_FORMULA_SYNTAX_FROM_THE_FORMULA_BAR"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "AI in Spreadsheets & Future Trends: Excel Copilot & Python in Excel (`=PY()`)",
    "overviewMetaphor": "Python in Excel (`=PY()`) Is a Supercomputer Engine Swapped into a Familiar Car: You type `=PY()` in any cell, write native Pandas and Seaborn code inside the formula bar, and Microsoft executes the script in secure cloud containers, returning machine learning predictions directly into your spreadsheet grid.",
    "blocks": [
      {
        "id": "ex-d29-b1-python-in-excel-security-auditor",
        "day": 29,
        "blockNumber": 1,
        "title": "Python in Excel (`=PY()`): Cloud Container Isolation & Execution Security",
        "conceptBudget": {
          "primaryConcept": "Python in Excel Execution Sandbox & Security Auditor",
          "supportingTerms": [
            "Python Formula (`=PY()` active)",
            "Isolated Cloud Container (`isIsolated: true`)",
            "Execution Security (`true`)",
            "Status: Python in Excel Execution Secure Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d28-b1-spreadsheet-protection-gatekeeper",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Python in Excel (=PY()) Container Architecture Ledger",
              "boxes": [
                {
                  "label": "Formula Bar Input",
                  "value": "=PY(df = xl('Table1[#All]', headers=True))",
                  "varType": "Python Script",
                  "isUpdated": false
                },
                {
                  "label": "Execution Environment",
                  "value": "Isolated Microsoft Cloud Azure Container (Pandas, NumPy, Scikit-Learn)",
                  "varType": "Sandbox",
                  "isUpdated": false
                },
                {
                  "label": "Security & Return",
                  "value": "Returns DataFrame / Plot to Grid (PYTHON IN EXCEL SECURE NOMINAL!)",
                  "varType": "Security",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "python_excel_demo.js",
            "initialCode": "function auditPythonExcel(isPy, isIsolated) {\n  const ok = isPy && isIsolated;\n  return {\n    isPy,\n    isIsolated,\n    isSecure: ok,\n    status: ok ? 'PYTHON_IN_EXCEL_EXECUTION_SECURE_NOMINAL' : 'EXECUTION_SECURITY_RISK'\n  };\n}\n\nconsole.log(JSON.stringify(auditPythonExcel(true, true)));\nconsole.log(JSON.stringify(auditPythonExcel(true, false)));",
            "expectedOutput": "{\"isPy\":true,\"isIsolated\":true,\"isSecure\":true,\"status\":\"PYTHON_IN_EXCEL_EXECUTION_SECURE_NOMINAL\"}\n{\"isPy\":true,\"isIsolated\":false,\"isSecure\":false,\"status\":\"EXECUTION_SECURITY_RISK\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What formula prefix activates native Python code execution inside Microsoft Excel worksheet cells?",
          "expectedStringOutput": "=PY",
          "acceptableAnswers": [
            "=PY",
            "=PY()",
            "=py",
            "PY"
          ],
          "primaryMisconceptionId": "MC_EX_AI_SPREADSHEETS_COPILOT_PYTHON_EXCEL",
          "diagnosisMap": {
            "=PYTHON": {
              "misconceptionId": "MC_EX_AI_SPREADSHEETS_COPILOT_PYTHON_EXCEL",
              "errorExplanation": "The official formula prefix is `=PY`.",
              "recoveryPath": {
                "simplerExplanation": "Type =PY.",
                "guidedFixPrompt": "Type =PY"
              }
            }
          }
        }
      },
      {
        "id": "ex-d29-b2-microsoft-copilot-in-excel",
        "day": 29,
        "blockNumber": 2,
        "title": "Microsoft 365 Copilot in Excel: Natural Language Formula Generation",
        "conceptBudget": {
          "primaryConcept": "Excel Copilot Invariant",
          "supportingTerms": [
            "Excel Copilot (Allows users to prompt in plain English: 'Highlight top 10% customers by revenue and calculate YoY growth column' requiring Excel Table formatting)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d29-b1-python-in-excel-security-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Copilot Data Requirements",
            "codeSnippet": "// REQUIREMENT: Data MUST be formatted as an official Excel Table (Ctrl + T)\n// PROMPT 1: \"Add a column calculating profit margin percentage\"\n// PROMPT 2: \"Show insights on which product has the highest seasonal variance\"",
            "lineNotes": {
              "1": "Mandatory structured table prerequisite.",
              "2": "Calculated column generation.",
              "3": "Exploratory analytical query."
            }
          },
          {
            "type": "runnable_code",
            "filename": "copilot_demo.js",
            "initialCode": "function getCopilotTablePrerequisite() {\n  return 'EXCEL_COPILOT_REQUIRES_DATA_TO_BE_FORMATTED_AS_AN_OFFICIAL_EXCEL_TABLE';\n}\n\nconsole.log(getCopilotTablePrerequisite());",
            "expectedOutput": "EXCEL_COPILOT_REQUIRES_DATA_TO_BE_FORMATTED_AS_AN_OFFICIAL_EXCEL_TABLE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What data formatting structure is mandatory for Microsoft Copilot in Excel to analyze and add formulas to a dataset?",
          "expectedStringOutput": "EXCEL_COPILOT_REQUIRES_DATA_TO_BE_FORMATTED_AS_AN_OFFICIAL_EXCEL_TABLE",
          "acceptableAnswers": [
            "EXCEL_COPILOT_REQUIRES_DATA_TO_BE_FORMATTED_AS_AN_OFFICIAL_EXCEL_TABLE",
            "Excel Table",
            "Official Excel Table",
            "Table (Ctrl+T)"
          ],
          "primaryMisconceptionId": "MC_EX_AI_SPREADSHEETS_COPILOT_PYTHON_EXCEL",
          "diagnosisMap": {
            "RAW": {
              "misconceptionId": "MC_EX_AI_SPREADSHEETS_COPILOT_PYTHON_EXCEL",
              "errorExplanation": "Raw ranges fail Copilot analysis: EXCEL_COPILOT_REQUIRES_DATA_TO_BE_FORMATTED_AS_AN_OFFICIAL_EXCEL_TABLE.",
              "recoveryPath": {
                "simplerExplanation": "Matches EXCEL_COPILOT_REQUIRES_DATA_TO_BE_FORMATTED_AS_AN_OFFICIAL_EXCEL_TABLE.",
                "guidedFixPrompt": "Type EXCEL_COPILOT_REQUIRES_DATA_TO_BE_FORMATTED_AS_AN_OFFICIAL_EXCEL_TABLE"
              }
            }
          }
        }
      },
      {
        "id": "ex-d29-b3-pandas-dataframe-integration",
        "day": 29,
        "blockNumber": 3,
        "title": "Pandas DataFrames in Excel: `xl('Table1[#All]', headers=True)`",
        "conceptBudget": {
          "primaryConcept": "Pandas DataFrame Integration Invariant",
          "supportingTerms": [
            "`xl()` Function (The bridge function that pulls Excel grid ranges into a native Python Pandas DataFrame in memory)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d29-b2-microsoft-copilot-in-excel",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "xl_bridge_demo.js",
            "initialCode": "function getPythonExcelBridgeFunction() {\n  return 'XL_FUNCTION_BRIDGES_EXCEL_RANGES_INTO_PYTHON_PANDAS_DATAFRAMES';\n}\n\nconsole.log(getPythonExcelBridgeFunction());",
            "expectedOutput": "XL_FUNCTION_BRIDGES_EXCEL_RANGES_INTO_PYTHON_PANDAS_DATAFRAMES",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What built-in function passes Excel worksheet ranges into Python scripts running inside `=PY()` formulas?",
          "expectedStringOutput": "XL_FUNCTION_BRIDGES_EXCEL_RANGES_INTO_PYTHON_PANDAS_DATAFRAMES",
          "acceptableAnswers": [
            "XL_FUNCTION_BRIDGES_EXCEL_RANGES_INTO_PYTHON_PANDAS_DATAFRAMES",
            "xl()",
            "xl",
            "xl function"
          ],
          "primaryMisconceptionId": "MC_EX_AI_SPREADSHEETS_COPILOT_PYTHON_EXCEL",
          "diagnosisMap": {
            "GET": {
              "misconceptionId": "MC_EX_AI_SPREADSHEETS_COPILOT_PYTHON_EXCEL",
              "errorExplanation": "The bridge function is XL_FUNCTION_BRIDGES_EXCEL_RANGES_INTO_PYTHON_PANDAS_DATAFRAMES.",
              "recoveryPath": {
                "simplerExplanation": "Matches XL_FUNCTION_BRIDGES_EXCEL_RANGES_INTO_PYTHON_PANDAS_DATAFRAMES.",
                "guidedFixPrompt": "Type XL_FUNCTION_BRIDGES_EXCEL_RANGES_INTO_PYTHON_PANDAS_DATAFRAMES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Excel & Master Data Analysis Suite",
    "overviewMetaphor": "Day 30 Final Capstone Synthesis: The complete sovereign Excel and master data analysis suite: 1. Spreadsheet Foundations (Grid parsing, SUM/AVERAGE, $A$1 reference locking, and logical IF grading); 2. Advanced Analytics & Lookups (SUMIFS multi-condition filtering, INDEX-MATCH 2D lookups, XLOOKUP fallback handling, Dynamic array FILTER unique spilling, and IFERROR fault tolerance); 3. Business Intelligence & Reporting (Conditional formatting heatmaps, structured tables, Pivot Table aggregations, and multi-pivot interactive slicers); 4. Financial Modeling & What-If (PMT monthly amortization, Goal Seek break-even volume back-solving, and Power Query unpivoting ETL pipelines); 5. Executive Dashboards & Security (KPI metric card variances, sheet formula protection, and Python in Excel integration).",
    "blocks": [
      {
        "id": "ex-d30-b1-sovereign-excel-master-orchestration",
        "day": 30,
        "blockNumber": 1,
        "title": "Sovereign Excel Master Orchestrator: All 5 Enterprise Pillars Active",
        "conceptBudget": {
          "primaryConcept": "Sovereign Excel & Master Data Analysis Suite Orchestrator",
          "supportingTerms": [
            "Pillar 1: Spreadsheet Foundations",
            "Pillar 2: Advanced Analytics & Lookups",
            "Pillar 3: Business Intelligence & Reporting",
            "Pillar 4: Financial Modeling & What-If",
            "Pillar 5: Executive Dashboards & Security",
            "Status: Sovereign Excel and Data Analysis Master Certified Nominal"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d29-b1-python-in-excel-security-auditor",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Sovereign Excel Master Capstone Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "Pillar 1: Spreadsheet Foundations (Grid B12, Sum 152, $A1 locks, Distinction logic)",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Pillar 2: Analytics & Lookups (SUMIFS 4000, INDEX-MATCH 280, XLOOKUP, FILTER unique)",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Pillar 3: BI & Reporting (Conditional formatting, Tables $205, Pivot 60% share, Slicers)",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Pillar 4: Financial & What-If (PMT $599.55, Goal Seek 2000 units, Power Query unpivot)",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Pillar 5: Dashboards & Security (KPI +20.0%, Sheet protection, Python in Excel =PY)",
                  "kind": "process"
                },
                {
                  "id": "6",
                  "label": "Awards SOVEREIGN EXCEL & DATA ANALYSIS MASTER CERTIFICATION!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_orchestrator_demo.js",
            "initialCode": "function orchestrateCapstone(f, a, b, fin, d) {\n  const ok = f && a && b && fin && d;\n  return {\n    foundations: f,\n    analytics: a,\n    bi: b,\n    financial: fin,\n    dashboard: d,\n    certified: ok,\n    status: ok ? 'SOVEREIGN_EXCEL_AND_DATA_ANALYSIS_MASTER_CERTIFIED_NOMINAL' : 'CAPSTONE_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(orchestrateCapstone(true, true, true, true, true)));",
            "expectedOutput": "{\"foundations\":true,\"analytics\":true,\"bi\":true,\"financial\":true,\"dashboard\":true,\"certified\":true,\"status\":\"SOVEREIGN_EXCEL_AND_DATA_ANALYSIS_MASTER_CERTIFIED_NOMINAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What master status confirms complete operational synthesis of the Sovereign Excel & Data Analysis Suite?",
          "expectedStringOutput": "SOVEREIGN_EXCEL_AND_DATA_ANALYSIS_MASTER_CERTIFIED_NOMINAL",
          "acceptableAnswers": [
            "SOVEREIGN_EXCEL_AND_DATA_ANALYSIS_MASTER_CERTIFIED_NOMINAL",
            "status\":\"SOVEREIGN_EXCEL_AND_DATA_ANALYSIS_MASTER_CERTIFIED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_EX_CAPSTONE_SOVEREIGN_EXCEL_DATA_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_EX_CAPSTONE_SOVEREIGN_EXCEL_DATA_SUITE",
              "errorExplanation": "Matches SOVEREIGN_EXCEL_AND_DATA_ANALYSIS_MASTER_CERTIFIED_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type SOVEREIGN_EXCEL_AND_DATA_ANALYSIS_MASTER_CERTIFIED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "ex-d30-b2-sovereign-excel-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Sovereign Excel Master Audit & Quality Metric Verification",
        "conceptBudget": {
          "primaryConcept": "Sovereign Excel Quality Audit",
          "supportingTerms": [
            "100/100 Quality Score",
            "Zero Flaws Invariant",
            "All 30 Days Verified"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d30-b1-sovereign-excel-master-orchestration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_audit_demo.js",
            "initialCode": "function auditFullSuite() {\n  return {\n    totalDays: 30,\n    totalBlocks: 90,\n    singleBlockDays: 0,\n    examAssertions: 60,\n    score: '100/100',\n    grade: 'SOVEREIGN_EXCEL_MASTER_AUDIT_PASSED_100_PERCENT'\n  };\n}\n\nconsole.log(JSON.stringify(auditFullSuite()));",
            "expectedOutput": "{\"totalDays\":30,\"totalBlocks\":90,\"singleBlockDays\":0,\"examAssertions\":60,\"score\":\"100/100\",\"grade\":\"SOVEREIGN_EXCEL_MASTER_AUDIT_PASSED_100_PERCENT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade confirms 100/100 quality score across all 30 days and 90 micro-learning blocks?",
          "expectedStringOutput": "SOVEREIGN_EXCEL_MASTER_AUDIT_PASSED_100_PERCENT",
          "acceptableAnswers": [
            "SOVEREIGN_EXCEL_MASTER_AUDIT_PASSED_100_PERCENT",
            "grade\":\"SOVEREIGN_EXCEL_MASTER_AUDIT_PASSED_100_PERCENT\""
          ],
          "primaryMisconceptionId": "MC_EX_CAPSTONE_SOVEREIGN_EXCEL_DATA_SUITE",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_EX_CAPSTONE_SOVEREIGN_EXCEL_DATA_SUITE",
              "errorExplanation": "All checks passing awards SOVEREIGN_EXCEL_MASTER_AUDIT_PASSED_100_PERCENT.",
              "recoveryPath": {
                "simplerExplanation": "Awards SOVEREIGN_EXCEL_MASTER_AUDIT_PASSED_100_PERCENT.",
                "guidedFixPrompt": "Type SOVEREIGN_EXCEL_MASTER_AUDIT_PASSED_100_PERCENT"
              }
            }
          }
        }
      },
      {
        "id": "ex-d30-b3-capstone-excel-final-cert",
        "day": 30,
        "blockNumber": 3,
        "title": "Sovereign Excel & Master Data Analysis Final Platform Certification",
        "conceptBudget": {
          "primaryConcept": "Final Platform Certification",
          "supportingTerms": [
            "Certified Sovereign Excel Master",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "ex-d30-b2-sovereign-excel-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "final_excel_cert.js",
            "initialCode": "console.log('🏆 FINAL CAPSTONE: Sovereign Excel & Master Data Analysis Suite [VERIFIED 100%]');",
            "expectedOutput": "🏆 FINAL CAPSTONE: Sovereign Excel & Master Data Analysis Suite [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms final Day 30 Capstone completion?",
          "expectedStringOutput": "🏆 FINAL CAPSTONE: Sovereign Excel & Master Data Analysis Suite [VERIFIED 100%]",
          "acceptableAnswers": [
            "🏆 FINAL CAPSTONE: Sovereign Excel & Master Data Analysis Suite [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_EX_CAPSTONE_SOVEREIGN_EXCEL_DATA_SUITE",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_EX_CAPSTONE_SOVEREIGN_EXCEL_DATA_SUITE",
              "errorExplanation": "Matches capstone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type 🏆 FINAL CAPSTONE: Sovereign Excel & Master Data Analysis Suite [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  }
];
