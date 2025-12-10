"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  createMessageSchema,
  type CreateMessageSchemaType,
} from "@/app/schemas/message";
import { orpc } from "@/lib/orpc";

import { MessageComposer } from "./message-composer";

interface MessageInputFormProps {
  channelId: string;
}

export const MessageInputForm = ({ channelId }: MessageInputFormProps) => {
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
      },
      onError: () => {
        toast.error("Failed to send message");
      },
    }),
  );

  const onSubmit = (data: CreateMessageSchemaType) => {
    createMessageMutation.mutate(data);
  };

  return (
    <div className="flex items-center gap-2">
      <form
        id="channel-form"
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
                  field={field}
                  formId="channel-form"
                  ariaInvalid={fieldState.invalid}
                  disabled={createMessageMutation.isPending}
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
