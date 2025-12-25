// ui/slider.ts
// /* eslint-disable @typescript-eslint/no-explicit-any */
import Konva from "@/lib/konva";
import { ValueTracker } from "./valuetracker";
// import { ValueTracker } from "@/core/animation/ValueTracker";

type SliderConfig = {
  width?: number;
  height?: number;
  min?: number;
  max?: number;
  initial?: number;
  trackColor?: string;
  thumbColor?: string;
  thumbRadius?: number;
};

export class Slider extends Konva.Group {
  readonly tracker: ValueTracker;

  private track: Konva.Rect;
  private thumb: Konva.Circle;

  private min: number;
  private max: number;
  private widthPx: number;

  constructor(tracker: ValueTracker, config: SliderConfig = {}) {
    super({
      draggable: true,
      name: "slider",
    });

    this.tracker = tracker;

    this.min = config.min ?? 0;
    this.max = config.max ?? 1;
    this.widthPx = config.width ?? 200;

    const height = config.height ?? 6;
    const thumbRadius = config.thumbRadius ?? 10;

    /* ---------------- Track ---------------- */

    this.track = new Konva.Rect({
      x: 0,
      y: -height / 2,
      width: this.widthPx,
      height,
      fill: config.trackColor ?? "#444",
      cornerRadius: height / 2,
    });

    /* ---------------- Thumb ---------------- */

    this.thumb = new Konva.Circle({
      x: 0,
      y: 0,
      radius: thumbRadius,
      fill: config.thumbColor ?? "#e5e5e5",
      draggable: true,
      dragBoundFunc: (pos) => ({
        x: Math.max(0, Math.min(pos.x, this.widthPx)),
        y: 0,
      }),
    });

    this.add(this.track);
    this.add(this.thumb);

    /* ---------------- Interaction → ValueTracker ---------------- */

    const updateFromThumb = () => {
      const t = this.thumb.x() / this.widthPx;
      const value = this.min + t * (this.max - this.min);
      this.tracker.value = value;
    };

    this.thumb.on("dragmove", updateFromThumb);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.track.on("mousedown touchstart", (e) => {
      const localX = this.getRelativePointerPosition()?.x ?? 0;
      this.thumb.x(Math.max(0, Math.min(localX, this.widthPx)));
      updateFromThumb();
    });

    /* ---------------- ValueTracker → Thumb ---------------- */

    this.tracker.addUpdater("Slider", (v) => {
      const t = (v - this.min) / (this.max - this.min);
      this.thumb.x(t * this.widthPx);
      this.getLayer()?.batchDraw();
    });

    /* ---------------- Initial sync ---------------- */

    if (config.initial !== undefined) {
      this.tracker.value = config.initial;
    } else {
      this.tracker.value = tracker.value;
    }
  }

  /* ---------------- Public API ---------------- */

  setRange(min: number, max: number) {
    this.min = min;
    this.max = max;
    this.tracker.value = this.tracker.value; // resync
  }

  setValue(v: number) {
    this.tracker.value = v;
  }

  getValue() {
    return this.tracker.value;
  }
}
