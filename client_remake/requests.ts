import axios, { AxiosResponse } from "axios";
import {
	type T_APIRESULT_REGISTER,
	type T_APIRESULT_VALIDATE_ACCESS_TOKEN,
	T_USERDATA_STATE,
} from "./src/types";
import { type T_TOKENS } from "./src/types";
import type { T_GAME_SESSION } from "./src/types/game";
import type { T_STUDENT_DATA } from "./src/types/users";
import {
	T_CLASS,
	T_FORM_REGISTER_STUDENT,
} from "./src/components/Register/Register";
import { T_ASSIGNMENT } from "./src/types/assignments";

// Routes
const ROUTE_PREFIX: string = import.meta.env.DEV ? "http://localhost:5000" : "";
const API_ROUTES = {
	REGISTER_STUDENT: ROUTE_PREFIX + "/api/register/student",
	VALIDATE: ROUTE_PREFIX + "/api/validateSession",
	SUBMIT_GAME_SESSION: ROUTE_PREFIX + "/api/submitGameSession",
	GET_GAME_SESSIONS: ROUTE_PREFIX + "/api/getGameSessions",
	GET_STUDENTS: ROUTE_PREFIX + "/api/getStudents",
	GET_USER_INFO: ROUTE_PREFIX + "/api/getUserInfo",
	UPDATE_VERTICAL: ROUTE_PREFIX + "/api/updateVertical",
	GET_CLASSES: ROUTE_PREFIX + "/api/classes/get",
	GET_CLASS: ROUTE_PREFIX + "/api/class",
	ADD_CLASS: ROUTE_PREFIX + "/api/classes/add",
	CHECK_USERNAME: ROUTE_PREFIX + "/api/checkUsername",
	GET_STUDENT_INFO: ROUTE_PREFIX + "/api/getStudent",
	UPDATE_STUDENT_CLASS: ROUTE_PREFIX + "/api/updateStudent/class",
	ADD_ASSIGNMENT: ROUTE_PREFIX + "/api/assignments/add",
	GET_ASSIGNMENTS_TEACHER: ROUTE_PREFIX + "/api/assignments/get/teacher",
	DELETE_STUDENT: ROUTE_PREFIX + "/api/users/delete/student",
};

export async function apiRequestRegisterStudent(
	formData: T_FORM_REGISTER_STUDENT,
): Promise<AxiosResponse<T_APIRESULT_REGISTER>> {
	console.log(formData);
	return await axios<T_APIRESULT_REGISTER>({
		method: "POST",
		url: API_ROUTES.REGISTER_STUDENT,
		data: {
			...formData,
		},
	});
}

export async function apiRequestValidateSession(
	userDataTokens: T_TOKENS,
): Promise<AxiosResponse<T_APIRESULT_VALIDATE_ACCESS_TOKEN>> {
	console.log("Running apiRequestValidateSession");
	return await axios<T_APIRESULT_VALIDATE_ACCESS_TOKEN>({
		method: "POST",
		url: API_ROUTES.VALIDATE,
		headers: {
			Authorization: `Bearer ${userDataTokens.access_token}`,
		},
	});
}

export interface I_PARAMS_APIREQUEST_SUBMIT_GAME_SESSION {
	tokens: T_TOKENS;
	session: T_GAME_SESSION;
}
export async function apiRequestSubmitGameSession(
	params: I_PARAMS_APIREQUEST_SUBMIT_GAME_SESSION,
): Promise<AxiosResponse> {
	return await axios({
		method: "POST",
		url: API_ROUTES.SUBMIT_GAME_SESSION,
		data: {
			...params.session,
		},
		headers: {
			Authorization: `Bearer ${params.tokens.access_token}`,
		},
	});
}

export async function apiRequestGetGameSessions(
	tokens: T_TOKENS,
): Promise<AxiosResponse<T_GAME_SESSION[]>> {
	return await axios<T_GAME_SESSION[]>({
		method: "GET",
		url: API_ROUTES.GET_GAME_SESSIONS,
		headers: {
			Authorization: `Bearer ${tokens.access_token}`,
		},
	});
}

export async function apiRequestGetStudents(
	tokens: T_TOKENS,
): Promise<AxiosResponse<T_STUDENT_DATA[][]>> {
	return await axios<T_STUDENT_DATA[][]>({
		method: "GET",
		url: API_ROUTES.GET_STUDENTS,
		headers: {
			Authorization: `Bearer ${tokens.access_token}`,
		},
	});
}

export type T_APIRESULT_GET_USER_INFO = {
	user_data: T_USERDATA_STATE;
	sessions: T_GAME_SESSION[];
};
export interface I_PARAMS_APIREQUEST_GET_USER_INFO {
	tokens: T_TOKENS;
	user_id: number;
}
export async function apiRequestGetUserInfo(
	params: I_PARAMS_APIREQUEST_GET_USER_INFO,
): Promise<AxiosResponse<T_APIRESULT_GET_USER_INFO>> {
	return await axios<T_APIRESULT_GET_USER_INFO>({
		method: "GET",
		url: `${API_ROUTES.GET_USER_INFO}/${params.user_id}`,
		headers: {
			Authorization: `Bearer ${params.tokens.access_token}`,
		},
	});
}

