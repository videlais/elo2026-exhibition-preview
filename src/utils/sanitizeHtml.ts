import DOMPurify from 'dompurify';
import type { Config } from 'dompurify';

export function sanitizeHtml(html: string, config?: Config): string {
  // DOMPurify requires a browser DOM; in SSR (Node.js) the data is trusted
  // server-side content so we return it unchanged.
  if (typeof window === 'undefined') {
    return html;
  }
  return DOMPurify.sanitize(html, config);
}
