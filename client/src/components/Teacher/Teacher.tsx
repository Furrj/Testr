import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Student from "./children/Student/Student";
import Main from "./children/Main/Main";

const Teacher: React.FC = () => {
  const [activeStudentID, setActiveStudentID] = useState<number>(-1);

  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/class" />
      <Route path="/student" element={<Student user_id={activeStudentID} />} />
    </Routes>
  );
};

export default Teacher;
