with open('src/lib/data/iotNetLongLessons.ts', 'r', encoding='utf-8') as f:
    content = f.read()

count = content.count('"course": "IoT Networking & Cloud Protocols"')
fixed = content.replace('"course": "IoT Networking & Cloud Protocols"', '"coursePrefix": "iot_net"')
with open('src/lib/data/iotNetLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(fixed)

print(f"Replaced {count} instances of course with coursePrefix")
