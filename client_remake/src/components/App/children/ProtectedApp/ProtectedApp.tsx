import { Routes, Route, Navigate } from "react-router-dom";
import { T_USERDATA_STATE } from "../../../../types";
import { USER_ROLES } from "../../../../utils/consts";
import Game from "../../../Game/Game";
import Home from "../../../Home/Home";
import Loading from "../../../Loading/Loading";
import Teacher from "../../../Teacher/Teacher";

interface IProps {
	userData: T_USERDATA_STATE;
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
					path="/teacher/*"
					element={
						props.userData.role === USER_ROLES.TEACHER ? (
							<Teacher />
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
