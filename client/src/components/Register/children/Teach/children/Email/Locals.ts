import { useMutation } from "@tanstack/react-query";
import SEND_VALIDATION_EMAIL, {
	T_PARAMS,
} from "../../../../../../api/routes/register/email/send";

const Locals = {
	useSubmitMutation: () =>
		useMutation({
			mutationFn: (params: T_PARAMS) => SEND_VALIDATION_EMAIL(params),
			onError: (err) => {
				console.log(err);
			},
			onSuccess() {
				console.log("success");
			},
		}),
};

export default Locals;
