import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../utils/consts";
import GET_TEACHER_DATA, {
	type T_PARAMS as T_PARAMS_TEACHER_DATA,
} from "../../api/routes/teacherData/getTeacherData";

const Locals = {
	useTeacherDataQuery: (params: T_PARAMS_TEACHER_DATA, enabled: boolean) =>
		useQuery({
			queryKey: [QUERY_KEYS.TEACHER_DATA],
			queryFn: () => GET_TEACHER_DATA(params),
			retry: false,
			refetchOnWindowFocus: false,
			staleTime: Infinity,
			enabled,
		}),
};

export default Locals;
