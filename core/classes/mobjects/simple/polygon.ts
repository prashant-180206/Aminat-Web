// anim/classes/mobjects/simple/polygon.ts
import { AnimGetter } from "@/core/classes/animation/animgetter";
import { PolygonProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { Colors } from "@/core/utils/colors";
import { DEFAULT_SCALE } from "@/core/config";
// import { set } from "animejs";

export class MPolygon extends Konva.Shape {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _properties: PolygonProperties = {
    position: { x: 0, y: 0 },
    color: Colors.PRIMARY,
    scale: 1,
    rotation: 0,
    points: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ],
    bordercolor: Colors.BORDER,
    thickness: 3,
    zindex: 0,
    opacity: 1,
  };
  private _TYPE: string;
  private localPoints: { x: number; y: number }[] = [];

  constructor(TYPE: string, config: Partial<PolygonProperties> = {}) {
    super({
      lineCap: "round",
      lineJoin: "round",
      draggable: true,
    });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    this._properties = {
      ...this._properties,
      ...config,
    };

    this.properties = this._properties;
    this.name("Polygon");
  }

  type(): string {
    return this._TYPE;
  }

  // Getter/Setter for properties
  get properties(): PolygonProperties {
    return { ...this._properties };
  }

  set properties(value: Partial<PolygonProperties>) {
    Object.assign(this._properties, value);
    if (value.position) this.position(p2c(value.position.x, value.position.y));
    if (value.points) {
      this.localPoints = value.points.map((pt) => {
        return { x: pt.x * DEFAULT_SCALE, y: -pt.y * DEFAULT_SCALE };
      });
      this.setUpGeometry();
    }
    if (value.scale) this.scale({ x: value.scale, y: value.scale });
    if (value.rotation) this.rotation(value.rotation);
    if (value.thickness) this.strokeWidth(value.thickness);
    if (value.opacity) this.opacity(value.opacity);
    if (this.parent && value.zindex) this.zIndex(value.zindex);
    if (value.color) this.fill(value.color);
    // this.updateFromProperties();
  }

  private setUpGeometry() {
    this.sceneFunc((context, shape) => {
      if (this.localPoints.length < 3) return;
      context.beginPath();
      context.moveTo(this.localPoints[0].x, this.localPoints[0].y);
      for (let i = 1; i < this.localPoints.length; i++) {
        context.lineTo(this.localPoints[i].x, this.localPoints[i].y);
      }
      context.closePath();
      context.fillStyle = this._properties.color;
      context.fill();
      context.lineWidth = this._properties.thickness;
      context.strokeStyle =
        this._properties.bordercolor || this._properties.color;
      context.stroke();
      context.fillStrokeShape(shape);
    });

    this.hitFunc((context, shape) => {
      if (this.localPoints.length < 3) return;
      context.beginPath();
      context.moveTo(this.localPoints[0].x, this.localPoints[0].y);
      for (let i = 1; i < this.localPoints.length; i++) {
        context.lineTo(this.localPoints[i].x, this.localPoints[i].y);
      }
      context.closePath();
      context.fillStrokeShape(shape);
    });
  }

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = c2p(pos.x, pos.y);
    this._properties.scale = this.scaleX();
    this._properties.rotation = this.rotation();
  }

  storeAsObj() {
    return {
      properties: this._properties,
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.properties = obj.properties as PolygonProperties;
    this.UpdateFromKonvaProperties();
  }
}
