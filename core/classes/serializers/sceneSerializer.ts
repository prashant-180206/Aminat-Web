import { SceneData } from "@/core/types/file";
import Scene from "../scene";
import { AnimMeta } from "@/core/types/animation";
import { TrackerAnimator } from "@/core/utils/valAnimation";

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
      const animMetaGrp: AnimMeta[] = [];
      group.forEach((animMeta) => {
        if (animMeta.category === "Mobject") {
          const mobject = scene.getMobjectById(animMeta.targetId);
          if (!mobject) return;
          const animfuncmeta = mobject.animgetter.getAnimMeta(animMeta.type);
          if (!animfuncmeta) return;
          const anim = animfuncmeta.func(animMeta.animFuncInput);
          if (!anim) return;
          animMetaGrp.push(anim);
        }
        if (animMeta.category === "Tracker") {
          const tracker = scene.trackerManager.getTracker(animMeta.targetId);
          if (!tracker) return;
          const animfuncmeta = TrackerAnimator.getAnimationforTracker(
            tracker.tracker,
            animMeta.animFuncInput.target as number,
            animMeta.targetId,
            animMeta.animFuncInput.duration as number,
            animMeta.animFuncInput.easing as string
          );
          animMetaGrp.push(animfuncmeta);
        }
        if (animMeta.category === "PtTracker") {
          const pttracker = scene.trackerManager.getPtValueTracker(
            animMeta.targetId
          );
          if (!pttracker) return;
          const animfuncmeta = TrackerAnimator.getAnimationforPtTracker(
            pttracker.tracker,
            {
              x: animMeta.animFuncInput.targetX as number,
              y: animMeta.animFuncInput.targetY as number,
            },
            animMeta.targetId,
            animMeta.animFuncInput.duration as number,
            animMeta.animFuncInput.easing as string
          );
          animMetaGrp.push(animfuncmeta);
        }
        if (animMeta.category === "Slider") {
          // Slider animation loading to be implemented
          const tracker = scene.trackerManager.getTracker(animMeta.targetId);
          if (!tracker) return;
          let anim;
          if (animMeta.type === "SliderAppear") {
            anim = TrackerAnimator.getSliderAppearAnimation(
              scene.trackerManager,
              tracker.id,
              scene.layer,
              {
                min: animMeta.animFuncInput.min as number,
                max: animMeta.animFuncInput.max as number,
                rank: animMeta.animFuncInput.rank as number,
              }
            );
          } else if (animMeta.type === "SliderDisappear") {
            anim = TrackerAnimator.getSliderDisappearAnimation(tracker);
          }
          if (!anim || !anim.anim) return;

          animMetaGrp.push(anim.anim);
        }
        if (animMeta.category === "PtSlider") {
          const pttracker = scene.trackerManager.getPtValueTracker(
            animMeta.targetId
          );
          if (!pttracker) return;
          let anim;
          if (animMeta.type === "PtSliderAppear") {
            anim = TrackerAnimator.getPtSliderAppearAnimation(
              scene.trackerManager,
              pttracker.id,
              scene.layer,
              {
                x: {
                  min: animMeta.animFuncInput.minX as number,
                  max: animMeta.animFuncInput.maxX as number,
                },
                y: {
                  min: animMeta.animFuncInput.minY as number,
                  max: animMeta.animFuncInput.maxY as number,
                },
                rank: animMeta.animFuncInput.rank as number,
              }
            );
          } else if (animMeta.type === "PtSliderDisappear") {
            anim = TrackerAnimator.getPtSliderDisappearAnimation(pttracker);
          }
          if (!anim || !anim.anim) return;
          animMetaGrp.push(anim.anim);
        }
      });
      scene.animManager.addAnimations(...animMetaGrp);
    });
  }
}
