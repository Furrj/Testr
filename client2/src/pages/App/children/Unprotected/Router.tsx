import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../../../Login/Login";

const Router: React.FC = () => {
	return (
		<Routes>
			<Route path={"/login"} element={<Login />} />
			<Route path={"/register"} element={<div>Register</div>} />
			<Route path={"*"} element={<div>Sign up</div>} />
		</Routes>
	);
};

export default Router;
