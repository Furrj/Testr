import { useRef, useState } from "react";
import styles from "./Classes.module.scss";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import {
	apiRequestAddClass,
	apiRequestGetClasses,
	I_PARAMS_APIREQUEST_ADD_CLASS,
} from "../../../../../requests";
import { Link } from "react-router-dom";
import { QUERY_KEYS } from "../../../../utils/consts";
import { getUserSessionDataFromStorage } from "../../../../utils/methods";
import type { T_CLASS } from "../../../Register/Register";
import Loading from "../../../Loading/Loading";
import { DiVim } from "react-icons/di";

const Classes: React.FC<IProps> = (props) => {
	const [addingMode, setAddingMode] = useState<boolean>(false);

	const inputRef = useRef<HTMLInputElement>(null);

	const queryClient = useQueryClient();
	const { isFetching, isSuccess, data } = useQuery({
		queryKey: [QUERY_KEYS.CLASSES],
		queryFn: () => apiRequestGetClasses(getUserSessionDataFromStorage()),
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: Infinity,
	});

	const mutation = useMutation({
		mutationFn: (
			params: I_PARAMS_APIREQUEST_ADD_CLASS,
		): Promise<AxiosResponse> => {
			return apiRequestAddClass(params);
		},
		onError(err) {
			console.log(err);
			alert("Error, please refresh and try again");
		},
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLASSES] });
		},
	});

	if (isSuccess && data) {
		return (
			<div className={styles.root}>
				<div className={styles.scroll}>
					<div className={`${styles.row} ${styles.headers}`}>
						<div className={styles.classes}>
							<h3>My Classes</h3>
						</div>

						<div className={styles.students}>
							<h3>Students</h3>
						</div>
					</div>

					{data.data.length > 0 ? (
						data.data.map((c) => {
							return (
								<div key={`class-${c.class_id}`} className={styles.row}>
									<div className={styles.classes}>{c.name}</div>

									<div className={styles.students}>{c.class_id}</div>
								</div>
							);
						})
					) : (
						<div>No classes</div>
					)}
				</div>
			</div>
		);
	} else if (isFetching) {
		return <Loading />;
	} else return <div>Error, please refresh</div>;
};

export default Classes;
