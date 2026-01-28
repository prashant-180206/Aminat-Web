import Konva from "@/lib/konva";
import { Mobject } from "../../types/mobjects";
import { MobjectFactory } from "../factories/Mobjectfactory";

/**
 * Manager for creating, tracking, and removing Mobjects in a scene.
 *
 * Responsibilities:
 * - Create Mobjects using MobjectFactory
 * - Maintain registry of all active Mobjects
 * - Provide access to Mobjects by ID
 * - Track currently selected/active Mobject
 * - Clean up Mobjects when removed
 *
 * @example
 * ```typescript
 * const manager = new MobjectManager(layer, textlayer);
 *
 * // Create Mobjects
 * const dot = manager.addMobject("Dot");
 * const circle = manager.addMobject("Circle", "myCircle");
 *
 * // Get Mobject
 * const mobject = manager.getMobjectById("Dot-0");
 *
 * // Remove Mobject
 * manager.removeMobject("Dot-0");
 * ```
 */
export class MobjectManager {
  private _activeMobject: Mobject | null = null;

  private totalObjects = 0;

  private layer: Konva.Layer;
  private textlayer: Konva.Layer;
  constructor(layer: Konva.Layer, textlayer: Konva.Layer) {
    this.layer = layer;
    this.textlayer = textlayer;
  }
  private _mobjectsMeta: {
    id: string;
    type: string;
    mobject: Mobject;
  }[] = [];
  public get mobjectsMeta(): {
    id: string;
    type: string;
    mobject: Mobject;
  }[] {
    return this._mobjectsMeta;
  }
  public set mobjectsMeta(
    value: {
      id: string;
      type: string;
      mobject: Mobject;
    }[],
  ) {
    this._mobjectsMeta = value;
  }
  get activeMobject(): Mobject | null {
    return this._activeMobject;
  }
  set activeMobject(value: Mobject | null) {
    this._activeMobject = value;
  }

  private mobjectAddCallback: ((mobj: Mobject) => void) | null = null;

  /**
   * Register a callback to be called whenever a Mobject is added.
   * Useful for setting up event listeners or other initialization.
   *
   * @param func - Callback function that receives the newly created Mobject
   */
  addMobjectFunction(func: (mobj: Mobject) => void) {
    this.mobjectAddCallback = func;
  }

  /**
   * Create and add a new Mobject to the scene.
   *
   * @param type - Type of Mobject to create (must exist in MobjectMap)
   * @param id - Optional custom ID. If not provided, auto-generated as "{type}-{number}"
   * @returns The created Mobject instance
   *
   * @example
   * ```typescript
   * const dot = manager.addMobject("Dot");
   * const namedCircle = manager.addMobject("Circle", "centerCircle");
   * ```
   */
  addMobject(type: string, id?: string): Mobject {
    const mobject = MobjectFactory.create(type, this.layer, this.textlayer!, {
      id,
      number: this.totalObjects++,
    });

    this.mobjectAddCallback?.(mobject);
    this.mobjectsMeta.push({ id: mobject.id(), type, mobject });
    return mobject;
  }

  /**
   * Remove a Mobject from the scene.
   * Removes from registry and destroys the Konva object.
   *
   * @param id - ID of the Mobject to remove
   */
  removeMobject(id: string) {
    this.mobjectsMeta = this.mobjectsMeta.filter((meta) => meta.id !== id);
    this.layer.findOne(`#${id}`)?.destroy();
    this.textlayer.findOne(`#${id}`)?.destroy();
  }

  /**
   * Get a Mobject by its ID.
   * Searches both main layer and text layer.
   *
   * @param id - ID of the Mobject to find
   * @returns The Mobject if found, null otherwise
   */
  getMobjectById(id: string): Mobject | null {
    let m = this.layer.findOne(`#${id}`) as Mobject | null;
    if (m) return m;
    m = this.textlayer.findOne(`#${id}`) as Mobject | null;
    return m;
  }

  clear() {
    this.mobjectsMeta.forEach((m) => {
      this.removeMobject(m.id);
    });
    this.mobjectsMeta = [];
  }
}
