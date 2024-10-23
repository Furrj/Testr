import { useEffect, useState } from "react";
import styles from "./Teach.module.scss";
import { deepCopyObject } from "../../../../utils/methods";
import {
	T_FORM_REGISTER_TEACHER,
	T_FORM_REGISTER_USER,
	INIT_FORM_REGISTER_USER,
} from "../../../../types/register";
import UserForm from "../UserForm/UserForm";
import { E_DISPLAY_MODES } from "./Locals";

const Teach: React.FC = () => {
	const [displayMode, setDisplayMode] = useState<E_DISPLAY_MODES>(
		E_DISPLAY_MODES.USER,
	);
	const [data, setData] = useState<T_FORM_REGISTER_TEACHER | undefined>(
		undefined,
	);
	const [userData, setUserData] = useState<T_FORM_REGISTER_USER>(
		deepCopyObject(INIT_FORM_REGISTER_USER),
	);
	const [currentForm, setCurrentForm] = useState<JSX.Element>(
		<UserForm
			setDisplayMode={setDisplayMode}
			data={{ curr: userData, set: setUserData }}
		/>,
	);

	// change form based on displayMode
	useEffect(() => {
		switch (displayMode) {
			case E_DISPLAY_MODES.USER:
				setCurrentForm(
					<UserForm
						setDisplayMode={setDisplayMode}
						data={{ curr: userData, set: setUserData }}
					/>,
				);
				break;
			case E_DISPLAY_MODES.TEACHER:
				setCurrentForm(<div>Teacher</div>);
				break;
			case E_DISPLAY_MODES.CLASSES:
				setCurrentForm(<div>Classes</div>);
				break;
		}
	}, [displayMode]);

	return (
		<main className={styles.root}>
			<div className={styles.scroll}>
				<div>
					<h1>Step 1:</h1>
					<h2>Create An Account</h2>
				</div>

				<div className={styles.form_wrapper}>{currentForm}</div>
			</div>
		</main>
	);
};

export default Teach;
