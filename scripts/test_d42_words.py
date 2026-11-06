with open('scripts/build_day42.py', 'r', encoding='utf-8') as f:
    text = f.read()

# bypass assert to check all parts
text = text.replace('assert wc >= 600', '# assert wc >= 600')
text = text.replace('assert total_words >= 3000', '# assert total_words >= 3000')

loc = {}
exec(text, loc)
