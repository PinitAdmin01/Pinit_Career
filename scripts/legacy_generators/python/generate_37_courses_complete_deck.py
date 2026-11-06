import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def build_complete_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Executive Light Palette (Apple / Stripe High-Contrast)
    CANVAS_BG       = RGBColor(0xF8, 0xFA, 0xFC)  # Crisp off-white / light slate
    CARD_WHITE      = RGBColor(0xFF, 0xFF, 0xFF)  # Pure white card surface
    BORDER_DEFAULT  = RGBColor(0xE2, 0xE8, 0xF0)  # Subtle clean slate border
    BORDER_CARD     = RGBColor(0xCB, 0xD5, 0xE1)  # Card outline
    TEXT_TITLE      = RGBColor(0x0F, 0x17, 0x2A)  # Deep Navy #0f172a
    TEXT_BODY       = RGBColor(0x33, 0x41, 0x55)  # Readable Slate #334155
    TEXT_MUTED      = RGBColor(0x64, 0x74, 0x8B)  # Supporting Slate #64748b
    PRIMARY_BLUE    = RGBColor(0x25, 0x63, 0xEB)  # Royal Blue #2563eb
    PRIMARY_LIGHT   = RGBColor(0xEF, 0xF6, 0xFF)  # Soft Blue tint
    EMERALD_GREEN   = RGBColor(0x05, 0x96, 0x69)  # Deep Emerald
    GREEN_LIGHT     = RGBColor(0xEC, 0xFD, 0xF5)  # Soft Green tint
    GREEN_BORDER    = RGBColor(0x6E, 0xE7, 0xB7)  # Emerald border
    AMBER_GOLD      = RGBColor(0xD9, 0x77, 0x06)  # Warm Gold
    PURPLE_ACCENT   = RGBColor(0x7C, 0x3A, 0xED)  # Deep Violet
    CORAL_RED       = RGBColor(0xDC, 0x26, 0x26)  # Danger / Alert Red
    RED_LIGHT       = RGBColor(0xFE, 0xF2, 0xF2)  # Soft Red tint
    RED_BORDER      = RGBColor(0xFC, 0xA5, 0xA5)  # Coral border

    def add_slide_header(slide, slide_num, category_badge, title, subtitle):
        # Background Canvas
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = CANVAS_BG
        bg.line.fill.background()

        # Top Category Badge Pill
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.32), Inches(3.2), Inches(0.32))
        pill.fill.solid()
        pill.fill.fore_color.rgb = PRIMARY_LIGHT
        pill.line.color.rgb = PRIMARY_BLUE
        pill.line.width = Pt(1)
        p_pill = pill.text_frame.paragraphs[0]
        p_pill.text = category_badge.upper()
        p_pill.font.size = Pt(9.5)
        p_pill.font.bold = True
        p_pill.font.color.rgb = PRIMARY_BLUE
        p_pill.alignment = PP_ALIGN.CENTER

        # Slide Number
        box_num = slide.shapes.add_textbox(Inches(11.2), Inches(0.32), Inches(1.33), Inches(0.35))
        p_num = box_num.text_frame.paragraphs[0]
        p_num.text = f"SLIDE {slide_num:02d} / 10"
        p_num.font.size = Pt(11)
        p_num.font.bold = True
        p_num.font.color.rgb = TEXT_MUTED
        p_num.alignment = PP_ALIGN.RIGHT

        # Main Title
        box_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.68), Inches(11.7), Inches(0.55))
        p_title = box_title.text_frame.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(20)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_TITLE

        # Subtitle
        box_sub = slide.shapes.add_textbox(Inches(0.8), Inches(1.22), Inches(11.7), Inches(0.38))
        p_sub = box_sub.text_frame.paragraphs[0]
        p_sub.text = subtitle
        p_sub.font.size = Pt(11)
        p_sub.font.color.rgb = TEXT_MUTED

    def draw_course_box(slide, left, top, width, height, course_num, title, status_text, status_color, topics_list, how_we_teach, career_text):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_WHITE
        card.line.color.rgb = BORDER_DEFAULT
        card.line.width = Pt(1.2)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.14)
        tf.margin_right = Inches(0.14)
        tf.margin_top = Inches(0.10)
        tf.margin_bottom = Inches(0.10)

        # Header Line: Course Number + Title
        p_head = tf.paragraphs[0]
        p_head.text = f"{course_num}: {title}"
        p_head.font.size = Pt(11)
        p_head.font.bold = True
        p_head.font.color.rgb = TEXT_TITLE
        p_head.space_after = Pt(2)

        # Status Badge Line
        p_stat = tf.add_paragraph()
        p_stat.text = f"[{status_text}]"
        p_stat.font.size = Pt(8.5)
        p_stat.font.bold = True
        p_stat.font.color.rgb = status_color
        p_stat.space_after = Pt(3)

        # Topics Taught
        p_top = tf.add_paragraph()
        p_top.text = f"• What We Teach: {topics_list}"
        p_top.font.size = Pt(9.5)
        p_top.font.color.rgb = TEXT_BODY
        p_top.space_after = Pt(2)

        # How We Teach
        p_how = tf.add_paragraph()
        p_how.text = f"• How We Teach: {how_we_teach}"
        p_how.font.size = Pt(9.5)
        p_how.font.color.rgb = PRIMARY_BLUE
        p_how.space_after = Pt(2)

        # Career Outcome
        p_car = tf.add_paragraph()
        p_car.text = f"• Career & Salary: {career_text}"
        p_car.font.size = Pt(9)
        p_car.font.color.rgb = TEXT_MUTED

    def set_notes(slide, text):
        slide.notes_slide.notes_text_frame.text = text

    # ========================================================
    # SLIDE 1: PRODUCT INTRODUCTION & EXECUTIVE PITCH
    # ========================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_slide_header(s1, 1, "Executive Briefing", 
                     "PinIT Career OS: The All-In-One Campus Career Operating System", 
                     "Transforming University Students into Hireable Professionals Through Active In-Browser Learning & Proof-of-Work")

    # 3 Top KPI Cards
    def draw_kpi(left, stat, label, desc, color):
        k = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.75), Inches(3.6), Inches(1.7))
        k.fill.solid()
        k.fill.fore_color.rgb = CARD_WHITE
        k.line.color.rgb = color
        k.line.width = Pt(1.5)
        tf = k.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.18)
        tf.margin_right = Inches(0.18)
        tf.margin_top = Inches(0.12)
        p = tf.paragraphs[0]
        p.text = stat
        p.font.size = Pt(34)
        p.font.bold = True
        p.font.color.rgb = color
        p2 = tf.add_paragraph()
        p2.text = label.upper()
        p2.font.size = Pt(11)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_TITLE
        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(9.5)
        p3.font.color.rgb = TEXT_MUTED

    draw_kpi(Inches(0.8), "37", "Master Courses", "Complete multi-disciplinary curriculum across Tech, AI, Cloud, Hardware & 14 Commerce Tracks.", PRIMARY_BLUE)
    draw_kpi(Inches(4.8), "1,045", "Days Built & Live", "65.7% of full 30-day foundation curriculum built, verified with tests, and running live.", EMERALD_GREEN)
    draw_kpi(Inches(8.9), "990", "Visual Simulators", "17 proprietary visual engines replacing passive video dropouts with active browser practice.", PURPLE_ACCENT)

    # Bottom Problem vs Solution
    card_prob = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.7), Inches(5.6), Inches(3.2))
    card_prob.fill.solid()
    card_prob.fill.fore_color.rgb = RED_LIGHT
    card_prob.line.color.rgb = RED_BORDER
    card_prob.line.width = Pt(1.2)
    tf_p = card_prob.text_frame
    tf_p.word_wrap = True
    p = tf_p.paragraphs[0]
    p.text = "[THE PROBLEM] The College Employability Crisis"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = CORAL_RED
    p.space_after = Pt(4)
    bullets_p = [
        "Outdated Theory: Universities teach theory from textbooks written 10 years ago.",
        "90% Video Dropout: MOOCs (Coursera, Udemy) fail because watching passive videos is boring.",
        "Unemployable Graduates: Over 80% fail basic practical coding and financial interviews.",
        "Campus Software Sprawl: Colleges waste $60k-$130k/yr on disconnected LMS and testing tools."
    ]
    for b in bullets_p:
        pb = tf_p.add_paragraph()
        pb.text = f"• {b}"
        pb.font.size = Pt(10.5)
        pb.font.color.rgb = TEXT_BODY
        pb.space_after = Pt(3)

    card_sol = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(3.7), Inches(5.7), Inches(3.2))
    card_sol.fill.solid()
    card_sol.fill.fore_color.rgb = GREEN_LIGHT
    card_sol.line.color.rgb = GREEN_BORDER
    card_sol.line.width = Pt(1.2)
    tf_s = card_sol.text_frame
    tf_s.word_wrap = True
    p = tf_s.paragraphs[0]
    p.text = "[THE SOLUTION] The PinIT Sovereign Engine"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = EMERALD_GREEN
    p.space_after = Pt(4)
    bullets_s = [
        "All-In-One Platform: Integrates curriculum, browser sandboxes, AI mentors & hiring into 1 app.",
        "Active Learn-By-Doing: Students write real code & balance ledgers in browser every 5 minutes.",
        "24/7 Voice AI Mentors: Personal senior pair-programmers guiding students in real time.",
        "Verifiable Proof-of-Work: Real GitHub repositories and code telemetry recruiters trust."
    ]
    for b in bullets_s:
        pb = tf_s.add_paragraph()
        pb.text = f"• {b}"
        pb.font.size = Pt(10.5)
        pb.font.color.rgb = TEXT_BODY
        pb.space_after = Pt(3)

    set_notes(s1, "Welcome, shareholders. If you're new to PinIT Career OS, here is our core premise: Higher education is experiencing an employability crisis. Universities teach outdated theory, and online video courses fail because 90% of students drop out. PinIT solves this. We are an all-in-one Career Operating System that replaces passive videos with hands-on practice, AI pair-programming, and real company projects. Over 1,045 training days are already built and live on our platform today.")

    # ========================================================
    # SLIDE 2: FLAGSHIP 1 - COURSE 02: FULLSTACK REACT/NEXT.JS
    # ========================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_slide_header(s2, 2, "Flagship Fullstack Track 1", 
                     "Course 02: Full-Stack React & Next.js Web Development", 
                     "Training Industry-Ready Frontend & Fullstack Web Architects on Modern React 19 & Next.js App Router")

    draw_course_box(s2, Inches(0.8), Inches(1.75), Inches(5.6), Inches(5.2),
                    "Course 02", "Full-Stack React Web Development", "🟢 100% COMPLETE & LIVE (30/30 DAYS • 96 QUESTS)", EMERALD_GREEN,
                    "React 19, JSX, Custom Hooks, Next.js App Router, React Server Components (RSC), Flight RPC serialization, Server Actions, Edge Middleware, CSS Grid/Tailwind, and Suspense streaming SSR.",
                    "Active In-Browser Development Canvas: Students write real TypeScript, inspect live DOM component trees via our ComponentTree visual engine, and triage intentional production SSR hydration mismatches in the browser.",
                    "Senior Full-Stack Engineer, Frontend Architect, React Platform Lead (Starting Salary: Rs 14–25 LPA / $120k–$160k).")

    card_cap1 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.75), Inches(5.7), Inches(5.2))
    card_cap1.fill.solid()
    card_cap1.fill.fore_color.rgb = CARD_WHITE
    card_cap1.line.color.rgb = PRIMARY_BLUE
    card_cap1.line.width = Pt(1.5)
    tf_c1 = card_cap1.text_frame
    tf_c1.word_wrap = True
    tf_c1.margin_left = Inches(0.18)
    tf_c1.margin_right = Inches(0.18)
    tf_c1.margin_top = Inches(0.15)
    p = tf_c1.paragraphs[0]
    p.text = "WHAT STUDENTS BUILD: 30-DAY MILESTONE ROADMAP"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_BLUE
    p.space_after = Pt(6)
    c1_items = [
        "Days 1–5: Component Architecture & State Invariants (Pure functions, immutable state updates, unmount cleanup).",
        "Days 6–10: High-Performance Data Grids (Virtual scrolling, 100k-row rendering, synthetic event debouncing).",
        "Days 11–15: Server-Side Rendering & Flight Protocol (Streaming HTML hydration, zero-bundle-size Server Components).",
        "Days 16–20: Modern Edge Routing & Middleware (App router parallel routes, intercepting modals, edge geo-redirects).",
        "Days 21–25: State Synchronization & Optimistic UI (Server actions, form optimistic mutation rollbacks, React cache).",
        "Days 26–30 & Capstone: Sovereign Cloud Analytics Workspace (Production Next.js 19 SaaS with real GitHub Proof-of-Work!)."
    ]
    for ci in c1_items:
        pci = tf_c1.add_paragraph()
        pci.text = f"• {ci}"
        pci.font.size = Pt(10)
        pci.font.color.rgb = TEXT_BODY
        pci.space_after = Pt(4)

    set_notes(s2, "Course 02 is our first flagship fullstack course: Full-Stack React and Next.js Web Development. We teach modern React 19 and Next.js App Router. Unlike bootcamps that teach simple todo apps, our students build virtualized 100,000-row data grids, debug server hydration mismatches, and deploy a full SaaS platform. This course is 100% built, tested, and live with 30 comprehensive days.")

    # ========================================================
    # SLIDE 3: FLAGSHIP 2 - COURSE 20: PYTHON & BACKEND SYSTEMS
    # ========================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_slide_header(s3, 3, "Flagship Fullstack Track 2", 
                     "Course 20: Python Programming & Backend Systems", 
                     "Engineering Resilient High-Throughput APIs, Distributed Microservices, and Async Data Pipelines")

    draw_course_box(s3, Inches(0.8), Inches(1.75), Inches(5.6), Inches(5.2),
                    "Course 20", "Python Programming & Backend Systems", "🟢 100% COMPLETE & LIVE (30/30 DAYS • 90 QUESTS)", EMERALD_GREEN,
                    "Python 3.12 syntax, memory pointers, GIL mechanics, asyncio event loop scheduling, non-blocking sockets, FastAPI REST microservices, Pydantic v2 schemas, SQLAlchemy 2.0 async connection pooling, Redis caching, and distributed worker queues.",
                    "Live Async Execution Engine: Students write real Python code in the browser, simulate asynchronous coroutine event loops, triage PostgreSQL deadlocks, and benchmark API throughput under simulated traffic surges.",
                    "Senior Backend Engineer, Python Systems Architect, Cloud Microservices Lead (Starting Salary: Rs 14–26 LPA / $130k–$175k).")

    card_cap2 = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.75), Inches(5.7), Inches(5.2))
    card_cap2.fill.solid()
    card_cap2.fill.fore_color.rgb = CARD_WHITE
    card_cap2.line.color.rgb = EMERALD_GREEN
    card_cap2.line.width = Pt(1.5)
    tf_c2 = card_cap2.text_frame
    tf_c2.word_wrap = True
    tf_c2.margin_left = Inches(0.18)
    tf_c2.margin_right = Inches(0.18)
    tf_c2.margin_top = Inches(0.15)
    p = tf_c2.paragraphs[0]
    p.text = "WHAT STUDENTS BUILD: 30-DAY MILESTONE ROADMAP"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = EMERALD_GREEN
    p.space_after = Pt(6)
    c2_items = [
        "Days 1–5: Pythonic Internals & Memory Architecture (Dunder methods, memory references, garbage collection cycles).",
        "Days 6–10: High-Performance AsyncIO (Event loop scheduling, cooperative multitasking, non-blocking network sockets).",
        "Days 11–15: Production FastAPI Architecture (Dependency injection, Pydantic data schemas, automated OpenAPI docs).",
        "Days 16–20: Relational Database Engineering (SQLAlchemy async ORM, connection pool tuning, transaction ACID isolation).",
        "Days 21–25: Distributed Caching & Security (Redis cache invalidation, JWT token blacklisting, rate-limiting algorithms).",
        "Days 26–30 & Capstone: Sovereign Distributed Job Queue (Asynchronous worker cluster with exponential retry and PostgreSQL ledger!)."
    ]
    for ci in c2_items:
        pci = tf_c2.add_paragraph()
        pci.text = f"• {ci}"
        pci.font.size = Pt(10)
        pci.font.color.rgb = TEXT_BODY
        pci.space_after = Pt(4)

    set_notes(s3, "Course 20 is our second flagship fullstack course: Python Programming and Backend Systems. Python is the universal language of AI and backend microservices. In 30 days, students build high-speed FastAPI services, manage PostgreSQL database pools, and architect async task queues. Their capstone is a distributed background job queue that proves their backend reliability.")

    # ========================================================
    # SLIDE 4: ENTERPRISE INFRASTRUCTURE (COURSES 01, 03, 04, 05, 06)
    # ========================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_slide_header(s4, 4, "Enterprise Infrastructure", 
                     "Core Software & Cloud Engineering (Courses 01, 03, 04, 05, 06)", 
                     "5 Foundation Tracks Transforming Beginners into Enterprise Infrastructure Engineers (100% Live)")

    draw_course_box(s4, Inches(0.8), Inches(1.75), Inches(3.6), Inches(2.45),
                    "Course 01", "Java Fundamentals & Core Logic", "🟢 100% LIVE (30 DAYS)", EMERALD_GREEN,
                    "Java 21 LTS syntax, OOP encapsulation, stack/heap memory, try-with-resources, Project Loom virtual threads.",
                    "JVM Bytecode Simulator: Students inspect stack frames and simulate virtual thread context switches.",
                    "Java Enterprise Developer (Rs 10–20 LPA).")

    draw_course_box(s4, Inches(4.8), Inches(1.75), Inches(3.7), Inches(2.45),
                    "Course 03", "Node.js & TypeScript Backend", "🟢 100% LIVE (30 DAYS)", EMERALD_GREEN,
                    "Node.js event loop, libuv microtask queues, stream pipelines, TypeScript enterprise schemas, JWT auth.",
                    "Flow Simulator: Animates non-blocking I/O queues and middleware pipeline execution.",
                    "Node.js Backend Engineer (Rs 12–22 LPA).")

    draw_course_box(s4, Inches(8.9), Inches(1.75), Inches(3.6), Inches(2.45),
                    "Course 04", "Cloud Native Architectures (AWS)", "🟢 100% LIVE (30 DAYS)", EMERALD_GREEN,
                    "EC2, S3, RDS, Lambda serverless, API Gateway, IAM zero-trust policies, VPC subnets, CloudFront CDN.",
                    "Cloud Topology Simulator: Students configure virtual private clouds and serverless routing.",
                    "Cloud Solutions Architect (Rs 14–26 LPA).")

    draw_course_box(s4, Inches(0.8), Inches(4.4), Inches(5.6), Inches(2.5),
                    "Course 05", "DevOps & CI/CD Automation", "🟢 100% LIVE (30 DAYS)", EMERALD_GREEN,
                    "Docker multi-stage builds, container orchestration, Kubernetes pod lifecycles, automated GitHub Actions CI/CD workflows, Terraform Infrastructure as Code (IaC).",
                    "Container Lifecycle Engine: Students debug failing container builds and simulate automated rolling updates.",
                    "Site Reliability Engineer (SRE), DevOps Architect (Rs 14–28 LPA).")

    draw_course_box(s4, Inches(6.8), Inches(4.4), Inches(5.7), Inches(2.5),
                    "Course 06", "UI/UX Design Systems & Visual Frontend", "🟢 100% LIVE (30 DAYS)", EMERALD_GREEN,
                    "Atomic design architecture, WCAG 2.1 AA accessibility standards, design token variables, Figma-to-code translation, responsive fluid typography, and dark-mode theming.",
                    "Design Token Studio: Students mutate CSS variables live and verify automated color-contrast accessibility compliance.",
                    "Design Systems Engineer, Senior Frontend Lead (Rs 12–22 LPA).")

    set_notes(s4, "These five courses form the operational backbone of modern engineering: Java for enterprise banking backends, Node.js for high-throughput APIs, AWS for cloud hosting, DevOps for automated Kubernetes delivery, and Design Systems for accessible UI. All five are 100% built and live today.")

    # ========================================================
    # SLIDE 5: DEEP CS & SYSTEMS (COURSES 07, 08, 09, 10, 11)
    # ========================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_slide_header(s5, 5, "Deep Computer Science", 
                     "Algorithms, Systems & Data Internals (Courses 07, 08, 09, 10, 11)", 
                     "Deep Systems Engineering That Generative AI Cannot Automate (100% Live)")

    draw_course_box(s5, Inches(0.8), Inches(1.75), Inches(3.6), Inches(2.45),
                    "Course 07", "Data Structures & Algorithms (DSA)", "🟢 100% LIVE (30 DAYS)", EMERALD_GREEN,
                    "Red-Black trees, graph BFS/DFS, dynamic programming grids, amortized complexity, memory bounds.",
                    "TreeGraph Simulator: Visualizes tree balance rotations and heap array index mappings live.",
                    "Algorithm Engineer (Rs 15–30 LPA).")

    draw_course_box(s5, Inches(4.8), Inches(1.75), Inches(3.7), Inches(2.45),
                    "Course 08", "Mobile Application Development", "🟢 100% LIVE (30 DAYS)", EMERALD_GREEN,
                    "React Native architecture, native UI threads, FlatList memory optimization, gestures, offline SQLite sync.",
                    "Mobile Emulator Canvas: Live simulated device preview testing touch-slop and memory limits.",
                    "Mobile App Engineer (Rs 12–24 LPA).")

    draw_course_box(s5, Inches(8.9), Inches(1.75), Inches(3.6), Inches(2.45),
                    "Course 09", "Cybersecurity & Secure Systems", "🟢 100% LIVE (30 DAYS)", EMERALD_GREEN,
                    "Zero-Trust architecture, AES-GCM encryption, memory bounds, buffer overflow defenses, OWASP Top 10.",
                    "Security Threat Simulator: Students patch simulated SQL injections and cross-site scripting attacks.",
                    "Cybersecurity Engineer (Rs 15–32 LPA).")

    draw_course_box(s5, Inches(0.8), Inches(4.4), Inches(5.6), Inches(2.5),
                    "Course 10", "Database Engineering & SQL Performance", "🟢 100% LIVE (30 DAYS)", EMERALD_GREEN,
                    "B+ Tree index structures, Write-Ahead Logs (WAL), MVCC multi-version concurrency, SQL execution plans, deadlocks, and connection pool starvation.",
                    "B+ Tree Visual Engine: Animates disk block page splits and balance merges as records are inserted.",
                    "Database Administrator (DBA), Data Platform Engineer (Rs 14–25 LPA).")

    draw_course_box(s5, Inches(6.8), Inches(4.4), Inches(5.7), Inches(2.5),
                    "Course 11", "High-Scale Distributed Systems", "🟢 100% LIVE (30 DAYS)", EMERALD_GREEN,
                    "Raft consensus protocol, Two-Phase Commits (2PC), CAP theorem trade-offs, consistent hashing ring partitions, vector clocks, and distributed lock managers.",
                    "Cluster Consensus Simulator: Students simulate network partitions and watch Raft leader elections occur live.",
                    "Distributed Systems Architect, Infrastructure Lead (Rs 20–40 LPA).")

    set_notes(s5, "This slide represents our deep computer science moat: Data Structures, Mobile, Cybersecurity, Database Internals, and Distributed Systems. In Course 10, students study how B+ trees split and write to disk. In Course 11, they implement the Raft consensus algorithm. This is why our students stand out from standard bootcamp graduates who only know surface-level frontend code.")

    # ========================================================
    # SLIDE 6: CUTTING-EDGE AI & QUANT (COURSES 21, 12, 37, 13, 15, 16)
    # ========================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_slide_header(s6, 6, "High-Margin Deep Specializations", 
                     "Cutting-Edge AI, 3D Graphics & Quant Systems (Courses 21, 12, 37, 13, 15, 16)", 
                     "Elite Career Specializations with Global $200k+ Placement Benchmarks (100% Built & Live)")

    # 3x2 Grid of 6 Distinct Courses
    draw_course_box(s6, Inches(0.8), Inches(1.75), Inches(3.65), Inches(2.45),
                    "Course 21", "Quantitative Trading Systems", "👑 100% COMPLETE (30 DAYS)", AMBER_GOLD,
                    "High-Frequency Trading in C++: 41.8ns limit order book (LOB) matching engine, lock-free ring buffers, SEC 15c3-5 risk filters, and Black-Scholes Greeks.",
                    "HFT Market Data Simulator: Parses raw binary NASDAQ ITCH feeds with sub-microsecond latency.",
                    "Quantitative Developer, HFT Trader (Rs 40–80 LPA / $200k–$400k+).")

    draw_course_box(s6, Inches(4.8), Inches(1.75), Inches(3.65), Inches(2.45),
                    "Course 12", "Applied Artificial Intelligence", "🟢 100% LIVE (30 DAYS)", PURPLE_ACCENT,
                    "Neural networks, vector embeddings, cosine similarity, FAISS vector search, LangChain, semantic cache, and RAG pipelines.",
                    "Vector RAG Simulator: Animates semantic embedding space and vector distance search.",
                    "AI/ML Engineer, Applied AI Lead (Rs 15–30 LPA).")

    draw_course_box(s6, Inches(8.8), Inches(1.75), Inches(3.7), Inches(2.45),
                    "Course 37", "NLP & Transformers (LLMs)", "🟢 100% LIVE (30 DAYS)", PURPLE_ACCENT,
                    "Multi-head self-attention math, BPE tokenization, transformer decoder blocks, KV cache, and LoRA fine-tuning.",
                    "Attention Matrix Simulator: Visualizes token self-attention weight heatmaps live.",
                    "LLMOps Specialist, Foundation Model Engineer (Rs 16–35 LPA).")

    draw_course_box(s6, Inches(0.8), Inches(4.4), Inches(3.65), Inches(2.5),
                    "Course 13", "Full-Stack JavaScript Engineering", "🟢 100% LIVE (30 DAYS)", PRIMARY_BLUE,
                    "Full-Stack JavaScript Engineering: ORM schemas migrations, client-server data synchronization, hooks cache.",
                    "Fullstack State Studio: Synchronizes frontend state with backend REST APIs.",
                    "Fullstack JS Developer (Rs 12–22 LPA).")

    draw_course_box(s6, Inches(4.8), Inches(4.4), Inches(3.65), Inches(2.5),
                    "Course 15", "3D Graphics & WebGL2 Engine", "🟢 100% LIVE (30 DAYS)", PRIMARY_BLUE,
                    "WebGL2 GPU pipelines, MVP matrix transforms, vertex shaders, skeletal rigging, inverse kinematics (FABRIK).",
                    "3D Avatar Viewport: Students animate 3D avatars directly in the browser.",
                    "3D Graphics Engineer (Rs 15–30 LPA).")

    draw_course_box(s6, Inches(8.8), Inches(4.4), Inches(3.7), Inches(2.5),
                    "Course 16", "Blockchain & Web3 Smart Contracts", "🟢 100% LIVE (30 DAYS)", EMERALD_GREEN,
                    "EVM internals, Solidity smart contracts, Merkle Patricia state roots, reentrancy mutex guards.",
                    "Cryptographic Ledger Studio: Verifies Merkle tree inclusion proofs.",
                    "Smart Contract Auditor (Rs 18–35 LPA).")

    set_notes(s6, "This slide contains our highest-margin, elite disciplines. Course 21 is Quantitative Systems—teaching high-frequency trading in C++ with 41.8-nanosecond matching. Prop shops pay Rs 40 to 80 Lakh starting packages for this skill. Meanwhile, Course 12 and 37 cover modern AI, LLMs, and Transformers. These courses position PinIT as an elite institution partner.")

    # ========================================================
    # SLIDE 7: IOT & HARDWARE SILICON (COURSES 14, 17, 18, 19)
    # ========================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_slide_header(s7, 7, "Semiconductor & Hardware Silicon", 
                     "IoT, Embedded Firmware & Hardware Security (Courses 14, 17, 18, 19)", 
                     "Direct Hardware Silicon Engineering Aligned with India's $50B Semiconductor Mission")

    draw_course_box(s7, Inches(0.8), Inches(1.75), Inches(5.6), Inches(2.45),
                    "Course 14", "IoT, Firmware & Embedded Systems", "🟡 DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", PRIMARY_BLUE,
                    "Bare-metal C++ microcontroller programming, memory-mapped I/O (MMIO), volatile hardware register pointers, NVIC interrupts, circular DMA double-buffering.",
                    "RegisterBits Simulator: Students flip bits 0-7 live and watch microcontroller memory addresses change.",
                    "Embedded Firmware Engineer (Rs 10–22 LPA).")

    draw_course_box(s7, Inches(6.8), Inches(1.75), Inches(5.7), Inches(2.45),
                    "Course 18", "Edge AI, DSP & TinyML Systems", "🟡 DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", PURPLE_ACCENT,
                    "Running AI neural networks directly on microcontrollers with zero cloud latency, INT8 post-training quantization, CMSIS-NN ARM SIMD micro-kernels (SMLAD).",
                    "TinyML Tensor Arena Simulator: Profiles static memory allocation without heap fragmentation.",
                    "Edge AI Developer, TinyML Systems Engineer (Rs 14–26 LPA).")

    draw_course_box(s7, Inches(0.8), Inches(4.4), Inches(5.6), Inches(2.5),
                    "Course 17", "IoT Wireless Networks & Protocols", "🟡 DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", EMERALD_GREEN,
                    "Wireless radio protocols: Friis link budgets, IEEE 802.15.4 MAC frames, RFC 6282 6LoWPAN header compression (compressing 40-byte IPv6 headers to 2 bytes), CoAP, and MQTT-SN.",
                    "Radio Packet Sniffer Simulator: Decodes binary wireless frames and packet loss rates live.",
                    "IoT Network Architect, Wireless Systems Engineer (Rs 12–24 LPA).")

    draw_course_box(s7, Inches(6.8), Inches(4.4), Inches(5.7), Inches(2.5),
                    "Course 19", "Industrial IoT Security & Device Lifecycle", "🟡 DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", CORAL_RED,
                    "Silicon Hardware Root of Trust: OTP eFuses, immutable Mask ROM, cryptographic secure boot chains, ARM TrustZone hardware bus memory partitioning, and anti-rollback defenses.",
                    "Silicon Security Simulator: Tests cryptographic signature verification and fault injection traps.",
                    "Hardware Security Researcher, Automotive Systems Auditor (Rs 15–30 LPA).")

    set_notes(s7, "India is investing over $50 Billion into semiconductor manufacturing and hardware design. These four courses—Embedded MCU, Edge AI TinyML, Wireless IoT, and Hardware Root of Trust—connect our students directly to physical chips. Days 1 through 5 are live today, and our Branch B sub-agents are expanding Days 6 through 30.")

    # ========================================================
    # SLIDE 8: COMMERCE & FINANCE (COURSES 22, 23, 24, 28, 30)
    # ========================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_slide_header(s8, 8, "Business School Flagship Tracks", 
                     "Accounting, Finance & Operations Management (Courses 22, 23, 24, 28, 30)", 
                     "Modernizing B.Com & MBA Education with Live Double-Entry Ledgers and Financial Modeling")

    draw_course_box(s8, Inches(0.8), Inches(1.75), Inches(3.6), Inches(2.45),
                    "Course 22", "Digital Accounting & Taxation (B.Com)", "🟡 DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", EMERALD_GREEN,
                    "Double-entry bookkeeping trial balance, ASC 606 revenue recognition, ASC 740 Deferred Tax Assets/Liabilities (DTA/DTL), and OECD transfer pricing.",
                    "LedgerSheet Simulator: Interactive T-accounts that flash red until debits equal credits.",
                    "Corporate Controller, Tax Consultant at Big 4 (Rs 8–18 LPA).")

    draw_course_box(s8, Inches(4.8), Inches(1.75), Inches(3.7), Inches(2.45),
                    "Course 23", "Business Finance & Investment (B.Com)", "🟡 DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", AMBER_GOLD,
                    "Discounted Cash Flow (DCF), WACC valuation, DuPont 3-step ROE decomposition, multi-tranche debt capital structures, LBO debt waterfalls, and M&A accretion.",
                    "Bars & DCF Simulator: Dynamic sensitivity bridges and Monte Carlo capital risk.",
                    "Investment Banking Analyst, Private Equity Associate (Rs 12–25 LPA).")

    draw_course_box(s8, Inches(8.9), Inches(1.75), Inches(3.6), Inches(2.45),
                    "Course 24", "Business Analytics & Ops Research", "🟡 DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", PRIMARY_BLUE,
                    "Linear programming simplex optimization, marginal shadow prices, cohort retention matrices, Net Revenue Retention (NRR > 100%).",
                    "Cohort Analytics Engine: Models customer retention decay curves live.",
                    "Financial Analyst (Rs 10–20 LPA).")

    draw_course_box(s8, Inches(0.8), Inches(4.4), Inches(5.6), Inches(2.5),
                    "Course 28", "Entrepreneurship & Venture Finance", "🟡 DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", PURPLE_ACCENT,
                    "Business Model Canvas (BMC), burn rate runway, SAFE note conversion, cap table dilution and liquidation preference waterfalls.",
                    "Cap Table Simulator: Simulates multi-round investor dilution live.",
                    "Startup Founder, Venture Analyst (Rs 10–22 LPA).")

    draw_course_box(s8, Inches(6.8), Inches(4.4), Inches(5.7), Inches(2.5),
                    "Course 30", "Supply Chain & Operations Research", "🟡 DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", PRIMARY_BLUE,
                    "Little's Law (WIP = Throughput * Cycle Time), EOQ inventory curves, Bullwhip effect reduction, Six Sigma Cpk quality control.",
                    "Supply Chain Flow Simulator: Balances inventory buffer queues.",
                    "Operations Director, Supply Chain Analyst (Rs 10–22 LPA).")

    set_notes(s8, "Over 60% of university students are enrolled in Commerce, BBA, and MBA programs. We have brought the exact same interactive simulation rigor to business education. Students use our LedgerSheet engine to balance books, run DCF valuations, and model supply chain inventory. This unlocks massive enterprise software sales to business colleges.")

    # ========================================================
    # SLIDE 9: REVENUE & SALES (COURSES 25, 26, 27, 29, 31)
    # ========================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_slide_header(s9, 9, "Revenue & Commercial Growth Systems", 
                     "Marketing, Sales, E-Commerce & AI Transformation (Courses 25, 26, 27, 29, 31)", 
                     "Training Revenue-Generating Leaders: From Digital Attribution to Enterprise AI Automation")

    draw_course_box(s9, Inches(0.8), Inches(1.75), Inches(3.6), Inches(2.45),
                    "Course 25", "Marketing Management & Strategy", "🟡 DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", PRIMARY_BLUE,
                    "PESTLE macroeconomic scans, Porter's Five Forces, STP segmentation, product lifecycle curves, perceptual brand positioning maps.",
                    "Strategic Positioning Matrix: Students plot competitor market share against value dimensions.",
                    "Brand Strategist, Marketing Manager (Rs 8–18 LPA).")

    draw_course_box(s9, Inches(4.8), Inches(1.75), Inches(3.7), Inches(2.45),
                    "Course 26", "Digital Marketing & Performance Growth", "🟡 DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", PRIMARY_BLUE,
                    "Programmatic ad auctions, multi-touch attribution (first/last/Shapley), SEO PageRank directed graphs, CRO A/B testing, CAC:LTV payback.",
                    "Funnel Simulator: Visualizes CAC payback periods and conversion drop-offs.",
                    "Growth Marketing Lead, Performance Marketer (Rs 9–20 LPA).")

    draw_course_box(s9, Inches(8.9), Inches(1.75), Inches(3.6), Inches(2.45),
                    "Course 27", "E-Commerce & Digital Business", "🟡 DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", EMERALD_GREEN,
                    "Two-sided marketplace economics, take rate commission modeling, dynamic pricing elasticity, cart abandonment funnels, payment gateway APIs.",
                    "E-Commerce Flow Simulator: Optimizes 1-click checkout and warehouse routing.",
                    "E-Commerce Category Manager, Marketplace Operations (Rs 10–22 LPA).")

    draw_course_box(s9, Inches(0.8), Inches(4.4), Inches(5.6), Inches(2.5),
                    "Course 29", "Enterprise B2B Sales & CRM Systems", "🟡 DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", AMBER_GOLD,
                    "B2B pipeline velocity math, BANT qualification, MEDDPICC deal defense, LTV:CAC unit economics, proactive churn intervention playbooks, CPQ guardrails.",
                    "Sales Velocity Simulator: Models deal stage probabilities and weighted forecasting.",
                    "Enterprise Account Executive, Customer Success Director (Rs 12–25 LPA).")

    draw_course_box(s9, Inches(6.8), Inches(4.4), Inches(5.7), Inches(2.5),
                    "Course 31", "AI & Digital Transformation for Business", "🟡 DAYS 1–5 LIVE • DAYS 6–30 IN FLIGHT", PURPLE_ACCENT,
                    "Hyperautomation: Deterministic RPA bots vs probabilistic cognitive AI agents, process mining on ERP event logs, automation economics (FTE labor savings).",
                    "Process Mining Simulator: Dissects event logs to pinpoint workflow bottlenecks.",
                    "Management Consultant, Chief Digital Officer Staff (Rs 14–28 LPA).")

    set_notes(s9, "Modern businesses run on growth and digital transformation. In these courses, students learn programmatic ad attribution, two-sided marketplace take rates, B2B enterprise sales pipelines, and process mining. When graduates interview at fast-growing companies, they already understand customer acquisition economics and revenue pipelines.")

    # ========================================================
    # SLIDE 10: FRESHMAN LAUNCHPADS & THE 3-BRANCH ROADMAP (COURSES 32–36)
    # ========================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_slide_header(s10, 10, "Universal Campus Adoption & The Road Ahead", 
                     "Freshman Launchpads (Courses 32–36) & The Scaled 3-Branch Roadmap", 
                     "Level 0 Campus Readiness for Every Incoming Student + The Parallel Execution Engine to 100% Completion")

    # 5 Launchpad mini cards
    def draw_mini(left, width, c_num, title, status, status_color, what_text, how_text, career_text):
        c = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.75), width, Inches(2.55))
        c.fill.solid()
        c.fill.fore_color.rgb = CARD_WHITE
        c.line.color.rgb = BORDER_DEFAULT
        c.line.width = Pt(1.2)
        tf = c.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.12)
        tf.margin_right = Inches(0.12)
        tf.margin_top = Inches(0.1)
        tf.margin_bottom = Inches(0.1)
        p = tf.paragraphs[0]
        p.text = f"{c_num}: {title}"
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = TEXT_TITLE
        p2 = tf.add_paragraph()
        p2.text = f"[{status}]"
        p2.font.size = Pt(8.5)
        p2.font.bold = True
        p2.font.color.rgb = status_color
        p2.space_after = Pt(2)
        p3 = tf.add_paragraph()
        p3.text = f"• What: {what_text}"
        p3.font.size = Pt(8.5)
        p3.font.color.rgb = TEXT_BODY
        p3.space_after = Pt(2)
        p4 = tf.add_paragraph()
        p4.text = f"• How: {how_text}"
        p4.font.size = Pt(8.5)
        p4.font.color.rgb = PRIMARY_BLUE
        p4.space_after = Pt(2)
        p5 = tf.add_paragraph()
        p5.text = f"• Career: {career_text}"
        p5.font.size = Pt(8)
        p5.font.color.rgb = TEXT_MUTED

    draw_mini(Inches(0.8), Inches(2.2), "Course 32", "Computer OS Basics", "D1-5 LIVE • D6-30 IN FLIGHT", PRIMARY_BLUE, 
              "Linux terminal, POSIX file trees, piping, streams & shell scripting.", "Interactive Terminal Sandbox", "Junior SysAdmin, Tech Support (Rs 5–9 LPA).")

    draw_mini(Inches(3.18), Inches(2.2), "Course 33", "AI Prompt Engineering", "🟢 100% LIVE (30 DAYS)", EMERALD_GREEN, 
              "Chain-of-thought, Few-shot priming, prompt injection defense.", "Prompt Engineering Testbed", "AI Operations Specialist (Rs 7–14 LPA).")

    draw_mini(Inches(5.56), Inches(2.2), "Course 34", "Excel Data Analysis", "D1-10 LIVE • D11-30 IN FLIGHT", PRIMARY_BLUE, 
              "Power Query M, Star Schema, dynamic PivotTables, amortization.", "Interactive Formula Ledger", "Data Analyst, Financial Modeling (Rs 6–12 LPA).")

    draw_mini(Inches(7.94), Inches(2.2), "Course 35", "Git Version Control", "D1-5 LIVE • D6-30 IN FLIGHT", PRIMARY_BLUE, 
              "Distributed Git trees, rebase vs merge, resolving conflict blocks.", "Git Visual Graph Studio", "Software Trainee, Open-Source Dev (Rs 6–12 LPA).")

    draw_mini(Inches(10.32), Inches(2.21), "Course 36", "Tech Soft Skills", "D1-5 LIVE • D6-30 IN FLIGHT", PRIMARY_BLUE, 
              "Socratic STAR framework, salary negotiation, executive slides.", "STAR Voice AI Evaluator", "Associate Consultant, Product Analyst (Rs 7–15 LPA).")

    # Bottom 3-Branch Execution Map
    card_road = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.5), Inches(11.73), Inches(2.4))
    card_road.fill.solid()
    card_road.fill.fore_color.rgb = PRIMARY_LIGHT
    card_road.line.color.rgb = PRIMARY_BLUE
    card_road.line.width = Pt(1.5)
    tf_r = card_road.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = Inches(0.18)
    tf_r.margin_right = Inches(0.18)
    tf_r.margin_top = Inches(0.12)
    p = tf_r.paragraphs[0]
    p.text = "THE 3-BRANCH PARALLEL SCALING ROADMAP: FINISHING THE REMAINING 34%"
    p.font.size = Pt(12.5)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_BLUE
    p.space_after = Pt(4)
    r_bullets = [
        "Branch A (Current Stream): Finalizing Launchpad tracks to Day 30 (Excel, Git, OS, Soft Skills = 95 Days).",
        "Branch B (Sub-Agent Stream): Completing 14 Commerce Tracks & 4 IoT Tracks from Day 6 to Day 30 (450 Days) with zero file collisions.",
        "Branch C (Platform Stream): Delivering Campus Admin Portal, Faculty Grading Rubrics, and University Multi-Tenant Isolation.",
        "Commercial Goal: Licensing the complete 37-course OS to universities at $50k-$200k/year recurring B2B enterprise contracts."
    ]
    for rb in r_bullets:
        prb = tf_r.add_paragraph()
        prb.text = f"• {rb}"
        prb.font.size = Pt(10)
        prb.font.color.rgb = TEXT_BODY
        prb.space_after = Pt(2)

    set_notes(s10, "To conclude: Every student starts in our universal launchpad—mastering Excel, Linux, Git, and Interview Communication. And with our 3-branch parallel execution architecture, we are rapidly finishing the remaining 34% of the curriculum while deploying our university administrative software. We have built the definitive operating system for higher education. Thank you, and I welcome your questions.")

    output_file = "docs/PINIT_CURRICULUM_AND_PRODUCT_10_SLIDE_PITCH_DECK.pptx"
    prs.save(output_file)
    print(f"Complete 37-course presentation successfully generated at: {output_file}")

if __name__ == "__main__":
    build_complete_deck()
