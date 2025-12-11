// anim/classes/mobjects/simple/rect.ts
import { DEFAULT_SCALE } from "@/core/config";
import { RectangleProperties } from "@/core/types/properties";
import { p2c } from "@/core/utils/conversion";
import { Konva } from "@/lib/konva";

export class MRect extends Konva.Rect {
  private _properties: RectangleProperties;

  constructor(config: Partial<RectangleProperties> = {}) {
    super({
      cornerRadius: 0,
      lineCap: "round",
      lineJoin: "round",
    });

    this._properties = {
      position: { x: 0, y: 0 },
      color: "blue",
      scale: 1,
      rotation: 0,
      width: 3,
      height: 2,
      bordercolor: "black",
      thickness: 2,
      cornerRadius: 0,
      ...config,
    };

    this.updateFromProperties();
  }

  // Getter/Setter for properties
  get properties(): RectangleProperties {
    return { ...this._properties };
  }

  set properties(newProps: Partial<RectangleProperties>) {
    Object.assign(this._properties, newProps);
    this.updateFromProperties();
  }

  private updateFromProperties() {
    const {
      position,
      color,
      scale,
      rotation,
      width,
      height,
      bordercolor,
      thickness,
      cornerRadius,
    } = this._properties;

    this.fill(color);
    this.stroke(bordercolor);
    this.strokeWidth(thickness);
    this.width(width * scale * DEFAULT_SCALE);
    this.height(height * scale * DEFAULT_SCALE);
    const pos = p2c(position.x, position.y);
    this.position({
      x: pos.x - this.width() / 2,
      y: pos.y - this.height() / 2,
    });
    this.rotation(rotation);
    this.cornerRadius(cornerRadius);
  }
}
