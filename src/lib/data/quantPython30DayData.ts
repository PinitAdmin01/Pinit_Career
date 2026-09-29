import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';
import { QUANT_SYSTEMS_30_DAYS_CONFIGS } from './quant30DayData';

/**
 * Quantitative Trading Systems in Python (course-quant-python), for the Python track.
 *
 * The same 30 days and topics as Quantitative Engineering & Low-Latency Trading Systems (course-quant-systems), but every
 * practice task is written and checked in Python. The lessons are the long Python lessons (longLessons.ts).
 * Checks are plain `assert` statements run after the student's code; the reference answers live in
 * tests/fixtures/quant_python_solutions.json, not here, so students never download them.
 */
type Task = { title: string; desc: string; starter: string; hint: string; test: string };
type Day = { e: Task; a: Task };

const DAYS: Day[] = [
  {
    "e": {
      "title": "NBBO Spread and Midpoint",
      "desc": "Write `nbbo_spread(bid, ask, tick=0.01)` for the best bid and best ask. Return {'spread': ask - bid, 'ticks': spread / tick as a whole number, 'mid': (bid + ask) / 2, 'spread_bps': spread / mid * 10000}. Round spread and mid to 4 decimals and spread_bps to 2. If bid >= ask the book is locked or crossed: raise ValueError.",
      "starter": "def nbbo_spread(bid, ask, tick=0.01):\n    pass",
      "hint": "spread = round(ask - bid, 4); ticks = round(spread / tick); mid = round((bid + ask) / 2, 4)",
      "test": "r = nbbo_spread(100.00, 100.02)\nassert r == {'spread': 0.02, 'ticks': 2, 'mid': 100.01, 'spread_bps': 2.0}, f'Got {r}'\nassert nbbo_spread(10.00, 10.05, 0.05)['ticks'] == 1, 'A 5 cent tick'\nassert nbbo_spread(49.99, 50.03)['spread_bps'] == 8.0, f'Got {nbbo_spread(49.99, 50.03)}'\nfor bid, ask in [(100.0, 100.0), (100.05, 100.0)]:\n    try:\n        nbbo_spread(bid, ask)\n        raise AssertionError('A locked or crossed book must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Snap a Price to the Tick Grid",
      "desc": "Exchanges only accept prices on the tick grid. Write `snap_to_tick(price, tick, side)` that returns the nearest valid price that does not make the order more aggressive: for 'BUY' round DOWN to a multiple of tick, for 'SELL' round UP. Add 1e-9 before floor (subtract before ceil) to ignore floating point noise, and round the result to 4 decimals.",
      "starter": "import math\n\n\ndef snap_to_tick(price, tick, side):\n    pass",
      "hint": "BUY: math.floor(price / tick + 1e-9) * tick; SELL: math.ceil(price / tick - 1e-9) * tick",
      "test": "assert snap_to_tick(100.017, 0.01, 'BUY') == 100.01, 'A buy rounds down'\nassert snap_to_tick(100.011, 0.01, 'SELL') == 100.02, 'A sell rounds up'\nassert snap_to_tick(100.02, 0.01, 'BUY') == 100.02, 'Already on the grid'\nassert snap_to_tick(100.03, 0.05, 'BUY') == 100.0 and snap_to_tick(100.03, 0.05, 'SELL') == 100.05, 'A 5 cent tick'\nassert snap_to_tick(0.3, 0.1, 'SELL') == 0.3, 'Floating point noise must not push 0.3 up to 0.4'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Limit Order Book Insert",
      "desc": "Write `insert_order(book, order)` where book is {'bids': [...], 'asks': [...]} and order is {'id', 'side', 'price', 'qty'}. 'BUY' orders go into bids, sorted by price from highest to lowest; 'SELL' orders into asks, from lowest to highest. Orders at the same price keep time priority: a new order goes AFTER existing orders at its price. Change the book in place and return it.",
      "starter": "def insert_order(book, order):\n    pass",
      "hint": "Find the first position where the resting order is strictly worse, and insert there with list.insert.",
      "test": "book = {'bids': [], 'asks': []}\nfor o in [{'id': 'b1', 'side': 'BUY', 'price': 100.0, 'qty': 5}, {'id': 'b2', 'side': 'BUY', 'price': 100.5, 'qty': 3},\n          {'id': 'b3', 'side': 'BUY', 'price': 100.0, 'qty': 7}, {'id': 's1', 'side': 'SELL', 'price': 101.0, 'qty': 2},\n          {'id': 's2', 'side': 'SELL', 'price': 100.8, 'qty': 4}, {'id': 's3', 'side': 'SELL', 'price': 101.0, 'qty': 1}]:\n    insert_order(book, o)\nassert [o['id'] for o in book['bids']] == ['b2', 'b1', 'b3'], f\"Bids best first, FIFO at 100.0: got {[o['id'] for o in book['bids']]}\"\nassert [o['id'] for o in book['asks']] == ['s2', 's1', 's3'], f\"Asks best first, FIFO at 101.0: got {[o['id'] for o in book['asks']]}\"\nassert insert_order({'bids': [], 'asks': []}, {'id': 'x', 'side': 'SELL', 'price': 5.0, 'qty': 1})['asks'][0]['id'] == 'x', 'Return the book'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Cumulative Depth",
      "desc": "Write `cumulative_depth(levels, n)` where levels is a list of (price, qty) pairs, best price first. Return a list of (price, total_qty_up_to_this_level) for the first n levels. This is what a depth-of-book display shows.",
      "starter": "def cumulative_depth(levels, n):\n    pass",
      "hint": "total = 0; for price, qty in levels[:n]: total += qty; out.append((price, total))",
      "test": "asks = [(100.1, 300), (100.2, 500), (100.3, 200), (100.4, 1000)]\nassert cumulative_depth(asks, 3) == [(100.1, 300), (100.2, 800), (100.3, 1000)], f'Got {cumulative_depth(asks, 3)}'\nassert cumulative_depth(asks, 10)[-1] == (100.4, 2000), 'n larger than the book'\nassert cumulative_depth([], 5) == [], 'Empty side'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Price-Time Matching Engine",
      "desc": "Write `match_order(book, incoming)`. A 'BUY' trades against book['asks'] (best first) while the ask price is <= the buy limit; a 'SELL' trades against book['bids'] while the bid price is >= its limit. Each trade happens at the RESTING order's price, for min(remaining, resting qty). Remove fully filled resting orders and reduce partly filled ones. Any unfilled remainder rests in the book with insert_order rules (price priority, then time). Return {'trades': [(resting_id, price, qty), ...], 'remaining': qty left}.",
      "starter": "def match_order(book, incoming):\n    pass",
      "hint": "opposite = book['asks'] if BUY else book['bids']; while remaining and opposite and crosses(opposite[0]): trade...",
      "test": "book = {'bids': [{'id': 'b1', 'side': 'BUY', 'price': 99.9, 'qty': 5}],\n        'asks': [{'id': 'a1', 'side': 'SELL', 'price': 100.0, 'qty': 3}, {'id': 'a2', 'side': 'SELL', 'price': 100.1, 'qty': 4},\n                 {'id': 'a3', 'side': 'SELL', 'price': 100.3, 'qty': 9}]}\nr = match_order(book, {'id': 'x', 'side': 'BUY', 'price': 100.1, 'qty': 6})\nassert r == {'trades': [('a1', 100.0, 3), ('a2', 100.1, 3)], 'remaining': 0}, f'Got {r}'\nassert [(o['id'], o['qty']) for o in book['asks']] == [('a2', 1), ('a3', 9)], 'a1 filled and removed, a2 reduced'\nr2 = match_order(book, {'id': 'y', 'side': 'BUY', 'price': 100.2, 'qty': 4})\nassert r2 == {'trades': [('a2', 100.1, 1)], 'remaining': 3}, f'Got {r2}'\nassert book['bids'][0]['id'] == 'y' and book['bids'][0]['qty'] == 3, 'The remainder rests as the new best bid'\nr3 = match_order(book, {'id': 'z', 'side': 'SELL', 'price': 99.0, 'qty': 10})\nassert r3['trades'] == [('y', 100.2, 3), ('b1', 99.9, 5)] and r3['remaining'] == 2, f'Got {r3}'\nassert book['asks'][0]['id'] == 'z', 'The unfilled sell rests at 99.0, the new best ask'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Average Execution Price",
      "desc": "Write `average_fill_price(trades)` where trades is a list of (id, price, qty). Return the volume-weighted average price sum(price * qty) / sum(qty), rounded to 4 decimals, or 0.0 when there are no trades.",
      "starter": "def average_fill_price(trades):\n    pass",
      "hint": "total_qty = sum(q for _, _, q in trades); if not total_qty: return 0.0",
      "test": "assert average_fill_price([('a1', 100.0, 3), ('a2', 100.1, 3)]) == 100.05, 'Equal sizes: the simple average'\nassert average_fill_price([('a1', 100.0, 1), ('a2', 101.0, 3)]) == 100.75, 'Weighted by quantity'\nassert average_fill_price([]) == 0.0, 'No trades'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "VWAP Schedule",
      "desc": "Write `vwap_schedule(total, volume_pcts)` that splits a parent order of total shares across time bins in proportion to the expected market volume share of each bin (volume_pcts add up to 1). Give each bin round(total * pct) shares, then set the LAST bin to whatever is left so the slices add up exactly to total. Return the list of slice sizes.",
      "starter": "def vwap_schedule(total, volume_pcts):\n    pass",
      "hint": "slices = [round(total * p) for p in volume_pcts[:-1]]; slices.append(total - sum(slices))",
      "test": "profile = [0.2, 0.1, 0.1, 0.15, 0.45]\nassert vwap_schedule(10000, profile) == [2000, 1000, 1000, 1500, 4500], f'Got {vwap_schedule(10000, profile)}'\ns = vwap_schedule(1001, [0.3333, 0.3333, 0.3334])\nassert sum(s) == 1001 and s == [334, 334, 333], f'Slices must add up exactly, got {s}'\nassert vwap_schedule(50, [1.0]) == [50], 'One bin'\nprint('All checks passed.')"
    },
    "a": {
      "title": "TWAP Schedule",
      "desc": "Write `twap_schedule(qty, duration_min, interval_min)` that splits qty into equal slices, one every interval_min minutes over duration_min (the number of slices is duration_min // interval_min). When qty does not divide evenly, give the first (qty % slices) slices one extra share. If there would be no slices, raise ValueError.",
      "starter": "def twap_schedule(qty, duration_min, interval_min):\n    pass",
      "hint": "n = duration_min // interval_min; base, extra = divmod(qty, n); [base + (1 if i < extra else 0) for i in range(n)]",
      "test": "assert twap_schedule(1200, 60, 10) == [200] * 6, 'Even split'\nassert twap_schedule(1000, 30, 10) == [334, 333, 333], f'Got {twap_schedule(1000, 30, 10)}'\nassert sum(twap_schedule(7, 60, 15)) == 7, 'Slices add up'\ntry:\n    twap_schedule(100, 5, 10)\n    raise AssertionError('No full interval: raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Matching Kernel Over a Stream",
      "desc": "Write `run_matching(orders)`: start from an empty book and send each order through a price-time matching engine (as in Day 3: trades at the resting price, FIFO, remainders rest). Return {'trades': number of trades, 'volume': total shares traded, 'best_bid': best bid price or None, 'best_ask': best ask price or None}.",
      "starter": "def run_matching(orders):\n    pass",
      "hint": "Reuse your Day 3 match_order and insert_order, then read book['bids'][0] and book['asks'][0].",
      "test": "orders = [\n    {'id': 1, 'side': 'SELL', 'price': 10.2, 'qty': 100}, {'id': 2, 'side': 'SELL', 'price': 10.1, 'qty': 50},\n    {'id': 3, 'side': 'BUY', 'price': 10.0, 'qty': 70}, {'id': 4, 'side': 'BUY', 'price': 10.2, 'qty': 120},\n    {'id': 5, 'side': 'SELL', 'price': 9.9, 'qty': 30},\n]\nr = run_matching(orders)\nassert r == {'trades': 3, 'volume': 150, 'best_bid': 10.0, 'best_ask': 10.2}, f'Got {r}'\nassert run_matching([]) == {'trades': 0, 'volume': 0, 'best_bid': None, 'best_ask': None}, 'Empty stream'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Engine Throughput",
      "desc": "Write `engine_throughput(orders, elapsed_us)` returning {'orders_per_sec': orders / (elapsed_us / 1_000_000) rounded to a whole number, 'ns_per_order': elapsed_us * 1000 / orders rounded to 1 decimal}. If orders or elapsed_us is 0 or less, raise ValueError.",
      "starter": "def engine_throughput(orders, elapsed_us):\n    pass",
      "hint": "seconds = elapsed_us / 1_000_000",
      "test": "assert engine_throughput(1_000_000, 500_000) == {'orders_per_sec': 2000000, 'ns_per_order': 500.0}, 'Two million orders a second'\nassert engine_throughput(3, 1) == {'orders_per_sec': 3000000, 'ns_per_order': 333.3}, f'Got {engine_throughput(3, 1)}'\nfor bad in [(0, 10), (10, 0)]:\n    try:\n        engine_throughput(*bad)\n        raise AssertionError(f'{bad} must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Almgren-Chriss Impact Cost",
      "desc": "Write `impact_cost(shares, rate, gamma, eta)` for a simple Almgren-Chriss model. Permanent impact cost = 0.5 * gamma * shares ** 2 (the price moves against you and stays moved). Temporary impact cost = eta * rate * shares (trading faster costs more). Return {'permanent', 'temporary', 'total'} each rounded to 4 decimals.",
      "starter": "def impact_cost(shares, rate, gamma, eta):\n    pass",
      "hint": "permanent = 0.5 * gamma * shares ** 2; temporary = eta * rate * shares",
      "test": "r = impact_cost(10000, 500, 1e-6, 2e-6)\nassert r == {'permanent': 50.0, 'temporary': 10.0, 'total': 60.0}, f'Got {r}'\nfast = impact_cost(10000, 5000, 1e-6, 2e-6)\nassert fast['temporary'] == 100.0 and fast['permanent'] == 50.0, 'Trading 10 times faster raises only the temporary cost'\nassert impact_cost(0, 100, 1e-6, 2e-6)['total'] == 0.0, 'No trade, no cost'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Slippage in Basis Points",
      "desc": "Write `slippage_bps(decision_price, fill_price, side)`. Slippage is how much worse the fill was than the price when you decided to trade, in basis points (1 bp = 0.01%). For 'BUY': (fill - decision) / decision * 10000. For 'SELL': (decision - fill) / decision * 10000. Positive means it cost you. Round to 2 decimals.",
      "starter": "def slippage_bps(decision_price, fill_price, side):\n    pass",
      "hint": "diff = fill - decision if side == 'BUY' else decision - fill",
      "test": "assert slippage_bps(100.0, 100.05, 'BUY') == 5.0, 'Bought 5 bp higher'\nassert slippage_bps(100.0, 99.9, 'SELL') == 10.0, 'Sold 10 bp lower'\nassert slippage_bps(50.0, 49.99, 'BUY') == -2.0, 'Negative slippage: a better price than expected'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Order Book Imbalance and Micro-Price",
      "desc": "Write `micro_price(bid, bid_qty, ask, ask_qty)`. Order book imbalance obi = (bid_qty - ask_qty) / (bid_qty + ask_qty), between -1 and 1. The micro-price leans towards the side that is likely to be hit: (bid * ask_qty + ask * bid_qty) / (bid_qty + ask_qty). Return {'obi', 'micro'} both rounded to 4 decimals.",
      "starter": "def micro_price(bid, bid_qty, ask, ask_qty):\n    pass",
      "hint": "total = bid_qty + ask_qty; obi = (bid_qty - ask_qty) / total",
      "test": "assert micro_price(100.0, 500, 100.02, 500) == {'obi': 0.0, 'micro': 100.01}, 'Balanced book: the midpoint'\nr = micro_price(100.0, 900, 100.02, 100)\nassert r == {'obi': 0.8, 'micro': 100.018}, f'Heavy bids push the micro-price up towards the ask, got {r}'\nassert micro_price(100.0, 100, 100.02, 300)['micro'] == 100.005, 'Heavy asks pull it down'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Imbalance Signal",
      "desc": "Write `obi_signal(obi, threshold=0.3)` that returns 'BUY_PRESSURE' when obi >= threshold, 'SELL_PRESSURE' when obi <= -threshold, and 'NEUTRAL' otherwise, together with a 0-100 score: (obi + 1) / 2 * 100 rounded to 1 decimal. Clamp obi to [-1, 1] first. Return (signal, score).",
      "starter": "def obi_signal(obi, threshold=0.3):\n    pass",
      "hint": "obi = max(-1.0, min(1.0, obi)); score = round((obi + 1) / 2 * 100, 1)",
      "test": "assert obi_signal(0.8) == ('BUY_PRESSURE', 90.0), 'Strong bid pressure'\nassert obi_signal(-0.5) == ('SELL_PRESSURE', 25.0), 'Ask pressure'\nassert obi_signal(0.1) == ('NEUTRAL', 55.0), 'Weak signal'\nassert obi_signal(3.0) == ('BUY_PRESSURE', 100.0), 'Clamped to 1'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Avellaneda-Stoikov Quotes",
      "desc": "Write `as_quotes(mid, inventory, gamma, sigma, t_left, half_spread)`. The reservation price shifts away from the side you are already long: r = mid - inventory * gamma * sigma ** 2 * t_left. Quote bid = r - half_spread and ask = r + half_spread. Return {'reservation', 'bid', 'ask'} rounded to 4 decimals.",
      "starter": "def as_quotes(mid, inventory, gamma, sigma, t_left, half_spread):\n    pass",
      "hint": "r = mid - inventory * gamma * sigma ** 2 * t_left",
      "test": "assert as_quotes(100.0, 0, 0.1, 2.0, 1.0, 0.05) == {'reservation': 100.0, 'bid': 99.95, 'ask': 100.05}, 'Flat inventory: symmetric quotes'\nlong_q = as_quotes(100.0, 10, 0.1, 2.0, 0.5, 0.05)\nassert long_q == {'reservation': 98.0, 'bid': 97.95, 'ask': 98.05}, f'Long 10: quotes shift down to sell, got {long_q}'\nshort_q = as_quotes(100.0, -5, 0.1, 2.0, 1.0, 0.05)\nassert short_q['reservation'] == 102.0, 'Short: quotes shift up to buy back'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Inventory Guard",
      "desc": "Write `inventory_action(inventory, limit)`. If abs(inventory) >= limit return 'STOP_BUYING' when long (inventory > 0) or 'STOP_SELLING' when short. If abs(inventory) >= 0.8 * limit return 'SKEW_QUOTES'. Otherwise 'NORMAL'.",
      "starter": "def inventory_action(inventory, limit):\n    pass",
      "hint": "Check the hard limit first, then the 80% warning level.",
      "test": "assert inventory_action(1000, 1000) == 'STOP_BUYING', 'At the long limit'\nassert inventory_action(-1200, 1000) == 'STOP_SELLING', 'Over the short limit'\nassert inventory_action(850, 1000) == 'SKEW_QUOTES', 'Getting close'\nassert inventory_action(-100, 1000) == 'NORMAL', 'Comfortable'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "FIX Message Builder",
      "desc": "Write `fix_message(msg_type, fields)` where fields is a list of (tag, value). SOH is the character '\\x01'. The body is '35=<msg_type>' SOH followed by each 'tag=value' SOH. The message is '8=FIX.4.4' SOH '9=<length of body>' SOH + body, then '10=<checksum>' SOH, where checksum is the sum of the byte values of everything before '10=', modulo 256, written as 3 digits (e.g. '007').",
      "starter": "SOH = '\\x01'\n\n\ndef fix_message(msg_type, fields):\n    pass",
      "hint": "body = f'35={msg_type}{SOH}' + ''.join(f'{t}={v}{SOH}' for t, v in fields); head = f'8=FIX.4.4{SOH}9={len(body)}{SOH}'",
      "test": "SOH = '\\x01'\nm = fix_message('D', [(55, 'INFY'), (54, 1), (38, 100), (44, '1520.5')])\nparts = m.split(SOH)\nassert parts[:3] == ['8=FIX.4.4', '9=35', '35=D'], f'Got {parts[:3]}'\nassert parts[-2] == '10=171' and parts[-1] == '', f'Got {parts[-2:]}'\nassert sum(ord(c) for c in m[:m.index(\"10=\")]) % 256 == int(parts[-2][3:]), 'The checksum covers everything before 10='\nassert fix_message('0', []).split(SOH)[1] == '9=5', 'A heartbeat body is just 35=0 and SOH'\nprint('All checks passed.')"
    },
    "a": {
      "title": "FIX Checksum Validator",
      "desc": "Write `valid_fix_checksum(raw)` for a FIX message string ending in '10=NNN' followed by SOH ('\\x01'). Recompute the sum of the byte values of everything before the '10=' field, modulo 256, and return True only if it equals NNN. Return False if the message has no '10=' field.",
      "starter": "def valid_fix_checksum(raw):\n    pass",
      "hint": "i = raw.rfind('\\x0110='); the checksum field starts at i + 1",
      "test": "SOH = '\\x01'\ngood = f'8=FIX.4.4{SOH}9=5{SOH}35=0{SOH}10=163{SOH}'\nassert valid_fix_checksum(good) is True, 'A correct heartbeat'\nassert valid_fix_checksum(good.replace('10=163', '10=164')) is False, 'Wrong checksum'\nassert valid_fix_checksum(good.replace('35=0', '35=1')) is False, 'The body changed after the checksum was computed'\nassert valid_fix_checksum('8=FIX.4.4') is False, 'No checksum field'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "ITCH Add Order Parser",
      "desc": "An ITCH-style 'Add Order' message here is 26 bytes, big-endian: message type (1 byte, b'A'), order reference (8-byte unsigned), side (1 byte, b'B' or b'S'), shares (4-byte unsigned), stock (8 ASCII bytes, padded with spaces), price (4-byte unsigned, 4 implied decimals). Write `parse_add_order(buf)` with the struct module (format '>cQcI8sI') returning {'ref', 'side': 'BUY' or 'SELL', 'shares', 'stock' (spaces stripped), 'price' (float)}. Raise ValueError if the type is not b'A' or the length is not 26.",
      "starter": "import struct\n\n\ndef parse_add_order(buf):\n    pass",
      "hint": "kind, ref, side, shares, stock, price = struct.unpack('>cQcI8sI', buf)",
      "test": "import struct\nmsg = struct.pack('>cQcI8sI', b'A', 123456789, b'B', 250, b'INFY    ', 15205000)\nassert parse_add_order(msg) == {'ref': 123456789, 'side': 'BUY', 'shares': 250, 'stock': 'INFY', 'price': 1520.5}, f'Got {parse_add_order(msg)}'\nsell = struct.pack('>cQcI8sI', b'A', 7, b'S', 10, b'TCS     ', 38001234)\nassert parse_add_order(sell)['side'] == 'SELL' and parse_add_order(sell)['price'] == 3800.1234, 'Four implied decimals'\nfor bad in [struct.pack('>cQcI8sI', b'X', 1, b'B', 1, b'A       ', 1), msg[:-1]]:\n    try:\n        parse_add_order(bad)\n        raise AssertionError('Wrong type or length must raise ValueError')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Fixed-Point Prices",
      "desc": "Feeds send prices as integers with 4 implied decimals. Write `to_fixed(price)` returning the integer (round, do not truncate: 1520.5 -> 15205000) and `from_fixed(raw)` returning raw / 10000 rounded to 4 decimals. Rounding matters because 0.1 * 10000 in floating point can be 999.9999999.",
      "starter": "def to_fixed(price):\n    pass\n\n\ndef from_fixed(raw):\n    pass",
      "hint": "int(round(price * 10000))",
      "test": "assert to_fixed(1520.5) == 15205000, 'Four decimals'\nassert to_fixed(0.1) == 1000 and to_fixed(19.99) == 199900, 'Rounding avoids truncation errors'\nassert from_fixed(15205000) == 1520.5 and from_fixed(1) == 0.0001, 'Back to a price'\nassert all(from_fixed(to_fixed(p)) == p for p in [0.01, 99.9999, 123.45]), 'Round trips are exact'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Zero-Copy Ring Consumer",
      "desc": "A network card writes packets into a ring buffer (a list of fixed size). Write `consume_ring(ring, head, tail, max_batch)`: head is the count of packets written so far, tail the count already consumed. Read up to max_batch packets starting at position tail % len(ring), wrapping around, without going past head. Return {'packets': [...], 'new_tail': ...}.",
      "starter": "def consume_ring(ring, head, tail, max_batch):\n    pass",
      "hint": "n = min(max_batch, head - tail); packets = [ring[(tail + i) % len(ring)] for i in range(n)]",
      "test": "ring = ['p8', 'p9', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7']   # slots 0-1 already overwritten by p8, p9\nr = consume_ring(ring, head=10, tail=5, max_batch=4)\nassert r == {'packets': ['p5', 'p6', 'p7', 'p8'], 'new_tail': 9}, f'Wraps around the end, got {r}'\nassert consume_ring(ring, 10, 9, 4) == {'packets': ['p9'], 'new_tail': 10}, 'Only one packet left'\nassert consume_ring(ring, 10, 10, 4) == {'packets': [], 'new_tail': 10}, 'Nothing new'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Kernel Bypass Savings",
      "desc": "Write `bypass_savings(kernel_ns, bypass_ns, msgs_per_day)` returning {'speedup': kernel_ns / bypass_ns rounded to 2 decimals, 'saved_ns': kernel_ns - bypass_ns, 'saved_seconds_per_day': saved_ns * msgs_per_day / 1e9 rounded to 3 decimals}.",
      "starter": "def bypass_savings(kernel_ns, bypass_ns, msgs_per_day):\n    pass",
      "hint": "saved = kernel_ns - bypass_ns",
      "test": "r = bypass_savings(8000, 1200, 50_000_000)\nassert r == {'speedup': 6.67, 'saved_ns': 6800, 'saved_seconds_per_day': 340.0}, f'Got {r}'\nassert bypass_savings(1000, 1000, 10)['speedup'] == 1.0, 'No gain'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "SPSC Ring Queue",
      "desc": "Write a class `SpscQueue(capacity)` for a single-producer single-consumer ring buffer. capacity must be a power of two, else raise ValueError. Keep a list of slots, a head counter (next write) and a tail counter (next read) that only ever increase, and find a slot with counter & (capacity - 1). enqueue(item) returns False when the queue is full (head - tail == capacity), else stores and returns True. dequeue() returns None when empty, else the oldest item. Also give it a size() method.",
      "starter": "class SpscQueue:\n    def __init__(self, capacity):\n        pass\n\n    def enqueue(self, item):\n        pass\n\n    def dequeue(self):\n        pass\n\n    def size(self):\n        pass",
      "hint": "mask = capacity - 1; slot = self.head & self.mask",
      "test": "q = SpscQueue(4)\nassert [q.enqueue(x) for x in 'abcde'] == [True, True, True, True, False], 'Capacity 4: the fifth enqueue fails'\nassert q.size() == 4 and q.dequeue() == 'a' and q.dequeue() == 'b', 'FIFO order'\nassert q.enqueue('e') and q.enqueue('f') and not q.enqueue('g'), 'Wrapping reuses freed slots'\nassert [q.dequeue() for _ in range(5)] == ['c', 'd', 'e', 'f', None], 'Drain, then empty returns None'\nfor bad in [3, 6, 0]:\n    try:\n        SpscQueue(bad)\n        raise AssertionError(f'{bad} is not a power of two')\n    except ValueError:\n        pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Power of Two and Next Size",
      "desc": "Write `is_power_of_two(n)` (True for 1, 2, 4, 8, ...; use n > 0 and n & (n - 1) == 0) and `next_power_of_two(n)` returning the smallest power of two >= n (for n >= 1). Ring buffers are sized this way so a bit mask can replace the slow % operation.",
      "starter": "def is_power_of_two(n):\n    pass\n\n\ndef next_power_of_two(n):\n    pass",
      "hint": "p = 1; while p < n: p *= 2",
      "test": "assert [is_power_of_two(n) for n in [1, 2, 3, 64, 96, 0, -8]] == [True, True, False, True, False, False, False], 'Powers of two'\nassert next_power_of_two(1000) == 1024 and next_power_of_two(1024) == 1024 and next_power_of_two(1) == 1, 'Round up'\nassert next_power_of_two(65) == 128, 'Just above 64'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "False Sharing Auditor",
      "desc": "Write `false_sharing(fields, line=64)`. Each field is {'name', 'offset', 'size', 'thread'}. A field occupies every cache line from offset // line to (offset + size - 1) // line. Report every pair of fields written by DIFFERENT threads that share at least one cache line, as sorted (name_a, name_b) tuples with name_a < name_b, in a sorted list.",
      "starter": "def false_sharing(fields, line=64):\n    pass",
      "hint": "lines = set(range(f['offset'] // line, (f['offset'] + f['size'] - 1) // line + 1))",
      "test": "fields = [\n    {'name': 'producer_head', 'offset': 0, 'size': 8, 'thread': 0},\n    {'name': 'consumer_tail', 'offset': 8, 'size': 8, 'thread': 1},\n    {'name': 'stats', 'offset': 60, 'size': 16, 'thread': 2},\n    {'name': 'padded_counter', 'offset': 128, 'size': 8, 'thread': 3},\n]\nassert false_sharing(fields) == [('consumer_tail', 'producer_head'), ('consumer_tail', 'stats'), ('producer_head', 'stats')], f'Got {false_sharing(fields)}'\npadded = [dict(fields[0]), dict(fields[1], offset=64)]\nassert false_sharing(padded) == [], 'Padding to separate cache lines removes the problem'\nsame_thread = [dict(fields[0]), dict(fields[1], thread=0)]\nassert false_sharing(same_thread) == [], 'One thread sharing a line with itself is fine'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Cache Line Padding",
      "desc": "Write `padding_bytes(size, line=64)` returning how many bytes to add so size becomes a multiple of line (0 if it already is), and `padded_size(size, line=64)` returning size plus that padding.",
      "starter": "def padding_bytes(size, line=64):\n    pass\n\n\ndef padded_size(size, line=64):\n    pass",
      "hint": "(-size) % line gives the padding in one step",
      "test": "assert padding_bytes(40) == 24 and padded_size(40) == 64, '40 bytes pad to one line'\nassert padding_bytes(64) == 0 and padded_size(64) == 64, 'Already aligned'\nassert padding_bytes(65) == 63 and padded_size(65) == 128, 'Just over one line'\nassert padding_bytes(100, 128) == 28, 'Some CPUs use 128-byte lines for prefetch pairs'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "SIMD Dot Product Model",
      "desc": "Write `simd_dot(a, b, width=8)` that computes the dot product in chunks of width numbers (as one SIMD instruction would), followed by a scalar tail for the leftovers. Return {'dot': the dot product rounded to 4 decimals, 'simd_steps': len(a) // width, 'tail_steps': len(a) % width}.",
      "starter": "def simd_dot(a, b, width=8):\n    pass",
      "hint": "full = len(a) // width * width; lanes = sum(a[i] * b[i] for i in range(full)); tail from full to the end",
      "test": "a = list(range(1, 20))\nb = [2.0] * 19\nassert simd_dot(a, b) == {'dot': 380.0, 'simd_steps': 2, 'tail_steps': 3}, f'Got {simd_dot(a, b)}'\nassert simd_dot([1.5] * 16, [2.0] * 16, width=16) == {'dot': 48.0, 'simd_steps': 1, 'tail_steps': 0}, 'AVX-512 holds 16 floats'\nassert simd_dot([1, 2, 3], [4, 5, 6]) == {'dot': 32.0, 'simd_steps': 0, 'tail_steps': 3}, 'Short vectors are all tail'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Amdahl Speedup",
      "desc": "Write `amdahl_speedup(width, parallel_fraction)` returning 1 / ((1 - p) + p / width), rounded to 2 decimals. It tells you the best overall speedup when only part of the work can be vectorised.",
      "starter": "def amdahl_speedup(width, parallel_fraction):\n    pass",
      "hint": "round(1 / ((1 - p) + p / width), 2)",
      "test": "assert amdahl_speedup(8, 1.0) == 8.0, 'Everything vectorised'\nassert amdahl_speedup(8, 0.9) == 4.71, f'Got {amdahl_speedup(8, 0.9)}'\nassert amdahl_speedup(16, 0.5) == 1.88, 'Half serial code caps the gain below 2'\nassert amdahl_speedup(1000, 0.0) == 1.0, 'Nothing parallel'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Feed Gateway Simulation",
      "desc": "Simulate a feed handler with a bounded queue. Write `gateway(arrivals, capacity, per_tick)` where arrivals[t] is how many packets arrive at tick t. Each tick: add the arrivals to the queue, dropping any that do not fit in capacity; then the consumer processes up to per_tick packets. Return {'processed', 'dropped', 'max_depth'} where max_depth is the largest queue length seen right after adding arrivals.",
      "starter": "def gateway(arrivals, capacity, per_tick):\n    pass",
      "hint": "accepted = min(n, capacity - depth); dropped += n - accepted; depth += accepted; ... depth -= min(depth, per_tick)",
      "test": "assert gateway([3, 3, 3], 10, 5) == {'processed': 9, 'dropped': 0, 'max_depth': 3}, 'Easy load'\nr = gateway([10, 10, 0, 0], 12, 4)\nassert r == {'processed': 16, 'dropped': 4, 'max_depth': 12}, f'A burst overflows the queue, got {r}'\nassert gateway([], 8, 2) == {'processed': 0, 'dropped': 0, 'max_depth': 0}, 'No traffic'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Latency Percentiles",
      "desc": "Write `latency_percentiles(samples)` returning {'p50', 'p90', 'p99', 'max'} using the nearest-rank method: sort the samples; the p-th percentile is sorted[ceil(p / 100 * n) - 1]. Raise ValueError for an empty list.",
      "starter": "import math\n\n\ndef latency_percentiles(samples):\n    pass",
      "hint": "s = sorted(samples); rank = lambda p: s[math.ceil(p / 100 * len(s)) - 1]",
      "test": "samples = list(range(1, 101))\nassert latency_percentiles(samples) == {'p50': 50, 'p90': 90, 'p99': 99, 'max': 100}, 'One to a hundred'\nspiky = [800] * 97 + [5000, 9000, 20000]\nassert latency_percentiles(spiky) == {'p50': 800, 'p90': 800, 'p99': 9000, 'max': 20000}, f'Got {latency_percentiles(spiky)}'\ntry:\n    latency_percentiles([])\n    raise AssertionError('Empty input must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Black-Scholes Pricer",
      "desc": "Write `black_scholes(S, K, T, r, sigma)` for a European option. d1 = (ln(S/K) + (r + sigma**2/2) * T) / (sigma * sqrt(T)); d2 = d1 - sigma * sqrt(T). With N(x) = 0.5 * (1 + erf(x / sqrt(2))) and n(x) = exp(-x*x/2) / sqrt(2*pi): call = S*N(d1) - K*exp(-rT)*N(d2), put = K*exp(-rT)*N(-d2) - S*N(-d1), delta = N(d1) (call delta), gamma = n(d1) / (S * sigma * sqrt(T)). Return {'call', 'put', 'delta', 'gamma'} rounded to 4 decimals.",
      "starter": "import math\n\n\ndef black_scholes(S, K, T, r, sigma):\n    pass",
      "hint": "N = lambda x: 0.5 * (1 + math.erf(x / math.sqrt(2)))",
      "test": "r = black_scholes(100, 100, 1.0, 0.05, 0.2)\nassert r == {'call': 10.4506, 'put': 5.5735, 'delta': 0.6368, 'gamma': 0.0188}, f'Got {r}'\nitm = black_scholes(120, 100, 0.5, 0.03, 0.25)\nassert itm['call'] > 20 and itm['delta'] > 0.85, f'Deep in the money: got {itm}'\nlow = black_scholes(100, 100, 1.0, 0.05, 0.1)\nassert low['call'] < r['call'], 'Lower volatility makes the option cheaper'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Put-Call Parity Check",
      "desc": "Put-call parity says C - P = S - K * exp(-r * T) for European options. Write `parity_gap(C, P, S, K, r, T, tolerance=0.05)` returning {'gap': (C - P) - (S - K * exp(-r * T)) rounded to 4 decimals, 'status': 'OK' if abs(gap) <= tolerance else 'ARBITRAGE'}.",
      "starter": "import math\n\n\ndef parity_gap(C, P, S, K, r, T, tolerance=0.05):\n    pass",
      "hint": "gap = (C - P) - (S - K * math.exp(-r * T))",
      "test": "assert parity_gap(10.4506, 5.5735, 100, 100, 0.05, 1.0) == {'gap': 0.0, 'status': 'OK'}, 'Black-Scholes prices satisfy parity'\nr = parity_gap(11.0, 5.5735, 100, 100, 0.05, 1.0)\nassert r == {'gap': 0.5494, 'status': 'ARBITRAGE'}, f'The call is too expensive, got {r}'\nassert parity_gap(5.0, 5.0, 100, 100, 0.0, 1.0)['status'] == 'OK', 'Zero rates: C equals P at the money'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Implied Volatility Solver",
      "desc": "Write `implied_vol(price, S, K, T, r, guess=0.2, tol=1e-6, max_iter=50)` using Newton-Raphson on the Black-Scholes call price: sigma_next = sigma - (bs_call(sigma) - price) / vega(sigma), where vega = S * n(d1) * sqrt(T). Stop when the price error is below tol and return sigma rounded to 4 decimals. Return None if it does not converge within max_iter or vega becomes tiny (below 1e-8).",
      "starter": "import math\n\n\ndef implied_vol(price, S, K, T, r, guess=0.2, tol=1e-6, max_iter=50):\n    pass",
      "hint": "Write helpers bs_call(sigma) and vega(sigma) inside the function, then loop max_iter times.",
      "test": "assert implied_vol(10.4506, 100, 100, 1.0, 0.05) == 0.2, 'Recovers the 20% volatility used to price it'\nassert implied_vol(10.4506, 100, 100, 1.0, 0.05, guess=0.6) == 0.2, 'From a poor starting guess too'\nassert implied_vol(15.0, 100, 100, 1.0, 0.05) == 0.3203, f'Got {implied_vol(15.0, 100, 100, 1.0, 0.05)}'\nassert implied_vol(200.0, 100, 100, 1.0, 0.05) is None, 'A call cannot cost more than the stock: no solution'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Vega",
      "desc": "Write `bs_vega(S, K, T, r, sigma)` returning S * n(d1) * sqrt(T), rounded to 4 decimals, where n is the standard normal density and d1 is the Black-Scholes d1. Vega is how much the option price changes for a 1.0 (100 percentage points) change in volatility; also return it per 1 volatility point as vega / 100, rounded to 4 decimals, as a tuple (vega, vega_per_point).",
      "starter": "import math\n\n\ndef bs_vega(S, K, T, r, sigma):\n    pass",
      "hint": "d1 = (math.log(S / K) + (r + sigma ** 2 / 2) * T) / (sigma * math.sqrt(T))",
      "test": "assert bs_vega(100, 100, 1.0, 0.05, 0.2) == (37.524, 0.3752), f'Got {bs_vega(100, 100, 1.0, 0.05, 0.2)}'\nshort, long = bs_vega(100, 100, 0.1, 0.05, 0.2), bs_vega(100, 100, 2.0, 0.05, 0.2)\nassert short[0] < long[0], 'Longer-dated options are more sensitive to volatility'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Parametric Value at Risk",
      "desc": "Write `parametric_var(value, mean, vol, confidence=0.95)` for a one-day VaR assuming normally distributed returns. Use z = 1.645 for 0.95 and z = 2.326 for 0.99 (raise ValueError for anything else). Return {'var_pct': z * vol - mean, 'var_amount': value * (z * vol - mean)}, var_pct rounded to 6 decimals and var_amount to 2.",
      "starter": "def parametric_var(value, mean, vol, confidence=0.95):\n    pass",
      "hint": "Z = {0.95: 1.645, 0.99: 2.326}",
      "test": "assert parametric_var(1_000_000, 0.0, 0.02) == {'var_pct': 0.0329, 'var_amount': 32900.0}, f'Got {parametric_var(1_000_000, 0.0, 0.02)}'\nassert parametric_var(1_000_000, 0.0005, 0.015, 0.99) == {'var_pct': 0.03439, 'var_amount': 34390.0}, 'A small positive mean lowers VaR'\ntry:\n    parametric_var(100, 0, 0.01, 0.9)\n    raise AssertionError('Unsupported confidence must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    },
    "a": {
      "title": "Historical VaR and Scaling",
      "desc": "Write `historical_var(returns, value, confidence=0.95)`: sort the daily returns, take the return at index floor((1 - confidence) * n) (the cut-off of the worst tail), and return value * -that_return rounded to 2 decimals (a positive loss). Also write `scale_var(one_day, days)` returning one_day * sqrt(days) rounded to 2 decimals (the square-root-of-time rule).",
      "starter": "import math\n\n\ndef historical_var(returns, value, confidence=0.95):\n    pass\n\n\ndef scale_var(one_day, days):\n    pass",
      "hint": "s = sorted(returns); cut = s[int(math.floor((1 - confidence) * len(s)))]",
      "test": "rets = [0.01, -0.02, 0.005, -0.035, 0.012, -0.01, 0.0, 0.02, -0.05, 0.015] * 2\nassert historical_var(rets, 1_000_000) == 50000.0, 'With 20 days the 5% cut-off is the worst day'\nassert historical_var(rets, 1_000_000, 0.9) == 35000.0, f'Got {historical_var(rets, 1_000_000, 0.9)}'\nassert scale_var(10000, 10) == 31622.78 and scale_var(10000, 1) == 10000.0, 'Square-root-of-time scaling'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Expected Shortfall",
      "desc": "Write `expected_shortfall(returns, confidence=0.95)`. Let k = max(1, round((1 - confidence) * n)). Sort the returns; the worst k are the tail. Return {'var': -(the k-th worst return), 'es': -(average of the worst k)}, both rounded to 4 decimals. ES (also called CVaR) answers: when things go badly, how bad on average?",
      "starter": "def expected_shortfall(returns, confidence=0.95):\n    pass",
      "hint": "tail = sorted(returns)[:k]; var = -tail[-1]; es = -sum(tail) / k",
      "test": "rets = [-0.08, -0.05, -0.03, -0.02, -0.01] + [0.01] * 15\nassert expected_shortfall(rets) == {'var': 0.08, 'es': 0.08}, f'20 days at 95%: k = 1, the single worst day; got {expected_shortfall(rets)}'\nassert expected_shortfall(rets, 0.8) == {'var': 0.02, 'es': 0.045}, f'Got {expected_shortfall(rets, 0.8)}'\nr = expected_shortfall([0.01, 0.02, -0.03])\nassert r['var'] == 0.03 and r['es'] == 0.03, 'Small samples still use at least one day'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Diversification Check",
      "desc": "A coherent risk measure is subadditive: the risk of a combined portfolio is at most the sum of the parts. Write `diversification(risk_a, risk_b, risk_combined)` returning {'subadditive': risk_combined <= risk_a + risk_b, 'benefit': risk_a + risk_b - risk_combined rounded to 2 decimals, 'benefit_pct': benefit / (risk_a + risk_b) * 100 rounded to 1 decimal}.",
      "starter": "def diversification(risk_a, risk_b, risk_combined):\n    pass",
      "hint": "benefit = risk_a + risk_b - risk_combined",
      "test": "assert diversification(100, 80, 140) == {'subadditive': True, 'benefit': 40, 'benefit_pct': 22.2}, f'Got {diversification(100, 80, 140)}'\nassert diversification(50, 50, 120)['subadditive'] is False, 'VaR can break subadditivity; ES never does'\nassert diversification(10, 10, 20)['benefit'] == 0, 'Perfectly correlated: no benefit'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Two-Asset Portfolio",
      "desc": "Write `portfolio_metrics(w, mu_a, sig_a, mu_b, sig_b, rho, rf=0.02)` with weight w in asset A and 1 - w in B. Return mu = w*mu_a + (1-w)*mu_b, sigma = sqrt(w²·sig_a² + (1-w)²·sig_b² + 2·w·(1-w)·rho·sig_a·sig_b), and sharpe = (mu - rf) / sigma, each rounded to 4 decimals, as {'return', 'risk', 'sharpe'}.",
      "starter": "import math\n\n\ndef portfolio_metrics(w, mu_a, sig_a, mu_b, sig_b, rho, rf=0.02):\n    pass",
      "hint": "var = (w * sig_a) ** 2 + ((1 - w) * sig_b) ** 2 + 2 * w * (1 - w) * rho * sig_a * sig_b",
      "test": "r = portfolio_metrics(0.5, 0.10, 0.20, 0.06, 0.10, 0.0)\nassert r == {'return': 0.08, 'risk': 0.1118, 'sharpe': 0.5367}, f'Got {r}'\ncorr = portfolio_metrics(0.5, 0.10, 0.20, 0.06, 0.10, 1.0)\nassert corr['risk'] == 0.15, 'Perfect correlation: risk is the weighted average'\nhedge = portfolio_metrics(0.5, 0.10, 0.20, 0.06, 0.10, -1.0)\nassert hedge['risk'] == 0.05, 'Perfect negative correlation cancels risk'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Minimum Variance Weight",
      "desc": "Write `min_variance_weight(sig_a, sig_b, rho)` returning the weight of asset A that minimises two-asset portfolio risk: (sig_b² - rho·sig_a·sig_b) / (sig_a² + sig_b² - 2·rho·sig_a·sig_b), rounded to 4 decimals.",
      "starter": "def min_variance_weight(sig_a, sig_b, rho):\n    pass",
      "hint": "num = sig_b ** 2 - rho * sig_a * sig_b; den = sig_a ** 2 + sig_b ** 2 - 2 * rho * sig_a * sig_b",
      "test": "assert min_variance_weight(0.20, 0.10, 0.0) == 0.2, 'Mostly the calmer asset'\nassert min_variance_weight(0.15, 0.15, 0.3) == 0.5, 'Equal risk: half and half'\nassert min_variance_weight(0.20, 0.10, -1.0) == 0.3333, f'Got {min_variance_weight(0.20, 0.10, -1.0)}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Portfolio Risk Engine",
      "desc": "Write `risk_engine(positions, pnl_scenarios, confidence=0.99)`. positions is a list of {'qty', 'delta', 'vega'} (per contract); net_delta = sum(qty * delta) and net_vega = sum(qty * vega). pnl_scenarios is a list of portfolio profit and loss numbers from historical scenarios. With k = max(1, round((1 - confidence) * n)), sort the P&L; var = -(k-th worst), es = -(average of the worst k). Return {'net_delta', 'net_vega', 'var', 'es'} all rounded to 2 decimals.",
      "starter": "def risk_engine(positions, pnl_scenarios, confidence=0.99):\n    pass",
      "hint": "tail = sorted(pnl_scenarios)[:k]",
      "test": "positions = [{'qty': 10, 'delta': 0.6, 'vega': 0.4}, {'qty': -5, 'delta': 0.3, 'vega': 0.5}, {'qty': 200, 'delta': 1.0, 'vega': 0.0}]\npnl = [-120000, -80000, -50000] + [1000] * 197\nr = risk_engine(positions, pnl)\nassert r == {'net_delta': 204.5, 'net_vega': 1.5, 'var': 80000, 'es': 100000}, f'Got {r}'\nassert risk_engine(positions, pnl, 0.995)['var'] == 120000, 'k = 1 at 99.5% of 200 scenarios'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Delta Hedge",
      "desc": "Write `delta_hedge(net_delta, delta_per_unit=1.0)` returning the whole number of hedge units to trade so the portfolio is delta neutral: -round(net_delta / delta_per_unit). Return 0 (not -0) when no hedge is needed.",
      "starter": "def delta_hedge(net_delta, delta_per_unit=1.0):\n    pass",
      "hint": "units = -round(net_delta / delta_per_unit); return units or 0",
      "test": "assert delta_hedge(204.5) == -204, 'Sell about 204 shares (Python rounds 204.5 to the even 204)'\nassert delta_hedge(-150.2) == 150, 'Short delta: buy'\nassert delta_hedge(250, 50) == -5, 'Hedging with futures worth 50 delta each'\nassert delta_hedge(0.2) == 0 and str(delta_hedge(0.2)) == '0', 'No hedge'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Pairs Trading Signal",
      "desc": "Write `pairs_signal(price_a, price_b, beta, mean, std, entry=2.0, exit_z=0.5)`. The spread is price_a - beta * price_b and z = (spread - mean) / std. Signal: 'SHORT_SPREAD' if z >= entry, 'LONG_SPREAD' if z <= -entry, 'EXIT' if abs(z) <= exit_z, otherwise 'HOLD'. Return {'z': rounded to 4 decimals, 'signal'}.",
      "starter": "def pairs_signal(price_a, price_b, beta, mean, std, entry=2.0, exit_z=0.5):\n    pass",
      "hint": "spread = price_a - beta * price_b; z = (spread - mean) / std",
      "test": "assert pairs_signal(105.0, 100.0, 1.0, 2.0, 1.2) == {'z': 2.5, 'signal': 'SHORT_SPREAD'}, 'A is rich relative to B'\nassert pairs_signal(98.0, 100.0, 1.0, 2.0, 1.2) == {'z': -3.3333, 'signal': 'LONG_SPREAD'}, 'A is cheap'\nassert pairs_signal(102.3, 100.0, 1.0, 2.0, 1.2)['signal'] == 'EXIT', 'Back near the mean'\nassert pairs_signal(103.5, 100.0, 1.0, 2.0, 1.2)['signal'] == 'HOLD', 'In between'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Mean Reversion Half-Life",
      "desc": "For an Ornstein-Uhlenbeck spread that reverts at speed theta (per day), the half-life is ln(2) / theta days: how long a gap takes to halve. Write `half_life(theta)` rounded to 4 decimals, raising ValueError when theta <= 0 (no mean reversion).",
      "starter": "import math\n\n\ndef half_life(theta):\n    pass",
      "hint": "round(math.log(2) / theta, 4)",
      "test": "assert half_life(0.1) == 6.9315, 'About a week'\nassert half_life(math.log(2)) == 1.0, 'Halves every day'\ntry:\n    half_life(0)\n    raise AssertionError('theta 0 must raise ValueError')\nexcept ValueError:\n    pass\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Smart Order Router",
      "desc": "Write `route_buy(qty, venues)` for a buy order. Each venue is {'name', 'price', 'fee', 'size'} where fee is per share (negative for a rebate). Rank venues by total cost price + fee (ties by name) and fill greedily. Return {'fills': [(name, shares), ...], 'unfilled': shares left, 'avg_cost': total (price + fee) * shares / filled shares rounded to 4 decimals (0.0 if nothing filled)}.",
      "starter": "def route_buy(qty, venues):\n    pass",
      "hint": "for v in sorted(venues, key=lambda v: (v['price'] + v['fee'], v['name'])): take = min(left, v['size'])",
      "test": "venues = [\n    {'name': 'NSE', 'price': 100.00, 'fee': 0.003, 'size': 300},\n    {'name': 'BSE', 'price': 100.00, 'fee': -0.001, 'size': 200},\n    {'name': 'DARK', 'price': 99.995, 'fee': 0.001, 'size': 100},\n]\nr = route_buy(500, venues)\nassert r == {'fills': [('DARK', 100), ('BSE', 200), ('NSE', 200)], 'unfilled': 0, 'avg_cost': 100.0}, f'Got {r}'\nbig = route_buy(1000, venues)\nassert big['unfilled'] == 400 and sum(s for _, s in big['fills']) == 600, 'Not enough liquidity'\nassert route_buy(10, []) == {'fills': [], 'unfilled': 10, 'avg_cost': 0.0}, 'No venues'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Fee or Rebate",
      "desc": "Write `net_fee(shares, fee_per_share)` returning {'amount': shares * fee_per_share rounded to 2 decimals, 'kind': 'FEE' if positive, 'REBATE' if negative, 'NONE' if zero}. Maker-taker venues pay a rebate to orders that add liquidity and charge a fee to orders that take it.",
      "starter": "def net_fee(shares, fee_per_share):\n    pass",
      "hint": "amount = round(shares * fee_per_share, 2)",
      "test": "assert net_fee(10000, 0.003) == {'amount': 30.0, 'kind': 'FEE'}, 'Taking liquidity costs'\nassert net_fee(10000, -0.002) == {'amount': -20.0, 'kind': 'REBATE'}, 'Adding liquidity earns'\nassert net_fee(500, 0.0) == {'amount': 0.0, 'kind': 'NONE'}, 'Free venue'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Fibre Propagation Delay",
      "desc": "Light in glass travels at c / n, where c = 299,792,458 m/s and n is the refractive index (about 1.4682 for fibre). Write `fibre_latency(meters, n=1.4682)` returning {'one_way_ns': meters * n / c * 1e9, 'round_trip_ns': twice that}, both rounded to 2 decimals.",
      "starter": "def fibre_latency(meters, n=1.4682):\n    pass",
      "hint": "C = 299_792_458; one_way = meters * n / C * 1e9",
      "test": "assert fibre_latency(1) == {'one_way_ns': 4.9, 'round_trip_ns': 9.79}, f'About 4.9 ns per metre, got {fibre_latency(1)}'\nassert fibre_latency(100)['one_way_ns'] == 489.74, 'A 100 m cross-connect'\nassert fibre_latency(1_000_000)['one_way_ns'] == 4897388.05, 'About 4.9 ms per 1,000 km'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Microwave Advantage",
      "desc": "Write `microwave_advantage(distance_km, fibre_route_factor=1.1)`. Fibre routes are longer than the straight line (the factor) and slower (n = 1.4682); microwave goes almost straight through air (n = 1.0003). Return {'fibre_us', 'microwave_us', 'saved_us'} one-way times in microseconds rounded to 3 decimals, with c = 299,792,458 m/s.",
      "starter": "def microwave_advantage(distance_km, fibre_route_factor=1.1):\n    pass",
      "hint": "us = lambda meters, n: meters * n / C * 1e6",
      "test": "r = microwave_advantage(1180)\nassert r == {'fibre_us': 6356.81, 'microwave_us': 3937.237, 'saved_us': 2419.573}, f'Chicago to New Jersey, got {r}'\nassert microwave_advantage(1180, 1.0)['saved_us'] > 1800, 'Even on a straight fibre, air wins'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Microwave Link Budget",
      "desc": "Write `microwave_link(distance_km, towers, hop_ns, rain_mm_h, rain_limit=25.0)`. Propagation = distance_km * 1000 * 1.0003 / 299,792,458 * 1e9 ns; each relay tower adds hop_ns. Status is 'UP' if rain_mm_h < rain_limit * 0.6, 'DEGRADED' if below rain_limit, else 'DOWN' (heavy rain blocks microwave). Return {'latency_ns': total rounded to whole ns, 'status'}; when DOWN, latency_ns is None.",
      "starter": "def microwave_link(distance_km, towers, hop_ns, rain_mm_h, rain_limit=25.0):\n    pass",
      "hint": "prop = distance_km * 1000 * 1.0003 / 299_792_458 * 1e9",
      "test": "assert microwave_link(1180, 20, 300, 2.0) == {'latency_ns': 3943237, 'status': 'UP'}, f'Got {microwave_link(1180, 20, 300, 2.0)}'\nassert microwave_link(1180, 20, 300, 20.0)['status'] == 'DEGRADED', 'Rain fade'\nassert microwave_link(1180, 20, 300, 40.0) == {'latency_ns': None, 'status': 'DOWN'}, 'Storm: fall back to fibre'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Relay Towers Needed",
      "desc": "Microwave needs line of sight, so long routes need relay towers. Write `towers_needed(distance_km, max_hop_km=50)` returning the number of relay towers between the two ends: the route is split into ceil(distance / max_hop) hops, and there is one tower between each pair of hops. A route of 0 km needs 0.",
      "starter": "import math\n\n\ndef towers_needed(distance_km, max_hop_km=50):\n    pass",
      "hint": "hops = math.ceil(distance_km / max_hop_km); return max(0, hops - 1)",
      "test": "assert towers_needed(1180) == 23, '24 hops of up to 50 km need 23 towers in between'\nassert towers_needed(50) == 0 and towers_needed(51) == 1, 'One hop needs no relay'\nassert towers_needed(1180, 70) == 16 and towers_needed(0) == 0, f'Got {towers_needed(1180, 70)}'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Lookahead Bias Auditor",
      "desc": "In a backtest, every decision must use only data available at that time. Write `lookahead_audit(decisions)` where each decision is {'id', 'decided_at', 'data_times': [...]}. Return {'clean': True/False, 'bad_ids': sorted ids of decisions that used any data timestamped AFTER decided_at}.",
      "starter": "def lookahead_audit(decisions):\n    pass",
      "hint": "bad = sorted(d['id'] for d in decisions if any(t > d['decided_at'] for t in d['data_times']))",
      "test": "decisions = [\n    {'id': 'd1', 'decided_at': 100, 'data_times': [90, 95, 100]},\n    {'id': 'd3', 'decided_at': 200, 'data_times': [150, 205]},\n    {'id': 'd2', 'decided_at': 150, 'data_times': [160]},\n]\nassert lookahead_audit(decisions) == {'clean': False, 'bad_ids': ['d2', 'd3']}, f'Got {lookahead_audit(decisions)}'\nassert lookahead_audit(decisions[:1]) == {'clean': True, 'bad_ids': []}, 'Data at exactly the decision time is allowed'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Multiple Testing Haircut",
      "desc": "Testing many strategies makes a high Sharpe ratio likely by luck alone. A simple haircut: the best of N useless strategies is expected to reach about sr_std * sqrt(2 * ln N). Write `haircut_sharpe(observed, trials, sr_std=0.5)` returning observed minus that amount, rounded to 4 decimals (with 1 trial there is no haircut).",
      "starter": "import math\n\n\ndef haircut_sharpe(observed, trials, sr_std=0.5):\n    pass",
      "hint": "if trials <= 1: return observed; luck = sr_std * math.sqrt(2 * math.log(trials))",
      "test": "assert haircut_sharpe(1.8, 1) == 1.8, 'One honest test'\nassert haircut_sharpe(1.8, 100) == 0.2826, f'Got {haircut_sharpe(1.8, 100)}'\nassert haircut_sharpe(1.2, 1000) < 0, 'After 1,000 tries, a 1.2 Sharpe is no evidence at all'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Pre-Trade Risk Gate",
      "desc": "Write `pre_trade_check(order, limits, mid)`. order is {'side', 'qty', 'price'}; limits is {'max_qty', 'max_notional', 'collar_pct'}. Collect reasons in this order: 'MAX_QTY' if qty > max_qty; 'MAX_NOTIONAL' if qty * price > max_notional; 'PRICE_COLLAR' if abs(price - mid) / mid * 100 > collar_pct. Return {'approved': no reasons, 'reasons': [...]}.",
      "starter": "def pre_trade_check(order, limits, mid):\n    pass",
      "hint": "reasons = []; append each failed check in order",
      "test": "limits = {'max_qty': 5000, 'max_notional': 250000, 'collar_pct': 5}\nok = {'side': 'BUY', 'qty': 1000, 'price': 101.0}\nassert pre_trade_check(ok, limits, 100.0) == {'approved': True, 'reasons': []}, 'A normal order'\nfat = {'side': 'BUY', 'qty': 50000, 'price': 100.0}\nassert pre_trade_check(fat, limits, 100.0) == {'approved': False, 'reasons': ['MAX_QTY', 'MAX_NOTIONAL']}, 'An extra zero'\ntypo = {'side': 'SELL', 'qty': 100, 'price': 10.0}\nassert pre_trade_check(typo, limits, 100.0)['reasons'] == ['PRICE_COLLAR'], 'Price 90% away from the market'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Daily Notional Kill Switch",
      "desc": "Write `kill_switch_index(orders, daily_cap)` where orders is a list of (qty, price). Add up the notional qty * price in order; return the index of the first order that would push the running total ABOVE daily_cap (that order and everything after must be blocked), or None if the cap is never breached.",
      "starter": "def kill_switch_index(orders, daily_cap):\n    pass",
      "hint": "total += qty * price; if total > daily_cap: return i",
      "test": "orders = [(100, 500.0), (200, 400.0), (50, 1000.0), (10, 10.0)]\nassert kill_switch_index(orders, 150000) == 2, 'The third order takes the total to 180,000, above the 150,000 cap'\nassert kill_switch_index(orders, 180000) == 3, 'Exactly at the cap is still allowed; the next order breaks it'\nassert kill_switch_index(orders, 10_000_000) is None, 'Never breached'\nassert kill_switch_index(orders, 1000) == 0, 'The very first order is too big'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Perpetual Funding",
      "desc": "Perpetual futures exchange funding every 8 hours. Write `funding(notional, rate_8h_pct, periods, side='LONG')`. Longs pay when the rate is positive; shorts receive it. Payment = notional * rate_8h_pct / 100 * periods, negative for the payer. Return {'payment': rounded to 2 decimals (from the position\\'s point of view), 'apr_pct': rate_8h_pct * 3 * 365 rounded to 2 decimals}.",
      "starter": "def funding(notional, rate_8h_pct, periods, side='LONG'):\n    pass",
      "hint": "amount = notional * rate_8h_pct / 100 * periods; payment = -amount if side == 'LONG' else amount",
      "test": "assert funding(100000, 0.01, 3) == {'payment': -30.0, 'apr_pct': 10.95}, 'A long pays for one day'\nassert funding(100000, 0.01, 3, 'SHORT') == {'payment': 30.0, 'apr_pct': 10.95}, 'A short receives'\nassert funding(50000, -0.02, 1)['payment'] == 10.0, 'Negative funding: longs receive'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Liquidation Price",
      "desc": "Write `liquidation_price(entry, leverage, maintenance_pct=0.5, side='LONG')`. A long is liquidated when it has lost almost all its margin: entry * (1 - 1/leverage + maintenance_pct/100). A short: entry * (1 + 1/leverage - maintenance_pct/100). Round to 2 decimals.",
      "starter": "def liquidation_price(entry, leverage, maintenance_pct=0.5, side='LONG'):\n    pass",
      "hint": "m = maintenance_pct / 100",
      "test": "assert liquidation_price(60000, 10) == 54300.0, 'A 10x long dies about 9.5% lower'\nassert liquidation_price(60000, 10, side='SHORT') == 65700.0, 'A 10x short dies about 9.5% higher'\nassert liquidation_price(60000, 100) == 59700.0, '100x: a 0.5% move wipes you out'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "FPGA Pipeline Latency",
      "desc": "Write `fpga_latency(stages, clock_mhz, cycles_per_stage=1)` returning {'cycles': stages * cycles_per_stage, 'latency_ns': cycles / clock_mhz * 1000 rounded to 2 decimals, 'max_msgs_per_sec': clock_mhz * 1_000_000 // cycles_per_stage} (a pipelined design accepts a new message every cycles_per_stage cycles).",
      "starter": "def fpga_latency(stages, clock_mhz, cycles_per_stage=1):\n    pass",
      "hint": "cycles = stages * cycles_per_stage; latency = cycles / clock_mhz * 1000",
      "test": "assert fpga_latency(12, 250) == {'cycles': 12, 'latency_ns': 48.0, 'max_msgs_per_sec': 250000000}, f'Got {fpga_latency(12, 250)}'\nassert fpga_latency(12, 400, 2) == {'cycles': 24, 'latency_ns': 60.0, 'max_msgs_per_sec': 200000000}, 'Two cycles per stage'\nprint('All checks passed.')"
    },
    "a": {
      "title": "FPGA Resource Check",
      "desc": "Write `lut_utilization(used, total)` returning {'pct': used / total * 100 rounded to 1 decimal, 'status'} where status is 'OK' below 70%, 'TIGHT' from 70% to 90%, 'RISKY' above 90% up to 100%, and 'DOES_NOT_FIT' above 100%. Designs near full use are hard to route and meet timing.",
      "starter": "def lut_utilization(used, total):\n    pass",
      "hint": "pct = used / total * 100; check the thresholds from the top down",
      "test": "assert lut_utilization(300_000, 1_000_000) == {'pct': 30.0, 'status': 'OK'}, 'Plenty of room'\nassert lut_utilization(850_000, 1_000_000)['status'] == 'TIGHT', '85%'\nassert lut_utilization(950_000, 1_000_000)['status'] == 'RISKY', '95%'\nassert lut_utilization(1_200_000, 1_000_000) == {'pct': 120.0, 'status': 'DOES_NOT_FIT'}, 'Over capacity'\nprint('All checks passed.')"
    }
  },
  {
    "e": {
      "title": "Market Maker Tick Handler",
      "desc": "Put the pieces together. Write `on_tick(tick, inventory, params, limits)`. tick is {'bid', 'bid_qty', 'ask', 'ask_qty'}. 1) micro = (bid * ask_qty + ask * bid_qty) / (bid_qty + ask_qty). 2) reservation r = micro - inventory * params['gamma'] * params['sigma'] ** 2 * params['t_left']. 3) quotes: bid = r - params['half_spread'], ask = r + params['half_spread'], rounded to 4 decimals. 4) Each quote of size params['size'] must pass: size <= limits['max_qty'], and abs(quote - micro) / micro * 100 <= limits['collar_pct']. Also stop quoting the bid if inventory >= limits['max_inventory'], and the ask if inventory <= -limits['max_inventory']. Return {'micro', 'bid', 'ask', 'send_bid', 'send_ask'} with micro rounded to 4 decimals.",
      "starter": "def on_tick(tick, inventory, params, limits):\n    pass",
      "hint": "Compute micro, then r, then the two quotes, then two booleans for whether each may be sent.",
      "test": "tick = {'bid': 100.0, 'bid_qty': 600, 'ask': 100.1, 'ask_qty': 400}\nparams = {'gamma': 0.1, 'sigma': 0.5, 't_left': 1.0, 'half_spread': 0.05, 'size': 100}\nlimits = {'max_qty': 500, 'collar_pct': 1.0, 'max_inventory': 1000}\nr = on_tick(tick, 0, params, limits)\nassert r == {'micro': 100.06, 'bid': 100.01, 'ask': 100.11, 'send_bid': True, 'send_ask': True}, f'Got {r}'\nlong = on_tick(tick, 1000, dict(params, gamma=0.0001), limits)\nassert long['send_bid'] is False and long['send_ask'] is True, 'At max inventory: stop buying, keep selling'\nhuge = on_tick(tick, 0, dict(params, size=900), limits)\nassert huge['send_bid'] is False and huge['send_ask'] is False, 'Size above the risk limit'\nwild = on_tick(tick, 40, params, limits)\nassert wild['bid'] == 99.01 and wild['send_bid'] is False, f'Quotes too far from the market are blocked, got {wild}'\nprint('All checks passed.')"
    },
    "a": {
      "title": "Production Readiness Audit",
      "desc": "Write `readiness(checks, p99_ns, budget_ns)` where checks maps check names ('book_tested', 'risk_gate', 'kill_switch', 'backtest_clean', ...) to True/False. Return {'failed': sorted failed names, plus 'LATENCY' if p99_ns > budget_ns, 'ready': True only if nothing failed and there is at least one check}.",
      "starter": "def readiness(checks, p99_ns, budget_ns):\n    pass",
      "hint": "failed = sorted(n for n, ok in checks.items() if not ok); if p99_ns > budget_ns: failed.append('LATENCY')",
      "test": "checks = {'book_tested': True, 'risk_gate': True, 'kill_switch': True, 'backtest_clean': True}\nassert readiness(checks, 800, 1000) == {'failed': [], 'ready': True}, 'Ready'\nbad = dict(checks, kill_switch=False)\nassert readiness(bad, 1500, 1000) == {'failed': ['kill_switch', 'LATENCY'], 'ready': False}, f'Got {readiness(bad, 1500, 1000)}'\nassert readiness({}, 1, 1000)['ready'] is False, 'No checks, not ready'\nprint('All checks passed.')"
    }
  }
];

export const QUANT_PYTHON_30_DAYS_CONFIGS: DayConfig[] = QUANT_SYSTEMS_30_DAYS_CONFIGS.map((cfg, i) => {
  const day = DAYS[i];
  return {
    ...cfg,
    eTitle: day.e.title,
    eDesc: day.e.desc,
    eStarter: day.e.starter,
    eHint: day.e.hint,
    eTest: day.e.test,
    aTitle: day.a.title,
    aDesc: day.a.desc,
    aStarter: day.a.starter,
    aHint: day.a.hint,
    aTest: day.a.test,
  };
});

export const QUANT_PYTHON_30_DAYS_QUESTS: CourseQuest[] = QUANT_PYTHON_30_DAYS_CONFIGS.flatMap((cfg, idx) =>
  buildEnrichedDayQuests('quant-py', idx + 1, cfg)
);
