import styles from "./Overlay.module.scss";

interface IProps {
	children: React.ReactNode;
}

const Overlay: React.FC<IProps> = (props) => {
	return (
		<div className={styles.root}>
			<div className={styles.scroll}>{props.children}</div>
		</div>
	);
};

export default Overlay;
