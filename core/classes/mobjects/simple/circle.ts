import { AnimGetter } from "@/core/classes/animation/animgetter";
import { CircleProperties } from "@/core/types/properties";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { Konva } from "@/lib/konva";
import { MobjectData } from "@/core/types/file";
import { CircleProperty } from "../../properties/circle";

class MCircle extends Konva.Circle {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  public features: CircleProperty;

  private _TYPE: string;

  constructor(TYPE: string, config?: Konva.CircleConfig) {
    super(config);
    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);
    this.features = new CircleProperty(this);
    this.name("Circle");
  }

  type(): string {
    return this._TYPE;
  }
  // Object getter - returns copy to prevent mutation
  get properties(): CircleProperties {
    return { ...this.features.getData() };
  }

  getUIComponents(): {
    name: string;
    component: React.ReactNode;
  }[] {
    return this.features.getUIComponents();
  }

  update(value: Partial<CircleProperties>) {
    this.features.update(value);
  }

  storeAsObj(): MobjectData {
    return {
      properties: this.features.getData(),
      id: this.id(),
    };
  }

  loadFromObj(obj: MobjectData) {
    this.features.setData(obj.properties);
  }
}

export default MCircle;
