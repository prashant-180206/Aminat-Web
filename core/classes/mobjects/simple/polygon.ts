// anim/classes/mobjects/simple/polygon.ts
import { AnimGetter } from "@/core/classes/animation/animgetter";
import { PolygonProperties } from "@/core/types/properties";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { PolygonProperty } from "../../properties/polygon";
// import { set } from "animejs";

export class MPolygon extends Konva.Shape {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  public features: PolygonProperty;
  private _TYPE: string;
  private localPoints: { x: number; y: number }[] = [];

  constructor(TYPE: string) {
    super({
      lineCap: "round",
      lineJoin: "round",
      draggable: true,
    });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    this.features = new PolygonProperty(this);
    this.name("Polygon");
  }

  type(): string {
    return this._TYPE;
  }

  // Getter/Setter for properties
  get properties(): PolygonProperties {
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
    this.features.setData(obj.properties as PolygonProperties);
    this.features.refresh();
  }
}
