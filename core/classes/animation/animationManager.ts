import Konva from "@/lib/konva";

export class AnimationManager {
  private animations = new Map<string, Konva.Tween>();
  private order: string[][] = [];
  private activeIndex = 0;
  private counter = 0;

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

  getAnimationFromId(id: string): Konva.Tween | undefined {
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

    this.order = this.order
      .map((group) => group.filter((animId) => animId !== id))
      .filter((group) => group.length > 0);

    if (this.activeIndex >= this.order.length) {
      this.activeIndex = 0;
    }
  }

  resetAll() {
    this.animations.forEach((tween) => tween.reset());
  }
}
