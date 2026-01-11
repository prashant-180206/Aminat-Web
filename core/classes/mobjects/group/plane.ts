// anim/classes/mobjects/simple/plane.ts
import { AnimGetter } from "@/core/classes/animation/animgetter";
import { PlaneProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { Colors } from "@/core/utils/colors";
import { DEFAULT_HEIGHT, DEFAULT_SCALE, DEFAULT_WIDTH } from "@/core/config";

export class MPlane extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _TYPE: string;

  private _properties: PlaneProperties = {
    position: { x: 0, y: 0 },
    scale: 1,
    color: Colors.GRIDCOLOR,
    rotation: 0,
    zindex: 0,
    opacity: 1,
    dimensions: { width: 10, height: 10 },
    ranges: {
      xrange: [
        -DEFAULT_WIDTH / DEFAULT_SCALE / 2,
        DEFAULT_WIDTH / DEFAULT_SCALE / 2,
        1,
      ],
      yrange: [
        -DEFAULT_HEIGHT / DEFAULT_SCALE / 2,
        DEFAULT_HEIGHT / DEFAULT_SCALE / 2,
        1,
      ],
    },
    gridthickness: 4,
    axissthickness: 4,
    axiscolor: Colors.BORDER,
    showgrid: true,
    showlabels: true,
    labelsize: 36,
    labelcolor: Colors.TEXT,
  };

  // Sub-groups for organization
  private gridGroup: Konva.Group;
  private axesGroup: Konva.Group;
  private labelGroup: Konva.Group;
  private ticksGroup: Konva.Group;

  constructor(TYPE: string, config: Partial<PlaneProperties> = {}) {
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

    this.properties = { ...this._properties, ...config };
  }

  type(): string {
    return this._TYPE;
  }

  get properties(): PlaneProperties {
    return { ...this._properties };
  }

  set properties(value: Partial<PlaneProperties>) {
    Object.assign(this._properties, value);

    // Standard transformations
    if (value.position) this.position(p2c(value.position.x, value.position.y));
    if (value.scale) this.scale({ x: value.scale, y: value.scale });
    if (value.rotation) this.rotation(value.rotation);
    if (value.opacity) this.opacity(value.opacity);
    if (this.parent && value.zindex) this.zIndex(value.zindex);
    if (value.ranges) this.refreshPlane();

    if (value.color) {
      this.gridGroup.children.forEach((line) => {
        if (line instanceof Konva.Line) line.stroke(value.color!);
      });
    }

    if (value.axiscolor) {
      this.axesGroup.children.forEach((line) => {
        if (line instanceof Konva.Line) line.stroke(value.axiscolor!);
      });

      this.ticksGroup.children.forEach((line) => {
        if (line instanceof Konva.Line) line.stroke(value.axiscolor!);
      });
    }

    if (value.axissthickness) {
      this.axesGroup.children.forEach((line) => {
        if (line instanceof Konva.Line) line.strokeWidth(value.axissthickness!);
      });

      this.ticksGroup.children.forEach((line) => {
        if (line instanceof Konva.Line) line.strokeWidth(value.axissthickness!);
      });
    }

    if (value.labelcolor) {
      this.labelGroup.children.forEach((text) => {
        if (text instanceof Konva.Text) text.fill(value.labelcolor!);
      });
    }
    if (value.labelsize) {
      this.labelGroup.children.forEach((text) => {
        if (text instanceof Konva.Text) text.fontSize(value.labelsize!);
      });
    }
    if (value.gridthickness) {
      this.gridGroup.children.forEach((line) => {
        if (line instanceof Konva.Line) line.strokeWidth(value.gridthickness!);
      });
    }

    if (value.showgrid !== undefined) {
      this.gridGroup.visible(value.showgrid);
    }
    if (value.showlabels !== undefined) {
      this.labelGroup.visible(value.showlabels);
    }
  }

  private refreshPlane() {
    this.gridGroup.destroyChildren();
    this.axesGroup.destroyChildren();
    this.labelGroup.destroyChildren();
    this.ticksGroup.destroyChildren();

    const {
      ranges: { xrange, yrange },
      labelsize,
    } = this._properties;

    const drawAxis = (points: number[]) =>
      this.axesGroup.add(
        new Konva.Line({
          points,
          opacity: 1,
        })
      );

    const drawGridLine = (points: number[]) =>
      this.gridGroup.add(
        new Konva.Line({
          points,
          opacity: 0.4,
        })
      );

    const drawXLabel = (x: number) =>
      this.labelGroup.add(
        new Konva.Text({
          x: x * DEFAULT_SCALE,
          y: 5,
          text: x.toString().slice(0, 4),
          align: "center",
          offsetX: labelsize / 2,
        })
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
        })
      );

    const TICK_SIZE = 8;

    const drawXTick = (x: number) =>
      this.ticksGroup.add(
        new Konva.Line({
          points: [x * DEFAULT_SCALE, -TICK_SIZE, x * DEFAULT_SCALE, TICK_SIZE],
          stroke: this._properties.axiscolor,
          strokeWidth: this._properties.axissthickness,
          opacity: 1,
        })
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
          stroke: this._properties.axiscolor,
          strokeWidth: this._properties.axissthickness,
          opacity: 1,
        })
      );

    const generateAxisGrid = (
      min: number,
      max: number,
      step: number,
      drawLine: (v: number) => void,
      drawLabel: (v: number) => void
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
      drawXLabel
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
      drawYLabel
    );

    generateAxisGrid(xrange[0], xrange[1], xrange[2], drawXTick, () => {});

    generateAxisGrid(yrange[0], yrange[1], yrange[2], drawYTick, () => {});

    this.getLayer()?.batchDraw();
  }

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
    this.properties = obj.properties as PlaneProperties;
    this.UpdateFromKonvaProperties();
  }
}
