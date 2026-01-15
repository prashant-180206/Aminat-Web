import { AnimGetter } from "@/core/classes/animation/animgetter";
import { DotProperties } from "@/core/types/properties";
import { Konva } from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { MobjectAnimAdder } from "../../factories/mobjects/addAnimations";
import { DotProperty } from "../../properties/dot";
// import { labelAble } from "./labelAble";
// import type { Point } from './parametricCurve';

export class Dot extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;

  public circle: Konva.Circle;
  public label: Konva.Text;
  private features: DotProperty;
  private _TYPE: string;

  constructor(TYPE: string) {
    super({
      lineCap: "round",
      lineJoin: "round",
    });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);
    this.circle = new Konva.Circle();

    this.add(this.circle);

    this.label = new Konva.Text();

    this.add(this.label);
    this.features = new DotProperty(this);
    this.name("Dot");

    MobjectAnimAdder.addLabelAnimations(this);
    // this.className = "haveLabel";
  }

  type(): string {
    return this._TYPE;
  }

  // Getter/Setter for properties
  get properties(): DotProperties {
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
    this.features.setData(obj.properties as DotProperties);
    this.features.refresh();
  }
}
