import axios, { type AxiosResponse } from "axios";
import type { T_FORM_REGISTER_TEACHER } from "../../../components/Register/Register";
import { E_REGISTER_RESULT, type T_TOKENS } from "../../../types";
import route_prefix from "../../route_prefix";

const url = route_prefix("/register/teacher");

export type T_PARAMS = T_FORM_REGISTER_TEACHER;

export type T_RES = {
	result: E_REGISTER_RESULT;
	tokens: T_TOKENS;
};

async function REGISTER_TEACHER(
	params: T_PARAMS,
): Promise<AxiosResponse<T_RES>> {
	return await axios<T_RES>({
		method: "POST",
		url,
		data: {
			...params,
		},
	});
}

export default REGISTER_TEACHER;
