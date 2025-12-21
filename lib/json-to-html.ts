import { generateHTML, type JSONContent } from "@tiptap/react";

import { baseExtensions } from "@/components/rich-text-editor/extensions";

export function convertJsonToHtml(jsonContent: JSONContent) {
  try {
    const content =
      typeof jsonContent === "string" ? JSON.parse(jsonContent) : jsonContent;

    return generateHTML(content, baseExtensions);
  } catch (error) {
    console.error("Error converting JSON to HTML:", error);
    return "";
  }
}
