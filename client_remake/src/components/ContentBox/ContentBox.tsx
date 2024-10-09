import NavBar from "../App/children/NavBar/NavBar";
import styles from "./ContentBox.module.scss";

interface IProps {
	children: React.ReactNode;
}

const ContentBox: React.FC<IProps> = (props) => {
	return (
		<div className={styles.root}>
			<NavBar />
			<div className={styles.content}>{props.children}</div>
		</div>
	);
};

export default ContentBox;
