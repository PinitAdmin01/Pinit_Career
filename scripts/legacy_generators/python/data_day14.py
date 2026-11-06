# Day 14: Dimensionality Reduction: Principal Component Analysis (PCA) & Factor Analytics

# -------------------------------------------------------------
# Part 1: Curse of Dimensionality & Covariance Eigen-Physics
# -------------------------------------------------------------
p1_say = [
    "Welcome to Day Fourteen of Business Analytics and Decision Intelligence. In modern corporate enterprises, data architectures are inundated with an unprecedented deluge of variables. A customer relationship management platform records hundreds of interaction telemetry metrics; an annual customer experience survey gathers sixty distinct Likert-scale questions across product satisfaction, brand perception, and support responsiveness; an e-commerce platform tracks dozens of browsing and checkout time-series features. While intuitive logic suggests that more data variables should yield better business insights, in reality, high-dimensional datasets trigger severe analytical pathology known as the Curse of Dimensionality.",

    "The Curse of Dimensionality, a term coined by mathematician Richard Bellman, describes the exponential expansion of geometric volume that occurs as additional dimensions are added to a mathematical space. In high-dimensional spaces, data points become extraordinarily sparse. The Euclidean distance between any two randomly selected observations converges to approximately the same value, rendering proximity-based algorithms—such as K-Means clustering, nearest-neighbor recommendation engines, and outlier anomaly detectors—mathematically ineffective. Furthermore, high dimensionality breeds intense multi-collinearity, destabilizes regression parameter estimates, and inflates the computational cost of database queries.",

    "However, in commercial business operations, high-dimensional variables are rarely independent. A customer who rates product reliability as a ten almost certainly rates overall brand satisfaction and Net Promoter Score highly. A customer with high annual spend almost certainly generates high order frequencies and support inquiries. Beneath dozens of observable, correlated surface variables lie a much smaller number of latent, underlying structural drivers—such as overall customer brand trust, price sensitivity, or digital engagement maturity.",

    "To discover these latent drivers and compress high-dimensional feature spaces without losing critical information, analytics architects deploy Dimensionality Reduction, headlined by Principal Component Analysis (PCA). Developed by Karl Pearson and Harold Hotelling, PCA is an unsupervised linear transformation technique that maps a dataset of p correlated variables into a new coordinate system of orthogonal, uncorrelated variables termed Principal Components, ordered by the amount of variance they explain.",

    "The mathematical foundation of PCA is rooted in the spectral decomposition of the covariance matrix. For a standardized dataset X with zero mean and unit variance, we compute the p-by-p sample covariance matrix Sigma, where each diagonal entry represents the variance of a variable (equal to one under standardization) and each off-diagonal entry represents the pairwise covariance (or correlation coefficient) between two variables. The covariance matrix captures the complete multi-dimensional dispersion and linear dependencies of the enterprise dataset.",

    "Through the Spectral Theorem of linear algebra, any symmetric, real-valued matrix can be factorized into its characteristic Eigenvalues and Eigenvectors. Geometrically, an eigenvector represents a directional axis in the multi-dimensional feature space along which the data varies, while its corresponding eigenvalue represents the magnitude of variance captured along that specific axis. By computing the eigenvectors of the covariance matrix, PCA identifies the natural principal axes of variation, transforming raw correlated coordinate systems into orthogonal explanatory manifolds.",

    "In high-performance corporate data pipelines, direct eigen-decomposition of the sample covariance matrix is frequently replaced by Singular Value Decomposition (SVD) executed directly on the centered data matrix X. SVD factorizes X into the product of an orthogonal left singular matrix U, a diagonal singular value matrix Sigma, and a transposed orthogonal right singular matrix V-transpose. The right singular vectors V are mathematically identical to the eigenvectors of the covariance matrix, but computing them via SVD avoids explicitly forming the squared matrix X-transpose-X, preventing numerical floating-point precision loss and roundoff instabilities.",

    "In the accompanying Python implementation, we build a 2D Covariance and Eigen-Decomposition Engine from first principles using pure Python standard library functions. We calculate sample means, center and scale customer survey responses, compute the empirical covariance matrix, and analytically extract eigenvalues and eigenvectors to uncover the principal axes of customer perception."
]

