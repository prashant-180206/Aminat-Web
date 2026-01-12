// core/scene.ts
import Konva from "@/lib/konva";
import { AnimationManager } from "@/core/classes/managers/animationManager";
// import { TrackerManager } from "./Tracker/helpers/TrackerManager";
import { Mobject } from "../types/mobjects";
import { SceneData } from "../types/file";
import { SceneSerializer } from "./serializers/sceneSerializer";
import { MobjectManager } from "./managers/MobjectManager";
import { ConnectionManager } from "./managers/connectionManager";
import { TrackerManager } from "./managers/TrackerManager";
import { Colors } from "../utils/colors";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from "../config";

class Scene extends Konva.Stage {
  /* ---------------- Public ---------------- */

  layer: Konva.Layer;
  private _activeMobject: Mobject | null = null;
  get activeMobject(): Mobject | null {
    return this._activeMobject;
  }
  set activeMobject(value: Mobject | null) {
    this._activeMobject = value;
  }

  /* ---------------- Private ---------------- */
  animManager: AnimationManager;
  trackerManager: TrackerManager;
  mobjManager: MobjectManager;
  connManager: ConnectionManager;

  constructor(config: Konva.StageConfig) {
    super(config);
    this.layer = new Konva.Layer();
    this.add(this.layer);
    this.mobjManager = new MobjectManager(this.layer);
    this.trackerManager = new TrackerManager(this.layer);
    this.connManager = new ConnectionManager(
      this.trackerManager,
      this.mobjManager
    );
    this.animManager = new AnimationManager();

    const bgrec = new Konva.Rect({
      x: 0,
      y: 0,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      fill: Colors.BG,
    });
    this.layer.add(bgrec);
  }

  addMobjectFunction(func: (mobj: Mobject) => void) {
    this.mobjManager.addMobjectFunction(func);
  }

  /* ============================================================ */
  /* MOBJECT LIFECYCLE                                            */
  /* ============================================================ */

  addMobject(type: string, id?: string): Mobject {
    return this.mobjManager.addMobject(type, id);
  }

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

  storeAsObj(): SceneData {
    return SceneSerializer.serialize(this);
  }

  loadFromObj(data: SceneData) {
    this.reset();
    SceneSerializer.deserialize(data, this);
  }
}

export default Scene;
