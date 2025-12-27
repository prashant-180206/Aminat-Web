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
}

export interface AnimManagerData {
  animations: AnimInfo[];
  order: string[][];
}

export interface TrackerManagerData {
  trackers: MobjectData[];
}
