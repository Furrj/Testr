import { CardElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Locals from "./Locals";
import { E_MEMBERSHIP_TYPES } from "../../types/payment";

const KEY = import.meta.env.VITE_STRIPE_KEY;

const stripePromise = loadStripe(KEY);

const Payment: React.FC = () => {
	const createPaymentIntentMutation = Locals.useCreatePaymentIntentMutation();
	const deletePaymentIntentMutation = Locals.useDeletePaymentIntentMutation();

	const options = {
		clientSecret: "{{CLIENT_SECRET}}",
	};

	return (
		<Elements stripe={stripePromise}>
			<button
				onClick={() =>
					createPaymentIntentMutation.mutate({
						type: E_MEMBERSHIP_TYPES.BASIC,
					})
				}
			>
				Create Intent
			</button>

			<button
				onClick={() =>
					deletePaymentIntentMutation.mutate({
						id: 1,
					})
				}
			>
				Delete Intent
			</button>
			{/* <form> */}
			{/*   <CardElement /> */}
			{/*   <button type="submit">Submit</button> */}
			{/* </form> */}
		</Elements>
	);
};

export default Payment;
