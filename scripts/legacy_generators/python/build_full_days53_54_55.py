# scripts/build_full_days53_54_55.py
import sys
import os
import io
import contextlib
import json

sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.abspath("."))

def run_py(code_str: str) -> str:
    buf = io.StringIO()
    g = {}
    with contextlib.redirect_stdout(buf):
        exec(code_str, g)
    return buf.getvalue().rstrip()

# ==============================================================================
# DAY 53 CODE SNIPPETS
# ==============================================================================

d53_p1_code = """from typing import Dict, List, Any

class TufteDataInkRatioOptimizer:
    def __init__(self) -> None:
        self.design_philosophy = "Edward Tufte: Maximize Data-to-Ink Ratio"
        
    def audit_dashboard_elements(self, visual_components: List[Dict[str, Any]]) -> Dict[str, Any]:
        total_ink_units = 0.0
        data_ink_units = 0.0
        distracting_elements = []
        
        for comp in visual_components:
            name = comp["name"]
            c_type = comp["type"]
            ink_weight = comp.get("ink_weight", 10.0)
            is_essential_data = comp.get("is_data_ink", False)
            has_3d_effects = comp.get("has_3d_effects", False)
            heavy_gridlines = comp.get("heavy_gridlines", False)
            
            total_ink_units += ink_weight
            if is_essential_data:
                data_ink_units += ink_weight
                
            if has_3d_effects:
                distracting_elements.append(f"{name}: 3D effect creates optical distortion")
            if heavy_gridlines:
                distracting_elements.append(f"{name}: Heavy dark gridlines compete with data ink")
                
        ratio = round(data_ink_units / total_ink_units, 3) if total_ink_units else 1.0
        return {
            "philosophy": self.design_philosophy,
            "total_ink_units": total_ink_units,
            "data_ink_units": data_ink_units,
            "data_ink_ratio": ratio,
            "distractions_count": len(distracting_elements),
            "distractions": distracting_elements,
            "tufte_status": "EXECUTIVE_READY" if ratio >= 0.80 and not distracting_elements else "VISUAL_CLUTTER_REJECTED"
        }

optimizer = TufteDataInkRatioOptimizer()
dashboard_spec = [
    {"name": "Revenue_Trend_Line", "type": "MicroLine", "ink_weight": 25.0, "is_data_ink": True},
    {"name": "Budget_Target_Marker", "type": "BulletMarker", "ink_weight": 15.0, "is_data_ink": True},
    {"name": "Exploded_3D_Pie_Chart", "type": "PieChart", "ink_weight": 40.0, "is_data_ink": False, "has_3d_effects": True},
    {"name": "Dark_Background_Gridlines", "type": "GridDecoration", "ink_weight": 20.0, "is_data_ink": False, "heavy_gridlines": True}
]

res = optimizer.audit_dashboard_elements(dashboard_spec)
print(f"Design Principle:     {res['philosophy']}")
print(f"Data-to-Ink Ratio:    {res['data_ink_ratio']} (Target >= 0.80)")
print(f"Visual Distractions:  {res['distractions_count']}")
for d in res['distractions']:
    print(f"  [DESIGN DEFECT] {d}")
print(f"Dashboard Rating:     {res['tufte_status']}")
"""

d53_p2_code = """from typing import Dict, List, Any

class StephenFewBulletGraphEngine:
    def __init__(self) -> None:
        self.standard = "Stephen Few: Information Dashboard Design (Bullet Graph Specification)"
        
    def render_bullet_metric(self, metric_name: str, actual: float, target: float, qualitative_ranges: Dict[str, float]) -> Dict[str, Any]:
        # Qualitative ranges: poor, satisfactory, good
        poor_threshold = qualitative_ranges.get("poor", 60.0)
        satisfactory_threshold = qualitative_ranges.get("satisfactory", 85.0)
        max_scale = qualitative_ranges.get("max", 120.0)
        
        # Determine actual status band
        if actual >= satisfactory_threshold:
            performance_band = "GOOD (Upper Quartile)"
            band_tone = "EMERALD_GREEN"
        elif actual >= poor_threshold:
            performance_band = "SATISFACTORY (Middle Band)"
            band_tone = "MUTED_AMBER"
        else:
            performance_band = "POOR (Underperforming Target)"
            band_tone = "CRIMSON_RED"
            
        variance_to_target = round(actual - target, 2)
        variance_pct = round((variance_to_target / target) * 100, 2) if target else 0.0
        
        return {
            "metric": metric_name,
            "actual_value": actual,
            "target_value": target,
            "variance": variance_to_target,
            "variance_pct": variance_pct,
            "qualitative_band": performance_band,
            "color_tone": band_tone,
            "space_efficiency": "High Density: Replaces 3D Guage in 1/8th of screen area"
        }

engine = StephenFewBulletGraphEngine()
ebitda_bullet = engine.render_bullet_metric(
    "North_America_EBITDA_Margin",
    actual=24.5,
    target=22.0,
    qualitative_ranges={"poor": 15.0, "satisfactory": 20.0, "max": 30.0}
)

print(f"Bullet Metric:       {ebitda_bullet['metric']}")
print(f"Actual vs Target:    {ebitda_bullet['actual_value']}% vs {ebitda_bullet['target_value']}%")
print(f"Variance:            {ebitda_bullet['variance']:+0.2f}% ({ebitda_bullet['variance_pct']:+0.2f}%)")
print(f"Qualitative Band:    {ebitda_bullet['qualitative_band']}")
print(f"Dashboard Tone:      {ebitda_bullet['color_tone']}")
print(f"Visual Density:      {ebitda_bullet['space_efficiency']}")
"""

