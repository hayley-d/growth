import type { Context } from "hono";

import type { UpdateUserProfileRequest } from "@shared/schemas";
import type { UpdateProfile } from "@/application/user/commands/update-profile";

type UserControllerDependencies = {
  updateProfile: UpdateProfile;
};

type UpdateProfileContext = Context<object, string, { out: { json: UpdateUserProfileRequest } }>;

export const createUserController = ({ updateProfile }: UserControllerDependencies) => ({
  updateProfile: async (context: UpdateProfileContext) =>
    context.json(await updateProfile(context.req.valid("json"))),
});

export type UserController = ReturnType<typeof createUserController>;
