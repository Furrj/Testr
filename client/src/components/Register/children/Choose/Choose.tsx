import styles from "./Choose.module.scss";
import { Link } from "react-router-dom";

const Choose: React.FC = () => {
	return (
		<main className={styles.root}>
			<div className={styles.scroll}>
				<section className={styles.prompt}>Which are you?</section>

				<section className={styles.links}>
					<Link className={`link ${styles.link}`} to={"/register/student"}>
						Student
					</Link>
					<Link
						className={`link ${styles.link}`}
						to={"/register/teacher/email"}
					>
						Teacher
					</Link>
				</section>
			</div>
		</main>
	);
};

export default Choose;
