import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

import { base } from "@/app/middlewares/base";
import arcjet, { sensitiveInfo, slidingWindow } from "@/lib/arcjet";

const buildStandardAj = () =>
  arcjet
    .withRule(
      slidingWindow({
        mode: "LIVE",
        interval: "1m",
        max: 2,
      }),
    )
    .withRule(
      sensitiveInfo({
        mode: "LIVE",
        deny: ["PHONE_NUMBER", "CREDIT_CARD_NUMBER"],
      }),
    );

export const heavyWriteSecurityMiddleware = base
  .$context<{
    request: Request;
    user: KindeUser<Record<string, unknown>>;
  }>()
  .middleware(async ({ context, next, errors }) => {
    const decision = await buildStandardAj().protect(context.request, {
      userId: context.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw errors.RATE_LIMITED({
          message: "Too many requests. Please slow down.",
        });
      }

      if (decision.reason.isSensitiveInfo()) {
        throw errors.BAD_REQUEST({
          message:
            "Sensitive information detected. Please remove it and try again.",
        });
      }

      throw errors.FORBIDDEN({
        message: "Request blocked by security policy",
      });
    }

    return next();
  });
