// anim/classes/mobjects/vector.ts
import { AnimGetter } from "@/core/classes/animation/animgetter";
import { VectorProperties } from "@/core/types/properties";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { MobjectAnimAdder } from "../../factories/mobjects/addAnimations";
import { TrackerEndPointsAdder } from "../../factories/mobjects/addTrackerEndPoints";
import { VectorProperty } from "../../properties/vector";

export class MVector extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  public line: Konva.Arrow;
  private label: Konva.Text;
  public features: VectorProperty;
  private _TYPE: string;

  constructor(TYPE: string) {
    super();

    this.position({ x: 0, y: 0 });
    this.line = new Konva.Arrow({
      tension: 0,
      lineCap: "round",
      lineJoin: "round",
    } as Konva.ArrowConfig);

    this.add(this.line);
    this.line.position({ x: 0, y: 0 });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    this.label = new Konva.Text();
    this.features = new VectorProperty(this);
    this.add(this.label);
    this.name("Vector");
    TrackerEndPointsAdder.addLinePointConnectors(this);
    MobjectAnimAdder.addLineAnimations(this);
    MobjectAnimAdder.addLabelAnimations(this);

    // Initial sync
  }

  /* ------------------------------------------------------- */
  /* Getters / Setters                                       */
  /* ------------------------------------------------------- */

  type(): string {
    return this._TYPE;
  }

  get properties(): VectorProperties {
    return { ...this.features.getData() };
  }

  getUIComponents(): {
    name: string;
    component: React.ReactNode;
  }[] {
    return this.features.getUIComponents();
  }

  /* ------------------------------------------------------- */
  /* Internal Sync Logic                                     */
  /* ------------------------------------------------------- */

  storeAsObj() {
    return {
      properties: this.features.getData(),
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.features.setData(obj.properties as VectorProperties);
    this.features.refresh();
  }
}

export class DoubleArrow extends MVector {
  constructor(type: string) {
    super(type);
    this.name("DoubleArrow");
    this.line.pointerAtBeginning(true);
  }
}
