import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../utils/consts";
import GET_USER_DATA, {
	type T_PARAMS,
} from "../api/routes/userData/getUserData";

export const useUserDataQuery = (params: T_PARAMS) =>
	useQuery({
		queryKey: [QUERY_KEYS.USER_DATA],
		queryFn: () => GET_USER_DATA(params),
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
		enabled: params.valid,
	});
