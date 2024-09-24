import styles from "./Post.module.scss";
import type { T_QUESTION_RESULT } from "../../../../types/questions";
import { useMemo } from "react";

interface IProps {
  results: T_QUESTION_RESULT[];
  time: number;
}

const Post: React.FC<IProps> = (props) => {
  const correctCount = useMemo(
    () => props.results.filter(({ correct }) => correct).length,
    [props.results],
  );

  const score = Math.round((correctCount / props.results.length) * 100);

  return (
    <div className={styles.root}>
      <div className={styles.info}>
        <div className={styles.score}>
          <h2>{score}%</h2>
        </div>
        <div className={styles.ratio}>
          <h3>
            {correctCount}/{props.results.length}
          </h3>
        </div>
        <div className={styles.time}>
          <h3>1:00</h3>
        </div>
      </div>
      <div className={styles.results}>
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
