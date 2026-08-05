# PinIT Career OS: Parent Portal Enterprise Documentation

This document provides a comprehensive, enterprise-grade technical and architectural analysis of the Parent Portal within the PinIT Career OS ecosystem, detailing the 11 operational workspace tabs and sub-tabs.

---

# Tab 1: Parent Dashboard (Overview Cockpit)

## 1. Overview
The Parent Dashboard (`/parent`) serves as the central progress cockpit for parents and guardians. Its primary purpose is to display a high-level summary of the student's academic attendance, fee status, ATS placement readiness score, and active learning streaks.

## 2. Why does this tab exist?
Parents pay university tuition fees but often remain completely out of the loop regarding their child's daily academic progress or placement preparedness until end-of-semester results arrive.

## 3. What problem does it solve?
It eliminates communication gaps between the college, student, and family by providing real-time visibility into academic health and placement readiness.

## 4. Target Users
* **Parent / Guardian (Primary)**: Read-only access to child metrics, attendance, and fee alerts.
* **Admin**: System superuser access.

## 5. Core Features
* **Child Summary Cards**:
  * *Purpose*: Displays current overall attendance %, placement readiness score, completed quest count, and active fee due alerts.
  * *Workflow*: Queries `/api/parent/student/[id]/overview` to render statistics.
  * *Inputs*: Target Student ID.
  * *Outputs*: Telemetry gauges.
* **Academic Risk Alerts**:
  * *Purpose*: Highlights warnings if the child's attendance drops below 75% or internal test marks drop below passing thresholds.
  * *Inputs*: Attendance logs, exam database records.
  * *Outputs*: Highlighted alert cards.

## 6. User Workflow
1. **Beginning**: Parent logs into the `/parent` portal.
2. **Review**: Analyzes the child summary gauges and attendance indicators.
3. **Action**: Selects an alert card (e.g., "Attendance Warning in Data Structures").
4. **System Update**: Opens detailed course attendance logs, providing faculty contact information if needed.

## 7. Future Scope
* **WhatsApp Daily Digest**: Automated end-of-day summary sent to guardian WhatsApp numbers for quick mobile tracking.

## 8. Competitive Advantage
Combines academic attendance tracking with daily career preparation metrics, providing parents with a complete picture of student growth.

---

# Tab 2: Academic Performance

## 1. Overview
The Academic Performance tab provides a detailed breakdown of semester GPAs, internal assessment marks, exam results, and subject-wise score trends.

## 2. Why does this tab exist?
Traditional paper marksheets arrive months after exams conclude, leaving no time for early academic remediation.

## 3. What problem does it solve?
It provides immediate access to internal exam scores and GPA trends, helping families identify weak subjects early.

## 4. Target Users
* **Parent / Guardian**: Full read access to child grades and marksheets.

## 5. Core Features
* **Semester Grade Audit**:
  * *Purpose*: Displays historical semester GPAs and internal assessment scores.
  * *Inputs*: Student ID.
  * *Outputs*: Grade breakdown tables and GPA trend graphs.
  * *Validation Rules*: Data synchronizes directly with the institution's `exam_results` database table.

## 6. User Workflow
1. **Beginning**: Parent opens the "Academic Performance" tab.
2. **Select**: Chooses a semester (e.g., "Semester 4").
3. **Analyze**: Reviews subject marks and compares them against class averages.
4. **System Update**: Logs the transcript view event in the system audit logs.

## 7. Future Scope
* **AI Grade Predictor**: Calculates expected end-of-year CGPA based on current internal test performance.

## 8. Competitive Advantage
Displays academic grades alongside practical coding assessment scores, providing a complete view of candidate capabilities.

---

# Tab 3: Career & Placement Readiness

## 1. Overview
The Career & Placement Readiness tab displays the student's Career DNA radar, ATS resume match score, completed practical projects, and company interview eligibility.

## 2. Why does this tab exist?
Parents often judge career prospects based solely on CGPA, failing to realize that modern technology companies hire based on practical coding skills, projects, and interview performance.

## 3. What problem does it solve?
It helps parents understand real industry placement requirements by displaying practical skill ratings alongside academic marks.

## 4. Target Users
* **Parent / Guardian**: View-only access to career readiness telemetry.

