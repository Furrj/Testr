import styles from "./App.module.scss";
import { Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, USER_ROLES } from "../../utils/consts";
import { getAuthStatus } from "../../utils/methods";
import ContentBox from "../ContentBox/ContentBox";
import ProtectedApp from "./children/ProtectedApp/ProtectedApp";
import Loading from "../Loading/Loading";
import TopBar from "./children/TopBar/TopBar";
import UnprotectedApp from "./children/UnprotectedApp/UnprotectedApp";

const App: React.FC = () => {
	// fetch auth status if tokens in localstorage
	const authData = useQuery({
		queryKey: [QUERY_KEYS.USER_DATA],
		queryFn: getAuthStatus,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});

	// fetch teacher data if user role == teacher
	const teacherData = useQuery({
		queryKey: [QUERY_KEYS.TEACHER_DATA],
		queryFn: getAuthStatus,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
		enabled:
			authData.isSuccess && authData.data.user_data.role === USER_ROLES.TEACHER,
	});

	return (
		<div className={styles.root}>
			<TopBar />

			<ContentBox>
				{authData.isFetching ? (
					<Loading />
				) : (
					<Routes>
						{authData.isSuccess && authData.data && authData.data.valid ? (
							<Route
								path="*"
								element={<ProtectedApp userData={authData.data.user_data} />}
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
