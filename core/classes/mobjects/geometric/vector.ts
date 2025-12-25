// anim/classes/mobjects/vector.ts
import { AnimGetter } from "@/core/classes/animation/animgetter";
import { VectorProperties } from "@/core/types/properties";
import { p2c } from "@/core/utils/conversion";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/TrackerConnector";

export class MVector extends Konva.Arrow {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _properties: VectorProperties;

  constructor(config: Partial<VectorProperties> = {}) {
    super({
      tension: 0,
      lineCap: "round",
      lineJoin: "round",
      points: [0, 0, 100, 100],
    });

    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    this._properties = {
      position: { x: 0, y: 0 },
      color: "red",
      scale: 1,
      rotation: 0,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
      thickness: 3,
      opacity: 1,
      zindex: 0,
      pointerSize: 10,
      ...config,
    };

    this.updateFromProperties();
    this.name("Vector");
  }

  // Getter/Setter for properties
  get properties(): VectorProperties {
    return { ...this._properties };
  }

  set properties(newProps: Partial<VectorProperties>) {
    Object.assign(this._properties, newProps);
    this.updateFromProperties();
  }

  private updateFromProperties() {
    const {
      position,
      color,
      scale,
      rotation,
      start,
      end,
      thickness,
      pointerSize,
    } = this._properties;

    // Convert points to canvas coordinates
    const canvasStart = { x: start.x * scale, y: start.y * scale };
    const canvasEnd = { x: end.x * scale, y: end.y * scale };

    const st = p2c(canvasStart.x, canvasStart.y);
    const en = p2c(canvasEnd.x, canvasEnd.y);

    this.points([st.x, st.y, en.x, en.y]);
    this.stroke(color);
    this.fill(color); // arrow head color
    this.strokeWidth(thickness * scale);
    this.pointerLength(pointerSize * scale);
    this.pointerWidth(pointerSize * scale);
    this.position(position);
    this.rotation(rotation);
  }

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = p2c(pos.x, pos.y);
    // this._properties.thickness = this.strokeWidth();
    // this._properties.color = this.stroke() as string;
    this._properties.scale = this.scaleX();
    this._properties.rotation = this.rotation();
  }
}
