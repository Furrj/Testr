import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../../utils/consts";
import { getUserSessionDataFromStorage } from "../../../../../../utils/methods";
import { T_CLASS } from "../../../../../Register/Register";
import styles from "./Assignments.module.scss";
import NewAssignment from "./children/NewAssignment/NewAssignment";
import { apiRequestGetAssignmentsTeacher } from "../../../../../../../requests";
import Loading from "../../../../../Loading/Loading";
import UIHandlers from "../../../../../../utils/uiHandlers";

interface IProps {
  classes: T_CLASS[];
}

const Assignments: React.FC<IProps> = (props) => {
  const { isFetching, isSuccess, data } = useQuery({
    queryKey: [QUERY_KEYS.TEACHER_ASSIGNMENTS],
    queryFn: () =>
      apiRequestGetAssignmentsTeacher(getUserSessionDataFromStorage()),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  if (isFetching) {
    return <Loading />;
  } else if (isSuccess && data && data.data !== undefined) {
    return (
      <div className={styles.root}>
        <div className={styles.ass_cont}>
          <div className={styles.assignments}>
            {data.data.map((a, i) => {
              return (
                <div key={`assignment-${i}`}>
                  {UIHandlers.convertUnixTimestamp(a.due)}
                </div>
              );
            })}
          </div>
        </div>

        <NewAssignment {...props} />
      </div>
    );
  } else {
    return <div>Error, please refresh</div>;
  }
};

export default Assignments;
