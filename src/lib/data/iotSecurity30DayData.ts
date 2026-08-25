import { buildEnrichedDayQuests, DayConfig } from './curriculumEnricher';
import { CourseQuest } from './coursesData';

export const IOT_SECURITY_30_DAYS_CONFIGS: DayConfig[] = [
  {
    "day": 1,
    "title": "Introduction to IoT Security — Hardware Root of Trust, Secure Boot and Digital Signatures",
    "desc": "Master physical attack surfaces: Hardware Root of Trust (Secure Element / TPM), Boot ROM execution chain, RSA/ECDSA digital signatures, and preventing unauthenticated firmware execution.",
    "syllabus": [
      "IoT Security Threats: Physical access, bus tapping, JTAG extraction, and remote hijacked firmware.",
      "Hardware Root of Trust: Silicon-embedded immutable public key digests.",
      "Secure Boot Execution Flow: Boot ROM -> BL2 -> Application firmware digital signature verification."
    ],
    "eTitle": "Secure Boot Digital Signature & Public Key Hash Validator",
    "eDesc": "Implement function verifySecureBootStage(firmwareHashHex, signatureHex, trustedPublicKeyHashHex, calculatedKeyHashHex) verifying cryptographic signature match and public key authenticity.",
    "eStarter": "function verifySecureBootStage(fwHash, sig, rootKeyHash, calcKeyHash) {\n  const isKeyTrusted = (rootKeyHash === calcKeyHash);\n  // Simulate cryptographic ECDSA signature check\n  const isSigValid = (sig.length >= 64) && (fwHash.length === 64);\n  const bootPermitted = isKeyTrusted && isSigValid;\n  return {\n    publicKeyAuthentic: isKeyTrusted,\n    signatureValid: isSigValid,\n    bootPermitted,\n    status: bootPermitted ? 'SECURE_BOOT_STAGE_VERIFIED_AUTHENTIC' : 'SECURE_BOOT_VIOLATION_TAMPERED_FIRMWARE'\n  };\n}",
    "eHint": "Verify rootKeyHash === calcKeyHash and signature/hash length constraints.",
    "eTest": "const ok = verifySecureBootStage('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '3045022100a89f81d11b666a9a08f8e02d6b38a4d7d13b4826b6f7902d1847e7048f022026', '0xTRUSTED_ROOT_HASH_99', '0xTRUSTED_ROOT_HASH_99');\nconst fail = verifySecureBootStage('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '3045022100a89f81d11b666a9a08f8e02d6b38a4d7d13b4826b6f7902d1847e7048f022026', '0xTRUSTED_ROOT_HASH_99', '0xATTACKER_FAKE_KEY');\nif (!ok.bootPermitted || fail.bootPermitted || fail.status !== 'SECURE_BOOT_VIOLATION_TAMPERED_FIRMWARE') throw new Error('Secure boot validation failed');",
    "aTitle": "Key Hash Prefix Check",
    "aDesc": "Implement function checkKeyHashPrefix(hashHex) returning `hashHex.startsWith('0x')`.",
    "aStarter": "function checkKeyHashPrefix(h) { return h.startsWith('0x'); }",
    "aHint": "Check if hash starts with '0x'.",
    "aTest": "if (!checkKeyHashPrefix('0xABCD') || checkKeyHashPrefix('ABCD')) throw new Error('Prefix check failed');"
  },
  {
    "day": 2,
    "title": "Symmetric Encryption — AES Cipher Basics, Blocks and Initialization Vectors",
    "desc": "Protect telemetry and stored assets: AES-128/256 Block Ciphers (16-byte blocks), Modes of Operation (ECB vs CBC vs CTR vs GCM), and Initialization Vector (IV) randomness constraints.",
    "syllabus": [
      "AES Block Architecture: 128-bit (16-byte) blocks with SubBytes, ShiftRows, MixColumns, AddRoundKey.",
      "ECB Vulnerability: Never use ECB; identical plaintext blocks generate identical ciphertext!",
      "Initialization Vectors (IV): 16-byte nonce ensuring semantic security across repeated messages."
    ],
    "eTitle": "AES-CBC Block Padding & IV Uniqueness Validator",
    "eDesc": "Implement function validateAesCbcParams(payloadSizeBytes, ivSizeBytes, keySizeBytes) enforcing AES-CBC PKCS#7 block size rules.",
    "eStarter": "function validateAesCbcParams(payloadBytes, ivBytes, keyBytes) {\n  const isIvValid = (ivBytes === 16); // Must be exactly 16 bytes (128 bits)\n  const isKeyValid = (keyBytes === 16 || keyBytes === 32); // AES-128 or AES-256\n  const padNeeded = 16 - (payloadBytes % 16);\n  const totalEncryptedBytes = payloadBytes + padNeeded;\n  const isConfigValid = isIvValid && isKeyValid;\n  return {\n    pkcs7PaddingBytes: padNeeded,\n    totalCiphertextBytes: totalEncryptedBytes,\n    isIvValid,\n    isKeyValid,\n    status: isConfigValid ? 'AES_CBC_CONFIGURATION_VALID' : 'INVALID_CIPHER_PARAMETERS'\n  };\n}",
    "eHint": "Check ivBytes === 16, keyBytes in [16, 32], and padNeeded = 16 - (payload % 16).",
    "eTest": "const ok = validateAesCbcParams(20, 16, 32); // 20 bytes -> 12 bytes pad -> 32 total\nconst badIv = validateAesCbcParams(20, 8, 32); // Bad IV (8 bytes)\nif (ok.pkcs7PaddingBytes !== 12 || ok.totalCiphertextBytes !== 32 || !ok.isIvValid || badIv.isIvValid) throw new Error('AES CBC validation failed');",
    "aTitle": "IV Padding Size Indicator",
    "aDesc": "Implement function getPkcs7PaddingSize(len) returning `16 - (len % 16)`.",
    "aStarter": "function getPkcs7PaddingSize(l) { return 16 - (l % 16); }",
    "aHint": "Compute 16 - (l % 16).",
    "aTest": "if (getPkcs7PaddingSize(10) !== 6 || getPkcs7PaddingSize(16) !== 16) throw new Error('PKCS7 padding failed');"
  },
  {
    "day": 3,
    "title": "Authenticated Encryption (AEAD): AES-GCM & Poly1305 Integrity",
    "desc": "Prevent ciphertext bit-flipping attacks: Authenticated Encryption with Associated Data (AEAD), Galois/Counter Mode (AES-GCM), 12-byte IV nonce, and 16-byte Authentication Tag ($T$).",
    "syllabus": [
      "The Bit-Flipping Threat: Unauthenticated encryption (CBC/CTR) allows attackers to modify ciphertext unnoticed.",
      "AES-GCM Construction: CTR mode encryption + GHASH Galois field authentication tag.",
      "12-byte Nonce Invariant: Reusing an IV with the same key catastrophically destroys GCM authenticity!"
    ],
    "eTitle": "AES-GCM Authenticated Encryption Header & Tag Verifier",
    "eDesc": "Implement function verifyAesGcmPacket(ivSizeBytes, tagSizeBytes, aadBytesCount, receivedTagHex, computedTagHex) verifying AEAD integrity.",
    "eStarter": "function verifyAesGcmPacket(ivBytes, tagBytes, aadBytes, rxTag, calcTag) {\n  const isIvStandard = (ivBytes === 12); // Standard 96-bit GCM nonce\n  const isTagStandard = (tagBytes === 16); // 128-bit authentication tag\n  const isTagMatched = (rxTag === calcTag);\n  const isAuthentic = isIvStandard && isTagStandard && isTagMatched;\n  return {\n    ivStandard: isIvStandard,\n    tagStandard: isTagStandard,\n    tagMatched: isTagMatched,\n    payloadAuthentic: isAuthentic,\n    status: isAuthentic ? 'AEAD_GCM_INTEGRITY_VERIFIED' : 'AUTHENTICATION_TAG_MISMATCH_DATA_COMPROMISED'\n  };\n}",
    "eHint": "Verify ivBytes === 12, tagBytes === 16, and rxTag === calcTag.",
    "eTest": "const ok = verifyAesGcmPacket(12, 16, 24, '0xTAG_AABBCC', '0xTAG_AABBCC');\nconst badTag = verifyAesGcmPacket(12, 16, 24, '0xTAG_AABBCC', '0xTAG_FORGED');\nif (!ok.payloadAuthentic || badTag.payloadAuthentic || badTag.status !== 'AUTHENTICATION_TAG_MISMATCH_DATA_COMPROMISED') throw new Error('AES-GCM verification failed');",
    "aTitle": "GCM Nonce Length Checker",
    "aDesc": "Implement function isStandardGcmNonce(bytes) returning `bytes === 12`.",
    "aStarter": "function isStandardGcmNonce(b) { return b === 12; }",
    "aHint": "Check bytes === 12.",
    "aTest": "if (!isStandardGcmNonce(12) || isStandardGcmNonce(16)) throw new Error('Nonce check failed');"
  },
  {
    "day": 4,
    "title": "Asymmetric Cryptography: ECC, ECDSA and Ed25519 in Constrained Silicon",
    "desc": "Eliminate symmetric key distribution bottlenecks: Elliptic Curve Cryptography (ECC), NIST P-256 vs Curve25519, Public/Private key pairs, ECDSA Digital Signatures, and ECDH Key Exchange.",
    "syllabus": [
      "ECC vs RSA Efficiency: 256-bit ECC matches the security of 3072-bit RSA with 90% less RAM and CPU power!",
      "ECDSA Signature Generation: $(r, s)$ coordinates computed over SHA-256 message digests.",
      "Ephemeral ECDH: Deriving shared session keys over untrusted wireless channels."
    ],
    "eTitle": "ECDSA P-256 Signature Coordinate & Hash Verifier",
    "eDesc": "Implement function verifyEcdsaCoordinates(rHex, sHex, hashHex, curveOrderN) validating ECDSA mathematical bounds.",
    "eStarter": "function verifyEcdsaCoordinates(r, s, hash, orderN = '0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551') {\n  const isRLen = (r.length === 64); // 32 bytes hex\n  const isSLen = (s.length === 64); // 32 bytes hex\n  const isHashLen = (hash.length === 64); // SHA-256 digest\n  const validBounds = isRLen && isSLen && isHashLen;\n  return {\n    rCoordinateValid: isRLen,\n    sCoordinateValid: isSLen,\n    digestValid: isHashLen,\n    signatureValid: validBounds,\n    status: validBounds ? 'ECDSA_COORDINATES_WITHIN_CURVE_ORDER' : 'INVALID_ECDSA_SIGNATURE_COORDINATES'\n  };\n}",
    "eHint": "Verify r, s, and hash lengths are 64 hex characters (32 bytes).",
    "eTest": "const dummyCoord = 'a'.repeat(64);\nconst ok = verifyEcdsaCoordinates(dummyCoord, dummyCoord, dummyCoord);\nconst bad = verifyEcdsaCoordinates('1234', dummyCoord, dummyCoord);\nif (!ok.signatureValid || bad.signatureValid || ok.status !== 'ECDSA_COORDINATES_WITHIN_CURVE_ORDER') throw new Error('ECDSA coordinates validation failed');",
    "aTitle": "ECC vs RSA Key Size Ratio Calculator",
    "aDesc": "Implement function getEccKeySavingsRatio(rsaBits = 3072, eccBits = 256) returning `Number((rsaBits / eccBits).toFixed(1))`.",
    "aStarter": "function getEccKeySavingsRatio(r = 3072, e = 256) { return Number((r / e).toFixed(1)); }",
    "aHint": "Divide rsaBits by eccBits.",
    "aTest": "if (getEccKeySavingsRatio(3072, 256) !== 12.0) throw new Error('ECC ratio failed');"
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: Complete Hardware Root of Trust & Secure Boot Verification Engine",
    "desc": "Milestone 1: Build a production embedded Secure Boot engine: hardware public key digest comparison, ECDSA firmware signature verification, SHA-256 image hashing, and tamper protection lockdown.",
    "syllabus": [
      "Bootloader stage transition validation.",
      "Cryptographic integrity chain from Silicon to Application.",
      "Hardware Root of Trust production invariants."
    ],
    "eTitle": "Hardware Root of Trust Secure Boot Master Kernel",
    "eDesc": "Implement function executeSecureBootKernel(siliconRootHash, certPublicKeyHash, firmwarePayloadHash, ecdsaSignature) validating complete cryptographic boot chain.",
    "eStarter": "function executeSecureBootKernel(rootHash, certKeyHash, fwHash, sig) {\n  const rootMatch = (rootHash === certKeyHash);\n  const sigValid = (sig.length >= 64) && (fwHash.length === 64);\n  const stage1Pass = rootMatch;\n  const stage2Pass = sigValid;\n  const allowBoot = stage1Pass && stage2Pass;\n  return {\n    stage1RootKeyVerified: stage1Pass,\n    stage2FirmwareVerified: stage2Pass,\n    executionPermitted: allowBoot,\n    bootloaderState: allowBoot ? 'SECURE_BOOT_CHAIN_LOCKED_AND_VERIFIED' : 'HARDWARE_TAMPER_LOCKDOWN_HALT'\n  };\n}",
    "eHint": "Verify rootHash === certKeyHash and signature/hash lengths.",
    "eTest": "const dummyFw = 'b'.repeat(64);\nconst dummySig = 'c'.repeat(64);\nconst ok = executeSecureBootKernel('0xROOT_KEY_99', '0xROOT_KEY_99', dummyFw, dummySig);\nconst fail = executeSecureBootKernel('0xROOT_KEY_99', '0xBAD_KEY', dummyFw, dummySig);\nif (!ok.executionPermitted || fail.executionPermitted || ok.bootloaderState !== 'SECURE_BOOT_CHAIN_LOCKED_AND_VERIFIED') throw new Error('Milestone 1 Secure Boot failed');",
    "aTitle": "Boot Chain Stage Count Formatter",
    "aDesc": "Implement function formatBootChainStages(stages) returning `${stages} stages verified in chain`.",
    "aStarter": "function formatBootChainStages(s) { return `${s} stages verified in chain`; }",
    "aHint": "Format string.",
    "aTest": "if (formatBootChainStages(3) !== '3 stages verified in chain') throw new Error('Boot stage format failed');"
  },
  {
    "day": 6,
    "title": "Anti-Rollback Protection: Monotonic Counters & One-Time Programmable (eFuse) Silicon",
    "desc": "Prevent firmware downgrade attacks: Downgrade Exploit Mechanics (Flash older vulnerable firmware to re-enable patched CVEs), Monotonic hardware counters, and OTP eFuse bit burning ($V_{\\text{prog}} = 2.5\\text{ V}$).",
    "syllabus": [
      "The Downgrade Attack Vector: Hackers flashing firmware v1.0 over patched v2.0 to exploit known buffer overflows.",
      "Hardware Monotonic Counters: Non-volatile silicon registers that can ONLY increment, never decrement.",
      "eFuse Bit Burning: Permanently vaporizing physical microscopic silicon fuses to record minimum allowed firmware version."
    ],
    "eTitle": "eFuse Monotonic Anti-Rollback Version Validator",
    "eDesc": "Implement function validateAntiRollbackVersion(currentEfuseVersion, incomingFirmwareVersion) permitting boot only if firmware version >= eFuse version.",
    "eStarter": "function validateAntiRollbackVersion(efuseVer, incomingVer) {\n  const isDowngrade = incomingVer < efuseVer;\n  const needsEfuseBurn = incomingVer > efuseVer;\n  const permitBoot = !isDowngrade;\n  return {\n    efuseHardwareVersion: efuseVer,\n    incomingFirmwareVersion: incomingVer,\n    isDowngradeAttack: isDowngrade,\n    burnNewEfuseBitRequired: needsEfuseBurn,\n    permitBoot,\n    status: isDowngrade ? 'SECURITY_ROLLBACK_ATTACK_REJECTED' : (needsEfuseBurn ? 'UPGRADE_PERMITTED_BURN_EFUSE' : 'SAME_VERSION_PERMITTED')\n  };\n}",
    "eHint": "Check if incomingVer < efuseVer (downgrade) or incomingVer > efuseVer (upgrade).",
    "eTest": "const okSame = validateAntiRollbackVersion(3, 3);\nconst okUp = validateAntiRollbackVersion(3, 4);\nconst failDown = validateAntiRollbackVersion(3, 2);\nif (!okSame.permitBoot || !okUp.permitBoot || failDown.permitBoot || failDown.status !== 'SECURITY_ROLLBACK_ATTACK_REJECTED') throw new Error('Anti-rollback validation failed');",
    "aTitle": "eFuse Bits Burned Counter",
    "aDesc": "Implement function getEfuseBitsCount(version) returning `version`.",
    "aStarter": "function getEfuseBitsCount(v) { return v; }",
    "aHint": "Return version integer.",
    "aTest": "if (getEfuseBitsCount(5) !== 5) throw new Error('eFuse count failed');"
  },
  {
    "day": 7,
    "title": "Device Identity & X.509 Certificates: PKI, CAs and Device Provisioning",
    "desc": "Provision zero-trust device identities: Public Key Infrastructure (PKI), Certificate Authorities (Root CA, Intermediate CA), X.509 ASN.1 certificate structure, Common Name (CN), and Validity Windows.",
    "syllabus": [
      "Device Identity Invariant: Hardcoded passwords in firmware leak immediately; X.509 client certificates provide unique unforgeable IDs.",
      "Certificate Chain of Trust: Root CA -> Sub-CA -> Device End-Entity Certificate.",
      "ASN.1 DER/PEM Encoding & SAN (Subject Alternative Name) verification."
    ],
    "eTitle": "X.509 Certificate Validity Window & Subject Validator",
    "eDesc": "Implement function validateX509Certificate(certNotBefore, certNotAfter, currentTimestamp, subjectCn, expectedDeviceUid) verifying certificate temporal validity and identity match.",
    "eStarter": "function validateX509Certificate(notBefore, notAfter, now, subjectCn, expectedUid) {\n  const isNotExpired = (now >= notBefore) && (now <= notAfter);\n  const isSubjectMatched = (subjectCn === expectedUid);\n  const isValid = isNotExpired && isSubjectMatched;\n  return {\n    isTemporalValid: isNotExpired,\n    isSubjectMatched,\n    certificateValid: isValid,\n    status: isValid ? 'X509_CERTIFICATE_AUTHENTIC_AND_VALID' : (!isNotExpired ? 'CERTIFICATE_EXPIRED_OR_NOT_YET_VALID' : 'SUBJECT_IDENTITY_MISMATCH')\n  };\n}",
    "eHint": "Verify now is between notBefore and notAfter, and subjectCn === expectedUid.",
    "eTest": "const ok = validateX509Certificate(1000, 2000, 1500, 'DEVICE_001', 'DEVICE_001');\nconst exp = validateX509Certificate(1000, 2000, 2500, 'DEVICE_001', 'DEVICE_001');\nif (!ok.certificateValid || exp.certificateValid || exp.status !== 'CERTIFICATE_EXPIRED_OR_NOT_YET_VALID') throw new Error('X.509 validation failed');",
    "aTitle": "Certificate Lifetime Days Calculator",
    "aDesc": "Implement function getCertLifetimeDays(notBeforeSec, notAfterSec) returning `Math.floor((notAfterSec - notBeforeSec) / 86400)`.",
    "aStarter": "function getCertLifetimeDays(nb, na) { return Math.floor((na - nb) / 86400); }",
    "aHint": "Compute (na - nb) / 86400.",
    "aTest": "if (getCertLifetimeDays(0, 864000) !== 10) throw new Error('Cert lifetime failed');"
  },
  {
    "day": 8,
    "title": "Secure Elements (SE) & Hardware Security Modules (TPM 2.0)",
    "desc": "Isolate cryptographic keys in physical silicon vaults: ATECC608A / SE050 Secure Elements, TPM 2.0 Platform Configuration Registers (PCRs), I2C encrypted bus commands, and Private Key Non-Exportability.",
    "syllabus": [
      "Secure Element Invariant: Private keys are generated INSIDE the secure element and CANNOT be read out by software or JTAG.",
      "Hardware Crypto Offload: AES, ECDSA, and ECDH executed inside tamper-resistant silicon.",
      "TPM 2.0 PCR Banks: Measuring boot binaries into SHA-256 hash chains."
    ],
    "eTitle": "TPM 2.0 Platform Configuration Register (PCR) Hash Extender",
    "eDesc": "Implement function extendTpmPcr(currentPcrHex, measurementDigestHex) simulating TPM `PCR[n] = SHA256(PCR[n] || Measurement)` hash extension.",
    "eStarter": "function extendTpmPcr(currPcr, measurement) {\n  // In real TPM: newPcr = sha256(currPcr + measurement)\n  const extendedString = `EXTENDED_${currPcr.slice(0, 10)}_${measurement.slice(0, 10)}`;\n  return {\n    previousPcrValue: currPcr,\n    measurementDigest: measurement,\n    extendedPcrHash: extendedString,\n    status: 'TPM_PCR_EXTENDED_SUCCESS'\n  };\n}",
    "eHint": "Compute extendedString combining previous PCR and measurement digest.",
    "eTest": "const res = extendTpmPcr('0000000000000000', '1122334455667788');\nif (!res.extendedPcrHash.startsWith('EXTENDED_') || res.status !== 'TPM_PCR_EXTENDED_SUCCESS') throw new Error('TPM PCR extend failed');",
    "aTitle": "TPM PCR Bank Index Formatter",
    "aDesc": "Implement function formatPcrIndex(index) returning `PCR[${index}]`.",
    "aStarter": "function formatPcrIndex(i) { return `PCR[${i}]`; }",
    "aHint": "Format PCR string.",
    "aTest": "if (formatPcrIndex(7) !== 'PCR[7]') throw new Error('PCR format failed');"
  },
  {
    "day": 9,
    "title": "Hardware Debug Port Security: JTAG/SWD Disabling & Bitfuse Lockout",
    "desc": "Defend against physical hardware hackers: JTAG/SWD test access ports (TAPs), memory dumping exploits, eFuse Security bitfuses, and permanent physical debug port disabling in production.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Hardware Debug Port Security: JTAG/SWD Disabling & Bitfuse Lockout.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "JTAG Debug Port Security Bitfuse Auditor",
    "eDesc": "Implement function auditJtagLockout(isProductionDevice, isJtagFusedPermanently) ensuring debug ports are disabled on production units.",
    "eStarter": "function auditJtagLockout(isProd, isFused) {\n  const isVulnerable = isProd && !isFused;\n  const isCompliant = !isVulnerable;\n  return {\n    productionDevice: isProd,\n    jtagPermanentlyDisabled: isFused,\n    securityCompliant: isCompliant,\n    status: isCompliant ? 'JTAG_DEBUG_PORT_SECURED' : 'CRITICAL_HARDWARE_VULNERABILITY_OPEN_JTAG'\n  };\n}",
    "eHint": "Check that production devices have JTAG permanently fused.",
    "eTest": "const ok = auditJtagLockout(true, true);\nconst vuln = auditJtagLockout(true, false);\nif (!ok.securityCompliant || vuln.securityCompliant || vuln.status !== 'CRITICAL_HARDWARE_VULNERABILITY_OPEN_JTAG') throw new Error('JTAG audit failed');",
    "aTitle": "Debug Port State Formatter",
    "aDesc": "Implement function formatDebugState(fused) returning `DEBUG_PORT_${fused ? 'LOCKED' : 'OPEN'}`.",
    "aStarter": "function formatDebugState(f) { return `DEBUG_PORT_${f ? 'LOCKED' : 'OPEN'}`; }",
    "aHint": "Format debug state string.",
    "aTest": "if (formatDebugState(true) !== 'DEBUG_PORT_LOCKED') throw new Error('Debug format failed');"
  },
  {
    "day": 10,
    "title": "Flash Encryption & Bus Scrambling: AES-XTS on External SPI Flash",
    "desc": "Prevent external SPI flash memory desoldering and bus tapping: Transparent AES-128/256-XTS on-the-fly encryption, physical address scrambling, and unique per-device flash keys.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Flash Encryption & Bus Scrambling: AES-XTS on External SPI Flash.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "AES-XTS Flash Sector Address Scrambler",
    "eDesc": "Implement function calculateFlashScrambleOffset(physicalAddress, sectorKeyOffset = 0x55AA) calculating bus-scrambled physical memory offsets.",
    "eStarter": "function calculateFlashScrambleOffset(addr, keyOffset = 0x55AA) {\n  const scrambledAddr = (addr ^ keyOffset) >>> 0;\n  return {\n    logicalAddressHex: '0x' + addr.toString(16).toUpperCase(),\n    scrambledAddressHex: '0x' + scrambledAddr.toString(16).toUpperCase(),\n    busTappingProtected: true,\n    status: 'FLASH_ADDRESS_SCRAMBLED_XTS_ACTIVE'\n  };\n}",
    "eHint": "XOR address with keyOffset and convert to hex.",
    "eTest": "const res = calculateFlashScrambleOffset(0x1000, 0x55AA);\nif (!res.busTappingProtected || res.status !== 'FLASH_ADDRESS_SCRAMBLED_XTS_ACTIVE') throw new Error('Flash scramble failed');",
    "aTitle": "Flash Sector Block Size Formatter",
    "aDesc": "Implement function formatSectorSize(kb) returning `${kb}KB Flash Sector`.",
    "aStarter": "function formatSectorSize(k) { return `${k}KB Flash Sector`; }",
    "aHint": "Format string.",
    "aTest": "if (formatSectorSize(4) !== '4KB Flash Sector') throw new Error('Sector format failed');"
  },
  {
    "day": 11,
    "title": "Secure Firmware Updates (OTA): Dual-Slot A/B Partitioning & Rollback Safety",
    "desc": "Upgrade firmware over the air without bricking devices: Dual-slot A/B flash partitions, OTA header metadata, HMAC/SHA-256 integrity verification, and automatic watchdog rollback on boot failure.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Secure Firmware Updates (OTA): Dual-Slot A/B Partitioning & Rollback Safety.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Dual-Slot A/B OTA Partition Flipper & Validator",
    "eDesc": "Implement function processOtaImageDownload(activeSlot, imageChecksumHex, expectedChecksumHex, imageSignatureValid) validating incoming OTA image and selecting target partition.",
    "eStarter": "function processOtaImageDownload(activeSlot, imgHash, expHash, sigValid) {\n  const targetSlot = (activeSlot === 'SLOT_A') ? 'SLOT_B' : 'SLOT_A';\n  const isChecksumMatch = (imgHash === expHash);\n  const isReadyToFlash = isChecksumMatch && imageSignatureValid;\n  return {\n    currentActiveSlot: activeSlot,\n    targetPartitionSlot: targetSlot,\n    integrityVerified: isChecksumMatch,\n    signatureVerified: imageSignatureValid,\n    permitOtaFlash: isReadyToFlash,\n    status: isReadyToFlash ? 'OTA_IMAGE_VERIFIED_PROCEED_TO_FLASH' : 'CORRUPT_OR_UNTRUSTED_OTA_IMAGE_ABORT'\n  };\n}",
    "eHint": "Verify imgHash === expHash and sigValid, flipping activeSlot A <-> B.",
    "eTest": "const ok = processOtaImageDownload('SLOT_A', '0xHASH1', '0xHASH1', true);\nconst bad = processOtaImageDownload('SLOT_A', '0xHASH1', '0xHASH2', true);\nif (ok.targetPartitionSlot !== 'SLOT_B' || !ok.permitOtaFlash || bad.permitOtaFlash) throw new Error('OTA process failed');",
    "aTitle": "Partition Slot Flipper",
    "aDesc": "Implement function flipSlot(slot) returning `slot === 'SLOT_A' ? 'SLOT_B' : 'SLOT_A'`.",
    "aStarter": "function flipSlot(s) { return s === 'SLOT_A' ? 'SLOT_B' : 'SLOT_A'; }",
    "aHint": "Flip slot A to B and vice-versa.",
    "aTest": "if (flipSlot('SLOT_A') !== 'SLOT_B') throw new Error('Slot flip failed');"
  },
  {
    "day": 12,
    "title": "Firmware Delta Patching: BS与之/Courgette Binary Compression",
    "desc": "Cut cellular OTA bandwidth by 95%: Binary Differential compression (Courgette / BSDiff), patching old firmware images with delta byte streams, and memory buffer bounds verification.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Firmware Delta Patching: BS与之/Courgette Binary Compression.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Firmware Delta Patch Reconstructor & Size Savings Evaluator",
    "eDesc": "Implement function evaluateDeltaSavings(fullImageSizeBytes, deltaPatchSizeBytes) calculating bandwidth savings and patch feasibility.",
    "eStarter": "function evaluateDeltaSavings(fullBytes, deltaBytes) {\n  const savedBytes = fullBytes - deltaBytes;\n  const savingsPct = (savedBytes / fullBytes) * 100;\n  return {\n    fullImageBytes: fullBytes,\n    deltaPatchBytes: deltaBytes,\n    cellularDataSavedBytes: savedBytes,\n    bandwidthSavingsPercent: Number(savingsPct.toFixed(1)),\n    status: 'DELTA_OTA_BANDWIDTH_OPTIMIZED'\n  };\n}",
    "eHint": "Compute savedBytes = full - delta and savings percentage.",
    "eTest": "const res = evaluateDeltaSavings(1048576, 52428); // 1MB down to 50KB\nif (res.bandwidthSavingsPercent !== 95.0 || res.status !== 'DELTA_OTA_BANDWIDTH_OPTIMIZED') throw new Error('Delta savings evaluation failed');",
    "aTitle": "Delta Compression Ratio Formatter",
    "aDesc": "Implement function formatCompressionRatio(full, delta) returning `${Math.round(full / delta)}x smaller`.",
    "aStarter": "function formatCompressionRatio(f, d) { return `${Math.round(f / d)}x smaller`; }",
    "aHint": "Compute ratio and format string.",
    "aTest": "if (formatCompressionRatio(100, 10) !== '10x smaller') throw new Error('Ratio format failed');"
  },
  {
    "day": 13,
    "title": "Zero-Touch Provisioning (ZTP): EST, SCEP and Factory Enrollment",
    "desc": "Enroll millions of devices securely at scale: Enrollment over Secure Transport (EST / RFC 7030), Simple Certificate Enrollment Protocol (SCEP), Initial Device Identifiers (IDevID / 802.1AR), and Locally Significant Identifiers (LDevID).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Zero-Touch Provisioning (ZTP): EST, SCEP and Factory Enrollment.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Zero-Touch EST Enrollment Certificate Exchange Validator",
    "eDesc": "Implement function validateEstEnrollment(iDevIdCertValid, csrPublicKeyMatch, serverCaSignature) verifying automated device enrollment.",
    "eStarter": "function validateEstEnrollment(iDevValid, csrMatch, caSigValid) {\n  const isApproved = iDevValid && csrMatch && caSigValid;\n  return {\n    factoryIDevIdAuthentic: iDevValid,\n    csrKeyOwnershipVerified: csrMatch,\n    caSignerAuthentic: caSigValid,\n    issueLDevIdCertificate: isApproved,\n    status: isApproved ? 'ZERO_TOUCH_EST_ENROLLMENT_SUCCESS' : 'ENROLLMENT_REJECTED_UNTRUSTED_DEVICE'\n  };\n}",
    "eHint": "Verify all three flags are true.",
    "eTest": "const ok = validateEstEnrollment(true, true, true);\nconst fail = validateEstEnrollment(false, true, true);\nif (!ok.issueLDevIdCertificate || fail.issueLDevIdCertificate || ok.status !== 'ZERO_TOUCH_EST_ENROLLMENT_SUCCESS') throw new Error('EST enrollment failed');",
    "aTitle": "Certificate Protocol Name Formatter",
    "aDesc": "Implement function formatEnrollmentProtocol(proto) returning `RFC_7030_${proto}`.",
    "aStarter": "function formatEnrollmentProtocol(p) { return `RFC_7030_${p}`; }",
    "aHint": "Format protocol string.",
    "aTest": "if (formatEnrollmentProtocol('EST') !== 'RFC_7030_EST') throw new Error('Protocol format failed');"
  },
  {
    "day": 14,
    "title": "Certificate Revocation: CRLs vs Online Certificate Status Protocol (OCSP)",
    "desc": "Revoke compromised IoT credentials instantly: Certificate Revocation Lists (CRLs: Bloated bandwidth!), OCSP responder requests, and OCSP Stapling with cryptographic time-bound validity.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Certificate Revocation: CRLs vs Online Certificate Status Protocol (OCSP).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "OCSP Response Status & Time-Bound Stapling Verifier",
    "eDesc": "Implement function verifyOcspStaple(certSerial, ocspStatus, thisUpdateTimestamp, nextUpdateTimestamp, currentTimestamp) verifying revocation status and freshness.",
    "eStarter": "function verifyOcspStaple(serial, status, thisUp, nextUp, now) {\n  const isFresh = (now >= thisUp) && (now <= nextUp);\n  const isGood = (status === 'GOOD');\n  const isValid = isFresh && isGood;\n  return {\n    certificateSerial: serial,\n    isOcspResponseFresh: isFresh,\n    revocationStatus: status,\n    isCertificateValid: isValid,\n    status: isValid ? 'OCSP_CERTIFICATE_VERIFIED_GOOD' : (status === 'REVOKED' ? 'CERTIFICATE_REVOKED_ACCESS_DENIED' : 'OCSP_RESPONSE_EXPIRED_OR_STALE')\n  };\n}",
    "eHint": "Verify status === 'GOOD' and now between thisUp and nextUp.",
    "eTest": "const ok = verifyOcspStaple('0x1234', 'GOOD', 100, 200, 150);\nconst revoked = verifyOcspStaple('0x1234', 'REVOKED', 100, 200, 150);\nif (!ok.isCertificateValid || revoked.isCertificateValid || revoked.status !== 'CERTIFICATE_REVOKED_ACCESS_DENIED') throw new Error('OCSP validation failed');",
    "aTitle": "Revocation Reason Code Formatter",
    "aDesc": "Implement function formatRevocationCode(code) returning `REVOCATION_REASON_${code}`.",
    "aStarter": "function formatRevocationCode(c) { return `REVOCATION_REASON_${c}`; }",
    "aHint": "Format string.",
    "aTest": "if (formatRevocationCode('KEY_COMPROMISE') !== 'REVOCATION_REASON_KEY_COMPROMISE') throw new Error('Revocation format failed');"
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Complete Secure Device Lifecycle & Provisioning Engine",
    "desc": "Milestone 2: Build a production IoT device lifecycle engine: Zero-Touch EST enrollment, X.509 dual-slot A/B OTA partition updates, anti-rollback monotonic counter enforcement, and OCSP revocation verification.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 2: Complete Secure Device Lifecycle & Provisioning Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Device Lifecycle & Provisioning Master Controller",
    "eDesc": "Implement function executeDeviceLifecycleCycle(deviceRegistered, efuseVersion, incomingOtaVersion, ocspValid) orchestrating secure lifecycle operations.",
    "eStarter": "function executeDeviceLifecycleCycle(isReg, efuseVer, otaVer, ocspOk) {\n  const isNotDowngrade = otaVer >= efuseVer;\n  const isAuthorized = isReg && isNotDowngrade && ocspOk;\n  return {\n    deviceEnrolled: isReg,\n    antiRollbackPassed: isNotDowngrade,\n    credentialValid: ocspOk,\n    deviceOperational: isAuthorized,\n    status: isAuthorized ? 'DEVICE_LIFECYCLE_OPERATIONAL_NOMINAL' : 'DEVICE_QUARANTINED_SECURITY_VIOLATION'\n  };\n}",
    "eHint": "Verify isReg, otaVer >= efuseVer, and ocspOk.",
    "eTest": "const ok = executeDeviceLifecycleCycle(true, 2, 3, true);\nconst fail = executeDeviceLifecycleCycle(true, 2, 1, true); // Downgrade!\nif (!ok.deviceOperational || fail.deviceOperational || ok.status !== 'DEVICE_LIFECYCLE_OPERATIONAL_NOMINAL') throw new Error('Milestone 2 Lifecycle failed');",
    "aTitle": "Device State Machine Formatter",
    "aDesc": "Implement function getDeviceState(state) returning `STATE_${state}`.",
    "aStarter": "function getDeviceState(s) { return `STATE_${s}`; }",
    "aHint": "Format state string.",
    "aTest": "if (getDeviceState('OPERATIONAL') !== 'STATE_OPERATIONAL') throw new Error('State format failed');"
  },
  {
    "day": 16,
    "title": "TLS 1.3 & DTLS 1.3: Secure Constrained Transport Handshakes",
    "desc": "Protect data in transit: TLS 1.3 1-RTT handshake, DTLS over UDP for CoAP/Thread, PSK (Pre-Shared Key) vs Certificate modes, and Record Layer Sequence Number anti-replay protection.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of TLS 1.3 & DTLS 1.3: Secure Constrained Transport Handshakes.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "TLS 1.3 Cipher Suite Compatibility Evaluator",
    "eDesc": "Implement function evaluateTlsCipherSuite(clientCiphers, serverCiphers) finding highest security intersection.",
    "eStarter": "function evaluateTlsCipherSuite(client, server) {\n  const supported = ['TLS_AES_256_GCM_SHA384', 'TLS_AES_128_GCM_SHA256', 'TLS_CHACHA20_POLY1305_SHA256'];\n  for (const c of server) {\n    if (client.includes(c) && supported.includes(c)) {\n      return {\n        negotiatedCipher: c,\n        handshakePermitted: true,\n        status: 'TLS13_CIPHER_NEGOTIATION_SUCCESS'\n      };\n    }\n  }\n  return { negotiatedCipher: null, handshakePermitted: false, status: 'NO_MUTUAL_CIPHER_SUITE_ABORT' };\n}",
    "eHint": "Find first common cipher between server and client that is supported.",
    "eTest": "const res = evaluateTlsCipherSuite(['TLS_AES_128_GCM_SHA256'], ['TLS_AES_256_GCM_SHA384', 'TLS_AES_128_GCM_SHA256']);\nif (res.negotiatedCipher !== 'TLS_AES_128_GCM_SHA256' || !res.handshakePermitted) throw new Error('TLS negotiation failed');",
    "aTitle": "TLS Version Verifier",
    "aDesc": "Implement function isTls13(ver) returning `ver === 'TLSv1.3'`.",
    "aStarter": "function isTls13(v) { return v === 'TLSv1.3'; }",
    "aHint": "Check TLSv1.3.",
    "aTest": "if (!isTls13('TLSv1.3') || isTls13('TLSv1.0')) throw new Error('TLS check failed');"
  },
  {
    "day": 17,
    "title": "ARM TrustZone for Cortex-M: Hardware Memory Isolation",
    "desc": "Divide microcontroller RAM and peripherals into two isolated worlds: Secure World vs Non-Secure World, Security Attribution Unit (SAU), Memory Protection Controller (MPC), and Non-Secure Callables (NSC).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ARM TrustZone for Cortex-M: Hardware Memory Isolation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "ARM TrustZone SAU Memory Boundary & NSC Gateway Validator",
    "eDesc": "Implement function validateTrustZoneAccess(targetAddressHex, isNonSecureCaller, isNscGatewayAddress) checking hardware memory firewall rules.",
    "eStarter": "function validateTrustZoneAccess(targetAddr, isNonSecure, isNsc) {\n  const addrInt = parseInt(targetAddr, 16);\n  const isSecureRegion = (addrInt >= 0x10000000 && addrInt < 0x20000000);\n  let accessPermitted = false;\n  if (!isSecureRegion) {\n    accessPermitted = true; // Non-secure region accessible by anyone\n  } else {\n    accessPermitted = !isNonSecure || isNsc; // Secure region only accessible by Secure caller or via NSC gateway\n  }\n  return {\n    targetAddressHex: targetAddr,\n    isSecureRegion,\n    accessPermitted,\n    status: accessPermitted ? 'TRUSTZONE_ACCESS_GRANTED' : 'SECURE_FAULT_ILLEGAL_MEMORY_ACCESS'\n  };\n}",
    "eHint": "Check if non-secure caller attempts to access secure region without NSC gateway.",
    "eTest": "const okSecure = validateTrustZoneAccess('0x10005000', false, false);\nconst failIllegal = validateTrustZoneAccess('0x10005000', true, false); // Non-secure caller to secure RAM!\nconst okNsc = validateTrustZoneAccess('0x10005000', true, true); // Non-secure caller via NSC\nif (!okSecure.accessPermitted || failIllegal.accessPermitted || !okNsc.accessPermitted || failIllegal.status !== 'SECURE_FAULT_ILLEGAL_MEMORY_ACCESS') throw new Error('TrustZone validation failed');",
    "aTitle": "TrustZone World Identifier",
    "aDesc": "Implement function getWorldName(isSecure) returning `isSecure ? 'SECURE_WORLD' : 'NON_SECURE_WORLD'`.",
    "aStarter": "function getWorldName(s) { return s ? 'SECURE_WORLD' : 'NON_SECURE_WORLD'; }",
    "aHint": "Return world string.",
    "aTest": "if (getWorldName(true) !== 'SECURE_WORLD') throw new Error('World name failed');"
  },
  {
    "day": 18,
    "title": "Side-Channel Attacks: Differential Power Analysis (DPA) Defenses",
    "desc": "Defend against oscilloscope key theft: Simple Power Analysis (SPA), Differential Power Analysis (DPA), Correlation Power Analysis (CPA), Random Clock Jittering, and Constant-Time Cryptographic Primitives.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Side-Channel Attacks: Differential Power Analysis (DPA) Defenses.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Constant-Time Memory Comparison & Timing Leakage Shield",
    "eDesc": "Implement function constantTimeCompare(bufA, bufB) executing execution in deterministic cycles without early exit branching.",
    "eStarter": "function constantTimeCompare(bufA, bufB) {\n  if (bufA.length !== bufB.length) return false;\n  let diff = 0;\n  for (let i = 0; i < bufA.length; i++) {\n    diff |= (bufA[i] ^ bufB[i]); // Bitwise OR accumulator with ZERO early breaks!\n  }\n  return diff === 0;\n}",
    "eHint": "Accumulate XOR diffs across all bytes without returning early.",
    "eTest": "const ok = constantTimeCompare([1, 2, 3], [1, 2, 3]);\nconst diffFirst = constantTimeCompare([9, 2, 3], [1, 2, 3]);\nconst diffLast = constantTimeCompare([1, 2, 9], [1, 2, 3]);\nif (!ok || diffFirst || diffLast) throw new Error('Constant-time comparison failed');",
    "aTitle": "Timing Attack Vulnerability Rater",
    "aDesc": "Implement function hasEarlyExit(codeStr) returning `codeStr.includes('return false')`.",
    "aStarter": "function hasEarlyExit(c) { return c.includes('return false'); }",
    "aHint": "Check if code has early return.",
    "aTest": "if (!hasEarlyExit('if (a != b) return false;') || hasEarlyExit('diff |= (a ^ b);')) throw new Error('Early exit check failed');"
  },
  {
    "day": 19,
    "title": "Fault Injection & Glitching Attacks: Clock, Voltage and Laser Attacks",
    "desc": "Prevent skip-instruction hardware hacking: Clock glitching (Inserting nanosecond spikes to skip `if (password_ok)` assembly branches), Voltage Brownouts, Double-Check Redundant Invariants, and Optical Sensors.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Fault Injection & Glitching Attacks: Clock, Voltage and Laser Attacks.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Redundant Invariant Validation & Clock Glitch Detector",
    "eDesc": "Implement function evaluateRedundantCheck(authCheck1, authCheck2, hardwareGlitchSensorTripped) ensuring instruction skipping cannot bypass security.",
    "eStarter": "function evaluateRedundantCheck(check1, check2, glitchSensor) {\n  const isBothPassed = (check1 === true) && (check2 === true);\n  const isGlitchFree = !glitchSensor;\n  const isAccessAllowed = isBothPassed && isGlitchFree;\n  return {\n    check1Passed: check1,\n    check2Passed: check2,\n    glitchFree: isGlitchFree,\n    accessAllowed: isAccessAllowed,\n    status: isAccessAllowed ? 'REDUNDANT_SECURITY_CHECKS_VERIFIED' : 'FAULT_INJECTION_GLITCH_DETECTED_HALT'\n  };\n}",
    "eHint": "Verify check1 === true, check2 === true, and !glitchSensor.",
    "eTest": "const ok = evaluateRedundantCheck(true, true, false);\nconst glitched = evaluateRedundantCheck(true, false, false); // 1 check skipped!\nconst sensorTripped = evaluateRedundantCheck(true, true, true);\nif (!ok.accessAllowed || glitched.accessAllowed || sensorTripped.accessAllowed || glitched.status !== 'FAULT_INJECTION_GLITCH_DETECTED_HALT') throw new Error('Glitch detector failed');",
    "aTitle": "Glitch Voltage Threshold Formatter",
    "aDesc": "Implement function formatGlitchThreshold(volts) returning `${volts}V Brownout Threshold`.",
    "aStarter": "function formatGlitchThreshold(v) { return `${v}V Brownout Threshold`; }",
    "aHint": "Format string.",
    "aTest": "if (formatGlitchThreshold(2.1) !== '2.1V Brownout Threshold') throw new Error('Threshold format failed');"
  },
  {
    "day": 20,
    "title": "Physically Unclonable Functions (PUF): Silicon Biometrics",
    "desc": "Generate keys from microscopic manufacturing variations: SRAM Startup State PUFs (Random 0/1 bits at power-up), Helper Data Algorithms, Fuzzy Extractors, and Keyless In-Silicon Key Generation.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Physically Unclonable Functions (PUF): Silicon Biometrics.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "SRAM PUF Helper Data & Error-Correction Reconstructor",
    "eDesc": "Implement function reconstructPufKey(rawSramBits, helperDataMask) reconstructing secret key from noisy SRAM power-up state.",
    "eStarter": "function reconstructPufKey(rawBits, mask) {\n  // In PUF: key = rawBits XOR mask\n  let keyHex = '';\n  for (let i = 0; i < rawBits.length; i++) {\n    const bit = rawBits[i] ^ mask[i];\n    keyHex += bit.toString();\n  }\n  return {\n    reconstructedKeyBits: keyHex,\n    keyStoredInFlash: false, // 100% physically generated on-the-fly!\n    status: 'PUF_KEY_RECONSTRUCTION_SUCCESS'\n  };\n}",
    "eHint": "Compute bit = rawBits[i] ^ mask[i] and concatenate.",
    "eTest": "const res = reconstructPufKey([1, 0, 1], [0, 0, 1]);\nif (res.reconstructedKeyBits !== '100' || res.keyStoredInFlash || res.status !== 'PUF_KEY_RECONSTRUCTION_SUCCESS') throw new Error('PUF reconstruction failed');",
    "aTitle": "PUF Type Name Formatter",
    "aDesc": "Implement function formatPufType(type) returning `PUF_SILICON_${type}`.",
    "aStarter": "function formatPufType(t) { return `PUF_SILICON_${t}`; }",
    "aHint": "Format string.",
    "aTest": "if (formatPufType('SRAM') !== 'PUF_SILICON_SRAM') throw new Error('PUF format failed');"
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Complete Hardware Attack Defense & Cryptographic Vault Engine",
    "desc": "Milestone 3: Build a production hardware security vault: ARM TrustZone SAU boundary isolation, constant-time DPA cryptographic comparisons, redundant fault injection detection, and SRAM PUF key generation.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 3: Complete Hardware Attack Defense & Cryptographic Vault Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Hardware Security Vault & Tamper Defense Master Engine",
    "eDesc": "Implement function executeHardwareDefenseVault(sauValid, dpaConstantTime, glitchSensorClear, pufKeyReady) validating complete silicon attack resilience.",
    "eStarter": "function executeHardwareDefenseVault(sau, dpa, glitch, puf) {\n  const isHardened = sau && dpa && glitch && puf;\n  return {\n    trustZoneIsolated: sau,\n    timingShieldActive: dpa,\n    glitchProtectionActive: glitch,\n    siliconPufActive: puf,\n    vaultSecure: isHardened,\n    status: isHardened ? 'HARDWARE_DEFENSE_VAULT_ACTIVE' : 'HARDWARE_SECURITY_BREACH_DETECTED'\n  };\n}",
    "eHint": "Verify all four hardware security shields are active.",
    "eTest": "const ok = executeHardwareDefenseVault(true, true, true, true);\nconst breach = executeHardwareDefenseVault(true, false, true, true);\nif (!ok.vaultSecure || breach.vaultSecure || ok.status !== 'HARDWARE_DEFENSE_VAULT_ACTIVE') throw new Error('Milestone 3 Hardware Vault failed');",
    "aTitle": "Defense Shield Count Formatter",
    "aDesc": "Implement function formatShieldCount(count) returning `${count}/4 Hardware Shields Active`.",
    "aStarter": "function formatShieldCount(c) { return `${c}/4 Hardware Shields Active`; }",
    "aHint": "Format string.",
    "aTest": "if (formatShieldCount(4) !== '4/4 Hardware Shields Active') throw new Error('Shield count failed');"
  },
  {
    "day": 22,
    "title": "Vulnerability Management & CVSS 3.1 Triage in Connected Fleets",
    "desc": "Assess IoT vulnerabilities across fleets: Common Vulnerability Scoring System (CVSS v3.1), Attack Vector (AV: Network vs Adjacent vs Physical), Privileges Required (PR), and Scope (S).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Vulnerability Management & CVSS 3.1 Triage in Connected Fleets.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "CVSS v3.1 Base Severity Score & Rating Evaluator",
    "eDesc": "Implement function evaluateCvssSeverity(score) returning qualitative rating (NONE, LOW, MEDIUM, HIGH, CRITICAL).",
    "eStarter": "function evaluateCvssSeverity(score) {\n  let rating = 'NONE';\n  if (score >= 9.0) rating = 'CRITICAL';\n  else if (score >= 7.0) rating = 'HIGH';\n  else if (score >= 4.0) rating = 'MEDIUM';\n  else if (score > 0.0) rating = 'LOW';\n  return {\n    cvssScore: score,\n    severityRating: rating,\n    requiresImmediateEmergencyPatch: score >= 9.0,\n    status: `CVSS_TRIAGED_${rating}`\n  };\n}",
    "eHint": "Classify score into CRITICAL (>=9.0), HIGH (>=7.0), MEDIUM (>=4.0), LOW (>0).",
    "eTest": "const crit = evaluateCvssSeverity(9.8);\nconst high = evaluateCvssSeverity(7.5);\nconst med = evaluateCvssSeverity(5.3);\nif (crit.severityRating !== 'CRITICAL' || high.severityRating !== 'HIGH' || med.severityRating !== 'MEDIUM' || !crit.requiresImmediateEmergencyPatch) throw new Error('CVSS evaluation failed');",
    "aTitle": "Attack Vector Code Formatter",
    "aDesc": "Implement function formatAttackVector(av) returning `AV:${av}`.",
    "aStarter": "function formatAttackVector(a) { return `AV:${a}`; }",
    "aHint": "Format string.",
    "aTest": "if (formatAttackVector('PHYSICAL') !== 'AV:PHYSICAL') throw new Error('AV format failed');"
  },
  {
    "day": 23,
    "title": "Software Bill of Materials (SBOM) & Supply Chain Security",
    "desc": "Track embedded third-party open source vulnerabilities: CycloneDX and SPDX SBOM formats, tracking OpenSSL/LwIP/FreeRTOS components, and matching against National Vulnerability Database (NVD) CVE feeds.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Software Bill of Materials (SBOM) & Supply Chain Security.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "SBOM Component & CVE Vulnerability Matcher",
    "eDesc": "Implement function matchSbomVulnerabilities(componentsList, cveDatabase) finding outdated components with published exploits.",
    "eStarter": "function matchSbomVulnerabilities(components, cveDb) {\n  const foundVulnerabilities = [];\n  for (const comp of components) {\n    const match = cveDb.find(c => c.name === comp.name && c.vulnerableVersion === comp.version);\n    if (match) {\n      foundVulnerabilities.push({ component: comp.name, version: comp.version, cveId: match.cveId, severity: match.severity });\n    }\n  }\n  const isClean = (foundVulnerabilities.length === 0);\n  return {\n    totalComponentsScanned: components.length,\n    vulnerabilitiesFoundCount: foundVulnerabilities.length,\n    vulnerabilities: foundVulnerabilities,\n    supplyChainSecure: isClean,\n    status: isClean ? 'SBOM_SUPPLY_CHAIN_CLEAN' : 'VULNERABILITIES_DETECTED_IN_DEPENDENCIES'\n  };\n}",
    "eHint": "Match components against cveDb by name and version.",
    "eTest": "const comps = [{ name: 'lwip', version: '2.0.0' }, { name: 'freertos', version: '10.4.0' }];\nconst cves = [{ name: 'lwip', vulnerableVersion: '2.0.0', cveId: 'CVE-2020-25213', severity: 'HIGH' }];\nconst res = matchSbomVulnerabilities(comps, cves);\nif (res.vulnerabilitiesFoundCount !== 1 || res.supplyChainSecure || res.status !== 'VULNERABILITIES_DETECTED_IN_DEPENDENCIES') throw new Error('SBOM matcher failed');",
    "aTitle": "SBOM Format Identifier",
    "aDesc": "Implement function isStandardSbom(fmt) returning `['CycloneDX', 'SPDX'].includes(fmt)`.",
    "aStarter": "function isStandardSbom(f) { return ['CycloneDX', 'SPDX'].includes(f); }",
    "aHint": "Check standard formats.",
    "aTest": "if (!isStandardSbom('CycloneDX') || isStandardSbom('CSV')) throw new Error('SBOM format check failed');"
  },
  {
    "day": 24,
    "title": "Embedded C Memory Safety: Stack Canaries & Buffer Overflow Defenses",
    "desc": "Prevent remote code execution in firmware: Stack Smashing Protections (`-fstack-protector-strong`), Stack Canaries (`__stack_chk_guard`), Data Execution Prevention (DEP/NX MPU regions), and Address Sanitization.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Embedded C Memory Safety: Stack Canaries & Buffer Overflow Defenses.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Stack Canary Corruption & Buffer Overflow Detector",
    "eDesc": "Implement function checkStackCanary(initialCanaryHex, currentCanaryHex) triggering system panic if canary value is modified.",
    "eStarter": "function checkStackCanary(initCanary, currCanary) {\n  const isCorrupted = (initCanary !== currCanary);\n  return {\n    initialCanary: initCanary,\n    currentCanary: currCanary,\n    stackSmashDetected: isCorrupted,\n    action: isCorrupted ? 'TRIGGER_HARDFAULT_PANIC_STACK_SMASHED' : 'STACK_INTEGRITY_VERIFIED',\n    status: isCorrupted ? 'MEMORY_CORRUPTION_VULNERABILITY' : 'STACK_CANARY_VALID'\n  };\n}",
    "eHint": "Verify initCanary === currCanary.",
    "eTest": "const ok = checkStackCanary('0xDEADBEEF', '0xDEADBEEF');\nconst smashed = checkStackCanary('0xDEADBEEF', '0x41414141'); // Overwritten with 'AAAA'!\nif (ok.stackSmashDetected || !smashed.stackSmashDetected || smashed.action !== 'TRIGGER_HARDFAULT_PANIC_STACK_SMASHED') throw new Error('Stack canary failed');",
    "aTitle": "Canary Guard Size Formatter",
    "aDesc": "Implement function formatCanarySize(bytes) returning `${bytes}-byte Stack Guard`.",
    "aStarter": "function formatCanarySize(b) { return `${b}-byte Stack Guard`; }",
    "aHint": "Format string.",
    "aTest": "if (formatCanarySize(4) !== '4-byte Stack Guard') throw new Error('Canary format failed');"
  },
  {
    "day": 25,
    "title": "Automotive & Industrial Bus Security: CAN Bus & Modbus Intrusion Detection",
    "desc": "Detect attacks on Controller Area Networks (CAN) and Modbus SCADA: CAN message ID fuzzing, Frame frequency anomalies, Modbus Coil injection, and Machine Learning Intrusion Detection Systems (IDS).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Automotive & Industrial Bus Security: CAN Bus & Modbus Intrusion Detection.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "CAN Bus Frequency Anomaly & ID Flooding Detector",
    "eDesc": "Implement function evaluateCanBusFrequency(messageIdHex, currentIntervalMs, expectedIntervalMs, maxJitterMs = 5) detecting CAN bus injection attacks.",
    "eStarter": "function evaluateCanBusFrequency(id, currMs, expMs, maxJitter = 5) {\n  const diff = Math.abs(currMs - expMs);\n  const isFlooded = (currMs < expMs / 2); // Messages arriving twice as fast as expected!\n  const isJitterExcess = (diff > maxJitter);\n  const isAnomaly = isFlooded || isJitterExcess;\n  return {\n    canMessageId: id,\n    measuredIntervalMs: currMs,\n    expectedIntervalMs: expMs,\n    isAnomalyDetected: isAnomaly,\n    status: isAnomaly ? 'CAN_BUS_INTRUSION_DETECTED_ANOMALOUS_FREQUENCY' : 'CAN_BUS_STREAM_NOMINAL'\n  };\n}",
    "eHint": "Check if currMs < expMs / 2 or diff > maxJitter.",
    "eTest": "const ok = evaluateCanBusFrequency('0x120', 20, 20, 5);\nconst flooded = evaluateCanBusFrequency('0x120', 2, 20, 5); // 2ms vs 20ms!\nif (ok.isAnomalyDetected || !flooded.isAnomalyDetected || flooded.status !== 'CAN_BUS_INTRUSION_DETECTED_ANOMALOUS_FREQUENCY') throw new Error('CAN IDS failed');",
    "aTitle": "CAN Message ID Formatter",
    "aDesc": "Implement function formatCanId(idHex) returning `CAN_ID_${idHex}`.",
    "aStarter": "function formatCanId(id) { return `CAN_ID_${id}`; }",
    "aHint": "Format CAN ID string.",
    "aTest": "if (formatCanId('0x280') !== 'CAN_ID_0x280') throw new Error('CAN ID format failed');"
  },
  {
    "day": 26,
    "title": "Secure Commissioning: Bluetooth LE PASE & Out-of-Band (OOB) NFC",
    "desc": "Commission smart devices into home/industrial networks securely: Passcode-Authenticated Session Establishment (PASE / Matter Standard), Out-of-Band (OOB) NFC tapping, and MitM protection.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Secure Commissioning: Bluetooth LE PASE & Out-of-Band (OOB) NFC.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "PASE SPAKE2+ Handshake Passcode Verifier",
    "eDesc": "Implement function verifyPaseCommissioning(qrCodePasscode, enteredPasscode, saltMatches) validating Matter smart home onboarding.",
    "eStarter": "function verifyPaseCommissioning(qrPass, enteredPass, saltOk) {\n  const isPassMatched = (qrPass === enteredPass);\n  const isCommissioned = isPassMatched && saltOk;\n  return {\n    passcodeVerified: isPassMatched,\n    saltValid: saltOk,\n    commissioningPermitted: isCommissioned,\n    status: isCommissioned ? 'PASE_COMMISSIONING_AUTHENTICATED' : 'COMMISSIONING_REJECTED_INVALID_PASSCODE'\n  };\n}",
    "eHint": "Verify qrPass === enteredPass and saltOk.",
    "eTest": "const ok = verifyPaseCommissioning('20202021', '20202021', true);\nconst bad = verifyPaseCommissioning('20202021', '99999999', true);\nif (!ok.commissioningPermitted || bad.commissioningPermitted || bad.status !== 'COMMISSIONING_REJECTED_INVALID_PASSCODE') throw new Error('PASE verification failed');",
    "aTitle": "Matter Passcode Length Checker",
    "aDesc": "Implement function isMatterPasscodeValid(pass) returning `pass.length === 8`.",
    "aStarter": "function isMatterPasscodeValid(p) { return p.length === 8; }",
    "aHint": "Check length === 8.",
    "aTest": "if (!isMatterPasscodeValid('20202021') || isMatterPasscodeValid('1234')) throw new Error('Passcode check failed');"
  },
  {
    "day": 27,
    "title": "Secure Decommissioning: Cryptographic Erase & Sanitization",
    "desc": "Retire devices without leaking corporate keys: Cryptographic Erase (Vaporizing AES flash master keys in 1 millisecond), NIST SP 800-88 Sanitization standards, and Factory Reset eFuse blowing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Secure Decommissioning: Cryptographic Erase & Sanitization.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "NIST SP 800-88 Cryptographic Erase Sanitizer",
    "eDesc": "Implement function executeCryptoEraseSanitization(keyShredded, flashZeroOverwritten) certifying device sanitization.",
    "eStarter": "function executeCryptoEraseSanitization(keyShredded, flashOverwritten) {\n  const isSanitized = keyShredded && flashOverwritten;\n  return {\n    masterKeyShredded: keyShredded,\n    flashZeroed: flashOverwritten,\n    sanitizedCertified: isSanitized,\n    status: isSanitized ? 'NIST_800_88_SANITIZATION_CERTIFIED' : 'SANITIZATION_INCOMPLETE_DATA_RECOVERY_RISK'\n  };\n}",
    "eHint": "Verify keyShredded and flashOverwritten.",
    "eTest": "const ok = executeCryptoEraseSanitization(true, true);\nconst fail = executeCryptoEraseSanitization(false, true);\nif (!ok.sanitizedCertified || fail.sanitizedCertified || ok.status !== 'NIST_800_88_SANITIZATION_CERTIFIED') throw new Error('Crypto erase failed');",
    "aTitle": "Sanitization Standard Code Formatter",
    "aDesc": "Implement function formatNistStandard(std) returning `NIST_SP_${std}`.",
    "aStarter": "function formatNistStandard(s) { return `NIST_SP_${s}`; }",
    "aHint": "Format string.",
    "aTest": "if (formatNistStandard('800_88') !== 'NIST_SP_800_88') throw new Error('NIST format failed');"
  },
  {
    "day": 28,
    "title": "Remote Attestation & DICE / RIoT Hardware Architectures",
    "desc": "Prove device integrity to cloud servers: Device Identifier Composition Engine (DICE / Trusted Computing Group), Robust Internet of Things (RIoT), Layered Attestation Evidence, and Verification Tokens.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Remote Attestation & DICE / RIoT Hardware Architectures.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "DICE Layered Measurement Hash Chainer",
    "eDesc": "Implement function chainDiceMeasurement(uniqueDeviceSecretUds, layer0FirmwareHash) computing Compound Device Identifier (CDI).",
    "eStarter": "function chainDiceMeasurement(udsHex, layer0Hash) {\n  // In DICE: CDI = KDF(UDS, Layer0_Hash)\n  const cdiHex = `CDI_${udsHex.slice(0, 8)}_${layer0Hash.slice(0, 8)}`;\n  return {\n    compoundDeviceIdentifierHex: cdiHex,\n    udsIsolatedInHardware: true,\n    status: 'DICE_MEASUREMENT_CHAIN_COMPUTED'\n  };\n}",
    "eHint": "Compute cdiHex combining UDS and layer0Hash.",
    "eTest": "const res = chainDiceMeasurement('0xUDS12345678', '0xLAYER0HASH123');\nif (!res.compoundDeviceIdentifierHex.startsWith('CDI_') || res.status !== 'DICE_MEASUREMENT_CHAIN_COMPUTED') throw new Error('DICE measurement failed');",
    "aTitle": "DICE Layer Name Formatter",
    "aDesc": "Implement function formatDiceLayer(layerNum) returning `DICE_LAYER_${layerNum}`.",
    "aStarter": "function formatDiceLayer(l) { return `DICE_LAYER_${l}`; }",
    "aHint": "Format string.",
    "aTest": "if (formatDiceLayer(0) !== 'DICE_LAYER_0') throw new Error('DICE layer format failed');"
  },
  {
    "day": 29,
    "title": "Incident Response, Device Quarantine & Fleet Isolation",
    "desc": "Contain compromised smart nodes across massive fleets: Network Quarantine ACLs, Disabling Actuator Relays, Isolating Zigbee/BLE Mesh compromised nodes, and Cloud Fleet Command dispatch.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Incident Response, Device Quarantine & Fleet Isolation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Fleet Incident Quarantine & Actuator Disarm Circuit",
    "eDesc": "Implement function executeDeviceQuarantine(deviceUid, compromiseConfirmed) enforcing immediate isolation and relay disarming.",
    "eStarter": "function executeDeviceQuarantine(uid, isCompromised) {\n  const state = isCompromised ? 'ISOLATED_QUARANTINE_ACTUATORS_DISARMED' : 'FLEET_NODE_ACTIVE';\n  return {\n    deviceUid: uid,\n    compromiseConfirmed: isCompromised,\n    fleetState: state,\n    networkTrafficBlocked: isCompromised,\n    status: isCompromised ? 'INCIDENT_RESPONSE_NODE_QUARANTINED' : 'NODE_IN_GOOD_STANDING'\n  };\n}",
    "eHint": "Set state and status based on isCompromised.",
    "eTest": "const quarantined = executeDeviceQuarantine('NODE_77', true);\nconst clean = executeDeviceQuarantine('NODE_78', false);\nif (!quarantined.networkTrafficBlocked || clean.networkTrafficBlocked || quarantined.status !== 'INCIDENT_RESPONSE_NODE_QUARANTINED') throw new Error('Quarantine failed');",
    "aTitle": "Quarantine ACL Rule Formatter",
    "aDesc": "Implement function formatQuarantineAcl(uid) returning `DENY ALL FROM ${uid}`.",
    "aStarter": "function formatQuarantineAcl(u) { return `DENY ALL FROM ${u}`; }",
    "aHint": "Format ACL string.",
    "aTest": "if (formatQuarantineAcl('NODE_77') !== 'DENY ALL FROM NODE_77') throw new Error('ACL format failed');"
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Industrial Zero-Trust Fleet Security & Lifecycle Orchestrator",
    "desc": "Final Capstone Synthesis: The complete industrial Zero-Trust IoT security ecosystem: Hardware Root of Trust boot verification, Dual-Slot A/B OTA updates with anti-rollback eFuses, AES-GCM encrypted telemetry, TrustZone memory isolation, CAN/Modbus anomaly intrusion detection, and Automated Remote Attestation DICE measurement chains.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 🏆 FINAL CAPSTONE: Industrial Zero-Trust Fleet Security & Lifecycle Orchestrator.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ],
    "eTitle": "Industrial Zero-Trust Fleet Security Master Orchestrator",
    "eDesc": "Implement function orchestrateZeroTrustFleetNode(secureBootOk, flashEncrypted, antiRollbackPassed, mscTlsValid, idsClear, diceAttested) certifying end-to-end device security.",
    "eStarter": "function orchestrateZeroTrustFleetNode(boot, flash, rollback, tls, ids, dice) {\n  const isCompliant = boot && flash && rollback && tls && ids && dice;\n  return {\n    secureBootVerified: boot,\n    flashEncryptionActive: flash,\n    antiRollbackEnforced: rollback,\n    mscTlsAuthenticated: tls,\n    intrusionDetectionClear: ids,\n    remoteAttestationValid: dice,\n    nodeCertifiedZeroTrust: isCompliant,\n    certified: true,\n    status: isCompliant ? 'ZERO_TRUST_FLEET_NODE_CERTIFIED' : 'SECURITY_POSTURE_DEGRADED_QUARANTINED'\n  };\n}",
    "eHint": "Verify all six security posture invariants are true.",
    "eTest": "const ok = orchestrateZeroTrustFleetNode(true, true, true, true, true, true);\nconst fail = orchestrateZeroTrustFleetNode(true, true, false, true, true, true);\nif (!ok.nodeCertifiedZeroTrust || fail.nodeCertifiedZeroTrust || !ok.certified || ok.status !== 'ZERO_TRUST_FLEET_NODE_CERTIFIED') throw new Error('Capstone Zero-Trust failed');",
    "aTitle": "IoT Security Master Certification Auditor",
    "aDesc": "Implement function auditIotSecurityMasterCert() returning `{ certified: true, score: '100/100', tier: 'ENTERPRISE_IOT_SECURITY_MASTER_CERTIFIED' }`.",
    "aStarter": "function auditIotSecurityMasterCert() { return { certified: true, score: '100/100', tier: 'ENTERPRISE_IOT_SECURITY_MASTER_CERTIFIED' }; }",
    "aHint": "Return certification object.",
    "aTest": "if (!auditIotSecurityMasterCert().certified) throw new Error('Capstone cert failed');"
  }
];

export const IOT_SECURITY_30_DAYS_QUESTS: CourseQuest[] = IOT_SECURITY_30_DAYS_CONFIGS.flatMap((cfg, idx) => 
  buildEnrichedDayQuests('iot_sec', idx + 1, cfg)
);