## 5. Core Features
* **Career DNA Radar**:
  * *Purpose*: Visual representation of coding efficiency, soft skills, problem-solving, and project depth.
  * *Inputs*: Student profile metadata.
  * *Outputs*: Interactive skill radar chart.
* **Placement Eligibility Gauge**:
  * *Purpose*: Displays probability of clearing campus placement drives for target companies.
  * *Inputs*: ATS match score, verified project count.
  * *Outputs*: Company eligibility badges.

## 6. User Workflow
1. **Beginning**: Parent opens "Career & Placement Readiness".
2. **Review**: Evaluates the student's Career DNA radar and target role path (e.g., "Full Stack Engineer").
3. **Check**: Checks which top companies (e.g., TCS, Infosys, Amazon) the student currently qualifies for.
4. **System Update**: Updates parent view logs in the analytics table.

## 7. Future Scope
* **Salary Expectations Calculator**: Displays average starting salary ranges for the student's current skill tier.

## 8. Competitive Advantage
Helps bridge the gap between academic performance and corporate hiring standards for non-technical parents.

---

# Tab 4: Attendance Register

## 1. Overview
The Attendance Register tab provides a day-by-day calendar showing class check-ins, subject-wise attendance percentages, and leave application records.

## 2. Why does this tab exist?
Low attendance is the leading cause of exam hall ticket rejections and academic backlogs.

## 3. What problem does it solve?
It prevents unexpected exam hall ticket withholdings by alerting parents as soon as attendance drops near critical thresholds (75%).

## 4. Target Users
* **Parent / Guardian**: Monitors daily attendance and submits leave notifications.

## 5. Core Features
* **Subject-Wise Attendance Table**:
  * *Purpose*: Display percentage attendance per subject alongside total classes conducted vs. attended.
  * *Inputs*: Class ID, Student ID.
  * *Outputs*: Color-coded attendance table (Green = Safe > 75%, Red = Risk < 75%).

## 6. User Workflow
1. **Beginning**: Parent opens "Attendance Register".
2. **Review**: Checks monthly attendance percentage cards.
3. **Action**: Submits a sick leave note to the class advisor if the student was absent.
4. **System Update**: Writes the leave note to the `services` table for faculty approval.

## 7. Future Scope
* **Smart Attendance Forecast**: Displays how many consecutive classes the student must attend to recover from a low percentage.

## 8. Competitive Advantage
Integrates daily check-ins with automated warning alerts, keeping parents informed in real-time.

---

# Tab 5: AI Parent Advisor & Faculty Connect

## 1. Overview
The AI Parent Advisor tab features a 24/7 AI conversational assistant that answers parent queries about college schedules, grading rules, fee deadlines, and child progress, alongside direct contact options for class advisors.

## 2. Why does this tab exist?
Parents frequently call college offices or teachers during working hours for basic updates, creating administrative workload.

## 3. What problem does it solve?
It provides instant answers to common parent questions 24/7, freeing up faculty time.

## 4. Target Users
* **Parent / Guardian**: Asks questions and books faculty call slots.

## 5. Core Features
* **24/7 Parent Assistant**:
  * *Purpose*: Natural language bot answering questions about child progress, campus events, and academic rules.
  * *Inputs*: Text/Voice query.
  * *Outputs*: Instant plain-language response.
* **Faculty Call Scheduler**:
  * *Purpose*: Book 1:1 meeting slots with the child's academic advisor.
  * *Inputs*: Date, preferred time slot.
  * *Outputs*: Scheduled advisor appointment.

## 6. User Workflow
1. **Beginning**: Parent opens "AI Parent Advisor".
2. **Ask**: Types a query: *"What is my child's current CGPA and when are the mid-term exams?"*
3. **Respond**: The AI assistant fetches details from the student database and presents a clean summary.
4. **System Update**: Logs the conversation session in system audit records.

## 7. Future Scope
* **Multi-Language Support**: Voice-activated AI responses in regional languages (Hindi, Tamil, Telugu, Kannada, Marathi).

## 8. Competitive Advantage
Gives parents instant answers in simple language without requiring technical background or college staff intervention.

---

# Tab 6: Communication & Notices

## 1. Overview
The Communication tab aggregates institutional circulars, campus event notices, department broadcasts, and direct messages from college administration.

## 2. Why does this tab exist?
Important college notices sent through physical letters or student email accounts are frequently lost or unread.

