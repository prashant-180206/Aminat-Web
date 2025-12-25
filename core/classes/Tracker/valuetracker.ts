import Konva from "@/lib/konva";

type UpdateCallback = (value: number) => void;

export class ValueTracker {
  private _value: number;
  private UpdateFuncs: Map<string, UpdateCallback> = new Map();

  constructor(initialValue: number) {
    this._value = initialValue;
  }

  get value(): number {
    return this._value;
  }

  set value(v: number) {
    this._value = v;
    this.UpdateFuncs.forEach((cb) => cb(v));
  }

  /**
   * Register a callback that runs every frame
   */
  addUpdater(id: string, cb: UpdateCallback): void {
    this.UpdateFuncs.set(id, cb);
  }

  getUpdaterIds(): string[] {
    return Array.from(this.UpdateFuncs.keys());
  }

  removeUpdater(id: string): void {
    this.UpdateFuncs.delete(id);
  }

  /**
   * Animate the value using a Konva Tween
   */
  animateTo(
    target: number,
    config: {
      duration?: number;
      easing?: (t: number) => number;
      onFinish?: () => void;
    } = {}
  ): Konva.Tween {
    const proxy = { v: this._value };

    const tween = new Konva.Tween({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      node: proxy as any,
      v: target,
      duration: config.duration ?? 1,
      easing: config.easing ?? Konva.Easings.EaseInOut,
      onUpdate: () => {
        this.value = proxy.v;
      },
      onFinish: config.onFinish,
    });

    return tween;
  }
}
