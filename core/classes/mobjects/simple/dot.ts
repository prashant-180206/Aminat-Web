// anim/classes/mobjects/simple/dot.ts
import { DotProperties } from "@/core/types/properties";
import { Konva } from "@/lib/konva";
// import type { Point } from './parametricCurve';

export class Dot extends Konva.Circle {
  private _properties: DotProperties;

  constructor(config: Partial<DotProperties> = {}) {
    super({
      lineCap: "round",
      lineJoin: "round",
    });

    this._properties = {
      position: { x: 0, y: 0 },
      color: "red",
      scale: 1,
      rotation: 0,
      radius: 6,
      ...config,
    };

    this.updateFromProperties();
  }

  // Getter/Setter for properties
  get properties(): DotProperties {
    return { ...this._properties };
  }

  set properties(newProps: Partial<DotProperties>) {
    Object.assign(this._properties, newProps);
    this.updateFromProperties();
  }

  private updateFromProperties() {
    const { position, color, scale, rotation, radius } = this._properties;

    this.fill(color);
    this.strokeWidth(0);
    this.radius(radius * scale);
    this.position(position);
    this.rotation(rotation);
  }
}
