import Konva from "konva";
import { PtValueTracker } from "../ptValuetracker";
import { createTimer, easings } from "animejs";
import { Colors } from "@/core/utils/colors";

export class PtSlider extends Konva.Group {
  readonly tracker: PtValueTracker;

  private background!: Konva.Rect;
  private trackX!: Konva.Rect;
  private trackY!: Konva.Rect;
  private thumbX!: Konva.Circle;
  private thumbY!: Konva.Circle;
  private titleText!: Konva.Text;
  private labels: {
    minX: Konva.Text;
    maxX: Konva.Text;
    minY: Konva.Text;
    maxY: Konva.Text;
  };

  private config = {
    trackWidth: 240,
    trackHeight: 6,
    thumbRadius: 10,
    padding: 20,
    labelGap: 24,
    fontSize: 24,
    titleFontSize: 24,
    bgColor: Colors.BG_SEC,
    trackColor: Colors.FILL,
    thumbColor: Colors.PRIMARY,
    labelColor: Colors.TEXT,
    titleColor: Colors.TEXT,
  };

  private trackStartX: number = 0;

  private minX: number;
  private maxX: number;
  private minY: number;
  private maxY: number;
  private _rank: number;
  private _name: string;

  constructor(
    tracker: PtValueTracker,
    config: { minX: number; maxX: number; minY: number; maxY: number },
    rank = 1,
    name = "Tracker"
  ) {
    super({ draggable: false, name: "slider" });

    this.tracker = tracker;
    this._rank = rank;
    this._name = name;

    this.minX = config.minX;
    this.maxX = config.maxX;
    this.minY = config.minY;
    this.maxY = config.maxY;

    this.labels = {
      minX: new Konva.Text(),
      maxX: new Konva.Text(),
      minY: new Konva.Text(),
      maxY: new Konva.Text(),
    };

    this.createNodes();
    this.buildUI();
    this.bindLogic();
    this.syncInitial();
  }

  private createNodes() {
    this.background = new Konva.Rect({ listening: false });

    this.titleText = new Konva.Text({
      listening: false,
      align: "center",
    });

    this.trackX = new Konva.Rect({ name: "trackX" });
    this.trackY = new Konva.Rect({ name: "trackY" });
    this.thumbX = new Konva.Circle({ draggable: true, name: "thumbX" });
    this.thumbY = new Konva.Circle({ draggable: true, name: "thumbY" });

    this.add(
      this.background,
      this.titleText,
      this.trackX,
      this.trackY,
      this.thumbX,
      this.thumbY
    );

    Object.values(this.labels).forEach((label) => this.add(label));
  }

  /* ---------------- Coordinate Helpers ---------------- */

