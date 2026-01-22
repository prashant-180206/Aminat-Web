/* eslint-disable @typescript-eslint/no-explicit-any */
import Konva from "konva";
import fixWebmDuration from "fix-webm-duration";

export class KonvaRecorder {
  private stage: Konva.Stage;
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private fps: number;
  private mimeType: string;
  private animationId: number | null = null;

  private startTime: number = 0;
  private totalPausedTime: number = 0;
  private lastPauseTimestamp: number = 0;

  constructor(stage: Konva.Stage, options: any = {}) {
    this.stage = stage;
    this.fps = options.fps || 30;
    this.mimeType = options.mimeType || "video/webm; codecs=vp8";
  }

  /**
   * Internal drawing loop to merge layers
   */
  private draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.stage.getLayers().forEach((layer) => {
      ctx.drawImage(
        layer.getCanvas()._canvas,
        0,
        0,
        this.stage.width(),
        this.stage.height(),
      );
    });
    this.animationId = requestAnimationFrame(() => this.draw(ctx));
  };

  public start(): void {
    const ratio = window.devicePixelRatio || 1;
    const recordingCanvas = document.createElement("canvas");
    recordingCanvas.width = this.stage.width() * ratio;
    recordingCanvas.height = this.stage.height() * ratio;

    const ctx = recordingCanvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);

    // Start the drawing loop
    this.draw(ctx);

    const stream = recordingCanvas.captureStream(this.fps);
    this.chunks = [];
    this.startTime = Date.now();
    this.totalPausedTime = 0;

    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: this.mimeType,
      videoBitsPerSecond: 5000000,
    });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };

    this.mediaRecorder.start();
  }

  /**
   * Pauses the recording and the internal drawing loop
   */
  public pause(): void {
    if (this.mediaRecorder?.state === "recording") {
      this.mediaRecorder.pause();

      // Stop the drawing loop to save resources
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }

      this.lastPauseTimestamp = Date.now();
    }
  }

  /**
   * Resumes the recording and restarts the drawing loop
   */
  public resume(): void {
    if (this.mediaRecorder?.state === "paused") {
      this.mediaRecorder.resume();

      // Restart the drawing loop
      const canvas = (this.mediaRecorder.stream.getVideoTracks()[0] as any)
        .canvas;
      const ctx = canvas.getContext("2d");
      if (ctx) this.draw(ctx);

      this.totalPausedTime += Date.now() - this.lastPauseTimestamp;
    }
  }

  public async stop(): Promise<string> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) return;

      this.mediaRecorder.onstop = async () => {
        if (this.animationId) cancelAnimationFrame(this.animationId);

        // Final duration = (Current Time - Start Time) - Total time spent paused
        const duration = Date.now() - this.startTime - this.totalPausedTime;
        const buggyBlob = new Blob(this.chunks, { type: this.mimeType });

        try {
          const fixedBlob = await fixWebmDuration(buggyBlob, duration);
          resolve(URL.createObjectURL(fixedBlob));
        } catch {
          resolve(URL.createObjectURL(buggyBlob));
        }
      };

      this.mediaRecorder.stop();
    });
  }

  public saveToDisk(
    url: string,
    filename: string = "math-animation.webm",
  ): void {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
