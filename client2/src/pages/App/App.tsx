import styles from "./App.module.scss";
import { useCtxUser } from "../../services/ctx/UserProvider";
import Login from "../Login/Login";
import Topbar from "../../components/Topbar/Topbar";
import Protected from "./children/Protected/Router";
import Unprotected from "./children/Unprotected/Router";

const App: React.FC = () => {
	const userCtx = useCtxUser();

	return (
		<div className={styles.root}>
			<Topbar />

			<div className={styles.main}>
				{userCtx.curr.is_logged_in ? <Protected /> : <Unprotected />}
			</div>
		</div>
	);
};

export default App;
