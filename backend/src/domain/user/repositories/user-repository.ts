import type { Repository } from "@/domain/common/repository";
import type { NewUser, User, UserChanges } from "@/domain/user/user";

export type UserRepository = Repository<User, NewUser, UserChanges> & {
  findByEmail(email: string): Promise<User | null>;
};
