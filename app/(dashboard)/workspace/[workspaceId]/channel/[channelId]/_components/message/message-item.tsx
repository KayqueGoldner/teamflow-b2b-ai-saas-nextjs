"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { MessageSquareIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { getAvatar } from "@/lib/get-avatar";
import { SafeContent } from "@/components/rich-text-editor/safe-content";
import { MessageListItem } from "@/lib/types";
import { useThread } from "@/providers/thread-provider";
import { orpc } from "@/lib/orpc";

import { EditMessage } from "../toolbar/edit-message";
import { MessageHoverToolbar } from "../toolbar";

interface MessageItemProps {
  message: MessageListItem;
  currentUserId: string;
}

export const MessageItem = ({ message, currentUserId }: MessageItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { openThread } = useThread();
  const queryClient = useQueryClient();

  const prefetchThread = useCallback(() => {
    const options = orpc.message.thread.list.queryOptions({
      input: {
        messageId: message.id,
      },
    });

    queryClient
      .prefetchQuery({ ...options, staleTime: 60_000 })
      .catch(() => {});
  }, [message.id, queryClient]);

  return (
    <div className="group relative flex gap-x-3 rounded-lg p-3 hover:bg-muted/50">
      <Image
        src={getAvatar(message.authorAvatar, message.authorEmail)}
        alt="user avatar"
        width={32}
        height={32}
        className="size-8 rounded-lg"
      />

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-x-2">
          <p className="leading-none font-medium">{message.authorName}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {new Intl.DateTimeFormat("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(message.createdAt)}{" "}
            {new Intl.DateTimeFormat("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }).format(message.createdAt)}
          </p>
        </div>

        {isEditing ? (
          <EditMessage
            message={message}
            onCancel={() => setIsEditing(false)}
            onSave={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="max-w-none text-sm wrap-break-word">
              <SafeContent
                content={JSON.parse(message.content)}
                className="prose max-w-none text-sm wrap-break-word marker:text-primary dark:prose-invert"
              />
            </div>

            {message.imageUrl && (
              <div className="mt-2">
                <Image
                  src={message.imageUrl}
                  alt="message image"
                  width={512}
                  height={512}
                  className="max-h-[320px] w-auto rounded-md object-contain"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={message.imageUrl}
                />
              </div>
            )}

            {message.repliesCount > 0 && (
              <button
                type="button"
                className="mt-1 inline-flex cursor-pointer items-center gap-1 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-1 focus-visible:ring-border focus-visible:outline-none"
                onClick={() => openThread(message.id)}
                onMouseEnter={prefetchThread}
                onFocus={prefetchThread}
              >
                <MessageSquareIcon className="size-3.5" />
                <span>
                  {message.repliesCount}{" "}
                  {message.repliesCount === 1 ? "reply" : "replies"}
                </span>
                <span className="opacity-0 transition-opacity group-hover:opacity-100">
                  View Thread
                </span>
              </button>
            )}
          </>
        )}
      </div>

      <MessageHoverToolbar
        messageId={message.id}
        canEdit={message.authorId === currentUserId}
        onEdit={() => setIsEditing(true)}
      />
    </div>
  );
};
