// anim/classes/mobjects/simple/dot.ts
// import { DEFAULT_SCALE } from "@/core/config";
// import { DEFAULT_SCALE } from "@/core/config";
import { DotProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
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
      zindex: 0,
      opacity: 1,
      ...config,
    };

    this.updateFromProperties();
    this.name("Dot");
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
    const { position, color, scale, rotation, radius, opacity, zindex } =
      this._properties;

    this.fill(color);
    this.strokeWidth(0);
    this.radius(radius * scale);
    this.position(p2c(position.x, position.y));
    this.rotation(rotation);
    this.opacity(opacity);
    this.zIndex(zindex);
  }

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = c2p(pos.x, pos.y);
    // this._properties.radius = this.radius();
    // this._properties.color = this.fill() as string;
    this._properties.scale = this.scaleX();
    this._properties.rotation = this.rotation();
    // this._properties.opacity = this.opacity();
    // this._properties.zindex = this.zIndex();
  }
}