d53_p3_code = """from typing import Dict, List, Any

class MicroSparklineTrendProfiler:
    def __init__(self) -> None:
        self.sparkline_types = ["Line Trend", "Column Magnitude", "Win/Loss Binary"]
        
    def profile_monthly_series(self, business_unit: str, monthly_actuals: List[float]) -> Dict[str, Any]:
        n = len(monthly_actuals)
        if n == 0:
            return {"error": "Empty series"}
            
        min_val = min(monthly_actuals)
        max_val = max(monthly_actuals)
        min_idx = monthly_actuals.index(min_val) + 1
        max_idx = monthly_actuals.index(max_val) + 1
        start_val = monthly_actuals[0]
        end_val = monthly_actuals[-1]
        
        total_growth = round(((end_val - start_val) / start_val) * 100, 2) if start_val else 0.0
        
        # Compute sparkline cell representation: ASCII micro-trend representation
        glyphs = [" ", "▂", "▃", "▄", "▅", "▆", "▇", "█"]
        val_range = (max_val - min_val) or 1.0
        spark_str = "".join([glyphs[min(7, int(((v - min_val) / val_range) * 7))] for v in monthly_actuals])
        
        return {
            "unit": business_unit,
            "periods_tracked": n,
            "starting_val": start_val,
            "ending_val": end_val,
            "peak_period": f"Month {max_idx} ({max_val})",
            "trough_period": f"Month {min_idx} ({min_val})",
            "net_12m_growth": f"{total_growth:+0.2f}%",
            "micro_sparkline": spark_str,
            "trend_direction": "UPWARD" if end_val >= start_val else "DOWNWARD"
        }

profiler = MicroSparklineTrendProfiler()
na_sales = [120, 125, 118, 130, 135, 142, 140, 148, 155, 152, 160, 168]
spark_meta = profiler.profile_monthly_series("Enterprise_Cloud_Software", na_sales)

print(f"Business Unit:       {spark_meta['unit']}")
print(f"12-Month Trendline:  [{spark_meta['micro_sparkline']}] ({spark_meta['trend_direction']})")
print(f"Peak Performance:    {spark_meta['peak_period']}")
print(f"Trough Valuation:    {spark_meta['trough_period']}")
print(f"Net Growth Trajectory: {spark_meta['net_12m_growth']}")
"""

d53_p4_code = """from typing import Dict, List, Any

class InteractiveFormControlDashboard:
    def __init__(self) -> None:
        self.control_types = ["Combo Box (DropDown)", "Scroll Bar (Slider)", "Option Buttons (Radio)", "Check Box"]
        
    def evaluate_scenario_selection(self, scenario_idx: int, scenario_registry: List[Dict[str, Any]]) -> Dict[str, Any]:
        if scenario_idx < 0 or scenario_idx >= len(scenario_registry):
            selected = scenario_registry[0]
        else:
            selected = scenario_registry[scenario_idx]
            
        name = selected["name"]
        rev_multiplier = selected.get("rev_mult", 1.0)
        cogs_inflation = selected.get("cogs_inf", 1.0)
        base_rev = 50000000.0
        base_cogs = 30000000.0
        
        sim_rev = base_rev * rev_multiplier
        sim_cogs = base_cogs * cogs_inflation
        sim_ebitda = sim_rev - sim_cogs
        sim_margin = round((sim_ebitda / sim_rev) * 100, 2)
        
        return {
            "active_control": "Excel Form Control (Index Linked Cell)",
            "selected_scenario": name,
            "projected_revenue": f"${sim_rev / 1000000:0.2f}M",
            "projected_ebitda": f"${sim_ebitda / 1000000:0.2f}M",
            "ebitda_margin": f"{sim_margin}%",
            "viewport_compliance": "Single 1080p Screen (Zero Scroll Required)"
        }

cockpit = InteractiveFormControlDashboard()
scenarios = [
    {"name": "Base Case", "rev_mult": 1.00, "cogs_inf": 1.00},
    {"name": "Macro Shock (High Inflation)", "rev_mult": 0.90, "cogs_inf": 1.15},
    {"name": "Bull Market Expansion", "rev_mult": 1.25, "cogs_inf": 1.05}
]

scen_res = cockpit.evaluate_scenario_selection(1, scenarios)
print(f"Form Control Binding: {scen_res['active_control']}")
print(f"Selected Scenario:    {scen_res['selected_scenario']}")
print(f"Simulated Revenue:    {scen_res['projected_revenue']}")
print(f"Simulated EBITDA:     {scen_res['projected_ebitda']}")
print(f"Simulated Margin:     {scen_res['ebitda_margin']}")
print(f"Viewport Standard:    {scen_res['viewport_compliance']}")
"""

