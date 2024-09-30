import styles from "./Class.module.scss";

interface IProps {
  id: number;
}

const Class: React.FC<IProps> = (props) => {
  console.log(props.id);

  return <div className={styles.root}>Class</div>;
};

export default Class;
