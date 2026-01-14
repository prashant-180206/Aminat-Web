import Konva from "@/lib/konva";
import { BaseProperties, BaseProperty } from "./base";
import SliderInput from "./input/sliderInput";
import { ColorDisc } from "./input/colordisc";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface NumberLineProperties extends BaseProperties {
  range: [number, number, number]; // [min, max, step]
  axisthickness: number;
  showlabels: boolean;
  labelsize: number;
  labelcolor: string;
}

export class NumberLineProperty extends BaseProperty {
  protected range: [number, number, number] = [-10, 10, 1];
  protected axisthickness: number = 2;
  protected showlabels: boolean = true;
  protected labelsize: number = 12;
  protected labelcolor: string = "#000000";

  constructor(mobj: Konva.Group) {
    super(mobj);
  }

  override update(prop: Partial<NumberLineProperties>): void {
    super.update(prop);
  }

  override getUIComponents(): React.ReactNode[] {
    const components = super.getUIComponents();
    components.push(
      <SliderInput
        fields={[
          {
            label: "Range Min",
            value: this.range[0],
            onChange: (v) =>
              this.update({ range: [v, this.range[1], this.range[2]] }),
            min: -100,
            max: 100,
            step: 1,
          },
          {
            label: "Range Max",
            value: this.range[1],
            onChange: (v) =>
              this.update({ range: [this.range[0], v, this.range[2]] }),
            min: -100,
            max: 100,
            step: 1,
          },
          {
            label: "Range Step",
            value: this.range[2],
            onChange: (v) =>
              this.update({ range: [this.range[0], this.range[1], v] }),
            min: 1,
            max: 20,
          },
        ]}
      />
    );
    components.push(
      <ColorDisc
        value={this.labelcolor}
        onChange={(v) => this.update({ labelcolor: v })}
      />
    );
    components.push(
      <div className="flex items-center gap-2">
        <Checkbox
          id={`my-checkbox-showlabels`}
          defaultChecked={this.showlabels}
          onCheckedChange={(v) => this.update({ showlabels: v as boolean })}
        />
        <Label
          htmlFor={`my-checkbox-showlabels`}
          className="text-sm font-medium"
        >
          Labels
        </Label>
      </div>
    );
    <SliderInput
      fields={[
        {
          label: "Axis Thickness",
          value: this.axisthickness,
          onChange: (v) => {
            this.update({ axisthickness: v });
          },
          min: 1,
          max: 30,
          step: 1,
        },
        {
          label: "Label Size",
          value: this.labelsize,
          onChange: (v) => {
            this.update({ labelsize: v });
          },
          min: 1,
          max: 30,
          step: 1,
        },
      ]}
    />;
    return components;
  }
}
