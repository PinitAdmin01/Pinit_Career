import importlib
import sys
sys.path.insert(0, '.')

def estimateSpokenMinutes(lesson):
    words = []
    for p in lesson['parts']:
        words.extend(p.get('say', []))
        if p.get('example'):
            words.append(p['example'])
        if p.get('tryIt'):
            words.append(p['tryIt'])
        chk = p.get('check', {})
        why = chk.get('why') or chk.get('explanation') or ''
        words.append(why)
    total_words = len(' '.join(words).split())
    return Math_round(total_words / 120), total_words

def Math_round(val):
    import math
    return math.floor(val + 0.5)

def estimateActivityMinutes(lesson):
    minutes = sum((0.5 if p.get('code') else 0) + (1.0 if p.get('tryIt') else 0) + 0.5 for p in lesson['parts'])
    return Math_round(minutes)

def estimateLessonMinutes(lesson):
    spk_min, _ = estimateSpokenMinutes(lesson)
    return spk_min + estimateActivityMinutes(lesson)

for d in [56, 57, 58, 59, 60]:
    mod = importlib.import_module(f'scripts.mobile_day{d}_data')
    data = getattr(mod, f'day{d}')
    assert len(data['parts']) == 5, f'Day {d} parts len != 5'
    for idx, p in enumerate(data['parts']):
        say_words = sum(len(s.split()) for s in p['say'])
        assert say_words >= 580, f'Day {d} part {idx+1} say words {say_words} < 580'
        chk = p.get('check', {})
        assert 'question' in chk and len(chk['question']) > 10, f'Day {d} part {idx+1} question missing'
        assert 'options' in chk and len(chk['options']) >= 3, f'Day {d} part {idx+1} options < 3'
        assert ('answer' in chk or 'answerIndex' in chk), f'Day {d} part {idx+1} answer index missing'
        assert ('why' in chk or 'explanation' in chk), f'Day {d} part {idx+1} explanation missing'
        # Ensure both keys exist for compatibility
        if 'answer' not in chk and 'answerIndex' in chk:
            chk['answer'] = chk['answerIndex']
        if 'why' not in chk and 'explanation' in chk:
            chk['why'] = chk['explanation']
        if 'answerIndex' not in chk and 'answer' in chk:
            chk['answerIndex'] = chk['answer']
        if 'explanation' not in chk and 'why' in chk:
            chk['explanation'] = chk['why']
            
    spk_min, words = estimateSpokenMinutes(data)
    act_min = estimateActivityMinutes(data)
    total_min = estimateLessonMinutes(data)
    assert spk_min >= 20, f'Day {d} spoken min {spk_min} < 20'
    assert 35 <= total_min <= 40, f'Day {d} total min {total_min} not in [35, 40]'
    assert len(data.get('summary', [])) >= 5, f'Day {d} summary < 5'
    assert len(data.get('projectStep', {}).get('steps', [])) >= 5, f'Day {d} projectStep < 5'
    print(f"Day {d}: PASS | 5 parts, {words} words, spoken: {spk_min} min, total: {total_min} min (act: {act_min}), summary: {len(data['summary'])}, project steps: {len(data['projectStep']['steps'])}")
