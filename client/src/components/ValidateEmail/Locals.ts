import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../utils/consts";
import VALIDATE_EMAIL, { T_PARAMS } from "../../api/routes/register/email/validate";

const Locals = {
  useValidateEmailQuery: (params: T_PARAMS) =>
    useQuery({
      queryKey: [QUERY_KEYS.EMAIL_VALIDATION_STATUS],
      queryFn: () => VALIDATE_EMAIL(params),
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }),
};

export default Locals;
