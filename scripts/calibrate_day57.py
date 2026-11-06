import json
import re

def count_words(text: str) -> int:
    return len(re.findall(r'\b\S+\b', text))

def estimate_spoken_minutes(parts: list) -> int:
    words = sum(count_words(p['say']) for p in parts)
    return round(words / 110)

def estimate_lesson_minutes(parts: list) -> int:
    total = 0
    for p in parts:
        total += count_words(p['say'])
        total += count_words(p.get('example', ''))
        total += count_words(p.get('tryIt', ''))
    return round(total / 87)

# Day 57 calibrated
p1_say = (
    "Welcome to Day 57. Today we deconstruct the most spectacular structural breakdown in modern financial history: the May 6, 2010 Flash Crash. "
    "At exactly 2:32 PM Eastern Daylight Time, the Dow Jones Industrial Average began a precipitously steep dive, plunging nearly one thousand points or nine percent in less than twenty minutes, temporarily vaporizing one trillion dollars in sovereign enterprise value before violently rebounding. "
    "Shares of blue-chip cornerstone companies behaved like corrupted lottery tickets: Procter & Gamble plummeted by thirty-seven percent to thirty-nine dollars before bouncing, while consultancy giant Accenture traded down to one single penny per share, and Sotheby's briefly changed hands at ninety-nine thousand nine hundred and ninety-nine dollars. "
    "The joint investigation conducted by the Securities and Exchange Commission and the Commodity Futures Trading Commission released five months later revealed an extraordinary cascade of algorithmic failure points that exposed the fragile structural interconnectedness of fragmented modern electronic markets. "
    "The initial catalyst was not a rogue macro state actor, but a routine portfolio hedging program executed on behalf of a mutual fund complex, Waddell & Reed, which initiated a massive sell order of seventy-five thousand E-mini S&P 500 futures contracts, representing approximately four point one billion dollars in gross notional value. "
    "Crucially, the execution algorithm selected by Waddell & Reed was a naive volume-participation algorithmic model programmed to target exactly nine percent of total market volume calculated over the preceding one-minute window, without any price sensitivity constraints, limit ceilings, or rate bands whatsoever. "
    "As the mutual fund's algorithmic execution dumped thousands of contracts into the central order book, opportunistic high-frequency trading market makers stepped in to absorb the initial selling inventory. "
    "However, HFT market makers do not warehouse directional risk overnight; they are statistical liquidity intermediaries operating with tightly bound inventory capacity constraints. "
    "Having acquired thousands of long E-mini contracts from Waddell & Reed, these HFT market makers immediately attempted to offload their rapidly accumulating long positions back into the order book to balance their risk limits. "
    "Because Waddell & Reed's naive algorithm continued to aggressively sell into the market, the HFT algorithms rapidly traded contracts back and forth amongst themselves in a vicious high-frequency hot-potato feedback loop. "
    "Within fourteen minutes between 2:31 PM and 2:45 PM, HFT algorithms traded over one hundred and forty thousand E-mini contracts, yet their collective net inventory barely shifted by two thousand contracts. "
    "This circular trading created an artificial explosion in perceived volume, which tricked the naive nine-percent volume-participation algorithm into accelerating its own sell order submission rate, demanding even more liquidity from a rapidly evaporating order book. "
    "When internal automated risk limits on HFT statistical market-making engines hit pre-configured volatility and drawdown thresholds, their risk algorithms automatically withdrew bids from the market across both the Chicago Mercantile Exchange and New York equity venues. "
    "With liquidity providers dark and cross-market arbitrageurs dumping equity baskets to hedge E-mini discounts via Intermarket Sweep Orders, incoming market sell orders ripped through stub quotes, executing against dummy bids posted at one penny. "
    "As quantitative systems architects, our paramount takeaway from May 6, 2010 is that liquidity in electronic limit order books is not a continuous, static reservoir; it is a highly dynamic, endogenous state variable that can evaporate instantaneously when automated feedback loops overwhelm market capacity. "
    "In response, global regulators eventually introduced single-stock circuit breakers and the Limit-Up/Limit-Down mechanism, but as systems designers, we must engineer internal safeguards that prevent our execution engines from feeding toxic volume feedback loops."
)

