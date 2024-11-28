import { useCtxUser } from "../../services/ctx/UserProvider";
import Login from "../Login/Login";

const App: React.FC = () => {
	//const user = useCtxUser();

	return (
		<main>
			<Login />
		</main>
	);
};

export default App;
