export const groupBy = <Item>(items: readonly Item[], keyOf: (item: Item) => string) => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const key = keyOf(item);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return groups;
};
