import { Route, Routes } from "react-router-dom";
import Selection from "./children/Selection/Selection";
import { useState } from "react";
import Loading from "../Loading/Loading";
import Student from "./children/Student/Student";

const Teacher: React.FC = () => {
  const [activeStudentID, setActiveStudentID] = useState<number>(-1);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Selection
            activeStudentID={{ curr: activeStudentID, set: setActiveStudentID }}
          />
        }
      />
      <Route
        path="/student"
        element={
          activeStudentID !== -1 ? (
            <Student user_id={activeStudentID} />
          ) : (
            <Loading />
          )
        }
      />
    </Routes>
  );
};

export default Teacher;
