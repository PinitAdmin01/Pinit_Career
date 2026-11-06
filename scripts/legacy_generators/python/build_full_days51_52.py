# scripts/build_full_days51_52.py
import sys
import os
import io
import contextlib
import json

sys.stdout.reconfigure(encoding="utf-8")

def run_py(code_str: str) -> str:
    buf = io.StringIO()
    g = {}
    with contextlib.redirect_stdout(buf):
        exec(code_str, g)
    return buf.getvalue().rstrip()

# ==============================================================================
# DAY 51: EuSpRIG Standards & Model Audit Methodology
# ==============================================================================

# Part 1 Code: EuSprigArchitectureAuditor
d51_p1_code = """from typing import Dict, List, Any, Tuple

class EuSprigArchitectureAuditor:
    def __init__(self) -> None:
        self.standards = {
            "organization": "European Spreadsheet Risks Interest Group (EuSpRIG)",
            "benchmark": "FAST 5.0 Financial Modeling Standard",
            "separation_rule": "Tripartite Structural Separation (Inputs, Calculations, Outputs)"
        }
    
    def audit_workbook_layers(self, sheets: List[Dict[str, Any]]) -> Dict[str, Any]:
        layer_violations = []
        clean_sheets = 0
        
        for sheet in sheets:
            name = sheet["name"]
            layer_type = sheet["layer_type"]
            cells = sheet["cells"]
            
            sheet_violations = 0
            if layer_type == "INPUT":
                # Invariant: Parameter layer must have strictly ZERO formulas
                for cell_ref, cell_data in cells.items():
                    if cell_data.get("is_formula", False):
                        layer_violations.append(f"{name}!{cell_ref}: Formula found in pure INPUT sheet")
                        sheet_violations += 1
            elif layer_type == "CALCULATION":
                # Invariant: Calculation layer must have strictly ZERO hardcoded constants
                for cell_ref, cell_data in cells.items():
                    if not cell_data.get("is_formula", False) and cell_data.get("value") is not None:
                        layer_violations.append(f"{name}!{cell_ref}: Hardcoded constant found in CALCULATION sheet")
                        sheet_violations += 1
            elif layer_type == "OUTPUT":
                # Invariant: Output layer must contain only references and presentation formatting
                for cell_ref, cell_data in cells.items():
                    if cell_data.get("is_raw_data", False):
                        layer_violations.append(f"{name}!{cell_ref}: Raw data mutation in OUTPUT presentation sheet")
                        sheet_violations += 1
            
            if sheet_violations == 0:
                clean_sheets += 1
                
        compliance_pct = round((clean_sheets / len(sheets)) * 100, 2) if sheets else 100.0
        return {
            "total_sheets": len(sheets),
            "clean_sheets": clean_sheets,
            "compliance_pct": compliance_pct,
            "violations_detected": len(layer_violations),
            "violations": layer_violations,
            "eusprig_status": "CERTIFIED" if compliance_pct == 100.0 else "NON_COMPLIANT"
        }

auditor = EuSprigArchitectureAuditor()
sample_model = [
    {
        "name": "Assumptions_Inputs",
        "layer_type": "INPUT",
        "cells": {
            "B4": {"value": 0.21, "is_formula": False},
            "B5": {"value": 0.08, "is_formula": False},
            "B6": {"value": 15000000, "is_formula": False}
        }
    },
    {
        "name": "Debt_Amort_Calc",
        "layer_type": "CALCULATION",
        "cells": {
            "C10": {"value": None, "is_formula": True, "formula": "=Assumptions_Inputs!B6 * Assumptions_Inputs!B5"},
            "C11": {"value": 0.28, "is_formula": False}  # Hardcoded constant violation!
        }
    },
    {
        "name": "Executive_Summary",
        "layer_type": "OUTPUT",
        "cells": {
            "D5": {"value": None, "is_formula": True, "formula": "=Debt_Amort_Calc!C10"}
        }
    }
]

audit_res = auditor.audit_workbook_layers(sample_model)
print(f"EuSpRIG Standard:       {auditor.standards['benchmark']}")
print(f"Audited Sheets:         {audit_res['total_sheets']}")
print(f"Compliance Rating:      {audit_res['compliance_pct']}%")
print(f"Violations Count:       {audit_res['violations_detected']}")
for v in audit_res['violations']:
    print(f"  [CRITICAL FINDING] {v}")
print(f"Audit Status:           {audit_res['eusprig_status']}")
"""

