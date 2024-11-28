import { useQuery } from "@tanstack/react-query";
import apiClient from "../client";
import QUERY_KEYS from "../queryKeys";

const useGetUserInfoForClientQuery = useQuery({
	queryKey: [QUERY_KEYS.USER_INFO],
	queryFn: async () => await apiClient.GET("/api/user"),
	retry: 3,
	refetchOnWindowFocus: false,
	staleTime: Infinity,
});

export default useGetUserInfoForClientQuery;
