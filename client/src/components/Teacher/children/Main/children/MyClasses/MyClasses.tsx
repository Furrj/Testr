import { useRef, useState } from "react";
import styles from "./MyClasses.module.scss";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import {
  apiRequestAddClass,
  apiRequestGetClasses,
  I_PARAMS_APIREQUEST_ADD_CLASS,
} from "../../../../../../../requests";
import { Link } from "react-router-dom";
import { QUERY_KEYS } from "../../../../../../utils/consts";
import { getUserSessionDataFromStorage } from "../../../../../../utils/methods";
import type { T_CLASS } from "../../../../../Register/Register";
import Loading from "../../../../../Loading/Loading";

interface IProps {
  activeClass: {
    curr: T_CLASS | undefined;
    set: React.Dispatch<React.SetStateAction<T_CLASS | undefined>>;
  };
}

const MyClasses: React.FC<IProps> = (props) => {
  const [addingMode, setAddingMode] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (
      params: I_PARAMS_APIREQUEST_ADD_CLASS,
    ): Promise<AxiosResponse> => {
      return apiRequestAddClass(params);
    },
    onError(err) {
      console.log(err);
      alert("Error, please refresh and try again");
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLASSES] });
    },
  });

  const { isFetching, isSuccess, data } = useQuery({
    queryKey: [QUERY_KEYS.CLASSES],
    queryFn: () => apiRequestGetClasses(getUserSessionDataFromStorage()),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  if (isFetching) {
    return <Loading />;
  } else if (isSuccess && data && data.data !== undefined) {
    return (
      <div className={styles.root}>
        <h2>My Classes</h2>
        <div className={styles.content}>
          <div className={styles.scroll}>
            {data.data.length > 0 &&
              data.data.map((c) => (
                <Link
                  to={"/teacher/class"}
                  onClick={() => {
                    props.activeClass.set(c);
                    // queryClient.invalidateQueries({
                    //   queryKey: [QUERY_KEYS.CLASS],
                    // });
                  }}
                  key={`class-${c.class_id}`}
                  className={styles.link}
                >
                  <div className={styles.box}>{c.name}</div>
                </Link>
              ))}
            {addingMode ? (
              <div className={`${styles.new}`}>
                <input
                  className={styles.text}
                  type="text"
                  placeholder="Class Name"
                  ref={inputRef}
                />
                <button
                  onClick={() => {
                    if (inputRef.current) {
                      mutation.mutate({
                        c: { name: inputRef.current.value, class_id: 0 },
                        tokens: getUserSessionDataFromStorage(),
                      });
                      setAddingMode(false);
                      inputRef.current.value = "";
                    }
                  }}
                >
                  +
                </button>
              </div>
            ) : (
              <div className={styles.box} onClick={() => setAddingMode(true)}>
                +
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else return <div>Error please refresh</div>;
};

export default MyClasses;
