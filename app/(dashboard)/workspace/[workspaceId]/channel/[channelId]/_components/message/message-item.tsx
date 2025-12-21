import Image from "next/image";

import { Message } from "@/lib/generated/prisma/client";
import { getAvatar } from "@/lib/get-avatar";
import { SafeContent } from "@/components/rich-text-editor/safe-content";

interface MessageItemProps {
  message: Message;
}

export const MessageItem = ({ message }: MessageItemProps) => {
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

        <p className="max-w-none text-sm break-words">
          <SafeContent
            content={JSON.parse(message.content)}
            className="prose max-w-none text-sm break-words marker:text-primary dark:prose-invert"
          />
        </p>
      </div>
    </div>
  );
};
