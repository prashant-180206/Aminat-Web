"use client";
import { ExpressionEditor } from "@/components/expressionEditor";
import React from "react";

export default function CodePage() {
  return (
    <div className="w-[250px] p-4 text-sm">
      <h1 className="font-semibold mb-2">Settings</h1>
      <ExpressionEditor value="" onChange={() => {}} trackers={[]} />
    </div>
  );
}
