import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../../../Login/Login";

const Router: React.FC = () => {
	return (
		<Routes>
			<Route path={"/login"} element={<Login />} />
			<Route path={"/register"} element={<Login />} />
			<Route path={"*"} element={<div>home</div>} />
		</Routes>
	);
};

export default Router;
