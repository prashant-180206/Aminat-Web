import { AnimGetter } from "@/core/classes/animation/animgetter";
import { DEFAULT_HEIGHT, DEFAULT_SCALE, DEFAULT_WIDTH } from "@/core/config";
import { PlaneProperties } from "@/core/types/properties";
import { p2c } from "@/core/utils/conversion";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";

export class MPlane extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _properties: PlaneProperties;
  private _TYPE: string;

  private axisLayer = new Konva.Group();
  private gridLayer = new Konva.Group();
  private labelLayer = new Konva.Group();

  constructor(TYPE: string, config: Partial<PlaneProperties> = {}) {
    super({
      draggable: true, // enable drag
    });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    const xrange = DEFAULT_WIDTH / DEFAULT_SCALE / 2;
    const yrange = DEFAULT_HEIGHT / DEFAULT_SCALE / 2;

    this._properties = {
      position: { x: 0, y: 0 },
      color: "gray",
      scale: 1,
      rotation: 0,
      dimensions: {
        width: DEFAULT_WIDTH / DEFAULT_SCALE,
        height: DEFAULT_HEIGHT / DEFAULT_SCALE,
      },
      ranges: {
        xrange: [-xrange, xrange],
        yrange: [-yrange, yrange],
      },
      labelsize: 16,
      opacity: 1,
      zindex: 0,
      gridthickness: 1,
      showgrid: true,
      showlabels: true,
      labelcolor: "#555",
      axiscolor: "#000",
      axissthickness: 2,
      ...config,
    };

    this.add(this.gridLayer);
    this.add(this.axisLayer);
    this.add(this.labelLayer);

    this.updateFromProperties();
    this.name("Plane");
  }

  type(): string {
    return this._TYPE;
  }

  get properties(): PlaneProperties {
    return { ...this._properties };
  }

  set properties(newProps: Partial<PlaneProperties>) {
    Object.assign(this._properties, newProps);
    this.updateFromProperties();
  }

  private updateFromProperties() {
    const {
      position,
      scale,
      rotation,
      dimensions: { width, height },
      ranges: { xrange, yrange },
      gridthickness,
      showgrid,
      showlabels,
      labelcolor,
      axiscolor,
      color,
      axissthickness,
      labelsize,
      opacity,
      zindex,
    } = this._properties;

    const pwidth = width * DEFAULT_SCALE;
    const pheight = height * DEFAULT_SCALE;

    // group transform (dragging will change this position too)
    const p = p2c(position.x, position.y);
    this.position({
      x: p.x - pwidth / 2,
      y: p.y - pheight / 2,
    });
    this.scale({ x: scale, y: scale });
    this.rotation(rotation);
    this.opacity(opacity);
    if (this.parent) this.zIndex(zindex);

    this.gridLayer.removeChildren();
    this.axisLayer.removeChildren();
    this.labelLayer.removeChildren();

    const [xmin, xmax] = xrange;
    const [ymin, ymax] = yrange;
    const xspan = xmax - xmin;
    const yspan = ymax - ymin;

    const toCanvasX = (x: number) => ((x - xmin) / xspan) * pwidth;
    const toCanvasY = (y: number) => pheight - ((y - ymin) / yspan) * pheight;
    // axes
    if (xmin < 0 && xmax > 0) {
      const x0 = toCanvasX(0);
      this.axisLayer.add(
        new Konva.Line({
          points: [x0, 0, x0, pheight],
          stroke: axiscolor,
          strokeWidth: axissthickness,
        })
      );
    }

    if (ymin < 0 && ymax > 0) {
      const y0 = toCanvasY(0);
      this.axisLayer.add(
        new Konva.Line({
          points: [0, y0, pwidth, y0],
          stroke: axiscolor,
          strokeWidth: axissthickness,
        })
      );
    }

    // grid
    if (showgrid) {
      const xStart = Math.ceil(xmin);
      const xEnd = Math.floor(xmax);
      for (let x = xStart; x <= xEnd; x++) {
        if (x === 0) continue;
        const cx = toCanvasX(x);
        this.gridLayer.add(
          new Konva.Line({
            points: [cx, 0, cx, pheight],
            stroke: color,
            strokeWidth: gridthickness,
          })
        );
      }

      const yStart = Math.ceil(ymin);
      const yEnd = Math.floor(ymax);
      for (let y = yStart; y <= yEnd; y++) {
        if (y === 0) continue;
        const cy = toCanvasY(y);
        this.gridLayer.add(
          new Konva.Line({
            points: [0, cy, pwidth, cy],
            stroke: color,
            strokeWidth: gridthickness,
          })
        );
      }
    }

    // labels
    if (showlabels) {
      const fontSize = labelsize;

      const xStart = Math.ceil(xmin);
      const xEnd = Math.floor(xmax);
      for (let x = xStart; x <= xEnd; x++) {
        const cx = toCanvasX(x);
        const cy = toCanvasY(0);
        this.labelLayer.add(
          new Konva.Text({
            x: cx + 2,
            y: cy + 2,
            text: String(x),
            fontSize,
            fill: labelcolor,
          })
        );
      }

      const yStart = Math.ceil(ymin);
      const yEnd = Math.floor(ymax);
      for (let y = yStart; y <= yEnd; y++) {
        const cx = toCanvasX(0);
        const cy = toCanvasY(y);
        this.labelLayer.add(
          new Konva.Text({
            x: cx + 2,
            y: cy + 2,
            text: String(y),
            fontSize,
            fill: labelcolor,
          })
        );
      }
    }
  }

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = { x: pos.x, y: pos.y };
    this._properties.scale = this.scaleX();
    this._properties.rotation = this.rotation();
  }

  storeAsObj() {
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
