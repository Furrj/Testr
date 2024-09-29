import { getUserSessionDataFromStorage } from "../../../../utils/methods";
import { QUERY_KEYS } from "../../../../utils/consts";
import { useQuery } from "@tanstack/react-query";
import styles from "./Main.module.scss";
import { apiRequestGetClasses } from "../../../../../requests";
import Classes from "../Classes/Classes";
import Loading from "../../../Loading/Loading";

const Main: React.FC = () => {
  const { isPending, isSuccess, data } = useQuery({
    queryKey: [QUERY_KEYS.CLASSES],
    queryFn: () => apiRequestGetClasses(getUserSessionDataFromStorage()),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  if (isPending) {
    return <Loading />;
  } else if (!isPending && isSuccess && data.data !== undefined) {
    return (
      <div className={styles.root}>
        <Classes classes={data.data} />
      </div>
    );
  } else {
    return <div>Error, please refresh</div>;
  }
};

export default Main;