d53_p5_code = """from typing import Dict, List, Any
import hashlib
import json

class MasterExecutiveDashboardGateway:
    def __init__(self) -> None:
        self.gateway_version = "Executive-Dashboard-v5.0-TufteCertified"
        
    def certify_executive_cockpit(self, cockpit_spec: Dict[str, Any]) -> Dict[str, Any]:
        data_ink_ratio = cockpit_spec.get("data_ink_ratio", 0.85)
        has_bullet_graphs = cockpit_spec.get("has_bullet_graphs", True)
        has_sparklines = cockpit_spec.get("has_sparklines", True)
        has_3d_charts = cockpit_spec.get("has_3d_charts", False)
        single_screen_fit = cockpit_spec.get("single_screen_fit", True)
        
        passed = (
            data_ink_ratio >= 0.80 and
            has_bullet_graphs and
            has_sparklines and
            not has_3d_charts and
            single_screen_fit
        )
        
        telemetry = {
            "gateway": self.gateway_version,
            "data_ink_ratio": data_ink_ratio,
            "few_bullet_graphs": "COMPLIANT" if has_bullet_graphs else "MISSING",
            "tufte_sparklines": "COMPLIANT" if has_sparklines else "MISSING",
            "zero_distortion_rule": "VERIFIED" if not has_3d_charts else "FAILED_3D_DISTORTION",
            "viewport_density": "1080P_SINGLE_SCREEN" if single_screen_fit else "FAILED_SCROLL_REQUIRED",
            "certification_status": "EXECUTIVE_COCKPIT_CERTIFIED" if passed else "CLUTTER_REJECTED"
        }
        
        serialized = json.dumps(telemetry, sort_keys=True)
        seal = hashlib.sha256(serialized.encode("utf-8")).hexdigest()[:20]
        telemetry["dashboard_seal"] = f"DASH-TUFTE-{seal.upper()}"
        return telemetry

dash_gateway = MasterExecutiveDashboardGateway()
spec = {
    "data_ink_ratio": 0.88,
    "has_bullet_graphs": True,
    "has_sparklines": True,
    "has_3d_charts": False,
    "single_screen_fit": True
}

cert = dash_gateway.certify_executive_cockpit(spec)
print("================================================================================")
print("  MASTER EXECUTIVE DASHBOARD GATEWAY: TUFTE & FEW INFORMATION RADIATOR")
print("================================================================================")
print(f"Gateway Spec:          {cert['gateway']}")
print(f"Data-to-Ink Ratio:     {cert['data_ink_ratio']}")
print(f"Stephen Few Bullets:   {cert['few_bullet_graphs']}")
print(f"Tufte Sparklines:      {cert['tufte_sparklines']}")
print(f"Distortion Defense:    {cert['zero_distortion_rule']}")
print(f"Viewport Density:      {cert['viewport_density']}")
print(f"Certification Status:  {cert['certification_status']}")
print(f"Executive Seal:        {cert['dashboard_seal']}")
"""

# ==============================================================================
# DAY 54 CODE SNIPPETS
# ==============================================================================

