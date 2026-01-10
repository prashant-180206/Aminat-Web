import Konva from "konva";

interface RecorderOptions {
  fps?: number;
  mimeType?: string;
  filename?: string;
}

export class KonvaRecorder {
  private stage: Konva.Stage;
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private fps: number;
  private mimeType: string;

  constructor(stage: Konva.Stage, options: RecorderOptions = {}) {
    this.stage = stage;
    this.fps = options.fps || 30;
    this.mimeType = options.mimeType || "video/webm; codecs=vp9";
  }

  /**
   * Starts the recording
   */
  public start(): void {
    const canvas = this.stage.content.querySelector(
      "canvas"
    ) as HTMLCanvasElement;

    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    const stream = canvas.captureStream(this.fps);

    this.chunks = [];

    try {
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: this.mimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps for clear math text
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.warn("MimeType not supported, falling back to default");
      this.mediaRecorder = new MediaRecorder(stream);
    }

    this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
    console.log("⏺️ Recording started...");
  }

  /**
   * Stops recording and returns the video URL
   */
  public async stop(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject("Recorder not started");
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: this.mimeType });
        const videoUrl = URL.createObjectURL(blob);
        console.log("✅ Recording finished.");
        resolve(videoUrl);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Helper to trigger a browser download
   */
  public saveToDisk(url: string, filename: string = "math-canvas.webm"): void {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
