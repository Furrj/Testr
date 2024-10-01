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

const QUESTION_CHUNK_SIZE: number = 10;

interface IProps {
  vertical: boolean;
}

const Game: React.FC<IProps> = (props) => {
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

  function restartGame(status: E_GAME_STATUS): void {
    setCurrentQuestionIndex(1);
    setGameStatus(status);
    setTimeInSeconds(() =>
      limitType === E_GAME_LIMIT_TYPES.TIME
        ? gameSettings.current.limits.time
        : 0,
    );
    setQuestionResults([]);
    setQuestions([]);
    userGuesses.current = [];
  }

  // generate questions on ACTIVE &&
  // generate results on POST
  useEffect(() => {
    switch (gameStatus) {
      case E_GAME_STATUS.ACTIVE:
        switch (limitType) {
          case E_GAME_LIMIT_TYPES.COUNT:
            setQuestions((curr) =>
              generateQuestions(
                gameSettings.current,
                gameSettings.current.limits.count,
                curr.length !== undefined ? curr.length : 0,
              ),
            );
            break;
          case E_GAME_LIMIT_TYPES.TIME:
            setQuestions((curr) =>
              generateQuestions(
                gameSettings.current,
                QUESTION_CHUNK_SIZE,
                curr.length !== undefined ? curr.length : 0,
              ),
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

  // check if more questions need to be generated while in active mode
  useEffect(() => {
    if (
      gameStatus === E_GAME_STATUS.ACTIVE &&
      Math.abs(questions.length - currentQuestionIndex) < 5 &&
      limitType === E_GAME_LIMIT_TYPES.TIME
    ) {
      setQuestions((curr) => {
        curr.push(
          ...generateQuestions(
            gameSettings.current,
            QUESTION_CHUNK_SIZE,
            curr.length !== undefined ? curr.length : 0,
          ),
        );
        return curr;
      });
    }
  }, [currentQuestionIndex, gameStatus]);

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
          vertical={props.vertical}
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
      return questionResults.length > 0 &&
        timeInSeconds !== null &&
        gameSettings.current !== undefined ? (
        <Post
          results={questionResults}
          time={timeInSeconds}
          settings={gameSettings.current}
          limitType={limitType}
          gameStatus={{ curr: gameStatus, set: setGameStatus }}
          currentQuestionIndex={{
            curr: currentQuestionIndex,
            set: setCurrentQuestionIndex,
          }}
          timeInSeconds={{ curr: timeInSeconds, set: setTimeInSeconds }}
          restartGame={restartGame}
        />
      ) : (
        <Loading />
      );
  }
};

export default Game;
