import z from "zod";

import prisma from "@/lib/db";
import { standardSecurityMiddleware } from "@/app/middlewares/arcjet/standard";
import { writeSecurityMiddleware } from "@/app/middlewares/arcjet/write";
import { requireAuthMiddleware } from "@/app/middlewares/auth";
import { base } from "@/app/middlewares/base";
import { requiredWorkspaceMiddleware } from "@/app/middlewares/workspace";
import { createMessageSchema } from "@/app/schemas/message";
import { getAvatar } from "@/lib/get-avatar";
import { Message } from "@/lib/generated/prisma/client";
import { readSecurityMiddleware } from "@/app/middlewares/arcjet/read";

export const createMessage = base
  .use(requireAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/messages",
    summary: "Create a new message",
    description: "Create a new message",
    tags: ["Messages"],
  })
  .input(createMessageSchema)
  .output(z.custom<Message>())
  .handler(async ({ input, context, errors }) => {
    if (!input.content) {
      throw errors.BAD_REQUEST();
    }

    const channel = await prisma.channel.findFirst({
      where: {
        id: input.channelId,
        workspaceId: context.workspace.orgCode,
      },
    });

    if (!channel) {
      throw errors.FORBIDDEN();
    }

    const message = await prisma.message.create({
      data: {
        content: input.content,
        imageUrl: input.imageUrl,
        channelId: input.channelId,
        authorId: context.user.id,
        authorEmail: context.user.email!,
        authorName: context.user.given_name ?? "John Doe",
        authorAvatar: getAvatar(context.user.picture, context.user.email!),
      },
    });

    return message;
  });

export const listMessages = base
  .use(requireAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(readSecurityMiddleware)
  .route({
    method: "GET",
    path: "/messages",
    summary: "List messages",
    description: "List messages",
    tags: ["Messages"],
  })
  .input(
    z.object({
      channelId: z.string(),
    }),
  )
  .output(z.custom<Message[]>())
  .handler(async ({ input, errors }) => {
    const channel = await prisma.channel.findFirst({
      where: {
        id: input.channelId,
      },
    });

    if (!channel) {
      throw errors.FORBIDDEN();
    }

    const messages = await prisma.message.findMany({
      where: {
        channelId: channel.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return messages;
  });
