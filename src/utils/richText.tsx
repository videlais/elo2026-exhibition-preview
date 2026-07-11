/* eslint-disable react-refresh/only-export-components */
import type { JSX } from "react";
import { marked } from "marked";
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
  // Content arrives either as pre-rendered HTML (e.g. works.json, converted from
  // Markdown at build time) or as raw Markdown (e.g. about.json paragraphs).
  // Convert Markdown to HTML, pass existing HTML through untouched, then always
  // sanitize before rendering.
  const html = containsHtml(content)
    ? content
    : marked.parse(content, { async: false });

  return (
    <div
      id={id}
      className={className}
      dangerouslySetInnerHTML={{
        __html: sanitizeHtml(html, {
          ALLOWED_TAGS: allowedTags,
          ALLOWED_ATTR: allowedAttrs,
        }),
      }}
    />
  );
}