p2_say = (
    "In Part 2, we turn to the second critical structural component of modern market breakdowns: phantom liquidity and quote manipulation. "
    "In April 2015, five years after the Flash Crash, the United States Department of Justice filed criminal fraud charges against Navinder Singh Sarao, an algorithmic futures trader operating out of a suburban London bedroom. "
    "The criminal complaint revealed that on May 6, 2010, Sarao utilized custom-built automated execution software to manipulate the CME E-mini S&P order book through massive, systematic spoofing. "
    "Spoofing is an illegal market manipulation practice defined under the Dodd-Frank Wall Street Reform and Consumer Protection Act as submitting non-bona-fide orders with the explicit intent to cancel them before execution. "
    "Sarao's algorithm, colloquially referred to by investigators as the Spoofing Engine, placed tens of thousands of large sell limit orders several ticks above the prevailing best ask price. "
    "At various points during the afternoon of May 6, Sarao's spoofed sell orders accounted for between twenty and twenty-nine percent of the entire visible sell-side depth in the E-mini order book. "
    "Whenever the market price ticked upwards, approaching his spoof orders, Sarao's automated software modified or canceled the orders within microseconds, continuously keeping them four to six ticks away from execution while maintaining a suffocating visual wall of phantom supply. "
    "Other quantitative algorithmic market makers, reading the aggregated depth of book across level two and level three market data feeds, perceived this phantom supply as an overwhelming wall of institutional selling pressure. "
    "Fearing imminent downward inventory risk, these statistical arbitrageurs and market makers preemptively withdrew their buy orders and began front-running the perceived sell wall, driving the price downward. "
    "Once the price plummeted, Sarao would buy contracts at artificially depressed prices, cancel his phantom sell wall, and immediately liquidate his long inventory at higher prices for millions of dollars in illicit profits. "
    "To detect and defend against phantom liquidity in quantitative trading systems, we must continuously calculate high-frequency microstructure metrics: primarily the Quote-to-Trade Ratio, or QTR, and the Average Order Lifespan. "
    "In benign, organic trading environments, institutional and retail market participants exhibit a Quote-to-Trade Ratio typically between ten-to-one and one-hundred-to-one, meaning ten to one hundred order actions occur per executed trade. "
    "Under aggressive algorithmic spoofing attacks, however, the Quote-to-Trade Ratio explodes to five thousand-to-one, ten thousand-to-one, or even fifty thousand-to-one, accompanied by median order lifespans dropping below ten milliseconds. "
    "Furthermore, spoofing exhibits high order cancellation clustering: orders placed five ticks deep are canceled with an empirical execution probability of less than zero point zero one percent. "
    "A production quantitative trading engine must possess real-time forensic filters that monitor both inbound exchange order streams and its own execution pipelines. "
    "By computing rolling quote-to-trade ratios and order lifetime distributions across discrete price tiers, our quantitative gateway can immediately flag spoofing rings, discount deceptive phantom liquidity, and prevent our execution models from getting trapped. "
    "We must recognize that when an order book exhibits thousands of order updates per millisecond without accompanying trades, the displayed volume does not represent genuine economic commitment, but rather manipulative algorithmic noise designed to deceive automated pricing heuristics."
)

