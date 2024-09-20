import styles from "./ContentBox.module.scss";

interface IProps {
  children: React.ReactNode;
}

const ContentBox: React.FC<IProps> = (props) => {
  return <div className={styles.root}>{props.children}</div>;
};

export default ContentBox;
