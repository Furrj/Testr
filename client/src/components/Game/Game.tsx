import styles from "./Game.module.scss";
import { useEffect, useRef, useState } from "react";
import Settings from "./children/Settings/Settings";
import {
  E_GAME_STATUS,
  INIT_GAME_SETTINGS,
  type T_GAME_SETTINGS,
} from "../../types/game";
import { deepCopyObject } from "../../utils/methods";
import { generateQuestions, type T_QUESTION } from "../../types/questions";
import Active from "./children/Active/Active";
import Loading from "../Loading/Loading";

const QUESTION_CHUNK_SIZE: number = 25;

const Game: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<E_GAME_STATUS>(
    E_GAME_STATUS.PRE,
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(1);
  const [questions, setQuestions] = useState<T_QUESTION[]>([]);

  const gameSettings = useRef<T_GAME_SETTINGS>(
    deepCopyObject(INIT_GAME_SETTINGS),
  );
  const userAnswers = useRef<number[]>([]);

  // generate questions on status change to active
  useEffect(() => {
    if (gameStatus === E_GAME_STATUS.ACTIVE) {
      if (gameSettings.current.limits.count > 0) {
        setQuestions(
          generateQuestions(
            gameSettings.current,
            gameSettings.current.limits.count,
          ),
        );
      } else {
        setQuestions(
          generateQuestions(gameSettings.current, QUESTION_CHUNK_SIZE),
        );
      }
    }
  }, [gameStatus]);

  // check if more questions need to be generated
  useEffect(() => {
    if (
      Math.abs(currentQuestionIndex - questions.length) < 5 &&
      gameSettings.current.limits.time > 0
    ) {
      setQuestions((curr) => {
        curr.push(
          ...generateQuestions(gameSettings.current, QUESTION_CHUNK_SIZE),
        );
        return curr;
      });
    }
  }, [currentQuestionIndex]);

  switch (gameStatus) {
    case E_GAME_STATUS.PRE:
      return (
        <div className={styles.root}>
          <Settings gameSettings={gameSettings} setGameStatus={setGameStatus} />
        </div>
      );
    case E_GAME_STATUS.ACTIVE:
      return questions.length > 0 ? (
        <div className={styles.root}>
          <Active
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            questions={questions}
            userAnswers={userAnswers}
          />
        </div>
      ) : (
        <Loading />
      );
    case E_GAME_STATUS.POST:
  }
};

export default Game;
