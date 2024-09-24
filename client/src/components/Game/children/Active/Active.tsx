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
  userGuesses: React.MutableRefObject<number[]>;
  settings: T_GAME_SETTINGS;
  limitType: E_GAME_LIMIT_TYPES;
  gameStatus: {
    set: React.Dispatch<React.SetStateAction<E_GAME_STATUS>>;
  };
  currentQuestionIndex: {
    curr: number;
    set: React.Dispatch<React.SetStateAction<number>>;
  };
  timeInSeconds: {
    curr: number;
    set: React.Dispatch<React.SetStateAction<number>>;
  };
}

const Active: React.FC<IProps> = (props) => {
  const [inputErr, setInputErr] = useState<boolean>(false);

  const currQuestion = props.questions[props.currentQuestionIndex.curr - 1];
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
  }, [props.currentQuestionIndex.curr]);

  // setup timer
  useEffect(() => {
    const interval = setInterval(() => {
      props.timeInSeconds.set((prevSeconds) =>
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
      props.timeInSeconds.curr < 1
    ) {
      props.gameStatus.set(E_GAME_STATUS.POST);
    }
  }, [props.timeInSeconds]);

  return (
    <div className={styles.root}>
      <div className={styles.info}>
        <div className={styles.number}>
          # {props.currentQuestionIndex.curr}
          {props.limitType === E_GAME_LIMIT_TYPES.COUNT &&
            `/${props.settings.limits.count}`}
        </div>
        <div
          className={styles.timer}
          style={{
            color:
              props.timeInSeconds.curr < 10 &&
              props.limitType === E_GAME_LIMIT_TYPES.TIME
                ? "red"
                : "",
          }}
        >
          {Locals.formatTime(props.timeInSeconds.curr)}
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
                  props.userGuesses.current.push(e.currentTarget.valueAsNumber);

                  // if last question set gameState to 'post' else increase index
                  if (
                    props.limitType === E_GAME_LIMIT_TYPES.COUNT &&
                    props.currentQuestionIndex.curr >=
                      props.settings.limits.count
                  ) {
                    props.gameStatus.set(E_GAME_STATUS.POST);
                  } else {
                    props.currentQuestionIndex.set((curr) => curr + 1);
                  }
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
