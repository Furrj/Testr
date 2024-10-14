import { Routes, Route, Navigate } from "react-router-dom";
import { T_USERDATA } from "../../../../types";
import { USER_ROLES } from "../../../../utils/consts";
import Game from "../../../Game/Game";
import Home from "../../../Home/Home";
import Loading from "../../../Loading/Loading";
import Classes from "../../../Teacher/children/Classes/Classes";

interface IProps {
	userData: T_USERDATA;
}

const ProtectedApp: React.FC<IProps> = (props) => {
	return (
		<>
			<Routes>
				<Route
					path="/"
					element={
						props.userData ? <Home userData={props.userData} /> : <Loading />
					}
				/>
				<Route
					path="/game/*"
					element={<Game vertical={props.userData.vertical} />}
				/>
				<Route
					path="/teacher/classes"
					element={
						props.userData.role === USER_ROLES.TEACHER ? (
							<Classes />
						) : (
							<Loading />
						)
					}
				/>
				<Route path="*" element={<Navigate to={"/"} replace />} />
			</Routes>
		</>
	);
};

export default ProtectedApp;
