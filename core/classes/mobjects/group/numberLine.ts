import { AnimGetter } from "@/core/classes/animation/animgetter";
import { NumberLineProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { Colors } from "@/core/utils/colors";
import { DEFAULT_SCALE } from "@/core/config";

export class MNumberLine extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _TYPE: string;

  private _properties: NumberLineProperties = {
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0,
    opacity: 1,
    zindex: 0,
    range: [-5, 5, 1],
    axissthickness: 4,
    color: Colors.BORDER,
    showlabels: true,
    labelsize: 32,
    labelcolor: Colors.TEXT,
  };

  private axisGroup: Konva.Group;
  private ticksGroup: Konva.Group;
  private labelGroup: Konva.Group;

  constructor(TYPE: string, config: Partial<NumberLineProperties> = {}) {
    super({
      draggable: true,
      name: "NumberLine",
    });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    this.axisGroup = new Konva.Group({ name: "Axis" });
    this.ticksGroup = new Konva.Group({ name: "Ticks", listening: false });
    this.labelGroup = new Konva.Group({ name: "Labels", listening: false });

    this.add(this.axisGroup);
    this.add(this.ticksGroup);
    this.add(this.labelGroup);

    this.properties = { ...this._properties, ...config };
  }

  type(): string {
    return this._TYPE;
  }

  get properties(): NumberLineProperties {
    return { ...this._properties };
  }

  set properties(value: Partial<NumberLineProperties>) {
    Object.assign(this._properties, value);

    if (value.position) this.position(p2c(value.position.x, value.position.y));
    if (value.scale) this.scale({ x: value.scale, y: value.scale });
    if (value.rotation) this.rotation(value.rotation);
    if (value.opacity) this.opacity(value.opacity);
    if (this.parent && value.zindex) this.zIndex(value.zindex);

    if (value.range) this.refreshNumberLine();

    if (value.color) {
      this.axisGroup.children.forEach((l) => {
        if (l instanceof Konva.Line) l.stroke(value.color!);
      });
      this.ticksGroup.children.forEach((l) => {
        if (l instanceof Konva.Line) l.stroke(value.color!);
      });
    }

    if (value.axissthickness) {
      this.axisGroup.children.forEach((l) => {
        if (l instanceof Konva.Line) l.strokeWidth(value.axissthickness!);
      });
      this.ticksGroup.children.forEach((l) => {
        if (l instanceof Konva.Line) l.strokeWidth(value.axissthickness!);
      });
    }

    if (value.labelcolor) {
      this.labelGroup.children.forEach((t) => {
        if (t instanceof Konva.Text) t.fill(value.labelcolor!);
      });
    }

    if (value.labelsize) {
      this.labelGroup.children.forEach((t) => {
        if (t instanceof Konva.Text) t.fontSize(value.labelsize!);
      });
    }

    if (value.showlabels !== undefined) {
      this.labelGroup.visible(value.showlabels);
    }
  }

  /* ------------------------------------------------------- */
  /* Rendering                                               */
  /* ------------------------------------------------------- */

  private refreshNumberLine() {
    this.axisGroup.destroyChildren();
    this.ticksGroup.destroyChildren();
    this.labelGroup.destroyChildren();

    const {
      range: [min, max, step],
      color,
      axissthickness,
      labelsize,
      labelcolor,
    } = this._properties;

    // Axis
    this.axisGroup.add(
      new Konva.Line({
        points: [min * DEFAULT_SCALE, 0, max * DEFAULT_SCALE, 0],
        stroke: color,
        strokeWidth: axissthickness,
      })
    );

    const TICK_SIZE = 8;

    const drawTick = (x: number) =>
      this.ticksGroup.add(
        new Konva.Line({
          points: [x * DEFAULT_SCALE, -TICK_SIZE, x * DEFAULT_SCALE, TICK_SIZE],
          stroke: color,
          strokeWidth: axissthickness,
        })
      );

    const drawLabel = (x: number) =>
      this.labelGroup.add(
        new Konva.Text({
          x: x * DEFAULT_SCALE,
          y: TICK_SIZE + 4,
          text: x.toString().slice(0, 6),
          offsetX: labelsize / 2,
          fontSize: labelsize,
          align: "center",
          fill: labelcolor,
        })
      );

    const steps = Math.ceil(Math.max(Math.abs(min), Math.abs(max)) / step);

    for (let i = 1; i <= steps; i++) {
      const p = i * step;
      const n = -p;

      if (p <= max) {
        drawTick(p);
        drawLabel(p);
      }
      if (n >= min) {
        drawTick(n);
        drawLabel(n);
      }
    }

    // Zero
    if (0 >= min && 0 <= max) {
      drawTick(0);
      drawLabel(0);
    }

    this.getLayer()?.batchDraw();
  }

  /* ------------------------------------------------------- */
  /* Sync / Serialization                                   */
  /* ------------------------------------------------------- */

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = c2p(pos.x, pos.y);
    this._properties.scale = this.scaleX();
    this._properties.rotation = this.rotation();
  }

  storeAsObj(): MobjectData {
    return {
      properties: this._properties,
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.properties = obj.properties as NumberLineProperties;
    this.UpdateFromKonvaProperties();
  }
}
