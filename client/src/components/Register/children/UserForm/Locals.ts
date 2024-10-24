import { useMutation, UseMutationResult } from "@tanstack/react-query";
import CHECK_USERNAME, {
	T_PARAMS,
	T_RES,
} from "../../../../api/routes/register/check_username";
import { useForm } from "@tanstack/react-form";
import {
	T_FORM_REGISTER_USER,
	INIT_FORM_REGISTER_USER,
} from "../../../../types/register";
import { E_DISPLAY_MODES } from "../Teach/Locals";

const Locals = {
	useCheckUsernameMutation: (
		setDisplayMode: React.Dispatch<React.SetStateAction<E_DISPLAY_MODES>>,
		setErrMessage: React.Dispatch<React.SetStateAction<string>>,
	) =>
		useMutation({
			mutationFn: (params: T_PARAMS): Promise<T_RES> => CHECK_USERNAME(params),
			onError(err) {
				console.log(err);
				alert("Error, please refresh and try again");
			},
			onSuccess(data) {
				if (data.valid) setDisplayMode(E_DISPLAY_MODES.TEACHER);
				else setErrMessage("Username already exists");
			},
		}),
	useRegisterForm: (
		setUserData: React.Dispatch<React.SetStateAction<T_FORM_REGISTER_USER>>,
		checkUsernameMutation: UseMutationResult<T_RES, Error, T_PARAMS, unknown>,
	) =>
		useForm<T_FORM_REGISTER_USER>({
			defaultValues: {
				...INIT_FORM_REGISTER_USER,
			},
			onSubmit: ({ value }) => {
				const obj: T_FORM_REGISTER_USER = {
					first_name: value.first_name.trim(),
					last_name: value.last_name.trim(),
					username: value.username.trim(),
					password: value.password.trim(),
					confirm_password: value.password.trim(),
					email: value.email ? value.email.trim() : "",
				};

				setUserData(obj);
				checkUsernameMutation.mutate({ username: value.username.trim() });
			},
		}),
};

export default Locals;
