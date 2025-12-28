import Konva from "@/lib/konva";
import { ValueTracker } from ".././valuetracker";
// import { re } from "mathjs";

type SliderConfig = {
  width?: number;
  height?: number;
  min?: number;
  max?: number;
  initial?: number;
  trackColor?: string;
  thumbColor?: string;
  thumbRadius?: number;

  bgColor?: string;
  labelColor?: string;
  fontSize?: number;
  padding?: number;
};

export class Slider extends Konva.Group {
  readonly tracker: ValueTracker;

  private background: Konva.Rect;
  private track: Konva.Rect;
  private thumb: Konva.Circle;

  private minLabel: Konva.Text;
  private maxLabel: Konva.Text;

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

    const height = config.height ?? 6;
    const thumbRadius = config.thumbRadius ?? 10;
    const padding = config.padding ?? 14;
    const fontSize = config.fontSize ?? 12;

    const totalHeight = height + thumbRadius * 2 + fontSize + padding * 2;

    /* ---------------- Background ---------------- */

    this.background = new Konva.Rect({
      x: -padding,
      y: -totalHeight / 2,
      width: this.widthPx + padding * 2,
      height: totalHeight,
      fill: config.bgColor ?? "#1f1f1f",
      cornerRadius: 12,
      listening: false,
    });

    /* ---------------- Track ---------------- */

    this.track = new Konva.Rect({
      x: 0,
      y: -height / 2,
      width: this.widthPx,
      height,
      fill: config.trackColor ?? "#555",
      cornerRadius: height / 2,
    });

    /* ---------------- Thumb ---------------- */

    this.thumb = new Konva.Circle({
      x: 0,
      y: 0,
      radius: thumbRadius,
      fill: config.thumbColor ?? "#e5e5e5",
      draggable: true,
      shadowBlur: 6,
      shadowOpacity: 0.4,
      dragBoundFunc: (pos) => ({
        x: Math.max(0, Math.min(pos.x, this.widthPx)),
        y: 0,
      }),
    });

    /* ---------------- Labels ---------------- */

    this.minLabel = new Konva.Text({
      text: this.min.toString(),
      x: 0,
      y: thumbRadius + 8,
      fontSize,
      fill: config.labelColor ?? "#bdbdbd",
    });

    this.maxLabel = new Konva.Text({
      text: this.max.toString(),
      x: this.widthPx,
      y: thumbRadius + 8,
      fontSize,
      fill: config.labelColor ?? "#bdbdbd",
      align: "right",
    });

    this.maxLabel.offsetX(this.maxLabel.width());

    /* ---------------- Add Order ---------------- */

    this.add(
      this.background,
      this.track,
      this.thumb,
      this.minLabel,
      this.maxLabel
    );

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
      const local = transform.point(pointer);

      const x = Math.max(0, Math.min(local.x, this.widthPx));
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
    this.scale({ x: 0, y: 0 });
  }

  getMin() {
    return this.min;
  }

  getMax() {
    return this.max;
  }

  /* ---------------- Public API ---------------- */

  setRange(min: number, max: number) {
    this.min = min;
    this.max = max;

    this.minLabel.text(min.toString());
    this.maxLabel.text(max.toString());
    this.maxLabel.offsetX(this.maxLabel.width());

    this.setValue(this.tracker.value);
  }

  setValue(v: number) {
    const clamped = Math.max(this.min, Math.min(v, this.max));
    this.tracker.value = clamped;
  }

  getValue() {
    return this.tracker.value;
  }

  /* ---------------- Animations ---------------- */

  appearAnim(): Konva.Tween {
    return new Konva.Tween({
      node: this,
      opacity: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 0.8,
      easing: Konva.Easings.EaseInOut,
    });
  }

  disappearAnim(): Konva.Tween {
    return new Konva.Tween({
      node: this,
      opacity: 0,
      scaleX: 0,
      scaleY: 0,
      duration: 0.6,
      easing: Konva.Easings.EaseInOut,
    });
  }
}
