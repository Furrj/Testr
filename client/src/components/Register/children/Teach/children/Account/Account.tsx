import styles from "./Account.module.scss";
import TeacherForm from "../TeacherForm/TeacherForm";

const Account: React.FC = () => {
	return (
		<main className={styles.root}>
			<div className={styles.scroll}>
				<div>
					<h1>Step 1: Create Account</h1>
				</div>

				<div className={styles.form_wrapper}>
					<TeacherForm />
				</div>
			</div>
		</main>
	);
};

export default Account;
