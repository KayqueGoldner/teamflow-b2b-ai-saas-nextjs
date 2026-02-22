import Image from "next/image";
import { MessageSquareIcon, XIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useThread } from "@/providers/thread-provider";
import { orpc } from "@/lib/orpc";
import { SafeContent } from "@/components/rich-text-editor/safe-content";

import { ThreadReply } from "./thread-reply";
import { ThreadReplyForm } from "./thread-reply-form";

export const ThreadSidebar = () => {
  const { selectedThreadId, closeThread } = useThread();

  const { data, isLoading } = useQuery(
    orpc.message.thread.list.queryOptions({
      input: {
        messageId: selectedThreadId!,
      },
      enabled: !!selectedThreadId,
    }),
  );

  return (
    <div className="flex h-full w-120 flex-col border-l">
      {/* header */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <MessageSquareIcon className="size-4" />
          <span>Thread</span>
        </div>

        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={() => closeThread()}>
            <XIcon className="size-4" />
          </Button>
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 overflow-y-auto">
        {data && (
          <div className="border-b bg-muted/20 p-4">
            <div className="flex gap-3">
              <Image
                src={data.parent.authorAvatar}
                alt={data.parent.authorName}
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-full"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {data.parent.authorName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                      month: "short",
                      day: "numeric",
                    }).format(data.parent.createdAt)}
                  </span>
                </div>

                <div className="max-w-none text-sm wrap-break-word">
                  <SafeContent
                    content={JSON.parse(data.parent.content)}
                    className="prose max-w-none text-sm wrap-break-word marker:text-primary dark:prose-invert"
                  />
                </div>
              </div>
            </div>

            {/* thread replies */}
            <div className="p-2">
              <p className="mb-3 px-2 text-xs text-muted-foreground">
                {data.messages.length} replies
              </p>

              <div className="space-y-1">
                {data.messages.map((message) => (
                  <ThreadReply key={message.id} message={message} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* thread reply form */}
      <div className="border-t p-4">
        <ThreadReplyForm threadId={selectedThreadId!} />
      </div>
    </div>
  );
};
