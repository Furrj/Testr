import styles from "./TopNavBar.module.scss";
import NavLinks from "../../../../../NavLinks/NavLinks";

const TopNavBar: React.FC = () => {
	return (
		<nav className={styles.root}>
			<div className={styles.scroll}>
				<NavLinks />
			</div>
		</nav>
	);
};

export default TopNavBar;
