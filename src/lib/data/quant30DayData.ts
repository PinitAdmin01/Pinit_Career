import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const QUANT_SYSTEMS_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Quantitative Engineering & Electronic Trading Foundations",
    "desc": "Master market microstructure: Continuous Double Auctions (CDA), maker vs taker economics, order types (Market, Limit, Stop, Pegged, Iceberg), and NBBO (National Best Bid and Offer).",
    "syllabus": [
      "Market Microstructure: Lit markets vs Dark pools, electronic communication networks (ECNs), and maker-taker fee rebates.",
      "Order Types & TIF: Limit, Market, IOC (Immediate or Cancel), FOK (Fill or Kill), and GTC (Good 'Til Canceled).",
      "NBBO Spread & Liquidity: Bid-Ask Spread ($S = P_{\\text{ask}} - P_{\\text{bid}}$) and Midpoint ($P_{\\text{mid}} = (P_{\\text{bid}} + P_{\\text{ask}}) / 2$)."
    ],
    "eTitle": "NBBO Spread & Midpoint Calculator",
    "eDesc": "Implement function `calculateNbboSpread(bestBid, bestAsk, tickSize = 0.01)` calculating dollar spread, spread in ticks, midpoint, and spread percentage.",
    "eStarter": "function calculateNbboSpread(bid, ask, tick = 0.01) {\n  // TODO: Compute spread = ask - bid, midpoint = (bid + ask) / 2, spreadTicks = round(spread / tick), and spreadBasisPoints\n  \n}",
    "eHint": "Compute spread = Number((ask - bid).toFixed(4)); midpoint = Number(((bid + ask) / 2).toFixed(4)); spreadTicks = Math.round(spread / tick); spreadBps = Number(((spread / midpoint) * 10000).toFixed(2)); return { bestBid: bid, bestAsk: ask, spreadDollars: spread, spreadTicks, midpoint, spreadBasisPoints: spreadBps, status: spread > 0 ? 'MARKET_TWO_SIDED_VALID' : 'CROSSED_OR_LOCKED_MARKET_ERROR' }.",
    "eTest": "const ok = calculateNbboSpread(150.00, 150.05, 0.01);\nif (ok.spreadTicks !== 5 || ok.midpoint !== 150.025 || ok.spreadBasisPoints !== 3.33 || ok.status !== 'MARKET_TWO_SIDED_VALID') throw new Error('Valid NBBO calculation failed');\nconst crossed = calculateNbboSpread(150.05, 150.00, 0.01);\nif (crossed.status !== 'CROSSED_OR_LOCKED_MARKET_ERROR') throw new Error('Crossed market should trigger error status');\nconst wide = calculateNbboSpread(100.00, 101.00, 0.10);\nif (wide.spreadTicks !== 10 || wide.midpoint !== 100.5) throw new Error('Wide tick calculation failed');",
    "aTitle": "Midpoint Price and Tick Boundary Rounder",
    "aDesc": "Implement function `calculateMidpointPrice(bestBid, bestAsk, tickDecimals = 2)` calculating the arithmetic mid-price rounded to specified tick decimals.",
    "aStarter": "function calculateMidpointPrice(bid, ask, decimals = 2) {\n  // TODO: Calculate (bid + ask) / 2 and round to specified decimal places\n  \n}",
    "aHint": "mid = (bestBid + bestAsk) / 2; return Number(mid.toFixed(tickDecimals)); ensuring proper numeric type conversion.",
    "aTest": "if (calculateMidpointPrice(100.10, 100.20) !== 100.15) throw new Error('Midpoint calculation failed');\nif (calculateMidpointPrice(50.00, 50.05, 3) !== 50.025) throw new Error('3 decimal midpoint failed');"
  },
  {
    "day": 2,
    "title": "Limit Order Book (LOB) Architecture",
    "desc": "Build high-performance Limit Order Books: Bid/Ask Red-Black trees, FIFO Price-Time Priority queues, depth levels ($L_1..L_N$), and O(1) order lookup hash tables.",
    "syllabus": [
      "LOB Dual-Side Structure: Bids sorted descending (Highest price first), Asks sorted ascending (Lowest price first).",
      "Price-Time Priority Invariant: Orders at the same price are executed in strict FIFO arrival order.",
      "Level 2 (Aggregated Depth) vs Level 3 (Full Order-by-Order Market By Order - MBO) representations."
    ],
    "eTitle": "Limit Order Book Dual-Sided Ingestion Engine",
    "eDesc": "Implement function `insertLimitOrder(book, order)` inserting orders into bids or asks maintaining sorted price levels and FIFO queue order.",
    "eStarter": "function insertLimitOrder(book, order) {\n  // TODO: Insert order into book.bids (sorted descending by price) or book.asks (sorted ascending by price)\n  \n}",
    "eHint": "Identify side: if order.side === 'BUY', add to bids and sort price descending; if 'SELL', add to asks and sort price ascending; maintain orders array at each price level; return { book, totalOrdersCount: number }.",
    "eTest": "const book = { bids: [], asks: [] };\ninsertLimitOrder(book, { id: 'o1', side: 'BUY', price: 100, qty: 10 });\ninsertLimitOrder(book, { id: 'o2', side: 'BUY', price: 102, qty: 5 });\nif (book.bids[0].price !== 102 || book.bids[1].price !== 100) throw new Error('Bids must be sorted descending');\ninsertLimitOrder(book, { id: 'o3', side: 'SELL', price: 105, qty: 8 });\ninsertLimitOrder(book, { id: 'o4', side: 'SELL', price: 103, qty: 4 });\nif (book.asks[0].price !== 103 || book.asks[1].price !== 105) throw new Error('Asks must be sorted ascending');\nif (book.bids.length !== 2 || book.asks.length !== 2) throw new Error('Total orders count mismatch');",
    "aTitle": "LOB Cumulative Depth Level Aggregator",
    "aDesc": "Implement function `calculateCumulativeDepth(priceLevels)` summing available liquidity across the top N price levels in the book.",
    "aStarter": "function calculateCumulativeDepth(levels) {\n  // TODO: Sum quantities across all price level objects in levels array\n  \n}",
    "aHint": "Use levels.reduce((sum, lvl) => sum + lvl.qty, 0); return the total cumulative volume.",
    "aTest": "const lvls = [{ price: 100, qty: 50 }, { price: 99, qty: 150 }, { price: 98, qty: 300 }];\nif (calculateCumulativeDepth(lvls) !== 500) throw new Error('Cumulative depth calculation failed');"
  },
  {
    "day": 3,
    "title": "Order Book Matching Engine Implementation",
    "desc": "Implement a deterministic matching engine in JavaScript/TypeScript: Crossing the spread, partial fills, full fills, order cancellation, and generating trade execution reports.",
    "syllabus": [
      "Continuous Matching Algorithm: Invariant $P_{\\text{bid}} \\ge P_{\\text{ask}}$ triggers automatic trade execution.",
      "Partial Fill Mechanics: Reducing remaining order quantity and leaving unfilled balance on the book.",
      "Execution Pricing Rule: Resting order establishes the trade execution price."
    ],
    "eTitle": "Deterministic Price-Time Matching Engine Kernel",
    "eDesc": "Implement function `matchIncomingOrder(book, incomingOrder)` executing trades against resting orders until filled or book exhausted.",
    "eStarter": "function matchIncomingOrder(book, order) {\n  // TODO: Match incoming BUY against resting asks or incoming SELL against resting bids; generate trades array\n  \n}",
    "eHint": "While order.qty > 0 and opposing side has matching price: take best opposing order, fill min(order.qty, resting.qty), record trade { price: resting.price, qty: fillQty }, deduct quantities; if resting empty remove from book; return { trades, remainingQty: order.qty }.",
    "eTest": "const book = { asks: [{ id: 'a1', price: 100, qty: 10 }, { id: 'a2', price: 101, qty: 20 }], bids: [] };\nconst res = matchIncomingOrder(book, { id: 'b1', side: 'BUY', price: 102, qty: 15 });\nif (res.trades.length !== 2 || res.trades[0].qty !== 10 || res.trades[1].qty !== 5 || res.remainingQty !== 0) throw new Error('Matching engine multi-fill failed');\nif (book.asks[0].qty !== 15 || book.asks[0].price !== 101) throw new Error('Resting book quantity reduction failed');\nconst noMatch = matchIncomingOrder(book, { id: 'b2', side: 'BUY', price: 99, qty: 10 });\nif (noMatch.trades.length !== 0 || noMatch.remainingQty !== 10) throw new Error('Non-crossing order generated trade in error');",
    "aTitle": "Trade Execution Volume Weighted Price Calculator",
    "aDesc": "Implement function `calculateExecutionAveragePrice(tradesList)` computing the volume-weighted average price across a list of execution fills.",
    "aStarter": "function calculateExecutionAveragePrice(trades) {\n  // TODO: Compute sum of (trade.price * trade.qty) / sum of (trade.qty)\n  \n}",
    "aHint": "totalVal = trades.reduce((s, t) => s + t.price * t.qty, 0); totalQty = trades.reduce((s, t) => s + t.qty, 0); return Number((totalVal / totalQty).toFixed(4));",
    "aTest": "const trades = [{ price: 100, qty: 10 }, { price: 102, qty: 10 }]; // 2020 / 20 = 101.00\nif (calculateExecutionAveragePrice(trades) !== 101.0000) throw new Error('Execution average price failed');"
  },
  {
    "day": 4,
    "title": "Algorithmic Execution: VWAP & TWAP Strategies",
    "desc": "Design institutional execution algorithms minimizing market impact: Volume-Weighted Average Price ($VWAP = \\frac{\\sum P_i \\cdot V_i}{\\sum V_i}$), Time-Weighted Average Price ($TWAP = \\frac{1}{N} \\sum P_i$), and U-shaped intraday volume curves.",
    "syllabus": [
      "Intraday Volume Profiles: U-shaped curve with heavy volume at market open (9:30 AM) and market close (4:00 PM).",
      "VWAP Execution Schedule: Slicing parent orders into child orders proportional to historical interval volume bins.",
      "TWAP Execution Schedule: Dividing parent order into equal child slices across uniform time intervals."
    ],
    "eTitle": "VWAP Intraday Slicing Engine",
    "eDesc": "Implement function `calculateVwapSchedule(totalOrderSize, volumeProfileBins)` distributing target order volume across historical time intervals.",
    "eStarter": "function calculateVwapSchedule(totalSize, bins) {\n  // TODO: Distribute totalSize across bins proportional to bin.volumePercentage, returning child order quantities\n  \n}",
    "eHint": "Compute totalPct = bins.reduce((s, b) => s + b.volumePct, 0); map each bin to Math.round(totalOrderSize * (b.volumePct / totalPct)); adjust last bin for rounding remainder; return child orders array.",
    "eTest": "const bins = [{ interval: '09:30', volumePct: 40 }, { interval: '10:00', volumePct: 20 }, { interval: '10:30', volumePct: 40 }];\nconst schedule = calculateVwapSchedule(1000, bins);\nif (schedule[0].childOrderQty !== 400 || schedule[1].childOrderQty !== 200 || schedule[2].childOrderQty !== 400) throw new Error('VWAP child order allocation failed');\nconst totalScheduled = schedule.reduce((s, c) => s + c.childOrderQty, 0);\nif (totalScheduled !== 1000) throw new Error('Total scheduled volume must equal parent order size');\nconst emptySchedule = calculateVwapSchedule(0, bins);\nif (emptySchedule[0].childOrderQty !== 0) throw new Error('Zero parent order check failed');",
    "aTitle": "TWAP Uniform Slice Interval Calculator",
    "aDesc": "Implement function `calculateTwapSchedule(parentOrderQuantity, executionDurationMinutes, sliceIntervalMinutes)` computing slice size and count.",
    "aStarter": "function calculateTwapSchedule(qty, duration, interval) {\n  // TODO: Compute sliceCount = floor(duration / interval) and qtyPerSlice = round(qty / sliceCount)\n  \n}",
    "aHint": "sliceCount = Math.floor(executionDurationMinutes / sliceIntervalMinutes); qtyPerSlice = Math.round(parentOrderQuantity / sliceCount); return { sliceCount, quantityPerSlice: qtyPerSlice };",
    "aTest": "const twap = calculateTwapSchedule(6000, 60, 5); // 12 slices of 500 units\nif (twap.sliceCount !== 12 || twap.quantityPerSlice !== 500) throw new Error('TWAP calculation failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Limit Order Book & Matching Engine Kernel",
    "desc": "Milestone 1: Build a high-throughput Limit Order Book and deterministic matching engine kernel supporting Limit/Market orders, FIFO price-time priority, partial executions, and VWAP benchmark calculations.",
    "syllabus": [
      "Limit Order Book Data Structures & Performance Profiling.",
      "Deterministic Matching Engine execution invariant validation.",
      "Comprehensive benchmark stress testing with synthetic order streams."
    ],
    "eTitle": "Quantitative Limit Order Book Kernel Master",
    "eDesc": "Implement function `executeMatchingKernel(initialBook, incomingOrderStream)` processing order streams and generating fill reports and final book depth.",
    "eStarter": "function executeMatchingKernel(book, stream) {\n  // TODO: Process each order in stream through matching engine, accumulating execution reports and updated book state\n  \n}",
    "eHint": "Loop order stream; for each order, match against resting book; record fills; if remainder > 0 and type === 'LIMIT', insert into book; return { totalTradesExecuted: count, totalVolumeFilled: volume, finalBookState: book }.",
    "eTest": "const book = { bids: [{ id: 'b1', price: 100, qty: 50 }], asks: [{ id: 'a1', price: 102, qty: 50 }] };\nconst stream = [\n  { id: 'o1', side: 'BUY', type: 'LIMIT', price: 103, qty: 30 },\n  { id: 'o2', side: 'SELL', type: 'LIMIT', price: 99, qty: 20 }\n];\nconst res = executeMatchingKernel(book, stream);\nif (res.totalTradesExecuted !== 2 || res.totalVolumeFilled !== 50) throw new Error('Matching kernel execution failed');\nif (book.asks[0].qty !== 20 || book.bids[0].qty !== 30) throw new Error('Residual book depth failed');\nconst emptyRes = executeMatchingKernel({ bids: [], asks: [] }, []);\nif (emptyRes.totalTradesExecuted !== 0) throw new Error('Empty stream kernel check failed');",
    "aTitle": "Matching Engine Throughput Benchmark Calculator",
    "aDesc": "Implement function `calculateEngineThroughput(totalOrdersProcessed, elapsedMicroseconds)` computing throughput in orders per second.",
    "aStarter": "function calculateEngineThroughput(orders, micros) {\n  // TODO: Compute (orders / (micros / 1000000)) and return integer throughput in orders per second\n  \n}",
    "aHint": "ordersPerSec = (totalOrdersProcessed / elapsedMicroseconds) * 1000000; return Math.round(ordersPerSec);",
    "aTest": "const tps = calculateEngineThroughput(1000000, 200000); // 1M orders in 0.2s = 5,000,000 orders/sec\nif (tps !== 5000000) throw new Error('Throughput calculation failed');"
  },
  {
    "day": 6,
    "title": "Market Impact & Slippage Models: Almgren-Chriss Framework",
    "desc": "Model price impact of trading: The Almgren-Chriss framework for optimal execution (Temporary price impact $\\eta(v)$ vs Permanent price impact $\\gamma(v)$), Price Slippage, and Quadratic Risk-Aversion penalties.",
    "syllabus": [
      "Permanent Impact: Shift in fundamental mid-price resulting from information leakage ($I_{\\text{perm}} = \\gamma \\cdot V$).",
      "Temporary Impact: Execution friction overcoming order book depth ($I_{\\text{temp}} = \\eta \\cdot \\frac{v}{\\tau}$).",
      "Optimal Execution Trajectory: Balancing price impact cost against volatility risk."
    ],
    "eTitle": "Almgren-Chriss Market Impact Cost Calculator",
    "eDesc": "Implement function `calculateAlmgrenChrissCost(tradeSize, executionRate, permanentGamma, temporaryEta)` computing total price impact penalty.",
    "eStarter": "function calculateAlmgrenChrissCost(size, rate, gamma, eta) {\n  // TODO: permCost = 0.5 * gamma * size^2; tempCost = eta * (rate^2) * duration; return total expected impact cost\n  \n}",
    "eHint": "permCost = 0.5 * permanentGamma * (tradeSize * tradeSize); tempCost = temporaryEta * tradeSize * executionRate; total = permCost + tempCost; return { permanentImpactCost: Number(permCost.toFixed(2)), temporaryImpactCost: Number(tempCost.toFixed(2)), totalExpectedCost: Number(total.toFixed(2)) }.",
    "eTest": "const cost = calculateAlmgrenChrissCost(1000, 100, 0.0001, 0.0005); // Perm = 0.5*0.0001*1M = 50; Temp = 0.0005*1000*100 = 50 -> Total = 100.00\nif (cost.permanentImpactCost !== 50.00 || cost.temporaryImpactCost !== 50.00 || cost.totalExpectedCost !== 100.00) throw new Error('Almgren-Chriss cost calculation failed');\nconst zeroTrade = calculateAlmgrenChrissCost(0, 0, 0.0001, 0.0005);\nif (zeroTrade.totalExpectedCost !== 0.00) throw new Error('Zero trade cost check failed');\nif (typeof cost.totalExpectedCost !== 'number') throw new Error('Return type check failed');",
    "aTitle": "Realized Slippage Basis Points Calculator",
    "aDesc": "Implement function `calculateRealizedSlippageBps(decisionPrice, executionPrice, orderSide)` computing execution slippage in basis points.",
    "aStarter": "function calculateRealizedSlippageBps(decisionP, execP, side) {\n  // TODO: For BUY: (execP - decisionP) / decisionP * 10000; for SELL: (decisionP - execP) / decisionP * 10000\n  \n}",
    "aHint": "diff = orderSide === 'BUY' ? (executionPrice - decisionPrice) : (decisionPrice - executionPrice); bps = (diff / decisionPrice) * 10000; return Number(bps.toFixed(2));",
    "aTest": "const sBuy = calculateRealizedSlippageBps(100.00, 100.05, 'BUY'); // +5 bps adverse slippage\nif (sBuy !== 5.00) throw new Error('Buy slippage calculation failed');\nconst sSell = calculateRealizedSlippageBps(100.00, 99.90, 'SELL'); // +10 bps adverse slippage\nif (sSell !== 10.00) throw new Error('Sell slippage calculation failed');"
  },
  {
    "day": 7,
    "title": "Order Book Imbalance (OBI) & Micro-Price Estimation",
    "desc": "Predict short-term price movements from order book queue dynamics: Order Book Imbalance ($OBI = \\frac{Q_{\\text{bid}} - Q_{\\text{ask}}}{Q_{\\text{bid}} + Q_{\\text{ask}}}$), Micro-Price ($P_{\\text{micro}} = \\frac{Q_{\\text{bid}} P_{\\text{ask}} + Q_{\\text{ask}} P_{\\text{bid}}}{Q_{\\text{bid}} + Q_{\\text{ask}}}$), and Stoikov price adjustments.",
    "syllabus": [
      "Order Flow Toxicity & OBI Signal: Strong positive OBI ($> +0.6$) predicting upward mid-price movement.",
      "The Micro-Price Formula: Volume-weighting the opposite side's price to reflect queue probability of exhaustion.",
      "High-Frequency Alpha: Using micro-price deviations from mid-price as a 100ms directional signal."
    ],
    "eTitle": "Micro-Price & Order Book Imbalance Signal Engine",
    "eDesc": "Implement function `calculateMicroPriceAndObi(bestBidPrice, bidQuantity, bestAskPrice, askQuantity)` computing OBI and micro-price.",
    "eStarter": "function calculateMicroPriceAndObi(bidP, bidQ, askP, askQ) {\n  // TODO: obi = (bidQ - askQ) / (bidQ + askQ); microPrice = (bidQ * askP + askQ * bidP) / (bidQ + askQ)\n  \n}",
    "eHint": "totalQ = bidQuantity + askQuantity; obi = (bidQuantity - askQuantity) / totalQ; microP = (bidQuantity * bestAskPrice + askQuantity * bestBidPrice) / totalQ; return { obi: Number(obi.toFixed(4)), microPrice: Number(microP.toFixed(4)), midPrice: (bestBidPrice + bestAskPrice) / 2, signalDirection: obi > 0.3 ? 'BULLISH_PRESSURE' : (obi < -0.3 ? 'BEARISH_PRESSURE' : 'NEUTRAL') }.",
    "eTest": "const res = calculateMicroPriceAndObi(100.00, 90, 100.10, 10); // total=100. OBI = (90-10)/100 = 0.80. Micro = (90*100.10 + 10*100.00)/100 = (9009 + 1000)/100 = 100.09\nif (res.obi !== 0.8000 || res.microPrice !== 100.0900 || res.signalDirection !== 'BULLISH_PRESSURE') throw new Error('Micro-price computation failed');\nconst bal = calculateMicroPriceAndObi(100.00, 50, 100.10, 50); // OBI = 0.0, Micro = 100.05\nif (bal.obi !== 0.0000 || bal.microPrice !== 100.0500 || bal.signalDirection !== 'NEUTRAL') throw new Error('Balanced OBI check failed');\nconst bear = calculateMicroPriceAndObi(100.00, 10, 100.10, 90); // OBI = -0.80\nif (bear.signalDirection !== 'BEARISH_PRESSURE') throw new Error('Bearish signal check failed');",
    "aTitle": "OBI Ratio Normalized Scale Converter",
    "aDesc": "Implement function `normalizeObiToScore(rawObi)` converting OBI range [-1.0, +1.0] to standard 0-100 score.",
    "aStarter": "function normalizeObiToScore(obi) {\n  // TODO: Map [-1.0, 1.0] linearly to [0, 100], formatted to 1 decimal place\n  \n}",
    "aHint": "score = ((rawObi + 1.0) / 2.0) * 100; return Number(score.toFixed(1));",
    "aTest": "if (normalizeObiToScore(0.0) !== 50.0 || normalizeObiToScore(1.0) !== 100.0) throw new Error('OBI score normalization failed');\nif (normalizeObiToScore(-1.0) !== 0.0) throw new Error('Negative boundary normalization failed');"
  },
  {
    "day": 8,
    "title": "High-Frequency Market Making: Avellaneda-Stoikov Model",
    "desc": "Design quantitative market-making strategies: The Avellaneda-Stoikov model for optimal bid/ask quotes ($r(s, q, t) = s - q \\gamma \\sigma^2 (T - t)$), Inventory Risk Management, and Reservation Price skewing.",
    "syllabus": [
      "Inventory Risk Invariant: As net inventory $q$ grows positive (long), skew quotes downward to attract sellers and deter buyers.",
      "Optimal Spread Calculation: Half-spread $\\delta^a + \\delta^b = \\gamma \\sigma^2 (T - t) + \\frac{2}{\\gamma} \\ln(1 + \\frac{\\gamma}{\\kappa})$.",
      "Adverse Selection: Quoting against informed flow and toxic order toxicity (VPIN)."
    ],
    "eTitle": "Avellaneda-Stoikov Reservation Price & Quote Skewer",
    "eDesc": "Implement function `calculateReservationPrice(midPrice, inventoryQ, riskAversionGamma, volatilitySigma, timeRemainingT)` computing skewed reservation price.",
    "eStarter": "function calculateReservationPrice(s, q, gamma, sigma, t) {\n  // TODO: r = s - q * gamma * (sigma^2) * t; compute optimal bid and ask offsets around reservation price\n  \n}",
    "eHint": "inventoryPenalty = inventoryQ * riskAversionGamma * (volatilitySigma * volatilitySigma) * timeRemainingT; resPrice = midPrice - inventoryPenalty; return { reservationPrice: Number(resPrice.toFixed(4)), inventoryPenalty: Number(inventoryPenalty.toFixed(4)), skewDirection: inventoryQ > 0 ? 'SKEWED_DOWNWARD_TO_OFFLOAD_LONG' : (inventoryQ < 0 ? 'SKEWED_UPWARD_TO_ACCUMULATE_SHORT' : 'SYMMETRIC') }.",
    "eTest": "const long = calculateReservationPrice(100.00, 10, 0.1, 0.2, 1.0); // Penalty = 10 * 0.1 * 0.04 * 1 = 0.04 -> r = 99.96\nif (long.reservationPrice !== 99.9600 || long.inventoryPenalty !== 0.0400 || long.skewDirection !== 'SKEWED_DOWNWARD_TO_OFFLOAD_LONG') throw new Error('Avellaneda-Stoikov long skew failed');\nconst short = calculateReservationPrice(100.00, -10, 0.1, 0.2, 1.0); // Penalty = -0.04 -> r = 100.04\nif (short.reservationPrice !== 100.0400 || short.skewDirection !== 'SKEWED_UPWARD_TO_ACCUMULATE_SHORT') throw new Error('Short inventory skew failed');\nconst flat = calculateReservationPrice(100.00, 0, 0.1, 0.2, 1.0);\nif (flat.reservationPrice !== 100.0000 || flat.skewDirection !== 'SYMMETRIC') throw new Error('Flat inventory symmetric check failed');",
    "aTitle": "Inventory Limit Penalty Multiplier",
    "aDesc": "Implement function `isInventoryLimitBreached(currentInventory, maxInventoryLimit)` returning true if position exceeds hard risk threshold.",
    "aStarter": "function isInventoryLimitBreached(currQ, maxLimit) {\n  // TODO: Check if Math.abs(currQ) strictly exceeds maxLimit\n  \n}",
    "aHint": "Compare Math.abs(currentInventory) > maxInventoryLimit; return boolean.",
    "aTest": "if (isInventoryLimitBreached(120, 100) !== true || isInventoryLimitBreached(-80, 100) !== false) throw new Error('Inventory breach check failed');"
  },
  {
    "day": 9,
    "title": "Financial Information eXchange (FIX 4.4) Protocol & FAST Compression",
    "desc": "Master Wall Street's standard messaging protocol: FIX 4.4 tag-value encoding (`8=FIX.4.4|9=...|35=D|...|10=128|`), Checksum validation (Sum modulo 256), Session heartbeats (35=0), Logon (35=A), New Order Single (35=D), and FAST binary compression.",
    "syllabus": [
      "FIX Message Structure: Standard Header (Tag 8, 9, 35), Message Body, Standard Trailer (Tag 10 Checksum).",
      "Tag 10 Checksum Algorithm: Sum of all ASCII byte values up to checksum delimiter modulo 256, padded to 3 digits (`10=042`).",
      "Session Layer Invariants: In-sequence message processing (Tag 34 `MsgSeqNum`) and resend requests (35=2)."
    ],
    "eTitle": "FIX 4.4 Protocol Message Encoder & Checksum Engine",
    "eDesc": "Implement function `generateFixMessage(msgType, bodyTags)` calculating Tag 9 body length and Tag 10 checksum with SOH (\\x01) delimiters.",
    "eStarter": "function generateFixMessage(msgType, tags) {\n  // TODO: Build FIX string, compute body length (Tag 9) and 3-digit checksum (Tag 10) using sum of ASCII bytes modulo 256\n  \n}",
    "eHint": "Construct body string; compute Tag 9 length; assemble string without Tag 10; calculate sum of charCodes modulo 256; pad to 3 digits (e.g. '042'); append `10=${checksum}\\x01`; return full message.",
    "eTest": "const tags = { '49': 'SENDER', '56': 'TARGET', '34': '1', '52': '20240101-00:00:00', '11': 'ORD101', '55': 'AAPL', '54': '1', '38': '100', '40': '2', '44': '150.00' };\nconst msg = generateFixMessage('D', tags);\nif (!msg.startsWith('8=FIX.4.4\\x019=') || !msg.includes('\\x0135=D\\x01') || !msg.includes('\\x0110=')) throw new Error('FIX message generation failed');\nconst checksumMatch = msg.match(/10=(\\d{3})\\x01$/);\nif (!checksumMatch) throw new Error('Tag 10 Checksum format invalid');\nif (typeof msg !== 'string') throw new Error('FIX output must be string');",
    "aTitle": "FIX Checksum Byte Sum Validator",
    "aDesc": "Implement function `verifyFixChecksum(rawFixString)` verifying that Tag 10 value matches the exact modulo 256 byte sum of preceding text.",
    "aStarter": "function verifyFixChecksum(fixMsg) {\n  // TODO: Extract text up to '10=', sum ASCII byte values modulo 256, and compare with Tag 10 value\n  \n}",
    "aHint": "Split on '10='; sum char codes in prefix; expected = String(sum % 256).padStart(3, '0'); return expected === actualChecksum.replace('\\x01', '');",
    "aTest": "const validMsg = '8=FIX.4.4\\x019=12\\x0135=0\\x0110=181\\x01';\nconst isOk = verifyFixChecksum(validMsg);\nif (typeof isOk !== 'boolean') throw new Error('Checksum verify type check failed');"
  },
  {
    "day": 10,
    "title": "NASDAQ TotalView-ITCH 5.0 & OUCH Protocols: Direct Binary Market Feeds",
    "desc": "Parse ultra-low latency direct exchange binary feeds: NASDAQ TotalView-ITCH 5.0 binary message parsing (Add Order 'A', Order Executed 'E', Order Cancel 'X', Order Replace 'U'), big-endian network byte order, and OUCH order entry.",
    "syllabus": [
      "Binary Feeds vs FIX: ITCH 5.0 zero-copy binary struct unpacking vs FIX ASCII parsing overhead (slashing latency from 5μs to 50ns).",
      "ITCH Packet Structure: Nanosecond timestamps (Tag 48-bit int), Order Reference Numbers (64-bit int), Price (32-bit fixed point with 4 decimals).",
      "MBO (Market By Order) State Machine: Rebuilding full exchange limit order books strictly from binary ITCH packets."
    ],
    "eTitle": "NASDAQ ITCH 5.0 Binary Add Order Packet Parser",
    "eDesc": "Implement function `parseItchAddOrderMessage(buffer)` decoding big-endian fields: MessageType ('A'), OrderRefNum, BuySellIndicator, Shares, StockSymbol, and FixedPointPrice.",
    "eStarter": "function parseItchAddOrderMessage(buf) {\n  // TODO: Read big-endian fields from buffer: char(0) type, uint64(1) refNum, char(9) side, uint32(10) shares, str(14, 8) symbol, uint32(22) price\n  \n}",
    "eHint": "msgType = String.fromCharCode(buf[0]); side = String.fromCharCode(buf[9]); shares = buf.readUInt32BE(10); symbol = buf.toString('ascii', 14, 22).trim(); price = Number((buf.readUInt32BE(22) / 10000).toFixed(4)); return { msgType, side, shares, symbol, price }.",
    "eTest": "const buf = Buffer.alloc(26);\nbuf[0] = 0x41; // 'A'\nbuf.writeBigUInt64BE(1001n, 1);\nbuf[9] = 0x42; // 'B' (Buy)\nbuf.writeUInt32BE(500, 10); // 500 shares\nbuf.write('AAPL    ', 14, 8, 'ascii');\nbuf.writeUInt32BE(1502500, 22); // $150.2500\nconst res = parseItchAddOrderMessage(buf);\nif (res.msgType !== 'A' || res.side !== 'B' || res.shares !== 500 || res.symbol !== 'AAPL' || res.price !== 150.25) throw new Error('ITCH Add Order parsing failed');\nif (typeof res.price !== 'number') throw new Error('Price type mismatch');\nif (res.shares <= 0) throw new Error('Shares parsing failed');",
    "aTitle": "ITCH Fixed-Point Price Decimal Converter",
    "aDesc": "Implement function `convertItchPriceToFloat(rawIntegerPrice)` converting ITCH 4-decimal fixed-point integer (e.g. 1502500) to floating point currency (150.25).",
    "aStarter": "function convertItchPriceToFloat(rawPrice) {\n  // TODO: Divide rawPrice by 10000.0 and return floating point number\n  \n}",
    "aHint": "Return Number((rawIntegerPrice / 10000).toFixed(4));",
    "aTest": "if (convertItchPriceToFloat(1502500) !== 150.25 || convertItchPriceToFloat(10000) !== 1.0) throw new Error('ITCH price conversion failed');"
  },
  {
    "day": 11,
    "title": "Kernel Bypass Networking: Solarflare Onload & DPDK Zero-Copy",
    "desc": "Eliminate Linux OS network stack latency with Kernel Bypass: Solarflare OpenOnload, Intel DPDK (Data Plane Development Kit), ring buffers in user space, zero-copy socket reads, and avoiding context switches and CPU interrupts.",
    "syllabus": [
      "Traditional Linux Network Stack Latency: Interrupts, SKB allocation, page table switches adding 2-5μs of jitter.",
      "Kernel Bypass Mechanics: Direct memory access (DMA) between NIC hardware rings and user-space memory.",
      "Busy-Polling / Spin-Wait Loops: Dedicating CPU core 100% to polling NIC queues for sub-microsecond tick-to-trade."
    ],
    "eTitle": "Zero-Copy Ring Buffer Packet Consumer",
    "eDesc": "Implement function `consumeZeroCopyPackets(rxRingBuffer, maxBatchSize)` reading packets directly from ring pointers without memory allocations.",
    "eStarter": "function consumeZeroCopyPackets(ring, maxBatch) {\n  // TODO: Read up to maxBatch packets from ring.head to ring.tail, advancing ring.head pointer and returning processed count\n  \n}",
    "eHint": "avail = (ring.tail - ring.head + ring.size) % ring.size; batchCount = Math.min(avail, maxBatchSize); advance ring.head = (ring.head + batchCount) % ring.size; return { packetsProcessed: batchCount, remainingInRing: avail - batchCount, newHeadIndex: ring.head }.",
    "eTest": "const ring = { size: 1024, head: 10, tail: 60 }; // 50 available packets\nconst res = consumeZeroCopyPackets(ring, 30);\nif (res.packetsProcessed !== 30 || res.remainingInRing !== 20 || res.newHeadIndex !== 40) throw new Error('Zero-copy ring buffer batch read failed');\nconst emptyRing = { size: 1024, head: 100, tail: 100 };\nif (consumeZeroCopyPackets(emptyRing, 10).packetsProcessed !== 0) throw new Error('Empty ring read should return 0');\nif (typeof res.packetsProcessed !== 'number') throw new Error('Packets processed type mismatch');",
    "aTitle": "Kernel Bypass Latency Reduction Estimator",
    "aDesc": "Implement function `calculateKernelBypassSpeedup(kernelLatencyNanos, bypassLatencyNanos)` calculating latency reduction percentage.",
    "aStarter": "function calculateKernelBypassSpeedup(kLat, bLat) {\n  // TODO: Compute ((kLat - bLat) / kLat) * 100\n  \n}",
    "aHint": "speedup = ((kernelLatencyNanos - bypassLatencyNanos) / kernelLatencyNanos) * 100; return Number(speedup.toFixed(2));",
    "aTest": "const s = calculateKernelBypassSpeedup(3500, 450); // 3500ns to 450ns = 87.14% reduction\nif (s !== 87.14) throw new Error('Kernel bypass speedup calculation failed');"
  },
  {
    "day": 12,
    "title": "Lock-Free Ring Buffers: Single-Producer Single-Consumer (SPSC) Architecture",
    "desc": "Implement ultra-fast inter-thread communication without mutex locks: Single-Producer Single-Consumer (SPSC) lock-free ring buffers, atomic memory orderings (`acquire`/`release`), cacheline padding to prevent false sharing, and power-of-2 bitwise modulo masking (`head & (N - 1)`).",
    "syllabus": [
      "The Cost of Mutex Contention: Thread descheduling and context switches wasting 1,000+ nanoseconds.",
      "Atomic Head & Tail Pointers: Producer owns `tail`; Consumer owns `head`; atomic operations guarantee visibility.",
      "Power-of-2 Buffer Sizing: Replacing expensive integer division (`%`) with bitwise AND (`index & (size - 1)`)."
    ],
    "eTitle": "SPSC Lock-Free Ring Buffer Queue Kernel",
    "eDesc": "Implement function `simulateSpscQueue(capacityPowerOfTwo)` creating an SPSC queue with enqueue and dequeue methods.",
    "eStarter": "function simulateSpscQueue(capacity) {\n  // TODO: Return queue object with enqueue(item) and dequeue() methods using bitwise masking (capacity - 1)\n  \n}",
    "eHint": "mask = capacity - 1; buffer = new Array(capacity); head = 0; tail = 0; enqueue(val): if ((tail - head) === capacity) return false; buffer[tail & mask] = val; tail++; return true; dequeue(): if (head === tail) return null; val = buffer[head & mask]; head++; return val.",
    "eTest": "const q = simulateSpscQueue(4); // Capacity = 4\nif (!q.enqueue(10) || !q.enqueue(20) || !q.enqueue(30) || !q.enqueue(40)) throw new Error('SPSC enqueue failed');\nif (q.enqueue(50) !== false) throw new Error('Full SPSC queue should reject enqueue');\nif (q.dequeue() !== 10 || q.dequeue() !== 20) throw new Error('FIFO order failed');\nif (!q.enqueue(50)) throw new Error('Enqueue after dequeue should succeed');\nif (q.dequeue() !== 30 || q.dequeue() !== 40 || q.dequeue() !== 50 || q.dequeue() !== null) throw new Error('Queue drain failed');",
    "aTitle": "Power of 2 Capacity Mask Validator",
    "aDesc": "Implement function `isPowerOfTwoCapacity(num)` verifying that ring buffer capacity is a power of 2 using bitwise `(n & (n - 1)) === 0`.",
    "aStarter": "function isPowerOfTwoCapacity(n) {\n  // TODO: Return true if n > 0 and (n & (n - 1)) === 0\n  \n}",
    "aHint": "Check n > 0 && (n & (n - 1)) === 0; return boolean.",
    "aTest": "if (isPowerOfTwoCapacity(1024) !== true || isPowerOfTwoCapacity(1000) !== false) throw new Error('Power of 2 validation failed');\nif (isPowerOfTwoCapacity(0) !== false) throw new Error('Zero is not power of two');"
  },
  {
    "day": 13,
    "title": "CPU Cacheline Alignment & False Sharing Elimination in C++",
    "desc": "Master CPU memory hierarchy optimizations: 64-byte L1/L2/L3 cachelines, MESI cache coherency protocol, avoiding False Sharing with `alignas(64)` padding, and CPU cache-miss profiling with `perf`.",
    "syllabus": [
      "MESI Protocol States: Modified, Exclusive, Shared, Invalid (Cacheline ping-pong across CPU cores).",
      "False Sharing: Two independent threads modifying adjacent variables residing on the same 64-byte cacheline.",
      "Hardware Alignment: `alignas(hardware_destructive_interference_size)` in C++20 trading memory padding for throughput."
    ],
    "eTitle": "CPU Cacheline Alignment & False Sharing Auditor",
    "eDesc": "Implement function `auditStructAlignment(fieldsList)` checking if variables accessed by different threads share the same 64-byte cacheline offset.",
    "eStarter": "function auditStructAlignment(fields) {\n  // TODO: Compute cumulative byte offset; flag if two multi-threaded variables share the same Math.floor(offset / 64) block\n  \n}",
    "eHint": "Track currentOffset = 0; check for each field: cachelineIdx = Math.floor(currentOffset / 64); if fields with different threadId share same cachelineIdx -> record false sharing; currentOffset += field.sizeBytes; return { hasFalseSharing: boolean, conflictingFields: string[] }.",
    "eTest": "const unpadded = [\n  { name: 'producerTail', sizeBytes: 8, threadId: 1 },\n  { name: 'consumerHead', sizeBytes: 8, threadId: 2 }\n]; // Both in byte 0..16 -> Same 64B cacheline (Index 0)\nconst r1 = auditStructAlignment(unpadded);\nif (!r1.hasFalseSharing || !r1.conflictingFields.includes('consumerHead')) throw new Error('False sharing detection failed');\nconst padded = [\n  { name: 'producerTail', sizeBytes: 8, threadId: 1 },\n  { name: 'padding', sizeBytes: 56, threadId: 0 },\n  { name: 'consumerHead', sizeBytes: 8, threadId: 2 }\n]; // producerTail in Line 0, consumerHead in Line 1 (Offset 64)\nconst r2 = auditStructAlignment(padded);\nif (r2.hasFalseSharing) throw new Error('Padded struct flagged false sharing in error');\nconst emptyFields = auditStructAlignment([]);\nif (emptyFields.hasFalseSharing) throw new Error('Empty struct check failed');",
    "aTitle": "Cacheline Padding Byte Calculator",
    "aDesc": "Implement function `calculatePaddingBytes(structSizeBytes, cachelineBytes = 64)` computing necessary padding to align struct to full cachelines.",
    "aStarter": "function calculatePaddingBytes(size, line = 64) {\n  // TODO: remainder = size % line; return remainder === 0 ? 0 : line - remainder\n  \n}",
    "aHint": "rem = structSizeBytes % cachelineBytes; return rem === 0 ? 0 : cachelineBytes - rem;",
    "aTest": "if (calculatePaddingBytes(8) !== 56 || calculatePaddingBytes(64) !== 0) throw new Error('Padding calculation failed');\nif (calculatePaddingBytes(70) !== 58) throw new Error('Multi-cacheline padding failed');"
  },
  {
    "day": 14,
    "title": "SIMD Vectorization (AVX-512) for Pricing & Risk Kernels",
    "desc": "Accelerate numerical quantitative models with SIMD vectorization: Single Instruction Multiple Data (SSE, AVX-2, AVX-512), 512-bit registers processing 8 double-precision floats simultaneously, and auto-vectorization loop invariants.",
    "syllabus": [
      "Vectorization Scaling: Processing 8 x 64-bit doubles in a single CPU cycle (`_mm512_add_pd`, `_mm512_fmadd_pd`).",
      "Loop Unrolling & Memory Alignment: 64-byte aligned arrays enabling aligned vector loads (`_mm512_load_pd`).",
      "Benchmarking Monte Carlo simulations and pricing kernels with vector instruction sets."
    ],
    "eTitle": "SIMD Vectorized Dot Product Simulation Kernel",
    "eDesc": "Implement function `vectorizedDotProduct(vectorA, vectorB, simdWidth = 8)` simulating 8-wide SIMD vector registers and tail cleanup.",
    "eStarter": "function vectorizedDotProduct(a, b, width = 8) {\n  // TODO: Process elements in chunks of simdWidth simulating vector registers, then compute scalar remainder\n  \n}",
    "eHint": "Loop i from 0 to N step simdWidth: sum chunks in parallel register; handle remainder i < N; return total dot product and number of SIMD vector cycles used.",
    "eTest": "const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\nconst b = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];\nconst res = vectorizedDotProduct(a, b, 8); // sum(a)*2 = 55*2 = 110\nif (res.dotProduct !== 110 || res.simdCycles !== 2) throw new Error('Vectorized dot product failed');\nconst emptyVec = vectorizedDotProduct([], [], 8);\nif (emptyVec.dotProduct !== 0 || emptyVec.simdCycles !== 0) throw new Error('Empty vector dot product check failed');\nif (typeof res.dotProduct !== 'number') throw new Error('Type mismatch');",
    "aTitle": "SIMD Vector Speedup Multiplier Calculator",
    "aDesc": "Implement function `calculateSimdTheoreticalSpeedup(vectorWidthElements, parallelizableFraction)` using Amdahl's Law.",
    "aStarter": "function calculateSimdTheoreticalSpeedup(width, fraction) {\n  // TODO: Compute speedup = 1 / ((1 - fraction) + (fraction / width))\n  \n}",
    "aHint": "Compute 1 / ((1 - parallelizableFraction) + (parallelizableFraction / vectorWidthElements)); return Number(speedup.toFixed(2));",
    "aTest": "const sp = calculateSimdTheoreticalSpeedup(8, 0.90); // 90% vectorized on 8-wide = 1 / (0.10 + 0.90/8) = 1 / 0.2125 = 4.71x\nif (sp !== 4.71) throw new Error('SIMD speedup calculation failed');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Ultra-Low-Latency Order Messaging & Concurrency Engine",
    "desc": "Milestone 2: Build a production ultra-low-latency order gateway pipeline: Binary ITCH 5.0 packet ingestion -> Lock-Free SPSC Ring Buffer -> Cache-Aligned Matching Engine -> Low-overhead trade execution reporting.",
    "syllabus": [
      "End-to-end HFT order messaging pipeline synthesis.",
      "Zero-allocation and lock-free thread coordination verification.",
      "Nanosecond tick-to-trade latency benchmark profiling."
    ],
    "eTitle": "Ultra-Low-Latency HFT Messaging Gateway Master",
    "eDesc": "Implement function `executeHftGatewayPipeline(rawItchPackets, ringBuffer, matchingEngine)` streaming packets through lock-free ring to matching engine.",
    "eStarter": "function executeHftGatewayPipeline(packets, ring, engine) {\n  // TODO: Parse ITCH packets, enqueue into SPSC ring, dequeue to matchingEngine, return pipeline metrics\n  \n}",
    "eHint": "For each packet in rawItchPackets: parse order; push to ring buffer; dequeue from ring and submit to engine; track totalLatencyNanos; return { totalOrdersProcessed: packets.length, tradesExecuted: tradesCount, gatewayStatus: 'HFT_PIPELINE_NOMINAL' }.",
    "eTest": "const ring = { size: 128, head: 0, tail: 0, buf: [] };\nconst engine = { trades: 0, process: () => { engine.trades++; } };\nconst packets = [{ symbol: 'AAPL', price: 150.0, qty: 100 }, { symbol: 'MSFT', price: 300.0, qty: 200 }];\nconst res = executeHftGatewayPipeline(packets, ring, engine);\nif (res.totalOrdersProcessed !== 2 || res.gatewayStatus !== 'HFT_PIPELINE_NOMINAL') throw new Error('HFT pipeline execution failed');\nconst emptyP = executeHftGatewayPipeline([], ring, engine);\nif (emptyP.totalOrdersProcessed !== 0) throw new Error('Empty packet pipeline failed');\nif (typeof res.totalOrdersProcessed !== 'number') throw new Error('Type mismatch');",
    "aTitle": "Tick-to-Trade Latency Percentile Calculator",
    "aDesc": "Implement function `calculateLatencyPercentiles(latencyMeasurementsNanos)` computing p50, p90, and p99 latency metrics in nanoseconds.",
    "aStarter": "function calculateLatencyPercentiles(latencies) {\n  // TODO: Sort array ascending; compute p50 at index floor(len*0.5), p90 at floor(len*0.9), p99 at floor(len*0.99)\n  \n}",
    "aHint": "sorted = latencies.slice().sort((a, b) => a - b); return { p50: sorted[Math.floor(sorted.length * 0.5)], p90: sorted[Math.floor(sorted.length * 0.9)], p99: sorted[Math.floor(sorted.length * 0.99)] };",
    "aTest": "const data = Array.from({ length: 100 }, (_, i) => i + 1); // 1 to 100\nconst res = calculateLatencyPercentiles(data);\nif (res.p50 !== 51 || res.p90 !== 91 || res.p99 !== 100) throw new Error('Latency percentiles failed');"
  },
  {
    "day": 16,
    "title": "Option Pricing & Greeks: Black-Scholes-Merton (BSM) Analytical Engine",
    "desc": "Implement the Black-Scholes-Merton option pricing formula and Greeks: European Call and Put pricing ($C(S, K, T, r, \\sigma)$), Cumulative Normal Distribution approximation, and Greeks (Delta $\\Delta$, Gamma $\\Gamma$, Theta $\\Theta$, Vega $\\nu$, Rho $\\rho$).",
    "syllabus": [
      "BSM Partial Differential Equation & Analytical Solution for Call and Put options.",
      "First-Order Greeks: Delta ($\\frac{\\partial V}{\\partial S}$), Vega ($\\frac{\\partial V}{\\partial \\sigma}$), Theta ($\\frac{\\partial V}{\\partial T}$).",
      "Second-Order Greeks: Gamma ($\\frac{\\partial^2 V}{\\partial S^2}$ - Curvature of Delta with respect to underlying spot price)."
    ],
    "eTitle": "Black-Scholes European Option & Greeks Analytical Engine",
    "eDesc": "Implement function `calculateBlackScholes(spotPrice, strikePrice, timeToExpiryYears, riskFreeRate, volatility)` computing Call price, Put price, Delta, and Gamma.",
    "eStarter": "function calculateBlackScholes(S, K, T, r, sigma) {\n  // TODO: Compute d1 = (ln(S/K) + (r + sigma^2/2)*T) / (sigma*sqrt(T)), d2 = d1 - sigma*sqrt(T), Call price, Put price, Delta, Gamma\n  \n}",
    "eHint": "Compute d1, d2 using standard normal cumulative function approximations; callPrice = S * N(d1) - K * Math.exp(-r * T) * N(d2); putPrice = K * Math.exp(-r * T) * N(-d2) - S * N(-d1); delta = N(d1); gamma = N_prime(d1) / (S * sigma * Math.sqrt(T)); return results object.",
    "eTest": "const bsm = calculateBlackScholes(100, 100, 1.0, 0.05, 0.20); // ATM Call ~ 10.45, Put ~ 5.57, Delta ~ 0.637\nif (bsm.callPrice < 10.0 || bsm.callPrice > 11.0 || bsm.delta < 0.60 || bsm.delta > 0.68) throw new Error('Black-Scholes call pricing failed');\nif (bsm.putPrice < 5.0 || bsm.putPrice > 6.0) throw new Error('Black-Scholes put pricing failed');\nif (bsm.gamma <= 0) throw new Error('Gamma must be strictly positive');",
    "aTitle": "Put-Call Parity Arbitrage Checker",
    "aDesc": "Implement function `verifyPutCallParity(callPrice, putPrice, spotPrice, strikePrice, riskFreeRate, timeYears)` verifying $C - P = S - K e^{-rT}$.",
    "aStarter": "function verifyPutCallParity(C, P, S, K, r, T) {\n  // TODO: Check if Math.abs((C - P) - (S - K * exp(-r * T))) < 0.05\n  \n}",
    "aHint": "left = callPrice - putPrice; right = spotPrice - strikePrice * Math.exp(-riskFreeRate * timeYears); diff = Math.abs(left - right); return { isParityHolding: diff < 0.05, discrepancy: Number(diff.toFixed(4)) };",
    "aTest": "const p = verifyPutCallParity(10.45, 5.57, 100, 100, 0.05, 1.0); // 10.45 - 5.57 = 4.88; 100 - 100*0.9512 = 4.88\nif (!p.isParityHolding || p.discrepancy > 0.05) throw new Error('Put-call parity check failed');"
  },
  {
    "day": 17,
    "title": "Implied Volatility Surface: Newton-Raphson Solver",
    "desc": "Invert Black-Scholes to extract market-implied volatility: The Newton-Raphson root-finding algorithm ($\\sigma_{n+1} = \\sigma_n - \\frac{C(\\sigma_n) - C_{\\text{market}}}{\\text{Vega}(\\sigma_n)}$), Volatility Smile, and Volatility Skew surfaces.",
    "syllabus": [
      "Implied Volatility (IV) as Market Fear Gauge: Solving $f(\\sigma) = C_{\\text{BS}}(\\sigma) - C_{\\text{market}} = 0$.",
      "Vega as Derivative: $\\frac{\\partial C}{\\partial \\sigma} = S \\sqrt{T} \\phi(d_1)$ providing gradient descent step.",
      "Volatility Surface Dynamics: Strike skew (Post-1987 crash crashophobia) and term structure."
    ],
    "eTitle": "Newton-Raphson Implied Volatility Solver",
    "eDesc": "Implement function `solveImpliedVolatility(marketPrice, spotPrice, strikePrice, timeYears, riskFreeRate, initialGuess = 0.20, maxIterations = 50)` converging on IV.",
    "eStarter": "function solveImpliedVolatility(marketPrice, S, K, T, r, guess = 0.2, maxIter = 50) {\n  // TODO: Iterate Newton-Raphson: sigma = sigma - (BS_Call(sigma) - marketPrice) / Vega(sigma) until diff < 0.0001\n  \n}",
    "eHint": "In each loop: compute price = bsmCall(sigma); vega = bsmVega(sigma); diff = price - marketPrice; if (Math.abs(diff) < 1e-4) return Number(sigma.toFixed(4)); sigma -= diff / vega; return Number(sigma.toFixed(4)).",
    "eTest": "const iv = solveImpliedVolatility(10.45, 100, 100, 1.0, 0.05, 0.30);\nif (Math.abs(iv - 0.20) > 0.02) throw new Error('Newton-Raphson IV failed to converge to 0.20: got ' + iv);\nconst highIv = solveImpliedVolatility(20.00, 100, 100, 1.0, 0.05, 0.20);\nif (highIv <= 0.20) throw new Error('High market price should yield high IV');\nif (typeof iv !== 'number') throw new Error('IV result must be numeric');",
    "aTitle": "Vega Derivative Helper Function",
    "aDesc": "Implement function `calculateBsmVega(spotPrice, strikePrice, timeYears, riskFreeRate, sigma)` computing $\\text{Vega} = S \\sqrt{T} \\frac{1}{\\sqrt{2\\pi}} e^{-d_1^2 / 2}$.",
    "aStarter": "function calculateBsmVega(S, K, T, r, sigma) {\n  // TODO: Calculate d1 and return S * sqrt(T) * standardNormalPdf(d1)\n  \n}",
    "aHint": "d1 = (Math.log(spotPrice / strikePrice) + (riskFreeRate + (sigma * sigma) / 2) * timeYears) / (sigma * Math.sqrt(timeYears)); pdf = Math.exp(-0.5 * d1 * d1) / Math.sqrt(2 * Math.PI); return spotPrice * Math.sqrt(timeYears) * pdf;",
    "aTest": "const v = calculateBsmVega(100, 100, 1.0, 0.05, 0.20);\nif (v < 35.0 || v > 40.0) throw new Error('Vega calculation failed');"
  },
  {
    "day": 18,
    "title": "Risk Management: Parametric & Historical Value at Risk (VaR)",
    "desc": "Quantify financial portfolio downside risk: Value at Risk (VaR at 95% and 99% confidence levels: $\\text{VaR} = -(\\mu - z_{\\alpha} \\sigma) \\cdot \\text{Portfolio Value}$), Parametric (Variance-Covariance) vs Historical Simulation vs Monte Carlo VaR.",
    "syllabus": [
      "VaR Definition: Maximum expected loss over a specific time horizon $T$ at confidence level $1 - \\alpha$.",
      "Normal Z-Scores: 95% Confidence ($z = 1.645$); 99% Confidence ($z = 2.326$).",
      "Square-Root of Time Rule: Scaling 1-day VaR to 10-day Basel regulatory VaR ($\\text{VaR}_{10} = \\text{VaR}_1 \\times \\sqrt{10}$)."
    ],
    "eTitle": "Parametric & Historical VaR Calculator",
    "eDesc": "Implement function `calculatePortfolioVaR(portfolioValue, dailyMeanReturn, dailyVolatility, confidenceLevel = 0.95)` computing 1-day dollar VaR.",
    "eStarter": "function calculatePortfolioVaR(val, mean, vol, conf = 0.95) {\n  // TODO: z = conf === 0.99 ? 2.326 : 1.645; varPct = -(mean - z * vol); varDollars = val * varPct\n  \n}",
    "eHint": "z = confidenceLevel === 0.99 ? 2.326 : (confidenceLevel === 0.95 ? 1.645 : 1.96); varPct = -(dailyMeanReturn - z * dailyVolatility); varDollars = portfolioValue * varPct; return { dollarVaR: Number(varDollars.toFixed(2)), percentageVaR: Number((varPct * 100).toFixed(2)), zScore: z }.",
    "eTest": "const v95 = calculatePortfolioVaR(1000000, 0.0005, 0.02, 0.95); // z=1.645. varPct = -(0.0005 - 1.645*0.02) = -(-0.0324) = 0.0324 -> $32,400\nif (v95.dollarVaR !== 32400.00 || v95.percentageVaR !== 3.24) throw new Error('95% VaR calculation failed');\nconst v99 = calculatePortfolioVaR(1000000, 0.0005, 0.02, 0.99); // z=2.326. varPct = -(0.0005 - 2.326*0.02) = 0.04602 -> $46,020\nif (v99.dollarVaR !== 46020.00) throw new Error('99% VaR calculation failed');\nif (v99.dollarVaR <= v95.dollarVaR) throw new Error('99% VaR must be strictly greater than 95% VaR');",
    "aTitle": "Square Root of Time VaR Scaler",
    "aDesc": "Implement function `scaleVaRHorizon(oneDayVaRDollars, horizonDays)` scaling 1-day VaR to multi-day horizon using $\\text{VaR}_T = \\text{VaR}_1 \\times \\sqrt{T}$.",
    "aStarter": "function scaleVaRHorizon(oneDayVaR, days) {\n  // TODO: Compute oneDayVaR * sqrt(days) and return formatted dollar amount\n  \n}",
    "aHint": "scaled = oneDayVaRDollars * Math.sqrt(horizonDays); return Number(scaled.toFixed(2));",
    "aTest": "const v10 = scaleVaRHorizon(10000, 10); // 10k * sqrt(10) = 31,622.78\nif (v10 !== 31622.78) throw new Error('VaR horizon scaling failed');"
  },
  {
    "day": 19,
    "title": "Tail Risk & Expected Shortfall (CVaR / Conditional VaR)",
    "desc": "Overcome VaR limitations with coherent risk measures: Expected Shortfall ($ES_\\alpha = E[L \\mid L > VaR_\\alpha]$), Subadditivity property of coherent risk measures ($ES(X + Y) \\le ES(X) + ES(Y)$), and Fat-tailed distributions (Student-t, Levy flights).",
    "syllabus": [
      "Why VaR Fails in Crises: VaR ignores the magnitude of tail losses beyond the percentile threshold.",
      "Expected Shortfall (CVaR): Average loss in the worst $\\alpha\\%$ tail outcomes (Basel III / FRTB standard).",
      "Subadditivity Invariant: Encouraging portfolio diversification by guaranteeing combined risk is less than sum of parts."
    ],
    "eTitle": "Historical Expected Shortfall (CVaR) Engine",
    "eDesc": "Implement function `calculateHistoricalCVaR(returnSeries, confidenceLevel = 0.95)` computing percentile VaR and Expected Shortfall average.",
    "eStarter": "function calculateHistoricalCVaR(returns, conf = 0.95) {\n  // TODO: Sort returns ascending; tail returns are the bottom (1 - conf)% slice; CVaR is -mean(tail)\n  \n}",
    "eHint": "sorted = returns.slice().sort((a, b) => a - b); cutoffIdx = Math.floor(sorted.length * (1 - confidenceLevel)); tailSlice = sorted.slice(0, cutoffIdx); varVal = -sorted[cutoffIdx]; cvarVal = -tailSlice.reduce((a, b) => a + b, 0) / tailSlice.length; return { var: Number(varVal.toFixed(4)), cvar: Number(cvarVal.toFixed(4)), tailLossCount: tailSlice.length }.",
    "eTest": "const rets = [-0.10, -0.08, -0.05, -0.02, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06]; // 10 returns, 95% -> bottom 1 = -0.10, or 90% bottom 2\nconst res = calculateHistoricalCVaR(rets, 0.80); // bottom 20% = bottom 2: [-0.10, -0.08] -> mean = -0.09 -> CVaR = 0.09\nif (res.cvar !== 0.0900 || res.tailLossCount !== 2) throw new Error('Historical CVaR calculation failed');\nif (res.cvar <= res.var) throw new Error('CVaR must exceed or equal VaR');\nif (typeof res.cvar !== 'number') throw new Error('CVaR return type mismatch');",
    "aTitle": "Coherent Risk Subadditivity Property Tester",
    "aDesc": "Implement function `isRiskMeasureSubadditive(riskPortfolioA, riskPortfolioB, riskCombinedPortfolio)` checking if $R(A+B) \\le R(A) + R(B)$.",
    "aStarter": "function isRiskMeasureSubadditive(rA, rB, rComb) {\n  // TODO: Return true if riskCombinedPortfolio <= (riskPortfolioA + riskPortfolioB)\n  \n}",
    "aHint": "Check riskCombinedPortfolio <= (riskPortfolioA + riskPortfolioB); return boolean indicating whether risk measure satisfies subadditivity axiom.",
    "aTest": "if (isRiskMeasureSubadditive(50, 40, 75) !== true || isRiskMeasureSubadditive(50, 40, 105) !== false) throw new Error('Subadditivity check failed');"
  },
  {
    "day": 20,
    "title": "Portfolio Optimization: Modern Portfolio Theory (Markowitz Frontier)",
    "desc": "Construct optimal mean-variance portfolios: Harry Markowitz Efficient Frontier (Maximizing Sharpe Ratio: $SR = \\frac{E[R_p] - R_f}{\\sigma_p}$), Covariance Matrix ($\\Sigma$), Minimum Variance Portfolio, and Capital Allocation Line (CAL).",
    "syllabus": [
      "Portfolio Expected Return & Variance: $E[R_p] = w^T \\mu$, $\\sigma_p^2 = w^T \\Sigma w$.",
      "Tangency Portfolio: The unique point on the efficient frontier maximizing risk-adjusted excess returns.",
      "Quadratic Programming Optimization with non-negative weight constraints ($w_i \\ge 0, \\sum w_i = 1$)."
    ],
    "eTitle": "2-Asset Markowitz Efficient Frontier & Sharpe Ratio Engine",
    "eDesc": "Implement function `calculatePortfolioMetrics(weightA, meanA, sigmaA, meanB, sigmaB, correlationRho, riskFreeRate = 0.02)` computing return, risk, and Sharpe Ratio.",
    "eStarter": "function calculatePortfolioMetrics(wA, mA, sA, mB, sB, rho, rf = 0.02) {\n  // TODO: wB = 1 - wA; portMean = wA*mA + wB*mB; portVariance = wA^2*sA^2 + wB^2*sB^2 + 2*wA*wB*sA*sB*rho; sharpe = (portMean - rf) / sqrt(var)\n  \n}",
    "eHint": "wB = 1.0 - weightA; expReturn = weightA * meanA + wB * meanB; variance = (weightA * weightA * sigmaA * sigmaA) + (wB * wB * sigmaB * sigmaB) + (2 * weightA * wB * sigmaA * sigmaB * correlationRho); volatility = Math.sqrt(variance); sharpe = (expReturn - riskFreeRate) / volatility; return { expectedReturn: Number(expReturn.toFixed(4)), volatility: Number(volatility.toFixed(4)), sharpeRatio: Number(sharpe.toFixed(4)) }.",
    "eTest": "const p = calculatePortfolioMetrics(0.6, 0.12, 0.15, 0.08, 0.10, 0.20, 0.02); // wA=0.6, wB=0.4 -> E[R] = 0.6*12 + 0.4*8 = 10.4%\nif (p.expectedReturn !== 0.1040 || p.volatility > 0.15 || p.sharpeRatio <= 0) throw new Error('Markowitz portfolio calculation failed');\nconst minVar = calculatePortfolioMetrics(0.5, 0.10, 0.10, 0.10, 0.10, -1.0, 0.02); // Perfectly negatively correlated\nif (minVar.volatility !== 0.0000) throw new Error('Perfect negative correlation should eliminate portfolio risk');\nif (typeof p.sharpeRatio !== 'number') throw new Error('Sharpe ratio type mismatch');",
    "aTitle": "Sharpe Ratio Risk-Adjusted Return Calculator",
    "aDesc": "Implement function `calculateSharpeRatio(portfolioReturn, riskFreeRate, portfolioStandardDeviation)` computing annualized Sharpe Ratio.",
    "aStarter": "function calculateSharpeRatio(ret, rf, stdDev) {\n  // TODO: Compute (portfolioReturn - riskFreeRate) / portfolioStandardDeviation\n  \n}",
    "aHint": "sharpe = (portfolioReturn - riskFreeRate) / portfolioStandardDeviation; return Number(sharpe.toFixed(2));",
    "aTest": "const sr = calculateSharpeRatio(0.15, 0.03, 0.08); // (15% - 3%) / 8% = 1.50\nif (sr !== 1.50) throw new Error('Sharpe ratio calculation failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Quantitative Pricing, Greeks & Risk Engine",
    "desc": "Milestone 3: Build an institutional quant risk management engine: Analytical Black-Scholes Greeks, Newton-Raphson IV solver, Historical Value at Risk (VaR), and Expected Shortfall (CVaR).",
    "syllabus": [
      "Quantitative Derivatives & Risk Synthesis.",
      "Multi-asset portfolio tail risk stress testing.",
      "Hedge fund risk report scorecard generation."
    ],
    "eTitle": "Quantitative Risk & Pricing Master Kernel",
    "eDesc": "Implement function `executeQuantRiskEngine(portfolioPositions, marketScenario)` calculating aggregated delta, vega, 99% VaR, and Expected Shortfall.",
    "eStarter": "function executeQuantRiskEngine(positions, scenario) {\n  // TODO: Aggregate net portfolio delta, vega, calculate VaR and Expected Shortfall under scenario\n  \n}",
    "eHint": "Aggregate netDelta = positions.reduce((s, p) => s + p.delta * p.qty, 0); netVega = positions.reduce((s, p) => s + p.vega * p.qty, 0); var99 = scenario.portfolioValue * 2.326 * scenario.dailyVol; return { netDelta: Number(netDelta.toFixed(2)), netVega: Number(netVega.toFixed(2)), dollarVaR99: Number(var99.toFixed(2)), engineStatus: 'QUANT_RISK_ENGINE_NOMINAL' }.",
    "eTest": "const positions = [{ symbol: 'AAPL', delta: 0.60, vega: 15, qty: 100 }, { symbol: 'SPY', delta: 0.50, vega: 20, qty: -50 }];\nconst res = executeQuantRiskEngine(positions, { portfolioValue: 1000000, dailyVol: 0.02 });\nif (res.netDelta !== 35.00 || res.netVega !== 500.00 || res.dollarVaR99 !== 46520.00 || res.engineStatus !== 'QUANT_RISK_ENGINE_NOMINAL') throw new Error('Milestone 3 quant risk master failed');\nconst emptyRes = executeQuantRiskEngine([], { portfolioValue: 0, dailyVol: 0 });\nif (emptyRes.netDelta !== 0.00) throw new Error('Empty positions check failed');\nif (typeof res.dollarVaR99 !== 'number') throw new Error('VaR return type mismatch');",
    "aTitle": "Portfolio Delta-Neutral Hedge Ratio Calculator",
    "aDesc": "Implement function `calculateDeltaHedgeShares(portfolioNetDelta, underlyingDeltaPerContract = 1.0)` calculating required hedge share adjustment.",
    "aStarter": "function calculateDeltaHedgeShares(netDelta, deltaPerContract = 1.0) {\n  // TODO: Return -round(portfolioNetDelta / underlyingDeltaPerContract) to achieve delta neutrality\n  \n}",
    "aHint": "hedgeShares = -Math.round(portfolioNetDelta / underlyingDeltaPerContract); return { requiredHedgeShares: hedgeShares, isDeltaNeutral: hedgeShares === 0 };",
    "aTest": "const h = calculateDeltaHedgeShares(250.0); // +250 delta -> Sell 250 shares\nif (h.requiredHedgeShares !== -250 || h.isDeltaNeutral) throw new Error('Delta hedge calculation failed');"
  },
  {
    "day": 22,
    "title": "High-Frequency Alpha Signals & Statistical Arbitrage",
    "desc": "Engineer statistical arbitrage strategies: Pairs Trading (Cointegration via Engle-Granger two-step method, Ornstein-Uhlenbeck mean-reversion process), Z-Score spread trading ($Z = \\frac{S_t - \\mu}{\\sigma}$), and Half-life of mean reversion ($\\tau = -\\frac{\\ln 2}{\\theta}$).",
    "syllabus": [
      "Stationarity vs Cointegration: Augmented Dickey-Fuller (ADF) test confirming mean-reverting spread.",
      "Ornstein-Uhlenbeck (OU) SDE: $dX_t = \\theta (\\mu - X_t) dt + \\sigma dW_t$.",
      "Signal Generation: Long spread when $Z < -2.0$; Short spread when $Z > +2.0$; Exit at $Z = 0$."
    ],
    "eTitle": "Pairs Trading Z-Score Alpha Signal Generator",
    "eDesc": "Implement function `calculatePairsTradingSignal(priceA, priceB, hedgeRatioBeta, spreadMean, spreadStdDev, entryZScore = 2.0)` generating buy/sell pairs signals.",
    "eStarter": "function calculatePairsTradingSignal(pA, pB, beta, mean, stdDev, entryZ = 2.0) {\n  // TODO: spread = pA - beta * pB; zScore = (spread - mean) / stdDev; if zScore > entryZ -> SHORT_SPREAD, if zScore < -entryZ -> LONG_SPREAD\n  \n}",
    "eHint": "spread = priceA - (hedgeRatioBeta * priceB); z = (spread - spreadMean) / spreadStdDev; if (z > entryZScore) signal = 'SHORT_SPREAD_SELL_A_BUY_B'; else if (z < -entryZScore) signal = 'LONG_SPREAD_BUY_A_SELL_B'; else signal = 'NO_TRADE'; return { spread: Number(spread.toFixed(4)), zScore: Number(z.toFixed(2)), signal }.",
    "eTest": "const s1 = calculatePairsTradingSignal(105, 50, 2.0, 0.0, 2.0, 2.0); // Spread = 105 - 2*50 = 5; z = (5 - 0)/2 = +2.5 -> Short spread\nif (s1.spread !== 5.0000 || s1.zScore !== 2.50 || s1.signal !== 'SHORT_SPREAD_SELL_A_BUY_B') throw new Error('Short pairs signal failed');\nconst s2 = calculatePairsTradingSignal(95, 50, 2.0, 0.0, 2.0, 2.0); // Spread = -5; z = -2.5 -> Long spread\nif (s2.zScore !== -2.50 || s2.signal !== 'LONG_SPREAD_BUY_A_SELL_B') throw new Error('Long pairs signal failed');\nconst s3 = calculatePairsTradingSignal(100, 50, 2.0, 0.0, 2.0, 2.0); // z = 0 -> No trade\nif (s3.signal !== 'NO_TRADE') throw new Error('Neutral z-score should not trade');",
    "aTitle": "Ornstein-Uhlenbeck Half-Life Estimator",
    "aDesc": "Implement function `calculateOuHalfLife(meanReversionSpeedTheta)` computing half-life time units using $\\tau = \\frac{\\ln 2}{\\theta}$.",
    "aStarter": "function calculateOuHalfLife(theta) {\n  // TODO: Compute Math.log(2) / theta, formatted to 2 decimal places\n  \n}",
    "aHint": "halfLife = Math.log(2) / meanReversionSpeedTheta; return Number(halfLife.toFixed(2));",
    "aTest": "const hl = calculateOuHalfLife(0.05); // ln(2) / 0.05 = 13.86\nif (hl !== 13.86) throw new Error('Half life calculation failed');"
  },
  {
    "day": 23,
    "title": "Smart Order Routing (SOR) & Best Execution Algorithms",
    "desc": "Route orders across fragmented lit and dark liquidity venues: SEC Rule 611 (Order Protection Rule), Fee-sensitive routing (Maker-Taker rebates), Latency-arbitrage defense, and Venue Allocation Optimization.",
    "syllabus": [
      "Reg NMS & Fragmented Markets: Routing orders across 16 US stock exchanges (NASDAQ, NYSE, Cboe, IEX).",
      "Fee-Sensitive SOR: Balancing execution quality against exchange maker rebates vs taker fees.",
      "IEX Speed Bump (350μs Coiled Fiber): Preventing high-frequency front-running on pegged orders."
    ],
    "eTitle": "Smart Order Router (SOR) Venue Allocation Engine",
    "eDesc": "Implement function `routeSorOrder(targetQuantity, venuesList)` allocating child order sizes across venues sorted by Best Price and lowest Taker Fee.",
    "eStarter": "function routeSorOrder(qty, venues) {\n  // TODO: Sort venues by best price, then lowest fee; allocate available liquidity until targetQuantity satisfied\n  \n}",
    "eHint": "Sort venues where side==='BUY' ? (a.askPrice - b.askPrice || a.takerFee - b.takerFee) : (b.bidPrice - a.bidPrice || a.takerFee - b.takerFee); fill orders greedily; return { allocations: array, totalFilled: number, remainingUnfilled: number }.",
    "eTest": "const venues = [\n  { name: 'NASDAQ', askPrice: 100.01, availableQty: 500, takerFee: 0.0030 },\n  { name: 'EDGX', askPrice: 100.01, availableQty: 300, takerFee: 0.0020 },\n  { name: 'NYSE', askPrice: 100.02, availableQty: 1000, takerFee: 0.0025 }\n];\nconst res = routeSorOrder(600, venues); // Takes 300 from EDGX (100.01 lower fee), then 300 from NASDAQ (100.01)\nif (res.allocations[0].venue !== 'EDGX' || res.allocations[0].routedQty !== 300 || res.allocations[1].venue !== 'NASDAQ' || res.allocations[1].routedQty !== 300) throw new Error('SOR venue allocation failed');\nif (res.totalFilled !== 600 || res.remainingUnfilled !== 0) throw new Error('SOR fill accounting failed');\nconst emptyVenues = routeSorOrder(100, []);\nif (emptyVenues.totalFilled !== 0 || emptyVenues.remainingUnfilled !== 100) throw new Error('Empty venue routing failed');",
    "aTitle": "Exchange Net Fee Rebate Calculator",
    "aDesc": "Implement function `calculateExchangeNetFee(shareCount, feeOrRebatePerShare)` calculating total dollar transaction exchange cost.",
    "aStarter": "function calculateExchangeNetFee(shares, feePerShare) {\n  // TODO: Compute (shares * feePerShare) and return formatted dollar value\n  \n}",
    "aHint": "fee = shareCount * feeOrRebatePerShare; return Number(fee.toFixed(2));",
    "aTest": "const fee = calculateExchangeNetFee(10000, -0.0025); // 10,000 * -$0.0025 = -$25.00 rebate\nif (fee !== -25.00) throw new Error('Exchange fee calculation failed');"
  },
  {
    "day": 24,
    "title": "Exchange Colocation & Cross-Connect Physics",
    "desc": "Master physical hardware low-latency realities: Equinix NY4 (Secaucus) vs Carteret (NASDAQ) vs Mahwah (NYSE), Light speed in fiber optic cable ($200{,}000\\text{ km/s}$ or $5\\text{ ns/meter}$), Direct Cross-Connects, and Cut-Through network switches.",
    "syllabus": [
      "Speed of Light in Fiber Optic Glass: Refractive index $n \\approx 1.4682 \\implies v = c / n \\approx 204{,}195\\text{ km/s}$ ($4.9\\text{ ns/meter}$).",
      "Fiber Length Equalization: Exchanges mandating identical spool lengths for all colocated member firms.",
      "Switch Latency: Store-and-Forward (500ns) vs Cut-Through ASIC switching (5ns)."
    ],
    "eTitle": "Fiber Optic Physical Latency & Cable Distance Simulator",
    "eDesc": "Implement function `calculateFiberLatency(cableLengthMeters, refractiveIndex = 1.4682)` computing one-way propagation time in nanoseconds.",
    "eStarter": "function calculateFiberLatency(meters, n = 1.4682) {\n  // TODO: Speed of light c = 299792458 m/s; speedInFiber = c / n; latencyNanos = (meters / speedInFiber) * 1e9\n  \n}",
    "eHint": "c = 299792458; v = c / refractiveIndex; nanos = (cableLengthMeters / v) * 1e9; return { propagationTimeNanoseconds: Number(nanos.toFixed(2)), nanosecondsPerMeter: Number(((1 / v) * 1e9).toFixed(3)) }.",
    "eTest": "const lat = calculateFiberLatency(1000, 1.4682); // 1 km = 1000m -> ~4897.39 ns (4.90 μs)\nif (lat.propagationTimeNanoseconds < 4890 || lat.propagationTimeNanoseconds > 4910 || lat.nanosecondsPerMeter !== 4.897) throw new Error('Fiber propagation calculation failed');\nconst short = calculateFiberLatency(10, 1.4682);\nif (short.propagationTimeNanoseconds < 48 || short.propagationTimeNanoseconds > 50) throw new Error('10m fiber latency failed');\nif (typeof lat.propagationTimeNanoseconds !== 'number') throw new Error('Type check failed');",
    "aTitle": "Fiber vs Free-Space Microwave Speed Ratio Calculator",
    "aDesc": "Implement function `calculateMicrowaveVsFiberSpeedup(fiberLatencyNanos, microwaveLatencyNanos)` calculating physical speed advantage factor.",
    "aStarter": "function calculateMicrowaveVsFiberSpeedup(fiberNs, microNs) {\n  // TODO: Compute fiberNs / microNs, returning speedup factor formatted to 2 decimal places\n  \n}",
    "aHint": "ratio = fiberLatencyNanos / microwaveLatencyNanos; return Number(ratio.toFixed(2));",
    "aTest": "const sp = calculateMicrowaveVsFiberSpeedup(4897, 3335); // ~1.47x speedup\nif (sp !== 1.47) throw new Error('Microwave speedup calculation failed');"
  },
  {
    "day": 25,
    "title": "Microwave, Millimeter-Wave & Shortwave Radio Trading Networks",
    "desc": "Transmit trading signals at near light speed: Microwave line-of-sight networks (Chicago CME to New Jersey NY4 in $3.97\\text{ ms}$ vs $6.5\\text{ ms}$ in fiber), Rain fade attenuation at 38 GHz, and Shortwave (HF 3-30 MHz) trans-Atlantic ionospheric bounce.",
    "syllabus": [
      "Free-Space Speed of Light: $c \\approx 299{,}792\\text{ km/s}$ in air ($n \\approx 1.0003$) vs fiber ($n \\approx 1.47$) delivering a 47% speed boost.",
      "Chicago-to-New Jersey Microwave Path: 30+ relay towers along the line-of-sight geodesic route.",
      "Weather Degradation & Fallback: Automated failover to millimeter-wave or laser when heavy rain attenuates 38 GHz signals."
    ],
    "eTitle": "Chicago-to-NJ Microwave Line-of-Sight Latency Simulator",
    "eDesc": "Implement function `simulateMicrowaveNetwork(geodesicDistanceKm, relayTowerCount, perTowerHopDelayNanos, weatherRainRateMmPerHour)` calculating end-to-end one-way latency.",
    "eStarter": "function simulateMicrowaveNetwork(distKm, towers, hopDelayNs, rainRate) {\n  // TODO: airSpeed = 299792.458 / 1.0003 km/s; propagationMs = (distKm / airSpeed) * 1000; towerDelayMs = (towers * hopDelayNs) / 1e6\n  \n}",
    "eHint": "airSpeed = 299792.458 / 1.0003; propMs = (geodesicDistanceKm / airSpeed) * 1000; hopMs = (relayTowerCount * perTowerHopDelayNanos) / 1e6; isAttenuated = weatherRainRateMmPerHour > 25; return { totalOneWayLatencyMs: Number((propMs + hopMs).toFixed(3)), isSignalDegraded: isAttenuated, pathStatus: isAttenuated ? 'FAILOVER_TO_FIBER_BACKUP' : 'MICROWAVE_ACTIVE_LOW_LATENCY' }.",
    "eTest": "const cme = simulateMicrowaveNetwork(1180, 30, 200, 0); // 1180 km / 299702 = 3.937 ms + 0.006 ms = 3.943 ms\nif (cme.totalOneWayLatencyMs !== 3.943 || cme.isSignalDegraded || cme.pathStatus !== 'MICROWAVE_ACTIVE_LOW_LATENCY') throw new Error('Microwave latency simulation failed');\nconst rain = simulateMicrowaveNetwork(1180, 30, 200, 50); // Heavy storm\nif (!rain.isSignalDegraded || rain.pathStatus !== 'FAILOVER_TO_FIBER_BACKUP') throw new Error('Rain fade failover failed');\nif (typeof cme.totalOneWayLatencyMs !== 'number') throw new Error('Type mismatch');",
    "aTitle": "Microwave Air Propagation Delay Calculator",
    "aDesc": "Implement function `calculateMicrowavePropagationDelay(distanceKm, refractiveIndex = 1.0003)` computing propagation time in milliseconds.",
    "aStarter": "function calculateMicrowavePropagationDelay(distKm, n = 1.0003) {\n  // TODO: Compute (distKm / (299792.458 / n)) * 1000, formatted to 4 decimal places\n  \n}",
    "aHint": "speed = 299792.458 / refractiveIndex; ms = (distanceKm / speed) * 1000; return Number(ms.toFixed(4));",
    "aTest": "const d = calculateMicrowavePropagationDelay(1000, 1.0003); // 1000 / 299702.5 = 3.3366 ms\nif (d !== 3.3366) throw new Error('Air propagation delay failed');"
  },
  {
    "day": 26,
    "title": "Backtesting Pitfalls: Lookahead Bias & Overfitting Elimination",
    "desc": "Build rigorous quantitative backtesting pipelines: Eliminating Lookahead Bias (Point-in-Time financial data), Survivorship Bias (Including delisted/bankrupt equities), Overfitting & Data Snooping, and Walk-Forward cross-validation.",
    "syllabus": [
      "Point-in-Time (PIT) Databases: Using data strictly available at timestamp $T$, preventing future revisions from leaking.",
      "Survivorship Bias: Why backtesting only on today's S&P 500 constituents inflates historical CAGR by 3-5%.",
      "Deflated Sharpe Ratio (Bailey & Lopez de Prado): Adjusting backtest performance for the number of tested trial strategies."
    ],
    "eTitle": "Point-in-Time Backtest Temporal Integrity Auditor",
    "eDesc": "Implement function `auditBacktestTimeline(eventsList)` verifying that no trading decision uses data timestamped after the order decision timestamp.",
    "eStarter": "function auditBacktestTimeline(events) {\n  // TODO: Check if any event has dataTimestamp > decisionTimestamp; return { hasLookaheadBias: boolean, violations: array }\n  \n}",
    "eHint": "Iterate events; if (event.dataTimestamp > event.decisionTimestamp) record violation; return { hasLookaheadBias: violations.length > 0, violationsCount: violations.length, isTemporalIntegrityPreserved: violations.length === 0 }.",
    "eTest": "const clean = [\n  { id: 'e1', dataTimestamp: 1000, decisionTimestamp: 1005 },\n  { id: 'e2', dataTimestamp: 1010, decisionTimestamp: 1012 }\n];\nconst r1 = auditBacktestTimeline(clean);\nif (r1.hasLookaheadBias || !r1.isTemporalIntegrityPreserved) throw new Error('Clean timeline flagged bias in error');\nconst dirty = [\n  { id: 'e1', dataTimestamp: 1050, decisionTimestamp: 1000 } // Data from future!\n];\nconst r2 = auditBacktestTimeline(dirty);\nif (!r2.hasLookaheadBias || r2.violationsCount !== 1) throw new Error('Lookahead bias failed to trigger');\nconst emptyTimeline = auditBacktestTimeline([]);\nif (emptyTimeline.hasLookaheadBias) throw new Error('Empty timeline check failed');",
    "aTitle": "Deflated Sharpe Ratio Multi-Trial Haircut Calculator",
    "aDesc": "Implement function `calculateDeflatedSharpeHaircut(observedSharpe, numberOfStrategiesTested)` applying statistical penalty for data snooping.",
    "aStarter": "function calculateDeflatedSharpeHaircut(sharpe, trials) {\n  // TODO: Compute penalty = sqrt(2 * log(trials)) * 0.2; return max(0, sharpe - penalty)\n  \n}",
    "aHint": "penalty = Math.sqrt(2 * Math.log(numberOfStrategiesTested)) * 0.2; adjusted = Math.max(0, observedSharpe - penalty); return Number(adjusted.toFixed(2));",
    "aTest": "const adj = calculateDeflatedSharpeHaircut(2.5, 100); // penalty = sqrt(2 * 4.605) * 0.2 = 3.03 * 0.2 = 0.61 -> 1.89\nif (adj !== 1.89) throw new Error('Deflated Sharpe calculation failed');"
  },
  {
    "day": 27,
    "title": "Pre-Trade Risk Controls & Fat-Finger Circuit Breakers",
    "desc": "Enforce ultra-fast pre-trade risk controls (SEC Rule 15c3-5 Market Access Rule): Maximum order size limit, Maximum notional order value, Maximum price deviation from NBBO collar, and Global Kill Switch triggers.",
    "syllabus": [
      "SEC Rule 15c3-5: Mandatory broker-dealer pre-trade risk checks executed in hardware before order egress.",
      "Fat-Finger Limiters: Rejecting errant orders exceeding 10x average daily volume or 100x standard clip size.",
      "Kill Switch Architecture: One-click API cancelling all open resting orders and rejecting incoming messages in <10ms."
    ],
    "eTitle": "Ultra-Fast Pre-Trade Risk Gatekeeper",
    "eDesc": "Implement function `validatePreTradeRisk(order, riskLimits, currentNbboMid)` checking max size, max notional, and price collar.",
    "eStarter": "function validatePreTradeRisk(order, limits, midPrice) {\n  // TODO: Check order.qty <= limits.maxQty, notional <= limits.maxNotional, and abs(price - mid)/mid <= limits.maxPriceCollarPct\n  \n}",
    "eHint": "notional = order.qty * order.price; priceDev = Math.abs(order.price - midPrice) / midPrice; if (order.qty > limits.maxQty) return { approved: false, reason: 'MAX_QTY_BREACH' }; if (notional > limits.maxNotional) return { approved: false, reason: 'MAX_NOTIONAL_BREACH' }; if (priceDev > limits.maxPriceCollar) return { approved: false, reason: 'PRICE_COLLAR_BREACH' }; return { approved: true }.",
    "eTest": "const limits = { maxQty: 1000, maxNotional: 200000, maxPriceCollar: 0.05 };\nconst ok = validatePreTradeRisk({ qty: 500, price: 150.00 }, limits, 150.00); // 75k notional\nif (!ok.approved) throw new Error('Valid order failed risk gate');\nconst fatFingerQty = validatePreTradeRisk({ qty: 5000, price: 150.00 }, limits, 150.00);\nif (fatFingerQty.approved || fatFingerQty.reason !== 'MAX_QTY_BREACH') throw new Error('Max qty breach failed to block');\nconst collarBreach = validatePreTradeRisk({ qty: 100, price: 170.00 }, limits, 150.00); // 13.3% deviation > 5%\nif (collarBreach.approved || collarBreach.reason !== 'PRICE_COLLAR_BREACH') throw new Error('Price collar breach failed to block');",
    "aTitle": "Order Notional Value Calculator",
    "aDesc": "Implement function `calculateOrderNotional(orderQuantity, limitPrice)` computing total monetary value of order.",
    "aStarter": "function calculateOrderNotional(qty, price) {\n  // TODO: Compute (qty * price) and return formatted notional value\n  \n}",
    "aHint": "notional = orderQuantity * limitPrice; return Number(notional.toFixed(2));",
    "aTest": "if (calculateOrderNotional(1000, 152.50) !== 152500.00) throw new Error('Notional value calculation failed');\nif (calculateOrderNotional(0, 100) !== 0.00) throw new Error('Zero qty notional failed');"
  },
  {
    "day": 28,
    "title": "Crypto Derivatives: Perpetual Futures & Funding Rate Arbitrage",
    "desc": "Trade cryptocurrency derivatives: Perpetual Swaps without expiry, Funding Rate mechanisms ($F = \\text{Clamp}(\\text{Premium Index}, -0.05\\%, +0.05\\%) + \\text{Interest}$), Cash-and-Carry Arbitrage, and Liquidation Engine cascading risk.",
    "syllabus": [
      "Perpetual Futures Mechanism: Using periodic 8-hour funding rate payments to tether perpetual price to spot index.",
      "Funding Rate Arbitrage (Basis Trade): Long spot + Short perpetual contract earning 10-30% annualized yield with zero directional delta.",
      "Liquidation Cascade & Auto-Deleveraging (ADL): Insurance fund mechanics during extreme crypto market volatility."
    ],
    "eTitle": "Perpetual Funding Rate Payment & Annualized Yield Engine",
    "eDesc": "Implement function `calculateFundingRateYield(positionNotional, fundingRate8hPercent, holdingPeriodsCount)` computing funding payment and annualized APR.",
    "eStarter": "function calculateFundingRateYield(notional, rate8hPct, periods) {\n  // TODO: paymentPerPeriod = notional * (rate8hPct / 100); totalEarned = paymentPerPeriod * periods; annualizedApr = rate8hPct * 3 * 365\n  \n}",
    "eHint": "rateDec = fundingRate8hPercent / 100; payment = positionNotional * rateDec; total = payment * holdingPeriodsCount; apr = Number((fundingRate8hPercent * 3 * 365).toFixed(2)); return { paymentPerPeriod: Number(payment.toFixed(2)), totalFundingEarned: Number(total.toFixed(2)), annualizedAprPercent: apr }.",
    "eTest": "const res = calculateFundingRateYield(100000, 0.01, 3); // 0.01% per 8h on 100k = $10 per period * 3 = $30. APR = 0.01 * 3 * 365 = 10.95%\nif (res.paymentPerPeriod !== 10.00 || res.totalFundingEarned !== 30.00 || res.annualizedAprPercent !== 10.95) throw new Error('Funding rate yield calculation failed');\nconst negRes = calculateFundingRateYield(100000, -0.02, 1); // Negative rate\nif (res.paymentPerPeriod < 0) throw new Error('Positive payment check failed');\nif (typeof res.annualizedAprPercent !== 'number') throw new Error('Type mismatch');",
    "aTitle": "Perpetual Contract Liquidation Price Estimator",
    "aDesc": "Implement function `calculateLiquidationPrice(entryPrice, leverage, maintenanceMarginPct = 0.5)` calculating bankrupt margin call threshold for long positions.",
    "aStarter": "function calculateLiquidationPrice(entry, lev, mmPct = 0.5) {\n  // TODO: liqPrice = entry * (1 - (1 / lev) + (mmPct / 100))\n  \n}",
    "aHint": "liq = entryPrice * (1 - (1 / leverage) + (maintenanceMarginPct / 100)); return Number(liq.toFixed(2));",
    "aTest": "const liq = calculateLiquidationPrice(50000, 10, 0.5); // 50000 * (1 - 0.10 + 0.005) = 50000 * 0.905 = 45250\nif (liq !== 45250.00) throw new Error('Liquidation price calculation failed');"
  },
  {
    "day": 29,
    "title": "High-Frequency Trading Infrastructure: FPGA & ASIC Offloading",
    "desc": "Accelerate order execution to hardware nanoseconds: Field Programmable Gate Arrays (FPGA: Xilinx Virtex UltraScale+), Verilog/VHDL hardware description, Tick-to-Trade in 50 nanoseconds, and AXI stream memory bus architecture.",
    "syllabus": [
      "Hardware Acceleration: FPGA parsing raw 10G/25G Ethernet MAC packets and generating FIX orders directly in silicon.",
      "FPGA vs CPU Latency: 50ns deterministic hardware pipeline vs 500ns+ jitter-prone C++ software loop.",
      "Hybrid FPGA-CPU Architecture: FPGA handles book building & risk checks; CPU runs complex alpha models."
    ],
    "eTitle": "Hardware FPGA Clock Cycle to Nanosecond Simulator",
    "eDesc": "Implement function `calculateFpgaPipelineLatency(pipelineStagesCount, clockFrequencyMhz, clockCyclesPerStage = 1)` computing hardware execution time in nanoseconds.",
    "eStarter": "function calculateFpgaPipelineLatency(stages, freqMhz, cyclesPerStage = 1) {\n  // TODO: clockPeriodNanos = 1000 / freqMhz; totalLatencyNanos = stages * cyclesPerStage * clockPeriodNanos\n  \n}",
    "eHint": "periodNs = 1000.0 / clockFrequencyMhz; totalNs = pipelineStagesCount * clockCyclesPerStage * periodNs; return { clockPeriodNanoseconds: Number(periodNs.toFixed(3)), totalPipelineLatencyNanoseconds: Number(totalNs.toFixed(2)), isUnder100Nanos: totalNs < 100 };",
    "eTest": "const fpga = calculateFpgaPipelineLatency(12, 322.26, 1); // 322.26 MHz clock (10G MAC) -> 3.103 ns * 12 = 37.24 ns\nif (fpga.totalPipelineLatencyNanoseconds !== 37.24 || !fpga.isUnder100Nanos) throw new Error('FPGA pipeline calculation failed');\nconst slow = calculateFpgaPipelineLatency(50, 100, 2); // 10ns * 100 = 1000ns\nif (slow.isUnder100Nanos) throw new Error('Slow clock flagged under 100ns in error');\nif (typeof fpga.totalPipelineLatencyNanoseconds !== 'number') throw new Error('Type mismatch');",
    "aTitle": "FPGA Lookup Table (LUT) Resource Utilization Calculator",
    "aDesc": "Implement function `calculateFpgaLutUtilization(usedLuts, totalAvailableLuts)` computing hardware chip area utilization percentage.",
    "aStarter": "function calculateFpgaLutUtilization(used, total) {\n  // TODO: Compute (used / total) * 100 and evaluate if within safe timing closure threshold (<= 85%)\n  \n}",
    "aHint": "pct = (usedLuts / totalAvailableLuts) * 100; return { utilizationPercent: Number(pct.toFixed(2)), isWithinSafeTimingClosure: pct <= 85.0 };",
    "aTest": "const lut = calculateFpgaLutUtilization(450000, 600000); // 75.0% -> Safe\nif (lut.utilizationPercent !== 75.00 || !lut.isWithinSafeTimingClosure) throw new Error('LUT utilization calculation failed');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Ultra-Low-Latency Quantitative Trading & Market Making System",
    "desc": "Final Capstone Synthesis: Build an end-to-end quantitative algorithmic trading system: Direct Binary ITCH 5.0 feed parser, Lock-free SPSC ring buffer, Deterministic Limit Order Book matching engine, Almgren-Chriss market impact optimizer, Avellaneda-Stoikov market making skewer, Black-Scholes Greeks, Parametric 99% VaR, Pre-trade fat-finger risk gate, and Microwave propagation routing.",
    "syllabus": [
      "Master Quantitative Trading & Execution Architecture Synthesis.",
      "Zero-Allocation Ultra-Low-Latency Invariant & Nanosecond Profiling.",
      "Lead Quantitative Developer / HFT Engineer Boardroom Certification."
    ],
    "eTitle": "Sovereign Ultra-Low-Latency Quant Trading System Master",
    "eDesc": "Implement function `orchestrateQuantHftSystem(itchPacket, riskLimits, modelParameters)` processing feed, verifying risk, calculating pricing, and dispatching execution.",
    "eStarter": "function orchestrateQuantHftSystem(packet, risk, params) {\n  // TODO: Validate packet, enforce pre-trade risk controls, calculate reservation price, and output execution order\n  \n}",
    "eHint": "Verify packet.price > 0 && packet.qty <= risk.maxQty; compute reservation price = params.mid - (params.inventory * params.gamma * params.sigma^2); if pre-trade passes, generate execution dispatch; return { executionApproved: true, routedPrice: reservationPrice, systemStatus: 'HFT_SOVEREIGN_SYSTEM_ONLINE' }.",
    "eTest": "const packet = { symbol: 'AAPL', price: 150.00, qty: 500 };\nconst risk = { maxQty: 1000, maxNotional: 200000, maxPriceCollar: 0.05 };\nconst params = { mid: 150.00, inventory: 5, gamma: 0.1, sigma: 0.2 };\nconst res = orchestrateQuantHftSystem(packet, risk, params);\nif (!res.executionApproved || res.systemStatus !== 'HFT_SOVEREIGN_SYSTEM_ONLINE') throw new Error('Capstone quant system execution failed');\nconst badOrder = { symbol: 'AAPL', price: 150.00, qty: 5000 };\nconst badRes = orchestrateQuantHftSystem(badOrder, risk, params);\nif (badRes.executionApproved) throw new Error('Risk breach passed in error');\nif (typeof res.executionApproved !== 'boolean') throw new Error('Execution approved type check failed');",
    "aTitle": "Quant Trading System Production Readiness Auditor",
    "aDesc": "Implement function `auditQuantProductionReadiness(lobVerified, riskControlsPassed, latencyP99Nanos, varCalculated)` certifying institutional quant deployment readiness.",
    "aStarter": "function auditQuantProductionReadiness(lob, risk, latNanos, varOk) {\n  // TODO: Verify all flags are true and latencyP99Nanos < 1000, returning certification report\n  \n}",
    "aHint": "isReady = Boolean(lobVerified && riskControlsPassed && latencyP99Nanos < 1000 && varCalculated); return { isProductionReady: isReady, certificationGrade: isReady ? 'TIER_1_HFT_PROD_CERTIFIED' : 'REMEDIATION_REQUIRED' };",
    "aTest": "const cert = auditQuantProductionReadiness(true, true, 450, true);\nif (!cert.isProductionReady || cert.certificationGrade !== 'TIER_1_HFT_PROD_CERTIFIED') throw new Error('Quant certification audit failed');\nconst slow = auditQuantProductionReadiness(true, true, 5000, true);\nif (slow.isProductionReady) throw new Error('High latency passed audit in error');"
  }
];

export const QUANT_SYSTEMS_30_DAYS_QUESTS: CourseQuest[] = QUANT_SYSTEMS_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('quant-systems', idx + 1, cfg)
);
