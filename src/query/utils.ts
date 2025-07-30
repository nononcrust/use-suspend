type QueryResult<TData, TError = unknown> =
  | { status: "idle" }
  | { status: "pending"; promise: Promise<TData> }
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
    result: { status: "idle" },
    listeners: new Set<() => void>(),
  };

  const listeners = entry.listeners;

  if (!queryCacheEntry) {
    queryCache.set(queryOptions.key, entry);
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

  const fetchOptimistic = <TData>(options: QueryOptions<TData>) => {
    const existingEntry = queryCache.get(options.key);

    if (existingEntry && existingEntry.result.status === "pending") {
      return existingEntry.result.promise;
    }

    const fetchPromise = new Promise<TData>((resolve, reject) => {
      options
        .queryFn()
        .then((data) => {
          resolve(data);
          entry.result = { status: "resolved", data };
          notifyListeners();
        })
        .catch((error) => {
          reject(error);
          entry.result = { status: "rejected", error };
          notifyListeners();
        });
    });

    entry.result = { status: "pending", promise: fetchPromise };
    notifyListeners();

    return fetchPromise;
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
