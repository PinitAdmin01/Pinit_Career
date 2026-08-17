# 📱 PinIT Careers — Complete 6-Portal Friend & Co-Worker Testing Guide

Welcome! This guide is designed to help you test **every feature, portal, and segment** of the PinIT Careers application step by step. Everything is explained in simple, non-technical terms.

---

## 🔑 Demo Account Credentials

Use these demo credentials to test each portal:

| Portal | Role | Username / Email | Password |
| :--- | :--- | :--- | :--- |
| 🎓 **Student** | Student User | `student@pinit.in` | `password123` |
| 👩‍🏫 **Teacher** | Faculty Member | `teacher@pinit.in` | `password123` |
| 🏛️ **Admin** | System Administrator | `admin@pinit.in` | `password123` |
| 💼 **Recruiter** | Talent Acquisition Lead | `rec@pinit.in` | `password123` |
| 🌍 **Consultant** | Career & Academic Advisor | `con@pinit.in` | `password123` |
| 👨‍👩‍👦 **Parent** | Guardian Representative | `parent@pinit.in` | `password123` |

---

## 🧪 Step-by-Step Testing Walkthrough by Portal

### 1. 🎓 Student Portal (`/student` & `/attendance`)
- **ATS Resume Audit**: Go to `/ats-resume-screener`. Upload or paste a resume to receive instant numerical scoring, section detection, and quick-win feedback recommendations.
- **AI Video/Audio Interview**: Go to `/ai-interview-practice`. Practice 4-round role-weighted interviews with live LLM response sanitization, sentence-chunked streaming speech, and audio delivery feedback.
- **Pyodide WASM Code Sandbox**: Go to `/coding-test`. Write algorithm solutions in Python/TypeScript and execute test cases directly inside your browser.
- **Biometric Face Check-In**: Go to `/attendance`. Click **`📸 AI Biometric Face Check-In`** to activate your daily Focus Streak Multiplier and earn XP & Pins.
- **Class Leave Application**: On `/attendance`, click **`📄 Apply for Leave`**. Choose a category (Medical, Academic, Personal), pick date ranges, and submit leave applications to your faculty.
- **CLO Competency Passport**: Go to `/profile?tab=passport`. View your Course Learning Outcome (CLO) Competency Matrix (`CLO-101`, `CLO-102`, `CLO-103`) showing quest and interview evidence.

---

### 2. 👩‍🏫 Teacher Studio (`/admin/teacher`)
- **Quick-Grid Class Attendance**: Toggle between **`🔲 Quick-Grid View`** and **`📜 Table View`**. Mark individual student statuses (`Present`, `Late`, `Absent`) or click **`✓ Mark All Present`**.
- **Attendance Summary Stats**: View live class counters (`Present`, `Absent`, `Late`) updating in real time.
- **Student Leave Approvals**: Review pending student leave applications banner and click **`✓ Approve Leave`** or **`✕ Reject`**.

---

### 3. 🏛️ Admin ERP & Finance Portal (`/admin` & `/finance`)
- **Fee Schedule & Payment Receipt**: Go to `/finance`. View term installments, apply scholarships, click **`📄 View Receipt`**, and test **`📄 Download Fee Voucher`** (`PIN-FEE-2026-XXXX`).
- **Institutional CSV Report Exporter**: Go to `/admin`. Click **`📊 Export Institutional CSV Report`** in the header to download automated `.csv` data tables.
- **Security & Audit Logs**: Select **`📜 Security & Audit Logs`** tab in `/admin` to view live immutable event logs (`ROLE_SWITCH`, `INTERVIEW_DISPATCH`, `ALERT_ACKNOWLEDGE`, `FEE_RECEIPT`).

---

### 4. 💼 Recruiter Portal (`/recruiter`)
- **6-Stage Candidate Pipeline**: Click on candidate profiles and advance them through OpenCATS stages (`Submitted` $\to$ `ATS Screened` $\to$ `AI Interviewed` $\to$ `Shortlisted` $\to$ `Offered` $\to$ `Hired`).
- **Recruiter Activity Notes Drawer**: Add call logs or recruiter notes saved with author tags (`Lead Recruiter`).
- **Dispatch AI Interview Invitation**: Click **`✉️ Dispatch AI Interview Invitation`** to log formal candidate invitations (`REF-INV-2026-XXXX`).

---

### 5. 🌍 Consultant Portal (`/consultant`)
- **At-Risk Advisory Alert Banner**: View students flagged for low engagement or attendance drops (`🚨 At-Risk Advisory Trigger`).
- **Initiate Care Team Review**: Click **`🤝 Initiate Care Team Review`** to activate a multi-disciplinary advisory team with timestamp tracking.

---

### 6. 👨‍👩‍👦 Parent Portal (`/parent`)
- **Multi-Child Selector**: Switch between linked children cards (viewing ATS scores, CGPA, streaks, and register numbers).
- **Interactive Alert Acknowledgments**: Click **`✔ Acknowledge Alert`** in the Notifications Hub to record timestamped acknowledgment seals (`SEAL #ACK-PAR-X`) on the parent overview dashboard.

---

## 🎯 Verification Checklist for Your Tester Friend

- [ ] Logged into all 6 portals using demo credentials.
- [ ] Submitted a student leave application and approved it in Teacher Studio.
- [ ] Dispatched an AI interview invitation in Recruiter Portal.
- [ ] Acknowledged a parent alert and verified the seal on the Parent Dashboard.
- [ ] Generated a fee receipt voucher in Finance Desk.
- [ ] Exported an institutional CSV report in Admin ERP.
- [ ] Tested AI face check-in on the Student Attendance page.
