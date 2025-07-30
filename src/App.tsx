import { Suspense } from "react";
import { useSuspend } from "./query/use-suspend";
import { ErrorBoundary } from "@suspensive/react";

function App() {
  return (
    <main>
      <ErrorBoundary fallback={<div>에러 발생</div>}>
        <Suspense fallback={<div>서스펜스 중...</div>}>
          <Content />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

const Content = () => {
  const { data: posts } = useSuspend({
    key: "posts",
    queryFn: getPostList,
  });

  const { data: posts2 } = useSuspend({
    key: "posts",
    queryFn: getPostList,
  });

  const { data: posts3 } = useSuspend({
    key: "posts",
    queryFn: getPostList,
  });

  const { data: comments } = useSuspend({
    key: "comments",
    queryFn: getCommentList,
  });

  return (
    <div>
      {JSON.stringify(posts)}
      {JSON.stringify(posts2)}
      {JSON.stringify(posts3)}
      {JSON.stringify(comments)}
    </div>
  );
};

export default App;

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getPostList = async () => {
  console.log("게시글 목록을 가져오는 중...");
  await sleep(2000);

  return [
    { id: "1", title: "게시글 1" },
    { id: "2", title: "게시글 2" },
  ];
};

const getCommentList = async () => {
  console.log("댓글 목록을 가져오는 중...");
  await sleep(2000);

  return [
    { id: "1", content: "댓글 1" },
    { id: "2", content: "댓글 2" },
  ];
};
