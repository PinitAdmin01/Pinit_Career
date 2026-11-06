# 📈 PinitCareer Labor-Market Outcomes & Longitudinal Research Protocol

> **Document Version:** 1.2.0 (Authoritative Operational Standard)  
> **Associated Standard:** [`docs/PINIT_CREDENTIAL_OPERATIONS_AND_GOVERNANCE_CHARTER.md`](file:///c:/Users/vinay/OneDrive/project/Present-Career-os/docs/PINIT_CREDENTIAL_OPERATIONS_AND_GOVERNANCE_CHARTER.md)  
> **Audience:** Institutional Researchers, Employer Partners, Academic Advisory Board  
> **Effective Date:** September 2026  

---

## 1. 🎯 Purpose & Research Methodology

The ultimate proof of an engineering training program is not how clean its codebase is, but **whether its graduates perform effectively in production software engineering roles**.

This protocol defines the econometric, psychometric, and longitudinal research methodology used by PinitCareer to evaluate credential validity and labor-market impact. PinitCareer rejects vanity percentages and self-reported survey bias in favor of **pre-registered hypotheses, verified employment records, matched comparison groups, and confidence intervals**.

---

## 2. 🔬 The Three-Phase Empirical Research Progression

To prevent premature claims based on underpowered sample sizes, PinitCareer enforces a three-phase scientific progression:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ THE THREE-PHASE EMPIRICAL RESEARCH PROGRESSION                                                                   │
├─────────────────┬─────────────────┬───────────────────────────────┬──────────────────────────────────────────────┤
│ Phase           │ Sample Size     │ Primary Focus                 │ Permitted Claims & Public Scope              │
├─────────────────┼─────────────────┼───────────────────────────────┼──────────────────────────────────────────────┤
│ Phase 1:        │ 5–10            │ • Assessor calibration        │ 🛑 ZERO labor-market or employment claims.   │
│ Pilot A         │ Candidates      │ • Rubric defect discovery     │ Published exclusively as an internal         │
│                 │ (3–5 Assessors) │ • Exam timing & usability     │ Assessor Calibration Reliability Report.     │
├─────────────────┼─────────────────┼───────────────────────────────┼──────────────────────────────────────────────┤
│ Phase 2:        │ 30–50+          │ • Psychometric reliability    │ Internal psychometric report: score variance,│
│ Pilot B         │ Candidates      │ • Multi-rater ICC analysis    │ pass/fail distributions, completion rates,   │
│ (Expanded       │ (6–10 Assessors)│ • Gate timing & rubric tuning │ and multi-rater ICC. 🛑 ZERO public          │
│ Reliability)    │                 │ • Tripwire sensitivity        │ employment or salary marketing claims.       │
├─────────────────┼─────────────────┼───────────────────────────────┼──────────────────────────────────────────────┤
│ Phase 3:        │ Multiple Cohorts│ • Verified 180-day employment │ Rigorous longitudinal workforce outcome study│
│ Outcome Study   │ (N ≥ 100)       │ • Salary uplift vs baseline   │ benchmarked against matched non-participant  │
│                 │                 │ • 1-year employer retention   │ comparison baselines with 95% CIs.           │
└─────────────────┴─────────────────┴───────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 3. 📊 Core Research Dimensions & Econometric Definitions

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ THE 8 CORE LABOR-MARKET RESEARCH DIMENSIONS                                                                      │
├─────┬──────────────────────────────┬─────────────────────────────────────────────────────────────────────────────┤
│ No. │ Research Dimension           │ Operational Definition & Statistical Metric                                 │
├─────┼──────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 01  │ Assessment Reliability       │ Inter-rater reliability on quantitative rubric scores evaluated via         │
│     │                              │ `ICC(2,1)` (target $\ge 0.75$) and `ICC(2,k)` (target $\ge 0.85$) with 95% CIs.│
├─────┼──────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 02  │ Learning Effectiveness       │ Statistically significant competency score gain from baseline diagnostic    │
│     │                              │ entry evaluation to final capstone exit across Gates A–E ($p < 0.01$).      │
├─────┼──────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 03  │ Target-Role Placement Rate   │ Proportion of job-seeking graduates securing verified employment in target  │
│     │                              │ technical roles (SOC 15-1252 / 15-1256) within 180 days of graduation.      │
├─────┼──────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 04  │ Role Relevance               │ Proportion of employed graduates whose daily duties require software        │
│     │                              │ engineering (verified via job description and offer letter audit).          │
├─────┼──────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 05  │ Compensation Delta           │ Median earnings change calculated as: $\text{Salary}_{\text{Post}} -        │
│     │                              │ \text{Salary}_{\text{Pre}}$, benchmarked against matched regional baselines. │
├─────┼──────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 06  │ Repeat Employer Hiring Rate  │ Proportion of partner employers who make 2+ hires from credential holders   │
│     │                              │ without reverting to traditional four-year degree filters.                  │
├─────┼──────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 07  │ Graduate Retention on Job    │ Proportion of placed graduates maintaining continuous engineering employment│
│     │                              │ at 90 days, 180 days, and 365 days post-hire.                               │
├─────┼──────────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
│ 08  │ Candidate Economic ROI       │ Ratio of annualized compensation gain to total direct program costs and     │
│     │                              │ opportunity cost during study.                                              │
└─────┴──────────────────────────────┴─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. 🔍 Counteracting Selection Bias & Comparison Baselines

A persistent flaw in vocational education research is **Selection Bias**—crediting a program for outcomes that were actually driven by candidates' pre-existing talent, degrees, or economic advantages.

To ensure econometric defensibility, PinitCareer mandates three distinct comparison baselines:

### 1. Within-Person Pre/Post Comparison
$$\Delta_{\text{Earnings}} = Y_{i, \text{post}} - Y_{i, \text{pre}}$$
*Compares each candidate's post-credential compensation directly against their documented pre-enrollment earnings history (verified via prior tax forms or verified employment records).*

### 2. Matched Regional Non-Participant Baseline
*Benchmarks candidate employment and salary trajectories against regional workforce averages for individuals with identical starting education (e.g. non-CS bachelor's or career-switchers) within the same metropolitan labor market.*

### 3. Industry Entry-Level Median Baseline
*Compares candidate starting offers against prevailing entry-level software engineering compensation reports (e.g. Bureau of Labor Statistics, Levels.fyi regional medians).*

> [!WARNING]
> **Statistical Analysis Plan Qualification & Causal Humility Mandate:**
> Observational matched comparisons estimate statistical association, not automatic causation. Unmeasured confounders (such as unobserved candidate baseline motivation, innate problem-solving aptitude, prior professional networks, or local hiring shocks) cannot be completely eliminated by observational matching alone.
> 🛑 **Marketing Ban on Causal Claims:** PinitCareer is strictly prohibited from claiming "our program caused an X% salary increase" or "graduates earn Y because of our training" in public marketing materials based on observational cohorts. All public reporting must employ causally disciplined terminology (e.g., "associated with", "observed salary delta among program completers").

---

## 5. 🏢 The 7-Stage Employer Conversion Funnel & Denominator Discipline

PinitCareer evaluates employer market adoption through a rigorous, transparent **7-Stage Conversion Funnel**, analyzing candidate conversion and drop-off at each operational touchpoint:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ THE 7-STAGE EMPLOYER CONVERSION FUNNEL                                                                           │
├───────┬──────────────────────────────┬───────────────────────────────────────────────────────────────────────────┤
│ Stage │ Funnel Milestone             │ Verifiable Behavior & Conversion Metric                                   │
├───────┼──────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 1     │ Employer Outreach            │ Partner employers contacted with curriculum specification & sample rubrics│
├───────┼──────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 2     │ Work-Sample Review           │ Hiring managers evaluate anonymized candidate code repositories & PRs.    │
├───────┼──────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 3     │ Interview Request / Waiver   │ Employer waives generic initial recruiter screen and requests interview.  │
├───────┼──────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 4     │ Technical Interview          │ Candidate completes technical engineering rounds with the employer team.  │
├───────┼──────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 5     │ Job Offer & Placement        │ Employer extends a verified full-time engineering offer at or above median│
├───────┼──────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 6     │ 90-Day On-the-Job Validation │ Engineering Manager confirms satisfactory production engineering delivery.│
├───────┼──────────────────────────────┼───────────────────────────────────────────────────────────────────────────┤
│ 7     │ Repeat Unsubsidized Hiring   │ Employer returns to hire additional credential holders without subsidies. │
└───────┴──────────────────────────────┴───────────────────────────────────────────────────────────────────────────┘
```

### Denominator Discipline & Mathematical Specifications
To eliminate denominator manipulation (e.g. selectively trimming the eligible cohort to inflate percentages), PinitCareer establishes unambiguous mathematical definitions for each funnel stage:

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 7-STAGE FUNNEL DENOMINATOR DISCIPLINE & MATHEMATICAL SPECIFICATIONS                                              │
├───────┬──────────────────────────┬──────────────────────────────┬────────────────────────────────────────────────┤
│ Stage │ Funnel Milestone         │ Explicit Numerator ($N$)     │ Explicit Denominator ($D$) & Eligible Cohort   │
├───────┼──────────────────────────┼──────────────────────────────┼────────────────────────────────────────────────┤
│ 1     │ Employer Outreach        │ Responding employers         │ Validated technology employers contacted       │
├───────┼──────────────────────────┼──────────────────────────────┼────────────────────────────────────────────────┤
│ 2     │ Work-Sample Review       │ Anonymized portfolios read   │ Portfolios submitted to responsive employers   │
├───────┼──────────────────────────┼──────────────────────────────┼────────────────────────────────────────────────┤
│ 3     │ Interview Request/Waiver │ Direct interview invitations │ Portfolios evaluated by engineering managers   │
├───────┼──────────────────────────┼──────────────────────────────┼────────────────────────────────────────────────┤
│ 4     │ Technical Interview Loop │ Completed interview loops    │ Candidates invited to technical interview loop │
├───────┼──────────────────────────┼──────────────────────────────┼────────────────────────────────────────────────┤
│ 5     │ Verified Job Placement   │ Full-time target-role offers │ ALL actively job-seeking credential holders    │
│       │ (180 Days)               │ accepted (SOC 15-1252/1256)  │ (Intent-to-treat; unplaced dropouts included)   │
├───────┼──────────────────────────┼──────────────────────────────┼────────────────────────────────────────────────┤
│ 6     │ 90-Day Retention & Eval  │ Satisfactory manager rating  │ Verified placed candidates reaching 90 days    │
├───────┼──────────────────────────┼──────────────────────────────┼────────────────────────────────────────────────┤
│ 7     │ Repeat Unsubsidized Hire │ Employers making 2+ hires    │ Total employers who made an initial hire       │
└───────┴──────────────────────────┴──────────────────────────────┴────────────────────────────────────────────────┘
```

### The Employer Core Adoption & Repeat Hiring Metric
In every 90-day post-hire employer audit, hiring managers must respond to the single decisive litmus question:
> **"Based on this graduate's on-the-job production performance, would you interview another PinitCareer credential holder for an engineering role without requiring an exception to your standard degree requirements?"**

### Internal vs External Research Hypothesis Isolation
Target thresholds (e.g. $\ge 80\%$ affirmative response, $\ge 85\%$ placement, $\ge 90\%$ retention, $\ge +40\%$ salary delta) are strictly **pre-registered internal research hypotheses**. 
* **Marketing Embargo:** External commercial promotion of these figures as program promises or marketing claims is strictly prohibited.
* **Empirical Requirement:** These metrics can only be referenced publicly once validated through formal Phase 3 longitudinal research publications with audited evidence and reported with full 95% confidence intervals.

---

## 6. 📝 Pre-Registration Lock & Scientific Transparency Protocol

1. **Pre-Registration Lock:** All Phase 3 outcome studies must be pre-registered on an open registry (e.g. Open Science Framework - OSF) **before any candidate outcome data is gathered or analyzed**. The pre-registration dossier must define:
   * **Primary Estimand:** Average Treatment Effect on the Treated (ATT) on target-role placement (SOC 15-1252 / 15-1256).
   * **Secondary Outcomes:** Starting compensation delta, 365-day retention, repeat employer hiring rate.
   * **Matching Variables:** Coarsened Exact Matching (CEM) covariates (prior educational attainment, pre-enrollment earnings, metropolitan labor market, years of professional experience).
   * **Missing Data Protocol:** Conservative intention-to-treat rules (unresponsive graduates or dropouts are coded as non-placed).
   * **Sensitivity Analyses:** Rosenbaum bounds to assess sensitivity to potential unobserved selection bias.
2. **Versioned Amendment Protocol:** Any modification to the research analysis plan requires a public, timestamped amendment logged to the registry with full rationale prior to analyzing subsequent data windows.
3. **Confidence Intervals:** Every reported percentage (placement rate, retention, compensation) must be published with exact sample sizes ($N$) and **95% Confidence Intervals (95% CI)**.
4. **Dropout Accounting:** Published reports must account for every enrolled candidate:
   $$\text{Completion Rate} = \frac{N_{\text{Graduated}}}{N_{\text{Enrolled}}}$$
   $$\text{Placed Rate (All Enrolled)} = \frac{N_{\text{Employed}}}{N_{\text{Enrolled}}}$$
   *Hiding dropouts to inflate placement rates is strictly prohibited.*

> [!IMPORTANT]
> **Permanent Credential Metric Exclusion Invariant:**
> Under no circumstances shall curriculum construction tallies (`120/120 days complete`, `25/25 technical gates passed`) or cohort psychometric parameters (`ICC ≥ 0.75`) appear on candidate credentials. The credential attests strictly to the candidate's personal demonstration of engineering competence across Gates A–E before calibrated independent assessors.

---

## 📝 Document Change-Control & Governance Ledger

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DOCUMENT CHANGE-CONTROL & GOVERNANCE LEDGER                                                                      │
├──────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┤
│ Document Owner           │ PinitCareer Institutional Research & Labor Outcomes Committee                         │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Authorized Approvers     │ Lead Econometrician, Director of Career Services & Certification Chair                │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Current Version          │ 1.2.0 (Operational Governance Hardened Release)                                       │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Effective Date           │ September 2026                                                                        │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Supersedes               │ Version 1.1.0 (Hardened Pre-Pilot Release)                                            │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Change Reason            │ Causal humility marketing ban, denominator discipline specifications, internal vs    │
│                          │ external hypothesis isolation, and ledger update to Version 1.2.0.                   │
├──────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
│ Amendment Policy         │ Modifications require unanimous Certification Board quorum, version increment, and   │
│                          │ published impact assessment prior to cohort execution.                                │
└──────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────┘
```
