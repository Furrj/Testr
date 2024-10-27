import styles from "./App.module.scss";
import { Route, Routes } from "react-router-dom";
import ContentBox from "../ContentBox/ContentBox";
import ProtectedApp from "./children/ProtectedApp/ProtectedApp";
import Loading from "../Loading/Loading";
import TopBar from "./children/TopBar/TopBar";
import UnprotectedApp from "./children/UnprotectedApp/UnprotectedApp";
import { useCtxUser } from "../../contexts/UserProvider";

const App: React.FC = () => {
	// get user data
	const ctxUser = useCtxUser();

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
				{ctxUser.isFetching || teacherDataQuery.isFetching ? (
					<Loading />
				) : (
					<Routes>
						{authData.valid && userDataQuery.isSuccess ? (
							<Route
								path="*"
								element={<ProtectedApp userData={userDataQuery.data.user} />}
							/>
						) : (
							<Route path="*" element={<UnprotectedApp />} />
						)}
					</Routes>
				)}
			</ContentBox>
		</div>
	);
};

export default App;
