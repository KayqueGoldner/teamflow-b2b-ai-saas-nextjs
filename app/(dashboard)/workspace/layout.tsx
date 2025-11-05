import { orpc } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";

import { WorkspaceList } from "./_components/workspace-list";
import { CreateWorkspace } from "./_components/create-workspace";
import { UserNav } from "./_components/user-nav";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = async ({ children }: WorkspaceIdLayoutProps) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(orpc.workspace.list.queryOptions());

  return (
    <div className="flex h-screen w-full">
      <div className="flex h-full w-16 flex-col items-center border-r border-border bg-secondary px-2 py-3">
        <HydrateClient client={queryClient}>
          <WorkspaceList />
        </HydrateClient>

        <div className="mt-4">
          <CreateWorkspace />
        </div>

        <div className="mt-auto">
          <HydrateClient client={queryClient}>
            <UserNav />
          </HydrateClient>
        </div>
      </div>

      {children}
    </div>
  );
};

export default WorkspaceIdLayout;
