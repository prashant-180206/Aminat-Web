import Konva from "@/lib/konva";
import { ValueTracker } from "./valuetracker";

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
      draggable: false,
      name: "slider",
    });

    this.tracker = tracker;

    this.min = config.min ?? 0;
    this.max = config.max ?? 1;
    this.widthPx = config.width ?? 200;

    const height = config.height ?? 30;
    const thumbRadius = config.thumbRadius ?? 10;

    /* ---------------- Track ---------------- */

    this.track = new Konva.Rect({
      x: 0,
      y: -height / 2,
      width: this.widthPx,
      height,
      fill: config.trackColor ?? "#444",
      cornerRadius: height / 2,
      listening: true,
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

    /* ---------------- Thumb → ValueTracker ---------------- */

    const updateFromThumb = () => {
      const t = this.thumb.x() / this.widthPx;
      const value = this.min + t * (this.max - this.min);
      this.tracker.value = value;
    };

    this.thumb.on("dragmove", updateFromThumb);

    /* ---------------- Track Click ---------------- */

    this.track.on("mousedown touchstart", () => {
      const stage = this.getStage();
      if (!stage) return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const transform = this.getAbsoluteTransform().copy().invert();
      const localPos = transform.point(pointer);

      const x = Math.max(0, Math.min(localPos.x, this.widthPx));
      this.thumb.x(x);
      updateFromThumb();
    });

    /* ---------------- ValueTracker → Thumb ---------------- */

    this.tracker.addUpdater("Slider", (v) => {
      if (this.max === this.min) return;

      const clamped = Math.max(this.min, Math.min(v, this.max));
      const t = (clamped - this.min) / (this.max - this.min);
      this.thumb.x(t * this.widthPx);
    });

    /* ---------------- Initial Sync ---------------- */

    const initial =
      config.initial !== undefined ? config.initial : tracker.value;

    this.setValue(initial);

    this.opacity(0);
    this.scaleX(0);
    this.scaleY(0);
  }

  getMin() {
    return this.min;
  }
  getMax() {
    return this.max;
  }

  /* ---------------- Animations ---------------- */

  appearAnim(): Konva.Tween {
    // console.log("Creating appear anim");
    return new Konva.Tween({
      node: this,
      opacity: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 1,
      easing: Konva.Easings.EaseInOut,
    });
  }

  disappearAnim(): Konva.Tween {
    return new Konva.Tween({
      node: this,
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
      duration: 1,
      easing: Konva.Easings.EaseInOut,
    });
  }

  /* ---------------- Public API ---------------- */

  setRange(min: number, max: number) {
    this.min = min;
    this.max = max;
    this.setValue(this.tracker.value);
  }

  setValue(v: number) {
    const clamped = Math.max(this.min, Math.min(v, this.max));
    this.tracker.value = clamped;
  }

  getValue() {
    return this.tracker.value;
  }
}