  private clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(v, max));
  }

  private valueToX(v: number, min: number, max: number) {
    const range = max - min;
    if (range === 0) return 0;
    const ratio = (this.clamp(v, min, max) - min) / range;
    return ratio * this.config.trackWidth;
  }

  private xToValue(localX: number, min: number, max: number) {
    const ratio =
      this.clamp(localX, 0, this.config.trackWidth) / this.config.trackWidth;
    return min + ratio * (max - min);
  }

  /* ---------------- UI Construction ---------------- */

  private buildUI() {
    const c = this.config;
    const labelWidth = 30;
    const titleHeight = c.titleFontSize + 8;

    const trackX = labelWidth + c.labelGap;
    const rowHeight = c.thumbRadius * 2 + 10;

    const totalWidth = trackX + c.trackWidth + labelWidth + c.labelGap;
    const totalHeight = c.padding * 2 + titleHeight + rowHeight * 2;

    this.background.setAttrs({
      width: totalWidth,
      height: totalHeight,
      fill: c.bgColor,
      cornerRadius: 8,
    });

    this.titleText.setAttrs({
      text: this._name,
      fontSize: c.titleFontSize,
      fill: c.titleColor,
      width: totalWidth - c.padding * 2,
      align: "left",
      x: c.padding,
      y: c.padding,
    });

    const yBase = c.padding + titleHeight;
    const yRow1 = yBase + rowHeight / 2;
    const yRow2 = yBase + rowHeight + rowHeight / 2;

    this.setupRow(
      this.trackX,
      this.thumbX,
      this.labels.minX,
      this.labels.maxX,
      this.minX,
      this.maxX,
      trackX,
      yRow1
    );

    this.setupRow(
      this.trackY,
      this.thumbY,
      this.labels.minY,
      this.labels.maxY,
      this.minY,
      this.maxY,
      trackX,
      yRow2
    );

    this.position({
      x: c.padding,
      y: this._rank * (totalHeight + 10) + c.padding,
    });
  }

  private setupRow(
    track: Konva.Rect,
    thumb: Konva.Circle,
    lMin: Konva.Text,
    lMax: Konva.Text,
    minVal: number,
    maxVal: number,
    x: number,
    y: number
  ) {
    const c = this.config;

    track.setAttrs({
      x,
      y: y - c.trackHeight / 2,
      width: c.trackWidth,
      height: c.trackHeight,
      fill: c.trackColor,
      cornerRadius: c.trackHeight / 2,
    });

    thumb.setAttrs({
      y,
      radius: c.thumbRadius,
      fill: c.thumbColor,
      shadowBlur: 4,
    });

    lMin.setAttrs({
      text: minVal.toFixed(0),
      x: x - c.labelGap,
      y: y - c.fontSize / 2,
      fontSize: c.fontSize,
      fill: c.labelColor,
      align: "right",
      width: 30,
      offsetX: 30,
    });

    lMax.setAttrs({
      text: maxVal.toFixed(0),
      x: x + c.trackWidth + c.labelGap,
      y: y - c.fontSize / 2,
      fontSize: c.fontSize,
      fill: c.labelColor,
    });

    // Drag constraints
    thumb.dragBoundFunc((pos) => {
      const stage = this.getStage();
      if (!stage) return pos;

      // Convert absolute stage position to local group position
      const transform = this.getAbsoluteTransform().copy().invert();
      const localPos = transform.point(pos);

      const clampedX = this.clamp(localPos.x, x, x + c.trackWidth);

      // Convert back to absolute for the return value
      return this.getAbsoluteTransform().point({ x: clampedX, y });
    });
  }

  /* ---------------- Logic & Events ---------------- */

  private bindLogic() {
    const handleDrag = (
      axis: "x" | "y",
      thumb: Konva.Circle,
      track: Konva.Rect
    ) => {
      const localX = thumb.x() - track.x();
      const val = this.xToValue(
        localX,
        axis === "x" ? this.minX : this.minY,
        axis === "x" ? this.maxX : this.maxY
      );
      this.tracker[axis].value = val;
    };

    this.thumbX.on("dragmove", () => handleDrag("x", this.thumbX, this.trackX));
    this.thumbY.on("dragmove", () => handleDrag("y", this.thumbY, this.trackY));

    // Click track to move thumb
    [this.trackX, this.trackY].forEach((track) => {
      track.on("mousedown touchstart", () => {
        const stage = this.getStage();
        const pointer = stage?.getPointerPosition();
        if (!pointer) return;

        const localPos = this.getAbsoluteTransform()
          .copy()
          .invert()
          .point(pointer);
        const axis = track === this.trackX ? "x" : "y";
        const thumb = axis === "x" ? this.thumbX : this.thumbY;

        thumb.x(
          this.clamp(localPos.x, track.x(), track.x() + this.config.trackWidth)
        );
        handleDrag(axis, thumb, track);
      });
    });

    this.tracker.x.addHiddenUpdater("ptslider-sync-x", () =>
      this.syncThumbFromValue()
    );
    this.tracker.y.addHiddenUpdater("ptslider-sync-y", () =>
      this.syncThumbFromValue()
    );
  }

  public syncThumbFromValue() {
    this.thumbX.x(
      this.trackX.x() +
        this.valueToX(this.tracker.x.value, this.minX, this.maxX)
    );
    this.thumbY.x(
      this.trackY.x() +
        this.valueToX(this.tracker.y.value, this.minY, this.maxY)
    );
  }

  private syncInitial() {
    this.syncThumbFromValue();
    this.opacity(0);
    this.scale({ x: 0.8, y: 0.8 });
  }

  getMinX() {
    return this.minX;
  }
  getMaxX() {
    return this.maxX;
  }
  getMinY() {
    return this.minY;
  }
  getMaxY() {
    return this.maxY;
  }
  getRank() {
    return this._rank;
  }

  /* ---------------- Public API ---------------- */

  setXValue(v: number) {
    this.tracker.x.value = this.clamp(v, this.minX, this.maxX);
    this.syncThumbFromValue();
  }

  setYValue(v: number) {
    this.tracker.y.value = this.clamp(v, this.minY, this.maxY);
    this.syncThumbFromValue();
  }

  update({
    minX,
    maxX,
    minY,
    maxY,
    rank,
  }: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    rank: number;
  }) {
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this._rank = rank;
    this.buildUI();
  }

  setRange(minX: number, maxX: number, minY: number, maxY: number) {
    this.update({ minX, maxX, minY, maxY, rank: this._rank });
  }

  getXValue() {
    return this.tracker.x.value;
  }

  getYValue() {
    return this.tracker.y.value;
  }

  /* ---------------- Animations ---------------- */

  disappearAnim() {
    return createTimer({
      duration: 500,
      autoplay: false,
      onUpdate: (t) => {
        const progress = t.progress;
        const transformedProgress = easings.eases.outInSine(progress);
        this.opacity(1.0 - transformedProgress);
        this.scaleX(1.0 - transformedProgress);
        this.scaleY(1.0 - transformedProgress);
      },
    });
  }

  appearAnim() {
    return createTimer({
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
  }

  storeAsObj() {
    return {
      minX: this.minX,
      maxX: this.maxX,
      minY: this.minY,
      maxY: this.maxY,
      rank: this._rank,
    };
  }

  loadFromObj(obj: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    rank: number;
  }) {
    this.minX = obj.minX;
    this.maxX = obj.maxX;
    this.minY = obj.minY;
    this.maxY = obj.maxY;
    this._rank = obj.rank;
    this.buildUI();
  }
}
