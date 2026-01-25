import Konva from "@/lib/konva";
import { BaseProperties, BaseProperty } from "../base/base";
import { Label, LabelProperty } from "../base/label";
import { NumberInputs } from "../input/dualInput";
import SliderInput from "../input/sliderInput";
import { DEFAULT_SCALE } from "@/core/config";
import { c2p } from "@/core/utils/conversion";
import { MLine } from "../../mobjects/simple/line";
import { SlidersHorizontal, SquareDashedTopSolid } from "lucide-react";

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
  } = { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } };
  protected thickness: number = 6;
  protected label: LabelProperty;
  protected labelobj: Konva.Text;

  constructor(mobj: MLine) {
    super(mobj.line, mobj);
    this.labelobj = mobj.label;
    this.label = new LabelProperty(mobj.label);
    this.update({
      lineEnds: this.lineEnds,
      thickness: this.thickness,
      label: this.label.getData(),
    });
  }

  private changeLabel() {
    const text = this.label.defaultText;
    const updatedLine = text
      .replace("lstartx", this.lineEnds.start.x.toFixed(1))
      .replace("lstarty", this.lineEnds.start.y.toFixed(1))
      .replace("lendx", this.lineEnds.end.x.toFixed(1))
      .replace("lendy", this.lineEnds.end.y.toFixed(1));
    this.labelobj.text(updatedLine);
  }

  private updatePosCoords() {
    const { start, end } = this.lineEnds;
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    this.label.setPosCoordinateMap({
      start: { x: start.x * DEFAULT_SCALE, y: start.y * -DEFAULT_SCALE },
      end: { x: end.x * DEFAULT_SCALE, y: end.y * -DEFAULT_SCALE },
      center: { x: midX * DEFAULT_SCALE, y: midY * -DEFAULT_SCALE },
    });
  }
  override update(prop: Partial<LineProperties>) {
    super.update(prop);
    if (prop.lineEnds !== undefined) {
      this.lineEnds = prop.lineEnds;
      (this.shapemobj as Konva.Line).points([
        this.lineEnds.start.x * DEFAULT_SCALE,
        this.lineEnds.start.y * -DEFAULT_SCALE,
        this.lineEnds.end.x * DEFAULT_SCALE,
        this.lineEnds.end.y * -DEFAULT_SCALE,
      ]);
      this.changeLabel();
      this.updatePosCoords();
    }
    if (prop.thickness !== undefined) {
      this.thickness = prop.thickness;
      if (this.shapemobj instanceof Konva.Line)
        this.shapemobj.strokeWidth(this.thickness);
    }
    if (prop.label !== undefined) {
      this.label.update(prop.label);
      this.changeLabel();
    }
  }
  override getUIComponents(): { name: string; component: React.ReactNode }[] {
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

    components.push({
      name: "Line Ends",
      component: (
        <NumberInputs
          key={"LineEnds"}
          inputs={inputs.map(([label, point, axis]) => ({
            label,
            value: this.lineEnds[point][axis],
            onChange: makeHandler(point, axis),
          }))}
          icon={<SlidersHorizontal className="h-4 w-4" />}
          message="Line Ends"
        />
      ),
    });

    components.push({
      name: "Thickness",
      component: (
        <SliderInput
          key={"Thickness"}
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
          icon={<SquareDashedTopSolid className="h-4 w-4" />}
          message="Thickness"
        />
      ),
    });
    components.push({
      name: "Label",
      component: this.label.getUIComponent(),
    });
    return components;
  }

  override getData(): LineProperties {
    return {
      ...super.getData(),
      lineEnds: this.lineEnds,
      thickness: this.thickness,
      label: this.label.getData(),
    };
  }

  override setData(data: LineProperties): void {
    super.setData(data);
    const lineData = data;
    this.update(lineData);
  }

  override refresh(): void {
    const pos = this.shapemobj.position();
    const newPos = c2p(pos.x, pos.y);
    this.position = newPos;
    if (!(this.shapemobj instanceof Konva.Line)) return;

    const pts = this.shapemobj.points();
    if (pts.length < 4) return;
    const startLogical = {
      x: pts[0] / DEFAULT_SCALE,
      y: -pts[1] / DEFAULT_SCALE,
    };
    const endLogical = {
      x: pts[2] / DEFAULT_SCALE,
      y: -pts[3] / DEFAULT_SCALE,
    };
    this.lineEnds.start = {
      x: startLogical.x,
      y: startLogical.y,
    };
    this.lineEnds.end = {
      x: endLogical.x,
      y: endLogical.y,
    };
  }
}
