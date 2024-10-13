import axios, { type AxiosResponse } from "axios";
import type { T_TOKENS } from "../../types";
import route_prefix from "../route_prefix";

const url = route_prefix("/login");

export type T_PARAMS = {
	username: string;
	password: string;
};

export type T_RES = {
	valid: boolean;
	tokens: T_TOKENS;
};

async function LOGIN(params: T_PARAMS): Promise<AxiosResponse<T_RES>> {
	return await axios<T_RES>({
		method: "POST",
		url,
		data: {
			...params,
		},
	});
}

export default LOGIN;
