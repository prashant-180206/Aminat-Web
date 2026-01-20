import { Checkbox } from "@/components/ui/checkbox";
import { BaseProperties, BaseProperty } from "../base/base";
import SliderInput from "../input/sliderInput";
import { Label } from "@/components/ui/label";
import { ColorDisc } from "../input/colordisc";
import Konva from "@/lib/konva";
// import { MPlane } from "../mobjects/group/plane";
import { Colors } from "@/core/utils/colors";
import { MPlane } from "../../mobjects/group/plane";
import { SlidersHorizontal, SquareDashedTopSolid } from "lucide-react";

export interface PlaneProperties extends BaseProperties {
  // done
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
  isComplex: boolean;
}
export class PlaneProperty extends BaseProperty {
  protected ranges: {
    xrange: [number, number, number];
    yrange: [number, number, number];
  } = { xrange: [-10, 10, 1], yrange: [-10, 10, 1] };
  protected gridthickness: number = 2;
  protected axisthickness: number = 6;
  protected axiscolor: string = Colors.FILL;
  protected showgrid: boolean = true;
  protected showlabels: boolean = true;
  protected labelsize: number = 32;
  protected labelcolor: string = Colors.TEXT_SEC;
  protected isComplex: boolean = false;

  constructor(mobj: MPlane) {
    super(mobj);
  }

  override update(prop: Partial<PlaneProperties>): void {
    super.update(prop);
    if (!(this.shapemobj instanceof MPlane)) return;
    if (prop.ranges) {
      this.ranges = prop.ranges;
      this.shapemobj.refreshPlane();
    }

    if (prop.isComplex !== undefined) {
      this.isComplex = prop.isComplex;
      this.shapemobj.refreshPlane();
    }

    if (prop.color) {
      this.shapemobj.gridGroup.children.forEach((line) => {
        if (line instanceof Konva.Line) line.stroke(prop.color!);
      });
    }

    if (prop.axiscolor) {
      this.axiscolor = prop.axiscolor;
      this.shapemobj.axesGroup.children.forEach((line) => {
        if (line instanceof Konva.Line) line.stroke(prop.axiscolor!);
      });

      this.shapemobj.ticksGroup.children.forEach((line) => {
        if (line instanceof Konva.Line) line.stroke(prop.axiscolor!);
      });
    }

    if (prop.axisthickness) {
      this.axisthickness = prop.axisthickness;
      this.shapemobj.axesGroup.children.forEach((line) => {
        if (line instanceof Konva.Line) line.strokeWidth(prop.axisthickness!);
      });

      this.shapemobj.ticksGroup.children.forEach((line) => {
        if (line instanceof Konva.Line) line.strokeWidth(prop.axisthickness!);
      });
    }

    if (prop.labelcolor) {
      this.labelcolor = prop.labelcolor;
      this.shapemobj.labelGroup.children.forEach((text) => {
        if (text instanceof Konva.Text) text.fill(prop.labelcolor!);
      });
    }
    if (prop.labelsize) {
      this.labelsize = prop.labelsize;
      this.shapemobj.labelGroup.children.forEach((text) => {
        if (text instanceof Konva.Text) text.fontSize(prop.labelsize!);
      });
    }
    if (prop.gridthickness) {
      this.gridthickness = prop.gridthickness;
      this.shapemobj.gridGroup.children.forEach((line) => {
        if (line instanceof Konva.Line) line.strokeWidth(prop.gridthickness!);
      });
    }

    if (prop.showgrid !== undefined) {
      this.showgrid = prop.showgrid;
      this.shapemobj.gridGroup.visible(prop.showgrid);
    }
    if (prop.showlabels !== undefined) {
      this.showlabels = prop.showlabels;
      this.shapemobj.labelGroup.visible(prop.showlabels);
    }
  }
  override getUIComponents(): { name: string; component: React.ReactNode }[] {
    const components = super.getUIComponents();

    components.push({
      name: "Ranges",
      component: (
        <SliderInput
          key={"Ranges"}
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
              max: 10,
              min: -10,
              step: 0.2,
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
              max: 10,
              min: -10,
              step: 0.2,
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
              min: 0.2,
              max: 6,
              step: 0.1,
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
              min: -10,
              max: 10,
              step: 0.2,
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
              min: -10,
              max: 10,
              step: 0.2,
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
              min: 0.2,
              max: 6,
              step: 0.1,
            },
          ]}
          icon={<SlidersHorizontal className="h-4 w-4" />}
          message="Ranges"
        />
      ),
    });
    components.push({
      name: "Line Thickness",
      component: (
        <SliderInput
          key={"LineThickness"}
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
          icon={<SquareDashedTopSolid className="h-4 w-4" />}
          message="Thickness"
        />
      ),
    });
    components.push({
      name: "Show Grid",
      component: (
        <div key={"ShowGrid"} className="flex items-center gap-2">
          <Checkbox
            id={`my-checkbox-showgrid`}
            defaultChecked={this.showgrid}
            onCheckedChange={(v) => this.update({ showgrid: v as boolean })}
          />
          <Label
            htmlFor={`my-checkbox-showgrid`}
            className="text-sm font-medium"
          >
            Grid
          </Label>
        </div>
      ),
    });
    components.push({
      name: "Is Complex Plane",
      component: (
        <div key={"IsComplexPlane"} className="flex items-center gap-2">
          <Checkbox
            id={`my-checkbox-iscomplexplane`}
            defaultChecked={this.isComplex}
            onCheckedChange={(v) => this.update({ isComplex: v as boolean })}
          />
          <Label
            htmlFor={`my-checkbox-iscomplexplane`}
            className="text-sm font-medium"
          >
            Complex Plane
          </Label>
        </div>
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
      name: "Axis Color",
      component: (
        <ColorDisc
          size={8}
          key={"AxisColor"}
          value={this.axiscolor}
          onChange={(v) => this.update({ axiscolor: v })}
          message="Axis Color"
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

    return components;
  }

  override getData(): PlaneProperties {
    return {
      ...super.getData(),
      isComplex: this.isComplex,
      ranges: this.ranges,
      gridthickness: this.gridthickness,
      axisthickness: this.axisthickness,
      axiscolor: this.axiscolor,
      showgrid: this.showgrid,
      showlabels: this.showlabels,
      labelsize: this.labelsize,
      labelcolor: this.labelcolor,
    };
  }
  override setData(data: PlaneProperties): void {
    super.setData(data);
    this.isComplex = data.isComplex;
    this.ranges = data.ranges;
    this.gridthickness = data.gridthickness;
    this.axisthickness = data.axisthickness;
    this.axiscolor = data.axiscolor;
    this.showgrid = data.showgrid;
    this.showlabels = data.showlabels;
    this.labelsize = data.labelsize;
    this.labelcolor = data.labelcolor;
    this.update(data);
  }
}
