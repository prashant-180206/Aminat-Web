import { AnimGetter } from "@/core/classes/animation/animgetter";
import { DotProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
import { Konva } from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { Colors } from "@/core/utils/colors";
// import type { Point } from './parametricCurve';

export class Dot extends Konva.Circle {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _properties: DotProperties;
  private _TYPE: string;

  constructor(TYPE: string, config: Partial<DotProperties> = {}) {
    super({
      lineCap: "round",
      lineJoin: "round",
    });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    this._properties = {
      position: { x: 0, y: 0 },
      color: Colors.PRIMARY,
      scale: 1,
      rotation: 0,
      radius: 6,
      zindex: 0,
      opacity: 1,
      ...config,
    };

    this.updateFromProperties();
    this.name("Dot");
  }

  type(): string {
    return this._TYPE;
  }

  // Getter/Setter for properties
  get properties(): DotProperties {
    return { ...this._properties };
  }

  set properties(newProps: Partial<DotProperties>) {
    Object.assign(this._properties, newProps);
    this.updateFromProperties();
  }

  private updateFromProperties() {
    const { position, color, scale, rotation, radius, opacity, zindex } =
      this._properties;

    this.fill(color);
    this.strokeWidth(0);
    this.radius(radius * scale);
    this.position(p2c(position.x, position.y));
    this.rotation(rotation);
    this.opacity(opacity);
    if (this.parent) this.zIndex(zindex);
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
    this.properties = obj.properties as DotProperties;
    this.UpdateFromKonvaProperties();
  }
}
