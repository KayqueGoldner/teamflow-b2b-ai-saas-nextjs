"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, use } from "react";

import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  createMessageSchema,
  type CreateMessageSchemaType,
} from "@/app/schemas/message";
import { orpc } from "@/lib/orpc";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";

import { MessageComposer } from "./message-composer";

interface MessageInputFormProps {
  channelId: string;
}

export const MessageInputForm = ({ channelId }: MessageInputFormProps) => {
  const queryClient = useQueryClient();
  const [editorKey, setEditorKey] = useState(0);
  const attachmentUpload = useAttachmentUpload();

  const form = useForm<CreateMessageSchemaType>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      content: "",
      channelId,
    },
  });

  const createMessageMutation = useMutation(
    orpc.message.create.mutationOptions({
      onSuccess: () => {
        toast.success("Message sent successfully");
        form.reset();
        setEditorKey((prev) => prev + 1);
        attachmentUpload.onClear();

        queryClient.invalidateQueries({
          queryKey: orpc.message.list.key(),
        });
      },
      onError: () => {
        toast.error("Failed to send message");
      },
    }),
  );

  const onSubmit = (data: CreateMessageSchemaType) => {
    createMessageMutation.mutate({
      ...data,
      imageUrl: attachmentUpload.stagedUrl ?? undefined,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <form
        id="channel-message-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full"
      >
        <FieldGroup className="flex-1">
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <MessageComposer
                  key={editorKey}
                  field={field}
                  formId="channel-message-form"
                  ariaInvalid={fieldState.invalid}
                  disabled={createMessageMutation.isPending}
                  attachmentUpload={attachmentUpload}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    </div>
  );
};
