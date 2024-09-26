import { getUserSessionDataFromStorage } from "../../../../utils/methods";
import { QUERY_KEYS } from "../../../../utils/consts";
import { apiRequestGetUserInfo } from "../../../../../requests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./Student.module.scss";
import { useEffect } from "react";

interface IProps {
  user_id: number;
}

const Student: React.FC<IProps> = (props) => {
  const queryClient = useQueryClient();
  const { isSuccess, isPending, isFetching, isError, error, data } = useQuery({
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

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENT_INFO] });
  }, [props.user_id]);

  isSuccess && data && console.log(data.data);
  isError && console.log(error);

  return <div className={styles.root}>Student</div>;
};

export default Student;
