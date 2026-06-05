import { SparklesIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { eventIteratorToStream } from "@orpc/server";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { client } from "@/lib/orpc";
import { Response } from "@/components/ai-elements/response";
import { Skeleton } from "@/components/ui/skeleton";

interface ComposeAssistantProps {
  content: string;
  onAccept?: (markdown: string) => void;
}

export const ComposeAssistant = ({
  content,
  onAccept,
}: ComposeAssistantProps) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(content);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const {
    messages,
    status,
    error,
    sendMessage,
    setMessages,
    stop,
    clearError,
  } = useChat({
    id: `compose-assistant`,
    transport: {
      async sendMessages(options) {
        return eventIteratorToStream(
          await client.ai.compose.generate(
            {
              content: contentRef.current,
            },
            {
              signal: options.abortSignal,
            },
          ),
        );
      },
      reconnectToStream() {
        throw new Error("Unsupported");
      },
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      const hasAssistantMessage = messages.some(
        (message) => message.role === "assistant",
      );

      if (status !== "ready" || hasAssistantMessage) {
        return;
      }

      sendMessage({ text: "Rewrite" });
    } else {
      stop();
      clearError();
      setMessages([]);
    }
  }

  const lastAssistant = messages.findLast(
    (message) => message.role === "assistant",
  );

  const composedText =
    lastAssistant?.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n\n") ?? "";

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="sm"
          className="relative overflow-hidden rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring"
        >
          <SparklesIcon className="size-3.5" />
          <span className="text-xs font-medium">Compose</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-100 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="relative inline-flex items-center justify-center gap-1.5 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-4 py-1.5">
              <SparklesIcon className="size-3.5 text-white" />
              <span className="text-sm font-medium">Compose Assistant</span>
            </div>
          </div>

          {status === "streaming" && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => stop()}
            >
              Stop
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto px-4 py-3">
          {error ? (
            <div>
              <p className="text-red-500">{error.message}</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  clearError();
                  setMessages([]);
                  sendMessage({ text: "Summarize Thread" });
                }}
              >
                Retry
              </Button>
            </div>
          ) : composedText ? (
            <Response parseIncompleteMarkdown={status !== "ready"}>
              {composedText}
            </Response>
          ) : status === "submitted" || status === "streaming" ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Click "Compose" to generate
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t bg-muted/30 px-3 py-2">
          <Button
            type="submit"
            variant="outline"
            size="sm"
            onClick={() => {
              stop();
              clearError();
              setMessages([]);
              setOpen(false);
            }}
          >
            Decline
          </Button>
          <Button
            type="submit"
            size="sm"
            onClick={() => {
              onAccept?.(composedText);
              stop();
              clearError();
              setMessages([]);
              setOpen(false);
            }}
            disabled={status !== "ready" || !composedText}
          >
            Accept
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
