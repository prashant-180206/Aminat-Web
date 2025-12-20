// components/skeletons.tsx
"use client";
import React from "react";

export const SidebarSkeleton = () => (
  <div className="w-64 h-full bg-bg-dark animate-pulse" />
);

export const PropertiesSkeleton = () => (
  <div className="w-full h-20 bg-bg-dark rounded-md animate-pulse mb-2" />
);

export const SceneSkeleton = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => <div className="bg-bg-dark animate-pulse" style={{ width, height }} />;

export const RightSidebarSkeleton = () => (
  <div className="w-64 h-full bg-bg-dark animate-pulse" />
);
