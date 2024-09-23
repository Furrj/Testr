import styles from "./Game.module.scss";
import { useEffect, useRef, useState } from "react";
import Settings from "./children/Settings/Settings";
import {
  E_GAME_STATUS,
  INIT_GAME_SETTINGS,
  T_GAME_SETTINGS,
} from "../../types/game";
import { deepCopyObject } from "../../utils/methods";
import { generateQuestions, T_QUESTION } from "../../types/questions";

const Game: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<E_GAME_STATUS>(
    E_GAME_STATUS.PRE,
  );
  const [gameSettings, setGameSettings] = useState<T_GAME_SETTINGS>(
    deepCopyObject(INIT_GAME_SETTINGS),
  );
  const questions = useRef<T_QUESTION[]>([]);

  useEffect(() => {
    if (gameStatus === E_GAME_STATUS.ACTIVE) {
      questions.current = generateQuestions(gameSettings, 10);
      console.log(questions.current);
    }
  }, [gameStatus]);

  switch (gameStatus) {
    case E_GAME_STATUS.PRE:
      return (
        <div className={styles.root}>
          <Settings
            setGameSettings={setGameSettings}
            setGameStatus={setGameStatus}
          />
        </div>
      );
    case E_GAME_STATUS.ACTIVE:
      return <div className={styles.root}>Active</div>;
    case E_GAME_STATUS.POST:
  }
};

export default Game;
