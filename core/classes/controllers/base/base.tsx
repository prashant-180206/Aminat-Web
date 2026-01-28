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

/**
 * Base properties interface that all Mobject controllers inherit.
 * Defines common visual properties for all objects.
 */
export interface BaseProperties {
  /** Position in Cartesian coordinates (not canvas coordinates) */
  position: { x: number; y: number };
  /** Hex color code (e.g., "#ffffff") */
  color: string;
  /** Uniform scale factor (1 = normal size) */
  scale: number;
  /** Rotation in degrees */
  rotation: number;
  /** Opacity from 0 (transparent) to 1 (opaque) */
  opacity: number;
  /** Z-index for layer ordering (higher = on top) */
  zindex: number;
}

/**
 * Base controller class for all Mobject properties.
 *
 * Manages common state (position, color, scale, rotation, opacity, z-index)
 * and provides standard UI components for editing these properties.
 *
 * All custom controllers should extend this class to inherit base functionality.
 *
 * @example
 * ```typescript
 * export class DotProperty extends BaseProperty {
 *   protected radius: number = 10;
 *
 *   constructor(mobj: Dot) {
 *     super(mobj.circle, mobj);
 *     // Custom initialization
 *   }
 *
 *   override update(prop: Partial<DotProperties>): void {
 *     super.update(prop);  // Handle base properties
 *     // Handle custom properties
 *   }
 * }
 * ```
 */
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
  /**
   * Update properties and sync changes to the Konva object.
   *
   * Override this method in subclasses to handle custom properties.
   * Always call super.update(prop) first to handle base properties.
   *
   * @param prop - Partial properties object with values to update
   *
   * @example
   * ```typescript
   * override update(prop: Partial<DotProperties>): void {
   *   super.update(prop);  // Handle base properties
   *
   *   if (prop.radius !== undefined) {
   *     this.radius = prop.radius;
   *     this.shapemobj.radius(this.radius);
   *   }
   * }
   * ```
   */
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

  /**
   * Get current property values as an object.
   * Used for serialization and animation.
   *
   * @returns Object containing all current property values
   */
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

  /**
   * Set property values from an object.
   * Used for deserialization and restoring state.
   *
   * @param data - Object containing property values to set
   */
  setData(data: BaseProperties) {
    this.update(data);
  }

  /**
   * Sync controller state FROM the Konva object.
   * Called after drag operations or external modifications.
   *
   * Override in subclasses if you have additional properties to sync.
   */
  refresh() {
    const pos = this.shapemobj.position();
    this.position = c2p(pos.x, pos.y);
    this.scale = this.actualMobj.scaleX();
    this.rotation = this.actualMobj.rotation();
    this.opacity = this.actualMobj.opacity();
    this.zindex = this.actualMobj.zIndex();
  }
}
