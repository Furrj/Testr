import styles from "./User.module.scss";
import { useQuery } from "@tanstack/react-query";
import {
  apiRequestGetGameSessions,
  apiRequestGetUserInfo,
} from "../../../requests";
import { QUERY_KEYS } from "../../utils/consts";
import { getUserSessionDataFromStorage } from "../../utils/methods";
import Loading from "../Loading/Loading";
import PastTest from "../PastTest/PastTest";

export enum E_USER_MODES {
  HOME = 0,
  TEACHER,
}

interface IProps {
  user_id: number;
  mode: E_USER_MODES;
}

const User: React.FC<IProps> = (props) => {
  const { isSuccess, isPending, isFetching, data } = useQuery({
    queryKey: [QUERY_KEYS.USER_INFO],
    queryFn: () =>
      apiRequestGetUserInfo({
        tokens: getUserSessionDataFromStorage(),
        user_id: props.user_id,
      }),
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
            {data.data.user_data.first_name} {data.data.user_data.last_name}
          </h2>
        </div>
        <div className={styles.past_tests}>
          {data.data.sessions.length > 0 &&
            data.data.sessions.map((session, i) => {
              return <PastTest key={`test-${i}`} session={session} />;
            })}
        </div>
        <div className={styles.nav}></div>
      </div>
    );
  } else return <div>Error</div>;
};

export default User;
