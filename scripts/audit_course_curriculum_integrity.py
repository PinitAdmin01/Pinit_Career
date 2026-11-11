import re
import json
import os

def audit_course_day_by_day(config_path, lesson_path, course_id):
    print(f"\n=======================================================")
    print(f" FORENSIC AUDIT: {course_id}")
    print(f" Config: {config_path}")
    print(f" Lessons: {lesson_path}")
    print(f"=======================================================\n")
    
    with open(config_path, 'r', encoding='utf-8') as f:
        config_text = f.read()
        
    lesson_text = ""
    if os.path.exists(lesson_path):
        with open(lesson_path, 'r', encoding='utf-8') as f:
            lesson_text = f.read()

    # 1. Check robotic fillers in lessons
    fillers = re.findall(r'(When studying [^.\n]+\.|In production engineering [^.\n]+\.)', lesson_text)
    print(f"🔍 Robotic Filler Paragraphs in Lessons: {len(fillers)}")
    
    # 2. Extract day objects from config
    # DayConfig pattern
    day_blocks = re.findall(r'\{\s*"day":\s*(\d+),[\s\S]*?(?=\n\s*\{\s*"day":|\n\];)', config_text)
    print(f"🔍 Days Configured: {len(day_blocks)}")
    
    issues = []
    
    # Parse individual days
    for day_num in range(1, 31):
        day_pattern = rf'\{{\s*"day":\s*{day_num},([\s\S]*?)(?=\n\s*\{{\s*"day":|\n\];)'
        match = re.search(day_pattern, config_text)
        if not match:
            continue
        
        block = match.group(1)
        
        def extract_field(name):
            m = re.search(rf'"{name}":\s*"((?:[^"\\]|\\.)*)"', block)
            if m:
                # unescape
                val = m.group(1).encode().decode('unicode_escape', errors='ignore')
                return val
            return ""

        eTitle = extract_field("eTitle")
        eDesc = extract_field("eDesc")
        eStarter = extract_field("eStarter")
        eHint = extract_field("eHint")
        eTest = extract_field("eTest")
        
        aTitle = extract_field("aTitle")
        aDesc = extract_field("aDesc")
        aStarter = extract_field("aStarter")
        aHint = extract_field("aHint")
        aTest = extract_field("aTest")
        
        # Analyze eTest string literals
        # e.g. === 'SOME_STRING'
        e_str_literals = set(re.findall(r"['\"]([A-Z0-9_]{4,})['\"]", eTest))
        for lit in e_str_literals:
            if lit not in eStarter and lit not in eDesc:
                issues.append({
                    "day": day_num,
                    "task": "exam",
                    "type": "SECRET_MAGIC_STRING",
                    "literal": lit,
                    "eTitle": eTitle
                })
                
        # Analyze aTest string literals
        a_str_literals = set(re.findall(r"['\"]([A-Z0-9_]{4,})['\"]", aTest))
        for lit in a_str_literals:
            if lit not in aStarter and lit not in aDesc:
                issues.append({
                    "day": day_num,
                    "task": "assignment",
                    "type": "SECRET_MAGIC_STRING",
                    "literal": lit,
                    "aTitle": aTitle
                })
                
        # Check property accesses: e.g. res.someProp
        e_props = set(re.findall(r"(?:ok|bad|res|summ|out|ans|val|check)\.([a-zA-Z0-9_]+)", eTest))
        for prop in e_props:
            if prop not in eStarter and prop not in eDesc:
                issues.append({
                    "day": day_num,
                    "task": "exam",
                    "type": "UNDOCUMENTED_RETURN_PROPERTY",
                    "property": prop,
                    "eTitle": eTitle
                })
                
        a_props = set(re.findall(r"(?:s1|s2|m|p|summ|res|out|ans|val|check)\.([a-zA-Z0-9_]+)", aTest))
        for prop in a_props:
            if prop not in aStarter and prop not in aDesc:
                issues.append({
                    "day": day_num,
                    "task": "assignment",
                    "type": "UNDOCUMENTED_RETURN_PROPERTY",
                    "property": prop,
                    "aTitle": aTitle
                })
                
    print(f"\n🚨 Total Discrepancy Issues Found in Config: {len(issues)}")
    by_type = {}
    for iss in issues:
        by_type[iss["type"]] = by_type.get(iss["type"], 0) + 1
    print(f"Summary by issue type: {by_type}")
    
    print(f"\nAll Issues ({len(issues)}):")
    for iss in issues:
        print(f"  Day {iss['day']} ({iss['task']}): [{iss['type']}] {iss.get('literal') or iss.get('property')}")

import sys

if __name__ == '__main__':
    course = sys.argv[1] if len(sys.argv) > 1 else 'bcom-accounting'
    
    courses_map = {
        'bcom-accounting': ('src/lib/data/bcomAccounting30DayData.ts', 'src/lib/data/bcomAccountingLongLessons.ts'),
        'bcom-finance': ('src/lib/data/bcomFinance30DayData.ts', 'src/lib/data/bcomFinanceLongLessons.ts'),
        'bcom-marketing': ('src/lib/data/bcomMarketing30DayData.ts', 'src/lib/data/bcomMarketingPilotDays.ts'),
        'bcom_aud': ('src/lib/data/bcomAuditing30DayData.ts', 'src/lib/data/bcomAudLongLessons.ts'),
        'bcom_ban': ('src/lib/data/bcomBanking30DayData.ts', 'src/lib/data/bcomBanLongLessons.ts'),
        'bcom_dmkt': ('src/lib/data/bcomDigitalMarketing30DayData.ts', 'src/lib/data/bcomDigitalMarketingLongLessons.ts'),
        'bcom_ecom': ('src/lib/data/bcomEcommerce30DayData.ts', 'src/lib/data/bcomEcomLongLessons.ts'),
        'bcom_ana': ('src/lib/data/bcomAnalytics30DayData.ts', 'src/lib/data/bcomAnalyticsLongLessons.ts'),
    }
    
    cfg, les = courses_map.get(course, (f'src/lib/data/{course}30DayData.ts', f'src/lib/data/{course}LongLessons.ts'))
    audit_course_day_by_day(cfg, les, course)

