import { Colors } from "@/core/utils/colors";
import { c2p, p2c } from "@/core/utils/conversion";
import Konva from "@/lib/konva";
import React from "react";
import { Move } from "lucide-react";
import { NumberInputs } from "./input/dualInput";
import SliderInput from "./input/sliderInput";
import { ColorDisc } from "./input/colordisc";
import { NumberStepperInput } from "./input/numberstepper";

export interface BaseProperties {
  position: { x: number; y: number };
  color: string;
  scale: number;
  rotation: number;
  opacity: number;
  zindex: number;
}

// import { Colors } from "../../utils/colors";
export class BaseProperty {
  protected position: { x: number; y: number } = { x: 0, y: 0 };
  protected color: string = Colors.PRIMARY;
  protected scale: number = 1;
  protected rotation: number = 0;
  protected opacity: number = 1;
  protected zindex: number = 0;
  protected mobj: Konva.Node;

  constructor(mobj: Konva.Node) {
    mobj.position(c2p(this.position.x, this.position.y));
    if (mobj instanceof Konva.Shape) mobj.fill(this.color);
    mobj.scale({ x: this.scale, y: this.scale });
    mobj.rotation(this.rotation);
    mobj.opacity(this.opacity);
    mobj.zIndex(this.zindex);
    this.mobj = mobj;
    mobj.on("dragmove", this.refresh.bind(this));
  }
  update(prop: Partial<BaseProperties>) {
    if (prop.position !== undefined) {
      const newpos = p2c(
        prop.position.x ?? this.position.x,
        prop.position.y ?? this.position.y
      );
      this.mobj.position({ x: newpos.x, y: newpos.y });
    }
    if (prop.color !== undefined) {
      this.color = prop.color;
      if (this.mobj instanceof Konva.Shape) this.mobj.fill(this.color);
    }
    if (prop.scale !== undefined) {
      this.scale = prop.scale;
      this.mobj.scale({ x: this.scale, y: this.scale });
    }
    if (prop.rotation !== undefined) {
      this.rotation = prop.rotation;
      this.mobj.rotation(this.rotation);
    }
    if (prop.opacity !== undefined) {
      this.opacity = prop.opacity;
      this.mobj.opacity(this.opacity);
    }
    if (prop.zindex !== undefined) {
      this.zindex = prop.zindex;
      this.mobj.zIndex(this.zindex);
    }
  }

  getUIComponents(): React.ReactNode[] {
    const components: React.ReactNode[] = [];

    components.push(
      <NumberInputs
        inputs={[
          {
            label: "X",
            value: this.position.x,
            onChange: (v) =>
              this.update({ position: { ...this.position, x: v } }),
          },
          {
            label: "Y",
            value: this.position.y,
            onChange: (v) =>
              this.update({ position: { ...this.position, y: v } }),
          },
        ]}
        icon={<Move className="h-4 w-4" />}
      />
    );
    components.push(
      <SliderInput
        fields={[
          {
            label: "Scale",
            value: this.scale,
            onChange: (v) => this.update({ scale: v }),
            min: 0.1,
            max: 5,
            step: 0.1,
          },
        ]}
      />
    );
    components.push(
      <ColorDisc
        value={this.color}
        onChange={(val) => this.update({ color: val })}
      />
    );
    components.push(
      <SliderInput
        fields={[
          {
            label: "Rotation",
            value: this.rotation,
            onChange: (v) => this.update({ rotation: v }),
            min: 0,
            max: 360,
            step: 1,
          },
        ]}
      />
    );
    components.push(
      <SliderInput
        fields={[
          {
            label: "Opacity",
            value: this.opacity,
            onChange: (v) => this.update({ opacity: v }),
            min: 0,
            max: 1,
            step: 0.01,
          },
        ]}
      />
    );
    components.push(
      <NumberStepperInput
        value={this.zindex}
        onChange={(v) => this.update({ zindex: v })}
        min={0}
        step={1}
        max={50}
      />
    );
    return components;
  }

  getData(): BaseProperties {
    return {
      position: this.position,
      color: this.color,
      scale: this.scale,
      rotation: this.rotation,
      opacity: this.opacity,
      zindex: this.zindex,
    };
  }
  setData(data: BaseProperties) {
    this.update(data);
  }

  refresh() {
    const pos = this.mobj.position();
    this.update({
      position: c2p(pos.x, pos.y),
      scale: this.mobj.scaleX(),
      rotation: this.mobj.rotation(),
      opacity: this.mobj.opacity(),
    });
  }
}
