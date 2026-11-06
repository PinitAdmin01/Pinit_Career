import re

with open("scripts/generate_day48_clean.py", "r", encoding="utf-8") as f:
    code = f.read()

p1_add = """ In addition, corporate controllers distinguish between committed fixed operating costs (such as long-term factory building depreciation under Ind AS 16 and non-cancellable lease liabilities under Ind AS 116) and discretionary fixed costs (such as brand advertising, executive training, and research feasibility studies). During cyclical industry downturns, agile management teams preserve liquidity by immediately curtailing discretionary fixed outlays, effectively dampening operating leverage and lowering the break-even volume required to protect operating solvency."""

p2_add = """ Furthermore, corporate treasuries must manage interest rate risk across dynamic macroeconomic monetary cycles. When borrowing under floating-rate facilities linked to the Reserve Bank of India (RBI) Repo Rate or External Benchmark Lending Rate (EBLR), sudden monetary tightening directly inflates annual finance costs, driving down the interest coverage cushion and elevating DFL. To immunize the capital structure against interest rate volatility, corporate financial officers utilize derivative hedging instruments—such as interest rate swaps (IRS) and interest rate caps—under the strict hedge accounting provisions of Ind AS 109."""

p3_add = """ In corporate valuation and financial modeling, the Degree of Combined Leverage directly dictates the equity beta ($\beta_L$) utilized in the Capital Asset Pricing Model (CAPM). Under Robert Hamada's classic leverage formulation ($\beta_L = \beta_U [1 + (1 - t)(D/E)]$), combining high fixed operating costs with high debt leverage inflates the equity risk premium demanded by public equity markets. Consequently, a bloated DCL penalizes the enterprise with a higher Weighted Average Cost of Capital (WACC), depressing discounted cash flow valuations and destroying market capitalization."""

p4_add = """ To evaluate non-manufacturing and emerging market corporate enterprises, Edward Altman also formulated the four-variable Altman Z''-Score model ($Z'' = 6.56 X_1 + 3.26 X_2 + 6.72 X_3 + 1.05 X_4$), which intentionally omits the asset turnover ratio $X_5$ to eliminate distortions arising from differing capital intensities across service, IT, and trading sectors. Indian credit rating agencies (CRISIL, ICRA, and CARE) deploy both classical and emerging-market Z-score variants to benchmark corporate borrowers during credit rating review committees."""

p5_add = """ Corporate controllers incorporate these leverage and distress metrics into executive risk dashboards reviewed monthly by the Chief Executive Officer and Chief Risk Officer. During annual statutory financial closures, the independent audit team inspects these sensitivity schedules to support their certification under CARO 2020 Clause 3(xix), providing conclusive documented evidence that the corporation maintains a robust solvency buffer capable of meeting all debt obligations maturing within the next twelve months."""

# Replace inside parts
code = code.replace(
    'comfortable Margin of Safety of 62.5%."""',
    'comfortable Margin of Safety of 62.5%.' + p1_add + '"""'
)

code = code.replace(
    'EPS for Titan\'s shareholders."""',
    'EPS for Titan\'s shareholders.' + p2_add + '"""'
)

code = code.replace(
    'maintaining optimal total corporate risk."""',
    'maintaining optimal total corporate risk.' + p3_add + '"""'
)

code = code.replace(
    'firmly placing Titan in the elite Safe Zone."""',
    'firmly placing Titan in the elite Safe Zone.' + p4_add + '"""'
)

code = code.replace(
    'ratings to corporate debentures."""',
    'ratings to corporate debentures.' + p5_add + '"""'
)

with open("scripts/generate_day48_clean.py", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated generate_day48_clean.py with rich expansions!")
