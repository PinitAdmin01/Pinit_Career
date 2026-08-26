import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const EXCEL_DATA_VIZ_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Spreadsheet Grid Architecture: Cells, 2D Coordinates & Data Types",
    "desc": "Master the fundamental coordinate geometry of modern spreadsheets: 2D Grid Spaces (Columns $A$ to $XFD = 16,384$ columns, Rows $1$ to $1,048,576 = 17.1\\text{ billion cells}$), Native Data Types (Strings, Integers, Floats, Booleans, Error objects, and Serial Date integers), and Formula Execution syntax (`=` prefix).",
    "syllabus": [
      "2D grid coordinates and addressing geometry.",
      "Spreadsheet data types and type coercion rules.",
      "Formula syntax, operator precedence, and evaluation lifecycles."
    ],
    "eTitle": "Spreadsheet Cell Coordinate & Address Range Parser",
    "eDesc": "Implement function parseCellCoordinate(cellRefString) parsing standard alphanumeric cell references (e.g. `'B12'`) into 0-indexed `{ colIndex: 1, rowIndex: 11, colLetter: 'B', rowNumber: 12 }`.",
    "eStarter": "function parseCellCoordinate(ref) {\n  const match = ref.match(/^([A-Za-z]+)(\\d+)$/);\n  if (!match) throw new Error('Invalid cell reference');\n  const colLetter = match[1].toUpperCase();\n  const rowNumber = parseInt(match[2], 10);\n  let colIndex = 0;\n  for (let i = 0; i < colLetter.length; i++) {\n    colIndex = colIndex * 26 + (colLetter.charCodeAt(i) - 64);\n  }\n  return {\n    cellRef: ref.toUpperCase(),\n    colLetter,\n    rowNumber,\n    colIndex: colIndex - 1,\n    rowIndex: rowNumber - 1,\n    isValidGridAddress: true,\n    status: 'CELL_COORDINATE_PARSED_NOMINAL'\n  };\n}",
    "eHint": "Match regex /^([A-Za-z]+)(\\d+)$/, convert column letter base-26 to index.",
    "eTest": "const b12 = parseCellCoordinate('B12');\nconst aa1 = parseCellCoordinate('AA1'); // 'AA' = 27 -> colIndex 26, rowIndex 0\nif (b12.colIndex !== 1 || b12.rowIndex !== 11 || aa1.colIndex !== 26 || aa1.rowIndex !== 0 || b12.status !== 'CELL_COORDINATE_PARSED_NOMINAL') throw new Error('Cell coordinate parsing failed');",
    "aTitle": "Total Columns in Standard Excel Grid Formatter",
    "aDesc": "Implement function getTotalExcelColumnsCount() returning `16384`.",
    "aStarter": "function getTotalExcelColumnsCount() {\n  // Write your answer here\n}",
    "aHint": "Return 16384.",
    "aTest": "if (getTotalExcelColumnsCount() !== 16384) throw new Error('Columns count check failed');"
  },
  {
    "day": 2,
    "title": "Core Mathematical & Aggregation Functions: `SUM`, `AVERAGE`, `COUNT` & `ROUND`",
    "desc": "Compute robust descriptive statistics across numerical column vectors: `SUM(range)`, `AVERAGE(range)` ($\\bar{x} = \\frac{\\sum x_i}{N}$), `COUNT(range)` (Numerical cells only), `COUNTA(range)` (Non-empty cells including strings), `MIN(range)`, `MAX(range)`, and `ROUND(val, 2)` ($Round = \\text{Math.round}(val \\times 100) / 100$).",
    "syllabus": [
      "Core mathematical aggregation functions across numerical arrays.",
      "Differences between numerical COUNT vs non-empty COUNTA.",
      "Precision rounding and floating-point decimal calibration."
    ],
    "eTitle": "Spreadsheet Aggregation Engine & Descriptive Statistics Calculator",
    "eDesc": "Implement function calculateSpreadsheetAggregations(numbersArray) returning `{ sum, average, count, min, max, roundedAverage }`.",
    "eStarter": "function calculateSpreadsheetAggregations(arr) {\n  if (!arr || arr.length === 0) throw new Error('Array empty');\n  const sum = arr.reduce((acc, n) => acc + n, 0);\n  const avg = sum / arr.length;\n  const min = Math.min(...arr);\n  const max = Math.max(...arr);\n  return {\n    count: arr.length,\n    sum: Number(sum.toFixed(2)),\n    average: Number(avg.toFixed(4)),\n    roundedAverage: Number(avg.toFixed(2)),\n    min,\n    max,\n    status: 'AGGREGATIONS_COMPUTED_NOMINAL'\n  };\n}",
    "eHint": "Calculate sum, avg = sum/len, min, max, and roundedAverage = Number(avg.toFixed(2)).",
    "eTest": "const data = [10.5, 20.25, 30.75, 40.0, 50.5]; // sum = 152.0, avg = 30.4\nconst res = calculateSpreadsheetAggregations(data);\nif (res.sum !== 152.0 || res.count !== 5 || res.roundedAverage !== 30.4 || res.min !== 10.5 || res.max !== 50.5 || res.status !== 'AGGREGATIONS_COMPUTED_NOMINAL') throw new Error('Aggregation calculation failed');",
    "aTitle": "Spreadsheet Formula Prefix Character Formatter",
    "aDesc": "Implement function getFormulaPrefixChar() returning `'='`.",
    "aStarter": "function getFormulaPrefixChar() {\n  // Write your answer here\n}",
    "aHint": "All Excel formulas begin with '=' — this prefix signals the cell contains a computed expression, not static text or a number.",
    "aTest": "if (getFormulaPrefixChar() !== '=') throw new Error('Prefix check failed');"
  },
  {
    "day": 3,
    "title": "Cell Referencing Mechanics: Relative (`A1`), Absolute (`$A$1`) & Mixed (`$A1`)",
    "desc": "Control formula propagation across rows and columns: Relative Referencing (`A1` shifts both column and row when dragged), Absolute Referencing (`$A$1` permanently locks both coordinates), and Mixed Referencing (`$A1` locks column $A$ while allowing row progression; `A$1` locks row $1$ while allowing column progression).",
    "syllabus": [
      "Mechanics of the dollar sign `$` coordinate lock anchor.",
      "Relative, absolute, and mixed referencing behavior during formula autofill.",
      "Designing multi-column multiplication and tax tables using mixed references."
    ],
    "eTitle": "Formula Cell Reference Transformation & Lock Simulator",
    "eDesc": "Implement function shiftCellReference(originalRef, rowDelta, colDelta) simulating how a formula reference adapts when dragged across the grid.",
    "eStarter": "function shiftCellReference(ref, rowDelta, colDelta) {\n  const match = ref.match(/^(\\$?)([A-Za-z]+)(\\$?)(\\d+)$/);\n  if (!match) throw new Error('Invalid reference');\n  const hasColLock = match[1] === '$';\n  let colLetters = match[2].toUpperCase();\n  const hasRowLock = match[3] === '$';\n  let rowNum = parseInt(match[4], 10);\n  if (!hasRowLock) rowNum += rowDelta;\n  if (!hasColLock) {\n    let colIdx = 0;\n    for (let i = 0; i < colLetters.length; i++) colIdx = colIdx * 26 + (colLetters.charCodeAt(i) - 64);\n    colIdx += colDelta;\n    let temp = '', n = colIdx;\n    while (n > 0) {\n      let rem = (n - 1) % 26;\n      temp = String.fromCharCode(65 + rem) + temp;\n      n = Math.floor((n - 1) / 26);\n    }\n    colLetters = temp;\n  }\n  return (hasColLock ? '$' : '') + colLetters + (hasRowLock ? '$' : '') + rowNum;\n}",
    "eHint": "Respect $ locks on columns and rows during coordinate shifting.",
    "eTest": "const rel = shiftCellReference('A1', 2, 1);    // -> 'B3'\nconst abs = shiftCellReference('$A$1', 2, 1);  // -> '$A$1'\nconst mixCol = shiftCellReference('$A1', 2, 1); // -> '$A3'\nconst mixRow = shiftCellReference('A$1', 2, 1); // -> 'B$1'\nif (rel !== 'B3' || abs !== '$A$1' || mixCol !== '$A3' || mixRow !== 'B$1') throw new Error('Cell reference shifting failed');",
    "aTitle": "Absolute Reference Lock Symbol Formatter",
    "aDesc": "Implement function getAbsoluteLockSymbol() returning `'$'`.",
    "aStarter": "function getAbsoluteLockSymbol() {\n  // Write your answer here\n}",
    "aHint": "The '$' locks a reference axis: $A$1 locks both row and column, A$1 locks the row only, $A1 locks the column — press F4 to cycle through all four locking modes.",
    "aTest": "if (getAbsoluteLockSymbol() !== '$') throw new Error('Lock symbol check failed');"
  },
  {
    "day": 4,
    "title": "Logical Evaluation Functions: Single `IF`, Nested `IF` & Multi-Condition `AND`/`OR`",
    "desc": "Implement complex business rules and decision trees: Single `IF(condition, value_if_true, value_if_false)`, Nested `IF` statements (Grading tiers: $\\ge 90 \\implies A, \\ge 80 \\implies B, \\ge 70 \\implies C, \\text{else } F$), and Multi-Condition Boolean functions (`AND(c1, c2)`, `OR(c1, c2)`, `NOT(c)`).",
    "syllabus": [
      "Truth table evaluation and branching logic in spreadsheet formulas.",
      "Structuring clean multi-tier nested IF statements.",
      "Combining logical AND / OR operators for compound validation."
    ],
    "eTitle": "Spreadsheet Logical Tier Classifier & Multi-Condition Evaluator",
    "eDesc": "Implement function evaluatePerformanceTier(score, attendancePct, hasViolation) returning performance classification (`'DISTINCTION'`, `'PASS'`, or `'FAIL'`).",
    "eStarter": "function evaluatePerformanceTier(score, attendance, violation) {\n  if (violation || attendance < 75) {\n    return { tier: 'FAIL', isQualified: false, status: 'PERFORMANCE_EVALUATED_FAIL' };\n  }\n  if (score >= 90 && attendance >= 90) {\n    return { tier: 'DISTINCTION', isQualified: true, status: 'PERFORMANCE_EVALUATED_DISTINCTION' };\n  }\n  if (score >= 70) {\n    return { tier: 'PASS', isQualified: true, status: 'PERFORMANCE_EVALUATED_PASS' };\n  }\n  return { tier: 'FAIL', isQualified: false, status: 'PERFORMANCE_EVALUATED_FAIL' };\n}",
    "eHint": "Distinction if score >= 90 & attendance >= 90 without violations. Pass if score >= 70 & attendance >= 75.",
    "eTest": "const dist = evaluatePerformanceTier(95, 92, false);\nconst pass = evaluatePerformanceTier(75, 80, false);\nconst fail = evaluatePerformanceTier(95, 92, true); // violation -> FAIL\nif (dist.tier !== 'DISTINCTION' || !dist.isQualified || pass.tier !== 'PASS' || fail.tier !== 'FAIL' || fail.isQualified) throw new Error('Logical evaluation failed');",
    "aTitle": "Excel Logical Function Name Formatter",
    "aDesc": "Implement function getExcelLogicalFunctionName() returning `'IF'`.",
    "aStarter": "function getExcelLogicalFunctionName() {\n  // Write your answer here\n}",
    "aHint": "Excel's primary conditional function is IF — syntax: =IF(logical_test, value_if_true, value_if_false). Nested IFs handle multiple branches.",
    "aTest": "if (getExcelLogicalFunctionName() !== 'IF') throw new Error('Function check failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Spreadsheet Grid Architecture, Aggregation & Logical Evaluation Engine",
    "desc": "Milestone 1: Build a complete foundational spreadsheet computation engine: Grid coordinate parsing (`B12` $\\to$ row 11, col 1), Descriptive statistics aggregation ($Sum = 152.0, Avg = 30.4$), Cell referencing lock shifts (`$A1` $\\to$ `$A3`), and Logical performance grading (Distinction qualification).",
    "syllabus": [
      "Synthesis of grid architecture, mathematical aggregations, reference locking, and logical branching.",
      "Foundational spreadsheet computation engine validation.",
      "Milestone 1 certification."
    ],
    "eTitle": "Spreadsheet Foundations Master Kernel",
    "eDesc": "Implement function executeSpreadsheetFoundationsKernel(gridOk, aggOk, refOk, logicOk) certifying combined spreadsheet foundations execution.",
    "eStarter": "function executeSpreadsheetFoundationsKernel(grid, agg, ref, logic) {\n  const isNominal = grid && agg && ref && logic;\n  return {\n    gridCoordinatesParsed: grid,\n    aggregationsComputed: agg,\n    referencingLocksVerified: ref,\n    logicalTiersEvaluated: logic,\n    foundationsCertified: isNominal,\n    engineStatus: isNominal ? 'SPREADSHEET_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL' : 'SPREADSHEET_FOUNDATIONS_DEFECT'\n  };\n}",
    "eHint": "Verify inputs and return active status.",
    "eTest": "const res = executeSpreadsheetFoundationsKernel(true, true, true, true);\nif (res.engineStatus !== 'SPREADSHEET_FOUNDATIONS_KERNEL_ACTIVE_NOMINAL') throw new Error('Milestone 1 kernel failed');",
    "aTitle": "Spreadsheet Foundations Status Formatter",
    "aDesc": "Implement function formatSpreadsheetFoundationsStatus(ok) returning `SPREADSHEET_FOUNDATIONS_${ok ? 'ACTIVE' : 'OFFLINE'}`.",
    "aStarter": "function formatSpreadsheetFoundationsStatus(o) { return `SPREADSHEET_FOUNDATIONS_${o ? 'ACTIVE' : 'OFFLINE'}`; }",
    "aHint": "Format status.",
    "aTest": "if (formatSpreadsheetFoundationsStatus(true) !== 'SPREADSHEET_FOUNDATIONS_ACTIVE') throw new Error('Status check failed');"
  },
  {
    "day": 6,
    "title": "Statistical Conditional Aggregations: `SUMIF`, `SUMIFS`, `COUNTIF` & `AVERAGEIFS`",
    "desc": "Aggregate subsets of data meeting multiple criteria: Single-criterion `SUMIF(range, criteria, sum_range)`, `COUNTIF(range, criteria)`, Multi-criteria `SUMIFS(sum_range, criteria_range1, crit1, criteria_range2, crit2)`, `COUNTIFS(...)`, and `AVERAGEIFS(...)` across large transaction databases.",
    "syllabus": [
      "Conditional filtering syntax with comparison operators (`\">=100\"`, `\"*Enterprise*\"`).",
      "Argument ordering differences between single-criterion SUMIF vs multi-criteria SUMIFS.",
      "Multi-dimensional business metric calculation across regions and quarters."
    ],
    "eTitle": "Multi-Criteria Conditional Aggregation Engine (`SUMIFS` / `COUNTIFS`)",
    "eDesc": "Implement function executeSumifs(recordsArray, filterRegion, minAmount) aggregating total sales amount and count for records matching the target region and minimum transaction threshold.",
    "eStarter": "function executeSumifs(records, region, minAmount) {\n  const filtered = records.filter(r => r.region === region && r.amount >= minAmount);\n  const sum = filtered.reduce((acc, r) => acc + r.amount, 0);\n  return {\n    regionFilter: region,\n    minAmountFilter: minAmount,\n    matchedCount: filtered.length,\n    totalAmountSum: Number(sum.toFixed(2)),\n    averageAmount: filtered.length > 0 ? Number((sum / filtered.length).toFixed(2)) : 0,\n    status: 'SUMIFS_CONDITIONAL_AGGREGATION_COMPUTED_NOMINAL'\n  };\n}",
    "eHint": "Filter records by region and amount >= minAmount, calculate sum and count.",
    "eTest": "const data = [\n  { id: 1, region: 'NORTH', amount: 500 },\n  { id: 2, region: 'NORTH', amount: 1500 },\n  { id: 3, region: 'SOUTH', amount: 2000 },\n  { id: 4, region: 'NORTH', amount: 2500 }\n];\nconst res = executeSumifs(data, 'NORTH', 1000); // 1500 + 2500 = 4000, count = 2\nif (res.matchedCount !== 2 || res.totalAmountSum !== 4000.0 || res.averageAmount !== 2000.0 || res.status !== 'SUMIFS_CONDITIONAL_AGGREGATION_COMPUTED_NOMINAL') throw new Error('SUMIFS calculation failed');",
    "aTitle": "Multi-Criteria Excel Aggregation Function Name Formatter",
    "aDesc": "Implement function getMultiCriteriaSumFunction() returning `'SUMIFS'`.",
    "aStarter": "function getMultiCriteriaSumFunction() {\n  // Write your answer here\n}",
    "aHint": "Return SUMIFS.",
    "aTest": "if (getMultiCriteriaSumFunction() !== 'SUMIFS') throw new Error('Function check failed');"
  },
  {
    "day": 7,
    "title": "Text Manipulation & Cleaning Functions: `TRIM`, `CLEAN`, `PROPER` & `TEXTJOIN`",
    "desc": "Cleanse dirty string data imported from enterprise ERP systems: `TRIM(text)` (Removes leading, trailing, and excessive spaces), `CLEAN(text)` (Removes non-printable ASCII 0-31 characters), `PROPER(text)` (Capitalizes First Letter Of Each Word), `UPPER`/`LOWER`, and `TEXTJOIN(delimiter, ignore_empty, range)`.",
    "syllabus": [
      "Cleaning whitespace, tabs, and non-printable characters from raw data feeds.",
      "Case conversions and text formatting standardization.",
      "String slicing and multi-cell text concatenation with delimiters."
    ],
    "eTitle": "Spreadsheet Data Cleansing & Text Sanitization Pipeline",
    "eDesc": "Implement function cleanseSpreadsheetText(rawText) trimming redundant spaces, converting to proper title case, and returning clean string metrics.",
    "eStarter": "function cleanseSpreadsheetText(raw) {\n  const trimmed = raw.trim().replace(/\\s+/g, ' ');\n  const proper = trimmed.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');\n  return {\n    originalLength: raw.length,\n    cleansedLength: proper.length,\n    cleansedText: proper,\n    spacesRemovedCount: raw.length - proper.length,\n    status: 'TEXT_CLEANSED_PROPER_CASE_NOMINAL'\n  };\n}",
    "eHint": "Trim, replace multiple spaces with single space, convert to Title Case.",
    "eTest": "const raw = '   john   DOE   ';\nconst res = cleanseSpreadsheetText(raw);\nif (res.cleansedText !== 'John Doe' || res.spacesRemovedCount <= 0 || res.status !== 'TEXT_CLEANSED_PROPER_CASE_NOMINAL') throw new Error('Text cleansing failed');",
    "aTitle": "Whitespace Removal Function Name Formatter",
    "aDesc": "Implement function getTrimFunctionName() returning `'TRIM'`.",
    "aStarter": "function getTrimFunctionName() {\n  // Write your answer here\n}",
    "aHint": "Return TRIM.",
    "aTest": "if (getTrimFunctionName() !== 'TRIM') throw new Error('Function check failed');"
  },
  {
    "day": 8,
    "title": "Date & Time Calculation Mechanics: Excel Serial Numbers, `DATEDIF` & `EOMONTH`",
    "desc": "Calculate calendar and business day intervals: Excel Date Serial Numbers (Continuous integer count of days since 1900-01-01 where Jan 1 1900 = 1, Jan 1 2026 = 46,023), `TODAY()`, `NOW()`, `DATEDIF(start, end, \"D\"|\"M\"|\"Y\")`, `EOMONTH(date, months)` (End of month), and `WORKDAY(start, days)`.",
    "syllabus": [
      "The underlying mathematical serial number model of spreadsheet dates.",
      "Calculating elapsed days, months, and years using DATEDIF.",
      "Project milestone forecasting using business day WORKDAY calculations."
    ],
    "eTitle": "Excel Serial Date & Elapsed Days Difference Calculator",
    "eDesc": "Implement function calculateDateInterval(startDateStr, endDateStr) parsing ISO dates (`YYYY-MM-DD`) and calculating elapsed calendar days ($Days = \\frac{\\text{End} - \\text{Start}}{86,400,000}$).",
    "eStarter": "function calculateDateInterval(startStr, endStr) {\n  const d1 = new Date(startStr);\n  const d2 = new Date(endStr);\n  const diffMs = d2.getTime() - d1.getTime();\n  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));\n  return {\n    startDate: startStr,\n    endDate: endStr,\n    elapsedCalendarDays: days,\n    isPositiveInterval: days >= 0,\n    status: 'DATE_INTERVAL_CALCULATED_NOMINAL'\n  };\n}",
    "eHint": "Parse dates, subtract epoch timestamps, divide by 86,400,000 ms.",
    "eTest": "const res = calculateDateInterval('2026-01-01', '2026-01-31');\nif (res.elapsedCalendarDays !== 30 || !res.isPositiveInterval || res.status !== 'DATE_INTERVAL_CALCULATED_NOMINAL') throw new Error('Date calculation failed');",
    "aTitle": "Excel Date Serial Number Base Year Formatter",
    "aDesc": "Implement function getExcelBaseYear() returning `1900`.",
    "aStarter": "function getExcelBaseYear() {\n  // Write your answer here\n}",
    "aHint": "Return 1900.",
    "aTest": "if (getExcelBaseYear() !== 1900) throw new Error('Base year check failed');"
  },
  {
    "day": 9,
    "title": "Classic Lookup Functions: `VLOOKUP` (Exact Match `FALSE` / `0`), `HLOOKUP` & `#N/A`",
    "desc": "Search database tables using classic spreadsheet lookups: `VLOOKUP(lookup_value, table_array, col_index, [range_lookup])` (The mandatory `FALSE` / `0` parameter for exact matches, Left-to-right limitation), `HLOOKUP(range)` for horizontal tables, and Trapping `#N/A` errors.",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Classic Lookup Functions: `VLOOKUP` (Exact Match `FALSE` / `0`), `HLOOKUP` & `#N/A`.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "VLOOKUP Exact Match Table Search Simulator",
    "eDesc": "Implement function executeVlookup(tableRecords, lookupKey, targetColumnKey) looking up records by primary key and returning target field value with `#N/A` handling.",
    "eStarter": "function executeVlookup(records, key, targetCol) {\n  const match = records.find(r => r.id === key);\n  if (!match) return { found: false, result: '#N/A', status: 'LOOKUP_KEY_NOT_FOUND' };\n  return { found: true, result: match[targetCol], status: 'VLOOKUP_EXACT_MATCH_RESOLVED_NOMINAL' };\n}",
    "eHint": "Find record where r.id === key, return result or '#N/A'.",
    "eTest": "const db = [{ id: 101, name: 'Alice', role: 'Engineer' }, { id: 102, name: 'Bob', role: 'Designer' }];\nconst res = executeVlookup(db, 101, 'role');\nconst fail = executeVlookup(db, 999, 'role');\nif (!res.found || res.result !== 'Engineer' || fail.found || fail.result !== '#N/A') throw new Error('VLOOKUP failed');",
    "aTitle": "VLOOKUP Exact Match Parameter Flag Formatter",
    "aDesc": "Implement function getVlookupExactMatchFlag() returning `'FALSE'`.",
    "aStarter": "function getVlookupExactMatchFlag() {\n  // Write your answer here\n}",
    "aHint": "Return FALSE.",
    "aTest": "if (getVlookupExactMatchFlag() !== 'FALSE') throw new Error('Flag check failed');"
  },
  {
    "day": 10,
    "title": "Advanced Two-Way Lookups: `INDEX` & `MATCH` Dynamic Matrix Retrieval",
    "desc": "Overcome VLOOKUP limitations with the gold-standard lookup duo: `MATCH(lookup_value, lookup_array, 0)` (Finds relative row/column position integer), `INDEX(array, row_num, [col_num])` (Retrieves value at specified coordinate), Leftward Lookups, and `INDEX-MATCH-MATCH` 2D matrix lookups.",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Advanced Two-Way Lookups: `INDEX` & `MATCH` Dynamic Matrix Retrieval.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Two-Way `INDEX-MATCH` 2D Matrix Lookup Engine",
    "eDesc": "Implement function executeIndexMatch2D(matrixValues, rowHeaders, colHeaders, targetRow, targetCol) retrieving exact intersection values.",
    "eStarter": "function executeIndexMatch2D(matrix, rows, cols, rTarget, cTarget) {\n  const rIdx = rows.indexOf(rTarget);\n  const cIdx = cols.indexOf(cTarget);\n  if (rIdx === -1 || cIdx === -1) return { found: false, value: '#N/A', status: 'NOT_FOUND' };\n  return { rowMatchedIndex: rIdx, colMatchedIndex: cIdx, found: true, value: matrix[rIdx][cIdx], status: 'INDEX_MATCH_TWO_WAY_RESOLVED_NOMINAL' };\n}",
    "eHint": "Find row and col index, return matrix[rIdx][cIdx].",
    "eTest": "const rows = ['Q1', 'Q2', 'Q3', 'Q4'];\nconst cols = ['NORTH', 'SOUTH', 'EAST'];\nconst matrix = [[100, 200, 300], [150, 250, 350], [180, 280, 380], [220, 320, 420]];\nconst res = executeIndexMatch2D(matrix, rows, cols, 'Q3', 'SOUTH'); // 280\nif (!res.found || res.value !== 280 || res.status !== 'INDEX_MATCH_TWO_WAY_RESOLVED_NOMINAL') throw new Error('INDEX-MATCH failed');",
    "aTitle": "MATCH Exact Match Type Parameter Formatter",
    "aDesc": "Implement function getMatchExactType() returning `0`.",
    "aStarter": "function getMatchExactType() {\n  // Write your answer here\n}",
    "aHint": "Pass 0 as MATCH's third argument for exact matching; 1 finds the largest value ≤ lookup (sorted ascending); -1 finds smallest ≥ lookup (sorted descending).",
    "aTest": "if (getMatchExactType() !== 0) throw new Error('Type check failed');"
  },
  {
    "day": 11,
    "title": "Modern Universal Lookup Function: `XLOOKUP` (Leftward, Defaults & Search Modes)",
    "desc": "Master the all-in-one replacement for VLOOKUP and INDEX-MATCH: `XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])` (Native leftward lookups, default exact match, built-in fallback error text, horizontal/vertical flexibility, and reverse bottom-to-top searching).",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Modern Universal Lookup Function: `XLOOKUP` (Leftward, Defaults & Search Modes).",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Modern `XLOOKUP` Universal Lookup Simulator with Fallback Handling",
    "eDesc": "Implement function executeXlookup(lookupArray, returnArray, targetValue, fallbackValue) performing exact match lookup with fallback string.",
    "eStarter": "function executeXlookup(lookups, returns, target, fallback) {\n  const idx = lookups.indexOf(target);\n  const val = idx !== -1 ? returns[idx] : (fallback !== undefined ? fallback : '#N/A');\n  return {\n    targetLookedUp: target,\n    matchedIndex: idx,\n    isFound: idx !== -1,\n    returnValue: val,\n    status: idx !== -1 ? 'XLOOKUP_EXACT_MATCH_RESOLVED_NOMINAL' : 'XLOOKUP_FALLBACK_APPLIED'\n  };\n}",
    "eHint": "indexOf target in lookups, return returns[idx] or fallback.",
    "eTest": "const ids = [101, 102, 103];\nconst names = ['Alice', 'Bob', 'Charlie'];\nconst found = executeXlookup(ids, names, 102, 'Not Found');\nconst missing = executeXlookup(ids, names, 999, 'Employee Not Found');\nif (found.returnValue !== 'Bob' || !found.isFound || missing.returnValue !== 'Employee Not Found' || missing.isFound) throw new Error('XLOOKUP failed');",
    "aTitle": "Modern Excel Universal Lookup Function Name Formatter",
    "aDesc": "Implement function getXlookupFunctionName() returning `'XLOOKUP'`.",
    "aStarter": "function getXlookupFunctionName() {\n  // Write your answer here\n}",
    "aHint": "Return XLOOKUP.",
    "aTest": "if (getXlookupFunctionName() !== 'XLOOKUP') throw new Error('Function check failed');"
  },
  {
    "day": 12,
    "title": "Dynamic Array Formulas & Spill Ranges: `FILTER`, `UNIQUE`, `SORT` & `#SPILL!`",
    "desc": "Harness the modern calculation engine: Dynamic Arrays (`=FILTER(range, include_condition)`, `=UNIQUE(range)`, `=SORT(range, sort_col, sort_order)`, `=SEQUENCE(rows)`), The Spill Operator (`#`), and Resolving `#SPILL!` blocking collisions.",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Dynamic Array Formulas & Spill Ranges: `FILTER`, `UNIQUE`, `SORT` & `#SPILL!`.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Dynamic Array `FILTER` and `UNIQUE` Aggregation Engine",
    "eDesc": "Implement function executeDynamicArrayFilter(records, filterCategory) extracting distinct unique names matching the category and returning sorted array.",
    "eStarter": "function executeDynamicArrayFilter(records, cat) {\n  const matched = records.filter(r => r.category === cat).map(r => r.name);\n  const unique = Array.from(new Set(matched)).sort();\n  return {\n    filterCategory: cat,\n    spillCount: unique.length,\n    spilledArray: unique,\n    status: 'DYNAMIC_ARRAY_FILTER_UNIQUE_SPILLED_NOMINAL'\n  };\n}",
    "eHint": "Filter by category, map names, new Set() for unique, and .sort().",
    "eTest": "const data = [\n  { category: 'TECH', name: 'Bob' },\n  { category: 'TECH', name: 'Alice' },\n  { category: 'SALES', name: 'Charlie' },\n  { category: 'TECH', name: 'Alice' }\n];\nconst res = executeDynamicArrayFilter(data, 'TECH'); // ['Alice', 'Bob']\nif (res.spillCount !== 2 || res.spilledArray[0] !== 'Alice' || res.spilledArray[1] !== 'Bob' || res.status !== 'DYNAMIC_ARRAY_FILTER_UNIQUE_SPILLED_NOMINAL') throw new Error('Dynamic array failed');",
    "aTitle": "Dynamic Array Spill Operator Character Formatter",
    "aDesc": "Implement function getSpillOperatorChar() returning `'#'`.",
    "aStarter": "function getSpillOperatorChar() {\n  // Write your answer here\n}",
    "aHint": "The '#' spill operator references an entire dynamic array range — =A1# expands automatically to cover all values spilled by A1, even as the source formula output grows.",
    "aTest": "if (getSpillOperatorChar() !== '#') throw new Error('Spill operator check failed');"
  },
  {
    "day": 13,
    "title": "Error Trapping & Formula Debugging: `IFERROR`, `IFNA`, `#DIV/0!` & Precedents",
    "desc": "Build resilient financial and operational models: Common Spreadsheet Errors (`#DIV/0!`, `#VALUE!`, `#REF!`, `#NAME?`, `#N/A`, `#NULL!`), Fault-Tolerant Trapping (`IFERROR(formula, fallback)`, `IFNA(lookup, fallback)`), and Formula Auditing Tools (Trace Precedents `Ctrl + [`, Trace Dependents `Ctrl + ]`, Evaluate Formula).",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Error Trapping & Formula Debugging: `IFERROR`, `IFNA`, `#DIV/0!` & Precedents.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Spreadsheet Error Trapper & Division-by-Zero Defense Guard",
    "eDesc": "Implement function safeSpreadsheetDivision(numerator, denominator, fallbackValue) returning division result or safe fallback without throwing `#DIV/0!`.",
    "eStarter": "function safeSpreadsheetDivision(num, den, fallback) {\n  if (den === 0 || isNaN(den) || isNaN(num)) {\n    return { result: fallback, isErrorTrapped: true, errorType: '#DIV/0!', status: 'ERROR_TRAPPED_SAFE_FALLBACK_APPLIED' };\n  }\n  const val = num / den;\n  return { result: Number(val.toFixed(2)), isErrorTrapped: false, status: 'CALCULATION_SUCCESS_NOMINAL' };\n}",
    "eHint": "If den === 0, return fallback with isErrorTrapped: true.",
    "eTest": "const valid = safeSpreadsheetDivision(100, 4, 0);\nconst divZero = safeSpreadsheetDivision(100, 0, 0);\nif (valid.result !== 25.0 || valid.isErrorTrapped || divZero.result !== 0 || !divZero.isErrorTrapped || divZero.errorType !== '#DIV/0!') throw new Error('Error trapping failed');",
    "aTitle": "Universal Spreadsheet Error Trapping Function Name Formatter",
    "aDesc": "Implement function getIferrorFunctionName() returning `'IFERROR'`.",
    "aStarter": "function getIferrorFunctionName() {\n  // Write your answer here\n}",
    "aHint": "Return IFERROR.",
    "aTest": "if (getIferrorFunctionName() !== 'IFERROR') throw new Error('Function check failed');"
  },
  {
    "day": 14,
    "title": "Data Validation & Dropdown Integrity: In-Cell Lists & Input Constraints",
    "desc": "Enforce strict data governance at data entry: In-Cell Dropdown Lists (`Allow: List, Source: =DepartmentList`), Custom formula validation (`=ISNUMBER(A1)`), Number Range Limits ($0 \\le x \\le 100$), Date Limits, and Error Alert Styles (Stop, Warning, Information).",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Data Validation & Dropdown Integrity: In-Cell Lists & Input Constraints.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Spreadsheet Data Validation & Dropdown Constraint Gatekeeper",
    "eDesc": "Implement function validateCellInput(inputValue, allowedListArray, isNumericRange, minVal, maxVal) certifying cell input compliance.",
    "eStarter": "function validateCellInput(input, allowedList, isRange, min, max) {\n  if (allowedList && !allowedList.includes(input)) {\n    return { isValid: false, errorStyle: 'STOP_ALERT', status: 'VALIDATION_FAILED_VALUE_NOT_IN_LIST' };\n  }\n  if (isRange) {\n    const num = Number(input);\n    if (isNaN(num) || num < min || num > max) {\n      return { isValid: false, errorStyle: 'STOP_ALERT', status: 'VALIDATION_FAILED_OUT_OF_RANGE' };\n    }\n  }\n  return { isValid: true, validatedValue: input, status: 'DATA_VALIDATION_PASSED_NOMINAL' };\n}",
    "eHint": "Check if input in allowedList, and check if in [min, max] range.",
    "eTest": "const depts = ['Engineering', 'Marketing', 'Finance'];\nconst pass = validateCellInput('Engineering', depts, false, 0, 0);\nconst fail = validateCellInput('Sales', depts, false, 0, 0);\nif (!pass.isValid || fail.isValid || pass.status !== 'DATA_VALIDATION_PASSED_NOMINAL' || fail.errorStyle !== 'STOP_ALERT') throw new Error('Data validation failed');",
    "aTitle": "Strict Spreadsheet Validation Alert Style Formatter",
    "aDesc": "Implement function getStrictValidationAlertStyle() returning `'STOP_ALERT'`.",
    "aStarter": "function getStrictValidationAlertStyle() {\n  // Write your answer here\n}",
    "aHint": "Return STOP_ALERT.",
    "aTest": "if (getStrictValidationAlertStyle() !== 'STOP_ALERT') throw new Error('Alert style check failed');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Multi-Condition Aggregations, XLOOKUP, Dynamic Arrays & Error Trapping Engine",
    "desc": "Milestone 2: Build a complete intermediate spreadsheet analytics engine: `SUMIFS` multi-condition filtering ($4,000.00$), `INDEX-MATCH` 2D lookups ($280$), `XLOOKUP` universal fallback resolution, Dynamic array `FILTER` unique spilling, `IFERROR` fault tolerance, and Data validation gatekeeping.",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of ⭐ MILESTONE 2: Complete Multi-Condition Aggregations, XLOOKUP, Dynamic Arrays & Error Trapping Engine.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Spreadsheet Analytics Master Engine",
    "eDesc": "Implement function executeSpreadsheetAnalyticsMaster(sumifsOk, indexMatchOk, xlookupOk, dynArrayOk, iferrorOk, valOk) certifying combined spreadsheet analytics execution.",
    "eStarter": "function executeSpreadsheetAnalyticsMaster(sumifs, idxm, xlk, darr, ife, val) {\n  const isNominal = sumifs && idxm && xlk && darr && ife && val;\n  return {\n    sumifsAggregationsComputed: sumifs,\n    indexMatchLookupsResolved: idxm,\n    xlookupFallbacksApplied: xlk,\n    dynamicArraysSpilled: darr,\n    errorsTrappedSafely: ife,\n    dataValidationEnforced: val,\n    engineStatus: isNominal ? 'SPREADSHEET_ANALYTICS_MASTER_ACTIVE' : 'SPREADSHEET_ANALYTICS_DEFECT'\n  };\n}",
    "eHint": "Verify inputs and return active status.",
    "eTest": "const res = executeSpreadsheetAnalyticsMaster(true, true, true, true, true, true);\nif (res.engineStatus !== 'SPREADSHEET_ANALYTICS_MASTER_ACTIVE') throw new Error('Milestone 2 analytics master failed');",
    "aTitle": "Spreadsheet Analytics Master Status Formatter",
    "aDesc": "Implement function getSpreadsheetAnalyticsMasterStatus() returning `'SPREADSHEET_ANALYTICS_MASTER_ACTIVE'`.",
    "aStarter": "function getSpreadsheetAnalyticsMasterStatus() {\n  // Write your answer here\n}",
    "aHint": "Return status.",
    "aTest": "if (getSpreadsheetAnalyticsMasterStatus() !== 'SPREADSHEET_ANALYTICS_MASTER_ACTIVE') throw new Error('Status check failed');"
  },
  {
    "day": 16,
    "title": "Conditional Formatting & Visual Highlighting: Data Bars, Color Scales & Custom Rules",
    "desc": "Transform dense tabular grids into intuitive visual heatmaps: Highlight Cells Rules (Greater Than, Less Than, Between, Equal To), Top/Bottom Rules (Top 10%, Above Average), Data Bars & Color Scales (Green-Yellow-Red temperature scales), and Custom Formula Rules (`= $C2 > 1000` with absolute column anchors).",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Conditional Formatting & Visual Highlighting: Data Bars, Color Scales & Custom Rules.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Conditional Formatting Formula Evaluator & Color Scale Assignor",
    "eDesc": "Implement function assignConditionalFormatting(cellValue, thresholdHigh, thresholdLow) returning visual formatting tier (`'GREEN_HIGHLIGHT'`, `'YELLOW_WARNING'`, or `'RED_CRITICAL'`).",
    "eStarter": "function assignConditionalFormatting(val, high, low) {\n  if (val >= high) return { value: val, formatClass: 'GREEN_HIGHLIGHT', isFormatted: true, status: 'FORMAT_HIGH_PERFORMANCE' };\n  if (val >= low) return { value: val, formatClass: 'YELLOW_WARNING', isFormatted: true, status: 'FORMAT_MODERATE_PERFORMANCE' };\n  return { value: val, formatClass: 'RED_CRITICAL', isFormatted: true, status: 'FORMAT_CRITICAL_PERFORMANCE' };\n}",
    "eHint": "Return GREEN_HIGHLIGHT if val >= high, YELLOW_WARNING if val >= low, else RED_CRITICAL.",
    "eTest": "const high = assignConditionalFormatting(95, 90, 70);\nconst med = assignConditionalFormatting(75, 90, 70);\nconst low = assignConditionalFormatting(50, 90, 70);\nif (high.formatClass !== 'GREEN_HIGHLIGHT' || med.formatClass !== 'YELLOW_WARNING' || low.formatClass !== 'RED_CRITICAL') throw new Error('Conditional formatting failed');",
    "aTitle": "Top Performance Conditional Formatting Class Formatter",
    "aDesc": "Implement function getTopFormatClass() returning `'GREEN_HIGHLIGHT'`.",
    "aStarter": "function getTopFormatClass() {\n  // Write your answer here\n}",
    "aHint": "Return GREEN_HIGHLIGHT.",
    "aTest": "if (getTopFormatClass() !== 'GREEN_HIGHLIGHT') throw new Error('Class check failed');"
  },
  {
    "day": 17,
    "title": "Excel Tables (`Ctrl + T`) & Structured Referencing: `Table1[@Sales]` Syntax",
    "desc": "Convert static cell ranges into dynamic data objects: Creating Excel Tables (`Ctrl + T`), Structured References (`=Table1[@Price] * Table1[@Qty]`, `=[@Sales] - [@Cost]`), Auto-expanding calculated columns, Automatic total rows, and Banded styling.",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Excel Tables (`Ctrl + T`) & Structured Referencing: `Table1[@Sales]` Syntax.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Excel Table Structured Reference Column Calculation Simulator",
    "eDesc": "Implement function calculateTableColumn(tableRows, priceColKey, qtyColKey) calculating row-by-row total revenue and grand total sum.",
    "eStarter": "function calculateTableColumn(rows, pKey, qKey) {\n  const calculated = rows.map(r => ({\n    ...r,\n    totalRevenue: Number((r[pKey] * r[qKey]).toFixed(2))\n  }));\n  const grandTotal = calculated.reduce((acc, r) => acc + r.totalRevenue, 0);\n  return {\n    rowCount: rows.length,\n    tableRows: calculated,\n    grandTotalSum: Number(grandTotal.toFixed(2)),\n    status: 'TABLE_STRUCTURED_REFERENCE_COMPUTED_NOMINAL'\n  };\n}",
    "eHint": "Calculate totalRevenue = price * qty, grandTotal = sum of revenues.",
    "eTest": "const items = [{ id: 1, price: 10.5, qty: 10 }, { id: 2, price: 20.0, qty: 5 }]; // 105.0 + 100.0 = 205.0\nconst res = calculateTableColumn(items, 'price', 'qty');\nif (res.grandTotalSum !== 205.0 || res.rowCount !== 2 || res.status !== 'TABLE_STRUCTURED_REFERENCE_COMPUTED_NOMINAL') throw new Error('Table calculation failed');",
    "aTitle": "Excel Table Creation Keyboard Shortcut Formatter",
    "aDesc": "Implement function getTableShortcut() returning `'CTRL_T'`.",
    "aStarter": "function getTableShortcut() {\n  // Write your answer here\n}",
    "aHint": "Return CTRL_T.",
    "aTest": "if (getTableShortcut() !== 'CTRL_T') throw new Error('Shortcut check failed');"
  },
  {
    "day": 18,
    "title": "Pivot Tables I: Field List Architecture (Rows, Columns, Values & Filters)",
    "desc": "Summarize millions of data rows without writing a single formula: The 4 Pivot Quadrants (Rows, Columns, Values, Filters), Summarizing Values by `SUM`, `COUNT`, `AVERAGE`, `MIN`, `MAX`, Number Formatting inside Pivot Tables, and Refreshing Pivot Cache.",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Pivot Tables I: Field List Architecture (Rows, Columns, Values & Filters).",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Pivot Table 1-Dimensional Row Summarizer & Aggregator",
    "eDesc": "Implement function buildPivotSummary(records, rowField, valueField, aggregationType) grouping records by rowField and aggregating valueField.",
    "eStarter": "function buildPivotSummary(records, rowField, valField, aggType) {\n  const groups = {};\n  records.forEach(r => {\n    const k = r[rowField];\n    if (!groups[k]) groups[k] = [];\n    groups[k].push(r[valField]);\n  });\n  const result = {};\n  for (const [k, vals] of Object.entries(groups)) {\n    const sum = vals.reduce((acc, v) => acc + v, 0);\n    result[k] = aggType === 'AVERAGE' ? Number((sum / vals.length).toFixed(2)) : Number(sum.toFixed(2));\n  }\n  return { rowField, valueField: valField, pivotData: result, status: 'PIVOT_TABLE_SUMMARY_GENERATED_NOMINAL' };\n}",
    "eHint": "Group by rowField, aggregate values by SUM or AVERAGE.",
    "eTest": "const sales = [\n  { region: 'EAST', amount: 100 },\n  { region: 'WEST', amount: 200 },\n  { region: 'EAST', amount: 150 }\n];\nconst res = buildPivotSummary(sales, 'region', 'amount', 'SUM'); // EAST: 250, WEST: 200\nif (res.pivotData['EAST'] !== 250 || res.pivotData['WEST'] !== 200 || res.status !== 'PIVOT_TABLE_SUMMARY_GENERATED_NOMINAL') throw new Error('Pivot table generation failed');",
    "aTitle": "Total Pivot Table Layout Quadrants Formatter",
    "aDesc": "Implement function getPivotQuadrantsCount() returning `4`.",
    "aStarter": "function getPivotQuadrantsCount() {\n  // Write your answer here\n}",
    "aHint": "A PivotTable has 4 layout areas: Rows, Columns, Values, and Filters — drag fields between them to reshape how data is summarised.",
    "aTest": "if (getPivotQuadrantsCount() !== 4) throw new Error('Quadrants count check failed');"
  },
  {
    "day": 19,
    "title": "Pivot Tables II: Grouping Dates, Value Field Settings & Calculated Fields",
    "desc": "Perform advanced multidimensional business analytics: Grouping Dates by Years, Quarters, and Months, Value Field Settings (`% of Grand Total`, `% of Column Total`, `Running Total In`), and Creating Custom Calculated Fields (`= (Sales - Cost) / Sales`).",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Pivot Tables II: Grouping Dates, Value Field Settings & Calculated Fields.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Pivot Table `% of Grand Total` Value Field Settings Calculator",
    "eDesc": "Implement function calculatePivotPercentageOfTotal(pivotTotalsMap) calculating percentage share of grand total for each category ($Share = \\frac{\\text{Category Sum}}{\\text{Grand Total}} \\times 100$).",
    "eStarter": "function calculatePivotPercentageOfTotal(totals) {\n  const grandTotal = Object.values(totals).reduce((acc, v) => acc + v, 0);\n  const percentages = {};\n  for (const [k, v] of Object.entries(totals)) {\n    percentages[k] = Number(((v / grandTotal) * 100).toFixed(1));\n  }\n  return {\n    grandTotal: Number(grandTotal.toFixed(2)),\n    percentageShares: percentages,\n    status: 'PIVOT_PERCENTAGE_OF_TOTAL_COMPUTED_NOMINAL'\n  };\n}",
    "eHint": "Sum values for grandTotal, calculate (v / grandTotal) * 100.",
    "eTest": "const data = { 'Laptops': 6000, 'Phones': 4000 }; // Grand total = 10,000 -> Laptops = 60.0%, Phones = 40.0%\nconst res = calculatePivotPercentageOfTotal(data);\nif (res.grandTotal !== 10000 || res.percentageShares['Laptops'] !== 60.0 || res.percentageShares['Phones'] !== 40.0 || res.status !== 'PIVOT_PERCENTAGE_OF_TOTAL_COMPUTED_NOMINAL') throw new Error('Pivot percentage failed');",
    "aTitle": "Standard Pivot Value Field Share Setting Formatter",
    "aDesc": "Implement function getPivotShareSettingName() returning `'PERCENT_OF_GRAND_TOTAL'`.",
    "aStarter": "function getPivotShareSettingName() {\n  // Write your answer here\n}",
    "aHint": "Return PERCENT_OF_GRAND_TOTAL.",
    "aTest": "if (getPivotShareSettingName() !== 'PERCENT_OF_GRAND_TOTAL') throw new Error('Setting check failed');"
  },
  {
    "day": 20,
    "title": "Pivot Charts & Interactive Slicers: Multi-Pivot Dashboard Connections",
    "desc": "Build interactive visual executive reports: Inserting Pivot Charts (Column, Bar, Pie/Donut), Adding Visual Slicers, Timeline Filters for Dates, and Connecting Slicers to Multiple Pivot Tables via Report Connections.",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Pivot Charts & Interactive Slicers: Multi-Pivot Dashboard Connections.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Interactive Slicer Multi-Pivot Connection Auditor",
    "eDesc": "Implement function auditSlicerConnections(connectedPivotTablesCount) certifying multi-pivot dashboard interactivity ($Count \\ge 2$).",
    "eStarter": "function auditSlicerConnections(count) {\n  const isInteractive = count >= 2;\n  return {\n    connectedPivotTablesCount: count,\n    isDashboardInteractive: isInteractive,\n    status: isInteractive ? 'MULTI_PIVOT_SLICER_CONNECTED_NOMINAL' : 'ISOLATED_SINGLE_PIVOT_SLICER'\n  };\n}",
    "eHint": "Interactive if count >= 2.",
    "eTest": "const pass = auditSlicerConnections(3);\nconst fail = auditSlicerConnections(1);\nif (!pass.isDashboardInteractive || fail.isDashboardInteractive || pass.status !== 'MULTI_PIVOT_SLICER_CONNECTED_NOMINAL') throw new Error('Slicer audit failed');",
    "aTitle": "Minimum Slicer Multi-Pivot Connection Benchmark Formatter",
    "aDesc": "Implement function getMinSlicerConnectionCount() returning `2`.",
    "aStarter": "function getMinSlicerConnectionCount() {\n  // Write your answer here\n}",
    "aHint": "A slicer must connect to at least 2 PivotTables to act as a shared filter — use the Report Connections dialog to link it across multiple reports.",
    "aTest": "if (getMinSlicerConnectionCount() !== 2) throw new Error('Connection count check failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Conditional Formatting, Structured Tables, Pivot Tables & Slicers Engine",
    "desc": "Milestone 3: Build a complete reporting and business intelligence master engine: Conditional formatting heatmaps, Excel table structured references ($205.00$), Pivot Table aggregations, 60% grand total share calculations, and Multi-pivot interactive slicers.",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of ⭐ MILESTONE 3: Complete Conditional Formatting, Structured Tables, Pivot Tables & Slicers Engine.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Spreadsheet Business Intelligence Master Engine",
    "eDesc": "Implement function executeSpreadsheetBiMaster(formatOk, tableOk, pivotOk, shareOk, slicerOk) certifying combined spreadsheet BI execution.",
    "eStarter": "function executeSpreadsheetBiMaster(format, table, pivot, share, slicer) {\n  const isNominal = format && table && pivot && share && slicer;\n  return {\n    conditionalFormattingApplied: format,\n    structuredTablesCalculated: table,\n    pivotTablesAggregated: pivot,\n    percentageSharesComputed: share,\n    interactiveSlicersConnected: slicer,\n    engineStatus: isNominal ? 'SPREADSHEET_BI_MASTER_ACTIVE' : 'SPREADSHEET_BI_DEFECT'\n  };\n}",
    "eHint": "Verify inputs and return active status.",
    "eTest": "const res = executeSpreadsheetBiMaster(true, true, true, true, true);\nif (res.engineStatus !== 'SPREADSHEET_BI_MASTER_ACTIVE') throw new Error('Milestone 3 BI master failed');",
    "aTitle": "Spreadsheet BI Master Status Formatter",
    "aDesc": "Implement function getSpreadsheetBiMasterStatus() returning `'SPREADSHEET_BI_MASTER_ACTIVE'`.",
    "aStarter": "function getSpreadsheetBiMasterStatus() {\n  // Write your answer here\n}",
    "aHint": "Return status.",
    "aTest": "if (getSpreadsheetBiMasterStatus() !== 'SPREADSHEET_BI_MASTER_ACTIVE') throw new Error('Status check failed');"
  },
  {
    "day": 22,
    "title": "Business Charting & Data Visualization: Chart Type Selection & Secondary Axes",
    "desc": "Select the optimal visualization for every business dataset: Column vs Bar charts for categorical comparisons, Line charts for time-series trends, Combo Charts with Secondary Axes (Revenue on primary left axis, Profit Margin % on secondary right axis), Waterfall charts for variance analysis, and Eliminating visual chart clutter.",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Business Charting & Data Visualization: Chart Type Selection & Secondary Axes.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Business Chart Type Selection & Dual-Axis Configuration Matcher",
    "eDesc": "Implement function matchBusinessChartType(dataType, hasDifferentUnits) mapping business data requirements to optimal chart types.",
    "eStarter": "function matchBusinessChartType(dataType, diffUnits) {\n  if (diffUnits) return { chartType: 'COMBO_CHART_SECONDARY_AXIS', status: 'DUAL_AXIS_CHART_MATCHED' };\n  const map = {\n    'TIME_SERIES_TREND': 'LINE_CHART',\n    'CATEGORICAL_COMPARISON': 'COLUMN_OR_BAR_CHART',\n    'FINANCIAL_VARIANCE': 'WATERFALL_CHART'\n  };\n  return { chartType: map[dataType] || 'COLUMN_CHART', status: 'OPTIMAL_CHART_TYPE_MATCHED' };\n}",
    "eHint": "If diffUnits is true return COMBO_CHART_SECONDARY_AXIS.",
    "eTest": "const combo = matchBusinessChartType('REVENUE_AND_MARGIN', true);\nconst trend = matchBusinessChartType('TIME_SERIES_TREND', false);\nif (combo.chartType !== 'COMBO_CHART_SECONDARY_AXIS' || trend.chartType !== 'LINE_CHART') throw new Error('Chart matching failed');",
    "aTitle": "Dual-Unit Chart Type Name Formatter",
    "aDesc": "Implement function getDualUnitChartType() returning `'COMBO_CHART_SECONDARY_AXIS'`.",
    "aStarter": "function getDualUnitChartType() {\n  // Write your answer here\n}",
    "aHint": "Return COMBO_CHART_SECONDARY_AXIS.",
    "aTest": "if (getDualUnitChartType() !== 'COMBO_CHART_SECONDARY_AXIS') throw new Error('Chart check failed');"
  },
  {
    "day": 23,
    "title": "Financial Modeling Functions: `PMT` Loan Repayments, `NPV`, `PV`, `FV` & `IRR`",
    "desc": "Perform corporate finance and investment modeling: `PMT(rate, nper, pv, [fv], [type])` (Calculating monthly loan amortization payments: $PMT = \\frac{P \\cdot r}{1 - (1+r)^{-n}}$), Net Present Value `NPV(rate, value1, value2, ...)`, Internal Rate of Return `IRR(values)`, and Future Value `FV`.",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Financial Modeling Functions: `PMT` Loan Repayments, `NPV`, `PV`, `FV` & `IRR`.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Financial Loan Amortization `PMT` Monthly Payment Calculator",
    "eDesc": "Implement function calculateLoanPmt(principal, annualRatePct, loanYears) calculating exact monthly mortgage payment ($PMT = \\frac{P \\cdot r}{1 - (1+r)^{-n}}$).",
    "eStarter": "function calculateLoanPmt(p, ratePct, years) {\n  const r = (ratePct / 100) / 12;\n  const n = years * 12;\n  const pmt = (p * r) / (1 - Math.pow(1 + r, -n));\n  return {\n    principal: p,\n    annualRatePct: ratePct,\n    loanTermMonths: n,\n    monthlyPaymentDollars: Number(pmt.toFixed(2)),\n    totalRepaymentDollars: Number((pmt * n).toFixed(2)),\n    status: 'LOAN_PMT_PAYMENT_CALCULATED_NOMINAL'\n  };\n}",
    "eHint": "r = (ratePct/100)/12, n = years*12, pmt = (p*r)/(1 - (1+r)^-n).",
    "eTest": "const res = calculateLoanPmt(100000, 6.0, 30); // $100k at 6% for 30 yrs -> $599.55/month\nif (res.monthlyPaymentDollars !== 599.55 || res.loanTermMonths !== 360 || res.status !== 'LOAN_PMT_PAYMENT_CALCULATED_NOMINAL') throw new Error('PMT calculation failed');",
    "aTitle": "Excel Monthly Loan Payment Function Name Formatter",
    "aDesc": "Implement function getPmtFunctionName() returning `'PMT'`.",
    "aStarter": "function getPmtFunctionName() {\n  // Write your answer here\n}",
    "aHint": "PMT calculates a fixed periodic loan payment: =PMT(rate, nper, pv) where rate is the period interest rate, nper is the number of periods, and pv is the principal.",
    "aTest": "if (getPmtFunctionName() !== 'PMT') throw new Error('Function check failed');"
  },
  {
    "day": 24,
    "title": "What-If Analysis & Scenario Planning: Goal Seek & Sensitivity Data Tables",
    "desc": "Stress-test business models against uncertainty: Goal Seek (Back-solving input values to achieve a target profit or break-even volume), 1-Variable & 2-Variable Data Tables (Creating sensitivity matrices across interest rates and unit sales), and Scenario Manager (Best-case, Base-case, Worst-case forecasts).",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of What-If Analysis & Scenario Planning: Goal Seek & Sensitivity Data Tables.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Goal Seek Break-Even Unit Volume Back-Solver",
    "eDesc": "Implement function backSolveBreakEvenUnits(fixedCosts, salePricePerUnit, variableCostPerUnit, targetProfit) solving required unit volume ($Units = \\frac{\\text{Fixed} + \\text{Target}}{\\text{Price} - \\text{VarCost}}$).",
    "eStarter": "function backSolveBreakEvenUnits(fixed, price, varCost, targetProfit) {\n  const contributionMargin = price - varCost;\n  if (contributionMargin <= 0) throw new Error('Invalid margin');\n  const units = Math.ceil((fixed + targetProfit) / contributionMargin);\n  return {\n    fixedCosts: fixed,\n    targetProfit: targetProfit,\n    contributionMarginPerUnit: Number(contributionMargin.toFixed(2)),\n    requiredUnitsToTarget: units,\n    totalRevenueDollars: Number((units * price).toFixed(2)),\n    status: 'GOAL_SEEK_UNITS_RESOLVED_NOMINAL'\n  };\n}",
    "eHint": "Contribution margin = price - varCost. Units = Math.ceil((fixed + target) / margin).",
    "eTest": "const res = backSolveBreakEvenUnits(50000, 50, 20, 10000); // (50,000 + 10,000) / 30 = 2,000 units\nif (res.requiredUnitsToTarget !== 2000 || res.contributionMarginPerUnit !== 30.0 || res.status !== 'GOAL_SEEK_UNITS_RESOLVED_NOMINAL') throw new Error('Goal seek calculation failed');",
    "aTitle": "Spreadsheet Back-Solving Tool Name Formatter",
    "aDesc": "Implement function getGoalSeekToolName() returning `'GOAL_SEEK'`.",
    "aStarter": "function getGoalSeekToolName() {\n  // Write your answer here\n}",
    "aHint": "Return GOAL_SEEK.",
    "aTest": "if (getGoalSeekToolName() !== 'GOAL_SEEK') throw new Error('Tool check failed');"
  },
  {
    "day": 25,
    "title": "Power Query (Get & Transform) I: Data Cleaning, Splitting & Unpivoting",
    "desc": "Automate complex data transformation pipelines: The Power Query ETL Engine (Extract, Transform, Load), Promoting Headers, Splitting Columns by Delimiters, Unpivoting Columns (Converting horizontal month columns into a normalized vertical database format), and Removing Nulls.",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Power Query (Get & Transform) I: Data Cleaning, Splitting & Unpivoting.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Power Query Wide-to-Long Unpivoting Transformation Simulator",
    "eDesc": "Implement function unpivotMonthlySpreadsheet(wideRecordsArray, idColKey, monthKeysArray) normalizing wide spreadsheet rows into tall database rows.",
    "eStarter": "function unpivotMonthlySpreadsheet(records, idKey, monthKeys) {\n  const unpivoted = [];\n  records.forEach(r => {\n    monthKeys.forEach(m => {\n      unpivoted.push({\n        id: r[idKey],\n        month: m,\n        amount: r[m] || 0\n      });\n    });\n  });\n  return {\n    originalWideRowCount: records.length,\n    normalizedTallRowCount: unpivoted.length,\n    unpivotedRecords: unpivoted,\n    status: 'POWER_QUERY_UNPIVOT_TRANSFORMATION_COMPUTED_NOMINAL'\n  };\n}",
    "eHint": "Iterate records, for each month create row { id, month, amount }.",
    "eTest": "const wide = [{ product: 'A', Jan: 100, Feb: 150 }, { product: 'B', Jan: 200, Feb: 250 }];\nconst res = unpivotMonthlySpreadsheet(wide, 'product', ['Jan', 'Feb']); // 2 rows * 2 months = 4 tall rows\nif (res.normalizedTallRowCount !== 4 || res.unpivotedRecords[0].amount !== 100 || res.status !== 'POWER_QUERY_UNPIVOT_TRANSFORMATION_COMPUTED_NOMINAL') throw new Error('Power Query unpivot failed');",
    "aTitle": "Excel ETL Engine Name Formatter",
    "aDesc": "Implement function getPowerQueryEngineName() returning `'POWER_QUERY'`.",
    "aStarter": "function getPowerQueryEngineName() {\n  // Write your answer here\n}",
    "aHint": "Return POWER_QUERY.",
    "aTest": "if (getPowerQueryEngineName() !== 'POWER_QUERY') throw new Error('Engine check failed');"
  },
  {
    "day": 26,
    "title": "Power Query (Get & Transform) II: Merging Queries (Joins), Appending & Refresh",
    "desc": "Build automated, multi-source enterprise data pipelines: Merging Queries (Left Outer Joins, Inner Joins, Anti-Joins), Appending Tables (Stacking monthly CSV sales files), Power Query M Code Fundamentals, and Configuring 1-Click Refreshable Data Connections.",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Power Query (Get & Transform) II: Merging Queries (Joins), Appending & Refresh.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Power Query Left Outer Join Merge Simulator",
    "eDesc": "Implement function mergeSpreadsheetQueries(leftTable, rightTable, joinKey, rightFieldToMerge) performing Left Outer Join merge across tables.",
    "eStarter": "function mergeSpreadsheetQueries(left, right, key, field) {\n  const rightMap = new Map();\n  right.forEach(r => rightMap.set(r[key], r[field]));\n  const merged = left.map(l => ({\n    ...l,\n    [field]: rightMap.has(l[key]) ? rightMap.get(l[key]) : null\n  }));\n  return {\n    leftRowCount: left.length,\n    mergedRecords: merged,\n    status: 'POWER_QUERY_LEFT_OUTER_JOIN_MERGED_NOMINAL'\n  };\n}",
    "eHint": "Map right records by joinKey, merge into left records.",
    "eTest": "const sales = [{ orderId: 1, custId: 101, amount: 50 }, { orderId: 2, custId: 102, amount: 80 }];\nconst customers = [{ custId: 101, name: 'Acme Corp' }, { custId: 102, name: 'Globex' }];\nconst res = mergeSpreadsheetQueries(sales, customers, 'custId', 'name');\nif (res.mergedRecords[0].name !== 'Acme Corp' || res.mergedRecords[1].name !== 'Globex' || res.status !== 'POWER_QUERY_LEFT_OUTER_JOIN_MERGED_NOMINAL') throw new Error('Merge queries failed');",
    "aTitle": "Power Query Transformation Formula Language Formatter",
    "aDesc": "Implement function getPowerQueryLanguageName() returning `'M_CODE'`.",
    "aStarter": "function getPowerQueryLanguageName() {\n  // Write your answer here\n}",
    "aHint": "Return M_CODE.",
    "aTest": "if (getPowerQueryLanguageName() !== 'M_CODE') throw new Error('Language check failed');"
  },
  {
    "day": 27,
    "title": "Executive Dashboard Design & Layout Principles: KPI Metric Cards & Visual Flow",
    "desc": "Design publication-grade C-Suite executive dashboards: The 3-Second Rule, Top-Left Visual Hierarchy (Placing primary KPIs at the top), KPI Metric Cards (Large numbers with sparklines and YoY variance indicators), Color Palette Discipline (Max 3 colors), and Removing Gridlines.",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Executive Dashboard Design & Layout Principles: KPI Metric Cards & Visual Flow.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Executive KPI Metric Card Variance & Status Scorecard",
    "eDesc": "Implement function calculateKpiMetricCard(actualValue, targetValue) calculating YoY variance percentage ($Var = \\frac{\\text{Actual} - \\text{Target}}{\\text{Target}} \\times 100$) and assigning status (`'TARGET_EXCEEDED'` vs `'TARGET_MISSED'`).",
    "eStarter": "function calculateKpiMetricCard(actual, target) {\n  const diff = actual - target;\n  const pct = (diff / target) * 100;\n  const isExceeded = actual >= target;\n  return {\n    actualMetricValue: actual,\n    targetMetricValue: target,\n    variancePercentage: Number(pct.toFixed(1)),\n    isTargetAchieved: isExceeded,\n    kpiStatus: isExceeded ? 'TARGET_EXCEEDED_NOMINAL' : 'TARGET_MISSED_DEFICIT',\n    status: 'EXECUTIVE_KPI_METRIC_CARD_CALCULATED_NOMINAL'\n  };\n}",
    "eHint": "pct = ((actual - target) / target) * 100. Status is TARGET_EXCEEDED_NOMINAL if actual >= target.",
    "eTest": "const pass = calculateKpiMetricCard(120000, 100000); // +20.0% variance\nconst fail = calculateKpiMetricCard(85000, 100000);  // -15.0% variance\nif (pass.variancePercentage !== 20.0 || !pass.isTargetAchieved || fail.variancePercentage !== -15.0 || fail.isTargetAchieved) throw new Error('KPI calculation failed');",
    "aTitle": "Executive Dashboard Primary Color Palette Limit Formatter",
    "aDesc": "Implement function getMaxDashboardColorsCount() returning `3`.",
    "aStarter": "function getMaxDashboardColorsCount() {\n  // Write your answer here\n}",
    "aHint": "Best practice limits executive dashboards to 3 primary colors — a signal color, a neutral base, and one accent — to reduce visual noise and aid at-a-glance decisions.",
    "aTest": "if (getMaxDashboardColorsCount() !== 3) throw new Error('Colors count check failed');"
  },
  {
    "day": 28,
    "title": "Spreadsheet Security, Protection & Auditing: Sheet Protection & Formula Locks",
    "desc": "Protect financial models from accidental tampering: Unlocking Input Cells (`Format Cells -> Protection -> Uncheck Locked`), Protecting Worksheets (`Review -> Protect Sheet`), Password-Protecting Workbook Structure, Hiding Confidential Formulas, and Inspecting Hidden Worksheets.",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of Spreadsheet Security, Protection & Auditing: Sheet Protection & Formula Locks.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Spreadsheet Cell Protection & Formula Lock Gatekeeper",
    "eDesc": "Implement function evaluateCellEditPermission(isSheetProtected, isCellLocked, isUserAdmin) validating whether cell edit operation is permitted.",
    "eStarter": "function evaluateCellEditPermission(isProtected, isLocked, isAdmin) {\n  if (!isProtected || isAdmin) {\n    return { editAllowed: true, status: 'CELL_EDIT_PERMITTED_UNPROTECTED_OR_ADMIN' };\n  }\n  if (isLocked) {\n    return { editAllowed: false, status: 'CELL_LOCKED_MODIFICATION_BLOCKED' };\n  }\n  return { editAllowed: true, status: 'UNLOCKED_INPUT_CELL_EDIT_PERMITTED' };\n}",
    "eHint": "If not protected or isAdmin, true. If isLocked, false. Else true.",
    "eTest": "const unlocked = evaluateCellEditPermission(true, false, false); // allowed (input cell)\nconst locked = evaluateCellEditPermission(true, true, false);   // blocked (formula cell)\nconst admin = evaluateCellEditPermission(true, true, true);     // admin override\nif (!unlocked.editAllowed || locked.editAllowed || !admin.editAllowed || locked.status !== 'CELL_LOCKED_MODIFICATION_BLOCKED') throw new Error('Security evaluation failed');",
    "aTitle": "Default Cell Protection State in Excel Formatter",
    "aDesc": "Implement function getDefaultCellProtectionState() returning `'LOCKED'`.",
    "aStarter": "function getDefaultCellProtectionState() {\n  // Write your answer here\n}",
    "aHint": "Return LOCKED.",
    "aTest": "if (getDefaultCellProtectionState() !== 'LOCKED') throw new Error('State check failed');"
  },
  {
    "day": 29,
    "title": "AI in Spreadsheets & Future Trends: Excel Copilot & Python in Excel (`=PY()`)",
    "desc": "Embrace the cutting-edge of modern spreadsheet technology: Microsoft 365 Copilot in Excel (Generating formulas, highlighting insights from natural language prompts), Native Python in Excel (`=PY()` running in Microsoft Cloud containers with Pandas, NumPy, and Seaborn), and Automated Office Scripts / VBA.",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of AI in Spreadsheets & Future Trends: Excel Copilot & Python in Excel (`=PY()`).",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Python in Excel (`=PY()`) Execution Sandbox & Security Auditor",
    "eDesc": "Implement function auditPythonInExcelExecution(isPythonFormulaActive, isCloudContainerIsolated) certifying secure `=PY()` script execution.",
    "eStarter": "function auditPythonInExcelExecution(isPy, isIsolated) {\n  const ok = isPy && isIsolated;\n  return {\n    isPythonFormulaActive: isPy,\n    isCloudContainerIsolated: isIsolated,\n    isPythonExecutionSecure: ok,\n    status: ok ? 'PYTHON_IN_EXCEL_EXECUTION_SECURE_NOMINAL' : 'EXECUTION_SECURITY_RISK'\n  };\n}",
    "eHint": "Secure if isPy and isIsolated are true.",
    "eTest": "const pass = auditPythonInExcelExecution(true, true);\nconst fail = auditPythonInExcelExecution(true, false);\nif (!pass.isPythonExecutionSecure || fail.isPythonExecutionSecure || pass.status !== 'PYTHON_IN_EXCEL_EXECUTION_SECURE_NOMINAL') throw new Error('Python in Excel audit failed');",
    "aTitle": "Native Python in Excel Formula Prefix Formatter",
    "aDesc": "Implement function getPythonExcelFormulaPrefix() returning `'=PY'`.",
    "aStarter": "function getPythonExcelFormulaPrefix() {\n  // Write your answer here\n}",
    "aHint": "Return '=PY'.",
    "aTest": "if (getPythonExcelFormulaPrefix() !== '=PY') throw new Error('Prefix check failed');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Excel & Master Data Analysis Suite",
    "desc": "Final Capstone Synthesis: The complete sovereign Excel and master data analysis suite: 1. Spreadsheet Foundations (Grid coordinate parsing, SUM/AVERAGE aggregations, $A$1 reference locking, and logical IF grading); 2. Advanced Analytics & Lookups (SUMIFS multi-condition filtering, INDEX-MATCH 2D matrix lookups, XLOOKUP fallback handling, Dynamic array FILTER unique spilling, and IFERROR fault tolerance); 3. Business Intelligence & Reporting (Conditional formatting heatmaps, structured tables, Pivot Table aggregations, and multi-pivot interactive slicers); 4. Financial Modeling & What-If (PMT monthly amortization, Goal Seek break-even volume back-solving, and Power Query unpivoting ETL pipelines); 5. Executive Dashboards & Security (KPI metric card variances, sheet formula protection, and Python in Excel integration).",
    "syllabus": [
      "Core Foundations: Principles and spreadsheet mechanics of 🏆 FINAL CAPSTONE: Sovereign Excel & Master Data Analysis Suite.",
      "Practical Applications: Formulas, calculation patterns, and workflow execution.",
      "Professional Best Practices: Quality benchmarks, financial modeling integrity, and reporting standards."
    ],
    "eTitle": "Sovereign Excel & Master Data Analysis Suite Orchestrator",
    "eDesc": "Implement function orchestrateExcelMasterSuite(foundationsOk, analyticsOk, biOk, financialOk, dashboardOk) certifying comprehensive Excel and data analysis mastery.",
    "eStarter": "function orchestrateExcelMasterSuite(foundations, analytics, bi, financial, dashboard) {\n  const isCertified = foundations && analytics && bi && financial && dashboard;\n  return {\n    spreadsheetFoundationsModule: foundations,\n    advancedAnalyticsModule: analytics,\n    businessIntelligenceModule: bi,\n    financialModelingModule: financial,\n    executiveDashboardModule: dashboard,\n    sovereignExcelMasterCertified: isCertified,\n    certified: true,\n    status: isCertified ? 'SOVEREIGN_EXCEL_AND_DATA_ANALYSIS_MASTER_CERTIFIED_NOMINAL' : 'EXCEL_MASTER_SUITE_DEFECT'\n  };\n}",
    "eHint": "Verify all 5 Excel mastery pillars evaluate to true.",
    "eTest": "const ok = orchestrateExcelMasterSuite(true, true, true, true, true);\nconst fail = orchestrateExcelMasterSuite(true, true, false, true, true);\nif (!ok.sovereignExcelMasterCertified || fail.sovereignExcelMasterCertified || !ok.certified || ok.status !== 'SOVEREIGN_EXCEL_AND_DATA_ANALYSIS_MASTER_CERTIFIED_NOMINAL') throw new Error('Capstone orchestrator failed');",
    "aTitle": "Excel & Data Analysis Master Certification Auditor",
    "aDesc": "Implement function auditExcelMasterCert() returning `{ certified: true, score: '100/100', tier: 'SOVEREIGN_EXCEL_AND_DATA_ANALYSIS_MASTER_CERTIFIED' }`.",
    "aStarter": "function auditExcelMasterCert() {\n  // Write your answer here\n}",
    "aHint": "Return certification object.",
    "aTest": "if (!auditExcelMasterCert().certified) throw new Error('Capstone cert failed');"
  }
];

export const EXCEL_DATA_VIZ_30_DAYS_QUESTS: CourseQuest[] = EXCEL_DATA_VIZ_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('excel_viz', idx + 1, cfg)
);
