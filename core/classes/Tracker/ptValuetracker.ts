import { ValueTracker } from "./valuetracker";

export class PtValueTracker {
  private X: ValueTracker;
  private Y: ValueTracker;

  constructor(point: { x: number; y: number }) {
    this.X = new ValueTracker(point.x);
    this.Y = new ValueTracker(point.y);
  }

  get x(): ValueTracker {
    return this.X;
  }

  get y(): ValueTracker {
    return this.Y;
  }
}
