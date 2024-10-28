import { useState } from "react";
import styles from "./TopBar.module.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import NavBar from "./children/NavBar/NavBar";
import { IoMdExit } from "react-icons/io";
import { PiMathOperationsBold } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import { useCtxUser } from "../../../../contexts/UserProvider";

const TopBar: React.FC = () => {
	const user = useCtxUser();

	const [navbarIsExpanded, setNavbarIsExpanded] = useState<boolean>(false);

	const location = useLocation();

	return (
		<div className={styles.root}>
			<div className={styles.main}>
				<PiMathOperationsBold className={styles.icon} />
				<h1 className={styles.title}>TimesTrainer</h1>

				<div className={styles.right}>
					{user.status.curr.is_logged_in ? (
						<div className={styles.logged_in}>
							<IoMdExit
								onClick={() => {
									user.status.set((c) => {
										return {
											...c,
											is_logged_in: false,
										};
									});
								}}
								className={styles.logout}
							/>
							<GiHamburgerMenu
								onClick={() => setNavbarIsExpanded((curr) => !curr)}
								className={`${styles.hamburger} ${
									navbarIsExpanded ? styles.open : ""
								}`}
							/>
						</div>
					) : (
						<>
							{location.pathname !== "/login" && (
								<div className={styles.buttons}>
									<Link to={"/login"} className={"link"}>
										<button>Login</button>
									</Link>
								</div>
							)}
						</>
					)}
				</div>
			</div>

			{navbarIsExpanded && <NavBar />}
		</div>
	);
};

export default TopBar;
