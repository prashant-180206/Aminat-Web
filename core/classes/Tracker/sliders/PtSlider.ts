import Konva from "@/lib/konva";
import { Slider } from "./slider";
import { ValueTracker } from ".././valuetracker";

export class PtSlider extends Konva.Group {
  private _minX: number;
  private _maxX: number;
  private _minY: number;
  private _maxY: number;

  readonly xTracker: ValueTracker;
  readonly yTracker: ValueTracker;

  private background: Konva.Rect;
  private xSlider: Slider;
  private ySlider: Slider;

  constructor(
    x: { min: number; max: number },
    y: { min: number; max: number }
  ) {
    super({
      name: "pt-slider",
    });

    this._minX = x.min;
    this._maxX = x.max;
    this._minY = y.min;
    this._maxY = y.max;

    /* ---------------- Trackers ---------------- */

    this.xTracker = new ValueTracker((x.min + x.max) / 2);
    this.yTracker = new ValueTracker((y.min + y.max) / 2);

    const sliderWidth = 220;
    const sliderSpacing = 28;
    const padding = 16;

    const totalHeight = padding * 2 + sliderSpacing * 2 + 60;

    /* ---------------- Background ---------------- */

    this.background = new Konva.Rect({
      x: 0,
      y: 0,
      width: sliderWidth + padding * 2,
      height: totalHeight,
      fill: "#1f1f1f",
      cornerRadius: 14,
      listening: false,
    });

    /* ---------------- Labels ---------------- */

    const xLabel = new Konva.Text({
      text: "X",
      x: padding,
      y: padding,
      fontSize: 13,
      fill: "#e5e5e5",
      fontStyle: "bold",
    });

    const yLabel = new Konva.Text({
      text: "Y",
      x: padding,
      y: padding + sliderSpacing + 60,
      fontSize: 13,
      fill: "#e5e5e5",
      fontStyle: "bold",
    });

    /* ---------------- Sliders ---------------- */

    this.xSlider = new Slider(this.xTracker, {
      min: this._minX,
      max: this._maxX,
      width: sliderWidth,
      trackColor: "#4b5563",
      thumbColor: "#f9fafb",
    });

    this.ySlider = new Slider(this.yTracker, {
      min: this._minY,
      max: this._maxY,
      width: sliderWidth,
      trackColor: "#4b5563",
      thumbColor: "#f9fafb",
    });

    this.xSlider.position({
      x: padding,
      y: padding + 28,
    });

    this.ySlider.position({
      x: padding,
      y: padding + 28 + sliderSpacing + 60,
    });

    /* ---------------- Add Order ---------------- */

    this.add(this.background, xLabel, this.xSlider, yLabel, this.ySlider);

    /* ---------------- Entry Animation State ---------------- */

    this.opacity(0);
    this.scale({ x: 0.9, y: 0.9 });
  }

  /* ---------------- API ---------------- */

  getX() {
    return this.xTracker.value;
  }

  getY() {
    return this.yTracker.value;
  }

  getminX() {
    return this._minX;
  }

  getmaxX() {
    return this._maxX;
  }

  getminY() {
    return this._minY;
  }

  getmaxY() {
    return this._maxY;
  }

  /* ---------------- Animations ---------------- */

  appearAnim(): Konva.Tween {
    return new Konva.Tween({
      node: this,
      opacity: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 0.7,
      easing: Konva.Easings.EaseOut,
    });
  }

  disappearAnim(): Konva.Tween {
    return new Konva.Tween({
      node: this,
      opacity: 0,
      scaleX: 0.9,
      scaleY: 0.9,
      duration: 0.5,
      easing: Konva.Easings.EaseIn,
    });
  }
}
