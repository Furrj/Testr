import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequestGetClass } from "../../../../../requests";
import { QUERY_KEYS } from "../../../../utils/consts";
import { getUserSessionDataFromStorage } from "../../../../utils/methods";
import styles from "./Class.module.scss";
import Loading from "../../../Loading/Loading";
import { Link } from "react-router-dom";
import { T_CLASS } from "../../../Register/Register";
import { useEffect } from "react";

interface IProps {
  info: T_CLASS;
  activeStudentID: {
    curr: number;
    set: React.Dispatch<React.SetStateAction<number>>;
  };
}

const Class: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const { isFetching, isSuccess, data } = useQuery({
    queryKey: [QUERY_KEYS.CLASS],
    queryFn: () =>
      apiRequestGetClass({
        tokens: getUserSessionDataFromStorage(),
        id: props.info.class_id,
      }),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    enabled: props.info.class_id > 0,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLASS] });
  }, [props.info]);

  if (isFetching) {
    return (
      <div className={styles.root}>
        <Loading />
      </div>
    );
  } else if (isSuccess && data.data !== undefined) {
    console.log(data.data);

    if (data.data.length > 0) {
      return (
        <div className={styles.root}>
          <h2 className={styles.title}>{props.info.name}</h2>
          <div className={styles.students}>
            <div className={styles.scroll}>
              {data.data.map((student) => {
                return (
                  <Link
                    className={styles.link}
                    to={"/teacher/student"}
                    key={`student-${student.user_id}`}
                    onClick={() => {
                      props.activeStudentID.set(student.user_id);
                      queryClient.invalidateQueries({
                        queryKey: [QUERY_KEYS.STUDENT_INFO],
                      });
                    }}
                  >
                    <div className={styles.student}>
                      {student.last_name}, {student.first_name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      );
    } else {
      return <div className={styles.root}>No students</div>;
    }
  }
};

export default Class;
