import { AnimGetter } from "@/core/classes/animation/animgetter";
import { Konva } from "@/lib/konva";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { MobjectAnimAdder } from "../../factories/mobjects/addAnimations";
import { DotProperties, DotProperty } from "../../controllers/simple/dot";

/**
 * Dot Mobject - A circular point with optional label.
 *
 * Represents a point/dot on the canvas, commonly used for:
 * - Marking coordinates
 * - Showing points on graphs
 * - Animating position values
 * - Interactive demonstrations
 *
 * @extends Konva.Group
 *
 * @example
 * ```typescript
 * const dot = new Dot("Dot");
 * dot.features.update({
 *   position: { x: 5, y: 3 },
 *   radius: 15,
 *   color: "#ff0000",
 *   label: { labelText: "Point A" }
 * });
 * ```
 */
export class Dot extends Konva.Group {
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;

  public circle: Konva.Circle;
  public label: Konva.Text;
  public features: DotProperty;
  private _TYPE: string;

  constructor(TYPE: string) {
    super({
      lineCap: "round",
      lineJoin: "round",
    });

    this._TYPE = TYPE;
    this.animgetter = new AnimGetter(this);
    this.trackerconnector = new TrackerConnector(this);
    this.circle = new Konva.Circle();

    this.add(this.circle);

    this.label = new Konva.Text();

    this.add(this.label);
    this.features = new DotProperty(this);
    this.name("Dot");

    MobjectAnimAdder.addLabelAnimations(this);
    // this.className = "haveLabel";
  }

  type(): string {
    return this._TYPE;
  }

  /**
   * Get all properties as an object.
   *
   * @returns Object containing all property values (position, color, radius, label, etc.)
   */
  get properties(): DotProperties {
    return { ...this.features.getData() };
  }

  /**
   * Get React UI components for editing this Dot's properties.
   * Used by the property panel.
   *
   * @returns Array of UI components with names
   */
  getUIComponents() {
    return this.features.getUIComponents();
  }

  /**
   * Serialize this Dot to a JSON-compatible object.
   *
   * @returns Object containing properties and ID
   */
  storeAsObj() {
    return {
      properties: this.features.getData(),
      id: this.id(),
    } as MobjectData;
  }

  /**
   * Load this Dot's state from serialized data.
   *
   * @param obj - Serialized Mobject data
   */
  loadFromObj(obj: MobjectData) {
    this.features.setData(obj.properties as DotProperties);
    this.features.refresh();
  }
}
