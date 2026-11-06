with open(r'C:\Users\Admin\Desktop\projects\Present-Career-os-platform\src\lib\data\bcomLawLongLessons.ts', 'r', encoding='utf-8') as f:
    c_content = f.read()

with open(r'C:\Users\Admin\Desktop\projects\Present-Career-os-commerce\src\lib\data\bcomLawLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(c_content)

print("Synchronized Days 1-45 into Branch B bcomLawLongLessons.ts successfully!")
