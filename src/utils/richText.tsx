/* eslint-disable react-refresh/only-export-components */
import type { JSX } from "react";
import { sanitizeHtml } from "./sanitizeHtml";

export function containsHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function toParagraphs(value: string): string[] {
  return value
    .split(/\n\s*\n/g)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);
}

export interface RichTextBlockProps {
  id?: string;
  className?: string;
  content: string;
  allowedTags?: string[];
  allowedAttrs?: string[];
}

export function RichTextBlock({
  id,
  className,
  content,
  allowedTags = ["p", "br", "em", "strong", "b", "i", "u", "a", "ul", "ol", "li", "blockquote"],
  allowedAttrs = ["href", "target", "rel"],
}: RichTextBlockProps): JSX.Element {
  if (containsHtml(content)) {
    return (
      <div
        id={id}
        className={className}
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(content, {
            ALLOWED_TAGS: allowedTags,
            ALLOWED_ATTR: allowedAttrs,
          }),
        }}
      ></div>
    );
  }

  const paragraphs = toParagraphs(content);

  if (paragraphs.length === 0) {
    return <div id={id} className={className}></div>;
  }

  return (
    <div id={id} className={className}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
