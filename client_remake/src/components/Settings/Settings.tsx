import styles from "./Settings.module.scss";

const Settings: React.FC = () => {
	return (
		<section className={styles.root}>
			<div className={styles.scroll}>
				<section className={styles.content}>
					<div>
						<h1>Settings</h1>
					</div>
					<div>
						<h2>Game</h2>
						<div className={styles.inputs}>
							<div>
								<label htmlFor="vertical">Vertical Layout</label>
								<input type="checkbox" name="vertical" id="vertical" />
							</div>
						</div>
					</div>
				</section>
			</div>
		</section>
	);
};

export default Settings;
