// anim/classes/mobjects/vector.ts
import { AnimGetter } from "@/core/classes/animation/animgetter";
import { VectorProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { MobjectAnimAdder } from "../../factories/mobjects/addAnimations";
import { Colors } from "@/core/utils/colors";
import { DEFAULT_SCALE } from "@/core/config";

export class MVector extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  protected arrow: Konva.Arrow;
  private label: Konva.Text;
  private _properties: VectorProperties;
  private _TYPE: string;

  constructor(TYPE: string, config: Partial<VectorProperties> = {}) {
    super();

    this.position({ x: 0, y: 0 });
    this.arrow = new Konva.Arrow({
      tension: 0,
      lineCap: "round",
      lineJoin: "round",
    } as Konva.ArrowConfig);

    this.add(this.arrow);
    this.arrow.position({ x: 0, y: 0 });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    this._properties = {
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
      pointerSize: 16,
      label: {
        labelText: "label",
        visible: false,
        offset: { x: 0, y: 0 },
        fontsize: 32,
        color: Colors.TEXT,
        position: "center",
      },
      ...config,
    };

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
    this.name("Vector");
    this.setupTrackerConnectors();
    MobjectAnimAdder.addLineAnimations(this);

    // Initial sync
    this.properties = this._properties;
  }

  private setupTrackerConnectors() {
    const directions = ["startX", "startY", "endX", "endY"] as const;
    directions.forEach((key) => {
      this.trackerconnector.addConnectorFunc(key, (value: number) => {
        const { lineEnds } = this._properties;
        const newEnds = { ...lineEnds };

        if (key === "startX") newEnds.start.x = value;
        if (key === "startY") newEnds.start.y = value;
        if (key === "endX") newEnds.end.x = value;
        if (key === "endY") newEnds.end.y = value;

        this.properties = { lineEnds: newEnds };
      });
    });
  }

  /* ------------------------------------------------------- */
  /* Getters / Setters                                       */
  /* ------------------------------------------------------- */

  type(): string {
    return this._TYPE;
  }

  get properties(): VectorProperties {
    return { ...this._properties };
  }

  set properties(value: Partial<VectorProperties>) {
    Object.assign(this._properties, value);
    if (value.position) {
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
      this.arrow.points([st.x, st.y, en.x, en.y]);
    }
    if (value.color) this.arrow.stroke(value.color);
    if (value.thickness) this.arrow.strokeWidth(value.thickness);
    if (value.scale) this.scale({ x: value.scale, y: value.scale });
    if (value.rotation) this.rotation(value.rotation);
    if (value.opacity) this.opacity(value.opacity);
    if (this.parent && value.zindex) this.zIndex(value.zindex);
    if (value.pointerSize) {
      this.arrow.pointerLength(value.pointerSize * this._properties.scale);
      this.arrow.pointerWidth(value.pointerSize * this._properties.scale);
    }
    if (value.label) {
      this.label.text(value.label.labelText);
      this.label.fontSize(value.label.fontsize);
      this.label.fill(value.label.color);
      this.setLabelPosition();
      this.label.visible(value.label.visible);
    }
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
  UpdateFromKonvaProperties() {
    const pos = this.position();
    const newPos = c2p(pos.x, pos.y);
    this._properties.position = newPos;

    const pts = this.arrow.points();
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

  storeAsObj() {
    return {
      properties: this._properties,
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.properties = obj.properties as VectorProperties;
    this.UpdateFromKonvaProperties();
  }
}

export class DoubleArrow extends MVector {
  constructor(type: string, config: Partial<VectorProperties> = {}) {
    super(type, config);
    this.name("DoubleArrow");
    this.arrow.pointerAtBeginning(true);
  }
}
