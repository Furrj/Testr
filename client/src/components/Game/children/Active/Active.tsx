import styles from "./Active.module.scss";
import { E_OPERATIONS, type T_QUESTION } from "../../../../types/questions";

function convertOperatorToDisplay(op: E_OPERATIONS): string {
  switch (op) {
    case E_OPERATIONS.ADD:
      return String.fromCharCode(0x002b);
    case E_OPERATIONS.SUB:
      return String.fromCharCode(0x2212);
    case E_OPERATIONS.MULT:
      return String.fromCharCode(0x00d7);
    case E_OPERATIONS.DIV:
      return String.fromCharCode(0x00f7);
  }

  return "";
}

interface IProps {
  questions: T_QUESTION[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  userAnswers: React.MutableRefObject<number[]>;
}

const Active: React.FC<IProps> = (props) => {
  const currQuestion = props.questions[props.currentQuestionIndex - 1];

  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <div className={styles.left}>
          <h2>{currQuestion.operands[0]}</h2>
        </div>
        <div className={styles.middle}>
          <h2>{convertOperatorToDisplay(currQuestion.operator)}</h2>
        </div>
        <div className={styles.right}>
          <h2>{currQuestion.operands[1]}</h2>
        </div>
      </div>
      <div className={styles.bottom}>
        <input type="number" name="userAnswer" />
      </div>
    </div>
  );
};

export default Active;
