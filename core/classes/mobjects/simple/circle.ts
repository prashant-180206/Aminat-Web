import { DEFAULT_SCALE } from "@/core/config";
import { AnimGetter } from "@/core/classes/animation/animgetter";
// import Konva from "konva";
import { c2p, p2c } from "@/core/utils/conversion";
import { CircleProperties } from "@/core/types/properties";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { Konva } from "@/lib/konva";
import { MobjectData } from "@/core/types/file";
import { Colors } from "@/core/utils/colors";

class MCircle extends Konva.Circle {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _properties: CircleProperties = {
    radius: 2,
    color: Colors.FILL,
    bordercolor: Colors.BORDER,
    thickness: 4,
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    opacity: 1,
    zindex: 0,
  };
  private _TYPE: string;

  constructor(TYPE: string, config?: Konva.CircleConfig) {
    super(config);
    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);
    this.radius(this._properties.radius * DEFAULT_SCALE);
    this.fill(this._properties.color);
    this.stroke(this._properties.bordercolor);
    this.strokeWidth(this._properties.thickness);
    this.position(p2c(0, 0));
    this.name("Circle");

    this.trackerconnector.addConnectorFunc("radius", (value: number) => {
      this.properties = { radius: value };
    });
  }

  type(): string {
    return this._TYPE;
  }

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = c2p(pos.x, pos.y);
    this._properties.radius = this.radius() / DEFAULT_SCALE;
    this._properties.color = this.fill() as string;
    this._properties.scale = this.scaleX();
    this._properties.rotation = this.rotation();
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
    if (value.zindex !== undefined && this.parent) this.zIndex(value.zindex);
  }

  storeAsObj(): MobjectData {
    return {
      properties: this._properties,
      id: this.id(),
    };
  }

  loadFromObj(obj: MobjectData) {
    this.properties = obj.properties as CircleProperties;
    this.UpdateFromKonvaProperties();
  }
}

export default MCircle;
