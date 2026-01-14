import { Checkbox } from "@/components/ui/checkbox";
import { BaseProperties, BaseProperty } from "./base";
import SliderInput from "./input/sliderInput";
import { Label } from "@/components/ui/label";
import { ColorDisc } from "./input/colordisc";
import Konva from "@/lib/konva";

export interface PlaneProperties extends BaseProperties {
  // done
  dimensions: {
    width: number;
    height: number;
  };
  ranges: {
    xrange: [number, number, number];
    yrange: [number, number, number];
  };
  gridthickness: number;
  axisthickness: number;
  axiscolor: string;
  showgrid: boolean;
  showlabels: boolean;
  labelsize: number;
  labelcolor: string;
}
export class PlaneProperty extends BaseProperty {
  protected dimensions: { width: number; height: number } = {
    width: 400,
    height: 400,
  };
  protected ranges: {
    xrange: [number, number, number];
    yrange: [number, number, number];
  } = { xrange: [-10, 10, 1], yrange: [-10, 10, 1] };
  protected gridthickness: number = 1;
  protected axisthickness: number = 2;
  protected axiscolor: string = "#000000";
  protected showgrid: boolean = true;
  protected showlabels: boolean = true;
  protected labelsize: number = 12;
  protected labelcolor: string = "#000000";

  constructor(mobj: Konva.Group) {
    super(mobj);
  }

  override update(prop: Partial<PlaneProperties>): void {
    super.update(prop);
  }
  override getUIComponents(): React.ReactNode[] {
    const components = super.getUIComponents();
    components.push(
      <SliderInput
        fields={[
          {
            label: "Width",
            value: this.dimensions.width,
            onChange: (v) =>
              this.update({
                dimensions: { width: v, height: this.dimensions.height },
              }),
          },
          {
            label: "Height",
            value: this.dimensions.height,
            onChange: (v) =>
              this.update({
                dimensions: { width: this.dimensions.width, height: v },
              }),
          },
        ]}
      />
    );
    components.push(
      <SliderInput
        fields={[
          {
            label: "Min X Range",
            value: this.ranges.xrange[0],
            onChange: (v) =>
              this.update({
                ranges: {
                  xrange: [v, this.ranges.xrange[1], this.ranges.xrange[2]],
                  yrange: this.ranges.yrange,
                },
              }),
          },
          {
            label: "Max X Range",
            value: this.ranges.xrange[1],
            onChange: (v) =>
              this.update({
                ranges: {
                  xrange: [this.ranges.xrange[0], v, this.ranges.xrange[2]],
                  yrange: this.ranges.yrange,
                },
              }),
          },
          {
            label: "X step",
            value: this.ranges.xrange[2],
            onChange: (v) =>
              this.update({
                ranges: {
                  xrange: [this.ranges.xrange[0], this.ranges.xrange[1], v],
                  yrange: this.ranges.yrange,
                },
              }),
          },

          {
            label: "Min Y Range",
            value: this.ranges.yrange[0],
            onChange: (v) =>
              this.update({
                ranges: {
                  xrange: [
                    this.ranges.xrange[0],
                    this.ranges.xrange[1],
                    this.ranges.xrange[2],
                  ],
                  yrange: [v, this.ranges.yrange[1], this.ranges.yrange[2]],
                },
              }),
          },
          {
            label: "Max Y Range",
            value: this.ranges.yrange[1],
            onChange: (v) =>
              this.update({
                ranges: {
                  xrange: [
                    this.ranges.xrange[0],
                    this.ranges.xrange[1],
                    this.ranges.xrange[2],
                  ],
                  yrange: [this.ranges.yrange[0], v, this.ranges.yrange[2]],
                },
              }),
          },
          {
            label: "Y step",
            value: this.ranges.yrange[2],
            onChange: (v) =>
              this.update({
                ranges: {
                  xrange: [
                    this.ranges.xrange[0],
                    this.ranges.xrange[1],
                    this.ranges.xrange[2],
                  ],
                  yrange: [this.ranges.yrange[0], this.ranges.yrange[1], v],
                },
              }),
          },
        ]}
      />
    );
    components.push(
      <SliderInput
        fields={[
          {
            label: "Grid Thickness",
            value: this.gridthickness,
            onChange: (v) => {
              this.update({ gridthickness: v });
            },
            min: 1,
            max: 30,
            step: 1,
          },
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
    );
    components.push(
      <div className="flex items-center gap-2">
        <Checkbox
          id={`my-checkbox-showgrid`}
          defaultChecked={this.showgrid}
          onCheckedChange={(v) => this.update({ showgrid: v as boolean })}
        />
        <Label htmlFor={`my-checkbox-showgrid`} className="text-sm font-medium">
          Grid
        </Label>
      </div>
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
    components.push(
      <ColorDisc
        value={this.axiscolor}
        onChange={(v) => this.update({ axiscolor: v })}
      />
    );
    components.push(
      <ColorDisc
        value={this.labelcolor}
        onChange={(v) => this.update({ labelcolor: v })}
      />
    );

    return components;
  }
}
