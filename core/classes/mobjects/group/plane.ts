// anim/classes/mobjects/simple/plane.ts
import { AnimGetter } from "@/core/classes/animation/animgetter";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { DEFAULT_SCALE } from "@/core/config";
import { PlaneProperties, PlaneProperty } from "../../controllers/group/plane";

export class MPlane extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _TYPE: string;

  public features: PlaneProperty;

  // Sub-groups for organization
  gridGroup: Konva.Group;
  axesGroup: Konva.Group;
  labelGroup: Konva.Group;
  ticksGroup: Konva.Group;

  constructor(TYPE: string) {
    super({
      draggable: true,
      name: "Plane",
    });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    // Initialize layers within the group
    this.gridGroup = new Konva.Group({ name: "GridLines", listening: false });
    this.axesGroup = new Konva.Group({ name: "Axes" });
    this.labelGroup = new Konva.Group({ name: "Labels", listening: false });
    this.ticksGroup = new Konva.Group({ name: "AxisTicks", listening: false });

    this.add(this.gridGroup);
    this.add(this.axesGroup);
    this.add(this.ticksGroup);
    this.add(this.labelGroup);

    this.features = new PlaneProperty(this);
    this.refreshPlane();
  }

  type(): string {
    return this._TYPE;
  }

  get properties(): PlaneProperties {
    return { ...this.features.getData() };
  }
  getUIComponents(): {
    name: string;
    component: React.ReactNode;
  }[] {
    return this.features.getUIComponents();
  }
  refreshPlane() {
    this.gridGroup.destroyChildren();
    this.axesGroup.destroyChildren();
    this.labelGroup.destroyChildren();
    this.ticksGroup.destroyChildren();

    const {
      ranges: { xrange, yrange },
      labelsize,
      axiscolor,
      color,
      labelcolor,
      gridthickness,
      axisthickness,
    } = this.features.getData();

    const drawAxis = (points: number[]) =>
      this.axesGroup.add(
        new Konva.Line({
          points,
          opacity: 1,
          stroke: axiscolor,
          strokeWidth: axisthickness,
        }),
      );

    const drawGridLine = (points: number[]) =>
      this.gridGroup.add(
        new Konva.Line({
          points,
          opacity: 0.4,
          stroke: color,
          strokeWidth: gridthickness,
        }),
      );

    const drawXLabel = (x: number) =>
      this.labelGroup.add(
        new Konva.Text({
          x: x * DEFAULT_SCALE,
          y: 5,
          text: x.toString().slice(0, 4),
          align: "center",
          offsetX: labelsize / 2,
          fill: labelcolor,
        }),
      );

    const drawYLabel = (y: number) =>
      this.labelGroup.add(
        new Konva.Text({
          x: -2 * labelsize - 10,
          y: -y * DEFAULT_SCALE - labelsize / 2,
          text: y.toString().slice(0, 4),
          align: "right",
          width: labelsize * 2,
          offsetY: labelsize / 2,
          fill: labelcolor,
        }),
      );

    const TICK_SIZE = 8;

    const drawXTick = (x: number) =>
      this.ticksGroup.add(
        new Konva.Line({
          points: [x * DEFAULT_SCALE, -TICK_SIZE, x * DEFAULT_SCALE, TICK_SIZE],
          stroke: axiscolor,
          strokeWidth: axisthickness,
          opacity: 1,
        }),
      );

    const drawYTick = (y: number) =>
      this.ticksGroup.add(
        new Konva.Line({
          points: [
            -TICK_SIZE,
            -y * DEFAULT_SCALE,
            TICK_SIZE,
            -y * DEFAULT_SCALE,
          ],
          stroke: axiscolor,
          strokeWidth: axisthickness,
          opacity: 1,
        }),
      );

    const generateAxisGrid = (
      min: number,
      max: number,
      step: number,
      drawLine: (v: number) => void,
      drawLabel: (v: number) => void,
    ) => {
      const steps = Math.ceil(Math.max(Math.abs(min), Math.abs(max)) / step);

      for (let i = 1; i <= steps; i++) {
        const p = i * step;
        const n = -p;

        if (p <= max) {
          drawLine(p);
          drawLabel(p);
        }
        if (n >= min) {
          drawLine(n);
          drawLabel(n);
        }
      }
    };

    // ---- Axes ----
    drawAxis([0, -yrange[0] * DEFAULT_SCALE, 0, -yrange[1] * DEFAULT_SCALE]); // Y axis
    drawAxis([xrange[0] * DEFAULT_SCALE, 0, xrange[1] * DEFAULT_SCALE, 0]); // X axis

    // ---- X direction grid ----
    generateAxisGrid(
      xrange[0],
      xrange[1],
      xrange[2],
      (x) =>
        drawGridLine([
          x * DEFAULT_SCALE,
          -yrange[0] * DEFAULT_SCALE,
          x * DEFAULT_SCALE,
          -yrange[1] * DEFAULT_SCALE,
        ]),
      drawXLabel,
    );

    // ---- Y direction grid ----
    generateAxisGrid(
      yrange[0],
      yrange[1],
      yrange[2],
      (y) =>
        drawGridLine([
          xrange[0] * DEFAULT_SCALE,
          -y * DEFAULT_SCALE,
          xrange[1] * DEFAULT_SCALE,
          -y * DEFAULT_SCALE,
        ]),
      drawYLabel,
    );

    generateAxisGrid(xrange[0], xrange[1], xrange[2], drawXTick, () => {});

    generateAxisGrid(yrange[0], yrange[1], yrange[2], drawYTick, () => {});

    this.getLayer()?.batchDraw();
  }

  storeAsObj(): MobjectData {
    return {
      properties: this.features.getData(),
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.features.setData(obj.properties as PlaneProperties);
    this.features.refresh();
  }
}
