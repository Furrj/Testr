import styles from "./ContentBox.module.scss";

interface IProps {
  children: React.ReactNode;
}

const ContentBox: React.FC<IProps> = (props) => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        {props.children}
        <div className={styles.spacer}></div>
      </div>
    </div>
  );
};

export default ContentBox;
