import { type ZodType, z } from "zod";

export const idParamSchema = z.object({
  id: z.uuid(),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const paginatedResponseSchema = <Item extends ZodType>(itemSchema: Item) =>
  z.object({
    items: z.array(itemSchema),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  });

export type IdParam = z.infer<typeof idParamSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type PaginatedResponse<Item> = {
  items: Item[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export const toSkipTake = ({ page, pageSize }: PaginationQuery) => ({
  skip: (page - 1) * pageSize,
  take: pageSize,
});

export const toPaginatedResponse = <Item>(
  items: Item[],
  total: number,
  { page, pageSize }: PaginationQuery,
): PaginatedResponse<Item> => ({
  items,
  page,
  pageSize,
  total,
  totalPages: Math.ceil(total / pageSize),
});
