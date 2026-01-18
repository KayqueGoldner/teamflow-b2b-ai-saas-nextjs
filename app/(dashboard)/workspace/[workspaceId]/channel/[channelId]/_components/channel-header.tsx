import { ThemeToggle } from "@/components/ui/theme-toggle";

interface ChannelHeaderProps {
  channelName: string;
}

export const ChannelHeader = ({ channelName }: ChannelHeaderProps) => {
  return (
    <div className="flex h-14 items-center justify-between border-b px-4">
      <h1 className="text-lg font-semibold">#{channelName}</h1>

      <div className="flex items-center space-x-2">
        <ThemeToggle />
      </div>
    </div>
  );
};