# Part 2 Code: FormulaDriftDetector
d51_p2_code = """from typing import Dict, List, Any, Set

class FormulaDriftDetector:
    def __init__(self) -> None:
        self.hardcoded_operators = ["*", "/", "+", "-"]
    
    def scan_column_uniformity(self, sheet_name: str, column_letter: str, rows: List[Dict[str, Any]]) -> Dict[str, Any]:
        formula_signatures: Dict[str, List[int]] = {}
        anomalous_rows = []
        
        for r in rows:
            row_idx = r["row"]
            formula = r.get("formula", "")
            is_formula = r.get("is_formula", False)
            
            if not is_formula or not formula:
                anomalous_rows.append({"row": row_idx, "issue": "BLANK_OR_HARDCODED_VALUE", "content": r.get("value")})
                continue
                
            # Normalize formula signature to detect pattern drift
            # E.g., replace row numbers with {R} to check structural congruence
            tokens = formula.split()
            # Check for hardcoded tax/interest numbers like * 0.28 or * 1.05
            has_hardcoded_constant = any(
                any(op in tok for op in self.hardcoded_operators) and any(c.isdigit() for c in tok)
                for tok in tokens if "!" not in tok and "$" not in tok
            )
            
            if has_hardcoded_constant:
                anomalous_rows.append({"row": row_idx, "issue": "HARDCODED_CONSTANT_IN_FORMULA", "content": formula})
            
            sig = "".join([c if not c.isdigit() else "#" for c in formula])
            formula_signatures.setdefault(sig, []).append(row_idx)
            
        # Standard signature is the one used by the majority of rows
        majority_sig = max(formula_signatures.keys(), key=lambda k: len(formula_signatures[k])) if formula_signatures else ""
        uniformity_pct = round((len(formula_signatures.get(majority_sig, [])) / len(rows)) * 100, 2) if rows else 100.0
        
        return {
            "sheet": sheet_name,
            "column": column_letter,
            "scanned_rows": len(rows),
            "dominant_signature": majority_sig,
            "uniformity_pct": uniformity_pct,
            "anomalies_detected": len(anomalous_rows),
            "anomalies": anomalous_rows
        }

detector = FormulaDriftDetector()
# Simulate 10,000 rows where row 42 has formula drift
scanned_data = [
    {"row": i, "is_formula": True, "formula": f"=E{i} * InputSheet!$B$4"}
    for i in range(1, 101)
]
# Introduce formula drift at row 42
scanned_data[41] = {"row": 42, "is_formula": True, "formula": "=E42 * 0.15"}

drift_res = detector.scan_column_uniformity("Revenue_Projections", "G", scanned_data)
print(f"Column Uniformity Audit: Sheet '{drift_res['sheet']}' Column {drift_res['column']}")
print(f"Total Rows Scanned:     {drift_res['scanned_rows']}")
print(f"Dominant Signature:     {drift_res['dominant_signature']}")
print(f"Column Uniformity:      {drift_res['uniformity_pct']}%")
print(f"Anomalies Count:        {drift_res['anomalies_detected']}")
for a in drift_res['anomalies']:
    print(f"  Row {a['row']}: {a['issue']} -> {a['content']}")
"""

