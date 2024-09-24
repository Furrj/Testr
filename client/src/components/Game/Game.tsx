import { useEffect, useRef, useState } from "react";
import Settings from "./children/Settings/Settings";
import {
  E_GAME_LIMIT_TYPES,
  E_GAME_STATUS,
  INIT_GAME_SETTINGS,
  type T_GAME_SETTINGS,
} from "../../types/game";
import { deepCopyObject } from "../../utils/methods";
import {
  generateQuestions,
  T_QUESTION_RESULT,
  type T_QUESTION,
} from "../../types/questions";
import Active from "./children/Active/Active";
import Loading from "../Loading/Loading";
import Post from "./children/Post/Post";
import Locals from "./Locals";

const QUESTION_CHUNK_SIZE: number = 25;

const Game: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<E_GAME_STATUS>(
    E_GAME_STATUS.PRE,
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(1);
  const [questions, setQuestions] = useState<T_QUESTION[]>([]);
  const [limitType, setLimitType] = useState<E_GAME_LIMIT_TYPES>(
    E_GAME_LIMIT_TYPES.NULL,
  );
  const [timeInSeconds, setTimeInSeconds] = useState<number | null>(null);
  const [questionResults, setQuestionResults] = useState<T_QUESTION_RESULT[]>(
    [],
  );

  const gameSettings = useRef<T_GAME_SETTINGS>(
    deepCopyObject(INIT_GAME_SETTINGS),
  );
  const userGuesses = useRef<number[]>([]);

  // generate questions on ACTIVE &&
  // generate results on POST
  useEffect(() => {
    switch (gameStatus) {
      case E_GAME_STATUS.ACTIVE:
        switch (limitType) {
          case E_GAME_LIMIT_TYPES.COUNT:
            setQuestions(
              generateQuestions(
                gameSettings.current,
                gameSettings.current.limits.count,
              ),
            );
            break;
          case E_GAME_LIMIT_TYPES.TIME:
            setQuestions(
              generateQuestions(gameSettings.current, QUESTION_CHUNK_SIZE),
            );
            break;
        }
        break;
      case E_GAME_STATUS.POST:
        setQuestionResults(
          Locals.generateResults(userGuesses.current, questions),
        );
        break;
    }
  }, [gameStatus]);

  // check if more questions need to be generated,
  useEffect(() => {
    if (
      Math.abs(questions.length - currentQuestionIndex) < 5 &&
      limitType === E_GAME_LIMIT_TYPES.TIME
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
        <Settings
          gameSettings={gameSettings}
          setGameStatus={setGameStatus}
          setLimitType={setLimitType}
          timeInSeconds={{
            set: setTimeInSeconds as React.Dispatch<
              React.SetStateAction<number>
            >,
          }}
        />
      );
    case E_GAME_STATUS.ACTIVE:
      return questions.length > 0 && timeInSeconds !== null ? (
        <Active
          questions={questions}
          userGuesses={userGuesses}
          settings={gameSettings.current}
          limitType={limitType}
          gameStatus={{ set: setGameStatus }}
          currentQuestionIndex={{
            curr: currentQuestionIndex,
            set: setCurrentQuestionIndex,
          }}
          timeInSeconds={{
            curr: timeInSeconds,
            set: setTimeInSeconds as React.Dispatch<
              React.SetStateAction<number>
            >,
          }}
        />
      ) : (
        <Loading />
      );
    case E_GAME_STATUS.POST:
      return questionResults.length > 0 ? (
        <Post
          questions={questions}
          userGuesses={userGuesses.current}
          results={questionResults}
        />
      ) : (
        <Loading />
      );
  }
};

export default Game;
