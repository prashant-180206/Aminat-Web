import { DEFAULT_SCALE } from "@/core/config";
// import Konva from "konva";
import { c2p, p2c } from "@/core/utils/conversion";
import { CircleProperties } from "@/core/types/properties";
import { Konva } from "@/lib/konva";

class MCircle extends Konva.Circle {
  private _properties: CircleProperties = {
    radius: 2,
    color: "blue",
    bordercolor: "black",
    thickness: 4,
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    opacity: 1,
    zindex: 0,
  };

  constructor(config?: Konva.CircleConfig) {
    super(config);
    this.radius(this._properties.radius * DEFAULT_SCALE);
    this.fill(this._properties.color);
    this.stroke(this._properties.bordercolor);
    this.strokeWidth(this._properties.thickness);
    this.position(p2c(0, 0));
    // this.rotation(this._properties.rotation);
    this.name("Circle");
  }

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = c2p(
      pos.x + this.radius(),
      pos.y + this.radius()
    );
    this._properties.radius = this.radius() / DEFAULT_SCALE;
    this._properties.color = this.fill() as string;
    // this._properties.bordercolor = this.stroke() as string;
    // this._properties.thickness = this.strokeWidth();
    // this._properties.opacity = this.opacity();
    this._properties.scale = this.scaleX();
    this._properties.rotation = this.rotation();
    // this._properties.zindex = this.zIndex();
  }

  // Object getter - returns copy to prevent mutation
  get properties(): CircleProperties {
    return { ...this._properties };
  }

  // Object setter - accepts full or partial properties object
  set properties(value: Partial<CircleProperties>) {
    Object.assign(this._properties, value);

    // Sync Konva properties
    if (value.radius !== undefined) {
      this.radius(value.radius * DEFAULT_SCALE);
    }
    if (value.color !== undefined) this.fill(value.color);
    if (value.bordercolor !== undefined) this.stroke(value.bordercolor);
    if (value.thickness !== undefined) this.strokeWidth(value.thickness);
    if (value.position !== undefined) {
      const newpos = p2c(
        value.position.x ?? this._properties.position.x,
        value.position.y ?? this._properties.position.y
      );
      this.position({ x: newpos.x, y: newpos.y });
    }
    if (value.opacity !== undefined) this.opacity(value.opacity);
    if (value.scale !== undefined)
      this.scale({ x: value.scale, y: value.scale });
    if (value.rotation !== undefined) this.rotation(value.rotation);
    if (value.zindex !== undefined) this.zIndex(value.zindex);
  }
}

export default MCircle;
