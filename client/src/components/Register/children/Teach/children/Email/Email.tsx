import { useRef, useState } from "react";
import styles from "./Email.module.scss";
import Locals from "./Locals";

const Email: React.FC = () => {
	const ref = useRef<HTMLInputElement>(null);
	const [errAlreadyExists, setErrAlreadyExists] = useState<boolean>(false);

	const submitMutation = Locals.useSubmitMutation();
	if (submitMutation.isSuccess) {
		console.log(submitMutation.data);
		if (submitMutation.data.already_exists) {
			setErrAlreadyExists(true);
			submitMutation.reset();
			return;
		}
		return <div>You have been sent an email.</div>;
	} else if (submitMutation.isError)
		return <div>Error, please refresh and try again</div>;

	return (
		<div className={styles.root}>
			<div className={styles.scroll}>
				<h1>Step 1: Register Your Email</h1>

				<h2>
					<i>
						Submit a valid email address in the box below, and an email will be
						sent to the entered address with a validation link.
					</i>
				</h2>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();

						ref &&
							ref.current &&
							submitMutation.mutate({ email: ref.current.value.trim() });
					}}
				>
					<label htmlFor="email"></label>
					<input
						type="email"
						inputMode="email"
						id="email"
						name="email"
						ref={ref}
						required
					/>
					<button type="submit">Submit</button>
				</form>
			</div>
		</div>
	);
};

export default Email;
