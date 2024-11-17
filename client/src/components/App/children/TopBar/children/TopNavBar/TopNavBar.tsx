import styles from "./TopNavBar.module.scss";
import NavLinks from "../../../../../NavLinks/NavLinks";
import { useCtxUI } from "../../../../../../contexts/UIProvider";
import Login from "../../../../../Login/Login";
import { useCtxUser } from "../../../../../../contexts/UserProvider";

const TopNavBar: React.FC = () => {
	const userCtx = useCtxUser();
	const uiCtx = useCtxUI();

	return (
		<nav className={styles.root}>
			<div className={styles.scroll}>
				<NavLinks />

				{userCtx.status.curr.is_logged_in ? null : (
					<div
						className={styles.link}
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
					</div>
				)}
			</div>
		</nav>
	);
};

export default TopNavBar;
