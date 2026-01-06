import { SceneData } from "@/core/types/file";
import Scene from "@/core/classes/scene";

export class SceneSerializer {
  /* -------------------------------------------------- */
  /* Serialize                                          */
  /* -------------------------------------------------- */

  static serialize(scene: Scene): SceneData {
    const data: SceneData = {
      mobjects: [],
      animationsData: { animations: [], order: [] },
      trackerManagerData: scene.trackerManager.storeAsObj(),
      valFuncRelations: scene["valFuncRelations"],
      ptValFuncRelations: scene["ptValFuncRelations"],
    };

    scene["mobjectsMeta"].forEach((meta) => {
      data.mobjects.push({
        type: meta.type,
        mobject: meta.mobject.storeAsObj(),
      });
    });

    data.animationsData = scene.animManager.storeAsObj();
    return data;
  }

  /* -------------------------------------------------- */
  /* Hydrate                                            */
  /* -------------------------------------------------- */

  static hydrate(scene: Scene, data: SceneData): void {
    /* ---------------- mobjects ---------------- */

    data.mobjects.forEach((entry) => {
      const mobject = scene.addMobject(entry.type, entry.mobject.id);
      mobject.loadFromObj(entry.mobject);
    });

    /* ---------------- trackers ---------------- */

    scene.trackerManager.loadFromObj(data.trackerManagerData);

    data.valFuncRelations.forEach((rel) => {
      scene.ConnectValueTrackerToMobject(
        rel.trackerName,
        rel.mobjectId,
        rel.functionName,
        rel.expression
      );
    });

    data.ptValFuncRelations?.forEach((rel) => {
      if (rel.functionNameX && rel.expressionX) {
        scene.ConnectXPtValueTrackerToMobject(
          rel.trackerName,
          rel.mobjectId,
          rel.functionNameX,
          rel.expressionX
        );
      }
      if (rel.functionNameY && rel.expressionY) {
        scene.ConnectYPtValueTrackerToMobject(
          rel.trackerName,
          rel.mobjectId,
          rel.functionNameY,
          rel.expressionY
        );
      }
    });

    /* ---------------- animations ---------------- */

    scene.animManager.loadFromObj(data.animationsData);
  }
}
