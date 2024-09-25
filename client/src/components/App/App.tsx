import styles from "./App.module.scss";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, USER_ROLES } from "../../utils/consts";
import {
  clearTokensFromLocalStorage,
  getAuthStatus,
} from "../../utils/methods";
import { useEffect } from "react";
import Loading from "../Loading/Loading";
import ContentBox from "../ContentBox/ContentBox";
import Login from "../Login/Login";
import Register from "../Register/Register";
import VersionLabel from "./children/VersionLabel/VersionLabel";
import Game from "../Game/Game";
import Nav from "./children/Nav/Nav";
import Teacher from "../Teacher/Teacher";
import User, { E_USER_MODES } from "../User/User";

const App: React.FC = () => {
  // fetch auth status if tokens in localstorage
  const { isFetching, isFetched, isSuccess, error, data } = useQuery({
    queryKey: [QUERY_KEYS.USER_DATA],
    queryFn: getAuthStatus,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  // if auth invalid, send to login
  const navigate = useNavigate();
  useEffect(() => {
    if (!isFetching && isFetched) {
      if (!data || !data.valid || error) {
        clearTokensFromLocalStorage();
        navigate("/login");
      }
    }
  }, [isSuccess, isFetched, isFetching]);

  return (
    <div className={styles.root}>
      <VersionLabel />
      <ContentBox>
        <Routes>
          <Route
            path="/"
            element={<User user_id={0} mode={E_USER_MODES.HOME} />}
          />
          <Route path="/game/*" element={isFetching ? <Loading /> : <Game />} />
          <Route
            path="/teacher"
            element={
              data && data.user_data.role === USER_ROLES.TEACHER ? (
                <Teacher />
              ) : (
                <Loading />
              )
            }
          />
          <Route path="/teacher/student" element={<User user_id={2} mode={E_USER_MODES.TEACHER} />} />
          <Route path="/register/*" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to={"/"} replace />} />
        </Routes>
      </ContentBox>
      {data !== undefined && data.valid && <Nav userData={data.user_data} />}
    </div>
  );
};

export default App;
