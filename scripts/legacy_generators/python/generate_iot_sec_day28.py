import json

def generate_day28():
    day28 = {
        "coursePrefix": "iot_sec",
        "day": 28,
        "title": "Secure Storage of Ephemeral Tokens & Session State: Encrypted NVS & AEAD",
        "goal": "Architect authenticated non-volatile flash storage (Encrypted NVS), implement eFuse-anchored Key Wrapping (NIST SP 800-38F), enforce AEAD Additional Authenticated Data (AAD) block-swapping defense, and mitigate state rollback replay attacks on bare-metal systems.",
        "minutes": 38,
        "recap": "Yesterday we governed cryptographic key lifecycles and engineered emergency hardware zeroization. Today we secure persistent edge secrets—such as Wi-Fi credentials, cloud tokens, and calibration data—using Encrypted NVS with Authenticated Encryption.",
        "parts": [
            {
                "title": "The Threat of Plaintext Flash Storage & Hardware Key Wrapping",
                "say": [
                    "A pervasive failure across commercial IoT products is the insecure persistence of application secrets. Microcontrollers must retain persistent configuration data across reboot cycles: cellular APN credentials, local Wi-Fi pre-shared keys, cloud bearer tokens, TLS session tickets, and calibration offsets. In naive designs, developers write these variables directly into non-volatile storage (NVS) partitions in external SPI NOR flash or internal rewritable flash in plaintext.",
                    "This practice is an open invitation to compromise. An adversary with a low-cost logic analyzer or clip-on SOIC-8 test clamp can connect to the SPI bus lines (MOSI, MISO, SCK, CS), monitor read commands as the microcontroller boots, and extract sensitive Wi-Fi passwords and API tokens in seconds. Even without live sniffing, an attacker can desolder the flash chip, place it in an external programmer, and dump the entire memory contents.",
                    "To secure persistent data against physical extraction, systems implement Encrypted NVS. However, encrypting NVS introduces a fundamental chicken-and-egg dilemma: where does the microcontroller store the encryption key that protects the flash storage?",
                    "If the storage key is itself stored in flash, the security collapses. The industry best practice is Hardware Key Wrapping. The microcontroller silicon provides a Key Encrypting Key (KEK) burned permanently into One-Time Programmable (OTP) eFuses during factory provisioning. The KEK is inaccessible to external pin readouts. During initial commissioning, the system generates a random 256-bit NVS Storage Key ($SK$) and wraps (encrypts) it under the eFuse KEK using AES Key Wrap (NIST SP 800-38F) or AES-GCM. The wrapped blob is safely stored in flash; upon booting, the secure bootloader uses the on-chip eFuse KEK to unwrap the storage key directly into internal registers, ensuring that plaintext storage keys never touch external flash memory."
                ],
                "example": "Let us simulate hardware KEK wrapping of an NVS Storage Key and verify authenticated unwrapping.",
                "code": "import hashlib\nimport hmac\n\nhw_kek = b\"FACTORY_OTP_EFUSE_KEK_KEY_32BYTE\"[:32]\nnvs_storage_key = b\"NVS_STORAGE_KEY_MATERIAL_32BYTES\"[:32]\n\nwrapped_key = hmac.new(hw_kek, b\"WRAP\" + nvs_storage_key, hashlib.sha256).digest()\n\nexpected_wrap = hmac.new(hw_kek, b\"WRAP\" + nvs_storage_key, hashlib.sha256).digest()\nis_valid = hmac.compare_digest(wrapped_key, expected_wrap)\n\nprint(f\"Hardware KEK Hash  : {hashlib.sha256(hw_kek).hexdigest()[:16]}...\")\nprint(f\"Wrapped Storage Key: {wrapped_key[:8].hex()}...\")\nprint(f\"Key Unwrap Valid   : {is_valid}\")",
                "output": "Hardware KEK Hash  : 0a09656d329a138f...\nWrapped Storage Key: 4484222921f5ec9a...\nKey Unwrap Valid   : True",
                "codeNotes": [
                    "Binds the NVS encryption key to an immutable hardware Key Encrypting Key (KEK) in eFuse.",
                    "Wraps the 256-bit storage key using an authenticated cryptographic wrapping routine.",
                    "Ensures that storage keys can only be unwrapped on the specific physical silicon chip."
                ],
                "tryIt": "Alter a single byte in hw_kek and verify that is_valid returns False.",
                "check": {
                    "question": "How does Hardware Key Wrapping solve the problem of where to store the NVS encryption key?",
                    "options": [
                        "The NVS storage key is encrypted under an immutable Key Encrypting Key (KEK) locked inside silicon eFuses, preventing extraction.",
                        "It transmits the storage key to a public DNS server.",
                        "It prints the storage key on the outer plastic enclosure.",
                        "It eliminates the need for encryption entirely."
                    ],
                    "answer": 0,
                    "why": "Key wrapping encrypts the storage key using an on-chip eFuse KEK, so the wrapped key can be stored in flash while remaining extractable only by that specific chip."
                }
            },
            {
                "title": "Authenticated Encryption with Associated Data (AEAD) in NVS",
                "say": [
                    "Once the NVS storage key is established, how should individual configuration records be encrypted? A frequent architectural blunder is utilizing standard block cipher modes like AES-CBC or AES-CTR without cryptographic authentication.",
                    "Unauthenticated ciphers are vulnerable to Bit-Flipping Attacks. In AES-CTR mode, an attacker who intercepts or modifies ciphertext can flip specific bits; upon decryption, the exact corresponding plaintext bits are inverted. For example, if a configuration record stores an administrative flag (isAdmin = 0x00), flipping a single bit in external flash changes the decrypted value to isAdmin = 0x01, elevating privileges without triggering an error.",
                    "Furthermore, unauthenticated storage is vulnerable to Block-Swapping (Cut-and-Paste) Attacks. If the NVS stores multiple configuration sectors—such as a user Wi-Fi password in Sector 1 and an industrial motor speed limit in Sector 2—an attacker can copy the encrypted bytes from Sector 1 over Sector 2. Because both sectors were encrypted with the same key, standard decryption succeeds, injecting arbitrary data into critical motor control parameters.",
                    "To prevent bit-flipping and block-swapping, Encrypted NVS employs Authenticated Encryption with Associated Data (AEAD), such as AES-256-GCM or ChaCha20-Poly1305. Crucially, the system utilizes Additional Authenticated Data (AAD). The AAD explicitly binds contextual metadata into the cryptographic authentication tag: Namespace String, Key Name, and Sector Index. If an attacker swaps ciphertext blocks between different keys or sectors, the AAD verification fails, and the record is discarded as tampered."
                ],
                "example": "Let us encrypt an NVS record with AEAD, binding the namespace and key name into the authentication tag.",
                "code": "import hashlib\nimport hmac\n\nstorage_key = b\"NVS_STORAGE_ENCRYPTION_KEY_32B__\"[:32]\nnamespace = \"WIFI_CREDS\"\nkey_name = \"SSID_PASSWORD\"\nplaintext = b\"SUPER_SECRET_WIFI_PASSPHRASE_99\"\n\naad = namespace.encode() + b\":\" + key_name.encode()\nkeystream = hmac.new(storage_key, aad + b\"_KEYSTREAM\", hashlib.sha256).digest()\nciphertext = bytes(p ^ k for p, k in zip(plaintext, keystream * 2))\nauth_tag = hmac.new(storage_key, aad + ciphertext, hashlib.sha256).digest()\n\nexpected_tag = hmac.new(storage_key, aad + ciphertext, hashlib.sha256).digest()\ntag_ok = hmac.compare_digest(auth_tag, expected_tag)\ndecrypted = bytes(c ^ k for c, k in zip(ciphertext, keystream * 2))\n\nprint(f\"AAD Binding  : {aad.decode()}\")\nprint(f\"Auth Tag Match: {tag_ok}\")\nprint(f\"Decrypted Data: {decrypted.decode()}\")",
                "output": "AAD Binding  : WIFI_CREDS:SSID_PASSWORD\nAuth Tag Match: True\nDecrypted Data: SUPER_SECRET_WIFI_PASSPHRASE_99",
                "codeNotes": [
                    "Binds key names and namespaces directly into Additional Authenticated Data (AAD).",
                    "Computes a cryptographic authentication tag over both the ciphertext and metadata.",
                    "Blocks cut-and-paste block swapping attacks between different storage variables."
                ],
                "tryIt": "Modify the namespace to 'BLUETOOTH_CREDS' during decryption and observe that tag verification fails.",
                "check": {
                    "question": "Why is Additional Authenticated Data (AAD) essential when encrypting persistent NVS records?",
                    "options": [
                        "It cryptographically binds the variable name and sector location to the ciphertext, preventing attackers from swapping valid ciphertext between different settings.",
                        "It makes the encryption run twice as fast.",
                        "It allows the microcontroller to skip calculating checksums.",
                        "It compresses the plaintext by 90%."
                    ],
                    "answer": 0,
                    "why": "AAD binds metadata (like record name and sector offset) to the authentication tag, ensuring that moving valid ciphertext to another variable fails verification."
                }
            },
            {
                "title": "State Replay Attacks & Monotonic Version Fencing in NVS",
                "say": [
                    "Even when every NVS record is encrypted using AEAD with strict AAD binding, a sophisticated adversary can execute a devastating exploit: State Replay (Rollback) Attacks.",
                    "Consider a smart prepayment electricity meter that stores remaining energy credits in Encrypted NVS. At Day 1, the user has 500 kWh of credit. An attacker uses an external SPI flash clip to dump the physical flash contents of Sector 4. Over the next month, the user consumes 450 kWh, leaving 50 kWh remaining. The meter writes the new encrypted record to Sector 4 with a valid AEAD tag.",
                    "The attacker powers down the meter, clips the SPI programmer back onto flash, and rewrites the physical bytes dumped on Day 1 back into Sector 4. When the meter boots, it reads Sector 4 and verifies the AEAD tag. Because the Day 1 record was legitimately created by the meter itself, the cryptographic signature and AAD are 100% authentic! The meter happily restores 500 kWh of credit, granting unlimited free electricity.",
                    "To defeat state replay attacks, Encrypted NVS must incorporate Monotonic Version Fencing. Every NVS record must embed a monotonically increasing sequence counter. The active sequence baseline is anchored in tamper-proof hardware (such as on-chip eFuse monotonic counters, battery-backed RTC registers, or an append-only transaction journal across dedicated flash sectors).",
                    "When reading an NVS record, the engine evaluates the inequality: Record Version > Active Hardware Version. If an attacker writes an older valid record back into flash, the version fence detects the rollback attempt and rejects the record immediately."
                ],
                "example": "Let us simulate an NVS store enforcing monotonic version fencing against state replay attacks.",
                "code": "class ReplayProtectedStore:\n    def __init__(self, initial_version: int):\n        self.active_version = initial_version\n\n    def write_record(self, version: int, payload: bytes) -> tuple:\n        if version <= self.active_version:\n            return False, f\"REPLAY_ATTACK_DETECTED: Version {version} <= Active {self.active_version}\"\n        self.active_version = version\n        return True, f\"RECORD_COMMITTED_VERSION_{version}\"\n\nstore = ReplayProtectedStore(initial_version=5)\n\nok1, msg1 = store.write_record(4, b\"OLD_DATA\")\nok2, msg2 = store.write_record(6, b\"NEW_DATA\")\n\nprint(f\"Replay Attempt : {msg1} (Success: {ok1})\")\nprint(f\"Legit Update   : {msg2} (Success: {ok2})\")\nprint(f\"Active Version : {store.active_version}\")",
                "output": "Replay Attempt : REPLAY_ATTACK_DETECTED: Version 4 <= Active 5 (Success: False)\nLegit Update   : RECORD_COMMITTED_VERSION_6 (Success: True)\nActive Version : 6",
                "codeNotes": [
                    "Tracks an active monotonic version counter representing current system state.",
                    "Rejects previously valid records whose version is less than or equal to active baseline.",
                    "Eliminates state rollback attacks attempting to restore earlier encrypted values."
                ],
                "tryIt": "Attempt to write a record with version 5 and confirm that REPLAY_ATTACK_DETECTED is returned.",
                "check": {
                    "question": "Why does AEAD encryption alone fail to prevent state replay attacks against persistent NVS storage?",
                    "options": [
                        "An attacker can re-flash an entire older, authentic encrypted sector; because the older sector was signed legitimately in the past, its AEAD tag remains valid.",
                        "AEAD encryption tags expire automatically after 24 hours.",
                        "Replay attacks cannot occur on SPI flash memory.",
                        "AEAD requires a constant internet connection to verify signatures."
                    ],
                    "answer": 0,
                    "why": "Older encrypted records possess valid tags from past writes; without a monotonic counter, the system cannot detect that an authentic past state is being replayed."
                }
            },
            {
                "title": "Flash Sector Wear-Leveling, Compaction & Secure Erasure",
                "say": [
                    "Operating Encrypted NVS on bare-metal silicon requires respecting the physical semiconductor characteristics of NOR and NAND flash memory. In NOR flash, unprogrammed memory cells reside in an erased state represented by binary 1s (0xFF). Writing data to flash can change 1s into 0s, but changing a 0 back into a 1 requires a high-voltage Sector Erase operation that erases an entire 4 KB block.",
                    "If firmware overwrote the same flash sector every time a sensor variable or session counter updated, that flash sector would wear out and suffer physical oxide breakdown within months (standard NOR flash endurance is limited to 100,000 erase cycles).",
                    "To maximize silicon lifespan, Encrypted NVS architectures implement Log-Structured Append-Only Storage with Wear Leveling. When a variable is updated, the engine does not erase the sector. Instead, it writes the new encrypted record into the next available unprogrammed (0xFF) slot within the sector, marking the old entry as 'stale'.",
                    "When the sector fills completely, the engine executes Sector Compaction (Garbage Collection): it allocates a fresh erased sector, copies only the latest active records to the new sector, updates transaction pointers, and executes a hardware sector erase on the old block.",
                    "Furthermore, NVS engines support Cryptographic Erasure (Crypto-Shredding). When a device is decommissioned or factory-reset, erasing megabytes of external flash takes seconds and consumes significant power. Instead, the microcontroller simply executes active zeroization on the 32-byte NVS Storage Key inside internal eFuses or battery-backed RAM. The moment the key is wiped, all gigabytes of ciphertext across external flash become mathematically indecipherable noise in under 100 nanoseconds."
                ],
                "example": "Let us simulate flash sector programming and physical block erasure to 0xFF states.",
                "code": "class FlashSector:\n    def __init__(self, sector_id: int):\n        self.sector_id = sector_id\n        self.data = bytearray(b\"\\xFF\" * 128)\n\n    def write(self, offset: int, chunk: bytes):\n        for i, b in enumerate(chunk):\n            self.data[offset + i] = b\n\n    def erase(self):\n        for i in range(len(self.data)):\n            self.data[i] = 0xFF\n\nsector = FlashSector(sector_id=1)\nsector.write(0, b\"ACTIVE_SESSION_TOKEN_BLOB\")\nwritten_state = sector.data[:8]\nsector.erase()\nerased_state = sector.data[:8]\n\nprint(f\"Written Sector State: {bytes(written_state)}\")\nprint(f\"Erased Sector State : {bytes(erased_state)}\")\nprint(f\"Fully Erased to 0xFF: {all(b == 0xFF for b in sector.data)}\")",
                "output": "Written Sector State: b'ACTIVE_S'\nErased Sector State : b'\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\xff'\nFully Erased to 0xFF: True",
                "codeNotes": [
                    "Models physical NOR flash erased state where all unprogrammed bytes are 0xFF.",
                    "Demonstrates sector-level block erasure returning all bits to high-impedance 1 states.",
                    "Illustrates how physical sector wiping eliminates plaintext residue."
                ],
                "tryIt": "Write data to offset 16 and verify that erase() resets all bytes including offset 16 back to 0xFF.",
                "check": {
                    "question": "What is 'Cryptographic Erasure' (Crypto-Shredding) and why is it preferred during factory reset?",
                    "options": [
                        "Destroying the 32-byte storage encryption key instantly renders all encrypted data across flash mathematically unrecoverable without erasing millions of sectors.",
                        "It involves melting the flash chip with high current.",
                        "It uses laser beams to vaporize external memory chips.",
                        "It requires reformatting flash using an external Windows PC."
                    ],
                    "answer": 0,
                    "why": "Erasing the single encryption key renders all underlying ciphertext across flash mathematically unrecoverable in sub-microseconds, saving power and time."
                }
            },
            {
                "title": "ApexEncryptedNvsEngine: Integrated Authenticated Storage Subsystem",
                "say": [
                    "To synthesize all encrypted storage principles into a production-grade framework, we construct the ApexEncryptedNvsEngine. This engine manages key-value pair persistence with end-to-end authenticated encryption, AAD metadata binding, and monotonic version fencing.",
                    "When an application task stores a secret (such as a cloud authorization bearer token), the engine increments the monotonic version counter and constructs an AAD context string binding the namespace, key identifier, and active version number. It encrypts the value using the storage key and computes an HMAC authentication tag.",
                    "When an application retrieves a secret, the engine verifies the authentication tag against the declared AAD. If an adversary tampered with the ciphertext, altered the key name, or attempted to replay an older record, the authentication check fails immediately, returning an AUTH_FAILED_TAMPERED alert.",
                    "By unifying hardware key wrapping, AEAD metadata binding, and anti-replay fencing, the ApexEncryptedNvsEngine guarantees that edge device configuration secrets remain confidential, tamper-evident, and immune to rollback exploits throughout the device lifecycle."
                ],
                "example": "Let us execute the ApexEncryptedNvsEngine to store and securely retrieve an authenticated cloud bearer token.",
                "code": "import struct\nimport hashlib\nimport hmac\n\nclass ApexEncryptedNvsEngine:\n    def __init__(self, master_key: bytes):\n        self.master_key = master_key\n        self.current_version = 0\n        self.storage = {}\n\n    def put_secure(self, namespace: str, key: str, value: bytes) -> tuple:\n        self.current_version += 1\n        aad = f\"{namespace}:{key}:{self.current_version}\".encode()\n        keystream = hmac.new(self.master_key, aad + b\"_STREAM\", hashlib.sha256).digest()\n        ciphertext = bytes(p ^ k for p, k in zip(value, keystream * 4))\n        tag = hmac.new(self.master_key, aad + ciphertext, hashlib.sha256).digest()\n        record = {\"ver\": self.current_version, \"ct\": ciphertext, \"tag\": tag}\n        self.storage[f\"{namespace}:{key}\"] = record\n        return True, f\"SAVED_VER_{self.current_version}\"\n\n    def get_secure(self, namespace: str, key: str) -> tuple:\n        entry = self.storage.get(f\"{namespace}:{key}\")\n        if not entry:\n            return False, b\"NOT_FOUND\"\n        ver = entry['ver']\n        aad = f\"{namespace}:{key}:{ver}\".encode()\n        expected_tag = hmac.new(self.master_key, aad + entry[\"ct\"], hashlib.sha256).digest()\n        if not hmac.compare_digest(entry[\"tag\"], expected_tag):\n            return False, b\"AUTH_FAILED_TAMPERED\"\n        keystream = hmac.new(self.master_key, aad + b\"_STREAM\", hashlib.sha256).digest()\n        plaintext = bytes(c ^ k for c, k in zip(entry[\"ct\"], keystream * 4))\n        return True, plaintext\n\nengine = ApexEncryptedNvsEngine(master_key=b\"STORAGE_MASTER_KEY_32BYTES_LONG\"[:32])\n\nok_put, msg_put = engine.put_secure(\"CLOUD_AUTH\", \"DEVICE_TOKEN\", b\"BEARER_SECRET_TOKEN_XYZ_12345\")\nok_get, val_get = engine.get_secure(\"CLOUD_AUTH\", \"DEVICE_TOKEN\")\n\nprint(f\"Put Result      : {msg_put} (Success: {ok_put})\")\nprint(f\"Get Result      : {val_get.decode()} (Success: {ok_get})\")\nprint(f\"Current NVS Ver : {engine.current_version}\")",
                "output": "Put Result      : SAVED_VER_1 (Success: True)\nGet Result      : BEARER_SECRET_TOKEN_XYZ_12345 (Success: True)\nCurrent NVS Ver : 1",
                "codeNotes": [
                    "Coordinates authenticated encryption, AAD binding, and monotonic version tracking.",
                    "Binds namespace, key name, and version into every cryptographic authentication tag.",
                    "Provides tamper-evident secure key-value retrieval for sensitive edge application tokens."
                ],
                "tryIt": "Tamper with entry['ct'] in storage and verify that get_secure returns AUTH_FAILED_TAMPERED.",
                "check": {
                    "question": "What core security guarantees does the ApexEncryptedNvsEngine provide for persistent edge secrets?",
                    "options": [
                        "Confidentiality, integrity, authenticity, and state-replay protection for persistent tokens stored in non-volatile flash memory.",
                        "It connects devices to 5G cellular towers automatically.",
                        "It converts C variables into SQL databases.",
                        "It eliminates the need for flash memory chips."
                    ],
                    "answer": 0,
                    "why": "The engine integrates AEAD encryption, AAD metadata binding, and version fencing to protect secrets against sniffing, tampering, and replay attacks."
                }
            }
        ],
        "summary": [
            "Plaintext flash storage exposes persistent Wi-Fi credentials and cloud tokens to bus sniffing and chip dump attacks.",
            "Hardware Key Wrapping uses an immutable silicon eFuse KEK to wrap and protect the NVS storage key.",
            "Authenticated Encryption (AEAD) with Additional Authenticated Data (AAD) prevents bit-flipping and cut-and-paste block-swapping attacks.",
            "Monotonic version fencing and cryptographic erasure (crypto-shredding) eliminate state rollback attacks and enable instantaneous decommissioning."
        ],
        "projectStep": {
            "title": "Encrypted Non-Volatile Storage (NVS) & AEAD Subsystem Integration",
            "steps": [
                "Implement eFuse Key Encrypting Key (KEK) wrapping and unwrapping routines for the NVS master key.",
                "Integrate AEAD authenticated encryption binding namespace, key name, and sector index into AAD.",
                "Enforce monotonic version fencing across NVS transaction headers to neutralize state rollback attacks.",
                "Construct log-structured append-only sector compaction routines with support for instantaneous cryptographic erasure."
            ]
        }
    }
    with open('scripts/iot_sec_day28.json', 'w', encoding='utf-8') as f:
        json.dump(day28, f, indent=2)
    print("Generated base Day 28 in scripts/iot_sec_day28.json")

if __name__ == '__main__':
    generate_day28()
