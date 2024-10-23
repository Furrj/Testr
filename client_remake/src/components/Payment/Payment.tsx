import {
	EmbeddedCheckout,
	EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Locals from "./Locals";
import { E_MEMBERSHIP_TYPES } from "../../types/payment";
import { useState } from "react";
import styles from "./Payment.module.scss";

const KEY = import.meta.env.VITE_STRIPE_KEY;

const stripePromise = loadStripe(KEY);

const Payment: React.FC = () => {
	const [clientSecret, setClientSecret] = useState<string | undefined>(
		undefined,
	);

	const createCheckoutSessionMutation =
		Locals.useCreateCheckoutSessionMutation(setClientSecret);

	if (clientSecret === undefined) {
		return (
			<button
				onClick={() =>
					createCheckoutSessionMutation.mutate({
						membership_type: E_MEMBERSHIP_TYPES.PREMIUM,
					})
				}
			>
				$10.00/month
			</button>
		);
	} else {
		return (
			<EmbeddedCheckoutProvider
				stripe={stripePromise}
				options={{ clientSecret }}
			>
				<div className={styles.root}>
					<div className={styles.scroll}>
						<EmbeddedCheckout id={styles.form} />
					</div>
				</div>
			</EmbeddedCheckoutProvider>
		);
	}
};

export default Payment;
