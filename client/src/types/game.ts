export type T_GAME_SETTINGS = {
  range: {
    min: number | string;
    max: number | string;
  };
  ops: {
    add: boolean;
    sub: boolean;
    mult: boolean;
    div: boolean;
  };
  limits: {
    time: number | string;
    count: number | string;
  };
};
export const INIT_GAME_SETTINGS: T_GAME_SETTINGS = {
  range: {
    min: "",
    max: "",
  },
  ops: {
    add: false,
    sub: false,
    mult: false,
    div: false,
  },
  limits: {
    time: "",
    count: "",
  },
};

export enum E_GAME_STATUS {
  PRE = 0,
  ACTIVE,
  POST,
}