"use client";

import { useParams } from "next/navigation";

import { MessageInputForm } from "./_components/message/message-input-form";
import { ChannelHeader } from "./_components/channel-header";
import { MessageList } from "./_components/message-list";

interface ChannelIdPageProps {}

const ChannelIdPage = ({}: ChannelIdPageProps) => {
  const { channelId } = useParams<{ channelId: string }>();

  return (
    <div className="flex h-screen w-full">
      {/* main channel */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* fixed header */}
        <ChannelHeader />

        {/* scrollable messages area */}
        <div className="mb-4 flex-1 overflow-hidden">
          <MessageList />
        </div>

        {/* fixed input */}
        <div className="border-t bg-background p-4">
          <MessageInputForm channelId={channelId} />
        </div>
      </div>
    </div>
  );
};

export default ChannelIdPage;
