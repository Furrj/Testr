import {
	useMutation,
	type QueryClient,
	type UseMutationResult,
} from "@tanstack/react-query";
import REGISTER_STUDENT from "../../../../../../api/routes/register/register_student";
import GET_TEACHER_INFO_FOR_STUDENT_REGISTER, {
	T_PARAMS as T_GET_TEACHER_PARAMS,
	T_RES as T_GET_TEACHER_RES,
} from "../../../../../../api/routes/register/get_teacher_info_for_student_register";
import { sendTokensToLocalStorage } from "../../../../../../utils/methods";
import type { NavigateFunction } from "react-router-dom";
import { AxiosError, HttpStatusCode, type AxiosResponse } from "axios";
import { useForm } from "@tanstack/react-form";
import {
	type T_FORM_REGISTER_STUDENT,
	INIT_FORM_REGISTER_STUDENT,
} from "../../../../Register";

const Locals = {
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
	useRegisterForm: (
		setFormData: React.Dispatch<React.SetStateAction<T_FORM_REGISTER_STUDENT>>,
		getTeacherInfoMutation: UseMutationResult<
			AxiosResponse<T_GET_TEACHER_RES, any>,
			AxiosError<unknown, any>,
			T_GET_TEACHER_PARAMS,
			unknown
		>,
	) => {
		return useForm<T_FORM_REGISTER_STUDENT>({
			defaultValues: {
				...INIT_FORM_REGISTER_STUDENT,
			},
			onSubmit: ({ value }) => {
				setFormData((curr) => {
					return {
						...curr,
						class_id: Number.parseInt(value.class_id as string),
						teacher_id: Number.parseInt(value.teacher_id as string),
					};
				});

				getTeacherInfoMutation.mutate({
					id: Number.parseInt(value.teacher_id as string),
				});
			},
		});
	},
};

export default Locals;
