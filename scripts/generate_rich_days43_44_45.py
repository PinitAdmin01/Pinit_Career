# scripts/generate_rich_days43_44_45.py
import json

with open("scripts/make_month2_days43_44_45.py", "r", encoding="utf-8") as f:
    text = f.read()

# We only want the base code snippets from make_month2_days43_44_45.py
cut_marker = "print(\"All Day 43, 44 & 45 code snippets executed and verified successfully!\")"
if cut_marker in text:
    base_code = text[:text.find(cut_marker)].strip()
else:
    base_code = text.strip()

# ==============================================================================
# DAY 43 PARTS
# ==============================================================================
d43_parts = [
    {
        "title": "Pearson Correlation Coefficient & Covariance Matrix Algebra",
        "say": [
            "Welcome to Day 43 of PinIT Career OS. In Day 41 and Day 42, we explored univariate distributions and compared distinct sample cohorts through inferential hypothesis testing. Today, we advance to Bivariate Econometrics and Predictive Modeling: discovering and quantifying empirical relationships between two continuous business variables. In corporate financial planning, executive decision-makers are constantly evaluating relationships: How strongly does marketing expenditure correlate with sales revenue? Does employee training investment predict customer satisfaction? How does interest rate volatility drive loan default rates?",
            "The foundational mathematical metric of linear association between two continuous random variables is the Covariance. For sample data, Covariance is calculated as: Cov(X, Y) = s_xy = (1 / (n - 1)) * sum((x_i - mean_x) * (y_i - mean_y)). Covariance indicates the direction of association: a positive covariance reveals that when X is above its mean, Y tends to be above its mean; a negative covariance reveals an inverse relationship. However, Covariance has a fatal practical limitation: it is not scale-invariant! If you measure revenue in dollars, the covariance is in dollar-units squared; if you convert revenue to cents or euros, the covariance changes by orders of magnitude, making it impossible to compare the strength of relationships across disparate business metrics.",
            "To resolve this limitation, English mathematician Karl Pearson developed the Pearson Product-Moment Correlation Coefficient (r). Pearson normalized the sample covariance by dividing it by the product of the individual standard deviations: r = s_xy / (s_x * s_y). Pearson's r is completely dimensionless and strictly bounded within the closed interval [-1.0, +1.0]. A value of +1.0 indicates perfect positive linear correlation; -1.0 indicates perfect inverse linear correlation; and 0.0 indicates zero linear association. In modern Excel, correlation is calculated formulaically using =CORREL(array1, array2).",
            "Crucially, empirical correlation observed in a finite sample might be a deceptive fluke produced by random sampling noise. To determine whether an observed correlation coefficient r reflects a true underlying population relationship (rho != 0), financial engineers conduct a Student's t-test of correlation significance: t = r * sqrt((n - 2) / (1 - r^2)), with df = n - 2 degrees of freedom. If the associated two-tailed p-value is less than 0.05, we reject the null hypothesis of zero correlation (H0: rho = 0) and confirm that the bivariate association is statistically significant.",
            "However, every professional quantitative analyst must respect the immutable golden rule of econometrics: Correlation Does Not Imply Causation. Two variables can exhibit an extremely high correlation (r > 0.90) due to pure coincidence or the presence of an unobserved Confounding Variable (Lurking Variable). For example, historical data shows a near-perfect positive correlation between ice cream sales and drowning incidents; ice cream does not cause drowning—the confounding variable is summer temperature!",
            "Consider the Corporate Marketing Attribution Disaster. A retail enterprise noticed a high positive correlation (r = 0.88) between corporate billboard advertising spend in major metropolitan areas and online digital sales. The executive team authorized a 300% increase in billboard budgets ($15 million allocation). One year later, digital sales were completely flat! A deeper econometric audit revealed that billboards were concentrated in high-density tech hubs during economic boom years; the true causal driver of online sales was digital search advertising and macroeconomic income growth, not roadside billboards.",
            "In this opening masterclass of Day 43, we implement our PearsonCorrelationMatrixEngine in pure Python. We compute sample covariances, derive scale-invariant Pearson r metrics, execute t-statistic significance tests, and establish robust bivariate correlation baselines for enterprise predictive modeling."
        ],
        "example": "Think of the relationship between car speed and stopping distance: as speed increases, stopping distance increases; Pearson's correlation quantifies the consistency of this physical relationship on an exact normalized scale from zero to one, regardless of whether speed is measured in miles per hour or kilometers per hour.",
        "code": "d43_p1_code",
        "output": "d43_p1_out",
        "codeNotes": [
            {"line": 4, "note": "Initializes PearsonCorrelationMatrixEngine calculating sample covariance and Pearson r"},
            {"line": 20, "note": "Computes sample covariance: sum((x - mu_x)*(y - mu_y)) / (n - 1)"},
            {"line": 27, "note": "Calculates dimensionless Pearson r normalized by the product of standard deviations"},
            {"line": 30, "note": "Implements Student's t-test for correlation significance: t = r * sqrt(df / (1 - r^2))"}
        ],
        "tryIt": "Add an outlier point where ad_spend is 100.0 but revenue drops to 10.0 and observe how Pearson r collapses from 0.99 to 0.72, demonstrating sensitivity to extreme bivariate anomalies.",
        "check": {
            "question": "What does a Pearson correlation coefficient of r = 0.85 with p = 0.002 indicate about the relationship between marketing spend and customer acquisition?",
            "options": [
                "There is a strong, statistically significant positive linear relationship between marketing spend and acquisition in the sample data",
                "Marketing spend definitively caused 85% of all new customer acquisitions",
                "Customer acquisition will decline if marketing spend increases",
                "The test is invalid because r must always be greater than 1.0"
            ],
            "answer": 0,
            "why": "A correlation of r = 0.85 indicates a strong positive linear association, and p = 0.002 confirms it is statistically significant, though causality requires experimental or econometric validation."
        }
    },
    {
        "title": "Ordinary Least Squares (OLS) Formulation & R² Variance Decomposition",
        "say": [
            "While Pearson's correlation coefficient quantifies the strength and direction of linear association, it does not provide an operational forecasting equation. To predict future financial performance—such as forecasting expected quarterly revenue based on marketing budget allocations—quantitative analysts construct predictive models using Ordinary Least Squares (OLS) Simple Linear Regression.",
            "The mathematical equation of a simple bivariate linear regression model is: y_i = beta_0 + beta_1 * x_i + epsilon_i, where y_i is the Dependent Variable (the outcome we wish to forecast, such as revenue), x_i is the Independent Explanatory Variable (the driver, such as advertising spend), beta_0 is the intercept parameter (the expected value of y when x = 0), beta_1 is the slope parameter (the marginal change in y for every one-unit increase in x), and epsilon_i is the unobserved random error term.",
            "Ordinary Least Squares finds the unique mathematical line that minimizes the Sum of Squared Residuals (SSE): SSE = sum(e_i^2) = sum((y_i - y_hat_i)^2) = sum((y_i - (beta_0 + beta_1 * x_i))^2). By taking partial derivatives of SSE with respect to beta_0 and beta_1 and setting them to zero (the Gauss normal equations), we derive the closed-form OLS estimators: the optimal slope is beta_1 = sum((x_i - mean_x)*(y_i - mean_y)) / sum((x_i - mean_x)^2) = Cov(X, Y) / Var(X), and the optimal intercept is beta_0 = mean_y - beta_1 * mean_x. Notice that the regression line is mathematically guaranteed to pass directly through the centroid point (mean_x, mean_y) of the dataset.",
            "To evaluate how well the fitted regression line explains empirical variation in the dependent variable, financial econometricians decompose total variance into two orthogonal components: Total Sum of Squares (SST) = Regression Sum of Squares (SSR) + Error Sum of Squares (SSE), where SST = sum((y_i - mean_y)^2), SSR = sum((y_hat_i - mean_y)^2), and SSE = sum((y_i - y_hat_i)^2).",
            "The Coefficient of Determination (R^2) represents the proportion of total variance in the dependent variable explained by the regression model: R^2 = SSR / SST = 1 - (SSE / SST). In simple bivariate regression, R^2 is exactly equal to the square of Pearson's correlation coefficient (r^2). An R^2 of 0.85 means that 85% of the variance in revenue is directly explained by changes in advertising spend, while the remaining 15% is unexplained residual noise.",
            "In modern Excel, analysts extract regression parameters dynamically using formula functions. You can obtain the slope via =SLOPE(known_y's, known_x's), the intercept via =INTERCEPT(known_y's, known_x's), the coefficient of determination via =RSQ(known_y's, known_x's), and the complete multi-row statistical output matrix using the dynamic array formula =LINEST(known_y's, known_x's, TRUE, TRUE).",
            "In this second module of Day 43, we construct our OlsLinearRegressionEngine in pure Python. We calculate closed-form slope and intercept parameters, execute the three-way sum of squares decomposition (SST = SSR + SSE), compute R^2, and generate predicted values and residual vectors across an enterprise training dataset."
        ],
        "example": "Think of fitting a tight rubber band across a scatter of pegs on a wooden board: the rubber band snaps into the exact mathematical orientation where the vertical elastic tensions (squared distances) pulling from all pegs are in perfect mechanical equilibrium.",
        "code": "d43_p2_code",
        "output": "d43_p2_out",
        "codeNotes": [
            {"line": 3, "note": "Initializes OlsLinearRegressionEngine fitting bivariate regression models via closed-form OLS"},
            {"line": 15, "note": "Calculates OLS slope beta_1 = SS_xy / SS_xx and intercept beta_0 = mu_y - beta_1 * mu_x"},
            {"line": 21, "note": "Computes predicted values y_hat and residual errors e_i = y_i - y_hat_i"},
            {"line": 25, "note": "Executes orthogonal variance decomposition: SST = SSR + SSE and calculates R^2"}
        ],
        "tryIt": "Change hours from [1..8] to [2..9] and observe how the slope beta_1 remains identical while the intercept shifts, demonstrating the translation invariance of regression slopes.",
        "check": {
            "question": "What does an R-squared value of 0.78 indicate about an enterprise demand regression model?",
            "options": [
                "78% of the variation in product demand is explained by the independent predictor in the regression model",
                "Product demand will increase by exactly 78% next quarter",
                "The model was tested across 78 individual retail stores",
                "22% of customer orders were lost due to inventory stockouts"
            ],
            "answer": 0,
            "why": "R-squared measures the proportion of total variance in the dependent variable explained by the regression line; 78% is explained, while 22% remains residual noise."
        }
    },
    {
        "title": "The LINE Assumptions & Residual Diagnostic Scatter Plots",
        "say": [
            "We now arrive at the single most critical econometric validation requirement in predictive financial modeling: The LINE Assumptions and Residual Diagnostics. In commercial enterprise analytics, amateur modelers frequently commit the fatal 'R-Squared Fallacy': they run a regression, observe a high R^2 of 0.85 or 0.90, declare the model a triumph, and immediately deploy it into production financial forecasts.",
            "However, an impressive R^2 number alone is completely meaningless if the underlying data violates the Gauss-Markov assumptions! In 1973, legendary English statistician Francis Anscombe constructed the famous Anscombe's Quartet: four synthetic datasets that have identical means, identical variances, identical regression equations (y = 3.0 + 0.5x), and identical R^2 = 0.67. Yet when the data is plotted visually, Dataset 1 is a clean linear relationship; Dataset 2 is a smooth parabola where a linear model is totally invalid; Dataset 3 is a straight line ruined by a single vertical outlier; and Dataset 4 is a vertical cluster dominated by a single extreme leverage point! Blindly trusting the R^2 metric would lead to financial disaster in three out of the four cases.",
            "To prove that an Ordinary Least Squares regression model is econometrically valid, unbiased, and capable of generalizable forecasting, financial engineers verify the four classical LINE Assumptions: 1. Linearity: The true underlying relationship between X and Y is linear; 2. Independence: The error terms epsilon_i are independent and uncorrelated with each other (no serial autocorrelation); 3. Normality: The error terms are normally distributed with zero mean: epsilon_i ~ N(0, sigma^2); and 4. Equal Variance (Homoscedasticity): The error terms have constant variance sigma^2 across all levels of the predictor X.",
            "The primary diagnostic tool for validating the LINE assumptions is the Residual Scatter Plot: plotting the residuals e_i = y_i - y_hat_i on the vertical axis against the fitted values y_hat_i (or predictor x_i) on the horizontal axis. In an econometrically healthy model, the residuals should form a random, horizontal, unstructured cloud of points centered around zero, resembling white noise on an oscilloscope.",
            "If the residual plot exhibits a curved U-shape or inverted U-shape, the Linearity assumption is violated, proving that the true relationship is non-linear and requires polynomial terms (x^2) or logarithmic transformations. If the residual plot exhibits a fanning or cone pattern (where residuals spread wider as X increases), the Equal Variance assumption is violated—a severe defect known as Heteroscedasticity. Under heteroscedasticity, OLS standard errors are biased and untrustworthy, invalidating all p-values and confidence intervals.",
            "To detect Autocorrelation (violation of Independence, common in time-series data), econometricians compute the Durbin-Watson Statistic (DW): DW = sum((e_t - e_{t-1})^2) / sum(e_t^2). The Durbin-Watson statistic ranges from 0 to 4. A value near 2.0 indicates zero autocorrelation (independence validated). A value significantly below 1.5 indicates severe positive autocorrelation, where positive errors cluster with positive errors, artificially inflating t-statistics and leading to false discoveries.",
            "In this third module of Day 43, we construct our LineAssumptionsDiagnosticEngine in pure Python. We compute model residuals, calculate the Durbin-Watson statistic, evaluate homoscedasticity ratios across fitted ranges, and audit model econometric compliance."
        ],
        "example": "Think of target shooting at a shooting range: if all your bullet holes form a tight, random cluster centered around the bullseye, your rifle is properly calibrated (homoscedastic); if your shots spread wider and wider as distance increases like a shotgun spray, your sight has severe dispersion error (heteroscedasticity).",
        "code": "d43_p3_code",
        "output": "d43_p3_out",
        "codeNotes": [
            {"line": 3, "note": "Initializes LineAssumptionsDiagnosticEngine evaluating the Gauss-Markov LINE assumptions"},
            {"line": 13, "note": "Computes Durbin-Watson statistic testing for first-order serial autocorrelation: DW near 2.0"},
            {"line": 19, "note": "Evaluates homoscedasticity ratio comparing residual variance across first vs second half of data"},
            {"line": 26, "note": "Audits overall LINE compliance: requires both independence (DW in [1.5, 2.5]) and equal variance"}
        ],
        "tryIt": "Inject a massive quadratic curvature by setting true_y = [x**2 for x in hours] and observe how the residual diagnostics fail, exposing non-linearity.",
        "check": {
            "question": "What does a cone-shaped 'fanning out' pattern in a residual scatter plot indicate about a linear regression model?",
            "options": [
                "Heteroscedasticity: error variance is not constant, violating the Equal Variance assumption and invalidating standard errors",
                "The regression line has perfect predictive accuracy",
                "The dataset was collected during summer months",
                "All independent variables should be multiplied by 100"
            ],
            "answer": 0,
            "why": "A fanning pattern reveals heteroscedasticity (non-constant variance), which biases standard error calculations and invalidates hypothesis tests and confidence intervals."
        }
    },
    {
        "title": "Regression Inferential Statistics: Standard Errors, T-Stats, P-Values & ANOVA Table",
        "say": [
            "Having validated that our linear model satisfies the LINE assumptions, we now conduct Inferential Hypothesis Testing on the regression parameters. In commercial financial modeling, estimating a slope of beta_1 = 3.5 is not enough; executive stakeholders demand to know: Is this slope statistically significantly different from zero, or did we observe an apparent relationship by chance?",
            "The Standard Error of the Estimate (s_e) measures the standard deviation of data points around the fitted regression line: s_e = sqrt(SSE / (n - 2)) = sqrt(sum((y_i - y_hat_i)^2) / (n - 2)). The denominator n - 2 reflects the fact that two degrees of freedom were consumed in estimating the intercept beta_0 and slope beta_1. The Standard Error of the Slope (SE(beta_1)) quantifies the sampling variability of the estimated slope across hypothetical repeated samples: SE(beta_1) = s_e / sqrt(sum((x_i - mean_x)^2)).",
            "To test the null hypothesis that the slope is zero (H0: beta_1 = 0, asserting that X has zero predictive power over Y), we compute the Student's t-statistic for the slope: t_beta1 = (beta_1 - 0) / SE(beta_1), with df = n - 2 degrees of freedom. If the absolute t-statistic is large (typically |t| > 2.0 for n > 30) and the associated p-value is less than 0.05, we reject the null hypothesis and confirm that the predictor X has a statistically significant linear effect on the dependent outcome Y.",
            "Simultaneously, econometricians construct the Regression ANOVA Summary Table, which conducts an omnibus test of overall model utility. The Mean Square Regression is MSR = SSR / k (where k = 1 for simple regression), and the Mean Square Error is MSE = SSE / (n - k - 1). The Model F-Statistic is computed as: F = MSR / MSE. In simple linear regression, the model F-statistic is mathematically identical to the square of the slope's t-statistic: F = (t_beta1)^2. The F-statistic tests whether the model as a whole explains a significant portion of variance compared to a horizontal line through the mean mean_y.",
            "In modern Excel, running the Regression tool in the Data Analysis ToolPak generates the classic three-part Summary Output: the Regression Statistics table (Multiple R, R-Square, Adjusted R-Square, Standard Error, Observations); the ANOVA table (Degrees of Freedom, SS, MS, F, Significance F); and the Coefficients table (Intercept, Slope, Standard Error, t Stat, P-value, Lower 95%, Upper 95%). Understanding how each cell in this table is derived allows financial engineers to interpret and audit regression models with institutional authority.",
            "In this fourth module of Day 43, we construct our RegressionInferenceAuditor in pure Python. We compute standard errors of the estimate, calculate SE(beta_1), derive slope t-statistics and p-values, construct the model-level ANOVA F-statistic, and verify statistical significance."
        ],
        "example": "Think of an architectural survey verifying whether a skyscraper's foundation is sinking: measuring a one-millimeter settlement is meaningless without knowing the margin of error of your laser measurement tool; standard error provides the precision bounds needed to confirm structural stability.",
        "code": "d43_p4_code",
        "output": "d43_p4_out",
        "codeNotes": [
            {"line": 4, "note": "Initializes RegressionInferenceAuditor computing statistical inference for regression parameters"},
            {"line": 23, "note": "Calculates Standard Error of Estimate: s_e = sqrt(SSE / (n - 2))"},
            {"line": 25, "note": "Computes Standard Error of the slope: SE(beta_1) = s_e / sqrt(SS_xx)"},
            {"line": 28, "note": "Computes slope t-statistic and model-level ANOVA F-statistic: MSR / MSE"}
        ],
        "tryIt": "Increase sample size by duplicating the dataset with minor noise and observe how SE(beta_1) shrinks by a factor of 1/sqrt(2), demonstrating sample size leverage on precision.",
        "check": {
            "question": "In a simple bivariate regression, what is the exact mathematical relationship between the slope t-statistic and the model ANOVA F-statistic?",
            "options": [
                "The model F-statistic is exactly equal to the square of the slope t-statistic: F = t^2",
                "The F-statistic is always equal to the t-statistic divided by 2",
                "The t-statistic and F-statistic are completely unrelated",
                "The F-statistic is equal to the t-statistic multiplied by R-squared"
            ],
            "answer": 0,
            "why": "In simple linear regression with one predictor, MSR has 1 degree of freedom, meaning the F-ratio (MSR / MSE) simplifies mathematically to the square of the t-statistic (t^2)."
        }
    },
    {
        "title": "Master OLS Econometric Gateway: Cryptographic Regression Certification",
        "say": [
            "We conclude Day 43 by uniting correlation, OLS parameter estimation, LINE assumption diagnostics, and inferential hypothesis testing into an institutional-grade production system: the Master OLS Econometric Gateway. In enterprise corporations governed by Sarbanes-Oxley (SOX 404) internal controls, capital allocation models and commercial revenue forecasts must not rely on unvalidated, ad-hoc regression formulas pasted into spreadsheets.",
            "The Master OLS Econometric Gateway ingests raw bivariate time-series or cross-sectional data feeds, executes closed-form OLS estimation, verifies that R^2 exceeds required hurdle thresholds (e.g., R^2 > 0.70), audits coefficient statistical significance (p < 0.05), and confirms residual homoscedasticity. It then packages the complete econometric specification into a canonical JSON payload and computes an immutable SHA-256 cryptographic governance digest: OLS-SOX404-HASH.",
            "This cryptographic certification is embedded directly into executive boardroom capital expenditure proposals. If an external auditor, board member, or regulatory examiner inspects an enterprise capacity expansion proposal, the modeler presents the cryptographic token proving that the econometric forecasting model satisfied all Gauss-Markov LINE assumptions and achieved verified statistical significance before capital was deployed.",
            "Furthermore, in automated corporate FP&A pipelines, this cryptographic gateway acts as a production circuit breaker. If market structural breaks cause the regression model's R^2 to deteriorate below 0.70 or cause residual variance to blow out into severe heteroscedasticity, the gateway automatically rejects the model, sets the decision flag to REVISE_SPECIFICATION, and alerts quantitative modeling teams before flawed forecasts reach the C-suite.",
            "In this final module of Day 43, we execute our MasterOlsEconometricGateway across a multi-million-dollar capital expenditure and plant capacity dataset, certifying model parameters and generating an immutable cryptographic SOX 404 compliance certificate."
        ],
        "example": "Think of an airworthiness certificate issued by the FAA before a commercial airliner carries passengers: the certificate verifies that the aerodynamic wing design, jet engines, and avionics passed rigorous engineering stress-testing before flight operations begin.",
        "code": "d43_p5_code",
        "output": "d43_p5_out",
        "codeNotes": [
            {"line": 5, "note": "Defines MasterOlsEconometricGateway enforcing automated econometric model governance"},
            {"line": 15, "note": "Fits OLS parameters, calculates R^2, and evaluates capital allocation hurdle thresholds"},
            {"line": 28, "note": "Serializes model specification to canonical JSON and computes SHA-256 cryptographic digest"},
            {"line": 39, "note": "Executes gateway across capacity expansion dataset issuing an approved SOX 404 certificate"}
        ],
        "tryIt": "Reduce capex values so R^2 falls below 0.70 and observe how the gateway outputs 'REVISE_SPECIFICATION' to protect corporate treasury from unvalidated models.",
        "check": {
            "question": "Why do enterprise governance frameworks mandate cryptographic certification for OLS econometric models?",
            "options": [
                "To establish an immutable, tamper-evident audit record proving that regression equations, R^2 thresholds, and LINE assumptions were verified prior to capital expenditure commitments",
                "To automatically encrypt the spreadsheet so competitors cannot see the numbers",
                "To double the slope of the regression line",
                "To convert the regression equation into a visual bar chart"
            ],
            "answer": 0,
            "why": "Cryptographic tokens create a permanent verification record proving that econometric models satisfied rigorous mathematical and governance hurdles before informing capital decisions."
        }
    }
]

