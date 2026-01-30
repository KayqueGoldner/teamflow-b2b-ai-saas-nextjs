"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  updateMessageSchema,
  UpdateMessageSchemaType,
} from "@/app/schemas/message";
import { Field, FieldGroup, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/rich-text-editor/editor";
import { Message } from "@/lib/generated/prisma/client";
import { orpc } from "@/lib/orpc";

interface EditMessageProps {
  message: Message;
  onCancel: () => void;
  onSave: () => void;
}

export const EditMessage = ({
  message,
  onCancel,
  onSave,
}: EditMessageProps) => {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(updateMessageSchema),
    defaultValues: {
      messageId: message.id,
      content: message.content,
    },
  });

  const updateMutation = useMutation(
    orpc.message.update.mutationOptions({
      onSuccess: (updated) => {
        type MessagePage = {
          items: Message[];
          nextCursor?: string;
        };
        type InfiniteMessages = InfiniteData<MessagePage>;

        queryClient.setQueryData<InfiniteMessages>(
          ["message.list", message.channelId],
          (old) => {
            if (!old) return old;

            const updatedMessage = updated.message;

            const pages = old.pages.map((page) => {
              return {
                ...page,
                items: page.items.map((item) =>
                  updatedMessage.id === item.id
                    ? { ...item, ...updatedMessage }
                    : item,
                ),
              };
            });

            return {
              ...old,
              pages,
            };
          },
        );

        toast.success("Message updated successfully");
        onSave();
      },
      onError: (error) => {
        console.error(error);
        toast.error(error.message);
        onCancel();
      },
    }),
  );

  const onSubmit = (values: UpdateMessageSchemaType) => {
    updateMutation.mutate(values);
  };

  return (
    <div>
      <form
        id="edit-message-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full"
      >
        <FieldGroup className="flex-1">
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <RichTextEditor
                  field={field}
                  sendButton={
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={updateMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        type="submit"
                        form="edit-message-form"
                        disabled={updateMutation.isPending}
                      >
                        {updateMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  }
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