p3_say = (
    "In Part 3, we architect and implement the core engineering solution: a real-time anti-spoofing filter coupled with a robust volume-weighted micro-price engine. "
    "When designing algorithmic trading strategies, our alpha signals often rely on Order Book Imbalance, or OBI, calculated from level two and level three depth of book feeds. "
    "Standard order book imbalance is defined as the total bid volume minus the total ask volume, divided by the sum of bid and ask volume across the top five price levels. "
    "If an adversarial spoofer places a massive four-thousand-contract sell order four ticks deep in the book, standard OBI immediately plummets to negative zero point nine, signaling massive selling pressure and inducing our market-making strategy to sell aggressively. "
    "If we allow raw order book depth to feed directly into our pricing equations without filtration, our quantitative algorithms become easily manipulated victims of predatory spoofers. "
    "To solve this vulnerability, we implement a two-stage defensive architecture: the Order Credibility Weighting Filter, followed by the Robust Micro-Price Estimator. "
    "The Order Credibility Filter assigns a dynamic credibility score between zero point zero and one point zero to each discrete price level in the limit order book. "
    "The credibility score is computed as a function of three microstructure variables: first, the distance of the price level from the prevailing mid-market price; second, the historical cancellation rate of orders resting at that specific level; and third, the average resting lifespan of volume residing in that queue. "
    "If an enormous block of volume appears five ticks deep in the order book but possesses a historical cancellation probability exceeding ninety-five percent and an average lifespan of under fifty milliseconds, the credibility filter damps its volume contribution by ninety percent or zeros it out entirely. "
    "Once credibility weights are applied across each price level, our pricing engine computes the Robust Micro-Price. "
    "Instead of the naive mid-price, which ignores order book queue dynamics, or the naive volume-weighted mid-price, which is corrupted by spoofing, the Robust Micro-Price calculates the queue-imbalance-adjusted price using only verified, credibility-weighted bona-fide depth. "
    "Mathematically, the Robust Micro-Price weights the best bid and best ask using credibility-filtered depth, adjusting the theoretical valuation toward the side with genuine, long-lived liquidity commitments. "
    "This ensures that when a phantom sell wall appears four ticks deep, our micro-price signal remains completely stable and unperturbed, preventing toxic inventory accumulation. "
    "In addition, our anti-spoofing engine maintains an internal rolling blacklist of client IDs or MPIDs associated with persistent non-bona-fide quote modifications, automatically tagging their order updates as toxic flow. "
    "By embedding this credibility filter directly into our C++ tick-processing pipeline, we insulate our market-making and statistical arbitrage models against spoofing-induced liquidity traps. "
    "The resulting valuation reflects true clearing prices rather than transient mirages, allowing our execution algorithms to quote with confidence even when predatory participants flood the book with deceptive volume."
)

p4_say = (
    "In Part 4, we put our anti-spoofing defense engine to the ultimate test in a simulated live production incident lab. "
    "We construct an end-to-end stress harness that injects an adversarial spoofing attack against an active limit order book, comparing the performance of an unprotected naive trading algorithm against our credibility-hardened robust engine. "
    "In this scenario, our simulated trading agent is responsible for market making in a liquid asset with an initial balanced bid-ask spread of one hundred dollars bid and one hundred point twenty-five dollars ask, with one hundred shares visible on each side. "
    "Suddenly, an adversarial spoofer begins firing a massive spoof attack on the ask side: submitting five thousand shares at one hundred point seventy-five dollars, then rapidly modifying and canceling them every forty milliseconds. "
    "The unprotected naive market-making algorithm observes the raw order book imbalance shift from neutral zero point zero to extreme negative zero point ninety-six. "
    "Interpreting this as overwhelming downward institutional liquidation pressure, the naive algorithm panics: it dumps its long inventory, cuts its bids to ninety-eight dollars, and aggressive hits lower bids, selling sixty shares at steep discounts and incurring severe slippage losses. "
    "Thirty seconds later, the adversarial spoofer cancels the phantom sell wall, buys up the cheap inventory, and the market price rebounds immediately back to one hundred point twelve dollars, locking in a catastrophic loss for the naive algorithm. "
    "Simultaneously, we run our credibility-filtered robust engine against the exact same adversarial tick stream. "
    "When the spoofer's five-thousand-share order appears at one hundred point seventy-five dollars, our engine evaluates the order's microstructure characteristics. "
    "The distance penalty reduces its weight by sixty percent because it rests three ticks deep. "
    "More critically, our forensic tracker detects that the order's lifespan is only thirty-five milliseconds and its submitter has canceled eighteen consecutive orders within the last two seconds. "
    "The cancellation penalty and lifespan penalty reduce the order's effective credibility weight to zero point zero zero four. "
    "Instead of factoring five thousand shares into the imbalance calculation, the robust engine perceives only twenty effective shares. "
    "The Robust Micro-Price stays rock-solid at one hundred point twelve dollars, exactly at the true fair value of the asset. "
    "Our market maker holds its disciplined quote posture, refuses to panic sell, and successfully captures the bid-ask spread without suffering a single cent of predatory adverse selection. "
    "In our C++ implementation, we will log both execution pathways side-by-side, tracking portfolio PnL, inventory swings, and adverse selection drawdowns across the attack cycle to definitively demonstrate the quantifiable survival advantage of microstructure-level defense. "
    "This quantitative verification proves that an algorithmic trading firm without anti-spoofing filtering is essentially hemorrhaging capital to manipulative order book spoofers on a daily basis."
)

