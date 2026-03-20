import { toast } from "sonner";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { orpc } from "@/lib/orpc";

import { GroupedReactionSchemaType } from "@/app/schemas/message";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageListItem } from "@/lib/types";

import { EmojiReaction } from "./emoji-reaction";

type ThreadContext =
  | {
      type: "thread";
      threadId: string;
    }
  | {
      type: "list";
      channelId: string;
    };

interface ReactionsBarProps {
  messageId: string;
  reactions: GroupedReactionSchemaType[];
  context?: ThreadContext;
}

export const ReactionsBar = ({
  messageId,
  reactions,
  context,
}: ReactionsBarProps) => {
  const queryClient = useQueryClient();
  const { channelId } = useParams<{
    channelId: string;
  }>();

  const toggleMutation = useMutation(
    orpc.message.reaction.toggle.mutationOptions({
      onMutate: async (vars: { messageId: string; emoji: string }) => {
        const bump = (reactions: GroupedReactionSchemaType[]) => {
          const existing = reactions.find((r) => r.emoji === vars.emoji);
          let next: GroupedReactionSchemaType[] = [];

          if (existing) {
            const dec = existing.count - 1;
            if (dec <= 0) {
              next = reactions.filter((r) => r.emoji !== existing.emoji);
            } else {
              next = reactions.map((r) => {
                if (r.emoji === existing.emoji) {
                  return {
                    ...r,
                    count: dec,
                    reactedByMe: false,
                  };
                }
                return r;
              });
            }
          } else {
            next = [
              ...reactions,
              { emoji: vars.emoji, count: 1, reactedByMe: true },
            ];
          }

          return next;
        };

        const isThread = context && context.type === "thread";

        if (isThread) {
          const listOptions = orpc.message.thread.list.queryOptions({
            input: {
              messageId: context.threadId,
            },
          });

          await queryClient.cancelQueries({
            queryKey: listOptions.queryKey,
          });

          const previousMessages = queryClient.getQueryData(
            listOptions.queryKey,
          );
          queryClient.setQueryData(listOptions.queryKey, (oldMessages) => {
            if (!oldMessages) return oldMessages;

            if (vars.messageId === context.threadId) {
              return {
                ...oldMessages,
                parent: {
                  ...oldMessages.parent,
                  reactions: bump(oldMessages.parent.reactions),
                },
              };
            }

            return {
              ...oldMessages,
              messages: oldMessages.messages.map((message) => {
                if (message.id !== vars.messageId) return message;
                return {
                  ...message,
                  reactions: bump(message.reactions),
                };
              }),
            };
          });

          return {
            previousMessages,
            threadQueryKey: listOptions.queryKey,
          };
        }

        type MessagePage = {
          items: MessageListItem[];
          nextCursor?: string;
        };

        type InfiniteReplies = InfiniteData<MessagePage>;

        const listKey = ["message.list", channelId];
        await queryClient.cancelQueries({ queryKey: listKey });

        const previousMessages = queryClient.getQueryData(listKey);
        queryClient.setQueryData<InfiniteReplies>(listKey, (oldMessages) => {
          if (!oldMessages) return oldMessages;

          const pages = oldMessages.pages.map((page) => ({
            ...page,
            items: page.items.map((m) => {
              if (m.id !== messageId) return m;

              const current = m.reactions;
              const next = bump(current);

              return {
                ...m,
                reactions: next,
              };
            }),
          }));

          return {
            ...oldMessages,
            pages,
          };
        });

        return {
          previousMessages,
          listKey,
        };
      },
      onSuccess: () => {
        return toast.success("Emoji added");
      },
      onError: (_error, _vars, ctx) => {
        if (ctx?.threadQueryKey && ctx.previousMessages) {
          queryClient.setQueryData(ctx.threadQueryKey, ctx.previousMessages);
        }

        if (ctx?.previousMessages && ctx.listKey) {
          queryClient.setQueryData(ctx.listKey, ctx.previousMessages);
        }

        return toast.error("Error adding emoji");
      },
    }),
  );

  const handleToggle = (emoji: string) => {
    toggleMutation.mutate({
      messageId,
      emoji,
    });
  };

  return (
    <div className="mt-1 flex items-center gap-1">
      {reactions.map((reaction) => (
        <Button
          key={reaction.emoji}
          type="button"
          variant="secondary"
          size="sm"
          className={cn(
            "h-6 px-2 text-xs",
            reaction.reactedByMe && "border border-primary/40 bg-primary/10",
          )}
          onClick={() => handleToggle(reaction.emoji)}
        >
          <span>{reaction.emoji}</span>
          <span>{reaction.count}</span>
        </Button>
      ))}

      <EmojiReaction onSelect={handleToggle} />
    </div>
  );
};
