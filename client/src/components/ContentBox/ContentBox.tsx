import { useCtxUI } from "../../contexts/UIProvider";
import Overlay from "../Overlay/Overlay";
import styles from "./ContentBox.module.scss";

interface IProps {
	children: React.ReactNode;
}

const ContentBox: React.FC<IProps> = (props) => {
	const uiCtx = useCtxUI();

	return (
		<div className={styles.root}>
			{props.children}
			{uiCtx.overlay.curr.is_showing && <Overlay />}
		</div>
	);
};

export default ContentBox;
