import { useMutation } from "@tanstack/react-query";
import CREATE_PAYMENT_INTENT, {
	T_PARAMS as T_PARAMS_CREATE,
	T_RES as T_RES_CREATE,
} from "../../api/routes/stripe/createPaymentIntent";
import DELETE_PAYMENT_INTENT, {
	T_PARAMS as T_PARAMS_DELETE,
} from "../../api/routes/stripe/deletePaymentIntent";
import CREATE_CHECKOUT_SESSION, {
	T_PARAMS as T_PARAMS_CHECKOUT,
	T_RES as T_RES_CHECKOUT,
} from "../../api/routes/stripe/createCheckoutSession";

const Locals = {
	useCreatePaymentIntentMutation: () =>
		useMutation({
			mutationFn: (params: T_PARAMS_CREATE) => CREATE_PAYMENT_INTENT(params),
			onError: (err) => {
				console.log(err);
				alert("Error occured, please refresh");
			},
			onSuccess: (data: T_RES_CREATE) => {
				console.log(data.client_secret);
			},
		}),
	useDeletePaymentIntentMutation: () =>
		useMutation({
			mutationFn: (params: T_PARAMS_DELETE) => DELETE_PAYMENT_INTENT(params),
			onError: (err) => {
				console.log(err);
				alert("Error occured, please refresh");
			},
			onSuccess: () => {
				console.log("success");
			},
		}),
	useCreateCheckoutSessionMutation: (
		setClientSecret: React.Dispatch<React.SetStateAction<string | undefined>>,
	) =>
		useMutation({
			mutationFn: (params: T_PARAMS_CHECKOUT) =>
				CREATE_CHECKOUT_SESSION(params),
			onError: (err) => {
				console.log(err);
				alert("Error occured, please refresh");
			},
			onSuccess: (data: T_RES_CHECKOUT) => {
				console.log(data.client_secret);
				setClientSecret(data.client_secret);
			},
		}),
};

export default Locals;
