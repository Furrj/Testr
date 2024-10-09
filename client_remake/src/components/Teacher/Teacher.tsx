import { Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Student from "./children/Student/Student";
import Main from "./children/Main/Main";
import Class from "./children/Class/Class";
import { T_CLASS } from "../Register/Register";
import Classes from "./children/Main/children/Classes/Classes";
import Assignments from "./children/Main/children/Assignments/Assignments";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../utils/consts";
import { getUserSessionDataFromStorage } from "../../utils/methods";
import Loading from "../Loading/Loading";
import { apiRequestGetClasses } from "../../../requests";

const Teacher: React.FC = () => {
  const [activeStudentID, setActiveStudentID] = useState<number>(-1);
  const [activeClass, setActiveClass] = useState<T_CLASS | undefined>(
    undefined,
  );

  const { isFetching, isSuccess, data } = useQuery({
    queryKey: [QUERY_KEYS.CLASSES],
    queryFn: () => apiRequestGetClasses(getUserSessionDataFromStorage()),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  if (isFetching) {
    return (
      <Routes>
        <Route path="*" element={<Loading />} />
      </Routes>
    );
  } else if (isSuccess && data && data.data !== undefined) {
    return (
      <Routes>
        <Route path="/" element={<Main />} />
        <Route
          path="/classes"
          element={
            <Classes
              classes={data.data}
              activeClass={{ curr: activeClass, set: setActiveClass }}
            />
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
        <Route
          path="/assignments"
          element={<Assignments classes={data.data} />}
        />
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
  } else {
    return (
      <Routes>
        <Route path="*" element={<div>Error, please refresh</div>} />
      </Routes>
    );
  }
};

export default Teacher;
