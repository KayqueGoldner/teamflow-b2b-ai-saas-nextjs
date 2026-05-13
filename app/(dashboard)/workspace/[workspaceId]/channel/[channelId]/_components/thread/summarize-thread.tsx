import { SparklesIcon } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { eventIteratorToStream } from "@orpc/client";
import { useState } from "react";

import { client } from "@/lib/orpc";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Response } from "@/components/ai-elements/response";

interface SummarizeThreadProps {
  messageId: string;
}

export const SummarizeThread = ({ messageId }: SummarizeThreadProps) => {
  const [open, setOpen] = useState(false);

  const {
    messages,
    status,
    error,
    sendMessage,
    setMessages,
    stop,
    clearError,
  } = useChat({
    id: `thread-summary:${messageId}`,
    transport: {
      async sendMessages(options) {
        return eventIteratorToStream(
          await client.ai.thread.summary.generate(
            {
              messageId,
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

  const lastAssistant = messages.findLast(
    (message) => message.role === "assistant",
  );

  const summaryText =
    lastAssistant?.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n\n") ?? "";

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      const hasAssistantMessage = messages.some(
        (message) => message.role === "assistant",
      );

      if (status !== "ready" || hasAssistantMessage) {
        return;
      }

      sendMessage({ text: "Summarize Thread" });
    } else {
      stop();
      clearError();
      setMessages([]);
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="sm"
          className="relative overflow-hidden rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring"
        >
          <SparklesIcon className="size-3.5" />
          <span className="text-xs font-medium">Summarize</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-100 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="relative inline-flex items-center justify-center gap-1.5 rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-4 py-1.5">
              <SparklesIcon className="size-3.5 text-white" />
              <span className="text-sm font-medium">AI Summary (Preview)</span>
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
          ) : summaryText ? (
            <Response parseIncompleteMarkdown={status !== "ready"}>
              {summaryText}
            </Response>
          ) : status === "submitted" || status === "streaming" ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Click summarize to generate
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
