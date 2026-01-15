import Konva from "@/lib/konva";
import { BaseProperties, BaseProperty } from "./base";
import SliderInput from "./input/sliderInput";
import { ColorDisc } from "./input/colordisc";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MNumberLine } from "../mobjects/group/numberLine";

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

  constructor(mobj: MNumberLine) {
    super(mobj);
  }

  override update(prop: Partial<NumberLineProperties>): void {
    super.update(prop);
    if (!(this.mobj instanceof MNumberLine)) return;
    if (prop.range !== undefined) {
      this.range = prop.range;
      this.mobj.refreshNumberLine();
    }
    if (prop.color) {
      this.mobj.axisGroup.children.forEach((l) => {
        if (l instanceof Konva.Line) l.stroke(prop.color!);
      });
      this.mobj.ticksGroup.children.forEach((l) => {
        if (l instanceof Konva.Line) l.stroke(prop.color!);
      });
    }

    if (prop.axisthickness) {
      this.mobj.axisGroup.children.forEach((l) => {
        if (l instanceof Konva.Line) l.strokeWidth(prop.axisthickness!);
      });
      this.mobj.ticksGroup.children.forEach((l) => {
        if (l instanceof Konva.Line) l.strokeWidth(prop.axisthickness!);
      });
    }

    if (prop.labelcolor) {
      this.mobj.labelGroup.children.forEach((t) => {
        if (t instanceof Konva.Text) t.fill(prop.labelcolor!);
      });
    }

    if (prop.labelsize) {
      this.mobj.labelGroup.children.forEach((t) => {
        if (t instanceof Konva.Text) t.fontSize(prop.labelsize!);
      });
    }

    if (prop.showlabels !== undefined) {
      this.mobj.labelGroup.visible(prop.showlabels);
    }
  }

  override getUIComponents(): { name: string; component: React.ReactNode }[] {
    const components = super.getUIComponents();
    components.push({
      name: "Range",
      component: (
        <SliderInput
          key={"Range"}
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
      ),
    });
    components.push({
      name: "Label Color",
      component: (
        <ColorDisc
          key={"LabelColor"}
          value={this.labelcolor}
          onChange={(v) => this.update({ labelcolor: v })}
        />
      ),
    });
    components.push({
      name: "Show Labels",
      component: (
        <div key={"ShowLabels"} className="flex items-center gap-2">
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
      ),
    });
    components.push({
      name: "Line Thickness",
      component: (
        <SliderInput
          key={"LineThickness"}
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
        />
      ),
    });
    return components;
  }
  override getData(): NumberLineProperties {
    return {
      ...super.getData(),
      range: this.range,
      axisthickness: this.axisthickness,
      showlabels: this.showlabels,
      labelsize: this.labelsize,
      labelcolor: this.labelcolor,
    };
  }
  override setData(data: NumberLineProperties): void {
    super.setData(data);
    this.range = data.range;
    this.axisthickness = data.axisthickness;
    this.showlabels = data.showlabels;
    this.labelsize = data.labelsize;
    this.labelcolor = data.labelcolor;
    this.update(data);
  }
}
