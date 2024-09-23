import styles from "./Post.module.scss";
import type { T_QUESTION } from "../../../../types/questions";

interface IProps {
  questions: T_QUESTION[];
  userAnswers: number[];
}

const Post: React.FC<IProps> = (props) => {
  console.log(props.questions);
  console.log(props.userAnswers);

  return <div className={styles.root}>Post</div>;
};

export default Post;
