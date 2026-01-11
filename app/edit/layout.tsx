"use client";

import { SceneProvider } from "@/hooks/SceneContext";
import React from "react";
import PropertiesEditor from "./components/propertyComponent/propertiesEditor";
// import SceneView from "./scene";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/core/config";
import dynamic from "next/dynamic";

// import EditSidebar from "./components/sidebar";
const EditSidebar = dynamic(() => import("./components/sidebar"), {
  ssr: false,
});

const SceneView = dynamic(() => import("./scene"), { ssr: false });
const EditorHeader = dynamic(() => import("./components/EditorHeader"), {
  ssr: false,
});
// import EditorHeader from "./components/EditorHeader";
import EditorFooter from "./components/EditorFooter";
import Controller from "./components/controller";
import { TinyRecorderScene } from "@/components/recorder";

export default function Layout({
  children,
  panel,
}: {
  children: React.ReactNode;
  panel?: React.ReactNode;
}) {
  return (
    <SceneProvider>
      <div className="flex flex-col min-h-screen w-full bg-background no-scrollbar">
        {/* Header */}
        <EditorHeader />

        {/* Main Content Area */}
        <div className="flex flex-row flex-1 overflow-auto no-scrollbar">
          {/* Left Sidebar with route content */}
          <EditSidebar>{children}</EditSidebar>

          {/* Center content */}
          <div className="flex-1 flex flex-col items-center justify-center h-screen bg-muted/20 ">
            <div className="flex flex-col items-center gap-4 py-6 my-4">
              {/* Properties Editor */}
              <PropertiesEditor />

              {/* Scene Canvas */}
              <div
                className="flex flex-row items-start justify-start bg-card border-2 border-border  overflow-hidden rounded-lg shadow-xl mx-4"
                style={{
                  height: DEFAULT_HEIGHT * 0.45,
                  width: DEFAULT_WIDTH * 0.45,
                }}
              >
                <SceneView />
              </div>
            </div>
            <Controller />
            <TinyRecorderScene />
          </div>

          {/* Right Panel */}
          {panel && (
            <aside className="border-l border-border bg-card">{panel}</aside>
          )}
        </div>

        {/* Footer */}
        <EditorFooter />
      </div>
    </SceneProvider>
  );
}
