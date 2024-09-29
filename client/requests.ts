import axios, { AxiosResponse } from "axios";
import {
  type T_APIRESULT_LOGIN,
  type T_USERINPUT_LOGIN,
  type T_APIRESULT_REGISTER,
  type T_APIRESULT_VALIDATE_ACCESS_TOKEN,
  T_USERDATA_STATE,
} from "./src/types";
import { type T_TOKENS } from "./src/types";
import type { T_GAME_SESSION } from "./src/types/game";
import type { T_STUDENT_DATA } from "./src/types/users";
import {
  T_FORM_REGISTER_STUDENT,
  T_FORM_REGISTER_TEACHER,
} from "./src/components/Register/Register";

// Routes
const ROUTE_PREFIX: string = import.meta.env.DEV ? "http://localhost:5000" : "";
const API_ROUTES = {
  LOGIN: ROUTE_PREFIX + "/api/login",
  REGISTER_TEACHER: ROUTE_PREFIX + "/api/register/teacher",
  REGISTER_STUDENT: ROUTE_PREFIX + "/api/register/student",
  VALIDATE: ROUTE_PREFIX + "/api/validateSession",
  SUBMIT_GAME_SESSION: ROUTE_PREFIX + "/api/submitGameSession",
  GET_GAME_SESSIONS: ROUTE_PREFIX + "/api/getGameSessions",
  GET_STUDENTS: ROUTE_PREFIX + "/api/getStudents",
  GET_USER_INFO: ROUTE_PREFIX + "/api/getUserInfo",
  UPDATE_VERTICAL: ROUTE_PREFIX + "/api/updateVertical",
};

export async function apiRequestRegisterTeacher(
  formData: T_FORM_REGISTER_TEACHER,
): Promise<AxiosResponse<T_APIRESULT_REGISTER>> {
  return await axios<T_APIRESULT_REGISTER>({
    method: "POST",
    url: API_ROUTES.REGISTER_TEACHER,
    data: {
      ...formData,
    },
  });
}

export async function apiRequestRegisterStudent(
  formData: T_FORM_REGISTER_STUDENT,
): Promise<AxiosResponse<T_APIRESULT_REGISTER>> {
  return await axios<T_APIRESULT_REGISTER>({
    method: "POST",
    url: API_ROUTES.REGISTER_STUDENT,
    data: {
      ...formData,
    },
  });
}

export async function apiRequestLogin(
  userInput: T_USERINPUT_LOGIN,
): Promise<AxiosResponse<T_APIRESULT_LOGIN>> {
  return await axios<T_APIRESULT_LOGIN>({
    method: "POST",
    url: API_ROUTES.LOGIN,
    data: {
      ...userInput,
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
