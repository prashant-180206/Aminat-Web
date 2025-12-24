import { AnimInfo } from "@/core/types/animation";

export class AnimationManager {
  private animations = new Map<string, AnimInfo>();
  private order: string[][] = [];
  private activeIndex = 0;
  private counter = 0;

  //  * Adds a group of animations that should play together

  addAnimations(...tweens: AnimInfo[]): string[] {
    const ids: string[] = [];

    tweens.forEach((animData) => {
      const id = `anim-${this.counter++}`;
      this.animations.set(id, animData);
      ids.push(id);
    });

    this.order.push(ids);
    return ids;
  }

  getAnimationFromId(id: string): AnimInfo | null {
    return this.animations.get(id) || null;
  }

  getInfo(id: string): AnimInfo | undefined {
    return this.animations.get(id);
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
    group.forEach((id) => {
      this.animations.get(id)?.anim?.play();
    });

    this.activeIndex = (this.activeIndex + 1) % this.order.length;
  }

  animateNext() {
    if (this.order.length === 0) return;

    this.activeIndex = (this.activeIndex + 1) % this.order.length;
    this.animate();
  }

  removeAnimation(id: string) {
    const animData = this.animations.get(id);
    if (!animData) return;

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
    this.activeIndex = 0;
    this.animations.forEach((animData) => animData.anim.reset());
  }
}
