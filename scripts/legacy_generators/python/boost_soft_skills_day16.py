import sys, json
sys.path.append('.')

from scripts.make_soft_skills_day16 import get_day_16
d = get_day_16()

# Fix regex escape warning in Part 4 code
d['parts'][3]['code'] = d['parts'][3]['code'].replace('ci\\/cd', 'ci/cd')

# Part 1 is 657 words: Add ~100 words
d['parts'][0]['say'].append(
    "Let us examine how to format the Technical Skills section for optimal ATS indexing and human readability: Many candidates make the catastrophic mistake of listing thirty technologies in a chaotic comma-separated wall of text, or worse, using visual percentage bars that claim '90% Python, 75% Docker'. Percentage bars provide zero technical signal to human interviewers and cannot be parsed by ATS scanners. Senior tech resume engineers group skills into four clear, logical tiers: 1. Languages (e.g. TypeScript, Go, Python, SQL); 2. Frameworks & Runtimes (e.g. Node.js, React, Next.js, Express); 3. Databases & Caching (e.g. PostgreSQL, Redis, DynamoDB, Kafka); 4. Cloud & DevOps (e.g. AWS, Docker, Kubernetes, Terraform, GitHub Actions). This clean modular organization allows recruiters to verify your stack alignment in less than two seconds."
)

# Part 2 is 501 words: Add ~250 words
d['parts'][1]['say'].append(
    "Let us explore how to handle projects where the exact metrics were not formally recorded by monitoring tools: In some companies, logging was minimal, or you left the company before the final quarterly business review. Inexperienced candidates assume that without official Datadog graphs, they cannot quantify their bullets. The senior engineer utilizes 'Order-of-Magnitude Bounds' and Engineering Approximation: You calculate conservative, defensible estimates based on known system parameters: 'Maintained 99.9% uptime across ~50,000 monthly active users' or 'Processed ~2.5 million daily database transactions with zero dropped records.' When asked about these numbers in an interview, you explain the architectural bounds: 'We had 50k MAU generating roughly 1.5 requests per session, giving us approximately 2.5M transactions daily.' Interviewers are deeply impressed by your ability to reason about systems scale using Fermi estimation."
)
d['parts'][1]['say'].append(
    "Furthermore, notice how the Google X-Y-Z formula acts as a powerful conversational anchor during the technical interview itself: When an interviewer reviews your resume, they do not ask generic theoretical questions; their eyes gravitate directly toward your bold X-Y-Z metrics! The interviewer will point to your bullet and ask: 'I see here you reduced P99 latency by 81% using multi-tier Redis caching—can you walk me through the cache invalidation strategy you designed?' By engineering high-signal X-Y-Z bullets, you effectively dictate the syllabus of your own technical interview, steering the conversation toward your greatest architectural triumphs."
)

# Part 3 is 386 words: Add ~350 words
d['parts'][2]['say'].append(
    "Let us examine the vital importance of grammatical tense consistency in engineering resumes: In many candidate resumes, bullet points oscillate chaotically between present tense ('Develops APIs'), past tense ('Developed APIs'), and gerunds ('Developing APIs'). This grammatical carelessness creates cognitive friction and signals poor attention to detail. The universal industry convention is strict and clean: All past roles MUST use past tense active verbs ('Architected', 'Engineered', 'Optimized'); your current role may use present tense ('Architect', 'Engineer', 'Optimize') or past tense for projects that have already launched."
)
d['parts'][2]['say'].append(
    "Additionally, consider the compound effect of eliminating filler adjectives and corporate buzzwords: In traditional non-technical resumes, candidates pad their bullets with empty fluff: 'Successfully leveraged cutting-edge synergistic paradigms to dynamically optimize user engagement.' In software engineering, this kind of corporate jargon is an immediate disqualifier! Engineering directors despise corporate fluff. Every word on your resume must represent hard technical nouns, precise architectural verbs, or verified numerical metrics. When you strip away filler adjectives, your engineering accomplishments shine with crystalline clarity."
)
d['parts'][2]['say'].append(
    "Notice how leading with active verbs transforms your professional self-image: When you spend hours replacing 'Responsible for' and 'Helped with' with 'Architected' and 'Spearheaded', you are not merely editing a resume; you are stepping into a higher level of professional authority. You recognize that you were not just a bystander; you were the engineer who solved the puzzle, wrote the code, and drove the system to success."
)

# Part 4 is 453 words: Add ~280 words
d['parts'][3]['say'].append(
    "Let us examine how junior developers and bootcamp graduates can quantify their personal and open-source projects: If you have never worked at a massive enterprise, you might wonder: 'How can I quantify a personal full-stack project or an open-source library?' You quantify the engineering rigor of your code: 1. Codebase Scale & Test Coverage: 'Engineered full-stack TypeScript application with 100% test coverage across 85 unit and integration tests using Vitest'; 2. Performance Benchmarking: 'Benchmarked database indexing strategies with k6, proving a 4x throughput increase (from 250 RPS to 1,000 RPS) under simulated concurrent load'; 3. CI/CD Automation: 'Configured automated GitHub Actions workflow executing linting, typechecking, and containerized Docker deployments in under 3 minutes.'"
)
d['parts'][3]['say'].append(
    "Notice that every single one of those bullets demonstrates authentic systems engineering! You did not wait for a corporate employer to grant you permission to care about latency, test coverage, and CI/CD pipelines. You engineered your personal projects with production-grade rigor. Hiring managers actively look for this kind of intrinsic craftsmanship, and high-scale metrics prove that you are ready to contribute to enterprise production code on day one."
)

# Part 5 is 262 words: Add ~460 words
d['parts'][4]['say'].append(
    "Let us examine the strategic economics of the single-page resume rule: Many engineers resist the single-page limit. They protest: 'I have worked on so many projects; I need two or three pages to show everything!' In modern technology recruiting, a two-page resume for an engineer with under eight years of experience is an immediate red flag. It demonstrates a lack of executive synthesis and an inability to prioritize high-signal information over low-signal noise."
)
d['parts'][4]['say'].append(
    "Remember: A resume is not an exhaustive autobiography of everything you have ever touched; a resume is a high-impact marketing teaser designed to do one thing: Earn a 30-minute phone screen with the hiring manager. If a detail does not directly contribute to proving that you can solve the company's technical challenges, it must be ruthlessly pruned. By condensing your career into one immaculate, beautifully spaced, single-column page, you show that you value the reader's time and possess the clarity of thought required of senior technical leaders."
)
d['parts'][4]['say'].append(
    "Consider the lifetime career return on mastering technical resume engineering: In software engineering, the difference between getting calls from mediocre low-paying consultancies versus getting screening calls from top-tier technology companies (where total compensation packages exceed $200k, $300k, or $500k) comes down to the signal density of this single document. By engineering your resume with Google X-Y-Z precision, eliminating passive phrasing, and quantifying scale across latency, throughput, and costs, you unlock the doors to the most exciting, lucrative, and impactful engineering opportunities in the world."
)
d['parts'][4]['say'].append(
    "Step forward into your interview journey with unshakeable confidence. Your technical dossier is now an empirical masterclass in software engineering excellence, ready to capture the attention of engineering directors and launch your career to unprecedented heights."
)

with open('scripts/make_soft_skills_day16.py', 'w', encoding='utf-8') as f:
    f.write("import json\n\ndef get_day_16():\n    return " + json.dumps(d, indent=4) + "\n")

print("Day 16 successfully boosted!")
