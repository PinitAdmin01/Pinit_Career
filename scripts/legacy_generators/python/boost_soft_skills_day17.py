import sys, json
sys.path.append('.')

from scripts.make_soft_skills_day17 import get_day_17
d = get_day_17()

# Part 1: Currently 550 words. Add ~200 words
d['parts'][0]['say'].append(
    "Let us explore how LinkedIn's recent AI-assisted and semantic search capabilities impact candidate discovery: Enterprise recruiters are no longer restricted to rigid Boolean strings; modern LinkedIn Recruiter utilizes large language models that perform semantic expansion. When a recruiter types 'distributed systems engineer with high-throughput event streaming experience', the search engine automatically infers related concepts such as Kafka, Apache Flink, RabbitMQ, partition rebalancing, and consumer lag. However, algorithmic semantic expansion still prioritizes exact keyword density in primary anchor fields. If your headline and current role description explicitly state 'Event-Driven Architectures | Kafka, Go, Kubernetes', your profile receives a direct mathematical match bonus that vaults you above thousands of candidates whose profiles only imply these skills in generic prose."
)
d['parts'][0]['say'].append(
    "Furthermore, consider the critical role of geographic location and remote availability filters: Many engineers leave their profile location set to a small suburb or fail to configure remote preferences, inadvertently disqualifying themselves from global candidate pools. When corporate tech recruiters source talent for high-paying roles, their first filter is almost always a geographic radius (such as 'San Francisco Bay Area', 'New York City', 'London', or 'Remote - United States'). By setting your location to the nearest primary tech hub or explicitly tagging your profile as open to remote engineering roles in your target market, you instantly expand your inbound search visibility by over 400% without altering a single line of code."
)

# Part 2: Currently 400 words. Add ~320 words
d['parts'][1]['say'].append(
    "Let us examine how to adapt the 3-part headline formula across different engineering specializations: If you are a Frontend Engineer, your headline should not read 'Frontend Developer | React, CSS'. That communicates junior-level commodity execution. Instead, elevate your signal: `Senior Frontend Architect | React, TypeScript, Next.js, WebGL | Optimized Core Web Vitals to 99 Performance Score across 4M Users`. Notice how this immediately anchors you in performance engineering, architectural depth, and real-world user scale. If you are a Data Engineer, contrast 'Data Engineer | Python, SQL' with `Senior Data Platform Engineer | Python, Spark, Snowflake, Airflow | Orchestrated 50TB Daily ETL Pipelines with 99.99% Data SLA`. The second headline commands respect from engineering directors because it speaks the language of production reliability."
)
d['parts'][1]['say'].append(
    "Notice the psychological effect of eliminating passive aspiration phrases: Millions of profiles feature headlines starting with 'Aspiring Software Engineer', 'Passionate Coder Seeking Entry-Level Role', or 'Recent CS Graduate Eager to Learn'. While well-intentioned, these phrases trigger an immediate negative bias in recruiter search interfaces. Recruiters do not search for 'Aspiring Developer'; they search for 'Software Engineer'. You do not need to wait for a corporate employer to grant you the title. If you write, test, and deploy software, your title is Software Engineer. Present yourself with professional dignity: `Full-Stack Software Engineer | TypeScript, React, Node.js, PostgreSQL | Built & Deployed 3 Production SaaS Applications`. Claim your technical identity with pride and precision."
)

# Part 3: Currently 356 words. Add ~360 words
d['parts'][2]['say'].append(
    "Let us examine why writing your About section in the first person ('I') is vastly superior to writing in the third person ('Alex is an experienced developer...'): When an individual software engineer writes their LinkedIn summary in the third person, it creates an awkward, artificial distance, as if they hired an imaginary PR agency to compose a corporate biography. Engineering hiring managers want authentic connection and transparent technical communication. Writing in a clean, professional first person ('I build distributed backend systems that prioritize fault tolerance and low latency') demonstrates confident self-awareness, authentic passion, and direct accountability."
)
d['parts'][2]['say'].append(
    "Let us analyze the structure of the Technical Stack Taxonomy within your About section: After narrating your engineering philosophy and core triumphs, you must provide a clean, scannable index of your technical capabilities. Format this as four clean bullet points with bulleted tags: 1. Languages (e.g. TypeScript, Python, Go, Java, SQL); 2. Frontend & Runtimes (e.g. React, Next.js, Node.js, Tailwind CSS); 3. Backend & Data Infrastructure (e.g. Express, PostgreSQL, Redis, Apache Kafka, DynamoDB); 4. DevOps, Cloud & Tooling (e.g. AWS, Docker, Kubernetes, Terraform, Git, CI/CD). Recruiters and engineering managers are busy humans; when they open your profile, this formatted taxonomy allows them to verify your full tech stack compatibility in under three seconds."
)
d['parts'][2]['say'].append(
    "Finally, conclude your About section with a clear, welcoming Call to Action: Many profiles end abruptly, leaving interested recruiters wondering how to reach out if they lack LinkedIn InMail credits. Conclude with a warm, high-signal closing: 'I am always excited to discuss distributed systems architecture, database optimization, and high-growth engineering teams. Feel free to connect or email me directly at alex.rivera.dev@example.com.' This simple addition removes communication friction and converts passive profile visits into active interview conversations."
)

