import styles from "./App.module.scss";
import { Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../utils/consts";
import {
  clearTokensFromLocalStorage,
  getAuthStatus,
} from "../../utils/methods";
import ContentBox from "../ContentBox/ContentBox";
import VersionLabel from "./children/VersionLabel/VersionLabel";
import ProtectedApp from "./children/ProtectedApp/ProtectedApp";
import { T_AUTH_STATUS } from "../../types";
import Loading from "../Loading/Loading";
import LoginRegister from "./children/LoginRegister/LoginRegister";

const App: React.FC = () => {
  // fetch auth status if tokens in localstorage
  const { isPending, isSuccess, data } = useQuery({
    queryKey: [QUERY_KEYS.USER_DATA],
    queryFn: getAuthStatus,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const MainRoute = (
    isSuccess: boolean,
    isPending: boolean,
    data: T_AUTH_STATUS | undefined,
  ): JSX.Element => {
    if (!isPending && isSuccess) {
      if (data !== undefined && data.valid)
        return <ProtectedApp userData={data.user_data} />;
      else {
        clearTokensFromLocalStorage();
        return <LoginRegister />;
      }
    } else if (isPending) {
      return <Loading />;
    } else {
      clearTokensFromLocalStorage();
      return <LoginRegister />;
    }
  };

  return (
    <div className={styles.root}>
      <VersionLabel />
      <ContentBox>
        <Routes>
          <Route path="*" element={MainRoute(isSuccess, isPending, data)} />
        </Routes>
      </ContentBox>
    </div>
  );
};

export default App;