p5_say = (
    "In our final session for Day 57, we synthesize the technical, regulatory, and legal dimensions of market manipulation defense under SEC Rule 10b-5 and the Dodd-Frank Act. "
    "Following the 2010 Flash Crash and the prosecution of high-profile spoofing operations, global regulatory authorities dramatically heightened statutory surveillance and enforcement against disruptive algorithmic trading practices. "
    "Under Section 747 of the Dodd-Frank Act, which amended the Commodity Exchange Act, spoofing is explicitly defined as a felony offense characterized by bidding or offering with the intent to cancel before execution. "
    "In parallel, SEC Rule 10b-5 and Section 9(a)(2) of the Securities Exchange Act of 1934 prohibit any manipulative device, scheme, or artifice to defraud, including wash trading, quote stuffing, and layering. "
    "As quantitative software engineers and systems architects, we bear strict dual responsibilities under this regulatory framework: first, ensuring that our proprietary algorithmic execution strategies never engage in manipulative behavior, whether intentional or accidental; and second, ensuring that our systems detect and shield our firm from external market manipulation. "
    "Accidental spoofing is a severe and frequent regulatory hazard for quantitative firms. "
    "For instance, if a multi-threaded algorithmic strategy exhibits a race condition where a worker thread submits a quote while another thread simultaneously cancels it without proper synchronization, the firm's trading logs may show thousands of sub-millisecond cancellations. "
    "Regulators like FINRA and the CFTC employ automated cross-market surveillance algorithms, such as FINRA's Cross-Market Order Surveillance Engine, which flag any participant whose Quote-to-Trade Ratio exceeds standard statistical thresholds or whose median order duration falls below five milliseconds. "
    "To achieve complete regulatory immunity and operational resilience, our execution gateway must incorporate an automated Pre-Submission Behavioral Compliance Gate. "
    "This compliance gate inspects all outbound orders before they reach the network interface card: it calculates the rolling Quote-to-Trade Ratio of each trading desk, enforces a minimum quote lifetime timer, blocks repetitive quote flickering, and prevents self-crossing wash trades across disparate internal trading accounts. "
    "Furthermore, all order book events, order cancellations, and internal risk metrics must be recorded in an immutable, cryptographically hashed audit log synchronized via PTP IEEE 1588 time stamps. "
    "By embedding regulatory compliance directly into the silicon and software fabric of our trading architecture, we guarantee that our sovereign quantitative systems operate with zero regulatory defects while standing impervious to external manipulation. "
    "This rigorous synthesis of software engineering, market microstructure forensics, and regulatory governance crowns our Day 57 curriculum and equips us to design trading systems that thrive under adversarial conditions."
)

# update day57_parts
import scripts.generate_quant_day57 as g
g.day57_parts[0]["say"] = p1_say
g.day57_parts[1]["say"] = p2_say
g.day57_parts[2]["say"] = p3_say
g.day57_parts[3]["say"] = p4_say
g.day57_parts[4]["say"] = p5_say

g.validate_day(g.day57_lesson)

with open('scripts/quant_day57.json', 'w', encoding='utf-8') as f:
    json.dump(g.day57_lesson, f, indent=2)
print("Updated scripts/quant_day57.json successfully!")
