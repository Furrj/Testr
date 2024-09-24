import axios, { AxiosResponse } from "axios";
import {
  type T_APIRESULT_LOGIN,
  type T_USERINPUT_LOGIN,
  type T_APIRESULT_REGISTER,
  type T_USERINPUT_REGISTER,
  type T_APIRESULT_VALIDATE_ACCESS_TOKEN,
} from "./src/types";
import { type T_TOKENS } from "./src/types";
import type { T_GAME_SESSION } from "./src/types/game";

// Routes
const ROUTE_PREFIX: string = import.meta.env.DEV ? "http://localhost:5000" : "";
const API_ROUTES = {
  LOGIN: ROUTE_PREFIX + "/api/login",
  REGISTER: ROUTE_PREFIX + "/api/register",
  VALIDATE: ROUTE_PREFIX + "/api/validateSession",
  SubmitGameSession: ROUTE_PREFIX + "/api/submitGameSession",
};

export async function apiRequestRegister(
  userInput: T_USERINPUT_REGISTER,
): Promise<AxiosResponse<T_APIRESULT_REGISTER>> {
  return await axios<T_APIRESULT_REGISTER>({
    method: "POST",
    url: API_ROUTES.REGISTER,
    data: {
      ...userInput,
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
): Promise<AxiosResponse<T_APIRESULT_VALIDATE_ACCESS_TOKEN>> {
  console.log("Running apiRequestValidateSession");
  return await axios<T_APIRESULT_VALIDATE_ACCESS_TOKEN>({
    method: "POST",
    url: API_ROUTES.SubmitGameSession,
    data: {
      ...params.session,
    },
    headers: {
      Authorization: `Bearer ${params.tokens.access_token}`,
    },
  });
}
