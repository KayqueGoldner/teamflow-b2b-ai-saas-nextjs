import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HashIcon } from "lucide-react";
import Link from "next/link";

const CHANNEL_LIST = [
  {
    id: 1,
    name: "General",
  },
  {
    id: 2,
    name: "Random",
  },
  {
    id: 3,
    name: "Announcements",
  },
  {
    id: 4,
    name: "Code",
  },
  {
    id: 5,
    name: "Testing",
  },
];

export const ChannelList = () => {
  return (
    <div className="space-y-0.5 py-1">
      {CHANNEL_LIST.map((channel) => (
        <Link
          key={channel.id}
          href="#"
          className={buttonVariants({
            variant: "ghost",
            className: cn(
              "h-7 w-full justify-start px-2 py-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            ),
          })}
        >
          <HashIcon className="size-4" />
          <span className="truncate">{channel.name}</span>
        </Link>
      ))}
    </div>
  );
};
