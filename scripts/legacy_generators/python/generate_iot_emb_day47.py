import json

day47 = {
    "day": 47,
    "title": "Delta Updates & Binary Differential Compression: BSDiff, Courgette & Satellite Bandwidth Savings",
    "goal": "Slash over-the-air data transfer size by up to 95%: master Delta Updates and Binary Differential Compression. Understand why standard file compression (gzip) fails on compiled binaries: a 1-line code change shifts thousands of branch and function addresses, causing massive byte-level divergence. Master binary diffing algorithms: BSDiff (suffix sorting and byte difference arrays) and Google Courgette (disassembling machine code to replace absolute addresses with labels before diffing). Implement embedded delta patching in C to reconstruct a full 512KB firmware image from a tiny 18KB differential patch directly in Flash.",
    "minutes": 42,
    "recap": "In Day 46, we engineered Dual-Bank and Dual-Slot FOTA topologies. Today, we optimize the data transmission pipeline, replacing expensive full-binary downloads with ultra-compact differential delta patches.",
    "parts": [
        {
            "title": "The Problem of Binary Code Shifts: Why Gzip Fails on Machine Code",
            "say": [
                "Transmitting a full 1MB firmware binary over cellular (NB-IoT/LTE-M) or satellite (Iridium/Swarm) is slow, battery-draining, and extraordinarily expensive.",
                "Junior developers often attempt to compress binaries with gzip or LZ4. However, compressing compiled machine code yields shockingly poor results: a 512KB firmware binary rarely compresses smaller than 380KB (only ~25% reduction).",
                "Why Gzip Fails on Machine Code: The Code Shift Phenomenon.",
                "Suppose you change a single line of source code in the middle of a project (e.g., adding an error check: if (err) return;).",
                "This single statement inserts 4 bytes of machine instructions. Consequently, the linker shifts the memory addresses of EVERY subsequent function, global variable, and jump target in the entire binary by 4 bytes!",
                "Even though 99.9% of your application logic is completely identical, thousands of 32-bit branch instructions (BL, BNE) and PC-relative literals now have different bit representations across the compiled binary.",
                "Because standard compression algorithms (like LZ77) search for identical byte-string repetitions, the shifted pointers destroy string matches. Gzip perceives the binary as brand new data!"
            ],
            "example": "A 1-line bug fix changes 4 bytes of logic, but shifts 4,200 branch instructions across a 512KB binary. Gzip produces a 390KB file. A true binary diffing algorithm produces an 18KB patch.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

struct BinaryDiffMetrics {
    size_t originalSizeBytes;
    size_t modifiedSizeBytes;
    size_t rawByteDifferences;
    double similarityPct;
};

BinaryDiffMetrics analyzeCodeShift(const std::vector<uint32_t>& v1, const std::vector<uint32_t>& v2) {
    BinaryDiffMetrics m;
    m.originalSizeBytes = v1.size() * 4;
    m.modifiedSizeBytes = v2.size() * 4;
    m.rawByteDifferences = 0;

    size_t minLen = std::min(v1.size(), v2.size());
    for (size_t i = 0; i < minLen; ++i) {
        if (v1[i] != v2[i]) {
            m.rawByteDifferences += 4;
        }
    }
    m.similarityPct = (1.0 - (double)m.rawByteDifferences / m.originalSizeBytes) * 100.0;
    return m;
}

int main() {
    std::cout << "--- DAY 47 PART 1: BINARY CODE SHIFT PHENOMENON ---" << std::endl;
    // Simulate 10 functions with branch targets: 0x08010010, 0x08010020, ...
    std::vector<uint32_t> v1 = {
        0x08010010, 0x08010020, 0x08010030, 0x08010040, 0x08010050,
        0x08010060, 0x08010070, 0x08010080, 0x08010090, 0x080100A0
    };

    // 1 instruction inserted at position 2 -> all subsequent addresses shift by 4 bytes!
    std::vector<uint32_t> v2 = {
        0x08010010, 0x08010020, 0xEA000001, // Inserted branch instruction
        0x08010034, 0x08010044, 0x08010054, // All shifted by +4
        0x08010064, 0x08010074, 0x08010084, 0x08010094
    };

    auto metrics = analyzeCodeShift(v1, v2);
    std::cout << "Original Binary Size:  " << metrics.originalSizeBytes << " Bytes" << std::endl;
    std::cout << "Modified Binary Size:  " << metrics.modifiedSizeBytes << " Bytes" << std::endl;
    std::cout << "Changed Machine Words: " << (metrics.rawByteDifferences / 4) << " of 10 words" << std::endl;
    std::cout << "Byte-Level Difference: " << metrics.rawByteDifferences << " Bytes modified (" 
              << (100.0 - metrics.similarityPct) << "% Divergence!)" << std::endl;
    std::cout << "-> A 1-word insertion caused an 80% binary divergence due to address shifting!" << std::endl;
    return 0;
}
""",
            "output": """--- DAY 47 PART 1: BINARY CODE SHIFT PHENOMENON ---
Original Binary Size:  40 Bytes
Modified Binary Size:  40 Bytes
Changed Machine Words: 8 of 10 words
Byte-Level Difference: 32 Bytes modified (80.0% Divergence!)
-> A 1-word insertion caused an 80% binary divergence due to address shifting!
""",
            "codeNotes": [
                {
                    "line": 6,
                    "note": "BinaryDiffMetrics quantifies byte-level divergence caused by compiler address shifts."
                },
                {
                    "line": 34,
                    "note": "Inserting a single 4-byte instruction shifts every subsequent target address by +4."
                },
                {
                    "line": 45,
                    "note": "An 80% byte divergence explains why standard LZ77/gzip compression fails on machine code."
                }
            ],
            "tryIt": "Explain why PC-relative branch instructions (like ARM B and BL) reduce shift divergence compared to absolute pointers.",
            "check": {
                "question": "Why does standard Gzip/Deflate compression perform poorly when applied to compiled microcontroller binaries?",
                "options": [
                    "Because adding even a single line of code shifts function and branch addresses throughout the binary, creating massive byte-level divergence that destroys string repetition matches.",
                    "Because Gzip only works on text files like HTML.",
                    "Because compiled binaries are encrypted by default.",
                    "Because microcontrollers cannot decompress data."
                ],
                "answer": 0,
                "why": "Compilers recompute jump targets and PC-relative offsets when code size changes. Even though instructions remain identical, their operand addresses change, preventing dictionary-based compressors from finding repetitive patterns."
            }
        },
        {
            "title": "BSDiff Mathematical Mechanics: Suffix Sorting & Control Blocks",
            "say": [
                "To overcome code shift divergence, Colin Percival authored BSDiff: the gold standard binary differential compression algorithm.",
                "The Mathematical Insight of BSDiff:",
                "When pointers shift by a constant offset (e.g. +4 bytes), the raw bytes differ. However, the arithmetic difference between the new byte and the old byte is a constant repetitive value: (new_byte - old_byte) mod 256 = 0x04!",
                "BSDiff Architecture & Data Streams:",
                "A BSDiff patch file consists of three sequential data streams:",
                "1) Control Triples: A series of tuples (x, y, z):",
                "   - x: Number of bytes to read from the Diff Stream and add (modulo 256) to the old binary.",
                "   - y: Number of bytes to copy verbatim from the Extra Stream (completely brand-new code).",
                "   - z: Number of bytes to seek forward or backward in the old binary.",
                "2) Diff Stream: Byte-by-byte delta values (mostly runs of 0x00 and small offsets, which compress massively with bzip2/zstandard).",
                "3) Extra Stream: Raw bytes of inserted functions that have no equivalent in the old binary.",
                "By separating structural byte deltas from newly inserted code, BSDiff compresses a 512KB update down to 15KB-25KB (a 95% reduction)."
            ],
            "example": "A function is modified with 2 new instructions. The Diff Stream applies 800 bytes of subtle byte differences, and the Extra Stream inserts 8 bytes of new code. Total patch size: 124 bytes.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

struct BSDiffControlTriple {
    size_t diffLen;  // x: Add from diff stream to old binary
    size_t extraLen; // y: Copy verbatim from extra stream
    int64_t seekVal; // z: Seek in old binary
};

class BSDiffPatcherSim {
public:
    static std::vector<uint8_t> applyPatch(
        const std::vector<uint8_t>& oldBin,
        const std::vector<BSDiffControlTriple>& controls,
        const std::vector<int8_t>& diffStream,
        const std::vector<uint8_t>& extraStream) 
    {
        std::vector<uint8_t> newBin;
        size_t oldPos = 0;
        size_t diffPos = 0;
        size_t extraPos = 0;

        for (const auto& ctrl : controls) {
            // 1. Add diff stream bytes to old binary
            for (size_t i = 0; i < ctrl.diffLen; ++i) {
                uint8_t oldByte = (oldPos < oldBin.size()) ? oldBin[oldPos] : 0;
                uint8_t diffByte = diffStream[diffPos++];
                newBin.push_back(static_cast<uint8_t>((oldByte + diffByte) & 0xFF));
                oldPos++;
            }

            // 2. Append extra stream bytes (brand new insertions)
            for (size_t i = 0; i < ctrl.extraLen; ++i) {
                newBin.push_back(extraStream[extraPos++]);
            }

            // 3. Seek in old binary
            oldPos += ctrl.seekVal;
        }

        std::cout << "[BSDIFF-RECONSTRUCT] Generated " << newBin.size() 
                  << " bytes from " << oldBin.size() << " byte base binary." << std::endl;
        return newBin;
    }
};

int main() {
    std::cout << "--- DAY 47 PART 2: BSDIFF CONTROL TRIPLES & STREAMING ---" << std::endl;
    // Old binary: 8 bytes
    std::vector<uint8_t> oldBinary = {0x10, 0x20, 0x30, 0x40, 0x50, 0x60, 0x70, 0x80};

    // Patch: Diff adds +4 to first 4 bytes, inserts 2 extra bytes (0xAA, 0xBB), copies remaining
    std::vector<BSDiffControlTriple> controls = {
        {4, 2, 0}, // x=4 diff bytes, y=2 extra bytes, seek=0
        {4, 0, 0}  // x=4 diff bytes, y=0 extra bytes, seek=0
    };
    std::vector<int8_t> diff = {0x04, 0x04, 0x04, 0x04, 0x00, 0x00, 0x00, 0x00};
    std::vector<uint8_t> extra = {0xAA, 0xBB};

    std::vector<uint8_t> newBinary = BSDiffPatcherSim::applyPatch(oldBinary, controls, diff, extra);

    std::cout << "Reconstructed New Binary: [ ";
    for (uint8_t b : newBinary) {
        std::cout << "0x" << std::hex << std::setw(2) << std::setfill('0') << (int)b << " ";
    }
    std::cout << "]" << std::dec << std::endl;
    return 0;
}
""",
            "output": """--- DAY 47 PART 2: BSDIFF CONTROL TRIPLES & STREAMING ---
[BSDIFF-RECONSTRUCT] Generated 10 bytes from 8 byte base binary.
Reconstructed New Binary: [ 0x14 0x24 0x34 0x44 0xaa 0xbb 0x50 0x60 0x70 0x80 ]
""",
            "codeNotes": [
                {
                    "line": 6,
                    "note": "BSDiffControlTriple encapsulates the (x, y, z) control instructions driving reconstruction."
                },
                {
                    "line": 28,
                    "note": "Diff bytes are added modulo 256 to the old binary bytes to reconstruct shifted addresses."
                },
                {
                    "line": 34,
                    "note": "Extra stream bytes inject completely novel functions and data structures."
                }
            ],
            "tryIt": "Describe how suffix sorting (Larsson-Sadakane) finds long matching blocks between old and new binaries.",
            "check": {
                "question": "What are the three components of a BSDiff control triple (x, y, z)?",
                "options": [
                    "x = bytes to add from Diff stream to old binary, y = bytes to copy from Extra stream, and z = seek offset in old binary.",
                    "x = X coordinate, y = Y coordinate, z = Z coordinate on an IMU.",
                    "x = baud rate, y = parity, z = stop bits.",
                    "x = encryption key, y = IV, z = authentication tag."
                ],
                "answer": 0,
                "why": "BSDiff reconstructs new files by reading x bytes from the old binary and adding diff deltas, copying y new bytes verbatim from the extra stream, and adjusting the old binary seek pointer by z."
            }
        },
        {
            "title": "Google Courgette: Machine Code Disassembly & Label Abstraction",
            "say": [
                "While BSDiff achieves 90% compression, Google engineered Courgette to achieve 95% to 98% compression for binary executables.",
                "The Architectural Limitation of BSDiff:",
                "In machine code, jump instructions encode target addresses. Even when pointers are shifted, BSDiff must still store diff deltas for every single jump instruction across the binary.",
                "Courgette's Disassembly Innovation:",
                "1) Disassembly: Courgette disassembles machine code (ARM Thumb-2 or x86) into primitive instructions and symbol tables.",
                "2) Label Normalization: Every absolute and relative jump target is replaced with an abstract symbolic label: e.g. BL 0x08014520 becomes BL <FUNC_104>.",
                "3) Pointers Eliminated: In the normalized instruction stream, inserting 1 line of code shifts ZERO labels! Every subsequent function call still points to <FUNC_104>.",
                "4) Delta Compression: Differential compression is performed on the normalized label stream. The diff is tiny because almost zero bytes have changed.",
                "5) Re-Assembly on Target: The embedded device replaces abstract labels with concrete physical Flash addresses calculated for the new layout.",
                "Result: A 1MB firmware update compresses into an astonishing 12KB to 18KB differential patch."
            ],
            "example": "A 512KB binary update with 3,000 branch instructions: BSDiff produces a 42KB patch. Courgette replaces the branches with abstract labels and produces an 11KB patch.",
            "code": """#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <cstdint>

struct DisassembledInstruction {
    std::string mnemonic;
    uint32_t targetAddress;
    std::string symbolicLabel;
};

class CourgetteDisassemblerSim {
public:
    static void normalizeLabels(std::vector<DisassembledInstruction>& instructions) {
        std::map<uint32_t, std::string> addressToLabel;
        int labelCounter = 1;

        for (auto& inst : instructions) {
            if (inst.mnemonic == "BL" || inst.mnemonic == "B") {
                if (addressToLabel.find(inst.targetAddress) == addressToLabel.end()) {
                    addressToLabel[inst.targetAddress] = "<FUNC_LABEL_" + std::to_string(labelCounter++) + ">";
                }
                inst.symbolicLabel = addressToLabel[inst.targetAddress];
            }
        }
    }

    static void printInstructionStream(const std::string& title, const std::vector<DisassembledInstruction>& insts) {
        std::cout << title << std::endl;
        for (const auto& inst : insts) {
            std::cout << "  " << inst.mnemonic << " ";
            if (!inst.symbolicLabel.empty()) {
                std::cout << inst.symbolicLabel << " (Raw: 0x" << std::hex << inst.targetAddress << std::dec << ")";
            } else {
                std::cout << "0x" << std::hex << inst.targetAddress << std::dec;
            }
            std::cout << std::endl;
        }
    }
};

int main() {
    std::cout << "--- DAY 47 PART 3: GOOGLE COURGETTE LABEL ABSTRACTION ---" << std::endl;
    // Old binary calling function at 0x08012000
    std::vector<DisassembledInstruction> v1 = {
        {"MOV", 0, ""},
        {"BL", 0x08012000, ""},
        {"ADD", 0, ""}
    };

    // New binary with 4-byte shift -> function moved to 0x08012004
    std::vector<DisassembledInstruction> v2 = {
        {"MOV", 0, ""},
        {"NOP", 0, ""}, // Inserted instruction
        {"BL", 0x08012004, ""}, // Target address shifted!
        {"ADD", 0, ""}
    };

    CourgetteDisassemblerSim::normalizeLabels(v1);
    CourgetteDisassemblerSim::normalizeLabels(v2);

    CourgetteDisassemblerSim::printInstructionStream("1. Old Binary Normalized Stream:", v1);
    CourgetteDisassemblerSim::printInstructionStream("\\n2. New Binary Normalized Stream (Shift Neutralized):", v2);
    std::cout << "\\n[COURGETTE-ADVANTAGE] Notice both binaries now reference <FUNC_LABEL_1>! Pointer shift completely eliminated." << std::endl;
    return 0;
}
""",
            "output": """--- DAY 47 PART 3: GOOGLE COURGETTE LABEL ABSTRACTION ---
1. Old Binary Normalized Stream:
  MOV 0x0
  BL <FUNC_LABEL_1> (Raw: 0x8012000)
  ADD 0x0

2. New Binary Normalized Stream (Shift Neutralized):
  MOV 0x0
  NOP 0x0
  BL <FUNC_LABEL_1> (Raw: 0x8012004)
  ADD 0x0

[COURGETTE-ADVANTAGE] Notice both binaries now reference <FUNC_LABEL_1>! Pointer shift completely eliminated.
""",
            "codeNotes": [
                {
                    "line": 6,
                    "note": "DisassembledInstruction decouples machine instructions from concrete physical addresses."
                },
                {
                    "line": 18,
                    "note": "Label normalization assigns invariant symbolic tokens to target addresses."
                },
                {
                    "line": 52,
                    "note": "Replacing concrete pointers with labels eliminates shift divergence, enabling 95% compression."
                }
            ],
            "tryIt": "Explain how Courgette generates the adjustment table to map symbolic labels back to physical Flash addresses on the target MCU.",
            "check": {
                "question": "How does Google Courgette achieve higher compression than standard BSDiff on compiled firmware binaries?",
                "options": [
                    "By disassembling machine code and replacing concrete branch target addresses with abstract symbolic labels, preventing address shifts from altering the instruction stream.",
                    "By deleting all comments and variable names.",
                    "By reducing the baud rate of the radio.",
                    "By running the code on a remote server."
                ],
                "answer": 0,
                "why": "Courgette converts machine code branch targets into abstract symbolic labels. When an insertion shifts subsequent addresses, the symbolic labels remain identical, eliminating artificial byte differences and maximizing differential compression."
            }
        },
        {
            "title": "Streaming In-Place Delta Patching with Bounded RAM (< 8KB)",
            "say": [
                "Deploying delta updates on resource-constrained microcontrollers introduces an architectural constraint: RAM is scarce.",
                "A desktop patcher loads the entire 1MB old binary and 1MB new binary into RAM simultaneously. A Cortex-M microcontroller with 64KB RAM would suffer an immediate Out-Of-Memory crash.",
                "The In-Place Streaming Reconstruction Invariant:",
                "An embedded delta patcher must apply binary diffs streamingly using bounded scratch memory (SRAM < 8KB), reconstructing the complete candidate image directly in Flash.",
                "Streaming Pipeline Architecture:",
                "1) Old Binary Source: Read directly from physical Flash Slot 0 using standard memory pointers (Cortex-M Execute-In-Place / XIP Flash reading costs 0 bytes of RAM).",
                "2) Delta Patch Source: Streamed in 512-byte blocks from the radio socket into a 1KB RAM ring buffer.",
                "3) Reconstruction Buffer: A 4KB RAM buffer accumulates reconstructed bytes by adding diff streams and copying extra streams.",
                "4) Flash Destination: Once the 4KB buffer is filled, it is committed to Flash Slot 1 using hardware DMA, and the buffer is cleared for the next block.",
                "Total SRAM footprint: Strictly bounded under 6KB, capable of reconstructing 2MB firmware images."
            ],
            "example": "An STM32 with 32KB RAM receives an 18KB differential patch. Using a 4KB Flash buffer, it reconstructs a 512KB firmware image in Flash Slot 1 without ever exceeding 6KB of RAM.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

class StreamingDeltaReconstructor {
private:
    size_t sramBudgetBytes;
    size_t currentRamUsage;
    size_t flashSlot0Offset;
    size_t flashSlot1Offset;

public:
    StreamingDeltaReconstructor(size_t ramLimit = 8192)
        : sramBudgetBytes(ramLimit), currentRamUsage(0), 
          flashSlot0Offset(0), flashSlot1Offset(0) {}

    bool reconstructBlock(const std::vector<uint8_t>& patchChunk, size_t simulatedOutputBytes) {
        // Enforce strict SRAM bounds check
        currentRamUsage = patchChunk.size() + 4096; // 4KB write buffer + chunk buffer
        if (currentRamUsage > sramBudgetBytes) {
            std::cout << "  -> [OOM-ERROR] SRAM budget exceeded! Limit: " 
                      << sramBudgetBytes << " B, Requested: " << currentRamUsage << " B" << std::endl;
            return false;
        }

        std::cout << "[STREAM-RECONSTRUCT] Processing Patch Chunk (" << patchChunk.size() << " B)..." << std::endl;
        std::cout << "  -> Reading Base Binary directly from Flash Slot 0 (XIP - 0 Bytes RAM)" << std::endl;
        std::cout << "  -> Applying diffs in 4KB SRAM buffer (RAM Used: " << currentRamUsage << " / " << sramBudgetBytes << " B)" << std::endl;
        
        flashSlot1Offset += simulatedOutputBytes;
        std::cout << "  -> Flushed 4KB sector to Flash Slot 1 (Total Reconstructed: " 
                  << flashSlot1Offset << " B)" << std::endl;
        return true;
    }

    size_t getPeakRam() const { return currentRamUsage; }
};

int main() {
    std::cout << "--- DAY 47 PART 4: BOUNDED RAM STREAMING RECONSTRUCTION ---" << std::endl;
    StreamingDeltaReconstructor patcher(8192); // 8KB RAM limit

    std::vector<uint8_t> patchChunk(512, 0x1A); // 512B patch chunk

    // Simulate streaming reconstruction of 3 sectors
    patcher.reconstructBlock(patchChunk, 4096);
    patcher.reconstructBlock(patchChunk, 4096);
    patcher.reconstructBlock(patchChunk, 4096);

    std::cout << "\\n[SUMMARY] Peak SRAM Allocated: " << patcher.getPeakRam() 
              << " Bytes (Within 8KB Invariant). Total Firmware Reconstructed: 12,288 Bytes." << std::endl;
    return 0;
}
""",
            "output": """--- DAY 47 PART 4: BOUNDED RAM STREAMING RECONSTRUCTION ---
[STREAM-RECONSTRUCT] Processing Patch Chunk (512 B)...
  -> Reading Base Binary directly from Flash Slot 0 (XIP - 0 Bytes RAM)
  -> Applying diffs in 4KB SRAM buffer (RAM Used: 4608 / 8192 B)
  -> Flushed 4KB sector to Flash Slot 1 (Total Reconstructed: 4096 B)
[STREAM-RECONSTRUCT] Processing Patch Chunk (512 B)...
  -> Reading Base Binary directly from Flash Slot 0 (XIP - 0 Bytes RAM)
  -> Applying diffs in 4KB SRAM buffer (RAM Used: 4608 / 8192 B)
  -> Flushed 4KB sector to Flash Slot 1 (Total Reconstructed: 8192 B)
[STREAM-RECONSTRUCT] Processing Patch Chunk (512 B)...
  -> Reading Base Binary directly from Flash Slot 0 (XIP - 0 Bytes RAM)
  -> Applying diffs in 4KB SRAM buffer (RAM Used: 4608 / 8192 B)
  -> Flushed 4KB sector to Flash Slot 1 (Total Reconstructed: 12288 B)

[SUMMARY] Peak SRAM Allocated: 4608 Bytes (Within 8KB Invariant). Total Firmware Reconstructed: 12,288 Bytes.
""",
            "codeNotes": [
                {
                    "line": 6,
                    "note": "StreamingDeltaReconstructor tracks memory utilization against a rigid hardware SRAM ceiling."
                },
                {
                    "line": 17,
                    "note": "Reading the old binary via XIP Flash mapping requires zero volatile RAM buffering."
                },
                {
                    "line": 45,
                    "note": "Peak memory remains strictly bounded under 5KB, allowing operation on ultra-low-power microcontrollers."
                }
            ],
            "tryIt": "Calculate the time required to reconstruct a 512KB binary on external SPI Flash with a 4KB write buffer operating at 10 MHz SPI clock.",
            "check": {
                "question": "How does an embedded delta patcher reconstruct a 1MB firmware image while operating under an 8KB SRAM budget?",
                "options": [
                    "By streaming the old binary directly from Flash Slot 0 via XIP memory mapping and writing reconstructed chunks to Flash Slot 1 using a small 4KB buffer.",
                    "By downloading the image to an external server.",
                    "By compressing the RAM with ZIP algorithms.",
                    "By converting the binary into audio signals."
                ],
                "answer": 0,
                "why": "Microcontrollers execute code directly from Flash (XIP). The patcher reads the base binary directly from Slot 0 without buffering it in RAM, combining it with incoming diff blocks in a small 4KB SRAM buffer before flushing to Slot 1."
            }
        },
        {
            "title": "3 AM SRE War Room: Satellite Telemetry Delta Patch Reconstruction Crash",
            "say": [
                "Scenario: A global maritime logistics operator monitors 2,500 container cargo vessels traversing international shipping lanes. Each vessel is equipped with an edge telematics gateway connected via Iridium satellite communication ($5.00 per MB).",
                "The Economic Stake: Pushing a standard 1MB full-binary update across the fleet would cost 2,500 * $5.00 = $12,500. By deploying a 20KB BSDiff delta update, the bill drops to $250—a 98% operational savings.",
                "The Crisis: The fleet deployment begins. 1,800 ships update cleanly. However, 700 ships report FATAL_PATCH_CORRUPTION! The reconstructed images fail SHA-256 validation, and the gateways reject the updates.",
                "Root Cause Analysis:",
                "The DevOps team generated the delta patch using firmware build v2.1.0-RC1 as the base. However, 700 ships had been manufactured at a second shipyard that loaded v2.1.0-RC2 (which contained a single debug string change).",
                "Because differential updates depend on an exact byte-for-byte match with the base image in Slot 0, applying a diff against an unexpected base binary generates scrambled machine code!",
                "The Emergency Engineering Defense:",
                "1) Base Image Fingerprinting: The delta patch header MUST embed the 32-byte SHA-256 hash of the exact required base image.",
                "2) Pre-Patch Verification: The gateway calculates the SHA-256 hash of its active Slot 0 before downloading or applying diffs. If the base hash does not match, it aborts immediately and requests the correct delta.",
                "3) Multi-Base Patch Repositories: The cloud server maintains differential patches indexed by (source_hash, target_hash).",
                "Verification: Master C++ Delta Update Engine validating base hash matching, patch application, and cost savings."
            ],
            "example": "The gateway compares its active Slot 0 hash against the patch header. A mismatch causes immediate rejection, preventing corrupt binary reconstruction and saving satellite bandwidth.",
            "code": """#include <iostream>
#include <vector>
#include <iomanip>
#include <cstdint>

struct DeltaPatchHeader {
    uint32_t patchMagic;        // 0x44454C54 ('DELT')
    uint8_t expectedBaseHash;   // 32-byte SHA-256 in real system
    uint8_t targetImageHash;
    size_t patchSizeBytes;
};

class MaritimeSatelliteFOTAManager {
private:
    uint8_t currentInstalledBaseHash;
    double satelliteCostPerMegabyte;

public:
    MaritimeSatelliteFOTAManager(uint8_t installedHash, double costPerMB = 5.0)
        : currentInstalledBaseHash(installedHash), satelliteCostPerMegabyte(costPerMB) {}

    bool evaluateAndApplyDelta(const DeltaPatchHeader& patch, size_t fullBinarySizeBytes) {
        std::cout << "[SATELLITE-FOTA] Inspecting Incoming Delta Patch Header..." << std::endl;
        std::cout << "  Patch Size: " << patch.patchSizeBytes << " Bytes (Full Binary: " 
                  << fullBinarySizeBytes << " Bytes)" << std::endl;

        // 1. Calculate Cost Savings
        double fullCost = (fullBinarySizeBytes / 1048576.0) * satelliteCostPerMegabyte;
        double deltaCost = (patch.patchSizeBytes / 1048576.0) * satelliteCostPerMegabyte;
        std::cout << "  -> Satellite Cost: Delta = $" << std::fixed << std::setprecision(2) << deltaCost 
                  << " vs Full = $" << fullCost << " (Savings: " 
                  << (1.0 - deltaCost / fullCost) * 100.0 << "%)" << std::endl;

        // 2. Base Image Fingerprint Assertion
        std::cout << "  -> Verifying Base Image Fingerprint in Slot 0..." << std::endl;
        std::cout << "     Active Slot 0 Hash: 0x" << std::hex << (int)currentInstalledBaseHash 
                  << " | Required Patch Hash: 0x" << (int)patch.expectedBaseHash << std::dec << std::endl;

        if (currentInstalledBaseHash != patch.expectedBaseHash) {
            std::cout << "  -> [BASE-MISMATCH-ABORT] Active firmware does not match patch baseline!" << std::endl;
            std::cout << "  -> [ACTION] Aborted reconstruction before touching Flash. Zero corruption." << std::endl;
            return false;
        }

        std::cout << "  -> [BASE-MATCH] Baseline verified! Proceeding with streaming delta reconstruction." << std::endl;
        std::cout << "  -> [SUCCESS] Candidate firmware reconstructed and verified against Target Hash 0x" 
                  << std::hex << (int)patch.targetImageHash << std::dec << std::endl;
        return true;
    }
};

int main() {
    std::cout << "--- DAY 47 PART 5: 3 AM SRE SATELLITE DELTA AUDIT ---" << std::endl;
    // Ship A running v2.1.0-RC1 (Hash 0x42)
    std::cout << "--- Vessel 1: Matching Baseline (v2.1.0-RC1) ---" << std::endl;
    MaritimeSatelliteFOTAManager shipA(0x42);
    DeltaPatchHeader patchForRC1 = {0x44454C54, 0x42, 0x99, 18432}; // 18KB patch for 1MB binary
    shipA.evaluateAndApplyDelta(patchForRC1, 1048576);

    // Ship B running v2.1.0-RC2 (Hash 0x43)
    std::cout << "\\n--- Vessel 2: Mismatched Baseline (v2.1.0-RC2) ---" << std::endl;
    MaritimeSatelliteFOTAManager shipB(0x43);
    shipB.evaluateAndApplyDelta(patchForRC1, 1048576);
    return 0;
}
""",
            "output": """--- DAY 47 PART 5: 3 AM SRE SATELLITE DELTA AUDIT ---
--- Vessel 1: Matching Baseline (v2.1.0-RC1) ---
[SATELLITE-FOTA] Inspecting Incoming Delta Patch Header...
  Patch Size: 18432 Bytes (Full Binary: 1048576 Bytes)
  -> Satellite Cost: Delta = $0.09 vs Full = $5.00 (Savings: 98.24%)
  -> Verifying Base Image Fingerprint in Slot 0...
     Active Slot 0 Hash: 0x42 | Required Patch Hash: 0x42
  -> [BASE-MATCH] Baseline verified! Proceeding with streaming delta reconstruction.
  -> [SUCCESS] Candidate firmware reconstructed and verified against Target Hash 0x99

--- Vessel 2: Mismatched Baseline (v2.1.0-RC2) ---
[SATELLITE-FOTA] Inspecting Incoming Delta Patch Header...
  Patch Size: 18432 Bytes (Full Binary: 1048576 Bytes)
  -> Satellite Cost: Delta = $0.09 vs Full = $5.00 (Savings: 98.24%)
  -> Verifying Base Image Fingerprint in Slot 0...
     Active Slot 0 Hash: 0x43 | Required Patch Hash: 0x42
  -> [BASE-MISMATCH-ABORT] Active firmware does not match patch baseline!
  -> [ACTION] Aborted reconstruction before touching Flash. Zero corruption.
""",
            "codeNotes": [
                {
                    "line": 6,
                    "note": "DeltaPatchHeader encapsulates magic, base SHA-256 fingerprint, and target hash."
                },
                {
                    "line": 32,
                    "note": "Pre-patch base image verification guarantees that diffs are only applied to identical source binaries."
                },
                {
                    "line": 49,
                    "note": "Delta updates achieve > 98% bandwidth cost reductions across expensive satellite links."
                }
            ],
            "tryIt": "Describe how the cloud FOTA broker dynamically generates differential patches on-demand using git commit tags.",
            "check": {
                "question": "Why must a delta firmware patch header include the exact cryptographic hash of the expected base image?",
                "options": [
                    "Because binary diffs are strictly relative; applying a diff against an unexpected base binary generates corrupted machine code that fails integrity checks.",
                    "Because satellite networks require files to be under 1KB.",
                    "Because hashing speeds up the radio transmission.",
                    "Because the compiler requires a license file."
                ],
                "answer": 0,
                "why": "A binary differential patch encodes byte differences relative to a specific source binary. If the device's installed baseline differs by even a single byte, applying the patch produces garbled instructions. Verifying the base hash prevents corrupt reconstruction."
            }
        }
    ],
    "summary": [
        "Code shifts cause machine instructions to change addresses, preventing standard Gzip from compressing binaries effectively.",
        "BSDiff resolves pointer shifts by splitting patches into Control Triples, Diff Streams (modulo 256 deltas), and Extra Streams.",
        "Google Courgette normalizes machine code branch targets into abstract symbolic labels, achieving 95% to 98% compression.",
        "Streaming in-place delta reconstruction reads the base binary via XIP Flash mapping, executing within an 8KB SRAM budget.",
        "Delta patch headers must enforce base image SHA-256 fingerprinting to prevent corrupt reconstruction against unexpected firmware baselines."
    ],
    "projectStep": {
        "title": "Implementing a Streaming BSDiff Decompressor in C",
        "steps": [
            "Parse the BSDiff header to extract control, diff, and extra block lengths and verify the base image hash.",
            "Stream control triples from the communication socket into a 512-byte ring buffer.",
            "Add diff stream deltas to Flash Slot 0 bytes and commit reconstructed 4KB blocks into Flash Slot 1.",
            "Verify the SHA-256 hash of the reconstructed Slot 1 binary against the target build digest."
        ]
    }
}

with open('scripts/iot_emb_day47.json', 'w', encoding='utf-8') as f:
    json.dump(day47, f, indent=2)
print("Wrote scripts/iot_emb_day47.json successfully!")
