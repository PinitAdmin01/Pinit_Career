import { buildEnrichedDayQuests, type DayConfig } from './curriculumEnricher';
import type { CourseQuest } from './coursesData';
import { MONTH2_LESSON_INDEX } from './month2LessonIndex';

interface RawM2DayTask {
  day: number;
  fallbackTitle: string;
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

const RAW_M2_DAY_TASKS: RawM2DayTask[] = [
  {
    "day": 31,
    "fallbackTitle": "Order Flow Imbalance (OFI) & Volume-Synchronized Probability of Informed Trading (VPIN)",
    "eTitle": "Multi-Level Cont-Kukanov Order Flow Imbalance Calculator",
    "eDesc": "Write `compute_ofi(snapshots: list[tuple[float, float, float, float]]) -> list[float]`: given consecutive BBO snapshots `(bid_p, bid_sz, ask_p, ask_sz)` compute single-tick Order Flow Imbalance between `t-1` and `t`: `dB = (bid_sz if bid_p > prev_bid_p else (-prev_bid_sz if bid_p < prev_bid_p else bid_sz - prev_bid_sz))` and `dA = (ask_sz if ask_p < prev_ask_p else (-prev_ask_sz if ask_p > prev_ask_p else ask_sz - prev_ask_sz))`; append `round(dB - dA, 4)`.",
    "eStarter": "def compute_ofi(snapshots: list[tuple[float, float, float, float]]) -> list[float]:\n    # TODO\n    pass",
    "eHint": "def compute_ofi(snapshots: list[tuple[float, float, float, float]]) -> list[float]:\n    out = []\n    for i in range(1, len(snapshots)):\n        pb, pbs, pa, pas = snapshots[i - 1]\n        cb, cbs, ca, cas = snapshots[i]\n        db = cbs if cb > pb else (-pbs if cb < pb else cbs - pbs)\n        da = cas if ca < pa else (-pas if ca > pa else cas - pas)\n        out.append(round(db - da, 4))\n    return out",
    "eTest": "snaps = [(100.0, 10.0, 101.0, 10.0), (100.0, 15.0, 101.0, 8.0), (100.5, 5.0, 101.5, 12.0)]\nassert compute_ofi(snaps) == [7.0, 13.0]\nassert compute_ofi([(10.0, 5.0, 11.0, 5.0)]) == []\nassert compute_ofi([]) == []\nprint('All checks passed.')",
    "aTitle": "Volume-Synchronized Probability of Informed Trading (VPIN) Bucketizer",
    "aDesc": "Write `compute_vpin(trades: list[tuple[float, str]], bucket_vol: float, window_buckets: int) -> float | None`: classify signed trades `(\"B\"|\"S\")` into equal-volume buckets of size `bucket_vol` (splitting trades across bucket boundaries if needed); return average `|Vb - Vs| / bucket_vol` over the last `window_buckets` full buckets rounded to 4 decimals (`None` if fewer than `window_buckets` full buckets).",
    "aStarter": "def compute_vpin(trades: list[tuple[float, str]], bucket_vol: float, window_buckets: int):\n    # TODO\n    pass",
    "aHint": "def compute_vpin(trades: list[tuple[float, str]], bucket_vol: float, window_buckets: int):\n    if bucket_vol <= 0 or window_buckets <= 0:\n        return None\n    buckets = []\n    cur_b = cur_s = filled = 0.0\n    for vol, side in trades:\n        rem = float(vol)\n        while rem > 1e-12:\n            take = min(rem, bucket_vol - filled)\n            if side == \"B\":\n                cur_b += take\n            else:\n                cur_s += take\n            filled += take\n            rem -= take\n            if filled >= bucket_vol - 1e-12:\n                buckets.append(abs(cur_b - cur_s) / bucket_vol)\n                cur_b = cur_s = filled = 0.0\n    if len(buckets) < window_buckets:\n        return None\n    tail = buckets[-window_buckets:]\n    return round(sum(tail) / window_buckets, 4)",
    "aTest": "ts = [(100.0, \"B\"), (60.0, \"B\"), (40.0, \"S\")]\nassert compute_vpin(ts, 100.0, 2) == 0.6\nassert compute_vpin([(50.0, \"B\"), (50.0, \"S\")], 100.0, 1) == 0.0\nassert compute_vpin([(50.0, \"B\")], 100.0, 1) is None\nprint('All checks passed.')"
  },
  {
    "day": 32,
    "fallbackTitle": "Kyle's Lambda Price Impact Regression & Adverse Selection Toxicity Scoring",
    "eTitle": "OLS Kyle's Lambda Price Impact Estimator",
    "eDesc": "Write `estimate_kyle_lambda(dp: list[float], signed_sqrt_vol: list[float]) -> float`: fit OLS slope without intercept (`lambda = sum(x_i * y_i) / sum(x_i^2)`) predicting mid-price move `dp` from signed square-root order flow `signed_sqrt_vol`. Round to 6 decimals (`0.0` if denominator is 0).",
    "eStarter": "def estimate_kyle_lambda(dp: list[float], signed_sqrt_vol: list[float]) -> float:\n    # TODO\n    pass",
    "eHint": "def estimate_kyle_lambda(dp: list[float], signed_sqrt_vol: list[float]) -> float:\n    num = sum(y * x for y, x in zip(dp, signed_sqrt_vol))\n    den = sum(x * x for x in signed_sqrt_vol)\n    return round(num / den, 6) if den > 1e-15 else 0.0",
    "eTest": "assert estimate_kyle_lambda([0.2, -0.4, 0.6], [2.0, -4.0, 6.0]) == 0.1\nassert estimate_kyle_lambda([0.05, 0.10], [1.0, 2.0]) == 0.05\nassert estimate_kyle_lambda([0.1], [0.0]) == 0.0\nprint('All checks passed.')",
    "aTitle": "Adverse Selection Spread Decomposition & Toxicity Classifier",
    "aDesc": "Write `score_adverse_selection(fills: list[dict], thresh: float = 0.05) -> dict`: each fill has `side (\"B\"|\"S\"), exec_p, mid_now, mid_future`. Compute signed realized spread `dir * (exec_p - mid_future)` and price impact `dir * (mid_future - mid_now)` where `dir=+1` for Buy, `-1` for Sell. Return mean `\"avg_impact\"`, `\"avg_realized\"`, and `\"toxic\"` (`avg_impact > thresh`).",
    "aStarter": "def score_adverse_selection(fills: list[dict], thresh: float = 0.05) -> dict:\n    # TODO\n    pass",
    "aHint": "def score_adverse_selection(fills: list[dict], thresh: float = 0.05) -> dict:\n    if not fills:\n        return {\"avg_impact\": 0.0, \"avg_realized\": 0.0, \"toxic\": False}\n    imps, reals = [], []\n    for f in fills:\n        d = 1.0 if f[\"side\"] == \"B\" else -1.0\n        imps.append(d * (f[\"mid_future\"] - f[\"mid_now\"]))\n        reals.append(d * (f[\"exec_p\"] - f[\"mid_future\"]))\n    ai = sum(imps) / len(imps)\n    ar = sum(reals) / len(reals)\n    return {\"avg_impact\": round(ai, 4), \"avg_realized\": round(ar, 4), \"toxic\": ai > thresh}",
    "aTest": "fs = [{\"side\": \"B\", \"exec_p\": 100.05, \"mid_now\": 100.0, \"mid_future\": 100.20}]\nassert score_adverse_selection(fs, 0.05) == {\"avg_impact\": 0.2, \"avg_realized\": -0.15, \"toxic\": True}\nassert score_adverse_selection([{\"side\": \"S\", \"exec_p\": 99.95, \"mid_now\": 100.0, \"mid_future\": 100.0}], 0.05)[\"toxic\"] is False\nassert score_adverse_selection([]) == {\"avg_impact\": 0.0, \"avg_realized\": 0.0, \"toxic\": False}\nprint('All checks passed.')"
  },
  {
    "day": 33,
    "fallbackTitle": "Avellaneda-Stoikov Market Making: Reservation Price & Optimal Inventory Skew",
    "eTitle": "Avellaneda-Stoikov Reservation Price & Optimal Spread Kernel",
    "eDesc": "Write `as_quotes(mid: float, q: int, gamma: float, sigma: float, horizon: float, kappa: float) -> tuple[float, float]`: compute reservation price `r = mid - q * gamma * (sigma ** 2) * horizon` and optimal total spread `delta = gamma * (sigma ** 2) * horizon + (2.0 / gamma) * math.log(1.0 + gamma / kappa)`. Return rounded `(bid, ask)` at `r - delta/2` and `r + delta/2` (4 decimals).",
    "eStarter": "import math\n\ndef as_quotes(mid: float, q: int, gamma: float, sigma: float, horizon: float, kappa: float) -> tuple[float, float]:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef as_quotes(mid: float, q: int, gamma: float, sigma: float, horizon: float, kappa: float) -> tuple[float, float]:\n    var_h = (sigma ** 2) * horizon\n    r = mid - q * gamma * var_h\n    delta = gamma * var_h + (2.0 / gamma) * math.log(1.0 + gamma / kappa)\n    return round(r - delta / 2.0, 4), round(r + delta / 2.0, 4)",
    "eTest": "b0, a0 = as_quotes(100.0, 0, 0.1, 2.0, 1.0, 1.5)\nb_long, a_long = as_quotes(100.0, 5, 0.1, 2.0, 1.0, 1.5)\nassert round((b0 + a0) / 2, 4) == 100.0 and a0 > b0\nassert b_long < b0 and a_long < a0\nassert round(100.0 - (b_long + a_long) / 2, 4) == 2.0\nprint('All checks passed.')",
    "aTitle": "Inventory-Capped Asymmetric Quote Clamper",
    "aDesc": "Write `clamp_inventory_quotes(bid: float, ask: float, mid: float, inv: int, max_inv: int, tick: float) -> dict`: snap bid down to nearest `tick` multiple and ask up to nearest `tick`; disable `\"bid_active\": False` if `inv >= max_inv`, disable `\"ask_active\": False` if `inv <= -max_inv`, ensuring `ask - bid >= tick`.",
    "aStarter": "import math\n\ndef clamp_inventory_quotes(bid: float, ask: float, mid: float, inv: int, max_inv: int, tick: float) -> dict:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef clamp_inventory_quotes(bid: float, ask: float, mid: float, inv: int, max_inv: int, tick: float) -> dict:\n    sb = round(math.floor((bid + 1e-12) / tick) * tick, 6)\n    sa = round(math.ceil((ask - 1e-12) / tick) * tick, 6)\n    if sa - sb < tick - 1e-12:\n        sa = round(sb + tick, 6)\n    return {\"bid\": sb, \"ask\": sa, \"bid_active\": inv < max_inv, \"ask_active\": inv > -max_inv}",
    "aTest": "assert clamp_inventory_quotes(99.93, 100.06, 100.0, 0, 10, 0.05) == {\"bid\": 99.9, \"ask\": 100.1, \"bid_active\": True, \"ask_active\": True}\nassert clamp_inventory_quotes(100.01, 100.01, 100.0, 10, 10, 0.05) == {\"bid\": 100.0, \"ask\": 100.05, \"bid_active\": False, \"ask_active\": True}\nassert clamp_inventory_quotes(99.9, 100.1, 100.0, -10, 10, 0.1)[\"ask_active\"] is False\nprint('All checks passed.')"
  },
  {
    "day": 34,
    "fallbackTitle": "Queue Position Valuation, Fill Probability Hazard Rates & Cancellation Latency",
    "eTitle": "FIFO Queue Fill Probability & Race-to-Cancel Simulator",
    "eDesc": "Write `simulate_queue_fill(qty_ahead: int, my_qty: int, events: list[tuple[str, int, int]], cancel_latency_us: int, cancel_send_us: int) -> dict`: replay `(kind, ts_us, qty)` where `\"CANCEL_AHEAD\"` reduces `qty_ahead`, `\"TRADE\"` first consumes `qty_ahead` then `my_qty` at `ts_us`. If cancel arrives at `cancel_send_us + cancel_latency_us` BEFORE full exhaustion, cancel remainder. Return `{\"filled\": int, \"cancelled\": int}`.",
    "eStarter": "def simulate_queue_fill(qty_ahead: int, my_qty: int, events: list[tuple[str, int, int]], cancel_latency_us: int, cancel_send_us: int) -> dict:\n    # TODO\n    pass",
    "eHint": "def simulate_queue_fill(qty_ahead: int, my_qty: int, events: list[tuple[str, int, int]], cancel_latency_us: int, cancel_send_us: int) -> dict:\n    cancel_at = cancel_send_us + cancel_latency_us\n    ahead, rem, filled = qty_ahead, my_qty, 0\n    for kind, ts, qty in sorted(events, key=lambda x: x[1]):\n        if ts >= cancel_at or rem == 0:\n            break\n        if kind == \"CANCEL_AHEAD\":\n            ahead = max(0, ahead - qty)\n        elif kind == \"TRADE\":\n            take_ahead = min(ahead, qty)\n            ahead -= take_ahead\n            left = qty - take_ahead\n            if left > 0:\n                fill = min(rem, left)\n                rem -= fill\n                filled += fill\n    return {\"filled\": filled, \"cancelled\": rem}",
    "eTest": "evs = [(\"CANCEL_AHEAD\", 10, 5), (\"TRADE\", 20, 8), (\"TRADE\", 50, 10)]\nassert simulate_queue_fill(10, 5, evs, 15, 25) == {\"filled\": 3, \"cancelled\": 2}\nassert simulate_queue_fill(10, 5, evs, 50, 25) == {\"filled\": 5, \"cancelled\": 0}\nassert simulate_queue_fill(5, 4, [], 10, 0) == {\"filled\": 0, \"cancelled\": 4}\nprint('All checks passed.')",
    "aTitle": "Exponential Fill Hazard & Adverse Fill Expected PnL",
    "aDesc": "Write `expected_quote_ev(spread_capture: float, adverse_loss: float, q_ahead: float, hazard_rate: float, horizon: float) -> dict`: fill probability scales as `1 - exp(-hazard_rate * horizon / (1 + q_ahead))`. Compute `fill_prob`, `expected_ev = fill_prob * (spread_capture - adverse_loss)`, and `\"quote\": ev > 0`. Round floats to 6 decimals.",
    "aStarter": "import math\n\ndef expected_quote_ev(spread_capture: float, adverse_loss: float, q_ahead: float, hazard_rate: float, horizon: float) -> dict:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef expected_quote_ev(spread_capture: float, adverse_loss: float, q_ahead: float, hazard_rate: float, horizon: float) -> dict:\n    fp = 1.0 - math.exp(-hazard_rate * horizon / (1.0 + q_ahead))\n    ev = fp * (spread_capture - adverse_loss)\n    return {\"fill_prob\": round(fp, 6), \"expected_ev\": round(ev, 6), \"quote\": ev > 0}",
    "aTest": "r = expected_quote_ev(0.05, 0.02, 0.0, 1.0, 1.0)\nassert abs(r[\"fill_prob\"] - 0.632121) < 1e-5 and r[\"quote\"] is True\nassert expected_quote_ev(0.01, 0.05, 1.0, 2.0, 1.0)[\"quote\"] is False\nassert expected_quote_ev(0.05, 0.01, 5.0, 0.0, 1.0) == {\"fill_prob\": 0.0, \"expected_ev\": 0.0, \"quote\": False}\nprint('All checks passed.')"
  },
  {
    "day": 35,
    "fallbackTitle": "Milestone 7: Microstructure Alpha & Inventory-Skewed Market Maker",
    "eTitle": "Milestone 7A: OFI-Driven Reservation Price & Toxicity Quote Guard",
    "eDesc": "Write `mm_step_quote(mid: float, ofi_alpha: float, inv: int, max_inv: int, kyle_lam: float, tick: float) -> dict`: adjust theoretical mid to `mid + ofi_alpha - inv * 0.02`, widen half-spread `h = tick + max(0.0, kyle_lam)`, round bid down / ask up to `tick`, and halt quoting side on `abs(inv) >= max_inv`.",
    "eStarter": "import math\n\ndef mm_step_quote(mid: float, ofi_alpha: float, inv: int, max_inv: int, kyle_lam: float, tick: float) -> dict:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef mm_step_quote(mid: float, ofi_alpha: float, inv: int, max_inv: int, kyle_lam: float, tick: float) -> dict:\n    r = mid + ofi_alpha - inv * 0.02\n    h = tick + max(0.0, kyle_lam)\n    bid = round(math.floor((r - h + 1e-12) / tick) * tick, 6)\n    ask = round(math.ceil((r + h - 1e-12) / tick) * tick, 6)\n    return {\"bid\": bid, \"ask\": ask, \"bid_on\": inv < max_inv, \"ask_on\": inv > -max_inv}",
    "eTest": "q1 = mm_step_quote(100.0, 0.05, 0, 5, 0.02, 0.05)\nassert q1[\"bid\"] < 100.05 < q1[\"ask\"] and q1[\"bid_on\"] and q1[\"ask_on\"]\nq2 = mm_step_quote(100.0, 0.0, 5, 5, 0.0, 0.05)\nassert q2[\"bid_on\"] is False and q2[\"ask_on\"] is True\nassert mm_step_quote(100.0, 0.0, -5, 5, 0.0, 0.05)[\"ask_on\"] is False\nprint('All checks passed.')",
    "aTitle": "Milestone 7B: End-to-End Fill Marking-to-Market & Sharpe Microstructure Replay",
    "aDesc": "Write `replay_mm_pnl(events: list[tuple[str, float, float]]) -> dict`: step through `(side \"B\"|\"S\"|\"MARK\", price, qty)` tracking `cash`, `inventory`, and realized+MTM equity at each event (marking at `price`). Return final `{\"inventory\": int, \"cash\": round(..., 4), \"equity\": round(..., 4), \"max_abs_inv\": int}`.",
    "aStarter": "def replay_mm_pnl(events: list[tuple[str, float, float]]) -> dict:\n    # TODO\n    pass",
    "aHint": "def replay_mm_pnl(events: list[tuple[str, float, float]]) -> dict:\n    cash = 0.0\n    inv = 0.0\n    last_p = 0.0\n    max_inv = 0.0\n    for side, p, q in events:\n        last_p = p\n        if side == \"B\":\n            inv += q\n            cash -= p * q\n        elif side == \"S\":\n            inv -= q\n            cash += p * q\n        max_inv = max(max_inv, abs(inv))\n    eq = cash + inv * last_p\n    return {\"inventory\": int(inv), \"cash\": round(cash, 4), \"equity\": round(eq, 4), \"max_abs_inv\": int(max_inv)}",
    "aTest": "evs = [(\"B\", 99.9, 10), (\"S\", 100.1, 10)]\nassert replay_mm_pnl(evs) == {\"inventory\": 0, \"cash\": 2.0, \"equity\": 2.0, \"max_abs_inv\": 10}\nassert replay_mm_pnl([(\"B\", 100.0, 5), (\"MARK\", 102.0, 0)]) == {\"inventory\": 5, \"cash\": -500.0, \"equity\": 10.0, \"max_abs_inv\": 5}\nassert replay_mm_pnl([]) == {\"inventory\": 0, \"cash\": 0.0, \"equity\": 0.0, \"max_abs_inv\": 0}\nprint('All checks passed.')"
  },
  {
    "day": 36,
    "fallbackTitle": "Ornstein-Uhlenbeck Mean Reversion Calibration & Half-Life Estimation",
    "eTitle": "AR(1) Half-Life Estimator for Mean-Reverting Spreads",
    "eDesc": "Write `estimate_ou_halflife(series: list[float]) -> float | None`: regress `dx_t = x_{t+1} - x_t` onto `[1, x_t]` (`dx = alpha + lambda * x_t`) via 2-variable OLS. If `lambda >= 0`, return `None` (not mean-reverting); else return half-life `-math.log(2) / math.log(1 + lambda)` if `1 + lambda > 0` else `-math.log(2) / lambda`, rounded to 4 decimals.",
    "eStarter": "import math\n\ndef estimate_ou_halflife(series: list[float]):\n    # TODO\n    pass",
    "eHint": "import math\n\ndef estimate_ou_halflife(series: list[float]):\n    if len(series) < 3:\n        return None\n    xs = series[:-1]\n    dxs = [series[i + 1] - series[i] for i in range(len(xs))]\n    mx = sum(xs) / len(xs)\n    my = sum(dxs) / len(dxs)\n    var_x = sum((x - mx) ** 2 for x in xs)\n    if var_x <= 1e-15:\n        return None\n    lam = sum((x - mx) * (y - my) for x, y in zip(xs, dxs)) / var_x\n    if lam >= -1e-12:\n        return None\n    hl = (-math.log(2.0) / math.log(1.0 + lam)) if (1.0 + lam > 1e-12) else (-math.log(2.0) / lam)\n    return round(hl, 4)",
    "eTest": "s = [1.0, 0.5, 0.25, 0.125, 0.0625]\nassert estimate_ou_halflife(s) == 1.0\nassert estimate_ou_halflife([1.0, 2.0, 4.0, 8.0]) is None\nassert estimate_ou_halflife([1.0, 2.0]) is None\nprint('All checks passed.')",
    "aTitle": "Z-Score Ornstein-Uhlenbeck Hysteresis Signal Generator",
    "aDesc": "Write `ou_zscore_positions(spreads: list[float], mu: float, sigma: float, entry_z: float = 2.0, exit_z: float = 0.5) -> list[int]`: iterate spreads computing `z = (x - mu) / sigma`; enter `+1` when `pos == 0 and z <= -entry_z`, `-1` when `pos == 0 and z >= entry_z`, exit to `0` when `(pos == 1 and z >= -exit_z)` or `(pos == -1 and z <= exit_z)`.",
    "aStarter": "def ou_zscore_positions(spreads: list[float], mu: float, sigma: float, entry_z: float = 2.0, exit_z: float = 0.5) -> list[int]:\n    # TODO\n    pass",
    "aHint": "def ou_zscore_positions(spreads: list[float], mu: float, sigma: float, entry_z: float = 2.0, exit_z: float = 0.5) -> list[int]:\n    out = []\n    pos = 0\n    for x in spreads:\n        z = (x - mu) / sigma\n        if pos == 0:\n            if z <= -entry_z:\n                pos = 1\n            elif z >= entry_z:\n                pos = -1\n        elif pos == 1 and z >= -exit_z:\n            pos = 0\n        elif pos == -1 and z <= exit_z:\n            pos = 0\n        out.append(pos)\n    return out",
    "aTest": "assert ou_zscore_positions([0.0, -2.5, -1.0, -0.2, 2.2, 0.4], 0.0, 1.0) == [0, 1, 1, 0, -1, 0]\nassert ou_zscore_positions([0.5, -0.5], 0.0, 1.0) == [0, 0]\nassert ou_zscore_positions([], 0.0, 1.0) == []\nprint('All checks passed.')"
  },
  {
    "day": 37,
    "fallbackTitle": "Engle-Granger Cointegration, Johansen Eigenvectors & Dynamic Hedge Ratios",
    "eTitle": "Engle-Granger OLS Hedge Ratio & Dickey-Fuller t-Statistic",
    "eDesc": "Write `engle_granger_stat(y: list[float], x: list[float]) -> dict`: fit OLS `y = alpha + beta * x`, extract residual `e_t = y_t - (alpha + beta * x_t)`, then regress `de_t = rho * e_{t-1}` (no intercept) computing `t_stat = rho / se(rho)`. Return `{\"beta\": round(beta, 4), \"df_t\": round(t_stat, 4)}`.",
    "eStarter": "import math\n\ndef engle_granger_stat(y: list[float], x: list[float]) -> dict:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef engle_granger_stat(y: list[float], x: list[float]) -> dict:\n    n = len(x)\n    mx, my = sum(x) / n, sum(y) / n\n    vx = sum((xi - mx) ** 2 for xi in x)\n    beta = sum((xi - mx) * (yi - my) for xi, yi in zip(x, y)) / vx\n    alpha = my - beta * mx\n    res = [yi - (alpha + beta * xi) for xi, yi in zip(x, y)]\n    e0, de = res[:-1], [res[i + 1] - res[i] for i in range(n - 1)]\n    s_ee = sum(v * v for v in e0)\n    rho = sum(v * d for v, d in zip(e0, de)) / s_ee if s_ee > 1e-15 else 0.0\n    rss = sum((d - rho * v) ** 2 for v, d in zip(e0, de))\n    s2 = rss / max(1, len(e0) - 1)\n    se = math.sqrt(s2 / s_ee) if s_ee > 1e-15 else 1.0\n    tstat = (rho / se) if se > 1e-15 else -999.0\n    return {\"beta\": round(beta, 4), \"df_t\": round(tstat, 4)}",
    "eTest": "xs = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0]\nys = [2.0 * x + e for x, e in zip(xs, [0.4, -0.2, 0.3, -0.15, 0.2, -0.1])]\nr = engle_granger_stat(ys, xs)\nassert abs(r[\"beta\"] - 2.0) < 0.2\nassert r[\"df_t\"] < -2.0\nr2 = engle_granger_stat([x + (-1)**i * 0.1 for i, x in enumerate(xs)], xs)\nassert abs(r2[\"beta\"] - 1.0) < 0.1\nprint('All checks passed.')",
    "aTitle": "Rolling Window Dynamic Hedge Ratio Basket Rebalancer",
    "aDesc": "Write `rolling_ols_hedge(y: list[float], x: list[float], win: int) -> list[float]`: for each ending index `t >= win - 1`, compute OLS slope `beta_t` of `y[t-win+1:t+1]` on `x[t-win+1:t+1]` rounded to 4 decimals (`0.0` if `x` variance in window is 0).",
    "aStarter": "def rolling_ols_hedge(y: list[float], x: list[float], win: int) -> list[float]:\n    # TODO\n    pass",
    "aHint": "def rolling_ols_hedge(y: list[float], x: list[float], win: int) -> list[float]:\n    out = []\n    for t in range(win - 1, len(x)):\n        xw = x[t - win + 1:t + 1]\n        yw = y[t - win + 1:t + 1]\n        mx, my = sum(xw) / win, sum(yw) / win\n        vx = sum((v - mx) ** 2 for v in xw)\n        out.append(round(sum((a - mx) * (b - my) for a, b in zip(xw, yw)) / vx, 4) if vx > 1e-15 else 0.0)\n    return out",
    "aTest": "assert rolling_ols_hedge([2, 4, 6, 9, 12], [1, 2, 3, 4, 5], 3) == [2.0, 2.5, 3.0]\nassert rolling_ols_hedge([5, 5, 5], [1, 1, 1], 3) == [0.0]\nassert rolling_ols_hedge([1, 2], [1, 2], 4) == []\nprint('All checks passed.')"
  },
  {
    "day": 38,
    "fallbackTitle": "Kalman Filter State-Space Tracking for Time-Varying Beta Spreads",
    "eTitle": "Online 2D Kalman Filter Regression Tracker `[alpha, beta]`",
    "eDesc": "Write `kalman_beta_track(ys: list[float], xs: list[float], delta: float = 1e-4, r_var: float = 1e-3) -> list[tuple[float, float]]`: maintain state `theta = [0.0, 0.0]` and covariance `P = [[1,0],[0,1]]` with process noise `Q = (delta/(1-delta)) * I`. On step `(y_t, x_t)`, predict `P += Q`, observe `H = [1.0, x_t]`, compute innovation `e = y_t - H·theta`, `S = H P H^T + r_var`, Kalman gain `K = P H^T / S`, update `theta += K * e`, `P = P - K (H P)`. Return `[(round(a,4), round(b,4))]`.",
    "eStarter": "def kalman_beta_track(ys: list[float], xs: list[float], delta: float = 1e-4, r_var: float = 1e-3) -> list[tuple[float, float]]:\n    # TODO\n    pass",
    "eHint": "def kalman_beta_track(ys: list[float], xs: list[float], delta: float = 1e-4, r_var: float = 1e-3) -> list[tuple[float, float]]:\n    a, b = 0.0, 0.0\n    p00, p01, p11 = 1.0, 0.0, 1.0\n    q = delta / (1.0 - delta)\n    out = []\n    for y, x in zip(ys, xs):\n        p00 += q; p11 += q\n        err = y - (a + b * x)\n        hp0 = p00 + p01 * x\n        hp1 = p01 + p11 * x\n        s = hp0 + hp1 * x + r_var\n        k0, k1 = hp0 / s, hp1 / s\n        a += k0 * err\n        b += k1 * err\n        np00 = p00 - k0 * hp0\n        np01 = p01 - k0 * hp1\n        np11 = p11 - k1 * hp1\n        p00, p01, p11 = np00, np01, np11\n        out.append((round(a, 4), round(b, 4)))\n    return out",
    "eTest": "xs = [float(i) for i in range(1, 20)]\nys = [1.0 + 2.0 * x for x in xs]\nres = kalman_beta_track(ys, xs, delta=1e-3, r_var=1e-3)\nassert abs(res[-1][1] - 2.0) < 0.05 and abs(res[-1][0] - 1.0) < 0.1\nassert len(res) == 19\nassert kalman_beta_track([], []) == []\nprint('All checks passed.')",
    "aTitle": "Standardized Kalman Innovation Z-Score Detector",
    "aDesc": "Write `kalman_innovation_signals(errs: list[float], S_vars: list[float], z_thresh: float = 2.0) -> list[int]`: compute innovation z-score `z_t = errs[t] / math.sqrt(S_vars[t])`, emitting `-1` when `z_t >= z_thresh` (spread rich, short spread), `+1` when `z_t <= -z_thresh` (spread cheap, long spread), else `0`.",
    "aStarter": "import math\n\ndef kalman_innovation_signals(errs: list[float], S_vars: list[float], z_thresh: float = 2.0) -> list[int]:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef kalman_innovation_signals(errs: list[float], S_vars: list[float], z_thresh: float = 2.0) -> list[int]:\n    out = []\n    for e, s in zip(errs, S_vars):\n        z = e / math.sqrt(s) if s > 0 else 0.0\n        out.append(-1 if z >= z_thresh else (1 if z <= -z_thresh else 0))\n    return out",
    "aTest": "assert kalman_innovation_signals([0.4, -0.5, 0.1], [0.04, 0.04, 0.04], 2.0) == [-1, 1, 0]\nassert kalman_innovation_signals([1.0], [0.0], 2.0) == [0]\nassert kalman_innovation_signals([], []) == []\nprint('All checks passed.')"
  },
  {
    "day": 39,
    "fallbackTitle": "Cross-Sectional Factor Neutralization: Dollar, Beta & Sector Z-Score Ranking",
    "eTitle": "Sector-Demeaned Cross-Sectional Z-Score Ranker",
    "eDesc": "Write `sector_neutral_zscores(alphas: dict[str, float], sectors: dict[str, str]) -> dict[str, float]`: for each sector, subtract sector mean alpha, divide by sector population std (`0.0` if std == 0), and round to 4 decimals.",
    "eStarter": "import math\n\ndef sector_neutral_zscores(alphas: dict[str, float], sectors: dict[str, str]) -> dict[str, float]:\n    # TODO\n    pass",
    "eHint": "import math\nfrom collections import defaultdict\n\ndef sector_neutral_zscores(alphas: dict[str, float], sectors: dict[str, str]) -> dict[str, float]:\n    by_sec = defaultdict(list)\n    for sym, val in alphas.items():\n        by_sec[sectors[sym]].append(sym)\n    out = {}\n    for syms in by_sec.values():\n        vals = [alphas[s] for s in syms]\n        mu = sum(vals) / len(vals)\n        sd = math.sqrt(sum((v - mu) ** 2 for v in vals) / len(vals))\n        for s in syms:\n            out[s] = round((alphas[s] - mu) / sd, 4) if sd > 1e-12 else 0.0\n    return out",
    "eTest": "als = {\"A\": 1.0, \"B\": 3.0, \"C\": 10.0, \"D\": 10.0}\nsecs = {\"A\": \"tech\", \"B\": \"tech\", \"C\": \"fin\", \"D\": \"fin\"}\nassert sector_neutral_zscores(als, secs) == {\"A\": -1.0, \"B\": 1.0, \"C\": 0.0, \"D\": 0.0}\nassert sector_neutral_zscores({}, {}) == {}\nassert sector_neutral_zscores({\"X\": 5.0}, {\"X\": \"util\"}) == {\"X\": 0.0}\nprint('All checks passed.')",
    "aTitle": "Dollar & Portfolio-Beta Neutral Weight Projectors",
    "aDesc": "Write `neutralize_dollar_and_beta(raw_w: list[float], betas: list[float]) -> list[float]`: demean `raw_w` (`w1 = raw_w - mean(raw_w)`), compute orthogonal component to centered beta `db = betas - mean(betas)`, subtract projection `w2 = w1 - ((w1·db)/(db·db)) * db` so both `sum(w2) ~= 0` and `sum(w2 * betas) ~= 0`. Round to 6 decimals.",
    "aStarter": "def neutralize_dollar_and_beta(raw_w: list[float], betas: list[float]) -> list[float]:\n    # TODO\n    pass",
    "aHint": "def neutralize_dollar_and_beta(raw_w: list[float], betas: list[float]) -> list[float]:\n    n = len(raw_w)\n    if n == 0:\n        return []\n    mw, mb = sum(raw_w) / n, sum(betas) / n\n    w1 = [w - mw for w in raw_w]\n    db = [b - mb for b in betas]\n    denom = sum(d * d for d in db)\n    coeff = sum(a * d for a, d in zip(w1, db)) / denom if denom > 1e-15 else 0.0\n    return [round(a - coeff * d, 6) for a, d in zip(w1, db)]",
    "aTest": "w = neutralize_dollar_and_beta([1.0, 2.0, 3.0, 4.0], [0.8, 1.2, 1.5, 0.9])\nassert len(w) == 4 and any(abs(v) > 0.05 for v in w)\nassert abs(sum(w)) < 1e-5\nassert abs(sum(wi * bi for wi, bi in zip(w, [0.8, 1.2, 1.5, 0.9]))) < 1e-5\nassert neutralize_dollar_and_beta([], []) == []\nprint('All checks passed.')"
  },
  {
    "day": 40,
    "fallbackTitle": "Milestone 8: Statistical Arbitrage & Kalman Pairs Trading Engine",
    "eTitle": "Milestone 8A: Co-integrated Pair Screening & Half-Life Gate",
    "eDesc": "Write `screen_statarb_pairs(pairs: list[dict], max_p_df: float, max_halflife: float) -> list[str]`: select pair IDs satisfying `df_t <= max_p_df` and `0 < halflife <= max_halflife`, sorted ascending by `halflife` then `id`.",
    "eStarter": "def screen_statarb_pairs(pairs: list[dict], max_p_df: float, max_halflife: float) -> list[str]:\n    # TODO\n    pass",
    "eHint": "def screen_statarb_pairs(pairs: list[dict], max_p_df: float, max_halflife: float) -> list[str]:\n    ok = [p for p in pairs if p[\"df_t\"] <= max_p_df and p[\"halflife\"] is not None and 0 < p[\"halflife\"] <= max_halflife]\n    ok.sort(key=lambda p: (p[\"halflife\"], p[\"id\"]))\n    return [p[\"id\"] for p in ok]",
    "eTest": "ps = [{\"id\": \"KO-PEP\", \"df_t\": -4.1, \"halflife\": 8.0}, {\"id\": \"X-Y\", \"df_t\": -3.9, \"halflife\": 4.0}, {\"id\": \"BAD\", \"df_t\": -1.0, \"halflife\": 3.0}]\nassert screen_statarb_pairs(ps, -3.4, 15.0) == [\"X-Y\", \"KO-PEP\"]\nassert screen_statarb_pairs(ps, -5.0, 15.0) == []\nassert screen_statarb_pairs([{\"id\": \"Z\", \"df_t\": -4.0, \"halflife\": None}], -3.0, 10.0) == []\nprint('All checks passed.')",
    "aTitle": "Milestone 8B: Pairs Beta-Weighted PnL & Turnover Backtester",
    "aDesc": "Write `backtest_pair_spread(y: list[float], x: list[float], beta: float, pos: list[int], fee_bps: float = 0.0) -> dict`: for `t >= 1`, step PnL uses prior position `pos[t-1] * ((y[t]-y[t-1]) - beta*(x[t]-x[t-1]))` minus turnover cost `abs(pos[t] - pos[t-1]) * (abs(y[t]) + abs(beta * x[t])) * (fee_bps / 10000.0)` plus initial entry cost at `t=0`. Return `{\"net_pnl\": round(..., 4), \"trades\": count_pos_changes}`.",
    "aStarter": "def backtest_pair_spread(y: list[float], x: list[float], beta: float, pos: list[int], fee_bps: float = 0.0) -> dict:\n    # TODO\n    pass",
    "aHint": "def backtest_pair_spread(y: list[float], x: list[float], beta: float, pos: list[int], fee_bps: float = 0.0) -> dict:\n    if not y:\n        return {\"net_pnl\": 0.0, \"trades\": 0}\n    pnl = -abs(pos[0]) * (abs(y[0]) + abs(beta * x[0])) * (fee_bps / 10000.0)\n    trades = 1 if pos[0] != 0 else 0\n    for t in range(1, len(y)):\n        pnl += pos[t - 1] * ((y[t] - y[t - 1]) - beta * (x[t] - x[t - 1]))\n        dpos = abs(pos[t] - pos[t - 1])\n        if dpos > 0:\n            trades += 1\n            pnl -= dpos * (abs(y[t]) + abs(beta * x[t])) * (fee_bps / 10000.0)\n    return {\"net_pnl\": round(pnl, 4), \"trades\": trades}",
    "aTest": "assert backtest_pair_spread([100.0, 102.0, 101.0], [50.0, 50.0, 50.0], 2.0, [1, 1, 0], 0.0) == {\"net_pnl\": 1.0, \"trades\": 2}\nassert backtest_pair_spread([100.0, 100.0], [50.0, 50.0], 2.0, [1, 0], 10.0)[\"net_pnl\"] == -0.4\nassert backtest_pair_spread([], [], 1.0, []) == {\"net_pnl\": 0.0, \"trades\": 0}\nprint('All checks passed.')"
  },
  {
    "day": 41,
    "fallbackTitle": "Grinold-Kahn Fundamental Law of Active Management: IC, Breadth & Transfer Coefficient",
    "eTitle": "Rank Information Coefficient (Spearman IC) & IR Evaluator",
    "eDesc": "Write `compute_rank_ic(scores: list[float], fwd_rets: list[float]) -> float`: rank both sequences (average rank for ties, simple index rank when distinct), compute Pearson correlation between rank vectors (`round(..., 4)`). Return `0.0` if length `< 2` or zero variance.",
    "eStarter": "import math\n\ndef compute_rank_ic(scores: list[float], fwd_rets: list[float]) -> float:\n    # TODO\n    pass",
    "eHint": "import math\nfrom collections import defaultdict\n\ndef _ranks(vals):\n    by_v = defaultdict(list)\n    for i, v in enumerate(sorted(vals)):\n        by_v[v].append(i + 1)\n    avg = {v: sum(idxs) / len(idxs) for v, idxs in by_v.items()}\n    return [avg[v] for v in vals]\n\ndef compute_rank_ic(scores: list[float], fwd_rets: list[float]) -> float:\n    if len(scores) < 2:\n        return 0.0\n    rx, ry = _ranks(scores), _ranks(fwd_rets)\n    mx, my = sum(rx) / len(rx), sum(ry) / len(ry)\n    dx = [a - mx for a in rx]\n    dy = [b - my for b in ry]\n    denom = math.sqrt(sum(a * a for a in dx) * sum(b * b for b in dy))\n    return round(sum(a * b for a, b in zip(dx, dy)) / denom, 4) if denom > 1e-12 else 0.0",
    "eTest": "assert compute_rank_ic([1, 2, 3, 4], [0.01, 0.02, 0.03, 0.04]) == 1.0\nassert compute_rank_ic([4, 3, 2, 1], [0.01, 0.02, 0.03, 0.04]) == -1.0\nassert compute_rank_ic([1, 1, 1], [0.1, 0.2, 0.3]) == 0.0\nprint('All checks passed.')",
    "aTitle": "Full Grinold-Kahn Information Ratio (TC * IC * sqrt(BR))",
    "aDesc": "Write `fundamental_law_ir(ic: float, breadth: int, unconstrained_alphas: list[float], realized_weights: list[float]) -> dict`: compute Transfer Coefficient `TC = corr(unconstrained_alphas, realized_weights)` (`0.0` if zero variance) and `IR = TC * ic * math.sqrt(breadth)`, rounded to 4 decimals.",
    "aStarter": "import math\n\ndef fundamental_law_ir(ic: float, breadth: int, unconstrained_alphas: list[float], realized_weights: list[float]) -> dict:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef fundamental_law_ir(ic: float, breadth: int, unconstrained_alphas: list[float], realized_weights: list[float]) -> dict:\n    n = len(unconstrained_alphas)\n    if n < 2:\n        return {\"tc\": 0.0, \"ir\": 0.0}\n    mx, my = sum(unconstrained_alphas) / n, sum(realized_weights) / n\n    dx = [a - mx for a in unconstrained_alphas]\n    dy = [b - my for b in realized_weights]\n    den = math.sqrt(sum(a * a for a in dx) * sum(b * b for b in dy))\n    tc = sum(a * b for a, b in zip(dx, dy)) / den if den > 1e-15 else 0.0\n    ir = tc * ic * math.sqrt(max(0, breadth))\n    return {\"tc\": round(tc, 4), \"ir\": round(ir, 4)}",
    "aTest": "assert fundamental_law_ir(0.05, 400, [1.0, 2.0, 3.0], [0.1, 0.2, 0.3]) == {\"tc\": 1.0, \"ir\": 1.0}\nassert fundamental_law_ir(0.05, 400, [1.0, 2.0, 3.0], [0.1, 0.1, 0.1]) == {\"tc\": 0.0, \"ir\": 0.0}\nassert fundamental_law_ir(0.04, 100, [-1.0, 1.0], [-0.5, 0.5])[\"ir\"] == 0.4\nprint('All checks passed.')"
  },
  {
    "day": 42,
    "fallbackTitle": "Almgren-Chriss Optimal Execution Trajectory with Risk-Aversion Decay",
    "eTitle": "Almgren-Chriss Analytical Exponential Liquidation Schedule",
    "eDesc": "Write `almgren_chriss_schedule(X: float, N: int, kappa: float) -> list[float]`: compute remaining inventory trajectory `x_j = X * sinh(kappa * (N - j)) / sinh(kappa * N)` for `j=0..N` (linear TWAP `X * (N - j) / N` when `kappa == 0`), and return positive trade sizes `[round(x_{j-1} - x_j, 4) for j in 1..N]` summing to `X`.",
    "eStarter": "import math\n\ndef almgren_chriss_schedule(X: float, N: int, kappa: float) -> list[float]:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef almgren_chriss_schedule(X: float, N: int, kappa: float) -> list[float]:\n    if N <= 0:\n        return []\n    if abs(kappa) < 1e-9:\n        return [round(X / N, 4) for _ in range(N)]\n    denom = math.sinh(kappa * N)\n    rem = [X * math.sinh(kappa * (N - j)) / denom for j in range(N + 1)]\n    return [round(rem[j - 1] - rem[j], 4) for j in range(1, N + 1)]",
    "eTest": "assert almgren_chriss_schedule(1000.0, 4, 0.0) == [250.0, 250.0, 250.0, 250.0]\nfront = almgren_chriss_schedule(1000.0, 4, 0.8)\nassert front[0] > front[-1] and abs(sum(front) - 1000.0) < 0.01\nassert almgren_chriss_schedule(100.0, 0, 0.5) == []\nprint('All checks passed.')",
    "aTitle": "Volume-Profile VWAP Slice Allocator & Participation Cap Enforcer",
    "aDesc": "Write `allocate_vwap_slices(parent_qty: int, vol_curve: list[int], max_pov: float) -> list[int]`: allocate `parent_qty` proportionally across `vol_curve` buckets while capping each bucket slice at `floor(vol * max_pov)`. Carry over unplaced surplus greedily into remaining buckets with spare POV headroom; return per-bucket integer quantities.",
    "aStarter": "import math\n\ndef allocate_vwap_slices(parent_qty: int, vol_curve: list[int], max_pov: float) -> list[int]:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef allocate_vwap_slices(parent_qty: int, vol_curve: list[int], max_pov: float) -> list[int]:\n    tot_v = sum(vol_curve)\n    if tot_v <= 0 or parent_qty <= 0:\n        return [0] * len(vol_curve)\n    caps = [int(math.floor(v * max_pov + 1e-9)) for v in vol_curve]\n    alloc = [min(caps[i], int(math.floor(parent_qty * (v / tot_v)))) for i, v in enumerate(vol_curve)]\n    rem = parent_qty - sum(alloc)\n    for i in range(len(alloc)):\n        add = min(rem, caps[i] - alloc[i])\n        alloc[i] += add\n        rem -= add\n    return alloc",
    "aTest": "assert allocate_vwap_slices(100, [1000, 1000], 0.2) == [50, 50]\nassert allocate_vwap_slices(100, [200, 800], 0.1) == [20, 80]\nassert allocate_vwap_slices(50, [100, 100], 0.1) == [10, 10]\nprint('All checks passed.')"
  },
  {
    "day": 43,
    "fallbackTitle": "Limit Order Book Reconstruction from L3 ITCH Add/Modify/Delete Event Streams",
    "eTitle": "L3 Order Book Top-of-Book Reconstructor (`ADD`/`CANCEL`/`EXEC`)",
    "eDesc": "Implement `OrderBookL3`: `process(kind, oid, side=None, price=0.0, qty=0)` handling `\"ADD\"` (`oid, side \"B\"|\"S\", price, qty`), `\"CANCEL\"` (`oid`), and `\"EXEC\"` (`oid, qty` reducing order and deleting if `<= 0`). `bbo() -> tuple[float | None, float | None]` returns `(best_bid, best_ask)`.",
    "eStarter": "class OrderBookL3:\n    def __init__(self):\n        # TODO\n        pass\n\n    def process(self, kind: str, oid: int, side=None, price: float = 0.0, qty: int = 0):\n        # TODO\n        pass\n\n    def bbo(self):\n        # TODO\n        pass",
    "eHint": "class OrderBookL3:\n    def __init__(self):\n        self.orders = {}\n\n    def process(self, kind: str, oid: int, side=None, price: float = 0.0, qty: int = 0):\n        if kind == \"ADD\":\n            self.orders[oid] = [side, price, qty]\n        elif kind == \"CANCEL\":\n            self.orders.pop(oid, None)\n        elif kind == \"EXEC\" and oid in self.orders:\n            self.orders[oid][2] -= qty\n            if self.orders[oid][2] <= 0:\n                del self.orders[oid]\n\n    def bbo(self):\n        bids = [p for s, p, q in self.orders.values() if s == \"B\" and q > 0]\n        asks = [p for s, p, q in self.orders.values() if s == \"S\" and q > 0]\n        return (max(bids) if bids else None, min(asks) if asks else None)",
    "eTest": "ob = OrderBookL3()\nassert ob.bbo() == (None, None)\nob.process(\"ADD\", 1, \"B\", 100.0, 10); ob.process(\"ADD\", 2, \"B\", 100.5, 5); ob.process(\"ADD\", 3, \"S\", 101.0, 8)\nassert ob.bbo() == (100.5, 101.0)\nob.process(\"EXEC\", 2, qty=5); ob.process(\"CANCEL\", 3)\nassert ob.bbo() == (100.0, None)\nprint('All checks passed.')",
    "aTitle": "Aggregated L2 Depth Snapshot & Book Imbalance Builder",
    "aDesc": "Write `aggregate_l2_depth(orders: list[tuple[str, float, int]], top_n: int) -> dict`: given active `(side \"B\"|\"S\", price, qty)` orders, sum quantities per price level, sort top `top_n` bids descending and top `top_n` asks ascending, and compute level-1 micro-price imbalance `(bid1_sz - ask1_sz) / (bid1_sz + ask1_sz)` (`0.0` if missing).",
    "aStarter": "def aggregate_l2_depth(orders: list[tuple[str, float, int]], top_n: int) -> dict:\n    # TODO\n    pass",
    "aHint": "from collections import defaultdict\n\ndef aggregate_l2_depth(orders: list[tuple[str, float, int]], top_n: int) -> dict:\n    b, a = defaultdict(int), defaultdict(int)\n    for side, p, q in orders:\n        if q > 0:\n            (b if side == \"B\" else a)[p] += q\n    bids = sorted(b.items(), key=lambda x: -x[0])[:top_n]\n    asks = sorted(a.items(), key=lambda x: x[0])[:top_n]\n    imb = round((bids[0][1] - asks[0][1]) / (bids[0][1] + asks[0][1]), 4) if bids and asks else 0.0\n    return {\"bids\": bids, \"asks\": asks, \"l1_imbalance\": imb}",
    "aTest": "ords = [(\"B\", 100.0, 30), (\"B\", 100.0, 10), (\"B\", 99.5, 20), (\"S\", 101.0, 60)]\nres = aggregate_l2_depth(ords, 1)\nassert res == {\"bids\": [(100.0, 40)], \"asks\": [(101.0, 60)], \"l1_imbalance\": -0.2}\nassert aggregate_l2_depth([(\"B\", 10.0, 5)], 2)[\"asks\"] == []\nassert aggregate_l2_depth([], 3) == {\"bids\": [], \"asks\": [], \"l1_imbalance\": 0.0}\nprint('All checks passed.')"
  },
  {
    "day": 44,
    "fallbackTitle": "Smart Order Router (SOR): Maker-Taker Rebate Optimization & Dark Pool Allocation",
    "eTitle": "Fee-Adjusted Net-Effective-Price Smart Order Router",
    "eDesc": "Write `route_buy_sor(qty: int, venues: list[dict]) -> list[tuple[str, int]]`: each venue has `{\"name\": str, \"ask\": float, \"avail\": int, \"taker_fee\": float}`. Rank venues by lowest effective cost `ask + taker_fee` (tie-break by venue `\"name\"`), sweep liquidity greedily until `qty` is filled (or exhausted), returning `[(name, shares)]` for fills > 0.",
    "eStarter": "def route_buy_sor(qty: int, venues: list[dict]) -> list[tuple[str, int]]:\n    # TODO\n    pass",
    "eHint": "def route_buy_sor(qty: int, venues: list[dict]) -> list[tuple[str, int]]:\n    rem = qty\n    fills = []\n    for v in sorted(venues, key=lambda x: (x[\"ask\"] + x[\"taker_fee\"], x[\"name\"])):\n        if rem <= 0:\n            break\n        take = min(rem, v[\"avail\"])\n        if take > 0:\n            fills.append((v[\"name\"], take))\n            rem -= take\n    return fills",
    "eTest": "vs = [{\"name\": \"ARCA\", \"ask\": 100.00, \"avail\": 50, \"taker_fee\": 0.003}, {\"name\": \"IEX\", \"ask\": 100.00, \"avail\": 80, \"taker_fee\": 0.0009}]\nassert route_buy_sor(100, vs) == [(\"IEX\", 80), (\"ARCA\", 20)]\nassert route_buy_sor(0, vs) == []\nassert route_buy_sor(10, []) == []\nprint('All checks passed.')",
    "aTitle": "Dark Pool Midpoint Ping & Lit Remainder Sweep Allocator",
    "aDesc": "Write `split_dark_and_lit(total_qty: int, dark_filled: int, lit_quotes: list[tuple[str, float, int]]) -> dict`: route remaining `max(0, total_qty - dark_filled)` shares across lit `(venue, price, avail)` venues sorted by lowest price then venue name, returning `{\"dark\": min(total_qty, dark_filled), \"lit\": [(venue, qty)], \"unfilled\": int}`.",
    "aStarter": "def split_dark_and_lit(total_qty: int, dark_filled: int, lit_quotes: list[tuple[str, float, int]]) -> dict:\n    # TODO\n    pass",
    "aHint": "def split_dark_and_lit(total_qty: int, dark_filled: int, lit_quotes: list[tuple[str, float, int]]) -> dict:\n    d_take = min(total_qty, max(0, dark_filled))\n    rem = total_qty - d_take\n    lit = []\n    for v, _p, avail in sorted(lit_quotes, key=lambda x: (x[1], x[0])):\n        if rem <= 0:\n            break\n        t = min(rem, avail)\n        if t > 0:\n            lit.append((v, t))\n            rem -= t\n    return {\"dark\": d_take, \"lit\": lit, \"unfilled\": rem}",
    "aTest": "assert split_dark_and_lit(100, 40, [(\"NSDQ\", 10.02, 50), (\"BATS\", 10.01, 40)]) == {\"dark\": 40, \"lit\": [(\"BATS\", 40), (\"NSDQ\", 20)], \"unfilled\": 0}\nassert split_dark_and_lit(100, 120, [(\"BATS\", 10.0, 50)]) == {\"dark\": 100, \"lit\": [], \"unfilled\": 0}\nassert split_dark_and_lit(50, 10, [(\"A\", 10.0, 15)]) == {\"dark\": 10, \"lit\": [(\"A\", 15)], \"unfilled\": 25}\nprint('All checks passed.')"
  },
  {
    "day": 45,
    "fallbackTitle": "Milestone 9: L3 Order Book Reconstructor & Cost-Aware Smart Order Router",
    "eTitle": "Milestone 9A: L3 ITCH Stream Replay & Multi-Venue Fee Aggregator",
    "eDesc": "Write `replay_book_and_route(events: list[tuple], order_qty: int, fee: float) -> dict`: apply L3 `(\"ADD\", oid, \"S\", price, qty)` and `(\"CANCEL\", oid)` for asks, then route a buy order of `order_qty` across remaining ascending asks and return `{\"filled\": int, \"avg_eff_cost\": round(..., 4)}` (`0.0` if 0 filled).",
    "eStarter": "def replay_book_and_route(events: list[tuple], order_qty: int, fee: float) -> dict:\n    # TODO\n    pass",
    "eHint": "def replay_book_and_route(events: list[tuple], order_qty: int, fee: float) -> dict:\n    asks = {}\n    for ev in events:\n        if ev[0] == \"ADD\":\n            asks[ev[1]] = (ev[3], ev[4])\n        elif ev[0] == \"CANCEL\":\n            asks.pop(ev[1], None)\n    rem, filled, tot = order_qty, 0, 0.0\n    for _oid, (p, q) in sorted(asks.items(), key=lambda x: (x[1][0], x[0])):\n        take = min(rem, q)\n        if take <= 0:\n            continue\n        filled += take\n        tot += take * (p + fee)\n        rem -= take\n    return {\"filled\": filled, \"avg_eff_cost\": round(tot / filled, 4) if filled else 0.0}",
    "eTest": "evs = [(\"ADD\", 1, \"S\", 100.0, 20), (\"ADD\", 2, \"S\", 101.0, 40), (\"CANCEL\", 1)]\nassert replay_book_and_route(evs, 30, 0.01) == {\"filled\": 30, \"avg_eff_cost\": 101.01}\nassert replay_book_and_route([(\"ADD\", 1, \"S\", 10.0, 5)], 10, 0.0) == {\"filled\": 5, \"avg_eff_cost\": 10.0}\nassert replay_book_and_route([], 10, 0.01) == {\"filled\": 0, \"avg_eff_cost\": 0.0}\nprint('All checks passed.')",
    "aTitle": "Milestone 9B: Almgren-Chriss Implementation Shortfall Calculator",
    "aDesc": "Write `implementation_shortfall_bps(decision_px: float, fills: list[tuple[float, int]], parent_shares: int) -> float`: given arrival benchmark price and actual `(fill_px, qty)` slices for a buy order, compute slippage in basis points `10000 * (sum(fill_px*qty) / sum(qty) - decision_px) / decision_px`, returning `0.0` if no fills.",
    "aStarter": "def implementation_shortfall_bps(decision_px: float, fills: list[tuple[float, int]], parent_shares: int) -> float:\n    # TODO\n    pass",
    "aHint": "def implementation_shortfall_bps(decision_px: float, fills: list[tuple[float, int]], parent_shares: int) -> float:\n    tot_q = sum(q for _, q in fills)\n    if tot_q <= 0 or decision_px <= 0:\n        return 0.0\n    vwap = sum(p * q for p, q in fills) / tot_q\n    return round(10000.0 * (vwap - decision_px) / decision_px, 4)",
    "aTest": "assert implementation_shortfall_bps(100.0, [(100.10, 50), (100.20, 50)], 100) == 15.0\nassert implementation_shortfall_bps(100.0, [(99.90, 100)], 100) == -10.0\nassert implementation_shortfall_bps(100.0, [], 100) == 0.0\nprint('All checks passed.')"
  },
  {
    "day": 46,
    "fallbackTitle": "Black-Scholes-Merton Greeks Surface: Delta, Gamma, Vega, Theta & Vanna",
    "eTitle": "Black-Scholes Call/Put Fair Price & First-Order Greeks (`math.erf`)",
    "eDesc": "Write `bs_price_and_delta(S: float, K: float, T: float, r: float, sigma: float, is_call: bool = True) -> dict`: using standard normal CDF via `0.5 * (1 + math.erf(x / math.sqrt(2)))`, compute `d1`, `d2`, Black-Scholes `price`, `delta`, `gamma`, and `vega` rounded to 4 decimals (`0.0` intrinsic when `T <= 0`).",
    "eStarter": "import math\n\ndef bs_price_and_delta(S: float, K: float, T: float, r: float, sigma: float, is_call: bool = True) -> dict:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef _ncdf(x):\n    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))\n\ndef _npdf(x):\n    return math.exp(-0.5 * x * x) / math.sqrt(2.0 * math.pi)\n\ndef bs_price_and_delta(S: float, K: float, T: float, r: float, sigma: float, is_call: bool = True) -> dict:\n    if T <= 0 or sigma <= 0:\n        px = max(0.0, S - K) if is_call else max(0.0, K - S)\n        d = (1.0 if S > K else 0.0) if is_call else (-1.0 if S < K else 0.0)\n        return {\"price\": round(px, 4), \"delta\": d, \"gamma\": 0.0, \"vega\": 0.0}\n    srt = sigma * math.sqrt(T)\n    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / srt\n    d2 = d1 - srt\n    disc = math.exp(-r * T)\n    if is_call:\n        px = S * _ncdf(d1) - K * disc * _ncdf(d2)\n        delta = _ncdf(d1)\n    else:\n        px = K * disc * _ncdf(-d2) - S * _ncdf(-d1)\n        delta = _ncdf(d1) - 1.0\n    gamma = _npdf(d1) / (S * srt)\n    vega = S * _npdf(d1) * math.sqrt(T)\n    return {\"price\": round(px, 4), \"delta\": round(delta, 4), \"gamma\": round(gamma, 4), \"vega\": round(vega, 4)}",
    "eTest": "c = bs_price_and_delta(100.0, 100.0, 1.0, 0.05, 0.2, True)\np = bs_price_and_delta(100.0, 100.0, 1.0, 0.05, 0.2, False)\nassert abs(c[\"price\"] - 10.4506) < 1e-3 and abs(p[\"price\"] - 5.5735) < 1e-3\nassert abs((c[\"delta\"] - p[\"delta\"]) - 1.0) < 1e-4\nassert bs_price_and_delta(110.0, 100.0, 0.0, 0.05, 0.2, True)[\"price\"] == 10.0\nprint('All checks passed.')",
    "aTitle": "Second-Order Cross-Greeks: Vanna & Charm (Delta Decay)",
    "aDesc": "Write `bs_vanna(S: float, K: float, T: float, r: float, sigma: float) -> float`: compute `Vanna = d(Delta)/d(sigma) = -phi(d1) * d2 / sigma` (`0.0` when `T <= 0 or sigma <= 0`), rounded to 6 decimals.",
    "aStarter": "import math\n\ndef bs_vanna(S: float, K: float, T: float, r: float, sigma: float) -> float:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef bs_vanna(S: float, K: float, T: float, r: float, sigma: float) -> float:\n    if T <= 0 or sigma <= 0:\n        return 0.0\n    srt = sigma * math.sqrt(T)\n    d1 = (math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / srt\n    d2 = d1 - srt\n    phi = math.exp(-0.5 * d1 * d1) / math.sqrt(2.0 * math.pi)\n    return round(-phi * d2 / sigma, 6)",
    "aTest": "assert abs(bs_vanna(100.0, 100.0, 1.0, 0.0, 0.2) - (0.398942 * 0.1 / 0.2)) < 0.01\nassert bs_vanna(100.0, 100.0, 0.0, 0.0, 0.2) == 0.0\nassert bs_vanna(120.0, 100.0, 1.0, 0.0, 0.2) < 0.0\nprint('All checks passed.')"
  },
  {
    "day": 47,
    "fallbackTitle": "Implied Volatility Surface Calibration: Newton-Raphson & Brenner-Subrahmanyam Seed",
    "eTitle": "Newton-Raphson Implied Volatility Solver with Bisection Guard",
    "eDesc": "Write `implied_vol_call(mkt_px: float, S: float, K: float, T: float, r: float) -> float | None`: use Newton-Raphson starting from `sigma = max(0.05, math.sqrt(2*pi/T) * mkt_px / S)` (`0.25` fallback), clamping step and returning `round(sigma, 4)` within `1e-6` (`None` if `mkt_px` violates no-arbitrage bounds `[max(0, S - K*e^(-rT)), S]`).",
    "eStarter": "import math\n\ndef implied_vol_call(mkt_px: float, S: float, K: float, T: float, r: float):\n    # TODO\n    pass",
    "eHint": "import math\n\ndef _bs_c(S, K, T, r, sig):\n    srt = sig * math.sqrt(T)\n    d1 = (math.log(S / K) + (r + 0.5 * sig * sig) * T) / srt\n    d2 = d1 - srt\n    nc = lambda z: 0.5 * (1.0 + math.erf(z / math.sqrt(2.0)))\n    px = S * nc(d1) - K * math.exp(-r * T) * nc(d2)\n    vega = S * (math.exp(-0.5 * d1 * d1) / math.sqrt(2.0 * math.pi)) * math.sqrt(T)\n    return px, vega\n\ndef implied_vol_call(mkt_px: float, S: float, K: float, T: float, r: float):\n    lo_b = max(0.0, S - K * math.exp(-r * T))\n    if T <= 0 or mkt_px < lo_b + 1e-9 or mkt_px >= S:\n        return None\n    lo, hi = 1e-4, 5.0\n    sig = min(hi, max(lo, math.sqrt(2.0 * math.pi / T) * mkt_px / S))\n    for _ in range(60):\n        px, vega = _bs_c(S, K, T, r, sig)\n        diff = px - mkt_px\n        if abs(diff) < 1e-7:\n            return round(sig, 4)\n        if diff > 0:\n            hi = sig\n        else:\n            lo = sig\n        if vega > 1e-8:\n            nxt = sig - diff / vega\n            sig = nxt if lo < nxt < hi else 0.5 * (lo + hi)\n        else:\n            sig = 0.5 * (lo + hi)\n    return round(sig, 4)",
    "eTest": "iv = implied_vol_call(10.45058, 100.0, 100.0, 1.0, 0.05)\nassert iv is not None and abs(iv - 0.2) < 1e-3\nassert implied_vol_call(1.0, 100.0, 90.0, 1.0, 0.05) is None\nassert implied_vol_call(101.0, 100.0, 100.0, 1.0, 0.05) is None\nprint('All checks passed.')",
    "aTitle": "Quadratic Moneyness Volatility Smile Interpolator & Arbitrage Butterfly Check",
    "aDesc": "Write `eval_vol_smile(atm_iv: float, skew: float, conv: float, S: float, strikes: list[float]) -> dict`: evaluate quadratic smile `sigma(K) = atm_iv + skew * x + conv * x^2` where `x = math.log(K / S)`, rounded to 4 decimals, and verify `all(v > 0)` (return `{\"ivs\": list[float], \"valid\": bool}`).",
    "aStarter": "import math\n\ndef eval_vol_smile(atm_iv: float, skew: float, conv: float, S: float, strikes: list[float]) -> dict:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef eval_vol_smile(atm_iv: float, skew: float, conv: float, S: float, strikes: list[float]) -> dict:\n    ivs = []\n    for k in strikes:\n        x = math.log(k / S)\n        ivs.append(round(atm_iv + skew * x + conv * x * x, 4))\n    return {\"ivs\": ivs, \"valid\": bool(ivs) and all(v > 0 for v in ivs)}",
    "aTest": "r = eval_vol_smile(0.20, -0.10, 0.50, 100.0, [100.0])\nassert r == {\"ivs\": [0.2], \"valid\": True}\nassert eval_vol_smile(0.20, -0.5, 0.0, 100.0, [200.0])[\"valid\"] is False\nassert eval_vol_smile(0.20, -0.1, 0.5, 100.0, []) == {\"ivs\": [], \"valid\": False}\nprint('All checks passed.')"
  },
  {
    "day": 48,
    "fallbackTitle": "Delta-Gamma Hedging Simulator & Discrete Rebalancing PnL Slippage",
    "eTitle": "Discrete Delta-Neutral Rebalancing Tracker",
    "eDesc": "Write `simulate_delta_hedge(spots: list[float], deltas: list[float], opt_vals: list[float], opt_qty: float = 1.0) -> float`: at step 0, hold `opt_qty` option and `-opt_qty * deltas[0]` shares; at each `t >= 1`, compute step option PnL `opt_qty*(opt_vals[t]-opt_vals[t-1])` plus share hedge PnL `shares*(spots[t]-spots[t-1])`, then rebalance `shares = -opt_qty * deltas[t]`. Return cumulative net hedged PnL rounded to 4 decimals.",
    "eStarter": "def simulate_delta_hedge(spots: list[float], deltas: list[float], opt_vals: list[float], opt_qty: float = 1.0) -> float:\n    # TODO\n    pass",
    "eHint": "def simulate_delta_hedge(spots: list[float], deltas: list[float], opt_vals: list[float], opt_qty: float = 1.0) -> float:\n    if len(spots) < 2:\n        return 0.0\n    pnl = 0.0\n    shares = -opt_qty * deltas[0]\n    for t in range(1, len(spots)):\n        pnl += opt_qty * (opt_vals[t] - opt_vals[t - 1]) + shares * (spots[t] - spots[t - 1])\n        shares = -opt_qty * deltas[t]\n    return round(pnl, 4)",
    "eTest": "assert simulate_delta_hedge([100.0, 102.0], [0.5, 0.6], [5.0, 6.2], 10.0) == 2.0\nassert simulate_delta_hedge([100.0, 98.0], [0.5, 0.4], [5.0, 4.1], 10.0) == 1.0\nassert simulate_delta_hedge([100.0], [0.5], [5.0], 1.0) == 0.0\nprint('All checks passed.')",
    "aTitle": "Gamma-Theta Discrete Rebalancing Convexity Attribution",
    "aDesc": "Write `gamma_theta_attribution(gamma: float, theta_daily: float, dS: float) -> float`: compute discrete replication residual `0.5 * gamma * (dS ** 2) + theta_daily` rounded to 4 decimals.",
    "aStarter": "def gamma_theta_attribution(gamma: float, theta_daily: float, dS: float) -> float:\n    # TODO\n    pass",
    "aHint": "def gamma_theta_attribution(gamma: float, theta_daily: float, dS: float) -> float:\n    return round(0.5 * gamma * (dS ** 2) + theta_daily, 4)",
    "aTest": "assert gamma_theta_attribution(0.1, -0.2, 4.0) == 0.6\nassert gamma_theta_attribution(0.1, -0.5, 1.0) == -0.45\nassert gamma_theta_attribution(0.0, 0.0, 5.0) == 0.0\nprint('All checks passed.')"
  },
  {
    "day": 49,
    "fallbackTitle": "Cornish-Fisher Modified Value-at-Risk (VaR) for Skewed & Fat-Tailed Returns",
    "eTitle": "Historical VaR & Expected Shortfall (CVaR) Tail Risk Engine",
    "eDesc": "Write `var_and_cvar(returns: list[float], alpha: float = 0.05) -> dict`: sort `returns` ascending; take tail index `k = max(1, int(math.floor(alpha * len(returns))))`; return positive loss `{\"var\": round(-sorted_r[k - 1], 4), \"cvar\": round(-sum(sorted_r[:k]) / k, 4)}` (`0.0` if empty).",
    "eStarter": "import math\n\ndef var_and_cvar(returns: list[float], alpha: float = 0.05) -> dict:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef var_and_cvar(returns: list[float], alpha: float = 0.05) -> dict:\n    if not returns:\n        return {\"var\": 0.0, \"cvar\": 0.0}\n    sr = sorted(returns)\n    k = max(1, int(math.floor(alpha * len(sr))))\n    return {\"var\": round(-sr[k - 1], 4), \"cvar\": round(-sum(sr[:k]) / k, 4)}",
    "eTest": "rs = [-0.10, -0.05] + [0.01] * 38\nassert var_and_cvar(rs, 0.05) == {\"var\": 0.05, \"cvar\": 0.075}\nassert var_and_cvar([-0.20, 0.10, 0.20], 0.05) == {\"var\": 0.2, \"cvar\": 0.2}\nassert var_and_cvar([]) == {\"var\": 0.0, \"cvar\": 0.0}\nprint('All checks passed.')",
    "aTitle": "Cornish-Fisher Fourth-Moment Adjusted Z-Score & Modified VaR",
    "aDesc": "Write `cornish_fisher_z(z: float, skew: float, ex_kurt: float) -> float`: compute modified quantile `z + (z^2 - 1)*skew/6 + (z^3 - 3*z)*ex_kurt/24 - (2*z^3 - 5*z)*(skew^2)/36`, rounded to 4 decimals.",
    "aStarter": "def cornish_fisher_z(z: float, skew: float, ex_kurt: float) -> float:\n    # TODO\n    pass",
    "aHint": "def cornish_fisher_z(z: float, skew: float, ex_kurt: float) -> float:\n    z2, z3 = z * z, z * z * z\n    cf = z + (z2 - 1.0) * skew / 6.0 + (z3 - 3.0 * z) * ex_kurt / 24.0 - (2.0 * z3 - 5.0 * z) * (skew * skew) / 36.0\n    return round(cf, 4)",
    "aTest": "assert cornish_fisher_z(-1.645, 0.0, 0.0) == -1.645\nassert cornish_fisher_z(-1.645, -1.0, 3.0) < -1.645\nassert cornish_fisher_z(0.0, 1.2, 4.0) == -0.2\nprint('All checks passed.')"
  },
  {
    "day": 50,
    "fallbackTitle": "Milestone 10: Options Volatility Surface & Dynamic Greeks Hedging Kernel",
    "eTitle": "Milestone 10A: Portfolio Net Greeks & Gamma-Limit Gate",
    "eDesc": "Write `aggregate_portfolio_greeks(positions: list[dict], max_abs_gamma: float) -> dict`: sum `qty * delta`, `qty * gamma`, `qty * vega`, compute `shares_to_hedge = round(-net_delta, 4)`, and flag `\"gamma_breach\": abs(net_gamma) > max_abs_gamma`.",
    "eStarter": "def aggregate_portfolio_greeks(positions: list[dict], max_abs_gamma: float) -> dict:\n    # TODO\n    pass",
    "eHint": "def aggregate_portfolio_greeks(positions: list[dict], max_abs_gamma: float) -> dict:\n    nd = ng = nv = 0.0\n    for p in positions:\n        q = p[\"qty\"]\n        nd += q * p[\"delta\"]\n        ng += q * p[\"gamma\"]\n        nv += q * p[\"vega\"]\n    return {\"net_delta\": round(nd, 4), \"net_gamma\": round(ng, 4), \"net_vega\": round(nv, 4), \"shares_to_hedge\": round(-nd, 4), \"gamma_breach\": abs(ng) > max_abs_gamma}",
    "eTest": "ps = [{\"qty\": 10, \"delta\": 0.5, \"gamma\": 0.04, \"vega\": 2.0}, {\"qty\": -5, \"delta\": 0.6, \"gamma\": 0.02, \"vega\": 1.0}]\nassert aggregate_portfolio_greeks(ps, 0.25) == {\"net_delta\": 2.0, \"net_gamma\": 0.3, \"net_vega\": 15.0, \"shares_to_hedge\": -2.0, \"gamma_breach\": True}\nassert aggregate_portfolio_greeks(ps, 0.5)[\"gamma_breach\"] is False\nassert aggregate_portfolio_greeks([], 1.0) == {\"net_delta\": 0.0, \"net_gamma\": 0.0, \"net_vega\": 0.0, \"shares_to_hedge\": 0.0, \"gamma_breach\": False}\nprint('All checks passed.')",
    "aTitle": "Milestone 10B: Straddle P&L Scenario Stress Matrix Evaluator",
    "aDesc": "Write `stress_option_book(S0: float, K: float, call_cost: float, put_cost: float, spot_shocks: list[float]) -> dict`: evaluate long 1 call + 1 put straddle expiry payoff across shocked spots `S = S0 * (1 + shock)`. Return `{\"min_pnl\": round(..., 4), \"max_pnl\": round(..., 4), \"worst_shock\": float}`.",
    "aStarter": "def stress_option_book(S0: float, K: float, call_cost: float, put_cost: float, spot_shocks: list[float]) -> dict:\n    # TODO\n    pass",
    "aHint": "def stress_option_book(S0: float, K: float, call_cost: float, put_cost: float, spot_shocks: list[float]) -> dict:\n    if not spot_shocks:\n        return {\"min_pnl\": 0.0, \"max_pnl\": 0.0, \"worst_shock\": 0.0}\n    tot_c = call_cost + put_cost\n    pnls = [(max(0.0, S0 * (1.0 + sh) - K) + max(0.0, K - S0 * (1.0 + sh)) - tot_c, sh) for sh in spot_shocks]\n    worst = min(pnls, key=lambda x: x[0])\n    best = max(pnls, key=lambda x: x[0])\n    return {\"min_pnl\": round(worst[0], 4), \"max_pnl\": round(best[0], 4), \"worst_shock\": worst[1]}",
    "aTest": "assert stress_option_book(100.0, 100.0, 3.0, 3.0, [-0.2, 0.0, 0.1]) == {\"min_pnl\": -6.0, \"max_pnl\": 14.0, \"worst_shock\": 0.0}\nassert stress_option_book(100.0, 100.0, 2.0, 2.0, [-0.1]) == {\"min_pnl\": 6.0, \"max_pnl\": 6.0, \"worst_shock\": -0.1}\nassert stress_option_book(100.0, 100.0, 2.0, 2.0, []) == {\"min_pnl\": 0.0, \"max_pnl\": 0.0, \"worst_shock\": 0.0}\nprint('All checks passed.')"
  },
  {
    "day": 51,
    "fallbackTitle": "Black-Litterman Portfolio Optimization: Equilibrium Implied Returns & Investor Views",
    "eTitle": "Reverse-Optimized CAPM Equilibrium Implied Excess Returns (`Pi = delta Sigma w`)",
    "eDesc": "Write `bl_implied_returns(cov: list[list[float]], w_mkt: list[float], risk_aversion: float) -> list[float]`: compute matrix-vector product `Pi = risk_aversion * (cov @ w_mkt)` rounded to 6 decimals.",
    "eStarter": "def bl_implied_returns(cov: list[list[float]], w_mkt: list[float], risk_aversion: float) -> list[float]:\n    # TODO\n    pass",
    "eHint": "def bl_implied_returns(cov: list[list[float]], w_mkt: list[float], risk_aversion: float) -> list[float]:\n    return [round(risk_aversion * sum(row[j] * w_mkt[j] for j in range(len(w_mkt))), 6) for row in cov]",
    "eTest": "cov = [[0.04, 0.01], [0.01, 0.09]]\nassert bl_implied_returns(cov, [0.5, 0.5], 2.0) == [0.05, 0.1]\nassert bl_implied_returns([[0.02]], [1.0], 3.0) == [0.06]\nassert bl_implied_returns([], [], 2.0) == []\nprint('All checks passed.')",
    "aTitle": "Bayesian Prior + Single-View Posterior Mean & Unconstrained Tangency Weights",
    "aDesc": "Write `bl_single_asset_posterior(prior_mu: float, tau_var: float, view_mu: float, omega_var: float) -> float`: combine scalar Gaussian prior and view via precision-weighted Bayesian mean `(prior_mu / tau_var + view_mu / omega_var) / (1 / tau_var + 1 / omega_var)` rounded to 6 decimals.",
    "aStarter": "def bl_single_asset_posterior(prior_mu: float, tau_var: float, view_mu: float, omega_var: float) -> float:\n    # TODO\n    pass",
    "aHint": "def bl_single_asset_posterior(prior_mu: float, tau_var: float, view_mu: float, omega_var: float) -> float:\n    p1 = 1.0 / tau_var\n    p2 = 1.0 / omega_var\n    return round((prior_mu * p1 + view_mu * p2) / (p1 + p2), 6)",
    "aTest": "assert bl_single_asset_posterior(0.06, 0.01, 0.10, 0.01) == 0.08\nassert bl_single_asset_posterior(0.04, 0.01, 0.12, 0.03) == 0.06\nassert bl_single_asset_posterior(0.05, 0.02, 0.05, 0.01) == 0.05\nprint('All checks passed.')"
  },
  {
    "day": 52,
    "fallbackTitle": "Hierarchical Risk Parity (HRP) & Inverse-Variance Tree Clustering",
    "eTitle": "Inverse-Variance Portfolio Weighting & Variance Ratio Solver",
    "eDesc": "Write `inverse_variance_weights(cov: list[list[float]]) -> list[float]`: compute normalized weights `w_i = (1 / cov[i][i]) / sum(1 / cov[j][j])` rounded to 6 decimals (`[]` if empty).",
    "eStarter": "def inverse_variance_weights(cov: list[list[float]]) -> list[float]:\n    # TODO\n    pass",
    "eHint": "def inverse_variance_weights(cov: list[list[float]]) -> list[float]:\n    if not cov:\n        return []\n    invs = [1.0 / cov[i][i] for i in range(len(cov))]\n    s = sum(invs)\n    return [round(v / s, 6) for v in invs]",
    "eTest": "assert inverse_variance_weights([[0.04, 0.0], [0.0, 0.04]]) == [0.5, 0.5]\nassert inverse_variance_weights([[0.01, 0.0], [0.0, 0.04]]) == [0.8, 0.2]\nassert inverse_variance_weights([]) == []\nprint('All checks passed.')",
    "aTitle": "HRP Recursive Bisection Weight Allocator Over Seriated Assets",
    "aDesc": "Write `hrp_recursive_bisection(cov: list[list[float]], order: list[int]) -> dict[int, float]`: start with `{i: 1.0}` for `i in order`. Recursively split contiguous clusters into left/right halves `[L, R]`; compute cluster variance `w_sub^T Cov_sub w_sub` using normalized inverse-variance weights on `L` and `R`; set `alpha = 1 - vL / (vL + vR)` and scale left weights by `alpha`, right weights by `1 - alpha`. Round to 6 decimals.",
    "aStarter": "def hrp_recursive_bisection(cov: list[list[float]], order: list[int]) -> dict[int, float]:\n    # TODO\n    pass",
    "aHint": "def hrp_recursive_bisection(cov: list[list[float]], order: list[int]) -> dict[int, float]:\n    if not order:\n        return {}\n    w = {i: 1.0 for i in order}\n    def cvar(items):\n        invs = [1.0 / cov[i][i] for i in items]\n        s = sum(invs)\n        subw = [v / s for v in invs]\n        tot = 0.0\n        for a_i, i in enumerate(items):\n            for b_i, j in enumerate(items):\n                tot += subw[a_i] * cov[i][j] * subw[b_i]\n        return tot\n    queue = [list(order)]\n    while queue:\n        c = queue.pop(0)\n        if len(c) <= 1:\n            continue\n        mid = len(c) // 2\n        left, right = c[:mid], c[mid:]\n        vl, vr = cvar(left), cvar(right)\n        alpha = 1.0 - vl / (vl + vr)\n        for i in left:\n            w[i] *= alpha\n        for i in right:\n            w[i] *= (1.0 - alpha)\n        queue.extend([left, right])\n    return {k: round(v, 6) for k, v in w.items()}",
    "aTest": "c2 = [[0.01, 0.0], [0.0, 0.04]]\nassert hrp_recursive_bisection(c2, [0, 1]) == {0: 0.8, 1: 0.2}\nassert hrp_recursive_bisection([[0.04]], [0]) == {0: 1.0}\nassert hrp_recursive_bisection([], []) == {}\nprint('All checks passed.')"
  },
  {
    "day": 53,
    "fallbackTitle": "Kelly Criterion Fractional Sizing, Ruin Bounds & Drawdown-Constrained Leverage",
    "eTitle": "Continuous Fractional Kelly Leverage & Cap Enforcer",
    "eDesc": "Write `fractional_kelly(mu_excess: float, sigma: float, kelly_frac: float = 0.5, max_lev: float = 2.0) -> float`: compute `f = kelly_frac * (mu_excess / (sigma ** 2))`, clamp into `[0.0, max_lev]`, and round to 4 decimals (`0.0` if `sigma <= 0`).",
    "eStarter": "def fractional_kelly(mu_excess: float, sigma: float, kelly_frac: float = 0.5, max_lev: float = 2.0) -> float:\n    # TODO\n    pass",
    "eHint": "def fractional_kelly(mu_excess: float, sigma: float, kelly_frac: float = 0.5, max_lev: float = 2.0) -> float:\n    if sigma <= 0 or mu_excess <= 0:\n        return 0.0\n    f = kelly_frac * (mu_excess / (sigma ** 2))\n    return round(min(max_lev, max(0.0, f)), 4)",
    "eTest": "assert fractional_kelly(0.08, 0.20, 0.5, 3.0) == 1.0\nassert fractional_kelly(0.50, 0.10, 0.5, 2.0) == 2.0\nassert fractional_kelly(-0.05, 0.20) == 0.0\nprint('All checks passed.')",
    "aTitle": "Dynamic Drawdown-CPPI Risk Multiplier & Floor Cushion Scaler",
    "aDesc": "Write `cppi_leverage(equity: float, peak_equity: float, max_dd: float, mult: float, cap: float) -> float`: define drawdown floor `floor = peak_equity * (1 - max_dd)`, cushion `c = max(0.0, equity - floor)`, target exposure `mult * c`, return leverage `min(cap, exposure / equity)` rounded to 4 decimals (`0.0` if `equity <= 0`).",
    "aStarter": "def cppi_leverage(equity: float, peak_equity: float, max_dd: float, mult: float, cap: float) -> float:\n    # TODO\n    pass",
    "aHint": "def cppi_leverage(equity: float, peak_equity: float, max_dd: float, mult: float, cap: float) -> float:\n    if equity <= 0:\n        return 0.0\n    floor = peak_equity * (1.0 - max_dd)\n    cushion = max(0.0, equity - floor)\n    return round(min(cap, mult * cushion / equity), 4)",
    "aTest": "assert cppi_leverage(100.0, 100.0, 0.2, 5.0, 2.0) == 1.0\nassert cppi_leverage(85.0, 100.0, 0.2, 5.0, 2.0) == 0.2941\nassert cppi_leverage(75.0, 100.0, 0.2, 5.0, 2.0) == 0.0\nprint('All checks passed.')"
  },
  {
    "day": 54,
    "fallbackTitle": "Purged Walk-Forward Cross-Validation & Embargo Windows for Financial ML",
    "eTitle": "Purged & Embargoed Financial CV Train/Test Splitter",
    "eDesc": "Write `purged_cv_split(events: list[tuple[int, int]], test_start: int, test_end: int, embargo: int) -> dict`: each event `i` spans label `[start_i, end_i]`. Assign index `i` to `\"test\"` if `test_start <= start_i <= test_end`; otherwise omit any index whose label overlaps `[test_start, test_end + embargo]` and put remaining valid indices into `\"train\"`.",
    "eStarter": "def purged_cv_split(events: list[tuple[int, int]], test_start: int, test_end: int, embargo: int) -> dict:\n    # TODO\n    pass",
    "eHint": "def purged_cv_split(events: list[tuple[int, int]], test_start: int, test_end: int, embargo: int) -> dict:\n    train, test, purged = [], [], []\n    for i, (s, e) in enumerate(events):\n        if test_start <= s <= test_end:\n            test.append(i)\n        elif max(s, test_start) <= min(e, test_end + embargo):\n            purged.append(i)\n        else:\n            train.append(i)\n    return {\"train\": train, \"test\": test, \"purged\": purged}",
    "eTest": "evs = [(0, 2), (2, 6), (4, 5), (6, 7), (9, 10)]\nassert purged_cv_split(evs, 4, 5, 1) == {\"train\": [0, 4], \"test\": [2], \"purged\": [1, 3]}\nassert purged_cv_split([(0, 1), (5, 6)], 2, 3, 0) == {\"train\": [0, 1], \"test\": [], \"purged\": []}\nassert purged_cv_split([], 0, 1, 1) == {\"train\": [], \"test\": [], \"purged\": []}\nprint('All checks passed.')",
    "aTitle": "Sequential Sample Uniqueness Weights for Overlapping Return Horizons",
    "aDesc": "Write `compute_sample_uniqueness(intervals: list[tuple[int, int]]) -> list[float]`: for each bar `t` spanned by `[s_i, e_i]` inclusive, concurrency `c_t` is count of intervals covering `t`. Sample `i` uniqueness is mean `1 / c_t` across all `t` in `[s_i, e_i]`, rounded to 4 decimals.",
    "aStarter": "def compute_sample_uniqueness(intervals: list[tuple[int, int]]) -> list[float]:\n    # TODO\n    pass",
    "aHint": "from collections import Counter\n\ndef compute_sample_uniqueness(intervals: list[tuple[int, int]]) -> list[float]:\n    conc = Counter()\n    for s, e in intervals:\n        for t in range(s, e + 1):\n            conc[t] += 1\n    out = []\n    for s, e in intervals:\n        bars = range(s, e + 1)\n        out.append(round(sum(1.0 / conc[t] for t in bars) / (e - s + 1), 4))\n    return out",
    "aTest": "assert compute_sample_uniqueness([(0, 1), (1, 2)]) == [0.75, 0.75]\nassert compute_sample_uniqueness([(0, 0), (1, 1)]) == [1.0, 1.0]\nassert compute_sample_uniqueness([]) == []\nprint('All checks passed.')"
  },
  {
    "day": 55,
    "fallbackTitle": "Milestone 11: Institutional Portfolio Allocation & Purged Backtest Validator",
    "eTitle": "Milestone 11A: Turnover-Constrained Portfolio Target Rebalancer",
    "eDesc": "Write `rebalance_with_turnover_cap(curr_w: dict[str, float], target_w: dict[str, float], max_oneway_turnover: float) -> dict[str, float]`: compute raw weight deltas across union of assets; if `0.5 * sum(abs(dw)) > max_oneway_turnover`, linearly blend `new_w = curr_w + scale * dw` where `scale = max_oneway_turnover / raw_to`. Round weights to 4 decimals.",
    "eStarter": "def rebalance_with_turnover_cap(curr_w: dict[str, float], target_w: dict[str, float], max_oneway_turnover: float) -> dict[str, float]:\n    # TODO\n    pass",
    "eHint": "def rebalance_with_turnover_cap(curr_w: dict[str, float], target_w: dict[str, float], max_oneway_turnover: float) -> dict[str, float]:\n    keys = sorted(set(curr_w) | set(target_w))\n    raw_to = 0.5 * sum(abs(target_w.get(k, 0.0) - curr_w.get(k, 0.0)) for k in keys)\n    scale = 1.0 if raw_to <= max_oneway_turnover or raw_to <= 1e-12 else (max_oneway_turnover / raw_to)\n    return {k: round(curr_w.get(k, 0.0) + scale * (target_w.get(k, 0.0) - curr_w.get(k, 0.0)), 4) for k in keys}",
    "eTest": "assert rebalance_with_turnover_cap({\"A\": 1.0, \"B\": 0.0}, {\"A\": 0.0, \"B\": 1.0}, 0.25) == {\"A\": 0.75, \"B\": 0.25}\nassert rebalance_with_turnover_cap({\"A\": 0.6, \"B\": 0.4}, {\"A\": 0.5, \"B\": 0.5}, 0.2) == {\"A\": 0.5, \"B\": 0.5}\nassert rebalance_with_turnover_cap({}, {}, 0.1) == {}\nprint('All checks passed.')",
    "aTitle": "Milestone 11B: Walk-Forward OOS Equity & Max-Drawdown Audit",
    "aDesc": "Write `audit_oos_returns(returns: list[float]) -> dict`: compound equity curve from `1.0`, track running peak and maximum fractional drawdown `max_dd`, compute `total_return`, and annualized Sharpe assuming 252 periods (`mean / pop_std * sqrt(252)` or `0.0` if `std == 0`). Round to 4 decimals.",
    "aStarter": "import math\n\ndef audit_oos_returns(returns: list[float]) -> dict:\n    # TODO\n    pass",
    "aHint": "import math\n\ndef audit_oos_returns(returns: list[float]) -> dict:\n    if not returns:\n        return {\"total_return\": 0.0, \"max_dd\": 0.0, \"sharpe\": 0.0}\n    eq = peak = 1.0\n    mdd = 0.0\n    for r in returns:\n        eq *= (1.0 + r)\n        peak = max(peak, eq)\n        mdd = max(mdd, (peak - eq) / peak)\n    mu = sum(returns) / len(returns)\n    sd = math.sqrt(sum((r - mu) ** 2 for r in returns) / len(returns))\n    sh = (mu / sd) * math.sqrt(252.0) if sd > 1e-12 else 0.0\n    return {\"total_return\": round(eq - 1.0, 4), \"max_dd\": round(mdd, 4), \"sharpe\": round(sh, 4)}",
    "aTest": "res = audit_oos_returns([0.1, -0.1, 0.05])\nassert res[\"max_dd\"] == 0.1 and res[\"total_return\"] == 0.0395\nassert audit_oos_returns([0.01, 0.01]) == {\"total_return\": 0.0201, \"max_dd\": 0.0, \"sharpe\": 0.0}\nassert audit_oos_returns([]) == {\"total_return\": 0.0, \"max_dd\": 0.0, \"sharpe\": 0.0}\nprint('All checks passed.')"
  },
  {
    "day": 56,
    "fallbackTitle": "Deflated Sharpe Ratio (DSR) & Multiple-Testing False Discovery Haircuts",
    "eTitle": "Probabilistic Sharpe Ratio (PSR) with Non-Normal Higher Moments",
    "eDesc": "Write `probabilistic_sharpe_ratio(sr_hat: float, sr_bench: float, n: int, skew: float, kurt: float) -> float`: compute `se = math.sqrt((1 - skew * sr_hat + ((kurt - 1) / 4.0) * (sr_hat ** 2)) / max(1, n - 1))`, evaluate normal CDF of `(sr_hat - sr_bench) / se`, rounded to 4 decimals (`0.5` if `se <= 0`).",
    "eStarter": "import math\n\ndef probabilistic_sharpe_ratio(sr_hat: float, sr_bench: float, n: int, skew: float, kurt: float) -> float:\n    # TODO\n    pass",
    "eHint": "import math\n\ndef probabilistic_sharpe_ratio(sr_hat: float, sr_bench: float, n: int, skew: float, kurt: float) -> float:\n    num = 1.0 - skew * sr_hat + ((kurt - 1.0) / 4.0) * (sr_hat ** 2)\n    if n <= 1 or num <= 0:\n        return 0.5\n    se = math.sqrt(num / (n - 1))\n    z = (sr_hat - sr_bench) / se\n    return round(0.5 * (1.0 + math.erf(z / math.sqrt(2.0))), 4)",
    "eTest": "assert probabilistic_sharpe_ratio(0.2, 0.0, 100, 0.0, 3.0) > 0.95\nassert probabilistic_sharpe_ratio(0.0, 0.0, 100, 0.0, 3.0) == 0.5\nassert probabilistic_sharpe_ratio(-0.3, 0.0, 50, 0.0, 3.0) < 0.05\nprint('All checks passed.')",
    "aTitle": "Multiple-Testing Bonferroni & Benjamini-Hochberg FDR Hypothesis Gate",
    "aDesc": "Write `benjamini_hochberg_pass(p_values: list[float], q_fdr: float) -> list[int]`: sort `(p, orig_idx)` ascending; find largest 1-based rank `k` with `p <= (k / M) * q_fdr`, returning sorted original indices `[orig_idx]` of rejected null hypotheses (`[]` if none).",
    "aStarter": "def benjamini_hochberg_pass(p_values: list[float], q_fdr: float) -> list[int]:\n    # TODO\n    pass",
    "aHint": "def benjamini_hochberg_pass(p_values: list[float], q_fdr: float) -> list[int]:\n    m = len(p_values)\n    if m == 0:\n        return []\n    ranked = sorted((p, i) for i, p in enumerate(p_values))\n    k_max = 0\n    for k, (p, _i) in enumerate(ranked, start=1):\n        if p <= (k / m) * q_fdr:\n            k_max = k\n    return sorted(ranked[idx][1] for idx in range(k_max))",
    "aTest": "assert benjamini_hochberg_pass([0.04, 0.005, 0.50, 0.015], 0.05) == [1, 3]\nassert benjamini_hochberg_pass([0.2, 0.3], 0.05) == []\nassert benjamini_hochberg_pass([], 0.05) == []\nprint('All checks passed.')"
  },
  {
    "day": 57,
    "fallbackTitle": "Pre-Trade Fat-Finger Risk Gate: Price Collars, Notional Caps & Message Rate Throttles",
    "eTitle": "Pre-Trade Price Collar & Max-Notional Order Gate",
    "eDesc": "Write `check_fat_finger_order(order_px: float, qty: int, ref_mid: float, max_collar_pct: float, max_notional: float, max_qty: int) -> tuple[bool, list[str]]`: reject with sorted codes from `[\"collar_breach\", \"notional_cap\", \"qty_cap\"]`.",
    "eStarter": "def check_fat_finger_order(order_px: float, qty: int, ref_mid: float, max_collar_pct: float, max_notional: float, max_qty: int) -> tuple[bool, list[str]]:\n    # TODO\n    pass",
    "eHint": "def check_fat_finger_order(order_px: float, qty: int, ref_mid: float, max_collar_pct: float, max_notional: float, max_qty: int) -> tuple[bool, list[str]]:\n    errs = []\n    if ref_mid > 0 and abs(order_px - ref_mid) / ref_mid > max_collar_pct:\n        errs.append(\"collar_breach\")\n    if order_px * qty > max_notional:\n        errs.append(\"notional_cap\")\n    if qty > max_qty:\n        errs.append(\"qty_cap\")\n    errs.sort()\n    return (len(errs) == 0), errs",
    "eTest": "assert check_fat_finger_order(100.5, 100, 100.0, 0.02, 50000.0, 500) == (True, [])\nassert check_fat_finger_order(120.0, 1000, 100.0, 0.05, 50000.0, 500) == (False, [\"collar_breach\", \"notional_cap\", \"qty_cap\"])\nassert check_fat_finger_order(100.0, 600, 100.0, 0.05, 100000.0, 500) == (False, [\"qty_cap\"])\nprint('All checks passed.')",
    "aTitle": "Sliding-Window Message Throttle & Order-to-Trade Ratio Auditor",
    "aDesc": "Write `OrderRateThrottle(max_msgs: int, window_ms: int)`: `allow(ts_ms: int) -> bool` evicts timestamps `<= ts_ms - window_ms`; if count `< max_msgs`, appends `ts_ms` and returns `True`, else `False`.",
    "aStarter": "from collections import deque\n\nclass OrderRateThrottle:\n    def __init__(self, max_msgs: int, window_ms: int):\n        # TODO\n        pass\n\n    def allow(self, ts_ms: int) -> bool:\n        # TODO\n        pass",
    "aHint": "from collections import deque\n\nclass OrderRateThrottle:\n    def __init__(self, max_msgs: int, window_ms: int):\n        self.max_msgs = max_msgs\n        self.win = window_ms\n        self.q = deque()\n\n    def allow(self, ts_ms: int) -> bool:\n        while self.q and self.q[0] <= ts_ms - self.win:\n            self.q.popleft()\n        if len(self.q) < self.max_msgs:\n            self.q.append(ts_ms)\n            return True\n        return False",
    "aTest": "rt = OrderRateThrottle(2, 100)\nassert rt.allow(10) is True and rt.allow(50) is True\nassert rt.allow(90) is False\nassert rt.allow(110) is True\nprint('All checks passed.')"
  },
  {
    "day": 58,
    "fallbackTitle": "Real-Time Kill Switch, Intraday Drawdown Circuit Breakers & Position Flattening",
    "eTitle": "Intraday Equity Watermark & Latched Kill-Switch Controller",
    "eDesc": "Implement `RiskKillSwitch(max_drawdown: float, max_loss_abs: float)`: `update(realized_plus_mtm: float) -> str` returns `\"HALT\"` (latched once triggered!) if loss from starting 0 hits `<= -max_loss_abs` OR drawdown from running peak equity `(peak - cur) >= max_drawdown` (`>=`), else `\"ACTIVE\"`. Also `flatten_orders(positions: dict[str, int]) -> list[tuple[str, str, int]]` generating sorted `(sym, \"SELL\"|\"BUY\", abs_qty)` offsets.",
    "eStarter": "class RiskKillSwitch:\n    def __init__(self, max_drawdown: float, max_loss_abs: float):\n        # TODO\n        pass\n\n    def update(self, equity: float) -> str:\n        # TODO\n        pass\n\ndef flatten_orders(positions: dict[str, int]) -> list[tuple[str, str, int]]:\n    # TODO\n    pass",
    "eHint": "class RiskKillSwitch:\n    def __init__(self, max_drawdown: float, max_loss_abs: float):\n        self.mdd = max_drawdown\n        self.mloss = max_loss_abs\n        self.peak = 0.0\n        self.halted = False\n\n    def update(self, equity: float) -> str:\n        if self.halted:\n            return \"HALT\"\n        self.peak = max(self.peak, equity)\n        if equity <= -self.mloss or (self.peak - equity) >= self.mdd:\n            self.halted = True\n            return \"HALT\"\n        return \"ACTIVE\"\n\ndef flatten_orders(positions: dict[str, int]) -> list[tuple[str, str, int]]:\n    out = []\n    for sym in sorted(positions):\n        q = positions[sym]\n        if q > 0:\n            out.append((sym, \"SELL\", q))\n        elif q < 0:\n            out.append((sym, \"BUY\", -q))\n    return out",
    "eTest": "ks = RiskKillSwitch(500.0, 1000.0)\nassert ks.update(300.0) == \"ACTIVE\" and ks.update(-100.0) == \"ACTIVE\"\nassert ks.update(-250.0) == \"HALT\" and ks.update(999.0) == \"HALT\"\nassert flatten_orders({\"MSFT\": -10, \"AAPL\": 25, \"ZERO\": 0}) == [(\"AAPL\", \"SELL\", 25), (\"MSFT\", \"BUY\", 10)]\nprint('All checks passed.')",
    "aTitle": "Graceful Cancel-All + Market-Exit Risk Flattening Sequencer",
    "aDesc": "Write `schedule_risk_exit(open_orders: list[str], positions: dict[str, int]) -> dict`: prioritize `\"cancel_ids\"` first (sorted), then `\"flatten_qty\": sum(abs(q))` and `\"steps\": [\"CANCEL_ALL\", \"FLATTEN\"]` if any non-zero positions remain else `[\"CANCEL_ALL\"]` (or `[]` if nothing active).",
    "aStarter": "def schedule_risk_exit(open_orders: list[str], positions: dict[str, int]) -> dict:\n    # TODO\n    pass",
    "aHint": "def schedule_risk_exit(open_orders: list[str], positions: dict[str, int]) -> dict:\n    fq = sum(abs(q) for q in positions.values() if q != 0)\n    steps = []\n    if open_orders:\n        steps.append(\"CANCEL_ALL\")\n    if fq > 0:\n        steps.append(\"FLATTEN\")\n    return {\"cancel_ids\": sorted(open_orders), \"flatten_qty\": fq, \"steps\": steps}",
    "aTest": "assert schedule_risk_exit([\"o2\", \"o1\"], {\"ES\": 4, \"NQ\": -2}) == {\"cancel_ids\": [\"o1\", \"o2\"], \"flatten_qty\": 6, \"steps\": [\"CANCEL_ALL\", \"FLATTEN\"]}\nassert schedule_risk_exit([\"o1\"], {\"ES\": 0}) == {\"cancel_ids\": [\"o1\"], \"flatten_qty\": 0, \"steps\": [\"CANCEL_ALL\"]}\nassert schedule_risk_exit([], {}) == {\"cancel_ids\": [], \"flatten_qty\": 0, \"steps\": []}\nprint('All checks passed.')"
  },
  {
    "day": 59,
    "fallbackTitle": "Funding Rate Arbitrage, Basis Carry & Liquidation Margin Math in Perpetual Swaps",
    "eTitle": "Perpetual Swap Cash-and-Carry Funding Yield & Basis Calculator",
    "eDesc": "Write `perp_basis_carry(spot_ask: float, perp_bid: float, funding_8h_rates: list[float], fee_bps_roundtrip: float) -> dict`: compute entry basis `(perp_bid - spot_ask) / spot_ask`, net carry return `basis + sum(funding_8h_rates) - fee_bps_roundtrip / 10000.0`, and `\"profitable\": net_carry > 0`. Round floats to 6 decimals.",
    "eStarter": "def perp_basis_carry(spot_ask: float, perp_bid: float, funding_8h_rates: list[float], fee_bps_roundtrip: float) -> dict:\n    # TODO\n    pass",
    "eHint": "def perp_basis_carry(spot_ask: float, perp_bid: float, funding_8h_rates: list[float], fee_bps_roundtrip: float) -> dict:\n    basis = (perp_bid - spot_ask) / spot_ask\n    net = basis + sum(funding_8h_rates) - fee_bps_roundtrip / 10000.0\n    return {\"basis\": round(basis, 6), \"net_carry\": round(net, 6), \"profitable\": net > 0}",
    "eTest": "assert perp_basis_carry(10000.0, 10020.0, [0.0005, 0.0005], 10.0) == {\"basis\": 0.002, \"net_carry\": 0.002, \"profitable\": True}\nassert perp_basis_carry(10000.0, 10000.0, [-0.002], 10.0)[\"profitable\"] is False\nassert perp_basis_carry(100.0, 100.0, [], 0.0) == {\"basis\": 0.0, \"net_carry\": 0.0, \"profitable\": False}\nprint('All checks passed.')",
    "aTitle": "Cross-Margin Perpetual Leverage & Liquidation Price Calculator",
    "aDesc": "Write `perp_liquidation_price(entry_px: float, qty: float, collateral: float, maint_margin_rate: float) -> float | None`: `qty > 0` long, `qty < 0` short. Solve linear liquidation price `p` where `collateral + qty * (p - entry_px) == abs(qty) * p * maint_margin_rate`. Return `round(max(0.0, p), 4)` (`None` if `qty == 0`).",
    "aStarter": "def perp_liquidation_price(entry_px: float, qty: float, collateral: float, maint_margin_rate: float):\n    # TODO\n    pass",
    "aHint": "def perp_liquidation_price(entry_px: float, qty: float, collateral: float, maint_margin_rate: float):\n    if qty == 0:\n        return None\n    if qty > 0:\n        p = (qty * entry_px - collateral) / (qty * (1.0 - maint_margin_rate))\n    else:\n        aq = abs(qty)\n        p = (aq * entry_px + collateral) / (aq * (1.0 + maint_margin_rate))\n    return round(max(0.0, p), 4)",
    "aTest": "assert perp_liquidation_price(100.0, 1.0, 20.0, 0.0) == 80.0\nassert perp_liquidation_price(100.0, -1.0, 20.0, 0.0) == 120.0\nassert perp_liquidation_price(100.0, 0.0, 20.0, 0.05) is None\nprint('All checks passed.')"
  },
  {
    "day": 60,
    "fallbackTitle": "Milestone 12 Capstone: Autonomous Multi-Strategy Quant Execution & Risk Platform",
    "eTitle": "Milestone 12A: Multi-Strategy Risk-Budget Allocator & Fat-Finger Guard",
    "eDesc": "Write `allocate_multi_strategy(strats: list[dict], equity: float, max_dd_halt: float) -> dict`: filter strategies with `dd < max_dd_halt` and `sharpe > 0`; weight proportionally to `sharpe / vol` normalizing sum of allocated capitals to `<= equity` (exact `equity` if >= 1 eligible strat), rounding each strategy USD allocation to 2 decimals.",
    "eStarter": "def allocate_multi_strategy(strats: list[dict], equity: float, max_dd_halt: float) -> dict:\n    # TODO\n    pass",
    "eHint": "def allocate_multi_strategy(strats: list[dict], equity: float, max_dd_halt: float) -> dict:\n    elig = [s for s in strats if s[\"dd\"] < max_dd_halt and s[\"sharpe\"] > 0 and s[\"vol\"] > 0]\n    if not elig:\n        return {s[\"id\"]: 0.0 for s in strats}\n    raw = {s[\"id\"]: s[\"sharpe\"] / s[\"vol\"] for s in elig}\n    tot = sum(raw.values())\n    return {s[\"id\"]: (round(equity * raw[s[\"id\"]] / tot, 2) if s[\"id\"] in raw else 0.0) for s in strats}",
    "eTest": "ss = [{\"id\": \"stat\", \"sharpe\": 2.0, \"vol\": 0.1, \"dd\": 0.02}, {\"id\": \"mm\", \"sharpe\": 4.0, \"vol\": 0.2, \"dd\": 0.01}, {\"id\": \"dead\", \"sharpe\": 3.0, \"vol\": 0.1, \"dd\": 0.15}]\nassert allocate_multi_strategy(ss, 100000.0, 0.10) == {\"stat\": 50000.0, \"mm\": 50000.0, \"dead\": 0.0}\nassert allocate_multi_strategy([ss[2]], 100000.0, 0.10) == {\"dead\": 0.0}\nassert allocate_multi_strategy([], 1000.0, 0.10) == {}\nprint('All checks passed.')",
    "aTitle": "Milestone 12B: Unified Alpha-to-Execution Trade Netting & SOR Gate",
    "aDesc": "Write `net_and_route_orders(target_pos: dict[str, int], curr_pos: dict[str, int], mid_prices: dict[str, float], max_notional: float) -> list[dict]`: compute delta shares `target - curr` for sorted symbols with non-zero delta; clamp order quantity downward (`int(max_notional // mid_prices[s])`) if notional exceeds `max_notional`. Return `[{\"sym\": s, \"side\": \"BUY\"|\"SELL\", \"qty\": int}]`.",
    "aStarter": "def net_and_route_orders(target_pos: dict[str, int], curr_pos: dict[str, int], mid_prices: dict[str, float], max_notional: float) -> list[dict]:\n    # TODO\n    pass",
    "aHint": "def net_and_route_orders(target_pos: dict[str, int], curr_pos: dict[str, int], mid_prices: dict[str, float], max_notional: float) -> list[dict]:\n    orders = []\n    for s in sorted(set(target_pos) | set(curr_pos)):\n        d = target_pos.get(s, 0) - curr_pos.get(s, 0)\n        if d == 0:\n            continue\n        aq = min(abs(d), int(max_notional // mid_prices[s]))\n        if aq > 0:\n            orders.append({\"sym\": s, \"side\": \"BUY\" if d > 0 else \"SELL\", \"qty\": aq})\n    return orders",
    "aTest": "assert net_and_route_orders({\"AAPL\": 200, \"MSFT\": 0}, {\"AAPL\": 50, \"MSFT\": 30}, {\"AAPL\": 100.0, \"MSFT\": 200.0}, 10000.0) == [{\"sym\": \"AAPL\", \"side\": \"BUY\", \"qty\": 100}, {\"sym\": \"MSFT\", \"side\": \"SELL\", \"qty\": 30}]\nassert net_and_route_orders({\"AAPL\": 50}, {\"AAPL\": 50}, {\"AAPL\": 100.0}, 1000.0) == []\nassert net_and_route_orders({}, {}, {}, 1000.0) == []\nprint('All checks passed.')"
  }
];

const indexByDay = new Map((MONTH2_LESSON_INDEX['quant-py'] || []).map((entry) => [entry.day, entry]));

export const QUANT_PYTHON_MONTH2_CONFIGS: DayConfig[] = RAW_M2_DAY_TASKS.map((t) => {
  const indexed = indexByDay.get(t.day);
  return {
    day: t.day,
    title: indexed?.title || t.fallbackTitle,
    desc: indexed?.goal || `${t.fallbackTitle} — hands-on coding labs.`,
    syllabus: indexed?.summary?.length ? indexed.summary : [t.eTitle, t.aTitle],
    eLanguage: 'python',
    aLanguage: 'python',
    eTitle: t.eTitle,
    eDesc: t.eDesc,
    eStarter: t.eStarter,
    eHint: t.eHint,
    eTest: t.eTest,
    aTitle: t.aTitle,
    aDesc: t.aDesc,
    aStarter: t.aStarter,
    aHint: t.aHint,
    aTest: t.aTest,
  };
});

export const QUANT_PYTHON_MONTH2_QUESTS: CourseQuest[] = QUANT_PYTHON_MONTH2_CONFIGS.flatMap((cfg) =>
  buildEnrichedDayQuests('quant-py', cfg.day!, cfg)
);
