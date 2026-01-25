import { Mobject } from "@/core/types/mobjects";
import { TrackerManager } from "../managers/TrackerManager";
// import { TrackerManager } from "@/core/classes/Tracker/helpers/TrackerManager";
// import { TrackerManager } from "@/core/Tracker/helpers/TrackerManager";

export class TrackerMobjectConnectorFactory {
  /* -------------------------------------------------- */
  /* Single value tracker                               */
  /* -------------------------------------------------- */

  static connectValueTracker(args: {
    trackerManager: TrackerManager;
    trackerName: string;
    mobject: Mobject;
    functionName: string;
    expression: string;
  }): { success: boolean; updaterId: string | null } {
    const tracker = args.trackerManager.getTracker(args.trackerName);
    if (!tracker) return { success: false, updaterId: null };

    const func = args.mobject.trackerconnector.getConnectorFunc(
      args.functionName,
    );
    if (!func) return { success: false, updaterId: null };

    const updaterId = `${args.mobject.id()}-${args.functionName}`;

    const success = tracker.tracker.addUpdater(
      updaterId,
      func,
      args.expression,
    );

    return { success, updaterId: success ? updaterId : null };
  }

  /* -------------------------------------------------- */
  /* X only / Y only                                    */
  /* -------------------------------------------------- */

  static connectX(args: {
    trackerManager: TrackerManager;
    trackerName: string;
    mobject: Mobject;
    functionNameX: string;
    expressionX: string;
  }): { success: boolean; updaterId: string | null } {
    const tracker = args.trackerManager.getPtValueTracker(args.trackerName);
    if (!tracker) return { success: false, updaterId: null };

    const funcX = args.mobject.trackerconnector.getConnectorFunc(
      args.functionNameX,
    );
    if (!funcX) return { success: false, updaterId: null };

    const updaterId = `${args.mobject.id()}-${args.functionNameX}-X`;

    return {
      success: tracker.tracker.x.addUpdater(updaterId, funcX, args.expressionX),
      updaterId,
    };
  }

  static connectY(args: {
    trackerManager: TrackerManager;
    trackerName: string;
    mobject: Mobject;
    functionNameY: string;
    expressionY: string;
  }): { success: boolean; updaterId: string | null } {
    const tracker = args.trackerManager.getPtValueTracker(args.trackerName);
    if (!tracker) return { success: false, updaterId: null };

    const funcY = args.mobject.trackerconnector.getConnectorFunc(
      args.functionNameY,
    );
    if (!funcY) return { success: false, updaterId: null };

    const updaterId = `${args.mobject.id()}-${args.functionNameY}-Y`;

    return {
      success: tracker.tracker.y.addUpdater(updaterId, funcY, args.expressionY),
      updaterId,
    };
  }
}
