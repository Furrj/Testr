import { getAuthStatus } from "../../../../utils/methods";
import { QUERY_KEYS } from "../../../../utils/consts";
import { useQuery } from "@tanstack/react-query";
import styles from "./Main.module.scss";
import Loading from "../../../Loading/Loading";
import { Link } from "react-router-dom";

const Main: React.FC = () => {
  const { isFetching, isSuccess, data } = useQuery({
    queryKey: [QUERY_KEYS.USER_DATA],
    queryFn: getAuthStatus,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  if (isFetching) {
    return <Loading />;
  } else if (
    !isFetching &&
    isSuccess &&
    data !== undefined &&
    data !== undefined
  ) {
    return (
      <div className={styles.root}>
        <h2>
          {data.user_data.first_name} {data.user_data.last_name}
        </h2>
        <h2>Teacher Code: {data?.user_data.user_id}</h2>

        <div className={styles.links}>
          <div>
            <Link to={"/teachers/classes"} className={styles.link}>
              Classes
            </Link>
          </div>
          <div>
            <Link to={"/teachers/assignments"} className={styles.link}>
              Assignments
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Error, please refresh</div>;
  }
};

export default Main;
