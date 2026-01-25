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
    expression: string,
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
        connectionId: result.updaterId as string,
        trackerName,
        targetId: mobjectId,
        functionName,
        expression,
      });
    }

    return {
      success: result.success,
      id: result.updaterId,
    };
  }

  removeValueTrackerConnection(connectionId: string) {
    const relations = this.valFuncRelations.find(
      (rel) => rel.connectionId === connectionId,
    );
    if (!relations) return;
    this.trackerManager
      .getTracker(relations.trackerName)
      ?.tracker.removeUpdater(connectionId);

    this.valFuncRelations = this.valFuncRelations.filter(
      (rel) => rel.connectionId !== connectionId,
    );
  }

  removeYPtValueTrackerConnection(connectionId: string) {
    const relations = this.ptValFuncRelations.find(
      (rel) => rel.connectionId === connectionId,
    );
    if (!relations) return;
    this.trackerManager
      .getPtValueTracker(relations.trackerName)
      ?.tracker.y.removeUpdater(connectionId);

    this.ptValFuncRelations = this.ptValFuncRelations.filter(
      (rel) => rel.connectionId !== connectionId,
    );
  }
  removeXPtValueTrackerConnection(connectionId: string) {
    const relations = this.ptValFuncRelations.find(
      (rel) => rel.connectionId === connectionId,
    );
    if (!relations) return;
    this.trackerManager
      .getPtValueTracker(relations.trackerName)
      ?.tracker.x.removeUpdater(connectionId);
    this.ptValFuncRelations = this.ptValFuncRelations.filter(
      (rel) => rel.connectionId !== connectionId,
    );
  }
  ConnectYPtValueTrackerToMobject(
    trackerName: string,
    mobjectId: string,
    functionNameY: string,
    expressionY: string,
  ): { success: boolean; updaterId: string | null } {
    const mobject = this.mobjectManager.getMobjectById(mobjectId);
    if (!mobject) return { success: false, updaterId: null };

    const result = TrackerMobjectConnectorFactory.connectY({
      trackerManager: this.trackerManager,
      trackerName,
      mobject,
      functionNameY,
      expressionY,
    });

    if (result.success) {
      this.ptValFuncRelations.push({
        connectionId: result.updaterId as string,
        trackerName,
        targetId: mobjectId,
        functionNameY,
        expressionY,
      });
    }

    return result;
  }

  ConnectXPtValueTrackerToMobject(
    trackerName: string,
    mobjectId: string,
    functionNameX: string,
    expressionX: string,
  ): { success: boolean; updaterId: string | null } {
    const mobject = this.mobjectManager.getMobjectById(mobjectId);
    if (!mobject) return { success: false, updaterId: null };

    const result = TrackerMobjectConnectorFactory.connectX({
      trackerManager: this.trackerManager,
      trackerName,
      mobject,
      functionNameX,
      expressionX,
    });

    if (result.success) {
      this.ptValFuncRelations.push({
        connectionId: result.updaterId as string,
        trackerName,
        targetId: mobjectId,
        functionNameX,
        expressionX,
      });
    }

    return result;
  }

  clear() {
    this._ptValFuncRelations = [];
    this._valFuncRelations = [];
  }
}
