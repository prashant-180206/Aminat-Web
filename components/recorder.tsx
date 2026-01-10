"use client";

import { KonvaRecorder } from "@/core/KonvaRecorder";
import { useScene } from "@/hooks/SceneContext";
import React, { useRef, useState } from "react";
// import { Stage, Layer, Circle, Text } from "react-konva";
// import { KonvaRecorder } from './KonvaRecorder'; // The class from the previous step

export const TinyRecorderScene = () => {
  const { scene } = useScene();

  const recorderRef = useRef<KonvaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    if (!scene) return;

    // Initialize the recorder with the current stage
    recorderRef.current = new KonvaRecorder(scene, { fps: 30 });
    recorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;

    const videoUrl = await recorderRef.current.stop();
    recorderRef.current.saveToDisk(videoUrl, "canvas-capture.webm");

    // Cleanup
    setIsRecording(false);
    recorderRef.current = null;
  };

  if (!scene) {
    return <div>Loading scene...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-900 rounded-lg">
      {/* Control UI */}
      <div className="flex gap-2">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
          >
            ⏺ Record Scene
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-gray-200 text-black rounded-full animate-pulse"
          >
            ⏹ Stop & Save
          </button>
        )}
      </div>
    </div>
  );
};
