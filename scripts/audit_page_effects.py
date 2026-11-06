import os
import re

pages = [
    'src/app/dashboard/page.tsx',
    'src/app/quests/page.tsx',
    'src/app/missions/page.tsx',
    'src/app/interview/page.tsx',
    'src/app/group-discussion/page.tsx',
    'src/app/arena/page.tsx',
    'src/app/friends/page.tsx',
    'src/app/leaderboard/page.tsx',
]

for p in pages:
    if os.path.exists(p):
        print(f"=== {p} ===")
        with open(p, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            # find all useEffects and what they call
            effects = re.findall(r'useEffect\s*\(\s*(?:async\s*)?\(\s*\)\s*=>\s*\{([\s\S]*?)\},\s*\[(.*?)\]\)', content)
            print(f"  Found {len(effects)} useEffects")
            for i, (body, deps) in enumerate(effects, 1):
                # find fetches or timeouts
                fetches = re.findall(r'''(?:fetch|api\.[a-z]+|supabase\.[a-z]+)\s*\(([^)]+)\)''', body)
                intervals = re.findall(r'''(?:setInterval|setTimeout)\s*\(([^)]+)\)''', body)
                if fetches or intervals or len(body.strip()) > 300:
                    print(f"    Effect #{i} (deps: [{deps.strip()}]):")
                    if fetches:
                        print(f"      Fetches: {fetches[:3]}")
                    if intervals:
                        print(f"      Timers: {intervals[:2]}")
