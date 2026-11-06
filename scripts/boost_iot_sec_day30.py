# scripts/boost_iot_sec_day30.py
import json

def boost_day30():
    with open('scripts/iot_sec_day30.json', 'r', encoding='utf-8') as f:
        d = json.load(f)

    p1_add = [
        "In defending the master architectural blueprint before the Senior Examination Board, the candidate must articulate how the six subsystems reinforce one another under a defense-in-depth philosophy. A common design flaw in naive embedded implementations is 'hardening the perimeter while leaving the core defenseless'. If a system relies solely on TLS transport security, an attacker who obtains physical access to the edge node can tap the unencrypted SPI flash lines or attach a logic analyzer to the external memory bus.",
        "Conversely, an implementation that encrypts external memory but fails to sandbox non-secure network stacks can be subverted remotely via an unauthenticated buffer overflow. The ApexSentry architecture eliminates both vulnerability classes by ensuring that physical silicon security (PUF and eFuses), external bus shields (AES-XTS), software execution sandboxing (TrustZone and MPU), network identity (IEEE 802.1AR and TLS 1.3), resilient updates (dual-bank FOTA with anti-rollback), and authenticated storage (AES-GCM NVS) operate concurrently as an integrated security fabric."
    ]

    p2_add = [
        "During physical hardware interrogation, the viva board specifically queries the vulnerability of SRAM PUF architectures to temperature variations and silicon burn-in effects. At extreme cold temperatures (-40 C) or elevated industrial heat (+105 C), uninitialized SRAM threshold voltages drift slightly, increasing the bit-flip error rate from 3% up to 10%. The Principal Security Architect must demonstrate that the Fuzzy Extractor's error-correction budget (such as a multi-error correcting BCH code) provides sufficient margin to reliably reconstruct the identical Unique Device Secret across the full industrial temperature envelope.",
        "Furthermore, the board inspects the exact mechanics of eFuse programming. Unlike software configuration registers stored in flash or EEPROM that can be overwritten by compromised firmware, an eFuse is a physical hardware circuit element. When the bootloader issues the programming command, a specialized on-chip charge pump drives the high-voltage programming rail, physically rupturing the polysilicon link. This alteration changes the electrical resistance from tens of ohms to gigohms, establishing an immutable one-way state transition that cannot be reversed by any software exploit, electromagnetic pulse, or voltage glitch."
    ]

    p3_add = [
        "When examining TrustZone-M isolation, the viva committee focuses on potential gateway vulnerabilities and cross-boundary confused deputy attacks. A naive NSC veneer that accepts unvalidated pointers from non-secure code creates an immediate privilege escalation vector. For example, if a non-secure caller invokes an NSC encryption function and passes a source pointer pointing into the Secure RAM region, the secure core might inadvertently read protected key material or overwrite critical vector tables.",
        "To prevent confused deputy vulnerabilities, the ApexSentry architecture enforces strict TT (Test Target) assembly instructions and pointer validation routines inside every NSC entry stub. The secure handler checks that all input and output buffers reside strictly within Non-Secure memory regions before performing any cryptographic operation. If an illegal pointer is detected, the gateway immediately returns an access violation error code, logs the intrusion attempt to secure audit memory, and prevents the cross-boundary data transfer.",
        "Regarding the TLS 1.3 implementation, the board evaluates how the bare-metal stack mitigates side-channel timing leaks during cryptographic handshake computations. Ephemeral curve arithmetic (such as Curve25519 or NIST P-256 scalar multiplication) must be executed using constant-time algorithms (such as the Montgomery ladder) to ensure that execution time is completely independent of the private key bits, neutralizing high-resolution oscilloscope timing attacks across the power supply pins."
    ]

    p4_add = [
        "In evaluating FOTA resilience and remote attestation, the review panel examines edge failure scenarios: What happens if an adversary induces a power brownout exactly as the bootloader is updating the active bank pointer or programming the eFuse monotonic counter? In the ApexSentry dual-bank design, bank switching is governed by an atomic metadata structure located in dedicated flash sectors protected by CRC32 checksums and write-erase cycle wear leveling.",
        "The bootloader follows a strict two-phase commit protocol: Bank B is validated and booted in a provisional 'trial mode'. The candidate application executes a comprehensive power-on self-test and communicates with the local watchdogs. Only when the candidate application successfully passes all runtime sanity checks does it issue a confirmation call to the secure bootloader, which then marks the bank transition as permanent and advances the eFuse monotonic counter.",
        "If power is cut at any point prior to this confirmation, the hardware watchdog forces a reset, the bootloader detects an incomplete trial boot, rolls back immediately to the proven application in Bank A, and reports an update abort event. This fail-safe architecture ensures that even catastrophic power interruptions or network dropouts cannot render the industrial edge sentinel inoperable."
    ]

    p5_add = [
        "During the comprehensive viva defense of the ApexSentryGrandMasterEngine, the candidate demonstrates the culmination of all Month 1 competencies. In answering the board's challenging questions, the candidate explains the critical trade-offs between security, execution latency, and silicon gate count. For example, implementing hardware AES-XTS on external memory buses introduces a minor memory access latency (typically 2 to 4 bus clock cycles per sector fetch); however, this latency is easily absorbed by the microcontroller's instruction cache (I-Cache) and data cache (D-Cache), while providing absolute protection against physical bus probing.",
        "Similarly, while maintaining redundant dual-bank flash partitions increases overall flash memory requirements by 100%, it completely eliminates the business-critical risk of field unit bricking and truck-roll service calls across thousands of geographically remote industrial installations.",
        "By systematically validating every layer—from the silicon atomic level through bare-metal operating system primitives to zero-trust cloud communication—the candidate proves that the ApexSentry Industrial Secure Edge Sentinel is an enterprise-grade, certified cyber-physical computing platform. With all ten Senior Review Board interrogation challenges decisively answered and all programmatic tests passing with zero errors, the candidate is awarded formal certification for Month 1 of IoT Hardware Security, Root of Trust & Secure Boot."
    ]

    d['parts'][0]['say'].extend(p1_add)
    d['parts'][1]['say'].extend(p2_add)
    d['parts'][2]['say'].extend(p3_add)
    d['parts'][3]['say'].extend(p4_add)
    d['parts'][4]['say'].extend(p5_add)

    with open('scripts/iot_sec_day30.json', 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2)

    print("Day 30 boosted successfully!")

if __name__ == '__main__':
    boost_day30()
