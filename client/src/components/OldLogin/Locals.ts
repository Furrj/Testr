import { QueryClient, useMutation } from "@tanstack/react-query";
import LOGIN, { T_PARAMS, T_RES } from "../../api/routes/login/login";
import { sendTokensToLocalStorage } from "../../utils/methods";
import { T_TOKENS } from "../../types/auth";

const Locals = {
	useLoginMutation: (
		setTokens: React.Dispatch<React.SetStateAction<T_TOKENS | undefined>>,
		setIncorrectInfo: React.Dispatch<React.SetStateAction<boolean>>,
		queryClient: QueryClient,
	) =>
		useMutation({
			mutationFn: (params: T_PARAMS): Promise<T_RES> => LOGIN(params),
			onError(err) {
				console.log(err);
			},
			// TODO: handle error vs incorrect info
			onSuccess(data) {
				if (data.valid) {
					sendTokensToLocalStorage(data.tokens);
					setTokens(data.tokens);
					queryClient.resetQueries();
				} else {
					setIncorrectInfo(true);
				}
			},
		}),
};

export default Locals;
