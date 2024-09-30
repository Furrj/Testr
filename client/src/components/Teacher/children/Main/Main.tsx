import {
  getAuthStatus,
  getUserSessionDataFromStorage,
} from "../../../../utils/methods";
import { QUERY_KEYS } from "../../../../utils/consts";
import { useQuery } from "@tanstack/react-query";
import styles from "./Main.module.scss";
import { apiRequestGetClasses } from "../../../../../requests";
import Classes from "../Classes/Classes";
import Loading from "../../../Loading/Loading";

interface IProps {
  activeClassID: {
    curr: number;
    set: React.Dispatch<React.SetStateAction<number>>;
  };
}

const Main: React.FC<IProps> = (props) => {
  const { isPending, isSuccess, data } = useQuery({
    queryKey: [QUERY_KEYS.CLASSES],
    queryFn: () => apiRequestGetClasses(getUserSessionDataFromStorage()),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const teacherDataQuery = useQuery({
    queryKey: [QUERY_KEYS.USER_DATA],
    queryFn: getAuthStatus,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  if (isPending) {
    return <Loading />;
  } else if (!isPending && isSuccess && data.data !== undefined) {
    return (
      <div className={styles.root}>
        <h2>Teacher Code: {teacherDataQuery.data?.user_data.user_id}</h2>
        <Classes
          classes={data.data}
          activeClassID={{
            curr: props.activeClassID.curr,
            set: props.activeClassID.set,
          }}
        />
      </div>
    );
  } else {
    return <div>Error, please refresh</div>;
  }
};

export default Main;