## 3. What problem does it solve?
It ensures critical institutional notices (such as holiday announcements, fee deadlines, or exam dates) reach parents directly.

## 4. Target Users
* **Parent / Guardian**: Reads official institutional broadcasts.

## 5. Core Features
* **Institutional Notice Feed**:
  * *Purpose*: Display official announcements sorted by priority and date.
  * *Inputs*: Broadcast category filter.
  * *Outputs*: Clean announcement feed with read confirmation tracking.

## 6. User Workflow
1. **Beginning**: Parent opens "Communication & Notices".
2. **Review**: Reads recent campus notices (e.g., "Parent-Teacher Meeting Schedule").
3. **Acknowledge**: Clicks "Acknowledge Notice".
4. **System Update**: Updates read receipt logs in the `notifications` database table.

## 7. Future Scope
* **Push Notification Routing**: Sends instant alerts to the parent's mobile device for high-priority announcements.

## 8. Competitive Advantage
Centralizes official college communications in one secure feed, eliminating lost letters or missed emails.

---

# Tab 7: Documents Vault & Certificates

## 1. Overview
The Documents Vault tab allows parents to view and download verified student certificates, marksheets, fee receipts, and identity documents.

## 2. Why does this tab exist?
Families often struggle to locate student marksheets or admission certificates when applying for educational loans or scholarships.

## 3. What problem does it solve?
It provides a secure digital vault containing verified institutional documents, accessible anytime.

## 4. Target Users
* **Parent / Guardian**: Downloads official receipts and certificates.

## 5. Core Features
* **Cryptographic Vault Viewer**:
  * *Purpose*: View and download verified digital documents (Semester Grade Sheets, Bonafide Certificates, Fee Receipts).
  * *Inputs*: Category selection.
  * *Outputs*: High-resolution PDF downloads with QR verification badges.

## 6. User Workflow
1. **Beginning**: Parent opens "Documents Vault".
2. **Select**: Chooses "Fee Receipts" or "Academic Transcripts".
3. **Download**: Clicks "Download Verified PDF".
4. **System Update**: Logs the document download event in security audit tables.

## 7. Future Scope
* **One-Click Loan Package**: Generates a single bundled PDF containing all marksheets and bonafide certificates required for bank loan applications.

## 8. Competitive Advantage
Ensures all downloaded documents include digital verification signatures, preventing tampering.

---

# Tab 8: Finance Desk

## 1. Overview
The Finance Desk tab displays tuition fee schedules, installment due dates, scholarship discounts, and historical payment receipts.

## 2. Why does this tab exist?
Lack of clear fee breakdown schedules leads to late payment penalties and administrative confusion.

## 3. What problem does it solve?
It provides clear visibility into tuition dues, scholarship discounts, and payment deadlines.

## 4. Target Users
* **Parent / Guardian**: Reviews fee balances and initiates online payments.

## 5. Core Features
* **Tuition Ledger**:
  * *Purpose*: Displays itemized fee breakdown (Tuition, Hostel, Transport, Examination) and payment status.
  * *Inputs*: Student ID.
  * *Outputs*: Fee ledger table with clear "Paid" and "Due" tags.

## 6. User Workflow
1. **Beginning**: Parent opens "Finance Desk".
2. **Review**: Checks upcoming tuition due amounts and scholarship deductions.
3. **Action**: Clicks "Pay Online" to settle outstanding fees.
4. **System Update**: Updates fee payment records in the `finance` database table, generating an instant receipt.

## 7. Future Scope
* **Auto-Installment Reminders**: Automated SMS reminders sent 7 days before fee installment deadlines.

## 8. Competitive Advantage
Integrates fee management directly with academic and hostel records, giving parents a complete financial view in one place.

---

# Tab 9: Real-Time Notifications

## 1. Overview
The Notifications tab manages system alerts, security warnings, attendance alerts, and exam result announcements.

## 2. Why does this tab exist?
Parents need a single feed tracking all urgent updates regarding their child.

## 3. What problem does it solve?
It organizes alerts by priority, ensuring critical warnings are never missed.

## 4. Target Users
* **Parent / Guardian**: Reviews unread alerts.

