import { JAVA_30_DAYS_CONFIGS } from '../src/lib/data/java30DayData';

for (let day = 21; day <= 30; day++) {
  const cfg = JAVA_30_DAYS_CONFIGS.find(c => c.day === day);
  if (cfg) {
    console.log(`==================== DAY ${cfg.day} ====================`);
    console.log(`Current Title: ${cfg.title}`);
    console.log(`Easy Title: ${cfg.eTitle}`);
    console.log(`Easy Desc: ${cfg.eDesc}`);
    console.log(`Easy Starter:\n${cfg.eStarter}`);
    console.log(`Adv Title: ${cfg.aTitle}`);
    console.log(`Adv Desc: ${cfg.aDesc}`);
    console.log(`Adv Starter:\n${cfg.aStarter}`);
  }
}
