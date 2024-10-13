import axios, { type AxiosResponse } from "axios";
import type { T_CLASS } from "../../../components/Register/Register";
import route_prefix from "../../route_prefix";

const url = route_prefix("/teacher/get");

export type T_PARAMS = {
	id: number;
};

export type T_RES = {
	first_name: string;
	last_name: string;
	school: string;
	classes: T_CLASS[];
	valid: boolean;
};

async function GET_TEACHER_INFO_FOR_STUDENT_REGISTER(
	params: T_PARAMS,
): Promise<AxiosResponse<T_RES>> {
	return await axios<T_RES>({
		method: "GET",
		url: `${url}/${params.id.toString()}`,
		data: {
			...params,
		},
	});
}

export default GET_TEACHER_INFO_FOR_STUDENT_REGISTER;
