import Konva from "@/lib/konva";
import { AnimationManager } from "@/core/classes/managers/animationManager";
import { Mobject } from "../types/mobjects";
import { SceneData } from "../types/file";
import { SceneSerializer } from "./serializers/sceneSerializer";
import { MobjectManager } from "./managers/MobjectManager";
import { ConnectionManager } from "./managers/connectionManager";
import { TrackerManager } from "./managers/TrackerManager";
import { Colors } from "../utils/colors";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "../config";
import { TrackerAnimator } from "./managers/trackerAnimator";

/**
 * Main Scene class for the Animat animation system.
 *
 * Extends Konva.Stage to provide a canvas-based animation environment.
 * Manages multiple layers, Mobjects (mathematical objects), trackers, animations,
 * and connections between them.
 *
 * @extends Konva.Stage
 *
 * @example
 * ```typescript
 * const scene = new Scene({ container: 'canvas', width: 800, height: 600 });
 *
 * // Add a Mobject
 * const dot = scene.addMobject("Dot");
 *
 * // Create a tracker
 * const slider = scene.trackerManager.add("Slider");
 *
 * // Save scene
 * const data = scene.storeAsObj();
 * ```
 */
class Scene extends Konva.Stage {
  /* ---------------- Public ---------------- */
  private layer: Konva.Layer;
  private bglayer: Konva.Layer;
  private textlayer: Konva.Layer;
  private sliderLayer: Konva.Layer;
  private _activeMobject: Mobject | null = null;

  /**
   * Enable or disable edit mode for the scene.
   * When disabled, layers stop listening to events (useful during animation playback).
   *
   * @param value - true to enable editing, false to disable
   */
  set editMode(value: boolean) {
    if (value) {
      this.layer.listening(true);
      this.textlayer.listening(true);
    } else {
      this.layer.listening(false);
      this.textlayer.listening(false);
    }
  }
  get activeMobject(): Mobject | null {
    return this._activeMobject;
  }
  set activeMobject(value: Mobject | null) {
    this._activeMobject = value;
  }
  /* ---------------- Private ---------------- */
  animManager: AnimationManager;
  trackerManager: TrackerManager;
  trackerAnimator: TrackerAnimator;
  mobjManager: MobjectManager;
  connManager: ConnectionManager;

  constructor(config: Konva.StageConfig) {
    super(config);
    this.bglayer = new Konva.Layer();
    this.layer = new Konva.Layer();
    this.textlayer = new Konva.Layer();
    this.sliderLayer = new Konva.Layer();
    this.layer.position({
      x: DEFAULT_WIDTH / 2,
      y: DEFAULT_HEIGHT / 2,
    });
    this.textlayer.position({
      x: DEFAULT_WIDTH / 2,
      y: DEFAULT_HEIGHT / 2,
    });
    this.add(this.bglayer);
    this.add(this.layer);
    this.add(this.textlayer);
    this.add(this.sliderLayer);
    this.mobjManager = new MobjectManager(this.layer, this.textlayer);
    this.trackerManager = new TrackerManager(this.layer, this.sliderLayer);
    this.connManager = new ConnectionManager(
      this.trackerManager,
      this.mobjManager,
    );
    this.animManager = new AnimationManager();
    this.trackerAnimator = new TrackerAnimator(
      this.animManager,
      this.trackerManager,
      this.sliderLayer,
    );

    const bgrec = new Konva.Rect({
      x: 0,
      y: 0,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      fill: Colors.BG,
    });
    this.bglayer.add(bgrec);
  }

  addMobjectFunction(func: (mobj: Mobject) => void) {
    this.mobjManager.addMobjectFunction(func);
  }

  /**
   * Create and add a new Mobject to the scene.
   *
   * @param type - The type of Mobject to create (e.g., "Dot", "Circle", "Line")
   * @param id - Optional custom ID. If not provided, auto-generated as "{type}-{number}"
   * @returns The created Mobject instance
   *
   * @example
   * ```typescript
   * const dot = scene.addMobject("Dot");
   * const circle = scene.addMobject("Circle", "myCircle");
   * ```
   */
  addMobject(type: string, id?: string): Mobject {
    return this.mobjManager.addMobject(type, id);
  }

  /**
   * Remove a Mobject from the scene.
   * Also removes all associated animations.
   *
   * @param id - The ID of the Mobject to remove
   *
   * @example
   * ```typescript
   * scene.removeMobject("Dot-0");
   * ```
   */
  removeMobject(id: string) {
    this.mobjManager.removeMobject(id);
    this.animManager.removeAnimForMobject(id);
  }

  removeTracker(id: string) {
    this.trackerManager.remove(id);
    this.animManager.removeAnimForTracker(id);
  }

  getMobjectById(id: string): Mobject | null {
    return this.mobjManager.getMobjectById(id);
  }

  reset() {
    this.mobjManager.clear();
    this.animManager.clear();
    this.connManager.clear();
    this.trackerManager.clear();
    this.layer.destroyChildren();
  }

  /**
   * Serialize the entire scene to a JSON-compatible object.
   * Includes all Mobjects, trackers, animations, and connections.
   *
   * @returns Serialized scene data
   *
   * @example
   * ```typescript
   * const sceneData = scene.storeAsObj();
   * localStorage.setItem('myScene', JSON.stringify(sceneData));
   * ```
   */
  storeAsObj(): SceneData {
    this.animManager.resetAll();
    return SceneSerializer.serialize(this);
  }

  /**
   * Load a scene from serialized data.
   * Clears the current scene and recreates all objects from saved data.
   *
   * @param data - Serialized scene data (from storeAsObj)
   *
   * @example
   * ```typescript
   * const data = JSON.parse(localStorage.getItem('myScene'));
   * scene.loadFromObj(data);
   * ```
   */
  loadFromObj(data: SceneData) {
    this.reset();
    SceneSerializer.deserialize(data, this);
  }
}

export default Scene;
