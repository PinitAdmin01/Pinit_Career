path = 'src/app/quests/lesson/components/LessonContentRenderer.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """                          <button
                            data-testid="btn-confirm-understanding"
                            onClick={() => {
                              setUnderstandingConfirmed(prev => ({ ...prev, [currentSlide - 1]: true }));
                              toast.success("Great!", "Understanding confirmed. Click 'Next Slide' to continue.");
                            }}"""

replacement = """                          <button
                            data-testid="btn-confirm-understanding"
                            onClick={() => {
                              setUnderstandingConfirmed(prev => ({ ...prev, [currentSlide - 1]: true }));
                              toast.success("Awesome!", "Concept confirmed.");
                              handleNextSlide();
                            }}"""

target_crlf = target.replace('\n', '\r\n')
replacement_crlf = replacement.replace('\n', '\r\n')

if target_crlf in content:
    content = content.replace(target_crlf, replacement_crlf)
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(content)
    print('SUCCESSFULLY_REPLACED')
elif target in content:
    content = content.replace(target, replacement)
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(content)
    print('SUCCESSFULLY_REPLACED_LF')
else:
    print('TARGET_NOT_FOUND')
