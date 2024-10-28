import styles from "./App.module.scss";
import { Navigate, Route, Routes } from "react-router-dom";
import ContentBox from "../ContentBox/ContentBox";
import Loading from "../Loading/Loading";
import TopBar from "./children/TopBar/TopBar";
import { useCtxUser } from "../../contexts/UserProvider";
import Game from "../Game/Game";
import NavBar from "./children/SideNavBar/SideNavBar";

const App: React.FC = () => {
	const user = useCtxUser();

	return (
		<div id="app_root" className={styles.root}>
			<TopBar />

			<div className={styles.main}>
				{user.status.curr.is_fetching ? (
					<Loading />
				) : (
					<>
						<NavBar />

						<ContentBox>
							<Routes>
								<Route path="/game" element={<Game />} />
								<Route path={"*"} element={<Navigate to={"/game"} replace />} />
							</Routes>
						</ContentBox>
					</>
				)}
			</div>
		</div>
	);
};

export default App;
