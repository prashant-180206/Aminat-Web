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
  }

  getMobjectById(id: string): Mobject | null {
    return this.mobjManager.getMobjectById(id);
  }

  storeAsObj(): SceneData {
    return SceneSerializer.serialize(this);
  }

  loadFromObj(data: SceneData) {
    SceneSerializer.deserialize(data, this);
  }
}

export default Scene;
