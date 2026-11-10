import type { Context } from "hono";

import type { UpdateUserProfileRequest } from "@shared/schemas";
import type { UpdateProfile } from "@/application/user/commands/update-profile";
import type { GetMe } from "@/application/user/queries/get-me";

type UserControllerDependencies = {
  getMe: GetMe;
  updateProfile: UpdateProfile;
};

type UpdateProfileContext = Context<object, string, { out: { json: UpdateUserProfileRequest } }>;

export const createUserController = ({ getMe, updateProfile }: UserControllerDependencies) => ({
  getMe: async (context: Context) => context.json(await getMe()),
  updateProfile: async (context: UpdateProfileContext) =>
    context.json(await updateProfile(context.req.valid("json"))),
});

export type UserController = ReturnType<typeof createUserController>;
