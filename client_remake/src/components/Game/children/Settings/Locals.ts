export type T_SETTINGS_FORM = {
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

const Locals = {
  INIT_SETTINGS_FORM: {
    range: {
      min: "",
      max: "",
    },
    ops: {
      add: false,
      sub: false,
      mult: true,
      div: false,
    },
    limits: {
      time: "",
      count: "",
    },
  } as T_SETTINGS_FORM,
};

export default Locals;
