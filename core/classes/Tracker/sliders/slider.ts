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

  private config: SliderConfig;

  private min: number;
  private max: number;
  private widthPx: number;

  private _rank: number;
  public get rank(): number {
    return this._rank;
  }

  constructor(
    tracker: ValueTracker,
    config: SliderConfig = {},
    rank: number = 0
  ) {
    super({ draggable: false, name: "slider" });

    this.tracker = tracker;
    this.config = config;
    this._rank = rank;

    this.min = config.min ?? 0;
    this.max = config.max ?? 1;
    this.widthPx = config.width ?? 150;

    this.background = new Konva.Rect({ listening: false });
    this.track = new Konva.Rect();
    this.thumb = new Konva.Circle({ draggable: true });
    this.minLabel = new Konva.Text();
    this.maxLabel = new Konva.Text();

    this.add(
      this.background,
      this.track,
      this.thumb,
      this.minLabel,
      this.maxLabel
    ); // one-time creation
    this.bindLogic(); // one-time listeners
    this.buildUI(); // initial layout
    this.syncInitial();
  }

  private buildUI() {
    const {
      height = 6,
      thumbRadius = 6,
      padding = 14,
      fontSize = 12,
      bgColor = "#1f1f1f",
      trackColor = "#555",
      thumbColor = "#e5e5e5",
      labelColor = "#bdbdbd",
    } = this.config;

    const totalHeight = height + thumbRadius + fontSize + padding * 2;

    /* ---------- Background ---------- */

    this.background.setAttrs({
      x: -padding,
      y: -totalHeight / 2,
      width: this.widthPx + padding * 2,
      height: totalHeight,
      fill: bgColor,
      cornerRadius: 12,
    });

    /* ---------- Track ---------- */

    this.track.setAttrs({
      x: 0,
      y: -height / 2,
      width: this.widthPx,
      height,
      fill: trackColor,
      cornerRadius: height / 2,
    });

    /* ---------- Thumb ---------- */

    this.thumb.setAttrs({
      radius: thumbRadius,
      fill: thumbColor,
      y: 0,
    });

    this.thumb.dragBoundFunc((pos) => ({
      x: Math.max(0 + padding * 2, Math.min(pos.x, this.widthPx) + padding * 2),
      y: this.y(),
    }));

    /* ---------- Labels ---------- */

    this.minLabel.setAttrs({
      text: this.min.toString(),
      x: 0,
      y: thumbRadius + 8,
      fontSize,
      fill: labelColor,
    });

    this.maxLabel.setAttrs({
      text: this.max.toString(),
      x: this.widthPx,
      y: thumbRadius + 8,
      fontSize,
      fill: labelColor,
    });

    this.maxLabel.offsetX(this.maxLabel.width());

    /* ---------- Group Position ---------- */

    this.position({
      x: padding * 2,
      y: this._rank * (totalHeight + 10) + totalHeight / 2 + padding,
    });

    /* ---------- Sync thumb to value ---------- */

    this.syncThumbFromValue();
  }

  private syncThumbFromValue() {
    if (this.max === this.min) return;

    const clamped = Math.max(this.min, Math.min(this.tracker.value, this.max));
    const t = (clamped - this.min) / (this.max - this.min);
    this.thumb.x(t * this.widthPx);
  }

  private bindLogic() {
    const updateFromThumb = () => {
      const t = this.thumb.x() / this.widthPx;
      this.tracker.value = this.min + t * (this.max - this.min);
    };

    this.thumb.on("dragmove", updateFromThumb);

    this.track.on("mousedown touchstart", () => {
      const stage = this.getStage();
      if (!stage) return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const transform = this.getAbsoluteTransform().copy().invert();
      const local = transform.point(pointer);

      this.thumb.x(Math.max(0, Math.min(local.x, this.widthPx)));
      updateFromThumb();
    });

    this.tracker.addUpdater("Slider", (v) => {
      if (this.max === this.min) return;
      const t = (v - this.min) / (this.max - this.min);
      this.thumb.x(t * this.widthPx);
    });
  }

  private syncInitial() {
    const initial =
      this.config.initial !== undefined
        ? this.config.initial
        : this.tracker.value;

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

  update({ min, max, rank }: { min: number; max: number; rank: number }) {
    this.min = min;
    this.max = max;
    this._rank = rank;

    this.buildUI();
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
