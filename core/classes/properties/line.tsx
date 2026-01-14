import Konva from "@/lib/konva";
import { BaseProperties, BaseProperty } from "./base";
import { Label, LabelProperty } from "./label";
import { NumberInputs } from "./input/dualInput";
import SliderInput from "./input/sliderInput";

export interface LineProperties extends BaseProperties {
  lineEnds: {
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
  thickness: number;
  label: Label;
}

export class LineProperty extends BaseProperty {
  protected lineEnds: {
    start: { x: number; y: number };
    end: { x: number; y: number };
  } = { start: { x: 0, y: 0 }, end: { x: 100, y: 0 } };
  protected thickness: number = 2;
  protected label: LabelProperty;

  constructor(mobj: Konva.Line, labelObj: Konva.Text) {
    super(mobj);
    this.label = new LabelProperty(labelObj);
  }
  override update(prop: Partial<LineProperties>) {
    super.update(prop);
    if (prop.lineEnds !== undefined) {
      this.lineEnds = prop.lineEnds;
      (this.mobj as Konva.Line).points([
        this.lineEnds.start.x,
        this.lineEnds.start.y,
        this.lineEnds.end.x,
        this.lineEnds.end.y,
      ]);
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
    const makeHandler =
      (point: "start" | "end", axis: "x" | "y") => (v: number) =>
        this.update({
          lineEnds: {
            ...this.lineEnds,
            [point]: {
              ...this.lineEnds[point],
              [axis]: v,
            },
          },
        });

    const inputs = [
      ["Start X", "start", "x"],
      ["End X", "end", "x"],
      ["Start Y", "start", "y"],
      ["End Y", "end", "y"],
    ] as const;

    components.push(
      <NumberInputs
        inputs={inputs.map(([label, point, axis]) => ({
          label,
          value: this.lineEnds[point][axis],
          onChange: makeHandler(point, axis),
        }))}
        icon={<>X</>}
      />
    );

    components.push(
      <SliderInput
        fields={[
          {
            label: "Thickness",
            value: this.thickness,
            onChange: (v) => this.update({ thickness: v }),
            min: 1,
            max: 20,
            step: 1,
          },
        ]}
      />
    );
    components.push(this.label.getUIComponent());
    return components;
  }
}