# ==============================================================================
# DAY 44 PARTS: Time-Series Forecasting & Exponential Smoothing (FORECAST.ETS)
# ==============================================================================
d44_parts = [
    {
        "title": "Classical Time-Series Decomposition: Level, Trend & Seasonal Indices",
        "say": [
            "Welcome to Day 44 of PinIT Career OS. On Day 43, we mastered Ordinary Least Squares regression for cross-sectional and bivariate modeling. Today, we step into the temporal dimension: Time-Series Forecasting and Seasonal Decomposition. In commercial business management, almost all economic data—monthly sales revenue, quarterly unit shipments, daily website traffic, customer support ticket volumes—unfolds chronologically over time.",
            "When analyzing chronological business data, applying static linear regression is often a fatal mistake. Why? Because real-world business time series do not follow straight lines. Instead, they exhibit distinct, recurring patterns driven by calendar dynamics: quarterly budget flushes, summer lulls, holiday shopping surges, and back-to-school peaks. If a retailer uses a straight-line trend to project holiday inventory, they will experience severe stockouts in December and massive excess inventory write-downs in January.",
            "To accurately forecast chronological data, quantitative analysts apply Classical Time-Series Decomposition. A time series Y_t is partitioned into three distinct underlying components: Trend-Cycle (T_t), representing long-term upward or downward movement; Seasonality (S_t), representing periodic, recurring calendar patterns of fixed duration (such as 4 quarters or 12 months); and Irregular/Noise (I_t), representing random white-noise fluctuations.",
            "Time-series decomposition can be structured as either Additive: Y_t = T_t + S_t + I_t, or Multiplicative: Y_t = T_t * S_t * I_t. An Additive model is appropriate when the seasonal swings remain constant in absolute dollar terms regardless of the overall trend level. A Multiplicative model is appropriate when seasonal swings grow proportionally with sales volume (e.g., Q4 is always +30% higher than baseline, meaning as the business grows, the absolute dollar surge expands).",
            "The classical decomposition process begins by extracting the underlying trend using a Centered Moving Average (CMA). For quarterly data with period p = 4, the moving average smooths out seasonal cycles, isolating T_t. Next, we compute Detrended values: Y_t - T_t in an additive model. By averaging these detrended values for each specific quarter across multiple years and normalizing them so they sum to zero, we derive the Normalized Seasonal Indices (S_1, S_2, S_3, S_4).",
            "In modern Excel, analysts utilize moving average formulas and seasonal index tables to de-seasonalize historical data, project the baseline trend forward into future years, and re-seasonalize the forecast by adding back the appropriate seasonal index.",
            "In this opening module of Day 44, we construct our ClassicalDecompositionEngine in pure Python. We extract moving average trends, calculate periodic seasonal indices, normalize additive components, and establish clean time-series foundations for enterprise forecasting."
        ],
        "example": "Think of ocean tides: the overall sea level might rise slowly over centuries due to climate change (Trend); twice a day, high and low tides rise and fall with mechanical predictability due to lunar gravity (Seasonality); and wind-blown storm waves cause random, unpredictable choppy surface ripples (Irregular Noise).",
        "code": "d44_p1_code",
        "output": "d44_p1_out",
        "codeNotes": [
            {"line": 3, "note": "Initializes ClassicalDecompositionEngine implementing additive time-series decomposition"},
            {"line": 15, "note": "Extracts Trend-Cycle using centered moving average smoothing over period p"},
            {"line": 20, "note": "Computes detrended series Y_t - Trend_t and aggregates average seasonal effects"},
            {"line": 28, "note": "Normalizes seasonal indices so they sum to 0 in an additive model structure"}
        ],
        "tryIt": "Change period from 4 to 12 for monthly data and observe how the engine calculates 12 distinct monthly seasonal indices.",
        "check": {
            "question": "What is the primary operational purpose of decomposing a business time series into trend and seasonality?",
            "options": [
                "To separate recurring calendar cycles from true underlying growth, preventing holiday demand spikes from being mistaken for permanent trend changes",
                "To delete historical records older than two years",
                "To convert currency values into bitcoin",
                "To force all seasonal indices to be positive numbers"
            ],
            "answer": 0,
            "why": "Decomposition isolates predictable seasonal swings from long-term trends, allowing planners to size inventory and staffing for calendar peaks without over-estimating baseline growth."
        }
    },
    {
        "title": "Holt-Winters Exponential Triple Smoothing (ETS) Mathematical Formulation",
        "say": [
            "While classical moving-average decomposition provides foundational intuition, modern enterprise planning requires adaptive, weighted forecasting algorithms that give greater mathematical weight to recent observations while systematically damping distant history. This is the domain of Exponential Smoothing.",
            "In 1956, Robert Brown formulated Simple Exponential Smoothing (SES), which uses a single parameter alpha to update the level: L_t = alpha * Y_t + (1 - alpha) * L_{t-1}. However, SES assumes zero trend and zero seasonality. In 1957, Charles Holt extended the framework to Holt's Linear Exponential Smoothing (Double Exponential Smoothing), adding a second parameter beta to track slope/trend: T_t = beta * (L_t - L_{t-1}) + (1 - beta) * T_{t-1}. Finally, in 1960, Peter Winters added a third parameter gamma to capture seasonality, creating the legendary Holt-Winters Exponential Triple Smoothing (ETS) algorithm.",
            "The Holt-Winters Additive ETS formulation updates three state variables at every time step t: 1. Level Equation: L_t = alpha * (Y_t - S_{t-p}) + (1 - alpha) * (L_{t-1} + T_{t-1}); 2. Trend Equation: T_t = beta * (L_t - L_{t-1}) + (1 - beta) * T_{t-1}; and 3. Seasonal Equation: S_t = gamma * (Y_t - L_t) + (1 - gamma) * S_{t-p}, where p is the seasonal period length, and alpha, beta, gamma are smoothing hyperparameters bounded in [0, 1].",
            "To generate a forward forecast m periods into the future, the Holt-Winters formula synthesizes all three state components: Y_hat_{t+m} = L_t + m * T_t + S_{t+m-p}. The level L_t establishes the current baseline; the trend T_t projects ongoing structural trajectory multiplied by the horizon m; and the seasonal index S captures the specific calendar shock for that future period.",
            "In modern Excel (introduced in Excel 2016 and expanded in Microsoft 365), this exact Holt-Winters ETS algorithm is natively embedded via the revolutionary formula: =FORECAST.ETS(target_date, values, timeline, [seasonality], [data_completion], [aggregation]). The Excel engine automatically optimizes alpha, beta, and gamma using maximum likelihood estimation (MLE), detects seasonal cycle lengths, and handles missing weekend or holiday timestamps seamlessly.",
            "Consider the catastrophic Holiday Stockout Disaster at an omnichannel consumer brand. The inventory planning team used a naive linear trend to project Q4 holiday shipments of high-margin wireless headphones. They projected 150,000 units. But customer demand spiked to 280,000 units due to December holiday gift buying. The company stocked out in the second week of December, forfeiting $26 million in gross margin and ceding retail shelf space to aggressive competitors. An ETS model incorporating historical quarterly seasonality would have projected 275,000 units with high accuracy.",
            "In this second module of Day 44, we construct our HoltWintersEtsEngine in pure Python. We implement the level, trend, and seasonal update equations, optimize smoothing parameters, and project multi-quarter forward demand forecasts."
        ],
        "example": "Think of steering a massive cargo container ship into a harbor: the current position is the Level; the rudder angle and engine thrust set the forward Trend; and the ocean tide and crosswinds represent Seasonality pushing the ship sideways; an autopilot continuously adjusts for all three forces.",
        "code": "d44_p2_code",
        "output": "d44_p2_out",
        "codeNotes": [
            {"line": 3, "note": "Initializes HoltWintersEtsEngine implementing additive triple exponential smoothing"},
            {"line": 15, "note": "Initializes level, trend, and seasonal state vectors across first two cycles"},
            {"line": 28, "note": "Executes iterative level, trend, and seasonal updates via smoothing parameters alpha, beta, gamma"},
            {"line": 37, "note": "Generates forward multi-horizon forecast: y_hat = level + m * trend + seasonal_factor"}
        ],
        "tryIt": "Increase the alpha parameter from 0.3 to 0.7 and observe how the model reacts much more aggressively to the most recent historical data points.",
        "check": {
            "question": "What is the primary role of the gamma smoothing parameter in the Holt-Winters ETS algorithm?",
            "options": [
                "It controls the rate at which seasonal factors are updated based on recent seasonal discrepancies",
                "It adjusts the spreadsheet row height automatically",
                "It calculates the annual inflation rate of the national currency",
                "It converts quarterly data into monthly data"
            ],
            "answer": 0,
            "why": "Gamma governs the seasonal smoothing equation, determining how quickly historical seasonal indices adapt to newly observed seasonal patterns."
        }
    },
    {
        "title": "Forecast Error Diagnostics: MAE, RMSE, MAPE & Tracking Signals",
        "say": [
            "Generating a forward time-series forecast is only half the battle. In professional quantitative finance and supply chain operations, quantitative analysts must rigorously audit and benchmark Forecast Accuracy before capital is committed to purchase orders.",
            "At every historical time step t where both an actual observed value A_t and a model forecast F_t exist, the Forecast Error is defined as: e_t = A_t - F_t. A positive error indicates under-forecasting (actual demand exceeded expectations, risking stockouts); a negative error indicates over-forecasting (actual demand fell short, creating excess working capital lockup).",
            "To evaluate overall forecast quality, financial engineers compute three classical error metrics: 1. Mean Absolute Error (MAE): MAE = (1 / n) * sum(|A_t - F_t|), measuring average error magnitude in physical units without considering direction; 2. Root Mean Squared Error (RMSE): RMSE = sqrt((1 / n) * sum((A_t - F_t)^2)), which squares individual errors, heavily penalizing large outliers; and 3. Mean Absolute Percentage Error (MAPE): MAPE = (1 / n) * sum(|(A_t - F_t) / A_t|) * 100%.",
            "Because MAPE expresses error as a percentage, it is the universal gold standard for enterprise benchmarking across diverse product lines and subsidiaries. In top-tier commercial supply chains, a MAPE below 10% is classified as Highly Accurate; 10% to 20% is Good; 20% to 50% is Marginal; and above 50% is Unacceptable, requiring immediate model recalibration.",
            "Furthermore, financial engineers monitor the Tracking Signal (TS) to detect persistent systemic bias: TS_t = (sum(e_i)) / MAD_t, where the numerator is Cumulative Sum of Forecast Errors (CFE), and the denominator is the Mean Absolute Deviation (MAD = MAE). In an unbiased forecasting model, positive and negative errors cancel each other out over time, keeping the numerator near zero. If the Tracking Signal drifts outside the control band of [-4.0, +4.0], it provides mathematical proof that the model is suffering from structural bias (consistently over-predicting or under-predicting).",
            "In this third module of Day 44, we construct our ForecastAccuracyProfiler in pure Python. We compute MAE, RMSE, MAPE, and tracking signals, auditing time-series model stability against enterprise accuracy thresholds."
        ],
        "example": "Think of target archery: if your arrows are scattered around the bullseye by three inches on average, your MAE is 3 inches; if all ten arrows land six inches high and to the right, your tracking signal alerts you that your bow sight is misaligned and pulling high.",
        "code": "d44_p3_code",
        "output": "d44_p3_out",
        "codeNotes": [
            {"line": 4, "note": "Initializes ForecastAccuracyProfiler computing MAE, RMSE, and percentage error metrics"},
            {"line": 15, "note": "Computes error vectors: raw errors, absolute errors, squared errors, and percentage errors"},
            {"line": 19, "note": "Calculates MAE, RMSE, and Mean Absolute Percentage Error (MAPE)"},
            {"line": 23, "note": "Derives Tracking Signal = Cumulative Error / MAD to detect persistent directional bias"}
        ],
        "tryIt": "Add a constant bias of +50 to all actuals and observe how the tracking signal shoots up beyond +4.0, triggering an automated bias alarm.",
        "check": {
            "question": "What does a Tracking Signal value of +5.8 indicate about an enterprise demand forecasting model?",
            "options": [
                "The model suffers from severe systemic under-forecasting bias, consistently predicting lower demand than actuals",
                "The model is 5.8% more accurate than last quarter",
                "The model has achieved perfect forecasting precision",
                "Inventory stock levels are 5.8 times higher than normal"
            ],
            "answer": 0,
            "why": "A tracking signal above +4.0 indicates that positive errors are accumulating unchecked, proving that the model is consistently under-forecasting real demand."
        }
    },
    {
        "title": "Prediction Confidence Cones & Dynamic Inventory Buffer Sizing",
        "say": [
            "A single-point forecast (e.g., 'Next quarter demand will be 240,000 units') is an incomplete engineering specification. In the physical reality of corporate supply chains and liquidity planning, point forecasts are almost never exactly right. Executive leaders require Prediction Intervals: an uncertainty band establishing upper and lower bounds at a stated level of confidence (e.g., 95% confidence).",
            "In time-series econometrics, forecasting uncertainty expands as the forecast horizon extends further into the future. Forecasting demand one month ahead carries relatively low uncertainty; forecasting twelve months ahead carries massive macroeconomic, competitive, and seasonal variance. Mathematically, the standard error of a time-series forecast at horizon h expands with the square root of the horizon: SE_h = RMSE * sqrt(h).",
            "For a 95% confidence prediction interval, the upper and lower bounds form an expanding Prediction Cone: Upper Bound_h = F_h + Z_{alpha/2} * SE_h, and Lower Bound_h = max(0, F_h - Z_{alpha/2} * SE_h), where Z_{0.025} = 1.96 for a Gaussian normal distribution. In modern Excel, analysts extract these exact prediction cones dynamically using `=FORECAST.ETS.CONFINT(target_date, values, timeline, 0.95)`.",
            "In enterprise inventory management, the upper bound of the prediction interval directly dictates Safety Stock sizing and working capital reserves: Safety Stock = Z * RMSE * sqrt(Lead Time). Sizing inventory to the point forecast guarantees a 50% stockout probability during peak demand! Sizing inventory to the 95% upper bound provides a 95% Cycle Service Level, ensuring that retail customers almost never encounter empty shelves.",
            "In this fourth module of Day 44, we construct our ForecastConfidenceIntervalCalculator in pure Python. We compute horizon-dependent prediction errors, establish 95% confidence bounds, and generate visual prediction cones for executive inventory authorization."
        ],
        "example": "Think of a hurricane trajectory forecast map: as meteorologists project the storm's path further into the week, the cone of uncertainty widens dramatically from a narrow line today to a vast geographic fan five days out.",
        "code": "d44_p4_code",
        "output": "d44_p4_out",
        "codeNotes": [
            {"line": 3, "note": "Initializes ForecastConfidenceIntervalCalculator generating 95% prediction interval cones"},
            {"line": 10, "note": "Expands margin of error across horizons: margin = Z * RMSE * sqrt(h)"},
            {"line": 13, "note": "Computes lower bound (clamped at 0) and upper bound establishing the confidence fan"},
            {"line": 21, "note": "Executes horizon calculations across forward quarters for executive supply chain sizing"}
        ],
        "tryIt": "Increase confidence from 0.95 to 0.99 and observe how the Z-score expands to 2.576, widening the upper buffer reserve.",
        "check": {
            "question": "Why does the prediction interval cone widen as the forecasting horizon extends further into the future?",
            "options": [
                "Because uncertainty compounds cumulatively over time, scaling with the square root of the forecast horizon",
                "Because spreadsheet cells expand their column width automatically",
                "Because interest rates always increase over time",
                "Because historical data becomes corrupted after 90 days"
            ],
            "answer": 0,
            "why": "Uncertainty naturally compounds over extended horizons, mathematically modeled as error variance scaling proportionally with horizon length h."
        }
    },
    {
        "title": "Master Time-Series ETS Forecasting Gateway: Enterprise Seasonal Projection Suite",
        "say": [
            "We conclude Day 44 by assembling our complete time-series forecasting pipeline into an institutional-grade production system: the Master Time-Series ETS Forecasting Gateway. In multinational manufacturing, consumer packaged goods (CPG), and retail logistics, procurement commitments totaling hundreds of millions of dollars must be mathematically governed and auditable.",
            "The Master Time-Series Gateway ingests historical sales streams, executes Holt-Winters ETS decomposition, evaluates MAPE accuracy metrics against the strict 10% enterprise threshold, calculates 95% upper safety stock buffers, and issues an immutable SHA-256 cryptographic procurement token: ETS-SUPPLY-HASH.",
            "If the historical fit achieves an approved MAPE (< 10%), the gateway outputs an authorized procurement decision: `ORDER_AUTHORIZED`. If the historical fit exhibits excessive variance (MAPE >= 10%), the gateway flags `MANUAL_OVERRIDE_REQUIRED`, preventing automated ERP purchasing engines from committing corporate cash to unvalidated inventory builds.",
            "This cryptographic certification is archived in corporate ERP databases (such as SAP S/4HANA or Oracle Cloud SCM) alongside every purchase requisition. If internal auditors review annual inventory write-downs, the procurement team presents the cryptographic certificate proving that all component orders were mathematically calibrated to validated seasonal ETS models.",
            "In this final module of Day 44, we execute our MasterTimeSeriesEtsGateway across an enterprise semiconductor processor supply chain dataset, certifying four-quarter forward demand and issuing an audited cryptographic procurement credential."
        ],
        "example": "Think of an automated flight dispatch release signed by a commercial airline flight dispatcher and captain before departure: it confirms fuel reserves, weather forecasts, and alternate airports before the aircraft is cleared for pushback.",
        "code": "d44_p5_code",
        "output": "d44_p5_out",
        "codeNotes": [
            {"line": 5, "note": "Defines MasterTimeSeriesEtsGateway enforcing automated supply chain forecasting governance"},
            {"line": 15, "note": "Calculates annual projected demand, upper safety stock requirements, and MAPE validation"},
            {"line": 26, "note": "Serializes forecast payload to canonical JSON and computes SHA-256 cryptographic token"},
            {"line": 37, "note": "Executes gateway across semiconductor supply chain issuing an approved procurement certificate"}
        ],
        "tryIt": "Increase MAPE from 4.2% to 12.5% and observe how the gateway shifts to 'MANUAL_OVERRIDE_REQUIRED', halting automated purchase orders.",
        "check": {
            "question": "What is the primary role of an automated forecasting decision gateway in enterprise supply chain procurement?",
            "options": [
                "To objectively enforce forecast accuracy hurdles (MAPE < 10%) before authorizing capital commitments, preventing multi-million-dollar inventory write-downs",
                "To automatically delete unsold inventory from warehouse shelves",
                "To convert seasonal indices into currency exchange rates",
                "To force all suppliers to offer 50% discounts"
            ],
            "answer": 0,
            "why": "The gateway prevents automated ERP purchasing engines from ordering millions in inventory based on unstable, inaccurate forecasting models."
        }
    }
]

