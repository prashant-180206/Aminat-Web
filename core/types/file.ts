import { AnimStoreData } from "./animation";
import { BaseProperties } from "./properties";

export interface MobjectData {
  properties: BaseProperties;
  id: string;
}

export interface SceneData {
  mobjects: {
    type: string;
    mobject: MobjectData;
  }[];

  animationsData: AnimManagerData;
  trackerManagerData: TrackerManagerData;
  valFuncRelations: ValFuncRelations[];
  ptValFuncRelations: PtValFuncRelations[];
}

export interface AnimManagerData {
  animations: AnimStoreData[][];
}

export interface TrackerManagerData {
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
