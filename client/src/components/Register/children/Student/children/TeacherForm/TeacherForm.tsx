import { useForm } from "@tanstack/react-form";
import {
  type T_FORM_REGISTER_STUDENT,
  INIT_FORM_REGISTER_STUDENT,
} from "../../../../Register";
import styles from "./TeacherForm.module.scss";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import {
  apiRequestGetTeacherInfo,
  apiRequestRegisterStudent,
  T_APIRESULT_GET_TEACHER_INFO,
} from "../../../../../../../requests";
import { T_APIRESULT_REGISTER } from "../../../../../../types";
import { useState } from "react";

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

const TeacherForm: React.FC<IProps> = (props) => {
  const [teacherInfo, setTeacherInfo] =
    useState<T_APIRESULT_GET_TEACHER_INFO | null>(null);
  const [errMessage, setErrMessage] = useState<string>("");

  // const navigate = useNavigate();
  // const queryClient = useQueryClient();
  // const formMutation = useMutation({
  //   mutationFn: (
  //     formData: T_FORM_REGISTER_STUDENT,
  //   ): Promise<AxiosResponse<T_APIRESULT_REGISTER>> => {
  //     return apiRequestRegisterStudent(formData);
  //   },
  //   onError(err) {
  //     console.log(err);
  //     alert("Error, please refresh and try again");
  //   },
  //   onSuccess(data) {
  //     switch (data.data.result) {
  //     }
  //   },
  // });

  const teacherMutation = useMutation({
    mutationFn: (
      id: number,
    ): Promise<AxiosResponse<T_APIRESULT_GET_TEACHER_INFO>> => {
      return apiRequestGetTeacherInfo(id);
    },
    onError(err) {
      console.log(err);
      alert("Error, please refresh and try again");
    },
    onSuccess(data) {
      if (data.data.valid) {
        setTeacherInfo(data.data);
      } else {
        setErrMessage(
          `Teacher code '${props.formData.curr.teacher_id}' does not exist`,
        );
      }
    },
  });

  const form = useForm<T_FORM_REGISTER_STUDENT>({
    defaultValues: {
      ...INIT_FORM_REGISTER_STUDENT,
    },
    onSubmit: ({ value }) => {
      props.formData.set((curr) => {
        return {
          ...curr,
          teacher_id: Number.parseInt(value.teacher_id as string),
        };
      });

      teacherMutation.mutate(Number.parseInt(value.teacher_id as string));
    },
  });

  return (
    <div className={styles.root}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="teacher_id"
          children={(field) => (
            <>
              <h2>Teacher Code</h2>
              <input
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  errMessage !== "" && setErrMessage("");
                  teacherInfo && setTeacherInfo(null);
                  field.handleChange(e.target.value);
                }}
                className={
                  field.state.meta.errors.length > 0 ? styles.errInput : ""
                }
                type="number"
                inputMode="numeric"
              />
              {field.state.meta.errors.length > 0 ? (
                <div className={styles.err}>
                  {field.state.meta.errors.join(", ")}
                </div>
              ) : null}
              {<div style={{ color: "red" }}>{errMessage}</div>}
            </>
          )}
          validators={{
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
        <button type="submit">Submit</button>
      </form>
      {teacherInfo && (
        <>
          <div className={styles.teacher}>
            <div>
              {teacherInfo.first_name} {teacherInfo.last_name}
            </div>
            <div>{teacherInfo.school}</div>
          </div>
          <div className={styles.classes}>
            <label htmlFor="classes">Class</label>
            <select className={styles.classes} name="classes" id="classes">
              {teacherInfo.classes.map((c) => {
                return (
                  <option value={c.class_id} key={`$class-${c.class_id}`}>
                    {c.name}
                  </option>
                );
              })}
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherForm;
