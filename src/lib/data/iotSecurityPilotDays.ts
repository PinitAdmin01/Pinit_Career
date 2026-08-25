import { DayLessonPlan } from '@/lib/types/lessonEngine';

export const IOT_SECURITY_PILOT_DAYS: DayLessonPlan[] = [
  {
    "day": 1,
    "title": "Introduction to IoT Security — Hardware Root of Trust, Secure Boot and Digital Signatures",
    "overviewMetaphor": "Secure Boot is a Sovereign Royal Wax Seal on King's Orders: web servers sit protected behind biometric doors in locked data centers; IoT devices (Smart meters, medical pumps, connected cars) sit unattended in the wild where any attacker can physically solder wires to the motherboard; Secure Boot uses an unalterable Hardware Root of Trust burned into silicon at the chip factory; every time the device powers on, the Boot ROM inspects the cryptographic signature on the firmware—if even a single bit was modified by a hacker, the signature fails and the device permanently halts to protect physical safety.",
    "blocks": [
      {
        "id": "iotsec-d1-b1-hardware-root-of-trust-boot-rom",
        "day": 1,
        "blockNumber": 1,
        "title": "Hardware Root of Trust & Immutable Masked Boot ROM",
        "conceptBudget": {
          "primaryConcept": "Hardware Root of Trust Invariant",
          "supportingTerms": [
            "Boot ROM (Mask-programmed silicon ROM executed at reset vector `0x00000000`, physically immutable)",
            "Hardware Root of Trust (Immutable public key hash burned into eFuses)",
            "Silicon Anchor of Trust (Trust cannot be established in software without hardware anchor)"
          ]
        },
        "prerequisiteThresholds": [],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Secure Boot Chain of Trust Hierarchy",
              "boxes": [
                {
                  "label": "1. Silicon Masked Boot ROM",
                  "value": "Address: 0x00000000 | Mutability: READ-ONLY SILICON | Trust: 100% Unquestioned Hardware Root",
                  "varType": "Hardware Silicon",
                  "isUpdated": false
                },
                {
                  "label": "2. Second-Stage Bootloader (BL2)",
                  "value": "Address: 0x08000000 | Verified By: Boot ROM RSA/ECDSA signature check",
                  "varType": "Flash Memory",
                  "isUpdated": false
                },
                {
                  "label": "3. Main Application Firmware",
                  "value": "Address: 0x08020000 | Verified By: BL2 signature check before execution",
                  "varType": "Flash Memory",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "root_of_trust_demo.js",
            "initialCode": "function evaluateRootOfTrust(hardwareRootHash, providedKeyHash) {\n  const isTrusted = (hardwareRootHash === providedKeyHash);\n  return isTrusted\n    ? 'HARDWARE_ROOT_OF_TRUST_CONFIRMED: PROCEED_TO_STAGE_2'\n    : 'CRITICAL_BOOT_VIOLATION_UNTRUSTED_KEY_HALT';\n}\n\nconsole.log(evaluateRootOfTrust('0xROOT_KEY_99', '0xROOT_KEY_99'));\nconsole.log(evaluateRootOfTrust('0xROOT_KEY_99', '0xATTACKER_FAKE_KEY'));",
            "expectedOutput": "HARDWARE_ROOT_OF_TRUST_CONFIRMED: PROCEED_TO_STAGE_2\nCRITICAL_BOOT_VIOLATION_UNTRUSTED_KEY_HALT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is emitted when a presented public key hash matches the hardware root of trust burned into silicon?",
          "expectedStringOutput": "HARDWARE_ROOT_OF_TRUST_CONFIRMED: PROCEED_TO_STAGE_2",
          "acceptableAnswers": [
            "HARDWARE_ROOT_OF_TRUST_CONFIRMED: PROCEED_TO_STAGE_2",
            "HARDWARE_ROOT_OF_TRUST_CONFIRMED"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_HARDWARE_ROOT_OF_TRUST_BOOT_ROM",
          "diagnosisMap": {
            "HALT": {
              "misconceptionId": "MC_IOTSEC_HARDWARE_ROOT_OF_TRUST_BOOT_ROM",
              "errorExplanation": "Matching hashes confirm trust, allowing boot to proceed.",
              "recoveryPath": {
                "simplerExplanation": "Matches HARDWARE_ROOT_OF_TRUST_CONFIRMED.",
                "guidedFixPrompt": "Type HARDWARE_ROOT_OF_TRUST_CONFIRMED: PROCEED_TO_STAGE_2"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d1-b2-firmware-digital-signature-verification",
        "day": 1,
        "blockNumber": 2,
        "title": "Firmware Digital Signatures: Hashing + Asymmetric Verification",
        "conceptBudget": {
          "primaryConcept": "Digital Signature Verification",
          "supportingTerms": [
            "SHA-256 Digest ($H = \\text{SHA256}(\\text{FirmwareBinary})$)",
            "ECDSA Signature $(r, s)$",
            "Public Key Verification ($V(K_{\\text{pub}}, H, \\text{Sig}) \\implies \\text{True/False}$)",
            "Tamper Detection (Modifying 1 bit changes 50% of hash bits via Avalanche Effect)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d1-b1-hardware-root-of-trust-boot-rom",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Digital Signature Verification Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Calculate SHA-256 hash over entire 512 KB firmware binary",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Retrieve ECDSA (r, s) signature coordinates from firmware header",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Run curve point math: Does Verify(PubKey, Hash, Sig) == TRUE?",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "YES -> Jump to application reset handler | NO -> Enter permanent reset lock",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sig_verify_demo.js",
            "initialCode": "function evaluateSignature(isTampered) {\n  return isTampered\n    ? 'SIGNATURE_INVALID_AVALANCHE_MISMATCH: BOOT_ABORTED'\n    : 'SIGNATURE_VERIFIED_FIRMWARE_AUTHENTIC: JUMP_TO_APP';\n}\n\nconsole.log(evaluateSignature(false));\nconsole.log(evaluateSignature(true));",
            "expectedOutput": "SIGNATURE_VERIFIED_FIRMWARE_AUTHENTIC: JUMP_TO_APP\nSIGNATURE_INVALID_AVALANCHE_MISMATCH: BOOT_ABORTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken by the bootloader when an authentic untampered firmware signature is verified?",
          "expectedStringOutput": "SIGNATURE_VERIFIED_FIRMWARE_AUTHENTIC: JUMP_TO_APP",
          "acceptableAnswers": [
            "SIGNATURE_VERIFIED_FIRMWARE_AUTHENTIC: JUMP_TO_APP",
            "SIGNATURE_VERIFIED_FIRMWARE_AUTHENTIC"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_HARDWARE_ROOT_OF_TRUST_BOOT_ROM",
          "diagnosisMap": {
            "ABORT": {
              "misconceptionId": "MC_IOTSEC_HARDWARE_ROOT_OF_TRUST_BOOT_ROM",
              "errorExplanation": "Valid signatures permit jumping to the application entry point.",
              "recoveryPath": {
                "simplerExplanation": "Permits jump to app -> SIGNATURE_VERIFIED_FIRMWARE_AUTHENTIC: JUMP_TO_APP.",
                "guidedFixPrompt": "Type SIGNATURE_VERIFIED_FIRMWARE_AUTHENTIC: JUMP_TO_APP"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d1-b3-jeep-cherokee-case-study",
        "day": 1,
        "blockNumber": 3,
        "title": "Industrial Case Study: The 2015 Remote CAN Bus Hijack",
        "conceptBudget": {
          "primaryConcept": "Physical & OTA Vulnerability Lessons",
          "supportingTerms": [
            "Unauthenticated Firmware Flashing over D-Bus/Cellular",
            "Lack of Secure Boot allowed malicious V850 CAN transceiver firmware",
            "1.4 Million Vehicle Recall Impact",
            "Zero-Trust Firmware Signing Mandates"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d1-b2-firmware-digital-signature-verification",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "recall_analysis_demo.js",
            "initialCode": "function evaluateSecureBootImpact(hasSecureBoot) {\n  return hasSecureBoot\n    ? 'SECURE_BOOT_ACTIVE: REJECTED_UNAUTHORIZED_CAN_FIRMWARE_ATTACK_PREVENTED'\n    : 'VULNERABILITY: UNCHECKED_FIRMWARE_FLASHED_SYSTEM_COMPROMISED';\n}\n\nconsole.log(evaluateSecureBootImpact(true));\nconsole.log(evaluateSecureBootImpact(false));",
            "expectedOutput": "SECURE_BOOT_ACTIVE: REJECTED_UNAUTHORIZED_CAN_FIRMWARE_ATTACK_PREVENTED\nVULNERABILITY: UNCHECKED_FIRMWARE_FLASHED_SYSTEM_COMPROMISED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How would a Hardware Root of Trust and Secure Boot have prevented the 2015 Jeep remote vehicle hijack?",
          "options": [
            "The CAN gateway microcontroller would have checked the digital signature on the modified firmware file, rejected the unsigned attacker binary, and refused to flash or boot the malicious code",
            "By making the vehicle run faster",
            "By disconnecting the car battery automatically"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTSEC_HARDWARE_ROOT_OF_TRUST_BOOT_ROM",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTSEC_HARDWARE_ROOT_OF_TRUST_BOOT_ROM",
              "errorExplanation": "Secure boot rejects unauthenticated firmware images before execution.",
              "recoveryPath": {
                "simplerExplanation": "Rejects unsigned code before boot.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 2,
    "title": "Symmetric Encryption — AES Cipher Basics, Blocks and Initialization Vectors",
    "overviewMetaphor": "Symmetric Encryption is a High-Security Deadbolt Lock with Two Duplicate Brass Keys: both the IoT edge device and the cloud server hold the exact same secret 256-bit key; AES is a Block Cipher that scrambles data in fixed chunks of 16 bytes (128 bits); if you encrypt the message 'STATUS_NORMAL' twice without a random Initialization Vector (IV), both encrypted outputs look identical (Allowing a spy on the network to detect patterns!); adding a fresh 16-byte random IV ensures identical plaintexts yield completely unrecognizable ciphertext every time.",
    "blocks": [
      {
        "id": "iotsec-d2-b1-aes-block-cipher-internals",
        "day": 2,
        "blockNumber": 1,
        "title": "AES Block Structure: 16-Byte Blocks & 10/14 Transformation Rounds",
        "conceptBudget": {
          "primaryConcept": "AES Block Cipher Internals",
          "supportingTerms": [
            "16-Byte (128-bit) State Matrix ($4 \\times 4$ array of bytes)",
            "AES-128 (10 Rounds, 16-byte key)",
            "AES-256 (14 Rounds, 32-byte key)",
            "Round Transformations: `SubBytes` (S-Box non-linear substitution), `ShiftRows`, `MixColumns`, `AddRoundKey`"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d1-b1-hardware-root-of-trust-boot-rom",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "AES-128 vs AES-256 Parameter Specifications",
              "boxes": [
                {
                  "label": "1. AES-128",
                  "value": "Key Size: 16 bytes (128 bits) | Block Size: 16 bytes | Transformation Rounds: 10 rounds",
                  "varType": "Standard Cipher",
                  "isUpdated": false
                },
                {
                  "label": "2. AES-256",
                  "value": "Key Size: 32 bytes (256 bits) | Block Size: 16 bytes | Transformation Rounds: 14 rounds",
                  "varType": "Quantum-Resistant",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "aes_rounds_demo.js",
            "initialCode": "function evaluateAesRounds(keyBytes) {\n  if (keyBytes === 16) return { keyBits: 128, rounds: 10, status: 'AES_128_STANDARD' };\n  if (keyBytes === 32) return { keyBits: 256, rounds: 14, status: 'AES_256_HIGH_SECURITY' };\n  return { error: 'INVALID_AES_KEY_SIZE' };\n}\n\nconsole.log(JSON.stringify(evaluateAesRounds(16)));\nconsole.log(JSON.stringify(evaluateAesRounds(32)));",
            "expectedOutput": "{\"keyBits\":128,\"rounds\":10,\"status\":\"AES_128_STANDARD\"}\n{\"keyBits\":256,\"rounds\":14,\"status\":\"AES_256_HIGH_SECURITY\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many transformation rounds are executed by AES-256 with a 32-byte key?",
          "expectedStringOutput": "14",
          "acceptableAnswers": [
            "14",
            "14 rounds",
            "rounds\":14"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_AES_CBC_CTR_GCM_BLOCK_IV_PADDING",
          "diagnosisMap": {
            "10": {
              "misconceptionId": "MC_IOTSEC_AES_CBC_CTR_GCM_BLOCK_IV_PADDING",
              "errorExplanation": "10 rounds is for AES-128. AES-256 executes exactly 14 rounds.",
              "recoveryPath": {
                "simplerExplanation": "AES-256 has 14 rounds.",
                "guidedFixPrompt": "Type 14"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d2-b2-pkcs7-block-padding",
        "day": 2,
        "blockNumber": 2,
        "title": "PKCS#7 Padding: Padding Incomplete 16-Byte Blocks",
        "conceptBudget": {
          "primaryConcept": "PKCS#7 Padding Standard",
          "supportingTerms": [
            "PKCS#7 Rule: Append $N$ bytes, each containing value $N$",
            "Padding calculation: $\\text{PadBytes} = 16 - (\\text{Length} \\pmod{16})$",
            "Full Padding Block Invariant: If payload is exactly 16 bytes, append a full 16-byte block of `0x10` to avoid ambiguity"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d2-b1-aes-block-cipher-internals",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "PKCS#7 Padding Math",
            "codeSnippet": "const padNeeded = 16 - (payloadLen % 16); // Returns 1..16\nconst paddedBuffer = Buffer.alloc(payloadLen + padNeeded);\npaddedBuffer.fill(padNeeded, payloadLen); // Fills remaining bytes with value padNeeded!",
            "lineNotes": {
              "1": "Computes padding bytes required.",
              "3": "Appends byte values matching padding length."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pkcs7_demo.js",
            "initialCode": "function applyPkcs7Padding(length) {\n  const padNeeded = 16 - (length % 16);\n  return {\n    payloadBytes: length,\n    padBytesAdded: padNeeded,\n    paddedTotalBytes: length + padNeeded,\n    padByteValueHex: '0x' + padNeeded.toString(16).padStart(2, '0')\n  };\n}\n\nconsole.log(JSON.stringify(applyPkcs7Padding(10))); // Needs 6 bytes of 0x06\nconsole.log(JSON.stringify(applyPkcs7Padding(16))); // Needs 16 bytes of 0x10!",
            "expectedOutput": "{\"payloadBytes\":10,\"padBytesAdded\":6,\"paddedTotalBytes\":16,\"padByteValueHex\":\"0x06\"}\n{\"payloadBytes\":16,\"padBytesAdded\":16,\"paddedTotalBytes\":32,\"padByteValueHex\":\"0x10\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many padding bytes are added under PKCS#7 when the original plaintext message is already exactly 16 bytes ($16 - (16 \\pmod{16})$)?",
          "expectedStringOutput": "16",
          "acceptableAnswers": [
            "16",
            "16 bytes",
            "padBytesAdded\":16"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_AES_CBC_CTR_GCM_BLOCK_IV_PADDING",
          "diagnosisMap": {
            "0": {
              "misconceptionId": "MC_IOTSEC_AES_CBC_CTR_GCM_BLOCK_IV_PADDING",
              "errorExplanation": "PKCS#7 requires unambiguous padding; an exact multiple of 16 adds a full 16-byte block of 0x10.",
              "recoveryPath": {
                "simplerExplanation": "Adds full 16-byte block.",
                "guidedFixPrompt": "Type 16"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d2-b3-iv-randomness-ecb-flaw",
        "day": 2,
        "blockNumber": 3,
        "title": "The Electronic Codebook (ECB) Flaw & CBC Initialization Vectors (IV)",
        "conceptBudget": {
          "primaryConcept": "Initialization Vector (IV) Necessity",
          "supportingTerms": [
            "ECB Flaw (Deterministic encryption leaks image/pattern silhouettes: The ECB Penguin!)",
            "Cipher Block Chaining (CBC: $C_0 = E_K(P_0 \\oplus \\text{IV})$, $C_i = E_K(P_i \\oplus C_{i-1})$)",
            "16-Byte Cryptographically Secure IV (`CSPRNG`)",
            "IV Nonce Uniqueness Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d2-b2-pkcs7-block-padding",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "ECB Pattern Leak vs CBC Random IV Fix Diff",
              "brokenCode": "// ❌ ECB MODE (CRITICAL SECURITY VULNERABILITY!):\nEVP_CIPHER_CTX_init(ctx, EVP_aes_128_ecb(), key, NULL); // Identical sensor values produce identical ciphertext!",
              "fixedCode": "// ✅ CBC MODE WITH RANDOM 16-BYTE IV:\nuint8_t iv[16];\nRAND_bytes(iv, 16); // Cryptographically secure random IV\nEVP_CIPHER_CTX_init(ctx, EVP_aes_128_cbc(), key, iv); // Unbreakable semantic security!",
              "errorLine": 2,
              "errorReason": "ECB mode encrypts blocks independently, allowing network eavesdroppers to detect patterns in telemetry.",
              "fixExplanation": "Use CBC mode with a unique 16-byte random IV for every message."
            }
          },
          {
            "type": "runnable_code",
            "filename": "iv_security_demo.js",
            "initialCode": "function evaluateCipherMode(mode, ivBytes) {\n  if (mode === 'ECB') return 'CRITICAL_VULNERABILITY_ECB_PATTERN_LEAK';\n  if (mode === 'CBC' && ivBytes === 16) return 'CBC_SEMANTIC_SECURITY_ASSURED';\n  return 'INVALID_IV_LENGTH';\n}\n\nconsole.log(evaluateCipherMode('ECB', 0));\nconsole.log(evaluateCipherMode('CBC', 16));",
            "expectedOutput": "CRITICAL_VULNERABILITY_ECB_PATTERN_LEAK\nCBC_SEMANTIC_SECURITY_ASSURED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is awarded to AES-CBC configured with a 16-byte cryptographically random IV?",
          "expectedStringOutput": "CBC_SEMANTIC_SECURITY_ASSURED",
          "acceptableAnswers": [
            "CBC_SEMANTIC_SECURITY_ASSURED",
            "CBC_SEMANTIC_SECURITY"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_AES_CBC_CTR_GCM_BLOCK_IV_PADDING",
          "diagnosisMap": {
            "LEAK": {
              "misconceptionId": "MC_IOTSEC_AES_CBC_CTR_GCM_BLOCK_IV_PADDING",
              "errorExplanation": "16-byte random IV guarantees CBC_SEMANTIC_SECURITY_ASSURED.",
              "recoveryPath": {
                "simplerExplanation": "Matches CBC_SEMANTIC_SECURITY_ASSURED.",
                "guidedFixPrompt": "Type CBC_SEMANTIC_SECURITY_ASSURED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 3,
    "title": "Authenticated Encryption (AEAD): AES-GCM & Poly1305 Integrity",
    "overviewMetaphor": "AEAD is an Encrypted Letter Inside a Tamper-Proof Wax Envelope: with ordinary CBC encryption, a hacker sitting on a Wi-Fi router cannot read the message, but they CAN flip bits in the ciphertext (Turning 'SHUT_DOWN_RELAY=NO' into 'SHUT_DOWN_RELAY=YES' without knowing the key!); Authenticated Encryption with Associated Data (AES-GCM) calculates a 16-byte GHASH authentication tag over both the encrypted payload and unencrypted header; if a single bit is modified in transit, the receiver immediately discards the corrupted packet.",
    "blocks": [
      {
        "id": "iotsec-d3-b1-bit-flipping-attack-threat",
        "day": 3,
        "blockNumber": 1,
        "title": "The Bit-Flipping Attack on Unauthenticated Ciphers (CTR/CBC)",
        "conceptBudget": {
          "primaryConcept": "Bit-Flipping Attack Mechanics",
          "supportingTerms": [
            "Malleability Vulnerability in Stream/CTR/CBC modes",
            "Predictable Plaintext Corruption ($P'_i = P_i \\oplus \\Delta$ by flipping bits in ciphertext $C_i$)",
            "Integrity vs Confidentiality Fallacy (Encryption alone does NOT guarantee authenticity!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d2-b3-iv-randomness-ecb-flaw",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Bit-Flipping Attack Vector (CTR Mode)",
              "boxes": [
                {
                  "label": "Original Plaintext",
                  "value": "Command: 'VALVE_STATE=OFF' | Ciphertext: 0x4A8F... | Decrypt: Valid 'OFF'",
                  "varType": "Normal",
                  "isUpdated": false
                },
                {
                  "label": "Attacker Bit-Flip",
                  "value": "Flips 1 bit in Ciphertext 0x4A8E... -> Decrypts cleanly to 'VALVE_STATE=ON ' with ZERO errors!",
                  "varType": "Attacked",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "bit_flip_demo.js",
            "initialCode": "function evaluateAeadProtection(hasAuthTag, isBitFlipped) {\n  if (isBitFlipped) {\n    return hasAuthTag\n      ? 'AEAD_AUTH_TAG_FAILED_TAMPERED_PACKET_DROPPED'\n      : 'SILENT_DATA_CORRUPTION_VULNERABILITY_BIT_FLIPPED';\n  }\n  return 'PACKET_AUTHENTIC';\n}\n\nconsole.log(evaluateAeadProtection(false, true)); // Unauthenticated CTR\nconsole.log(evaluateAeadProtection(true, true));  // Authenticated GCM",
            "expectedOutput": "SILENT_DATA_CORRUPTION_VULNERABILITY_BIT_FLIPPED\nAEAD_AUTH_TAG_FAILED_TAMPERED_PACKET_DROPPED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is triggered by AEAD when an attacker flips a bit in an encrypted packet with an authentication tag?",
          "expectedStringOutput": "AEAD_AUTH_TAG_FAILED_TAMPERED_PACKET_DROPPED",
          "acceptableAnswers": [
            "AEAD_AUTH_TAG_FAILED_TAMPERED_PACKET_DROPPED",
            "AEAD_AUTH_TAG_FAILED"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_AES_CBC_CTR_GCM_BLOCK_IV_PADDING",
          "diagnosisMap": {
            "SILENT": {
              "misconceptionId": "MC_IOTSEC_AES_CBC_CTR_GCM_BLOCK_IV_PADDING",
              "errorExplanation": "With an AEAD auth tag, tampering is immediately detected and dropped.",
              "recoveryPath": {
                "simplerExplanation": "AEAD drops tampered packets.",
                "guidedFixPrompt": "Type AEAD_AUTH_TAG_FAILED_TAMPERED_PACKET_DROPPED"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d3-b2-aes-gcm-ghash-tag-construction",
        "day": 3,
        "blockNumber": 2,
        "title": "AES-GCM Construction: CTR Encryption + GHASH Authentication Tag",
        "conceptBudget": {
          "primaryConcept": "AES-GCM Authenticated Encryption",
          "supportingTerms": [
            "Galois Counter Mode (GCM)",
            "12-Byte Nonce (96 bits standard)",
            "16-Byte Authentication Tag ($T$ computed over Galois field $\\text{GF}(2^{128})$)",
            "Additional Authenticated Data (AAD: Headers authenticated in cleartext)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d3-b1-bit-flipping-attack-threat",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "AES-GCM Parameters Anatomy",
            "codeSnippet": "const iv = crypto.randomBytes(12); // 96-bit standard nonce\nconst cipher = crypto.createCipheriv('aes-256-gcm', key, iv);\ncipher.setAAD(packetHeaderBuffer); // Authenticates header without encrypting\nconst ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);\nconst authTag = cipher.getAuthTag(); // 16-byte cryptographic integrity tag",
            "lineNotes": {
              "1": "12-byte random nonce.",
              "3": "Includes plaintext header in authentication math.",
              "5": "Retrieves 16-byte authentication tag."
            }
          },
          {
            "type": "runnable_code",
            "filename": "gcm_params_demo.js",
            "initialCode": "function evaluateGcmSpec(nonceBytes, tagBytes) {\n  const okNonce = (nonceBytes === 12);\n  const okTag = (tagBytes === 16);\n  return {\n    nonceStandard: okNonce,\n    tagStandard: okTag,\n    status: (okNonce && okTag) ? 'AES_GCM_SPECIFICATION_COMPLIANT' : 'NON_COMPLIANT_GCM_PARAMETERS'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateGcmSpec(12, 16)));",
            "expectedOutput": "{\"nonceStandard\":true,\"tagStandard\":true,\"status\":\"AES_GCM_SPECIFICATION_COMPLIANT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms standard AES-GCM parameters with a 12-byte nonce and 16-byte authentication tag?",
          "expectedStringOutput": "AES_GCM_SPECIFICATION_COMPLIANT",
          "acceptableAnswers": [
            "AES_GCM_SPECIFICATION_COMPLIANT",
            "status\":\"AES_GCM_SPECIFICATION_COMPLIANT\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_AES_CBC_CTR_GCM_BLOCK_IV_PADDING",
          "diagnosisMap": {
            "NON_COMPLIANT": {
              "misconceptionId": "MC_IOTSEC_AES_CBC_CTR_GCM_BLOCK_IV_PADDING",
              "errorExplanation": "12-byte nonce and 16-byte tag are the exact standard GCM parameters.",
              "recoveryPath": {
                "simplerExplanation": "Matches AES_GCM_SPECIFICATION_COMPLIANT.",
                "guidedFixPrompt": "Type AES_GCM_SPECIFICATION_COMPLIANT"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d3-b3-nonce-reuse-catastrophe",
        "day": 3,
        "blockNumber": 3,
        "title": "The GCM Nonce Reuse Catastrophe: Recovering the Authentication Key ($H$)",
        "conceptBudget": {
          "primaryConcept": "GCM Nonce Uniqueness Invariant",
          "supportingTerms": [
            "Nonce Reuse Vulnerability (Reusing same (Key, IV) pair allows solving for GHASH key $H$ in Galois field)",
            "Total Forgery of any future packet",
            "Hardware Monotonic Nonce Counter Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d3-b2-aes-gcm-ghash-tag-construction",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "nonce_reuse_demo.js",
            "initialCode": "function evaluateNonceSafety(isNonceReused) {\n  return isNonceReused\n    ? 'CRITICAL_GCM_FAILURE: AUTH_KEY_H_LEAKED_TOTAL_FORGERY_POSSIBLE'\n    : 'NONCE_UNIQUE_AEAD_SECURITY_ASSURED';\n}\n\nconsole.log(evaluateNonceSafety(true));\nconsole.log(evaluateNonceSafety(false));",
            "expectedOutput": "CRITICAL_GCM_FAILURE: AUTH_KEY_H_LEAKED_TOTAL_FORGERY_POSSIBLE\nNONCE_UNIQUE_AEAD_SECURITY_ASSURED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is reusing an Initialization Vector / Nonce with the same key catastrophic in AES-GCM?",
          "options": [
            "Because encrypting two different messages with the same (Key, Nonce) pair allows an adversary to mathematically calculate the GHASH authentication key $H$, allowing them to forge authentication tags for any arbitrary message",
            "Because the microcontroller CPU clock speed is halved",
            "Because the data becomes too small to transmit"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTSEC_AES_CBC_CTR_GCM_BLOCK_IV_PADDING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTSEC_AES_CBC_CTR_GCM_BLOCK_IV_PADDING",
              "errorExplanation": "Nonce reuse in GCM breaks authentication key security.",
              "recoveryPath": {
                "simplerExplanation": "Allows calculating GHASH key H to forge tags.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 4,
    "title": "Asymmetric Cryptography: ECC, ECDSA and Ed25519 in Constrained Silicon",
    "overviewMetaphor": "Asymmetric Cryptography is a Padlock Anyone Can Click Shut, but Only You Have the Key to Open: with symmetric keys, if 10,000 smart bulbs share the same master key, hacking one bulb reveals the key to all 10,000; with Asymmetric Elliptic Curve Cryptography (ECC), each device generates a Private Key (Kept secret in silicon) and a Public Key (Given to the world); a 256-bit ECC key provides the same cryptographic strength as a 3072-bit RSA key, but consumes 90% less RAM and battery power on microcontroller silicon.",
    "blocks": [
      {
        "id": "iotsec-d4-b1-elliptic-curve-point-math",
        "day": 4,
        "blockNumber": 1,
        "title": "Elliptic Curve Point Arithmetic ($y^2 = x^3 + a x + b$)",
        "conceptBudget": {
          "primaryConcept": "Elliptic Curve Point Multiplication",
          "supportingTerms": [
            "Weierstrass Equation: $y^2 = x^3 + ax + b \\pmod p$",
            "Point Addition ($P + Q = R$) & Point Doubling ($2P$)",
            "Scalar Multiplication ($Q = d \\times G$, where $d$ is private key, $Q$ is public point)",
            "Elliptic Curve Discrete Logarithm Problem (ECDLP: Easy to compute $dG$, mathematically impossible to find $d$ from $Q$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d1-b2-firmware-digital-signature-verification",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "NIST P-256 vs Curve25519 Parameters",
              "boxes": [
                {
                  "label": "1. NIST P-256 (secp256r1)",
                  "value": "Field Size: 256 bits | Standard: Commercial/Federal IoT, TLS 1.3 | Key Length: 32 bytes",
                  "varType": "Weierstrass Curve",
                  "isUpdated": false
                },
                {
                  "label": "2. Curve25519 (Ed25519/X25519)",
                  "value": "Field Size: 255 bits | Standard: High-Speed Embedded, WireGuard | Immune to timing attacks!",
                  "varType": "Montgomery Curve",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ecc_keysize_demo.js",
            "initialCode": "function compareAsymmetricStrength(eccBits = 256, rsaEquivalentBits = 3072) {\n  const ramSavingsPct = ((rsaEquivalentBits - eccBits) / rsaEquivalentBits) * 100;\n  return {\n    eccKeyBits: eccBits,\n    rsaEquivalentBits,\n    securityLevelBits: 128,\n    keySizeReductionPercent: Number(ramSavingsPct.toFixed(1)),\n    status: 'ECC_CONSTRAINED_SILICON_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(compareAsymmetricStrength(256, 3072)));",
            "expectedOutput": "{\"eccKeyBits\":256,\"rsaEquivalentBits\":3072,\"securityLevelBits\":128,\"keySizeReductionPercent\":91.7,\"status\":\"ECC_CONSTRAINED_SILICON_OPTIMAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What key size reduction percentage is achieved by 256-bit ECC compared to 3072-bit RSA with equivalent 128-bit security level ($((3072 - 256) / 3072) \\times 100$)?",
          "expectedStringOutput": "91.7",
          "acceptableAnswers": [
            "91.7",
            "91.7%",
            "keySizeReductionPercent\":91.7"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_ECC_ECDSA_PUBLIC_KEY_SIGNATURE_VERIFICATION",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_IOTSEC_ECC_ECDSA_PUBLIC_KEY_SIGNATURE_VERIFICATION",
              "errorExplanation": "(3072 - 256) / 3072 = 91.7% key size reduction.",
              "recoveryPath": {
                "simplerExplanation": "Reduces key size by 91.7%.",
                "guidedFixPrompt": "Type 91.7"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d4-b2-ecdsa-signature-generation-verification",
        "day": 4,
        "blockNumber": 2,
        "title": "ECDSA Signature Generation & Verification Math",
        "conceptBudget": {
          "primaryConcept": "ECDSA Signature Coordinate Math",
          "supportingTerms": [
            "Signature Pair $(r, s)$",
            "Signing: $r = (k G)_x \\pmod n$, $s = k^{-1}(z + r d) \\pmod n$",
            "Ephemeral Nonce $k$ (Must NEVER be reused; reusing $k$ reveals private key $d$ instantly!)",
            "Deterministic Nonce Generation (RFC 6979)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d4-b1-elliptic-curve-point-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ecdsa_rfc6979_demo.js",
            "initialCode": "function evaluateEcdsaNonceSafety(isDeterministicRfc6979) {\n  return isDeterministicRfc6979\n    ? 'RFC_6979_DETERMINISTIC_NONCE: PRIVATE_KEY_SECURE_FROM_REUSE_LEAK'\n    : 'POOR_RNG_NONCE_REUSE_EXPOSES_PRIVATE_KEY';\n}\n\nconsole.log(evaluateEcdsaNonceSafety(true));\nconsole.log(evaluateEcdsaNonceSafety(false));",
            "expectedOutput": "RFC_6979_DETERMINISTIC_NONCE: PRIVATE_KEY_SECURE_FROM_REUSE_LEAK\nPOOR_RNG_NONCE_REUSE_EXPOSES_PRIVATE_KEY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What security guarantee is confirmed by using RFC 6979 deterministic nonce generation in ECDSA?",
          "expectedStringOutput": "RFC_6979_DETERMINISTIC_NONCE: PRIVATE_KEY_SECURE_FROM_REUSE_LEAK",
          "acceptableAnswers": [
            "RFC_6979_DETERMINISTIC_NONCE: PRIVATE_KEY_SECURE_FROM_REUSE_LEAK",
            "RFC_6979_DETERMINISTIC_NONCE"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_ECC_ECDSA_PUBLIC_KEY_SIGNATURE_VERIFICATION",
          "diagnosisMap": {
            "EXPOSES": {
              "misconceptionId": "MC_IOTSEC_ECC_ECDSA_PUBLIC_KEY_SIGNATURE_VERIFICATION",
              "errorExplanation": "RFC 6979 derives k deterministically from hash and private key, preventing nonce reuse.",
              "recoveryPath": {
                "simplerExplanation": "Matches RFC_6979_DETERMINISTIC_NONCE.",
                "guidedFixPrompt": "Type RFC_6979_DETERMINISTIC_NONCE: PRIVATE_KEY_SECURE_FROM_REUSE_LEAK"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d4-b3-ecdh-shared-secret-derivation",
        "day": 4,
        "blockNumber": 3,
        "title": "Elliptic Curve Diffie-Hellman (ECDH) Key Agreement",
        "conceptBudget": {
          "primaryConcept": "ECDH Key Agreement",
          "supportingTerms": [
            "Shared Secret: $S = d_A Q_B = d_B Q_A$",
            "Ephemeral Keys (ECDHE for Forward Secrecy)",
            "HKDF Key Derivation (Hashing raw curve point into symmetric AES session keys)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d4-b2-ecdsa-signature-generation-verification",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ecdh_shared_demo.js",
            "initialCode": "function evaluateEcdhAgreement(privA, pubB, privB, pubA) {\n  const secretA = `SECRET_${privA * pubB}`;\n  const secretB = `SECRET_${privB * pubA}`;\n  const match = (secretA === secretB);\n  return {\n    derivedSecretA: secretA,\n    derivedSecretB: secretB,\n    secretsMatch: match,\n    status: match ? 'ECDH_SHARED_SECRET_ESTABLISHED' : 'KEY_AGREEMENT_FAILED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateEcdhAgreement(5, 7, 7, 5)));",
            "expectedOutput": "{\"derivedSecretA\":\"SECRET_35\",\"derivedSecretB\":\"SECRET_35\",\"secretsMatch\":true,\"status\":\"ECDH_SHARED_SECRET_ESTABLISHED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that both parties independently derived the identical shared secret via ECDH point multiplication?",
          "expectedStringOutput": "ECDH_SHARED_SECRET_ESTABLISHED",
          "acceptableAnswers": [
            "ECDH_SHARED_SECRET_ESTABLISHED",
            "status\":\"ECDH_SHARED_SECRET_ESTABLISHED\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_ECC_ECDSA_PUBLIC_KEY_SIGNATURE_VERIFICATION",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTSEC_ECC_ECDSA_PUBLIC_KEY_SIGNATURE_VERIFICATION",
              "errorExplanation": "Matching secrets confirm ECDH_SHARED_SECRET_ESTABLISHED.",
              "recoveryPath": {
                "simplerExplanation": "Matches ECDH_SHARED_SECRET_ESTABLISHED.",
                "guidedFixPrompt": "Type ECDH_SHARED_SECRET_ESTABLISHED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Hardware Root of Trust & Secure Boot Verification Engine",
    "overviewMetaphor": "Milestone 1 Synthesis: The complete sovereign embedded Secure Boot verification engine: 1. Comparing certificate public key digests against immutable hardware eFuses; 2. Computing SHA-256 image hashes over binary payloads; 3. Verifying ECDSA $(r, s)$ cryptographic signature coordinates; 4. Enforcing lockouts against unsigned or tampered firmware.",
    "blocks": [
      {
        "id": "iotsec-d5-b1-secure-boot-engine-synthesis",
        "day": 5,
        "blockNumber": 1,
        "title": "Hardware Root of Trust Secure Boot Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Secure Boot Engine Synthesis",
          "supportingTerms": [
            "Immutable eFuse Digest Comparison",
            "ECDSA P-256 Signature Math",
            "Execution Stage Lockout"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d4-b2-ecdsa-signature-generation-verification",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Milestone 1 Secure Boot Kernel Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "Silicon Reset: Masked Boot ROM reads hardware eFuse public key hash",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Inspects Second-Stage Bootloader header and validates ECDSA signature",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Calculates SHA-256 hash over application partition in flash",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Cryptographic chain verified 100% -> Dispatches control to main application!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "secure_boot_engine_demo.js",
            "initialCode": "function runSecureBootEngine() {\n  return {\n    rootOfTrustStatus: 'SILICON_EFUSE_HASH_VERIFIED',\n    ecdsaSignatureStatus: 'P256_ECDSA_VALIDATED',\n    sha256IntegrityStatus: 'FLASH_DIGEST_MATCHED',\n    engineStatus: 'SECURE_BOOT_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runSecureBootEngine().engineStatus);",
            "expectedOutput": "SECURE_BOOT_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Secure Boot Verification Engine?",
          "expectedStringOutput": "SECURE_BOOT_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "SECURE_BOOT_ENGINE_ACTIVE",
            "engineStatus: SECURE_BOOT_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_HARDWARE_ROOT_OF_TRUST_BOOT_ROM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTSEC_HARDWARE_ROOT_OF_TRUST_BOOT_ROM",
              "errorExplanation": "Matches SECURE_BOOT_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches SECURE_BOOT_ENGINE_ACTIVE.",
                "guidedFixPrompt": "Type SECURE_BOOT_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d5-b2-secure-boot-tamper-audit",
        "day": 5,
        "blockNumber": 2,
        "title": "Secure Boot Tamper Resistance & Integrity Invariant Audit",
        "conceptBudget": {
          "primaryConcept": "Secure Boot Invariant Audit",
          "supportingTerms": [
            "Zero Tampered Boot Invariant",
            "Hardware Root Digest Matching",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d5-b1-secure-boot-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "secure_boot_audit_demo.js",
            "initialCode": "function auditSecureBootSystem(authenticPassed, tamperedBlocked) {\n  const passed = authenticPassed && tamperedBlocked;\n  return {\n    authenticImageBooted: authenticPassed,\n    tamperedImageBlocked: tamperedBlocked,\n    grade: passed ? 'SECURE_BOOT_SYSTEM_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditSecureBootSystem(true, true)));",
            "expectedOutput": "{\"authenticImageBooted\":true,\"tamperedImageBlocked\":true,\"grade\":\"SECURE_BOOT_SYSTEM_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when authentic images boot successfully and tampered images are blocked?",
          "expectedStringOutput": "SECURE_BOOT_SYSTEM_AUDIT_PASSED",
          "acceptableAnswers": [
            "SECURE_BOOT_SYSTEM_AUDIT_PASSED",
            "grade\":\"SECURE_BOOT_SYSTEM_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_HARDWARE_ROOT_OF_TRUST_BOOT_ROM",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_IOTSEC_HARDWARE_ROOT_OF_TRUST_BOOT_ROM",
              "errorExplanation": "Passing all security checks awards SECURE_BOOT_SYSTEM_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards SECURE_BOOT_SYSTEM_AUDIT_PASSED.",
                "guidedFixPrompt": "Type SECURE_BOOT_SYSTEM_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d5-b3-milestone1-iotsec-cert",
        "day": 5,
        "blockNumber": 3,
        "title": "Milestone 1 Hardware Root of Trust & Secure Boot Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 1 Certification",
          "supportingTerms": [
            "Root of Trust Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d5-b2-secure-boot-tamper-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone1_iotsec_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 1: Complete Hardware Root of Trust & Secure Boot Verification Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 1: Complete Hardware Root of Trust & Secure Boot Verification Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 1 completion?",
          "expectedStringOutput": "⭐ MILESTONE 1: Complete Hardware Root of Trust & Secure Boot Verification Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 1: Complete Hardware Root of Trust & Secure Boot Verification Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_HARDWARE_ROOT_OF_TRUST_BOOT_ROM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTSEC_HARDWARE_ROOT_OF_TRUST_BOOT_ROM",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 1: Complete Hardware Root of Trust & Secure Boot Verification Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 6,
    "title": "Anti-Rollback Protection: Monotonic Counters & One-Time Programmable (eFuse) Silicon",
    "overviewMetaphor": "Anti-Rollback is a One-Way Turnstile in a Train Station: when security researchers discover a critical buffer overflow in firmware v1.0 and release v2.0, an attacker might try to flash v1.0 back onto the device to exploit the old vulnerability (A Downgrade Attack!); Anti-Rollback burns a microscopic silicon wire (an eFuse) every time the firmware version increments; because a blown electrical fuse can never be un-blown, the hardware refuses to execute any firmware with a version number lower than the eFuse count.",
    "blocks": [
      {
        "id": "iotsec-d6-b1-downgrade-exploit-threat-vector",
        "day": 6,
        "blockNumber": 1,
        "title": "The Firmware Downgrade Exploit Vector",
        "conceptBudget": {
          "primaryConcept": "Firmware Downgrade Attack Mechanics",
          "supportingTerms": [
            "Re-Enabling Patched CVEs (Flashing older authentic signed images with known zero-day vulnerabilities)",
            "Bypassing Signature Verification (Older firmware has a valid signature, so standard secure boot accepts it unless anti-rollback is enforced!)",
            "Security Version Numbers (SVN)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d1-b1-hardware-root-of-trust-boot-rom",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Downgrade Attack Scenario Analysis",
              "boxes": [
                {
                  "label": "1. Firmware v1.0 (Signed)",
                  "value": "Signature: VALID | Vulnerabilities: Remote RCE Buffer Overflow (CVE-2023-XXXX)",
                  "varType": "Vulnerable Valid Image",
                  "isUpdated": false
                },
                {
                  "label": "2. Firmware v2.0 (Signed)",
                  "value": "Signature: VALID | Vulnerabilities: Patched | eFuse Anti-Rollback Version: 2",
                  "varType": "Secure Patched Image",
                  "isUpdated": true
                },
                {
                  "label": "3. Attacker Flashes v1.0",
                  "value": "Without Anti-Rollback: Boots v1.0 -> HACKED! | With Anti-Rollback: eFuse Version 2 > Image Version 1 -> HALT!",
                  "varType": "Attack Result",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "downgrade_sim_demo.js",
            "initialCode": "function evaluateDowngradeSafety(efuseVersion, incomingVersion) {\n  if (incomingVersion < efuseVersion) {\n    return 'DOWNGRADE_ATTACK_DETECTED_REJECTED: HARDWARE_EFUSE_PREVENTS_ROLLBACK';\n  }\n  return 'FIRMWARE_VERSION_PERMITTED_TO_BOOT';\n}\n\nconsole.log(evaluateDowngradeSafety(3, 3)); // Same version\nconsole.log(evaluateDowngradeSafety(3, 4)); // Upgrade\nconsole.log(evaluateDowngradeSafety(3, 2)); // Downgrade attack!",
            "expectedOutput": "FIRMWARE_VERSION_PERMITTED_TO_BOOT\nFIRMWARE_VERSION_PERMITTED_TO_BOOT\nDOWNGRADE_ATTACK_DETECTED_REJECTED: HARDWARE_EFUSE_PREVENTS_ROLLBACK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is triggered when incoming firmware version 2 is loaded on a device with eFuse version 3 ($2 < 3$)?",
          "expectedStringOutput": "DOWNGRADE_ATTACK_DETECTED_REJECTED: HARDWARE_EFUSE_PREVENTS_ROLLBACK",
          "acceptableAnswers": [
            "DOWNGRADE_ATTACK_DETECTED_REJECTED: HARDWARE_EFUSE_PREVENTS_ROLLBACK",
            "DOWNGRADE_ATTACK_DETECTED_REJECTED"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_ANTI_ROLLBACK_MONOTONIC_EFUSE_COUNTERS",
          "diagnosisMap": {
            "PERMITTED": {
              "misconceptionId": "MC_IOTSEC_ANTI_ROLLBACK_MONOTONIC_EFUSE_COUNTERS",
              "errorExplanation": "Version 2 is lower than eFuse version 3, triggering anti-rollback rejection.",
              "recoveryPath": {
                "simplerExplanation": "Rejects downgrade -> DOWNGRADE_ATTACK_DETECTED_REJECTED: HARDWARE_EFUSE_PREVENTS_ROLLBACK.",
                "guidedFixPrompt": "Type DOWNGRADE_ATTACK_DETECTED_REJECTED: HARDWARE_EFUSE_PREVENTS_ROLLBACK"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d6-b2-efuse-silicon-burning-mechanics",
        "day": 6,
        "blockNumber": 2,
        "title": "eFuse One-Time Programmable (OTP) Silicon Burning Mechanics",
        "conceptBudget": {
          "primaryConcept": "OTP eFuse Burning Physics",
          "supportingTerms": [
            "High-Voltage Programming Pulse ($V_{\\text{prog}} = 2.5\\text{ V}$)",
            "Irreversible Physical Fuse Vaporization (Changing bit state from 0 to 1 permanently)",
            "Monotonic Counter Register (Counting number of '1' bits in eFuse block)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d6-b1-downgrade-exploit-threat-vector",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "eFuse Bit Counter in C",
            "codeSnippet": "uint32_t efuse_word = READ_EFUSE_REGISTER(EFUSE_BLK_REV);\nint current_version = __builtin_popcount(efuse_word); // Counts number of burned 1-bits\nif (incoming_fw_version > current_version) {\n  BURN_EFUSE_BITS(incoming_fw_version - current_version); // Permanently burns additional 1-bits!\n}",
            "lineNotes": {
              "2": "Counts burned 1-bits in hardware.",
              "4": "Permanently burns new bits on successful upgrade."
            }
          },
          {
            "type": "runnable_code",
            "filename": "efuse_popcount_demo.js",
            "initialCode": "function countEfuseVersion(bitfieldInt) {\n  let count = 0;\n  let temp = bitfieldInt;\n  while (temp > 0) {\n    count += (temp & 1);\n    temp = temp >>> 1;\n  }\n  return {\n    efuseBitfieldHex: '0x' + bitfieldInt.toString(16),\n    antiRollbackVersion: count,\n    status: 'EFUSE_MONOTONIC_VERSION_COUNTED'\n  };\n}\n\nconsole.log(JSON.stringify(countEfuseVersion(0b00000111))); // 3 bits burned = v3\nconsole.log(JSON.stringify(countEfuseVersion(0b00011111))); // 5 bits burned = v5",
            "expectedOutput": "{\"efuseBitfieldHex\":\"0x7\",\"antiRollbackVersion\":3,\"status\":\"EFUSE_MONOTONIC_VERSION_COUNTED\"}\n{\"efuseBitfieldHex\":\"0x1f\",\"antiRollbackVersion\":5,\"status\":\"EFUSE_MONOTONIC_VERSION_COUNTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the anti-rollback version represented by an eFuse bitfield with 5 burned bits (`0b00011111`)?",
          "expectedStringOutput": "5",
          "acceptableAnswers": [
            "5",
            "antiRollbackVersion\":5"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_ANTI_ROLLBACK_MONOTONIC_EFUSE_COUNTERS",
          "diagnosisMap": {
            "31": {
              "misconceptionId": "MC_IOTSEC_ANTI_ROLLBACK_MONOTONIC_EFUSE_COUNTERS",
              "errorExplanation": "0x1F = 31 in decimal, but the monotonic version is the popcount of 1-bits (5 bits).",
              "recoveryPath": {
                "simplerExplanation": "Counts 5 burned bits -> Version 5.",
                "guidedFixPrompt": "Type 5"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d6-b3-secure-rollback-watchdog-recovery",
        "day": 6,
        "blockNumber": 3,
        "title": "Dual-Slot OTA Watchdog Rollback Invariant",
        "conceptBudget": {
          "primaryConcept": "OTA Watchdog Self-Test Confirmation",
          "supportingTerms": [
            "Pending Verification State",
            "Hardware Watchdog Confirmation (`esp_ota_mark_app_valid_cancel_rollback()`)",
            "eFuse Burn Timing Invariant (ONLY burn eFuse AFTER self-test passes, never before!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d6-b2-efuse-silicon-burning-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ota_efuse_timing_demo.js",
            "initialCode": "function evaluateEfuseBurnTiming(selfTestPassed) {\n  return selfTestPassed\n    ? 'SELF_TEST_SUCCESSFUL: PERMANENTLY_BURN_EFUSE_VERSION_UPGRADE'\n    : 'SELF_TEST_FAILED: WATCHDOG_REBOOTS_TO_OLD_SLOT_ZERO_EFUSES_BURNED';\n}\n\nconsole.log(evaluateEfuseBurnTiming(true));\nconsole.log(evaluateEfuseBurnTiming(false));",
            "expectedOutput": "SELF_TEST_SUCCESSFUL: PERMANENTLY_BURN_EFUSE_VERSION_UPGRADE\nSELF_TEST_FAILED: WATCHDOG_REBOOTS_TO_OLD_SLOT_ZERO_EFUSES_BURNED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must firmware firmware upgrade eFuses be burned ONLY after self-test confirmation instead of during image download?",
          "options": [
            "Because if the new firmware crashes or fails to boot, burning eFuses in advance would permanently brick the device by preventing the hardware from falling back to the working previous slot",
            "Because eFuses consume too much electricity during download",
            "To make downloads faster"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTSEC_ANTI_ROLLBACK_MONOTONIC_EFUSE_COUNTERS",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTSEC_ANTI_ROLLBACK_MONOTONIC_EFUSE_COUNTERS",
              "errorExplanation": "Prematurely burning eFuses prevents rollback to previous working slots.",
              "recoveryPath": {
                "simplerExplanation": "Prevents permanent bricking if new firmware fails.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 7,
    "title": "Device Identity & X.509 Certificates: PKI, CAs and Device Provisioning",
    "overviewMetaphor": "An X.509 Certificate is a Government Passport for an IoT Device: instead of hardcoding a shared password in firmware (Which leaks the moment an attacker disassembles one device!), each device holds a unique X.509 client certificate; the certificate contains the device's Public Key, Serial Number, and an official Digital Signature stamped by the factory's Certificate Authority (CA); when the device connects to AWS IoT or an Azure hub, the server verifies the CA signature, authenticating the device's unique identity without any shared secrets.",
    "blocks": [
      {
        "id": "iotsec-d7-b1-pki-hierarchy-chain-of-trust",
        "day": 7,
        "blockNumber": 1,
        "title": "Public Key Infrastructure (PKI): Root CAs $\\to$ Intermediate CAs $\\to$ Device Certs",
        "conceptBudget": {
          "primaryConcept": "PKI Chain of Trust",
          "supportingTerms": [
            "Root Certificate Authority (Air-gapped HSM root key)",
            "Intermediate / Issuing CA (Online server for factory signing)",
            "Device End-Entity Certificate",
            "Chain Validation Algorithm (RFC 5280)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d4-b2-ecdsa-signature-generation-verification",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "X.509 Certificate Chain of Trust",
              "boxes": [
                {
                  "label": "1. Root CA Certificate",
                  "value": "Subject: 'Acme Root CA' | Issuer: 'Acme Root CA' (Self-Signed) | Stored: In trusted root truststore",
                  "varType": "Root Authority",
                  "isUpdated": false
                },
                {
                  "label": "2. Intermediate Factory CA",
                  "value": "Subject: 'Acme Factory CA' | Signed By: Acme Root CA private key",
                  "varType": "Issuing Authority",
                  "isUpdated": false
                },
                {
                  "label": "3. Device Client Certificate",
                  "value": "Subject: 'DEVICE-UID-7749' | Signed By: Acme Factory CA private key",
                  "varType": "End Entity",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "pki_chain_demo.js",
            "initialCode": "function evaluateCertChain(rootIssuer, subIssuer, deviceIssuer) {\n  const chainValid = (subIssuer === rootIssuer) && (deviceIssuer === 'Acme Factory CA');\n  return chainValid\n    ? 'X509_CHAIN_OF_TRUST_VERIFIED_TO_ROOT'\n    : 'BROKEN_CERTIFICATE_CHAIN_UNTRUSTED';\n}\n\nconsole.log(evaluateCertChain('Acme Root CA', 'Acme Root CA', 'Acme Factory CA'));\nconsole.log(evaluateCertChain('Acme Root CA', 'Hacker CA', 'Acme Factory CA'));",
            "expectedOutput": "X509_CHAIN_OF_TRUST_VERIFIED_TO_ROOT\nBROKEN_CERTIFICATE_CHAIN_UNTRUSTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is awarded when an X.509 device certificate validates completely back to the trusted Root CA?",
          "expectedStringOutput": "X509_CHAIN_OF_TRUST_VERIFIED_TO_ROOT",
          "acceptableAnswers": [
            "X509_CHAIN_OF_TRUST_VERIFIED_TO_ROOT",
            "X509_CHAIN_OF_TRUST_VERIFIED"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_DEVICE_PROVISIONING_X509_CERT_CHAIN",
          "diagnosisMap": {
            "BROKEN": {
              "misconceptionId": "MC_IOTSEC_DEVICE_PROVISIONING_X509_CERT_CHAIN",
              "errorExplanation": "Valid issuer chains verify back to the trusted root.",
              "recoveryPath": {
                "simplerExplanation": "Matches X509_CHAIN_OF_TRUST_VERIFIED_TO_ROOT.",
                "guidedFixPrompt": "Type X509_CHAIN_OF_TRUST_VERIFIED_TO_ROOT"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d7-b2-x509-asn1-structure-validity",
        "day": 7,
        "blockNumber": 2,
        "title": "X.509 ASN.1 Structure: Validity Windows & Subject Alternative Names (SAN)",
        "conceptBudget": {
          "primaryConcept": "X.509 ASN.1 Field Anatomy",
          "supportingTerms": [
            "Validity Window (`notBefore` and `notAfter` timestamps)",
            "Subject Alternative Name (SAN: Unique Device ID e.g. `urn:uuid:...`)",
            "Key Usage (`digitalSignature`, `keyEncipherment`)",
            "Clock Synchronization Invariant (NTP/RTC clock checking)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d7-b1-pki-hierarchy-chain-of-trust",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "validity_window_demo.js",
            "initialCode": "function checkValidityWindow(nowSec, notBeforeSec, notAfterSec) {\n  const isStarted = nowSec >= notBeforeSec;\n  const isNotExpired = nowSec <= notAfterSec;\n  const isValid = isStarted && isNotExpired;\n  return {\n    currentTimeSec: nowSec,\n    notBeforeSec,\n    notAfterSec,\n    certificateActive: isValid,\n    status: isValid ? 'CERTIFICATE_TEMPORALLY_VALID' : (isStarted ? 'CERTIFICATE_EXPIRED' : 'CERTIFICATE_NOT_YET_VALID')\n  };\n}\n\nconsole.log(JSON.stringify(checkValidityWindow(1600000000, 1500000000, 1700000000)));\nconsole.log(JSON.stringify(checkValidityWindow(1800000000, 1500000000, 1700000000)));",
            "expectedOutput": "{\"currentTimeSec\":1600000000,\"notBeforeSec\":1500000000,\"notAfterSec\":1700000000,\"certificateActive\":true,\"status\":\"CERTIFICATE_TEMPORALLY_VALID\"}\n{\"currentTimeSec\":1800000000,\"notBeforeSec\":1500000000,\"notAfterSec\":1700000000,\"certificateActive\":false,\"status\":\"CERTIFICATE_EXPIRED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when current timestamp is between notBefore and notAfter?",
          "expectedStringOutput": "CERTIFICATE_TEMPORALLY_VALID",
          "acceptableAnswers": [
            "CERTIFICATE_TEMPORALLY_VALID",
            "status\":\"CERTIFICATE_TEMPORALLY_VALID\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_DEVICE_PROVISIONING_X509_CERT_CHAIN",
          "diagnosisMap": {
            "EXPIRED": {
              "misconceptionId": "MC_IOTSEC_DEVICE_PROVISIONING_X509_CERT_CHAIN",
              "errorExplanation": "Timestamp falls within the validity window.",
              "recoveryPath": {
                "simplerExplanation": "Matches CERTIFICATE_TEMPORALLY_VALID.",
                "guidedFixPrompt": "Type CERTIFICATE_TEMPORALLY_VALID"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d7-b3-factory-device-provisioning",
        "day": 7,
        "blockNumber": 3,
        "title": "Factory Line Device Provisioning & Certificate Injection",
        "conceptBudget": {
          "primaryConcept": "Factory Provisioning Pipeline",
          "supportingTerms": [
            "On-Chip Key Generation (Private key generated in hardware, NEVER exported!)",
            "Certificate Signing Request (CSR: Exported to factory CA)",
            "CA Certificate Injection back into device storage"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d7-b2-x509-asn1-structure-validity",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "factory_provision_demo.js",
            "initialCode": "function evaluateProvisioningStep(stepName) {\n  return `PROVISIONING_STEP: ${stepName}_COMPLETED_ZERO_KEY_EXPOSURE`;\n}\n\nconsole.log(evaluateProvisioningStep('GENERATE_PRIVATE_KEY_IN_SECURE_ELEMENT'));\nconsole.log(evaluateProvisioningStep('EXPORT_CSR_AND_INJECT_CA_CERTIFICATE'));",
            "expectedOutput": "PROVISIONING_STEP: GENERATE_PRIVATE_KEY_IN_SECURE_ELEMENT_COMPLETED_ZERO_KEY_EXPOSURE\nPROVISIONING_STEP: EXPORT_CSR_AND_INJECT_CA_CERTIFICATE_COMPLETED_ZERO_KEY_EXPOSURE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Where must the device private key be generated during factory line provisioning to guarantee zero key exposure?",
          "expectedStringOutput": "GENERATE_PRIVATE_KEY_IN_SECURE_ELEMENT",
          "acceptableAnswers": [
            "GENERATE_PRIVATE_KEY_IN_SECURE_ELEMENT",
            "SECURE_ELEMENT",
            "In Secure Element"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_DEVICE_PROVISIONING_X509_CERT_CHAIN",
          "diagnosisMap": {
            "FACTORY_SERVER": {
              "misconceptionId": "MC_IOTSEC_DEVICE_PROVISIONING_X509_CERT_CHAIN",
              "errorExplanation": "Generating keys on factory servers risks database leaks. Keys must be generated inside on-device Secure Elements.",
              "recoveryPath": {
                "simplerExplanation": "Private key must be generated in the Secure Element.",
                "guidedFixPrompt": "Type GENERATE_PRIVATE_KEY_IN_SECURE_ELEMENT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 8,
    "title": "Secure Elements (SE) & Hardware Security Modules (TPM 2.0)",
    "overviewMetaphor": "A Secure Element is a High-Security Titanium Bank Vault inside the Chip: the main microcontroller CPU is a busy office where software bugs can happen; an attacker using a debugger might try to dump the entire RAM memory; the Secure Element (e.g. ATECC608A / NXP SE050) is a separate microscopic silicon chip with physical metal mesh shields, optical tamper sensors, and hardware crypto accelerators; private keys NEVER leave the vault—the CPU simply sends data in via I2C, and the vault returns the calculated signature.",
    "blocks": [
      {
        "id": "iotsec-d8-b1-secure-element-architecture-atecc",
        "day": 8,
        "blockNumber": 1,
        "title": "Secure Element Architecture: ATECC608A / SE050 Hardware Vaults",
        "conceptBudget": {
          "primaryConcept": "Secure Element Architecture",
          "supportingTerms": [
            "Private Key Non-Exportability Invariant",
            "Active Shield Top-Metal Mesh (Destroys silicon if probed with focused ion beam)",
            "Hardware Cryptographic Acceleration (ECDSA P-256 in 30 ms)",
            "Encrypted I2C Command Protocol"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d7-b3-factory-device-provisioning",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Main MCU vs Secure Element Silicon Separation",
              "boxes": [
                {
                  "label": "Main MCU (STM32/ESP32)",
                  "value": "Role: Application Logic, RTOS, Wi-Fi | Key Storage: NONE! | Attack Surface: Accessible via JTAG",
                  "varType": "Unsecured Domain",
                  "isUpdated": false
                },
                {
                  "label": "Dedicated Secure Element",
                  "value": "Role: Holds Private Key, Computes Signatures | Key Storage: 16 Hardware Vault Slots | Attack Surface: HARDENED",
                  "varType": "Hardware Vault",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "se_vault_demo.js",
            "initialCode": "function evaluateKeyExport(canExportKey) {\n  return canExportKey\n    ? 'CRITICAL_SECURITY_DEFECT: PRIVATE_KEY_LEAKABLE'\n    : 'SECURE_ELEMENT_COMPLIANT: PRIVATE_KEY_NON_EXPORTABLE_IN_SILICON';\n}\n\nconsole.log(evaluateKeyExport(false));",
            "expectedOutput": "SECURE_ELEMENT_COMPLIANT: PRIVATE_KEY_NON_EXPORTABLE_IN_SILICON",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What compliance status confirms that a private key is permanently non-exportable from Secure Element silicon?",
          "expectedStringOutput": "SECURE_ELEMENT_COMPLIANT: PRIVATE_KEY_NON_EXPORTABLE_IN_SILICON",
          "acceptableAnswers": [
            "SECURE_ELEMENT_COMPLIANT: PRIVATE_KEY_NON_EXPORTABLE_IN_SILICON",
            "SECURE_ELEMENT_COMPLIANT"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SECURE_ELEMENT_TPM_CRYPTO_OFFLOAD",
          "diagnosisMap": {
            "LEAKABLE": {
              "misconceptionId": "MC_IOTSEC_SECURE_ELEMENT_TPM_CRYPTO_OFFLOAD",
              "errorExplanation": "Secure elements enforce non-exportability of private keys.",
              "recoveryPath": {
                "simplerExplanation": "Matches SECURE_ELEMENT_COMPLIANT.",
                "guidedFixPrompt": "Type SECURE_ELEMENT_COMPLIANT: PRIVATE_KEY_NON_EXPORTABLE_IN_SILICON"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d8-b2-tpm-2-pcr-measured-boot",
        "day": 8,
        "blockNumber": 2,
        "title": "TPM 2.0 Platform Configuration Registers (PCR) & Measured Boot",
        "conceptBudget": {
          "primaryConcept": "TPM 2.0 PCR Measured Boot",
          "supportingTerms": [
            "PCR Extend Equation: $\\text{PCR}[n] = \\text{SHA256}(\\text{PCR}[n] \\mathbin{\\Vert} \\text{Measurement})$",
            "PCR 0..7 (Firmware, Bootloader, Config measurements)",
            "Sealed Storage: Unlocking disk encryption keys ONLY if PCR hashes match exact clean boot state!"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d8-b1-secure-element-architecture-atecc",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "TPM PCR Extend Formula",
            "codeSnippet": "// Measurement = sha256(bootloader_binary)\n// TPM internally extends register: PCR[0] = SHA256(PCR[0] || Measurement)\nconst newPcr = crypto.createHash('sha256').update(Buffer.concat([oldPcrBuffer, measurementBuffer])).digest();",
            "lineNotes": {
              "2": "TPM PCR extension formula.",
              "3": "Concatenates and hashes old PCR with measurement."
            }
          },
          {
            "type": "runnable_code",
            "filename": "pcr_seal_demo.js",
            "initialCode": "function evaluatePcrSealing(pcrExpectedHex, pcrMeasuredHex) {\n  const matches = (pcrExpectedHex === pcrMeasuredHex);\n  return {\n    expectedPcr: pcrExpectedHex,\n    measuredPcr: pcrMeasuredHex,\n    unsealKeyPermitted: matches,\n    status: matches ? 'TPM_SEALED_KEY_UNLOCKED_STATE_AUTHENTIC' : 'TPM_SEALED_KEY_LOCKED_TAMPER_DETECTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluatePcrSealing('0xCLEAN_PCR_00', '0xCLEAN_PCR_00')));\nconsole.log(JSON.stringify(evaluatePcrSealing('0xCLEAN_PCR_00', '0xTAMPERED_PCR_99')));",
            "expectedOutput": "{\"expectedPcr\":\"0xCLEAN_PCR_00\",\"measuredPcr\":\"0xCLEAN_PCR_00\",\"unsealKeyPermitted\":true,\"status\":\"TPM_SEALED_KEY_UNLOCKED_STATE_AUTHENTIC\"}\n{\"expectedPcr\":\"0xCLEAN_PCR_00\",\"measuredPcr\":\"0xTAMPERED_PCR_99\",\"unsealKeyPermitted\":false,\"status\":\"TPM_SEALED_KEY_LOCKED_TAMPER_DETECTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned by TPM 2.0 sealed storage when measured PCR matches the expected clean state?",
          "expectedStringOutput": "TPM_SEALED_KEY_UNLOCKED_STATE_AUTHENTIC",
          "acceptableAnswers": [
            "TPM_SEALED_KEY_UNLOCKED_STATE_AUTHENTIC",
            "status\":\"TPM_SEALED_KEY_UNLOCKED_STATE_AUTHENTIC\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SECURE_ELEMENT_TPM_CRYPTO_OFFLOAD",
          "diagnosisMap": {
            "LOCKED": {
              "misconceptionId": "MC_IOTSEC_SECURE_ELEMENT_TPM_CRYPTO_OFFLOAD",
              "errorExplanation": "Matching PCR values unseal the stored encryption key.",
              "recoveryPath": {
                "simplerExplanation": "Unlocks sealed key -> TPM_SEALED_KEY_UNLOCKED_STATE_AUTHENTIC.",
                "guidedFixPrompt": "Type TPM_SEALED_KEY_UNLOCKED_STATE_AUTHENTIC"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d8-b3-crypto-hardware-offloading-speed",
        "day": 8,
        "blockNumber": 3,
        "title": "Cryptographic Hardware Acceleration Benchmarking",
        "conceptBudget": {
          "primaryConcept": "Crypto Offload Benchmarking",
          "supportingTerms": [
            "Software ECDSA: 450 ms on Cortex-M0+",
            "Hardware SE ECDSA: 25 ms",
            "Battery energy reduction (94% energy savings per signature!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d8-b2-tpm-2-pcr-measured-boot",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "crypto_speed_demo.js",
            "initialCode": "function evaluateCryptoSpeedup(softwareMs = 450, hardwareMs = 25) {\n  const speedup = softwareMs / hardwareMs;\n  return {\n    softwareExecutionMs: softwareMs,\n    hardwareVaultMs: hardwareMs,\n    speedupFactor: Number(speedup.toFixed(1)),\n    energySavingsPercent: Number((((softwareMs - hardwareMs) / softwareMs) * 100).toFixed(1)),\n    status: 'CRYPTO_HARDWARE_ACCELERATION_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateCryptoSpeedup(450, 25)));",
            "expectedOutput": "{\"softwareExecutionMs\":450,\"hardwareVaultMs\":25,\"speedupFactor\":18,\"energySavingsPercent\":94.4,\"status\":\"CRYPTO_HARDWARE_ACCELERATION_OPTIMAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many times faster is a 25 ms hardware Secure Element signature compared to 450 ms software execution ($450 / 25$)?",
          "expectedStringOutput": "18",
          "acceptableAnswers": [
            "18",
            "18x",
            "speedupFactor\":18"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SECURE_ELEMENT_TPM_CRYPTO_OFFLOAD",
          "diagnosisMap": {
            "450": {
              "misconceptionId": "MC_IOTSEC_SECURE_ELEMENT_TPM_CRYPTO_OFFLOAD",
              "errorExplanation": "450 / 25 = 18x speedup.",
              "recoveryPath": {
                "simplerExplanation": "450 / 25 = 18.",
                "guidedFixPrompt": "Type 18"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 9,
    "title": "Hardware Debug Port Security: JTAG/SWD Disabling & Bitfuse Lockout",
    "overviewMetaphor": "An Open JTAG Port is a Master Key Left in the Front Door: during development, engineers use JTAG/SWD probe pins to pause the CPU, read registers, and inspect RAM variables; if a production smart lock is shipped with JTAG enabled, a burglar with a $15 debugging cable can connect to the test points on the circuit board, pause the processor, and extract the master AES encryption key from memory; in production, you must burn the dedicated JTAG Security Bitfuse to physically disconnect the debug wires permanently inside the silicon.",
    "blocks": [
      {
        "id": "iotsec-d9-b1-jtag-swd-hardware-threat",
        "day": 9,
        "blockNumber": 1,
        "title": "The JTAG/SWD Test Access Port (TAP) Attack Surface",
        "conceptBudget": {
          "primaryConcept": "JTAG/SWD Physical Attack Surface",
          "supportingTerms": [
            "Test Access Port (TAP: TMS, TCK, TDI, TDO, nTRST pins)",
            "Memory Dumping Exploit (Halting CPU via debug register `DHCSR` and dumping entire SRAM/Flash)",
            "Physical Test Points on PCBs (Easily found with multimeter or probe needles)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d8-b1-secure-element-architecture-atecc",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Open JTAG vs Permanently Fused JTAG Comparison",
              "boxes": [
                {
                  "label": "1. Open JTAG (Development)",
                  "value": "State: DEBUG_ENABLED | Attack Vector: Memory Dumping, Register Injection, Breakpoints | Risk: CRITICAL",
                  "varType": "Open Debug Port",
                  "isUpdated": false
                },
                {
                  "label": "2. Permanently Fused JTAG",
                  "value": "State: HARDWARE_FUSED_DISCONNECTED | JTAG TAP: Physically Disabled | Silicon State: LOCKED & SECURE",
                  "varType": "Hardened Production",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "jtag_lock_demo.js",
            "initialCode": "function evaluateJtagState(isProduction, isJtagFused) {\n  if (isProduction && !isJtagFused) {\n    return 'CRITICAL_SECURITY_DEFECT: OPEN_JTAG_ON_PRODUCTION_DEVICE';\n  }\n  return 'JTAG_SECURITY_COMPLIANT_SILICON_LOCKED';\n}\n\nconsole.log(evaluateJtagState(true, true));\nconsole.log(evaluateJtagState(true, false));",
            "expectedOutput": "JTAG_SECURITY_COMPLIANT_SILICON_LOCKED\nCRITICAL_SECURITY_DEFECT: OPEN_JTAG_ON_PRODUCTION_DEVICE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a production device has permanently disabled JTAG via bitfuse burning?",
          "expectedStringOutput": "JTAG_SECURITY_COMPLIANT_SILICON_LOCKED",
          "acceptableAnswers": [
            "JTAG_SECURITY_COMPLIANT_SILICON_LOCKED",
            "JTAG_SECURITY_COMPLIANT"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_JTAG_SWD_DEBUG_PORT_FUSING_LOCKOUT",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_IOTSEC_JTAG_SWD_DEBUG_PORT_FUSING_LOCKOUT",
              "errorExplanation": "Burning the bitfuse achieves JTAG_SECURITY_COMPLIANT_SILICON_LOCKED.",
              "recoveryPath": {
                "simplerExplanation": "Matches JTAG_SECURITY_COMPLIANT_SILICON_LOCKED.",
                "guidedFixPrompt": "Type JTAG_SECURITY_COMPLIANT_SILICON_LOCKED"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d9-b2-efuse-debug-disable-bitfuses",
        "day": 9,
        "blockNumber": 2,
        "title": "Permanent Bitfuse Locking: `DIS_PAD_JTAG` & `DIS_USB_JTAG`",
        "conceptBudget": {
          "primaryConcept": "Silicon JTAG Disabling eFuses",
          "supportingTerms": [
            "`DIS_PAD_JTAG` (Disconnects physical GPIO pins from debug controller)",
            "`DIS_USB_JTAG` (Disconnects internal USB Serial/JTAG peripheral)",
            "Read-Out Protection (RDP Level 2 on STM32: Permanent irreversible silicon lock)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d9-b1-jtag-swd-hardware-threat",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "eFuse JTAG Disabling in C",
            "codeSnippet": "// Irreversibly burn JTAG disabling eFuse bits on production line\nesp_efuse_write_field_bit(ESP_EFUSE_DIS_PAD_JTAG);\nesp_efuse_write_field_bit(ESP_EFUSE_DIS_USB_JTAG); // Disables USB JTAG tap!\nesp_efuse_burn_new_values(); // High voltage burning pulse",
            "lineNotes": {
              "2": "Burns pad JTAG disconnect bit.",
              "3": "Burns USB JTAG disconnect bit.",
              "4": "Executes permanent silicon fuse burn."
            }
          },
          {
            "type": "runnable_code",
            "filename": "rdp_levels_demo.js",
            "initialCode": "function evaluateRdpLevel(level) {\n  if (level === 0) return 'RDP_LEVEL_0: OPEN_NO_PROTECTION';\n  if (level === 1) return 'RDP_LEVEL_1: MEMORY_READOUT_BLOCKED_CAN_BE_REVERTED_WITH_MASS_ERASE';\n  if (level === 2) return 'RDP_LEVEL_2: PERMANENT_SILICON_LOCKOUT_IRREVERSIBLE';\n  return 'UNKNOWN_LEVEL';\n}\n\nconsole.log(evaluateRdpLevel(2));",
            "expectedOutput": "RDP_LEVEL_2: PERMANENT_SILICON_LOCKOUT_IRREVERSIBLE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status describes STM32 Read-Out Protection (RDP) Level 2?",
          "expectedStringOutput": "RDP_LEVEL_2: PERMANENT_SILICON_LOCKOUT_IRREVERSIBLE",
          "acceptableAnswers": [
            "RDP_LEVEL_2: PERMANENT_SILICON_LOCKOUT_IRREVERSIBLE",
            "RDP_LEVEL_2"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_JTAG_SWD_DEBUG_PORT_FUSING_LOCKOUT",
          "diagnosisMap": {
            "LEVEL_0": {
              "misconceptionId": "MC_IOTSEC_JTAG_SWD_DEBUG_PORT_FUSING_LOCKOUT",
              "errorExplanation": "Level 2 is the irreversible permanent silicon lockout.",
              "recoveryPath": {
                "simplerExplanation": "Matches RDP_LEVEL_2: PERMANENT_SILICON_LOCKOUT_IRREVERSIBLE.",
                "guidedFixPrompt": "Type RDP_LEVEL_2: PERMANENT_SILICON_LOCKOUT_IRREVERSIBLE"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d9-b3-secure-authenticated-debug-unlock",
        "day": 9,
        "blockNumber": 3,
        "title": "Secure Authenticated Debug (ADIv6 & Cryptographic Challenge-Response)",
        "conceptBudget": {
          "primaryConcept": "Cryptographic Authenticated Debugging",
          "supportingTerms": [
            "ARM ADIv6 Debug Architecture",
            "Challenge-Response Unlock Protocol (Device generates random nonce $\\implies$ Factory signs with Private Key $\\implies$ Debugger temporarily re-enabled)",
            "Zero permanent backdoors"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d9-b2-efuse-debug-disable-bitfuses",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "auth_debug_demo.js",
            "initialCode": "function evaluateChallengeResponseDebug(challengeNonce, signedResponse, factoryPublicKeyValid) {\n  const isAuthorized = factoryPublicKeyValid && (signedResponse.length === 64);\n  return {\n    challengeNonceHex: challengeNonce,\n    debugUnlocked: isAuthorized,\n    status: isAuthorized ? 'AUTHENTICATED_DEBUG_SESSION_OPENED' : 'UNAUTHORIZED_DEBUG_ATTEMPT_DENIED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateChallengeResponseDebug('0xNONCE_1234', 'a'.repeat(64), true)));",
            "expectedOutput": "{\"challengeNonceHex\":\"0xNONCE_1234\",\"debugUnlocked\":true,\"status\":\"AUTHENTICATED_DEBUG_SESSION_OPENED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms opening of an authenticated debug session via cryptographic challenge-response?",
          "expectedStringOutput": "AUTHENTICATED_DEBUG_SESSION_OPENED",
          "acceptableAnswers": [
            "AUTHENTICATED_DEBUG_SESSION_OPENED",
            "status\":\"AUTHENTICATED_DEBUG_SESSION_OPENED\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_JTAG_SWD_DEBUG_PORT_FUSING_LOCKOUT",
          "diagnosisMap": {
            "DENIED": {
              "misconceptionId": "MC_IOTSEC_JTAG_SWD_DEBUG_PORT_FUSING_LOCKOUT",
              "errorExplanation": "Valid cryptographic response unlocks an authenticated session.",
              "recoveryPath": {
                "simplerExplanation": "Matches AUTHENTICATED_DEBUG_SESSION_OPENED.",
                "guidedFixPrompt": "Type AUTHENTICATED_DEBUG_SESSION_OPENED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 10,
    "title": "Flash Encryption & Bus Scrambling: AES-XTS on External SPI Flash",
    "overviewMetaphor": "Flash Encryption is a Shredder and Reassembler at the Chip Pins: many microcontrollers use an external 8-pin SPI NOR Flash chip to store large code and assets; an attacker with a heat gun can desolder that external flash chip and read its entire contents with a programmer (Reading raw passwords and certificates!); with Transparent AES-XTS Flash Encryption, the microcontroller encrypts every byte as it leaves the main chip; on the external flash, the data looks like pure random noise, decrypting on-the-fly only when fetched into internal CPU cache.",
    "blocks": [
      {
        "id": "iotsec-d10-b1-external-spi-flash-threat",
        "day": 10,
        "blockNumber": 1,
        "title": "The External SPI/QSPI Flash Sniffing & Desoldering Threat",
        "conceptBudget": {
          "primaryConcept": "External Flash Attack Surfaces",
          "supportingTerms": [
            "Flash Desoldering (Chip-off attacks using hot air rework stations)",
            "Bus Sniffing with Logic Analyzers on SPI lines",
            "Extracting plain-text proprietary IP, Wi-Fi credentials, and private keys"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d2-b1-aes-block-cipher-internals",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Unencrypted SPI Flash vs AES-XTS Encrypted Flash",
              "boxes": [
                {
                  "label": "1. Unencrypted SPI Flash",
                  "value": "Physical Pins: Raw ASCII & Binary | Attacker Action: Connects logic analyzer -> Reads credentials instantly!",
                  "varType": "Vulnerable Plaintext",
                  "isUpdated": false
                },
                {
                  "label": "2. AES-XTS Encrypted Flash",
                  "value": "Physical Pins: High-Entropy Pseudo-Random Ciphertext | Attacker Action: Desolders chip -> Reads ZERO secrets!",
                  "varType": "Hardware Encrypted",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "flash_sniff_demo.js",
            "initialCode": "function evaluateFlashExposure(isEncrypted) {\n  return isEncrypted\n    ? 'AES_XTS_HARDWARE_ENCRYPTION_ACTIVE: EXTERNAL_FLASH_READOUT_PREVENTED'\n    : 'CRITICAL_VULNERABILITY: UNENCRYPTED_FLASH_READABLE_BY_CHIP_OFF';\n}\n\nconsole.log(evaluateFlashExposure(true));\nconsole.log(evaluateFlashExposure(false));",
            "expectedOutput": "AES_XTS_HARDWARE_ENCRYPTION_ACTIVE: EXTERNAL_FLASH_READOUT_PREVENTED\nCRITICAL_VULNERABILITY: UNENCRYPTED_FLASH_READABLE_BY_CHIP_OFF",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that external SPI flash is protected against chip-off desoldering attacks?",
          "expectedStringOutput": "AES_XTS_HARDWARE_ENCRYPTION_ACTIVE: EXTERNAL_FLASH_READOUT_PREVENTED",
          "acceptableAnswers": [
            "AES_XTS_HARDWARE_ENCRYPTION_ACTIVE: EXTERNAL_FLASH_READOUT_PREVENTED",
            "AES_XTS_HARDWARE_ENCRYPTION_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_FLASH_ENCRYPTION_AES_XTS_BUS_SCRAMBLING",
          "diagnosisMap": {
            "UNENCRYPTED": {
              "misconceptionId": "MC_IOTSEC_FLASH_ENCRYPTION_AES_XTS_BUS_SCRAMBLING",
              "errorExplanation": "AES-XTS hardware encryption protects external flash.",
              "recoveryPath": {
                "simplerExplanation": "Matches AES_XTS_HARDWARE_ENCRYPTION_ACTIVE.",
                "guidedFixPrompt": "Type AES_XTS_HARDWARE_ENCRYPTION_ACTIVE: EXTERNAL_FLASH_READOUT_PREVENTED"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d10-b2-aes-xts-tweakable-block-cipher",
        "day": 10,
        "blockNumber": 2,
        "title": "AES-XTS Tweakable Mode: Sector & Address Scrambling Math",
        "conceptBudget": {
          "primaryConcept": "AES-XTS Tweakable Mode Math",
          "supportingTerms": [
            "XTS Mode (IEEE 1619 standard for storage media)",
            "Tweak Value ($T = E_{K_2}(\\text{Address})$ incorporates physical memory address into encryption)",
            "Preventing Block Relocation Attacks (Moving an encrypted block to a different memory address fails to decrypt properly!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d10-b1-external-spi-flash-threat",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "AES-XTS Physical Address Tweak",
            "codeSnippet": "// Tweak T = AES_Encrypt(Key2, PhysicalSectorAddress)\n// Ciphertext C = AES_Encrypt(Key1, Plaintext ^ T) ^ T\nconst scrambledData = aesXtsBlockEncrypt(plaintext, physicalAddress, key1, key2);",
            "lineNotes": {
              "1": "Derives tweak from physical memory address.",
              "2": "Applies tweak before and after block encryption."
            }
          },
          {
            "type": "runnable_code",
            "filename": "xts_tweak_demo.js",
            "initialCode": "function evaluateXtsRelocationDefense(isBlockRelocated) {\n  return isBlockRelocated\n    ? 'TWEAK_MISMATCH: RELOCATED_BLOCK_FAILS_DECRYPTION_CRASHES_SAFELY'\n    : 'CORRECT_ADDRESS_DECRYPTION_SUCCESS';\n}\n\nconsole.log(evaluateXtsRelocationDefense(false));\nconsole.log(evaluateXtsRelocationDefense(true));",
            "expectedOutput": "CORRECT_ADDRESS_DECRYPTION_SUCCESS\nTWEAK_MISMATCH: RELOCATED_BLOCK_FAILS_DECRYPTION_CRASHES_SAFELY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "How does AES-XTS prevent an attacker from copying an encrypted 'ADMIN_PERMISSIONS=1' block over an unprivileged user profile?",
          "options": [
            "Because AES-XTS incorporates the physical memory address (Tweak) into the encryption math; copying the ciphertext block to a different address causes the tweak to mismatch, turning the decrypted output into random unparseable garbage",
            "Because flash memory detects fingerprints",
            "By locking the Wi-Fi router"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTSEC_FLASH_ENCRYPTION_AES_XTS_BUS_SCRAMBLING",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTSEC_FLASH_ENCRYPTION_AES_XTS_BUS_SCRAMBLING",
              "errorExplanation": "XTS address tweaking binds ciphertext to its exact physical location.",
              "recoveryPath": {
                "simplerExplanation": "Tweak mismatch produces garbage at new address.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d10-b3-transparent-mmu-cache-decryption",
        "day": 10,
        "blockNumber": 3,
        "title": "Transparent MMU / Cache On-The-Fly Decryption Hardware",
        "conceptBudget": {
          "primaryConcept": "On-The-Fly Hardware Decryption",
          "supportingTerms": [
            "Zero Software CPU Overhead (AES engine sits in hardware bus between SPI Flash Controller and L1 Instruction Cache)",
            "Line-by-Line 32-Byte Decryption during Cache Refill",
            "Zero Latency Penalty on Cache Hits"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d10-b2-aes-xts-tweakable-block-cipher",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "mmu_cache_demo.js",
            "initialCode": "function evaluateCacheDecryption(isCacheHit) {\n  return isCacheHit\n    ? 'CACHE_HIT: ZERO_DECRYPTION_OVERHEAD_1_CYCLE_EXECUTION'\n    : 'CACHE_MISS: TRANSPARENT_HARDWARE_AES_LINE_DECRYPT_IN_BUS';\n}\n\nconsole.log(evaluateCacheDecryption(true));\nconsole.log(evaluateCacheDecryption(false));",
            "expectedOutput": "CACHE_HIT: ZERO_DECRYPTION_OVERHEAD_1_CYCLE_EXECUTION\nCACHE_MISS: TRANSPARENT_HARDWARE_AES_LINE_DECRYPT_IN_BUS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What execution performance is achieved on a CPU Cache Hit with transparent flash encryption?",
          "expectedStringOutput": "CACHE_HIT: ZERO_DECRYPTION_OVERHEAD_1_CYCLE_EXECUTION",
          "acceptableAnswers": [
            "CACHE_HIT: ZERO_DECRYPTION_OVERHEAD_1_CYCLE_EXECUTION",
            "CACHE_HIT"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_FLASH_ENCRYPTION_AES_XTS_BUS_SCRAMBLING",
          "diagnosisMap": {
            "MISS": {
              "misconceptionId": "MC_IOTSEC_FLASH_ENCRYPTION_AES_XTS_BUS_SCRAMBLING",
              "errorExplanation": "Cache hits execute with 0 overhead from cached plaintext lines.",
              "recoveryPath": {
                "simplerExplanation": "Matches CACHE_HIT: ZERO_DECRYPTION_OVERHEAD_1_CYCLE_EXECUTION.",
                "guidedFixPrompt": "Type CACHE_HIT: ZERO_DECRYPTION_OVERHEAD_1_CYCLE_EXECUTION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 11,
    "title": "Secure Firmware Updates (OTA): Dual-Slot A/B Partitioning & Rollback Safety",
    "overviewMetaphor": "Dual-Slot A/B OTA is a Trapeze Artist Catching a Second Swing Before Letting Go of the First: if a device only has one flash partition and the power dies halfway through writing an OTA update (A bricked device with half-written software!); Dual-Slot A/B partitioning keeps the running system safely in Slot A while downloading and cryptographically verifying the new image into Slot B; on reboot, it attempts to boot Slot B; only after a self-test verifies that Wi-Fi and sensors work does it permanently switch the default boot pointer to Slot B.",
    "blocks": [
      {
        "id": "iotsec-d11-b1-dual-slot-ab-partition-layout",
        "day": 11,
        "blockNumber": 1,
        "title": "Dual-Slot A/B Partition Table Architecture",
        "conceptBudget": {
          "primaryConcept": "Dual-Slot A/B Partition Layout",
          "supportingTerms": [
            "Active Slot (`ota_0` / Slot A) vs Inactive Slot (`ota_1` / Slot B)",
            "`ota_data` Partition (Stores active boot index, seq numbers, and update state)",
            "Power-Loss Resilience (Zero bricking risk during sudden power disconnects)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d1-b1-hardware-root-of-trust-boot-rom",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Flash Dual-Slot Partition Map",
              "boxes": [
                {
                  "label": "Partition Table (0x8000)",
                  "value": "Defines: Bootloader (32 KB), ota_data (8 KB), ota_0 (1.8 MB), ota_1 (1.8 MB)",
                  "varType": "Flash Table",
                  "isUpdated": false
                },
                {
                  "label": "Active Slot A (ota_0)",
                  "value": "Status: RUNNING ACTIVE FIRMWARE v1.2 | State: READ-ONLY DURING OTA",
                  "varType": "Slot A",
                  "isUpdated": false
                },
                {
                  "label": "Target Slot B (ota_1)",
                  "value": "Status: DOWNLOADING INCOMING FIRMWARE v1.3 | State: WRITING AND VERIFYING",
                  "varType": "Slot B",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "ab_slot_demo.js",
            "initialCode": "function selectOtaTargetSlot(currentActive) {\n  const target = (currentActive === 'ota_0') ? 'ota_1' : 'ota_0';\n  return {\n    currentRunningSlot: currentActive,\n    downloadTargetSlot: target,\n    status: 'OTA_TARGET_PARTITION_SELECTED_SAFE_ISOLATION'\n  };\n}\n\nconsole.log(JSON.stringify(selectOtaTargetSlot('ota_0')));",
            "expectedOutput": "{\"currentRunningSlot\":\"ota_0\",\"downloadTargetSlot\":\"ota_1\",\"status\":\"OTA_TARGET_PARTITION_SELECTED_SAFE_ISOLATION\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which target partition is selected for downloading an OTA image when current active partition is `ota_0`?",
          "expectedStringOutput": "ota_1",
          "acceptableAnswers": [
            "ota_1",
            "downloadTargetSlot\":\"ota_1\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SECURE_OTA_IMAGE_HEADER_HMAC_PARSING",
          "diagnosisMap": {
            "ota_0": {
              "misconceptionId": "MC_IOTSEC_SECURE_OTA_IMAGE_HEADER_HMAC_PARSING",
              "errorExplanation": "Cannot write to the currently running slot. Target must be ota_1.",
              "recoveryPath": {
                "simplerExplanation": "Target is ota_1.",
                "guidedFixPrompt": "Type ota_1"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d11-b2-ota-header-hmac-checksum-validation",
        "day": 11,
        "blockNumber": 2,
        "title": "OTA Image Header Parsing: Magic Words, Digests & Signatures",
        "conceptBudget": {
          "primaryConcept": "OTA Image Header Parsing",
          "supportingTerms": [
            "Image Magic Word (`0xE7` / `0xABCD1234`)",
            "Header Struct (Image Version, Payload Size, SHA-256 Digest, ECDSA Signature)",
            "Pre-Flash Verification (Validating header signature BEFORE writing to flash sectors)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d11-b1-dual-slot-ab-partition-layout",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "ota_header_demo.js",
            "initialCode": "function parseOtaHeader(magicWord, expectedMagic, payloadBytes, maxSlotBytes = 1887436) {\n  const isMagicValid = (magicWord === expectedMagic);\n  const isSizeValid = (payloadBytes <= maxSlotBytes);\n  const isValid = isMagicValid && isSizeValid;\n  return {\n    magicMatched: isMagicValid,\n    fitsInPartition: isSizeValid,\n    headerApproved: isValid,\n    status: isValid ? 'OTA_HEADER_PARSED_PROCEED_TO_WRITE' : 'OTA_HEADER_REJECTED_INVALID'\n  };\n}\n\nconsole.log(JSON.stringify(parseOtaHeader(0xE7, 0xE7, 1048576, 1887436)));",
            "expectedOutput": "{\"magicMatched\":true,\"fitsInPartition\":true,\"headerApproved\":true,\"status\":\"OTA_HEADER_PARSED_PROCEED_TO_WRITE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is emitted when an OTA header has a valid magic word and fits within partition bounds?",
          "expectedStringOutput": "OTA_HEADER_PARSED_PROCEED_TO_WRITE",
          "acceptableAnswers": [
            "OTA_HEADER_PARSED_PROCEED_TO_WRITE",
            "status\":\"OTA_HEADER_PARSED_PROCEED_TO_WRITE\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SECURE_OTA_IMAGE_HEADER_HMAC_PARSING",
          "diagnosisMap": {
            "REJECTED": {
              "misconceptionId": "MC_IOTSEC_SECURE_OTA_IMAGE_HEADER_HMAC_PARSING",
              "errorExplanation": "Valid magic and size approve the header.",
              "recoveryPath": {
                "simplerExplanation": "Matches OTA_HEADER_PARSED_PROCEED_TO_WRITE.",
                "guidedFixPrompt": "Type OTA_HEADER_PARSED_PROCEED_TO_WRITE"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d11-b3-self-test-watchdog-confirmation",
        "day": 11,
        "blockNumber": 3,
        "title": "The Self-Test Confirmation Window & Automatic Rollback",
        "conceptBudget": {
          "primaryConcept": "Self-Test Confirmation Invariant",
          "supportingTerms": [
            "State `ESP_OTA_IMG_PENDING_VERIFY`",
            "Hardware Watchdog Timer (Resetting system if app crashes within 30 seconds)",
            "Calling `mark_app_valid()` upon successful cloud handshake",
            "Automatic fallback to previous slot if watchdog triggers"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d11-b2-ota-header-hmac-checksum-validation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "rollback_guard_demo.js",
            "initialCode": "function evaluateBootSelfTest(networkConnected, sensorsHealthy) {\n  const selfTestPassed = networkConnected && sensorsHealthy;\n  return {\n    selfTestPassed,\n    action: selfTestPassed ? 'CALL_MARK_APP_VALID_CANCEL_ROLLBACK' : 'TRIGGER_WATCHDOG_ROLLBACK_TO_SLOT_A',\n    status: selfTestPassed ? 'NEW_FIRMWARE_PERMANENTLY_COMMITTED' : 'AUTOMATIC_ROLLBACK_ENGAGED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateBootSelfTest(true, true)));\nconsole.log(JSON.stringify(evaluateBootSelfTest(false, true))); // Wi-Fi failed!",
            "expectedOutput": "{\"selfTestPassed\":true,\"action\":\"CALL_MARK_APP_VALID_CANCEL_ROLLBACK\",\"status\":\"NEW_FIRMWARE_PERMANENTLY_COMMITTED\"}\n{\"selfTestPassed\":false,\"action\":\"TRIGGER_WATCHDOG_ROLLBACK_TO_SLOT_A\",\"status\":\"AUTOMATIC_ROLLBACK_ENGAGED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken if the newly booted firmware fails to connect to the network during its self-test window?",
          "expectedStringOutput": "TRIGGER_WATCHDOG_ROLLBACK_TO_SLOT_A",
          "acceptableAnswers": [
            "TRIGGER_WATCHDOG_ROLLBACK_TO_SLOT_A",
            "action\":\"TRIGGER_WATCHDOG_ROLLBACK_TO_SLOT_A\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SECURE_OTA_IMAGE_HEADER_HMAC_PARSING",
          "diagnosisMap": {
            "CANCEL": {
              "misconceptionId": "MC_IOTSEC_SECURE_OTA_IMAGE_HEADER_HMAC_PARSING",
              "errorExplanation": "Failed self-tests trigger watchdog rollback to the working slot.",
              "recoveryPath": {
                "simplerExplanation": "Triggers rollback -> TRIGGER_WATCHDOG_ROLLBACK_TO_SLOT_A.",
                "guidedFixPrompt": "Type TRIGGER_WATCHDOG_ROLLBACK_TO_SLOT_A"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 12,
    "title": "Firmware Delta Patching: BS与之/Courgette Binary Compression",
    "overviewMetaphor": "Delta Patching is Sending an Errata Page Instead of Re-Shipping a 500-Page Textbook: when upgrading firmware v1.0 (1 MB) to v1.1 (1 MB) to fix a single 2-line bug, 99.8% of the binary machine code is completely identical; BSDiff/Courgette binary differential compressors compare the old and new images, generating a tiny 15 KB Delta Patch; the device reads the old image from Flash, applies the delta byte offsets in SRAM, and reconstructs the full new firmware image (Saving 98% in cellular SIM card data bills!).",
    "blocks": [
      {
        "id": "iotsec-d12-b1-binary-diff-compression-bsdiff",
        "day": 12,
        "blockNumber": 1,
        "title": "Binary Differential Compression (BSDiff & Courgette)",
        "conceptBudget": {
          "primaryConcept": "Binary Differential Compression",
          "supportingTerms": [
            "Full Image OTA (1 - 4 MB per device $\\implies$ Prohibitive on Cellular NB-IoT/LTE-M!)",
            "BSDiff (Suffix sorting $O(N \\log N)$ to find matching binary chunks)",
            "Courgette (Disassembles ARM/Thumb instructions, normalizing branch target addresses before diffing)",
            "Delta Patch Size: 1 - 5% of full image size"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d11-b1-dual-slot-ab-partition-layout",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Full Image vs Delta Patch Cellular Bandwidth Cost (10,000 Devices)",
              "boxes": [
                {
                  "label": "1. Full OTA (1.5 MB/device)",
                  "value": "Total Cellular Data: 15 Gigabytes | Cellular Data Cost: $1,500 | Transfer Time: 20 mins",
                  "varType": "Bloated Full OTA",
                  "isUpdated": false
                },
                {
                  "label": "2. Delta Patch (45 KB/device)",
                  "value": "Total Cellular Data: 450 Megabytes (97% REDUCTION!) | Cost: $45 | Transfer Time: 30 secs",
                  "varType": "Optimized Delta",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "delta_bandwidth_demo.js",
            "initialCode": "function evaluateDeltaEconomics(fullMb = 1.5, deltaKb = 45, fleetCount = 10000) {\n  const fullTotalGb = (fullMb * fleetCount) / 1024;\n  const deltaTotalGb = ((deltaKb / 1024) * fleetCount) / 1024;\n  const reductionPct = ((fullTotalGb - deltaTotalGb) / fullTotalGb) * 100;\n  return {\n    fullFleetDataGb: Number(fullTotalGb.toFixed(1)),\n    deltaFleetDataGb: Number(deltaTotalGb.toFixed(2)),\n    dataSavingsPercent: Number(reductionPct.toFixed(1)),\n    status: 'DELTA_OTA_BANDWIDTH_REDUCED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateDeltaEconomics(1.5, 45, 10000)));",
            "expectedOutput": "{\"fullFleetDataGb\":14.6,\"deltaFleetDataGb\":0.43,\"dataSavingsPercent\":97.1,\"status\":\"DELTA_OTA_BANDWIDTH_REDUCED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What cellular data savings percentage is achieved across a fleet by upgrading with a 45 KB delta patch instead of a 1.5 MB full image ($((1500 - 45) / 1500) \\times 100$)?",
          "expectedStringOutput": "97",
          "acceptableAnswers": [
            "97",
            "97%",
            "97.0",
            "97.1",
            "dataSavingsPercent\":97.1"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_FIRMWARE_DELTA_PATCH_INTEGRITY_CHECK",
          "diagnosisMap": {
            "50": {
              "misconceptionId": "MC_IOTSEC_FIRMWARE_DELTA_PATCH_INTEGRITY_CHECK",
              "errorExplanation": "1455 / 1500 = 97% bandwidth reduction.",
              "recoveryPath": {
                "simplerExplanation": "Saves 97% of cellular data.",
                "guidedFixPrompt": "Type 97"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d12-b2-in-place-delta-reconstruction-math",
        "day": 12,
        "blockNumber": 2,
        "title": "In-Place Stream Reconstruction: Base Image + Control Tuple + Diff Stream",
        "conceptBudget": {
          "primaryConcept": "Delta Patch Reconstruction Algorithm",
          "supportingTerms": [
            "BSDiff Tuples: $(x, y, z)$ where $x = \\text{AddBytes}, y = \\text{CopyBytes}, z = \\text{SeekOffset}$",
            "Reading base image from Slot A",
            "Writing reconstructed image to Slot B",
            "Streaming decompression in 4 KB chunks without full RAM buffering"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d12-b1-binary-diff-compression-bsdiff",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "delta_recon_demo.js",
            "initialCode": "function reconstructDeltaStream(baseBytes, diffBytes, extraBytes) {\n  const reconstructedLen = baseBytes.length + extraBytes.length;\n  return {\n    baseLength: baseBytes.length,\n    reconstructedLength: reconstructedLen,\n    status: 'DELTA_RECONSTRUCTION_STREAM_COMPLETE'\n  };\n}\n\nconsole.log(JSON.stringify(reconstructDeltaStream([0x10, 0x20], [0x01], [0x30, 0x40])));",
            "expectedOutput": "{\"baseLength\":2,\"reconstructedLength\":4,\"status\":\"DELTA_RECONSTRUCTION_STREAM_COMPLETE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms complete stream reconstruction of a firmware delta patch?",
          "expectedStringOutput": "DELTA_RECONSTRUCTION_STREAM_COMPLETE",
          "acceptableAnswers": [
            "DELTA_RECONSTRUCTION_STREAM_COMPLETE",
            "status\":\"DELTA_RECONSTRUCTION_STREAM_COMPLETE\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_FIRMWARE_DELTA_PATCH_INTEGRITY_CHECK",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTSEC_FIRMWARE_DELTA_PATCH_INTEGRITY_CHECK",
              "errorExplanation": "Matches DELTA_RECONSTRUCTION_STREAM_COMPLETE.",
              "recoveryPath": {
                "simplerExplanation": "Matches DELTA_RECONSTRUCTION_STREAM_COMPLETE.",
                "guidedFixPrompt": "Type DELTA_RECONSTRUCTION_STREAM_COMPLETE"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d12-b3-post-reconstruction-hash-verification",
        "day": 12,
        "blockNumber": 3,
        "title": "Post-Reconstruction SHA-256 Hash & Signature Invariant",
        "conceptBudget": {
          "primaryConcept": "Post-Reconstruction Integrity Invariant",
          "supportingTerms": [
            "Target SHA-256 Hash Verification",
            "Base Firmware Hash Pre-check (If current Slot A does not match expected base hash, delta patch CANNOT apply!)",
            "ECDSA signature check on reconstructed image"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d12-b2-in-place-delta-reconstruction-math",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "delta_hash_demo.js",
            "initialCode": "function verifyDeltaTargetHash(baseHashExpected, baseHashActual, targetHashExpected, targetHashCalculated) {\n  const baseOk = (baseHashExpected === baseHashActual);\n  const targetOk = (targetHashExpected === targetHashCalculated);\n  const approved = baseOk && targetOk;\n  return {\n    baseFirmwareMatched: baseOk,\n    reconstructedTargetMatched: targetOk,\n    permitBoot: approved,\n    status: approved ? 'DELTA_RECONSTRUCTED_IMAGE_VERIFIED_AUTHENTIC' : 'BASE_VERSION_MISMATCH_OR_CORRUPT_PATCH'\n  };\n}\n\nconsole.log(JSON.stringify(verifyDeltaTargetHash('0xBASE', '0xBASE', '0xTARGET', '0xTARGET')));\nconsole.log(JSON.stringify(verifyDeltaTargetHash('0xBASE', '0xWRONG', '0xTARGET', '0xTARGET')));",
            "expectedOutput": "{\"baseFirmwareMatched\":true,\"reconstructedTargetMatched\":true,\"permitBoot\":true,\"status\":\"DELTA_RECONSTRUCTED_IMAGE_VERIFIED_AUTHENTIC\"}\n{\"baseFirmwareMatched\":false,\"reconstructedTargetMatched\":true,\"permitBoot\":false,\"status\":\"BASE_VERSION_MISMATCH_OR_CORRUPT_PATCH\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when current base firmware matches expected hash and reconstructed target matches expected hash?",
          "expectedStringOutput": "DELTA_RECONSTRUCTED_IMAGE_VERIFIED_AUTHENTIC",
          "acceptableAnswers": [
            "DELTA_RECONSTRUCTED_IMAGE_VERIFIED_AUTHENTIC",
            "status\":\"DELTA_RECONSTRUCTED_IMAGE_VERIFIED_AUTHENTIC\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_FIRMWARE_DELTA_PATCH_INTEGRITY_CHECK",
          "diagnosisMap": {
            "MISMATCH": {
              "misconceptionId": "MC_IOTSEC_FIRMWARE_DELTA_PATCH_INTEGRITY_CHECK",
              "errorExplanation": "All checks passing awards DELTA_RECONSTRUCTED_IMAGE_VERIFIED_AUTHENTIC.",
              "recoveryPath": {
                "simplerExplanation": "Matches DELTA_RECONSTRUCTED_IMAGE_VERIFIED_AUTHENTIC.",
                "guidedFixPrompt": "Type DELTA_RECONSTRUCTED_IMAGE_VERIFIED_AUTHENTIC"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 13,
    "title": "Zero-Touch Provisioning (ZTP): EST, SCEP and Factory Enrollment",
    "overviewMetaphor": "Zero-Touch Provisioning is a New Employee Walking into HQ and Getting a Permanent Security Badge: when an IoT device is unboxed and powered on for the first time by a customer, it has no customer Wi-Fi password and no cloud tokens; using an Initial Device Identifier certificate (IDevID) burned into silicon at the factory (IEEE 802.1AR), the device automatically connects to an Enrollment over Secure Transport (EST) server, proves its hardware authenticity, and receives a permanent locally-significant certificate (LDevID) without any human touching a keyboard.",
    "blocks": [
      {
        "id": "iotsec-d13-b1-ieee-802-1ar-idevid-vs-ldevid",
        "day": 13,
        "blockNumber": 1,
        "title": "IEEE 802.1AR Secure Device Identifiers: IDevID vs LDevID",
        "conceptBudget": {
          "primaryConcept": "IEEE 802.1AR Identifier Standards",
          "supportingTerms": [
            "Initial Device Identifier (IDevID: Burned at factory in Secure Element, immutable birth certificate)",
            "Locally Significant Device Identifier (LDevID: Issued by customer enterprise PKI during deployment)",
            "Zero-Trust Onboarding Chain"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d7-b1-pki-hierarchy-chain-of-trust",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "IDevID vs LDevID Security Role Matrix",
              "boxes": [
                {
                  "label": "1. Factory IDevID",
                  "value": "Issuer: Chip Manufacturer CA | Lifetime: 20+ Years (Permanent) | Purpose: Bootstrap Identity",
                  "varType": "Birth Certificate",
                  "isUpdated": false
                },
                {
                  "label": "2. Operational LDevID",
                  "value": "Issuer: Enterprise Customer CA | Lifetime: 1 Year (Renewable) | Purpose: Production Cloud Access",
                  "varType": "Operational Badge",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "idevid_ldevid_demo.js",
            "initialCode": "function evaluateDeviceIdentity(certType) {\n  if (certType === 'IDevID') return 'IDevID: FACTORY_BURNT_BOOTSTRAP_IDENTITY_IEEE_802_1AR';\n  if (certType === 'LDevID') return 'LDevID: ENTERPRISE_OPERATIONAL_CREDENTIAL_ISSUED';\n  return 'UNKNOWN_IDENTITY_TYPE';\n}\n\nconsole.log(evaluateDeviceIdentity('IDevID'));\nconsole.log(evaluateDeviceIdentity('LDevID'));",
            "expectedOutput": "IDevID: FACTORY_BURNT_BOOTSTRAP_IDENTITY_IEEE_802_1AR\nLDevID: ENTERPRISE_OPERATIONAL_CREDENTIAL_ISSUED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What role is served by the IEEE 802.1AR IDevID certificate?",
          "expectedStringOutput": "IDevID: FACTORY_BURNT_BOOTSTRAP_IDENTITY_IEEE_802_1AR",
          "acceptableAnswers": [
            "IDevID: FACTORY_BURNT_BOOTSTRAP_IDENTITY_IEEE_802_1AR",
            "IDevID"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_ZERO_TOUCH_PROVISIONING_EST_ENROLLMENT",
          "diagnosisMap": {
            "LDEVID": {
              "misconceptionId": "MC_IOTSEC_ZERO_TOUCH_PROVISIONING_EST_ENROLLMENT",
              "errorExplanation": "IDevID is the factory-burnt bootstrap identity.",
              "recoveryPath": {
                "simplerExplanation": "IDevID is factory birth certificate.",
                "guidedFixPrompt": "Type IDevID: FACTORY_BURNT_BOOTSTRAP_IDENTITY_IEEE_802_1AR"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d13-b2-rfc-7030-est-enrollment-flow",
        "day": 13,
        "blockNumber": 2,
        "title": "RFC 7030 Enrollment over Secure Transport (EST) Protocol",
        "conceptBudget": {
          "primaryConcept": "RFC 7030 EST Protocol Flow",
          "supportingTerms": [
            "HTTPS / CoAP-EST Transport",
            "`/.well-known/est/cacerts` (Fetches CA trust anchors)",
            "`/.well-known/est/simpleenroll` (Submits CSR authenticated by IDevID client cert)",
            "Automated Certificate Enrollment"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d13-b1-ieee-802-1ar-idevid-vs-ldevid",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "EST Automated Enrollment Flow",
              "nodes": [
                {
                  "id": "1",
                  "label": "Device initiates TLS handshake presenting factory IDevID client cert",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Device fetches Root CA certificate chain via /.well-known/est/cacerts",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Device generates new keypair in Secure Element and submits CSR via /simpleenroll",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "EST server issues operational LDevID certificate -> Device ready for zero-trust cloud!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "est_flow_demo.js",
            "initialCode": "function evaluateEstFlow() {\n  return 'EST_ENROLLMENT_COMPLETE: CACERTS_RETRIEVED -> CSR_SUBMITTED -> LDEVID_ISSUED';\n}\n\nconsole.log(evaluateEstFlow());",
            "expectedOutput": "EST_ENROLLMENT_COMPLETE: CACERTS_RETRIEVED -> CSR_SUBMITTED -> LDEVID_ISSUED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms completion of the RFC 7030 EST automated enrollment sequence?",
          "expectedStringOutput": "EST_ENROLLMENT_COMPLETE: CACERTS_RETRIEVED -> CSR_SUBMITTED -> LDEVID_ISSUED",
          "acceptableAnswers": [
            "EST_ENROLLMENT_COMPLETE: CACERTS_RETRIEVED -> CSR_SUBMITTED -> LDEVID_ISSUED",
            "EST_ENROLLMENT_COMPLETE"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_ZERO_TOUCH_PROVISIONING_EST_ENROLLMENT",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTSEC_ZERO_TOUCH_PROVISIONING_EST_ENROLLMENT",
              "errorExplanation": "Matches EST_ENROLLMENT_COMPLETE string.",
              "recoveryPath": {
                "simplerExplanation": "Matches EST_ENROLLMENT_COMPLETE.",
                "guidedFixPrompt": "Type EST_ENROLLMENT_COMPLETE: CACERTS_RETRIEVED -> CSR_SUBMITTED -> LDEVID_ISSUED"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d13-b3-scep-vs-est-comparison",
        "day": 13,
        "blockNumber": 3,
        "title": "SCEP vs EST: Modernizing IoT Provisioning",
        "conceptBudget": {
          "primaryConcept": "SCEP vs EST Trade-offs",
          "supportingTerms": [
            "SCEP (Legacy PKCS#7 over HTTP with shared challenge secret, lacks client cert auth)",
            "EST (Native TLS/mTLS, modern ECC support, RFC 7030 standard for IoT)",
            "Automated Certificate Re-Enrollment (`/simplereenroll`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d13-b2-rfc-7030-est-enrollment-flow",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "scep_vs_est_demo.js",
            "initialCode": "function selectEnrollmentProtocol(needsModernEccTls) {\n  return needsModernEccTls\n    ? 'RFC_7030_EST_RECOMMENDED_FOR_IOT'\n    : 'LEGACY_SCEP_PROTOCOL';\n}\n\nconsole.log(selectEnrollmentProtocol(true));",
            "expectedOutput": "RFC_7030_EST_RECOMMENDED_FOR_IOT",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which enrollment protocol is recommended for modern IoT systems requiring native TLS and ECC support?",
          "expectedStringOutput": "RFC_7030_EST_RECOMMENDED_FOR_IOT",
          "acceptableAnswers": [
            "RFC_7030_EST_RECOMMENDED_FOR_IOT",
            "EST",
            "RFC 7030 EST"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_ZERO_TOUCH_PROVISIONING_EST_ENROLLMENT",
          "diagnosisMap": {
            "SCEP": {
              "misconceptionId": "MC_IOTSEC_ZERO_TOUCH_PROVISIONING_EST_ENROLLMENT",
              "errorExplanation": "EST is the modern standard over TLS/ECC for IoT.",
              "recoveryPath": {
                "simplerExplanation": "EST is recommended.",
                "guidedFixPrompt": "Type RFC_7030_EST_RECOMMENDED_FOR_IOT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 14,
    "title": "Certificate Revocation: CRLs vs Online Certificate Status Protocol (OCSP)",
    "overviewMetaphor": "Certificate Revocation is Canceling a Stolen Credit Card: if a rogue technician steals the private key of Smart Meter #402, the company must revoke its certificate immediately; Certificate Revocation Lists (CRLs) download a giant PDF of all cancelled cards worldwide (Consuming 5 MB of bandwidth per check—fatal on cellular IoT!); OCSP Stapling allows the cloud server to present a fresh, digitally-signed timestamp from the CA saying 'This specific card is valid right now', verified in a single lightweight 200-byte response.",
    "blocks": [
      {
        "id": "iotsec-d14-b1-crl-bandwidth-scaling-problem",
        "day": 14,
        "blockNumber": 1,
        "title": "Certificate Revocation Lists (CRLs) & The Bandwidth Scaling Bottleneck",
        "conceptBudget": {
          "primaryConcept": "CRL Bandwidth Bottleneck",
          "supportingTerms": [
            "CRL Structure (Monolithic list of revoked serial numbers signed by CA)",
            "Scaling Defect (As millions of devices are retired/compromised, CRL grows to megabytes)",
            "Cellular Data Cost Explosion"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d7-b1-pki-hierarchy-chain-of-trust",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CRL vs OCSP Bandwidth Comparison",
              "boxes": [
                {
                  "label": "1. Full CRL Download",
                  "value": "Payload: 2.5 Megabytes | Frequency: Daily | Cellular Cost: $50,000/year across fleet | Suitability: UNUSABLE ON IOT",
                  "varType": "Bloated List",
                  "isUpdated": false
                },
                {
                  "label": "2. OCSP Stapling",
                  "value": "Payload: 250 Bytes | Frequency: Per Handshake | Cost: $5/year | Suitability: 100% IOT OPTIMAL",
                  "varType": "Lean Response",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "crl_vs_ocsp_demo.js",
            "initialCode": "function evaluateRevocationBandwidth(crlBytes = 2500000, ocspBytes = 250) {\n  const savingsPct = ((crlBytes - ocspBytes) / crlBytes) * 100;\n  return {\n    crlDownloadBytes: crlBytes,\n    ocspStapleBytes: ocspBytes,\n    bandwidthReductionPercent: Number(savingsPct.toFixed(2)),\n    status: 'OCSP_STAPLING_BANDWIDTH_OPTIMAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateRevocationBandwidth(2500000, 250)));",
            "expectedOutput": "{\"crlDownloadBytes\":2500000,\"ocspStapleBytes\":250,\"bandwidthReductionPercent\":99.99,\"status\":\"OCSP_STAPLING_BANDWIDTH_OPTIMAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What bandwidth reduction percentage is achieved by switching from a 2.5 MB CRL download to a 250-byte OCSP staple response ($((2500000 - 250) / 2500000) \\times 100$)?",
          "expectedStringOutput": "99.99",
          "acceptableAnswers": [
            "99.99",
            "99.99%",
            "bandwidthReductionPercent\":99.99"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_CERT_REVOCATION_CRL_OCSP_STAPLING",
          "diagnosisMap": {
            "90": {
              "misconceptionId": "MC_IOTSEC_CERT_REVOCATION_CRL_OCSP_STAPLING",
              "errorExplanation": "250 bytes vs 2.5 MB is a 99.99% reduction.",
              "recoveryPath": {
                "simplerExplanation": "99.99% bandwidth reduction.",
                "guidedFixPrompt": "Type 99.99"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d14-b2-ocsp-protocol-and-stapling",
        "day": 14,
        "blockNumber": 2,
        "title": "Online Certificate Status Protocol (OCSP) & TLS OCSP Stapling (RFC 6066)",
        "conceptBudget": {
          "primaryConcept": "OCSP Stapling (RFC 6066)",
          "supportingTerms": [
            "OCSP Responder (`status: 'good' | 'revoked' | 'unknown'`)",
            "OCSP Stapling (Server queries OCSP responder and caches signed proof in TLS CertificateStatus message)",
            "Eliminating client-to-CA connection latency and privacy leaks"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d14-b1-crl-bandwidth-scaling-problem",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "OCSP Response Fields",
            "codeSnippet": "interface OcspResponse {\n  certStatus: 'GOOD' | 'REVOKED' | 'UNKNOWN';\n  thisUpdate: number; // Unix timestamp\n  nextUpdate: number; // Unix timestamp for expiration of staple\n  responderSignature: string; // Cryptographic signature from CA\n}",
            "lineNotes": {
              "2": "Revocation status enum.",
              "4": "Cache validity expiration timestamp."
            }
          },
          {
            "type": "runnable_code",
            "filename": "ocsp_staple_demo.js",
            "initialCode": "function evaluateOcspFreshness(nowSec, thisUpdateSec, nextUpdateSec) {\n  const isFresh = (nowSec >= thisUpdateSec) && (nowSec <= nextUpdateSec);\n  return isFresh\n    ? 'OCSP_STAPLE_FRESH_AND_VALID: PROCEED_WITH_TLS'\n    : 'OCSP_STAPLE_EXPIRED_REJECT_CONNECTION';\n}\n\nconsole.log(evaluateOcspFreshness(150, 100, 200));\nconsole.log(evaluateOcspFreshness(250, 100, 200));",
            "expectedOutput": "OCSP_STAPLE_FRESH_AND_VALID: PROCEED_WITH_TLS\nOCSP_STAPLE_EXPIRED_REJECT_CONNECTION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when an OCSP staple response timestamp is within its valid freshness window?",
          "expectedStringOutput": "OCSP_STAPLE_FRESH_AND_VALID: PROCEED_WITH_TLS",
          "acceptableAnswers": [
            "OCSP_STAPLE_FRESH_AND_VALID: PROCEED_WITH_TLS",
            "OCSP_STAPLE_FRESH_AND_VALID"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_CERT_REVOCATION_CRL_OCSP_STAPLING",
          "diagnosisMap": {
            "EXPIRED": {
              "misconceptionId": "MC_IOTSEC_CERT_REVOCATION_CRL_OCSP_STAPLING",
              "errorExplanation": "Timestamp within window confirms freshness.",
              "recoveryPath": {
                "simplerExplanation": "Matches OCSP_STAPLE_FRESH_AND_VALID.",
                "guidedFixPrompt": "Type OCSP_STAPLE_FRESH_AND_VALID: PROCEED_WITH_TLS"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d14-b3-short-lived-certificates-pattern",
        "day": 14,
        "blockNumber": 3,
        "title": "The Short-Lived Certificate Architectural Pattern (Zero-Revocation)",
        "conceptBudget": {
          "primaryConcept": "Short-Lived Certificates Architecture",
          "supportingTerms": [
            "24-Hour Certificate Lifetimes",
            "Automated Daily Renewal via EST / SCEP",
            "Eliminating Revocation Infrastructure (If a key is compromised, certificate naturally dies in < 24 hours!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d14-b2-ocsp-protocol-and-stapling",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "short_lived_demo.js",
            "initialCode": "function evaluateCertPattern(lifetimeHours) {\n  return lifetimeHours <= 48\n    ? 'SHORT_LIVED_CERT_PATTERN: ZERO_REVOCATION_CHECK_OVERHEAD'\n    : 'LONG_LIVED_CERT_PATTERN: OCSP_STAPLING_MANDATORY';\n}\n\nconsole.log(evaluateCertPattern(24));\nconsole.log(evaluateCertPattern(8760));",
            "expectedOutput": "SHORT_LIVED_CERT_PATTERN: ZERO_REVOCATION_CHECK_OVERHEAD\nLONG_LIVED_CERT_PATTERN: OCSP_STAPLING_MANDATORY",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What architectural benefit is confirmed when using 24-hour short-lived client certificates in IoT fleets?",
          "expectedStringOutput": "SHORT_LIVED_CERT_PATTERN: ZERO_REVOCATION_CHECK_OVERHEAD",
          "acceptableAnswers": [
            "SHORT_LIVED_CERT_PATTERN: ZERO_REVOCATION_CHECK_OVERHEAD",
            "SHORT_LIVED_CERT_PATTERN"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_CERT_REVOCATION_CRL_OCSP_STAPLING",
          "diagnosisMap": {
            "LONG": {
              "misconceptionId": "MC_IOTSEC_CERT_REVOCATION_CRL_OCSP_STAPLING",
              "errorExplanation": "24-hour certificates eliminate the need for complex revocation checking.",
              "recoveryPath": {
                "simplerExplanation": "Matches SHORT_LIVED_CERT_PATTERN.",
                "guidedFixPrompt": "Type SHORT_LIVED_CERT_PATTERN: ZERO_REVOCATION_CHECK_OVERHEAD"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Secure Device Lifecycle & Provisioning Engine",
    "overviewMetaphor": "Milestone 2 Synthesis: The complete sovereign IoT Device Lifecycle & Provisioning Engine: 1. Zero-Touch EST enrollment using factory IDevID certificates; 2. Dual-slot A/B OTA partition updates with cryptographic image verification; 3. Monotonic eFuse anti-rollback version enforcement; 4. OCSP revocation verification and emergency quarantine circuits.",
    "blocks": [
      {
        "id": "iotsec-d15-b1-device-lifecycle-engine-synthesis",
        "day": 15,
        "blockNumber": 1,
        "title": "Secure Device Lifecycle Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Device Lifecycle Engine Synthesis",
          "supportingTerms": [
            "Zero-Touch EST Enrollment",
            "Dual-Slot A/B OTA Flipper",
            "Monotonic Anti-Rollback",
            "OCSP Status Verifier"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d14-b2-ocsp-protocol-and-stapling",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Unified Device Lifecycle State Machine",
              "nodes": [
                {
                  "id": "1",
                  "label": "Factory State: Boots with IDevID in Secure Element -> Enrolls via EST",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Operational State: Receives LDevID -> Connects via mTLS TLS 1.3",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Maintenance State: Downloads OTA image to Slot B -> Checks eFuse version",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Verified State: Reboots to Slot B -> Marks app valid -> Normal operation!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "lifecycle_engine_demo.js",
            "initialCode": "function runDeviceLifecycleEngine() {\n  return {\n    enrollmentStatus: 'EST_LDEVID_ISSUED',\n    otaPartitionStatus: 'AB_DUAL_SLOT_VALIDATED',\n    antiRollbackStatus: 'EFUSE_MONOTONIC_LOCKED',\n    engineStatus: 'DEVICE_LIFECYCLE_ENGINE_ACTIVE'\n  };\n}\n\nconsole.log(runDeviceLifecycleEngine().engineStatus);",
            "expectedOutput": "DEVICE_LIFECYCLE_ENGINE_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Device Lifecycle & Provisioning Engine?",
          "expectedStringOutput": "DEVICE_LIFECYCLE_ENGINE_ACTIVE",
          "acceptableAnswers": [
            "DEVICE_LIFECYCLE_ENGINE_ACTIVE",
            "engineStatus: DEVICE_LIFECYCLE_ENGINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_DEVICE_PROVISIONING_X509_CERT_CHAIN",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTSEC_DEVICE_PROVISIONING_X509_CERT_CHAIN",
              "errorExplanation": "Matches DEVICE_LIFECYCLE_ENGINE_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches DEVICE_LIFECYCLE_ENGINE_ACTIVE.",
                "guidedFixPrompt": "Type DEVICE_LIFECYCLE_ENGINE_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d15-b2-lifecycle-security-audit",
        "day": 15,
        "blockNumber": 2,
        "title": "Device Lifecycle Security & Anti-Downgrade Invariant Audit",
        "conceptBudget": {
          "primaryConcept": "Lifecycle Invariant Audit",
          "supportingTerms": [
            "Anti-Downgrade Invariant",
            "Zero-Touch EST Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d15-b1-device-lifecycle-engine-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "lifecycle_audit_demo.js",
            "initialCode": "function auditLifecycleSystem(enrollmentPassed, antiRollbackEnforced) {\n  const passed = enrollmentPassed && antiRollbackEnforced;\n  return {\n    enrollmentValid: enrollmentPassed,\n    antiRollbackEnforced,\n    grade: passed ? 'LIFECYCLE_SYSTEM_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditLifecycleSystem(true, true)));",
            "expectedOutput": "{\"enrollmentValid\":true,\"antiRollbackEnforced\":true,\"grade\":\"LIFECYCLE_SYSTEM_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when device enrollment and anti-rollback enforcement pass 100%?",
          "expectedStringOutput": "LIFECYCLE_SYSTEM_AUDIT_PASSED",
          "acceptableAnswers": [
            "LIFECYCLE_SYSTEM_AUDIT_PASSED",
            "grade\":\"LIFECYCLE_SYSTEM_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_DEVICE_PROVISIONING_X509_CERT_CHAIN",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_IOTSEC_DEVICE_PROVISIONING_X509_CERT_CHAIN",
              "errorExplanation": "All checks passing awards LIFECYCLE_SYSTEM_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards LIFECYCLE_SYSTEM_AUDIT_PASSED.",
                "guidedFixPrompt": "Type LIFECYCLE_SYSTEM_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d15-b3-milestone2-iotsec-cert",
        "day": 15,
        "blockNumber": 3,
        "title": "Milestone 2 Secure Device Lifecycle Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 2 Certification",
          "supportingTerms": [
            "Device Lifecycle Engine Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d15-b2-lifecycle-security-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone2_iotsec_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 2: Complete Secure Device Lifecycle & Provisioning Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 2: Complete Secure Device Lifecycle & Provisioning Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 2 completion?",
          "expectedStringOutput": "⭐ MILESTONE 2: Complete Secure Device Lifecycle & Provisioning Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 2: Complete Secure Device Lifecycle & Provisioning Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_DEVICE_PROVISIONING_X509_CERT_CHAIN",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTSEC_DEVICE_PROVISIONING_X509_CERT_CHAIN",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 2: Complete Secure Device Lifecycle & Provisioning Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 16,
    "title": "TLS 1.3 & DTLS 1.3: Secure Constrained Transport Handshakes",
    "overviewMetaphor": "TLS 1.3 vs TLS 1.2 is a Modern Fast-Pass Border Gate vs a 4-Window Bureaucracy: older TLS 1.2 required 2 full round-trips of back-and-forth negotiations before sending any encrypted data (Wasting 800 ms of cellular battery!); TLS 1.3 executes a 1-Round-Trip-Time (1-RTT) handshake and removes obsolete, broken ciphers (No more RC4, DES, or CBC modes!); DTLS 1.3 adapts this over UDP for constrained protocols like CoAP and Thread with sliding window anti-replay protection.",
    "blocks": [
      {
        "id": "iotsec-d16-b1-tls13-1rtt-handshake-speed",
        "day": 16,
        "blockNumber": 1,
        "title": "The TLS 1.3 1-RTT Handshake & Cryptographic Modernization",
        "conceptBudget": {
          "primaryConcept": "TLS 1.3 1-RTT Handshake",
          "supportingTerms": [
            "1-RTT Handshake (Combining Key Exchange `ClientHello + KeyShare` in first packet)",
            "0-RTT Early Data (Resumption with PSK)",
            "Elimination of Insecure Ciphers (Only AEAD suites permitted: `TLS_AES_256_GCM_SHA384`, `TLS_CHACHA20_POLY1305_SHA256`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d3-b2-aes-gcm-ghash-tag-construction",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "TLS 1.2 vs TLS 1.3 Handshake Round Trips",
              "boxes": [
                {
                  "label": "1. TLS 1.2 Handshake",
                  "value": "Round Trips: 2-RTT (4 Network Packets) | Latency: ~600 ms on Cellular | Ciphers: Complex CBC/RSA",
                  "varType": "Legacy Protocol",
                  "isUpdated": false
                },
                {
                  "label": "2. TLS 1.3 Handshake",
                  "value": "Round Trips: 1-RTT (2 Network Packets!) | Latency: ~150 ms (4X FASTER!) | Ciphers: Pure AEAD GCM/Poly1305",
                  "varType": "Modern TLS 1.3",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "tls13_handshake_demo.js",
            "initialCode": "function evaluateTlsHandshake(tlsVersion) {\n  if (tlsVersion === '1.3') {\n    return { roundTrips: 1, cipherType: 'PURE_AEAD_GCM_POLY1305', status: 'TLS_1_3_OPTIMAL' };\n  }\n  return { roundTrips: 2, cipherType: 'LEGACY_CBC_RSA', status: 'TLS_1_2_OBSOLETE' };\n}\n\nconsole.log(JSON.stringify(evaluateTlsHandshake('1.3')));",
            "expectedOutput": "{\"roundTrips\":1,\"cipherType\":\"PURE_AEAD_GCM_POLY1305\",\"status\":\"TLS_1_3_OPTIMAL\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many network round-trips (RTT) are required by a standard TLS 1.3 handshake before encrypted data transmission?",
          "expectedStringOutput": "1",
          "acceptableAnswers": [
            "1",
            "1-RTT",
            "1 RTT",
            "roundTrips\":1"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_TLS_DTLS_CIPHER_SUITE_NEGOTIATION",
          "diagnosisMap": {
            "2": {
              "misconceptionId": "MC_IOTSEC_TLS_DTLS_CIPHER_SUITE_NEGOTIATION",
              "errorExplanation": "2-RTT is for legacy TLS 1.2. TLS 1.3 completes in 1-RTT.",
              "recoveryPath": {
                "simplerExplanation": "TLS 1.3 is 1-RTT.",
                "guidedFixPrompt": "Type 1"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d16-b2-dtls-udp-sliding-window-anti-replay",
        "day": 16,
        "blockNumber": 2,
        "title": "DTLS 1.3 over UDP & Sliding Window Anti-Replay Protection",
        "conceptBudget": {
          "primaryConcept": "DTLS 1.3 Anti-Replay Sliding Window",
          "supportingTerms": [
            "Connection ID (CID: Survives cellular IP address changes without renegotiating handshake!)",
            "Explicit Epoch & Sequence Numbers (64-bit monotonically increasing)",
            "64-Bit Sliding Window Bitmap (Dropping replayed captured packets)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d16-b1-tls13-1rtt-handshake-speed",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dtls_replay_demo.js",
            "initialCode": "function evaluateDtlsReplay(seqNumber, highestSeenSeq, bitmap = 0b1111) {\n  const isTooOld = (seqNumber < highestSeenSeq - 64);\n  const isAlreadySeen = (seqNumber <= highestSeenSeq) && ((bitmap & (1 << (highestSeenSeq - seqNumber))) !== 0);\n  const isReplay = isTooOld || isAlreadySeen;\n  return {\n    sequenceNumber: seqNumber,\n    highestSeenSeq,\n    isReplayAttack: isReplay,\n    status: isReplay ? 'REPLAY_ATTACK_DETECTED_PACKET_DROPPED' : 'DTLS_PACKET_ACCEPTED_IN_WINDOW'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateDtlsReplay(10, 10, 0b0001))); // Replay of seq 10!\nconsole.log(JSON.stringify(evaluateDtlsReplay(11, 10, 0b0001))); // Fresh packet!",
            "expectedOutput": "{\"sequenceNumber\":10,\"highestSeenSeq\":10,\"isReplayAttack\":true,\"status\":\"REPLAY_ATTACK_DETECTED_PACKET_DROPPED\"}\n{\"sequenceNumber\":11,\"highestSeenSeq\":10,\"isReplayAttack\":false,\"status\":\"DTLS_PACKET_ACCEPTED_IN_WINDOW\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken by DTLS 1.3 when an attacker injects a captured duplicate packet with an already-seen sequence number?",
          "expectedStringOutput": "REPLAY_ATTACK_DETECTED_PACKET_DROPPED",
          "acceptableAnswers": [
            "REPLAY_ATTACK_DETECTED_PACKET_DROPPED",
            "status\":\"REPLAY_ATTACK_DETECTED_PACKET_DROPPED\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_TLS_DTLS_CIPHER_SUITE_NEGOTIATION",
          "diagnosisMap": {
            "ACCEPTED": {
              "misconceptionId": "MC_IOTSEC_TLS_DTLS_CIPHER_SUITE_NEGOTIATION",
              "errorExplanation": "Duplicate sequence numbers trigger replay attack drops.",
              "recoveryPath": {
                "simplerExplanation": "Matches REPLAY_ATTACK_DETECTED_PACKET_DROPPED.",
                "guidedFixPrompt": "Type REPLAY_ATTACK_DETECTED_PACKET_DROPPED"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d16-b3-psk-vs-cert-cipher-suites",
        "day": 16,
        "blockNumber": 3,
        "title": "Pre-Shared Keys (PSK) vs Certificate-Based Cipher Suites",
        "conceptBudget": {
          "primaryConcept": "PSK vs Certificate Suite Selection",
          "supportingTerms": [
            "TLS-PSK (Lightweight: Eliminates X.509 parsing on tiny 16 KB RAM microcontrollers)",
            "Certificate Suites (Scalable for public cloud endpoints)",
            "Forward Secrecy (`DHE-PSK`)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d16-b2-dtls-udp-sliding-window-anti-replay",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "psk_select_demo.js",
            "initialCode": "function selectTlsAuthMode(ramBytes) {\n  return ramBytes < 32768\n    ? 'TLS_PSK_MODE: MINIMAL_RAM_OVERHEAD_NO_X509_PARSING'\n    : 'TLS_X509_CERTIFICATE_MODE: FULL_PKI_CHAIN_VALIDATION';\n}\n\nconsole.log(selectTlsAuthMode(16384));\nconsole.log(selectTlsAuthMode(65536));",
            "expectedOutput": "TLS_PSK_MODE: MINIMAL_RAM_OVERHEAD_NO_X509_PARSING\nTLS_X509_CERTIFICATE_MODE: FULL_PKI_CHAIN_VALIDATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which TLS authentication mode is recommended for extremely memory-constrained microcontrollers with only 16 KB RAM?",
          "expectedStringOutput": "TLS_PSK_MODE: MINIMAL_RAM_OVERHEAD_NO_X509_PARSING",
          "acceptableAnswers": [
            "TLS_PSK_MODE: MINIMAL_RAM_OVERHEAD_NO_X509_PARSING",
            "TLS_PSK_MODE",
            "TLS-PSK",
            "PSK"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_TLS_DTLS_CIPHER_SUITE_NEGOTIATION",
          "diagnosisMap": {
            "CERT": {
              "misconceptionId": "MC_IOTSEC_TLS_DTLS_CIPHER_SUITE_NEGOTIATION",
              "errorExplanation": "X.509 parsing requires large memory buffers. PSK mode is optimal for 16 KB RAM.",
              "recoveryPath": {
                "simplerExplanation": "PSK mode minimizes RAM.",
                "guidedFixPrompt": "Type TLS_PSK_MODE: MINIMAL_RAM_OVERHEAD_NO_X509_PARSING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 17,
    "title": "ARM TrustZone for Cortex-M: Hardware Memory Isolation",
    "overviewMetaphor": "ARM TrustZone is a Bulletproof Glass Window in a Bank: on traditional microcontrollers, all software runs in the same shared memory; a buffer overflow bug in the third-party MQTT library allows an attacker to take over the entire chip and read encryption keys; ARM TrustZone (Cortex-M23/M33/M55) creates two physical hardware worlds: the Secure World (The bank vault with crypto keys and secure boot) and the Non-Secure World (The lobby with RTOS and networking code); the lobby can only interact with the vault through strictly gated Non-Secure Callable (NSC) function windows.",
    "blocks": [
      {
        "id": "iotsec-d17-b1-trustzone-secure-vs-nonsecure-worlds",
        "day": 17,
        "blockNumber": 1,
        "title": "TrustZone Hardware Partitioning: Secure World vs Non-Secure World",
        "conceptBudget": {
          "primaryConcept": "TrustZone Hardware Isolation",
          "supportingTerms": [
            "Secure World (Holds private keys, Secure Boot, Crypto Drivers)",
            "Non-Secure World (Runs FreeRTOS, Wi-Fi stacks, User application)",
            "Zero CPU Core Duplication (Single CPU core toggles security state in 1 clock cycle via hardware MSPLIM/PSPLIM registers)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d8-b1-secure-element-architecture-atecc",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "TrustZone Hardware Memory Map Separation",
              "boxes": [
                {
                  "label": "Secure Flash (0x10000000)",
                  "value": "Contents: Crypto Key Vault, Secure Boot | Access: SECURE CALLERS ONLY",
                  "varType": "Secure Flash",
                  "isUpdated": false
                },
                {
                  "label": "Non-Secure Callable (NSC)",
                  "value": "Address: 0x1001E000 | Gateway: Holds SG (Secure Gateway) instructions",
                  "varType": "NSC Gateway",
                  "isUpdated": true
                },
                {
                  "label": "Non-Secure Flash (0x00000000)",
                  "value": "Contents: FreeRTOS, MQTT, Sensor Code | Access: UNRESTRICTED",
                  "varType": "Non-Secure Flash",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "trustzone_world_demo.js",
            "initialCode": "function evaluateWorldAccess(callerIsNonSecure, targetAddressHex) {\n  const addr = parseInt(targetAddressHex, 16);\n  const isSecure = (addr >= 0x10000000 && addr < 0x20000000);\n  if (callerIsNonSecure && isSecure) {\n    return 'CRITICAL_SECURITY_FAULT: NON_SECURE_CALLER_BLOCKED_BY_SAU';\n  }\n  return 'TRUSTZONE_MEMORY_ACCESS_PERMITTED';\n}\n\nconsole.log(evaluateWorldAccess(false, '0x10002000')); // Secure caller\nconsole.log(evaluateWorldAccess(true, '0x10002000'));  // Non-secure caller!\nconsole.log(evaluateWorldAccess(true, '0x00020000'));  // Non-secure to Non-secure",
            "expectedOutput": "TRUSTZONE_MEMORY_ACCESS_PERMITTED\nCRITICAL_SECURITY_FAULT: NON_SECURE_CALLER_BLOCKED_BY_SAU\nTRUSTZONE_MEMORY_ACCESS_PERMITTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What fault is triggered when a Non-Secure caller attempts direct memory access to Secure World RAM (0x10002000)?",
          "expectedStringOutput": "CRITICAL_SECURITY_FAULT: NON_SECURE_CALLER_BLOCKED_BY_SAU",
          "acceptableAnswers": [
            "CRITICAL_SECURITY_FAULT: NON_SECURE_CALLER_BLOCKED_BY_SAU",
            "CRITICAL_SECURITY_FAULT"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_TRUSTZONE_MEMORY_ISOLATION_FAULT",
          "diagnosisMap": {
            "PERMITTED": {
              "misconceptionId": "MC_IOTSEC_TRUSTZONE_MEMORY_ISOLATION_FAULT",
              "errorExplanation": "Direct non-secure access to secure RAM triggers a SecureFault.",
              "recoveryPath": {
                "simplerExplanation": "Triggers CRITICAL_SECURITY_FAULT.",
                "guidedFixPrompt": "Type CRITICAL_SECURITY_FAULT: NON_SECURE_CALLER_BLOCKED_BY_SAU"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d17-b2-sau-mpc-memory-controllers",
        "day": 17,
        "blockNumber": 2,
        "title": "Security Attribution Unit (SAU) & Memory Protection Controller (MPC)",
        "conceptBudget": {
          "primaryConcept": "SAU and MPC Configuration",
          "supportingTerms": [
            "Security Attribution Unit (SAU: Core peripheral defining internal memory regions)",
            "Memory Protection Controller (MPC: Bus peripheral protecting external SRAM/Flash)",
            "Peripheral Protection Controller (PPC: Isolating hardware crypto peripherals)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d17-b1-trustzone-secure-vs-nonsecure-worlds",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SAU Region Configuration in C",
            "codeSnippet": "SAU->RNR = 0; // Select region 0\nSAU->RBAR = 0x1001E000; // Base address of Non-Secure Callable region\nSAU->RLAR = (0x1001FFFF & SAU_RLAR_LADDR_Msk) | SAU_RLAR_ENABLE_Msk | (1 << SAU_RLAR_NSC_Pos);\nSAU->CTRL = SAU_CTRL_ENABLE_Msk; // Enable SAU firewall!",
            "lineNotes": {
              "2": "Sets NSC base address.",
              "3": "Enables region as Non-Secure Callable.",
              "4": "Activates SAU hardware firewall."
            }
          },
          {
            "type": "runnable_code",
            "filename": "sau_config_demo.js",
            "initialCode": "function evaluateSauStatus(isSauEnabled) {\n  return isSauEnabled\n    ? 'SAU_HARDWARE_FIREWALL_ACTIVE_REGIONS_ENFORCED'\n    : 'SAU_DISABLED_VULNERABLE';\n}\n\nconsole.log(evaluateSauStatus(true));",
            "expectedOutput": "SAU_HARDWARE_FIREWALL_ACTIVE_REGIONS_ENFORCED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms active hardware region enforcement by the Security Attribution Unit (SAU)?",
          "expectedStringOutput": "SAU_HARDWARE_FIREWALL_ACTIVE_REGIONS_ENFORCED",
          "acceptableAnswers": [
            "SAU_HARDWARE_FIREWALL_ACTIVE_REGIONS_ENFORCED",
            "SAU_HARDWARE_FIREWALL_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_TRUSTZONE_MEMORY_ISOLATION_FAULT",
          "diagnosisMap": {
            "DISABLED": {
              "misconceptionId": "MC_IOTSEC_TRUSTZONE_MEMORY_ISOLATION_FAULT",
              "errorExplanation": "Enabling the SAU activates hardware region enforcement.",
              "recoveryPath": {
                "simplerExplanation": "Matches SAU_HARDWARE_FIREWALL_ACTIVE_REGIONS_ENFORCED.",
                "guidedFixPrompt": "Type SAU_HARDWARE_FIREWALL_ACTIVE_REGIONS_ENFORCED"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d17-b3-nsc-sg-gateway-transition",
        "day": 17,
        "blockNumber": 3,
        "title": "Non-Secure Callable (NSC) & Secure Gateway (`SG`) Assembly Instructions",
        "conceptBudget": {
          "primaryConcept": "NSC Gateway & `SG` Instruction",
          "supportingTerms": [
            "`SG` (Secure Gateway instruction: First instruction in NSC veneer)",
            "`BXNS` (Branch with exchange to Non-Secure)",
            "Clearing CPU Caller Registers (`r0..r3`, `r12`, `LR`) before returning to prevent key leakage in registers!"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d17-b2-sau-mpc-memory-controllers",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "nsc_gateway_demo.js",
            "initialCode": "function evaluateNscGateway(hasSgInstruction, registersCleared) {\n  const secure = hasSgInstruction && registersCleared;\n  return {\n    hasSgInstruction,\n    scratchRegistersCleared: registersCleared,\n    gatewaySecure: secure,\n    status: secure ? 'NSC_GATEWAY_TRANSITION_SECURE' : 'REGISTER_LEAKAGE_SECURITY_FAULT'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateNscGateway(true, true)));\nconsole.log(JSON.stringify(evaluateNscGateway(true, false)));",
            "expectedOutput": "{\"hasSgInstruction\":true,\"scratchRegistersCleared\":true,\"gatewaySecure\":true,\"status\":\"NSC_GATEWAY_TRANSITION_SECURE\"}\n{\"hasSgInstruction\":true,\"scratchRegistersCleared\":false,\"gatewaySecure\":false,\"status\":\"REGISTER_LEAKAGE_SECURITY_FAULT\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why must Secure World functions explicitly zero out scratch registers (`r0..r3`, `r12`) before returning to Non-Secure World via `BXNS`?",
          "options": [
            "To prevent intermediate cryptographic secret key fragments from remaining behind in CPU registers where Non-Secure application code could read them",
            "Because CPU registers overheat if not cleared",
            "To make the next function call run faster"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTSEC_TRUSTZONE_MEMORY_ISOLATION_FAULT",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTSEC_TRUSTZONE_MEMORY_ISOLATION_FAULT",
              "errorExplanation": "Clearing scratch registers prevents leaking secrets across the world boundary.",
              "recoveryPath": {
                "simplerExplanation": "Prevents secret key fragments remaining in registers.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 18,
    "title": "Side-Channel Attacks: Differential Power Analysis (DPA) Defenses",
    "overviewMetaphor": "Side-Channel Power Analysis is Listening to a Safe's Tumblers with a Stethoscope: when a microcontroller executes an AES encryption round, transistors switch electrical states (A CMOS transistor switching from 0 to 1 draws a tiny pulse of electrical current from the power supply!); an attacker with an oscilloscope on the power pin can record 10,000 power traces; Differential Power Analysis (DPA) uses statistical correlations over power fluctuations to deduce the private encryption key without ever breaking the math; Constant-Time programming and Random Hardware Masking eliminate these power signatures.",
    "blocks": [
      {
        "id": "iotsec-d18-b1-dpa-oscilloscope-power-traces",
        "day": 18,
        "blockNumber": 1,
        "title": "Differential Power Analysis (DPA) Mechanics & Hamming Distance",
        "conceptBudget": {
          "primaryConcept": "DPA Side-Channel Mechanics",
          "supportingTerms": [
            "CMOS Power Consumption ($P = C V^2 f + I_{\\text{leak}} V$, power proportional to number of bit transitions)",
            "Hamming Distance / Hamming Weight Model ($H(x \\oplus y)$)",
            "Correlation Power Analysis (CPA: Pearson correlation coefficient between predicted bit switches and measured oscilloscope power traces)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d2-b1-aes-block-cipher-internals",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Power Consumption Correlation to Bit Switches",
              "boxes": [
                {
                  "label": "Transition 0x00 -> 0x01 (1 bit switch)",
                  "value": "Current Spike: ~1.2 mA | Hamming Weight: 1 | Trace Signal: Minimal",
                  "varType": "Low Power Pulse",
                  "isUpdated": false
                },
                {
                  "label": "Transition 0x00 -> 0xFF (8 bit switches)",
                  "value": "Current Spike: ~8.5 mA | Hamming Weight: 8 | Trace Signal: HUGE SPIKE!",
                  "varType": "High Power Pulse",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "hamming_power_demo.js",
            "initialCode": "function calculateHammingDistance(byteA, byteB) {\n  let xor = byteA ^ byteB;\n  let count = 0;\n  while (xor > 0) {\n    count += (xor & 1);\n    xor = xor >>> 1;\n  }\n  return {\n    byteA: '0x' + byteA.toString(16),\n    byteB: '0x' + byteB.toString(16),\n    switchedBits: count,\n    relativePowerDrawMa: Number((count * 1.1).toFixed(1))\n  };\n}\n\nconsole.log(JSON.stringify(calculateHammingDistance(0x00, 0xFF))); // 8 bits switch\nconsole.log(JSON.stringify(calculateHammingDistance(0x00, 0x01))); // 1 bit switches",
            "expectedOutput": "{\"byteA\":\"0x0\",\"byteB\":\"0xff\",\"switchedBits\":8,\"relativePowerDrawMa\":8.8}\n{\"byteA\":\"0x0\",\"byteB\":\"0x1\",\"switchedBits\":1,\"relativePowerDrawMa\":1.1}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "How many bit transitions occur when a register switches from `0x00` to `0xFF`?",
          "expectedStringOutput": "8",
          "acceptableAnswers": [
            "8",
            "8 bits",
            "switchedBits\":8"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SIDE_CHANNEL_POWER_ANALYSIS_DPA_SHIELD",
          "diagnosisMap": {
            "255": {
              "misconceptionId": "MC_IOTSEC_SIDE_CHANNEL_POWER_ANALYSIS_DPA_SHIELD",
              "errorExplanation": "0xFF = 255 in decimal, but contains 8 individual 1-bits.",
              "recoveryPath": {
                "simplerExplanation": "8 bits switch state.",
                "guidedFixPrompt": "Type 8"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d18-b2-constant-time-crypto-primitives",
        "day": 18,
        "blockNumber": 2,
        "title": "Constant-Time Cryptographic Primitives: Eliminating Timing Side-Channels",
        "conceptBudget": {
          "primaryConcept": "Constant-Time Implementation Invariant",
          "supportingTerms": [
            "Timing Attacks (Measuring CPU execution duration in nanoseconds)",
            "Early-Exit Flaw (`if (key[i] != guess[i]) return false;` leaks correct byte position!)",
            "Constant-Time Memory Compare (`CRYPTO_memcmp()` accumulates XOR diffs over entire buffer)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d18-b1-dpa-oscilloscope-power-traces",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Vulnerable Early-Exit vs Constant-Time Compare Diff",
              "brokenCode": "// ❌ VULNERABLE TIMING LEAK:\nfor (int i = 0; i < 32; i++) {\n  if (a[i] != b[i]) return 0; // Exits early! Attacker measures time to find matching bytes!\n}\nreturn 1;",
              "fixedCode": "// ✅ SECURE CONSTANT-TIME COMPARE:\nint diff = 0;\nfor (int i = 0; i < 32; i++) {\n  diff |= (a[i] ^ b[i]); // Always processes all 32 bytes with zero timing variance!\n}\nreturn (diff == 0);",
              "errorLine": 3,
              "errorReason": "Early returns in cryptographic comparison loops leak password/key byte matches through execution timing variations.",
              "fixExplanation": "Accumulate bitwise XOR differences across the entire array without early returns."
            }
          },
          {
            "type": "runnable_code",
            "filename": "const_time_demo.js",
            "initialCode": "function constantTimeVerify(a, b) {\n  if (a.length !== b.length) return false;\n  let diff = 0;\n  for (let i = 0; i < a.length; i++) diff |= (a[i] ^ b[i]);\n  return diff === 0;\n}\n\nconsole.log(constantTimeVerify([1, 2, 3], [1, 2, 3]));\nconsole.log(constantTimeVerify([1, 2, 3], [1, 9, 3]));",
            "expectedOutput": "true\nfalse",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "choose_answer",
          "question": "Why is `memcmp()` or `for (i...) if (a[i] != b[i]) return false;` forbidden when verifying cryptographic tokens or signatures?",
          "options": [
            "Because early return loops exit on the first mismatched byte, allowing an attacker to measure nanosecond timing differences to crack the secret one byte at a time",
            "Because constant time loops use less battery power",
            "Because memcmp only works with strings"
          ],
          "correctIndex": 0,
          "primaryMisconceptionId": "MC_IOTSEC_SIDE_CHANNEL_POWER_ANALYSIS_DPA_SHIELD",
          "diagnosisMap": {
            "1": {
              "misconceptionId": "MC_IOTSEC_SIDE_CHANNEL_POWER_ANALYSIS_DPA_SHIELD",
              "errorExplanation": "Early exit creates timing side-channels that leak correct byte positions.",
              "recoveryPath": {
                "simplerExplanation": "Early returns leak timing data to crack keys.",
                "guidedFixPrompt": "Select Option A."
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d18-b3-cryptographic-masking-hardware-jitter",
        "day": 18,
        "blockNumber": 3,
        "title": "Hardware Countermeasures: Cryptographic Masking & Clock Jittering",
        "conceptBudget": {
          "primaryConcept": "Hardware DPA Countermeasures",
          "supportingTerms": [
            "Boolean Masking ($x' = x \\oplus m$, random mask $m$ updated every cycle)",
            "Random Clock Jittering (Inserting dummy clock cycles to desynchronize oscilloscope trace alignment)",
            "Differential Logic Styles (Dual-rail WDDL logic)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d18-b2-constant-time-crypto-primitives",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "masking_demo.js",
            "initialCode": "function evaluateDpaShield(hasMasking, hasClockJitter) {\n  const isShielded = hasMasking && hasClockJitter;\n  return {\n    booleanMaskingActive: hasMasking,\n    clockJitterActive: hasClockJitter,\n    dpaProtected: isShielded,\n    status: isShielded ? 'DPA_SIDE_CHANNEL_SHIELD_ACTIVE' : 'VULNERABLE_TO_POWER_ANALYSIS'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateDpaShield(true, true)));",
            "expectedOutput": "{\"booleanMaskingActive\":true,\"clockJitterActive\":true,\"dpaProtected\":true,\"status\":\"DPA_SIDE_CHANNEL_SHIELD_ACTIVE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms active side-channel protection with hardware masking and random clock jittering?",
          "expectedStringOutput": "DPA_SIDE_CHANNEL_SHIELD_ACTIVE",
          "acceptableAnswers": [
            "DPA_SIDE_CHANNEL_SHIELD_ACTIVE",
            "status\":\"DPA_SIDE_CHANNEL_SHIELD_ACTIVE\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SIDE_CHANNEL_POWER_ANALYSIS_DPA_SHIELD",
          "diagnosisMap": {
            "VULNERABLE": {
              "misconceptionId": "MC_IOTSEC_SIDE_CHANNEL_POWER_ANALYSIS_DPA_SHIELD",
              "errorExplanation": "Masking and jittering activate the DPA shield.",
              "recoveryPath": {
                "simplerExplanation": "Matches DPA_SIDE_CHANNEL_SHIELD_ACTIVE.",
                "guidedFixPrompt": "Type DPA_SIDE_CHANNEL_SHIELD_ACTIVE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 19,
    "title": "Fault Injection & Glitching Attacks: Clock, Voltage and Laser Attacks",
    "overviewMetaphor": "Fault Injection is Tripping a Runner at the Exact Instant They Check Their Compass: an attacker connects high-speed pulsing hardware to the microcontroller's power pin; at the exact nanosecond the CPU evaluates `if (password_valid == true)`, the attacker drops the power supply voltage from 3.3V to 1.5V for 10 nanoseconds (A Voltage Brownout Glitch!); the CPU's internal transistors misfire, skipping the branch check entirely and jumping straight into the privileged administration console; hardware glitch sensors and redundant software checks defeat these attacks.",
    "blocks": [
      {
        "id": "iotsec-d19-b1-voltage-clock-glitching-physics",
        "day": 19,
        "blockNumber": 1,
        "title": "Voltage & Clock Glitching Physical Mechanics",
        "conceptBudget": {
          "primaryConcept": "Fault Injection Physical Mechanics",
          "supportingTerms": [
            "Voltage Brownout Glitch (10 ns voltage drop forces transistor setup-time violations)",
            "Clock Glitching (Inserting narrow high-frequency clock pulses to skip instruction decode stages)",
            "Laser Fault Injection (LFI: Pulsing infrared laser through decapped silicon die to flip flip-flop states)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d1-b1-hardware-root-of-trust-boot-rom",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Normal Execution vs Glitched Instruction Skip",
              "boxes": [
                {
                  "label": "1. Normal Execution",
                  "value": "Cycle 1: `CMP R0, #1` | Cycle 2: `BNE 0x08001000` (Branch taken -> ACCESS DENIED)",
                  "varType": "Normal",
                  "isUpdated": false
                },
                {
                  "label": "2. Glitched Execution (10ns Brownout)",
                  "value": "Cycle 1: `CMP R0, #1` | Cycle 2: Glitch corrupts decode -> Instruction executed as `NOP` -> ACCESS GRANTED!",
                  "varType": "Attacked",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "glitch_eval_demo.js",
            "initialCode": "function evaluateGlitchRisk(hasGlitchSensors) {\n  return hasGlitchSensors\n    ? 'HARDWARE_GLITCH_DETECTOR_ACTIVE: BROWNOUT_TRIGGERS_IMMEDIATE_RESET'\n    : 'CRITICAL_VULNERABILITY: INSTRUCTION_SKIPPING_POSSIBLE_VIA_GLITCH';\n}\n\nconsole.log(evaluateGlitchRisk(true));\nconsole.log(evaluateGlitchRisk(false));",
            "expectedOutput": "HARDWARE_GLITCH_DETECTOR_ACTIVE: BROWNOUT_TRIGGERS_IMMEDIATE_RESET\nCRITICAL_VULNERABILITY: INSTRUCTION_SKIPPING_POSSIBLE_VIA_GLITCH",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken by hardware glitch detectors when a voltage brownout spike is sensed?",
          "expectedStringOutput": "HARDWARE_GLITCH_DETECTOR_ACTIVE: BROWNOUT_TRIGGERS_IMMEDIATE_RESET",
          "acceptableAnswers": [
            "HARDWARE_GLITCH_DETECTOR_ACTIVE: BROWNOUT_TRIGGERS_IMMEDIATE_RESET",
            "HARDWARE_GLITCH_DETECTOR_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_GLITCH_FAULT_INJECTION_CLOCK_BROWNOUT",
          "diagnosisMap": {
            "SKIPPING": {
              "misconceptionId": "MC_IOTSEC_GLITCH_FAULT_INJECTION_CLOCK_BROWNOUT",
              "errorExplanation": "Glitch detectors trigger an immediate reset to prevent instruction skipping.",
              "recoveryPath": {
                "simplerExplanation": "Triggers immediate reset on glitch detection.",
                "guidedFixPrompt": "Type HARDWARE_GLITCH_DETECTOR_ACTIVE: BROWNOUT_TRIGGERS_IMMEDIATE_RESET"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d19-b2-redundant-software-invariants",
        "day": 19,
        "blockNumber": 2,
        "title": "Software Defenses: Redundant Invariants & Dual Boolean Variables",
        "conceptBudget": {
          "primaryConcept": "Redundant Invariant Validation",
          "supportingTerms": [
            "Dual Boolean Flags (`AUTH_OK_1` and `AUTH_OK_2`)",
            "Multi-Bit Non-Boolean Status Enums (Using `0x5A5A` for YES and `0xA5A5` for NO instead of 1 and 0; flipping 1 bit cannot turn NO into YES!)",
            "Redundant Branch Checks with random delays"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d19-b1-voltage-clock-glitching-physics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "broken_fixed_diff",
              "title": "Single Bool Check vs Multi-Bit Redundant Check Diff",
              "brokenCode": "// ❌ SINGLE BOOL CHECK (Easily skipped with 1 glitch!):\nif (auth_success == true) {\n  unlock_door();\n}",
              "fixedCode": "// ✅ MULTI-BIT REDUNDANT DOUBLE CHECK:\nif (auth_state_1 == 0x5A5A5A5A) {\n  if (auth_state_2 == 0x5A5A5A5A) {\n    unlock_door(); // Requires glitching TWO separate instructions perfectly!\n  } else { trigger_tamper_lockout(); }\n} else { trigger_tamper_lockout(); }",
              "errorLine": 2,
              "errorReason": "Single boolean checks are trivial to bypass with a single clock/voltage glitch.",
              "fixExplanation": "Use multi-bit magic values (0x5A5A5A5A) and nested double checks."
            }
          },
          {
            "type": "runnable_code",
            "filename": "redundant_check_demo.js",
            "initialCode": "function evaluateRedundantAuth(flag1, flag2) {\n  const MAGIC_AUTH_OK = 0x5A5A5A5A;\n  const isPass1 = (flag1 === MAGIC_AUTH_OK);\n  const isPass2 = (flag2 === MAGIC_AUTH_OK);\n  return (isPass1 && isPass2)\n    ? 'AUTHENTICATION_APPROVED_DOUBLE_CHECK_PASSED'\n    : 'SECURITY_TAMPER_LOCKOUT_ENGAGED';\n}\n\nconsole.log(evaluateRedundantAuth(0x5A5A5A5A, 0x5A5A5A5A)); // Authentic\nconsole.log(evaluateRedundantAuth(0x5A5A5A5A, 0x00000000)); // 1 check failed/glitched!",
            "expectedOutput": "AUTHENTICATION_APPROVED_DOUBLE_CHECK_PASSED\nSECURITY_TAMPER_LOCKOUT_ENGAGED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is triggered when one of the two redundant authentication checks fails or is corrupted?",
          "expectedStringOutput": "SECURITY_TAMPER_LOCKOUT_ENGAGED",
          "acceptableAnswers": [
            "SECURITY_TAMPER_LOCKOUT_ENGAGED",
            "status: SECURITY_TAMPER_LOCKOUT_ENGAGED"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_GLITCH_FAULT_INJECTION_CLOCK_BROWNOUT",
          "diagnosisMap": {
            "APPROVED": {
              "misconceptionId": "MC_IOTSEC_GLITCH_FAULT_INJECTION_CLOCK_BROWNOUT",
              "errorExplanation": "Both checks must match 0x5A5A5A5A; a single mismatch triggers security lockout.",
              "recoveryPath": {
                "simplerExplanation": "Mismatches trigger SECURITY_TAMPER_LOCKOUT_ENGAGED.",
                "guidedFixPrompt": "Type SECURITY_TAMPER_LOCKOUT_ENGAGED"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d19-b3-hardware-sensor-mesh-shields",
        "day": 19,
        "blockNumber": 3,
        "title": "Silicon Mesh Active Shields & Brownout Detectors (BOD)",
        "conceptBudget": {
          "primaryConcept": "Hardware Silicon Shielding",
          "supportingTerms": [
            "Brownout Reset (BOD: Hardware comparator triggering immediate reset if $V_{\\text{dd}} < 2.7\\text{ V}$)",
            "Active Top-Metal Mesh (Continuous signal trace covering silicon die; broken by focused ion beams or laser drilling)",
            "Light Detection Photodiodes on Silicon"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d19-b2-redundant-software-invariants",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "bod_shield_demo.js",
            "initialCode": "function evaluateBodSafety(voltageVolts, bodThreshold = 2.7) {\n  const isUnderVoltage = voltageVolts < bodThreshold;\n  return {\n    measuredVoltage: voltageVolts,\n    bodThreshold,\n    systemResetTriggered: isUnderVoltage,\n    status: isUnderVoltage ? 'BROWNOUT_RESET_TRIGGERED_GLITCH_DEFENSE' : 'VOLTAGE_WITHIN_OPERATING_RANGE'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateBodSafety(3.3)));\nconsole.log(JSON.stringify(evaluateBodSafety(2.1))); // 2.1V glitch spike!",
            "expectedOutput": "{\"measuredVoltage\":3.3,\"bodThreshold\":2.7,\"systemResetTriggered\":false,\"status\":\"VOLTAGE_WITHIN_OPERATING_RANGE\"}\n{\"measuredVoltage\":2.1,\"bodThreshold\":2.7,\"systemResetTriggered\":true,\"status\":\"BROWNOUT_RESET_TRIGGERED_GLITCH_DEFENSE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when measured supply voltage drops to 2.1V below the 2.7V Brownout Reset threshold?",
          "expectedStringOutput": "BROWNOUT_RESET_TRIGGERED_GLITCH_DEFENSE",
          "acceptableAnswers": [
            "BROWNOUT_RESET_TRIGGERED_GLITCH_DEFENSE",
            "status\":\"BROWNOUT_RESET_TRIGGERED_GLITCH_DEFENSE\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_GLITCH_FAULT_INJECTION_CLOCK_BROWNOUT",
          "diagnosisMap": {
            "WITHIN": {
              "misconceptionId": "MC_IOTSEC_GLITCH_FAULT_INJECTION_CLOCK_BROWNOUT",
              "errorExplanation": "2.1V < 2.7V triggers Brownout Reset protection.",
              "recoveryPath": {
                "simplerExplanation": "Triggers BROWNOUT_RESET_TRIGGERED_GLITCH_DEFENSE.",
                "guidedFixPrompt": "Type BROWNOUT_RESET_TRIGGERED_GLITCH_DEFENSE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 20,
    "title": "Physically Unclonable Functions (PUF): Silicon Biometrics",
    "overviewMetaphor": "A PUF is a Human Fingerprint Built from Microscopic Silicon Atoms: when millions of SRAM memory cells are manufactured on a silicon wafer, tiny sub-nanometer differences make each transistor turn on with a random 0 or 1 at power-up; this uncloneable startup fingerprint is unique to that individual chip; using a Fuzzy Extractor Helper Data algorithm, the device reconstructs its private key in RAM only when needed, and deletes it immediately after—storing ZERO keys in Flash memory for an attacker to steal!",
    "blocks": [
      {
        "id": "iotsec-d20-b1-sram-startup-state-puf",
        "day": 20,
        "blockNumber": 1,
        "title": "SRAM Power-Up State Physics & Silicon Biometrics",
        "conceptBudget": {
          "primaryConcept": "SRAM PUF Startup Physics",
          "supportingTerms": [
            "SRAM Cell Cross-Coupled Inverters",
            "Threshold Voltage Mismatch (Sub-nanometer doping fluctuations bias each cell towards 0 or 1 at power-up)",
            "Static Entropy (Unique physical fingerprint per chip)",
            "Keyless Storage (Zero keys stored in non-volatile flash ROM!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d8-b1-secure-element-architecture-atecc",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Standard Key Storage vs SRAM PUF Key Generation",
              "boxes": [
                {
                  "label": "1. Traditional Flash Storage",
                  "value": "Key Location: Burned into Flash ROM | Attacker Action: Decapsulates chip, reads flash cells with microscope | Vulnerable!",
                  "varType": "Stored Key",
                  "isUpdated": false
                },
                {
                  "label": "2. SRAM PUF Silicon Key",
                  "value": "Key Location: NOWHERE in Flash! | Generation: Reconstructed in SRAM at runtime from silicon physics -> Zeroed on sleep!",
                  "varType": "Ephemeral PUF Key",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "puf_physics_demo.js",
            "initialCode": "function evaluatePufStorageSafety(keyStoredInFlash) {\n  return keyStoredInFlash\n    ? 'FLASH_KEY_STORAGE_PHYSICALLY_EXTRACTABLE'\n    : 'PUF_KEYLESS_SECURITY_KEY_EXISTS_ONLY_IN_SRAM_RUNTIME';\n}\n\nconsole.log(evaluatePufStorageSafety(false));",
            "expectedOutput": "PUF_KEYLESS_SECURITY_KEY_EXISTS_ONLY_IN_SRAM_RUNTIME",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What security status confirms that a device uses keyless PUF technology with zero keys stored in Flash memory?",
          "expectedStringOutput": "PUF_KEYLESS_SECURITY_KEY_EXISTS_ONLY_IN_SRAM_RUNTIME",
          "acceptableAnswers": [
            "PUF_KEYLESS_SECURITY_KEY_EXISTS_ONLY_IN_SRAM_RUNTIME",
            "PUF_KEYLESS_SECURITY"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_PHYSICALLY_UNCLONABLE_FUNCTIONS_PUF_SRAM",
          "diagnosisMap": {
            "FLASH": {
              "misconceptionId": "MC_IOTSEC_PHYSICALLY_UNCLONABLE_FUNCTIONS_PUF_SRAM",
              "errorExplanation": "PUFs avoid storing keys in Flash entirely.",
              "recoveryPath": {
                "simplerExplanation": "Matches PUF_KEYLESS_SECURITY_KEY_EXISTS_ONLY_IN_SRAM_RUNTIME.",
                "guidedFixPrompt": "Type PUF_KEYLESS_SECURITY_KEY_EXISTS_ONLY_IN_SRAM_RUNTIME"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d20-b2-fuzzy-extractors-helper-data",
        "day": 20,
        "blockNumber": 2,
        "title": "Fuzzy Extractors & Error-Correcting Helper Data (BCH Codes)",
        "conceptBudget": {
          "primaryConcept": "Fuzzy Extractor Helper Data Math",
          "supportingTerms": [
            "Intra-Device Noise (1 - 5% of SRAM bits flip due to temperature changes: $S' = S \\oplus E$)",
            "Helper Data ($W = S \\oplus \\text{ECC}(\\text{Key})$ stored in public flash; reveals zero bits of Key!)",
            "BCH / Reed-Solomon Error Correction Decoding",
            "Exact Key Reconstruction Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d20-b1-sram-startup-state-puf",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Fuzzy Extractor Equations",
            "codeSnippet": "// Enrollment at Factory: HelperData = S_raw ^ ECC(Key_secret)\n// Key Reconstruction on Device: Key = ErrorCorrect(S_noisy ^ HelperData)\nconst reconstructedKey = bchDecode(noisySramBits ^ helperData);",
            "lineNotes": {
              "1": "Factory enrollment formula.",
              "2": "Runtime reconstruction with error correction."
            }
          },
          {
            "type": "runnable_code",
            "filename": "fuzzy_extractor_demo.js",
            "initialCode": "function evaluateFuzzyReconstruction(bitFlipCount, maxErrorTolerance = 4) {\n  const recoverable = bitFlipCount <= maxErrorTolerance;\n  return {\n    sramBitsFlipped: bitFlipCount,\n    maxErrorTolerance,\n    reconstructionSuccess: recoverable,\n    status: recoverable ? 'PUF_KEY_RECONSTRUCTED_ERROR_CORRECTED' : 'EXCESSIVE_NOISE_RECONSTRUCTION_FAILED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateFuzzyReconstruction(3, 4)));\nconsole.log(JSON.stringify(evaluateFuzzyReconstruction(8, 4)));",
            "expectedOutput": "{\"sramBitsFlipped\":3,\"maxErrorTolerance\":4,\"reconstructionSuccess\":true,\"status\":\"PUF_KEY_RECONSTRUCTED_ERROR_CORRECTED\"}\n{\"sramBitsFlipped\":8,\"maxErrorTolerance\":4,\"reconstructionSuccess\":false,\"status\":\"EXCESSIVE_NOISE_RECONSTRUCTION_FAILED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is awarded when 3 flipped noisy SRAM bits are corrected by the Fuzzy Extractor within its 4-bit error tolerance?",
          "expectedStringOutput": "PUF_KEY_RECONSTRUCTED_ERROR_CORRECTED",
          "acceptableAnswers": [
            "PUF_KEY_RECONSTRUCTED_ERROR_CORRECTED",
            "status\":\"PUF_KEY_RECONSTRUCTED_ERROR_CORRECTED\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_PHYSICALLY_UNCLONABLE_FUNCTIONS_PUF_SRAM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTSEC_PHYSICALLY_UNCLONABLE_FUNCTIONS_PUF_SRAM",
              "errorExplanation": "3 <= 4 bit flips are successfully corrected.",
              "recoveryPath": {
                "simplerExplanation": "Matches PUF_KEY_RECONSTRUCTED_ERROR_CORRECTED.",
                "guidedFixPrompt": "Type PUF_KEY_RECONSTRUCTED_ERROR_CORRECTED"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d20-b3-zero-lifetime-key-zeroization",
        "day": 20,
        "blockNumber": 3,
        "title": "Key Zeroization & Ephemeral SRAM Erasure",
        "conceptBudget": {
          "primaryConcept": "Key Zeroization Invariant",
          "supportingTerms": [
            "Ephemeral Key Lifetime (Key exists in RAM only for 2 ms during TLS handshake)",
            "Volatile Zeroization (`memset_s(key_buf, 0, len)` ensuring compiler does not optimize away the erase!)",
            "Cold Boot Remanence Attack Protection"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d20-b2-fuzzy-extractors-helper-data",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "zeroization_demo.js",
            "initialCode": "function evaluateZeroization() {\n  return 'KEY_ZEROIZATION_CONFIRMED: MEMSET_S_EXECUTED_RAM_SCRUBBED';\n}\n\nconsole.log(evaluateZeroization());",
            "expectedOutput": "KEY_ZEROIZATION_CONFIRMED: MEMSET_S_EXECUTED_RAM_SCRUBBED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that ephemeral cryptographic keys were wiped from SRAM memory immediately after use?",
          "expectedStringOutput": "KEY_ZEROIZATION_CONFIRMED: MEMSET_S_EXECUTED_RAM_SCRUBBED",
          "acceptableAnswers": [
            "KEY_ZEROIZATION_CONFIRMED: MEMSET_S_EXECUTED_RAM_SCRUBBED",
            "KEY_ZEROIZATION_CONFIRMED"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_PHYSICALLY_UNCLONABLE_FUNCTIONS_PUF_SRAM",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTSEC_PHYSICALLY_UNCLONABLE_FUNCTIONS_PUF_SRAM",
              "errorExplanation": "Matches KEY_ZEROIZATION_CONFIRMED: MEMSET_S_EXECUTED_RAM_SCRUBBED.",
              "recoveryPath": {
                "simplerExplanation": "Matches KEY_ZEROIZATION_CONFIRMED.",
                "guidedFixPrompt": "Type KEY_ZEROIZATION_CONFIRMED: MEMSET_S_EXECUTED_RAM_SCRUBBED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Hardware Attack Defense & Cryptographic Vault Engine",
    "overviewMetaphor": "Milestone 3 Synthesis: The complete sovereign silicon-hardened cryptographic vault engine: 1. ARM TrustZone SAU hardware memory boundary isolation; 2. Constant-time DPA-resistant cryptographic comparisons; 3. Redundant multi-bit fault injection glitch defenses; 4. SRAM PUF ephemeral key reconstruction and immediate zeroization.",
    "blocks": [
      {
        "id": "iotsec-d21-b1-hardware-defense-vault-synthesis",
        "day": 21,
        "blockNumber": 1,
        "title": "Hardware Attack Defense & Cryptographic Vault Engine Synthesis",
        "conceptBudget": {
          "primaryConcept": "Hardware Defense Vault Synthesis",
          "supportingTerms": [
            "ARM TrustZone SAU Isolation",
            "Constant-Time DPA Shield",
            "Brownout Glitch Reset",
            "SRAM PUF Biometrics"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d20-b2-fuzzy-extractors-helper-data",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Unified Silicon Hardware Defense Pipeline",
              "nodes": [
                {
                  "id": "1",
                  "label": "TrustZone SAU isolates Secure World memory from non-secure exploits",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "SRAM PUF reconstructs ephemeral root key using Fuzzy Extractor helper data",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Constant-time DPA logic executes AES/ECDSA with random hardware masking",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Hardware Brownout sensor trips immediate reset if voltage glitch detected!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "vault_engine_demo.js",
            "initialCode": "function runHardwareVaultEngine() {\n  return {\n    trustZoneStatus: 'SAU_MEMORY_ISOLATED',\n    dpaShieldStatus: 'CONSTANT_TIME_MASKED',\n    glitchSensorStatus: 'BROWNOUT_ARMED',\n    pufStatus: 'KEYLESS_SRAM_RECONSTRUCTED',\n    engineStatus: 'HARDWARE_DEFENSE_VAULT_ACTIVE'\n  };\n}\n\nconsole.log(runHardwareVaultEngine().engineStatus);",
            "expectedOutput": "HARDWARE_DEFENSE_VAULT_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Hardware Attack Defense & Cryptographic Vault Engine?",
          "expectedStringOutput": "HARDWARE_DEFENSE_VAULT_ACTIVE",
          "acceptableAnswers": [
            "HARDWARE_DEFENSE_VAULT_ACTIVE",
            "engineStatus: HARDWARE_DEFENSE_VAULT_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SECURE_ELEMENT_TPM_CRYPTO_OFFLOAD",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTSEC_SECURE_ELEMENT_TPM_CRYPTO_OFFLOAD",
              "errorExplanation": "Matches HARDWARE_DEFENSE_VAULT_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches HARDWARE_DEFENSE_VAULT_ACTIVE.",
                "guidedFixPrompt": "Type HARDWARE_DEFENSE_VAULT_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d21-b2-hardware-tamper-vault-audit",
        "day": 21,
        "blockNumber": 2,
        "title": "Silicon Vault Hardening & Glitch Resistance Invariant Audit",
        "conceptBudget": {
          "primaryConcept": "Silicon Vault Invariant Audit",
          "supportingTerms": [
            "4/4 Hardware Shields Invariant",
            "Zero Key In Flash Invariant",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d21-b1-hardware-defense-vault-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "vault_audit_demo.js",
            "initialCode": "function auditHardwareVaultSystem(shieldsActiveCount) {\n  const passed = (shieldsActiveCount === 4);\n  return {\n    shieldsActive: `${shieldsActiveCount}/4`,\n    grade: passed ? 'HARDWARE_VAULT_SYSTEM_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditHardwareVaultSystem(4)));",
            "expectedOutput": "{\"shieldsActive\":\"4/4\",\"grade\":\"HARDWARE_VAULT_SYSTEM_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when all 4 hardware security shields are verified active?",
          "expectedStringOutput": "HARDWARE_VAULT_SYSTEM_AUDIT_PASSED",
          "acceptableAnswers": [
            "HARDWARE_VAULT_SYSTEM_AUDIT_PASSED",
            "grade\":\"HARDWARE_VAULT_SYSTEM_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SECURE_ELEMENT_TPM_CRYPTO_OFFLOAD",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_IOTSEC_SECURE_ELEMENT_TPM_CRYPTO_OFFLOAD",
              "errorExplanation": "4/4 shields award HARDWARE_VAULT_SYSTEM_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards HARDWARE_VAULT_SYSTEM_AUDIT_PASSED.",
                "guidedFixPrompt": "Type HARDWARE_VAULT_SYSTEM_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d21-b3-milestone3-iotsec-cert",
        "day": 21,
        "blockNumber": 3,
        "title": "Milestone 3 Hardware Attack Defense Engine Certification",
        "conceptBudget": {
          "primaryConcept": "Milestone 3 Certification",
          "supportingTerms": [
            "Hardware Vault Verified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d21-b2-hardware-tamper-vault-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "milestone3_iotsec_cert.js",
            "initialCode": "console.log('⭐ MILESTONE 3: Complete Hardware Attack Defense & Cryptographic Vault Engine [VERIFIED 100%]');",
            "expectedOutput": "⭐ MILESTONE 3: Complete Hardware Attack Defense & Cryptographic Vault Engine [VERIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms Milestone 3 completion?",
          "expectedStringOutput": "⭐ MILESTONE 3: Complete Hardware Attack Defense & Cryptographic Vault Engine [VERIFIED 100%]",
          "acceptableAnswers": [
            "⭐ MILESTONE 3: Complete Hardware Attack Defense & Cryptographic Vault Engine [VERIFIED 100%]",
            "VERIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SECURE_ELEMENT_TPM_CRYPTO_OFFLOAD",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTSEC_SECURE_ELEMENT_TPM_CRYPTO_OFFLOAD",
              "errorExplanation": "Matches milestone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type ⭐ MILESTONE 3: Complete Hardware Attack Defense & Cryptographic Vault Engine [VERIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 22,
    "title": "Vulnerability Management & CVSS 3.1 Triage in Connected Fleets",
    "overviewMetaphor": "CVSS Triage is an Emergency Room Triage Doctor Categorizing Patients: when a security researcher reports a vulnerability in an IoT device fleet, you cannot panic and recall 100,000 smart water valves for every minor flaw; the Common Vulnerability Scoring System (CVSS v3.1) evaluates Attack Vector (Can this be exploited remotely over the Internet, or does the hacker need a physical screwdriver?), Complexity, and Impact; a CVSS 9.8 Critical flaw triggers an immediate emergency OTA patch; a CVSS 3.1 Low flaw is scheduled for the next routine quarterly release.",
    "blocks": [
      {
        "id": "iotsec-d22-b1-cvss-31-vector-metrics",
        "day": 22,
        "blockNumber": 1,
        "title": "CVSS v3.1 Base Metric Equations: Exploitability vs Impact",
        "conceptBudget": {
          "primaryConcept": "CVSS v3.1 Base Metric Math",
          "supportingTerms": [
            "Attack Vector (AV: Network [0.85] vs Adjacent [0.62] vs Local [0.55] vs Physical [0.20])",
            "Attack Complexity (AC: Low [0.77] vs High [0.44])",
            "Privileges Required (PR) & User Interaction (UI)",
            "Impact Sub-score: Confidentiality, Integrity, Availability ($C, I, A$)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d1-b1-hardware-root-of-trust-boot-rom",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CVSS 3.1 Severity Rating Brackets",
              "boxes": [
                {
                  "label": "1. Critical (9.0 - 10.0)",
                  "value": "Action: EMERGENCY OTA HOTFIX WITHIN 24 HOURS! (Unauthenticated Remote RCE)",
                  "varType": "Critical Severity",
                  "isUpdated": true
                },
                {
                  "label": "2. High (7.0 - 8.9)",
                  "value": "Action: Priority OTA deployment within 7 days",
                  "varType": "High Severity",
                  "isUpdated": false
                },
                {
                  "label": "3. Medium (4.0 - 6.9)",
                  "value": "Action: Next scheduled firmware sprint release",
                  "varType": "Medium Severity",
                  "isUpdated": false
                },
                {
                  "label": "4. Low (0.1 - 3.9)",
                  "value": "Action: Documented in backlog; patch when convenient",
                  "varType": "Low Severity",
                  "isUpdated": false
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "cvss_calc_demo.js",
            "initialCode": "function evaluateCvss(score) {\n  let tier = 'NONE';\n  if (score >= 9.0) tier = 'CRITICAL: EMERGENCY_HOTFIX_REQUIRED';\n  else if (score >= 7.0) tier = 'HIGH: PATCH_WITHIN_7_DAYS';\n  else if (score >= 4.0) tier = 'MEDIUM: SCHEDULED_RELEASE';\n  else if (score > 0.0) tier = 'LOW: BACKLOG_TRACKED';\n  return {\n    cvssScore: score,\n    severityTier: tier\n  };\n}\n\nconsole.log(JSON.stringify(evaluateCvss(9.8)));\nconsole.log(JSON.stringify(evaluateCvss(5.3)));",
            "expectedOutput": "{\"cvssScore\":9.8,\"severityTier\":\"CRITICAL: EMERGENCY_HOTFIX_REQUIRED\"}\n{\"cvssScore\":5.3,\"severityTier\":\"MEDIUM: SCHEDULED_RELEASE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What severity tier is assigned to a CVSS 9.8 vulnerability?",
          "expectedStringOutput": "CRITICAL: EMERGENCY_HOTFIX_REQUIRED",
          "acceptableAnswers": [
            "CRITICAL: EMERGENCY_HOTFIX_REQUIRED",
            "CRITICAL",
            "severityTier\":\"CRITICAL: EMERGENCY_HOTFIX_REQUIRED\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SEVERITY_CVSS_CVE_VULNERABILITY_TRIAGE",
          "diagnosisMap": {
            "HIGH": {
              "misconceptionId": "MC_IOTSEC_SEVERITY_CVSS_CVE_VULNERABILITY_TRIAGE",
              "errorExplanation": "Scores >= 9.0 are CRITICAL.",
              "recoveryPath": {
                "simplerExplanation": "Scores >= 9.0 are CRITICAL.",
                "guidedFixPrompt": "Type CRITICAL: EMERGENCY_HOTFIX_REQUIRED"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d22-b2-attack-vector-physical-vs-network",
        "day": 22,
        "blockNumber": 2,
        "title": "Attack Vector (AV) Weighting: Physical ($0.20$) vs Network ($0.85$)",
        "conceptBudget": {
          "primaryConcept": "Attack Vector (AV) Scoring Impact",
          "supportingTerms": [
            "Network Vector (`AV:N` $\\implies$ Exploitable globally over Internet $\\implies$ Mass scale threat)",
            "Physical Vector (`AV:P` $\\implies$ Requires physical possession and disassembly $\\implies$ Limited blast radius)",
            "Blast Radius Quantification"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d22-b1-cvss-31-vector-metrics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "av_weight_demo.js",
            "initialCode": "function evaluateBlastRadius(attackVector) {\n  return (attackVector === 'NETWORK')\n    ? 'MASS_SCALE_REMOTE_FLEET_EXPOSURE: HIGHEST_PRIORITY'\n    : 'PHYSICAL_SINGLE_DEVICE_EXPOSURE: CONTAINED_BLAST_RADIUS';\n}\n\nconsole.log(evaluateBlastRadius('NETWORK'));\nconsole.log(evaluateBlastRadius('PHYSICAL'));",
            "expectedOutput": "MASS_SCALE_REMOTE_FLEET_EXPOSURE: HIGHEST_PRIORITY\nPHYSICAL_SINGLE_DEVICE_EXPOSURE: CONTAINED_BLAST_RADIUS",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What blast radius evaluation is assigned to a Network (`AV:N`) attack vector?",
          "expectedStringOutput": "MASS_SCALE_REMOTE_FLEET_EXPOSURE: HIGHEST_PRIORITY",
          "acceptableAnswers": [
            "MASS_SCALE_REMOTE_FLEET_EXPOSURE: HIGHEST_PRIORITY",
            "MASS_SCALE_REMOTE_FLEET_EXPOSURE"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SEVERITY_CVSS_CVE_VULNERABILITY_TRIAGE",
          "diagnosisMap": {
            "CONTAINED": {
              "misconceptionId": "MC_IOTSEC_SEVERITY_CVSS_CVE_VULNERABILITY_TRIAGE",
              "errorExplanation": "Network attacks scale remotely across all connected devices.",
              "recoveryPath": {
                "simplerExplanation": "Matches MASS_SCALE_REMOTE_FLEET_EXPOSURE: HIGHEST_PRIORITY.",
                "guidedFixPrompt": "Type MASS_SCALE_REMOTE_FLEET_EXPOSURE: HIGHEST_PRIORITY"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d22-b3-fleet-vulnerability-sla",
        "day": 22,
        "blockNumber": 3,
        "title": "Fleet Patching Service Level Agreements (SLAs)",
        "conceptBudget": {
          "primaryConcept": "Vulnerability Patching SLAs",
          "supportingTerms": [
            "Critical SLA ($< 24\\text{ hours}$)",
            "High SLA ($< 7\\text{ days}$)",
            "Canary Fleet Rollout (Deploying patch to 1% canary group first to prevent bricking 100% of fleet on bad build!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d22-b2-attack-vector-physical-vs-network",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "canary_rollout_demo.js",
            "initialCode": "function evaluateCanaryProgression(canaryHealthPercent) {\n  return canaryHealthPercent >= 99.9\n    ? 'CANARY_HEALTHY: EXPAND_ROLLOUT_TO_100_PERCENT_FLEET'\n    : 'CANARY_DEFECT_DETECTED: HALT_ROLLOUT_PREVENT_FLEET_BRICK';\n}\n\nconsole.log(evaluateCanaryProgression(100.0));\nconsole.log(evaluateCanaryProgression(94.2));",
            "expectedOutput": "CANARY_HEALTHY: EXPAND_ROLLOUT_TO_100_PERCENT_FLEET\nCANARY_DEFECT_DETECTED: HALT_ROLLOUT_PREVENT_FLEET_BRICK",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken when the 1% canary test group maintains 100% health over a 24-hour evaluation window?",
          "expectedStringOutput": "CANARY_HEALTHY: EXPAND_ROLLOUT_TO_100_PERCENT_FLEET",
          "acceptableAnswers": [
            "CANARY_HEALTHY: EXPAND_ROLLOUT_TO_100_PERCENT_FLEET",
            "CANARY_HEALTHY"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SEVERITY_CVSS_CVE_VULNERABILITY_TRIAGE",
          "diagnosisMap": {
            "HALT": {
              "misconceptionId": "MC_IOTSEC_SEVERITY_CVSS_CVE_VULNERABILITY_TRIAGE",
              "errorExplanation": "Healthy canary testing expands rollout to the full fleet.",
              "recoveryPath": {
                "simplerExplanation": "Expands rollout to fleet.",
                "guidedFixPrompt": "Type CANARY_HEALTHY: EXPAND_ROLLOUT_TO_100_PERCENT_FLEET"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 23,
    "title": "Software Bill of Materials (SBOM) & Supply Chain Security",
    "overviewMetaphor": "An SBOM is a Nutrition & Ingredient Label on a Food Package: when you compile a firmware binary, it contains third-party C libraries (FreeRTOS kernel, lwIP TCP/IP stack, MbedTLS, cJSON); when a critical vulnerability like Ripple20 or Log4j hits, an engineering team without an SBOM spends 3 weeks guessing which of their 500 product models contain the vulnerable library; a machine-readable SBOM (CycloneDX / SPDX) allows an automated scanner to identify affected firmware in 2 seconds.",
    "blocks": [
      {
        "id": "iotsec-d23-b1-embedded-supply-chain-threats",
        "day": 23,
        "blockNumber": 1,
        "title": "Third-Party Embedded C Dependencies & Ripple20 / Urgent/11 Threats",
        "conceptBudget": {
          "primaryConcept": "Embedded Dependency Supply Chain Vulnerabilities",
          "supportingTerms": [
            "Ripple20 (19 zero-days in Treck embedded TCP/IP stack affecting hundreds of millions of smart devices)",
            "Urgent/11 (IPnet stack RCE vulnerabilities in medical devices and industrial PLCs)",
            "Hidden Transitive C Dependencies"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d22-b1-cvss-31-vector-metrics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Firmware Binary Composition by Source",
              "boxes": [
                {
                  "label": "1. Proprietary Code (15%)",
                  "value": "Sensor reading, business logic, UI | Audited: Internal team",
                  "varType": "In-House Code",
                  "isUpdated": false
                },
                {
                  "label": "2. Open Source / Vendor Stacks (85%)",
                  "value": "lwIP, FreeRTOS, TinyCrypt, MCU Driver HALs | Risk: Unmonitored CVEs!",
                  "varType": "Third-Party Supply Chain",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "sbom_risk_demo.js",
            "initialCode": "function evaluateSbomVisibility(hasSbom) {\n  return hasSbom\n    ? 'SBOM_ACTIVE: INSTANT_CVE_MATCHING_AND_SUPPLY_CHAIN_VISIBILITY'\n    : 'CRITICAL_BLINDSPOT: UNTRACKED_VULNERABLE_LIBRARIES_IN_FIRMWARE';\n}\n\nconsole.log(evaluateSbomVisibility(true));\nconsole.log(evaluateSbomVisibility(false));",
            "expectedOutput": "SBOM_ACTIVE: INSTANT_CVE_MATCHING_AND_SUPPLY_CHAIN_VISIBILITY\nCRITICAL_BLINDSPOT: UNTRACKED_VULNERABLE_LIBRARIES_IN_FIRMWARE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What capability is enabled by maintaining a machine-readable Software Bill of Materials (SBOM) for firmware?",
          "expectedStringOutput": "SBOM_ACTIVE: INSTANT_CVE_MATCHING_AND_SUPPLY_CHAIN_VISIBILITY",
          "acceptableAnswers": [
            "SBOM_ACTIVE: INSTANT_CVE_MATCHING_AND_SUPPLY_CHAIN_VISIBILITY",
            "SBOM_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_FIRMWARE_SBOOM_SOFTWARE_BILL_OF_MATERIALS",
          "diagnosisMap": {
            "BLINDSPOT": {
              "misconceptionId": "MC_IOTSEC_FIRMWARE_SBOOM_SOFTWARE_BILL_OF_MATERIALS",
              "errorExplanation": "SBOM provides instant visibility into third-party CVEs.",
              "recoveryPath": {
                "simplerExplanation": "Matches SBOM_ACTIVE: INSTANT_CVE_MATCHING_AND_SUPPLY_CHAIN_VISIBILITY.",
                "guidedFixPrompt": "Type SBOM_ACTIVE: INSTANT_CVE_MATCHING_AND_SUPPLY_CHAIN_VISIBILITY"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d23-b2-cyclonedx-spdx-standards",
        "day": 23,
        "blockNumber": 2,
        "title": "CycloneDX vs SPDX Standards & Package URLs (PURL)",
        "conceptBudget": {
          "primaryConcept": "CycloneDX and SPDX SBOM Formats",
          "supportingTerms": [
            "CycloneDX (JSON/XML optimized for application security & dependency graph)",
            "SPDX (ISO/IEC 5962 international standard for licensing & components)",
            "Package URL (PURL: `pkg:github/lwip/lwip@2.1.2`)",
            "Common Platform Enumeration (CPE)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d23-b1-embedded-supply-chain-threats",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "CycloneDX Component Snippet",
            "codeSnippet": "{\n  \"type\": \"library\",\n  \"name\": \"mbedtls\",\n  \"version\": \"3.4.0\",\n  \"purl\": \"pkg:github/Mbed-TLS/mbedtls@3.4.0\",\n  \"hashes\": [{ \"alg\": \"SHA-256\", \"content\": \"e3b0c442...\" }]\n}",
            "lineNotes": {
              "3": "Exact component name and version.",
              "4": "Standardized Package URL."
            }
          },
          {
            "type": "runnable_code",
            "filename": "purl_format_demo.js",
            "initialCode": "function formatPurl(name, version) {\n  return `pkg:embedded/${name}@${version}`;\n}\n\nconsole.log(formatPurl('freertos', '10.5.1'));\nconsole.log(formatPurl('lwip', '2.2.0'));",
            "expectedOutput": "pkg:embedded/freertos@10.5.1\npkg:embedded/lwip@2.2.0",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What is the formatted PURL string for FreeRTOS version 10.5.1 under the `embedded` type?",
          "expectedStringOutput": "pkg:embedded/freertos@10.5.1",
          "acceptableAnswers": [
            "pkg:embedded/freertos@10.5.1"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_FIRMWARE_SBOOM_SOFTWARE_BILL_OF_MATERIALS",
          "diagnosisMap": {
            "freertos": {
              "misconceptionId": "MC_IOTSEC_FIRMWARE_SBOOM_SOFTWARE_BILL_OF_MATERIALS",
              "errorExplanation": "Format is pkg:embedded/freertos@10.5.1.",
              "recoveryPath": {
                "simplerExplanation": "Matches pkg:embedded/freertos@10.5.1.",
                "guidedFixPrompt": "Type pkg:embedded/freertos@10.5.1"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d23-b3-automated-cve-database-matching",
        "day": 23,
        "blockNumber": 3,
        "title": "Automated NVD / OSV Vulnerability Database Ingestion",
        "conceptBudget": {
          "primaryConcept": "Automated CVE Ingestion & Matching",
          "supportingTerms": [
            "National Vulnerability Database (NVD API v2.0)",
            "Open Source Vulnerabilities (OSV.dev)",
            "Automated CI/CD Build Gate (Failing firmware compilation if dependency has known Critical CVE!)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d23-b2-cyclonedx-spdx-standards",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "cve_gate_demo.js",
            "initialCode": "function evaluateBuildGate(maxCveSeverityScore) {\n  return maxCveSeverityScore >= 7.0\n    ? 'BUILD_GATE_BLOCKED: CRITICAL_CVE_DETECTED_IN_DEPENDENCIES'\n    : 'BUILD_GATE_PASSED: ALL_DEPENDENCIES_WITHIN_RISK_TOLERANCE';\n}\n\nconsole.log(evaluateBuildGate(9.8));\nconsole.log(evaluateBuildGate(3.2));",
            "expectedOutput": "BUILD_GATE_BLOCKED: CRITICAL_CVE_DETECTED_IN_DEPENDENCIES\nBUILD_GATE_PASSED: ALL_DEPENDENCIES_WITHIN_RISK_TOLERANCE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken by the CI/CD build gate when an SBOM scan detects a dependency with a CVSS 9.8 vulnerability?",
          "expectedStringOutput": "BUILD_GATE_BLOCKED: CRITICAL_CVE_DETECTED_IN_DEPENDENCIES",
          "acceptableAnswers": [
            "BUILD_GATE_BLOCKED: CRITICAL_CVE_DETECTED_IN_DEPENDENCIES",
            "BUILD_GATE_BLOCKED"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_FIRMWARE_SBOOM_SOFTWARE_BILL_OF_MATERIALS",
          "diagnosisMap": {
            "PASSED": {
              "misconceptionId": "MC_IOTSEC_FIRMWARE_SBOOM_SOFTWARE_BILL_OF_MATERIALS",
              "errorExplanation": "High/Critical CVEs block the automated build pipeline.",
              "recoveryPath": {
                "simplerExplanation": "Blocks build on critical CVE.",
                "guidedFixPrompt": "Type BUILD_GATE_BLOCKED: CRITICAL_CVE_DETECTED_IN_DEPENDENCIES"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 24,
    "title": "Embedded C Memory Safety: Stack Canaries & Buffer Overflow Defenses",
    "overviewMetaphor": "A Stack Canary is a Live Canary in a Coal Mine: when an unsafe C function calls `strcpy()` on an oversized Wi-Fi packet, the extra bytes spill past the array, overwriting the function's Return Address on the stack (Allowing a hacker to redirect the CPU to execute malicious shellcode!); the compiler places a random 32-bit secret number (The Canary `0xDEADBEEF`) right between the buffer and the return address; before returning, the CPU checks if the canary is intact; if the canary was poisoned by overflow bytes, the CPU immediately crashes into a hardfault panic before executing any hacker code.",
    "blocks": [
      {
        "id": "iotsec-d24-b1-stack-frame-corruption-mechanics",
        "day": 24,
        "blockNumber": 1,
        "title": "Stack Smashing & Return Address Overwrite Mechanics",
        "conceptBudget": {
          "primaryConcept": "Stack Smashing Mechanics",
          "supportingTerms": [
            "Stack Frame Layout (Local Variables $\\to$ Saved Frame Pointer `FP` $\\to$ Return Address `LR/RA`)",
            "Buffer Overflow via unbounded string copies (`strcpy`, `sprintf`, `gets`)",
            "Control Flow Hijacking (Redirecting `PC` to attacker-controlled memory)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d1-b1-hardware-root-of-trust-boot-rom",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Normal Stack Frame vs Smashed Stack Frame",
              "boxes": [
                {
                  "label": "1. Normal Stack Frame",
                  "value": "Local Buffer: [32 bytes] | Stack Canary: 0xDEADBEEF | Saved LR: 0x08001240 (Valid Caller)",
                  "varType": "Normal Frame",
                  "isUpdated": false
                },
                {
                  "label": "2. Smashed Stack (Attacked)",
                  "value": "Local Buffer: ['A' * 32] | Stack Canary: 0x41414141 (POISONED!) | Saved LR: 0x20004000 (Shellcode!)",
                  "varType": "Attacked Frame",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "canary_smash_demo.js",
            "initialCode": "function checkStackIntegrity(initialCanaryHex, currentCanaryHex) {\n  const isIntact = (initialCanaryHex === currentCanaryHex);\n  return isIntact\n    ? 'STACK_INTEGRITY_VERIFIED: RETURN_TO_CALLER'\n    : 'STACK_SMASHING_DETECTED_CALL_HARDFAULT_PANIC';\n}\n\nconsole.log(checkStackIntegrity('0xDEADBEEF', '0xDEADBEEF'));\nconsole.log(checkStackIntegrity('0xDEADBEEF', '0x41414141')); // Overwritten with 'AAAA'!",
            "expectedOutput": "STACK_INTEGRITY_VERIFIED: RETURN_TO_CALLER\nSTACK_SMASHING_DETECTED_CALL_HARDFAULT_PANIC",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is triggered when a stack canary is poisoned by buffer overflow bytes (`0xDEADBEEF` -> `0x41414141`)?",
          "expectedStringOutput": "STACK_SMASHING_DETECTED_CALL_HARDFAULT_PANIC",
          "acceptableAnswers": [
            "STACK_SMASHING_DETECTED_CALL_HARDFAULT_PANIC",
            "STACK_SMASHING_DETECTED"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_MEMORY_CORRUPTION_CANARY_STACK_OVERFLOW",
          "diagnosisMap": {
            "RETURN": {
              "misconceptionId": "MC_IOTSEC_MEMORY_CORRUPTION_CANARY_STACK_OVERFLOW",
              "errorExplanation": "Corrupted canaries immediately trigger a hardfault panic.",
              "recoveryPath": {
                "simplerExplanation": "Triggers STACK_SMASHING_DETECTED_CALL_HARDFAULT_PANIC.",
                "guidedFixPrompt": "Type STACK_SMASHING_DETECTED_CALL_HARDFAULT_PANIC"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d24-b2-gcc-stack-protector-flags",
        "day": 24,
        "blockNumber": 2,
        "title": "Compiler Protections: `-fstack-protector-strong` & `__stack_chk_guard`",
        "conceptBudget": {
          "primaryConcept": "GCC Stack Protector Flags",
          "supportingTerms": [
            "`-fstack-protector-strong` (Instruments functions containing buffers or address references)",
            "`__stack_chk_guard` (Global random canary word seeded at boot from hardware TRNG)",
            "`__stack_chk_fail()` (Abort handler executing safe reboot)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d24-b1-stack-frame-corruption-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Stack Guard Initialization in C",
            "codeSnippet": "uintptr_t __stack_chk_guard = 0;\nvoid __attribute__((constructor)) init_stack_canary(void) {\n  __stack_chk_guard = hardware_trng_get_random_u32(); // Random seed from TRNG at reset!\n}\nvoid __stack_chk_fail(void) {\n  log_security_panic(\"STACK SMASH DETECTED\");\n  NVIC_SystemReset(); // Safe instant hardware reboot!\n}",
            "lineNotes": {
              "3": "Initializes canary from hardware TRNG.",
              "6": "Reboots system on corruption detection."
            }
          },
          {
            "type": "runnable_code",
            "filename": "canary_flag_demo.js",
            "initialCode": "function evaluateCompilerProtection(flag) {\n  if (flag === '-fstack-protector-strong') return 'OPTIMAL_EMBEDDED_PROTECTION_MINIMAL_CODE_SIZE';\n  if (flag === '-fstack-protector-all') return 'HIGH_OVERHEAD_EVERY_FUNCTION_INSTRUMENTED';\n  return 'NO_CANARY_PROTECTION_VULNERABLE';\n}\n\nconsole.log(evaluateCompilerProtection('-fstack-protector-strong'));",
            "expectedOutput": "OPTIMAL_EMBEDDED_PROTECTION_MINIMAL_CODE_SIZE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "Which GCC compiler flag provides the optimal balance of stack protection and minimal code size overhead for embedded systems?",
          "expectedStringOutput": "-fstack-protector-strong",
          "acceptableAnswers": [
            "-fstack-protector-strong",
            "stack-protector-strong"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_MEMORY_CORRUPTION_CANARY_STACK_OVERFLOW",
          "diagnosisMap": {
            "all": {
              "misconceptionId": "MC_IOTSEC_MEMORY_CORRUPTION_CANARY_STACK_OVERFLOW",
              "errorExplanation": "-fstack-protector-strong is the optimal balanced standard for embedded systems.",
              "recoveryPath": {
                "simplerExplanation": "Use -fstack-protector-strong.",
                "guidedFixPrompt": "Type -fstack-protector-strong"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d24-b3-mpu-dep-nx-bit-enforcement",
        "day": 24,
        "blockNumber": 3,
        "title": "Memory Protection Unit (MPU) Data Execution Prevention (DEP / NX)",
        "conceptBudget": {
          "primaryConcept": "MPU Data Execution Prevention (DEP)",
          "supportingTerms": [
            "Never-Execute Bit (NX / XN: Execute Never on SRAM regions)",
            "$W \\oplus X$ Principle (Write XOR Execute: A memory region can be Writable OR Executable, NEVER BOTH!)",
            "Preventing Shellcode Execution in Stack/Heap"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d24-b2-gcc-stack-protector-flags",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "dep_wx_demo.js",
            "initialCode": "function evaluateMemoryRegionSecurity(isWritable, isExecutable) {\n  const isWxViolated = isWritable && isExecutable;\n  return isWxViolated\n    ? 'CRITICAL_VULNERABILITY_W_XOR_X_VIOLATION_SHELLCODE_POSSIBLE'\n    : 'MPU_DEP_COMPLIANT_W_XOR_X_ENFORCED';\n}\n\nconsole.log(evaluateMemoryRegionSecurity(true, false)); // Writable RAM (NX set)\nconsole.log(evaluateMemoryRegionSecurity(false, true)); // Executable Flash (Read-Only)\nconsole.log(evaluateMemoryRegionSecurity(true, true));  // Writable + Executable (VULNERABLE!)",
            "expectedOutput": "MPU_DEP_COMPLIANT_W_XOR_X_ENFORCED\nMPU_DEP_COMPLIANT_W_XOR_X_ENFORCED\nCRITICAL_VULNERABILITY_W_XOR_X_VIOLATION_SHELLCODE_POSSIBLE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What security status is awarded when RAM is configured as Writable but Non-Executable ($W \\oplus X$ enforced)?",
          "expectedStringOutput": "MPU_DEP_COMPLIANT_W_XOR_X_ENFORCED",
          "acceptableAnswers": [
            "MPU_DEP_COMPLIANT_W_XOR_X_ENFORCED",
            "MPU_DEP_COMPLIANT"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_MEMORY_CORRUPTION_CANARY_STACK_OVERFLOW",
          "diagnosisMap": {
            "VIOLATION": {
              "misconceptionId": "MC_IOTSEC_MEMORY_CORRUPTION_CANARY_STACK_OVERFLOW",
              "errorExplanation": "Separating Write and Execute permissions achieves MPU_DEP_COMPLIANT_W_XOR_X_ENFORCED.",
              "recoveryPath": {
                "simplerExplanation": "Matches MPU_DEP_COMPLIANT_W_XOR_X_ENFORCED.",
                "guidedFixPrompt": "Type MPU_DEP_COMPLIANT_W_XOR_X_ENFORCED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 25,
    "title": "Automotive & Industrial Bus Security: CAN Bus & Modbus Intrusion Detection",
    "overviewMetaphor": "Industrial Bus Security is a Traffic Cop on a Crowded Single-Lane Highway: Controller Area Network (CAN) in cars and Modbus in chemical plants were designed in the 1980s without any passwords or encryption; any device connected to the wires can broadcast fake commands (e.g. 'APPLY_MAX_BRAKES=1'); an embedded Intrusion Detection System (IDS) inspects the frequency and payload patterns of every bus frame; if a rogue node starts flooding message IDs or injecting illegal coil registers, the IDS isolates the rogue node in 5 milliseconds.",
    "blocks": [
      {
        "id": "iotsec-d25-b1-can-bus-broadcast-vulnerabilities",
        "day": 25,
        "blockNumber": 1,
        "title": "CAN Bus Inherent Insecurities: Broadcast & No Authentication",
        "conceptBudget": {
          "primaryConcept": "CAN Bus Broadcast Insecurities",
          "supportingTerms": [
            "CAN 2.0B Frame Architecture (11/29-bit Arbitration ID, 0-8 byte payload)",
            "Lack of Source Addressing (Zero fields in CAN frame indicate which ECU sent the message!)",
            "Denial of Service (Flooding arbitration ID `0x000` to win all bus arbitration battles)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d1-b3-jeep-cherokee-case-study",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "CAN Bus Arbitration Frame Vulnerability",
              "boxes": [
                {
                  "label": "1. Standard Sensor Frame",
                  "value": "ID: 0x120 (Brake Sensor) | Interval: 20 ms | Payload: [0x00, 0x12] | Bus Priority: Normal",
                  "varType": "Normal Frame",
                  "isUpdated": false
                },
                {
                  "label": "2. Attacker Flooding Injection",
                  "value": "ID: 0x000 (Dominant 0s) | Interval: 0.1 ms | Payload: [0xFF, 0xFF] | Result: WINS 100% OF BUS ARBITRATION -> TOTAL BUS SHUTDOWN!",
                  "varType": "DoS Attack",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "can_ids_demo.js",
            "initialCode": "function evaluateCanTraffic(messageIdHex, intervalMs, expectedIntervalMs = 20) {\n  const isFlooded = intervalMs < (expectedIntervalMs / 4);\n  const isDominantZero = (messageIdHex === '0x000');\n  const isAttack = isFlooded || isDominantZero;\n  return {\n    canId: messageIdHex,\n    measuredIntervalMs: intervalMs,\n    intrusionDetected: isAttack,\n    status: isAttack ? 'CAN_BUS_INTRUSION_DETECTED_ISOLATE_NODE' : 'CAN_BUS_TRAFFIC_NOMINAL'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateCanTraffic('0x120', 20)));\nconsole.log(JSON.stringify(evaluateCanTraffic('0x120', 1))); // Flooding attack!",
            "expectedOutput": "{\"canId\":\"0x120\",\"measuredIntervalMs\":20,\"intrusionDetected\":false,\"status\":\"CAN_BUS_TRAFFIC_NOMINAL\"}\n{\"canId\":\"0x120\",\"measuredIntervalMs\":1,\"intrusionDetected\":true,\"status\":\"CAN_BUS_INTRUSION_DETECTED_ISOLATE_NODE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken by a CAN Intrusion Detection System when a message arrives at 1 ms interval instead of the expected 20 ms?",
          "expectedStringOutput": "CAN_BUS_INTRUSION_DETECTED_ISOLATE_NODE",
          "acceptableAnswers": [
            "CAN_BUS_INTRUSION_DETECTED_ISOLATE_NODE",
            "status\":\"CAN_BUS_INTRUSION_DETECTED_ISOLATE_NODE\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_CAN_BUS_VEHICLE_INTRUSION_DETECTION_IDS",
          "diagnosisMap": {
            "NOMINAL": {
              "misconceptionId": "MC_IOTSEC_CAN_BUS_VEHICLE_INTRUSION_DETECTION_IDS",
              "errorExplanation": "1 ms vs 20 ms indicates a flooding injection attack.",
              "recoveryPath": {
                "simplerExplanation": "Triggers CAN_BUS_INTRUSION_DETECTED_ISOLATE_NODE.",
                "guidedFixPrompt": "Type CAN_BUS_INTRUSION_DETECTED_ISOLATE_NODE"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d25-b2-secoc-message-authentication",
        "day": 25,
        "blockNumber": 2,
        "title": "Secure On-Board Communication (AUTOSAR SecOC)",
        "conceptBudget": {
          "primaryConcept": "AUTOSAR SecOC Message Authentication",
          "supportingTerms": [
            "SecOC (AUTOSAR standard appending Truncated CMAC + Freshness Value to CAN payload)",
            "Freshness Value Management (FVM: Monotonic counter preventing replay attacks)",
            "AES-128-CMAC (4 - 8 byte cryptographic tag)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d25-b1-can-bus-broadcast-vulnerabilities",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "SecOC Frame Payload Layout",
            "codeSnippet": "// CAN-FD 64-byte payload with SecOC:\n// [Byte 0..55: Sensor Payload] [Byte 56..59: Freshness Counter] [Byte 60..63: Truncated CMAC Tag]\nconst isAuthentic = verifySecOcCmac(payload, freshnessCounter, rxCmacTag, sharedSecretKey);",
            "lineNotes": {
              "2": "Combines sensor data, freshness counter, and CMAC.",
              "3": "Verifies cryptographic MAC before executing actuator command."
            }
          },
          {
            "type": "runnable_code",
            "filename": "secoc_demo.js",
            "initialCode": "function evaluateSecOcFrame(freshnessMatches, cmacValid) {\n  const isAccepted = freshnessMatches && cmacValid;\n  return {\n    freshnessPassed: freshnessMatches,\n    cmacPassed: cmacValid,\n    frameAccepted: isAccepted,\n    status: isAccepted ? 'SECOC_AUTHENTICATION_SUCCESS' : 'SECOC_FORGERY_ATTACK_REJECTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateSecOcFrame(true, true)));\nconsole.log(JSON.stringify(evaluateSecOcFrame(false, true))); // Replayed freshness counter!",
            "expectedOutput": "{\"freshnessPassed\":true,\"cmacPassed\":true,\"frameAccepted\":true,\"status\":\"SECOC_AUTHENTICATION_SUCCESS\"}\n{\"freshnessPassed\":false,\"cmacPassed\":true,\"frameAccepted\":false,\"status\":\"SECOC_FORGERY_ATTACK_REJECTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is returned when an attacker replays a previously recorded CAN frame with an outdated SecOC freshness counter?",
          "expectedStringOutput": "SECOC_FORGERY_ATTACK_REJECTED",
          "acceptableAnswers": [
            "SECOC_FORGERY_ATTACK_REJECTED",
            "status\":\"SECOC_FORGERY_ATTACK_REJECTED\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_CAN_BUS_VEHICLE_INTRUSION_DETECTION_IDS",
          "diagnosisMap": {
            "SUCCESS": {
              "misconceptionId": "MC_IOTSEC_CAN_BUS_VEHICLE_INTRUSION_DETECTION_IDS",
              "errorExplanation": "Stale freshness counters are detected as replay attacks and rejected.",
              "recoveryPath": {
                "simplerExplanation": "Rejects replayed frame -> SECOC_FORGERY_ATTACK_REJECTED.",
                "guidedFixPrompt": "Type SECOC_FORGERY_ATTACK_REJECTED"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d25-b3-modbus-scada-deep-packet-inspection",
        "day": 25,
        "blockNumber": 3,
        "title": "Modbus / SCADA Deep Packet Inspection (DPI) & Function Code Firewalls",
        "conceptBudget": {
          "primaryConcept": "Modbus SCADA Deep Packet Inspection",
          "supportingTerms": [
            "Function Code Whitelisting (Permit Read Holding Registers `0x03`, block unauthorized Write Coil `0x05` / Write Multiple `0x10`)",
            "Register Address Range Enforcing",
            "Industrial SCADA Firewall Rules"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d25-b2-secoc-message-authentication",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "modbus_firewall_demo.js",
            "initialCode": "function evaluateModbusFirewall(functionCode, isOperatorStation) {\n  const isRead = (functionCode === 0x03 || functionCode === 0x04);\n  const isWrite = (functionCode === 0x05 || functionCode === 0x10);\n  if (isWrite && !isOperatorStation) {\n    return 'FIREWALL_BLOCKED: UNAUTHORIZED_MODBUS_WRITE_ATTEMPT';\n  }\n  return 'MODBUS_COMMAND_PERMITTED';\n}\n\nconsole.log(evaluateModbusFirewall(0x03, false)); // Read from anywhere\nconsole.log(evaluateModbusFirewall(0x05, false)); // Write from untrusted IP!\nconsole.log(evaluateModbusFirewall(0x05, true));  // Write from authorized operator",
            "expectedOutput": "MODBUS_COMMAND_PERMITTED\nFIREWALL_BLOCKED: UNAUTHORIZED_MODBUS_WRITE_ATTEMPT\nMODBUS_COMMAND_PERMITTED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken by the industrial firewall when an unauthenticated IP sends a Modbus Write Coil command (`0x05`) to a PLC?",
          "expectedStringOutput": "FIREWALL_BLOCKED: UNAUTHORIZED_MODBUS_WRITE_ATTEMPT",
          "acceptableAnswers": [
            "FIREWALL_BLOCKED: UNAUTHORIZED_MODBUS_WRITE_ATTEMPT",
            "FIREWALL_BLOCKED"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_MODBUS_PROFINET_INDUSTRIAL_FIREWALL_RULES",
          "diagnosisMap": {
            "PERMITTED": {
              "misconceptionId": "MC_IOTSEC_MODBUS_PROFINET_INDUSTRIAL_FIREWALL_RULES",
              "errorExplanation": "Unauthorized writes are blocked by deep packet inspection.",
              "recoveryPath": {
                "simplerExplanation": "Matches FIREWALL_BLOCKED: UNAUTHORIZED_MODBUS_WRITE_ATTEMPT.",
                "guidedFixPrompt": "Type FIREWALL_BLOCKED: UNAUTHORIZED_MODBUS_WRITE_ATTEMPT"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 26,
    "title": "Secure Commissioning: Bluetooth LE PASE & Out-of-Band (OOB) NFC",
    "overviewMetaphor": "Commissioning is Giving a New Key to a Babysitter in Person: when you buy a smart thermostat and take it out of the box, it needs to join your encrypted home Wi-Fi network; if it broadcasts an open unencrypted Wi-Fi setup network, a neighbor driving by can connect and hijack your thermostat; Passcode-Authenticated Session Establishment (PASE / Matter Standard) uses a short 8-digit setup PIN on the QR code or NFC tap; SPAKE2+ password-authenticated key exchange guarantees that eavesdroppers sniffing the Bluetooth air packets learn zero bits of the Wi-Fi credentials.",
    "blocks": [
      {
        "id": "iotsec-d26-b1-matter-pase-spake2-handshake",
        "day": 26,
        "blockNumber": 1,
        "title": "Matter Standard PASE & SPAKE2+ Key Exchange Math",
        "conceptBudget": {
          "primaryConcept": "Matter PASE SPAKE2+ Key Exchange",
          "supportingTerms": [
            "Passcode-Authenticated Session Establishment (PASE)",
            "SPAKE2+ (Password Authenticated Key Exchange: Eliminates offline dictionary attacks!)",
            "8-Digit Setup Passcode (Printed on QR label / manual)",
            "Zero Wi-Fi Credential Exposure"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d4-b3-ecdh-shared-secret-derivation",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Open SoftAP Setup vs Matter PASE SPAKE2+",
              "boxes": [
                {
                  "label": "1. Legacy Open SoftAP Setup",
                  "value": "Encryption: NONE (Plaintext HTTP) | Sniffable: YES (Wi-Fi password sent in cleartext!) | Risk: HIGH",
                  "varType": "Insecure Setup",
                  "isUpdated": false
                },
                {
                  "label": "2. Matter PASE SPAKE2+",
                  "value": "Encryption: Authenticated PAKE over BLE | Sniffable: ZERO! (Eavesdropper learns nothing) | Security: HARDENED",
                  "varType": "Matter Standard",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "spake2_demo.js",
            "initialCode": "function evaluatePaseHandshake(passcodeCorrect, saltMatches) {\n  const isPaired = passcodeCorrect && saltMatches;\n  return {\n    passcodeVerified: passcodeCorrect,\n    saltValid: saltMatches,\n    sessionEstablished: isPaired,\n    status: isPaired ? 'PASE_SPAKE2_SESSION_AUTHENTICATED' : 'PASE_HANDSHAKE_REJECTED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluatePaseHandshake(true, true)));\nconsole.log(JSON.stringify(evaluatePaseHandshake(false, true)));",
            "expectedOutput": "{\"passcodeVerified\":true,\"saltValid\":true,\"sessionEstablished\":true,\"status\":\"PASE_SPAKE2_SESSION_AUTHENTICATED\"}\n{\"passcodeVerified\":false,\"saltValid\":true,\"sessionEstablished\":false,\"status\":\"PASE_HANDSHAKE_REJECTED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms successful session establishment via Matter PASE SPAKE2+ key exchange?",
          "expectedStringOutput": "PASE_SPAKE2_SESSION_AUTHENTICATED",
          "acceptableAnswers": [
            "PASE_SPAKE2_SESSION_AUTHENTICATED",
            "status\":\"PASE_SPAKE2_SESSION_AUTHENTICATED\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SECURE_COMMISSIONING_BLE_OOB_PASE",
          "diagnosisMap": {
            "REJECTED": {
              "misconceptionId": "MC_IOTSEC_SECURE_COMMISSIONING_BLE_OOB_PASE",
              "errorExplanation": "Valid passcode and salt establish an authenticated session.",
              "recoveryPath": {
                "simplerExplanation": "Matches PASE_SPAKE2_SESSION_AUTHENTICATED.",
                "guidedFixPrompt": "Type PASE_SPAKE2_SESSION_AUTHENTICATED"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d26-b2-case-operational-certificates",
        "day": 26,
        "blockNumber": 2,
        "title": "Certificate-Authenticated Session Establishment (CASE)",
        "conceptBudget": {
          "primaryConcept": "CASE Operational Handshake",
          "supportingTerms": [
            "Node Operational Certificate (NOC: Issued to device after PASE commissioning)",
            "Fabric ID (Shared cryptographically isolated multi-vendor smart home network)",
            "Resumption Tickets"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d26-b1-matter-pase-spake2-handshake",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "case_handshake_demo.js",
            "initialCode": "function evaluateCaseSession(hasNocCertificate, fabricIdMatches) {\n  const isTrusted = hasNocCertificate && fabricIdMatches;\n  return {\n    nocCertValid: hasNocCertificate,\n    fabricMembershipValid: fabricIdMatches,\n    operationalAccess: isTrusted,\n    status: isTrusted ? 'CASE_OPERATIONAL_SESSION_ACTIVE' : 'CASE_ACCESS_DENIED'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateCaseSession(true, true)));",
            "expectedOutput": "{\"nocCertValid\":true,\"fabricMembershipValid\":true,\"operationalAccess\":true,\"status\":\"CASE_OPERATIONAL_SESSION_ACTIVE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms active operational communication between two commissioned Matter devices using Node Operational Certificates (CASE)?",
          "expectedStringOutput": "CASE_OPERATIONAL_SESSION_ACTIVE",
          "acceptableAnswers": [
            "CASE_OPERATIONAL_SESSION_ACTIVE",
            "status\":\"CASE_OPERATIONAL_SESSION_ACTIVE\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SECURE_COMMISSIONING_BLE_OOB_PASE",
          "diagnosisMap": {
            "DENIED": {
              "misconceptionId": "MC_IOTSEC_SECURE_COMMISSIONING_BLE_OOB_PASE",
              "errorExplanation": "Valid NOC certificate and fabric ID grant CASE operational access.",
              "recoveryPath": {
                "simplerExplanation": "Matches CASE_OPERATIONAL_SESSION_ACTIVE.",
                "guidedFixPrompt": "Type CASE_OPERATIONAL_SESSION_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d26-b3-oob-nfc-mitm-defense",
        "day": 26,
        "blockNumber": 3,
        "title": "Out-of-Band (OOB) NFC Tapping: Man-in-the-Middle (MitM) Elimination",
        "conceptBudget": {
          "primaryConcept": "Out-of-Band NFC Commissioning",
          "supportingTerms": [
            "Physical Proximity Invariant ($< 4\\text{ cm}$ operating range)",
            "Eavesdropping Resistance (Impossible for an attacker outside the room to sniff NFC)",
            "Instant Ephemeral Public Key Exchange via NDEF record"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d26-b2-case-operational-certificates",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "oob_nfc_demo.js",
            "initialCode": "function evaluateOobPairing(distanceCm) {\n  return distanceCm <= 4\n    ? 'OOB_NFC_TAP_DETECTED: PROXIMITY_VERIFIED_MITM_IMMUNE'\n    : 'OUT_OF_RANGE_PROXIMITY_UNVERIFIED';\n}\n\nconsole.log(evaluateOobPairing(2));\nconsole.log(evaluateOobPairing(50));",
            "expectedOutput": "OOB_NFC_TAP_DETECTED: PROXIMITY_VERIFIED_MITM_IMMUNE\nOUT_OF_RANGE_PROXIMITY_UNVERIFIED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What security status is awarded when pairing is initiated via a physical NFC tap within 4 cm proximity?",
          "expectedStringOutput": "OOB_NFC_TAP_DETECTED: PROXIMITY_VERIFIED_MITM_IMMUNE",
          "acceptableAnswers": [
            "OOB_NFC_TAP_DETECTED: PROXIMITY_VERIFIED_MITM_IMMUNE",
            "OOB_NFC_TAP_DETECTED"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_SECURE_COMMISSIONING_BLE_OOB_PASE",
          "diagnosisMap": {
            "OUT_OF_RANGE": {
              "misconceptionId": "MC_IOTSEC_SECURE_COMMISSIONING_BLE_OOB_PASE",
              "errorExplanation": "2 cm is well within the 4 cm NFC operating range.",
              "recoveryPath": {
                "simplerExplanation": "Matches OOB_NFC_TAP_DETECTED: PROXIMITY_VERIFIED_MITM_IMMUNE.",
                "guidedFixPrompt": "Type OOB_NFC_TAP_DETECTED: PROXIMITY_VERIFIED_MITM_IMMUNE"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 27,
    "title": "Secure Decommissioning: Cryptographic Erase & Sanitization",
    "overviewMetaphor": "Cryptographic Erase is Burning the Master Key to a Steel Safe in 1 Millisecond: when an enterprise decommissions 5,000 smart hospital beds or smart energy meters, overwriting 32 GB of Flash memory with zeros takes 45 minutes per device and wears out the flash silicon; with Cryptographic Erase (NIST SP 800-88), all stored data is always encrypted with a Master Storage Key (MSK) held in the Secure Element; to sanitize the device, you shred the 32-byte key in 1 millisecond; without the key, the terabytes of data on flash instantly become mathematically unbreakable static noise.",
    "blocks": [
      {
        "id": "iotsec-d27-b1-nist-sp-800-88-sanitization",
        "day": 27,
        "blockNumber": 1,
        "title": "NIST SP 800-88 Media Sanitization Standards: Clear vs Purge vs Destroy",
        "conceptBudget": {
          "primaryConcept": "NIST SP 800-88 Sanitization Levels",
          "supportingTerms": [
            "Clear (Logical overwrite of user data sectors)",
            "Purge (Cryptographic Erase or block-level hardware purge executing flash controller sanitize)",
            "Destroy (Physical shredding / incinerating silicon)",
            "Certificate of Sanitization"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d10-b1-external-spi-flash-threat",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Sanitization Duration & Security Comparison",
              "boxes": [
                {
                  "label": "1. Full Flash Overwrite (Clear)",
                  "value": "Duration: 35 Minutes | Wear: 1 Full P/E Flash Cycle | Lab Recovery: Possible via electron microscopy",
                  "varType": "Slow Overwrite",
                  "isUpdated": false
                },
                {
                  "label": "2. Cryptographic Erase (Purge)",
                  "value": "Duration: 2 Milliseconds (1,000,000X FASTER!) | Wear: ZERO | Lab Recovery: MATHEMATICALLY IMPOSSIBLE",
                  "varType": "Instant Purge",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "crypto_erase_demo.js",
            "initialCode": "function executeSanitization(method) {\n  if (method === 'CRYPTO_ERASE') {\n    return { durationMs: 2, nistLevel: 'PURGE', status: 'NIST_800_88_PURGE_CERTIFIED' };\n  }\n  return { durationMs: 2100000, nistLevel: 'CLEAR', status: 'OVERWRITE_COMPLETE' };\n}\n\nconsole.log(JSON.stringify(executeSanitization('CRYPTO_ERASE')));",
            "expectedOutput": "{\"durationMs\":2,\"nistLevel\":\"PURGE\",\"status\":\"NIST_800_88_PURGE_CERTIFIED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is certified under NIST SP 800-88 by executing Cryptographic Erase on a storage device?",
          "expectedStringOutput": "NIST_800_88_PURGE_CERTIFIED",
          "acceptableAnswers": [
            "NIST_800_88_PURGE_CERTIFIED",
            "status\":\"NIST_800_88_PURGE_CERTIFIED\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_DECOMMISSIONING_CRYPTO_ERASE_FACTORY_RESET",
          "diagnosisMap": {
            "CLEAR": {
              "misconceptionId": "MC_IOTSEC_DECOMMISSIONING_CRYPTO_ERASE_FACTORY_RESET",
              "errorExplanation": "Cryptographic erase qualifies as PURGE under NIST SP 800-88.",
              "recoveryPath": {
                "simplerExplanation": "Matches NIST_800_88_PURGE_CERTIFIED.",
                "guidedFixPrompt": "Type NIST_800_88_PURGE_CERTIFIED"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d27-b2-secure-key-shredding-mechanics",
        "day": 27,
        "blockNumber": 2,
        "title": "Secure Element Key Shredding & Monotonic Lockout",
        "conceptBudget": {
          "primaryConcept": "Key Shredding Invariant",
          "supportingTerms": [
            "Overwriting Key Slot with TRNG noise (`0xFF` then `0x00` then Random bytes)",
            "Blowing Factory Reset Lockout eFuse",
            "Revoking Device Certificate on Cloud CA via automated API call"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d27-b1-nist-sp-800-88-sanitization",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "key_shred_demo.js",
            "initialCode": "function evaluateKeyShredding(keyErased, caRevoked) {\n  const isClean = keyErased && caRevoked;\n  return {\n    keyVaultShredded: keyErased,\n    cloudCaRevocationDispatched: caRevoked,\n    deviceSanitized: isClean,\n    status: isClean ? 'DEVICE_DECOMMISSIONED_ZERO_SECRETS_REMAINING' : 'INCOMPLETE_DECOMMISSION_RISK'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateKeyShredding(true, true)));",
            "expectedOutput": "{\"keyVaultShredded\":true,\"cloudCaRevocationDispatched\":true,\"deviceSanitized\":true,\"status\":\"DEVICE_DECOMMISSIONED_ZERO_SECRETS_REMAINING\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status confirms that a retired IoT node has had its hardware key shredded and its certificate revoked from the cloud CA?",
          "expectedStringOutput": "DEVICE_DECOMMISSIONED_ZERO_SECRETS_REMAINING",
          "acceptableAnswers": [
            "DEVICE_DECOMMISSIONED_ZERO_SECRETS_REMAINING",
            "status\":\"DEVICE_DECOMMISSIONED_ZERO_SECRETS_REMAINING\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_DECOMMISSIONING_CRYPTO_ERASE_FACTORY_RESET",
          "diagnosisMap": {
            "INCOMPLETE": {
              "misconceptionId": "MC_IOTSEC_DECOMMISSIONING_CRYPTO_ERASE_FACTORY_RESET",
              "errorExplanation": "Key erasing and CA revocation complete the decommissioning process.",
              "recoveryPath": {
                "simplerExplanation": "Matches DEVICE_DECOMMISSIONED_ZERO_SECRETS_REMAINING.",
                "guidedFixPrompt": "Type DEVICE_DECOMMISSIONED_ZERO_SECRETS_REMAINING"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d27-b3-cryptographic-sanitization-proof",
        "day": 27,
        "blockNumber": 3,
        "title": "Cryptographic Certificate of Sanitization Generation",
        "conceptBudget": {
          "primaryConcept": "Sanitization Attestation Certificate",
          "supportingTerms": [
            "Hardware-Signed Sanitization Log",
            "Serial Number Binding",
            "Compliance Auditing (GDPR Right to be Forgotten & HIPAA Compliance)"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d27-b2-secure-key-shredding-mechanics",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "audit_cert_demo.js",
            "initialCode": "function generateSanitizationProof(deviceSerial) {\n  return `SANITIZATION_CERTIFICATE_ISSUED_SERIAL_${deviceSerial}_NIST_800_88_VERIFIED`;\n}\n\nconsole.log(generateSanitizationProof('METER_99402'));",
            "expectedOutput": "SANITIZATION_CERTIFICATE_ISSUED_SERIAL_METER_99402_NIST_800_88_VERIFIED",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What string format is produced for the audit-compliant sanitization proof of device `METER_99402`?",
          "expectedStringOutput": "SANITIZATION_CERTIFICATE_ISSUED_SERIAL_METER_99402_NIST_800_88_VERIFIED",
          "acceptableAnswers": [
            "SANITIZATION_CERTIFICATE_ISSUED_SERIAL_METER_99402_NIST_800_88_VERIFIED"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_DECOMMISSIONING_CRYPTO_ERASE_FACTORY_RESET",
          "diagnosisMap": {
            "INVALID": {
              "misconceptionId": "MC_IOTSEC_DECOMMISSIONING_CRYPTO_ERASE_FACTORY_RESET",
              "errorExplanation": "Matches SANITIZATION_CERTIFICATE_ISSUED_SERIAL_METER_99402_NIST_800_88_VERIFIED.",
              "recoveryPath": {
                "simplerExplanation": "Matches format string.",
                "guidedFixPrompt": "Type SANITIZATION_CERTIFICATE_ISSUED_SERIAL_METER_99402_NIST_800_88_VERIFIED"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 28,
    "title": "Remote Attestation & DICE / RIoT Hardware Architectures",
    "overviewMetaphor": "Remote Attestation is a Blood Test Sent to a Doctor: a cloud server needs to know if a smart pump has been infected with malware; the smart pump cannot simply say 'Trust me, I am fine' (Because compromised malware would just lie and say yes!); the Device Identifier Composition Engine (DICE / Trusted Computing Group) uses a hardware silicon engine to measure the cryptographic hash of each layer of boot code; the cloud server verifies the cryptographic measurement chain—proving the exact health of the device from hardware silicon to the running application.",
    "blocks": [
      {
        "id": "iotsec-d28-b1-dice-hardware-architecture",
        "day": 28,
        "blockNumber": 1,
        "title": "DICE Architecture: Unique Device Secret (UDS) & Compound Device Identifier (CDI)",
        "conceptBudget": {
          "primaryConcept": "DICE Layered Measurement Architecture",
          "supportingTerms": [
            "Unique Device Secret (UDS: Immutable hardware secret in silicon)",
            "Compound Device Identifier (CDI: $\\text{CDI} = \\text{KDF}(\\text{UDS}, \\text{SHA256}(\\text{Layer0\\_BootCode}))$)",
            "Layered Attestation (Modifying Layer 0 completely changes CDI $\\implies$ Compromised code cannot access original keys!)",
            "DICE Engine Silicon Isolation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d1-b1-hardware-root-of-trust-boot-rom",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "DICE Cryptographic Derivation Chain",
              "boxes": [
                {
                  "label": "1. Silicon Hardware Root",
                  "value": "Contains: UDS (Unique Device Secret) | Action: Computes CDI from Layer 0 code | Erases UDS from bus!",
                  "varType": "Hardware Silicon",
                  "isUpdated": false
                },
                {
                  "label": "2. Layer 0 (Bootloader)",
                  "value": "Holds: CDI keypair | Action: Measures Layer 1 (OS) -> Derives Alias Key | Erases CDI!",
                  "varType": "Layer 0",
                  "isUpdated": true
                },
                {
                  "label": "3. Layer 1 (Application)",
                  "value": "Holds: Device ID Certificate | Action: Signs cloud attestation challenges",
                  "varType": "Application",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "dice_derive_demo.js",
            "initialCode": "function deriveCdi(udsHex, layer0Hash) {\n  const cdi = `CDI_${udsHex.slice(0, 4)}_${layer0Hash.slice(0, 4)}`;\n  return {\n    compoundDeviceIdentifier: cdi,\n    udsErasedFromBus: true,\n    status: 'DICE_CDI_DERIVATION_COMPLETE'\n  };\n}\n\nconsole.log(JSON.stringify(deriveCdi('0xABCD1234', '0x99887766')));",
            "expectedOutput": "{\"compoundDeviceIdentifier\":\"CDI_0xAB_0x99\",\"udsErasedFromBus\":true,\"status\":\"DICE_CDI_DERIVATION_COMPLETE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is taken with the Unique Device Secret (UDS) immediately after deriving the Compound Device Identifier (CDI)?",
          "expectedStringOutput": "udsErasedFromBus\":true",
          "acceptableAnswers": [
            "udsErasedFromBus\":true",
            "true",
            "UDS is erased from bus",
            "Erased"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_REMOTE_ATTESTATION_DICE_RIoT_MEASUREMENT",
          "diagnosisMap": {
            "false": {
              "misconceptionId": "MC_IOTSEC_REMOTE_ATTESTATION_DICE_RIoT_MEASUREMENT",
              "errorExplanation": "DICE requires UDS to be locked and erased from the bus after CDI derivation.",
              "recoveryPath": {
                "simplerExplanation": "UDS is erased from the bus.",
                "guidedFixPrompt": "Type udsErasedFromBus\":true"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d28-b2-attestation-evidence-token",
        "day": 28,
        "blockNumber": 2,
        "title": "Attestation Evidence & Remote Challenge-Response Tokens (EAT / CWT)",
        "conceptBudget": {
          "primaryConcept": "Attestation Evidence Tokens (EAT / CWT)",
          "supportingTerms": [
            "Entity Attestation Token (EAT / RFC 9334)",
            "CBOR Web Token (CWT: Compact binary token for constrained networks)",
            "Cryptographic Nonce (Preventing replayed attestation tokens)",
            "Verifier / Relying Party Validation"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d28-b1-dice-hardware-architecture",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "eat_token_demo.js",
            "initialCode": "function evaluateAttestationToken(tokenValid, nonceMatches, codeHashClean) {\n  const isTrusted = tokenValid && nonceMatches && codeHashClean;\n  return {\n    tokenSignatureVerified: tokenValid,\n    freshnessNonceMatched: nonceMatches,\n    codeIntegrityAuthentic: codeHashClean,\n    attestationResult: isTrusted,\n    status: isTrusted ? 'REMOTE_ATTESTATION_DEVICE_INTEGRITY_PROVEN' : 'REMOTE_ATTESTATION_FAILED_UNTRUSTED_STATE'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateAttestationToken(true, true, true)));\nconsole.log(JSON.stringify(evaluateAttestationToken(true, true, false))); // Compromised code hash!",
            "expectedOutput": "{\"tokenSignatureVerified\":true,\"freshnessNonceMatched\":true,\"codeIntegrityAuthentic\":true,\"attestationResult\":true,\"status\":\"REMOTE_ATTESTATION_DEVICE_INTEGRITY_PROVEN\"}\n{\"tokenSignatureVerified\":true,\"freshnessNonceMatched\":true,\"codeIntegrityAuthentic\":false,\"attestationResult\":false,\"status\":\"REMOTE_ATTESTATION_FAILED_UNTRUSTED_STATE\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is awarded by the cloud verifier when a remote attestation token passes signature, nonce, and clean hash verification?",
          "expectedStringOutput": "REMOTE_ATTESTATION_DEVICE_INTEGRITY_PROVEN",
          "acceptableAnswers": [
            "REMOTE_ATTESTATION_DEVICE_INTEGRITY_PROVEN",
            "status\":\"REMOTE_ATTESTATION_DEVICE_INTEGRITY_PROVEN\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_REMOTE_ATTESTATION_DICE_RIoT_MEASUREMENT",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTSEC_REMOTE_ATTESTATION_DICE_RIoT_MEASUREMENT",
              "errorExplanation": "All checks passing proves device integrity.",
              "recoveryPath": {
                "simplerExplanation": "Matches REMOTE_ATTESTATION_DEVICE_INTEGRITY_PROVEN.",
                "guidedFixPrompt": "Type REMOTE_ATTESTATION_DEVICE_INTEGRITY_PROVEN"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d28-b3-zero-trust-cloud-access-policy",
        "day": 28,
        "blockNumber": 3,
        "title": "Zero-Trust Cloud Access Policy Binding",
        "conceptBudget": {
          "primaryConcept": "Zero-Trust Policy Enforcement",
          "supportingTerms": [
            "Continuous Attestation (Re-attesting every 6 hours)",
            "Dynamic Cloud IAM Scoping (Granting telemetry write permissions ONLY if attestation passes)",
            "Automated Device Quarantine on Attestation Drift"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d28-b2-attestation-evidence-token",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "zero_trust_policy_demo.js",
            "initialCode": "function evaluateCloudAccess(isAttested) {\n  return isAttested\n    ? 'ZERO_TRUST_POLICY: ACCESS_GRANTED_FULL_TELEMETRY_STREAMING'\n    : 'ZERO_TRUST_POLICY: ACCESS_REVOKED_QUARANTINE_ISOLATION';\n}\n\nconsole.log(evaluateCloudAccess(true));\nconsole.log(evaluateCloudAccess(false));",
            "expectedOutput": "ZERO_TRUST_POLICY: ACCESS_GRANTED_FULL_TELEMETRY_STREAMING\nZERO_TRUST_POLICY: ACCESS_REVOKED_QUARANTINE_ISOLATION",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What policy action is taken by the Zero-Trust Cloud Gateway when an IoT node fails its remote attestation check?",
          "expectedStringOutput": "ZERO_TRUST_POLICY: ACCESS_REVOKED_QUARANTINE_ISOLATION",
          "acceptableAnswers": [
            "ZERO_TRUST_POLICY: ACCESS_REVOKED_QUARANTINE_ISOLATION",
            "ACCESS_REVOKED"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_REMOTE_ATTESTATION_DICE_RIoT_MEASUREMENT",
          "diagnosisMap": {
            "GRANTED": {
              "misconceptionId": "MC_IOTSEC_REMOTE_ATTESTATION_DICE_RIoT_MEASUREMENT",
              "errorExplanation": "Failed attestation revokes access and isolates the device.",
              "recoveryPath": {
                "simplerExplanation": "Matches ZERO_TRUST_POLICY: ACCESS_REVOKED_QUARANTINE_ISOLATION.",
                "guidedFixPrompt": "Type ZERO_TRUST_POLICY: ACCESS_REVOKED_QUARANTINE_ISOLATION"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 29,
    "title": "Incident Response, Device Quarantine & Fleet Isolation",
    "overviewMetaphor": "Device Quarantine is an Automatic Fire Door Dropping in a Building: when a distributed denial-of-service botnet (like Mirai) infects 20 IP cameras in an industrial plant, the incident response engine detects abnormal outbound traffic; it does not wait for a human security guard to log in; the cloud orchestrator immediately drops a Quarantine Access Control List (ACL) on the edge router, disarms the physical actuator relays to prevent physical damage, and shuts down mesh radio routing—cutting off the infection before it reaches the power grid.",
    "blocks": [
      {
        "id": "iotsec-d29-b1-mirai-botnet-containment",
        "day": 29,
        "blockNumber": 1,
        "title": "Mirai & Mozi Botnet Propagation Containment",
        "conceptBudget": {
          "primaryConcept": "IoT Botnet Containment Dynamics",
          "supportingTerms": [
            "Mirai / Mozi Botnet Mechanics (Scanning Telnet/SSH `23/2323`, brute forcing default credentials)",
            "Worm Propagation Rate ($100,000\\text{ nodes in }3\\text{ hours}$)",
            "Network Micro-segmentation & Egress Rate Limiting"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d25-b1-can-bus-broadcast-vulnerabilities",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "memory_box",
              "title": "Normal Traffic vs Botnet Scanning Signature",
              "boxes": [
                {
                  "label": "1. Normal Node Traffic",
                  "value": "Outbound: 1 MQTT packet / 10 secs | Target: 1 Cloud IP | Ports: 8883 (TLS)",
                  "varType": "Normal Traffic",
                  "isUpdated": false
                },
                {
                  "label": "2. Infected Botnet Node",
                  "value": "Outbound: 850 TCP SYN / sec | Targets: Random Public IPs | Ports: 23, 2323, 8080 | Status: ATTACKING!",
                  "varType": "Infected Node",
                  "isUpdated": true
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "botnet_contain_demo.js",
            "initialCode": "function evaluateBotnetSignature(synPacketsPerSec) {\n  return synPacketsPerSec > 100\n    ? 'BOTNET_SCANNING_SIGNATURE_DETECTED: ENGAGE_EMERGENCY_QUARANTINE'\n    : 'NETWORK_TRAFFIC_BEHAVIOR_NOMINAL';\n}\n\nconsole.log(evaluateBotnetSignature(2));\nconsole.log(evaluateBotnetSignature(850));",
            "expectedOutput": "NETWORK_TRAFFIC_BEHAVIOR_NOMINAL\nBOTNET_SCANNING_SIGNATURE_DETECTED: ENGAGE_EMERGENCY_QUARANTINE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What action is triggered when an IoT node generates 850 TCP SYN scan packets per second?",
          "expectedStringOutput": "BOTNET_SCANNING_SIGNATURE_DETECTED: ENGAGE_EMERGENCY_QUARANTINE",
          "acceptableAnswers": [
            "BOTNET_SCANNING_SIGNATURE_DETECTED: ENGAGE_EMERGENCY_QUARANTINE",
            "BOTNET_SCANNING_SIGNATURE_DETECTED"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_INCIDENT_ISOLATION_QUARANTINE_HEURISTICS",
          "diagnosisMap": {
            "NOMINAL": {
              "misconceptionId": "MC_IOTSEC_INCIDENT_ISOLATION_QUARANTINE_HEURISTICS",
              "errorExplanation": "High SYN packet rates indicate active worm propagation.",
              "recoveryPath": {
                "simplerExplanation": "Triggers emergency quarantine.",
                "guidedFixPrompt": "Type BOTNET_SCANNING_SIGNATURE_DETECTED: ENGAGE_EMERGENCY_QUARANTINE"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d29-b2-quarantine-acl-actuator-disarm",
        "day": 29,
        "blockNumber": 2,
        "title": "Automated Quarantine ACLs & Physical Actuator Disarm",
        "conceptBudget": {
          "primaryConcept": "Quarantine ACLs & Fail-Safe Disarm",
          "supportingTerms": [
            "Network Quarantine State (`DENY ALL` except remediation OTA server)",
            "Fail-Safe Actuator Disarm (De-energizing high-voltage relays to safe state)",
            "Zigbee / Thread Mesh Node Blacklisting"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d29-b1-mirai-botnet-containment",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "syntax_anatomy",
            "title": "Quarantine State Actions",
            "codeSnippet": "if (device_is_quarantined) {\n  gpio_write(RELAY_POWER_PIN, RELAY_SAFE_DISARM); // Disarms motors and heaters!\n  firewall_set_mode(FIREWALL_QUARANTINE_OTA_ONLY); // Blocks all traffic except recovery!\n}",
            "lineNotes": {
              "2": "Sets physical relays to safe state.",
              "3": "Locks firewall to OTA recovery only."
            }
          },
          {
            "type": "runnable_code",
            "filename": "quarantine_action_demo.js",
            "initialCode": "function executeQuarantineAction(isCompromised) {\n  return isCompromised\n    ? 'QUARANTINE_ACTIVE: ACTUATORS_DISARMED_NETWORK_ISOLATED_OTA_ONLY'\n    : 'DEVICE_OPERATIONAL_NOMINAL';\n}\n\nconsole.log(executeQuarantineAction(true));\nconsole.log(executeQuarantineAction(false));",
            "expectedOutput": "QUARANTINE_ACTIVE: ACTUATORS_DISARMED_NETWORK_ISOLATED_OTA_ONLY\nDEVICE_OPERATIONAL_NOMINAL",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What protective state is entered by an actuator-connected IoT node upon receiving a quarantine isolation command?",
          "expectedStringOutput": "QUARANTINE_ACTIVE: ACTUATORS_DISARMED_NETWORK_ISOLATED_OTA_ONLY",
          "acceptableAnswers": [
            "QUARANTINE_ACTIVE: ACTUATORS_DISARMED_NETWORK_ISOLATED_OTA_ONLY",
            "QUARANTINE_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_INCIDENT_ISOLATION_QUARANTINE_HEURISTICS",
          "diagnosisMap": {
            "OPERATIONAL": {
              "misconceptionId": "MC_IOTSEC_INCIDENT_ISOLATION_QUARANTINE_HEURISTICS",
              "errorExplanation": "Compromised state disarms actuators and isolates the node.",
              "recoveryPath": {
                "simplerExplanation": "Matches QUARANTINE_ACTIVE: ACTUATORS_DISARMED_NETWORK_ISOLATED_OTA_ONLY.",
                "guidedFixPrompt": "Type QUARANTINE_ACTIVE: ACTUATORS_DISARMED_NETWORK_ISOLATED_OTA_ONLY"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d29-b3-fleet-remediation-ota-recovery",
        "day": 29,
        "blockNumber": 3,
        "title": "Automated Fleet Incident Remediation & Recovery Pipelines",
        "conceptBudget": {
          "primaryConcept": "Fleet Remediation Pipeline",
          "supportingTerms": [
            "Targeted Emergency Hotfix Push",
            "Cryptographic Post-Patch Re-Attestation",
            "Restoring Operational Network Status"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d29-b2-quarantine-acl-actuator-disarm",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "remediation_demo.js",
            "initialCode": "function evaluateRemediation(patchFlashed, attestationClean) {\n  const isRestored = patchFlashed && attestationClean;\n  return {\n    emergencyPatchApplied: patchFlashed,\n    postPatchAttestationPassed: attestationClean,\n    fleetStatus: isRestored ? 'DEVICE_RESTORED_TO_FLEET_GOOD_STANDING' : 'REMAINS_IN_QUARANTINE'\n  };\n}\n\nconsole.log(JSON.stringify(evaluateRemediation(true, true)));",
            "expectedOutput": "{\"emergencyPatchApplied\":true,\"postPatchAttestationPassed\":true,\"fleetStatus\":\"DEVICE_RESTORED_TO_FLEET_GOOD_STANDING\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What status is restored to a quarantined IoT node once the emergency patch is flashed and clean remote attestation is verified?",
          "expectedStringOutput": "DEVICE_RESTORED_TO_FLEET_GOOD_STANDING",
          "acceptableAnswers": [
            "DEVICE_RESTORED_TO_FLEET_GOOD_STANDING",
            "fleetStatus\":\"DEVICE_RESTORED_TO_FLEET_GOOD_STANDING\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_INCIDENT_ISOLATION_QUARANTINE_HEURISTICS",
          "diagnosisMap": {
            "QUARANTINE": {
              "misconceptionId": "MC_IOTSEC_INCIDENT_ISOLATION_QUARANTINE_HEURISTICS",
              "errorExplanation": "Clean attestation restores the node to good standing.",
              "recoveryPath": {
                "simplerExplanation": "Matches DEVICE_RESTORED_TO_FLEET_GOOD_STANDING.",
                "guidedFixPrompt": "Type DEVICE_RESTORED_TO_FLEET_GOOD_STANDING"
              }
            }
          }
        }
      }
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Industrial Zero-Trust Fleet Security & Lifecycle Orchestrator",
    "overviewMetaphor": "The Industrial Zero-Trust Security Capstone is a Fortified Space Station Orbiting Earth: every single layer of security works in unified cryptographic harmony: 1. Silicon Root of Trust boot verification; 2. AES-XTS encrypted flash storage; 3. Monotonic eFuse anti-rollback version control; 4. Mutual TLS 1.3 encrypted telemetry; 5. CAN/Modbus deep packet inspection anomaly detectors; 6. Remote Attestation DICE measurement chains proving complete device integrity.",
    "blocks": [
      {
        "id": "iotsec-d30-b1-zero-trust-ecosystem-synthesis",
        "day": 30,
        "blockNumber": 1,
        "title": "Industrial Zero-Trust Security Ecosystem Synthesis",
        "conceptBudget": {
          "primaryConcept": "Industrial Zero-Trust Security Synthesis",
          "supportingTerms": [
            "Hardware Root of Trust Boot Validation",
            "Dual-Slot A/B Anti-Rollback OTA",
            "TrustZone SAU Isolation",
            "DICE Attestation Chains"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d29-b3-fleet-remediation-ota-recovery",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "diagram",
            "data": {
              "type": "flowchart",
              "title": "Day 30 Final Capstone Architecture",
              "nodes": [
                {
                  "id": "1",
                  "label": "Silicon Boot: Masked ROM checks ECDSA signature against eFuse root hash",
                  "kind": "start"
                },
                {
                  "id": "2",
                  "label": "Runtime Isolation: ARM TrustZone SAU separates crypto vault from user RTOS",
                  "kind": "process"
                },
                {
                  "id": "3",
                  "label": "Transport Security: mTLS TLS 1.3 transmits telemetry with AES-256-GCM",
                  "kind": "process"
                },
                {
                  "id": "4",
                  "label": "Continuous Attestation: DICE measurement chains prove health to cloud orchestrator!",
                  "kind": "end"
                }
              ]
            }
          },
          {
            "type": "runnable_code",
            "filename": "zero_trust_orchestrator_demo.js",
            "initialCode": "function runZeroTrustSecurityOrchestrator() {\n  return {\n    secureBootStatus: 'HARDWARE_ROOT_HASH_VERIFIED',\n    flashEncryptionStatus: 'AES_XTS_BUS_SCRAMBLED',\n    antiRollbackStatus: 'MONOTONIC_EFUSE_LOCKED',\n    mscTlsStatus: 'TLS_1_3_MUTUAL_AUTH_ACTIVE',\n    idsStatus: 'CAN_MODBUS_IDS_CLEAN',\n    remoteAttestationStatus: 'DICE_CHAIN_PROVEN',\n    engineStatus: 'INDUSTRIAL_ZERO_TRUST_FLEET_SECURITY_ACTIVE'\n  };\n}\n\nconsole.log(runZeroTrustSecurityOrchestrator().engineStatus);",
            "expectedOutput": "INDUSTRIAL_ZERO_TRUST_FLEET_SECURITY_ACTIVE",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What engine status confirms active operational synthesis of the Industrial Zero-Trust Fleet Security Master Orchestrator?",
          "expectedStringOutput": "INDUSTRIAL_ZERO_TRUST_FLEET_SECURITY_ACTIVE",
          "acceptableAnswers": [
            "INDUSTRIAL_ZERO_TRUST_FLEET_SECURITY_ACTIVE",
            "engineStatus: INDUSTRIAL_ZERO_TRUST_FLEET_SECURITY_ACTIVE"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_CAPSTONE_INDUSTRIAL_ZERO_TRUST_FLEET_SECURITY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTSEC_CAPSTONE_INDUSTRIAL_ZERO_TRUST_FLEET_SECURITY",
              "errorExplanation": "Matches INDUSTRIAL_ZERO_TRUST_FLEET_SECURITY_ACTIVE.",
              "recoveryPath": {
                "simplerExplanation": "Matches INDUSTRIAL_ZERO_TRUST_FLEET_SECURITY_ACTIVE.",
                "guidedFixPrompt": "Type INDUSTRIAL_ZERO_TRUST_FLEET_SECURITY_ACTIVE"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d30-b2-capstone-quality-audit",
        "day": 30,
        "blockNumber": 2,
        "title": "Industrial Zero-Trust Security Mastery & Quality Invariant Audit",
        "conceptBudget": {
          "primaryConcept": "Capstone Quality Audit",
          "supportingTerms": [
            "6/6 Security Invariants Active",
            "Zero Exploit Surfaces",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d30-b1-zero-trust-ecosystem-synthesis",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "capstone_audit_demo.js",
            "initialCode": "function auditCapstoneSystem(invariantsActiveCount) {\n  const passed = (invariantsActiveCount === 6);\n  return {\n    invariantsVerified: `${invariantsActiveCount}/6`,\n    grade: passed ? 'INDUSTRIAL_ZERO_TRUST_SECURITY_AUDIT_PASSED' : 'AUDIT_DEFECT'\n  };\n}\n\nconsole.log(JSON.stringify(auditCapstoneSystem(6)));",
            "expectedOutput": "{\"invariantsVerified\":\"6/6\",\"grade\":\"INDUSTRIAL_ZERO_TRUST_SECURITY_AUDIT_PASSED\"}",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What audit grade is awarded when all 6 core security invariants are verified active?",
          "expectedStringOutput": "INDUSTRIAL_ZERO_TRUST_SECURITY_AUDIT_PASSED",
          "acceptableAnswers": [
            "INDUSTRIAL_ZERO_TRUST_SECURITY_AUDIT_PASSED",
            "grade\":\"INDUSTRIAL_ZERO_TRUST_SECURITY_AUDIT_PASSED\""
          ],
          "primaryMisconceptionId": "MC_IOTSEC_CAPSTONE_INDUSTRIAL_ZERO_TRUST_FLEET_SECURITY",
          "diagnosisMap": {
            "DEFECT": {
              "misconceptionId": "MC_IOTSEC_CAPSTONE_INDUSTRIAL_ZERO_TRUST_FLEET_SECURITY",
              "errorExplanation": "6/6 invariants award INDUSTRIAL_ZERO_TRUST_SECURITY_AUDIT_PASSED.",
              "recoveryPath": {
                "simplerExplanation": "Awards INDUSTRIAL_ZERO_TRUST_SECURITY_AUDIT_PASSED.",
                "guidedFixPrompt": "Type INDUSTRIAL_ZERO_TRUST_SECURITY_AUDIT_PASSED"
              }
            }
          }
        }
      },
      {
        "id": "iotsec-d30-b3-iotsec-master-cert",
        "day": 30,
        "blockNumber": 3,
        "title": "Industrial IoT Security & Device Lifecycle Master Certification",
        "conceptBudget": {
          "primaryConcept": "Master Certification",
          "supportingTerms": [
            "Industrial IoT Security Master Certified",
            "100% Quality Invariant"
          ]
        },
        "prerequisiteThresholds": [
          {
            "conceptId": "iotsec-d30-b2-capstone-quality-audit",
            "requiredLevel": "understood"
          }
        ],
        "media": [
          {
            "type": "runnable_code",
            "filename": "iotsec_master_cert.js",
            "initialCode": "console.log('🏆 FINAL CAPSTONE: Industrial Zero-Trust Fleet Security & Device Lifecycle Engine [CERTIFIED 100%]');",
            "expectedOutput": "🏆 FINAL CAPSTONE: Industrial Zero-Trust Fleet Security & Device Lifecycle Engine [CERTIFIED 100%]",
            "editable": false
          }
        ],
        "diagnosticCheck": {
          "type": "predict_output",
          "question": "What certification string confirms completion of the Industrial IoT Security & Device Lifecycle Master Curriculum?",
          "expectedStringOutput": "🏆 FINAL CAPSTONE: Industrial Zero-Trust Fleet Security & Device Lifecycle Engine [CERTIFIED 100%]",
          "acceptableAnswers": [
            "🏆 FINAL CAPSTONE: Industrial Zero-Trust Fleet Security & Device Lifecycle Engine [CERTIFIED 100%]",
            "CERTIFIED 100%"
          ],
          "primaryMisconceptionId": "MC_IOTSEC_CAPSTONE_INDUSTRIAL_ZERO_TRUST_FLEET_SECURITY",
          "diagnosisMap": {
            "FAILED": {
              "misconceptionId": "MC_IOTSEC_CAPSTONE_INDUSTRIAL_ZERO_TRUST_FLEET_SECURITY",
              "errorExplanation": "Matches capstone header string.",
              "recoveryPath": {
                "simplerExplanation": "Matches header string.",
                "guidedFixPrompt": "Type 🏆 FINAL CAPSTONE: Industrial Zero-Trust Fleet Security & Device Lifecycle Engine [CERTIFIED 100%]"
              }
            }
          }
        }
      }
    ]
  }
];
