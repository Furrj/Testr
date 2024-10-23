import { useState } from "react";
import styles from "./Teach.module.scss";
import { deepCopyObject } from "../../../../utils/methods";
import {
	T_FORM_REGISTER_TEACHER,
	INIT_FORM_REGISTER_TEACHER,
	T_FORM_REGISTER_USER,
	INIT_FORM_REGISTER_USER,
} from "../../../../types/register";
import UserForm from "../UserForm/UserForm";

const Teach: React.FC = () => {
	const [data, setData] = useState<T_FORM_REGISTER_TEACHER>(
		deepCopyObject(INIT_FORM_REGISTER_TEACHER),
	);

	const [userData, setUserData] = useState<T_FORM_REGISTER_USER>(
		deepCopyObject(INIT_FORM_REGISTER_USER),
	);

	return (
		<main className={styles.root}>
			<div className={styles.scroll}>
				<h1>First Let's Create An Account</h1>

				<div className={styles.form_wrapper}>
					<UserForm data={{ curr: userData, set: setUserData }} />
				</div>
			</div>
		</main>
	);
};

export default Teach;
