import styles from "./App.module.scss";
import { Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../utils/consts";
import { getAuthStatus } from "../../utils/methods";
import ContentBox from "../ContentBox/ContentBox";
import ProtectedApp from "./children/ProtectedApp/ProtectedApp";
import Loading from "../Loading/Loading";
import TopBar from "./children/TopBar/TopBar";
import UnprotectedApp from "./children/UnprotectedApp/UnprotectedApp";

const App: React.FC = () => {
	// fetch auth status if tokens in localstorage
	const { isFetching, isSuccess, data } = useQuery({
		queryKey: [QUERY_KEYS.USER_DATA],
		queryFn: getAuthStatus,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});

	return (
		<div className={styles.root}>
			<TopBar />

			{/* <VersionLabel /> */}

			<ContentBox>
				{isFetching ? (
					<Loading />
				) : (
					<Routes>
						{isSuccess && data && data.valid ? (
							<Route
								path="*"
								element={<ProtectedApp userData={data.user_data} />}
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
