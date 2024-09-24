import styles from "./Post.module.scss";
import type {
  T_QUESTION,
  T_QUESTION_RESULT,
} from "../../../../types/questions";

interface IProps {
  questions: T_QUESTION[];
  userGuesses: number[];
  results: T_QUESTION_RESULT[];
}

const Post: React.FC<IProps> = (props) => {
  console.log(props.results);

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        {props.results
          .filter(({ correct }) => !correct)
          .map((result) => {
            return (
              <div key={`question-${result.id}`} className={styles.incorrect}>
                #{result.id}: got {result.guess}, wanted {result.answer}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Post;
