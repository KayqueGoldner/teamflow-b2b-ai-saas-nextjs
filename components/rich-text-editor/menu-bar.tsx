import { Editor, useEditorState } from "@tiptap/react";
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  RedoIcon,
  StrikethroughIcon,
  UndoIcon,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ComposeAssistant } from "@/components/rich-text-editor/compose-assistant";
import { markdownToJson } from "@/lib/markdown-to-json";

interface MenubarProps {
  editor: Editor | null;
}

export const MenuBar = ({ editor }: MenubarProps) => {
  const editorState = useEditorState({
    editor: editor,
    selector: ({ editor }) => {
      if (!editor) return null;

      return {
        isBold: editor.isActive("bold"),
        isItalic: editor.isActive("italic"),
        isStrike: editor.isActive("strike"),
        isCodeBlock: editor.isActive("codeBlock"),
        isBulletList: editor.isActive("bulletList"),
        isOrderedList: editor.isActive("orderedList"),
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
        currentContent: editor.getJSON(),
      };
    },
  });

  if (!editor) {
    return null;
  }

  const handleAcceptCompose = (markdown: string) => {
    try {
      const json = markdownToJson(markdown);
      editor.commands.setContent(json);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-x-0 border-t-0 border-input bg-card p-2">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editorState?.isBold}
                onPressedChange={() =>
                  editor.chain().focus().toggleBold().run()
                }
                className={cn(
                  editorState?.isBold && "bg-muted text-muted-foreground",
                )}
              >
                <BoldIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editorState?.isItalic}
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                className={cn(
                  editorState?.isItalic && "bg-muted text-muted-foreground",
                )}
              >
                <ItalicIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editorState?.isStrike}
                onPressedChange={() =>
                  editor.chain().focus().toggleStrike().run()
                }
                className={cn(
                  editorState?.isStrike && "bg-muted text-muted-foreground",
                )}
              >
                <StrikethroughIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Strike</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editorState?.isCodeBlock}
                onPressedChange={() =>
                  editor.chain().focus().toggleCodeBlock().run()
                }
                className={cn(
                  editorState?.isCodeBlock && "bg-muted text-muted-foreground",
                )}
              >
                <CodeIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Code block</TooltipContent>
          </Tooltip>
        </div>
        <div className="mx-2 h-6 w-px bg-border" />
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editorState?.isBulletList}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                className={cn(
                  editorState?.isBulletList && "bg-muted text-muted-foreground",
                )}
              >
                <ListIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bullet list</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editorState?.isOrderedList}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                className={cn(
                  editorState?.isOrderedList &&
                    "bg-muted text-muted-foreground",
                )}
              >
                <ListOrderedIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Ordered list</TooltipContent>
          </Tooltip>
        </div>
        <div className="mx-2 h-6 w-px bg-border" />
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editorState?.canUndo}
              >
                <UndoIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editorState?.canRedo}
              >
                <RedoIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>
        <div className="mx-2 h-6 w-px bg-border" />
        <div className="flex flex-wrap gap-1">
          <ComposeAssistant
            content={JSON.stringify(editorState?.currentContent ?? {})}
            onAccept={handleAcceptCompose}
          />
        </div>
      </TooltipProvider>
    </div>
  );
};
