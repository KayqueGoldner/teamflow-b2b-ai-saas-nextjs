import { ThemeToggle } from "@/components/ui/theme-toggle";

import { InviteMember } from "./member/invite-member";
import { MembersOverview } from "./member/members-overview";

interface ChannelHeaderProps {
  channelName: string;
}

export const ChannelHeader = ({ channelName }: ChannelHeaderProps) => {
  return (
    <div className="flex h-14 items-center justify-between border-b px-4">
      <h1 className="text-lg font-semibold">#{channelName}</h1>

      <div className="flex items-center space-x-3">
        <MembersOverview />
        <InviteMember />
        <ThemeToggle />
      </div>
    </div>
  );
};