# ==============================================================================
# DAY 45 PARTS: ⭐ Milestone 6: ApexAnalytics Statistical Testing & Forecasting
# ==============================================================================
d45_parts = [
    {
        "title": "Milestone 6 Econometric Governance Audit: The 4-Pillar Statistical Integrity Matrix",
        "say": [
            "Welcome to Day 45 of PinIT Career OS: Milestone 6 Capstone in our advanced Month 2 curriculum. Over the past five days, you have progressed across the entire landscape of quantitative enterprise intelligence: mastering the four mathematical moments and Tukey non-parametric outlier fences on Day 41; formulating hypothesis tests, Welch t-statistics, and ANOVA F-ratios on Day 42; establishing OLS regression lines and verifying the Gauss-Markov LINE assumptions on Day 43; and decomposing time-series seasonality to project Holt-Winters ETS forecasts on Day 44.",
            "Today, you synthesize these four distinct statistical disciplines into a single sovereign enterprise analytics platform: ApexAnalytics. In institutional data science, capital budgeting, and corporate FP&A, executive leadership and the board of directors must never make strategic decisions based on siloed, unverified statistical models. Every quantitative model deployed across the enterprise must pass a unified, rigorous governance audit.",
            "The foundation of Milestone 6 is the 4-Pillar Statistical Integrity Matrix: Pillar 1: Distribution Moment Stability (verifying that sample skewness |gamma_1| < 2.0 and that extreme outliers are isolated via Tukey IQR fences without distorting baseline metrics); Pillar 2: Inferential A/B Testing Rigor (verifying that experimental conversion lifts achieve Welch t-test statistical significance at p < 0.05 while controlling Family-Wise Error Rates via Bonferroni corrections); Pillar 3: OLS Econometric Validity (verifying that predictive regression models achieve R^2 >= 0.75 and strictly satisfy the LINE assumptions with Durbin-Watson statistics in [1.5, 2.5] and homoscedastic residuals); and Pillar 4: Seasonal Time-Series Forecast Accuracy (verifying that forward demand projections achieve MAPE < 10.0% and include 95% prediction interval cones).",
            "If an analytics pipeline fails even one of these four pillars, deploying it to production introduces massive operational risk. A regression model with non-normal residuals or extreme autocorrelation will generate wildly inaccurate revenue projections; an A/B test with uncorrected false discoveries will cause millions in wasted product development; and a demand forecast that ignores seasonality will trigger disastrous retail stockouts.",
            "In this opening module of Day 45, we construct our Milestone6StatisticalAuditor in pure Python. We ingest metrics from all four analytical pillars, evaluate compliance against institutional thresholds, calculate an overall readiness score, and verify milestone accreditation."
        ],
        "example": "Think of the pre-flight checklist of a commercial airliner: the pilots do not inspect just the engines or just the navigation instruments; they verify hydraulics, avionics, pressurization, and flight controls across all four critical flight systems before taking off.",
        "code": "d45_p1_code",
        "output": "d45_p1_out",
        "codeNotes": [
            {"line": 3, "note": "Initializes Milestone6StatisticalAuditor evaluating the 4-Pillar statistical governance matrix"},
            {"line": 13, "note": "Audits Pillar 1 (EDA Moments), Pillar 2 (A/B p-values), Pillar 3 (OLS R^2), and Pillar 4 (ETS MAPE)"},
            {"line": 21, "note": "Calculates composite readiness score (0-100%) and confirms universal accreditation"},
            {"line": 29, "note": "Executes audit across enterprise model parameters demonstrating 100% governance pass"}
        ],
        "tryIt": "Increase ETS MAPE from 4.2% to 14.5% and observe how the auditor drops readiness to 75% and revokes milestone accreditation.",
        "check": {
            "question": "What is the primary governance objective of the 4-Pillar Statistical Integrity Matrix in ApexAnalytics?",
            "options": [
                "To enforce comprehensive verification across distribution moments, A/B significance, OLS LINE assumptions, and ETS forecast accuracy before models inform executive decisions",
                "To automatically generate PowerPoint slides without human review",
                "To reduce the number of rows in the dataset to 100",
                "To replace all statistical formulas with random number generators"
            ],
            "answer": 0,
            "why": "The 4-Pillar matrix ensures that every quantitative model is vetted for distribution normality, inferential validity, econometric assumptions, and forecasting precision."
        }
    },
    {
        "title": "Production Multi-Arm A/B Experimentation Engine with FWER Control",
        "say": [
            "With our governance matrix established, we construct the first major operational subsystem of ApexAnalytics: the Multi-Arm A/B Experimentation Suite. In modern enterprise operations, marketing and growth teams conduct continuous experimentation across user acquisition funnels, dynamic checkout interfaces, and algorithmic recommendation models.",
            "When evaluating three or more treatment cohorts simultaneously (e.g., Control Baseline, Discount Incentive Variant, and Social Proof Messaging Variant), the platform must never execute naive pairwise t-tests that trigger Family-Wise Error Rate (FWER) explosion. Instead, ApexAnalytics executes an automated Single-Factor ANOVA (Analysis of Variance) omnibus test.",
            "The engine partitions Total Sum of Squares (SST) into Between-Group Variance (SSB) and Within-Group Variance (SSW), derives Mean Squares (MSB and MSW), and computes the global F-Ratio: F = MSB / MSW. If the F-ratio breaches the critical threshold (F > 3.5, p < 0.05), the engine confirms that a statistically significant treatment effect exists across the cohorts.",
            "Following an omnibus ANOVA rejection, ApexAnalytics automatically executes post-hoc pairwise comparisons governed by the Bonferroni inequality threshold: alpha_corrected = alpha_global / m, where m is the number of pairwise combinations. This prevents false discoveries and guarantees that any variant recommended for global rollout has been proven superior under mathematically conservative criteria.",
            "In this second module of Day 45, we implement our MultiVariantAbTestingSuite in pure Python. We ingest multi-cohort experimental observations, execute automated ANOVA partitioning, compute Bonferroni significance thresholds, and output audited experimentation scorecards."
        ],
        "example": "Think of a tournament judge in Olympic gymnastics: the judge does not arbitrarily declare a winner after watching two athletes; all competitors perform across all apparatuses, and strict scoring standards are applied across the entire cohort before awarding medals.",
        "code": "d45_p2_code",
        "output": "d45_p2_out",
        "codeNotes": [
            {"line": 3, "note": "Initializes MultiVariantAbTestingSuite executing omnibus ANOVA across marketing cohorts"},
            {"line": 15, "note": "Partitions total variance into Between-Group (SSB) and Within-Group (SSW) sum of squares"},
            {"line": 23, "note": "Computes ANOVA F-statistic and evaluates omnibus statistical significance"},
            {"line": 27, "note": "Derives strict Bonferroni significance threshold to prevent false positive discovery risks"}
        ],
        "tryIt": "Add a fourth cohort 'Variant_C' with conversion values around 13.0 and observe how the Bonferroni threshold automatically tightens to 0.0083.",
        "check": {
            "question": "Why does ApexAnalytics enforce an omnibus ANOVA test prior to conducting pairwise A/B cohort comparisons?",
            "options": [
                "To verify that overall variance between cohorts is statistically greater than random noise, protecting against false discoveries before pairwise testing",
                "To round all conversion rates to the nearest integer",
                "To convert web visitors into email subscribers automatically",
                "To ensure all cohorts have identical sample sizes"
            ],
            "answer": 0,
            "why": "An omnibus ANOVA confirms that real treatment variation exists across groups before pairwise tests are performed, preventing false positive discoveries."
        }
    },
    {
        "title": "Validated OLS Predictive Econometric Pipeline with LINE Residual Verification",
        "say": [
            "We now construct the second core analytical engine of ApexAnalytics: the Validated OLS Predictive Econometric Pipeline. In corporate strategic planning and capital budgeting, executives require validated predictive models that quantify the exact marginal return on investment (ROI) generated by capital expenditures.",
            "The ApexAnalytics econometric engine ingests multi-period corporate advertising spend and revenue data, executing closed-form Ordinary Least Squares regression to derive the structural forecasting line: Revenue = beta_0 + beta_1 * AdSpend. The slope beta_1 quantifies the marginal revenue generated for every incremental dollar invested in advertising.",
            "Crucially, the pipeline does not stop at computing R^2 and beta coefficients. The engine automatically runs an integrated LINE Assumption Diagnostic: 1. It computes residual errors e_i = y_i - y_hat_i; 2. It calculates the Durbin-Watson statistic to verify that residuals exhibit zero first-order autocorrelation (DW near 2.0); 3. It computes the homoscedasticity variance ratio across fitted ranges to ensure residuals do not fan out; and 4. It derives economic Demand Elasticity: Elasticity = beta_1 * (mean_x / mean_y), indicating whether demand is elastic (> 1.0) or inelastic (< 1.0).",
            "This automated econometric validation guarantees that when financial analysts present revenue projections to executive leadership, the model is mathematically defensible against adversarial interrogation by internal auditors or corporate board members.",
            "In this third module of Day 45, we construct our ValidatedOlsEconometricSuite in pure Python. We fit closed-form regression equations, verify high R^2 (> 0.90), calculate marginal ROI and elasticity, and confirm complete econometric validation."
        ],
        "example": "Think of a structural engineer designing a suspension bridge: calculating the steel cable thickness is only valid if the wind tunnel aerodynamics and soil foundation load-bearing tests confirm the structural assumptions.",
        "code": "d45_p3_code",
        "output": "d45_p3_out",
        "codeNotes": [
            {"line": 3, "note": "Initializes ValidatedOlsEconometricSuite fitting production regression equations"},
            {"line": 15, "note": "Computes closed-form OLS slope (marginal ROI) and intercept parameters"},
            {"line": 23, "note": "Calculates R^2 coefficient of determination and economic demand elasticity"},
            {"line": 31, "note": "Validates model parameters yielding an approved econometric forecast status"}
        ],
        "tryIt": "Increase ad spend values by 20% and observe how marginal ROI (slope) remains constant while revenue predictions scale accordingly.",
        "check": {
            "question": "What does a regression slope of beta_1 = 3.25 indicate in an enterprise advertising-to-revenue model?",
            "options": [
                "Every additional $1.00 invested in advertising generates $3.25 in incremental gross revenue",
                "Total company revenue increased by 3.25%",
                "Advertising spend is 3.25 times higher than net income",
                "The regression model has a 3.25% margin of error"
            ],
            "answer": 0,
            "why": "The slope parameter beta_1 represents the marginal rate of change: for every one-unit increase in the independent variable, the dependent variable increases by beta_1."
        }
    },
    {
        "title": "Executive Seasonal Time-Series Demand Forecasting with 95% Confidence Cones",
        "say": [
            "We now deploy the third core analytical engine of ApexAnalytics: the Executive Seasonal Time-Series Demand Forecasting Suite. In enterprise operations, predicting annual demand requires modeling both macroeconomic trend trajectories and quarterly seasonal surges.",
            "The ApexAnalytics forecasting suite ingests multi-year historical quarterly demand data, fits an additive Holt-Winters Exponential Triple Smoothing (ETS) architecture, and projects forward demand across all four quarters of the upcoming fiscal year. The engine applies seasonal factors to capture predictable operational surges (e.g., peak holiday demand in Q3 and Q4).",
            "To insulate corporate operations against supply chain shocks and factory disruptions, the engine automatically calculates 95% Prediction Interval Cones based on the root mean squared error of the forecast: Upper Bound_h = Forecast_h + 1.96 * RMSE * sqrt(h). Sizing component orders to the upper prediction cone creates an automated 6% to 8% Safety Stock Reserve, guaranteeing high cycle service levels and eliminating stockout risks during peak demand.",
            "The engine summarizes total annual projected demand, calculated buffer reserve units, and total authorized supply chain commitments into an executive scorecard tailored for C-suite operations reviews.",
            "In this fourth module of Day 45, we construct our ExecutiveTimeSeriesForecastSuite in pure Python. We project four-quarter forward demand, compute safety stock reserves, and generate comprehensive supply chain sizing recommendations."
        ],
        "example": "Think of an electrical power grid operator preparing for summer heatwaves: they do not generate only the average expected electricity; they spool up spinning reserve generators to meet the 95th percentile peak air-conditioning load, preventing city-wide blackouts.",
        "code": "d45_p4_code",
        "output": "d45_p4_out",
        "codeNotes": [
            {"line": 3, "note": "Initializes ExecutiveTimeSeriesForecastSuite executing 4-quarter seasonal demand projections"},
            {"line": 15, "note": "Applies Holt-Winters structural trend and quarterly seasonal factors to generate projections"},
            {"line": 23, "note": "Calculates annual demand target and sizing of 6% safety stock buffer reserves"},
            {"line": 31, "note": "Outputs executive supply chain commitment total for C-suite operational authorization"}
        ],
        "tryIt": "Increase the annual structural growth rate from 8% to 12% and observe how annual demand and safety stock expand proportionally.",
        "check": {
            "question": "Why does the ApexAnalytics forecasting suite establish safety stock reserves based on upper prediction intervals rather than baseline point forecasts?",
            "options": [
                "To guarantee high cycle service levels and protect against retail stockouts during unexpected demand surges",
                "To ensure warehouses are always 100% full",
                "Because Excel formulas cannot compute exact numbers",
                "To increase warehouse utility bills"
            ],
            "answer": 0,
            "why": "Point forecasts have a 50% probability of under-forecasting demand; sizing safety stock to the upper prediction interval provides robust buffer protection."
        }
    },
    {
        "title": "Master ApexAnalytics Platform: Full-Scale Econometric Synthesis & Cryptographic SOX 404 Credential",
        "say": [
            "We arrive at the grand culmination of Milestone 6: deploying the complete, unified Master ApexAnalytics Platform. In enterprise corporations governed by Sarbanes-Oxley (SOX 404) and global regulatory compliance frameworks, quantitative analytics engines must provide end-to-end auditability and mathematical transparency.",
            "The Master ApexAnalytics Platform synthesizes all four core subsystems into an institutional control tower: 1. Exploratory distribution moments and non-parametric outlier fences; 2. Multi-variant ANOVA experimentation with Bonferroni false discovery controls; 3. Validated OLS regression models with LINE residual compliance; and 4. Holt-Winters seasonal time-series forecasts with 95% confidence bounds.",
            "Upon completing the 4-Pillar governance audit, the platform packages all operational metrics—including sample skewness, ANOVA F-ratios, regression R^2, and annual demand targets—into an immutable canonical JSON payload. It then computes an immutable SHA-256 cryptographic governance digest: APEX-M6-SOX404-HASH.",
            "This cryptographic credential confers formal Milestone 6 Accreditation: Enterprise Statistical Intelligence & Econometric Engineering. If an internal audit committee, external regulator, or board member reviews company forecasts, the modeler presents the cryptographic token proving that every metric satisfied institutional mathematical hurdles before production deployment.",
            "In this final capstone module of Day 45, we execute our MasterApexAnalyticsPlatform, certifying full-scale econometric synthesis and issuing the immutable cryptographic Milestone 6 SOX 404 credential."
        ],
        "example": "Think of the graduation diploma and official sealed transcript issued by a premier university: it represents the cumulative synthesis of years of coursework, laboratory experiments, and examinations, stamped with an official raised seal that guarantees authenticity to employers worldwide.",
        "code": "d45_p5_code",
        "output": "d45_p5_out",
        "codeNotes": [
            {"line": 5, "note": "Defines MasterApexAnalyticsPlatform orchestrating full-scale Milestone 6 econometric synthesis"},
            {"line": 15, "note": "Synthesizes metrics across EDA, ANOVA experimentation, OLS regression, and ETS forecasting"},
            {"line": 28, "note": "Serializes master payload to canonical JSON and generates SHA-256 cryptographic credential"},
            {"line": 40, "note": "Executes platform issuing the official APEX-M6-SOX404 cryptographic accreditation certificate"}
        ],
        "tryIt": "Alter any input metric in the platform and observe how the cryptographic digest changes completely, demonstrating tamper-proof mathematical sealing.",
        "check": {
            "question": "What does the APEX-M6-SOX404 cryptographic certificate signify in the ApexAnalytics enterprise platform?",
            "options": [
                "An immutable mathematical verification proving that distribution moments, ANOVA inference, OLS regression, and ETS forecasts passed all 4 governance pillars",
                "A discount voucher for future cloud database hosting",
                "A digital watermark that makes the spreadsheet print in color",
                "A temporary license that expires after 30 days"
            ],
            "answer": 0,
            "why": "The cryptographic certificate provides an unalterable digital seal proving that the complete econometric analytics pipeline satisfied all institutional governance requirements."
        }
    }
]

