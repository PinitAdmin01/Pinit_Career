import sys, re
sys.stdout.reconfigure(encoding='utf-8')

for f, varname in [('src/lib/data/mobile30DayData.ts', 'MOBILE_30_DAYS_CONFIGS'),
                   ('src/lib/data/java30DayData.ts', 'JAVA_30_DAYS_CONFIGS'),
                   ('src/lib/data/excelDataViz30DayData.ts', 'EXCEL_DATA_VIZ_30_DAYS_CONFIGS'),
                   ('src/lib/data/react30DayData.ts', 'REACT_30_DAYS_CONFIGS')]:
    with open(f, 'r', encoding='utf-8') as fh:
        text = fh.read()
    # count occurrences of title:
    titles = re.findall(r'title:\s*["\'`]', text)
    print(f'{varname} in {f}: {len(titles)} titles')
