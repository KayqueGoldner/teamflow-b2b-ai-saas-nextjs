import { ImageIcon, SendIcon } from "lucide-react";

import { CreateMessageSchemaType } from "@/app/schemas/message";
import { RichTextEditorFieldType } from "@/components/rich-text-editor/editor";
import { RichTextEditor } from "@/components/rich-text-editor/editor";
import { Button } from "@/components/ui/button";
import { ImageUploadModal } from "@/components/rich-text-editor/image-upload-modal";
import { type AttachmentUpload } from "@/hooks/use-attachment-upload";

import { AttachmentChip } from "./attachment-chip";

interface MessageComposerProps {
  field: RichTextEditorFieldType<CreateMessageSchemaType, "content">;
  formId: string;
  ariaInvalid: boolean;
  disabled: boolean;
  attachmentUpload: AttachmentUpload;
}

export const MessageComposer = ({
  field,
  formId,
  ariaInvalid,
  disabled,
  attachmentUpload,
}: MessageComposerProps) => {
  return (
    <>
      <RichTextEditor
        field={{
          onChange: field.onChange,
          onBlur: field.onBlur,
          value: field.value,
          name: field.name,
          ref: field.ref,
          disabled: field.disabled,
        }}
        sendButton={
          <Button
            type="submit"
            size="sm"
            form={formId}
            disabled={disabled}
            aria-invalid={ariaInvalid}
          >
            <SendIcon className="mr-1 size-4" />
            Send
          </Button>
        }
        footerLeft={
          attachmentUpload.stagedUrl ? (
            <AttachmentChip
              url={attachmentUpload.stagedUrl}
              onClear={attachmentUpload.onClear}
            />
          ) : (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={disabled}
              aria-invalid={ariaInvalid}
              onClick={() => attachmentUpload.setIsOpen(true)}
            >
              <ImageIcon className="mr-1 size-4" />
              Attach
            </Button>
          )
        }
      />

      <ImageUploadModal {...attachmentUpload} />
    </>
  );
};
