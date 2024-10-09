import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import {
  apiRequestGetPasswordResetCode,
  I_PARAMS_APIREQUEST_GET_PASSWORD_RESET_CODE,
  T_APIRESULT_GET_PASSWORD_RESET_CODE,
} from "../../../../../../../requests";
import { getUserSessionDataFromStorage } from "../../../../../../utils/methods";
import styles from "./ResetPassword.module.scss";

interface IProps {
  user_id: number;
}

const ResetPassword: React.FC<IProps> = (props) => {
  const { mutate, data, isSuccess } = useMutation({
    mutationFn: (
      params: I_PARAMS_APIREQUEST_GET_PASSWORD_RESET_CODE,
    ): Promise<AxiosResponse<T_APIRESULT_GET_PASSWORD_RESET_CODE>> => {
      return apiRequestGetPasswordResetCode(params);
    },
    onError(err) {
      console.log(err);
    },
    onSuccess(data) {
      console.log(data.data);
    },
  });

  if (isSuccess && data) {
    return (
      <div className={`${styles.root} ${styles.after}`}>
        Reset Code: {data.data.code}
      </div>
    );
  } else {
    return (
      <div
        className={`${styles.root} ${styles.before}`}
        onClick={() =>
          mutate({
            tokens: getUserSessionDataFromStorage(),
            user_id: props.user_id,
          })
        }
      >
        Reset Password
      </div>
    );
  }
};

export default ResetPassword;
