import { BaseProperties, BaseProperty } from "./base";
import { Label, LabelProperty } from "./label";
import { ParametricCurve } from "../mobjects/simple/curve";
import SliderInput from "./input/sliderInput";
import { StringInputs } from "./input/stringInput";
import { toast } from "sonner";
import Konva from "@/lib/konva";
import { evaluate, parse } from "mathjs";
import { DEFAULT_SCALE } from "@/core/config";

export interface CurveProperties extends BaseProperties {
  parameterRange: [number, number];
  funcs: {
    Xfunc: string;
    Yfunc: string;
  };
  thickness: number;
  label: Label;
}

export class CurveProperty extends BaseProperty {
  protected parameterRange: [number, number] = [-5, 5];
  protected funcs: {
    Xfunc: string;
    Yfunc: string;
  } = { Xfunc: "t", Yfunc: "sin(t)" };
  protected thickness: number = 6;
  protected label: LabelProperty;
  protected curveMobj: ParametricCurve;
  protected labelobject: Konva.Text;

  constructor(mobj: ParametricCurve) {
    super(mobj.line, mobj);
    this.shapemobj = mobj.line;
    this.curveMobj = mobj;
    this.labelobject = mobj.label;
    this.label = new LabelProperty(mobj.label);
    this.update({
      parameterRange: this.parameterRange,
      funcs: this.funcs,
      thickness: this.thickness,
      label: this.label.getData(),
    });
  }

  override update(prop: Partial<CurveProperties>): void {
    super.update(prop);
    if (prop.parameterRange !== undefined) {
      this.parameterRange = prop.parameterRange;
      this.curveMobj.generateCurve(
        this.funcs.Xfunc,
        this.funcs.Yfunc,
        prop.parameterRange
      );
    }
    if (prop.funcs !== undefined) {
      this.funcs = prop.funcs;
      this.curveMobj.generateCurve(
        prop.funcs.Xfunc,
        prop.funcs.Yfunc,
        this.parameterRange
      );
    }
    if (prop.thickness !== undefined) {
      this.thickness = prop.thickness;
      if (this.shapemobj instanceof Konva.Line)
        this.shapemobj.strokeWidth(this.thickness);
    }
    if (prop.label !== undefined) {
      this.label.update(prop.label);
      if (prop.label.position !== undefined) {
        let position = { x: 0, y: 0 };
        const [start, end] = this.parameterRange;
        const midX = (start + end) / 2;
        const midY = (start + end) / 2;
        if (prop.label.position === "start") {
          position = {
            x: evaluate(this.funcs.Xfunc, { t: start }) as number,
            y: evaluate(this.funcs.Yfunc, { t: start }) as number,
          };
        } else if (prop.label.position === "end") {
          position = {
            x: evaluate(this.funcs.Xfunc, { t: end }) as number,
            y: evaluate(this.funcs.Yfunc, { t: end }) as number,
          };
        } else if (prop.label.position === "center") {
          position = {
            x: evaluate(this.funcs.Xfunc, { t: midX }) as number,
            y: evaluate(this.funcs.Yfunc, { t: midY }) as number,
          };
        }
        this.labelobject.position({
          x: position.x * DEFAULT_SCALE + this.label.getData().offset.x,
          y: -position.y * DEFAULT_SCALE + this.label.getData().offset.y,
        });
      }
    }
  }

  override getUIComponents(): { name: string; component: React.ReactNode }[] {
    const components = super.getUIComponents();
    components.push({
      name: "Thickness",
      component: (
        <SliderInput
          key={"Thickness"}
          fields={[
            {
              label: "Thickness",
              value: this.thickness,
              onChange: (v) => {
                this.update({ thickness: v });
              },
              min: 1,
              max: 30,
              step: 1,
            },
          ]}
        />
      ),
    });

    components.push({
      name: "Functions",
      component: (
        <StringInputs
          key={"Functions"}
          inputs={[
            {
              label: "X Function",
              value: this.funcs.Xfunc,
            },
            {
              label: "Y Function",
              value: this.funcs.Yfunc,
            },
          ]}
          onApply={([xf, yf]) => {
            try {
              const tValue = 1;
              const evalExpr = (expr: string) => {
                const substituted = expr.replace("t", `(${tValue})`);
                const node = parse(substituted);
                node.evaluate();
              };
              evalExpr(xf);
              evalExpr(yf);
              this.update({ funcs: { Xfunc: xf, Yfunc: yf } });
            } catch {
              toast.error("Invalid function expression");
            }
          }}
        />
      ),
    });

    components.push({
      name: "Parameter Range",
      component: (
        <SliderInput
          key={"ParameterRange"}
          fields={[
            {
              label: "Start 't'",
              value: this.parameterRange[0],
              onChange: (t) =>
                this.update({ parameterRange: [t, this.parameterRange[1]] }),
              min: -10,
              max: 10,
              step: 0.1,
            },
            {
              label: "End 't'",
              value: this.parameterRange[1],
              onChange: (t) =>
                this.update({ parameterRange: [this.parameterRange[0], t] }),
              min: -10,
              max: 10,
              step: 0.1,
            },
          ]}
        />
      ),
    });
    components.push({
      name: "Label",
      component: this.label.getUIComponent(),
    });
    return components;
  }

  override getData(): CurveProperties {
    return {
      ...super.getData(),
      parameterRange: this.parameterRange,
      funcs: this.funcs,
      thickness: this.thickness,
      label: this.label.getData(),
    };
  }

  override setData(data: CurveProperties): void {
    super.setData(data);
    const curveData = data;
    this.update(curveData);
    this.label.setData(curveData.label);
    this.update(data);
  }
}
