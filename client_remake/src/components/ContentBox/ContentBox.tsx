import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../utils/consts";
import { getAuthStatus } from "../../utils/methods";
import NavBar from "../App/children/NavBar/NavBar";
import styles from "./ContentBox.module.scss";

interface IProps {
  children: React.ReactNode;
}

const ContentBox: React.FC<IProps> = (props) => {
  const { isSuccess, data } = useQuery({
    queryKey: [QUERY_KEYS.USER_DATA],
    queryFn: getAuthStatus,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return (
    <div className={styles.root}>
      {isSuccess && data.valid && <NavBar />}
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

export default ContentBox;
