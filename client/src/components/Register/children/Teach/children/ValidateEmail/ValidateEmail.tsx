import { Link, useSearchParams } from "react-router-dom";
import styles from "./ValidateEmail.module.scss";
import Locals from "./Locals";
import Loading from "../../../../../Loading/Loading";

const ValidateEmail: React.FC = () => {
  const [params] = useSearchParams();
  const code = params.get("code");
  const idStr = params.get("id") || "0";

  const id = Number.parseInt(idStr);

  if (!code || code === "" || !id || id === 0) {
    alert("error, please refresh");
    return;
  }

  const validateEmailQuery = Locals.useValidateEmailQuery({
    code,
    id,
  });

  if (validateEmailQuery.isFetching) {
    return <Loading />;
  } else if (
    validateEmailQuery.isSuccess &&
    validateEmailQuery.data !== undefined
  ) {
    if (validateEmailQuery.data.is_valid) {
      console.log(validateEmailQuery.data)
      return (
        <main className={styles.root}>
          <div className={styles.scroll}>
            <h1>
              Thank you for validating your email address! Click on the button
              below to create your account and start your free trial.
            </h1>

            <Link to={"/register/teacher/account"} className="link">
              <button>Create Account</button>
            </Link>
          </div>
        </main>
      );
    } else {
      return <div>This link is expired, please request a new one</div>;
    }
  } else return <div>Error, please reload</div>;
};

export default ValidateEmail;
