"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ChevronDownIcon, Loader2Icon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { orpc } from "@/lib/orpc";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/general/empty-state";

import { MessageItem } from "./message/message-item";

export const MessageList = () => {
  const [newMessages, setNewMessages] = useState(false);
  const [hasInitialScrolled, setHasInitialScrolled] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const { channelId } = useParams<{ channelId: string }>();

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastItemIdRef = useRef<string | undefined>(undefined);

  const infiniteOptions = orpc.message.list.infiniteOptions({
    input: (pageParam: string | undefined) => ({
      channelId: channelId,
      cursor: pageParam,
      limit: 10,
    }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor;
    },
    select: (data) => ({
      pages: [...data.pages]
        .map((page) => ({
          ...page,
          items: [...page.items].reverse(),
        }))
        .reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    error,
  } = useInfiniteQuery({
    ...infiniteOptions,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    /**
     * Scroll to bottom when messages are loaded
     */
    if (!hasInitialScrolled && data?.pages.length) {
      const el = scrollRef.current;

      if (el) {
        bottomRef.current?.scrollIntoView({ block: "end" });
        setHasInitialScrolled(true);
        setIsAtBottom(true);
      }
    }
  }, [hasInitialScrolled, data?.pages.length]);

  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    const scrollToBottomIfNeeded = () => {
      if (isAtBottom || !hasInitialScrolled) {
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
  }, [isAtBottom, hasInitialScrolled]);

  const isNearBottom = (el: HTMLDivElement) => {
    return el.scrollHeight - el.scrollTop - el.clientHeight <= 80;
  };

  const handleScroll = () => {
    const el = scrollRef.current;

    if (!el) return;

    /**
     * Load more messages when user scrolls to top
     */
    if (el.scrollTop <= 80 && hasNextPage && !isFetching) {
      const prevScrollHeight = el.scrollHeight;
      const prevScrollTop = el.scrollTop;

      fetchNextPage().then(() => {
        const newScrollHeight = el.scrollHeight;
        el.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
      });
    }

    setIsAtBottom(isNearBottom(el));
  };

  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  const isEmpty = !isLoading && !error && items.length === 0;

  useEffect(() => {
    if (!items.length) return;

    const lastId = items[items.length - 1].id;
    const prevLastId = lastItemIdRef.current;
    const el = scrollRef.current;

    if (prevLastId && lastId !== prevLastId) {
      /**
       * Scroll to bottom when new messages are loaded
       */
      if (el && isNearBottom(el)) {
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight;
        });

        setNewMessages(false);
        setIsAtBottom(true);
      } else {
        /**
         * Show new messages indicator
         */
        setNewMessages(true);
      }
    }

    lastItemIdRef.current = lastId;
  }, [items]);

  const scrollToBottom = () => {
    const el = scrollRef.current;

    if (el) {
      bottomRef.current?.scrollIntoView({ block: "end" });
      setIsAtBottom(true);
      setNewMessages(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center py-4">
        <Loader2Icon className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No messages found</div>;
  }

  return (
    <div className="relative h-full">
      <div
        className="flex h-full flex-col gap-y-2 overflow-y-auto px-4"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {isEmpty ? (
          <div className="flex h-full pt-4">
            <EmptyState
              title="No messages yet."
              description="Start a conversation."
              href="#"
              buttonText="Start a conversation"
            />
          </div>
        ) : (
          items.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}

        <div ref={bottomRef} />
      </div>

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

      {isFetchingNextPage && (
        <div className="pointer-events-none absolute top-0 right-0 left-0 z-20 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-md bg-gradient-to-b from-white/80 to-transparent px-3 py-1 backdrop-blur dark:from-neutral-900/80">
            <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
            <span>Loading previous messages...</span>
          </div>
        </div>
      )}
    </div>
  );
};