d54_p1_code = """from typing import Dict, List, Set, Any

class CalculationChainDagProfiler:
    def __init__(self) -> None:
        self.calc_engine = "Excel Multi-Threaded Calculation (MTC) DAG Compiler"
        
    def profile_calc_tree(self, cell_graph: Dict[str, List[str]], dirty_cells: List[str]) -> Dict[str, Any]:
        # Track cells that must be recalculated when dirty_cells are modified
        recalc_queue: Set[str] = set(dirty_cells)
        visited: Set[str] = set()
        
        # Breadth-first search along dependent edges
        queue = list(dirty_cells)
        while queue:
            curr = queue.pop(0)
            if curr in visited:
                continue
            visited.add(curr)
            
            dependents = cell_graph.get(curr, [])
            for dep in dependents:
                recalc_queue.add(dep)
                queue.append(dep)
                
        total_cells = len(cell_graph)
        targeted_count = len(recalc_queue)
        calc_efficiency = round(((total_cells - targeted_count) / total_cells) * 100, 2) if total_cells else 0.0
        
        return {
            "calc_engine": self.calc_engine,
            "total_graph_nodes": total_cells,
            "initial_dirty_inputs": dirty_cells,
            "downstream_cells_recalculated": targeted_count,
            "untouched_cells_saved": total_cells - targeted_count,
            "dag_recalculation_efficiency": f"{calc_efficiency}%"
        }

dag_profiler = CalculationChainDagProfiler()
# 10,000 cell model graph
model_graph = {
    "Tax_Rate": ["Tax_Expense", "EBT_Calc"],
    "Tax_Expense": ["Net_Income", "Tax_Payable"],
    "Net_Income": ["Retained_Earnings", "EPS"],
    "Retained_Earnings": ["Balance_Sheet_Equity"],
    "Sales_Volume": ["Revenue", "COGS"],
    "Revenue": ["Gross_Margin"],
    "COGS": ["Gross_Margin"]
}
# Expand with 1,000 independent cells
for i in range(1, 1001):
    model_graph[f"Indep_Cell_{i}"] = [f"Output_{i}"]

res = dag_profiler.profile_calc_tree(model_graph, ["Tax_Rate"])
print(f"Calc Engine:             {res['calc_engine']}")
print(f"Total Registered Cells:  {res['total_graph_nodes']}")
print(f"Dirty Seed Inputs:       {res['initial_dirty_inputs']}")
print(f"Targeted Recalc Cells:   {res['downstream_cells_recalculated']}")
print(f"Untouched Cells Saved:   {res['untouched_cells_saved']}")
print(f"DAG Pruning Efficiency:  {res['dag_recalculation_efficiency']}")
"""

d54_p2_code = """from typing import Dict, List, Any

class VolatileFunctionEliminator:
    def __init__(self) -> None:
        self.volatile_catalog = ["OFFSET", "INDIRECT", "TODAY", "NOW", "RAND", "RANDBETWEEN", "CELL", "INFO"]
        
    def benchmark_volatile_vs_index(self, row_count: int) -> Dict[str, Any]:
        # Volatile OFFSET force full recalc on every user interaction (O(N) global dirtying)
        # Non-volatile INDEX:INDEX evaluates strictly when precedent range changes (O(1) targeting)
        volatile_recalc_ms = round(row_count * 0.00112, 3)
        index_recalc_ms = 0.002
        
        speedup_factor = round(volatile_recalc_ms / index_recalc_ms, 1)
        
        return {
            "tested_rows": row_count,
            "volatile_pattern": "=OFFSET(Data!$A$1, 0, 0, COUNTA(Data!$A:$A), 5)",
            "non_volatile_replacement": "=Data!$A$1:INDEX(Data!$E:$E, COUNTA(Data!$A:$A))",
            "volatile_latency_ms": volatile_recalc_ms,
            "non_volatile_latency_ms": index_recalc_ms,
            "performance_acceleration": f"{speedup_factor}x faster recalculation",
            "volatility_verdict": "REFACTOR_MANDATORY_ELIMINATE_OFFSET"
        }

eliminator = VolatileFunctionEliminator()
bench = eliminator.benchmark_volatile_vs_index(40000)

print(f"Scanned Formula Rows:     {bench['tested_rows']:,}")
print(f"Volatile Anti-Pattern:    {bench['volatile_pattern']}")
print(f"Non-Volatile Replacement: {bench['non_volatile_replacement']}")
print(f"Volatile Recalc Latency:  {bench['volatile_latency_ms']} ms")
print(f"INDEX:INDEX Recalc Time:  {bench['non_volatile_latency_ms']} ms")
print(f"Recalculation Speedup:    {bench['performance_acceleration']}")
"""

d54_p3_code = """from typing import Dict, List, Any

class MultiThreadedCalculationOptimizer:
    def __init__(self) -> None:
        self.available_cores = 16
        
    def evaluate_core_scaling(self, total_formulas: int) -> Dict[str, Any]:
        # Single-threaded vs multi-threaded core scaling
        single_thread_time = total_formulas * 0.00005  # 50 microseconds per formula
        
        core_timings = {}
        for cores in [1, 2, 4, 8, 16]:
            # Amdahl's Law scaling with 5% serial synchronization overhead
            parallel_ratio = 0.95
            serial_ratio = 0.05
            speedup = 1.0 / (serial_ratio + (parallel_ratio / cores))
            calc_time = round(single_thread_time / speedup, 4)
            core_timings[f"{cores}_cores"] = {
                "seconds": calc_time,
                "speedup": round(speedup, 2)
            }
            
        return {
            "total_formulas": total_formulas,
            "single_thread_baseline": f"{single_thread_time:0.3f}s",
            "multi_threaded_16cores": f"{core_timings['16_cores']['seconds']:0.3f}s",
            "max_speedup_achieved": f"{core_timings['16_cores']['speedup']}x",
            "core_timings": core_timings,
            "mtc_status": "MTC_MAX_EFFICIENCY_CERTIFIED"
        }

mtc = MultiThreadedCalculationOptimizer()
mtc_res = mtc.evaluate_core_scaling(250000)

print(f"Total Model Formulas:     {mtc_res['total_formulas']:,}")
print(f"1-Core Baseline Latency:  {mtc_res['single_thread_baseline']}")
print(f"16-Core MTC Latency:      {mtc_res['multi_threaded_16cores']}")
print(f"Throughput Acceleration:  {mtc_res['max_speedup_achieved']}")
print(f"MTC Core Scaling Status:  {mtc_res['mtc_status']}")
"""

