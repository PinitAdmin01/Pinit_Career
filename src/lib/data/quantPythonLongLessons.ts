/**
 * Quantitative Trading Systems in Python: full-length lessons (about 20-30 minutes each), one per course day, written in plain
 * words for the Python track. Every code sample runs in the browser (Pyodide) and prints exactly
 * its `output`; tests/python_track_long_lessons.test.ts checks this and each lesson's length.
 * Days without a long lesson here still use the shorter lesson plan.
 */
import type { LongLesson } from './longLessons';

export const QUANT_PYTHON_LONG_LESSONS: LongLesson[] = [
  {
    "day": 1,
    "title": "Quantitative Engineering & Electronic Trading Foundations",
    "goal": "You can explain how electronic markets work, read a quote with bid, ask, spread and midpoint, measure the spread in ticks and basis points, and place prices correctly on the tick grid.",
    "minutes": 30,
    "recap": "This is the first day of the quantitative trading course. You know Python functions, lists and dictionaries; now you use them to model the machinery of real stock exchanges.",
    "parts": [
      {
        "title": "What an exchange does",
        "say": [
          "An exchange is a meeting place where buyers and sellers agree on prices. Today almost all of it is electronic: computers send orders, and the exchange's matching engine pairs them up.",
          "Participants include investors (pension funds, mutual funds, people like you), brokers who route their orders, and market makers who continuously offer to buy and sell.",
          "Quantitative (quant) engineers build the software on all sides: execution algorithms, market-making systems, risk checks, and the exchanges' own matching engines.",
          "Speed matters a lot in some parts of this world: the fastest firms react to market changes in microseconds (millionths of a second) or even nanoseconds.",
          "Correctness matters even more. A bug in a trading system can lose millions in minutes; the Knight Capital incident in 2012 lost about 440 million dollars in 45 minutes because of a deployment mistake.",
          "This course teaches both: the market ideas behind trading systems and the engineering that makes them fast and safe.",
          "The example lists the parts of a trading system you will build over the next 30 days."
        ],
        "example": "A busy vegetable market where stallholders shout prices and buyers bargain, now run entirely by computers that match every offer in millionths of a second.",
        "code": "modules = [(2, \"limit order book\"), (3, \"matching engine\"), (4, \"VWAP and TWAP execution\"),\n           (8, \"market making\"), (9, \"FIX messages\"), (12, \"lock-free queues\"),\n           (16, \"option pricing\"), (18, \"value at risk\"), (23, \"smart order routing\"), (27, \"pre-trade risk\")]\nfor day, name in modules:\n    print(f\"Day {day:2}: {name}\")",
        "output": "Day  2: limit order book\nDay  3: matching engine\nDay  4: VWAP and TWAP execution\nDay  8: market making\nDay  9: FIX messages\nDay 12: lock-free queues\nDay 16: option pricing\nDay 18: value at risk\nDay 23: smart order routing\nDay 27: pre-trade risk",
        "codeNotes": [
          {
            "line": 4,
            "note": "Each module is a real component of production trading systems."
          }
        ],
        "tryIt": "Which module would you expect to need the lowest latency, and which the highest correctness? Could they be the same?",
        "check": {
          "question": "What does an exchange's matching engine do?",
          "options": [
            "Sets prices by itself",
            "Pairs buy and sell orders according to its rules",
            "Stores investors' money"
          ],
          "answer": 1,
          "why": "The matching engine matches orders; prices come from what participants are willing to pay."
        }
      },
      {
        "title": "Bid, ask and spread",
        "say": [
          "The bid is the highest price someone is currently willing to pay. The ask (or offer) is the lowest price someone is willing to sell at.",
          "The best bid and best ask across all exchanges are called the NBBO, the National Best Bid and Offer, in US markets. India has a similar idea across NSE and BSE.",
          "The ask is always above the bid in a normal market. The gap between them is the spread, and it is the price of immediacy: buy now at the ask, or sell now at the bid.",
          "A tight spread (like 1 cent on a busy stock) means the market is liquid and cheap to trade. A wide spread means trading is expensive.",
          "If the bid equals the ask the market is locked; if the bid is above the ask it is crossed. Both are abnormal and systems must detect them, because some calculation will be wrong.",
          "Practice 1 is nbbo_spread(bid, ask, tick): spread, spread in ticks, midpoint and spread in basis points, and a ValueError for locked or crossed books.",
          "The example prints the spread for a liquid and an illiquid stock."
        ],
        "example": "A currency exchange booth: it buys dollars from you at one price and sells them at a higher price. The difference is how it earns its living.",
        "code": "quotes = {\"liquid stock\": (100.00, 100.01), \"illiquid stock\": (100.00, 100.40)}\nfor name, (bid, ask) in quotes.items():\n    spread = round(ask - bid, 4)\n    mid = (bid + ask) / 2\n    print(f\"{name:15} bid {bid} ask {ask} spread {spread} = {spread / mid * 10000:.1f} bp\")",
        "output": "liquid stock    bid 100.0 ask 100.01 spread 0.01 = 1.0 bp\nilliquid stock  bid 100.0 ask 100.4 spread 0.4 = 39.9 bp",
        "codeNotes": [
          {
            "line": 3,
            "note": "The spread is ask minus bid."
          },
          {
            "line": 5,
            "note": "A basis point (bp) is 0.01%, a standard unit for small price differences."
          }
        ],
        "tryIt": "If you buy 1,000 shares at the ask and sell them straight back at the bid, what does the spread cost you for each stock?",
        "check": {
          "question": "What is the spread?",
          "options": [
            "The daily price range",
            "The difference between the best ask and the best bid",
            "The exchange fee"
          ],
          "answer": 1,
          "why": "Spread = best ask - best bid."
        }
      },
      {
        "title": "The midpoint and basis points",
        "say": [
          "The midpoint is (bid + ask) / 2. It is the usual estimate of a stock's \"fair\" price right now, halfway between buyers and sellers.",
          "Many benchmarks use it: execution quality is often measured against the midpoint at the moment you decided to trade.",
          "Basis points make comparisons fair across prices. A 10-cent spread is tiny on a 3,000-rupee share and huge on a 30-rupee share; in basis points, the difference is obvious.",
          "spread_bps = spread / mid * 10000. One basis point is 0.01 percent; 100 basis points are 1 percent.",
          "Rounding carefully matters: financial code often rounds spreads and midpoints to 4 decimals and basis points to 2, and uses the same rules everywhere so results are reproducible.",
          "The example compares the same absolute spread on stocks at very different prices.",
          "Get used to thinking in basis points; it is the everyday language of trading desks."
        ],
        "example": "Comparing a 10-rupee discount on a pen and on a car: the same amount, but very different in percentage terms.",
        "code": "for price in [30.0, 300.0, 3000.0]:\n    bid, ask = price, price + 0.10\n    mid = (bid + ask) / 2\n    print(f\"price {price:7.1f}: spread 0.10 = {0.10 / mid * 10000:7.2f} bp\")",
        "output": "price    30.0: spread 0.10 =   33.28 bp\nprice   300.0: spread 0.10 =    3.33 bp\nprice  3000.0: spread 0.10 =    0.33 bp",
        "codeNotes": [
          {
            "line": 4,
            "note": "The same 10-paise spread in basis points."
          }
        ],
        "tryIt": "What spread in rupees would be 1 bp on a 3,000-rupee stock?",
        "check": {
          "question": "How many basis points is 1 percent?",
          "options": [
            "10",
            "100",
            "1000"
          ],
          "answer": 1,
          "why": "One basis point is 0.01%, so 1% is 100 bp."
        }
      },
      {
        "title": "Ticks and the price grid",
        "say": [
          "Exchanges do not accept any price. They have a minimum price increment called the tick size, such as 0.01 (1 cent) or 0.05 (5 paise).",
          "So valid prices form a grid: with a 0.05 tick, 100.00, 100.05 and 100.10 are allowed, but 100.03 is not.",
          "An order with an off-grid price is rejected. Trading systems must snap every price they compute (from a model or a formula) onto the grid.",
          "Which way to snap matters. A buy order should round DOWN, so it never pays more than intended; a sell should round UP, so it never sells for less. Rounding the other way makes the order more aggressive than the model wanted.",
          "Floating point makes this tricky: 0.3 / 0.1 is 2.9999999999999996, so a naive ceil gives 3 and a naive floor gives 2. Adding or subtracting a tiny epsilon fixes that.",
          "Practice 2 is snap_to_tick(price, tick, side): floor for buys, ceil for sells, with an epsilon, rounded to 4 decimals.",
          "The example shows the floating point trap and the fix."
        ],
        "example": "Parking bays painted on the ground: you must park inside a bay, and if you are unsure, you choose the bay that does not block anyone.",
        "code": "import math\n\nprint(\"0.3 / 0.1 =\", 0.3 / 0.1)\nprint(\"naive floor:\", math.floor(0.3 / 0.1), \" with epsilon:\", math.floor(0.3 / 0.1 + 1e-9))\n\ndef snap(price, tick, side):\n    steps = math.floor(price / tick + 1e-9) if side == \"BUY\" else math.ceil(price / tick - 1e-9)\n    return round(steps * tick, 4)\n\nfor p in [100.017, 100.011, 100.02]:\n    print(p, \"buy ->\", snap(p, 0.01, \"BUY\"), \" sell ->\", snap(p, 0.01, \"SELL\"))",
        "output": "0.3 / 0.1 = 2.9999999999999996\nnaive floor: 2  with epsilon: 3\n100.017 buy -> 100.01  sell -> 100.02\n100.011 buy -> 100.01  sell -> 100.02\n100.02 buy -> 100.02  sell -> 100.02",
        "codeNotes": [
          {
            "line": 3,
            "note": "Floating point division is not exact."
          },
          {
            "line": 7,
            "note": "Buys round down, sells round up, with a tiny epsilon."
          }
        ],
        "tryIt": "Snap 100.03 with a 0.05 tick for both sides. Which result is more aggressive?",
        "check": {
          "question": "A buy algorithm computes 100.017 with a 0.01 tick. Which price should it send?",
          "options": [
            "100.02",
            "100.01",
            "100.017"
          ],
          "answer": 1,
          "why": "Buys round down so they never pay more than intended."
        }
      },
      {
        "title": "Liquidity and market quality",
        "say": [
          "Liquidity is how easily you can trade without moving the price. It shows up as tight spreads and lots of shares waiting at the best prices (depth).",
          "Market makers provide liquidity by quoting both a bid and an ask. They earn the spread when both sides trade, and take the risk that the price moves against them in between.",
          "Traders who send orders that trade immediately take liquidity. Many exchanges charge them a fee and pay a rebate to those who provide it (Day 23).",
          "Liquidity varies: it is highest in the middle of the trading day for large stocks, and thin at the open, near the close, and in small stocks.",
          "Measures of market quality include the spread, the depth at the best prices, and how much the price moves when someone trades a given size (impact, Day 6).",
          "The example compares two stocks by spread and depth, and estimates the cost of buying 5,000 shares at once.",
          "Every later lesson builds on these ideas: execution, market making and routing are all about liquidity."
        ],
        "example": "A big supermarket with long shelves of every product (liquid) versus a tiny village shop with one of each item (illiquid).",
        "code": "books = {\n    \"large cap\": [(100.01, 3000), (100.02, 4000), (100.03, 5000)],\n    \"small cap\": [(100.10, 500), (100.40, 800), (101.00, 3000), (101.50, 2000)],\n}\nfor name, asks in books.items():\n    left, cost = 5000, 0.0\n    for price, size in asks:\n        take = min(left, size); cost += take * price; left -= take\n    print(f\"{name:9} average price to buy 5,000: {cost / 5000:.4f}\")",
        "output": "large cap average price to buy 5,000: 100.0140\nsmall cap average price to buy 5,000: 100.8840",
        "codeNotes": [
          {
            "line": 8,
            "note": "Walk up the ask side until the order is filled."
          }
        ],
        "tryIt": "How much more does the small-cap purchase cost than the large-cap one, in basis points?",
        "check": {
          "question": "Who provides liquidity?",
          "options": [
            "Traders sending market orders",
            "Market makers quoting both a bid and an ask",
            "The exchange itself"
          ],
          "answer": 1,
          "why": "Resting quotes from market makers are the liquidity others trade against."
        }
      },
      {
        "title": "Practice time: quotes and ticks",
        "say": [
          "Practice 1: nbbo_spread(bid, ask, tick=0.01). First raise ValueError if bid >= ask. Then compute the spread (rounded to 4), ticks = round(spread / tick), mid (rounded to 4) and spread_bps (rounded to 2).",
          "Round the spread before dividing by the tick, or 0.019999999 / 0.01 might give 1.9999999 and then round to 2 only by luck.",
          "Practice 2: snap_to_tick(price, tick, side). BUY uses math.floor(price / tick + 1e-9); SELL uses math.ceil(price / tick - 1e-9); multiply back by tick and round to 4 decimals.",
          "The checks include prices already on the grid (they must not move) and the 0.3 / 0.1 trap.",
          "These two helpers appear in every real trading system, usually in a shared library that every component uses, so all parts agree on prices.",
          "After passing, write a helper that checks whether a price is on the grid, and use it to validate orders.",
          "The example shows that validation helper."
        ],
        "example": "A ruler check at a woodwork class: every cut must land on a marked line, and a tiny tolerance allows for the pencil width.",
        "code": "def on_grid(price, tick):\n    steps = price / tick\n    return abs(steps - round(steps)) < 1e-9\n\nfor p in [100.05, 100.03, 0.3]:\n    print(p, \"on the 0.05 grid:\", on_grid(p, 0.05), \"| on the 0.1 grid:\", on_grid(p, 0.1))",
        "output": "100.05 on the 0.05 grid: True | on the 0.1 grid: False\n100.03 on the 0.05 grid: False | on the 0.1 grid: False\n0.3 on the 0.05 grid: True | on the 0.1 grid: True",
        "codeNotes": [
          {
            "line": 3,
            "note": "A price is on the grid if price / tick is (almost) a whole number."
          }
        ],
        "tryIt": "Why does the check use a tolerance instead of steps == round(steps)?",
        "check": {
          "question": "nbbo_spread(100.0, 100.0) should?",
          "options": [
            "Return a spread of 0",
            "Raise ValueError because the book is locked",
            "Return None"
          ],
          "answer": 1,
          "why": "A locked book (bid equals ask) is abnormal and must be flagged."
        }
      }
    ],
    "summary": [
      "Exchanges match buy and sell orders electronically; quant engineers build the systems around them.",
      "The bid is the best buying price, the ask the best selling price; spread = ask - bid.",
      "The midpoint (bid + ask) / 2 estimates the fair price; basis points (0.01%) compare costs fairly.",
      "Prices must sit on the tick grid: buys round down, sells round up, with care for floating point.",
      "Liquidity (tight spreads and deep books) makes trading cheap; market makers provide it."
    ],
    "projectStep": {
      "title": "Quote monitor",
      "steps": [
        "Write down bid and ask quotes for five stocks you know (real or made up).",
        "Print the spread in ticks and basis points, and flag any locked or crossed quote.",
        "Snap three model prices onto the tick grid for both buy and sell orders."
      ]
    }
  },
  {
    "day": 2,
    "title": "Limit Order Book (LOB) Architecture",
    "goal": "You can explain what a limit order book is, keep bids and asks sorted by price-time priority, insert new orders correctly, and compute cumulative depth for a depth-of-book view.",
    "minutes": 30,
    "recap": "Yesterday you read the best bid and ask. Behind those two numbers is a whole list of waiting orders at many prices: the limit order book.",
    "parts": [
      {
        "title": "Limit orders and market orders",
        "say": [
          "A limit order says: buy (or sell) this many shares at this price or better. If it cannot trade immediately, it waits in the book.",
          "A market order says: buy (or sell) this many shares now, at whatever prices are available. It never waits, but it can pay a lot in a thin market.",
          "Waiting limit orders are called resting orders. Together they form the limit order book (LOB): the bids on one side and the asks on the other.",
          "Each order has an id, a side, a price, a quantity, and a time of arrival. Orders can be modified or cancelled while they rest.",
          "Most orders placed by market makers are cancelled, not filled; in busy markets there can be dozens of cancellations for each trade.",
          "The example shows a small book with a few resting orders on each side.",
          "The book is the central data structure of every exchange and every trading strategy that looks at market depth."
        ],
        "example": "A notice board of \"wanted\" and \"for sale\" ads with prices: people pin ads and wait, or answer an existing ad to trade right away.",
        "code": "book = {\n    \"bids\": [{\"id\": \"b1\", \"price\": 100.00, \"qty\": 300}, {\"id\": \"b2\", \"price\": 99.99, \"qty\": 500}],\n    \"asks\": [{\"id\": \"a1\", \"price\": 100.02, \"qty\": 200}, {\"id\": \"a2\", \"price\": 100.05, \"qty\": 700}],\n}\nprint(\"best bid:\", book[\"bids\"][0][\"price\"], \"| best ask:\", book[\"asks\"][0][\"price\"])\nfor o in reversed(book[\"asks\"]):\n    print(f\"          ASK {o['price']:.2f} x {o['qty']}\")\nfor o in book[\"bids\"]:\n    print(f\"BID {o['price']:.2f} x {o['qty']}\")",
        "output": "best bid: 100.0 | best ask: 100.02\n          ASK 100.05 x 700\n          ASK 100.02 x 200\nBID 100.00 x 300\nBID 99.99 x 500",
        "codeNotes": [
          {
            "line": 5,
            "note": "The first element of each side is the best price."
          },
          {
            "line": 6,
            "note": "Asks are printed from highest to lowest, like a price ladder."
          }
        ],
        "tryIt": "Add a new bid at 100.01. Where should it go in the list?",
        "check": {
          "question": "What happens to a limit order that cannot trade immediately?",
          "options": [
            "It is cancelled",
            "It rests in the order book until it trades or is cancelled",
            "It becomes a market order"
          ],
          "answer": 1,
          "why": "Resting limit orders form the order book."
        }
      },
      {
        "title": "Price-time priority",
        "say": [
          "When several orders could trade, exchanges must decide who goes first. The most common rule is price-time priority.",
          "Price first: a higher bid beats a lower bid; a lower ask beats a higher ask. The best price always trades first.",
          "Time second: among orders at the same price, the one that arrived first trades first. This is first in, first out (FIFO).",
          "Price-time priority rewards being aggressive with price and being early. That is why market makers race to be first at a new price level.",
          "Some markets use pro-rata matching instead (sharing a fill among orders at a price by size), common in some futures markets. We use price-time throughout the course.",
          "So bids are kept sorted from the highest price down, and asks from the lowest price up, each with FIFO order inside a price.",
          "The example sorts a jumble of orders into price-time order with Python's sorted and a key."
        ],
        "example": "A queue at a bakery that lets the customer offering the highest price go first, and among equal offers, whoever arrived first.",
        "code": "orders = [(100.0, 3, \"b3\"), (100.5, 2, \"b2\"), (100.0, 1, \"b1\"), (99.5, 4, \"b4\")]   # price, arrival time, id\nbids = sorted(orders, key=lambda o: (-o[0], o[1]))\nprint(\"bid priority:\", [o[2] for o in bids])\nasks = sorted([(101.0, 5, \"a1\"), (100.8, 6, \"a2\"), (101.0, 2, \"a3\")], key=lambda o: (o[0], o[1]))\nprint(\"ask priority:\", [o[2] for o in asks])",
        "output": "bid priority: ['b2', 'b1', 'b3', 'b4']\nask priority: ['a2', 'a3', 'a1']",
        "codeNotes": [
          {
            "line": 2,
            "note": "Highest price first (negative price), then earliest time."
          },
          {
            "line": 4,
            "note": "Lowest price first, then earliest time."
          }
        ],
        "tryIt": "Two bids at 100.0 arrived at times 1 and 3. Which trades first, and why?",
        "check": {
          "question": "Under price-time priority, which bid trades first?",
          "options": [
            "The largest order",
            "The highest price, and among equal prices the earliest",
            "The newest order"
          ],
          "answer": 1,
          "why": "Price first, then time (FIFO)."
        }
      },
      {
        "title": "Inserting an order",
        "say": [
          "Sorting the whole book after every new order would be slow. Instead we insert each order at the right position.",
          "For a bid, walk from the best price down and stop at the first resting order with a strictly LOWER price; insert there. For an ask, stop at the first strictly HIGHER price.",
          "Using \"strictly\" is what gives time priority: a new order at an existing price goes after all orders already at that price.",
          "Practice 1 is insert_order(book, order): put BUY orders in bids and SELL orders in asks, following these rules, and return the book.",
          "Python's list.insert(position, item) puts the item before the element currently at that position; inserting at len(list) appends at the end.",
          "Real exchanges keep a separate FIFO queue per price level and an index from price to level, so an insert or cancel takes constant or logarithmic time. Our list version is the same logic, simpler to read.",
          "The example inserts orders one by one and prints the book after each."
        ],
        "example": "Joining a queue sorted by ticket class: you walk past everyone in a better class, and stand behind the last person in your own class.",
        "code": "def insert_order(book, order):\n    side = book[\"bids\"] if order[\"side\"] == \"BUY\" else book[\"asks\"]\n    worse = (lambda r: r[\"price\"] < order[\"price\"]) if order[\"side\"] == \"BUY\" else (lambda r: r[\"price\"] > order[\"price\"])\n    pos = next((i for i, r in enumerate(side) if worse(r)), len(side))\n    side.insert(pos, order)\n    return book\n\nbook = {\"bids\": [], \"asks\": []}\nfor oid, price in [(\"b1\", 100.0), (\"b2\", 100.5), (\"b3\", 100.0), (\"b4\", 99.0)]:\n    insert_order(book, {\"id\": oid, \"side\": \"BUY\", \"price\": price, \"qty\": 10})\n    print([f\"{o['id']}@{o['price']}\" for o in book[\"bids\"]])",
        "output": "['b1@100.0']\n['b2@100.5', 'b1@100.0']\n['b2@100.5', 'b1@100.0', 'b3@100.0']\n['b2@100.5', 'b1@100.0', 'b3@100.0', 'b4@99.0']",
        "codeNotes": [
          {
            "line": 3,
            "note": "A resting order is \"worse\" than the new one if its price is strictly worse."
          },
          {
            "line": 4,
            "note": "next() finds the first worse order, or the end of the list."
          }
        ],
        "tryIt": "Insert the same four orders as SELL orders. What order do the asks end up in?",
        "check": {
          "question": "A new bid at 100.0 arrives when bids at 100.0 already rest. Where does it go?",
          "options": [
            "Before them",
            "After them, keeping time priority",
            "It replaces them"
          ],
          "answer": 1,
          "why": "Equal price means it queues behind earlier orders at that price."
        }
      },
      {
        "title": "Price levels and depth",
        "say": [
          "Many screens show the book aggregated by price level: for each price, the total quantity of all orders at that price.",
          "Level 1 data is just the best bid and ask. Level 2 (market depth) shows several price levels. Level 3 shows every individual order.",
          "Cumulative depth adds up the quantity from the best price outwards: how many shares could you buy before the price reaches a certain level?",
          "Practice 2 is cumulative_depth(levels, n): given (price, qty) levels best first, return (price, running total) for the first n levels.",
          "Depth tells a trader how large an order the market can absorb, and it feeds the impact models (Day 6) and imbalance signals (Day 7).",
          "The example aggregates individual orders into price levels with a dictionary, then computes cumulative depth.",
          "Aggregation keeps the first-seen order of prices, which, for a sorted book, is best first."
        ],
        "example": "A water tank with marked levels: how much water you can draw before the level drops below each mark.",
        "code": "asks = [(100.02, 200), (100.02, 300), (100.03, 500), (100.05, 700), (100.05, 100)]\nlevels = {}\nfor price, qty in asks:\n    levels[price] = levels.get(price, 0) + qty\nprint(\"levels:\", levels)\ntotal, cumulative = 0, []\nfor price, qty in levels.items():\n    total += qty\n    cumulative.append((price, total))\nprint(\"cumulative depth:\", cumulative)",
        "output": "levels: {100.02: 500, 100.03: 500, 100.05: 800}\ncumulative depth: [(100.02, 500), (100.03, 1000), (100.05, 1800)]",
        "codeNotes": [
          {
            "line": 4,
            "note": "Sum the quantity of all orders at each price."
          },
          {
            "line": 8,
            "note": "Running total from the best price outwards."
          }
        ],
        "tryIt": "How many shares can you buy without paying more than 100.03?",
        "check": {
          "question": "What does level 2 market data show?",
          "options": [
            "Only the last trade",
            "Several price levels of the book with their quantities",
            "Every individual order"
          ],
          "answer": 1,
          "why": "Level 2 shows depth across price levels."
        }
      },
      {
        "title": "Cancels, modifies and data structures",
        "say": [
          "Orders are not only added. They are cancelled (removed) and modified (quantity or price changed), far more often than they trade.",
          "A cancel must find the order quickly. Real books keep a dictionary from order id to its location, so a cancel does not scan the whole book.",
          "Rules for modifies protect fairness: reducing quantity usually keeps time priority, but increasing quantity or changing price loses it, because otherwise traders could jump the queue.",
          "Efficient books use a sorted map of price levels (a tree, or an array indexed by tick for bounded ranges) with a FIFO list at each level.",
          "In Python, the example keeps an id index next to the lists and uses it to cancel.",
          "Measuring these operations in nanoseconds is what separates a toy book from an exchange-grade one; the logic, however, is exactly what you are writing today.",
          "Always test cancel and modify paths as carefully as inserts; bugs love the less common paths."
        ],
        "example": "A cloakroom with a ticket system: the ticket number tells the attendant exactly where your coat hangs, so they do not search every rail.",
        "code": "book = {\"bids\": [], \"asks\": []}\nindex = {}\ndef add(order):\n    side = book[\"bids\"] if order[\"side\"] == \"BUY\" else book[\"asks\"]\n    side.append(order)\n    index[order[\"id\"]] = side\ndef cancel(order_id):\n    side = index.pop(order_id, None)\n    if side is None:\n        return False\n    side[:] = [o for o in side if o[\"id\"] != order_id]\n    return True\nadd({\"id\": \"b1\", \"side\": \"BUY\", \"price\": 100.0, \"qty\": 5}); add({\"id\": \"b2\", \"side\": \"BUY\", \"price\": 99.9, \"qty\": 3})\nprint(cancel(\"b1\"), cancel(\"b1\"), [o[\"id\"] for o in book[\"bids\"]])",
        "output": "True False ['b2']",
        "codeNotes": [
          {
            "line": 6,
            "note": "Remember which side each order lives on."
          },
          {
            "line": 9,
            "note": "Cancelling an unknown or already-cancelled order is reported, not a crash."
          }
        ],
        "tryIt": "Add a modify(order_id, new_qty) that only allows reducing quantity. What should it return for an increase?",
        "check": {
          "question": "Why do exchanges usually take away time priority when an order's quantity is increased?",
          "options": [
            "To save memory",
            "Otherwise traders could jump the queue with more size",
            "It is a bug"
          ],
          "answer": 1,
          "why": "Keeping priority on a bigger order would be unfair to those queued behind."
        }
      },
      {
        "title": "Practice time: build the book",
        "say": [
          "Practice 1: insert_order(book, order). Choose the side list, define what \"worse\" means for that side, find the first worse resting order and insert before it (or at the end).",
          "The checks insert a mix of bids and asks, including two orders at the same price on each side, and verify both price order and FIFO order.",
          "Practice 2: cumulative_depth(levels, n). Loop over levels[:n] with a running total. Slicing beyond the end is safe in Python, and an empty side gives an empty list.",
          "Be careful with the comparison direction; swapping < and > sorts the book backwards, and the best price ends up last.",
          "Tomorrow you add matching, which reads these same lists from the front, so a correctly ordered book matters.",
          "After passing, write a book_snapshot function that prints the top 3 levels on each side in a ladder, as trading screens do.",
          "The example prints that ladder."
        ],
        "example": "Stocking shelves before a shop opens: if the best items are not at the front, the first customers get the wrong goods.",
        "code": "bids = [(100.00, 300), (99.99, 500), (99.98, 200)]\nasks = [(100.02, 200), (100.03, 400), (100.05, 700)]\nfor price, qty in reversed(asks):\n    print(f\"{'':10}{price:8.2f} {qty:5}\")\nprint(\"-\" * 25)\nfor price, qty in bids:\n    print(f\"{qty:5} {price:8.2f}\")",
        "output": "            100.05   700\n            100.03   400\n            100.02   200\n-------------------------\n  300   100.00\n  500    99.99\n  200    99.98",
        "codeNotes": [
          {
            "line": 3,
            "note": "Asks from highest to lowest so the best ask sits just above the line."
          }
        ],
        "tryIt": "What is the spread in this snapshot, and where would a new bid at 100.01 appear?",
        "check": {
          "question": "In a correctly ordered bids list, which order is first?",
          "options": [
            "The oldest bid",
            "The highest-priced bid (earliest among equals)",
            "The largest bid"
          ],
          "answer": 1,
          "why": "Bids are ordered by price (highest first), then time."
        }
      }
    ],
    "summary": [
      "Limit orders rest in the book; market orders trade immediately against it.",
      "Price-time priority: best price first, then earliest arrival (FIFO).",
      "Insert bids before the first strictly lower bid, asks before the first strictly higher ask.",
      "Depth aggregates quantity by price level; cumulative depth shows how much can trade up to each price.",
      "Cancels and modifies dominate order flow; fast books index orders by id."
    ],
    "projectStep": {
      "title": "Your own order book",
      "steps": [
        "Create an empty book and insert ten orders on both sides.",
        "Print a three-level ladder and the cumulative depth on each side.",
        "Add cancel by id and show the book before and after."
      ]
    }
  },
  {
    "day": 3,
    "title": "Order Book Matching Engine Implementation",
    "goal": "You can explain how a matching engine executes an incoming order against the book, implement price-time matching with partial fills and remainders, and compute the average price of the resulting trades.",
    "minutes": 30,
    "recap": "Yesterday you built a book of resting orders. Today orders start trading: a new order that crosses the spread meets resting orders, and the matching engine produces trades.",
    "parts": [
      {
        "title": "When does an order trade?",
        "say": [
          "An incoming buy order can trade if its limit price is at or above the best ask. An incoming sell can trade if its limit is at or below the best bid. We say the order crosses the spread.",
          "If it does not cross, it simply rests in the book (Day 2).",
          "If it crosses, the matching engine takes resting orders from the front of the opposite side, best price first and oldest first, until the incoming order is filled or no longer crosses.",
          "The trade price is the RESTING order's price. The resting order set its price first, so the newcomer gets that price, possibly better than its own limit.",
          "The incoming order is called the aggressor or taker; the resting order is the passive side or maker.",
          "The example checks whether several incoming orders would cross a given book.",
          "The whole matching engine is just these rules, applied exactly and quickly."
        ],
        "example": "Answering an ad: if someone advertises a bike for 5,000 rupees and you were willing to pay 5,500, you still pay the advertised 5,000.",
        "code": "best_bid, best_ask = 99.98, 100.02\nincoming = [(\"BUY\", 100.00), (\"BUY\", 100.02), (\"BUY\", 100.10), (\"SELL\", 99.99), (\"SELL\", 99.98)]\nfor side, limit in incoming:\n    crosses = limit >= best_ask if side == \"BUY\" else limit <= best_bid\n    print(f\"{side:4} at {limit:.2f}: {'trades' if crosses else 'rests in the book'}\")",
        "output": "BUY  at 100.00: rests in the book\nBUY  at 100.02: trades\nBUY  at 100.10: trades\nSELL at 99.99: rests in the book\nSELL at 99.98: trades",
        "codeNotes": [
          {
            "line": 4,
            "note": "A buy crosses if it reaches the best ask; a sell if it reaches the best bid."
          }
        ],
        "tryIt": "The buy at 100.10 trades. At what price does it trade, assuming the best ask is 100.02?",
        "check": {
          "question": "An incoming buy with limit 100.10 meets a resting ask at 100.02. What is the trade price?",
          "options": [
            "100.10",
            "100.02",
            "100.06"
          ],
          "answer": 1,
          "why": "Trades happen at the resting order's price."
        }
      },
      {
        "title": "Walking the book",
        "say": [
          "If the incoming order is bigger than the best resting order, it trades with that order completely, then moves to the next one, and so on.",
          "This is called walking (or sweeping) the book. Each step creates a separate trade with its own price and quantity.",
          "Each trade's quantity is min(remaining incoming quantity, resting quantity).",
          "A resting order that is completely filled is removed from the book. One that is partly filled stays at the front with its reduced quantity, keeping its time priority.",
          "Matching stops when the incoming order is filled, the opposite side is empty, or the next resting price no longer crosses the incoming limit.",
          "The example walks a buy order through three ask levels and prints each trade.",
          "Notice how a large order pays progressively worse prices; that is market impact in its simplest form."
        ],
        "example": "Buying 10 kg of mangoes at a market: the first stall has 3 kg at the best price, the next has 4 kg a little dearer, and so on until you have enough.",
        "code": "asks = [[\"a1\", 100.00, 3], [\"a2\", 100.10, 4], [\"a3\", 100.30, 9]]\nremaining, limit, trades = 6, 100.10, []\nwhile remaining and asks and asks[0][1] <= limit:\n    oid, price, qty = asks[0]\n    take = min(remaining, qty)\n    trades.append((oid, price, take))\n    remaining -= take\n    asks[0][2] -= take\n    if asks[0][2] == 0:\n        asks.pop(0)\nprint(\"trades:\", trades)\nprint(\"book after:\", asks, \"| unfilled:\", remaining)",
        "output": "trades: [('a1', 100.0, 3), ('a2', 100.1, 3)]\nbook after: [['a2', 100.1, 1], ['a3', 100.3, 9]] | unfilled: 0",
        "codeNotes": [
          {
            "line": 3,
            "note": "Keep matching while there is quantity left and the best ask still crosses."
          },
          {
            "line": 9,
            "note": "Fully filled resting orders leave the book."
          }
        ],
        "tryIt": "Raise the limit to 100.30 and the quantity to 20. What trades happen, and what is left?",
        "check": {
          "question": "A resting order of 4 shares meets an incoming order for 3. What happens to the resting order?",
          "options": [
            "It is removed",
            "It stays at the front with 1 share left",
            "It moves to the back of the queue"
          ],
          "answer": 1,
          "why": "Partly filled resting orders keep their place with reduced quantity."
        }
      },
      {
        "title": "Remainders rest in the book",
        "say": [
          "If a limit order still has quantity after matching stops, the remainder rests in the book at the order's limit price, just like a new non-crossing order.",
          "It is inserted with the same price-time rules as on Day 2, which usually makes it the new best price on its side.",
          "Practice 1 is match_order(book, incoming): return the list of trades as (resting_id, price, qty) and the remaining quantity, changing the book in place and resting any remainder.",
          "A market order (no limit) would instead be cancelled if unfilled; some order types, like immediate-or-cancel (IOC), also cancel the rest instead of resting it.",
          "Correct remainder handling is essential; a bug that drops or duplicates the remainder changes how many shares a client owns.",
          "The example sends a buy that partly fills, then shows it resting as the new best bid.",
          "Look closely at the book before and after; every change should be explainable by the rules."
        ],
        "example": "Ordering 10 books from a shop that has only 6 in stock: you take the 6 and leave a standing order for the other 4.",
        "code": "book = {\"bids\": [{\"id\": \"b1\", \"price\": 99.9, \"qty\": 5}], \"asks\": [{\"id\": \"a1\", \"price\": 100.1, \"qty\": 1}]}\nincoming = {\"id\": \"y\", \"side\": \"BUY\", \"price\": 100.2, \"qty\": 4}\ntrades, remaining = [], incoming[\"qty\"]\nwhile remaining and book[\"asks\"] and book[\"asks\"][0][\"price\"] <= incoming[\"price\"]:\n    r = book[\"asks\"][0]; q = min(remaining, r[\"qty\"])\n    trades.append((r[\"id\"], r[\"price\"], q)); remaining -= q; r[\"qty\"] -= q\n    if r[\"qty\"] == 0: book[\"asks\"].pop(0)\nif remaining:\n    book[\"bids\"].insert(0, dict(incoming, qty=remaining))    # best price, so it goes first here\nprint(\"trades:\", trades, \"remaining:\", remaining)\nprint(\"bids now:\", [(o[\"id\"], o[\"price\"], o[\"qty\"]) for o in book[\"bids\"]])",
        "output": "trades: [('a1', 100.1, 1)] remaining: 3\nbids now: [('y', 100.2, 3), ('b1', 99.9, 5)]",
        "codeNotes": [
          {
            "line": 8,
            "note": "The unfilled part becomes a resting bid."
          },
          {
            "line": 9,
            "note": "At 100.2 it beats 99.9, so it becomes the best bid."
          }
        ],
        "tryIt": "Why is inserting at position 0 correct here but not in general? What should the code use instead?",
        "check": {
          "question": "After a buy order partly fills, where does the remainder go?",
          "options": [
            "It is discarded",
            "It rests on the bid side at its limit price",
            "It rests on the ask side"
          ],
          "answer": 1,
          "why": "The unfilled buy quantity becomes a resting bid."
        }
      },
      {
        "title": "Average fill price",
        "say": [
          "When an order fills in several trades at different prices, clients want one number: the average price they paid or received.",
          "It must be weighted by quantity: buying 1 share at 100 and 3 shares at 101 averages 100.75, not 100.5.",
          "The formula is the volume-weighted average: sum(price × qty) / sum(qty).",
          "Practice 2 is average_fill_price(trades), rounded to 4 decimals, returning 0.0 for no trades so reports never divide by zero.",
          "This same calculation, done over all market trades in a period, is the VWAP benchmark you will use tomorrow.",
          "Brokers compare a client's average price with benchmarks like the arrival midpoint or the day's VWAP to show execution quality.",
          "The example computes the average for the trades from the walking example."
        ],
        "example": "Working out the average price per kilo after buying mangoes from three stalls at different prices and weights.",
        "code": "trades = [(\"a1\", 100.00, 3), (\"a2\", 100.10, 3)]\nqty = sum(q for _, _, q in trades)\navg = sum(p * q for _, p, q in trades) / qty\nsimple = sum(p for _, p, _ in trades) / len(trades)\nprint(\"volume-weighted average:\", round(avg, 4))\nprint(\"simple average of prices:\", round(simple, 4))\ntrades2 = [(\"x\", 100.0, 1), (\"y\", 101.0, 3)]\nprint(\"weighted:\", sum(p * q for _, p, q in trades2) / sum(q for *_, q in trades2), \" simple:\", (100 + 101) / 2)",
        "output": "volume-weighted average: 100.05\nsimple average of prices: 100.05\nweighted: 100.75  simple: 100.5",
        "codeNotes": [
          {
            "line": 3,
            "note": "Weight each price by its quantity."
          },
          {
            "line": 8,
            "note": "With unequal sizes, the simple average is wrong."
          }
        ],
        "tryIt": "Which average would a client care about, and why?",
        "check": {
          "question": "Trades: 1 share at 100, 3 shares at 101. What is the average fill price?",
          "options": [
            "100.5",
            "100.75",
            "101"
          ],
          "answer": 1,
          "why": "(100 × 1 + 101 × 3) / 4 = 100.75."
        }
      },
      {
        "title": "Determinism and testing",
        "say": [
          "A matching engine must be deterministic: the same sequence of orders must always produce exactly the same trades and the same book.",
          "Exchanges rely on this for fairness, regulation and recovery. If a matching server fails, a backup replays the same input sequence and must arrive at the identical state.",
          "Determinism means no randomness, no dependence on timing inside the engine, and a single sequence (a sequencer) that orders all incoming messages.",
          "It also makes testing powerful: record real order sequences, replay them, and compare the output with a known-good result, event by event.",
          "Invariants make great tests: the book must never be crossed after matching, quantities must never go negative, and total shares bought must equal total shares sold.",
          "The example checks two of those invariants after a series of orders.",
          "In interviews for exchange and trading roles, explaining these invariants is often worth as much as writing the code."
        ],
        "example": "A board game referee who follows the rule book exactly, so a game replayed from the same moves always ends the same way.",
        "code": "trades = [(\"a1\", 100.0, 3), (\"a2\", 100.1, 3), (\"b1\", 99.9, 5)]\nprint(\"volume from trades:\", sum(q for *_, q in trades))\nbest_bid, best_ask = 99.9, 100.3\nprint(\"book not crossed:\", best_bid < best_ask)\nprint(\"no negative quantities:\", all(q > 0 for *_, q in trades))",
        "output": "volume from trades: 11\nbook not crossed: True\nno negative quantities: True",
        "codeNotes": [
          {
            "line": 4,
            "note": "After matching, the best bid must be below the best ask."
          }
        ],
        "tryIt": "Write one more invariant that should always hold for a correct matching engine.",
        "check": {
          "question": "Why must a matching engine be deterministic?",
          "options": [
            "To be faster",
            "So replaying the same orders always gives the same trades, for fairness and recovery",
            "To reduce memory"
          ],
          "answer": 1,
          "why": "Replayable, identical results underpin fairness, audit and failover."
        }
      },
      {
        "title": "Practice time: match orders",
        "say": [
          "Practice 1: match_order(book, incoming). Pick the opposite side and a crossing test, then loop: take the front resting order, trade min(remaining, its qty) at its price, reduce both, remove it if empty.",
          "After the loop, if anything remains, insert the remainder (a copy of the incoming order with the new quantity) using the Day 2 insert rules.",
          "Return {\"trades\": [...], \"remaining\": n}. The checks run three orders in a row on the same book, so earlier changes must be correct for later checks to pass.",
          "Watch the SELL direction: a sell crosses when the bid is >= its limit, and walks the bids from the highest price down.",
          "Practice 2: average_fill_price(trades). A one-line weighted average with a guard for an empty list.",
          "Tomorrow's execution algorithms decide WHEN and HOW MUCH to send; this engine decides what happens when those orders arrive.",
          "The example shows the book never crossing after a sequence of matches."
        ],
        "example": "Checking a scale after every weighing: if it ever shows a negative weight, something is broken.",
        "code": "book_states = [(99.9, 100.1), (99.9, 100.3), (100.2, 100.3), (99.9, 100.2)]\nfor i, (bid, ask) in enumerate(book_states, 1):\n    print(f\"after order {i}: best bid {bid}, best ask {ask}, crossed: {bid >= ask}\")",
        "output": "after order 1: best bid 99.9, best ask 100.1, crossed: False\nafter order 2: best bid 99.9, best ask 100.3, crossed: False\nafter order 3: best bid 100.2, best ask 100.3, crossed: False\nafter order 4: best bid 99.9, best ask 100.2, crossed: False",
        "codeNotes": [
          {
            "line": 3,
            "note": "A correct engine never leaves the book crossed."
          }
        ],
        "tryIt": "Why can the book never be crossed after a correct match? Explain in one sentence.",
        "check": {
          "question": "An incoming SELL at 99.0 meets bids at 100.2 and 99.9. In what order does it trade?",
          "options": [
            "99.9 then 100.2",
            "100.2 then 99.9",
            "Only 99.9"
          ],
          "answer": 1,
          "why": "A sell walks the bids from the highest (best) price down."
        }
      }
    ],
    "summary": [
      "An order crosses the spread when a buy reaches the best ask or a sell reaches the best bid.",
      "Trades happen at the resting order's price, best price and oldest first.",
      "Large orders walk the book; partly filled resting orders keep their priority.",
      "Unfilled limit remainders rest in the book with the usual insert rules.",
      "Average fill price is volume-weighted; matching engines must be deterministic and keep invariants."
    ],
    "projectStep": {
      "title": "Mini exchange",
      "steps": [
        "Build a book with five resting orders per side.",
        "Send three crossing orders and print every trade and the book after each.",
        "Check the invariants: not crossed, no negative quantities, bought equals sold."
      ]
    }
  },
  {
    "day": 4,
    "title": "Algorithmic Execution: VWAP & TWAP Strategies",
    "goal": "You can explain why large orders are split over time, build a VWAP schedule from a volume profile, build a TWAP schedule, make slice sizes add up exactly, and compare the two strategies.",
    "minutes": 30,
    "recap": "Yesterday you saw a large order walk the book and pay worse prices. Big investors avoid that by splitting orders into many small child orders over time. Today you build the two classic schedules.",
    "parts": [
      {
        "title": "Why split an order?",
        "say": [
          "A pension fund that wants to buy 500,000 shares cannot send one huge order. It would walk deep into the book and pay far more than the displayed price.",
          "Showing a huge order also leaks information: others see it, move their prices, and the cost rises further.",
          "Execution algorithms split the parent order into many small child orders, sent over minutes or hours, each small enough to trade near the best price.",
          "The trade-off: going slowly reduces impact but exposes you to the risk that the price drifts away while you wait. Going fast reduces that risk but increases impact. Day 6 puts numbers on this.",
          "Brokers offer standard algorithms: TWAP, VWAP, percentage of volume (POV) and implementation shortfall. Clients pick based on urgency and benchmark.",
          "The example compares the cost of buying at once versus in slices, with a toy impact model.",
          "Execution is where many quant engineers start, because every investor needs it."
        ],
        "example": "Carrying a sofa up the stairs in pieces rather than forcing the whole thing through a narrow door.",
        "code": "def impact(qty, depth_per_level=10000, tick=0.01):\n    levels = qty / depth_per_level\n    return levels * tick / 2         # rough average extra price paid\n\ntotal = 100000\nat_once = impact(total) * total\nslices = 20\nin_slices = slices * impact(total / slices) * (total / slices)\nprint(f\"extra cost buying at once: {at_once:,.0f}\")\nprint(f\"extra cost in {slices} slices: {in_slices:,.0f}\")",
        "output": "extra cost buying at once: 5,000\nextra cost in 20 slices: 250",
        "codeNotes": [
          {
            "line": 2,
            "note": "A bigger order eats more levels of the book."
          },
          {
            "line": 8,
            "note": "Each small slice only touches the top of the book."
          }
        ],
        "tryIt": "Use 100 slices. Does the cost keep falling? What risk grows as you slice more finely?",
        "check": {
          "question": "What is the main reason to split a large order into child orders?",
          "options": [
            "To pay more fees",
            "To reduce market impact and information leakage",
            "Exchanges forbid large orders"
          ],
          "answer": 1,
          "why": "Small child orders trade near the best price and reveal less."
        }
      },
      {
        "title": "The VWAP benchmark",
        "say": [
          "VWAP, the volume-weighted average price, is the average price of all trades in the market over a period, weighted by their size.",
          "It is the most common benchmark for execution quality: if you bought below the day's VWAP, you did better than the average participant.",
          "A VWAP strategy tries to match that benchmark by trading in proportion to market volume: more when the market is busy, less when it is quiet.",
          "Market volume follows a predictable daily pattern, often a U shape: heavy at the open, lighter at midday, heavy again into the close.",
          "Historical data gives a volume profile: the expected share of the day's volume in each time bin, for example each 30 minutes.",
          "The example computes the market VWAP of a small list of trades and shows a typical U-shaped profile.",
          "Remember: the formula is the same weighted average you wrote yesterday, applied to the whole market."
        ],
        "example": "Timing grocery shopping to when the market is busiest, so your purchases blend into the crowd.",
        "code": "market_trades = [(100.0, 5000), (100.2, 2000), (100.1, 3000), (99.9, 10000)]\nvwap = sum(p * q for p, q in market_trades) / sum(q for _, q in market_trades)\nprint(\"market VWAP:\", round(vwap, 4))\nprofile = {\"09:15\": 0.18, \"10:15\": 0.10, \"11:15\": 0.08, \"12:15\": 0.07, \"13:15\": 0.08, \"14:15\": 0.14, \"15:15\": 0.35}\nfor bin_start, share in profile.items():\n    print(f\"{bin_start} {share:4.0%} {'#' * int(share * 60)}\")",
        "output": "market VWAP: 99.985\n09:15  18% ##########\n10:15  10% ######\n11:15   8% ####\n12:15   7% ####\n13:15   8% ####\n14:15  14% ########\n15:15  35% #####################",
        "codeNotes": [
          {
            "line": 2,
            "note": "VWAP: volume-weighted average of all market trades."
          },
          {
            "line": 6,
            "note": "A U-shaped day: busy open, quiet midday, busiest close."
          }
        ],
        "tryIt": "If you bought at an average of 99.95, did you beat this VWAP?",
        "check": {
          "question": "What does a VWAP strategy try to do?",
          "options": [
            "Trade everything at the open",
            "Trade in proportion to expected market volume to match the VWAP benchmark",
            "Only trade at the close"
          ],
          "answer": 1,
          "why": "Following the volume profile keeps your average close to the market VWAP."
        }
      },
      {
        "title": "Building a VWAP schedule",
        "say": [
          "Given a total order size and a volume profile, the schedule gives each time bin total × share shares.",
          "Rounding each slice to a whole number of shares can make the total slightly wrong: 1,001 shares split three ways rounds to 334 + 334 + 334 = 1,002.",
          "The fix is the remainder trick from the NLP course and from budgeting: round all but the last bin, and give the last bin whatever is left.",
          "Practice 1 is vwap_schedule(total, volume_pcts): the list of slice sizes, adding up exactly to total.",
          "Real VWAP engines also adapt during the day: if actual volume runs ahead of the forecast, they speed up; if behind, they slow down.",
          "They also split each bin into smaller child orders and choose limit or market orders based on the book, which later lessons cover.",
          "The example shows the rounding problem and the fix side by side."
        ],
        "example": "Dividing a bill among friends by how much each ordered, then letting the last person cover the few paise of rounding.",
        "code": "total = 1001\npcts = [0.3333, 0.3333, 0.3334]\nnaive = [round(total * p) for p in pcts]\nfixed = [round(total * p) for p in pcts[:-1]]\nfixed.append(total - sum(fixed))\nprint(\"naive:\", naive, \"sum\", sum(naive))\nprint(\"fixed:\", fixed, \"sum\", sum(fixed))",
        "output": "naive: [334, 334, 334] sum 1002\nfixed: [334, 334, 333] sum 1001",
        "codeNotes": [
          {
            "line": 3,
            "note": "Rounding every bin can over- or under-shoot the total."
          },
          {
            "line": 5,
            "note": "The last bin absorbs the difference."
          }
        ],
        "tryIt": "Use the U-shaped profile from the previous part for a 250,000-share order. What does the last bin get?",
        "check": {
          "question": "Why give the last bin \"whatever is left\"?",
          "options": [
            "It is the busiest bin",
            "So the slices always add up exactly to the parent order",
            "To finish early"
          ],
          "answer": 1,
          "why": "The remainder guarantees the exact total despite rounding."
        }
      },
      {
        "title": "TWAP: equal slices over time",
        "say": [
          "TWAP, time-weighted average price, is simpler: split the order into equal slices at regular intervals, ignoring volume.",
          "It is useful when no good volume profile exists (new or thinly traded stocks) or when a client wants a steady, predictable pace.",
          "The number of slices is duration // interval. The base slice is qty // slices; when qty does not divide evenly, give one extra share to the first qty % slices slices.",
          "Python's divmod(qty, n) returns both the quotient and the remainder in one step.",
          "Practice 2 is twap_schedule(qty, duration_min, interval_min), raising ValueError if there would be no slices.",
          "A weakness of TWAP is predictability: others can detect regular orders every 10 minutes and trade ahead of them. Real TWAPs add randomness to timing and size.",
          "The example builds TWAP schedules for a few cases."
        ],
        "example": "Watering a garden with the same amount every hour, regardless of the weather.",
        "code": "def twap_schedule(qty, duration_min, interval_min):\n    n = duration_min // interval_min\n    if n <= 0:\n        raise ValueError(\"no slices\")\n    base, extra = divmod(qty, n)\n    return [base + (1 if i < extra else 0) for i in range(n)]\n\nprint(twap_schedule(1200, 60, 10))\nprint(twap_schedule(1000, 30, 10))\nprint(twap_schedule(7, 60, 15))",
        "output": "[200, 200, 200, 200, 200, 200]\n[334, 333, 333]\n[2, 2, 2, 1]",
        "codeNotes": [
          {
            "line": 5,
            "note": "divmod gives the base size and how many slices need one extra share."
          },
          {
            "line": 6,
            "note": "The first \"extra\" slices get one more share."
          }
        ],
        "tryIt": "How would you add a random jitter of up to 10 percent to each slice while keeping the total exact?",
        "check": {
          "question": "twap_schedule(1000, 30, 10) gives?",
          "options": [
            "[333, 333, 334]",
            "[334, 333, 333]",
            "[333, 333, 333]"
          ],
          "answer": 1,
          "why": "1000 = 3 × 333 + 1, so the first slice gets the extra share."
        }
      },
      {
        "title": "Choosing and measuring an algorithm",
        "say": [
          "VWAP suits clients benchmarked to the day's VWAP and orders that are a small share of daily volume.",
          "TWAP suits steady execution when volume is unpredictable. Percentage of volume (POV) trades a fixed share of market volume, for example 10 percent, as it happens.",
          "Implementation shortfall algorithms front-load execution to reduce the risk of price drift, measuring cost against the price when the decision was made (Day 6).",
          "Participation limits matter: trading more than 10 to 20 percent of market volume in a bin usually moves the price noticeably.",
          "After the order finishes, a transaction cost analysis (TCA) report compares the achieved price with benchmarks: arrival price, interval VWAP and closing price.",
          "The example checks a VWAP schedule against a participation limit for each bin.",
          "Good execution is measured, not assumed."
        ],
        "example": "Choosing a route home: the fastest road (urgent), the scenic road at a steady pace (TWAP), or following the flow of traffic (VWAP).",
        "code": "schedule = [2000, 1000, 1000, 1500, 4500]\nexpected_market = [15000, 12000, 9000, 11000, 20000]\nlimit = 0.15\nfor i, (mine, market) in enumerate(zip(schedule, expected_market)):\n    share = mine / market\n    flag = \"TOO HIGH\" if share > limit else \"ok\"\n    print(f\"bin {i}: {mine:5} of {market:6} = {share:5.1%} {flag}\")",
        "output": "bin 0:  2000 of  15000 = 13.3% ok\nbin 1:  1000 of  12000 =  8.3% ok\nbin 2:  1000 of   9000 = 11.1% ok\nbin 3:  1500 of  11000 = 13.6% ok\nbin 4:  4500 of  20000 = 22.5% TOO HIGH",
        "codeNotes": [
          {
            "line": 5,
            "note": "Our share of the expected market volume in each bin."
          }
        ],
        "tryIt": "Rebalance the schedule so no bin exceeds 15 percent while keeping the total the same.",
        "check": {
          "question": "Why limit participation to a share of market volume?",
          "options": [
            "Exchanges require it",
            "Trading too large a share of volume moves the price against you",
            "It is cheaper in fees"
          ],
          "answer": 1,
          "why": "High participation increases market impact."
        }
      },
      {
        "title": "Practice time: schedules",
        "say": [
          "Practice 1: vwap_schedule(total, volume_pcts). Round all bins except the last, then append total minus the sum so far.",
          "The checks include a clean profile, a profile where naive rounding would give 1,002 for a 1,001-share order, and a single bin.",
          "Practice 2: twap_schedule(qty, duration_min, interval_min). Compute the number of slices, raise ValueError if it is zero, then use divmod.",
          "Both functions must always return slices adding up exactly to the parent order; the checks test that.",
          "In production, these schedules drive a loop that sends child orders, watches fills, and re-plans when reality differs from the plan.",
          "After passing, simulate that loop: at each bin, \"fill\" 90 percent of the planned slice and carry the shortfall into the next bin.",
          "The example shows that carry-forward loop."
        ],
        "example": "A delivery driver who could not drop every parcel on the morning round and adds the leftovers to the afternoon round.",
        "code": "plan = [200, 200, 200, 200, 200]\ncarry, filled_total = 0, 0\nfor i, planned in enumerate(plan):\n    target = planned + carry\n    filled = int(target * 0.9) if i < len(plan) - 1 else target\n    carry = target - filled\n    filled_total += filled\n    print(f\"bin {i}: target {target}, filled {filled}, carry {carry}\")\nprint(\"total filled:\", filled_total)",
        "output": "bin 0: target 200, filled 180, carry 20\nbin 1: target 220, filled 198, carry 22\nbin 2: target 222, filled 199, carry 23\nbin 3: target 223, filled 200, carry 23\nbin 4: target 223, filled 223, carry 0\ntotal filled: 1000",
        "codeNotes": [
          {
            "line": 4,
            "note": "Add what was missed earlier to this bin's target."
          },
          {
            "line": 5,
            "note": "In the last bin we must finish the order."
          }
        ],
        "tryIt": "What happens to the final bin's size if every earlier bin fills only 50 percent?",
        "check": {
          "question": "vwap_schedule(50, [1.0]) returns?",
          "options": [
            "[]",
            "[50]",
            "[0, 50]"
          ],
          "answer": 1,
          "why": "A single bin receives the whole order."
        }
      }
    ],
    "summary": [
      "Large orders are split into child orders to reduce impact and information leakage.",
      "VWAP is the volume-weighted average market price; VWAP strategies follow the volume profile.",
      "Round all but the last bin and give the last bin the remainder so slices add up exactly.",
      "TWAP splits evenly over time; divmod handles the leftover shares.",
      "Limit participation, measure results with TCA, and re-plan when fills differ from the plan."
    ],
    "projectStep": {
      "title": "Execution planner",
      "steps": [
        "Write a seven-bin volume profile for a trading day.",
        "Build VWAP and TWAP schedules for a 100,000-share order and compare them bin by bin.",
        "Check participation against expected market volume and fix any bin above 15 percent."
      ]
    }
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Limit Order Book & Matching Engine Kernel",
    "goal": "You can run a complete limit order book and matching engine over a stream of orders, report trades, volume and the final best prices, and measure engine throughput and latency per order.",
    "minutes": 30,
    "recap": "Milestone 1 connects the tick grid (Day 1), the order book (Day 2), matching (Day 3) and execution schedules (Day 4) into a working exchange core you can benchmark.",
    "parts": [
      {
        "title": "The exchange core",
        "say": [
          "An exchange core has three stages in a line. The gateway receives orders from members and checks them. The sequencer puts all messages into one strict order. The matching engine applies them to the book.",
          "Downstream, a market data publisher sends out book updates and trades, and a drop copy sends each member its own executions.",
          "Because the sequencer produces a single ordered stream, the matching engine can be a simple loop: take the next message, apply it, publish the results.",
          "Most matching engines are single-threaded per instrument. That sounds slow, but it avoids locks entirely, and a well-written loop handles millions of messages per second.",
          "Today you build the loop: feed a list of orders through your match_order and summarise the result.",
          "The example prints the flow of one order through the stages.",
          "Keep the stages in mind; the later lessons on queues (Day 12) and messaging (Day 15) connect them."
        ],
        "example": "A post office where a single clerk stamps every letter with a sequence number before a sorter handles them strictly in that order.",
        "code": "stages = [\"gateway: validate the order\", \"sequencer: assign sequence number 1042\",\n          \"matching engine: match against the book\", \"market data: publish trade and new best prices\",\n          \"drop copy: send the execution report to the member\"]\nfor step, stage in enumerate(stages, 1):\n    print(f\"{step}. {stage}\")",
        "output": "1. gateway: validate the order\n2. sequencer: assign sequence number 1042\n3. matching engine: match against the book\n4. market data: publish trade and new best prices\n5. drop copy: send the execution report to the member",
        "codeNotes": [
          {
            "line": 4,
            "note": "Every order passes through the same stages in the same order."
          }
        ],
        "tryIt": "What could go wrong if two matching threads worked on the same book at once without coordination?",
        "check": {
          "question": "Why are matching engines often single-threaded per instrument?",
          "options": [
            "Computers have one core",
            "A single ordered loop avoids locks and keeps matching deterministic",
            "It is required by law"
          ],
          "answer": 1,
          "why": "One thread per book gives determinism without locking costs."
        }
      },
      {
        "title": "Processing a stream of orders",
        "say": [
          "Practice 1 is run_matching(orders): start with an empty book, send every order through the matching engine, and report the number of trades, the total volume, and the final best bid and ask.",
          "Reuse your Day 3 match_order and the Day 2 insert rules; the milestone is about connecting pieces, not rewriting them.",
          "Pass a copy of each order (dict(o)) into the engine, because the engine changes resting quantities, and changing the caller's input data is a classic source of confusing bugs.",
          "Report None for a side of the book that ends up empty; a best price of 0 would be misleading.",
          "The checks send five orders that build a book, cross it twice and leave resting orders on both sides.",
          "The example runs a small stream and prints the book after every order, which is the best way to debug an engine.",
          "Read the output line by line and predict the next line before looking."
        ],
        "example": "Watching a chess game move by move and updating the board after each one.",
        "code": "book = {\"bids\": [], \"asks\": []}\ndef best(side):\n    return book[side][0][\"price\"] if book[side] else None\ndef step(order):\n    opp = book[\"asks\"] if order[\"side\"] == \"BUY\" else book[\"bids\"]\n    ok = (lambda r: r[\"price\"] <= order[\"price\"]) if order[\"side\"] == \"BUY\" else (lambda r: r[\"price\"] >= order[\"price\"])\n    left, fills = order[\"qty\"], 0\n    while left and opp and ok(opp[0]):\n        q = min(left, opp[0][\"qty\"]); left -= q; fills += q; opp[0][\"qty\"] -= q\n        if opp[0][\"qty\"] == 0: opp.pop(0)\n    if left:\n        side = book[\"bids\"] if order[\"side\"] == \"BUY\" else book[\"asks\"]\n        worse = (lambda r: r[\"price\"] < order[\"price\"]) if order[\"side\"] == \"BUY\" else (lambda r: r[\"price\"] > order[\"price\"])\n        side.insert(next((i for i, r in enumerate(side) if worse(r)), len(side)), dict(order, qty=left))\n    return fills\nfor o in [(\"SELL\", 10.2, 100), (\"SELL\", 10.1, 50), (\"BUY\", 10.0, 70), (\"BUY\", 10.2, 120), (\"SELL\", 9.9, 30)]:\n    filled = step({\"side\": o[0], \"price\": o[1], \"qty\": o[2]})\n    print(f\"{o[0]:4} {o[2]:3} @ {o[1]}: filled {filled:3} | best bid {best('bids')} best ask {best('asks')}\")",
        "output": "SELL 100 @ 10.2: filled   0 | best bid None best ask 10.2\nSELL  50 @ 10.1: filled   0 | best bid None best ask 10.1\nBUY   70 @ 10.0: filled   0 | best bid 10.0 best ask 10.1\nBUY  120 @ 10.2: filled 120 | best bid 10.0 best ask 10.2\nSELL  30 @ 9.9: filled  30 | best bid 10.0 best ask 10.2",
        "codeNotes": [
          {
            "line": 8,
            "note": "Match while the opposite side crosses."
          },
          {
            "line": 14,
            "note": "Rest the remainder with price-time rules."
          }
        ],
        "tryIt": "Add a sixth order, BUY 200 at 10.3. What trades, and what is left in the book?",
        "check": {
          "question": "Why pass a copy of each order into the engine?",
          "options": [
            "Copies are faster",
            "The engine changes quantities, and the caller's data should not change unexpectedly",
            "Python requires it"
          ],
          "answer": 1,
          "why": "Avoiding shared mutable state prevents surprising bugs."
        }
      },
      {
        "title": "Measuring throughput",
        "say": [
          "Throughput is how many orders the engine processes per second. Latency is how long one order takes.",
          "If 1,000,000 orders take 500,000 microseconds (half a second), throughput is 2 million per second and the average time per order is 500 nanoseconds.",
          "Practice 2 is engine_throughput(orders, elapsed_us), returning orders per second and nanoseconds per order, and raising ValueError for non-positive inputs.",
          "Measure with a high-resolution clock such as time.perf_counter_ns, run enough orders to smooth out noise, and exclude start-up work.",
          "Python is far slower than the C++ or Java used in real engines, by roughly 50 to 100 times for this kind of code. The measuring method, however, is the same.",
          "The example times the matching loop on a stream of random but seeded orders and reports the rate.",
          "Timing output changes from run to run, so the example prints only whether the engine met a generous target, not the raw number."
        ],
        "example": "Timing a checkout lane: count how many customers it serves in an hour, and how long each one takes on average.",
        "code": "import random, time\n\nrng = random.Random(1)\norders = [(\"BUY\" if rng.random() < 0.5 else \"SELL\", round(100 + rng.uniform(-0.5, 0.5), 2), rng.randint(1, 100)) for _ in range(20000)]\nbids, asks = [], []\nstart = time.perf_counter_ns()\nfor side, price, qty in orders:\n    (bids if side == \"BUY\" else asks).append((price, qty))\nelapsed_ns = time.perf_counter_ns() - start\nrate = len(orders) / (elapsed_ns / 1e9)\nprint(\"orders:\", len(orders), \"| met 10,000 orders/s target:\", rate > 10000)",
        "output": "orders: 20000 | met 10,000 orders/s target: True",
        "codeNotes": [
          {
            "line": 6,
            "note": "perf_counter_ns is a high-resolution clock for measuring short intervals."
          },
          {
            "line": 11,
            "note": "Timing varies between runs, so print a stable yes or no."
          }
        ],
        "tryIt": "Replace the append with your full matching step. How much slower is it?",
        "check": {
          "question": "1,000,000 orders in 500,000 microseconds. What is the average time per order?",
          "options": [
            "500 ns",
            "2 µs",
            "0.5 ns"
          ],
          "answer": 0,
          "why": "500,000 µs = 500,000,000 ns, divided by a million orders = 500 ns."
        }
      },
      {
        "title": "Latency distributions",
        "say": [
          "Average latency hides the slow cases. In trading, the slow cases are exactly when it hurts, because they cluster at busy, volatile moments.",
          "Engineers report percentiles: p50 (median), p99 and p99.9, plus the maximum. A p99 of 2 microseconds means 99 percent of orders took 2 microseconds or less.",
          "Common causes of latency spikes: garbage collection pauses, memory allocation, cache misses, operating system interrupts and logging to disk on the hot path.",
          "High-performance systems avoid allocating memory while trading (pre-allocating pools at start-up), pin threads to CPU cores, and move logging off the critical thread.",
          "You will compute percentiles yourself on Day 15. Today, notice how a few slow measurements change the picture.",
          "The example compares the mean and the 99th percentile of a latency sample with a few spikes.",
          "Always ask: what is the p99, not just the average?"
        ],
        "example": "A bus that is usually on time but, once a week, is an hour late; the average wait looks fine, but you remember the hour.",
        "code": "import statistics\n\nlatencies = [400] * 980 + [3000] * 15 + [25000] * 5      # nanoseconds\ns = sorted(latencies)\np99 = s[int(0.99 * len(s)) - 1]\nprint(\"mean:\", round(statistics.mean(latencies)), \"ns\")\nprint(\"median:\", statistics.median(latencies), \"ns\")\nprint(\"p99:\", p99, \"ns | max:\", s[-1], \"ns\")",
        "output": "mean: 562 ns\nmedian: 400.0 ns\np99: 3000 ns | max: 25000 ns",
        "codeNotes": [
          {
            "line": 5,
            "note": "The value below which 99% of the sorted samples fall."
          }
        ],
        "tryIt": "Remove the five 25,000 ns spikes. Which statistics change a lot, and which barely move?",
        "check": {
          "question": "Why do trading engineers watch p99 latency and not just the average?",
          "options": [
            "p99 is easier to compute",
            "Slow outliers happen at the busiest, most important moments and the average hides them",
            "Averages are always wrong"
          ],
          "answer": 1,
          "why": "Tail latency matters most when markets move fast."
        }
      },
      {
        "title": "Market data and recovery",
        "say": [
          "Every change to the book must be published so participants can see it: new orders, cancels, trades and new best prices.",
          "Exchanges publish incremental updates with sequence numbers. A receiver that sees sequence 1041 and then 1043 knows it missed 1042 and must recover it.",
          "Recovery happens by requesting a retransmission or by taking a full snapshot of the book and then applying updates after it.",
          "The engine itself is protected by journaling: every input message is written to a durable log before or as it is processed, so the state can be rebuilt by replaying the log (determinism from Day 3 makes this work).",
          "Snapshots plus the journal make restarts fast: load the latest snapshot, then replay only the messages after it.",
          "The example detects gaps in a stream of sequence numbers.",
          "Gap detection is one of the simplest and most important checks in any market data system."
        ],
        "example": "Numbered pages in a delivery of a long document: if page 42 is missing, you notice immediately and ask for it again.",
        "code": "received = [1038, 1039, 1040, 1041, 1043, 1044, 1047]\ngaps = []\nfor prev, cur in zip(received, received[1:]):\n    if cur != prev + 1:\n        gaps.append(list(range(prev + 1, cur)))\nprint(\"missing sequence numbers:\", gaps)",
        "output": "missing sequence numbers: [[1042], [1045, 1046]]",
        "codeNotes": [
          {
            "line": 4,
            "note": "Consecutive messages must have consecutive sequence numbers."
          }
        ],
        "tryIt": "After requesting and receiving 1042, 1045 and 1046, how would you merge them back in order?",
        "check": {
          "question": "How does a market data receiver detect lost messages?",
          "options": [
            "By checking prices",
            "By noticing a jump in sequence numbers",
            "By counting trades"
          ],
          "answer": 1,
          "why": "Sequence numbers reveal gaps immediately."
        }
      },
      {
        "title": "Milestone practice: run and measure",
        "say": [
          "Practice 1: run_matching(orders). Create the empty book, loop over the orders calling your matcher with a copy of each, collect all trades, then build the summary.",
          "The expected result for the checked stream: 3 trades, 150 shares of volume, best bid 10.0 and best ask 10.2. Work through it on paper once; it is a great exercise.",
          "An empty stream must return zero trades, zero volume and None for both best prices.",
          "Practice 2: engine_throughput(orders, elapsed_us). Validate inputs, then compute orders per second (rounded to a whole number) and nanoseconds per order (1 decimal).",
          "Congratulations on Milestone 1: you have a working, measurable exchange core.",
          "Next week turns to what traders do with it: measuring impact, reading imbalance, making markets and speaking the FIX protocol.",
          "The example works through the checked stream by hand, as a table."
        ],
        "example": "An engineer's first working prototype on the test bench: small, but every part turns and the gauges read true.",
        "code": "steps = [\n    (\"SELL 100 @ 10.2\", \"rests\", \"ask 10.2\"),\n    (\"SELL 50 @ 10.1\", \"rests\", \"ask 10.1\"),\n    (\"BUY 70 @ 10.0\", \"rests\", \"bid 10.0 / ask 10.1\"),\n    (\"BUY 120 @ 10.2\", \"50 @ 10.1 + 70 @ 10.2\", \"bid 10.0 / ask 10.2 (30 left)\"),\n    (\"SELL 30 @ 9.9\", \"30 @ 10.0\", \"bid 10.0 (40 left) / ask 10.2\"),\n]\nfor order, result, book in steps:\n    print(f\"{order:16} -> {result:22} | {book}\")",
        "output": "SELL 100 @ 10.2  -> rests                  | ask 10.2\nSELL 50 @ 10.1   -> rests                  | ask 10.1\nBUY 70 @ 10.0    -> rests                  | bid 10.0 / ask 10.1\nBUY 120 @ 10.2   -> 50 @ 10.1 + 70 @ 10.2  | bid 10.0 / ask 10.2 (30 left)\nSELL 30 @ 9.9    -> 30 @ 10.0              | bid 10.0 (40 left) / ask 10.2",
        "codeNotes": [
          {
            "line": 5,
            "note": "Two trades: 50 at 10.1, then 70 at 10.2."
          },
          {
            "line": 6,
            "note": "One more trade against the resting bid."
          }
        ],
        "tryIt": "Count the trades and the total volume from the table. Do they match the expected summary?",
        "check": {
          "question": "engine_throughput(3, 1) gives ns_per_order of?",
          "options": [
            "3.0",
            "333.3",
            "0.3"
          ],
          "answer": 1,
          "why": "1 µs = 1,000 ns, divided by 3 orders ≈ 333.3 ns."
        }
      }
    ],
    "summary": [
      "An exchange core runs gateway, sequencer and matching engine in a line; matching is a simple ordered loop.",
      "Process streams by applying each order in sequence, passing copies to avoid side effects.",
      "Throughput is orders per second; latency is time per order; measure with a high-resolution clock.",
      "Watch latency percentiles (p50, p99, max), not just averages.",
      "Sequence numbers detect gaps; journals and snapshots make recovery possible."
    ],
    "projectStep": {
      "title": "Milestone 1: exchange core",
      "steps": [
        "Run a stream of 20 orders of your own through run_matching and check the summary by hand.",
        "Time the engine on 10,000 seeded random orders and compute throughput and ns per order.",
        "Add gap detection to a list of sequence-numbered market data messages."
      ]
    }
  },
  {
    "day": 6,
    "title": "Market Impact & Slippage Models: Almgren-Chriss Framework",
    "goal": "You can explain market impact and slippage, separate permanent from temporary impact, compute a simple Almgren-Chriss cost, measure slippage in basis points for buys and sells, and describe the speed-versus-risk trade-off.",
    "minutes": 30,
    "recap": "On Day 4 you split large orders to trade gently. Today you put numbers on why: every trade pushes the price, and trading fast pushes harder.",
    "parts": [
      {
        "title": "What market impact is",
        "say": [
          "Market impact is the price move caused by your own trading. Buying consumes the cheapest offers and signals demand, so the price rises; selling does the opposite.",
          "Impact is usually the largest trading cost for big investors, bigger than fees or spreads.",
          "A widely used rule of thumb, the square-root law, says impact grows roughly with the square root of the order size relative to daily volume: trading 4 times as much costs about 2 times as much per share.",
          "Impact has two parts. Temporary impact fades after you stop trading, like a dent in a cushion. Permanent impact stays, because your trading revealed information the market kept.",
          "Measuring impact precisely is hard, since prices move for many reasons at once, so firms estimate it statistically from thousands of their own orders.",
          "The example applies the square-root rule of thumb to orders of different sizes.",
          "Keep the idea simple: bigger and faster orders cost more per share."
        ],
        "example": "Walking through a crowded market: move slowly and people make way; push through quickly and you bump into everyone.",
        "code": "import math\n\ndaily_volume = 2_000_000\nvolatility_bps = 150          # daily volatility in basis points\nfor shares in [10_000, 40_000, 160_000, 640_000]:\n    impact_bps = volatility_bps * math.sqrt(shares / daily_volume)\n    print(f\"{shares:7,} shares ({shares / daily_volume:5.1%} of volume): about {impact_bps:5.1f} bp impact\")",
        "output": " 10,000 shares ( 0.5% of volume): about  10.6 bp impact\n 40,000 shares ( 2.0% of volume): about  21.2 bp impact\n160,000 shares ( 8.0% of volume): about  42.4 bp impact\n640,000 shares (32.0% of volume): about  84.9 bp impact",
        "codeNotes": [
          {
            "line": 6,
            "note": "Square-root law: impact ∝ volatility × sqrt(size / daily volume)."
          }
        ],
        "tryIt": "Each size is 4 times the previous one. By what factor does the impact grow each time?",
        "check": {
          "question": "What is temporary market impact?",
          "options": [
            "A fee charged by the exchange",
            "Price pressure that fades after you stop trading",
            "The permanent change in a company's value"
          ],
          "answer": 1,
          "why": "Temporary impact recovers once your trading pressure stops."
        }
      },
      {
        "title": "The Almgren-Chriss model",
        "say": [
          "In 2000, Robert Almgren and Neil Chriss published a model for optimal execution that balances impact cost against the risk of waiting.",
          "In a simple version, permanent impact cost is 0.5 × gamma × X², where X is the total shares and gamma measures how much each share moves the price permanently.",
          "Temporary impact cost is eta × v × X, where v is the trading rate (shares per unit of time) and eta measures how much speed costs. Trading faster raises v and the temporary cost.",
          "Permanent cost depends only on how much you trade, not how fast; temporary cost depends on speed.",
          "Practice 1 is impact_cost(shares, rate, gamma, eta): both parts and their total, rounded to 4 decimals.",
          "The full model then adds the risk of price moves while trading slowly and finds the schedule that minimises cost plus a penalty for risk.",
          "The example shows how the two costs respond to trading faster."
        ],
        "example": "Moving house: the total amount of furniture sets a fixed cost, while rushing the move costs extra in overtime and breakages.",
        "code": "def impact_cost(shares, rate, gamma, eta):\n    permanent = 0.5 * gamma * shares ** 2\n    temporary = eta * rate * shares\n    return round(permanent, 4), round(temporary, 4)\n\nfor rate in [500, 2000, 5000]:\n    p, t = impact_cost(10_000, rate, 1e-6, 2e-6)\n    print(f\"rate {rate:5}/min: permanent {p:6}, temporary {t:6}, total {round(p + t, 4)}\")",
        "output": "rate   500/min: permanent   50.0, temporary   10.0, total 60.0\nrate  2000/min: permanent   50.0, temporary   40.0, total 90.0\nrate  5000/min: permanent   50.0, temporary  100.0, total 150.0",
        "codeNotes": [
          {
            "line": 2,
            "note": "Depends only on the total shares."
          },
          {
            "line": 3,
            "note": "Grows with the trading rate."
          }
        ],
        "tryIt": "Double the order size to 20,000 at rate 500. Which cost grows faster, and by how much?",
        "check": {
          "question": "In this model, what happens to permanent impact cost if you trade the same shares more slowly?",
          "options": [
            "It falls",
            "It stays the same",
            "It rises"
          ],
          "answer": 1,
          "why": "Permanent cost depends on the total shares, not on the speed."
        }
      },
      {
        "title": "Speed versus risk",
        "say": [
          "If trading slowly is cheaper, why not trade very slowly? Because while you wait, the price moves randomly, and it may move against you.",
          "This timing risk grows with the square root of the time you are exposed, like the random walk behind volatility.",
          "An urgent trader (one with information about to become public) accepts higher impact to finish fast. A patient trader accepts more timing risk to pay less impact.",
          "Almgren-Chriss makes this a single choice, the risk aversion parameter: a higher value leads to a faster, more front-loaded schedule.",
          "The best schedule minimises expected cost plus risk aversion times the variance of the cost. The example searches a few execution times for the lowest combined value.",
          "Numbers in the example are toy values chosen to show the shape of the trade-off: a U-shaped total with a best middle ground.",
          "This same trade-off appears in every execution decision you will make."
        ],
        "example": "Crossing a river on stepping stones: rushing risks slipping, going too slowly risks the tide coming in. There is a best pace.",
        "code": "import math\n\nshares, eta, sigma, risk_aversion = 100_000, 2e-6, 0.8, 0.02\nbest = None\nfor minutes in [10, 30, 60, 120, 240, 480]:\n    rate = shares / minutes\n    impact = eta * rate * shares\n    risk = risk_aversion * sigma ** 2 * minutes * shares / 1000\n    total = impact + risk\n    best = min(best or (total, minutes), (total, minutes))\n    print(f\"{minutes:3} min: impact {impact:8.1f}  risk {risk:8.1f}  total {total:8.1f}\")\nprint(\"best duration:\", best[1], \"minutes\")",
        "output": " 10 min: impact   2000.0  risk     12.8  total   2012.8\n 30 min: impact    666.7  risk     38.4  total    705.1\n 60 min: impact    333.3  risk     76.8  total    410.1\n120 min: impact    166.7  risk    153.6  total    320.3\n240 min: impact     83.3  risk    307.2  total    390.5\n480 min: impact     41.7  risk    614.4  total    656.1\nbest duration: 120 minutes",
        "codeNotes": [
          {
            "line": 7,
            "note": "Faster (fewer minutes) means higher impact."
          },
          {
            "line": 8,
            "note": "Longer exposure means more timing risk."
          },
          {
            "line": 10,
            "note": "Keep the lowest total seen so far."
          }
        ],
        "tryIt": "Increase risk_aversion to 0.1. Does the best duration get shorter or longer?",
        "check": {
          "question": "Why not always trade as slowly as possible?",
          "options": [
            "Exchanges close early",
            "The price may drift against you while you wait (timing risk)",
            "Slow orders are rejected"
          ],
          "answer": 1,
          "why": "Waiting reduces impact but increases exposure to price moves."
        }
      },
      {
        "title": "Slippage",
        "say": [
          "Slippage measures how much worse your execution was than a benchmark price, usually the price when you decided to trade (the arrival or decision price).",
          "For a buy, slippage is (fill - decision) / decision × 10,000 basis points: paying more than the decision price is a positive cost.",
          "For a sell, it is (decision - fill) / decision × 10,000: selling for less is a positive cost.",
          "Negative slippage means you did better than the benchmark, which happens, for example, when the price moved in your favour while you worked the order.",
          "Practice 2 is slippage_bps(decision_price, fill_price, side), rounded to 2 decimals.",
          "The total gap between the decision price and the final average fill, including fees and unfilled shares, is called implementation shortfall, a standard measure of execution quality.",
          "The example computes slippage for a few fills on both sides."
        ],
        "example": "Booking a taxi quoted at 300 rupees and paying 330 at the end: 10 percent slippage from the quote.",
        "code": "def slippage_bps(decision, fill, side):\n    diff = fill - decision if side == \"BUY\" else decision - fill\n    return round(diff / decision * 10000, 2)\n\nfor decision, fill, side in [(100.0, 100.05, \"BUY\"), (100.0, 99.9, \"SELL\"), (50.0, 49.99, \"BUY\"), (200.0, 200.3, \"SELL\")]:\n    print(f\"{side:4} decided {decision}, filled {fill}: {slippage_bps(decision, fill, side):6} bp\")",
        "output": "BUY  decided 100.0, filled 100.05:    5.0 bp\nSELL decided 100.0, filled 99.9:   10.0 bp\nBUY  decided 50.0, filled 49.99:   -2.0 bp\nSELL decided 200.0, filled 200.3:  -15.0 bp",
        "codeNotes": [
          {
            "line": 2,
            "note": "The sign is flipped for sells so positive always means a cost."
          }
        ],
        "tryIt": "An order buys at 100.05 on average but 20 percent of it never filled and the price rose to 101. How would you count that missed part?",
        "check": {
          "question": "A sell decided at 100.0 fills at 99.9. What is the slippage?",
          "options": [
            "-10 bp",
            "+10 bp",
            "0 bp"
          ],
          "answer": 1,
          "why": "Selling 10 cents lower is a 10 bp cost."
        }
      },
      {
        "title": "Transaction cost analysis",
        "say": [
          "Transaction cost analysis (TCA) is the regular review of execution quality after trading.",
          "For each order, TCA compares the average fill price with several benchmarks: arrival price (slippage), interval VWAP, and the close.",
          "It breaks costs into parts: spread paid, market impact, timing (drift) and fees, and attributes them to decisions such as the algorithm, the venue or the time of day.",
          "Aggregating thousands of orders reveals patterns: an algorithm that costs 5 bp more in the first hour, or a venue with poor fills.",
          "Regulators require brokers to seek best execution for clients, and TCA is the evidence that they do.",
          "The example summarises slippage across several orders, weighted by their size, which is how TCA reports averages.",
          "Weighting by size matters: a 1 bp improvement on a huge order is worth more than 10 bp on a tiny one."
        ],
        "example": "A delivery company reviewing every route at the end of the month to see which drivers, roads and times of day cost the most.",
        "code": "orders = [(\"A\", 50000, 3.2), (\"B\", 2000, 12.5), (\"C\", 120000, 6.8), (\"D\", 8000, -1.5)]\nsimple = sum(bps for _, _, bps in orders) / len(orders)\nweighted = sum(size * bps for _, size, bps in orders) / sum(size for _, size, _ in orders)\nprint(f\"simple average slippage: {simple:.2f} bp\")\nprint(f\"size-weighted slippage:  {weighted:.2f} bp\")\nworst = max(orders, key=lambda o: o[1] * o[2])\nprint(\"largest total cost comes from order\", worst[0])",
        "output": "simple average slippage: 5.25 bp\nsize-weighted slippage:  5.49 bp\nlargest total cost comes from order C",
        "codeNotes": [
          {
            "line": 3,
            "note": "Weight each order's slippage by its size."
          },
          {
            "line": 6,
            "note": "Size times basis points shows where the money went."
          }
        ],
        "tryIt": "Which order has the highest slippage in basis points, and is it the one that cost the most money?",
        "check": {
          "question": "Why weight slippage by order size in TCA?",
          "options": [
            "To make numbers smaller",
            "Large orders matter more in money terms",
            "Regulations forbid simple averages"
          ],
          "answer": 1,
          "why": "Size-weighting reflects the actual money at stake."
        }
      },
      {
        "title": "Practice time: costs and slippage",
        "say": [
          "Practice 1: impact_cost(shares, rate, gamma, eta). permanent = 0.5 × gamma × shares², temporary = eta × rate × shares, and their total, each rounded to 4 decimals.",
          "The checks confirm that trading 10 times faster multiplies only the temporary part by 10, and that a zero-share order costs nothing.",
          "Practice 2: slippage_bps(decision_price, fill_price, side). One expression for the difference, with the sign flipped for sells.",
          "The checks include negative slippage for a buy that filled below the decision price.",
          "Together these functions let you estimate costs before trading (impact models) and measure them after (slippage), which is the loop every execution desk runs.",
          "After passing, compute the total cost in money: slippage in bp × notional / 10,000.",
          "The example converts basis points into rupees for a few orders."
        ],
        "example": "Estimating the fuel for a trip before you leave, then checking the actual receipt when you get back.",
        "code": "for notional, bps in [(10_000_000, 3.2), (500_000, 12.5), (25_000_000, -0.8)]:\n    cost = notional * bps / 10000\n    print(f\"notional {notional:>11,}: {bps:5} bp = {cost:>10,.0f} in money\")",
        "output": "notional  10,000,000:   3.2 bp =      3,200 in money\nnotional     500,000:  12.5 bp =        625 in money\nnotional  25,000,000:  -0.8 bp =     -2,000 in money",
        "codeNotes": [
          {
            "line": 2,
            "note": "Basis points times notional divided by 10,000."
          }
        ],
        "tryIt": "At what notional does a 1 bp improvement save 10 lakh rupees (1,000,000)?",
        "check": {
          "question": "impact_cost(0, 100, 1e-6, 2e-6) total is?",
          "options": [
            "100.0",
            "0.0",
            "2e-6"
          ],
          "answer": 1,
          "why": "No shares traded means no impact cost."
        }
      }
    ],
    "summary": [
      "Market impact is the price move your own trading causes; it has temporary and permanent parts.",
      "The square-root rule of thumb: impact grows with the square root of size relative to volume.",
      "Almgren-Chriss: permanent cost 0.5·γ·X² depends on size; temporary cost η·v·X depends on speed.",
      "Slippage in bp compares fills with the decision price; flip the sign for sells.",
      "TCA reviews costs by benchmark and weights them by order size."
    ],
    "projectStep": {
      "title": "Cost estimator",
      "steps": [
        "Estimate square-root impact for three order sizes in a stock you choose.",
        "Compute Almgren-Chriss costs for trading one order over 10, 60 and 240 minutes.",
        "Calculate size-weighted slippage for five hypothetical fills."
      ]
    }
  },
  {
    "day": 7,
    "title": "Order Book Imbalance (OBI) & Micro-Price Estimation",
    "goal": "You can compute order book imbalance, explain why it predicts short-term price moves, calculate the micro-price, turn imbalance into a trading signal and score, and test a signal honestly.",
    "minutes": 30,
    "recap": "You now know how the book works and what trading costs. Today you read the book for clues: when buyers heavily outnumber sellers at the top of the book, the price tends to tick up next.",
    "parts": [
      {
        "title": "Imbalance at the top of the book",
        "say": [
          "Order book imbalance (OBI) compares the size waiting at the best bid with the size at the best ask: obi = (bid_qty - ask_qty) / (bid_qty + ask_qty).",
          "It ranges from -1 (only sellers at the top) to +1 (only buyers). Zero means balanced.",
          "Why does it predict moves? The side with less size is more likely to be used up first. If only 100 shares sit at the ask and 900 at the bid, a few buy orders will clear the ask and the price ticks up.",
          "Imbalance is one of the most studied short-term signals in market microstructure, and it works over seconds to minutes, not days.",
          "Variants use several levels of the book, weighting levels near the top more heavily.",
          "The example computes imbalance for a few books.",
          "Short-term signals like this are useful for execution (when to place an order) as much as for trading strategies."
        ],
        "example": "A tug of war: when one team has far more people pulling, you can guess which way the rope moves next.",
        "code": "books = [(500, 500), (900, 100), (100, 300), (50, 950)]\nfor bid_qty, ask_qty in books:\n    obi = (bid_qty - ask_qty) / (bid_qty + ask_qty)\n    print(f\"bid {bid_qty:3} ask {ask_qty:3} -> imbalance {obi:+.2f}\")",
        "output": "bid 500 ask 500 -> imbalance +0.00\nbid 900 ask 100 -> imbalance +0.80\nbid 100 ask 300 -> imbalance -0.50\nbid  50 ask 950 -> imbalance -0.90",
        "codeNotes": [
          {
            "line": 3,
            "note": "From -1 (all asks) to +1 (all bids)."
          }
        ],
        "tryIt": "Which book is most likely to tick down next, and why?",
        "check": {
          "question": "What does an imbalance close to +1 mean?",
          "options": [
            "Far more size at the ask",
            "Far more size at the bid",
            "The book is empty"
          ],
          "answer": 1,
          "why": "A positive imbalance means buyers dominate the top of the book."
        }
      },
      {
        "title": "The micro-price",
        "say": [
          "The midpoint ignores sizes; it sits exactly halfway between bid and ask. The micro-price adjusts it towards the side likely to be hit next.",
          "A simple form is (bid × ask_qty + ask × bid_qty) / (bid_qty + ask_qty). Notice the crossed weights: a large bid size pulls the price towards the ASK.",
          "That seems backwards at first, but it matches the logic: lots of buyers waiting means the next trade will probably happen at the ask, so the fair price leans that way.",
          "When sizes are equal, the micro-price equals the midpoint.",
          "Practice 1 is micro_price(bid, bid_qty, ask, ask_qty): return the imbalance and the micro-price, both rounded to 4 decimals.",
          "Market makers use micro-prices as their fair value when setting quotes (Day 8), and execution algorithms use them to decide whether to wait or cross the spread.",
          "The example compares the midpoint and micro-price as the imbalance changes."
        ],
        "example": "Estimating the true middle of a seesaw by where the heavier child is sitting, not just the geometric centre.",
        "code": "def micro_price(bid, bid_qty, ask, ask_qty):\n    total = bid_qty + ask_qty\n    return round((bid * ask_qty + ask * bid_qty) / total, 4)\n\nbid, ask = 100.00, 100.02\nprint(\"midpoint:\", round((bid + ask) / 2, 4))\nfor bq, aq in [(500, 500), (900, 100), (100, 300)]:\n    print(f\"bid size {bq}, ask size {aq}: micro-price {micro_price(bid, bq, ask, aq)}\")",
        "output": "midpoint: 100.01\nbid size 500, ask size 500: micro-price 100.01\nbid size 900, ask size 100: micro-price 100.018\nbid size 100, ask size 300: micro-price 100.005",
        "codeNotes": [
          {
            "line": 3,
            "note": "Each price is weighted by the OTHER side's size."
          }
        ],
        "tryIt": "What micro-price do you get when bid_qty is 1 and ask_qty is 999?",
        "check": {
          "question": "With 900 shares at the bid and 100 at the ask, where is the micro-price?",
          "options": [
            "Near the bid",
            "Near the ask",
            "Exactly at the midpoint"
          ],
          "answer": 1,
          "why": "Heavy bids make a trade at the ask more likely, so the micro-price moves towards it."
        }
      },
      {
        "title": "From imbalance to a signal",
        "say": [
          "A raw number is not yet a decision. A signal turns it into an action with thresholds.",
          "For example: imbalance at or above 0.3 means buy pressure, at or below -0.3 means sell pressure, and anything in between is neutral.",
          "A score from 0 to 100 is often easier to display and combine with other signals: (obi + 1) / 2 × 100.",
          "Practice 2 is obi_signal(obi, threshold=0.3): clamp obi to [-1, 1] (bad data can produce values outside the range), then return the signal and the score.",
          "Clamping protects downstream code from nonsense input; always validate data that comes from outside your program.",
          "Thresholds are parameters to test, not truths; the right values depend on the stock and the time horizon.",
          "The example converts a series of imbalances into signals."
        ],
        "example": "A traffic light built from a speed sensor: numbers become simple green, amber or red decisions.",
        "code": "def obi_signal(obi, threshold=0.3):\n    obi = max(-1.0, min(1.0, obi))\n    signal = \"BUY_PRESSURE\" if obi >= threshold else (\"SELL_PRESSURE\" if obi <= -threshold else \"NEUTRAL\")\n    return signal, round((obi + 1) / 2 * 100, 1)\n\nfor obi in [0.8, 0.1, -0.5, 3.0, -0.3]:\n    print(f\"obi {obi:+.1f} -> {obi_signal(obi)}\")",
        "output": "obi +0.8 -> ('BUY_PRESSURE', 90.0)\nobi +0.1 -> ('NEUTRAL', 55.0)\nobi -0.5 -> ('SELL_PRESSURE', 25.0)\nobi +3.0 -> ('BUY_PRESSURE', 100.0)\nobi -0.3 -> ('SELL_PRESSURE', 35.0)",
        "codeNotes": [
          {
            "line": 2,
            "note": "Clamp bad input into the valid range."
          },
          {
            "line": 3,
            "note": "Thresholds turn a number into an action."
          }
        ],
        "tryIt": "Change the threshold to 0.5. Which signals change?",
        "check": {
          "question": "Why clamp obi before using it?",
          "options": [
            "To make it positive",
            "To protect against bad data outside the valid range",
            "To round it"
          ],
          "answer": 1,
          "why": "Clamping keeps downstream calculations sensible even with bad input."
        }
      },
      {
        "title": "Testing a signal honestly",
        "say": [
          "Before trusting a signal, test whether it actually predicts something. For imbalance: after a strong positive reading, did the midpoint rise over the next few seconds more often than not?",
          "Measure the hit rate (how often the direction was right) and the average move, and compare them with a baseline, such as always guessing up.",
          "Use data the signal was not tuned on; checking on the same data you chose thresholds with overstates performance (Day 26 covers this trap in depth).",
          "Remember costs: a signal that predicts a 0.1 bp move is useless if crossing the spread costs 1 bp.",
          "Simple, well-tested signals often beat complicated ones that were fitted too closely to history.",
          "The example measures the hit rate of the imbalance signal on a small made-up sequence of snapshots and next moves.",
          "Being honest with yourself about a signal is one of the most important skills in quantitative trading."
        ],
        "example": "Checking a weather saying like \"red sky at night\" against a year of records before relying on it.",
        "code": "snapshots = [(0.7, 1), (0.5, 1), (-0.6, -1), (0.4, -1), (-0.8, -1), (0.1, 1), (0.9, 1), (-0.4, 1)]\nhits = total = 0\nfor obi, next_move in snapshots:\n    if abs(obi) >= 0.3:\n        total += 1\n        predicted = 1 if obi > 0 else -1\n        hits += predicted == next_move\nprint(f\"signals: {total}, correct: {hits}, hit rate: {hits / total:.0%}\")\nprint(f\"baseline (always up): {sum(m == 1 for _, m in snapshots) / len(snapshots):.0%}\")",
        "output": "signals: 7, correct: 5, hit rate: 71%\nbaseline (always up): 62%",
        "codeNotes": [
          {
            "line": 4,
            "note": "Only act on strong readings."
          },
          {
            "line": 9,
            "note": "Compare with a naive baseline."
          }
        ],
        "tryIt": "Add more snapshots where the signal is wrong. At what hit rate would you stop trusting it?",
        "check": {
          "question": "Why compare a signal's hit rate with a baseline?",
          "options": [
            "To make charts",
            "A high hit rate may just reflect a market that mostly went one way",
            "Baselines are required by exchanges"
          ],
          "answer": 1,
          "why": "A signal only adds value if it beats a naive guess."
        }
      },
      {
        "title": "Deeper book signals",
        "say": [
          "Looking beyond the top level gives more information. A multi-level imbalance weights each level's size, for example 1 for the best level, 0.5 for the next, 0.25 for the third.",
          "Order flow signals look at events rather than snapshots: the balance of aggressive buys versus aggressive sells in recent trades (trade imbalance).",
          "Queue position matters to market makers: an order at the front of the queue is more likely to fill before the price moves.",
          "All these signals decay fast. Their predictive power is strongest over milliseconds to seconds, which is why low latency (Days 10 to 15) matters.",
          "Many firms see the same public data; the edge comes from better features, faster reaction and lower costs.",
          "The example computes a weighted multi-level imbalance.",
          "Try different weights and see how the result changes; weights are another parameter to test honestly."
        ],
        "example": "Reading the whole queue outside a cinema, not just the first few people, to guess how quickly tickets will sell out.",
        "code": "bids = [(100.00, 300), (99.99, 900), (99.98, 1500)]\nasks = [(100.01, 400), (100.02, 200), (100.03, 300)]\nweights = [1.0, 0.5, 0.25]\nwb = sum(w * q for w, (_, q) in zip(weights, bids))\nwa = sum(w * q for w, (_, q) in zip(weights, asks))\nprint(f\"top-level imbalance: {(300 - 400) / 700:+.3f}\")\nprint(f\"weighted 3-level imbalance: {(wb - wa) / (wb + wa):+.3f}\")",
        "output": "top-level imbalance: -0.143\nweighted 3-level imbalance: +0.324",
        "codeNotes": [
          {
            "line": 4,
            "note": "Deeper levels count, but less than the top."
          }
        ],
        "tryIt": "The two measures disagree in sign here. Which would you trust for a 1-second prediction, and which for 1 minute?",
        "check": {
          "question": "Why do microstructure signals need low latency?",
          "options": [
            "They are computed slowly",
            "Their predictive power fades within seconds",
            "Exchanges require it"
          ],
          "answer": 1,
          "why": "Short-lived signals must be acted on quickly."
        }
      },
      {
        "title": "Practice time: micro-price and signal",
        "say": [
          "Practice 1: micro_price(bid, bid_qty, ask, ask_qty). total = bid_qty + ask_qty; obi = (bid_qty - ask_qty) / total; micro = (bid × ask_qty + ask × bid_qty) / total; round both to 4 decimals.",
          "The checks: a balanced book gives obi 0 and the midpoint; heavy bids give obi 0.8 and a micro-price close to the ask; heavy asks pull it down.",
          "Practice 2: obi_signal(obi, threshold=0.3). Clamp, choose the signal, and compute the score rounded to 1 decimal. Return a tuple (signal, score).",
          "The checks include an out-of-range value of 3.0, which must be clamped to 1.0 and score 100.0.",
          "These two functions are the start of a market-making system: the micro-price is your fair value, and the signal tells you which way to lean.",
          "After passing, feed a stream of book snapshots through both and print how the fair value moves.",
          "The example does exactly that for a short stream."
        ],
        "example": "A ship's navigator updating the estimated position with every new reading from the instruments.",
        "code": "stream = [(100.00, 500, 100.02, 500), (100.00, 800, 100.02, 200), (100.02, 300, 100.04, 700)]\nfor bid, bq, ask, aq in stream:\n    total = bq + aq\n    obi = (bq - aq) / total\n    micro = (bid * aq + ask * bq) / total\n    print(f\"book {bid}/{ask} sizes {bq}/{aq}: obi {obi:+.2f}, fair value {micro:.4f}\")",
        "output": "book 100.0/100.02 sizes 500/500: obi +0.00, fair value 100.0100\nbook 100.0/100.02 sizes 800/200: obi +0.60, fair value 100.0160\nbook 100.02/100.04 sizes 300/700: obi -0.40, fair value 100.0260",
        "codeNotes": [
          {
            "line": 5,
            "note": "The micro-price is recomputed on every update."
          }
        ],
        "tryIt": "In the third snapshot the whole book moved up. Is the imbalance now pointing up or down?",
        "check": {
          "question": "micro_price(100.0, 500, 100.02, 500) returns?",
          "options": [
            "obi 0.0 and micro 100.01",
            "obi 1.0 and micro 100.02",
            "obi -1.0 and micro 100.0"
          ],
          "answer": 0,
          "why": "Equal sizes give zero imbalance and the midpoint."
        }
      }
    ],
    "summary": [
      "Order book imbalance obi = (bid_qty - ask_qty) / (bid_qty + ask_qty), from -1 to +1.",
      "The thinner side tends to be consumed first, so imbalance predicts short-term moves.",
      "Micro-price = (bid × ask_qty + ask × bid_qty) / total leans towards the likely next trade.",
      "Signals turn numbers into actions with thresholds; clamp and validate input.",
      "Test signals on fresh data against baselines and costs; they decay within seconds."
    ],
    "projectStep": {
      "title": "Imbalance dashboard",
      "steps": [
        "Write ten book snapshots (best bid, ask and sizes).",
        "Compute imbalance, micro-price and signal for each.",
        "Invent the next move for each snapshot and measure the signal's hit rate against a baseline."
      ]
    }
  },
  {
    "day": 8,
    "title": "High-Frequency Market Making: Avellaneda-Stoikov Model",
    "goal": "You can explain how market makers earn the spread and manage inventory risk, compute Avellaneda-Stoikov reservation prices and quotes, skew quotes with inventory, and enforce inventory limits.",
    "minutes": 30,
    "recap": "Yesterday you computed a fair value from the book. A market maker quotes around that fair value on both sides, all day, and must manage the risk of what it ends up holding.",
    "parts": [
      {
        "title": "What a market maker does",
        "say": [
          "A market maker continuously quotes a bid and an ask. When someone sells to its bid and someone else buys from its ask, it earns the spread.",
          "That service matters: market makers are why you can usually trade instantly at a tight spread.",
          "The risk is inventory. If many people sell to you and nobody buys, you end up long a lot of stock just as the price is falling.",
          "Another risk is adverse selection: traders with better information trade with you exactly when your quotes are stale, so you tend to lose on those trades.",
          "A market maker therefore balances three things: earning the spread, keeping inventory small, and avoiding informed traders.",
          "The example simulates a market maker earning the spread on a round trip and losing on an adverse move.",
          "Modern market making is highly automated, and the next lessons on speed explain why reaction time matters so much."
        ],
        "example": "A second-hand bookshop that buys books cheaply and sells them for a bit more, but risks being stuck with a pile of books nobody wants.",
        "code": "bid, ask, size = 99.98, 100.02, 100\nprint(\"round trip profit:\", round((ask - bid) * size, 2))\ninventory = 0\ninventory += size                     # someone sells to our bid\nnew_price = 99.80                     # then the price drops before anyone buys from us\nprint(\"loss on the inventory:\", round((new_price - bid) * inventory, 2))",
        "output": "round trip profit: 4.0\nloss on the inventory: -18.0",
        "codeNotes": [
          {
            "line": 2,
            "note": "Buying at the bid and selling at the ask earns the spread."
          },
          {
            "line": 6,
            "note": "Holding inventory when the price moves can wipe out many spreads."
          }
        ],
        "tryIt": "How many round trips are needed to cover the loss in this example?",
        "check": {
          "question": "How does a market maker mainly earn money?",
          "options": [
            "Charging fees",
            "Capturing the bid-ask spread on both sides",
            "Predicting long-term trends"
          ],
          "answer": 1,
          "why": "Buying at the bid and selling at the ask earns the spread."
        }
      },
      {
        "title": "The reservation price",
        "say": [
          "In 2008, Marco Avellaneda and Sasha Stoikov published a model for optimal market making that is still the standard starting point.",
          "Its key idea is the reservation price: the price at which the market maker is indifferent to trading, given its current inventory.",
          "r = mid - q × gamma × sigma² × (T - t), where q is inventory, gamma is risk aversion, sigma is volatility and T - t is the time left in the trading session.",
          "If you are long (q > 0), r is below the mid: you value the stock less because you already have too much of it, so you would rather sell.",
          "If you are short, r is above the mid: you are keen to buy back. With no inventory, r equals the mid.",
          "The shift grows with risk aversion, volatility and time left: more risk means a stronger urge to flatten.",
          "The example computes reservation prices for several inventories."
        ],
        "example": "A shopkeeper with too many umbrellas in the storeroom who quietly lowers the price to clear some space.",
        "code": "mid, gamma, sigma, t_left = 100.0, 0.1, 2.0, 0.5\nfor q in [-10, -5, 0, 5, 10]:\n    r = mid - q * gamma * sigma ** 2 * t_left\n    print(f\"inventory {q:+3}: reservation price {r:.2f}\")",
        "output": "inventory -10: reservation price 102.00\ninventory  -5: reservation price 101.00\ninventory  +0: reservation price 100.00\ninventory  +5: reservation price 99.00\ninventory +10: reservation price 98.00",
        "codeNotes": [
          {
            "line": 3,
            "note": "Long inventory lowers the reservation price; short inventory raises it."
          }
        ],
        "tryIt": "Halve the volatility. How much smaller is the shift for inventory 10?",
        "check": {
          "question": "A market maker is long 10 shares. Where is its reservation price?",
          "options": [
            "Above the mid",
            "Below the mid",
            "Exactly at the mid"
          ],
          "answer": 1,
          "why": "Being long makes it value the stock less, favouring sales."
        }
      },
      {
        "title": "Skewed quotes",
        "say": [
          "The market maker quotes around its reservation price, not the mid: bid = r - half_spread and ask = r + half_spread.",
          "When long, both quotes move down. The lower ask attracts buyers (reducing inventory), and the lower bid makes it less likely to buy even more.",
          "This skewing is how the model steers inventory back towards zero without ever stopping quoting.",
          "The full model also derives an optimal spread that widens with risk aversion, volatility and how quickly orders arrive. Here we take half_spread as an input to keep the focus on the skew.",
          "Practice 1 is as_quotes(mid, inventory, gamma, sigma, t_left, half_spread): the reservation price and both quotes, rounded to 4 decimals.",
          "In practice the quotes are also snapped to the tick grid (Day 1) and checked by risk controls (Day 27).",
          "The example shows how the quotes move as inventory grows."
        ],
        "example": "A seesaw balanced by sliding the pivot: shifting the pivot makes it easier for weight to move back towards the middle.",
        "code": "def as_quotes(mid, q, gamma, sigma, t_left, half_spread):\n    r = mid - q * gamma * sigma ** 2 * t_left\n    return round(r, 4), round(r - half_spread, 4), round(r + half_spread, 4)\n\nfor q in [0, 3, 10, -5]:\n    r, bid, ask = as_quotes(100.0, q, 0.1, 2.0, 0.5, 0.05)\n    print(f\"inventory {q:+3}: bid {bid:7.2f}  ask {ask:7.2f}  (centre {r})\")",
        "output": "inventory  +0: bid   99.95  ask  100.05  (centre 100.0)\ninventory  +3: bid   99.35  ask   99.45  (centre 99.4)\ninventory +10: bid   97.95  ask   98.05  (centre 98.0)\ninventory  -5: bid  100.95  ask  101.05  (centre 101.0)",
        "codeNotes": [
          {
            "line": 3,
            "note": "Quotes are placed symmetrically around the reservation price."
          }
        ],
        "tryIt": "Why might a market maker also widen the spread, not just skew it, when inventory gets large?",
        "check": {
          "question": "A market maker is short. Which way do its quotes move?",
          "options": [
            "Down",
            "Up",
            "They do not move"
          ],
          "answer": 1,
          "why": "Short inventory raises the reservation price, so quotes move up to encourage buying back."
        }
      },
      {
        "title": "Inventory limits",
        "say": [
          "The model skews quotes smoothly, but real firms also set hard inventory limits as a safety net.",
          "At the limit, the market maker stops adding to the position: when long at the limit it stops bidding, when short it stops offering.",
          "A warning zone below the hard limit (for example 80 percent) triggers stronger skewing or wider quotes before the limit is reached.",
          "Practice 2 is inventory_action(inventory, limit): STOP_BUYING or STOP_SELLING at the limit, SKEW_QUOTES in the warning zone, and NORMAL otherwise.",
          "Checking the hard limit first matters; if you checked the warning zone first, a position at 120 percent would only get a skew.",
          "Limits are set per instrument and across the whole firm, and monitored in real time by a separate risk system.",
          "The example walks inventory up and down and prints the action at each step."
        ],
        "example": "A lift with a maximum load: warning beeps near the limit, and at the limit the doors will not close until someone gets out.",
        "code": "def inventory_action(inv, limit):\n    if abs(inv) >= limit:\n        return \"STOP_BUYING\" if inv > 0 else \"STOP_SELLING\"\n    if abs(inv) >= 0.8 * limit:\n        return \"SKEW_QUOTES\"\n    return \"NORMAL\"\n\nfor inv in [0, 500, 820, 1000, 1200, -900, -1000]:\n    print(f\"inventory {inv:+5}: {inventory_action(inv, 1000)}\")",
        "output": "inventory    +0: NORMAL\ninventory  +500: NORMAL\ninventory  +820: SKEW_QUOTES\ninventory +1000: STOP_BUYING\ninventory +1200: STOP_BUYING\ninventory  -900: SKEW_QUOTES\ninventory -1000: STOP_SELLING",
        "codeNotes": [
          {
            "line": 2,
            "note": "Hard limit first."
          },
          {
            "line": 4,
            "note": "Then the warning zone."
          }
        ],
        "tryIt": "What should happen to open orders on the bid side when STOP_BUYING triggers?",
        "check": {
          "question": "Why check the hard limit before the warning zone?",
          "options": [
            "It is faster",
            "Otherwise a position above the limit would only be skewed, not stopped",
            "The order does not matter"
          ],
          "answer": 1,
          "why": "The most severe condition must be checked first."
        }
      },
      {
        "title": "Adverse selection and speed",
        "say": [
          "Market makers lose to informed traders. If news arrives and your quotes are stale for even a few milliseconds, faster traders pick them off.",
          "That is why market makers invest heavily in speed: to update or cancel quotes before they can be picked off.",
          "They also widen spreads around events (earnings, economic data) and in volatile conditions, when the risk of being picked off rises.",
          "Measuring adverse selection: after each fill, check where the price went a few seconds later (markout). Consistently negative markouts mean you are trading with better-informed flow.",
          "Good market makers track markouts by counterparty type, venue and time of day, and adjust quotes accordingly.",
          "The example computes markouts for a few fills.",
          "Combine this with yesterday's imbalance signal: leaning quotes with the signal reduces adverse selection."
        ],
        "example": "A shopkeeper who keeps selling at yesterday's price after the wholesale price jumped: the quickest customers buy everything before the tag is changed.",
        "code": "fills = [(\"BUY\", 100.00, 100.03), (\"SELL\", 100.05, 100.08), (\"BUY\", 99.95, 99.90), (\"SELL\", 100.10, 100.02)]\nfor side, price, price_5s_later in fills:\n    markout = (price_5s_later - price) if side == \"BUY\" else (price - price_5s_later)\n    print(f\"we {side:4} at {price:.2f}, 5 s later {price_5s_later:.2f}: markout {markout:+.2f}\")",
        "output": "we BUY  at 100.00, 5 s later 100.03: markout +0.03\nwe SELL at 100.05, 5 s later 100.08: markout -0.03\nwe BUY  at 99.95, 5 s later 99.90: markout -0.05\nwe SELL at 100.10, 5 s later 100.02: markout +0.08",
        "codeNotes": [
          {
            "line": 3,
            "note": "Positive means the fill was good for us; negative means we were picked off."
          }
        ],
        "tryIt": "Which fill looks like we traded with someone better informed?",
        "check": {
          "question": "What is a markout?",
          "options": [
            "An exchange fee",
            "The price move after a fill, measuring whether the fill was good for us",
            "A type of order"
          ],
          "answer": 1,
          "why": "Markouts reveal adverse selection."
        }
      },
      {
        "title": "Practice time: quotes and limits",
        "say": [
          "Practice 1: as_quotes(mid, inventory, gamma, sigma, t_left, half_spread). One formula for r, then the two quotes, all rounded to 4 decimals, returned as a dictionary.",
          "The checks: flat inventory gives symmetric quotes around the mid; long 10 with the given parameters shifts everything down by 2; short 5 shifts up.",
          "Practice 2: inventory_action(inventory, limit). Hard limit, then warning zone, then normal.",
          "Together they form the core decision of a market maker on every tick: where to quote and whether to quote at all.",
          "On Day 30 you combine them with the micro-price from yesterday and the risk checks from Day 27 into a full tick handler.",
          "After passing, simulate a morning: random fills change inventory, and quotes skew in response. The example does that with a seeded generator.",
          "Watch how skewing keeps inventory from drifting too far."
        ],
        "example": "A juggler adjusting their stance as balls land unevenly, always leaning to keep the pattern centred.",
        "code": "import random\n\nrng = random.Random(4)\ninventory, mid = 0, 100.0\nfor step in range(10):\n    r = mid - inventory * 0.002              # gamma * sigma ** 2 * t_left = 0.002 here\n    bid, ask = r - 0.05, r + 0.05\n    buy_chance = 0.5 + (mid - r) * 10          # a lower ask attracts buyers\n    inventory += -10 if rng.random() < buy_chance else 10\n    print(f\"step {step}: quotes {bid:.3f}/{ask:.3f}, inventory now {inventory:+}\")",
        "output": "step 0: quotes 99.950/100.050, inventory now -10\nstep 1: quotes 99.970/100.070, inventory now -20\nstep 2: quotes 99.990/100.090, inventory now -10\nstep 3: quotes 99.970/100.070, inventory now -20\nstep 4: quotes 99.990/100.090, inventory now -30\nstep 5: quotes 100.010/100.110, inventory now -20\nstep 6: quotes 99.990/100.090, inventory now -10\nstep 7: quotes 99.970/100.070, inventory now +0\nstep 8: quotes 99.950/100.050, inventory now +10\nstep 9: quotes 99.930/100.030, inventory now +0",
        "codeNotes": [
          {
            "line": 6,
            "note": "Reservation price from current inventory."
          },
          {
            "line": 8,
            "note": "Skewed quotes make the balancing trade more likely."
          }
        ],
        "tryIt": "Set the skew to zero (use mid instead of r). Does inventory wander further?",
        "check": {
          "question": "as_quotes(100.0, 0, 0.1, 2.0, 1.0, 0.05) gives?",
          "options": [
            "bid 99.95, ask 100.05",
            "bid 99.9, ask 100.1",
            "bid 100.0, ask 100.0"
          ],
          "answer": 0,
          "why": "With no inventory, quotes sit half a spread either side of the mid."
        }
      }
    ],
    "summary": [
      "Market makers quote both sides, earn the spread, and carry inventory and adverse selection risk.",
      "Avellaneda-Stoikov reservation price: r = mid - q·γ·σ²·(T - t).",
      "Quote bid and ask around r, so inventory pulls quotes in the direction that reduces it.",
      "Hard inventory limits stop adding risk; a warning zone skews earlier.",
      "Markouts measure adverse selection; speed and signals help avoid being picked off."
    ],
    "projectStep": {
      "title": "Market maker simulator",
      "steps": [
        "Compute quotes for inventories from -10 to +10 with your chosen parameters.",
        "Simulate 50 steps of random fills with skewed quotes and plot (or print) inventory.",
        "Add hard limits and markouts, and report the average markout."
      ]
    }
  },
  {
    "day": 9,
    "title": "Financial Information eXchange (FIX 4.4) Protocol & FAST Compression",
    "goal": "You can explain what the FIX protocol is for, read and build tag=value FIX messages with SOH delimiters, compute BodyLength and CheckSum, validate an incoming message, and describe sessions and sequence numbers.",
    "minutes": 30,
    "recap": "Your trading logic decides what to send. Now it has to actually talk to brokers and exchanges. The most widely used language for that is FIX.",
    "parts": [
      {
        "title": "The Financial Information eXchange protocol",
        "say": [
          "FIX (Financial Information eXchange) is the standard messaging protocol between investment firms, brokers and exchanges, used since the 1990s.",
          "A FIX message is a list of fields written as tag=value, separated by a special character called SOH (start of header, byte 0x01).",
          "Tags are numbers with standard meanings: 35 is MsgType, 55 is Symbol, 54 is Side (1 = buy, 2 = sell), 38 is OrderQty, 44 is Price.",
          "MsgType values identify the message: D is a New Order Single, F a cancel request, 8 an Execution Report, 0 a Heartbeat and A a Logon.",
          "FIX 4.4 is still very common; newer versions and binary encodings (FIX SBE) exist for speed, but tag=value FIX remains the lingua franca.",
          "The example builds a readable version of a new order message, using | instead of SOH so you can see it.",
          "Almost every broker, trading platform and exchange gateway speaks FIX, so learning it opens a lot of doors."
        ],
        "example": "A standard shipping form where every box has a number: box 55 is always the product, box 38 is always the quantity, whatever the company.",
        "code": "fields = [(35, \"D\"), (11, \"ORD-1001\"), (55, \"INFY\"), (54, 1), (38, 100), (40, 2), (44, \"1520.50\")]\nnames = {35: \"MsgType\", 11: \"ClOrdID\", 55: \"Symbol\", 54: \"Side\", 38: \"OrderQty\", 40: \"OrdType\", 44: \"Price\"}\nprint(\"|\".join(f\"{t}={v}\" for t, v in fields))\nfor t, v in fields:\n    print(f\"  {t:>3} {names[t]:9} = {v}\")",
        "output": "35=D|11=ORD-1001|55=INFY|54=1|38=100|40=2|44=1520.50\n   35 MsgType   = D\n   11 ClOrdID   = ORD-1001\n   55 Symbol    = INFY\n   54 Side      = 1\n   38 OrderQty  = 100\n   40 OrdType   = 2\n   44 Price     = 1520.50",
        "codeNotes": [
          {
            "line": 3,
            "note": "Real FIX uses the SOH character (\\x01) where this prints |."
          },
          {
            "line": 5,
            "note": "Each tag number has a standard meaning."
          }
        ],
        "tryIt": "Change the side to sell. Which tag and value change?",
        "check": {
          "question": "In FIX, what does tag 35 hold?",
          "options": [
            "The price",
            "The message type",
            "The symbol"
          ],
          "answer": 1,
          "why": "Tag 35 (MsgType) says what kind of message this is."
        }
      },
      {
        "title": "Header, body and trailer",
        "say": [
          "Every FIX message starts with the same header fields in a fixed order: 8 (BeginString, such as FIX.4.4), then 9 (BodyLength), then 35 (MsgType).",
          "BodyLength (tag 9) is the number of characters from the start of tag 35 up to and including the SOH just before tag 10.",
          "The message ends with the trailer, tag 10 (CheckSum): the sum of the byte values of every character before the \"10=\" field, modulo 256, written as exactly three digits.",
          "These two numbers let the receiver check the message is complete and uncorrupted before acting on it.",
          "Practice 1 is fix_message(msg_type, fields): build the body, compute its length, add the header, compute the checksum and append the trailer.",
          "Formatting the checksum with f\"{checksum:03d}\" pads it to three digits, so 7 becomes 007.",
          "The example builds a heartbeat message and prints its parts."
        ],
        "example": "A parcel label showing the parcel's weight and a seal number: if either does not match on arrival, the parcel is rejected.",
        "code": "SOH = \"\\x01\"\nbody = f\"35=0{SOH}\"\nhead = f\"8=FIX.4.4{SOH}9={len(body)}{SOH}\"\nchecksum = sum(ord(c) for c in head + body) % 256\nmsg = f\"{head}{body}10={checksum:03d}{SOH}\"\nprint(\"readable:\", msg.replace(SOH, \"|\"))\nprint(\"body length:\", len(body), \"| checksum:\", f\"{checksum:03d}\")",
        "output": "readable: 8=FIX.4.4|9=5|35=0|10=163|\nbody length: 5 | checksum: 163",
        "codeNotes": [
          {
            "line": 3,
            "note": "BodyLength counts the body, starting at 35=."
          },
          {
            "line": 4,
            "note": "CheckSum: sum of byte values modulo 256."
          }
        ],
        "tryIt": "Add a field 112=TEST1 to the heartbeat body. How do the length and checksum change?",
        "check": {
          "question": "What does the FIX CheckSum (tag 10) cover?",
          "options": [
            "Only the body",
            "Every character before the 10= field",
            "Only the header"
          ],
          "answer": 1,
          "why": "It sums all bytes before the checksum field."
        }
      },
      {
        "title": "Validating incoming messages",
        "say": [
          "A receiver must never act on a corrupted or truncated order. It checks BodyLength and CheckSum first.",
          "Practice 2 is valid_fix_checksum(raw): find the last \"\\x0110=\" in the message, recompute the checksum of everything before \"10=\", and compare it with the value in the field.",
          "Using rfind (search from the right) finds the trailer even if some earlier field value happened to contain \"10=\".",
          "Return False, rather than raising an error, for messages without a checksum; the session layer then rejects or ignores them and logs the problem.",
          "Other validations include required fields for each message type, valid enumerated values (Side must be 1 or 2, for example) and sensible numbers.",
          "In production, FIX engines (such as QuickFIX, used in many firms) handle this layer, but knowing what they check makes debugging much faster.",
          "The example corrupts one character of a valid message and shows the checksum catching it."
        ],
        "example": "A bank cashier re-counting the money in a bundle before accepting the slip that says how much is inside.",
        "code": "SOH = \"\\x01\"\ndef build(body):\n    head = f\"8=FIX.4.4{SOH}9={len(body)}{SOH}\"\n    return f\"{head}{body}10={sum(ord(c) for c in head + body) % 256:03d}{SOH}\"\ndef valid(raw):\n    i = raw.rfind(SOH + \"10=\")\n    if i == -1: return False\n    return sum(ord(c) for c in raw[:i + 1]) % 256 == int(raw[i + 4:].rstrip(SOH))\ngood = build(f\"35=D{SOH}55=INFY{SOH}38=100{SOH}\")\nbad = good.replace(\"38=100\", \"38=900\")\nprint(\"original valid:\", valid(good))\nprint(\"tampered valid:\", valid(bad))",
        "output": "original valid: True\ntampered valid: False",
        "codeNotes": [
          {
            "line": 6,
            "note": "rfind locates the trailer from the end."
          },
          {
            "line": 8,
            "note": "Recompute and compare."
          }
        ],
        "tryIt": "Can you find a change to the body that keeps the checksum the same? What does that say about checksums versus security?",
        "check": {
          "question": "Why use rfind to locate the checksum field?",
          "options": [
            "It is faster",
            "The trailer is at the end, and a field value earlier could contain \"10=\"",
            "find does not work on strings"
          ],
          "answer": 1,
          "why": "Searching from the right finds the real trailer."
        }
      },
      {
        "title": "Sessions, logon and sequence numbers",
        "say": [
          "FIX runs over a session between two parties, each identified by a SenderCompID (49) and TargetCompID (56).",
          "A session starts with Logon (MsgType A), is kept alive with Heartbeats (0) at an agreed interval, and ends with Logout (5).",
          "Every message carries MsgSeqNum (34), increasing by one per message in each direction. A gap means messages were lost.",
          "On a gap, the receiver sends a ResendRequest (2), and the sender replays the missing messages. This makes FIX reliable even across disconnects.",
          "Sequence numbers usually reset daily. Getting them wrong after a restart is one of the most common FIX support issues.",
          "The example checks a sequence of incoming MsgSeqNum values and produces the resend requests needed.",
          "You met the same gap idea for market data on Day 5; reliable messaging always comes down to numbered messages."
        ],
        "example": "Numbered pages of a fax: the receiver says \"please resend pages 7 to 9\" if they are missing.",
        "code": "expected = 1\nresend_requests = []\nfor seq in [1, 2, 3, 6, 7, 9]:\n    if seq > expected:\n        resend_requests.append((expected, seq - 1))\n    expected = seq + 1\nprint(\"ResendRequest ranges (BeginSeqNo, EndSeqNo):\", resend_requests)",
        "output": "ResendRequest ranges (BeginSeqNo, EndSeqNo): [(4, 5), (8, 8)]",
        "codeNotes": [
          {
            "line": 4,
            "note": "A jump in MsgSeqNum means messages were missed."
          },
          {
            "line": 5,
            "note": "Ask for the missing range."
          }
        ],
        "tryIt": "What should the receiver do if it sees a sequence number LOWER than expected?",
        "check": {
          "question": "What does tag 34 (MsgSeqNum) allow?",
          "options": [
            "Faster messages",
            "Detecting and recovering lost messages",
            "Encrypting messages"
          ],
          "answer": 1,
          "why": "Sequence numbers reveal gaps, which trigger resend requests."
        }
      },
      {
        "title": "Execution reports and order state",
        "say": [
          "After you send a New Order Single (D), the counterparty replies with Execution Reports (8). Each one reports a change in the order's state.",
          "Key fields: OrdStatus (39) such as 0 New, 1 Partially filled, 2 Filled, 4 Canceled, 8 Rejected; LastQty (32) and LastPx (31) for the latest fill; CumQty (14) and AvgPx (6) for totals.",
          "Your system keeps an order state machine and updates it from these reports. It must handle reports arriving in any order and possible duplicates.",
          "The quantities must always add up: CumQty + LeavesQty (151) = OrderQty for a live order.",
          "Reconciling your internal state with execution reports, and with the end-of-day drop copy, is a daily task in every trading firm.",
          "The example applies a series of execution reports to an order and checks the arithmetic.",
          "An order that your system thinks is filled but the exchange thinks is open is a serious incident; state machines prevent that."
        ],
        "example": "A parcel tracking page that updates as the parcel is picked up, part-delivered and finally delivered, always showing how much is still on its way.",
        "code": "order = {\"qty\": 1000, \"cum_qty\": 0, \"notional\": 0.0, \"status\": \"NEW\"}\nreports = [(300, 1520.0), (500, 1520.5), (200, 1521.0)]\nfor last_qty, last_px in reports:\n    order[\"cum_qty\"] += last_qty\n    order[\"notional\"] += last_qty * last_px\n    leaves = order[\"qty\"] - order[\"cum_qty\"]\n    order[\"status\"] = \"FILLED\" if leaves == 0 else \"PARTIALLY_FILLED\"\n    avg = order[\"notional\"] / order[\"cum_qty\"]\n    print(f\"fill {last_qty}@{last_px}: cum {order['cum_qty']}, leaves {leaves}, avg {avg:.4f}, {order['status']}\")",
        "output": "fill 300@1520.0: cum 300, leaves 700, avg 1520.0000, PARTIALLY_FILLED\nfill 500@1520.5: cum 800, leaves 200, avg 1520.3125, PARTIALLY_FILLED\nfill 200@1521.0: cum 1000, leaves 0, avg 1520.4500, FILLED",
        "codeNotes": [
          {
            "line": 6,
            "note": "LeavesQty = OrderQty - CumQty."
          },
          {
            "line": 8,
            "note": "AvgPx is the volume-weighted average of fills."
          }
        ],
        "tryIt": "What should happen if a duplicate of the second report arrives? How would you detect it (hint: ExecID, tag 17)?",
        "check": {
          "question": "For a live order, what must CumQty + LeavesQty equal?",
          "options": [
            "The price",
            "The original order quantity",
            "Zero"
          ],
          "answer": 1,
          "why": "Filled plus remaining always equals the order quantity."
        }
      },
      {
        "title": "Practice time: build and validate",
        "say": [
          "Practice 1: fix_message(msg_type, fields). Build the body starting with 35=msg_type, then each tag=value, each followed by SOH. Compute the header with the body length, then the checksum, then append 10=NNN and SOH.",
          "The checks verify the header fields, the exact checksum for a new order, that the checksum really equals the byte sum, and that a heartbeat has body length 5.",
          "Practice 2: valid_fix_checksum(raw). rfind the trailer, compute the byte sum up to and including the SOH before 10=, and compare with the digits after it.",
          "Checks include a correct heartbeat, a wrong checksum, a changed body, and a message with no trailer.",
          "Both functions are pure string processing, which makes them easy to test thoroughly; that is exactly why FIX engines have large test suites of message samples.",
          "After passing, write a parser that turns a FIX string into a dictionary of tag to value.",
          "The example does that in one line."
        ],
        "example": "Learning to write and read a standard form both ways, so you can fill one in and check someone else's.",
        "code": "SOH = \"\\x01\"\nraw = f\"8=FIX.4.4{SOH}9=31{SOH}35=D{SOH}55=INFY{SOH}54=1{SOH}38=100{SOH}10=123{SOH}\"\nfields = dict(f.split(\"=\", 1) for f in raw.split(SOH) if f)\nprint(fields)\nprint(\"symbol:\", fields[\"55\"], \"| side:\", \"BUY\" if fields[\"54\"] == \"1\" else \"SELL\")",
        "output": "{'8': 'FIX.4.4', '9': '31', '35': 'D', '55': 'INFY', '54': '1', '38': '100', '10': '123'}\nsymbol: INFY | side: BUY",
        "codeNotes": [
          {
            "line": 3,
            "note": "Split on SOH, drop the empty last piece, split each field at the first =."
          }
        ],
        "tryIt": "Why split at the FIRST = only (split(\"=\", 1))? Think of a field value containing =.",
        "check": {
          "question": "A heartbeat body is \"35=0\" followed by SOH. What is its BodyLength?",
          "options": [
            "4",
            "5",
            "9"
          ],
          "answer": 1,
          "why": "\"35=0\" is 4 characters plus 1 SOH = 5."
        }
      }
    ],
    "summary": [
      "FIX is the standard trading message protocol: tag=value fields separated by SOH (\\x01).",
      "Header 8, 9 (BodyLength), 35 (MsgType); trailer 10 (CheckSum = byte sum mod 256, three digits).",
      "Validate BodyLength and CheckSum before acting; use rfind for the trailer.",
      "Sessions use Logon, Heartbeats and MsgSeqNum; gaps trigger ResendRequests.",
      "Execution reports drive an order state machine where CumQty + LeavesQty = OrderQty."
    ],
    "projectStep": {
      "title": "FIX toolkit",
      "steps": [
        "Build New Order, Cancel and Heartbeat messages with fix_message.",
        "Validate them, then corrupt one byte and show validation fails.",
        "Apply three execution reports to an order and print its state after each."
      ]
    }
  },
  {
    "day": 10,
    "title": "NASDAQ TotalView-ITCH 5.0 & OUCH Protocols: Direct Binary Market Feeds",
    "goal": "You can explain binary market data feeds like NASDAQ ITCH, decode a fixed-layout binary message with the struct module, convert fixed-point integer prices, and rebuild a book from add and execute messages.",
    "minutes": 30,
    "recap": "FIX is text: easy to read, slower to parse. For market data at millions of messages per second, exchanges use compact binary feeds. Today you decode one.",
    "parts": [
      {
        "title": "Why binary feeds",
        "say": [
          "A busy exchange publishes millions of market data messages per second: every new order, cancel and trade.",
          "Text formats waste space and time: \"38=100\" needs six characters and parsing digits; a binary integer needs a fixed number of bytes and no parsing.",
          "NASDAQ's TotalView-ITCH is the classic example: every message has a fixed layout of binary fields, so a receiver reads fields at known byte offsets.",
          "ITCH is a full order-by-order feed (level 3): it reports each individual order, so receivers can rebuild the entire book themselves.",
          "OUCH is NASDAQ's matching binary protocol for sending orders. Many exchanges have similar feeds: NSE, BSE and CME all publish binary market data.",
          "The example compares the size of a text representation and a binary one for the same order.",
          "Smaller messages mean less network time and faster decoding, which is exactly what latency-sensitive systems need."
        ],
        "example": "Shorthand versus longhand: a court stenographer's shorthand captures the same words in far less space and time.",
        "code": "import struct\n\ntext = \"A|ref=123456789|side=B|shares=250|stock=INFY|price=1520.5000\"\nbinary = struct.pack(\">cQcI8sI\", b\"A\", 123456789, b\"B\", 250, b\"INFY    \", 15205000)\nprint(\"text bytes:\", len(text.encode()))\nprint(\"binary bytes:\", len(binary))\nprint(\"binary as hex:\", binary.hex()[:40], \"...\")",
        "output": "text bytes: 60\nbinary bytes: 26\nbinary as hex: 4100000000075bcd1542000000fa494e46592020 ...",
        "codeNotes": [
          {
            "line": 4,
            "note": "Big-endian: char, 8-byte int, char, 4-byte int, 8 bytes, 4-byte int."
          }
        ],
        "tryIt": "How many messages per second fit in 1 Gbit/s for each format (ignoring network overhead)?",
        "check": {
          "question": "Why do exchanges use binary market data feeds?",
          "options": [
            "They are easier to read",
            "They are smaller and faster to decode than text",
            "Regulators require them"
          ],
          "answer": 1,
          "why": "Fixed binary layouts save bandwidth and parsing time."
        }
      },
      {
        "title": "Bytes, endianness and struct",
        "say": [
          "Binary fields are raw bytes. A 4-byte unsigned integer can hold values up to about 4.29 billion; an 8-byte one far more.",
          "Endianness is the order of bytes in a multi-byte number. Big-endian puts the most significant byte first (network byte order); little-endian puts it last (most PCs).",
          "ITCH uses big-endian. Reading it as little-endian gives nonsense numbers, a classic bug.",
          "Python's struct module converts between bytes and numbers with a format string: \">\" means big-endian, \"c\" one byte, \"I\" 4-byte unsigned int, \"Q\" 8-byte unsigned int, \"8s\" 8 raw bytes.",
          "struct.pack builds bytes from values; struct.unpack reads values from bytes, and both must use exactly the same format.",
          "The example shows the same number packed in both byte orders and what happens when you unpack with the wrong one.",
          "Always check the specification for byte order before writing a decoder."
        ],
        "example": "Writing a date as day-month-year or year-month-day: the same numbers, but read in the wrong order they mean a different day.",
        "code": "import struct\n\nn = 15205000\nbig = struct.pack(\">I\", n)\nlittle = struct.pack(\"<I\", n)\nprint(\"big-endian bytes:   \", big.hex())\nprint(\"little-endian bytes:\", little.hex())\nprint(\"big read correctly:\", struct.unpack(\">I\", big)[0])\nprint(\"big read as little:\", struct.unpack(\"<I\", big)[0])",
        "output": "big-endian bytes:    00e80288\nlittle-endian bytes: 8802e800\nbig read correctly: 15205000\nbig read as little: 2281891840",
        "codeNotes": [
          {
            "line": 4,
            "note": "> means big-endian (network order)."
          },
          {
            "line": 9,
            "note": "Wrong byte order gives a completely different number."
          }
        ],
        "tryIt": "What is the largest price a 4-byte unsigned field with 4 implied decimals can hold?",
        "check": {
          "question": "What does \">\" mean in a struct format string?",
          "options": [
            "Greater than",
            "Big-endian byte order",
            "Skip a byte"
          ],
          "answer": 1,
          "why": "\">\" selects big-endian (network) byte order."
        }
      },
      {
        "title": "Decoding an Add Order message",
        "say": [
          "Our simplified ITCH Add Order message is 26 bytes: type (1 byte, \"A\"), order reference (8), side (1, \"B\" or \"S\"), shares (4), stock (8 ASCII bytes padded with spaces), price (4, with 4 implied decimals).",
          "The matching struct format is \">cQcI8sI\", and struct.calcsize(\">cQcI8sI\") confirms it is 26 bytes.",
          "Practice 1 is parse_add_order(buf): check the length and type, unpack, then convert the side byte to BUY or SELL, decode and strip the stock name, and divide the price by 10,000.",
          "Validation first: a decoder that trusts its input will crash, or worse, silently produce garbage, on a truncated packet.",
          "Stock names arrive as bytes; .decode(\"ascii\") turns them into a string and .strip() removes the padding spaces.",
          "The example builds a message with struct.pack and decodes it back, a round trip that is also a perfect unit test.",
          "Real ITCH messages have more fields (stock locate, tracking number, timestamp), but the technique is identical."
        ],
        "example": "Reading a form where every box has a fixed width: the first box is always one character, the next always eight digits, and so on.",
        "code": "import struct\n\nFORMAT = \">cQcI8sI\"\nprint(\"message size:\", struct.calcsize(FORMAT), \"bytes\")\nmsg = struct.pack(FORMAT, b\"A\", 987654321, b\"S\", 1200, b\"TCS     \", 38001234)\nkind, ref, side, shares, stock, price = struct.unpack(FORMAT, msg)\nprint({\"type\": kind.decode(), \"ref\": ref, \"side\": \"BUY\" if side == b\"B\" else \"SELL\",\n       \"shares\": shares, \"stock\": stock.decode(\"ascii\").strip(), \"price\": price / 10000})",
        "output": "message size: 26 bytes\n{'type': 'A', 'ref': 987654321, 'side': 'SELL', 'shares': 1200, 'stock': 'TCS', 'price': 3800.1234}",
        "codeNotes": [
          {
            "line": 4,
            "note": "calcsize confirms the expected length."
          },
          {
            "line": 6,
            "note": "unpack returns the fields in format order."
          }
        ],
        "tryIt": "Slice off the last byte of msg and unpack it. What error do you get, and why should parse_add_order check the length first?",
        "check": {
          "question": "How is \"INFY    \" (with padding) turned into \"INFY\"?",
          "options": [
            "int()",
            ".decode(\"ascii\").strip()",
            "struct.pack"
          ],
          "answer": 1,
          "why": "Decode the bytes to text, then strip the padding spaces."
        }
      },
      {
        "title": "Fixed-point prices",
        "say": [
          "Feeds rarely send floating point prices. They send integers with a fixed number of implied decimal places, for example 4: 15205000 means 1520.5000.",
          "Fixed-point integers are exact. Floats are not: 0.1 cannot be represented exactly in binary, and repeated float arithmetic accumulates small errors.",
          "Many trading systems keep prices as integers (in ticks or in 1/10,000 units) internally for exactly this reason, converting to decimals only for display.",
          "Practice 2 is to_fixed(price) and from_fixed(raw). to_fixed must round, not truncate: int(0.1 * 10000) could give 999 because 0.1 * 10000 is 999.9999999999999 in some cases.",
          "from_fixed divides by 10,000 and rounds to 4 decimals so displayed prices are clean.",
          "Python also has the decimal module for exact decimal arithmetic, useful in accounting code; low-latency systems usually prefer plain integers.",
          "The example shows floating point drift and how integers avoid it."
        ],
        "example": "Counting money in paise instead of rupees with decimals: 150 paise is exact, while 1.5 rupees on a calculator can pick up rounding errors.",
        "code": "total_float = 0.0\ntotal_fixed = 0\nfor _ in range(10):\n    total_float += 0.1\n    total_fixed += 1000        # 0.1 with 4 implied decimals\nprint(\"float sum of ten 0.1s:\", total_float)\nprint(\"fixed-point sum:\", total_fixed, \"->\", total_fixed / 10000)\nprint(\"int(0.57 * 10000) =\", int(0.57 * 10000), \" round:\", round(0.57 * 10000))",
        "output": "float sum of ten 0.1s: 0.9999999999999999\nfixed-point sum: 10000 -> 1.0\nint(0.57 * 10000) = 5699  round: 5700",
        "codeNotes": [
          {
            "line": 4,
            "note": "Floats accumulate tiny errors."
          },
          {
            "line": 8,
            "note": "Truncating a float product can lose one unit; rounding does not."
          }
        ],
        "tryIt": "Try a few other prices, such as 19.99, 1.1 and 4.35, with int() and round(). Which ones go wrong?",
        "check": {
          "question": "Why do many trading systems store prices as integers?",
          "options": [
            "Integers are smaller on screen",
            "Integer arithmetic is exact, avoiding floating point errors",
            "Floats are not allowed in Python"
          ],
          "answer": 1,
          "why": "Fixed-point integers represent prices exactly."
        }
      },
      {
        "title": "Rebuilding the book from a feed",
        "say": [
          "With an order-by-order feed, a receiver rebuilds the whole book by applying each message: Add Order adds a resting order; Order Executed reduces it; Order Cancel reduces or removes it; Order Delete removes it.",
          "Each message refers to the order by its reference number, so the receiver keeps a dictionary from reference to order.",
          "The best bid and ask come from the rebuilt book, and trades come from the executed messages.",
          "Any missed message corrupts the book, which is why sequence numbers and recovery (Day 5) are critical for feed handlers.",
          "Feed handlers are some of the most performance-critical code in trading, often written in C++ or run on FPGAs (Day 29).",
          "The example applies a short stream of add, execute and delete messages and prints the best prices.",
          "Every trading strategy that reads the book depends on this rebuild being correct."
        ],
        "example": "Keeping a live scoreboard by applying every announcement: \"goal to team A\", \"penalty to team B\", in the exact order they happen.",
        "code": "orders = {}\nevents = [(\"A\", 1, \"B\", 100, 1520.0), (\"A\", 2, \"B\", 50, 1520.5), (\"A\", 3, \"S\", 80, 1521.0),\n          (\"E\", 2, None, 20, None), (\"D\", 1, None, None, None), (\"A\", 4, \"S\", 40, 1520.8)]\nfor kind, ref, side, qty, price in events:\n    if kind == \"A\":\n        orders[ref] = {\"side\": side, \"qty\": qty, \"price\": price}\n    elif kind == \"E\":\n        orders[ref][\"qty\"] -= qty\n        if orders[ref][\"qty\"] == 0: del orders[ref]\n    elif kind == \"D\":\n        orders.pop(ref, None)\nbids = [o[\"price\"] for o in orders.values() if o[\"side\"] == \"B\"]\nasks = [o[\"price\"] for o in orders.values() if o[\"side\"] == \"S\"]\nprint(\"resting orders:\", orders)\nprint(\"best bid:\", max(bids), \"best ask:\", min(asks))",
        "output": "resting orders: {2: {'side': 'B', 'qty': 30, 'price': 1520.5}, 3: {'side': 'S', 'qty': 80, 'price': 1521.0}, 4: {'side': 'S', 'qty': 40, 'price': 1520.8}}\nbest bid: 1520.5 best ask: 1520.8",
        "codeNotes": [
          {
            "line": 6,
            "note": "Add: remember the order by its reference."
          },
          {
            "line": 8,
            "note": "Executed: reduce, and remove when fully filled."
          }
        ],
        "tryIt": "Add a cancel message (\"X\", 3, None, 30, None) that reduces order 3 by 30 shares. How would you handle it?",
        "check": {
          "question": "Why must a feed handler never miss a message?",
          "options": [
            "Messages are expensive",
            "Each message changes the book, so a missed one leaves the rebuilt book wrong",
            "Exchanges fine them"
          ],
          "answer": 1,
          "why": "An order-by-order book is only correct if every change is applied."
        }
      },
      {
        "title": "Practice time: decode and convert",
        "say": [
          "Practice 1: parse_add_order(buf). Check len(buf) == 26, unpack with \">cQcI8sI\", check the type is b\"A\", and build the result dictionary.",
          "The checks decode a buy and a sell message and expect ValueError for a wrong type and for a truncated message.",
          "Practice 2: to_fixed(price) with int(round(price * 10000)), and from_fixed(raw) with round(raw / 10000, 4).",
          "The checks include 0.1 and 19.99, where truncation would fail, and round trips for several prices.",
          "Binary decoding and fixed-point prices are daily work for engineers on trading infrastructure teams.",
          "After passing, write an encoder that turns a parsed dictionary back into bytes, and test that decode(encode(x)) == x.",
          "The example shows that round-trip test style."
        ],
        "example": "Translating a sentence into another language and back again to check nothing was lost.",
        "code": "import struct\n\nFMT = \">cQcI8sI\"\ndef encode(d):\n    return struct.pack(FMT, b\"A\", d[\"ref\"], b\"B\" if d[\"side\"] == \"BUY\" else b\"S\", d[\"shares\"],\n                       d[\"stock\"].ljust(8).encode(\"ascii\"), int(round(d[\"price\"] * 10000)))\ndef decode(buf):\n    _, ref, side, shares, stock, price = struct.unpack(FMT, buf)\n    return {\"ref\": ref, \"side\": \"BUY\" if side == b\"B\" else \"SELL\", \"shares\": shares, \"stock\": stock.decode().strip(), \"price\": price / 10000}\noriginal = {\"ref\": 42, \"side\": \"SELL\", \"shares\": 75, \"stock\": \"WIPRO\", \"price\": 455.35}\nprint(\"round trip equal:\", decode(encode(original)) == original)",
        "output": "round trip equal: True",
        "codeNotes": [
          {
            "line": 6,
            "note": "ljust pads the name to 8 characters."
          },
          {
            "line": 11,
            "note": "Round-trip tests catch mismatched formats."
          }
        ],
        "tryIt": "Try a stock name longer than 8 characters. What happens, and how should encode handle it?",
        "check": {
          "question": "to_fixed(0.1) should return?",
          "options": [
            "999",
            "1000",
            "0"
          ],
          "answer": 1,
          "why": "Rounding avoids the truncation error from 0.1 * 10000 not being exact."
        }
      }
    ],
    "summary": [
      "Binary feeds like ITCH are compact, fixed-layout and fast to decode.",
      "Mind endianness: ITCH is big-endian; struct formats start with \">\".",
      "struct.unpack with a format string decodes fields at fixed offsets; validate length and type first.",
      "Prices travel as fixed-point integers; convert with rounding, not truncation.",
      "Order-by-order feeds rebuild the book by applying add, execute, cancel and delete messages."
    ],
    "projectStep": {
      "title": "Feed handler",
      "steps": [
        "Encode five Add Order messages with struct and decode them back.",
        "Apply a stream of add, execute and delete events to rebuild a small book.",
        "Print the best bid and ask after each event."
      ]
    }
  },
  {
    "day": 11,
    "title": "Kernel Bypass Networking: Solarflare Onload & DPDK Zero-Copy",
    "goal": "You can explain where network latency comes from in the operating system, how kernel bypass (Onload, DPDK) avoids it, how NIC ring buffers and zero-copy consumption work, and how to estimate the savings.",
    "minutes": 30,
    "recap": "Yesterday you decoded binary feeds. Before a message can be decoded it has to travel from the network card to your program. In a normal server, that journey takes many microseconds. Today you cut it down.",
    "parts": [
      {
        "title": "The path of a packet",
        "say": [
          "In a normal server, a packet arrives at the network interface card (NIC), which copies it into memory and raises an interrupt.",
          "The operating system kernel handles the interrupt, runs the network stack (Ethernet, IP, UDP or TCP processing), and copies the data into a socket buffer.",
          "Your program then makes a system call such as recv, which switches from user mode to kernel mode and copies the data again into your program's memory.",
          "Each step is fast by everyday standards, but together they add several microseconds, and much more under load or when the CPU is busy with something else.",
          "For most applications that is fine. For trading, where competitors react in single-digit microseconds, it is a large handicap.",
          "The example adds up a rough latency budget for the standard kernel path.",
          "Numbers vary by hardware; the point is how many separate costs there are."
        ],
        "example": "A letter that goes through the post room, the department secretary and your in-tray before reaching you, instead of being handed to you at the door.",
        "code": "kernel_path_ns = {\n    \"NIC to memory (DMA)\": 500,\n    \"interrupt and scheduling\": 1500,\n    \"kernel network stack\": 2000,\n    \"system call and copy to user\": 1500,\n    \"wake up the waiting thread\": 2500,\n}\nfor step, ns in kernel_path_ns.items():\n    print(f\"{step:30} {ns:5} ns\")\nprint(f\"{'total':30} {sum(kernel_path_ns.values()):5} ns\")",
        "output": "NIC to memory (DMA)              500 ns\ninterrupt and scheduling        1500 ns\nkernel network stack            2000 ns\nsystem call and copy to user    1500 ns\nwake up the waiting thread      2500 ns\ntotal                           8000 ns",
        "codeNotes": [
          {
            "line": 6,
            "note": "Waking a sleeping thread is often the biggest single cost."
          }
        ],
        "tryIt": "Which steps could be removed if your program read packets straight from the NIC's memory?",
        "check": {
          "question": "Why does the normal kernel network path add latency?",
          "options": [
            "Networks are slow",
            "Interrupts, the kernel stack, system calls and extra copies all take time",
            "Python is slow"
          ],
          "answer": 1,
          "why": "Each layer between the NIC and your program adds microseconds."
        }
      },
      {
        "title": "Kernel bypass",
        "say": [
          "Kernel bypass lets a program talk to the NIC directly from user space, skipping the kernel network stack and system calls on the fast path.",
          "Solarflare (now AMD) Onload accelerates normal socket code transparently; DPDK (Data Plane Development Kit) gives programs direct access to NIC queues; other options include ef_vi and RDMA.",
          "Instead of sleeping and waiting for interrupts, the program busy-polls: a dedicated CPU core spins in a loop, checking the NIC's queue for new packets millions of times per second.",
          "Busy polling burns a whole core at 100 percent, but it removes the wake-up delay, which is the biggest cost in the kernel path.",
          "Kernel bypass typically brings network receive latency from several microseconds down to around one microsecond or less.",
          "Practice 2 is bypass_savings(kernel_ns, bypass_ns, msgs_per_day): the speedup factor, the nanoseconds saved per message, and the total seconds saved per day.",
          "The example compares the two paths for one message and for a day of traffic."
        ],
        "example": "Getting a direct phone line to a supplier instead of going through a switchboard operator every time.",
        "code": "def bypass_savings(kernel_ns, bypass_ns, msgs_per_day):\n    saved = kernel_ns - bypass_ns\n    return {\"speedup\": round(kernel_ns / bypass_ns, 2), \"saved_ns\": saved,\n            \"saved_seconds_per_day\": round(saved * msgs_per_day / 1e9, 3)}\n\nprint(bypass_savings(8000, 1200, 50_000_000))\nprint(bypass_savings(8000, 800, 50_000_000))",
        "output": "{'speedup': 6.67, 'saved_ns': 6800, 'saved_seconds_per_day': 340.0}\n{'speedup': 10.0, 'saved_ns': 7200, 'saved_seconds_per_day': 360.0}",
        "codeNotes": [
          {
            "line": 2,
            "note": "Nanoseconds saved per message."
          },
          {
            "line": 4,
            "note": "Summed over a day of messages."
          }
        ],
        "tryIt": "Why do trading firms care about saving microseconds per message, not about the seconds per day?",
        "check": {
          "question": "What does busy polling trade away to save latency?",
          "options": [
            "Memory",
            "A whole CPU core running at 100 percent",
            "Network bandwidth"
          ],
          "answer": 1,
          "why": "Spinning constantly avoids wake-up delays at the cost of a dedicated core."
        }
      },
      {
        "title": "Ring buffers between the NIC and the program",
        "say": [
          "NICs and programs share memory through ring buffers: fixed-size arrays of slots used in a circle.",
          "The NIC writes each new packet into the next slot and advances a head counter. The program reads slots up to the head and advances its own tail counter.",
          "Counters only increase; the slot index is counter modulo the ring size. When the head is ring-size ahead of the tail, the ring is full and new packets are dropped.",
          "Nothing is allocated or freed while running: the slots are created once at start-up and reused forever. That avoids the unpredictable delays of memory allocation.",
          "Practice 1 is consume_ring(ring, head, tail, max_batch): read up to max_batch packets from tail towards head, wrapping around the end of the list, and return them with the new tail.",
          "Reading in batches amortises per-call costs: checking the head once for many packets is cheaper than once per packet.",
          "The example writes and reads a small ring, showing the wrap-around."
        ],
        "example": "A revolving sushi belt with a fixed number of plates: the chef keeps placing dishes, you keep taking them, and plates go round and round.",
        "code": "size = 8\nring = [None] * size\nhead = tail = 0\nfor i in range(11):                       # the NIC writes 11 packets\n    if head - tail == size:\n        tail += 1                          # oldest packet lost (overwritten) in this toy\n    ring[head % size] = f\"p{i}\"\n    head += 1\nprint(\"ring slots:\", ring)\nbatch = [ring[(tail + k) % size] for k in range(min(4, head - tail))]\nprint(\"head\", head, \"tail\", tail, \"-> next batch:\", batch)",
        "output": "ring slots: ['p8', 'p9', 'p10', 'p3', 'p4', 'p5', 'p6', 'p7']\nhead 11 tail 3 -> next batch: ['p3', 'p4', 'p5', 'p6']",
        "codeNotes": [
          {
            "line": 7,
            "note": "The slot is the counter modulo the ring size."
          },
          {
            "line": 10,
            "note": "Read up to 4 packets, wrapping around the end."
          }
        ],
        "tryIt": "Real NICs drop the NEW packet when the ring is full instead of overwriting. Change the toy to do that.",
        "check": {
          "question": "Why are ring buffers pre-allocated at start-up?",
          "options": [
            "To use less memory",
            "To avoid memory allocation delays while trading",
            "The NIC requires Python lists"
          ],
          "answer": 1,
          "why": "Reusing fixed slots removes unpredictable allocation costs from the hot path."
        }
      },
      {
        "title": "Zero copy",
        "say": [
          "Every copy of a packet costs time proportional to its size, and it pollutes the CPU cache with data.",
          "Zero-copy designs let the program read the packet where the NIC wrote it, without copying it into another buffer first.",
          "In Python, memoryview gives a zero-copy window onto bytes: slicing a memoryview does not copy, unlike slicing bytes, which does.",
          "The decoder from Day 10 can read fields straight out of that shared memory with struct.unpack_from at an offset.",
          "After processing, the program advances its tail so the NIC can reuse the slot; holding on to slot memory after that would read overwritten data.",
          "The example shows that memoryview slices share memory while bytes slices copy it.",
          "Zero-copy thinking extends beyond networking: avoid copying data anywhere on the critical path."
        ],
        "example": "Reading a notice on the board where it is pinned instead of photocopying it first.",
        "code": "import struct\n\nbuf = bytearray(struct.pack(\">cQcI\", b\"A\", 42, b\"B\", 250))\nview = memoryview(buf)\nwindow = view[1:9]                  # no copy\ncopy = bytes(buf[1:9])              # a copy\nbuf[8] = 43                         # the NIC overwrites a byte\nprint(\"through the view:\", struct.unpack(\">Q\", window)[0])\nprint(\"from the old copy:\", struct.unpack(\">Q\", copy)[0])\nprint(\"unpack_from at offset 1:\", struct.unpack_from(\">Q\", buf, 1)[0])",
        "output": "through the view: 43\nfrom the old copy: 42\nunpack_from at offset 1: 43",
        "codeNotes": [
          {
            "line": 5,
            "note": "A memoryview slice shares memory with buf."
          },
          {
            "line": 10,
            "note": "unpack_from reads directly at an offset without slicing."
          }
        ],
        "tryIt": "Why is it dangerous to keep using a view after telling the NIC it may reuse the slot?",
        "check": {
          "question": "What does a memoryview slice avoid?",
          "options": [
            "Decoding",
            "Copying the underlying bytes",
            "Endianness errors"
          ],
          "answer": 1,
          "why": "memoryview slices share memory instead of copying it."
        }
      },
      {
        "title": "CPU pinning and jitter",
        "say": [
          "Low average latency is not enough; latency must also be consistent. Variation is called jitter.",
          "Operating systems move threads between cores, run background tasks and handle interrupts, all of which can pause a latency-critical thread.",
          "Firms reduce jitter by pinning each critical thread to its own core, isolating those cores from the operating system scheduler, and routing interrupts elsewhere.",
          "They also disable power-saving CPU states that take time to wake up, and keep hot data small enough to stay in the CPU caches (Day 13).",
          "Measuring jitter means looking at the whole latency distribution: p99 and p99.9 and the maximum, as on Day 5.",
          "The example compares two latency samples with the same average but very different tails.",
          "Consistency is often more valuable than a slightly lower average."
        ],
        "example": "A train that averages on time but is sometimes an hour late is less useful than one that is always exactly two minutes late.",
        "code": "import statistics\n\nsteady = [1000] * 100\njittery = [800] * 95 + [4800] * 5\nfor name, s in [(\"steady\", steady), (\"jittery\", jittery)]:\n    ordered = sorted(s)\n    print(f\"{name:8} mean {statistics.mean(s):6.0f} ns  p99 {ordered[98]:5} ns  max {ordered[-1]:5} ns\")",
        "output": "steady   mean   1000 ns  p99  1000 ns  max  1000 ns\njittery  mean   1000 ns  p99  4800 ns  max  4800 ns",
        "codeNotes": [
          {
            "line": 7,
            "note": "Same mean, very different worst cases."
          }
        ],
        "tryIt": "Which system would a market maker prefer, and why?",
        "check": {
          "question": "What is jitter?",
          "options": [
            "A type of network cable",
            "Variation in latency from one message to the next",
            "A CPU instruction"
          ],
          "answer": 1,
          "why": "Jitter is inconsistency in latency."
        }
      },
      {
        "title": "Practice time: rings and savings",
        "say": [
          "Practice 1: consume_ring(ring, head, tail, max_batch). n = min(max_batch, head - tail) (never negative); packets = ring[(tail + i) % len(ring)] for i in range(n); new_tail = tail + n.",
          "The checks use a ring whose first slots have already been overwritten by newer packets, so the batch must wrap from the end back to the start.",
          "When head equals tail there is nothing to read, and the function must return an empty list and the same tail.",
          "Practice 2: bypass_savings(kernel_ns, bypass_ns, msgs_per_day). Three simple calculations with the given rounding.",
          "These functions model real infrastructure; the actual code lives in C or C++ drivers, but the logic is identical.",
          "After passing, simulate a producer and consumer over the same ring for 20 steps with different speeds and count drops.",
          "The example does that."
        ],
        "example": "A bucket brigade where the person filling buckets and the person emptying them work at different speeds.",
        "code": "size, head, tail, drops = 8, 0, 0, 0\nfor step in range(20):\n    for _ in range(3):                 # the NIC receives 3 packets per step\n        if head - tail == size:\n            drops += 1\n        else:\n            head += 1\n    tail += min(2, head - tail)        # the program reads at most 2 per step\nprint(\"delivered:\", tail, \"| still queued:\", head - tail, \"| dropped:\", drops)",
        "output": "delivered: 40 | still queued: 6 | dropped: 14",
        "codeNotes": [
          {
            "line": 4,
            "note": "A full ring drops the new packet."
          },
          {
            "line": 8,
            "note": "The consumer is slower than the producer."
          }
        ],
        "tryIt": "Make the consumer read 4 per step. How many packets are dropped now?",
        "check": {
          "question": "consume_ring(ring, 10, 10, 4) returns?",
          "options": [
            "4 packets",
            "An empty list and tail 10",
            "An error"
          ],
          "answer": 1,
          "why": "head equals tail, so there is nothing new to read."
        }
      }
    ],
    "summary": [
      "The kernel network path adds microseconds through interrupts, the stack, system calls and copies.",
      "Kernel bypass (Onload, DPDK) reads NIC queues from user space with busy polling.",
      "Ring buffers are pre-allocated circular arrays with head and tail counters; slot = counter % size.",
      "Zero-copy reads packets in place (memoryview, unpack_from) and releases slots after use.",
      "Pin threads, isolate cores and measure tails to reduce jitter."
    ],
    "projectStep": {
      "title": "Low-latency receive path",
      "steps": [
        "Simulate a NIC ring with a producer and a consumer at different speeds and count drops.",
        "Decode packets in place with memoryview and struct.unpack_from.",
        "Estimate daily savings of kernel bypass for your own message volume."
      ]
    }
  },
  {
    "day": 12,
    "title": "Lock-Free Ring Buffers: Single-Producer Single-Consumer (SPSC) Architecture",
    "goal": "You can explain why locks hurt latency, how a single-producer single-consumer (SPSC) ring queue works without locks, why capacities are powers of two, and implement and test such a queue.",
    "minutes": 30,
    "recap": "Yesterday a ring buffer carried packets from the NIC to your program. Inside the program, threads pass messages to each other the same way: through lock-free ring queues.",
    "parts": [
      {
        "title": "Threads and the cost of locks",
        "say": [
          "Trading systems split work across threads: one reads the feed, one runs the strategy, one sends orders, one logs.",
          "Threads pass messages through queues. The simplest safe queue uses a lock (mutex) so only one thread touches it at a time.",
          "Locks are cheap when nobody else holds them, but under contention a thread may have to wait, or even be put to sleep by the operating system and woken later: microseconds of delay.",
          "Worse, a thread holding a lock can be descheduled, making every other thread wait for it. Latency becomes unpredictable.",
          "Lock-free designs avoid this by letting threads coordinate through carefully ordered reads and writes of shared counters, with no waiting on a lock.",
          "The example shows how waiting time grows as more threads compete for one lock, with a toy model.",
          "The most common lock-free structure in trading is the single-producer single-consumer ring queue."
        ],
        "example": "A single-lane bridge with a traffic light: fine when traffic is light, a long queue when many cars arrive together.",
        "code": "service_ns = 50                      # time to use the queue once\nfor threads in [1, 2, 4, 8, 16]:\n    worst_wait = (threads - 1) * service_ns\n    print(f\"{threads:2} threads competing: worst wait about {worst_wait:4} ns before any context switch\")",
        "output": " 1 threads competing: worst wait about    0 ns before any context switch\n 2 threads competing: worst wait about   50 ns before any context switch\n 4 threads competing: worst wait about  150 ns before any context switch\n 8 threads competing: worst wait about  350 ns before any context switch\n16 threads competing: worst wait about  750 ns before any context switch",
        "codeNotes": [
          {
            "line": 3,
            "note": "Each thread may wait for all the others ahead of it."
          }
        ],
        "tryIt": "If waiting too long makes the operating system put a thread to sleep for 5,000 ns, how does that change the picture?",
        "check": {
          "question": "Why are locks a problem for low-latency systems?",
          "options": [
            "They use too much memory",
            "Contention and descheduling cause unpredictable waiting",
            "They are not thread-safe"
          ],
          "answer": 1,
          "why": "Waiting on locks adds variable, sometimes large, delays."
        }
      },
      {
        "title": "The SPSC ring queue",
        "say": [
          "An SPSC queue has exactly one producer thread and one consumer thread. That restriction is what makes a simple lock-free design possible.",
          "It holds a fixed array of slots, a head counter written only by the producer, and a tail counter written only by the consumer.",
          "To enqueue, the producer checks there is space (head - tail < capacity), writes the item into slot head, then increments head. To dequeue, the consumer checks there is an item (tail < head), reads slot tail, then increments tail.",
          "Because each counter has only one writer, the two threads never write the same variable, so no lock is needed.",
          "The order of operations matters: the producer must write the item BEFORE publishing the new head, or the consumer could read a slot that is not ready. In C++ this uses release and acquire memory ordering.",
          "Practice 1 is the SpscQueue class with enqueue, dequeue and size, using a power-of-two capacity.",
          "The example runs a queue through fill, drain and wrap-around."
        ],
        "example": "A letterbox with one person posting and one person collecting: the poster only moves the \"posted\" counter, the collector only moves the \"collected\" counter, so they never argue.",
        "code": "class SpscQueue:\n    def __init__(self, capacity):\n        if capacity <= 0 or capacity & (capacity - 1):\n            raise ValueError(\"capacity must be a power of two\")\n        self.mask, self.slots = capacity - 1, [None] * capacity\n        self.head = self.tail = 0\n    def enqueue(self, item):\n        if self.head - self.tail == len(self.slots):\n            return False\n        self.slots[self.head & self.mask] = item   # write the item first\n        self.head += 1                               # then publish it\n        return True\n    def dequeue(self):\n        if self.tail == self.head:\n            return None\n        item = self.slots[self.tail & self.mask]\n        self.tail += 1\n        return item\n\nq = SpscQueue(4)\nprint([q.enqueue(x) for x in \"abcde\"], q.dequeue(), q.dequeue(), q.enqueue(\"f\"), [q.dequeue() for _ in range(5)])",
        "output": "[True, True, True, True, False] a b True ['c', 'd', 'f', None, None]",
        "codeNotes": [
          {
            "line": 10,
            "note": "Write the slot before advancing head."
          },
          {
            "line": 16,
            "note": "& mask replaces % capacity."
          }
        ],
        "tryIt": "What would go wrong if two producer threads used this queue at the same time?",
        "check": {
          "question": "Why can an SPSC queue work without locks?",
          "options": [
            "Python has no threads",
            "Each counter has exactly one writer, so threads never write the same variable",
            "It copies every item"
          ],
          "answer": 1,
          "why": "Single-writer counters avoid write conflicts."
        }
      },
      {
        "title": "Why powers of two",
        "say": [
          "Finding a slot needs counter modulo capacity. Division (and therefore modulo) is one of the slowest integer operations on a CPU, taking tens of cycles.",
          "When capacity is a power of two, counter % capacity equals counter & (capacity - 1), a single-cycle bitwise AND.",
          "For example, with capacity 8 (binary 1000), the mask is 7 (binary 0111): AND keeps only the low three bits, which is exactly the remainder.",
          "A number n is a power of two exactly when n > 0 and n & (n - 1) == 0, because a power of two has a single 1 bit, and subtracting 1 flips it and all lower bits.",
          "Practice 2 is is_power_of_two(n) and next_power_of_two(n), used to size queues: ask for 1,000 slots and get 1,024.",
          "The example checks that the mask and modulo agree for many counters.",
          "Bit tricks like this appear throughout high-performance code."
        ],
        "example": "A clock face: to find the hour after many hours have passed you only need the remainder, and with 8 hours on the face, the remainder is just the last three bits.",
        "code": "capacity = 8\nmask = capacity - 1\nprint(\"mask in binary:\", bin(mask))\nprint(\"all agree:\", all(c % capacity == c & mask for c in range(1000)))\nfor n in [1, 6, 8, 12, 64, 100]:\n    print(f\"{n:3} = {bin(n):>9}  power of two: {n > 0 and n & (n - 1) == 0}\")",
        "output": "mask in binary: 0b111\nall agree: True\n  1 =       0b1  power of two: True\n  6 =     0b110  power of two: False\n  8 =    0b1000  power of two: True\n 12 =    0b1100  power of two: False\n 64 = 0b1000000  power of two: True\n100 = 0b1100100  power of two: False",
        "codeNotes": [
          {
            "line": 4,
            "note": "For powers of two, modulo equals a bitwise AND with the mask."
          },
          {
            "line": 6,
            "note": "A power of two has a single 1 bit."
          }
        ],
        "tryIt": "Check whether c % 6 == c & 5 for all c. Why does it fail?",
        "check": {
          "question": "For capacity 16, what is the mask?",
          "options": [
            "16",
            "15",
            "8"
          ],
          "answer": 1,
          "why": "The mask is capacity - 1 = 15 (binary 1111)."
        }
      },
      {
        "title": "Full, empty and back-pressure",
        "say": [
          "A bounded queue must decide what happens when it is full. There are three common choices.",
          "Reject: enqueue returns False and the producer decides what to do (drop, retry, raise an alarm). That is our design.",
          "Block: the producer waits until space frees up, which pushes delay back up the pipeline. That is back-pressure.",
          "Overwrite: the oldest item is replaced, suitable for data where only the latest value matters, like a price snapshot.",
          "For market data, a consumer that falls behind is a serious problem: its view of the book is stale. Systems alarm on queue depth long before the queue is full.",
          "The example monitors queue depth and raises an alert above 75 percent.",
          "Choose the full-queue policy deliberately for each queue; never leave it to chance."
        ],
        "example": "A restaurant kitchen: when the order rail is full, the waiter can stop taking orders, wait, or throw away the oldest ticket. Each choice has consequences.",
        "code": "capacity, depth, alerts = 16, 0, []\narrivals = [6, 6, 6, 6, 6, 0, 0]\nfor tick, n in enumerate(arrivals):\n    depth = min(capacity, depth + n)\n    if depth > 0.75 * capacity:\n        alerts.append(tick)\n    depth -= min(depth, 3)             # the consumer handles 3 per tick\nprint(\"ticks with high queue depth:\", alerts)",
        "output": "ticks with high queue depth: [3, 4, 5]",
        "codeNotes": [
          {
            "line": 5,
            "note": "Alert well before the queue is completely full."
          }
        ],
        "tryIt": "Which full-queue policy would you choose for an order-sending queue? Why is overwriting dangerous there?",
        "check": {
          "question": "Which full-queue policy suits a stream where only the latest price matters?",
          "options": [
            "Reject",
            "Block",
            "Overwrite the oldest"
          ],
          "answer": 2,
          "why": "If only the newest value matters, overwriting old ones is acceptable."
        }
      },
      {
        "title": "Testing concurrent code",
        "say": [
          "Concurrent bugs are notoriously hard to find: they depend on timing and may appear once in a million runs.",
          "Start with single-threaded tests of every path: empty, full, wrap-around, and many cycles of fill and drain. Most logic bugs show up here.",
          "Then run stress tests with real threads, checking invariants: every item sent is received exactly once, in order.",
          "Tools like thread sanitisers (in C++) detect data races; model checkers explore many interleavings systematically.",
          "In Python, the global interpreter lock hides many races, so Python queue tests check logic rather than memory ordering, but the invariants are the same.",
          "The example sends 10,000 items through a small queue with interleaved enqueues and dequeues and checks nothing is lost or reordered.",
          "An invariant check that runs on every test is worth more than any number of hand-picked examples."
        ],
        "example": "Testing a new bridge by sending thousands of vehicles across in every pattern you can think of, and counting that every one arrives.",
        "code": "from collections import deque\n\nslots, mask, head, tail = [None] * 8, 7, 0, 0\nreceived, pending = [], deque(range(10000))\nstep = 0\nwhile pending or tail < head:\n    step += 1\n    for _ in range(step % 5):          # the producer sends a varying burst\n        if pending and head - tail < 8:\n            slots[head & mask] = pending.popleft(); head += 1\n    for _ in range(step % 3 + 1):      # the consumer reads a varying amount\n        if tail < head:\n            received.append(slots[tail & mask]); tail += 1\nprint(\"all received in order:\", received == list(range(10000)))",
        "output": "all received in order: True",
        "codeNotes": [
          {
            "line": 8,
            "note": "Irregular bursts exercise full, empty and wrap-around cases."
          },
          {
            "line": 14,
            "note": "The invariant: everything arrives exactly once, in order."
          }
        ],
        "tryIt": "Introduce a bug (for example, read slots[head & mask] instead of tail). Does the invariant catch it?",
        "check": {
          "question": "What invariant should every queue stress test check?",
          "options": [
            "The queue is always full",
            "Every item sent is received exactly once, in order",
            "The queue never wraps"
          ],
          "answer": 1,
          "why": "No loss, no duplication, no reordering."
        }
      },
      {
        "title": "Practice time: build the queue",
        "say": [
          "Practice 1: SpscQueue. In __init__, validate the capacity with the power-of-two test, store capacity, mask and slots, and set head and tail to 0.",
          "enqueue: return False if head - tail == capacity; otherwise store at slots[head & mask], increment head, return True. dequeue: return None if empty; otherwise read slots[tail & mask], increment tail, return the item. size: head - tail.",
          "The checks fill a capacity-4 queue, confirm the fifth enqueue fails, drain in FIFO order, wrap around, and reject capacities 3, 6 and 0.",
          "Practice 2: is_power_of_two(n) and next_power_of_two(n). The first is one expression; the second doubles p from 1 until p >= n.",
          "These two pieces are in almost every low-latency codebase, from trading to games to audio processing.",
          "After passing, add a peek() method that returns the next item without removing it.",
          "The example shows the doubling loop for next_power_of_two."
        ],
        "example": "Choosing a box size by doubling from the smallest box until your items fit.",
        "code": "def next_power_of_two(n):\n    p = 1\n    while p < n:\n        p *= 2\n    return p\n\nfor n in [1, 3, 8, 65, 1000, 4097]:\n    print(f\"{n:5} -> {next_power_of_two(n)}\")",
        "output": "    1 -> 1\n    3 -> 4\n    8 -> 8\n   65 -> 128\n 1000 -> 1024\n 4097 -> 8192",
        "codeNotes": [
          {
            "line": 3,
            "note": "Double until p is at least n."
          }
        ],
        "tryIt": "How many loop iterations are needed for n = 1,000,000?",
        "check": {
          "question": "SpscQueue(4) after 4 enqueues: what does a fifth enqueue return?",
          "options": [
            "True",
            "False",
            "None"
          ],
          "answer": 1,
          "why": "The queue is full, so enqueue reports failure."
        }
      }
    ],
    "summary": [
      "Locks cause unpredictable waiting under contention; lock-free queues avoid it.",
      "An SPSC ring queue has one producer (writes head) and one consumer (writes tail).",
      "Write the slot before publishing the new head; readers must not see unready slots.",
      "Power-of-two capacities let counter & mask replace slow modulo.",
      "Choose full-queue policies deliberately and stress-test with invariants."
    ],
    "projectStep": {
      "title": "Inter-thread pipeline",
      "steps": [
        "Build SpscQueue and push 100,000 items through it with irregular bursts.",
        "Check the no-loss, in-order invariant and measure the maximum depth reached.",
        "Add a depth alert and a policy for what happens when the queue is full."
      ]
    }
  },
  {
    "day": 13,
    "title": "CPU Cacheline Alignment & False Sharing Elimination in C++",
    "goal": "You can explain CPU caches and cache lines, why memory layout affects speed, what false sharing is and how to detect it, and how padding and alignment fix it.",
    "minutes": 30,
    "recap": "Yesterday two threads shared a queue with separate head and tail counters. If those two counters sit next to each other in memory, the threads can still slow each other down badly. Today you learn why.",
    "parts": [
      {
        "title": "Caches and cache lines",
        "say": [
          "Main memory (RAM) is slow compared with the CPU: fetching data can take around 100 nanoseconds, time in which a core could run hundreds of instructions.",
          "CPUs therefore keep copies of recently used data in caches: L1 (tiny, about 1 ns), L2 (a few ns) and L3 (shared between cores, around 10 to 20 ns).",
          "Caches do not move single bytes. They move fixed blocks called cache lines, 64 bytes on most modern CPUs.",
          "So reading one byte brings its whole 64-byte line into the cache. Neighbouring data comes along for free, which is why scanning an array in order is fast.",
          "Code that jumps randomly around memory keeps missing the cache and waiting for RAM; code that uses memory in order runs many times faster.",
          "The example shows which cache line different memory offsets fall into.",
          "Thinking in cache lines is one of the most important habits for writing fast code."
        ],
        "example": "A library that lends books by the shelf, not by the book: fetching one book brings its 63 neighbours to your desk too.",
        "code": "LINE = 64\nfor offset in [0, 8, 63, 64, 100, 128, 200]:\n    print(f\"byte offset {offset:3} is in cache line {offset // LINE}\")\nlatency_ns = {\"L1\": 1, \"L2\": 4, \"L3\": 15, \"RAM\": 100}\nprint(\"typical access times:\", latency_ns)",
        "output": "byte offset   0 is in cache line 0\nbyte offset   8 is in cache line 0\nbyte offset  63 is in cache line 0\nbyte offset  64 is in cache line 1\nbyte offset 100 is in cache line 1\nbyte offset 128 is in cache line 2\nbyte offset 200 is in cache line 3\ntypical access times: {'L1': 1, 'L2': 4, 'L3': 15, 'RAM': 100}",
        "codeNotes": [
          {
            "line": 3,
            "note": "Integer division by 64 gives the cache line number."
          }
        ],
        "tryIt": "Two 8-byte counters at offsets 0 and 8: are they in the same line? What about offsets 0 and 64?",
        "check": {
          "question": "How big is a typical CPU cache line?",
          "options": [
            "8 bytes",
            "64 bytes",
            "4 kilobytes"
          ],
          "answer": 1,
          "why": "Most modern CPUs use 64-byte cache lines."
        }
      },
      {
        "title": "Cache coherence",
        "say": [
          "Each core has its own L1 and L2 caches. When two cores use the same data, the CPU must keep their copies consistent. This is cache coherence.",
          "The common MESI protocol marks each line as Modified, Exclusive, Shared or Invalid. Before a core writes a line, it must invalidate every other core's copy.",
          "If two cores keep writing the same line, the line bounces between them: each write invalidates the other core's copy, which must then fetch it again.",
          "Each bounce costs tens of nanoseconds, far more than the write itself.",
          "For truly shared data (the same variable) this is unavoidable and a reason to avoid sharing. For data that merely happens to share a line, it is an avoidable disaster called false sharing.",
          "The example simulates counting line transfers when two cores alternate writes to the same line versus separate lines.",
          "Coherence is automatic and correct; it is only the performance that suffers."
        ],
        "example": "Two people editing the same page of a shared notebook: every time one writes, the other must hand the notebook back first.",
        "code": "def transfers(writes):\n    owner, count = {}, 0\n    for core, line in writes:\n        if owner.get(line) not in (None, core):\n            count += 1                  # the line moves from the other core\n        owner[line] = core\n    return count\n\nsame_line = [(i % 2, 0) for i in range(1000)]              # cores 0 and 1 alternate on line 0\nseparate = [(i % 2, i % 2) for i in range(1000)]            # each core has its own line\nprint(\"same line transfers:\", transfers(same_line))\nprint(\"separate lines transfers:\", transfers(separate))",
        "output": "same line transfers: 999\nseparate lines transfers: 0",
        "codeNotes": [
          {
            "line": 4,
            "note": "A write by a different core than the last owner forces a transfer."
          }
        ],
        "tryIt": "If each transfer costs 50 ns, how much time do the same-line writes waste?",
        "check": {
          "question": "What happens when two cores repeatedly write to the same cache line?",
          "options": [
            "Nothing",
            "The line bounces between their caches, costing time on every write",
            "The CPU crashes"
          ],
          "answer": 1,
          "why": "Coherence traffic makes each write expensive."
        }
      },
      {
        "title": "False sharing",
        "say": [
          "False sharing happens when two threads write DIFFERENT variables that happen to sit in the same cache line.",
          "Logically they share nothing, but the hardware sees one line being written by two cores and bounces it back and forth.",
          "The classic case is exactly our SPSC queue: the producer's head and the consumer's tail, declared next to each other, share a line.",
          "Symptoms are strange: adding a second thread makes things slower, and performance changes when unrelated fields are added to a structure.",
          "Practice 1 is false_sharing(fields): each field has an offset, a size and the thread that writes it; report every pair written by different threads that share a cache line.",
          "A field can span two lines if it crosses a 64-byte boundary, so compute the range of lines each field covers.",
          "The example lays out a structure and lists which fields share lines."
        ],
        "example": "Two neighbours with separate gardens but one shared gate: every time either uses it, the other has to wait, even though they never visit each other.",
        "code": "fields = [(\"producer_head\", 0, 8, 0), (\"consumer_tail\", 8, 8, 1), (\"stats\", 60, 16, 2)]\nLINE = 64\ndef lines(offset, size):\n    return set(range(offset // LINE, (offset + size - 1) // LINE + 1))\nfor name, off, size, thread in fields:\n    print(f\"{name:14} thread {thread} lines {sorted(lines(off, size))}\")\npairs = [(a[0], b[0]) for i, a in enumerate(fields) for b in fields[i + 1:]\n         if a[3] != b[3] and lines(a[1], a[2]) & lines(b[1], b[2])]\nprint(\"false sharing pairs:\", pairs)",
        "output": "producer_head  thread 0 lines [0]\nconsumer_tail  thread 1 lines [0]\nstats          thread 2 lines [0, 1]\nfalse sharing pairs: [('producer_head', 'consumer_tail'), ('producer_head', 'stats'), ('consumer_tail', 'stats')]",
        "codeNotes": [
          {
            "line": 4,
            "note": "A field covers every line from its first to its last byte."
          },
          {
            "line": 8,
            "note": "Different threads plus a shared line means false sharing."
          }
        ],
        "tryIt": "The stats field starts at offset 60 and is 16 bytes long. Which lines does it touch, and why does that matter?",
        "check": {
          "question": "What is false sharing?",
          "options": [
            "Two threads sharing a variable on purpose",
            "Different threads writing different variables that sit in the same cache line",
            "Sharing a lock"
          ],
          "answer": 1,
          "why": "The variables are separate, but the cache line is shared."
        }
      },
      {
        "title": "Padding and alignment",
        "say": [
          "The fix is to give each independently written field its own cache line: add unused padding bytes so the next field starts at a multiple of 64.",
          "In C++ this is done with alignas(64) or explicit padding arrays; Java has an annotation for it; Rust has similar attributes.",
          "The padding needed to reach the next line is (-size) % 64: for a 40-byte structure, 24 bytes; for exactly 64 bytes, 0.",
          "Practice 2 is padding_bytes(size, line=64) and padded_size(size, line=64).",
          "Padding costs memory, so apply it only to data written by different threads at high frequency, such as queue counters and per-thread statistics.",
          "Some CPUs fetch pairs of adjacent lines, so certain libraries pad to 128 bytes to be safe.",
          "The example pads the queue structure and re-runs the false sharing check."
        ],
        "example": "Leaving an empty parking space between two cars whose doors swing wide, so neither blocks the other.",
        "code": "def padded_offset(offset, line=64):\n    return offset + (-offset) % line\n\nlayout, offset = [], 0\nfor name, size, thread in [(\"producer_head\", 8, 0), (\"consumer_tail\", 8, 1), (\"stats\", 16, 2)]:\n    offset = padded_offset(offset)\n    layout.append((name, offset, size, thread))\n    offset += size\nfor name, off, size, thread in layout:\n    print(f\"{name:14} offset {off:3} line {off // 64}\")\nprint(\"total size with padding:\", offset + (-offset) % 64, \"bytes instead of\", 8 + 8 + 16)",
        "output": "producer_head  offset   0 line 0\nconsumer_tail  offset  64 line 1\nstats          offset 128 line 2\ntotal size with padding: 192 bytes instead of 32",
        "codeNotes": [
          {
            "line": 2,
            "note": "Round the offset up to the next multiple of the line size."
          },
          {
            "line": 11,
            "note": "Padding trades memory for speed."
          }
        ],
        "tryIt": "Which of these fields could safely share a line without padding? Think about which threads write them.",
        "check": {
          "question": "How many padding bytes does a 40-byte structure need to fill a 64-byte line?",
          "options": [
            "40",
            "24",
            "64"
          ],
          "answer": 1,
          "why": "(-40) % 64 = 24."
        }
      },
      {
        "title": "Data layout for speed",
        "say": [
          "Beyond false sharing, how you arrange data decides how well you use each cache line.",
          "Hot and cold splitting: keep the fields used on every message (price, quantity) together, and move rarely used ones (client notes, audit info) elsewhere, so each line carries only useful data.",
          "Array of structures versus structure of arrays: if a loop only reads prices, storing all prices together in one array is far more cache-friendly than storing whole order objects.",
          "Avoid pointer chasing, such as linked lists and trees of small objects scattered in memory; prefer contiguous arrays.",
          "Python hides memory layout, but libraries like NumPy expose it: a NumPy array of prices is contiguous, and that is a big reason it is fast.",
          "The example counts how many cache lines a price scan touches in each layout, with toy sizes.",
          "The fastest code is usually the code that touches the fewest cache lines."
        ],
        "example": "Packing a suitcase: put the things you need every day on top together, and bury the rarely used items at the bottom.",
        "code": "orders = 1000\norder_struct_bytes = 96          # id, price, qty, side, client info, timestamps...\nprice_bytes = 8\naos_lines = orders * order_struct_bytes // 64\nsoa_lines = orders * price_bytes // 64\nprint(\"scan prices, array of structures:\", aos_lines, \"cache lines\")\nprint(\"scan prices, structure of arrays:\", soa_lines, \"cache lines\")\nprint(f\"about {aos_lines / soa_lines:.0f}x fewer lines to fetch\")",
        "output": "scan prices, array of structures: 1500 cache lines\nscan prices, structure of arrays: 125 cache lines\nabout 12x fewer lines to fetch",
        "codeNotes": [
          {
            "line": 4,
            "note": "Whole structs come along even though only the price is needed."
          },
          {
            "line": 5,
            "note": "Prices packed together fill every line with useful data."
          }
        ],
        "tryIt": "If the loop also needs the quantity, how many lines does each layout touch?",
        "check": {
          "question": "Why is a structure of arrays often faster for scanning one field?",
          "options": [
            "It uses less CPU",
            "Every fetched cache line is full of the needed field",
            "It avoids Python"
          ],
          "answer": 1,
          "why": "Contiguous values of one field use cache lines efficiently."
        }
      },
      {
        "title": "Practice time: audit and pad",
        "say": [
          "Practice 1: false_sharing(fields, line=64). Write a helper that returns the set of lines a field covers, then check every pair: different threads and a non-empty intersection of line sets.",
          "Return sorted tuples of names (name_a < name_b) in a sorted list, so results are stable regardless of input order.",
          "The checks include a field that crosses a line boundary, a padded layout with no problems, and two fields written by the same thread, which is fine.",
          "Practice 2: padding_bytes(size, line=64) returns (-size) % line; padded_size adds it to size.",
          "After passing, run false_sharing on the padded layout from the example to confirm the fix.",
          "These tools mirror real audits: performance engineers scan structure layouts for exactly these problems.",
          "The example shows the (-size) % line trick for several sizes."
        ],
        "example": "A clever measuring stick that tells you exactly how much space is left to the next full box.",
        "code": "for size in [0, 1, 40, 63, 64, 65, 200]:\n    pad = (-size) % 64\n    print(f\"size {size:3}: pad {pad:2} -> {size + pad}\")",
        "output": "size   0: pad  0 -> 0\nsize   1: pad 63 -> 64\nsize  40: pad 24 -> 64\nsize  63: pad  1 -> 64\nsize  64: pad  0 -> 64\nsize  65: pad 63 -> 128\nsize 200: pad 56 -> 256",
        "codeNotes": [
          {
            "line": 2,
            "note": "Python's % always returns a non-negative result for a positive modulus."
          }
        ],
        "tryIt": "What does (-size) % 128 give for size 100?",
        "check": {
          "question": "Two fields written by the SAME thread share a line. Is that false sharing?",
          "options": [
            "Yes",
            "No, only writes from different threads cause the problem",
            "Only on Tuesdays"
          ],
          "answer": 1,
          "why": "False sharing needs writes from different cores."
        }
      }
    ],
    "summary": [
      "CPUs cache memory in 64-byte lines; access in order is fast, random access is slow.",
      "Cache coherence invalidates other cores' copies on writes, so shared lines bounce between cores.",
      "False sharing: different threads writing different variables in the same line.",
      "Fix it with padding and alignment; padding = (-size) % 64.",
      "Lay out hot data together and prefer structures of arrays for scans."
    ],
    "projectStep": {
      "title": "Layout audit",
      "steps": [
        "Describe a queue or statistics structure with field offsets, sizes and writer threads.",
        "Run false_sharing, then pad the layout and run it again.",
        "Estimate cache lines touched by a scan in two layouts."
      ]
    }
  },
  {
    "day": 14,
    "title": "SIMD Vectorization (AVX-512) for Pricing & Risk Kernels",
    "goal": "You can explain SIMD vectorisation, model how a vector unit processes chunks with a scalar tail, estimate speedups with Amdahl's law, and recognise which pricing and risk calculations vectorise well.",
    "minutes": 30,
    "recap": "Yesterday you arranged data so the CPU fetches it efficiently. Today you process it efficiently: one instruction doing the same operation on many numbers at once.",
    "parts": [
      {
        "title": "Single instruction, multiple data",
        "say": [
          "SIMD (single instruction, multiple data) lets one CPU instruction operate on several numbers at once, held side by side in a wide register.",
          "Intel and AMD CPUs have 128-bit SSE, 256-bit AVX2 and 512-bit AVX-512 registers; ARM CPUs have NEON and SVE.",
          "A 256-bit register holds 8 single-precision (32-bit) floats or 4 double-precision (64-bit) ones. A 512-bit register holds 16 floats.",
          "So adding two arrays of floats with AVX2 can process 8 pairs per instruction instead of 1, up to 8 times faster in the best case.",
          "Compilers auto-vectorise simple loops; for the hottest code, engineers write intrinsics (special functions that map to SIMD instructions) by hand.",
          "The example shows how many lanes different register widths have for floats and doubles.",
          "Python does not expose SIMD directly, but NumPy uses it under the hood, which is one reason NumPy is so much faster than Python loops."
        ],
        "example": "A baker pressing a cookie cutter that cuts eight cookies at once instead of cutting them one by one.",
        "code": "for name, bits in [(\"SSE\", 128), (\"AVX2\", 256), (\"AVX-512\", 512)]:\n    print(f\"{name:8} {bits:3}-bit register: {bits // 32:2} floats or {bits // 64} doubles per instruction\")",
        "output": "SSE      128-bit register:  4 floats or 2 doubles per instruction\nAVX2     256-bit register:  8 floats or 4 doubles per instruction\nAVX-512  512-bit register: 16 floats or 8 doubles per instruction",
        "codeNotes": [
          {
            "line": 2,
            "note": "Lanes = register width / element width."
          }
        ],
        "tryIt": "How many 16-bit integers fit in an AVX-512 register?",
        "check": {
          "question": "How many 32-bit floats fit in a 256-bit AVX2 register?",
          "options": [
            "4",
            "8",
            "16"
          ],
          "answer": 1,
          "why": "256 / 32 = 8 lanes."
        }
      },
      {
        "title": "Chunks and the scalar tail",
        "say": [
          "A vectorised loop processes the data in chunks of the vector width. If the length is not a multiple of the width, a few elements are left over at the end.",
          "Those leftovers are handled one at a time by ordinary scalar code, called the tail (or remainder loop).",
          "For a dot product of 19 elements with width 8: 2 SIMD steps handle 16 elements, and 3 scalar steps handle the tail.",
          "Practice 1 is simd_dot(a, b, width=8): compute the dot product chunk by chunk, then the tail, and report the numbers of SIMD and tail steps.",
          "The result must equal an ordinary dot product exactly (up to rounding); vectorisation changes speed, not meaning.",
          "Floating point addition is not perfectly associative, so summing in a different order can change the last digits. Real code accepts this, or uses careful summation where it matters.",
          "The example shows the chunk boundaries for a few lengths."
        ],
        "example": "Packing eggs into boxes of 8: most go into full boxes, and the few left over are carried by hand.",
        "code": "width = 8\nfor n in [8, 19, 32, 5]:\n    full = n // width * width\n    chunks = [(s, s + width) for s in range(0, full, width)]\n    print(f\"n={n:2}: SIMD chunks {chunks}, tail indices {list(range(full, n))}\")",
        "output": "n= 8: SIMD chunks [(0, 8)], tail indices []\nn=19: SIMD chunks [(0, 8), (8, 16)], tail indices [16, 17, 18]\nn=32: SIMD chunks [(0, 8), (8, 16), (16, 24), (24, 32)], tail indices []\nn= 5: SIMD chunks [], tail indices [0, 1, 2, 3, 4]",
        "codeNotes": [
          {
            "line": 3,
            "note": "The largest multiple of the width that fits."
          },
          {
            "line": 4,
            "note": "Each chunk is one SIMD instruction."
          }
        ],
        "tryIt": "With width 16, how many SIMD steps and tail steps does n = 100 need?",
        "check": {
          "question": "A 19-element dot product with width 8: how many scalar tail steps?",
          "options": [
            "0",
            "3",
            "8"
          ],
          "answer": 1,
          "why": "19 = 2 × 8 + 3."
        }
      },
      {
        "title": "Amdahl's law",
        "say": [
          "Vectorising part of a program speeds up only that part. The rest runs as before, which limits the overall gain.",
          "Amdahl's law: if a fraction p of the work gets a speedup of s (here, the vector width), the overall speedup is 1 / ((1 - p) + p / s).",
          "With p = 0.9 and width 8, the overall speedup is about 4.7, not 8, because the remaining 10 percent now dominates.",
          "Practice 2 is amdahl_speedup(width, parallel_fraction), rounded to 2 decimals.",
          "The law applies to any parallelism: more cores, GPUs, or distributed computing. It explains why profiling to find the serial bottleneck matters more than adding hardware.",
          "The example prints the speedup for different fractions and widths.",
          "Even infinite width cannot beat 1 / (1 - p): with p = 0.9, the ceiling is 10x."
        ],
        "example": "A dinner where the cooking is done by eight chefs but the washing up by one person: dinner still takes as long as the washing up.",
        "code": "def amdahl(width, p):\n    return round(1 / ((1 - p) + p / width), 2)\n\nfor p in [0.5, 0.9, 0.99]:\n    row = [amdahl(w, p) for w in (4, 8, 16, 1000)]\n    print(f\"p={p}: widths 4, 8, 16, 1000 -> {row}  (ceiling {round(1 / (1 - p), 1)})\")",
        "output": "p=0.5: widths 4, 8, 16, 1000 -> [1.6, 1.78, 1.88, 2.0]  (ceiling 2.0)\np=0.9: widths 4, 8, 16, 1000 -> [3.08, 4.71, 6.4, 9.91]  (ceiling 10.0)\np=0.99: widths 4, 8, 16, 1000 -> [3.88, 7.48, 13.91, 90.99]  (ceiling 100.0)",
        "codeNotes": [
          {
            "line": 2,
            "note": "The serial part (1 - p) is untouched; the parallel part is divided by the width."
          }
        ],
        "tryIt": "Which improves the overall speedup more for p = 0.9: doubling the width from 8 to 16, or raising p to 0.95?",
        "check": {
          "question": "What limits the overall speedup in Amdahl's law?",
          "options": [
            "The vector width only",
            "The part of the work that cannot be parallelised",
            "The CPU clock speed"
          ],
          "answer": 1,
          "why": "The serial fraction sets a ceiling on the total speedup."
        }
      },
      {
        "title": "What vectorises well in finance",
        "say": [
          "SIMD shines when the same simple operation runs over many independent numbers: pricing thousands of options, revaluing a portfolio under many scenarios, computing returns for many instruments.",
          "Branches (if statements) inside a loop hurt vectorisation, because lanes may want different paths. Vector code usually computes both results and blends them with a mask.",
          "Dependencies between iterations hurt too: a running sum where each step needs the previous result is harder to vectorise than independent calculations.",
          "Memory layout from yesterday matters: SIMD loads contiguous values, so a structure of arrays feeds vector units far better than an array of structures.",
          "Monte Carlo simulation, VaR scenarios (Day 18) and option pricing (Day 16) are classic vectorisation targets.",
          "The example contrasts a branchy loop with a branch-free version that computes both options and blends them, the way SIMD code works.",
          "Branch-free thinking is a useful skill even outside SIMD, since unpredictable branches also slow scalar code."
        ],
        "example": "Marking a class test where every paper gets exactly the same checks in the same order, instead of different checks for different students.",
        "code": "pnl = [120.0, -40.0, 15.0, -300.0, 80.0]\nbranchy = []\nfor x in pnl:\n    branchy.append(x if x > 0 else 0.0)\nmask = [1.0 if x > 0 else 0.0 for x in pnl]            # a vector compare produces a mask\nblended = [x * m + 0.0 for x, m in zip(pnl, mask)]      # multiply instead of branching (+ 0.0 turns -0.0 into 0.0)\nprint(\"branchy:\", branchy)\nprint(\"blended:\", blended)",
        "output": "branchy: [120.0, 0.0, 15.0, 0.0, 80.0]\nblended: [120.0, 0.0, 15.0, 0.0, 80.0]",
        "codeNotes": [
          {
            "line": 5,
            "note": "SIMD compares produce masks for all lanes at once."
          },
          {
            "line": 6,
            "note": "Blending with the mask replaces the if statement."
          }
        ],
        "tryIt": "Write a branch-free version of \"loss = -x if x < 0 else 0\".",
        "check": {
          "question": "Why do branches inside loops hurt vectorisation?",
          "options": [
            "They use more memory",
            "Different lanes may need different paths, breaking the single instruction model",
            "They are illegal in SIMD"
          ],
          "answer": 1,
          "why": "SIMD applies one instruction to all lanes, so divergent branches are a problem."
        }
      },
      {
        "title": "Measuring before optimising",
        "say": [
          "Optimisation without measurement is guesswork. Profile first to find where time actually goes.",
          "Use profilers (perf, VTune, or cProfile in Python) to find the hottest functions, then micro-benchmarks to test improvements in isolation.",
          "Check that the compiler actually vectorised the loop: compilers can report which loops they vectorised and why others were not.",
          "Measure on realistic data sizes and patterns. A loop over 16 numbers behaves very differently from one over 16 million, because of caches.",
          "Keep a correctness test next to every optimisation. The fastest wrong answer is worthless in finance.",
          "The example compares a plain Python loop with a built-in function over the same data, checking the results match and timing both loops; run it yourself to see the difference on your machine.",
          "In Python, the biggest wins usually come from moving loops into optimised built-ins or NumPy, not from micro-tuning Python code."
        ],
        "example": "A mechanic who plugs in a diagnostic computer before replacing parts, instead of guessing.",
        "code": "import time\n\na = [float(i % 97) for i in range(200_000)]\nb = [2.0] * len(a)\nt0 = time.perf_counter()\nslow = 0.0\nfor i in range(len(a)):\n    slow += a[i] * b[i]\nt1 = time.perf_counter()\nfast = sum(map(float.__mul__, a, b))\nt2 = time.perf_counter()\nprint(\"same result:\", slow == fast)\nprint(\"timed both versions:\", t1 > t0 and t2 > t1)",
        "output": "same result: True\ntimed both versions: True",
        "codeNotes": [
          {
            "line": 7,
            "note": "An index-based Python loop."
          },
          {
            "line": 10,
            "note": "map with a built-in method runs the loop in C."
          }
        ],
        "tryIt": "Print the two elapsed times yourself. Why do they change from run to run?",
        "check": {
          "question": "What should you do before optimising code?",
          "options": [
            "Rewrite it in assembly",
            "Measure where the time goes with a profiler",
            "Add more threads"
          ],
          "answer": 1,
          "why": "Profiling shows what is actually worth optimising."
        }
      },
      {
        "title": "Practice time: vectors and speedups",
        "say": [
          "Practice 1: simd_dot(a, b, width=8). Compute full = len(a) // width * width, sum the products chunk by chunk up to full, then add the tail from full to the end.",
          "Return the dot product rounded to 4 decimals and the step counts len(a) // width and len(a) % width.",
          "The checks use 19 elements (2 SIMD steps, 3 tail), 16 elements with width 16 (1 step, no tail), and 3 elements (all tail).",
          "Practice 2: amdahl_speedup(width, parallel_fraction). One formula, rounded to 2 decimals.",
          "The checks include full parallelism (the full width), 90 percent (4.71), 50 percent with width 16 (1.88) and no parallelism (1.0).",
          "After passing, use amdahl_speedup to decide whether vectorising a 70 percent hot loop with AVX-512 is worth a week of work.",
          "The example prints that decision table."
        ],
        "example": "Deciding whether to buy a faster oven when most of the time is spent chopping vegetables.",
        "code": "def amdahl(width, p):\n    return round(1 / ((1 - p) + p / width), 2)\n\nfor p in [0.3, 0.7, 0.95]:\n    print(f\"hot loop is {p:.0%} of the time: AVX2 x{amdahl(8, p)}, AVX-512 x{amdahl(16, p)}\")",
        "output": "hot loop is 30% of the time: AVX2 x1.36, AVX-512 x1.39\nhot loop is 70% of the time: AVX2 x2.58, AVX-512 x2.91\nhot loop is 95% of the time: AVX2 x5.93, AVX-512 x9.14",
        "codeNotes": [
          {
            "line": 5,
            "note": "Compare 8 and 16 lanes for the same fraction."
          }
        ],
        "tryIt": "At p = 0.3, is moving from AVX2 to AVX-512 worth it?",
        "check": {
          "question": "amdahl_speedup(8, 1.0) returns?",
          "options": [
            "1.0",
            "8.0",
            "4.71"
          ],
          "answer": 1,
          "why": "If all the work is vectorised, the speedup equals the width."
        }
      }
    ],
    "summary": [
      "SIMD applies one instruction to many values in wide registers (SSE, AVX2, AVX-512).",
      "Vectorised loops run in chunks of the width plus a scalar tail for leftovers.",
      "Amdahl's law: speedup = 1 / ((1 - p) + p / width); the serial part caps the gain.",
      "Vectorisation suits independent, branch-free, contiguous calculations like scenario pricing.",
      "Profile before optimising and keep a correctness test beside every speed-up."
    ],
    "projectStep": {
      "title": "Vectorisation plan",
      "steps": [
        "Implement simd_dot and compare it with a plain dot product on 1,000 elements.",
        "Estimate Amdahl speedups for your own program's hot loop at widths 4, 8 and 16.",
        "Rewrite one branchy loop in a branch-free, mask-based style."
      ]
    }
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Ultra-Low-Latency Order Messaging & Concurrency Engine",
    "goal": "You can design an ultra-low-latency market data pipeline from NIC to strategy, simulate a bounded feed gateway under bursts, measure drops and queue depth, and report tick-to-trade latency percentiles.",
    "minutes": 30,
    "recap": "Milestone 2 connects binary feeds (Day 10), kernel bypass and rings (Day 11), lock-free queues (Day 12), cache-aware layout (Day 13) and SIMD (Day 14) into one latency-critical pipeline.",
    "parts": [
      {
        "title": "The tick-to-trade pipeline",
        "say": [
          "Tick-to-trade is the time from a market data packet arriving at your NIC to your resulting order leaving it. It is the headline latency number in electronic trading.",
          "The pipeline: the NIC receives the packet; a feed handler decodes it and updates the book; the strategy reacts; an order is built, risk-checked and sent.",
          "Each stage runs on its own pinned core and passes messages to the next through a lock-free SPSC queue.",
          "Every microsecond is budgeted: for example 1 µs receive, 0.5 µs decode and book update, 1 µs strategy, 0.5 µs risk and encode, 1 µs send.",
          "Top firms achieve single-digit microseconds in software and well under a microsecond with FPGAs (Day 29).",
          "Budgets also make trade-offs visible: adding a new risk check that costs 300 nanoseconds must be paid for by saving time somewhere else, or the whole team agrees to a slower target.",
          "The example adds up a latency budget and shows which stage dominates.",
          "Budgets turn a vague goal (\"be fast\") into numbers each team can own."
        ],
        "example": "A relay race where each runner has a stopwatch target for their leg, so the team knows exactly where time is lost.",
        "code": "budget_ns = {\"NIC receive (bypass)\": 900, \"decode + book update\": 450, \"strategy decision\": 1100,\n             \"pre-trade risk\": 250, \"encode order\": 200, \"NIC send\": 800}\ntotal = sum(budget_ns.values())\nfor stage, ns in budget_ns.items():\n    print(f\"{stage:22} {ns:5} ns  {ns / total:4.0%}\")\nprint(f\"{'tick-to-trade':22} {total:5} ns\")",
        "output": "NIC receive (bypass)     900 ns   24%\ndecode + book update     450 ns   12%\nstrategy decision       1100 ns   30%\npre-trade risk           250 ns    7%\nencode order             200 ns    5%\nNIC send                 800 ns   22%\ntick-to-trade           3700 ns",
        "codeNotes": [
          {
            "line": 3,
            "note": "The sum of the stage budgets is the tick-to-trade target."
          }
        ],
        "tryIt": "If the strategy stage becomes 3,000 ns, which stage should the team optimise first?",
        "check": {
          "question": "What does tick-to-trade measure?",
          "options": [
            "Daily trading volume",
            "Time from a market data packet arriving to the resulting order leaving",
            "The exchange's latency"
          ],
          "answer": 1,
          "why": "It covers the whole reaction path inside your system."
        }
      },
      {
        "title": "Bursts and bounded queues",
        "say": [
          "Market data does not arrive evenly. News, open and close, and big trades produce bursts many times the average rate.",
          "Queues between stages absorb bursts, but they are bounded. If the consumer cannot keep up for long enough, the queue fills and packets are dropped.",
          "For a feed handler, a dropped packet means a wrong book until recovery, so capacity planning uses peak rates, not averages.",
          "Practice 1 is gateway(arrivals, capacity, per_tick): each tick, accept arrivals up to the free space (the rest are dropped), then process up to per_tick. Report processed, dropped and the maximum depth.",
          "The maximum depth tells you how close you came to dropping; it is a key capacity metric.",
          "The simulation is discrete (in ticks) to keep it simple, but the same reasoning applies to real time.",
          "The example runs the gateway with a steady load and with a burst."
        ],
        "example": "A reservoir behind a dam: it smooths out storms, but a long enough storm overflows it however big it is.",
        "code": "def gateway(arrivals, capacity, per_tick):\n    depth = processed = dropped = max_depth = 0\n    for n in arrivals:\n        accepted = min(n, capacity - depth)\n        dropped += n - accepted\n        depth += accepted\n        max_depth = max(max_depth, depth)\n        done = min(depth, per_tick)\n        processed += done\n        depth -= done\n    return {\"processed\": processed, \"dropped\": dropped, \"max_depth\": max_depth}\n\nprint(\"steady:\", gateway([4] * 10, 16, 5))\nprint(\"burst: \", gateway([4, 4, 30, 30, 4, 0, 0, 0], 16, 5))",
        "output": "steady: {'processed': 40, 'dropped': 0, 'max_depth': 4}\nburst:  {'processed': 33, 'dropped': 39, 'max_depth': 16}",
        "codeNotes": [
          {
            "line": 4,
            "note": "Only as many as fit are accepted."
          },
          {
            "line": 8,
            "note": "The consumer handles a fixed amount per tick."
          }
        ],
        "tryIt": "How large must the capacity be for the burst to cause no drops?",
        "check": {
          "question": "Why size feed queues for peak rates rather than averages?",
          "options": [
            "Averages are hard to compute",
            "Bursts far above the average would overflow a queue sized for the average",
            "Queues must be powers of ten"
          ],
          "answer": 1,
          "why": "Peaks, not averages, cause drops."
        }
      },
      {
        "title": "Latency percentiles",
        "say": [
          "For the milestone report, you measure tick-to-trade for every message and summarise the distribution.",
          "The nearest-rank method is simple and common: sort the samples; the p-th percentile is the value at position ceil(p / 100 × n) - 1.",
          "Practice 2 is latency_percentiles(samples): p50, p90, p99 and the maximum, raising ValueError for an empty list.",
          "p99 is often the number in service agreements; the maximum reveals rare stalls that averages completely hide.",
          "With spiky data, p50 and p90 can look perfect while p99 exposes the problem, exactly as the checks show.",
          "Percentiles from different samples cannot simply be averaged; combine the raw samples (or use histograms) instead.",
          "Always report the sample size too: a p99 from 100 samples rests on a single measurement, while a p99 from a million samples is solid evidence.",
          "The example computes percentiles for a clean and a spiky run."
        ],
        "example": "Race results: the median runner's time says how most people did; the slowest few times say whether anyone got lost on the course.",
        "code": "import math\n\ndef percentiles(samples):\n    s = sorted(samples)\n    rank = lambda p: s[math.ceil(p / 100 * len(s)) - 1]\n    return {\"p50\": rank(50), \"p90\": rank(90), \"p99\": rank(99), \"max\": s[-1]}\n\nprint(\"clean:\", percentiles(list(range(1, 101))))\nprint(\"spiky:\", percentiles([800] * 97 + [5000, 9000, 20000]))",
        "output": "clean: {'p50': 50, 'p90': 90, 'p99': 99, 'max': 100}\nspiky: {'p50': 800, 'p90': 800, 'p99': 9000, 'max': 20000}",
        "codeNotes": [
          {
            "line": 5,
            "note": "Nearest rank: the value at position ceil(p/100 × n) - 1 in sorted order."
          }
        ],
        "tryIt": "Add one sample of 100,000 ns to the spiky run. Which percentiles change?",
        "check": {
          "question": "Why can you not average the p99 of two separate runs to get the combined p99?",
          "options": [
            "Averages are always too high",
            "Percentiles depend on the whole distribution, so you must combine the raw samples",
            "p99 is not a number"
          ],
          "answer": 1,
          "why": "Combining distributions requires the underlying data."
        }
      },
      {
        "title": "Where latency hides",
        "say": [
          "When tick-to-trade is too high, the causes are usually in a handful of places.",
          "Memory allocation or garbage collection on the hot path, which is why low-latency code pre-allocates everything.",
          "Cache misses from poor data layout (Day 13), and branch mispredictions in unpredictable code.",
          "Logging and system calls on the critical thread; the fix is to hand log records to another thread through a queue.",
          "Queueing delay when a stage is sometimes slower than its input: a stage that takes 1 µs on average but 20 µs occasionally builds a queue behind it.",
          "The example shows how an occasional slow stage creates queueing delay for the messages behind it.",
          "Latency is often not about the slow message itself, but about everything waiting behind it."
        ],
        "example": "A single slow customer at a checkout: the problem is not just their wait, but the whole queue that builds up behind them.",
        "code": "service = [1, 1, 1, 20, 1, 1, 1, 1]          # microseconds per message; one slow one\narrivals = list(range(0, 16, 2))             # a message every 2 µs\nfree_at, waits = 0, []\nfor arrive, cost in zip(arrivals, service):\n    start = max(arrive, free_at)\n    waits.append(start - arrive)\n    free_at = start + cost\nprint(\"waiting time per message (µs):\", waits)",
        "output": "waiting time per message (µs): [0, 0, 0, 0, 18, 17, 16, 15]",
        "codeNotes": [
          {
            "line": 5,
            "note": "A message starts when it arrives or when the stage is free, whichever is later."
          }
        ],
        "tryIt": "How many messages after the slow one are delayed, and by how much in total?",
        "check": {
          "question": "Why does one slow message hurt the messages after it?",
          "options": [
            "It corrupts them",
            "They must wait in the queue until the stage is free",
            "They are dropped"
          ],
          "answer": 1,
          "why": "Queueing delay spreads one stall to many messages."
        }
      },
      {
        "title": "Observability without slowing down",
        "say": [
          "You cannot fix what you cannot see, but measuring must not add latency to the hot path.",
          "Timestamp at a few points using the cheapest clock available (such as the CPU timestamp counter), store the numbers in a pre-allocated ring, and let another thread compute statistics.",
          "Hardware timestamps from the NIC and network capture appliances give the most accurate end-to-end numbers, independent of your software.",
          "Monitor queue depths, drop counts and sequence gaps continuously, with alarms when they cross thresholds.",
          "Replay captured market data through the pipeline in testing to reproduce production latency and catch regressions before release.",
          "The example records stage timestamps for a few messages and computes per-stage latencies afterwards.",
          "The pattern, record cheaply now and analyse later, is the key to low-overhead observability."
        ],
        "example": "A race timing chip on each runner's shoe: the runners do nothing extra, and the analysis happens after the race.",
        "code": "records = [\n    {\"rx\": 0, \"decoded\": 420, \"decided\": 1500, \"sent\": 2300},\n    {\"rx\": 0, \"decoded\": 450, \"decided\": 1450, \"sent\": 2250},\n    {\"rx\": 0, \"decoded\": 430, \"decided\": 4900, \"sent\": 5700},\n]\nstages = [\"rx\", \"decoded\", \"decided\", \"sent\"]\nfor r in records:\n    parts = {f\"{a}->{b}\": r[b] - r[a] for a, b in zip(stages, stages[1:])}\n    print(parts, \"total\", r[\"sent\"] - r[\"rx\"], \"ns\")",
        "output": "{'rx->decoded': 420, 'decoded->decided': 1080, 'decided->sent': 800} total 2300 ns\n{'rx->decoded': 450, 'decoded->decided': 1000, 'decided->sent': 800} total 2250 ns\n{'rx->decoded': 430, 'decoded->decided': 4470, 'decided->sent': 800} total 5700 ns",
        "codeNotes": [
          {
            "line": 8,
            "note": "Per-stage latency is the difference between consecutive timestamps."
          }
        ],
        "tryIt": "Which stage caused the slow third message? What would you investigate first?",
        "check": {
          "question": "How should a latency-critical thread record measurements?",
          "options": [
            "Print them to the screen",
            "Write timestamps into a pre-allocated buffer and analyse them on another thread",
            "Send an email"
          ],
          "answer": 1,
          "why": "Cheap recording on the hot path, heavy analysis elsewhere."
        }
      },
      {
        "title": "Milestone practice: gateway and percentiles",
        "say": [
          "Practice 1: gateway(arrivals, capacity, per_tick). Keep depth, processed, dropped and max_depth. For each tick: accept min(arrivals, free space), count the rest as dropped, update max_depth, then process min(depth, per_tick).",
          "The checks run an easy load, a burst that overflows a capacity-12 queue (4 drops) and an empty input.",
          "Practice 2: latency_percentiles(samples). Sort, define a nearest-rank helper, return the four statistics, and raise ValueError on empty input.",
          "The checks use 1 to 100 (clean percentiles) and a spiky run where only p99 and the maximum reveal the problem.",
          "Congratulations on Milestone 2: you have modelled every stage of a low-latency trading pipeline and the tools to measure it.",
          "Keep these tools: the same gateway and percentile code can size queues and report latency for any real-time system, from payments to games.",
          "Next week turns to pricing and risk: options, volatility, value at risk and portfolios.",
          "The example runs the gateway on a burst and reports latency-style percentiles of the queue depth."
        ],
        "example": "A test flight for a new aircraft: every system has been checked separately, and now they fly together while engineers watch the gauges.",
        "code": "import math\n\narrivals = [3, 3, 12, 12, 3, 3, 0, 0, 3, 3]\ncapacity, per_tick, depth, depths, dropped = 16, 5, 0, [], 0\nfor n in arrivals:\n    take = min(n, capacity - depth); dropped += n - take; depth += take\n    depths.append(depth)\n    depth -= min(depth, per_tick)\ns = sorted(depths)\np = lambda q: s[math.ceil(q / 100 * len(s)) - 1]\nprint(\"depth p50\", p(50), \"p90\", p(90), \"max\", s[-1], \"| dropped\", dropped)",
        "output": "depth p50 3 p90 14 max 16 | dropped 3",
        "codeNotes": [
          {
            "line": 6,
            "note": "Accept what fits and count the rest as dropped."
          },
          {
            "line": 10,
            "note": "The same nearest-rank percentiles work for any metric."
          }
        ],
        "tryIt": "Raise per_tick to 7. What happens to the depth percentiles and drops?",
        "check": {
          "question": "latency_percentiles([]) should?",
          "options": [
            "Return zeros",
            "Raise ValueError",
            "Return None"
          ],
          "answer": 1,
          "why": "There is nothing to summarise, so it is an error."
        }
      }
    ],
    "summary": [
      "Tick-to-trade is the full internal reaction time; budget it stage by stage.",
      "Bounded queues absorb bursts; size them for peaks and watch maximum depth and drops.",
      "Report nearest-rank percentiles (p50, p90, p99, max); combine raw samples, not percentiles.",
      "Latency hides in allocation, cache misses, logging and queueing behind slow messages.",
      "Record timestamps cheaply on the hot path and analyse them elsewhere."
    ],
    "projectStep": {
      "title": "Milestone 2: latency lab",
      "steps": [
        "Write a stage budget for your own tick-to-trade pipeline.",
        "Simulate the gateway under three burst patterns and find the capacity with no drops.",
        "Compute latency percentiles for a sample with occasional stalls and explain the tail."
      ]
    }
  },
  {
    "day": 16,
    "title": "Option Pricing & Greeks: Black-Scholes-Merton (BSM) Analytical Engine",
    "goal": "You can explain what options are, price European calls and puts with the Black-Scholes-Merton formula, compute delta and gamma, and use put-call parity to spot mispricing.",
    "minutes": 30,
    "recap": "Milestone 2 made the trading pipeline fast. Now the week turns to what the pipeline trades and how much risk it carries, starting with the most famous formula in finance.",
    "parts": [
      {
        "title": "What an option is",
        "say": [
          "An option is a contract giving the right, but not the obligation, to buy or sell an asset at a fixed price (the strike) on or before a date (the expiry).",
          "A call is the right to buy; a put is the right to sell. European options can only be exercised at expiry, which makes them simplest to price.",
          "At expiry, a call is worth max(S - K, 0), where S is the stock price and K the strike: if the stock is above the strike, you buy cheaply and gain the difference; otherwise you walk away.",
          "A put is worth max(K - S, 0) at expiry. Options let traders bet on direction, protect portfolios (insurance), or trade volatility itself.",
          "The buyer pays a price up front, the premium. The whole question of option pricing is: what premium is fair today, before we know where the stock will end up?",
          "The example prints the expiry payoffs of a call and a put with strike 100 for several final stock prices.",
          "Notice the kink at the strike: that asymmetry is what gives options their value."
        ],
        "example": "A concert ticket you may choose to use: if the show turns out great you go; if not, you only lose what you paid for the ticket.",
        "code": "K = 100\nprint(\" S   call payoff   put payoff\")\nfor S in [70, 90, 100, 110, 130]:\n    print(f\"{S:3} {max(S - K, 0):10} {max(K - S, 0):12}\")",
        "output": " S   call payoff   put payoff\n 70          0           30\n 90          0           10\n100          0            0\n110         10            0\n130         30            0",
        "codeNotes": [
          {
            "line": 4,
            "note": "A call pays when S is above K; a put pays when S is below K."
          }
        ],
        "tryIt": "If the call cost 10 to buy, above which final price do you make a profit overall?",
        "check": {
          "question": "What is a call option worth at expiry if the stock is at 90 and the strike is 100?",
          "options": [
            "10",
            "0",
            "-10"
          ],
          "answer": 1,
          "why": "You would not use the right to buy at 100 when the stock costs 90, so it is worth 0."
        }
      },
      {
        "title": "The Black-Scholes-Merton idea",
        "say": [
          "In 1973 Fischer Black, Myron Scholes and Robert Merton showed that, under certain assumptions, an option can be perfectly replicated by continuously trading the stock and borrowing cash.",
          "If you can build the same payoff yourself, the option's fair price must equal the cost of building it. Otherwise there would be a risk-free profit (arbitrage).",
          "The key assumptions: the stock follows a random walk with constant volatility (a lognormal distribution), trading is continuous and costless, and the interest rate is constant.",
          "None of these is exactly true, but the model is the common language of options markets; traders adjust for its flaws through the volatility they plug in (tomorrow's topic).",
          "The inputs are the stock price S, strike K, time to expiry T in years, risk-free interest rate r, and volatility sigma (the annualised standard deviation of returns).",
          "The example shows how random the final stock price is under the model by simulating a few paths with a fixed seed.",
          "Remarkably, the expected return of the stock does not appear in the formula: replication makes it irrelevant."
        ],
        "example": "Pricing a fruit smoothie by adding up the cost of the fruit you would need to make it yourself.",
        "code": "import math\nimport random\n\nrandom.seed(7)\nS0, r, sigma, T = 100, 0.05, 0.2, 1.0\nfinals = []\nfor _ in range(5):\n    z = random.gauss(0, 1)\n    finals.append(round(S0 * math.exp((r - sigma ** 2 / 2) * T + sigma * math.sqrt(T) * z), 2))\nprint(\"possible prices in one year:\", finals)",
        "output": "possible prices in one year: [97.9, 114.14, 98.49, 96.75, 85.56]",
        "codeNotes": [
          {
            "line": 9,
            "note": "The lognormal model: the log of the price moves by a normal random amount."
          }
        ],
        "tryIt": "Change sigma to 0.4. How much more spread out are the possible prices?",
        "check": {
          "question": "Why does Black-Scholes give a unique price?",
          "options": [
            "It predicts the future stock price",
            "The option can be replicated by trading the stock and cash, so its price must equal that cost",
            "Exchanges set it"
          ],
          "answer": 1,
          "why": "Replication plus no arbitrage pins the price down."
        }
      },
      {
        "title": "The formula",
        "say": [
          "Black-Scholes prices a European call as C = S × N(d1) - K × e^(-rT) × N(d2), and a put as P = K × e^(-rT) × N(-d2) - S × N(-d1).",
          "N is the standard normal cumulative distribution function: the probability that a standard normal variable is below a value. Python computes it with math.erf: N(x) = 0.5 × (1 + erf(x / √2)).",
          "d1 = (ln(S / K) + (r + sigma² / 2) × T) / (sigma × √T), and d2 = d1 - sigma × √T.",
          "K × e^(-rT) is the strike discounted to today: money paid in the future is worth less now.",
          "Practice 1 is black_scholes(S, K, T, r, sigma), returning the call, put, delta and gamma rounded to 4 decimals. For S = K = 100, one year, 5 percent rate and 20 percent volatility, the call is 10.4506 and the put 5.5735.",
          "The example implements the formula and prices that benchmark option.",
          "Check your implementation against this benchmark; it appears in textbooks everywhere."
        ],
        "example": "A recipe with precise quantities: follow it exactly and everyone gets the same cake.",
        "code": "import math\n\nN = lambda x: 0.5 * (1 + math.erf(x / math.sqrt(2)))\nS, K, T, r, sigma = 100, 100, 1.0, 0.05, 0.2\nd1 = (math.log(S / K) + (r + sigma ** 2 / 2) * T) / (sigma * math.sqrt(T))\nd2 = d1 - sigma * math.sqrt(T)\ncall = S * N(d1) - K * math.exp(-r * T) * N(d2)\nput = K * math.exp(-r * T) * N(-d2) - S * N(-d1)\nprint(\"d1\", round(d1, 4), \"d2\", round(d2, 4))\nprint(\"call\", round(call, 4), \"put\", round(put, 4))",
        "output": "d1 0.35 d2 0.15\ncall 10.4506 put 5.5735",
        "codeNotes": [
          {
            "line": 3,
            "note": "The normal CDF from the error function."
          },
          {
            "line": 7,
            "note": "Stock leg minus discounted strike leg."
          }
        ],
        "tryIt": "Price the call with sigma 0.3. Does higher volatility make the option more or less valuable? Why?",
        "check": {
          "question": "What does N(x) represent in the Black-Scholes formula?",
          "options": [
            "The number of shares",
            "The standard normal cumulative probability",
            "The interest rate"
          ],
          "answer": 1,
          "why": "N is the normal cumulative distribution function."
        }
      },
      {
        "title": "The Greeks: delta and gamma",
        "say": [
          "The Greeks measure how an option's price changes when an input changes. Traders use them to understand and hedge risk.",
          "Delta is the change in option price for a 1 unit move in the stock. For a Black-Scholes call, delta = N(d1): between 0 and 1.",
          "A delta of 0.64 means the call behaves like 0.64 shares for small moves; to hedge, a trader who is long the call sells 0.64 shares (Day 21).",
          "Gamma is how fast delta itself changes: gamma = n(d1) / (S × sigma × √T), where n is the normal density. High gamma means the hedge must be adjusted often.",
          "Gamma is largest for at-the-money options near expiry, which is why they are the hardest to hedge.",
          "The example checks delta numerically by repricing the call with the stock 1 cent higher and lower.",
          "Checking analytic formulas against small numerical bumps is a standard way to catch bugs in pricing code."
        ],
        "example": "Delta is your car's speed; gamma is how hard you are pressing the accelerator.",
        "code": "import math\n\nN = lambda x: 0.5 * (1 + math.erf(x / math.sqrt(2)))\ndef call(S, K=100, T=1.0, r=0.05, sigma=0.2):\n    d1 = (math.log(S / K) + (r + sigma ** 2 / 2) * T) / (sigma * math.sqrt(T))\n    return S * N(d1) - K * math.exp(-r * T) * N(d1 - sigma * math.sqrt(T))\n\nd1 = (math.log(1) + 0.07) / 0.2\nbump = 0.01\nnumeric_delta = (call(100 + bump) - call(100 - bump)) / (2 * bump)\nprint(\"analytic delta N(d1):\", round(N(d1), 4))\nprint(\"numeric delta       :\", round(numeric_delta, 4))",
        "output": "analytic delta N(d1): 0.6368\nnumeric delta       : 0.6368",
        "codeNotes": [
          {
            "line": 10,
            "note": "A central difference approximates the derivative."
          }
        ],
        "tryIt": "Compute a numeric gamma the same way, from deltas at 100.01 and 99.99. Does it match 0.0188?",
        "check": {
          "question": "A call has delta 0.64. How many shares hedge one long call?",
          "options": [
            "Buy 0.64 shares",
            "Sell 0.64 shares",
            "Sell 1 share"
          ],
          "answer": 1,
          "why": "Selling delta shares offsets the call's exposure to small moves."
        }
      },
      {
        "title": "Put-call parity",
        "say": [
          "Calls and puts with the same strike and expiry are linked by a simple no-arbitrage rule: C - P = S - K × e^(-rT).",
          "Why: owning a call and selling a put gives exactly the same payoff at expiry as owning the stock and owning a debt of K. Identical payoffs must have identical prices.",
          "Parity holds regardless of the model; it does not need Black-Scholes assumptions.",
          "If market prices break parity by more than trading costs, a trader can buy the cheap side and sell the expensive side for a locked-in profit.",
          "Practice 2 is parity_gap(C, P, S, K, r, T, tolerance=0.05): compute the gap and label it OK or ARBITRAGE.",
          "The Black-Scholes prices from Practice 1 satisfy parity exactly, which makes a great consistency test for your pricer.",
          "The example checks parity for the benchmark prices and for a call that is 0.55 too expensive."
        ],
        "example": "Two routes to the same destination must cost the same, or everyone would take the cheaper one until prices adjust.",
        "code": "import math\n\ndef gap(C, P, S, K, r, T):\n    return round((C - P) - (S - K * math.exp(-r * T)), 4)\n\nprint(\"benchmark prices:\", gap(10.4506, 5.5735, 100, 100, 0.05, 1.0))\nprint(\"expensive call:  \", gap(11.0, 5.5735, 100, 100, 0.05, 1.0))",
        "output": "benchmark prices: 0.0\nexpensive call:   0.5494",
        "codeNotes": [
          {
            "line": 4,
            "note": "Left side minus right side of parity."
          }
        ],
        "tryIt": "For the expensive call, which options would you buy and sell, and what else would you trade to lock in the gap?",
        "check": {
          "question": "Does put-call parity depend on the Black-Scholes assumptions?",
          "options": [
            "Yes",
            "No, it follows from matching payoffs alone",
            "Only for puts"
          ],
          "answer": 1,
          "why": "It is a pure no-arbitrage relationship."
        }
      },
      {
        "title": "Practice time: price and check",
        "say": [
          "Practice 1: black_scholes(S, K, T, r, sigma). Define N with math.erf and n (the density) with math.exp. Compute d1, d2 and the discounted strike, then call, put, delta = N(d1) and gamma = n(d1) / (S × sigma × √T).",
          "Round each output to 4 decimals. The checks use the benchmark, a deep in-the-money call (delta above 0.85) and a lower volatility case (cheaper).",
          "Practice 2: parity_gap(C, P, S, K, r, T, tolerance=0.05). Round the gap to 4 decimals and compare its absolute value with the tolerance.",
          "The checks confirm the benchmark prices pass, a mispriced call is flagged with a gap of 0.5494, and zero rates make an at-the-money call and put equal.",
          "After passing, draw the call price against the stock price for three expiries to see the curve flatten into the payoff as expiry approaches.",
          "The example prints that table.",
          "Pricing code is used by risk systems millions of times per day; correctness and speed (Day 14) both matter."
        ],
        "example": "A new thermometer is checked against a reference one before it is trusted in a laboratory.",
        "code": "import math\n\nN = lambda x: 0.5 * (1 + math.erf(x / math.sqrt(2)))\ndef call(S, T, K=100, r=0.05, sigma=0.2):\n    d1 = (math.log(S / K) + (r + sigma ** 2 / 2) * T) / (sigma * math.sqrt(T))\n    return S * N(d1) - K * math.exp(-r * T) * N(d1 - sigma * math.sqrt(T))\n\nprint(\"  S    T=1.0   T=0.25   T=0.01\")\nfor S in [80, 90, 100, 110, 120]:\n    print(f\"{S:3} {call(S, 1.0):8.2f} {call(S, 0.25):8.2f} {call(S, 0.01):8.2f}\")",
        "output": "  S    T=1.0   T=0.25   T=0.01\n 80     1.86     0.06     0.00\n 90     5.09     0.90     0.00\n100    10.45     4.61     0.82\n110    17.66    11.99    10.05\n120    26.17    21.35    20.05",
        "codeNotes": [
          {
            "line": 10,
            "note": "As T shrinks, prices approach max(S - K, 0) plus a little interest."
          }
        ],
        "tryIt": "Why is the T = 0.01 price at S = 100 still above zero?",
        "check": {
          "question": "Which input makes an option more valuable when it rises, for both calls and puts?",
          "options": [
            "The strike",
            "Volatility",
            "Nothing"
          ],
          "answer": 1,
          "why": "More volatility means a bigger chance of a large favourable move, while losses are capped."
        }
      }
    ],
    "summary": [
      "Calls pay max(S - K, 0) at expiry; puts pay max(K - S, 0).",
      "Black-Scholes prices options by replication and no arbitrage.",
      "C = S N(d1) - K e^(-rT) N(d2); N is the normal CDF computed with math.erf.",
      "Delta = N(d1) is the hedge ratio; gamma measures how quickly delta changes.",
      "Put-call parity C - P = S - K e^(-rT) holds without any model."
    ],
    "projectStep": {
      "title": "Options pricer",
      "steps": [
        "Implement black_scholes and verify the 10.4506 benchmark and put-call parity.",
        "Check delta and gamma against numerical bumps.",
        "Tabulate call prices across stock prices and expiries."
      ]
    }
  },
  {
    "day": 17,
    "title": "Implied Volatility Surface: Newton-Raphson Solver",
    "goal": "You can explain implied volatility, solve for it with Newton-Raphson using vega, handle cases with no solution, and describe the volatility smile and surface.",
    "minutes": 30,
    "recap": "Yesterday volatility was an input to Black-Scholes. In real markets the option price is known and volatility is not. Today you run the formula backwards.",
    "parts": [
      {
        "title": "Implied volatility",
        "say": [
          "Every input to Black-Scholes is observable except volatility: the stock price, strike, expiry and interest rate are all known today, but future volatility is not.",
          "Markets therefore quote options by price, and traders ask: which volatility, plugged into Black-Scholes, reproduces that price? The answer is the implied volatility.",
          "Implied volatility is the market's consensus forecast of future volatility, plus a premium for risk. Traders talk in \"vol\" rather than price because it makes different options comparable.",
          "An option priced at 15 on our benchmark stock implies about 32 percent volatility, well above the 20 percent that gives 10.45.",
          "There is no formula to solve Black-Scholes for sigma, so it must be found numerically.",
          "The example shows how the call price rises with volatility, which is what makes the backwards solve possible: one price, one volatility.",
          "Because the price increases steadily with volatility, there is at most one answer for any price."
        ],
        "example": "Working out how fast a car was travelling from how far it went in a known time, by trying speeds until the distance matches.",
        "code": "import math\n\nN = lambda x: 0.5 * (1 + math.erf(x / math.sqrt(2)))\ndef call(sigma, S=100, K=100, T=1.0, r=0.05):\n    d1 = (math.log(S / K) + (r + sigma ** 2 / 2) * T) / (sigma * math.sqrt(T))\n    return S * N(d1) - K * math.exp(-r * T) * N(d1 - sigma * math.sqrt(T))\n\nfor sigma in [0.1, 0.2, 0.3, 0.4, 0.5]:\n    print(f\"vol {sigma:.0%}: call price {call(sigma):6.2f}\")",
        "output": "vol 10%: call price   6.80\nvol 20%: call price  10.45\nvol 30%: call price  14.23\nvol 40%: call price  18.02\nvol 50%: call price  21.79",
        "codeNotes": [
          {
            "line": 9,
            "note": "The price rises steadily with volatility."
          }
        ],
        "tryIt": "Between which two volatilities does a price of 15 fall?",
        "check": {
          "question": "What is implied volatility?",
          "options": [
            "Last year's realised volatility",
            "The volatility that makes Black-Scholes match the market price",
            "The interest rate"
          ],
          "answer": 1,
          "why": "It is backed out from the observed price."
        }
      },
      {
        "title": "Vega",
        "say": [
          "Vega is the Greek measuring how much the option price changes when volatility changes. For Black-Scholes, vega = S × n(d1) × √T, where n is the normal density.",
          "It is usually quoted per 1 percentage point of volatility, which is vega / 100. For the benchmark option, vega is 37.52, or 0.3752 per vol point.",
          "So if implied volatility rises from 20 to 21 percent, the call gains about 37.5 cents.",
          "Vega is largest for at-the-money options and grows with time to expiry: longer-dated options are more exposed to volatility.",
          "Practice 2 is bs_vega(S, K, T, r, sigma), returning the raw vega and the per-point value.",
          "Vega is also the slope of the price curve in the previous example, which is exactly what Newton-Raphson needs.",
          "The example compares vega across expiries."
        ],
        "example": "A sensitivity dial: turn volatility up one notch and vega tells you how far the price moves.",
        "code": "import math\n\ndef vega(S, K, T, r, sigma):\n    d1 = (math.log(S / K) + (r + sigma ** 2 / 2) * T) / (sigma * math.sqrt(T))\n    return S * math.exp(-d1 * d1 / 2) / math.sqrt(2 * math.pi) * math.sqrt(T)\n\nfor T in [0.1, 0.5, 1.0, 2.0]:\n    v = vega(100, 100, T, 0.05, 0.2)\n    print(f\"T={T:3}: vega {v:6.2f}  per vol point {v / 100:.4f}\")",
        "output": "T=0.1: vega  12.54  per vol point 0.1254\nT=0.5: vega  27.36  per vol point 0.2736\nT=1.0: vega  37.52  per vol point 0.3752\nT=2.0: vega  49.91  per vol point 0.4991",
        "codeNotes": [
          {
            "line": 5,
            "note": "S times the normal density at d1 times the square root of time."
          }
        ],
        "tryIt": "Compute vega for S = 150 with K = 100. Why is it much smaller?",
        "check": {
          "question": "The benchmark vega per vol point is 0.3752. What happens to the price if vol rises 2 points?",
          "options": [
            "It falls by 0.75",
            "It rises by about 0.75",
            "Nothing"
          ],
          "answer": 1,
          "why": "2 × 0.3752 ≈ 0.75."
        }
      },
      {
        "title": "Newton-Raphson",
        "say": [
          "Newton-Raphson is a fast method for solving f(x) = 0. Start from a guess, then repeatedly move to x - f(x) / f'(x), using the slope to jump towards the root.",
          "For implied volatility, f(sigma) = BlackScholes(sigma) - market price, and the slope f'(sigma) is vega.",
          "Near the answer, Newton-Raphson roughly doubles the number of correct digits each step, so it usually converges in 3 to 5 iterations.",
          "Stop when the price error is below a tolerance (such as 0.000001), and give up after a maximum number of iterations.",
          "Practice 1 is implied_vol(price, S, K, T, r, guess=0.2): Newton-Raphson returning the volatility rounded to 4 decimals, or None when there is no solution.",
          "The example prints each iteration for a price of 15, showing how quickly the error vanishes.",
          "Speed matters: a market maker may recompute thousands of implied volatilities every time the stock ticks."
        ],
        "example": "Finding the bottom of a valley in fog: feel the slope under your feet and take a step downhill sized by how steep it is.",
        "code": "import math\n\nN = lambda x: 0.5 * (1 + math.erf(x / math.sqrt(2)))\nS, K, T, r, price = 100, 100, 1.0, 0.05, 15.0\nsigma = 0.2\nfor step in range(1, 6):\n    d1 = (math.log(S / K) + (r + sigma ** 2 / 2) * T) / (sigma * math.sqrt(T))\n    model = S * N(d1) - K * math.exp(-r * T) * N(d1 - sigma * math.sqrt(T))\n    vega = S * math.exp(-d1 * d1 / 2) / math.sqrt(2 * math.pi) * math.sqrt(T)\n    error = round(model - price, 6) + 0.0      # + 0.0 tidies -0.0 into 0.0\n    print(f\"step {step}: sigma {sigma:.6f}  error {error:+.6f}\")\n    if error == 0:\n        break\n    sigma -= (model - price) / vega",
        "output": "step 1: sigma 0.200000  error -4.549416\nstep 2: sigma 0.321240  error +0.037256\nstep 3: sigma 0.320258  error +0.000000",
        "codeNotes": [
          {
            "line": 12,
            "note": "Stop once the price matches to 6 decimals."
          },
          {
            "line": 14,
            "note": "Newton step: move by the error divided by the slope (vega)."
          }
        ],
        "tryIt": "Start from a guess of 0.9. How many steps does it take now?",
        "check": {
          "question": "In the implied volatility solver, what plays the role of the derivative?",
          "options": [
            "Delta",
            "Vega",
            "Gamma"
          ],
          "answer": 1,
          "why": "Vega is the derivative of price with respect to volatility."
        }
      },
      {
        "title": "When there is no answer",
        "say": [
          "Not every price has an implied volatility. A call can never be worth more than the stock itself, nor less than its discounted intrinsic value S - K e^(-rT).",
          "A price outside those bounds, often a stale or bad quote, has no solution, and the solver must say so rather than return nonsense.",
          "Newton-Raphson can also misbehave: with deep out-of-the-money options, vega is tiny, so the step size explodes and sigma can go negative.",
          "Robust solvers check the bounds first, guard against tiny vega and negative sigma, cap the number of iterations, and fall back to bisection when Newton fails.",
          "Your implied_vol must return None when sigma goes negative, when vega is almost zero, or when it runs out of iterations. A price of 200 for a stock at 100 is the test case.",
          "The example checks the no-arbitrage bounds before attempting a solve.",
          "In production, a silent wrong implied volatility can misprice a whole book, so explicit failures are essential."
        ],
        "example": "A satnav asked for a route to an address that does not exist should say \"not found\", not invent one.",
        "code": "import math\n\ndef call_bounds(S, K, T, r):\n    return round(max(0.0, S - K * math.exp(-r * T)), 4), S\n\nlow, high = call_bounds(100, 100, 1.0, 0.05)\nfor price in [3.0, 10.45, 15.0, 200.0]:\n    ok = low < price < high\n    print(f\"price {price:6}: {'solvable' if ok else 'no implied vol'} (bounds {low} to {high})\")",
        "output": "price    3.0: no implied vol (bounds 4.8771 to 100)\nprice  10.45: solvable (bounds 4.8771 to 100)\nprice   15.0: solvable (bounds 4.8771 to 100)\nprice  200.0: no implied vol (bounds 4.8771 to 100)",
        "codeNotes": [
          {
            "line": 4,
            "note": "A call is worth at least the discounted intrinsic value and at most the stock."
          }
        ],
        "tryIt": "What are the bounds for a put?",
        "check": {
          "question": "What should an implied volatility solver return for a call priced above the stock price?",
          "options": [
            "A very high volatility",
            "None, because no volatility can produce that price",
            "Zero"
          ],
          "answer": 1,
          "why": "Prices outside the no-arbitrage bounds have no implied volatility."
        }
      },
      {
        "title": "The smile and the surface",
        "say": [
          "If Black-Scholes were perfectly true, every option on the same stock would have the same implied volatility. In practice they do not.",
          "Plotting implied volatility against strike usually shows a smile or a skew: out-of-the-money puts have higher implied volatility, because crashes are more likely than the lognormal model assumes.",
          "Implied volatility also varies with expiry, giving the term structure. Together, strike and expiry form the volatility surface.",
          "Market makers maintain a smooth, arbitrage-free surface fitted to market quotes, and use it to price every option consistently, including ones that rarely trade.",
          "The surface moves constantly; a large part of options trading is predicting and trading its changes.",
          "The example prints a toy skew: implied volatility falling as the strike rises.",
          "Understanding the surface is the step from \"knowing the formula\" to \"trading options\"."
        ],
        "example": "A weather map showing temperature across both place and time, rather than a single number for the whole country.",
        "code": "strikes = [80, 90, 100, 110, 120]\natm_vol, skew = 0.20, -0.004\nfor K in strikes:\n    vol = atm_vol + skew * (K - 100) + 0.0001 * (K - 100) ** 2\n    print(f\"strike {K}: implied vol {vol:.2%}\")",
        "output": "strike 80: implied vol 32.00%\nstrike 90: implied vol 25.00%\nstrike 100: implied vol 20.00%\nstrike 110: implied vol 17.00%\nstrike 120: implied vol 16.00%",
        "codeNotes": [
          {
            "line": 4,
            "note": "A linear skew plus a little curvature makes a typical equity smile."
          }
        ],
        "tryIt": "Why might out-of-the-money puts be more expensive than the lognormal model suggests?",
        "check": {
          "question": "What is the volatility surface?",
          "options": [
            "A chart of stock prices",
            "Implied volatility across strikes and expiries",
            "The trading floor"
          ],
          "answer": 1,
          "why": "It maps implied volatility by strike and time to expiry."
        }
      },
      {
        "title": "Practice time: solve for volatility",
        "say": [
          "Practice 1: implied_vol(price, S, K, T, r, guess=0.2, tol=1e-6, max_iter=50). Inside the loop: return None if sigma <= 0; compute the model price and diff; return the rounded sigma if |diff| < tol; compute vega and return None if it is below 1e-8; otherwise step sigma -= diff / vega.",
          "Return None after max_iter iterations without converging.",
          "The checks recover 0.2 from the benchmark price, from a poor guess of 0.6, solve a price of 15 to 0.3203, and return None for a price of 200.",
          "Practice 2: bs_vega(S, K, T, r, sigma) returns (vega, vega / 100), each rounded to 4 decimals: (37.524, 0.3752) for the benchmark.",
          "After passing, compute implied volatilities for three market prices at different strikes and plot a mini smile.",
          "The example solves a few prices with a compact version of the solver.",
          "You now have a pricer and its inverse: the core of every options analytics library."
        ],
        "example": "A locksmith who can both make a key for a lock and work out a lock from a key.",
        "code": "import math\n\nN = lambda x: 0.5 * (1 + math.erf(x / math.sqrt(2)))\ndef solve(price, S=100, K=100, T=1.0, r=0.05, sigma=0.2):\n    for _ in range(50):\n        d1 = (math.log(S / K) + (r + sigma ** 2 / 2) * T) / (sigma * math.sqrt(T))\n        diff = S * N(d1) - K * math.exp(-r * T) * N(d1 - sigma * math.sqrt(T)) - price\n        if abs(diff) < 1e-6:\n            return round(sigma, 4)\n        sigma -= diff / (S * math.exp(-d1 * d1 / 2) / math.sqrt(2 * math.pi) * math.sqrt(T))\n        if sigma <= 0:\n            return None\n    return None\n\nfor price in [8.0, 10.4506, 15.0, 25.0]:\n    print(price, \"->\", solve(price))",
        "output": "8.0 -> 0.1338\n10.4506 -> 0.2\n15.0 -> 0.3203\n25.0 -> 0.5859",
        "codeNotes": [
          {
            "line": 10,
            "note": "The Newton step using vega."
          },
          {
            "line": 11,
            "note": "Guard against impossible volatilities."
          }
        ],
        "tryIt": "Try a price of 5.0. Is it inside the no-arbitrage bounds?",
        "check": {
          "question": "implied_vol(10.4506, 100, 100, 1.0, 0.05) should return?",
          "options": [
            "0.1",
            "0.2",
            "None"
          ],
          "answer": 1,
          "why": "That price was produced with 20 percent volatility."
        }
      }
    ],
    "summary": [
      "Implied volatility is the sigma that makes Black-Scholes match the market price.",
      "Vega = S n(d1) √T measures sensitivity to volatility; divide by 100 per vol point.",
      "Newton-Raphson: sigma -= (model - price) / vega, converging in a few steps.",
      "Return None for impossible prices, tiny vega or negative sigma.",
      "Implied volatility varies by strike and expiry, forming the smile and surface."
    ],
    "projectStep": {
      "title": "Implied volatility engine",
      "steps": [
        "Implement implied_vol and bs_vega and test them on the benchmark.",
        "Check no-arbitrage bounds before solving and handle failures explicitly.",
        "Solve implied volatilities for five strikes and describe the smile you see."
      ]
    }
  },
  {
    "day": 18,
    "title": "Risk Management: Parametric & Historical Value at Risk (VaR)",
    "goal": "You can explain Value at Risk, compute it parametrically and historically, scale it across horizons with the square-root-of-time rule, and describe its limitations.",
    "minutes": 30,
    "recap": "Pricing tells you what positions are worth. Risk management asks how much they could lose. Today you learn the industry's standard answer: Value at Risk.",
    "parts": [
      {
        "title": "What Value at Risk means",
        "say": [
          "Value at Risk (VaR) answers: \"What is the loss we will not exceed on, say, 95 percent of days?\"",
          "A one-day 95 percent VaR of $1 million means that on 19 days out of 20 the loss should be smaller than $1 million, and on 1 day in 20 it should be larger.",
          "VaR has three parts: a time horizon (one day, ten days), a confidence level (95 or 99 percent) and an amount.",
          "Banks and trading firms use VaR for limits, capital requirements and reporting. Regulators have required it for decades.",
          "VaR is a threshold, not a worst case. It says nothing about how bad the losses beyond it can be; that is tomorrow's topic, Expected Shortfall.",
          "The example counts how often a series of daily profits and losses breaches a stated VaR.",
          "Counting breaches, called backtesting VaR, is how firms check that their risk model is honest.",
          "Too many breaches means the model underestimates risk; too few means it is overly cautious and ties up capital that could be used elsewhere."
        ],
        "example": "A weather forecast saying \"95 percent chance of less than 20 mm of rain\": useful, but silent about how bad the other 5 percent could be.",
        "code": "pnl = [-12, 5, 8, -3, -25, 14, 2, -9, 6, -31, 11, 4, -2, 7, -15, 9, 1, -6, 3, 10]\nvar_95 = 24\nbreaches = [x for x in pnl if -x > var_95]\nprint(\"days:\", len(pnl), \"| breaches:\", len(breaches), breaches)\nprint(\"expected breaches at 95%:\", len(pnl) * 0.05)",
        "output": "days: 20 | breaches: 2 [-25, -31]\nexpected breaches at 95%: 1.0",
        "codeNotes": [
          {
            "line": 3,
            "note": "A breach is a loss larger than the VaR."
          }
        ],
        "tryIt": "If a model breaches 5 times in 20 days at 95 percent, what does that suggest?",
        "check": {
          "question": "What does a one-day 95 percent VaR of $1m mean?",
          "options": [
            "The maximum possible loss is $1m",
            "On 95 percent of days the loss should not exceed $1m",
            "The average loss is $1m"
          ],
          "answer": 1,
          "why": "VaR is a percentile threshold, not a maximum."
        }
      },
      {
        "title": "Parametric VaR",
        "say": [
          "The parametric (variance-covariance) method assumes returns are normally distributed with a known mean and volatility.",
          "For a normal distribution, the 5 percent tail begins 1.645 standard deviations below the mean, and the 1 percent tail at 2.326.",
          "So VaR as a fraction of the portfolio = z × volatility - mean, and in money = portfolio value × that fraction.",
          "For $1 million with 2 percent daily volatility and zero mean, the 95 percent VaR is 1.645 × 0.02 = 3.29 percent, or $32,900.",
          "Practice 1 is parametric_var(value, mean, vol, confidence), supporting 95 and 99 percent and raising ValueError for anything else.",
          "It is fast and simple, but the normal assumption underestimates extreme moves: real returns have fat tails.",
          "The example computes both confidence levels for the same portfolio."
        ],
        "example": "Estimating the tallest person in a crowd from the average height and spread, assuming heights follow a bell curve.",
        "code": "Z = {0.95: 1.645, 0.99: 2.326}\nvalue, mean, vol = 1_000_000, 0.0, 0.02\nfor conf, z in Z.items():\n    pct = z * vol - mean\n    print(f\"{conf:.0%} one-day VaR: {pct:.4%} = ${value * pct:,.0f}\")",
        "output": "95% one-day VaR: 3.2900% = $32,900\n99% one-day VaR: 4.6520% = $46,520",
        "codeNotes": [
          {
            "line": 4,
            "note": "z standard deviations minus the expected return."
          }
        ],
        "tryIt": "How does a positive daily mean return of 0.05 percent change the VaR?",
        "check": {
          "question": "Which z value corresponds to 99 percent confidence?",
          "options": [
            "1.645",
            "2.326",
            "3.0"
          ],
          "answer": 1,
          "why": "The 1 percent normal tail starts at 2.326 standard deviations."
        }
      },
      {
        "title": "Historical VaR",
        "say": [
          "Historical simulation drops the normal assumption: take actual past returns, apply them to today's portfolio, and read off the loss percentile.",
          "Sort the returns from worst to best. The 95 percent VaR is the loss at the 5 percent position. With 20 days of data that is the single worst day; with 500 days, the 25th worst.",
          "The index used here is floor((1 - confidence) × n), counting from 0 in the sorted list, the same convention as the practice.",
          "Historical VaR captures fat tails and skew that really happened, but only those: if the window missed a crisis, VaR will be too low.",
          "Practice 2 includes historical_var(returns, value, confidence) and scale_var(one_day, days).",
          "Firms often use 250 to 500 days of history, sometimes weighting recent days more heavily.",
          "The example sorts a short return history and picks out the cut-off at two confidence levels."
        ],
        "example": "Planning a picnic by looking at what the weather actually did on the last 500 days, rather than trusting a formula.",
        "code": "import math\n\nrets = [0.01, -0.02, 0.005, -0.035, 0.012, -0.01, 0.0, 0.02, -0.05, 0.015] * 2\ns = sorted(rets)\nprint(\"worst five days:\", s[:5])\nfor conf in [0.95, 0.9]:\n    idx = int(math.floor((1 - conf) * len(s) + 1e-9))\n    print(f\"{conf:.0%}: index {idx}, return {s[idx]}, VaR on $1m = ${1_000_000 * -s[idx]:,.0f}\")",
        "output": "worst five days: [-0.05, -0.05, -0.035, -0.035, -0.02]\n95%: index 1, return -0.05, VaR on $1m = $50,000\n90%: index 2, return -0.035, VaR on $1m = $35,000",
        "codeNotes": [
          {
            "line": 7,
            "note": "The tiny 1e-9 protects against floating point turning 1.0 into 0.9999."
          }
        ],
        "tryIt": "Why does (1 - 0.9) × 20 need that protection? Print it without rounding.",
        "check": {
          "question": "What is the main weakness of historical VaR?",
          "options": [
            "It is too slow",
            "It only knows about events inside its data window",
            "It assumes normal returns"
          ],
          "answer": 1,
          "why": "A calm window produces a VaR that ignores possible crises."
        }
      },
      {
        "title": "Scaling to longer horizons",
        "say": [
          "Regulators often ask for 10-day VaR, but daily data is what firms have. The common shortcut is the square-root-of-time rule: VaR over h days = one-day VaR × √h.",
          "It follows from the fact that variances of independent returns add up: 10 days of independent returns have 10 times the variance, so √10 times the standard deviation.",
          "A one-day VaR of $10,000 scales to $31,623 over 10 days.",
          "The rule breaks down when returns are correlated from day to day (trends or mean reversion) or when positions change, and it ignores fat tails.",
          "It is still widely used because it is simple and transparent; just remember it is an approximation.",
          "The example scales a one-day VaR to several horizons.",
          "Notice that risk grows more slowly than time: 4 days is only twice the one-day risk."
        ],
        "example": "Random steps: after 100 random steps you are usually about 10 steps from where you started, not 100.",
        "code": "import math\n\none_day = 10_000\nfor days in [1, 4, 10, 25, 250]:\n    print(f\"{days:3} days: VaR ${one_day * math.sqrt(days):,.0f}\")",
        "output": "  1 days: VaR $10,000\n  4 days: VaR $20,000\n 10 days: VaR $31,623\n 25 days: VaR $50,000\n250 days: VaR $158,114",
        "codeNotes": [
          {
            "line": 5,
            "note": "VaR grows with the square root of the horizon."
          }
        ],
        "tryIt": "Why would the rule underestimate risk for a strategy whose returns tend to trend?",
        "check": {
          "question": "What is the 25-day VaR if one-day VaR is $10,000, using the square-root rule?",
          "options": [
            "$250,000",
            "$50,000",
            "$25,000"
          ],
          "answer": 1,
          "why": "√25 = 5, so 5 × $10,000."
        }
      },
      {
        "title": "Limits of VaR",
        "say": [
          "VaR is useful but has well-known weaknesses that every risk engineer must understand.",
          "It ignores the size of losses beyond the threshold: two portfolios with the same VaR can have very different disaster scenarios.",
          "It can be gamed: a trader can sell far out-of-the-money options that rarely lose, keeping VaR low while hiding a catastrophic tail.",
          "It is not always subadditive: the VaR of a combined portfolio can exceed the sum of the parts' VaRs, contradicting the idea that diversification reduces risk (Day 19).",
          "The 2008 crisis showed models calibrated on calm periods underestimating risk badly. Stress tests with explicit scenarios complement VaR for this reason.",
          "The example builds two portfolios with the same 95 percent VaR but very different worst days.",
          "Always report VaR alongside Expected Shortfall and stress test results."
        ],
        "example": "Two rivers of the same average depth: one is safe to wade everywhere, the other hides a deep channel in the middle.",
        "code": "calm = [-0.02] * 5 + [0.01] * 95\nhidden = [-0.02] * 4 + [-0.40] + [0.01] * 95\nfor name, r in [(\"calm\", calm), (\"hidden tail\", hidden)]:\n    s = sorted(r)\n    print(f\"{name:11} 95% VaR {-s[4]:.2f} | worst day {-s[0]:.2f}\")",
        "output": "calm        95% VaR 0.02 | worst day 0.02\nhidden tail 95% VaR 0.02 | worst day 0.40",
        "codeNotes": [
          {
            "line": 5,
            "note": "Same VaR cut-off, very different worst cases."
          }
        ],
        "tryIt": "Which single number would reveal the difference between these portfolios?",
        "check": {
          "question": "Why can VaR be misleading?",
          "options": [
            "It is too conservative",
            "It ignores how large losses beyond the threshold can be",
            "It uses too much data"
          ],
          "answer": 1,
          "why": "VaR says nothing about the depth of the tail."
        }
      },
      {
        "title": "Practice time: VaR calculators",
        "say": [
          "Practice 1: parametric_var(value, mean, vol, confidence=0.95). Look up z in {0.95: 1.645, 0.99: 2.326}, raise ValueError for other levels, compute pct = z × vol - mean, and return var_pct rounded to 6 decimals and var_amount rounded to 2.",
          "The checks use $1 million at 2 percent volatility ($32,900) and a 99 percent case with a small positive mean ($34,390).",
          "Practice 2: historical_var(returns, value, confidence=0.95) sorts the returns, takes the index floor((1 - confidence) × n + 1e-9) and returns value × -return rounded to 2; scale_var(one_day, days) multiplies by √days and rounds to 2.",
          "The checks use 20 days of returns (95 percent gives $50,000, 90 percent gives $35,000) and scale $10,000 over 10 days to $31,622.78.",
          "After passing, compare parametric and historical VaR on the same return history. Which is larger, and why?",
          "The example computes both for one series.",
          "Differences between the two methods are a useful warning sign of fat tails."
        ],
        "example": "Measuring a room with both a tape measure and a laser: when they disagree, something interesting is going on.",
        "code": "import math\nimport statistics\n\nrets = [0.01, -0.02, 0.005, -0.035, 0.012, -0.01, 0.0, 0.02, -0.05, 0.015] * 2\nmu, vol = statistics.mean(rets), statistics.stdev(rets)\nparametric = 1.645 * vol - mu\nhistorical = -sorted(rets)[int(math.floor(0.05 * len(rets) + 1e-9))]\nprint(f\"parametric 95% VaR {parametric:.4f} | historical 95% VaR {historical:.4f}\")",
        "output": "parametric 95% VaR 0.0424 | historical 95% VaR 0.0500",
        "codeNotes": [
          {
            "line": 6,
            "note": "Assumes a normal distribution."
          },
          {
            "line": 7,
            "note": "Reads the actual worst days."
          }
        ],
        "tryIt": "Which method is more conservative here, and what does that say about the data's tail?",
        "check": {
          "question": "parametric_var at confidence 0.9 should?",
          "options": [
            "Return a smaller VaR",
            "Raise ValueError",
            "Use z = 1.28"
          ],
          "answer": 1,
          "why": "Only 95 and 99 percent are supported in the practice."
        }
      }
    ],
    "summary": [
      "VaR is a loss threshold not exceeded with a given confidence over a horizon.",
      "Parametric VaR = (z × vol - mean) × value with z = 1.645 or 2.326.",
      "Historical VaR reads the percentile of real past returns.",
      "Square-root-of-time scales one-day VaR to longer horizons, approximately.",
      "VaR ignores tail size and can be gamed; pair it with Expected Shortfall and stress tests."
    ],
    "projectStep": {
      "title": "VaR report",
      "steps": [
        "Compute parametric and historical VaR for a return series at 95 and 99 percent.",
        "Scale to 10 days and backtest by counting breaches.",
        "Write a note explaining the gap between the two methods."
      ]
    }
  },
  {
    "day": 19,
    "title": "Tail Risk & Expected Shortfall (CVaR / Conditional VaR)",
    "goal": "You can compute Expected Shortfall, explain why it is a coherent risk measure unlike VaR, measure diversification benefits, and run simple stress scenarios.",
    "minutes": 30,
    "recap": "Yesterday VaR told you where the bad days start, but not how bad they get. Expected Shortfall looks past the threshold into the tail.",
    "parts": [
      {
        "title": "Expected Shortfall",
        "say": [
          "Expected Shortfall (ES), also called Conditional VaR (CVaR), is the average loss on the days that are worse than the VaR threshold.",
          "If the 95 percent VaR is the 5th percentile loss, the 95 percent ES is the average of all losses in that worst 5 percent.",
          "ES is always at least as large as VaR, and it grows when the tail gets worse, which VaR ignores.",
          "After the 2008 crisis, banking regulators (the Basel Committee's Fundamental Review of the Trading Book) moved from 99 percent VaR to 97.5 percent ES for market risk capital.",
          "Practice 1 is expected_shortfall(returns, confidence): take the worst k = max(1, round((1 - confidence) × n)) returns; VaR is the loss at the k-th worst, ES is their average loss.",
          "The example computes both for the \"hidden tail\" portfolio from yesterday.",
          "ES captures the disaster that VaR hid."
        ],
        "example": "Asking not just \"how deep is the river at its 95th deepest point?\" but \"how deep is it, on average, in the deepest parts?\"",
        "code": "def var_es(returns, confidence=0.95):\n    k = max(1, round((1 - confidence) * len(returns)))\n    tail = sorted(returns)[:k]\n    return round(-tail[-1], 4), round(-sum(tail) / k, 4)\n\ncalm = [-0.02] * 5 + [0.01] * 95\nhidden = [-0.02] * 4 + [-0.40] + [0.01] * 95\nprint(\"calm        VaR, ES:\", var_es(calm))\nprint(\"hidden tail VaR, ES:\", var_es(hidden))",
        "output": "calm        VaR, ES: (0.02, 0.02)\nhidden tail VaR, ES: (0.02, 0.096)",
        "codeNotes": [
          {
            "line": 3,
            "note": "The worst k returns form the tail."
          },
          {
            "line": 4,
            "note": "VaR is the edge of the tail; ES is its average."
          }
        ],
        "tryIt": "Compute both at 99 percent. What changes?",
        "check": {
          "question": "How is Expected Shortfall defined?",
          "options": [
            "The single worst loss",
            "The average loss in the tail beyond the VaR threshold",
            "The average of all losses"
          ],
          "answer": 1,
          "why": "ES averages the tail losses."
        }
      },
      {
        "title": "Coherent risk measures",
        "say": [
          "In 1999 Artzner, Delbaen, Eber and Heath listed properties a sensible risk measure should have, calling such measures coherent.",
          "Monotonicity: a portfolio that always loses more has more risk. Translation invariance: adding cash reduces risk by that amount. Positive homogeneity: doubling a position doubles its risk.",
          "Subadditivity: the risk of a combined portfolio is never more than the sum of the parts. Merging should not create risk; this is the mathematical form of diversification.",
          "VaR fails subadditivity in some cases, especially with lumpy, rare losses like defaults. ES always satisfies all four properties.",
          "Practice 2 is diversification(risk_a, risk_b, risk_combined): check subadditivity and compute the diversification benefit in money and percent.",
          "The example shows VaR breaking subadditivity with two independent bonds that each default with a 4 percent chance.",
          "This is not just theory: a firm aggregating desk VaRs could understate or misstate total risk if it forgets these properties."
        ],
        "example": "A good ruler must never say two short sticks laid end to end are longer than both measured separately.",
        "code": "import itertools\n\np, loss = 0.04, 100\noutcomes = {}\nfor a, b in itertools.product([0, 1], repeat=2):\n    prob = (p if a else 1 - p) * (p if b else 1 - p)\n    outcomes[(a + b) * loss] = outcomes.get((a + b) * loss, 0) + prob\ndef var95(dist):\n    cum = 0.0\n    for l in sorted(dist, reverse=True):\n        cum += dist[l]\n        if cum > 0.05:\n            return l\nsingle = {100: p, 0: 1 - p}\nprint(\"VaR of one bond:\", var95(single), \"| sum of two:\", 2 * var95(single))\nprint(\"VaR of both together:\", var95(outcomes))",
        "output": "VaR of one bond: 0 | sum of two: 0\nVaR of both together: 100",
        "codeNotes": [
          {
            "line": 6,
            "note": "Independent defaults multiply probabilities."
          },
          {
            "line": 12,
            "note": "VaR is the smallest loss whose tail probability exceeds 5 percent."
          }
        ],
        "tryIt": "Why does each bond alone have a VaR of 0, while the pair does not?",
        "check": {
          "question": "Which property does VaR sometimes violate?",
          "options": [
            "Monotonicity",
            "Subadditivity",
            "Positive homogeneity"
          ],
          "answer": 1,
          "why": "VaR of a combined portfolio can exceed the sum of individual VaRs."
        }
      },
      {
        "title": "Diversification in numbers",
        "say": [
          "Diversification benefit = sum of stand-alone risks - risk of the combined portfolio.",
          "If desk A has risk 100 and desk B 80, and together they have 140, the benefit is 40, or 22.2 percent of the stand-alone total.",
          "The benefit depends on correlation: perfectly correlated positions give no benefit (the risks just add up); uncorrelated or negatively correlated positions give a lot.",
          "Firms allocate diversification benefits back to desks, which affects how much capital each desk is charged.",
          "A combined risk larger than the sum (subadditive False) is a red flag that the risk measure or the data is behaving badly.",
          "The example shows the combined risk for two positions at different correlations, using the formula for adding standard deviations.",
          "Day 20 builds a whole portfolio theory on this idea."
        ],
        "example": "Two umbrella sellers and two ice cream sellers in one company: bad weather hurts one and helps the other, so the company is steadier than either business alone.",
        "code": "import math\n\na, b = 100, 80\nfor rho in [1.0, 0.5, 0.0, -0.5]:\n    combined = math.sqrt(a ** 2 + b ** 2 + 2 * rho * a * b)\n    benefit = a + b - combined\n    print(f\"correlation {rho:+.1f}: combined {combined:6.1f}  benefit {benefit:5.1f} ({benefit / (a + b):.1%})\")",
        "output": "correlation +1.0: combined  180.0  benefit   0.0 (0.0%)\ncorrelation +0.5: combined  156.2  benefit  23.8 (13.2%)\ncorrelation +0.0: combined  128.1  benefit  51.9 (28.9%)\ncorrelation -0.5: combined   91.7  benefit  88.3 (49.1%)",
        "codeNotes": [
          {
            "line": 5,
            "note": "Standard deviations combine through the correlation."
          }
        ],
        "tryIt": "At which correlation would the combined risk be exactly 20?",
        "check": {
          "question": "What is the diversification benefit for perfectly correlated positions?",
          "options": [
            "The largest possible",
            "Zero",
            "Negative"
          ],
          "answer": 1,
          "why": "With correlation 1 the risks simply add."
        }
      },
      {
        "title": "Stress testing",
        "say": [
          "Statistical measures rely on history and assumptions. Stress tests ask a direct question instead: \"What would we lose if this specific bad thing happened?\"",
          "Historical scenarios replay real crises: the 1987 crash, 2008, the March 2020 COVID shock. Hypothetical scenarios describe plausible events that have not happened yet.",
          "A scenario specifies shocks to risk factors (stocks down 20 percent, volatility up 15 points, rates up 1 percent) and revalues every position.",
          "Reverse stress testing works backwards: which scenario would cause a loss large enough to put the firm out of business?",
          "Stress results feed limits and capital planning alongside VaR and ES.",
          "The example applies three scenarios to a small book with stock and volatility exposures.",
          "Good stress tests are specific, severe but plausible, and cover what the statistical models might miss."
        ],
        "example": "A fire drill: instead of estimating the average risk of fire, you check exactly what happens if the kitchen catches fire at lunchtime.",
        "code": "book = {\"delta_dollars\": 2_000_000, \"vega_per_point\": 15_000}\nscenarios = {\n    \"equity crash\": {\"move\": -0.20, \"vol_points\": 15},\n    \"calm rally\": {\"move\": 0.05, \"vol_points\": -3},\n    \"vol spike only\": {\"move\": 0.0, \"vol_points\": 25},\n}\nfor name, s in scenarios.items():\n    pnl = book[\"delta_dollars\"] * s[\"move\"] + book[\"vega_per_point\"] * s[\"vol_points\"]\n    print(f\"{name:15} P&L ${pnl:,.0f}\")",
        "output": "equity crash    P&L $-175,000\ncalm rally      P&L $55,000\nvol spike only  P&L $375,000",
        "codeNotes": [
          {
            "line": 8,
            "note": "Revalue with first-order sensitivities: delta times move plus vega times vol change."
          }
        ],
        "tryIt": "Design a scenario that makes this book lose more than $500,000.",
        "check": {
          "question": "What does reverse stress testing ask?",
          "options": [
            "What was the best day?",
            "Which scenario would cause an unacceptable loss?",
            "How fast is the system?"
          ],
          "answer": 1,
          "why": "It searches for the scenarios that would break the firm."
        }
      },
      {
        "title": "Reporting risk",
        "say": [
          "Risk numbers are only useful if decision makers understand them and act on them.",
          "A daily risk report shows VaR and ES at the firm and desk levels, limit usage, the largest positions, stress results, and backtesting breaches.",
          "Trends matter as much as levels: a VaR that has doubled in a week needs an explanation even if it is under the limit.",
          "Every number should come with a short explanation of what drove it, such as a new position, a market move or a model change, so readers can act instead of guess.",
          "Limits are set on several measures at once (VaR, ES, stress loss, position size) because each one misses something.",
          "Clear reporting avoids the classic failure where the numbers existed but nobody understood them in time.",
          "The example builds a compact limit usage table with a traffic-light status.",
          "Tomorrow's portfolio optimisation and Milestone 3 feed directly into this kind of report."
        ],
        "example": "A car dashboard: a few clear dials and warning lights, not a thousand raw sensor readings.",
        "code": "limits = {\"VaR 95%\": (82_000, 100_000), \"ES 97.5%\": (131_000, 150_000), \"Stress crash\": (410_000, 400_000)}\nfor name, (used, limit) in limits.items():\n    usage = used / limit\n    status = \"RED\" if usage > 1 else \"AMBER\" if usage > 0.8 else \"GREEN\"\n    print(f\"{name:12} {used:>8,} / {limit:>8,}  {usage:5.0%}  {status}\")",
        "output": "VaR 95%        82,000 /  100,000    82%  AMBER\nES 97.5%      131,000 /  150,000    87%  AMBER\nStress crash  410,000 /  400,000   102%  RED",
        "codeNotes": [
          {
            "line": 4,
            "note": "Traffic lights: over the limit, close to it, or comfortable."
          }
        ],
        "tryIt": "Which action would you expect the risk manager to take for the red row?",
        "check": {
          "question": "Why set limits on several risk measures at once?",
          "options": [
            "To confuse traders",
            "Because each measure misses something the others catch",
            "Regulators require exactly three"
          ],
          "answer": 1,
          "why": "No single number captures all risk."
        }
      },
      {
        "title": "Practice time: tails and diversification",
        "say": [
          "Practice 1: expected_shortfall(returns, confidence=0.95). k = max(1, round((1 - confidence) × len(returns))); tail = the k lowest returns; var = -tail[-1]; es = -sum(tail) / k; round both to 4 decimals.",
          "The checks: 20 days at 95 percent (k = 1, so VaR and ES are both the worst day, 0.08), 80 percent (k = 4, VaR 0.02, ES 0.045), and a three-day sample that still uses at least one day.",
          "Practice 2: diversification(risk_a, risk_b, risk_combined). Return subadditive (combined <= sum), the benefit rounded to 2, and the benefit percentage rounded to 1.",
          "The checks: (100, 80, 140) gives a 40 benefit and 22.2 percent; (50, 50, 120) is not subadditive; (10, 10, 20) has no benefit.",
          "After passing, compute ES at 95 and 97.5 percent for a series with one crash day and see how sensitive ES is to that day.",
          "The example shows that sensitivity.",
          "ES reacts to the size of the worst losses; that sensitivity is exactly why regulators prefer it."
        ],
        "example": "A smoke alarm that also tells you how big the fire is, not just that there is one.",
        "code": "def es(returns, confidence):\n    k = max(1, round((1 - confidence) * len(returns)))\n    return round(-sum(sorted(returns)[:k]) / k, 4)\n\nbase = [0.01, -0.01, 0.005, -0.02, 0.0] * 8\nwith_crash = base[:-1] + [-0.15]\nfor conf in [0.95, 0.975]:\n    print(f\"{conf:.1%}: ES normal {es(base, conf)} | with one crash day {es(with_crash, conf)}\")",
        "output": "95.0%: ES normal 0.02 | with one crash day 0.085\n97.5%: ES normal 0.02 | with one crash day 0.15",
        "codeNotes": [
          {
            "line": 6,
            "note": "Replace one ordinary day with a crash."
          }
        ],
        "tryIt": "How would 95 percent VaR react to the same crash day?",
        "check": {
          "question": "expected_shortfall on 20 returns at 95 percent uses how many tail days?",
          "options": [
            "0",
            "1",
            "5"
          ],
          "answer": 1,
          "why": "k = round(0.05 × 20) = 1."
        }
      }
    ],
    "summary": [
      "Expected Shortfall averages losses beyond the VaR threshold and is always at least VaR.",
      "Coherent risk measures satisfy monotonicity, translation invariance, homogeneity and subadditivity.",
      "VaR can fail subadditivity; ES never does, which is why regulators adopted it.",
      "Diversification benefit = sum of stand-alone risks - combined risk, driven by correlation.",
      "Stress tests and clear limit reports complement statistical measures."
    ],
    "projectStep": {
      "title": "Tail risk dashboard",
      "steps": [
        "Compute VaR and ES for two desks and the combined book.",
        "Measure the diversification benefit and check subadditivity.",
        "Run three stress scenarios and present a traffic-light limit report."
      ]
    }
  },
  {
    "day": 20,
    "title": "Portfolio Optimization: Modern Portfolio Theory (Markowitz Frontier)",
    "goal": "You can compute the return, risk and Sharpe ratio of a portfolio, explain how correlation drives diversification, find the minimum-variance mix of two assets, and describe the efficient frontier.",
    "minutes": 30,
    "recap": "Yesterday diversification reduced risk. Harry Markowitz turned that observation into a theory for choosing portfolios, which earned him a Nobel prize.",
    "parts": [
      {
        "title": "Return and risk of a portfolio",
        "say": [
          "A portfolio holds weights in several assets. Its expected return is simply the weighted average of the assets' expected returns.",
          "Its risk (standard deviation) is not the weighted average. For two assets with weights w and 1 - w: variance = (w σA)² + ((1 - w) σB)² + 2 w (1 - w) ρ σA σB.",
          "ρ (rho) is the correlation between the assets' returns, from -1 to 1. It is the term that makes diversification work.",
          "With ρ = 1, risk is the weighted average; with ρ below 1, it is less; with ρ = -1, the right weights can cancel risk completely.",
          "Practice 1 is portfolio_metrics(w, mu_a, sig_a, mu_b, sig_b, rho, rf=0.02), returning return, risk and Sharpe ratio.",
          "The example computes a 50/50 portfolio of a 10 percent return, 20 percent risk asset and a 6 percent, 10 percent risk asset for several correlations.",
          "The return never changes with correlation; only the risk does."
        ],
        "example": "Mixing hot and cold water: the temperature is a simple average, but how much it fluctuates depends on whether the taps wobble together or independently.",
        "code": "import math\n\nw, mu_a, sig_a, mu_b, sig_b = 0.5, 0.10, 0.20, 0.06, 0.10\nfor rho in [1.0, 0.5, 0.0, -1.0]:\n    mu = w * mu_a + (1 - w) * mu_b\n    var = (w * sig_a) ** 2 + ((1 - w) * sig_b) ** 2 + 2 * w * (1 - w) * rho * sig_a * sig_b\n    print(f\"rho {rho:+.1f}: return {mu:.2%}  risk {math.sqrt(var):.2%}\")",
        "output": "rho +1.0: return 8.00%  risk 15.00%\nrho +0.5: return 8.00%  risk 13.23%\nrho +0.0: return 8.00%  risk 11.18%\nrho -1.0: return 8.00%  risk 5.00%",
        "codeNotes": [
          {
            "line": 6,
            "note": "The correlation term shrinks risk as rho falls."
          }
        ],
        "tryIt": "What weight w makes the risk exactly zero when rho = -1?",
        "check": {
          "question": "Which quantity does correlation change for a two-asset portfolio?",
          "options": [
            "The expected return",
            "The risk",
            "Both equally"
          ],
          "answer": 1,
          "why": "Return is a weighted average; risk depends on correlation."
        }
      },
      {
        "title": "The Sharpe ratio",
        "say": [
          "Investors care about return per unit of risk. The Sharpe ratio, by William Sharpe, is (portfolio return - risk-free rate) / portfolio risk.",
          "It measures the excess return earned for each unit of volatility taken. Higher is better.",
          "For the 50/50 portfolio with zero correlation: return 8 percent, risk 11.18 percent, risk-free 2 percent, so Sharpe = 0.06 / 0.1118 = 0.5367.",
          "Sharpe ratios are annualised: daily Sharpe × √252 (trading days). Beware of strategies with high Sharpe ratios built on rare-but-huge tail losses (Day 18).",
          "Day 26 will show how backtest overfitting inflates Sharpe ratios, and how to haircut them.",
          "The example compares the Sharpe ratio of each asset alone with the 50/50 mix.",
          "Diversification can raise the Sharpe ratio above either asset alone: a free lunch, as Markowitz called it."
        ],
        "example": "Fuel efficiency for investing: not just how far you travel, but how far per litre of risk.",
        "code": "import math\n\nrf = 0.02\ndef sharpe(mu, sigma):\n    return round((mu - rf) / sigma, 4)\n\nprint(\"asset A alone:\", sharpe(0.10, 0.20))\nprint(\"asset B alone:\", sharpe(0.06, 0.10))\nmix_risk = math.sqrt((0.5 * 0.20) ** 2 + (0.5 * 0.10) ** 2)\nprint(\"50/50 mix, rho 0:\", sharpe(0.08, mix_risk))",
        "output": "asset A alone: 0.4\nasset B alone: 0.4\n50/50 mix, rho 0: 0.5367",
        "codeNotes": [
          {
            "line": 9,
            "note": "Zero correlation removes the cross term."
          }
        ],
        "tryIt": "Does the mix still beat both assets if rho = 0.8?",
        "check": {
          "question": "What does the Sharpe ratio measure?",
          "options": [
            "Total return",
            "Excess return per unit of risk",
            "The number of trades"
          ],
          "answer": 1,
          "why": "(return - risk-free rate) / risk."
        }
      },
      {
        "title": "The minimum-variance portfolio",
        "say": [
          "Among all mixes of two assets, one has the lowest possible risk: the minimum-variance portfolio.",
          "Setting the derivative of the variance to zero gives the weight in asset A: w* = (σB² - ρ σA σB) / (σA² + σB² - 2 ρ σA σB).",
          "With σA = 20 percent, σB = 10 percent and ρ = 0, w* = 0.01 / 0.05 = 0.2: mostly the calmer asset, but not entirely, because a little of the other diversifies.",
          "With equal risks, w* = 0.5 whatever the correlation. With ρ = -1, the minimum-variance mix has zero risk.",
          "Practice 2 is min_variance_weight(sig_a, sig_b, rho), rounded to 4 decimals.",
          "The example scans weights from 0 to 1 and confirms the formula finds the lowest risk.",
          "Checking a formula against a brute-force scan is a habit worth keeping."
        ],
        "example": "Balancing a seesaw: there is exactly one spot where it wobbles least.",
        "code": "import math\n\nsa, sb, rho = 0.20, 0.10, 0.0\ndef risk(w):\n    return math.sqrt((w * sa) ** 2 + ((1 - w) * sb) ** 2 + 2 * w * (1 - w) * rho * sa * sb)\n\nbest = min((risk(w / 100), w / 100) for w in range(101))\nformula = (sb ** 2 - rho * sa * sb) / (sa ** 2 + sb ** 2 - 2 * rho * sa * sb)\nprint(\"scan: lowest risk\", round(best[0], 4), \"at weight\", best[1])\nprint(\"formula weight:\", round(formula, 4))",
        "output": "scan: lowest risk 0.0894 at weight 0.2\nformula weight: 0.2",
        "codeNotes": [
          {
            "line": 7,
            "note": "Brute force over 101 weights."
          },
          {
            "line": 8,
            "note": "The closed-form minimum-variance weight."
          }
        ],
        "tryIt": "Set rho to -1. What weight and risk do the scan and formula give?",
        "check": {
          "question": "For two assets with equal volatility, what is the minimum-variance weight?",
          "options": [
            "0.2",
            "0.5",
            "It depends on the returns"
          ],
          "answer": 1,
          "why": "Symmetry makes 50/50 the least risky mix."
        }
      },
      {
        "title": "The efficient frontier",
        "say": [
          "Plot every possible portfolio by risk (x axis) and return (y axis). The upper-left edge of that cloud is the efficient frontier.",
          "Portfolios on the frontier give the highest return for their level of risk. Anything below it is inefficient: another portfolio offers more return for the same risk.",
          "The minimum-variance portfolio is the frontier's leftmost point. Everything below it on the curve is dominated.",
          "With a risk-free asset available, the best combination touches the frontier at the tangency portfolio, the one with the highest Sharpe ratio.",
          "With many assets the frontier comes from quadratic optimisation over a covariance matrix; the ideas are exactly the two-asset ones.",
          "The example prints the frontier points for our two assets and marks the highest-Sharpe mix.",
          "In practice, estimated returns are noisy, so real optimisers add constraints and shrinkage to avoid extreme weights.",
          "Notice in the output that w = 0.0 is dominated: w = 0.2 has more return and less risk, so no sensible investor would hold only asset B."
        ],
        "example": "A menu where for every price there is one best dish; anything else at that price is simply worse.",
        "code": "import math\n\nmu_a, sa, mu_b, sb, rho, rf = 0.10, 0.20, 0.06, 0.10, 0.0, 0.02\npoints = []\nfor w in [0.0, 0.2, 0.4, 0.6, 0.8, 1.0]:\n    mu = w * mu_a + (1 - w) * mu_b\n    sig = math.sqrt((w * sa) ** 2 + ((1 - w) * sb) ** 2 + 2 * w * (1 - w) * rho * sa * sb)\n    points.append((w, round(mu, 4), round(sig, 4), round((mu - rf) / sig, 4)))\nbest = max(points, key=lambda p: p[3])\nfor w, mu, sig, sh in points:\n    print(f\"w={w:.1f} return {mu:.4f} risk {sig:.4f} sharpe {sh:.4f}{'  <- best Sharpe' if w == best[0] else ''}\")",
        "output": "w=0.0 return 0.0600 risk 0.1000 sharpe 0.4000\nw=0.2 return 0.0680 risk 0.0894 sharpe 0.5367\nw=0.4 return 0.0760 risk 0.1000 sharpe 0.5600  <- best Sharpe\nw=0.6 return 0.0840 risk 0.1265 sharpe 0.5060\nw=0.8 return 0.0920 risk 0.1612 sharpe 0.4465\nw=1.0 return 0.1000 risk 0.2000 sharpe 0.4000",
        "codeNotes": [
          {
            "line": 9,
            "note": "The tangency portfolio maximises the Sharpe ratio."
          }
        ],
        "tryIt": "Is the w = 0.0 portfolio efficient? Compare it with w = 0.2.",
        "check": {
          "question": "What is the efficient frontier?",
          "options": [
            "All possible portfolios",
            "The portfolios with the highest return for each level of risk",
            "Only the minimum-variance portfolio"
          ],
          "answer": 1,
          "why": "It is the upper edge of the risk-return cloud."
        }
      },
      {
        "title": "Estimation error and practical limits",
        "say": [
          "Markowitz optimisation is only as good as its inputs, and expected returns are notoriously hard to estimate.",
          "Small changes in estimated returns can swing optimal weights wildly, a problem often called \"error maximisation\": the optimiser loves assets whose returns were overestimated.",
          "Practical fixes include constraints (no short selling, maximum weights), shrinking estimates towards a common value, Black-Litterman views, and risk parity, which ignores returns altogether.",
          "Covariances are more stable than returns, which is why minimum-variance portfolios often perform well in practice.",
          "Trading desks apply the same ideas at high frequency: sizing positions across correlated instruments to maximise expected profit for a risk budget.",
          "The example shows how a small change in one asset's expected return moves the highest-Sharpe weight.",
          "Treat optimiser output as a suggestion to be sanity-checked, not a command.",
          "A good habit is to rerun the optimiser with slightly changed inputs; if the recommended weights jump around, the answer is not reliable enough to trade on."
        ],
        "example": "A satnav that sends you through a field because one road's speed limit was typed in slightly wrong.",
        "code": "import math\n\ndef best_weight(mu_a, mu_b=0.06, sa=0.20, sb=0.10, rf=0.02):\n    best = None\n    for i in range(101):\n        w = i / 100\n        sig = math.sqrt((w * sa) ** 2 + ((1 - w) * sb) ** 2)\n        sh = (w * mu_a + (1 - w) * mu_b - rf) / sig\n        if best is None or sh > best[0]:\n            best = (sh, w)\n    return best[1]\n\nfor mu_a in [0.08, 0.10, 0.12]:\n    print(f\"expected return of A {mu_a:.0%}: best weight in A {best_weight(mu_a):.2f}\")",
        "output": "expected return of A 8%: best weight in A 0.27\nexpected return of A 10%: best weight in A 0.33\nexpected return of A 12%: best weight in A 0.38",
        "codeNotes": [
          {
            "line": 8,
            "note": "The Sharpe ratio for each candidate weight."
          }
        ],
        "tryIt": "By how much does the best weight move for a 2 percentage point change in A's expected return?",
        "check": {
          "question": "Why are minimum-variance portfolios often robust in practice?",
          "options": [
            "They ignore risk",
            "They depend only on covariances, which are estimated more reliably than returns",
            "They always have the highest return"
          ],
          "answer": 1,
          "why": "They avoid the noisiest input, expected returns."
        }
      },
      {
        "title": "Practice time: build a portfolio",
        "say": [
          "Practice 1: portfolio_metrics(w, mu_a, sig_a, mu_b, sig_b, rho, rf=0.02). Compute the weighted return, the variance with the correlation term, sigma = √max(var, 0), and Sharpe = (mu - rf) / sigma (or 0 when sigma is 0). Round each to 4 decimals.",
          "The checks: the 50/50 zero-correlation mix (0.08, 0.1118, 0.5367), perfect correlation (risk 0.15) and perfect negative correlation (risk 0.05).",
          "Practice 2: min_variance_weight(sig_a, sig_b, rho). The formula from part 3, rounded to 4 decimals: 0.2, 0.5 and 0.3333 in the checks.",
          "The max(var, 0) guard protects against tiny negative variances caused by floating point rounding when risk should be exactly zero.",
          "After passing, trace the frontier for rho = 0.3 and find its minimum-variance and highest-Sharpe points.",
          "The example shows why the guard is needed.",
          "Tomorrow, Milestone 3 combines pricing, Greeks and these risk tools into one engine."
        ],
        "example": "Putting a safety rail at the edge of a cliff you should never reach, just in case rounding pushes you over.",
        "code": "import math\n\nsa, sb, rho = 0.05, 0.18, -1.0\nw = sb / (sa + sb)                     # the zero-risk weight when rho is -1\nvar = (w * sa) ** 2 + ((1 - w) * sb) ** 2 + 2 * w * (1 - w) * rho * sa * sb\nprint(\"raw variance is slightly negative:\", var < 0, \"| tiny:\", abs(var) < 1e-15)\nprint(\"guarded risk:\", round(math.sqrt(max(var, 0.0)), 4))",
        "output": "raw variance is slightly negative: True | tiny: True\nguarded risk: 0.0",
        "codeNotes": [
          {
            "line": 5,
            "note": "Mathematically zero, but floating point leaves a tiny negative remainder."
          },
          {
            "line": 7,
            "note": "The guard avoids math.sqrt of a negative number."
          }
        ],
        "tryIt": "What error would math.sqrt raise if var were slightly negative?",
        "check": {
          "question": "min_variance_weight(0.20, 0.10, 0.0) returns?",
          "options": [
            "0.5",
            "0.2",
            "0.8"
          ],
          "answer": 1,
          "why": "0.01 / (0.04 + 0.01) = 0.2."
        }
      }
    ],
    "summary": [
      "Portfolio return is a weighted average; risk depends on correlation.",
      "Sharpe ratio = (return - risk-free rate) / risk; diversification can raise it.",
      "The minimum-variance weight is (σB² - ρσAσB) / (σA² + σB² - 2ρσAσB).",
      "The efficient frontier holds the best return for each risk; the tangency point has the highest Sharpe.",
      "Estimated returns are noisy; constrain and sanity-check optimiser output."
    ],
    "projectStep": {
      "title": "Two-asset optimiser",
      "steps": [
        "Implement portfolio_metrics and min_variance_weight.",
        "Trace the efficient frontier for three correlations.",
        "Show how sensitive the highest-Sharpe weight is to the expected return inputs."
      ]
    }
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Quantitative Pricing, Greeks & Risk Engine",
    "goal": "You can combine positions into a risk engine that aggregates Greeks, computes scenario VaR and Expected Shortfall, and turns net delta into a hedge order.",
    "minutes": 30,
    "recap": "Milestone 3 connects Black-Scholes and the Greeks (Days 16 and 17) with VaR and Expected Shortfall (Days 18 and 19) and portfolio thinking (Day 20) into one engine a trading desk could run every few seconds.",
    "parts": [
      {
        "title": "Aggregating Greeks",
        "say": [
          "A desk holds many positions: options with different strikes and expiries, plus stock or futures. Risk is managed on the total, not position by position.",
          "Greeks add up across positions of the same underlying: net delta = sum of quantity × delta, net vega = sum of quantity × vega, and so on.",
          "Signs matter: a short position (negative quantity) contributes negative delta and vega.",
          "Greeks of different underlyings cannot simply be added: a delta in one stock is not a delta in another, so engines report risk per underlying and convert to money before combining.",
          "Stock itself has delta 1 and no vega, so holding shares changes delta without touching volatility exposure.",
          "Practice 1 is risk_engine(positions, pnl_scenarios, confidence=0.99). Its first job is net delta and net vega.",
          "The example aggregates a small book of two option lines and a stock line.",
          "A single net delta number replaces hundreds of positions when deciding how to hedge."
        ],
        "example": "Adding up everyone's pushes and pulls on a tug-of-war rope to see which way it will move.",
        "code": "positions = [\n    {\"name\": \"100 call\", \"qty\": 10, \"delta\": 0.6, \"vega\": 0.4},\n    {\"name\": \"110 call\", \"qty\": -5, \"delta\": 0.3, \"vega\": 0.5},\n    {\"name\": \"stock\", \"qty\": 200, \"delta\": 1.0, \"vega\": 0.0},\n]\nfor p in positions:\n    print(f\"{p['name']:9} delta {p['qty'] * p['delta']:7.1f}  vega {p['qty'] * p['vega']:5.1f}\")\nprint(\"net delta\", round(sum(p[\"qty\"] * p[\"delta\"] for p in positions), 2),\n      \"| net vega\", round(sum(p[\"qty\"] * p[\"vega\"] for p in positions), 2))",
        "output": "100 call  delta     6.0  vega   4.0\n110 call  delta    -1.5  vega  -2.5\nstock     delta   200.0  vega   0.0\nnet delta 204.5 | net vega 1.5",
        "codeNotes": [
          {
            "line": 7,
            "note": "Each line contributes quantity times its Greek."
          },
          {
            "line": 8,
            "note": "The book's risk is the sum."
          }
        ],
        "tryIt": "Add a short position of 4 of the 100 call. How do net delta and vega change?",
        "check": {
          "question": "What is the delta contribution of -5 options with delta 0.3?",
          "options": [
            "1.5",
            "-1.5",
            "-0.3"
          ],
          "answer": 1,
          "why": "-5 × 0.3 = -1.5."
        }
      },
      {
        "title": "Scenario revaluation",
        "say": [
          "Greeks describe small moves. For large moves, risk engines fully revalue every position under many scenarios.",
          "A scenario sets new values for risk factors: the stock price, volatility, rates and time. Each position is repriced with Black-Scholes (or another model) and the P&L is the change in value.",
          "Historical scenarios take the factor moves from past days; Monte Carlo scenarios draw them from a model. Either way, the output is a list of portfolio P&Ls.",
          "Full revaluation captures gamma and other non-linear effects that a delta-only estimate misses.",
          "The example revalues one long call under stock moves of -10 to +10 percent and compares the full P&L with the delta approximation.",
          "The gap between the two is the gamma effect; it grows with the size of the move.",
          "This is the heaviest computation in the engine and the one that benefits most from SIMD and parallel hardware (Day 14)."
        ],
        "example": "Rebuilding a model bridge and testing it under every load, rather than extrapolating from one small weight.",
        "code": "import math\n\nN = lambda x: 0.5 * (1 + math.erf(x / math.sqrt(2)))\ndef call(S, K=100, T=1.0, r=0.05, sigma=0.2):\n    d1 = (math.log(S / K) + (r + sigma ** 2 / 2) * T) / (sigma * math.sqrt(T))\n    return S * N(d1) - K * math.exp(-r * T) * N(d1 - sigma * math.sqrt(T))\n\nbase, delta = call(100), 0.6368\nfor move in [-0.10, -0.05, 0.05, 0.10]:\n    full = call(100 * (1 + move)) - base\n    approx = delta * 100 * move\n    print(f\"move {move:+.0%}: full P&L {full:+.3f}  delta estimate {approx:+.3f}\")",
        "output": "move -10%: full P&L -5.359  delta estimate -6.368\nmove -5%: full P&L -2.940  delta estimate -3.184\nmove +5%: full P&L +3.407  delta estimate +3.184\nmove +10%: full P&L +7.212  delta estimate +6.368",
        "codeNotes": [
          {
            "line": 10,
            "note": "Full revaluation reprices the option."
          },
          {
            "line": 11,
            "note": "The linear delta estimate."
          }
        ],
        "tryIt": "Why is the full P&L better than the delta estimate on both up and down moves?",
        "check": {
          "question": "Why do risk engines fully revalue positions under scenarios?",
          "options": [
            "It is faster",
            "Greeks only describe small moves; full revaluation captures non-linear effects",
            "Regulators forbid Greeks"
          ],
          "answer": 1,
          "why": "Large moves need full repricing to capture gamma and more."
        }
      },
      {
        "title": "VaR and ES from scenarios",
        "say": [
          "Once each scenario has a portfolio P&L, VaR and ES come straight from the tail of that list, exactly as on Days 18 and 19.",
          "With 200 scenarios at 99 percent confidence, k = round(0.01 × 200) = 2: VaR is the second worst loss and ES is the average of the two worst.",
          "The practice uses P&Ls in money (negative for losses), so VaR = -tail[-1] and ES = -sum(tail) / k.",
          "At 99.5 percent, k = 1: VaR and ES both equal the single worst scenario.",
          "The number of scenarios matters: with few scenarios, the 99 percent tail rests on one or two numbers and is very noisy.",
          "The example computes both measures for the practice's scenario list at two confidence levels.",
          "This part of the engine is the same code you already wrote; the new work is feeding it the right scenario P&Ls."
        ],
        "example": "Reading the last few names off a sorted list of exam results to see how the weakest students did.",
        "code": "pnl = [-120000, -80000, -50000] + [1000] * 197\nfor conf in [0.99, 0.995]:\n    k = max(1, round((1 - conf) * len(pnl)))\n    tail = sorted(pnl)[:k]\n    print(f\"{conf:.1%}: k={k}  VaR {-tail[-1]:,}  ES {-sum(tail) / k:,.0f}\")",
        "output": "99.0%: k=2  VaR 80,000  ES 100,000\n99.5%: k=1  VaR 120,000  ES 120,000",
        "codeNotes": [
          {
            "line": 3,
            "note": "k tail scenarios at this confidence."
          }
        ],
        "tryIt": "What happens at 98 percent confidence?",
        "check": {
          "question": "With 200 scenarios at 99 percent, how many form the tail?",
          "options": [
            "1",
            "2",
            "20"
          ],
          "answer": 1,
          "why": "round(0.01 × 200) = 2."
        }
      },
      {
        "title": "Delta hedging",
        "say": [
          "A desk that does not want directional exposure hedges its net delta by trading the underlying: sell shares if delta is positive, buy if negative.",
          "The hedge quantity is -net_delta / delta_per_unit, rounded to whole units. For shares, delta per unit is 1; for a futures contract it may be 50 or 100.",
          "Python's round uses banker's rounding: exact halves go to the even number, so round(204.5) is 204 and round(205.5) is 206.",
          "Practice 2 is delta_hedge(net_delta, delta_per_unit=1.0), returning a signed whole number of units, with 0 (not -0) for no hedge.",
          "After hedging, gamma makes delta drift again as the price moves, so hedges are rebalanced regularly; the cost of rebalancing is a key trading expense.",
          "The example hedges a few net deltas and shows the rounding behaviour.",
          "Hedging turns a directional bet into a volatility position: what remains is exposure to vega and gamma."
        ],
        "example": "Balancing a boat: if everyone leans left, someone must move right to keep it level, and keep adjusting as people shift.",
        "code": "def hedge(net_delta, per_unit=1.0):\n    return -round(net_delta / per_unit) or 0\n\nfor nd, per in [(204.5, 1.0), (205.5, 1.0), (-150.2, 1.0), (250, 50), (0.2, 1.0)]:\n    print(f\"net delta {nd:7}: trade {hedge(nd, per):5} units of delta {per}\")",
        "output": "net delta   204.5: trade  -204 units of delta 1.0\nnet delta   205.5: trade  -206 units of delta 1.0\nnet delta  -150.2: trade   150 units of delta 1.0\nnet delta     250: trade    -5 units of delta 50\nnet delta     0.2: trade     0 units of delta 1.0",
        "codeNotes": [
          {
            "line": 2,
            "note": "Negative sign: trade against the exposure. \"or 0\" turns -0 into 0."
          }
        ],
        "tryIt": "Why does 205.5 round up while 204.5 rounds down?",
        "check": {
          "question": "A book has net delta +300. What hedge in shares?",
          "options": [
            "Buy 300",
            "Sell 300",
            "Do nothing"
          ],
          "answer": 1,
          "why": "Positive delta is offset by selling the underlying."
        }
      },
      {
        "title": "Running the engine continuously",
        "say": [
          "A production risk engine recomputes Greeks and limits every time prices move, and full VaR less often (every few minutes or at the end of the day).",
          "Positions stream in from the trading system; prices from market data (Days 10 and 11); results go to traders' screens, limit checks (Day 27) and reports.",
          "Incremental calculation matters: when one trade happens, update only its contribution instead of recomputing the whole book.",
          "Every calculation must be reproducible: store the inputs (positions, prices, model parameters) with each result so any number can be explained later.",
          "When a trader asks why their risk jumped, the stored inputs let you replay the exact calculation and point to the trade or price move that caused it.",
          "The example updates net delta incrementally as three trades arrive, checking it against a full recalculation.",
          "Incremental and full results must always agree; a periodic full recompute catches drift or bugs.",
          "This design, fast incremental updates plus slower full checks, appears in many real-time systems."
        ],
        "example": "A shop keeping a running total at the till, then counting the drawer at closing to make sure the two agree.",
        "code": "book = [(10, 0.6), (-5, 0.3), (200, 1.0)]\nnet = sum(q * d for q, d in book)\nfor trade in [(3, 0.6), (-50, 1.0), (4, 0.3)]:\n    book.append(trade)\n    net += trade[0] * trade[1]                 # incremental update\n    full = sum(q * d for q, d in book)         # full recompute\n    print(f\"after trade {trade}: incremental {net:.2f}  full {full:.2f}  match {abs(net - full) < 1e-9}\")",
        "output": "after trade (3, 0.6): incremental 206.30  full 206.30  match True\nafter trade (-50, 1.0): incremental 156.30  full 156.30  match True\nafter trade (4, 0.3): incremental 157.50  full 157.50  match True",
        "codeNotes": [
          {
            "line": 5,
            "note": "Only the new trade's contribution is added."
          },
          {
            "line": 7,
            "note": "Compare with tolerance because of floating point."
          }
        ],
        "tryIt": "Why compare with a tolerance rather than exact equality?",
        "check": {
          "question": "Why store inputs alongside every risk result?",
          "options": [
            "To use more disk",
            "So any number can be reproduced and explained later",
            "It makes calculations faster"
          ],
          "answer": 1,
          "why": "Reproducibility is essential for audits and debugging."
        }
      },
      {
        "title": "Milestone practice: engine and hedge",
        "say": [
          "Practice 1: risk_engine(positions, pnl_scenarios, confidence=0.99). Compute net_delta and net_vega (rounded to 2), then k, the tail, VaR and ES (rounded to 2) from the scenarios.",
          "The checks use the three-position book (net delta 204.5, net vega 1.5) and 200 scenarios (VaR 80,000 and ES 100,000 at 99 percent; VaR 120,000 at 99.5 percent).",
          "Practice 2: delta_hedge(net_delta, delta_per_unit=1.0). Return -round(net_delta / delta_per_unit), turning -0 into 0.",
          "The checks: 204.5 gives -204 (banker's rounding), -150.2 gives 150, 250 with futures of 50 delta gives -5, and 0.2 gives 0.",
          "Congratulations on Milestone 3: you now have pricing, implied volatility, Greeks, VaR, ES, portfolio metrics and hedging, the core of a quantitative risk system.",
          "The final part of the course turns to finding alpha, routing orders, physical speed, backtesting discipline and safety controls.",
          "The example runs the whole engine: aggregate, compute tail risk, and propose a hedge."
        ],
        "example": "A pilot's pre-flight check: every instrument is read, combined and turned into a single decision.",
        "code": "positions = [(10, 0.6, 0.4), (-5, 0.3, 0.5), (200, 1.0, 0.0)]\npnl = [-120000, -80000, -50000] + [1000] * 197\nnet_delta = round(sum(q * d for q, d, v in positions), 2)\nnet_vega = round(sum(q * v for q, d, v in positions), 2)\nk = max(1, round(0.01 * len(pnl)))\ntail = sorted(pnl)[:k]\nprint({\"net_delta\": net_delta, \"net_vega\": net_vega, \"var\": -tail[-1], \"es\": -sum(tail) / k})\nprint(\"hedge order:\", -round(net_delta) or 0, \"shares\")",
        "output": "{'net_delta': 204.5, 'net_vega': 1.5, 'var': 80000, 'es': 100000.0}\nhedge order: -204 shares",
        "codeNotes": [
          {
            "line": 7,
            "note": "The full risk snapshot."
          },
          {
            "line": 8,
            "note": "Turn net delta into an action."
          }
        ],
        "tryIt": "After the hedge, what is the new net delta? What risk remains?",
        "check": {
          "question": "risk_engine's net_delta for positions (10, 0.6), (-5, 0.3), (200, 1.0) is?",
          "options": [
            "205.5",
            "204.5",
            "210"
          ],
          "answer": 1,
          "why": "6 - 1.5 + 200 = 204.5."
        }
      }
    ],
    "summary": [
      "Greeks aggregate across positions: net = sum of quantity × Greek.",
      "Full scenario revaluation captures non-linear effects that Greeks miss.",
      "VaR and ES come from the tail of scenario P&Ls, with k = round((1 - c) × n).",
      "Delta hedge = -round(net delta / delta per unit); Python rounds halves to even.",
      "Run incremental updates continuously with periodic full recomputes and stored inputs."
    ],
    "projectStep": {
      "title": "Milestone 3: desk risk engine",
      "steps": [
        "Aggregate Greeks for a book of options and stock.",
        "Revalue it under 200 scenarios and report VaR and ES at two confidence levels.",
        "Propose a delta hedge and explain the remaining vega exposure."
      ]
    }
  },
  {
    "day": 22,
    "title": "High-Frequency Alpha Signals & Statistical Arbitrage",
    "goal": "You can explain alpha signals and statistical arbitrage, build a pairs trading signal with z-scores, estimate mean-reversion half-life, and describe how signals decay and get validated.",
    "minutes": 30,
    "recap": "Risk engines tell you what you hold. Alpha signals tell you what to buy or sell. Today you build the classic statistical arbitrage strategy: pairs trading.",
    "parts": [
      {
        "title": "What alpha means",
        "say": [
          "Alpha is return that cannot be explained by simply holding the market. A signal is anything that predicts future price moves better than chance.",
          "High-frequency signals use order book data: imbalance and micro-price (Day 7), trade flow, queue positions, and moves in related instruments.",
          "Statistical arbitrage (stat arb) trades many small, statistically favourable bets that each have a slight edge, relying on the law of large numbers.",
          "Most signals are weak: predicting direction 51 or 52 percent of the time can be very profitable at high volume, but only if costs are lower than the edge.",
          "Signals decay: once many firms find the same pattern, trading on it removes it. Research is a continuous search for new, uncorrelated signals.",
          "The example shows how a small edge adds up over many trades, compared with random noise.",
          "Measuring edge per trade after costs is the honest test of any signal."
        ],
        "example": "A casino: each game has only a small edge for the house, but over millions of bets the result is almost certain.",
        "code": "import random\n\nrandom.seed(11)\nfor win_rate in [0.50, 0.52]:\n    pnl = sum(1 if random.random() < win_rate else -1 for _ in range(100_000))\n    print(f\"win rate {win_rate:.0%}: total over 100,000 trades = {pnl:+,}\")",
        "output": "win rate 50%: total over 100,000 trades = +442\nwin rate 52%: total over 100,000 trades = +3,500",
        "codeNotes": [
          {
            "line": 5,
            "note": "Each trade wins or loses one unit."
          }
        ],
        "tryIt": "If each trade costs 0.05 units in fees, is the 52 percent signal still profitable?",
        "check": {
          "question": "What is statistical arbitrage?",
          "options": [
            "Guaranteed risk-free profit",
            "Many small bets with a slight statistical edge",
            "Buying and holding the market"
          ],
          "answer": 1,
          "why": "Stat arb relies on a small edge repeated many times."
        }
      },
      {
        "title": "Pairs and the spread",
        "say": [
          "Pairs trading picks two related assets, such as two banks, two oil companies, or an ETF and its components, whose prices tend to move together.",
          "Their spread is price_A - beta × price_B, where beta is the hedge ratio estimated from history (often by linear regression).",
          "If the pair is cointegrated, the spread fluctuates around a stable mean instead of wandering off. Temporary gaps are expected to close.",
          "When the spread is unusually wide, sell A and buy beta units of B (short the spread); when unusually narrow, do the opposite (long the spread).",
          "The trade is roughly market neutral: a general market move affects both legs and largely cancels.",
          "The example estimates beta with a simple least-squares formula on two short price series and prints the spread.",
          "Correlation is not enough: two prices can be correlated day to day but drift apart for years. Cointegration tests look for a spread that stays stationary."
        ],
        "example": "Two dogs on one leash: they wander, but never far apart for long. When the gap is wide, bet on it closing.",
        "code": "import statistics\n\na = [101.0, 102.5, 101.8, 103.9, 104.6, 103.2, 105.8, 106.1]\nb = [50.2, 51.0, 50.7, 51.6, 52.1, 51.3, 52.6, 52.9]\nmb, ma = statistics.mean(b), statistics.mean(a)\nbeta = sum((x - mb) * (y - ma) for x, y in zip(b, a)) / sum((x - mb) ** 2 for x in b)\nspread = [round(y - beta * x, 2) for x, y in zip(b, a)]\nprint(\"beta\", round(beta, 3))\nprint(\"spread\", spread)",
        "output": "beta 1.954\nspread [2.93, 2.87, 2.75, 3.1, 2.82, 2.98, 3.04, 2.76]",
        "codeNotes": [
          {
            "line": 6,
            "note": "Least-squares slope of A on B."
          },
          {
            "line": 7,
            "note": "The spread removes the shared movement."
          }
        ],
        "tryIt": "Is the spread steadier than either price series? Compare their ranges.",
        "check": {
          "question": "What does a hedge ratio (beta) do in pairs trading?",
          "options": [
            "Sets the trade size in dollars",
            "Scales B so the spread removes the shared movement",
            "Predicts the market"
          ],
          "answer": 1,
          "why": "Beta balances the two legs."
        }
      },
      {
        "title": "Z-score signals",
        "say": [
          "To decide when a spread is \"unusually\" wide, standardise it: z = (spread - mean) / standard deviation, using statistics from a look-back window.",
          "Typical rules: short the spread when z ≥ 2, go long when z ≤ -2, exit when |z| ≤ 0.5, and hold in between.",
          "Practice 1 is pairs_signal(price_a, price_b, beta, mean, std, entry=2.0, exit_z=0.5), returning the z-score rounded to 4 decimals and one of SHORT_SPREAD, LONG_SPREAD, EXIT or HOLD.",
          "For A = 105, B = 100, beta 1, mean 2 and std 1.2: spread 5, z = 2.5, so SHORT_SPREAD.",
          "The gap between the entry and exit thresholds avoids flipping in and out when z hovers near one level, a form of hysteresis.",
          "The example runs the rule over a sequence of spreads.",
          "Thresholds are parameters to test, not laws; Day 26 shows how tuning them too much creates false confidence."
        ],
        "example": "A thermostat that switches heating on at 18 degrees and off at 21, rather than flicking on and off around one temperature.",
        "code": "def signal(z, entry=2.0, exit_z=0.5):\n    if z >= entry:\n        return \"SHORT_SPREAD\"\n    if z <= -entry:\n        return \"LONG_SPREAD\"\n    return \"EXIT\" if abs(z) <= exit_z else \"HOLD\"\n\nmean, std = 2.0, 1.2\nfor spread in [5.0, 3.5, 2.3, -1.0, -2.0]:\n    z = (spread - mean) / std\n    print(f\"spread {spread:+.1f}  z {z:+.4f}  {signal(z)}\")",
        "output": "spread +5.0  z +2.5000  SHORT_SPREAD\nspread +3.5  z +1.2500  HOLD\nspread +2.3  z +0.2500  EXIT\nspread -1.0  z -2.5000  LONG_SPREAD\nspread -2.0  z -3.3333  LONG_SPREAD",
        "codeNotes": [
          {
            "line": 10,
            "note": "Standardise the spread with the look-back mean and standard deviation."
          }
        ],
        "tryIt": "What signal comes from a spread of -0.4?",
        "check": {
          "question": "A spread z-score of -2.5 with entry 2 gives?",
          "options": [
            "SHORT_SPREAD",
            "LONG_SPREAD",
            "EXIT"
          ],
          "answer": 1,
          "why": "The spread is unusually low, so buy it."
        }
      },
      {
        "title": "Mean reversion speed: half-life",
        "say": [
          "A spread that reverts slowly ties up capital and risk for a long time. How fast it reverts is as important as whether it does.",
          "The Ornstein-Uhlenbeck model describes mean reversion with a speed theta: each period, the gap to the mean shrinks by roughly theta times itself.",
          "The half-life, the time for a gap to halve, is ln(2) / theta. With theta 0.1 per day, the half-life is about 6.93 days.",
          "Practice 2 is half_life(theta), rounded to 4 decimals, raising ValueError when theta ≤ 0 (no reversion).",
          "Traders set holding periods and stop-loss times relative to the half-life: a trade that has not reverted after several half-lives may mean the relationship has broken.",
          "The example simulates a gap decaying at theta 0.1 and confirms it halves in about seven steps.",
          "Theta is usually estimated by regressing the change in the spread on its previous level."
        ],
        "example": "A hot cup of tea cooling towards room temperature: the half-life says how long until it is halfway there.",
        "code": "import math\n\ntheta, gap = 0.1, 10.0\nfor day in range(1, 9):\n    gap -= theta * gap\n    print(f\"day {day}: gap {gap:.3f}\")\nprint(\"half-life ln(2)/theta =\", round(math.log(2) / theta, 4), \"days\")",
        "output": "day 1: gap 9.000\nday 2: gap 8.100\nday 3: gap 7.290\nday 4: gap 6.561\nday 5: gap 5.905\nday 6: gap 5.314\nday 7: gap 4.783\nday 8: gap 4.305\nhalf-life ln(2)/theta = 6.9315 days",
        "codeNotes": [
          {
            "line": 5,
            "note": "Each day the gap shrinks by theta times itself."
          }
        ],
        "tryIt": "The discrete simulation halves slightly before day 7. Why is it a little faster than ln(2) / theta?",
        "check": {
          "question": "With theta = 0.2, the half-life is about?",
          "options": [
            "6.93 days",
            "3.47 days",
            "0.2 days"
          ],
          "answer": 1,
          "why": "ln(2) / 0.2 ≈ 3.47."
        }
      },
      {
        "title": "Validating and combining signals",
        "say": [
          "A signal that looks good on one dataset may be luck. Validation tests it on data it has never seen (out of sample), across different periods and instruments.",
          "The information coefficient (IC), the correlation between the signal and the next return, measures predictive power; even 0.02 to 0.05 can be valuable at high frequency.",
          "Combining several weakly correlated signals improves the overall edge, like diversifying a portfolio (Day 20).",
          "Watch for regime changes: a relationship that held for years can break when a company is acquired, a regulation changes or the market structure shifts.",
          "Every signal must be judged after realistic costs: spreads, fees (Day 23), market impact (Day 6) and latency.",
          "A high IC on ten data points, like the example, proves nothing; real validation uses thousands of observations.",
          "The example computes the information coefficient of a signal against next-period returns.",
          "Keep a research log of every test run; tomorrow's overfitting lesson (Day 26) explains why."
        ],
        "example": "Testing a new medicine on patients who were not in the trial that suggested it works.",
        "code": "import statistics\n\nsignal = [0.5, -0.2, 0.8, -0.6, 0.1, -0.9, 0.4, 0.3, -0.1, 0.7]\nnext_ret = [0.02, -0.01, 0.01, -0.02, 0.0, -0.01, 0.015, -0.005, 0.005, 0.02]\nic = statistics.correlation(signal, next_ret)\nprint(\"information coefficient:\", round(ic, 3))\nprint(\"sign agreement:\", sum((s > 0) == (r > 0) for s, r in zip(signal, next_ret)), \"of\", len(signal))",
        "output": "information coefficient: 0.822\nsign agreement: 7 of 10",
        "codeNotes": [
          {
            "line": 5,
            "note": "Correlation between the signal and what happened next."
          }
        ],
        "tryIt": "Shuffle next_ret randomly and recompute. What IC does a useless signal give?",
        "check": {
          "question": "What does out-of-sample testing guard against?",
          "options": [
            "Slow code",
            "Signals that only worked by luck on the data used to find them",
            "High fees"
          ],
          "answer": 1,
          "why": "Fresh data reveals whether the edge is real."
        }
      },
      {
        "title": "Practice time: pairs and half-life",
        "say": [
          "Practice 1: pairs_signal(price_a, price_b, beta, mean, std, entry=2.0, exit_z=0.5). Compute z = (price_a - beta × price_b - mean) / std, then apply the rules in order: SHORT_SPREAD, LONG_SPREAD, EXIT, otherwise HOLD.",
          "Return {\"z\": round(z, 4), \"signal\": ...}. The checks cover all four signals, including z = -3.3333.",
          "Practice 2: half_life(theta). Raise ValueError for theta ≤ 0; otherwise return round(math.log(2) / theta, 4). The checks: 6.9315 for 0.1, and 1.0 for theta = ln 2.",
          "After passing, simulate a spread with theta 0.2 plus random noise and trade it with your signal. Count trades and total profit.",
          "The example runs a small simulation with a fixed seed.",
          "In real trading, each trade pays costs, and a signal that trades too often can lose money despite being right.",
          "The next lesson decides where to send those orders."
        ],
        "example": "Practising a new board game against a computer before playing for real money.",
        "code": "import random\n\nrandom.seed(3)\nspread, position, pnl, trades = 0.0, 0, 0.0, 0\nfor _ in range(500):\n    old = spread\n    spread += -0.2 * spread + random.gauss(0, 1)\n    pnl += position * (spread - old)\n    z = spread / 2.2\n    target = -1 if z >= 2 else 1 if z <= -2 else 0 if abs(z) <= 0.5 else position\n    trades += target != position\n    position = target\nprint(\"trades:\", trades, \"| profit:\", round(pnl, 2))",
        "output": "trades: 6 | profit: 12.24",
        "codeNotes": [
          {
            "line": 7,
            "note": "Mean reversion with theta 0.2 plus noise."
          },
          {
            "line": 10,
            "note": "The pairs rules as a target position."
          }
        ],
        "tryIt": "Subtract 0.3 per trade in costs. Is the strategy still profitable?",
        "check": {
          "question": "pairs_signal returns EXIT when?",
          "options": [
            "z is above 2",
            "|z| is at most the exit threshold",
            "z is exactly 0 only"
          ],
          "answer": 1,
          "why": "Close to the mean, the trade is closed."
        }
      }
    ],
    "summary": [
      "Alpha signals predict price moves; stat arb profits from many small edges after costs.",
      "Pairs trading uses the spread A - beta × B of cointegrated assets.",
      "Z-score rules: short at z ≥ 2, long at z ≤ -2, exit near zero, hold in between.",
      "Half-life = ln(2) / theta measures how fast the spread reverts.",
      "Validate out of sample, measure IC, combine signals and account for costs."
    ],
    "projectStep": {
      "title": "Pairs trading study",
      "steps": [
        "Estimate beta and the spread for two related price series.",
        "Generate z-score signals and estimate the half-life.",
        "Simulate trading with costs and report trades, profit and hit rate."
      ]
    }
  },
  {
    "day": 23,
    "title": "Smart Order Routing (SOR) & Best Execution Algorithms",
    "goal": "You can explain market fragmentation and best execution, route orders across venues by all-in price including fees and rebates, and describe dark pools and the maker-taker model.",
    "minutes": 30,
    "recap": "Yesterday your signal decided what to trade. Today you decide where: modern markets split each stock across many venues, each with different prices, sizes and fees.",
    "parts": [
      {
        "title": "Fragmented markets",
        "say": [
          "A single stock can trade on many venues: in the US there are over a dozen exchanges plus dozens of dark pools and internalisers; in India, the NSE and BSE both list most large stocks.",
          "Each venue has its own order book, so the best price may be on one venue while the most shares are on another.",
          "Prices on different venues are usually within a tick of each other, because arbitrage traders instantly exploit any gap; the differences that remain are in size, fees and speed.",
          "The consolidated best bid and offer across venues (the NBBO in the US, from Day 1) is what brokers must consider when executing.",
          "Rules such as Reg NMS in the US protect displayed prices: a venue cannot execute at a worse price when a better one is displayed elsewhere.",
          "Best execution obliges brokers to seek the most favourable terms for clients, considering price, costs, speed and likelihood of execution.",
          "The example builds a consolidated view of the best offer from three venues.",
          "Fragmentation creates both a challenge (finding liquidity) and an opportunity (price differences between venues)."
        ],
        "example": "Shopping for a TV across several shops: the cheapest shop might only have two in stock.",
        "code": "venues = {\"NSE\": (100.00, 300), \"BSE\": (100.00, 200), \"DARK\": (99.995, 100)}\nbest_price = min(price for price, size in venues.values())\nat_best = [name for name, (price, size) in venues.items() if price == best_price]\nprint(\"best offer:\", best_price, \"at\", at_best)\nprint(\"total shares offered:\", sum(size for price, size in venues.values()))",
        "output": "best offer: 99.995 at ['DARK']\ntotal shares offered: 600",
        "codeNotes": [
          {
            "line": 2,
            "note": "The consolidated best offer across venues."
          }
        ],
        "tryIt": "If you want 500 shares, can you buy them all at the best price?",
        "check": {
          "question": "What does best execution require?",
          "options": [
            "Always using one exchange",
            "Seeking the most favourable terms, considering price, cost, speed and likelihood of fill",
            "Trading as fast as possible"
          ],
          "answer": 1,
          "why": "It is a duty to consider the full picture for the client."
        }
      },
      {
        "title": "Fees, rebates and the maker-taker model",
        "say": [
          "Many exchanges charge traders who remove liquidity (takers, with marketable orders) and pay a rebate to those who provide it (makers, with resting limit orders).",
          "Typical US fees are around 0.3 cents per share to take and 0.2 cents rebate to make; some \"inverted\" venues do the opposite.",
          "Fees change the true cost of a trade: buying at 100.00 with a 0.003 fee costs 100.003 per share; at 100.00 with a 0.001 rebate it costs 99.999.",
          "Practice 2 is net_fee(shares, fee_per_share), returning the amount rounded to cents and whether it is a FEE, a REBATE or NONE.",
          "Fees add up: 10,000 shares at 0.3 cents is $30, which can exceed the profit of a high-frequency strategy.",
          "India uses a different model: exchanges charge transaction fees to both sides, plus taxes like the securities transaction tax, so there are no maker rebates, but the same all-in thinking applies.",
          "The example compares the all-in price of the same order on three venues.",
          "Routers rank venues by all-in price (price plus fee), not the quoted price alone."
        ],
        "example": "Two petrol stations with the same pump price, but one gives a loyalty discount: the true price differs.",
        "code": "venues = [(\"NSE\", 100.00, 0.003), (\"BSE\", 100.00, -0.001), (\"DARK\", 99.995, 0.001)]\nfor name, price, fee in venues:\n    kind = \"fee\" if fee > 0 else \"rebate\"\n    print(f\"{name:4} quote {price:.3f}  {kind} {abs(fee):.3f}  all-in {price + fee:.3f}\")\nprint(\"cost of 10,000 shares in fees on NSE: $\", round(10000 * 0.003, 2))",
        "output": "NSE  quote 100.000  fee 0.003  all-in 100.003\nBSE  quote 100.000  rebate 0.001  all-in 99.999\nDARK quote 99.995  fee 0.001  all-in 99.996\ncost of 10,000 shares in fees on NSE: $ 30.0",
        "codeNotes": [
          {
            "line": 4,
            "note": "The all-in price is what the router compares."
          }
        ],
        "tryIt": "Which venue is cheapest per share for a buyer, all-in?",
        "check": {
          "question": "In the maker-taker model, who usually receives a rebate?",
          "options": [
            "The taker",
            "The maker who posts liquidity",
            "The exchange"
          ],
          "answer": 1,
          "why": "Providers of resting liquidity are rewarded."
        }
      },
      {
        "title": "The smart order router",
        "say": [
          "A smart order router (SOR) splits an order across venues to achieve the best overall execution.",
          "The simplest good strategy for a buy order: sort venues by all-in price (price + fee), ties broken by name for determinism, then take as much as possible from each in turn until the order is filled.",
          "Practice 1 is route_buy(qty, venues), returning the fills per venue, any unfilled quantity, and the average all-in cost.",
          "In the practice's three venues, the router takes 100 from DARK (all-in 99.996), then 200 from BSE (99.999), then 200 from NSE (100.003), for an average of about 100.0.",
          "If there is not enough liquidity, the router reports the unfilled quantity instead of pretending the order was filled.",
          "The example runs the routing logic step by step.",
          "Real routers also consider fill probability, latency to each venue and hidden liquidity."
        ],
        "example": "Filling a shopping list by visiting shops in order of cheapest price, buying as much as each shop has.",
        "code": "venues = [(\"NSE\", 100.00, 0.003, 300), (\"BSE\", 100.00, -0.001, 200), (\"DARK\", 99.995, 0.001, 100)]\nleft, cost = 500, 0.0\nfor name, price, fee, size in sorted(venues, key=lambda v: (v[1] + v[2], v[0])):\n    take = min(left, size)\n    if take:\n        cost += (price + fee) * take\n        left -= take\n        print(f\"take {take:3} from {name:4} at all-in {price + fee:.3f}\")\nprint(\"unfilled\", left, \"| average all-in cost\", round(cost / (500 - left), 4))",
        "output": "take 100 from DARK at all-in 99.996\ntake 200 from BSE  at all-in 99.999\ntake 200 from NSE  at all-in 100.003\nunfilled 0 | average all-in cost 100.0",
        "codeNotes": [
          {
            "line": 3,
            "note": "Cheapest all-in first; the name breaks ties."
          },
          {
            "line": 4,
            "note": "Take what this venue has, up to what is left."
          }
        ],
        "tryIt": "Route 700 shares instead. What is unfilled?",
        "check": {
          "question": "How does the simple router rank venues for a buy?",
          "options": [
            "By size",
            "By price plus fee, lowest first",
            "Alphabetically"
          ],
          "answer": 1,
          "why": "All-in cost is the key for best execution."
        }
      },
      {
        "title": "Dark pools and hidden liquidity",
        "say": [
          "Dark pools are venues that do not display their order books. Orders are matched, often at the midpoint of the public best bid and offer, and only reported after execution.",
          "Large institutional investors use them to avoid revealing big orders that would move the price (Day 6 market impact).",
          "The trade-off: no guarantee of a fill, and the risk of trading against better-informed or faster counterparties.",
          "Exchanges also offer hidden and iceberg orders, which show only part of their size.",
          "Routers often \"ping\" dark pools first with small orders to discover hidden liquidity before sending the rest to lit markets.",
          "The example shows the midpoint price saving compared with crossing the spread on a lit venue.",
          "Regulators watch dark pools closely because too much dark trading can weaken public price discovery."
        ],
        "example": "A private sale arranged through an agent instead of a public auction: you avoid attention, but might not find a buyer.",
        "code": "bid, ask, shares = 99.98, 100.02, 5000\nmid = round((bid + ask) / 2, 4)\nlit_cost = ask * shares\ndark_cost = mid * shares\nprint(\"midpoint:\", mid)\nprint(\"saving from a dark midpoint fill: $\", round(lit_cost - dark_cost, 2))",
        "output": "midpoint: 100.0\nsaving from a dark midpoint fill: $ 100.0",
        "codeNotes": [
          {
            "line": 2,
            "note": "Dark pools often match at the midpoint."
          }
        ],
        "tryIt": "Who \"loses\" the half spread that the buyer saves in the dark pool?",
        "check": {
          "question": "Why do large investors use dark pools?",
          "options": [
            "They are always cheaper",
            "To avoid revealing large orders that would move the price",
            "They are faster"
          ],
          "answer": 1,
          "why": "Hiding size reduces market impact."
        }
      },
      {
        "title": "Measuring execution quality",
        "say": [
          "Transaction cost analysis (TCA) measures how well orders were executed after the fact.",
          "Implementation shortfall compares the average execution price with the price when the decision was made (the arrival price). It includes spread, impact, fees and delay.",
          "Other benchmarks are VWAP (Day 4) and the midpoint at arrival.",
          "Venue analysis compares fill rates, price improvement and adverse selection by venue, feeding back into how the router ranks them.",
          "Results are expressed in basis points (hundredths of a percent) so different stocks and sizes can be compared.",
          "A basis point is 0.01 percent: on a $10 million order, each basis point of shortfall costs $1,000.",
          "The example computes implementation shortfall for a buy order against its arrival price.",
          "You cannot improve what you do not measure; TCA closes the loop for the router."
        ],
        "example": "A delivery company tracking every parcel's actual arrival time against its promised time.",
        "code": "arrival = 99.99\nfills = [(100, 99.996), (200, 99.999), (200, 100.003)]\nshares = sum(q for q, p in fills)\navg = sum(q * p for q, p in fills) / shares\nshortfall_bps = (avg - arrival) / arrival * 10000\nprint(\"average price\", round(avg, 4), \"| shortfall\", round(shortfall_bps, 3), \"bps\")",
        "output": "average price 100.0 | shortfall 1.0 bps",
        "codeNotes": [
          {
            "line": 5,
            "note": "Positive shortfall means the buy cost more than the arrival price."
          }
        ],
        "tryIt": "What would the shortfall be if the order had been sent before the price moved, at an arrival price of 100.00?",
        "check": {
          "question": "What does implementation shortfall compare?",
          "options": [
            "Two venues",
            "The average execution price against the price when the decision was made",
            "Fees against rebates"
          ],
          "answer": 1,
          "why": "It measures total execution cost against the arrival price."
        }
      },
      {
        "title": "Practice time: route and account",
        "say": [
          "Practice 1: route_buy(qty, venues). Sort venues by (price + fee, name); for each, take min(left, size), record (name, take) if positive, add (price + fee) × take to the cost, and stop when nothing is left.",
          "Return fills, unfilled and avg_cost rounded to 4 decimals (0.0 when nothing filled). The checks: a full 500-share fill averaging 100.0, a 1,000-share order with 400 unfilled, and no venues at all.",
          "Practice 2: net_fee(shares, fee_per_share). Round shares × fee to 2 decimals; label FEE if positive, REBATE if negative, NONE if zero.",
          "The checks: 10,000 shares at 0.003 is a $30 FEE; at -0.002 a $20 REBATE; a free venue gives NONE.",
          "After passing, add a sell-side router that sorts by price minus fee, highest first.",
          "The example sketches the sell ranking.",
          "Tomorrow, the physical distance to each venue joins the picture: speed of light and colocation."
        ],
        "example": "Selling at a market: you look for the stall that pays the most after its commission.",
        "code": "bids = [(\"NSE\", 99.99, 0.003), (\"BSE\", 99.985, -0.002), (\"DARK\", 99.99, 0.001)]\nfor name, price, fee in sorted(bids, key=lambda v: (-(v[1] - v[2]), v[0])):\n    print(f\"{name:4} bid {price:.3f}  net received {price - fee:.3f}\")",
        "output": "DARK bid 99.990  net received 99.989\nBSE  bid 99.985  net received 99.987\nNSE  bid 99.990  net received 99.987",
        "codeNotes": [
          {
            "line": 2,
            "note": "For a sell, the best venue pays the most after fees."
          }
        ],
        "tryIt": "Why does a rebate increase what the seller receives?",
        "check": {
          "question": "net_fee(10000, -0.002) returns?",
          "options": [
            "{\"amount\": 20.0, \"kind\": \"FEE\"}",
            "{\"amount\": -20.0, \"kind\": \"REBATE\"}",
            "{\"amount\": 0, \"kind\": \"NONE\"}"
          ],
          "answer": 1,
          "why": "A negative fee is a rebate paid to you."
        }
      }
    ],
    "summary": [
      "Stocks trade on many venues; best execution weighs price, cost, speed and fill likelihood.",
      "Maker-taker pricing charges takers and rebates makers; compare all-in prices.",
      "A smart order router fills from the cheapest all-in venue first and reports any unfilled size.",
      "Dark pools hide orders and often match at the midpoint, reducing impact but risking no fill.",
      "Transaction cost analysis measures shortfall against the arrival price in basis points."
    ],
    "projectStep": {
      "title": "Order routing lab",
      "steps": [
        "Implement route_buy and net_fee.",
        "Route orders of three sizes across four venues and report average all-in cost.",
        "Compute implementation shortfall and suggest a routing improvement."
      ]
    }
  },
  {
    "day": 24,
    "title": "Exchange Colocation & Cross-Connect Physics",
    "goal": "You can calculate signal propagation delays in fibre and air, explain colocation and cross-connects, compare fibre with microwave routes, and reason about why physical distance sets a floor on latency.",
    "minutes": 30,
    "recap": "Software optimisation (Days 11 to 15) squeezed microseconds out of your servers. But no code can beat physics: the time it takes light to travel between you and the exchange.",
    "parts": [
      {
        "title": "The speed of light in fibre",
        "say": [
          "Light in a vacuum travels at 299,792,458 metres per second, about 3.34 nanoseconds per metre.",
          "In optical fibre it is slower, because glass has a refractive index of about 1.468: light travels at c / 1.468, roughly two-thirds of its vacuum speed.",
          "That is about 4.9 nanoseconds per metre, or 4.9 microseconds per kilometre, or 4.9 milliseconds per 1,000 km.",
          "A handy rule of thumb: every metre of cable costs about 5 nanoseconds, which is why engineers measure cable lengths as carefully as code.",
          "Practice 1 is fibre_latency(meters, n=1.4682), returning the one-way and round-trip delay in nanoseconds.",
          "Round trip matters because a trading decision often needs data to arrive and an order to go back.",
          "The example prints delays for a rack cable, a data centre cross-connect, and a city-to-city link.",
          "These numbers are hard physical limits; no software can reduce them."
        ],
        "example": "Running through a swimming pool instead of along the side: the same distance, but the water slows you down.",
        "code": "C = 299_792_458\ndef one_way_ns(meters, n=1.4682):\n    return meters * n / C * 1e9\n\nfor label, meters in [(\"rack cable\", 2), (\"cross-connect\", 100), (\"Mumbai to Pune (fibre)\", 150_000)]:\n    print(f\"{label:24} {one_way_ns(meters):14,.2f} ns one way\")",
        "output": "rack cable                         9.79 ns one way\ncross-connect                    489.74 ns one way\nMumbai to Pune (fibre)       734,608.21 ns one way",
        "codeNotes": [
          {
            "line": 3,
            "note": "Distance times refractive index divided by the speed of light."
          }
        ],
        "tryIt": "How many nanoseconds does 1 extra metre of fibre add to a round trip?",
        "check": {
          "question": "Roughly how long does light take to travel 1 km of fibre?",
          "options": [
            "4.9 nanoseconds",
            "4.9 microseconds",
            "4.9 milliseconds"
          ],
          "answer": 1,
          "why": "About 4.9 ns per metre, so 4.9 µs per kilometre."
        }
      },
      {
        "title": "Colocation",
        "say": [
          "Colocation means renting space for your servers inside the exchange's own data centre, as close as possible to its matching engine.",
          "Distance from the matching engine shrinks from kilometres to metres, cutting fibre delay from microseconds to hundreds of nanoseconds.",
          "Exchanges sell colocation racks, power and network connections, and it is a major source of their revenue.",
          "To be fair, many exchanges equalise cable lengths: every colocated customer gets the same length of fibre, even if their rack is nearer, so no one gains from rack placement.",
          "Colocation also improves reliability and gives access to direct market data feeds (Day 10).",
          "Some exchanges run several data centres, so firms must decide where their servers sit relative to each matching engine and to the other venues they trade on.",
          "The example compares the round-trip delay from an office 20 km away with a colocated rack using an equalised 100 m cable.",
          "Colocation is now table stakes for any latency-sensitive strategy."
        ],
        "example": "Opening a shop inside the train station instead of down the road, so travellers reach you first.",
        "code": "C = 299_792_458\nrt_us = lambda meters: 2 * meters * 1.4682 / C * 1e6\noffice, colo = 20_000, 100\nprint(f\"office 20 km away: {rt_us(office):8.2f} µs round trip\")\nprint(f\"colocated, 100 m : {rt_us(colo):8.2f} µs round trip\")\nprint(f\"advantage        : {rt_us(office) - rt_us(colo):8.2f} µs\")",
        "output": "office 20 km away:   195.90 µs round trip\ncolocated, 100 m :     0.98 µs round trip\nadvantage        :   194.92 µs",
        "codeNotes": [
          {
            "line": 2,
            "note": "Round trip in microseconds."
          }
        ],
        "tryIt": "Compare that advantage with the whole tick-to-trade budget from Day 15.",
        "check": {
          "question": "Why do exchanges equalise cable lengths in colocation?",
          "options": [
            "To save money",
            "So no colocated customer gains an unfair advantage from rack placement",
            "Longer cables are faster"
          ],
          "answer": 1,
          "why": "Equal lengths keep the playing field level."
        }
      },
      {
        "title": "Cross-connects and network design",
        "say": [
          "A cross-connect is a direct physical cable between your equipment and another party's in the same data centre: the exchange, a market data provider or a broker.",
          "Every switch, router or converter along the path adds delay, from tens of nanoseconds for specialised low-latency switches to microseconds for ordinary ones.",
          "Latency-sensitive firms flatten their networks, use layer 1 switches (which simply replicate signals) and keep cables as short as possible.",
          "The total path latency is the sum of cable delays and device delays; engineers budget every hop.",
          "Direct cross-connects to each exchange avoid shared networks whose delays vary with other traffic.",
          "Even converting the signal between electrical and optical form costs nanoseconds, so the fastest designs minimise conversions as well as distance.",
          "The example adds up a path through a cable, a layer 1 switch, another cable and the exchange handoff.",
          "Just as with software, you optimise the biggest term first."
        ],
        "example": "A direct private corridor between two offices, instead of walking through the public lobby and the lifts.",
        "code": "C = 299_792_458\nfibre_ns = lambda m: m * 1.4682 / C * 1e9\npath = [(\"cable to switch\", fibre_ns(10)), (\"layer 1 switch\", 5.0),\n        (\"cable to exchange cage\", fibre_ns(90)), (\"exchange handoff\", 150.0)]\nfor hop, ns in path:\n    print(f\"{hop:24} {ns:7.1f} ns\")\nprint(f\"{'total one way':24} {sum(ns for _, ns in path):7.1f} ns\")",
        "output": "cable to switch             49.0 ns\nlayer 1 switch               5.0 ns\ncable to exchange cage     440.8 ns\nexchange handoff           150.0 ns\ntotal one way              644.7 ns",
        "codeNotes": [
          {
            "line": 3,
            "note": "Mix cable delays with device delays."
          }
        ],
        "tryIt": "Replace the layer 1 switch with an ordinary switch at 800 ns. Which term dominates now?",
        "check": {
          "question": "What does a cross-connect provide?",
          "options": [
            "A wireless link",
            "A direct cable to another party in the same data centre",
            "A software library"
          ],
          "answer": 1,
          "why": "It is a physical point-to-point connection."
        }
      },
      {
        "title": "Fibre versus air",
        "say": [
          "Radio waves in air travel at nearly the speed of light in a vacuum (air's refractive index is about 1.0003), about 47 percent faster than light in fibre.",
          "Fibre routes also rarely go in straight lines; they follow roads and railways, adding perhaps 10 percent or more to the distance.",
          "Practice 2 is microwave_advantage(distance_km, fibre_route_factor=1.1), comparing fibre (longer route, n = 1.4682) with microwave (straight line, n = 1.0003) in microseconds.",
          "Between Chicago and New Jersey (about 1,180 km), fibre takes about 6,357 µs one way and microwave about 3,937 µs, a saving of about 2.4 milliseconds.",
          "For strategies that trade the same product in two cities, that saving is decisive: the faster firm sees and acts on price changes first.",
          "For example, futures trade in Chicago while the related stocks trade in New Jersey; a price move in one city is news to traders in the other, and whoever hears it first can trade on it.",
          "The example reproduces the calculation.",
          "Even perfectly straight fibre would lose; physics favours air."
        ],
        "example": "A crow flying straight over the hills versus a car winding along the valley roads.",
        "code": "C = 299_792_458\nus = lambda meters, n: meters * n / C * 1e6\nd = 1180 * 1000\nfibre = us(d * 1.1, 1.4682)\nstraight_fibre = us(d, 1.4682)\nmicro = us(d, 1.0003)\nprint(f\"fibre (10% longer route): {fibre:9.3f} µs\")\nprint(f\"fibre (perfectly straight): {straight_fibre:7.3f} µs\")\nprint(f\"microwave                : {micro:9.3f} µs\")",
        "output": "fibre (10% longer route):  6356.810 µs\nfibre (perfectly straight): 5778.918 µs\nmicrowave                :  3937.237 µs",
        "codeNotes": [
          {
            "line": 4,
            "note": "Longer route and slower medium."
          },
          {
            "line": 6,
            "note": "Straight line through air."
          }
        ],
        "tryIt": "What fibre route factor would make fibre as fast as microwave? Is that possible?",
        "check": {
          "question": "Why is microwave faster than fibre over long distances?",
          "options": [
            "Microwave carries more data",
            "Radio in air travels near vacuum light speed and takes straighter paths",
            "Fibre is always broken"
          ],
          "answer": 1,
          "why": "Both the medium and the route favour microwave."
        }
      },
      {
        "title": "The latency arms race and its limits",
        "say": [
          "In 2010, Spread Networks spent hundreds of millions of dollars on a straighter fibre between Chicago and New Jersey, cutting a few milliseconds. Within a few years, microwave networks beat it.",
          "Firms now compete on tower locations, antenna design and even the speed of electronics at each relay (Day 25).",
          "Geography sets a hard floor: the straight-line distance divided by the speed of light. Racing towards that floor gives smaller and smaller gains at higher and higher costs.",
          "Some exchanges introduced speed bumps, deliberate delays of a few hundred microseconds (like IEX's 350 µs coil of fibre), to reduce the advantage of the fastest traders.",
          "Whether latency competition helps markets (tighter spreads) or harms them (an expensive arms race) is still debated.",
          "The example prints the theoretical floor for a few city pairs.",
          "Understanding the floor tells you when further investment cannot pay off."
        ],
        "example": "A sprint where the world record is getting close to what the human body can physically do: each new hundredth of a second costs more.",
        "code": "C = 299_792_458\npairs = {\"Chicago - New Jersey\": 1180, \"London - Frankfurt\": 640, \"New York - London\": 5570}\nfor name, km in pairs.items():\n    floor_us = km * 1000 / C * 1e6\n    print(f\"{name:22} vacuum floor {floor_us:8.1f} µs one way\")",
        "output": "Chicago - New Jersey   vacuum floor   3936.1 µs one way\nLondon - Frankfurt     vacuum floor   2134.8 µs one way\nNew York - London      vacuum floor  18579.5 µs one way",
        "codeNotes": [
          {
            "line": 4,
            "note": "Nothing can be faster than light in a vacuum along a straight line."
          }
        ],
        "tryIt": "Why is New York to London much harder to speed up with microwave?",
        "check": {
          "question": "What is an exchange speed bump?",
          "options": [
            "A faster network",
            "A deliberate small delay applied to orders to reduce the advantage of the fastest traders",
            "A fee"
          ],
          "answer": 1,
          "why": "For example, IEX's 350 µs coil."
        }
      },
      {
        "title": "Practice time: physics calculators",
        "say": [
          "Practice 1: fibre_latency(meters, n=1.4682). One-way ns = meters × n / C × 1e9; return the one-way and round-trip values rounded to 2 decimals.",
          "The checks: 1 metre (4.9 ns one way, 9.79 round trip), 100 metres (489.74 ns) and 1,000 km (4,897,388.05 ns).",
          "Practice 2: microwave_advantage(distance_km, fibre_route_factor=1.1). Compute fibre and microwave microseconds with the formulas above, rounded to 3 decimals, plus the saving.",
          "The checks use 1,180 km (fibre 6,356.81, microwave 3,937.237, saved 2,419.573) and straight fibre (still over 1,800 µs saved).",
          "Note the round trip is rounded separately from the one-way value: 9.79 rather than 2 × 4.9, because the unrounded one-way value is 4.897.",
          "After passing, compute the saving for London to Frankfurt.",
          "The example shows why rounding order matters."
        ],
        "example": "Measuring twice and cutting once: round only at the end, or small errors double.",
        "code": "C = 299_792_458\none_way = 1 * 1.4682 / C * 1e9\nprint(\"unrounded one way:\", round(one_way, 6))\nprint(\"round then double:\", round(round(one_way, 2) * 2, 2))\nprint(\"double then round:\", round(one_way * 2, 2))",
        "output": "unrounded one way: 4.897388\nround then double: 9.8\ndouble then round: 9.79",
        "codeNotes": [
          {
            "line": 4,
            "note": "Rounding first loses precision."
          },
          {
            "line": 5,
            "note": "The practice rounds each output from the unrounded value."
          }
        ],
        "tryIt": "For 1,000 metres, do the two approaches still differ?",
        "check": {
          "question": "fibre_latency(1)[\"round_trip_ns\"] is?",
          "options": [
            "9.8",
            "9.79",
            "4.9"
          ],
          "answer": 1,
          "why": "Round trip is computed from the unrounded one-way value: 9.794 rounds to 9.79."
        }
      }
    ],
    "summary": [
      "Light in fibre takes about 4.9 ns per metre (n ≈ 1.468).",
      "Colocation places servers metres from the matching engine; cable lengths are often equalised.",
      "Cross-connects and flat networks minimise device and cable delays along the path.",
      "Microwave through air is about 47 percent faster and takes straighter routes than fibre.",
      "The straight-line vacuum light time is a hard floor; speed bumps deliberately slow the race."
    ],
    "projectStep": {
      "title": "Latency geography",
      "steps": [
        "Compute fibre and microwave latencies between three pairs of financial centres.",
        "Budget a colocated path including cables and switches.",
        "Estimate how close each route could get to the vacuum floor."
      ]
    }
  },
  {
    "day": 25,
    "title": "Microwave, Millimeter-Wave & Shortwave Radio Trading Networks",
    "goal": "You can explain how microwave and millimetre-wave trading networks work, compute link latency with relay delays, plan tower counts, handle rain fade, and describe shortwave radio for intercontinental links.",
    "minutes": 30,
    "recap": "Yesterday showed that air beats fibre. Today you look at how firms actually build those radio networks, and why weather becomes a trading risk.",
    "parts": [
      {
        "title": "Line of sight and towers",
        "say": [
          "Microwave links need line of sight: the antennas at each end must see each other, with no hills, buildings or even the curve of the Earth in between.",
          "Because the Earth curves, practical hop lengths are limited to about 50 to 70 km depending on tower heights and terrain.",
          "A long route is a chain of hops with relay towers between them. Each relay receives, regenerates and retransmits the signal.",
          "The number of relays is the number of hops minus one: ceil(distance / max hop) - 1.",
          "Tower paths are also bent by practical limits: towers can only be built where land can be leased and permits granted, so real routes zig-zag a little around the straight line.",
          "Practice 2 is towers_needed(distance_km, max_hop_km=50). Chicago to New Jersey at 1,180 km with 50 km hops needs 24 hops and 23 relay towers.",
          "The example computes the Earth's curvature bulge in the middle of a hop to show why towers must be tall.",
          "Building and leasing tower sites is expensive, and the best locations are fiercely contested."
        ],
        "example": "Passing a message along a line of hilltop bonfires: each fire must be visible from the next.",
        "code": "R = 6_371_000\nfor hop_km in [30, 50, 70]:\n    d = hop_km * 1000 / 2\n    bulge = d * d / (2 * R)\n    print(f\"{hop_km} km hop: the Earth bulges about {bulge:.0f} m at the midpoint\")",
        "output": "30 km hop: the Earth bulges about 18 m at the midpoint\n50 km hop: the Earth bulges about 49 m at the midpoint\n70 km hop: the Earth bulges about 96 m at the midpoint",
        "codeNotes": [
          {
            "line": 4,
            "note": "Approximate height of the Earth's curve over half the hop."
          }
        ],
        "tryIt": "Why do longer hops need much taller towers?",
        "check": {
          "question": "How many relay towers are needed for 3 hops?",
          "options": [
            "3",
            "2",
            "4"
          ],
          "answer": 1,
          "why": "Relays sit between hops: hops - 1."
        }
      },
      {
        "title": "Link latency",
        "say": [
          "Total microwave latency = propagation delay through the air + the delay at each relay.",
          "Propagation: distance × 1.0003 / c. For 1,180 km that is about 3,937 µs.",
          "Relay delay depends on the radio equipment: modern low-latency radios add a few hundred nanoseconds each; older ones added microseconds.",
          "With 20 relays at 300 ns each, relays add 6 µs, so the total is about 3,943 µs.",
          "Practice 1 is microwave_link(distance_km, towers, hop_ns, rain_mm_h, rain_limit=25.0), which returns latency in whole nanoseconds and a status.",
          "The example splits the total into air and relay components.",
          "Firms race to shave relay delays, since propagation is already near its physical floor.",
          "Some relays simply amplify the signal without fully decoding it, saving time but letting noise build up along the chain; others decode and clean the signal at each hop."
        ],
        "example": "A relay race where the running is already as fast as possible, so the team practises baton handovers.",
        "code": "C = 299_792_458\ndistance_km, towers, hop_ns = 1180, 20, 300\nair_ns = distance_km * 1000 * 1.0003 / C * 1e9\nrelay_ns = towers * hop_ns\nprint(f\"air: {air_ns:,.0f} ns | relays: {relay_ns:,} ns | total: {air_ns + relay_ns:,.0f} ns\")",
        "output": "air: 3,937,237 ns | relays: 6,000 ns | total: 3,943,237 ns",
        "codeNotes": [
          {
            "line": 3,
            "note": "Propagation through the air."
          },
          {
            "line": 4,
            "note": "Each relay adds its own delay."
          }
        ],
        "tryIt": "How many 300 ns relays add as much delay as 1 km of extra path?",
        "check": {
          "question": "What makes up total microwave link latency?",
          "options": [
            "Only distance",
            "Propagation through the air plus the delay at each relay",
            "Only the number of towers"
          ],
          "answer": 1,
          "why": "Both terms add up."
        }
      },
      {
        "title": "Rain fade and availability",
        "say": [
          "Microwave signals are absorbed and scattered by rain, a problem called rain fade. The higher the frequency, the worse it gets.",
          "Light rain barely matters; heavy rain degrades the signal (more errors, lower bandwidth); a storm can take the link down completely.",
          "The practice models this with thresholds: below 60 percent of the rain limit the link is UP, between 60 percent and the limit it is DEGRADED, and at or above the limit it is DOWN with no latency.",
          "When the microwave link fails, traffic falls back to fibre, which is always slower. On stormy days the speed advantage can vanish for hours.",
          "Firms study weather radar and even trade differently during storms; some route over several paths and use whichever is up.",
          "The example classifies a day's rain readings.",
          "Availability (the percentage of time the link is up) is a key metric alongside latency.",
          "A trading system must detect a failing link within microseconds and switch paths automatically, because a stalled link during a storm can mean trading on stale prices."
        ],
        "example": "A scenic mountain road that is the fastest route in good weather but closes in storms, sending everyone back to the long motorway.",
        "code": "rain_limit = 25.0\ndef status(rain):\n    if rain >= rain_limit:\n        return \"DOWN\"\n    return \"UP\" if rain < rain_limit * 0.6 else \"DEGRADED\"\n\nreadings = [0.0, 2.0, 8.0, 16.0, 22.0, 30.0, 12.0]\nstates = [status(r) for r in readings]\nprint(list(zip(readings, states)))\nprint(f\"availability: {sum(s != 'DOWN' for s in states) / len(states):.0%}\")",
        "output": "[(0.0, 'UP'), (2.0, 'UP'), (8.0, 'UP'), (16.0, 'DEGRADED'), (22.0, 'DEGRADED'), (30.0, 'DOWN'), (12.0, 'UP')]\navailability: 86%",
        "codeNotes": [
          {
            "line": 5,
            "note": "Degraded between 60 percent of the limit and the limit."
          }
        ],
        "tryIt": "If the link is down, how much slower is the fibre fallback for 1,180 km?",
        "check": {
          "question": "What is rain fade?",
          "options": [
            "Rain cooling the equipment",
            "Rain absorbing and scattering microwave signals",
            "A trading strategy"
          ],
          "answer": 1,
          "why": "Heavy rain weakens radio signals."
        }
      },
      {
        "title": "Millimetre wave and laser links",
        "say": [
          "Millimetre-wave radios (roughly 60 to 90 GHz) carry much more bandwidth than traditional microwave, but suffer even more from rain and have shorter ranges.",
          "Free-space optical (laser) links also travel at nearly vacuum speed but are blocked by fog.",
          "Firms mix technologies: traditional microwave for reliability on long routes, millimetre wave or lasers for short, high-bandwidth hops, and fibre as the backup.",
          "Bandwidth matters because full market data feeds are large; microwave networks often carry only the most important, compressed subset of data.",
          "The trade-off is always speed versus bandwidth versus reliability.",
          "The example compares options for a short hop using a simple scoring of latency, bandwidth and weather risk.",
          "Choosing the right mix is an engineering decision, not a single right answer."
        ],
        "example": "Choosing between a motorbike, a van and a train for deliveries: fast, big or reliable, but rarely all three.",
        "code": "options = {\n    \"microwave (6-11 GHz)\": {\"bandwidth_mbps\": 150, \"rain_sensitivity\": 1},\n    \"millimetre wave (80 GHz)\": {\"bandwidth_mbps\": 10000, \"rain_sensitivity\": 3},\n    \"laser\": {\"bandwidth_mbps\": 10000, \"rain_sensitivity\": 2},\n    \"fibre\": {\"bandwidth_mbps\": 100000, \"rain_sensitivity\": 0},\n}\nfor name, o in options.items():\n    print(f\"{name:26} bandwidth {o['bandwidth_mbps']:>7,} Mbps  weather risk {'*' * o['rain_sensitivity'] or 'none'}\")",
        "output": "microwave (6-11 GHz)       bandwidth     150 Mbps  weather risk *\nmillimetre wave (80 GHz)   bandwidth  10,000 Mbps  weather risk ***\nlaser                      bandwidth  10,000 Mbps  weather risk **\nfibre                      bandwidth 100,000 Mbps  weather risk none",
        "codeNotes": [
          {
            "line": 8,
            "note": "A simple visual score for weather risk."
          }
        ],
        "tryIt": "Which would you pick for a critical 5 km hop carrying only trade signals?",
        "check": {
          "question": "Why do microwave trading networks often carry only part of the market data?",
          "options": [
            "It is illegal to send everything",
            "Their bandwidth is limited compared with fibre",
            "Exchanges forbid it"
          ],
          "answer": 1,
          "why": "Low bandwidth forces careful selection of what to send."
        }
      },
      {
        "title": "Shortwave across oceans",
        "say": [
          "Microwave cannot cross oceans: there is nowhere to put towers. Undersea fibre is the default between continents.",
          "Shortwave (high frequency, 3 to 30 MHz) radio bounces off the ionosphere, a layer of the upper atmosphere, and can travel thousands of kilometres in a few hops.",
          "It follows a nearly straight great-circle path at nearly the speed of light, so between Chicago and Europe it can beat undersea fibre by many milliseconds.",
          "But bandwidth is tiny (a few kilobits per second) and conditions change with time of day, season and solar activity, so it only carries tiny, urgent messages such as \"buy now\".",
          "This shows how far firms go: any physical path that is even slightly faster can be worth millions of dollars.",
          "The example compares a fibre route with a shortwave path for a transatlantic link.",
          "Physics, geography and even space weather have become part of trading infrastructure."
        ],
        "example": "Shouting a single word across a canyon instead of walking round to deliver a letter: fast, but you cannot say much.",
        "code": "C = 299_792_458\ngreat_circle_km = 6_000\nfibre_ms = great_circle_km * 1.1 * 1000 * 1.4682 / C * 1e3\nshortwave_ms = great_circle_km * 1.05 * 1000 / C * 1e3\nprint(f\"undersea fibre (10% longer route): {fibre_ms:5.2f} ms\")\nprint(f\"shortwave (5% longer path)       : {shortwave_ms:5.2f} ms\")\nprint(f\"saving: {fibre_ms - shortwave_ms:.2f} ms\")",
        "output": "undersea fibre (10% longer route): 32.32 ms\nshortwave (5% longer path)       : 21.01 ms\nsaving: 11.31 ms",
        "codeNotes": [
          {
            "line": 3,
            "note": "Fibre follows the seabed and is slower in glass."
          },
          {
            "line": 4,
            "note": "Sky-wave bounces add a little distance."
          }
        ],
        "tryIt": "With only a few kilobits per second, how many 20-byte messages per second can the link carry?",
        "check": {
          "question": "Why is shortwave used for only tiny messages?",
          "options": [
            "It is too slow",
            "Its bandwidth is very low and conditions vary",
            "It is only legal at night"
          ],
          "answer": 1,
          "why": "Fast but narrow and unreliable."
        }
      },
      {
        "title": "Practice time: link and towers",
        "say": [
          "Practice 1: microwave_link(distance_km, towers, hop_ns, rain_mm_h, rain_limit=25.0). If rain ≥ limit, return latency None and status DOWN.",
          "Otherwise latency = round(propagation ns + towers × hop_ns), and status UP if rain < 60 percent of the limit, else DEGRADED.",
          "The checks: 1,180 km with 20 relays at 300 ns in light rain gives 3,943,237 ns and UP; 20 mm/h is DEGRADED; 40 mm/h is DOWN.",
          "Practice 2: towers_needed(distance_km, max_hop_km=50) returns max(0, ceil(distance / max hop) - 1): 23 for 1,180 km, 0 for 50 km, 1 for 51 km, 16 with 70 km hops.",
          "After passing, compare the latency of a route with 23 relays at 300 ns against one with 16 relays at 800 ns.",
          "The example makes that comparison.",
          "Tomorrow the course turns from speed to honesty: how to test strategies without fooling yourself."
        ],
        "example": "Comparing two bus routes: one with more stops but faster boarding, the other with fewer, slower stops.",
        "code": "C = 299_792_458\nair = 1180 * 1000 * 1.0003 / C * 1e9\nfor relays, per_relay in [(23, 300), (16, 800)]:\n    print(f\"{relays} relays at {per_relay} ns: {round(air + relays * per_relay):,} ns\")",
        "output": "23 relays at 300 ns: 3,944,137 ns\n16 relays at 800 ns: 3,950,037 ns",
        "codeNotes": [
          {
            "line": 4,
            "note": "Same air path; different relay costs."
          }
        ],
        "tryIt": "At what relay delay would the 16-tower route match the 23-tower route?",
        "check": {
          "question": "towers_needed(51) returns?",
          "options": [
            "0",
            "1",
            "2"
          ],
          "answer": 1,
          "why": "51 km needs 2 hops, so 1 relay."
        }
      }
    ],
    "summary": [
      "Microwave needs line of sight; hops of 50 to 70 km are chained with relays (hops - 1).",
      "Link latency = air propagation + relays × relay delay.",
      "Rain fade degrades or breaks links; fibre is the fallback and availability matters.",
      "Millimetre wave and lasers trade range and weather resilience for bandwidth.",
      "Shortwave crosses oceans faster than fibre but carries only tiny messages."
    ],
    "projectStep": {
      "title": "Radio network plan",
      "steps": [
        "Plan towers and compute latency for a 600 km route with two relay technologies.",
        "Model availability over a month of rain readings.",
        "Compare the best-case radio route with the fibre fallback."
      ]
    }
  },
  {
    "day": 26,
    "title": "Backtesting Pitfalls: Lookahead Bias & Overfitting Elimination",
    "goal": "You can recognise and prevent lookahead bias, survivorship bias and overfitting in backtests, audit decisions for future data, and haircut Sharpe ratios for multiple testing.",
    "minutes": 30,
    "recap": "Day 22 produced a profitable-looking pairs strategy. Before real money goes near it, you must prove the backtest is honest. Most backtests are not.",
    "parts": [
      {
        "title": "Why backtests lie",
        "say": [
          "A backtest replays history to estimate how a strategy would have performed. It is essential, but it is also the easiest place in finance to fool yourself.",
          "Common sins include using information that was not available at the time, testing only on companies that survived, ignoring costs, and trying so many ideas that one looks good by chance.",
          "Each of these makes results look better than reality. Researchers have found that a large share of published trading strategies fail once these biases are removed.",
          "The danger is not only lost money: a false backtest also wastes months of engineering effort building infrastructure for a strategy that never had an edge.",
          "The discipline of honest backtesting separates professional quant firms from hobbyists: every result is assumed wrong until carefully checked.",
          "This lesson covers lookahead bias, survivorship bias and overfitting, plus two practice tools: a lookahead auditor and a Sharpe ratio haircut.",
          "The example shows how a strategy that \"knows\" tomorrow's return looks brilliant in a backtest, even with random data.",
          "If a backtest looks too good to be true, it almost certainly is."
        ],
        "example": "Marking your own exam with the answer sheet open: the score looks great and means nothing.",
        "code": "import random\n\nrandom.seed(5)\nreturns = [random.gauss(0, 0.01) for _ in range(250)]\nhonest = sum(r for i, r in enumerate(returns[1:]) if returns[i] > 0)      # uses yesterday\ncheating = sum(r for r in returns if r > 0)                                # uses today\nprint(\"honest strategy total return:  \", round(honest, 4))\nprint(\"lookahead strategy total return:\", round(cheating, 4))",
        "output": "honest strategy total return:   0.0179\nlookahead strategy total return: 1.0471",
        "codeNotes": [
          {
            "line": 5,
            "note": "Decide from yesterday's return, then earn today's."
          },
          {
            "line": 6,
            "note": "Peeks at today's return before deciding."
          }
        ],
        "tryIt": "Why is the cheating strategy's result guaranteed to be positive?",
        "check": {
          "question": "What is the safest attitude towards an impressive backtest?",
          "options": [
            "Trade it immediately",
            "Assume it is wrong until every bias has been checked",
            "Double the position size"
          ],
          "answer": 1,
          "why": "Most great-looking backtests contain a flaw."
        }
      },
      {
        "title": "Lookahead bias",
        "say": [
          "Lookahead bias means using data at a decision time that was not yet known at that time.",
          "Classic examples: using the day's closing price to decide a trade at the open, using financial data before its publication date, or using revised data instead of what was first reported.",
          "Subtle versions include normalising with statistics computed over the whole dataset (including the future), or a bug that shifts a time series by one row.",
          "The rule is simple: every piece of data used for a decision must have a timestamp at or before the decision time.",
          "Practice 1 is lookahead_audit(decisions): each decision has an id, a decided_at time and the data_times it used; report every decision that used data from after its decision time.",
          "Data exactly at the decision time is allowed in the practice, representing information that has just arrived.",
          "The example shows the whole-dataset normalisation mistake and its fix, using only past data."
        ],
        "example": "Betting on a horse race after hearing the result on the radio.",
        "code": "import statistics\n\nprices = [100, 102, 101, 105, 110, 120]\nfull_mean = statistics.mean(prices)                              # uses the future\nprint(\"biased z of day 3:\", round((prices[2] - full_mean) / statistics.stdev(prices), 3))\npast = prices[:3]                                                # only days 1 to 3\nprint(\"honest z of day 3:\", round((prices[2] - statistics.mean(past)) / statistics.stdev(past), 3))",
        "output": "biased z of day 3: -0.701\nhonest z of day 3: 0.0",
        "codeNotes": [
          {
            "line": 4,
            "note": "The mean includes later prices that were unknown on day 3."
          },
          {
            "line": 6,
            "note": "Only data up to the decision."
          }
        ],
        "tryIt": "Why does the biased version make day 3 look cheap?",
        "check": {
          "question": "Which of these is lookahead bias?",
          "options": [
            "Using yesterday's close to trade today",
            "Using today's close to decide a trade at today's open",
            "Using last year's data"
          ],
          "answer": 1,
          "why": "The close is not known at the open."
        }
      },
      {
        "title": "Survivorship bias",
        "say": [
          "Survivorship bias comes from testing only on assets that still exist today, ignoring those that were delisted, went bankrupt or were acquired.",
          "A backtest of \"buy the stocks in today's index\" over the past 20 years silently excludes all the companies that failed, which inflates returns.",
          "The fix is point-in-time data: for each historical date, use the universe of assets as it was on that date, including those that later disappeared.",
          "Delisted companies must also carry their final returns, often large losses, rather than simply vanishing from the data on their last trading day.",
          "The same idea applies to strategies: reports of successful funds ignore the many funds that closed after poor results.",
          "Point-in-time data is expensive and fiddly, which is exactly why careless research skips it.",
          "The example compares the average return of a universe with and without its failed members.",
          "Always ask of any dataset: what is missing, and why is it missing?"
        ],
        "example": "Studying only the planes that returned from missions to decide where to add armour, and ignoring the ones that were shot down.",
        "code": "companies = {\"A\": 0.12, \"B\": 0.08, \"C\": 0.15, \"D (bankrupt)\": -1.0, \"E (delisted)\": -0.6}\nsurvivors = {k: v for k, v in companies.items() if \"(\" not in k}\navg = lambda d: sum(d.values()) / len(d)\nprint(f\"survivors only: {avg(survivors):+.1%}\")\nprint(f\"full universe : {avg(companies):+.1%}\")",
        "output": "survivors only: +11.7%\nfull universe : -25.0%",
        "codeNotes": [
          {
            "line": 2,
            "note": "Dropping the failures is the bias."
          }
        ],
        "tryIt": "Why might today's index members look like brilliant picks in hindsight?",
        "check": {
          "question": "How do you avoid survivorship bias?",
          "options": [
            "Use only today's stocks",
            "Use point-in-time data including assets that later disappeared",
            "Use more years of data"
          ],
          "answer": 1,
          "why": "The historical universe must include the failures."
        }
      },
      {
        "title": "Overfitting and multiple testing",
        "say": [
          "Overfitting means tuning a strategy so closely to past data that it captures noise rather than a real pattern. It then fails on new data.",
          "The more parameters you tweak and the more variants you test, the more likely it is that the best result is luck.",
          "If you test 100 random strategies with no edge, the best one will still show an impressive Sharpe ratio purely by chance.",
          "A simple correction haircuts the observed Sharpe by the expected best-of-N luck: haircut = observed - sr_std × √(2 ln N).",
          "Practice 2 is haircut_sharpe(observed, trials, sr_std=0.5). An observed 1.8 after 100 trials shrinks to 0.2826; a 1.2 after 1,000 trials becomes negative.",
          "More rigorous methods, like the deflated Sharpe ratio by Bailey and López de Prado, follow the same logic with more detail.",
          "The example tests 100 strategies of pure noise and reports the best Sharpe ratio found."
        ],
        "example": "Flipping 100 coins ten times each: one of them will probably land heads eight or more times, but it is not a magic coin.",
        "code": "import math\nimport random\nimport statistics\n\nrandom.seed(9)\nbest = 0.0\nfor _ in range(100):\n    daily = [random.gauss(0, 0.01) for _ in range(250)]\n    sharpe = statistics.mean(daily) / statistics.stdev(daily) * math.sqrt(250)\n    best = max(best, sharpe)\nprint(\"best Sharpe from 100 strategies with no edge:\", round(best, 2))",
        "output": "best Sharpe from 100 strategies with no edge: 2.18",
        "codeNotes": [
          {
            "line": 8,
            "note": "Pure noise: no strategy has any real edge."
          },
          {
            "line": 9,
            "note": "Annualised Sharpe ratio."
          }
        ],
        "tryIt": "How does the best Sharpe change if you test 1,000 strategies instead?",
        "check": {
          "question": "Why does testing many strategy variants call for a haircut?",
          "options": [
            "More tests cost more money",
            "The best of many random results looks good by chance",
            "Sharpe ratios are always too low"
          ],
          "answer": 1,
          "why": "Selection among many trials inflates the winner."
        }
      },
      {
        "title": "Honest research practice",
        "say": [
          "Split data into training, validation and a final test set that is touched only once, at the very end.",
          "Walk-forward testing repeatedly trains on a past window and tests on the next period, mimicking how the strategy would really be used.",
          "Include realistic costs: spreads, fees, market impact and latency. Many high-frequency strategies vanish once queue position and delay are modelled.",
          "Record every experiment, including failures, so the number of trials used in the Sharpe haircut is honest.",
          "Prefer simple strategies with an economic explanation; complicated ones with no story are more likely to be fitted noise.",
          "The example builds walk-forward windows over a year of data.",
          "Finally, paper trade or trade tiny sizes live before scaling up: reality is the only test that cannot be fitted."
        ],
        "example": "A pilot trains in a simulator, then flies with an instructor, and only then flies alone.",
        "code": "days, train, test = 250, 120, 30\nstart = 0\nwhile start + train + test <= days:\n    print(f\"train days {start:3}-{start + train - 1:3} | test days {start + train:3}-{start + train + test - 1:3}\")\n    start += test",
        "output": "train days   0-119 | test days 120-149\ntrain days  30-149 | test days 150-179\ntrain days  60-179 | test days 180-209\ntrain days  90-209 | test days 210-239",
        "codeNotes": [
          {
            "line": 5,
            "note": "Slide forward by one test period each time."
          }
        ],
        "tryIt": "Why must the test window always come after the training window?",
        "check": {
          "question": "What is walk-forward testing?",
          "options": [
            "Testing on the training data",
            "Repeatedly training on a past window and testing on the following period",
            "Walking between desks"
          ],
          "answer": 1,
          "why": "It mimics real-time use of the strategy."
        }
      },
      {
        "title": "Practice time: audit and haircut",
        "say": [
          "Practice 1: lookahead_audit(decisions). A decision is bad if any of its data_times is greater than decided_at. Return clean (True when none are bad) and the sorted list of bad ids.",
          "The checks include a decision using data exactly at the decision time (allowed), and bad ids given out of order, which must come back sorted.",
          "Practice 2: haircut_sharpe(observed, trials, sr_std=0.5). Return observed unchanged when trials ≤ 1; otherwise subtract sr_std × √(2 ln trials) and round to 4 decimals.",
          "After passing, compute how many trials it takes before a Sharpe of 2.0 is no longer convincing.",
          "The example prints the haircut table for several observed Sharpe ratios and trial counts.",
          "Keep these tools in every research project; they are cheap insurance against expensive mistakes.",
          "Tomorrow adds the last line of defence: live risk controls that stop bad orders even when the research was wrong."
        ],
        "example": "A referee checking the video replay before a goal is allowed to stand.",
        "code": "import math\n\ndef haircut(sr, n, s=0.5):\n    return sr if n <= 1 else round(sr - s * math.sqrt(2 * math.log(n)), 2)\n\nprint(\"observed   1 trial  10 trials  100 trials  1000 trials\")\nfor sr in [1.0, 1.5, 2.0, 3.0]:\n    print(f\"{sr:8} {haircut(sr, 1):8} {haircut(sr, 10):10} {haircut(sr, 100):11} {haircut(sr, 1000):12}\")",
        "output": "observed   1 trial  10 trials  100 trials  1000 trials\n     1.0      1.0      -0.07       -0.52        -0.86\n     1.5      1.5       0.43       -0.02        -0.36\n     2.0      2.0       0.93        0.48         0.14\n     3.0      3.0       1.93        1.48         1.14",
        "codeNotes": [
          {
            "line": 4,
            "note": "The expected luck of the best of n trials is subtracted."
          }
        ],
        "tryIt": "A colleague reports a Sharpe of 1.5 after \"a few hundred\" backtests. What do you tell them?",
        "check": {
          "question": "lookahead_audit flags a decision when?",
          "options": [
            "Any data time equals the decision time",
            "Any data time is after the decision time",
            "It uses more than two data points"
          ],
          "answer": 1,
          "why": "Only strictly later data is lookahead."
        }
      }
    ],
    "summary": [
      "Backtests are easily biased; treat good results as suspect until checked.",
      "Lookahead bias uses data not yet known at the decision time.",
      "Survivorship bias ignores assets that failed; use point-in-time universes.",
      "Testing many variants inflates the best result; haircut Sharpe by sr_std × √(2 ln N).",
      "Use walk-forward tests, realistic costs, full experiment logs and small live trials."
    ],
    "projectStep": {
      "title": "Backtest integrity review",
      "steps": [
        "Audit a set of decisions for lookahead bias.",
        "Recompute a strategy's return including delisted assets.",
        "Haircut its Sharpe ratio for the number of variants you tried and write a verdict."
      ]
    }
  },
  {
    "day": 27,
    "title": "Pre-Trade Risk Controls & Fat-Finger Circuit Breakers",
    "goal": "You can design pre-trade risk checks for order size, notional and price collars, implement a daily notional kill switch, and explain why automated controls are mandatory in electronic trading.",
    "minutes": 30,
    "recap": "Yesterday protected you from bad research. Today protects the market and your firm from bad orders: a single faulty message can lose millions in seconds.",
    "parts": [
      {
        "title": "Lessons from disasters",
        "say": [
          "On 1 August 2012, Knight Capital deployed software in which old, unused code was accidentally reactivated on one server. In 45 minutes it sent millions of unintended orders and lost about $440 million.",
          "Fat-finger errors, such as typing an extra zero or entering a price in the wrong field, have caused flash crashes and huge losses around the world.",
          "These events share a pattern: automated systems act much faster than humans can react, so safeguards must also be automated.",
          "Regulators responded with rules such as the US Market Access Rule (SEC 15c3-5), which requires brokers to apply pre-trade risk controls to every order.",
          "India's SEBI and exchanges similarly require brokers to apply order-level checks and approve every algorithm before it can trade.",
          "Exchanges also add their own limits, price bands and circuit breakers that halt trading when prices move too far, too fast.",
          "The example estimates how quickly losses can grow when a system sends bad orders at machine speed.",
          "Risk controls are not bureaucracy; they are what keeps a firm alive."
        ],
        "example": "Guard rails on a mountain road: most drivers never touch them, but they save the ones who make a mistake.",
        "code": "orders_per_second = 1000\nloss_per_order = 15.0\nfor seconds in [1, 10, 60, 45 * 60]:\n    loss = orders_per_second * loss_per_order * seconds\n    print(f\"after {seconds:5} s: loss ${loss:,.0f}\")",
        "output": "after     1 s: loss $15,000\nafter    10 s: loss $150,000\nafter    60 s: loss $900,000\nafter  2700 s: loss $40,500,000",
        "codeNotes": [
          {
            "line": 4,
            "note": "Machine-speed mistakes compound in seconds."
          }
        ],
        "tryIt": "How quickly must a kill switch act to keep losses under $100,000 in this example?",
        "check": {
          "question": "Why must trading safeguards be automated?",
          "options": [
            "Humans are not allowed to watch",
            "Algorithms act far faster than humans can react",
            "It is cheaper"
          ],
          "answer": 1,
          "why": "Losses accumulate in seconds, before a person could intervene."
        }
      },
      {
        "title": "Order-level checks",
        "say": [
          "Pre-trade checks run on every order before it leaves the firm. They must be fast (Day 15 budgeted about 250 ns) and must never be skipped.",
          "A maximum quantity check stops orders with an extra zero; a maximum notional check (quantity × price) stops orders that are too large in money terms.",
          "A price collar rejects limit prices too far from the current market, for example more than 5 percent from the mid-price, catching typos like 10.0 instead of 100.0.",
          "Practice 1 is pre_trade_check(order, limits, mid): return approved and a list of reasons, checking MAX_QTY, MAX_NOTIONAL and PRICE_COLLAR in that order.",
          "Reporting all failed reasons, not just the first, helps operators understand exactly what went wrong.",
          "The example runs three orders through the checks: a normal one, a fat finger and a typo.",
          "Other checks include restricted instruments, short-sale rules, duplicate order detection and credit limits."
        ],
        "example": "A bank teller who asks for confirmation when someone tries to withdraw ten times their usual amount.",
        "code": "limits = {\"max_qty\": 5000, \"max_notional\": 250000, \"collar_pct\": 5}\ndef check(qty, price, mid=100.0):\n    reasons = []\n    if qty > limits[\"max_qty\"]:\n        reasons.append(\"MAX_QTY\")\n    if qty * price > limits[\"max_notional\"]:\n        reasons.append(\"MAX_NOTIONAL\")\n    if abs(price - mid) / mid * 100 > limits[\"collar_pct\"]:\n        reasons.append(\"PRICE_COLLAR\")\n    return reasons or [\"APPROVED\"]\n\nfor qty, price in [(1000, 101.0), (50000, 100.0), (100, 10.0)]:\n    print(qty, price, check(qty, price))",
        "output": "1000 101.0 ['APPROVED']\n50000 100.0 ['MAX_QTY', 'MAX_NOTIONAL']\n100 10.0 ['PRICE_COLLAR']",
        "codeNotes": [
          {
            "line": 8,
            "note": "Percentage distance from the mid-price."
          }
        ],
        "tryIt": "Which check would catch an order for 3,000 shares at 100 if max_notional were 250,000?",
        "check": {
          "question": "What does a price collar protect against?",
          "options": [
            "Too many orders",
            "Limit prices far from the current market, often typos",
            "Slow networks"
          ],
          "answer": 1,
          "why": "It rejects prices outside a band around the market."
        }
      },
      {
        "title": "Aggregate limits and kill switches",
        "say": [
          "Order-level checks miss problems that build up across many small orders, like Knight Capital's flood of individually normal orders.",
          "Aggregate limits track totals: daily notional traded, open position, number of orders per second, and running losses.",
          "A kill switch stops all trading, and often cancels all open orders, when an aggregate limit is breached. It can be triggered automatically or by a human pressing a button.",
          "Practice 2 is kill_switch_index(orders, daily_cap): add up quantity × price and return the index of the first order that pushes the total strictly above the cap, or None.",
          "An order that takes the total exactly to the cap is still allowed; the next one that exceeds it trips the switch.",
          "The example tracks the running notional and shows where the switch trips.",
          "Once tripped, restarting should require a human decision; automatic restarts could repeat the problem."
        ],
        "example": "The main circuit breaker in a house: individual sockets may be fine, but when the total load is too high, everything switches off.",
        "code": "orders = [(100, 500.0), (200, 400.0), (50, 1000.0), (10, 10.0)]\ncap, total = 150_000, 0.0\nfor i, (qty, price) in enumerate(orders):\n    total += qty * price\n    tripped = total > cap\n    print(f\"order {i}: running notional {total:>9,.0f}\" + (\" -> KILL SWITCH\" if tripped else \"\"))\n    if tripped:\n        break",
        "output": "order 0: running notional    50,000\norder 1: running notional   130,000\norder 2: running notional   180,000 -> KILL SWITCH",
        "codeNotes": [
          {
            "line": 5,
            "note": "Strictly above the cap trips the switch."
          }
        ],
        "tryIt": "With a cap of 180,000, which order trips the switch?",
        "check": {
          "question": "Why should a kill switch require a human to restart trading?",
          "options": [
            "Humans are faster",
            "An automatic restart could repeat the same fault",
            "It is cheaper"
          ],
          "answer": 1,
          "why": "Someone must understand the problem before trading resumes."
        }
      },
      {
        "title": "Where the checks live",
        "say": [
          "Risk checks can run in several layers: inside the strategy, in a separate risk gateway, at the broker, and at the exchange. Defence in depth means more than one layer.",
          "The strategy's own checks are fastest but share its bugs. An independent risk gateway, written and tested separately, catches faults in the strategy itself.",
          "Checks in the latency-critical path must be extremely fast; firms implement them in optimised C++ or even FPGAs (Day 29).",
          "The limits themselves must be managed carefully: who can change them, with what approval, and with every change logged.",
          "Monitoring dashboards show limit usage in real time (Day 19's traffic lights), with alerts before limits are reached.",
          "The example sends an order through two independent layers, each able to reject it.",
          "Never let a performance target justify removing a safety check."
        ],
        "example": "A building with sprinklers in each room, fire doors in each corridor and a fire brigade on call: several independent protections.",
        "code": "def strategy_check(order):\n    return order[\"qty\"] <= 10_000\n\ndef gateway_check(order):\n    return order[\"qty\"] * order[\"price\"] <= 250_000\n\nfor order in [{\"qty\": 2000, \"price\": 100.0}, {\"qty\": 9000, \"price\": 100.0}, {\"qty\": 20000, \"price\": 1.0}]:\n    layers = {\"strategy\": strategy_check(order), \"gateway\": gateway_check(order)}\n    print(order, layers, \"SENT\" if all(layers.values()) else \"BLOCKED\")",
        "output": "{'qty': 2000, 'price': 100.0} {'strategy': True, 'gateway': True} SENT\n{'qty': 9000, 'price': 100.0} {'strategy': True, 'gateway': False} BLOCKED\n{'qty': 20000, 'price': 1.0} {'strategy': False, 'gateway': True} BLOCKED",
        "codeNotes": [
          {
            "line": 8,
            "note": "Each independent layer can stop the order."
          }
        ],
        "tryIt": "Which order is caught only by the gateway? Which only by the strategy?",
        "check": {
          "question": "Why add an independent risk gateway when the strategy already checks orders?",
          "options": [
            "To slow things down",
            "It catches faults inside the strategy's own code",
            "Exchanges require two copies"
          ],
          "answer": 1,
          "why": "Independent checks do not share the strategy's bugs."
        }
      },
      {
        "title": "Testing the safety net",
        "say": [
          "Risk controls that are never tested may fail when needed. Test them as seriously as the strategy.",
          "Unit tests cover each rule at, just below and just above its limit, the boundary cases where bugs hide.",
          "Fire drills trigger the kill switch in test environments regularly to confirm that orders are really cancelled and trading really stops.",
          "Chaos tests inject faults: duplicated messages, stuck prices, a strategy that sends orders in a loop, to see whether the controls catch them.",
          "Post-incident reviews study near misses as well as real losses, and feed new checks back into the system.",
          "The example tests a notional limit at the boundary values.",
          "Knight Capital's failure was partly a deployment and testing failure; process matters as much as code."
        ],
        "example": "Pressing the test button on a smoke alarm every month instead of waiting for a fire to find out if it works.",
        "code": "cap = 250_000\ndef allowed(notional):\n    return notional <= cap\n\nfor notional in [cap - 1, cap, cap + 1]:\n    print(f\"notional {notional:,}: {'allowed' if allowed(notional) else 'rejected'}\")",
        "output": "notional 249,999: allowed\nnotional 250,000: allowed\nnotional 250,001: rejected",
        "codeNotes": [
          {
            "line": 5,
            "note": "Test just below, exactly at and just above the limit."
          }
        ],
        "tryIt": "Change <= to < in allowed. Which boundary test would catch the change?",
        "check": {
          "question": "What is the point of chaos testing risk controls?",
          "options": [
            "To make the code faster",
            "To check that controls catch deliberately injected faults",
            "To confuse traders"
          ],
          "answer": 1,
          "why": "It proves the safety net works under failure."
        }
      },
      {
        "title": "Practice time: gate and switch",
        "say": [
          "Practice 1: pre_trade_check(order, limits, mid). Build a reasons list: MAX_QTY if qty > max_qty, MAX_NOTIONAL if qty × price > max_notional, PRICE_COLLAR if the percentage distance from mid is above collar_pct.",
          "Return approved (True when there are no reasons) and the reasons in that order. The checks: a normal order, a fat finger with two reasons, and a typo caught by the collar.",
          "Practice 2: kill_switch_index(orders, daily_cap). Keep a running total of quantity × price; return the first index where the total exceeds the cap, or None if it never does.",
          "The checks: caps of 150,000 (index 2), 180,000 (index 3, since equality is allowed), 10 million (None) and 1,000 (index 0).",
          "After passing, add a maximum orders-per-second check using a sliding one-second window of timestamps.",
          "The example sketches that rate limiter.",
          "Tomorrow applies all of this to a market that never closes and trades with high leverage: crypto derivatives."
        ],
        "example": "A turnstile that lets only so many people through per minute, however hard the crowd pushes.",
        "code": "from collections import deque\n\ndef rate_limiter(timestamps_ms, max_per_second):\n    window, decisions = deque(), []\n    for t in timestamps_ms:\n        while window and window[0] <= t - 1000:\n            window.popleft()\n        ok = len(window) < max_per_second\n        if ok:\n            window.append(t)\n        decisions.append(ok)\n    return decisions\n\nprint(rate_limiter([0, 100, 200, 300, 900, 1100, 1250], 3))",
        "output": "[True, True, True, False, False, True, True]",
        "codeNotes": [
          {
            "line": 6,
            "note": "Drop timestamps older than one second."
          },
          {
            "line": 8,
            "note": "Allow only if the window has room."
          }
        ],
        "tryIt": "Why are rejected orders not added to the window?",
        "check": {
          "question": "kill_switch_index returns which index when the running total first goes above the cap?",
          "options": [
            "The index before it",
            "The index of the order that pushed it above the cap",
            "The last index"
          ],
          "answer": 1,
          "why": "That order is the one that breaks the limit."
        }
      }
    ],
    "summary": [
      "Automated trading failures (Knight Capital) show that safeguards must be automated too.",
      "Order checks: maximum quantity, maximum notional and price collars, reporting every reason.",
      "Aggregate limits and kill switches stop floods of individually normal orders.",
      "Use independent layers of checks and control who can change limits.",
      "Test controls at their boundaries, with fire drills and injected faults."
    ],
    "projectStep": {
      "title": "Risk gate",
      "steps": [
        "Implement pre_trade_check and kill_switch_index.",
        "Add a rate limiter and a restricted-symbols list.",
        "Write boundary tests for every limit and run a simulated runaway strategy through the gate."
      ]
    }
  },
  {
    "day": 28,
    "title": "Crypto Derivatives: Perpetual Futures & Funding Rate Arbitrage",
    "goal": "You can explain perpetual futures and funding rates, compute funding payments and annualised rates, calculate liquidation prices under leverage, and describe funding rate arbitrage and its risks.",
    "minutes": 30,
    "recap": "The course so far used traditional markets. Crypto markets trade around the clock, with extreme leverage and a unique product: the perpetual future. The same quantitative tools apply, with new twists.",
    "parts": [
      {
        "title": "Perpetual futures",
        "say": [
          "A normal future has an expiry date; on that date it settles, so its price converges to the spot price.",
          "A perpetual future (perp) never expires. It was popularised by the BitMEX exchange in 2016 and is now the most traded crypto product.",
          "Without expiry, something else must keep the perp price close to the spot price. That mechanism is the funding rate.",
          "Traders use perps to go long or short with leverage, to hedge spot holdings, and to earn funding in arbitrage strategies.",
          "Crypto exchanges run continuously, 24 hours a day and 7 days a week, so risk systems, kill switches and on-call engineers must too.",
          "The example shows the basis, the gap between the perp and spot prices, which funding pushes towards zero.",
          "The mechanics are simple, but the leverage makes the risks severe."
        ],
        "example": "A rental agreement with no end date, where each side pays the other a small fee every few hours to keep the rent close to the market rate.",
        "code": "spot = [60000, 60150, 59900, 60300]\nperp = [60120, 60240, 59950, 60310]\nfor s, p in zip(spot, perp):\n    basis_pct = (p - s) / s * 100\n    print(f\"spot {s}  perp {p}  basis {basis_pct:+.3f}%\")",
        "output": "spot 60000  perp 60120  basis +0.200%\nspot 60150  perp 60240  basis +0.150%\nspot 59900  perp 59950  basis +0.083%\nspot 60300  perp 60310  basis +0.017%",
        "codeNotes": [
          {
            "line": 4,
            "note": "Positive basis: the perp trades above spot."
          }
        ],
        "tryIt": "When the perp trades above spot, which side should pay funding to push it back down?",
        "check": {
          "question": "What keeps a perpetual future close to the spot price?",
          "options": [
            "Its expiry date",
            "The funding rate paid between longs and shorts",
            "The exchange sets the price"
          ],
          "answer": 1,
          "why": "Funding replaces convergence at expiry."
        }
      },
      {
        "title": "Funding payments",
        "say": [
          "Every funding interval, commonly every 8 hours (three times a day), longs and shorts exchange a payment of notional × funding rate.",
          "When the rate is positive (perp above spot), longs pay shorts; when negative, shorts pay longs. The exchange just passes money between traders.",
          "A rate of 0.01 percent per 8 hours sounds tiny, but it is 0.03 percent per day and about 10.95 percent per year.",
          "Practice 1 is funding(notional, rate_8h_pct, periods, side=\"LONG\"): the payment from the trader's point of view (negative means paying) and the annualised percentage.",
          "During euphoric markets, funding rates can reach 0.1 percent per 8 hours or more, over 100 percent a year, a heavy cost for leveraged longs.",
          "The example computes a day of funding for a long and a short and annualises the rate.",
          "Funding makes holding a perp position costly or profitable over time, which is what attracts arbitrage traders."
        ],
        "example": "A seesaw where whichever side is heavier pays a small fee to the other side until it balances.",
        "code": "def funding(notional, rate_8h_pct, periods, side=\"LONG\"):\n    amount = notional * rate_8h_pct / 100 * periods\n    payment = -amount if side == \"LONG\" else amount\n    return round(payment, 2) + 0.0, round(rate_8h_pct * 3 * 365, 2)\n\nprint(\"long, one day at 0.01%:\", funding(100000, 0.01, 3))\nprint(\"short, one day at 0.01%:\", funding(100000, 0.01, 3, \"SHORT\"))\nprint(\"long, negative funding:\", funding(50000, -0.02, 1))",
        "output": "long, one day at 0.01%: (-30.0, 10.95)\nshort, one day at 0.01%: (30.0, 10.95)\nlong, negative funding: (10.0, -21.9)",
        "codeNotes": [
          {
            "line": 3,
            "note": "Longs pay when the rate is positive."
          },
          {
            "line": 4,
            "note": "Three periods per day, 365 days per year; + 0.0 tidies -0.0."
          }
        ],
        "tryIt": "What does a long pay over 30 days at 0.05 percent per 8 hours on $100,000?",
        "check": {
          "question": "With a positive funding rate, who pays?",
          "options": [
            "Shorts pay longs",
            "Longs pay shorts",
            "The exchange pays both"
          ],
          "answer": 1,
          "why": "Positive funding means the perp is rich, so longs pay."
        }
      },
      {
        "title": "Leverage and margin",
        "say": [
          "Crypto exchanges let traders control positions far larger than their deposit: 10x leverage means $10,000 of margin controls $100,000 of exposure.",
          "The initial margin is 1 / leverage of the position. The maintenance margin (for example 0.5 percent) is the minimum equity that must remain.",
          "If losses eat the margin down to the maintenance level, the exchange liquidates the position automatically.",
          "For a long, the liquidation price is approximately entry × (1 - 1/leverage + maintenance); for a short, entry × (1 + 1/leverage - maintenance).",
          "Practice 2 is liquidation_price(entry, leverage, maintenance_pct=0.5, side=\"LONG\"). At 10x from 60,000 a long is liquidated at 54,300, only 9.5 percent lower.",
          "At 100x, a 0.5 percent move wipes out the position, less than a normal hourly fluctuation in crypto.",
          "The example prints liquidation prices for several leverage levels."
        ],
        "example": "Borrowing to buy a house with a tiny deposit: a small fall in price can wipe out everything you put in.",
        "code": "entry, m = 60000, 0.005\nfor lev in [2, 5, 10, 25, 100]:\n    long_liq = entry * (1 - 1 / lev + m)\n    short_liq = entry * (1 + 1 / lev - m)\n    print(f\"{lev:3}x  long liquidated at {long_liq:9,.0f}  short at {short_liq:9,.0f}  ({(entry - long_liq) / entry:.1%} move)\")",
        "output": "  2x  long liquidated at    30,300  short at    89,700  (49.5% move)\n  5x  long liquidated at    48,300  short at    71,700  (19.5% move)\n 10x  long liquidated at    54,300  short at    65,700  (9.5% move)\n 25x  long liquidated at    57,900  short at    62,100  (3.5% move)\n100x  long liquidated at    59,700  short at    60,300  (0.5% move)",
        "codeNotes": [
          {
            "line": 3,
            "note": "Liquidation when losses consume the margin down to the maintenance level."
          }
        ],
        "tryIt": "Why is 100x leverage almost certain to be liquidated eventually?",
        "check": {
          "question": "At 10x leverage with 0.5 percent maintenance, how far can the price fall before a long is liquidated?",
          "options": [
            "10 percent",
            "About 9.5 percent",
            "50 percent"
          ],
          "answer": 1,
          "why": "1/10 - 0.005 = 0.095."
        }
      },
      {
        "title": "Funding rate arbitrage",
        "say": [
          "The classic funding trade, also called cash-and-carry, buys spot and shorts the same amount of the perp. Price moves cancel out; the trader collects positive funding.",
          "With 0.01 percent every 8 hours, a delta-neutral $1 million position earns about $300 a day, or roughly 11 percent a year, before costs.",
          "Costs and risks: trading fees on both legs, funding turning negative, the exchange failing (FTX in 2022), and the short leg being liquidated during a sharp rally even though the spot leg gained.",
          "To avoid liquidation, traders use low leverage on the short leg and move collateral between exchanges quickly, which requires reliable automation around the clock.",
          "Funding rates vary across exchanges, so some traders go long the perp on one exchange and short on another to capture the difference.",
          "The example simulates a week of funding collected by a hedged position with changing rates.",
          "It is a real, widely used strategy, but \"risk-free\" it is not."
        ],
        "example": "Renting out a flat you own while also agreeing to sell it later at today's price: the price no longer matters, and you collect the rent.",
        "code": "notional = 1_000_000\nrates_8h = [0.010, 0.012, 0.008, 0.015, 0.011, -0.004, 0.009] * 3      # one week\nincome = sum(notional * r / 100 for r in rates_8h)\nfees = notional * 0.0004 * 2                                         # enter both legs\nprint(\"funding collected in a week: $\", round(income, 2))\nprint(\"entry fees for both legs:    $\", round(fees, 2))\nprint(\"net:                          $\", round(income - fees, 2))",
        "output": "funding collected in a week: $ 1830.0\nentry fees for both legs:    $ 800.0\nnet:                          $ 1030.0",
        "codeNotes": [
          {
            "line": 3,
            "note": "The short perp receives positive funding and pays negative funding."
          },
          {
            "line": 4,
            "note": "Fees on the spot and perp legs."
          }
        ],
        "tryIt": "How many weeks of this funding does it take to cover the entry fees?",
        "check": {
          "question": "What makes cash-and-carry funding arbitrage risky despite being hedged?",
          "options": [
            "Price moves",
            "Negative funding, exchange failure and liquidation of the short leg",
            "Nothing"
          ],
          "answer": 1,
          "why": "The hedge removes price risk but not these others."
        }
      },
      {
        "title": "Liquidation cascades",
        "say": [
          "When many leveraged longs are liquidated at once, the exchange sells their positions into the market, pushing the price down further.",
          "That lower price triggers more liquidations, which push the price lower again: a cascade.",
          "Cascades explain the sudden, violent wicks seen in crypto charts, where prices drop 10 or 20 percent in minutes and then partly recover.",
          "Exchanges use insurance funds and, in extreme cases, auto-deleveraging (closing profitable traders' positions against the bankrupt ones) to absorb losses.",
          "Market makers widen quotes or step back during cascades, reducing liquidity exactly when it is most needed (Day 8).",
          "The example simulates a cascade where each wave of liquidations moves the price and triggers the next.",
          "Risk engines for crypto must model these feedback loops, not just normal volatility."
        ],
        "example": "Dominoes: one falls into the next, and a small push brings down the whole row.",
        "code": "price = 60000.0\nliquidation_levels = [58800, 58200, 57500, 56900, 55000]\nprice *= 0.975                                         # an initial 2.5% drop\nwave = 0\nwhile liquidation_levels and price <= liquidation_levels[0]:\n    liquidation_levels.pop(0)\n    price *= 0.985                                     # forced selling pushes price down 1.5%\n    wave += 1\n    print(f\"wave {wave}: price {price:,.0f}\")\nprint(\"cascade stopped at\", f\"{price:,.0f}\", \"with\", len(liquidation_levels), \"levels untouched\")",
        "output": "wave 1: price 57,622\nwave 2: price 56,758\nwave 3: price 55,907\nwave 4: price 55,068\ncascade stopped at 55,068 with 1 levels untouched",
        "codeNotes": [
          {
            "line": 5,
            "note": "Each liquidation level crossed triggers forced selling."
          },
          {
            "line": 7,
            "note": "Selling moves the price down and may reach the next level."
          }
        ],
        "tryIt": "Change the initial drop to 1 percent. Does the cascade start?",
        "check": {
          "question": "What causes a liquidation cascade?",
          "options": [
            "Low trading volume",
            "Forced selling from liquidations pushing the price to further liquidation levels",
            "High interest rates"
          ],
          "answer": 1,
          "why": "Each wave of liquidations triggers the next."
        }
      },
      {
        "title": "Practice time: funding and liquidation",
        "say": [
          "Practice 1: funding(notional, rate_8h_pct, periods, side=\"LONG\"). amount = notional × rate / 100 × periods; the payment is -amount for a long and +amount for a short, rounded to 2 decimals plus 0.0; apr_pct = rate × 3 × 365 rounded to 2.",
          "The checks: a long paying $30 for a day at 0.01 percent (10.95 percent a year), the matching short receiving $30, and a long receiving $10 from negative funding.",
          "Practice 2: liquidation_price(entry, leverage, maintenance_pct=0.5, side=\"LONG\"). Convert maintenance to a fraction and apply the long or short formula, rounded to 2.",
          "The checks: 54,300 for a 10x long from 60,000, 65,700 for the short, and 59,700 at 100x.",
          "After passing, combine them: how many days of funding at 0.03 percent per 8 hours would it take a 10x long to lose as much as a 1 percent price drop?",
          "The example answers that question.",
          "Tomorrow moves the fastest parts of trading systems out of software and into hardware."
        ],
        "example": "Comparing a slow leak with a sudden puncture: both empty the tyre, but on very different timescales.",
        "code": "notional, margin = 100_000, 10_000                  # 10x leverage\ndaily_funding = notional * 0.03 / 100 * 3\nprice_drop_loss = notional * 0.01\nprint(\"funding per day: $\", daily_funding)\nprint(\"loss from a 1% drop: $\", price_drop_loss)\nprint(\"days of funding to match:\", round(price_drop_loss / daily_funding, 1))\nprint(\"margin used by that drop:\", f\"{price_drop_loss / margin:.0%}\")",
        "output": "funding per day: $ 90.0\nloss from a 1% drop: $ 1000.0\ndays of funding to match: 11.1\nmargin used by that drop: 10%",
        "codeNotes": [
          {
            "line": 2,
            "note": "Three funding periods per day."
          }
        ],
        "tryIt": "How many days of funding would wipe out the whole margin?",
        "check": {
          "question": "liquidation_price(60000, 10, side=\"SHORT\") returns?",
          "options": [
            "54300.0",
            "65700.0",
            "66000.0"
          ],
          "answer": 1,
          "why": "60,000 × (1 + 0.1 - 0.005) = 65,700."
        }
      }
    ],
    "summary": [
      "Perpetual futures never expire; funding payments keep them near the spot price.",
      "Payment = notional × rate × periods; longs pay when the rate is positive.",
      "Liquidation price ≈ entry × (1 ∓ 1/leverage ± maintenance); high leverage leaves tiny room.",
      "Cash-and-carry collects funding with a hedged position, but carries exchange, funding and liquidation risk.",
      "Liquidation cascades create violent moves; model feedback loops, not just volatility."
    ],
    "projectStep": {
      "title": "Perpetual futures desk tool",
      "steps": [
        "Implement funding and liquidation_price.",
        "Simulate a month of a funding arbitrage position with fees and changing rates.",
        "Model a liquidation cascade and choose a safe leverage for the short leg."
      ]
    }
  },
  {
    "day": 29,
    "title": "High-Frequency Trading Infrastructure: FPGA & ASIC Offloading",
    "goal": "You can explain what FPGAs and ASICs are, why they beat CPUs on latency, compute pipeline latency and throughput from clock speed and stages, check resource utilisation, and decide what logic belongs in hardware.",
    "minutes": 30,
    "recap": "Days 11 to 15 pushed software to a few microseconds. The fastest firms go further by building the critical path directly in hardware, reaching tens of nanoseconds.",
    "parts": [
      {
        "title": "Why hardware",
        "say": [
          "A CPU runs a general-purpose sequence of instructions. Even highly optimised software pays for instruction fetching, caches, branches, the operating system and the path through the network card.",
          "An FPGA (field-programmable gate array) is a chip whose circuits can be configured to implement a specific design. The logic is laid out physically, so data flows through it without instructions.",
          "Trading FPGAs sit directly on the network card: a packet arrives, is decoded, compared with the strategy's rules and turned into an order without ever touching the CPU.",
          "Tick-to-trade times of under 100 nanoseconds are achievable, compared with a few microseconds for the best software.",
          "ASICs (application-specific integrated circuits) are custom chips, even faster and more efficient, but they cost millions to design and cannot be changed once made.",
          "The example compares typical latency budgets for a software path and an FPGA path.",
          "Hardware wins on latency and consistency: an FPGA takes exactly the same time for every message, with almost no jitter."
        ],
        "example": "A kitchen gadget built only to peel apples versus a skilled chef with a knife: the gadget does one job, perfectly and instantly, every time.",
        "code": "software = {\"NIC + kernel bypass\": 900, \"decode\": 300, \"strategy\": 800, \"risk + encode\": 400, \"send\": 800}\nfpga = {\"PHY + MAC\": 20, \"decode\": 12, \"strategy\": 16, \"risk + encode\": 12, \"send\": 20}\nfor name, path in [(\"software\", software), (\"FPGA\", fpga)]:\n    print(f\"{name:8} tick-to-trade {sum(path.values()):5} ns\")\nprint(f\"speedup about {sum(software.values()) / sum(fpga.values()):.0f}x\")",
        "output": "software tick-to-trade  3200 ns\nFPGA     tick-to-trade    80 ns\nspeedup about 40x",
        "codeNotes": [
          {
            "line": 4,
            "note": "Sum of the stage budgets."
          }
        ],
        "tryIt": "Which stage of the software path would you move to hardware first, and why?",
        "check": {
          "question": "Why do FPGAs have almost no jitter?",
          "options": [
            "They run faster clocks",
            "Data flows through fixed circuits, taking the same number of cycles every time",
            "They use Python"
          ],
          "answer": 1,
          "why": "Fixed hardware paths make timing deterministic."
        }
      },
      {
        "title": "Clocks and pipelines",
        "say": [
          "An FPGA design runs on a clock. Each tick, every register in the circuit captures a new value. Typical trading FPGAs run at 250 to 400 MHz, so one cycle is 2.5 to 4 nanoseconds.",
          "Work is split into pipeline stages, each taking one or more cycles: receive, parse fields, update book, evaluate, build order, transmit.",
          "Latency = number of stages × cycles per stage × cycle time. Twelve single-cycle stages at 250 MHz take 12 × 4 = 48 nanoseconds.",
          "Throughput is different: a new message can enter the pipeline every stage-cycle, so a 250 MHz single-cycle pipeline can accept 250 million messages per second, while each individual message still takes 48 ns.",
          "Practice 1 is fpga_latency(stages, clock_mhz, cycles_per_stage=1), returning cycles, latency in ns and maximum messages per second.",
          "The example compares pipeline designs with different clock speeds and stage timings.",
          "Engineers trade clock speed against logic per stage: faster clocks allow less work per cycle, so more stages are needed."
        ],
        "example": "A car assembly line: each car takes hours to pass through every station, but a new car rolls off the end every minute.",
        "code": "def pipeline(stages, mhz, cycles_per_stage=1):\n    cycles = stages * cycles_per_stage\n    return cycles, round(cycles / mhz * 1000, 2), mhz * 1_000_000 // cycles_per_stage\n\nfor stages, mhz, cps in [(12, 250, 1), (12, 400, 2), (8, 322, 1)]:\n    cycles, ns, rate = pipeline(stages, mhz, cps)\n    print(f\"{stages} stages @ {mhz} MHz, {cps} cycle(s)/stage: {cycles} cycles, {ns} ns, {rate:,} msgs/s\")",
        "output": "12 stages @ 250 MHz, 1 cycle(s)/stage: 12 cycles, 48.0 ns, 250,000,000 msgs/s\n12 stages @ 400 MHz, 2 cycle(s)/stage: 24 cycles, 60.0 ns, 200,000,000 msgs/s\n8 stages @ 322 MHz, 1 cycle(s)/stage: 8 cycles, 24.84 ns, 322,000,000 msgs/s",
        "codeNotes": [
          {
            "line": 3,
            "note": "Latency = cycles / clock; throughput depends on cycles per stage."
          }
        ],
        "tryIt": "Why does the 400 MHz design have higher latency than the 250 MHz one here?",
        "check": {
          "question": "A 10-stage single-cycle pipeline at 250 MHz has what latency?",
          "options": [
            "4 ns",
            "40 ns",
            "400 ns"
          ],
          "answer": 1,
          "why": "10 cycles × 4 ns per cycle."
        }
      },
      {
        "title": "Resources and fitting the design",
        "say": [
          "An FPGA has a fixed number of resources: lookup tables (LUTs) that implement logic, flip-flops that store bits, block RAM, and DSP blocks for arithmetic.",
          "A design must fit within these resources. As utilisation climbs above 70 to 90 percent, the tools struggle to route signals and meet timing at the target clock.",
          "Practice 2 is lut_utilization(used, total): the percentage used and a status of OK (below 70), TIGHT (70 to 90), RISKY (above 90) or DOES_NOT_FIT (above 100).",
          "Order books are hard to fit in hardware because they need a lot of memory; FPGA designs often keep only the top levels of the book for the instruments they trade.",
          "Building a design, called synthesis and place-and-route, can take hours, so iterating is much slower than recompiling software.",
          "The example reports utilisation for several design sizes.",
          "Keeping hardware designs small and focused is both a performance and a productivity decision."
        ],
        "example": "Packing a suitcase: it is easy when half full, awkward when nearly full, and impossible when you have more than fits.",
        "code": "def status(pct):\n    if pct > 100:\n        return \"DOES_NOT_FIT\"\n    if pct > 90:\n        return \"RISKY\"\n    return \"TIGHT\" if pct >= 70 else \"OK\"\n\ntotal = 1_000_000\nfor used in [300_000, 700_000, 950_000, 1_200_000]:\n    pct = used / total * 100\n    print(f\"{used:>9,} LUTs: {pct:5.1f}% {status(pct)}\")",
        "output": "  300,000 LUTs:  30.0% OK\n  700,000 LUTs:  70.0% TIGHT\n  950,000 LUTs:  95.0% RISKY\n1,200,000 LUTs: 120.0% DOES_NOT_FIT",
        "codeNotes": [
          {
            "line": 6,
            "note": "Seventy percent and above is already tight."
          }
        ],
        "tryIt": "What design changes could bring a RISKY design back to TIGHT?",
        "check": {
          "question": "Why is very high FPGA utilisation a problem even below 100 percent?",
          "options": [
            "It uses too much power",
            "Routing and meeting timing become very difficult",
            "It is illegal"
          ],
          "answer": 1,
          "why": "Crowded chips are hard to route at the target clock speed."
        }
      },
      {
        "title": "Hardware and software together",
        "say": [
          "Most firms use a hybrid design: the FPGA handles the simplest, most latency-critical decisions, and software handles everything else.",
          "Software computes parameters (fair values, quote prices, risk limits) and loads them into the FPGA's registers. The FPGA reacts to market events using those parameters within nanoseconds.",
          "For example, software decides \"if the best offer drops below 100.05, buy 100\", and the FPGA watches the feed and fires the order instantly when it happens.",
          "Pre-trade risk checks (Day 27) are often built into the FPGA too, so the fast path cannot bypass them.",
          "Hardware is written in languages such as Verilog and VHDL or high-level synthesis tools, and verified with extensive simulation because bugs are costly to fix.",
          "The example models software loading a trigger into a hardware-like rule and the rule reacting to ticks.",
          "The skill is choosing what belongs in hardware: simple, stable, latency-critical logic."
        ],
        "example": "A sprinter's coach plans the race in advance; the sprinter reacts to the starting gun instantly without thinking.",
        "code": "trigger = {\"side\": \"BUY\", \"below\": 100.05, \"qty\": 100}      # set by software\nticks = [100.10, 100.08, 100.06, 100.04, 100.07]\nfor i, best_offer in enumerate(ticks):\n    if best_offer < trigger[\"below\"]:                         # hardware comparator\n        print(f\"tick {i}: offer {best_offer} -> FIRE {trigger['side']} {trigger['qty']}\")\n        break\n    print(f\"tick {i}: offer {best_offer} -> wait\")",
        "output": "tick 0: offer 100.1 -> wait\ntick 1: offer 100.08 -> wait\ntick 2: offer 100.06 -> wait\ntick 3: offer 100.04 -> FIRE BUY 100",
        "codeNotes": [
          {
            "line": 1,
            "note": "Software computes and loads the rule."
          },
          {
            "line": 4,
            "note": "Hardware only compares and fires."
          }
        ],
        "tryIt": "Why does the rule stop after firing once? What would happen without that?",
        "check": {
          "question": "In a hybrid design, what does software usually do?",
          "options": [
            "Send every order",
            "Compute parameters and rules that the FPGA applies",
            "Nothing"
          ],
          "answer": 1,
          "why": "Software thinks; hardware reacts."
        }
      },
      {
        "title": "Costs and trade-offs",
        "say": [
          "FPGA development is expensive: specialised engineers, costly tools and boards, and long build and verification cycles.",
          "Changing strategy logic can take days or weeks in hardware instead of minutes in software, so only stable logic is worth moving.",
          "ASICs go further: the fastest and most power-efficient, but with design costs in the millions and no way to change the logic after manufacture.",
          "The value of hardware depends on the competition: in markets where others use FPGAs, software strategies that react to the same events simply lose the race.",
          "Many successful strategies do not need nanoseconds at all; they compete on better models, not speed.",
          "The example makes a simple break-even calculation for an FPGA project.",
          "Choose your battles: be very fast where speed decides the outcome, and smart everywhere else."
        ],
        "example": "Buying a Formula 1 car only makes sense if you are entering Formula 1 races.",
        "code": "project_cost = 1_500_000\nextra_profit_per_day = 4_000\ntrading_days = 250\npayback_days = project_cost / extra_profit_per_day\nprint(\"payback in trading days:\", round(payback_days))\nprint(\"payback in years:\", round(payback_days / trading_days, 2))",
        "output": "payback in trading days: 375\npayback in years: 1.5",
        "codeNotes": [
          {
            "line": 4,
            "note": "Days of extra profit needed to recover the cost."
          }
        ],
        "tryIt": "If competitors adopt FPGAs next year and the extra profit halves, is the project still worthwhile?",
        "check": {
          "question": "Which logic is most worth moving into an FPGA?",
          "options": [
            "Logic that changes daily",
            "Simple, stable and latency-critical logic",
            "End-of-day reports"
          ],
          "answer": 1,
          "why": "Hardware suits fixed, speed-critical paths."
        }
      },
      {
        "title": "Practice time: pipeline and resources",
        "say": [
          "Practice 1: fpga_latency(stages, clock_mhz, cycles_per_stage=1). cycles = stages × cycles_per_stage; latency_ns = round(cycles / clock_mhz × 1000, 2); max_msgs_per_sec = clock_mhz × 1,000,000 // cycles_per_stage.",
          "The checks: 12 stages at 250 MHz give 12 cycles, 48 ns and 250 million messages per second; at 400 MHz with 2 cycles per stage, 24 cycles, 60 ns and 200 million.",
          "Practice 2: lut_utilization(used, total). Compute the percentage and apply the thresholds in order: above 100, above 90, 70 or above, otherwise OK. Round the percentage to 1 decimal.",
          "The checks: 30 percent OK, 85 percent TIGHT, 95 percent RISKY and 120 percent DOES_NOT_FIT.",
          "After passing, find the fastest clock for which 12 single-cycle stages still meet a 40 ns latency budget.",
          "The example solves that with a loop over candidate clocks.",
          "Tomorrow is the final capstone: a complete market-making tick handler with every safety check from the course."
        ],
        "example": "Choosing the right gear on a bicycle for a hill: too low and you crawl, too high and you cannot turn the pedals.",
        "code": "stages, budget_ns = 12, 40\nfor mhz in [250, 300, 322, 350, 400]:\n    ns = stages / mhz * 1000\n    print(f\"{mhz} MHz: {ns:5.1f} ns {'meets budget' if ns <= budget_ns else 'too slow'}\")",
        "output": "250 MHz:  48.0 ns too slow\n300 MHz:  40.0 ns meets budget\n322 MHz:  37.3 ns meets budget\n350 MHz:  34.3 ns meets budget\n400 MHz:  30.0 ns meets budget",
        "codeNotes": [
          {
            "line": 3,
            "note": "Latency for single-cycle stages at this clock."
          }
        ],
        "tryIt": "What is the minimum clock that meets 40 ns exactly?",
        "check": {
          "question": "fpga_latency(12, 250) latency_ns is?",
          "options": [
            "12.0",
            "48.0",
            "250.0"
          ],
          "answer": 1,
          "why": "12 cycles × 4 ns = 48 ns."
        }
      }
    ],
    "summary": [
      "FPGAs implement logic as circuits, reaching tens of nanoseconds with almost no jitter.",
      "Latency = stages × cycles per stage / clock; throughput depends on cycles per stage.",
      "Designs must fit the chip; utilisation above 70 to 90 percent makes timing hard.",
      "Hybrid systems: software sets parameters, hardware reacts, with risk checks in the fast path.",
      "Hardware is expensive and slow to change; use it only where speed decides the outcome."
    ],
    "projectStep": {
      "title": "Hardware offload plan",
      "steps": [
        "Budget a software and an FPGA tick-to-trade path.",
        "Compute pipeline latency and throughput for two designs and check resource utilisation.",
        "Decide which logic to move into hardware and justify the cost."
      ]
    }
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Ultra-Low-Latency Quantitative Trading & Market Making System",
    "goal": "You can assemble a complete market-making tick handler, from micro-price to inventory-skewed quotes to risk gating, and run a production readiness audit that decides whether the system can go live.",
    "minutes": 30,
    "recap": "The final capstone uses almost everything: micro-price (Day 7), Avellaneda-Stoikov quoting (Day 8), latency budgets (Day 15), inventory and risk limits (Days 21 and 27), and the honesty checks of Day 26.",
    "parts": [
      {
        "title": "The tick handler",
        "say": [
          "A market maker's core function runs on every market data tick: read the book, compute a fair value, set quotes, check risk, and decide which quotes to send.",
          "Step 1, micro-price: weight the bid and ask by the opposite side's size, (bid × ask_qty + ask × bid_qty) / (bid_qty + ask_qty), as on Day 7.",
          "Step 2, reservation price: shift fair value against inventory, r = micro - inventory × gamma × sigma² × time left, as on Day 8.",
          "Step 3, quotes: bid = r - half spread, ask = r + half spread.",
          "Step 4, risk gating: each quote is sent only if it passes size and price collar checks and does not push inventory beyond its limit.",
          "Practice 1 is on_tick(tick, inventory, params, limits), returning the micro-price, both quotes and whether each should be sent.",
          "The example walks through the four steps for one tick with zero inventory."
        ],
        "example": "An air traffic controller's routine for each plane: check position, plan the path, check for conflicts, then give the instruction.",
        "code": "tick = {\"bid\": 100.0, \"bid_qty\": 600, \"ask\": 100.1, \"ask_qty\": 400}\ngamma, sigma, t_left, half_spread, inventory = 0.1, 0.5, 1.0, 0.05, 0\nmicro = (tick[\"bid\"] * tick[\"ask_qty\"] + tick[\"ask\"] * tick[\"bid_qty\"]) / (tick[\"bid_qty\"] + tick[\"ask_qty\"])\nr = micro - inventory * gamma * sigma ** 2 * t_left\nbid, ask = round(r - half_spread, 4), round(r + half_spread, 4)\nprint(\"micro\", round(micro, 4), \"| reservation\", round(r, 4), \"| quotes\", bid, ask)",
        "output": "micro 100.06 | reservation 100.06 | quotes 100.01 100.11",
        "codeNotes": [
          {
            "line": 3,
            "note": "More bid size pushes the micro-price towards the ask."
          },
          {
            "line": 4,
            "note": "Zero inventory: no skew."
          }
        ],
        "tryIt": "Why is the micro-price above the simple mid of 100.05 here?",
        "check": {
          "question": "What is the first step of the tick handler?",
          "options": [
            "Send orders",
            "Compute a fair value such as the micro-price",
            "Check the kill switch"
          ],
          "answer": 1,
          "why": "Everything else builds on the fair value."
        }
      },
      {
        "title": "Inventory skew in action",
        "say": [
          "A market maker wants to stay close to flat. When it has bought too much (positive inventory), it lowers both quotes: the lower bid buys less, the lower ask sells more.",
          "The size of the skew is inventory × gamma × sigma² × time left. With gamma 0.1, sigma 0.5 and one unit of time, each unit of inventory lowers quotes by 0.025.",
          "With 40 units of inventory, quotes drop by 1.0, so the bid becomes 99.01, more than 1 percent below the micro-price.",
          "That can push quotes outside the price collar: the risk gate then blocks the bid, which is exactly what the practice's \"wild\" check expects.",
          "In reality gamma is tuned so skew is meaningful but not extreme; the example shows how quickly quotes move as inventory grows.",
          "Skewing is the market maker's main tool for managing inventory without paying to cross the spread.",
          "The example prints quotes for several inventory levels."
        ],
        "example": "A shopkeeper with too many umbrellas lowers the price to sell them and offers less to buy more from suppliers.",
        "code": "micro, gamma, sigma, t_left, half = 100.06, 0.1, 0.5, 1.0, 0.05\nfor inventory in [-20, 0, 10, 40]:\n    r = micro - inventory * gamma * sigma ** 2 * t_left\n    print(f\"inventory {inventory:+3}: bid {r - half:7.2f}  ask {r + half:7.2f}\")",
        "output": "inventory -20: bid  100.51  ask  100.61\ninventory  +0: bid  100.01  ask  100.11\ninventory +10: bid   99.76  ask   99.86\ninventory +40: bid   99.01  ask   99.11",
        "codeNotes": [
          {
            "line": 3,
            "note": "Positive inventory lowers the reservation price."
          }
        ],
        "tryIt": "At what inventory would the bid fall exactly 1 percent below the micro-price?",
        "check": {
          "question": "With positive inventory, how does the market maker move its quotes?",
          "options": [
            "Raises both",
            "Lowers both, to sell more and buy less",
            "Widens only the bid"
          ],
          "answer": 1,
          "why": "Lower quotes discourage buying and encourage selling."
        }
      },
      {
        "title": "Risk gating each quote",
        "say": [
          "Each quote is checked independently, because one side may be safe while the other is not.",
          "A quote passes if the order size is within max_qty and its price is within collar_pct of the micro-price (Day 27).",
          "Inventory limits are one-sided: at maximum long inventory, stop sending bids (which would buy more), but keep sending asks (which reduce the position). At maximum short, the reverse.",
          "If the configured size exceeds the size limit, both quotes are blocked: the parameters themselves are unsafe.",
          "The practice checks all three situations: normal, maximum inventory, oversized quotes, and the wild skew that breaches the collar.",
          "The example gates quotes at maximum inventory.",
          "One-sided gating is subtle but important: blocking both sides at the inventory limit would stop the market maker from unwinding its risk."
        ],
        "example": "A full warehouse stops accepting deliveries but keeps sending goods out.",
        "code": "limits = {\"max_qty\": 500, \"collar_pct\": 1.0, \"max_inventory\": 1000}\ndef gate(price, micro, size, inventory, side):\n    ok = size <= limits[\"max_qty\"] and abs(price - micro) / micro * 100 <= limits[\"collar_pct\"]\n    if side == \"BUY\":\n        return ok and inventory < limits[\"max_inventory\"]\n    return ok and inventory > -limits[\"max_inventory\"]\n\nfor inventory in [0, 1000, -1000]:\n    print(f\"inventory {inventory:+5}: send bid {gate(100.01, 100.06, 100, inventory, 'BUY')}, send ask {gate(100.11, 100.06, 100, inventory, 'SELL')}\")",
        "output": "inventory    +0: send bid True, send ask True\ninventory +1000: send bid False, send ask True\ninventory -1000: send bid True, send ask False",
        "codeNotes": [
          {
            "line": 5,
            "note": "Stop buying at the long limit."
          },
          {
            "line": 6,
            "note": "Stop selling at the short limit."
          }
        ],
        "tryIt": "Why would blocking both quotes at the limit be a bad idea?",
        "check": {
          "question": "At maximum long inventory, which quote should still be sent?",
          "options": [
            "The bid",
            "The ask",
            "Neither"
          ],
          "answer": 1,
          "why": "Selling reduces the long position."
        }
      },
      {
        "title": "Production readiness",
        "say": [
          "A strategy is not ready for live trading just because the backtest looks good. A readiness review checks every part of the system.",
          "Typical checks: the order book and matching logic are tested (Days 2 to 5), the risk gate and kill switch are in place and drilled (Day 27), and the backtest has passed the integrity audit (Day 26).",
          "Latency must fit the budget: the measured p99 tick-to-trade (Day 15) must be at or below the target.",
          "Practice 2 is readiness(checks, p99_ns, budget_ns): list the failed checks in sorted order, add LATENCY if p99 is over budget, and report ready only if there are checks and none failed.",
          "An empty checklist is not \"ready\": a review that checked nothing proves nothing.",
          "Each check should link to evidence, such as a test report or drill log, so a reviewer can confirm it rather than trust a tick in a box.",
          "The example runs a readiness audit with one failed check and a latency miss.",
          "Real firms add sign-off from risk, compliance and technology leads before go-live."
        ],
        "example": "A pilot's pre-flight checklist: one unchecked item means the plane stays on the ground.",
        "code": "checks = {\"book_tested\": True, \"risk_gate\": True, \"kill_switch\": False, \"backtest_clean\": True}\np99_ns, budget_ns = 1500, 1000\nfailed = sorted(name for name, ok in checks.items() if not ok)\nif p99_ns > budget_ns:\n    failed.append(\"LATENCY\")\nprint(\"failed:\", failed, \"| ready:\", bool(checks) and not failed)",
        "output": "failed: ['kill_switch', 'LATENCY'] | ready: False",
        "codeNotes": [
          {
            "line": 3,
            "note": "Sorted names of the checks that failed."
          },
          {
            "line": 4,
            "note": "Latency is checked separately against the budget."
          }
        ],
        "tryIt": "What must change for this system to be ready?",
        "check": {
          "question": "Why does readiness({}, 1, 1000) report not ready?",
          "options": [
            "The latency is too high",
            "No checks were run, so nothing has been proven",
            "It is a bug"
          ],
          "answer": 1,
          "why": "An empty checklist is no evidence of safety."
        }
      },
      {
        "title": "Going live safely",
        "say": [
          "Launch gradually: start with small sizes, a few instruments and tight limits, then scale up as live results match expectations.",
          "Compare live performance with the backtest daily. Large gaps usually mean a flaw in the backtest, the cost model or the live system.",
          "Monitor fills, inventory, P&L, latency percentiles, queue depths and limit usage in real time, with alerts and a clear on-call rota.",
          "Keep a runbook: what to do if the feed drops, the exchange rejects orders, latency spikes or the kill switch trips.",
          "After every incident, write a blameless review and turn its lessons into tests and checks.",
          "The example sketches a staged rollout plan with growing limits.",
          "Most blow-ups come from operations and process, not from the mathematics; treat operations as a first-class engineering discipline."
        ],
        "example": "Learning to drive: an empty car park first, then quiet roads, and only then the motorway.",
        "code": "stages = [(\"pilot\", 1, 100), (\"small\", 5, 500), (\"normal\", 20, 2000), (\"full\", 50, 5000)]\nfor name, instruments, max_qty in stages:\n    print(f\"{name:7} {instruments:3} instruments, max order {max_qty:5} - advance only if live matches backtest\")",
        "output": "pilot     1 instruments, max order   100 - advance only if live matches backtest\nsmall     5 instruments, max order   500 - advance only if live matches backtest\nnormal   20 instruments, max order  2000 - advance only if live matches backtest\nfull     50 instruments, max order  5000 - advance only if live matches backtest",
        "codeNotes": [
          {
            "line": 3,
            "note": "Each stage expands only after evidence from the previous one."
          }
        ],
        "tryIt": "What evidence would you require before moving from \"small\" to \"normal\"?",
        "check": {
          "question": "Why launch a new strategy with small sizes?",
          "options": [
            "To pay fewer fees",
            "To limit damage while confirming live behaviour matches expectations",
            "Exchanges require it"
          ],
          "answer": 1,
          "why": "Small, controlled steps reveal problems cheaply."
        }
      },
      {
        "title": "Capstone practice: tick handler and readiness",
        "say": [
          "Practice 1: on_tick(tick, inventory, params, limits). Compute the micro-price, reservation price and quotes (rounded to 4), then send_bid and send_ask using the size, collar and one-sided inventory rules. Return the micro-price rounded to 4 as well.",
          "The checks: a normal tick (micro 100.06, bid 100.01, ask 100.11, both sent), maximum inventory (bid blocked, ask sent), oversized quotes (both blocked) and wild skew (bid 99.01, blocked by the collar).",
          "Practice 2: readiness(checks, p99_ns, budget_ns). Sorted failed names, plus LATENCY when over budget; ready only when checks is non-empty and nothing failed.",
          "Congratulations: you have completed Quantitative Trading Systems in Python, from order books and matching engines to latency engineering, pricing, risk, alpha, routing, physics, safety and hardware.",
          "Keep building: extend the tick handler into a full simulation with a matching engine from Milestone 1, and measure it with the tools from Milestone 2.",
          "The example runs the complete handler across a few ticks with changing inventory.",
          "Well done. The same disciplines, measure, test, control risk and stay honest, apply to every serious engineering system."
        ],
        "example": "A graduation performance where every skill learned during the year appears in one show.",
        "code": "params = {\"gamma\": 0.1, \"sigma\": 0.5, \"t_left\": 1.0, \"half_spread\": 0.05, \"size\": 100}\nlimits = {\"max_qty\": 500, \"collar_pct\": 1.0, \"max_inventory\": 30}\ndef on_tick(t, inv):\n    micro = (t[\"bid\"] * t[\"ask_qty\"] + t[\"ask\"] * t[\"bid_qty\"]) / (t[\"bid_qty\"] + t[\"ask_qty\"])\n    r = micro - inv * params[\"gamma\"] * params[\"sigma\"] ** 2 * params[\"t_left\"]\n    bid, ask = round(r - params[\"half_spread\"], 4), round(r + params[\"half_spread\"], 4)\n    ok = lambda p: params[\"size\"] <= limits[\"max_qty\"] and abs(p - micro) / micro * 100 <= limits[\"collar_pct\"]\n    return bid, ask, ok(bid) and inv < limits[\"max_inventory\"], ok(ask) and inv > -limits[\"max_inventory\"]\n\nticks = [{\"bid\": 100.0, \"bid_qty\": 600, \"ask\": 100.1, \"ask_qty\": 400},\n         {\"bid\": 100.05, \"bid_qty\": 300, \"ask\": 100.15, \"ask_qty\": 700},\n         {\"bid\": 99.95, \"bid_qty\": 500, \"ask\": 100.05, \"ask_qty\": 500}]\nfor t, inv in zip(ticks, [0, 10, 30]):\n    print(f\"inventory {inv:2}:\", on_tick(t, inv))",
        "output": "inventory  0: (100.01, 100.11, True, True)\ninventory 10: (99.78, 99.88, True, True)\ninventory 30: (99.2, 99.3, False, True)",
        "codeNotes": [
          {
            "line": 5,
            "note": "Inventory skew."
          },
          {
            "line": 8,
            "note": "Size, collar and one-sided inventory gating."
          }
        ],
        "tryIt": "At inventory 30, why is the bid blocked while the ask is still sent?",
        "check": {
          "question": "on_tick at maximum long inventory returns?",
          "options": [
            "send_bid True, send_ask False",
            "send_bid False, send_ask True",
            "Both False"
          ],
          "answer": 1,
          "why": "Stop buying, keep selling."
        }
      }
    ],
    "summary": [
      "The tick handler: micro-price, inventory-skewed reservation price, quotes, then risk gating.",
      "Skew lowers quotes when long and raises them when short; large skew can breach the collar.",
      "Gate each quote on size, collar and one-sided inventory limits.",
      "Readiness requires every check to pass and p99 latency within budget; an empty checklist is not ready.",
      "Go live in stages, compare with the backtest and treat operations as engineering."
    ],
    "projectStep": {
      "title": "Final capstone: market-making system",
      "steps": [
        "Implement on_tick and readiness.",
        "Run the handler through a simulated session with a matching engine and track inventory and P&L.",
        "Produce a readiness report with latency percentiles, risk checks and a staged launch plan."
      ]
    }
  }
];
