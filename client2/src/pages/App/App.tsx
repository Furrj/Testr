import styles from "./App.module.scss";
import { useCtxUser } from "../../services/ctx/UserProvider";
import Login from "../Login/Login";
import Topbar from "../../components/Topbar/Topbar";

const App: React.FC = () => {
	//const user = useCtxUser();

	return (
		<div className={styles.root}>
			<Topbar />

			<main>
				<Login />
			</main>
		</div>
	);
};

export default App;