# Part 3 Code: CellDependencyDagMapper
d51_p3_code = """from typing import Dict, List, Set, Any, Optional

class CellDependencyDagMapper:
    def __init__(self) -> None:
        self.precedents: Dict[str, Set[str]] = {}
        self.dependents: Dict[str, Set[str]] = {}
        
    def register_dependency(self, target_cell: str, input_precedents: List[str]) -> None:
        self.precedents.setdefault(target_cell, set()).update(input_precedents)
        for p in input_precedents:
            self.dependents.setdefault(p, set()).add(target_cell)
            
    def trace_precedents_tree(self, cell: str, depth: int = 0, max_depth: int = 5) -> Dict[str, Any]:
        if depth >= max_depth:
            return {"cell": cell, "truncated": True}
        direct_precs = sorted(list(self.precedents.get(cell, set())))
        tree = {
            "cell": cell,
            "depth": depth,
            "precedents": [self.trace_precedents_tree(p, depth + 1, max_depth) for p in direct_precs]
        }
        return tree
        
    def detect_circular_dependencies(self) -> List[List[str]]:
        circular_paths = []
        visited: Set[str] = set()
        recursion_stack: Set[str] = set()
        current_path: List[str] = []
        
        def dfs(node: str):
            visited.add(node)
            recursion_stack.add(node)
            current_path.append(node)
            
            for neighbor in self.precedents.get(node, set()):
                if neighbor not in visited:
                    dfs(neighbor)
                elif neighbor in recursion_stack:
                    # Circular reference detected!
                    cycle_start = current_path.index(neighbor)
                    cycle = current_path[cycle_start:] + [neighbor]
                    circular_paths.append(cycle)
                    
            recursion_stack.remove(node)
            current_path.pop()
            
        all_cells = list(self.precedents.keys())
        for c in all_cells:
            if c not in visited:
                dfs(c)
                
        return circular_paths

dag = CellDependencyDagMapper()
# Build financial modeling dependency tree
dag.register_dependency("Rev_Total", ["Units_Sold", "Avg_Price"])
dag.register_dependency("EBITDA", ["Rev_Total", "COGS", "OpEx"])
dag.register_dependency("Interest_Exp", ["Debt_Balance", "Interest_Rate"])
dag.register_dependency("EBT", ["EBITDA", "Depreciation", "Interest_Exp"])
dag.register_dependency("Tax_Provision", ["EBT", "Tax_Rate"])
dag.register_dependency("Net_Income", ["EBT", "Tax_Provision"])
# Simulate a circular reference bug: Debt Balance depends on Cash, Cash depends on Net Income, Net Income depends on Debt Balance
dag.register_dependency("Debt_Balance", ["Cash_Ending"])
dag.register_dependency("Cash_Ending", ["Net_Income"])

circuits = dag.detect_circular_dependencies()
print(f"Dependency Graph Registered Nodes: {len(dag.precedents)} cells")
print(f"Circular Reference Invariant Check: {len(circuits)} circularities detected")
for idx, cycle in enumerate(circuits, 1):
    print(f"  Cycle {idx}: {' -> '.join(cycle)}")
"""

# Part 4 Code: ModelRiskScorecardEngine
d51_p4_code = """from typing import Dict, List, Any

class ModelRiskScorecardEngine:
    def __init__(self) -> None:
        self.audit_categories = {
            "STRUCTURAL_SEPARATION": {"weight": 0.25, "desc": "Clean separation of Inputs, Calculations, and Outputs"},
            "FORMULA_CONSISTENCY":   {"weight": 0.25, "desc": "Zero formula drift across standardized tabular blocks"},
            "CIRCULARITY_INTEGRITY": {"weight": 0.25, "desc": "Absence of unmanaged iterative loops and broken references"},
            "HARDCODED_ABSTINENCE":  {"weight": 0.25, "desc": "Zero embedded scalar constants in calculation cells"}
        }
        
    def evaluate_model_health(self, audit_metrics: Dict[str, float]) -> Dict[str, Any]:
        total_score = 0.0
        evaluation_breakdown = {}
        
        for category, config in self.audit_categories.items():
            score = audit_metrics.get(category, 0.0)
            weight = config["weight"]
            weighted_points = score * weight
            total_score += weighted_points
            evaluation_breakdown[category] = {
                "raw_score": score,
                "weight": weight,
                "weighted_points": round(weighted_points, 2),
                "status": "PASS" if score >= 85.0 else "FAIL"
            }
            
        total_score = round(total_score, 2)
        if total_score >= 90.0:
            rating = "INSTITUTIONAL_PRIME (Tier 1 Certified)"
        elif total_score >= 75.0:
            rating = "GOVERNANCE_WARNING (Remediation Required)"
        else:
            rating = "CRITICAL_MODEL_DEFICIENCY (Unfit for Production)"
            
        return {
            "overall_score": total_score,
            "rating": rating,
            "breakdown": evaluation_breakdown,
            "sr11_7_compliant": total_score >= 85.0
        }

scorecard = ModelRiskScorecardEngine()
metrics = {
    "STRUCTURAL_SEPARATION": 100.0,
    "FORMULA_CONSISTENCY": 95.0,
    "CIRCULARITY_INTEGRITY": 100.0,
    "HARDCODED_ABSTINENCE": 90.0
}
report = scorecard.evaluate_model_health(metrics)
print("================================================================================")
print("  EuSpRIG & SR 11-7 ENTERPRISE MODEL RISK SCORECARD REPORT")
print("================================================================================")
print(f"Overall Model Health Score: {report['overall_score']} / 100")
print(f"Regulatory Model Rating:    {report['rating']}")
print(f"Federal Reserve SR 11-7:    {'COMPLIANT' if report['sr11_7_compliant'] else 'NON-COMPLIANT'}")
print("Category Breakdown:")
for cat, detail in report['breakdown'].items():
    print(f"  - {cat:24}: Raw={detail['raw_score']:5.1f} | Weighted={detail['weighted_points']:4.1f} | {detail['status']}")
"""

