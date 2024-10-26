import styles from "./Account.module.scss";
import TeacherForm from "../TeacherForm/TeacherForm";
import { Navigate } from "react-router-dom";

interface IProps {
  email: string;
}

const Account: React.FC<IProps> = (props) => {
  if (props.email === "") {
    return <Navigate to={"/"} replace />
  } else {
    return (
      <main className={styles.root}>
        <div className={styles.scroll}>
          <div>
            <h1>Create Account</h1>
          </div>

          <div className={styles.form_wrapper}>
            <TeacherForm {...props} />
          </div>
        </div>
      </main>
    );
  }
};

export default Account;
