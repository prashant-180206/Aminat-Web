import { SceneData } from "@/core/types/file";
import Scene from "../scene";
import { AnimMeta } from "@/core/types/animation";
// import { TrackerAnimatorfuncs } from "@/core/utils/valAnimation";

export class SceneSerializer {
  static serialize(scene: Scene): SceneData {
    const data: SceneData = {
      mobjects: [],
      animationsData: { animations: [] },
      trackerManagerData: scene.trackerManager.storeAsObj(),
      valFuncRelations: scene.connManager.valFuncRelations,
      ptValFuncRelations: scene.connManager.ptValFuncRelations,
    };
    scene.mobjManager.mobjectsMeta.forEach((meta) => {
      data.mobjects.push({
        type: meta.type,
        mobject: meta.mobject.storeAsObj(),
      });
    });

    data.animationsData.animations = scene.animManager.animStore;
    return data;
  }

  static deserialize(data: SceneData, scene: Scene) {
    data.mobjects.forEach((entry) => {
      const mobject = scene.addMobject(entry.type, entry.mobject.id);
      mobject.loadFromObj(entry.mobject);
    });

    /* ---------------- trackers ---------------- */

    scene.trackerManager.loadFromObj(data.trackerManagerData);

    data.valFuncRelations.forEach((rel) => {
      scene.connManager.ConnectValueTrackerToMobject(
        rel.trackerName,
        rel.mobjectId,
        rel.functionName,
        rel.expression
      );
    });

    data.ptValFuncRelations?.forEach((rel) => {
      if (rel.functionNameX && rel.expressionX) {
        scene.connManager.ConnectXPtValueTrackerToMobject(
          rel.trackerName,
          rel.mobjectId,
          rel.functionNameX,
          rel.expressionX
        );
      }
      if (rel.functionNameY && rel.expressionY) {
        scene.connManager.ConnectYPtValueTrackerToMobject(
          rel.trackerName,
          rel.mobjectId,
          rel.functionNameY,
          rel.expressionY
        );
      }
    });

    /* ---------------- animations ---------------- */
    const animStoreData = data.animationsData.animations;

    animStoreData.forEach((group) => {
      // --- Non-mobject single animations ---
      if (group.length === 1) {
        const a = group[0];
        if (a.category !== "Mobject") {
          const i = a.animFuncInput;

          const trackerHandlers: Record<string, () => void> = {
            Tracker: () =>
              scene.trackerAnimator.animateTracker(
                a.targetId,
                i.target as number,
                i.duration as number,
                i.easing as string
              ),

            PtTracker: () =>
              scene.trackerAnimator.animatePtTracker(
                a.targetId,
                { x: i.targetX as number, y: i.targetY as number },
                i.duration as number,
                i.easing as string
              ),

            Slider: () => {
              if (a.type === "SliderAppear") {
                scene.trackerAnimator.addSliderAppearAnimation(a.targetId, {
                  min: i.min as number,
                  max: i.max as number,
                  rank: i.rank as number,
                });
              }
              if (a.type === "SliderDisappear") {
                scene.trackerAnimator.addSliderDisappearAnimation(a.targetId);
              }
            },

            PtSlider: () => {
              if (a.type === "PtSliderAppear") {
                scene.trackerAnimator.addPtSliderAppearAnimation(a.targetId, {
                  minX: i.minX as number,
                  maxX: i.maxX as number,
                  minY: i.minY as number,
                  maxY: i.maxY as number,
                  rank: i.rank as number,
                });
              }
              if (a.type === "PtSliderDisappear") {
                scene.trackerAnimator.addPtSliderDisappearAnimation(a.targetId);
              }
            },
          };

          trackerHandlers[a.category]?.();
        }
      }

      // --- Mobject animations ---
      const animMetaGrp: AnimMeta[] = [];

      group.forEach((a) => {
        const mobject = scene.getMobjectById(a.targetId);
        if (!mobject) return;

        const meta = mobject.animgetter.getAnimMeta(a.type);
        if (!meta) return;

        const anim = meta.func(a.animFuncInput);
        if (!anim) return;

        animMetaGrp.push(anim);
      });

      scene.animManager.addAnimations(...animMetaGrp);
    });
  }
}
