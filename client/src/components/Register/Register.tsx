import { Routes, Route } from "react-router-dom";
import Student from "./children/Student/Student";
import Choose from "./children/Choose/Choose";
import Teacher from "./children/Teacher/Teacher";

export type T_FORM_REGISTER_USER = {
  username: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
};
export const INIT_FORM_REGISTER_USER: T_FORM_REGISTER_USER = {
  username: "",
  password: "",
  confirm_password: "",
  first_name: "",
  last_name: "",
};

export type T_FORM_REGISTER_STUDENT = {
  teacher_id: number;
  class_id: number;
};
export const INIT_FORM_REGISTER_STUDENT: T_FORM_REGISTER_STUDENT = {
  teacher_id: -1,
  class_id: -1,
};

export type T_FORM_REGISTER_TEACHER = {
  email: string;
  school: string;
  classes: T_CLASS[];
};
export const INIT_FORM_REGISTER_TEACHER: T_FORM_REGISTER_TEACHER = {
  email: "",
  school: "",
  classes: [],
};

export type T_CLASS = {
  name: string;
  class_id: number;
};

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
