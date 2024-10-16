import axios, { type AxiosResponse } from "axios";
import route_prefix from "../../route_prefix";

const url = route_prefix("/register/checkUsername");

export type T_PARAMS = {
	username: string;
};

export type T_RES = {
	valid: boolean;
};

async function CHECK_USERNAME(params: T_PARAMS): Promise<T_RES> {
	const res = await fetch(`${url}/${params.username}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		throw new Error(res.status.toString());
	}

	const data: T_RES = await res.json();
	return data;
}

// async function CHECK_USERNAME(params: T_PARAMS): Promise<AxiosResponse<T_RES>> {
// 	return await axios<T_RES>({
// 		method: "GET",
// 		url: `${url}/${params.username}`,
// 	});
// }

export default CHECK_USERNAME;
