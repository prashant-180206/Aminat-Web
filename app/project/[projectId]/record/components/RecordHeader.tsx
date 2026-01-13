"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronLeft } from "lucide-react";
import { TinyRecorderScene } from "../../../[projectId]/edit/recorder";

const RecordHeader = () => {
  return (
    <header className="w-full bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left: Logo & Back Button */}
        <div className="flex items-center gap-4">
          <Link href="/scene" className="inline-flex">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Sparkles className="w-5 h-5 text-brand-from" />
            <span className="bg-linear-to-r from-brand-from to-brand-to bg-clip-text text-transparent">
              Animat
            </span>
            <span className="text-xs text-muted-foreground font-normal ml-1">
              Recording Studio
            </span>
          </Link>
        </div>

        {/* Right: Recording Button */}
        <div className="flex items-center gap-2">
          <TinyRecorderScene />
        </div>
      </div>
    </header>
  );
};

export default RecordHeader;
