import { Suspense, useState } from "react";
import { useSuspend } from "./hooks/use-suspend";

type Status = "idle" | "pending" | "resolved";

function App() {
  const [status, setSatus] = useState<Status>("idle");

  const suspendCallback = async () => {
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
          suspendCallback={suspendCallback}
        />
      </Suspense>
    </main>
  );
}

type ContentProps = {
  shouldSuspend: boolean;
  suspendCallback: () => Promise<void>;
};

const Content = ({ shouldSuspend, suspendCallback }: ContentProps) => {
  useSuspend({
    callback: suspendCallback,
    shouldSuspend,
  });

  return <div>컨텐츠</div>;
};

export default App;

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
