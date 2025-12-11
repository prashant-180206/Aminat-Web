// app/some-subtree/layout.tsx or a top-level client component
"use client";

import { SceneProvider } from "@/hooks/SceneContext";
// import { SceneProvider } from "@/hooks/SceneContext";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  //   const containerref = React.useRef<HTMLDivElement>(null);
  return (
    <SceneProvider>
      <main> {children}</main>
    </SceneProvider>
  );
}
