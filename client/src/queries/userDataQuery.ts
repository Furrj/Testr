import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../utils/consts";
import GET_USER_DATA, { type T_PARAMS } from "../api/routes/user/getUserData";

const useUserDataQuery = (params: T_PARAMS | undefined) =>
	useQuery({
		queryKey: [QUERY_KEYS.USER_DATA],
		queryFn: () => GET_USER_DATA(params as T_PARAMS),
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
		enabled: params !== undefined,
	});

export default useUserDataQuery;
