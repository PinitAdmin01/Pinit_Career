import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';

export const EXCEL_DATA_VIZ_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "Spreadsheet Architecture & Navigation",
    desc: "Master workbook sheets, cell grids, address ranges, keyboard shortcuts, and data type formatting.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Spreadsheet Architecture & Navigation.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Spreadsheet Architecture & Navigation Mastery",
    eDesc: "Implement a JavaScript validation function for Spreadsheet Architecture & Navigation.",
    eStarter: "function exTaskDay1(input) {\n    // Return true if input is valid for Spreadsheet Architecture & Navigation\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay1 !== 'function') throw new Error('Function exTaskDay1 not found');\nif (exTaskDay1('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Spreadsheet Architecture & Navigation Workshop",
    aDesc: "Write an auxiliary function to support Spreadsheet Architecture & Navigation.",
    aStarter: "function exTaskDay1Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay1Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Basic Mathematical & Aggregation Functions",
    desc: "Compute `SUM`, `AVERAGE`, `COUNT`, `MIN`, `MAX`, and `ROUND` across large column ranges.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Basic Mathematical & Aggregation Functions.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Basic Mathematical & Aggregation Functions Mastery",
    eDesc: "Implement a JavaScript validation function for Basic Mathematical & Aggregation Functions.",
    eStarter: "function exTaskDay2(input) {\n    // Return true if input is valid for Basic Mathematical & Aggregation Functions\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay2 !== 'function') throw new Error('Function exTaskDay2 not found');\nif (exTaskDay2('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Basic Mathematical & Aggregation Functions Workshop",
    aDesc: "Write an auxiliary function to support Basic Mathematical & Aggregation Functions.",
    aStarter: "function exTaskDay2Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay2Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Relative vs Absolute Cell Referencing ($A$1)",
    desc: "Lock row and column coordinates using `$` markers for formula drag-and-fill operations.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Relative vs Absolute Cell Referencing ($A$1).",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Relative vs Absolute Cell Referencing ($A$1) Mastery",
    eDesc: "Implement a JavaScript validation function for Relative vs Absolute Cell Referencing ($A$1).",
    eStarter: "function exTaskDay3(input) {\n    // Return true if input is valid for Relative vs Absolute Cell Referencing ($A$1)\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay3 !== 'function') throw new Error('Function exTaskDay3 not found');\nif (exTaskDay3('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Relative vs Absolute Cell Referencing ($A$1) Workshop",
    aDesc: "Write an auxiliary function to support Relative vs Absolute Cell Referencing ($A$1).",
    aStarter: "function exTaskDay3Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay3Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Logical Formulas (IF, AND, OR, NOT)",
    desc: "Construct branching conditional logic to evaluate student grades, sales commissions, and tier levels.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Logical Formulas (IF, AND, OR, NOT).",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Logical Formulas (IF, AND, OR, NOT) Mastery",
    eDesc: "Implement a JavaScript validation function for Logical Formulas (IF, AND, OR, NOT).",
    eStarter: "function exTaskDay4(input) {\n    // Return true if input is valid for Logical Formulas (IF, AND, OR, NOT)\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay4 !== 'function') throw new Error('Function exTaskDay4 not found');\nif (exTaskDay4('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Logical Formulas (IF, AND, OR, NOT) Workshop",
    aDesc: "Write an auxiliary function to support Logical Formulas (IF, AND, OR, NOT).",
    aStarter: "function exTaskDay4Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay4Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Nested IFs & Modern IFS Functions",
    desc: "Structure multi-condition grading brackets and tiered pricing formulas cleanly.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Nested IFs & Modern IFS Functions.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Nested IFs & Modern IFS Functions Mastery",
    eDesc: "Implement a JavaScript validation function for Nested IFs & Modern IFS Functions.",
    eStarter: "function exTaskDay5(input) {\n    // Return true if input is valid for Nested IFs & Modern IFS Functions\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay5 !== 'function') throw new Error('Function exTaskDay5 not found');\nif (exTaskDay5('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Nested IFs & Modern IFS Functions Workshop",
    aDesc: "Write an auxiliary function to support Nested IFs & Modern IFS Functions.",
    aStarter: "function exTaskDay5Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay5Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Text Manipulation (CONCAT, LEFT, RIGHT, MID, TRIM)",
    desc: "Clean messy text data, split first/last names, remove leading whitespace, and format strings.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Text Manipulation (CONCAT, LEFT, RIGHT, MID, TRIM).",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Text Manipulation (CONCAT, LEFT, RIGHT, MID, TRIM) Mastery",
    eDesc: "Implement a JavaScript validation function for Text Manipulation (CONCAT, LEFT, RIGHT, MID, TRIM).",
    eStarter: "function exTaskDay6(input) {\n    // Return true if input is valid for Text Manipulation (CONCAT, LEFT, RIGHT, MID, TRIM)\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay6 !== 'function') throw new Error('Function exTaskDay6 not found');\nif (exTaskDay6('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Text Manipulation (CONCAT, LEFT, RIGHT, MID, TRIM) Workshop",
    aDesc: "Write an auxiliary function to support Text Manipulation (CONCAT, LEFT, RIGHT, MID, TRIM).",
    aStarter: "function exTaskDay6Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay6Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Date & Time Functions (TODAY, DATEDIF, EDATE)",
    desc: "Calculate project durations, employee tenure, invoice aging, and fiscal quarter boundaries.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Date & Time Functions (TODAY, DATEDIF, EDATE).",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Date & Time Functions (TODAY, DATEDIF, EDATE) Mastery",
    eDesc: "Implement a JavaScript validation function for Date & Time Functions (TODAY, DATEDIF, EDATE).",
    eStarter: "function exTaskDay7(input) {\n    // Return true if input is valid for Date & Time Functions (TODAY, DATEDIF, EDATE)\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay7 !== 'function') throw new Error('Function exTaskDay7 not found');\nif (exTaskDay7('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Date & Time Functions (TODAY, DATEDIF, EDATE) Workshop",
    aDesc: "Write an auxiliary function to support Date & Time Functions (TODAY, DATEDIF, EDATE).",
    aStarter: "function exTaskDay7Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay7Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Conditional Aggregations (SUMIF, COUNTIF, AVERAGEIF)",
    desc: "Aggregate numerical metrics filtered by specific categories, departments, or dates.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Conditional Aggregations (SUMIF, COUNTIF, AVERAGEIF).",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Conditional Aggregations (SUMIF, COUNTIF, AVERAGEIF) Mastery",
    eDesc: "Implement a JavaScript validation function for Conditional Aggregations (SUMIF, COUNTIF, AVERAGEIF).",
    eStarter: "function exTaskDay8(input) {\n    // Return true if input is valid for Conditional Aggregations (SUMIF, COUNTIF, AVERAGEIF)\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay8 !== 'function') throw new Error('Function exTaskDay8 not found');\nif (exTaskDay8('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Conditional Aggregations (SUMIF, COUNTIF, AVERAGEIF) Workshop",
    aDesc: "Write an auxiliary function to support Conditional Aggregations (SUMIF, COUNTIF, AVERAGEIF).",
    aStarter: "function exTaskDay8Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay8Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Multi-Condition Analytics (SUMIFS, COUNTIFS, AVERAGEIFS)",
    desc: "Compute multi-variable business metrics across region, product, and date filters simultaneously.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Multi-Condition Analytics (SUMIFS, COUNTIFS, AVERAGEIFS).",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Multi-Condition Analytics (SUMIFS, COUNTIFS, AVERAGEIFS) Mastery",
    eDesc: "Implement a JavaScript validation function for Multi-Condition Analytics (SUMIFS, COUNTIFS, AVERAGEIFS).",
    eStarter: "function exTaskDay9(input) {\n    // Return true if input is valid for Multi-Condition Analytics (SUMIFS, COUNTIFS, AVERAGEIFS)\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay9 !== 'function') throw new Error('Function exTaskDay9 not found');\nif (exTaskDay9('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Multi-Condition Analytics (SUMIFS, COUNTIFS, AVERAGEIFS) Workshop",
    aDesc: "Write an auxiliary function to support Multi-Condition Analytics (SUMIFS, COUNTIFS, AVERAGEIFS).",
    aStarter: "function exTaskDay9Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay9Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "VLOOKUP & Common Lookup Pitfalls",
    desc: "Search exact match data across columns, avoid `#N/A` errors, and lock lookup table arrays.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of VLOOKUP & Common Lookup Pitfalls.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: VLOOKUP & Common Lookup Pitfalls Mastery",
    eDesc: "Implement a JavaScript validation function for VLOOKUP & Common Lookup Pitfalls.",
    eStarter: "function exTaskDay10(input) {\n    // Return true if input is valid for VLOOKUP & Common Lookup Pitfalls\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay10 !== 'function') throw new Error('Function exTaskDay10 not found');\nif (exTaskDay10('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: VLOOKUP & Common Lookup Pitfalls Workshop",
    aDesc: "Write an auxiliary function to support VLOOKUP & Common Lookup Pitfalls.",
    aStarter: "function exTaskDay10Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay10Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Modern XLOOKUP Mastery",
    desc: "Utilize bidirectional lookups, default fallback values, and multi-column array returns.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Modern XLOOKUP Mastery.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Modern XLOOKUP Mastery Mastery",
    eDesc: "Implement a JavaScript validation function for Modern XLOOKUP Mastery.",
    eStarter: "function exTaskDay11(input) {\n    // Return true if input is valid for Modern XLOOKUP Mastery\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay11 !== 'function') throw new Error('Function exTaskDay11 not found');\nif (exTaskDay11('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Modern XLOOKUP Mastery Workshop",
    aDesc: "Write an auxiliary function to support Modern XLOOKUP Mastery.",
    aStarter: "function exTaskDay11Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay11Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "INDEX and MATCH Two-Way Lookups",
    desc: "Build dynamic matrix lookups combining row and column match coordinates.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of INDEX and MATCH Two-Way Lookups.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: INDEX and MATCH Two-Way Lookups Mastery",
    eDesc: "Implement a JavaScript validation function for INDEX and MATCH Two-Way Lookups.",
    eStarter: "function exTaskDay12(input) {\n    // Return true if input is valid for INDEX and MATCH Two-Way Lookups\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay12 !== 'function') throw new Error('Function exTaskDay12 not found');\nif (exTaskDay12('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: INDEX and MATCH Two-Way Lookups Workshop",
    aDesc: "Write an auxiliary function to support INDEX and MATCH Two-Way Lookups.",
    aStarter: "function exTaskDay12Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay12Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Data Cleaning & Deduplication",
    desc: "Remove duplicate rows, apply Flash Fill for pattern recognition, and fix number-stored-as-text errors.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Data Cleaning & Deduplication.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Data Cleaning & Deduplication Mastery",
    eDesc: "Implement a JavaScript validation function for Data Cleaning & Deduplication.",
    eStarter: "function exTaskDay13(input) {\n    // Return true if input is valid for Data Cleaning & Deduplication\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay13 !== 'function') throw new Error('Function exTaskDay13 not found');\nif (exTaskDay13('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Data Cleaning & Deduplication Workshop",
    aDesc: "Write an auxiliary function to support Data Cleaning & Deduplication.",
    aStarter: "function exTaskDay13Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay13Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Data Validation & Dropdown Menus",
    desc: "Restrict cell inputs to valid date ranges, numerical limits, and custom dynamic dropdown lists.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Data Validation & Dropdown Menus.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Data Validation & Dropdown Menus Mastery",
    eDesc: "Implement a JavaScript validation function for Data Validation & Dropdown Menus.",
    eStarter: "function exTaskDay14(input) {\n    // Return true if input is valid for Data Validation & Dropdown Menus\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay14 !== 'function') throw new Error('Function exTaskDay14 not found');\nif (exTaskDay14('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Data Validation & Dropdown Menus Workshop",
    aDesc: "Write an auxiliary function to support Data Validation & Dropdown Menus.",
    aStarter: "function exTaskDay14Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay14Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Conditional Formatting & Data Bars",
    desc: "Highlight top/bottom 10% performers, apply color scales, and render inline mini data bars.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Conditional Formatting & Data Bars.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Conditional Formatting & Data Bars Mastery",
    eDesc: "Implement a JavaScript validation function for Conditional Formatting & Data Bars.",
    eStarter: "function exTaskDay15(input) {\n    // Return true if input is valid for Conditional Formatting & Data Bars\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay15 !== 'function') throw new Error('Function exTaskDay15 not found');\nif (exTaskDay15('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Conditional Formatting & Data Bars Workshop",
    aDesc: "Write an auxiliary function to support Conditional Formatting & Data Bars.",
    aStarter: "function exTaskDay15Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay15Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Pivot Table Fundamentals",
    desc: "Summarize 50,000 transaction records by dragging fields into Rows, Columns, Values, and Filters.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Pivot Table Fundamentals.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Pivot Table Fundamentals Mastery",
    eDesc: "Implement a JavaScript validation function for Pivot Table Fundamentals.",
    eStarter: "function exTaskDay16(input) {\n    // Return true if input is valid for Pivot Table Fundamentals\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay16 !== 'function') throw new Error('Function exTaskDay16 not found');\nif (exTaskDay16('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Pivot Table Fundamentals Workshop",
    aDesc: "Write an auxiliary function to support Pivot Table Fundamentals.",
    aStarter: "function exTaskDay16Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay16Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Pivot Table Grouping & Calculated Fields",
    desc: "Group daily dates into quarters/months and add custom margin/commission calculated formulas.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Pivot Table Grouping & Calculated Fields.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Pivot Table Grouping & Calculated Fields Mastery",
    eDesc: "Implement a JavaScript validation function for Pivot Table Grouping & Calculated Fields.",
    eStarter: "function exTaskDay17(input) {\n    // Return true if input is valid for Pivot Table Grouping & Calculated Fields\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay17 !== 'function') throw new Error('Function exTaskDay17 not found');\nif (exTaskDay17('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Pivot Table Grouping & Calculated Fields Workshop",
    aDesc: "Write an auxiliary function to support Pivot Table Grouping & Calculated Fields.",
    aStarter: "function exTaskDay17Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay17Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Slicers & Dynamic Pivot Filtering",
    desc: "Connect multi-pivot slicers to create synchronized interactive filtering controls.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Slicers & Dynamic Pivot Filtering.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Slicers & Dynamic Pivot Filtering Mastery",
    eDesc: "Implement a JavaScript validation function for Slicers & Dynamic Pivot Filtering.",
    eStarter: "function exTaskDay18(input) {\n    // Return true if input is valid for Slicers & Dynamic Pivot Filtering\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay18 !== 'function') throw new Error('Function exTaskDay18 not found');\nif (exTaskDay18('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Slicers & Dynamic Pivot Filtering Workshop",
    aDesc: "Write an auxiliary function to support Slicers & Dynamic Pivot Filtering.",
    aStarter: "function exTaskDay18Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay18Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Chart Fundamentals (Bar, Column, Line, Pie)",
    desc: "Select appropriate visual chart types for categorical comparisons, trend lines, and compositions.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Chart Fundamentals (Bar, Column, Line, Pie).",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Chart Fundamentals (Bar, Column, Line, Pie) Mastery",
    eDesc: "Implement a JavaScript validation function for Chart Fundamentals (Bar, Column, Line, Pie).",
    eStarter: "function exTaskDay19(input) {\n    // Return true if input is valid for Chart Fundamentals (Bar, Column, Line, Pie)\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay19 !== 'function') throw new Error('Function exTaskDay19 not found');\nif (exTaskDay19('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Chart Fundamentals (Bar, Column, Line, Pie) Workshop",
    aDesc: "Write an auxiliary function to support Chart Fundamentals (Bar, Column, Line, Pie).",
    aStarter: "function exTaskDay19Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay19Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Dual-Axis & Combination Charts",
    desc: "Plot sales revenue (column) and profit margin % (line) on a dual-axis coordinate system.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Dual-Axis & Combination Charts.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Dual-Axis & Combination Charts Mastery",
    eDesc: "Implement a JavaScript validation function for Dual-Axis & Combination Charts.",
    eStarter: "function exTaskDay20(input) {\n    // Return true if input is valid for Dual-Axis & Combination Charts\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay20 !== 'function') throw new Error('Function exTaskDay20 not found');\nif (exTaskDay20('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Dual-Axis & Combination Charts Workshop",
    aDesc: "Write an auxiliary function to support Dual-Axis & Combination Charts.",
    aStarter: "function exTaskDay20Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay20Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Waterfall & Financial Charts",
    desc: "Visualize positive cash inflows and negative expense drains leading to net profit totals.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Waterfall & Financial Charts.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Waterfall & Financial Charts Mastery",
    eDesc: "Implement a JavaScript validation function for Waterfall & Financial Charts.",
    eStarter: "function exTaskDay21(input) {\n    // Return true if input is valid for Waterfall & Financial Charts\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay21 !== 'function') throw new Error('Function exTaskDay21 not found');\nif (exTaskDay21('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Waterfall & Financial Charts Workshop",
    aDesc: "Write an auxiliary function to support Waterfall & Financial Charts.",
    aStarter: "function exTaskDay21Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay21Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Sparklines & In-Cell Micro Visuals",
    desc: "Embed compact trendline sparklines directly within table cells for executive summary rows.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Sparklines & In-Cell Micro Visuals.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Sparklines & In-Cell Micro Visuals Mastery",
    eDesc: "Implement a JavaScript validation function for Sparklines & In-Cell Micro Visuals.",
    eStarter: "function exTaskDay22(input) {\n    // Return true if input is valid for Sparklines & In-Cell Micro Visuals\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay22 !== 'function') throw new Error('Function exTaskDay22 not found');\nif (exTaskDay22('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Sparklines & In-Cell Micro Visuals Workshop",
    aDesc: "Write an auxiliary function to support Sparklines & In-Cell Micro Visuals.",
    aStarter: "function exTaskDay22Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay22Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "What-If Analysis & Goal Seek",
    desc: "Back-solve target revenue numbers by adjusting unit pricing and conversion rate variables.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of What-If Analysis & Goal Seek.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: What-If Analysis & Goal Seek Mastery",
    eDesc: "Implement a JavaScript validation function for What-If Analysis & Goal Seek.",
    eStarter: "function exTaskDay23(input) {\n    // Return true if input is valid for What-If Analysis & Goal Seek\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay23 !== 'function') throw new Error('Function exTaskDay23 not found');\nif (exTaskDay23('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: What-If Analysis & Goal Seek Workshop",
    aDesc: "Write an auxiliary function to support What-If Analysis & Goal Seek.",
    aStarter: "function exTaskDay23Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay23Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Data Tables & Scenario Manager",
    desc: "Model best-case, base-case, and worst-case financial projections across interest rate changes.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Data Tables & Scenario Manager.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Data Tables & Scenario Manager Mastery",
    eDesc: "Implement a JavaScript validation function for Data Tables & Scenario Manager.",
    eStarter: "function exTaskDay24(input) {\n    // Return true if input is valid for Data Tables & Scenario Manager\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay24 !== 'function') throw new Error('Function exTaskDay24 not found');\nif (exTaskDay24('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Data Tables & Scenario Manager Workshop",
    aDesc: "Write an auxiliary function to support Data Tables & Scenario Manager.",
    aStarter: "function exTaskDay24Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay24Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Excel Tables & Structured References",
    desc: "Convert raw ranges to dynamic Excel Tables with auto-expanding formulas and column naming.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Excel Tables & Structured References.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Excel Tables & Structured References Mastery",
    eDesc: "Implement a JavaScript validation function for Excel Tables & Structured References.",
    eStarter: "function exTaskDay25(input) {\n    // Return true if input is valid for Excel Tables & Structured References\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay25 !== 'function') throw new Error('Function exTaskDay25 not found');\nif (exTaskDay25('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Excel Tables & Structured References Workshop",
    aDesc: "Write an auxiliary function to support Excel Tables & Structured References.",
    aStarter: "function exTaskDay25Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay25Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Introduction to Power Query",
    desc: "Extract, transform, and load (ETL) messy external CSV files with automated cleaning steps.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Introduction to Power Query.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Introduction to Power Query Mastery",
    eDesc: "Implement a JavaScript validation function for Introduction to Power Query.",
    eStarter: "function exTaskDay26(input) {\n    // Return true if input is valid for Introduction to Power Query\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay26 !== 'function') throw new Error('Function exTaskDay26 not found');\nif (exTaskDay26('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Introduction to Power Query Workshop",
    aDesc: "Write an auxiliary function to support Introduction to Power Query.",
    aStarter: "function exTaskDay26Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay26Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Data Modeling & Relationships",
    desc: "Link Customers, Orders, and Products tables into a star schema data model.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Data Modeling & Relationships.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Data Modeling & Relationships Mastery",
    eDesc: "Implement a JavaScript validation function for Data Modeling & Relationships.",
    eStarter: "function exTaskDay27(input) {\n    // Return true if input is valid for Data Modeling & Relationships\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay27 !== 'function') throw new Error('Function exTaskDay27 not found');\nif (exTaskDay27('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Data Modeling & Relationships Workshop",
    aDesc: "Write an auxiliary function to support Data Modeling & Relationships.",
    aStarter: "function exTaskDay27Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay27Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Executive Dashboard Design Principles",
    desc: "Structure high-contrast visual hierarchy, eliminate chart junk, and display core KPI scorecards.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Executive Dashboard Design Principles.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Executive Dashboard Design Principles Mastery",
    eDesc: "Implement a JavaScript validation function for Executive Dashboard Design Principles.",
    eStarter: "function exTaskDay28(input) {\n    // Return true if input is valid for Executive Dashboard Design Principles\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay28 !== 'function') throw new Error('Function exTaskDay28 not found');\nif (exTaskDay28('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Executive Dashboard Design Principles Workshop",
    aDesc: "Write an auxiliary function to support Executive Dashboard Design Principles.",
    aStarter: "function exTaskDay28Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay28Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Protecting Worksheets & Sharing Controls",
    desc: "Lock formula cells, password-protect financial models, and configure audit track changes.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Protecting Worksheets & Sharing Controls.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Protecting Worksheets & Sharing Controls Mastery",
    eDesc: "Implement a JavaScript validation function for Protecting Worksheets & Sharing Controls.",
    eStarter: "function exTaskDay29(input) {\n    // Return true if input is valid for Protecting Worksheets & Sharing Controls\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay29 !== 'function') throw new Error('Function exTaskDay29 not found');\nif (exTaskDay29('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Protecting Worksheets & Sharing Controls Workshop",
    aDesc: "Write an auxiliary function to support Protecting Worksheets & Sharing Controls.",
    aStarter: "function exTaskDay29Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay29Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Capstone: Interactive Financial Executive Dashboard",
    desc: "Build an end-to-end interactive financial dashboard with KPI cards, Pivot Tables, and dynamic slicers.",
    syllabus: [
      "Foundational Principles: Core theory and mechanics of Capstone: Interactive Financial Executive Dashboard.",
      "Practical Application: Hands-on implementation patterns and workflow execution.",
      "Professional Best Practices: Quality standards, common traps, and performance optimizations."
    ],
    eTitle: "Exam: Capstone: Interactive Financial Executive Dashboard Mastery",
    eDesc: "Implement a JavaScript validation function for Capstone: Interactive Financial Executive Dashboard.",
    eStarter: "function exTaskDay30(input) {\n    // Return true if input is valid for Capstone: Interactive Financial Executive Dashboard\n    return Boolean(input);\n}",
    eHint: "Ensure the function returns true for valid input payloads.",
    eTest: "if (typeof exTaskDay30 !== 'function') throw new Error('Function exTaskDay30 not found');\nif (exTaskDay30('test') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Capstone: Interactive Financial Executive Dashboard Workshop",
    aDesc: "Write an auxiliary function to support Capstone: Interactive Financial Executive Dashboard.",
    aStarter: "function exTaskDay30Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return truthy result when data is present.",
    aTest: "if (typeof exTaskDay30Aux !== 'function') throw new Error('Auxiliary function not found');"
  }
];

export const EXCEL_DATA_VIZ_30_DAYS_QUESTS = EXCEL_DATA_VIZ_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('ex', i + 1, cfg)
);
