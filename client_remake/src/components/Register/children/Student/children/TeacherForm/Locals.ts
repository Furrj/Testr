import { useMutation, useQuery, type QueryClient } from "@tanstack/react-query";
import REGISTER_STUDENT, {
	T_PARAMS as T_REGISTER_STUDENT_PARAMS,
	T_RES as T_REGISTER_STUDENT_RES,
} from "../../../../../../api/routes/register/register_student";
import GET_TEACHER_INFO_FOR_STUDENT_REGISTER, {
	T_PARAMS as T_GET_TEACHER_PARAMS,
	T_RES as T_GET_TEACHER_RES,
} from "../../../../../../api/routes/register/get_teacher_info_for_student_register";
import { sendTokensToLocalStorage } from "../../../../../../utils/methods";
import type { NavigateFunction } from "react-router-dom";
import { QUERY_KEYS } from "../../../../../../utils/consts";
import { AxiosError, HttpStatusCode } from "axios";

const Locals = {
	useRegisterStudentMutation: (
		queryClient: QueryClient,
		navigate: NavigateFunction,
	) => {
		return useMutation({
			mutationFn: REGISTER_STUDENT,
			onError(err) {
				console.log(err);
				alert("Error, please refresh and try again");
			},
			onSuccess(data) {
				sendTokensToLocalStorage(data.data.tokens);

				queryClient.resetQueries();
				navigate("/");
			},
		});
	},
	useTeacherMutation: (
		setTeacherInfo: React.Dispatch<
			React.SetStateAction<T_GET_TEACHER_RES | undefined>
		>,
		setErrMessage: React.Dispatch<React.SetStateAction<string>>,
	) => {
		return useMutation({
			mutationFn: GET_TEACHER_INFO_FOR_STUDENT_REGISTER,
			onError(err: AxiosError) {
				if (err.status === HttpStatusCode.BadRequest)
					setErrMessage(`Teacher code does not exist`);
			},
			onSuccess(data) {
				if (data.data.valid) {
					setTeacherInfo(data.data);
				} else setErrMessage(`Teacher code does not exist`);
			},
		});
	},
};

export default Locals;
