import type { T_OPERATIONS } from "./questions";

export type T_GAME_SETTINGS = {
  range: {
    min: number;
    max: number;
  };
  ops: T_OPERATIONS;
  limits: {
    time: number;
    count: number;
  };
};
export const INIT_GAME_SETTINGS: T_GAME_SETTINGS = {
  range: {
    min: 0,
    max: 0,
  },
  ops: {
    add: false,
    sub: false,
    mult: false,
    div: false,
  },
  limits: {
    time: 0,
    count: 0,
  },
};

export enum E_GAME_STATUS {
  PRE = 0,
  ACTIVE,
  POST,
}
