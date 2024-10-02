import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Student from "./children/Student/Student";
import Main from "./children/Main/Main";
import Class from "./children/Class/Class";
import { T_CLASS } from "../Register/Register";
import MyClasses from "./children/Main/children/MyClasses/MyClasses";
import MyAssignments from "./children/Main/children/MyAssignments/MyAssignments";

const Teacher: React.FC = () => {
  const [activeStudentID, setActiveStudentID] = useState<number>(-1);
  const [activeClass, setActiveClass] = useState<T_CLASS | undefined>(
    undefined,
  );

  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route
        path="/classes"
        element={
          <MyClasses activeClass={{ curr: activeClass, set: setActiveClass }} />
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
      <Route path="/assignments" element={<MyAssignments />} />
      <Route
        path="/student"
        element={
          activeStudentID > 0 ? (
            <Student user_id={activeStudentID} />
          ) : (
            <Navigate to={"/teacher"} replace />
          )
        }
      />
    </Routes>
  );
};

export default Teacher;
