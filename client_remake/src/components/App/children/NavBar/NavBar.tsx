import { Link } from "react-router-dom";
import styles from "./NavBar.module.scss";

const NavBar: React.FC = () => {
	return (
		<div className={styles.root}>
			<Link to={"/game"} className={styles.link}>
				<div>Play</div>
			</Link>

			<Link to={"/"} className={styles.link}>
				<div>Assignments</div>
			</Link>

			<Link to={"/"} className={styles.link}>
				<div>Stats</div>
			</Link>

			<Link to={"/"} className={styles.link}>
				<div>Class</div>
			</Link>

			<Link to={"/"} className={`${styles.link} ${styles.name}`}>
				<div>Name</div>
			</Link>
		</div>
	);
};

export default NavBar;
