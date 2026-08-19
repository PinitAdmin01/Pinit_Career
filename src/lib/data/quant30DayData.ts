import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';

export const QUANT_SYSTEMS_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "Quantitative Engineering & Electronic Trading Foundations",
    desc: "Understand market microstructure, exchanges, market participants (HFT, market makers, institutional), and order types.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Quantitative Engineering & Electronic Trading Foundations.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Quantitative Engineering & Electronic Trading Foundations Validation",
    eDesc: "Implement a JavaScript validation function for Quantitative Engineering & Electronic Trading Foundations.",
    eStarter: "function quantTaskDay1(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay1 !== 'function') throw new Error('Function quantTaskDay1 not found');\nif (quantTaskDay1('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Quantitative Engineering & Electronic Trading Foundations Practice",
    aDesc: "Write an auxiliary helper function for Quantitative Engineering & Electronic Trading Foundations.",
    aStarter: "function quantTaskDay1Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay1Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Limit Order Book (LOB) Architecture",
    desc: "Structure bid and ask price levels, price-time priority (FIFO) queues, market orders, and limit orders.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Limit Order Book (LOB) Architecture.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Limit Order Book (LOB) Architecture Validation",
    eDesc: "Implement a JavaScript validation function for Limit Order Book (LOB) Architecture.",
    eStarter: "function quantTaskDay2(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay2 !== 'function') throw new Error('Function quantTaskDay2 not found');\nif (quantTaskDay2('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Limit Order Book (LOB) Architecture Practice",
    aDesc: "Write an auxiliary helper function for Limit Order Book (LOB) Architecture.",
    aStarter: "function quantTaskDay2Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay2Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Order Book Matching Engine Implementation",
    desc: "Implement ultra-fast order insertion, order execution matching, partial fills, and order cancellation logic.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Order Book Matching Engine Implementation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Order Book Matching Engine Implementation Validation",
    eDesc: "Implement a JavaScript validation function for Order Book Matching Engine Implementation.",
    eStarter: "function quantTaskDay3(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay3 !== 'function') throw new Error('Function quantTaskDay3 not found');\nif (quantTaskDay3('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Order Book Matching Engine Implementation Practice",
    aDesc: "Write an auxiliary helper function for Order Book Matching Engine Implementation.",
    aStarter: "function quantTaskDay3Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay3Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Market Data Feeds: L1 (BBO), L2 (Depth), L3 (Orders)",
    desc: "Process Best Bid and Offer (BBO), multi-level aggregated depth books, and individual order book updates.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Market Data Feeds: L1 (BBO), L2 (Depth), L3 (Orders).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Market Data Feeds: L1 (BBO), L2 (Depth), L3 (Orders) Validation",
    eDesc: "Implement a JavaScript validation function for Market Data Feeds: L1 (BBO), L2 (Depth), L3 (Orders).",
    eStarter: "function quantTaskDay4(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay4 !== 'function') throw new Error('Function quantTaskDay4 not found');\nif (quantTaskDay4('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Market Data Feeds: L1 (BBO), L2 (Depth), L3 (Orders) Practice",
    aDesc: "Write an auxiliary helper function for Market Data Feeds: L1 (BBO), L2 (Depth), L3 (Orders).",
    aStarter: "function quantTaskDay4Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay4Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Volume-Weighted Average Price (VWAP) Calculation",
    desc: "Compute continuous cumulative VWAP benchmarks across trade volume slices and tick price updates.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Volume-Weighted Average Price (VWAP) Calculation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Volume-Weighted Average Price (VWAP) Calculation Validation",
    eDesc: "Implement a JavaScript validation function for Volume-Weighted Average Price (VWAP) Calculation.",
    eStarter: "function quantTaskDay5(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay5 !== 'function') throw new Error('Function quantTaskDay5 not found');\nif (quantTaskDay5('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Volume-Weighted Average Price (VWAP) Calculation Practice",
    aDesc: "Write an auxiliary helper function for Volume-Weighted Average Price (VWAP) Calculation.",
    aStarter: "function quantTaskDay5Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay5Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Time-Weighted Average Price (TWAP) Execution Algos",
    desc: "Design algorithmic execution bots that slice large orders into equal time-interval market orders.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Time-Weighted Average Price (TWAP) Execution Algos.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Time-Weighted Average Price (TWAP) Execution Algos Validation",
    eDesc: "Implement a JavaScript validation function for Time-Weighted Average Price (TWAP) Execution Algos.",
    eStarter: "function quantTaskDay6(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay6 !== 'function') throw new Error('Function quantTaskDay6 not found');\nif (quantTaskDay6('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Time-Weighted Average Price (TWAP) Execution Algos Practice",
    aDesc: "Write an auxiliary helper function for Time-Weighted Average Price (TWAP) Execution Algos.",
    aStarter: "function quantTaskDay6Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay6Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Market Slippage, Spread & Impact Modeling",
    desc: "Model bid-ask spread crossing costs, temporary vs permanent market price impact, and liquidity decay.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Market Slippage, Spread & Impact Modeling.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Market Slippage, Spread & Impact Modeling Validation",
    eDesc: "Implement a JavaScript validation function for Market Slippage, Spread & Impact Modeling.",
    eStarter: "function quantTaskDay7(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay7 !== 'function') throw new Error('Function quantTaskDay7 not found');\nif (quantTaskDay7('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Market Slippage, Spread & Impact Modeling Practice",
    aDesc: "Write an auxiliary helper function for Market Slippage, Spread & Impact Modeling.",
    aStarter: "function quantTaskDay7Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay7Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Tick Data Processing & Financial Time Series",
    desc: "Resample high-frequency tick data into OHLCV candlestick bars (time-based, volume-based, tick-based).",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Tick Data Processing & Financial Time Series.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Tick Data Processing & Financial Time Series Validation",
    eDesc: "Implement a JavaScript validation function for Tick Data Processing & Financial Time Series.",
    eStarter: "function quantTaskDay8(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay8 !== 'function') throw new Error('Function quantTaskDay8 not found');\nif (quantTaskDay8('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Tick Data Processing & Financial Time Series Practice",
    aDesc: "Write an auxiliary helper function for Tick Data Processing & Financial Time Series.",
    aStarter: "function quantTaskDay8Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay8Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Statistical Arbitrage & Pairs Trading Strategy",
    desc: "Calculate cointegration, Augmented Dickey-Fuller (ADF) stationarity, Z-score spread thresholds, and mean-reversion.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Statistical Arbitrage & Pairs Trading Strategy.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Statistical Arbitrage & Pairs Trading Strategy Validation",
    eDesc: "Implement a JavaScript validation function for Statistical Arbitrage & Pairs Trading Strategy.",
    eStarter: "function quantTaskDay9(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay9 !== 'function') throw new Error('Function quantTaskDay9 not found');\nif (quantTaskDay9('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Statistical Arbitrage & Pairs Trading Strategy Practice",
    aDesc: "Write an auxiliary helper function for Statistical Arbitrage & Pairs Trading Strategy.",
    aStarter: "function quantTaskDay9Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay9Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Moving Average Convergence Divergence (MACD) & RSI",
    desc: "Compute exponential moving averages (EMA), MACD signal line crossovers, and Relative Strength Index (RSI).",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Moving Average Convergence Divergence (MACD) & RSI.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Moving Average Convergence Divergence (MACD) & RSI Validation",
    eDesc: "Implement a JavaScript validation function for Moving Average Convergence Divergence (MACD) & RSI.",
    eStarter: "function quantTaskDay10(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay10 !== 'function') throw new Error('Function quantTaskDay10 not found');\nif (quantTaskDay10('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Moving Average Convergence Divergence (MACD) & RSI Practice",
    aDesc: "Write an auxiliary helper function for Moving Average Convergence Divergence (MACD) & RSI.",
    aStarter: "function quantTaskDay10Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay10Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Bollinger Bands & Volatility Breakout Strategies",
    desc: "Calculate rolling standard deviations, upper/lower Bollinger Bands, and mean-reversion trading triggers.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Bollinger Bands & Volatility Breakout Strategies.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Bollinger Bands & Volatility Breakout Strategies Validation",
    eDesc: "Implement a JavaScript validation function for Bollinger Bands & Volatility Breakout Strategies.",
    eStarter: "function quantTaskDay11(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay11 !== 'function') throw new Error('Function quantTaskDay11 not found');\nif (quantTaskDay11('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Bollinger Bands & Volatility Breakout Strategies Practice",
    aDesc: "Write an auxiliary helper function for Bollinger Bands & Volatility Breakout Strategies.",
    aStarter: "function quantTaskDay11Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay11Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Momentum & Trend-Following Quantitative Strategies",
    desc: "Implement breakout signals, multi-timeframe moving average filters, and trailing stop-loss execution.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Momentum & Trend-Following Quantitative Strategies.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Momentum & Trend-Following Quantitative Strategies Validation",
    eDesc: "Implement a JavaScript validation function for Momentum & Trend-Following Quantitative Strategies.",
    eStarter: "function quantTaskDay12(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay12 !== 'function') throw new Error('Function quantTaskDay12 not found');\nif (quantTaskDay12('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Momentum & Trend-Following Quantitative Strategies Practice",
    aDesc: "Write an auxiliary helper function for Momentum & Trend-Following Quantitative Strategies.",
    aStarter: "function quantTaskDay12Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay12Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Market Making Strategies & Spread Capture",
    desc: "Place continuous two-sided limit orders (bid/ask), manage inventory risk, and capture the bid-ask spread.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Market Making Strategies & Spread Capture.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Market Making Strategies & Spread Capture Validation",
    eDesc: "Implement a JavaScript validation function for Market Making Strategies & Spread Capture.",
    eStarter: "function quantTaskDay13(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay13 !== 'function') throw new Error('Function quantTaskDay13 not found');\nif (quantTaskDay13('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Market Making Strategies & Spread Capture Practice",
    aDesc: "Write an auxiliary helper function for Market Making Strategies & Spread Capture.",
    aStarter: "function quantTaskDay13Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay13Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Order Flow Imbalance (OFI) & Microstructure Alpha",
    desc: "Calculate order book volume imbalance between bid and ask sides to predict short-term price movements.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Order Flow Imbalance (OFI) & Microstructure Alpha.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Order Flow Imbalance (OFI) & Microstructure Alpha Validation",
    eDesc: "Implement a JavaScript validation function for Order Flow Imbalance (OFI) & Microstructure Alpha.",
    eStarter: "function quantTaskDay14(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay14 !== 'function') throw new Error('Function quantTaskDay14 not found');\nif (quantTaskDay14('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Order Flow Imbalance (OFI) & Microstructure Alpha Practice",
    aDesc: "Write an auxiliary helper function for Order Flow Imbalance (OFI) & Microstructure Alpha.",
    aStarter: "function quantTaskDay14Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay14Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Risk Management: Value at Risk (VaR) & Expected Shortfall",
    desc: "Compute historical and parametric VaR (99% confidence), max drawdown limits, and portfolio stress tests.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Risk Management: Value at Risk (VaR) & Expected Shortfall.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Risk Management: Value at Risk (VaR) & Expected Shortfall Validation",
    eDesc: "Implement a JavaScript validation function for Risk Management: Value at Risk (VaR) & Expected Shortfall.",
    eStarter: "function quantTaskDay15(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay15 !== 'function') throw new Error('Function quantTaskDay15 not found');\nif (quantTaskDay15('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Risk Management: Value at Risk (VaR) & Expected Shortfall Practice",
    aDesc: "Write an auxiliary helper function for Risk Management: Value at Risk (VaR) & Expected Shortfall.",
    aStarter: "function quantTaskDay15Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay15Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Position Sizing & The Kelly Criterion",
    desc: "Apply Kelly Criterion formula and fractional Kelly to size capital allocations optimally based on edge and odds.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Position Sizing & The Kelly Criterion.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Position Sizing & The Kelly Criterion Validation",
    eDesc: "Implement a JavaScript validation function for Position Sizing & The Kelly Criterion.",
    eStarter: "function quantTaskDay16(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay16 !== 'function') throw new Error('Function quantTaskDay16 not found');\nif (quantTaskDay16('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Position Sizing & The Kelly Criterion Practice",
    aDesc: "Write an auxiliary helper function for Position Sizing & The Kelly Criterion.",
    aStarter: "function quantTaskDay16Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay16Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Stop-Loss, Take-Profit & Trailing Exit Rules",
    desc: "Automate dynamic stop-loss levels, ATR-based trailing exits, and maximum allowable loss limits per day.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Stop-Loss, Take-Profit & Trailing Exit Rules.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Stop-Loss, Take-Profit & Trailing Exit Rules Validation",
    eDesc: "Implement a JavaScript validation function for Stop-Loss, Take-Profit & Trailing Exit Rules.",
    eStarter: "function quantTaskDay17(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay17 !== 'function') throw new Error('Function quantTaskDay17 not found');\nif (quantTaskDay17('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Stop-Loss, Take-Profit & Trailing Exit Rules Practice",
    aDesc: "Write an auxiliary helper function for Stop-Loss, Take-Profit & Trailing Exit Rules.",
    aStarter: "function quantTaskDay17Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay17Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Backtesting Frameworks & Lookahead Bias Prevention",
    desc: "Build event-driven tick-level backtesters with realistic latency delays, fee models, and zero lookahead bias.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Backtesting Frameworks & Lookahead Bias Prevention.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Backtesting Frameworks & Lookahead Bias Prevention Validation",
    eDesc: "Implement a JavaScript validation function for Backtesting Frameworks & Lookahead Bias Prevention.",
    eStarter: "function quantTaskDay18(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay18 !== 'function') throw new Error('Function quantTaskDay18 not found');\nif (quantTaskDay18('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Backtesting Frameworks & Lookahead Bias Prevention Practice",
    aDesc: "Write an auxiliary helper function for Backtesting Frameworks & Lookahead Bias Prevention.",
    aStarter: "function quantTaskDay18Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay18Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Performance Metrics: Sharpe Ratio, Sortino & Calmar",
    desc: "Compute annualized returns, risk-free rate excess, downside deviation Sortino ratio, and max drawdown.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Performance Metrics: Sharpe Ratio, Sortino & Calmar.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Performance Metrics: Sharpe Ratio, Sortino & Calmar Validation",
    eDesc: "Implement a JavaScript validation function for Performance Metrics: Sharpe Ratio, Sortino & Calmar.",
    eStarter: "function quantTaskDay19(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay19 !== 'function') throw new Error('Function quantTaskDay19 not found');\nif (quantTaskDay19('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Performance Metrics: Sharpe Ratio, Sortino & Calmar Practice",
    aDesc: "Write an auxiliary helper function for Performance Metrics: Sharpe Ratio, Sortino & Calmar.",
    aStarter: "function quantTaskDay19Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay19Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Overfitting & Walk-Forward Optimization",
    desc: "Split historical data into in-sample optimization and out-of-sample walk-forward validation windows.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Overfitting & Walk-Forward Optimization.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Overfitting & Walk-Forward Optimization Validation",
    eDesc: "Implement a JavaScript validation function for Overfitting & Walk-Forward Optimization.",
    eStarter: "function quantTaskDay20(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay20 !== 'function') throw new Error('Function quantTaskDay20 not found');\nif (quantTaskDay20('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Overfitting & Walk-Forward Optimization Practice",
    aDesc: "Write an auxiliary helper function for Overfitting & Walk-Forward Optimization.",
    aStarter: "function quantTaskDay20Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay20Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Low-Latency Architecture & C++ Memory Optimization",
    desc: "Eliminate dynamic heap allocations, avoid cache misses with contiguous memory structs, and use ring buffers.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Low-Latency Architecture & C++ Memory Optimization.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Low-Latency Architecture & C++ Memory Optimization Validation",
    eDesc: "Implement a JavaScript validation function for Low-Latency Architecture & C++ Memory Optimization.",
    eStarter: "function quantTaskDay21(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay21 !== 'function') throw new Error('Function quantTaskDay21 not found');\nif (quantTaskDay21('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Low-Latency Architecture & C++ Memory Optimization Practice",
    aDesc: "Write an auxiliary helper function for Low-Latency Architecture & C++ Memory Optimization.",
    aStarter: "function quantTaskDay21Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay21Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Kernel Bypass & Zero-Copy Socket Programming",
    desc: "Utilize Solarflare OpenOnload / DPDK to bypass Linux OS kernel network stacks for sub-microsecond packet processing.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Kernel Bypass & Zero-Copy Socket Programming.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Kernel Bypass & Zero-Copy Socket Programming Validation",
    eDesc: "Implement a JavaScript validation function for Kernel Bypass & Zero-Copy Socket Programming.",
    eStarter: "function quantTaskDay22(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay22 !== 'function') throw new Error('Function quantTaskDay22 not found');\nif (quantTaskDay22('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Kernel Bypass & Zero-Copy Socket Programming Practice",
    aDesc: "Write an auxiliary helper function for Kernel Bypass & Zero-Copy Socket Programming.",
    aStarter: "function quantTaskDay22Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay22Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "High-Frequency Binary Data Protocols (ITCH / OUCH)",
    desc: "Parse Nasdaq ITCH market data feeds and construct ultra-fast binary order execution messages via FIX/OUCH.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of High-Frequency Binary Data Protocols (ITCH / OUCH).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: High-Frequency Binary Data Protocols (ITCH / OUCH) Validation",
    eDesc: "Implement a JavaScript validation function for High-Frequency Binary Data Protocols (ITCH / OUCH).",
    eStarter: "function quantTaskDay23(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay23 !== 'function') throw new Error('Function quantTaskDay23 not found');\nif (quantTaskDay23('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: High-Frequency Binary Data Protocols (ITCH / OUCH) Practice",
    aDesc: "Write an auxiliary helper function for High-Frequency Binary Data Protocols (ITCH / OUCH).",
    aStarter: "function quantTaskDay23Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay23Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "The FIX Protocol (Financial Information eXchange)",
    desc: "Construct tag-value FIX 4.4 message payloads (NewOrderSingle 35=D, ExecutionReport 35=8) over TCP sockets.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of The FIX Protocol (Financial Information eXchange).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: The FIX Protocol (Financial Information eXchange) Validation",
    eDesc: "Implement a JavaScript validation function for The FIX Protocol (Financial Information eXchange).",
    eStarter: "function quantTaskDay24(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay24 !== 'function') throw new Error('Function quantTaskDay24 not found');\nif (quantTaskDay24('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: The FIX Protocol (Financial Information eXchange) Practice",
    aDesc: "Write an auxiliary helper function for The FIX Protocol (Financial Information eXchange).",
    aStarter: "function quantTaskDay24Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay24Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Exchange Gateway Connectivity & Heartbeats",
    desc: "Manage sequence numbers, logon/logout handshakes, session heartbeats, and retransmission requests.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Exchange Gateway Connectivity & Heartbeats.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Exchange Gateway Connectivity & Heartbeats Validation",
    eDesc: "Implement a JavaScript validation function for Exchange Gateway Connectivity & Heartbeats.",
    eStarter: "function quantTaskDay25(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay25 !== 'function') throw new Error('Function quantTaskDay25 not found');\nif (quantTaskDay25('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Exchange Gateway Connectivity & Heartbeats Practice",
    aDesc: "Write an auxiliary helper function for Exchange Gateway Connectivity & Heartbeats.",
    aStarter: "function quantTaskDay25Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay25Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Algorithmic Risk Checks (Pre-Trade Safety Filters)",
    desc: "Implement ultra-fast pre-trade safety controls: fat-finger checks, max order size, and credit limit validations.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Algorithmic Risk Checks (Pre-Trade Safety Filters).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Algorithmic Risk Checks (Pre-Trade Safety Filters) Validation",
    eDesc: "Implement a JavaScript validation function for Algorithmic Risk Checks (Pre-Trade Safety Filters).",
    eStarter: "function quantTaskDay26(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay26 !== 'function') throw new Error('Function quantTaskDay26 not found');\nif (quantTaskDay26('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Algorithmic Risk Checks (Pre-Trade Safety Filters) Practice",
    aDesc: "Write an auxiliary helper function for Algorithmic Risk Checks (Pre-Trade Safety Filters).",
    aStarter: "function quantTaskDay26Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay26Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Co-Location & Geographic Latency Physics",
    desc: "Understand exchange co-location data centers, fiber-optic light speeds, and FPGA hardware execution.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Co-Location & Geographic Latency Physics.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Co-Location & Geographic Latency Physics Validation",
    eDesc: "Implement a JavaScript validation function for Co-Location & Geographic Latency Physics.",
    eStarter: "function quantTaskDay27(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay27 !== 'function') throw new Error('Function quantTaskDay27 not found');\nif (quantTaskDay27('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Co-Location & Geographic Latency Physics Practice",
    aDesc: "Write an auxiliary helper function for Co-Location & Geographic Latency Physics.",
    aStarter: "function quantTaskDay27Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay27Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Crypto Exchange WebSockets & REST APIs (Binance/Coinbase)",
    desc: "Stream live crypto order book diffs, sign HMAC-SHA256 authenticated order payloads, and manage reconnects.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Crypto Exchange WebSockets & REST APIs (Binance/Coinbase).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Crypto Exchange WebSockets & REST APIs (Binance/Coinbase) Validation",
    eDesc: "Implement a JavaScript validation function for Crypto Exchange WebSockets & REST APIs (Binance/Coinbase).",
    eStarter: "function quantTaskDay28(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay28 !== 'function') throw new Error('Function quantTaskDay28 not found');\nif (quantTaskDay28('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Crypto Exchange WebSockets & REST APIs (Binance/Coinbase) Practice",
    aDesc: "Write an auxiliary helper function for Crypto Exchange WebSockets & REST APIs (Binance/Coinbase).",
    aStarter: "function quantTaskDay28Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay28Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Regulatory Compliance & Market Manipulation Detection",
    desc: "Implement safeguards against spoofing, layering, wash trading, and comply with SEC / SEBI algorithmic guidelines.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Regulatory Compliance & Market Manipulation Detection.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Regulatory Compliance & Market Manipulation Detection Validation",
    eDesc: "Implement a JavaScript validation function for Regulatory Compliance & Market Manipulation Detection.",
    eStarter: "function quantTaskDay29(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay29 !== 'function') throw new Error('Function quantTaskDay29 not found');\nif (quantTaskDay29('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Regulatory Compliance & Market Manipulation Detection Practice",
    aDesc: "Write an auxiliary helper function for Regulatory Compliance & Market Manipulation Detection.",
    aStarter: "function quantTaskDay29Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay29Aux !== 'function') throw new Error('Auxiliary function not found');"
  },
  {
    title: "Capstone: Ultra-Low-Latency Automated Market Making Bot",
    desc: "Build an event-driven market making bot with sub-millisecond order book updates, VWAP execution, and strict risk limits.",
    syllabus: [
      "Core Foundations: Principles and mechanisms of Capstone: Ultra-Low-Latency Automated Market Making Bot.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    eTitle: "Exam: Capstone: Ultra-Low-Latency Automated Market Making Bot Validation",
    eDesc: "Implement a JavaScript validation function for Capstone: Ultra-Low-Latency Automated Market Making Bot.",
    eStarter: "function quantTaskDay30(input) {\n    return Boolean(input);\n}",
    eHint: "Verify that input exists and satisfies required parameters.",
    eTest: "if (typeof quantTaskDay30 !== 'function') throw new Error('Function quantTaskDay30 not found');\nif (quantTaskDay30('valid') !== true) throw new Error('Expected true for valid input');",
    aTitle: "Assignment: Capstone: Ultra-Low-Latency Automated Market Making Bot Practice",
    aDesc: "Write an auxiliary helper function for Capstone: Ultra-Low-Latency Automated Market Making Bot.",
    aStarter: "function quantTaskDay30Aux(data) {\n    return Boolean(data);\n}",
    aHint: "Return true for valid data payload.",
    aTest: "if (typeof quantTaskDay30Aux !== 'function') throw new Error('Auxiliary function not found');"
  }
];

export const QUANT_SYSTEMS_30_DAYS_QUESTS = QUANT_SYSTEMS_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('quant', i + 1, cfg)
);
