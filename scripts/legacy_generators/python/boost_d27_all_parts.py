import sys
sys.path.append('.')
import json

from scripts.make_soft_skills_day27 import get_day_27
d = get_day_27()

# Part 1 boost
d['parts'][0]['say'].extend([
    "Consider the organizational danger of cultural misunderstandings in performance evaluations. In low-context Western engineering hubs, an engineer who does not speak up loudly in meetings or aggressively promote their own ideas is often unfairly categorized as 'lacking leadership presence' or 'passive'. In high-context East Asian or South Asian cultures, however, speaking over senior leaders or publicly promoting oneself without being invited is considered disrespectful and boastful! An engineer might be an absolute technical genius who executes with flawless precision, but their cultural communication style is penalized by managers who do not understand cross-cultural diversity.",
    "True global engineering leaders actively dismantle these cultural biases. Instead of measuring leadership by who speaks the loudest on Zoom, they evaluate engineering leadership by tangible output: RFC depth, pull request craftsmanship, architectural clarity, and mentorship impact. They create multi-modal channels for feedback—allowing team members to contribute asynchronously in writing as well as verbally in meetings—ensuring that every cultural voice has an equal platform to shine."
])

# Part 2 boost
d['parts'][1]['say'].extend([
    "Let us explore how asynchronous documentation acts as the ultimate equalizer for non-native English speakers. When a technical discussion occurs live on a fast-paced English Zoom call, native speakers naturally dominate: They process verbal nuances faster, jump into conversational gaps effortlessly, and use colloquial jargon. Non-native English speakers often feel intimidated, needing a few extra seconds to translate their thoughts and formulate articulate technical arguments.",
    "When you shift the discussion to a structured written RFC or GitHub Discussion, the playing field is completely leveled! An engineer in Tokyo or Warsaw can read the proposal carefully, digest the architectural trade-offs, look up unfamiliar terms, run local benchmarks, and write a brilliant, highly structured counter-proposal that catches a critical race condition. By designing an asynchronous documentation culture, you unlock the full collective intelligence of your global team rather than merely listening to whoever speaks the fastest English."
])

# Part 3 boost
d['parts'][2]['say'].extend([
    "Notice how the Golden Handshake eliminates the toxic psychological guilt of distributed engineering. In poorly managed remote teams, engineers in secondary hubs feel an unwritten obligation to be 'always on'. They keep their work laptops open on their nightstands, answering Slack pings at 1:00 AM because they fear that if they do not reply immediately, their colleagues in headquarters will view them as unresponsive or uncommitted.",
    "When leadership formally codifies Time-Zone Sovereignty and the Golden Handshake, that anxiety vanishes! The policy is clear: Once the 30-minute handshake window closes, your workday is finished. You close your laptop, enjoy your evening, and sleep peacefully with zero guilt, knowing that your teammates across the world have full ownership of the in-flight tasks. This clear boundary is what makes global distributed teams sustainable across years rather than burning out within months."
])

# Part 4 boost
d['parts'][3]['say'].extend([
    "Let us analyze the tactical nuance of humor and sarcasm in international engineering channels. In North America and the UK, engineers frequently use dry sarcasm, irony, or playful self-deprecation in Slack or code review comments: 'Oh great, another microservice to debug, just what my Friday needed! 😉'. While local peers recognize this as friendly banter, international teammates often take the statement literally, wondering if a genuine catastrophe has occurred or if the engineer is expressing deep hostility.",
    "Global engineering leaders adhere to the Plain Technical Text Rule: Avoid sarcasm, irony, and culturally specific humor in written engineering documentation and code reviews. Text lacks vocal inflections, facial expressions, and body language. What feels like innocent sarcasm to you can easily be read as passive-aggressive hostility by a peer on another continent. Express warmth through genuine gratitude, clear recognition, and supportive emojis rather than ambiguous irony."
])

# Part 5 boost
d['parts'][4]['say'].extend([
    "Reflect on the profound, transformative power of global engineering collaboration: When you bring together engineers educated in different parts of the world—combining the mathematical rigor of Eastern Europe, the systems precision of Germany and Japan, the rapid entrepreneurial iteration of the United States, and the massive-scale architectural ingenuity of India and Latin America—you create something vastly greater than the sum of its parts.",
    "You build resilient, world-class software that reflects the diversity and needs of humanity itself. As you step into your role as a global engineering leader, remember that your greatest superpower is not your mastery of syntax, but your capacity to build bridges of trust, clarity, and empathy across every boundary. Lead your global team with patience, documentation excellence, and unwavering cultural respect."
])

w = [len(' '.join(p['say']).split()) for p in d['parts']]
print('Boosted Day 27 Words:', sum(w), 'Parts:', w)

with open('scripts/make_soft_skills_day27.py', 'w', encoding='utf-8') as f:
    f.write(f'import json\n\ndef get_day_27():\n    return {json.dumps(d, indent=4)}\n')

print('Day 27 updated successfully!')