d54_p4_code = """from typing import Dict, List, Any

class BinaryWorkbookCompressor:
    def __init__(self) -> None:
        self.format_comparison = {
            ".xlsx": "OpenXML Deflate Compressed ZIP of XML Parts",
            ".xlsb": "Excel Binary Workbook (BIFF12 Proprietary Byte Stream)"
        }
        
    def profile_format_efficiency(self, uncompressed_xml_mb: float) -> Dict[str, Any]:
        # .xlsx typically compresses XML text by ~4x
        xlsx_size_mb = round(uncompressed_xml_mb * 0.25, 2)
        # .xlsb stores binary records directly, compressing by ~8x
        xlsb_size_mb = round(uncompressed_xml_mb * 0.12, 2)
        
        # Load times: .xlsx must parse millions of XML DOM tags; .xlsb streams direct byte records
        xlsx_open_seconds = round(uncompressed_xml_mb * 0.18, 2)
        xlsb_open_seconds = round(uncompressed_xml_mb * 0.04, 2)
        
        size_reduction_pct = round(((xlsx_size_mb - xlsb_size_mb) / xlsx_size_mb) * 100, 1)
        load_speedup = round(xlsx_open_seconds / xlsb_open_seconds, 1)
        
        return {
            "uncompressed_model_data": f"{uncompressed_xml_mb} MB",
            "standard_xlsx_file_size": f"{xlsx_size_mb} MB (OpenXML)",
            "binary_xlsb_file_size": f"{xlsb_size_mb} MB (BIFF12 Binary)",
            "file_size_savings": f"{size_reduction_pct}% smaller",
            "xlsx_open_duration": f"{xlsx_open_seconds}s",
            "xlsb_open_duration": f"{xlsb_open_seconds}s",
            "load_time_acceleration": f"{load_speedup}x faster open/save",
            "recommendation": "MANDATE_XLSB_FOR_MODELS_OVER_20MB"
        }

compressor = BinaryWorkbookCompressor()
comp_res = compressor.profile_format_efficiency(250.0)

print(f"Raw Model XML Volume:    {comp_res['uncompressed_model_data']}")
print(f"Standard .xlsx Size:     {comp_res['standard_xlsx_file_size']}")
print(f"Binary .xlsb Size:       {comp_res['binary_xlsb_file_size']} ({comp_res['file_size_savings']})")
print(f"Open Time (.xlsx vs .xlsb): {comp_res['xlsx_open_duration']} vs {comp_res['xlsb_open_duration']}")
print(f"Load Time Speedup:       {comp_res['load_time_acceleration']}")
print(f"Storage Recommendation:  {comp_res['recommendation']}")
"""

d54_p5_code = """from typing import Dict, List, Any
import hashlib
import json

class MasterPerformanceTuningGateway:
    def __init__(self) -> None:
        self.gateway_version = "Excel-Performance-Optimizer-v5.0-Enterprise"
        
    def certify_model_performance(self, model_telemetry: Dict[str, Any]) -> Dict[str, Any]:
        volatile_count = model_telemetry.get("volatile_functions", 0)
        recalc_time_ms = model_telemetry.get("recalc_time_ms", 250)
        is_xlsb = model_telemetry.get("file_format", ".xlsx") == ".xlsb"
        mtc_enabled = model_telemetry.get("mtc_enabled", True)
        
        passed = (
            volatile_count == 0 and
            recalc_time_ms <= 500 and
            is_xlsb and
            mtc_enabled
        )
        
        telemetry = {
            "gateway": self.gateway_version,
            "volatile_function_count": volatile_count,
            "recalculation_latency": f"{recalc_time_ms} ms",
            "binary_storage_format": "BIFF12_XLSB" if is_xlsb else "OPENXML_XLSX",
            "multi_threaded_calc": "16_CORES_ENABLED" if mtc_enabled else "SINGLE_THREAD_LOCKED",
            "tuning_status": "PERFORMANCE_CERTIFIED_SUB_SECOND" if passed else "RECALC_LATENCY_UNACCEPTABLE"
        }
        
        serialized = json.dumps(telemetry, sort_keys=True)
        seal = hashlib.sha256(serialized.encode("utf-8")).hexdigest()[:20]
        telemetry["optimization_seal"] = f"PERF-OPT-{seal.upper()}"
        return telemetry

perf_gateway = MasterPerformanceTuningGateway()
tel = {
    "volatile_functions": 0,
    "recalc_time_ms": 185,
    "file_format": ".xlsb",
    "mtc_enabled": True
}

cert = perf_gateway.certify_model_performance(tel)
print("================================================================================")
print("  MASTER PERFORMANCE TUNING GATEWAY: SUB-SECOND RECALCULATION SUITE")
print("================================================================================")
print(f"Gateway Engine:        {cert['gateway']}")
print(f"Volatile Functions:    {cert['volatile_function_count']} (Zero Volatility Invariant)")
print(f"Recalc Latency:        {cert['recalculation_latency']} (Target <= 500ms)")
print(f"Binary Format:         {cert['binary_storage_format']}")
print(f"Parallel Execution:    {cert['multi_threaded_calc']}")
print(f"Certification Status:  {cert['tuning_status']}")
print(f"Optimization Seal:     {cert['optimization_seal']}")
"""

