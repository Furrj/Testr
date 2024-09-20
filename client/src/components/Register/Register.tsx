import { Routes, Route } from "react-router-dom";
import Student from "./children/Student/Student";
import Choose from "./children/Choose/Choose";
import Teacher from "./children/Teacher/Teacher";

const Register: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/student" element={<Student />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/" element={<Choose />} />
      </Routes>
    </>
  );
};

export default Register;
