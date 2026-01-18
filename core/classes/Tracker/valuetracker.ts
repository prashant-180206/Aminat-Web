// /* eslint-disable @typescript-eslint/no-explicit-any */

import { compile, EvalFunction } from "mathjs";

type UpdateCallback = (value: number) => void;

type UpdaterEntry = {
  cb: UpdateCallback;
  expr: EvalFunction;
};

export class ValueTracker {
  private _value: number;
  private updaters: Map<string, UpdaterEntry> = new Map();

  private hiddenUpdaters: Map<string, UpdateCallback> = new Map();

  constructor(initialValue: number) {
    this._value = initialValue;
  }

  get value(): number {
    return this._value;
  }

  set value(v: number) {
    if (Math.abs(this._value - v) < 0.002) return;

    this._value = v;

    this.updaters.forEach(({ cb, expr }) => {
      const evaluated = expr.evaluate({ t: v });
      cb(evaluated);
    });

    this.hiddenUpdaters.forEach((cb) => {
      cb(v);
    });
  }

  /**
   * Add updater with optional expression f(t)
   * Default: identity mapping
   */
  addUpdater(
    id: string,
    cb: (value: number) => void,
    expression: string = "t",
  ): boolean {
    try {
      if (this.updaters.has(id)) {
        return false;
      }
      // console.log("Adding updater with expression:", expression, id);
      const compiled = compile(expression);
      compiled.evaluate({ t: this._value });
      this.updaters.set(id, {
        cb,
        expr: compiled,
      });
      cb(compiled.evaluate({ t: this._value }));
      return true;
    } catch {
      return false;
    }
  }

  addHiddenUpdater(id: string, cb: (value: number) => void): boolean {
    if (this.hiddenUpdaters.has(id)) {
      return false;
    }
    this.hiddenUpdaters.set(id, cb);
    cb(this._value);
    return true;
  }

  removeHiddenUpdater(id: string): void {
    this.hiddenUpdaters.delete(id);
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
}
