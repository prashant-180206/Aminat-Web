import { AnimInfo } from "@/core/types/animation";
import { AnimManagerData } from "@/core/types/file";

export class AnimationManager {
  private _animations = new Map<string, AnimInfo>();
  public get animations() {
    return this._animations;
  }
  public set animations(value) {
    this._animations = value;
  }
  private order: string[][] = [];
  private _activeIndex = 0;
  public get activeIndex() {
    return this._activeIndex;
  }
  public set activeIndex(value) {
    this._activeIndex = value;
  }

  //  * Adds a group of animations that should play together

  addAnimations(...tweens: AnimInfo[]): string[] {
    const ids: string[] = [];

    tweens.forEach((animData) => {
      this.animations.set(animData.id, animData);
      ids.push(animData.id);
    });

    this.order.push(ids);
    return ids;
  }

  getAnimationFromId(id: string): AnimInfo | null {
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
  getGroupsWithMeta(): AnimInfo[][] {
    return this.order.map((group) =>
      group.map((id) => this.animations.get(id)!).filter(Boolean)
    );
  }

  animate() {
    if (this.order.length === 0) return;

    const group = this.order[this.activeIndex];

    this.activeIndex = (this.activeIndex + 1) % this.order.length;

    group.forEach((id) => {
      this.animations.get(id)?.anim.play();
    });
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
    if (!animData) {
      console.warn(`Animation with id ${id} not found`);
      return;
    }
    console.log("Removing animation:", id);

    animData.anim.destroy();
    this.animations.delete(id);
    // this.metas.delete(id);

    this.order = this.order
      .map((group) => group.filter((animId) => animId !== id))
      .filter((group) => group.length > 0);

    if (this.activeIndex >= this.order.length) {
      this.activeIndex = 0;
    }
  }

  resetAll() {
    // 1. REVERSE order of groups
    for (let g = this.order.length - 1; g >= 0; g--) {
      const group = this.order[g];

      // 2. REVERSE order within the group
      for (let i = group.length - 1; i >= 0; i--) {
        const id = group[i];
        const animData = this.animations.get(id);

        if (animData?.anim) {
          // IMPORTANT: Stop the engine from calculating new frames
          // This prevents the "fighting" you are seeing.
          animData.anim.pause();

          // Now reset the properties safely
          animData.anim.reset();
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
          tween.finish(); // Jump to END state (scale=1, opacity=1 for Create)
        }
      }
    }
  }

  storeAsObj(): AnimManagerData {
    const animationsArray: AnimInfo[] = [];
    this.animations.forEach((anim) => {
      animationsArray.push(anim);
    });
    return {
      animations: animationsArray,
      order: this.order.map((group) => [...group]),
    };
  }

  loadFromObj(obj: AnimManagerData) {
    // Clear existing animations and state
    this.animations.forEach((anim) => {
      anim.anim.destroy();
    });
    this.animations.clear();
    this.order = [];
    this.activeIndex = 0;

    // Load animations from saved data
    obj.animations.forEach((anim) => {
      this.animations.set(anim.id, anim);
    });
    this.order = obj.order.map((group) => [...group]);
  }
}
