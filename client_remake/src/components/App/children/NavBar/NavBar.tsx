import { Link, useLocation } from "react-router-dom";
import styles from "./NavBar.module.scss";
import { useUserDataQuery } from "../../../../queries/userData";
import { useAuthCtx } from "../../../../contexts/AuthProvider";

const NavBar: React.FC = () => {
	const authData = useAuthCtx();
	const { isSuccess, data } = useUserDataQuery(authData);
	const location = useLocation();

	return (
		<div className={styles.root}>
			<div className={styles.top}>
				<Link to={"/game"} className={styles.link}>
					<div className={location.pathname === "/game" ? styles.current : ""}>
						Play
					</div>
				</Link>

				<Link to={"/assignments"} className={styles.link}>
					<div
						className={
							location.pathname === "/assignments" ? styles.current : ""
						}
					>
						Assignments
					</div>
				</Link>

				<Link to={"/stats"} className={styles.link}>
					<div className={location.pathname === "/stats" ? styles.current : ""}>
						Stats
					</div>
				</Link>

				<Link to={"/teacher/classes"} className={styles.link}>
					<div
						className={
							location.pathname === "/teacher/classes" ? styles.current : ""
						}
					>
						Classes
					</div>
				</Link>
			</div>

			{isSuccess && data && (
				<div className={styles.bottom}>
					<Link to={"/"} className={styles.link}>
						<div>{data.data.user_data.username}</div>
					</Link>
				</div>
			)}
		</div>
	);
};

export default NavBar;
