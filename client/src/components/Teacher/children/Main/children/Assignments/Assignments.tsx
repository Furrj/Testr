import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../../utils/consts";
import { getUserSessionDataFromStorage } from "../../../../../../utils/methods";
import { T_CLASS } from "../../../../../Register/Register";
import styles from "./Assignments.module.scss";
import NewAssignment from "./children/NewAssignment/NewAssignment";
import { apiRequestGetAssignmentsTeacher } from "../../../../../../../requests";

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

  return (
    <div className={styles.root}>
      <button>Add</button>
      <NewAssignment {...props} />
    </div>
  );
};

export default Assignments;
