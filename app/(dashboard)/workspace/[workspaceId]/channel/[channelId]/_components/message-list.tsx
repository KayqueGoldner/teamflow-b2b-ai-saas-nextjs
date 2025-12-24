"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { orpc } from "@/lib/orpc";
import { Button } from "@/components/ui/button";

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
        el.scrollTop = el.scrollHeight;
        setHasInitialScrolled(true);
        setIsAtBottom(true);
      }
    }
  }, [hasInitialScrolled, data?.pages.length]);

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
      el.scrollTop = el.scrollHeight;
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
        className="h-full overflow-y-auto px-4"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {items.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        <div ref={bottomRef} />
      </div>

      {newMessages && !isAtBottom ? (
        <Button
          type="button"
          className="absolute right-8 bottom-4 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            scrollToBottom();
          }}
        >
          New messages
        </Button>
      ) : null}
    </div>
  );
};
