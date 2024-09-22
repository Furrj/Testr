export type T_GAME_SETTINGS = {
  range: {
    min: number;
    max: number;
  };
  ops: {
    add: boolean;
    sub: boolean;
    mult: boolean;
    div: boolean;
  };
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

export type T_QUESTION = {
  operands: number[];
  operator: E_OPERATIONS;
  result: number;
};

export enum E_OPERATIONS {
  ADD = 0,
  SUB,
  MULT,
  DIV,
}
