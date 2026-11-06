"""
Build Day 26 JSON for Course: bcom_aud (Auditing & Forensic Accounting)
Topic: Digital Forensics, E-Discovery (EDRM) & Electronic Evidence Admissibility: Section 65B of Indian Evidence Act
"""
import json

day_data = {
    "day": 26,
    "title": "Digital Forensics, E-Discovery & Electronic Evidence Admissibility: Section 65B & NIST SP 800-86",
    "parts": [
        {
            "title": "Digital Forensic Principles, Evidence Custody & ISO/IEC 27037",
            "say": [
                "Digital forensics in statutory assurance and financial crime investigations represents the scientific identification, preservation, collection, analysis, and presentation of digital evidence. In modern corporate fraud examinations, financial transactions leave indelible digital footprints across cloud ERP clusters, local SSD drives, mobile devices, and memory logs. Digital evidence is inherently volatile, fragile, and easily altered, destroyed, or fabricated; consequently, forensic investigators must adhere strictly to international standards, primarily ISO/IEC 27037 (Guidelines for identification, collection, acquisition, and preservation of digital evidence) and NIST SP 800-86.",
                "The Order of Volatility is the fundamental scientific principle dictating evidence acquisition: volatile data evaporates immediately upon device shutdown and must be acquired first. The strict acquisition sequence comprises: (1) CPU Registers and Cache memory; (2) Volatile System Routing tables, ARP cache, process tables, and kernel memory (RAM); (3) Temporary file systems (swap space); (4) Non-volatile permanent storage (hard drives, SSDs, flash storage); (5) Remote logging and monitoring data; and (6) Physical backup media and archival tapes.",
                "To ensure legal admissibility, the investigator must execute Forensic Bitstream Imaging using hardware write-blockers that prevent any data modification on the source media. A bitstream copy creates an exact, sector-by-sector, physical duplicate of the storage device, preserving unallocated clusters, slack space, and deleted file fragments.",
                "Furthermore, Cryptographic Chain of Custody must be maintained: the forensic investigator calculates cryptographic hash digests (SHA-256 and MD5) of the original evidence drive immediately upon seizure and compares them against the forensic image. Any variance in a single bit invalidates the evidence in a court of law."
            ],
            "example": "During a corporate bribery investigation, forensic accountants seize the CFO's laptop. Rather than turning the machine off or booting into Windows, the team captures volatile RAM using a bootable USB capture tool, acquiring live encryption keys. The team connects the NVMe SSD through a Tableau hardware write-blocker, generates a raw DD bitstream disk image, and computes an SHA-256 hash. The hash of the physical drive exactly matches the image, establishing an unbroken chain of custody.",
            "code": '''import hashlib

def verify_forensic_chain_of_custody(
    evidence_id: str,
    original_media_bytes: bytes,
    acquired_image_bytes: bytes,
    hardware_write_blocker_engaged: bool
) -> dict:
    # Compute NIST SP 800-86 Cryptographic Hashes
    orig_sha256 = hashlib.sha256(original_media_bytes).hexdigest()
    orig_md5 = hashlib.md5(original_media_bytes).hexdigest()
    
    img_sha256 = hashlib.sha256(acquired_image_bytes).hexdigest()
    img_md5 = hashlib.md5(acquired_image_bytes).hexdigest()
    
    hashes_match = (orig_sha256 == img_sha256) and (orig_md5 == img_md5)
    is_admissible = hashes_match and hardware_write_blocker_engaged
    
    if is_admissible:
        status = "FORENSIC_INTEGRITY_VERIFIED_COURT_ADMISSIBLE"
        custody_verdict = "CRYPTOGRAPHIC_CHAIN_OF_CUSTODY_INTACT"
    elif not hardware_write_blocker_engaged:
        status = "COMPROMISED_EVIDENCE_WRITE_BLOCKER_OMITTED"
        custody_verdict = "INADMISSIBLE_POTENTIAL_METADATA_CONTAMINATION"
    else:
        status = "FATAL_HASH_MISMATCH_DATA_ALTERATION_DETECTED"
        custody_verdict = "EVIDENCE_CORRUPTED_INADMISSIBLE_IN_TRIAL"
        
    return {
        "evidence_id": evidence_id,
        "original_sha256": orig_sha256,
        "image_sha256": img_sha256,
        "write_blocker_active": hardware_write_blocker_engaged,
        "integrity_status": status,
        "legal_admissibility": custody_verdict
    }

sample_data = b"CONFIDENTIAL_OFFSHORE_WIRE_TRANSFER_LOGS_APEX_CORP_2026"
forensic_test = verify_forensic_chain_of_custody(
    evidence_id="EVID-2026-NVME-001",
    original_media_bytes=sample_data,
    acquired_image_bytes=sample_data,
    hardware_write_blocker_engaged=True
)
print("Digital Forensic Chain of Custody & ISO/IEC 27037 Engine:")
print(f"  Evidence Tag          : {forensic_test['evidence_id']}")
print(f"  Original SHA-256      : {forensic_test['original_sha256']}")
print(f"  Acquired Image SHA-256: {forensic_test['image_sha256']}")
print(f"  Write Blocker Engaged : {forensic_test['write_blocker_active']}")
print(f"  Integrity Status      : {forensic_test['integrity_status']}")
print(f"  Courtroom Admissibility: {forensic_test['legal_admissibility']}")
''',
            "tryIt": "Set hardware_write_blocker_engaged to False to observe how metadata contamination immediately renders the evidence inadmissible.",
            "check": {
                "question": "What is the primary scientific reason for using a hardware write-blocker during digital evidence acquisition under ISO/IEC 27037 and NIST SP 800-86?",
                "options": [
                    "To physically and electronically prevent any modification, write, or metadata alteration on the original source storage device during imaging",
                    "To speed up the computer's CPU clock frequency",
                    "To decrypt password-protected PDF bank statements automatically",
                    "To delete unwanted files from the suspect's computer before imaging"
                ],
                "answerIndex": 0,
                "why": "A hardware write-blocker permits read commands while intercepting and blocking all write commands, guaranteeing that the original storage drive remains bit-for-bit unchanged."
            }
        },
        {
            "title": "Electronic Evidence Admissibility & Section 65B Certification (Indian Evidence Act / BSA)",
            "say": [
                "In judicial proceedings and regulatory tribunals in India (such as NCLT, High Courts, and Special CBI Courts), digital evidence—including email communications, ERP database dumps, Excel spreadsheets, WhatsApp chat exports, and CCTV video files—is classified as 'electronic records'. Under Section 65B of the Indian Evidence Act, 1872 (and its corresponding modern codification under Section 63 of the Bharatiya Sakshya Adhiniyam, 2023 - BSA), electronic records are NOT admissible in evidence unless accompanied by a mandatory statutory certificate.",
                "The Supreme Court of India delivered the landmark, non-negotiable precedent in Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal (2020), holding that a Section 65B certificate is a CONDITION PRECEDENT to the admissibility of electronic evidence in court. Verbal testimony, uncertified printouts, or plain flash drive submissions are summarily rejected as inadmissible hearsay.",
                "A legally valid Section 65B certificate must strictly fulfill four statutory conditions: (1) The electronic record must have been produced by the computer during the period over which the computer was used regularly to store or process information for the purposes of any activities regularly carried on by a person having lawful control; (2) During the said period, information of the kind contained in the electronic record was regularly fed into the computer in the ordinary course of business; (3) Throughout the material part of the said period, the computer was operating properly (or if not, the malfunction did not affect the accuracy of the electronic record); and (4) The information contained in the electronic record reproduces or is derived from such information fed into the computer in the ordinary course of business.",
                "The certificate must be signed by an officer occupying a responsible official position in relation to the operation of the relevant device or the management of the relevant activities."
            ],
            "example": "In a corporate trial prosecuting an executive for diverting Rs 45 Crore via fraudulent ERP payment vouchers, the prosecution submits ERP database exports. The Head of Information Security and the Chief Technology Officer execute a formal Section 65B Certificate detailing: server IP addresses, automated Oracle ERP transaction logging, continuous operating uptime, and SHA-256 hash digests. The NCLT admits the electronic evidence, validating the prosecution's case.",
            "code": '''def generate_section65b_evidentiary_certificate(
    case_title: str,
    device_description: str,
    certifier_name: str,
    certifier_designation: str,
    device_operating_properly: bool,
    produced_in_ordinary_course: bool,
    data_hash_sha256: str
) -> dict:
    is_statutories_met = device_operating_properly and produced_in_ordinary_course and len(data_hash_sha256) == 64
    
    if is_statutories_met:
        legal_status = "CERTIFICATE_LEGALLY_VALID_EVIDENCE_ADMISSIBLE_UNDER_SEC_65B"
        cert_text = (
            f"CERTIFICATE UNDER SECTION 65B OF THE INDIAN EVIDENCE ACT, 1872\\n"
            f"IN THE MATTER OF: {case_title}\\n\\n"
            f"I, {certifier_name}, occupying the responsible official position of {certifier_designation}, do hereby solemnly state:\\n"
            f"1. That I have lawful control over the management and operation of {device_description}.\\n"
            f"2. That the electronic records (ERP transaction logs and databases) were produced by the said computer system "
            f"during the period in which it was regularly operated in the ordinary course of business activities.\\n"
            f"3. That during the material period, the computer system was operating properly and at all material times without defect.\\n"
            f"4. That the cryptographic hash of the reproduced electronic evidence is verified as SHA-256: {data_hash_sha256}.\\n\\n"
            f"Verified at Mumbai on this 15th day of May, 2026.\\n"
            f"Signature: _______________________\\n"
            f"({certifier_name}, {certifier_designation})"
        )
    else:
        legal_status = "CERTIFICATE_DEFECTIVE_INADMISSIBLE_UNDER_ARJUN_KHOTKAR_PRECEDENT"
        cert_text = "ERROR: Statutory conditions under Section 65B(2) not satisfied. Certificate cannot be executed."
        
    return {
        "case": case_title,
        "certifier": f"{certifier_name} ({certifier_designation})",
        "admissibility_status": legal_status,
        "is_court_admissible": is_statutories_met,
        "certificate_statutory_text": cert_text
    }

cert_res = generate_section65b_evidentiary_certificate(
    case_title="Serious Fraud Investigation Office (SFIO) v. Apex Global Infra Ltd",
    device_description="Production SAP ERP Database Server Cluster (IP: 10.45.2.100)",
    certifier_name="Rajiv Nambiar",
    certifier_designation="Chief Information Security Officer & IT Director",
    device_operating_properly=True,
    produced_in_ordinary_course=True,
    data_hash_sha256="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
)
print("Section 65B Electronic Evidence Admissibility Engine:")
print(f"  Case Title            : {cert_res['case']}")
print(f"  Certifying Officer    : {cert_res['certifier']}")
print(f"  Admissibility Status  : {cert_res['admissibility_status']}")
print(f"  Court Admissible      : {cert_res['is_court_admissible']}")
print("  Statutory Section 65B Certificate Text:")
print(cert_res['certificate_statutory_text'])
''',
            "tryIt": "Set device_operating_properly to False to observe how failure to meet statutory uptime conditions invalidates the Section 65B certificate.",
            "check": {
                "question": "What is the landmark legal rule established by the Supreme Court of India in Arjun Panditrao Khotkar (2020) regarding Section 65B of the Indian Evidence Act?",
                "options": [
                    "A certificate under Section 65B is a mandatory condition precedent for the admissibility of electronic records in court; oral evidence cannot substitute for a written certificate",
                    "Section 65B certificates are entirely optional and only required if the judge asks for one",
                    "Electronic records are automatically inadmissible in all civil trials",
                    "A Section 65B certificate must be signed by the President of India"
                ],
                "answerIndex": 0,
                "why": "The Supreme Court in Arjun Panditrao Khotkar definitively held that a Section 65B(4) certificate is an absolute mandatory condition precedent for the admissibility of electronic evidence."
            }
        },
        {
            "title": "The Electronic Discovery Reference Model (EDRM): Forensic Data Culling",
            "say": [
                "In multi-gigabyte corporate fraud investigations involving tens of thousands of emails, contracts, chat logs, and financial records, searching through raw data manually is economically and technically impossible. Forensic accountants deploy the Electronic Discovery Reference Model (EDRM), the global standard framework governing electronic discovery and investigations.",
                "The EDRM framework spans seven systematic stages: (1) Identification—locating potential sources of Electronically Stored Information (ESI) across custodians and enterprise servers; (2) Preservation—issuing Legal Holds to freeze data destruction and suspend routine email auto-deletion policies; (3) Collection—executing forensically sound bitstream acquisitions; (4) Processing—de-NISTing, deduplicating, and extracting file text and metadata; (5) Review—evaluating documents for relevance and legal attorney-client privilege; (6) Analysis—applying conceptual clustering, keyword filtering, and communication link graphing; and (7) Production—exporting relevant documents in standard formats (TIFF/PDF with load files).",
                "Forensic Processing relies on two critical mathematical reduction techniques: (a) De-NISTing—comparing file MD5 hashes against the National Software Reference Library (NSRL) maintained by NIST to automatically discard millions of known system and application files (e.g., .dll, .exe, font files) that have zero investigative relevance; and (b) Global Custodian Deduplication—calculating cryptographic file hashes to eliminate identical duplicate email copies sent across 50 recipients, collapsing data volume by 60% to 80%.",
                "Subsequent keyword culling with Boolean operators (AND, OR, NOT, NEAR) isolates the critical evidentiary corpus."
            ],
            "example": "In an e-discovery investigation of an enterprise kickback conspiracy, the team ingests 1.2 Terabytes containing 450,000 files from 12 corporate custodians. De-NISTing discards 180,000 system files (40% reduction). Custodian deduplication eliminates 160,000 duplicate emails. Applying targeted Boolean queries ('kickback' OR 'consulting' NEAR 'offshore') narrows the remaining corpus down to 420 high-value evidence documents ready for legal trial production.",
            "code": '''def execute_edrm_processing_and_culling_pipeline(
    raw_files_count: int,
    raw_volume_gb: float,
    system_known_files_count: int, # NIST NSRL matches
    duplicate_files_count: int,
    keyword_hits_count: int,
    privileged_attorney_client_hits: int
) -> dict:
    # Stage 1: De-NISTing (remove known operating system files)
    after_denist_count = raw_files_count - system_known_files_count
    
    # Stage 2: Global Deduplication
    unique_custodian_files = after_denist_count - duplicate_files_count
    
    # Stage 3: Keyword Search Culling
    responsive_documents = min(unique_custodian_files, keyword_hits_count)
    
    # Stage 4: Privilege Review (Attorney-Client privilege withheld)
    final_production_count = max(0, responsive_documents - privileged_attorney_client_hits)
    
    overall_reduction_pct = ((raw_files_count - final_production_count) / raw_files_count * 100.0) if raw_files_count > 0 else 0.0
    
    return {
        "raw_ingested_files": raw_files_count,
        "raw_volume_gb": raw_volume_gb,
        "denisted_system_files_discarded": system_known_files_count,
        "duplicate_copies_eliminated": duplicate_files_count,
        "unique_evidentiary_files": unique_custodian_files,
        "keyword_responsive_files": responsive_documents,
        "privileged_withheld_files": privileged_attorney_client_hits,
        "final_trial_production_corpus": final_production_count,
        "data_reduction_efficiency_pct": round(overall_reduction_pct, 1),
        "edrm_pipeline_verdict": "DATA_REDUCTION_AND_CULLING_SUCCESSFUL_TRIAL_READY"
    }

edrm_res = execute_edrm_processing_and_culling_pipeline(
    raw_files_count=450000,
    raw_volume_gb=1200.0,
    system_known_files_count=180000,
    duplicate_files_count=160000,
    keyword_hits_count=1850,
    privileged_attorney_client_hits=120
)
print("EDRM Electronic Discovery Processing & Culling Engine:")
print(f"  Raw Ingested Files    : {edrm_res['raw_ingested_files']:,} ({edrm_res['raw_volume_gb']} GB)")
print(f"  De-NISTed System Files: -{edrm_res['denisted_system_files_discarded']:,}")
print(f"  Duplicate Elimination : -{edrm_res['duplicate_copies_eliminated']:,}")
print(f"  Unique Evidentiary Set: {edrm_res['unique_evidentiary_files']:,} files")
print(f"  Keyword Responsive    : {edrm_res['keyword_responsive_files']:,} files")
print(f"  Privilege Withheld    : -{edrm_res['privileged_withheld_files']:,} files")
print(f"  Final Trial Corpus    : {edrm_res['final_trial_production_corpus']:,} documents")
print(f"  Culling Reduction Rate: {edrm_res['data_reduction_efficiency_pct']}% volume reduction")
print(f"  EDRM Pipeline Verdict : {edrm_res['edrm_pipeline_verdict']}")
''',
            "tryIt": "Increase keyword_hits_count to observe how the responsive document count and final trial corpus expand dynamically.",
            "check": {
                "question": "What is the technical purpose of 'De-NISTing' during the processing stage of the Electronic Discovery Reference Model (EDRM)?",
                "options": [
                    "To match file cryptographic hashes against the NIST National Software Reference Library to automatically discard irrelevant operating system and application files",
                    "To erase all files created by non-Indian software developers",
                    "To convert all PDF documents into Microsoft Word format",
                    "To print out physical hard copies of all emails"
                ],
                "answerIndex": 0,
                "why": "De-NISTing filters out known, uncorrupted system files (like system DLLs) using NIST's database of known hashes, preventing wasted review of non-evidence files."
            }
        },
        {
            "title": "Anti-Forensics Detection: Timestomping, Memory Carving & Log Scrubbing",
            "say": [
                "Sophisticated white-collar fraudsters routinely employ anti-forensics techniques to conceal their tracks, destroy evidence, or mislead investigators. Forensic auditors must deploy advanced reverse-engineering and digital artifact analysis to uncover anti-forensic tampering.",
                "The three primary anti-forensics vectors encountered in corporate fraud investigations are: (1) Timestomping—deliberately modifying the file system MACB (Modified, Accessed, Created, Born) timestamps to make newly fabricated fraudulent invoices appear as though they were created years earlier. In NTFS file systems, timestomping typically modifies the $STANDARD_INFORMATION attribute while failing to update the kernel $FILE_NAME attribute, creating an irreconcilable timestamp divergence that proves deliberate falsification; (2) Volatile Memory & Unallocated Slack Carving—recovering uncommitted database transactions, temporary encryption keys, and unsaved ledger vouchers from volatile RAM dumps or unallocated disk slack clusters using file carvers (such as Photorec or Volatility); and (3) Log Scrubbing & Event Cleared Artifacts—detecting when administrative users delete Windows Event Logs (e.g., Event ID 1102: 'The audit log was cleared') or Linux /var/log entries to conceal unauthorized treasury wire transfers.",
                "Unmasking anti-forensics provides judicial courts with conclusive circumstantial proof of mens rea (guilty mind) and willful evidence spoliation."
            ],
            "example": "During a forensic investigation into backdated procurement contracts, the suspect claims an agreement was signed on March 15, 2024. Forensic analysis of the suspect's computer reveals that the NTFS $STANDARD_INFORMATION attribute reads '2024-03-15', but the $FILE_NAME attribute reads '2026-04-02'. Furthermore, Windows Event Log ID 1102 confirms the Security log was manually cleared on April 2. This mathematical proof exposes timestomping and intentional evidence fabrication.",
            "code": '''def detect_ntfs_timestomping_and_anti_forensics(
    file_name: str,
    si_modified_timestamp: str, # $STANDARD_INFORMATION
    fn_modified_timestamp: str, # $FILE_NAME
    security_event_1102_cleared_found: bool,
    unallocated_space_carved_fragments_count: int
) -> dict:
    # Timestomping Detection: Mismatch between $SI and $FN attributes
    has_timestomp_divergence = si_modified_timestamp != fn_modified_timestamp
    
    anti_forensic_flags = []
    if has_timestomp_divergence:
        anti_forensic_flags.append(f"TIMESTOMPING_DETECTED: $SI ({si_modified_timestamp}) != $FN ({fn_modified_timestamp})")
    if security_event_1102_cleared_found:
        anti_forensic_flags.append("EVENT_LOG_SCRUBBING: Windows Security Audit Log Cleared (Event ID 1102)")
        
    severity = len(anti_forensic_flags)
    
    if severity >= 2:
        verdict = "CONFIRMED_ACTIVE_ANTI_FORENSIC_TAMPERING_AND_EVIDENCE_SPOLIATION"
        judicial_inference = "ADVERSE_JUDICIAL_INFERENCE_OF_GUILTY_MIND_MENS_REA"
    elif severity == 1:
        verdict = "SUSPICIOUS_TIMESTAMP_ANOMALY_INVESTIGATE_MFT_RECORDS"
        judicial_inference = "CORROBORATE_WITH_KERNEL_USN_JOURNAL"
    else:
        verdict = "CLEAN_FILE_SYSTEM_METADATA_NO_TAMPERING_OBSERVED"
        judicial_inference = "METADATA_PRESUMED_GENUINE"
        
    return {
        "file_inspected": file_name,
        "standard_info_time": si_modified_timestamp,
        "file_name_attr_time": fn_modified_timestamp,
        "timestomp_present": has_timestomp_divergence,
        "event_1102_cleared": security_event_1102_cleared_found,
        "carved_fragments_recovered": unallocated_space_carved_fragments_count,
        "anti_forensics_verdict": verdict,
        "judicial_implication": judicial_inference,
        "flags": anti_forensic_flags
    }

tamper_res = detect_ntfs_timestomping_and_anti_forensics(
    file_name="Backdated_Supply_Agreement_March2024.docx",
    si_modified_timestamp="2024-03-15 11:30:00",
    fn_modified_timestamp="2026-04-02 23:45:12",
    security_event_1102_cleared_found=True,
    unallocated_space_carved_fragments_count=14
)
print("NTFS Anti-Forensics & Timestomping Detection Engine:")
print(f"  File Under Analysis   : {tamper_res['file_inspected']}")
print(f"  $STANDARD_INFO Time   : {tamper_res['standard_info_time']} (Fabricated backdate)")
print(f"  $FILE_NAME Kernel Time: {tamper_res['file_name_attr_time']} (Real creation date)")
print(f"  Timestomp Divergence  : {tamper_res['timestomp_present']}")
print(f"  Log Scrubbing Detected: {tamper_res['event_1102_cleared']}")
print(f"  Carved Fragments Found: {tamper_res['carved_fragments_recovered']} fragments recovered")
print(f"  Forensic Verdict      : {tamper_res['anti_forensics_verdict']}")
print(f"  Judicial Implication  : {tamper_res['judicial_implication']}")
''',
            "tryIt": "Set fn_modified_timestamp to equal si_modified_timestamp and security_event_1102_cleared_found to False to observe the verdict turn to clean genuine metadata.",
            "check": {
                "question": "How does digital forensic analysis detect 'timestomping' on an NTFS file system?",
                "options": [
                    "By comparing the user-accessible $STANDARD_INFORMATION attribute against the kernel-protected $FILE_NAME attribute in the Master File Table (MFT); user timestomping tools alter $SI but fail to update $FN",
                    "By checking if the computer's battery was dead",
                    "By smelling the hard drive for burnt circuits",
                    "By verifying if the monitor brightness was turned down"
                ],
                "answerIndex": 0,
                "why": "NTFS stores timestamps in two distinct MFT attributes: $STANDARD_INFORMATION (which user-mode tools can easily manipulate) and $FILE_NAME (which kernel-level system processes manage), creating a tell-tale divergence when manipulated."
            }
        },
        {
            "title": "Comprehensive Digital Forensic Dossier & Expert Witness Preparation",
            "say": [
                "The culmination of a digital forensic examination is the authoring of an authoritative Forensic Digital Evidence Dossier and preparation for Courtroom Expert Witness Testimony under Section 45 of the Indian Evidence Act. The forensic expert witness serves as an objective, unbiased interpreter of complex digital artifacts for the judiciary.",
                "The dossier must assemble: (1) The Chain of Custody Log detailing every custodian handover and storage environment; (2) The Bitstream Acquisition Report with SHA-256 and MD5 hash match verifications; (3) The statutory Section 65B Certificate; (4) The EDRM processing and keyword culling methodology; and (5) The Anti-Forensics Analysis Report documenting timestomping or log tampering.",
                "During cross-examination, the expert must defend the scientific repeatability and reliability of the forensic methodology, demonstrating that identical results would be obtained by any independent forensic examiner.",
                "This rigorous preparation transforms raw digital bits into decisive, trial-winning evidence."
            ],
            "example": "The lead forensic investigator testifies before the NCLT in a Rs 100 Crore corporate diversion trial. The defense counsel challenges the acquisition of WhatsApp database backups. The expert presents the forensic dossier: demonstrating hardware write-blocker isolation, identical SHA-256 hash matching, Section 65B certification by the telecom administrator, and unallocated space carving. The court admits the evidence in full.",
            "code": '''class DigitalForensicTrialDossierEngine:
    def __init__(self, investigation_title: str, lead_examiner: str):
        self.investigation = investigation_title
        self.examiner = lead_examiner
        self.evidence_components = []
        
    def add_dossier_component(self, name: str, is_ready: bool, standard_reference: str):
        self.evidence_components.append({
            "component": name,
            "ready": is_ready,
            "standard": standard_reference
        })
        
    def generate_trial_readiness_report(self) -> dict:
        total = len(self.evidence_components)
        ready_count = sum(1 for c in self.evidence_components if c["ready"])
        is_trial_ready = total == ready_count
        
        return {
            "investigation": self.investigation,
            "expert_witness": self.examiner,
            "total_evidentiary_components": total,
            "ready_components": ready_count,
            "courtroom_trial_status": "READY_FOR_EXPERT_WITNESS_TESTIMONY_UNDER_SEC_45" if is_trial_ready else "INCOMPLETE_EVIDENCE_DOSSIER_DEFENSE_VULNERABILITY",
            "dossier_detail": self.evidence_components
        }

dossier_trial = DigitalForensicTrialDossierEngine("SFIO v. Apex Procurement Ring", "Dr. Vikram Seth, CFE, EnCE")
dossier_trial.add_dossier_component("Hardware Write-Blocker Bitstream Image & SHA-256 Verification", True, "NIST SP 800-86 / ISO 27037")
dossier_trial.add_dossier_component("Section 65B Statutory Admissibility Certificate Signed by CISO", True, "Indian Evidence Act Sec 65B")
dossier_trial.add_dossier_component("EDRM De-NISTing & Global Deduplication Log", True, "EDRM Processing Standard")
dossier_trial.add_dossier_component("NTFS Timestomping & $FILE_NAME Attribute Analysis Report", True, "NTFS Internal Specifications")
dossier_trial.add_dossier_component("Unallocated Slack Space Carved Voucher Database Fragments", True, "Volatility / Foremost Specifications")

trial_rep = dossier_trial.generate_trial_readiness_report()
print("Digital Forensic Trial Dossier & Expert Witness Engine:")
print(f"  Investigation Title   : {trial_rep['investigation']}")
print(f"  Expert Witness Name   : {trial_rep['expert_witness']}")
print(f"  Dossier Completion    : {trial_rep['ready_components']}/{trial_rep['total_evidentiary_components']} components ready")
print(f"  Trial Status          : {trial_rep['courtroom_trial_status']}")
print("  Dossier Evidence Trace:")
for comp in trial_rep['dossier_detail']:
    print(f"    * {comp['component']}: [{comp['standard']}] -> Ready: {comp['ready']}")
''',
            "tryIt": "Set is_ready to False for Section 65B Certificate to observe how the trial status immediately flags a severe defense vulnerability.",
            "check": {
                "question": "What is the primary role of a digital forensic expert witness in judicial court proceedings under Section 45 of the Indian Evidence Act?",
                "options": [
                    "To provide an objective, scientifically sound, and repeatable opinion on digital artifacts and evidence to assist the court in understanding technical facts",
                    "To act as an advocate for the highest-paying client",
                    "To decide whether the accused should go to prison",
                    "To install software updates on the judge's computer"
                ],
                "answerIndex": 0,
                "why": "Under Section 45, an expert witness is an objective professional assisting the court with specialized technical knowledge, requiring impartial and scientifically repeatable evidence."
            }
        }
    ]
}

if __name__ == "__main__":
    with open("scripts/temp_day26.json", "w", encoding="utf-8") as f:
        json.dump(day_data, f, indent=2)
    print("Day 26 base JSON created successfully.")
