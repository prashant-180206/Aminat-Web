import Konva from "@/lib/konva";

export class TrackerConnector {
  private connectorFuncs: Map<string, (value: number) => void> = new Map();
  private node: Konva.Node;
  constructor(node: Konva.Node) {
    // Initialize with the given Konva node
    this.node = node;
    this.initiateFuncs();
  }

  private initiateFuncs() {
    this.connectorFuncs.set("x", (value: number) => {
      this.node.x(value);
    });
    this.connectorFuncs.set("y", (value: number) => {
      this.node.y(value);
    });
    // Built-in transforms
    this.connectorFuncs.set("rotation", (value: number) => {
      this.node.rotation(value);
    });
    this.connectorFuncs.set("scale", (value: number) => {
      // apply uniform scale to both axes
      this.node.scale({ x: value, y: value });
    });
    this.connectorFuncs.set("opacity", (value: number) => {
      this.node.opacity(value);
    });
  }

  addConnectorFunc(name: string, func: (value: number) => void): void {
    this.connectorFuncs.set(name, func);
  }

  getConnectorFuncNames(): string[] {
    return Array.from(this.connectorFuncs.keys());
  }

  getConnectorFunc(name: string): ((value: number) => void) | null {
    return this.connectorFuncs.get(name) || null;
  }
}
