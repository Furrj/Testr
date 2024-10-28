import { Link } from "react-router-dom";
import styles from "./NavBar.module.scss";
import { USER_ROLES } from "../../../../utils/consts";
import { IoMdSettings } from "react-icons/io";
import { useCtxUser } from "../../../../contexts/UserProvider";

const NavBar: React.FC = () => {
	const user = useCtxUser();
	const userData = user.user.curr;

	return (
		<nav className={styles.root}>
			<div className={styles.top}>
				<Link to={"/"} className={styles.link}>
					<div className={location.pathname === "/" ? styles.current : ""}>
						Home
					</div>
				</Link>

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

				{user.status.curr.is_logged_in &&
					userData.role === USER_ROLES.TEACHER && (
						<Link to={"/teacher/classes"} className={styles.link}>
							<div
								className={
									location.pathname === "/teacher/classes" ? styles.current : ""
								}
							>
								Classes
							</div>
						</Link>
					)}
			</div>

			<div className={styles.bottom}>
				<div className={styles.link}>
					<div id={styles.username}>
						{user.status.curr.is_logged_in ? (
							<span>{userData.username}</span>
						) : (
							<span>Guest</span>
						)}
						<Link to={"/settings"}>
							<IoMdSettings />
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
