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
};
export const INIT_ACCOUNT: T_ACCOUNT = {
	membership_type: E_MEMBERSHIP_TYPES.NULL,
	is_active: false,
};

export type T_USER_STATUS = {
	is_fetching: boolean;
	is_logged_in: boolean;
};
export const INIT_USER_STATUS: T_USER_STATUS = {
	is_fetching: false,
	is_logged_in: false,
};

export type T_USER = {
	user_id: number;
	username: string;
	first_name: string;
	last_name: string;
	vertical: boolean;
	account: T_ACCOUNT;
	role: string;
};
export const INIT_USER: T_USER = {
	user_id: -1,
	username: "",
	first_name: "",
	last_name: "",
	vertical: false,
	account: { ...INIT_ACCOUNT },
	role: "",
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
