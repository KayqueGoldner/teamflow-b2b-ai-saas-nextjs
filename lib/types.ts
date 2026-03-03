import { Message } from "@/lib/generated/prisma/client";

export type MessageListItem = Message & {
  repliesCount: number;
};
