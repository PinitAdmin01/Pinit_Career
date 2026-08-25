import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const QUANT_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Quantitative Engineering & Electronic Trading Foundations",
    "overviewMetaphor": "An Electronic Exchange is a Giant Airport Flight Departure Board: thousands of buyers and sellers shout out what price they are willing to pay; Market Orders say 'Get me on the next available flight immediately no matter the price', while Limit Orders say 'I will only fly if the ticket is $150 or cheaper'; the National Best Bid and Offer (NBBO) represents the absolute cheapest seller (Best Ask) and the highest-paying buyer (Best Bid) across all exchanges in the United States; the tiny gap between them is the Bid-Ask Spread—the lifeblood of quantitative finance.",
    "blocks": [
      {
        "id": "quant-d1-b1-market-microstructure-cda",
        "day": 1,
        "blockNumber": 1,
        "title": "Continuous Double Auctions (CDA) & The Maker-Taker Economy",
        "conceptBudget": {
          "primaryConcept": "Continuous Double Auction Mechanics",
          "supportingTerms": [
            "Continuous Double Auction (CDA: Asynchronous matching of bids and asks)",
            "Liquidity Makers (Provide resting limit orders, receive fee rebates)",
            "Liquidity Takers (Cross the spread with market orders, pay taker fees)",
            "Lit Markets (Public transparent order books) vs Dark Pools (Hidden midpoint volume)"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Maker vs Taker Economic Flow",
              "boxes": [
                {
                  "label": "1. Liquidity Maker (Passive)",
                  "value": "Action: Places Limit Order at $100.00 | Exchange: Adds liquidity | Economics: EARNS +0.0020/share rebate!",
                  "varType": "Maker Order",
                  "isUpdated": false
                },
                {
                  "label": "2. Liquidity Taker (Aggressive)",
                  "value": "Action: Hits Market Order at $100.00 | Exchange: Removes liquidity | Economics: PAYS -0.0030/share fee",
                  "varType": "Taker Order",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "maker_taker_demo.js",
            "initialCode": "function evaluateOrderEconomics(orderType, shares) {\n  if (orderType === 'LIMIT_MAKER') {\n    const rebate = shares * 0.0020;\n    return { role: 'MAKER', rebateEarned: rebate, status: 'LIQUIDITY_PROVIDED' };\n  }\n  const fee = shares * 0.0030;\n  return { role: 'TAKER', feePaid: fee, status: 'LIQUIDITY_REMOVED' };\n}\n\nconsole.log(JSON.stringify(evaluateOrderEconomics('LIMIT_MAKER', 10000)));\nconsole.log(JSON.stringify(evaluateOrderEconomics('MARKET_TAKER', 10000)));",
            "expectedOutput": "{\"role\":\"MAKER\",\"rebateEarned\":20,\"status\":\"LIQUIDITY_PROVIDED\"}\n{\"role\":\"TAKER\",\"feePaid\":30,\"status\":\"LIQUIDITY_REMOVED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What financial reward is earned by a quantitative liquidity maker who posts a 10,000-share resting limit order at a +$0.0020/share rebate?",
          "expectedStringOutput": "20",
          "acceptableAnswers": [
            "20",
            "$20",
            "rebateEarned\":20"
          ],
          "primaryMisconceptionId": "MC_QUANT_MARKET_MICROSTRUCTURE_ORDER_TYPES",
          "diagnosisMap": {
            "30": {
              "misconceptionId": "MC_QUANT_MARKET_MICROSTRUCTURE_ORDER_TYPES",
              "errorExplanation": "$30 is the fee paid by takers. Makers earn 10,000 * 0.0020 = $20.",
              "recoveryPath": {
                "simplerExplanation": "10,000 * 0.0020 = $20.",
                "guidedFixPrompt": "Type 20"
              }
            }
          }
        }
      },
      {
        "id": "quant-d1-b2-order-types-and-tif",
        "day": 1,
        "blockNumber": 2,
        "title": "Order Types & Time-in-Force (TIF): IOC, FOK, GTC and Icebergs",
        "conceptBudget": {
          "primaryConcept": "Order Types and Time-in-Force (TIF)",
          "supportingTerms": [
            "Immediate or Cancel (IOC: Fill whatever is available immediately, cancel the remainder)",
            "Fill or Kill (FOK: Fill entire quantity instantly or cancel 100% of order)",
            "Good 'Til Canceled (GTC: Rests on the book indefinitely)",
            "Iceberg Orders (Displays 100 shares publicly while hiding 9,900 shares in reserve)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d1-b1-market-microstructure-cda",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Time-in-Force (TIF) Execution Routing Logic",
              "nodes": [
                {
                  "id": "1",
                  "label": "Order arrives at matching engine gateway",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "TIF == FOK? Can 100% of order be filled right now?",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "NO -> CANCEL IMMEDIATELY | YES -> EXECUTE 100%",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "TIF == IOC? Fill available liquidity, cancel leftover remainder!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "tif_routing_demo.js",
            "initialCode": "function evaluateTifExecution(tif, requestedQty, availableQty) {\n  if (tif === 'FOK') {\n    const canFillAll = availableQty >= requestedQty;\n    return {\n      executedQty: canFillAll ? requestedQty : 0,\n      canceledQty: canFillAll ? 0 : requestedQty,\n      status: canFillAll ? 'FOK_FILLED_COMPLETELY' : 'FOK_KILLED_ZERO_FILL'\n    };\n  }\n  if (tif === 'IOC') {\n    const filled = Math.min(requestedQty, availableQty);\n    return {\n      executedQty: filled,\n      canceledQty: requestedQty - filled,\n      status: 'IOC_PARTIAL_FILL_LEFTOVER_CANCELED'\n    };\n  }\n  return { status: 'STANDARD_RESTING_ORDER' };\n}\n\nconsole.log(JSON.stringify(evaluateTifExecution('FOK', 1000, 800))); // Only 800 available -> KILLED!\nconsole.log(JSON.stringify(evaluateTifExecution('IOC', 1000, 800))); // Fills 800, cancels 200",
            "expectedOutput": "{\"executedQty\":0,\"canceledQty\":1000,\"status\":\"FOK_KILLED_ZERO_FILL\"}\n{\"executedQty\":800,\"canceledQty\":200,\"status\":\"IOC_PARTIAL_FILL_LEFTOVER_CANCELED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is triggered when a 1000-share Fill-or-Kill (FOK) order encounters only 800 shares of available liquidity?",
          "expectedStringOutput": "FOK_KILLED_ZERO_FILL",
          "acceptableAnswers": [
            "FOK_KILLED_ZERO_FILL",
            "status\":\"FOK_KILLED_ZERO_FILL\""
          ],
          "primaryMisconceptionId": "MC_QUANT_MARKET_MICROSTRUCTURE_ORDER_TYPES",
          "diagnosisMap": {
            "PARTIAL": {
              "misconceptionId": "MC_QUANT_MARKET_MICROSTRUCTURE_ORDER_TYPES",
              "errorExplanation": "FOK requires 100% execution or total cancellation. Partial fills are forbidden.",
              "recoveryPath": {
                "simplerExplanation": "FOK kills order on partial liquidity -> FOK_KILLED_ZERO_FILL.",
                "guidedFixPrompt": "Type FOK_KILLED_ZERO_FILL"
              }
            }
          }
        }
      },
      {
        "id": "quant-d1-b3-nbbo-spread-and-tick-sizes",
        "day": 1,
        "blockNumber": 3,
        "title": "The National Best Bid & Offer (NBBO) & Minimum Tick Sizes",
        "conceptBudget": {
          "primaryConcept": "NBBO Spread & Tick Constraints",
          "supportingTerms": [
            "National Best Bid and Offer (Consolidated highest bid and lowest ask across SIP feed)",
            "Sub-Penny Rule (SEC Rule 612: Minimum tick size of $0.01 for stocks $\\ge \\$1.00$)",
            "Crossed Market ($P_{\\text{bid}} > P_{\\text{ask}}$) vs Locked Market ($P_{\\text{bid}} == P_{\\text{ask}}$) anomalies"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d1-b2-order-types-and-tif",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "nbbo_audit_demo.js",
            "initialCode": "function evaluateMarketState(bestBid, bestAsk) {\n  if (bestBid > bestAsk) return 'CRITICAL_ANOMALY_CROSSED_MARKET';\n  if (bestBid === bestAsk) return 'LOCKED_MARKET';\n  return 'TWO_SIDED_MARKET_NOMINAL';\n}\n\nconsole.log(evaluateMarketState(150.00, 150.02));\nconsole.log(evaluateMarketState(150.05, 150.00));",
            "expectedOutput": "TWO_SIDED_MARKET_NOMINAL\nCRITICAL_ANOMALY_CROSSED_MARKET",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What anomaly status is detected when an exchange feed reports a Best Bid of $150.05 and Best Ask of $150.00 ($P_{\\text{bid}} > P_{\\text{ask}}$)?",
          "expectedStringOutput": "CRITICAL_ANOMALY_CROSSED_MARKET",
          "acceptableAnswers": [
            "CRITICAL_ANOMALY_CROSSED_MARKET",
            "CROSSED_MARKET"
          ],
          "primaryMisconceptionId": "MC_QUANT_MARKET_MICROSTRUCTURE_ORDER_TYPES",
          "diagnosisMap": {
            "NOMINAL": {
              "misconceptionId": "MC_QUANT_MARKET_MICROSTRUCTURE_ORDER_TYPES",
              "errorExplanation": "Bid higher than Ask is a crossed market arbitrage anomaly.",
              "recoveryPath": {
                "simplerExplanation": "Matches CRITICAL_ANOMALY_CROSSED_MARKET.",
                "guidedFixPrompt": "Type CRITICAL_ANOMALY_CROSSED_MARKET"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Limit Order Book (LOB) Architecture",
    "overviewMetaphor": "A Limit Order Book is Two Stacks of Trays Facing Each Other in a Cafeteria: on the left, hungry buyers stack their money from highest offer down to lowest (Bids); on the right, sellers stack their goods from lowest price up to highest (Asks); at each exact price tag (say $100.00), customers stand in a strict First-Come, First-Served line (Price-Time Priority); if someone wants to cancel their order, the system removes their tray from the middle of the line in O(1) time using an Intrusive Doubly-Linked List.",
    "blocks": [
      {
        "id": "quant-d2-b1-lob-dual-tree-architecture",
        "day": 2,
        "blockNumber": 1,
        "title": "Dual Red-Black Tree & Intrusive Doubly-Linked List Architecture",
        "conceptBudget": {
          "primaryConcept": "LOB Dual-Tree & Linked List Architecture",
          "supportingTerms": [
            "Price Levels (Red-Black Tree or B-Tree of discrete price points)",
            "Order Queue (Intrusive Doubly-Linked List per price level for $O(1)$ append and $O(1)$ delete)",
            "Order Lookup Hash Map (`unordered_map<OrderId, Order*>` for $O(1)$ cancellation lookup)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d1-b1-market-microstructure-cda",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "LOB Memory Hierarchy & O(1) Pointer Linking",
              "boxes": [
                {
                  "label": "Price Level $100.00",
                  "value": "Head: Order #1 -> Next: Order #2 -> Tail: Order #3 | Total Vol: 350 shares",
                  "varType": "Price Level Node",
                  "isUpdated": false
                },
                {
                  "label": "Order #2 (100 shares)",
                  "value": "Prev: Order #1 | Next: Order #3 | Cancel Action: `prev->next = next;` in 12 ns!",
                  "varType": "Doubly-Linked Node",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "lob_structure_demo.js",
            "initialCode": "function evaluateLobComplexity() {\n  return {\n    priceLevelLookup: 'O(log N) Red-Black Tree or O(1) Direct Array Map',\n    orderCancelLatency: 'O(1) Intrusive Linked List Deletion',\n    orderInsertionLatency: 'O(1) FIFO Queue Tail Append',\n    status: 'LOB_DATA_STRUCTURE_OPTIMAL'\n  };\n}\n\nconsole.log(evaluateLobComplexity().status);",
            "expectedOutput": "LOB_DATA_STRUCTURE_OPTIMAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What time complexity is achieved for canceling an existing order in a Limit Order Book with an intrusive doubly-linked list?",
          "expectedStringOutput": "O(1)",
          "acceptableAnswers": [
            "O(1)",
            "O(1) Intrusive Linked List Deletion",
            "Constant time"
          ],
          "primaryMisconceptionId": "MC_QUANT_LIMIT_ORDER_BOOK_FIFO_PRICE_TIME_PRIORITY",
          "diagnosisMap": {
            "O(N)": {
              "misconceptionId": "MC_QUANT_LIMIT_ORDER_BOOK_FIFO_PRICE_TIME_PRIORITY",
              "errorExplanation": "With an intrusive doubly-linked list and pointer map, deletion is O(1).",
              "recoveryPath": {
                "simplerExplanation": "Deletion is O(1).",
                "guidedFixPrompt": "Type O(1)"
              }
            }
          }
        }
      },
      {
        "id": "quant-d2-b2-fifo-price-time-priority-queue",
        "day": 2,
        "blockNumber": 2,
        "title": "Price-Time Priority (FIFO) & Queue Position Economics",
        "conceptBudget": {
          "primaryConcept": "Price-Time Priority (FIFO) Mechanics",
          "supportingTerms": [
            "Price Priority Rule (Better price always matches before worse price)",
            "Time Priority Rule (Earliest timestamp at identical price matches first)",
            "Queue Position Degradation (Modifying order size upward loses queue priority!)",
            "Adverse Selection Risk"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d2-b1-lob-dual-tree-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Queue Modification Bug vs Priority Preservation Diff",
              "brokenCode": "// ❌ BUG: Modifying order size directly in-place without losing priority:\norder->qty += 500; // Violates exchange FIFO rules! Other traders get front-run!",
              "fixedCode": "// ✅ PRODUCTION RULE: Cancel extra size or spawn secondary child order:\nOrder* childOrder = allocate_order(orderId_new, price, 500, current_timestamp());\nprice_level->append_tail(childOrder); // Original order keeps head priority; new shares go to back!",
              "errorLine": 2,
              "errorReason": "Increasing order quantity in-place violates fairness rules; exchanges force size increases to the back of the queue.",
              "fixExplanation": "Keep original order at head of queue and append new shares to the tail as a separate order."
            }
          },
          {
            "type": "runnable_code",
            "filename": "fifo_priority_demo.js",
            "initialCode": "function evaluateQueuePosition(order1Time, order2Time) {\n  return (order1Time < order2Time)\n    ? 'ORDER_1_HAS_FILL_PRIORITY_FIFO'\n    : 'ORDER_2_HAS_FILL_PRIORITY_FIFO';\n}\n\nconsole.log(evaluateQueuePosition(1000, 1005));",
            "expectedOutput": "ORDER_1_HAS_FILL_PRIORITY_FIFO",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which order gets filled first when Order 1 arrives at timestamp 1000 and Order 2 arrives at timestamp 1005 at the exact same $100.00 price level?",
          "expectedStringOutput": "ORDER_1_HAS_FILL_PRIORITY_FIFO",
          "acceptableAnswers": [
            "ORDER_1_HAS_FILL_PRIORITY_FIFO",
            "Order 1",
            "ORDER_1"
          ],
          "primaryMisconceptionId": "MC_QUANT_LIMIT_ORDER_BOOK_FIFO_PRICE_TIME_PRIORITY",
          "diagnosisMap": {
            "ORDER_2": {
              "misconceptionId": "MC_QUANT_LIMIT_ORDER_BOOK_FIFO_PRICE_TIME_PRIORITY",
              "errorExplanation": "FIFO awards execution to the earliest timestamp (Order 1).",
              "recoveryPath": {
                "simplerExplanation": "Order 1 arrived earlier.",
                "guidedFixPrompt": "Type ORDER_1_HAS_FILL_PRIORITY_FIFO"
              }
            }
          }
        }
      },
      {
        "id": "quant-d2-b3-l1-l2-l3-market-depth-levels",
        "day": 2,
        "blockNumber": 3,
        "title": "Market Depth Levels: Level 1 (Top) vs Level 2 (Depth) vs Level 3 (Full Book)",
        "conceptBudget": {
          "primaryConcept": "Market Depth Granularity (L1 vs L2 vs L3)",
          "supportingTerms": [
            "Level 1 (Top of Book: Best Bid, Best Ask, Top Sizes)",
            "Level 2 (Aggregated Depth: Cumulative shares at top 5 - 20 price levels)",
            "Level 3 (Full Order Feed: Individual order IDs and queue positions)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d2-b2-fifo-price-time-priority-queue",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "depth_levels_demo.js",
            "initialCode": "function evaluateFeedLevel(feedType) {\n  if (feedType === 'L1') return 'L1_FEED: BEST_BID_ASK_TOP_ONLY';\n  if (feedType === 'L2') return 'L2_FEED: AGGREGATED_PRICE_LEVEL_DEPTH';\n  if (feedType === 'L3') return 'L3_FEED: INDIVIDUAL_ORDER_QUEUE_TRANSPARENCY';\n  return 'UNKNOWN_FEED';\n}\n\nconsole.log(evaluateFeedLevel('L1'));\nconsole.log(evaluateFeedLevel('L3'));",
            "expectedOutput": "L1_FEED: BEST_BID_ASK_TOP_ONLY\nL3_FEED: INDIVIDUAL_ORDER_QUEUE_TRANSPARENCY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which market data feed level provides individual order IDs and queue positions for full book reconstruction?",
          "expectedStringOutput": "L3_FEED: INDIVIDUAL_ORDER_QUEUE_TRANSPARENCY",
          "acceptableAnswers": [
            "L3_FEED: INDIVIDUAL_ORDER_QUEUE_TRANSPARENCY",
            "L3",
            "Level 3"
          ],
          "primaryMisconceptionId": "MC_QUANT_LIMIT_ORDER_BOOK_FIFO_PRICE_TIME_PRIORITY",
          "diagnosisMap": {
            "L1": {
              "misconceptionId": "MC_QUANT_LIMIT_ORDER_BOOK_FIFO_PRICE_TIME_PRIORITY",
              "errorExplanation": "L1 only shows top of book. L3 gives full individual order queue transparency.",
              "recoveryPath": {
                "simplerExplanation": "L3 provides individual order transparency.",
                "guidedFixPrompt": "Type L3_FEED: INDIVIDUAL_ORDER_QUEUE_TRANSPARENCY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Order Book Matching Engine Implementation",
    "overviewMetaphor": "The Matching Engine is a Lightning-Fast Pawn Shop Clerk: when a buyer walks in shouting 'I will buy 100 shares for up to $50.50!', the clerk checks the lowest price tags on the shelf; if a seller has 40 shares listed at $50.00, the clerk executes a trade for 40 shares at $50.00 (The seller's resting price!); the buyer still needs 60 shares, so the clerk checks the next tray ($50.25) and fills the remainder; every transaction produces an Execution Report in under 1 microsecond.",
    "blocks": [
      {
        "id": "quant-d3-b1-crossing-order-matching-mechanics",
        "day": 3,
        "blockNumber": 1,
        "title": "Crossing Orders & The Maker Price Trade Execution Rule",
        "conceptBudget": {
          "primaryConcept": "Order Crossing & Trade Pricing Rule",
          "supportingTerms": [
            "Crossing Condition ($P_{\\text{buy}} \\ge P_{\\text{ask}}$ or $P_{\\text{sell}} \\le P_{\\text{bid}}$)",
            "Maker Price Invariant (Trades execute at the price of the RESTING passive order, not incoming aggressive order)",
            "Multi-Level Walking of the Book"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d2-b2-fifo-price-time-priority-queue",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Trade Price Determination Scenario",
              "boxes": [
                {
                  "label": "Resting Ask (Maker)",
                  "value": "Price: $100.00 | Shares: 50 | Status: Resting in book since 09:30:00",
                  "varType": "Maker Order",
                  "isUpdated": false
                },
                {
                  "label": "Incoming Buy (Taker)",
                  "value": "Price: $100.50 | Shares: 50 | Arrives at: 09:30:01",
                  "varType": "Taker Order",
                  "isUpdated": false
                },
                {
                  "label": "Matched Trade Execution",
                  "value": "Execution Price: $100.00 (Maker's price!) | Shares: 50 | Price Improvement: $0.50 for buyer!",
                  "varType": "Execution Report",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "trade_pricing_demo.js",
            "initialCode": "function determineTradePrice(restingMakerPrice, incomingTakerPrice) {\n  return {\n    restingMakerPrice,\n    incomingTakerPrice,\n    executionTradePrice: restingMakerPrice,\n    rule: 'RESTING_MAKER_PRICE_DETERMINES_TRADE',\n    status: 'TRADE_PRICING_COMPLIANT'\n  };\n}\n\nconsole.log(JSON.stringify(determineTradePrice(100.00, 100.50)));",
            "expectedOutput": "{\"restingMakerPrice\":100,\"incomingTakerPrice\":100.5,\"executionTradePrice\":100,\"rule\":\"RESTING_MAKER_PRICE_DETERMINES_TRADE\",\"status\":\"TRADE_PRICING_COMPLIANT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "At what price is a trade executed when a resting seller asks $100.00 and an incoming aggressive buyer places a limit order at $100.50?",
          "expectedStringOutput": "100",
          "acceptableAnswers": [
            "100",
            "100.00",
            "$100",
            "executionTradePrice\":100"
          ],
          "primaryMisconceptionId": "MC_QUANT_MATCHING_ENGINE_PARTIAL_FILLS_CANCELLATION",
          "diagnosisMap": {
            "100.50": {
              "misconceptionId": "MC_QUANT_MATCHING_ENGINE_PARTIAL_FILLS_CANCELLATION",
              "errorExplanation": "Trades always execute at the resting maker's price ($100.00), providing price improvement to the taker.",
              "recoveryPath": {
                "simplerExplanation": "Executes at maker price $100.00.",
                "guidedFixPrompt": "Type 100"
              }
            }
          }
        }
      },
      {
        "id": "quant-d3-b2-partial-fill-sweeping-the-book",
        "day": 3,
        "blockNumber": 2,
        "title": "Partial Fills & Sweeping Multiple Price Levels",
        "conceptBudget": {
          "primaryConcept": "Partial Fills & Book Sweeping",
          "supportingTerms": [
            "Walking the Book (Consuming Level 1, then Level 2, then Level 3 until order is filled)",
            "Partial Fill Execution Reports (`35=8|39=1` in FIX)",
            "Resting Remainder Insertion into opposite book side"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d3-b1-crossing-order-matching-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Matching Engine Fill Loop in C++",
            "codeSnippet": "while (remaining_qty > 0 && !asks.empty() && buy_price >= asks.best_price()) {\n  Order* maker = asks.best_order();\n  uint32_t fill_qty = std::min(remaining_qty, maker->qty);\n  generate_execution_report(maker, taker, maker->price, fill_qty);\n  remaining_qty -= fill_qty;\n  maker->qty -= fill_qty;\n  if (maker->qty == 0) asks.pop_head();\n}",
            "lineNotes": {
              "1": "Loops while buy crosses best ask.",
              "3": "Calculates partial fill size.",
              "7": "Removes exhausted price node from tree."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sweep_book_demo.js",
            "initialCode": "function sweepLevels(buyQty, asks) {\n  let remaining = buyQty;\n  let totalSpent = 0;\n  let totalShares = 0;\n  for (const a of asks) {\n    if (remaining <= 0) break;\n    const fill = Math.min(remaining, a.qty);\n    totalSpent += fill * a.price;\n    totalShares += fill;\n    remaining -= fill;\n  }\n  return {\n    sharesFilled: totalShares,\n    avgExecutionPrice: Number((totalSpent / totalShares).toFixed(4)),\n    unfilledShares: remaining\n  };\n}\n\nconst asks = [{ price: 50.0, qty: 100 }, { price: 50.5, qty: 100 }];\nconsole.log(JSON.stringify(sweepLevels(150, asks)));",
            "expectedOutput": "{\"sharesFilled\":150,\"avgExecutionPrice\":50.1667,\"unfilledShares\":0}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the average execution price when sweeping 100 shares at $50.00 and 50 shares at $50.50 ($((100 \\times 50 + 50 \\times 50.5) / 150)$)?",
          "expectedStringOutput": "50.1667",
          "acceptableAnswers": [
            "50.1667",
            "50.17",
            "avgExecutionPrice\":50.1667"
          ],
          "primaryMisconceptionId": "MC_QUANT_MATCHING_ENGINE_PARTIAL_FILLS_CANCELLATION",
          "diagnosisMap": {
            "50.25": {
              "misconceptionId": "MC_QUANT_MATCHING_ENGINE_PARTIAL_FILLS_CANCELLATION",
              "errorExplanation": "It is a weighted average: (5000 + 2525) / 150 = 50.1667.",
              "recoveryPath": {
                "simplerExplanation": "(5000 + 2525) / 150 = 50.1667.",
                "guidedFixPrompt": "Type 50.1667"
              }
            }
          }
        }
      },
      {
        "id": "quant-d3-b3-matching-engine-invariants",
        "day": 3,
        "blockNumber": 3,
        "title": "Matching Engine Determinism & Microsecond Invariants",
        "conceptBudget": {
          "primaryConcept": "Matching Engine Invariants",
          "supportingTerms": [
            "Zero Negative Spread Invariant ($P_{\\text{best\\_bid}} < P_{\\text{best\\_ask}}$ in resting state)",
            "Single-Threaded Pinning (Running matching engine on an isolated core with zero lock contention)",
            "Deterministic Event Replay"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d3-b2-partial-fill-sweeping-the-book",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "engine_audit_demo.js",
            "initialCode": "function auditMatchingEngineInvariants(bestBid, bestAsk) {\n  const uncrossed = bestBid < bestAsk;\n  return uncrossed\n    ? 'MATCHING_ENGINE_INVARIANT_PRESERVED: ZERO_CROSSED_BOOK'\n    : 'CRITICAL_MATCHING_ENGINE_DEFECT_CROSSED_BOOK';\n}\n\nconsole.log(auditMatchingEngineInvariants(49.95, 50.00));",
            "expectedOutput": "MATCHING_ENGINE_INVARIANT_PRESERVED: ZERO_CROSSED_BOOK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What invariant status confirms that the resting limit order book has zero crossed bids and asks?",
          "expectedStringOutput": "MATCHING_ENGINE_INVARIANT_PRESERVED: ZERO_CROSSED_BOOK",
          "acceptableAnswers": [
            "MATCHING_ENGINE_INVARIANT_PRESERVED: ZERO_CROSSED_BOOK",
            "ZERO_CROSSED_BOOK"
          ],
          "primaryMisconceptionId": "MC_QUANT_MATCHING_ENGINE_PARTIAL_FILLS_CANCELLATION",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_QUANT_MATCHING_ENGINE_PARTIAL_FILLS_CANCELLATION",
              "errorExplanation": "bestBid < bestAsk confirms invariant preservation.",
              "recoveryPath": {
                "simplerExplanation": "Matches MATCHING_ENGINE_INVARIANT_PRESERVED: ZERO_CROSSED_BOOK.",
                "guidedFixPrompt": "Type MATCHING_ENGINE_INVARIANT_PRESERVED: ZERO_CROSSED_BOOK"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Algorithmic Execution: VWAP & TWAP Strategies",
    "overviewMetaphor": "VWAP Slicing is Loading a Massive Cargo Ship Container by Container Instead of Dropping it All at Once: if a pension fund tries to buy 500,000 shares of Apple in 1 second, the price will spike $5 higher (Slippage!); Volume-Weighted Average Price (VWAP) algorithms follow the natural rhythm of the stock market—trading heavily at 9:30 AM open and 4:00 PM close, and trading lightly at noon; by matching the market's natural volume curve, the algorithm blends seamlessly into liquidity without moving the price.",
    "blocks": [
      {
        "id": "quant-d4-b1-vwap-formula-and-benchmark",
        "day": 4,
        "blockNumber": 1,
        "title": "The VWAP Benchmark Equation & Intraday Execution",
        "conceptBudget": {
          "primaryConcept": "VWAP Benchmark Equation",
          "supportingTerms": [
            "$\\text{VWAP} = \\frac{\\sum_{i=1}^N P_i \\cdot V_i}{\\sum_{i=1}^N V_i}$",
            "Institutional Benchmark (Beating VWAP means buying lower or selling higher than market average)",
            "Execution Slippage Quantification"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d3-b1-crossing-order-matching-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "VWAP Calculation Matrix",
              "boxes": [
                {
                  "label": "Trade 1: 100 shares @ $10.00",
                  "value": "Notional: $1,000 | Cumulative Vol: 100 | Cumulative Notional: $1,000",
                  "varType": "Trade Record",
                  "isUpdated": false
                },
                {
                  "label": "Trade 2: 300 shares @ $12.00",
                  "value": "Notional: $3,600 | Cumulative Vol: 400 | Cumulative Notional: $4,600",
                  "varType": "Trade Record",
                  "isUpdated": true
                },
                {
                  "label": "Calculated VWAP",
                  "value": "Formula: $4,600 / 400 = $11.50 (NOT the simple average of $11.00!)",
                  "varType": "VWAP Metric",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "vwap_calc_demo.js",
            "initialCode": "function calculateVwap(trades) {\n  let totalNotional = 0;\n  let totalVolume = 0;\n  for (const t of trades) {\n    totalNotional += t.price * t.volume;\n    totalVolume += t.volume;\n  }\n  const vwap = totalNotional / totalVolume;\n  return {\n    totalTradesCount: trades.length,\n    cumulativeVolume: totalVolume,\n    vwapPrice: Number(vwap.toFixed(4)),\n    status: 'VWAP_CALCULATED'\n  };\n}\n\nconst sampleTrades = [{ price: 10.0, volume: 100 }, { price: 12.0, volume: 300 }];\nconsole.log(JSON.stringify(calculateVwap(sampleTrades)));",
            "expectedOutput": "{\"totalTradesCount\":2,\"cumulativeVolume\":400,\"vwapPrice\":11.5,\"status\":\"VWAP_CALCULATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Volume-Weighted Average Price (VWAP) when 100 shares execute at $10.00 and 300 shares execute at $12.00 ($4600 / 400$)?",
          "expectedStringOutput": "11.5",
          "acceptableAnswers": [
            "11.5",
            "11.50",
            "$11.50",
            "vwapPrice\":11.5"
          ],
          "primaryMisconceptionId": "MC_QUANT_VWAP_TWAP_EXECUTION_ALGORITHMS",
          "diagnosisMap": {
            "11": {
              "misconceptionId": "MC_QUANT_VWAP_TWAP_EXECUTION_ALGORITHMS",
              "errorExplanation": "$11.00 is the simple unweighted average. VWAP weights the 300 shares at $12.00 -> $11.50.",
              "recoveryPath": {
                "simplerExplanation": "4600 / 400 = 11.50.",
                "guidedFixPrompt": "Type 11.5"
              }
            }
          }
        }
      },
      {
        "id": "quant-d4-b2-u-shaped-volume-profile",
        "day": 4,
        "blockNumber": 2,
        "title": "The U-Shaped Intraday Volume Profile & Dynamic Slicing",
        "conceptBudget": {
          "primaryConcept": "U-Shaped Volume Curve Slicing",
          "supportingTerms": [
            "U-Shape Distribution (High volume 09:30-10:00, low volume 12:00-13:30, high volume 15:30-16:00)",
            "Target Percentage of Volume (POV / Participation Rate e.g. 5%)",
            "Dynamic Child Order Slicing"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d4-b1-vwap-formula-and-benchmark",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Dynamic Slice Allocation Formula",
            "codeSnippet": "// Target Slice Qty = ParentOrderTotal * (ExpectedHistoricalVolumeBucket / TotalDayVolume)\nconst bucketWeight = bucketVolume / totalDayVolume;\nconst targetSliceShares = Math.round(parentOrderShares * bucketWeight);",
            "lineNotes": {
              "2": "Computes historical weight for time bin.",
              "3": "Scales child slice size proportionally."
            }
          },
          {
            "type": "runnable_code",
            "filename": "u_curve_demo.js",
            "initialCode": "function getVolumeWeight(hour) {\n  if (hour === 9 || hour === 15) return { weight: 0.35, description: 'HIGH_LIQUIDITY_MARKET_OPEN_CLOSE' };\n  if (hour === 12) return { weight: 0.10, description: 'LOW_LIQUIDITY_MIDDAY_LULL' };\n  return { weight: 0.20, description: 'NORMAL_LIQUIDITY' };\n}\n\nconsole.log(JSON.stringify(getVolumeWeight(9)));\nconsole.log(JSON.stringify(getVolumeWeight(12)));",
            "expectedOutput": "{\"weight\":0.35,\"description\":\"HIGH_LIQUIDITY_MARKET_OPEN_CLOSE\"}\n{\"weight\":0.1,\"description\":\"LOW_LIQUIDITY_MIDDAY_LULL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What liquidity description characterizes market trading at 12:00 PM midday?",
          "expectedStringOutput": "LOW_LIQUIDITY_MIDDAY_LULL",
          "acceptableAnswers": [
            "LOW_LIQUIDITY_MIDDAY_LULL",
            "description\":\"LOW_LIQUIDITY_MIDDAY_LULL\""
          ],
          "primaryMisconceptionId": "MC_QUANT_VWAP_TWAP_EXECUTION_ALGORITHMS",
          "diagnosisMap": {
            "HIGH": {
              "misconceptionId": "MC_QUANT_VWAP_TWAP_EXECUTION_ALGORITHMS",
              "errorExplanation": "Midday exhibits low volume in the classic U-shaped curve.",
              "recoveryPath": {
                "simplerExplanation": "Midday is low volume -> LOW_LIQUIDITY_MIDDAY_LULL.",
                "guidedFixPrompt": "Type LOW_LIQUIDITY_MIDDAY_LULL"
              }
            }
          }
        }
      },
      {
        "id": "quant-d4-b3-twap-uniform-time-slicing",
        "day": 4,
        "blockNumber": 3,
        "title": "Time-Weighted Average Price (TWAP) vs VWAP Trade-offs",
        "conceptBudget": {
          "primaryConcept": "TWAP Uniform Slicing",
          "supportingTerms": [
            "TWAP Slicing (Equal quantity per time slice regardless of market volume: $Q_{\\text{slice}} = Q / N$)",
            "Illiquid Assets Suitability",
            "Vulnerability to Predatory Sniffing (Predictable order intervals allow HFTs to front-run; randomized interval jittering solves this!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d4-b2-u-shaped-volume-profile",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "twap_jitter_demo.js",
            "initialCode": "function evaluateTwapRandomization(hasRandomJitter) {\n  return hasRandomJitter\n    ? 'RANDOMIZED_TWAP_INTERVALS: IMMUNE_TO_PREDATORY_HFT_SNIFFING'\n    : 'PREDICTABLE_TWAP_VULNERABLE_TO_FRONT_RUNNING';\n}\n\nconsole.log(evaluateTwapRandomization(true));\nconsole.log(evaluateTwapRandomization(false));",
            "expectedOutput": "RANDOMIZED_TWAP_INTERVALS: IMMUNE_TO_PREDATORY_HFT_SNIFFING\nPREDICTABLE_TWAP_VULNERABLE_TO_FRONT_RUNNING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What defense protects TWAP algorithmic child orders from predatory HFT detection and front-running?",
          "expectedStringOutput": "RANDOMIZED_TWAP_INTERVALS: IMMUNE_TO_PREDATORY_HFT_SNIFFING",
          "acceptableAnswers": [
            "RANDOMIZED_TWAP_INTERVALS: IMMUNE_TO_PREDATORY_HFT_SNIFFING",
            "RANDOMIZED_TWAP_INTERVALS"
          ],
          "primaryMisconceptionId": "MC_QUANT_VWAP_TWAP_EXECUTION_ALGORITHMS",
          "diagnosisMap": {
            "PREDICTABLE": {
              "misconceptionId": "MC_QUANT_VWAP_TWAP_EXECUTION_ALGORITHMS",
              "errorExplanation": "Randomizing intervals hides the algorithmic footprint.",
              "recoveryPath": {
                "simplerExplanation": "Matches RANDOMIZED_TWAP_INTERVALS.",
                "guidedFixPrompt": "Type RANDOMIZED_TWAP_INTERVALS: IMMUNE_TO_PREDATORY_HFT_SNIFFING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Limit Order Book & Matching Engine Kernel",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete sovereign institutional Limit Order Book and matching engine kernel: 1. Bid/Ask depth level management with red-black trees; 2. FIFO price-time priority order queues; 3. Continuous crossing order matching with partial fill accounting; 4. Zero crossed-book integrity verification.",
    "blocks": [
      {
        "id": "quant-d5-b1-matching-engine-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "Limit Order Book & Matching Engine Kernel Synthesis",
        "conceptBudget": {
          "primaryConcept": "LOB Matching Engine Synthesis",
          "supportingTerms": [
            "Dual Tree LOB",
            "FIFO Queue Priority",
            "Partial Fill Executions",
            "Zero Crossed Book Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d3-b2-partial-fill-sweeping-the-book",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 Order Execution Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Incoming Order arrives at gateway",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Inspects opposite book side: Does price cross best maker level?",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "YES -> Executes trade fills at maker price until quantity exhausted",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "NO -> Appends remaining shares to FIFO queue at limit price level!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "lob_engine_demo.js",
            "initialCode": "function runLobEngine() {\n  return {\n    bidsTreeStatus: 'RED_BLACK_TREE_BIDS_DESCENDING',\n    asksTreeStatus: 'RED_BLACK_TREE_ASKS_ASCENDING',\n    matchingEngineStatus: 'CONTINUOUS_DOUBLE_AUCTION_ACTIVE',\n    engineStatus: 'LOB_MATCHING_ENGINE_KERNEL_ACTIVE'\n  };\n}\n\nconsole.log(runLobEngine().engineStatus);",
            "expectedOutput": "LOB_MATCHING_ENGINE_KERNEL_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the LOB Matching Engine Kernel?",
          "expectedStringOutput": "LOB_MATCHING_ENGINE_KERNEL_ACTIVE",
          "acceptableAnswers": [
            "LOB_MATCHING_ENGINE_KERNEL_ACTIVE",
            "engineStatus: LOB_MATCHING_ENGINE_KERNEL_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_QUANT_MATCHING_ENGINE_PARTIAL_FILLS_CANCELLATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_QUANT_MATCHING_ENGINE_PARTIAL_FILLS_CANCELLATION",
              "errorExplanation": "Matches LOB_MATCHING_ENGINE_KERNEL_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches LOB_MATCHING_ENGINE_KERNEL_ACTIVE.",
                "guidedFixPrompt": "Type LOB_MATCHING_ENGINE_KERNEL_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "quant-d5-b2-matching-engine-quality-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "Order Book Integrity & Price-Time Invariant Audit",
        "conceptBudget": {
          "primaryConcept": "Matching Engine Invariant Audit",
          "supportingTerms": [
            "FIFO Sequence Invariant",
            "Maker Price Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d5-b1-matching-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lob_audit_demo.js",
            "initialCode": "function auditLobSystem(fifoVerified, makerPricingEnforced) {\n  const passed = fifoVerified && makerPricingEnforced;\n  return {\n    fifoQueueValid: fifoVerified,\n    makerPricingValid: makerPricingEnforced,\n    grade: passed ? 'LOB_MATCHING_SYSTEM_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditLobSystem(true, true)));",
            "expectedOutput": "{\"fifoQueueValid\":true,\"makerPricingValid\":true,\"grade\":\"LOB_MATCHING_SYSTEM_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when FIFO order queueing and maker pricing are verified 100%?",
          "expectedStringOutput": "LOB_MATCHING_SYSTEM_AUDIT_PASSED",
          "acceptableAnswers": [
            "LOB_MATCHING_SYSTEM_AUDIT_PASSED",
            "grade\":\"LOB_MATCHING_SYSTEM_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_QUANT_MATCHING_ENGINE_PARTIAL_FILLS_CANCELLATION",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_QUANT_MATCHING_ENGINE_PARTIAL_FILLS_CANCELLATION",
              "errorExplanation": "Passing all tests awards LOB_MATCHING_SYSTEM_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards LOB_MATCHING_SYSTEM_AUDIT_PASSED.",
                "guidedFixPrompt": "Type LOB_MATCHING_SYSTEM_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "quant-d5-b3-milestone1-quant-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Limit Order Book & Matching Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "LOB Engine Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d5-b2-matching-engine-quality-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_quant_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete Limit Order Book & Matching Engine Kernel [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete Limit Order Book & Matching Engine Kernel [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete Limit Order Book & Matching Engine Kernel [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete Limit Order Book & Matching Engine Kernel [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_QUANT_MATCHING_ENGINE_PARTIAL_FILLS_CANCELLATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_QUANT_MATCHING_ENGINE_PARTIAL_FILLS_CANCELLATION",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete Limit Order Book & Matching Engine Kernel [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Market Impact & Slippage Models: Almgren-Chriss Framework",
    "overviewMetaphor": "Market Impact is Walking Through Deep Water: if you walk very slowly, the water flows smoothly around your legs with minimal resistance (Low Market Impact); if you try to sprint through the pool, water pushes back violently creating massive waves that resist your motion (Quadratic Slippage!); the Almgren-Chriss framework mathematically calculates the optimal walking speed to balance trading resistance (market impact cost) against the risk of the water level changing (market volatility risk).",
    "blocks": [
      {
        "id": "quant-d6-b1-square-root-law-of-market-impact",
        "day": 6,
        "blockNumber": 1,
        "title": "The Universal Square-Root Law of Market Impact",
        "conceptBudget": {
          "primaryConcept": "Square-Root Law of Market Impact",
          "supportingTerms": [
            "$\\Delta P = Y \\cdot \\sigma \\cdot \\sqrt{\\frac{Q}{V}}$ (Universal empirical law across all global equity, bond, and crypto markets)",
            "Participation Rate ($\\frac{Q}{V}$)",
            "Daily Volatility ($\\sigma$)",
            "Universal Constant ($Y \\approx 0.5 - 0.7$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d4-b1-vwap-formula-and-benchmark",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Square-Root Impact vs Linear Fallacy",
              "boxes": [
                {
                  "label": "Linear Fallacy (Incorrect)",
                  "value": "Assumption: Doubling trade size doubles price impact (2X size = 2X slippage) | REALITY: FALSE!",
                  "varType": "Flawed Model",
                  "isUpdated": false
                },
                {
                  "label": "Square-Root Law (Empirical Fact)",
                  "value": "Formula: $\\Delta P \\propto \\sqrt{Q}$ | Doubling trade size increases price impact by only $\\sqrt{2} \\approx 1.41\\times$!",
                  "varType": "Universal Law",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sqrt_impact_demo.js",
            "initialCode": "function evaluateImpactScaling(qtyRatio) {\n  const impactScaling = Math.sqrt(qtyRatio);\n  return {\n    orderSizeMultiplier: qtyRatio,\n    impactMultiplier: Number(impactScaling.toFixed(2)),\n    law: 'UNIVERSAL_SQUARE_ROOT_LAW'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateImpactScaling(4))); // 4X size -> 2X impact!",
            "expectedOutput": "{\"orderSizeMultiplier\":4,\"impactMultiplier\":2,\"law\":\"UNIVERSAL_SQUARE_ROOT_LAW\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Under the Universal Square-Root Law, by what multiplier does market impact increase when trade size is quadrupled ($4\\times$)?",
          "expectedStringOutput": "2",
          "acceptableAnswers": [
            "2",
            "2x",
            "2.0",
            "impactMultiplier\":2"
          ],
          "primaryMisconceptionId": "MC_QUANT_MARKET_IMPACT_AND_SLIPPAGE_MODELS",
          "diagnosisMap": {
            "4": {
              "misconceptionId": "MC_QUANT_MARKET_IMPACT_AND_SLIPPAGE_MODELS",
              "errorExplanation": "Impact scales with sqrt(4) = 2, NOT linearly.",
              "recoveryPath": {
                "simplerExplanation": "sqrt(4) = 2.",
                "guidedFixPrompt": "Type 2"
              }
            }
          }
        }
      },
      {
        "id": "quant-d6-b2-permanent-vs-temporary-impact",
        "day": 6,
        "blockNumber": 2,
        "title": "Permanent vs Temporary Market Impact Components",
        "conceptBudget": {
          "primaryConcept": "Permanent vs Temporary Market Impact",
          "supportingTerms": [
            "Permanent Impact ($I_{\\text{perm}} = \\gamma Q$: Shifts market consensus price permanently due to new information)",
            "Temporary Impact ($I_{\\text{temp}} = \\eta \\frac{Q}{T}$: Transient price depression from eating order book liquidity; recovers once trade ends)",
            "Decay Half-Life"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d6-b1-square-root-law-of-market-impact",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "perm_temp_demo.js",
            "initialCode": "function evaluateImpactComponents(shares, gamma = 0.0001, eta = 0.0005, durationSec = 60) {\n  const permImpact = gamma * shares;\n  const tempImpact = eta * (shares / durationSec);\n  return {\n    permanentPriceShift: Number(permImpact.toFixed(4)),\n    temporarySlippage: Number(tempImpact.toFixed(4)),\n    status: 'IMPACT_COMPONENTS_CALCULATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateImpactComponents(10000)));",
            "expectedOutput": "{\"permanentPriceShift\":1,\"temporarySlippage\":0.0833,\"status\":\"IMPACT_COMPONENTS_CALCULATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the permanent price shift caused by a 10,000 share trade with $\\gamma = 0.0001$ ($10000 \\times 0.0001$)?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "$1.00",
            "1.0",
            "permanentPriceShift\":1"
          ],
          "primaryMisconceptionId": "MC_QUANT_MARKET_IMPACT_AND_SLIPPAGE_MODELS",
          "diagnosisMap": {
            "0.1": {
              "misconceptionId": "MC_QUANT_MARKET_IMPACT_AND_SLIPPAGE_MODELS",
              "errorExplanation": "10000 * 0.0001 = $1.00.",
              "recoveryPath": {
                "simplerExplanation": "10000 * 0.0001 = 1.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "quant-d6-b3-almgren-chriss-optimal-trajectory",
        "day": 6,
        "blockNumber": 3,
        "title": "Almgren-Chriss Optimal Liquidation Trajectories",
        "conceptBudget": {
          "primaryConcept": "Almgren-Chriss Optimal Execution",
          "supportingTerms": [
            "Risk-Aversion Parameter ($\\lambda$)",
            "Euler-Lagrange Equation: Hyperbolic sine/cosine liquidation curves ($n_j = \\frac{2 \\sinh(\\frac{1}{2} \\kappa) \\cosh(\\kappa (N - j + \\frac{1}{2}))}{\\sinh(\\kappa N)} X_0$)",
            "Trading Off Impact Cost vs Market Risk"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d6-b2-permanent-vs-temporary-impact",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "almgren_traj_demo.js",
            "initialCode": "function evaluateLiquidationSpeed(riskAversionLambda) {\n  return riskAversionLambda > 1.0\n    ? 'AGGRESSIVE_FAST_LIQUIDATION: HIGH_IMPACT_COST_LOW_TIMING_RISK'\n    : 'PASSIVE_SLOW_LIQUIDATION: LOW_IMPACT_COST_HIGH_TIMING_RISK';\n}\n\nconsole.log(evaluateLiquidationSpeed(2.5));\nconsole.log(evaluateLiquidationSpeed(0.1));",
            "expectedOutput": "AGGRESSIVE_FAST_LIQUIDATION: HIGH_IMPACT_COST_LOW_TIMING_RISK\nPASSIVE_SLOW_LIQUIDATION: LOW_IMPACT_COST_HIGH_TIMING_RISK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What liquidation strategy is selected when a portfolio manager specifies high risk-aversion ($\\lambda > 1.0$) to minimize volatility exposure?",
          "expectedStringOutput": "AGGRESSIVE_FAST_LIQUIDATION: HIGH_IMPACT_COST_LOW_TIMING_RISK",
          "acceptableAnswers": [
            "AGGRESSIVE_FAST_LIQUIDATION: HIGH_IMPACT_COST_LOW_TIMING_RISK",
            "AGGRESSIVE_FAST_LIQUIDATION"
          ],
          "primaryMisconceptionId": "MC_QUANT_MARKET_IMPACT_AND_SLIPPAGE_MODELS",
          "diagnosisMap": {
            "PASSIVE": {
              "misconceptionId": "MC_QUANT_MARKET_IMPACT_AND_SLIPPAGE_MODELS",
              "errorExplanation": "High risk aversion liquidates fast to avoid holding risk.",
              "recoveryPath": {
                "simplerExplanation": "Matches AGGRESSIVE_FAST_LIQUIDATION: HIGH_IMPACT_COST_LOW_TIMING_RISK.",
                "guidedFixPrompt": "Type AGGRESSIVE_FAST_LIQUIDATION: HIGH_IMPACT_COST_LOW_TIMING_RISK"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Order Book Imbalance (OBI) & Micro-Price Estimation",
    "overviewMetaphor": "Order Book Imbalance is a Tug-of-War with 10 People on One Side and 1 on the Other: the current midpoint price says $100.00; but on the Bid side, there are 10,000 shares waiting to buy, while on the Ask side there are only 100 shares waiting to sell; any incoming buy order will easily wipe out the 100 asks and push the price up to $100.10; Stoikov Micro-Price calculates the true equilibrium price ($100.09) before the midpoint officially moves.",
    "blocks": [
      {
        "id": "quant-d7-b1-order-book-imbalance-equation",
        "day": 7,
        "blockNumber": 1,
        "title": "Order Book Imbalance (OBI) Equation & Bounded Range",
        "conceptBudget": {
          "primaryConcept": "Order Book Imbalance (OBI) Metric",
          "supportingTerms": [
            "$\\text{OBI} = \\frac{V_{\\text{bid}} - V_{\\text{ask}}}{V_{\\text{bid}} + V_{\\text{ask}}}$ (Range $[-1.0, +1.0]$)",
            "Positive Imbalance ($\\text{OBI} > +0.5 \\implies$ Heavy bid pressure, upward price jump expected)",
            "Negative Imbalance ($\\text{OBI} < -0.5 \\implies$ Heavy ask pressure, downward price drop expected)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d2-b1-lob-dual-tree-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "OBI Calculation & Predictive Pressure",
              "boxes": [
                {
                  "label": "Bids: 9,000 shares @ $100.00",
                  "value": "Volume: 90% of book | Buyer pressure: IMMENSE",
                  "varType": "Bid Volume",
                  "isUpdated": false
                },
                {
                  "label": "Asks: 1,000 shares @ $100.02",
                  "value": "Volume: 10% of book | Seller liquidity: THIN",
                  "varType": "Ask Volume",
                  "isUpdated": false
                },
                {
                  "label": "Calculated OBI",
                  "value": "Formula: $(9000 - 1000) / (9000 + 1000) = +0.80$ -> HIGH PROBABILITY OF UPWARD JUMP!",
                  "varType": "Alpha Signal",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "obi_calc_demo.js",
            "initialCode": "function calculateObi(bidVol, askVol) {\n  const obi = (bidVol - askVol) / (bidVol + askVol);\n  return {\n    bidVolume: bidVol,\n    askVolume: askVol,\n    imbalance: Number(obi.toFixed(2)),\n    predictedJump: obi > 0.5 ? 'UPWARD_PRICE_JUMP' : (obi < -0.5 ? 'DOWNWARD_PRICE_DROP' : 'NEUTRAL')\n  };\n}\n\nconsole.log(JSON.stringify(calculateObi(9000, 1000)));\nconsole.log(JSON.stringify(calculateObi(1000, 9000)));",
            "expectedOutput": "{\"bidVolume\":9000,\"askVolume\":1000,\"imbalance\":0.8,\"predictedJump\":\"UPWARD_PRICE_JUMP\"}\n{\"bidVolume\":1000,\"askVolume\":9000,\"imbalance\":-0.8,\"predictedJump\":\"DOWNWARD_PRICE_DROP\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Order Book Imbalance (OBI) when Bid volume is 9,000 shares and Ask volume is 1,000 shares ($8000 / 10000$)?",
          "expectedStringOutput": "0.8",
          "acceptableAnswers": [
            "0.8",
            "0.80",
            "+0.8",
            "imbalance\":0.8"
          ],
          "primaryMisconceptionId": "MC_QUANT_ORDER_BOOK_IMBALANCE_AND_MICRO_PRICE",
          "diagnosisMap": {
            "9": {
              "misconceptionId": "MC_QUANT_ORDER_BOOK_IMBALANCE_AND_MICRO_PRICE",
              "errorExplanation": "OBI = (9000 - 1000) / (9000 + 1000) = 8000 / 10000 = 0.8.",
              "recoveryPath": {
                "simplerExplanation": "8000 / 10000 = 0.8.",
                "guidedFixPrompt": "Type 0.8"
              }
            }
          }
        }
      },
      {
        "id": "quant-d7-b2-stoikov-micro-price-estimator",
        "day": 7,
        "blockNumber": 2,
        "title": "Stoikov Micro-Price Estimation & Volume Weighting",
        "conceptBudget": {
          "primaryConcept": "Stoikov Micro-Price Formula",
          "supportingTerms": [
            "$P_{\\text{micro}} = P_{\\text{bid}} \\frac{V_{\\text{ask}}}{V_{\\text{bid}} + V_{\\text{ask}}} + P_{\\text{ask}} \\frac{V_{\\text{bid}}}{V_{\\text{bid}} + V_{\\text{ask}}}$",
            "Counter-Intuitive Weighting (Note: Bid price is multiplied by ASK volume, and Ask price is multiplied by BID volume!)",
            "Fair Value Estimator"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d7-b1-order-book-imbalance-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Stoikov Micro-Price C++ Implementation",
            "codeSnippet": "double total_vol = bid_vol + ask_vol;\n// Weight ask price by BID volume because heavy bids push price towards ASK!\ndouble micro_price = (bid_price * (ask_vol / total_vol)) + (ask_price * (bid_vol / total_vol));",
            "lineNotes": {
              "1": "Sums total depth volume.",
              "3": "Weights ask price by bid volume."
            }
          },
          {
            "type": "runnable_code",
            "filename": "micro_price_demo.js",
            "initialCode": "function computeStoikovMicroPrice(bid, bidVol, ask, askVol) {\n  const total = bidVol + askVol;\n  const micro = (bid * (askVol / total)) + (ask * (bidVol / total));\n  return {\n    bestBid: bid,\n    bestAsk: ask,\n    midpoint: (bid + ask) / 2,\n    microPrice: Number(micro.toFixed(4))\n  };\n}\n\nconsole.log(JSON.stringify(computeStoikovMicroPrice(100.0, 900, 100.10, 100)));",
            "expectedOutput": "{\"bestBid\":100,\"bestAsk\":100.1,\"midpoint\":100.05,\"microPrice\":100.09}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Stoikov Micro-Price when Bid=$100.00 (900 shares) and Ask=$100.10 (100 shares)? ($100 \\times 0.10 + 100.10 \\times 0.90$)",
          "expectedStringOutput": "100.09",
          "acceptableAnswers": [
            "100.09",
            "$100.09",
            "microPrice\":100.09"
          ],
          "primaryMisconceptionId": "MC_QUANT_ORDER_BOOK_IMBALANCE_AND_MICRO_PRICE",
          "diagnosisMap": {
            "100.05": {
              "misconceptionId": "MC_QUANT_ORDER_BOOK_IMBALANCE_AND_MICRO_PRICE",
              "errorExplanation": "$100.05 is the unweighted midpoint. Stoikov micro-price shifts to $100.09 due to heavy bid volume.",
              "recoveryPath": {
                "simplerExplanation": "100*0.1 + 100.10*0.9 = 100.09.",
                "guidedFixPrompt": "Type 100.09"
              }
            }
          }
        }
      },
      {
        "id": "quant-d7-b3-short-term-alpha-signal-generation",
        "day": 7,
        "blockNumber": 3,
        "title": "Short-Term Microstructure Alpha Signal Generation",
        "conceptBudget": {
          "primaryConcept": "Microstructure Alpha Signals",
          "supportingTerms": [
            "Information Horizon: 10 ms to 500 ms",
            "Trade Sign Flow ($T_i = +1$ for buyer-initiated, $-1$ for seller-initiated)",
            "High-Frequency Trend Following"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d7-b2-stoikov-micro-price-estimator",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "alpha_signal_demo.js",
            "initialCode": "function generateMicrostructureAlpha(microPrice, midPrice) {\n  const delta = microPrice - midPrice;\n  return delta > 0.02\n    ? 'STRONG_BUY_ALPHA_SIGNAL_PREDICTED_UPWARD_EXPANSION'\n    : (delta < -0.02 ? 'STRONG_SELL_ALPHA_SIGNAL' : 'NEUTRAL_ALPHA');\n}\n\nconsole.log(generateMicrostructureAlpha(100.09, 100.05)); // +0.04 delta\nconsole.log(generateMicrostructureAlpha(100.01, 100.05)); // -0.04 delta",
            "expectedOutput": "STRONG_BUY_ALPHA_SIGNAL_PREDICTED_UPWARD_EXPANSION\nSTRONG_SELL_ALPHA_SIGNAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What alpha signal is generated when Micro-Price exceeds Mid-Price by +$0.04 ($100.09 > 100.05$)?",
          "expectedStringOutput": "STRONG_BUY_ALPHA_SIGNAL_PREDICTED_UPWARD_EXPANSION",
          "acceptableAnswers": [
            "STRONG_BUY_ALPHA_SIGNAL_PREDICTED_UPWARD_EXPANSION",
            "STRONG_BUY_ALPHA_SIGNAL"
          ],
          "primaryMisconceptionId": "MC_QUANT_ORDER_BOOK_IMBALANCE_AND_MICRO_PRICE",
          "diagnosisMap": {
            "SELL": {
              "misconceptionId": "MC_QUANT_ORDER_BOOK_IMBALANCE_AND_MICRO_PRICE",
              "errorExplanation": "Micro-price higher than mid-price generates a buy signal.",
              "recoveryPath": {
                "simplerExplanation": "Generates strong buy signal.",
                "guidedFixPrompt": "Type STRONG_BUY_ALPHA_SIGNAL_PREDICTED_UPWARD_EXPANSION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "High-Frequency Market Making: Avellaneda-Stoikov Model",
    "overviewMetaphor": "Market Making is a Currency Exchange Booth at an International Airport: the booth buys Euros at $1.08 and sells them at $1.10, pocketing the $0.02 spread; but if 100 tourists in a row sell Euros to the booth, the booth owner is left holding 500,000 Euros (Massive Inventory Risk!); if the Euro crashes overnight, the owner loses millions; the Avellaneda-Stoikov model automatically lowers the booth's buying and selling prices (Reservation Price) to discourage more Euro sellers and attract Euro buyers back to balance.",
    "blocks": [
      {
        "id": "quant-d8-b1-inventory-risk-penalty",
        "day": 8,
        "blockNumber": 1,
        "title": "Inventory Risk & The Avellaneda-Stoikov Reservation Price",
        "conceptBudget": {
          "primaryConcept": "Avellaneda-Stoikov Reservation Price",
          "supportingTerms": [
            "$r(s, q, t) = s - q \\gamma \\sigma^2 (T - t)$",
            "Mid-price ($s$)",
            "Current Inventory ($q$)",
            "Risk Aversion ($\\gamma$)",
            "Asset Volatility ($\\sigma$)",
            "Time Horizon ($T - t$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d7-b1-order-book-imbalance-equation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Inventory Skew Behavior Matrix",
              "boxes": [
                {
                  "label": "1. Flat Inventory ($q = 0$)",
                  "value": "Reservation Price: $100.00 | Quoted Bid: $99.95 | Quoted Ask: $100.05 | Spread: Symmetric",
                  "varType": "Neutral Quoting",
                  "isUpdated": false
                },
                {
                  "label": "2. Long Inventory ($q = +100$ shares)",
                  "value": "Reservation Price: $99.80 (SKEWED DOWN!) | Quoted Bid: $99.75 | Quoted Ask: $99.85 | Result: Attracts Buyers!",
                  "varType": "Inventory Skew",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "res_price_demo.js",
            "initialCode": "function calculateReservationPrice(mid, q, gamma = 0.1, sigma = 0.2, t = 1.0) {\n  const penalty = q * gamma * (sigma * sigma) * t;\n  const r = mid - penalty;\n  return {\n    midPrice: mid,\n    inventoryQ: q,\n    inventoryPenalty: Number(penalty.toFixed(4)),\n    reservationPrice: Number(r.toFixed(4))\n  };\n}\n\nconsole.log(JSON.stringify(calculateReservationPrice(100.0, 50, 0.1, 0.2, 1.0)));\nconsole.log(JSON.stringify(calculateReservationPrice(100.0, -50, 0.1, 0.2, 1.0)));",
            "expectedOutput": "{\"midPrice\":100,\"inventoryQ\":50,\"inventoryPenalty\":0.2,\"reservationPrice\":99.8}\n{\"midPrice\":100,\"inventoryQ\":-50,\"inventoryPenalty\":-0.2,\"reservationPrice\":100.2}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What happens to a market maker's reservation price when holding a LONG inventory position ($q = +50$)?",
          "expectedStringOutput": "99.8",
          "acceptableAnswers": [
            "99.8",
            "99.80",
            "$99.80",
            "reservationPrice\":99.8"
          ],
          "primaryMisconceptionId": "MC_QUANT_MARKET_MAKING_AVEM_STOIKOV_SPREAD",
          "diagnosisMap": {
            "100.2": {
              "misconceptionId": "MC_QUANT_MARKET_MAKING_AVEM_STOIKOV_SPREAD",
              "errorExplanation": "Holding long inventory lowers the reservation price to $99.80 to encourage selling off inventory.",
              "recoveryPath": {
                "simplerExplanation": "100 - (50 * 0.1 * 0.04 * 1) = 99.80.",
                "guidedFixPrompt": "Type 99.8"
              }
            }
          }
        }
      },
      {
        "id": "quant-d8-b2-optimal-bid-ask-quotes",
        "day": 8,
        "blockNumber": 2,
        "title": "Optimal Bid & Ask Spread Quotes around Reservation Price",
        "conceptBudget": {
          "primaryConcept": "Optimal Bid-Ask Quoting Spread",
          "supportingTerms": [
            "$\\delta^a + \\delta^b = \\gamma \\sigma^2 (T - t) + \\frac{2}{\\gamma} \\ln(1 + \\frac{\\gamma}{\\kappa})$",
            "Liquidity Density ($\\kappa$)",
            "Quoted Bid ($P_{\\text{bid}} = r - \\frac{\\Delta}{2}$)",
            "Quoted Ask ($P_{\\text{ask}} = r + \\frac{\\Delta}{2}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d8-b1-inventory-risk-penalty",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Avellaneda-Stoikov Quotes in C++",
            "codeSnippet": "double res_price = mid - (inventory_q * gamma * sigma * sigma * time_rem);\ndouble half_spread = 0.5 * (gamma * sigma * sigma * time_rem + (2.0 / gamma) * std::log(1.0 + gamma / kappa));\ndouble bid_quote = res_price - half_spread;\ndouble ask_quote = res_price + half_spread;",
            "lineNotes": {
              "1": "Computes reservation price from inventory.",
              "2": "Calculates optimal spread.",
              "3": "Sets asymmetric bid and ask limits."
            }
          },
          {
            "type": "runnable_code",
            "filename": "optimal_quotes_demo.js",
            "initialCode": "function generateOptimalQuotes(rPrice, halfSpread = 0.05) {\n  return {\n    reservationPrice: rPrice,\n    bidQuote: Number((rPrice - halfSpread).toFixed(2)),\n    askQuote: Number((rPrice + halfSpread).toFixed(2)),\n    status: 'OPTIMAL_QUOTES_POSTED_TO_EXCHANGE'\n  };\n}\n\nconsole.log(JSON.stringify(generateOptimalQuotes(99.80, 0.05)));",
            "expectedOutput": "{\"reservationPrice\":99.8,\"bidQuote\":99.75,\"askQuote\":99.85,\"status\":\"OPTIMAL_QUOTES_POSTED_TO_EXCHANGE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the optimal Bid quote when the reservation price is $99.80 and half-spread is $0.05 ($99.80 - 0.05$)?",
          "expectedStringOutput": "99.75",
          "acceptableAnswers": [
            "99.75",
            "$99.75",
            "bidQuote\":99.75"
          ],
          "primaryMisconceptionId": "MC_QUANT_MARKET_MAKING_AVEM_STOIKOV_SPREAD",
          "diagnosisMap": {
            "99.85": {
              "misconceptionId": "MC_QUANT_MARKET_MAKING_AVEM_STOIKOV_SPREAD",
              "errorExplanation": "$99.85 is the ask quote. Bid quote is 99.80 - 0.05 = $99.75.",
              "recoveryPath": {
                "simplerExplanation": "99.80 - 0.05 = 99.75.",
                "guidedFixPrompt": "Type 99.75"
              }
            }
          }
        }
      },
      {
        "id": "quant-d8-b3-adverse-selection-and-toxic-flow",
        "day": 8,
        "blockNumber": 3,
        "title": "Adverse Selection & Toxic Order Flow Defenses",
        "conceptBudget": {
          "primaryConcept": "Adverse Selection Defenses",
          "supportingTerms": [
            "Toxic Flow (Informed institutional traders sweeping market maker quotes right before a price crash)",
            "VPIN (Volume-Synchronized Probability of Toxicity)",
            "Automated Quote Widening & Inventory Flushes"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d8-b2-optimal-bid-ask-quotes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "toxic_flow_demo.js",
            "initialCode": "function evaluateToxicity(vpinScore) {\n  return vpinScore > 0.8\n    ? 'HIGH_TOXIC_FLOW_DETECTED: WIDEN_QUOTES_OR_PULL_LIQUIDITY'\n    : 'ORDER_FLOW_HEALTHY_TIGHTEN_SPREADS';\n}\n\nconsole.log(evaluateToxicity(0.85));\nconsole.log(evaluateToxicity(0.20));",
            "expectedOutput": "HIGH_TOXIC_FLOW_DETECTED: WIDEN_QUOTES_OR_PULL_LIQUIDITY\nORDER_FLOW_HEALTHY_TIGHTEN_SPREADS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What protective action is taken by a market making engine when Order Flow Toxicity (VPIN) spikes to 0.85?",
          "expectedStringOutput": "HIGH_TOXIC_FLOW_DETECTED: WIDEN_QUOTES_OR_PULL_LIQUIDITY",
          "acceptableAnswers": [
            "HIGH_TOXIC_FLOW_DETECTED: WIDEN_QUOTES_OR_PULL_LIQUIDITY",
            "HIGH_TOXIC_FLOW_DETECTED"
          ],
          "primaryMisconceptionId": "MC_QUANT_MARKET_MAKING_AVEM_STOIKOV_SPREAD",
          "diagnosisMap": {
            "TIGHTEN": {
              "misconceptionId": "MC_QUANT_MARKET_MAKING_AVEM_STOIKOV_SPREAD",
              "errorExplanation": "High toxicity requires widening quotes or pulling liquidity to avoid adverse selection losses.",
              "recoveryPath": {
                "simplerExplanation": "Widens quotes or pulls liquidity.",
                "guidedFixPrompt": "Type HIGH_TOXIC_FLOW_DETECTED: WIDEN_QUOTES_OR_PULL_LIQUIDITY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Financial Information eXchange (FIX 4.4) Protocol & FAST Compression",
    "overviewMetaphor": "The FIX Protocol is the Universal English Language of Wall Street: every broker, hedge fund, and stock exchange worldwide communicates order requests and trade executions using tag-value pairs (like `35=D` for New Order Single, `55=AAPL` for symbol Apple, and `38=100` for 100 shares); FAST (FIX Adapted for STreaming) compresses these text messages into compact binary streams using byte-level stop-bits and implicit field dictionaries—reducing message payloads by 80% on high-frequency network cables.",
    "blocks": [
      {
        "id": "quant-d9-b1-fix-tag-value-anatomy",
        "day": 9,
        "blockNumber": 1,
        "title": "FIX 4.4 Tag-Value Structure & SOH Delimiters",
        "conceptBudget": {
          "primaryConcept": "FIX 4.4 Tag-Value Protocol Anatomy",
          "supportingTerms": [
            "Start of Header (SOH / `\\x01` byte delimiter between fields)",
            "Core Header Tags: `8=BeginString` (e.g. `FIX.4.4`), `9=BodyLength`, `35=MsgType`",
            "Checksum Tag: `10=CheckSum` (Modulo 256 sum of all bytes up to tag 10)",
            "Message Types: `35=D` (New Order Single), `35=8` (Execution Report), `35=F` (Order Cancel Request)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d1-b2-order-types-and-tif",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "FIX Message Stream Byte Anatomy",
              "boxes": [
                {
                  "label": "8=FIX.4.4\\x01",
                  "value": "Tag 8: Protocol Version | Length: 10 bytes",
                  "varType": "Header Field",
                  "isUpdated": false
                },
                {
                  "label": "9=68\\x01",
                  "value": "Tag 9: Body Length | Excludes Tag 8, 9 and Tag 10 checksum",
                  "varType": "Header Field",
                  "isUpdated": false
                },
                {
                  "label": "35=D\\x01",
                  "value": "Tag 35: Message Type = 'D' (New Order Single)",
                  "varType": "Body Field",
                  "isUpdated": false
                },
                {
                  "label": "10=128\\x01",
                  "value": "Tag 10: Checksum | Modulo 256 sum formatted as exactly 3 ASCII digits",
                  "varType": "Trailer Field",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "fix_checksum_demo.js",
            "initialCode": "function calculateFixChecksum(fixWithoutChecksum) {\n  let sum = 0;\n  for (let i = 0; i < fixWithoutChecksum.length; i++) {\n    sum += fixWithoutChecksum.charCodeAt(i);\n  }\n  const checksumVal = sum % 256;\n  const checksumStr = checksumVal.toString().padStart(3, '0');\n  return {\n    asciiByteSum: sum,\n    modulo256: checksumVal,\n    formattedTag10: `10=${checksumStr}\\x01`,\n    status: 'FIX_CHECKSUM_COMPUTED'\n  };\n}\n\nconst sampleMsg = '8=FIX.4.4\\x019=42\\x0135=D\\x0155=AAPL\\x0138=100\\x01';\nconsole.log(JSON.stringify(calculateFixChecksum(sampleMsg)));",
            "expectedOutput": "{\"asciiByteSum\":1917,\"modulo256\":125,\"formattedTag10\":\"10=125\\x01\",\"status\":\"FIX_CHECKSUM_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many ASCII digits are strictly required when formatting FIX Tag 10 checksums (e.g. `10=042\\x01`)?",
          "expectedStringOutput": "3",
          "acceptableAnswers": [
            "3",
            "3 digits",
            "3 ASCII digits"
          ],
          "primaryMisconceptionId": "MC_QUANT_FIX_PROTOCOL_TAGVALUE_ENCODING",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_QUANT_FIX_PROTOCOL_TAGVALUE_ENCODING",
              "errorExplanation": "FIX specification mandates a 3-digit zero-padded checksum (padStart(3, '0')).",
              "recoveryPath": {
                "simplerExplanation": "Requires exactly 3 digits.",
                "guidedFixPrompt": "Type 3"
              }
            }
          }
        }
      },
      {
        "id": "quant-d9-b2-fast-compression-stop-bits",
        "day": 9,
        "blockNumber": 2,
        "title": "FAST Protocol: Stop-Bit Encoding & Field Operators",
        "conceptBudget": {
          "primaryConcept": "FAST Binary Compression",
          "supportingTerms": [
            "Stop-Bit Encoding (7 data bits per byte, MSB = 1 indicates last byte of integer)",
            "Presence Map (PMAP: Bitmap indicating which optional fields are present in the packet)",
            "Field Operators: `copy`, `delta`, `increment`, `default`",
            "Bandwidth Reduction: 75 - 85%"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d9-b1-fix-tag-value-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "FAST Stop-Bit Unpacking in C",
            "codeSnippet": "uint32_t val = 0;\nuint8_t byte;\ndo {\n  byte = *buf++;\n  val = (val << 7) | (byte & 0x7F); // Accumulate 7 bits per byte\n} while ((byte & 0x80) == 0); // Stop when MSB bit 7 is set to 1!",
            "lineNotes": {
              "4": "Extracts 7 data bits.",
              "5": "MSB indicates last byte of integer."
            }
          },
          {
            "type": "runnable_code",
            "filename": "fast_stopbit_demo.js",
            "initialCode": "function evaluateFastCompression(rawFixBytes = 250, fastBytes = 40) {\n  const savingsPct = ((rawFixBytes - fastBytes) / rawFixBytes) * 100;\n  return {\n    rawFixBytes,\n    compressedFastBytes: fastBytes,\n    bandwidthReductionPercent: Number(savingsPct.toFixed(1)),\n    status: 'FAST_PROTOCOL_COMPRESSION_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateFastCompression(250, 40)));",
            "expectedOutput": "{\"rawFixBytes\":250,\"compressedFastBytes\":40,\"bandwidthReductionPercent\":84,\"status\":\"FAST_PROTOCOL_COMPRESSION_OPTIMAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What bandwidth reduction percentage is achieved by compressing a 250-byte FIX message into a 40-byte FAST packet ($((250 - 40) / 250) \\times 100$)?",
          "expectedStringOutput": "84",
          "acceptableAnswers": [
            "84",
            "84%",
            "84.0",
            "bandwidthReductionPercent\":84"
          ],
          "primaryMisconceptionId": "MC_QUANT_FIX_PROTOCOL_TAGVALUE_ENCODING",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_QUANT_FIX_PROTOCOL_TAGVALUE_ENCODING",
              "errorExplanation": "210 / 250 = 84% reduction.",
              "recoveryPath": {
                "simplerExplanation": "210 / 250 = 84%.",
                "guidedFixPrompt": "Type 84"
              }
            }
          }
        }
      },
      {
        "id": "quant-d9-b3-zero-allocation-fix-parsers",
        "day": 9,
        "blockNumber": 3,
        "title": "Zero-Allocation C++ FIX Parsers: Eliminating String Allocations",
        "conceptBudget": {
          "primaryConcept": "Zero-Allocation FIX Parsing Invariant",
          "supportingTerms": [
            "`std::string_view` (Pointer and length slices referencing existing socket buffer with zero heap mallocs)",
            "Lookup Tables (`uint32_t tag_lut[1024]` mapping tags to offsets in 1 CPU cycle)",
            "Garbage-Free Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d9-b2-fast-compression-stop-bits",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "zero_alloc_demo.js",
            "initialCode": "function evaluateParserPerformance(hasHeapAllocations) {\n  return hasHeapAllocations\n    ? 'CRITICAL_LATENCY_DEFECT: HEAP_MALLOC_TRIGGERED_IN_HOT_PATH'\n    : 'ZERO_ALLOCATION_PARSER_ACTIVE: ZERO_HEAP_OVERHEAD_OPTIMAL';\n}\n\nconsole.log(evaluateParserPerformance(false));\nconsole.log(evaluateParserPerformance(true));",
            "expectedOutput": "ZERO_ALLOCATION_PARSER_ACTIVE: ZERO_HEAP_OVERHEAD_OPTIMAL\nCRITICAL_LATENCY_DEFECT: HEAP_MALLOC_TRIGGERED_IN_HOT_PATH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What compliance status confirms that a hot-path FIX parser executes with zero heap memory allocations?",
          "expectedStringOutput": "ZERO_ALLOCATION_PARSER_ACTIVE: ZERO_HEAP_OVERHEAD_OPTIMAL",
          "acceptableAnswers": [
            "ZERO_ALLOCATION_PARSER_ACTIVE: ZERO_HEAP_OVERHEAD_OPTIMAL",
            "ZERO_ALLOCATION_PARSER_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_QUANT_FIX_PROTOCOL_TAGVALUE_ENCODING",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_QUANT_FIX_PROTOCOL_TAGVALUE_ENCODING",
              "errorExplanation": "Zero heap allocations achieve ZERO_ALLOCATION_PARSER_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches ZERO_ALLOCATION_PARSER_ACTIVE.",
                "guidedFixPrompt": "Type ZERO_ALLOCATION_PARSER_ACTIVE: ZERO_HEAP_OVERHEAD_OPTIMAL"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "NASDAQ TotalView-ITCH 5.0 & OUCH Protocols: Direct Binary Market Feeds",
    "overviewMetaphor": "ITCH 5.0 is an Uncompressed High-Definition Live Camera Feed of the Exchange: while retail traders receive delayed consolidated summaries (SIP), high-frequency quantitative desks plug directly into NASDAQ's ITCH 5.0 binary UDP multicast feed; every time a trader somewhere on Earth adds, modifies, executes, or cancels an individual order, NASDAQ broadcasts a tiny 36-byte raw C struct packet over 10G fiber—parsed in 40 nanoseconds without any text decoding.",
    "blocks": [
      {
        "id": "quant-d10-b1-itch50-binary-packet-structure",
        "day": 10,
        "blockNumber": 1,
        "title": "NASDAQ ITCH 5.0 Binary Packet Struct Layout",
        "conceptBudget": {
          "primaryConcept": "ITCH 5.0 Binary Struct Packing",
          "supportingTerms": [
            "Big-Endian Binary Fields (`uint64_t nanoseconds`, `uint64_t order_reference_number`, `uint32_t shares`, `uint32_t price_int4`)",
            "Price Scaling ($P = \\text{PriceInt4} / 10000.0$ to store floating point dollars as integers without rounding errors)",
            "Message Types: `A` (Add Order), `E` (Order Executed), `X` (Order Cancel)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d9-b1-fix-tag-value-anatomy",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "ITCH 5.0 'A' (Add Order) Struct Byte Layout (36 Bytes Total)",
              "boxes": [
                {
                  "label": "Byte 0: Type ('A')",
                  "value": "ASCII 'A' | Length: 1 byte",
                  "varType": "MsgType",
                  "isUpdated": false
                },
                {
                  "label": "Byte 1..2: Stock Locate",
                  "value": "uint16_t locator | Length: 2 bytes",
                  "varType": "Locator",
                  "isUpdated": false
                },
                {
                  "label": "Byte 5..10: Timestamp",
                  "value": "uint48_t nanoseconds past midnight | Length: 6 bytes",
                  "varType": "Timestamp",
                  "isUpdated": false
                },
                {
                  "label": "Byte 11..18: Order Ref",
                  "value": "uint64_t unique order ID | Length: 8 bytes",
                  "varType": "OrderId",
                  "isUpdated": false
                },
                {
                  "label": "Byte 19: Side ('B'/'S')",
                  "value": "Buy or Sell indicator | Length: 1 byte",
                  "varType": "Side",
                  "isUpdated": false
                },
                {
                  "label": "Byte 20..23: Shares",
                  "value": "uint32_t share count | Length: 4 bytes",
                  "varType": "Shares",
                  "isUpdated": false
                },
                {
                  "label": "Byte 24..31: Symbol",
                  "value": "8-byte ASCII padded stock symbol (e.g. 'AAPL    ')",
                  "varType": "Symbol",
                  "isUpdated": false
                },
                {
                  "label": "Byte 32..35: Price",
                  "value": "uint32_t price * 10,000 | Length: 4 bytes (e.g. 1502500 = $150.2500)",
                  "varType": "PriceInt4",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "itch_unpack_demo.js",
            "initialCode": "function unpackItchPrice(rawPriceInt4) {\n  const dollars = rawPriceInt4 / 10000;\n  return {\n    rawInteger: rawPriceInt4,\n    dollarPrice: Number(dollars.toFixed(4)),\n    status: 'ITCH_PRICE_UNPACKED'\n  };\n}\n\nconsole.log(JSON.stringify(unpackItchPrice(1502500))); // $150.2500\nconsole.log(JSON.stringify(unpackItchPrice(499500)));  // $49.9500",
            "expectedOutput": "{\"rawInteger\":1502500,\"dollarPrice\":150.25,\"status\":\"ITCH_PRICE_UNPACKED\"}\n{\"rawInteger\":499500,\"dollarPrice\":49.95,\"status\":\"ITCH_PRICE_UNPACKED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the dollar stock price represented by NASDAQ ITCH 4-byte integer `1502500` ($1502500 / 10000$)?",
          "expectedStringOutput": "150.25",
          "acceptableAnswers": [
            "150.25",
            "$150.25",
            "150.2500",
            "dollarPrice\":150.25"
          ],
          "primaryMisconceptionId": "MC_QUANT_ITCH_OUCH_BINARY_EXCHANGE_FEEDS",
          "diagnosisMap": {
            "1502.5": {
              "misconceptionId": "MC_QUANT_ITCH_OUCH_BINARY_EXCHANGE_FEEDS",
              "errorExplanation": "ITCH divides by 10,000 (4 decimal places), yielding $150.25.",
              "recoveryPath": {
                "simplerExplanation": "1502500 / 10000 = 150.25.",
                "guidedFixPrompt": "Type 150.25"
              }
            }
          }
        }
      },
      {
        "id": "quant-d10-b2-udp-multicast-gap-recovery",
        "day": 10,
        "blockNumber": 2,
        "title": "UDP Multicast Gap Detection & SoupBinTCP Replay Recovery",
        "conceptBudget": {
          "primaryConcept": "UDP Multicast Gap Detection",
          "supportingTerms": [
            "UDP Multicast (Zero-handshake broadcast to all colocation cross-connects simultaneously)",
            "Packet Loss Detection (Tracking 64-bit sequence numbers; detecting gaps $N, N+2 \\implies$ dropped packet $N+1$!)",
            "SoupBinTCP Recovery (Opening TCP back-channel to NASDAQ Soup replay server to request lost sequence range)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d10-b1-itch50-binary-packet-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gap_detect_demo.js",
            "initialCode": "function evaluatePacketSeq(lastSeq, incomingSeq) {\n  if (incomingSeq === lastSeq + 1) {\n    return { gapDetected: false, status: 'PACKET_IN_SEQUENCE_NOMINAL' };\n  }\n  const missedCount = incomingSeq - lastSeq - 1;\n  return {\n    gapDetected: true,\n    missedPacketCount: missedCount,\n    action: 'DISPATCH_SOUPBINTCP_TCP_REPLAY_REQUEST',\n    status: 'MULTICAST_GAP_DETECTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluatePacketSeq(100, 101))); // In sequence\nconsole.log(JSON.stringify(evaluatePacketSeq(100, 105))); // Missed packets 101..104!",
            "expectedOutput": "{\"gapDetected\":false,\"status\":\"PACKET_IN_SEQUENCE_NOMINAL\"}\n{\"gapDetected\":true,\"missedPacketCount\":4,\"action\":\"DISPATCH_SOUPBINTCP_TCP_REPLAY_REQUEST\",\"status\":\"MULTICAST_GAP_DETECTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is dispatched when an ITCH sequence number jumps from 100 to 105 over UDP multicast?",
          "expectedStringOutput": "DISPATCH_SOUPBINTCP_TCP_REPLAY_REQUEST",
          "acceptableAnswers": [
            "DISPATCH_SOUPBINTCP_TCP_REPLAY_REQUEST",
            "action\":\"DISPATCH_SOUPBINTCP_TCP_REPLAY_REQUEST\""
          ],
          "primaryMisconceptionId": "MC_QUANT_ITCH_OUCH_BINARY_EXCHANGE_FEEDS",
          "diagnosisMap": {
            "NOMINAL": {
              "misconceptionId": "MC_QUANT_ITCH_OUCH_BINARY_EXCHANGE_FEEDS",
              "errorExplanation": "Missing 4 packets triggers a SoupBinTCP replay request.",
              "recoveryPath": {
                "simplerExplanation": "Dispatches replay request.",
                "guidedFixPrompt": "Type DISPATCH_SOUPBINTCP_TCP_REPLAY_REQUEST"
              }
            }
          }
        }
      },
      {
        "id": "quant-d10-b3-ouch-order-entry-protocol",
        "day": 10,
        "blockNumber": 3,
        "title": "NASDAQ OUCH 4.2 Direct Order Entry Protocol",
        "conceptBudget": {
          "primaryConcept": "OUCH Binary Order Entry",
          "supportingTerms": [
            "OUCH Protocol (Lightweight binary counterpart to ITCH for sending Enter Order `O`, Cancel `X` commands)",
            "Point-to-Point TCP Connection",
            "Sub-Microsecond Acknowledgment Latency"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d10-b2-udp-multicast-gap-recovery",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ouch_entry_demo.js",
            "initialCode": "function evaluateOuchProtocol() {\n  return 'OUCH_PROTOCOL_ACTIVE: DIRECT_BINARY_ORDER_ENTRY_SUB_MICROSECOND';\n}\n\nconsole.log(evaluateOuchProtocol());",
            "expectedOutput": "OUCH_PROTOCOL_ACTIVE: DIRECT_BINARY_ORDER_ENTRY_SUB_MICROSECOND",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms operational readiness of the NASDAQ OUCH direct binary order entry protocol?",
          "expectedStringOutput": "OUCH_PROTOCOL_ACTIVE: DIRECT_BINARY_ORDER_ENTRY_SUB_MICROSECOND",
          "acceptableAnswers": [
            "OUCH_PROTOCOL_ACTIVE: DIRECT_BINARY_ORDER_ENTRY_SUB_MICROSECOND",
            "OUCH_PROTOCOL_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_QUANT_ITCH_OUCH_BINARY_EXCHANGE_FEEDS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_QUANT_ITCH_OUCH_BINARY_EXCHANGE_FEEDS",
              "errorExplanation": "Matches OUCH_PROTOCOL_ACTIVE: DIRECT_BINARY_ORDER_ENTRY_SUB_MICROSECOND.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type OUCH_PROTOCOL_ACTIVE: DIRECT_BINARY_ORDER_ENTRY_SUB_MICROSECOND"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Kernel Bypass Networking: Solarflare Onload & DPDK Zero-Copy",
    "overviewMetaphor": "Kernel Bypass is a Dedicated High-Speed VIP Express Lane directly to the Runway: in standard Linux, when a network packet arrives at the Ethernet card, it triggers a CPU hardware interrupt, copies the packet into Linux kernel memory space, runs through 50 OS firewall checks, and copies the data a second time into user space (Wasting 15 microseconds!); Kernel Bypass (Solarflare Onload / DPDK) gives your trading program direct Direct Memory Access (DMA) to the network card's ring buffer—processing market ticks in 800 nanoseconds.",
    "blocks": [
      {
        "id": "quant-d11-b1-standard-kernel-overhead-bottlenecks",
        "day": 11,
        "blockNumber": 1,
        "title": "Standard Linux Kernel Socket Bottlenecks: Context Switches & Memory Copies",
        "conceptBudget": {
          "primaryConcept": "Linux Kernel Socket Bottlenecks",
          "supportingTerms": [
            "Hardware Interrupt Overhead (CPU context switch from user space to kernel ring 0)",
            "Dual Buffer Copy (`sk_buff` kernel copy $\\to$ `read()` user buffer copy)",
            "System Call Latency (~15 to 25 microseconds in standard Linux TCP/IP stack)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d10-b1-itch50-binary-packet-structure",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Standard Linux Kernel vs Kernel Bypass Latency Path",
              "boxes": [
                {
                  "label": "1. Standard Linux Kernel (15 us)",
                  "value": "NIC -> Hardware Interrupt -> Kernel Ring 0 -> sk_buff Copy -> Context Switch -> User Socket -> HFT Strategy",
                  "varType": "Slow Path",
                  "isUpdated": false
                },
                {
                  "label": "2. Kernel Bypass DPDK (0.8 us)",
                  "value": "NIC DMA Ring -> User Space Memory (Zero Copy, Zero Context Switch, Zero Interrupts!) -> HFT Strategy",
                  "varType": "Zero-Copy Bypass",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "kernel_bypass_demo.js",
            "initialCode": "function evaluateNetworkStack(isKernelBypass) {\n  if (isKernelBypass) {\n    return { latencyMicroseconds: 0.8, interruptsPerSec: 0, status: 'KERNEL_BYPASS_ONLOAD_ACTIVE' };\n  }\n  return { latencyMicroseconds: 15.0, interruptsPerSec: 500000, status: 'STANDARD_LINUX_KERNEL_STACK' };\n}\n\nconsole.log(JSON.stringify(evaluateNetworkStack(true)));\nconsole.log(JSON.stringify(evaluateNetworkStack(false)));",
            "expectedOutput": "{\"latencyMicroseconds\":0.8,\"interruptsPerSec\":0,\"status\":\"KERNEL_BYPASS_ONLOAD_ACTIVE\"}\n{\"latencyMicroseconds\":15,\"interruptsPerSec\":500000,\"status\":\"STANDARD_LINUX_KERNEL_STACK\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the typical packet processing latency achieved with Solarflare Onload Kernel Bypass compared to 15 microseconds on standard Linux?",
          "expectedStringOutput": "0.8",
          "acceptableAnswers": [
            "0.8",
            "0.8 us",
            "0.8 microseconds",
            "latencyMicroseconds\":0.8"
          ],
          "primaryMisconceptionId": "MC_QUANT_KERNEL_BYPASS_DPDK_SOLARFLARE_ONLOAD",
          "diagnosisMap": {
            "15": {
              "misconceptionId": "MC_QUANT_KERNEL_BYPASS_DPDK_SOLARFLARE_ONLOAD",
              "errorExplanation": "Kernel bypass cuts latency down from 15 us to 0.8 us.",
              "recoveryPath": {
                "simplerExplanation": "Bypass reduces latency to 0.8 us.",
                "guidedFixPrompt": "Type 0.8"
              }
            }
          }
        }
      },
      {
        "id": "quant-d11-b2-dpdk-poll-mode-drivers-pmd",
        "day": 11,
        "blockNumber": 2,
        "title": "DPDK Poll Mode Drivers (PMD) & Core Pinning (`taskset`)",
        "conceptBudget": {
          "primaryConcept": "Poll Mode Drivers (PMD) & Core Pinning",
          "supportingTerms": [
            "Poll Mode Driver (PMD: Continuously spinning in a tight `while(true)` loop checking NIC ring descriptors instead of sleeping on interrupts)",
            "CPU Core Pinning (`pthread_setaffinity_np` isolating CPU core 2 from OS scheduler jitter)",
            "Hugepages (1 GB TLB memory pages eliminating page faults)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d11-b1-standard-kernel-overhead-bottlenecks",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "DPDK Poll Mode Loop in C",
            "codeSnippet": "struct rte_mbuf* pkts_burst[32];\nwhile (likely(running)) {\n  // Continuously polls NIC RX ring buffer in hardware memory\n  const uint16_t nb_rx = rte_eth_rx_burst(port_id, queue_id, pkts_burst, 32);\n  if (unlikely(nb_rx == 0)) continue; // Zero interrupt overhead!\n  process_itch_packets(pkts_burst, nb_rx);\n}",
            "lineNotes": {
              "4": "Direct zero-copy burst poll from NIC.",
              "5": "Zero context switch when idle."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pmd_poll_demo.js",
            "initialCode": "function evaluatePmdConfig(isPinnedToCore, isHugepagesActive) {\n  const optimal = isPinnedToCore && isHugepagesActive;\n  return {\n    coreIsolatedFromScheduler: isPinnedToCore,\n    hugepages1GbConfigured: isHugepagesActive,\n    jitterProfile: optimal ? 'SUB_MICROSECOND_DETERMINISTIC_LATENCY' : 'VULNERABLE_TO_OS_JITTER'\n  };\n}\n\nconsole.log(JSON.stringify(evaluatePmdConfig(true, true)));",
            "expectedOutput": "{\"coreIsolatedFromScheduler\":true,\"hugepages1GbConfigured\":true,\"jitterProfile\":\"SUB_MICROSECOND_DETERMINISTIC_LATENCY\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What jitter profile is achieved when a DPDK Poll Mode Driver is pinned to an isolated CPU core with 1 GB hugepages configured?",
          "expectedStringOutput": "SUB_MICROSECOND_DETERMINISTIC_LATENCY",
          "acceptableAnswers": [
            "SUB_MICROSECOND_DETERMINISTIC_LATENCY",
            "jitterProfile\":\"SUB_MICROSECOND_DETERMINISTIC_LATENCY\""
          ],
          "primaryMisconceptionId": "MC_QUANT_KERNEL_BYPASS_DPDK_SOLARFLARE_ONLOAD",
          "diagnosisMap": {
            "JITTER": {
              "misconceptionId": "MC_QUANT_KERNEL_BYPASS_DPDK_SOLARFLARE_ONLOAD",
              "errorExplanation": "Core isolation and hugepages guarantee deterministic sub-microsecond latency.",
              "recoveryPath": {
                "simplerExplanation": "Matches SUB_MICROSECOND_DETERMINISTIC_LATENCY.",
                "guidedFixPrompt": "Type SUB_MICROSECOND_DETERMINISTIC_LATENCY"
              }
            }
          }
        }
      },
      {
        "id": "quant-d11-b3-solarflare-efvi-and-onload",
        "day": 11,
        "blockNumber": 3,
        "title": "Solarflare EF_VI & Onload Userspace Network Acceleration",
        "conceptBudget": {
          "primaryConcept": "Solarflare EF_VI Architecture",
          "supportingTerms": [
            "EF_VI (Electronic Frontier Virtual Interface: Bare-metal interface to Solarflare NIC hardware)",
            "Drop-in Onload Interceptor (`LD_PRELOAD=libonload.so`)",
            "Zero-Copy Transmit Rings (`onload_zc_recv`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d11-b2-dpdk-poll-mode-drivers-pmd",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "efvi_status_demo.js",
            "initialCode": "function evaluateEfviStatus() {\n  return 'SOLARFLARE_EFVI_ACCELERATION_ACTIVE_ZERO_COPY';\n}\n\nconsole.log(evaluateEfviStatus());",
            "expectedOutput": "SOLARFLARE_EFVI_ACCELERATION_ACTIVE_ZERO_COPY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status string confirms active bare-metal acceleration using Solarflare EF_VI?",
          "expectedStringOutput": "SOLARFLARE_EFVI_ACCELERATION_ACTIVE_ZERO_COPY",
          "acceptableAnswers": [
            "SOLARFLARE_EFVI_ACCELERATION_ACTIVE_ZERO_COPY"
          ],
          "primaryMisconceptionId": "MC_QUANT_KERNEL_BYPASS_DPDK_SOLARFLARE_ONLOAD",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_QUANT_KERNEL_BYPASS_DPDK_SOLARFLARE_ONLOAD",
              "errorExplanation": "Matches SOLARFLARE_EFVI_ACCELERATION_ACTIVE_ZERO_COPY.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type SOLARFLARE_EFVI_ACCELERATION_ACTIVE_ZERO_COPY"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Lock-Free Ring Buffers: Single-Producer Single-Consumer (SPSC) Architecture",
    "overviewMetaphor": "An SPSC Lock-Free Ring Buffer is a Round Sushi Conveyor Belt between Two Chefs: Chef A (The Network Reader Thread) only places fresh plates onto the belt (Incrementing `Head`); Chef B (The Pricing Engine Thread) only takes plates off the belt (Incrementing `Tail`); because Chef A never touches `Tail` and Chef B never touches `Head`, neither chef ever has to freeze or lock the conveyor belt; they communicate at full speed through atomic memory barriers without a single mutex lock.",
    "blocks": [
      {
        "id": "quant-d12-b1-spsc-circular-buffer-mechanics",
        "day": 12,
        "blockNumber": 1,
        "title": "SPSC Circular Ring Buffer Mechanics & Power-of-Two Masking",
        "conceptBudget": {
          "primaryConcept": "SPSC Ring Buffer Power-of-Two Masking",
          "supportingTerms": [
            "Power-of-Two Capacity ($N = 2^k$, e.g. 1024 or 65536)",
            "Fast Bitwise Masking (`index = seq & (N - 1)` replacing expensive modulo `%` division with a 1-cycle bitwise AND!)",
            "Monotonically Increasing 64-bit Sequence Numbers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d11-b2-dpdk-poll-mode-drivers-pmd",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Power-of-Two Masking vs Modulo Division Cycles",
              "boxes": [
                {
                  "label": "Modulo Division (`seq % 1000`)",
                  "value": "CPU Cycles: 15 - 40 cycles (Hardware integer divider) | Speed: SLOW",
                  "varType": "Modulo Division",
                  "isUpdated": false
                },
                {
                  "label": "Power-of-2 Masking (`seq & 1023`)",
                  "value": "CPU Cycles: EXACTLY 1 CYCLE (0.3 nanoseconds!) | Speed: ULTRA-FAST",
                  "varType": "Bitwise Mask",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ring_mask_demo.js",
            "initialCode": "function evaluateRingIndex(seq, capacity = 1024) {\n  const mask = capacity - 1;\n  const slotIndex = seq & mask;\n  return {\n    sequenceNumber: seq,\n    capacity,\n    maskHex: '0x' + mask.toString(16),\n    bufferSlotIndex: slotIndex\n  };\n}\n\nconsole.log(JSON.stringify(evaluateRingIndex(1025, 1024))); // 1025 & 1023 = slot 1\nconsole.log(JSON.stringify(evaluateRingIndex(2048, 1024))); // 2048 & 1023 = slot 0",
            "expectedOutput": "{\"sequenceNumber\":1025,\"capacity\":1024,\"maskHex\":\"0x3ff\",\"bufferSlotIndex\":1}\n{\"sequenceNumber\":2048,\"capacity\":1024,\"maskHex\":\"0x3ff\",\"bufferSlotIndex\":0}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which buffer slot index is computed for sequence number 1025 with a capacity of 1024 using bitwise masking (`1025 & 1023`)?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "Slot 1",
            "bufferSlotIndex\":1"
          ],
          "primaryMisconceptionId": "MC_QUANT_RING_BUFFER_LOCK_FREE_SPSC_QUEUE",
          "diagnosisMap": {
            "1025": {
              "misconceptionId": "MC_QUANT_RING_BUFFER_LOCK_FREE_SPSC_QUEUE",
              "errorExplanation": "1025 & 1023 wraps around to slot 1.",
              "recoveryPath": {
                "simplerExplanation": "1025 & 1023 = 1.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "quant-d12-b2-atomic-acquire-release-barriers",
        "day": 12,
        "blockNumber": 2,
        "title": "C++11 Atomic Memory Orders: `memory_order_acquire` vs `memory_order_release`",
        "conceptBudget": {
          "primaryConcept": "Acquire-Release Memory Order Invariants",
          "supportingTerms": [
            "`memory_order_release` (Producer stores data BEFORE storing new `head`; guarantees consumer sees fully initialized packet)",
            "`memory_order_acquire` (Consumer loads `head` BEFORE reading packet data)",
            "Eliminating Heavy `memory_order_seq_cst` Full Bus Locks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d12-b1-spsc-circular-buffer-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SPSC Producer/Consumer in C++11",
            "codeSnippet": "// Producer Thread:\nbuffer[head & mask] = packet; // Write data FIRST\nhead.store(head + 1, std::memory_order_release); // Release barrier!\n\n// Consumer Thread:\nuint64_t current_head = head.load(std::memory_order_acquire); // Acquire barrier!\nif (current_head > tail) { Packet p = buffer[tail & mask]; tail.store(tail + 1, std::memory_order_relaxed); }",
            "lineNotes": {
              "3": "Release barrier ensures data is visible before head increments.",
              "6": "Acquire barrier synchronizes with producer's release."
            }
          },
          {
            "type": "runnable_code",
            "filename": "acquire_release_demo.js",
            "initialCode": "function evaluateMemoryOrdering(orderType) {\n  if (orderType === 'ACQUIRE_RELEASE') {\n    return 'OPTIMAL_HARDWARE_PIPELINE_ZERO_BUS_LOCKING';\n  }\n  return 'HEAVY_SEQUENTIAL_CONSISTENCY_MFENCE_OVERHEAD';\n}\n\nconsole.log(evaluateMemoryOrdering('ACQUIRE_RELEASE'));",
            "expectedOutput": "OPTIMAL_HARDWARE_PIPELINE_ZERO_BUS_LOCKING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What performance advantage is achieved by using C++11 acquire-release memory semantics over sequential consistency in SPSC queues?",
          "expectedStringOutput": "OPTIMAL_HARDWARE_PIPELINE_ZERO_BUS_LOCKING",
          "acceptableAnswers": [
            "OPTIMAL_HARDWARE_PIPELINE_ZERO_BUS_LOCKING",
            "ZERO_BUS_LOCKING"
          ],
          "primaryMisconceptionId": "MC_QUANT_RING_BUFFER_LOCK_FREE_SPSC_QUEUE",
          "diagnosisMap": {
            "HEAVY": {
              "misconceptionId": "MC_QUANT_RING_BUFFER_LOCK_FREE_SPSC_QUEUE",
              "errorExplanation": "Acquire-release avoids heavy MFENCE full-bus locks.",
              "recoveryPath": {
                "simplerExplanation": "Matches OPTIMAL_HARDWARE_PIPELINE_ZERO_BUS_LOCKING.",
                "guidedFixPrompt": "Type OPTIMAL_HARDWARE_PIPELINE_ZERO_BUS_LOCKING"
              }
            }
          }
        }
      },
      {
        "id": "quant-d12-b3-cacheline-padding-spsc",
        "day": 12,
        "blockNumber": 3,
        "title": "Cacheline Padding in SPSC: Separating `head` and `tail` across 64-Byte Lines",
        "conceptBudget": {
          "primaryConcept": "SPSC Cacheline Padding",
          "supportingTerms": [
            "`alignas(64) std::atomic<uint64_t> head`",
            "`char pad[56]` (Padding bytes ensuring `head` and `tail` sit on separate 64-byte L1 cache lines)",
            "Eliminating Cacheline Bouncing across CPU Cores"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d12-b2-atomic-acquire-release-barriers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "spsc_padding_demo.js",
            "initialCode": "function evaluateSpscPadding(isPadded) {\n  return isPadded\n    ? 'SPSC_QUEUES_ISOLATED_ON_SEPARATE_CACHELINES_ZERO_BOUNCING'\n    : 'FALSE_SHARING_DETECTED_CORE_STALLS_SEVERE';\n}\n\nconsole.log(evaluateSpscPadding(true));\nconsole.log(evaluateSpscPadding(false));",
            "expectedOutput": "SPSC_QUEUES_ISOLATED_ON_SEPARATE_CACHELINES_ZERO_BOUNCING\nFALSE_SHARING_DETECTED_CORE_STALLS_SEVERE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that SPSC `head` and `tail` pointers are padded onto separate 64-byte cache lines?",
          "expectedStringOutput": "SPSC_QUEUES_ISOLATED_ON_SEPARATE_CACHELINES_ZERO_BOUNCING",
          "acceptableAnswers": [
            "SPSC_QUEUES_ISOLATED_ON_SEPARATE_CACHELINES_ZERO_BOUNCING",
            "SPSC_QUEUES_ISOLATED"
          ],
          "primaryMisconceptionId": "MC_QUANT_RING_BUFFER_LOCK_FREE_SPSC_QUEUE",
          "diagnosisMap": {
            "FALSE": {
              "misconceptionId": "MC_QUANT_RING_BUFFER_LOCK_FREE_SPSC_QUEUE",
              "errorExplanation": "Padding prevents false sharing and cacheline bouncing.",
              "recoveryPath": {
                "simplerExplanation": "Matches SPSC_QUEUES_ISOLATED_ON_SEPARATE_CACHELINES_ZERO_BOUNCING.",
                "guidedFixPrompt": "Type SPSC_QUEUES_ISOLATED_ON_SEPARATE_CACHELINES_ZERO_BOUNCING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "CPU Cacheline Alignment & False Sharing Elimination in C++",
    "overviewMetaphor": "False Sharing is Two Writers Trying to Write on the Same Sheet of Paper from Opposite Sides of a Table: CPU Core 1 wants to update variable `A`; CPU Core 2 wants to update variable `B`; even though `A` and `B` are completely different variables, if they sit next to each other inside the same 64-byte L1 Cacheline, the CPU hardware forces Core 1 and Core 2 to play ping-pong with the cacheline (Cache Bouncing!)—slowing down execution by 20X; using `alignas(64)` gives each core its own private sheet of paper.",
    "blocks": [
      {
        "id": "quant-d13-b1-mesi-protocol-cacheline-bouncing",
        "day": 13,
        "blockNumber": 1,
        "title": "The MESI Cache Coherence Protocol & Cache Invalidation Penalties",
        "conceptBudget": {
          "primaryConcept": "MESI Cache Coherence & False Sharing",
          "supportingTerms": [
            "MESI States: Modified, Exclusive, Shared, Invalid",
            "64-Byte Cacheline Granularity (CPUs load/store memory in 64-byte chunks, never single bytes)",
            "Cacheline Bouncing Penalty (20 to 100 CPU cycles lost per invalidation)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d12-b3-cacheline-padding-spsc",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "False Sharing Collision on 64-Byte Cacheline",
              "boxes": [
                {
                  "label": "Core 1 writes `trades_count` (Offset 0x00)",
                  "value": "Core 1 marks Cacheline 'MODIFIED' -> Forces Core 2's Cacheline to 'INVALID'!",
                  "varType": "Core 1",
                  "isUpdated": false
                },
                {
                  "label": "Core 2 writes `orders_sent` (Offset 0x08)",
                  "value": "Core 2 suffers CACHE MISS -> Pulls line back -> Forces Core 1's line to 'INVALID'!",
                  "varType": "Core 2",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cache_bounce_demo.js",
            "initialCode": "function evaluateCachelinePenalty(isSharing) {\n  return isSharing\n    ? { cyclesLostPerWrite: 80, performance: '20X_SLOWER_DUE_TO_MESI_INVALIDATION' }\n    : { cyclesLostPerWrite: 1, performance: 'OPTIMAL_L1_CACHE_HIT_RATE' };\n}\n\nconsole.log(JSON.stringify(evaluateCachelinePenalty(true)));\nconsole.log(JSON.stringify(evaluateCachelinePenalty(false)));",
            "expectedOutput": "{\"cyclesLostPerWrite\":80,\"performance\":\"20X_SLOWER_DUE_TO_MESI_INVALIDATION\"}\n{\"cyclesLostPerWrite\":1,\"performance\":\"OPTIMAL_L1_CACHE_HIT_RATE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What performance impact is caused by False Sharing cache invalidations across multiple CPU cores?",
          "expectedStringOutput": "20X_SLOWER_DUE_TO_MESI_INVALIDATION",
          "acceptableAnswers": [
            "20X_SLOWER_DUE_TO_MESI_INVALIDATION",
            "20X_SLOWER",
            "performance\":\"20X_SLOWER_DUE_TO_MESI_INVALIDATION\""
          ],
          "primaryMisconceptionId": "MC_QUANT_CPU_CACHE_ALIGNMENT_FALSE_SHARING",
          "diagnosisMap": {
            "OPTIMAL": {
              "misconceptionId": "MC_QUANT_CPU_CACHE_ALIGNMENT_FALSE_SHARING",
              "errorExplanation": "False sharing causes severe MESI invalidations, slowing code by up to 20X.",
              "recoveryPath": {
                "simplerExplanation": "Slows code down by 20X.",
                "guidedFixPrompt": "Type 20X_SLOWER_DUE_TO_MESI_INVALIDATION"
              }
            }
          }
        }
      },
      {
        "id": "quant-d13-b2-alignas-64-syntax-in-cpp",
        "day": 13,
        "blockNumber": 2,
        "title": "C++17 `alignas(hardware_destructive_interference_size)`",
        "conceptBudget": {
          "primaryConcept": "C++ Cacheline Alignment Syntax",
          "supportingTerms": [
            "`alignas(64)` (Forces compiler to place struct on a 64-byte boundary)",
            "`std::hardware_destructive_interference_size` (Standard library constant for L1 cacheline size)",
            "Structure Padding"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d13-b1-mesi-protocol-cacheline-bouncing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Cacheline Alignment in C++ Structs",
            "codeSnippet": "struct alignas(64) CoreWorkerState {\n  std::atomic<uint64_t> sequence_counter;\n  char padding[56]; // Pads struct size out to exactly 64 bytes!\n};",
            "lineNotes": {
              "1": "Forces 64-byte memory alignment.",
              "3": "Pads remainder to prevent adjacent variable sharing."
            }
          },
          {
            "type": "runnable_code",
            "filename": "alignas_demo.js",
            "initialCode": "function evaluateStructSize(sizeBytes, alignmentBytes = 64) {\n  const isCompliant = (sizeBytes % alignmentBytes === 0);\n  return {\n    structSizeBytes: sizeBytes,\n    alignmentBytes,\n    isIsolated: isCompliant,\n    status: isCompliant ? 'STRUCT_CACHELINE_ISOLATED_NOMINAL' : 'STRUCT_UNALIGNED_RISK'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateStructSize(64, 64)));\nconsole.log(JSON.stringify(evaluateStructSize(72, 64)));",
            "expectedOutput": "{\"structSizeBytes\":64,\"alignmentBytes\":64,\"isIsolated\":true,\"status\":\"STRUCT_CACHELINE_ISOLATED_NOMINAL\"}\n{\"structSizeBytes\":72,\"alignmentBytes\":64,\"isIsolated\":false,\"status\":\"STRUCT_UNALIGNED_RISK\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a struct is exactly 64 bytes and isolated on its own cacheline?",
          "expectedStringOutput": "STRUCT_CACHELINE_ISOLATED_NOMINAL",
          "acceptableAnswers": [
            "STRUCT_CACHELINE_ISOLATED_NOMINAL",
            "status\":\"STRUCT_CACHELINE_ISOLATED_NOMINAL\""
          ],
          "primaryMisconceptionId": "MC_QUANT_CPU_CACHE_ALIGNMENT_FALSE_SHARING",
          "diagnosisMap": {
            "RISK": {
              "misconceptionId": "MC_QUANT_CPU_CACHE_ALIGNMENT_FALSE_SHARING",
              "errorExplanation": "64 % 64 === 0 confirms clean cacheline isolation.",
              "recoveryPath": {
                "simplerExplanation": "Matches STRUCT_CACHELINE_ISOLATED_NOMINAL.",
                "guidedFixPrompt": "Type STRUCT_CACHELINE_ISOLATED_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "quant-d13-b3-numa-memory-node-pinning",
        "day": 13,
        "blockNumber": 3,
        "title": "Non-Uniform Memory Access (NUMA) Node Affinity",
        "conceptBudget": {
          "primaryConcept": "NUMA Memory Node Affinity",
          "supportingTerms": [
            "NUMA Node 0 vs Node 1 (Local CPU socket RAM access: 60 ns vs Remote socket QPI interconnect: 140 ns!)",
            "`numactl --cpunodebind=0 --membind=0`",
            "PCIe NIC to NUMA Socket Alignment"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d13-b2-alignas-64-syntax-in-cpp",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "numa_eval_demo.js",
            "initialCode": "function evaluateNumaAccess(isLocalSocket) {\n  return isLocalSocket\n    ? { latencyNs: 60, status: 'NUMA_LOCAL_MEMORY_ACCESS_OPTIMAL' }\n    : { latencyNs: 140, status: 'NUMA_REMOTE_QPI_BUS_CROSSING_PENALTY' };\n}\n\nconsole.log(JSON.stringify(evaluateNumaAccess(true)));\nconsole.log(JSON.stringify(evaluateNumaAccess(false)));",
            "expectedOutput": "{\"latencyNs\":60,\"status\":\"NUMA_LOCAL_MEMORY_ACCESS_OPTIMAL\"}\n{\"latencyNs\":140,\"status\":\"NUMA_REMOTE_QPI_BUS_CROSSING_PENALTY\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the memory access latency when reading from local socket NUMA RAM compared to 140 ns across the remote QPI interconnect?",
          "expectedStringOutput": "60",
          "acceptableAnswers": [
            "60",
            "60 ns",
            "latencyNs\":60"
          ],
          "primaryMisconceptionId": "MC_QUANT_CPU_CACHE_ALIGNMENT_FALSE_SHARING",
          "diagnosisMap": {
            "140": {
              "misconceptionId": "MC_QUANT_CPU_CACHE_ALIGNMENT_FALSE_SHARING",
              "errorExplanation": "Local NUMA node access is 60 ns.",
              "recoveryPath": {
                "simplerExplanation": "Local NUMA access is 60 ns.",
                "guidedFixPrompt": "Type 60"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "SIMD Vectorization (AVX-512) for Pricing & Risk Kernels",
    "overviewMetaphor": "SIMD is an 8-Lane Superhighway Replacing a Single-Lane Country Road: a standard CPU core calculates option prices one by one (Scalar: Price Option 1, then Option 2, then Option 3...); AVX-512 vector registers (512 bits wide) pack eight 64-bit floating-point numbers into a single register; in one single clock tick, the CPU executes 8 Black-Scholes formulas simultaneously—accelerating real-time portfolio risk calculations by 800%.",
    "blocks": [
      {
        "id": "quant-d14-b1-avx512-vector-registers-m512d",
        "day": 14,
        "blockNumber": 1,
        "title": "AVX-512 Vector Registers (`__m512d`) & Parallel Lane Arithmetic",
        "conceptBudget": {
          "primaryConcept": "AVX-512 Vector Register Architecture",
          "supportingTerms": [
            "512-Bit Vector Registers (`ZMM0..ZMM31`)",
            "`__m512d` (Contains eight 64-bit `double` precision numbers)",
            "`__m512` (Contains sixteen 32-bit `float` single precision numbers)",
            "Fused Multiply-Add (`_mm512_fmadd_pd`: Computes $a \\cdot b + c$ in 4 CPU cycles)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d13-b2-alignas-64-syntax-in-cpp",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "512-Bit Vector Register Lane Partitioning (ZMM0)",
              "boxes": [
                {
                  "label": "Lane 0: Double 0",
                  "value": "Strike $100.00 | 64 bits",
                  "varType": "Float64",
                  "isUpdated": false
                },
                {
                  "label": "Lane 1: Double 1",
                  "value": "Strike $105.00 | 64 bits",
                  "varType": "Float64",
                  "isUpdated": false
                },
                {
                  "label": "Lane 2..6: Doubles 2..6",
                  "value": "Strikes $110..$130 | 320 bits",
                  "varType": "Float64",
                  "isUpdated": false
                },
                {
                  "label": "Lane 7: Double 7",
                  "value": "Strike $135.00 | 64 bits | Total: 512 bits in 1 register!",
                  "varType": "Float64",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "simd_lanes_demo.js",
            "initialCode": "function evaluateVectorCapacity(bits) {\n  const doublesCount = bits / 64;\n  return {\n    vectorBitWidth: bits,\n    simultaneousDoublePrecisionValues: doublesCount,\n    status: 'SIMD_LANES_CONFIGURED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateVectorCapacity(512))); // AVX-512 -> 8 doubles\nconsole.log(JSON.stringify(evaluateVectorCapacity(256))); // AVX2 -> 4 doubles",
            "expectedOutput": "{\"vectorBitWidth\":512,\"simultaneousDoublePrecisionValues\":8,\"status\":\"SIMD_LANES_CONFIGURED\"}\n{\"vectorBitWidth\":256,\"simultaneousDoublePrecisionValues\":4,\"status\":\"SIMD_LANES_CONFIGURED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many 64-bit double precision numbers are processed simultaneously in a single 512-bit AVX-512 register ($512 / 64$)?",
          "expectedStringOutput": "8",
          "acceptableAnswers": [
            "8",
            "8 doubles",
            "simultaneousDoublePrecisionValues\":8"
          ],
          "primaryMisconceptionId": "MC_QUANT_SIMD_AVX512_VECTORIZED_PRICING",
          "diagnosisMap": {
            "16": {
              "misconceptionId": "MC_QUANT_SIMD_AVX512_VECTORIZED_PRICING",
              "errorExplanation": "16 is for 32-bit floats. 512 / 64 = 8 double precision floats.",
              "recoveryPath": {
                "simplerExplanation": "512 / 64 = 8.",
                "guidedFixPrompt": "Type 8"
              }
            }
          }
        }
      },
      {
        "id": "quant-d14-b2-vectorized-black-scholes-kernel",
        "day": 14,
        "blockNumber": 2,
        "title": "Vectorized Black-Scholes Option Pricing Kernel",
        "conceptBudget": {
          "primaryConcept": "Vectorized Black-Scholes Pricing",
          "supportingTerms": [
            "Polynomial CDF Approximation (Hart's Rational Approximation vectorized for AVX-512)",
            "Eliminating Branch Mispredictions (`_mm512_mask_blend_pd`)",
            "100 Million Option Prices per Second on 1 Core"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d14-b1-avx512-vector-registers-m512d",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "AVX-512 Black-Scholes Kernel in C++",
            "codeSnippet": "__m512d v_s = _mm512_load_pd(&spots[i]);\n__m512d v_k = _mm512_load_pd(&strikes[i]);\n// Computes d1 across 8 strikes simultaneously:\n__m512d v_d1 = _mm512_div_pd(_mm512_add_pd(_mm512_log_pd(_mm512_div_pd(v_s, v_k)), v_drift), v_vol);",
            "lineNotes": {
              "1": "Loads 8 spot prices.",
              "2": "Loads 8 strike prices.",
              "4": "Vectorized d1 arithmetic."
            }
          },
          {
            "type": "runnable_code",
            "filename": "vector_pricer_demo.js",
            "initialCode": "function evaluateThroughput(scalarOptionsPerSec = 12000000, vectorWidth = 8) {\n  const vectorOptionsPerSec = scalarOptionsPerSec * vectorWidth;\n  return {\n    scalarThroughput: `${scalarOptionsPerSec / 1000000}M ops/sec`,\n    avx512Throughput: `${vectorOptionsPerSec / 1000000}M ops/sec`,\n    status: 'AVX512_PRICING_BENCHMARK_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateThroughput(12000000, 8)));",
            "expectedOutput": "{\"scalarThroughput\":\"12M ops/sec\",\"avx512Throughput\":\"96M ops/sec\",\"status\":\"AVX512_PRICING_BENCHMARK_OPTIMAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What pricing throughput is achieved by an 8-lane AVX-512 kernel accelerating a 12M options/sec scalar baseline ($12 \\times 8$)?",
          "expectedStringOutput": "96M ops/sec",
          "acceptableAnswers": [
            "96M ops/sec",
            "96M",
            "96 million",
            "avx512Throughput\":\"96M ops/sec\""
          ],
          "primaryMisconceptionId": "MC_QUANT_SIMD_AVX512_VECTORIZED_PRICING",
          "diagnosisMap": {
            "12M": {
              "misconceptionId": "MC_QUANT_SIMD_AVX512_VECTORIZED_PRICING",
              "errorExplanation": "12M * 8 = 96M ops/sec.",
              "recoveryPath": {
                "simplerExplanation": "12 * 8 = 96M ops/sec.",
                "guidedFixPrompt": "Type 96M ops/sec"
              }
            }
          }
        }
      },
      {
        "id": "quant-d14-b3-simd-compiler-flags-mavx512f",
        "day": 14,
        "blockNumber": 3,
        "title": "Compiler Auto-Vectorization & GCC Flags: `-mavx512f -O3 -ffast-math`",
        "conceptBudget": {
          "primaryConcept": "GCC Vectorization Flags",
          "supportingTerms": [
            "`-mavx512f` (Enables AVX-512 Foundation instructions)",
            "`-ffast-math` (Allows re-ordering floating point math for vectorization)",
            "`#pragma omp simd`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d14-b2-vectorized-black-scholes-kernel",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "simd_flags_demo.js",
            "initialCode": "function evaluateGccFlags(flags) {\n  const hasAvx = flags.includes('-mavx512f');\n  const hasFastMath = flags.includes('-ffast-math');\n  return (hasAvx && hasFastMath)\n    ? 'AVX512_AUTO_VECTORIZATION_MAX_PERFORMANCE'\n    : 'SUBOPTIMAL_COMPILER_FLAGS';\n}\n\nconsole.log(evaluateGccFlags('-O3 -mavx512f -ffast-math'));",
            "expectedOutput": "AVX512_AUTO_VECTORIZATION_MAX_PERFORMANCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What compilation status is awarded when GCC is configured with `-mavx512f -O3 -ffast-math`?",
          "expectedStringOutput": "AVX512_AUTO_VECTORIZATION_MAX_PERFORMANCE",
          "acceptableAnswers": [
            "AVX512_AUTO_VECTORIZATION_MAX_PERFORMANCE"
          ],
          "primaryMisconceptionId": "MC_QUANT_SIMD_AVX512_VECTORIZED_PRICING",
          "diagnosisMap": {
            "SUBOPTIMAL": {
              "misconceptionId": "MC_QUANT_SIMD_AVX512_VECTORIZED_PRICING",
              "errorExplanation": "Matches AVX512_AUTO_VECTORIZATION_MAX_PERFORMANCE.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type AVX512_AUTO_VECTORIZATION_MAX_PERFORMANCE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Ultra-Low-Latency Order Messaging & Concurrency Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete sovereign ultra-low-latency market connectivity and concurrency engine: 1. Zero-allocation NASDAQ ITCH 5.0 binary order parsing; 2. Lock-free SPSC circular ring buffer inter-thread messaging; 3. 64-byte CPU cacheline alignment with zero false sharing; 4. AVX-512 parallel vectorized throughput verification.",
    "blocks": [
      {
        "id": "quant-d15-b1-messaging-engine-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Ultra-Low-Latency Messaging & Concurrency Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Low-Latency Messaging Engine Synthesis",
          "supportingTerms": [
            "ITCH 5.0 Binary Parsing",
            "SPSC Lock-Free Queue",
            "Cacheline 64-Byte Isolation",
            "AVX-512 Parallelism"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d14-b2-vectorized-black-scholes-kernel",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 2 High-Frequency Data Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Kernel Bypass NIC DMA deposits ITCH UDP multicast frame in memory",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Zero-allocation binary parser extracts Add/Exec order structs in 40 ns",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Pushes order struct into SPSC lock-free ring buffer across acquire/release barriers",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Pricing thread consumes order with zero cacheline contention -> Dispatches alpha!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "hft_messaging_demo.js",
            "initialCode": "function runHftMessagingEngine() {\n  return {\n    itchParserStatus: 'ZERO_ALLOCATION_BINARY_PACKED',\n    spscRingStatus: 'LOCK_FREE_ACQUIRE_RELEASE_ACTIVE',\n    cachelineStatus: 'ALIGNAS_64_ISOLATED',\n    avx512Status: 'PARALLEL_LANES_ACTIVE',\n    engineStatus: 'LOW_LATENCY_MESSAGING_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runHftMessagingEngine().engineStatus);",
            "expectedOutput": "LOW_LATENCY_MESSAGING_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Low-Latency Messaging & Concurrency Engine?",
          "expectedStringOutput": "LOW_LATENCY_MESSAGING_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "LOW_LATENCY_MESSAGING_ENGINE_ACTIVE",
            "engineStatus: LOW_LATENCY_MESSAGING_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_QUANT_ITCH_OUCH_BINARY_EXCHANGE_FEEDS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_QUANT_ITCH_OUCH_BINARY_EXCHANGE_FEEDS",
              "errorExplanation": "Matches LOW_LATENCY_MESSAGING_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches LOW_LATENCY_MESSAGING_ENGINE_ACTIVE.",
                "guidedFixPrompt": "Type LOW_LATENCY_MESSAGING_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "quant-d15-b2-messaging-engine-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Sub-Microsecond Latency & Cacheline Isolation Audit",
        "conceptBudget": {
          "primaryConcept": "Messaging Engine Invariant Audit",
          "supportingTerms": [
            "Zero Heap Malloc Invariant",
            "Zero False Sharing Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d15-b1-messaging-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "hft_audit_demo.js",
            "initialCode": "function auditHftMessagingSystem(zeroAllocPassed, cachelinesIsolated) {\n  const passed = zeroAllocPassed && cachelinesIsolated;\n  return {\n    zeroAllocationVerified: zeroAllocPassed,\n    cachelinesIsolated,\n    grade: passed ? 'HFT_MESSAGING_SYSTEM_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditHftMessagingSystem(true, true)));",
            "expectedOutput": "{\"zeroAllocationVerified\":true,\"cachelinesIsolated\":true,\"grade\":\"HFT_MESSAGING_SYSTEM_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when zero-allocation parsing and cacheline isolation pass 100%?",
          "expectedStringOutput": "HFT_MESSAGING_SYSTEM_AUDIT_PASSED",
          "acceptableAnswers": [
            "HFT_MESSAGING_SYSTEM_AUDIT_PASSED",
            "grade\":\"HFT_MESSAGING_SYSTEM_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_QUANT_ITCH_OUCH_BINARY_EXCHANGE_FEEDS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_QUANT_ITCH_OUCH_BINARY_EXCHANGE_FEEDS",
              "errorExplanation": "All checks passing awards HFT_MESSAGING_SYSTEM_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards HFT_MESSAGING_SYSTEM_AUDIT_PASSED.",
                "guidedFixPrompt": "Type HFT_MESSAGING_SYSTEM_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "quant-d15-b3-milestone2-quant-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Low-Latency Messaging Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Messaging Engine Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d15-b2-messaging-engine-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_quant_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Ultra-Low-Latency Order Messaging & Concurrency Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Ultra-Low-Latency Order Messaging & Concurrency Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Ultra-Low-Latency Order Messaging & Concurrency Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Ultra-Low-Latency Order Messaging & Concurrency Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_QUANT_ITCH_OUCH_BINARY_EXCHANGE_FEEDS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_QUANT_ITCH_OUCH_BINARY_EXCHANGE_FEEDS",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Ultra-Low-Latency Order Messaging & Concurrency Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "Option Pricing & Greeks: Black-Scholes-Merton (BSM) Analytical Engine",
    "overviewMetaphor": "Options Pricing is Calculating the Fair Price of an Insurance Policy on a Hurricane: a Call Option gives you the right (but not obligation) to buy a stock at $100 in 3 months; the Black-Scholes formula models the stock's random walk through geometric Brownian motion; the Greeks are the dashboard instruments of the airplane: Delta tells you how much your option moves for every $1 change in stock price; Gamma tells you how fast Delta accelerates; Vega tells you how sensitive your option is to market panic (Volatility).",
    "blocks": [
      {
        "id": "quant-d16-b1-black-scholes-pde-and-formula",
        "day": 16,
        "blockNumber": 1,
        "title": "The Black-Scholes-Merton PDE & Closed-Form Analytical Formulas",
        "conceptBudget": {
          "primaryConcept": "Black-Scholes-Merton Analytical Formulas",
          "supportingTerms": [
            "$C = S N(d_1) - K e^{-r T} N(d_2)$ (European Call)",
            "$P = K e^{-r T} N(-d_2) - S N(-d_1)$ (European Put)",
            "$d_1 = \\frac{\\ln(S/K) + (r + \\frac{1}{2}\\sigma^2)T}{\\sigma \\sqrt{T}}$",
            "$d_2 = d_1 - \\sigma \\sqrt{T}$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d14-b2-vectorized-black-scholes-kernel",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Black-Scholes Mathematical Inputs & Outputs",
              "boxes": [
                {
                  "label": "1. Market Inputs",
                  "value": "Spot S: $100 | Strike K: $100 | Time T: 1.0 yr | Rate r: 5% | Vol sigma: 20%",
                  "varType": "Input Parameters",
                  "isUpdated": false
                },
                {
                  "label": "2. Intermediate Variates",
                  "value": "d1 = 0.3500 | d2 = 0.1500 | N(d1) = 0.6368 | N(d2) = 0.5596",
                  "varType": "Normal CDF",
                  "isUpdated": false
                },
                {
                  "label": "3. European Call Price",
                  "value": "Formula: 100(0.6368) - 100(e^-0.05)(0.5596) = $10.45!",
                  "varType": "Calculated Option Price",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bsm_pricing_demo.js",
            "initialCode": "function evaluateBsmCall(S, K, T, r, sigma) {\n  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));\n  const d2 = d1 - sigma * Math.sqrt(T);\n  return {\n    spotPrice: S,\n    strikePrice: K,\n    d1: Number(d1.toFixed(4)),\n    d2: Number(d2.toFixed(4)),\n    status: 'BSM_VARIATES_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateBsmCall(100, 100, 1.0, 0.05, 0.20)));",
            "expectedOutput": "{\"spotPrice\":100,\"strikePrice\":100,\"d1\":0.35,\"d2\":0.15,\"status\":\"BSM_VARIATES_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the value of $d_1$ for an at-the-money option with $S=100, K=100, T=1.0, r=0.05, \\sigma=0.20$?",
          "expectedStringOutput": "0.35",
          "acceptableAnswers": [
            "0.35",
            "0.3500",
            "d1\":0.35"
          ],
          "primaryMisconceptionId": "MC_QUANT_OPTION_PRICING_BLACK_SCHOLES_GREEKS",
          "diagnosisMap": {
            "0.15": {
              "misconceptionId": "MC_QUANT_OPTION_PRICING_BLACK_SCHOLES_GREEKS",
              "errorExplanation": "0.15 is d2 (d1 - sigma*sqrt(T)). d1 is 0.35.",
              "recoveryPath": {
                "simplerExplanation": "d1 = 0.35.",
                "guidedFixPrompt": "Type 0.35"
              }
            }
          }
        }
      },
      {
        "id": "quant-d16-b2-first-order-greeks-delta-vega-theta",
        "day": 16,
        "blockNumber": 2,
        "title": "First-Order Greeks: Delta ($\\Delta$), Vega ($\\mathcal{V}$), Theta ($\\Theta$) and Rho ($\\rho$)",
        "conceptBudget": {
          "primaryConcept": "First-Order Greeks Interpretation",
          "supportingTerms": [
            "Delta ($\\Delta = \\frac{\\partial C}{\\partial S} = N(d_1) \\in [0, 1]$: Hedge ratio)",
            "Vega ($\\mathcal{V} = \\frac{\\partial C}{\\partial \\sigma} = S \\sqrt{T} N'(d_1)$: Sensitivity to 1% volatility change)",
            "Theta ($\\Theta = \\frac{\\partial C}{\\partial T}$: Time decay per calendar day)",
            "Delta-Hedging"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d16-b1-black-scholes-pde-and-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "greeks_demo.js",
            "initialCode": "function evaluateDeltaHedge(sharesHeld, optionDelta, optionContracts) {\n  const sharesToShort = Math.round(optionContracts * 100 * optionDelta);\n  return {\n    longOptionContracts: optionContracts,\n    callDelta: optionDelta,\n    shortSharesForDeltaNeutral: sharesToShort,\n    netPortfolioDelta: 0.0,\n    status: 'DELTA_NEUTRAL_HEDGED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateDeltaHedge(0, 0.60, 10))); // 10 contracts (1000 shares) * 0.60 = short 600 shares",
            "expectedOutput": "{\"longOptionContracts\":10,\"callDelta\":0.6,\"shortSharesForDeltaNeutral\":600,\"netPortfolioDelta\":0,\"status\":\"DELTA_NEUTRAL_HEDGED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many underlying shares must be shorted to create a delta-neutral hedge for 10 long call option contracts (1,000 shares total) with a Delta of 0.60 ($1000 \\times 0.60$)?",
          "expectedStringOutput": "600",
          "acceptableAnswers": [
            "600",
            "600 shares",
            "shortSharesForDeltaNeutral\":600"
          ],
          "primaryMisconceptionId": "MC_QUANT_OPTION_PRICING_BLACK_SCHOLES_GREEKS",
          "diagnosisMap": {
            "60": {
              "misconceptionId": "MC_QUANT_OPTION_PRICING_BLACK_SCHOLES_GREEKS",
              "errorExplanation": "1 option contract controls 100 shares; 10 contracts = 1,000 shares * 0.60 = 600 shares.",
              "recoveryPath": {
                "simplerExplanation": "1000 * 0.60 = 600.",
                "guidedFixPrompt": "Type 600"
              }
            }
          }
        }
      },
      {
        "id": "quant-d16-b3-second-order-greeks-gamma-vanna-volga",
        "day": 16,
        "blockNumber": 3,
        "title": "Second-Order Greeks: Gamma ($\\Gamma$) & Gamma Squeezes",
        "conceptBudget": {
          "primaryConcept": "Second-Order Greek Gamma",
          "supportingTerms": [
            "Gamma ($\\Gamma = \\frac{\\partial^2 C}{\\partial S^2} = \\frac{N'(d_1)}{S \\sigma \\sqrt{T}}$: Rate of change of Delta)",
            "Gamma Squeeze (Market makers forced to aggressively buy stock as Delta expands towards 1.0)",
            "Peak At-The-Money Gamma"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d16-b2-first-order-greeks-delta-vega-theta",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "gamma_squeeze_demo.js",
            "initialCode": "function evaluateGammaRisk(isNearExpiryAtm) {\n  return isNearExpiryAtm\n    ? 'EXPLOSIVE_GAMMA_RISK: DELTA_SWINGS_WILDLY_ACROSS_EXPIRATION'\n    : 'STABLE_LOW_GAMMA_REGIME';\n}\n\nconsole.log(evaluateGammaRisk(true));\nconsole.log(evaluateGammaRisk(false));",
            "expectedOutput": "EXPLOSIVE_GAMMA_RISK: DELTA_SWINGS_WILDLY_ACROSS_EXPIRATION\nSTABLE_LOW_GAMMA_REGIME",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What risk profile describes an at-the-money option approaching immediate expiration ($T \\to 0$)?",
          "expectedStringOutput": "EXPLOSIVE_GAMMA_RISK: DELTA_SWINGS_WILDLY_ACROSS_EXPIRATION",
          "acceptableAnswers": [
            "EXPLOSIVE_GAMMA_RISK: DELTA_SWINGS_WILDLY_ACROSS_EXPIRATION",
            "EXPLOSIVE_GAMMA_RISK"
          ],
          "primaryMisconceptionId": "MC_QUANT_OPTION_PRICING_BLACK_SCHOLES_GREEKS",
          "diagnosisMap": {
            "STABLE": {
              "misconceptionId": "MC_QUANT_OPTION_PRICING_BLACK_SCHOLES_GREEKS",
              "errorExplanation": "At-the-money near expiration produces explosive Gamma.",
              "recoveryPath": {
                "simplerExplanation": "Produces explosive Gamma risk.",
                "guidedFixPrompt": "Type EXPLOSIVE_GAMMA_RISK: DELTA_SWINGS_WILDLY_ACROSS_EXPIRATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "Implied Volatility Surface: Newton-Raphson Solver",
    "overviewMetaphor": "Implied Volatility is Weighing an Unknown Object by its Deflection on a Spring: you cannot directly observe the market's expected future volatility in the newspaper; but you CAN see that traders are paying $10.50 for a call option; using Newton-Raphson root finding, you work backward through the Black-Scholes formula until you find the exact volatility percentage (say 24.5%) that produces a $10.50 price; plotting this across all strikes creates the famous Volatility Smile.",
    "blocks": [
      {
        "id": "quant-d17-b1-implied-volatility-inversion-problem",
        "day": 17,
        "blockNumber": 1,
        "title": "The Implied Volatility Inversion Problem: No Closed-Form Inverse",
        "conceptBudget": {
          "primaryConcept": "Implied Volatility Inversion",
          "supportingTerms": [
            "Root Finding Formulation ($f(\\sigma) = C_{\\text{BS}}(\\sigma) - C_{\\text{market}} = 0$)",
            "Monotonicity of Option Price with respect to Volatility (Vega $\\mathcal{V} > 0$ everywhere $\\implies$ Guaranteed unique root!)",
            "Iterative Numerical Methods"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d16-b1-black-scholes-pde-and-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Forward Pricing vs Inverse IV Recovery",
              "boxes": [
                {
                  "label": "1. Forward Black-Scholes",
                  "value": "Input: $\\sigma = 20\\%$ | Formula: Closed-form analytical | Output: Price = $10.45 (EASY)",
                  "varType": "Forward Closed-Form",
                  "isUpdated": false
                },
                {
                  "label": "2. Inverse Implied Volatility",
                  "value": "Input: Price = $10.45 | Formula: NO CLOSED-FORM INVERSE EXISTS! | Solution: Iterative Newton-Raphson",
                  "varType": "Inverse Root Finding",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "iv_root_demo.js",
            "initialCode": "function evaluateRootMonotonicity() {\n  return {\n    vegaProperty: 'Vega > 0 everywhere for standard European options',\n    rootUniqueness: 'Guaranteed single unique solution for implied volatility',\n    algorithm: 'NEWTON_RAPHSON_QUADRATIC_CONVERGENCE'\n  };\n}\n\nconsole.log(evaluateRootMonotonicity().algorithm);",
            "expectedOutput": "NEWTON_RAPHSON_QUADRATIC_CONVERGENCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which numerical algorithm provides quadratic convergence when inverting Black-Scholes market option prices for implied volatility?",
          "expectedStringOutput": "NEWTON_RAPHSON_QUADRATIC_CONVERGENCE",
          "acceptableAnswers": [
            "NEWTON_RAPHSON_QUADRATIC_CONVERGENCE",
            "Newton-Raphson",
            "NEWTON_RAPHSON"
          ],
          "primaryMisconceptionId": "MC_QUANT_IMPLIED_VOLATILITY_SURFACE_NEWTON_RAPHSON",
          "diagnosisMap": {
            "BISECTION": {
              "misconceptionId": "MC_QUANT_IMPLIED_VOLATILITY_SURFACE_NEWTON_RAPHSON",
              "errorExplanation": "Bisection converges linearly; Newton-Raphson converges quadratically.",
              "recoveryPath": {
                "simplerExplanation": "Newton-Raphson converges quadratically.",
                "guidedFixPrompt": "Type NEWTON_RAPHSON_QUADRATIC_CONVERGENCE"
              }
            }
          }
        }
      },
      {
        "id": "quant-d17-b2-newton-raphson-iv-update-step",
        "day": 17,
        "blockNumber": 2,
        "title": "Newton-Raphson Iterative Step: Dividing Price Error by Vega",
        "conceptBudget": {
          "primaryConcept": "Newton-Raphson IV Update Step",
          "supportingTerms": [
            "$\\sigma_{n+1} = \\sigma_n - \\frac{C(\\sigma_n) - C_{\\text{market}}}{\\mathcal{V}(\\sigma_n)}$",
            "Vega as First Derivative ($f'(\\sigma) = \\mathcal{V}$)",
            "Convergence Criterion ($|C(\\sigma_n) - C_{\\text{market}}| < 10^{-4}$ in 4 to 6 iterations)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d17-b1-implied-volatility-inversion-problem",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Newton-Raphson IV Loop in C++",
            "codeSnippet": "double sigma = 0.20; // Initial guess\nfor (int iter = 0; iter < 10; ++iter) {\n  double price = black_scholes_call(S, K, T, r, sigma);\n  double diff = price - market_price;\n  if (std::abs(diff) < 1e-4) break; // Converged!\n  double vega = black_scholes_vega(S, K, T, r, sigma);\n  sigma -= diff / vega; // Newton-Raphson step!\n}",
            "lineNotes": {
              "4": "Computes pricing error.",
              "7": "Updates volatility guess using Vega derivative."
            }
          },
          {
            "type": "runnable_code",
            "filename": "nr_step_demo.js",
            "initialCode": "function executeNrStep(currentSigma, priceError, vega) {\n  const nextSigma = currentSigma - (priceError / vega);\n  return {\n    currentSigma,\n    priceError,\n    vega,\n    nextSigma: Number(nextSigma.toFixed(4)),\n    status: 'NR_STEP_EXECUTED'\n  };\n}\n\nconsole.log(JSON.stringify(executeNrStep(0.20, 0.50, 25.0))); // diff=0.50, vega=25 -> step = -0.02 -> 0.18",
            "expectedOutput": "{\"currentSigma\":0.2,\"priceError\":0.5,\"vega\":25,\"nextSigma\":0.18,\"status\":\"NR_STEP_EXECUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the updated volatility estimate when current guess is $\\sigma=0.20$, price error is $+0.50$, and Vega is $25.0$ ($0.20 - 0.50 / 25$)?",
          "expectedStringOutput": "0.18",
          "acceptableAnswers": [
            "0.18",
            "0.1800",
            "nextSigma\":0.18"
          ],
          "primaryMisconceptionId": "MC_QUANT_IMPLIED_VOLATILITY_SURFACE_NEWTON_RAPHSON",
          "diagnosisMap": {
            "0.22": {
              "misconceptionId": "MC_QUANT_IMPLIED_VOLATILITY_SURFACE_NEWTON_RAPHSON",
              "errorExplanation": "Price error is positive (+0.50), so volatility must be reduced: 0.20 - (0.50 / 25) = 0.18.",
              "recoveryPath": {
                "simplerExplanation": "0.20 - 0.02 = 0.18.",
                "guidedFixPrompt": "Type 0.18"
              }
            }
          }
        }
      },
      {
        "id": "quant-d17-b3-volatility-smile-and-skew",
        "day": 17,
        "blockNumber": 3,
        "title": "The Volatility Smile & Equity Skew (Crashophobia)",
        "conceptBudget": {
          "primaryConcept": "Volatility Smile & Skew Structure",
          "supportingTerms": [
            "Equity Skew (Downside OTM puts have higher IV than OTM calls due to crash protection demand)",
            "FX Smile (Both OTM puts and calls have elevated IV due to fat tails)",
            "SVI (Stochastic Volatility Inspired) Parametrization"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d17-b2-newton-raphson-iv-update-step",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "vol_skew_demo.js",
            "initialCode": "function evaluateVolSkew(otmPutIv, atmIv, otmCallIv) {\n  const isEquitySkew = (otmPutIv > atmIv) && (atmIv > otmCallIv);\n  return isEquitySkew\n    ? 'EQUITY_VOLATILITY_SKEW: DOWNSIDE_CRASH_PROTECTION_PREMIUM_EVIDENT'\n    : 'SYMMETRIC_VOLATILITY_SMILE';\n}\n\nconsole.log(evaluateVolSkew(0.28, 0.20, 0.16));",
            "expectedOutput": "EQUITY_VOLATILITY_SKEW: DOWNSIDE_CRASH_PROTECTION_PREMIUM_EVIDENT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What market structure describes an options chain where OTM Puts have 28% IV, ATM options have 20% IV, and OTM Calls have 16% IV?",
          "expectedStringOutput": "EQUITY_VOLATILITY_SKEW: DOWNSIDE_CRASH_PROTECTION_PREMIUM_EVIDENT",
          "acceptableAnswers": [
            "EQUITY_VOLATILITY_SKEW: DOWNSIDE_CRASH_PROTECTION_PREMIUM_EVIDENT",
            "EQUITY_VOLATILITY_SKEW",
            "Equity Skew"
          ],
          "primaryMisconceptionId": "MC_QUANT_IMPLIED_VOLATILITY_SURFACE_NEWTON_RAPHSON",
          "diagnosisMap": {
            "SMILE": {
              "misconceptionId": "MC_QUANT_IMPLIED_VOLATILITY_SURFACE_NEWTON_RAPHSON",
              "errorExplanation": "A downward slope from OTM put to OTM call is an equity skew.",
              "recoveryPath": {
                "simplerExplanation": "Matches EQUITY_VOLATILITY_SKEW: DOWNSIDE_CRASH_PROTECTION_PREMIUM_EVIDENT.",
                "guidedFixPrompt": "Type EQUITY_VOLATILITY_SKEW: DOWNSIDE_CRASH_PROTECTION_PREMIUM_EVIDENT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Risk Management: Parametric & Historical Value at Risk (VaR)",
    "overviewMetaphor": "Value at Risk (VaR) is a Dam Engineer Stating 'In 99 out of 100 Days, the Water Level Will Not Rise More Than 10 Feet': a quantitative hedge fund holding $100 Million needs to tell risk regulators how much money they could lose tomorrow; 1-Day 99% VaR says: 'We are 99% confident that our worst loss tomorrow will not exceed $2.5 Million'; Parametric VaR uses the standard normal bell curve; Historical VaR replays actual market crashes from the past 500 trading days.",
    "blocks": [
      {
        "id": "quant-d18-b1-parametric-normal-var-formula",
        "day": 18,
        "blockNumber": 1,
        "title": "Parametric (Variance-Covariance) Normal VaR Formulation",
        "conceptBudget": {
          "primaryConcept": "Parametric Normal VaR Formulation",
          "supportingTerms": [
            "$\\text{VaR}_\\alpha = \\text{Notional} \\cdot Z_\\alpha \\cdot \\sigma \\cdot \\sqrt{\\Delta t}$",
            "$Z_{0.95} = 1.645$ (95% confidence)",
            "$Z_{0.99} = 2.326$ (99% confidence standard in Basel III banking regulations)",
            "Time Scaling (Square-root-of-time rule $\\sqrt{10\\text{ days}}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d16-b1-black-scholes-pde-and-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Parametric VaR 99% Calculation ($1M Portfolio, 2% Daily Vol)",
              "boxes": [
                {
                  "label": "Portfolio Notional",
                  "value": "$1,000,000 | Daily Sigma: 0.02 (2.0%)",
                  "varType": "Notional Asset",
                  "isUpdated": false
                },
                {
                  "label": "Z-Score (99%)",
                  "value": "2.326 standard deviations from mean",
                  "varType": "Statistical Quantile",
                  "isUpdated": false
                },
                {
                  "label": "Calculated 1-Day 99% VaR",
                  "value": "Formula: $1,000,000 * 2.326 * 0.02 = $46,520 (Max loss on 99% of days!)",
                  "varType": "VaR Limit",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "var_calc_demo.js",
            "initialCode": "function calculate1DayVar(notional, dailySigma, conf = 0.99) {\n  const z = (conf === 0.99) ? 2.326 : 1.645;\n  const varLoss = notional * z * dailySigma;\n  return {\n    portfolioNotional: notional,\n    confidenceLevel: conf,\n    max1DayExpectedLossDollars: Number(varLoss.toFixed(2)),\n    status: 'PARAMETRIC_VAR_COMPUTED'\n  };\n}\n\nconsole.log(JSON.stringify(calculate1DayVar(1000000, 0.02, 0.99)));",
            "expectedOutput": "{\"portfolioNotional\":1000000,\"confidenceLevel\":0.99,\"max1DayExpectedLossDollars\":46520,\"status\":\"PARAMETRIC_VAR_COMPUTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the 1-Day 99% Parametric VaR for a $1,000,000 portfolio with a 2% daily volatility ($1000000 \\times 2.326 \\times 0.02$)?",
          "expectedStringOutput": "46520",
          "acceptableAnswers": [
            "46520",
            "$46,520",
            "46520.00",
            "max1DayExpectedLossDollars\":46520"
          ],
          "primaryMisconceptionId": "MC_QUANT_VALUE_AT_RISK_VAR_HISTORICAL_PARAMETRIC",
          "diagnosisMap": {
            "20000": {
              "misconceptionId": "MC_QUANT_VALUE_AT_RISK_VAR_HISTORICAL_PARAMETRIC",
              "errorExplanation": "$20,000 is 1 standard deviation. 99% VaR requires multiplying by Z=2.326 -> $46,520.",
              "recoveryPath": {
                "simplerExplanation": "1000000 * 2.326 * 0.02 = 46520.",
                "guidedFixPrompt": "Type 46520"
              }
            }
          }
        }
      },
      {
        "id": "quant-d18-b2-historical-simulation-var",
        "day": 18,
        "blockNumber": 2,
        "title": "Historical Simulation VaR: Non-Parametric Percentiles",
        "conceptBudget": {
          "primaryConcept": "Historical Simulation VaR",
          "supportingTerms": [
            "Replaying 500 Historical Days of PnL",
            "Sorting Returns from Worst to Best",
            "1st Percentile Extraction (Worst 5th loss out of 500 days)",
            "Capturing Non-Normal Fat Tails"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d18-b1-parametric-normal-var-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "hist_var_demo.js",
            "initialCode": "function getHistoricalVar(sortedPnLListAsc, confidence = 0.99) {\n  const index = Math.floor(sortedPnLListAsc.length * (1 - confidence));\n  const varLoss = Math.abs(sortedPnLListAsc[index]);\n  return {\n    observationsCount: sortedPnLListAsc.length,\n    percentileIndex: index,\n    historicalVarDollars: varLoss,\n    status: 'HISTORICAL_VAR_EVALUATED'\n  };\n}\n\nconst samplePnLs = [-50000, -30000, -20000, -10000, 5000, 12000, 25000];\nconsole.log(JSON.stringify(getHistoricalVar(samplePnLs, 0.90)));",
            "expectedOutput": "{\"observationsCount\":7,\"percentileIndex\":0,\"historicalVarDollars\":50000,\"status\":\"HISTORICAL_VAR_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the historical VaR loss at index 0 from the sorted PnL array `[-50000, -30000, ...]`?",
          "expectedStringOutput": "50000",
          "acceptableAnswers": [
            "50000",
            "$50,000",
            "historicalVarDollars\":50000"
          ],
          "primaryMisconceptionId": "MC_QUANT_VALUE_AT_RISK_VAR_HISTORICAL_PARAMETRIC",
          "diagnosisMap": {
            "-50000": {
              "misconceptionId": "MC_QUANT_VALUE_AT_RISK_VAR_HISTORICAL_PARAMETRIC",
              "errorExplanation": "VaR is reported as a positive loss quantity ($50,000).",
              "recoveryPath": {
                "simplerExplanation": "Reported as positive loss $50,000.",
                "guidedFixPrompt": "Type 50000"
              }
            }
          }
        }
      },
      {
        "id": "quant-d18-b3-var-blindspot-tail-risk",
        "day": 18,
        "blockNumber": 3,
        "title": "The Fatal VaR Blindspot: Ignoring Tail Severity Beyond the Quantile",
        "conceptBudget": {
          "primaryConcept": "VaR Subadditivity Failure",
          "supportingTerms": [
            "VaR Blindspot: VaR only tells you the boundary, NOT how deep the loss is when a breach occurs!",
            "Non-Subadditivity (Merging two portfolios can produce a combined VaR greater than the sum of parts: $\\text{VaR}(A+B) > \\text{VaR}(A) + \\text{VaR}(B)$)",
            "The Need for Expected Shortfall (CVaR)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d18-b2-historical-simulation-var",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "var_blindspot_demo.js",
            "initialCode": "function evaluateRiskMetricType(metricName) {\n  if (metricName === 'VaR') return 'VAR_LIMITATION: BLIND_TO_WORST_CASE_TAIL_LOSSES';\n  if (metricName === 'CVaR') return 'CVAR_COHERENT: MEASURES_AVERAGE_TAIL_SEVERITY';\n  return 'UNKNOWN';\n}\n\nconsole.log(evaluateRiskMetricType('VaR'));\nconsole.log(evaluateRiskMetricType('CVaR'));",
            "expectedOutput": "VAR_LIMITATION: BLIND_TO_WORST_CASE_TAIL_LOSSES\nCVAR_COHERENT: MEASURES_AVERAGE_TAIL_SEVERITY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What critical limitation is inherent to standard Value at Risk (VaR)?",
          "expectedStringOutput": "VAR_LIMITATION: BLIND_TO_WORST_CASE_TAIL_LOSSES",
          "acceptableAnswers": [
            "VAR_LIMITATION: BLIND_TO_WORST_CASE_TAIL_LOSSES",
            "BLIND_TO_WORST_CASE_TAIL_LOSSES"
          ],
          "primaryMisconceptionId": "MC_QUANT_VALUE_AT_RISK_VAR_HISTORICAL_PARAMETRIC",
          "diagnosisMap": {
            "COHERENT": {
              "misconceptionId": "MC_QUANT_VALUE_AT_RISK_VAR_HISTORICAL_PARAMETRIC",
              "errorExplanation": "VaR is blind to the magnitude of losses beyond the cutoff.",
              "recoveryPath": {
                "simplerExplanation": "Matches VAR_LIMITATION: BLIND_TO_WORST_CASE_TAIL_LOSSES.",
                "guidedFixPrompt": "Type VAR_LIMITATION: BLIND_TO_WORST_CASE_TAIL_LOSSES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Tail Risk & Expected Shortfall (CVaR / Conditional VaR)",
    "overviewMetaphor": "Expected Shortfall is Asking 'If the Dam Breaks, How Deep is the Flood?': VaR tells you the dam will hold on 99 out of 100 days; but what happens on that 1 day when a category 5 hurricane hits? Expected Shortfall (CVaR) averages the catastrophic losses on all days that breach the VaR threshold; CVaR is a Coherent Risk Measure mandated by the Basel Committee—preventing traders from hiding radioactive tail risk behind short out-of-the-money put options.",
    "blocks": [
      {
        "id": "quant-d19-b1-cvar-expected-shortfall-formula",
        "day": 19,
        "blockNumber": 1,
        "title": "Conditional Value at Risk (CVaR) Formulation & Integral Tail Average",
        "conceptBudget": {
          "primaryConcept": "Expected Shortfall (CVaR) Mathematical Definition",
          "supportingTerms": [
            "$\\text{ES}_\\alpha = \\text{CVaR}_\\alpha = E[L \\mid L \\ge \\text{VaR}_\\alpha] = \\frac{1}{1 - \\alpha} \\int_\\alpha^1 \\text{VaR}_u \\, du$",
            "Average Tail Loss",
            "Basel Committee Fundamental Review of the Trading Book (FRTB) Mandate"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d18-b3-var-blindspot-tail-risk",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "VaR vs CVaR on 100 Worst Loss Observations",
              "boxes": [
                {
                  "label": "1. 99% VaR Cutoff (Item #1)",
                  "value": "Loss Threshold: $100,000 | Meaning: 99% of losses are smaller than $100k",
                  "varType": "Threshold Quantile",
                  "isUpdated": false
                },
                {
                  "label": "2. The Tail Losses (Worst 1%)",
                  "value": "Loss 1: $100k | Loss 2: $250k | Loss 3: $850k (Black Swan Crash!)",
                  "varType": "Tail Events",
                  "isUpdated": false
                },
                {
                  "label": "3. Calculated Expected Shortfall (CVaR)",
                  "value": "Formula: Average($100k, $250k, $850k) = $400,000! (4X higher than VaR!)",
                  "varType": "Coherent Tail Risk",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cvar_calc_demo.js",
            "initialCode": "function evaluateTailRisk(worstLosses) {\n  const avgTailLoss = worstLosses.reduce((a, b) => a + b, 0) / worstLosses.length;\n  return {\n    tailLossCount: worstLosses.length,\n    varThreshold: worstLosses[0],\n    expectedShortfallCvar: Number(avgTailLoss.toFixed(2)),\n    status: 'CVAR_COHERENT_TAIL_EVALUATED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateTailRisk([100000, 250000, 850000])));",
            "expectedOutput": "{\"tailLossCount\":3,\"varThreshold\":100000,\"expectedShortfallCvar\":400000,\"status\":\"CVAR_COHERENT_TAIL_EVALUATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Expected Shortfall (CVaR) when the losses beyond the 99% VaR threshold are $100,000, $250,000, and $850,000 ($1200000 / 3$)?",
          "expectedStringOutput": "400000",
          "acceptableAnswers": [
            "400000",
            "$400,000",
            "400000.00",
            "expectedShortfallCvar\":400000"
          ],
          "primaryMisconceptionId": "MC_QUANT_EXPECTED_SHORTFALL_CVAR_TAIL_RISK",
          "diagnosisMap": {
            "100000": {
              "misconceptionId": "MC_QUANT_EXPECTED_SHORTFALL_CVAR_TAIL_RISK",
              "errorExplanation": "$100,000 is the VaR boundary. CVaR averages all losses beyond the boundary: 1,200,000 / 3 = $400,000.",
              "recoveryPath": {
                "simplerExplanation": "1200000 / 3 = 400000.",
                "guidedFixPrompt": "Type 400000"
              }
            }
          }
        }
      },
      {
        "id": "quant-d19-b2-coherent-risk-measures-subadditivity",
        "day": 19,
        "blockNumber": 2,
        "title": "Coherent Risk Measures: Subadditivity ($R(X+Y) \\le R(X) + R(Y)$)",
        "conceptBudget": {
          "primaryConcept": "Axioms of Coherent Risk Measures",
          "supportingTerms": [
            "Subadditivity: $\\rho(X + Y) \\le \\rho(X) + \\rho(Y)$ (Diversification always reduces risk!)",
            "Monotonicity ($X \\le Y \\implies \\rho(X) \\ge \\rho(Y)$)",
            "Translation Invariance & Positive Homogeneity",
            "CVaR is Coherent; VaR is NOT Coherent!"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d19-b1-cvar-expected-shortfall-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "coherence_demo.js",
            "initialCode": "function evaluateCoherence(riskMetric) {\n  if (riskMetric === 'CVaR') return 'COHERENT_RISK_MEASURE_SUBADDITIVITY_GUARANTEED';\n  if (riskMetric === 'VaR') return 'NON_COHERENT_SUBADDITIVITY_VIOLATION_POSSIBLE';\n  return 'UNKNOWN';\n}\n\nconsole.log(evaluateCoherence('CVaR'));\nconsole.log(evaluateCoherence('VaR'));",
            "expectedOutput": "COHERENT_RISK_MEASURE_SUBADDITIVITY_GUARANTEED\nNON_COHERENT_SUBADDITIVITY_VIOLATION_POSSIBLE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Why is Expected Shortfall (CVaR) preferred over VaR by international banking regulators under FRTB?",
          "expectedStringOutput": "COHERENT_RISK_MEASURE_SUBADDITIVITY_GUARANTEED",
          "acceptableAnswers": [
            "COHERENT_RISK_MEASURE_SUBADDITIVITY_GUARANTEED",
            "COHERENT",
            "Subadditive"
          ],
          "primaryMisconceptionId": "MC_QUANT_EXPECTED_SHORTFALL_CVAR_TAIL_RISK",
          "diagnosisMap": {
            "NON_COHERENT": {
              "misconceptionId": "MC_QUANT_EXPECTED_SHORTFALL_CVAR_TAIL_RISK",
              "errorExplanation": "CVaR satisfies subadditivity, guaranteeing that diversification reduces risk.",
              "recoveryPath": {
                "simplerExplanation": "Matches COHERENT_RISK_MEASURE_SUBADDITIVITY_GUARANTEED.",
                "guidedFixPrompt": "Type COHERENT_RISK_MEASURE_SUBADDITIVITY_GUARANTEED"
              }
            }
          }
        }
      },
      {
        "id": "quant-d19-b3-fat-tail-distributions-student-t",
        "day": 19,
        "blockNumber": 3,
        "title": "Fat-Tailed Asset Distributions: Student-t vs Gaussian Kurtosis",
        "conceptBudget": {
          "primaryConcept": "Fat-Tailed Leptokurtic Distributions",
          "supportingTerms": [
            "Excess Kurtosis ($K > 3.0$ in real financial returns)",
            "Student-t Distribution (Degrees of freedom $\\nu = 4 - 6$ modeling fat crash tails)",
            "Gaussian Underestimation (Normal distribution underestimates a 6-sigma crash probability by $10^{15}\\times$!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d19-b2-coherent-risk-measures-subadditivity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "kurtosis_risk_demo.js",
            "initialCode": "function evaluateKurtosisRisk(kurtosis) {\n  return kurtosis > 3.0\n    ? 'LEPTOKURTIC_FAT_TAILED_DISTRIBUTION_HIGH_CRASH_RISK'\n    : 'GAUSSIAN_MESOKURTIC_NORMAL';\n}\n\nconsole.log(evaluateKurtosisRisk(8.5)); // Real market return kurtosis\nconsole.log(evaluateKurtosisRisk(3.0)); // Gaussian normal",
            "expectedOutput": "LEPTOKURTIC_FAT_TAILED_DISTRIBUTION_HIGH_CRASH_RISK\nGAUSSIAN_MESOKURTIC_NORMAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What distribution profile describes market assets exhibiting an excess kurtosis of 8.5 ($K > 3.0$)?",
          "expectedStringOutput": "LEPTOKURTIC_FAT_TAILED_DISTRIBUTION_HIGH_CRASH_RISK",
          "acceptableAnswers": [
            "LEPTOKURTIC_FAT_TAILED_DISTRIBUTION_HIGH_CRASH_RISK",
            "LEPTOKURTIC",
            "Fat-Tailed"
          ],
          "primaryMisconceptionId": "MC_QUANT_EXPECTED_SHORTFALL_CVAR_TAIL_RISK",
          "diagnosisMap": {
            "NORMAL": {
              "misconceptionId": "MC_QUANT_EXPECTED_SHORTFALL_CVAR_TAIL_RISK",
              "errorExplanation": "Kurtosis > 3.0 indicates a leptokurtic fat-tailed distribution.",
              "recoveryPath": {
                "simplerExplanation": "Matches LEPTOKURTIC_FAT_TAILED_DISTRIBUTION_HIGH_CRASH_RISK.",
                "guidedFixPrompt": "Type LEPTOKURTIC_FAT_TAILED_DISTRIBUTION_HIGH_CRASH_RISK"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Portfolio Optimization: Modern Portfolio Theory (Markowitz Frontier)",
    "overviewMetaphor": "Portfolio Optimization is Building an Unsinkable Ship with Water-Tight Compartments: if you put all your cargo in one giant hold and it springs a leak, the ship sinks (100% stock concentration!); Modern Portfolio Theory (Harry Markowitz) proves that combining two risky assets with low correlation ($\rho < 0.3$) reduces total portfolio volatility without lowering your expected return; the Efficient Frontier represents the optimal boundary of portfolios offering the absolute highest return for any given level of risk.",
    "blocks": [
      {
        "id": "quant-d20-b1-markowitz-mean-variance-frontier",
        "day": 20,
        "blockNumber": 1,
        "title": "Modern Portfolio Theory: Mean-Variance Optimization & The Covariance Matrix ($\\Sigma$)",
        "conceptBudget": {
          "primaryConcept": "Mean-Variance Portfolio Optimization",
          "supportingTerms": [
            "Expected Portfolio Return: $R_p = \\mathbf{w}^T \\boldsymbol{\\mu}$",
            "Portfolio Variance: $\\sigma_p^2 = \\mathbf{w}^T \\boldsymbol{\\Sigma} \\mathbf{w}$",
            "Weight Budget Constraint ($\\sum w_i = 1$, $w_i \\ge 0$ for long-only)",
            "The Efficient Frontier Curve"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d18-b1-parametric-normal-var-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Diversification Volatility Reduction ($w_A = 0.5, w_B = 0.5$)",
              "boxes": [
                {
                  "label": "Asset A (Equities)",
                  "value": "Return: 10% | Volatility: 20% | Individual Risk: High",
                  "varType": "Asset A",
                  "isUpdated": false
                },
                {
                  "label": "Asset B (Bonds)",
                  "value": "Return: 6% | Volatility: 10% | Correlation rho = 0.0 (Zero correlation!)",
                  "varType": "Asset B",
                  "isUpdated": false
                },
                {
                  "label": "Combined 50/50 Portfolio",
                  "value": "Return: 8.0% | Portfolio Vol: 11.18% (Substantially lower than 15% simple average!)",
                  "varType": "Optimized Portfolio",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "mpt_calc_demo.js",
            "initialCode": "function calculateTwoAssetVariance(wA, sA, sB, rho) {\n  const wB = 1 - wA;\n  const variance = (wA * wA * sA * sA) + (wB * wB * sB * sB) + (2 * wA * wB * sA * sB * rho);\n  const vol = Math.sqrt(variance);\n  return {\n    weightA: wA,\n    weightB: wB,\n    portfolioVolatilityPercent: Number((vol * 100).toFixed(2)),\n    status: 'PORTFOLIO_VARIANCE_OPTIMIZED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateTwoAssetVariance(0.5, 0.20, 0.10, 0.0)));",
            "expectedOutput": "{\"weightA\":0.5,\"weightB\":0.5,\"portfolioVolatilityPercent\":11.18,\"status\":\"PORTFOLIO_VARIANCE_OPTIMIZED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the portfolio volatility percentage for a 50/50 mix of Asset A (20% vol) and Asset B (10% vol) with zero correlation ($\\rho = 0$)?",
          "expectedStringOutput": "11.18",
          "acceptableAnswers": [
            "11.18",
            "11.18%",
            "portfolioVolatilityPercent\":11.18"
          ],
          "primaryMisconceptionId": "MC_QUANT_PORTFOLIO_OPTIMIZATION_MARKOWITZ_FRONTIER",
          "diagnosisMap": {
            "15": {
              "misconceptionId": "MC_QUANT_PORTFOLIO_OPTIMIZATION_MARKOWITZ_FRONTIER",
              "errorExplanation": "15% is the arithmetic average. Due to zero covariance, the actual portfolio volatility is sqrt(0.01 + 0.0025) = 11.18%.",
              "recoveryPath": {
                "simplerExplanation": "sqrt(0.5^2*0.2^2 + 0.5^2*0.1^2) = 11.18%.",
                "guidedFixPrompt": "Type 11.18"
              }
            }
          }
        }
      },
      {
        "id": "quant-d20-b2-sharpe-ratio-tangency-portfolio",
        "day": 20,
        "blockNumber": 2,
        "title": "The Sharpe Ratio & The Tangency Maximum-Sharpe Portfolio",
        "conceptBudget": {
          "primaryConcept": "Sharpe Ratio Maximization",
          "supportingTerms": [
            "$\\text{Sharpe} = \\frac{R_p - R_f}{\\sigma_p}$",
            "Capital Allocation Line (CAL: Line drawn from risk-free rate $R_f$ tangent to the Efficient Frontier)",
            "Tangency Portfolio (The unique portfolio of risky assets maximizing risk-adjusted return)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d20-b1-markowitz-mean-variance-frontier",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Sharpe Ratio Maximization in Python / C++",
            "codeSnippet": "// Maximize Sharpe: (w.T * mu - r_f) / sqrt(w.T * Sigma * w)\nconst double sharpe = (portfolio_return - risk_free_rate) / portfolio_volatility;\nif (sharpe > max_sharpe) { max_sharpe = sharpe; best_weights = current_weights; }",
            "lineNotes": {
              "2": "Computes risk-adjusted return.",
              "3": "Tracks tangency optimal weights."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sharpe_tangency_demo.js",
            "initialCode": "function evaluateTangencySharpe(portReturn, portVol, rf = 0.02) {\n  const sharpe = (portReturn - rf) / portVol;\n  return {\n    expectedReturnPct: Number((portReturn * 100).toFixed(2)),\n    volatilityPct: Number((portVol * 100).toFixed(2)),\n    sharpeRatio: Number(sharpe.toFixed(2)),\n    status: 'TANGENCY_MAX_SHARPE_IDENTIFIED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateTangencySharpe(0.12, 0.10, 0.02)));",
            "expectedOutput": "{\"expectedReturnPct\":12,\"volatilityPct\":10,\"sharpeRatio\":1,\"status\":\"TANGENCY_MAX_SHARPE_IDENTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the Sharpe Ratio of a portfolio with 12% expected return, 10% volatility, and a 2% risk-free rate ($ (0.12 - 0.02) / 0.10 $)?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "1.0",
            "1.00",
            "sharpeRatio\":1"
          ],
          "primaryMisconceptionId": "MC_QUANT_PORTFOLIO_OPTIMIZATION_MARKOWITZ_FRONTIER",
          "diagnosisMap": {
            "1.2": {
              "misconceptionId": "MC_QUANT_PORTFOLIO_OPTIMIZATION_MARKOWITZ_FRONTIER",
              "errorExplanation": "Must subtract the 2% risk-free rate: (12% - 2%) / 10% = 1.0.",
              "recoveryPath": {
                "simplerExplanation": "(0.12 - 0.02) / 0.10 = 1.0.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "quant-d20-b3-quadratic-programming-solvers",
        "day": 20,
        "blockNumber": 3,
        "title": "Quadratic Programming (QP) Solvers: OSQP & Convex Optimization",
        "conceptBudget": {
          "primaryConcept": "Quadratic Programming Formulation",
          "supportingTerms": [
            "QP Formulation: $\\min \\frac{1}{2} \\mathbf{w}^T \\boldsymbol{\\Sigma} \\mathbf{w} - \\lambda \\mathbf{w}^T \\boldsymbol{\\mu}$ subject to $A \\mathbf{w} \\le \\mathbf{b}$",
            "OSQP (Operator Splitting Quadratic Program solver in C/C++)",
            "Sector / Factor Neutrality Constraints"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d20-b2-sharpe-ratio-tangency-portfolio",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "qp_solver_demo.js",
            "initialCode": "function evaluateQpStatus() {\n  return 'CONVEX_OPTIMIZATION_ACTIVE: OSQP_GLOBAL_OPTIMUM_SOLVED_SUB_MILLISECOND';\n}\n\nconsole.log(evaluateQpStatus());",
            "expectedOutput": "CONVEX_OPTIMIZATION_ACTIVE: OSQP_GLOBAL_OPTIMUM_SOLVED_SUB_MILLISECOND",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a convex quadratic programming solver found the globally optimal portfolio weights?",
          "expectedStringOutput": "CONVEX_OPTIMIZATION_ACTIVE: OSQP_GLOBAL_OPTIMUM_SOLVED_SUB_MILLISECOND",
          "acceptableAnswers": [
            "CONVEX_OPTIMIZATION_ACTIVE: OSQP_GLOBAL_OPTIMUM_SOLVED_SUB_MILLISECOND",
            "CONVEX_OPTIMIZATION_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_QUANT_PORTFOLIO_OPTIMIZATION_MARKOWITZ_FRONTIER",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_QUANT_PORTFOLIO_OPTIMIZATION_MARKOWITZ_FRONTIER",
              "errorExplanation": "Matches CONVEX_OPTIMIZATION_ACTIVE: OSQP_GLOBAL_OPTIMUM_SOLVED_SUB_MILLISECOND.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type CONVEX_OPTIMIZATION_ACTIVE: OSQP_GLOBAL_OPTIMUM_SOLVED_SUB_MILLISECOND"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Quantitative Pricing, Greeks & Risk Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete sovereign quantitative derivatives pricing, Greeks, and risk engine: 1. Analytical Black-Scholes pricing with first and second-order Greeks; 2. Newton-Raphson implied volatility surface solver; 3. 99% Parametric VaR and Expected Shortfall tail risk monitors; 4. Markowitz mean-variance portfolio optimizer.",
    "blocks": [
      {
        "id": "quant-d21-b1-quant-risk-engine-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Quantitative Pricing & Portfolio Risk Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Quant Pricing & Risk Engine Synthesis",
          "supportingTerms": [
            "BSM Analytical Greeks",
            "Newton-Raphson IV Solver",
            "Parametric 99% VaR",
            "Expected Shortfall Tail Risk"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d20-b2-sharpe-ratio-tangency-portfolio",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 3 Derivatives & Risk Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Consumes market option quotes and spot equity prices",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Inverts Black-Scholes via Newton-Raphson to construct Implied Volatility Surface",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Computes Delta, Gamma, Vega Greeks for all portfolio contracts",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Evaluates 99% VaR and Expected Shortfall limits -> Certifies risk compliance!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "quant_engine_demo.js",
            "initialCode": "function runQuantRiskEngine() {\n  return {\n    bsmPricingStatus: 'ANALYTICAL_GREEKS_EVALUATED',\n    ivSurfaceStatus: 'NEWTON_RAPHSON_CONVERGED',\n    varMonitorStatus: 'VAR99_CVAR_MONITORED',\n    engineStatus: 'QUANT_RISK_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runQuantRiskEngine().engineStatus);",
            "expectedOutput": "QUANT_RISK_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Quantitative Pricing & Risk Engine?",
          "expectedStringOutput": "QUANT_RISK_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "QUANT_RISK_ENGINE_ACTIVE",
            "engineStatus: QUANT_RISK_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_QUANT_OPTION_PRICING_BLACK_SCHOLES_GREEKS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_QUANT_OPTION_PRICING_BLACK_SCHOLES_GREEKS",
              "errorExplanation": "Matches QUANT_RISK_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches QUANT_RISK_ENGINE_ACTIVE.",
                "guidedFixPrompt": "Type QUANT_RISK_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "quant-d21-b2-quant-risk-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Risk Limits & Coherent Subadditivity Invariant Audit",
        "conceptBudget": {
          "primaryConcept": "Quant Risk Invariant Audit",
          "supportingTerms": [
            "Subadditive Tail Risk Invariant",
            "Zero Risk Breach Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d21-b1-quant-risk-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "quant_audit_demo.js",
            "initialCode": "function auditQuantRiskSystem(greeksCalculated, cvarMonitored) {\n  const passed = greeksCalculated && cvarMonitored;\n  return {\n    greeksCalculated,\n    cvarMonitored,\n    grade: passed ? 'QUANT_RISK_SYSTEM_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditQuantRiskSystem(true, true)));",
            "expectedOutput": "{\"greeksCalculated\":true,\"cvarMonitored\":true,\"grade\":\"QUANT_RISK_SYSTEM_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when Greeks calculation and CVaR tail risk monitoring pass 100%?",
          "expectedStringOutput": "QUANT_RISK_SYSTEM_AUDIT_PASSED",
          "acceptableAnswers": [
            "QUANT_RISK_SYSTEM_AUDIT_PASSED",
            "grade\":\"QUANT_RISK_SYSTEM_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_QUANT_OPTION_PRICING_BLACK_SCHOLES_GREEKS",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_QUANT_OPTION_PRICING_BLACK_SCHOLES_GREEKS",
              "errorExplanation": "All checks passing awards QUANT_RISK_SYSTEM_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards QUANT_RISK_SYSTEM_AUDIT_PASSED.",
                "guidedFixPrompt": "Type QUANT_RISK_SYSTEM_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "quant-d21-b3-milestone3-quant-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Quantitative Pricing & Risk Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Quant Risk Engine Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d21-b2-quant-risk-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_quant_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete Quantitative Pricing, Greeks & Risk Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete Quantitative Pricing, Greeks & Risk Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete Quantitative Pricing, Greeks & Risk Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete Quantitative Pricing, Greeks & Risk Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_QUANT_OPTION_PRICING_BLACK_SCHOLES_GREEKS",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_QUANT_OPTION_PRICING_BLACK_SCHOLES_GREEKS",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete Quantitative Pricing, Greeks & Risk Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "High-Frequency Alpha Signals & Statistical Arbitrage",
    "overviewMetaphor": "Statistical Arbitrage is a Drunk Man Walking a Dog on an Elastic Leash: both the man and the dog wander around randomly, so you cannot predict where either will walk next (Non-stationary price series!); but because they are connected by a strong rubber leash, whenever the dog runs too far ahead, the elastic tension pulls them back together (Cointegration!); statistical arbitrage algorithms detect when two related stocks (like Coke vs Pepsi or Chevron vs Exxon) stretch their price spread abnormally wide, shorting the expensive one and buying the cheap one until they snap back to equilibrium.",
    "blocks": [
      {
        "id": "quant-d22-b1-cointegration-vs-correlation",
        "day": 22,
        "blockNumber": 1,
        "title": "Cointegration vs Correlation: The Engle-Granger ADF Test",
        "conceptBudget": {
          "primaryConcept": "Cointegration vs Correlation",
          "supportingTerms": [
            "Spurious Correlation (Two stocks trending up over 10 years appear correlated but can diverge forever!)",
            "Cointegration ($S_t = P_{A,t} - \\beta P_{B,t} \\sim I(0)$: Linear combination creates a stationary mean-reverting spread)",
            "Augmented Dickey-Fuller (ADF) Unit Root Test",
            "Hedge Ratio ($\\beta = \\frac{\\text{Cov}(A, B)}{\\text{Var}(B)}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d7-b3-short-term-alpha-signal-generation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Correlation vs Cointegration Behavior",
              "boxes": [
                {
                  "label": "Correlation Fallacy ($r = 0.95$)",
                  "value": "Stock A: $100 -> $200 | Stock B: $100 -> $150 | Diverged by $50! Never mean-reverts!",
                  "varType": "Spurious Correlation",
                  "isUpdated": false
                },
                {
                  "label": "Cointegration ($I(0)$ Stationary)",
                  "value": "Spread = A - 1.5*B | Bound: Stays pinned around Mean=0 with standard deviation=2.0!",
                  "varType": "Mean-Reverting Spread",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cointegration_demo.js",
            "initialCode": "function evaluatePairStationarity(adfPValue) {\n  return adfPValue < 0.05\n    ? 'COINTEGRATION_CONFIRMED: SPREAD_IS_STATIONARY_MEAN_REVERTING'\n    : 'SPURIOUS_CORRELATION_NON_STATIONARY_REJECTED';\n}\n\nconsole.log(evaluatePairStationarity(0.01)); // Cointegrated!\nconsole.log(evaluatePairStationarity(0.35)); // Spurious!",
            "expectedOutput": "COINTEGRATION_CONFIRMED: SPREAD_IS_STATIONARY_MEAN_REVERTING\nSPURIOUS_CORRELATION_NON_STATIONARY_REJECTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is awarded to a stock pair when the Augmented Dickey-Fuller (ADF) test yields a p-value of 0.01 ($p < 0.05$)?",
          "expectedStringOutput": "COINTEGRATION_CONFIRMED: SPREAD_IS_STATIONARY_MEAN_REVERTING",
          "acceptableAnswers": [
            "COINTEGRATION_CONFIRMED: SPREAD_IS_STATIONARY_MEAN_REVERTING",
            "COINTEGRATION_CONFIRMED"
          ],
          "primaryMisconceptionId": "MC_QUANT_STATISTICAL_ARBITRAGE_COINTEGRATION_PAIRS",
          "diagnosisMap": {
            "SPURIOUS": {
              "misconceptionId": "MC_QUANT_STATISTICAL_ARBITRAGE_COINTEGRATION_PAIRS",
              "errorExplanation": "p < 0.05 rejects unit root, confirming stationary cointegration.",
              "recoveryPath": {
                "simplerExplanation": "Matches COINTEGRATION_CONFIRMED: SPREAD_IS_STATIONARY_MEAN_REVERTING.",
                "guidedFixPrompt": "Type COINTEGRATION_CONFIRMED: SPREAD_IS_STATIONARY_MEAN_REVERTING"
              }
            }
          }
        }
      },
      {
        "id": "quant-d22-b2-zscore-pairs-trading-signals",
        "day": 22,
        "blockNumber": 2,
        "title": "Z-Score Spread Signals & Bollinger Band Entry / Exit Thresholds",
        "conceptBudget": {
          "primaryConcept": "Z-Score Spread Trading Signal",
          "supportingTerms": [
            "$Z = \\frac{\\text{Spread}_t - \\mu}{\\sigma}$",
            "Entry Threshold ($|Z| \\ge 2.0$ standard deviations)",
            "Exit Threshold ($|Z| \\le 0.5$ or crossing mean $\\mu = 0$)",
            "Stop-Loss Threshold ($|Z| \\ge 4.0$ indicating permanent structural break!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d22-b1-cointegration-vs-correlation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Pairs Trading Signal Generator",
            "codeSnippet": "double spread = price_a - (beta * price_b);\ndouble z_score = (spread - rolling_mean) / rolling_std;\nif (z_score >= 2.0) signal = SHORT_SPREAD; // Sell A, Buy B\nelse if (z_score <= -2.0) signal = LONG_SPREAD; // Buy A, Sell B\nelse if (std::abs(z_score) <= 0.2) signal = CLOSE_POSITION;",
            "lineNotes": {
              "1": "Calculates synthetic spread.",
              "2": "Normalizes to Z-score.",
              "3": "Executes statistical arbitrage trades."
            }
          },
          {
            "type": "runnable_code",
            "filename": "zscore_signal_demo.js",
            "initialCode": "function evaluateZScoreTrade(z) {\n  if (z >= 2.0) return 'SHORT_SPREAD_SELL_A_BUY_B';\n  if (z <= -2.0) return 'LONG_SPREAD_BUY_A_SELL_B';\n  if (Math.abs(z) <= 0.2) return 'EXIT_AND_TAKE_PROFIT';\n  return 'HOLD';\n}\n\nconsole.log(evaluateZScoreTrade(2.5));\nconsole.log(evaluateZScoreTrade(-2.8));\nconsole.log(evaluateZScoreTrade(0.1));",
            "expectedOutput": "SHORT_SPREAD_SELL_A_BUY_B\nLONG_SPREAD_BUY_A_SELL_B\nEXIT_AND_TAKE_PROFIT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What trading action is triggered when the spread Z-score reverts back to $Z = +0.10$ ($|Z| \\le 0.2$)?",
          "expectedStringOutput": "EXIT_AND_TAKE_PROFIT",
          "acceptableAnswers": [
            "EXIT_AND_TAKE_PROFIT",
            "CLOSE_POSITION",
            "EXIT"
          ],
          "primaryMisconceptionId": "MC_QUANT_STATISTICAL_ARBITRAGE_COINTEGRATION_PAIRS",
          "diagnosisMap": {
            "HOLD": {
              "misconceptionId": "MC_QUANT_STATISTICAL_ARBITRAGE_COINTEGRATION_PAIRS",
              "errorExplanation": "Mean reversion to 0.1 triggers position closing to lock in profit.",
              "recoveryPath": {
                "simplerExplanation": "Exits position on mean reversion -> EXIT_AND_TAKE_PROFIT.",
                "guidedFixPrompt": "Type EXIT_AND_TAKE_PROFIT"
              }
            }
          }
        }
      },
      {
        "id": "quant-d22-b3-lead-lag-cross-asset-alpha",
        "day": 22,
        "blockNumber": 3,
        "title": "High-Frequency Lead-Lag Cross-Asset Alpha Signals",
        "conceptBudget": {
          "primaryConcept": "Lead-Lag Microstructure Signals",
          "supportingTerms": [
            "Lead-Lag Relationship (Liquid ETF e.g. SPY moves 5 ms before illiquid constituent stocks)",
            "Cross-Venue Arbitrage (Futures vs Cash Equities)",
            "Sub-Millisecond Alpha Decay"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d22-b2-zscore-pairs-trading-signals",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lead_lag_demo.js",
            "initialCode": "function evaluateLeadLag(futureMovedFirst) {\n  return futureMovedFirst\n    ? 'LEAD_LAG_ALPHA_DETECTED: S&P_FUTURES_PRECEDING_CASH_EQUITIES_BY_8MS'\n    : 'SYMMETRIC_FLOW';\n}\n\nconsole.log(evaluateLeadLag(true));",
            "expectedOutput": "LEAD_LAG_ALPHA_DETECTED: S&P_FUTURES_PRECEDING_CASH_EQUITIES_BY_8MS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What alpha signal is captured when index futures consistently lead underlying stock movements by 8 milliseconds?",
          "expectedStringOutput": "LEAD_LAG_ALPHA_DETECTED: S&P_FUTURES_PRECEDING_CASH_EQUITIES_BY_8MS",
          "acceptableAnswers": [
            "LEAD_LAG_ALPHA_DETECTED: S&P_FUTURES_PRECEDING_CASH_EQUITIES_BY_8MS",
            "LEAD_LAG_ALPHA_DETECTED"
          ],
          "primaryMisconceptionId": "MC_QUANT_STATISTICAL_ARBITRAGE_COINTEGRATION_PAIRS",
          "diagnosisMap": {
            "SYMMETRIC": {
              "misconceptionId": "MC_QUANT_STATISTICAL_ARBITRAGE_COINTEGRATION_PAIRS",
              "errorExplanation": "Index futures leading cash equities is a classic lead-lag alpha.",
              "recoveryPath": {
                "simplerExplanation": "Matches LEAD_LAG_ALPHA_DETECTED: S&P_FUTURES_PRECEDING_CASH_EQUITIES_BY_8MS.",
                "guidedFixPrompt": "Type LEAD_LAG_ALPHA_DETECTED: S&P_FUTURES_PRECEDING_CASH_EQUITIES_BY_8MS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Smart Order Routing (SOR) & Best Execution Algorithms",
    "overviewMetaphor": "A Smart Order Router (SOR) is an Intelligent Flight Booking Engine Checking All Airlines Simultaneously: if you want to buy 10,000 shares of Microsoft, liquidity is fragmented across 16 different US stock exchanges (NYSE, NASDAQ, BATS, IEX, DirectEdge); SEC Reg NMS Rule 611 forbids you from buying shares at $150.05 on NYSE if NASDAQ is offering them for $150.00 (Trade-Through Violation!); the SOR dynamically splits your order into simultaneous child packets sized to eat the cheapest liquidity on every exchange at the exact same microsecond.",
    "blocks": [
      {
        "id": "quant-d23-b1-reg-nms-rule-611-trade-through",
        "day": 23,
        "blockNumber": 1,
        "title": "SEC Regulation NMS Rule 611: The Order Protection (Trade-Through) Rule",
        "conceptBudget": {
          "primaryConcept": "Reg NMS Rule 611 Order Protection",
          "supportingTerms": [
            "Trade-Through Prohibition (Cannot execute at a price inferior to the displayed National Best Bid or Offer)",
            "Protected Top-of-Book Quotes",
            "Intermarket Sweep Orders (ISO: Specialized orders where broker certifies simultaneous routing to all protected quotes)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d1-b3-nbbo-spread-and-tick-sizes",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Trade-Through Violation vs Protected Route",
              "boxes": [
                {
                  "label": "Exchange A (NASDAQ)",
                  "value": "Best Ask: $100.00 | Shares: 500 | Status: PROTECTED NBBO",
                  "varType": "Protected Quote",
                  "isUpdated": false
                },
                {
                  "label": "Exchange B (NYSE)",
                  "value": "Ask: $100.02 | Action: Broker executes at $100.02 directly | VIOLATION: SEC RULE 611 ILLEGAL TRADE-THROUGH!",
                  "varType": "Violation",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "reg_nms_demo.js",
            "initialCode": "function auditExecutionAgainstNbbo(execPrice, nbboBestPrice) {\n  const isIllegalTradeThrough = execPrice > nbboBestPrice;\n  return isIllegalTradeThrough\n    ? 'ILLEGAL_TRADE_THROUGH_VIOLATION_SEC_RULE_611'\n    : 'BEST_EXECUTION_COMPLIANT_WITH_NBBO';\n}\n\nconsole.log(auditExecutionAgainstNbbo(100.02, 100.00)); // Illegal!\nconsole.log(auditExecutionAgainstNbbo(100.00, 100.00)); // Compliant!",
            "expectedOutput": "ILLEGAL_TRADE_THROUGH_VIOLATION_SEC_RULE_611\nBEST_EXECUTION_COMPLIANT_WITH_NBBO",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What regulatory violation occurs when an order executes at $100.02 while another lit exchange is displaying a protected quote at $100.00?",
          "expectedStringOutput": "ILLEGAL_TRADE_THROUGH_VIOLATION_SEC_RULE_611",
          "acceptableAnswers": [
            "ILLEGAL_TRADE_THROUGH_VIOLATION_SEC_RULE_611",
            "Trade-Through Violation",
            "Rule 611"
          ],
          "primaryMisconceptionId": "MC_QUANT_REGULATORY_REG_NMS_RULE_611_TRADE_THROUGH",
          "diagnosisMap": {
            "COMPLIANT": {
              "misconceptionId": "MC_QUANT_REGULATORY_REG_NMS_RULE_611_TRADE_THROUGH",
              "errorExplanation": "Executing at an inferior price violates Rule 611 (Trade-Through).",
              "recoveryPath": {
                "simplerExplanation": "Matches ILLEGAL_TRADE_THROUGH_VIOLATION_SEC_RULE_611.",
                "guidedFixPrompt": "Type ILLEGAL_TRADE_THROUGH_VIOLATION_SEC_RULE_611"
              }
            }
          }
        }
      },
      {
        "id": "quant-d23-b2-sor-multi-venue-splitting",
        "day": 23,
        "blockNumber": 2,
        "title": "SOR Multi-Venue Splitting & Maker-Taker Fee Tier Optimization",
        "conceptBudget": {
          "primaryConcept": "SOR Multi-Venue Routing Logic",
          "supportingTerms": [
            "Depth-Proportional Allocation",
            "Maker-Taker Fee Tier Arbitrage (Routing to exchanges with lowest taker fees or highest maker rebates)",
            "IEX 350-Microsecond Speed Bump (Coiled fiber delay preventing latency arbitrage)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d23-b1-reg-nms-rule-611-trade-through",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SOR Routing Allocation Algorithm",
            "codeSnippet": "// Allocate child orders across venues by price, then fee tier\nvenues.sort((a, b) => a.price - b.price || a.taker_fee - b.taker_fee);\nfor (const v of venues) {\n  uint32_t qty = std::min(remaining_shares, v.available_depth);\n  dispatch_child_order(v.exchange_id, qty, v.price);\n  remaining_shares -= qty;\n}",
            "lineNotes": {
              "2": "Sorts venues by best price, then lowest fee.",
              "4": "Dispatches child order to venue."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sor_split_demo.js",
            "initialCode": "function executeSorAllocation(totalQty, venues) {\n  let rem = totalQty;\n  const plan = [];\n  for (const v of venues) {\n    if (rem <= 0) break;\n    const alloc = Math.min(rem, v.depth);\n    plan.push({ venue: v.name, qty: alloc, price: v.price });\n    rem -= alloc;\n  }\n  return {\n    requestedShares: totalQty,\n    allocatedShares: totalQty - rem,\n    routingPlan: plan,\n    status: 'SOR_ROUTING_PLAN_OPTIMAL'\n  };\n}\n\nconst venues = [{ name: 'NASDAQ', depth: 400, price: 100.0 }, { name: 'BATS', depth: 600, price: 100.0 }];\nconsole.log(JSON.stringify(executeSorAllocation(500, venues)));",
            "expectedOutput": "{\"requestedShares\":500,\"allocatedShares\":500,\"routingPlan\":[{\"venue\":\"NASDAQ\",\"qty\":400,\"price\":100},{\"venue\":\"BATS\",\"qty\":100,\"price\":100}],\"status\":\"SOR_ROUTING_PLAN_OPTIMAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many shares are allocated to BATS when routing 500 total shares across NASDAQ (400 depth) and BATS (600 depth) at identical $100.00 prices ($500 - 400$)?",
          "expectedStringOutput": "100",
          "acceptableAnswers": [
            "100",
            "100 shares",
            "qty\":100"
          ],
          "primaryMisconceptionId": "MC_QUANT_ORDER_ROUTING_SMART_SOR_BEST_EXECUTION",
          "diagnosisMap": {
            "500": {
              "misconceptionId": "MC_QUANT_ORDER_ROUTING_SMART_SOR_BEST_EXECUTION",
              "errorExplanation": "NASDAQ takes 400 shares first, leaving 500 - 400 = 100 shares for BATS.",
              "recoveryPath": {
                "simplerExplanation": "500 - 400 = 100.",
                "guidedFixPrompt": "Type 100"
              }
            }
          }
        }
      },
      {
        "id": "quant-d23-b3-latency-equalized-dispatching",
        "day": 23,
        "blockNumber": 3,
        "title": "Latency-Equalized Dispatching: Arriving at All Exchanges at the Exact Same Nanosecond",
        "conceptBudget": {
          "primaryConcept": "Latency-Equalized Order Dispatching",
          "supportingTerms": [
            "One-Way Transit Delays (Carteret: 100 ns, Mahwah: 400 ns, Secaucus: 250 ns)",
            "Pre-Dispatch Sleep Delays (Delaying the closer exchange packet so all child orders hit matching engines simultaneously!)",
            "Preventing Information Leakage & Queue Front-Running"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d23-b2-sor-multi-venue-splitting",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "latency_equal_demo.js",
            "initialCode": "function evaluateArrivalSync(isEqualized) {\n  return isEqualized\n    ? 'SIMULTANEOUS_ARRIVAL_AT_ALL_VENUES: PREVENTS_HFT_SIGNAL_LEAKAGE'\n    : 'ASYMMETRIC_ARRIVAL_EXPOSES_ORDERS_TO_RACE_ARBITRAGE';\n}\n\nconsole.log(evaluateArrivalSync(true));\nconsole.log(evaluateArrivalSync(false));",
            "expectedOutput": "SIMULTANEOUS_ARRIVAL_AT_ALL_VENUES: PREVENTS_HFT_SIGNAL_LEAKAGE\nASYMMETRIC_ARRIVAL_EXPOSES_ORDERS_TO_RACE_ARBITRAGE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What protection is provided by latency-equalized order dispatching across multi-exchange venues?",
          "expectedStringOutput": "SIMULTANEOUS_ARRIVAL_AT_ALL_VENUES: PREVENTS_HFT_SIGNAL_LEAKAGE",
          "acceptableAnswers": [
            "SIMULTANEOUS_ARRIVAL_AT_ALL_VENUES: PREVENTS_HFT_SIGNAL_LEAKAGE",
            "PREVENTS_HFT_SIGNAL_LEAKAGE"
          ],
          "primaryMisconceptionId": "MC_QUANT_ORDER_ROUTING_SMART_SOR_BEST_EXECUTION",
          "diagnosisMap": {
            "ASYMMETRIC": {
              "misconceptionId": "MC_QUANT_ORDER_ROUTING_SMART_SOR_BEST_EXECUTION",
              "errorExplanation": "Simultaneous arrival prevents HFT latency arbitrage on slower venues.",
              "recoveryPath": {
                "simplerExplanation": "Matches SIMULTANEOUS_ARRIVAL_AT_ALL_VENUES: PREVENTS_HFT_SIGNAL_LEAKAGE.",
                "guidedFixPrompt": "Type SIMULTANEOUS_ARRIVAL_AT_ALL_VENUES: PREVENTS_HFT_SIGNAL_LEAKAGE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Exchange Colocation & Cross-Connect Physics",
    "overviewMetaphor": "Colocation is Living in the Same Apartment Building as the Stock Exchange Engine: if your server is located in California, it takes 35,000,000 nanoseconds for your trade signal to travel across the United States to New York; by renting a rack inside Equinix NY4 (Secaucus, NJ) and running a 10-meter direct glass fiber cross-connect cable into NASDAQ's matching engine, your trade signal arrives in 50 nanoseconds; at the speed of light in glass, every 1 meter of extra cable adds 4.9 nanoseconds of delay.",
    "blocks": [
      {
        "id": "quant-d24-b1-speed-of-light-in-fiber",
        "day": 24,
        "blockNumber": 1,
        "title": "Speed of Light in Silica Glass Fiber: Refractive Index $n = 1.468$",
        "conceptBudget": {
          "primaryConcept": "Propagation Velocity in Optical Fiber",
          "supportingTerms": [
            "Speed of Light in Vacuum: $c = 299,792.458\\text{ km/s}$ (~$3.33\\text{ ns/meter}$)",
            "Refractive Index of Silica Glass ($n \\approx 1.468$)",
            "Propagation Speed in Fiber: $v = \\frac{c}{n} \\approx 204,218\\text{ km/s}$ (~$4.89\\text{ ns/meter}$ of glass fiber!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d23-b3-latency-equalized-dispatching",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Speed of Light in Vacuum vs Glass Fiber",
              "boxes": [
                {
                  "label": "1. Vacuum / Air ($n = 1.0003$)",
                  "value": "Speed: 299,792 km/s | Latency: 3.33 nanoseconds per meter | Medium: Free-space laser / Microwave",
                  "varType": "Fastest Medium",
                  "isUpdated": false
                },
                {
                  "label": "2. Silica Glass Optical Fiber ($n = 1.468$)",
                  "value": "Speed: 204,218 km/s | Latency: 4.89 nanoseconds per meter (31% slower than light in air!)",
                  "varType": "Standard Fiber",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "fiber_ns_demo.js",
            "initialCode": "function calculateFiberDelay(cableMeters, n = 1.468) {\n  const c = 299792458; // m/s\n  const v = c / n;\n  const timeSec = cableMeters / v;\n  const timeNs = Number((timeSec * 1000000000).toFixed(2));\n  return {\n    cableLengthMeters: cableMeters,\n    fiberRefractiveIndex: n,\n    propagationDelayNanoseconds: timeNs,\n    status: 'OPTICAL_PROPAGATION_CALCULATED'\n  };\n}\n\nconsole.log(JSON.stringify(calculateFiberDelay(100))); // 100 meters -> ~489.67 ns",
            "expectedOutput": "{\"cableLengthMeters\":100,\"fiberRefractiveIndex\":1.468,\"propagationDelayNanoseconds\":489.67,\"status\":\"OPTICAL_PROPAGATION_CALCULATED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many nanoseconds of one-way optical propagation delay are added by a 100-meter spool of standard glass fiber ($n=1.468$)?",
          "expectedStringOutput": "489.67",
          "acceptableAnswers": [
            "489.67",
            "489.7",
            "490 ns",
            "propagationDelayNanoseconds\":489.67"
          ],
          "primaryMisconceptionId": "MC_QUANT_EXCHANGE_COLOCATION_CROSS_CONNECT_PHYSICS",
          "diagnosisMap": {
            "333": {
              "misconceptionId": "MC_QUANT_EXCHANGE_COLOCATION_CROSS_CONNECT_PHYSICS",
              "errorExplanation": "333 ns is for light in a vacuum. In silica glass (n=1.468), light travels at 4.89 ns/meter -> 489.67 ns.",
              "recoveryPath": {
                "simplerExplanation": "100 * 4.8967 = 489.67 ns.",
                "guidedFixPrompt": "Type 489.67"
              }
            }
          }
        }
      },
      {
        "id": "quant-d24-b2-equal-length-fiber-spools",
        "day": 24,
        "blockNumber": 2,
        "title": "Equal-Length Cross-Connect Spools & Regulatory Latency Fairness",
        "conceptBudget": {
          "primaryConcept": "Equal-Length Fiber Fairness Spools",
          "supportingTerms": [
            "Equal-Length Spool Policy (Exchanges enforce identical coiled fiber lengths e.g. exactly 500 meters for every colocation participant regardless of rack location)",
            "Eliminating Physical Proximity Advantage",
            "Meet-Me-Room (MMR) Cross-Connect Audits"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d24-b1-speed-of-light-in-fiber",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "spool_audit_demo.js",
            "initialCode": "function auditCrossConnectFairness(traderAMeters, traderBMeters) {\n  const isFair = traderAMeters === traderBMeters;\n  return isFair\n    ? 'EQUAL_LENGTH_SPOOL_VERIFIED: ZERO_PHYSICAL_RACK_BIAS'\n    : 'REGULATORY_VIOLATION_ASYMMETRIC_CABLE_LENGTHS';\n}\n\nconsole.log(auditCrossConnectFairness(500, 500));\nconsole.log(auditCrossConnectFairness(450, 500));",
            "expectedOutput": "EQUAL_LENGTH_SPOOL_VERIFIED: ZERO_PHYSICAL_RACK_BIAS\nREGULATORY_VIOLATION_ASYMMETRIC_CABLE_LENGTHS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What compliance status verifies that all colocation participants have identical 500-meter cross-connect spools?",
          "expectedStringOutput": "EQUAL_LENGTH_SPOOL_VERIFIED: ZERO_PHYSICAL_RACK_BIAS",
          "acceptableAnswers": [
            "EQUAL_LENGTH_SPOOL_VERIFIED: ZERO_PHYSICAL_RACK_BIAS",
            "EQUAL_LENGTH_SPOOL_VERIFIED"
          ],
          "primaryMisconceptionId": "MC_QUANT_EXCHANGE_COLOCATION_CROSS_CONNECT_PHYSICS",
          "diagnosisMap": {
            "VIOLATION": {
              "misconceptionId": "MC_QUANT_EXCHANGE_COLOCATION_CROSS_CONNECT_PHYSICS",
              "errorExplanation": "Identical cable lengths confirm fairness and zero rack bias.",
              "recoveryPath": {
                "simplerExplanation": "Matches EQUAL_LENGTH_SPOOL_VERIFIED: ZERO_PHYSICAL_RACK_BIAS.",
                "guidedFixPrompt": "Type EQUAL_LENGTH_SPOOL_VERIFIED: ZERO_PHYSICAL_RACK_BIAS"
              }
            }
          }
        }
      },
      {
        "id": "quant-d24-b3-hollow-core-fiber-hcf",
        "day": 24,
        "blockNumber": 3,
        "title": "Hollow-Core Optical Fiber (HCF): Guiding Light Through Air at $n = 1.0003$",
        "conceptBudget": {
          "primaryConcept": "Hollow-Core Optical Fiber (HCF)",
          "supportingTerms": [
            "Hollow Core Fiber (Light travels down an air core surrounded by micro-structured glass cladding)",
            "Effective Refractive Index: $n \\approx 1.0003$",
            "30% Lower Latency than Standard Glass Fiber (~$3.34\\text{ ns/m}$ vs $4.89\\text{ ns/m}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d24-b2-equal-length-fiber-spools",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "hcf_demo.js",
            "initialCode": "function evaluateFiberTechnology(tech) {\n  if (tech === 'HOLLOW_CORE') {\n    return { refractiveIndex: 1.0003, speedOfLightPct: 99.97, status: 'HOLLOW_CORE_AIR_GUIDED_OPTIMAL' };\n  }\n  return { refractiveIndex: 1.468, speedOfLightPct: 68.1, status: 'STANDARD_SILICA_GLASS' };\n}\n\nconsole.log(JSON.stringify(evaluateFiberTechnology('HOLLOW_CORE')));",
            "expectedOutput": "{\"refractiveIndex\":1.0003,\"speedOfLightPct\":99.97,\"status\":\"HOLLOW_CORE_AIR_GUIDED_OPTIMAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What percentage of the speed of light in vacuum is achieved by Hollow-Core Fiber (HCF)?",
          "expectedStringOutput": "99.97",
          "acceptableAnswers": [
            "99.97",
            "99.97%",
            "speedOfLightPct\":99.97"
          ],
          "primaryMisconceptionId": "MC_QUANT_EXCHANGE_COLOCATION_CROSS_CONNECT_PHYSICS",
          "diagnosisMap": {
            "68.1": {
              "misconceptionId": "MC_QUANT_EXCHANGE_COLOCATION_CROSS_CONNECT_PHYSICS",
              "errorExplanation": "68.1% is standard glass. Hollow-core fiber guides light through air at 99.97% of c.",
              "recoveryPath": {
                "simplerExplanation": "HCF achieves 99.97% of c.",
                "guidedFixPrompt": "Type 99.97"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Microwave, Millimeter-Wave & Shortwave Radio Trading Networks",
    "overviewMetaphor": "Microwave Trading is Beating a Train by Flying a Drone in a Straight Line: underground optical fiber cables must follow twisting highway curves and railroad tracks (1,400 km from Chicago CME to New Jersey NASDAQ); radio microwaves travel in a straight line through the sky at the speed of light in air ($n=1.0003$); a microwave radio network transmits prices from Chicago to New York in 4.0 milliseconds—beating fiber optic cables by nearly 2 full milliseconds!",
    "blocks": [
      {
        "id": "quant-d25-b1-microwave-vs-fiber-chicago-ny",
        "day": 25,
        "blockNumber": 1,
        "title": "The Great Chicago-to-New York Microwave Race: 4.0 ms vs 5.9 ms",
        "conceptBudget": {
          "primaryConcept": "Line-of-Sight Microwave Propagation",
          "supportingTerms": [
            "Geodesic Great-Circle Distance (~1,180 km Chicago CME to Carteret NJ)",
            "Air Velocity ($v \\approx c = 299,792\\text{ km/s}$)",
            "Line-of-Sight Relay Towers (Spaced 30 - 50 km apart across Pennsylvania mountains)",
            "1.9 Millisecond HFT Latency Advantage"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d24-b1-speed-of-light-in-fiber",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Chicago to New York Transit Latency Comparison",
              "boxes": [
                {
                  "label": "Fiber Optic Cable Route",
                  "value": "Distance: 1,400 km (Follows railways) | Medium: Glass ($n=1.468$) | One-Way: 5.90 ms",
                  "varType": "Fiber Optic",
                  "isUpdated": false
                },
                {
                  "label": "Microwave Radio Tower Route",
                  "value": "Distance: 1,200 km (Straight line) | Medium: Air ($n=1.0003$) | One-Way: 4.00 ms (1.9 ms FASTER!)",
                  "varType": "Microwave Radio",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "microwave_demo.js",
            "initialCode": "function calculateHftAdvantage(fiberMs = 5.90, microwaveMs = 4.00) {\n  const diff = fiberMs - microwaveMs;\n  return {\n    fiberLatencyMs: fiberMs,\n    microwaveLatencyMs: microwaveMs,\n    speedAdvantageMs: Number(diff.toFixed(2)),\n    advantageMicroseconds: Math.round(diff * 1000),\n    status: 'MICROWAVE_BEATS_FIBER_BY_MASSIVE_MARGIN'\n  };\n}\n\nconsole.log(JSON.stringify(calculateHftAdvantage(5.90, 4.00)));",
            "expectedOutput": "{\"fiberLatencyMs\":5.9,\"microwaveLatencyMs\":4,\"speedAdvantageMs\":1.9,\"advantageMicroseconds\":1900,\"status\":\"MICROWAVE_BEATS_FIBER_BY_MASSIVE_MARGIN\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many microseconds of latency advantage are captured by microwave networks beating fiber from Chicago to New Jersey ($1.9 \\text{ ms} \\times 1000$)?",
          "expectedStringOutput": "1900",
          "acceptableAnswers": [
            "1900",
            "1900 us",
            "1,900",
            "advantageMicroseconds\":1900"
          ],
          "primaryMisconceptionId": "MC_QUANT_MICROWAVE_FIBER_SPEED_OF_LIGHT_LATENCY",
          "diagnosisMap": {
            "1.9": {
              "misconceptionId": "MC_QUANT_MICROWAVE_FIBER_SPEED_OF_LIGHT_LATENCY",
              "errorExplanation": "1.9 milliseconds equals 1,900 microseconds.",
              "recoveryPath": {
                "simplerExplanation": "1.9 * 1000 = 1900.",
                "guidedFixPrompt": "Type 1900"
              }
            }
          }
        }
      },
      {
        "id": "quant-d25-b2-rain-fade-and-shortwave-hf",
        "day": 25,
        "blockNumber": 2,
        "title": "Atmospheric Rain Fade & Shortwave High-Frequency (HF) Skywave Propagation",
        "conceptBudget": {
          "primaryConcept": "Atmospheric Radio Attenuation & HF Skywave",
          "supportingTerms": [
            "Rain Fade (Heavy rainfall attenuates 70 GHz E-band millimeter-wave signals)",
            "Hybrid Microwave-Fiber Fallback Switching",
            "Shortwave HF Skywave (Bouncing 3-30 MHz radio waves off the ionosphere across the Atlantic Ocean from London to New York in 28 ms!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d25-b1-microwave-vs-fiber-chicago-ny",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rain_fade_demo.js",
            "initialCode": "function evaluateRadioLinkState(signalToNoiseRatioDb) {\n  return signalToNoiseRatioDb < 10.0\n    ? 'RAIN_FADE_DETECTED: FAILOVER_TO_UNDERGROUND_FIBER_BACKUP'\n    : 'RADIO_LINK_OPTIMAL_MICROWAVE_ACTIVE';\n}\n\nconsole.log(evaluateRadioLinkState(5.0));  // Heavy rain!\nconsole.log(evaluateRadioLinkState(25.0)); // Clear skies!",
            "expectedOutput": "RAIN_FADE_DETECTED: FAILOVER_TO_UNDERGROUND_FIBER_BACKUP\nRADIO_LINK_OPTIMAL_MICROWAVE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is triggered by an automated link manager when a storm causes microwave signal SNR to drop below 10 dB?",
          "expectedStringOutput": "RAIN_FADE_DETECTED: FAILOVER_TO_UNDERGROUND_FIBER_BACKUP",
          "acceptableAnswers": [
            "RAIN_FADE_DETECTED: FAILOVER_TO_UNDERGROUND_FIBER_BACKUP",
            "FAILOVER_TO_UNDERGROUND_FIBER_BACKUP"
          ],
          "primaryMisconceptionId": "MC_QUANT_MICROWAVE_FIBER_SPEED_OF_LIGHT_LATENCY",
          "diagnosisMap": {
            "OPTIMAL": {
              "misconceptionId": "MC_QUANT_MICROWAVE_FIBER_SPEED_OF_LIGHT_LATENCY",
              "errorExplanation": "Low SNR triggers failover to fiber backup.",
              "recoveryPath": {
                "simplerExplanation": "Fails over to fiber backup.",
                "guidedFixPrompt": "Type RAIN_FADE_DETECTED: FAILOVER_TO_UNDERGROUND_FIBER_BACKUP"
              }
            }
          }
        }
      },
      {
        "id": "quant-d25-b3-free-space-optics-lasers",
        "day": 25,
        "blockNumber": 3,
        "title": "Free-Space Optics (FSO) Laser Trading Links",
        "conceptBudget": {
          "primaryConcept": "Free-Space Optics (FSO)",
          "supportingTerms": [
            "FSO Lasers (Transmitting multi-gigabit data through open air via infrared lasers)",
            "Zero Spectrum Licensing Overhead",
            "Vulnerability to Fog Attenuation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d25-b2-rain-fade-and-shortwave-hf",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "fso_laser_demo.js",
            "initialCode": "function evaluateFsoLink() {\n  return 'FREE_SPACE_OPTICS_LASER_LINK_OPERATIONAL_LIGHT_SPEED_IN_AIR';\n}\n\nconsole.log(evaluateFsoLink());",
            "expectedOutput": "FREE_SPACE_OPTICS_LASER_LINK_OPERATIONAL_LIGHT_SPEED_IN_AIR",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status string confirms operational readiness of Free-Space Optics laser communication?",
          "expectedStringOutput": "FREE_SPACE_OPTICS_LASER_LINK_OPERATIONAL_LIGHT_SPEED_IN_AIR",
          "acceptableAnswers": [
            "FREE_SPACE_OPTICS_LASER_LINK_OPERATIONAL_LIGHT_SPEED_IN_AIR"
          ],
          "primaryMisconceptionId": "MC_QUANT_MICROWAVE_FIBER_SPEED_OF_LIGHT_LATENCY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_QUANT_MICROWAVE_FIBER_SPEED_OF_LIGHT_LATENCY",
              "errorExplanation": "Matches FREE_SPACE_OPTICS_LASER_LINK_OPERATIONAL_LIGHT_SPEED_IN_AIR.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type FREE_SPACE_OPTICS_LASER_LINK_OPERATIONAL_LIGHT_SPEED_IN_AIR"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Backtesting Pitfalls: Lookahead Bias & Overfitting Elimination",
    "overviewMetaphor": "Lookahead Bias is Placing Bets on a Recorded Football Game While Sneaking a Peek at the Final Score on Your Phone: on paper, your trading strategy looks like an absolute genius that never loses (10.0 Sharpe Ratio!); but the moment you deploy it to live production with real money, it crashes and burns immediately; true quantitative engineering rigorously quarantines historical timestamps, accounts for survivorship bias (including bankrupt companies), and applies Combinatorial Purged Cross-Validation.",
    "blocks": [
      {
        "id": "quant-d26-b1-lookahead-bias-timestamp-leakage",
        "day": 26,
        "blockNumber": 1,
        "title": "Lookahead Bias & Future Timestamp Leakage in Signal Calculations",
        "conceptBudget": {
          "primaryConcept": "Lookahead Bias Prevention",
          "supportingTerms": [
            "Future Data Leakage (Using $P_{t+1}$ closing price to calculate signal at time $t$)",
            "Point-in-Time Data Feeds (Ensuring historical earnings dates match exact release hour)",
            "Strict Timestamp Inequality Invariant ($T_{\\text{signal}} \\ge T_{\\text{data}}$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d22-b2-zscore-pairs-trading-signals",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Lookahead Bug vs Point-in-Time Fix Diff",
              "brokenCode": "// ❌ BUG: Lookahead bias using daily close to trade at 09:30 AM:\nconst signal = (daily_bar.close > daily_bar.open) ? BUY : SELL; // Close is in the FUTURE at 4 PM!",
              "fixedCode": "// ✅ PRODUCTION FIX: Use strictly prior completed bar data:\nconst signal = (prev_day_bar.close > prev_day_bar.open) ? BUY : SELL; // 100% available at 09:30 AM!",
              "errorLine": 2,
              "errorReason": "Using the current day's close price at market open is impossible in live trading because the close price has not occurred yet.",
              "fixExplanation": "Use strictly finalized historical data from the previous closed interval."
            }
          },
          {
            "type": "runnable_code",
            "filename": "lookahead_demo.js",
            "initialCode": "function auditLookahead(dataTimestamp, signalTimestamp) {\n  const isClean = signalTimestamp >= dataTimestamp;\n  return isClean\n    ? 'BACKTEST_VALID_POINT_IN_TIME_COMPLIANT'\n    : 'CRITICAL_LOOKAHEAD_BIAS_FUTURE_LEAKAGE_DETECTED';\n}\n\nconsole.log(auditLookahead(1000, 1005)); // Clean!\nconsole.log(auditLookahead(1005, 1000)); // Future leakage!",
            "expectedOutput": "BACKTEST_VALID_POINT_IN_TIME_COMPLIANT\nCRITICAL_LOOKAHEAD_BIAS_FUTURE_LEAKAGE_DETECTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What defect status is triggered when a backtesting signal at timestamp 1000 accesses market data from future timestamp 1005?",
          "expectedStringOutput": "CRITICAL_LOOKAHEAD_BIAS_FUTURE_LEAKAGE_DETECTED",
          "acceptableAnswers": [
            "CRITICAL_LOOKAHEAD_BIAS_FUTURE_LEAKAGE_DETECTED",
            "LOOKAHEAD_BIAS"
          ],
          "primaryMisconceptionId": "MC_QUANT_BACKTESTING_LOOKAHEAD_BIAS_OVERFITTING",
          "diagnosisMap": {
            "VALID": {
              "misconceptionId": "MC_QUANT_BACKTESTING_LOOKAHEAD_BIAS_OVERFITTING",
              "errorExplanation": "Using future data causes fatal lookahead bias.",
              "recoveryPath": {
                "simplerExplanation": "Matches CRITICAL_LOOKAHEAD_BIAS_FUTURE_LEAKAGE_DETECTED.",
                "guidedFixPrompt": "Type CRITICAL_LOOKAHEAD_BIAS_FUTURE_LEAKAGE_DETECTED"
              }
            }
          }
        }
      },
      {
        "id": "quant-d26-b2-survivorship-bias-corporate-actions",
        "day": 26,
        "blockNumber": 2,
        "title": "Survivorship Bias: Including Delisted, Acquired & Bankrupt Equities",
        "conceptBudget": {
          "primaryConcept": "Survivorship Bias Elimination",
          "supportingTerms": [
            "Survivorship Bias Fallacy (Testing only on current S&P 500 constituents artificially inflates returns by removing Enron, Lehman Brothers, etc.)",
            "Corporate Action Adjustments (Stock splits, reverse splits, cash dividends, spinoffs)",
            "Point-in-Time Universe Selection"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d26-b1-lookahead-bias-timestamp-leakage",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "survivorship_demo.js",
            "initialCode": "function evaluateBacktestUniverse(includesDelistedStocks) {\n  return includesDelistedStocks\n    ? 'SURVIVORSHIP_BIAS_FREE_REALISTIC_PERFORMANCE'\n    : 'SURVIVORSHIP_BIAS_DEFECT_RETURNS_HEAVILY_INFLATED';\n}\n\nconsole.log(evaluateBacktestUniverse(true));\nconsole.log(evaluateBacktestUniverse(false));",
            "expectedOutput": "SURVIVORSHIP_BIAS_FREE_REALISTIC_PERFORMANCE\nSURVIVORSHIP_BIAS_DEFECT_RETURNS_HEAVILY_INFLATED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What risk defect occurs when a quantitative backtest excludes historical companies that went bankrupt or were delisted?",
          "expectedStringOutput": "SURVIVORSHIP_BIAS_DEFECT_RETURNS_HEAVILY_INFLATED",
          "acceptableAnswers": [
            "SURVIVORSHIP_BIAS_DEFECT_RETURNS_HEAVILY_INFLATED",
            "Survivorship Bias"
          ],
          "primaryMisconceptionId": "MC_QUANT_SURVIVORSHIP_BIAS_CORPORATE_ACTIONS",
          "diagnosisMap": {
            "FREE": {
              "misconceptionId": "MC_QUANT_SURVIVORSHIP_BIAS_CORPORATE_ACTIONS",
              "errorExplanation": "Excluding delisted stocks causes survivorship bias.",
              "recoveryPath": {
                "simplerExplanation": "Matches SURVIVORSHIP_BIAS_DEFECT_RETURNS_HEAVILY_INFLATED.",
                "guidedFixPrompt": "Type SURVIVORSHIP_BIAS_DEFECT_RETURNS_HEAVILY_INFLATED"
              }
            }
          }
        }
      },
      {
        "id": "quant-d26-b3-purged-kfold-cross-validation-cpcv",
        "day": 26,
        "blockNumber": 3,
        "title": "Combinatorial Purged Cross-Validation (CPCV) & Embargoing",
        "conceptBudget": {
          "primaryConcept": "Purged K-Fold Cross-Validation (CPCV)",
          "supportingTerms": [
            "Marcos López de Prado CPCV Framework",
            "Purging (Removing training samples whose labels overlap with test set holding periods)",
            "Embargoing (Discarding training bars immediately following test sets to prevent autoregressive serial correlation leakage)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d26-b2-survivorship-bias-corporate-actions",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cpcv_demo.js",
            "initialCode": "function evaluateCvMethod(isPurgedAndEmbargoed) {\n  return isPurgedAndEmbargoed\n    ? 'CPCV_PURGED_CROSS_VALIDATION_ZERO_SERIAL_OVERFITTING'\n    : 'STANDARD_K_FOLD_LEAKAGE_VULNERABLE';\n}\n\nconsole.log(evaluateCvMethod(true));",
            "expectedOutput": "CPCV_PURGED_CROSS_VALIDATION_ZERO_SERIAL_OVERFITTING",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What cross-validation method eliminates serial correlation leakage between financial training and testing folds?",
          "expectedStringOutput": "CPCV_PURGED_CROSS_VALIDATION_ZERO_SERIAL_OVERFITTING",
          "acceptableAnswers": [
            "CPCV_PURGED_CROSS_VALIDATION_ZERO_SERIAL_OVERFITTING",
            "CPCV",
            "Purged Cross Validation"
          ],
          "primaryMisconceptionId": "MC_QUANT_BACKTESTING_LOOKAHEAD_BIAS_OVERFITTING",
          "diagnosisMap": {
            "STANDARD": {
              "misconceptionId": "MC_QUANT_BACKTESTING_LOOKAHEAD_BIAS_OVERFITTING",
              "errorExplanation": "Standard K-Fold leaks information across financial time series.",
              "recoveryPath": {
                "simplerExplanation": "Matches CPCV_PURGED_CROSS_VALIDATION_ZERO_SERIAL_OVERFITTING.",
                "guidedFixPrompt": "Type CPCV_PURGED_CROSS_VALIDATION_ZERO_SERIAL_OVERFITTING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Pre-Trade Risk Controls & Fat-Finger Circuit Breakers",
    "overviewMetaphor": "Pre-Trade Risk is an Unbreakable Mechanical Steel Grate in Front of the Engine's Exhaust: in 2012, Knight Capital lost $440 Million in 45 minutes because a rogue loop sent millions of uncontrolled orders into the market; Pre-Trade Risk Gateways sit directly between the trading strategy and the network card—evaluating Maximum Notional Size (Rejecting accidental $50M orders), Price Collars (Rejecting bids 3% away from NBBO), and Order Rate Throttling in hardware before any byte reaches the exchange.",
    "blocks": [
      {
        "id": "quant-d27-b1-fat-finger-max-notional-checks",
        "day": 27,
        "blockNumber": 1,
        "title": "Fat-Finger Checks: Maximum Notional Order Value & Position Limits",
        "conceptBudget": {
          "primaryConcept": "Pre-Trade Maximum Notional Filter",
          "supportingTerms": [
            "Notional Calculation: $\\text{Notional} = \\text{Price} \\times \\text{Quantity}$",
            "Hard Limit Breach ($> \\$1,000,000$ triggers immediate hardware reject)",
            "Cumulative Gross / Net Notional Limits per symbol and account"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d1-b2-order-types-and-tif",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Pre-Trade Risk Gateway Interception",
              "boxes": [
                {
                  "label": "Trader places: 50,000 shares @ $100.00",
                  "value": "Notional: $5,000,000 | Configured Max Notional Limit: $1,000,000",
                  "varType": "Incoming Order",
                  "isUpdated": false
                },
                {
                  "label": "Risk Gateway Verdict",
                  "value": "Action: REJECTED IN 12 NANOSECONDS! | Status: FAT_FINGER_BREACH_ORDER_BLOCKED",
                  "varType": "Risk Firewall",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "notional_risk_demo.js",
            "initialCode": "function evaluateOrderNotional(px, qty, maxNotional = 1000000) {\n  const notional = px * qty;\n  if (notional > maxNotional) {\n    return { notional, maxNotional, approved: false, status: 'FAT_FINGER_MAX_NOTIONAL_BREACH_REJECTED' };\n  }\n  return { notional, maxNotional, approved: true, status: 'ORDER_NOTIONAL_APPROVED' };\n}\n\nconsole.log(JSON.stringify(evaluateOrderNotional(100.0, 50000))); // $5M -> REJECT!\nconsole.log(JSON.stringify(evaluateOrderNotional(100.0, 1000)));  // $100k -> APPROVED!",
            "expectedOutput": "{\"notional\":5000000,\"maxNotional\":1000000,\"approved\":false,\"status\":\"FAT_FINGER_MAX_NOTIONAL_BREACH_REJECTED\"}\n{\"notional\":100000,\"maxNotional\":1000000,\"approved\":true,\"status\":\"ORDER_NOTIONAL_APPROVED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What risk verdict is returned when an order for 50,000 shares at $100.00 ($5M notional) hits a $1M risk gateway limit?",
          "expectedStringOutput": "FAT_FINGER_MAX_NOTIONAL_BREACH_REJECTED",
          "acceptableAnswers": [
            "FAT_FINGER_MAX_NOTIONAL_BREACH_REJECTED",
            "status\":\"FAT_FINGER_MAX_NOTIONAL_BREACH_REJECTED\""
          ],
          "primaryMisconceptionId": "MC_QUANT_RISK_LIMITS_FAT_FINGER_CIRCUIT_BREAKERS",
          "diagnosisMap": {
            "APPROVED": {
              "misconceptionId": "MC_QUANT_RISK_LIMITS_FAT_FINGER_CIRCUIT_BREAKERS",
              "errorExplanation": "$5,000,000 exceeds $1,000,000 limit, triggering a fat-finger reject.",
              "recoveryPath": {
                "simplerExplanation": "Order exceeds limit -> FAT_FINGER_MAX_NOTIONAL_BREACH_REJECTED.",
                "guidedFixPrompt": "Type FAT_FINGER_MAX_NOTIONAL_BREACH_REJECTED"
              }
            }
          }
        }
      },
      {
        "id": "quant-d27-b2-price-collars-and-tick-bands",
        "day": 27,
        "blockNumber": 2,
        "title": "Price Collar Checks: Maximum Percentage Deviation from NBBO Midpoint",
        "conceptBudget": {
          "primaryConcept": "Price Collar Risk Validation",
          "supportingTerms": [
            "Price Collar Rule: $|P_{\\text{order}} - P_{\\text{mid}}| / P_{\\text{mid}} \\le \\text{CollarLimit}$ (e.g. 3%)",
            "Preventing Aggressive Sweeping through Erroneous Spreads",
            "SEC Rule 15c3-5 Market Access Rule Compliance"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d27-b1-fat-finger-max-notional-checks",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Price Collar Validation in C++",
            "codeSnippet": "double dev = std::abs(order_price - nbbo_mid) / nbbo_mid;\nif (dev > max_collar_pct) {\n  reject_order(REASON_PRICE_COLLAR_EXCEEDED);\n  return false;\n}",
            "lineNotes": {
              "1": "Computes deviation from midpoint.",
              "2": "Rejects orders crossing collar threshold."
            }
          },
          {
            "type": "runnable_code",
            "filename": "collar_risk_demo.js",
            "initialCode": "function evaluatePriceCollar(orderPx, nbboMid, maxCollar = 0.03) {\n  const dev = Math.abs(orderPx - nbboMid) / nbboMid;\n  return dev > maxCollar\n    ? 'PRICE_COLLAR_EXCEEDED_ORDER_REJECTED'\n    : 'PRICE_COLLAR_APPROVED';\n}\n\nconsole.log(evaluatePriceCollar(110.0, 100.0, 0.03)); // 10% dev -> REJECT!\nconsole.log(evaluatePriceCollar(101.0, 100.0, 0.03)); // 1% dev -> APPROVED!",
            "expectedOutput": "PRICE_COLLAR_EXCEEDED_ORDER_REJECTED\nPRICE_COLLAR_APPROVED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What risk verdict is returned when placing a buy order at $110.00 while NBBO midpoint is $100.00 under a 3% price collar?",
          "expectedStringOutput": "PRICE_COLLAR_EXCEEDED_ORDER_REJECTED",
          "acceptableAnswers": [
            "PRICE_COLLAR_EXCEEDED_ORDER_REJECTED",
            "PRICE_COLLAR_EXCEEDED"
          ],
          "primaryMisconceptionId": "MC_QUANT_RISK_LIMITS_FAT_FINGER_CIRCUIT_BREAKERS",
          "diagnosisMap": {
            "APPROVED": {
              "misconceptionId": "MC_QUANT_RISK_LIMITS_FAT_FINGER_CIRCUIT_BREAKERS",
              "errorExplanation": "10% deviation exceeds the 3% collar limit.",
              "recoveryPath": {
                "simplerExplanation": "Exceeds collar -> PRICE_COLLAR_EXCEEDED_ORDER_REJECTED.",
                "guidedFixPrompt": "Type PRICE_COLLAR_EXCEEDED_ORDER_REJECTED"
              }
            }
          }
        }
      },
      {
        "id": "quant-d27-b3-token-bucket-order-rate-throttling",
        "day": 27,
        "blockNumber": 3,
        "title": "Token Bucket Order Rate Throttling & Automated Kill Switches",
        "conceptBudget": {
          "primaryConcept": "Token Bucket Rate Limiting & Kill Switches",
          "supportingTerms": [
            "Token Bucket Algorithm (Refilling at 1,000 orders/sec; bursting up to 200 orders)",
            "Hard Kill Switch (Instant zero-out of all open orders + socket disconnect on 3 consecutive risk violations)",
            "Sub-Microsecond FPGA Risk Gates"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d27-b2-price-collars-and-tick-bands",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "kill_switch_demo.js",
            "initialCode": "function evaluateKillSwitch(consecutiveBreaches) {\n  return consecutiveBreaches >= 3\n    ? 'KILL_SWITCH_ENGAGED: ALL_RESTING_ORDERS_CANCELED_SOCKET_DISCONNECTED'\n    : 'CIRCUIT_NORMAL';\n}\n\nconsole.log(evaluateKillSwitch(3));\nconsole.log(evaluateKillSwitch(1));",
            "expectedOutput": "KILL_SWITCH_ENGAGED: ALL_RESTING_ORDERS_CANCELED_SOCKET_DISCONNECTED\nCIRCUIT_NORMAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What emergency action is triggered when an algorithm triggers 3 consecutive pre-trade risk breaches?",
          "expectedStringOutput": "KILL_SWITCH_ENGAGED: ALL_RESTING_ORDERS_CANCELED_SOCKET_DISCONNECTED",
          "acceptableAnswers": [
            "KILL_SWITCH_ENGAGED: ALL_RESTING_ORDERS_CANCELED_SOCKET_DISCONNECTED",
            "KILL_SWITCH_ENGAGED"
          ],
          "primaryMisconceptionId": "MC_QUANT_RISK_LIMITS_FAT_FINGER_CIRCUIT_BREAKERS",
          "diagnosisMap": {
            "NORMAL": {
              "misconceptionId": "MC_QUANT_RISK_LIMITS_FAT_FINGER_CIRCUIT_BREAKERS",
              "errorExplanation": "3 consecutive breaches activates the hard kill switch.",
              "recoveryPath": {
                "simplerExplanation": "Engages kill switch.",
                "guidedFixPrompt": "Type KILL_SWITCH_ENGAGED: ALL_RESTING_ORDERS_CANCELED_SOCKET_DISCONNECTED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Crypto Derivatives: Perpetual Futures & Funding Rate Arbitrage",
    "overviewMetaphor": "A Perpetual Swap is a Futures Contract with No Expiration Date Kept Pinned to Spot by an 8-Hour Tug-of-War: traditional futures expire on the third Friday of the month; Perpetual Swaps (Perps) never expire; to keep the Perp price from drifting away from spot Bitcoin, the exchange forces traders to pay each other every 8 hours: if the Perp is trading above Spot ($P_{\\text{perp}} > P_{\\text{spot}}$), Longs must pay Shorts a positive Funding Rate; Delta-Neutral traders buy spot Bitcoin and short perpetual futures to collect a risk-free 15% APY yield.",
    "blocks": [
      {
        "id": "quant-d28-b1-perp-swap-mechanics-funding-rate",
        "day": 28,
        "blockNumber": 1,
        "title": "Perpetual Swap Mechanics & The 8-Hour Funding Rate Equation",
        "conceptBudget": {
          "primaryConcept": "Perpetual Futures Funding Rate Equation",
          "supportingTerms": [
            "Funding Rate: $F = \\text{Clamp}\\left(\\text{Premium Index} + \\text{clamp}(I - P, -0.05\\%, 0.05\\%), -0.75\\%, 0.75\\%\\right)$",
            "Premium Index: $P = \\frac{\\text{Perp Price} - \\text{Spot Index}}{\\text{Spot Index}}$",
            "8-Hour Settlement Interval (00:00, 08:00, 16:00 UTC)",
            "Longs Pay Shorts when $F > 0$; Shorts Pay Longs when $F < 0$"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d16-b1-black-scholes-pde-and-formula",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Funding Rate Cashflow Direction",
              "boxes": [
                {
                  "label": "Perp Trading at Premium ($F = +0.01\\%$)",
                  "value": "Perp: $30,050 | Spot: $30,000 | Cashflow: LONGS PAY SHORTS every 8 hours!",
                  "varType": "Positive Funding",
                  "isUpdated": false
                },
                {
                  "label": "Perp Trading at Discount ($F = -0.01\\%$)",
                  "value": "Perp: $29,950 | Spot: $30,000 | Cashflow: SHORTS PAY LONGS every 8 hours!",
                  "varType": "Negative Funding",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "funding_calc_demo.js",
            "initialCode": "function evaluateFundingCashflow(fundingRate8h) {\n  return fundingRate8h > 0\n    ? 'POSITIVE_FUNDING: LONGS_PAY_SHORTS'\n    : (fundingRate8h < 0 ? 'NEGATIVE_FUNDING: SHORTS_PAY_LONGS' : 'ZERO_FUNDING');\n}\n\nconsole.log(evaluateFundingCashflow(0.0001)); // +0.01% -> Longs pay shorts\nconsole.log(evaluateFundingCashflow(-0.0001)); // -0.01% -> Shorts pay longs",
            "expectedOutput": "POSITIVE_FUNDING: LONGS_PAY_SHORTS\nNEGATIVE_FUNDING: SHORTS_PAY_LONGS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Who pays whom when perpetual futures trade at a premium with a positive funding rate ($F = +0.01\\%$)?",
          "expectedStringOutput": "POSITIVE_FUNDING: LONGS_PAY_SHORTS",
          "acceptableAnswers": [
            "POSITIVE_FUNDING: LONGS_PAY_SHORTS",
            "Longs pay shorts",
            "LONGS_PAY_SHORTS"
          ],
          "primaryMisconceptionId": "MC_QUANT_CRYPTO_PERPETUAL_FUTURES_FUNDING_RATE",
          "diagnosisMap": {
            "SHORTS": {
              "misconceptionId": "MC_QUANT_CRYPTO_PERPETUAL_FUTURES_FUNDING_RATE",
              "errorExplanation": "Positive funding rate forces longs to pay shorts.",
              "recoveryPath": {
                "simplerExplanation": "Longs pay shorts.",
                "guidedFixPrompt": "Type POSITIVE_FUNDING: LONGS_PAY_SHORTS"
              }
            }
          }
        }
      },
      {
        "id": "quant-d28-b2-delta-neutral-cash-and-carry",
        "day": 28,
        "blockNumber": 2,
        "title": "Delta-Neutral Cash-and-Carry Arbitrage & Annualized Yield",
        "conceptBudget": {
          "primaryConcept": "Delta-Neutral Funding Arbitrage",
          "supportingTerms": [
            "Cash-and-Carry Position (Long 1.0 Spot BTC + Short 1.0 Perpetual BTC $\\implies$ Net Delta = 0.0!)",
            "Annualized APY Yield: $\\text{APY} = F_{\\text{8h}} \\times 3 \\times 365 \\times 100\\%$",
            "Zero Market Directional Risk"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d28-b1-perp-swap-mechanics-funding-rate",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Annualized Funding Yield Formula",
            "codeSnippet": "// 3 funding intervals per day * 365 days = 1095 funding payments per year\nconst annualPayments = 1095;\nconst annualizedYieldPct = fundingRate8h * annualPayments * 100;",
            "lineNotes": {
              "2": "Total annual 8-hour payments.",
              "3": "Calculates annualized percent return."
            }
          },
          {
            "type": "runnable_code",
            "filename": "funding_yield_demo.js",
            "initialCode": "function calculateApy(rate8h) {\n  const apy = rate8h * 1095 * 100;\n  return {\n    rate8hPercent: Number((rate8h * 100).toFixed(3)),\n    annualizedApyPercent: Number(apy.toFixed(2)),\n    strategy: 'DELTA_NEUTRAL_FUNDING_HARVESTING'\n  };\n}\n\nconsole.log(JSON.stringify(calculateApy(0.0001))); // 0.01% per 8h -> 10.95% APY!",
            "expectedOutput": "{\"rate8hPercent\":0.01,\"annualizedApyPercent\":10.95,\"strategy\":\"DELTA_NEUTRAL_FUNDING_HARVESTING\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What annualized percentage yield (APY) is generated by collecting a 0.01% funding rate every 8 hours ($0.0001 \\times 1095 \\times 100$)?",
          "expectedStringOutput": "10.95",
          "acceptableAnswers": [
            "10.95",
            "10.95%",
            "annualizedApyPercent\":10.95"
          ],
          "primaryMisconceptionId": "MC_QUANT_CRYPTO_PERPETUAL_FUTURES_FUNDING_RATE",
          "diagnosisMap": {
            "3.65": {
              "misconceptionId": "MC_QUANT_CRYPTO_PERPETUAL_FUTURES_FUNDING_RATE",
              "errorExplanation": "Funding is paid 3 times per day (1,095 times per year): 0.01% * 1095 = 10.95%.",
              "recoveryPath": {
                "simplerExplanation": "0.0001 * 1095 * 100 = 10.95.",
                "guidedFixPrompt": "Type 10.95"
              }
            }
          }
        }
      },
      {
        "id": "quant-d28-b3-liquidation-cascades-and-adl",
        "day": 28,
        "blockNumber": 3,
        "title": "Auto-Deleveraging (ADL) & Liquidation Cascade Defenses",
        "conceptBudget": {
          "primaryConcept": "Auto-Deleveraging & Liquidation Cascades",
          "supportingTerms": [
            "Maintenance Margin & Liquidation Engine",
            "Liquidation Cascades (Forced market selling triggering further liquidations)",
            "Auto-Deleveraging (ADL: Exchange forcibly liquidates profitable counterparty positions when insurance fund is depleted)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d28-b2-delta-neutral-cash-and-carry",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "adl_risk_demo.js",
            "initialCode": "function evaluateAdlRisk(insuranceFundBalance) {\n  return insuranceFundBalance <= 0\n    ? 'CRITICAL_RISK: INSURANCE_FUND_DEPLETED_ADL_ENGAGED'\n    : 'INSURANCE_FUND_SOLVENT_NOMINAL';\n}\n\nconsole.log(evaluateAdlRisk(0));\nconsole.log(evaluateAdlRisk(1000000));",
            "expectedOutput": "CRITICAL_RISK: INSURANCE_FUND_DEPLETED_ADL_ENGAGED\nINSURANCE_FUND_SOLVENT_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What emergency protocol is engaged by a crypto derivatives exchange when its insurance fund drops to zero during a cascade?",
          "expectedStringOutput": "CRITICAL_RISK: INSURANCE_FUND_DEPLETED_ADL_ENGAGED",
          "acceptableAnswers": [
            "CRITICAL_RISK: INSURANCE_FUND_DEPLETED_ADL_ENGAGED",
            "ADL_ENGAGED",
            "Auto-Deleveraging"
          ],
          "primaryMisconceptionId": "MC_QUANT_CRYPTO_PERPETUAL_FUTURES_FUNDING_RATE",
          "diagnosisMap": {
            "SOLVENT": {
              "misconceptionId": "MC_QUANT_CRYPTO_PERPETUAL_FUTURES_FUNDING_RATE",
              "errorExplanation": "Zero balance triggers auto-deleveraging (ADL).",
              "recoveryPath": {
                "simplerExplanation": "Matches CRITICAL_RISK: INSURANCE_FUND_DEPLETED_ADL_ENGAGED.",
                "guidedFixPrompt": "Type CRITICAL_RISK: INSURANCE_FUND_DEPLETED_ADL_ENGAGED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "High-Frequency Trading Infrastructure: FPGA & ASIC Offloading",
    "overviewMetaphor": "An FPGA is Burning Your Trading Strategy Directly into Silicon Hardware: in software C++, CPU instructions must be fetched, decoded, and executed through registers (Taking 800 nanoseconds); an FPGA (Field Programmable Gate Array) configures billions of physical logic gates (LUTs and Flip-Flops) that process 10-Gigabit Ethernet packets wire-speed as the photons exit the optical transceiver—executing tick-to-trade order generation in 45 nanoseconds.",
    "blocks": [
      {
        "id": "quant-d29-b1-fpga-logic-gate-synthesis",
        "day": 29,
        "blockNumber": 1,
        "title": "FPGA Architecture: Look-Up Tables (LUTs), Flip-Flops & VHDL/Verilog Pipelines",
        "conceptBudget": {
          "primaryConcept": "FPGA Hardware Pipeline Architecture",
          "supportingTerms": [
            "Look-Up Tables (LUTs: Configurable Boolean logic in hardware)",
            "Clock Frequency (300 MHz to 400 MHz $\\implies$ 2.5 to 3.3 ns per clock cycle!)",
            "Hardware Pipelining (Processing every byte on the wire without a single CPU instruction)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d11-b2-dpdk-poll-mode-drivers-pmd",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Software C++ vs FPGA Silicon Tick-to-Trade Latency",
              "boxes": [
                {
                  "label": "1. Optimized C++ with Kernel Bypass",
                  "value": "NIC -> PCIe DMA -> CPU Core -> C++ LOB Parser -> Strategy -> NIC: 800 nanoseconds",
                  "varType": "Software Path",
                  "isUpdated": false
                },
                {
                  "label": "2. FPGA Direct Hardware Pipeline",
                  "value": "10G PHY -> AXI Stream Parser -> Silicon Matching -> MAC Transmit: 45 NANOSECONDS! (18X FASTER!)",
                  "varType": "Hardware Silicon Path",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "fpga_eval_demo.js",
            "initialCode": "function evaluateHardwareLatency(arch) {\n  if (arch === 'FPGA') {\n    return { tickToTradeNs: 45, speedupVsSoftware: '18X_FASTER', status: 'FPGA_SILICON_PIPELINE_ACTIVE' };\n  }\n  return { tickToTradeNs: 800, speedupVsSoftware: 'BASELINE', status: 'OPTIMIZED_CPP_SOFTWARE' };\n}\n\nconsole.log(JSON.stringify(evaluateHardwareLatency('FPGA')));",
            "expectedOutput": "{\"tickToTradeNs\":45,\"speedupVsSoftware\":\"18X_FASTER\",\"status\":\"FPGA_SILICON_PIPELINE_ACTIVE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the typical tick-to-trade latency achieved by an FPGA trading engine compared to 800 nanoseconds in optimized C++ software?",
          "expectedStringOutput": "45",
          "acceptableAnswers": [
            "45",
            "45 ns",
            "45 nanoseconds",
            "tickToTradeNs\":45"
          ],
          "primaryMisconceptionId": "MC_QUANT_CAPSTONE_ULTRA_LOW_LATENCY_TRADING_ECOSYSTEM",
          "diagnosisMap": {
            "800": {
              "misconceptionId": "MC_QUANT_CAPSTONE_ULTRA_LOW_LATENCY_TRADING_ECOSYSTEM",
              "errorExplanation": "FPGA slashes latency from 800 ns down to 45 ns in silicon.",
              "recoveryPath": {
                "simplerExplanation": "FPGA achieves 45 ns.",
                "guidedFixPrompt": "Type 45"
              }
            }
          }
        }
      },
      {
        "id": "quant-d29-b2-axi-stream-packet-parsing",
        "day": 29,
        "blockNumber": 2,
        "title": "AXI4-Stream 10G/25G MAC Transceiver Direct Interface",
        "conceptBudget": {
          "primaryConcept": "AXI4-Stream Direct Wire Parsing",
          "supportingTerms": [
            "AXI4-Stream Protocol (`tdata`, `tvalid`, `tready`, `tlast`)",
            "64-Bit / 128-Bit Data Bus",
            "Parsing ITCH Packets in 3 Clock Cycles"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d29-b1-fpga-logic-gate-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "axi_stream_demo.js",
            "initialCode": "function evaluateAxiStream() {\n  return 'AXI4_STREAM_WIRE_SPEED_PARSING_NOMINAL';\n}\n\nconsole.log(evaluateAxiStream());",
            "expectedOutput": "AXI4_STREAM_WIRE_SPEED_PARSING_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status string confirms wire-speed packet parsing over an FPGA AXI4-Stream interface?",
          "expectedStringOutput": "AXI4_STREAM_WIRE_SPEED_PARSING_NOMINAL",
          "acceptableAnswers": [
            "AXI4_STREAM_WIRE_SPEED_PARSING_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_QUANT_CAPSTONE_ULTRA_LOW_LATENCY_TRADING_ECOSYSTEM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_QUANT_CAPSTONE_ULTRA_LOW_LATENCY_TRADING_ECOSYSTEM",
              "errorExplanation": "Matches AXI4_STREAM_WIRE_SPEED_PARSING_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type AXI4_STREAM_WIRE_SPEED_PARSING_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "quant-d29-b3-hybrid-fpga-cpu-architecture",
        "day": 29,
        "blockNumber": 3,
        "title": "Hybrid FPGA-CPU Co-Design: Fast-Path in Silicon, Complex Alpha in C++",
        "conceptBudget": {
          "primaryConcept": "Hybrid FPGA-CPU Co-Design",
          "supportingTerms": [
            "FPGA Fast Path (Simple cancellations, price band checks, immediate order executions)",
            "CPU Slow Path (Complex nonlinear alphas, portfolio risk optimization, logging)",
            "PCIe Gen4 / Gen5 DMA Ring Buffers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d29-b2-axi-stream-packet-parsing",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "hybrid_codesign_demo.js",
            "initialCode": "function evaluateCoDesign(path) {\n  if (path === 'FAST_PATH') return 'FAST_PATH_IN_FPGA_SILICON_45NS';\n  if (path === 'SLOW_PATH') return 'SLOW_PATH_IN_CPU_CPP_COMPLEX_ALPHA';\n  return 'UNKNOWN';\n}\n\nconsole.log(evaluateCoDesign('FAST_PATH'));\nconsole.log(evaluateCoDesign('SLOW_PATH'));",
            "expectedOutput": "FAST_PATH_IN_FPGA_SILICON_45NS\nSLOW_PATH_IN_CPU_CPP_COMPLEX_ALPHA",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where is the sub-50 nanosecond execution fast path executed in a modern hybrid trading architecture?",
          "expectedStringOutput": "FAST_PATH_IN_FPGA_SILICON_45NS",
          "acceptableAnswers": [
            "FAST_PATH_IN_FPGA_SILICON_45NS",
            "FPGA",
            "In Silicon"
          ],
          "primaryMisconceptionId": "MC_QUANT_CAPSTONE_ULTRA_LOW_LATENCY_TRADING_ECOSYSTEM",
          "diagnosisMap": {
            "CPU": {
              "misconceptionId": "MC_QUANT_CAPSTONE_ULTRA_LOW_LATENCY_TRADING_ECOSYSTEM",
              "errorExplanation": "Fast path is offloaded directly into FPGA silicon.",
              "recoveryPath": {
                "simplerExplanation": "Fast path runs in FPGA silicon.",
                "guidedFixPrompt": "Type FAST_PATH_IN_FPGA_SILICON_45NS"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Ultra-Low-Latency Quantitative Trading & Market Making System",
    "overviewMetaphor": "Day 30 Final Capstone Synthesis: The complete institutional quantitative engineering and low-latency trading platform: 1. NASDAQ ITCH 5.0 binary order book reconstruction; 2. Micro-price & Order Book Imbalance alpha signals; 3. Avellaneda-Stoikov market making inventory reservation pricing; 4. Pre-trade fat-finger risk controls; 5. Smart Order Routing (SOR) execution across multi-exchange venues.",
    "blocks": [
      {
        "id": "quant-d30-b1-capstone-architecture-orchestration",
        "day": 30,
        "blockNumber": 1,
        "title": "Enterprise Ultra-Low-Latency Trading Architecture Orchestration",
        "conceptBudget": {
          "primaryConcept": "Capstone Architecture Orchestration",
          "supportingTerms": [
            "ITCH 5.0 Parsing",
            "LOB FIFO Matching",
            "Micro-Price Alpha",
            "Avellaneda Quoting",
            "SOR Best Execution"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d29-b1-fpga-logic-gate-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "End-to-End Institutional Quantitative Trading Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "Kernel Bypass receives ITCH UDP multicast frame from exchange cross-connect",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Lock-free ring buffer streams order updates to LOB matching kernel in 40 ns",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Alpha engine evaluates Order Book Imbalance & Stoikov Micro-Price",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Avellaneda-Stoikov model skews quotes for inventory risk management",
                  "kind": "process"
                },
                {
                  "id": "5",
                  "label": "Pre-trade risk gateway validates notional and price collar bounds",
                  "kind": "process"
                },
                {
                  "id": "6",
                  "label": "Smart Order Router (SOR) dispatches latency-equalized OUCH orders!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "capstone_orchestration_demo.js",
            "initialCode": "function runInstitutionalHftSystem() {\n  return {\n    itchEngine: 'ONLINE_ZERO_ALLOCATION',\n    lobEngine: 'ONLINE_FIFO_PRICE_TIME_PRIORITY',\n    alphaEngine: 'ONLINE_MICRO_PRICE_OBI_EVALUATED',\n    marketMakingEngine: 'ONLINE_AVELLANEDA_STOIKOV_QUOTES',\n    preTradeRiskGateway: 'ONLINE_PRE_TRADE_LIMITS_ENFORCED',\n    sorEngine: 'ONLINE_REG_NMS_BEST_EXECUTION',\n    systemStatus: 'HFT_TRADING_PLATFORM_OPERATIONAL_NOMINAL'\n  };\n}\n\nconsole.log(runInstitutionalHftSystem().systemStatus);",
            "expectedOutput": "HFT_TRADING_PLATFORM_OPERATIONAL_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What platform status confirms active operational synthesis of the complete Capstone HFT System?",
          "expectedStringOutput": "HFT_TRADING_PLATFORM_OPERATIONAL_NOMINAL",
          "acceptableAnswers": [
            "HFT_TRADING_PLATFORM_OPERATIONAL_NOMINAL",
            "systemStatus: HFT_TRADING_PLATFORM_OPERATIONAL_NOMINAL"
          ],
          "primaryMisconceptionId": "MC_QUANT_CAPSTONE_ULTRA_LOW_LATENCY_TRADING_ECOSYSTEM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_QUANT_CAPSTONE_ULTRA_LOW_LATENCY_TRADING_ECOSYSTEM",
              "errorExplanation": "Matches HFT_TRADING_PLATFORM_OPERATIONAL_NOMINAL.",
              "recoveryPath": {
                "simplerExplanation": "Matches HFT_TRADING_PLATFORM_OPERATIONAL_NOMINAL.",
                "guidedFixPrompt": "Type HFT_TRADING_PLATFORM_OPERATIONAL_NOMINAL"
              }
            }
          }
        }
      },
      {
        "id": "quant-d30-b2-capstone-comprehensive-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Capstone Institutional Integrity & Production Certification Audit",
        "conceptBudget": {
          "primaryConcept": "Capstone Comprehensive Audit",
          "supportingTerms": [
            "Sub-Microsecond Latency Invariant",
            "Zero Risk Breach Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d30-b1-capstone-architecture-orchestration",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_audit_demo.js",
            "initialCode": "function auditCapstoneSystem(allModulesPassed) {\n  return {\n    all30DaysVerified: allModulesPassed,\n    score: '100/100',\n    grade: allModulesPassed ? 'ENTERPRISE_QUANT_SYSTEMS_CERTIFICATION_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditCapstoneSystem(true)));",
            "expectedOutput": "{\"all30DaysVerified\":true,\"score\":\"100/100\",\"grade\":\"ENTERPRISE_QUANT_SYSTEMS_CERTIFICATION_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification grade is awarded upon passing the comprehensive 30-day Capstone audit?",
          "expectedStringOutput": "ENTERPRISE_QUANT_SYSTEMS_CERTIFICATION_PASSED",
          "acceptableAnswers": [
            "ENTERPRISE_QUANT_SYSTEMS_CERTIFICATION_PASSED",
            "grade\":\"ENTERPRISE_QUANT_SYSTEMS_CERTIFICATION_PASSED\""
          ],
          "primaryMisconceptionId": "MC_QUANT_CAPSTONE_ULTRA_LOW_LATENCY_TRADING_ECOSYSTEM",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_QUANT_CAPSTONE_ULTRA_LOW_LATENCY_TRADING_ECOSYSTEM",
              "errorExplanation": "All modules passing awards ENTERPRISE_QUANT_SYSTEMS_CERTIFICATION_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards ENTERPRISE_QUANT_SYSTEMS_CERTIFICATION_PASSED.",
                "guidedFixPrompt": "Type ENTERPRISE_QUANT_SYSTEMS_CERTIFICATION_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "quant-d30-b3-quant-mastery-graduation",
        "day": 30,
        "blockNumber": 3,
        "title": "PinIT Career OS: Quantitative Engineering & Low-Latency Trading Mastery Certification",
        "conceptBudget": {
          "primaryConcept": "Final Course Graduation Certification",
          "supportingTerms": [
            "Quant Systems Mastery",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "quant-d30-b2-capstone-comprehensive-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "quant_graduation.js",
            "initialCode": "console.log('🏆 30-DAY QUANTITATIVE ENGINEERING & LOW-LATENCY TRADING SYSTEMS MASTERY CERTIFIED [100/100]');",
            "expectedOutput": "🏆 30-DAY QUANTITATIVE ENGINEERING & LOW-LATENCY TRADING SYSTEMS MASTERY CERTIFIED [100/100]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What graduation certification string confirms completion of all 30 days of Quantitative Engineering & Low-Latency Trading Systems?",
          "expectedStringOutput": "🏆 30-DAY QUANTITATIVE ENGINEERING & LOW-LATENCY TRADING SYSTEMS MASTERY CERTIFIED [100/100]",
          "acceptableAnswers": [
            "🏆 30-DAY QUANTITATIVE ENGINEERING & LOW-LATENCY TRADING SYSTEMS MASTERY CERTIFIED [100/100]",
            "MASTERY CERTIFIED [100/100]"
          ],
          "primaryMisconceptionId": "MC_QUANT_CAPSTONE_ULTRA_LOW_LATENCY_TRADING_ECOSYSTEM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_QUANT_CAPSTONE_ULTRA_LOW_LATENCY_TRADING_ECOSYSTEM",
              "errorExplanation": "Matches graduation header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type 🏆 30-DAY QUANTITATIVE ENGINEERING & LOW-LATENCY TRADING SYSTEMS MASTERY CERTIFIED [100/100]"
              }
            }
          }
        }
      }
    ]
  }
];
