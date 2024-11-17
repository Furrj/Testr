import { useCtxUI } from "../../contexts/UIProvider";
import styles from "./Overlay.module.scss";
import { MdCancel } from "react-icons/md";

const Overlay: React.FC = () => {
	const uiCtx = useCtxUI();

	return (
		<div className={styles.root}>
			<div className={styles.scroll}>
				{uiCtx.overlay.curr.element}

				<MdCancel
					id={styles.cancel}
					onClick={() =>
						uiCtx.overlay.set(() => {
							return {
								element: <></>,
								is_showing: false,
							};
						})
					}
				/>
			</div>
		</div>
	);
};

export default Overlay;
