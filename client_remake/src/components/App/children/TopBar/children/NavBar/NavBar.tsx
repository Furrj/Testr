import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./NavBar.module.scss";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../../utils/consts";
import {
	clearTokensFromLocalStorage,
	getAuthStatus,
} from "../../../../../../utils/methods";

const NavBar: React.FC = () => {
	const queryClient = useQueryClient();
	const { isSuccess, data } = useQuery({
		queryKey: [QUERY_KEYS.USER_DATA],
		queryFn: getAuthStatus,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<div className={styles.root}>
			<div className={styles.scroll}>
				{isSuccess && data && (
					<Link to={"/"} className={`${styles.link} ${styles.name}`}>
						<h3 className={location.pathname === "/" ? styles.current : ""}>
							{data.user_data.username}
						</h3>
					</Link>
				)}

				<Link to={"/game"} className={styles.link}>
					<h3 className={location.pathname === "/game" ? styles.current : ""}>
						Play
					</h3>
				</Link>

				<Link to={"/assignments"} className={styles.link}>
					<h3
						className={
							location.pathname === "/assignments" ? styles.current : ""
						}
					>
						Assignments
					</h3>
				</Link>

				<Link to={"/stats"} className={styles.link}>
					<h3 className={location.pathname === "/stats" ? styles.current : ""}>
						Stats
					</h3>
				</Link>

				<Link to={"/classes"} className={styles.link}>
					<h3>Classes</h3>
				</Link>

				<div className={styles.link}>
					<h3
						onClick={() => {
							clearTokensFromLocalStorage();
							queryClient.resetQueries();
							navigate("/login");
						}}
					>
						Logout
					</h3>
				</div>
			</div>
		</div>
	);
};

export default NavBar;
