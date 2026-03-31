import z from "zod";
import { streamText } from "ai";
import { streamToEventIterator } from "@orpc/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import prisma from "@/lib/db";
import { base } from "@/app/middlewares/base";
import { requireAuthMiddleware } from "@/app/middlewares/auth";
import { requiredWorkspaceMiddleware } from "@/app/middlewares/workspace";
import { tiptapJsonToMarkdown } from "@/lib/json-to-markdown";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const MODEL_ID = "openai/gpt-oss-20b:free";

const model = openrouter.chat(MODEL_ID);

export const generateThreadSummary = base
  .use(requireAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .route({
    method: "POST",
    path: "/ai/thread/summary",
    summary: "Generate thread summary",
    description: "Generate thread summary",
    tags: ["AI"],
  })
  .input(
    z.object({
      messageId: z.string(),
    }),
  )
  .handler(async ({ input, context, errors }) => {
    const baseMessage = await prisma.message.findFirst({
      where: {
        id: input.messageId,
        channel: {
          workspaceId: context.workspace.orgCode,
        },
      },
      select: {
        id: true,
        threadId: true,
        channelId: true,
      },
    });

    if (!baseMessage) {
      throw errors.NOT_FOUND();
    }

    const parentId = baseMessage.threadId ?? baseMessage.id;

    const parent = await prisma.message.findFirst({
      where: {
        id: parentId,
        channel: {
          workspaceId: context.workspace.orgCode,
        },
      },
      select: {
        id: true,
        content: true,
        authorName: true,
        replies: {
          select: {
            id: true,
            content: true,
            authorName: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        createdAt: true,
      },
    });

    if (!parent) {
      throw errors.NOT_FOUND();
    }

    const replies = parent.replies.slice().reverse();
    const parentText = await tiptapJsonToMarkdown(parent.content);
    const lines = [];

    lines.push(
      `Thread Root - ${parent.authorName} - ${parent.createdAt.toISOString()}`,
    );
    lines.push(parentText);

    if (replies.length > 0) {
      lines.push("\nReplies");

      for (const reply of replies) {
        const replyText = await tiptapJsonToMarkdown(reply.content);
        lines.push(
          `- ${reply.authorName} - ${reply.createdAt.toISOString()}: ${replyText}`,
        );
      }
    }

    const markdown = lines.join("\n");

    const system = [
      "You are an expert assistant summarizing Slack-like discussion threads for a product team.",
      "Use only the provided thread content; do not invent facts, names, or timelines.",
      "Output format (Markdown):",
      "- First, write a concise paragraph (2-4 sentences) that captures the thread's purpose, key decisions, context, and any blockers or next steps. No heading, no list, no intro text.",
      "- Then add a blank line followed by exactly 2-3 bullet points (using '-') with the most important takeaways. Each bullet is one sentence.",
      "Style: neutral, specific, and concise. Preserve terminology from the thread (names, acronyms). Avoid filler or meta-commentary. Do not add a closing sentence.",
      "If the context is insufficient, return a single-sentence summary and omit the bullet list.",
    ].join("\n");

    const result = streamText({
      model,
      system,
      messages: [
        {
          role: "user",
          content: markdown,
        },
      ],
      temperature: 0.2,
    });

    return streamToEventIterator(result.toUIMessageStream());
  });
