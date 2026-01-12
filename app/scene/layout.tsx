"use client";
import React from "react";
import { SceneProvider } from "@/hooks/SceneContext";
// import { TinyRecorderScene } from "@/components/recorder";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SceneProvider>
      <div className="flex flex-col min-h-screen md:h-screen w-full bg-background no-scrollbar">
        {children}
      </div>
    </SceneProvider>
  );
}
