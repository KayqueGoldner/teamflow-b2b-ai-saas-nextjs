import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatar } from "@/lib/get-avatar";

const MEMBERS = [
  {
    id: 1,
    name: "John Doe",
    imageUrl: getAvatar(null, "john.doe@example.com"),
    email: "john.doe@example.com",
  },
  {
    id: 2,
    name: "Jane Doe",
    imageUrl: getAvatar(null, "jane.doe@example.com"),
    email: "jane.doe@example.com",
  },
  {
    id: 3,
    name: "Bob Smith",
    imageUrl: getAvatar(null, "bob.smith@example.com"),
    email: "bob.smith@example.com",
  },
  {
    id: 4,
    name: "Alice Johnson",
    imageUrl: getAvatar(null, "alice.johnson@example.com"),
    email: "alice.johnson@example.com",
  },
];

export const WorkspaceMembersList = () => {
  return (
    <div className="space-y-0.5 py-1">
      {MEMBERS.map((member) => (
        <div
          key={member.id}
          className="flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-accent"
        >
          <div className="relative">
            <Avatar className="relative size-8">
              <Image
                src={member.imageUrl}
                alt={member.name}
                className="object-cover"
                fill
              />
              <AvatarFallback>
                {member.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{member.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {member.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
