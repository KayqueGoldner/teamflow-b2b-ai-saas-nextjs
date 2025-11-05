"use client";

import { CreditCardIcon, LogOutIcon, UserIcon } from "lucide-react";
import {
  LogoutLink,
  PortalLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { orpc } from "@/lib/orpc";
import { getAvatar } from "@/lib/get-avatar";

export const UserNav = () => {
  const {
    data: { user },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-12 rounded-xl border-border/50 bg-background/50 transition-all duration-200 hover:rounded-lg hover:bg-accent hover:text-accent-foreground"
        >
          <Avatar>
            <AvatarImage
              src={getAvatar(user.picture, user.email!)}
              alt={user.given_name!}
              className="object-cover"
            />
            <AvatarFallback>
              {user.given_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="right"
        sideOffset={8}
        className="w-[200px]"
      >
        <DropdownMenuLabel className="flex items-center gap-2 px-1 py-1.5 text-left text-sm font-normal">
          <Avatar className="relative size-8 rounded-lg">
            <AvatarImage
              src={getAvatar(user.picture, user.email!)}
              alt={user.given_name!}
              className="object-cover"
            />
            <AvatarFallback>
              {user.given_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <p className="truncate">{user.given_name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <PortalLink>
              <UserIcon />
              Account
            </PortalLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <PortalLink>
              <CreditCardIcon />
              Billing
            </PortalLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink>
            <LogOutIcon />
            Logout
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
