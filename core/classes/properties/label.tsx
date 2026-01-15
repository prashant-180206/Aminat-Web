import Konva from "@/lib/konva";
import { LabelPopover } from "./input/labelInput";

export interface Label {
  labelText: string;
  visible: boolean;
  offset: { x: number; y: number };
  fontsize: number;
  color: string;
  position: "start" | "center" | "end";
  opacity: number;
}

export class LabelProperty {
  protected labelText: string = "Label";
  protected visible: boolean = true;
  protected offset: { x: number; y: number } = { x: 0, y: 0 };
  protected fontsize: number = 14;
  protected color: string = "#FFFFFF";
  protected position: "start" | "center" | "end" = "center";
  protected opacity: number = 1;
  protected mobj: Konva.Text;
  protected positionCoordinate: {
    start: { x: number; y: number };
    end: { x: number; y: number };
    center: { x: number; y: number };
  } = {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    center: { x: 0, y: 0 },
  };

  constructor(mobj: Konva.Text) {
    this.mobj = mobj;
    this.mobj.text(this.labelText);
    this.mobj.visible(this.visible);
    this.mobj.offset(this.offset);
    this.mobj.fontSize(this.fontsize);
    this.mobj.fill(this.color);
    this.mobj.opacity(this.opacity);
  }
  update(prop: Partial<Label>) {
    if (prop.labelText !== undefined) {
      this.labelText = prop.labelText;
      this.mobj.text(this.labelText);
    }
    if (prop.visible !== undefined) {
      this.visible = prop.visible;
      this.mobj.visible(this.visible);
    }
    if (prop.offset !== undefined) {
      this.offset = prop.offset;
      this.mobj.offset(this.offset);
    }
    if (prop.fontsize !== undefined) {
      this.fontsize = prop.fontsize;
      this.mobj.fontSize(this.fontsize);
    }
    if (prop.color !== undefined) {
      this.color = prop.color;
      this.mobj.fill(this.color);
    }
    if (prop.position !== undefined) {
      this.position = prop.position;
      this.updateFromPosition();
    }
    if (prop.opacity !== undefined) {
      this.opacity = prop.opacity;
      this.mobj.opacity(this.opacity);
    }
  }

  private updateFromPosition() {
    // This function can be used to update the label position based on some external data if needed
    if (this.position === "start") {
      this.mobj.position(this.positionCoordinate.start);
    } else if (this.position === "end") {
      this.mobj.position(this.positionCoordinate.end);
    } else if (this.position === "center") {
      this.mobj.position(this.positionCoordinate.center);
    }
  }

  setLabelPosition(coordinates: {
    start: { x: number; y: number };
    end: { x: number; y: number };
    center: { x: number; y: number };
  }) {
    this.positionCoordinate = coordinates;
  }

  getUIComponent(): React.ReactNode {
    const components: React.ReactNode[] = [];
    components.push(
      <LabelPopover
        value={{
          labelText: this.labelText,
          visible: this.visible,
          offset: this.offset,
          fontsize: this.fontsize,
          color: this.color,
          position: this.position,
          opacity: this.opacity,
        }}
        onChange={(next) => this.update(next)}
      />
    );

    return components;
  }

  getData(): Label {
    return {
      labelText: this.labelText,
      visible: this.visible,
      offset: this.offset,
      fontsize: this.fontsize,
      color: this.color,
      position: this.position,
      opacity: this.opacity,
    };
  }

  setData(data: Label): void {
    this.update(data);
  }
}
