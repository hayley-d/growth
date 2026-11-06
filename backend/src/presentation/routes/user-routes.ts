import { Hono } from "hono";

import { updateUserProfileRequestSchema } from "@shared/schemas";
import type { UserController } from "@/presentation/controllers/user-controller";
import { requireAuth } from "@/presentation/middleware/require-role";
import { validate } from "@/presentation/middleware/validate-request";

export const createUserRoutes = (userController: UserController) =>
  new Hono()
    .use(requireAuth)
    .patch("/profile", validate("json", updateUserProfileRequestSchema), (context) =>
      userController.updateProfile(context),
    );
