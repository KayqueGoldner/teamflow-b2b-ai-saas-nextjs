import { ImageIcon, SendIcon } from "lucide-react";

import { CreateMessageSchemaType } from "@/app/schemas/message";
import { RichTextEditorFieldType } from "@/components/rich-text-editor/editor";
import { RichTextEditor } from "@/components/rich-text-editor/editor";
import { Button } from "@/components/ui/button";

interface MessageComposerProps {
  field: RichTextEditorFieldType<CreateMessageSchemaType, "content">;
  formId: string;
  ariaInvalid: boolean;
  disabled: boolean;
}

export const MessageComposer = ({
  field,
  formId,
  ariaInvalid,
  disabled,
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
            type="button"
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
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={disabled}
            aria-invalid={ariaInvalid}
          >
            <ImageIcon className="mr-1 size-4" />
            Attach
          </Button>
        }
      />
    </>
  );
};
