import styles from "./Student.module.scss";
import { useForm } from "@tanstack/react-form";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  type T_USERINPUT_REGISTER,
  type T_APIRESULT_REGISTER,
  E_REGISTER_RESULT,
  INIT_USERINPUT_REGISTER,
} from "../../../../types";
import { QUERY_KEYS, USER_ROLES } from "../../../../utils/consts";
import { sendTokensToLocalStorage } from "../../../../utils/methods";
import { apiRequestRegister } from "../../../../utils/requests";

function isAlpha(input: string): boolean {
  let regex = /^[a-zA-Z]+$/;
  return regex.test(input);
}

const Student: React.FC = () => {
  const [errMessage, setErrMessage] = useState<string>("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (
      userInput: T_USERINPUT_REGISTER,
    ): Promise<AxiosResponse<T_APIRESULT_REGISTER>> => {
      return apiRequestRegister(userInput);
    },
    onError(err) {
      console.log(err);
      alert("Error, please refresh and try again");
    },
    onSuccess(data) {
      switch (data.data.result) {
        case E_REGISTER_RESULT.VALID:
          sendTokensToLocalStorage(data.data.tokens);
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_DATA] });
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GAME_SESSION_INFO],
          });
          navigate("/");
          break;
        case E_REGISTER_RESULT.USERNAME_EXISTS:
          setErrMessage(
            `Username '${form.getFieldValue("username")}' already exists`,
          );
      }
    },
  });

  const form = useForm<T_USERINPUT_REGISTER>({
    defaultValues: {
      ...INIT_USERINPUT_REGISTER,
    },
    onSubmit: ({ value }) => {
      const obj = {
        first_name: value.first_name.trim(),
        last_name: value.last_name.trim(),
        username: value.username.trim(),
        password: value.password.trim(),
        confirm_password: value.password.trim(),
        role: USER_ROLES.STUDENT,
        teacher_id: Number.parseInt(value.teacher_id as string),
        period: Number.parseInt(value.period as string),
        periods: 0,
      };
      //console.log(obj);
      mutate(obj);
    },
  });

  return (
    <form
      className={styles.root}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="first_name"
        children={(field) => (
          <>
            <h2>First Name</h2>
            <input
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={field.state.meta.errors.length > 0 ? styles.err : ""}
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
            if (!isAlpha(value) && value !== "") {
              return "Names can only contain letters";
            }

            return undefined;
          },
          onSubmit: ({ value }) => {
            return value === "" ? "Cannot be empty" : undefined;
          },
        }}
      />
      <form.Field
        name="last_name"
        children={(field) => (
          <>
            <h2>Last Name</h2>
            <input
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={field.state.meta.errors.length > 0 ? styles.err : ""}
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
            if (!isAlpha(value) && value !== "") {
              return "Names can only contain letters";
            }

            return undefined;
          },
          onSubmit: ({ value }) => {
            return value === "" ? "Cannot be empty" : undefined;
          },
        }}
      />
      <form.Field
        name="username"
        children={(field) => (
          <>
            <h2>Username</h2>
            <input
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={field.state.meta.errors.length > 0 ? styles.err : ""}
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
            if (value.includes(" ")) {
              return "Username cannot contain spaces";
            } else if (!isAlpha(value) && value !== "") {
              return "Username can only contain letters";
            }

            return undefined;
          },
          onSubmit: ({ value }) => {
            return value === "" ? "Cannot be empty" : undefined;
          },
        }}
      />
      <form.Field
        name="password"
        children={(field) => (
          <>
            <h2>Password</h2>
            <input
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={field.state.meta.errors.length > 0 ? styles.err : ""}
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
      <form.Field
        name="confirm_password"
        children={(field) => (
          <>
            <h2>Confirm Password</h2>
            <input
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={field.state.meta.errors.length > 0 ? styles.err : ""}
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
            if (value.includes(" ")) {
              return "Password cannot contain spaces";
            }

            return undefined;
          },
          onSubmit: ({ value, fieldApi }) => {
            if (value === "") {
              return "Cannot be empty";
            } else if (value !== fieldApi.form.getFieldValue("password")) {
              return "Passwords must match";
            }

            return undefined;
          },
        }}
      />
      <form.Field
        name="teacher_id"
        children={(field) => (
          <>
            <h2>Teacher ID</h2>
            <input
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={field.state.meta.errors.length > 0 ? styles.err : ""}
              type="number"
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
            if (Number.parseInt(value as string) < 0) {
              return "Cannot be negative";
            }

            return undefined;
          },
          onSubmit: ({ value }) => {
            if (value === "") {
              return "Cannot be empty";
            } else if (Number.isNaN(value as string)) {
              return "Invalid value";
            }

            return undefined;
          },
        }}
      />
      <form.Field
        name="period"
        children={(field) => (
          <>
            <h2>Period</h2>
            <input
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={field.state.meta.errors.length > 0 ? styles.err : ""}
              type="number"
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
            if (Number.parseInt(value as string) < 0) {
              return "Cannot be negative";
            }

            return undefined;
          },
          onSubmit: ({ value }) => {
            if (value === "") {
              return "Cannot be empty";
            } else if (Number.isNaN(value as string)) {
              return "Invalid value";
            }

            return undefined;
          },
        }}
      />
      {<div className={styles.err}>{errMessage}</div>}
      <button type="submit">Register</button>
    </form>
  );
};

export default Student;
