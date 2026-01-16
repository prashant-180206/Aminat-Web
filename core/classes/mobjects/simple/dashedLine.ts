import { AnimGetter } from "@/core/classes/animation/animgetter";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { MobjectAnimAdder } from "../../factories/mobjects/addAnimations";
import { DashedLineProperties } from "@/core/types/properties";
import { TrackerEndPointsAdder } from "../../factories/mobjects/addTrackerEndPoints";
import { DashedLineProperty } from "../../properties/dashedLine";

export class MDashedLine extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  line: Konva.Line;
  label: Konva.Text;
  public features: DashedLineProperty;
  private _TYPE: string;

  constructor(TYPE: string) {
    super();
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

    this.features = new DashedLineProperty(this);

    this.name("DashedLine");
    TrackerEndPointsAdder.addLinePointConnectors(this);
    MobjectAnimAdder.addLineAnimations(this);
    MobjectAnimAdder.addLabelAnimations(this);
  }

  /* ------------------------------------------------------- */
  /* Getters / Setters                                      */
  /* ------------------------------------------------------- */

  type(): string {
    return this._TYPE;
  }

  get properties(): DashedLineProperties {
    return { ...this.features.getData() };
  }
  getUIComponents(): {
    name: string;
    component: React.ReactNode;
  }[] {
    return this.features.getUIComponents();
  }
  /* ------------------------------------------------------- */
  /* Serialization                                         */
  /* ------------------------------------------------------- */

  storeAsObj(): MobjectData {
    return {
      properties: this.features.getData(),
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.features.setData(obj.properties as DashedLineProperties);
    this.features.refresh();
  }
}
