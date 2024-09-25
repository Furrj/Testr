import Teacher from "../Teacher/Teacher";
import User, { E_USER_MODES } from "../User/User";
import { Route, Routes } from "react-router-dom";

const TeacherRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Teacher />} />
    </Routes>
  );
};

export default TeacherRouter;
