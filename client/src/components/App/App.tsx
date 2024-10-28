import styles from "./App.module.scss";
import { Route, Routes } from "react-router-dom";
import ContentBox from "../ContentBox/ContentBox";
import Loading from "../Loading/Loading";
import TopBar from "./children/TopBar/TopBar";
import { useCtxUser } from "../../contexts/UserProvider";
import Game from "../Game/Game";
import Login from "../Login/Login";

const App: React.FC = () => {
	// get user data
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

			<ContentBox>
				{user.status.curr.is_fetching ? (
					<Loading />
				) : (
					<Routes>
						<Route path="/" element={<Game />} />
						<Route path="/login" element={<Login />} />
						{/* {authData.valid && userDataQuery.isSuccess ? ( */}
						{/*   <Route */}
						{/*     path="*" */}
						{/*     element={<ProtectedApp />} */}
						{/*   /> */}
						{/* ) : ( */}
						{/*   <Route path="*" element={<UnprotectedApp />} /> */}
						{/* )} */}
					</Routes>
				)}
			</ContentBox>
		</div>
	);
};

export default App;
