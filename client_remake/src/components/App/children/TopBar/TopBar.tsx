import { useState } from "react";
import styles from "./TopBar.module.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import NavBar from "./children/NavBar/NavBar";
import { IoMdExit } from "react-icons/io";
import { QUERY_KEYS } from "../../../../utils/consts";
import {
	clearTokensFromLocalStorage,
	getAuthStatus,
} from "../../../../utils/methods";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PiMathOperationsBold } from "react-icons/pi";
import { VscColorMode } from "react-icons/vsc";

const TopBar: React.FC = () => {
	const { isSuccess, data } = useQuery({
		queryKey: [QUERY_KEYS.USER_DATA],
		queryFn: getAuthStatus,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});

	const [showingNavbar, setShowingNavbar] = useState<boolean>(false);

	const queryClient = useQueryClient();

	return (
		<div className={styles.root}>
			<div className={styles.main}>
				<PiMathOperationsBold className={styles.icon} />
				<h1 className={styles.title}>Mathtestr</h1>

				<div className={styles.right}>
					{isSuccess && data.valid ? (
						<div className={styles.logged_in}>
							<IoMdExit
								onClick={() => {
									clearTokensFromLocalStorage();
									queryClient.invalidateQueries({
										queryKey: [QUERY_KEYS.USER_DATA],
									});
								}}
								className={styles.logout}
							/>
							<GiHamburgerMenu
								onClick={() => setShowingNavbar((curr) => !curr)}
								className={styles.hamburger}
							/>
						</div>
					) : (
						<div className={styles.buttons}>
							<button>Login</button>
							<button>Register</button>
						</div>
					)}
					<VscColorMode className={styles.theme} />
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
