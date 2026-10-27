import type { Page, PageRequest } from "@/domain/common/page";
import type { User } from "@/domain/user/user";

export type UserRepository = {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  list(page: PageRequest): Promise<Page<User>>;
};
