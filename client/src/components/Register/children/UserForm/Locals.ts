import { useForm } from "@tanstack/react-form";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import REGISTER_USER, {
  T_PARAMS as T_REG_PARAMS,
  T_RES as T_REG_RES,
} from "../../../../api/routes/register/register_user";
import { E_REGISTER_RESULT } from "../../../../types";
import { T_FORM_REGISTER_USER, INIT_FORM_REGISTER_USER } from "../../../../types/register";

const Locals = {
  useSubmitForm: (
    submitMutation: UseMutationResult<
      T_REG_RES,
      Error,
      T_FORM_REGISTER_USER,
      unknown
    >,
  ) =>
    useForm<T_FORM_REGISTER_USER>({
      defaultValues: {
        ...INIT_FORM_REGISTER_USER,
      },
      onSubmit: ({ value }) => {
        const obj: T_FORM_REGISTER_USER = {
          username: value.username.trim(),
          password: value.password.trim(),
          confirm_password: value.confirm_password.trim(),
          first_name: value.first_name.trim(),
          last_name: value.last_name.trim(),
          email: value.email.trim(),
        };

        submitMutation.mutate({ ...obj });
      },
    }),
  useSubmitMutation: () =>
    useMutation({
      mutationFn: (params: T_REG_PARAMS) => REGISTER_USER(params),
      onError: () => alert("error, please try again"),
      onSuccess: (data) => {
        console.log(data);

        switch (data.result) {
          case E_REGISTER_RESULT.VALID:
            console.log("success");
            break;
          case E_REGISTER_RESULT.USERNAME_EXISTS:
            console.log("username exists");
            break;
          case E_REGISTER_RESULT.EMAIL_EXISTS:
            console.log("email exists");
            break;
          default:
            console.log("error");
        }
      },
    }),
};

export default Locals;
