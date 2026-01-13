import { DEFAULT_SCALE } from "../config";

export const c2p = (x: number, y: number) => {
  return {
    x: x / DEFAULT_SCALE,
    y: -y / DEFAULT_SCALE,
  };
};

export const p2c = (x: number, y: number) => {
  return {
    x: x * DEFAULT_SCALE,
    y: -(y * DEFAULT_SCALE),
  };
};
