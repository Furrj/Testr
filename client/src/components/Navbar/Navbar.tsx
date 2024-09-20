import styles from "./Navbar.module.scss";
import { clearTokensFromLocalStorage } from "../../utils/methods";
import { useQueryClient } from "@tanstack/react-query";
import { APP_VERSION, QUERY_KEYS } from "../../utils/consts";
import { useNavigate } from "react-router-dom";
import type { T_AUTH_STATUS } from "../../types";

interface IProps {
  data: T_AUTH_STATUS | undefined;
}

const Navbar: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <span className={styles.title}>
        <h1>Spelldle</h1>
      </span>
      <span className={styles.username}>
        {props.data !== undefined && props.data.valid && (
          <h2>{props.data.user_data.username}</h2>
        )}
      </span>
      <span className={styles.buttons}>
        {props.data !== undefined && props.data.valid ? (
          <button
            onClick={() => {
              clearTokensFromLocalStorage();
              queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.USER_DATA],
              });
              navigate("/login");
            }}
            className={styles.logout}
          >
            Logout
          </button>
        ) : (
          <>
            {/* <Link to={"/login"}>
							<button>Login</button>
						</Link>
						<Link to={"/register"}>
							<button>Register</button>
						</Link> */}
          </>
        )}
      </span>
    </div>
  );
};

export default Navbar;
