"use client";

import { SceneProvider } from "@/hooks/SceneContext";
import React from "react";
import EditSidebar from "./components/sidebar";
import PropertiesEditor from "./components/propertyComponent/propertiesEditor";
import SceneView from "./scene";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/core/config";
import EditorHeader from "./components/EditorHeader";
import EditorFooter from "./components/EditorFooter";
import Controller from "./components/controller";

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
          <div className="flex-1 flex flex-col items-center justify-center bg-muted/20 ">
            <div className="flex flex-col items-center gap-4 py-6 my-4">
              {/* Properties Editor */}
              <PropertiesEditor />

              {/* Scene Canvas */}
              <div
                className="flex flex-row bg-card border-2 border-border rounded-lg shadow-xl mx-4"
                style={{ height: DEFAULT_HEIGHT, width: DEFAULT_WIDTH }}
              >
                <SceneView />
              </div>

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
    </SceneProvider>
  );
}
