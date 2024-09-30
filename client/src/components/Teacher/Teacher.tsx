import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Student from "./children/Student/Student";
import Main from "./children/Main/Main";
import Class from "./children/Class/Class";
import { T_CLASS } from "../Register/Register";

const Teacher: React.FC = () => {
  const [activeStudentID, setActiveStudentID] = useState<number>(-1);
  const [activeClass, setActiveClass] = useState<T_CLASS | undefined>(
    undefined,
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Main activeClass={{ curr: activeClass, set: setActiveClass }} />
        }
      />
      <Route
        path="/class"
        element={
          activeClass !== undefined ? (
            <Class
              info={activeClass}
              activeStudentID={{
                curr: activeStudentID,
                set: setActiveStudentID,
              }}
            />
          ) : (
            <Navigate to={"/teacher"} replace />
          )
        }
      />
      <Route path="/student" element={<Student user_id={activeStudentID} />} />
    </Routes>
  );
};

export default Teacher;
