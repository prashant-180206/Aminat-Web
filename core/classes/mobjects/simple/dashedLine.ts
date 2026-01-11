import { AnimGetter } from "@/core/classes/animation/animgetter";
import { c2p, p2c } from "@/core/utils/conversion";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { MobjectAnimAdder } from "../../factories/mobjects/addAnimations";
import { Colors } from "@/core/utils/colors";
import { DEFAULT_SCALE } from "@/core/config";
import { DashedLineProperties } from "@/core/types/properties";

export class MDashedLine extends Konva.Line {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _properties: DashedLineProperties;
  private _TYPE: string;

  constructor(TYPE: string, config: Partial<DashedLineProperties> = {}) {
    super({
      tension: 0,
      lineCap: "round",
      lineJoin: "round",
    });

    this.position({ x: 0, y: 0 });

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
      dashRatio: 10,
      ...config,
    };

    this.name("DashedLine");
    this.setupTrackerConnectors();
    MobjectAnimAdder.addLineAnimations(this);
    this.properties = this._properties;
  }

  /* ------------------------------------------------------- */
  /* Tracker Connectors                                     */
  /* ------------------------------------------------------- */

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
  /* Getters / Setters                                      */
  /* ------------------------------------------------------- */

  type(): string {
    return this._TYPE;
  }

  get properties(): DashedLineProperties {
    return { ...this._properties };
  }

  set properties(value: Partial<DashedLineProperties>) {
    Object.assign(this._properties, value);

    if (value.position) this.position(p2c(value.position.x, value.position.y));

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

      this.points([st.x, st.y, en.x, en.y]);
    }

    if (value.color) this.stroke(value.color);
    if (value.thickness) this.strokeWidth(value.thickness);
    if (value.scale) this.scale({ x: value.scale, y: value.scale });
    if (value.rotation) this.rotation(value.rotation);
    if (value.opacity) this.opacity(value.opacity);
    if (this.parent && value.zindex) this.zIndex(value.zindex);

    if (value.dashRatio !== undefined) {
      this.applyDash(this._properties.dashRatio);
    }
  }

  /* ------------------------------------------------------- */
  /* Dash Handling                                          */
  /* ------------------------------------------------------- */

  private applyDash(ratio: number) {
    const dash = Math.max(1, ratio);
    this.dash([dash, dash]);
  }

  /* ------------------------------------------------------- */
  /* Internal Sync Logic                                    */
  /* ------------------------------------------------------- */

  UpdateFromKonvaProperties() {
    const pos = this.position();
    this._properties.position = { x: pos.x, y: pos.y };

    const pts = this.points();
    const startLogical = c2p(pts[0], pts[1]);
    const endLogical = c2p(pts[2], pts[3]);

    const s = this._properties.scale;

    this._properties.lineEnds.start = {
      x: startLogical.x / s,
      y: startLogical.y / s,
    };

    this._properties.lineEnds.end = {
      x: endLogical.x / s,
      y: endLogical.y / s,
    };

    const dash = this.dash();
    if (dash && dash.length >= 2) {
      this._properties.dashRatio = dash[0];
    }
  }

  /* ------------------------------------------------------- */
  /* Serialization                                         */
  /* ------------------------------------------------------- */

  storeAsObj(): MobjectData {
    return {
      properties: this._properties,
      id: this.id(),
    } as MobjectData;
  }

  loadFromObj(obj: MobjectData) {
    this.properties = obj.properties as DashedLineProperties;
    this.UpdateFromKonvaProperties();
  }
}
