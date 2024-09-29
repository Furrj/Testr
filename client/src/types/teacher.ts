export type T_REGISTER_TEACHER = {
  username: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  school: string;
  classes: T_CLASS[];
};
export const INIT_REGISTER_TEACHER: T_REGISTER_TEACHER = {
  username: "",
  password: "",
  confirm_password: "",
  first_name: "",
  last_name: "",
  school: "",
  classes: [],
};

export type T_CLASS = {
  name: string;
  class_id: number;
};
