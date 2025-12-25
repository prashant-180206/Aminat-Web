// core/animation/TrackerManager.ts
// /* eslint-disable @typescript-eslint/no-explicit-any */
import Konva from "@/lib/konva";
import { ValueTracker } from "./valuetracker";
import { Slider } from "./slider";
// import { ValueTracker } from "./ValueTracker";
// import { Slider } from "@/ui/slider";

type TrackerEntry = {
  tracker: ValueTracker;
  slider?: Slider;
};

type AddTrackerOptions = {
  initial: number;
  min?: number;
  max?: number;

  slider?: {
    width?: number;
    height?: number;
    trackColor?: string;
    thumbColor?: string;
    thumbRadius?: number;
    position?: { x: number; y: number };
  };
};

export class TrackerManager {
  private trackers = new Map<string, TrackerEntry>();
  private layer: Konva.Layer;

  constructor(layer: Konva.Layer) {
    this.layer = layer;
  }

  /* ------------------------------------------------------- */
  /* Registration                                            */
  /* ------------------------------------------------------- */

  addValueTracker(name: string, options: AddTrackerOptions): ValueTracker {
    if (this.trackers.has(name)) {
      throw new Error(`ValueTracker "${name}" already exists`);
    }

    const tracker = new ValueTracker(options.initial);

    let slider: Slider | undefined;

    if (options.slider) {
      slider = new Slider(tracker, {
        min: options.min,
        max: options.max,
        width: options.slider.width,
        height: options.slider.height,
        trackColor: options.slider.trackColor,
        thumbColor: options.slider.thumbColor,
        thumbRadius: options.slider.thumbRadius,
        initial: options.initial,
      });

      slider.position(options.slider.position ?? { x: 0, y: 0 });
      this.layer.add(slider);
    }

    this.trackers.set(name, { tracker, slider });
    return tracker;
  }

  /* ------------------------------------------------------- */
  /* Lookup                                                  */
  /* ------------------------------------------------------- */

  getTracker(name: string): ValueTracker | undefined {
    return this.trackers.get(name)?.tracker;
  }

  getSlider(name: string): Slider | undefined {
    return this.trackers.get(name)?.slider;
  }

  getAllNames(): string[] {
    return Array.from(this.trackers.keys());
  }

  /* ------------------------------------------------------- */
  /* Animation helpers                                       */
  /* ------------------------------------------------------- */

  animateTrackerTo(
    name: string,
    target: number,
    config?: {
      duration?: number;
      easing?: (t: number) => number;
      onFinish?: () => void;
    }
  ): Konva.Tween | null {
    const tracker = this.getTracker(name);
    if (!tracker) return null;

    return tracker.animateTo(target, config);
  }

  animateSliderIn(
    name: string,
    config: {
      duration?: number;
      easing?: (t: number) => number;
      fromX?: number;
    } = {}
  ): Konva.Tween | null {
    const slider = this.getSlider(name);
    if (!slider) return null;

    const originalX = slider.x();
    const fromX = config.fromX ?? originalX - 50;

    slider.x(fromX);
    slider.opacity(0);

    return new Konva.Tween({
      node: slider,
      x: originalX,
      opacity: 1,
      duration: config.duration ?? 0.4,
      easing: config.easing ?? Konva.Easings.EaseOut,
    });
  }

  animateSliderOut(
    name: string,
    config: {
      duration?: number;
      easing?: (t: number) => number;
      fromX?: number;
    } = {}
  ): Konva.Tween | null {
    const slider = this.getSlider(name);
    if (!slider) return null;

    const originalX = slider.x();
    const fromX = config.fromX ?? originalX + 50;

    slider.x(fromX);
    // slider.opacity();

    return new Konva.Tween({
      node: slider,
      x: originalX,
      opacity: 0,
      duration: config.duration ?? 0.4,
      easing: config.easing ?? Konva.Easings.EaseOut,
    });
  }

  /* ------------------------------------------------------- */
  /* Removal / cleanup                                       */
  /* ------------------------------------------------------- */

  remove(name: string) {
    const entry = this.trackers.get(name);
    if (!entry) return;

    entry.slider?.destroy();
    this.trackers.delete(name);
  }

  clear() {
    this.trackers.forEach((entry) => {
      entry.slider?.destroy();
    });
    this.trackers.clear();
  }

  //   Extra Functions (if any) can be added here
  // core/animation/TrackerManager.ts
  addValueTrackerWithSlider(
    name: string,
    options: AddTrackerOptions
  ): { tracker: ValueTracker; slider?: Slider } {
    const tracker = this.addValueTracker(name, {
      ...options,
      slider: undefined, // prevent auto-adding to layer
    });

    let slider: Slider | undefined;

    if (options.slider) {
      slider = new Slider(tracker, {
        min: options.min,
        max: options.max,
        width: options.slider.width,
        height: options.slider.height,
        trackColor: options.slider.trackColor,
        thumbColor: options.slider.thumbColor,
        thumbRadius: options.slider.thumbRadius,
        initial: options.initial,
      });
    }

    return { tracker, slider };
  }
}
