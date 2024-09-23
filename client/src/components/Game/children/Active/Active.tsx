import styles from "./Active.module.scss";
import type { T_QUESTION } from "../../../../types/questions";
import { useEffect, useRef, useState } from "react";
import Locals from "./Locals";
import {
  E_GAME_LIMIT_TYPES,
  E_GAME_STATUS,
  type T_GAME_SETTINGS,
} from "../../../../types/game";

interface IProps {
  questions: T_QUESTION[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  userAnswers: React.MutableRefObject<number[]>;
  settings: T_GAME_SETTINGS;
  setGameStatus: React.Dispatch<React.SetStateAction<E_GAME_STATUS>>;
  limitType: E_GAME_LIMIT_TYPES;
  timeInSeconds: number;
  setTimeInSeconds: React.Dispatch<React.SetStateAction<number>>;
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
  useEffect(() => {
    const interval = setInterval(() => {
      props.setTimeInSeconds((prevSeconds) =>
        props.limitType === E_GAME_LIMIT_TYPES.TIME
          ? prevSeconds - 1
          : prevSeconds + 1,
      );
    }, 1000);

    // clean up on unmount
    return () => clearInterval(interval);
  }, []);

  // check for end of game if using time limits
  useEffect(() => {
    if (
      props.limitType === E_GAME_LIMIT_TYPES.TIME &&
      props.timeInSeconds < 1
    ) {
      props.setGameStatus(E_GAME_STATUS.POST);
    }
  }, [props.timeInSeconds]);

  return (
    <div className={styles.root}>
      <div className={styles.info}>
        <div className={styles.number}>
          # {props.currentQuestionIndex}
          {props.limitType === E_GAME_LIMIT_TYPES.COUNT &&
            `/${props.settings.limits.count}`}
        </div>
        <div
          className={styles.timer}
          style={{
            color:
              props.timeInSeconds < 10 &&
              props.limitType === E_GAME_LIMIT_TYPES.TIME
                ? "red"
                : "",
          }}
        >
          {Locals.formatTime(props.timeInSeconds)}
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
                // submit answer
                if (inputRef.current?.value !== "") {
                  props.userAnswers.current.push(e.currentTarget.valueAsNumber);

                  // if last question set gameState to 'post' else increase index
                  if (
                    props.limitType === E_GAME_LIMIT_TYPES.COUNT &&
                    props.currentQuestionIndex >= props.settings.limits.count
                  ) {
                    props.setGameStatus(E_GAME_STATUS.POST);
                  } else props.setCurrentQuestionIndex((curr) => curr + 1);
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
