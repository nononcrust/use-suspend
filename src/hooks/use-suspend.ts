export const useSuspend = ({
  callback,
  shouldSuspend,
}: {
  callback: () => Promise<void>;
  shouldSuspend: boolean;
}) => {
  if (shouldSuspend) {
    throw callback();
  }
};
