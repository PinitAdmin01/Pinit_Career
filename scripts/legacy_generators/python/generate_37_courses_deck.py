import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def build_37_courses_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Executive Theme Colors (Clean, Modern, Stripe/Apple Aesthetic)
    BG_CANVAS = RGBColor(248, 250, 252)       # Light Slate #f8fafc
    CARD_WHITE = RGBColor(255, 255, 255)      # Pure White #ffffff
    BORDER_DEFAULT = RGBColor(226, 232, 240)  # Light Slate Border #e2e8f0

    TEXT_TITLE = RGBColor(15, 23, 42)         # Deep Navy #0f172a
    TEXT_BODY = RGBColor(51, 65, 85)          # Dark Slate #334155
    TEXT_MUTED = RGBColor(100, 116, 139)      # Medium Slate #64748b

    PRIMARY_BLUE = RGBColor(37, 99, 235)      # Royal Blue #2563eb
    PRIMARY_LIGHT = RGBColor(239, 246, 255)   # Ice Blue #eff6ff
    
    EMERALD_GREEN = RGBColor(16, 185, 129)    # Emerald Green #10b981
    GREEN_LIGHT = RGBColor(240, 253, 244)     # Mint Green #f0fdf4
    GREEN_BORDER = RGBColor(187, 247, 208)    # #bbf7d0

    AMBER_GOLD = RGBColor(217, 119, 6)        # Amber #d97706
    AMBER_LIGHT = RGBColor(254, 243, 199)     # Light Gold #fef3c7
    AMBER_BORDER = RGBColor(253, 230, 138)    # #fde68a

    CORAL_RED = RGBColor(225, 29, 72)         # Rose Red #e11d48
    RED_LIGHT = RGBColor(255, 241, 242)       # Soft Rose #fff1f2
    RED_BORDER = RGBColor(254, 205, 211)      # #fecdd3

    PURPLE_ACCENT = RGBColor(126, 34, 206)    # Deep Purple #7e22ce
    PURPLE_LIGHT = RGBColor(250, 245, 255)    # Soft Purple #faf5ff

    def add_slide_header(slide, slide_num, pill_text, title, subtitle):
        # Background
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_CANVAS
        bg.line.color.rgb = BG_CANVAS

        # Brand Ribbon
        bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.08))
        bar.fill.solid()
        bar.fill.fore_color.rgb = PRIMARY_BLUE
        bar.line.color.rgb = PRIMARY_BLUE

        # Category Pill Badge
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.35), Inches(3.6), Inches(0.32))
        pill.fill.solid()
        pill.fill.fore_color.rgb = PRIMARY_LIGHT
        pill.line.color.rgb = PRIMARY_BLUE
        pill.line.width = Pt(1.0)
        p_pill = pill.text_frame.paragraphs[0]
        p_pill.text = pill_text.upper()
        p_pill.font.size = Pt(10)
        p_pill.font.bold = True
        p_pill.font.color.rgb = PRIMARY_BLUE
        p_pill.alignment = PP_ALIGN.CENTER

        # Slide Number
        box_num = slide.shapes.add_textbox(Inches(11.2), Inches(0.35), Inches(1.33), Inches(0.35))
        p_num = box_num.text_frame.paragraphs[0]
        p_num.text = f"SLIDE {slide_num:02d} / 10"
        p_num.font.size = Pt(11)
        p_num.font.bold = True
        p_num.font.color.rgb = TEXT_MUTED
        p_num.alignment = PP_ALIGN.RIGHT

        # Title
        box_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.72), Inches(11.7), Inches(0.55))
        p_title = box_title.text_frame.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(21)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_TITLE

        # Subtitle
        box_sub = slide.shapes.add_textbox(Inches(0.8), Inches(1.28), Inches(11.7), Inches(0.38))
        p_sub = box_sub.text_frame.paragraphs[0]
        p_sub.text = subtitle
        p_sub.font.size = Pt(12)
        p_sub.font.color.rgb = TEXT_MUTED

    def draw_card(slide, left, top, width, height, title, badge=None, badge_color=PRIMARY_BLUE, bg_color=CARD_WHITE, border_color=BORDER_DEFAULT, items=None, subtitle=None):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.2)

        tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.18), width - Inches(0.4), height - Inches(0.36))
        tf = tb.text_frame
        tf.word_wrap = True

        first = True
        if badge:
            p_b = tf.paragraphs[0]
            p_b.text = badge.upper()
            p_b.font.size = Pt(9.5)
            p_b.font.bold = True
            p_b.font.color.rgb = badge_color
            p_b.space_after = Pt(2)
            first = False

        p_t = tf.add_paragraph() if not first else tf.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(14)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_TITLE
        p_t.space_after = Pt(2)

        if subtitle:
            p_s = tf.add_paragraph()
            p_s.text = subtitle
            p_s.font.size = Pt(10.5)
            p_s.font.color.rgb = badge_color
            p_s.space_after = Pt(4)

        if items:
            for it in items:
                p_it = tf.add_paragraph()
                p_it.text = f"• {it}"
                p_it.font.size = Pt(10.5)
                p_it.font.color.rgb = TEXT_BODY
                p_it.space_after = Pt(3)

    def set_notes(slide, text):
        slide.notes_slide.notes_text_frame.text = text

    # ========================================================
    # SLIDE 1: PRODUCT INTRODUCTION & PROBLEM/SOLUTION
    # ========================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_slide_header(s1, 1, "The Sovereign Platform", 
                     "PinIT Career OS: The All-In-One Campus Career Operating System", 
                     "Bridging Higher Education to High-Paying Employment Through Active Learning & Cryptographic Proof-of-Work")

    # 3 Top KPI Cards
    # KPI 1
    k1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.75), Inches(3.6), Inches(1.7))
    k1.fill.solid()
    k1.fill.fore_color.rgb = CARD_WHITE
    k1.line.color.rgb = PRIMARY_BLUE
    k1.line.width = Pt(1.5)
    tf1 = k1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "37"
    p.font.size = Pt(34)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_BLUE
    p2 = tf1.add_paragraph()
    p2.text = "MASTER COURSES"
    p2.font.size = Pt(11)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_TITLE
    p3 = tf1.add_paragraph()
    p3.text = "Complete multi-disciplinary catalog: Tech, AI, Cloud, Hardware & 14 Commerce Tracks."
    p3.font.size = Pt(10)
    p3.font.color.rgb = TEXT_MUTED

    # KPI 2
    k2 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.8), Inches(1.75), Inches(3.7), Inches(1.7))
    k2.fill.solid()
    k2.fill.fore_color.rgb = CARD_WHITE
    k2.line.color.rgb = EMERALD_GREEN
    k2.line.width = Pt(1.5)
    tf2 = k2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "1,045"
    p.font.size = Pt(34)
    p.font.bold = True
    p.font.color.rgb = EMERALD_GREEN
    p2 = tf2.add_paragraph()
    p2.text = "LESSON DAYS BUILT & LIVE"
    p2.font.size = Pt(11)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_TITLE
    p3 = tf2.add_paragraph()
    p3.text = "65.7% of full 30-day foundation complete today with 100% automated test verification."
    p3.font.size = Pt(10)
    p3.font.color.rgb = TEXT_MUTED

    # KPI 3
    k3 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.9), Inches(1.75), Inches(3.6), Inches(1.7))
    k3.fill.solid()
    k3.fill.fore_color.rgb = CARD_WHITE
    k3.line.color.rgb = PURPLE_ACCENT
    k3.line.width = Pt(1.5)
    tf3 = k3.text_frame
    tf3.word_wrap = True
    p = tf3.paragraphs[0]
    p.text = "990"
    p.font.size = Pt(34)
    p.font.bold = True
    p.font.color.rgb = PURPLE_ACCENT
    p2 = tf3.add_paragraph()
    p2.text = "INTERACTIVE SIMULATORS"
    p2.font.size = Pt(11)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_TITLE
    p3 = tf3.add_paragraph()
    p3.text = "17 proprietary visual engines turning abstract concepts into active browser simulations."
    p3.font.size = Pt(10)
    p3.font.color.rgb = TEXT_MUTED

    # Bottom Problem vs Solution
    draw_card(s1, Inches(0.8), Inches(3.7), Inches(5.6), Inches(3.2),
              "The College Employability Crisis", "THE PROBLEM", CORAL_RED, RED_LIGHT, RED_BORDER,
              [
                  "Outdated Textbook Theory: Universities teach concepts from 10 years ago.",
                  "90% Video Dropout: MOOCs fail because watching passive videos is boring.",
                  "Unemployable Graduates: Over 80% fail basic practical coding and financial interviews.",
                  "Campus Software Sprawl: Colleges waste $60k-$130k/yr on disconnected LMS tools."
              ], "Why Universities & Students Are Struggling")

    draw_card(s1, Inches(6.8), Inches(3.7), Inches(5.7), Inches(3.2),
              "The PinIT Sovereign Solution", "THE SOLUTION", EMERALD_GREEN, GREEN_LIGHT, GREEN_BORDER,
              [
                  "All-In-One Campus Platform: Combines curriculum, browser sandboxes, AI tutors & hiring.",
                  "Active Learn-By-Doing: Students write real code & balance ledgers every 5 minutes.",
                  "24/7 AI Voice Mentors: Personal senior pair-programmers guiding students in real time.",
                  "Verifiable Proof-of-Work: Real GitHub repositories and code telemetry recruiters trust."
              ], "Direct Campus-to-Placement Highway")

    set_notes(s1, "Welcome, shareholders. If you're new to PinIT Career OS, here is our core premise: Higher education is experiencing an employability crisis. Universities teach outdated theory, and online video courses fail because 90% of students drop out. PinIT solves this. We are an all-in-one Career Operating System that replaces passive videos with hands-on practice, AI pair-programming, and real company projects. Over 1,045 training days are already built and live on our platform today.")

    # ========================================================
    # SLIDE 2: THE 37-COURSE MASTER MAP & 2 FULLSTACK ANCHORS
    # ========================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_slide_header(s2, 2, "Complete Curriculum Architecture", 
                     "The 37-Course Master Map & The Two Fullstack Flagships", 
                     "Total Campus Coverage: 1,045 Days Live (65.7% Complete) Across 4 Core Faculties")

    draw_card(s2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(2.45),
              "Faculty 1: Software & Web Engineering", "100% COMPLETE (6 COURSES • 180 DAYS)", PRIMARY_BLUE, CARD_WHITE, BORDER_DEFAULT,
              [
                  "★ Course 02: Full-Stack React Web Development (Web Fullstack)",
                  "★ Course 20: Python Programming & Backend Systems (Python Fullstack)",
                  "Course 01: Java Core Logic • Course 03: Node.js & TypeScript Backend",
                  "Course 04: Cloud Native Architectures (AWS) • Course 05: DevOps & CI/CD Pipelines"
              ], "The Two Fullstack Anchor Disciplines")

    draw_card(s2, Inches(6.8), Inches(1.8), Inches(5.7), Inches(2.45),
              "Faculty 2: Deep Computer Science & AI", "100% COMPLETE (7 COURSES • 210 DAYS)", PURPLE_ACCENT, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Course 07: Data Structures & Algorithms • Course 09: Cybersecurity & Zero Trust",
                  "Course 10: Database Engineering & SQL • Course 11: Distributed Systems & Consensus",
                  "Course 12: Applied AI & LLMs • Course 15: 3D Graphics • Course 16: Blockchain Web3",
                  "Course 21: Quantitative Systems Engineering (The Crown Jewel)"
              ], "High-Margin Deep Technical Specializations")

    draw_card(s2, Inches(0.8), Inches(4.45), Inches(5.6), Inches(2.45),
              "Faculty 3: Commerce & Management", "DAYS 1–5 LIVE (14 COURSES • 70/420 DAYS)", EMERALD_GREEN, CARD_WHITE, GREEN_BORDER,
              [
                  "Course 22: Digital Accounting & Tax • Course 23: Business Finance & Investment",
                  "Course 24: Business Analytics • Course 25: Marketing & Brand Management",
                  "Course 26: Digital Marketing • Course 27: E-Commerce • Course 28: Entrepreneurship",
                  "Course 29: Sales & CRM • Course 30: Supply Chain & Ops • Course 31: AI Business"
              ], "Serving the 60% Non-Engineering Campus Audience")

    draw_card(s2, Inches(6.8), Inches(4.45), Inches(5.7), Inches(2.45),
              "Faculty 4: Launchpad & IoT Silicon", "DAYS 1–5 LIVE (10 COURSES • 50/300 DAYS)", AMBER_GOLD, CARD_WHITE, AMBER_BORDER,
              [
                  "Course 32: Computer OS Fundamentals • Course 33: Everyday AI Prompt Literacy",
                  "Course 34: Excel & Data Analysis (Days 1–10 Live!) • Course 35: Git & GitHub VCS",
                  "Course 36: Tech Soft Skills & STAR • Course 37: NLP & Computational Linguistics",
                  "IoT Hardware (Courses 14, 17, 18, 19): Embedded MCU, Wireless, TinyML, Security"
              ], "Universal Freshman Adoption + Hardware Semiconductor Boom")

    set_notes(s2, "Here is our complete 37-course footprint. Every course is semester-grade. Notice our two flagship Fullstack tracks: Course 02 is Web Fullstack with React and Next.js, and Course 20 is Python Fullstack with FastAPI and async databases. Combined with our deep computer science, 14 commerce tracks, and launchpads, PinIT covers 100% of university degrees.")

    # ========================================================
    # SLIDE 3: DEEP DIVE: THE TWO FULLSTACK FLAGSHIPS
    # ========================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_slide_header(s3, 3, "Flagship Engineering Curriculum", 
                     "The Two Fullstack Flagships: Web Fullstack & Python Fullstack", 
                     "How We Train Job-Ready Full-Stack Developers Who Can Architect Real Enterprise Applications")

    draw_card(s3, Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.9),
              "Course 02: Full-Stack React & Next.js", "WEB FULLSTACK FLAGSHIP (100% LIVE)", PRIMARY_BLUE, CARD_WHITE, BORDER_DEFAULT,
              [
                  "What Students Learn: Modern React 19, Next.js App Router, TypeScript, Tailwind CSS, Server Components (RSC), and edge streaming.",
                  "How We Teach: Students build full-stack web applications in the browser with live preview, Flight serialization inspection, and state synchronization.",
                  "Why We Teach It: Next.js is the global industry standard for modern enterprise frontend and full-stack web development.",
                  "Where It Leads: Senior Full-Stack Engineer, Frontend Architect, React Platform Lead. Starting Salary: Rs 14–25 LPA ($120k–$160k).",
                  "Live Capstone on GitHub: Sovereign Microservices Web Portal with dynamic authentication, streaming SSR, and optimistic state mutations."
              ], "30 Days Complete • 120 Interactive Quests")

    draw_card(s3, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.9),
              "Course 20: Python Fullstack & Backend", "PYTHON FULLSTACK FLAGSHIP (100% LIVE)", EMERALD_GREEN, CARD_WHITE, GREEN_BORDER,
              [
                  "What Students Learn: Advanced Python 3.12, FastAPI, AsyncIO event loops, PostgreSQL database connection pools, and Redis caching.",
                  "How We Teach: Students dissect memory profiling, async task queues, generator pipelines, and production REST/GraphQL API contracts.",
                  "Why We Teach It: Python powers the backend of modern AI applications, data engineering platforms, and high-scale cloud services.",
                  "Where It Leads: Python Backend Engineer, AI Full-Stack Developer, API Platform Architect. Starting Salary: Rs 12–24 LPA ($110k–$150k).",
                  "Live Capstone on GitHub: Enterprise Asynchronous Job Queue with distributed workers, retry backoff, and PostgreSQL persistence."
              ], "30 Days Complete • 120 Interactive Quests")

    set_notes(s3, "Shareholders often ask: What are your flagship courses that get students hired first? It's our Two Fullstack tracks. Course 02 is our Web Fullstack track, teaching React and Next.js App Router. Course 20 is our Python Fullstack track, teaching FastAPI, async database pools, and backend architecture. Both are 100% built, tested, and live today, producing graduates who build real, deployable enterprise applications.")

    # ========================================================
    # SLIDE 4: CORE SOFTWARE & CLOUD (COURSES 01, 03, 04, 05, 06)
    # ========================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_slide_header(s4, 4, "Enterprise Engineering Infrastructure", 
                     "Core Software & Cloud Engineering (Courses 01, 03, 04, 05, 06)", 
                     "5 Foundation Tracks Transforming Beginners into Enterprise Infrastructure Engineers (100% Complete)")

    # 3 Top Columns
    draw_card(s4, Inches(0.8), Inches(1.8), Inches(3.6), Inches(2.4),
              "Course 01: Java Logic", "100% BUILT (30 DAYS)", PRIMARY_BLUE, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Java 21 LTS core syntax, OOP encapsulation, memory stack/heap.",
                  "AutoCloseable resource safety, streams, and Project Loom virtual threads.",
                  "Career: Java Enterprise Developer (Rs 10–20 LPA)."
              ], "Enterprise Server Foundations")

    draw_card(s4, Inches(4.8), Inches(1.8), Inches(3.7), Inches(2.4),
              "Course 03: Node.js Backend", "100% BUILT (30 DAYS)", PRIMARY_BLUE, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Node.js event loop, libuv microtask queues, stream pipelines.",
                  "TypeScript enterprise schemas, JWT auth, rate-limiting middleware.",
                  "Career: Node.js Backend Engineer (Rs 12–22 LPA)."
              ], "High-Throughput Microservices")

    draw_card(s4, Inches(8.9), Inches(1.8), Inches(3.6), Inches(2.4),
              "Course 04: Cloud Native (AWS)", "100% BUILT (30 DAYS)", PRIMARY_BLUE, CARD_WHITE, BORDER_DEFAULT,
              [
                  "AWS architecture: EC2, S3, RDS, Lambda serverless, API Gateway.",
                  "IAM zero-trust policies, VPC private subnets, CloudFront CDN.",
                  "Career: Cloud Solutions Architect (Rs 14–26 LPA)."
              ], "Cloud Scalability & Reliability")

    # 2 Bottom Columns
    draw_card(s4, Inches(0.8), Inches(4.35), Inches(5.6), Inches(2.55),
              "Course 05: DevOps & CI/CD Pipelines", "100% BUILT (30 DAYS)", EMERALD_GREEN, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Docker multi-stage builds, container orchestration, Kubernetes pod lifecycles.",
                  "Automated GitHub Actions CI/CD workflows, Terraform Infrastructure as Code (IaC).",
                  "Why & Where: Tech companies require automated deployment. Leads to SRE and DevOps Engineer roles (Rs 14–28 LPA)."
              ], "Automated Delivery & Self-Healing Pods")

    draw_card(s4, Inches(6.8), Inches(4.35), Inches(5.7), Inches(2.55),
              "Course 06: UI/UX Design Systems", "100% BUILT (30 DAYS)", PURPLE_ACCENT, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Atomic design architecture, WCAG 2.1 AA accessibility, design token variables.",
                  "Figma to code translation, responsive fluid typography, dark mode theming.",
                  "Why & Where: Bridges design and engineering. Leads to Design Systems Engineer & Frontend Architect roles (Rs 12–22 LPA)."
              ], "Component Tokens & Production Accessibility")

    set_notes(s4, "These five courses form the operational backbone of any tech company: Java for enterprise banking backends, Node.js for high-speed APIs, AWS for cloud hosting, DevOps for automated Kubernetes delivery, and Design Systems for accessible UI. All five are 100% built and live, giving students end-to-end systems competence.")

    # ========================================================
    # SLIDE 5: DEEP CS & SYSTEMS (COURSES 07, 08, 09, 10, 11)
    # ========================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_slide_header(s5, 5, "Deep Computer Science & Systems", 
                     "Algorithms, Systems & Data Internals (Courses 07, 08, 09, 10, 11)", 
                     "Deep Systems Engineering That Generative AI Cannot Automate (100% Complete)")

    draw_card(s5, Inches(0.8), Inches(1.8), Inches(3.6), Inches(2.4),
              "Course 07: Data Structures (DSA)", "100% BUILT (30 DAYS)", PURPLE_ACCENT, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Red-Black trees, graph BFS/DFS, dynamic programming grids.",
                  "Amortized complexity, memory bounds, technical interview drill.",
                  "Career: Algorithm Engineer (Rs 15–30 LPA)."
              ], "Mastering Technical Interviews")

    draw_card(s5, Inches(4.8), Inches(1.8), Inches(3.7), Inches(2.4),
              "Course 08: Mobile Development", "100% BUILT (30 DAYS)", PRIMARY_BLUE, CARD_WHITE, BORDER_DEFAULT,
              [
                  "React Native cross-platform architecture, native UI threads.",
                  "FlatList memory optimization, gestures, offline SQLite sync.",
                  "Career: Mobile App Engineer (Rs 12–24 LPA)."
              ], "iOS & Android Cross-Platform")

    draw_card(s5, Inches(8.9), Inches(1.8), Inches(3.6), Inches(2.4),
              "Course 09: Cybersecurity Systems", "100% BUILT (30 DAYS)", CORAL_RED, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Zero-Trust architecture, AES-GCM encryption, memory safety.",
                  "Buffer overflow defenses, OWASP Top 10, SOC 2 compliance.",
                  "Career: Security Engineer (Rs 15–32 LPA)."
              ], "Defending Enterprise Systems")

    draw_card(s5, Inches(0.8), Inches(4.35), Inches(5.6), Inches(2.55),
              "Course 10: Database Systems & SQL Performance", "100% BUILT (30 DAYS)", EMERALD_GREEN, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Database engine internals: B+ Tree index structures, Write-Ahead Logs (WAL), MVCC.",
                  "SQL execution plans, deadlocks, connection pooling, and multi-version concurrency.",
                  "Career: Database Administrator (DBA), Data Platform Engineer (Rs 14–25 LPA)."
              ], "High-Throughput Storage Engines")

    draw_card(s5, Inches(6.8), Inches(4.35), Inches(5.7), Inches(2.55),
              "Course 11: High-Scale Distributed Systems", "100% BUILT (30 DAYS)", PRIMARY_BLUE, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Raft consensus protocol, Two-Phase Commits (2PC), CAP theorem trade-offs.",
                  "Consistent hashing ring partitions, vector clocks, and distributed lock managers.",
                  "Career: Distributed Systems Architect, Principal Infrastructure Engineer (Rs 20–40 LPA)."
              ], "Global Fault-Tolerant Clusters")

    set_notes(s5, "This slide represents our deep computer science moat: Data Structures, Mobile, Cybersecurity, Database Internals, and Distributed Systems. In Course 10, students study how B+ trees split and write to disk. In Course 11, they implement the Raft consensus algorithm. This is why our students stand out from standard bootcamp graduates who only know surface-level frontend code.")

    # ========================================================
    # SLIDE 6: CUTTING-EDGE AI & QUANT (COURSES 12, 15, 16, 21, 37)
    # ========================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_slide_header(s6, 6, "High-Margin Deep Specializations", 
                     "Cutting-Edge AI, 3D Graphics & Quant Systems (Courses 12, 15, 16, 21, 37)", 
                     "Elite Career Specializations with Global $200k+ Placement Benchmarks (100% Built & Live)")

    draw_card(s6, Inches(0.8), Inches(1.8), Inches(5.6), Inches(2.45),
              "Course 21: Quant Trading Systems", "👑 THE CROWN JEWEL (30/30 DAYS LIVE)", AMBER_GOLD, CARD_WHITE, AMBER_BORDER,
              [
                  "High-Frequency Trading in C++: 41.8ns limit order book (LOB) matching engine.",
                  "Kernel bypass, lock-free SPSC circular ring buffers with 64-byte cache alignment.",
                  "SEC Rule 15c3-5 pre-trade risk kill switches & Black-Scholes derivatives Greeks.",
                  "Career: Quantitative Developer, HFT Trader (Rs 40–80 LPA / $200k–$400k+)."
              ], "World's First In-Browser HFT Curriculum")

    draw_card(s6, Inches(6.8), Inches(1.8), Inches(5.7), Inches(2.45),
              "Course 12 & 37: Applied AI & NLP", "60 DAYS TOTAL (100% BUILT & EXPANDING)", PURPLE_ACCENT, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Course 12: Applied AI Foundations: Neural networks, backprop, vector embeddings, RAG.",
                  "Course 37: NLP & Transformers: Scaled dot-product self-attention, BPE, LoRA fine-tuning.",
                  "Production Guardrails: Citation verification, hallucination filters, and latency bounds.",
                  "Career: AI/ML Engineer, LLMOps Specialist (Rs 16–35 LPA / $140k–$210k)."
              ], "From Neural Networks to Sovereign LLMs")

    draw_card(s6, Inches(0.8), Inches(4.45), Inches(5.6), Inches(2.45),
              "Course 15: 3D Graphics & Avatars", "100% BUILT (30 DAYS LIVE)", PRIMARY_BLUE, CARD_WHITE, BORDER_DEFAULT,
              [
                  "WebGL2 programmable GPU pipelines, Model-View-Projection (MVP) matrix transforms.",
                  "Skeletal rigging, inverse kinematics (FABRIK), and quaternion SLERP animation.",
                  "Powers PinIT's own 3D AI mentors! Career: 3D Graphics Engineer (Rs 15–30 LPA)."
              ], "WebGL2 & GPU Shader Graphics")

    draw_card(s6, Inches(6.8), Inches(4.45), Inches(5.7), Inches(2.45),
              "Course 16: Blockchain & Web3", "100% BUILT (30 DAYS LIVE)", EMERALD_GREEN, CARD_WHITE, BORDER_DEFAULT,
              [
                  "EVM internals, Solidity smart contracts, Merkle Patricia state roots.",
                  "Reentrancy mutex guards, ERC-20 Conservation of Value, gas optimization.",
                  "Career: Smart Contract Auditor, Web3 Protocol Engineer (Rs 18–35 LPA)."
              ], "Cryptographic State Machines")

    set_notes(s6, "This slide contains our highest-margin, elite disciplines. Course 21 is Quantitative Systems—teaching high-frequency trading in C++ with 41.8-nanosecond matching. Prop shops pay Rs 40 to 80 Lakh starting packages for this skill. Meanwhile, Course 12 and 37 cover modern AI, LLMs, and Transformers. These courses position PinIT as an elite institution partner.")

    # ========================================================
    # SLIDE 7: IOT & HARDWARE SILICON (COURSES 14, 17, 18, 19)
    # ========================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_slide_header(s7, 7, "Semiconductor & Hardware Silicon", 
                     "IoT, Embedded Firmware & Hardware Security (Courses 14, 17, 18, 19)", 
                     "Direct Hardware Silicon Engineering Aligned with India's $50B Semiconductor Mission")

    draw_card(s7, Inches(0.8), Inches(1.8), Inches(5.6), Inches(2.45),
              "Course 14: Embedded MCU Programming", "DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", PRIMARY_BLUE, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Bare-metal C++ microcontroller programming, memory-mapped I/O (MMIO).",
                  "Volatile hardware register pointers, NVIC interrupts, circular DMA double-buffering.",
                  "RegisterBits Simulator: Flip bits 0-7 live and see registers mutate.",
                  "Career: Embedded Firmware Engineer (Rs 10–22 LPA)."
              ], "Silicon Registers & Bare-Metal Control")

    draw_card(s7, Inches(6.8), Inches(1.8), Inches(5.7), Inches(2.45),
              "Course 18: Edge AI & TinyML", "DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", PURPLE_ACCENT, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Running AI neural networks directly on microcontrollers with zero cloud latency.",
                  "INT8 post-training quantization, CMSIS-NN ARM SIMD micro-kernels (SMLAD).",
                  "Static tensor arena allocation without heap fragmentation.",
                  "Career: Edge AI Developer, TinyML Systems Engineer (Rs 14–26 LPA)."
              ], "AI on Microcontrollers & Sensors")

    draw_card(s7, Inches(0.8), Inches(4.45), Inches(5.6), Inches(2.45),
              "Course 17: IoT Wireless Networks", "DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", EMERALD_GREEN, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Wireless radio protocols: Friis link budgets, IEEE 802.15.4 MAC frames.",
                  "RFC 6282 6LoWPAN header compression (compressing 40-byte IPv6 headers to 2 bytes).",
                  "CoAP transport over UDP and MQTT-SN for 10-year battery sensor nodes.",
                  "Career: IoT Network Architect, Wireless Systems Engineer (Rs 12–24 LPA)."
              ], "Low-Power Mesh Networking")

    draw_card(s7, Inches(6.8), Inches(4.45), Inches(5.7), Inches(2.45),
              "Course 19: Hardware Root of Trust & Security", "DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", CORAL_RED, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Silicon Hardware Root of Trust: OTP eFuses, immutable Mask ROM bootloaders.",
                  "Cryptographic secure boot chains, ARM TrustZone hardware bus memory partitioning.",
                  "On-The-Fly Decryption (OTFDEC) defeating physical PCB trace sniffing.",
                  "Career: Hardware Security Researcher, Automotive Systems Auditor (Rs 15–30 LPA)."
              ], "Silicon Security & Secure Boot Chains")

    set_notes(s7, "India is investing over $50 Billion into semiconductor manufacturing and hardware design. These four courses—Embedded MCU, Edge AI TinyML, Wireless IoT, and Hardware Root of Trust—connect our students directly to physical chips. Days 1 through 5 are live today, and our Branch B sub-agents are expanding Days 6 through 30.")

    # ========================================================
    # SLIDE 8: COMMERCE & FINANCIAL MANAGEMENT (COURSES 22, 23, 24, 28, 30)
    # ========================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_slide_header(s8, 8, "Business School Flagship Tracks", 
                     "Accounting, Finance & Operations Management (Courses 22, 23, 24, 28, 30)", 
                     "Modernizing B.Com & MBA Education with Live Double-Entry Ledgers and Financial Modeling")

    draw_card(s8, Inches(0.8), Inches(1.8), Inches(5.6), Inches(2.45),
              "Course 22: Digital Accounting & Taxation", "DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", EMERALD_GREEN, CARD_WHITE, GREEN_BORDER,
              [
                  "Double-entry bookkeeping trial balance, ASC 606 revenue recognition.",
                  "ASC 740 Deferred Tax Assets/Liabilities (DTA/DTL) and OECD transfer pricing.",
                  "LedgerSheet Simulator: Interactive T-accounts that flash red until balanced.",
                  "Career: Corporate Controller, Tax Consultant at Big 4 (Rs 8–18 LPA)."
              ], "Double-Entry Balance & Statutory Tax")

    draw_card(s8, Inches(6.8), Inches(1.8), Inches(5.7), Inches(2.45),
              "Course 23: Business Finance & Investment", "DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", AMBER_GOLD, CARD_WHITE, AMBER_BORDER,
              [
                  "Discounted Cash Flow (DCF), WACC valuation, DuPont 3-step ROE decomposition.",
                  "Multi-tranche debt capital structures, LBO debt waterfalls, and M&A accretion.",
                  "Bars Simulator: Dynamic sensitivity bridges and Monte Carlo capital risk.",
                  "Career: Investment Banking Analyst, Private Equity Associate (Rs 12–25 LPA)."
              ], "Corporate Valuation & M&A Modeling")

    draw_card(s8, Inches(0.8), Inches(4.45), Inches(3.6), Inches(2.45),
              "Course 24: Business Analytics", "DAYS 1–5 LIVE • D6–30 IN FLIGHT", PRIMARY_BLUE, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Linear programming simplex optimization, marginal shadow prices.",
                  "Cohort retention matrices, Net Revenue Retention (NRR > 100%).",
                  "Career: Financial Analyst (Rs 10–20 LPA)."
              ], "Prescriptive Decision Analytics")

    draw_card(s8, Inches(4.8), Inches(4.45), Inches(3.7), Inches(2.45),
              "Course 28: Entrepreneurship", "DAYS 1–5 LIVE • D6–30 IN FLIGHT", PURPLE_ACCENT, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Business Model Canvas (BMC), burn rate runway, SAFE note conversion.",
                  "Cap table dilution and liquidation preference waterfalls.",
                  "Career: Startup Founder, Venture Analyst."
              ], "Cap Tables & Venture Creation")

    draw_card(s8, Inches(8.9), Inches(4.45), Inches(3.6), Inches(2.45),
              "Course 30: Supply Chain & Ops", "DAYS 1–5 LIVE • D6–30 IN FLIGHT", PRIMARY_BLUE, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Little's Law (WIP = Throughput * Cycle Time), EOQ inventory curves.",
                  "Bullwhip effect reduction, Six Sigma Cpk quality control.",
                  "Career: Operations Director (Rs 10–22 LPA)."
              ], "Process Flow & Inventory Control")

    set_notes(s8, "Over 60% of university students are enrolled in Commerce, BBA, and MBA programs. We have brought the exact same interactive simulation rigor to business education. Students use our LedgerSheet engine to balance books, run DCF valuations, and model supply chain inventory. This unlocks massive enterprise software sales to business colleges.")

    # ========================================================
    # SLIDE 9: BUSINESS GROWTH & SALES (COURSES 25, 26, 27, 29, 31)
    # ========================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_slide_header(s9, 9, "Revenue & Commercial Growth Systems", 
                     "Marketing, Sales, E-Commerce & AI Transformation (Courses 25, 26, 27, 29, 31)", 
                     "Training Revenue-Generating Leaders: From Digital Attribution to Enterprise AI Automation")

    draw_card(s9, Inches(0.8), Inches(1.8), Inches(5.6), Inches(2.45),
              "Course 25 & 26: Marketing & Growth", "DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", PRIMARY_BLUE, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Course 25: Marketing & Brand Strategy: PESTLE, Porter's Five Forces, STP segmentation.",
                  "Course 26: Digital Marketing Analytics: Programmatic ad auctions, multi-touch attribution.",
                  "Funnel Simulator: Visualizes CAC payback periods and conversion drop-offs.",
                  "Career: Growth Marketing Lead, Performance Marketer (Rs 9–20 LPA)."
              ], "Attribution Modeling & Brand Strategy")

    draw_card(s9, Inches(6.8), Inches(1.8), Inches(5.7), Inches(2.45),
              "Course 27: E-Commerce & Digital Business", "DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", EMERALD_GREEN, CARD_WHITE, GREEN_BORDER,
              [
                  "Two-sided marketplace economics, take rate commission modeling, dynamic pricing.",
                  "Cart abandonment funnels, payment gateway APIs, and reverse logistics margins.",
                  "Funnel Simulator: Optimizes 1-click checkout and warehouse SLA routing.",
                  "Career: E-Commerce Category Manager, Marketplace Operations (Rs 10–22 LPA)."
              ], "Marketplace Economics & Store UX")

    draw_card(s9, Inches(0.8), Inches(4.45), Inches(5.6), Inches(2.45),
              "Course 29: Enterprise B2B Sales & CRM", "DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", AMBER_GOLD, CARD_WHITE, AMBER_BORDER,
              [
                  "B2B pipeline velocity math, BANT qualification, MEDDPICC deal defense.",
                  "LTV:CAC unit economics, proactive churn intervention playbooks, CPQ guardrails.",
                  "Career: Enterprise Account Executive, Customer Success Director (Rs 12–25 LPA)."
              ], "B2B Pipeline Velocity & Deal Defense")

    draw_card(s9, Inches(6.8), Inches(4.45), Inches(5.7), Inches(2.45),
              "Course 31: AI & Digital Transformation", "DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", PURPLE_ACCENT, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Hyperautomation: Deterministic RPA bots vs probabilistic cognitive AI agents.",
                  "Process mining on ERP event logs, automation economics (FTE labor savings).",
                  "Career: Management Consultant, Chief Digital Officer Staff (Rs 14–28 LPA)."
              ], "Enterprise AI Adoption & Process Mining")

    set_notes(s9, "Modern businesses run on growth and digital transformation. In these courses, students learn programmatic ad attribution, two-sided marketplace take rates, B2B enterprise sales pipelines, and process mining. When graduates interview at fast-growing companies, they already understand customer acquisition economics and revenue pipelines.")

    # ========================================================
    # SLIDE 10: FRESHMAN LAUNCHPAD & ROADMAP (COURSES 32–36)
    # ========================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_slide_header(s10, 10, "Universal Campus Adoption & The Road Ahead", 
                     "Freshman Launchpads (Courses 32–36) & The Scaled 3-Branch Roadmap", 
                     "Level 0 Campus Readiness for Every Incoming Student + The Parallel Execution Engine to 100% Completion")

    # 5 Launchpad mini cards
    draw_card(s10, Inches(0.8), Inches(1.8), Inches(2.1), Inches(2.7),
              "Course 32: OS Basics", "D1-5 LIVE", PRIMARY_BLUE, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Linux POSIX commands.",
                  "File tree navigation.",
                  "Piping & terminal CLI."
              ], "Computer Literacy")

    draw_card(s10, Inches(3.1), Inches(1.8), Inches(2.1), Inches(2.7),
              "Course 33: AI Prompt", "100% LIVE (30D)", PURPLE_ACCENT, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Everyday AI literacy.",
                  "Chain-of-thought prompts.",
                  "Automated workflows."
              ], "Everyday AI Tools")

    draw_card(s10, Inches(5.4), Inches(1.8), Inches(2.4), Inches(2.7),
              "Course 34: Excel Viz", "D1-10 LIVE", EMERALD_GREEN, CARD_WHITE, GREEN_BORDER,
              [
                  "Power Query & Star Schema.",
                  "DAX Time Intelligence.",
                  "Financial Amortization."
              ], "Data Modeling")

    draw_card(s10, Inches(8.0), Inches(1.8), Inches(2.1), Inches(2.7),
              "Course 35: Git VCS", "D1-5 LIVE", PRIMARY_BLUE, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Distributed Git states.",
                  "Branching & merge conflicts.",
                  "GitHub team workflows."
              ], "Version Control")

    draw_card(s10, Inches(10.3), Inches(1.8), Inches(2.23), Inches(2.7),
              "Course 36: Soft Skills", "D1-5 LIVE", AMBER_GOLD, CARD_WHITE, BORDER_DEFAULT,
              [
                  "Socratic STAR interviews.",
                  "Executive communication.",
                  "Compensation negotiation."
              ], "Interview Mastery")

    # Bottom 3-Branch Execution Map
    draw_card(s10, Inches(0.8), Inches(4.7), Inches(11.73), Inches(2.2),
              "The 3-Branch Parallel Scaling Roadmap: Finishing the Remaining 34%", "THE ROAD TO 100% COMPLETION", PRIMARY_BLUE, PRIMARY_LIGHT, PRIMARY_BLUE,
              [
                  "Branch A (Current Stream): Finalizing Tech Launchpads (Excel, Git, OS, Soft Skills to Day 30 = 95 Days).",
                  "Branch B (Sub-Agent Stream): Completing 14 Commerce Tracks & 4 IoT Tracks from Day 6 to Day 30 (450 Days) with zero file collisions.",
                  "Branch C (Platform Stream): Delivering Campus Admin Portal, Faculty Grading Rubrics, and University Multi-Tenant Isolation.",
                  "Commercial Goal: Licensing the complete 37-course OS to universities at $50k-$200k/year recurring B2B enterprise contracts."
              ], "1,045 Days Live Today -> 1,590 Days Complete Platform Target")

    set_notes(s10, "To conclude: Every student starts in our universal launchpad—mastering Excel, Linux, Git, and Interview Communication. And with our 3-branch parallel execution architecture, we are rapidly finishing the remaining 34% of the curriculum while deploying our university administrative software. We have built the definitive operating system for higher education. Thank you, and I welcome your questions.")

    output_file = "docs/PINIT_CURRICULUM_AND_PRODUCT_10_SLIDE_PITCH_DECK.pptx"
    prs.save(output_file)
    print(f"37-Course presentation successfully generated at: {output_file}")

if __name__ == "__main__":
    build_37_courses_deck()
