import { Route, Routes } from "react-router-dom";
import Account from "./children/Account/Account";
import ValidateEmail from "./children/ValidateEmail/ValidateEmail";

const Teach: React.FC = () => {
	return (
		<Routes>
			<Route path={"/account"} element={<Account />} />
			<Route path={"/school"} element={<div>School</div>} />
			<Route path={"/validate"} element={<ValidateEmail />} />
		</Routes>
	);
};

export default Teach;
