import styles from "./App.module.scss";
import Navbar from "../Navbar/Navbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../utils/consts";
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
import Home from "../Home/Home";

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
      <Navbar data={data} />
      <VersionLabel />
      <ContentBox>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/*" element={isFetching ? <Loading /> : <Game />} />
          <Route path="/register/*" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </ContentBox>
    </div>
  );
};

export default App;
