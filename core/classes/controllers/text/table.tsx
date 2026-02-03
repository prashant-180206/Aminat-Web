import { Table } from "@/core/classes/mobjects/text/table";
import { BaseProperties, BaseProperty } from "../base/base";
import SliderInput from "../input/sliderInput";
import { Colors } from "@/core/utils/colors";
import { ColorDisc } from "@/core/classes/controllers/input/colordisc";
import { NumberInputs } from "@/core/classes/controllers/input/dualInput";
import { Table2, TableCellsMerge } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

/* -------------------------------------------------- */
/* PROPERTIES                                         */
/* -------------------------------------------------- */

export interface TableProperties extends BaseProperties {
  rows: number;
  cols: number;
  cellWidth: number;
  cellHeight: number;
  fontSize: number;
  textColor: string;
  cellBgColor: string;
  showPartitions: boolean;
  showBorder: boolean;
}

/* -------------------------------------------------- */
/* CONTROLLER                                         */
/* -------------------------------------------------- */

export class TableProperty extends BaseProperty {
  protected rows = 2;
  protected cols = 2;

  protected cellWidth = 200;
  protected cellHeight = 80;

  protected fontSize = 32;
  protected textColor = Colors.TEXT;
  protected cellBgColor = Colors.BG;

  protected showPartitions = true;
  protected showBorder = true;

  constructor(mobj: Table) {
    super(mobj, mobj);

    this.update({
      rows: this.rows,
      cols: this.cols,
      cellWidth: this.cellWidth,
      cellHeight: this.cellHeight,
      fontSize: this.fontSize,
      textColor: this.textColor,
      cellBgColor: this.cellBgColor,
      showPartitions: this.showPartitions,
      showBorder: this.showBorder,
    });
  }

  /* -------------------------------------------------- */
  /* UPDATE                                            */
  /* -------------------------------------------------- */

  override update(prop: Partial<TableProperties>): void {
    super.update(prop);

    let rebuild = false;

    if (prop.rows !== undefined && prop.rows !== this.rows) {
      this.rows = prop.rows;
      rebuild = true;
    }

    if (prop.cols !== undefined && prop.cols !== this.cols) {
      this.cols = prop.cols;
      rebuild = true;
    }

    if (prop.cellWidth !== undefined) this.cellWidth = prop.cellWidth;
    if (prop.cellHeight !== undefined) this.cellHeight = prop.cellHeight;
    if (prop.fontSize !== undefined) this.fontSize = prop.fontSize;
    if (prop.textColor !== undefined) this.textColor = prop.textColor;
    if (prop.cellBgColor !== undefined) this.cellBgColor = prop.cellBgColor;
    if (prop.showPartitions !== undefined)
      this.showPartitions = prop.showPartitions;
    if (prop.showBorder !== undefined) this.showBorder = prop.showBorder;

    if (rebuild && this.actualMobj instanceof Table)
      this.actualMobj.rebuildTable();

    this.applyLayout();
  }

  /* -------------------------------------------------- */
  /* LAYOUT                                            */
  /* -------------------------------------------------- */

  private applyLayout() {
    const table = this.actualMobj as Table;

    for (let r = 0; r < table.cells.length; r++) {
      for (let c = 0; c < table.cells[r].length; c++) {
        const cell = table.cells[r][c];

        cell.position({
          x: c * this.cellWidth,
          y: r * this.cellHeight,
        });

        cell.setBoxSize(this.cellWidth, this.cellHeight);
        cell.setStyle({
          fontSize: this.fontSize,
          textColor: this.textColor,
          bgColor: this.cellBgColor,
        });
      }
    }

    table.updateBorder(
      this.showBorder,
      this.cols * this.cellWidth,
      this.rows * this.cellHeight,
    );

    table.updatePartitions(
      this.showPartitions,
      this.rows,
      this.cols,
      this.cellWidth,
      this.cellHeight,
    );
  }

