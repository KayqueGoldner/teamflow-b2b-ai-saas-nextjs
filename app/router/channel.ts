import z from "zod";

import { heavyWriteSecurityMiddleware } from "@/app/middlewares/arcjet/heavy-write";
import { standardSecurityMiddleware } from "@/app/middlewares/arcjet/standard";
import { requireAuthMiddleware } from "@/app/middlewares/auth";
import { base } from "@/app/middlewares/base";
import { requiredWorkspaceMiddleware } from "@/app/middlewares/workspace";
import { channelNameSchema } from "@/app/schemas/channel";
import prisma from "@/lib/db";
import { Channel } from "@/lib/generated/prisma/client";

export const createChannel = base
  .use(requireAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: "POST",
    path: "/channels",
    summary: "Create a new channel",
    tags: ["channels"],
  })
  .input(channelNameSchema)
  .output(z.custom<Channel>())
  .handler(async ({ input, context }) => {
    const channel = await prisma.channel.create({
      data: {
        name: input.name,
        workspaceId: context.workspace.orgCode,
        createdById: context.user.id,
      },
    });

    return channel;
  });
