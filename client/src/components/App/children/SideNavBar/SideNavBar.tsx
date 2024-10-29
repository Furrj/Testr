import { Link } from "react-router-dom";
import styles from "./SideNavBar.module.scss";
import { IoMdSettings } from "react-icons/io";
import { useCtxUser } from "../../../../contexts/UserProvider";
import NavLinks from "../../../NavLinks/NavLinks";

const NavBar: React.FC = () => {
	const user = useCtxUser();
	const userData = user.user.curr;

	return (
		<nav className={styles.root}>
			<div className={styles.top}>
				<NavLinks />
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
