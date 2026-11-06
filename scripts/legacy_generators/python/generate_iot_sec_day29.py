import json

def generate_day29():
    day29 = {
        "coursePrefix": "iot_sec",
        "day": 29,
        "title": "Principal Embedded Security Architect Review: Threat Modeling & FIPS 140-3 Compliance",
        "goal": "Master enterprise threat modeling across the STRIDE-IoT framework, evaluate cryptographic subsystems against FIPS 140-3 security levels 1–4, map controls to Common Criteria (CC) EAL4+ and PSA Certified Level 3, and construct bare-metal Known-Answer Test (KAT) power-on self-test engines.",
        "minutes": 38,
        "recap": "Over the past 28 days, we built physical roots of trust, encrypted memory buses, TrustZone sandboxes, IEEE 802.1AR PKI, dual-bank FOTA, anti-rollback eFuses, and encrypted NVS. Today we operate as Principal Embedded Security Architects, formally evaluating this architecture against FIPS 140-3, STRIDE, and Common Criteria standards ahead of the Month 1 Capstone.",
        "parts": [
            {
                "title": "STRIDE-IoT Threat Modeling & Security Target Boundaries",
                "say": [
                    "As a Principal Embedded Security Architect preparing to defend an industrial edge system before an enterprise certification board or chief information security officer (CISO), engineering cannot rely on vague claims of 'being secure'. Enterprise defense requires formal, exhaustive Threat Modeling. The industry standard methodology for embedded and cyber-physical systems is STRIDE-IoT.",
                    "STRIDE systematically decomposes threats across six fundamental vectors: 1) Spoofing: An adversary masquerades as an authentic edge device. In our architecture, this is mitigated by IEEE 802.1AR Initial Device Identifiers (IDevID) and hardware-anchored mutual TLS; 2) Tampering: An attacker modifies firmware binaries or stored calibration tables. This is neutralized by asymmetric Ed25519 signature verification, secure boot chains, and AEAD-encrypted NVS; 3) Repudiation: A device denies transmitting critical telemetry or executing an actuation command. This is mitigated through TCG DICE attestation proofs and asymmetric transaction signing; 4) Information Disclosure: An attacker intercepts plaintext data over external SPI buses or radio links. This is eliminated via AES-XTS bus encryption and TLS 1.3 transport security; 5) Denial of Service: Flood attacks starve network socket pools or crash the RTOS. This is countered by token-bucket rate limiting and port lockdown; 6) Elevation of Privilege: Memory corruption in an unprivileged sensor parser compromises the system core. This is prevented by ARM TrustZone SAU boundaries and PMSAv8 MPU subregion fences.",
                    "By constructing a formal STRIDE-IoT matrix, the architect maps every identified threat to an implemented, verified cryptographic or hardware countermeasure, providing an unbroken audit trail of defensibility."
                ],
                "example": "Let us evaluate our complete embedded security platform across all six STRIDE-IoT threat categories.",
                "code": "stride_matrix = {\n    \"Spoofing\": {\"threat\": \"Rogue Device Impersonation\", \"control\": \"IEEE 802.1AR IDevID + mTLS\", \"status\": \"MITIGATED\"},\n    \"Tampering\": {\"threat\": \"Flash Firmware Modification\", \"control\": \"Ed25519 Secure Boot + Hash Chains\", \"status\": \"MITIGATED\"},\n    \"Repudiation\": {\"threat\": \"Forged Sensor Telemetry\", \"control\": \"DICE Remote Attestation Signatures\", \"status\": \"MITIGATED\"},\n    \"Information Disclosure\": {\"threat\": \"SPI Flash Bus Probing\", \"control\": \"AES-XTS Flash Encryption + Encrypted NVS\", \"status\": \"MITIGATED\"},\n    \"Denial of Service\": {\"threat\": \"TCP SYN Flooding / Socket Starvation\", \"control\": \"Token-Bucket Rate Limiter + Port Lockdown\", \"status\": \"MITIGATED\"},\n    \"Elevation of Privilege\": {\"threat\": \"Buffer Overflow in Non-Secure World\", \"control\": \"TrustZone SAU + PMSAv8 MPU Sandboxing\", \"status\": \"MITIGATED\"}\n}\n\nmitigated_count = sum(1 for m in stride_matrix.values() if m[\"status\"] == \"MITIGATED\")\nprint(\"STRIDE-IoT Matrix Categories Evaluated:\", len(stride_matrix))\nprint(\"Total Threats Mitigated:\", mitigated_count)\nprint(\"Security Posture:\", \"CERTIFIED_HARDENED\" if mitigated_count == 6 else \"VULNERABILITIES_PENDING\")",
                "output": "STRIDE-IoT Matrix Categories Evaluated: 6\nTotal Threats Mitigated: 6\nSecurity Posture: CERTIFIED_HARDENED",
                "codeNotes": [
                    "Decomposes embedded edge threats across all six STRIDE categories.",
                    "Maps specific Month 1 hardware and cryptographic controls to identified threats.",
                    "Calculates total mitigation coverage to confirm certification readiness."
                ],
                "tryIt": "Set the status of 'Information Disclosure' to 'UNMITIGATED' and observe that Security Posture transitions to VULNERABILITIES_PENDING.",
                "check": {
                    "question": "What is the primary role of the STRIDE-IoT methodology in embedded security architecture?",
                    "options": [
                        "Systematically identify threat vectors across Spoofing, Tampering, Repudiation, Information Disclosure, DoS, and Elevation of Privilege to ensure complete countermeasure coverage.",
                        "Speed up Python compilation into native machine code.",
                        "Design aerodynamic enclosures for outdoor sensors.",
                        "Calculate battery discharge curves in solar microgrids."
                    ],
                    "answer": 0,
                    "why": "STRIDE provides a comprehensive framework ensuring that every threat category is analyzed and paired with an effective architectural mitigation."
                }
            },
            {
                "title": "FIPS 140-3 Cryptographic Module Standards (Levels 1–4)",
                "say": [
                    "In government, defense, aerospace, and critical infrastructure markets, security claims must be validated through formal government benchmarking. The international gold standard is FIPS 140-3 (Security Requirements for Cryptographic Modules), aligned with ISO/IEC 19790:2012.",
                    "FIPS 140-3 establishes four escalating Security Levels: 1) Level 1: Basic algorithmic correctness. The module must employ CAVP-approved algorithms (e.g. NIST-validated AES, SHA-256) running on general-purpose hardware with basic documentation; 2) Level 2: Role-based authentication and physical tamper evidence (such as tamper-evident seals or pick-resistant locks); 3) Level 3: Identity-based operator authentication, physical separation of interfaces, active environmental tamper detection, and automatic zeroization of plaintext Secret Security Parameters (SSPs); 4) Level 4: Complete physical envelope protection with environmental failure protection (EFP) defending against extreme voltage/temperature tampering.",
                    "Our Month 1 Apex security architecture is explicitly designed to meet FIPS 140-3 Level 3 benchmarks: it enforces hardware eFuse identity, role-based key lifecycles, active chassis tamper monitoring, and sub-microsecond volatile memory zeroization."
                ],
                "example": "Let us evaluate our system capabilities against FIPS 140-3 Security Levels 1 through 4.",
                "code": "fips_requirements = {\n    \"Level 1\": [\"Approved Cryptographic Algorithms\", \"Basic Software Testing\"],\n    \"Level 2\": [\"Role-Based Authentication\", \"Physical Tamper Evidence\"],\n    \"Level 3\": [\"Identity-Based Authentication\", \"Active Tamper Detection & Zeroization\"],\n    \"Level 4\": [\"Environmental Failure Protection\", \"Complete Active Envelope Shielding\"]\n}\n\napex_capabilities = {\n    \"Approved Cryptographic Algorithms\", \"Basic Software Testing\",\n    \"Role-Based Authentication\", \"Physical Tamper Evidence\",\n    \"Identity-Based Authentication\", \"Active Tamper Detection & Zeroization\"\n}\n\ndef assess_level(lvl: str) -> bool:\n    reqs = set(fips_requirements[lvl])\n    return reqs.issubset(apex_capabilities)\n\nprint(\"FIPS 140-3 Level 1:\", \"COMPLIANT\" if assess_level(\"Level 1\") else \"NON_COMPLIANT\")\nprint(\"FIPS 140-3 Level 2:\", \"COMPLIANT\" if assess_level(\"Level 2\") else \"NON_COMPLIANT\")\nprint(\"FIPS 140-3 Level 3:\", \"COMPLIANT\" if assess_level(\"Level 3\") else \"NON_COMPLIANT\")\nprint(\"FIPS 140-3 Level 4:\", \"COMPLIANT\" if assess_level(\"Level 4\") else \"NON_COMPLIANT\")",
                "output": "FIPS 140-3 Level 1: COMPLIANT\nFIPS 140-3 Level 2: COMPLIANT\nFIPS 140-3 Level 3: COMPLIANT\nFIPS 140-3 Level 4: NON_COMPLIANT",
                "codeNotes": [
                    "Evaluates hardware and software features against ISO/IEC 19790 / FIPS 140-3 tiers.",
                    "Confirms Level 3 compliance through identity authentication and active tamper zeroization.",
                    "Identifies Level 4 requirements (complete active envelope shielding) for future revisions."
                ],
                "tryIt": "Add 'Complete Active Envelope Shielding' and 'Environmental Failure Protection' to apex_capabilities and verify Level 4 reaches COMPLIANT.",
                "check": {
                    "question": "What key architectural capability distinguishes FIPS 140-3 Level 3 from Level 2?",
                    "options": [
                        "Active physical tamper detection and automatic zeroization of plaintext Secret Security Parameters (SSPs), combined with identity-based authentication.",
                        "Using 512-bit AES keys instead of 256-bit keys.",
                        "Requiring all software to be written in Rust.",
                        "Eliminating the need for a hardware CPU."
                    ],
                    "answer": 0,
                    "why": "Level 3 mandates active physical tamper sensing that automatically zeroizes plaintext keys upon intrusion, moving beyond passive tamper-evident seals."
                }
            },
            {
                "title": "Common Criteria (CC) Protection Profiles & PSA Certified Levels",
                "say": [
                    "Complementing FIPS 140-3 in commercial and semiconductor markets are Common Criteria for Information Technology Security Evaluation (ISO/IEC 15408) and Arm's Platform Security Architecture (PSA Certified).",
                    "Under Common Criteria, products are evaluated against standardized Protection Profiles (PP) to achieve an Evaluation Assurance Level (EAL1 through EAL7). For secure microcontrollers and smartcards, the benchmark is BSI-CC-PP-0084 (Security IC Platform Protection Profile) targeting EAL4+ or EAL5+, requiring rigorous mathematical and laboratory resistance against side-channel analysis, fault injection, and physical probing.",
                    "In the connected IoT ecosystem, Arm established PSA Certified: 1) Level 1: Formal threat modeling and architectural security assessment; 2) Level 2: Independent lab-based white-box software testing evaluating resistance against remote scalable software attacks; 3) Level 3: Rigorous physical testing evaluating silicon-level hardware attack resistance, including side-channel power analysis and voltage glitching.",
                    "Our Month 1 architecture aligns directly with PSA Certified Level 3 targets, pairing physical silicon root of trust anchors with robust software MPU sandboxing."
                ],
                "example": "Let us inspect the PSA Certified and Common Criteria target assurance levels for our bare-metal architecture.",
                "code": "psa_levels = {\n    1: \"Analysis & Threat Modeling Validation\",\n    2: \"Software-Based Attack Resistance & White-Box Testing\",\n    3: \"Silicon-Level Hardware Attack Resistance & Physical Tamper Proofing\"\n}\n\napex_psa_level = 3\ncc_assurance_level = \"EAL4+\"\n\nprint(f\"Platform Security Architecture Target: PSA Certified Level {apex_psa_level}\")\nprint(f\"PSA Level 3 Scope: {psa_levels[apex_psa_level]}\")\nprint(f\"Common Criteria Target Assurance : {cc_assurance_level}\")",
                "output": "Platform Security Architecture Target: PSA Certified Level 3\nPSA Level 3 Scope: Silicon-Level Hardware Attack Resistance & Physical Tamper Proofing\nCommon Criteria Target Assurance : EAL4+",
                "codeNotes": [
                    "Maps system capabilities to PSA Certified Level 3 hardware attack resistance.",
                    "Defines Common Criteria target assurance at EAL4+ (methodically designed, tested, and reviewed).",
                    "Provides clear certification targets for enterprise industrial deployments."
                ],
                "tryIt": "Print the scope for PSA Certified Level 2 and verify its focus on software attack resistance.",
                "check": {
                    "question": "What is the primary evaluation focus of Arm PSA Certified Level 3?",
                    "options": [
                        "Silicon-level hardware attack resistance, including physical tampering, side-channel power analysis, and fault injection defenses.",
                        "Speed of Wi-Fi connection establishment.",
                        "User interface design and icon color palette.",
                        "Cloud server database query optimization."
                    ],
                    "answer": 0,
                    "why": "PSA Certified Level 3 evaluates resistance against sophisticated laboratory physical attacks targeting the silicon chip directly."
                }
            },
            {
                "title": "The Known-Answer Test (KAT) Power-On Self-Test (POST) Engine",
                "say": [
                    "A mandatory invariant across both FIPS 140-3 (Section 9.2) and Common Criteria is the execution of Power-On Self-Tests (POST) before granting access to cryptographic services.",
                    "If a microcontroller's hardware cryptographic accelerator suffers an internal silicon defect—such as an arithmetic logic unit (ALU) stuck-at fault or corrupted S-Box lookup table—the accelerator might generate flawed ciphertexts or accept invalid digital signatures without flagging an error.",
                    "To detect hardware faults before operational data is processed, the Boot ROM executes Known-Answer Tests (KAT). A KAT feeds standardized, pre-computed input vectors into the cryptographic engine and compares the output against a known-good mathematical reference string.",
                    "For example, feeding the standard string 'abc' into SHA-256 must yield exactly ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad. If the hardware core produces even a single bit divergence, the POST fails, the cryptographic core is marked as FAULT_HALTED, and the boot sequence halts before any application keys can be compromised."
                ],
                "example": "Let us execute a Power-On Self-Test runner performing Known-Answer Tests (KAT) for SHA-256 and HMAC.",
                "code": "import hashlib\nimport hmac\n\ntest_input = b\"abc\"\nexpected_sha256 = \"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad\"\n\nactual_sha256 = hashlib.sha256(test_input).hexdigest()\nsha256_pass = actual_sha256 == expected_sha256\n\nhmac_key = b\"key\"\nhmac_msg = b\"The quick brown fox jumps over the lazy dog\"\nexpected_hmac = \"f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8\"\nactual_hmac = hmac.new(hmac_key, hmac_msg, hashlib.sha256).hexdigest()\nhmac_pass = actual_hmac == expected_hmac\n\nprint(f\"Power-On Self-Test: SHA-256 KAT: {'PASSED' if sha256_pass else 'FAILED'}\")\nprint(f\"Power-On Self-Test: HMAC   KAT: {'PASSED' if hmac_pass else 'FAILED'}\")\nprint(f\"Cryptographic Engine Status     : {'READY' if (sha256_pass and hmac_pass) else 'FAULT_HALTED'}\")",
                "output": "Power-On Self-Test: SHA-256 KAT: PASSED\nPower-On Self-Test: HMAC   KAT: PASSED\nCryptographic Engine Status     : READY",
                "codeNotes": [
                    "Executes Known-Answer Tests (KAT) over fixed NIST test vectors on startup.",
                    "Verifies SHA-256 and HMAC cryptographic core integrity before application launch.",
                    "Enforces hard boot failure if hardware cores produce mathematical divergence."
                ],
                "tryIt": "Alter expected_sha256 by one character and verify that Cryptographic Engine Status transitions to FAULT_HALTED.",
                "check": {
                    "question": "Why do FIPS 140-3 and Common Criteria mandate Known-Answer Tests (KAT) during boot?",
                    "options": [
                        "To verify that hardware cryptographic cores and ALUs have suffered no silicon defects or stuck-at faults before processing sensitive keys.",
                        "To calibrate the internal real-time clock oscillator.",
                        "To format external SPI flash memory on every reboot.",
                        "To generate new public keys for user accounts."
                    ],
                    "answer": 0,
                    "why": "KAT tests ensure cryptographic engines compute mathematically correct outputs before processing live keys or verifying signatures."
                }
            },
            {
                "title": "ApexSecurityAuditEngine: Pre-Capstone Architectural Review Framework",
                "say": [
                    "To synthesize STRIDE threat modeling, FIPS 140-3 benchmarks, PSA Certified targets, and power-on self-test validation into a unified architectural assessment tool, we construct the ApexSecurityAuditEngine.",
                    "At initialization, the engine executes the mandatory Power-On Self-Test suite. If the cryptographic accelerator passes all KAT vectors, the engine unlocks the architectural audit pipeline.",
                    "The audit pipeline ingests the complete inventory of implemented security controls across Month 1: 1) Physical Root of Trust & PUF; 2) AES-XTS Flash Encryption; 3) TrustZone & MPU Isolation; 4) IEEE 802.1AR PKI Identity; 5) Dual-Bank FOTA & eFuse Anti-Rollback; 6) Encrypted NVS with AEAD; and 7) Active Tamper Zeroization.",
                    "The engine calculates total architectural coverage and evaluates compliance against FIPS 140-3 Level 3 and PSA Certified Level 3 standards. By achieving 100% control coverage and passing all self-tests, the Apex security platform demonstrates complete readiness for tomorrow's Month 1 Grand Capstone Viva Gate."
                ],
                "example": "Let us execute the ApexSecurityAuditEngine to verify POST execution, calculate control coverage, and confirm PSA Certified Level 3 readiness.",
                "code": "import hashlib\n\nclass ApexSecurityAuditEngine:\n    def __init__(self):\n        self.post_passed = False\n        self.stride_score = 0\n        self.fips_level = 0\n\n    def run_power_on_self_test(self) -> bool:\n        act_sha = hashlib.sha256(b\"abc\").hexdigest()\n        exp_sha = \"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad\"\n        if act_sha != exp_sha:\n            return False\n        self.post_passed = True\n        return True\n\n    def audit_system_architecture(self, controls: dict) -> dict:\n        if not self.post_passed:\n            return {\"status\": \"FAILED_POST\", \"score\": 0}\n        \n        passed_controls = sum(1 for v in controls.values() if v)\n        total_controls = len(controls)\n        self.stride_score = (passed_controls / total_controls) * 100\n        \n        if passed_controls == total_controls:\n            self.fips_level = 3\n            status = \"CERTIFIED_LEVEL_3\"\n        else:\n            self.fips_level = 1\n            status = \"PARTIAL_COMPLIANCE\"\n            \n        return {\n            \"status\": status,\n            \"coverage_pct\": self.stride_score,\n            \"fips_level\": self.fips_level,\n            \"psa_certified\": \"PSA_LEVEL_3_READY\" if self.fips_level == 3 else \"PSA_LEVEL_1\"\n        }\n\nengine = ApexSecurityAuditEngine()\npost_ok = engine.run_power_on_self_test()\n\napex_controls = {\n    \"secure_boot\": True,\n    \"flash_encryption\": True,\n    \"trustzone_mpu\": True,\n    \"pki_identity\": True,\n    \"fota_rollback\": True,\n    \"encrypted_nvs\": True,\n    \"tamper_zeroize\": True\n}\n\naudit_res = engine.audit_system_architecture(apex_controls)\n\nprint(f\"POST Verification Status: {post_ok}\")\nprint(f\"Audit Architecture Score: {audit_res['coverage_pct']:.0f}%\")\nprint(f\"Assigned Compliance Tier: {audit_res['status']} ({audit_res['psa_certified']})\")",
                "output": "POST Verification Status: True\nAudit Architecture Score: 100%\nAssigned Compliance Tier: CERTIFIED_LEVEL_3 (PSA_LEVEL_3_READY)",
                "codeNotes": [
                    "Coordinates cryptographic power-on self-tests and comprehensive architectural auditing.",
                    "Calculates security coverage percentage across all implemented Month 1 controls.",
                    "Confirms certification readiness for FIPS 140-3 Level 3 and PSA Certified Level 3."
                ],
                "tryIt": "Set 'tamper_zeroize' to False in apex_controls and verify that status becomes PARTIAL_COMPLIANCE.",
                "check": {
                    "question": "What is the primary role of the ApexSecurityAuditEngine ahead of the Month 1 Capstone?",
                    "options": [
                        "Synthesize self-test verification, STRIDE threat coverage, and FIPS/PSA compliance into an objective pre-capstone certification assessment.",
                        "Recompile C firmware into HTML webpages.",
                        "Manage customer billing accounts.",
                        "Download third-party games onto the device."
                    ],
                    "answer": 0,
                    "why": "The engine provides an objective architectural evaluation, confirming that all Month 1 security controls are implemented and compliant."
                }
            }
        ],
        "summary": [
            "STRIDE-IoT threat modeling systematically maps edge attack vectors to specific hardware, cryptographic, and software countermeasures.",
            "FIPS 140-3 Level 3 establishes rigorous benchmarks for identity authentication, active physical tamper detection, and emergency zeroization.",
            "Common Criteria EAL4+ and Arm PSA Certified Level 3 evaluate silicon-level resistance against physical probing, side-channel analysis, and glitching.",
            "Known-Answer Test (KAT) power-on self-tests verify cryptographic accelerator integrity before sensitive keys or signatures are processed."
        ],
        "projectStep": {
            "title": "Principal Embedded Security Architect Audit & Compliance Engine Integration",
            "steps": [
                "Map all Month 1 security subsystems across the STRIDE-IoT threat modeling matrix.",
                "Implement Known-Answer Test (KAT) power-on self-test routines for SHA-256 and HMAC hardware accelerators.",
                "Benchmark system capabilities against FIPS 140-3 Security Levels 1–4 and Arm PSA Certified Level 3 criteria.",
                "Integrate the unified ApexSecurityAuditEngine to generate formal compliance readiness reports for the Month 1 Capstone defense."
            ]
        }
    }
    with open('scripts/iot_sec_day29.json', 'w', encoding='utf-8') as f:
        json.dump(day29, f, indent=2)
    print("Generated base Day 29 in scripts/iot_sec_day29.json")

if __name__ == '__main__':
    generate_day29()