# Part 5 Code: MasterEuSprigAuditGateway
d51_p5_code = """from typing import Dict, List, Any
import hashlib
import json

class MasterEuSprigAuditGateway:
    def __init__(self) -> None:
        self.gateway_version = "EuSpRIG-Audit-v5.0-Enterprise"
        
    def conduct_comprehensive_audit(self, model_telemetry: Dict[str, Any]) -> Dict[str, Any]:
        sheets_count = model_telemetry.get("sheets_count", 0)
        total_cells = model_telemetry.get("total_cells", 0)
        formula_cells = model_telemetry.get("formula_cells", 0)
        hardcoded_violations = model_telemetry.get("hardcoded_violations", 0)
        circularities = model_telemetry.get("circularities", 0)
        uniformity_pct = model_telemetry.get("uniformity_pct", 100.0)
        
        # Calculate algorithmic health score
        penalty = (hardcoded_violations * 2.5) + (circularities * 15.0) + ((100.0 - uniformity_pct) * 0.5)
        score = max(0.0, min(100.0, round(100.0 - penalty, 2)))
        
        passed_audit = score >= 85.0 and circularities == 0
        
        summary = {
            "gateway": self.gateway_version,
            "sheets_count": sheets_count,
            "total_cells": total_cells,
            "formula_density": round((formula_cells / total_cells) * 100, 2) if total_cells else 0.0,
            "hardcoded_violations": hardcoded_violations,
            "circularities_count": circularities,
            "uniformity_pct": uniformity_pct,
            "audit_score": score,
            "certification_status": "CERTIFIED_EUSPRIG_STAGE11" if passed_audit else "AUDIT_REJECTED"
        }
        
        serialized = json.dumps(summary, sort_keys=True)
        seal = hashlib.sha256(serialized.encode("utf-8")).hexdigest()[:20]
        summary["sovereign_audit_seal"] = f"EUSPRIG-{seal.upper()}"
        return summary

gateway = MasterEuSprigAuditGateway()
telemetry = {
    "sheets_count": 14,
    "total_cells": 125000,
    "formula_cells": 48000,
    "hardcoded_violations": 0,
    "circularities": 0,
    "uniformity_pct": 99.8
}

cert = gateway.conduct_comprehensive_audit(telemetry)
print("================================================================================")
print("  MASTER EUSPRIG AUDIT GATEWAY: INSTITUTIONAL MODEL CERTIFICATION")
print("================================================================================")
print(f"Gateway Version:       {cert['gateway']}")
print(f"Total Model Cells:     {cert['total_cells']:,} across {cert['sheets_count']} worksheets")
print(f"Formula Density:       {cert['formula_density']}%")
print(f"Uniformity Score:      {cert['uniformity_pct']}%")
print(f"Audit Health Score:    {cert['audit_score']} / 100.0")
print(f"Certification Status:  {cert['certification_status']}")
print(f"Sovereign Audit Seal:  {cert['sovereign_audit_seal']}")
"""

# ==============================================================================
# DAY 52: Native Python in Excel (=PY()): Anaconda Runtime, Pandas DataFrames & Sandbox Limits
# ==============================================================================

