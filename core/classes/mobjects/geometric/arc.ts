import Konva from "@/lib/konva";
import { AnimGetter } from "@/core/classes/animation/animgetter";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { MobjectAnimAdder } from "../../factories/mobjects/addAnimations";
import { ArcProperties, ArcProperty } from "../../controllers/geometry/arc";
// import { ArcProperty, ArcProperties } from "../../controllers/simple/arc";

export class MArc extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  line: Konva.Line;
  label: Konva.Text;
  public features: ArcProperty;
  private _TYPE: string;

  constructor(TYPE: string) {
    super({});

    // The core line that defines the arc
    this.line = new Konva.Line({
      tension: 0.4, // Smoothing enabled to turn segments into a curve
      lineCap: "round",
      lineJoin: "round",
    });

    this.label = new Konva.Text();

    this.add(this.line);
    this.add(this.label);

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    // Use the specialized ArcProperty
    this.features = new ArcProperty(this);

    this.name("Arc");

    // Add animations (Reusing your factories)
    MobjectAnimAdder.addLabelAnimations(this);
  }

  type(): string {
    return this._TYPE;
  }

  get properties(): ArcProperties {
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
    this.features.update(obj.properties as Partial<ArcProperties>);
  }
}
