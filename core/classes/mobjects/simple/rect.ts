// anim/classes/mobjects/simple/rect.ts
import { AnimGetter } from "@/core/classes/animation/animgetter";
import { DEFAULT_SCALE } from "@/core/config";
import { RectangleProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
import { Konva } from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";

export class MRect extends Konva.Rect {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _properties: RectangleProperties;
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

    this._properties = {
      position: { x: 0, y: 0 },
      color: "blue",
      scale: 1,
      rotation: 0,
      dimensions: {
        width: 3,
        height: 2,
      },
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

  type(): string {
    return this._TYPE;
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
      dimensions: { width, height },
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
    if (this.parent) this.zIndex(zindex);
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
