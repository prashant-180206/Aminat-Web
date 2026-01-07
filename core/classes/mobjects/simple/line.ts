import { AnimGetter } from "@/core/classes/animation/animgetter";
import { LineProperties } from "@/core/types/properties";
import { c2p, p2c } from "@/core/utils/conversion";
import Konva from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
// import { easingMap } from "@/core/maps/easingMap";

export class MLine extends Konva.Line {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  private _properties: LineProperties;
  private _TYPE: string;

  constructor(TYPE: string, config: Partial<LineProperties> = {}) {
    super({
      tension: 0,
      lineCap: "round",
      lineJoin: "round",
    });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);

    // Initialize default properties merged with provided config
    this._properties = {
      position: { x: 0, y: 0 },
      color: "red",
      scale: 1,
      rotation: 0,
      lineEnds: {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      },
      thickness: 3,
      opacity: 1,
      zindex: 0,
      ...config,
    };

    this.name("Line");
    this.setupTrackerConnectors();
    // this.setupAnimationFunctions();
    this.updateFromProperties();
  }

  /**
   * Registers property-specific update functions for external trackers.
   */
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

  /**
   * Defines standard animation behaviors available to this object.
   */
  // private setupAnimationFunctions() {
  //   this.animgetter.addAnimFunc("LineStart", {
  //     type: "PointChange",
  //     mobjId: this.id(),
  //     title: "Line Start",
  //     input: {
  //       X: "number",
  //       Y: "number",
  //       duration: "number",
  //       easing: "string",
  //     },
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     func: (args: { [key: string]: any }) => {
  //       const targetX = args.X ?? 0;
  //       const targetY = args.Y ?? 0;
  //       const canvasPoint = p2c(targetX, targetY);

  //       // Note: tween is created but not played here,
  //       // as per original logic which returns null.
  //       const tween = new Konva.Tween({
  //         node: this,
  //         duration: args.duration || 1,
  //         easing: easingMap[args.easing] || Konva.Easings.EaseInOut,
  //         points: [
  //           canvasPoint.x,
  //           canvasPoint.y,
  //           this.points()[2],
  //           this.points()[3],
  //         ],
  //         onFinish: () => {
  //           this.UpdateFromKonvaProperties();
  //         },
  //       });

  //       return {
  //         id: `${this.id()}-ls-${targetX}-${targetY}-${
  //           this.animgetter.getAnimNames().length
  //         }`,
  //         mobjId: this.id(),
  //         type: "PointChange",
  //         label: `Changing start of ${this.id()} to (${targetX}, ${targetY})`,
  //         tweenMeta: args,
  //         anim: tween,
  //       };
  //     },
  //   });
  //   this.animgetter.addAnimFunc("LineEnd", {
  //     type: "PointChange",
  //     mobjId: this.id(),
  //     title: "Line Start",
  //     input: {
  //       X: "number",
  //       Y: "number",
  //       duration: "number",
  //       easing: "string",
  //     },
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     func: (args: { [key: string]: any }) => {
  //       const targetX = args.X ?? 0;
  //       const targetY = args.Y ?? 0;
  //       const canvasPoint = p2c(targetX, targetY);

  //       // Note: tween is created but not played here,
  //       // as per original logic which returns null.
  //       const tween = new Konva.Tween({
  //         node: this,
  //         duration: args.duration || 1,
  //         easing: easingMap[args.easing] || Konva.Easings.EaseInOut,
  //         points: [
  //           this.points()[0],
  //           this.points()[1],
  //           canvasPoint.x,
  //           canvasPoint.y,
  //         ],
  //         onFinish: () => {
  //           this.UpdateFromKonvaProperties();
  //         },
  //       });

  //       return {
  //         id: `${this.id()}-le-${targetX}-${targetY}-${
  //           this.animgetter.getAnimNames().length
  //         }`,
  //         mobjId: this.id(),
  //         type: "PointChange",
  //         label: `Changing End of ${this.id()} to (${targetX}, ${targetY})`,
  //         tweenMeta: args,
  //         anim: tween,
  //       };
  //     },
  //   });
  // }

  /* ------------------------------------------------------- */
  /* Getters / Setters                                       */
  /* ------------------------------------------------------- */

  type(): string {
    return this._TYPE;
  }

  get properties(): LineProperties {
    return { ...this._properties };
  }

  set properties(newProps: Partial<LineProperties>) {
    Object.assign(this._properties, newProps);
    this.updateFromProperties();
  }

  /* ------------------------------------------------------- */
  /* Internal Sync Logic                                     */
  /* ------------------------------------------------------- */

  /**
   * Syncs Konva visual state to the internal _properties object.
   */
  private updateFromProperties() {
    const {
      position,
      color,
      scale,
      rotation,
      lineEnds: { start, end },
      thickness,
      opacity,
      zindex,
    } = this._properties;

    // Apply scale to logical points before converting to canvas pixels
    const st = p2c(start.x * scale, start.y * scale);
    const en = p2c(end.x * scale, end.y * scale);

    this.points([st.x, st.y, en.x, en.y]);
    this.stroke(color);
    this.strokeWidth(thickness * scale);
    this.position(position);
    this.rotation(rotation);
    this.opacity(opacity);

    if (this.parent) {
      this.zIndex(zindex);
    }
  }

  /**
   * Syncs internal _properties to match the current Konva visual state.
   */
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
