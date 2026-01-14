import { BaseProperties, BaseProperty } from "./base";
import { Label, LabelProperty } from "./label";
import { ParametricCurve } from "../mobjects/simple/curve";
import SliderInput from "./input/sliderInput";
import { StringInputs } from "./input/stringInput";
import { toast } from "sonner";
import { parse } from "mathjs";

export interface CurveProperties extends BaseProperties {
  parameterRange: [number, number];
  funcs: {
    Xfunc: string;
    Yfunc: string;
  };
  thickness: number;
  label: Label;
}

export class Curveproperties extends BaseProperty {
  protected parameterRange: [number, number] = [-5, 5];
  protected funcs: {
    Xfunc: string;
    Yfunc: string;
  } = { Xfunc: "t", Yfunc: "sin(t)" };
  protected thickness: number = 6;
  protected label: LabelProperty;
  protected curveMobj: ParametricCurve;

  constructor(mobj: ParametricCurve) {
    super(mobj.line);
    this.mobj = mobj.line;
    this.curveMobj = mobj;
    this.label = new LabelProperty(mobj.label);
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
      this.mobj.strokeWidth(this.thickness);
    }
    if (prop.label !== undefined) {
      this.label.update(prop.label);
    }
  }

  override getUIComponents(): React.ReactNode[] {
    const components = super.getUIComponents();
    components.push(
      <SliderInput
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
    );

    components.push(
      <StringInputs
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
    );

    components.push(
      <SliderInput
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
    );
    components.push(this.label.getUIComponent());
    return components;
  }
}
