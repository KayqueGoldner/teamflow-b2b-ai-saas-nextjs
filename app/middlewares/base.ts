import { os } from "@orpc/server";

export const base = os.$context<{ request: Request }>().errors({
  RATE_LIMITED: {
    message: "Rate limited. Please try again later.",
  },
  BAD_REQUEST: {
    message: "Bad request.",
  },
  NOT_FOUND: {
    message: "Not found.",
  },
  FORBIDDEN: {
    message: "Forbidden.",
  },
  UNAUTHORIZED: {
    message: "Unauthorized.",
  },
  INTERNAL_SERVER_ERROR: {
    message: "Internal server error.",
  },
});
