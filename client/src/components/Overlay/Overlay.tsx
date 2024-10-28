import { useCtxUI } from "../../contexts/UIProvider";
import styles from "./Overlay.module.scss";

const Overlay: React.FC = () => {
	const uiCtx = useCtxUI();

	return (
		<div className={styles.root}>
			<div className={styles.scroll}>{uiCtx.overlay.curr.element}</div>
		</div>
	);
};

export default Overlay;
