import { useCallback, useMemo, useState } from "react";

export const useAttachmentUpload = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stagedUrl, setStagedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onUploadComplete = useCallback((url: string) => {
    setStagedUrl(url);
    setIsUploading(false);
    setIsOpen(false);
  }, []);

  const onClear = useCallback(() => {
    setStagedUrl(null);
    setIsUploading(false);
  }, []);

  return useMemo(
    () => ({
      isOpen,
      setIsOpen,
      stagedUrl,
      isUploading,
      onUploadComplete,
      onClear,
    }),
    [isOpen, setIsOpen, stagedUrl, isUploading, onUploadComplete, onClear],
  );
};

export type AttachmentUpload = ReturnType<typeof useAttachmentUpload>;
