"use client";

import React, { useEffect, useRef, useState } from "react";
import { KonvaRecorder } from "@/core/KonvaRecorder";
import { useScene } from "@/hooks/SceneContext";
import { toast } from "sonner";
import { Square, Timer, Pause, Play, X, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* This code defines a React functional component called `TinyRecorderScene`. Here's a breakdown of
what the component does: */
export const TinyRecorderScene = () => {
  const { scene } = useScene();
  const recorderRef = useRef<KonvaRecorder | null>(null);

  const [status, setStatus] = useState<"idle" | "recording" | "paused">("idle");
  const [seconds, setSeconds] = useState(0);

  /* The `useEffect` hook in the code snippet is responsible for managing a timer that increments the
 `seconds` state every second when the `status` is set to "recording". Here's a breakdown of what it
 does: */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "recording") {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (s: number) => {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const handleStart = () => {
    if (!scene) return;
    recorderRef.current = new KonvaRecorder(scene);
    recorderRef.current.start();
    setSeconds(0);
    setStatus("recording");
    toast.success("Recording started");
  };

  const handlePauseToggle = () => {
    if (!recorderRef.current) return;
    if (status === "recording") {
      recorderRef.current.pause();
      setStatus("paused");
    } else {
      recorderRef.current.resume();
      setStatus("recording");
    }
  };

  const handleStop = async () => {
    if (!recorderRef.current) return;
    try {
      const videoUrl = await recorderRef.current.stop();
      recorderRef.current.saveToDisk(videoUrl, `AnimatVideo.webm`);
      toast.success("Recording exported");
    } catch {
      toast.error("Export failed");
    } finally {
      resetRecorder();
    }
  };

  const handleCancel = async () => {
    if (!recorderRef.current) return;
    // Stop the recorder but don't save the returned URL
    await recorderRef.current.stop();
    toast.info("Recording discarded");
    resetRecorder();
  };

  const resetRecorder = () => {
    setStatus("idle");
    setSeconds(0);
    recorderRef.current = null;
  };

  if (!scene) return null;

  return (
    <TooltipProvider>
      {/* 1. Normal Document Flow Trigger */}
      {status === "idle" && (
        <Button
          onClick={handleStart}
          variant="outline"
          className="gap-2 border-dashed border-2 hover:border-red-500 hover:bg-red-50/10 transition-all"
        >
          <Video size={16} className="text-red-500" />
          Capture Scene
        </Button>
      )}

      {/* 2. Floating Top Bar (Active States) */}
      {status !== "idle" && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-100 flex items-center gap-2 bg-background/95 backdrop-blur-md border shadow-xl rounded-full px-3 py-1.5 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Symbolic Status & Timer */}
          <div className="flex items-center gap-3 px-2">
            <Badge
              variant={status === "paused" ? "outline" : "destructive"}
              className="px-2 py-0.5 gap-1.5 border-none transition-all"
            >
              <span
                className={`h-2 w-2 rounded-full bg-current ${
                  status === "recording" && "animate-pulse"
                }`}
              />
              <span className="font-bold tracking-tighter text-[10px]">
                REC...
              </span>
            </Badge>

            <div className="flex items-center gap-1.5 font-mono text-sm tabular-nums">
              <Timer size={14} className="text-muted-foreground" />
              {formatTime(seconds)}
            </div>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Icon-Only Action Buttons */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePauseToggle}
                  className="rounded-full h-8 w-8"
                >
                  {status === "recording" ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {status === "recording" ? "Pause" : "Resume"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleStop}
                  className="rounded-full h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50/10"
                >
                  <Square size={16} className="fill-current" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Stop & Save</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cancel (Discard)</TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
};
