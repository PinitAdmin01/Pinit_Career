import os, glob, re, json
from pathlib import Path

def audit_avatar():
    data_dir = Path("src/lib/data")
    longlesson_files = sorted(list(data_dir.glob("*LongLessons.ts")))
    
    results = []
    
    for p in longlesson_files:
        text = p.read_text(encoding="utf-8", errors="ignore")
        # Find parts with say
        # Count say occurrences
        say_matches = re.findall(r'\"say\"\s*:\s*(\[[^\]]*\]|\"[^\"]*\")', text)
        
        # Estimate total days
        days = set(re.findall(r'(?:\"day\"|day)\s*:\s*(\d+)', text))
        num_days = len(days)
        
        # Let's count string elements in "say" arrays
        # Roughly count how many say items per day
        all_speech_bubbles = len(re.findall(r'\"say\"\s*:\s*\[', text))
        # Count individual strings inside say
        # Or count total paragraphs
        paragraphs = len(re.findall(r'\"say\"\s*:\s*\[([^\]]+)\]', text))
        
        results.append({
            "file": p.name,
            "days": num_days,
            "parts_with_say": len(say_matches),
            "est_per_day": round(len(say_matches) / max(1, num_days), 1)
        })

    print(f"{'Filename':<32} | {'Days':<5} | {'Say Parts':<10} | {'Parts/Day':<10}")
    print("-" * 65)
    for r in results[:25]:
        print(f"{r['file']:<32} | {r['days']:<5} | {r['parts_with_say']:<10} | {r['est_per_day']:<10}")

if __name__ == '__main__':
    audit_avatar()
