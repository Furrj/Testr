import { useMutation } from "@tanstack/react-query";
import { components } from "../../../types/schema";
import apiClient from "../../client";

// const useLoginMutation = () =>
// 	useMutation({
// 		mutationFn: async (params: components["schemas"]["LoginRequest"]) =>
// 			await fetch("http://localhost:5000/api/login", {
// 				method: "POST",
// 				body: JSON.stringify(params),
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 			}),
// 		onError: (err) => {
// 			console.log(err);
// 		},
// 		onSuccess: () => console.log("success"),
// 	});

const useLoginMutation = () =>
	useMutation({
		mutationFn: async (params: components["schemas"]["LoginRequest"]) =>
			await apiClient.POST("/api/login", {
				body: params,
			}),
	});

export default useLoginMutation;
