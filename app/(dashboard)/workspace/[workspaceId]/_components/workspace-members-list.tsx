"use client";

import Image from "next/image";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatar } from "@/lib/get-avatar";
import { orpc } from "@/lib/orpc";

export const WorkspaceMembersList = () => {
  const { data } = useSuspenseQuery(orpc.channel.list.queryOptions());

  return (
    <div className="space-y-0.5 py-1">
      {data.members.map((member) => (
        <div
          key={member.id}
          className="flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-accent"
        >
          <div className="relative">
            <Avatar className="relative size-8">
              <Image
                src={getAvatar(member.picture ?? null, member.email!)}
                alt={member.full_name ?? "user image"}
                className="object-cover"
                fill
              />
              <AvatarFallback>
                {member.full_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{member.full_name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {member.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
