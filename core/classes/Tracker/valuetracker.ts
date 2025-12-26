import { easingMap } from "@/core/maps/easingMap";
import Konva from "@/lib/konva";
import { compile, EvalFunction } from "mathjs";

type UpdateCallback = (value: number) => void;

type UpdaterEntry = {
  cb: UpdateCallback;
  expr: EvalFunction;
};

export class ValueTracker {
  private _value: number;
  private updaters: Map<string, UpdaterEntry> = new Map();

  constructor(initialValue: number) {
    this._value = initialValue;
  }

  get value(): number {
    return this._value;
  }

  set value(v: number) {
    if (Math.abs(this._value - v) < 0.001) return;

    this._value = v;

    this.updaters.forEach(({ cb, expr }) => {
      const evaluated = expr.evaluate({ t: v });
      cb(evaluated);
    });
  }

  /**
   * Add updater with optional expression f(t)
   * Default: identity mapping
   */
  addUpdater(
    id: string,
    cb: (value: number) => void,
    expression: string = "t"
  ): boolean {
    try {
      const compiled = compile(expression);

      // Validate once
      compiled.evaluate({ t: this._value });

      this.updaters.set(id, {
        cb,
        expr: compiled,
      });

      // Run once immediately
      cb(compiled.evaluate({ t: this._value }));

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // console.error(`Invalid expression for updater "${id}"`, e);
      return false;
    }
  }

  getUpdaterIds(): string[] {
    return [...this.updaters.keys()];
  }

  removeUpdater(id: string): void {
    this.updaters.delete(id);
  }

  /**
   * Animate the tracker value
   */
  animateTo(
    target: number,
    config: {
      duration?: number;
      easing?: string;
      onFinish?: () => void;
    } = {}
  ): Konva.Tween {
    const proxy = { v: this._value };

    return new Konva.Tween({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      node: proxy as any,
      v: target,
      duration: config.duration ?? 1,
      easing:
        easingMap[config.easing ?? "EaseInOut"] ?? Konva.Easings.EaseInOut,
      onUpdate: () => {
        this.value = proxy.v;
      },
      onFinish: config.onFinish,
    });
  }
}
