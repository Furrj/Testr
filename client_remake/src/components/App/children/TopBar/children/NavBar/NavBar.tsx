import { Link } from "react-router-dom";
import styles from "./NavBar.module.scss";

const NavBar: React.FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.scroll}>
        <Link to={"/"} className={`${styles.link} ${styles.name}`}>
          <h3>Name</h3>
        </Link>

        <Link to={"/game"} className={styles.link}>
          <h3>Play</h3>
        </Link>

        <Link to={"/"} className={styles.link}>
          <h3>Assignments</h3>
        </Link>

        <Link to={"/"} className={styles.link}>
          <h3>Stats</h3>
        </Link>

        <Link to={"/"} className={styles.link}>
          <h3>Class</h3>
        </Link>

        <div className={styles.link}>
          <h3>Logout</h3>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
