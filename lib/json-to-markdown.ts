import { renderToMarkdown } from "@tiptap/static-renderer";

import { baseExtensions } from "@/components/rich-text-editor/extensions";

export function normalizeWhitespace(text: string) {
  return text
    .replace(/\s+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function tiptapJsonToMarkdown(json: string) {
  let content;

  try {
    content = JSON.parse(json);
  } catch (error) {
    return "";
  }

  const markdown = renderToMarkdown({
    extensions: baseExtensions,
    content: content,
  });

  return normalizeWhitespace(markdown);
}
