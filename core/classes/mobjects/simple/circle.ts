import { DEFAULT_SCALE } from "@/core/config";
import Konva from "konva";
import Scene from "../../scene";

interface MCircleProperties {
  radius: number;
  color: string;
  bordercolor: string;
  thickness: number;
  position: { x: number; y: number };
}

class MCircle extends Konva.Circle {
  private _properties: MCircleProperties = {
    radius: 2,
    color: "blue",
    bordercolor: "black",
    thickness: 4,
    position: { x: 0, y: 0 },
  };

  constructor(config?: Konva.CircleConfig) {
    super(config);
    this.radius(this._properties.radius * DEFAULT_SCALE);
    this.fill(this._properties.color);
    this.stroke(this._properties.bordercolor);
    this.strokeWidth(this._properties.thickness);
    this.position({ x: 0, y: 0 });
  }

  // Object getter - returns copy to prevent mutation
  get properties(): MCircleProperties {
    return { ...this._properties };
  }

  // Object setter - accepts full or partial properties object
  set properties(value: Partial<MCircleProperties>) {
    Object.assign(this._properties, value);

    // Sync Konva properties
    if (value.radius !== undefined) {
      this.radius(value.radius * DEFAULT_SCALE);
    }
    if (value.color !== undefined) this.fill(value.color);
    if (value.bordercolor !== undefined) this.stroke(value.bordercolor);
    if (value.thickness !== undefined) this.strokeWidth(value.thickness);
    if (value.position !== undefined) {
      const newpos = Scene.p2c(
        value.position.x ?? this._properties.position.x,
        value.position.y ?? this._properties.position.y
      );
      this.position({ x: newpos.x, y: newpos.y });
    }
  }
}

export default MCircle;
