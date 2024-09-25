import { useQuery } from "@tanstack/react-query";
import { apiRequestGetGameSessions } from "../../../requests";
import { QUERY_KEYS } from "../../utils/consts";
import styles from "./Home.module.scss";
import { getUserSessionDataFromStorage } from "../../utils/methods";
import Loading from "../Loading/Loading";

const Home: React.FC = () => {
  const { isSuccess, isPending, error, data } = useQuery({
    queryKey: [QUERY_KEYS.USER_GAME_SESSIONS],
    queryFn: () => apiRequestGetGameSessions(getUserSessionDataFromStorage()),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  isSuccess && console.log(data.data);

  if (isPending) {
    return <Loading />;
  } else if (error) {
    return <div>Error</div>;
  } else {
    return <div className={styles.root}>Home</div>;
  }
};

export default Home;
