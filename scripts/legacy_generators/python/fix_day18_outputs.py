import json, subprocess
from scripts.make_soft_skills_day18 import get_day_18

d = get_day_18()

# Fix Part 1 output
with open('temp_d18_p1.ts', 'w', encoding='utf-8') as f:
    f.write(d['parts'][0]['code'])
res1 = subprocess.run(['npx', 'tsx', 'temp_d18_p1.ts'], capture_output=True, text=True, shell=True)
d['parts'][0]['output'] = res1.stdout.strip()
print('Part 1 output updated.')

# Fix Part 3 code
p3_code = d['parts'][2]['code']
p3_code = p3_code.replace(
'''interface TimedStarResponse {
  situationText: string;
  taskText: string;
  actionText: string;
  resultText: string;
}''',
'''interface TimedStarResponse {
  situation: string;
  task: string;
  action: string;
  result: string;
}'''
)
p3_code = p3_code.replace(
'''    const sWords = countWords(response.situationText);
    const tWords = countWords(response.taskText);
    const aWords = countWords(response.actionText);
    const rWords = countWords(response.resultText);''',
'''    const sWords = countWords(response.situation);
    const tWords = countWords(response.task);
    const aWords = countWords(response.action);
    const rWords = countWords(response.result);'''
)
p3_code = p3_code.replace("situationText:", "situation:")
d['parts'][2]['code'] = p3_code

with open('temp_d18_p3.ts', 'w', encoding='utf-8') as f:
    f.write(p3_code)
res3 = subprocess.run(['npx', 'tsx', 'temp_d18_p3.ts'], capture_output=True, text=True, shell=True)
d['parts'][2]['output'] = res3.stdout.strip()
print('Part 3 output updated.')

# Fix Part 4 output
with open('temp_d18_p4.ts', 'w', encoding='utf-8') as f:
    f.write(d['parts'][3]['code'])
res4 = subprocess.run(['npx', 'tsx', 'temp_d18_p4.ts'], capture_output=True, text=True, shell=True)
d['parts'][3]['output'] = res4.stdout.strip()
print('Part 4 output updated.')

# Fix Part 5: Expand candidateStory action slightly so action is >= 50%
p5_code = d['parts'][4]['code']
old_action = "I investigated partition consumer distribution and identified that a newly deployed payment validation step was performing synchronous DNS lookups inside the message loop. I immediately initiated an emergency configuration override to enable local DNS caching. Next, I engineered a temporary repartitioning script to dynamically scale consumer instances from 12 to 36 workers across three Kubernetes pods. I monitored consumer lag metrics in Grafana every 60 seconds to ensure even partition rebalancing."
new_action = "I investigated partition consumer distribution and identified that a newly deployed payment validation step was performing synchronous DNS lookups inside the message loop. I immediately initiated an emergency configuration override to enable local DNS caching. Next, I engineered a temporary repartitioning script to dynamically scale consumer instances from 12 to 36 workers across three Kubernetes pods. I configured consumer backpressure throttling to prevent downstream database saturation, and I monitored consumer lag metrics in Grafana every 60 seconds to ensure even partition rebalancing."
p5_code = p5_code.replace(old_action, new_action)
d['parts'][4]['code'] = p5_code

with open('temp_d18_p5.ts', 'w', encoding='utf-8') as f:
    f.write(p5_code)
res5 = subprocess.run(['npx', 'tsx', 'temp_d18_p5.ts'], capture_output=True, text=True, shell=True)
d['parts'][4]['output'] = res5.stdout.strip()
print('Part 5 output updated.')

with open('scripts/make_soft_skills_day18.py', 'w', encoding='utf-8') as f:
    f.write('import json\n\ndef get_day_18():\n    return ' + json.dumps(d, indent=4) + '\n')
print('Day 18 successfully synchronized!')
