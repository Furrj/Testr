import { E_REGISTER_RESULT, type T_TOKENS } from "../../../types";
import { T_FORM_REGISTER_USER } from "../../../types/register";
import route_prefix from "../../route_prefix";

const url = route_prefix("/register/user");

export type T_PARAMS = T_FORM_REGISTER_USER;

export type T_RES = {
  result: E_REGISTER_RESULT;
  tokens: T_TOKENS;
};

async function REGISTER_USER(params: T_PARAMS): Promise<T_RES> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(res.status.toString());
  }

  const data: T_RES = await res.json();
  return data;
}

export default REGISTER_USER;
