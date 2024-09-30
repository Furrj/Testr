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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const formMutation = useMutation({
    mutationFn: (
      formData: T_FORM_REGISTER_STUDENT,
    ): Promise<AxiosResponse<T_APIRESULT_REGISTER>> => {
      return apiRequestRegisterStudent(formData);
    },
    onError(err) {
      console.log(err);
      alert("Error, please refresh and try again");
    },
    onSuccess(data) {
      switch (data.data.result) {
      }
    },
  });

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
      console.log(data.data);
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
    <form
      className={styles.root}
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
              onChange={(e) => field.handleChange(e.target.value)}
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
  );
};

export default TeacherForm;