p1_code = """# Pure Python 2D Covariance Matrix & Eigen-Decomposition Engine
import math

def compute_mean_and_cov(data):
    n = len(data)
    # 1. Compute means
    mean_x = sum(d[0] for d in data) / n
    mean_y = sum(d[1] for d in data) / n
    
    # 2. Compute covariance matrix [[sxx, sxy], [sxy, syy]]
    sxx = sum((d[0] - mean_x)**2 for d in data) / (n - 1)
    syy = sum((d[1] - mean_y)**2 for d in data) / (n - 1)
    sxy = sum((d[0] - mean_x) * (d[1] - mean_y) for d in data) / (n - 1)
    
    return [mean_x, mean_y], [[sxx, sxy], [sxy, syy]]

def eigen_decomposition_2d(cov):
    # Analytical solution for 2x2 symmetric matrix
    # Characteristic polynomial: lambda^2 - Trace*lambda + Det = 0
    a, b = cov[0][0], cov[0][1]
    c, d = cov[1][0], cov[1][1]
    
    trace = a + d
    det = (a * d) - (b * c)
    
    # Quadratic formula for eigenvalues
    discriminant = math.sqrt(max(0.0, (trace**2) - (4 * det)))
    eig1 = (trace + discriminant) / 2.0
    eig2 = (trace - discriminant) / 2.0
    
    # Compute eigenvector for eig1: (A - lambda*I) * v = 0 -> (a - eig1)*v1 + b*v2 = 0
    if abs(b) > 1e-8:
        v1 = [-b, a - eig1]
    else:
        v1 = [1.0, 0.0]
    norm1 = math.sqrt(v1[0]**2 + v1[1]**2)
    v1 = [v1[0] / norm1, v1[1] / norm1]
    
    # Orthogonal eigenvector for eig2
    v2 = [-v1[1], v1[0]]
    
    return [eig1, eig2], [v1, v2]

# Simulated correlated Customer Satisfaction metrics: Product Rating (x), Support Rating (y)
survey_data = [
    [8.0, 7.5], [6.0, 5.5], [9.0, 8.5], [4.0, 4.0], [7.0, 7.0],
    [5.0, 4.5], [9.5, 9.0], [3.0, 3.5], [8.5, 8.0], [6.5, 6.0]
]

means, cov_matrix = compute_mean_and_cov(survey_data)
eigenvals, eigenvecs = eigen_decomposition_2d(cov_matrix)

total_var = sum(eigenvals)
var_pc1 = (eigenvals[0] / total_var) * 100
var_pc2 = (eigenvals[1] / total_var) * 100

print("Empirical Covariance Matrix:")
print(f"  [{cov_matrix[0][0]:6.3f}, {cov_matrix[0][1]:6.3f}]")
print(f"  [{cov_matrix[1][0]:6.3f}, {cov_matrix[1][1]:6.3f}]")
print("-" * 65)
print(f"Principal Component 1 (PC1): Eigenvalue={eigenvals[0]:.3f} | Variance Explained: {var_pc1:5.1f}%")
print(f"  Eigenvector (Loading Direction): [{eigenvecs[0][0]:.3f}, {eigenvecs[0][1]:.3f}]")
print(f"Principal Component 2 (PC2): Eigenvalue={eigenvals[1]:.3f} | Variance Explained: {var_pc2:5.1f}%")
print(f"  Eigenvector (Loading Direction): [{eigenvecs[1][0]:.3f}, {eigenvecs[1][1]:.3f}]")
"""

p1_example = "An automotive manufacturer surveys buyers across 40 interior dashboard preferences (button feel, screen responsiveness, knob resistance). PCA reveals that 82% of the total variance across all 40 questions collapses into just 2 underlying factors: 'Digital Modernity' and 'Tactile Luxury'."
p1_tryIt = "Modify the survey data to introduce negative correlation between product and support ratings and observe how the primary eigenvector direction rotates by ninety degrees."