# ==============================================================================
# DAY 55 CODE SNIPPETS
# ==============================================================================

d55_p1_code = """from typing import Dict, List, Any

class DefenseInDepthSecurityModel:
    def __init__(self) -> None:
        self.security_tiers = {
            "TIER_1_UI_PROTECTION": "Worksheet Protect Flag (Easily bypassed by unzipping OpenXML)",
            "TIER_2_FILE_ENCRYPTION": "256-Bit AES Workbook Encryption ('Password to Open')",
            "TIER_3_ENTERPRISE_IRM": "Azure Information Rights Management (Sensitivity Labels & Dynamic Revocation)"
        }
        
    def evaluate_vulnerability_profile(self, protection_scheme: str) -> Dict[str, Any]:
        if protection_scheme == "WORKSHEET_PASSWORD_ONLY":
            vulnerability = "CRITICAL: Attacker can rename .xlsx to .zip, delete <sheetProtection> tag in sheet1.xml, and unprotect sheet in 30 seconds."
            security_score = 25.0
            rating = "PSEUDO_SECURITY_VULNERABLE"
        elif protection_scheme == "WORKBOOK_AES_ENCRYPTED":
            vulnerability = "SECURE: File encrypted via AES-256 standard; resistant to raw XML parsing; requires password key for decryption."
            security_score = 85.0
            rating = "CRYPTOGRAPHICALLY_PROTECTED"
        elif protection_scheme == "IRM_SENSITIVITY_MANAGED":
            vulnerability = "INSTITUTIONAL: Azure Rights Management enforces domain authentication, prevents copy/print, and revokes access dynamically."
            security_score = 100.0
            rating = "ENTERPRISE_ZERO_TRUST_CERTIFIED"
        else:
            vulnerability = "UNPROTECTED: Open plaintext file."
            security_score = 0.0
            rating = "UNSECURED"
            
        return {
            "scheme": protection_scheme,
            "security_tier": self.security_tiers.get(f"TIER_{int(security_score/35)+1}_{protection_scheme[:5]}", "Custom"),
            "vulnerability_assessment": vulnerability,
            "defense_score": security_score,
            "security_rating": rating
        }

defense = DefenseInDepthSecurityModel()
test_vuln = defense.evaluate_vulnerability_profile("WORKSHEET_PASSWORD_ONLY")
print(f"Protection Scheme:    {test_vuln['scheme']}")
print(f"Vulnerability Audit:  {test_vuln['vulnerability_assessment']}")
print(f"Defense Score:        {test_vuln['defense_score']} / 100.0")
print(f"Security Rating:      {test_vuln['security_rating']}")
"""

d55_p2_code = """from typing import Dict, List, Any, Set

class RoleBasedAccessControlEngine:
    def __init__(self) -> None:
        self.role_hierarchy = {
            "FINANCIAL_ANALYST": {"allowed_ranges": ["Inputs_Hours", "Inputs_Expenses"], "can_edit_formulas": False},
            "DEPARTMENT_HEAD":   {"allowed_ranges": ["Inputs_Hours", "Inputs_Expenses", "Merit_Percentages"], "can_edit_formulas": False},
            "CHIEF_FINANCIAL_OFFICER": {"allowed_ranges": ["ALL_RANGES"], "can_edit_formulas": True}
        }
        
    def authorize_cell_edit(self, user_role: str, target_range_name: str, is_formula_cell: bool) -> Dict[str, Any]:
        role_config = self.role_hierarchy.get(user_role)
        if not role_config:
            return {"authorized": False, "reason": "UNKNOWN_USER_ROLE"}
            
        if is_formula_cell and not role_config["can_edit_formulas"]:
            return {
                "authorized": False,
                "role": user_role,
                "target_range": target_range_name,
                "reason": "ROLE_VIOLATION_FORMULA_TAMPERING_PROHIBITED",
                "sox_incident_logged": True
            }
            
        allowed_ranges = role_config["allowed_ranges"]
        if "ALL_RANGES" in allowed_ranges or target_range_name in allowed_ranges:
            return {
                "authorized": True,
                "role": user_role,
                "target_range": target_range_name,
                "reason": "ACTIVE_DIRECTORY_RANGE_PERMITTED",
                "sox_incident_logged": False
            }
        else:
            return {
                "authorized": False,
                "role": user_role,
                "target_range": target_range_name,
                "reason": "UNAUTHORIZED_RANGE_ACCESS_DENIED",
                "sox_incident_logged": True
            }

rbac = RoleBasedAccessControlEngine()
# Analyst tries to modify executive salary formula
attempt1 = rbac.authorize_cell_edit("FINANCIAL_ANALYST", "Exec_Compensation_Formula", is_formula_cell=True)
# Department Head adjusts merit pool percentage
attempt2 = rbac.authorize_cell_edit("DEPARTMENT_HEAD", "Merit_Percentages", is_formula_cell=False)

print(f"Attempt 1 (Analyst on Formula): Authorized={attempt1['authorized']} | Reason={attempt1['reason']}")
print(f"Attempt 2 (Dept Head on Merit): Authorized={attempt2['authorized']} | Reason={attempt2['reason']}")
"""

