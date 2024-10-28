import { useState } from "react";
import styles from "./TopBar.module.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import NavBar from "./children/TopNavBar/TopNavBar";
import { IoMdExit } from "react-icons/io";
import { PiMathOperationsBold } from "react-icons/pi";
import { useLocation } from "react-router-dom";
import { useCtxUser } from "../../../../contexts/UserProvider";
import { useCtxUI } from "../../../../contexts/UIProvider";
import Login from "../../../Login/Login";

const TopBar: React.FC = () => {
	const user = useCtxUser();
	const uiCtx = useCtxUI();

	const [isNavbarShowing, setIsNavbarShowing] = useState<boolean>(false);

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
								onClick={user.status.logout}
								className={styles.logout}
							/>
							<GiHamburgerMenu
								onClick={() => setIsNavbarShowing((curr) => !curr)}
								className={`${styles.hamburger} ${
									isNavbarShowing ? styles.open : ""
								}`}
							/>
						</div>
					) : (
						<>
							{location.pathname !== "/login" && (
								<div className={styles.buttons}>
									<button
										onClick={() =>
											uiCtx.overlay.set((c) => {
												return {
													element: <Login />,
													is_showing: !c.is_showing,
												};
											})
										}
									>
										Login
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</div>

			{isNavbarShowing && <NavBar />}
		</div>
	);
};

export default TopBar;
