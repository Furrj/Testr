import styles from "./Assignments.module.scss";
import NewAssignment from "./children/NewAssignment/NewAssignment";

const Assignments: React.FC = () => {
  return (
    <div className={styles.root}>
      <button>Add</button>
      <NewAssignment />
    </div>
  );
};

export default Assignments;
