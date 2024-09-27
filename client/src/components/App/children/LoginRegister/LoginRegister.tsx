import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../../../Register/Register";
import Login from "../../../Login/Login";

const LoginRegister: React.FC = () => {
  return (
    <Routes>
      <Route path="/register/*" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<Navigate to={"/login"} replace />} />
    </Routes>
  );
};

export default LoginRegister;