## 5. Core Features
* **Priority Alert Stream**:
  * *Purpose*: Stream real-time alerts categorized by severity (Urgent, Warning, Info).
  * *Inputs*: Notification stream.
  * *Outputs*: Priority alert list.

## 6. User Workflow
1. **Beginning**: Parent clicks the Notification Bell icon.
2. **Review**: Reads recent system alerts (e.g., "Exam Results Published").
3. **Action**: Clicks the alert to open the relevant page.
4. **System Update**: Marks the notification as read.

## 7. Future Scope
* **Custom Alert Preferences**: Allows parents to select preferred notification channels (SMS, Email, App Push).

## 8. Competitive Advantage
Organizes notifications by priority level, making sure urgent messages stand out.

---

# Tab 10: Profile & Family Linking

## 1. Overview
The Profile & Family Linking tab manages guardian contact info, emergency contacts, and linked student accounts.

## 2. Why does this tab exist?
Colleges often have outdated parent contact information, making it difficult to reach families during emergencies.

## 3. What problem does it solve?
It allows parents to update their contact info and link multiple children enrolled in the institution.

## 4. Target Users
* **Parent / Guardian**: Updates profile details and links student accounts.

## 5. Core Features
* **Student Linking Tool**:
  * *Purpose*: Link sibling student accounts to a single parent login profile.
  * *Inputs*: Student ID / Student Email.
  * *Outputs*: Linked family profile array.

## 6. User Workflow
1. **Beginning**: Parent opens "Profile & Family Linking".
2. **Input**: Enters a second child's student ID.
3. **Submit**: Clicks "Link Account".
4. **System Update**: Creates a guardian link record in the database, allowing easy switching between children.

## 7. Future Scope
* **Biometric Auth Integration**: Support for fingerprint/FaceID logins on mobile devices for secure profile access.

## 8. Competitive Advantage
Allows parents with multiple children in the institution to manage all student profiles under a single, unified login.

---

# Tab 11: Monthly Progress Report

## 1. Overview
The Monthly Progress Report tab compiles a monthly academic scorecard summarizing attendance, quest completions, AI interview ratings, and advisor notes into a clean, printable PDF report.

## 2. Why does this tab exist?
Parents need a clear monthly summary they can review with their child to track progress over time.

## 3. What problem does it solve?
It organizes complex daily data into a simple monthly progress report.

## 4. Target Users
* **Parent / Guardian**: Reads and downloads monthly progress scorecards.

## 5. Core Features
* **Monthly Report Generator**:
  * *Purpose*: Compile attendance, grades, and career readiness scores into a single monthly report card.
  * *Inputs*: Month selection.
  * *Outputs*: Printable monthly progress report card.

## 6. User Workflow
1. **Beginning**: Parent opens "Monthly Progress Report".
2. **Select**: Chooses the target month (e.g., "July 2026").
3. **Review**: Analyzes the monthly attendance percentage, completed quests count, and teacher feedback.
4. **Download**: Clicks "Download Official Monthly Report PDF".

## 7. Future Scope
* **AI Monthly Insights Summary**: Automatically generates a 3-bullet executive summary explaining the child's key achievements and areas for improvement during the month.

## 8. Competitive Advantage
Combines monthly academic attendance with practical coding progress, giving families a complete view of student growth every month.

---

# Why the Parent Portal Makes PinIT Better than Legacy College ERPs

Legacy university portals (like SAP, Banner, or custom college websites) often provide confusing, text-heavy interfaces that only show attendance numbers and fee receipts.

1. **Career Transparency**:
   * *Legacy Flaw*: Legacy portals show attendance and grades without explaining if the student is developing real-world job skills.
   * *PinIT Edge*: PinIT displays practical skill metrics (**Career DNA**, **ATS Match**, **Verified Projects**) alongside traditional academic grades, giving parents a complete picture of job readiness.

2. **24/7 AI Guidance**:
   * *Legacy Flaw*: Parents must call college staff during office hours for simple updates on schedules or rules.
   * *PinIT Edge*: PinIT's AI Parent Advisor answers common questions instantly 24/7 in simple language.

3. **Complete Financial & Academic View**:
   * *Legacy Flaw*: Attendance, grades, and fee receipts are scattered across different portals and physical letters.
   * *PinIT Edge*: PinIT unifies attendance tracking, academic grades, fee ledgers, and official documents into a single mobile-friendly workspace.
