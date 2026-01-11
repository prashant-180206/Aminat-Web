// /* eslint-disable @typescript-eslint/no-unused-vars */
import { AnimGetter } from "@/core/classes/animation/animgetter";
import { CurveProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
import { Konva } from "@/lib/konva";
import { evaluate } from "mathjs";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { Colors } from "@/core/utils/colors";
import { MobjectAnimAdder } from "../../factories/mobjects/addAnimations";

export class ParametricCurve extends Konva.Line {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _properties: CurveProperties = {
    position: { x: 0, y: 0 },
    color: Colors.PRIMARY,
    scale: 1,
    rotation: 0,
    parameterRange: [0, 2 * Math.PI],
    funcs: {
      Xfunc: "t",
      Yfunc: "sin(t)",
    },
    thickness: 6,
    opacity: 1,
    zindex: 0,
  };
  private _TYPE: string;

  constructor(TYPE: string, config: Partial<CurveProperties> = {}) {
    super({
      tension: 0.8,
      lineCap: "round",
      lineJoin: "round",
      strokeWidth: 3,
    });

    this._properties = { ...this._properties, ...config };

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    MobjectAnimAdder.addCurveAnimations(this);

    this.properties = this._properties;

    this.name("Curve");
  }

  type(): string {
    return this._TYPE;
  }

  // Getter/Setter for properties
  get properties(): CurveProperties {
    return { ...this._properties };
  }

  set properties(value: Partial<CurveProperties>) {
    if (value.color) this.stroke(value.color);
    if (value.thickness) this.strokeWidth(value.thickness);
    if (value.scale) this.scale({ x: value.scale, y: value.scale });
    if (value.rotation) this.rotation(value.rotation);
    if (value.opacity) this.opacity(value.opacity);
    if (this.parent && value.zindex) this.zIndex(value.zindex);
    if (value.position) this.position(p2c(value.position.x, value.position.y));
    if (value.funcs) {
      this.generateCurve(
        value.funcs.Xfunc,
        value.funcs.Yfunc,
        this._properties.parameterRange
      );
    }
    if (value.parameterRange) {
      this.generateCurve(
        this._properties.funcs.Xfunc,
        this._properties.funcs.Yfunc,
        value.parameterRange
      );
    }
    Object.assign(this._properties, value);
  }

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = c2p(pos.x, pos.y);
    this._properties.scale = this.scaleX();
    this._properties.rotation = this.rotation();
  }

  private generateCurve(Xfunc: string, Yfunc: string, range: [number, number]) {
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
      const canvasX = p2c(x, y).x - this.position().x;
      const canvasY = p2c(x, y).y - this.position().y;

      points.push(canvasX, canvasY);
    }

    this.points(points);
    // this.draw();
  }

  // Convenience methods
  updateFunctions(
    Xfunc: string,
    Yfunc: string,
    range: [number, number] = this._properties.parameterRange
  ) {
    this._properties.funcs.Xfunc = Xfunc;
    this._properties.funcs.Yfunc = Yfunc;
    this._properties.parameterRange = range;
    this.generateCurve(Xfunc, Yfunc, range);
  }

  setParameterRange(range: [number, number]) {
    this._properties.parameterRange = range;
    this.generateCurve(
      this._properties.funcs.Xfunc,
      this._properties.funcs.Yfunc,
      range
    );
  }

  storeAsObj() {
    return {
      properties: this._properties,
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.properties = obj.properties as CurveProperties;
    this.UpdateFromKonvaProperties();
  }
}
