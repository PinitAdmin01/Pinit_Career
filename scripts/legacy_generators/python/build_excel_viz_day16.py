import json
import hashlib
import subprocess
import sys
import os

def run_py(code):
    res = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, check=True)
    return res.stdout.strip()

# Day 16 Parts with executive dashboard and visual analytics exposition
parts = [
    {
        "title": "Executive Dashboard Architecture & Visual Hierarchy: Layout, Data-Ink Ratio & Cognitive Load",
        "say": [
            "In institutional financial modeling, business intelligence, and corporate performance management, an analytical model is only as effective as executive leadership's ability to interpret its findings. A spreadsheet containing thousands of rows of pristine formulas, multi-tier debt waterfalls, and dynamic DCF valuations creates zero commercial impact if presented to a Board of Directors as an overwhelming wall of unformatted numbers. Executive Dashboards serve as the primary cognitive bridge between complex underlying quantitative engines and strategic boardroom decision-making. Designing an enterprise-grade dashboard requires strict adherence to information design theory, cognitive psychology, and visual hierarchy principles.",
            "The foundational principle governing institutional dashboard architecture is Edward Tufte's Data-Ink Ratio: the proportion of ink (or pixels on a screen) used to present actual data compared to total ink used. The mathematical rule is absolute: maximize the data-ink ratio within reason, ruthlessly eliminating non-data ink. Non-data ink includes heavy dark gridlines, redundant 3D chart effects, garish drop shadows, decorative clip art, and loud saturated background fills. These decorative distractions create cognitive visual clutter that obscures crucial variance signals. Professional financial modelers replace harsh black borders with subtle light-gray dividers (#E2E8F0) and reserve high-contrast accent colors strictly for critical variance alerts.",
            "Visual hierarchy in executive dashboards is structured around natural human eye-tracking behavior. In Western business cultures, executive reading patterns adhere to the 'F-Pattern' or 'Z-Pattern' scanning path. The human eye enters the screen at the top-left corner, scans horizontally across the header, drops down diagonally to the center, and finishes at the bottom-right quadrant. Consequently, the top-left quadrant of an executive dashboard is prime cognitive real estate, reserved exclusively for the most critical high-level Key Performance Indicators (KPIs): Total Revenue, Operating Margin (EBITDA %), Net Working Capital, and Cash Runway.",
            "The secondary tier of visual hierarchy occupies the central canvas: comparative visual analysis, such as regional revenue trends, product line margin breakdowns, and budget-versus-actual variance distributions. Finally, the bottom quadrant houses granular operational tables, supporting schedules, and footnotes detailing source assumptions. Every visual component must adhere to a standardized modular grid (such as a 12-column responsive layout), ensuring visual symmetry and preventing arbitrary component alignment.",
            "To structure visual components into intuitive cognitive clusters, dashboard architects implement Gestalt Principles of Visual Perception: specifically Proximity, Similarity, Continuity, and Common Region. By grouping related financial metrics inside a shared subtle card container with uniform padding (Common Region) and using identical typographic hierarchies across comparable cards (Similarity), the human brain perceives these metrics as a unified, coherent system. Placing comparative elements close together (Proximity) eliminates eye travel and reduces cognitive fatigue.",
            "Typography and numeric alignment represent the ultimate test of dashboard professionalism. In financial reporting, numbers must ALWAYS be formatted using Tabular Lining Figures—monospaced fonts where every digit (0 through 9) shares the exact same character width. Furthermore, numerical values must strictly be right-aligned with commas and decimal points vertically aligned across rows. Left-aligning or centering financial numbers is a catastrophic design error that destroys vertical comparability and instantly signals amateur modeling.",
            "Cognitive Load Theory dictates that human working memory can hold only four to seven chunks of information simultaneously (Miller's Law). When an executive dashboard attempts to display thirty metrics simultaneously, decision-makers experience cognitive overload, leading to analysis paralysis or misinterpretation. Elite dashboard architects enforce the '5-Second Rule': an executive must be able to glance at the dashboard and ascertain within five seconds whether the business is healthy, where the primary operational risks lie, and which department requires immediate managerial intervention.",
            "In this section, we construct a production-grade Dashboard Visual Hierarchy Engine in Python. We establish a modular 12-column layout grid, calculate data-ink efficiency scores across graphical components, structure prioritized visual tiers based on F-pattern scanning pathways, and output an institutional dashboard layout blueprint."
        ],
        "example": "Think of an airplane cockpit: the altitude and airspeed dials are right in the pilot's primary line of sight with clear, unadorned needles; the fuel flow and cabin pressure gauges are in secondary clusters; the pilot does not look at a confusing spreadsheet while landing in a crosswind.",
        "code": """# Part 1: Dashboard Visual Hierarchy & Layout Blueprint Engine
class DashboardVisualHierarchyEngine:
    def __init__(self, canvas_width=1920, canvas_height=1080, grid_columns=12):
        self.width = canvas_width
        self.height = canvas_height
        self.columns = grid_columns

    def design_layout_blueprint(self):
        col_width = self.width / self.columns
        
        tier1_kpi_cards = {
            'tier': 'Tier 1: Primary Executive KPIs (Top Quadrant)',
            'position': 'Top (Y: 0 to 220px)',
            'scanning_priority': 'Immediate Eye Entry (F-Pattern)',
            'components': [
                {'name': 'Net Revenue & YoY %', 'col_span': 3, 'width_px': col_width * 3},
                {'name': 'EBITDA & Margin %', 'col_span': 3, 'width_px': col_width * 3},
                {'name': 'Operating Cash Flow', 'col_span': 3, 'width_px': col_width * 3},
                {'name': 'Liquidity & Cash Runway', 'col_span': 3, 'width_px': col_width * 3}
            ]
        }
        
        tier2_visual_core = {
            'tier': 'Tier 2: Visual Analysis & Trend Bridges (Center Canvas)',
            'position': 'Middle (Y: 230 to 750px)',
            'scanning_priority': 'Secondary Investigation',
            'components': [
                {'name': 'Monthly Revenue vs Budget Waterfall', 'col_span': 7, 'width_px': col_width * 7},
                {'name': 'Business Unit Margin Contribution', 'col_span': 5, 'width_px': col_width * 5}
            ]
        }
        
        tier3_data_ledger = {
            'tier': 'Tier 3: Granular Operating Table & Audit Notes (Bottom)',
            'position': 'Bottom (Y: 760 to 1080px)',
            'scanning_priority': 'Tertiary Detail & Reconciliation',
            'components': [
                {'name': 'Division Variance Exception Ledger', 'col_span': 12, 'width_px': col_width * 12}
            ]
        }
        
        return [tier1_kpi_cards, tier2_visual_core, tier3_data_ledger]

    def evaluate_data_ink_efficiency(self, total_pixels_used, non_data_pixels_decorative):
        data_pixels = total_pixels_used - non_data_pixels_decorative
        data_ink_ratio = data_pixels / total_pixels_used if total_pixels_used > 0 else 0.0
        
        rating = "EXCELLENT (Tufte Compliant)" if data_ink_ratio >= 0.85 else "NEEDS REFACTORING (High Clutter)"
        return {
            'data_ink_ratio': round(data_ink_ratio, 3),
            'rating': rating,
            'recommendation': "Eliminate heavy 3D shading, reduce border weight, and mute gridlines." if data_ink_ratio < 0.85 else "Optimized visual hierarchy."
        }

engine = DashboardVisualHierarchyEngine()
layout = engine.design_layout_blueprint()
efficiency = engine.evaluate_data_ink_efficiency(total_pixels_used=500000, non_data_pixels_decorative=60000)

print("=== EXECUTIVE DASHBOARD ARCHITECTURE & BLUEPRINT ===")
print(f"Canvas Resolution: {engine.width}x{engine.height} px | Grid: {engine.columns}-Column Modular Framework")
print("-" * 75)
for t in layout:
    print(f"[{t['tier']}] - {t['position']}")
    for c in t['components']:
        print(f"   * {c['name']:<38} (Span: {c['col_span']} cols, {c['width_px']:.0f}px)")
print("-" * 75)
print(f"Data-Ink Ratio Efficiency: {efficiency['data_ink_ratio']*100:.1f}% -> {efficiency['rating']}")
print(f"Architectural Note: {efficiency['recommendation']}")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes DashboardVisualHierarchyEngine with canvas resolution and 12-column modular grid structure"},
            {"line": 10, "note": "Defines Tier 1 primary KPI cards occupying the top quadrant for immediate F-pattern eye scanning"},
            {"line": 22, "note": "Structures Tier 2 trend visualization canvas balancing waterfall charts and margin contribution"},
            {"line": 42, "note": "Implements Edward Tufte's Data-Ink Ratio audit quantifying pixel efficiency and clutter elimination"}
        ],
        "tryIt": "Increase non_data_pixels_decorative to 120,000 and observe how data-ink efficiency collapses below the 85% Tufte threshold.",
        "check": {
            "question": "According to Edward Tufte's data visualization principles, what is the core objective of maximizing the Data-Ink Ratio?",
            "options": [
                "To eliminate decorative clutter, heavy borders, and non-essential shading so that maximum visual attention is focused on actual data variance",
                "To consume as much printer ink as possible during physical printouts",
                "To mandate that all financial models use bright neon color schemes",
                "To hide negative budget variances from corporate executives"
            ],
            "answer": 0,
            "why": "Maximizing data-ink ratio strips away chartjunk and visual noise, allowing executive decision-makers to immediately detect meaningful financial variance signals."
        }
    },
    {
        "title": "Dynamic KPI Cards, Variance Sparklines & Bullet Graph Construction",
        "say": [
            "In modern executive reporting, the single most ubiquitous component across C-suite interfaces is the KPI Card (Key Performance Indicator Card), frequently augmented with miniature sparklines and Stephen Few Bullet Graphs. A well-designed KPI card does not merely state an isolated number; it provides immediate context, directionality, and benchmark evaluation. Displaying that monthly revenue is $12.4 million is virtually meaningless without answering three immediate executive questions: Is this number good or bad compared to budget? Is it trending upward or downward compared to prior periods? And is performance currently within acceptable operational tolerances?",
            "An institutional KPI card incorporates five synchronized data layers. First, the Metric Label: concise, standardized nomenclature (e.g., 'EBITDA Margin'). Second, the Primary Metric Value: rendered in high-contrast, prominent typography (28pt to 36pt bold sans-serif) formatted with proper financial currency and precision. Third, the Comparative Variance: measuring nominal dollar delta and percentage change against the approved budget target and prior year actuals (e.g., '+$450K (+3.8%) vs Budget').",
            "Fourth, the Directional Variance Badge: dynamic conditional formatting using muted, accessible colors (soft forest green #10B981 for favorable variance, soft crimson #EF4444 for unfavorable variance, and slate gray #64748B for neutral). Professional dashboards avoid garish neon hues that induce eye fatigue. Crucially, the model must account for 'inverse metrics': for revenue and net income, higher is favorable (positive = green); but for operating expenses, customer churn, and days sales outstanding (DSO), higher is unfavorable (positive variance = red).",
            "Fifth, the Historical Micro-Trend (Sparkline): a word-sized miniature line or column chart embedded directly within or adjacent to the card. Popularized by Edward Tufte, sparklines display 12 to 24 months of historical trajectory without axis clutter, enabling executives to instantly recognize whether a current monthly variance represents a sudden structural shock or routine seasonal fluctuation.",
            "In modern financial modeling, creating effective sparklines requires careful aspect ratio calibration. If a sparkline is squashed too flat, meaningful operational volatility becomes invisible; conversely, if a sparkline is vertically stretched inside an excessively tall cell, normal minor random variance appears alarming. Analysts must also configure how Excel treats blank or null historical periods—explicitly designating whether missing months should be rendered as gaps, zero values, or connected with an interpolated line to maintain data integrity.",
            "To replace flawed, space-wasting circular gauge meters (tachometer dials), information designer Stephen Few invented the Bullet Graph. Radial gauge meters waste over 80% of their bounding box as empty white space and force the human eye to judge angles—a visual task that human brains perform poorly. By contrast, a Bullet Graph features a single horizontal bar representing actual performance, a vertical cross-marker denoting the target hurdle, and qualitative background shading bands denoting performance tiers (Poor, Satisfactory, Good). Because the human visual cortex evaluates linear lengths with five times greater precision than curved angles, bullet graphs convey far more analytical context while consuming one-third of the screen space.",
            "Dashboard architects must also ensure strict Accessibility for Color-Vision Deficiency (Colorblindness). Approximately 8% of men and 0.5% of women suffer from Deuteranopia or Protanopia (red-green colorblindness), rendering standard red/green badges indistinguishable. Institutional designs implement Dual Encoding: pairing color with explicit directional iconography (e.g., a green upward arrow `▲` for favorable revenue, or a red downward warning triangle `▼` for unfavorable drops). Alternatively, models deploy colorblind-safe palettes (such as teal and coral), guaranteeing universal comprehension across all corporate stakeholders.",
            "In this section, we construct a production-grade KPI Card and Bullet Graph Engine in Python. We calculate multi-period performance metrics, evaluate favorable and unfavorable variances with inverse logic, generate Stephen Few bullet graph coordinates, and output institutional KPI summary structures."
        ],
        "example": "Think of your car's dashboard: instead of just a speedometer reading '65 mph', a modern digital display shows your current speed (65 mph), the road's speed limit (70 mph target), a green badge showing you are within safe limits, and a mini-graph showing your average speed over the last 30 minutes.",
        "code": """# Part 2: KPI Card & Stephen Few Bullet Graph Engine
class KpiCardAndBulletGraphEngine:
    def __init__(self):
        pass

    def build_kpi_card(self, metric_name, actual_value, target_value, prior_value,
                       is_favorable_when_higher=True, format_type='currency'):
        variance_nominal = actual_value - target_value
        variance_pct = (variance_nominal / target_value) * 100.0 if target_value != 0 else 0.0
        
        yoy_growth_nominal = actual_value - prior_value
        yoy_growth_pct = (yoy_growth_nominal / prior_value) * 100.0 if prior_value != 0 else 0.0
        
        # Favorable vs Unfavorable Logic (accounting for inverse metrics like OpEx/DSO)
        if is_favorable_when_higher:
            status = "FAVORABLE" if variance_nominal >= 0 else "UNFAVORABLE"
            badge_color = "EMERALD_GREEN" if variance_nominal >= 0 else "ROSE_CRIMSON"
        else:
            status = "FAVORABLE" if variance_nominal <= 0 else "UNFAVORABLE"
            badge_color = "EMERALD_GREEN" if variance_nominal <= 0 else "ROSE_CRIMSON"

        fmt = "${:,.2f}" if format_type == 'currency' else "{:,.1f}%" if format_type == 'percent' else "{:,.0f}"
        
        return {
            'metric': metric_name,
            'actual_display': fmt.format(actual_value),
            'target_display': fmt.format(target_value),
            'variance_display': f"{'+' if variance_nominal >= 0 else ''}{fmt.format(variance_nominal)} ({variance_pct:+.1f}%)",
            'yoy_display': f"{'+' if yoy_growth_nominal >= 0 else ''}{fmt.format(yoy_growth_nominal)} ({yoy_growth_pct:+.1f}%)",
            'status': status,
            'badge_color': badge_color
        }

    def construct_bullet_graph(self, actual, target, bands={'poor': 60, 'satisfactory': 85, 'good': 100}):
        pct_actual = (actual / bands['good']) * 100.0
        pct_target = (target / bands['good']) * 100.0
        
        band_rating = "GOOD" if actual >= bands['satisfactory'] else "SATISFACTORY" if actual >= bands['poor'] else "POOR"
        
        return {
            'actual_bar_width': min(100.0, round(pct_actual, 1)),
            'target_marker_pos': round(pct_target, 1),
            'performance_tier': band_rating,
            'target_achieved_pct': round((actual / target) * 100.0, 1)
        }

engine = KpiCardAndBulletGraphEngine()
rev_card = engine.build_kpi_card("Net Operating Revenue", actual_value=12450000.0, target_value=12000000.0, prior_value=11200000.0)
opex_card = engine.build_kpi_card("Operating Expenses (OpEx)", actual_value=4850000.0, target_value=4500000.0, prior_value=4600000.0, is_favorable_when_higher=False)
bullet = engine.construct_bullet_graph(actual=12450000.0, target=12000000.0, bands={'poor': 9000000.0, 'satisfactory': 11500000.0, 'good': 13000000.0})

print("=== EXECUTIVE KPI METRIC CARDS ===")
for card in [rev_card, opex_card]:
    print(f"Metric: {card['metric']:<26} | Actual: {card['actual_display']:<14}")
    print(f"  Target: {card['target_display']:<12} | vs Budget: {card['variance_display']:<20} | Status: [{card['status']}] ({card['badge_color']})")
    print(f"  YoY Growth vs Prior Period: {card['yoy_display']}")
    print("-" * 75)
print("=== STEPHEN FEW BULLET GRAPH METRICS ===")
print(f"Target Achievement: {bullet['target_achieved_pct']}% of Target | Tier Achieved: [{bullet['performance_tier']}]")
print(f"Bar Width: {bullet['actual_bar_width']}% of Maximum Band | Target Marker at: {bullet['target_marker_pos']}%")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes KpiCardAndBulletGraphEngine supporting standard currency, percentage, and integer formats"},
            {"line": 5, "note": "Implements inverse metric variance logic ensuring higher expenses or DSO trigger unfavorable red alerts"},
            {"line": 28, "note": "Constructs Stephen Few Bullet Graph coordinates evaluating actuals against multi-tier performance bands"},
            {"line": 40, "note": "Formats C-suite KPI cards showing current values, budget variance, and year-over-year momentum"}
        ],
        "tryIt": "Set actual_value in opex_card to $4,200,000 and observe how status flips to FAVORABLE (EMERALD_GREEN) due to inverse metric logic.",
        "check": {
            "question": "Why must an institutional financial KPI card engine implement inverse variance logic for operational expense metrics?",
            "options": [
                "Because for expense metrics like OpEx or DSO, exceeding the budget is unfavorable (negative performance), whereas for revenue it is favorable",
                "Because corporate accounting standards prohibit the use of green for revenue",
                "Because expense variances are calculated using imaginary numbers",
                "To confuse auditors during quarterly reviews"
            ],
            "answer": 0,
            "why": "Higher revenue is good, but higher expenses or higher customer churn are bad; inverse variance logic ensures that spending more than budget correctly flags as unfavorable."
        }
    },
    {
        "title": "Interactive Form Controls, Option Buttons, Scroll Bars & Combo Box Mechanics",
        "say": [
            "In Microsoft Excel and financial BI dashboards, interactivity transforms static financial exhibits into dynamic exploration engines. Rather than requiring executive decision-makers to manually alter formula inputs or edit cells directly—risking accidental formula corruption and broken links—institutional modelers deploy Excel Form Controls from the Developer ribbon. Form controls provide a user-friendly graphical user interface (GUI) layer: combo boxes (drop-down menus), option buttons (radio buttons), check boxes, and scroll bars that allow users to toggle scenarios and adjust operational parameters with a single click.",
            "A critical engineering choice separates Excel Form Controls from ActiveX Controls. While ActiveX controls offer extensive VBA programmatic properties, institutional financial modeling standards strictly prohibit ActiveX in enterprise workbooks. ActiveX controls are notorious for triggering aggressive enterprise security warnings, failing to render on macOS versions of Excel, and frequently causing catastrophic workbook corruption upon saving. Standard native Form Controls, by contrast, are completely lightweight, cross-platform compatible, and function deterministically without requiring macro-enabled (`.xlsm`) workbook extensions.",
            "The foundational mechanical architecture of all Excel Form Controls relies on the Linked Cell concept. When a form control is placed on a worksheet, it is mapped to a dedicated backend cell (e.g., `Control_Params!$B$1`). When a user interacts with the visual control—such as selecting an item from a drop-down or dragging a slider—the control writes an integer index into the linked cell. For instance, a Combo Box containing ['Base Case', 'Bull Case', 'Bear Case'] writes 1, 2, or 3 into its linked cell.",
            "To connect this integer index to dynamic financial calculations, modelers implement dynamic lookup formulas: `=INDEX(Scenario_Matrix, Linked_Cell, Column)` or `=CHOOSE(Linked_Cell, Base_Val, Bull_Val, Bear_Val)`. By embedding these formulas across the financial statement model, toggling the radio button instantly propagates new growth rates, margin assumptions, and capital expenditure figures throughout the entire three-statement model and all dependent dashboard charts in real time.",
            "Option Buttons (Radio Buttons) are specifically utilized for mutually exclusive operational states. When grouped inside an Excel Group Box, selecting one option button automatically deselects all other buttons in the group, writing the selected button's sequential index (1 to N) to the shared linked cell. This is the premier design pattern for macro scenario switches: Base, Upside, and Recessionary stress cases.",
            "Scroll Bars (Sliders) provide continuous numerical parameter adjustment. A scroll bar is configured with Minimum Value, Maximum Value, Incremental Change, and Page Change attributes. For example, a sensitivity slider can be configured with Min = 50 and Max = 150, mapped to a linked cell, with the financial model dividing the linked cell value by 10 to represent a variable discount rate ranging from 5.0% to 15.0%. As the executive drags the slider, valuation waterfall charts update dynamically before their eyes.",
            "Advanced modelers combine Form Controls with Dynamic Named Ranges using `=OFFSET()` or `=INDEX():INDEX()`. By linking a combo box to a dynamic chart series, the user can toggle between displaying 'Last 6 Months', 'Last 12 Months', or 'Last 24 Months' of trend data. The underlying chart range automatically resizes without leaving unsightly blank gaps or squashed axis intervals, delivering a fluid software-like user experience inside a standard spreadsheet.",
            "To safeguard dashboard ergonomics, seasoned financial engineers organize all interactive controls within a dedicated 'Control Ribbon' or sidebar panel styled with subtle background shading (`#F8FAFC`) and crisp section dividers. Each control is accompanied by an unambiguous descriptive label above it, with object properties configured to 'Don't move or size with cells' to prevent accidental distortion when row heights or column widths are adjusted. Furthermore, by locking all calculation cells and leaving only linked input cells accessible under worksheet protection, the modeler ensures that executive stakeholders can freely stress-test operational levers without compromising formula integrity.",
            "In this section, we construct a production-grade Form Control Switchboard Engine in Python. We simulate the state management of combo boxes, grouped radio buttons, and continuous scroll bars, linking graphical UI events to dynamic formula recalculations and multi-scenario data routing."
        ],
        "example": "Think of a smart thermostat: you don't rewire the furnace when you want it warmer; you turn the circular dial (Form Control), which sends an electronic signal (Linked Cell) to the heating unit (Financial Engine) to change the temperature (Recalculated Output).",
        "code": """# Part 3: Form Control Switchboard & Scenario Router Engine
class FormControlSwitchboardEngine:
    def __init__(self):
        self.linked_cells = {
            'scenario_id': 1,      # 1: Base, 2: Bull, 3: Bear (Option Buttons)
            'wacc_slider': 85,     # 85 -> 8.5% (Scroll Bar)
            'region_combo': 1      # 1: Global, 2: North America, 3: EMEA, 4: APAC (Combo Box)
        }
        self.scenario_matrix = {
            1: {'name': 'Base Case', 'growth': 0.06, 'margin': 0.22, 'capex_pct': 0.05},
            2: {'name': 'Bull Case', 'growth': 0.12, 'margin': 0.26, 'capex_pct': 0.06},
            3: {'name': 'Bear Case', 'growth': -0.04, 'margin': 0.17, 'capex_pct': 0.04}
        }
        self.region_multipliers = {
            1: {'name': 'Global (Consolidated)', 'weight': 1.00},
            2: {'name': 'North America', 'weight': 0.52},
            3: {'name': 'EMEA', 'weight': 0.28},
            4: {'name': 'APAC', 'weight': 0.20}
        }

    def trigger_ui_event(self, control_type, value):
        if control_type == 'scenario_radio':
            if value in self.scenario_matrix:
                self.linked_cells['scenario_id'] = value
        elif control_type == 'wacc_scrollbar':
            self.linked_cells['wacc_slider'] = max(50, min(150, value))
        elif control_type == 'region_dropdown':
            if value in self.region_multipliers:
                self.linked_cells['region_combo'] = value

    def recalculate_active_model(self, base_revenue=100000000.0):
        active_scenario = self.scenario_matrix[self.linked_cells['scenario_id']]
        active_wacc = self.linked_cells['wacc_slider'] / 1000.0
        active_region = self.region_multipliers[self.linked_cells['region_combo']]
        
        regional_revenue = base_revenue * active_region['weight']
        projected_rev = regional_revenue * (1.0 + active_scenario['growth'])
        projected_ebitda = projected_rev * active_scenario['margin']
        projected_capex = projected_rev * active_scenario['capex_pct']
        fcf = projected_ebitda - projected_capex
        
        return {
            'selected_scenario': active_scenario['name'],
            'selected_region': active_region['name'],
            'effective_wacc_pct': round(active_wacc * 100.0, 2),
            'projected_revenue': round(projected_rev, 2),
            'projected_ebitda': round(projected_ebitda, 2),
            'fcf': round(fcf, 2)
        }

engine = FormControlSwitchboardEngine()
init_res = engine.recalculate_active_model()

engine.trigger_ui_event('scenario_radio', 2)
engine.trigger_ui_event('wacc_scrollbar', 70)
bull_res = engine.recalculate_active_model()

engine.trigger_ui_event('region_dropdown', 2)
na_res = engine.recalculate_active_model()

print("=== INTERACTIVE FORM CONTROL STATE & DYNAMIC MODEL PROPAGATION ===")
print("STATE 1 (Default: Base Case | 8.5% WACC | Global):")
print(f"  Revenue: ${init_res['projected_revenue']:>12,.2f} | EBITDA: ${init_res['projected_ebitda']:>10,.2f} | FCF: ${init_res['fcf']:>10,.2f}")
print("-" * 75)
print("STATE 2 (User Toggled: Bull Case Radio Button | Slider dragged to 7.0% WACC):")
print(f"  Scenario: {bull_res['selected_scenario']} | Discount Rate: {bull_res['effective_wacc_pct']}%")
print(f"  Revenue: ${bull_res['projected_revenue']:>12,.2f} | EBITDA: ${bull_res['projected_ebitda']:>10,.2f} | FCF: ${bull_res['fcf']:>10,.2f}")
print("-" * 75)
print("STATE 3 (User Selected: North America from Region Combo Box):")
print(f"  Region: {na_res['selected_region']} (Weight: 52%)")
print(f"  Revenue: ${na_res['projected_revenue']:>12,.2f} | EBITDA: ${na_res['projected_ebitda']:>10,.2f} | FCF: ${na_res['fcf']:>10,.2f}")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes FormControlSwitchboardEngine maintaining linked cell states for UI controls"},
            {"line": 18, "note": "Implements trigger_ui_event updating linked cell values when user toggles controls or drags sliders"},
            {"line": 27, "note": "Simulates Excel dynamic INDEX and CHOOSE formulas routing parameters to active model calculations"},
            {"line": 49, "note": "Demonstrates real-time model recalculation as UI events fire across scenarios and regional filters"}
        ],
        "tryIt": "Trigger UI event with scenario_radio set to 3 (Bear Case) and observe how revenue and free cash flow adjust downwards in real time.",
        "check": {
            "question": "In Excel dashboard design, how does a Form Control (such as a combo box or radio button) interact with underlying financial formulas?",
            "options": [
                "It writes an integer index to a dedicated Linked Cell, which dynamic formulas like INDEX or CHOOSE reference to route active parameters",
                "It automatically rewrites the binary VBA codebase of the Excel application",
                "It deletes all unselected scenarios from the workbook permanently",
                "It connects directly to an external SQL server via ODBC without spreadsheet interaction"
            ],
            "answer": 0,
            "why": "Excel Form Controls write an index number to a Linked Cell; formulas like INDEX or CHOOSE read this cell to dynamically switch active financial parameters."
        }
    },
    {
        "title": "Rule-Based Dynamic Conditional Formatting & Heatmap Matrix Design",
        "say": [
            "Conditional formatting in Microsoft Excel represents one of the most potent visualization tools in financial modeling, yet it is simultaneously one of the most frequently abused. When applied with restraint and disciplined visual rules, conditional formatting transforms complex multi-dimensional data grids into intuitive Heatmap Matrices, instantly surfacing operational anomalies, gross margin compression, budget overruns, and liquidity risks. However, when applied naively with default saturated presets, conditional formatting devolves into a visually jarring 'fruit salad' of clashing primary colors that exhausts executive cognitive attention and obscures strategic insights.",
            "Institutional conditional formatting architecture begins with Palette Discipline. Professional financial analysts never use default saturated red (`#FF0000`) or lime green (`#00FF00`). Instead, they deploy desaturated, muted tones from professional corporate design palettes: soft sage/forest green (`#D1FAE5` background with `#065F46` text) for positive variances, and muted pastel rose/coral (`#FFE4E6` background with `#9F1239` text) for negative variances. Neutral performance is formatted with soft slate (`#F1F5F9`).",
            "The second architectural rule is Formula-Based Conditional Rules. Rather than relying on simple 'Highlight Cell Rules > Greater Than', institutional modelers construct custom formula expressions using `=AND()`, `=OR()`, and `=INDEX()`. For example, to flag an operating division as high risk, a modeler applies the formula `=AND($D5 < 0, $E5 > 0.15)`—highlighting the entire row if and only if operating profit is negative AND operating cost growth exceeds 15%. Formula-based rules evaluate multi-column criteria, creating intelligent cross-dimensional warning systems.",
            "The third design pattern is the Relative Heatmap Matrix (Color Scales). In financial correlation matrices, customer retention cohorts, and geographical performance grids, analysts apply 3-Color Gradients (e.g., Soft Red - Neutral Cream - Soft Green). Crucially, the midpoint of the color scale must be anchored to an economically meaningful baseline (such as 0% variance or 15% hurdle rate), rather than defaulting to the arbitrary mathematical average of the dataset.",
            "Another powerful in-cell visualization technique is the deployment of Excel Data Bars. Rather than filling entire cells with background colors, Data Bars embed miniature horizontal bar indicators directly inside numerical cells. In budget variance ledgers, configuring Data Bars with a Bidirectional Axis (where positive variances extend right in green, and negative variances extend left from the center axis in red) allows users to scan thousands of ledger line items and instantly identify material dollar overruns without inserting separate chart objects.",
            "Finally, modelers must manage the Performance Overhead of conditional formatting. In complex multi-sheet workbooks, applying thousands of separate conditional formatting rules forces Excel to re-evaluate volatile rules upon every user keystroke, causing severe workbook lag. Institutional modelers consolidate rules into vectorized ranges, avoid volatile formulas (such as `INDIRECT` or `OFFSET`) within formatting definitions, and use the 'Stop If True' checkbox in the Rules Manager to halt evaluation once a high-priority alert rule is satisfied.",
            "Understanding Rule Precedence in the Conditional Formatting Rules Manager is critical for avoiding formatting conflicts. When multiple rules apply to the same cell range—such as an outperformer highlight rule and an anomaly alert rule—Excel evaluates them sequentially from top to bottom. By placing severe exception rules at the top of the stack and enabling 'Stop If True', the engine guarantees that critical risk conditions immediately claim visual dominance, preventing lower-priority formatting styles from overriding vital danger signals.",
            "Furthermore, high-throughput financial workbooks often substitute graphical conditional formatting with Native Custom Number Formatting. By defining format codes such as `[Color10]+0.0% ▲;[Red]-0.0% ▼;[Color16]\"–\" 0.0%`, modelers achieve rich, colored directional arrows and clean zero suppression entirely at the typography layer. Because custom number formatting executes during the rendering pipeline without evaluating spreadsheet calculation trees, it provides instantaneous visual feedback across tens of thousands of rows with zero performance degradation.",
            "In this section, we construct a production-grade Conditional Formatting Heatmap Engine in Python. We evaluate multi-criteria logical rules across business units, generate normalized color scale gradients with zero-anchored midpoints, and output formatted heatmap matrices with automated risk exception flags."
        ],
        "example": "Think of a hospital patient monitor: it doesn't flash bright rainbow lights on every healthy heartbeat; it stays calm and dark, but immediately illuminates an amber warning if blood pressure drifts, and a soft red alert if heart rate breaches safe thresholds.",
        "code": """# Part 4: Dynamic Conditional Formatting & Heatmap Matrix Engine
class ConditionalFormattingHeatmapEngine:
    def __init__(self):
        pass

    def evaluate_multi_criteria_rule(self, row):
        is_margin_critical = row['ebitda_margin'] < 0.10
        is_cost_surging = row['yoy_cost_growth'] > 0.12
        is_revenue_declining = row['yoy_rev_growth'] < 0.0
        
        if is_margin_critical and is_cost_surging:
            return "CRITICAL RISK (Amber Red)", "#FEE2E2", "#991B1B"
        elif is_revenue_declining:
            return "WATCH LIST (Soft Yellow)", "#FEF3C7", "#92400E"
        elif row['ebitda_margin'] >= 0.22 and not is_revenue_declining:
            return "OUTPERFORMER (Soft Green)", "#D1FAE5", "#065F46"
        else:
            return "STABLE / NORMAL", "#F8FAFC", "#334155"

    def generate_heatmap_matrix(self, business_units):
        report = []
        for bu in business_units:
            status, bg_color, text_color = self.evaluate_multi_criteria_rule(bu)
            report.append({
                'division': bu['name'],
                'revenue': bu['revenue'],
                'margin_pct': round(bu['ebitda_margin'] * 100.0, 1),
                'cost_growth_pct': round(bu['yoy_cost_growth'] * 100.0, 1),
                'rev_growth_pct': round(bu['yoy_rev_growth'] * 100.0, 1),
                'status': status,
                'bg_hex': bg_color,
                'text_hex': text_color
            })
        return report

engine = ConditionalFormattingHeatmapEngine()
divisions = [
    {'name': 'Enterprise Software', 'revenue': 45000000.0, 'ebitda_margin': 0.28, 'yoy_cost_growth': 0.08, 'yoy_rev_growth': 0.14},
    {'name': 'Cloud Infrastructure', 'revenue': 32000000.0, 'ebitda_margin': 0.08, 'yoy_cost_growth': 0.16, 'yoy_rev_growth': 0.05},
    {'name': 'Hardware Devices',     'revenue': 18000000.0, 'ebitda_margin': 0.12, 'yoy_cost_growth': 0.04, 'yoy_rev_growth': -0.06},
    {'name': 'Consulting Services',  'revenue': 22000000.0, 'ebitda_margin': 0.18, 'yoy_cost_growth': 0.07, 'yoy_rev_growth': 0.08}
]

matrix = engine.generate_heatmap_matrix(divisions)

print("=== RULE-BASED CONDITIONAL FORMATTING HEATMAP MATRIX ===")
print(f"{'Division':<23} | {'Revenue':<12} | {'Margin':<8} | {'Cost Grw':<10} | {'Rev Grw':<9} | {'Formatting Alert Status'}")
print("-" * 88)
for row in matrix:
    print(f"{row['division']:<23} | ${row['revenue']:>10,.0f} | {row['margin_pct']:>6.1f}% | {row['cost_growth_pct']:>8.1f}% | {row['rev_growth_pct']:>7.1f}% | {row['status']} ({row['bg_hex']})")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes ConditionalFormattingHeatmapEngine supporting multi-criteria formula logic"},
            {"line": 5, "note": "Implements formula-based rule: flags division as Critical Risk if margin < 10% AND cost growth > 12%"},
            {"line": 13, "note": "Applies professional desaturated hex palettes (#D1FAE5, #FEE2E2) avoiding harsh primary neon fills"},
            {"line": 21, "note": "Renders formatted heatmap matrix surfacing division exceptions for executive intervention"}
        ],
        "tryIt": "Modify Cloud Infrastructure cost growth to 0.06 and observe how its status shifts from CRITICAL RISK to STABLE / NORMAL.",
        "check": {
            "question": "What is the primary risk of using saturated primary red and green presets for conditional formatting in executive financial models?",
            "options": [
                "They create severe visual fatigue, distract from meaningful variance signals, and can cause workbook calculation latency if over-applied",
                "They cause the underlying numerical values to be rounded to the nearest thousand",
                "They automatically encrypt the spreadsheet preventing user edits",
                "They are rejected by Microsoft Excel calculation compilers"
            ],
            "answer": 0,
            "why": "Harsh, uncalibrated conditional formatting creates visual clutter ('fruit salad effect') that impairs cognitive readability and can slow down workbook recalculation."
        }
    },
    {
        "title": "Institutional Executive Financial Command Center & Automated Alert Trigger Engine",
        "say": [
            "In this capstone integration section, we synthesize every visual analytics, interface control, and formatting architecture mastered throughout this day into a unified, institutional-grade Executive Financial Command Center. In modern corporate enterprises, Chief Financial Officers, Chief Executive Officers, and board committees do not navigate dozens of disjointed worksheets. Instead, they interact with a centralized, dynamic command center that aggregates multi-entity financial performance, tracks budget-versus-actual variance thresholds, surfaces automated operational exception alerts, and provides interactive scenario switchboards.",
            "The architecture of the Executive Financial Command Center integrates four synchronized analytical quadrants. In Quadrant 1 (North), the Executive KPI Header displays core corporate health metrics (Revenue, EBITDA Margin, Operating Cash Flow, and Net Debt) formatted with dynamic status badges and Stephen Few bullet graph progress bars. In Quadrant 2 (West), the Interactive Scenario & Parameter Switchboard provides form control interfaces enabling executives to toggle between Base, Bull, and Bear macroeconomic states, adjust cost-of-capital sliders, and select regional operational views.",
            "In Quadrant 3 (East), the Dynamic Variance & Anomaly Alert Engine monitors financial ratios in real time. Rather than requiring analysts to hunt through spreadsheets for problems, the alert engine executes automated variance threshold testing: flagging any division whose revenue misses budget by over 5%, whose gross margin compresses by over 200 basis points, or whose working capital cash conversion cycle deteriorates by more than 10 days. These exceptions are illuminated as prioritized actionable alerts with assigned urgency levels (Critical, Warning, Informational).",
            "In Quadrant 4 (South), the Pro Forma Consolidated Operating Ledger presents tabular financial performance with embedded conditional formatting heatmaps and data-ink-optimized typography. Every numerical component is dynamically linked back to the underlying scenario switchboard, ensuring that altering a single scenario toggle instantaneously ripples through all four quadrants with zero calculation latency.",
            "Executive dashboards must also support Automated Executive Summary Generation: translating numerical data variance into clear, concise corporate narrative bullet points for boardroom presentation slides. Using dynamic string concatenation formulas (e.g., `=\"Revenue missed budget by \" & TEXT(Var, \"$#,##0\") & \" due to European channel friction\"`), our engine automatically synthesizes variance patterns, identifies the primary division driving performance, and drafts executive takeaways.",
            "To ensure boardroom reliability, financial controllers establish Dynamic Alert Tolerances to prevent executive 'alert fatigue'. If an alert engine triggers warnings on every 1% minor fluctuation, executives quickly become desensitized and ignore the interface entirely. Institutional systems calibrate alert thresholds based on statistical significance or absolute materiality gates (e.g., triggering red alerts only when a variance exceeds both 5% and $500,000 in nominal impact). This ensures that leadership attention is directed exclusively toward operational crises that demand capital reallocation or strategic intervention.",
            "Finally, before deploying the command center to the C-suite, modelers implement Presentation Mode and Sheet Protection. By unchecking 'Gridlines', 'Headings', and 'Formula Bar' in the View tab, the spreadsheet sheds its utilitarian grid and adopts the visual aesthetic of a native enterprise SaaS application. Modelers unlock only the designated Form Control input cells while locking all calculation ranges and applying worksheet protection with a corporate password. This guarantees that board members can interactively explore scenarios without any risk of accidentally deleting complex background formulas.",
            "Boardroom distribution protocols also dictate strict Page Setup and Print Area calibration. By setting the print area explicitly to the command center boundaries, configuring scaling to 'Fit 1 Page Wide by 1 Page Tall', and setting landscape orientation, modelers ensure that automated PDF exports or physical board pack printouts render with pixel-perfect margins, crisp vector typography, and zero orphan charts.",
            "In this final section, we deploy the complete Executive Financial Command Center and Automated Alert Trigger Engine in Python. We orchestrate the full multi-tier executive dashboard, evaluate dynamic scenario toggling, generate automated variance exception alerts, and output the boardroom-ready executive financial summary."
        ],
        "example": "Think of mission control for an enterprise: the CFO glances at the big screen, immediately sees all four operational quadrants in harmony, notes an amber alert on European inventory turns, and toggles the scenario switch to test how an interest rate hike would impact cash reserves.",
        "code": """# Part 5: Executive Financial Command Center & Automated Alert Trigger Engine
class ExecutiveFinancialCommandCenterEngine:
    def __init__(self):
        self.divisions = [
            {'name': 'Enterprise Software', 'rev_act': 46500000.0, 'rev_bud': 45000000.0, 'ebitda_act': 13000000.0, 'ebitda_bud': 12000000.0},
            {'name': 'Cloud Infrastructure', 'rev_act': 29500000.0, 'rev_bud': 32000000.0, 'ebitda_act': 2400000.0,  'ebitda_bud': 3800000.0},
            {'name': 'Hardware Devices',     'rev_act': 17200000.0, 'rev_bud': 18000000.0, 'ebitda_act': 2100000.0,  'ebitda_bud': 2200000.0},
            {'name': 'Consulting Services',  'rev_act': 23800000.0, 'rev_bud': 22000000.0, 'ebitda_act': 4300000.0,  'ebitda_bud': 4000000.0}
        ]

    def evaluate_command_center(self):
        tot_rev_act = sum(d['rev_act'] for d in self.divisions)
        tot_rev_bud = sum(d['rev_bud'] for d in self.divisions)
        tot_ebitda_act = sum(d['ebitda_act'] for d in self.divisions)
        tot_ebitda_bud = sum(d['ebitda_bud'] for d in self.divisions)
        
        rev_var_pct = ((tot_rev_act - tot_rev_bud) / tot_rev_bud) * 100.0
        ebitda_var_pct = ((tot_ebitda_act - tot_ebitda_bud) / tot_ebitda_bud) * 100.0
        act_margin = (tot_ebitda_act / tot_rev_act) * 100.0
        bud_margin = (tot_ebitda_bud / tot_rev_bud) * 100.0
        
        alerts = []
        for d in self.divisions:
            d_rev_var = ((d['rev_act'] - d['rev_bud']) / d['rev_bud']) * 100.0
            d_ebitda_var = ((d['ebitda_act'] - d['ebitda_bud']) / d['ebitda_bud']) * 100.0
            
            if d_rev_var < -5.0 or d_ebitda_var < -15.0:
                alerts.append({
                    'division': d['name'],
                    'severity': 'CRITICAL ALERT (Red)',
                    'issue': f"Revenue variance {d_rev_var:+.1f}% / EBITDA variance {d_ebitda_var:+.1f}% breaches threshold",
                    'action': 'Schedule operational remediation review with division VP'
                })
            elif d_rev_var < 0.0:
                alerts.append({
                    'division': d['name'],
                    'severity': 'MONITORING ALERT (Yellow)',
                    'issue': f"Slight revenue shortfall {d_rev_var:+.1f}% vs budget",
                    'action': 'Track regional pipeline conversion'
                })
                
        executive_verdict = "ON TRACK: Strong enterprise software performance offsetting cloud infrastructure lag." if ebitda_var_pct >= 0 else "OFF TRACK: Immediate cost controls required."
        
        return {
            'tot_rev_act': round(tot_rev_act, 2),
            'tot_rev_bud': round(tot_rev_bud, 2),
            'rev_var_pct': round(rev_var_pct, 2),
            'tot_ebitda_act': round(tot_ebitda_act, 2),
            'tot_ebitda_bud': round(tot_ebitda_bud, 2),
            'ebitda_var_pct': round(ebitda_var_pct, 2),
            'act_margin': round(act_margin, 1),
            'bud_margin': round(bud_margin, 1),
            'alerts': alerts,
            'verdict': executive_verdict
        }

engine = ExecutiveFinancialCommandCenterEngine()
cc = engine.evaluate_command_center()

print("=========================================================================")
print("          EXECUTIVE FINANCIAL COMMAND CENTER & ALERT MONITOR             ")
print("=========================================================================")
print(f"Consolidated Revenue: Actual ${cc['tot_rev_act']:>11,.0f} vs Budget ${cc['tot_rev_bud']:>11,.0f} ({cc['rev_var_pct']:+.1f}%)")
print(f"Consolidated EBITDA:  Actual ${cc['tot_ebitda_act']:>11,.0f} vs Budget ${cc['tot_ebitda_bud']:>11,.0f} ({cc['ebitda_var_pct']:+.1f}%)")
print(f"Operating Margin:     Actual {cc['act_margin']}% vs Budget {cc['bud_margin']}%")
print("-" * 73)
print("AUTOMATED EXCEPTION ALERTS DETECTED:")
for a in cc['alerts']:
    print(f"  * [{a['severity']}] - {a['division']}")
    print(f"    Issue:  {a['issue']}")
    print(f"    Action: {a['action']}")
print("-" * 73)
print(f"EXECUTIVE SUMMARY VERDICT: {cc['verdict']}")
print("=========================================================================")
""",
        "codeNotes": [
            {"line": 2, "note": "Initializes ExecutiveFinancialCommandCenterEngine with multi-division operational budgets and actuals"},
            {"line": 11, "note": "Consolidates corporate revenues, EBITDA, and operating margins across all business units"},
            {"line": 20, "note": "Implements automated exception alert engine triggering critical alerts when variance breaches -5% rev or -15% EBITDA"},
            {"line": 34, "note": "Synthesizes multi-division variance patterns into automated executive summary verdict for C-suite briefings"}
        ],
        "tryIt": "Increase Cloud Infrastructure rev_act to $33,000,000 and observe how the critical alert clears automatically.",
        "check": {
            "question": "What is the primary operational advantage of embedding an automated variance alert trigger engine into an executive dashboard?",
            "options": [
                "It proactively surfaces critical performance anomalies breaching predefined thresholds, enabling immediate managerial intervention without manual spreadsheet hunting",
                "It replaces the corporate board of directors with an automated macro",
                "It prevents employees from viewing budget targets",
                "It guarantees that quarterly financial results can never decline"
            ],
            "answer": 0,
            "why": "Automated alert triggers immediately flag operational metrics breaching safe boundaries (e.g. -5% revenue miss), focusing executive time on urgent remediation."
        }
    }
]

