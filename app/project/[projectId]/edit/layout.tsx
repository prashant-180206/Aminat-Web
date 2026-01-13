"use client";
import React from "react";
import PropertiesEditor from "./components/propertyComponent/propertiesEditor";
import dynamic from "next/dynamic";

// import EditSidebar from "./components/sidebar";
const EditSidebar = dynamic(() => import("./components/sidebar"), {
  ssr: false,
});

import EditorFooter from "./components/EditorFooter";
import Controller from "./controller";
import SceneView from "../../scene";
import TimeLine from "./timeline";

export default function Layout({
  children,
  panel,
}: {
  children: React.ReactNode;
  panel?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.6rem)] md:h-[calc(100vh-3.5rem)] w-full bg-background no-scrollbar">
      {/* Main Content Area */}
      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Left Sidebar with route content */}
        <EditSidebar>{children}</EditSidebar>
        {/* Center content */}
        <div className="flex-1 flex flex-col items-center justify-center h-auto overflow-auto no-scrollbar bg-muted/20 ">
          <div className="flex flex-col items-center justify-around ">
            <PropertiesEditor />
            <SceneView />
            <TimeLine />
            <Controller />
          </div>
        </div>
        {/* Right Panel */}
        {panel && (
          <aside className="border-l border-border bg-card">{panel}</aside>
        )}
      </div>
      {/* Footer */}
      <EditorFooter />
    </div>
  );
}
