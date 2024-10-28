import { useQueryClient } from "@tanstack/react-query";
import Locals from "./Locals";
import styles from "./Settings.module.scss";
import { useCtxUser } from "../../contexts/UserProvider";

const Settings: React.FC = () => {
	const queryClient = useQueryClient();

	const user = useCtxUser();
	const userData = user.user.curr;

	const updateVerticalPrefMutation = Locals.useUpdateVerticalPrefMutation(
		queryClient,
		userData.tokens,
	);

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
								<input
									type="checkbox"
									name="vertical"
									id="vertical"
									defaultChecked={userData.vertical}
									onChange={(e) =>
										updateVerticalPrefMutation.mutate(e.target.checked)
									}
								/>
							</div>
						</div>
					</div>
				</section>
			</div>
		</section>
	);
};

export default Settings;
