import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const EXCEL_DATA_VIZ_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Spreadsheet Grid Architecture: Cells, 2D Coordinates & Data Types",
    "desc": "Master the fundamental coordinate geometry of modern spreadsheets: 2D Grid Spaces (Columns A to XFD = 16,384 columns, Rows 1 to 1,048,576 = 17.1 billion cells), Native Data Types, and Formula Execution syntax.",
    "syllabus": [
      "2D grid coordinates and addressing geometry.",
      "Spreadsheet data types and type coercion rules.",
      "Formula syntax, operator precedence, and evaluation lifecycles."
    ],
    "eTitle": "Spreadsheet Cell Coordinate & Address Range Parser",
    "eDesc": "Implement function parseCellCoordinate(cellRefString) parsing standard alphanumeric cell references (e.g. 'B12') into 0-indexed column and row coordinates with validation.",
    "eStarter": "function parseCellCoordinate(ref) {\n  // TODO: Parse alphanumeric cell reference (e.g. 'B12') into 0-indexed column and row indices\n  \n}",
    "eHint": "Extract column letters and row digits using regex /^([A-Za-z]+)(\\d+)$/, then convert column letters from base-26 to 0-based colIndex.",
    "eTest": "const b12 = parseCellCoordinate('B12');\nconst aa1 = parseCellCoordinate('AA1');\nconst z100 = parseCellCoordinate('Z100');\nif (b12.colIndex !== 1 || b12.rowIndex !== 11) throw new Error('B12 failed');\nif (aa1.colIndex !== 26 || aa1.rowIndex !== 0) throw new Error('AA1 failed');\nif (z100.colIndex !== 25 || z100.rowIndex !== 99) throw new Error('Z100 failed');",
    "aTitle": "2D Grid Coordinates to Alphanumeric Cell Address Formatter",
    "aDesc": "Implement function formatCellCoordinate(colIndex, rowIndex) converting 0-indexed coordinate numbers (e.g. col 1, row 11) into standard uppercase Excel cell addresses like 'B12'.",
    "aStarter": "function formatCellCoordinate(colIndex, rowIndex) {\n  // TODO: Convert 0-indexed colIndex and rowIndex into an Excel address string (e.g. 1, 11 -> 'B12')\n  \n}",
    "aHint": "Convert 0-indexed colIndex into base-26 uppercase letters (0 -> 'A', 25 -> 'Z', 26 -> 'AA') and append (rowIndex + 1).",
    "aTest": "if (formatCellCoordinate(1, 11) !== 'B12') throw new Error('Format B12 failed');\nif (formatCellCoordinate(26, 0) !== 'AA1') throw new Error('Format AA1 failed');\nif (formatCellCoordinate(0, 0) !== 'A1') throw new Error('Format A1 failed');"
  },
  {
    "day": 2,
    "title": "Core Mathematical & Aggregation Functions: SUM, AVERAGE, COUNT & ROUND",
    "desc": "Compute robust descriptive statistics across numerical column vectors including SUM, AVERAGE, COUNT (numbers only), COUNTA (non-empty), MIN, MAX, and precision rounding.",
    "syllabus": [
      "Core mathematical aggregation functions across numerical arrays.",
      "Differences between numerical COUNT vs non-empty COUNTA.",
      "Precision rounding and floating-point decimal calibration."
    ],
    "eTitle": "Spreadsheet Aggregation Engine & Descriptive Statistics Calculator",
    "eDesc": "Implement function calculateSpreadsheetAggregations(numbersArray) returning summary statistics object with count, sum, average, roundedAverage (2 decimals), min, and max.",
    "eStarter": "function calculateSpreadsheetAggregations(arr) {\n  // TODO: Calculate count, sum, average, roundedAverage, min, and max across numbersArray\n  \n}",
    "eHint": "Compute sum with reduce, average as sum / length, min/max with Math.min/Math.max, and roundedAverage with Number(avg.toFixed(2)).",
    "eTest": "const data = [10.5, 20.25, 30.75, 40.0, 50.5];\nconst res = calculateSpreadsheetAggregations(data);\nif (res.sum !== 152.0 || res.count !== 5) throw new Error('Sum or count failed');\nif (res.roundedAverage !== 30.4 || res.min !== 10.5 || res.max !== 50.5) throw new Error('Metrics failed');\nconst single = calculateSpreadsheetAggregations([5]);\nif (single.sum !== 5 || single.min !== 5 || single.max !== 5) throw new Error('Single element failed');",
    "aTitle": "Weighted Average Metric Calculation Engine",
    "aDesc": "Implement function computeWeightedAverage(values, weights) calculating sum(values[i] * weights[i]) / sum(weights) rounded to 2 decimal places with validation checks.",
    "aStarter": "function computeWeightedAverage(values, weights) {\n  // TODO: Compute weighted average = sum(values[i] * weights[i]) / sum(weights)\n  \n}",
    "aHint": "Multiply corresponding items in values and weights arrays, sum them, divide by the sum of weights, and round to 2 decimal places.",
    "aTest": "const v = [80, 90, 70], w = [0.2, 0.5, 0.3];\nif (computeWeightedAverage(v, w) !== 82) throw new Error('Weighted avg failed');\nif (computeWeightedAverage([100, 50], [1, 1]) !== 75) throw new Error('Equal weights failed');\nif (computeWeightedAverage([10], [5]) !== 10) throw new Error('Single item failed');"
  },
  {
    "day": 3,
    "title": "Cell Referencing Mechanics: Relative (A1), Absolute ($A$1) & Mixed ($A1, A$1)",
    "desc": "Control formula propagation across rows and columns: Relative Referencing (A1 shifts both), Absolute Referencing ($A$1 locks both), and Mixed Referencing ($A1 vs A$1).",
    "syllabus": [
      "Mechanics of the dollar sign $ coordinate lock anchor.",
      "Relative, absolute, and mixed referencing behavior during formula autofill.",
      "Designing multi-column multiplication and tax tables using mixed references."
    ],
    "eTitle": "Formula Cell Reference Transformation & Lock Simulator",
    "eDesc": "Implement function shiftCellReference(originalRef, rowDelta, colDelta) calculating how an Excel reference string transforms when copied across rows and columns.",
    "eStarter": "function shiftCellReference(ref, rowDelta, colDelta) {\n  // TODO: Shift unlocked column and row parts while preserving coordinate locks with $\n  \n}",
    "eHint": "Check for leading $ on column and row parts. Shift rowNum if not row-locked, and shift colIndex if not col-locked.",
    "eTest": "const rel = shiftCellReference('A1', 2, 1);\nconst abs = shiftCellReference('$A$1', 2, 1);\nconst mixCol = shiftCellReference('$A1', 2, 1);\nconst mixRow = shiftCellReference('A$1', 2, 1);\nif (rel !== 'B3' || abs !== '$A$1') throw new Error('Relative/Absolute failed');\nif (mixCol !== '$A3' || mixRow !== 'B$1') throw new Error('Mixed references failed');\nconst multiCol = shiftCellReference('AA10', 0, 1);\nif (multiCol !== 'AB10') throw new Error('Multi-letter shift failed');",
    "aTitle": "2D Multiplication Table Grid Generator with Mixed Referencing",
    "aDesc": "Implement function generateMultiplicationTableGrid(rowFactors, colFactors) generating a 2D matrix simulating the mixed reference formula '=$A{row} * B$1'.",
    "aStarter": "function generateMultiplicationTableGrid(rowFactors, colFactors) {\n  // TODO: Return a 2D matrix where cell [r][c] = rowFactors[r] * colFactors[c]\n  \n}",
    "aHint": "Iterate through rowFactors as the locked column multiplier and colFactors as the locked row multiplier to build a 2D array.",
    "aTest": "const grid = generateMultiplicationTableGrid([1, 2, 3], [10, 20]);\nif (grid.length !== 3 || grid[0].length !== 2) throw new Error('Dimensions failed');\nif (grid[0][0] !== 10 || grid[0][1] !== 20 || grid[2][1] !== 60) throw new Error('Values failed');\nif (generateMultiplicationTableGrid([5], [4])[0][0] !== 20) throw new Error('Single cell failed');"
  },
  {
    "day": 4,
    "title": "Logical Evaluation Functions: Single IF, Nested IF & Multi-Condition AND/OR",
    "desc": "Implement conditional branching logic in spreadsheets using IF(condition, value_if_true, value_if_false), nested IF tiers, and boolean AND/OR multi-criteria evaluations.",
    "syllabus": [
      "Logical operators and boolean conditions in Excel formulas.",
      "Single and multi-level nested IF branching structures.",
      "Combining criteria with AND(), OR(), and NOT() functions."
    ],
    "eTitle": "Student Grade & Attendance Logical Evaluation Engine",
    "eDesc": "Implement function evaluateExcelLogicalGrade(score, attendancePct) returning 'DISTINCTION' if score >= 85 and attendance >= 90%, 'PASS' if score >= 50 and attendance >= 75%, else 'FAIL'.",
    "eStarter": "function evaluateExcelLogicalGrade(score, attendancePct) {\n  // TODO: Implement nested IF logic with score and attendance criteria\n  \n}",
    "eHint": "Evaluate distinction condition first (score >= 85 && attendancePct >= 0.9), then pass condition (score >= 50 && attendancePct >= 0.75), else return 'FAIL'.",
    "eTest": "if (evaluateExcelLogicalGrade(92, 0.95) !== 'DISTINCTION') throw new Error('Distinction failed');\nif (evaluateExcelLogicalGrade(65, 0.80) !== 'PASS') throw new Error('Pass failed');\nif (evaluateExcelLogicalGrade(90, 0.60) !== 'FAIL') throw new Error('Low attendance pass failed');\nif (evaluateExcelLogicalGrade(45, 0.95) !== 'FAIL') throw new Error('Low score failed');",
    "aTitle": "Tiered Sales Commission Rate Calculator",
    "aDesc": "Implement function evaluateCommissionTier(salesAmount, isPresidentClubMember) calculating sales commission payout: 15% for sales >= 100,000 or President Club members, 10% for sales >= 50,000, else 5%.",
    "aStarter": "function evaluateCommissionTier(salesAmount, isPresidentClubMember) {\n  // TODO: Compute commission payout = salesAmount * commissionRate based on tiers\n  \n}",
    "aHint": "Determine commission rate using OR condition for top tier (sales >= 100000 || isPresidentClubMember ? 0.15), then 0.10 for sales >= 50000, else 0.05.",
    "aTest": "if (evaluateCommissionTier(120000, false) !== 18000) throw new Error('Top tier failed');\nif (evaluateCommissionTier(30000, true) !== 4500) throw new Error('President club failed');\nif (evaluateCommissionTier(60000, false) !== 6000) throw new Error('Mid tier failed');\nif (evaluateCommissionTier(20000, false) !== 1000) throw new Error('Base tier failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Spreadsheet Grid Architecture, Aggregation & Logical Evaluation Engine",
    "desc": "Milestone 1: Construct a complete spreadsheet execution pipeline integrating 2D grid cell parsing, coordinate arithmetic, core statistical aggregations, and logical formula evaluation.",
    "syllabus": [
      "End-to-End Workbook Engine Architecture.",
      "Coordinate transformations, formula parsing, and numeric aggregations.",
      "Multi-condition logical decisioning and validation safeguards."
    ],
    "eTitle": "Integrated Spreadsheet Foundations Engine",
    "eDesc": "Implement function orchestrateSpreadsheetFoundations(cellAddresses, valuesArray, threshold) parsing cell coordinates, computing vector statistics, and returning summary object with status.",
    "eStarter": "function orchestrateSpreadsheetFoundations(cellAddresses, valuesArray, threshold) {\n  // TODO: Parse addresses, calculate stats (sum, avg, count), and test if avg >= threshold\n  \n}",
    "eHint": "Compute count, sum, average across valuesArray, check if average >= threshold, and return parsed addresses with status flag.",
    "eTest": "const res = orchestrateSpreadsheetFoundations(['A1', 'B2', 'C3'], [10, 20, 30], 15);\nif (res.count !== 3 || res.sum !== 60 || res.average !== 20) throw new Error('Metrics failed');\nif (!res.meetsThreshold || res.status !== 'SPREADSHEET_FOUNDATIONS_NOMINAL') throw new Error('Status failed');\nconst fail = orchestrateSpreadsheetFoundations(['A1'], [5], 10);\nif (fail.meetsThreshold) throw new Error('Threshold check failed');",
    "aTitle": "Workbook Data Model Integrity Auditor",
    "aDesc": "Implement function auditSpreadsheetWorkbookIntegrity(cellsList) verifying that every cell in a workbook has a valid address, valid data type, and non-empty content.",
    "aStarter": "function auditSpreadsheetWorkbookIntegrity(cellsList) {\n  // TODO: Validate that all cell objects have valid cellRef, valid dataType, and non-null value\n  \n}",
    "aHint": "Iterate through cellsList checking if each item has non-empty cellRef, dataType in ('NUMBER', 'STRING', 'BOOLEAN', 'FORMULA'), and non-null value.",
    "aTest": "const valid = [{ cellRef: 'A1', dataType: 'NUMBER', value: 42 }, { cellRef: 'B2', dataType: 'STRING', value: 'Test' }];\nif (!auditSpreadsheetWorkbookIntegrity(valid).isClean) throw new Error('Valid check failed');\nconst invalid = [{ cellRef: '', dataType: 'NUMBER', value: 10 }];\nif (auditSpreadsheetWorkbookIntegrity(invalid).isClean) throw new Error('Invalid check failed');"
  },
  {
    "day": 6,
    "title": "Statistical Conditional Aggregations: SUMIF, SUMIFS, COUNTIF & AVERAGEIFS",
    "desc": "Aggregate subsets of data meeting single or multiple criteria using SUMIF, SUMIFS, COUNTIF, and AVERAGEIFS with comparison operators and wildcards.",
    "syllabus": [
      "Single-condition aggregations with SUMIF and COUNTIF.",
      "Multi-criteria filtering using SUMIFS and AVERAGEIFS.",
      "Operator strings ('>50', '<=100', '<>0') and text criteria evaluation."
    ],
    "eTitle": "Multi-Criteria Sales Aggregation Engine (SUMIFS)",
    "eDesc": "Implement function evaluateSumIfs(records, sumField, criteriaObj) calculating the sum of sumField for all records matching all key-value filter conditions.",
    "eStarter": "function evaluateSumIfs(records, sumField, criteriaObj) {\n  // TODO: Sum records[sumField] where record matches all criteria in criteriaObj\n  \n}",
    "eHint": "Filter records using Object.entries(criteriaObj).every(([k, v]) => record[k] === v) and sum the target sumField values.",
    "eTest": "const sales = [\n  { region: 'East', rep: 'Alice', amount: 500 },\n  { region: 'East', rep: 'Bob', amount: 300 },\n  { region: 'West', rep: 'Alice', amount: 400 },\n  { region: 'East', rep: 'Alice', amount: 200 }\n];\nif (evaluateSumIfs(sales, 'amount', { region: 'East', rep: 'Alice' }) !== 700) throw new Error('SUMIFS failed');\nif (evaluateSumIfs(sales, 'amount', { region: 'West' }) !== 400) throw new Error('Single criteria failed');\nif (evaluateSumIfs(sales, 'amount', { region: 'North' }) !== 0) throw new Error('Zero match failed');",
    "aTitle": "Multi-Criteria Conditional Average Calculator (AVERAGEIFS)",
    "aDesc": "Implement function evaluateAverageIfs(records, targetField, criteriaObj) computing the mean of targetField for all records satisfying all criteria, rounded to 2 decimals.",
    "aStarter": "function evaluateAverageIfs(records, targetField, criteriaObj) {\n  // TODO: Compute average of targetField for matching records, returning 0 if no match\n  \n}",
    "aHint": "Filter records matching criteria, calculate sum / count, and return Number(avg.toFixed(2)) or 0 if count is 0.",
    "aTest": "const data = [\n  { dept: 'IT', level: 'Senior', salary: 100000 },\n  { dept: 'IT', level: 'Senior', salary: 120000 },\n  { dept: 'HR', level: 'Senior', salary: 80000 }\n];\nif (evaluateAverageIfs(data, 'salary', { dept: 'IT', level: 'Senior' }) !== 110000) throw new Error('Avg failed');\nif (evaluateAverageIfs(data, 'salary', { dept: 'HR' }) !== 80000) throw new Error('HR avg failed');\nif (evaluateAverageIfs(data, 'salary', { dept: 'Sales' }) !== 0) throw new Error('Empty avg failed');"
  },
  {
    "day": 7,
    "title": "Text Manipulation & Cleaning Functions: TRIM, CLEAN, PROPER & TEXTJOIN",
    "desc": "Clean, sanitize, and format messy string inputs in spreadsheets using TRIM, CLEAN (non-printables), PROPER (title case), UPPER, LOWER, and delimited TEXTJOIN.",
    "syllabus": [
      "Text sanitization: Removing leading, trailing, and duplicate inner spaces.",
      "Casing transformations: PROPER(), UPPER(), and LOWER().",
      "Delimited array concatenation with TEXTJOIN(delimiter, ignore_empty, range)."
    ],
    "eTitle": "Customer Name Sanitizer & Proper Case Formatter",
    "eDesc": "Implement function cleanAndFormatCustomerName(rawName) stripping non-printable characters, collapsing duplicate spaces, and returning proper title-cased words.",
    "eStarter": "function cleanAndFormatCustomerName(rawName) {\n  // TODO: Clean non-printables, trim excess spaces, and format into Proper Title Case\n  \n}",
    "eHint": "Replace non-printables with regex /[\\x00-\\x1F\\x7F]/g, trim, collapse spaces with /\\s+/g, and capitalize the first letter of each word.",
    "eTest": "if (cleanAndFormatCustomerName('  jOhN   dOE  ') !== 'John Doe') throw new Error('John Doe failed');\nif (cleanAndFormatCustomerName('alice\\x07 smith') !== 'Alice Smith') throw new Error('Control char failed');\nif (cleanAndFormatCustomerName('EXCEL MASTER') !== 'Excel Master') throw new Error('Upper failed');",
    "aTitle": "Spreadsheet Delimited Text Joiner (TEXTJOIN)",
    "aDesc": "Implement function simulateTextJoin(delimiter, ignoreEmpty, textArray) joining array elements with delimiter while optionally skipping empty/blank strings.",
    "aStarter": "function simulateTextJoin(delimiter, ignoreEmpty, textArray) {\n  // TODO: Join textArray using delimiter, skipping empty strings if ignoreEmpty is true\n  \n}",
    "aHint": "Filter textArray for non-empty strings when ignoreEmpty is true (str.trim().length > 0), then join with delimiter.",
    "aTest": "if (simulateTextJoin(', ', true, ['Apple', '', 'Banana', '   ', 'Cherry']) !== 'Apple, Banana, Cherry') throw new Error('Ignore empty failed');\nif (simulateTextJoin('-', false, ['A', '', 'B']) !== 'A--B') throw new Error('Keep empty failed');\nif (simulateTextJoin('; ', true, ['One']) !== 'One') throw new Error('Single element failed');"
  },
  {
    "day": 8,
    "title": "Date & Time Calculation Mechanics: Excel Serial Numbers, DATEDIF & EOMONTH",
    "desc": "Master Excel's date serial system (Day 1 = January 1, 1900), date arithmetic, age calculations with DATEDIF, and end-of-month projections with EOMONTH.",
    "syllabus": [
      "Excel Date Serial Numbers: Integer days and fractional time components.",
      "Age and interval computation using DATEDIF(start, end, unit).",
      "Financial period boundary calculations using EOMONTH(start_date, months)."
    ],
    "eTitle": "Excel Date Serial Number to ISO Date Converter",
    "eDesc": "Implement function excelSerialToIsoDate(serial) converting an Excel integer serial date number (e.g. 44197 -> '2021-01-01') into standard ISO YYYY-MM-DD format.",
    "eStarter": "function excelSerialToIsoDate(serial) {\n  // TODO: Convert Excel serial date integer (days since 1899-12-30) into 'YYYY-MM-DD'\n  \n}",
    "eHint": "Use base epoch Date(Date.UTC(1899, 11, 30)) and add serial * 86400000 ms, then extract ISO date string.",
    "eTest": "if (excelSerialToIsoDate(44197) !== '2021-01-01') throw new Error('44197 failed');\nif (excelSerialToIsoDate(1) !== '1900-01-01') throw new Error('Day 1 failed');\nif (excelSerialToIsoDate(45000) !== '2023-03-15') throw new Error('45000 failed');",
    "aTitle": "Excel Date Interval Difference Calculator (DATEDIF)",
    "aDesc": "Implement function simulateDateDif(startDateStr, endDateStr, unit) computing the difference between two ISO dates in 'Y' (full years), 'M' (full months), or 'D' (total days).",
    "aStarter": "function simulateDateDif(startDateStr, endDateStr, unit) {\n  // TODO: Calculate date difference in years ('Y'), months ('M'), or days ('D')\n  \n}",
    "aHint": "Parse start and end dates. Compute day diff by ms / 86400000, or month diff by (y2 - y1)*12 + (m2 - m1).",
    "aTest": "if (simulateDateDif('2020-01-01', '2023-01-01', 'Y') !== 3) throw new Error('Years failed');\nif (simulateDateDif('2023-01-01', '2023-04-01', 'M') !== 3) throw new Error('Months failed');\nif (simulateDateDif('2023-01-01', '2023-01-11', 'D') !== 10) throw new Error('Days failed');"
  },
  {
    "day": 9,
    "title": "Classic Lookup Functions: VLOOKUP (Exact Match FALSE / 0), HLOOKUP & #N/A",
    "desc": "Retrieve associated row attributes across tables using vertical lookup VLOOKUP(lookup_value, table_array, col_index, [range_lookup]) and horizontal HLOOKUP.",
    "syllabus": [
      "VLOOKUP syntax and the critical exact-match flag FALSE / 0.",
      "The left-to-right lookup constraint and column index counting.",
      "Handling lookup misses gracefully and diagnosing #N/A errors."
    ],
    "eTitle": "Spreadsheet VLOOKUP Exact Match Simulator",
    "eDesc": "Implement function simulateVLookup(lookupVal, tableGrid, colIndex, exactMatch) searching the first column of tableGrid and returning the value in colIndex.",
    "eStarter": "function simulateVLookup(lookupVal, tableGrid, colIndex, exactMatch) {\n  // TODO: Search column 0 for lookupVal and return row[colIndex - 1] or throw '#N/A'\n  \n}",
    "eHint": "Iterate through tableGrid rows. If row[0] === lookupVal, return row[colIndex - 1]. If no match is found, return '#N/A'.",
    "eTest": "const table = [\n  ['101', 'Alice', 'Engineering'],\n  ['102', 'Bob', 'Marketing'],\n  ['103', 'Charlie', 'Design']\n];\nif (simulateVLookup('102', table, 2, false) !== 'Bob') throw new Error('Lookup 102 name failed');\nif (simulateVLookup('103', table, 3, false) !== 'Design') throw new Error('Lookup 103 dept failed');\nif (simulateVLookup('999', table, 2, false) !== '#N/A') throw new Error('#N/A check failed');",
    "aTitle": "Spreadsheet HLOOKUP Horizontal Row Matrix Simulator",
    "aDesc": "Implement function simulateHLookup(lookupVal, tableGrid, rowIndex, exactMatch) searching the first row of tableGrid horizontally and returning the value at rowIndex.",
    "aStarter": "function simulateHLookup(lookupVal, tableGrid, rowIndex, exactMatch) {\n  // TODO: Search row 0 horizontally for lookupVal and return tableGrid[rowIndex - 1][colIdx] or '#N/A'\n  \n}",
    "aHint": "Find the column index in row 0 matching lookupVal, then return tableGrid[rowIndex - 1][colIndex] or '#N/A'.",
    "aTest": "const hTable = [\n  ['Q1', 'Q2', 'Q3', 'Q4'],\n  [100, 150, 200, 250]\n];\nif (simulateHLookup('Q2', hTable, 2, false) !== 150) throw new Error('HLookup Q2 failed');\nif (simulateHLookup('Q4', hTable, 2, false) !== 250) throw new Error('HLookup Q4 failed');\nif (simulateHLookup('Q5', hTable, 2, false) !== '#N/A') throw new Error('HLookup #N/A failed');"
  },
  {
    "day": 10,
    "title": "Advanced Two-Way Lookups: INDEX & MATCH Dynamic Matrix Retrieval",
    "desc": "Break free from VLOOKUP constraints using INDEX(array, row_num, col_num) and MATCH(lookup_val, lookup_array, [match_type]) for flexible bidirectional retrieval.",
    "syllabus": [
      "INDEX() positional array slicing mechanics.",
      "MATCH() exact match coordinate location (match_type = 0).",
      "Leftward lookups and two-way row-column matrix intersections."
    ],
    "eTitle": "Two-Way INDEX & MATCH Matrix Intersection Engine",
    "eDesc": "Implement function simulateIndexMatch2D(matrix, rowHeaders, colHeaders, targetRow, targetCol) locating coordinates with MATCH and retrieving intersection with INDEX.",
    "eStarter": "function simulateIndexMatch2D(matrix, rowHeaders, colHeaders, targetRow, targetCol) {\n  // TODO: Find row and column indices using MATCH and retrieve value at matrix[r][c]\n  \n}",
    "eHint": "Use rowHeaders.indexOf(targetRow) and colHeaders.indexOf(targetCol). If either is -1 return '#N/A', else return matrix[r][c].",
    "eTest": "const data = [\n  [10, 20, 30],\n  [40, 50, 60],\n  [70, 80, 90]\n];\nconst rows = ['Jan', 'Feb', 'Mar'], cols = ['East', 'West', 'North'];\nif (simulateIndexMatch2D(data, rows, cols, 'Feb', 'West') !== 50) throw new Error('Feb-West failed');\nif (simulateIndexMatch2D(data, rows, cols, 'Mar', 'North') !== 90) throw new Error('Mar-North failed');\nif (simulateIndexMatch2D(data, rows, cols, 'Dec', 'East') !== '#N/A') throw new Error('Missing row failed');",
    "aTitle": "Leftward Reverse Column Lookup Engine",
    "aDesc": "Implement function simulateLeftwardLookup(tableGrid, searchColIdx, returnColIdx, lookupVal) searching any column and returning any other column, bypassing VLOOKUP limitations.",
    "aStarter": "function simulateLeftwardLookup(tableGrid, searchColIdx, returnColIdx, lookupVal) {\n  // TODO: Match lookupVal in searchColIdx and return value from returnColIdx\n  \n}",
    "aHint": "Find row index where row[searchColIdx] === lookupVal, then return row[returnColIdx] or '#N/A'.",
    "aTest": "const emp = [\n  ['Alice', 'ENG01', 95000],\n  ['Bob', 'MKT02', 80000]\n];\nif (simulateLeftwardLookup(emp, 1, 0, 'ENG01') !== 'Alice') throw new Error('Leftward Alice failed');\nif (simulateLeftwardLookup(emp, 1, 2, 'MKT02') !== 80000) throw new Error('Salary failed');\nif (simulateLeftwardLookup(emp, 1, 0, 'UNKNOWN') !== '#N/A') throw new Error('Leftward #N/A failed');"
  },
  {
    "day": 11,
    "title": "Modern Universal Lookup Function: XLOOKUP (Leftward, Defaults & Search Modes)",
    "desc": "Master modern Excel data retrieval with XLOOKUP: simultaneous support for leftward lookups, default if_not_found fallbacks, exact match by default, and binary search.",
    "syllabus": [
      "XLOOKUP syntax: lookup_value, lookup_array, return_array, [if_not_found].",
      "Elimination of column index counting and structural fragility.",
      "Search modes: First-to-last (1), Last-to-first (-1), and binary search."
    ],
    "eTitle": "Modern Universal XLOOKUP Engine Simulator",
    "eDesc": "Implement function simulateXLookup(lookupVal, lookupArr, returnArr, ifNotFound, searchMode) supporting forward/reverse searches and custom not-found defaults.",
    "eStarter": "function simulateXLookup(lookupVal, lookupArr, returnArr, ifNotFound = '#N/A', searchMode = 1) {\n  // TODO: Search lookupArr for lookupVal and return corresponding item from returnArr\n  \n}",
    "eHint": "If searchMode === -1, search lookupArr backwards from the end. If found return returnArr[idx], else return ifNotFound.",
    "eTest": "const ids = [101, 102, 103, 102], names = ['Alice', 'Bob1', 'Charlie', 'Bob2'];\nif (simulateXLookup(102, ids, names) !== 'Bob1') throw new Error('First match failed');\nif (simulateXLookup(102, ids, names, '#N/A', -1) !== 'Bob2') throw new Error('Reverse match failed');\nif (simulateXLookup(999, ids, names, 'NOT_FOUND') !== 'NOT_FOUND') throw new Error('Default fallback failed');",
    "aTitle": "Wildcard Pattern XLOOKUP Engine",
    "aDesc": "Implement function simulateWildcardXLookup(pattern, lookupArr, returnArr) matching text patterns containing '*' (any sequence) and '?' (single character).",
    "aStarter": "function simulateWildcardXLookup(pattern, lookupArr, returnArr) {\n  // TODO: Convert Excel wildcard pattern (*, ?) to regex and return first matching item from returnArr\n  \n}",
    "aHint": "Convert pattern into regex by escaping regex specials, replacing '*' with '.*' and '?' with '.', then test against each item in lookupArr.",
    "aTest": "const codes = ['ITEM-ABC-1', 'ITEM-XYZ-2', 'PROD-99'];\nconst prices = [15.0, 25.0, 99.0];\nif (simulateWildcardXLookup('*-XYZ-*', codes, prices) !== 25.0) throw new Error('Wildcard XYZ failed');\nif (simulateWildcardXLookup('PROD-??', codes, prices) !== 99.0) throw new Error('Wildcard PROD failed');\nif (simulateWildcardXLookup('NOTHING*', codes, prices) !== '#N/A') throw new Error('Wildcard #N/A failed');"
  },
  {
    "day": 12,
    "title": "Dynamic Array Formulas & Spill Ranges: FILTER, UNIQUE, SORT & #SPILL!",
    "desc": "Harness the power of dynamic array calculation engines: single formulas that return multi-cell results spilling into adjacent ranges (FILTER, UNIQUE, SORT, SORTBY, and #SPILL!).",
    "syllabus": [
      "Dynamic array evaluation and the spill range operator (#).",
      "FILTER(array, include, [if_empty]) conditional extraction.",
      "UNIQUE() deduplication and SORT() multi-column ordering."
    ],
    "eTitle": "Dynamic Array FILTER Formula Simulator",
    "eDesc": "Implement function evaluateDynamicFilter(dataset, predicateFn, ifEmptyMsg) returning matching records or a single fallback message if no records match.",
    "eStarter": "function evaluateDynamicFilter(dataset, predicateFn, ifEmptyMsg = 'NO_RECORDS') {\n  // TODO: Filter dataset by predicateFn, returning matching rows or ifEmptyMsg\n  \n}",
    "eHint": "Use dataset.filter(predicateFn). If the filtered length is 0, return [ifEmptyMsg], otherwise return the filtered array.",
    "eTest": "const data = [{ id: 1, active: true }, { id: 2, active: false }, { id: 3, active: true }];\nconst filtered = evaluateDynamicFilter(data, x => x.active);\nif (filtered.length !== 2 || filtered[0].id !== 1 || filtered[1].id !== 3) throw new Error('Filter failed');\nconst empty = evaluateDynamicFilter(data, x => x.id === 99, 'NONE');\nif (empty[0] !== 'NONE') throw new Error('Empty fallback failed');\nconst allMatch = evaluateDynamicFilter(data, () => true);\nif (allMatch.length !== 3) throw new Error('All match failed');",
    "aTitle": "Dynamic Array UNIQUE & SORT Spill Simulator",
    "aDesc": "Implement function evaluateUniqueAndSorted(arrayData, ascending = true) extracting distinct values and returning them in sorted alphabetical/numerical order.",
    "aStarter": "function evaluateUniqueAndSorted(arrayData, ascending = true) {\n  // TODO: Deduplicate arrayData and return sorted array in ascending or descending order\n  \n}",
    "aHint": "Deduplicate with [...new Set(arrayData)], then sort with a comparison function respecting ascending parameter.",
    "aTest": "const raw = ['Banana', 'Apple', 'Banana', 'Orange', 'Apple'];\nconst sorted = evaluateUniqueAndSorted(raw, true);\nif (sorted.length !== 3 || sorted[0] !== 'Apple' || sorted[2] !== 'Orange') throw new Error('Unique sort failed');\nconst desc = evaluateUniqueAndSorted([5, 2, 8, 2, 5], false);\nif (desc[0] !== 8 || desc[1] !== 5 || desc[2] !== 2) throw new Error('Desc sort failed');"
  },
  {
    "day": 13,
    "title": "Error Trapping & Formula Debugging: IFERROR, IFNA, #DIV/0! & Precedents",
    "desc": "Build resilient, production-ready spreadsheets by wrapping volatile calculations with IFERROR and IFNA, and diagnosing #DIV/0!, #VALUE!, #REF!, and circular references.",
    "syllabus": [
      "Common spreadsheet errors: #DIV/0!, #N/A, #VALUE!, #REF!, and #NUM!.",
      "Defensive programming with IFERROR(value, value_if_error) and IFNA().",
      "Auditing calculation paths using Trace Precedents and Trace Dependents."
    ],
    "eTitle": "Defensive Formula Execution with IFERROR Wrapper",
    "eDesc": "Implement function evaluateWithIfError(calculationFn, fallbackValue) executing calculationFn safely and catching errors or null/undefined outputs with fallbackValue.",
    "eStarter": "function evaluateWithIfError(calculationFn, fallbackValue) {\n  // TODO: Safely invoke calculationFn; return fallbackValue if an exception or NaN occurs\n  \n}",
    "eHint": "Wrap execution in try/catch. If successful and result is not NaN, return result; on error or NaN, return fallbackValue.",
    "eTest": "const safeDiv = evaluateWithIfError(() => 100 / 4, 0);\nif (safeDiv !== 25) throw new Error('Valid calculation failed');\nconst divZero = evaluateWithIfError(() => { throw new Error('#DIV/0!'); }, 'N/A');\nif (divZero !== 'N/A') throw new Error('IFERROR trap failed');\nconst nanResult = evaluateWithIfError(() => parseInt('invalid'), 0);\nif (nanResult !== 0) throw new Error('NaN trap failed');",
    "aTitle": "Spreadsheet Division Diagnostic & Fault Classifier",
    "aDesc": "Implement function safeSpreadsheetDivision(numerator, denominator) performing division while safely returning '#DIV/0!' on zero denominator and '#VALUE!' on invalid inputs.",
    "aStarter": "function safeSpreadsheetDivision(numerator, denominator) {\n  // TODO: Validate numeric inputs, check denominator === 0, and return division result or error code\n  \n}",
    "aHint": "Check typeof inputs for numbers; if not number return '#VALUE!'. If denominator === 0 return '#DIV/0!'. Otherwise return numerator / denominator.",
    "aTest": "if (safeSpreadsheetDivision(10, 2) !== 5) throw new Error('Valid division failed');\nif (safeSpreadsheetDivision(10, 0) !== '#DIV/0!') throw new Error('#DIV/0! check failed');\nif (safeSpreadsheetDivision('abc', 2) !== '#VALUE!') throw new Error('#VALUE! check failed');"
  },
  {
    "day": 14,
    "title": "Data Validation & Dropdown Integrity: In-Cell Lists & Input Constraints",
    "desc": "Enforce strict spreadsheet data integrity using Data Validation: In-Cell Dropdown Lists, whole number / decimal bounds, date limits, and custom formula validation rules.",
    "syllabus": [
      "In-Cell dropdown list constraints and named range sources.",
      "Numerical and date boundary validation rules.",
      "Input messages vs Stop / Warning / Information error alert styles."
    ],
    "eTitle": "Spreadsheet Cell Data Validation Engine",
    "eDesc": "Implement function validateCellInput(value, ruleConfig) verifying whether a cell input meets list membership, numeric range, or regex validation criteria.",
    "eStarter": "function validateCellInput(value, ruleConfig) {\n  // TODO: Validate value against ruleConfig type ('LIST', 'RANGE', 'REGEX') and return { valid: bool, error: string|null }\n  \n}",
    "eHint": "Check ruleConfig.type: for 'LIST' verify list.includes(value); for 'RANGE' verify min <= value <= max; return { valid: true, error: null } or error message.",
    "eTest": "const listRule = { type: 'LIST', allowed: ['Active', 'Pending', 'Archived'] };\nif (!validateCellInput('Active', listRule).valid) throw new Error('List valid failed');\nif (validateCellInput('Deleted', listRule).valid) throw new Error('List invalid failed');\nconst rangeRule = { type: 'RANGE', min: 18, max: 65 };\nif (!validateCellInput(25, rangeRule).valid || validateCellInput(70, rangeRule).valid) throw new Error('Range check failed');",
    "aTitle": "Batch Spreadsheet Input Sanitizer and Rejection Filter",
    "aDesc": "Implement function sanitizeBatchDataInputs(inputList, validationRule) partitioning an input array into { validItems: [...], rejectedItems: [...] } using validation rules.",
    "aStarter": "function sanitizeBatchDataInputs(inputList, validationRule) {\n  // TODO: Partition inputList into valid and rejected buckets according to validationRule\n  \n}",
    "aHint": "Iterate through inputList using validateCellInput logic and push each item to either validItems or rejectedItems array.",
    "aTest": "const rule = { type: 'RANGE', min: 0, max: 100 };\nconst batch = [50, -5, 85, 120, 99];\nconst res = sanitizeBatchDataInputs(batch, rule);\nif (res.validItems.length !== 3 || res.rejectedItems.length !== 2) throw new Error('Batch partition failed');\nif (res.rejectedItems[0] !== -5 || res.rejectedItems[1] !== 120) throw new Error('Rejection values failed');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Advanced Lookup, Dynamic Arrays, Aggregations & Error Trapping Engine",
    "desc": "Milestone 2: Construct an executive data analytics pipeline combining multi-condition SUMIFS, dynamic XLOOKUP retrieval, spilled array transformations, and defensive IFERROR shields.",
    "syllabus": [
      "Multi-Condition Aggregations: SUMIFS, COUNTIFS, and AVERAGEIFS.",
      "Universal Lookups: XLOOKUP with fallback defaults and wildcard searches.",
      "Dynamic Spilling: FILTER and UNIQUE data transformations.",
      "Defensive Shields: Comprehensive error handling and fault recovery."
    ],
    "eTitle": "Executive Data Analytics & Lookup Pipeline Orchestrator",
    "eDesc": "Implement function orchestrateSpreadsheetAnalyticsEngine(records, lookupTable, queryConfig) combining XLOOKUP enrichment, SUMIFS filtering, and error handling.",
    "eStarter": "function orchestrateSpreadsheetAnalyticsEngine(records, lookupTable, queryConfig) {\n  // TODO: Enrich records with department from lookupTable, filter by queryConfig, and compute total revenue\n  \n}",
    "eHint": "Join department names to records from lookupTable, filter matching queryConfig criteria, sum revenue, and return { totalRevenue, matchedCount, status }.",
    "eTest": "const records = [\n  { repId: 'R1', sales: 500, region: 'East' },\n  { repId: 'R2', sales: 300, region: 'West' },\n  { repId: 'R1', sales: 200, region: 'East' }\n];\nconst reps = [{ id: 'R1', name: 'Alice' }, { id: 'R2', name: 'Bob' }];\nconst res = orchestrateSpreadsheetAnalyticsEngine(records, reps, { region: 'East' });\nif (res.totalRevenue !== 700 || res.matchedCount !== 2) throw new Error('Analytics failed');\nif (res.status !== 'SPREADSHEET_ANALYTICS_MASTER_ACTIVE') throw new Error('Status failed');\nconst emptyRes = orchestrateSpreadsheetAnalyticsEngine(records, reps, { region: 'North' });\nif (emptyRes.totalRevenue !== 0 || emptyRes.matchedCount !== 0) throw new Error('Empty query failed');",
    "aTitle": "Cross-Department Performance Rollup Engine",
    "aDesc": "Implement function buildDepartmentalSummaryReport(salesData, departmentsList) calculating total revenue, transaction count, and average order value per department.",
    "aStarter": "function buildDepartmentalSummaryReport(salesData, departmentsList) {\n  // TODO: Group salesData by department and calculate { totalRevenue, orderCount, avgOrderValue }\n  \n}",
    "aHint": "For each department in departmentsList, filter salesData, compute sum and count, and return an array of department metric objects.",
    "aTest": "const sales = [\n  { dept: 'Tech', amount: 1000 },\n  { dept: 'Tech', amount: 500 },\n  { dept: 'HR', amount: 300 }\n];\nconst rep = buildDepartmentalSummaryReport(sales, ['Tech', 'HR', 'Legal']);\nif (rep.find(x => x.dept === 'Tech').totalRevenue !== 1500) throw new Error('Tech sum failed');\nif (rep.find(x => x.dept === 'Legal').totalRevenue !== 0) throw new Error('Legal zero failed');\nif (rep.find(x => x.dept === 'Tech').avgOrderValue !== 750) throw new Error('Tech avg failed');"
  },
  {
    "day": 16,
    "title": "Conditional Formatting & Visual Highlighting: Data Bars, Color Scales & Custom Rules",
    "desc": "Transform dense numeric grids into intuitive visual heatmaps using Conditional Formatting: 3-Color Scales, gradient Data Bars, Icon Sets, and custom formula rules.",
    "syllabus": [
      "Rule evaluation hierarchy and 'Stop If True' execution order.",
      "3-Color scales: Minimum (0th percentile), Midpoint (50th), and Maximum (100th).",
      "Formula-driven conditional formatting rules using logical expressions."
    ],
    "eTitle": "3-Color Gradient Heatmap Threshold Calculator",
    "eDesc": "Implement function applyConditionalColorScale(valuesArray) calculating minimum, 50th percentile median, and maximum thresholds for dynamic 3-color heatmap shading.",
    "eStarter": "function applyConditionalColorScale(valuesArray) {\n  // TODO: Calculate min, median, max, and assign 'RED_LOW', 'YELLOW_MID', or 'GREEN_HIGH' to each value\n  \n}",
    "eHint": "Sort array to find min, median, and max. Map each value to a color bracket based on whether it falls below or above median.",
    "eTest": "const data = [10, 20, 30, 40, 50];\nconst res = applyConditionalColorScale(data);\nif (res.min !== 10 || res.max !== 50 || res.median !== 30) throw new Error('Thresholds failed');\nif (res.formattedValues[0].color !== 'RED_LOW' || res.formattedValues[4].color !== 'GREEN_HIGH') throw new Error('Colors failed');\nif (res.formattedValues[2].color !== 'YELLOW_MID') throw new Error('Mid color failed');",
    "aTitle": "Spreadsheet In-Cell Data Bar Length Scaler",
    "aDesc": "Implement function applyDataBarLengths(valuesArray, maxBarWidth = 100) scaling numeric values proportionally into visual pixel widths relative to the array maximum.",
    "aStarter": "function applyDataBarLengths(valuesArray, maxBarWidth = 100) {\n  // TODO: Compute Math.max of valuesArray and scale each value to (val / maxVal) * maxBarWidth\n  \n}",
    "aHint": "Find maximum value in valuesArray. For each item, compute Math.round((val / maxVal) * maxBarWidth), returning an array of bar widths.",
    "aTest": "const res = applyDataBarLengths([25, 50, 100], 100);\nif (res[0] !== 25 || res[1] !== 50 || res[2] !== 100) throw new Error('Data bar scale failed');\nconst scaled = applyDataBarLengths([10, 20], 50);\nif (scaled[0] !== 25 || scaled[1] !== 50) throw new Error('Scaled 50 failed');\nif (applyDataBarLengths([5], 100)[0] !== 100) throw new Error('Single item max failed');"
  },
  {
    "day": 17,
    "title": "Excel Tables (Ctrl + T) & Structured Referencing: Table1[@Sales] Syntax",
    "desc": "Upgrade static grids into dynamic structured Excel Tables: automatic formula propagation, Total Rows with calculated metrics, and structured references Table[@Column].",
    "syllabus": [
      "Table conversion advantages: Dynamic expansion and automatic range naming.",
      "Structured referencing syntax: `Table1[Column]`, `Table1[@Column]`, and `Table1[#Totals]`.",
      "Total Row aggregation formulas using `SUBTOTAL(109, [Sales])`."
    ],
    "eTitle": "Structured Table Reference Calculation Engine",
    "eDesc": "Implement function evaluateStructuredReference(tableRows, formulaExpression) computing derived column values using structured bracket syntax like '[@Qty] * [@Price]'.",
    "eStarter": "function evaluateStructuredReference(tableRows, formulaExpression) {\n  // TODO: Evaluate formulaExpression for each row in tableRows using column properties\n  \n}",
    "eHint": "For each row, replace '[@ColumnName]' tokens with row[ColumnName] and evaluate the arithmetic expression.",
    "eTest": "const rows = [\n  { Qty: 5, Price: 10 },\n  { Qty: 2, Price: 20 }\n];\nconst res = evaluateStructuredReference(rows, '[@Qty] * [@Price]');\nif (res[0] !== 50 || res[1] !== 40) throw new Error('Evaluation failed');\nconst total = evaluateStructuredReference(rows, '[@Qty] + 1');\nif (total[0] !== 6 || total[1] !== 3) throw new Error('Addition failed');\nconst discount = evaluateStructuredReference(rows, '[@Price] - 5');\nif (discount[0] !== 5 || discount[1] !== 15) throw new Error('Subtraction failed');",
    "aTitle": "Excel Table Subtotal & Aggregate Total Row Engine",
    "aDesc": "Implement function computeTableColumnTotal(tableRows, columnName, aggregationType) calculating column summaries for 'SUM', 'AVERAGE', 'MIN', 'MAX', or 'COUNT'.",
    "aStarter": "function computeTableColumnTotal(tableRows, columnName, aggregationType) {\n  // TODO: Compute column summary across tableRows according to aggregationType\n  \n}",
    "aHint": "Extract numbers from tableRows[columnName], then apply the appropriate aggregation function ('SUM', 'AVERAGE', etc.).",
    "aTest": "const table = [{ Sales: 100 }, { Sales: 200 }, { Sales: 300 }];\nif (computeTableColumnTotal(table, 'Sales', 'SUM') !== 600) throw new Error('SUM total failed');\nif (computeTableColumnTotal(table, 'Sales', 'AVERAGE') !== 200) throw new Error('AVG total failed');\nif (computeTableColumnTotal(table, 'Sales', 'COUNT') !== 3) throw new Error('COUNT total failed');"
  },
  {
    "day": 18,
    "title": "Pivot Tables I: Field List Architecture (Rows, Columns, Values & Filters)",
    "desc": "Summarize multi-thousand-row datasets instantly without formulas using Pivot Tables: the 4-quadrant field architecture (Filters, Columns, Rows, and Values).",
    "syllabus": [
      "The PivotTable cache and multidimensional aggregation architecture.",
      "Row and Column field placement for categorical cross-tabulation.",
      "Value Field Settings: SUM, COUNT, AVERAGE, and formatting options."
    ],
    "eTitle": "Pivot Table Single-Dimension Grouping Engine",
    "eDesc": "Implement function buildPivotSummaryTable(records, rowField, valueField, aggregationType) grouping records by rowField and computing valueField aggregations.",
    "eStarter": "function buildPivotSummaryTable(records, rowField, valueField, aggregationType = 'SUM') {\n  // TODO: Group records by rowField and compute aggregate values for valueField\n  \n}",
    "eHint": "Group records using an object map by record[rowField], collect values, and apply aggregationType ('SUM', 'COUNT', 'AVERAGE').",
    "eTest": "const sales = [\n  { category: 'Furniture', amount: 300 },\n  { category: 'Office', amount: 100 },\n  { category: 'Furniture', amount: 200 }\n];\nconst pivot = buildPivotSummaryTable(sales, 'category', 'amount', 'SUM');\nif (pivot.Furniture !== 500 || pivot.Office !== 100) throw new Error('Pivot sum failed');\nconst counts = buildPivotSummaryTable(sales, 'category', 'amount', 'COUNT');\nif (counts.Furniture !== 2 || counts.Office !== 1) throw new Error('Pivot count failed');\nconst avgs = buildPivotSummaryTable(sales, 'category', 'amount', 'AVERAGE');\nif (avgs.Furniture !== 250 || avgs.Office !== 100) throw new Error('Pivot average failed');",
    "aTitle": "Two-Way Pivot Table Cross-Tabulation Matrix Generator",
    "aDesc": "Implement function buildTwoWayPivotCrossTab(records, rowField, colField, valueField) generating a 2D cross-tab matrix aggregating metrics across two discrete categories.",
    "aStarter": "function buildTwoWayPivotCrossTab(records, rowField, colField, valueField) {\n  // TODO: Build 2D nested map { [row]: { [col]: sum } } for all row-col intersections\n  \n}",
    "aHint": "Iterate through records, populate nested object result[r][c] = (result[r][c] || 0) + val, and return the cross-tab object.",
    "aTest": "const txs = [\n  { region: 'East', product: 'A', revenue: 50 },\n  { region: 'East', product: 'B', revenue: 75 },\n  { region: 'West', product: 'A', revenue: 100 }\n];\nconst matrix = buildTwoWayPivotCrossTab(txs, 'region', 'product', 'revenue');\nif (matrix.East.A !== 50 || matrix.East.B !== 75 || matrix.West.A !== 100) throw new Error('2-way cross tab failed');\nif (matrix.West.B !== undefined) throw new Error('Undefined column check failed');"
  },
  {
    "day": 19,
    "title": "Pivot Tables II: Grouping Dates, Value Field Settings & Calculated Fields",
    "desc": "Perform advanced Pivot Table modeling: grouping timestamps into Years/Quarters/Months, displaying values as '% of Grand Total' or 'Running Total', and Calculated Fields.",
    "syllabus": [
      "Automatic and manual date/time grouping hierarchies.",
      "Show Values As: '% of Grand Total', '% of Column Total', and 'Difference From'.",
      "Inserting Custom Calculated Fields and Solve Order mechanics."
    ],
    "eTitle": "Pivot '% of Grand Total' Percentage Share Calculator",
    "eDesc": "Implement function computePivotPercentOfTotal(pivotTotalsMap) taking category total values and returning each category's share percentage of the grand total.",
    "eStarter": "function computePivotPercentOfTotal(pivotTotalsMap) {\n  // TODO: Calculate grand total and return { [category]: sharePercentage } rounded to 2 decimals\n  \n}",
    "eHint": "Sum all values in pivotTotalsMap to get grandTotal, then map each key to Number(((val / grandTotal) * 100).toFixed(2)).",
    "eTest": "const totals = { North: 500, South: 300, East: 200 }; // grand = 1000\nconst shares = computePivotPercentOfTotal(totals);\nif (shares.North !== 50.0 || shares.South !== 30.0 || shares.East !== 20.0) throw new Error('Share pct failed');\nconst equal = computePivotPercentOfTotal({ A: 50, B: 50 });\nif (equal.A !== 50.0 || equal.B !== 50.0) throw new Error('Equal share failed');\nconst single = computePivotPercentOfTotal({ Only: 42 });\nif (single.Only !== 100.0) throw new Error('Single group share failed');",
    "aTitle": "Pivot Custom Calculated Field Engine",
    "aDesc": "Implement function addPivotCalculatedField(pivotRows, formulaFn, fieldName) adding a dynamic derived metric column to every row in a pivot dataset.",
    "aStarter": "function addPivotCalculatedField(pivotRows, formulaFn, fieldName) {\n  // TODO: Map over pivotRows and assign row[fieldName] = formulaFn(row)\n  \n}",
    "aHint": "Return a new array of objects where each item has all original properties plus [fieldName]: formulaFn(row).",
    "aTest": "const rows = [{ revenue: 1000, cost: 600 }, { revenue: 500, cost: 200 }];\nconst withProfit = addPivotCalculatedField(rows, r => r.revenue - r.cost, 'profit');\nif (withProfit[0].profit !== 400 || withProfit[1].profit !== 300) throw new Error('Profit field failed');\nif (withProfit[0].revenue !== 1000) throw new Error('Original properties preserved failed');"
  },
  {
    "day": 20,
    "title": "Pivot Charts & Interactive Slicers: Multi-Pivot Dashboard Connections",
    "desc": "Build dynamic interactive reporting dashboards connecting visual Pivot Charts to multiple Pivot Tables using interactive Slicers and Timelines.",
    "syllabus": [
      "Pivot Chart synchronization with underlying pivot caches.",
      "Slicer report connections: Linking a single slicer to multiple Pivot Tables.",
      "Designing clean visual executive KPI cockpits."
    ],
    "eTitle": "Multi-Pivot Slicer Filter Synchronization Engine",
    "eDesc": "Implement function filterPivotDatasetBySlicer(dataset, activeSlicersObj) filtering records across multiple active slicer category dimensions simultaneously.",
    "eStarter": "function filterPivotDatasetBySlicer(dataset, activeSlicersObj) {\n  // TODO: Filter dataset where record matches all active slicer arrays in activeSlicersObj\n  \n}",
    "eHint": "Iterate through dataset items, checking that for each key in activeSlicersObj, activeSlicersObj[k].includes(item[k]).",
    "eTest": "const data = [\n  { region: 'East', year: 2023, sales: 100 },\n  { region: 'West', year: 2023, sales: 200 },\n  { region: 'East', year: 2022, sales: 150 }\n];\nconst filtered = filterPivotDatasetBySlicer(data, { region: ['East'], year: [2023] });\nif (filtered.length !== 1 || filtered[0].sales !== 100) throw new Error('Slicer filter failed');\nconst multiRegion = filterPivotDatasetBySlicer(data, { region: ['East', 'West'] });\nif (multiRegion.length !== 3) throw new Error('Multi region failed');\nconst noneMatch = filterPivotDatasetBySlicer(data, { region: ['North'] });\nif (noneMatch.length !== 0) throw new Error('Zero match slicer failed');",
    "aTitle": "Interactive Slicer Button State Evaluator",
    "aDesc": "Implement function calculateSlicerItemStates(fullDataset, currentFilters, targetField) determining which slicer buttons should be ACTIVE, DISABLED (zero matching records), or SELECTED.",
    "aStarter": "function calculateSlicerItemStates(fullDataset, currentFilters, targetField) {\n  // TODO: Return distinct targetField values with their state ('ACTIVE' or 'DISABLED')\n  \n}",
    "aHint": "Extract all distinct values of targetField, then check if filtering fullDataset with currentFilters yields any records for each value.",
    "aTest": "const data = [\n  { dept: 'Tech', location: 'NY' },\n  { dept: 'HR', location: 'London' }\n];\nconst states = calculateSlicerItemStates(data, { location: ['NY'] }, 'dept');\nif (states.Tech !== 'ACTIVE' || states.HR !== 'DISABLED') throw new Error('Slicer state failed');\nconst noFilter = calculateSlicerItemStates(data, {}, 'dept');\nif (noFilter.Tech !== 'ACTIVE' || noFilter.HR !== 'ACTIVE') throw new Error('No filter state failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Conditional Formatting, Structured Tables, Pivot Tables & Slicers Engine",
    "desc": "Milestone 3: Construct a comprehensive Business Intelligence dashboard suite combining structured Excel Tables, multi-table Pivot summaries, interactive Slicers, and heatmap formats.",
    "syllabus": [
      "End-to-end BI Pipeline: Structured tables -> Pivot Tables -> Interactive Slicers.",
      "Dynamic metric rollups and multi-slicer filtering synchronization.",
      "Milestone 3 certification evaluation."
    ],
    "eTitle": "Integrated Business Intelligence Pipeline Orchestrator",
    "eDesc": "Implement function orchestrateBusinessIntelligenceEngine(rawTransactions, slicerFilters, pivotGroupField) combining filtering, pivot aggregation, and status reporting.",
    "eStarter": "function orchestrateBusinessIntelligenceEngine(rawTransactions, slicerFilters, pivotGroupField) {\n  // TODO: Filter transactions by slicers, group by pivotGroupField, sum revenue, and return BI report\n  \n}",
    "eHint": "Apply slicer filters to rawTransactions, group by pivotGroupField, compute totalRevenue and groupTotals, and verify status 'SPREADSHEET_BI_MASTER_ACTIVE'.",
    "eTest": "const txs = [\n  { region: 'East', channel: 'Web', revenue: 500 },\n  { region: 'East', channel: 'Retail', revenue: 300 },\n  { region: 'West', channel: 'Web', revenue: 400 }\n];\nconst res = orchestrateBusinessIntelligenceEngine(txs, { region: ['East'] }, 'channel');\nif (res.totalRevenue !== 800 || res.groupTotals.Web !== 500 || res.groupTotals.Retail !== 300) throw new Error('BI Pipeline failed');\nif (res.status !== 'SPREADSHEET_BI_MASTER_ACTIVE') throw new Error('BI Status failed');\nconst westRes = orchestrateBusinessIntelligenceEngine(txs, { region: ['West'] }, 'channel');\nif (westRes.totalRevenue !== 400 || westRes.groupTotals.Web !== 400) throw new Error('West BI failed');",
    "aTitle": "BI Dashboard Reconciliation & Grand Total Verifier",
    "aDesc": "Implement function validateBiDashboardPayload(rawTxList, biReportPayload) verifying that the sum of pivot group subtotals perfectly equals the raw ledger transaction total.",
    "aStarter": "function validateBiDashboardPayload(rawTxList, biReportPayload) {\n  // TODO: Verify sum of biReportPayload.groupTotals equals sum of rawTxList filtered revenue\n  \n}",
    "aHint": "Sum all values in biReportPayload.groupTotals and compare against biReportPayload.totalRevenue, returning { isValid: true, variance: 0 }.",
    "aTest": "const validReport = { totalRevenue: 800, groupTotals: { Web: 500, Retail: 300 } };\nif (!validateBiDashboardPayload([], validReport).isValid) throw new Error('Reconciliation valid failed');\nconst invalidReport = { totalRevenue: 800, groupTotals: { Web: 500, Retail: 200 } };\nif (validateBiDashboardPayload([], invalidReport).isValid) throw new Error('Reconciliation mismatch failed');"
  },
  {
    "day": 22,
    "title": "Business Charting & Data Visualization: Chart Type Selection & Secondary Axes",
    "desc": "Communicate insights effectively with professional business charts: Clustered Column vs Stacked Bar, Dual-Axis Combo Charts, Pareto Charts, and clean layout typography.",
    "syllabus": [
      "Chart selection taxonomy: Comparison, Composition, Distribution, and Relationship.",
      "Dual-axis Combo Charts: Plotting Revenue (Bars, Left Axis) against Margin % (Line, Right Axis).",
      "Maximizing Data-Ink Ratio and eliminating chart junk."
    ],
    "eTitle": "Dual-Axis Chart Data Series Normalization Engine",
    "eDesc": "Implement function scaleDualAxisData(primarySeries, secondarySeries) normalizing primary absolute values and secondary percentage metrics onto synchronized 0-100 chart axes.",
    "eStarter": "function scaleDualAxisData(primarySeries, secondarySeries) {\n  // TODO: Normalize primary series (0 to max) and secondary series (0 to 1) onto common 0-100 scale\n  \n}",
    "eHint": "Scale primarySeries by (val / maxPrimary) * 100, and secondarySeries by (val / maxSecondary) * 100, returning normalized series arrays.",
    "eTest": "const p = [500, 1000], s = [0.1, 0.2];\nconst res = scaleDualAxisData(p, s);\nif (res.normalizedPrimary[0] !== 50 || res.normalizedPrimary[1] !== 100) throw new Error('Primary norm failed');\nif (res.normalizedSecondary[0] !== 50 || res.normalizedSecondary[1] !== 100) throw new Error('Secondary norm failed');\nif (res.chartType !== 'COMBO_CHART_DUAL_AXIS') throw new Error('Chart type tag failed');",
    "aTitle": "Business Chart Type Recommendation Engine",
    "aDesc": "Implement function recommendChartTypeForData(intent, seriesCount, hasTimeAxis) determining the optimal visualization ('LINE', 'COMBO', 'BAR', or 'SCATTER') based on data structure.",
    "aStarter": "function recommendChartTypeForData(intent, seriesCount, hasTimeAxis) {\n  // TODO: Return recommended chart type based on communication intent and data dimensionality\n  \n}",
    "aHint": "If hasTimeAxis && seriesCount > 1 && intent === 'TREND_WITH_SHARE' return 'COMBO'; if hasTimeAxis return 'LINE'; if intent === 'RELATIONSHIP' return 'SCATTER'; else 'BAR'.",
    "aTest": "if (recommendChartTypeForData('TREND_WITH_SHARE', 2, true) !== 'COMBO') throw new Error('Combo failed');\nif (recommendChartTypeForData('TREND', 1, true) !== 'LINE') throw new Error('Line failed');\nif (recommendChartTypeForData('RELATIONSHIP', 2, false) !== 'SCATTER') throw new Error('Scatter failed');"
  },
  {
    "day": 23,
    "title": "Financial Modeling Functions: PMT Loan Repayments, NPV, PV, FV & IRR",
    "desc": "Build institutional-grade financial models using discounted cash flow functions: PMT (loan amortizations), NPV (Net Present Value), PV, FV (compound growth), and IRR.",
    "syllabus": [
      "Time Value of Money (TVM) principles and discount rates.",
      "Loan repayment calculations with PMT(rate, nper, pv, [fv], [type]).",
      "Capital budgeting decisions using NPV(rate, values) and IRR(values)."
    ],
    "eTitle": "Monthly Loan Amortization Payment Calculator (PMT)",
    "eDesc": "Implement function calculateMonthlyLoanPmt(annualRatePct, loanTermYears, principalAmount) computing monthly installment payment using the standard PMT formula.",
    "eStarter": "function calculateMonthlyLoanPmt(annualRatePct, loanTermYears, principalAmount) {\n  // TODO: Compute monthly PMT = (P * r) / (1 - (1 + r)^(-n)) where r = annualRate/12 and n = years*12\n  \n}",
    "eHint": "Compute r = (annualRatePct / 100) / 12, n = loanTermYears * 12, PMT = (principalAmount * r) / (1 - Math.pow(1 + r, -n)), rounded to 2 decimals.",
    "eTest": "const pmt1 = calculateMonthlyLoanPmt(6.0, 30, 200000); // ~$1,199.10\nif (Math.abs(pmt1 - 1199.10) > 0.05) throw new Error('30yr loan PMT failed');\nconst pmt2 = calculateMonthlyLoanPmt(5.0, 5, 20000); // ~$377.42\nif (Math.abs(pmt2 - 377.42) > 0.05) throw new Error('5yr auto loan PMT failed');\nconst zeroRate = calculateMonthlyLoanPmt(0, 1, 1200);\nif (zeroRate !== 100) throw new Error('0% rate loan failed');",
    "aTitle": "Investment Compound Future Value Calculator (FV)",
    "aDesc": "Implement function calculateInvestmentFutureValue(annualRatePct, years, annualContribution, initialDeposit) calculating compounded asset growth over time.",
    "aStarter": "function calculateInvestmentFutureValue(annualRatePct, years, annualContribution, initialDeposit) {\n  // TODO: Calculate future value with annual compounding and periodic contributions\n  \n}",
    "aHint": "Compound initial deposit by Math.pow(1 + r, years) and sum future value of annual contributions using geometric series.",
    "aTest": "const fv1 = calculateInvestmentFutureValue(10, 1, 0, 1000); // 1100\nif (fv1 !== 1100) throw new Error('Single year FV failed');\nconst fv2 = calculateInvestmentFutureValue(10, 2, 0, 1000); // 1210\nif (fv2 !== 1210) throw new Error('2 year FV failed');\nconst fv3 = calculateInvestmentFutureValue(0, 5, 100, 500); // 1000\nif (fv3 !== 1000) throw new Error('0% rate FV failed');"
  },
  {
    "day": 24,
    "title": "What-If Analysis & Scenario Planning: Goal Seek & Sensitivity Data Tables",
    "desc": "Perform dynamic financial forecasting and risk assessment using What-If Analysis: Goal Seek back-solving, 1-Variable / 2-Variable Data Tables, and Scenario Manager.",
    "syllabus": [
      "Goal Seek reverse engineering: Finding the required input to reach a target KPI.",
      "1-Variable and 2-Variable Data Table sensitivity grids.",
      "Scenario Manager: Modeling Best Case, Base Case, and Worst Case outcomes."
    ],
    "eTitle": "Production Break-Even Goal Seek Simulator",
    "eDesc": "Implement function simulateGoalSeek(targetProfit, fixedCosts, unitSellingPrice, unitVariableCost) calculating the exact units required to achieve targetProfit.",
    "eStarter": "function simulateGoalSeek(targetProfit, fixedCosts, unitSellingPrice, unitVariableCost) {\n  // TODO: Calculate required units = (fixedCosts + targetProfit) / (unitSellingPrice - unitVariableCost)\n  \n}",
    "eHint": "Compute unitMargin = unitSellingPrice - unitVariableCost. Required units = Math.ceil((fixedCosts + targetProfit) / unitMargin).",
    "eTest": "const units = simulateGoalSeek(50000, 20000, 50, 15); // margin = 35, total = 70k -> 2000 units\nif (units !== 2000) throw new Error('Break-even units failed');\nconst breakEven = simulateGoalSeek(0, 10000, 20, 10); // margin = 10 -> 1000 units\nif (breakEven !== 1000) throw new Error('Zero profit break even failed');\nif (simulateGoalSeek(100, 0, 10, 0) !== 10) throw new Error('Zero cost test failed');",
    "aTitle": "2-Variable Financial Sensitivity Matrix Generator",
    "aDesc": "Implement function generateSensitivityMatrix2D(basePrice, priceDeltas, volumeDeltas, unitCost, fixedCost) generating profit outcomes across price and volume variations.",
    "aStarter": "function generateSensitivityMatrix2D(basePrice, priceDeltas, volumeDeltas, unitCost, fixedCost) {\n  // TODO: Build 2D grid of profits: (price * volume) - (unitCost * volume) - fixedCost\n  \n}",
    "aHint": "For each price in priceDeltas and each volume in volumeDeltas, compute profit = (price - unitCost) * volume - fixedCost.",
    "aTest": "const pDeltas = [40, 50], vDeltas = [100, 200];\nconst matrix = generateSensitivityMatrix2D(50, pDeltas, vDeltas, 20, 1000);\nif (matrix[0][0] !== (20 * 100 - 1000)) throw new Error('P40 V100 profit failed');\nif (matrix[1][1] !== (30 * 200 - 1000)) throw new Error('P50 V200 profit failed');\nif (matrix.length !== 2 || matrix[0].length !== 2) throw new Error('Dimensions failed');"
  },
  {
    "day": 25,
    "title": "Power Query (Get & Transform) I: Data Cleaning, Splitting & Unpivoting",
    "desc": "Automate recurring data preparation pipelines with Power Query: importing external files, unpivoting cross-tabulated reports, splitting columns, and trimming text.",
    "syllabus": [
      "The Power Query ETL architecture (Extract, Transform, Load).",
      "Unpivoting Columns: Converting wide reports into normalized narrow tabular datasets.",
      "Data type transformations and automated refreshable query steps."
    ],
    "eTitle": "Cross-Tab Unpivot ETL Transformation Engine",
    "eDesc": "Implement function unpivotColumnsToRows(wideTable, idColumns, valueColumns) converting wide report columns into normalized attribute-value row pairs.",
    "eStarter": "function unpivotColumnsToRows(wideTable, idColumns, valueColumns) {\n  // TODO: Unpivot wideTable so each valueColumn becomes an attribute-value pair row\n  \n}",
    "eHint": "Iterate through wideTable rows. For each row and for each col in valueColumns, emit an object copying idColumns plus { attribute: col, value: row[col] }.",
    "eTest": "const wide = [\n  { Product: 'Widget', Jan: 100, Feb: 150 },\n  { Product: 'Gadget', Jan: 200, Feb: 250 }\n];\nconst unpivoted = unpivotColumnsToRows(wide, ['Product'], ['Jan', 'Feb']);\nif (unpivoted.length !== 4) throw new Error('Unpivoted length failed');\nif (unpivoted[0].Product !== 'Widget' || unpivoted[0].attribute !== 'Jan' || unpivoted[0].value !== 100) throw new Error('First row failed');\nif (unpivoted[3].Product !== 'Gadget' || unpivoted[3].attribute !== 'Feb' || unpivoted[3].value !== 250) throw new Error('Last row failed');",
    "aTitle": "Column Split by Delimiter ETL Transformer",
    "aDesc": "Implement function splitColumnByDelimiter(records, sourceColumn, delimiter, newColNames) splitting delimited strings into discrete atomic columns.",
    "aStarter": "function splitColumnByDelimiter(records, sourceColumn, delimiter, newColNames) {\n  // TODO: Split record[sourceColumn] by delimiter and assign parts to newColNames\n  \n}",
    "aHint": "For each record, split the sourceColumn string by delimiter and attach newColNames[i]: parts[i] to the resulting object.",
    "aTest": "const data = [{ id: 1, full: 'John-Doe' }, { id: 2, full: 'Jane-Smith' }];\nconst res = splitColumnByDelimiter(data, 'full', '-', ['firstName', 'lastName']);\nif (res[0].firstName !== 'John' || res[0].lastName !== 'Doe') throw new Error('Split John failed');\nif (res[1].firstName !== 'Jane' || res[1].lastName !== 'Smith') throw new Error('Split Jane failed');\nif (res.length !== 2) throw new Error('Length check failed');"
  },
  {
    "day": 26,
    "title": "Power Query (Get & Transform) II: Merging Queries (Joins), Appending & Refresh",
    "desc": "Build multi-source data models with advanced Power Query operations: Inner/Left Outer Joins (Merge Queries), vertical stacking (Append Queries), and M-Code functions.",
    "syllabus": [
      "Merge Queries: Left Outer, Right Outer, Full Outer, and Inner Join semantics.",
      "Append Queries: Unioning datasets with matching or mismatched schemas.",
      "The Power Query formula language (M-Code) fundamentals."
    ],
    "eTitle": "Power Query Relational Merge (Join) Engine",
    "eDesc": "Implement function mergeTablesOnKey(leftTable, rightTable, leftKey, rightKey, joinType = 'LEFT_OUTER') merging two datasets on relational key attributes.",
    "eStarter": "function mergeTablesOnKey(leftTable, rightTable, leftKey, rightKey, joinType = 'LEFT_OUTER') {\n  // TODO: Join leftTable and rightTable on leftKey === rightKey\n  \n}",
    "eHint": "For each leftRow, find matching rightRow where leftRow[leftKey] === rightRow[rightKey], merge properties, and return merged array.",
    "eTest": "const orders = [{ orderId: 1, custId: 101, amount: 50 }, { orderId: 2, custId: 102, amount: 80 }];\nconst custs = [{ id: 101, name: 'Alice' }, { id: 102, name: 'Bob' }];\nconst merged = mergeTablesOnKey(orders, custs, 'custId', 'id');\nif (merged.length !== 2 || merged[0].name !== 'Alice' || merged[1].name !== 'Bob') throw new Error('Merge failed');\nif (merged[0].amount !== 50) throw new Error('Amount preservation failed');\nconst unmatched = mergeTablesOnKey([{ orderId: 3, custId: 999, amount: 10 }], custs, 'custId', 'id');\nif (unmatched.length !== 1 || unmatched[0].name !== undefined) throw new Error('Unmatched join failed');",
    "aTitle": "Power Query Schema-Aligned Append Engine",
    "aDesc": "Implement function appendQueryDatasets(tableA, tableB) vertically combining two tables into a unified dataset while filling missing columns with null.",
    "aStarter": "function appendQueryDatasets(tableA, tableB) {\n  // TODO: Vertically combine tableA and tableB, ensuring all unique columns are represented\n  \n}",
    "aHint": "Find all distinct keys across both tables. Map each row from both tables into an object containing all keys with null as default.",
    "aTest": "const t1 = [{ id: 1, a: 'foo' }], t2 = [{ id: 2, b: 'bar' }];\nconst app = appendQueryDatasets(t1, t2);\nif (app.length !== 2) throw new Error('Append length failed');\nif (app[0].b !== null || app[1].a !== null) throw new Error('Null padding failed');\nif (app[0].a !== 'foo' || app[1].b !== 'bar') throw new Error('Values check failed');"
  },
  {
    "day": 27,
    "title": "Executive Dashboard Design & Layout Principles: KPI Metric Cards & Visual Flow",
    "desc": "Design clean executive dashboards following human visual hierarchy: KPI Summary Cards with actual vs target variances, structured grid layouts, and color restraint.",
    "syllabus": [
      "Executive Dashboard Architecture: Summary cards, trend charts, and breakdown tables.",
      "KPI Metric Card Calculations: Actual, Target, Variance Amount, and Variance %.",
      "Visual hierarchy, Z-pattern flow, and accessible corporate color palettes."
    ],
    "eTitle": "Executive KPI Metric Card Variance Calculator",
    "eDesc": "Implement function calculateKpiCardMetrics(actual, target) computing varianceAmount (actual - target), variancePct, and visual status tag ('EXCEEDED', 'ON_TRACK', 'BEHIND').",
    "eStarter": "function calculateKpiCardMetrics(actual, target) {\n  // TODO: Compute varianceAmount, variancePct ((actual - target) / target * 100), and status\n  \n}",
    "eHint": "Compute varianceAmount = actual - target, variancePct = Number(((varianceAmount / target) * 100).toFixed(2)), and assign status tag based on variancePct.",
    "eTest": "const kpi1 = calculateKpiCardMetrics(120, 100);\nif (kpi1.varianceAmount !== 20 || kpi1.variancePct !== 20.0 || kpi1.status !== 'EXCEEDED') throw new Error('Exceeded KPI failed');\nconst kpi2 = calculateKpiCardMetrics(98, 100);\nif (kpi2.varianceAmount !== -2 || kpi2.variancePct !== -2.0 || kpi2.status !== 'ON_TRACK') throw new Error('On track KPI failed');\nconst kpi3 = calculateKpiCardMetrics(70, 100);\nif (kpi3.variancePct !== -30.0 || kpi3.status !== 'BEHIND') throw new Error('Behind KPI failed');",
    "aTitle": "Dashboard Status Color Badge Formatter",
    "aDesc": "Implement function formatKpiStatusBadge(variancePct, warningThreshold = -5.0) returning 'GREEN_SUCCESS' if variancePct >= 0, 'YELLOW_WARNING' if variancePct >= warningThreshold, else 'RED_ALERT'.",
    "aStarter": "function formatKpiStatusBadge(variancePct, warningThreshold = -5.0) {\n  // TODO: Return status badge class string according to variance thresholds\n  \n}",
    "aHint": "Evaluate variancePct: >= 0 -> 'GREEN_SUCCESS', >= warningThreshold -> 'YELLOW_WARNING', else -> 'RED_ALERT'.",
    "aTest": "if (formatKpiStatusBadge(5.0) !== 'GREEN_SUCCESS') throw new Error('Green failed');\nif (formatKpiStatusBadge(-3.0) !== 'YELLOW_WARNING') throw new Error('Yellow failed');\nif (formatKpiStatusBadge(-10.0) !== 'RED_ALERT') throw new Error('Red failed');\nif (formatKpiStatusBadge(0) !== 'GREEN_SUCCESS') throw new Error('Zero green failed');"
  },
  {
    "day": 28,
    "title": "Spreadsheet Security, Protection & Auditing: Sheet Protection & Formula Locks",
    "desc": "Protect sensitive corporate financial models: unlocking data-entry cells, locking formula cells, password-protecting worksheets, and auditing circular calculation loops.",
    "syllabus": [
      "Cell Locked / Hidden properties and Worksheet Protection activation.",
      "Formula auditing: Detecting circular reference loops and broken external links.",
      "Workbook-level structure protection vs sheet-level range permissions."
    ],
    "eTitle": "Circular Calculation & Dependency Graph Auditor",
    "eDesc": "Implement function auditFormulaPrecedentsAndDependents(cellGraph, startCell) traversing formula dependency trees and detecting circular reference loops.",
    "eStarter": "function auditFormulaPrecedentsAndDependents(cellGraph, startCell) {\n  // TODO: Traverse dependencies of startCell; return { hasCircularRef: bool, visitedCells: [...] }\n  \n}",
    "eHint": "Use Depth-First Search with a visited set and recursion stack. If a node is currently in the active recursion stack, flag hasCircularRef: true.",
    "eTest": "const cleanGraph = { A1: ['B1'], B1: ['C1'], C1: [] };\nif (auditFormulaPrecedentsAndDependents(cleanGraph, 'A1').hasCircularRef) throw new Error('Clean graph false positive');\nconst loopGraph = { A1: ['B1'], B1: ['C1'], C1: ['A1'] };\nif (!auditFormulaPrecedentsAndDependents(loopGraph, 'A1').hasCircularRef) throw new Error('Circular loop detection failed');\nconst leafGraph = { A1: [] };\nif (auditFormulaPrecedentsAndDependents(leafGraph, 'A1').visitedCells.length !== 1) throw new Error('Single node failed');",
    "aTitle": "Worksheet Role-Based Cell Access Guard",
    "aDesc": "Implement function enforceWorksheetPermissions(userRole, isCellLocked, actionType) determining whether an action ('READ', 'EDIT_VALUE', 'EDIT_FORMULA') is allowed.",
    "aStarter": "function enforceWorksheetPermissions(userRole, isCellLocked, actionType) {\n  // TODO: Check if userRole ('ADMIN', 'EDITOR', 'VIEWER') is permitted to perform actionType\n  \n}",
    "aHint": "Admins can perform all actions. Viewers can only 'READ'. Editors can perform 'EDIT_VALUE' on unlocked cells, but cannot edit locked cells.",
    "aTest": "if (!enforceWorksheetPermissions('ADMIN', true, 'EDIT_FORMULA')) throw new Error('Admin edit failed');\nif (enforceWorksheetPermissions('VIEWER', false, 'EDIT_VALUE')) throw new Error('Viewer edit should fail');\nif (!enforceWorksheetPermissions('EDITOR', false, 'EDIT_VALUE')) throw new Error('Editor unlocked edit failed');\nif (enforceWorksheetPermissions('EDITOR', true, 'EDIT_VALUE')) throw new Error('Editor locked edit should fail');"
  },
  {
    "day": 29,
    "title": "AI in Spreadsheets & Future Trends: Excel Copilot & Python in Excel (=PY())",
    "desc": "Leverage modern AI and programmatic capabilities in Excel: natural language formula generation with Copilot, running Python inside cells with =PY(), and pandas DataFrames.",
    "syllabus": [
      "Natural language prompts to complex spreadsheet formulas.",
      "Python in Excel integration (`=PY()` execution in Microsoft Cloud container).",
      "Leveraging pandas DataFrames and matplotlib charts directly in spreadsheet grids."
    ],
    "eTitle": "Python in Excel DataFrame Aggregation Simulator",
    "eDesc": "Implement function simulatePythonInExcelDf(gridData, groupByCol, targetCol, aggFunc) simulating pandas df.groupby(col)[target].agg() inside the =PY() environment.",
    "eStarter": "function simulatePythonInExcelDf(gridData, groupByCol, targetCol, aggFunc = 'sum') {\n  // TODO: Group gridData by groupByCol and compute aggFunc ('sum' or 'mean') on targetCol\n  \n}",
    "eHint": "Group records by groupByCol, extract targetCol numbers, and apply sum or mean calculation, returning formatted result map.",
    "eTest": "const data = [\n  { Dept: 'Sales', Revenue: 100 },\n  { Dept: 'Sales', Revenue: 200 },\n  { Dept: 'Tech', Revenue: 400 }\n];\nconst res = simulatePythonInExcelDf(data, 'Dept', 'Revenue', 'sum');\nif (res.Sales !== 300 || res.Tech !== 400) throw new Error('Python df sum failed');\nconst meanRes = simulatePythonInExcelDf(data, 'Dept', 'Revenue', 'mean');\nif (meanRes.Sales !== 150 || meanRes.Tech !== 400) throw new Error('Python df mean failed');\nconst single = simulatePythonInExcelDf([{ Dept: 'HR', Revenue: 50 }], 'Dept', 'Revenue', 'sum');\nif (single.HR !== 50) throw new Error('Single group sum failed');",
    "aTitle": "Natural Language Formula Intent Parser",
    "aDesc": "Implement function generateExcelFormulaFromPrompt(promptString, rangeAddress) mapping user intent descriptions ('sum', 'average', 'count', 'max') into valid Excel formula syntax.",
    "aStarter": "function generateExcelFormulaFromPrompt(promptString, rangeAddress) {\n  // TODO: Parse prompt keywords and return formula string e.g. '=SUM(A1:A10)'\n  \n}",
    "aHint": "Inspect lowercase prompt: if includes 'sum' -> `=SUM(${rangeAddress})`, 'average' -> `=AVERAGE(${rangeAddress})`, 'count' -> `=COUNT(${rangeAddress})`, 'max' -> `=MAX(${rangeAddress})`.",
    "aTest": "if (generateExcelFormulaFromPrompt('calculate the total sales', 'B2:B20') !== '=SUM(B2:B20)') throw new Error('SUM prompt failed');\nif (generateExcelFormulaFromPrompt('find the average score', 'C1:C50') !== '=AVERAGE(C1:C50)') throw new Error('AVG prompt failed');\nif (generateExcelFormulaFromPrompt('count all items', 'A1:A100') !== '=COUNT(A1:A100)') throw new Error('COUNT prompt failed');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Sovereign Excel & Master Data Analysis Suite",
    "desc": "The ultimate capstone synthesis of PinIT Excel & Data Analytics Engineering: end-to-end multi-sheet corporate financial model, dynamic XLOOKUP pipelines, Pivot BI dashboards, What-If sensitivity tables, and Python analytics.",
    "syllabus": [
      "Full 5-Pillar Architecture: Foundations, Advanced Analytics, Business Intelligence, Financial Modeling, and Executive Dashboards.",
      "End-to-End Workbook Orchestration and Automated Auditing.",
      "Final Capstone Certification Evaluation."
    ],
    "eTitle": "Sovereign Excel & Master Data Analysis Suite Orchestrator",
    "eDesc": "Implement function orchestrateExcelMasterSuite(foundations, analytics, bi, financial, dashboard) certifying comprehensive Excel and data analysis mastery across all 5 operational pillars.",
    "eStarter": "function orchestrateExcelMasterSuite(foundations, analytics, bi, financial, dashboard) {\n  // TODO: Verify all 5 pillar booleans evaluate to true and return master certification payload\n  \n}",
    "eHint": "Verify foundations && analytics && bi && financial && dashboard are all true; return object with isCertified: true, status: 'SOVEREIGN_EXCEL_AND_DATA_ANALYSIS_MASTER_CERTIFIED_NOMINAL'.",
    "eTest": "const ok = orchestrateExcelMasterSuite(true, true, true, true, true);\nconst fail = orchestrateExcelMasterSuite(true, true, false, true, true);\nif (!ok.sovereignExcelMasterCertified || fail.sovereignExcelMasterCertified) throw new Error('Certification flag failed');\nif (!ok.certified || ok.status !== 'SOVEREIGN_EXCEL_AND_DATA_ANALYSIS_MASTER_CERTIFIED_NOMINAL') throw new Error('Status failed');\nif (fail.status !== 'EXCEL_MASTER_SUITE_DEFECT') throw new Error('Defect status failed');",
    "aTitle": "Comprehensive Capital Budgeting DCF Valuation Model",
    "aDesc": "Implement function evaluateEndToEndFinancialModel(initialInvestment, cashFlows, discountRatePct) computing Net Present Value (NPV) and Profitability Index (PI = PV_of_inflows / initialInvestment).",
    "aStarter": "function evaluateEndToEndFinancialModel(initialInvestment, cashFlows, discountRatePct) {\n  // TODO: Calculate NPV = sum(CF_t / (1 + r)^t) - initialInvestment and Profitability Index\n  \n}",
    "aHint": "Discount each cash flow by (1 + discountRatePct/100)^t, sum discounted inflows to get pvInflows, npv = pvInflows - initialInvestment, and pi = pvInflows / initialInvestment.",
    "aTest": "const cfs = [110, 121]; // r = 10% -> pv = 100 + 100 = 200\nconst res = evaluateEndToEndFinancialModel(150, cfs, 10);\nif (Math.abs(res.npv - 50) > 0.01) throw new Error('NPV failed');\nif (Math.abs(res.profitabilityIndex - (200 / 150)) > 0.01) throw new Error('PI failed');\nif (!res.isFeasible) throw new Error('Feasibility check failed');"
  }
];

export const EXCEL_DATA_VIZ_30_DAYS_QUESTS: CourseQuest[] = EXCEL_DATA_VIZ_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('excel_viz', idx + 1, cfg)
);
