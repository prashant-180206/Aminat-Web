// core/scene.ts
// /* eslint-disable @typescript-eslint/no-explicit-any */

import Konva from "@/lib/konva";
import MobjectMap from "../maps/MobjectMap";

import { AnimationManager } from "./animation/animationManager";
// import { getAnim } from "./animation/animations";
import { TrackerManager } from "./Tracker/helpers/TrackerManager";
// import { ValueTracker } from "./Tracker/valuetracker";
// import { AnimInfo } from "../types/animation";
import { Mobject } from "../types/mobjects";
import { SceneData, ValFuncRelations, PtValFuncRelations } from "../types/file";
// import { MobjectData } from "../types/file";

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
    const mobject = MobjectMap[type].func();

    mobject.id(id || `${mobject.name() || "mobject"}-${this.totalObjects++}`);
    mobject.setDraggable(true);
    this.layer.add(mobject as Konva.Shape);
    mobject.properties = { zindex: this.totalObjects - 1 };
    this.mobjectsMeta.push({ id: mobject.id(), type: mobject.type(), mobject });
    mobject.on("click", () => {
      this.activeMobject = mobject;
      mobject.UpdateFromKonvaProperties();
    });
    mobject.on("dragend", () => {
      mobject.UpdateFromKonvaProperties();
    });

    this.layer.draw();
    if (this.mobjectAddCallback) {
      this.mobjectAddCallback(mobject);
    }

    return mobject;
  }

  removeMobject(id: string) {
    this.mobjectsMeta = this.mobjectsMeta.filter((meta) => meta.id !== id);
    this.layer.findOne(`#${id}`)?.destroy();

    // cleanup bindings
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
  ): { success: boolean; id: string | null } {
    const mobject = this.getMobjectById(mobjectId);
    const tracker = this.trackerManager.getTracker(trackerName);
    if (!mobject || !tracker) return { success: false, id: null };
    const func = mobject.trackerconnector.getConnectorFunc(functionName);
    if (!func) return { success: false, id: null };

    this.valFuncRelations.push({
      trackerName,
      mobjectId,
      functionName,
      expression,
    });

    return {
      success: tracker.addUpdater(
        `${mobject.id()}-${functionName}`,
        func,
        expression
      ),
      id: `${mobject.id()}-${functionName}`,
    };
  }

  ConnectPtValueTrackerToMobject(
    trackerName: string,
    mobjectId: string,
    functionNameX: string,
    functionNameY: string,
    expressionX: string,
    expressionY: string
  ): boolean {
    const mobject = this.getMobjectById(mobjectId);
    const tracker = this.trackerManager.getPtValueTracker(trackerName);
    if (!mobject || !tracker) return false;
    const funcX = mobject.trackerconnector.getConnectorFunc(functionNameX);
    const funcY = mobject.trackerconnector.getConnectorFunc(functionNameY);
    if (!funcX || !funcY) return false;

    this.ptValFuncRelations.push({
      trackerName,
      mobjectId,
      functionNameX,
      functionNameY,
      expressionX,
      expressionY,
    });

    const xSuccess = tracker.x.addUpdater(
      `${mobject.id()}-${functionNameX}-X`,
      funcX,
      expressionX
    );
    const ySuccess = tracker.y.addUpdater(
      `${mobject.id()}-${functionNameY}-Y`,
      funcY,
      expressionY
    );

    return xSuccess && ySuccess;
  }
  ConnectYPtValueTrackerToMobject(
    trackerName: string,
    mobjectId: string,
    functionNameY: string,
    expressionY: string
  ): boolean {
    const mobject = this.getMobjectById(mobjectId);
    const tracker = this.trackerManager.getPtValueTracker(trackerName);
    if (!mobject || !tracker) return false;
    const funcY = mobject.trackerconnector.getConnectorFunc(functionNameY);
    if (!funcY) return false;

    this.ptValFuncRelations.push({
      trackerName,
      mobjectId,
      functionNameY,
      expressionY,
    });
    const ySuccess = tracker.y.addUpdater(
      `${mobject.id()}-${functionNameY}-Y`,
      funcY,
      expressionY
    );

    return ySuccess;
  }

  ConnectXPtValueTrackerToMobject(
    trackerName: string,
    mobjectId: string,
    functionNameX: string,
    expressionX: string
  ): boolean {
    const mobject = this.getMobjectById(mobjectId);
    const tracker = this.trackerManager.getPtValueTracker(trackerName);
    if (!mobject || !tracker) return false;
    const funcX = mobject.trackerconnector.getConnectorFunc(functionNameX);
    // const funcY = mobject.trackerconnector.getConnectorFunc(functionNameY);
    if (!funcX) return false;

    this.ptValFuncRelations.push({
      trackerName,
      mobjectId,
      functionNameX,
      expressionX,
    });

    const xSuccess = tracker.x.addUpdater(
      `${mobject.id()}-${functionNameX}-X`,
      funcX,
      expressionX
    );

    return xSuccess;
  }

  storeAsObj(): SceneData {
    const mobjectsData: SceneData = {
      mobjects: [],
      animationsData: { animations: [], order: [] },
      trackerManagerData: this.trackerManager.storeAsObj(),
      valFuncRelations: this.valFuncRelations,
      ptValFuncRelations: this.ptValFuncRelations,
    };

    this.mobjectsMeta.forEach((meta) => {
      mobjectsData.mobjects.push({
        type: meta.type,
        mobject: meta.mobject.storeAsObj(),
      });
    });

    mobjectsData.animationsData = this.animManager.storeAsObj();
    return mobjectsData;
  }

  loadFromObj(obj: SceneData) {
    obj.mobjects.forEach((mobj) => {
      const mobject = this.addMobject(mobj.type, mobj.mobject.id);
      mobject.loadFromObj(mobj.mobject);
    });

    this.trackerManager.loadFromObj(obj.trackerManagerData);
    obj.valFuncRelations.forEach((rel) => {
      this.ConnectValueTrackerToMobject(
        rel.trackerName,
        rel.mobjectId,
        rel.functionName,
        rel.expression
      );
    });

    obj.ptValFuncRelations?.forEach((rel) => {
      if (rel.functionNameX && rel.expressionX) {
        this.ConnectXPtValueTrackerToMobject(
          rel.trackerName,
          rel.mobjectId,
          rel.functionNameX,
          rel.expressionX
        );
      }
      if (rel.functionNameY && rel.expressionY) {
        this.ConnectYPtValueTrackerToMobject(
          rel.trackerName,
          rel.mobjectId,
          rel.functionNameY,
          rel.expressionY
        );
      }
    });

    this.animManager.loadFromObj(obj.animationsData);
  }
}

export default Scene;
