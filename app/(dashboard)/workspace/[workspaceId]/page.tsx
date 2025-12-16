import { redirect } from "next/navigation";
import { CloudIcon } from "lucide-react";

import { client } from "@/lib/orpc";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { CreateNewChannel } from "@/app/(dashboard)/workspace/[workspaceId]/_components/create-new-channel";

interface WorkspaceIdPageProps {
  params: Promise<{ workspaceId: string }>;
}

const WorkspaceIdPage = async ({ params }: WorkspaceIdPageProps) => {
  const { workspaceId } = await params;

  const { channels } = await client.channel.list();

  if (channels.length > 0) {
    return redirect(`/workspace/${workspaceId}/channel/${channels[0].id}`);
  }

  return (
    <div className="flex flex-1 p-20">
      <Empty className="h-full border border-dashed bg-gradient-to-b from-muted/50 from-30% to-background">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CloudIcon />
          </EmptyMedia>
          <EmptyTitle>No channels yet</EmptyTitle>
          <EmptyDescription>
            Create your first channel to get started.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="mx-auto max-w-xs">
          <CreateNewChannel />
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default WorkspaceIdPage;
