"use client";

import { SceneProvider } from "@/hooks/SceneContext";
import React from "react";
import EditSidebar from "./components/sidebar";
import PropertiesEditor from "./components/propertiesEditor";
import SceneView from "./scene";
import RightSideBar from "./components/rightSideBar";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/core/config";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SceneProvider>
      <div className="flex flex-row bg-bg min-h-screen w-full">
        {/* Left Sidebar with route content */}
        <EditSidebar>{children}</EditSidebar>

        {/* Center content */}
        <div className="flex-1 flex flex-row items-center justify-center">
          <div className="flex flex-col items-center justify-evenly">
            {/* Properties */}
            <PropertiesEditor />

            {/* Scene */}
            <div
              className="flex flex-row bg-bg-dark"
              style={{ height: DEFAULT_HEIGHT, width: DEFAULT_WIDTH }}
            >
              <SceneView />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <RightSideBar />
      </div>
    </SceneProvider>
  );
}
