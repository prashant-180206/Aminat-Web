import { AnimMeta, AnimStoreData } from "@/core/types/animation";

export class AnimationManager {
  private animations = new Map<string, AnimMeta>();
  animStore: AnimStoreData[][] = [];
  private order: string[][] = [];
  private _activeIndex = 0;
  public get activeIndex() {
    return this._activeIndex;
  }
  public set activeIndex(value) {
    this._activeIndex = value;
  }

  //  * Adds a group of animations that should play together

  addAnimations(...tweens: AnimMeta[]): string[] {
    const ids: string[] = [];

    const storeData: AnimStoreData[] = [];

    tweens.forEach((animData) => {
      this.animations.set(animData.id, animData);
      ids.push(animData.id);
      storeData.push({
        id: animData.id,
        targetId: animData.targetId,
        type: animData.type,
        category: animData.category,
        label: animData.label,
        animFuncInput: animData.animFuncInput,
      });
    });
    this.animStore.push(storeData);

    this.order.push(ids);
    return ids;
  }

  getAnimationFromId(id: string): AnimMeta | null {
    return this.animations.get(id) || null;
  }

  activeindex(): number {
    return this.activeIndex;
  }

  //  * Moves a whole animation group up or down in the playback order

  moveGroup(groupIndex: number, direction: "up" | "down") {
    if (groupIndex < 0 || groupIndex >= this.order.length) {
      return;
    }

    const targetIndex = direction === "up" ? groupIndex - 1 : groupIndex + 1;

    if (targetIndex < 0 || targetIndex >= this.order.length) {
      return;
    }

    // Swap groups
    [this.order[groupIndex], this.order[targetIndex]] = [
      this.order[targetIndex],
      this.order[groupIndex],
    ];
    [this.animStore[groupIndex], this.animStore[targetIndex]] = [
      this.animStore[targetIndex],
      this.animStore[groupIndex],
    ];

    // Keep active index aligned
    if (this.activeIndex === groupIndex) {
      this.activeIndex = targetIndex;
    } else if (this.activeIndex === targetIndex) {
      this.activeIndex = groupIndex;
    }
  }

  getOrder(): string[][] {
    return this.order.map((group) => [...group]);
  }

  // Returns groups with meta info for UI
  getGroupsWithMeta(): AnimMeta[][] {
    return this.order.map((group) =>
      group.map((id) => this.animations.get(id)!).filter(Boolean)
    );
  }

  animate() {
    if (this.order.length === 0) return;
    if (this.activeIndex >= this.order.length) {
      this.resetAll();
      this.activeIndex = 0;
    }
    const group = this.order[this.activeIndex];
    group.forEach((id) => {
      this.animations.get(id)?.anim.restart();
    });
    this.activeIndex = this.activeIndex + 1;
  }

  reverseAnimate() {
    if (this.order.length === 0) return;

    const group = this.order[this.activeIndex];

    if (this.activeIndex === 0) {
      // Completed a full reverse cycle, reset all animations
      this.finishAll();
    }

    // THEN REVERSE
    group.forEach((id) => {
      this.animations.get(id)?.anim.reverse();
    });
    this.activeIndex =
      (this.activeIndex - 1 + this.order.length) % this.order.length;
  }

  removeAnimation(id: string) {
    const animData = this.animations.get(id);
    if (!animData) return;

    animData.anim.revert();
    this.animations.delete(id);

    this.order = this.order
      .map((group) => group.filter((animId) => animId !== id))
      .filter((group) => group.length > 0);
    this.animStore = this.animStore
      .map((group) => group.filter((anim) => anim.id !== id))
      .filter((group) => group.length > 0);

    if (this.activeIndex >= this.order.length) {
      this.activeIndex = 0;
    }
  }

  removeAnimForMobject(targetId: string) {
    const idsToRemove: string[] = [];
    this.animations.forEach((animData, id) => {
      if (animData.targetId === targetId) {
        idsToRemove.push(id);
      }
    });
    for (const id of idsToRemove) {
      this.removeAnimation(id);
    }
  }

  removeAnimForTracker(targetId: string) {
    const idsToRemove: string[] = [];
    this.animations.forEach((animData, id) => {
      if (animData.targetId === targetId) {
        idsToRemove.push(id);
      }
    });
    for (const id of idsToRemove) {
      this.removeAnimation(id);
    }
  }

  resetAll() {
    for (let g = this.order.length - 1; g >= 0; g--) {
      const group = this.order[g];

      for (let i = group.length - 1; i >= 0; i--) {
        const id = group[i];
        const animData = this.animations.get(id);

        if (animData?.anim) {
          const tween = animData.anim;
          tween.pause();
          tween.seek(1);
          tween.reset();
        }
      }
    }

    this.activeIndex = 0;
  }

  finishAll() {
    for (let g = this.order.length - 1; g >= 0; g--) {
      const group = this.order[g];

      // REVERSE within group too
      for (let i = group.length - 1; i >= 0; i--) {
        const id = group[i];
        const animData = this.animations.get(id);
        const tween = animData?.anim;

        if (tween) {
          // tween.finish(); // Jump to END state (scale=1, opacity=1 for Create)
          tween.complete(); // Jump to END state (scale=1, opacity=1 for Create)
        }
      }
    }
  }

  clear() {
    this.animations.forEach((a) => {
      a.anim.cancel();
      a.anim.revert();
    });
    this.animations.clear();
    this.animStore = [];
    this.order = [];
    this._activeIndex = 0;
  }
}
