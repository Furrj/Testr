import UserForm from "../../../UserForm/UserForm";
import { T_FORM_REGISTER_USER } from "../../../../../../types/register";
import { useState } from "react";
import styles from "./Account.module.scss";

const Account: React.FC = () => {
	const [accountData, setAccountData] = useState<
		T_FORM_REGISTER_USER | undefined
	>(undefined);

	return (
		<main className={styles.root}>
			<div className={styles.scroll}>
				<div>
					<h1>Step 1:</h1>
					<h2>Create An Account</h2>
				</div>

				<div className={styles.form_wrapper}></div>
			</div>
		</main>
	);
};

export default Account;
