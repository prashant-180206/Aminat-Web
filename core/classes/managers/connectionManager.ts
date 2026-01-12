import { PtValFuncRelations, ValFuncRelations } from "../../types/file";
import { TrackerMobjectConnectorFactory } from "../factories/TrackMobjConn";
import { MobjectManager } from "./MobjectManager";
import { TrackerManager } from "./TrackerManager";

export class ConnectionManager {
  private mobjectManager: MobjectManager;
  private trackerManager: TrackerManager;

  constructor(tm: TrackerManager, mobj: MobjectManager) {
    this.trackerManager = tm;
    this.mobjectManager = mobj;
  }
  private _valFuncRelations: ValFuncRelations[] = [];
  public get valFuncRelations(): ValFuncRelations[] {
    return this._valFuncRelations;
  }
  public set valFuncRelations(value: ValFuncRelations[]) {
    this._valFuncRelations = value;
  }
  private _ptValFuncRelations: PtValFuncRelations[] = [];
  public get ptValFuncRelations(): PtValFuncRelations[] {
    return this._ptValFuncRelations;
  }
  public set ptValFuncRelations(value: PtValFuncRelations[]) {
    this._ptValFuncRelations = value;
  }

  ConnectValueTrackerToMobject(
    trackerName: string,
    mobjectId: string,
    functionName: string,
    expression: string
  ) {
    const mobject = this.mobjectManager.getMobjectById(mobjectId);
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
    const mobject = this.mobjectManager.getMobjectById(mobjectId);
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
    const mobject = this.mobjectManager.getMobjectById(mobjectId);
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

  clear() {
    this._ptValFuncRelations = [];
    this._valFuncRelations = [];
  }
}
