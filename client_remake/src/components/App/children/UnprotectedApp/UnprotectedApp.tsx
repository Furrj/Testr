import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./children/Landing/Landing";
import Login from "../../../Login/Login";
import Register from "../../../Register/Register";

const UnprotectedApp: React.FC = () => {
	return (
		<Routes>
			<Route path={"/"} element={<Landing />} />
			<Route path={"/login"} element={<Login />} />
			<Route path={"/register/*"} element={<Register />} />
			<Route path={"/*"} element={<Navigate to={"/"} replace />} />
		</Routes>
	);
};

export default UnprotectedApp;
