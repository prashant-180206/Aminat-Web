"use client";

import React, { Suspense } from "react";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "@/core/config";

import {
  SidebarSkeleton,
  PropertiesSkeleton,
  SceneSkeleton,
  RightSidebarSkeleton,
} from "./components/tabs/skeletons";

/* ---------------- Lazy imports ---------------- */

const EditSidebar = React.lazy(() => import("./components/sidebar"));
const PropertiesEditor = React.lazy(
  () => import("./components/propertiesEditor")
);
const RightSideBar = React.lazy(() => import("./components/rightSideBar"));
const SceneView = React.lazy(() => import("./scene"));

/* ---------------- Page ---------------- */

export default function Edit() {
  return (
    <div className="flex flex-row bg-bg min-h-screen w-full">
      {/* Left Sidebar */}
      <Suspense fallback={<SidebarSkeleton />}>
        <EditSidebar />
      </Suspense>

      {/* Center */}
      <div className="flex-1 flex flex-row items-center justify-center">
        <div className="flex flex-col items-center justify-evenly">
          {/* Properties */}
          <Suspense fallback={<PropertiesSkeleton />}>
            <PropertiesEditor />
          </Suspense>

          {/* Scene */}
          <Suspense
            fallback={
              <SceneSkeleton width={DEFAULT_WIDTH} height={DEFAULT_HEIGHT} />
            }
          >
            <div
              className="flex flex-row bg-bg-dark"
              style={{ height: DEFAULT_HEIGHT, width: DEFAULT_WIDTH }}
            >
              <SceneView />
            </div>
          </Suspense>
        </div>
      </div>

      {/* Right Sidebar */}
      <Suspense fallback={<RightSidebarSkeleton />}>
        <RightSideBar />
      </Suspense>
    </div>
  );
}