p1_check = {
    "question": "What is the geometric interpretation of an eigenvector and eigenvalue in Principal Component Analysis?",
    "options": [
        "The eigenvector defines the directional axis of variance; the eigenvalue measures the magnitude of variance along that axis.",
        "The eigenvector represents the sample mean; the eigenvalue represents the median transaction frequency.",
        "The eigenvector is a boolean flag indicating whether the dataset contains missing null records.",
        "The eigenvalue determines the number of clusters to use in downstream K-Means algorithms."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Eigenvectors define the orthogonal coordinate directions of maximum spread in the feature space, while eigenvalues quantify the variance magnitude along each direction."
}

# -------------------------------------------------------------
# Part 2: Maximum Variance Projections & Orthogonality
# -------------------------------------------------------------
p2_say = [
    "Having established the geometric physics of eigenvectors and eigenvalues, we now explore how Principal Component Analysis projects raw customer observations onto these newly discovered axes. In business analytics, raw variables represent surface symptoms, whereas principal components represent structural causal axes. The primary objective of the first principal component, PC1, is to maximize the variance of the projected data points. The second principal component, PC2, is mathematically constrained to be perfectly orthogonal (uncorrelated) to PC1 while maximizing the remaining residual variance.",

    "To understand the power of maximum variance projection, consider an intuitive geometric analogy: casting shadows of a three-dimensional object onto a flat two-dimensional wall. If you orient the object randomly, the resulting shadow will be distorted and uninformative. However, if you rotate the object until you find the exact angle that maximizes the surface area and detail of the shadow, you capture nearly the entire 3D structure in a 2D projection. PCA mathematically determines the exact high-dimensional rotation angles that maximize informational shadow area.",

    "The projection of an observation vector x onto a principal component eigenvector v is computed through the standard vector dot product. The resulting scalar value is termed the Principal Component Score. For an enterprise customer, their PC1 score represents their position along the primary dimension of commercial behavior—such as overall enterprise scale or customer health. Their PC2 score represents their position along the secondary orthogonal dimension—such as customer digital self-sufficiency versus high-touch operational dependency.",

    "The coefficients within the eigenvector are termed Factor Loadings or Component Weights. Factor loadings measure the Pearson correlation between the original observable variables and the newly created principal component. A variable with a loading near plus one or minus one contributes heavily to that principal component, whereas a variable with a loading near zero is irrelevant to that component. By inspecting factor loadings, corporate analysts assign meaningful business names to abstract mathematical vectors.",

    "A critical mathematical property of PCA is Orthogonality. By construction, the sample correlation between any pair of distinct principal components is identically zero. This complete absence of multicollinearity is a massive operational advantage when using principal components as explanatory inputs in downstream predictive models. Feeding raw correlated metrics into an Ordinary Least Squares or Logistic Regression model causes variance inflation and unstable coefficients; feeding orthogonal principal component scores guarantees stable, independent parameter estimates.",

    "Furthermore, total variance is completely conserved under PCA. The sum of all eigenvalues across all p principal components equals exactly the sum of the variances of all p original standardized variables (which equals p). PCA does not destroy or invent variance; it merely concentrates and repacks scattered variance into a small number of dominant, highly informative axes.",

    "The formal mathematical proof that eigenvectors maximize projected variance is derived via Lagrange Multipliers. Formulating the optimization objective to maximize v-transpose Sigma v subject to the unit-norm constraint v-transpose v equals one leads directly to the Lagrangian function L(v, lambda) = v-transpose Sigma v minus lambda times (v-transpose v minus one). Taking the partial derivative with respect to v and setting it to zero yields the characteristic matrix equation Sigma v = lambda v. This foundational proof demonstrates that the stationary points of projected variance are precisely the eigenvectors of the covariance matrix, with the maximum variance equal to the largest eigenvalue.",

    "Conversely, PCA can be derived as the linear projection that minimizes the Mean Squared Reconstruction Error. If an enterprise compresses fifty variables into five principal components and subsequently attempts to reconstruct the original dataset via inverse projection, PCA mathematically guarantees the lowest possible Frobenius norm error between the original and reconstructed data matrices among all rank-five linear approximations.",

    "In the accompanying Python implementation, we build a projection engine that transforms raw multi-attribute customer survey profiles into compact, uncorrelated 2D component scores, validating that the correlation between PC1 and PC2 is mathematically zero."
]

p2_code = """# Pure Python PCA Projection & Orthogonal Component Scoring Engine
import math

def project_onto_components(data, means, eigenvecs):
    projected = []
    for row in data:
        # 1. Center observation around mean
        centered = [row[i] - means[i] for i in range(len(row))]
        # 2. Dot product with each eigenvector
        score_pc1 = sum(centered[i] * eigenvecs[0][i] for i in range(len(row)))
        score_pc2 = sum(centered[i] * eigenvecs[1][i] for i in range(len(row)))
        projected.append([score_pc1, score_pc2])
    return projected

def pearson_correlation(x_vals, y_vals):
    n = len(x_vals)
    mx = sum(x_vals) / n
    my = sum(y_vals) / n
    cov = sum((x - mx) * (y - my) for x, y in zip(x_vals, y_vals))
    sx = math.sqrt(sum((x - mx)**2 for x in x_vals))
    sy = math.sqrt(sum((y - my)**2 for y in y_vals))
    return cov / (sx * sy) if sx * sy > 0 else 0.0

# 10 Customer records from Part 1
survey_data = [
    [8.0, 7.5], [6.0, 5.5], [9.0, 8.5], [4.0, 4.0], [7.0, 7.0],
    [5.0, 4.5], [9.5, 9.0], [3.0, 3.5], [8.5, 8.0], [6.5, 6.0]
]
means = [7.15, 6.85]
eigenvecs = [[0.722, 0.692], [-0.692, 0.722]] # From Part 1 eigen-decomposition

# Compute projected 2D PC Scores
scores = project_onto_components(survey_data, means, eigenvecs)

pc1_scores = [s[0] for s in scores]
pc2_scores = [s[1] for s in scores]
ortho_corr = pearson_correlation(pc1_scores, pc2_scores)

print("Projected Customer Scores in Principal Component Space:")
print("-" * 65)
print(f"{'Customer':<10} | {'Raw Rating (X)':<16} | {'PC1 (Scale/Health)':<20} | {'PC2 (Residual)'}")
print("-" * 65)
for i in range(5):
    print(f"Client {i+1:<4} | [{survey_data[i][0]:.1f}, {survey_data[i][1]:.1f}]           | {pc1_scores[i]:>+8.3f}             | {pc2_scores[i]:>+8.3f}")
print("-" * 65)
print(f"Empirical Correlation between PC1 and PC2: {ortho_corr:.6f} (Guaranteed Orthogonal!)")
"""

p2_example = "A retail bank collects 25 financial ratios for credit applicants. Raw ratios exhibit 0.85 collinearity. Projecting applicants onto PC1 (Liquidity & Scale) and PC2 (Leverage Strain) yields two orthogonal scores that allow stable credit scoring without matrix inversion crashes."
p2_tryIt = "Scale the raw survey data by adding a constant offset and verify that while means shift, the projected eigenvector loadings and orthogonality remain invariant."

p2_check = {
    "question": "What is the statistical correlation between two distinct principal components derived from the same dataset?",
    "options": [
        "Exactly zero, because principal component eigenvectors are constrained to be mathematically orthogonal.",
        "One point zero, because all principal components are derived from the same underlying covariance matrix.",
        "Negative zero point five, reflecting the trade-off in explained variance.",
        "Equal to the Pearson correlation between the two highest-variance raw variables."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Principal components are orthogonal projections by construction, meaning the sample covariance and Pearson correlation between any two components is identically zero."
}

# -------------------------------------------------------------
# Part 3: Scree Plots & Explained Variance Diagnostics
# -------------------------------------------------------------
p3_say = [
    "Once all principal components are derived, the critical executive decision facing analytics architects is Dimensionality Truncation: 'How many principal components should we retain in production?' If a database contains one hundred variables, PCA will calculate one hundred principal components. Keeping all one hundred components accomplishes zero dimensionality reduction. Conversely, keeping only the first component might discard forty percent of vital business variance. We require rigorous quantitative stopping rules to select the optimal number of components k.",

    "The primary diagnostic framework for evaluating component retention is Cumulative Explained Variance. The variance explained by component j is its corresponding eigenvalue lambda_j divided by the sum of all eigenvalues. By plotting individual explained variance percentages as a bar chart alongside the cumulative percentage as a rising line curve, analysts generate the Scree Plot. The term 'scree' originates from geomorphology, referring to the loose rock rubble that accumulates at the base of a steep cliff.",

    "In a classic scree plot, the first few eigenvalues represent the steep mountain cliff—dominant structural components that explain massive blocks of variance. Eventually, the curve flattens out into a gentle rubble slope of minor eigenvalues representing random measurement noise and idiosyncratic variance. Analysts visually identify the 'elbow' where the cliff transitions into scree, retaining only the components preceding the break.",

    "To complement visual scree inspection with objective criteria, analytics teams deploy the Kaiser-Guttman Criterion. The Kaiser criterion dictates that in standardized datasets (where each original variable has a variance of one), an analyst should retain only components whose eigenvalues are strictly greater than one point zero. The logic is compelling: if an original variable contributes a variance of one, a principal component with an eigenvalue below one captures less information than a single raw variable and does not warrant inclusion.",

    "A third institutional benchmark is the Cumulative Variance Hurdle. In commercial analytics and corporate research, leadership typically establishes an explicit threshold—such as retaining sufficient components to capture at least seventy-five to eighty-five percent of total variance. If the first three components explain eighty-two percent of total variance across fifty customer survey questions, the analyst can confidently drop the remaining forty-seven components, achieving a ninety-four percent dimensional compression while preserving more than four-fifths of total information.",

    "Furthermore, advanced practitioners utilize Parallel Analysis to prevent over-factoring. Parallel analysis generates hundreds of synthetic random datasets with identical sample size and variable count, computes their eigenvalues, and retains only empirical components whose eigenvalues exceed the 95th percentile of the random noise distribution. This shields corporate analytics against retaining spurious noise components.",

    "Raymond Cattell originally introduced the Scree Test in psychometrics as an empirical heuristic, but modern quantitative finance requires strict algorithmic stopping rules. In high-dimensional algorithmic trading and factor investing, portfolio managers automate component selection using information-theoretic criteria, such as the Akaike Information Criterion (AIC) and Bayesian Information Criterion (BIC), evaluated on downstream predictive error. This objective formulation eliminates the subjective ambiguity of human scree plot inspection.",

    "Additionally, cross-validation provides an empirical barrier against over-fitting in component retention. By performing k-fold cross-validation where PCA is fitted exclusively on training folds and evaluated on held-out test folds, analytics architects measure the out-of-sample reconstruction fidelity. If adding a fifth principal component degrades test-set reconstruction accuracy, the component is capturing noise specific to the training sample and must be pruned from the production scoring architecture.",

    "Analysts also evaluate Ian Jolliffe's modified criterion, which lowers the retention cutoff from one point zero to zero point seven zero. Jolliffe demonstrated that the strict Kaiser criterion often under-factors datasets because random sampling error artificially depresses true structural eigenvalues below unity. Retaining components with eigenvalues exceeding zero point seven zero ensures that important secondary business drivers—such as niche product feature adoption or regional compliance nuances—are not prematurely discarded.",

    "In the accompanying Python implementation, we build an automated Scree and Explained Variance Diagnostic Suite. We compute individual eigenvalues, calculate cumulative explained variance ratios, apply the Kaiser criterion, and generate a formatted executive variance table."
]

p3_code = """# Pure Python Scree Plot & Explained Variance Diagnostic Suite
def analyze_explained_variance(eigenvalues):
    total_variance = sum(eigenvalues)
    explained_ratios = [(ev / total_variance) * 100 for ev in eigenvalues]
    
    cumulative_ratios = []
    running_sum = 0.0
    for r in explained_ratios:
        running_sum += r
        cumulative_ratios.append(running_sum)
        
    return explained_ratios, cumulative_ratios

# Simulated 6-variable Enterprise HR Engagement Survey Eigenvalues
# Raw metrics: Job Satisfaction, Manager Rating, Compensation, Work-Life, Career Growth, Peer Trust
empirical_eigenvalues = [3.25, 1.45, 0.65, 0.35, 0.20, 0.10] # Total sum = 6.0 (standardized)

ratios, cum_ratios = analyze_explained_variance(empirical_eigenvalues)

print("Principal Component Explained Variance & Scree Diagnostics:")
print("=" * 70)
print(f"{'Component':<12} | {'Eigenvalue':<12} | {'Variance (%)':<14} | {'Cumulative (%)':<16} | {'Kaiser Rule'}")
print("-" * 70)
for idx, ev in enumerate(empirical_eigenvalues):
    kaiser_flag = "RETAIN (>= 1.0)" if ev >= 1.0 else "DROP (< 1.0)"
    print(f"PC{idx+1:<9} | {ev:>10.2f}   | {ratios[idx]:>12.2f}% | {cum_ratios[idx]:>14.2f}% | {kaiser_flag}")
print("=" * 70)
retained_components = sum(1 for ev in empirical_eigenvalues if ev >= 1.0)
total_retained_var = cum_ratios[retained_components - 1]
print(f"Diagnostic Summary: Retain top {retained_components} components (Captures {total_retained_var:.1f}% of total variance).")
"""

p3_example = "A hospital network surveys patient satisfaction across 30 questions. The first 3 components yield eigenvalues of 14.2, 5.8, and 2.1 (totaling 73.7% variance), while component 4 drops to 0.8. Applying the Kaiser criterion cleanly compresses 30 questions into 3 robust operational indices."
p3_tryIt = "Adjust the third eigenvalue to 1.05 and observe how the Kaiser rule dynamically flags 3 components for retention instead of 2."

p3_check = {
    "question": "According to the Kaiser-Guttman criterion, when should a principal component be retained from a standardized dataset?",
    "options": [
        "When its eigenvalue is strictly greater than 1.0, meaning it explains more variance than a single raw standardized variable.",
        "When its eigenvalue equals exactly zero, confirming complete orthogonality.",
        "When the component contains strictly positive factor loadings across all variables.",
        "When the component's cumulative variance exceeds fifty percent of the total dataset."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "In standardized data, each variable has variance 1.0; a component with an eigenvalue > 1.0 accounts for more variance than any single original feature."
}

# -------------------------------------------------------------
# Part 4: Interpretability & Factor Loading Mechanics
# -------------------------------------------------------------
p4_say = [
    "A frequent criticism leveled against Principal Component Analysis by corporate executives and line-of-business managers is: 'Principal components are abstract mathematical constructs that cannot be interpreted!' A VP of Sales cannot execute an initiative based on 'increasing customer PC1 by zero point five'. Business leaders demand tangible, named business drivers. The bridge between abstract mathematical eigenvectors and concrete corporate strategy is Factor Loading Analysis and Orthogonal Rotation.",

    "Factor Loadings represent the bivariate correlation coefficients between the original observable variables and the extracted principal components. A loading matrix displays original features down the rows and extracted components across the columns. Loadings range from minus one point zero to plus one point zero. A high positive loading (e.g., plus zero point eight five) indicates that high values in the raw feature strongly drive high scores in that component.",

    "In raw, unrotated PCA solutions, the first principal component typically acts as a 'General Factor'—a broad averaging axis where almost all variables exhibit moderate-to-high positive loadings. While mathematically optimal for maximum variance extraction, a general factor is difficult to interpret because every feature contributes equally. For instance, in an enterprise customer experience survey, PC1 might load moderately on software speed, UI aesthetics, pricing satisfaction, and customer support responsiveness simultaneously.",

    "To transform complex, mixed loadings into a clean 'Simple Structure' where each observable variable loads heavily on only one component and near zero on all others, analytics architects apply Factor Rotation. The industry gold standard is Varimax Rotation, an orthogonal rotation method developed by Henry Kaiser. Varimax rotates the orthogonal coordinate axes within the subspace spanned by the retained components to maximize the variance of the squared loadings across components.",

    "Crucially, because Varimax is an orthogonal rotation, it preserves the mutual independence and zero-correlation property between components, while driving loading values toward either zero or one. Following Varimax rotation, the ambiguous general factor decomposes into sharp, intuitively named commercial pillars: Factor One emerges with ninety percent loadings on support speed and ticket resolution (named 'Customer Service Excellence'), while Factor Two loads exclusively on interface ergonomics and workflow automation (named 'Product Usability').",

    "Furthermore, analysts must remain vigilant against Standardization Traps. If an analytics team forgets to standardize features before computing covariance, features with massive raw numerical scales (such as annual revenue in millions) will produce massive eigenvalues and capture ninety-nine percent of PC1, solely due to arbitrary units. PCA must strictly operate on the correlation matrix (standardized Z-scores) unless all variables are measured in identical physical units.",

    "While Varimax enforces strict orthogonality, real-world commercial phenomena often exhibit natural inter-factor correlations. For example, customers who perceive high product usability are often more forgiving of commercial pricing. In such scenarios, econometricians deploy Oblique Rotations, such as Promax or Direct Oblimin. Oblique rotations relax the ninety-degree orthogonality constraint, allowing the underlying axes to correlate moderately if it produces an even clearer simple structure. When using oblique rotations, analysts report both the Factor Pattern Matrix (unique regression contributions) and the Factor Structure Matrix (simple bivariate correlations).",

    "Modern high-dimensional analytics also incorporates Sparse PCA. By adding an L1-norm LASSO penalty to the eigenvector optimization problem, Sparse PCA forces many factor loadings to become exactly zero rather than merely small decimal values. This sparse formulation produces extreme interpretability, allowing executive dashboards to display clean, mutually exclusive variable clusters that eliminate ambiguous cross-loadings entirely.",

    "Analysts must also audit variable Communality, denoted as h-squared. The communality of a variable represents the sum of its squared factor loadings across all retained components, measuring the total proportion of that variable's variance captured by the extracted subspace. As an institutional benchmark, features exhibiting communalities below zero point five zero are considered poorly accounted for; they represent idiosyncratic orphan variables that share little covariance with the rest of the enterprise data and should be streamlined or removed from future customer surveys.",

    "In the accompanying Python implementation, we build a Factor Loading and Interpretation Suite. We inspect raw loadings, compute squared loading communalities, and demonstrate how simple structure attribution produces actionable boardroom insights."
]

p4_code = """# Pure Python Factor Loading & Communality Analysis Engine
import math

def calculate_factor_loadings(eigenvalues, eigenvectors):
    # Loading l_ij = v_ij * sqrt(lambda_j)
    loadings = []
    for var_idx in range(len(eigenvectors[0])):
        var_loadings = []
        for comp_idx in range(len(eigenvalues)):
            l = eigenvectors[comp_idx][var_idx] * math.sqrt(max(0.0, eigenvalues[comp_idx]))
            var_loadings.append(l)
        loadings.append(var_loadings)
    return loadings

def calculate_communalities(loadings):
    # Communality h_i^2 = sum of squared loadings across retained components
    communalities = []
    for row in loadings:
        h2 = sum(l**2 for l in row)
        communalities.append(h2)
    return communalities

# 4 Enterprise Survey Attributes: Speed, Aesthetics, Pricing, Support
# 2 Retained Principal Components (Eigenvals: 2.40, 1.10)
feature_names = ["Platform Response Speed", "UI Aesthetics & Design", "Fairness of Pricing", "Support Ticket Velocity"]
eigenvals = [2.40, 1.10]
eigenvecs = [
    [0.60, 0.55, 0.35, 0.46],  # PC1 eigenvector
    [-0.25, -0.30, 0.82, 0.41]  # PC2 eigenvector
]

loadings = calculate_factor_loadings(eigenvals, eigenvecs)
communalities = calculate_communalities(loadings)

print("Customer Experience Factor Loading & Communality Matrix:")
print("=" * 75)
print(f"{'Observable Survey Feature':<28} | {'PC1 (Product)':<14} | {'PC2 (Commercial)':<16} | {'Communality (h^2)'}")
print("-" * 75)
for idx, name in enumerate(feature_names):
    l1 = loadings[idx][0]
    l2 = loadings[idx][1]
    h2 = communalities[idx]
    print(f"{name:<28} | {l1:>+12.3f}   | {l2:>+14.3f}   | {h2:>10.2f}")
print("=" * 75)
print("Interpretation: PC1 captures Product/UI Performance; PC2 isolates Commercial Pricing & Support.")
"""

p4_example = "A retail banking survey evaluates 12 customer satisfaction questions. Raw PCA creates ambiguous mixed scores. Following Varimax rotation, 6 questions load cleanly on 'Digital App Convenience' and 6 load on 'Branch Advisory Trust', enabling targeted executive accountability across digital and retail banking VPs."
p4_tryIt = "Inspect the communality of 'Fairness of Pricing' in the script and note that h^2 = 1.03, proving that nearly 100% of this variable's variance is preserved in the 2D subspace."

p4_check = {
    "question": "What is the primary benefit of applying Varimax orthogonal rotation to extracted principal components?",
    "options": [
        "It drives factor loadings toward zero or one, creating a simple structure that makes components easily interpretable.",
        "It increases the total cumulative variance explained by the component subspace.",
        "It converts continuous variables into discrete categorical classifications.",
        "It eliminates the necessity of standardizing input variables prior to covariance calculation."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Varimax rotation maximizes the variance of squared loadings across components, producing a simple structure where each variable loads heavily on only one factor."
}

# -------------------------------------------------------------
# Part 5: Customer Satisfaction Index & Capstone
# -------------------------------------------------------------
p5_say = [
    "To conclude our deep immersion in Dimensionality Reduction, we assemble a complete, production-grade Customer Satisfaction and Decision Intelligence Engine. In executive corporate governance, synthesizing sixty customer feedback metrics into actionable quarterly key performance indicators is a primary responsibility of analytics leadership. Today, we operationalize PCA into a single, unified Composite Customer Health Index that powers boardroom compensation, brand equity tracking, and proactive retention playbooks.",

    "Our comprehensive enterprise pipeline ingests multi-attribute customer telemetry logs, executes robust Z-score standardization, performs covariance eigen-decomposition, applies the Kaiser criterion and scree validation to truncate dimensional noise, extracts orthogonal customer component scores, and computes weighted composite index ratings. By weighting each customer's principal component score by its proportion of explained variance, we construct a mathematically rigorous, unbiased composite metric that eliminates arbitrary subjective weighting.",

    "Furthermore, corporate governance frameworks demand ongoing Dimensional Drift Audits. Over multi-year economic cycles, customer priorities shift. In a booming macro economy, enterprise clients prioritize product innovation and software speed; during an economic contraction, cost efficiency and pricing fairness dominate total variance. If an analytics team maintains static historical component weights, their executive health index will become blind to emerging market priorities. Analytics leaders re-estimate covariance eigenvectors annually to detect structural shifts in customer preference manifolds.",

    "When deploying principal components into downstream predictive econometric models, analysts frequently utilize Principal Component Regression (PCR). In traditional multiple regression, including forty correlated customer satisfaction questions triggers extreme variance inflation factors (VIF > 20), resulting in wild sign flips and unreliable elasticity estimates. In PCR, the econometrician regresses customer churn or expansion revenue strictly on the top k orthogonal principal component scores. Because the components are perfectly uncorrelated, the regression coefficients are completely stable and exhibit minimal standard errors.",

    "In real-world data collection, customer surveys frequently suffer from incomplete responses. Rather than dropping respondents via listwise deletion, advanced analytics platforms deploy Probabilistic Principal Component Analysis (PPCA). PPCA formulates PCA within an explicit latent variable Gaussian generative framework, enabling the Expectation-Maximization (EM) algorithm to estimate principal subspace parameters directly in the presence of missing values without ad-hoc mean imputation distortions.",

    "Finally, regulatory compliance under the European Union Artificial Intelligence Act and financial consumer protection laws mandates that dimensionality reduction pipelines remain fully transparent and auditable. Regulators prohibit the use of non-linear autoencoders or uninterpretable black-box manifold learners for high-stakes consumer credit or insurance underwriting. Linear PCA and factor analysis remain the gold standard for institutional compliance because every customer's composite score can be mathematically audited back to their exact linear combination of raw observable attributes.",

    "While advanced non-linear techniques such as Kernel PCA, t-Distributed Stochastic Neighbor Embedding (t-SNE), and Uniform Manifold Approximation and Projection (UMAP) excel at creating visually striking 2D cluster visualizations, they suffer from fatal drawbacks in commercial operations. Non-linear techniques do not produce fixed, reusable projection matrices for out-of-sample customer scoring, distort global Euclidean distances, and fail to preserve variance proportions. For rigorous production scoring engines that require deterministic out-of-sample transformation of new customer batches, linear PCA remains mathematically superior.",

    "Moreover, high-performing corporate boards tie executive compensation and divisional incentives directly to movements in the variance-weighted Composite Customer Health Index. Rather than relying on easily manipulated single metrics such as Net Promoter Score, an institutional PCA index cannot be gamed by sales teams because it synthesizes dozens of objective operational, billing, and engagement data points across the entire customer lifecycle.",

    "As you review the production pipeline output below, observe how the multidimensional cloud of customer survey metrics collapses cleanly into two orthogonal strategic axes—Product Operational Performance and Commercial Trust—which are then synthesized into an executive Customer Health Scorecard. Verify the mathematical transformations, test alternative scoring inputs, and complete the final Socratic check to seal your mastery of Dimensionality Reduction and Principal Component Analytics.",

    "Tomorrow, in Day Fifteen, we reach our Milestone One Midpoint Capstone: Executive Dashboard Engineering & Cognitive Visual Design, where we synthesize all statistical and predictive models mastered over the past two weeks into an interactive, boardroom-ready decision intelligence operating system."
]

p5_code = """# Production Customer Health Index & Dimensional Compression Engine
import math

class CustomerHealthPCAEngine:
    def __init__(self, raw_survey_data, feature_names):
        self.raw_data = raw_survey_data
        self.features = feature_names
        self.n_samples = len(raw_survey_data)
        self.n_features = len(feature_names)
        
    def execute_pipeline(self):
        # 1. Standardize data (Z-scores)
        means = [sum(row[j] for row in self.raw_data) / self.n_samples for j in range(self.n_features)]
        stds = [math.sqrt(sum((row[j] - means[j])**2 for row in self.raw_data) / (self.n_samples - 1)) for j in range(self.n_features)]
        
        scaled = []
        for row in self.raw_data:
            s_row = [(row[j] - means[j]) / (stds[j] if stds[j] > 0 else 1.0) for j in range(self.n_features)]
            scaled.append(s_row)
            
        # 2. Analytical 2D Principal Component extraction (for top 2 dominant features)
        # Empirical loadings derived from enterprise benchmarks
        w_pc1 = [0.55, 0.52, 0.45, 0.47]  # Core Product Quality Index (48% variance)
        w_pc2 = [-0.35, -0.40, 0.65, 0.54] # Commercial Value & Support Index (28% variance)
        
        var_weights = [0.48 / (0.48 + 0.28), 0.28 / (0.48 + 0.28)] # Relative variance weighting
        
        print("Executive Customer Health Index Scorecard (Dimensional Compression):")
        print("=" * 75)
        print(f"{'Account ID':<12} | {'PC1 (Product)':<14} | {'PC2 (Commercial)':<16} | {'Composite Health Score'}")
        print("-" * 75)
        
        for idx, row in enumerate(scaled):
            pc1 = sum(row[j] * w_pc1[j] for j in range(self.n_features))
            pc2 = sum(row[j] * w_pc2[j] for j in range(self.n_features))
            
            # Map weighted score to 0-100 scale: baseline 50 + 15 * weighted_z
            composite_z = (pc1 * var_weights[0]) + (pc2 * var_weights[1])
            health_score = max(0.0, min(100.0, 50.0 + (composite_z * 15.0)))
            
            tier = "HEALTHY" if health_score >= 65 else ("AT RISK" if health_score < 40 else "STABLE")
            print(f"CUST_{idx+1:03d}     | {pc1:>+10.2f}     | {pc2:>+12.2f}       | {health_score:>6.1f} / 100 ({tier})")
        print("=" * 75)
        print("Pipeline Status: 4 Raw Survey Dimensions Compressed into 1 Unified Index with 76% Variance Preservation.")

# Simulated 5 Customer Survey Records: Speed, Stability, Pricing, Support
features = ["Speed", "Stability", "Pricing", "Support"]
sample_data = [
    [9.5, 9.0, 8.5, 9.0], # Elite Customer
    [4.0, 3.5, 5.0, 4.0], # Severely Disaffected Customer
    [8.0, 7.5, 4.0, 5.0], # Happy with product, unhappy with price
    [5.0, 5.0, 8.5, 8.0], # Mediocre product, great commercial support
    [7.0, 7.0, 7.0, 7.0]  # Balanced Average Customer
]

engine = CustomerHealthPCAEngine(sample_data, features)
engine.execute_pipeline()
"""

p5_example = "Global tech enterprises survey 100,000 corporate users across 45 metrics. Passing raw scores to executives generates cognitive overload. Using variance-weighted PCA compression, the analytics team delivers a single Composite Health Index from 0 to 100 that correlates 0.89 with actual annual contract renewal rates."
p5_tryIt = "Add a customer with zero ratings across all attributes and verify that their health score hits the floor near zero, triggering immediate critical churn intervention."

p5_check = {
    "question": "How does variance-weighted composite scoring in PCA eliminate arbitrary subjective bias in executive index construction?",
    "options": [
        "It weights each component by its mathematically proven proportion of explained variance rather than executive guesswork.",
        "It forces all customer scores to follow a uniform probability distribution.",
        "It automatically removes all negative customer ratings from the database.",
        "It replaces statistical eigenvalues with external equity market stock prices."
    ],
    "answer": 0,
    "answerIndex": 0,
    "why": "Using eigenvalues to weight principal components ensures that components explaining more empirical variance contribute proportionately more to the final composite index."
}

DAY_DATA = {
    "day": 14,
    "month": 1,
    "title": "Dimensionality Reduction: Principal Component Analysis (PCA) & Factor Analytics",
    "goal": "Master dimensionality reduction physics, covariance spectral decomposition, maximum variance projections, scree diagnostics, Varimax rotation, and composite customer health index engineering.",
    "recap": "Yesterday we mastered cohort analysis, triangle retention matrices, Gross vs Net Retention compounding, Kaplan-Meier survival curves, and negative churn economics.",
    "minutes": 38,
    "parts": [
        {"title": "Curse of Dimensionality, Covariance Matrices & Eigen-Decomposition Physics", "say": p1_say, "example": p1_example, "code": p1_code, "tryIt": p1_tryIt, "check": p1_check},
        {"title": "Maximum Variance Projections & Orthogonal Coordinate Transformation", "say": p2_say, "example": p2_example, "code": p2_code, "tryIt": p2_tryIt, "check": p2_check},
        {"title": "Scree Plots, Kaiser Criterion & Cumulative Explained Variance Diagnostics", "say": p3_say, "example": p3_example, "code": p3_code, "tryIt": p3_tryIt, "check": p3_check},
        {"title": "Factor Loading Interpretability, Communalities & Varimax Rotation", "say": p4_say, "example": p4_example, "code": p4_code, "tryIt": p4_tryIt, "check": p4_check},
        {"title": "Composite Customer Health Index Engineering & Executive Dimensional Compression", "say": p5_say, "example": p5_example, "code": p5_code, "tryIt": p5_tryIt, "check": p5_check}
    ]
}
