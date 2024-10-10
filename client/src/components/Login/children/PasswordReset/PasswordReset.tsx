import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./PasswordReset.module.scss";
import {
  apiRequestCheckPasswordResetCode,
  apiRequestUpdatePassword,
  I_PARAMS_APIREQUEST_CHECK_PASSWORD_RESET_CODE,
  I_PARAMS_APIREQUEST_UPDATE_PASSWORD,
} from "../../../../../requests";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import { sendTokensToLocalStorage } from "../../../../utils/methods";

enum E_DISPLAY_STATE {
  INIT = 0,
  INFO,
  FORM,
}

const PasswordReset: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [displayState, setDisplayState] = useState<E_DISPLAY_STATE>(
    E_DISPLAY_STATE.INIT,
  );
  const [error, setError] = useState<string>("");

  const codeSearchMutation = useMutation({
    mutationFn: (params: I_PARAMS_APIREQUEST_CHECK_PASSWORD_RESET_CODE) => {
      return apiRequestCheckPasswordResetCode(params);
    },
    onError(err) {
      console.log(err);
      setDisplayState(E_DISPLAY_STATE.INIT);
      setError("Code not found");
      setCode("");
    },
    onSuccess() {
      setDisplayState(E_DISPLAY_STATE.INFO);
      setError("");
      codeForm.reset();
    },
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const passwordUpdateMutation = useMutation({
    mutationFn: (params: I_PARAMS_APIREQUEST_UPDATE_PASSWORD) => {
      return apiRequestUpdatePassword(params);
    },
    onError(err) {
      console.log(err);
      setError("Error encountered, please try again");
    },
    onSuccess(data) {
      sendTokensToLocalStorage(data.data);
      queryClient.resetQueries();
      navigate("/");
    },
  });

  type T_CODE_FORM = {
    username: string;
    code: string;
  };
  const codeForm = useForm<T_CODE_FORM>({
    defaultValues: {
      username: "",
      code: "",
    },
    onSubmit: ({ value }) => {
      setCode(value.code.trim());
      codeSearchMutation.mutate({
        code: value.code.trim(),
        username: value.username.trim(),
      });
    },
  });

  type T_PASSWORD_FORM = {
    password: string;
    confirm_password: string;
  };
  const passwordForm = useForm<T_PASSWORD_FORM>({
    defaultValues: {
      password: "",
      confirm_password: "",
    },
    onSubmit: ({ value }) => {
      if (value.password.trim() !== value.confirm_password.trim()) {
        setError("Passwords must be identical");
      } else
        passwordUpdateMutation.mutate({
          code: code,
          password: value.password.trim(),
        });
    },
  });

  return (
    <div className={styles.root}>
      {displayState === E_DISPLAY_STATE.INIT && (
        <form
          className={styles.init}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            codeForm.handleSubmit();
          }}
        >
          <codeForm.Field
            name="username"
            children={(field) => (
              <>
                <h2>Username</h2>
                <input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={
                    field.state.meta.errors.length > 0 ? styles.err : ""
                  }
                  type="text"
                />
                {field.state.meta.errors ? (
                  <div className={styles.err}>
                    {field.state.meta.errors.join(", ")}
                  </div>
                ) : null}
              </>
            )}
            validators={{
              onSubmit: ({ value }) => {
                return value === "" ? "Cannot be empty" : undefined;
              },
            }}
          />

          <codeForm.Field
            name="code"
            children={(field) => (
              <>
                <h2>Reset Code</h2>
                <input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={
                    field.state.meta.errors.length > 0 ? styles.err : ""
                  }
                  type="text"
                />
                {field.state.meta.errors ? (
                  <div className={styles.err}>
                    {field.state.meta.errors.join(", ")}
                  </div>
                ) : null}
              </>
            )}
            validators={{
              onSubmit: ({ value }) => {
                return value === "" ? "Cannot be empty" : undefined;
              },
            }}
          />

          {error && <div className={styles.err}>{error}</div>}
          <button type="submit">Search</button>
        </form>
      )}

      {displayState === E_DISPLAY_STATE.INFO &&
        codeSearchMutation.isSuccess &&
        codeSearchMutation.data && (
          <div className={styles.user_info}>
            <div className={styles.prompt}>Is this you?</div>
            <div className={styles.box}>
              <div>
                {codeSearchMutation.data.data.first_name}{" "}
                {codeSearchMutation.data.data.last_name}
              </div>
              <div>{codeSearchMutation.data.data.username}</div>
              <div className={styles.icons}>
                <FaCheckCircle
                  className={styles.check}
                  onClick={() => setDisplayState(E_DISPLAY_STATE.FORM)}
                />
                <MdCancel
                  className={styles.cancel}
                  onClick={() => {
                    setCode("");
                    setDisplayState(E_DISPLAY_STATE.INIT);
                  }}
                />
              </div>
            </div>
          </div>
        )}

      {displayState === E_DISPLAY_STATE.FORM && (
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            passwordForm.handleSubmit();
          }}
        >
          <passwordForm.Field
            name="password"
            children={(field) => (
              <>
                <h2>New Password</h2>
                <input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={
                    field.state.meta.errors.length > 0 ? styles.err : ""
                  }
                  type="password"
                />
                {field.state.meta.errors ? (
                  <div className={styles.err}>
                    {field.state.meta.errors.join(", ")}
                  </div>
                ) : null}
              </>
            )}
            validators={{
              onChange: ({ value }) => {
                return value.includes(" ")
                  ? "Password cannot contain spaces"
                  : undefined;
              },
              onSubmit: ({ value }) => {
                return value === "" ? "Cannot be empty" : undefined;
              },
            }}
          />

          <passwordForm.Field
            name="confirm_password"
            children={(field) => (
              <>
                <h2>Confirm Password</h2>
                <input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={
                    field.state.meta.errors.length > 0 ? styles.err : ""
                  }
                  type="password"
                />
                {field.state.meta.errors ? (
                  <div className={styles.err}>
                    {field.state.meta.errors.join(", ")}
                  </div>
                ) : null}
              </>
            )}
            validators={{
              onChange: ({ value }) => {
                return value.includes(" ")
                  ? "Password cannot contain spaces"
                  : undefined;
              },
              onSubmit: ({ value }) => {
                return value === "" ? "Cannot be empty" : undefined;
              },
            }}
          />

          {error && <div className={styles.err}>{error}</div>}
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default PasswordReset;
