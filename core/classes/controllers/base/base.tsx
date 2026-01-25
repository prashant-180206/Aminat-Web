import { Colors } from "@/core/utils/colors";
import { c2p, p2c } from "@/core/utils/conversion";
import Konva from "@/lib/konva";
import React from "react";
import { Expand, Eye, Move, RotateCw } from "lucide-react";
import { NumberInputs } from "../input/dualInput";
import SliderInput from "../input/sliderInput";
import { ColorDisc } from "../input/colordisc";
import { NumberStepperInput } from "../input/numberstepper";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  protected shapemobj: Konva.Shape | Konva.Node;
  protected actualMobj: Konva.Node;

  constructor(mobj: Konva.Shape | Konva.Node, actualMobj?: Konva.Node) {
    this.shapemobj = mobj;
    this.actualMobj = actualMobj ? actualMobj : mobj;
    this.actualMobj.position(c2p(this.position.x, this.position.y));
    if (this.shapemobj instanceof Konva.Shape) this.shapemobj.fill(this.color);
    this.actualMobj.scale({ x: this.scale, y: this.scale });
    this.actualMobj.rotation(this.rotation);
    this.actualMobj.opacity(this.opacity);
    if (this.actualMobj && this.actualMobj.parent)
      this.actualMobj.zIndex(this.zindex);
    this.actualMobj.on("dragmove", this.refresh.bind(this));
    this.update({
      position: this.position,
      color: this.color,
      scale: this.scale,
      rotation: this.rotation,
      opacity: this.opacity,
      zindex: this.zindex,
    });
  }
  update(prop: Partial<BaseProperties>) {
    if (prop.position !== undefined) {
      const newpos = p2c(
        prop.position.x ?? this.position.x,
        prop.position.y ?? this.position.y,
      );
      this.actualMobj.position({ x: newpos.x, y: newpos.y });
      this.position = prop.position;
    }
    if (prop.color !== undefined) {
      this.color = prop.color;
      if (this.shapemobj instanceof Konva.Shape)
        this.shapemobj.fill(this.color);
      if (this.shapemobj instanceof Konva.Line)
        this.shapemobj.stroke(this.color);
    }
    if (prop.scale !== undefined) {
      this.scale = prop.scale;
      this.actualMobj.scale({ x: this.scale, y: this.scale });
    }
    if (prop.rotation !== undefined) {
      this.rotation = prop.rotation;
      this.actualMobj.rotation(this.rotation);
    }
    if (prop.opacity !== undefined) {
      this.opacity = prop.opacity;
      this.actualMobj.opacity(this.opacity);
    }
    if (prop.zindex !== undefined) {
      this.zindex = prop.zindex;
      try {
        if (this.actualMobj && this.actualMobj.parent)
          this.actualMobj.zIndex(this.zindex);
      } catch {}
    }
    this.refresh();
  }

  getUIComponents(): { name: string; component: React.ReactNode }[] {
    const components: { name: string; component: React.ReactNode }[] = [];

    components.push({
      name: "Position",
      component: (
        <NumberInputs
          key={"Position"}
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
          message="Position"
        />
      ),
    });
    components.push({
      name: "Color",
      component: (
        <ColorDisc
          size={8}
          value={this.color}
          onChange={(val) => this.update({ color: val })}
        />
      ),
    });
    components.push({
      name: "Scale",
      component: (
        <SliderInput
          key={"Scale"}
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
          icon={<Expand className="h-4 w-4" />}
          message="Scale"
        />
      ),
    });
    components.push({
      name: "Rotation",
      component: (
        <SliderInput
          key={"Rotation"}
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
          icon={<RotateCw className="h-4 w-4" />}
          message="Rotation"
        />
      ),
    });
    components.push({
      name: "Opacity",
      component: (
        <SliderInput
          key={"Opacity"}
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
          icon={<Eye className="h-4 w-4" />}
          message="Opacity"
        />
      ),
    });
    components.push({
      name: "Z-Index",
      component: (
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <NumberStepperInput
                key={"ZIndex"}
                value={this.zindex}
                onChange={(v) => this.update({ zindex: v })}
                min={0}
                step={1}
                max={50}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>Z Index</TooltipContent>
        </Tooltip>
      ),
    });
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
    const pos = this.shapemobj.position();
    this.position = c2p(pos.x, pos.y);
    this.scale = this.actualMobj.scaleX();
    this.rotation = this.actualMobj.rotation();
    this.opacity = this.actualMobj.opacity();
    this.zindex = this.actualMobj.zIndex();
  }
}
