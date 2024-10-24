import { Route, Routes } from "react-router-dom";
import Account from "./children/Account/Account";

const Teach: React.FC = () => {
	return (
		<Routes>
			<Route path={"/account"} element={<Account />} />
			<Route path={"/school"} element={<div>School</div>} />
		</Routes>
	);
};

export default Teach;
