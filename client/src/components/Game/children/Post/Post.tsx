import styles from "./Post.module.scss";
import type { T_QUESTION } from "../../../../types/questions";

interface IProps {
  questions: T_QUESTION[];
  userAnswers: number[];
}

function generateIncorrectQuestionComponents(
  questions: T_QUESTION[],
  userAnswers: number[],
): JSX.Element[] {
  const out: JSX.Element[] = [];

  userAnswers.forEach((a, i) => {
    if (a !== questions[i].result) {
      out.push(
        <div key={`question-${i + 1}`} className={styles.incorrect}>
          #{i + 1}: got {a}, wanted {questions[i].result}
        </div>,
      );
    }
  });

  return out;
}

const Post: React.FC<IProps> = (props) => {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        {generateIncorrectQuestionComponents(
          props.questions,
          props.userAnswers,
        )}
      </div>
    </div>
  );
};

export default Post;
