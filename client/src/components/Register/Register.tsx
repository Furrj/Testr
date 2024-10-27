import UserForm from "./children/UserForm/UserForm";
import styles from "./Register.module.scss"

const Register: React.FC = () => {
  return (
    <main className={styles.root}>
      <div className={styles.scroll}>
        <div>
          <h1>Step 1: Create Account</h1>
        </div>

        <div className={styles.form_wrapper}>
          <UserForm />
        </div>
      </div>
    </main>
  );

};

export default Register;