export interface I_PARAMS_APIREQUEST_UPDATE_VERTICAL {
	tokens: T_TOKENS;
	vertical: boolean;
}
export async function apiRequestUpdateVertical(
	params: I_PARAMS_APIREQUEST_UPDATE_VERTICAL,
): Promise<AxiosResponse> {
	return await axios({
		method: "POST",
		url: API_ROUTES.UPDATE_VERTICAL,
		data: {
			vertical: params.vertical,
		},
		headers: {
			Authorization: `Bearer ${params.tokens.access_token}`,
		},
	});
}

export async function apiRequestGetClasses(
	tokens: T_TOKENS,
): Promise<AxiosResponse<T_CLASS[]>> {
	return await axios<T_CLASS[]>({
		method: "GET",
		url: API_ROUTES.GET_CLASSES,
		headers: {
			Authorization: `Bearer ${tokens.access_token}`,
		},
	});
}

export interface I_PARAMS_APIREQUEST_ADD_CLASS {
	c: T_CLASS;
	tokens: T_TOKENS;
}
export async function apiRequestAddClass(
	params: I_PARAMS_APIREQUEST_ADD_CLASS,
): Promise<AxiosResponse> {
	return await axios({
		method: "POST",
		url: API_ROUTES.ADD_CLASS,
		data: [params.c],
		headers: {
			Authorization: `Bearer ${params.tokens.access_token}`,
		},
	});
}

export interface I_PARAMS_APIREQUEST_GET_CLASS {
	tokens: T_TOKENS;
	id: number;
}
export async function apiRequestGetClass(
	params: I_PARAMS_APIREQUEST_GET_CLASS,
): Promise<AxiosResponse<T_STUDENT_DATA[]>> {
	return await axios<T_STUDENT_DATA[]>({
		method: "GET",
		url: `${API_ROUTES.GET_CLASS}/${params.id}`,
		headers: {
			Authorization: `Bearer ${params.tokens.access_token}`,
		},
	});
}

export type T_APIRESULT_GET_STUDENT_INFO = {
	user_data: T_USERDATA_STATE;
	sessions: T_GAME_SESSION[];
	class: T_CLASS;
};
export interface I_PARAMS_APIREQUEST_GET_STUDENT_INFO {
	tokens: T_TOKENS;
	user_id: number;
}
export async function apiRequestGetStudentInfo(
	params: I_PARAMS_APIREQUEST_GET_STUDENT_INFO,
): Promise<AxiosResponse<T_APIRESULT_GET_STUDENT_INFO>> {
	return await axios<T_APIRESULT_GET_STUDENT_INFO>({
		method: "GET",
		url: `${API_ROUTES.GET_STUDENT_INFO}/${params.user_id}`,
		headers: {
			Authorization: `Bearer ${params.tokens.access_token}`,
		},
	});
}

export interface I_PARAMS_APIREQUEST_UPDATE_STUDENT_CLASS {
	user_id: number;
	class_id: number;
	tokens: T_TOKENS;
}
export async function apiRequestUpdateStudentClass(
	params: I_PARAMS_APIREQUEST_UPDATE_STUDENT_CLASS,
): Promise<AxiosResponse> {
	return await axios({
		method: "POST",
		url: API_ROUTES.UPDATE_STUDENT_CLASS,
		data: {
			user_id: params.user_id,
			class_id: params.class_id,
		},
		headers: {
			Authorization: `Bearer ${params.tokens.access_token}`,
		},
	});
}

export interface I_PARAMS_APIREQUEST_ADD_ASSIGNMENT {
	tokens: T_TOKENS;
	assignment: T_ASSIGNMENT;
}
export async function apiRequestAddAssignment(
	params: I_PARAMS_APIREQUEST_ADD_ASSIGNMENT,
): Promise<AxiosResponse> {
	return await axios({
		method: "POST",
		url: API_ROUTES.ADD_ASSIGNMENT,
		data: {
			...params.assignment,
		},
		headers: {
			Authorization: `Bearer ${params.tokens.access_token}`,
		},
	});
}

export async function apiRequestGetAssignmentsTeacher(
	tokens: T_TOKENS,
): Promise<AxiosResponse<T_ASSIGNMENT[]>> {
	return await axios<T_ASSIGNMENT[]>({
		method: "GET",
		url: API_ROUTES.GET_ASSIGNMENTS_TEACHER,
		headers: {
			Authorization: `Bearer ${tokens.access_token}`,
		},
	});
}

export interface I_PARAMS_APIREQUEST_DELETE_STUDENT {
	tokens: T_TOKENS;
	user_id: number;
}
export async function apiRequestDeleteStudent(
	params: I_PARAMS_APIREQUEST_GET_STUDENT_INFO,
): Promise<AxiosResponse> {
	return await axios({
		method: "DELETE",
		url: `${API_ROUTES.DELETE_STUDENT}/${params.user_id}`,
		headers: {
			Authorization: `Bearer ${params.tokens.access_token}`,
		},
	});
}