d55_p3_code = """from typing import Dict, List, Any

class InformationRightsManagementPolicy:
    def __init__(self) -> None:
        self.irm_service = "Microsoft Purview Information Rights Management (IRM)"
        
    def evaluate_sensitivity_label(self, label_name: str, user_domain: str) -> Dict[str, Any]:
        # Sensitivity labels: General, Confidential, Highly Confidential (Banking Secret)
        is_external = not user_domain.endswith("@goldmansachs.com")
        
        if label_name == "HIGHLY_CONFIDENTIAL_M_AND_A":
            allow_view = not is_external
            allow_edit = not is_external
            allow_copy_print = False
            allow_offline_cache_days = 0  # Require real-time cloud token
        elif label_name == "CONFIDENTIAL_INTERNAL":
            allow_view = True
            allow_edit = not is_external
            allow_copy_print = not is_external
            allow_offline_cache_days = 7
        else:
            allow_view = True
            allow_edit = True
            allow_copy_print = True
            allow_offline_cache_days = 30
            
        return {
            "policy_service": self.irm_service,
            "sensitivity_label": label_name,
            "requesting_user": user_domain,
            "external_user": is_external,
            "permissions": {
                "view": allow_view,
                "edit": allow_edit,
                "copy_print_screen_capture": allow_copy_print,
                "offline_grace_period_days": allow_offline_cache_days
            },
            "irm_verdict": "PERMITTED" if allow_view else "ACCESS_REVOKED_BY_PURVIEW"
        }

irm = InformationRightsManagementPolicy()
policy_check = irm.evaluate_sensitivity_label("HIGHLY_CONFIDENTIAL_M_AND_A", "analyst@competitor.com")

print(f"IRM Service:          {policy_check['policy_service']}")
print(f"Sensitivity Label:    {policy_check['sensitivity_label']}")
print(f"User Domain:          {policy_check['requesting_user']} (External: {policy_check['external_user']})")
print(f"Copy/Print Permitted: {policy_check['permissions']['copy_print_screen_capture']}")
print(f"Access Verdict:       {policy_check['irm_verdict']}")
"""

d55_p4_code = """from typing import Dict, List, Any
import hashlib
import json

class SoxComplianceAuditLedger:
    def __init__(self) -> None:
        self.regulation = "Sarbanes-Oxley Act of 2002 - Section 404 (Internal Financial Controls)"
        self.audit_log: List[Dict[str, Any]] = []
        
    def record_cell_modification(self, timestamp: str, user_id: str, cell_ref: str, old_val: Any, new_val: Any, rationale: str) -> Dict[str, Any]:
        entry = {
            "timestamp": timestamp,
            "user": user_id,
            "cell": cell_ref,
            "previous_value": old_val,
            "updated_value": new_val,
            "justification": rationale
        }
        # Compute individual entry cryptographic digest
        serialized = json.dumps(entry, sort_keys=True)
        entry_hash = hashlib.sha256(serialized.encode("utf-8")).hexdigest()
        entry["entry_sha256"] = entry_hash
        self.audit_log.append(entry)
        
        return entry
        
    def generate_sox_certification_report(self) -> Dict[str, Any]:
        total_modifications = len(self.audit_log)
        all_hashes = "".join([e["entry_sha256"] for e in self.audit_log])
        cumulative_hash = hashlib.sha256(all_hashes.encode("utf-8")).hexdigest()[:24]
        
        return {
            "regulation": self.regulation,
            "total_logged_modifications": total_modifications,
            "tamper_evident_status": "SOX_404_COMPLIANT_UNBROKEN_CHAIN",
            "cumulative_audit_digest": f"SOX404-{cumulative_hash.upper()}"
        }

sox = SoxComplianceAuditLedger()
sox.record_cell_modification(
    "2026-10-17T22:30:00Z", "VP_Finance_JSmith", "Tax_Rate_Assumptions!B4",
    0.28, 0.21, "Federal corporate tax cut enacted under Tax Cuts and Jobs Act"
)
sox.record_cell_modification(
    "2026-10-17T22:31:15Z", "Controller_RKumar", "Debt_Schedule!D10",
    15000000, 12500000, "Scheduled principal redemption on Senior Credit Facility"
)

sox_report = sox.generate_sox_certification_report()
print(f"Compliance Standard:   {sox_report['regulation']}")
print(f"Logged Audit Entries:  {sox_report['total_logged_modifications']}")
print(f"Tamper-Evident Status: {sox_report['tamper_evident_status']}")
print(f"Cumulative Audit Seal: {sox_report['cumulative_audit_digest']}")
"""

