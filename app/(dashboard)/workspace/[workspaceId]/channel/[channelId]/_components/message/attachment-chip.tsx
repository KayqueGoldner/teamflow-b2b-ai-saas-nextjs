import { XIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

interface AttachmentChipProps {
  url: string;
  onClear: () => void;
}

export const AttachmentChip = ({ url, onClear }: AttachmentChipProps) => {
  return (
    <div className="group relative size-12 overflow-hidden rounded-md bg-muted">
      <Image
        src={url}
        alt="attachment"
        className="object-cover transition-opacity group-hover:opacity-50"
        fill
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          type="button"
          variant="destructive"
          className="size-6"
          onClick={onClear}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};
