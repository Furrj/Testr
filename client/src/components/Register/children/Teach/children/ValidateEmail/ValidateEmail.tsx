import { Link, useSearchParams } from "react-router-dom";
import styles from "./ValidateEmail.module.scss";
import Locals from "./Locals";
import Loading from "../../../../../Loading/Loading";

interface IProps {
  setEmail: React.Dispatch<React.SetStateAction<string>>
}

const ValidateEmail: React.FC<IProps> = (props) => {
  const [params] = useSearchParams();
  const code = params.get("code");
  const email = params.get("email");

  if (!code || code === "" || !email || email === "") {
    alert("error, please refresh");
    return;
  }

  const validateEmailQuery = Locals.useValidateEmailQuery({
    code,
    email,
  });

  if (validateEmailQuery.isFetching) {
    return <Loading />;
  } else if (
    validateEmailQuery.isSuccess &&
    validateEmailQuery.data !== undefined
  ) {
    if (validateEmailQuery.data.is_valid) {
      props.setEmail(validateEmailQuery.data.data.email)
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
