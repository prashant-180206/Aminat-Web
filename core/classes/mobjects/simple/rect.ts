// anim/classes/mobjects/simple/rect.ts
import { DEFAULT_SCALE } from "@/core/config";
import { RectangleProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
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
      zindex: 0,
      opacity: 1,
      ...config,
    };

    this.updateFromProperties();
    this.name("Rect");
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
      zindex,
      opacity,
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
    if (cornerRadius >= 0) this.cornerRadius(cornerRadius);
    this.opacity(opacity);
    this.zIndex(zindex);
  }
  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = c2p(
      pos.x + this.width() / 2,
      pos.y + this.height() / 2
    );
    this._properties.width =
      this.width() / (this._properties.scale * DEFAULT_SCALE);
    this._properties.height =
      this.height() / (this._properties.scale * DEFAULT_SCALE);
    // this._properties.color = this.fill() as string;
    // this._properties.bordercolor = this.stroke() as string;
    // this._properties.thickness = this.strokeWidth();
    // this._properties.cornerRadius = this.cornerRadius() as number;
    this._properties.rotation = this.rotation();
    // this._properties.opacity = this.opacity();/
    // this._properties.zindex = this.zIndex();
  }
}
