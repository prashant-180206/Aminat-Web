// core/scene.ts
import Konva from "@/lib/konva";
import { AnimationManager } from "@/core/classes/animation/animationManager";
import { TrackerManager } from "./Tracker/helpers/TrackerManager";
import { Mobject } from "../types/mobjects";
import { SceneData, ValFuncRelations, PtValFuncRelations } from "../types/file";
import { TrackerMobjectConnectorFactory } from "./factories/tracker/TrackMobjConn";
import { SceneSerializer } from "./factories/scene/sceneSerializer";
import { MobjectFactory } from "./factories/scene/Mobjectfactory";

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

  private totalObjects = 0;
  private valFuncRelations: ValFuncRelations[] = [];
  private ptValFuncRelations: PtValFuncRelations[] = [];
  private mobjectAddCallback: ((mobj: Mobject) => void) | null = null;
  private mobjectsMeta: {
    id: string;
    type: string;
    mobject: Mobject;
  }[] = [];
  animManager = new AnimationManager();
  trackerManager: TrackerManager;

  constructor(config: Konva.StageConfig) {
    super(config);
    this.layer = new Konva.Layer();
    this.add(this.layer);
    this.trackerManager = new TrackerManager(this.layer);
  }

  addMobjectFunction(func: (mobj: Mobject) => void) {
    this.mobjectAddCallback = func;
  }

  /* ============================================================ */
  /* MOBJECT LIFECYCLE                                            */
  /* ============================================================ */

  addMobject(type: string, id?: string): Mobject {
    const mobject = MobjectFactory.create(type, this.layer, {
      id,
      zIndex: this.totalObjects++,
      // onSelect: this.mobjectAddCallback,
    });
    this.mobjectAddCallback?.(mobject);
    this.mobjectsMeta.push({ id: mobject.id(), type, mobject });
    return mobject;
  }

  removeMobject(id: string) {
    this.mobjectsMeta = this.mobjectsMeta.filter((meta) => meta.id !== id);
    this.layer.findOne(`#${id}`)?.destroy();
  }

  getMobjectById(id: string): Mobject | null {
    return this.layer.findOne(`#${id}`) as Mobject | null;
  }

  getMobjectsData(): { id: string; type: string }[] {
    return this.mobjectsMeta.map((meta) => ({
      id: meta.id,
      type: meta.type,
    }));
  }

  ConnectValueTrackerToMobject(
    trackerName: string,
    mobjectId: string,
    functionName: string,
    expression: string
  ) {
    const mobject = this.getMobjectById(mobjectId);
    if (!mobject) return { success: false, id: null };

    const result = TrackerMobjectConnectorFactory.connectValueTracker({
      trackerManager: this.trackerManager,
      trackerName,
      mobject,
      functionName,
      expression,
    });

    if (result.success) {
      this.valFuncRelations.push({
        trackerName,
        mobjectId,
        functionName,
        expression,
      });
    }

    return {
      success: result.success,
      id: result.updaterId,
    };
  }

  ConnectYPtValueTrackerToMobject(
    trackerName: string,
    mobjectId: string,
    functionNameY: string,
    expressionY: string
  ): boolean {
    const mobject = this.getMobjectById(mobjectId);
    if (!mobject) return false;

    const success = TrackerMobjectConnectorFactory.connectY({
      trackerManager: this.trackerManager,
      trackerName,
      mobject,
      functionNameY,
      expressionY,
    });

    if (success) {
      this.ptValFuncRelations.push({
        trackerName,
        mobjectId,
        functionNameY,
        expressionY,
      });
    }

    return success;
  }

  ConnectXPtValueTrackerToMobject(
    trackerName: string,
    mobjectId: string,
    functionNameX: string,
    expressionX: string
  ): boolean {
    const mobject = this.getMobjectById(mobjectId);
    if (!mobject) return false;

    const success = TrackerMobjectConnectorFactory.connectX({
      trackerManager: this.trackerManager,
      trackerName,
      mobject,
      functionNameX,
      expressionX,
    });

    if (success) {
      this.ptValFuncRelations.push({
        trackerName,
        mobjectId,
        functionNameX,
        expressionX,
      });
    }

    return success;
  }

  storeAsObj(): SceneData {
    return SceneSerializer.serialize(this);
  }

  loadFromObj(obj: SceneData) {
    SceneSerializer.hydrate(this, obj);
  }
}

export default Scene;
