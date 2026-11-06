with open('src/app/api/internship/tasks/[taskId]/submit/route.ts', 'r', encoding='utf-8') as f:
    code = f.read()

if 'getSeedWebTier1Tasks' not in code:
    code = code.replace(
        "import { generateTier1Tasks } from '@/lib/internships/tier1Tickets';",
        "import { generateTier1Tasks } from '@/lib/internships/tier1Tickets';\nimport { getSeedWebTier1Tasks } from '@/lib/internships/seedWebTier1Tasks';"
    )

old_block = """      const tasksRes = await generateTier1Tasks({
        companyProfile: { name: 'NexaCommerce Core Systems', industry: 'Enterprise E-Commerce', readme: 'Demo' },
        seed: `demo-seed-${track}`,
        track,
      });

      if (tasksRes.ok && tasksRes.tickets[seq - 1]) {
        const canonical = tasksRes.tickets[seq - 1].task;"""

new_block = """      let canonical: any = null;
      if (track === 'web_fullstack') {
        const webTasks = getSeedWebTier1Tasks({ name: 'PulseSync Systems', industry: 'Cloud Infrastructure' });
        canonical = webTasks[seq - 1];
      } else {
        const tasksRes = await generateTier1Tasks({
          companyProfile: { name: 'NexaCommerce Core Systems', industry: 'Enterprise E-Commerce', readme: 'Demo' },
          seed: `demo-seed-${track}`,
          track,
        });
        if (tasksRes.ok && tasksRes.tickets[seq - 1]) {
          canonical = tasksRes.tickets[seq - 1].task;
        }
      }

      if (canonical) {"""

if old_block in code:
    code = code.replace(old_block, new_block)
    with open('src/app/api/internship/tasks/[taskId]/submit/route.ts', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Patched submit route for web demo support!")
else:
    print("Old block not found")