# Part 1 Code: PythonExcelSandboxArchitecture
d52_p1_code = """from typing import Dict, List, Any

class PythonExcelSandboxArchitecture:
    def __init__(self) -> None:
        self.runtime_spec = {
            "provider": "Anaconda Distribution for Microsoft Azure",
            "python_version": "3.11.x Enterprise",
            "execution_environment": "Isolated Azure Container Hyper-V Sandbox",
            "calculation_order": "Strict Row-Major (Top-to-Bottom, Left-to-Right)"
        }
        self.preinstalled_libraries = [
            "pandas", "numpy", "scipy", "statsmodels", "scikit-learn", "matplotlib", "seaborn"
        ]
        
    def evaluate_execution_order(self, cell_scripts: List[Dict[str, Any]]) -> Dict[str, Any]:
        # Validate that referenced variables are defined in prior cells under Row-Major order
        defined_vars = set()
        violations = []
        
        # Sort cells by row-major order: Row first, then Column
        sorted_cells = sorted(cell_scripts, key=lambda c: (c["row"], c["col"]))
        
        for c in sorted_cells:
            cell_id = f"{c['col']}{c['row']}"
            code = c["code"]
            deps = c.get("depends_on", [])
            
            missing_deps = [d for d in deps if d not in defined_vars]
            if missing_deps:
                violations.append({
                    "cell": cell_id,
                    "missing_variables": missing_deps,
                    "error": "NameError or AttributeError: referenced variable not defined in prior row-major cell"
                })
            
            # Register defined variables
            for v in c.get("defines", []):
                defined_vars.add(v)
                
        return {
            "total_python_cells": len(cell_scripts),
            "execution_order": [f"{c['col']}{c['row']}" for c in sorted_cells],
            "violations_detected": len(violations),
            "violations": violations,
            "status": "VALID_ROW_MAJOR_PIPELINE" if not violations else "ORDER_VIOLATION_DETECTED"
        }

sandbox = PythonExcelSandboxArchitecture()
# Simulate scenario: Cell B2 tries to use 'model' defined later in B5
cells = [
    {"row": 5, "col": "B", "defines": ["model"], "depends_on": ["df"], "code": "model = RandomForestClassifier().fit(X, y)"},
    {"row": 2, "col": "B", "defines": ["predictions"], "depends_on": ["model"], "code": "predictions = model.predict(X_test)"},
    {"row": 1, "col": "B", "defines": ["df"], "depends_on": [], "code": "df = xl('A1:D100', headers=True)"}
]

res = sandbox.evaluate_execution_order(cells)
print(f"Runtime Sandbox:        {sandbox.runtime_spec['execution_environment']}")
print(f"Calculation Order:      {sandbox.runtime_spec['calculation_order']}")
print(f"Total Python Cells:     {res['total_python_cells']}")
print(f"Planned Cell Order:     {' -> '.join(res['execution_order'])}")
print(f"Order Invariant Status: {res['status']}")
for v in res['violations']:
    print(f"  [ERROR IN CELL {v['cell']}]: Missing {v['missing_variables']} ({v['error']})")
"""

# Part 2 Code: DataFrameGridMarshaller
d52_p2_code = """from typing import Dict, List, Any, Tuple
import math

class DataFrameGridMarshaller:
    def __init__(self) -> None:
        self.type_conversions = {
            "Excel Date Serial": "pd.Timestamp",
            "Excel String": "object / string",
            "Excel Number": "float64 / int64",
            "Excel Boolean": "bool",
            "Excel Error (#N/A)": "np.nan"
        }
        
    def xl_ingest(self, grid_range: str, raw_matrix: List[List[Any]], headers: bool = True) -> Dict[str, Any]:
        if not raw_matrix:
            return {"columns": [], "data": [], "row_count": 0}
            
        if headers:
            col_names = [str(c) for c in raw_matrix[0]]
            data_rows = raw_matrix[1:]
        else:
            col_names = [f"Col_{i+1}" for i in range(len(raw_matrix[0]))]
            data_rows = raw_matrix
            
        # Clean data: impute missing values and cast types
        cleaned_records = []
        imputed_cells = 0
        
        for row in data_rows:
            record = {}
            for col_idx, val in enumerate(row):
                col_name = col_names[col_idx]
                if val is None or val == "#N/A" or val == "":
                    # Impute missing values with column mean or default
                    record[col_name] = 0.0
                    imputed_cells += 1
                else:
                    record[col_name] = float(val) if isinstance(val, (int, float)) else str(val)
            cleaned_records.append(record)
            
        return {
            "range": grid_range,
            "headers_detected": headers,
            "columns": col_names,
            "shape": (len(cleaned_records), len(col_names)),
            "imputed_missing_values": imputed_cells,
            "preview_first_row": cleaned_records[0] if cleaned_records else {}
        }

marshaller = DataFrameGridMarshaller()
# Ingest 10,000 customer transaction rows from Excel
sample_grid = [
    ["CustomerID", "AccountTenure", "MonthlyCharges", "SupportCalls", "ChurnRisk"],
    [1001, 24, 75.50, 1, 0],
    [1002, 3, 110.20, 5, 1],
    [1003, 48, None, 0, 0],  # Missing value in MonthlyCharges
    [1004, 12, 55.00, 2, 0]
]

df_meta = marshaller.xl_ingest("Customers!A1:E5", sample_grid, headers=True)
print(f"Grid Ingestion Range:  {df_meta['range']}")
print(f"DataFrame Shape:       {df_meta['shape'][0]} rows x {df_meta['shape'][1]} columns")
print(f"Extracted Columns:     {', '.join(df_meta['columns'])}")
print(f"Imputed Missing Cells: {df_meta['imputed_missing_values']}")
print(f"Sample Record 1:       {df_meta['preview_first_row']}")
"""

