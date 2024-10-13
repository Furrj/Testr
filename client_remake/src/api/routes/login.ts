import axios, { type AxiosResponse } from "axios";
import type { T_TOKENS } from "../../types";
import route_prefix from "../route_prefix";
import type { T_API_ROUTE } from "../types";

const url = route_prefix("/login");

export type T_PARAMS = {
	username: string;
	password: string;
};

export type T_RES = {
	valid: boolean;
	tokens: T_TOKENS;
};

const LOGIN: T_API_ROUTE = {
	url,
	method: async function (params: T_PARAMS): Promise<AxiosResponse<T_RES>> {
		return await axios<T_RES>({
			method: "POST",
			url,
			data: {
				...params,
			},
		});
	},
};

export default LOGIN;
