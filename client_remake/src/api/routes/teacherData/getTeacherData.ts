import axios, { type AxiosResponse } from "axios";
import route_prefix from "../../route_prefix";
import { T_TOKENS } from "../../../types";
import generateJwt from "../../generateJwt";
import { T_CLASS, T_TEACHER_DATA } from "../../../types/teacherData";
import { T_STUDENT_DATA } from "../../../types/users";

const url = route_prefix("/teacher/get");

export type T_PARAMS = T_TOKENS;

export type T_RES = {
	classes: T_CLASS[];
	students: T_STUDENT_DATA[];
	teacher_data: T_TEACHER_DATA;
};

async function GET_TEACHER_DATA(
	params: T_PARAMS,
): Promise<AxiosResponse<T_RES>> {
	return await axios<T_RES>({
		method: "GET",
		url,
		headers: {
			Authorization: generateJwt(params.access_token),
		},
	});
}

export default GET_TEACHER_DATA;
