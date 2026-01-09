import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UploadDropzone } from "@/lib/uploadthing";

interface ImageUploadModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onUploadComplete: (url: string) => void;
}

export const ImageUploadModal = ({
  isOpen,
  setIsOpen,
  onUploadComplete,
}: ImageUploadModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <UploadDropzone
          className="rounded-lg border ut-button:bg-primary ut-button:text-primary-foreground ut-allowed-content:text-xs ut-allowed-content:text-muted-foreground ut-label:text-sm ut-label:text-muted-foreground ut-ready:border-border ut-ready:bg-card ut-ready:text-foreground ut-uploading:border-border ut-uploading:bg-muted ut-uploading:text-muted-foreground ut-uploading:opacity-90"
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            const url = res?.[0].ufsUrl;

            onUploadComplete(url);

            toast.success("Image uploaded successfully");
          }}
          onUploadError={(error) => {
            toast.error(error?.message || "Something went wrong");
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
