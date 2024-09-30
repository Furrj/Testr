import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Student from "./children/Student/Student";
import Main from "./children/Main/Main";
import Class from "./children/Class/Class";

const Teacher: React.FC = () => {
  const [activeStudentID, setActiveStudentID] = useState<number>(-1);
  const [activeClassID, setActiveClassID] = useState<number>(-1);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Main
            activeClassID={{ curr: activeClassID, set: setActiveClassID }}
          />
        }
      />
      <Route path="/class" element={<Class id={activeClassID} />} />
      <Route path="/student" element={<Student user_id={activeStudentID} />} />
    </Routes>
  );
};

export default Teacher;
