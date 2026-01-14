import { AnimGetter } from "@/core/classes/animation/animgetter";
import { LineProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { MobjectAnimAdder } from "../../factories/mobjects/addAnimations";
import { Colors } from "@/core/utils/colors";
import { DEFAULT_SCALE } from "@/core/config";
import { TrackerEndPointsAdder } from "../../factories/mobjects/addTrackerEndPoints";

export class MLine extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private line: Konva.Line;
  private label: Konva.Text;
  private _properties: LineProperties = {
    position: { x: 0, y: 0 },
    color: Colors.PRIMARY,
    scale: 1,
    rotation: 0,
    lineEnds: {
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    thickness: 6,
    opacity: 1,
    zindex: 0,
    label: {
      labelText: "label",
      visible: false,
      offset: { x: 0, y: 0 },
      fontsize: 32,
      color: Colors.TEXT,
      position: "center",
      opacity: 1,
    },
  };
  private _TYPE: string;

  constructor(TYPE: string, config: Partial<LineProperties> = {}) {
    super({});
    this.line = new Konva.Line({
      tension: 0,
      lineCap: "round",
      lineJoin: "round",
    });
    this.add(this.line);
    this.line.position({ x: 0, y: 0 });

    this.position({ x: 0, y: 0 });

    this.label = new Konva.Text({
      text: this._properties.label.labelText,
      fontSize: this._properties.label.fontsize,
      fill: this._properties.label.color,
      x: this._properties.label.offset.x,
      y: this._properties.label.offset.y,
      visible: this._properties.label.visible,
      listening: false,
    });

    this.add(this.label);

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);
    this._properties = { ...this._properties, ...config };
    this.name("Line");
    TrackerEndPointsAdder.addLinePointConnectors(this);
    MobjectAnimAdder.addLineAnimations(this);
    MobjectAnimAdder.addLabelAnimations(this);
    this.properties = this._properties;
  }

  /* ------------------------------------------------------- */
  /* Getters / Setters                                       */
  /* ------------------------------------------------------- */

  type(): string {
    return this._TYPE;
  }

  get properties(): LineProperties {
    return { ...this._properties };
  }

  set properties(value: Partial<LineProperties>) {
    Object.assign(this._properties, value);
    if (value.position) {
      console.log(value.position);
      this.position(p2c(value.position.x, value.position.y));
      this.setLabelPosition();
    }
    if (value.lineEnds) {
      const { start, end } = this._properties.lineEnds;
      const st = {
        x: start.x * DEFAULT_SCALE,
        y: -start.y * DEFAULT_SCALE,
      };
      const en = {
        x: end.x * DEFAULT_SCALE,
        y: -end.y * DEFAULT_SCALE,
      };
      this.line.points([st.x, st.y, en.x, en.y]);
    }
    if (value.color) this.line.stroke(value.color);
    if (value.thickness) this.line.strokeWidth(value.thickness);
    if (value.scale) this.scale({ x: value.scale, y: value.scale });
    if (value.rotation) this.rotation(value.rotation);
    if (value.opacity) this.opacity(value.opacity);
    if (this.parent && value.zindex) this.zIndex(value.zindex);
    if (value.label) {
      this.label.text(value.label.labelText);
      this.label.fontSize(value.label.fontsize);
      this.label.fill(value.label.color);
      this.setLabelPosition();
      this.label.visible(value.label.visible);
    }
    if (value.label && value.label.opacity) {
      this.label.opacity(value.label.opacity);
    }
    // this.updateFromProperties();
  }

  private setLabelPosition() {
    let position = { x: 0, y: 0 };
    const { start, end } = this._properties.lineEnds;
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    if (this._properties.label.position === "start") {
      position = { x: start.x, y: start.y };
    } else if (this._properties.label.position === "end") {
      position = { x: end.x, y: end.y };
    } else if (this._properties.label.position === "center") {
      position = { x: midX, y: midY };
    }
    this.label.position({
      x: position.x * DEFAULT_SCALE + this._properties.label.offset.x,
      y: -position.y * DEFAULT_SCALE + this._properties.label.offset.y,
    });
  }

  /* ------------------------------------------------------- */
  /* Internal Sync Logic                                     */
  /* ------------------------------------------------------- */

  /**
   * Syncs internal _properties to match the current Konva visual state.
   */
  UpdateFromKonvaProperties() {
    const pos = this.position();
    const newPos = c2p(pos.x, pos.y);
    this._properties.position = newPos;

    const pts = this.line.points();
    const startLogical = {
      x: pts[0] / DEFAULT_SCALE,
      y: -pts[1] / DEFAULT_SCALE,
    };
    const endLogical = {
      x: pts[2] / DEFAULT_SCALE,
      y: -pts[3] / DEFAULT_SCALE,
    };
    this._properties.lineEnds.start = {
      x: startLogical.x,
      y: startLogical.y,
    };
    this._properties.lineEnds.end = {
      x: endLogical.x,
      y: endLogical.y,
    };
  }

  /* ------------------------------------------------------- */
  /* Serialization                                           */
  /* ------------------------------------------------------- */

  storeAsObj(): MobjectData {
    return {
      properties: this._properties,
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.properties = obj.properties as LineProperties;
    // Ensure the Konva state matches loaded properties
    this.UpdateFromKonvaProperties();
  }
}
