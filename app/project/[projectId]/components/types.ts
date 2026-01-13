/* eslint-disable @typescript-eslint/no-explicit-any */
export type SceneDoc = {
  _id: string;
  title: string;
  data: any;
  thumbnail?: string;
  version?: string;
};

export type ProjectDoc = {
  _id: string;
  name: string;
  description?: string;
  scenes?: SceneDoc[];
};
