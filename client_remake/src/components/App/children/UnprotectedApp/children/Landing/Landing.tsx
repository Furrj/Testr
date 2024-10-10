import styles from "./Landing.module.scss";

const Landing: React.FC = () => {
	return (
		<div className={styles.root}>
			<div className={styles.words}>
				<div>
					Help your students <span className={styles.accent}>master</span> math.
				</div>
			</div>

			<div className={styles.get_started}>
				<div>Get Started</div>
			</div>
		</div>
	);
};

export default Landing;
