# Lib

TanStack Query hooks, the query client and small utilities.

## Where things go

```
lib/
  queries/<name>.queries.ts      read hooks for one feature
  mutations/<name>.mutations.ts  write hooks for one feature
  query-client.ts                the one QueryClient
  utils.ts                       cn() for class names
```

Export every new file from `queries/index.ts` or `mutations/index.ts`.

## Queries

Copy `queries/health.queries.ts`:

- Export a key object named `<name>QueryKeys`. Start with `all: ["<name>"] as const` and build the others from it: `detail: (id: string) => [...courseQueryKeys.all, id] as const`.
- Name hooks `use<Thing>Query`. Return the whole `useQuery` result, don't unpack it.
- The `queryFn` is a service function from `@/services/<name>-service`. Never call axios here.

## Mutations

- Name hooks `use<Thing>Mutation`. Return the whole `useMutation` result.
- The `mutationFn` is a service function.
- In `onSuccess`, invalidate with the keys from the matching queries file: `queryClient.invalidateQueries({ queryKey: courseQueryKeys.all })`. Never type a key array by hand.
- Get the client with `useQueryClient()` inside the hook.

## Query client

`query-client.ts` sets a 60 second `staleTime` and `retryUnlessUnauthorized` for all queries. Change defaults there, not per hook, unless one query really needs something else.

## What doesn't go here

- No components and no JSX.
- No client-only state. That's `stores/`.
- No API calls outside a service.
- Helpers used by one feature stay next to that feature. Only add to `utils.ts` when several places need it.

Keep this file current: update it in the same commit when you add a folder here or change the key or hook pattern.
