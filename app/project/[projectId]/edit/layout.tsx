"use client";
import React from "react";
import PropertiesEditor from "./components/propertiesEditor";
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
    <div className="flex flex-col md:h-[calc(100vh-3.5rem)] w-full bg-background">
      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Left Sidebar with route content - Hidden on mobile by default, shows as drawer */}
        <EditSidebar>{children}</EditSidebar>

        {/* Center content - Full width on mobile, flex-1 on desktop */}
        <div className="flex-1 pt-20 flex flex-col items-center justify-start md:justify-center h-full overflow-auto no-scrollbar bg-muted/20">
          <div className="w-full flex max-w-5xl flex-col items-center justify-center gap-2 md:gap-4 py-2 md:py-4">
            {/* Properties Editor - Scrollable on mobile */}
            <div className="w-full items-center justify-center flex">
              <PropertiesEditor />
            </div>

            {/* Scene View - Responsive canvas */}
            <SceneView />

            {/* Timeline - Full width */}
            <div className="w-full">
              <TimeLine />
            </div>

            {/* Controller - Centered */}
            <div className="w-full flex justify-center mb-2 md:mb-0">
              <Controller />
            </div>
          </div>
        </div>

        {/* Right Panel - Hidden on mobile, shown on desktop */}
        {panel && (
          <aside className=" border-l border-border bg-card">{panel}</aside>
        )}
      </div>

      {/* Footer - Hidden on small mobile, shown on tablet+ */}
      <div className="hidden sm:block">
        <EditorFooter />
      </div>
    </div>
  );
}
