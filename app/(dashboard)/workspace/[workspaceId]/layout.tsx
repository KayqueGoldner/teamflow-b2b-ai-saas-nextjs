import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { orpc } from "@/lib/orpc";

import { WorkspaceHeader } from "./_components/workspace-header";
import { CreateNewChannel } from "./_components/create-new-channel";
import { ChannelList } from "./_components/channel-list";
import { WorkspaceMembersList } from "./_components/workspace-members-list";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = async ({ children }: WorkspaceIdLayoutProps) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(orpc.channel.list.queryOptions());

  return (
    <>
      <div className="flex h-full w-80 flex-col border-r border-border bg-secondary">
        {/* header */}
        <div className="flex h-14 items-center border-b border-border px-4">
          <HydrateClient client={queryClient}>
            <WorkspaceHeader />
          </HydrateClient>
        </div>

        <div className="px-4 py-2">
          <CreateNewChannel />
        </div>

        {/* channel list */}
        <div className="flex-1 overflow-y-auto px-4">
          <Collapsible defaultOpen={true}>
            <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground hover:text-accent-foreground [&[data-state=open]>svg]:rotate-180">
              Main
              <ChevronDownIcon className="size-4 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 py-1">
              <HydrateClient client={queryClient}>
                <ChannelList />
              </HydrateClient>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* memberslist */}
        <div className="border-t border-border px-4 py-2">
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground hover:text-accent-foreground [&[data-state=open]>svg]:rotate-180">
              Members
              <ChevronUpIcon className="size-4 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <HydrateClient client={queryClient}>
                <WorkspaceMembersList />
              </HydrateClient>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {children}
    </>
  );
};

export default WorkspaceIdLayout;
