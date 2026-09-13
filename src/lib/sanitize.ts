/**
 * Strips dangerous HTML tags and event handlers to prevent XSS attacks.
 * Use to sanitize dynamic HTML or style blocks passed to dangerouslySetInnerHTML.
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>.*?<\/object>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')   // Remove all event handlers
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}
