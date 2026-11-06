with open("src/lib/data/iotSecLongLessons.ts", "r", encoding="utf-8") as f:
    text = f.read()

# Let's parse the array by slicing from the first '[' to the last ']'
start_idx = text.find("export const IOT_SEC_LONG_LESSONS: LongLesson[] = [")
if start_idx == -1:
    raise ValueError("Cannot find export")

array_str = text[start_idx + len("export const IOT_SEC_LONG_LESSONS: LongLesson[] = "):]
# Strip trailing ';'
array_str = array_str.strip()
if array_str.endswith(";"):
    array_str = array_str[:-1].strip()

import json
try:
    data = json.loads(array_str)
    print("Parsed JSON successfully! Number of lessons:", len(data))
    days_seen = [d["day"] for d in data]
    print("Days seen:", days_seen)
except Exception as e:
    print("Failed to parse as JSON directly:", e)
