import { AnimInfo } from "./animation";
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
}

export interface AnimManagerData {
  animations: AnimInfo[];
  order: string[][];
}

export interface TrackerManagerData {
  trackers: {
    id: string;
    value: number;
    sliders: { min: number; max: number } | null;
  }[];
}

export interface ValFuncRelations {
  mobjectId: string;
  trackerName: string;
  functionName: string;
  expression: string;
}
