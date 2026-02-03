import { AnimGetter } from "@/core/classes/animation/animgetter";
import { p2c } from "@/core/utils/conversion";
import { Konva } from "@/lib/konva";
import { evaluate } from "mathjs";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { MobjectAnimAdder } from "../../factories/mobjects/addAnimations";
import { CurveProperties, CurveProperty } from "../../controllers/simple/curve";
import { TrackerEndPointsAdder } from "../../factories/mobjects/addTrackerEndPoints";
import { DEFAULT_SCALE } from "@/core/config";

export class ParametricCurve extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  public line: Konva.Line;
  public label: Konva.Text;
  public features: CurveProperty;
  private _TYPE: string;

  constructor(TYPE: string) {
    super();
    this.line = new Konva.Line({
      tension: 0.8,
      lineCap: "round",
      lineJoin: "round",
      strokeWidth: 3,
    });
    this.add(this.line);
    this.line.position({ x: 0, y: 0 });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    this.label = new Konva.Text({});
    this.add(this.label);
    this.features = new CurveProperty(this);

    MobjectAnimAdder.addCurveAnimations(this);
    MobjectAnimAdder.addLabelAnimations(this);
    TrackerEndPointsAdder.addCurvePointConnectors(this);

    this.name("Curve");
  }

  type(): string {
    return this._TYPE;
  }

  // Getter/Setter for properties
  get properties(): CurveProperties {
    return { ...this.features.getData() };
  }
  getUIComponents(): {
    name: string;
    component: React.ReactNode;
  }[] {
    return this.features.getUIComponents();
  }

  generateCurve(
    Xfunc: string,
    Yfunc: string,
    range: [number, number],
    position?: { x: number; y: number },
  ) {
    const [tMin, tMax] = range;
    const samples = (tMax - tMin) * 30;
    const points: number[] = [];
    const step = (tMax - tMin) / samples;

    // Get canvas position for centering
    for (let i = 0; i <= samples; i++) {
      const t = tMin + i * step;
      let x: number, y: number;
      try {
        x = evaluate(Xfunc, { t }) as number;
        y = evaluate(Yfunc, { t }) as number;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        x = t;
        y = t;
      }

      // Convert math coords to canvas coords, then offset by position
      const canvasX =
        p2c(x, y).x - (this.position().x - (position?.x ?? 0) * DEFAULT_SCALE);
      const canvasY =
        p2c(x, y).y - (this.position().y + (position?.y ?? 0) * DEFAULT_SCALE);

      points.push(canvasX, canvasY);
    }
    this.line.points(points);
  }

  // Convenience methods
  updateFunctions(
    Xfunc: string,
    Yfunc: string,
    range: [number, number] = this.properties.parameterRange,
  ) {
    this.properties.funcs.Xfunc = Xfunc;
    this.properties.funcs.Yfunc = Yfunc;
    this.properties.parameterRange = range;
    this.generateCurve(Xfunc, Yfunc, range);
  }

  setParameterRange(range: [number, number]) {
    this.properties.parameterRange = range;
    this.generateCurve(
      this.properties.funcs.Xfunc,
      this.properties.funcs.Yfunc,
      range,
    );
  }

  storeAsObj() {
    return {
      properties: this.properties,
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.features.setData(obj.properties as CurveProperties);
    this.features.refresh();
  }
}
