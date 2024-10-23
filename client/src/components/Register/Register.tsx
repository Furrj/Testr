import { Routes, Route } from "react-router-dom";
import Student from "./children/Student/Student";
import Choose from "./children/Choose/Choose";
import Teach from "./children/Teach/Teach";

const Register: React.FC = () => {
	return (
		<Routes>
			<Route path="/student" element={<Student />} />
			<Route path="/teacher" element={<Teach />} />
			<Route path="/" element={<Choose />} />
		</Routes>
	);
};

export default Register;