# Write out the complete make_month2_days43_44_45.py
out_file = "scripts/make_month2_days43_44_45.py"

tail_code = '''
day43_lesson = {
    "day": 43,
    "title": "Bivariate Correlation & Ordinary Least Squares (OLS) Linear Regression: R², Residual Plots & P-Values",
    "goal": "Master Bivariate Correlation and Ordinary Least Squares (OLS) Linear Regression in Excel: computing Pearson r via CORREL(), deriving closed-form OLS slope and intercept, decomposing variance into SST = SSR + SSE, calculating R², verifying the Gauss-Markov LINE assumptions, and deploying an auditable cryptographic econometric gateway.",
    "summary": [
        "Pearson Correlation & Covariance: Deriving sample covariance, computing scale-invariant Pearson r bounded in [-1, +1], and testing correlation significance via Student's t-test.",
        "OLS Linear Regression Formulation: Minimizing Sum of Squared Residuals (SSE) to compute optimal slope beta_1 and intercept beta_0 passing through centroid (mu_x, mu_y).",
        "Variance Decomposition & R-Squared: Partitioning Total Sum of Squares (SST = SSR + SSE) to calculate the coefficient of determination (R^2 = SSR / SST = r^2).",
        "The LINE Assumptions & Residual Diagnostics: Validating Linearity, Independence (Durbin-Watson statistic near 2.0), Normality, and Equal Variance (Homoscedasticity) to avoid Anscombe's Quartet traps.",
        "Production Econometric Gateway: Deriving standard errors of coefficients, slope t-statistics, model-level ANOVA F-ratios, and issuing cryptographic SHA-256 SOX 404 governance certificates."
    ],
    "projectStep": {
        "title": "Build Automated OLS Econometric & Residual Diagnostic Platform",
        "steps": [
            "Calculate sample covariance and Pearson correlation coefficient with t-statistic significance testing.",
            "Fit a closed-form OLS linear regression model, decompose sum of squares, and compute R-squared.",
            "Execute automated residual diagnostics evaluating Durbin-Watson autocorrelation and homoscedasticity ratios.",
            "Construct a regression ANOVA summary table and generate an audited cryptographic SHA-256 SOX 404 econometric certificate."
        ]
    },
    "parts": d43_parts
}

day44_lesson = {
    "day": 44,
    "title": "Time-Series Forecasting & Exponential Smoothing: Seasonality Decomposition & Trend Projections (FORECAST.ETS)",
    "goal": "Master modern Time-Series Forecasting in Excel: performing classical additive and multiplicative decomposition, implementing Holt-Winters Exponential Triple Smoothing (ETS) with level, trend, and seasonal parameters, evaluating MAE, RMSE, and MAPE error metrics, constructing 95% prediction interval cones, and deploying an automated procurement gateway.",
    "summary": [
        "Classical Time-Series Decomposition: Partitioning chronological data into Trend-Cycle (T_t), Seasonality (S_t), and Irregular noise (I_t) using centered moving averages.",
        "Holt-Winters ETS Architecture: Formulating iterative state updates for Level (alpha), Trend (beta), and Seasonality (gamma) to model dynamic growth and calendar cycles.",
        "Modern FORECAST.ETS Integration: Utilizing native Excel algorithms for automated seasonality detection, parameter optimization, and multi-horizon forward projections.",
        "Forecast Accuracy Profiling: Auditing MAE, RMSE, scale-independent MAPE (< 10% benchmark), and Tracking Signals to eliminate directional forecasting bias.",
        "Prediction Cones & Safety Stock: Generating 95% confidence prediction cones and calculating dynamic safety stock buffer reserves to eliminate stockout risks."
    ],
    "projectStep": {
        "title": "Build Production Time-Series ETS Forecasting Engine",
        "steps": [
            "Execute classical additive time-series decomposition to extract moving average trends and periodic seasonal indices.",
            "Implement Holt-Winters Exponential Triple Smoothing equations to project forward multi-quarter demand.",
            "Calculate forecast accuracy error metrics (MAE, RMSE, MAPE) and monitor tracking signals for structural bias.",
            "Generate 95% prediction interval cones and compile an audited cryptographic SHA-256 supply chain procurement certificate."
        ]
    },
    "parts": d44_parts
}

day45_lesson = {
    "day": 45,
    "title": "⭐ Milestone 6: ApexAnalytics Statistical Testing & Time-Series Forecasting Engine Suite",
    "goal": "Assemble the complete ApexAnalytics enterprise statistical intelligence suite: auditing the 4-Pillar Statistical Integrity Matrix, executing multi-arm A/B tests with ANOVA and Bonferroni controls, fitting validated OLS predictive regressions with LINE residual verification, projecting 12-month seasonal ETS demand with 95% confidence cones, and issuing the cryptographic Milestone 6 SOX 404 credential.",
    "summary": [
        "4-Pillar Statistical Governance: Validating distribution moments, inferential A/B significance, OLS LINE assumptions, and ETS forecast accuracy against institutional thresholds.",
        "Multi-Arm Experimentation Engine: Executing Single-Factor ANOVA F-tests and Bonferroni post-hoc adjustments to eliminate false discovery rate inflation in growth experiments.",
        "Validated OLS Econometric Suite: Fitting production regression models, verifying residual homoscedasticity and independence, and computing marginal ROI and demand elasticity.",
        "Executive Seasonal Time-Series Engine: Projecting 4-quarter forward demand with Holt-Winters seasonal factors and sizing dynamic 6% safety stock buffer reserves.",
        "Master ApexAnalytics Platform: Unifying all analytical disciplines into an executive dashboard and issuing the immutable cryptographic SHA-256 APEX-M6-SOX404 accreditation credential."
    ],
    "projectStep": {
        "title": "Deploy ApexAnalytics Statistical Intelligence & Forecasting Platform",
        "steps": [
            "Audit empirical datasets across the 4-Pillar Statistical Integrity Matrix to confirm governance readiness.",
            "Run automated multi-variant A/B experimentation with Single-Factor ANOVA and Bonferroni significance controls.",
            "Fit a validated OLS econometric model, verify LINE residual assumptions, and compute marginal ROI metrics.",
            "Generate 4-quarter seasonal ETS demand forecasts with 95% confidence cones and issue the cryptographic APEX-M6-SOX404 certificate."
        ]
    },
    "parts": d45_parts
}

if __name__ == "__main__":
    for day_obj in [day43_lesson, day44_lesson, day45_lesson]:
        day_num = day_obj["day"]
        print(f"\\n=======================================================")
        print(f"AUDITING DAY {day_num}: {day_obj['title']}")
        print(f"=======================================================")
        total_day_words = 0
        for idx, part in enumerate(day_obj["parts"]):
            p_num = idx + 1
            say_words = sum(len(p.split()) for p in part["say"])
            ex_words = len(part["example"].split())
            try_words = len(part["tryIt"].split())
            why_words = len(part["check"]["why"].split())
            part_total = say_words + ex_words + try_words + why_words
            total_day_words += part_total
            print(f"  Part {p_num} ('{part['title'][:35]}...'): {part_total} words (say={say_words}, ex={ex_words}) [{'PASS' if part_total >= 580 else 'FAIL'}]")
            assert part_total >= 580, f"Day {day_num} Part {p_num} failed word count threshold! ({part_total} < 580)"
            assert "class " in part["code"], f"Day {day_num} Part {p_num} missing 'class ' definition!"
            assert len(part["codeNotes"]) >= 3, f"Day {day_num} Part {p_num} codeNotes < 3!"
            assert len(part["check"]["options"]) == 4, f"Day {day_num} Part {p_num} check options != 4!"
            assert part["check"]["answer"] in [0, 1, 2, 3], f"Day {day_num} Part {p_num} invalid answer index!"
            assert len(part["check"]["why"]) >= 15, f"Day {day_num} Part {p_num} check why < 15 chars!"

        spoken_min = total_day_words / 120.0
        print(f"  TOTAL DAY {day_num} WORDS: {total_day_words} (~{spoken_min:.1f} spoken minutes @ 120wpm)")
        assert spoken_min >= 20.0, f"Day {day_num} spoken minutes < 20.0!"
        print(f"[OK] DAY {day_num} ALL INVARIANTS PERFECTLY PASSED!")
'''

# In d43_parts, d44_parts, d45_parts, we referenced code as string literals 'd43_p1_code', etc.
# We need to map them back to variable identifiers!
parts_json_43 = json.dumps(d43_parts, indent=4)
parts_json_44 = json.dumps(d44_parts, indent=4)
parts_json_45 = json.dumps(d45_parts, indent=4)

# Replace quoted code and output with variable references
for d in [43, 44, 45]:
    for p in range(1, 6):
        c_var = f"d{d}_p{p}_code"
        o_var = f"d{d}_p{p}_out"
        parts_json_43 = parts_json_43.replace(f'"{c_var}"', c_var).replace(f'"{o_var}"', o_var)
        parts_json_44 = parts_json_44.replace(f'"{c_var}"', c_var).replace(f'"{o_var}"', o_var)
        parts_json_45 = parts_json_45.replace(f'"{c_var}"', c_var).replace(f'"{o_var}"', o_var)

final_py = f"""{base_code}

d43_parts = {parts_json_43}
d44_parts = {parts_json_44}
d45_parts = {parts_json_45}

{tail_code}
"""

with open(out_file, "w", encoding="utf-8") as f:
    f.write(final_py)

print("make_month2_days43_44_45.py generated successfully!")
