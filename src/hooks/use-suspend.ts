export const useSuspend = ({
  shouldSuspend,
  promiseFunction,
}: {
  shouldSuspend: boolean;
  promiseFunction: () => Promise<void>;
}) => {
  if (shouldSuspend) {
    throw promiseFunction();
  }
};
