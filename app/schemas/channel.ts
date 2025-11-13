import * as z from "zod";

export function transformChannelName(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-") // replace spaces with dashes
    .replace(/[^a-z0-9-]/g, "") // remove invalid characters
    .replace(/-+/g, "-") // replace multiple dashes with a single dash
    .replace(/^-|-$/g, ""); // remove leading or trailing dashes
}

export const channelNameSchema = z.object({
  name: z
    .string()
    .min(2, "Channel name is required")
    .max(50, "Channel name must be 50 characters or less")
    .transform((name, ctx) => {
      const transformed = transformChannelName(name);

      if (transformed.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "Channel name must be at least 2 characters long",
        });

        return z.NEVER;
      }

      return transformed;
    }),
});
