import { useForm } from "@tanstack/react-form";
import {
  T_FORM_REGISTER_TEACHER,
  INIT_FORM_REGISTER_TEACHER,
} from "../../../../../../types/register";
import { useMutation } from "@tanstack/react-query";
import CHECK_USERNAME, { T_PARAMS, T_RES } from "../../../../../../api/routes/register/check_username";

const Locals = {
  useTeacherForm: (email: string) =>
    useForm<T_FORM_REGISTER_TEACHER>({
      defaultValues: {
        ...INIT_FORM_REGISTER_TEACHER,
      },
      onSubmit: ({ value }) => { },
    }),
  useCheckUsernameMutation: (
    setErrMessage: React.Dispatch<React.SetStateAction<string>>,
  ) =>
    useMutation({
      mutationFn: (params: T_PARAMS): Promise<T_RES> => CHECK_USERNAME(params),
      onError(err) {
        console.log(err);
        alert("Error, please refresh and try again");
      },
      onSuccess(data) {
        !data.valid && setErrMessage("Username already exists");
      },
    }),

};

export default Locals;
