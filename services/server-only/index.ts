import "server-only";
import { createSafeAction } from "next-safe-fetch";

export const authenticatedAction = createSafeAction.setMiddleware(async () => {
  // verify auth
  return {
    success: true,
  };
});
