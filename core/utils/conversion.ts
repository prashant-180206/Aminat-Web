import { DEFAULT_HEIGHT, DEFAULT_SCALE, DEFAULT_WIDTH } from "../config";

export const c2p = (x: number, y: number) => {
  return {
    x: (x - DEFAULT_WIDTH / 2) / DEFAULT_SCALE,
    y: (y - DEFAULT_HEIGHT / 2) / DEFAULT_SCALE,
  };
};

export const p2c = (x: number, y: number) => {
  return {
    x: x * DEFAULT_SCALE + DEFAULT_WIDTH / 2,
    y: y * DEFAULT_SCALE + DEFAULT_HEIGHT / 2,
  };
};
