import Konva from "@/lib/konva";
import { LabelPopover } from "../input/labelInput";

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
  protected visible: boolean = false;
  protected offset: { x: number; y: number } = { x: 40, y: 40 };
  protected fontsize: number = 32;
  protected color: string = "#FFFFFF";
  protected position: "start" | "center" | "end" = "center";
  protected opacity: number = 1;
  protected mobj: Konva.Text;

  private posCoordinateMap = {
    start: { x: 0, y: 0 },
    center: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  };

  public defaultText: string = "Label";

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
      this.defaultText = prop.labelText;
      this.changeText(prop.labelText);
    }
    if (prop.visible !== undefined) {
      this.visible = prop.visible;
      this.mobj.visible(this.visible);
    }
    if (prop.position !== undefined) {
      this.setPosition(prop.position);
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
    if (prop.opacity !== undefined) {
      this.opacity = prop.opacity;
      this.mobj.opacity(this.opacity);
    }
  }

  changeText(text: string) {
    this.labelText = text;
    this.mobj.text(this.labelText);
  }

  setPosition(position: "start" | "center" | "end") {
    this.position = position;
    if (position === "start") {
      this.mobj.position(this.posCoordinateMap.start);
    } else if (position === "center") {
      this.mobj.position(this.posCoordinateMap.center);
    } else if (position === "end") {
      this.mobj.position(this.posCoordinateMap.end);
    }
  }

  setPosCoordinateMap(map: {
    start: { x: number; y: number };
    center: { x: number; y: number };
    end: { x: number; y: number };
  }) {
    this.posCoordinateMap = map;
    this.setPosition(this.position);
  }

  getUIComponent(): React.ReactNode {
    const components: React.ReactNode[] = [];
    components.push(
      <LabelPopover
        key={"LabelPopover"}
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
      />,
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
