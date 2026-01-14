import { AnimGetter } from "@/core/classes/animation/animgetter";
import { DotProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
import { Konva } from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { Colors } from "@/core/utils/colors";
import { MobjectAnimAdder } from "../../factories/mobjects/addAnimations";
// import { labelAble } from "./labelAble";
// import type { Point } from './parametricCurve';

export class Dot extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;

  public circle: Konva.Circle;
  public label: Konva.Text;
  private _properties: DotProperties = {
    position: { x: 0, y: 0 },
    color: Colors.PRIMARY,
    scale: 1,
    rotation: 0,
    radius: 6,
    zindex: 0,
    opacity: 1,
    label: {
      labelText: "label",
      visible: false,
      offset: { x: 0, y: 0 },
      fontsize: 32,
      color: Colors.TEXT,
      position: "center",
      opacity: 1,
    },
    // ...config,
  };
  private _TYPE: string;

  constructor(TYPE: string, config: Partial<DotProperties> = {}) {
    super({
      lineCap: "round",
      lineJoin: "round",
    });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);
    this.circle = new Konva.Circle({
      radius: this._properties.radius,
      fill: this._properties.color,
      strokeEnabled: false,
      x: 0,
      y: 0,
    });

    this.add(this.circle);

    this.label = new Konva.Text({
      text: this._properties.label.labelText,
      fontSize: this._properties.label.fontsize,
      fill: this._properties.label.color,
      x: this._properties.label.offset.x,
      y: this._properties.label.offset.y,
      visible: this._properties.label.visible,
      listening: false,
    });

    this.add(this.label);

    this._properties = { ...this._properties, ...config };

    this.properties = this._properties;
    this.name("Dot");

    MobjectAnimAdder.addLabelAnimations(this);
    // this.className = "haveLabel";
  }

  type(): string {
    return this._TYPE;
  }

  // Getter/Setter for properties
  get properties(): DotProperties {
    return { ...this._properties };
  }

  set properties(value: Partial<DotProperties>) {
    Object.assign(this._properties, value);
    if (value.color) this.circle.fill(value.color);
    if (value.radius) this.circle.radius(value.radius * this._properties.scale);
    if (value.scale) this.circle.radius(this._properties.radius * value.scale);
    if (value.position) {
      this.position(p2c(value.position.x, value.position.y));
      let txt = this._properties.label.labelText;
      txt = txt.replace(/valx/g, this._properties.position.x.toFixed(2));
      txt = txt.replace(/valy/g, this._properties.position.y.toFixed(2));
      this.label.text(txt);
    }
    if (value.rotation) this.rotation(value.rotation);
    if (value.opacity) this.opacity(value.opacity);
    if (this.parent && value.zindex) this.zIndex(value.zindex);
    if (value.label) {
      let txt = value.label.labelText;
      txt = txt.replace(/valx/g, this._properties.position.x.toFixed(2));
      txt = txt.replace(/valy/g, this._properties.position.y.toFixed(2));
      this.label.text(txt);
      this.label.fontSize(value.label.fontsize);
      this.label.fill(value.label.color);
      this.label.x(value.label.offset.x);
      this.label.y(value.label.offset.y);
      this.label.visible(value.label.visible);
    }
  }

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = c2p(pos.x, pos.y);
    let txt = this._properties.label.labelText;
    txt = txt.replace(/valx/g, this._properties.position.x.toFixed(2));
    txt = txt.replace(/valy/g, this._properties.position.y.toFixed(2));
    this.label.text(txt);

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
