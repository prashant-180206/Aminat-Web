import Konva from "@/lib/konva";

export type AnimationType = "create" | "destroy" | "move" | "scaleMove";

export type AnimationMeta = {
  id: string;
  targetId: string; // mobject id
  type: AnimationType;
  label?: string;
};

export class AnimationManager {
  private animations = new Map<string, Konva.Tween>();
  private order: string[][] = [];
  private activeIndex = 0;
  private counter = 0;
  private metas = new Map<string, AnimationMeta>();

  //  * Adds a group of animations that should play together

  addAnimations(...tweens: Konva.Tween[]): string[] {
    const ids: string[] = [];

    tweens.forEach((tween) => {
      const id = `anim-${this.counter++}`;
      this.animations.set(id, tween);
      ids.push(id);
    });

    this.order.push(ids);
    return ids;
  }

  // Add a single tween as its own group with meta
  addTweenAsGroup(tween: Konva.Tween, meta: Omit<AnimationMeta, "id">): string {
    const id = `anim-${this.counter++}`;
    this.animations.set(id, tween);
    this.metas.set(id, { ...meta, id });
    this.order.push([id]);
    return id;
  }

  getAnimationFromId(id: string): Konva.Tween | undefined {
    return this.animations.get(id);
  }

  getMeta(id: string): AnimationMeta | undefined {
    return this.metas.get(id);
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
  getGroupsWithMeta(): AnimationMeta[][] {
    return this.order.map((group) =>
      group.map((id) => this.metas.get(id)!).filter(Boolean)
    );
  }

  animate() {
    if (this.order.length === 0) return;

    const group = this.order[this.activeIndex];
    group.forEach((id) => {
      this.animations.get(id)?.play();
    });

    this.activeIndex = (this.activeIndex + 1) % this.order.length;
  }

  animateNext() {
    if (this.order.length === 0) return;

    this.activeIndex = (this.activeIndex + 1) % this.order.length;
    this.animate();
  }

  animateGroup(ids: string[]) {
    ids.forEach((id) => {
      this.animations.get(id)?.play();
    });
  }

  removeAnimation(id: string) {
    const tween = this.animations.get(id);
    if (!tween) return;

    tween.destroy();
    this.animations.delete(id);
    this.metas.delete(id);

    this.order = this.order
      .map((group) => group.filter((animId) => animId !== id))
      .filter((group) => group.length > 0);

    if (this.activeIndex >= this.order.length) {
      this.activeIndex = 0;
    }
  }

  resetAll() {
    this.activeIndex = 0;
    this.animations.forEach((tween) => tween.reset());
  }
}
