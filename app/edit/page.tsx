"use client";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/core/config";
// import { Sidebar } from "lucide-react";
import React, { Suspense } from "react";
import EditSidebar from "./components/sidebar";
import PropertiesEditor from "./components/propertiesEditor";

// import EditSidebar from "./components/sidebar";

const SceneView = React.lazy(() => import("./scene"));

export default function Edit() {
  return (
    <div className="flex flex-row bg-bg min-h-screen w-full">
      <EditSidebar />

      <div className="flex-1 flex flex-row items-center justify-center">
        <div className="flex flex-col items-center justify-evenly ">
          <PropertiesEditor />
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full w-full">
                <div className="text-sm text-zinc-400">Loading scene...</div>
              </div>
            }
          >
            <div
              className="flex flex-row bg-bg-dark "
              style={{ height: DEFAULT_HEIGHT, width: DEFAULT_WIDTH }}
            >
              <SceneView />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
