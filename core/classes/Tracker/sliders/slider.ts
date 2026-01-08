import Konva from "konva";
import { ValueTracker } from ".././valuetracker";
import { createTimer, easings } from "animejs";
// import { easingMap } from "@/core/maps/easingMap";

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

  private background!: Konva.Rect;
  private track!: Konva.Rect;
  private thumb!: Konva.Circle;
  private titleText!: Konva.Text;
  private minLabel!: Konva.Text;
  private maxLabel!: Konva.Text;

  private config: Required<SliderConfig>;
  private min: number;
  private max: number;
  private _rank: number;
  public get rank(): number {
    return this._rank;
  }

  // private dummyNode = new Konva.Group();

  private _name: string;

  getMin() {
    return this.min;
  }
  getMax() {
    return this.max;
  }

  constructor(
    tracker: ValueTracker,
    config: SliderConfig = {},
    rank: number,
    name = "Slider"
  ) {
    super({ draggable: false, name: "slider" });

    this.tracker = tracker;
    this._rank = rank;
    this._name = name;

    // Default Configuration
    this.config = {
      width: config.width ?? 160,
      height: config.height ?? 6,
      min: config.min ?? 0,
      max: config.max ?? 100,
      initial: config.initial ?? 0,
      trackColor: config.trackColor ?? "#333",
      thumbColor: config.thumbColor ?? "#ffffff",
      thumbRadius: config.thumbRadius ?? 8,
      bgColor: config.bgColor ?? "#1f1f1f",
      labelColor: config.labelColor ?? "#999",
      fontSize: config.fontSize ?? 12,
      padding: config.padding ?? 16,
    };

    this.min = this.config.min;
    this.max = this.config.max;

    this.createNodes();
    this.buildUI();
    this.bindLogic();
    this.syncInitial();
  }

  private createNodes() {
    this.background = new Konva.Rect({ listening: false });
    this.titleText = new Konva.Text({ listening: false, fontStyle: "bold" });
    this.track = new Konva.Rect();
    this.thumb = new Konva.Circle({
      draggable: true,
      shadowBlur: 4,
      shadowOpacity: 0.3,
    });
    this.minLabel = new Konva.Text({ listening: false });
    this.maxLabel = new Konva.Text({ listening: false });

    this.add(
      this.background,
      this.titleText,
      this.track,
      this.thumb,
      this.minLabel,
      this.maxLabel
    );

    // this.add(this.dummyNode);
  }

  /* ---------------- Coordinate Mapping ---------------- */

  private getRelativeX(val: number): number {
    const range = this.max - this.min;
    if (range === 0) return 0;
    return ((val - this.min) / range) * this.config.width;
  }

  private getValueFromX(localX: number): number {
    const ratio =
      Math.max(0, Math.min(localX, this.config.width)) / this.config.width;
    return this.min + ratio * (this.max - this.min);
  }

  /* ---------------- UI Layout ---------------- */

  private buildUI() {
    const c = this.config;

    // Layout Constants
    const titleAreaHeight = c.fontSize + 8;
    const labelAreaHeight = c.fontSize + 4;
    const totalHeight =
      c.padding * 2 + titleAreaHeight + c.thumbRadius * 2 + labelAreaHeight;
    const totalWidth = c.width + c.padding * 2;

    this.background.setAttrs({
      width: totalWidth,
      height: totalHeight,
      fill: c.bgColor,
      cornerRadius: 10,
    });

    // 1. Title (Top)
    this.titleText.setAttrs({
      text: this._name.toUpperCase(),
      fontSize: c.fontSize - 2,
      fill: c.labelColor,
      x: c.padding,
      y: c.padding,
      letterSpacing: 1,
    });

    // 2. Track (Middle)
    const trackY = c.padding + titleAreaHeight + c.thumbRadius;
    this.track.setAttrs({
      x: c.padding,
      y: trackY - c.height / 2,
      width: c.width,
      height: c.height,
      fill: c.trackColor,
      cornerRadius: c.height / 2,
    });

    // 3. Thumb
    this.thumb.setAttrs({
      y: trackY,
      radius: c.thumbRadius,
      fill: c.thumbColor,
    });

    // Correct Drag Bound Logic
    this.thumb.dragBoundFunc((pos) => {
      const transform = this.getAbsoluteTransform().copy().invert();
      const localPos = transform.point(pos);
      const clampedX = Math.max(
        c.padding,
        Math.min(localPos.x, c.padding + c.width)
      );
      return this.getAbsoluteTransform().point({ x: clampedX, y: trackY });
    });

    // 4. Labels (Bottom)
    const labelY = trackY + c.thumbRadius + 6;
    this.minLabel.setAttrs({
      text: this.min.toString(),
      x: c.padding,
      y: labelY,
      fontSize: c.fontSize,
      fill: c.labelColor,
    });

    this.maxLabel.setAttrs({
      text: this.max.toString(),
      x: c.padding + c.width,
      y: labelY,
      fontSize: c.fontSize,
      fill: c.labelColor,
    });
    this.maxLabel.offsetX(this.maxLabel.width());

    // 5. Global Position based on Rank
    this.position({
      x: c.padding,
      y: this._rank * (totalHeight + 12) + c.padding,
    });

    this.syncThumbFromValue();
  }

  /* ---------------- Logic ---------------- */

  private bindLogic() {
    // 1. UI -> Tracker: When user drags the thumb
    const updateTrackerFromUI = () => {
      const localX = this.thumb.x() - this.config.padding;
      this.tracker.value = this.getValueFromX(localX);
    };

    this.thumb.on("dragmove", updateTrackerFromUI);

    // Click track to jump
    this.track.on("mousedown touchstart", () => {
      const stage = this.getStage();
      const pointer = stage?.getPointerPosition();
      if (!pointer) return;

      const localPos = this.getAbsoluteTransform()
        .copy()
        .invert()
        .point(pointer);

      this.thumb.x(
        Math.max(
          this.config.padding,
          Math.min(localPos.x, this.config.padding + this.config.width)
        )
      );
      updateTrackerFromUI();
    });

    // 2. Tracker -> UI: When value changes externally (e.g., via expressions)
    // We use the slider's unique name or ID as the updater key
    this.tracker.addHiddenUpdater(`slider-sync-${this._name}`, () =>
      this.syncThumbFromValue()
    );
  }

  /**
   * Clean up the updater when the slider is destroyed to prevent ghost updates
   */
  public destroy() {
    this.tracker.removeHiddenUpdater(`slider-sync-${this._name}`);
    super.destroy();
    return this;
  }

  public syncThumbFromValue() {
    const x = this.config.padding + this.getRelativeX(this.tracker.value);
    this.thumb.x(x);
  }

  private syncInitial() {
    const initial = this.config.initial ?? this.tracker.value;
    this.setValue(initial);

    this.opacity(0);
    this.scale({ x: 0.9, y: 0.9 });
  }

  /* ---------------- Public API ---------------- */

  public setValue(v: number) {
    this.tracker.value = Math.max(this.min, Math.min(v, this.max));
    this.syncThumbFromValue();
  }

  public setRange(min: number, max: number) {
    this.min = min;
    this.max = max;
    this.minLabel.text(min.toString());
    this.maxLabel.text(max.toString());
    this.maxLabel.offsetX(this.maxLabel.width());
    this.syncThumbFromValue();
  }

  public update({
    min,
    max,
    rank,
  }: {
    min: number;
    max: number;
    rank: number;
  }) {
    this.min = min;
    this.max = max;
    this._rank = rank;
    this.buildUI();
  }

  /* ---------------- Animations ---------------- */

  appearAnim() {
    const timer = createTimer({
      duration: 500,
      autoplay: false,
      onUpdate: (t) => {
        const progress = t.progress;
        const transformedProgress = easings.eases.outInSine(progress);
        this.opacity(transformedProgress);
        this.scaleX(transformedProgress);
        this.scaleY(transformedProgress);
      },
    });
    return timer;
  }

  disappearAnim() {
    const timer = createTimer({
      duration: 500,
      autoplay: false,
      onUpdate: (t) => {
        const progress = t.progress;
        const transformedProgress = easings.eases.outInSine(progress);
        this.opacity(1 - transformedProgress);
        this.scaleX(1 - transformedProgress);
        this.scaleY(1 - transformedProgress);
      },
    });
    return timer;
  }

  storeAsObj() {
    return {
      min: this.min,
      max: this.max,
      rank: this._rank,
    };
  }

  loadFromObj(obj: { min: number; max: number; rank: number }) {
    this.min = obj.min;
    this.max = obj.max;
    this._rank = obj.rank;
    this.buildUI();
  }
}
