import route_prefix from "../../route_prefix";
import generateAuthTokenStr from "../../generateAuthTokenStr";
import { T_USER } from "../../../types/users";
import { T_TOKENS } from "../../../types/auth";

const url = route_prefix("/user");

export type T_PARAMS = T_TOKENS;

export type T_RES = {
	user_data: T_USER;
	valid: boolean;
};

async function GET_USER_DATA(params: T_PARAMS): Promise<T_RES> {
	console.log("running get user data");
	const res = await fetch(url, {
		method: "GET",
		headers: {
			Authorization: generateAuthTokenStr(params.access_token),
		},
	});

	if (!res.ok) {
		throw new Error(res.status.toString());
	}

	const data: T_RES = await res.json();
	return data;
}

export default GET_USER_DATA;
