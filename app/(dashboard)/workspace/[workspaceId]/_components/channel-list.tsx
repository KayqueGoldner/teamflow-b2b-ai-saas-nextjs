"use client";

import Link from "next/link";
import { HashIcon } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";

export const ChannelList = () => {
  const { data } = useSuspenseQuery(orpc.channel.list.queryOptions());
  const { workspaceId, channelId } = useParams<{
    workspaceId: string;
    channelId: string;
  }>();

  return (
    <div className="space-y-0.5 py-1">
      {data.channels.map((channel) => {
        const isActive = channel.id === channelId;

        return (
          <Link
            key={channel.id}
            href={`/workspace/${workspaceId}/channel/${channel.id}`}
            className={buttonVariants({
              variant: "ghost",
              className: cn(
                "h-7 w-full justify-start px-2 py-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-accent text-accent-foreground",
              ),
            })}
          >
            <HashIcon className="size-4" />
            <span className="truncate">{channel.name}</span>
          </Link>
        );
      })}
    </div>
  );
};
