import type { Page, PageRequest } from "@/domain/common/page";

export type Repository<Entity, NewEntity, Changes, Key = string> = {
  findById(key: Key): Promise<Entity | null>;
  list(page: PageRequest): Promise<Page<Entity>>;
  create(entity: NewEntity): Promise<Entity>;
  update(key: Key, changes: Changes): Promise<Entity>;
  delete(key: Key): Promise<void>;
};
