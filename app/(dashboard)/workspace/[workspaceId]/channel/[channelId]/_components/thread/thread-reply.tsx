import Image from "next/image";

import { SafeContent } from "@/components/rich-text-editor/safe-content";
import { Message } from "@/lib/generated/prisma/client";

interface ThreadReplyProps {
  message: Message;
}

export const ThreadReply = ({ message }: ThreadReplyProps) => (
  <div className="flex gap-3 rounded-lg p-3 hover:bg-muted/30">
    <Image
      src={message.authorAvatar}
      alt={message.authorName}
      width={32}
      height={32}
      className="mt-1 size-8 shrink-0 rounded-full"
    />

    <div className="min-w-0 flex-1 space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{message.authorName}</span>
        <span className="text-xs text-muted-foreground">
          {new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            month: "short",
            day: "numeric",
          }).format(message.createdAt)}
        </span>
      </div>

      <div className="max-w-none text-sm wrap-break-word">
        <SafeContent
          content={JSON.parse(message.content)}
          className="prose max-w-none text-sm wrap-break-word marker:text-primary dark:prose-invert"
        />
      </div>
    </div>
  </div>
);
