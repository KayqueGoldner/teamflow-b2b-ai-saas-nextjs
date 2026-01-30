import { MessageSquareTextIcon, PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface MessageHoverToolbarProps {
  messageId: string;
  canEdit: boolean;
  onEdit: () => void;
}

export const MessageHoverToolbar = ({
  messageId,
  canEdit,
  onEdit,
}: MessageHoverToolbarProps) => {
  return (
    <div className="absolute -top-3 -right-2 items-center gap-1 rounded-md border border-gray-200 bg-white/95 px-1.5 py-1 opacity-0 shadow-sm backdrop-blur transition-opacity group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-900/90">
      {canEdit && (
        <Button size="icon" variant="ghost" onClick={onEdit}>
          <PencilIcon className="size-4" />
        </Button>
      )}
      <Button size="icon" variant="ghost">
        <MessageSquareTextIcon className="size-4" />
      </Button>
    </div>
  );
};
