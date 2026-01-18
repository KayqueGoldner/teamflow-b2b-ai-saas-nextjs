"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";

import { MessageInputForm } from "./_components/message/message-input-form";
import { ChannelHeader } from "./_components/channel-header";
import { MessageList } from "./_components/message-list";

interface ChannelIdPageProps {}

const ChannelIdPage = ({}: ChannelIdPageProps) => {
  const { channelId } = useParams<{ channelId: string }>();
  const { data, error, isLoading, isSuccess, isError } = useQuery(
    orpc.channel.get.queryOptions({
      input: { channelId },
    }),
  );

  if (isLoading) {
    return <p>Loading</p>;
  }

  if (error || !isSuccess || isError) {
    return <p>Error</p>;
  }

  return (
    <div className="flex h-screen w-full">
      {/* main channel */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* fixed header */}
        <ChannelHeader channelName={data.channelName} />

        {/* scrollable messages area */}
        <div className="mb-4 flex-1 overflow-hidden">
          <MessageList />
        </div>

        {/* fixed input */}
        <div className="border-t bg-background p-4">
          <MessageInputForm channelId={channelId} user={data.currentUser} />
        </div>
      </div>
    </div>
  );
};

export default ChannelIdPage;
