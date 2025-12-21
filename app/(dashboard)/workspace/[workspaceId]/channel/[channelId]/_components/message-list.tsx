"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { MessageItem } from "./message/message-item";
import { orpc } from "@/lib/orpc";

export const MessageList = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { data, isLoading, error } = useQuery(
    orpc.message.list.queryOptions({ input: { channelId } }),
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No messages found</div>;
  }

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-4">
        {data?.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};
