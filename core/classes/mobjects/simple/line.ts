import { AnimGetter } from "@/core/classes/animation/animgetter";
import { LineProperties } from "@/core/types/properties";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { MobjectAnimAdder } from "../../factories/mobjects/addAnimations";

import { TrackerEndPointsAdder } from "../../factories/mobjects/addTrackerEndPoints";
import { LineProperty } from "../../properties/line";

export class MLine extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private line: Konva.Line;
  private label: Konva.Text;
  private features: LineProperty;
  private _TYPE: string;

  constructor(TYPE: string) {
    super({});
    this.line = new Konva.Line({
      tension: 0,
      lineCap: "round",
      lineJoin: "round",
    });
    this.add(this.line);
    this.line.position({ x: 0, y: 0 });

    this.position({ x: 0, y: 0 });

    this.label = new Konva.Text();

    this.add(this.label);

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);
    this.features = new LineProperty(this.line, this.label);
    this.name("Line");
    TrackerEndPointsAdder.addLinePointConnectors(this);
    MobjectAnimAdder.addLineAnimations(this);
    MobjectAnimAdder.addLabelAnimations(this);
  }

  /* ------------------------------------------------------- */
  /* Getters / Setters                                       */
  /* ------------------------------------------------------- */

  type(): string {
    return this._TYPE;
  }

  get properties(): LineProperties {
    return { ...this.features.getData() };
  }
  getUIComponents() {
    return this.features.getUIComponents();
  }

  storeAsObj(): MobjectData {
    return {
      properties: this.features.getData(),
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.features.update(obj.properties as Partial<LineProperties>);
    this.features.refresh();
  }
}
