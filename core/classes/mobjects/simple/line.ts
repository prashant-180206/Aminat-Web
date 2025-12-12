// anim/classes/mobjects/simple/line.ts
import { LineProperties } from "@/core/types/properties";
import { p2c } from "@/core/utils/conversion";
import Konva from "@/lib/konva";

export class MLine extends Konva.Line {
  private _properties: LineProperties;

  constructor(config: Partial<LineProperties> = {}) {
    super({
      tension: 0,
      lineCap: "round",
      lineJoin: "round",
    });

    this._properties = {
      position: { x: 0, y: 0 },
      color: "red",
      scale: 1,
      rotation: 0,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
      thickness: 3,

      ...config,
    };

    this.updateFromProperties();
    this.name("Line");
  }

  // Getter/Setter for properties
  get properties(): LineProperties {
    return { ...this._properties };
  }

  set properties(newProps: Partial<LineProperties>) {
    Object.assign(this._properties, newProps);
    this.updateFromProperties();
  }

  private updateFromProperties() {
    const { position, color, scale, rotation, start, end, thickness } =
      this._properties;

    // Convert points to canvas coordinates
    const canvasStart = { x: start.x * scale, y: start.y * scale };
    const canvasEnd = { x: end.x * scale, y: end.y * scale };

    const st = p2c(canvasStart.x, canvasStart.y);
    const en = p2c(canvasEnd.x, canvasEnd.y);

    this.points([st.x, st.y, en.x, en.y]);
    this.stroke(color);
    this.strokeWidth(thickness * scale);
    this.position(position);
    this.rotation(rotation);
  }
}