  /* -------------------------------------------------- */
  /* SERIALIZATION                                     */
  /* -------------------------------------------------- */

  override getData(): TableProperties {
    return {
      ...super.getData(),
      rows: this.rows,
      cols: this.cols,
      cellWidth: this.cellWidth,
      cellHeight: this.cellHeight,
      fontSize: this.fontSize,
      textColor: this.textColor,
      cellBgColor: this.cellBgColor,
      showPartitions: this.showPartitions,
      showBorder: this.showBorder,
    };
  }

  override setData(data: TableProperties): void {
    super.setData(data);

    this.rows = data.rows;
    this.cols = data.cols;
    this.cellWidth = data.cellWidth;
    this.cellHeight = data.cellHeight;
    this.fontSize = data.fontSize;
    this.textColor = data.textColor;
    this.cellBgColor = data.cellBgColor;
    this.showPartitions = data.showPartitions;
    this.showBorder = data.showBorder;

    if (this.actualMobj instanceof Table) this.actualMobj.rebuildTable();
    this.applyLayout();
  }

  /* -------------------------------------------------- */
  /* UI                                                */
  /* -------------------------------------------------- */

  override getUIComponents() {
    const base = super.getUIComponents();

    base.push({
      name: "Table Size",
      component: (
        <NumberInputs
          inputs={[
            {
              label: "Rows",
              value: this.rows,
              onChange: (v) =>
                this.update({
                  rows: v,
                }),
            },
            {
              label: "Columns",
              value: this.cols,
              onChange: (v) =>
                this.update({
                  cols: v,
                }),
            },
          ]}
          icon={<Table2 className="h-4 w-4" />}
        />
      ),
    });

    base.push({
      name: "Cell Layout",
      component: (
        <SliderInput
          key="cell-layout"
          fields={[
            {
              label: "Cell Width",
              value: this.cellWidth,
              min: 40,
              max: 300,
              step: 5,
              onChange: (v) => this.update({ cellWidth: v }),
            },
            {
              label: "Cell Height",
              value: this.cellHeight,
              min: 20,
              max: 150,
              step: 5,
              onChange: (v) => this.update({ cellHeight: v }),
            },
            {
              label: "Font Size",
              value: this.fontSize,
              min: 8,
              max: 40,
              step: 1,
              onChange: (v) => this.update({ fontSize: v }),
            },
          ]}
          icon={<TableCellsMerge className="h-4 w-4" />}
          message="Cell Layout"
        />
      ),
    });

    base.push({
      name: "TextColor",
      component: (
        <ColorDisc
          size={8}
          value={this.textColor}
          onChange={(v) => this.update({ textColor: v })}
          message="Text Color"
        />
      ),
    });
    base.push({
      name: "CellBgColor",
      component: (
        <ColorDisc
          size={8}
          value={this.cellBgColor}
          onChange={(v) => this.update({ cellBgColor: v })}
          message="Cell Background Color"
        />
      ),
    });

    base.push({
      name: "Show Labels",
      component: (
        <div key={"ShowLabels"} className="flex items-center gap-2">
          <Checkbox
            id={`my-checkbox-showpartitions`}
            defaultChecked={this.showPartitions}
            onCheckedChange={(v) =>
              this.update({ showPartitions: v as boolean })
            }
          />
          <Label
            htmlFor={`my-checkbox-showpartitions`}
            className="text-sm font-medium"
          >
            Partitions
          </Label>
        </div>
      ),
    });
    base.push({
      name: "Show Border",
      component: (
        <div key={"ShowBorder"} className="flex items-center gap-2">
          <Checkbox
            id={`my-checkbox-showborder`}
            defaultChecked={this.showBorder}
            onCheckedChange={(v) => this.update({ showBorder: v as boolean })}
          />
          <Label
            htmlFor={`my-checkbox-showborder`}
            className="text-sm font-medium"
          >
            Border
          </Label>
        </div>
      ),
    });

    return base;
  }
}
