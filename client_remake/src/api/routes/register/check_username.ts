import axios, { type AxiosResponse } from "axios";
import route_prefix from "../../route_prefix";

const url = route_prefix("/register/checkUsername");

export type T_PARAMS = {
	username: string;
};

export type T_RES = {
	valid: boolean;
};

async function CHECK_USERNAME(params: T_PARAMS): Promise<AxiosResponse<T_RES>> {
	return await axios<T_RES>({
		method: "GET",
		url: `${url}/${params.username}`,
	});
}

export default CHECK_USERNAME;
