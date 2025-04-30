import React, { Suspense, lazy } from "react";
const LeftBar = lazy(() => import("./LeftBar"));
const CodeEditor = lazy(() => import("./Editors/codeEditor"));
const RightBar = lazy(() => import("./RightBar"));

const MainLayout = () => {
  return (
    <Suspense fallback={<div></div>}>
      <div className="relative flex  p-1 w-screen h-screen overflow-hidden bg-slate-900 ">
        <LeftBar />
        <div className="w-[100vw]  h-[100vh] pl-1 ">
          <CodeEditor />
          <RightBar />
        </div>
      </div>
    </Suspense>
  );
};

export default MainLayout;
