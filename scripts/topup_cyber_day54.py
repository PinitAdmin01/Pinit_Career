import json
import re

topup_p2 = [
    "Delving deeper into memory forensics, investigators leverage advanced Volatility 3 plugins to analyze process execution context and kernel integrity. The `windows.cmdline` plugin reconstructs the exact command-line arguments passed to processes at launch, exposing encoded PowerShell cradles and hidden script flags that are never logged to disk. To detect sophisticated rootkits attempting to hide malicious DLLs, investigators execute `windows.ldrmodules`. In Windows, a legitimately loaded DLL is tracked in three distinct doubly-linked lists within the Process Environment Block (PEB): `InLoadOrderModuleList`, `InMemoryOrderModuleList`, and `InInitializationOrderModuleList`. When malware executes reflective DLL injection or unlinks itself from the PEB to evade detection, `ldrmodules` cross-references the PEB lists against the process's Virtual Address Descriptor (VAD) tree, exposing mapped DLLs that have been severed from standard tracking structures.",
    "Furthermore, on Linux systems, memory forensics provides vital visibility into kernel-level rootkits. Sophisticated Linux rootkits hook system call tables (`sys_call_table`) or manipulate the kernel module linked list (`modules`) to conceal processes and network sockets from user-space tools like `ps` and `netstat`. The Volatility plugin `linux.check_modules` compares the kernel's active module list with the kernel symbol table, immediately identifying unlinked or hidden `.ko` kernel modules. By parsing raw kernel memory directly from the acquired LiME image, memory forensics bypasses all user-space and kernel-space rootkit deceptions, presenting investigators with objective ground truth."
]

topup_p3 = [
    "To uncover historical filesystem activity, forensic investigators analyze Volume Shadow Copies (VSS) on Windows NTFS volumes. Windows automatically creates periodic volume shadow copies to support system restore points and backup snapshots. Because shadow copies capture differential block-level snapshots of the entire storage volume over time, they function as an immutable historical time machine. When a ransomware payload encrypts a victim's active files and deletes local backups, investigators mount historical shadow copies using tools like `vshadowmount`. This frequently enables responders to recover unencrypted versions of critical corporate databases created hours before the attack commenced, completely neutralizing the ransomware's extortion leverage.",
    "Similarly, on enterprise Linux servers utilizing the EXT4 filesystem, forensic examiners inspect the Journaling Block Device (JBD2) subsystem. The EXT4 journal acts as a circular transaction buffer on disk, recording metadata changes and directory entries before they are committed to persistent inodes. When an adversary deletes their dropper scripts using `rm -rf`, the file records are immediately removed from directory indexes. However, the raw transaction blocks remain preserved in the EXT4 journal for hours or days. By parsing the journal directly using specialized forensic tools, examiners reconstruct the exact sequence of file creations and deletions, extracting full deleted file payloads long after standard directory listings have been wiped."
]

topup_p4 = [
    "To enrich super-timelines with deep execution evidence, forensic examiners integrate Windows Registry execution artifacts: specifically, the Shimcache (Application Compatibility Cache) and `Amcache.hve`. Located in the `SYSTEM` registry hive, the Shimcache tracks executable files executed on the system, recording full file paths, exact file sizes, and the `$STANDARD_INFORMATION` last-modified timestamp of the binary at the time of execution. Complementing this is `Amcache.hve`: a dedicated registry hive that records the cryptographic SHA-1 hash, PE header compile timestamp, and publisher details of every binary and driver that has ever executed on the endpoint.",
    "Furthermore, forensic timeline reconstruction relies on Windows Prefetch files (`C:\\Windows\\Prefetch\\*.pf`). Designed by the Windows operating system to optimize application launch performance, the Memory Manager creates a `.pf` file the first time an executable runs. The prefetch file records the total execution run count, the last eight execution timestamps, the volume serial number, and an exhaustive list of every file and DLL loaded by the application during its first ten seconds of execution. In a super-timeline, prefetch artifacts provide incontrovertible evidence proving not only that an adversary's malware existed on disk, but that the binary was actively executed by the operating system."
]

topup_p5 = [
    "Synthesizing these digital forensics protocols into enterprise operational readiness requires enforcing rigorous Evidence Vault Security and ISO/IEC 27037 compliance. In high-assurance corporate environments, acquired disk and memory images must never reside on standard shared enterprise network drives. Master forensic evidence files must be stored on dedicated, air-gapped forensic storage networks utilizing encrypted LTO magnetic tape archives or write-once cloud object storage buckets. Access to the evidence repository requires dual-custody authorization: requiring cryptographic sign-offs from both the Lead Forensic Examiner and Corporate Legal Counsel before evidence can be checked out for analysis.",
    "Furthermore, enterprise DFIR platforms maintain automated Evidence Tracking Ledgers utilizing cryptographic HMAC signatures and hardware security module (HSM) timestamping. Every analytical procedure performed—whether mounting a disk image, extracting an MFT record, or dumping memory strings—is automatically logged with the examiner's cryptographic signature, workstation identifier, and software tool version. When presenting findings to corporate boards of directors, regulatory enforcement agencies (such as the SEC or FTC), or federal grand juries, this unbroken scientific rigor guarantees that forensic conclusions remain unassailable, providing definitive clarity in the wake of the most sophisticated cyber incidents."
]

with open("scripts/create_cyber_day54_data.py", "r", encoding="utf-8") as f:
    text = f.read()

new_text = text
for i, topup in enumerate([topup_p2, topup_p3, topup_p4, topup_p5], 2):
    topup_str = ",\n    " + ",\n    ".join(json.dumps(s) for s in topup)
    pattern = rf'(say_p{i}\s*=\s*\[[\s\S]*?)(\n\])'
    def make_repl(ts):
        return lambda m: m.group(1) + ts + m.group(2)
    new_text = re.sub(pattern, make_repl(topup_str), new_text, count=1)

with open("scripts/create_cyber_day54_data.py", "w", encoding="utf-8") as f:
    f.write(new_text)

print("Updated create_cyber_day54_data.py with topups safely!")
