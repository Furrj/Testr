import { Route, Routes } from "react-router-dom";
import Account from "./children/Account/Account";
import ValidateEmail from "./children/ValidateEmail/ValidateEmail";
import Email from "./children/Email/Email";

const Teach: React.FC = () => {
	return (
		<Routes>
			<Route path={"/email"} element={<Email />} />
			<Route path={"/school"} element={<div>School</div>} />
			<Route path={"/validate"} element={<ValidateEmail />} />
		</Routes>
	);
};

export default Teach;
