import Konva from "@/lib/konva";
import { LineProperties, LineProperty } from "./line";
import { MVector } from "../mobjects/geometric/vector";
import SliderInput from "./input/sliderInput";

export interface VectorProperties extends LineProperties {
  pointerSize: number;
}

export class VectorProperty extends LineProperty {
  protected pointerSize: number;
  //   protected mobj: Konva.Arrow;

  constructor(mobj: MVector) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    super(mobj as any);
    this.shapemobj = mobj.line;
    this.pointerSize = 10;
  }
  override update(prop: Partial<VectorProperties>): void {
    super.update(prop);
    if (prop.pointerSize !== undefined) {
      this.pointerSize = prop.pointerSize;
      if (this.shapemobj instanceof Konva.Arrow) {
        this.shapemobj.pointerLength(this.pointerSize);
        this.shapemobj.pointerWidth(this.pointerSize);
      }
    }
  }
  override getUIComponents(): { name: string; component: React.ReactNode }[] {
    const components = super.getUIComponents();
    components.push({
      name: "Pointer Size",
      component: (
        <SliderInput
          key={"PointerSize"}
          fields={[
            {
              label: "Pointer Size",
              value: this.pointerSize,
              onChange: (v) => {
                this.update({ pointerSize: v });
              },
              min: 1,
              max: 50,
              step: 1,
            },
          ]}
        />
      ),
    });
    return components;
  }
  override getData(): VectorProperties {
    return {
      ...super.getData(),
      pointerSize: this.pointerSize,
    };
  }
  override setData(data: VectorProperties): void {
    super.setData(data);
    this.pointerSize = data.pointerSize;
    this.update(data);
  }
}
