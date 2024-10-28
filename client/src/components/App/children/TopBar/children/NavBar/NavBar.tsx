import { Link, useLocation } from "react-router-dom";
import styles from "./NavBar.module.scss";
import { USER_ROLES } from "../../../../../../utils/consts";
import { useCtxUser } from "../../../../../../contexts/UserProvider";

const NavBar: React.FC = () => {
	const user = useCtxUser();
	const userData = user.user.curr;

	const location = useLocation();

	return (
		<nav className={styles.root}>
			<div className={styles.scroll}>
				<Link to={"/"} className={`${styles.link} ${styles.name}`}>
					<h3 className={location.pathname === "/" ? styles.current : ""}>
						Home
					</h3>
				</Link>

				<Link to={"/game"} className={styles.link}>
					<h3 className={location.pathname === "/game" ? styles.current : ""}>
						Play
					</h3>
				</Link>

				<Link to={"/assignments"} className={styles.link}>
					<h3
						className={
							location.pathname === "/assignments" ? styles.current : ""
						}
					>
						Assignments
					</h3>
				</Link>

				<Link to={"/stats"} className={styles.link}>
					<h3 className={location.pathname === "/stats" ? styles.current : ""}>
						Stats
					</h3>
				</Link>

				{user.status.curr.is_logged_in &&
					userData.account.role === USER_ROLES.TEACHER && (
						<Link to={"/teacher/classes"} className={styles.link}>
							<h3
								className={
									location.pathname === "/teacher/classes" ? styles.current : ""
								}
							>
								Classes
							</h3>
						</Link>
					)}

				<Link to={"/settings"} className={styles.link}>
					<h3
						className={location.pathname === "/settings" ? styles.current : ""}
					>
						Settings
					</h3>
				</Link>

				<div className={styles.link}>
					<h3
						onClick={() => {
							user.status.set((c) => {
								return {
									...c,
									is_logged_in: false,
								};
							});
						}}
					>
						Logout
					</h3>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
