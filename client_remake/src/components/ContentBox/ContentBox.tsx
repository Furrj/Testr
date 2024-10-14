import NavBar from "../App/children/NavBar/NavBar";
import styles from "./ContentBox.module.scss";
import { useUserDataQuery } from "../../queries/userData";
import { useAuthCtx } from "../../contexts/AuthProvider";

interface IProps {
	children: React.ReactNode;
}

const ContentBox: React.FC<IProps> = (props) => {
	const authData = useAuthCtx();
	const { isSuccess, data } = useUserDataQuery(authData);

	return (
		<div className={styles.root}>
			{isSuccess && data.data.user_data && <NavBar />}
			<div className={styles.content}>{props.children}</div>
		</div>
	);
};

export default ContentBox;
