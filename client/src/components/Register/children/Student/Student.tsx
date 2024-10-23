import { useState } from "react";
import { deepCopyObject } from "../../../../utils/methods";
import TeacherForm from "./children/TeacherForm/TeacherForm";
import {
	T_FORM_REGISTER_STUDENT,
	INIT_FORM_REGISTER_STUDENT,
} from "../../../../types/register";
import UserForm from "../UserForm/UserForm";

const Student: React.FC = () => {
	const [teacherMode, setTeacherMode] = useState<boolean>(false);
	const [formData, setFormData] = useState<T_FORM_REGISTER_STUDENT>(
		deepCopyObject(INIT_FORM_REGISTER_STUDENT),
	);

	if (teacherMode) {
		return (
			<TeacherForm
				formData={{ curr: formData, set: setFormData }}
				teacherMode={{ curr: teacherMode, set: setTeacherMode }}
			/>
		);
	} else {
		// return (
		// 	<UserForm
		// 		data={{ curr: formData, set: setFormData }}
		// 		teacherMode={{ curr: teacherMode, set: setTeacherMode }}
		// 	/>
		// );
	}
};

export default Student;
