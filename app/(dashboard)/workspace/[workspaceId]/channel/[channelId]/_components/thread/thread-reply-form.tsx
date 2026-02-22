"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  createMessageSchema,
  CreateMessageSchemaType,
} from "@/app/schemas/message";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";
import { orpc } from "@/lib/orpc";

import { MessageComposer } from "../message/message-composer";

interface ThreadReplyFormProps {
  threadId: string;
}

export const ThreadReplyForm = ({ threadId }: ThreadReplyFormProps) => {
  const { channelId } = useParams<{ channelId: string }>();
  const upload = useAttachmentUpload();
  const [editorKey, setEditorKey] = useState(0);

  const form = useForm<CreateMessageSchemaType>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      content: "",
      channelId: channelId,
      threadId: threadId,
    },
  });

  useEffect(() => {
    form.setValue("threadId", threadId);
  }, [threadId, form]);

  const createMessage = useMutation(
    orpc.message.create.mutationOptions({
      onSuccess: () => {
        form.reset({ channelId, threadId, content: "" });
        upload.onClear();
        setEditorKey((prev) => prev + 1);
        toast.success("Message created successfully");
      },
      onError: () => {
        return toast.error("Failed to create message");
      },
    }),
  );

  const onSubmit = (data: CreateMessageSchemaType) => {
    createMessage.mutate({
      ...data,
      imageUrl: upload.stagedUrl ?? undefined,
    });
  };

  return (
    <form id="thread-reply-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <MessageComposer
                key={editorKey}
                field={field}
                formId="thread-reply-form"
                ariaInvalid={fieldState.invalid}
                attachmentUpload={upload}
                disabled={createMessage.isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
};
