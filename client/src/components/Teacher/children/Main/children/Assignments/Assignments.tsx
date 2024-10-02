import { T_CLASS } from "../../../../../Register/Register";
import styles from "./Assignments.module.scss";
import NewAssignment from "./children/NewAssignment/NewAssignment";

interface IProps {
  classes: T_CLASS[];
}

const Assignments: React.FC<IProps> = (props) => {
  return (
    <div className={styles.root}>
      <button>Add</button>
      <NewAssignment {...props} />
    </div>
  );
};

export default Assignments;
