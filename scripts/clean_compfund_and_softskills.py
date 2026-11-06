import re

def clean_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern matches: and verified its core production invariant (OptionalPrefix: text)
    # Replaces with: . Key takeaway: text
    pattern = re.compile(r'\s+and verified its core production invariant\s*\((?:[^:)\n]+:\s*)?(.*?)\)', re.DOTALL)
    
    matches = pattern.findall(content)
    print(f"{path}: found {len(matches)} matches")
    
    if len(matches) > 0:
        cleaned = pattern.sub(r'. Key takeaway: \1', content)
        with open(path, 'w', encoding='utf-8', newline='') as f:
            f.write(cleaned)
        print(f"{path}: updated successfully!")

clean_file('src/lib/data/compFundLongLessons.ts')
clean_file('src/lib/data/softSkillsLongLessons.ts')
