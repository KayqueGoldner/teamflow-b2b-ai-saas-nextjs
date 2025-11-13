"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { channelNameSchema, transformChannelName } from "@/app/schemas/channel";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface CreateNewChannelProps {}

export const CreateNewChannel = ({}: CreateNewChannelProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof channelNameSchema>>({
    resolver: zodResolver(channelNameSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof channelNameSchema>) => {
    console.log(data);
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
            <Button type="submit" form="channel-form">
              Create Channel
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
