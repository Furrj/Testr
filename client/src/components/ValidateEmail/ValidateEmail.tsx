import styles from "./ValidateEmail.module.scss";
import Locals from "./Locals";
import { useSearchParams } from "react-router-dom";
import Loading from "../Loading/Loading";

const ValidateEmail: React.FC = () => {
  const [params] = useSearchParams();
  const code = params.get("code");
  const idStr = params.get("id") || "0"
  const id = Number.parseInt(idStr);

  if (!code || code === "" || !id || id === 0) {
    alert("error, please refresh");
    return;
  }

  const validateEmailQuery = Locals.useValidateEmailQuery({
    code,
    user_id: id,
  });

  if (validateEmailQuery.isFetching) {
    return <Loading />;
  } else if (
    validateEmailQuery.isSuccess &&
    validateEmailQuery.data !== undefined
  ) {
    if (validateEmailQuery.data.is_valid) {
      return <div>Valid!</div>;
    } else {
      return <div>This link is expired, please request a new one</div>;
    }
  } else return <div>Error, please reload</div>;
};

export default ValidateEmail;
