"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  createMessageSchema,
  type CreateMessageSchemaType,
} from "@/app/schemas/message";
import { orpc } from "@/lib/orpc";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";
import { Message } from "@/lib/generated/prisma/client";
import { getAvatar } from "@/lib/get-avatar";

import { MessageComposer } from "./message-composer";

interface MessageInputFormProps {
  channelId: string;
  user: KindeUser<Record<string, unknown>>;
}

type MessagePage = {
  items: Message[];
  nextCursor?: string;
};

type InfiniteMessages = InfiniteData<MessagePage>;

export const MessageInputForm = ({
  channelId,
  user,
}: MessageInputFormProps) => {
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
      onMutate: async (data) => {
        // Cancel any pending queries
        await queryClient.cancelQueries({
          queryKey: ["message.list", channelId],
        });

        // Get the previous data
        const previousData = queryClient.getQueryData<InfiniteMessages>([
          "message.list",
          channelId,
        ]);

        // Create a temporary ID for optimistic update
        const tempId = `optimistic-${crypto.randomUUID()}`;

        // Create the optimistic message
        const optimisticMessage: Message = {
          id: tempId,
          content: data.content,
          imageUrl: data.imageUrl ?? null,
          authorId: user.id,
          authorEmail: user.email!,
          authorName: user.given_name ?? "John Doe",
          authorAvatar: getAvatar(user.picture, user.email!),
          channelId: channelId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Update the query data with the optimistic message
        queryClient.setQueryData<InfiniteMessages>(
          ["message.list", channelId],
          (prevData) => {
            // If there is no previous data, create a new infinite data object
            if (!prevData) {
              return {
                pages: [
                  {
                    items: [optimisticMessage],
                    nextCursor: undefined,
                  },
                ],
                pageParams: [undefined],
              } satisfies InfiniteMessages;
            }

            // If there is previous data, update the first page
            const firstPage = prevData.pages[0] ?? {
              items: [],
              nextCursor: undefined,
            };

            // Update the first page with the optimistic message
            const updatedFirstPage: MessagePage = {
              ...firstPage,
              items: [optimisticMessage, ...firstPage.items],
            };

            // Return the updated infinite data object
            return {
              ...prevData,
              pages: [updatedFirstPage, ...prevData.pages.slice(1)],
            };
          },
        );

        return {
          previousData,
          tempId,
        };
      },
      onSuccess: (data, _variables, context) => {
        // Update the query data with the actual message
        queryClient.setQueryData<InfiniteMessages>(
          ["message.list", channelId],
          (prevData) => {
            if (!prevData) return prevData;

            // Update the pages with the actual message
            const updatedPages = prevData.pages.map((page) => ({
              ...page,
              items: page.items.map((message) =>
                message.id === context.tempId
                  ? {
                      ...data,
                    }
                  : message,
              ),
            }));

            return {
              ...prevData,
              pages: updatedPages,
            };
          },
        );

        toast.success("Message sent successfully");
        form.reset();
        setEditorKey((prev) => prev + 1);
        attachmentUpload.onClear();
      },
      onError: (_error, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData<InfiniteMessages>(
            ["message.list", channelId],
            context.previousData,
          );
        }

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
