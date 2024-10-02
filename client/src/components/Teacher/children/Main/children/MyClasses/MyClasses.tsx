import { useRef, useState } from "react";
import styles from "./MyClasses.module.scss";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import {
  apiRequestAddClass,
  I_PARAMS_APIREQUEST_ADD_CLASS,
} from "../../../../../../../requests";
import { Link } from "react-router-dom";
import { QUERY_KEYS } from "../../../../../../utils/consts";
import { getUserSessionDataFromStorage } from "../../../../../../utils/methods";
import type { T_CLASS } from "../../../../../Register/Register";

interface IProps {
  activeClass: {
    curr: T_CLASS | undefined;
    set: React.Dispatch<React.SetStateAction<T_CLASS | undefined>>;
  };
  classes: T_CLASS[];
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

  return (
    <div className={styles.root}>
      <h2>My Classes</h2>
      <div className={styles.content}>
        <div className={styles.scroll}>
          {props.classes.length > 0 &&
            props.classes.map((c) => (
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
};

export default MyClasses;
