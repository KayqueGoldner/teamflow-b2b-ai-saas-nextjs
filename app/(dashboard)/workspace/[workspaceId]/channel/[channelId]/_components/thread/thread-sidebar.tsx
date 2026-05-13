"use client";

import Image from "next/image";
import { ChevronDownIcon, MessageSquareIcon, XIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useThread } from "@/providers/thread-provider";
import { orpc } from "@/lib/orpc";
import { SafeContent } from "@/components/rich-text-editor/safe-content";

import { ThreadReply } from "./thread-reply";
import { ThreadReplyForm } from "./thread-reply-form";
import { ThreadSidebarSkeleton } from "./thread-sidebar-skeleton";
import { SummarizeThread } from "./summarize-thread";

interface ThreadSidebarProps {
  user: KindeUser<Record<string, unknown>>;
}

export const ThreadSidebar = ({ user }: ThreadSidebarProps) => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef<number>(0);

  const { selectedThreadId, closeThread } = useThread();

  const { data, isLoading } = useQuery(
    orpc.message.thread.list.queryOptions({
      input: {
        messageId: selectedThreadId!,
      },
      enabled: !!selectedThreadId,
    }),
  );

  const messageCount = data?.messages.length ?? 0;

  const isNearBottom = (el: HTMLDivElement) => {
    return el.scrollHeight - el.scrollTop - el.clientHeight <= 80;
  };

  useEffect(() => {
    if (messageCount === 0) return;

    const prevMessagesCount = lastMessageCountRef.current;
    const el = scrollRef.current;

    if (prevMessagesCount > 0 && messageCount !== prevMessagesCount) {
      if (el && isNearBottom(el)) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({
            block: "end",
            behavior: "smooth",
          });
        });

        setIsAtBottom(true);
      }
    }

    lastMessageCountRef.current = messageCount;
  }, [messageCount]);

  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    const scrollToBottomIfNeeded = () => {
      if (isAtBottom) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({
            block: "end",
          });
        });
      }
    };

    const onImageLoad = (e: Event) => {
      if (e.target instanceof HTMLImageElement) {
        scrollToBottomIfNeeded();
      }
    };

    el.addEventListener("load", onImageLoad);

    /**
     * Scroll to bottom when the container size changes
     */
    const resizeObserver = new ResizeObserver(() => {
      scrollToBottomIfNeeded();
    });

    resizeObserver.observe(el);

    /**
     * Scroll to bottom when the container content changes
     */
    const mutationObserver = new MutationObserver(() => {
      scrollToBottomIfNeeded();
    });

    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      el.removeEventListener("load", onImageLoad, true);
    };
  }, [isAtBottom]);

  const scrollToBottom = () => {
    const el = scrollRef.current;

    if (el) {
      bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
      setIsAtBottom(true);
    }
  };

  const handleScroll = () => {
    const el = scrollRef.current;

    if (el) {
      setIsAtBottom(isNearBottom(el));
    }
  };

  if (isLoading) {
    return <ThreadSidebarSkeleton />;
  }

  return (
    <div className="flex h-full w-120 flex-col border-l">
      {/* header */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <MessageSquareIcon className="size-4" />
          <span>Thread</span>
        </div>

        <div className="flex items-center gap-2">
          <SummarizeThread messageId={selectedThreadId!} />
          <Button variant="outline" size="icon" onClick={() => closeThread()}>
            <XIcon className="size-4" />
          </Button>
        </div>
      </div>

      {/* main content */}
      <div className="relative flex-1 overflow-y-auto">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto"
        >
          {data && (
            <>
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
              </div>

              {/* thread replies */}
              <div className="p-2">
                <p className="mb-3 px-2 text-xs text-muted-foreground">
                  {data.messages.length} replies
                </p>

                <div className="space-y-1">
                  {data.messages.map((message) => (
                    <ThreadReply
                      key={message.id}
                      message={message}
                      selectedThreadId={selectedThreadId!}
                    />
                  ))}
                </div>
              </div>

              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* scroll to bottom button */}
        {!isAtBottom && (
          <Button
            type="button"
            size="sm"
            className="absolute right-5 bottom-4 z-20 size-10 rounded-full transition-all duration-200 hover:shadow-xl"
            onClick={(e) => {
              e.stopPropagation();
              scrollToBottom();
            }}
          >
            <ChevronDownIcon />
          </Button>
        )}
      </div>

      {/* thread reply form */}
      <div className="border-t p-4">
        <ThreadReplyForm threadId={selectedThreadId!} user={user} />
      </div>
    </div>
  );
};
