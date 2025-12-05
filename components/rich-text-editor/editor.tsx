"use client";

import { useEditor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";

import { editorExtensions } from "./extensions";
import { MenuBar } from "./menu-bar";

export const RichTextEditor = () => {
  const editor = useEditor({
    extensions: editorExtensions,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[125px] focus:outline-none p-4 !w-full !max-w-none prose dark:prose-invert marker:text-primary",
      },
    },
  });

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-lg border border-input dark:bg-input/30">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="max-h-[200px] overflow-y-auto"
      />
    </div>
  );
};
