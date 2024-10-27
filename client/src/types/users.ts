import { INIT_TOKENS, T_TOKENS } from "./auth";

export enum E_USER_ROLES {
  UNINITIALIZED = -1,
  STUDENT,
  TEACHER,
  ADMIN,
  NON,
}
export enum E_MEMBERSHIP_TYPES {
  NULL = -1,
  UNVALIDATED,
  VALIDATED,
  BASIC,
  PREMIUM,
}
export type T_ACCOUNT = {
  membership_type: E_MEMBERSHIP_TYPES;
  is_active: boolean;
  role: E_USER_ROLES;
};
export const INIT_ACCOUNT: T_ACCOUNT = {
  membership_type: E_MEMBERSHIP_TYPES.NULL,
  is_active: false,
  role: E_USER_ROLES.UNINITIALIZED,
};
export type T_USERDATA = {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  vertical: boolean;
  account: T_ACCOUNT;
  tokens: T_TOKENS
};
export const INIT_USER_DATA: T_USERDATA = {
  user_id: -1,
  username: "",
  first_name: "",
  last_name: "",
  vertical: false,
  account: { ...INIT_ACCOUNT },
  tokens: { ...INIT_TOKENS }
};

export type T_STUDENT_DATA = {
  first_name: string;
  last_name: string;
  username: string;
  user_id: number;
  teacher_id: number;
  class_id: number;
};
export const INIT_STUDENT_DATA: T_STUDENT_DATA = {
  first_name: "",
  last_name: "",
  username: "",
  user_id: -1,
  teacher_id: -1,
  class_id: -1,
};
