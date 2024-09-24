export type T_OPERATIONS = {
  add: boolean;
  sub: boolean;
  mult: boolean;
  div: boolean;
};
export enum E_OPERATIONS {
  NULL = -1,
  ADD,
  SUB,
  MULT,
  DIV,
}

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

export type T_GAME_SESSION = {
  limit_type: number;
  questions_count: number;
  correct_count: number;
  score: number;
  time: number;
  min: number;
  max: number;
  add: boolean;
  sub: boolean;
  mult: boolean;
  div: boolean;
};

export enum E_GAME_STATUS {
  PRE = 0,
  ACTIVE,
  POST,
}

export enum E_GAME_LIMIT_TYPES {
  NULL = -1,
  TIME,
  COUNT,
}
