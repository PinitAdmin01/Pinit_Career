# scripts/topup_day36.py
import json

with open("scripts/iot_net_day36.json", "r", encoding="utf-8") as f:
    d = json.load(f)

# Boost Part 3
p3_additions = [
    "From an RF receiver design perspective, the energy consumed during the Paging Time Window (PTW) is governed by baseband synchronization algorithms and channel estimation. When the device wakes up for a 2.56-second PTW, it does not instantly open the PDCCH decoder. It must first lock its phase-locked loop (PLL) onto the eNodeB's primary and secondary synchronization signals (PSS and SSS), determine the current physical cell ID (PCI), and compensate for oscillator temperature drift. On low-cost crystal oscillators, frequency drift can exceed several parts per million, requiring multiple milliseconds of correlator operation before paging frame boundaries can be detected.",
    "Furthermore, cellular operators implement Hyper-SFN (Hyper System Frame Number) architectures to coordinate eDRX across vast geographical tracking areas. Standard LTE frames wrap around every 10.24 seconds (1024 system frames of 10 ms each). Because eDRX cycles can extend up to thousands of seconds, 3GPP introduced the 10-bit Hyper-SFN counter, which increments every 10.24 seconds and ranges up to 1024 Hyper-Frames (providing a total continuous timing reference spanning approximately 2.91 hours). Both the cell tower and the IoT edge device maintain synchronized H-SFN counters, guaranteeing that the device wakes up at the exact millisecond the base station schedules its P-RNTI paging occasion."
]
d["parts"][2]["say"].extend(p3_additions)

# Boost Part 4
p4_additions = [
    "In mission-critical industrial deployments, cellular modem firmware must also handle intermittent network disconnections, cell re-selection, and asynchronous network rejections. When an IoT device roams across cell borders or encounters poor signal-to-interference-plus-noise ratios (SINR), the cellular base station may reject an initial Tracking Area Update with specific 3GPP EMM (EPS Mobility Management) cause codes. Common EMM cause codes include Cause #11 (PLMN not allowed), Cause #12 (Tracking Area not allowed), Cause #13 (Roaming not allowed in this tracking area), or Cause #15 (No suitable cells in tracking area).",
    "A resilient AT command driver must parse these EMM reject causes and execute intelligent fallback policies. If the network returns Cause #11 or #13, repeatedly hammering the cell tower with AT+COPS=0 (automatic operator selection) will violate operator fair-use policies and may result in the SIM card being permanently blacklisted by the carrier's Home Subscriber Server (HSS). Instead, the driver's finite state machine must implement exponential backoff, switch to alternative Public Land Mobile Networks (PLMNs) via AT+COPS=1, or evaluate secondary carrier profiles stored on the multi-IMSI SIM card.",
    "Additionally, modern cellular modems support Wake-Up Signal (WUS) decoding, standardized in 3GPP Release 15. WUS is an ultra-low-power physical layer signal transmitted by the cell tower just prior to the paging occasion. By listening for the narrow-bandwidth WUS (which can be detected using minimal baseband processing), the modem determines whether a full paging message will follow. If no WUS is detected, the modem immediately aborts the remainder of the Paging Time Window and returns to sleep, saving up to 70% of the energy normally consumed during blank PTW wakeups."
]
d["parts"][3]["say"].extend(p4_additions)

# Boost Part 5
p5_additions = [
    "To achieve deterministic ten-year longevity in harsh outdoor environments, thermal derating must be factored into the electro-chemical model. Primary lithium-thionyl chloride (Li-SOCl2) batteries experience severe passivation at ambient temperatures below -20 degrees Celsius or above +60 degrees Celsius. When an underground water meter or agricultural soil sensor operates in sub-zero winter temperatures, the battery's internal resistance increases substantially, creating a pronounced voltage drop (transient minimum voltage) during high-current 200 mA cellular transmission bursts.",
    "If the terminal voltage drops below the cellular modem's minimum operating cutoff threshold (typically 3.0 to 3.1 volts), the baseband processor will suffer a brownout reset, corrupting flash memory and triggering an uncontrolled reboot loop that destroys the remaining battery capacity within days. High-reliability industrial designs circumvent this by placing an ultra-low-leakage hybrid layer capacitor (HLC) or supercapacitor in parallel with the Li-SOCl2 primary cell. The battery trickle-charges the capacitor during quiescent PSM sleep, and the capacitor supplies the instantaneous high-current pulses required during cellular transmission bursts, ensuring rock-solid voltage stability across extreme temperature ranges."
]
d["parts"][4]["say"].extend(p5_additions)

with open("scripts/iot_net_day36.json", "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2)

print("Applied additions to Day 36 parts 3, 4, and 5.")

# Check words
total_words = 0
for idx, p in enumerate(d["parts"]):
    wc = sum(len(s.split()) for s in p["say"])
    total_words += wc
    print(f"Part {idx+1}: {wc} words")
print(f"Total Spoken Words: {total_words} words")
