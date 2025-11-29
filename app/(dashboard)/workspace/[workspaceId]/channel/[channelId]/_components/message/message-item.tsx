import Image from "next/image";

interface MessageItemProps {
  id: number;
  message: string;
  date: Date;
  avatar: string;
  userName: string;
}

export const MessageItem = ({
  avatar,
  userName,
  message,
  date,
  id,
}: MessageItemProps) => {
  return (
    <div className="group relative flex gap-x-3 rounded-lg p-3 hover:bg-muted/50">
      <Image
        src={avatar}
        alt="user avatar"
        width={32}
        height={32}
        className="size-8 rounded-lg"
      />

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-x-2">
          <p className="leading-none font-medium">{userName}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {new Intl.DateTimeFormat("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(date)}{" "}
            {new Intl.DateTimeFormat("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }).format(date)}
          </p>
        </div>

        <p className="max-w-none text-sm break-words">{message}</p>
      </div>
    </div>
  );
};
