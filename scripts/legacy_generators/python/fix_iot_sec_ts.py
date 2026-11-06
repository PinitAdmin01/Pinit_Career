import json

with open('src/lib/data/iotSecLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's locate Day 25's end
# Day 25 ends with:
#     ]
#   }
# }

marker = '"title": "Milestone 5: Resilient FOTA Ingestion, Anti-Rollback Enforcement & Remote Device Attestation Engine"'
idx = content.find(marker)
assert idx != -1, "Could not find Day 25 marker!"

# Find the closing brace of Day 25 object
# It's followed by "projectStep" and its closing brace
proj_idx = content.find('"projectStep"', idx)
# find the closing } of day 25
d25_end = content.find('\n  }\n}', proj_idx)
assert d25_end != -1, "Could not find Day 25 end!"
d25_end += len('\n  }\n}')

print("Day 25 ends at character:", d25_end)
print("Snippet around Day 25 end:")
print(repr(content[d25_end-50:d25_end+50]))

clean_head = content[:d25_end]

# Load verified block 6 days
with open('scripts/block6_iot_sec_all_days.json', 'r', encoding='utf-8') as f:
    b6 = json.load(f)

formatted_days = []
for d in b6:
    formatted_days.append("  " + json.dumps(d, indent=2).replace("\n", "\n  "))

final_content = clean_head + ",\n" + ",\n".join(formatted_days) + "\n];\n"

with open('src/lib/data/iotSecLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Successfully cleaned and assembled src/lib/data/iotSecLongLessons.ts!")
