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

class Scene extends Konva.Stage {
  /* ---------------- Public ---------------- */
  private layer: Konva.Layer;
  private textlayer: Konva.Layer;
  private sliderLayer: Konva.Layer;
  private _activeMobject: Mobject | null = null;

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
      x: -DEFAULT_WIDTH / 2,
      y: -DEFAULT_HEIGHT / 2,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      fill: Colors.BG,
    });
    this.layer.add(bgrec);
  }

  addMobjectFunction(func: (mobj: Mobject) => void) {
    this.mobjManager.addMobjectFunction(func);
  }

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
