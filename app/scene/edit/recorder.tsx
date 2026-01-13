"use client";

import { KonvaRecorder } from "@/core/KonvaRecorder";
import { useScene } from "@/hooks/SceneContext";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CircleDot, Square, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const TinyRecorderScene = () => {
  const { scene } = useScene();

  const recorderRef = useRef<KonvaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const formatTime = (s: number) => {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const startTimer = () => {
    timerRef.current = window.setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = () => {
    if (!scene || isRecording) return;

    recorderRef.current = new KonvaRecorder(scene);
    recorderRef.current.start();

    setSeconds(0);
    setIsRecording(true);
    startTimer();

    toast.success("Recording started");
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;

    try {
      const videoUrl = await recorderRef.current.stop();
      recorderRef.current.saveToDisk(videoUrl, "canvas-capture.webm");
      toast.success("Recording saved");
    } catch {
      toast.error("Failed to save recording");
    }

    stopTimer();
    setIsRecording(false);
    recorderRef.current = null;
  };

  useEffect(() => {
    return () => stopTimer();
  }, []);

  if (!scene) {
    return <div className="text-sm text-muted-foreground">Loading scene…</div>;
  }

  return (
    <>
      {/* Fixed Recording Bar */}
      {isRecording && (
        <div className="fixed top-4 left-[50%] translate-x-[-50%] border-b w-40  bg-background/90 backdrop-blur">
          <div className=" flex h-12  items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Badge variant="destructive" className="gap-1">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                REC
              </Badge>

              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Timer size={14} />
                {formatTime(seconds)}
              </div>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={stopRecording}
              className="gap-2"
            >
              <Square size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* Normal Start Button */}
      <Card className="inline-flex items-center gap-3 p-3">
        <Button
          onClick={startRecording}
          disabled={isRecording}
          className="gap-2"
        >
          <CircleDot size={16} />
          Start Recording
        </Button>

        <span className="text-xs text-muted-foreground">
          Records current Konva scene
        </span>
      </Card>
    </>
  );
};