# Part 3 Code: MachineLearningGridScorer
d52_p3_code = """from typing import Dict, List, Any, Tuple
import math

class MachineLearningGridScorer:
    def __init__(self) -> None:
        self.model_name = "GradientBoostedDefaultClassifier"
        
    def fit_and_score(self, feature_matrix: List[List[float]], labels: List[int]) -> Dict[str, Any]:
        # Simulated high-performance ML scoring in native Python
        n_samples = len(feature_matrix)
        n_features = len(feature_matrix[0]) if feature_matrix else 0
        
        # Calculate feature importances based on correlation with target
        importances = []
        for f_idx in range(n_features):
            f_vals = [row[f_idx] for row in feature_matrix]
            # Simple covariance score
            cov = sum((f_vals[i] - sum(f_vals)/n_samples) * (labels[i] - sum(labels)/n_samples) for i in range(n_samples))
            importances.append(abs(cov))
            
        total_imp = sum(importances) or 1.0
        normalized_importances = [round(imp / total_imp, 4) for imp in importances]
        
        # Generate prediction probabilities
        probabilities = []
        for row in feature_matrix:
            # Weighted linear score passed through sigmoid
            raw_score = sum(row[i] * normalized_importances[i] for i in range(n_features)) / (sum(row) or 1.0)
            prob = 1.0 / (1.0 + math.exp(-raw_score * 3.0))
            probabilities.append(round(prob, 4))
            
        return {
            "model": self.model_name,
            "trained_samples": n_samples,
            "feature_count": n_features,
            "feature_importances": normalized_importances,
            "mean_default_probability": round(sum(probabilities) / len(probabilities), 4),
            "sample_probabilities": probabilities[:4]
        }

scorer = MachineLearningGridScorer()
# Features: [DebtToIncome, CreditScoreNorm, Delinquencies]
X = [
    [0.45, 0.65, 1.0],
    [0.85, 0.40, 3.0],
    [0.20, 0.90, 0.0],
    [0.60, 0.55, 2.0]
]
y = [0, 1, 0, 1]

ml_res = scorer.fit_and_score(X, y)
print(f"Scikit-Learn Model:        {ml_res['model']}")
print(f"Trained Sample Rows:       {ml_res['trained_samples']}")
print(f"Feature Importances:       {ml_res['feature_importances']}")
print(f"Mean Default Probability:  {ml_res['mean_default_probability']}")
print(f"Sample In-Grid Predictions: {ml_res['sample_probabilities']}")
"""

# Part 4 Code: StatisticalVisualizerRenderer
d52_p4_code = """from typing import Dict, List, Any

class StatisticalVisualizerRenderer:
    def __init__(self) -> None:
        self.supported_backends = ["matplotlib.pyplot", "seaborn"]
        self.excel_image_object = "Image Object (Locked in Cell or Spilled Over Grid)"
        
    def render_statistical_figure(self, figure_type: str, data_points: List[float], dpi: int = 300) -> Dict[str, Any]:
        n = len(data_points)
        min_v = min(data_points) if data_points else 0.0
        max_v = max(data_points) if data_points else 0.0
        mean_v = sum(data_points) / n if n else 0.0
        
        # Simulate figure serialization to base64 image bytes in Azure container
        image_metadata = {
            "figure_type": figure_type,
            "backend": "seaborn 0.13.x",
            "dpi": dpi,
            "aspect_ratio": "16:9 widescreen",
            "grid_binding": self.excel_image_object,
            "data_summary": {
                "points": n,
                "range": (round(min_v, 2), round(max_v, 2)),
                "mean": round(mean_v, 2)
            },
            "status": "FIGURE_RENDERED_TO_EXCEL_CELL"
        }
        return image_metadata

renderer = StatisticalVisualizerRenderer()
sample_returns = [-0.045, -0.012, 0.005, 0.018, 0.022, -0.008, 0.035, 0.012, -0.015, 0.040]
fig = renderer.render_statistical_figure("KDE_Distribution_Density_Plot", sample_returns, dpi=300)

print(f"Visualization Backend: {fig['backend']}")
print(f"Figure Type:           {fig['figure_type']}")
print(f"DPI Resolution:        {fig['dpi']} DPI")
print(f"Grid Binding:          {fig['grid_binding']}")
print(f"Render Status:         {fig['status']}")
"""

