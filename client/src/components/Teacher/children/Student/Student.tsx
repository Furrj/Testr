import { getUserSessionDataFromStorage } from "../../../../utils/methods";
import { QUERY_KEYS } from "../../../../utils/consts";
import { apiRequestGetUserInfo } from "../../../../../requests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./Student.module.scss";
import { useEffect } from "react";
import Loading from "../../../Loading/Loading";
import PastTest from "../../../PastTest/PastTest";
import { useNavigate } from "react-router-dom";

interface IProps {
  user_id: number;
}

const Student: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const { isSuccess, isPending, isFetching, data } = useQuery({
    queryKey: [QUERY_KEYS.STUDENT_INFO],
    queryFn: () =>
      apiRequestGetUserInfo({
        tokens: getUserSessionDataFromStorage(),
        user_id: props.user_id,
      }),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  console.log(props.user_id);

  // redirect to "/teacher" if user_id invalid
  const navigate = useNavigate();
  useEffect(() => {
    props.user_id <= 0 && navigate("/teacher");
  }, []);

  // re-fetch data on props.user_id change &&
  // leave if user_id invalid
  useEffect(() => {
    if (props.user_id <= 0) {
      navigate("/teacher");
    } else {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENT_INFO] });
    }
  }, [props.user_id]);

  if (isPending) {
    return <Loading />;
  } else if (!isFetching && isSuccess && data.data) {
    return (
      <div className={styles.root}>
        <div className={styles.info}></div>
        <h2>
          {data.data.user_data.first_name} {data.data.user_data.last_name}
        </h2>
        <div className={styles.past_tests}>
          {data.data.sessions.length > 0 &&
            data.data.sessions.map((session, i) => {
              return <PastTest key={`test-${i}`} session={session} />;
            })}
        </div>
        <div className={styles.nav}></div>
      </div>
    );
  } else {
    return <div>Error, please refresh</div>;
  }
};

export default Student;
