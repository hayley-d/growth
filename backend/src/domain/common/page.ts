export type PageRequest = {
  skip: number;
  take: number;
};

export type Page<Item> = {
  items: Item[];
  total: number;
};
