import { useState } from "react";
import styles from "./Teach.module.scss";
import { deepCopyObject } from "../../../../utils/methods";
import {
	T_FORM_REGISTER_TEACHER,
	INIT_FORM_REGISTER_TEACHER,
} from "../../../../types/register";

const Teach: React.FC = () => {
	const [data, setData] = useState<T_FORM_REGISTER_TEACHER>(
		deepCopyObject(INIT_FORM_REGISTER_TEACHER),
	);

	return (
		<main className={styles.root}>
			<div className={styles.scroll}>
				<h1>Let's Get Some Information</h1>
			</div>
		</main>
	);
};

export default Teach;
