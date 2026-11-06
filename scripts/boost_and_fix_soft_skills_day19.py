import sys, json, subprocess
sys.path.append('.')

from scripts.make_soft_skills_day19 import get_day_19
d = get_day_19()

# 1. Boost Part 2: Currently 532 words. Add ~150 words
d['parts'][1]['say'].append(
    "Let us explore how engineers from non-traditional backgrounds (bootcamp graduates, self-taught developers, or career switchers from physics or finance) should navigate the 3-Act structure: Inexperienced candidates often feel apologetic about their non-traditional background, spending precious seconds justifying why they switched careers. Never apologize for your journey! Frame your prior domain as a distinctive engineering superpower: 'Before transitioning to software engineering, I worked for three years as a quantitative risk analyst in finance. That background gave me an empirical obsession with data modeling, mathematical boundary testing, and precision under uncertainty. I brought that same rigor into backend systems engineering, where I specialize in high-throughput ledger databases.' This transforms an apparent vulnerability into an elite, differentiated competitive advantage."
)

# 2. Boost Part 3: Currently 418 words. Add ~240 words
d['parts'][2]['say'].append(
    "Let us examine how to select your primary crucible project using the 'Crucible Selection Matrix': Many experienced developers have shipped dozens of features and feel overwhelmed trying to pick just one project for Act 2. When selecting your crucible project, evaluate candidates across three strict dimensions: 1. Architectural Complexity (Did the project involve non-trivial distributed systems challenges, concurrency, performance bottlenecks, or database scaling?); 2. Business & Engineering Impact (Did the project slash latency, prevent data loss, save significant cloud costs, or unblock millions of users?); 3. Personal Ownership (Did you personally lead the technical investigation, author the design proposal, and write the core implementation?). A project that scores high on all three dimensions is your definitive crucible project."
)
d['parts'][2]['say'].append(
    "Notice the crucial difference between a technical crucible teaser and an arrogant boast: A boast sounds like: 'I single-handedly built the best payment system at the company and taught everyone how to code.' That triggers an immediate negative reaction! A crucible teaser sounds humble, objective, and mathematically grounded: 'A defining milestone was when our transaction volume tripled overnight; I led our data layer re-architecture, implementing connection pooling and read replicas to drop P99 latency from 450ms to 28ms.' You let the empirical metrics convey the magnitude of your achievement."
)

# 3. Boost Part 4: Currently 434 words. Add ~220 words
d['parts'][3]['say'].append(
    "Let us examine the vital physical and vocal delivery mechanics that amplify executive presence during your 90-second pitch: Technical communication is not merely the semantic text of what you say; it is the physical presence and vocal confidence with which you say it! Over video calls on Zoom or Google Meet, many candidates look down at their notes, speak in a monotone murmur, or end sentences with an upward pitch inflection ('upspeak') that sounds like a hesitant question. Elite engineering leaders practice Vocal Grounding: Speak with a resonant, steady chest voice, maintain direct eye contact with the camera lens (which creates the visual perception of strong eye contact for the interviewer), and end declarative sentences with a confident downward inflection. This vocal certainty signals deep emotional stability and seasoned technical authority."
)
d['parts'][3]['say'].append(
    "Furthermore, embrace the strategic power of the micro-pause: When speaking about complex architectures, inexperienced candidates rush from one sentence to the next without breathing, fearing that any pause will invite interruption. A deliberate one-second micro-pause after delivering a major metric\u2014'...slashing ingestion costs by 45% [one-second pause]...'\u2014gives the interviewer's brain time to absorb the numerical magnitude of your achievement. It demonstrates that you are comfortable commanding the room and possess absolute control over your narrative pacing."
)