# Part 4: Currently 342 words. Add ~360 words
d['parts'][3]['say'].append(
    "Let us examine how to engineer a GitHub repository to serve as an undeniable proof-of-work asset: Many developers link their GitHub profile, but when an engineering manager clicks the link, they find forty abandoned school homework assignments, half-finished tutorial clones, and repositories named 'test-repo-1' with empty README files. This actively damages your technical credibility! A senior technical candidate maintains three to four pinned repositories that look like enterprise open-source software: Each repository features an immaculate `README.md` containing: 1. A clear high-level system architecture diagram (created with Mermaid or clean SVG); 2. A crisp technical overview explaining the engineering trade-offs and performance goals; 3. A 10-second animated GIF or terminal recording showing the live application in action; 4. Comprehensive automated test suites with verifiable coverage badges; 5. One-command local setup instructions via Docker Compose. When an engineering manager inspects a repository like that, the technical screen is effectively won before the first interview question is even asked."
)
d['parts'][3]['say'].append(
    "Additionally, consider the compound career power of publishing technical deep-dive articles: You do not need to write a viral blog every week. Publishing just one rigorous, 1,500-word engineering postmortem or architectural case study once a quarter establishes you as an elite thinker in your domain. Write about real engineering challenges you solved: 'How We Debugged a Node.js Memory Leak Under 10,000 Concurrent WebSockets', 'Why We Migrated from MongoDB to PostgreSQL for Financial Ledger Accuracy', or 'Optimizing P99 Latency by Eliminating N+1 ORM Queries'. Pin these articles to your Featured section. Recruiters share these links directly with their VP of Engineering, saying: 'Look at how this candidate writes and thinks about systems architecture.' You immediately bypass the automated resume screen."
)

# Part 5: Currently 251 words. Add ~460 words
d['parts'][4]['say'].append(
    "Let us examine the vital distinction between authentic engineering personal branding and superficial social media 'engagement farming': In recent years, professional platforms have been flooded with superficial influencers posting generic motivational platitudes, manufactured workplace drama, and self-congratulatory corporate parables. This behavior is widely derided by serious engineering leaders! As a software engineer, your personal brand must never be built on superficial hype; it must be grounded in empirical technical craftsmanship and generosity toward the developer community."
)
d['parts'][4]['say'].append(
    "Consider the types of content that actually earn respect from senior staff engineers and directors of engineering: 1. Production Postmortems: Sharing honest, blameless lessons learned from unexpected outages and how you implemented systemic guardrails; 2. Architectural Trade-off Analyses: Discussing why you chose a specific database or messaging queue over another and the empirical benchmarks that guided your decision; 3. Open Source Contributions: Documenting pull requests you submitted to upstream libraries, detailing how you reproduced a bug, wrote failing regression tests, and contributed the fix; 4. Curated Book & Paper Reviews: Summarizing key architectural insights from seminal papers like the Google MapReduce paper or Martin Kleppmann's 'Designing Data-Intensive Applications'. When you share high-signal content of this caliber, you build a durable reputation as a thoughtful, rigorous systems thinker."
)
d['parts'][4]['say'].append(
    "Reflect on the long-term career sovereignty that comes from establishing an inbound recruiting engine: Throughout most developers' careers, the job hunt is an exhausting, anxiety-inducing outbound slog: Submitting hundreds of cold applications into online portals, enduring weeks of radio silence, and competing with thousands of applicants in arbitrary ATS queues. But when you treat your LinkedIn profile and public portfolio as an engineered inbound funnel, the dynamic flips completely: High-growth tech companies and prestigious engineering managers come to you. They reach out with personalized notes, fast-track you past recruiter screens, and invite you directly to meet the technical team."
)
d['parts'][4]['say'].append(
    "You are now fully equipped with the sovereign mechanics of technical profile engineering. Your digital presence is an airtight beacon of technical credibility, ready to attract high-signal engineering opportunities and accelerate your professional trajectory."
)

with open('scripts/make_soft_skills_day17.py', 'w', encoding='utf-8') as f:
    f.write("import json\n\ndef get_day_17():\n    return " + json.dumps(d, indent=4) + "\n")

print("Day 17 successfully boosted!")
