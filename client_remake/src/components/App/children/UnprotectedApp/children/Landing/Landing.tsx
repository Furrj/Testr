import styles from "./Landing.module.scss";

const Landing: React.FC = () => {
	return (
		<div className={styles.root}>
			<div className={styles.words}>
				<div>
					Help your students <span className={styles.accent}>master</span> math.
				</div>
			</div>
			<div className={styles.images}></div>
		</div>
	);
};

export default Landing;