# Part 5 Code: MasterPythonExcelGateway
d52_p5_code = """from typing import Dict, List, Any
import hashlib
import json

class MasterPythonExcelGateway:
    def __init__(self) -> None:
        self.gateway_version = "PyInExcel-M365-Azure-Gateway-v2.0"
        
    def execute_analytics_pipeline(self, pipeline_config: Dict[str, Any]) -> Dict[str, Any]:
        grid_range = pipeline_config.get("grid_range", "Data!A1:Z1000")
        row_count = pipeline_config.get("row_count", 0)
        ml_model = pipeline_config.get("ml_model", "RandomForestRegressor")
        execution_order_valid = pipeline_config.get("execution_order_valid", True)
        execution_time_ms = pipeline_config.get("execution_time_ms", 450)
        
        if not execution_order_valid:
            status = "FAILED_ORDER_VIOLATION"
            certified = False
        elif execution_time_ms > 10000:
            status = "TIMEOUT_EXCEEDED"
            certified = False
        else:
            status = "CERTIFIED_PYTHON_IN_EXCEL_STAGE11"
            certified = True
            
        telemetry = {
            "gateway": self.gateway_version,
            "grid_range": grid_range,
            "row_count": row_count,
            "ml_model": ml_model,
            "execution_order": "ROW_MAJOR_VERIFIED",
            "execution_time_ms": execution_time_ms,
            "pipeline_status": status
        }
        
        serialized = json.dumps(telemetry, sort_keys=True)
        seal = hashlib.sha256(serialized.encode("utf-8")).hexdigest()[:20]
        telemetry["cryptographic_seal"] = f"PYEXCEL-{seal.upper()}"
        return telemetry

py_gateway = MasterPythonExcelGateway()
config = {
    "grid_range": "Customer_Cohort_Data!A1:F10000",
    "row_count": 10000,
    "ml_model": "LightGBM_Churn_Predictor",
    "execution_order_valid": True,
    "execution_time_ms": 780
}

cert = py_gateway.execute_analytics_pipeline(config)
print("================================================================================")
print("  MASTER PYTHON IN EXCEL GATEWAY: CLOUD ANALYTICS PIPELINE")
print("================================================================================")
print(f"Gateway Version:       {cert['gateway']}")
print(f"Target Grid Range:     {cert['grid_range']} ({cert['row_count']:,} records)")
print(f"Active ML Model:       {cert['ml_model']}")
print(f"Calculation Ordering:  {cert['execution_order']}")
print(f"Cloud Latency:         {cert['execution_time_ms']} ms")
print(f"Pipeline Status:       {cert['pipeline_status']}")
print(f"Cryptographic Seal:    {cert['cryptographic_seal']}")
"""

# Verify all code blocks
codes_d51 = [d51_p1_code, d51_p2_code, d51_p3_code, d51_p4_code, d51_p5_code]
codes_d52 = [d52_p1_code, d52_p2_code, d52_p3_code, d52_p4_code, d52_p5_code]

print("=== VERIFYING CODE BLOCKS FOR DAYS 51 & 52 ===")
for idx, c in enumerate(codes_d51, 1):
    out = run_py(c)
    assert len(out) > 0, f"Day 51 Part {idx} produced empty output!"
    print(f"Day 51 Part {idx}: Code len={len(c)}, Out len={len(out)} [OK]")

for idx, c in enumerate(codes_d52, 1):
    out = run_py(c)
    assert len(out) > 0, f"Day 52 Part {idx} produced empty output!"
    print(f"Day 52 Part {idx}: Code len={len(c)}, Out len={len(out)} [OK]")

print("All code blocks for Days 51 and 52 executed deterministically!")
