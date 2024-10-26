import { useMutation } from "@tanstack/react-query";
import SUBMIT_TEACHER_EMAIL, {
	T_PARAMS,
} from "../../../../../../api/routes/register/email/submit";

const Locals = {
	useSubmitMutation: () =>
		useMutation({
			mutationFn: (params: T_PARAMS) => SUBMIT_TEACHER_EMAIL(params),
			onError: (err) => {
				console.log(err);
			},
			onSuccess() {
				console.log("success");
			},
		}),
};

export default Locals;
