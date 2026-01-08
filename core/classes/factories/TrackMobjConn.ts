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
      args.functionName
    );
    if (!func) return { success: false, updaterId: null };

    const updaterId = `${args.mobject.id()}-${args.functionName}`;

    const success = tracker.tracker.addUpdater(
      updaterId,
      func,
      args.expression
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
  }): boolean {
    const tracker = args.trackerManager.getPtValueTracker(args.trackerName);
    if (!tracker) return false;

    const funcX = args.mobject.trackerconnector.getConnectorFunc(
      args.functionNameX
    );
    if (!funcX) return false;

    return tracker.tracker.x.addUpdater(
      `${args.mobject.id()}-${args.functionNameX}-X`,
      funcX,
      args.expressionX
    );
  }

  static connectY(args: {
    trackerManager: TrackerManager;
    trackerName: string;
    mobject: Mobject;
    functionNameY: string;
    expressionY: string;
  }): boolean {
    const tracker = args.trackerManager.getPtValueTracker(args.trackerName);
    if (!tracker) return false;

    const funcY = args.mobject.trackerconnector.getConnectorFunc(
      args.functionNameY
    );
    if (!funcY) return false;

    return tracker.tracker.y.addUpdater(
      `${args.mobject.id()}-${args.functionNameY}-Y`,
      funcY,
      args.expressionY
    );
  }
}
