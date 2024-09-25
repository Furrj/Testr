import styles from "./PastTest.module.scss";
import { E_OPERATIONS, type T_GAME_SESSION } from "../../types/game";
import UIHandlers from "../../utils/uiHandlers";

function formatUnixEpoch(epochSeconds: number): string {
  const date = new Date(epochSeconds * 1000); // Convert seconds to milliseconds
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function getDisplayOps(session: T_GAME_SESSION): string[] {
  const out: string[] = [];

  if (session.add) {
    out.push(UIHandlers.convertOperatorToDisplay(E_OPERATIONS.ADD));
  }
  if (session.sub) {
    out.push(UIHandlers.convertOperatorToDisplay(E_OPERATIONS.SUB));
  }
  if (session.mult) {
    out.push(UIHandlers.convertOperatorToDisplay(E_OPERATIONS.MULT));
  }
  if (session.div) {
    out.push(UIHandlers.convertOperatorToDisplay(E_OPERATIONS.DIV));
  }

  return out;
}

interface IProps {
  session: T_GAME_SESSION;
}

const PastTest: React.FC<IProps> = (props) => {
  return (
    <div className={styles.root}>
      <div>
        {props.session.timestamp !== undefined &&
          formatUnixEpoch(props.session.timestamp)}
      </div>
      <div>
        {props.session.min} - {props.session.max}
      </div>
      <div>{UIHandlers.formatTime(props.session.time)}</div>
      <div>{props.session.score}%</div>
      <div>
        {props.session.correct_count}/{props.session.questions_count}
      </div>
      <div>{getDisplayOps(props.session).join(", ")}</div>
    </div>
  );
};

export default PastTest;
