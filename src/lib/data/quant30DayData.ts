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
    "eDesc": "Implement function calculateNbboSpread(bestBid, bestAsk, tickSize = 0.01) calculating dollar spread, spread in ticks, midpoint, and spread percentage.",
    "eStarter": "function calculateNbboSpread(bid, ask, tick = 0.01) {\n  const spread = Number((ask - bid).toFixed(4));\n  const midpoint = Number(((bid + ask) / 2).toFixed(4));\n  const spreadTicks = Math.round(spread / tick);\n  const spreadBps = Number(((spread / midpoint) * 10000).toFixed(2));\n  return {\n    bestBid: bid,\n    bestAsk: ask,\n    spreadDollars: spread,\n    spreadTicks,\n    midpoint,\n    spreadBasisPoints: spreadBps,\n    status: spread > 0 ? 'MARKET_TWO_SIDED_VALID' : 'CROSSED_OR_LOCKED_MARKET_ERROR'\n  };\n}",
    "eHint": "Compute spread = ask - bid, midpoint = (bid + ask) / 2, spreadTicks = spread / tick, spreadBps = (spread / midpoint) * 10000.",
    "eTest": "const ok = calculateNbboSpread(150.00, 150.05, 0.01);\nconst crossed = calculateNbboSpread(150.05, 150.00, 0.01);\nif (ok.spreadTicks !== 5 || ok.midpoint !== 150.025 || ok.spreadBasisPoints !== 3.33 || ok.status !== 'MARKET_TWO_SIDED_VALID' || crossed.status !== 'CROSSED_OR_LOCKED_MARKET_ERROR') throw new Error('NBBO calculation failed');",
    "aTitle": "Midpoint Price Rounder",
    "aDesc": "Implement function getMidpoint(bid, ask) returning `Number(((bid + ask) / 2).toFixed(2))`.",
    "aStarter": "function getMidpoint(b, a) { return Number(((b + a) / 2).toFixed(2)); }",
    "aHint": "Return (bid + ask) / 2 rounded to 2 decimals.",
    "aTest": "if (getMidpoint(100.10, 100.20) !== 100.15) throw new Error('Midpoint failed');"
  },
  {
    "day": 2,
    "title": "Limit Order Book (LOB) Architecture",
    "desc": "Build high-performance Limit Order Books: Bid/Ask Red-Black trees, FIFO Price-Time Priority queues, depth levels ($L_1..L_N$), and O(1) order lookup hash tables.",
    "syllabus": [
      "LOB Dual-Side Structure: Bids sorted descending (Highest price first), Asks sorted ascending (Lowest price first).",
      "Price-Time Priority (FIFO): Orders at the same price level are matched in strict arrival timestamp order.",
      "Memory Allocation: Intrusive doubly linked lists for $O(1)$ order cancellation and fill tracking."
    ],
    "eTitle": "FIFO Price-Time Priority Queue Inserter",
    "eDesc": "Implement function insertLimitOrder(queue, newOrder) maintaining strict FIFO arrival sequence for identical price levels.",
    "eStarter": "function insertLimitOrder(queue, order) {\n  const updated = [...queue, { orderId: order.orderId, price: order.price, qty: order.qty, timestamp: order.timestamp }];\n  // Sort by price (bids desc, asks asc handled outside) and secondary timestamp asc (FIFO)\n  updated.sort((a, b) => a.timestamp - b.timestamp);\n  return {\n    queueLength: updated.length,\n    headOrderId: updated[0].orderId,\n    totalDepthQty: updated.reduce((acc, o) => acc + o.qty, 0),\n    orders: updated,\n    status: 'LOB_LEVEL_FIFO_INSERTED'\n  };\n}",
    "eHint": "Append order and sort by timestamp ascending for FIFO queue order.",
    "eTest": "const q = [{ orderId: 'ORD_1', price: 100.0, qty: 100, timestamp: 1000 }];\nconst res = insertLimitOrder(q, { orderId: 'ORD_2', price: 100.0, qty: 50, timestamp: 1005 });\nif (res.headOrderId !== 'ORD_1' || res.totalDepthQty !== 150 || res.queueLength !== 2) throw new Error('LOB FIFO insert failed');",
    "aTitle": "Order Quantity Aggregator",
    "aDesc": "Implement function sumOrderQuantities(orders) returning `orders.reduce((sum, o) => sum + o.qty, 0)`.",
    "aStarter": "function sumOrderQuantities(orders) { return orders.reduce((s, o) => s + o.qty, 0); }",
    "aHint": "Sum qty across orders.",
    "aTest": "if (sumOrderQuantities([{ qty: 10 }, { qty: 20 }]) !== 30) throw new Error('Sum failed');"
  },
  {
    "day": 3,
    "title": "Order Book Matching Engine Implementation",
    "desc": "Execute continuous matching: Crossing buy/sell orders, generating Execution Reports, executing partial fills, and updating resting depth levels in sub-microsecond cycles.",
    "syllabus": [
      "Crossing Invariant: Incoming Buy order ($P_{\\text{buy}} \\ge P_{\\text{best\\_ask}}$) or Sell order ($P_{\\text{sell}} \\le P_{\\text{best\\_bid}}$).",
      "Partial Fill Mechanics: Deducting matched volume, keeping remaining resting volume at original priority.",
      "Execution Trade Pricing: Passive resting order price determines the execution trade price (Maker price rule)."
    ],
    "eTitle": "Continuous Order Book Matching Engine Kernel",
    "eDesc": "Implement function matchIncomingOrder(restingAsks, incomingBuyOrder) executing trades against best available asks with partial fill accounting.",
    "eStarter": "function matchIncomingOrder(asks, buyOrder) {\n  const sortedAsks = [...asks].sort((a, b) => a.price - b.price || a.timestamp - b.timestamp);\n  let remainingBuyQty = buyOrder.qty;\n  const fills = [];\n  const remainingAsks = [];\n\n  for (const ask of sortedAsks) {\n    if (remainingBuyQty <= 0 || buyOrder.price < ask.price) {\n      remainingAsks.push(ask);\n      continue;\n    }\n    const fillQty = Math.min(remainingBuyQty, ask.qty);\n    fills.push({\n      makerOrderId: ask.orderId,\n      takerOrderId: buyOrder.orderId,\n      fillPrice: ask.price,\n      fillQty\n    });\n    remainingBuyQty -= fillQty;\n    if (ask.qty > fillQty) {\n      remainingAsks.push({ ...ask, qty: ask.qty - fillQty });\n    }\n  }\n\n  return {\n    totalFilledQty: buyOrder.qty - remainingBuyQty,\n    remainingBuyQty,\n    tradeExecutions: fills,\n    updatedAsks: remainingAsks,\n    status: remainingBuyQty === 0 ? 'ORDER_FULLY_FILLED' : (fills.length > 0 ? 'ORDER_PARTIALLY_FILLED' : 'NO_FILL_RESTING')\n  };\n}",
    "eHint": "Iterate asks in price ascending order, execute fillQty = min(remainingBuyQty, ask.qty) at ask.price.",
    "eTest": "const asks = [{ orderId: 'ASK_1', price: 100.0, qty: 50, timestamp: 1 }, { orderId: 'ASK_2', price: 100.5, qty: 100, timestamp: 2 }];\nconst matchRes = matchIncomingOrder(asks, { orderId: 'BUY_1', price: 100.5, qty: 80 });\nif (matchRes.totalFilledQty !== 80 || matchRes.tradeExecutions.length !== 2 || matchRes.updatedAsks[0].qty !== 70 || matchRes.status !== 'ORDER_FULLY_FILLED') throw new Error('Matching engine failed');",
    "aTitle": "Fill Price Rule Formatter",
    "aDesc": "Implement function getFillRule() returning `'MAKER_RESTING_PRICE'`.",
    "aStarter": "function getFillRule() {\n  // Write your answer here\n}",
    "aHint": "Return maker price rule string.",
    "aTest": "if (getFillRule() !== 'MAKER_RESTING_PRICE') throw new Error('Rule check failed');"
  },
  {
    "day": 4,
    "title": "Algorithmic Execution: VWAP & TWAP Strategies",
    "desc": "Minimize market impact on institutional block orders: Volume-Weighted Average Price (VWAP), Time-Weighted Average Price (TWAP), historical U-shaped intraday volume curves, and dynamic slice sizing.",
    "syllabus": [
      "VWAP Equation: $\\text{VWAP} = \\frac{\\sum P_i V_i}{\\sum V_i}$ over the trading day.",
      "U-Shaped Intraday Volume Curve: High volume at market open (09:30) and close (16:00), low volume at midday.",
      "TWAP Slicing: Uniform distribution of child order slices across discrete time bins."
    ],
    "eTitle": "Intraday VWAP Target Slice Allocator",
    "eDesc": "Implement function calculateVwapChildSlices(totalOrderQty, historicalVolumeBuckets) distributing child orders according to volume profile.",
    "eStarter": "function calculateVwapChildSlices(totalQty, volumeBuckets) {\n  const totalHistoricalVol = volumeBuckets.reduce((acc, v) => acc + v.volume, 0);\n  const slices = volumeBuckets.map(b => {\n    const weight = b.volume / totalHistoricalVol;\n    const sliceQty = Math.round(totalQty * weight);\n    return {\n      bucketTime: b.time,\n      expectedVolumePct: Number((weight * 100).toFixed(2)),\n      targetSliceQty: sliceQty\n    };\n  });\n  return {\n    totalOrderQty: totalQty,\n    slices,\n    status: 'VWAP_SLICES_SCHEDULED_VOLUME_WEIGHTED'\n  };\n}",
    "eHint": "Compute weight = b.volume / totalVol and sliceQty = round(totalQty * weight).",
    "eTest": "const buckets = [{ time: '09:30', volume: 4000 }, { time: '12:00', volume: 2000 }, { time: '15:30', volume: 4000 }];\nconst res = calculateVwapChildSlices(10000, buckets);\nif (res.slices[0].targetSliceQty !== 4000 || res.slices[1].targetSliceQty !== 2000 || res.status !== 'VWAP_SLICES_SCHEDULED_VOLUME_WEIGHTED') throw new Error('VWAP slice allocator failed');",
    "aTitle": "VWAP Benchmark Evaluator",
    "aDesc": "Implement function evaluateVwapPerformance(execPrice, marketVwap, isBuy) returning `isBuy ? (execPrice < marketVwap ? 'OUTPERFORMED_BENCHMARK' : 'UNDERPERFORMED') : (execPrice > marketVwap ? 'OUTPERFORMED_BENCHMARK' : 'UNDERPERFORMED')`.",
    "aStarter": "function evaluateVwapPerformance(e, m, buy) { return buy ? (e < m ? 'OUTPERFORMED_BENCHMARK' : 'UNDERPERFORMED') : (e > m ? 'OUTPERFORMED_BENCHMARK' : 'UNDERPERFORMED'); }",
    "aHint": "Check if buy exec price is lower than market VWAP.",
    "aTest": "if (evaluateVwapPerformance(99.5, 100.0, true) !== 'OUTPERFORMED_BENCHMARK') throw new Error('VWAP eval failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Limit Order Book & Matching Engine Kernel",
    "desc": "Milestone 1: Build a production limit order book and ultra-fast matching engine: Bid/Ask depth level management, FIFO price-time priority queues, crossing order fills, VWAP benchmark tracking, and order book integrity audits.",
    "syllabus": [
      "LOB dual-side red-black tree & FIFO queue synthesis.",
      "Continuous double auction matching engine executions.",
      "Zero crossed book invariant verification."
    ],
    "eTitle": "Production LOB Matching & Execution Master Kernel",
    "eDesc": "Implement function executeLobMatchingEngine(initialBids, initialAsks, incomingOrders) processing an entire batch of orders and returning updated book state with execution log.",
    "eStarter": "function executeLobMatchingEngine(bids, asks, orders) {\n  let currBids = [...bids];\n  let currAsks = [...asks];\n  const allFills = [];\n\n  for (const o of orders) {\n    if (o.side === 'BUY') {\n      // Match against asks\n      currAsks.sort((a, b) => a.price - b.price || a.timestamp - b.timestamp);\n      let remaining = o.qty;\n      const nextAsks = [];\n      for (const a of currAsks) {\n        if (remaining > 0 && o.price >= a.price) {\n          const f = Math.min(remaining, a.qty);\n          allFills.push({ takerId: o.orderId, makerId: a.orderId, price: a.price, qty: f });\n          remaining -= f;\n          if (a.qty > f) nextAsks.push({ ...a, qty: a.qty - f });\n        } else {\n          nextAsks.push(a);\n        }\n      }\n      currAsks = nextAsks;\n      if (remaining > 0) currBids.push({ ...o, qty: remaining });\n    }\n  }\n\n  return {\n    totalTradesExecuted: allFills.length,\n    executions: allFills,\n    finalBidsCount: currBids.length,\n    finalAsksCount: currAsks.length,\n    engineStatus: 'LOB_MATCHING_ENGINE_ACTIVE_NOMINAL'\n  };\n}",
    "eHint": "Process orders against asks, deduct fills, update book levels.",
    "eTest": "const b = [];\nconst a = [{ orderId: 'A1', price: 50.0, qty: 100, timestamp: 1 }];\nconst o = [{ orderId: 'B1', side: 'BUY', price: 50.0, qty: 40 }];\nconst res = executeLobMatchingEngine(b, a, o);\nif (res.totalTradesExecuted !== 1 || res.finalAsksCount !== 1 || res.executions[0].qty !== 40 || res.engineStatus !== 'LOB_MATCHING_ENGINE_ACTIVE_NOMINAL') throw new Error('Milestone 1 LOB engine failed');",
    "aTitle": "Matching Engine State Formatter",
    "aDesc": "Implement function formatEngineState(active) returning `MATCHING_ENGINE_${active ? 'ONLINE' : 'HALTED'}`.",
    "aStarter": "function formatEngineState(a) { return `MATCHING_ENGINE_${a ? 'ONLINE' : 'HALTED'}`; }",
    "aHint": "Format state string.",
    "aTest": "if (formatEngineState(true) !== 'MATCHING_ENGINE_ONLINE') throw new Error('Engine state format failed');"
  },
  {
    "day": 6,
    "title": "Market Impact & Slippage Models: Almgren-Chriss Framework",
    "desc": "Model how your own trades move the market: Temporary vs Permanent Market Impact, Square-Root Law of Market Impact ($I \\propto \\sigma \\sqrt{Q / V}$), Almgren-Chriss optimal liquidation trajectories, and risk-aversion parameters.",
    "syllabus": [
      "Square-Root Law: Price impact scales with the square root of relative trade size: $\\Delta P = Y \\cdot \\sigma \\sqrt{\\frac{Q}{V}}$.",
      "Permanent Impact ($I_{\\text{perm}} = \\gamma Q$ shifts the equilibrium price) vs Temporary Impact ($I_{\\text{temp}} = \\eta (\\frac{Q}{T})$ dissipates after trade).",
      "Almgren-Chriss Trajectory: Optimal balance between execution cost (impact) and timing risk (volatility)."
    ],
    "eTitle": "Square-Root Law Market Impact Calculator",
    "eDesc": "Implement function calculateSquareRootImpact(orderQty, dailyVolume, dailyVolatility, constantY = 0.5) calculating expected price slippage basis points.",
    "eStarter": "function calculateSquareRootImpact(qty, dailyVol, sigma, y = 0.5) {\n  const participationRatio = qty / dailyVol;\n  const impactPct = y * sigma * Math.sqrt(participationRatio);\n  const impactBps = Number((impactPct * 10000).toFixed(2));\n  return {\n    orderQty: qty,\n    participationRatio: Number((participationRatio * 100).toFixed(3)),\n    expectedImpactBps: impactBps,\n    status: 'MARKET_IMPACT_CALCULATED_SQUARE_ROOT_LAW'\n  };\n}",
    "eHint": "Compute impactPct = y * sigma * sqrt(qty / dailyVol) and convert to basis points.",
    "eTest": "const res = calculateSquareRootImpact(10000, 1000000, 0.02, 0.5); // 1% of volume, 2% vol, Y=0.5 -> 0.5 * 0.02 * 0.1 = 0.001 (10 bps)\nif (res.expectedImpactBps !== 10.0 || res.status !== 'MARKET_IMPACT_CALCULATED_SQUARE_ROOT_LAW') throw new Error('Market impact calculation failed');",
    "aTitle": "Participation Ratio Checker",
    "aDesc": "Implement function isParticipationSafe(qty, vol, maxRatio = 0.05) returning `(qty / vol) <= maxRatio`.",
    "aStarter": "function isParticipationSafe(q, v, max = 0.05) { return (q / v) <= max; }",
    "aHint": "Check qty / vol <= maxRatio.",
    "aTest": "if (!isParticipationSafe(100, 10000) || isParticipationSafe(1000, 10000)) throw new Error('Participation check failed');"
  },
  {
    "day": 7,
    "title": "Order Book Imbalance (OBI) & Micro-Price Estimation",
    "desc": "Predict short-term price movements from order book depth: Order Book Imbalance ($\\text{OBI} = \\frac{V_{\\text{bid}} - V_{\\text{ask}}}{V_{\\text{bid}} + V_{\\text{ask}}}$), Stoikov Micro-Price ($P_{\\text{micro}} = P_{\\text{bid}} \\frac{V_{\\text{ask}}}{V_{\\text{bid}} + V_{\\text{ask}}} + P_{\\text{ask}} \\frac{V_{\\text{bid}}}{V_{\\text{bid}} + V_{\\text{ask}}}$), and High-Frequency Alpha Signals.",
    "syllabus": [
      "Order Book Imbalance (OBI): Bounded between $[-1, +1]$; $\\text{OBI} > +0.5$ signals imminent upward price jump.",
      "Stoikov Micro-Price: Volume-weighted mid-price that weights the price closer to the heavier side of the book.",
      "Queue Position Predictive Signals."
    ],
    "eTitle": "Stoikov Micro-Price & Order Book Imbalance Estimator",
    "eDesc": "Implement function calculateMicroPrice(bestBid, bidQty, bestAsk, askQty) calculating OBI and Stoikov Micro-Price.",
    "eStarter": "function calculateMicroPrice(bid, bidQty, ask, askQty) {\n  const totalVol = bidQty + askQty;\n  const obi = (bidQty - askQty) / totalVol;\n  const microPrice = (bid * (askQty / totalVol)) + (ask * (bidQty / totalVol));\n  const midpoint = (bid + ask) / 2;\n  return {\n    orderBookImbalance: Number(obi.toFixed(4)),\n    midpoint: Number(midpoint.toFixed(4)),\n    microPrice: Number(microPrice.toFixed(4)),\n    predictedDirection: obi > 0.1 ? 'BULLISH_UPWARD_PRESSURE' : (obi < -0.1 ? 'BEARISH_DOWNWARD_PRESSURE' : 'NEUTRAL_PRESSURE'),\n    status: 'MICRO_PRICE_ESTIMATED'\n  };\n}",
    "eHint": "Compute obi = (bidQty - askQty) / totalVol and microPrice = bid * (askQty/totalVol) + ask * (bidQty/totalVol).",
    "eTest": "const res = calculateMicroPrice(100.0, 900, 100.10, 100); // Heavy bid book!\nif (res.orderBookImbalance !== 0.8 || res.microPrice !== 100.09 || res.predictedDirection !== 'BULLISH_UPWARD_PRESSURE') throw new Error('Micro-price estimation failed');",
    "aTitle": "OBI Range Bound Validator",
    "aDesc": "Implement function isValidObi(obi) returning `obi >= -1.0 && obi <= 1.0`.",
    "aStarter": "function isValidObi(o) { return o >= -1.0 && o <= 1.0; }",
    "aHint": "Check range [-1, 1].",
    "aTest": "if (!isValidObi(0.5) || isValidObi(1.5)) throw new Error('OBI validation failed');"
  },
  {
    "day": 8,
    "title": "High-Frequency Market Making: Avellaneda-Stoikov Model",
    "desc": "Provide liquidity profitably while managing inventory risk: Avellaneda-Stoikov Reservation Price ($r(s, q, t) = s - q \\gamma \\sigma^2 (T - t)$), optimal bid-ask spread quotes ($\\delta^b + \\delta^a$), and inventory penalty parameter ($\\gamma$).",
    "syllabus": [
      "Inventory Risk: Holding long/short inventory exposes market makers to adverse price jumps.",
      "Reservation Price ($r$): Skews mid-price downward when inventory $q > 0$ (To attract buyers and deter sellers!).",
      "Optimal Spread Quotes: $\\delta^a, \\delta^b = r \\pm \\frac{1}{\\gamma} \\ln(1 + \\frac{\\gamma}{\\kappa})$."
    ],
    "eTitle": "Avellaneda-Stoikov Reservation Price & Quote Skewer",
    "eDesc": "Implement function calculateAvellanedaQuotes(midPrice, inventoryQ, gamma = 0.1, sigma = 0.02, timeRemainingT = 1.0, halfSpread = 0.02) calculating optimal bid and ask quotes.",
    "eStarter": "function calculateAvellanedaQuotes(mid, q, gamma = 0.1, sigma = 0.02, t = 1.0, halfSpread = 0.02) {\n  const inventoryPenalty = q * gamma * (sigma * sigma) * t;\n  const reservationPrice = mid - inventoryPenalty;\n  const optimalBid = Number((reservationPrice - halfSpread).toFixed(4));\n  const optimalAsk = Number((reservationPrice + halfSpread).toFixed(4));\n  return {\n    midPrice: mid,\n    currentInventory: q,\n    reservationPrice: Number(reservationPrice.toFixed(4)),\n    quotedBid: optimalBid,\n    quotedAsk: optimalAsk,\n    status: 'AVELLANEDA_STOIKOV_QUOTES_CALCULATED'\n  };\n}",
    "eHint": "Compute reservationPrice = mid - (q * gamma * sigma^2 * t) and quotes = reservationPrice +- halfSpread.",
    "eTest": "const longRes = calculateAvellanedaQuotes(100.0, 50, 0.1, 0.2, 1.0, 0.05); // Long inventory -> Skews price DOWN\nconst flatRes = calculateAvellanedaQuotes(100.0, 0, 0.1, 0.2, 1.0, 0.05);  // Flat inventory\nif (longRes.reservationPrice >= 100.0 || flatRes.reservationPrice !== 100.0 || longRes.status !== 'AVELLANEDA_STOIKOV_QUOTES_CALCULATED') throw new Error('Avellaneda-Stoikov quotes failed');",
    "aTitle": "Inventory Sign Formatter",
    "aDesc": "Implement function formatInventoryPosition(q) returning `q > 0 ? 'LONG' : (q < 0 ? 'SHORT' : 'FLAT')`.",
    "aStarter": "function formatInventoryPosition(q) { return q > 0 ? 'LONG' : (q < 0 ? 'SHORT' : 'FLAT'); }",
    "aHint": "Check sign of q.",
    "aTest": "if (formatInventoryPosition(10) !== 'LONG' || formatInventoryPosition(-5) !== 'SHORT') throw new Error('Inventory sign failed');"
  },
  {
    "day": 9,
    "title": "Financial Information eXchange (FIX 4.4) Protocol & FAST Compression",
    "desc": "Encode and decode institutional market messaging: FIX 4.4 Tag-Value pairs (`8=FIX.4.4|9=...|35=D|...|10=...`), Checksum modulo 256 verification, and FAST (FIX Adapted for STreaming) binary compression.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Financial Information eXchange (FIX 4.4) Protocol & FAST Compression.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "FIX 4.4 Tag-Value Message Checksum & Tag Parser",
    "eDesc": "Implement function parseFixMessage(rawFixString) validating checksum tag 10 and parsing message type tag 35.",
    "eStarter": "function parseFixMessage(rawFix) {\n  const parts = rawFix.split('\\x01').filter(p => p.length > 0);\n  const tags = {};\n  for (const p of parts) {\n    const [k, v] = p.split('=');\n    tags[k] = v;\n  }\n  const hasCheckSum = Boolean(tags['10']);\n  const msgType = tags['35'];\n  const isValid = Boolean(tags['8'] && tags['9'] && tags['35'] && hasCheckSum);\n  return {\n    fixVersion: tags['8'],\n    messageType: msgType === 'D' ? 'NEW_ORDER_SINGLE' : (msgType === '8' ? 'EXECUTION_REPORT' : 'OTHER'),\n    checksum: tags['10'],\n    isValidFix: isValid,\n    status: isValid ? 'FIX_MESSAGE_PARSED_AND_VALIDATED' : 'INVALID_FIX_FORMAT'\n  };\n}",
    "eHint": "Split on SOH (\\x01), extract tags, and verify tags 8, 9, 35, 10.",
    "eTest": "const raw = '8=FIX.4.4\\x019=65\\x0135=D\\x0149=BUYER\\x0156=EXCHANGE\\x0110=128\\x01';\nconst res = parseFixMessage(raw);\nif (!res.isValidFix || res.messageType !== 'NEW_ORDER_SINGLE' || res.status !== 'FIX_MESSAGE_PARSED_AND_VALIDATED') throw new Error('FIX parser failed');",
    "aTitle": "FIX Tag 35 Name Formatter",
    "aDesc": "Implement function getFixMsgTypeName(type) returning `type === 'D' ? 'NEW_ORDER_SINGLE' : (type === '8' ? 'EXECUTION_REPORT' : 'OTHER')`.",
    "aStarter": "function getFixMsgTypeName(t) { return t === 'D' ? 'NEW_ORDER_SINGLE' : (t === '8' ? 'EXECUTION_REPORT' : 'OTHER'); }",
    "aHint": "Return tag 35 name.",
    "aTest": "if (getFixMsgTypeName('D') !== 'NEW_ORDER_SINGLE') throw new Error('FIX tag name failed');"
  },
  {
    "day": 10,
    "title": "NASDAQ TotalView-ITCH 5.0 & OUCH Protocols: Direct Binary Market Feeds",
    "desc": "Process ultra-high-speed binary exchange feeds: NASDAQ ITCH 5.0 (Type 'A' Add Order, 'E' Order Executed, 'C' Executed with Price, 'X' Cancel), big-endian binary packing, and sub-nanosecond parsing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of NASDAQ TotalView-ITCH 5.0 & OUCH Protocols: Direct Binary Market Feeds.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "NASDAQ ITCH 5.0 Binary Add Order Packet Unpacker",
    "eDesc": "Implement function unpackItchAddOrder(msgType, stockSymbol, shares, priceInteger, isBuy) unpacking ITCH binary struct.",
    "eStarter": "function unpackItchAddOrder(type, symbol, shares, priceInt, isBuy) {\n  const priceDollars = Number((priceInt / 10000).toFixed(4));\n  const isAddOrder = (type === 'A' || type === 'F');\n  return {\n    messageType: type,\n    stockSymbol: symbol.trim(),\n    shares,\n    priceDollars,\n    side: isBuy ? 'BUY' : 'SELL',\n    isAddOrder,\n    status: isAddOrder ? 'ITCH_ADD_ORDER_UNPACKED' : 'UNSUPPORTED_ITCH_MESSAGE'\n  };\n}",
    "eHint": "Convert priceInt to dollars (/ 10000) and verify message type 'A' or 'F'.",
    "eTest": "const res = unpackItchAddOrder('A', 'AAPL    ', 100, 1502500, true); // 150.25 dollars\nif (res.priceDollars !== 150.25 || res.stockSymbol !== 'AAPL' || !res.isAddOrder || res.status !== 'ITCH_ADD_ORDER_UNPACKED') throw new Error('ITCH unpacker failed');",
    "aTitle": "ITCH Price Scaling Formatter",
    "aDesc": "Implement function formatItchPrice(rawInt) returning `Number((rawInt / 10000).toFixed(4))`.",
    "aStarter": "function formatItchPrice(p) { return Number((p / 10000).toFixed(4)); }",
    "aHint": "Divide by 10000.",
    "aTest": "if (formatItchPrice(1005000) !== 100.5) throw new Error('ITCH price format failed');"
  },
  {
    "day": 11,
    "title": "Kernel Bypass Networking: Solarflare Onload & DPDK Zero-Copy",
    "desc": "Bypass the Linux TCP/IP kernel stack: OpenOnload, DPDK (Data Plane Development Kit), ring buffers mapped directly to NIC DMA memory, and slashing packet latency from 15 microseconds to 800 nanoseconds.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Kernel Bypass Networking: Solarflare Onload & DPDK Zero-Copy.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Kernel Stack vs Kernel Bypass Latency Evaluator",
    "eDesc": "Implement function evaluateKernelBypassLatency(isKernelBypassActive, baselineKernelUs = 15.0, bypassUs = 0.8) calculating latency speedup factor.",
    "eStarter": "function evaluateKernelBypassLatency(bypassActive, kernelUs = 15.0, bypassUs = 0.8) {\n  const latencyUs = bypassActive ? bypassUs : kernelUs;\n  const speedup = kernelUs / bypassUs;\n  return {\n    kernelBypassEnabled: bypassActive,\n    measuredLatencyMicroseconds: latencyUs,\n    speedupFactor: Number(speedup.toFixed(1)),\n    status: bypassActive ? 'KERNEL_BYPASS_ZERO_COPY_ACTIVE' : 'STANDARD_LINUX_KERNEL_STACK'\n  };\n}",
    "eHint": "Compute speedup factor and return latency object.",
    "eTest": "const res = evaluateKernelBypassLatency(true, 15.0, 0.8);\nif (res.measuredLatencyMicroseconds !== 0.8 || res.speedupFactor !== 18.8 || res.status !== 'KERNEL_BYPASS_ZERO_COPY_ACTIVE') throw new Error('Kernel bypass latency failed');",
    "aTitle": "NIC Ring Buffer Mode Formatter",
    "aDesc": "Implement function formatNicMode(bypass) returning `bypass ? 'DPDK_POLL_MODE_DRIVER' : 'SOCKET_INTERRUPT_DRIVEN'`.",
    "aStarter": "function formatNicMode(b) { return b ? 'DPDK_POLL_MODE_DRIVER' : 'SOCKET_INTERRUPT_DRIVEN'; }",
    "aHint": "Return NIC mode string.",
    "aTest": "if (formatNicMode(true) !== 'DPDK_POLL_MODE_DRIVER') throw new Error('NIC mode format failed');"
  },
  {
    "day": 12,
    "title": "Lock-Free Ring Buffers: Single-Producer Single-Consumer (SPSC) Architecture",
    "desc": "Transmit millions of market updates between threads with zero lock contention: SPSC Circular Ring Buffers, atomic memory barriers (`acquire`/`release`), cacheline padding, and lock-free concurrency.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Lock-Free Ring Buffers: Single-Producer Single-Consumer (SPSC) Architecture.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "SPSC Lock-Free Circular Ring Buffer Stepper",
    "eDesc": "Implement function stepSpscRingBuffer(head, tail, capacity, isPush, isPop) managing atomic power-of-two circular queue indexes.",
    "eStarter": "function stepSpscRingBuffer(head, tail, cap = 1024, isPush = false, isPop = false) {\n  let nextHead = head;\n  let nextTail = tail;\n  let pushSuccess = false;\n  let popSuccess = false;\n\n  if (isPush) {\n    const isFull = ((head - tail) >= cap);\n    if (!isFull) {\n      nextHead = head + 1;\n      pushSuccess = true;\n    }\n  }\n  if (isPop) {\n    const isEmpty = (nextHead <= nextTail);\n    if (!isEmpty) {\n      nextTail = tail + 1;\n      popSuccess = true;\n    }\n  }\n\n  return {\n    head: nextHead,\n    tail: nextTail,\n    currentOccupancy: nextHead - nextTail,\n    pushSuccess,\n    popSuccess,\n    status: 'SPSC_QUEUE_STEPPED_LOCK_FREE'\n  };\n}",
    "eHint": "Check if (head - tail >= cap) for full, (head <= tail) for empty, increment head on push and tail on pop.",
    "eTest": "const pushRes = stepSpscRingBuffer(0, 0, 1024, true, false);\nconst popRes = stepSpscRingBuffer(1, 0, 1024, false, true);\nif (pushRes.head !== 1 || !pushRes.pushSuccess || popRes.tail !== 1 || !popRes.popSuccess) throw new Error('SPSC ring buffer failed');",
    "aTitle": "Power of Two Capacity Verifier",
    "aDesc": "Implement function isPowerOfTwo(n) returning `(n > 0) && ((n & (n - 1)) === 0)`.",
    "aStarter": "function isPowerOfTwo(n) { return (n > 0) && ((n & (n - 1)) === 0); }",
    "aHint": "Check (n & (n - 1)) === 0.",
    "aTest": "if (!isPowerOfTwo(1024) || isPowerOfTwo(1000)) throw new Error('Power of two check failed');"
  },
  {
    "day": 13,
    "title": "CPU Cacheline Alignment & False Sharing Elimination in C++",
    "desc": "Eliminate multi-core cache invalidation bottlenecks: 64-byte L1 Cachelines, False Sharing (`alignas(64)`), MESI cache coherence protocol, and NUMA memory affinity.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of CPU Cacheline Alignment & False Sharing Elimination in C++.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Cacheline Alignment & False Sharing Auditor",
    "eDesc": "Implement function auditCachelineSharing(varOffsetA, varOffsetB, cachelineBytes = 64) detecting if two variables share the same 64-byte L1 cacheline.",
    "eStarter": "function auditCachelineSharing(offsetA, offsetB, lineSize = 64) {\n  const lineA = Math.floor(offsetA / lineSize);\n  const lineB = Math.floor(offsetB / lineSize);\n  const isSharing = (lineA === lineB);\n  return {\n    cachelineA: lineA,\n    cachelineB: lineB,\n    falseSharingDetected: isSharing,\n    remedy: isSharing ? 'APPLY_ALIGNAS_64_PADDING' : 'CACHE_ALIGNMENT_OPTIMAL',\n    status: isSharing ? 'FALSE_SHARING_PERFORMANCE_DEGRADED' : 'CACHE_LINES_ISOLATED_NOMINAL'\n  };\n}",
    "eHint": "Check if floor(offsetA / 64) === floor(offsetB / 64).",
    "eTest": "const sharing = auditCachelineSharing(8, 16, 64); // Both on line 0!\nconst isolated = auditCachelineSharing(8, 72, 64); // Line 0 vs Line 1\nif (!sharing.falseSharingDetected || isolated.falseSharingDetected || sharing.remedy !== 'APPLY_ALIGNAS_64_PADDING') throw new Error('False sharing audit failed');",
    "aTitle": "Cacheline Size Formatter",
    "aDesc": "Implement function formatCachelineSize(bytes = 64) returning `${bytes}-byte L1 Cacheline`.",
    "aStarter": "function formatCachelineSize(b = 64) { return `${b}-byte L1 Cacheline`; }",
    "aHint": "Format string.",
    "aTest": "if (formatCachelineSize(64) !== '64-byte L1 Cacheline') throw new Error('Cacheline format failed');"
  },
  {
    "day": 14,
    "title": "SIMD Vectorization (AVX-512) for Pricing & Risk Kernels",
    "desc": "Calculate 8 to 16 option prices simultaneously in a single CPU cycle: Intel AVX-512 vector registers (`__m512d`), fused multiply-add (FMA), and vectorized Black-Scholes pricing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of SIMD Vectorization (AVX-512) for Pricing & Risk Kernels.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "AVX-512 Vectorized Parallel Throughput Evaluator",
    "eDesc": "Implement function evaluateAvx512Throughput(scalarCycleCount, vectorWidthDoubles = 8) calculating theoretical pricing acceleration.",
    "eStarter": "function evaluateAvx512Throughput(scalarCycles, width = 8) {\n  const vectorCycles = Math.ceil(scalarCycles / width);\n  const speedup = scalarCycles / vectorCycles;\n  return {\n    scalarCycleDuration: scalarCycles,\n    avx512VectorWidth: width,\n    vectorCycleDuration: vectorCycles,\n    vectorSpeedupFactor: Number(speedup.toFixed(1)),\n    status: 'AVX512_SIMD_PARALLEL_ACCELERATED'\n  };\n}",
    "eHint": "Compute vectorCycles = ceil(scalarCycles / width) and speedup.",
    "eTest": "const res = evaluateAvx512Throughput(800, 8); // 800 down to 100 cycles\nif (res.vectorCycleDuration !== 100 || res.vectorSpeedupFactor !== 8.0 || res.status !== 'AVX512_SIMD_PARALLEL_ACCELERATED') throw new Error('AVX512 throughput failed');",
    "aTitle": "Vector Register Width Formatter",
    "aDesc": "Implement function formatVectorWidth(bits) returning `${bits}-bit AVX Register`.",
    "aStarter": "function formatVectorWidth(b) { return `${b}-bit AVX Register`; }",
    "aHint": "Format string.",
    "aTest": "if (formatVectorWidth(512) !== '512-bit AVX Register') throw new Error('Vector width format failed');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Ultra-Low-Latency Order Messaging & Concurrency Engine",
    "desc": "Milestone 2: Build a production ultra-low-latency market connectivity engine: NASDAQ ITCH 5.0 binary order parser, SPSC lock-free ring buffer transmission, cacheline false-sharing isolation, and kernel-bypass throughput verification.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 2: Complete Ultra-Low-Latency Order Messaging & Concurrency Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Low-Latency Connectivity & Messaging Master Engine",
    "eDesc": "Implement function executeLowLatencyMessagingEngine(itchPackets, ringBufferCapacity) parsing market packets and streaming into lock-free ring buffer without thread blocking.",
    "eStarter": "function executeLowLatencyMessagingEngine(packets, cap) {\n  const parsed = [];\n  let pushedCount = 0;\n  for (let i = 0; i < packets.length; i++) {\n    const p = packets[i];\n    if (p.type === 'A') {\n      parsed.push({ symbol: p.sym, price: p.px, shares: p.qty });\n      if (pushedCount < cap) pushedCount++;\n    }\n  }\n  return {\n    totalPacketsProcessed: packets.length,\n    validItchOrdersExtracted: parsed.length,\n    ringBufferQueuedOrders: pushedCount,\n    kernelBypassVerified: true,\n    engineStatus: 'LOW_LATENCY_MESSAGING_ENGINE_ACTIVE'\n  };\n}",
    "eHint": "Parse ITCH packets, queue into ring buffer, return operational status.",
    "eTest": "const pkts = [{ type: 'A', sym: 'AAPL', px: 150.0, qty: 100 }, { type: 'A', sym: 'MSFT', px: 300.0, qty: 50 }];\nconst res = executeLowLatencyMessagingEngine(pkts, 1024);\nif (res.validItchOrdersExtracted !== 2 || res.ringBufferQueuedOrders !== 2 || res.engineStatus !== 'LOW_LATENCY_MESSAGING_ENGINE_ACTIVE') throw new Error('Milestone 2 Messaging engine failed');",
    "aTitle": "Transport Protocol Name Formatter",
    "aDesc": "Implement function formatTransportName(name) returning `PROTOCOL_${name}`.",
    "aStarter": "function formatTransportName(n) { return `PROTOCOL_${n}`; }",
    "aHint": "Format string.",
    "aTest": "if (formatTransportName('ITCH50') !== 'PROTOCOL_ITCH50') throw new Error('Transport format failed');"
  },
  {
    "day": 16,
    "title": "Option Pricing & Greeks: Black-Scholes-Merton (BSM) Analytical Engine",
    "desc": "Price financial derivatives in closed form: Black-Scholes Call/Put formulas, $d_1$ and $d_2$, and the First & Second Order Greeks: Delta ($\\Delta$), Gamma ($\\Gamma$), Vega ($\\mathcal{V}$), Theta ($\\Theta$), and Rho ($\\rho$).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Option Pricing & Greeks: Black-Scholes-Merton (BSM) Analytical Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Black-Scholes European Call Option & Delta Evaluator",
    "eDesc": "Implement function calculateBlackScholesCall(spotS, strikeK, timeToMaturityT, riskFreeR, volatilitySigma) calculating $d_1$, $d_2$, and Call Delta.",
    "eStarter": "function calculateBlackScholesCall(S, K, T, r, sigma) {\n  const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));\n  const d2 = d1 - (sigma * Math.sqrt(T));\n  // Approximation for standard normal CDF N(d1)\n  const delta = Number((0.5 * (1 + Math.sign(d1) * Math.sqrt(1 - Math.exp(-2 * d1 * d1 / Math.PI)))).toFixed(4));\n  return {\n    spotPrice: S,\n    strikePrice: K,\n    d1: Number(d1.toFixed(4)),\n    d2: Number(d2.toFixed(4)),\n    callDelta: delta,\n    status: 'BLACK_SCHOLES_CALL_CALCULATED'\n  };\n}",
    "eHint": "Compute d1 = (ln(S/K) + (r + 0.5*sigma^2)*T) / (sigma*sqrt(T)) and d2 = d1 - sigma*sqrt(T).",
    "eTest": "const res = calculateBlackScholesCall(100, 100, 1.0, 0.05, 0.20);\nif (res.d1 !== 0.35 || res.d2 !== 0.15 || res.status !== 'BLACK_SCHOLES_CALL_CALCULATED') throw new Error('Black-Scholes calculation failed');",
    "aTitle": "Put-Call Parity Delta Relationship",
    "aDesc": "Implement function getPutDeltaFromCallDelta(callDelta) returning `Number((callDelta - 1.0).toFixed(4))`.",
    "aStarter": "function getPutDeltaFromCallDelta(d) { return Number((d - 1.0).toFixed(4)); }",
    "aHint": "Subtract 1.0 from callDelta.",
    "aTest": "if (getPutDeltaFromCallDelta(0.60) !== -0.40) throw new Error('Put delta failed');"
  },
  {
    "day": 17,
    "title": "Implied Volatility Surface: Newton-Raphson Solver",
    "desc": "Invert market option prices to extract Implied Volatility: Newton-Raphson iterative root finding ($\\sigma_{n+1} = \\sigma_n - \\frac{C(\\sigma_n) - C_{\\text{market}}}{\\text{Vega}(\\sigma_n)}$), Volatility Smile, and Volatility Skew.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Implied Volatility Surface: Newton-Raphson Solver.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Newton-Raphson Implied Volatility Solver",
    "eDesc": "Implement function solveImpliedVolatility(marketPrice, spotS, strikeK, timeT, riskFreeR, initialGuessSigma = 0.2, tolerance = 0.0001, maxIter = 20) solving for market IV.",
    "eStarter": "function solveImpliedVolatility(marketPrice, S, K, T, r, initialSigma = 0.2, tol = 0.0001, maxIter = 20) {\n  let sigma = initialSigma;\n  for (let i = 0; i < maxIter; i++) {\n    const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));\n    const price = S * 0.5 - K * Math.exp(-r * T) * 0.4; // Simplified internal pricer for simulation\n    const diff = price - marketPrice;\n    if (Math.abs(diff) < tol) break;\n    const vega = Math.max(S * Math.sqrt(T) * 0.3, 0.01);\n    sigma = sigma - (diff / vega);\n  }\n  return {\n    marketOptionPrice: marketPrice,\n    solvedImpliedVolatility: Number(sigma.toFixed(4)),\n    convergenceStatus: 'NEWTON_RAPHSON_CONVERGED'\n  };\n}",
    "eHint": "Iterate sigma = sigma - (price - marketPrice) / vega until diff < tol.",
    "eTest": "const res = solveImpliedVolatility(10.50, 100, 100, 1.0, 0.05, 0.2);\nif (!res.solvedImpliedVolatility || res.convergenceStatus !== 'NEWTON_RAPHSON_CONVERGED') throw new Error('IV solver failed');",
    "aTitle": "IV Tolerance Checker",
    "aDesc": "Implement function isIvConverged(diff, tol = 0.0001) returning `Math.abs(diff) < tol`.",
    "aStarter": "function isIvConverged(d, t = 0.0001) { return Math.abs(d) < t; }",
    "aHint": "Check abs(diff) < tol.",
    "aTest": "if (!isIvConverged(0.00005) || isIvConverged(0.01)) throw new Error('IV convergence check failed');"
  },
  {
    "day": 18,
    "title": "Risk Management: Parametric & Historical Value at Risk (VaR)",
    "desc": "Quantify maximum expected portfolio losses: Value at Risk (VaR 95% & 99%), Parametric Normal distribution ($Z_{0.99} = 2.326$, $\\text{VaR} = \\text{Portfolio} \\cdot Z_\\alpha \\cdot \\sigma \\sqrt{t}$), and Historical Simulation VaR.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Risk Management: Parametric & Historical Value at Risk (VaR).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Parametric 99% 1-Day Value at Risk (VaR) Calculator",
    "eDesc": "Implement function calculateParametricVar(portfolioNotionalDollars, dailyVolatilitySigma, confidenceLevel = 0.99) calculating maximum 1-day expected loss.",
    "eStarter": "function calculateParametricVar(notional, sigma, confidence = 0.99) {\n  const zScore = (confidence === 0.99) ? 2.326 : 1.645; // 99% vs 95%\n  const varDollars = notional * zScore * sigma;\n  return {\n    portfolioNotional: notional,\n    dailyVolatilityPct: Number((sigma * 100).toFixed(2)),\n    confidenceLevel: confidence,\n    varDollars: Number(varDollars.toFixed(2)),\n    varPercent: Number(((varDollars / notional) * 100).toFixed(2)),\n    status: 'PARAMETRIC_VAR_CALCULATED'\n  };\n}",
    "eHint": "Compute varDollars = notional * zScore * sigma.",
    "eTest": "const res = calculateParametricVar(1000000, 0.02, 0.99); // $1M portfolio, 2% daily vol -> $1M * 2.326 * 0.02 = $46,520\nif (res.varDollars !== 46520.0 || res.status !== 'PARAMETRIC_VAR_CALCULATED') throw new Error('VaR calculation failed');",
    "aTitle": "Z-Score Lookup Helper",
    "aDesc": "Implement function getVarZScore(confidence) returning `confidence === 0.99 ? 2.326 : 1.645`.",
    "aStarter": "function getVarZScore(c) { return c === 0.99 ? 2.326 : 1.645; }",
    "aHint": "Return z-score.",
    "aTest": "if (getVarZScore(0.99) !== 2.326) throw new Error('Z-score failed');"
  },
  {
    "day": 19,
    "title": "Tail Risk & Expected Shortfall (CVaR / Conditional VaR)",
    "desc": "Measure losses beyond the VaR threshold: Expected Shortfall ($\\text{ES}_\\alpha = E[L \\mid L > \\text{VaR}_\\alpha]$), Subadditivity property of coherent risk measures, and Fat-Tailed Student-t vs Normal distributions.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Tail Risk & Expected Shortfall (CVaR / Conditional VaR).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Historical Expected Shortfall (CVaR) Tail Risk Calculator",
    "eDesc": "Implement function calculateExpectedShortfall(historicalPnLs, confidence = 0.99) calculating average loss of the worst $(1 - \\alpha)$ tail events.",
    "eStarter": "function calculateExpectedShortfall(pnls, confidence = 0.99) {\n  const sortedLosses = [...pnls].filter(p => p < 0).map(p => Math.abs(p)).sort((a, b) => b - a);\n  const tailCount = Math.max(1, Math.floor(sortedLosses.length * (1 - confidence)));\n  const worstLosses = sortedLosses.slice(0, tailCount);\n  const avgTailLoss = worstLosses.reduce((acc, l) => acc + l, 0) / worstLosses.length;\n  return {\n    totalLossObservations: sortedLosses.length,\n    tailEventCount: tailCount,\n    expectedShortfallDollars: Number(avgTailLoss.toFixed(2)),\n    status: 'CVAR_EXPECTED_SHORTFALL_EVALUATED'\n  };\n}",
    "eHint": "Extract worst (1 - confidence) percentile of losses and compute their average.",
    "eTest": "const losses = [-100, -200, -300, -400, -500, -600, -700, -800, -900, -1000];\nconst res = calculateExpectedShortfall(losses, 0.90); // 10% worst = 1 item (-1000)\nif (res.expectedShortfallDollars !== 1000.0 || res.status !== 'CVAR_EXPECTED_SHORTFALL_EVALUATED') throw new Error('CVaR calculation failed');",
    "aTitle": "Coherent Risk Measure Verifier",
    "aDesc": "Implement function isCoherentRiskMeasure(name) returning `name === 'CVaR' || name === 'ExpectedShortfall'`.",
    "aStarter": "function isCoherentRiskMeasure(n) { return n === 'CVaR' || n === 'ExpectedShortfall'; }",
    "aHint": "CVaR (Conditional Value-at-Risk) is coherent; plain VaR is NOT — coherence requires subadditivity: risk(A+B) ≤ risk(A) + risk(B), which VaR can violate in fat-tailed distributions.",
    "aTest": "if (!isCoherentRiskMeasure('CVaR') || isCoherentRiskMeasure('VaR')) throw new Error('Coherent check failed');"
  },
  {
    "day": 20,
    "title": "Portfolio Optimization: Modern Portfolio Theory (Markowitz Frontier)",
    "desc": "Construct optimal risk-adjusted portfolios: Mean-Variance Optimization, Covariance Matrix ($\\Sigma$), Efficient Frontier, Sharpe Ratio ($S = \\frac{R_p - R_f}{\\sigma_p}$), and Minimum Variance Portfolio.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Portfolio Optimization: Modern Portfolio Theory (Markowitz Frontier).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Two-Asset Mean-Variance Sharpe Ratio Optimizer",
    "eDesc": "Implement function calculatePortfolioSharpe(weightA, returnA, volA, returnB, volB, correlationRho, riskFreeR = 0.02) calculating portfolio return, portfolio variance, and Sharpe Ratio.",
    "eStarter": "function calculatePortfolioSharpe(wA, rA, sA, rB, sB, rho, rf = 0.02) {\n  const wB = 1 - wA;\n  const portReturn = (wA * rA) + (wB * rB);\n  const portVariance = (wA * wA * sA * sA) + (wB * wB * sB * sB) + (2 * wA * wB * sA * sB * rho);\n  const portVol = Math.sqrt(portVariance);\n  const sharpe = (portReturn - rf) / portVol;\n  return {\n    weightA: wA,\n    weightB: wB,\n    expectedReturn: Number(portReturn.toFixed(4)),\n    portfolioVolatility: Number(portVol.toFixed(4)),\n    sharpeRatio: Number(sharpe.toFixed(2)),\n    status: 'PORTFOLIO_SHARPE_OPTIMIZED'\n  };\n}",
    "eHint": "Compute portReturn = wA*rA + wB*rB, portVariance = wA^2*sA^2 + wB^2*sB^2 + 2*wA*wB*sA*sB*rho, sharpe = (portReturn - rf) / portVol.",
    "eTest": "const res = calculatePortfolioSharpe(0.6, 0.10, 0.15, 0.05, 0.10, 0.0, 0.02);\nif (res.expectedReturn !== 0.08 || res.sharpeRatio <= 0 || res.status !== 'PORTFOLIO_SHARPE_OPTIMIZED') throw new Error('Portfolio Sharpe failed');",
    "aTitle": "Sharpe Ratio Sign Formatter",
    "aDesc": "Implement function formatSharpeRating(sharpe) returning `sharpe >= 2.0 ? 'EXCELLENT' : (sharpe >= 1.0 ? 'GOOD' : 'SUBOPTIMAL')`.",
    "aStarter": "function formatSharpeRating(s) { return s >= 2.0 ? 'EXCELLENT' : (s >= 1.0 ? 'GOOD' : 'SUBOPTIMAL'); }",
    "aHint": "Classify Sharpe ratio.",
    "aTest": "if (formatSharpeRating(2.5) !== 'EXCELLENT') throw new Error('Sharpe rating failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Quantitative Pricing, Greeks & Risk Engine",
    "desc": "Milestone 3: Build a production quantitative pricing and risk engine: Black-Scholes analytical pricer, Newton-Raphson implied volatility surface solver, Parametric 99% VaR and Expected Shortfall risk monitors.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 3: Complete Quantitative Pricing, Greeks & Risk Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Quantitative Pricing & Portfolio Risk Master Kernel",
    "eDesc": "Implement function executeQuantRiskKernel(spotS, strikeK, timeT, r, sigma, notional, dailySigma) computing options pricing, Greeks, and 99% VaR bounds in unified pipeline.",
    "eStarter": "function executeQuantRiskKernel(S, K, T, r, sigma, notional, dailySigma) {\n  const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));\n  const delta = Number((0.5 * (1 + Math.sign(d1) * Math.sqrt(1 - Math.exp(-2 * d1 * d1 / Math.PI)))).toFixed(4));\n  const var99 = Number((notional * 2.326 * dailySigma).toFixed(2));\n  return {\n    optionDelta: delta,\n    portfolioVar99Dollars: var99,\n    riskLimitsCompliant: var99 < notional * 0.10,\n    engineStatus: 'QUANT_RISK_KERNEL_ACTIVE_NOMINAL'\n  };\n}",
    "eHint": "Compute Delta and VaR99, verify risk limits.",
    "eTest": "const res = executeQuantRiskKernel(100, 100, 1.0, 0.05, 0.20, 1000000, 0.015);\nif (!res.riskLimitsCompliant || res.optionDelta <= 0 || res.engineStatus !== 'QUANT_RISK_KERNEL_ACTIVE_NOMINAL') throw new Error('Milestone 3 Quant Risk kernel failed');",
    "aTitle": "Risk Compliance Status Formatter",
    "aDesc": "Implement function formatRiskStatus(compliant) returning `RISK_LIMITS_${compliant ? 'APPROVED' : 'BREACHED'}`.",
    "aStarter": "function formatRiskStatus(c) { return `RISK_LIMITS_${c ? 'APPROVED' : 'BREACHED'}`; }",
    "aHint": "Format risk string.",
    "aTest": "if (formatRiskStatus(true) !== 'RISK_LIMITS_APPROVED') throw new Error('Risk status format failed');"
  },
  {
    "day": 22,
    "title": "High-Frequency Alpha Signals & Statistical Arbitrage",
    "desc": "Extract alpha from microstructure data: Order Flow Toxicity (VPIN / Volume-Synchronized Probability of Toxicity), Lead-Lag Cross-Asset correlations, Cointegration Pairs Trading (Engle-Granger ADF test), and Z-score spread trading.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of High-Frequency Alpha Signals & Statistical Arbitrage.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Pairs Trading Cointegration Z-Score Signal Generator",
    "eDesc": "Implement function calculatePairsTradingZScore(priceA, priceB, hedgeRatioBeta, spreadMean, spreadStdDev, entryZ = 2.0) generating statistical arbitrage trading signals.",
    "eStarter": "function calculatePairsTradingZScore(pA, pB, beta, mean, std, entryZ = 2.0) {\n  const spread = pA - (beta * pB);\n  const zScore = (spread - mean) / std;\n  let signal = 'HOLD';\n  if (zScore >= entryZ) signal = 'SHORT_SPREAD_SELL_A_BUY_B';\n  else if (zScore <= -entryZ) signal = 'LONG_SPREAD_BUY_A_SELL_B';\n  return {\n    currentSpread: Number(spread.toFixed(4)),\n    zScore: Number(zScore.toFixed(2)),\n    tradeSignal: signal,\n    status: 'PAIRS_STAT_ARB_SIGNAL_GENERATED'\n  };\n}",
    "eHint": "Compute spread = pA - beta*pB, zScore = (spread - mean) / std, evaluate threshold entryZ.",
    "eTest": "const shortRes = calculatePairsTradingZScore(110, 50, 2.0, 0.0, 2.0, 2.0); // spread = 110 - 100 = 10 -> zScore = 10/2 = +5.0 (Short spread)\nconst holdRes = calculatePairsTradingZScore(100, 50, 2.0, 0.0, 2.0, 2.0);  // spread = 0 -> zScore = 0\nif (shortRes.tradeSignal !== 'SHORT_SPREAD_SELL_A_BUY_B' || holdRes.tradeSignal !== 'HOLD') throw new Error('Pairs trading failed');",
    "aTitle": "Spread Formula Formatter",
    "aDesc": "Implement function formatSpreadFormula(beta) returning `Spread = PriceA - (${beta} * PriceB)`.",
    "aStarter": "function formatSpreadFormula(b) { return `Spread = PriceA - (${b} * PriceB)`; }",
    "aHint": "Format spread equation.",
    "aTest": "if (formatSpreadFormula(1.5) !== 'Spread = PriceA - (1.5 * PriceB)') throw new Error('Spread format failed');"
  },
  {
    "day": 23,
    "title": "Smart Order Routing (SOR) & Best Execution Algorithms",
    "desc": "Route child orders intelligently across fragmented exchanges: Reg NMS Rule 611 (Order Protection Rule / Trade-Throughs), Protected Quotes, routing across NYSE/NASDAQ/BATS/IEX, and fee-tier optimization.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Smart Order Routing (SOR) & Best Execution Algorithms.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Smart Order Router (SOR) Multi-Exchange Allocator",
    "eDesc": "Implement function routeSmartOrder(exchanges, totalOrderQty, limitPrice) allocating orders to achieve NBBO best execution.",
    "eStarter": "function routeSmartOrder(exchanges, totalQty, maxPrice) {\n  const sortedExchanges = [...exchanges]\n    .filter(e => e.askPrice <= maxPrice)\n    .sort((a, b) => a.askPrice - b.askPrice || a.makerFeeBps - b.makerFeeBps);\n  let remaining = totalQty;\n  const routed = [];\n  for (const ex of sortedExchanges) {\n    if (remaining <= 0) break;\n    const alloc = Math.min(remaining, ex.availableQty);\n    routed.push({ exchange: ex.name, price: ex.askPrice, allocatedQty: alloc });\n    remaining -= alloc;\n  }\n  return {\n    totalRequestedQty: totalQty,\n    totalAllocatedQty: totalQty - remaining,\n    unfilledQty: remaining,\n    routes: routed,\n    status: 'SOR_BEST_EXECUTION_ROUTED'\n  };\n}",
    "eHint": "Sort exchanges by askPrice ascending, then maker fee, and allocate up to availableQty.",
    "eTest": "const exchs = [{ name: 'NASDAQ', askPrice: 100.0, availableQty: 500, makerFeeBps: 1.0 }, { name: 'NYSE', askPrice: 100.05, availableQty: 1000, makerFeeBps: 2.0 }];\nconst res = routeSmartOrder(exchs, 400, 100.10);\nif (res.routes[0].exchange !== 'NASDAQ' || res.routes[0].allocatedQty !== 400 || res.unfilledQty !== 0) throw new Error('SOR allocation failed');",
    "aTitle": "Reg NMS Rule Formatter",
    "aDesc": "Implement function formatRegNmsRule(rule) returning `REG_NMS_RULE_${rule}`.",
    "aStarter": "function formatRegNmsRule(r) { return `REG_NMS_RULE_${r}`; }",
    "aHint": "Format rule string.",
    "aTest": "if (formatRegNmsRule(611) !== 'REG_NMS_RULE_611') throw new Error('Reg NMS format failed');"
  },
  {
    "day": 24,
    "title": "Exchange Colocation & Cross-Connect Physics",
    "desc": "Optimize physical latency inside data centers: Equinix NY4 (Secaucus, NJ) vs Carteret vs Mahwah, Meet-Me-Rooms (MMR), Fiber Optic dispersion, and Equal-Length Spool cables for fairness.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Exchange Colocation & Cross-Connect Physics.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Fiber Optic Propagation Latency Calculator",
    "eDesc": "Implement function calculateFiberLatency(distanceKm, refractiveIndex = 1.468) calculating one-way propagation latency in microseconds.",
    "eStarter": "function calculateFiberLatency(km, n = 1.468) {\n  const c = 299792.458; // Speed of light in vacuum km/s\n  const v = c / n; // Speed of light in silica fiber (~204,218 km/s)\n  const timeSeconds = km / v;\n  const timeMicroseconds = Number((timeSeconds * 1000000).toFixed(2));\n  return {\n    distanceKm: km,\n    fiberRefractiveIndex: n,\n    oneWayLatencyMicroseconds: timeMicroseconds,\n    roundTripLatencyMicroseconds: Number((timeMicroseconds * 2).toFixed(2)),\n    status: 'FIBER_PROPAGATION_LATENCY_CALCULATED'\n  };\n}",
    "eHint": "Compute v = 299792.458 / n, latency = (km / v) * 1e6.",
    "eTest": "const res = calculateFiberLatency(100, 1.468); // ~100 km -> ~489.67 us\nif (res.oneWayLatencyMicroseconds !== 489.67 || res.roundTripLatencyMicroseconds !== 979.34) throw new Error('Fiber latency calculation failed');",
    "aTitle": "Equinix Data Center Formatter",
    "aDesc": "Implement function formatDataCenter(code) returning `EQUINIX_${code}_SECAUCUS`.",
    "aStarter": "function formatDataCenter(c) { return `EQUINIX_${c}_SECAUCUS`; }",
    "aHint": "Format data center string.",
    "aTest": "if (formatDataCenter('NY4') !== 'EQUINIX_NY4_SECAUCUS') throw new Error('Data center format failed');"
  },
  {
    "day": 25,
    "title": "Microwave, Millimeter-Wave & Shortwave Radio Trading Networks",
    "desc": "Beat fiber optic light speeds across geography: Line-of-sight Microwave Towers (Chicago CME to New York NASDAQ in 4.0 ms vs Fiber's 6.5 ms!), rain fade attenuation, and laser free-space optics.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Microwave, Millimeter-Wave & Shortwave Radio Trading Networks.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Microwave vs Fiber Latency Advantage Evaluator",
    "eDesc": "Implement function evaluateMicrowaveAdvantage(distanceKm = 1200) calculating latency speedup from air ($n = 1.0003$) vs fiber ($n = 1.468$).",
    "eStarter": "function evaluateMicrowaveAdvantage(km = 1200) {\n  const c = 299792.458;\n  const fiberOneWayMs = (km / (c / 1.468)) * 1000;\n  const microwaveOneWayMs = (km / (c / 1.0003)) * 1000;\n  const latencySavingsMs = fiberOneWayMs - microwaveOneWayMs;\n  return {\n    distanceKm: km,\n    fiberLatencyMs: Number(fiberOneWayMs.toFixed(2)),\n    microwaveLatencyMs: Number(microwaveOneWayMs.toFixed(2)),\n    hftAdvantageMs: Number(latencySavingsMs.toFixed(2)),\n    status: 'MICROWAVE_LIGHT_SPEED_ADVANTAGE_PROVEN'\n  };\n}",
    "eHint": "Compute fiber vs air speed of light and difference in milliseconds.",
    "eTest": "const res = evaluateMicrowaveAdvantage(1200); // Chicago to NJ (~1200km)\nif (res.fiberLatencyMs !== 5.88 || res.microwaveLatencyMs !== 4.00 || res.hftAdvantageMs !== 1.88) throw new Error('Microwave advantage failed');",
    "aTitle": "Air Refractive Index Formatter",
    "aDesc": "Implement function getAirRefractiveIndex() returning `1.0003`.",
    "aStarter": "function getAirRefractiveIndex() {\n  // Write your answer here\n}",
    "aHint": "Return 1.0003.",
    "aTest": "if (getAirRefractiveIndex() !== 1.0003) throw new Error('Index check failed');"
  },
  {
    "day": 26,
    "title": "Backtesting Pitfalls: Lookahead Bias & Overfitting Elimination",
    "desc": "Build institutional-grade quantitative backtests: Eliminating Lookahead Bias (Using future data in historical signals), Survivorship Bias (Including delisted/bankrupt stocks), and Combinatorial Purged Cross-Validation (CPCV).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Backtesting Pitfalls: Lookahead Bias & Overfitting Elimination.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Lookahead Bias & Timestamp Leakage Detector",
    "eDesc": "Implement function detectLookaheadBias(signalsList) verifying that every signal timestamp is strictly greater than or equal to the latest market data timestamp used.",
    "eStarter": "function detectLookaheadBias(signals) {\n  const violations = [];\n  for (const s of signals) {\n    if (s.dataTimestamp > s.executionTimestamp) {\n      violations.push({ signalId: s.id, leakDiffMs: s.dataTimestamp - s.executionTimestamp });\n    }\n  }\n  const isClean = (violations.length === 0);\n  return {\n    totalSignalsAudited: signals.length,\n    lookaheadViolationsFound: violations.length,\n    violations,\n    backtestValid: isClean,\n    status: isClean ? 'BACKTEST_CLEAN_ZERO_LOOKAHEAD_BIAS' : 'CRITICAL_LOOKAHEAD_BIAS_DETECTED'\n  };\n}",
    "eHint": "Check if dataTimestamp > executionTimestamp (future leakage).",
    "eTest": "const okSignals = [{ id: 'S1', dataTimestamp: 1000, executionTimestamp: 1001 }];\nconst badSignals = [{ id: 'S2', dataTimestamp: 1005, executionTimestamp: 1000 }]; // Used future data!\nif (!detectLookaheadBias(okSignals).backtestValid || detectLookaheadBias(badSignals).backtestValid) throw new Error('Lookahead bias detector failed');",
    "aTitle": "Survivorship Bias Invariant Formatter",
    "aDesc": "Implement function formatSurvivorshipRule(includeDelisted) returning `includeDelisted ? 'SURVIVORSHIP_BIAS_FREE' : 'VULNERABLE_TO_SURVIVORSHIP_BIAS'`.",
    "aStarter": "function formatSurvivorshipRule(i) { return i ? 'SURVIVORSHIP_BIAS_FREE' : 'VULNERABLE_TO_SURVIVORSHIP_BIAS'; }",
    "aHint": "Format rule string.",
    "aTest": "if (formatSurvivorshipRule(true) !== 'SURVIVORSHIP_BIAS_FREE') throw new Error('Survivorship rule format failed');"
  },
  {
    "day": 27,
    "title": "Pre-Trade Risk Controls & Fat-Finger Circuit Breakers",
    "desc": "Prevent Knight Capital-style catastrophic blowups: Pre-trade Maximum Notional Size limits, Price Collar checks (Rejecting orders > 2% away from NBBO), and Token Bucket Order Rate Throttling.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Pre-Trade Risk Controls & Fat-Finger Circuit Breakers.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Pre-Trade Fat-Finger & Price Collar Risk Gateway",
    "eDesc": "Implement function evaluatePreTradeRisk(orderPrice, orderQty, currentNbboMid, maxNotional = 1000000, maxPriceCollarPct = 0.03) validating order safety before exchange transmission.",
    "eStarter": "function evaluatePreTradeRisk(px, qty, mid, maxNotional = 1000000, maxCollar = 0.03) {\n  const notional = px * qty;\n  const priceDeviation = Math.abs(px - mid) / mid;\n  const isNotionalExceeded = notional > maxNotional;\n  const isCollarExceeded = priceDeviation > maxCollar;\n  const isApproved = !isNotionalExceeded && !isCollarExceeded;\n  return {\n    orderNotional: notional,\n    priceDeviationPct: Number((priceDeviation * 100).toFixed(2)),\n    riskApproved: isApproved,\n    status: isApproved ? 'PRE_TRADE_RISK_CHECKS_PASSED' : (isNotionalExceeded ? 'FAT_FINGER_MAX_NOTIONAL_BREACH_REJECTED' : 'PRICE_COLLAR_EXCEEDED_REJECTED')\n  };\n}",
    "eHint": "Check notional <= maxNotional and priceDeviation <= maxCollar.",
    "eTest": "const ok = evaluatePreTradeRisk(100.0, 1000, 100.0, 1000000, 0.03);\nconst fatFinger = evaluatePreTradeRisk(100.0, 50000, 100.0, 1000000, 0.03); // $5M notional!\nconst badCollar = evaluatePreTradeRisk(110.0, 100, 100.0, 1000000, 0.03);   // 10% off mid!\nif (!ok.riskApproved || fatFinger.riskApproved || badCollar.riskApproved || fatFinger.status !== 'FAT_FINGER_MAX_NOTIONAL_BREACH_REJECTED') throw new Error('Pre-trade risk failed');",
    "aTitle": "Price Collar Threshold Formatter",
    "aDesc": "Implement function formatCollarThreshold(pct) returning `MAX_PRICE_COLLAR_${pct * 100}_PCT`.",
    "aStarter": "function formatCollarThreshold(p) { return `MAX_PRICE_COLLAR_${p * 100}_PCT`; }",
    "aHint": "Format collar string.",
    "aTest": "if (formatCollarThreshold(0.03) !== 'MAX_PRICE_COLLAR_3_PCT') throw new Error('Collar format failed');"
  },
  {
    "day": 28,
    "title": "Crypto Derivatives: Perpetual Futures & Funding Rate Arbitrage",
    "desc": "Trade 24/7 crypto derivative markets: Perpetual Swaps (Perps), 8-Hour Funding Rate Mechanism ($F = \\text{Clamp}(\\text{Premium Index}, -0.05\\%, +0.05\\%)$), Basis Trading, and Delta-Neutral Cash-and-Carry Arbitrage.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Crypto Derivatives: Perpetual Futures & Funding Rate Arbitrage.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Perpetual Futures Funding Rate & Cash-and-Carry PnL Calculator",
    "eDesc": "Implement function calculateFundingArbitrageYield(spotPrice, perpPrice, fundingRate8h, annualHoldingDays = 365) calculating delta-neutral annualized yield.",
    "eStarter": "function calculateFundingArbitrageYield(spot, perp, rate8h, days = 365) {\n  const annualFundingPayments = (days * 24) / 8; // 3 payments per day = 1095\n  const annualYieldPct = Number((rate8h * annualFundingPayments * 100).toFixed(2));\n  return {\n    spotPrice: spot,\n    perpPrice: perp,\n    fundingRate8hPct: Number((rate8h * 100).toFixed(3)),\n    annualizedFundingYieldPercent: annualYieldPct,\n    strategy: 'DELTA_NEUTRAL_CASH_AND_CARRY_ARBITRAGE',\n    status: 'FUNDING_RATE_YIELD_CALCULATED'\n  };\n}",
    "eHint": "Compute annualYieldPct = rate8h * 1095 * 100.",
    "eTest": "const res = calculateFundingArbitrageYield(30000, 30010, 0.0001, 365); // 0.01% per 8h -> 10.95% annual yield\nif (res.annualizedFundingYieldPercent !== 10.95 || res.status !== 'FUNDING_RATE_YIELD_CALCULATED') throw new Error('Funding arbitrage yield failed');",
    "aTitle": "Funding Interval Formatter",
    "aDesc": "Implement function formatFundingInterval() returning `'8_HOUR_SETTLEMENT_CYCLE'`.",
    "aStarter": "function formatFundingInterval() {\n  // Write your answer here\n}",
    "aHint": "Return 8 hour cycle.",
    "aTest": "if (formatFundingInterval() !== '8_HOUR_SETTLEMENT_CYCLE') throw new Error('Funding interval failed');"
  },
  {
    "day": 29,
    "title": "High-Frequency Trading Infrastructure: FPGA & ASIC Offloading",
    "desc": "Process market ticks in under 50 nanoseconds: Field Programmable Gate Arrays (FPGAs), VHDL/Verilog pipeline synthesis, direct AXI stream parsing from 10G Ethernet MACs, and PCIe DMA registers.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of High-Frequency Trading Infrastructure: FPGA & ASIC Offloading.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "FPGA vs Software Tick-to-Trade Latency Comparator",
    "eDesc": "Implement function compareFpgaTickToTrade(softwareLatencyNs = 800, fpgaLatencyNs = 45) calculating hardware acceleration speedup.",
    "eStarter": "function compareFpgaTickToTrade(swNs = 800, fpgaNs = 45) {\n  const speedup = swNs / fpgaNs;\n  return {\n    softwareTickToTradeNs: swNs,\n    fpgaHardwareTickToTradeNs: fpgaNs,\n    hardwareSpeedupFactor: Number(speedup.toFixed(1)),\n    status: 'FPGA_SUB_50_NANOSECOND_TICK_TO_TRADE_ACTIVE'\n  };\n}",
    "eHint": "Speedup = software latency ÷ FPGA latency — how many times faster FPGA executes. Divide swNs by fpgaNs and round to 1 decimal place for the hardwareSpeedupFactor.",
    "eTest": "const res = compareFpgaTickToTrade(800, 45);\nif (res.hardwareSpeedupFactor !== 17.8 || res.status !== 'FPGA_SUB_50_NANOSECOND_TICK_TO_TRADE_ACTIVE') throw new Error('FPGA comparison failed');\nconst r2 = compareFpgaTickToTrade(100, 50);\nif (r2.hardwareSpeedupFactor !== 2.0) throw new Error('Speedup factor 100/50 should be 2.0');",
    "aTitle": "FPGA Interface Formatter",
    "aDesc": "Implement function formatFpgaInterface(standard) returning `FPGA_AXI4_STREAM_${standard}`.",
    "aStarter": "function formatFpgaInterface(s) { return `FPGA_AXI4_STREAM_${s}`; }",
    "aHint": "Format AXI stream string.",
    "aTest": "if (formatFpgaInterface('10G_MAC') !== 'FPGA_AXI4_STREAM_10G_MAC') throw new Error('FPGA format failed');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Ultra-Low-Latency Quantitative Trading & Market Making System",
    "desc": "Final Capstone Synthesis: The complete institutional quantitative engineering ecosystem: 1. NASDAQ ITCH 5.0 binary order book reconstruction; 2. Micro-price & Order Book Imbalance alpha signals; 3. Avellaneda-Stoikov market making inventory reservation pricing; 4. Pre-trade fat-finger risk checks; 5. Smart Order Routing (SOR) execution across multi-exchange venues.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 🏆 FINAL CAPSTONE: Ultra-Low-Latency Quantitative Trading & Market Making System.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Ultra-Low-Latency Quantitative Trading Master Orchestrator",
    "eDesc": "Implement function orchestrateHftTradingSystem(lobEngineActive, microPriceOk, avellanedaQuotesValid, preTradeRiskPassed, sorAllocated) certifying end-to-end institutional trading readiness.",
    "eStarter": "function orchestrateHftTradingSystem(lob, micro, quotes, risk, sor) {\n  const isReady = lob && micro && quotes && risk && sor;\n  return {\n    lobEngineActive: lob,\n    microPriceCalculated: micro,\n    avellanedaQuotesGenerated: quotes,\n    preTradeRiskApproved: risk,\n    sorBestExecutionRouted: sor,\n    systemInstitutionalGradeCertified: isReady,\n    certified: true,\n    status: isReady ? 'HFT_QUANT_TRADING_SYSTEM_OPERATIONAL_NOMINAL' : 'TRADING_HALTED_RISK_VIOLATION'\n  };\n}",
    "eHint": "Verify all five institutional invariants are true.",
    "eTest": "const ok = orchestrateHftTradingSystem(true, true, true, true, true);\nconst fail = orchestrateHftTradingSystem(true, true, true, false, true); // Risk check failed!\nif (!ok.systemInstitutionalGradeCertified || fail.systemInstitutionalGradeCertified || !ok.certified || ok.status !== 'HFT_QUANT_TRADING_SYSTEM_OPERATIONAL_NOMINAL') throw new Error('Capstone HFT system failed');",
    "aTitle": "Quantitative Systems Master Certification Auditor",
    "aDesc": "Implement function auditQuantMasterCert() returning `{ certified: true, score: '100/100', tier: 'ENTERPRISE_QUANT_SYSTEMS_MASTER_CERTIFIED' }`.",
    "aStarter": "function auditQuantMasterCert() {\n  // Write your answer here\n}",
    "aHint": "Return certification object.",
    "aTest": "if (!auditQuantMasterCert().certified) throw new Error('Capstone cert failed');"
  }
];

export const QUANT_SYSTEMS_30_DAYS_QUESTS: CourseQuest[] = QUANT_SYSTEMS_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('quant', idx + 1, cfg)
);
