import { AnimGetter } from "@/core/classes/animation/animgetter";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { DEFAULT_SCALE } from "@/core/config";
import {
  NumberLineProperties,
  NumberLineProperty,
} from "../../properties/numberLine";

export class MNumberLine extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _TYPE: string;

  public features: NumberLineProperty;

  axisGroup: Konva.Group;
  ticksGroup: Konva.Group;
  labelGroup: Konva.Group;
  constructor(TYPE: string) {
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

    this.features = new NumberLineProperty(this);
    this.refreshNumberLine();
  }

  type(): string {
    return this._TYPE;
  }

  get properties(): NumberLineProperties {
    return { ...this.features.getData() };
  }
  getUIComponents(): {
    name: string;
    component: React.ReactNode;
  }[] {
    return this.features.getUIComponents();
  }
  /* ------------------------------------------------------- */
  /* Rendering                                               */
  /* ------------------------------------------------------- */

  refreshNumberLine() {
    this.axisGroup.destroyChildren();
    this.ticksGroup.destroyChildren();
    this.labelGroup.destroyChildren();

    const {
      range: [min, max, step],
      color,
      axisthickness,
      labelsize,
      labelcolor,
    } = this.features.getData();

    // Axis
    this.axisGroup.add(
      new Konva.Line({
        points: [min * DEFAULT_SCALE, 0, max * DEFAULT_SCALE, 0],
        stroke: color,
        strokeWidth: axisthickness,
      })
    );

    const TICK_SIZE = 8;

    const drawTick = (x: number) =>
      this.ticksGroup.add(
        new Konva.Line({
          points: [x * DEFAULT_SCALE, -TICK_SIZE, x * DEFAULT_SCALE, TICK_SIZE],
          stroke: color,
          strokeWidth: axisthickness,
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

  storeAsObj(): MobjectData {
    return {
      properties: this.features.getData(),
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.features.setData(obj.properties as NumberLineProperties);
    this.features.refresh();
  }
}
