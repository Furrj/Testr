import styles from "./Home.module.scss";
import { useCtxUser } from "../../contexts/UserProvider";

const Home: React.FC = () => {
	const user = useCtxUser();
	const userData = user.user.curr;

	//const { isSuccess, isPending, isFetching, data } = usePastTestsQuery(auth);

	return (
		<div className={styles.root}>
			<div className={styles.scroll}>
				<div className={styles.info}>
					<div>
						{userData.first_name} {userData.last_name}
					</div>
					<div>{userData.username}</div>
				</div>
				{/* <PastTests sessions={data} /> */}
			</div>
		</div>
	);
};

export default Home;
