import styles from "./Nav.module.scss";
import { Link } from "react-router-dom";
import { FaHome, FaPlay } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";
import { PiMathOperationsBold } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import type { T_USERDATA_STATE } from "../../../../types";
import { QUERY_KEYS, USER_ROLES } from "../../../../utils/consts";
import { useQueryClient } from "@tanstack/react-query";
import { clearTokensFromLocalStorage } from "../../../../utils/methods";

interface IProps {
  userData: T_USERDATA_STATE;
}

const Nav: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();

  return (
    <div className={styles.root}>
      <div className={styles.logo}>
        <PiMathOperationsBold className={styles.icon} />
        Mathy
      </div>

      <div className={styles.links}>
        {props.userData.role === USER_ROLES.TEACHER && (
          <Link to={"/teacher"} className={`${styles.link} ${styles.teacher}`}>
            <GiTeacher className={styles.icon} />
          </Link>
        )}
        <Link to={"/game"} className={styles.link}>
          <FaPlay className={styles.icon} />
        </Link>
        <Link to={"/"} className={styles.link}>
          <FaHome className={styles.icon} />
        </Link>
        <div
          className={styles.link}
          onClick={() => {
            clearTokensFromLocalStorage();
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.USER_DATA],
            });
          }}
        >
          <IoMdExit className={styles.icon} />
        </div>
      </div>
    </div>
  );
};

export default Nav;
