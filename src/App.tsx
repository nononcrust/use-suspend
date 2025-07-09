import { Suspense, useState } from "react";
import { useSuspend } from "./hooks/use-suspend";

type Status = "idle" | "pending" | "resolved";

function App() {
  const [status, setSatus] = useState<Status>("idle");

  const promiseFunction = async () => {
    await sleep(1000);

    setSatus("resolved");
  };

  const triggerSuspense = () => {
    if (status === "pending") return;

    setSatus("pending");
  };

  return (
    <main>
      <button onClick={triggerSuspense}>서스펜스 트리거</button>
      <Suspense fallback={<div>서스펜스 중...</div>}>
        <Content
          shouldSuspend={status === "pending"}
          promiseFunction={promiseFunction}
        />
      </Suspense>
    </main>
  );
}

type ContentProps = {
  shouldSuspend: boolean;
  promiseFunction: () => Promise<void>;
};

const Content = ({ shouldSuspend, promiseFunction }: ContentProps) => {
  useSuspend({
    shouldSuspend,
    promiseFunction,
  });

  return <div>컨텐츠</div>;
};

export default App;

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
