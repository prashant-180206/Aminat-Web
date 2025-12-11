import Konva from "konva";

class FunctionCurve extends Konva.Shape {
  private _function: (x: number) => number;

  constructor(config: Konva.ShapeConfig & { function: (x: number) => number }) {
    const { function: fn, ...shapeConfig } = config;
    super(shapeConfig);
    this._function = fn;
    this.sceneFunc(this.drawCurve.bind(this));
  }

  private drawCurve(context: CanvasRenderingContext2D) {
    const width = this.width();
    const height = this.height();
    const centerX = width / 2;
    const centerY = height / 2;

    context.beginPath();
    for (let x = 0; x < width; x++) {
      const normalizedX = (x - centerX) / 100;
      const y = this._function(normalizedX);
      const screenY = centerY - y * 100;

      if (x === 0) {
        context.moveTo(x, screenY);
      } else {
        context.lineTo(x, screenY);
      }
    }
    context.strokeStyle = this.stroke() || "black";
    context.lineWidth = this.strokeWidth() || 1;
    context.stroke();
  }

  get function(): (x: number) => number {
    return this._function;
  }

  set function(fn: (x: number) => number) {
    this._function = fn;
    this.draw();
  }
}

export default FunctionCurve;
