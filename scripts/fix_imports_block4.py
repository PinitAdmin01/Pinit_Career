import json

def fix_imports():
    for day in [18, 19, 20]:
        path = f"scripts/iot_sec_day{day}.json"
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        for p in data["parts"]:
            code = p["code"]
            needed = []
            if "hashlib." in code and "import hashlib" not in code:
                needed.append("import hashlib")
            if "struct." in code and "import struct" not in code:
                needed.append("import struct")
            if "hmac." in code and "import hmac" not in code:
                needed.append("import hmac")
            
            if needed:
                p["code"] = "\n".join(needed) + "\n" + code

        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    print("Imports fixed in Days 18, 19, 20!")

if __name__ == "__main__":
    fix_imports()
