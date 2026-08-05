import { buildEnrichedDayQuests } from './curriculumEnricher';
export interface DayConfig {
  title: string;
  desc: string;
  syllabus: string[];
  eTitle: string;
  eDesc: string;
  eStarter: string;
  eHint: string;
  eTest: string;
  aTitle: string;
  aDesc: string;
  aStarter: string;
  aHint: string;
  aTest: string;
}

export const QUANT_SYSTEMS_30_DAYS_CONFIGS: DayConfig[] = [
  {
    title: "What is Quantitative Trading? — Order Books, Bid-Ask Spreads and Latency Basics",
    desc: "Quantitative Trading (or 'Quant' finance) is the use of computer algorithms, mathematical models, and massive datasets to analyze financial markets and execute trades. Before computers, humans stood in trading pits yelling buy and sell orders. Today, trading is entirely digital. To understand how markets work, we must study the LIMIT ORDER BOOK (LOB). The LOB is a live, matching database of all pending buy and sell orders on an exchange (like NASDAQ). The book has two sides: (1) Bids (Buy side): orders from people who want to buy. Bids are sorted in descending order — the highest bid price sits at the top. (2) Asks (Sell side): orders from people who want to sell. Asks are sorted in ascending order — the lowest ask price sits at the top. The difference between the lowest sell price (Best Ask) and the highest buy price (Best Bid) is called the BID-ASK SPREAD. For example, if the best bid is $100.00 and the best ask is $100.02, the spread is $0.02. Market maker firms make profits by continuously buying at the bid and selling at the ask, capturing this spread. LATENCY: in high-frequency trading (HFT), speed is everything. Latency is the time delay (measured in microseconds or nanoseconds) for a trading signal to travel from a firm's servers to the exchange. If your algorithm is 1 microsecond slower than a competitor's, you will miss the trade. (Real world: To get the lowest possible latency, quant firms buy co-location server space inside the same physical building where the exchange matching engines are located. Doing this reduces network cable lengths to feet, eliminating speed-of-light travel delays.)",
    syllabus: ["Quantitative Trading = algorithmic and model-driven trading. Limit Order Book (LOB): the database of all active buy (bids) and sell (asks) orders on an exchange.", "Bid-Ask Spread: the difference between the lowest sell order (Best Ask) and the highest buy order (Best Bid). This spread represents transaction cost and market maker margins.", "Latency: signal travel time delays (milliseconds down to nanoseconds). Why speed is the ultimate edge in algorithmic arbitrage, and the role of server co-location."],
    eTitle: "Exam: Order Book Initializer",
    eDesc: "Not tested on day 1",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Spread Calculator",
    aDesc: "Not tested on day 1",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Exchange Matching Engines — Price-Time Priority and Tick Data Databases",
    desc: "When thousands of buy and sell orders arrive at an exchange every second, how does the exchange decide who gets to trade first? This is handled by the MATCHING ENGINE. The matching engine is the core software of the exchange. It operates on a strict set of rules called PRICE-TIME PRIORITY (often called FIFO — First In, First Out). The rules work as follows: (1) Price Priority: the buyer offering the highest price always gets matched first. The seller offering the lowest price always gets matched first. (2) Time Priority: if two buyers offer the exact same price, the buyer who submitted their order first gets matched first. WHAT IS TICK DATA? Every single event that happens on the exchange — a new order added, an order canceled, or a trade executed — is recorded with a nanosecond timestamp. This stream of events is called Tick Data. Tick data is massive, often generating terabytes of data per day. To process and backtest trading strategies, quants use specialized columnar databases (like kdb+/q or Parquet files) that can replay this historical data rapidly. (Real world: In 2010, the Flash Crash occurred when an algorithmic sell order triggered a cascade of automated trades. In just 36 minutes, the US stock market lost $1 trillion in value before recovering. Quants analyzed raw tick data logs to reconstruct the order book second-by-second, debugging the market structure errors.)",
    syllabus: ["Matching Engine: the central exchange software that matches buyers and sellers using Price-Time Priority (highest bid and lowest ask matched first).", "Time Priority (FIFO): when order prices are identical, the matching engine processes the oldest order first, rewarding queue priority.", "Tick Data: microsecond-precision records of all order changes, cancellations, and execution transactions. Collected in columnar formats for strategy backtesting."],
    eTitle: "Exam: Multicast feed verify",
    eDesc: "Not tested on day 2",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Tick price delta change",
    aDesc: "Not tested on day 2",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Order Book Queue: Bid-Ask Spread Auditor",
    desc: "Calculate bid-ask metrics. (Real world: Smart router components analyze best bids and asks, dropping orders if the transaction spread exceeds slippage tolerances.)",
    syllabus: ["Order book bid-ask structures", "Calculating spread values", "Smart order routers slippage bounds"],
    eTitle: "Exam: Bid-Ask Spread Auditor",
    eDesc: "Write a JS function `getBidAskSpread(bestBid, bestAsk)` returning `bestAsk - bestBid` float. Return -1 if inputs are negative or bestBid >= bestAsk.",
    eStarter: "function getBidAskSpread(bestBid, bestAsk) {\n    // Write your code here\n    \n}",
    eHint: "Subtract bid from ask directly. Check bounds.",
    eTest: "if (typeof getBidAskSpread !== 'function') throw new Error('Method getBidAskSpread not found.');\nif (getBidAskSpread(100.5, 100.7) !== 0.20000000000000284 && Math.abs(getBidAskSpread(100.5, 100.7) - 0.2) > 0.001) throw new Error('Spread calculation failed');\nif (getBidAskSpread(100, 95) !== -1) throw new Error('Inverted spread checks failed');",
    aTitle: "Assignment: Bid validity checker",
    aDesc: "Write a JS function `isBidValid(bid, limit)` returning true if bid >= limit.",
    aStarter: "function isBidValid(bid, limit) {\n    // Write your code here\n    \n}",
    aHint: "Compare input with thresholds.",
    aTest: "if (typeof isBidValid !== 'function') throw new Error('Method isBidValid not found.');"
  },
  {
    title: "Algorithmic execution: VWAP (Volume Weighted Average Price)",
    desc: "Master execution algorithms. (Real world: Institutional execution algorithms slice large orders, executing trades proportional to market volume profiles to minimize cost impacts.)",
    syllabus: ["VWAP formula math", "Slicing execution order blocks profiles", "Minimizing market price impact targets"],
    eTitle: "Exam: VWAP Calculator",
    eDesc: "Write a JS function `calculateVwap(priceVolumePairs)` returning the VWAP float: `sum(price * volume) / sum(volume)`. Return 0 if pairs array is empty or total volume <= 0.",
    eStarter: "function calculateVwap(priceVolumePairs) {\n    // Write your code here\n    \n}",
    eHint: "Accumulate numerator (sum of price * vol) and denominator (sum of vol) in array loop. Return ratio.",
    eTest: "if (typeof calculateVwap !== 'function') throw new Error('Method calculateVwap not found');\nif (calculateVwap([{price: 10, volume: 100}, {price: 12, volume: 200}]) !== 11.333333333333334 && Math.abs(calculateVwap([{price: 10, volume: 100}, {price: 12, volume: 200}]) - 11.33) > 0.01) throw new Error('VWAP calculation failed');",
    aTitle: "Assignment: Accumulate volume check",
    aDesc: "Write a JS function `getTotalVolume(pairs)` returning sum of volumes.",
    aStarter: "function getTotalVolume(pairs) {\n    // Write your code here\n    \n}",
    aHint: "Loop and sum volumes.",
    aTest: "if (typeof getTotalVolume !== 'function') throw new Error('Method getTotalVolume not found');"
  },
  {
    title: "Market Impact Models: Slippage estimations",
    desc: "Estimate execution price slippage. (Real world: Execution routing pipelines calculate price drift variables, choosing dark pools when slippage flags trigger.)",
    syllabus: ["Market impact square-root models", "Slippage tolerance parameters configurations", "Dark pools routing triggers check"],
    eTitle: "Exam: Slippage Estimator",
    eDesc: "Write a JS function `isSlippageAcceptable(execPrice, targetPrice, limitPct)` returning true if `(execPrice - targetPrice) / targetPrice <= limitPct`. Return false if targetPrice <= 0.",
    eStarter: "function isSlippageAcceptable(execPrice, targetPrice, limitPct) {\n    // Write your code here\n    \n}",
    eHint: "Calculate percentage drift from target, comparing with bounds.",
    eTest: "if (typeof isSlippageAcceptable !== 'function') throw new Error('Method isSlippageAcceptable not found');\nif (isSlippageAcceptable(101, 100, 0.02) !== true) throw new Error('Allowed slippage check failed');",
    aTitle: "Assignment: Price drift calculator",
    aDesc: "Write a JS function `getPriceDrift(exec, target)` returning exec - target.",
    aStarter: "function getPriceDrift(exec, target) {\n    // Write your code here\n    \n}",
    aHint: "Simple subtraction.",
    aTest: "if (typeof getPriceDrift !== 'function') throw new Error('Method getPriceDrift not found');"
  },
  {
    title: "Low-Latency Networks: TCP socket buffer checks",
    desc: "Configure network buffers for HFT feeds. (Real world: Telemetry nodes inspect kernel TCP sockets, draining buffers immediately to prevent old ticks from corrupting prices.)",
    syllabus: ["HFT network bypass cards settings", "TCP socket buffer overflows", "Draining old tick data packets"],
    eTitle: "Exam: Kernel Buffer Auditor",
    eDesc: "Write a JS function `isBufferOverflowing(usedBytes, maxBytes)` returning true if usedBytes / maxBytes >= 0.85. Return false if maxBytes <= 0.",
    eStarter: "function isBufferOverflowing(usedBytes, maxBytes) {\n    // Write your code here\n    \n}",
    eHint: "Compare ratios with threshold. Check bounds.",
    eTest: "if (typeof isBufferOverflowing !== 'function') throw new Error('Method isBufferOverflowing not found');\nif (isBufferOverflowing(90, 100) !== true) throw new Error('Buffer check failed');",
    aTitle: "Assignment: Buffer headroom calculation",
    aDesc: "Write a JS function `getBufferHeadroom(used, total)` returning total - used. Return 0 if negative.",
    aStarter: "function getBufferHeadroom(used, total) {\n    // Write your code here\n    \n}",
    aHint: "Subtract and clamp.",
    aTest: "if (typeof getBufferHeadroom !== 'function') throw new Error('Method getBufferHeadroom not found');"
  },
  {
    title: "Order Routing: Speed-of-Light fiber network latency",
    desc: "Calculate geographical route latency. (Real world: Arbitrage software chooses microwave routes over fiber links, prioritizing speed over bandwidth to win trades.)",
    syllabus: ["Microwave vs Fiber physical propagation velocities", "Geographical routing distance calculations", "Arbitrage latency limits"],
    eTitle: "Exam: Fiber Latency Calculator",
    eDesc: "Write a JS function `getFiberLatencyMs(distanceKm)` returning `distanceKm / 200` (fiber light propagation speed). Return 0 if distanceKm < 0.",
    eStarter: "function getFiberLatencyMs(distanceKm) {\n    // Write your code here\n    \n}",
    eHint: "Divide distance by speed of light in fiber constant (200 km/ms).",
    eTest: "if (typeof getFiberLatencyMs !== 'function') throw new Error('Method getFiberLatencyMs not found');\nif (getFiberLatencyMs(1000) !== 5) throw new Error('Fiber light math failed');",
    aTitle: "Assignment: Link speed winner",
    aDesc: "Write a JS function `selectFastestRoute(latencyA, latencyB)` returning latencyA < latencyB ? 'A' : 'B'.",
    aStarter: "function selectFastestRoute(latencyA, latencyB) {\n    // Write your code here\n    \n}",
    aHint: "Compare route latencies.",
    aTest: "if (typeof selectFastestRoute !== 'function') throw new Error('Method selectFastestRoute not found');"
  },
  {
    title: "Algorithmic Risk Filters: Circuit Breakers thresholds",
    desc: "Master algorithmic risk limit controls. (Real world: Order management gateways halt execution threads immediately if trade volume aggregates exceed circuit breaker bounds.)",
    syllabus: ["Risk gateway credit limits check", "circuit breakers triggers rules", "HALT execution signal routers"],
    eTitle: "Exam: Circuit Breaker Auditor",
    eDesc: "Write a JS function `shouldHaltTrading(priceDeltaPct, limitPct, aggregateVolume, maxVolume)` returning true if priceDeltaPct >= limitPct or aggregateVolume >= maxVolume. Returns false otherwise.",
    eStarter: "function shouldHaltTrading(priceDeltaPct, limitPct, aggregateVolume, maxVolume) {\n    // Write your code here\n    \n}",
    eHint: "Evaluate boolean risk checks.",
    eTest: "if (typeof shouldHaltTrading !== 'function') throw new Error('Method shouldHaltTrading not found');\nif (shouldHaltTrading(0.06, 0.05, 1000, 50000) !== true) throw new Error('Risk trigger failed');",
    aTitle: "Assignment: Credit limit checker",
    aDesc: "Write a JS function `isCreditLimitSafe(orderValue, available)` returning orderValue <= available.",
    aStarter: "function isCreditLimitSafe(orderValue, available) {\n    // Write your code here\n    \n}",
    aHint: "Compare values.",
    aTest: "if (typeof isCreditLimitSafe !== 'function') throw new Error('Method isCreditLimitSafe not found');"
  },
  {
    title: "Final Capstone: Quant Engine & Low-Latency compliance audit",
    desc: "Perform evaluations of bid-ask spreads, check VWAP execution averages, verify kernel socket buffer allocations, and check latency limits checks. (Real world: HFT engineers audit routing configurations before market opens.)",
    syllabus: ["Slippage and impact risk check", "TCP socket buffer overflows checking", "Speed-of-light microwave link latency audits"],
    eTitle: "Exam: Low-Latency System compliance auditor",
    eDesc: "Write a JS function `evaluateQuantBuild(report)` returning true if report.spreadSafe === true and report.socketDrained === true and report.riskFiltersPassed === true.",
    eStarter: "function evaluateQuantBuild(report) {\n    // Write your code here\n    \n}",
    eHint: "Verify report.spreadSafe, report.socketDrained, and report.riskFiltersPassed boolean properties in report.",
    eTest: "if (typeof evaluateQuantBuild !== 'function') throw new Error('Method evaluateQuantBuild not found');\nconst rep = { spreadSafe: true, socketDrained: true, riskFiltersPassed: true };\nif (evaluateQuantBuild(rep) !== true) throw new Error('Low latency compliance check failed');",
    aTitle: "Assignment: System health rater",
    aDesc: "Write a JS function `getLatencyRating(pingMs)` returning pingMs <= 1 ? 'excellent' : 'warning'.",
    aStarter: "function getLatencyRating(pingMs) {\n    // Write your code here\n    \n}",
    aHint: "Check millisecond boundaries.",
    aTest: "if (typeof getLatencyRating !== 'function') throw new Error('Method getLatencyRating not found');"
  },
  {
    title: "Final Capstone: Quant Engine & Low-Latency compliance audit (Review)",
    desc: "Review quant trading systems architectures, evaluate order book bid-ask spreads, check socket network buffers, and verify circuit breaker risk limits. (Real world: HFT engineers audit routing configurations before market opens.)",
    syllabus: ["Reviewing spread slippage thresholds", "Assembling HFT risk checklists", "Verifying market impact modeling"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Quant Engine & Low-Latency compliance audit (Review)",
    desc: "Review quant trading systems architectures, evaluate order book bid-ask spreads, check socket network buffers, and verify circuit breaker risk limits. (Real world: HFT engineers audit routing configurations before market opens.)",
    syllabus: ["Reviewing spread slippage thresholds", "Assembling HFT risk checklists", "Verifying market impact modeling"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Quant Engine & Low-Latency compliance audit (Review)",
    desc: "Review quant trading systems architectures, evaluate order book bid-ask spreads, check socket network buffers, and verify circuit breaker risk limits. (Real world: HFT engineers audit routing configurations before market opens.)",
    syllabus: ["Reviewing spread slippage thresholds", "Assembling HFT risk checklists", "Verifying market impact modeling"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Quant Engine & Low-Latency compliance audit (Review)",
    desc: "Review quant trading systems architectures, evaluate order book bid-ask spreads, check socket network buffers, and verify circuit breaker risk limits. (Real world: HFT engineers audit routing configurations before market opens.)",
    syllabus: ["Reviewing spread slippage thresholds", "Assembling HFT risk checklists", "Verifying market impact modeling"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Quant Engine & Low-Latency compliance audit (Review)",
    desc: "Review quant trading systems architectures, evaluate order book bid-ask spreads, check socket network buffers, and verify circuit breaker risk limits. (Real world: HFT engineers audit routing configurations before market opens.)",
    syllabus: ["Reviewing spread slippage thresholds", "Assembling HFT risk checklists", "Verifying market impact modeling"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Quant Engine & Low-Latency compliance audit (Review)",
    desc: "Review quant trading systems architectures, evaluate order book bid-ask spreads, check socket network buffers, and verify circuit breaker risk limits. (Real world: HFT engineers audit routing configurations before market opens.)",
    syllabus: ["Reviewing spread slippage thresholds", "Assembling HFT risk checklists", "Verifying market impact modeling"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Quant Engine & Low-Latency compliance audit (Review)",
    desc: "Review quant trading systems architectures, evaluate order book bid-ask spreads, check socket network buffers, and verify circuit breaker risk limits. (Real world: HFT engineers audit routing configurations before market opens.)",
    syllabus: ["Reviewing spread slippage thresholds", "Assembling HFT risk checklists", "Verifying market impact modeling"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Quant Engine & Low-Latency compliance audit (Review)",
    desc: "Review quant trading systems architectures, evaluate order book bid-ask spreads, check socket network buffers, and verify circuit breaker risk limits. (Real world: HFT engineers audit routing configurations before market opens.)",
    syllabus: ["Reviewing spread slippage thresholds", "Assembling HFT risk checklists", "Verifying market impact modeling"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Quant Engine & Low-Latency compliance audit (Review)",
    desc: "Review quant trading systems architectures, evaluate order book bid-ask spreads, check socket network buffers, and verify circuit breaker risk limits. (Real world: HFT engineers audit routing configurations before market opens.)",
    syllabus: ["Reviewing spread slippage thresholds", "Assembling HFT risk checklists", "Verifying market impact modeling"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Quant Engine & Low-Latency compliance audit (Review)",
    desc: "Review quant trading systems architectures, evaluate order book bid-ask spreads, check socket network buffers, and verify circuit breaker risk limits. (Real world: HFT engineers audit routing configurations before market opens.)",
    syllabus: ["Reviewing spread slippage thresholds", "Assembling HFT risk checklists", "Verifying market impact modeling"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Quant Engine & Low-Latency compliance audit (Review)",
    desc: "Review quant trading systems architectures, evaluate order book bid-ask spreads, check socket network buffers, and verify circuit breaker risk limits. (Real world: HFT engineers audit routing configurations before market opens.)",
    syllabus: ["Reviewing spread slippage thresholds", "Assembling HFT risk checklists", "Verifying market impact modeling"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  },
  {
    title: "Final Capstone: Quant Engine & Low-Latency compliance audit (Review)",
    desc: "Review quant trading systems architectures, evaluate order book bid-ask spreads, check socket network buffers, and verify circuit breaker risk limits. (Real world: HFT engineers audit routing configurations before market opens.)",
    syllabus: ["Reviewing spread slippage thresholds", "Assembling HFT risk checklists", "Verifying market impact modeling"],
    eTitle: "Exam: Final compliance audit review",
    eDesc: "Not tested",
    eStarter: "",
    eHint: "",
    eTest: "",
    aTitle: "Assignment: Compliance score compiler",
    aDesc: "Not tested",
    aStarter: "",
    aHint: "",
    aTest: ""
  }
];

export const QUANT_SYSTEMS_30_DAYS_QUESTS = QUANT_SYSTEMS_30_DAYS_CONFIGS.flatMap((cfg, dIdx) => {
  const dayNum = dIdx + 1;
  const lecture = {
    id: `quant-basics-lecture-day-${dayNum}`,
    title: `Day ${dayNum} Learning: ${cfg.title}`,
    desc: cfg.desc,
    type: "lecture" as const,
    requiresAvatar: true,
    syllabus: cfg.syllabus,
    skillCategory: "theory" as const,
    xp: 150,
    pins: 5
  };
  if (dayNum === 1) {
    return [
      lecture,
      {
        id: `quant-basics-lecture2-day-1`,
        title: `Day 1 Deep Dive: Syntax, Execution Rules, and Line-by-Line Breakdown`,
        desc: `In-depth step-by-step breakdown of Day 1 concepts, memory layout, and execution mechanics. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `quant-basics-lecture3-day-1`,
        title: `Day 1 Workshop: Real-World Industry Context & Visualization Guide`,
        desc: `Practical visualization guide and real-world system architecture context for Day 1. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  if (dayNum === 2) {
    return [
      lecture,
      {
        id: `quant-basics-lecture2-day-2`,
        title: `Day 2 Deep Dive: Flow Control, Logic Branching, and Execution Paths`,
        desc: `In-depth line-by-line mechanics of conditionals, loops, and memory execution state. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      },
      {
        id: `quant-basics-lecture3-day-2`,
        title: `Day 2 Workshop: Practical Code Workshop & Edge Case Pitfall Warnings`,
        desc: `Practical code workshop analyzing common edge cases, off-by-one errors, and production traps. ${cfg.desc}`,
        type: "lecture" as const,
        requiresAvatar: true,
        syllabus: cfg.syllabus,
        skillCategory: "theory" as const,
        xp: 150,
        pins: 5
      }
    ];
  }
  return buildEnrichedDayQuests('quant-basics', dayNum, cfg);
});
