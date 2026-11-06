import re

p1_extra = '''    "To understand the physical implementation of dynamic channel provisioning, consider the Channel Frequency List (CFList) payload transmitted within the OTAA Join-Accept frame. In regions that utilize fixed default channels such as EU868, the Join-Accept frame optionally terminates with a 16-byte CFList field. Bytes 0 through 14 encode five distinct 24-bit channel center frequencies expressed in 100 Hz steps (for instance, 867.1 MHz is encoded as 0x844F58). Byte 15 defines the CFListType (0x00 for channel frequency lists, 0x01 for dynamic channel masks used in US915 and AU915). By parsing this field upon receiving the Join-Accept, the end device automatically expands its active channel roster from the 3 default frequencies to 8 operational carriers, distributing RF traffic across 1.6 MHz of spectrum.",
    "Furthermore, regional parameter implementations must account for strict transmitter power attenuation rules. Under ETSI EN 300 220, maximum radiated power in Sub-band g is capped at +14 dBm (25 mW) ERP, which translates to +16.15 dBm EIRP when accounting for dipole antenna gain. In sharp contrast, the US FCC allows maximum transmitter conducted output power up to +30 dBm (1.0 watt) with up to 6 dBi antenna gain, provided the transmitter implements pseudo-random frequency hopping across at least 50 non-overlapping channels. Operating an edge device with incorrect regional firmware not only risks severe electromagnetic interference with licensed public safety and aviation services, but also immediately triggers regulatory sanctions."
'''

p3_extra = '''    "A crucial architectural detail in production server-side ADR is multi-gateway diversity fusion. In an enterprise star-of-stars deployment, an uplink dispatched by an edge device is rarely heard by only a single gateway; typically, three to ten neighboring base stations decode the identical radio frame. When calculating the SNR value for the circular history buffer, the Network Server does not average the signals or pick an arbitrary gateway. Instead, it extracts the maximum demodulation SNR reported across all decoding gateways for that specific frame counter. This maximum-diversity selection ensures that the algorithm reflects the true optimal path available in the RF mesh.",
    "Moreover, the Network Server must handle device mobility and link dynamics defensively. If the device's uplink frame counter indicates that the device has cleared the ADR_ACK_LIMIT threshold (setting ADRACKReq = 1 in FCtrl), the Network Server prioritizes scheduling a downlink in the immediate RX1 or RX2 window containing a LinkADRReq command. This proactive downlink breaks the device's unacknowledged counter streak, preventing the node from triggering unnecessary fallback procedures and ensuring that the RF parameter state remains tightly synchronized between edge hardware and cloud infrastructure."
'''

p5_extra = '''    "The physical ramifications of this optimization extend directly into the electrochemical battery cell. In typical industrial sensors deployed in water meters, gas pipelines, and environmental monitors, the primary power source is a Lithium Thionyl Chloride (LiSOCl2) cell. These cells exhibit exceptional energy density and ultra-low self-discharge rates, but suffer from significant internal impedance when subjected to prolonged high-current discharge pulses. A 1,318-millisecond transmission at Spreading Factor 12 draws continuous 30 to 45 milliamperes from the cell, causing acute voltage sag that can trigger brown-out resets on low-voltage microcontrollers. By compressing transmission duration to 61.7 milliseconds at Spreading Factor 7, ADR mitigates cell passivation and eliminates voltage collapse, guaranteeing a decade of continuous field operation.",
    "Furthermore, this synthesis engine lays the direct empirical groundwork for Day 44, where we will construct the complete LoRaWAN Network Server (LNS) architecture. In that lesson, we will implement the Semtech UDP Packet Forwarder protocol, develop multi-gateway uplink deduplication with metadata fusion, and build the downlink scheduling engine that arbitrates between competing Class A RX1 and RX2 transmission opportunities under strict gateway duty-cycle limits."
'''

with open("scripts/build_day43.py", "r", encoding="utf-8") as f:
    content = f.read()

# Add extra paragraphs to p1_say
idx_p1 = content.find("p1_say = [")
idx_p1_end = content.find("]", idx_p1)
p1_slice = content[idx_p1:idx_p1_end].rstrip() + ",\n" + p1_extra + "\n]"
content = content[:idx_p1] + p1_slice + content[idx_p1_end+1:]

# Add extra paragraphs to p3_say
idx_p3 = content.find("p3_say = [")
idx_p3_end = content.find("]", idx_p3)
p3_slice = content[idx_p3:idx_p3_end].rstrip() + ",\n" + p3_extra + "\n]"
content = content[:idx_p3] + p3_slice + content[idx_p3_end+1:]

# Add extra paragraphs to p5_say
idx_p5 = content.find("p5_say = [")
idx_p5_end = content.find("]", idx_p5)
p5_slice = content[idx_p5:idx_p5_end].rstrip() + ",\n" + p5_extra + "\n]"
content = content[:idx_p5] + p5_slice + content[idx_p5_end+1:]

with open("scripts/build_day43.py", "w", encoding="utf-8") as f:
    f.write(content)

print("scripts/build_day43.py updated with expanded prose successfully.")
