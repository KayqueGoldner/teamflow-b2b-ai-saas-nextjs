import { useState } from "react";
import { UsersIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { organization_user } from "@kinde/management-api-js";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { orpc } from "@/lib/orpc";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatar } from "@/lib/get-avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface MembersOverviewProps {}

export const MembersOverview = ({}: MembersOverviewProps) => {
  const [open, setOpen] = useState(false);

  const { data, isLoading, error } = useQuery(
    orpc.workspace.member.list.queryOptions(),
  );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const members = data ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <UsersIcon />
          Members
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[256px] p-0">
        <Command
          filter={(_, search, keywords) => {
            return keywords
              ?.map((keyword) => keyword.includes(search))
              .some((result) => !!result)
              ? 1
              : 0;
          }}
        >
          <CommandInput placeholder="Search..." />
          <CommandEmpty>
            {isLoading ? (
              <CommandItem>
                <MemberItemSkeleton />
              </CommandItem>
            ) : (
              "No members found."
            )}
          </CommandEmpty>
          <CommandList>
            <CommandGroup heading="Members">
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <CommandItem key={index}>
                      <MemberItemSkeleton />
                    </CommandItem>
                  ))
                : members.map((member) => (
                    <CommandItem
                      key={member.id}
                      keywords={[member.full_name, member.email] as string[]}
                    >
                      <MemberItem member={member} />
                    </CommandItem>
                  ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const MemberItem = ({ member }: { member: organization_user }) => {
  return (
    <div className="w-full cursor-pointer">
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarImage
            src={getAvatar(member.picture || null, member.email!)}
            alt={member.first_name || "member picture"}
            className="size-full object-cover"
          />
          <AvatarFallback>
            {member.full_name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium">{member.full_name}</p>
            <span className="inline-flex items-center rounded-md bg-primary/50 px-1.5 py-0.5 text-xs font-medium text-primary-foreground ring-1 ring-primary ring-inset">
              ADMIN
            </span>
          </div>

          <p className="truncate text-xs text-muted-foreground">
            {member.email}
          </p>
        </div>
      </div>
    </div>
  );
};

const MemberItemSkeleton = () => {
  return (
    <div className="w-full cursor-pointer">
      <div className="flex items-center gap-3">
        <Skeleton className="size-8 rounded-full bg-muted-foreground" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-24 bg-muted-foreground" />
          <Skeleton className="mt-1 h-3 w-32 bg-muted-foreground" />
        </div>
      </div>
    </div>
  );
};
