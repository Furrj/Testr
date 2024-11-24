import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client";
import QUERY_KEYS from "../../queryKeys";

const useGetUserInfoForClientQuery = () =>
	useQuery({
		queryKey: [QUERY_KEYS.USER_INFO],
		queryFn: async () =>
			await apiClient.GET("/api/user", { credentials: "include" }),
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});

// const useGetUserInfoForClientQuery = () =>
// 	useQuery({
// 		queryKey: [QUERY_KEYS.USER_INFO],
// 		queryFn: async () =>
// 			await fetch("http://localhost:5000/api/user", {
// 				method: "GET",
// 				credentials: "include",
// 			}),
// 		retry: false,
// 		refetchOnWindowFocus: false,
// 		staleTime: Infinity,
// 	});

export default useGetUserInfoForClientQuery;
