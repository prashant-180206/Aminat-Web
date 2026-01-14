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
import { DEFAULT_SCALE } from "@/core/config";

export class ParametricCurve extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  public line: Konva.Line;
  public label: Konva.Text;
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
    label: {
      labelText: "label",
      visible: false,
      offset: { x: 0, y: 0 },
      fontsize: 32,
      color: Colors.TEXT,
      position: "center",
      opacity: 1,
    },
  };
  private _TYPE: string;

  constructor(TYPE: string, config: Partial<CurveProperties> = {}) {
    super();
    this.line = new Konva.Line({
      tension: 0.8,
      lineCap: "round",
      lineJoin: "round",
      strokeWidth: 3,
    });
    this.add(this.line);
    this.line.position({ x: 0, y: 0 });

    this._properties = { ...this._properties, ...config };

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    this.label = new Konva.Text({
      text: this._properties.label.labelText,
      fontSize: this._properties.label.fontsize,
      fill: this._properties.label.color,
      x: this._properties.label.offset.x,
      y: this._properties.label.offset.y,
      visible: this._properties.label.visible,
      listening: false,
    });

    this.add(this.label);

    MobjectAnimAdder.addCurveAnimations(this);
    MobjectAnimAdder.addLabelAnimations(this);

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
    if (value.color) this.line.stroke(value.color);
    if (value.thickness) this.line.strokeWidth(value.thickness);
    if (value.scale) this.scale({ x: value.scale, y: value.scale });
    if (value.rotation) this.rotation(value.rotation);
    if (value.opacity) this.opacity(value.opacity);
    if (this.parent && value.zindex) this.zIndex(value.zindex);
    if (value.position) {
      this.position(p2c(value.position.x, value.position.y));
      this.setLabelPosition();
    }
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
    if (value.label) {
      this.label.text(value.label.labelText);
      this.label.fontSize(value.label.fontsize);
      this.label.fill(value.label.color);
      this.setLabelPosition();
      this.label.visible(value.label.visible);
      this.label.opacity(value.label.opacity);
    }
    Object.assign(this._properties, value);
  }
  private setLabelPosition() {
    let position = { x: 0, y: 0 };
    const [start, end] = this._properties.parameterRange;
    const midX = (start + end) / 2;
    const midY = (start + end) / 2;
    if (this._properties.label.position === "start") {
      position = {
        x: evaluate(this._properties.funcs.Xfunc, { t: start }) as number,
        y: evaluate(this._properties.funcs.Yfunc, { t: start }) as number,
      };
    } else if (this._properties.label.position === "end") {
      position = {
        x: evaluate(this._properties.funcs.Xfunc, { t: end }) as number,
        y: evaluate(this._properties.funcs.Yfunc, { t: end }) as number,
      };
    } else if (this._properties.label.position === "center") {
      position = {
        x: evaluate(this._properties.funcs.Xfunc, { t: midX }) as number,
        y: evaluate(this._properties.funcs.Yfunc, { t: midY }) as number,
      };
    }
    this.label.position({
      x: position.x * DEFAULT_SCALE + this._properties.label.offset.x,
      y: -position.y * DEFAULT_SCALE + this._properties.label.offset.y,
    });
  }

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = c2p(pos.x, pos.y);
    this._properties.scale = this.scaleX();
    this._properties.rotation = this.rotation();
  }

  generateCurve(Xfunc: string, Yfunc: string, range: [number, number]) {
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

    this.line.points(points);
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
