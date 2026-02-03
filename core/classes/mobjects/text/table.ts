/* eslint-disable @typescript-eslint/no-explicit-any */
import Konva from "@/lib/konva";
import { AnimGetter } from "@/core/classes/animation/animgetter";
import { TrackerConnector } from "@/core/classes/Tracker/helpers/TrackerConnector";
import { MobjectData } from "@/core/types/file";
import { TableCell } from "@/core/classes/mobjects/utils/tablecell";
import {
  TableProperties,
  TableProperty,
} from "@/core/classes/controllers/text/table";

export class Table extends Konva.Group {
  public cells: TableCell[][] = [];
  public animgetter: AnimGetter;
  public trackerconnector: TrackerConnector;
  public features: TableProperty;

  private borderRect: Konva.Rect;
  private partitionLines: Konva.Line[] = [];

  private _TYPE: string;

  constructor(TYPE: string, rows = 2, cols = 2) {
    super();
    this._TYPE = TYPE;

    // Create cells
    for (let r = 0; r < rows; r++) {
      const row: TableCell[] = [];
      for (let c = 0; c < cols; c++) {
        const cell = new TableCell();
        row.push(cell);
        this.add(cell);
      }
      this.cells.push(row);
    }

    // Border
    this.borderRect = new Konva.Rect({
      stroke: "#444",
      strokeWidth: 1,
      listening: false,
      visible: true,
    });
    this.add(this.borderRect);

    this.animgetter = new AnimGetter(this as any);
    this.trackerconnector = new TrackerConnector(this as any);
    this.features = new TableProperty(this);

    this.name("Table");
  }

  /* -------------------------------------------------- */
  /* BORDER                                             */
  /* -------------------------------------------------- */

  updateBorder(show: boolean, width: number, height: number) {
    this.borderRect.visible(show);

    if (!show) return;

    this.borderRect.setAttrs({
      x: 0,
      y: 0,
      width,
      height,
      stroke: this.features?.getData().color || "#444",
      strokeWidth: 4,
    });
  }

  rebuildTable() {
    // const table = this.actualMobj as Table;
    const data = this.cells.map((row) =>
      row.map((cell) => cell.textNode.text()),
    );

    this.cells.flat().forEach((c) => c.destroy());
    this.cells = [];

    for (let r = 0; r < this.features.getData().rows; r++) {
      const row: TableCell[] = [];
      for (let c = 0; c < this.features.getData().cols; c++) {
        const cell = new TableCell();
        row.push(cell);
        this.add(cell);
        if (data[r] && data[r][c]) {
          cell.setText(data[r][c]);
        }
      }
      this.cells.push(row);
    }
  }

  /* -------------------------------------------------- */
  /* PARTITIONS                                         */
  /* -------------------------------------------------- */

  updatePartitions(
    show: boolean,
    rows: number,
    cols: number,
    cellWidth: number,
    cellHeight: number,
  ) {
    const color = this.features?.getData().color || "#444";
    this.partitionLines.forEach((l) => l.destroy());
    this.partitionLines = [];

    if (!show) return;

    // vertical lines
    for (let c = 1; c < cols; c++) {
      const x = c * cellWidth;
      const line = new Konva.Line({
        points: [x, 0, x, rows * cellHeight],
        stroke: color,
        strokeWidth: 4,
        listening: false,
      });
      this.add(line);
      this.partitionLines.push(line);
    }

    // horizontal lines
    for (let r = 1; r < rows; r++) {
      const y = r * cellHeight;
      const line = new Konva.Line({
        points: [0, y, cols * cellWidth, y],
        stroke: color,
        strokeWidth: 4,
        listening: false,
      });
      this.add(line);
      this.partitionLines.push(line);
    }
  }

  getUIComponents() {
    return this.features.getUIComponents();
  }

  /* -------------------------------------------------- */
  /* SERIALIZATION                                      */
  /* -------------------------------------------------- */

  storeAsObj(): MobjectData {
    return {
      id: this.id(),
      properties: this.features.getData(),
      specificData: {
        data: this.cells.map((row) => row.map((cell) => cell.textNode.text())),
      },
    };
  }

  loadFromObj(obj: MobjectData & { specificData: { data: string[][] } }) {
    this.features.setData(obj.properties as TableProperties);

    const data = obj.specificData?.data ?? [];
    for (let r = 0; r < this.cells.length; r++) {
      for (let c = 0; c < this.cells[r].length; c++) {
        this.cells[r][c].setText(data?.[r]?.[c] ?? "");
      }
    }

    this.features.refresh();
  }

  type() {
    return this._TYPE;
  }
}
