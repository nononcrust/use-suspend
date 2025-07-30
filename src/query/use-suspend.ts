import { useState, useSyncExternalStore } from "react";
import { createQueryObserver, type QueryOptions } from "./utils";

export const useSuspend = <TData>(
  queryOptions: QueryOptions<TData>
): {
  data: TData;
} => {
  const [observer] = useState(() => createQueryObserver(queryOptions));

  useSyncExternalStore(observer.subscribe, () => observer.getCurrentResult());

  const result = observer.getCurrentResult();

  if (result.status === "idle" || result.status === "pending") {
    throw observer.fetchOptimistic(queryOptions);
  }

  if (result.status === "rejected") {
    throw result.error;
  }

  return {
    data: result.data,
  };
};
