import { AsyncLocalStorage } from "node:async_hooks";

export type RequestContext = {
  requestId: string;
  userId?: string;
  state: Map<string, unknown>;
};

const storage = new AsyncLocalStorage<RequestContext>();

export const requestContext = {
  run: <Result>(context: Omit<RequestContext, "state">, callback: () => Result): Result =>
    storage.run({ ...context, state: new Map() }, callback),
  getRequestId: () => storage.getStore()?.requestId,
  getUserId: () => storage.getStore()?.userId,
  setUserId: (userId: string) => {
    const store = storage.getStore();
    if (store) store.userId = userId;
  },
  getState: <Value>(key: string) => storage.getStore()?.state.get(key) as Value | undefined,
  setState: (key: string, value: unknown) => {
    storage.getStore()?.state.set(key, value);
  },
};
