# scripts/topup_day55_p3_more.py
content = open("scripts/create_dist_day55_data.py", "r", encoding="utf-8").read()

p3_extra = " Additionally, shadow mirroring mirrors live production requests to canary clusters without returning canary responses to clients, validating canary performance with zero user risk."
content = content.replace("with sub-millisecond enforcement latency.", "with sub-millisecond enforcement latency." + p3_extra)

open("scripts/create_dist_day55_data.py", "w", encoding="utf-8").write(content)
print("Added extra words to Part 3.")