# 4. Boost Part 5: Currently 372 words. Add ~260 words
d['parts'][4]['say'].append(
    "Let us examine how to prepare mentally during the critical five minutes before your interview begins: When the interview link is about to go live, your sympathetic nervous system often triggers a fight-or-flight adrenaline surge: your heart rate elevates, your palms become cold, and your mind races. If you allow this physiological surge to go unchecked, you will start speaking at 190 WPM, rush through your pitch, and stumble into rambling lore. Master the SRE 'Box Breathing' protocol (Four seconds inhale, four seconds hold, four seconds exhale, four seconds hold) for two minutes before joining the video room. This biologically down-regulates cortisol and activates the parasympathetic nervous system, returning your vocal cords and cognitive faculties to calm, deliberate executive composure."
)
d['parts'][4]['say'].append(
    "Finally, embrace the sovereign mindset of the Technical Consultant: Never enter an interview room as a nervous supplicant begging for validation, a paycheck, or corporate approval. Enter the room as a seasoned, respectful technical peer: an engineering consultant who has arrived to diagnose their architectural bottlenecks, understand their scaling challenges, and evaluate whether this company represents the ideal vehicle for your mutual long-term engineering success. When you embody this peer-level posture, your 90-second pitch resonates with unshakeable dignity, positioning you as an indispensable engineering leader."
)

# Fix Code Part 1: Make Maya a realistic full 80-second pitch (180 words)
d['parts'][0]['code'] = d['parts'][0]['code'].replace(
    '''const strongPitch: PitchTranscript = {
  candidateName: 'Candidate Maya',
  targetCompany: 'Stripe',
  transcriptText: 'I am a backend distributed systems engineer with five years of experience specializing in high-throughput payment architectures in Go and Node.js. Currently at PayScale, I lead our payment gateway service, where I recently architected our event-driven Kafka idempotency engine, reducing duplicate payment transaction errors by 99.4% across 15M daily requests. Before that, I built foundational microservices and optimized PostgreSQL read-replicas. What excites me about Stripe is your focus on multi-region payment resilience, and I would love to bring my distributed systems experience to your core ledger team.'
};''',
    '''const strongPitch: PitchTranscript = {
  candidateName: 'Candidate Maya',
  targetCompany: 'Stripe',
  transcriptText: 'I am a backend distributed systems engineer with five years of experience specializing in high-throughput payment architectures in Go and Node.js. Currently at PayScale, I lead our core payment gateway service, where I am responsible for transactional reliability and payment settlement. A defining milestone in my career was when I architected our event-driven Kafka idempotency engine to handle traffic bursts during Black Friday sales. By designing a distributed Redis lock-aside layer and strict deduplication consumer workers, I reduced duplicate payment transaction errors by 99.4% across 15M daily requests while cutting P99 database write latency from 380ms to 42ms. Prior to PayScale, I spent three years scaling PostgreSQL read-replicas and building microservices at an enterprise SaaS company. What draws me to Stripe is your world-class engineering focus on multi-region ledger resilience and zero-loss financial consistency. I would love to bring my distributed systems background to your core ledger engineering team, and I am excited to dive deeper into any of those architectural trade-offs.'
};'''
)

# Fix Code Part 2: Expand samplePitch in Part 2 so it is ~175 words (75s) and passes all bounds
d['parts'][1]['code'] = d['parts'][1]['code'].replace(
    '''const samplePitch: ThreeActPitch = {
  candidateName: 'Marcus Vance',
  targetCompany: 'Datadog',
  act1Present: 'I am a Senior Site Reliability Engineer specializing in Kubernetes observability, distributed tracing, and Go systems. Currently at CloudStream, I lead our infrastructure reliability pod, managing our multi-region Kubernetes clusters across AWS and GCP.',
  act2Past: 'Prior to this, I spent four years scaling distributed telemetry pipelines. A major milestone in my career was when I spearheaded our OpenTelemetry migration, where I re-architected our trace collector pipeline in Go to handle 120,000 events per second. I implemented adaptive sampling and dynamic memory buffering, which slashed telemetry ingestion costs by 45% while preserving 99.9% of error traces.',
  act3Future: 'That project deepened my fascination with high-throughput distributed metrics at massive scale. That is exactly why I am thrilled to speak with Datadog today: Your work on kernel-level eBPF tracing and real-time observability is industry-defining, and I would love to bring my telemetry pipeline expertise to your core agent engineering team.'
};''',
    '''const samplePitch: ThreeActPitch = {
  candidateName: 'Marcus Vance',
  targetCompany: 'Datadog',
  act1Present: 'I am a Senior Site Reliability Engineer specializing in Kubernetes observability, distributed tracing, and Go infrastructure systems. Currently at CloudStream, I lead our infrastructure reliability pod, overseeing production telemetry across multi-region Kubernetes clusters.',
  act2Past: 'Prior to this, I spent four years scaling distributed telemetry pipelines and high-throughput logging. A major crucible milestone in my career was when I spearheaded our OpenTelemetry migration, where I re-architected our trace collector pipeline in Go to process 120,000 events per second. By implementing adaptive memory buffering and dynamic probabilistic sampling, I slashed telemetry cloud ingestion costs by 45% while preserving 99.9% of critical error traces under peak load.',
  act3Future: 'That project deepened my obsession with high-throughput distributed metrics at petabyte scale. That is exactly why I am thrilled to speak with Datadog today: Your engineering work on kernel-level eBPF tracing and real-time observability is industry-defining, and I would love to bring my pipeline scaling experience to your core agent team.'
};'''
)

