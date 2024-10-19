import { QueryClient, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../../../utils/consts";
import DELETE_STUDENT, {
	T_PARAMS,
} from "../../../../../../api/routes/teacher/students/deleteStudent";
import { NavigateFunction } from "react-router-dom";

export enum E_MODES {
	DISPLAY = 0,
	EDITING,
	CONFIRM_DELETE,
	CONFIRM_EDIT,
}

const Locals = {
	useDeleteStudentMutation: (
		queryClient: QueryClient,
		navigate: NavigateFunction,
		classID: number,
	) =>
		useMutation({
			mutationFn: (params: T_PARAMS): Promise<Response> =>
				DELETE_STUDENT(params),
			onError(err) {
				console.log(err);
				alert("Error, please refresh and try again");
			},
			onSuccess() {
				queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEACHER_DATA] });
				navigate(`/teacher/class/${classID}`);
			},
		}),
};

export default Locals;
