import { useForm } from "@tanstack/react-form";
import {
  INIT_FORM_REGISTER_STUDENT,
  type T_FORM_REGISTER_STUDENT,
} from "../../../../Register";
import styles from "./UserForm.module.scss";
import { useState } from "react";

function isAlpha(input: string): boolean {
  let regex = /^[a-zA-Z]+$/;
  return regex.test(input);
}

interface IProps {
  formData: {
    curr: T_FORM_REGISTER_STUDENT;
    set: React.Dispatch<React.SetStateAction<T_FORM_REGISTER_STUDENT>>;
  };
  teacherMode: {
    curr: boolean;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

const UserForm: React.FC<IProps> = (props) => {
  const [errMessage, setErrMessage] = useState<string>("");

  const form = useForm<T_FORM_REGISTER_STUDENT>({
    defaultValues: {
      ...INIT_FORM_REGISTER_STUDENT,
    },
    onSubmit: ({ value }) => {
      const obj: T_FORM_REGISTER_STUDENT = {
        first_name: value.first_name.trim(),
        last_name: value.last_name.trim(),
        username: value.username.trim(),
        password: value.password.trim(),
        confirm_password: value.password.trim(),
        class_id: 0,
        teacher_id: 0,
      };
      props.formData.set(obj);
      props.teacherMode.set(true);
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
              autoComplete="first_name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={field.state.meta.errors.length > 0 ? styles.err : ""}
              type="text"
              inputMode="text"
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
              autoComplete="last_name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={field.state.meta.errors.length > 0 ? styles.err : ""}
              type="text"
              inputMode="text"
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
              autoComplete="username"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={field.state.meta.errors.length > 0 ? styles.err : ""}
              type="text"
              inputMode="text"
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
              autoComplete="new-password"
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
              autoComplete="new-password"
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
      {<div className={styles.err}>{errMessage}</div>}
      <button type="submit">Next</button>
    </form>
  );
};

export default UserForm;