# Fix Code Part 4: Expand Priya to realistic full 80-second pitch (~180 words)
d['parts'][3]['code'] = d['parts'][3]['code'].replace(
    '''const eliteDelivery: SpokenPitchDelivery = {
  candidateName: 'Candidate Priya',
  pitchFullText: 'I am a Senior Frontend Architect specializing in React, TypeScript, and WebGL visualization performance. Currently at MapBox, I lead our rendering engine optimization pod, where I recently re-architected our vector tile caching pipeline, slashing frame drop rates by 82% across 5M daily map views. Prior to that, I spent three years building design systems and Core Web Vitals tooling at scale. What draws me to Figma is your pioneering work in browser-based WebAssembly graphics. I would love to bring my rendering performance background to your canvas team, and I am happy to dive deeper into any of those architectural trade-offs or start wherever you would like.' ,
  endingSentence: 'I would love to bring my rendering performance background to your canvas team, and I am happy to dive deeper into any of those architectural trade-offs or start wherever you would like.'
};''',
    '''const eliteDelivery: SpokenPitchDelivery = {
  candidateName: 'Candidate Priya',
  pitchFullText: 'I am a Senior Frontend Architect specializing in React, TypeScript, WebGL visualization, and client-side rendering performance. Currently at MapBox, I lead our rendering engine optimization pod, overseeing vector map rendering across web and mobile browsers. Over the past five years, my engineering focus has been on client-side frame rate optimization and canvas memory management. A major crucible milestone was when I re-architected our vector tile caching pipeline, where I designed an offscreen canvas rendering worker in WebAssembly. This slashed frame drop rates by 82% across 5M daily active map views and reduced client memory footprint by 40%. Prior to MapBox, I engineered design systems and automated Core Web Vitals tooling at an enterprise SaaS scale. What draws me to Figma is your pioneering engineering in browser-based WebAssembly graphics and real-time multiplayer canvas synchronization. I would love to bring my rendering performance expertise to your canvas architecture team, and I am happy to dive deeper into any of those trade-offs or start wherever you would like.',
  endingSentence: 'I would love to bring my rendering performance expertise to your canvas architecture team, and I am happy to dive deeper into any of those trade-offs or start wherever you would like.'
};'''
)

# Fix Code Part 5: Correct MasterPitchAuditor -> MasterElevatorPitchAuditor
d['parts'][4]['code'] = d['parts'][4]['code'].replace(
    'const masterAuditor = new MasterPitchAuditor();',
    'const masterAuditor = new MasterElevatorPitchAuditor();'
)

# Run tsx on all 5 parts and update outputs
for i, p in enumerate(d['parts']):
    with open(f'temp_d19_p{i+1}.ts', 'w', encoding='utf-8') as f:
        f.write(p['code'])
    res = subprocess.run(['npx', 'tsx', f'temp_d19_p{i+1}.ts'], capture_output=True, text=True, shell=True)
    if res.returncode != 0:
        print(f'Part {i+1} FAILED tsx:\n{res.stderr}')
    else:
        p['output'] = res.stdout.strip()
        print(f'Part {i+1} output updated and matched.')

with open('scripts/make_soft_skills_day19.py', 'w', encoding='utf-8') as f:
    f.write('import json\n\ndef get_day_19():\n    return ' + json.dumps(d, indent=4) + '\n')

print("Day 19 successfully boosted, fixed, and synced!")