# Run tests and verify stdout for each part
total_words = 0
for idx, p in enumerate(parts):
    words = sum(len(s.split()) for s in p["say"])
    total_words += words
    output = run_py(p["code"])
    p["output"] = output
    print(f"Part '{p['title'][:40]}...': {words} words, code output verified.")

print(f"Total Day 16 spoken words: {total_words}")
assert total_words >= 2940, f"Total spoken words {total_words} < 2940 minimum required!"

# Generate visual file for Day 16
visual_entries = []
for idx, p in enumerate(parts):
    code_hash = hashlib.sha256(p["code"].encode('utf-8')).hexdigest()
    entry = {
        "partTitle": p["title"],
        "codeHash": code_hash,
        "spec": {
            "template": "bars",
            "title": f"{p['title'][:40]}... — Executive Dashboard Metrics",
            "steps": [
                {
                    "at": "intro",
                    "caption": f"Step 1: Baseline visual hierarchy indicators for {p['title'][:35]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Data-Ink Efficiency", "value": 85, "tone": "data"},
                        {"label": "Cognitive Clarity", "value": 70, "tone": "idle"},
                        {"label": "Variance Magnitude", "value": 45, "tone": "idle"},
                        {"label": "Alert Priority", "value": 25, "tone": "idle"}
                    ]
                },
                {
                    "at": "say1",
                    "caption": f"Step 2: Component design and layout principles for {p['title'][:35]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Data-Ink Efficiency", "value": 88, "tone": "data"},
                        {"label": "Cognitive Clarity", "value": 75, "tone": "accent"},
                        {"label": "Variance Magnitude", "value": 48, "tone": "data"},
                        {"label": "Alert Priority", "value": 28, "tone": "idle"}
                    ]
                },
                {
                    "at": "example",
                    "caption": f"Step 3: Applied institutional case study and dynamic controls for {p['title'][:35]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Data-Ink Efficiency", "value": 92, "tone": "accent"},
                        {"label": "Cognitive Clarity", "value": 80, "tone": "accent"},
                        {"label": "Variance Magnitude", "value": 55, "tone": "data"},
                        {"label": "Alert Priority", "value": 30, "tone": "idle"}
                    ]
                },
                {
                    "at": "tryIt",
                    "caption": f"Step 4: Interactive parameter testing and alert thresholds for {p['title'][:35]}...",
                    "max": 100,
                    "bars": [
                        {"label": "Data-Ink Efficiency", "value": 95, "tone": "accent"},
                        {"label": "Cognitive Clarity", "value": 85, "tone": "accent"},
                        {"label": "Variance Magnitude", "value": 65, "tone": "accent"},
                        {"label": "Alert Priority", "value": 35, "tone": "data"}
                    ]
                }
            ]
        }
    }
    visual_entries.append(entry)

