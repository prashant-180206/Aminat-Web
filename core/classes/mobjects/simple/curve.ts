/* eslint-disable @typescript-eslint/no-unused-vars */
// anim/classes/mobjects/simple/parametricCurve.ts
import { AnimGetter } from "@/core/classes/animation/animgetter";
import { CurveProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
import { Konva } from "@/lib/konva";
import { evaluate } from "mathjs";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";

export class ParametricCurve extends Konva.Line {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _properties: CurveProperties;
  private _TYPE: string;

  constructor(TYPE: string, config: Partial<CurveProperties> = {}) {
    super({
      tension: 0.8,
      lineCap: "round",
      lineJoin: "round",
      strokeWidth: 3,
    });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    this._properties = {
      position: { x: 0, y: 0 },
      color: "red",
      scale: 1,
      rotation: 0,
      parameterRange: [0, 2 * Math.PI],
      funcs: {
        Xfunc: "t",
        Yfunc: "sin(t)",
      },
      thickness: 3,
      bordercolor: "blue",
      opacity: 1,
      zindex: 0,
      ...config,
    };

    this.updateFromProperties();
    this.name("Curve");
  }

  type(): string {
    return this._TYPE;
  }

  // Getter/Setter for properties
  get properties(): CurveProperties {
    return { ...this._properties };
  }

  set properties(newProps: Partial<CurveProperties>) {
    Object.assign(this._properties, newProps);
    this.updateFromProperties();
  }

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = c2p(pos.x, pos.y);
    // this._properties.thickness = this.strokeWidth();
    // this._properties.color = this.stroke() as string;
    this._properties.scale = this.scaleX();
    this._properties.rotation = this.rotation();
    // this._properties.opacity = this.opacity();
    // this._properties.zindex = this.zIndex();
  }

  private updateFromProperties() {
    const {
      position,
      color,
      scale,
      rotation,
      thickness,
      bordercolor,
      parameterRange,
      funcs,
      opacity,
      zindex,
    } = this._properties;

    // Apply base properties
    this.position(p2c(position.x, position.y));
    this.stroke(bordercolor || color);
    this.strokeWidth(thickness);
    this.scale({ x: scale, y: scale });
    this.rotation(rotation);
    this.opacity(opacity);
    this.zIndex(zindex);
    // this.fill(color); // Lines don't have fill
    // Generate parametric curve
    this.generateCurve(funcs.Xfunc, funcs.Yfunc, parameterRange);
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
