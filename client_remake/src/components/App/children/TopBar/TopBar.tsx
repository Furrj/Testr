import { useState } from "react";
import styles from "./TopBar.module.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import NavBar from "./children/NavBar/NavBar";
import { IoMdExit } from "react-icons/io";

const TopBar: React.FC = () => {
	const [showingNavbar, setShowingNavbar] = useState<boolean>(false);

	return (
		<div className={styles.root}>
			<div className={styles.main}>
				<h1 className={styles.title}>Mathtestr</h1>

				<div className={styles.right}>
					<IoMdExit className={styles.logout} />
					<GiHamburgerMenu
						onClick={() => setShowingNavbar((curr) => !curr)}
						className={styles.hamburger}
					/>
				</div>
			</div>

			{showingNavbar && (
				<div className={styles.navbar}>
					<NavBar />
				</div>
			)}
		</div>
	);
};

export default TopBar;
