import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./children/Landing/Landing";
import Login from "../../../Login/Login";
import Register from "../../../Register/Register";
import PasswordReset from "../../../Login/children/PasswordReset/PasswordReset";
import Payment from "../../../Payment/Payment";
import Completed from "../../../Payment/children/Completed/Completed";

const UnprotectedApp: React.FC = () => {
	return (
		<Routes>
			<Route path={"/"} element={<Landing />} />
			<Route path={"/login"} element={<Login />} />
			<Route path={"/register/*"} element={<Register />} />
			<Route path={"/password/reset"} element={<PasswordReset />} />
			<Route path={"/checkout"} element={<Payment />} />
			<Route path={"/checkout/completed"} element={<Completed />} />
			<Route path={"/*"} element={<Navigate to={"/"} replace />} />
		</Routes>
	);
};

export default UnprotectedApp;
