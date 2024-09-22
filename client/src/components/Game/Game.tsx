import styles from "./Game.module.scss";
import { useState } from "react";
import Settings from "./children/Settings/Settings";
import { E_GAME_STATUS } from "../../types/game";

const Game: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<E_GAME_STATUS>(
    E_GAME_STATUS.PRE,
  );

	switch (gameStatus) {
		case E_GAME_STATUS.PRE:
			return (
				<div className={styles.root}>
					<Settings />
				</div>
			);
		case E_GAME_STATUS.ACTIVE:
		case E_GAME_STATUS.POST:
	}
};

export default Game;
