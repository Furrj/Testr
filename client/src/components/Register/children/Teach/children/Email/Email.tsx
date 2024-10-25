import { useRef } from "react";
import styles from "./Email.module.scss";
import Locals from "./Locals";

const Email: React.FC = () => {
	const ref = useRef<HTMLInputElement>(null);

	const submitMutation = Locals.useSubmitMutation();

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
						pattern="/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/"
						required
					/>
					<button type="submit">Submit</button>
				</form>
			</div>
		</div>
	);
};

export default Email;