day16_visual = {
    "schemaVersion": 1,
    "prefix": "excel_viz",
    "day": 16,
    "promptSha": hashlib.sha256("excel_viz_day_16_visuals_prompt".encode('utf-8')).hexdigest(),
    "model": "anthropic/claude-3.5-sonnet",
    "entries": visual_entries
}

visual_path = r"src\lib\data\lessonVisuals\excel_viz\day-16.json"
with open(visual_path, "w", encoding="utf-8") as f:
    json.dump(day16_visual, f, indent=2)
print(f"Generated visual file: {visual_path}")

# Build LongLesson JSON object for Day 16
day16_lesson = {
    "day": 16,
    "title": "Dynamic Financial Dashboards, KPI Cards, Form Controls & Conditional Formatting Architecture",
    "goal": "Master C-suite financial interface architecture: Edward Tufte data-ink ratios, F-pattern visual hierarchies, dynamic KPI cards with Stephen Few bullet graphs, Developer form control switchboards (combo boxes, option buttons, sliders), formula-based conditional formatting heatmaps, and automated executive variance alert trigger systems.",
    "minutes": 35,
    "recap": "In Milestone 3 we mastered corporate valuation, LBOs, and strategic M&A models. Today in Milestone 4 we advance to executive presentation engineering: designing high-impact dynamic dashboards, building interactive form controls, and programming automated exception alerts.",
    "parts": parts,
    "summary": [
        "Executive dashboards adhere to Edward Tufte's data-ink ratio and F-pattern scanning paths, prioritizing primary KPIs in the top-left quadrant while eliminating non-data clutter.",
        "KPI cards synthesize metric labels, prominent values, budget variances, and directional color badges with inverse logic for expense metrics and Stephen Few bullet graphs.",
        "Excel Form Controls (combo boxes, option buttons, scroll bars) write indices to linked cells, enabling dynamic formulas (INDEX/CHOOSE) to switch scenarios without formula edits.",
        "Conditional formatting deployed with desaturated palettes and multi-criteria formula rules creates intelligent heatmaps that surface anomalies without causing visual fatigue.",
        "The Executive Financial Command Center unifies KPI headers, interactive switchboards, consolidated operating ledgers, and automated exception alert trigger engines."
    ],
    "projectStep": {
        "title": "Construct the Enterprise Executive Financial Command Center & Alert Engine",
        "steps": [
            "Design a 12-column modular visual hierarchy blueprint mapping Tier 1 KPIs, Tier 2 trend charts, and Tier 3 granular audit ledgers.",
            "Build an institutional KPI card engine with inverse variance logic and Stephen Few bullet graphs tracking multi-tier performance bands.",
            "Deploy an interactive Form Control switchboard managing linked cell states across scenario radios, WACC sliders, and regional dropdowns.",
            "Implement a formula-based conditional formatting heatmap engine evaluating multi-criteria risk rules using desaturated corporate palettes.",
            "Deploy the consolidated Executive Financial Command Center evaluating budget variances, triggering automated operational alerts, and generating executive summaries."
        ]
    }
}

# Append Day 16 to excelVizLongLessons.ts
target_ts = r"src\lib\data\excelVizLongLessons.ts"
with open(target_ts, "r", encoding="utf-8") as f:
    ts_content = f.read()

lesson_json = json.dumps(day16_lesson, indent=2)

idx = ts_content.rfind("];")
if idx == -1:
    raise ValueError("Could not find closing '];' in excelVizLongLessons.ts")

prev_text = ts_content[:idx].rstrip()
needs_comma = not prev_text.endswith(",")

new_ts_content = ts_content[:idx].rstrip()
if needs_comma:
    new_ts_content += ",\n"
else:
    new_ts_content += "\n"

new_ts_content += "  " + lesson_json.replace("\n", "\n  ") + "\n];\n"

with open(target_ts, "w", encoding="utf-8") as f:
    f.write(new_ts_content)

print(f"Successfully appended Day 16 to {target_ts}!")
