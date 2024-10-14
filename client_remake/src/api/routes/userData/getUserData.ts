import axios, { type AxiosResponse } from "axios";
import route_prefix from "../../route_prefix";
import { T_USERDATA } from "../../../types";
import generateJwt from "../../generateJwt";
import { T_AUTH } from "../../../contexts/AuthProvider";

const url = route_prefix("/user/get");

export type T_PARAMS = T_AUTH;

export type T_RES = {
	user_data: T_USERDATA;
};

async function GET_USER_DATA(params: T_PARAMS): Promise<AxiosResponse<T_RES>> {
	return await axios<T_RES>({
		method: "GET",
		url,
		headers: {
			Authorization: generateJwt(params.tokens.curr.access_token),
		},
	});
}

export default GET_USER_DATA;
