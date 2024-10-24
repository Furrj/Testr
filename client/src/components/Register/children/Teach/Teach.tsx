import { useState } from "react";
import styles from "./Teach.module.scss";
import {
	T_FORM_REGISTER_TEACHER,
	T_FORM_REGISTER_USER,
	INIT_FORM_REGISTER_USER,
	INIT_FORM_REGISTER_TEACHER,
} from "../../../../types/register";
import UserForm from "../UserForm/UserForm";
import { E_DISPLAY_MODES } from "./Locals";
import TeacherForm from "./children/TeacherForm/TeacherForm";

const Teach: React.FC = () => {
	const [displayMode, setDisplayMode] = useState<E_DISPLAY_MODES>(
		E_DISPLAY_MODES.USER,
	);
	const [teacherData, setTeacherData] = useState<T_FORM_REGISTER_TEACHER>({
		...INIT_FORM_REGISTER_TEACHER,
	});
	const [userData, setUserData] = useState<T_FORM_REGISTER_USER>({
		...INIT_FORM_REGISTER_USER,
	});

	switch (displayMode) {
		case E_DISPLAY_MODES.USER:
			return (
				<main className={styles.root}>
					<div className={styles.scroll}>
						<div>
							<h1>Step 1:</h1>
							<h2>Create An Account</h2>
						</div>

						<div className={styles.form_wrapper}>
							<UserForm
								setDisplayMode={setDisplayMode}
								data={{ curr: userData, set: setUserData }}
							/>
						</div>
					</div>
				</main>
			);
		case E_DISPLAY_MODES.TEACHER:
			return (
				<main className={styles.root}>
					<div className={styles.scroll}>
						<div>
							<h1>Step 2:</h1>
							<h2>Enter Your Teacher Information</h2>
						</div>

						<div className={styles.form_wrapper}>
							<TeacherForm setTeacherData={setTeacherData} />
						</div>
					</div>
				</main>
			);
	}
};

export default Teach;
