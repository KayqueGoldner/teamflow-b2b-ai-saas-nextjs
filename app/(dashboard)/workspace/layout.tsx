import { WorkspaceList } from "./_components/workspace-list";
import { CreateWorkspace } from "./_components/create-workspace";
import { UserNav } from "./_components/user-nav";

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  return (
    <div className="flex h-screen w-full">
      <div className="flex h-full w-16 flex-col items-center border-r border-border bg-secondary px-2 py-3">
        <WorkspaceList />

        <div className="mt-4">
          <CreateWorkspace />
        </div>

        <div className="mt-auto">
          <UserNav />
        </div>
      </div>

      {children}
    </div>
  );
};

export default WorkspaceIdLayout;
