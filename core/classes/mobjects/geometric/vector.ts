// anim/classes/mobjects/vector.ts
import { AnimGetter } from "@/core/classes/animation/animgetter";
import { VectorProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { MobjectAnimAdder } from "../../factories/mobjects/addAnimations";
import { Colors } from "@/core/utils/colors";
// import { easingMap } from "@/core/maps/easingMap";

export class MVector extends Konva.Arrow {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _properties: VectorProperties;
  private _TYPE: string;

  constructor(TYPE: string, config: Partial<VectorProperties> = {}) {
    super({
      tension: 0,
      lineCap: "round",
      lineJoin: "round",
      points: [0, 0, 100, 100],
    });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    this._properties = {
      position: { x: 0, y: 0 },
      color: Colors.PRIMARY,
      scale: 1,
      rotation: 0,
      lineEnds: {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      },
      thickness: 3,
      opacity: 1,
      zindex: 0,
      pointerSize: 10,
      ...config,
    };

    this.trackerconnector.addConnectorFunc("startX", (value: number) => {
      this.properties = {
        lineEnds: {
          ...this._properties.lineEnds,
          start: { x: value, y: this._properties.lineEnds.start.y },
        },
      };
    });

    this.trackerconnector.addConnectorFunc("startY", (value: number) => {
      this.properties = {
        lineEnds: {
          ...this._properties.lineEnds,
          start: { x: this._properties.lineEnds.start.x, y: value },
        },
      };
    });

    this.trackerconnector.addConnectorFunc("endX", (value: number) => {
      this.properties = {
        lineEnds: {
          ...this._properties.lineEnds,
          end: { x: value, y: this._properties.lineEnds.end.y },
        },
      };
    });

    this.trackerconnector.addConnectorFunc("endY", (value: number) => {
      this.properties = {
        lineEnds: {
          ...this._properties.lineEnds,
          end: { x: this._properties.lineEnds.end.x, y: value },
        },
      };
    });

    this.updateFromProperties();
    MobjectAnimAdder.addLineAnimations(this);
    this.name("Vector");
  }

  type(): string {
    return this._TYPE;
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
      lineEnds: { start, end },
      thickness,
      pointerSize,
      zindex,
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
    if (this.parent) this.zIndex(zindex);
  }

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = { x: pos.x, y: pos.y };
    const pts = this.points();
    const startCanvas = c2p(pts[0], pts[1]);
    const endCanvas = c2p(pts[2], pts[3]);
    this._properties.lineEnds.start = {
      x: startCanvas.x / this._properties.scale,
      y: startCanvas.y / this._properties.scale,
    };
    this._properties.lineEnds.end = {
      x: endCanvas.x / this._properties.scale,
      y: endCanvas.y / this._properties.scale,
    };
  }

  storeAsObj() {
    return {
      properties: this._properties,
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.properties = obj.properties as VectorProperties;
    this.UpdateFromKonvaProperties();
  }
}
