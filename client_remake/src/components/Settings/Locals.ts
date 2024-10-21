import { useMutation } from "@tanstack/react-query";
import UPDATE_VERTICAL_PREF from "../../api/routes/user/updateVerticalPref";
import { T_TOKENS } from "../../types";

const Locals = {
	useUpdateVerticalPrefMutation: (tokens: T_TOKENS) =>
		useMutation({
			mutationFn: (vertical: boolean) =>
				UPDATE_VERTICAL_PREF({ tokens, vertical }),
			onError(err: any) {
				console.log(err);
			},
		}),
};

export default Locals;
