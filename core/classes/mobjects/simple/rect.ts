// anim/classes/mobjects/simple/rect.ts
import { AnimGetter } from "@/core/classes/animation/animgetter";
import { RectangleProperties } from "@/core/types/properties";
import { Konva } from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { RectangleProperty } from "../../properties/rectangle";

export class MRect extends Konva.Rect {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  public features: RectangleProperty;
  private _TYPE: string;

  constructor(TYPE: string) {
    super({
      cornerRadius: 0,
      lineCap: "round",
      lineJoin: "round",
    });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    this.features = new RectangleProperty(this);
    this.name("Rect");
  }

  type(): string {
    return this._TYPE;
  }

  // Getter/Setter for properties
  get properties(): RectangleProperties {
    return { ...this.features.getData() };
  }
  getUIComponents() {
    return this.features.getUIComponents();
  }

  storeAsObj() {
    return {
      properties: this.features.getData(),
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.features.setData(obj.properties as RectangleProperties);
    this.features.refresh();
  }
}
