import styles from "./Active.module.scss";
import type { T_QUESTION } from "../../../../types/questions";
import { useEffect, useRef, useState } from "react";
import Locals from "./Locals";
import type { T_GAME_SETTINGS } from "../../../../types/game";

interface IProps {
  questions: T_QUESTION[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  userAnswers: React.MutableRefObject<number[]>;
  settings: T_GAME_SETTINGS;
}

const Active: React.FC<IProps> = (props) => {
  const [inputErr, setInputErr] = useState<boolean>(false);

  const currQuestion = props.questions[props.currentQuestionIndex - 1];
  const inputRef = useRef<HTMLInputElement>(null);

  // focus on input box on page load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  // reset input value and err on new question load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputErr && setInputErr(false);
    }
  }, [props.currentQuestionIndex]);

  // setup timer
  const [timeInSeconds, setTimeInSeconds] = useState(
    props.settings.limits.time > 0 ? props.settings.limits.time : 0,
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeInSeconds((prevSeconds) =>
        props.settings.limits.time > 0 ? prevSeconds - 1 : prevSeconds + 1,
      );
    }, 1000);

    // clean up on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.info}>
        <div className={styles.number}>
          # {props.currentQuestionIndex}
          {props.settings.limits.count > 0 && `/${props.settings.limits.count}`}
        </div>
        <div
          className={styles.timer}
          style={{
            color:
              timeInSeconds < 10 && props.settings.limits.time > 0 ? "red" : "",
          }}
        >
          {Locals.formatTime(timeInSeconds)}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.left}>
            <h2>{currQuestion.operands[0]}</h2>
          </div>
          <div className={styles.middle}>
            <h2>{Locals.convertOperatorToDisplay(currQuestion.operator)}</h2>
          </div>
          <div className={styles.right}>
            <h2>{currQuestion.operands[1]}</h2>
          </div>
        </div>
        <div className={styles.bottom}>
          <input
            className={inputErr ? styles.err : ""}
            type="number"
            name="userAnswer"
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (inputRef.current?.value !== "") {
                  Locals.submitAnswer(
                    e.currentTarget.valueAsNumber,
                    props.userAnswers,
                    props.setCurrentQuestionIndex,
                  );
                } else setInputErr(true);
              }
            }}
            onChange={() => inputErr && setInputErr(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Active;
