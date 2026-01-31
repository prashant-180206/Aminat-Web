import React from "react";
import { LearnSceneProvider } from "@/hooks/LearnSceneContext";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LearnSceneProvider>{children}</LearnSceneProvider>;
}
