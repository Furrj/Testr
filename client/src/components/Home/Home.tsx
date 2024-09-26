import styles from "./Home.module.scss";
import { useQuery } from "@tanstack/react-query";
import { apiRequestGetGameSessions } from "../../../requests";
import { QUERY_KEYS } from "../../utils/consts";
import { getUserSessionDataFromStorage } from "../../utils/methods";
import Loading from "../Loading/Loading";
import PastTest from "../PastTest/PastTest";
import { T_USERDATA_STATE } from "../../types";

interface IProps {
  userData: T_USERDATA_STATE;
}

const Home: React.FC<IProps> = (props) => {
  const { isSuccess, isPending, isFetching, data } = useQuery({
    queryKey: [QUERY_KEYS.USER_GAME_SESSIONS],
    queryFn: () => apiRequestGetGameSessions(getUserSessionDataFromStorage()),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  if (isPending) {
    return <Loading />;
  } else if (!isFetching && isSuccess && data) {
    return (
      <div className={styles.root}>
        <div className={styles.info}>
          <h2>
            {props.userData.first_name} {props.userData.last_name}
          </h2>
        </div>
        <div className={styles.past_tests}>
          {data.data.length > 0 &&
            data.data.map((session, i) => {
              return <PastTest key={`test-${i}`} session={session} />;
            })}
        </div>
        <div className={styles.nav}></div>
      </div>
    );
  } else return <div>Error</div>;
};

export default Home;
