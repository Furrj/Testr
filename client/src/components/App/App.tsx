import styles from "./App.module.scss";
import { Navigate, Route, Routes } from "react-router-dom";
import ContentBox from "../ContentBox/ContentBox";
import Loading from "../Loading/Loading";
import TopBar from "./children/TopBar/TopBar";
import { useCtxUser } from "../../contexts/UserProvider";
import Game from "../Game/Game";
import Login from "../Login/Login";
import NavBar from "./children/SideNavBar/SideNavBar";

const App: React.FC = () => {
	const user = useCtxUser();

	console.log("user:" + JSON.stringify(user.user.curr));
	console.log("status:" + JSON.stringify(user.status.curr));

	// fetch teacher data if user role == teacher
	// const teacherDataQuery = useTeacherDataQuery(
	// 	authData.tokens.curr,
	// 	authData.valid &&
	// 		userDataQuery.isSuccess &&
	// 		userDataQuery.data.user.role === USER_ROLES.TEACHER,
	// );

	return (
		<div className={styles.root}>
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
								<Route path="/login" element={<Login />} />
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
