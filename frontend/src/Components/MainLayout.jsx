import React, { Suspense, lazy } from "react";
const LeftBar = lazy(() => import("./LeftBar"));
const CodeEditor = lazy(() => import("./Editors/codeEditor"));
const RightBar = lazy(() => import("./RightBar"));

const MainLayout = () => {
  return (
    <Suspense fallback={<div></div>}>
      <div className="relative flex md:flex-row  flex-col  p-1 w-screen h-screen md:overflow-hidden overflow-y-auto overflow-x-hidden  bg-slate-900 ">
        <LeftBar />
        <div className="w-[100vw] h-[100vh] md:pl-1 ">
          <CodeEditor />
          <RightBar />
        </div>
      </div>
    </Suspense>
  );
};

export default MainLayout;
