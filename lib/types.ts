import { GroupedReactionSchemaType } from "@/app/schemas/message";
import { Message } from "@/lib/generated/prisma/client";

export type MessageListItem = Message & {
  replyCount: number;
  reactions: GroupedReactionSchemaType[];
};
