import Konva from "@/lib/konva";
import { BaseProperties, BaseProperty } from "./base";
import PointsInput from "./input/pointsInput";
import { ColorDisc } from "./input/colordisc";
import SliderInput from "./input/sliderInput";

type Point = {
  x: number;
  y: number;
};

export interface PolygonProperties extends BaseProperties {
  points: Point[];
  bordercolor: string;
  thickness: number;
}

export class PolygonProperty extends BaseProperty {
  protected points: Point[] = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 },
  ];
  protected bordercolor: string = "#000000";
  protected thickness: number = 2;

  constructor(mobj: Konva.Line) {
    super(mobj);
  }
  override update(prop: Partial<PolygonProperties>): void {
    super.update(prop);
  }
  override getUIComponents(): React.ReactNode[] {
    const components = super.getUIComponents();
    components.push(
      <PointsInput
        points={this.points}
        onChange={(points) => this.update({ points })}
      />
    );
    components.push(
      <ColorDisc
        value={this.bordercolor}
        onChange={(v) => this.update({ bordercolor: v })}
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
    return components;
  }
}
