import { useMutation } from "@tanstack/react-query";
import CREATE_PAYMENT_INTENT, {
	T_PARAMS,
	T_RES,
} from "../../api/routes/stripe/createPaymentIntent";

const Locals = {
	useCreatePaymentIntentMutation: () =>
		useMutation({
			mutationFn: (params: T_PARAMS) => CREATE_PAYMENT_INTENT(params),
			onError: (err) => {
				console.log(err);
				alert("Error occured, please refresh");
			},
			onSuccess: (data: T_RES) => {
				console.log(data.client_secret);
			},
		}),
};

export default Locals;
