"use client";

import { useEditor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";
import {
  type FieldPath,
  type FieldValues,
  type ControllerRenderProps,
} from "react-hook-form";

import { editorExtensions } from "./extensions";
import { MenuBar } from "./menu-bar";

export type RichTextEditorFieldType<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ControllerRenderProps<TFieldValues, TName>;

interface RichTextEditorProps {
  field: RichTextEditorFieldType;
  sendButton: React.ReactNode;
  footerLeft?: React.ReactNode;
}

export const RichTextEditor = ({
  field,
  sendButton,
  footerLeft,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: editorExtensions,
    immediatelyRender: false,
    content: (() => {
      if (!field?.value) return "";

      try {
        return JSON.parse(field.value);
      } catch (error) {
        return "";
      }
    })(),
    onUpdate: ({ editor }) => {
      if (field?.onChange) {
        field.onChange(JSON.stringify(editor.getJSON()));
      }
    },
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

      <div className="flex items-center justify-between gap-2 border-t border-input bg-card px-3 py-2">
        <div className="flex min-h-8 items-center">{footerLeft}</div>
        <div className="shrink-0">{sendButton}</div>
      </div>
    </div>
  );
};
