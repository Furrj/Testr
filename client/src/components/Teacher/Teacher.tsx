import { Route, Routes } from "react-router-dom";
import Selection from "./children/Selection/Selection";

const Teacher: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Selection />} />
      <Route path="/student" element={<div>info</div>} />
    </Routes>
  );
};

export default Teacher;
