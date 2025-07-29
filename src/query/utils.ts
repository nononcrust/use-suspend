type QueryResult<TData, TError = unknown> =
  | { status: "pending" }
  | { status: "resolved"; data: TData }
  | { status: "rejected"; error: TError };

type QueryCacheEntry<TData> = {
  result: QueryResult<TData>;
  listeners: Set<() => void>;
};
type QueryCache = Map<string, QueryCacheEntry<unknown>>;

export type QueryOptions<TData> = {
  key: string;
  queryFn: () => Promise<TData>;
};

const createQueryCache = <TData>(): QueryCache => {
  return new Map<string, QueryCacheEntry<TData>>();
};

export const createQueryObserver = <TData>(
  queryOptions: QueryOptions<TData>
) => {
  const queryCacheEntry = queryCache.get(queryOptions.key);

  const entry = queryCacheEntry ?? {
    result: { status: "pending" },
    listeners: new Set<() => void>(),
  };

  const listeners = entry.listeners;

  if (!queryCacheEntry) {
    queryCache.set(queryOptions.key, {
      result: { status: "pending" },
      listeners,
    });
  }

  const subscribe = (listener: () => void) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  const notifyListeners = () => {
    listeners.forEach((listener) => listener());
  };

  const fetchOptimistic = async <TData>(options: QueryOptions<TData>) => {
    try {
      const data = await options.queryFn();
      entry.result = { status: "resolved", data };
    } catch (error) {
      entry.result = { status: "rejected", error };
    } finally {
      notifyListeners();
    }
  };

  const getCurrentResult = () => {
    return entry.result as QueryResult<TData>;
  };

  return {
    getCurrentResult,
    subscribe,
    notifyListeners,
    fetchOptimistic,
  };
};

export const queryCache = createQueryCache();
