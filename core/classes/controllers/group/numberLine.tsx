import Konva from "@/lib/konva";
import { BaseProperties, BaseProperty } from "../base/base";
import SliderInput from "../input/sliderInput";
import { ColorDisc } from "../input/colordisc";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MNumberLine } from "../../mobjects/group/numberLine";
import { SlidersHorizontalIcon, SquareDashedTopSolid } from "lucide-react";
import { Colors } from "@/core/utils/colors";

export interface NumberLineProperties extends BaseProperties {
  range: [number, number, number]; // [min, max, step]
  axisthickness: number;
  showlabels: boolean;
  labelsize: number;
  labelcolor: string;
}

export class NumberLineProperty extends BaseProperty {
  protected range: [number, number, number] = [-10, 10, 1];
  protected axisthickness: number = 6;
  protected showlabels: boolean = true;
  protected labelsize: number = 32;
  protected labelcolor: string = Colors.TEXT_SEC;

  constructor(mobj: MNumberLine) {
    super(mobj);
  }

  override update(prop: Partial<NumberLineProperties>): void {
    super.update(prop);
    if (!(this.shapemobj instanceof MNumberLine)) return;
    if (prop.range !== undefined) {
      this.range = prop.range;
      this.shapemobj.refreshNumberLine();
    }
    if (prop.color) {
      this.shapemobj.axisGroup.children.forEach((l) => {
        if (l instanceof Konva.Line) l.stroke(prop.color!);
      });
      this.shapemobj.ticksGroup.children.forEach((l) => {
        if (l instanceof Konva.Line) l.stroke(prop.color!);
      });
    }

    if (prop.axisthickness) {
      this.axisthickness = prop.axisthickness;
      this.shapemobj.axisGroup.children.forEach((l) => {
        if (l instanceof Konva.Line) l.strokeWidth(prop.axisthickness!);
      });
      this.shapemobj.ticksGroup.children.forEach((l) => {
        if (l instanceof Konva.Line) l.strokeWidth(prop.axisthickness!);
      });
    }

    if (prop.labelcolor) {
      this.labelcolor = prop.labelcolor;
      this.shapemobj.labelGroup.children.forEach((t) => {
        if (t instanceof Konva.Text) t.fill(prop.labelcolor!);
      });
    }

    if (prop.labelsize) {
      this.labelsize = prop.labelsize;
      this.shapemobj.labelGroup.children.forEach((t) => {
        if (t instanceof Konva.Text) t.fontSize(prop.labelsize!);
      });
    }

    if (prop.showlabels !== undefined) {
      this.showlabels = prop.showlabels;
      this.shapemobj.labelGroup.visible(prop.showlabels);
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
              min: -10,
              max: 10,
              step: 0.2,
            },
            {
              label: "Range Max",
              value: this.range[1],
              onChange: (v) =>
                this.update({ range: [this.range[0], v, this.range[2]] }),
              min: -10,
              max: 10,
              step: 0.2,
            },
            {
              label: "Range Step",
              value: this.range[2],
              onChange: (v) =>
                this.update({ range: [this.range[0], this.range[1], v] }),
              min: 0.2,
              max: 6,
              step: 0.1,
            },
          ]}
          icon={<SlidersHorizontalIcon className="h-4 w-4" />}
          message="Range"
        />
      ),
    });
    components.push({
      name: "Label Color",
      component: (
        <ColorDisc
          size={8}
          key={"LabelColor"}
          value={this.labelcolor}
          onChange={(v) => this.update({ labelcolor: v })}
          message="Label Color"
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
              min: 16,
              max: 100,
              step: 4,
            },
          ]}
          icon={<SquareDashedTopSolid className="h-4 w-4" />}
          message="Thickness"
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
      color: this.color,
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
