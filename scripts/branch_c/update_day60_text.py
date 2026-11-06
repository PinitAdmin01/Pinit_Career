with open('scripts/branch_c/build_day60.py', 'r', encoding='utf-8') as f:
    text = f.read()

p4_old = '    "Continuous fleet-wide resilience modeling updates disaster recovery topologies and predictive capacity plans based on capstone evaluation data.'
p4_addition = '''    "Automated canary traffic shaping and progressive weight transitions maintain stable tail latencies throughout large-scale cluster healing. When replacing degraded microservice pods across planetary availability zones, the autonomous Envoy control plane modulates ingress weights in increments of five percent every ten seconds. By coupling incremental weight shifts with continuous distributed tracing analysis, the SRE platform guarantees that fresh pods receive traffic strictly at a rate commensurate with cache rewarming and JIT optimization, preventing latency spikes from impacting user requests.",\n'''

text = text.replace(p4_old, p4_addition + p4_old)

p5_old = '    "The verified completion of all sixty days establishes an unbroken foundation of practical expertise'
p5_addition = '''    "Lifelong learning architectures and autonomous self-updating capability loops ensure that your engineering expertise remains perpetually at the technological cutting edge. As foundation models evolve and new agentic reasoning paradigms emerge, the architectural foundations, deterministic verification gates, and multi-agent protocols established throughout this course provide a timeless conceptual framework. You are equipped not only to adopt future AI breakthroughs but to actively pioneer the next generation of safe, resilient, and transformative autonomous computational systems.",\n'''

text = text.replace(p5_old, p5_addition + p5_old)

with open('scripts/branch_c/build_day60.py', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated Day 60 text with extra paragraphs!")
