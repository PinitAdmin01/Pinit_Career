with open('tests/bcom_finance_accounting_long_lessons.test.ts', 'r', encoding='utf-8') as f:
    text = f.read()

if 'Block 131:' in text:
    idx = text.find('Block 131:')
    t_idx = text.rfind('test(', 0, idx)
    base = text[:t_idx]
    with open('tests/bcom_finance_accounting_long_lessons.test.ts', 'w', encoding='utf-8') as f_out:
        f_out.write(base.rstrip() + '\n')
    print('Stripped Block 131 cleanly')
else:
    print('Block 131 not found')
