import { useForm } from "@tanstack/react-form";
import {
	T_FORM_REGISTER_TEACHER,
	INIT_FORM_REGISTER_TEACHER,
} from "../../../../../../types/register";

const Locals = {
	useTeacherForm: (
		setTeacherData: React.Dispatch<
			React.SetStateAction<T_FORM_REGISTER_TEACHER>
		>,
	) =>
		useForm<T_FORM_REGISTER_TEACHER>({
			defaultValues: {
				...INIT_FORM_REGISTER_TEACHER,
			},
			onSubmit: ({ value }) => {
				setTeacherData({
					email: value.email.trim(),
					school: value.school.trim(),
				});
			},
		}),
};

export default Locals;
