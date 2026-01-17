import { BaseProperties } from "../classes/controllers/base/base";
import { AnimStoreData } from "./animation";

export interface MobjectData {
  properties: BaseProperties;
  id: string;
  specificData?: string;
}

export interface SceneData {
  mobjects: {
    type: string;
    mobject: MobjectData;
  }[];

  animationsData: AnimManagerData;
  trackerManagerData: TrackerData;
  valFuncRelations: ValFuncRelations[];
  ptValFuncRelations: PtValFuncRelations[];
}

export interface AnimManagerData {
  animations: AnimStoreData[][];
}

export interface TrackerData {
  trackers: {
    id: string;
    value: number;
    sliders: { min: number; max: number; rank: number } | null;
  }[];

  pointtrackers: {
    id: string;
    value: { x: number; y: number };
    sliders: {
      minX: number;
      maxX: number;
      minY: number;
      maxY: number;
      rank: number;
    } | null;
  }[];

  connections: string[];
}

export interface ValFuncRelations {
  mobjectId: string;
  trackerName: string;
  functionName: string;
  expression: string;
}

export interface PtValFuncRelations {
  mobjectId: string;
  trackerName: string;
  functionNameX?: string;
  functionNameY?: string;
  expressionX?: string;
  expressionY?: string;
}
