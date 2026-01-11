// anim/classes/mobjects/simple/rect.ts
import { AnimGetter } from "@/core/classes/animation/animgetter";
import { DEFAULT_SCALE } from "@/core/config";
import { RectangleProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
import { Konva } from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { Colors } from "@/core/utils/colors";

export class MRect extends Konva.Rect {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _properties: RectangleProperties = {
    position: { x: 0, y: 0 },
    color: Colors.FILL,
    scale: 1,
    rotation: 0,
    dimensions: {
      width: 3,
      height: 2,
    },
    bordercolor: Colors.BORDER,
    thickness: 6,
    cornerRadius: 0,
    zindex: 0,
    opacity: 1,
  };
  private _TYPE: string;

  constructor(TYPE: string, config: Partial<RectangleProperties> = {}) {
    super({
      cornerRadius: 0,
      lineCap: "round",
      lineJoin: "round",
    });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    this._properties = { ...this._properties, ...config };

    this.properties = this._properties;
    this.name("Rect");
  }

  type(): string {
    return this._TYPE;
  }

  // Getter/Setter for properties
  get properties(): RectangleProperties {
    return { ...this._properties };
  }

  set properties(value: Partial<RectangleProperties>) {
    Object.assign(this._properties, value);
    if (value.dimensions) {
      this.width(this._properties.dimensions.width * DEFAULT_SCALE);
      this.height(this._properties.dimensions.height * DEFAULT_SCALE);
    }
    if (value.position) {
      const p = p2c(value.position.x, value.position.y);
      this.position({
        x: p.x - this.width() / 2,
        y: p.y - this.height() / 2,
      });
    }
    if (value.color) this.fill(value.color);
    if (value.bordercolor) this.stroke(value.bordercolor);
    if (value.thickness) this.strokeWidth(value.thickness);
    if (value.scale) this.scale({ x: value.scale, y: value.scale });
    if (value.rotation) this.rotation(value.rotation);
    if (value.cornerRadius) this.cornerRadius(value.cornerRadius);
    if (value.opacity) this.opacity(value.opacity);
    if (this.parent && value.zindex) this.zIndex(value.zindex);
  }

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = c2p(
      pos.x + this.width() / 2,
      pos.y + this.height() / 2
    );
    this._properties.dimensions.width =
      this.width() / (this._properties.scale * DEFAULT_SCALE);
    this._properties.dimensions.height =
      this.height() / (this._properties.scale * DEFAULT_SCALE);
    this._properties.rotation = this.rotation();
  }

  storeAsObj() {
    return {
      properties: this._properties,
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.properties = obj.properties as RectangleProperties;
    this.UpdateFromKonvaProperties();
  }
}