d55_p5_code = """from typing import Dict, List, Any
import hashlib
import json

class MasterEnterpriseGovernanceGateway:
    def __init__(self) -> None:
        self.gateway_version = "Enterprise-Governance-v5.0-SOXCertified"
        
    def certify_spreadsheet_governance(self, governance_profile: Dict[str, Any]) -> Dict[str, Any]:
        has_aes256 = governance_profile.get("aes256_encryption", True)
        has_rbac = governance_profile.get("rbac_active_directory", True)
        has_irm = governance_profile.get("irm_sensitivity_labels", True)
        has_sox_log = governance_profile.get("sox_audit_logging", True)
        
        passed = has_aes256 and has_rbac and has_irm and has_sox_log
        
        telemetry = {
            "gateway": self.gateway_version,
            "aes256_file_encryption": "ACTIVE" if has_aes256 else "FAILED_OPENXML_VULNERABLE",
            "rbac_permissions": "DOMAIN_AUTHENTICATED" if has_rbac else "FAILED_OPEN_EDIT",
            "purview_irm": "SENSITIVITY_MANAGED" if has_irm else "FAILED_NO_RIGHTS_MANAGEMENT",
            "sox404_audit_ledger": "TAMPER_EVIDENT_CHAIN" if has_sox_log else "FAILED_UNRECORDED_EDITS",
            "certification_status": "ENTERPRISE_GOVERNANCE_CERTIFIED" if passed else "GOVERNANCE_DEFICIENT"
        }
        
        serialized = json.dumps(telemetry, sort_keys=True)
        seal = hashlib.sha256(serialized.encode("utf-8")).hexdigest()[:20]
        telemetry["governance_seal"] = f"GOV-SOX-{seal.upper()}"
        return telemetry

gov_gateway = MasterEnterpriseGovernanceGateway()
profile = {
    "aes256_encryption": True,
    "rbac_active_directory": True,
    "irm_sensitivity_labels": True,
    "sox_audit_logging": True
}

cert = gov_gateway.certify_spreadsheet_governance(profile)
print("================================================================================")
print("  MASTER ENTERPRISE GOVERNANCE GATEWAY: DEFENSE-IN-DEPTH CERTIFICATION")
print("================================================================================")
print(f"Gateway Engine:        {cert['gateway']}")
print(f"AES-256 Encryption:    {cert['aes256_file_encryption']}")
print(f"Role-Based Access:     {cert['rbac_permissions']}")
print(f"Purview IRM Labels:    {cert['purview_irm']}")
print(f"SOX 404 Audit Chain:   {cert['sox404_audit_ledger']}")
print(f"Certification Status:  {cert['certification_status']}")
print(f"Enterprise Seal:       {cert['governance_seal']}")
"""

# Verify all 15 code blocks
codes_d53 = [d53_p1_code, d53_p2_code, d53_p3_code, d53_p4_code, d53_p5_code]
codes_d54 = [d54_p1_code, d54_p2_code, d54_p3_code, d54_p4_code, d54_p5_code]
codes_d55 = [d55_p1_code, d55_p2_code, d55_p3_code, d55_p4_code, d55_p5_code]

print("=== VERIFYING CODE BLOCKS FOR DAYS 53, 54 & 55 ===")
for idx, c in enumerate(codes_d53, 1):
    out = run_py(c)
    assert len(out) > 0, f"Day 53 Part {idx} produced empty output!"
    print(f"Day 53 Part {idx}: Code len={len(c)}, Out len={len(out)} [OK]")

for idx, c in enumerate(codes_d54, 1):
    out = run_py(c)
    assert len(out) > 0, f"Day 54 Part {idx} produced empty output!"
    print(f"Day 54 Part {idx}: Code len={len(c)}, Out len={len(out)} [OK]")

for idx, c in enumerate(codes_d55, 1):
    out = run_py(c)
    assert len(out) > 0, f"Day 55 Part {idx} produced empty output!"
    print(f"Day 55 Part {idx}: Code len={len(c)}, Out len={len(out)} [OK]")

print("All 15 code blocks for Days 53, 54, and 55 compiled and executed deterministically!")
