import styles from "./App.module.scss";
import { Route, Routes } from "react-router-dom";
import ContentBox from "../ContentBox/ContentBox";
import ProtectedApp from "./children/ProtectedApp/ProtectedApp";
import Loading from "../Loading/Loading";
import TopBar from "./children/TopBar/TopBar";
import UnprotectedApp from "./children/UnprotectedApp/UnprotectedApp";
import Locals from "./Locals";
import { useAuthCtx } from "../../contexts/AuthProvider";
import { useUserDataQuery } from "../../queries/userData";

const App: React.FC = () => {
	// get auth status
	const authData = useAuthCtx();
	console.log(authData);

	// get user info
	const userDataQuery = useUserDataQuery(authData);

	// fetch teacher data if user role == teacher
	const teacherDataQuery = Locals.useTeacherDataQuery(
		authData.tokens.curr,
		authData.valid,
	);

	return (
		<div className={styles.root}>
			<TopBar />

			<ContentBox>
				{userDataQuery.isFetching || teacherDataQuery.isFetching ? (
					<Loading />
				) : (
					<Routes>
						{authData.valid && userDataQuery.isSuccess ? (
							<Route
								path="*"
								element={
									<ProtectedApp userData={userDataQuery.data.data.user_data} />
								}
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
