"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isDefinedError } from "@orpc/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  channelNameSchema,
  ChannelNameSchemaType,
  transformChannelName,
} from "@/app/schemas/channel";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { orpc } from "@/lib/orpc";

interface CreateNewChannelProps {}

export const CreateNewChannel = ({}: CreateNewChannelProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<ChannelNameSchemaType>({
    resolver: zodResolver(channelNameSchema),
    defaultValues: {
      name: "",
    },
  });

  const createChannelMutation = useMutation(
    orpc.channel.create.mutationOptions({
      onSuccess: (newChannel) => {
        toast.success(`Channel ${newChannel.name} created`);
        queryClient.invalidateQueries({
          queryKey: orpc.channel.list.queryKey(),
        });
        form.reset();
        setOpen(false);
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error(error.message);
          return;
        }

        toast.error("Failed to create channel");
      },
    }),
  );

  const onSubmit = (data: ChannelNameSchemaType) => {
    createChannelMutation.mutate(data);
  };

  const watchedName = form.watch("name");
  const transformedName = watchedName ? transformChannelName(watchedName) : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <PlusIcon className="size-4" />
          Add Channel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Channel</DialogTitle>
          <DialogDescription>
            Create a new channel to start a conversation with your team.
          </DialogDescription>
        </DialogHeader>

        <form id="channel-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-channel-name">
                    Channel Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-channel-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. general, random, etc."
                    autoComplete="off"
                  />
                  <FieldDescription>
                    Will be:{" "}
                    <span className="rounded-sm bg-muted px-1 leading-loose font-medium text-white">
                      {transformedName}
                    </span>
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Field orientation="horizontal" className="justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="channel-form"
              disabled={createChannelMutation.isPending}
            >
              {createChannelMutation.isPending
                ? "Creating..."
                : "Create Channel"}
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
